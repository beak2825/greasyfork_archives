// ==UserScript==
// @name         DE King
// @namespace    http://tampermonkey.net/
// @version      0.4.7
// @description  try to take over the world!
// @author       Beruska
// @match        https://www.darkelf.cz/world.htm
// @grant        none
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @resource https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/395663/DE%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/395663/DE%20King.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function DEKing()
{

    this._options;

    this._dataProvider = new DEKingDataProvider();
    this._ajaxProvider = new DEKingAjaxProvider();
    this._storageProvider;
    this._renderer;
    this._textParser;

    this._userData;


	this.init = function(){

        //this._initBasic();
        this._initExtend();

	};

    this._initBasic = function(){
        var that = this;
        that._textParser = new DEKingParser(that._dataProvider);
        that._storageProvider = new DEKingStorageProvider();
        that._options = that._storageProvider.getOptions();

        $('frame[name="mapa"]').on('load', function(){ that.initMap(); });
        $('frame[name="Lista_Vlevo"]').on('load', function(){ that.initLeftFrame(); });
    };

    this._initExtend = function(){
        this._showLoading();
        var that = this;

        this._ajaxProvider.getReport(null, function(report){
            that._textParser = new DEKingParser(that._dataProvider);
            that._userData = that._textParser.getUserData(report);
            that._storageProvider = new DEKingStorageProvider(that._userData.user, that._userData.league, that._userData.day);
            that._options = that._storageProvider.getOptions();

            var reportLands = {};
            that._textParser.parseReport(report, reportLands, null);


            // tak jo, koukneme jestli jsme v ali
            that._ajaxProvider.getMyAliMates(function(myMates){
                var myMatesCount = myMates.length;

                if(myMatesCount > 0){

                    var cachedReportLands = that._storageProvider.getReport();

                    if (cachedReportLands == null){
                        reportLands = {};
                        for (var i in myMates){
                            var mate = myMates[i];

                            that._ajaxProvider.getReport(mate.id, function(report){
                                that._textParser.parseReport(report, reportLands, myMates);
                                myMatesCount--;
                                if (myMatesCount == 0)
                                    that.___finishExtendInit(reportLands);
                            });

                        }
                    }
                    else{
                        that.___finishExtendInit(cachedReportLands);
                    }

                }
                else
                    that.___finishExtendInit(reportLands);


            });



        });
    };

    this.___finishExtendInit = function(reportLands){
        var that = this;

        this._storageProvider.saveReport(reportLands);

        $('frame[name="mapa"]').on('load', function(){ that.initMap(); });
        $('frame[name="Lista_Vlevo"]').on('load', function(){ that.initLeftFrame(); });



        that._renderer = new DEKingExtendRenderer(that._storageProvider, that._options, reportLands);

        setTimeout(function(){

        $('frame[name="lista_informace"]').contents().find('img[src="images/s/refresh.gif"]').click();
        },0);
        that._hideLoading();

    };




    this._extendMapData;
    this._aliMatesData;



	this.lands = [];
	this.landDivs;

	this.initMap = function(){

		var worldMap = $('frame[name="mapa"]').contents();

        $(worldMap).find('head').append('<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />');

        $(worldMap).find('head').append('<style type="text/css">.ui-dialog div{ width: 270px; height: 5px; position: relative; }</style>');

        this._initCommonThings(worldMap);
        if ($(worldMap).find('form[name="form_domy"]').length>0){
            if ($(worldMap).find('form[name="form_domy"]').find('td[colspan="9"]').length >0){ //omg toto.. to proste jinak neurcim.. stejnej nazev, vsechno :/
                this._initHouses(worldMap);
            }
            else{
                this._initMagicUnitsBuy(worldMap);
            }
        }
        if ($(worldMap).find('form[name="form_buildings"]').length>0){
            this._initBuildings(worldMap);
        }
        else{
            this._initMapMagic(worldMap);
        }
	};

    this._initCommonThings = function(worldMap) {
        // =======================================================================================================================
        var that = this;
        // Yippie start
        //worldMap.forEach(function(item, index) {console.log(index + ": " + item)});

        // jakoze funguje to, ale u tech staveb to bylo nepouzitelny, bud to oznacovalo (prohlizecove), nebo pretahovalo obrazky
        /*
        this.mouseDown = 0;
        $(worldMap).mousedown(function() {
            ++that.mouseDown;
            console.log(that.mouseDown);
        })
        $(worldMap).mouseup(function() {
            --that.mouseDown;
            console.log(that.mouseDown);
        })
        */
        // Yippie end
        // =======================================================================================================================
    }

    this._initMapMagic = function(worldMap){
        if (!this._options.useMagicMapSelect.checked)
            return;
        this.lands = [];
        $(worldMap).find('head').append($('<style type="text/css">.selectedLand { background-color:red; }</style>'));
		this.landDivs = $(worldMap).find('div[class*="area"]').find('div');
		var that = this;
		$(this.landDivs).on('click', function(e){
			if (e.ctrlKey) {
				e.stopPropagation();
				e.preventDefault();

				var id = parseInt(this.id.replace( /^\D+/g, ''));
				if ($(this).hasClass('selectedLand')){
					$(this).removeClass('selectedLand');
					that.lands.splice(that.lands.indexOf(id), 1);
				}
				else{
					$(this).addClass('selectedLand');
					that.lands.push(id);
				}
			}
		});
    };

    this._initHouses = function(worldMap){
        if (!this._options.useHousesCollectiveBuyFixed.checked)
            return;
        var form = $(worldMap).find('form[name="form_domy"]');
        $(form).find('table').css('margin-top', '90px');
        $($(form).find('tr')[1]).css('position', 'fixed').css('top','0px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '748px').css('margin-left', '-1px').css('display', 'table');
        $($(form).find('tr')[2]).css('position', 'fixed').css('top','48px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '748px').css('margin-left', '-1px').css('display', 'table');

    };
    this._initMagicUnitsBuy = function(worldMap){
        if (!this._options.useMageCollectiveBuyFixed.checked)
            return;
        var form = $(worldMap).find('form[name="form_domy"]');
        $(form).find('table').css('margin-top', '150px');
         $($(form).find('tr')[0]).css('position', 'fixed').css('top','0px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '878px').css('margin-left', '-1px');
        $(form).find('tr:nth-last-child(2)').css('position', 'fixed').css('top','68px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '878px').css('margin-left', '-1px');
        $(form).find('tr:last-child').css('position', 'fixed').css('top','108px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '878px').css('margin-left', '-1px');
        $(form).find('tr:last-child').find('td').css('width', '878px');

    };

    // =======================================================================================================================
    this._initBuildings = function(worldMap){
        var that = this;
        // =======================================================================================================================
        // Yippie start
        // drž ctrl a jezdi s myší pro označování staveb v Hromadným nakupování
        var $sb = $(worldMap).find('td[class="sb"]');
        $sb.mouseenter(function(e){
            if (e.ctrlKey) {
                $(this).find('img')[0].click();
            }
        });

        // přidání řádku s ikonkami, které označí celý sloupeček
        var selectColumnHandler = function(e) {
            var colSelId = $(this).attr('id');
            var parent = $(this).parent();
            var imgsToClick = $(worldMap).find('img[id$="_' + colSelId + '_o"');
            if ($(parent).hasClass('sb')) {
                $(parent).attr('class', 'sp');
                // select na neoznaceny policka ktery maji zapornou cenu (nakup) nebo cerveny policka
                imgsToClick = $(imgsToClick).filter(function() {
                    return (parseInt($(this).attr('title').split('(')[1].split(',')[0]) < 0 && $(this).parent().hasClass('sb')) || $(this).parent().hasClass('sz');
                });
            } else if ($(parent).hasClass('sp')) {
                $(parent).attr('class', 'sz');
                // select na neoznaceny policka s kladnou cenou (prodej) nebo zeleny policka
                imgsToClick = $(imgsToClick).filter(function() {
                    return (parseInt($(this).attr('title').split('(')[1].split(',')[0]) > 0 && $(this).parent().hasClass('sb')) || $(this).parent().hasClass('sp');
                });
            } else if ($(parent).hasClass('sz')) {
                $(parent).attr('class', 'sb');
                // select na policka zeleny a cerveny policka
                imgsToClick = $(imgsToClick).filter(function() {
                    return $(this).parent().hasClass('sp') || $(this).parent().hasClass('sz');
                });
            }
            $(imgsToClick).each(function() {
                $(this)[0].click();
            });
        }
        var buildingsInfoArr = $(worldMap).find('#CiselnikStaveb').val().split(';').slice(0, -1);
        var newLineStr = '<tr><td></td>';
        var emptyLine = '<tr><td></td>';
        var buildingInfoArr;
        for (var i = 0; i < buildingsInfoArr.length; ++i) {
            buildingInfoArr = buildingsInfoArr[i].split(',');
            var colSelId = buildingInfoArr[0];
            var imgsInColumn = $(worldMap).find('img[id$="_' + colSelId + '_o"');
            var buildingIcon;
            if ($(imgsInColumn).filter(function() {
                return (parseInt($(this).attr('title').split('(')[1].split(',')[0]) < 0 && $(this).parent().hasClass('sb')) || $(this).parent().hasClass('sz');
            }).length == 0) {
                buildingIcon = buildingInfoArr[1];
            } else {
                buildingIcon = buildingInfoArr[2];
            }
            newLineStr += '<td class="sb"><img class="colselimg" id="' + buildingInfoArr[0] + '" src="images/m/' + buildingIcon + '" title="' + buildingInfoArr[buildingInfoArr.length - 3] +'" /><input type="hidden" id="' + buildingInfoArr[0] + '" value="" name="' + buildingInfoArr[0] + '"/></td>';
            emptyLine += '<td>-</td>';
        }
        newLineStr += '</tr>';
        emptyLine += '</tr>';
        var form = $(worldMap).find('form[name="form_buildings"]');
        $(form).find('table').prepend(emptyLine);
        $(form).find('table').prepend(newLineStr);
        $(form).find('.colselimg').click(selectColumnHandler);
        // Yippie end
        // =======================================================================================================================
        if (!this._options.useBuldingCollectiveBuyFixed.checked)
            return;
        $(form).find('table').css('margin-top', '48px');
        $(form).find('tr:last-child').css('position', 'fixed').css('top','0px').css('background-image', 'url("../images/pozadi/poz_drv.jpg")').css('width', '1089px').css('margin-left', '-4px');

    };


	this._spellValue1;
	this._spellValue2;
	this._spellValue3;
	this._spellValue4;
	this._spellValue5;
	this._castSpell = false;
    this._destroyBuildings = false;

	this.initLeftFrame = function(){



		var that = this;


        var magicFrame = $('frame[name="Lista_Vlevo"]').contents();
        var sendButton = $(magicFrame).find('input[type="submit"][name="Seslat"]');
        if (sendButton.length>0){ // to snad bude jen u framu s magii :)
            this._initMagicFrame(sendButton, magicFrame);

        }

        var formBuild = $(magicFrame).find('form[name="form_postavit"]');
        if (formBuild.length>0 && this._options.useRemoveAllBuildings.checked){ // jsme na zalozce se stavenim
            var destroyAllBtn = $('<tr><td colspan="2"><button class="butt_sml" style="color:red">Prodat vše</button></td></tr>');
            $($(magicFrame).find('tbody')[1]).append(destroyAllBtn);
            $(destroyAllBtn).find('button').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Pomodli se, než to potvrdíš!')){
                    that._destroyBuildings = true;
                    that.tryDestroyBuildings();
                }
            });
            if (that._destroyBuildings)
                that.tryDestroyBuildings();

        }

        var formContracts = $(magicFrame).find('form[name="smlouvy"]');
        if (formContracts.length>0 && this._options.useContractTools.checked){ // jsme ve smlouvach
            var selectAllContracts = $('<select class="list_centred"><option value="0"></option><option value="6" style="color:#FF4444">Válka</option><option value="3" style="color:#FFDD44">Obchodní</option><option value="2" style="color:#55AAFF">Magická</option><option value="1" style="color:#CCCCCC">Vojenská</option><option value="7" style="color:#00CC00">Mír</option><option value="4" style="color:#CC55DD">Volný průchod</option><option value="5" style="color:#999999">Zrušena</option></select>');
            $(selectAllContracts).on('change', function(){
                $(magicFrame).find('select[name="CBoxMojeNabidka"]').val($(this).val());
            });
            var tr = $('<tr><td>Hromadná změna</td><td></td>');
            $($(tr).find('td')[1]).append(selectAllContracts);
            $($(magicFrame).find('tbody')[1]).append(tr);

            // ano vsem
            var trYesNo = $('<tr><td>Hromadný příjem</td><td><button class="butt_sml" style="color:green" data-id="1">Ano</button><button class="butt_sml" style="color:red" data-id="0">Ne</button></td></tr>');
            $(trYesNo).find('button').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                $(magicFrame).find('select[name*="CBoxJehoNabidka"]').val($(this).data('id'));
            });
            $($(magicFrame).find('tbody')[1]).append(trYesNo);

        }

	};

    this.__magicLandsInput;

    this._initMagicFrame = function(sendButton, magicFrame){
        var that = this;
        $(sendButton).off('click').on('click', function(e) {

            // pridame zemky z inputu
            if (that.__magicLandsInput){
                var landsFromInputText = $(that.__magicLandsInput).val();
                if (landsFromInputText != null && landsFromInputText != ''){
                    var landsFromInput = landsFromInputText.split(',');
                    for (var i = 0; i < landsFromInput.length; i++){
                        var land = landsFromInput[i];
                        land = land.replace(/\s*\(.*?\)\s*/g, ""); // odebereme vse ze zavorek
                        land = land.trim(); // bily znaky
                        if (land != ''){
                            var landId = that._dataProvider.getLandIdByName(land);
                            if (landId < 0){
                                alert('Země "'+land+'" nenalezena!!');
                                e.preventDefault();
                                e.stopPropagation();
                                that.lands = [];
                                return;
                            }
                            that.lands.push(landId);
                        }
                    }
                }
            }

            if (that.lands.length > 0){
                e.preventDefault();
                e.stopPropagation();


                that._spellValue1 = $(magicFrame).find('#K1').val();
                that._spellValue2 = $(magicFrame).find('#K2').val();
                that._spellValue3 = $(magicFrame).find('#K3').val();
                that._spellValue4 = $(magicFrame).find('#K4').val();
                that._spellValue5 = $(magicFrame).find('#K5').val();



                that._castSpell = true;
                that.tryCastSpell();
            }
        });
        if (that._castSpell)
            that.tryCastSpell();

        if (this._options.useMagicInput.checked){
            this.__magicLandsInput = $('<textarea type="multiline" rows="5" style="background-color: #530000; color: #DDDD00" />');
            $($(magicFrame).find('tbody')[1]).append(this.__magicLandsInput);
        }


    };








	this.tryCastSpell = function(){
	   var magicFrame = $('frame[name="Lista_Vlevo"]').contents();
	   var selectEnemyLand = $(magicFrame).find('#cb_enemy_lands');
	  var selectMyLand = $(magicFrame).find('#cb_my_lands');


		if (this.lands.length > 0){
			var id = this.lands.pop();
			  $(selectEnemyLand).val(id);
				$(selectMyLand).val(id);

				$(magicFrame).find('#K1').val(this._spellValue1);
				$(magicFrame).find('#K2').val(this._spellValue2);
				$(magicFrame).find('#K3').val(this._spellValue3);
				$(magicFrame).find('#K4').val(this._spellValue4);
				$(magicFrame).find('#K5').val(this._spellValue5);

				var magicForm = $(magicFrame).find('form[name="magie"]');

				if (this.lands.length == 0)
				{
					this._castSpell = false;
					$(this.landDivs).removeClass('selectedLand');

                    this._spellValue1 = undefined;
                    this._spellValue2 = undefined;
                    this._spellValue3 = undefined;
                    this._spellValue4 = undefined;
                    this._spellValue5 = undefined;
				}

				$(magicForm).submit();
		}
	};

    this.tryDestroyBuildings = function(){
        var frameLeft = $('frame[name="Lista_Vlevo"]').contents();
        var selectBuildings = $(frameLeft).find('select[name="CBoxVyvoj"]');

        var nextToRemove = $(selectBuildings).find('option[style="background-color:#340000;color: rgb(255,0,0)"]:not([value="5100"]):not([value="4999"])').attr('value'); // vse cervene krome vozu a oddelovace

        if (nextToRemove){
            $(selectBuildings).val(nextToRemove);
            $(frameLeft).find('form[name="form_postavit"]').submit();
        }
        else{
            this._destroyBuildings = false;
        }

    };


    this._showLoading = function(){
        this._loadingDom = $('<div style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; opacity:0.9;"><div>Zpracovávám hlášení</div><div><img src="http://giphygifs.s3.amazonaws.com/media/EeT7eR2j7X5UA/giphy.gif" /></div></div>');
        $('html').append(this._loadingDom);

    };

    this._hideLoading = function(){
        $(this._loadingDom).remove();
    };



	this.init();
}

   function DEKingDataProvider(){

       this.getLandIdByName = function(name){
           var land = this.getLandByName(name);
           if (land != null)
               return land.id;
           return -1;

       };

       this.getLandByName = function(name){
           name = name.toLowerCase().trim();
           var l = null;
           for(var i = 0; i < this._allLandsList.length; i++){
               var land = this._allLandsList[i];
               if (land.cz.toLowerCase() == name || land.sk.toLowerCase() == name || land.en.toLowerCase() == name){
                   l = land;
                   break;
               }
           }
           return l;
       }

       this.getSpellById = function(id){
           var spell = null;
           for (var i = 0; i < this._allSpellsList.length; i++){
               var s = this._allSpellsList[i];
               if (s.id == id) {
                   spell = s;
                   break;
               }
           }
           return spell;
       }

       this.getSpellByImg = function(img){
           var spell = null;
           for (var i = 0; i < this._allSpellsList.length; i++){
               var s = this._allSpellsList[i];
               if (s.img == img) {
                   spell = s;
                   break;
               }
           }
           return spell;
       }

       this.getSpellByName = function(name){
           name = name.trim();
           var spell = null;
           for (var i = 0; i < this._allSpellsList.length; i++){
               var s = this._allSpellsList[i];
               if (s.cz == name || s.sk == name || s.en == name) {
                   spell = s;
                   break;
               }
           }
           return spell;
       }


       // seznam vsech zemi.. posbiranej, serazenej.. no tfuj.. :-)
       this._allLandsList = JSON.parse('[{"id":1,"cz":"Horní val","sk":"Horný val","en":"Upper mound"},{"id":2,"cz":"Severní kopce","sk":"Severné kopce","en":"Northern Hills"},{"id":3,"cz":"Větrná step","sk":"Veterná step","en":"Windy steppe"},{"id":4,"cz":"Bystřina","sk":"Bystrina","en":"Torrent"},{"id":6,"cz":"Stará hláska","sk":"Stará hláska","en":"Old watchtower"},{"id":7,"cz":"Diamantový vrch","sk":"Diamantový vrch","en":"Diamond Hill"},{"id":8,"cz":"Záhoří","sk":"Záhorie","en":"Wood of fire"},{"id":9,"cz":"Doubov","sk":"Dubov","en":"Oak village"},{"id":10,"cz":"Vrchovina","sk":"Vrchovina","en":"Highlands"},{"id":12,"cz":"Ohnivá hora","sk":"Ohnivá hora","en":"Fire mountain"},{"id":13,"cz":"Velín","sk":"Velín","en":"Vellum"},{"id":14,"cz":"Železné doly","sk":"Železné bane","en":"Iron mines"},{"id":15,"cz":"Horní cesta","sk":"Horná cesta","en":"Upper way"},{"id":16,"cz":"Sokolí hory","sk":"Sokolie hory","en":"Falcon Mountains"},{"id":17,"cz":"Zapovězená svatyně","sk":"Zakázaná svätyňa","en":"Forbidden sanctuary"},{"id":19,"cz":"Koňská pláň","sk":"Konská pláň","en":"Horse Plains"},{"id":20,"cz":"Pustý kraj","sk":"Pustý kraj","en":"Empty land"},{"id":21,"cz":"Elfí osada","sk":"Elfia osada","en":"Elvenville"},{"id":22,"cz":"Západní přístav","sk":"Západný prístav","en":"Port West"},{"id":23,"cz":"Staré obětiště","sk":"Staré obetisko","en":"Old altar"},{"id":24,"cz":"Jílovsko","sk":"Ílovisko","en":"Clayland"},{"id":25,"cz":"Podhradí","sk":"Podhradie","en":"Outer Bailey"},{"id":26,"cz":"Hradiště","sk":"Hradisko","en":"Fort"},{"id":28,"cz":"Skřetí řeka","sk":"Škretia rieka","en":"Orc River"},{"id":29,"cz":"Zelené pláně","sk":"Zelené pláne","en":"Green Plains"},{"id":30,"cz":"Osada zbrojířů","sk":"Osada zbrojárov","en":"Saltpeterburg"},{"id":31,"cz":"Černý Les","sk":"Čierny les","en":"Black forest"},{"id":32,"cz":"Dračí skon","sk":"Dračí skon","en":"Dragon´s demise"},{"id":33,"cz":"Krvavá pláň","sk":"Krvavá pláň","en":"Bloody Plain"},{"id":34,"cz":"Jezero rusalek","sk":"Jazero rusaliek","en":"Lake of nymphs"},{"id":36,"cz":"Přímořsko","sk":"Prímorsko","en":"Seaside"},{"id":37,"cz":"Umrlčí pahorky","sk":"Umrlčie pahorky","en":"Dead Man´s Hills"},{"id":38,"cz":"Zlatý důl","sk":"Zlatá baňa","en":"Gold mine"},{"id":39,"cz":"Bažiny smutku","sk":"Bažiny smútku","en":"Swamps of Sorrow"},{"id":40,"cz":"Říše středu","sk":"Ríša stredu","en":"Central Empire"},{"id":41,"cz":"Opatství","sk":"Opátstvo","en":"Abbey"},{"id":42,"cz":"Elfí louky","sk":"Elfie lúky","en":"Elven Meadows"},{"id":44,"cz":"Vlčí doupata","sk":"Vlčie dúpätá","en":"Wolf Lairs"},{"id":46,"cz":"Chrám smrti","sk":"Chrám smrti","en":"Temple of Death"},{"id":47,"cz":"Bludná zem","sk":"Bludná zem","en":"Land of boulders"},{"id":48,"cz":"Malý hvozd","sk":"Malá húšťava","en":"Small Forest"},{"id":49,"cz":"Labutí prameny","sk":"Labutie pramene","en":"Swan Springs"},{"id":50,"cz":"Lesní obětiště","sk":"Lesné obetisko","en":"Forest Altar"},{"id":51,"cz":"Strážnice","sk":"Strážnica","en":"Guardhouse"},{"id":52,"cz":"Pramen osudu","sk":"Prameň osudu","en":"Spring of Destiny"},{"id":54,"cz":"Jezerní věž","sk":"Jazerná veža","en":"Lake Tower"},{"id":55,"cz":"Skřetí jeskyně","sk":"Škretia jaskyňa","en":"Orc Cave"},{"id":56,"cz":"Průsmyk","sk":"Priesmyk","en":"Mountain Pass"},{"id":57,"cz":"Pustá Tvrz","sk":"Pustá pevnosť","en":"Godforsaken Tower"},{"id":58,"cz":"Kupecké přístavy","sk":"Kupecké prístavy","en":"Merchant Harbours"},{"id":59,"cz":"Královský důl","sk":"Kráľovská baňa","en":"Royal Mine"},{"id":60,"cz":"Chlístov","sk":"Chlístov","en":"Land of fees"},{"id":61,"cz":"Koňské statky","sk":"Konské statky","en":"Horse Farms"},{"id":63,"cz":"Hrzov","sk":"Hrdzov","en":"Sorrowville"},{"id":64,"cz":"Jezerní hranice","sk":"Jazerná hranica","en":"Lake District"},{"id":65,"cz":"Čarodějná hláska","sk":"Čarodejná hláska","en":"Magic Watchtower"},{"id":66,"cz":"Země Dark Elfa","sk":"Zem Dark Elfa","en":"Land of Dark Elf"},{"id":67,"cz":"Země horalů","sk":"Zem horalov","en":"Land of Highlanders"},{"id":68,"cz":"Květinová pole","sk":"Kvetinové pole","en":"Flower Fields"},{"id":69,"cz":"Rug Tharsis","sk":"Rug Tharsis","en":"Rug Tharsis"},{"id":70,"cz":"Jezerní přístav","sk":"Jazerný prístav","en":"Lake Harbour"},{"id":71,"cz":"Medvědín","sk":"Medveďov","en":"Bearville"},{"id":72,"cz":"Ania el Arin","sk":"Ania el Arin","en":"Ania el Arin"},{"id":73,"cz":"Morrt Inmon","sk":"Morrt Inmon","en":"Morrt Inmon"},{"id":74,"cz":"Zlaté skály","sk":"Zlaté skaly","en":"Golden Rocks"},{"id":75,"cz":"Země koruny","sk":"Zem koruny","en":"Land of Crown"},{"id":76,"cz":"Osada kovářů","sk":"Osada kováčov","en":"Smithville"},{"id":77,"cz":"Trollí vrchy","sk":"Trollie vrchy","en":"Troll Hills"},{"id":78,"cz":"Zakletá mohyla","sk":"Zakliata mohyla","en":"Elf-struck barrow"},{"id":79,"cz":"Trpasličí doly","sk":"Trpasličie bane","en":"Dwarven mines"},{"id":80,"cz":"Skalní město","sk":"Skalné mesto","en":"Rock City"},{"id":81,"cz":"Ďáblova hora","sk":"Diablova hora","en":"Devil´s Mountain"},{"id":82,"cz":"Klášter Lin","sk":"Kláštor Lin","en":"Lin Monastery"},{"id":83,"cz":"Vlčí step","sk":"Vlčia step","en":"Wolf Steppe"},{"id":84,"cz":"Tir Mon","sk":"Tir Mon","en":"Tir Mon"},{"id":85,"cz":"Vinice","sk":"Vinice","en":"Vineyard"},{"id":86,"cz":"Kouzelný les","sk":"Kúzelný les","en":"Magic forest"},{"id":87,"cz":"Jezerní království","sk":"Jazerné kráľovstvo","en":"Kingdom of lakes"},{"id":88,"cz":"Inmonis","sk":"Inmonis","en":"Inmonis"},{"id":89,"cz":"Palmová oáza","sk":"Palmová oáza","en":"Palm Oasis"},{"id":90,"cz":"Větrný dvorec","sk":"Veterný dvorec","en":"Windy Manor"},{"id":91,"cz":"Kemen an Rin","sk":"Kemen an Rin","en":"Kemen an Rin"},{"id":92,"cz":"Strážný les","sk":"Strážny les","en":"Guard Forest"},{"id":93,"cz":"Hraniční poušť","sk":"Hraničná púšť","en":"Border Desert"},{"id":94,"cz":"Hlídka nomádů","sk":"Hliadka nomádov","en":"Guard of Nomads"},{"id":95,"cz":"Morrtis","sk":"Morrtis","en":"Morrtis"},{"id":96,"cz":"Mrtvá poušť","sk":"Mŕtva púšť","en":"Dead Desert"},{"id":97,"cz":"Osada nomádů","sk":"Osada nomádov","en":"Land of Nomads"},{"id":98,"cz":"Země mnichů","sk":"Zem mníchov","en":"Land of Monks"},{"id":99,"cz":"Město lesních elfů","sk":"Mesto lesných elfov","en":"Town of Forest Elves"},{"id":100,"cz":"Eridan Teos","sk":"Eridan Teos","en":"Eridan Teos"},{"id":101,"cz":"Var el Rug","sk":"Var el Rug","en":"Var el Rug"},{"id":102,"cz":"Hranice nomádů","sk":"Hranica nomádov","en":"Border of nomads"},{"id":103,"cz":"Orlí pevnost","sk":"Orlia pevnosť","en":"Eagle Fort"},{"id":104,"cz":"Klášterní výspa","sk":"Kláštorná strážnica","en":"Monk Outpost"},{"id":105,"cz":"Ledová zátoka","sk":"Ľadová zátoka","en":"Frozen Bay"},{"id":106,"cz":"Země bohatýrů","sk":"Zem bohatierov","en":"Land of Heroes"},{"id":107,"cz":"Trpasličí hory","sk":"Trpasličie hory","en":"Dwarven Mountains"},{"id":108,"cz":"Šedé hory","sk":"Šedé hory","en":"Grey Mountains"},{"id":109,"cz":"Severní spoušť","sk":"Severná spúšť","en":"Northern Havoc"},{"id":110,"cz":"Soumračné vrchy","sk":"Súmračné vrchy","en":"Hills of Nightfall"},{"id":111,"cz":"Kraj obrů","sk":"Kraj obrov","en":"Land of Giants"},{"id":112,"cz":"Černokněžnická říše","sk":"Černokňažnícka ríša","en":"Empire of Sorcerers"},{"id":113,"cz":"Temný hvozd","sk":"Temná húština","en":"Dark Forest"},{"id":114,"cz":"Divočina","sk":"Divočina","en":"Wilderness"},{"id":115,"cz":"Modré hory","sk":"Modré hory","en":"Blue Mountains"},{"id":116,"cz":"Osamělá hora","sk":"Osamelá hora","en":"Lonely Mountain"},{"id":117,"cz":"Železné hory","sk":"Železné hory","en":"Iron Mountains"},{"id":118,"cz":"Hůrecko","sk":"Hôrecko","en":"Underhill"},{"id":119,"cz":"Údolí elfů","sk":"Údolie elfov","en":"Valley of Elves"},{"id":120,"cz":"Jezero divochů","sk":"Jazero divochov","en":"Lake of savages"},{"id":121,"cz":"Elfí přístavy","sk":"Elfské prístavy","en":"Elven Harbours"},{"id":122,"cz":"Kraj půlčíků","sk":"Kraj hobitov","en":"The Shire"},{"id":123,"cz":"Elfí les","sk":"Elfí les","en":"Elven Forest"},{"id":124,"cz":"Bitevní pláň","sk":"Bojová pláň","en":"Battlefield"},{"id":125,"cz":"Větrný kraj","sk":"Veterný kraj","en":"Windshire"},{"id":126,"cz":"Železná věž","sk":"Železná veža","en":"Iron Tower"},{"id":127,"cz":"Vyprahlá zem","sk":"Vyprahnutá zem","en":"Parched Land"},{"id":128,"cz":"Popelavé hory","sk":"Popolavé hory","en":"Ashy Mountains"},{"id":129,"cz":"Vřesoviště","sk":"Vresovisko","en":"Heath"},{"id":130,"cz":"Země koní","sk":"Zem koní","en":"Land of Horses"},{"id":131,"cz":"Země stínů","sk":"Zem tieňov","en":"Land of Shadows"},{"id":132,"cz":"Dlouhopolsko","sk":"Dlhopolsko","en":"Flatland"},{"id":133,"cz":"Mořské království","sk":"Morské kráľovstvo","en":"Sea Kingdom"},{"id":134,"cz":"Země králů","sk":"Zem kráľov","en":"Land of Kings"},{"id":135,"cz":"Jižní cesta","sk":"Južná cesta","en":"Southern Path"},{"id":136,"cz":"Východní Jihozemsko","sk":"Východné Juhozemsko","en":"Eastern Southland"},{"id":137,"cz":"Západní Jihozemsko","sk":"Západné Juhozemsko","en":"Western Southland"},{"id":204,"cz":"Gal Jint","sk":"Gal Jint","en":"Gal Jint"},{"id":205,"cz":"Arcad Mon","sk":"Arcad Mon","en":"Arcad Mon"},{"id":206,"cz":"Salkan","sk":"Salkan","en":"Salkan"},{"id":207,"cz":"Galhad","sk":"Galhad","en":"Galhad"},{"id":208,"cz":"Východní podhůří","sk":"Východné podhorie","en":"East Piedmont"},{"id":209,"cz":"Vlčí zem","sk":"Vlčia zem","en":"Land of Wolves"},{"id":210,"cz":"Západní podhůří","sk":"Západné podhorie","en":"West Piedmont"},{"id":211,"cz":"Oriel Jint","sk":"Oriel Jint","en":"Oriel Jint"},{"id":212,"cz":"Eridanis","sk":"Eridanis","en":"Eridanis"},{"id":213,"cz":"Srdce pouště","sk":"Srdce púšte","en":"Heart of Desert"},{"id":214,"cz":"Aisha","sk":"Aisha","en":"Aisha"},{"id":215,"cz":"Kameny duchů","sk":"Kamene duchov","en":"Stones of Spirits"},{"id":216,"cz":"Osada","sk":"Osada","en":"Hamlet"},{"id":217,"cz":"Šedý klášter","sk":"Šedý kláštor","en":"Grey Monastery"},{"id":218,"cz":"Anshar","sk":"Anshar","en":"Anshar"},{"id":219,"cz":"Arrhad","sk":"Arrhad","en":"Arrhad"},{"id":220,"cz":"Pustina","sk":"Pustina","en":"Bled"},{"id":221,"cz":"Belnor","sk":"Belnor","en":"Belnor"},{"id":222,"cz":"Hadí hrob","sk":"Hadí hrob","en":"Snake Tomb"},{"id":223,"cz":"Měsíční věž","sk":"Mesačná veža","en":"Tower of Moon"},{"id":224,"cz":"Kan el osir","sk":"Kan el osir","en":"Kan el Osir"},{"id":225,"cz":"Vraní věž","sk":"Vrania veža","en":"Crow Tower"},{"id":226,"cz":"Krinor","sk":"Krinor","en":"Krinor"},{"id":227,"cz":"Skřetí doupata","sk":"Škretie dúpätá","en":"Orc Lairs"},{"id":228,"cz":"Vyprahlé tábořiště","sk":"Vyprahnuté táborisko","en":"Parched Camp"},{"id":229,"cz":"Bílá věž","sk":"Biela veža","en":"White Tower"},{"id":230,"cz":"Dahakan","sk":"Dahakan","en":"Dahakan"},{"id":237,"cz":"Úrodné pláně","sk":"Úrodné pláne","en":"Fertile Plains"},{"id":238,"cz":"Kamenný úvoz","sk":"Kamenný úvoz","en":"Rocky Ravine"},{"id":239,"cz":"Zátoka korzárů","sk":"Zátoka Korzárov","en":"Buccaneer Bay"},{"id":240,"cz":"Skrytý klášter","sk":"Skrytý kláštor","en":"Hidden Monastery"},{"id":241,"cz":"Skřetí stezka","sk":"Škretia cesta","en":"Orc Trail"},{"id":242,"cz":"Skřetí doly","sk":"Škretie bane","en":"Orc Mines"},{"id":243,"cz":"Til Man","sk":"Til Man","en":"Til Man"},{"id":244,"cz":"Lužina","sk":"Lužina","en":"Floodplain"},{"id":245,"cz":"Obří vodopády","sk":"Obrie vodopády","en":"Giant Waterfalls"},{"id":246,"cz":"Arratan","sk":"Arratan","en":"Arratan"},{"id":247,"cz":"Jižní přístav","sk":"Južný prístav","en":"Port South"},{"id":248,"cz":"Ostrov korzárů","sk":"Ostrov korzárov","en":"Island of Buccaneers"},{"id":249,"cz":"Údolí ďábla","sk":"Údolie diabla","en":"Devil´s Valley"},{"id":250,"cz":"Ledrie","sk":"Ledria","en":"Ledria"},{"id":251,"cz":"Ania el Sor","sk":"Ania el Sor","en":"Ania el Sor"},{"id":252,"cz":"Medvědí pevnost","sk":"Medvedia pevnosť","en":"Bear Fort"},{"id":253,"cz":"Vilmon","sk":"Vilmon","en":"Vilmon"},{"id":254,"cz":"Loděnice","sk":"Lodenica","en":"Dockyard"},{"id":255,"cz":"Gurmond","sk":"Gurmond","en":"Gurmond"},{"id":256,"cz":"Antenor","sk":"Antenor","en":"Antenor"},{"id":257,"cz":"Grim Leor","sk":"Grim Leor","en":"Grim Leor"},{"id":258,"cz":"Jižní cíp","sk":"Južný cíp","en":"Cape South"},{"id":259,"cz":"Střežený průsmyk","sk":"Strážený priesmyk","en":"Guarded Pass"},{"id":260,"cz":"Osiris","sk":"Osiris","en":"Osiris"},{"id":261,"cz":"Ledová soutěska","sk":"Ľadová tiesňava","en":"Frozen Pass"},{"id":262,"cz":"Vodní pevnost","sk":"Vodná pevnosť","en":"Water Fortress"},{"id":263,"cz":"Stezky bloudění","sk":"Cesty blúdenia","en":"Mazy Trails"},{"id":264,"cz":"Svatý strom","sk":"Svätý strom","en":"Holy Tree"},{"id":265,"cz":"Sídlo alchymistů","sk":"Sídlo alchymistov","en":"Alchemists Mansion"},{"id":266,"cz":"Velký močál","sk":"Veľký močiar","en":"Big Swamp"},{"id":267,"cz":"Elfí planiny","sk":"Elfie planiny","en":"Elven Plains"},{"id":268,"cz":"Věž poznání","sk":"Veža poznania","en":"Tower of Wisdom"},{"id":269,"cz":"Mohylový les","sk":"Mohylový les","en":"Barrow Forest"},{"id":270,"cz":"Rašeliniště","sk":"Rašelinisko","en":"Moorland"},{"id":271,"cz":"Mrtvý les","sk":"Mŕtvy les","en":"Dead Forest"},{"id":272,"cz":"Citadela Temnoty","sk":"Citadela Temnoty","en":"Citadel of Darkness"},{"id":273,"cz":"Khelek ledr","sk":"Khelek ledr","en":"Khelek Ledr"},{"id":274,"cz":"Vřesové kopce","sk":"Vresové kopce","en":"Heather Hills"},{"id":275,"cz":"Hraniční linie","sk":"Hraničná línia","en":"Frontier"},{"id":276,"cz":"Zlatý klášter","sk":"Zlatý kláštor","en":"Golden Monastery"},{"id":277,"cz":"Cech zabijáků","sk":"Cech zabijakov","en":"Assassin Guild"},{"id":278,"cz":"Lorman","sk":"Lorman","en":"Lorman"},{"id":279,"cz":"Kraj zbrojmistrů","sk":"Kraj zbrojmajstrov","en":"Land of armourers"},{"id":280,"cz":"Osada elfích lovců","sk":"Osada elfských lovcov","en":"Camp of Elven hunters"},{"id":281,"cz":"Skryté údolí","sk":"Skryté údolie","en":"Hidden Valley"},{"id":282,"cz":"Les pokoje","sk":"Les pokoja","en":"Forest of Tranquility"},{"id":283,"cz":"Jižní hlídka","sk":"Južná hliadka","en":"Southern Guard"},{"id":284,"cz":"Dellkan","sk":"Dellkan","en":"Dellkan"},{"id":285,"cz":"Strážné hory","sk":"Strážne hory","en":"Guard Mountains"},{"id":286,"cz":"Tábořiště barbarů","sk":"Táborisko barbarov","en":"Barbarian Camp"},{"id":287,"cz":"Pláň ohně","sk":"Pláň ohňa","en":"Plains of Fire"},{"id":288,"cz":"Město nekromantů","sk":"Mesto nekromantov","en":"Necromancer Town"},{"id":289,"cz":"Vypleněná zem","sk":"Vyplienená zem","en":"Wasteland"},{"id":290,"cz":"Popelavá zem","sk":"Popolavá zem","en":"Ashy Land"},{"id":291,"cz":"Dračí klášter","sk":"Dračí kláštor","en":"Dragon Monastery"},{"id":292,"cz":"Cug el Athol","sk":"Cug el Athol","en":"Cug el Athol"},{"id":293,"cz":"Prokletá zem","sk":"Prekliata zem","en":"Cursed Land"},{"id":294,"cz":"Krvavé pole","sk":"Krvavé pole","en":"Bloody Field"},{"id":295,"cz":"Skřetí zbořenina","sk":"Škretie zborenisko","en":"Goblin Ruins"},{"id":296,"cz":"Zpustošené město","sk":"Spustošené mesto","en":"Destroyed town"},{"id":297,"cz":"Had el har","sk":"Had el har","en":"Had el Har"},{"id":298,"cz":"Jezero třpytu","sk":"Jazero lesku","en":"Shimmer Lake"},{"id":299,"cz":"Pekelná výheň","sk":"Pekelná vyhňa","en":"Devil´s Forge"},{"id":300,"cz":"Šibeniční vrchy","sk":"Šibeničné vrchy","en":"Gallow Hills"},{"id":301,"cz":"Pláň kostí","sk":"Pláň kostí","en":"Plain of Bones"},{"id":302,"cz":"Dračí spoušť","sk":"Dračia spúšť","en":"Dragon Havoc"},{"id":303,"cz":"Trollí loviště","sk":"Trollie lovisko","en":"Troll Hunts"},{"id":304,"cz":"Hranice smrti","sk":"Hranica smrti","en":"Border of Death"},{"id":305,"cz":"Stezka barbarů","sk":"Cesta barbarov","en":"Barbarian Trail"},{"id":306,"cz":"Skřetí hlídka","sk":"Škretia hliadka","en":"Orc Guard"},{"id":307,"cz":"Otrávená pustina","sk":"Otrávená pustatina","en":"Poisoned Bled"},{"id":308,"cz":"Spáleniště","sk":"Spálenisko","en":"Burns"},{"id":309,"cz":"Meziříčí","sk":"Medziriečie","en":"Mesopotamia"},{"id":310,"cz":"Skryté město","sk":"Skryté mesto","en":"Hidden Town"},{"id":311,"cz":"Stráž hranice","sk":"Stráž hranice","en":"Border Guard"},{"id":312,"cz":"Posvěcená zem","sk":"Posvätená zem","en":"Blessed Land"},{"id":313,"cz":"Elfí řeka","sk":"Elfia rieka","en":"Elven River"},{"id":314,"cz":"Radov","sk":"Radov","en":"Happytown"},{"id":315,"cz":"Jezero dryád","sk":"Jazero dryád","en":"Lake of Dryads"},{"id":316,"cz":"Ústí","sk":"Ústie","en":"Delta"},{"id":317,"cz":"Kutov","sk":"Kutov","en":"Mineville"},{"id":318,"cz":"Hadí pláně","sk":"Hadie pláne","en":"Plains of Snakes"},{"id":319,"cz":"Klášter Aborea","sk":"Kláštor Aborea","en":"Aborea Monastery"},{"id":320,"cz":"Elfí hlídka","sk":"Elfia hliadka","en":"Elven Guard"},{"id":321,"cz":"Přístav Kythie","sk":"Prístav Kythia","en":"Port Kythia"},{"id":322,"cz":"Pobřeží perel","sk":"Pobrežie perál","en":"Pearl Shore"},{"id":323,"cz":"Ostrov barbarů","sk":"Ostrov barbarov","en":"Barbarian Island"},{"id":324,"cz":"Démantové hory","sk":"Diamantové hory","en":"Diamond Mountains"},{"id":325,"cz":"Pobřeží úsvitu","sk":"Pobrežie úsvitu","en":"Beaches of Dawn"},{"id":326,"cz":"Osada katů","sk":"Osada katov","en":"Hangville"},{"id":327,"cz":"Mithrilové hory","sk":"Mithrilové hory","en":"Mithril Mountains"},{"id":328,"cz":"Útesy smrti","sk":"Útesy smrti","en":"Cliffs of Death"},{"id":329,"cz":"Monument vítězství","sk":"Monument víťazstva","en":"Victory Monument"},{"id":330,"cz":"Kraj klenotníků","sk":"Kraj klenotníkov","en":"Land of Jewellers"},{"id":331,"cz":"Ostrov templářů","sk":"Ostrov templárov","en":"Island of Templars"},{"id":332,"cz":"Přístav Torment","sk":"Prístav Torment","en":"Port Torment"},{"id":333,"cz":"Zaniklá říše","sk":"Zaniknutá ríša","en":"Extinct empire"},{"id":334,"cz":"Osamělý klášter","sk":"Osamelý kláštor","en":"Quiet Monastery"},{"id":335,"cz":"Jestřábí hory","sk":"Jastrabie hory","en":"Hawk Mountains"},{"id":336,"cz":"Antemon","sk":"Antemon","en":"Antemon"},{"id":337,"cz":"Věž démonů","sk":"Veža démonov","en":"Tower of Demons"},{"id":338,"cz":"Cesta skurutů","sk":"Cesta skurutov","en":"Uruk-Hai Trail"},{"id":339,"cz":"Královská pevnost","sk":"Kráľovská pevnosť","en":"Royal Fortress"},{"id":340,"cz":"Smutné jezero","sk":"Smutné jazero","en":"Lake of Sadness"},{"id":341,"cz":"Kapřín","sk":"Kaprov","en":"Fishbury"},{"id":342,"cz":"Skřetí přístav","sk":"Škretí prístav","en":"Orc Harbour"},{"id":343,"cz":"Thim Kan","sk":"Thim Kan","en":"Thim Kan"},{"id":344,"cz":"Osada lodivodů","sk":"Osada lodivodov","en":"Settlement of Pilots"},{"id":345,"cz":"Belman","sk":"Belman","en":"Belman"},{"id":346,"cz":"Arr dol","sk":"Arr dol","en":"Arr Dol"},{"id":347,"cz":"Štičí řeka","sk":"Rieka šťúk","en":"Pike River"},{"id":348,"cz":"Mramorová věž","sk":"Mramorová veža","en":"Marble Tower"},{"id":349,"cz":"Mlýnice","sk":"Mlynica","en":"Millshire"},{"id":350,"cz":"Vrchy zbojníků","sk":"Vrchy zbojníkov","en":"Hills of Brigands"},{"id":351,"cz":"Zátoka komárů","sk":"Zátoka komárov","en":"Mosquito Bay"},{"id":352,"cz":"Oriel el Alb","sk":"Oriel el Alb","en":"Oriel el Alb"},{"id":353,"cz":"Osada obchodníků","sk":"Osada obchodníkov","en":"Traderville"},{"id":354,"cz":"Hory Nelian","sk":"Hory Nelian","en":"Nelian Mountains"},{"id":355,"cz":"Ledopád","sk":"Ľadopád","en":"Icefall"},{"id":356,"cz":"Ledové jezero","sk":"Ľadové jazero","en":"Frosty Lake"},{"id":357,"cz":"Sněžná pevnost","sk":"Snežná pevnosť","en":"Snowy Fortress"},{"id":358,"cz":"Čarodějné hory","sk":"Čarodejné hory","en":"Magic Mountains"},{"id":359,"cz":"Jeskyně Siitcewa","sk":"Jaskyňa Siitcewa","en":"Cave of Siitcewa"},{"id":360,"cz":"Tajemný portál","sk":"Tajomný portál","en":"Mysterious Portal"},{"id":361,"cz":"Kouzelný mlýn","sk":"Kúzelný mlyn","en":"Magic Mill"},{"id":362,"cz":"Severní útočiště","sk":"Severné útočisko","en":"Northern Refuge"},{"id":363,"cz":"Sobí stezka","sk":"Sobia rieka","en":"Reindeer Path"},{"id":364,"cz":"Tábor divochů","sk":"Tábor divochov","en":"Native Camp"},{"id":365,"cz":"Trpasličí štoly","sk":"Trpasličie štôlne","en":"Dwarven Galleries"},{"id":366,"cz":"Kardif","sk":"Kardif","en":"Kardif"},{"id":367,"cz":"Barbarská step","sk":"Barbarská step","en":"Barbarian Steppe"},{"id":368,"cz":"Závětří","sk":"Závetrie","en":"Leeward"},{"id":369,"cz":"Zem ještěrů","sk":"Zem jašterov","en":"Sauria"},{"id":370,"cz":"Zátočina","sk":"Zátočina","en":"Refuge"},{"id":371,"cz":"Skřetosluj","sk":"Škreťolom","en":"Orc Cavern"},{"id":372,"cz":"Hrad černých rytířů","sk":"Hrad čiernych rytierov","en":"Castle of Black Knights"},{"id":373,"cz":"Auguron","sk":"Auguron","en":"Auguron"},{"id":374,"cz":"Krčma u Kulhavce","sk":"Krčma u Krivého","en":"Tavern By drunk"},{"id":375,"cz":"Algeban","sk":"Algeban","en":"Algeban"},{"id":376,"cz":"Barbarské legie","sk":"Barbarská légia","en":"Barbarian Legions"},{"id":377,"cz":"Království barbarů","sk":"Kráľovstvo barbarov","en":"Kingdom of Barbarians"},{"id":378,"cz":"Mahulská pole","sk":"Mahulské polia","en":"Mahul Fields"},{"id":379,"cz":"Cedrové údolí","sk":"Cédrové údolie","en":"Cedar Valley"},{"id":380,"cz":"Skarha","sk":"Skarha","en":"Skarha"},{"id":381,"cz":"Studna naděje","sk":"Studňa nádeje","en":"Fountain of Hope"},{"id":382,"cz":"Zbořený kostelec","sk":"Zborený kostolík","en":"Razed Guardtower"},{"id":383,"cz":"Linské hory","sk":"Linské hory","en":"Lin Mountains"},{"id":384,"cz":"Obelisk osudu","sk":"Obelisk osudu","en":"Obelisk of Destiny"},{"id":385,"cz":"Kovárna trpaslíků","sk":"Kováčňa trpaslíkov","en":"Dwarven Forge"},{"id":386,"cz":"Prokletá věž","sk":"Prekliata veža","en":"Cursed Tower"},{"id":387,"cz":"Moriagor","sk":"Moriagor","en":"Moriagor"},{"id":388,"cz":"Mlžné jezero","sk":"Hmlové jazero","en":"Foggy Lake"},{"id":389,"cz":"Hrad Laradur","sk":"Hrad Laradur","en":"Castle Laradur"},{"id":390,"cz":"Hvozd čarodějnic","sk":"Húština čarodejníc","en":"Forest of Witches"},{"id":391,"cz":"Město lesního lidu","sk":"Mesto lesného ľudu","en":"Town of Forest Folk"},{"id":392,"cz":"Totem temnoty","sk":"Totem temnoty","en":"Totem of Darkness"},{"id":393,"cz":"Ďáblovy pece","sk":"Diablove pece","en":"Devil´s Furnaces"},{"id":394,"cz":"Poslední soud","sk":"Posledný súd","en":"Land of Doom"},{"id":395,"cz":"Hory šílenství","sk":"Hory šialenstva","en":"Mountains of Insanity"},{"id":396,"cz":"Les kostí","sk":"Les kostí","en":"Forest of Bones"},{"id":397,"cz":"Propast zhouby","sk":"Priepasť záhuby","en":"Abyss of Bane"},{"id":398,"cz":"Kraj drakobijců","sk":"Kraj drakobijcov","en":"Land of Dragonslayers"},{"id":399,"cz":"Planina zmaru","sk":"Planina zmaru","en":"Plain of Blight"},{"id":400,"cz":"Svatyně Nicoty","sk":"Svätyňa Ničoty","en":"Sanctuary of Nothingness"},{"id":401,"cz":"Hrobka pánů severu","sk":"Hrobky pánov severu","en":"Crypt of Masters of North"},{"id":402,"cz":"Barbarská stráž","sk":"Barbarská stráž","en":"Barbarian Guard"},{"id":403,"cz":"Strážná step","sk":"Strážna step","en":"Guard Steppe"},{"id":404,"cz":"Drakeova marka","sk":"Drakeova marka","en":"Drake´s Mark"},{"id":405,"cz":"Vrchy ozvěn","sk":"Vrchy ozvien","en":"Hills of Echoes"},{"id":406,"cz":"Kolny","sk":"Kôlne","en":"Sheds"},{"id":407,"cz":"Pelouchy","sk":"Pelechy","en":"Lairs"},{"id":408,"cz":"Thim Inmon","sk":"Thim Inmon","en":"Thim Inmon"},{"id":409,"cz":"Říše Argad","sk":"Ríša Argad","en":"Argadian Empire"},{"id":410,"cz":"Stěžery","sk":"Stožiare","en":"Serfvale"},{"id":411,"cz":"Lesní portál","sk":"Lesný portál","en":"Forest Portal"},{"id":412,"cz":"Arr Ania","sk":"Arr Ania","en":"Arr Ania"},{"id":413,"cz":"Sněžné hory","sk":"Snežné hory","en":"Snowy Mountains"},{"id":414,"cz":"Osada půlčíků","sk":"Osada hobitov","en":"Halfling Village"},{"id":415,"cz":"Pramenité vrchy","sk":"Pramenité vrchy","en":"Hills of Streams"},{"id":416,"cz":"Hadakanův hvozd","sk":"Hadakanova húština","en":"Forest of Hadakan"},{"id":417,"cz":"Lesní brána","sk":"Lesná brána","en":"Forest Gate"},{"id":418,"cz":"Vlčí brázda","sk":"Vlčia brázda","en":"Wolf Furrow"},{"id":419,"cz":"Imrazd","sk":"Imrazd","en":"Imrazd"},{"id":420,"cz":"Khelek Jint","sk":"Khelek Jint","en":"Khelek Jint"},{"id":421,"cz":"Větrov","sk":"Vetrov","en":"Windburg"},{"id":422,"cz":"Pastviny","sk":"Pastviny","en":"Meadows"},{"id":423,"cz":"Kraj koření","sk":"Kraj korenia","en":"The land of herbs"},{"id":424,"cz":"Til Thar","sk":"Til Thar","en":"Til Thar"},{"id":425,"cz":"Podhůří","sk":"Podhorie","en":"Piedmont"},{"id":426,"cz":"Zem druidů","sk":"Zem druidov","en":"Land of Druids"},{"id":427,"cz":"Tiché údolí","sk":"Tiché údolie","en":"Silent Valley"},{"id":428,"cz":"Půtkov","sk":"Pútkov","en":"Hassleburg"},{"id":429,"cz":"Stínov","sk":"Tieňov","en":"Shadowburg"},{"id":430,"cz":"Hrad Perst","sk":"Hrad Perst","en":"Castle Perst"},{"id":431,"cz":"Dunící hora","sk":"Duniaca hora","en":"Rumbling Mountain"},{"id":432,"cz":"Rákosiny","sk":"Rákosiny","en":"Reeds"},{"id":433,"cz":"Soutočné louky","sk":"Sútočné lúky","en":"River Meadows"},{"id":434,"cz":"Perknov","sk":"Perknov","en":"Boozeburg"},{"id":435,"cz":"Osada malomocných","sk":"Osada malomocných","en":"Settlement of Lepers"},{"id":436,"cz":"Les skřítků","sk":"Les škriatkov","en":"Forest of Gnomes"},{"id":437,"cz":"Hájina","sk":"Hájená","en":"Deep Forest"},{"id":438,"cz":"Kraj rybářů","sk":"Kraj rybárov","en":"Land of Fishermen"},{"id":439,"cz":"Zem bažin","sk":"Zem bažín","en":"Swamps"},{"id":440,"cz":"Slonovinová věž","sk":"Slonovinová veža","en":"Ivory Tower"},{"id":441,"cz":"Černá hláska","sk":"Čierna hláska","en":"Black Guardtower"},{"id":442,"cz":"Křečhoř","sk":"Kŕčhor","en":"Amazon"},{"id":443,"cz":"Lesní klášter","sk":"Lesný kláštor","en":"Forest Monastery"},{"id":444,"cz":"Dělící jezero","sk":"Deliace jazero","en":"Dividing Lake"},{"id":445,"cz":"Zem tůní","sk":"Zem tôní","en":"Poolshire"},{"id":446,"cz":"Srdce močálu","sk":"Srdce močiara","en":"Heart of Swamp"},{"id":447,"cz":"Jezerní osada","sk":"Jazerná osada","en":"Lakeville"},{"id":448,"cz":"Pomezí","sk":"Pomedzie","en":"Borderland"},{"id":449,"cz":"Dellmor","sk":"Dellmor","en":"Dellmor"},{"id":450,"cz":"Trollí most","sk":"Trollí most","en":"Troll Bridge"},{"id":451,"cz":"Bažina smrti","sk":"Barina smrti","en":"Swamp of Death"},{"id":452,"cz":"Mokrá pláň","sk":"Mokrá pláň","en":"Drenched Plains"},{"id":453,"cz":"Alb Kemen","sk":"Alb Kemen","en":"Alb Kemen"},{"id":454,"cz":"Pevnost Geran","sk":"Pevnosť Geran","en":"Fortress Geran"},{"id":455,"cz":"Werdor","sk":"Werdor","en":"Werdor"},{"id":456,"cz":"Mokřady","sk":"Mokrade","en":"Marshland"},{"id":457,"cz":"Bobří řeka","sk":"Bobria rieka","en":"Beaver River"},{"id":458,"cz":"Vodní mlýn","sk":"Vodný mlyn","en":"Water Mill"},{"id":459,"cz":"Zlatá hláska","sk":"Zlatá hláska","en":"Golden Guardhouse"},{"id":460,"cz":"Ohnivý kruh","sk":"Ohnivý kruh","en":"Ring of Fire"},{"id":461,"cz":"Hranice stínů","sk":"Hranica tieňov","en":"Border of Shadows"},{"id":462,"cz":"Ostrov mrtvých","sk":"Ostrov mŕtvych","en":"Isle of the Dead"},{"id":463,"cz":"Nor el Har","sk":"Nor el Har","en":"Nor el Har"},{"id":464,"cz":"Leor el Morrt","sk":"Leor el Morrt","en":"Leor el Morrt"},{"id":465,"cz":"Cesta bohů","sk":"Cesta bohov","en":"Path of gods"},{"id":466,"cz":"Pirátská krčma","sk":"Pirátska krčma","en":"Pirate Dive"},{"id":467,"cz":"Aréna smrti","sk":"Aréna smrti","en":"Arena of Death"},{"id":468,"cz":"Zem mořeplavců","sk":"Zem moreplavcov","en":"Land of Sailors"},{"id":469,"cz":"Zámostí","sk":"Zámostie","en":"Lumbridge"},{"id":470,"cz":"Thingolan","sk":"Thingolan","en":"Thingolan"},{"id":471,"cz":"Elmonath","sk":"Elmonath","en":"Elmonath"},{"id":472,"cz":"Malá delta","sk":"Malá delta","en":"Small Delta"},{"id":473,"cz":"Atan Kirs","sk":"Atan Kirs","en":"Atan Kirs"},{"id":474,"cz":"Thar el Zall","sk":"Thar el Zall","en":"Thar el Zall"},{"id":475,"cz":"Andiwa","sk":"Andiwa","en":"Andiwa"},{"id":476,"cz":"Konar el Morrt","sk":"Konar el Morrt","en":"Konar el Morrt"},{"id":477,"cz":"Přístav Trákie","sk":"Prístav Trákia","en":"Port Trakia"},{"id":478,"cz":"Lorion","sk":"Lorion","en":"Lorion"},{"id":479,"cz":"Zátoka elfů","sk":"Zátoka elfov","en":"Elven Bay"},{"id":480,"cz":"Citadela Eliador","sk":"Citadela Eliador","en":"Citadel Eliador"},{"id":481,"cz":"Průsmyk padlých","sk":"Priesmyk padlých","en":"Pass of Dead Soldiers"},{"id":482,"cz":"Khelek Kirs","sk":"Khelek Kirs","en":"Khelek Kirs"},{"id":483,"cz":"Dol el Zint","sk":"Dol el Zint","en":"Dol el Zint"},{"id":484,"cz":"Kovárny","sk":"Kováčne","en":"Forges"},{"id":485,"cz":"Brána naděje","sk":"Brána nádeje","en":"Gate of Hope"},{"id":486,"cz":"Rivia","sk":"Rivia","en":"Rivia"},{"id":487,"cz":"Ďáblův pramen","sk":"Diablov prameň","en":"Devil’s Spring"},{"id":488,"cz":"Elfí věštírna","sk":"Elfia veštiareň","en":"Elven Oracle"},{"id":489,"cz":"Vrchy ohně","sk":"Vrchy ohňa","en":"Hills of Fire"},{"id":490,"cz":"Utasar","sk":"Utasar","en":"Utasar"},{"id":491,"cz":"Severní hradba","sk":"Severná hradba","en":"Northern Wall"},{"id":492,"cz":"Dahamond","sk":"Dahamond","en":"Dahamond"},{"id":493,"cz":"Trpasličí dílny","sk":"Trpasličie dielne","en":"Dwarven Works"},{"id":494,"cz":"Trpasluj","sk":"Trpaslom","en":"Dwarrowdelf"},{"id":495,"cz":"Zartie","sk":"Zartie","en":"Zartia"},{"id":496,"cz":"Korstan","sk":"Korstan","en":"Korstan"},{"id":497,"cz":"Dvě věže","sk":"Dve veže","en":"Two Towers"},{"id":498,"cz":"Zallman","sk":"Zallman","en":"Zallman"},{"id":499,"cz":"Lesetria","sk":"Lesetria","en":"Lesetria"},{"id":500,"cz":"Veverčí vrchy","sk":"Veveričie vrchy","en":"Squirrel Hills"},{"id":501,"cz":"Baldur","sk":"Baldur","en":"Baldur"},{"id":502,"cz":"Oltář vampýrů","sk":"Oltár upírov","en":"Altar of Vampires"},{"id":503,"cz":"Houštiny","sk":"Húštiny","en":"Thickets"},{"id":504,"cz":"Osada léčitelů","sk":"Osada liečiteľov","en":"Healer Village"},{"id":505,"cz":"Věž úsvitu","sk":"Veža úsvitu","en":"Tower of Dawn"},{"id":506,"cz":"Doupě vrahů","sk":"Dúpä vrahov","en":"Den of Thugs"},{"id":507,"cz":"Gulova samota","sk":"Gulova samota","en":"Gul´s seclusion"},{"id":508,"cz":"Eridan Cug","sk":"Eridan Cug","en":"Eridan Cug"},{"id":509,"cz":"Žabí tůň","sk":"Žabia kaluž","en":"Frog Pool"},{"id":510,"cz":"Kan el Charat","sk":"Kan el Charat","en":"Kan el Charat"},{"id":511,"cz":"Celeb Thar","sk":"Celeb Thar","en":"Celeb Thar"},{"id":512,"cz":"Býčí věž","sk":"Býčia veža","en":"Bull Tower"},{"id":7101,"cz":"Výmar","sk":"Výmar","en":"Weimar"},{"id":7102,"cz":"Lipsko","sk":"Lipsko","en":"Leipzig"},{"id":7127,"cz":"Pirna","sk":"Pirna","en":"Pirna"},{"id":7128,"cz":"Karlovy Vary","sk":"Karlovy Vary","en":"Carlsbad"},{"id":7129,"cz":"Hasištejn","sk":"Hasištejn","en":"Hašištejn"},{"id":7130,"cz":"Chomutov","sk":"Chomutov","en":"Chomutov"},{"id":7131,"cz":"Kadaň","sk":"Kadaň","en":"Kadan"},{"id":7132,"cz":"Most","sk":"Most","en":"Most"},{"id":7133,"cz":"Žatec","sk":"Žatec","en":"Žatec"},{"id":7134,"cz":"Teplice","sk":"Teplice","en":"Teplice"},{"id":7135,"cz":"Louny","sk":"Louny","en":"Louny"},{"id":7136,"cz":"Říp","sk":"Říp","en":"Ríp Mountain"},{"id":7137,"cz":"Děčín","sk":"Děčín","en":"Decín"},{"id":7138,"cz":"Ústí nad Labem","sk":"Ústí nad Labem","en":"Ústí nad Labem"},{"id":7139,"cz":"Litoměřice","sk":"Litoměřice","en":"Litomerice"},{"id":7140,"cz":"Budyně","sk":"Budyně","en":"Budyne"},{"id":7103,"cz":"Gnandstein","sk":"Gnandstein","en":"Gnadstein"},{"id":7104,"cz":"Wurzen","sk":"Wurzen","en":"Wurzen"},{"id":7105,"cz":"Grimma","sk":"Grimma","en":"Grimma"},{"id":7106,"cz":"Mildenstein","sk":"Mildenstein","en":"Mildenstein"},{"id":7107,"cz":"Gera","sk":"Gera","en":"Gera"},{"id":7108,"cz":"Jena","sk":"Jena","en":"Jena"},{"id":7109,"cz":"Cvikov","sk":"Cvikov","en":"Cvikov"},{"id":7110,"cz":"Glauchau","sk":"Glauchau","en":"Glauchau"},{"id":7111,"cz":"Freiberg","sk":"Freiberg","en":"Freiberg"},{"id":7112,"cz":"Altzella","sk":"Altzella","en":"Altzella"},{"id":7113,"cz":"Torgau","sk":"Torgau","en":"Torgau"},{"id":7114,"cz":"Albrechtsburg","sk":"Albrechtsburg","en":"Albrechtsburg"},{"id":7115,"cz":"Míšeň","sk":"Míšeň","en":"Meissen"},{"id":7116,"cz":"Drážďany","sk":"Drážďany","en":"Dresden"},{"id":7117,"cz":"Marienberg","sk":"Marienberg","en":"Marienberg"},{"id":7118,"cz":"Chemnitz","sk":"Chemnitz","en":"Chemnitz"},{"id":7119,"cz":"Annaberg","sk":"Annaberg","en":"Annaberg"},{"id":7120,"cz":"Aue","sk":"Aue","en":"Aue"},{"id":7121,"cz":"Plavno","sk":"Plavno","en":"Plauen"},{"id":7122,"cz":"Klingenthal","sk":"Klingenthal","en":"Klingenthal"},{"id":7123,"cz":"Scharfenstein","sk":"Scharfenstein","en":"Scharfenstein"},{"id":7124,"cz":"Lauenstein","sk":"Lauenstein","en":"Lauenstein"},{"id":7125,"cz":"Koenigstein","sk":"Koenigstein","en":"Koenigstein"},{"id":7126,"cz":"Ortenburg","sk":"Ortenburg","en":"Ortenburg"},{"id":7141,"cz":"Bautzen","sk":"Bautzen","en":"Bautzen"},{"id":7142,"cz":"Zhořelec","sk":"Zhořelec","en":"Zhorelec"},{"id":7167,"cz":"Hlohov","sk":"Hlohov","en":"Hlohov"},{"id":7168,"cz":"Zlotoryja","sk":"Zlotoryja","en":"Zlotoryja"},{"id":7169,"cz":"Wlen","sk":"Wlen","en":"Wlen"},{"id":7170,"cz":"Jelení hora","sk":"Jelení hora","en":"Deer mountain"},{"id":7171,"cz":"Lehnické Pole","sk":"Lehnické Pole","en":"Legnickie Pole"},{"id":7172,"cz":"Lehnice","sk":"Lehnice","en":"Legnice"},{"id":7173,"cz":"Javor","sk":"Javor","en":"Javor"},{"id":7174,"cz":"Kamenná Hora","sk":"Kamenná Hora","en":"Kamienna Góra"},{"id":7175,"cz":"Valdenburk","sk":"Valdenburk","en":"Waldenburg"},{"id":7176,"cz":"Lubuš","sk":"Lubuš","en":"Lubiaz"},{"id":7177,"cz":"Górka","sk":"Górka","en":"Górka"},{"id":7178,"cz":"Svídnice","sk":"Svídnice","en":"Swidnica"},{"id":7179,"cz":"Cieplowody","sk":"Cieplowody","en":"Cieplowody"},{"id":7180,"cz":"Nowa Ruda","sk":"Nowa Ruda","en":"Nowa Ruda"},{"id":7143,"cz":"Markersdorf","sk":"Markersdorf","en":"Markersdorf"},{"id":7144,"cz":"Žitava","sk":"Žitava","en":"Žitava"},{"id":7145,"cz":"Henryków Lubański","sk":"Henryków Lubański","en":"Henryków Lubanski"},{"id":7146,"cz":"Lubaň","sk":"Lubaň","en":"Luban"},{"id":7147,"cz":"Frýdlant","sk":"Frýdlant","en":"Frýdlant"},{"id":7148,"cz":"Šluknov","sk":"Šluknov","en":"Šluknov"},{"id":7149,"cz":"Sloup","sk":"Sloup","en":"Sloup"},{"id":7150,"cz":"Liberec","sk":"Liberec","en":"Liberec"},{"id":7151,"cz":"Jablonec","sk":"Jablonec","en":"Jablonec"},{"id":7152,"cz":"Česká Lípa","sk":"Česká Lípa","en":"Ceská Lípa"},{"id":7153,"cz":"Bezděz","sk":"Bezděz","en":"Bezdez"},{"id":7154,"cz":"Kokořín","sk":"Kokořín","en":"Kokorín"},{"id":7155,"cz":"Mladá Boleslav","sk":"Mladá Boleslav","en":"Mladá Boleslav"},{"id":7156,"cz":"Trosky","sk":"Trosky","en":"Trosky"},{"id":7157,"cz":"Kost","sk":"Kost","en":"Kost"},{"id":7158,"cz":"Semily","sk":"Semily","en":"Semily"},{"id":7159,"cz":"Vrchlabí","sk":"Vrchlabí","en":"Vrchlabí"},{"id":7160,"cz":"Dvůr Králové","sk":"Dvůr Králové","en":"Dvur Králové"},{"id":7161,"cz":"Trutnov","sk":"Trutnov","en":"Trutnov"},{"id":7162,"cz":"Broumov","sk":"Broumov","en":"Broumov"},{"id":7163,"cz":"Náchod","sk":"Náchod","en":"Náchod"},{"id":7164,"cz":"Boleslawiec","sk":"Boleslawiec","en":"Boleslawiec"},{"id":7165,"cz":"Nowogrodziec","sk":"Nowogrodziec","en":"Nowogrodziec"},{"id":7166,"cz":"Sobieszów","sk":"Sobieszów","en":"Sobieszów"},{"id":7181,"cz":"Vratislav","sk":"Vratislav","en":"Wroclaw"},{"id":7182,"cz":"Lesnica","sk":"Lesnica","en":"Lesnica"},{"id":7207,"cz":"Toszek","sk":"Toszek","en":"Toszek"},{"id":7208,"cz":"Wieluň","sk":"Wieluň","en":"Wielun"},{"id":7209,"cz":"Daloszyn","sk":"Daloszyn","en":"Daleszyn"},{"id":7210,"cz":"Krzepice","sk":"Krzepice","en":"Krzepice"},{"id":7211,"cz":"Lubliniec","sk":"Lubliniec","en":"Lubliniec"},{"id":7212,"cz":"Zawadzkie","sk":"Zawadzkie","en":"Zawadzkie"},{"id":7213,"cz":"Balchatow","sk":"Balchatow","en":"Belchatów"},{"id":7214,"cz":"Radomsko","sk":"Radomsko","en":"Radomsko"},{"id":7215,"cz":"Dankow","sk":"Dankow","en":"Danków"},{"id":7216,"cz":"Jasná hora","sk":"Jasná hora","en":"Jasna Góra"},{"id":7217,"cz":"Čenstochová","sk":"Čenstochová","en":"Czestochowa"},{"id":7218,"cz":"Bobolice","sk":"Bobolice","en":"Bobolice"},{"id":7219,"cz":"Bytom","sk":"Bytom","en":"Bytom"},{"id":7220,"cz":"Bedzin","sk":"Bedzin","en":"Bedzin"},{"id":7183,"cz":"Lagievniki","sk":"Lagievniki","en":"Lagiewniki"},{"id":7184,"cz":"Zloty Stok","sk":"Zloty Stok","en":"Zloty Stok"},{"id":7185,"cz":"Kladsko","sk":"Kladsko","en":"Klodzko"},{"id":7186,"cz":"Tržebnica","sk":"Tržebnica","en":"Tržebnica"},{"id":7187,"cz":"Olešnice","sk":"Olešnice","en":"Olesnica"},{"id":7188,"cz":"Olava","sk":"Olava","en":"Olawa"},{"id":7189,"cz":"Strzelin","sk":"Strzelin","en":"Strzelin"},{"id":7190,"cz":"Nisa","sk":"Nisa","en":"Nysa"},{"id":7191,"cz":"Twardogora","sk":"Twardogora","en":"Twardogóra"},{"id":7192,"cz":"Chrastawa","sk":"Chrastawa","en":"Chrastawa"},{"id":7193,"cz":"Brzeg","sk":"Brzeg","en":"Brzeg"},{"id":7194,"cz":"Wierušow","sk":"Wierušow","en":"Wieruszow"},{"id":7195,"cz":"Namyslow","sk":"Namyslow","en":"Namyslów"},{"id":7196,"cz":"Wojčice","sk":"Wojčice","en":"Wójcice"},{"id":7197,"cz":"Niemodlin","sk":"Niemodlin","en":"Niemodlin"},{"id":7198,"cz":"Horní Hlohov","sk":"Horní Hlohov","en":"Horní Hlohov"},{"id":7199,"cz":"Sokolniky","sk":"Sokolniky","en":"Sokolniki"},{"id":7200,"cz":"Bobrovniki","sk":"Bobrovniki","en":"Bobrowniki"},{"id":7201,"cz":"Kluczbork","sk":"Kluczbork","en":"Kluczbork"},{"id":7202,"cz":"Karlowice","sk":"Karlowice","en":"Karlowice"},{"id":7203,"cz":"Piastovská věž","sk":"Piastovská věž","en":"Piastian tower"},{"id":7204,"cz":"Opolí","sk":"Opolí","en":"Opole"},{"id":7205,"cz":"Krapkowice","sk":"Krapkowice","en":"Krapkowice"},{"id":7206,"cz":"Strzelce","sk":"Strzelce","en":"Strzelce"},{"id":7221,"cz":"Cheb","sk":"Cheb","en":"Cheb"},{"id":7222,"cz":"Selb","sk":"Selb","en":"Selb"},{"id":7247,"cz":"Nepomuk","sk":"Nepomuk","en":"Nepomuk"},{"id":7248,"cz":"Rábí","sk":"Rábí","en":"Rábí"},{"id":7249,"cz":"Rakovník","sk":"Rakovník","en":"Rakovník"},{"id":7250,"cz":"Křivoklát","sk":"Křivoklát","en":"Krivoklát"},{"id":7251,"cz":"Beroun","sk":"Beroun","en":"Beroun"},{"id":7252,"cz":"Točník","sk":"Točník","en":"Tocník"},{"id":7253,"cz":"Příbram","sk":"Příbram","en":"Príbram"},{"id":7254,"cz":"Orlík","sk":"Orlík","en":"Orlík"},{"id":7255,"cz":"Zvíkov","sk":"Zvíkov","en":"Zvíkov"},{"id":7256,"cz":"Kladno","sk":"Kladno","en":"Kladno"},{"id":7257,"cz":"Levý Hradec","sk":"Levý Hradec","en":"Levý Hradec"},{"id":7258,"cz":"Malá Strana","sk":"Malá Strana","en":"Little Quarter"},{"id":7259,"cz":"Karlštejn","sk":"Karlštejn","en":"Karlštejn"},{"id":7260,"cz":"Pražský Hrad","sk":"Pražský Hrad","en":"Prague Castle"},{"id":7261,"cz":"Dobříš","sk":"Dobříš","en":"Dobríš"},{"id":7262,"cz":"Bechyně","sk":"Bechyně","en":"Bechyne"},{"id":7223,"cz":"Wiesau","sk":"Wiesau","en":"Wiesau"},{"id":7224,"cz":"Weiden","sk":"Weiden","en":"Weiden"},{"id":7225,"cz":"Schwandorf","sk":"Schwandorf","en":"Schwandorf"},{"id":7226,"cz":"Leuchtenberg","sk":"Leuchtenberg","en":"Leuchtenberg"},{"id":7227,"cz":"Neunburg","sk":"Neunburg","en":"Neunburg"},{"id":7228,"cz":"Loket","sk":"Loket","en":"Loket"},{"id":7229,"cz":"Sokolov","sk":"Sokolov","en":"Sokolov"},{"id":7230,"cz":"Kynžvart","sk":"Kynžvart","en":"Kynžvart"},{"id":7231,"cz":"Tachov","sk":"Tachov","en":"Tachov"},{"id":7232,"cz":"Přimda","sk":"Přimda","en":"Primda"},{"id":7233,"cz":"Domažlice","sk":"Domažlice","en":"Domažlice"},{"id":7234,"cz":"Andělská hora","sk":"Andělská hora","en":"Angel´s mountain"},{"id":7235,"cz":"Teplá","sk":"Teplá","en":"Teplá"},{"id":7236,"cz":"Stříbro","sk":"Stříbro","en":"Stríbro"},{"id":7237,"cz":"Bečov","sk":"Bečov","en":"Becov"},{"id":7238,"cz":"Rabštejn","sk":"Rabštejn","en":"Rabštejn"},{"id":7239,"cz":"Plzeň","sk":"Plzeň","en":"Pilsen"},{"id":7240,"cz":"Radyně","sk":"Radyně","en":"Radyne"},{"id":7241,"cz":"Švihov","sk":"Švihov","en":"Švihov"},{"id":7242,"cz":"Velhartice","sk":"Velhartice","en":"Velhartice"},{"id":7243,"cz":"Podbořany","sk":"Podbořany","en":"Podborany"},{"id":7244,"cz":"Plasy","sk":"Plasy","en":"Plasy"},{"id":7245,"cz":"Krakovec","sk":"Krakovec","en":"Krakovec"},{"id":7246,"cz":"Rokycany","sk":"Rokycany","en":"Rokycany"},{"id":7263,"cz":"Mělník","sk":"Mělník","en":"Melník"},{"id":7264,"cz":"Dražice","sk":"Dražice","en":"Dražice"},{"id":7289,"cz":"Roštejn","sk":"Roštejn","en":"Roštejn"},{"id":7290,"cz":"Potštejn","sk":"Potštejn","en":"Potštejn"},{"id":7291,"cz":"Rychnov n. Kněžnou","sk":"Rychnov n. Kněžnou","en":"Rychnov nad Knežnou"},{"id":7292,"cz":"Pardubice","sk":"Pardubice","en":"Pardubice"},{"id":7293,"cz":"Chrudim","sk":"Chrudim","en":"Chrudim"},{"id":7294,"cz":"Česká Třebová","sk":"Česká Třebová","en":"Ceská Trebová"},{"id":7295,"cz":"Svitavy","sk":"Svitavy","en":"Svitavy"},{"id":7296,"cz":"Lanškroun","sk":"Lanškroun","en":"Lanškroun"},{"id":7297,"cz":"Zelená Hora","sk":"Zelená Hora","en":"Zelená Hora"},{"id":7298,"cz":"Žďár n. Sázavou","sk":"Žďár n. Sázavou","en":"Ždár nad Sázavou"},{"id":7299,"cz":"Svojanov","sk":"Svojanov","en":"Svojanov"},{"id":7300,"cz":"Pernštejn","sk":"Pernštejn","en":"Pernštejn"},{"id":7301,"cz":"Blansko","sk":"Blansko","en":"Blansko"},{"id":7302,"cz":"Kuřim","sk":"Kuřim","en":"Kurim"},{"id":7265,"cz":"Staré Město","sk":"Staré Město","en":"Old Town"},{"id":7266,"cz":"Vyšehrad","sk":"Vyšehrad","en":"Vyšehrad"},{"id":7267,"cz":"Jílové","sk":"Jílové","en":"Jílové"},{"id":7268,"cz":"Nymburk","sk":"Nymburk","en":"Nymburk"},{"id":7269,"cz":"Kolín","sk":"Kolín","en":"Kolín"},{"id":7270,"cz":"Lipany","sk":"Lipany","en":"Lipany"},{"id":7271,"cz":"Sázavský klášter","sk":"Sázavský klášter","en":"Monastery of Sázava"},{"id":7272,"cz":"Konopiště","sk":"Konopiště","en":"Konopište"},{"id":7273,"cz":"Tábor","sk":"Tábor","en":"Tábor"},{"id":7274,"cz":"Český Šternberk","sk":"Český Šternberk","en":"Ceský Šternberk"},{"id":7275,"cz":"Blaník","sk":"Blaník","en":"Blaník"},{"id":7276,"cz":"Kámen","sk":"Kámen","en":"Kámen"},{"id":7277,"cz":"Hradec Králové","sk":"Hradec Králové","en":"Hradec Králové"},{"id":7278,"cz":"Poděbrady","sk":"Poděbrady","en":"Podebrady"},{"id":7279,"cz":"Kutná Hora","sk":"Kutná Hora","en":"Kutná Hora"},{"id":7280,"cz":"Kunětická Hora","sk":"Kunětická Hora","en":"Kunetická Hora"},{"id":7281,"cz":"Sion","sk":"Sion","en":"Sion"},{"id":7282,"cz":"Havlíčkův Brod","sk":"Havlíčkův Brod","en":"Havlíckuv brod"},{"id":7283,"cz":"Kladruby","sk":"Kladruby","en":"Kladruby"},{"id":7284,"cz":"Přibyslav","sk":"Přibyslav","en":"Pribyslav"},{"id":7285,"cz":"Lipnice","sk":"Lipnice","en":"Lipnice"},{"id":7286,"cz":"Želivský klášter","sk":"Želivský klášter","en":"Monastery of Želiv"},{"id":7287,"cz":"Pelhřimov","sk":"Pelhřimov","en":"Pelhrimov"},{"id":7288,"cz":"Jihlava","sk":"Jihlava","en":"Jihlava"},{"id":7303,"cz":"Jeseník","sk":"Jeseník","en":"Jeseník"},{"id":7304,"cz":"Bruntál","sk":"Bruntál","en":"Bruntál"},{"id":7329,"cz":"Hlivice","sk":"Hlivice","en":"Hlivice"},{"id":7330,"cz":"Grodziec","sk":"Grodziec","en":"Gorzdiec"},{"id":7331,"cz":"Myslovice","sk":"Myslovice","en":"Myslowice"},{"id":7332,"cz":"Vladislav","sk":"Vladislav","en":"Vladislav"},{"id":7333,"cz":"Žárov","sk":"Žárov","en":"Zory"},{"id":7334,"cz":"Karviná","sk":"Karviná","en":"Karviná"},{"id":7335,"cz":"Ostrava","sk":"Ostrava","en":"Ostrava"},{"id":7336,"cz":"Třinec","sk":"Třinec","en":"Trinec"},{"id":7337,"cz":"Štramberk","sk":"Štramberk","en":"Štramberk"},{"id":7338,"cz":"Frýdek-Mistek","sk":"Frýdek-Mistek","en":"Frýdek-Místek"},{"id":7339,"cz":"Jablunkov","sk":"Jablunkov","en":"Jablunkov"},{"id":7340,"cz":"Čadca","sk":"Čadca","en":"Cadca"},{"id":7341,"cz":"Pruchná","sk":"Pruchná","en":"Pruchná"},{"id":7342,"cz":"Těšín","sk":"Těšín","en":"Tešín"},{"id":7448,"cz":"Bytča","sk":"Bytča","en":"Bytca"},{"id":7305,"cz":"Šumperk","sk":"Šumperk","en":"Šumperk"},{"id":7306,"cz":"Sovinec","sk":"Sovinec","en":"Sovinec"},{"id":7307,"cz":"Bouzov","sk":"Bouzov","en":"Bouzov"},{"id":7308,"cz":"Moravská Třebová","sk":"Moravská Třebová","en":"Moravská Trebová"},{"id":7309,"cz":"Uničov","sk":"Uničov","en":"Unicov"},{"id":7310,"cz":"Olomouc","sk":"Olomouc","en":"Olomouc"},{"id":7311,"cz":"Macocha","sk":"Macocha","en":"Macocha Gorge"},{"id":7312,"cz":"Vyškov","sk":"Vyškov","en":"Vyškov"},{"id":7313,"cz":"Prostějov","sk":"Prostějov","en":"Prostejov"},{"id":7314,"cz":"Svatý Kopeček","sk":"Svatý Kopeček","en":"Saint Hill"},{"id":7315,"cz":"Potštát","sk":"Potštát","en":"Potštát"},{"id":7316,"cz":"Přerov","sk":"Přerov","en":"Prerov"},{"id":7317,"cz":"Vikštejn","sk":"Vikštejn","en":"Vikštejn"},{"id":7318,"cz":"Helfštýn","sk":"Helfštýn","en":"Helfštýn"},{"id":7319,"cz":"Valašské Meziříčí","sk":"Valašské Meziříčí","en":"Valašské Mezirící"},{"id":7320,"cz":"Vsetín","sk":"Vsetín","en":"Vsetín"},{"id":7321,"cz":"Fulnek","sk":"Fulnek","en":"Fulnek"},{"id":7322,"cz":"Nový Jičín","sk":"Nový Jičín","en":"Nový Jicín"},{"id":7323,"cz":"Opava","sk":"Opava","en":"Opava"},{"id":7324,"cz":"Ratiboř","sk":"Ratiboř","en":"Ratibor"},{"id":7325,"cz":"Hlubčice","sk":"Hlubčice","en":"Hlubcice"},{"id":7326,"cz":"Kandřín","sk":"Kandřín","en":"Kedzierzyn"},{"id":7327,"cz":"Kozlí","sk":"Kozlí","en":"Kozle"},{"id":7328,"cz":"Rybník","sk":"Rybník","en":"Rybník"},{"id":7343,"cz":"Řezno","sk":"Řezno","en":"Regensburg"},{"id":7344,"cz":"Roding","sk":"Roding","en":"Roding"},{"id":7369,"cz":"Fürsteneck","sk":"Fürsteneck","en":"Fürsteneck"},{"id":7370,"cz":"Waxenberg","sk":"Waxenberg","en":"Waxenberg"},{"id":7371,"cz":"Linec","sk":"Linec","en":"Linz"},{"id":7372,"cz":"Český Krumlov","sk":"Český Krumlov","en":"Bohemian Crumlaw"},{"id":7373,"cz":"Helfenburk","sk":"Helfenburk","en":"Helfenburk"},{"id":7374,"cz":"Klatovy","sk":"Klatovy","en":"Klatovy"},{"id":7375,"cz":"Kašperk","sk":"Kašperk","en":"Kašperk"},{"id":7376,"cz":"Vimperk","sk":"Vimperk","en":"Vimperk"},{"id":7377,"cz":"Sušice","sk":"Sušice","en":"Sušice"},{"id":7378,"cz":"Strakonice","sk":"Strakonice","en":"Strakonice"},{"id":7379,"cz":"Prachatice","sk":"Prachatice","en":"Prachatice"},{"id":7380,"cz":"Písek","sk":"Písek","en":"Písek"},{"id":7381,"cz":"Vodňany","sk":"Vodňany","en":"Vodnany"},{"id":7382,"cz":"Dívčí kámen","sk":"Dívčí kámen","en":"Girl´s rock"},{"id":7345,"cz":"Cham","sk":"Cham","en":"Cham"},{"id":7346,"cz":"Heilsberg","sk":"Heilsberg","en":"Heilsberg"},{"id":7347,"cz":"Rottenburg","sk":"Rottenburg","en":"Rottenburg"},{"id":7348,"cz":"Mainburg","sk":"Mainburg","en":"Mainburg"},{"id":7349,"cz":"Štrubina","sk":"Štrubina","en":"Straubing"},{"id":7350,"cz":"Brenneberg","sk":"Brenneberg","en":"Brennberg"},{"id":7351,"cz":"Falkenstein","sk":"Falkenstein","en":"Falkenstein"},{"id":7352,"cz":"Řezné","sk":"Řezné","en":"Regen"},{"id":7353,"cz":"Deggendorf","sk":"Deggendorf","en":"Deggendorf"},{"id":7354,"cz":"Landau","sk":"Landau","en":"Landau"},{"id":7355,"cz":"Dingolfing","sk":"Dingolfing","en":"Dingolfing"},{"id":7356,"cz":"Landshut","sk":"Landshut","en":"Landshut"},{"id":7357,"cz":"Erding","sk":"Erding","en":"Erding"},{"id":7358,"cz":"Reisbach","sk":"Reisbach","en":"Reisbach"},{"id":7359,"cz":"Eggenfelden","sk":"Eggenfelden","en":"Eggenfelden"},{"id":7360,"cz":"Vilshofen","sk":"Vilshofen","en":"Vilshofen"},{"id":7361,"cz":"Pfarrkirchen","sk":"Pfarrkirchen","en":"Pfarrkirchen"},{"id":7362,"cz":"Schwaim","sk":"Schwaim","en":"Schwaim"},{"id":7363,"cz":"Schärding","sk":"Schärding","en":"Schärding"},{"id":7364,"cz":"Eferding","sk":"Eferding","en":"Eferding"},{"id":7365,"cz":"Egg","sk":"Egg","en":"Egg"},{"id":7366,"cz":"Grafenau","sk":"Grafenau","en":"Grafenau"},{"id":7367,"cz":"Rinchnach","sk":"Rinchnach","en":"Rinchnach"},{"id":7368,"cz":"Pasov","sk":"Pasov","en":"Passau"},{"id":7383,"cz":"Hluboká n. Vltavou","sk":"Hluboká n. Vltavou","en":"Hluboká n. Vltava River"},{"id":7384,"cz":"České Budějovice","sk":"České Budějovice","en":"Ceské Budejovice"},{"id":7409,"cz":"Götlweig","sk":"Götlweig","en":"Götlweig"},{"id":7410,"cz":"Laudon","sk":"Laudon","en":"Laudon"},{"id":7411,"cz":"Vídeň","sk":"Vídeň","en":"Vienna"},{"id":7412,"cz":"Velké Meziříčí","sk":"Velké Meziříčí","en":"Velké Mezirící"},{"id":7413,"cz":"Templštejn","sk":"Templštejn","en":"Templštejn"},{"id":7414,"cz":"Špilberk","sk":"Špilberk","en":"Špilberk"},{"id":7415,"cz":"Rosa Coeli","sk":"Rosa Coeli","en":"Rosa coeli"},{"id":7416,"cz":"Moravský Krumlov","sk":"Moravský Krumlov","en":"Moravský Krumlov"},{"id":7417,"cz":"Znojmo","sk":"Znojmo","en":"Znojmo"},{"id":7418,"cz":"Holabrunn","sk":"Holabrunn","en":"Holabrunn"},{"id":7419,"cz":"Stockerau","sk":"Stockerau","en":"Stockerau"},{"id":7420,"cz":"Korneuburg","sk":"Korneuburg","en":"Korneuburg"},{"id":7421,"cz":"Mistelbach","sk":"Mistelbach","en":"Mistelbach"},{"id":7422,"cz":"Staatz","sk":"Staatz","en":"Staatz"},{"id":7385,"cz":"Třeboň","sk":"Třeboň","en":"Trebon"},{"id":7386,"cz":"Jindřichův Hradec","sk":"Jindřichův Hradec","en":"Jindrichuv Hradec"},{"id":7387,"cz":"Telč","sk":"Telč","en":"Telc"},{"id":7388,"cz":"Rožmberk","sk":"Rožmberk","en":"Rožmberk"},{"id":7389,"cz":"Nové Hrady","sk":"Nové Hrady","en":"Nové Hrady"},{"id":7390,"cz":"Freistadt","sk":"Freistadt","en":"Freistadt"},{"id":7391,"cz":"Pregarten","sk":"Pregarten","en":"Pregarten"},{"id":7392,"cz":"Dornach","sk":"Dornach","en":"Dornach"},{"id":7393,"cz":"Martinsberg","sk":"Martinsberg","en":"Martinsberg"},{"id":7394,"cz":"Weinberg","sk":"Weinberg","en":"Weinberg"},{"id":7395,"cz":"Vitoraz","sk":"Vitoraz","en":"Weitra"},{"id":7396,"cz":"Pöggstall","sk":"Pöggstall","en":"Pöggstall"},{"id":7397,"cz":"Zwettl","sk":"Zwettl","en":"Zwettl"},{"id":7398,"cz":"Heidenreichstein","sk":"Heidenreichstein","en":"Heidenreichstein"},{"id":7399,"cz":"Landštejn","sk":"Landštejn","en":"Landštejn"},{"id":7400,"cz":"Raabs","sk":"Raabs","en":"Raabs"},{"id":7401,"cz":"Bítov","sk":"Bítov","en":"Bítov"},{"id":7402,"cz":"Třebíč","sk":"Třebíč","en":"Trebíc"},{"id":7403,"cz":"Cornštejn","sk":"Cornštejn","en":"Cornštejn"},{"id":7404,"cz":"Retz","sk":"Retz","en":"Retz"},{"id":7405,"cz":"Eggenburg","sk":"Eggenburg","en":"Eggenburg"},{"id":7406,"cz":"Horn","sk":"Horn","en":"Horn"},{"id":7407,"cz":"Grafenegg","sk":"Grafenegg","en":"Grafenegg"},{"id":7408,"cz":"Maissau","sk":"Maissau","en":"Maissau"},{"id":7423,"cz":"Brno","sk":"Brno","en":"Brno"},{"id":7424,"cz":"Slavkov","sk":"Slavkov","en":"Austerlitz"},{"id":7450,"cz":"Lednica","sk":"Lednica","en":"Lednica"},{"id":7451,"cz":"Žilina","sk":"Žilina","en":"Žilina"},{"id":7452,"cz":"Lietava","sk":"Lietava","en":"Lietava"},{"id":7453,"cz":"Povážská Bystrica","sk":"Povážská Bystrica","en":"Povážská Bystrica"},{"id":7454,"cz":"Ilava","sk":"Ilava","en":"Ilava"},{"id":7455,"cz":"Trenčín","sk":"Trenčín","en":"Trencín"},{"id":7456,"cz":"Tematín","sk":"Tematín","en":"Tematín"},{"id":7457,"cz":"Hlohovec","sk":"Hlohovec","en":"Hlohovec"},{"id":7458,"cz":"Topoľčany","sk":"Topoľčany","en":"Topolcany"},{"id":7459,"cz":"Nitra","sk":"Nitra","en":"Nitra"},{"id":7460,"cz":"Kozárovce","sk":"Kozárovce","en":"Kozárovce"},{"id":7461,"cz":"Banská Štiavnica","sk":"Banská Štiavnica","en":"Banská Štiavnica"},{"id":7462,"cz":"Handlová","sk":"Handlová","en":"Handlová"},{"id":7463,"cz":"Prievidza","sk":"Prievidza","en":"Prievidza"},{"id":7464,"cz":"Bojnice","sk":"Bojnice","en":"Bojnice"},{"id":7465,"cz":"Nitranské Pravno","sk":"Nitranské Pravno","en":"Nitranské Pravno"},{"id":7425,"cz":"Cimburk","sk":"Cimburk","en":"Cimburk"},{"id":7426,"cz":"Dívčí hrady","sk":"Dívčí hrady","en":"Girl´s castles"},{"id":7427,"cz":"Kyjov","sk":"Kyjov","en":"Kyjov"},{"id":7428,"cz":"Kroměříž","sk":"Kroměříž","en":"Kromeríž"},{"id":7429,"cz":"Hodonín","sk":"Hodonín","en":"Hodonín"},{"id":7430,"cz":"Břeclav","sk":"Břeclav","en":"Breclav"},{"id":7431,"cz":"Zistersdorf","sk":"Zistersdorf","en":"Zistersdorf"},{"id":7432,"cz":"Dürnkrut","sk":"Dürnkrut","en":"Dürnkrut"},{"id":7433,"cz":"Gänserndorf","sk":"Gänserndorf","en":"Gänserndorf"},{"id":7434,"cz":"Kúty","sk":"Kúty","en":"Kúty"},{"id":7435,"cz":"Malacky","sk":"Malacky","en":"Malacky"},{"id":7436,"cz":"Prešpurk","sk":"Prešpurk","en":"Prešpurk"},{"id":7437,"cz":"Holíč","sk":"Holíč","en":"Holíc"},{"id":7438,"cz":"Čachtice","sk":"Čachtice","en":"Cachtice"},{"id":7439,"cz":"Senica","sk":"Senica","en":"Senica"},{"id":7440,"cz":"Strážnice","sk":"Strážnice","en":"Strážnice"},{"id":7441,"cz":"Uherské Hradiště","sk":"Uherské Hradiště","en":"Uherské Hradište"},{"id":7442,"cz":"Trnava","sk":"Trnava","en":"Trnava"},{"id":7443,"cz":"Zlín","sk":"Zlín","en":"Zlín"},{"id":7444,"cz":"Vizovice","sk":"Vizovice","en":"Vizovice"},{"id":7445,"cz":"Skalka","sk":"Skalka","en":"Skalka"},{"id":7446,"cz":"Nové Mesto n. Váhom","sk":"Nové Mesto n. Váhom","en":"Nové Mesto n. Váhom"},{"id":7447,"cz":"Piešťany","sk":"Piešťany","en":"Pieštany"},{"id":7449,"cz":"Púchov","sk":"Púchov","en":"Púchov"},{"id":7501,"cz":"Darg an Theie","en":"Darg an Theie","sk":"Darg an Theie"},{"id":7502,"cz":"Severní svahy","en":"Severní svahy","sk":"Severní svahy"},{"id":7503,"cz":"Var el Cug","en":"Var el Cug","sk":"Var el Cug"},{"id":7504,"cz":"Var el Fug","en":"Var el Fug","sk":"Var el Fug"},{"id":7505,"cz":"Pekliska","en":"Pekliska","sk":"Pekliska"},{"id":7506,"cz":"Zmrzlý vrch","en":"Zmrzlý vrch","sk":"Zmrzlý vrch"},{"id":7507,"cz":"Trpasličí hradba","en":"Trpasličí hradba","sk":"Trpasličí hradba"},{"id":7508,"cz":"Chechtavá pláň","en":"Chechtavá pláň","sk":"Chechtavá pláň"},{"id":7509,"cz":"Noriel","en":"Noriel","sk":"Noriel"},{"id":7510,"cz":"Hranice svobody","en":"Hranice svobody","sk":"Hranice svobody"},{"id":7511,"cz":"Boleslavova tvrz","en":"Boleslavova tvrz","sk":"Boleslavova tvrz"},{"id":7512,"cz":"Thak Undol","en":"Thak Undol","sk":"Thak Undol"},{"id":7513,"cz":"Poustevny","en":"Poustevny","sk":"Poustevny"},{"id":7514,"cz":"Salinmon","en":"Salinmon","sk":"Salinmon"},{"id":7515,"cz":"Trojhradí","en":"Trojhradí","sk":"Trojhradí"},{"id":7516,"cz":"Dvojhradí","en":"Dvojhradí","sk":"Dvojhradí"},{"id":7517,"cz":"Horská stezka","en":"Horská stezka","sk":"Horská stezka"},{"id":7518,"cz":"Poslední vzdor","en":"Poslední vzdor","sk":"Poslední vzdor"},{"id":7519,"cz":"Čapí klín","en":"Čapí klín","sk":"Čapí klín"},{"id":7520,"cz":"Skřetobor","en":"Skřetobor","sk":"Skřetobor"},{"id":7521,"cz":"Skřetí loviště","en":"Skřetí loviště","sk":"Skřetí loviště"},{"id":7522,"cz":"Stinné stráně","en":"Stinné stráně","sk":"Stinné stráně"},{"id":7523,"cz":"Inmon el Kemen","en":"Inmon el Kemen","sk":"Inmon el Kemen"},{"id":7524,"cz":"Arcad Ania","en":"Arcad Ania","sk":"Arcad Ania"},{"id":7525,"cz":"Had el Zag","en":"Had el Zag","sk":"Had el Zag"},{"id":7526,"cz":"Undlor","en":"Undlor","sk":"Undlor"},{"id":7527,"cz":"Červený kráter","en":"Červený kráter","sk":"Červený kráter"},{"id":7528,"cz":"Belantis","en":"Belantis","sk":"Belantis"},{"id":7529,"cz":"Mezihoří","en":"Mezihoří","sk":"Mezihoří"},{"id":7530,"cz":"Středohoří","en":"Středohoří","sk":"Středohoří"},{"id":7531,"cz":"Tian el Atan","en":"Tian el Atan","sk":"Tian el Atan"},{"id":7532,"cz":"Suché úbočí","en":"Suché úbočí","sk":"Suché úbočí"},{"id":7533,"cz":"Havraní vrch","en":"Havraní vrch","sk":"Havraní vrch"},{"id":7534,"cz":"Grim el Man","en":"Grim el Man","sk":"Grim el Man"},{"id":7535,"cz":"Písečná planina","en":"Písečná planina","sk":"Písečná planina"},{"id":7536,"cz":"Dobrodruhův hrob","en":"Dobrodruhův hrob","sk":"Dobrodruhův hrob"},{"id":7537,"cz":"Ledr an Ante","en":"Ledr an Ante","sk":"Ledr an Ante"},{"id":7538,"cz":"Zlaté písky","en":"Zlaté písky","sk":"Zlaté písky"},{"id":7539,"cz":"Arcadrass","en":"Arcadrass","sk":"Arcadrass"},{"id":7540,"cz":"Rad Host","en":"Rad Host","sk":"Rad Host"},{"id":7541,"cz":"Lormond","en":"Lormond","sk":"Lormond"},{"id":7542,"cz":"Arthosův lán","en":"Arthosův lán","sk":"Arthosův lán"},{"id":7543,"cz":"Dellatan","en":"Dellatan","sk":"Dellatan"},{"id":7544,"cz":"Khelek Soris","en":"Khelek Soris","sk":"Khelek Soris"},{"id":7545,"cz":"Atan el Thar","en":"Atan el Thar","sk":"Atan el Thar"},{"id":7546,"cz":"Železné štoly","en":"Železné štoly","sk":"Železné štoly"},{"id":7547,"cz":"Travnatá step","en":"Travnatá step","sk":"Travnatá step"},{"id":7548,"cz":"Had an Har","en":"Had an Har","sk":"Had an Har"},{"id":7549,"cz":"Solná stezka","en":"Solná stezka","sk":"Solná stezka"},{"id":7550,"cz":"Půlkraj","en":"Půlkraj","sk":"Půlkraj"},{"id":7551,"cz":"Tichá věž","en":"Tichá věž","sk":"Tichá věž"},{"id":7552,"cz":"Khelek Thar","en":"Khelek Thar","sk":"Khelek Thar"},{"id":7553,"cz":"Tábory vyhnanců","en":"Tábory vyhnanců","sk":"Tábory vyhnanců"},{"id":7554,"cz":"Oáza hojnosti","en":"Oáza hojnosti","sk":"Oáza hojnosti"},{"id":7555,"cz":"Orientální trh","en":"Orientální trh","sk":"Orientální trh"},{"id":7556,"cz":"Arrtol","en":"Arrtol","sk":"Arrtol"},{"id":7557,"cz":"Hobití úvoz","en":"Hobití úvoz","sk":"Hobití úvoz"},{"id":7558,"cz":"Krilor an Har","en":"Krilor an Har","sk":"Krilor an Har"},{"id":7559,"cz":"Und Krilin","en":"Und Krilin","sk":"Und Krilin"},{"id":7560,"cz":"Luka","en":"Luka","sk":"Luka"},{"id":7561,"cz":"Rozcestí","en":"Rozcestí","sk":"Rozcestí"},{"id":7562,"cz":"Klášterní zahrady","en":"Klášterní zahrady","sk":"Klášterní zahrady"},{"id":7563,"cz":"Čertův mlýn","en":"Čertův mlýn","sk":"Čertův mlýn"},{"id":7564,"cz":"Entín","en":"Entín","sk":"Entín"},{"id":7565,"cz":"Vlčina","en":"Vlčina","sk":"Vlčina"},{"id":7566,"cz":"Stříbrný háj","en":"Stříbrný háj","sk":"Stříbrný háj"},{"id":7567,"cz":"Kopřivová pole","en":"Kopřivová pole","sk":"Kopřivová pole"},{"id":7568,"cz":"Jelení obora","en":"Jelení obora","sk":"Jelení obora"},{"id":7569,"cz":"Studna vědění","en":"Studna vědění","sk":"Studna vědění"},{"id":7570,"cz":"Theothar","en":"Theothar","sk":"Theothar"},{"id":7571,"cz":"Zlaté nížiny","en":"Zlaté nížiny","sk":"Zlaté nížiny"},{"id":7572,"cz":"Had an Lin","en":"Had an Lin","sk":"Had an Lin"},{"id":7573,"cz":"Man enel Thar","en":"Man enel Thar","sk":"Man enel Thar"},{"id":7574,"cz":"Jantarový důl","en":"Jantarový důl","sk":"Jantarový důl"},{"id":7575,"cz":"Šmuknov","en":"Šmuknov","sk":"Šmuknov"},{"id":7576,"cz":"Sedlec","en":"Sedlec","sk":"Sedlec"},{"id":7577,"cz":"Bublinkov","en":"Bublinkov","sk":"Bublinkov"},{"id":7578,"cz":"Tirlinis","en":"Tirlinis","sk":"Tirlinis"},{"id":7579,"cz":"Brod v podhradí","en":"Brod v podhradí","sk":"Brod v podhradí"},{"id":7580,"cz":"Podhradní Lhota","en":"Podhradní Lhota","sk":"Podhradní Lhota"},{"id":7581,"cz":"Říše neumírajících","en":"Říše neumírajících","sk":"Říše neumírajících"},{"id":7582,"cz":"Levý Hradec","en":"Levý Hradec","sk":"Levý Hradec"},{"id":7583,"cz":"Zagvar","en":"Zagvar","sk":"Zagvar"},{"id":7584,"cz":"Půlčíkov","en":"Půlčíkov","sk":"Půlčíkov"},{"id":7585,"cz":"Bílá Citadela","en":"Bílá Citadela","sk":"Bílá Citadela"},{"id":7601,"cz":"Trpasličí brána","en":"Trpasličí brána","sk":"Trpasličí brána"},{"id":7602,"cz":"Krčma V Podzemí","en":"Krčma V Podzemí","sk":"Krčma V Podzemí"},{"id":7603,"cz":"Mlžná věž","en":"Mlžná věž","sk":"Mlžná věž"},{"id":7604,"cz":"Věž z kostí","en":"Věž z kostí","sk":"Věž z kostí"},{"id":7605,"cz":"Trpasličí sklady","en":"Trpasličí sklady","sk":"Trpasličí sklady"},{"id":7606,"cz":"Důlní svatyně","en":"Důlní svatyně","sk":"Důlní svatyně"},{"id":7607,"cz":"Zeď nářků","en":"Zeď nářků","sk":"Zeď nářků"},{"id":7608,"cz":"Úhor","en":"Úhor","sk":"Úhor"},{"id":7609,"cz":"Kazadorum","en":"Kazadorum","sk":"Kazadorum"},{"id":7610,"cz":"Kostnice","en":"Kostnice","sk":"Kostnice"},{"id":7611,"cz":"Kamenná věž","en":"Kamenná věž","sk":"Kamenná věž"},{"id":7612,"cz":"Mithrilová hora","en":"Mithrilová hora","sk":"Mithrilová hora"},{"id":7613,"cz":"Dračí hory","en":"Dračí hory","sk":"Dračí hory"},{"id":7614,"cz":"Královské rovy","en":"Královské rovy","sk":"Královské rovy"},{"id":7615,"cz":"Doudleby","en":"Doudleby","sk":"Doudleby"},{"id":7616,"cz":"Černá márnice","en":"Černá márnice","sk":"Černá márnice"},{"id":7617,"cz":"Skalní hroby","en":"Skalní hroby","sk":"Skalní hroby"},{"id":7618,"cz":"Poslední skok","en":"Poslední skok","sk":"Poslední skok"},{"id":7619,"cz":"Trollí stěna","en":"Trollí stěna","sk":"Trollí stěna"},{"id":7620,"cz":"Nekrobor","en":"Nekrobor","sk":"Nekrobor"},{"id":7621,"cz":"Grešlové mýto","en":"Grešlové mýto","sk":"Grešlové mýto"},{"id":7622,"cz":"Runový menhir","en":"Runový menhir","sk":"Runový menhir"},{"id":7623,"cz":"Porta","en":"Porta","sk":"Porta"},{"id":7624,"cz":"Ostroh","en":"Ostroh","sk":"Ostroh"},{"id":7625,"cz":"Rokle smrti","en":"Rokle smrti","sk":"Rokle smrti"},{"id":7626,"cz":"Skřetí tábor","en":"Skřetí tábor","sk":"Skřetí tábor"},{"id":7627,"cz":"Severní líheň","en":"Severní líheň","sk":"Severní líheň"},{"id":7628,"cz":"Osir Dol","en":"Osir Dol","sk":"Osir Dol"},{"id":7629,"cz":"Šamanova chýše","en":"Šamanova chýše","sk":"Šamanova chýše"},{"id":7630,"cz":"Loviště","en":"Loviště","sk":"Loviště"},{"id":7631,"cz":"Hluboké písky","en":"Hluboké písky","sk":"Hluboké písky"},{"id":7632,"cz":"Mořské dno","en":"Mořské dno","sk":"Mořské dno"},{"id":7633,"cz":"Pouštní město","en":"Pouštní město","sk":"Pouštní město"},{"id":7634,"cz":"Palmová kazatelna","en":"Palmová kazatelna","sk":"Palmová kazatelna"},{"id":7635,"cz":"Bílá pláň","en":"Bílá pláň","sk":"Bílá pláň"},{"id":7636,"cz":"Spalující výheň","en":"Spalující výheň","sk":"Spalující výheň"},{"id":7637,"cz":"Barbarská pláň","en":"Barbarská pláň","sk":"Barbarská pláň"},{"id":7638,"cz":"Stanice karavany","en":"Stanice karavany","sk":"Stanice karavany"},{"id":7639,"cz":"Velká zeď","en":"Velká zeď","sk":"Velká zeď"},{"id":7640,"cz":"Koňské pastviny","en":"Koňské pastviny","sk":"Koňské pastviny"},{"id":7641,"cz":"Síň válečníků","en":"Síň válečníků","sk":"Síň válečníků"},{"id":7642,"cz":"Širé pláně","en":"Širé pláně","sk":"Širé pláně"},{"id":7643,"cz":"Měsíční brána","en":"Měsíční brána","sk":"Měsíční brána"},{"id":7644,"cz":"U Dark Elfa","en":"U Dark Elfa","sk":"U Dark Elfa"},{"id":7645,"cz":"Amfiteátr","en":"Amfiteátr","sk":"Amfiteátr"},{"id":7646,"cz":"Skurutí slum","en":"Skurutí slum","sk":"Skurutí slum"},{"id":7647,"cz":"Kostel duší","en":"Kostel duší","sk":"Kostel duší"},{"id":7648,"cz":"Tabáková farma","en":"Tabáková farma","sk":"Tabáková farma"},{"id":7649,"cz":"Cesta nebojácných","en":"Cesta nebojácných","sk":"Cesta nebojácných"},{"id":7650,"cz":"Vědomí pouště","en":"Vědomí pouště","sk":"Vědomí pouště"},{"id":7651,"cz":"Ekh Nerat","en":"Ekh Nerat","sk":"Ekh Nerat"},{"id":7652,"cz":"Kolo bolesti","en":"Kolo bolesti","sk":"Kolo bolesti"},{"id":7653,"cz":"Lví savana","en":"Lví savana","sk":"Lví savana"},{"id":7654,"cz":"Oáza vzteku","en":"Oáza vzteku","sk":"Oáza vzteku"},{"id":7655,"cz":"Zelná poušť","en":"Zelná poušť","sk":"Zelná poušť"},{"id":7656,"cz":"Podzemní tůň","en":"Podzemní tůň","sk":"Podzemní tůň"},{"id":7657,"cz":"Oraniště","en":"Oraniště","sk":"Oraniště"},{"id":7658,"cz":"Božský vchod","en":"Božský vchod","sk":"Božský vchod"},{"id":7659,"cz":"Konopkov","en":"Konopkov","sk":"Konopkov"},{"id":7660,"cz":"Průrva","en":"Průrva","sk":"Průrva"},{"id":7661,"cz":"Panské louky","en":"Panské louky","sk":"Panské louky"},{"id":7662,"cz":"Elfí hvozd","en":"Elfí hvozd","sk":"Elfí hvozd"},{"id":7663,"cz":"Dlážděný úvoz","en":"Dlážděný úvoz","sk":"Dlážděný úvoz"},{"id":7664,"cz":"Zahořany","en":"Zahořany","sk":"Zahořany"},{"id":7665,"cz":"Entí školka","en":"Entí školka","sk":"Entí školka"},{"id":7666,"cz":"Tobyho statek","en":"Tobyho statek","sk":"Tobyho statek"},{"id":7667,"cz":"Lesní pěšina","en":"Lesní pěšina","sk":"Lesní pěšina"},{"id":7668,"cz":"Bor","en":"Bor","sk":"Bor"},{"id":7669,"cz":"Panské sídlo","en":"Panské sídlo","sk":"Panské sídlo"},{"id":7670,"cz":"Přízračný les","en":"Přízračný les","sk":"Přízračný les"},{"id":7671,"cz":"Brána lásky","en":"Brána lásky","sk":"Brána lásky"},{"id":7672,"cz":"Panská cesta","en":"Panská cesta","sk":"Panská cesta"},{"id":7673,"cz":"Ovar tauri","en":"Ovar tauri","sk":"Ovar tauri"},{"id":7674,"cz":"Dílny","en":"Dílny","sk":"Dílny"},{"id":7675,"cz":"Absintov","en":"Absintov","sk":"Absintov"},{"id":7676,"cz":"Semeniště","en":"Semeniště","sk":"Semeniště"},{"id":7677,"cz":"Kraj zlatokopek","en":"Kraj zlatokopek","sk":"Kraj zlatokopek"},{"id":7678,"cz":"Smrtící břehy","en":"Smrtící břehy","sk":"Smrtící břehy"},{"id":7679,"cz":"Rybárny","en":"Rybárny","sk":"Rybárny"},{"id":7680,"cz":"Kolbiště","en":"Kolbiště","sk":"Kolbiště"},{"id":7681,"cz":"Mechový palouk","en":"Mechový palouk","sk":"Mechový palouk"},{"id":7682,"cz":"Pravý Hradec","en":"Pravý Hradec","sk":"Pravý Hradec"},{"id":7683,"cz":"Osamělá věž","en":"Osamělá věž","sk":"Osamělá věž"},{"id":7684,"cz":"Rudá říčka","en":"Rudá říčka","sk":"Rudá říčka"}]');

       this._allSpellsList = JSON.parse('[{"id":80,"img":"images/kouzla/k80.gif","isGood":true,"cz":"Magický štít","sk":"Magický štít","en":"Magic Shield"},{"id":30,"img":"images/kouzla/k30.gif","isGood":true,"cz":"Mana na zlato","sk":"Mana na zlato","en":"Mana To Gold"},{"id":5,"img":"images/kouzla/k5.gif","isGood":true,"cz":"Spokojenost","sk":"Spokojnosť","en":"Content"},{"id":130,"img":"images/kouzla/k130.gif","isGood":true,"cz":"Magický štít velký","sk":"Magický štít veľký ","en":"Large Magic Shield"},{"id":40,"img":"images/kouzla/k40.gif","isGood":true,"cz":"Příznivé počasí","sk":"Priaznivé počasie","en":"Fair Weather"},{"id":60,"img":"images/kouzla/k60.gif","isGood":true,"cz":"Pás zmatení","sk":"Pás zmätenia","en":"Phantom Trail"},{"id":50,"img":"images/kouzla/k50.gif","isGood":true,"cz":"Magické klima","sk":"Magická klíma","en":"Magical Climate"},{"id":105,"img":"images/kouzla/k105.gif","isGood":true,"cz":"Požehnání","sk":"Požehnanie","en":"Blessing"},{"id":70,"img":"images/kouzla/k70.gif","isGood":true,"cz":"Vojenský štít","sk":"Vojenský štít","en":"Military Shield"},{"id":120,"img":"images/kouzla/k120.gif","isGood":true,"cz":"Vojenský štít velký","sk":"Vojenský štít veľký","en":"Large Military Shield"},{"id":90,"img":"images/kouzla/k90.gif","isGood":false,"cz":"Ukrást peníze","sk":"Ukradnúť peniaze","en":"Steal Gold"},{"id":100,"img":"images/kouzla/k100.gif","isGood":false,"cz":"Ukrást manu","sk":"Ukradnúť manu","en":"Steal Mana"},{"id":7,"img":"images/kouzla/k7.gif","isGood":false,"cz":"Nespokojenost","sk":"Nespokojnosť","en":"Discontent"},{"id":10,"img":"images/kouzla/k10.gif","isGood":false,"cz":"Krupobití","sk":"Krupobitie","en":"Hailstorm"},{"id":20,"img":"images/kouzla/k20.gif","isGood":false,"cz":"Magický vír","sk":"Magický vír","en":"Magic Whirl"},{"id":115,"img":"images/kouzla/k115.gif","isGood":false,"cz":"Kletba","sk":"Kliatba ","en":"Curse"},{"id":117,"img":"images/kouzla/k117.gif","isGood":false,"cz":"Dvojitá Kletba","sk":"Dvojitá Kliatba","en":"Double Curse"},{"id":110,"img":"images/kouzla/k110.gif","isGood":false,"cz":"Blesk","sk":"Blesk","en":"Thunderbolt"},{"id":140,"img":"images/kouzla/k140.gif","isGood":false,"cz":"Bouře","sk":"Búrka","en":"Storm"},{"id":160,"img":"images/kouzla/k160.gif","isGood":false,"cz":"Černá smrt","sk":"Čierna smrť","en":"Black Death"},{"id":180,"img":"images/kouzla/k180.gif","isGood":false,"cz":"Smrtící démon","sk":"Smrtiaci démon","en":"Demon of Death"},{"id":190,"img":"images/kouzla/k190.gif","isGood":false,"cz":"Zemětřesení","sk":"Zemetrasenie","en":"Earthquake"},{"id":170,"img":"images/kouzla/k170.gif","isGood":false,"cz":"Uragán","sk":"Uragán","en":"Hurricane"},{"id":193,"img":"images/kouzla/k193.gif","isGood":false,"cz":"Démon kamene","sk":"Démon kameňa","en":"Demon of Stone"},{"id":195,"img":"images/kouzla/k195.gif","isGood":false,"cz":"Démon magie","sk":"Démon mágie","en":"Demon of Magic"},{"id":200,"img":"images/kouzla/k200.gif","isGood":false,"cz":"Soudný den","sk":"Súdny deň","en":"Armageddon"},{"id":3,"img":"images/kouzla/k3.gif","isGood":false,"cz":"Magický šíp","sk":"Magický šíp","en":"Magic Arrow"},{"id":18,"img":"images/kouzla/k18.gif","isGood":true,"cz":"Nápoj lásky","sk":"Nápoj lásky","en":"Love potion"},{"id":4,"img":"images/kouzla/k4.gif","isGood":false,"cz":"Strach","sk":"Strach","en":"Fear"},{"id":15,"img":"images/kouzla/k15.gif","isGood":false,"cz":"Magické oko","sk":"Magické oko","en":"Magic Eye"},{"id":8,"img":"images/kouzla/k8.gif","isGood":false,"cz":"Děs obyvatelstva","sk":"Des obyvateľstva","en":"Panic"},{"id":13,"img":"images/kouzla/k13.gif","isGood":false,"cz":"Odražeč štítů","sk":"Odražeč štítů","en":"Dispel Shields"},{"id":12,"img":"images/kouzla/k12.gif","isGood":true,"cz":"Uzdravení","sk":"Uzdravenie","en":"Tranquility"},{"id":14,"img":"images/kouzla/k14.gif","isGood":true,"cz":"Neovlivnitelnost","sk":"Neovplyvnitelnosť","en":"Natural Growth"},{"id":6,"img":"images/kouzla/k6.gif","isGood":false,"cz":"Povodeň","sk":"Povodeň","en":"Flood"},{"id":9,"img":"images/kouzla/k9.gif","isGood":true,"cz":"Zmrtvýchvstání","sk":"Zmŕtvychvstanie","en":"Animate Dead"},{"id":11,"img":"images/kouzla/k11.gif","isGood":false,"cz":"Zasypání","sk":"Zasypanie","en":"Cave-in"}]');
   }

   function DEKingAjaxProvider(){

       $.ajaxSetup({
           'beforeSend' : function(xhr) {
               xhr.overrideMimeType('text/html; charset=windows-1250');
           },
       });



       this.getMyAliMates = function(callback){

           var that = this;
           $.get('/Aliance.asp', function(data){
               var list = [];


               if ($(data).find("input[name='nazev']").length == 0){

                   $.each($($(data).find('table')[2]).find('tr:not(:first):not(:last)'), function(){


                       var name = $($(this).find('th').find('a')[1]).html();
                       var link = $($(this).find('th').find('a')[0]).attr('href');
                       var id = parseInt(link.replace( /^\D+/g, ''));
                       list.push({ id:id, name:name });

                   });
               }

               callback(list);
           });

       }



       this.getSpells = function(userId, callback){
           $.get('/spells_list.asp?id_player='+userId, function(data){
               callback(data);
           });
       };

       this.getReport = function(userId, callback){
           var userAttr = '';
           if (userId)
               userAttr = '&id_player='+userId;
           $.get('/hlaseni.asp?nastrance=32635'+userAttr, function(data){
               callback(data);
           });
       };

       this.getAttacks = function(userId, callback){
           $.get('/attacks_list.asp?id_player='+userId, function(data){
               callback(data);
           });
       };



       this.clearCache = function(){
           this._myAliMates = null;
       }

   }

   function DEKingExtendRenderer(storageProvider, options, reportLands){
       this._options = options;
       this._storageProvider = storageProvider;
       this._reportLands = reportLands;

       this.renderOptions = function(){
           var that = this;


           var div = $('<table></table>');

           var addCheckbox = function(id, name, checked){
               div.append($('<tr><td>'+name+'</td><td><input type="checkbox" id="'+id+'" '+(checked? 'checked="checked"' : '')+' /></td></div>'));
           }

           for (var key in this._options){
               var opt = this._options[key];
               addCheckbox(key, opt.name, opt.checked);
           }



           var btnRefreshReport = $('<button>Načíst znovu hlášení - nutno jen u změny počtu lidí v ali</button>');
           $(btnRefreshReport).on('click', function(e){
               e.stopPropagation();
               e.preventDefault();
               that._storageProvider.clearReport();

               that.__dialogOptions.dialog('close');
               location.reload();
           });

           var trBtns = $('<tr><td col-span="2"></td></tr>');
           $(div).append(trBtns);
           var tdBtns = $(trBtns).find('td');


           $(tdBtns).append(btnRefreshReport);


           $(div).append('<tr><td col-span="2" style="border-bottom:1px solid;"></td></tr>');
           $(div).append('<tr><td col-span="2" style="text-center">Aktuální data</td></tr>');
           var btnShowActSpells = $('<button>Zobraz</button>');


           $(div).append('<tr><td>Kouzla</td><td></td></tr>');
           var chckSpells = $('<input type="checkbox" checked="checked" />');
           $(div).find('td:last()').append(chckSpells);

           $(div).append('<tr><td>Pouze eko</td><td></td></tr>');
           var chckSpellsOnlyEko = $('<input type="checkbox" />');
           $(div).find('td:last()').append(chckSpellsOnlyEko);

           $(div).append('<tr><td>Útoky</td><td></td></tr>');
           var chckAttacks = $('<input type="checkbox" checked="checked" />');
           $(div).find('td:last()').append(chckAttacks);



           $(div).append('<tr><td col-span="2"></td></tr>');
           $(div).find('td:last()').append(btnShowActSpells);

           $(btnShowActSpells).on('click', function(e){
               e.stopPropagation();
               e.preventDefault();
               that.__dialogOptions.dialog('close');
               that.renderActData({
                   showSpells:$(chckSpells).prop('checked'),
                   onlyEko: $(chckSpellsOnlyEko).prop('checked'),
                   showAttacks:$(chckAttacks).prop('checked')
               });
           });



           return div;
       };

       this.__dialogOptions;
       this.renderOptionsBtn = function(){


           var that = this;
           $('frame[name="lista_informace"]').on('load', function(){
               var btn = $('<a title="DEKing nastavení">!!</a>');

               var iconsFrame = $('frame[name="lista_informace"]').contents().find('#icons_frame');
               $(iconsFrame).css('width', 120);
               $(iconsFrame).append(btn);

               $(btn).on('click', function(){
                   var optionsDiv = that.renderOptions();
                   $('frame[name="mapa"]').contents().find('body').append(optionsDiv);
                   that.__dialogOptions = $(optionsDiv).dialog({
                       close: function() { $(optionsDiv).remove(); },
                       buttons: {
                           save: function(){

                               for (var key in that._options){
                                   var opt = that._options[key];
                                   opt.checked = $(optionsDiv).find('#'+key).is(':checked');
                               }
                               that._storageProvider.saveOptions(that._options);
                               that.renderExtendMap();
                               that.__dialogOptions.dialog('close');
                           }

                       }
                   });
               });
           });
       };


       this.initRenderExtendMap = function(){
           var that = this;
           $('frame[name="mapa"]').on('load', function(){
               that.renderExtendMap();
           });
       };


       this.renderExtendMap = function(){
           this.clearExtend();
           var map = $('frame[name="mapa"]').contents();
           var that = this;

           if (this._options.showBirth.checked){
               $.each($(map).find('div[data-b_natality]'), function(){
                   var birthFromMap = $(this).data('b_natality');
                   var birth = birthFromMap > 100 ? 1 : (birthFromMap == 100 ? 0 : -1);
                   var spanBirth = that.getSpanBirth(birth);
                   $(this).append(spanBirth);
               });
           }


           for (var landId in this._reportLands){
               var divLand = $(map).find('#x'+landId);

               if (divLand.length > 0){
                   var land = this._reportLands[landId];

                   if (land.spells){
                       if (this._options.showBirth.checked){

                           var birthFromMap = $(divLand).data('b_natality');
                           if (!birthFromMap)
                           {
                               var birth = this._getBirth(land);
                               if (birth != null){

                                   var spanBirth = this.getSpanBirth(birth);
                                   $(divLand).append(spanBirth);
                               }
                           }

                       }

                       if (this._options.showSpellsReport.checked || this._options.showSpellsReportOnlyEko.checked){
                           var left = 0;
                           for (var s in land.spells){
                               var spell = land.spells[s];
                               if (!this._options.showSpellsReportOnlyEko.checked || this.isEko(spell)){
                                   $(divLand).append($('<span class="deking-extend" style="top:-10px; left:'+left+'px; position:absolute;" title="'+spell.cz+'"><img style="width:10px; height:10px;" src="'+spell.img+'"/></span>'));

                                   left += 10;
                               }
                           }
                       }
                   }
               }
           }

       };

       this.getSpanBirth = function(birth){
           var color = 'orange';
           if (birth > 0)
               color = 'blue';
           if (birth < 0)
               color = 'red';
           return $('<span class="deking-extend" style="background: '+color+'; width: 10px; height: 10px; border-radius: 50%;position: absolute;top: 28px;left: -5px;"></span>');
       }

       this._getBirth = function(land){
           var spells = land.spells;
           var birthPlus = 0;
           var birthMinus = 0;

           for(var s in land.spells){

               var spell = land.spells[s];
               if (spell.id == 5 || spell.id == 105)
                   birthPlus++;
               if (spell.id == 7 || spell.id == 115)
                   birthMinus++;
               if (spell.id == 117){
                   birthMinus++;
                   birthMinus++;
               }
               if (spell.id == 14) //neovlivnitelnost
                   return 0;
           }

           if (birthPlus == 0 && birthMinus == 0)
               return null;

           if (birthMinus > 1)
               return -1;
           if (birthMinus == 1 && birthPlus > 0)
               return 0;

           if (birthMinus == 1){
               if (land.isMyLand)
                   return -1;
               else
                   return 0;
           }

           if (birthPlus > 0){
               if (land.isMyLand)
                   return 1;
               else
                   return 1; // jako spoko tam je, ale nevíme co dál..
           }
       };

       this._getSpellDom = function(spell){

       };


       this.renderActData = function(opts){
           this._showLoading();
           this.clearExtend();

           var ajaxProvider = new DEKingAjaxProvider();
           var parser = new DEKingParser();
           var that = this;

           ajaxProvider.getMyAliMates(function(myMates){
               if (opts.showSpells || opts.onlyEko)
                   that.renderActSpells(myMates, ajaxProvider, parser, opts);
               if (opts.showAttacks)
                   that.renderActAttacks(myMates, ajaxProvider, parser, opts);

           });
       };

       this.renderActSpells = function(myMates, ajaxProvider, parser, opts){

           var that = this;

           var myMatesCount = myMates.length;
           var lands = {};
           if (myMatesCount ==0)
               that._hideLoading();
           for(var m in myMates){
               var user = myMates[m];

               that.__getSpells(user, lands, parser, ajaxProvider, function(){
                   myMatesCount--;
                   if (myMatesCount == 0)
                       that._renderActSpells(lands, opts);
               });
           }


       };

       this.__getSpells = function(user, lands, parser, ajaxProvider, clbck){
           ajaxProvider.getSpells(user.id, function(dataHtml){
               parser.parseActSpells(dataHtml, lands, user);

               clbck();


           });
       };

       this._renderActSpells = function(lands, opts){
           var map = $('frame[name="mapa"]').contents();
           for(var landId in lands){
               var land = lands[landId];
               var divLand = $(map).find('#x'+landId);

               var left = 0;
               for (var s in land){
                   var spell = land[s].spell;
                   if (!opts.onlyEko || this.isEko(spell)){

                       var sk = land[s].sk;
                       var user = land[s].user;
                       $(divLand).append($('<span class="deking-extend" style="top:-15px; left:'+left+'px; position:absolute;" title="'+spell.cz+' - ' + sk + ' - '+user.name+'"><img style="width:15px; height:15px;" src="'+spell.img+'"/></span>'));

                       left += 15;
                   }
               }

           }


           if (!opts.showAttacks)
               this._hideLoading();
       };

       this.isEko = function(spell){
           var id = spell.id;
           return id == 5 || id == 40 || id == 50 || id == 105 || id == 7 || id == 10 || id == 20 || id == 115 || id == 117 || id == 12 || id == 14;
       };

       this.renderActAttacks = function(myMates, ajaxProvider, parser, opts){

           var that = this;

           var myMatesCount = myMates.length;
           var lands = {};
           if (myMatesCount ==0)
               that._hideLoading();
           for(var m in myMates){
               var user = myMates[m];

               that.__getAttacks(user, lands, parser, ajaxProvider, function(){
                   myMatesCount--;
                   if (myMatesCount == 0)
                       that._renderActAttacks(lands);
               });
           }


       };

       this.__getAttacks = function(user, lands, parser, ajaxProvider, clbck){
           ajaxProvider.getAttacks(user.id, function(dataHtml){
               parser.parseActAttacks(dataHtml, lands, user);

               clbck();


           });
       };

       this._renderActAttacks = function(lands){
           var map = $('frame[name="mapa"]').contents();
           for(var landId in lands){
               var land = lands[landId];
               var divLand = $(map).find('#x'+landId);

               var left = 0;
               for (var s in land){
                   var attack = land[s];

                   $(divLand).append($('<span class="deking-extend" style="background:'+attack.color+'; top:0px; left:'+left+'px; position:absolute;" title="'+attack.from.cz+' - ' + attack.user.name + ' - '+attack.power+'"><img style="width:10px; height:10px;" src="images/s/m.gif"/></span>'));

                   left += 10;
               }

           }


           this._hideLoading();
       };








       this.clearExtend = function(){
           $('frame[name="mapa"]').contents().find('.deking-extend').remove();
       };

       this._showLoading = function(){
           this._loadingDom = $('<div style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; opacity:0.9;"><div>Zpracovávám aktuální data</div><div><img src="http://giphygifs.s3.amazonaws.com/media/EeT7eR2j7X5UA/giphy.gif" /></div></div>');
           $('html').append(this._loadingDom);

       };

       this._hideLoading = function(){
           $(this._loadingDom).remove();
       };

       this.renderOptionsBtn();
       this.initRenderExtendMap();

   }

   function DEKingStorageProvider(user, leagueId, day){
       this.userId = user.replace('_', '-');
       this.leagueId = leagueId;
       this.day = day;

       this._reportPrefix = 'DEKing_report_';

       this.init = function(){
           // toz si smazeme stara data :-)
           for (var key in localStorage){
               if (key.indexOf(this._reportPrefix) > -1){
                   // format key_user_league_day .. takze zkontrolujeme jestli nejsme uz v jine lize
                   var splitted = key.split('_');
                   if (this.userId == splitted[2] && this.leagueId != splitted[3]){
                       localStorage.removeItem(key);
                   }
               }
           }
       };

       this.saveOptions = function(options){
           localStorage.setItem('DEKing_options_' + this.userId, JSON.stringify(options));
       };

       this.getOptions = function(){

           var defaultOptions = {
               useMagicMapSelect: {
                   name: 'Vyber zemek pro kouzleni na mape',
                   checked: true
               },
               useContractTools: {
                   name: 'Hromadne vybery ve smlouvach',
                   checked: true
               },
               useRemoveAllBuildings: {
                   name: 'Sboreni vsech staveb',
                   checked: true
               },
               useBuldingCollectiveBuyFixed: {
                   name: 'Hromadny nakup staveb',
                   checked: false
               },
               useMageCollectiveBuyFixed: {
                   name: 'Hromadny nakup magu',
                   checked: true
               },
               useHousesCollectiveBuyFixed: {
                   name: 'Hromadny nakup domu',
                   checked: true
               },
               useMagicInput: {
                   name: 'Input na kouzla',
                   checked: true
               },
               showBirth:{
                   name: 'Zobrazovat porodnost',
                   checked: true
               },
               showSpellsReport:{
                   name:'Zobrazovat kouzla z hlášení',
                   checked: false
               },
               showSpellsReportOnlyEko:{
                   name:'Zobrazovat kouzla z hlášení - pouze eko',
                   checked: false
               }
           };

           var optionsStr = localStorage.getItem('DEKing_options_' + this.userId);
           if (optionsStr){
               var options = JSON.parse(optionsStr);
               $.extend(true, defaultOptions, options);
           }

           return defaultOptions;
       };


       this.saveReport = function(report){
           localStorage.setItem(this._reportPrefix+this.userId+'_'+this.leagueId+'_'+this.day, JSON.stringify(report));

       };

       this.getReport = function(){
           var reportStr = localStorage.getItem(this._reportPrefix+this.userId+'_'+this.leagueId+'_'+this.day);
           if (reportStr)
               return JSON.parse(reportStr);
           else
               return null;
       };

       this.clearReport = function(){
           localStorage.removeItem(this._reportPrefix+this.userId+'_'+this.leagueId+'_'+this.day);
       };

       this.init();

   };

    function DEKingParser(){
        this._dataProvider = new DEKingDataProvider();

        this.getUserData = function(report){
            var u = $(report).find('u').html();
            var nbsp = '&nbsp;';
            var splitted = u.split(nbsp);



			var userSplit = splitted[1];
            var a = userSplit.substr(userSplit.search('>')+1)
            var user = a.substr(0,a.search('<'))

            var day = $(report).find('select[name="Comp"]').val();

            return { user: user, league:splitted[2].replace('</font>',''), day:day };
        };

        this._isUserMyMate = function(myMates, user){
            for (var m in myMates){
                if (myMates[m].name == user)
                    return true;
            }
            return false;
        };

        this.parseReport = function(report, lands, myMates){
            var that = this;
            var table = $(report).find('table')[1];

            var userData = this.getUserData(report);


            var trSpells = $(table).find('tr[style="font-weight:bold;font-size:small;color:#7777AB;"]');
            $.each(trSpells, function(){
                var parsedTr = that._parseReportTr(this);

                if (!that._isUserMyMate(myMates, parsedTr.user) || parsedTr.user == userData.user){ // pokud figuruje spolualiancnik v mem hlaseni, neresim ho, resim ho u sebe

                    var spell = that._dataProvider.getSpellByImg(parsedTr.imgLink);
                    var land = parsedTr.land;
                    var user = parsedTr.user;


                    var textInfo = $(table).find(this).next('tr').find('td').html();
                    var meWhoCast = textInfo.indexOf('Seslal jsi') == 0 || textInfo.indexOf('Zoslal si') == 0 || textInfo.indexOf('You sent') == 0;

                    var spellSuccess = that._isSuccess(parsedTr.thumb, userData, user, spell.isGood, meWhoCast);


                    if (spellSuccess){
                        if (land == null)
                            debugger;

                        if (lands[land.id] == undefined){
                            lands[land.id] = {};
                            lands[land.id].spells = [];
                        }
                        if (lands[land.id].spells == undefined)
                            debugger;
                        lands[land.id].spells.push(spell);

                        if (parsedTr.user == userData.user)
                            lands[land.id].isMyLand = true;

                    }
                }

            });

            var trAttacks = $(table).find('tr[style="font-weight:bold;font-size:small;color:#CC3322;"]');
            $.each(trAttacks, function(){
                var parsedTr = that._parseReportTr(this);

                if (parsedTr.imgLink == 'images/s/m3.gif'){


                    var isMyLand = parsedTr.user == userData.user;

                    var trInfo = $(table).find(this).next('tr').html();
                    var lines = trInfo.split('<br>');

                    if (lines.length > 1){
                    var landFrom, landTo;
                    var isSuccess;
                    var attack, defense;
                    if (isMyLand){
                        // pokud je to moje zeme, branil jsem - zeme druha je posledni ve strong
                        landFrom = parsedTr.land;
                        landTo = that._dataProvider.getLandByName($(lines[0]).find('strong:last()').html());
                        isSuccess = parsedTr.thumb == 'images/s/hand_down.gif';
                        defense = parseInt(lines[1].replace( /^\D+/g, ''));
                     }
                     else{
                        landTo = parsedTr.land;
                        landFrom = that._dataProvider.getLandByName($(lines[0]).find('strong:last()').html());
                        isSuccess = parsedTr.thumb == 'images/s/hand_up.gif';
                        attack = parseInt($($(lines[0]).find('strong')[1]).html());

                    }

                    if (lands[landFrom.id] == undefined){
                        lands[landFrom.id] = {};
                        lands[landFrom.id].attacks = [];
                        lands[landFrom.id].spells = [];
                    }
                    if (lands[landFrom.id].attacks == undefined)
                        lands[landFrom.id].attacks = [];
                    lands[landFrom.id].attacks.push({
                        landFrom: landFrom,
                        landTo: landTo,
                        isSuccess: isSuccess,
                        attack: attack,
                        defense: defense
                    });
                    if (isMyLand)
                        lands[landFrom.id].isMyLand = true;
                    }
                }


            });

        };

        this._isSuccess = function(thumb, userData, user, isGood, meWhoCast){
            if (userData.user == user){
                if (isGood || meWhoCast)
                    return thumb == 'images/s/hand_up.gif'; // moje zeme a dobre kouzlo, chceme palec nahoru  + cokoliv spatneho co jsem si zakouzlil ja.. dafuq..
                else
                    return thumb == 'images/s/hand_down.gif'; // moje zeme a spatne kouzlo, chceme palec dolu
            }
            else
                return thumb == 'images/s/hand_up.gif'; // pokud je cizi, tak palec hore = proslo
        };

        this._parseReportTr = function(tr){
            var imgLink = $($(tr).find('td')[0]).find('img').attr('src');

            var land = this._dataProvider.getLandByName($($(tr).find('td')[1]).text().split(' - ')[0]);
            var user = $($(tr).find('td')[2]).html().replace('=&gt; ', '');
            var thumb = $($(tr).find('td')[3]).find('img').attr('src');
            return {
                imgLink:imgLink,
                land:land,
                user:user,
                thumb:thumb
            };

        };


        this.parseActSpells = function(data, lands, user){
            var that = this;
            var span = $(data).find('span.ye');
            $(span).find('p').remove();
            var lines = $(span).html().split('<br>');

            $.each(lines, function(){
                var txt = this;

                if (txt != undefined)
                    txt = txt.trim();

                if (txt.indexOf('<font') == 0)
                    txt = $(txt).html();
                if (txt != undefined){
                    txt = txt.trim();

                    if (txt != ''){

                        var splitted = txt.split(' - ');
                        var land = that._dataProvider.getLandByName(splitted[0]);
                        var spell = that._dataProvider.getSpellByName(splitted[1]);
                        var sk = splitted[2].replace( /^\D+/g, '');

                        if (land == null)
                            debugger;

                        if (lands[land.id] == undefined)
                            lands[land.id] = [];

                        lands[land.id].push({ spell:spell, sk: sk, user:user });
                    }
                }

            });

        };

        this.parseActAttacks = function(data, lands, user){
            var that = this;
            var lines = $($(data).find('table')[1]).find('td');

            $.each(lines, function(){
                $(this).find('img').remove();
                var color = $(this).find('font').attr('color');

                var type;
                if (color == '#FF4444')
                    type = 'do';
                else if (color == '#00CC00')
                    type = 'pr';
                else
                    type = 'pl';

                var splitted = $(this).find('font').html().split('<br>');
                var txtLands = splitted[0];

                var landsSplitted = txtLands.split('=&gt;');
                var from = that._dataProvider.getLandByName(landsSplitted[0]);
                var to = that._dataProvider.getLandByName(landsSplitted[1]);


                var power= splitted[1].replace( /^\D+/g, '');


                 if (lands[to.id] == undefined)
                     lands[to.id] = [];

                lands[to.id].push({ from:from, to:to, power: power, user:user, type: type, color:color });
            });

        };

    };


    new DEKing();
})();
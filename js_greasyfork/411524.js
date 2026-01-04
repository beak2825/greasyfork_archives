// ==UserScript==
// @name         Arrangements
// @namespace    http://tampermonkey.net/
// @version      1.3.8
// @description  try to take over the world!
// @author       AlegreVida
// @match        https://s46-tr.ikariam.gameforge.com/?view=city*
// @match        https://s46-tr.ikariam.gameforge.com/?view=island*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411524/Arrangements.user.js
// @updateURL https://update.greasyfork.org/scripts/411524/Arrangements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var myIkaCookies;

    var arr = [
        {
            script_text: "1 - Bina Yükseltmelerinde Kaynak Durumu Göster",
            cookie_id: "buildingUpgrade"
        },
        {
            script_text: "2 - Belediye Binasında Nüfusun Dolması için Kalan Süre",
            cookie_id: "townHall"
        },
        {
            script_text: "3 - Premium ve Vatandaş Tekliflerini Gizle",
            cookie_id: "premiumOffers"
        },
        {
            script_text: "4 - Tamamlanan Günlük Görevleri Gizle",
            cookie_id: "dailyTasks"
        },
        {
            script_text: "5 - Üretim Yeri İçin Gereken Bağışı Göster",
            cookie_id: "donation"
        },
        {
            script_text: "6 - Mucit Atölyesinde Tamamlanan Yükseltmeleri Gizle",
            cookie_id: "workshop"
        },
        {
            script_text: "7 - Şehirdeki Birliklerde Sadece Var Olanları Göster",
            cookie_id: "unitsInCity"
        },
        {
            script_text: "8 - Mesajlaşmada Kültürel Anlaşmaya Öncelik",
            cookie_id: "culturalExchange"
        },
        {
            script_text: "9 - Depoda Güvenli Miktara Ne Kadar Kaldığını Göster",
            cookie_id: "warehouse"
        },
        {
            script_text: "10 - Kışladaki Görünümünü Güncelle",
            cookie_id: "barracks"
        },
        {
            script_text: "11 - Donanma Tersanesindeki Görünümünü Güncelle",
            cookie_id: "shipyard"
        },
        {
            script_text: "12 - Altın Gelirini Göster",
            cookie_id: "gold"
        },
        {
            script_text: "13 - İnşaat Listesindeki Binaların Toplam Malzeme İhtiyacını Göster",
            cookie_id: "amountInConstructionQueue"
        },
        {
            script_text: "14 - Kışla İçin Ekstra Butonlar",
            cookie_id: "unitAmountsInBarracks"
        },
        {
            script_text: "15 - Tersane İçin Ekstra Butonlar",
            cookie_id: "unitAmountsInShipyard"
        }
    ];

    if(getCookie("myIkaCookies") != null){
        myIkaCookies = JSON.parse(getCookie("myIkaCookies"));
    }else{
        myIkaCookies = {
            buildingUpgrade: true,
            townHall: true,
            premiumOffers: true,
            dailyTasks: true,
            donation: true,
            workshop: true,
            unitsInCity: true,
            culturalExchange: true,
            warehouse: false,
            barracks: false,
            shipyard: false,
            gold: true,
            amountInConstructionQueue: true,
            unitAmountsInBarracks: false,
            unitAmountsInShipyard: false
        };
    }
    setCookie("myIkaCookies", JSON.stringify(myIkaCookies), 3);

    $('#GF_toolbar>ul').append("<li id='scriptSettings' style='font-weight:bold; font-size:11px'>Script Ayarları</li>");
    $('#scriptSettings').mouseenter(function(){
        $(this).css('cursor','pointer');
        $('#scriptSettings').css("color", "green");
    });
    $('#scriptSettings').mouseleave(function(){
        $('#scriptSettings').css("color", "black");
    });



    function displayScriptSettings(flag){
        myIkaCookies = JSON.parse(getCookie("myIkaCookies"));
        if(flag){

            function createInputAndLabel(obj){
                var cookie_id = obj.cookie_id;
                var input_id = "script_" + cookie_id[0].toUpperCase() + cookie_id.substring(1);
                var script_text = obj.script_text;
                var check = myIkaCookies[cookie_id];
                var string = "";
                string += "<input id='" + input_id + "' type='checkbox' style='margin-left:4px;margin-right:4px' " + (check ? "checked='checked'" : '') + " />";
                string += "<label class='script-labels' for='" + input_id + "' style='margin-right:4px' >" + script_text + "</label>";
                string += "<br/>";
                return string;
            }

            var htmlText =
                "<div id='scriptSettingsDiv' style='height: auto; width: auto; z-index: 100; background-color: black; float:right;background-color:#fff8d7;padding:4px;border-radius:8px;border: 1px solid black'>" +
                    "<div>" +
                        "<div style='text-align:center;width:90%;float:left'>Ayarlar</div>" +
                        "<div id='hideScriptSettings' style='font-weight:bold;width:5%;float:right;margin-right:4px;cursor:pointer'>X</div>" +
                    "</div>" +
                    "<hr style='width: 95%;margin: 4px auto 4px auto;padding: 0px;'>" +
                    "<div style='width:100%;padding:4px'>" +
                        "<form id='scriptSettingsForm'>";

            for(var obj of arr){
                htmlText += createInputAndLabel(obj);
            }

            htmlText += "<hr style='width: 95%;margin: 4px auto 4px auto;padding: 0px;'>" +
                        "<input type='submit' value='Kaydet' class='button' style='margin:4px 8px 4px 0px;float:right;padding:2px;border-radius:4px'>" +
                    "</form>" +
                "</div>"+
            "</div>";

            $('#GF_toolbar>ul').append(htmlText);
            $('#hideScriptSettings').mouseenter(function(){
                $(this).css('cursor','pointer');
                $('#hideScriptSettings').css("color", "red");
            });
            $('#hideScriptSettings').mouseleave(function(){ $('#hideScriptSettings').css("color", "black"); });
            $('#hideScriptSettings').click(function(){ displayScriptSettings(false); });
        }else{
            $('#scriptSettingsDiv').remove();
        }

    }

    $('#scriptSettings').click(function(){
        displayScriptSettings( $('#scriptSettingsDiv').length == 0);
    });

    function listenerControl(){
        var res = ['wood', 'marble', 'wine', 'glass', 'sulfur'];

        function fnc_BuildingUpgrade(){
            function spanHTML(val, type){
                var res = ['wood', 'marble', 'wine', 'glass', 'sulfur'];
                return '<span id="afterUpgrade_' + res[type] + '" style="color:' + ((val >= 0) ? 'green' : 'red') + '"> (' + val.toLocaleString() + ')</span>';
            }

            function changeSpanHTML(el, player, needed, type){
                if(!isNaN(needed)){
                    if($(el).length){
                        $(el).text(' (' + (player - needed).toLocaleString() + ')');
                        $(el).css("color", (player - needed < 0) ? "red" : "green");
                    }else{
                        $(root).find('.' + res[type]).append(spanHTML(player - needed, type));
                    }
                }
            }

            var root = $('#buildingUpgrade .resources');

            var i = 0;
            for(var resource of res){
                var player = parseInt($('#js_GlobalMenu_' + (resource == "glass" ? "crystal" : resource)).text().replaceAll(",", ""));
                var needed = parseInt($(root).find('.' + resource).clone().children().remove().end().text().replaceAll(",", ""));
                changeSpanHTML($('#afterUpgrade_' + resource), player, needed, i++);
            }

            $(root).find('li').css("width", "150px");
        }
        function fnc_TownHall(){
            $('#townHall .mainContentScroll').css("height", "");

            if($('#timeLeftToFullyPopulate').length){
                return;
            }

            var occupiedSpace = parseInt($('#js_TownHallOccupiedSpace').text());
            var maxInhabitants = parseInt($('#js_TownHallMaxInhabitants').text());
            var space = maxInhabitants - occupiedSpace;
            var happiness = parseInt($('#js_TownHallHappinessLargeValue').text());
            var text = "Boş Konut: " + space;

            if(space > 0){
                var happinessAfterFull = happiness - space;
                var avgSpeed = (happiness + happinessAfterFull)/2/50;
                var t = space / avgSpeed;
                var timeText = Math.floor(t*60)%60 + ' dk';
                if(Math.floor(t) > 0){
                    timeText = Math.floor(t) + ' saat ' + timeText;
                }
                text += '<span id="timeLeftToFullyPopulate"> (' + timeText + ')</span>';
            }
            $('#townHall .stats .space').html(text);
        }
        function fnc_TownHall_PremiumOffer(){
            $('#townHall .premiumOffer').remove();
        }
        function fnc_Barracks_PremiumOffer(){
            $('#premium_btn').remove();
        }
        function fnc_TradeAdvisor_PremiumOffer(){
            if($('#js_premiumAccountOffer').length > 0){
                $('#tradeAdvisor .contentBox01h:last').remove();
                $('#tradeAdvisor .mainContentScroll:first').css("height", "");
            }
        };
        function fnc_MilitaryAdvisor_PremiumOffer(){
            if($('#js_premiumAccountOffer').length > 0){
                $('#militaryAdvisor .contentBox01h:last').remove();
            }
        }
        function fnc_ResearchAdvisor_PremiumOffer(){
            if($('#js_premiumAccountOffer').length > 0){
                $('#researchAdvisor .contentBox01h:last').remove();
            }
        }
        function fnc_DiplomacyAdvisor_PremiumOffer(){
            if($('#js_premiumAccountOffer').length > 0){
                $('#diplomacyAdvisor .contentBox01h:last').remove();
                $('#diplomacyAdvisor .mainContentScroll:first').css("height", "");
            }
        }
        function fnc_DailyTasks(){
            if($('#script_ShowHideCompletedDailyTasks').length == 0){
                $('#dailyTasks>.mainContentScroll>.mainContent>.buildingDescription>div:nth-of-type(1)').append('<button id="script_ShowHideCompletedDailyTasks" show="0" style="float: right; margin-right: 15px;" class="button">Tamamlananları Göster</button>');
            }
            hideCompletedDaily();
            clickListener_ShowHideCompletedDailyTasks();
        }
        function hideCompletedDaily(){
            $('#dailyTasks table.table01 tr.textLineThrough').hide();
            $('#dailyTasks .mainContentScroll').css("height", "");
            $('#script_ShowHideCompletedDailyTasks').attr("show", "0");
            $('#script_ShowHideCompletedDailyTasks').text("Tamamlananları Göster");
        }
        function clickListener_ShowHideCompletedDailyTasks(){
            $('#script_ShowHideCompletedDailyTasks').click(function(){
                if($('#script_ShowHideCompletedDailyTasks').attr("show") == "0"){
                    showCompletedDaily();
                }else{
                    hideCompletedDaily();
                }
            });
        }
        function fnc_Donation(){
            if($('.resUpgrade').length){
                if($('li.accordionItem').length > 1){
                    $("li.accordionItem:last").empty();
                }

                var root = $('li.accordionItem:first .resUpgrade');
                var totalNeeded = parseInt($("li.accordionItem li.wood:first").text().replaceAll(',', ''));
                var current = parseInt($("li.accordionItem li.wood:last").text().replaceAll(',', ''));

                var needed = totalNeeded - current;

                $("#sidebarWidget .resUpgrade:first ul").remove();
                $("#sidebarWidget .resUpgrade:first h4").remove();

                if( $('#upgradeCountDown').length < 1 ){
                    $(root).find(".building_level").after('<h4 class="bold center">Gereken:</h4><ul class="resources"><li class="wood">' + needed.toLocaleString() + '</li></ul>');
                }

            }
        }
        function fnc_Workshop(){
            var root_Units = $('#workshop #tabUnits .content');
            var root_Ships = $('#workshop #tabShips .content');

            for(var i = 1; i <= $(root_Units).find('.units').length; i++){
                if( $(root_Units).find('.units:nth-child(' + i + ') a').length == 0 ){
                    $(root_Units).find('.units:nth-child(' + i + ')').empty();
                }
            }
            for(var i2 = 1; i2 <= $(root_Ships).find('.units').length; i2++){
                if( $(root_Ships).find('.units:nth-child(' + i2 + ') a').length == 0 ){
                    $(root_Ships).find('.units:nth-child(' + i2 + ')').empty();
                }
            }

            if($(root_Units).find('.units').length == 0){
                $(root_Units).empty();
                $(root_Units).append('<h2 style="font-size: 40px;text-align: center;margin-top: 50px;margin-bottom: 50px;"> HELAL LAN SANA !!! </h2>');
            }
            if($(root_Ships).find('.units').length == 0){
                $(root_Ships).empty();
                $(root_Ships).append('<h2 style="font-size: 40px;text-align: center;margin-top: 50px;margin-bottom: 50px;"> HELAL LAN SANA !!! </h2>');
            }

        }
        function fnc_UnitsInCity(){
            var units_FirstRow = $('#cityMilitary #tabUnits .content:first table.table01:first');
            var units_SecondRow = $('#cityMilitary #tabUnits .content:first table.table01:last');
            var ships_FirstRow = $('#cityMilitary #tabShips .content table.table01:first');
            var ships_SecondRow = $('#cityMilitary #tabShips .content table.table01:last');

            var length_Units1 = $(units_FirstRow).find('tr.count td').length;
            var length_Units2 = $(units_SecondRow).find('tr.count td').length;
            var length_Ships1 = $(ships_FirstRow).find('tr.count td').length;
            var length_Ships2 = $(ships_SecondRow).find('tr.count td').length;

            for(var i1 = length_Units1; i1 > 1; i1--){
                var root_Units1 = $(units_FirstRow).find('tr.count td:nth-child(' + i1 + ')');
                var number_Units1 = $(root_Units1).text().slice(0, root_Units1.text().indexOf(' '));

                if(number_Units1 === "-" || number_Units1 == "0"){
                    root_Units1.remove();
                    $(units_FirstRow).find('tr.title_img_row th:nth-child(' + i1 + ')').remove();
                }
            }

            for(var i2 = length_Units2; i2 > 1; i2--){
                var root_Units2 = $(units_SecondRow).find('tr.count td:nth-child(' + i2 + ')');
                var number_Units2 = $(root_Units2).text().slice(0, root_Units2.text().indexOf(' '));

                if(number_Units2 === "-" || number_Units2 == "0"){
                    root_Units2.remove();
                    $(units_SecondRow).find('tr.title_img_row th:nth-child(' + i2 + ')').remove();
                }
            }

            for(var k1 = length_Ships1; k1 > 1; k1--){
                var root_Ships1 = $(ships_FirstRow).find('tr.count td:nth-child(' + k1 + ')');
                var number_Ships1 = $(root_Ships1).text().trim();

                if(number_Ships1 === "-" || number_Ships1 == "0"){
                    root_Ships1.remove();
                    $(ships_FirstRow).find('tr.title_img_row th:nth-child(' + k1 + ')').remove();
                }
            }

            for(var k2 = length_Ships2; k2 > 1; k2--){
                var root_Ships2 = $(ships_SecondRow).find('tr.count td:nth-child(' + k2 + ')');
                var number_Ships2 = $(root_Ships2).text().trim();

                if(number_Ships2 === "-" || number_Ships2 == "0"){
                    root_Ships2.remove();
                    $(ships_SecondRow).find('tr.title_img_row th:nth-child(' + k2 + ')').remove();
                }
            }


            if($(units_FirstRow).find('tr.count td').length == 1){
                $(units_FirstRow).remove();
            }

            if($(units_SecondRow).find('tr.count td').length == 1){
                $(units_SecondRow).remove();
            }

            if($(ships_FirstRow).find('tr.count td').length == 1){
                $(ships_FirstRow).remove();
            }

            if($(ships_SecondRow).find('tr.count td').length == 1){
                $(ships_SecondRow).remove();
            }
        }
        function fnc_CulturalExchange(){
            if( $('#js_treatiesConfirm option[value=77]').length ){
                $('#js_treatiesConfirm option[value=77]').attr('selected', 'selected');
            }
        }
        function fnc_Warehouse(){
            if($('#warehouse').length > 0){
                $('#js_total_safe_capacity').css('color', 'green');
                var capacity = parseInt($('#js_total_safe_capacity').text().replaceAll(',', ''));
                var arr = ["wood", "wine", "marble", "glass", "sulfur"];
                for (var keyword of arr){
                    var total = parseInt($('#js_total_' + keyword).text().replaceAll(',', ''));
                    if(capacity > total){
                        if($('#js_stillSafe_' + keyword).length > 0){
                            $('#js_stillSafe_' + keyword).text('(' + (total-capacity).toLocaleString() + ')');
                        }else{
                            $('#js_plunderable_' + keyword).after('<span style="color:green;margin-left:4px" id="js_stillSafe_' + keyword + '">(' + (total-capacity).toLocaleString() + ')</span>')
                        }
                    }
                }
            }
        }
        function fnc_Barracks(){
            for (var i = 1; i <= $('#barracks #units li').length; i++){
                var element = $('#barracks #units li:nth-of-type('+i+')');
                $(element).find('div:first p').remove();
                $(element).css("min-height", "100px");
                $(element).find('div:first a img').css("height", "75px");
                $(element).find('div:first a img').css("left", "20px");
                $(element).find('div:first div').css("bottom", "16px");
                $(element).find('div.forminput:first').css("bottom", "10px");
                $('#buildUnits div:first p').remove();
                $('#barracks .mainContentScroll:first').css("height", "");
            }
        }

        function fnc_BarracksUnitAmount(){
            fnc_UnitAmounts("barracks", [10, 50, 100], true);
        }
        function fnc_Shipyard(){
            for (var i = 1; i <= $('#shipyard #units li').length; i++){
                var element = $('#shipyard #units li:nth-of-type('+i+')');
                $(element).find('div:first p').remove();
                $(element).css("min-height", "100px");
                $(element).find('div:first a img').css("height", "75px");
                $(element).find('div:first a img').css("left", "20px");
                $(element).find('div:first div').css("bottom", "16px");
                $(element).find('div.forminput:first').css("bottom", "50px");
                $('#buildUnits div:first p').remove();
                $('#barracks .mainContentScroll:first').css("height", "");
            }
        }
        function fnc_ShipyardUnitAmount(){
            fnc_UnitAmounts("shipyard", [3, 12, 30], false);
        }
        function fnc_UnitAmounts(div, arr, flag){
            for (var i = 1; i <= $('#' + div + ' #units li').length; i++){
                var element = $('#' + div + ' #units li:nth-of-type('+i+')');
                if($('#js_barracksBuyMax' + i).hasClass('invisible')){
                    $('#js_barracksProblemTextfield' + i).parent().css("bottom", "80px");
                    continue;
                }
                if($('#script_changeUnits_' + i).length>0){
                    continue;
                }
                var amountAlready = parseInt($('#sliderbg_barracks' + i).attr('title'));
                var htmlText = "";
                htmlText += "<div id='script_changeUnits_" + i + "' style='padding: 4px'>";

                for(var m = 0; m < 3; m++){
                    for(var k = 0; k < 2; k++){
                        var pad = 4;
                        if(arr[m] < 100){
                            pad += 3;
                            if(k == 0){
                                pad += .5;
                            }
                        }
                        if(arr[m] < 10){
                            pad += 3;
                        }
                        if(arr[m] >= 100){
                            pad -= 0.5;
                        }
                        var paddingText = "2px " + pad + "px";
                        var marginText = (k < 1) ? ";margin-right: 6px" : "";
                        htmlText += "<button id='script_btn_" + i + "_" + arr[m] + "_" + k + "'  class='button changeUnitAmount' style='padding:" + paddingText + marginText + "' " + onclickText(i, amountAlready+(arr[m]*(k == 1 ? 1 : -1))) + ">" + (k == 1 ? "+" : "-") + arr[m] + "</button>";
                    }
                    htmlText += "<br />";
                }
                htmlText += "</div>";
                var formInput = $(element).find('div:nth-of-type(3) div:nth-of-type(2)').after(htmlText);
            }
            $('.changeUnitAmount').each(function(index){

                $(this).on("click", function(){
                    var id = $(this).attr('id').split('_')[2];
                    var amountAlready = parseInt($('#sliderbg_barracks' + id).attr('title'));
                    $('#' + div + ' #units li:nth-of-type('+id+') .changeUnitAmount').each(function(index){
                        var attrs = $(this).attr("id").split('_');
                        var amount = amountAlready + (attrs[3]*(attrs[4] == 1 ? 1 : -1));
                        $('#' + div + ' #units li:nth-of-type('+id+') .changeUnitAmount:nth-of-type(' + (index+1) + ')').attr("onclick", "ikariam.controller.sliders['slider_barracks" + id + "'].setActualValue(" + (amount < 0 ? 0 : amount) + "); return false;");
                    });
                });
            });

            $('.unit').each(function(index){
                var forminput = $(this).find(".forminput");
                $(forminput).css("text-align", "center");
                if($(forminput).css("bottom") != "80px"){
                    $(forminput).css("bottom", "25px");
                }
                $(forminput).find("a").text("max");
                if($(forminput).find(".textfieldContainer br").length == 0){
                    $(forminput).find("a").before("<br/>");
                }
            });

            function onclickText(id, amount){
                return "onclick=\"ikariam.controller.sliders['slider_barracks" + id + "'].setActualValue(" + (amount < 0 ? 0 : amount) + "); return false;\"";
            }
        }
        function fnc_DisplayGoldIncome(){
            var gold = parseInt($('#js_GlobalMenu_gold_Calculation').text().replaceAll(',', ''));
            var textGold = gold.toLocaleString();
            if($('#script_gold').length > 0){
                $('#script_gold').text("(" + textGold + ")");

            }else{
                $('#js_GlobalMenu_gold').append("<span id='script_gold' style='display: block;font-size: 9px;padding: 0px;line-height: 9px;'>(" + textGold + ")</span>");
                $('#js_GlobalMenu_gold').css("line-height", "19px");
            }
            $('#script_gold').css("color", (gold >= 0) ? "green" : "crimson");
        }
        function fnc_ResourceAmountsInConstructionQueue(){
            if($('#constructionList h4').length == 1){
                return;
            }
            var resourceType = ["wood","wine","marble","glass","sulfur"];
            var totalResourcesInQueue = {"wood": 0, "wine":0, "marble":0, "glass": 0, "sulfur": 0};
            var resourceAmountOwn = {"wood": 0, "wine":0, "marble":0, "glass": 0, "sulfur": 0};
            var resourceProduce = {"wood": 0, "wine":0, "marble":0, "glass": 0, "sulfur": 0};
            resourceAmountOwn["wood"] = parseInt($("#js_GlobalMenu_wood").text().replaceAll(",",""));
            resourceAmountOwn["wine"] = parseInt($("#js_GlobalMenu_wine").text().replaceAll(",",""));
            resourceAmountOwn["marble"] = parseInt($("#js_GlobalMenu_marble").text().replaceAll(",",""));
            resourceAmountOwn["glass"] = parseInt($("#js_GlobalMenu_crystal").text().replaceAll(",",""));
            resourceAmountOwn["sulfur"] = parseInt($("#js_GlobalMenu_sulfur").text().replaceAll(",",""));
            resourceProduce["wood"] = parseInt($("#js_GlobalMenu_resourceProduction").text().replaceAll("-", "0"));
            resourceProduce["wine"] = parseInt($("#js_GlobalMenu_production_wine").text().replaceAll("-", "0"));
            resourceProduce["marble"] = parseInt($("#js_GlobalMenu_production_marble").text().replaceAll("-", "0"));
            resourceProduce["glass"] = parseInt($("#js_GlobalMenu_production_crystal").text().replaceAll("-", "0"));
            resourceProduce["sulfur"] = parseInt($("#js_GlobalMenu_production_sulfur").text().replaceAll("-", "0"));
            console.log(resourceProduce);
            var resourceIcons = {"wood": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_wood.png",
                                 "marble": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_marble.png",
                                 "wine": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_wine.png",
                                 "glass": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_glass.png",
                                 "sulfur":"https://s46-tr.ikariam.gameforge.com/skin/resources/icon_sulfur.png"};

            $("#constructionList li").each(function( index ) {
                $(this).find(".tooltip").find("div").each(function(ind){
                    if(ind >= 2) {
                        var resourceType = $(this).find("img").attr("src").split("_")[1];
                        if(resourceType == "crystal") {
                            resourceType = "glass";
                        }
                        var resourceAmount = parseInt($(this).find("span").html().replaceAll(",",""));
                        totalResourcesInQueue[resourceType] += resourceAmount;
                    }
                });
            });

            if($('#script_AmountsInConstructionQueue').length == 0){
                var htmlOutput = "<h4>Toplam Malzeme İhtiyacı</h4>";
                htmlOutput += '<li id="script_AmountsInConstructionQueue"><table>';
                resourceType.forEach(function(element, index){
                    /*if((element == "wood" || element == "marble") && resourceProduce[element] > 0){
                        console.log("LISTE!!!");
                        var x = {
                            "wood" : {
                                'divIndex' : 3
                            },
                            "marble" : {
                                'divIndex' : 4
                            }
                        }
                        var times = $('#buildCountDown').text().split(" ");
                        console.log(times);
                        var totalMin = 0;
                        if(times[0].substring(times[0].length-1, times[0].length) == "s" && times[1].substring(times[1].length-2, times[1].length) == "dk"){
                            console.log("SAAT VE DAKİKA!");
                            totalMin = parseInt((times[0].split("s"))[0])*60 + parseInt((times[1].split("dk"))[0]);
                        }else if(times[0].substring(times[0].length-2, times[0].length) == "dk"){
                            console.log("DAKİKA!");
                            totalMin = parseInt((times[0].split("dk"))[0]);
                        }
                        console.log(totalMin + " DK");
                        resourceAmountOwn[element] += Math.floor(resourceProduce[element]*totalMin/60);
                        var length = $('#constructionList li').length;
                        console.log("Listedeki Bina Sayısı: " + length);
                        var totalNeed = 0;
                        var req = 0;
                        for(var i = 1; i < length; i++){
                            req += parseInt($('#constructionList li:nth-of-type(' + i + ') div.tooltip div:nth-of-type(' + x[element]['divIndex'] + ') span').text().replaceAll(',', '')) + 100;
                            console.log("i: " + i);
                            console.log("\tReq: " + req);
                            console.log("\AmountOwn: " + resourceAmountOwn[element]);
                            if(req > resourceAmountOwn[element]){
                                console.log("\t\tLack Of Materials!");
                                console.log("\t\tTotal Need Before: " + totalNeed);
                                totalNeed += req - (resourceAmountOwn[element]);
                                console.log("\t\tTotal Need After: " + totalNeed);
                                resourceAmountOwn[element] = req;
                            }

                            var t = $('#buildingQueue' + i).text().split(" ");
                            console.log("\t\t\tNew Time: " + t[0] + " " + t[1]);
                            var tempMin = 0;
                            if(t[0].substring(t[0].length-1, t[0].length) == "s" && t[1].substring(t[1].length-2, t[1].length) == "dk"){
                                console.log("\t\t\tSAAT VE DAKİKA!");
                                tempMin = parseInt(t[0].split("s")[0])*60 + parseInt(t[1].split("dk")[0]);
                            }else if(t[0].substring(t[0].length-2, t[0].length) == "dk"){
                                console.log("\t\t\tDAKİKA!");
                                tempMin = parseInt(t[0].split("dk")[0]);
                            }
                            console.log("\t\t\t" + totalMin + " DK");
                            console.log("\t\t\tÜretimden Önce: " + resourceAmountOwn[element]);
                            resourceAmountOwn[element] += Math.floor(resourceProduce[element]*(tempMin-totalMin)/60);
                            totalMin = tempMin;
                            console.log("\t\t\tÜretimden Sonra: " + resourceAmountOwn[element]);
                        }
                    }*/

                    if(totalResourcesInQueue[element] > 0 ) {
                        var minusDiff = '';
                        if(totalResourcesInQueue[element] > resourceAmountOwn[element]) {
                            minusDiff = '<span style="color: red; font-weight:bold">('+(resourceAmountOwn[element] - totalResourcesInQueue[element]).toLocaleString()+')</span>';
                        }
                        htmlOutput += '<tr id="script_' + element + '_AmountInQueue" ><td><img src="'+resourceIcons[element]+'" style="margin-right: 6px; margin-left: 6px;"></td><td>'+totalResourcesInQueue[element].toLocaleString()+ ' ' + minusDiff + '</td></tr>';
                    }
                });
                htmlOutput += '</table></li>';

                $("#constructionList").after(htmlOutput);
            }else{
                resourceType.forEach(function(element, index){
                    if(totalResourcesInQueue[element] > 0 ) {
                        var minusDiff = '';
                        if(totalResourcesInQueue[element] > resourceAmountOwn[element]) {
                            minusDiff = '<span style="color: red; font-weight:bold">('+(resourceAmountOwn[element] - totalResourcesInQueue[element]).toLocaleString()+')</span>';
                        }

                        if($('#script_' + element + '_AmountInQueue').length == 0){
                            var htmltext = '<tr><td id="script_' + element + '_AmountInQueue" ><img src="'+resourceIcons[element]+'" style="margin-right: 6px; margin-left: 6px;"></td><td>'+totalResourcesInQueue[element].toLocaleString()+ ' ' + minusDiff + '</td></tr>';
                            $('#script_AmountsInConstructionQueue table').append(htmltext);
                        }else{
                            $('#script_' + element + '_AmountInQueue td:last').html(totalResourcesInQueue[element].toLocaleString() + ' ' + minusDiff);
                        }

                    }else{
                        $('#script_' + element + '_AmountInQueue').remove();
                    }
                });
            }
        }

        if(myIkaCookies.gold){
            fnc_DisplayGoldIncome();
        }

        createListener(myIkaCookies.buildingUpgrade, "buildingUpgrade", fnc_BuildingUpgrade, false);
        createListener(myIkaCookies.townHall, "townHall", fnc_TownHall, false);
        createListener(myIkaCookies.premiumOffers, "townHall", fnc_TownHall_PremiumOffer, false);
        createListener(myIkaCookies.premiumOffers, "barracks", fnc_Barracks_PremiumOffer, false);
        createListener(myIkaCookies.premiumOffers, "tradeAdvisor", fnc_TradeAdvisor_PremiumOffer, false);
        createListener(myIkaCookies.premiumOffers, "militaryAdvisor", fnc_MilitaryAdvisor_PremiumOffer, false);
        createListener(myIkaCookies.premiumOffers, "researchAdvisor", fnc_ResearchAdvisor_PremiumOffer, false);
        createListener(myIkaCookies.premiumOffers, "diplomacyAdvisor", fnc_DiplomacyAdvisor_PremiumOffer, false);
        createListener(myIkaCookies.dailyTasks, "dailyTasks", fnc_DailyTasks, false);
        createListener(myIkaCookies.donation, "", fnc_Donation, false);
        createListener(myIkaCookies.workshop, "workshop", fnc_Workshop, false);
        createListener(myIkaCookies.unitsInCity, "cityMilitary", fnc_UnitsInCity, false);
        createListener(myIkaCookies.culturalExchange, "sendIKMessage", fnc_CulturalExchange, false);
        createListener(myIkaCookies.warehouse, "warehouse", fnc_Warehouse, false);
        createListener(myIkaCookies.barracks, "barracks", fnc_Barracks, false);
        createListener(myIkaCookies.shipyard, "shipyard", fnc_Shipyard, false);
        createListener(myIkaCookies.gold, "js_GlobalMenu_gold_Calculation", fnc_DisplayGoldIncome, true);
        createListener(myIkaCookies.amountInConstructionQueue, "constructionList", fnc_ResourceAmountsInConstructionQueue, false);
        createListener(myIkaCookies.unitAmountsInBarracks, "barracks", fnc_BarracksUnitAmount, false);
        createListener(myIkaCookies.unitAmountsInShipyard, "shipyard", fnc_ShipyardUnitAmount, false)
    }

    function showCompletedDaily(){
        $('#dailyTasks table.table01 tr.textLineThrough').show();
        $('#dailyTasks .mainContentScroll').css("height", "");
        $('#script_ShowHideCompletedDailyTasks').attr("show", "1");
        $('#script_ShowHideCompletedDailyTasks').text("Tamamlananları Gizle");
    }

    // Araştırmadaki Listeyi Düzelt
    var flag_Workshop = true;
    var flag_ResearchAdvisor = true;
    var listener_ResearchAdvisor = $('body').on('DOMSubtreeModified', '#researchAdvisor', fnc_ResearchAdvisor);
    function fnc_ResearchAdvisor(){
        if($('#researchAdvisor').length > 0 && flag_Workshop){
            flag_Workshop = false;
            $('#researchAdvisor #js_researchAdvisorCurrResearchesArr a').css('float', 'right');
            $('#researchAdvisor #js_researchAdvisorCurrResearchesArr a').css('margin', '0');
            flag_Workshop = true;
        }
    }

    listenerControl();

    $(document).ready(function() {
        $(document).on('submit', '#scriptSettingsForm', function() {

            var myNewCookies = {
                buildingUpgrade: $('#script_BuildingUpgrade').is(":checked"),
                townHall: $('#script_TownHall').is(":checked"),
                premiumOffers: $('#script_PremiumOffers').is(":checked"),
                dailyTasks: $('#script_DailyTasks').is(":checked"),
                donation: $('#script_Donation').is(":checked"),
                workshop: $('#script_Workshop').is(":checked"),
                unitsInCity: $('#script_UnitsInCity').is(":checked"),
                culturalExchange: $('#script_CulturalExchange').is(":checked"),
                warehouse: $('#script_Warehouse').is(":checked"),
                barracks: $('#script_Barracks').is(":checked"),
                shipyard: $('#script_Shipyard').is(":checked"),
                gold: $('#script_Gold').is(":checked"),
                amountInConstructionQueue: $('#script_AmountInConstructionQueue').is(":checked"),
                unitAmountsInBarracks: $('#script_UnitAmountsInBarracks').is(":checked"),
                unitAmountsInShipyard: $('#script_UnitAmountsInShipyard').is(":checked")
            }

            eraseCookie("myIkaCookies");
            setCookie("myIkaCookies", JSON.stringify(myNewCookies), 3);
            window.location.reload();

            return false;
        });
    });


/*
Example Listener

function fnc_Listener(){
    function fnc(){

    };

    var params = {
        id: 'element_id',
        parent: document.querySelector('body'),
        recursive: false,
        done: function() {
            fnc();
        }
    };

    new MutationObserver(function(mutations) {
        params.done();
    }).observe(params.parent || document, {
        childList: true
    });
};
fnc_Listener();


????????????????????????????
const targetNode = document.getElementById('dailyTasks')[0];
const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
observer.disconnect();
*/

//////////////////////////////////////////////////////////////////////////////////////
//                 LISTENER CREATOR - START
//
function createListener(flag, element_id, doneFunction, flag2){
    if(!flag){
       return;
    }

    var params = {
        parent: document.querySelector('body'),
        recursive: false,
        done: function() {
            doneFunction();
        }
    };

    if(element_id != ""){
        params.id = element_id;
    }

    var config = { childList: true };

    if(false)
        config = { characterData: true, attributes: false, childList: false, subtree: true };

    new MutationObserver(function(mutations) {
        params.done();
    }).observe(params.parent || document, config);
}
//
//                 LISTENER CREATOR - END
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//                 COOKIES - START
//
    function setCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    function eraseCookie(key) {
        var keyValue = getCookie(key);
        setCookie(key, keyValue, '-1');
    }
//
//                 COOKIES - END
//////////////////////////////////////////////////////////////////////////////////////

    function fnc_BuildingsTableListener(){

        function fnc_BuildingsTable(){
            if($('#js_tab_premiumTradeAdvisorBuildings').hasClass('selected')){

                //var city = {name:"", id:"", link:"", buildings:(new Array(30)) };
                //var building = {lvl:0, status:0, link:""};

                var cities = new Array($('.table01:first tr').length-1);
                var cityPNG = 'skin/layout/city.png';

                var buildingCounter = 0;

                var allBuildings = new Array(30);
                for (var x = 1; x <= $('#buildingsOverview .table01').length; x++){
                    for (var y = 2; y <= $('#buildingsOverview .table01:nth-of-type('+x+') tr.headingrow th').length; y++){
                        var th = $('#buildingsOverview .table01:nth-of-type('+x+') tr.headingrow th:nth-of-type('+y+') img');
                        allBuildings[buildingCounter] = { title:th.attr('title'), src:th.attr('src') };
                        buildingCounter = buildingCounter + 1;
                    }
                }

                console.log("Length of AllBuildings: " + allBuildings.length);

                buildingCounter = 0;

                for(var a = 2; a <= $('#buildingsOverview .table01:first tr').length; a++){
                    var link = $('#buildingsOverview .table01:first tr:nth-of-type(' + a + ') a');
                    var href = $('#buildingsOverview .table01:first tr:nth-of-type(' + a + ') a').attr('href');
                    var city = {
                        name:link.text(),
                        link:href,
                        id:href.slice(href.lastIndexOf('=')+1, href.length),
                        buildings:new Array(30)
                    };
                    cities[a-2] = city;
                }

                for(var i = 1; i <= $('#buildingsOverview .table01').length; i++){
                    var table = $('#buildingsOverview .table01:nth-of-type(' + i + ')');
                    for(var j = 2; j <= $(table).find('tr').length; j++){
                        var row = $(table).find('tr:nth-of-type(' + j + ')');
                        for(var k = 1; k <= $(row).find('td').length; k++){
                            var td = $(row).find('td:nth-of-type(' + k + ')');
                            var buildingLink = $(row).find('td:nth-of-type(' + k + ') a');
                            var flag = $(buildingLink).length > 0 ? true : false;
                            var build = {
                                lvl: flag ? $(buildingLink).text() : "-",
                                link: flag ? $(buildingLink).attr('href') : null,
                                status:0
                            };



                            if($(td).find('div.upgrade').length > 0){
                                build.status = 1;
                            }else if($(td).find('div.upgradeList').length > 0){
                                build.status = 2;
                            }

                            cities[j-2].buildings[(i-1)*5 + k-1] = build;
                        };
                    };
                }

                //var upgradeHTML = '<td class="building"><div class="upgradeList"><a href="?view=city&dialog=' + keyword + '&cityId=' + cityId + '" class">' + cityLvl + '<span>' + timeText + '</span></a></div></td>';
                //var upgradeListHTML = '<td class="building"><div class="upgrade"><a href="?view=city&dialog=' + keyword + '&cityId=' + cityId + '">' + cityLvl + '<span>' + timeText + '</span></a></div></td>';


                while($('#buildingsOverview .content .table01').length > 1){
                    $('#buildingsOverview .content .table01:last').remove();
                }

                while($('#buildingsOverview .content .table01 tr:first th').length > 1){
                    $('#buildingsOverview .content .table01 tr:first th:last').remove();
                }

                for(var i2 = 2; i2 <= $('#buildingsOverview .content .table01 tr').length; i2++){
                    while($('#buildingsOverview .content .table01 tr:nth-of-type(' + i2 + ') td').length > 0){
                        $('#buildingsOverview .content .table01 tr:nth-of-type(' + i2 + ') td:last').remove();
                    }
                }


                var z = 0;
                while(z <= 29){
                    $('#buildingsOverview .content .table01:first tr:nth-of-type(1)').append('<th class="building" title="' + allBuildings[z].title + '"><img width="28px" src="' + allBuildings[z].src + '" alt="' + allBuildings[z].title + '" title="' + allBuildings[z].title + '"></th>');
                    z++;
                }

                for(var w = 2; w <= $('#buildingsOverview .content:first .table01:first tbody tr').length; w++){
                    var v = 0;
                    while(v <= 29){
                        if(cities[w-2].buildings[v].status == 0){
                            if(cities[w-2].buildings[v].link == null){
                                $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building">-</td>');
                            }else{
                                $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><a href="' + cities[w-2].buildings[v].link + '">'+ cities[w-2].buildings[v].lvl +'</a></td>');
                            }
                        }else if(cities[w-2].buildings[v].status == 1){
                            $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><div class="upgrade"><a href="' + cities[w-2].buildings[v].link + '">' + cities[w-2].buildings[v].lvl + '</a></div></td>');
                        }else if(cities[w-2].buildings[v].status == 2){
                            $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><div class="upgradeList"><a href="' + cities[w-2].buildings[v].link + '">' + cities[w-2].buildings[v].lvl + '</a></div></td>');
                        }
                        v = v+1;
                    }
                }

                $('#premiumTradeAdvisorBuildings').css("width", "auto");
                $('.mainContentScroll:first').css("width", "auto");
                $('#buildingsOverview').css("width", "auto");
                $('#premiumTradeAdvisorBuildings>div.mainHeader').css("background-position-x", "center");
                $('.mainContentScroll:first').css("height", "");
                $('#premiumTradeAdvisorBuildings_c').css("left", "75px");
                $('#premiumTradeAdvisorBuildings_c').css("top", "250px");
                $('#premiumTradeAdvisorBuildings_c').css("right", "auto");
                $('#premiumTradeAdvisorBuildings_c').css("z-index", "98");

                $('#premiumTradeAdvisorBuildings ul.tabmenu').css("width", "100%");

                $('#js_backlinkButton').css("left", "880px");
                $('#premiumTradeAdvisorBuildings div.close').css("left", "900px");
                //$('#buildingsOverview .content').append('<table class="table01"><tbody></tbody></table>');

                $('#premiumTradeAdvisorBuildings>div.mainContentScroll>div.mainContent>div.center').remove();
                //$('#premiumTradeAdvisor>div.mainContentScroll>div.mainContent>div.center').remove();

                for(var zz = 2; zz <= $('#buildingsOverview .content:first .table01:first tr.headingrow th').length; zz++){
                    //$('#buildingsOverview .content:first .table01:first tr.headingrow th:nth-of-type('+zz+') img').css("width", "30px");
                }

            }
        };

        $('buildingsOverview .table01:nth-of-type(2) tr:nth-of-type(8) td:nth-of-type(4) .upgrade').text();

        var params_BuildingsTable = {
            id: 'premiumTradeAdvisorBuildings',
            parent: document.querySelector('body'),
            recursive: false,
            done: function() {
                fnc_BuildingsTable();
            }
        };

        new MutationObserver(function(mutations) {
            params_BuildingsTable.done();
        }).observe(params_BuildingsTable.parent || document, {
            childList: true
        });
    };
    fnc_BuildingsTableListener();


    function fnc_ResourceOverview(){
        function ResourceOverview(){
            if($('#js_ResourceOverviewTypeSelectionContainer a').css("background") == 'rgba(0, 0, 0, 0) url("https://s46-tr.ikariam.gameforge.com/skin/resources/icon_worldmap_wine.png") no-repeat scroll 5% 50% / auto padding-box border-box'){
                var rowLength = $('#resourceOverview>div.content>table.overview tr').length;
                var wineIdArray = [];
                var notWineIdArray = [];

                for(var k = 2; k < rowLength; k++){
                    if($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + k + ') td:nth-of-type(3)').text() == "-"){
                        notWineIdArray.push(k);
                    }else{
                        wineIdArray.push(k);
                    }
                }

                var wine = getTotalWineInCities(wineIdArray);
                var obj = createObj(notWineIdArray);
                var totalConsumption = totalConsump(obj);

                var flag = true;
                var coef = 5;
                while(flag){
                    obj = calculateNeeds(obj, coef);
                    if(getTotalNeeds(obj) < wine){
                        coef += 5;
                    }else{
                        flag = false;
                    }
                }
                coef -= 5;
                obj = calculateNeeds(obj, coef);
                updateNeedsVisually(obj);
            }
        };

        function createObj(arr){
            var obj = [];
            for(var i = 0; i < arr.length; i++){
                var cityId = arr[i];

                obj[i] = {wineInCity:parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(2)').text().replaceAll(",", "")),
                          consumption:parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(7)').text().split("/")[0]),
                          cityName:getCityName(cityId),
                          needed:0,
                          id:cityId};
            }
            return obj;
        }
        function getCityName(cityId){
            var fullName = $('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(1)').text();
            var text = fullName;
            if($('#script_WineNeed_' + cityId).length > 0){
                var arr = fullName.split(" ");
                text = arr[0];
                for (var i = 1; i < arr.length-1; i++){
                    text += " " + arr[i];
                }
            }
            return text;
        }
        function getTotalWineInCities(arr){
            var wine = 0;
            for(var id of arr){
                wine += parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + id + ') td:nth-of-type(2)').text().replaceAll(",", ""));
            }
            return wine;
        }
        function totalConsump(obj){
            var totalConsumption = 0;
            for (var city of obj){
                totalConsumption += city.consuption;
            }
            return totalConsumption;
        }
        function updateNeedsVisually(obj){
            for (var city of obj){
                var id = city.id;
                var name = city.cityName;
                var need = city.needed.toLocaleString();
                if($('#script_WineNeed_' + id).length > 0){
                    $('#script_WineNeed_' + id).text("(" + need + ")");
                }else{
                    $('#resourceOverview>div.content>table.overview tr:nth-of-type(' + id + ') td:nth-of-type(1)').html(name + " " + "<span id='script_WineNeed_" + id + "' style='color:green'>(" + need + ")</span>");
                }
            }
        }
        function calculateNeeds(obj, coef){
            var hour = (obj[0].wineInCity + obj[0].consumption*coef) / obj[0].consumption;
            for(var i = 0; i < obj.length; i++){
                obj[i].needed = Math.floor(obj[i].consumption*hour-obj[i].wineInCity);
            }
            return obj;
        }
        function getTotalNeeds(obj){
            var totalNeeded = 0;
            for (var city of obj){
                totalNeeded += city.needed;
            }
            return totalNeeded;
        }

        var params_Yyy = {
            id: 'premiumTradeAdvisor',
            parent: document.querySelector('body'),
            recursive: false,
            done: function() {
                ResourceOverview();
            }
        };

        new MutationObserver(function(mutations) {
            params_Yyy.done();
        }).observe(params_Yyy.parent || document, {
            childList: true
        });
    };
    fnc_ResourceOverview();



})();
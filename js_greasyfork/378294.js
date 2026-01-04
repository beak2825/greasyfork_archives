// ==UserScript==
// @name         WME Land of the Pure Overlay
// @namespace    Dude495
// @version      2019.04.03.01
// @description  Adds a group area overlay for the Land of the Pure (Pakistan) WoW.
// @author       MapOMatic, Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378294/WME%20Land%20of%20the%20Pure%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/378294/WME%20Land%20of%20the%20Pure%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROJECT_NAME = 'Land of the Pure';
    const STATE_ABBR = 'Pakistan';
    const VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_NOTES = '<ul><li>Bug Fixes.</li></ul>';
    // Enter the MapRaid area names and the desired fill colors, in order they appear in the original map legend:
    const GROUPS = [
        {name: '1', fillColor:'#ff99e6', zoomTo: 3},
        {name: '2', fillColor:'#FF0000', zoomTo: 3},
        {name: '3', fillColor:'#e6eeff', zoomTo: 3},
        {name: '4', fillColor:'#7cb342', zoomTo: 2},
        /*{name: '5', fillColor:'#f57c00', zoomTo: 2},
        {name: '6', fillColor:'#ffcc33', zoomTo: 3},
        {name: '7', fillColor:'#b84dff', zoomTo: 3},
        {name: '8', fillColor:'#80d4ff', zoomTo: 2},*/
    ];

    // There must be a GROUP above for each WKT_STRING below
    const WKT_STRINGS = [
        'POLYGON((78.11480580078467 35.46709952334359,77.00518666015967 35.0027202426333,76.99420033203467 34.93970178099722,76.86511097656592 34.9914705019344,76.74426136719092 34.926191518608924,76.67834339844092 34.75486908044701,76.48058949219092 34.79998849808354,76.27064327349069 34.714973675639506,76.19923214067819 34.66528986174119,76.04267696489694 34.694652083537655,75.78175167192819 34.516059629700926,75.24067501177194 34.647215628028704,74.55402950395944 34.74657511754864,74.30134395708444 34.79621010714658,74.14204219927194 34.65173455596902,73.95527462114694 34.692393820746815,73.87287716020944 34.457198412439354,73.74104122270944 34.352957639179216,73.91682247270944 34.325743041289186,73.99921993364694 34.20316813639703,73.87837032427194 34.0485606866399,73.99921993364694 33.98937140119843,74.24091915239694 34.007587884682785,74.23542598833444 33.85718515003978,73.97724727739694 33.75676921334109,74.13413947103527 33.50063403402132,74.00230353353527 33.22995506648941,74.43077033041027 32.824670132622906,74.35935919759777 32.76464071608903,73.64250128744152 33.09660121786985,73.58482306478527 33.88911095234725,73.53538458822277 33.98026169470766,73.41728156087902 33.9346985197964,73.36234992025402 33.86174671003638,73.29093878744152 33.812697173401716,73.24150031087902 33.79101515728462,73.1687158870509 33.781884244123965,73.12339728353527 33.797862703171894,72.95036261556652 33.75106022526226,72.84736578939464 33.77731842244643,72.80204718587902 33.95774534058783,72.7017969417384 33.88709333475919,72.62351935384777 33.90875098213162,72.64961188314464 33.95204977056892,72.56172125814464 33.96116249959727,72.53013556478527 34.016956662102196,72.46833746908214 34.04540895500908,72.39692633626964 34.00671150120519,72.23625128744152 33.9452145833289,72.2513574886134 33.782146967299724,72.09068243978527 33.80269008959718,71.97944586751964 33.66792879912436,71.9615667057758 33.54094681061354,71.86158630273314 33.40462906640168,71.70640441796752 33.349583100209294,71.70091125390502 33.26120746475899,71.75584289453002 33.17734012233786,71.70915099999877 33.07152987860574,71.6171405019519 33.10949821657867,71.5731951894519 33.22100712722929,71.4907977285144 33.21066691006533,71.39878723046752 33.24398101232463,71.38368102929564 33.2060708658024,71.4193865957019 33.14859995629662,71.40428039453002 33.08994081736077,71.44410583398314 33.07037906698322,71.43311950585814 33.013970864795525,71.35758849999877 33.008212895103284,71.3314959707019 32.98748109181567,71.2710711660144 33.00706125605306,71.1502215566394 32.94600287566358,71.1227557363269 32.879135915301305,71.1227557363269 32.79836718677108,71.10490295312377 32.75795527713901,71.15430472224807 32.5917158398263,71.24494192927932 32.589401731403925,71.23670218318557 32.49910492005848,71.34381888240432 32.519950705049276,71.34381888240432 32.37856803323474,71.25318167537307 32.36464956403576,71.09086858918897 32.142041145304596,70.85740911653272 31.661708727562747,70.78325140168897 31.315073395370625,70.52232610872022 31.33618921954293,70.38225042512647 31.23995657084989,70.24217474153272 31.070725256893954,70.21470892122022 31.192978191491036,70.22844183137647 31.46981268942736,70.04991399934522 31.404196863517754,70.01420843293897 31.31976621003976,69.97575628450147 31.486209466493634,69.91258489778272 31.521335740388384,69.92566219427499 31.8939742128407,69.85425106146249 31.849657017690237,69.82403865911874 31.889310248695097,69.85699764349374 31.94992334996493,69.78833309271249 31.994192268658253,69.81556561663751 32.07820931325472,69.66450360491876 32.05260603687547,69.53816083148126 31.940798832031625,69.32667401507501 31.933806357188715,69.25251630023126 32.463713871365485,69.29371503070001 32.53320836641926,69.40083172991876 32.558676223114425,69.46125653460626 32.66509984184342,69.40357831195001 32.77370627338093,69.54365399554376 32.87064683354631,69.50794842913751 33.018602883006146,69.65626385882501 33.09226780519183,70.35389569476251 33.32207287907541,70.19459393695001 33.54211718715554,70.13966229632501 33.729381942176815,69.99134686663751 33.765922133427644,69.85951092913751 33.93471781155262,69.90894940570001 34.02126695561833,70.07923749163751 34.01216066934421,70.52418378070001 33.93016015324395,71.07350018695001 34.039476597352454,71.17787030413751 34.36204640359745,71.03504803851251 34.502499121179824,71.68873456195001 35.21018695183343,71.49098065570001 35.844705540698584,71.20533612445001 36.053710712965895,72.2866021164266 36.698713123007856,73.5170708664266 36.88347348412247,74.1432915695516 36.82193620962631,74.6596489914266 37.05902111012936,75.3517876633016 36.93618027955745,75.5055962570516 36.698713123007856,75.9450493820516 36.56646885243419,76.5712700851766 36.177245154668704,77.3183403976766 35.536146016950276,78.11480580078467 35.46709952334359))',
        'POLYGON((70.20126149938983 27.882855701377995,69.95681569860858 28.02114718785696,69.8193466799994 28.31691206512193,69.7369492190619 28.46671723854443,69.50348974640565 28.527062594745296,69.3908798831244 28.486031506289105,69.3469345706244 28.553603615826916,69.4732773440619 28.681389258597385,69.5446884768744 28.821051684326896,69.51996923859315 28.924473794345833,69.7204697268744 29.1118135125965,69.75163931975771 29.316467131575482,69.57860465178896 29.433745941159614,69.60607047210146 29.665510781630235,69.83403678069521 29.79548262596586,69.96037955413271 30.035925728165637,69.97136588225771 30.43075884943492,70.22954459319521 30.854817805884878,70.23654695119046 31.064383447147268,70.25577302540921 31.1220068614877,70.32306428517484 31.18664454879663,70.53273021207599 31.33031646921811,70.71154158509967 31.319497295837113,70.82140486634967 31.338266269253598,70.87607623100484 31.52292698972647,70.82663775444234 31.554528809670536,70.87955406134006 31.68214949430717,71.08843341134798 32.03352508049005,71.10392578772428 32.145307702886534,71.17945679358365 32.19413085485292,71.17808350256803 32.25918766411704,71.2591076724899 32.35900560202341,71.34521479952582 32.36767929717951,71.37268061983832 32.48707235044941,71.3493346725727 32.53339595131782,71.25732417452582 32.498655488277244,71.24221797335395 32.529922509308996,71.25214609409113 32.59705191002885,71.157389014013 32.60515033663491,71.11069711948176 32.77649169705445,71.1628821780755 32.946062887559016,71.26402960246435 33.00096351476504,71.34093389933935 32.98138199737322,71.37526617472997 33.00672195770941,71.44530401652685 33.05277596555321,71.38350592082372 33.22965448092892,71.56066046183935 33.21586861584904,71.71309576457372 33.06177899979468,71.76253424113622 33.172199047866194,71.70210943644872 33.27788789575792,71.96202122201453 33.52640580092505,72.0922892756729 33.78670652992007,72.2625773616104 33.777575157328975,72.24335128739165 33.94406934148095,72.41722652154476 34.02531319047773,72.46941158013851 34.04010811657144,72.63832637506039 33.95243902885374,72.62047359185726 33.89660252812953,72.70287105279476 33.879502406641876,72.77565547662289 33.9501607045222,72.81822749810726 33.90230180681262,72.83882686334164 33.81334969538955,72.94594356256039 33.74714578764622,73.11073848443539 33.79623290125823,73.16567012506039 33.7791126837081,73.23845454888851 33.78710254453661,73.40599605279476 33.92395559120857,73.53096553521664 33.976357751282634,73.59413692193539 33.885202828013206,73.55568477349789 33.77568822946209,73.60100337701351 33.71173996279268,73.56392451959164 33.67060519440603,73.56362164924428 33.61076656812477,73.62267316291616 33.52952560612187,73.59932721565053 33.49632069639963,73.56087506721303 33.35649161533586,73.66387189338491 33.17161876181,73.62953961799428 33.14287672024617,73.63228620002553 33.07730965779741,73.69408429572866 33.08191245135369,73.73940289924428 33.0600470370507,73.75862897346303 33.01284526678952,73.97148908088491 32.962161587958974,74.38848546941449 32.76059744878671,74.50933507878949 32.75366805583962,74.65765050847699 32.71901300478901,74.67962316472699 32.478367888886964,75.03942541082074 32.46909940860277,75.32232336003949 32.327636946298185,75.30859044988324 32.19989902145827,75.09435705144574 32.06732658150303,74.59997228582074 31.87860319972334,74.51757482488324 31.661443136493045,74.50933507878949 31.101036078196202,74.68511632878949 31.117497126249877,74.67138341863324 31.051635816630903,74.52032140691449 31.02104184279282,73.86388830144574 30.35673737792948,73.96001867253949 30.197817746777723,73.79797033269574 30.074300003399674,73.37774328191449 29.948248049863786,73.27337316472699 29.564356113446888,72.99596837957074 29.157414893293307,72.93279699285199 29.027811737125784,72.40545324285199 28.797004216289373,72.28185705144574 28.66453977971571,72.18572668035199 28.389443878890667,71.91656164128949 28.128166439211963,71.88634923894574 27.963330608184933,71.67486242253949 27.888101127316098,71.32604650457074 27.87839028528236,70.89208654363324 27.713172915219094,70.73278478582074 27.764222723190866,70.57897619207074 28.028810365977357,70.34551671941449 28.02153680230327,70.20126149938983 27.882855701377995))',
        'POLYGON((68.13407840970501 23.73484023191446,66.70585575345501 24.86627560238358,67.16178837064251 25.289178414412675,67.45841923001751 25.95288069528068,67.21850614856817 26.491735812056493,67.13061552356817 27.27891025058257,67.38879423450567 27.843800854333107,67.93261747669317 28.008819382987664,68.46487977306833 28.454071771363108,69.39871766369333 28.487873467726747,69.76675965588083 28.425090284547373,69.92606141369333 28.037914125566243,70.20071961681833 27.887506738838862,69.89310242931833 27.454531934687388,69.54703309338083 27.156787095276346,69.47562196056833 26.76019200545087,69.82873037134414 26.566742250369927,70.10888173853164 26.581480790615384,70.17479970728164 26.409413326474148,70.07042959009414 26.010216400784266,70.32311513696914 25.654231001926238,70.60326650415664 25.683937292828325,70.64721181665664 25.376616310644753,71.05370595728164 24.65483345667902,70.94384267603164 24.374947286104472,70.64721181665664 24.23477104741485,70.61425283228164 24.484976904984645,69.64745595728164 24.28485176589703,68.82484921474338 24.270803302295718,68.13407840970501 23.73484023191446))',
        'POLYGON((66.69156859417922 24.901807627516465,66.76297972699172 25.19542218773313,66.36197875042922 25.463535359553568,65.85660765667922 25.41641038415144,65.26609251996047 25.38167492657158,65.14249632855422 25.307208163166816,61.632364492616716 25.17802401931048,62.027872305116716 26.286445437695043,63.181436758241716 26.66996671857141,63.302286367616716 27.21841319241246,62.818887930116716 27.257485558487733,62.840860586366716 28.27195528316656,60.896280508241716 29.81823034986824,62.511270742616716 29.359659396256486,65.11833093503355 29.522308176361566,66.39274499753355 29.884930801548407,66.3951803247711 30.9125146778934,68.1958351355288 31.741539293108865,69.8218116980288 32.030721833213896,70.1843605261538 31.113443800941045,69.3164406042788 28.521131225101648,68.3716163855288 28.49216813152024,67.2619972449038 27.755799308197563,67.1440122353066 26.573288536763943,67.4461362587441 26.098218428770178,67.36099221577535 25.653993958917358,67.0121762978066 25.17520462754118,66.69156859417922 24.901807627516465))'
    ];
    const SETTINGS_STORE_NAME = '_wme_' + STATE_ABBR + '_mapraid';
    const DEFAULT_FILL_OPACITY = 0.3;

    var _settings;
    var _layer;

    function loadSettingsFromStorage() {
        _settings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
        if(!_settings) {
            _settings = {
                layerVisible: true,
                hiddenAreas: []
            };
        } else {
            _settings.layerVisible = (_settings.layerVisible === true);
            _settings.hiddenAreas = _settings.hiddenAreas || [];
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            var settings = {
                layerVisible: _layer.visibility,
                hiddenAreas: _settings.hiddenAreas
            };
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        }
    }
    function addwiki() {
        if (W.model.countries.top.name == "Pakistan") {
            var GroupNo = $('#mapraid')[0].innerText
            if ($('#LoPwiki').length > 0 && GroupNo !== sessionStorage.getItem('W2Group')) {
                $('#LoPwiki')[0].innerHTML = '';
            }
            if (document.getElementById('LoPwiki') == undefined) {
                var w2div = document.createElement('DIV');
                w2div.id = 'LoPwiki';
                var CDT = document.getElementById('countdown-timer')
                if (CDT !== null) {
                    w2div;
                    CDT.after(w2div);
                } else {
                    w2div;
                    $('#user-box').after(w2div);
                }
            }
            var localHosts = 'Jawadch (Local)<br>Kashif_Alvi';
            if (GroupNo == "Group: 1") {
                if (GroupNo !== sessionStorage.getItem('W2Group')) {
                    $('#LoPwiki')[0].innerHTML = '<p style="margin-left: 100px"><b><a href="https://www.bit.ly/LoPwiki" target="_blank">WoWs2 Pakistan wiki</a> <a href="#" data-toggle="collapse" data-target="#w2info"><i class="fa fa-expand"></i></a></b><div id="w2info" class="collapse"><p style="margin-left: 10px"><b>Local Hosts:</b><br>'+localHosts+'<p style="margin-left: 10px"><b>Group 1 Lead:</b><br>Freesoft<p style="margin-left: 10px"><b>Group Supporting Editors:</b><br>RIMAJUES<br>Walter-Bravo<br></div>';
                    sessionStorage.setItem('W2Group', GroupNo);
                }
            }
            if (GroupNo == "Group: 2") {
                if (GroupNo !== sessionStorage.getItem('W2Group')) {
                    $('#LoPwiki')[0].innerHTML = '<p style="margin-left: 100px"><b><a href="https://www.bit.ly/LoPwiki" target="_blank">WoWs2 Pakistan wiki</a> <a href="#" data-toggle="collapse" data-target="#w2info"><i class="fa fa-expand"></i></a></b><div id="w2info" class="collapse"><p style="margin-left: 10px"><b>Local Hosts:</b><br>'+localHosts+'<p style="margin-left: 10px"><b>Group 2 Lead:</b><br>Dude495<br>GeekDriverPeaceful<p style="margin-left: 10px"><b>Group Supporting Editors:</b><br>Airchair<br>Michelle-S<br>';
                    sessionStorage.setItem('W2Group', GroupNo);
                }
            }
            if (GroupNo == "Group: 3") {
                if (GroupNo !== sessionStorage.getItem('W2Group')) {
                    $('#LoPwiki')[0].innerHTML = '<p style="margin-left: 100px"><b><a href="https://www.bit.ly/LoPwiki" target="_blank">WoWs2 Pakistan wiki</a> <a href="#" data-toggle="collapse" data-target="#w2info"><i class="fa fa-expand"></i></a></b><div id="w2info" class="collapse"><p style="margin-left: 10px"><b>Local Hosts:</b><br>'+localHosts+'<p style="margin-left: 10px"><b>Group 3 Lead:</b><br>Challenger3802<br>Moweez<br>Ronsek57<p style="margin-left: 10px"><b>Group Supporting Editors:</b><br>Sebiseba<br>';
                    sessionStorage.setItem('W2Group', GroupNo);
                }
            }
            if (GroupNo == "Group: 4") {
                if (GroupNo !== sessionStorage.getItem('W2Group')) {
                    $('#LoPwiki')[0].innerHTML = '<p style="margin-left: 100px"><b><a href="https://www.bit.ly/LoPwiki" target="_blank">WoWs2 Pakistan wiki</a> <a href="#" data-toggle="collapse" data-target="#w2info"><i class="fa fa-expand"></i></a></b><div id="w2info" class="collapse"><p style="margin-left: 10px"><b>Local Hosts:</b><br>'+localHosts+'<p style="margin-left: 10px"><b>Group 4 Lead:</b><br>Marcin_S (Country Coordinator)<br>Mareku188<p style="margin-left: 10px"><b>Group Supporting Editors:</b><br>rain101<br>sampowicz<br>Voludu2<br>';
                    sessionStorage.setItem('W2Group', GroupNo);
                }
            }
        }
    }
    function updateDistrictNameDisplay(){
        $('.mapraid-region').remove();
        if (_layer !== null) {
            var mapCenter = new OpenLayers.Geometry.Point(W.map.center.lon,W.map.center.lat);
            for (var i=0;i<_layer.features.length;i++){
                var feature = _layer.features[i];
                var color;
                var text = '';
                if(feature.geometry.containsPoint(mapCenter)) {
                    text = feature.attributes.name;
                    color = '#ff0';
                    var $div = $('<div>', {id:'mapraid', class:'mapraid-region', style:'display:inline-block;margin-left:10px;', title:'Click to toggle color on/off for this group'})
                    .css({color:color, cursor:'pointer', fontWeight:'bold', fontSize:'14px'})
                    .click(toggleAreaFill);
                    var $span = $('<span>').css({display:'inline-block'});
                    $span.text('Group: ' + text).appendTo($div);
                    $('.location-info-region').parent().append($div);
                    if (color) {
                        break;
                    }
                }
            }
            setTimeout(addwiki, 1500);
        }
    }
    function toggleAreaFill() {
        var text = $('#mapraid span').text();
        if (text) {
            var match = text.match(/^Group: (.*)/);
            if (match.length > 1) {
                var areaName = match[1];
                var f = _layer.getFeaturesByAttribute('name', areaName)[0];
                var hide = f.attributes.fillOpacity !== 0;
                f.attributes.fillOpacity = hide ? 0 : DEFAULT_FILL_OPACITY;
                var idx = _settings.hiddenAreas.indexOf(areaName);
                if (hide) {
                    if (idx === -1) _settings.hiddenAreas.push(areaName);
                } else {
                    if (idx > -1) {
                        _settings.hiddenAreas.splice(idx,1);
                    }
                }
                saveSettingsToStorage();
                _layer.redraw();
            }
        }
    }

    function layerToggled(visible) {
        _layer.setVisibility(visible);
        saveSettingsToStorage();
    }

    function init() {
        loadSettingsFromStorage();
        let layerid = 'wme_' + STATE_ABBR + '_mapraid';
        let wkt = new OL.Format.WKT();
        let features = WKT_STRINGS.map(polyString => {
            var f = wkt.read(polyString);
            f.geometry.transform(W.map.displayProjection, W.map.projection);
            return f;
        });
        GROUPS.forEach((group, i) => {
            let f = features[i];
            f.attributes.name = group.name;
            f.attributes.fillColor = group.fillColor;
            f.attributes.fillOpacity = _settings.hiddenAreas.indexOf(group.name) > -1 ? 0 : DEFAULT_FILL_OPACITY;
            group.feature = f;
        });

        let layerStyle = new OpenLayers.StyleMap({
            strokeDashstyle: 'solid',
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWidth: 3,
            fillOpacity: '${fillOpacity}',
            fillColor: '${fillColor}',
            label: 'Group ${name}',
            fontOpacity: 0.9,
            fontSize: '20px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontColor: '#fff',
            labelOutlineColor: '#000',
            labelOutlineWidth: 2
        });
        _layer = new OL.Layer.Vector(STATE_ABBR + ' UR Project', {
            rendererOptions: { zIndexing: true },
            uniqueName: layerid,
            shortcutKey: 'S+' + 0,
            layerGroup: STATE_ABBR + '_mapraid',
            zIndex: -9999,
            displayInLayerSwitcher: true,
            visibility: _settings.layerVisible,
            styleMap: layerStyle
        });
        I18n.translations[I18n.locale].layers.name[layerid] = STATE_ABBR + ' WoW';
        _layer.addFeatures(features);
        W.map.addLayer(_layer);
        W.map.events.register('moveend', null, updateDistrictNameDisplay);
        window.addEventListener('beforeunload', function saveOnClose() { saveSettingsToStorage(); }, false);
        updateDistrictNameDisplay();

        // Add the layer checkbox to the Layers menu.
        WazeWrap.Interface.AddLayerCheckbox('display', STATE_ABBR + ' WoW', _settings.layerVisible, layerToggled);

        initAreaJumper();
    }

    function initAreaJumper() {
        let $areaJumper = $('#mapraidDropdown');

        // If another script hasn't already created the dropdown, create it now.
        if (!$areaJumper.length) {
            let $areaJumperContainer = $('<div style="flex-grow: 1;padding-top: 6px;">').insertBefore('#edit-buttons');
            $areaJumper = $('<select id=mapraidDropdown style="margin-top: 4px;display: block;width: 80%;margin: 0 auto;">')
                .appendTo($areaJumperContainer)
                .append($('<option>', {value: 0}).text(PROJECT_NAME));
        }

        // Append the groups to the dropdown.
        $areaJumper.append(
            $('<optgroup>', {label: STATE_ABBR}).append(GROUPS.map(group => {
                return $('<option>', {value: STATE_ABBR + group.name}).text('Group ' + group.name);
            }))
        );

        // Handle a group selection.
        $areaJumper.change(function() {
            let value = $(this).val();
            let group = GROUPS.find(group => STATE_ABBR + group.name === value);
            if (group) {
                var pt = group.feature.geometry.getCentroid();
                W.map.moveTo(new OL.LonLat(pt.x, pt.y), group.zoomTo);
                $areaJumper.val('0');
            }
        });
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && $('#topbar-container > div > div > div.location-info-region > div').length && $('#layer-switcher-group_display').length && WazeWrap.Interface) {
            init();
            sessionStorage.removeItem('W2Group');
            console.log(STATE_ABBR + ' Area Overlay:', 'Initialized');
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/378294-wme-land-of-the-pure-overlay", "");
        } else {
            console.log(STATE_ABBR + ' MR Overlay: ', 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }

    bootstrap();
})();

// ==UserScript==
// @name             WME Color Speeds fork by FZ69617
// @version          0.32.3
// @description      Adds colours to road segments to show their speed
// @description:fr   Colorisation des segments selon leurs vitesses.
// @include          https://www.waze.com/editor/*
// @include          https://www.waze.com/*/editor/*
// @include          https://editor-beta.waze.com/*
// @exclude          https://www.waze.com/user/*
// @exclude          https://www.waze.com/*/user/*
// @namespace        https://greasyfork.org/scripts/14044-wme-color-speeds
// @author           French Script Team
// @copyright        Sebiseba, seb-d59 & DummyD2 - 2015
// @contributor      FZ69617
// @downloadURL https://update.greasyfork.org/scripts/18760/WME%20Color%20Speeds%20fork%20by%20FZ69617.user.js
// @updateURL https://update.greasyfork.org/scripts/18760/WME%20Color%20Speeds%20fork%20by%20FZ69617.meta.js
// ==/UserScript==

/*jshint -W030, -W041, -W069 */

var WMECSpeeds = {};
var CSpeeds_Version = GM_info.script.version;
var icon_delete="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";
var icon_submit="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";
var icon_edit="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";
var couleurs=new Array("(255,0,128)","(255,0,160)","(255,0,192)","(255,0,224)","(255,0,255)","(224,0,255)","(192,0,255)","(160,0,255)","(128,0,255)","(96,0,255)","(64,0,255)","(32,0,255)","(0,0,255)","(0,32,255)","(0,64,255)","(0,96,255)","(0,128,255)","(0,160,255)","(0,192,255)","(0,224,255)","(0,255,255)","(0,255,224)","(0,255,192)","(0,255,160)","(0,255,128)","(0,255,96)","(0,255,64)","(0,255,32)","(0,255,0)","(32,255,0)","(64,255,0)","(96,255,0)","(128,255,0)","(160,255,0)","(192,255,0)","(224,255,0)","(255,255,0)","(255,224,0)","(255,192,0)","(255,160,0)","(255,128,0)","(255,96,0)","(255,64,0)");

// speedColors[unit][speed] = color //-----> Default
WMECSpeeds.speedColors = {};

// unit defaults
var WMECSpeedsUnitDefaults = {
    kmh : {10:"#ff6232",20:"#ff6232",30:"#ff6232",40:"#f9805a",45:"#fc9a3c",50:"#ffad2d",60:"#fffc28",70:"#afff23",80:"#09ff34",90:"#14ff88",100:"#0fffdf",110:"#0ac2ff",130:"#076aff"},
    mph : {5:"#ff6232",10:"#ff6232",15:"#ff6232",20:"#f9805a",25:"#fc9a3c",30:"#ffad2d",35:"#fffc28",40:"#afff23",45:"#09ff34",50:"#14ff88",55:"#0fffdf",60:"#0ac2ff",65:"#076aff",70:"#0055dd",75:"#0036db",80:"#0b07ff",85:"#8f07ff"}
};

// country specific defaults
var WMECSpeedsCountryDefaults = {
    PL: {10:"rgb(160,0,255)",20:"rgb(192,0,255)",30:"rgb(224,0,255)",40:"rgb(255,160,0)",50:"rgb(255,224,0)",60:"#fffc28",70:"#afff23",80:"#09ff34",90:"#14ff88",100:"#0fffdf",110:"#0ac2ff",120:"rgb(0,160,255)",130:"#076aff",140:"rgb(0,32,255)"}
};

var unit;
var debug=false;
var colorspeeds_mapLayer=[];

var zoom=0;
var RoadToScan = [3,6,7,4,2,1,8];
var RoadUpToStreet = [2,3,6,7];
var highway = [3,6,7];

var typeOfRoad = {
//---Type Road-----------
	 3: {"name":"Freeways","checked":true,"zoom":0},
	 6: {"name":"Major Highway","checked":true,"zoom":1},
	 7: {"name":"Minor Highway","checked":true,"zoom":2},
	 4: {"name":"Ramps","checked":true,"zoom":2},
	 2: {"name":"Primary Street","checked":false,"zoom":3},
	 1: {"name":"Streets","checked":false,"zoom":4},
	 8: {"name":"Dirt roads","checked":false,"zoom":4}};

WMECSpeeds.typeOfRoad = typeOfRoad;

//	 5: "Walking Trails",
//	10: "Pedestrian Bw",
//	14: "Ferry",
//	16: "Stairway",
//	17: "Private Road",
//	18: "Railroad",
//	19: "Runway/Taxiway"
//	20: "Parking Lot Road",
//	21: "Service Road"

WMECSpeeds.selectedRoadType = [];

WMECSpeeds.visibility = true;

// *********************
// ** HELPER FUNCTION **
// *********************

function log(msg, obj)
{
    if (obj==null)
        console.log(GM_info.script.name + " v" + CSpeeds_Version + " - " + msg);
    else if (debug)
        console.debug(GM_info.script.name + " v" + CSpeeds_Version + " - " + msg + " " ,obj);
}

function getId(node) {
    return document.getElementById(node);
}
function getElementsByClassName(classname, node) {
    node || (node = document.getElementsByTagName("body")[0]);
    for (var a = [], re = new RegExp("\\b" + classname + "\\b"), els = node.getElementsByTagName("*"), i = 0, j = els.length;i < j;i++) {
        re.test(els[i].className) && a.push(els[i]);
    }
    return a;
}
function getFunctionWithArgs(func, args) {
    return (
        function () {
            var json_args = JSON.stringify(args);
            return function() {
                var args = JSON.parse(json_args);
                func.apply(this, args);
            };
        }
    )();
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function RGB2Color(r,g,b) {
    return "rgb(" + Math.round(r) +","+ Math.round(g) +","+ Math.round(b) +")";
}
function Check_Unit() {
    if (CSpeedsModel.isImperial) { unit = "mph"; }
    else { unit = "kmh"; }
    log(unit);

    if (!WMECSpeeds.speedColors.hasOwnProperty(unit)) {
        if (WMECSpeedsCountryDefaults.hasOwnProperty(CSpeedsModel.countries.top.abbr)) {
            WMECSpeeds.speedColors[unit] = WMECSpeedsCountryDefaults[CSpeedsModel.countries.top.abbr];
        } else {
            WMECSpeeds.speedColors[unit] = WMECSpeedsUnitDefaults[unit];
        }
    }
    if (getId('CStable')) {
        getId('CStable').innerHTML="";
        LoadSettings();
        getId('unitvalue').innerHTML="("+unit+")";
    }
}
function saveOption(){
	localStorage.setItem('WMEColorSpeeds', JSON.stringify(WMECSpeeds));
}

// *************
// **  INIT   **
// *************
function CSpeeds_bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }

    /* begin running the code! */
    log("starting");
    CSpeeds_init();
}


function CSpeeds_init(){
    // Waze object needed
    CSpeedsWaze = unsafeWindow.Waze;
    if(typeof(CSpeedsWaze) === 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedsWaze : NOK"); }
        window.setTimeout(CSpeeds_init, 500);
        return;
    }
    CSpeedsMap = CSpeedsWaze.map;
    if(typeof(CSpeedsMap) == 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedsmap : NOK"); }
        window.setTimeout(CSpeeds_init, 500);
        return;
    }
    CSpeedsModel = CSpeedsWaze.model;
    if(typeof(CSpeedsModel) == 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedsModel DOM : NOK"); }
        window.setTimeout(CSpeeds_init, 500);
        return;
    }
    if((typeof(CSpeedsModel.countries) == 'undefined') || (typeof(CSpeedsModel.countries.top) == 'undefined')){
        if (debug) { console.error("WME ColorSpeeds - CSpeedsModel.countries : NOK"); }
        window.setTimeout(CSpeeds_init, 500);
        return;
    }
    //    OpenLayers
    CSpeedOpenLayers = unsafeWindow.OpenLayers;
    if(typeof(CSpeedOpenLayers) === 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - OpenLayers : NOK"); }
        window.setTimeout(CSpeeds_init, 500);
        return;
    }
    //    Traductions
    CSpeedsI18n = unsafeWindow.I18n.locale;
    if(typeof(CSpeedsI18n) == 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedsI18n : NOK"); }
        setTimeout(CSpeeds_init, 500);
        return;
    }
    //    Waze GUI needed
    CSpeedshandle = getId("user-info");
    if(typeof(CSpeedshandle) == 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedshandle : NOK"); }
        setTimeout(CSpeeds_init, 500);
        return;
    }
    CSpeedshandleClass = getElementsByClassName("nav-tabs", CSpeedshandle)[0];
    if(typeof(CSpeedshandleClass) === 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedshandleClass : NOK"); }
        setTimeout(CSpeeds_init, 500);
        return;
    }
    CSpeedshandleClass2 = getElementsByClassName("tab-content", CSpeedshandle)[0];
    if(typeof(CSpeedshandleClass2) === 'undefined'){
        if (debug) { console.error("WME ColorSpeeds - CSpeedshandleClass2 : NOK"); }
        setTimeout(CSpeeds_init, 500);
        return;
    }

    // Verify localStorage. Init if empty or not correct


    if (typeof(localStorage.WMEColorSpeeds) !== "undefined" && IsJsonString(localStorage.getItem('WMEColorSpeeds'))) {
        WMECSpeeds = JSON.parse(localStorage.WMEColorSpeeds);
        if (WMECSpeeds.typeOfRoad === undefined) WMECSpeeds.typeOfRoad = typeOfRoad;
    }else {
        if (typeof(localStorage.speedColors) !== "undefined" && IsJsonString(localStorage.getItem('speedColors'))) {
            WMECSpeeds.speedColors={}; WMECSpeeds.speedColors = JSON.parse(localStorage.speedColors);
            localStorage.removeItem("speedColors");
        }
        if (typeof(localStorage.speedColorsVisibility) !== "undefined" && IsJsonString(localStorage.getItem('speedColorsVisibility'))) {
            WMECSpeeds.visibility = JSON.parse(localStorage.speedColorsVisibility);
            localStorage.removeItem("speedColorsVisibility");
        }
        localStorage.setItem('WMEColorSpeeds', JSON.stringify(WMECSpeeds));
        log("init ok");

    }

    //======================================================

    // Translation
    if (CSpeedsI18n  == "fr") {
        CSlang = new Array("Vitesses","Paramètres","Couleurs","Ajouter nouvelle vitesse","Supprimer","Annuler","Autres","Modifier","Type de route","Zoom");
    }
    else {
        CSlang = new Array("Speeds","Settings","Colors","Add new speed","Delete","Cancel","Others","Edit","Road type","Zoom");
    }
    Check_Unit();


    // WME Layers check
    var layers = CSpeedsMap.getLayersBy("uniqueName","__WME_Color_Speeds");
    if(layers.length === 0) {
        var colorspeeds_style = new CSpeedOpenLayers.Style({
            pointRadius: 2,
            fontWeight: "normal",
            label : "${labelText}",
            fontFamily: "Tahoma, Courier New",
            labelOutlineColor: "#FFFFFF",
            labelOutlineWidth: 2,
            fontColor: '#000000',
            fontSize: "10px"
        });

        colorspeeds_mapLayer = new CSpeedOpenLayers.Layer.Vector("Color Speeds", {
            displayInLayerSwitcher: true,
            uniqueName: "__WME_Color_Speeds",
            styleMap: new CSpeedOpenLayers.StyleMap(colorspeeds_style)
        });

        I18n.translations.en.layers.name["__WME_Color_Speeds"] = "Color Speeds";
        CSpeedsMap.addLayer(colorspeeds_mapLayer);
        colorspeeds_mapLayer.setVisibility(WMECSpeeds.visibility);

    }
    //log('colorspeeds_mapLayer ',colorspeeds_mapLayer);

    // Then running
    CSpeeds_css();
    getElementsByClassName('btn-group')[0].onclick=(function(){ Check_Unit(); });
}


// *************
// **  HTML   **
// *************

function CSpeeds_css() {
    var Scss = document.createElement("style");
    Scss.type = "text/css";
    var css =".CScontent {width:250px; margin-left:20px; box-shadow: 0 4px 10px #aaa;}";
    css +=".divEntete {height:24px; font-weight:bold; padding-top:2px; border:2px solid #3d3d3d; background-color:#BEDCE5;}";
    css +=".divContent {clear:both; line-height:21px; height:24px; border:1px solid #3d3d3d; border-top:0;}";
    css +=".divContent label {color: #59899e; font-weight: bold !important; text-align: left; margin-left: 5px;}";
    css +=".divContent input {margin-right: 5px; transform: translateY(1px);}";
    css +=".divl {float:left; text-align:center;}";
    css +=".divr {float:right; text-align:center;}";
    css +=".speed {color:#59899e; font-weight:bold;}";
    css +=".divcolor {width:80px; height:17px; margin:3px 0 0 5px;}";
    css +=".CStype {color:#59899e; font-weight:bold; text-align:left; margin-left:10px;}";
    css +=".CScheck { margin-left:5px; width:10px; height:10px;}";
    css +=".CSzoom {color:#59899e; font-weight:bold;}";
    css +="#editspeed { display:none;}";
    css +="#newspeed {width:35px; height:22px;}";
    css +="#editzoom { display:none;}";
    css +="#newvalzoom {width:35px; height:22px;}";
    Scss.innerHTML = css;
    document.body.appendChild(Scss);
    CSpeeds_Mainhtml();
}
function CSpeeds_Mainhtml() {
    //Create content in CSpeeds's tab
    var newtab = document.createElement('li');
    newtab.innerHTML = "<a href='#sidepanel-colorspeeds' data-toggle='tab'><span class='fa fa-dashboard' title='"+ CSlang[0] +"'></span></a>";
    //newtab.innerHTML = "<a href='#sidepanel-colorspeeds' data-toggle='tab'> "+ CSlang[0] +"</a>";
    CSpeedshandleClass.appendChild(newtab);

    var addon = document.createElement('section');
    //addon.id = "colorspeeds-addon";

    // colorspeeds header
    var content = "<div style='float:left; margin-left:5px;'><b><a href='https://greasyfork.org/scripts/14044-wme-color-speeds' target='_blank'><u>WME Color Speeds</u></a></b> v"+ CSpeeds_Version +"</div>";
    content += "<div style='clear:both; padding-top:10px;'></div><div class='CScontent' >";
    content += "<div class='divEntete'><div class='divl' style='width:60px;'>"+ CSlang[0]+"</div><div class='divr' id='unitvalue' style='width:45px;font-size:11px;line-height:20px;'>("+unit+")</div><div class='divr' style='width:130px;'>"+ CSlang[2] +"</div></div>";

    // new / edit speed
    content += "<div class='divContent' id='editspeed'><div class='divl speed' style='width:60px;'><input type='text' value='' id='newspeed' class='speed' /></div>";
    content += "<div class='divr' style='width:20px;'><a href='#'><img id='cancel' style='width:20px;' title='"+ CSlang[5] +"' src='data:image/png;base64,"+ icon_delete +"' /></a></div>";
    content += "<div class='divr' style='width:20px;'><a href='#'><img id='submit' style='width:20px;' title='"+ CSlang[3] +"' src='data:image/png;base64,"+ icon_submit +"' /></a></div>";
    content += "<div class='divr' style='width:120px; text-align:left;'><select id='CScolor' style='height:22px; width:100px;'>";

    for (var i=0; couleurs[i]; ++i) { content +="<option value='rgb"+ couleurs[i] +"' style='background-color:rgb"+ couleurs[i] +"'>&nbsp;</option>"; }

    content +="</select></div></div>";
    content += "<div class='divContent'><div class='divl speed' style='width:60px;'>"+ CSlang[6] +"</div><div class='divr' style='width:40px;'>&nbsp;</div><div class='divr' style='width:120px;'><div class='divcolor' style='background-color:#f00;'>&nbsp;</div></div></div>";
    content += "<div id='CStable'></div></div><div id='divadd'></div>";

    // Type road
    content += "<br><div style='clear:both; padding-top:10px;'></div><div class='CScontent'>";
    content += "<div class='divEntete'><div class='divl' style='width:120px;'>"+ CSlang[8]+"</div><div class='divr' style='width:60px; margin-right:20px;'>"+ CSlang[9] +"</div></div>";
  	// edit zoom
    content += "<div class='divContent' id='editzoom'><div class='divl speed' style='width:110px;'><span id='texttype'></span></div>";
    content += "<div class='divr' style='width:20px;'><a href='#'><img id='cancelZoom' style='width:20px;' title='"+ CSlang[5] +"' src='data:image/png;base64,"+ icon_delete +"' /></a></div>";
    content += "<div class='divr' style='width:20px;'><a href='#'><img id='submitZoom' style='width:20px;' title='"+ CSlang[3] +"' src='data:image/png;base64,"+ icon_submit +"' /></a></div>";
    content += "<div class='divr speed' style='width:60px;'><input type='text' value='' id='newvalzoom' class='speed' /></div>";
    content +="</div>";
    content += "<div id='CSroadType'></div></div>";

    content += "<br>";
    content += "<div><div class='CScontent'>";
    content += "<div class='divEntete'><div class='divl' style='width:120px;'>Other options</div></div>";
    function optionHtml(id, text, hint) {
        return '<div class="divContent"><label title="' + hint + '"><input id="CSOpt_' + id + '" type="checkbox"/>' + text + '</label></div>';
    }
    content += optionHtml("transparent", "Transparent markers", "Draws transparent speed limits markers");
    content += optionHtml("sidedOneWay", "Sided one-way markers", "Draws one-way / two-way speed limit markers side contiguous");
    content += optionHtml("colourUnverified", "Colour unverified speeds", "Colours unverified speed limits with matching color");
    content += "</div></div>";

    addon.innerHTML  = content;
    addon.id = "sidepanel-colorspeeds";
    addon.className = "tab-pane";
    CSpeedshandleClass2.appendChild(addon);
    getId('divadd').innerHTML="<br/><center><input type='button' id='addbutton' name='add' value='"+ CSlang[3] +"' /></center>";
    getId('addbutton').onclick = (function() {
        getId('editspeed').style.display = "block";
        getId('addbutton').style.display = "none";
    });


    LoadSettings();
    //window.setInterval(SCColor,800);

    function setupOption(id, defaultVal) {
        var option = getId("CSOpt_" + id);
        if (!WMECSpeeds.hasOwnProperty(id)) WMECSpeeds[id] = defaultVal;
        option.checked = (WMECSpeeds[id] == true);
        option.onclick = function() {
            WMECSpeeds[id] = (option.checked == true);
            SCColor();
        };
    }
    setupOption("transparent", true);
    setupOption("sidedOneWay", true);
    setupOption("colourUnverified", true);


    CSpeedsMap.events.register("zoomend", null, SCColor);
    CSpeedsMap.events.register("moveend", null, SCColor);

    CSpeedsMap.events.register("changelayer", null, SCColor);

    CSpeedsMap.baseLayer.events.register("loadend", null, SCColor);
    CSpeedsModel.events.register("mergeend", null, SCColor);

    CSpeedsModel.segments.events.register("objectsadded", null, SCColor);
    CSpeedsModel.segments.events.register("objectschanged", null, SCColor);
    CSpeedsModel.segments.events.register("objectsremoved", null, SCColor);

    Waze.vent.on("operationDone", SCColor);

    window.addEventListener("beforeunload", saveOption, false);

    SCColor();
}

function LoadSettings(){

    for (var valSpeed in WMECSpeeds.speedColors[unit]) {
        var color = WMECSpeeds.speedColors[unit][valSpeed];
        var div = document.createElement('div'); div.className="divContent";
        var divspeed = document.createElement('div'); divspeed.className="divl speed"; divspeed.style.width="60px"; divspeed.innerHTML=valSpeed;
        div.appendChild(divspeed);

        var divsuppr = document.createElement('div'); divsuppr.className="divr"; divsuppr.style.width="20px";
        var divsuppra = document.createElement('a');
        divsuppra.innerHTML="<img style='width:20px;' title='"+ CSlang[4] +"' src='data:image/png;base64,"+ icon_delete +"' />";
        divsuppra.href = "#"; divsuppra.className="delSpeed"; divsuppra.id="delSpeed_"+valSpeed;
        divsuppr.appendChild(divsuppra);
        div.appendChild(divsuppr);

        var divedit = document.createElement('div'); divedit.className="divr"; divedit.style.width="20px";
        var divedita = document.createElement('a');
        divedita.innerHTML="<img style='width:16px;' title='"+ CSlang[7] +"' src='data:image/png;base64,"+ icon_edit +"' />";
        divedita.href = "#";
        divedita.onclick = getFunctionWithArgs(SCEditSpeed, [unit,valSpeed,color]);
        divedit.appendChild(divedita);
        div.appendChild(divedit);

        var divcolor = document.createElement('div'); divcolor.className="divr"; divcolor.style.width="120px"; divcolor.innerHTML="<div class='divcolor' style='background-color:"+ color +";'>&nbsp;</div>";
        div.appendChild(divcolor);
        getId('CStable').appendChild(div);
    }
    for (var i=0; i < RoadToScan.length; ++i){
        var type = RoadToScan[i];
        var div = document.createElement('div'); div.className="divContent";

        var divcheck = document.createElement('label'); //divcheck.className="divl";
        divcheck.innerHTML= '<input type="checkbox" id="cbRoad'+type+'">'+WMECSpeeds.typeOfRoad[type].name;
        div.appendChild(divcheck);

        //var divtype = document.createElement('div'); divtype.className="divl CStype"; divtype.style.width="130px"; divtype.innerHTML= WMECSpeeds.typeOfRoad[type].name;
        //div.appendChild(divtype);

        var divedit = document.createElement('div'); divedit.className="divr"; divedit.style.width="20px";
        var divedita = document.createElement('a');
        divedita.innerHTML="<img style='width:16px;' title='"+ CSlang[7] +"' src='data:image/png;base64,"+ icon_edit +"' />";
        divedita.href = "#"; divedita.className="modifyZoom"; divedita.id="zoom_"+type;
        divedit.appendChild(divedita);
        div.appendChild(divedit);

        var divzoom = document.createElement('div'); divzoom.className="divr CSzoom"; divzoom.style.width="60px"; divzoom.innerHTML= WMECSpeeds.typeOfRoad[type].zoom;
        div.appendChild(divzoom);
        getId('CSroadType').appendChild(div);
        getId('cbRoad'+type).checked = WMECSpeeds.typeOfRoad[type].checked;


    }

    getId('CScolor').onchange=(function(){
        getId('CScolor').style.backgroundColor=getId('CScolor').value;
    });
    getId('cancel').onclick=(function(){
        getId('editspeed').style.display = "none";
        getId('addbutton').style.display = "block";
        getId('CScolor').style.backgroundColor="#fff";
        getId('CScolor').value="";
        getId('newspeed').value="";
        getId('CStable').innerHTML="";
        getId('CSroadType').innerHTML="";
        LoadSettings();
    });
    getId('submit').onclick=(function(){
        var newSpeed = getId('newspeed').value;
        var newColor = getId('CScolor').value;
        if (newSpeed && newColor) {
            WMECSpeeds.speedColors[unit][newSpeed] = newColor;
        }
        getId('editspeed').style.display = "none";
        getId('addbutton').style.display = "block";
        getId('CScolor').style.backgroundColor="#fff";
        getId('CScolor').value="";
        getId('newspeed').value="";
        getId('CStable').innerHTML="";
        getId('CSroadType').innerHTML="";
        LoadSettings();
    });

    setupHandler();
}
function setupHandler() {

    var listeDelSpeed = getId("CStable");
    var btnDelSpeed = getElementsByClassName("delSpeed", listeDelSpeed);
    for (var i=0; i<btnDelSpeed.length; i++)
    {
        var target=btnDelSpeed[i];
        var index = target.id.split('_')[1];
        target.onclick = getFunctionWithArgs(SCSpeeds, [unit,index]);
    }

    var listeEditZoom = getId("CSroadType");
    var btnEditZoom = getElementsByClassName("modifyZoom", listeEditZoom);
    for (var i=0; i<btnEditZoom.length; i++)
    {
        var target=btnEditZoom[i];
        var index = target.id.split('_')[1];
        var val = WMECSpeeds.typeOfRoad[parseInt(index)].zoom;
        target.onclick = getFunctionWithArgs(SCEditZoom, [index, val]);
    }
}

function SCEditSpeed(unit,id,color){
    getId('editspeed').style.display = "block";
    getId('addbutton').style.display = "none";
    getId('newspeed').value=id;
    getId('CScolor').value=color;
    getId('CScolor').style.backgroundColor	=color;
}

function SCSpeeds(unit,idx){
    var answer = window.confirm(CSlang[4] +" "+idx+" "+unit+" ?");
    if (answer){
        delete WMECSpeeds.speedColors[unit][idx];
        getId('CStable').innerHTML="";
        getId('CSroadType').innerHTML="";
        LoadSettings();
    }
}

function SCEditZoom(idx, val){
    getId('editzoom').style.display = "block";
    getId('newvalzoom').value=val;
    getId('texttype').textContent = WMECSpeeds.typeOfRoad[idx].name;

    getId('submitZoom').onclick=(function(){
        var newValZoom = getId('newvalzoom').value;
        if (newValZoom) {
            WMECSpeeds.typeOfRoad[idx].zoom = newValZoom;
        }
        getId('editzoom').style.display = "none";
        getId('newvalzoom').value="";
        getId('CStable').innerHTML="";
        getId('CSroadType').innerHTML="";
        LoadSettings();
    });
    getId('cancelZoom').onclick=(function(){
        getId('editzoom').style.display = "none";
        getId('newvalzoom').value="";
        getId('CStable').innerHTML="";
        getId('CSroadType').innerHTML="";
        LoadSettings();
    });
}


/*
function removeItem(obj, prop, val) {
    var c, found=false;
    for(c in obj) {
        if(obj[c][prop] == val) { found=true; break; }
    }
    if(found){ delete obj[c]; }
}
*/

function firstGeometryOf(segment) {
    var actionManager = CSpeedsModel.actionManager;
    for (var i = 0; i <= actionManager.index; ++i) {
        var a = actionManager.actions[i];
        if (a.segment === segment) return a.oldGeometry;
    }
    return segment.geometry;
}

function shiftGeometry(d, line, trigo) // d=distance to shift, line=collection of OL points, trigo=boolean: true=left(trigo=CCW) false=right(CW) : fwd is CW, rev is trigo
{
	if (!trigo)
		d=-d;

	function getOrthoVector(p1, p2)
	{
		return [p1.y-p2.y , p2.x-p1.x];
	}

	function normalizeVector(v)
	{
		if (v[0]*v[0]+v[1]*v[1]==0)
			return v;
		var l=Math.sqrt(v[0]*v[0]+v[1]*v[1]);
		return [v[0]/l , v[1]/l];
	}

	var points = [];
	for (var i=0; i<line.length; i++)
	{
		// compute orthogonal vectors:
		var prevVector=[0,0];
		var nextVector=[0,0];
		if (i>0) // can compute prev
		{
			var p1=line[i-1];
			var p2=line[i];
			prevVector=getOrthoVector(p1, p2);
			prevVector=normalizeVector(prevVector);
		}
		if (i<line.length-1) // can compute next
		{
			var p1=line[i];
			var p2=line[i+1];
			nextVector=getOrthoVector(p1, p2);
			nextVector=normalizeVector(nextVector);
		}
		// sum vectors and normalize
		var v = [(prevVector[0]+nextVector[0]), (prevVector[1]+nextVector[1])];
        v=normalizeVector(v);
		points.push(new CSpeedOpenLayers.Geometry.Point(line[i].x+v[0]*d, line[i].y+v[1]*d));
	}
	return points;
}

function SCColor(){

    try { colorspeeds_mapLayer.destroyFeatures();
    }catch(err){log('err destroyFeatures: ',err);}

    WMECSpeeds.visibility = colorspeeds_mapLayer.visibility;
    if (!WMECSpeeds.visibility) return;

    var lineFeature = [];

    for (var i=0; i < RoadToScan.length; ++i){
        var type = RoadToScan[i];
        WMECSpeeds.typeOfRoad[type].checked = getId('cbRoad'+type).checked;
    }

    for (var seg in CSpeedsModel.segments.objects) {
        var segment = CSpeedsModel.segments.get(seg);
        var attributes = segment.attributes;
        var roadType = attributes.roadType;
        //var roundabout  = attributes.junctionID !== null;
        var line = getId(segment.geometry.id);
        var fwdspeed = attributes.fwdMaxSpeed;
        var revspeed = attributes.revMaxSpeed;
        var fwdspeedUnverified = attributes.fwdMaxSpeedUnverified;
        var revspeedUnverified = attributes.revMaxSpeedUnverified;
        var fwddir   = attributes.fwdDirection;
        var revdir   = attributes.revDirection;
        var fwdID = "",revID="";
        var isSelected = (segment.selected == true);
        var isModified = (segment.state == "Update");


        // check that WME hasn't highlighted this segment
  			//if (isSelected || isModified)	continue;
  			//if (isModified)	continue;

        var geometry = segment.geometry;
        //var geometry = isModified ? firstGeometryOf(segment) : segment.geometry;

        if (geometry == null) {
          continue;
        }

        if (zoom != CSpeedsMap.zoom) {
          zoom = CSpeedsMap.zoom;
          //log('zoom = ' + zoom + 'Waze.map.getResolution() = '+Waze.map.getResolution());
        }

		var shiftValue= 3*Waze.map.getResolution();

        if (RoadToScan.indexOf(roadType) == -1) continue;

        if (unit == 'mph'){
          fwdspeed = (fwdspeed!=null) ? (Math.trunc(fwdspeed*0.625)) : null;
          revspeed = (revspeed!=null) ? (Math.trunc(revspeed*0.625)) : null;
        }

        // turn off highlights when roads are no longer visible

        if ((zoom < WMECSpeeds.typeOfRoad[roadType].zoom) || !WMECSpeeds.typeOfRoad[roadType].checked) {
            continue;
        }

        var speedStyle = function(speed, unverified, restrictions) {
            var newColor="", newWidth = 6, newOpacity = WMECSpeeds.transparent ? 0.8 : 1, newLinecap = "butt", newDashes = "solid";
            //var newColor="", newWidth = 6, newOpacity = WMECSpeeds.transparent ? 0.8 : 1, newLinecap = "square", newDashes = "solid";
            //var newColor="", newWidth = 6, newOpacity = WMECSpeeds.transparent ? 0.8 : 1, newLinecap = "round", newDashes = "solid";

            if (unverified) { newLinecap = "round"; newDashes = "0 10"; }

            if (restrictions && restrictions.some(function (r) {
                return r.fromDate == "2020-01-01" && r.toDate == "2020-01-01" &&
                    /Auto-verified speed limit \d+ by .*/g.test(r.description);
              })) { newLinecap = "butt"; newDashes = "10 2"; }

            if (WMECSpeeds.speedColors[unit].hasOwnProperty(speed)) {
                newColor = WMECSpeeds.speedColors[unit][speed];

                if (unverified && !WMECSpeeds.colourUnverified) { newColor = "#ff0000"; }
            }
            else { newColor = "#ff0000"; }

            return {
                strokeColor: newColor,
                strokeOpacity: newOpacity,
                strokeWidth: newWidth,
                strokeDashstyle: newDashes,
                strokeLinecap: newLinecap
            };
        };

        if (fwddir && fwdspeed) {
            //Color for forward speed
            var style = speedStyle(fwdspeed, fwdspeedUnverified, attributes.fwdRestrictions);
            var points = WMECSpeeds.sidedOneWay||revdir ? shiftGeometry(shiftValue, geometry.getVertices(), CSpeedsModel.countries.top.leftHandTraffic) : geometry.getVertices();
            var newline = new CSpeedOpenLayers.Geometry.LineString(points);

            lineFeature.push(new CSpeedOpenLayers.Feature.Vector(newline, null, style));
        }

        if (revdir && revspeed) {
            //Color for reverse speed
            var style = speedStyle(revspeed, revspeedUnverified, attributes.revRestrictions);
            var points = WMECSpeeds.sidedOneWay||fwddir ? shiftGeometry(shiftValue, geometry.getVertices(), !CSpeedsModel.countries.top.leftHandTraffic) : geometry.getVertices();
            var newline = new CSpeedOpenLayers.Geometry.LineString(points);

            lineFeature.push(new CSpeedOpenLayers.Feature.Vector(newline, null, style));
        }

    }
    //log("lineFeature = ",lineFeature);
    // Display new array of segments
    try{
      colorspeeds_mapLayer.addFeatures(lineFeature);
    }catch(err){log('err addFeatures: ',err);}

}

/* begin running the code! */
CSpeeds_bootstrap    ();

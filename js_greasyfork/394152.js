// ==UserScript==
// @name             WME Errors
// @name:fr          WME Errors
// @version          0.10
// @icon             data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALuSURBVHja7Jots6swEIb7x6qiUFVVUVEoVBSqKioqU8EfqKpCRaE6FShMo5gjUCiOYebOzTXnvaKlhR44LbS9vcyQmVWdbt5nd7P5GGbr/eFjvT98jtQ+Zuv9oVzvDxiplbMTyVgBPieACWACmADeD/Bn7ABfE8D77PfYAfBUgFCt4DEKZz7H/Js5oMzDSoXPBPh6GCBSHAvSJviGkQW4it4HECmvI9IncygYY2ALcgPGgTccpD9AkQRwf4g4cQPEWYnzsDHkXRlxESTFawFixUDOkxIwIeEvLiKojFFclKPIDOJwhWWX6AWHWF35VPFrAEJeKwXHw9aUsIm8TO6GyE7S80iA3bUuCGRiUZotPKeWRR4+F0DXxBMeIrNHoUaRhhAAKCJei+htI8ocnZUGG7c+j34OQF08FTvk5xLJELJKiEICAEixWfbsRuySOSDHTtA+ED8D5Jo3nF3EA4CBqkR4p98KDd63nc4VTMNv3gga1/lwALeahCoYi6tRA5hzhFmJPFr1Kp92AADWQNHqd3cYQORX7Y1D52gZObQ3YAO7Nu86s5X7Wjb9qD/AOboihkX7SDfLhwGWm7TDu0UsLlnqDbATVR1SKGO7CEAfAqDo0m+NOvsmYjdsDXByq4wsYkkGAxDZkd1cN+YevIgbPb11IV8vuB52lz8CHhWP7QNG1foyC5CULZMWMWQfCCoRFy1+ygQBq+07yjxnJ65vLnMqELWVk82gBbvRRh24MuroOhFELQi0u+6HnYViSRuLT+gUbclAmSEOFVYeOx6nGQPzJbY6Qdb+B6RaNJoBlfFrTqNZ6DfuAIQJ6LTE0FGmGoKRRob8MHv9haY56RxkwaG0QV7am6JtkSHRCvzqokOY+Lc3slR3HJkdCuatoIIAwdmOJUWdtosMg9Dp++7EpiWad+0Bp6z9V68S6/0BgfTBvr1MOKCMwZfBs59Vfs3G/CZUvczZ6XV6ApgAJoAJYAIYM8DoP/YY9ec2fwcAaebQXj6i79wAAAAASUVORK5CYII=
// @description      Adds colours to show errors
// @description:fr   Colorisation pour afficher les erreurs
// @include          https://www.waze.com/editor*
// @include          https://www.waze.com/*/editor*
// @include          https://beta.waze.com/*
// @exclude          https://www.waze.com/user/*
// @exclude          https://www.waze.com/*/user/*
// @namespace        https://greasyfork.org/
// @author	         Josevaldos950
// @copyright        Josevaldos950
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/394152/WME%20Errors.user.js
// @updateURL https://update.greasyfork.org/scripts/394152/WME%20Errors.meta.js
// ==/UserScript==

var WMECErrors={}, ColorErrors_mapLayer=[], CErrLeg, CErrSeg, CErrPoi, myLevel, prefPhone, debug="";
var CErrWaze, CErrorsMap, CErrorsModel, CErrorsI18n, CErrorsOpenLayers, CErrorshandle, CErrorshandleClass, CErrorshandleClass2,

    //french rules
    streetNameSeg="^(^Le |^La |^Les |Grande |Allée |[ ]?Avenue[]?|Boulevard |Chemin |Cité |Clos |Côte |Cour[s]? |Descente |Domaine |Hameau |Impasse |Levée |Lotissement |Mail |Montée |Parc |Passage |Place |Placette |Pont |Promenade |Quai |Résidence[s]? |Route |[ ]?Rue[ ]?|Ruelle |Sente |Sentier |Square |Traverse |Venelle |Villa |Voie )",
    parkNameSeg="^(Aire |Place |Square )",
    excepNameSeg="(Périphérique|Rocade|Duplex|Tunnel|Pont)",
    privNameSeg="^(Allée |Avenue |Boulevard |Chemin |Clos |Côte |Cours |Faubourg |Hameau |Impasse |Lotissement |Mail |Passage |Porte |Promenade |Quai |Route |Rue |Ruelle |Sente |Sentier |Voie )",
    parkNamePoi="(Parking[s]?|Parc-Relais|Placette|Aire|Arrêt|Emplacement)",
    religiousPoi="(Abbatiale|Abbaye|Basilique|Calvaire|Carmel|Cathédrale|Chapelle|Cloître|Collégiale|Conjuratoire|Couvent|Crypte|Dôme|Église|Grande Mosquée|Grotte|Mandir|Maison Diocésaine|Monastère|Mosquée|Notre-Dame|Oratoire|Ordre|Pagode|Paroisse|Presbytère|Prieuré|Sanctuaire|Stupa|Synagogue|Temple)",
    busPoi="(Bus[ ][-][ ]|Gare Routière)",
    tramPoi="(Tramway[ ][-][ ]|Métro[ ][-][ ])",
    possibleTransPoi="(Tram$|Métro$|Arrêt$|Gare$|Station$|Tram |Métro |Arrêt |Gare |Station )",

    // common all countries
    stationsPoi="(CAR_WASH|CHARGING_STATION|FACTORY_INDUSTRIAL|GAS_STATION|JUNCTION_INTERCHANGE|PARKING_LOT|SEAPORT_MARINA_HARBOR|SKI_AREA|SUPERMARKET_GROCERY|TAXI_STATION|TRANSPORTATION|TRASH_AND_RECYCLING_FACILITIES)",
    landmarkPoi="(RIVER_STREAM|CANAL|SEA_LAKE_POOL|POOL|SWAMP_MARSH|ISLAND|FOREST_GROVE|BRIDGE)",
    excepCatPoi="(RIVER_STREAM|CANAL|SEA_LAKE_POOL|SWAMP_MARSH|ISLAND|FOREST_GROVE|BRIDGE|SWAMP_MARSH|PARK|JUNCTION_INTERCHANGE|CEMETERY|TUNNEL)",
    entryPointPoi="(BRIDGE|CANAL|FOREST_GROVE|ISLAND|JUNCTION_INTERCHANGE|POOL|RIVER_STREAM|SEA_LAKE_POOL|SWAMP_MARSH|TUNNEL)",
    wazeBot="(admin|avseu|WazeFeed|waze-maint-bot|Waze3rdparty)";

// *********************
// ** HELPER FUNCTION **
// *********************

function getId(node) {
    return document.getElementById(node);
}
function getElementsByClassName(classname, node) {
    node || (node=document.getElementsByTagName("body")[0]);
    for (var a=[], re=new RegExp("\\b" + classname + "\\b"), els=
         node.getElementsByTagName("*"), i=
         0, j=
         els.length;i < j;i++) {
        re.test(els[i].className) && a.push(els[i]);
    }
    return a;
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getSelectedFeatures(){
    if(!W.selectionManager.getSelectedFeatures)
        return W.selectionManager.selectedItems;
    return W.selectionManager.getSelectedFeatures();
}
// *************
// **  INIT   **
// *************
function CErrors_bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow   =( function () {
            var dummyElem=document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    console.log("starting WME Color Errors", GM_info.script.version);
    CErrors_init();
    fixTel();
}
function CErrors_init(){
    // W object needed
    CErrWaze=unsafeWindow.W;    if(typeof(CErrWaze) === 'undefined'){ if (debug) { console.error("WME ColorErrors - CErrWaze : NOK"); } window.setTimeout(CErrors_init, 500); return; }
    CErrorsMap=CErrWaze.map;       if(typeof(CErrorsMap) == 'undefined'){ if (debug) { console.error("WME ColorErrors - CErrorsmap : NOK"); } window.setTimeout(CErrors_init, 500); return; }
    CErrorsModel=CErrWaze.model;   if(typeof(CErrorsModel) == 'undefined'){ if (debug) { console.error("WME ColorErrors - CErrorsmodel : NOK"); } window.setTimeout(CErrors_init, 500); return; }
    if(typeof(CErrorsModel.getTopCountry()) === 'undefined' || CErrorsModel.getTopCountry() === null){ if (debug) { console.error("WME ColorErrors - CErrorsmodel Countries top : NOK"); } window.setTimeout(CErrors_init, 500); return; }
    CErrorsI18n=unsafeWindow.I18n; if(typeof (CErrorsI18n) == 'undefined') { if (debug) { console.error('WME ColorErrors - CErrorsI18n : NOK'); } setTimeout(CErrors_init, 500); return; }
    // OpenLayers
    CErrorsOpenLayers=unsafeWindow.OL; if(typeof(CErrorsOpenLayers) === 'undefined'){ if (debug) { console.error("WME ColorErrors - OL : NOK"); } window.setTimeout(CErrors_init, 500); return; }
    // Waze GUI needed
    CErrorshandle=getId("user-info"); if(typeof(CErrorshandle) == 'undefined'){ window.setTimeout(CErrors_init, 500); return; }
    CErrorshandleClass=getElementsByClassName("nav-tabs", CErrorshandle)[0]; if(typeof(CErrorshandleClass) === 'undefined'){ window.setTimeout(CErrors_init, 500); return; }
    CErrorshandleClass2=getElementsByClassName("tab-content", CErrorshandle)[0]; if(typeof(CErrorshandleClass2) === 'undefined'){ window.setTimeout(CErrors_init, 500); return; }

    // Verify localStorage. Init if empty or not correct
    if (typeof(localStorage.WMEColorErrors) === "undefined" || localStorage.WMEColorErrors.lenght===null || !IsJsonString(localStorage.WMEColorErrors)) {
        WMECErrors.opacity=0.85; // Icons Opacity on map
        WMECErrors.myLvl=false; // Show when editable
        WMECErrors.seg_Bad=false; // Bad Segments (group)
        WMECErrors.seg_Priv=true; // Private with bad name
        WMECErrors.seg_Park=true; // Parking with name (but Place / Square)
        WMECErrors.seg_Rail=true; // Railroad with bad name
        WMECErrors.seg_HW_name=true; //Highways with bad name
        WMECErrors.seg_Dir_name=true; // Directions but not Ramp/Freeway
        WMECErrors.seg_Toll=true; // Toll (but Ramp/Freeway)
        WMECErrors.seg_Ramp_name=true; // Ramp with 3 directions or more
        WMECErrors.seg_Ramp_city=true; // Ramp with city name
        WMECErrors.seg_RShield=true; // Wrong prefix
        WMECErrors.seg_RSAlt=true; //Roadshield must be in alt
        WMECErrors.seg_SNameAlt=true; //Road name must be in alt
        WMECErrors.seg_DleSpace=true; // Double space in name
        WMECErrors.seg_SegBadRS=true; // RoadShield but bad type
        WMECErrors.seg_HNFree=true; // House number on Freeway or ramp
        WMECErrors.seg_BadSpeed=true; // Bad speed (ex: >80km/h in city)
        WMECErrors.seg_BadAltState=true; // Alt State != Main State
        WMECErrors.seg_LockValue=true; // Bad lock
        // POI
        WMECErrors.poi_Bad=false; // Bad POI (group)
        WMECErrors.poi_Park_name=true; // Parking with [P]
        WMECErrors.poi_Address=true; // Dxxx/Nxxx in or no address
        WMECErrors.poi_Entry=true; // Entry Point not defined
        WMECErrors.poi_LandM=true; // Landmark with address (street |& city)
        WMECErrors.poi_DleSpace=true; // Double space in name
        // Low errors
        WMECErrors.poi_Resid=true; // Maybe a residential
        WMECErrors.poi_Google=true; // No link with Google
        WMECErrors.poi_Phone=true; // bad phone number format
        WMECErrors.poi_WFeed=true; // Place created by WazeFeed
        WMECErrors.poi_WPark=true; // Place created by WazeParking1
        WMECErrors.poi_Relig=true; // Religious Center with bad name
        WMECErrors.poi_Transp=true; // Bad type or bad name for Buses, Subway or Tramway
        WMECErrors.poi_GasSta=true; // Gas Station with bad name
        WMECErrors.poi_Other=true; // Place "Other"
        localStorage.setItem('WMEColorErrors', JSON.stringify(WMECErrors));
    }

    // Phone prefix
    switch(CErrorsModel.getTopCountry().id) {
        case 3: prefPhone='+213[ ](\\d{2})'; break; // format +213 (dd) xx xx xx @ Algeria
        case 73: prefPhone='+33[ ]\\d[ ]\\d{2}'; break; // format +33 d (dd) xx xx xx @ France
        case 74: prefPhone='+594[ ]594'; break; // format +594 594 xx xx xx @ French Guiana
        case 88: prefPhone='+590[ ]590'; break; // format +590 590 xx xx xx @ Guadeloupe
        case 141: prefPhone='+596[ ]596'; break; // format +596 596 xx xx xx @ Martinique
        case 148: prefPhone='+377[ ]\\d{2}'; break; // format +377 xx xx xx xx @ Monaco
        case 152: prefPhone='+212[ ](\\d{3})'; break; // format +212 xxx xx xx xx @ Morocco
        case 184: prefPhone='+262[ ]262'; break; // format +262 262 xx xx xx @ Reunion
        default : break;
    }

    // WME Layers check
    var layersColor=CErrorsMap.getLayersBy("uniqueName","__WME_Color_Errors"), layersIcons=CErrorsMap.getLayersBy("uniqueName","__WME_Color_Errors_Icons");
    var ColorErrors_style=new CErrorsOpenLayers.Style({
        pointRadius: 2,
        fontWeight: "normal",
        label : "${labelText}",
        fontFamily: "Tahoma, Courier New",
        labelOutlineColor: "#FFFFFF",
        labelOutlineWidth: 2,
        fontColor: '#000000',
        fontSize: "10px"
    });
    if (layersColor.length === 0) {
        ColorErrors_mapLayer=new CErrorsOpenLayers.Layer.Vector("Color Errors", {
            displayInLayerSwitcher: false,
            uniqueName: "__WME_Color_Errors",
            styleMap: new CErrorsOpenLayers.StyleMap(ColorErrors_style)
        });
        CErrorsI18n.translations[CErrorsI18n.locale].layers.name["__WME_Color_Errors"]="Color Errors";
        CErrorsMap.addLayer(ColorErrors_mapLayer);
        ColorErrors_mapLayer.setVisibility(true);
    }
    if (layersIcons.length === 0) {
        ColorErrors_mapLayerIcons=new CErrorsOpenLayers.Layer.Vector("Color Errors Icons", {
            displayInLayerSwitcher: false,
            uniqueName: "__WME_Color_Errors_Icons",
            styleMap: new CErrorsOpenLayers.StyleMap(ColorErrors_style)
        });
        CErrorsI18n.translations[CErrorsI18n.locale].layers.name["__WME_Color_Errors_Icons"]="Color Errors Icons";
        CErrorsMap.addLayer(ColorErrors_mapLayerIcons);
        ColorErrors_mapLayerIcons.setVisibility(true);
    }
    myLevel=CErrWaze.loginManager.user.rank;
    CErrors_Mainhtml();
}
function CErrAddInfo(){
    if (getSelectedFeatures().length !== 0 && !getId('ErrorsList')) {
        var CEtest = document.createElement('li');
        CEtest.id = "ErrorsList";
        if(getElementsByClassName('additional-attributes')[0]) getElementsByClassName('additional-attributes')[0].appendChild(CEtest);
    }
}
// *************
// **  HTML   **
// *************

function CErrors_Mainhtml() {
    if (CErrorsI18n.locale == 'fr') {
        CErrSeg=new Array('Contrôle des segments',
                          'Mauvais segments',
                          'Voie privée avec possible mauvais nom',
                          'Voie de Parking nommée',
                          'Voie ferrée nommée ou nom en alt',
                          'Types Routes avec mauvais nom',
                          'Bretelle avec plusieurs directions',
                          'Direction (sauf bretelle et Autoroute)',
                          'Mauvais préfixe (RoadShield)',
                          'Double espace dans le nom',
                          'Péage (sauf bretelle et Autoroute)',
                          'Bretelle/Autoroute avec nom de ville',
                          'Le RoadShield doit être en alt',
                          'Le nom de route doit être en alt',
                          'RoadShield sur mauvais type de voie',
                          'N° de rue sur mauvais type de voie',
                          'Mauvaise vitesse validée',
                          'Département alt différent du principal',
                          'Lock non conforme (Auto ou valeur)'
                         );
        CErrPoi=new Array('Contrôle des places',
                          'Mauvaises places',
                          'Parking mal nommé ou sans nom',
                          'Pas d\'adresse ou contenant Dxxx/Nxxx',
                          'Point d\'entrée non défini',
                          'Site naturel avec adresse',
                          'Double espace dans le nom',
                          'Peut-être une place résidentielle',
                          'Pas de lien avec Google',
                          'Lieu édité par WazeFeed',
                          'Lieu de type "Autres"',
                          'Lieu édité par WazeParking1',
                          'Parking : type non défini',
                          'Mauvais format du n° de tel',
                          'Lieu de culte (nom ou catégorie)',
                          'Transport (nom ou catégorie)',
                          'Station-Service mal nommée',
                         );
        CErrLeg=new Array('Légende',
                          'A corriger',
                          'A vérifier',
                          'Pour information',
                          'Réglages',
                          'Opacité des icônes',
                          'Afficher seulements les éditables',
                          'Verrouillé par la publicité'
                         );
    }
    else {
        CErrSeg=new Array('Segments Checking',
                          'Bad Segments',
                          'Private with possible bad name',
                          'Parking with bad name or without',
                          'Railroad with name or altname',
                          'Highways with bad name',
                          'Ramp with several directions',
                          'Direction (but Ramp/Freeway)',
                          'Wrong prefix (RoadShield)',
                          'Double spacing in name',
                          'Toll (but Ramp/Freeway)',
                          'Ramp/Freeway with city name',
                          'RoadShield must be in alt',
                          'Road name must be in alt',
                          'RoadShield but bad type',
                          'HN but bad type',
                          'Bad speed verified',
                          'Alt State dirrent to Main State',
                          'Bad lock (Auto or value)'
                         );
        CErrPoi=new Array('Places Checking',
                          'Bad Places',
                          'Parking with bad name or null',
                          'No address or Dxxx/Nxxx within',
                          'Entry Point not defined',
                          'Natural features with address',
                          'Double spacing in name',
                          'Maybe a residential place',
                          'No link with Google',
                          'Place created by WazeFeed',
                          'Place type is "Other"',
                          'Place created by WazeParking1',
                          'Parking : type undefined',
                          'Bad phone number format',
                          'Religious Center (name or cat)',
                          'Transportation (name or cat)',
                          'Gas Station with bad name'
                         );
        CErrLeg=new Array('Legend',
                          'To correct',
                          'To check',
                          'For information',
                          'Settings',
                          'Icons opacity',
                          'Show when editable',
                          'Locked by ad'
                         );
    }
    //Create content in CErrors's tab
    var CEnewtab=document.createElement('li');
    CEnewtab.innerHTML="<a href='#sidepanel-ColorErrors' data-toggle='tab'><span class='fa fa-eye' title='Color Errors'></span></a>";
    CErrorshandleClass.appendChild(CEnewtab);

    var WMECErrors=JSON.parse(localStorage.getItem('WMEColorErrors'));
    var CEaddon=document.createElement('section');
    CEaddon.id="sidepanel-ColorErrors";
    var CEcontent='<div style="float:left; margin-left:5px;padding-bottom:10px;"><b><a href="https://greasyfork.org/fr/scripts/21186-wme-color-errors" target="_blank"><u>WME Color Errors</u></a></b> v'+ GM_info.script.version +'</div>'
    + '<h4 style="float:left;clear:both;">'+CErrLeg[4]+'</h4><span style="float:left;clear:both;font-weight:bold;margin-top:10px;">'+CErrLeg[5]+'</span><input id="errOpacity" type="range" max="1" min="0"  step="0.05" style="float:left;width:240px;"><div id="opacityValue" style="float:left;font-weight:bold;padding-left:10px;"></div>'
    + '<div style="float:left;clear:both;"><input type="checkbox" id="_myLvl"'+(WMECErrors.myLvl ? ' checked' : '')+'/> '+CErrLeg[6]+'</div>'
    + '<br><br><h4 style="float:left;margin-top:10px;">'+CErrSeg[0]+'</h4><div style="clear:both;">'
    + '<input type="checkbox" id="_seg_Bad"'+(WMECErrors.seg_Bad ? ' checked' : '')+'/> '+CErrSeg[1]+'<br><div id="BadSeg" style="margin-left:5px;"><table>';
    CEcontent += fillHtml("seg_Priv",       "seg_Bad","#ff7700","\uf256",CErrSeg[2]);
    CEcontent += fillHtml("seg_Ramp_name",  "seg_Bad","#ff7700","\uf25a",CErrSeg[6]);
    CEcontent += fillHtml("seg_BadSpeed",   "seg_Bad","#ff7700","\uf1ce",CErrSeg[16]);
    CEcontent += fillHtml("seg_BadAltState","seg_Bad","#ff7700","\uf037",CErrSeg[17]);
    CEcontent += fillHtml("seg_LockValue",  "seg_Bad","#ff7700","\uf023",CErrSeg[18]);
    CEcontent += fillHtml("seg_Park",       "seg_Bad","#ff0000","\uf288",CErrSeg[3]);
    CEcontent += fillHtml("seg_Rail",       "seg_Bad","#ff0000","\uf238",CErrSeg[4]);
    CEcontent += fillHtml("seg_Dir_name",   "seg_Bad","#ff0000","\uf0a9",CErrSeg[7]);
    CEcontent += fillHtml("seg_Toll",       "seg_Bad","#ff0000","\uf155",CErrSeg[10]);
    CEcontent += fillHtml("seg_Ramp_city",  "seg_Bad","#ff0000","\uf015",CErrSeg[11]);
    CEcontent += fillHtml("seg_SNameAlt",   "seg_Bad","#ff0000","\uf079",CErrSeg[13]);
    CEcontent += fillHtml("seg_DleSpace",   "seg_Bad","#ff0000","\uf101",CErrSeg[9]);
    CEcontent += fillHtml("seg_HW_name",    "seg_Bad","#ff0000","\uf018",CErrSeg[5]);
    CEcontent += fillHtml("seg_RSAlt",      "seg_Bad","#ff0000","\uf074",CErrSeg[12]);
    CEcontent += fillHtml("seg_RShield",    "seg_Bad","#ff0000","\uf152",CErrSeg[8]);
    CEcontent += fillHtml("seg_SegBadRS",   "seg_Bad","#ff0000","\uf044",CErrSeg[14]);
    CEcontent += fillHtml("seg_HNFree",     "seg_Bad","#ff0000","\uf162",CErrSeg[15]);

    CEcontent += '</table></div></div><br><h4 style="float:left;">'+CErrPoi[0]+'</h4><div style="clear:both;"><tr><td><input type="checkbox" id="_poi_Bad"'+(WMECErrors.poi_Bad ? ' checked' : '')+'/> '+CErrPoi[1]+'<br><div id="BadPoi" style="margin-left:5px;"><table>';
    CEcontent += fillHtml("poi_Address",  "poi_Bad","#ff0000","\uf2bc",CErrPoi[3]);
    CEcontent += fillHtml("poi_LandM",    "poi_Bad","#ff0000","\uf1bb",CErrPoi[5]);
    CEcontent += fillHtml("poi_DleSpace", "poi_Bad","#ff0000","\uf101",CErrPoi[6]);
    CEcontent += fillHtml("poi_Transp",   "poi_Bad","#ff0000","\uf207",CErrPoi[15]);
    CEcontent += fillHtml("poi_GasSta",   "poi_Bad","#ff0000","\uf1b9",CErrPoi[16]);
    CEcontent += fillHtml("poi_Park_name","poi_Bad","#ff0000","\uf288",CErrPoi[2]);
    CEcontent += fillHtml("poi_Park_type","poi_Bad","#ff0000","\uf11d",CErrPoi[12]);
    CEcontent += fillHtml("poi_Relig",    "poi_Bad","#ff0000","\uf015",CErrPoi[14]);
    CEcontent += fillHtml("poi_Entry",    "poi_Bad","#ff7700","\uf18e",CErrPoi[4]);
    CEcontent += fillHtml("poi_Resid",    "poi_Bad","#ff7700","\uf015",CErrPoi[7]);
    CEcontent += fillHtml("poi_Google",   "poi_Bad","#ff7700","\uf1a0",CErrPoi[8]);
    CEcontent += fillHtml("poi_Phone",    "poi_Bad","#ff7700","\uf095",CErrPoi[13]);
    CEcontent += fillHtml("poi_Other",    "poi_Bad","#ff7700","\uf29c",CErrPoi[10]);
    CEcontent += fillHtml("poi_WFeed",    "poi_Bad","#ffcc00","\uf263",CErrPoi[9]);
    CEcontent += fillHtml("poi_WPark",    "poi_Bad","#ffcc00","\uf263",CErrPoi[11]);
    CEcontent += '</table></div></div><br><h4 style="float:left;">'+CErrLeg[0]+'</h4><div style="clear:both;">';
    CEcontent += '<table><tr><td><div style="margin:5px;width:30px;height:2px;background-color:#ff0000;"></div></td><td>'+CErrLeg[1]+'</td></tr>';
    CEcontent += '<tr><td><div style="margin:5px;width:30px;height:2px;background-color:#ff7700;"></div></td><td>'+CErrLeg[2]+'</td></tr>';
    CEcontent += '<tr><td><div style="margin:5px;width:30px;height:2px;background-color:#ffcc00;"></div></td><td>'+CErrLeg[3]+'</td></tr></table></div>';
    CEaddon.innerHTML=CEcontent;
    CEaddon.className='tab-pane';
    CErrorshandleClass2.appendChild(CEaddon);

    getId('errOpacity').value=WMECErrors.opacity;
    getId('opacityValue').innerHTML = getId('errOpacity').value;

    getId('errOpacity').onmousemove = function(){
        getId('opacityValue').innerHTML = getId('errOpacity').value;
        var ls=JSON.parse(localStorage.WMEColorErrors);
        ls.opacity=getId('errOpacity').value;
        localStorage.setItem('WMEColorErrors', JSON.stringify(ls));
        CErrColor();
    };
    getId('_myLvl').onclick=(function(){
        var ls=JSON.parse(localStorage.WMEColorErrors);
        (getId('_myLvl').checked === true ? ls.myLvl=true : ls.myLvl=false);
        localStorage.setItem('WMEColorErrors', JSON.stringify(ls));
        CErrColor();
    });
    getId('_seg_Bad').onclick=(function(){
        var ls=JSON.parse(localStorage.WMEColorErrors);
        if (getId('_seg_Bad').checked === true) {
            for (var i=0; getElementsByClassName('_seg', BadSeg) [i]; i++) getElementsByClassName('_seg', BadSeg) [i].disabled=false;
            ls.seg_Bad=true;
        }
        else {
            for (var i=0; getElementsByClassName('_seg', BadSeg) [i]; i++) getElementsByClassName('_seg', BadSeg) [i].disabled=true;
            ls.seg_Bad=false;
        }
        localStorage.setItem('WMEColorErrors', JSON.stringify(ls));
        CErrColor();
    });
    getId('_poi_Bad').onclick=(function(){
        var ls=JSON.parse(localStorage.WMEColorErrors);
        if (getId('_poi_Bad').checked === true) {
            for (var i=0; getElementsByClassName('_poi', BadPoi) [i]; i++) getElementsByClassName('_poi', BadPoi) [i].disabled=false;
            ls.poi_Bad=true;
        }
        else {
            for (var i=0; getElementsByClassName('_poi', BadPoi) [i]; i++) getElementsByClassName('_poi', BadPoi) [i].disabled=true;
            ls.poi_Bad=false;
        }
        localStorage.setItem('WMEColorErrors', JSON.stringify(ls));
        CErrColor();
    });
    getId('_seg_Priv').onclick=(function(){       var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Priv').checked === true) ? ls.seg_Priv=true : ls.seg_Priv=false;                localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Park').onclick=(function(){        var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Park').checked === true) ? ls.seg_Park=true : ls.seg_Park=false;                localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Rail').onclick=(function(){        var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Rail').checked === true) ? ls.seg_Rail=true : ls.seg_Rail=false;                localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_HW_name').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_HW_name').checked === true) ? ls.seg_HW_name=true : ls.seg_HW_name=false;       localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Dir_name').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Dir_name').checked === true) ? ls.seg_Dir_name=true : ls.seg_Dir_name=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Toll').onclick=(function(){        var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Toll').checked === true) ? ls.seg_Toll=true : ls.seg_Toll=false;                localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Ramp_name').onclick=(function(){   var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Ramp_name').checked === true) ? ls.seg_Ramp_name=true : ls.seg_Ramp_name=false; localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_Ramp_city').onclick=(function(){   var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_Ramp_city').checked === true) ? ls.seg_Ramp_city=true : ls.seg_Ramp_city=false; localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_RShield').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_RShield').checked === true) ? ls.seg_RShield=true : ls.seg_RShield=false;       localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_RSAlt').onclick=(function(){       var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_RSAlt').checked === true) ? ls.seg_RSAlt=true : ls.seg_RSAlt=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_SNameAlt').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_SNameAlt').checked === true) ? ls.seg_SNameAlt=true : ls.seg_SNameAlt=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_DleSpace').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_DleSpace').checked === true) ? ls.seg_DleSpace=true : ls.seg_DleSpace=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_SegBadRS').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_SegBadRS').checked === true) ? ls.seg_SegBadRS=true : ls.seg_SegBadRS=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_HNFree').onclick=(function(){      var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_HNFree').checked === true) ? ls.seg_HNFree=true : ls.seg_HNFree=false;          localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_BadSpeed').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_BadSpeed').checked === true) ? ls.seg_BadSpeed=true : ls.seg_BadSpeed=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_BadAltState').onclick=(function(){ var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_BadAltState').checked === true) ? ls.seg_BadAltState=true : ls.seg_BadAltState=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_seg_LockValue').onclick=(function(){ var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_seg_LockValue').checked === true) ? ls.seg_LockValue=true : ls.seg_LockValue=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });

    getId('_poi_Park_name').onclick=(function(){ var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Park_name').checked === true) ? ls.poi_Park_name=true : ls.poi_Park_name=false; localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Park_type').onclick=(function(){ var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Park_type').checked === true) ? ls.poi_Park_type=true : ls.poi_Park_type=false; localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Address').onclick=(function(){   var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Address').checked === true) ? ls.poi_Address=true : ls.poi_Address=false;       localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Entry').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Entry').checked === true) ? ls.poi_Entry=true : ls.poi_Entry=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_LandM').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_LandM').checked === true) ? ls.poi_LandM=true : ls.poi_LandM=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_DleSpace').onclick=(function(){  var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_DleSpace').checked === true) ? ls.poi_DleSpace=true : ls.poi_DleSpace=false;    localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Resid').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Resid').checked === true) ? ls.poi_Resid=true : ls.poi_Resid=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Google').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Google').checked === true) ? ls.poi_Google=true : ls.poi_Google=false;          localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Phone').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Phone').checked === true) ? ls.poi_Phone=true : ls.poi_Phone=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_WFeed').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_WFeed').checked === true) ? ls.poi_WFeed=true : ls.poi_WFeed=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_WPark').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_WPark').checked === true) ? ls.poi_WPark=true : ls.poi_WPark=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Relig').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Relig').checked === true) ? ls.poi_Relig=true : ls.poi_Relig=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Other').onclick=(function(){     var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Other').checked === true) ? ls.poi_Other=true : ls.poi_Other=false;             localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_Transp').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_Transp').checked === true) ? ls.poi_Transp=true : ls.poi_Transp=false;          localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });
    getId('_poi_GasSta').onclick=(function(){    var ls=JSON.parse(localStorage.WMEColorErrors); (getId('_poi_GasSta').checked === true) ? ls.poi_GasSta=true : ls.poi_GasSta=false;          localStorage.setItem('WMEColorErrors', JSON.stringify(ls)); CErrColor(); });

    CErrWaze.selectionManager.events.register("selectionchanged", null, CErrAddInfo);
    CErrWaze.selectionManager.events.register("selectionchanged", null, CErrColor);
    CErrorsModel.actionManager.events.register("afterclearactions", null, CErrColor);
    CErrorsModel.actionManager.events.register("afterundoaction", null, CErrColor);
    CErrorsMap.events.register("zoomend", null, CErrColor);
    CErrorsMap.events.register("moveend", null, CErrColor);
    window.setTimeout(CErrColor, 500);
}
function fillHtml(id,type,color,icon,text) {
    var WMECErrors=JSON.parse(localStorage.getItem('WMEColorErrors'));
    return '<tr style="line-height:14px;"><td style="width:20px;"><input type="checkbox" class="'+(type==="seg_Bad" ? '_seg' : '_poi')+'" id="_'+id+'"'+(WMECErrors[id] ? ' checked' : '')+(WMECErrors[type] ? '' : ' disabled')+'/></td><td style="width:20px;"><font style="color:'+color+';font-family:FontAwesome;">'+icon+'</font></td><td><label for="_'+id+'" style="font-weight:normal;">'+text+'</label></td></tr>';
}
function checkClicLayer(){
    var lieu=CErrorsI18n.translations[CErrorsI18n.locale].layers.name.landmarks;
    getId('layer-switcher-'+CErrorsMap.getLayersByName(lieu)[0].id).onclick=(function(){
        window.setTimeout((function() {
            CErrColor();
        }),10);
    });
}
function addIcon(icon,color,geometry,type,pos) {
    var style = {
        fill: false,
        stroke: false,
        label: icon,
        labelAlign: "cb",
        labelXOffset: -4,
        labelYOffset: (pos*20),
        fontColor: color,
        fontSize:"20px",
        fontOpacity: getId('errOpacity').value,
        fontFamily: "FontAwesome",
        labelOutlineWidth: 2,
        zIndex: 99999
    };
    if (type==="segment") {
        if(geometry.length==2){
            var midX = (((geometry[0].x + geometry[1].x) / 2) + geometry[0].x) / 2;
            var midY = (((geometry[0].y + geometry[1].y) / 2) + geometry[0].y) / 2;
            var labelPoint = new CErrorsOpenLayers.Geometry.Point(midX,midY);
            var imageFeature = new CErrorsOpenLayers.Feature.Vector(labelPoint, null, style);
            ColorErrors_mapLayer.addFeatures([imageFeature]);
        }
        else {
            for(i=0;i<geometry.length-1;i++){
                if(i%3==1){
                    var midX = (((geometry[i].x + geometry[i+1].x) / 2) + geometry[i].x) / 2;
                    var midY = (((geometry[i].y + geometry[i+1].y) / 2) + geometry[i].y) / 2;
                    var labelPoint = new CErrorsOpenLayers.Geometry.Point(midX,midY);
                    var imageFeature = new CErrorsOpenLayers.Feature.Vector(labelPoint, null, style);
                    ColorErrors_mapLayer.addFeatures([imageFeature]);
                }
            }
        }
    }
    else {
        var midX = (((geometry.left + geometry.right) / 2) + geometry.right) / 2;
        var midY = (((geometry.bottom + geometry.top) / 2) + geometry.bottom) / 2;
        var labelPoint = new CErrorsOpenLayers.Geometry.Point(midX,midY);
        var imageFeature = new CErrorsOpenLayers.Feature.Vector(labelPoint, null, style);
        ColorErrors_mapLayer.addFeatures([imageFeature]);
    }
}
function addLegend(id,icon,color,text){
    if(getSelectedFeatures()[0] && getSelectedFeatures()[0].model.attributes.id===id && getId('ErrorsList')) {
        getId('ErrorsList').innerHTML +="<span style='color:"+color+";font-family:FontAwesome;'>"+icon+"</span> <span style='color:"+color+";'>"+text+"</span><br>";
    }
}
function CErrColor(){
    var lineFeature=[], ls=JSON.parse(localStorage.WMEColorErrors);
    var lieu=CErrorsI18n.translations[CErrorsI18n.locale].layers.name.landmarks;

    // Initialize layer
    try { ColorErrors_mapLayer.destroyFeatures(); }
    catch(err){ log('err destroyFeatures: ',err); }

    if (getId('ErrorsList')) { getId('ErrorsList').innerHTML=""; }

    //Segments Checking
    if (ls.seg_Bad) {
        for (var seg in CErrorsModel.segments.objects) {
            // Get values
            var segment=CErrorsModel.segments.getObjectById(seg), j=0;
            var attributes=segment.attributes;
            var geometry=attributes.geometry.components;
            var line=getId(segment.geometry.id);
            if (segment===null || line === null || segment.state === "Update") continue;
            //Name
            var sid=attributes.primaryStreetID;
            var street=CErrorsModel.streets.getObjectById(sid);
            if (street===null) continue;
            //Alt Name
            var salt=attributes.streetIDs[0];
            var streetalt=CErrorsModel.streets.getObjectById(salt);
            if (streetalt) { var altname=streetalt.name; } else { var altname=""; }
            //City
            var streetCity = CErrorsModel.cities.getObjectById(street.cityID);
            if (streetCity===null) continue;
            streetCity = streetCity.attributes.name;

            var roadType=attributes.roadType;
            if (attributes.primaryStreetID === null || attributes.primaryStreetID === undefined) continue;
            if (CErrorsModel.streets.getObjectById(attributes.primaryStreetID) === null || CErrorsModel.streets.getObjectById(attributes.primaryStreetID) === undefined) continue;
            var newWidth="", newColor="", newOpacity="0", gline="";

            if ((ls.myLvl && attributes.rank <= myLevel) || ls.myLvl===false) {
                if (ls.seg_Ramp_city) { // Ramp/Freeway with city name
                    if (streetCity && /^(3|4)$/.test(attributes.roadType)) {
                        newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                        j++;
                        addIcon("\uf015",newColor,geometry,"segment",j);
                        addLegend(attributes.id,"\uf015",newColor,CErrSeg[11]);
                    }
                }
                if (street.name || altname) {
                    if (/( - )/.test(street.name)) { var trs=street.name.split(" - "); }
                    if (ls.seg_Priv) { // Private with bad name
                        if (attributes.roadType===17 && new RegExp(streetNameSeg).test(street.name)===false) {
                            newColor="#ff7700"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf256",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf256",newColor,CErrSeg[2]);
                        }
                    }
                    if (ls.seg_Park && street.name) { // Parking with name (But Place / Square)
                        if (attributes.roadType===20 && new RegExp(parkNameSeg).test(street.name)===false) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf288",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf288",newColor,CErrSeg[3]);
                        }
                    }
                    if (ls.seg_Rail && street.name) { // Railroad with bad name
                        if (attributes.roadType===18 && (altname || street.name)) { //Railroad with name
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf238",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf238",newColor,CErrSeg[4]);
                        }
                    }
                    if (ls.seg_Ramp_name && street.name) {
                        if (/^(3|4)$/.test(attributes.roadType) && /\/.*\//.test(street.name)) { // Ramp with 3 directions or more
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf25b",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf25b",newColor,CErrSeg[6]);
                        }
                        else if (/^(3|4)$/.test(attributes.roadType) && /\//.test(street.name)) {  // Ramp with 2 directions
                            newColor="#ff7700"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf25a",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf25a",newColor,CErrSeg[6]);
                        }
                    }
                    if (ls.seg_Dir_name && street.name) { // Directions but not Ramp/Freeway/Major
                        if (/^[^3|4|6]$/.test(attributes.roadType) && /[:|>]/.test(street.name)) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf0a9",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf0a9",newColor,CErrSeg[7]);
                        }
                    }
                    if (ls.seg_Toll) { // Toll but not Ramp/Freeway
                        if (/^[^3|4]$/.test(attributes.roadType) && (attributes.fwdToll || attributes.revToll)) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf155",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf155",newColor,CErrSeg[10]);
                        }
                    }
                    if (ls.seg_RSAlt && street.name) { // RoadShield must be in alt
                        if (attributes.roadType!=19 && trs
                            && /^[A|C|D|N|M|R|T][0-9]+[a-z]?[0-9]?/.test(trs[0].replace(".",""))===true // Roadshield (1st part)
                            &&  / - /.test(street.name)===true // Roadshield & street name (separator -)
                            && /Intérieure|Extérieure/.test(trs[1])===false
                            && streetCity // City ok
                           ) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf074",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf074",newColor,CErrSeg[12]);
                        }
                    }
                    if (ls.seg_HW_name && street.name) { // Highways with bad name
                        if (/^(3|4|6)$/.test(attributes.roadType) && (/:/.test(street.name)===true && /^[A|C|D|N|M|R|T][0-9]+[a-z]?[0-9]?/.test(street.name)===false) && /^>/.test(street.name)===false && /^[Sortie ]+[0-9]+/.test(street.name)===false && /^(Rocade|Périphérique)/.test(street.name)===false) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf018",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf018",newColor,CErrSeg[5]);
                        }
                    }
                    if (ls.seg_SegBadRS && street.name) { // RoadShield but bad type
                        if (/^(1|8|17|20)$/.test(attributes.roadType) && (/^[A|D|N|M|R|T][0-9]+/.test(street.name) || /^[A|D|N|M|R|T]$/.test(street.name))) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf044",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf044",newColor,CErrSeg[14]);
                        }
                    }
                    if (ls.seg_HNFree) { // House number on Freeway or ramp (and some undrivables)
                        if (/^(3|4|8|14|18|19)$/.test(attributes.roadType) && attributes.hasHNs===true) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf162",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf162",newColor,CErrSeg[15]);
                        }
                    }
                    if (ls.seg_BadSpeed) { // Bad speed (ex: >70km/h in city)
                        if (attributes.fwdMaxSpeed>70 && attributes.fwdMaxSpeedUnverified===false && attributes.revMaxSpeed>70 && attributes.revMaxSpeedUnverified===false && streetCity) {
                            newColor="#ff7700"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf1ce",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf1ce",newColor,CErrSeg[16]);
                        }
                    }
                    if (ls.seg_RShield && street.name) { // Wrong prefix (RoadShield)
                        if ((trs && attributes.roadType!=19 && /^[A|D|N|M|R|T][0-9]+[a-z]?[0-9]?/.test(trs[0].replace(".",""))===false &&  / - /.test(street.name)===true)
                            || /^[A|D|N|M|R|T][0-9]+[a-z]?[0-9]? ?-[A-Za-z]/.test(street.name)===true || /^[A|D|N|M|R|T][0-9]+[a-z]?[0-9]?- ?[A-Za-z]/.test(street.name)===true// No space between RS and street name
                           ) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf152",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf152",newColor,CErrSeg[8]);
                        }
                    }
                    if (ls.seg_SNameAlt && street.name) { // Street Name must be in alt
                        if (attributes.roadType!=19 && trs
                            && /^[A|C|D|N|M|R|T][0-9]+[a-z]?[0-9]?/.test(trs[0].replace(".",""))===true // Roadshield (1st part)
                            && /^[E][0-9]/.test(trs[1])===false // European Roadshield (2nd part)
                            && new RegExp(excepNameSeg).test(street.name)===false // Exception
                            && / - /.test(street.name)===true // Roadshield & street name (separator -)
                            && /Intérieure|Extérieure/.test(trs[1])===false
                            && !streetCity // No city
                           ) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf079",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf079",newColor,CErrSeg[13]);
                        }
                    }
                    if (ls.seg_DleSpace && street.name) { // Double spacing in name
                        if (/  /.test(street.name)===true) {
                            newColor="#ff0000"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf101",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf101",newColor,CErrSeg[9]);
                        }
                    }
                    if (ls.seg_BadAltState) {
                        if (streetalt != null && CErrorsModel.cities.getObjectById(street.cityID).attributes.stateID != CErrorsModel.cities.getObjectById(streetalt.cityID).attributes.stateID) { // Alt State != Main State
                            newColor="#ff7700"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                            j++;
                            addIcon("\uf037",newColor,geometry,"segment",j);
                            addLegend(attributes.id,"\uf037",newColor,CErrSeg[17]+"<br>Est <b><i>"+CErrorsModel.states.getObjectById(CErrorsModel.cities.getObjectById(streetalt.cityID).attributes.stateID).name+"</i></b><br>Devrait être <b><i>"+CErrorsModel.states.getObjectById(CErrorsModel.cities.getObjectById(street.cityID).attributes.stateID).name)+"</i></b>";
                        }
                    }
                }
                if (ls.seg_LockValue) {
                    if (
                        ((attributes.fwdFlags==1 || attributes.revFlags==1) && attributes.lockRank != 4) || // Speedcam but not locked 5
                        attributes.fwdFlags==0 && attributes.revFlags==0 && // no speedcam
                        (/^(3|4|6|18)$/.test(attributes.roadType) && attributes.lockRank != 4 //Lock 5 for freeway, ramp, major and railroad
                         || attributes.roadType==7 && attributes.lockRank != 3 //Lock 4 for minor
                         || attributes.roadType==2 && attributes.lockRank != 2 //Lock 3 for primary
                         || /^(1|8|17|19|22)$/.test(attributes.roadType) === true && attributes.lockRank != 0 && attributes.lockRank != null) //Lock 1 for others (5,10,15,16,20)
                    ) {
                        newColor="#ff7700"; newWidth=3; newOpacity=0.95; gline=segment.attributes.geometry.getVertices();
                        j++;
                        addIcon("\uf023",newColor,geometry,"segment",j);
                        addLegend(attributes.id,"\uf023",newColor,CErrSeg[18]);
                    }
                }
                // Highlight if error
                if (gline !== "") {
                    var style={
                        strokeWidth: newWidth,
                        strokeColor: newColor,
                        strokeOpacity: newOpacity
                    };
                    var points=[];
                    for (var i=0; i<gline.length; i++) { points.push(new CErrorsOpenLayers.Geometry.Point(gline[i].x, gline[i].y)); }
                    var newline=new CErrorsOpenLayers.Geometry.LineString(points);
                    lineFeature.push(new CErrorsOpenLayers.Feature.Vector(newline, null, style));
                }
            }
        }
    }

    //Places Checking
    if (ls.poi_Bad && getId('layer-switcher-group_places').checked) {
        for (var poi in CErrorsModel.venues.objects) {
            // Get values
            var venue=CErrorsModel.venues.getObjectById(poi), j=0;
            var pattributes=venue.attributes;
            var geometry=pattributes.geometry.bounds;
            var poly=pattributes.id;
            if (venue===null || poly === null || poi.state=="Update" || poi.selected) continue;
            var categories=pattributes.categories;
            var pname=pattributes.name;
            var venueStreet=CErrorsModel.streets.getObjectById(pattributes.streetID);
            if (venueStreet) { var venueCity = CErrorsModel.cities.getObjectById(venueStreet.cityID); }
            var newWidth="", newColor="", newOpacity="0", gpoly="";

            if ((ls.myLvl && pattributes.rank <= myLevel && pattributes.adLocked===false) || ls.myLvl===false) {
                if (ls.poi_Resid) { // maybe a residential POI
                    if ((/^[0-9][ ]?[a-zA-Z]/.test(pname)===true || new RegExp(privNameSeg).test(pname)===true) && pattributes.residential===false && pattributes.categories.indexOf("PARKING_LOT")===-1) {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf015",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf015",newColor,CErrPoi[7]);
                    }
                }
                if (ls.poi_Google) { //POI without Google link
                    if (pattributes.externalProviderIDs.length===0 && pattributes.residential===false && new RegExp(excepCatPoi).test(categories)===false) {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf1a0",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf1a0",newColor,CErrPoi[8]);
                    }
                }
                if (ls.poi_Phone && pattributes.phone) { //POI with bad phone number
                    if (new RegExp('^(\\'+prefPhone + ')([ ](\\d{2})){3}$').test(pattributes.phone)===false // Prefix + 4 digits
                        && (/^[13]\d[ ](\d{2})$/).test(pattributes.phone)===false // 1x xx or 3x xx
                        && (/^(0[ ]8\d{2})([ ](\d{3})){2}/).test(pattributes.phone)===false // 0 8xx xxx xxx
                        && (/^(0[ ]8\d{2})([ ](\d{2})){3}/).test(pattributes.phone)===false // 0 8xx xx xx xx
                        && (/^(15|17|18|112)$/).test(pattributes.phone)===false // Emergency numbers
                       ) {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf095",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf095",newColor,CErrPoi[13]);
                    }
                }
                if (ls.poi_Other) { // Place type is "Other"
                    if (categories.indexOf("OTHER") > -1 && (/^Déchèterie/).test(pname)===false) {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf29c",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf29c",newColor,CErrPoi[10]);
                    }
                }
                if (ls.poi_Entry) { // POI with default entryExitPoints
                    if (new RegExp(entryPointPoi).test(categories)===false && pattributes.entryExitPoints.length===0 && venue.isPoint()===false) {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf18e",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf18e",newColor,CErrPoi[4]);
                    }
                }
                if (ls.poi_Park_name && categories.indexOf("PARKING_LOT") > -1) { // Parking with bad name
                    if (new RegExp(streetNameSeg).test(pname)===true) { continue; } //If parking name is a road
                    if (new RegExp('^'+parkNamePoi+'$').test(pname)===true || // Only Parkings or Aire // ?️|?️️|
                        new RegExp('^'+parkNamePoi).test(pname)===false // Don't start by ?️ or Parking
                        // /^(Parking[s]?)( de[s]?| du | le[s]? | la | pour )/.test(pname)===true // Contain bad words
                       ) {
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf288",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf288",newColor,CErrPoi[2]);
                    }
                    else if (pname==="") {
                        newColor="#ff7700"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf288",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf288",newColor,CErrPoi[2]);
                    }
                    if (venue.isPoint()) newWidth=26;
                }
                if (ls.poi_Park_type && categories.indexOf("PARKING_LOT") > -1) { // Parking with type undefined
                    if (/PUBLIC|RESTRICTED|PRIVATE/.test(pattributes.categoryAttributes.PARKING_LOT.parkingType)===false) {
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf11d",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf11d",newColor,CErrPoi[12]);
                    }
                }
                if (ls.poi_Address) { // POI with bad address (Nxxx/Dxxx) or without address
                    if (venueStreet===null) continue;
                    if ((/^[A|D|N|M|R][0-9]+/.test(venueStreet.name) && /[ - ]/.test(venueStreet.name)) || (venueStreet.name===null && new RegExp(landmarkPoi).test(categories) === 'false')) {
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf2bc",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf2bc",newColor,CErrPoi[3]);
                    }
                }
                if (ls.poi_LandM) { // Landmark with road name or city name
                    if (new RegExp(landmarkPoi).test(categories) && pname==="" && ((venueStreet && venueStreet.name) || (venueCity && venueCity.attributes.name))) {
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        if (venue.isPoint()) { newWidth=26; }
                        j++;
                        addIcon("\uf1bb",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf1bb",newColor,CErrPoi[5]);
                    }
                }
                if (ls.poi_DleSpace) { // Double spacing in name
                    if (venueStreet && (/  /.test(venueStreet.name)===true || /  /.test(pname)===true)) {
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf101",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf101",newColor,CErrPoi[6]);
                        if (venue.isPoint()) { newWidth=26; }
                    }
                }
                if (ls.poi_GasSta && categories.indexOf("GAS_STATION") > -1) { // Gas Station with bad name
                    if (new RegExp(streetNameSeg).test(pname)===true) { continue; } //If parking name is a road
                    if (/^(Station-service )/.test(pname)===false) { // Don't start by
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf1b9",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf288",newColor,CErrPoi[16]);
                        if (venue.isPoint()) newWidth=26;
                    }
                }
                if (ls.poi_Transp && new RegExp(stationsPoi).test(categories)===false) { //Bus Subway and Tram Station wihtout others stations
                    if ((
                        categories.indexOf("BUS_STATION") > -1 && // Good category for bus station
                        new RegExp('^'+busPoi).test(pname)===false // Bad name
                    ) || (
                        categories.indexOf("SUBWAY_STATION") > -1 && // Good category for subway station
                        new RegExp('^'+tramPoi).test(pname)===false // Bad name
                    ) || (
                        categories.indexOf("TRAIN_STATION") > -1 && // Good category for train station
                        /Gare d[e|u|es|\']/.test(pname)===false // Bad name
                    ) || (
                        categories.indexOf("OTHER") == -1 && categories.indexOf("BUS_STATION") == -1 && categories.indexOf("SUBWAY_STATION") == -1 && categories.indexOf("TRAIN_STATION") == -1 &&
                        new RegExp('^'+possibleTransPoi).test(pname)===true // Maybe a transport station
                    ) ){
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf207",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf207",newColor,CErrPoi[15]);
                        if (venue.isPoint()) { newWidth=26; }
                    }
                }
                if (ls.poi_Relig && categories.indexOf("RELIGIOUS_CENTER") > -1) { // Religious Center with bad name
                    if (new RegExp('^'+religiousPoi+'$').test(pname)===true || // category without name
                        new RegExp('^'+religiousPoi).test(pname)===false) { // Bad 1st name
                        newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                        j++;
                        addIcon("\uf015",newColor,geometry,"venue",j);
                        addLegend(poly,"\uf015",newColor,CErrPoi[14]);
                        if (venue.isPoint()) { newWidth=26; }
                    }
                }
                if ((ls.poi_Relig && new RegExp('^'+religiousPoi).test(pname)===true && categories.indexOf("RELIGIOUS_CENTER") == -1) || // Religious Center Name but bad category
                    (new RegExp('^'+religiousPoi+'$').test(pname)===true && categories.indexOf("RELIGIOUS_CENTER") == -1)) { // Bad Religious Center Name with bad category
                    newColor="#ff0000"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                    j++;
                    addIcon("\uf015",newColor,geometry,"venue",j);
                    addLegend(poly,"\uf015",newColor,CErrPoi[14]);
                    if (venue.isPoint()) { newWidth=26; }
                }
                if (ls.poi_WFeed || ls.poi_WPark) { //Place updated by WazeFeed
                    if (pattributes.updatedBy && CErrorsModel.users.getObjectById(pattributes.updatedBy)) {
                        var updName = CErrorsModel.users.getObjectById(pattributes.updatedBy).userName;
                        if (((ls.poi_WFeed && new RegExp(wazeBot).test(updName)) || (ls.poi_WPark && updName=="WazeParking1")) && pattributes.residential===false) {
                            newColor="#ffcc00"; newWidth=15; newOpacity=0.5; gpoly=pattributes.geometry.getVertices();
                            if (venue.isPoint()) { newWidth=26; newOpacity=0.75; }
                            j++;
                            addIcon("\uf263",newColor,geometry,"venue",j);
                            if (updName=="WazeFeed") { addLegend(poly,"\uf263",newColor,CErrPoi[9]); }
                            else { addLegend(poly,"\uf263",newColor,CErrPoi[11]); }
                        }
                    }
                }
                // Highlight if error

            }
            if (pattributes.adLocked) {
                newColor="#ff0000"; newWidth=15; newOpacity=0.75; gpoly=pattributes.geometry.getVertices();
                j++;
                addIcon("\uf023",newColor,geometry,"venue",j);
                addLegend(poly,"\uf023",newColor,CErrLeg[7]);
                if (venue.isPoint()) { newWidth=26; }
            }
            if (gpoly!=="") {
                var style={
                    strokeWidth: newWidth,
                    strokeColor: newColor,
                    strokeOpacity: newOpacity,
                    fillOpacity: 0
                };
                var points=[];
                for (var i=0; i<gpoly.length; i++) { points.push(new CErrorsOpenLayers.Geometry.Point(gpoly[i].x, gpoly[i].y)); }
                var newpoly=new CErrorsOpenLayers.Geometry.LinearRing(points);
                lineFeature.push(new CErrorsOpenLayers.Feature.Vector(newpoly, null, style));
            }
        }
    }

    // Display highlighted features
    try{ ColorErrors_mapLayer.addFeatures(lineFeature); }
    catch(err){ log('err addFeatures: ',err); }
}
// *************************
// **  Telephone fix FR   **
// *************************
function fixTel(){
    var editpanel = $('#edit-panel');
    if (editpanel.length==0) { window.setTimeout(fixTel, 1000); return; }

    $('#edit-panel').bind('DOMSubtreeModified',function(e){
        var editLM = $('#landmark-edit-more-info');
        //console.debug("PHONE: editLM" , editLM);
        if (editLM.length==1) {
            var fixPhoneBtn = $('#wme-telephonefix-fr'); //console.debug("PHONE: fixPhoneBtn" , fixPhoneBtn);
            if (fixPhoneBtn.length==0)
            {
                fixPhoneBtn=document.createElement('button');
                fixPhoneBtn.innerHTML='fix';
                fixPhoneBtn.id='wme-telephonefix-fr';
                $(fixPhoneBtn).css({'float':'right','position':'absolute','right':'0px','bottom':'0px','height':'27px','background-color':'white','border-top-right-radius':'6px','border-bottom-right-radius':'6px','border':'1px solid #cccccc','border-left':'1px dashed #cccccc'});
                $('[name=phone]').parent().append(fixPhoneBtn);

                try {
                    var venue=Waze.selectionManager.getSelectedFeatures()[0].model;
                    var phone=venue.attributes.phone;
                    var newPhone='';
                    var phoneTo='';
                    phoneTo = venue.attributes.phone.replace(/^0([0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])$/g, "+33 $1 $2 $3 $4 $5");
                    if (phoneTo!=venue.attributes.phone && phoneTo.startsWith('+33 8')==false)
                        newPhone=phoneTo;
                    phoneTo = venue.attributes.phone.replace(/^\+33[ ]*(?:\(?0\)?)?([0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])$/g, "+33 $1 $2 $3 $4 $5");
                    if (phoneTo!=venue.attributes.phone && phoneTo.startsWith('+33 8')==false)
                        newPhone=phoneTo;
                    phoneTo = venue.attributes.phone.replace(/^0[.| |-]?8[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])$/g, "0 8$1$2 $3$4$5 $6$7$8");
                    if (phoneTo!=venue.attributes.phone)
                        newPhone=phoneTo;
                    phoneTo = venue.attributes.phone.replace(/^\+33[ ]*(?:\(?0\)?)?8[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])$/g, "0 8$1$2 $3$4$5 $6$7$8");
                    if (phoneTo!=venue.attributes.phone)
                        newPhone=phoneTo;

                    if (newPhone!='')
                    {
                        fixPhoneBtn.addEventListener("click", function (v, p) {
                            return function () {
                                var newAtts = { phone: p, id: v.attributes.id };
                                Waze.model.actionManager.add(new (require("Waze/Action/UpdateObject"))(v, newAtts));
                                $(fixPhoneBtn).css({'display': 'none'});
                            }
                        }(venue, newPhone), false);
                    }
                    else
                        $(fixPhoneBtn).css({'display': 'none'});
                }
                catch (err)
                {
                    $(fixPhoneBtn).css({'display': 'none'});
                }
                //.debug("PHONE: append fixPhoneBtn" , fixPhoneBtn);
            }
        }

    })
}

CErrors_bootstrap();
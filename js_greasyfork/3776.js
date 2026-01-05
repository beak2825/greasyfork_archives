// ==UserScript==
// @name WME Check Road Name
// @author buchet37
// @description This script make a Check for Roads naming
// @namespace https://greasyfork.org/fr/scripts/3776-wme-check-road-name
// @match     https://world.waze.com/editor/*
// @match     https://*.waze.com/editor*
// @match     https://*.waze.com/*/editor/*
// @match     https://*.waze.com/*/editor*
// @match     https://world.waze.com/map-editor/*
// @match     https://world.waze.com/beta_editor*
// @match     https://www.waze.com/map-editor*
// @connect   https://docs.google.com/spreadsheets/d/
// @connect   *
// @sandbox   javascript
// @grant     GM_xmlhttpRequest
// @exclude   https://www.waze.com/*user/editor/*
// @version   4.7.6
// @downloadURL https://update.greasyfork.org/scripts/3776/WME%20Check%20Road%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/3776/WME%20Check%20Road%20Name.meta.js
// ==/UserScript==

// Remerciements Myriades, seb-d59,DummyD2, Yopinet et tous les testeurs pour WME UR responses types

/* global require */
/* global $ */
/* global OpenLayers */
/* global W */
/* global I18n */

var WME_CRN_version = "4.7.6";
var WME_CRN_country;
var WME_CRN_Dictionary = [];
var WME_CRN_MainCountry = "";

function waitForCountryTop () {
    var myWaze = unsafeWindow.W;
    if (myWaze && myWaze.model && myWaze.model.countries && myWaze.model.getTopCountry() && myWaze.model.getTopCountry().attributes) {
        var myCountryName = myWaze.model.getTopCountry().attributes.name; //alert ("On a recu le pays : " + myCountryname);
        var myCountryId = myWaze.model.getTopCountry().attributes.id; //alert ("On a recu le pays : " + myCountryname);

        var country = [];
        country[21] ={OTAN:' BEL ',main:'1mZF8KKMtJX1zYRoRNgweWfaczI9W6Nf9PDyKQkCB0ak',publiq:'1_Bx083h2mYD2Q4LlWO1JbAVc3uCKLZYVkDIwH4BqvvA',name:'Belgium'};
        country[30] ={OTAN:' BRA ',main:'1MzMS2LThf8J_pwg_wfpNPoDbzU1H7WR1KbnuK2xcuUA',publiq:'1YM4yql0SVLJMkMqorVY52Qo9z49dE7qUvYKeH2APeVo',name:'Brazil'};
        country[73] ={OTAN:' FRA ',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'France'};
        country[74] ={OTAN:'FR-FG',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Guyane Française'};
        country[75] ={OTAN:'FR-PF',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Polynésie Française'};
        country[88] ={OTAN:'FR-GP',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Guadeloupe'};
        country[141]={OTAN:'FR-MB',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Martinique',};
        country[144]={OTAN:'FR-MA',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Mayotte'};
        country[148]={OTAN:' MCO ',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Monaco',};
        country[152]={OTAN:' MAR ',main:'1IAoaPWK2OwpVLFSvdNrJDa5SfQCmiI4u4BJ8UeobxFs',publiq:'1Y087xlOI-e_lUMZFnSTdRWvSLnQ_Bh3FZ8rKSVUs3aY',name:'Maroc'};
        country[184]={OTAN:'FR-RE',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Réunion'};
        country[209]={OTAN:'FR-PM',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Saint-Pierre et Miquelon'};
        country[243]={OTAN:'FR-WF',main:'1fZNOmDQSYgAam6Lj3z9YpNFu0-Sb6AjAyFdy_dH-roA',publiq:'1T-UVFQtp5OrKqMZPRsfRBMohIAwdgNoWQcA6Ry4UEgA',name:'Wallis et Futuna'};
        country[203]={OTAN:' ESP ',main:'1dR-DH0h-Ax_PP2buhrRj3qVdrqOOQ0HY-MZf4RfcBcI',publiq:'1lG7YjteuYpBvMzedHs4GcgtqjJuIaR3gKYhSlLZkO-E',name:'Spain'};

        var french_country = [73,74,75,88,141,144,148,184,209,243];

        if (country[myCountryId]) {
            unsafeWindow.mainDictionnaryKey = country[myCountryId].main;
            unsafeWindow.publicDictionnarykey = country[myCountryId].publiq;
            WME_CRN_country = country[myCountryId];
            WME_CRN_country.frenchCountry = french_country;}
        else {
            alert ("WME Check Road Name Alert\n\nNo dictionnary for "+ myCountryName);
            unsafeWindow.WME_CRN_onload = "Error";
            delete WME_CRN_1_mainDictionaryTxt;
            delete WME_CRN_1_publicDictionaryTxt;
        }

        GM_xmlhttpRequest({ //alert ("On démarre le chargement");
            method:  'GET',
            url:   'https://docs.google.com/spreadsheets/d/' + unsafeWindow.mainDictionnaryKey +'/export?format=csv', // dictionaire principal
            headers: {"User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                      "Accept": "text/plain"}, // If not specified, browser defaults will be used.
            synchronous: false,
            onload: function (mainDictionary) {
                unsafeWindow.WME_CRN_1_mainDictionaryTxt = mainDictionary.responseText;
            }
        });

        GM_xmlhttpRequest({
            method:  'GET',
            url: 'https://docs.google.com/spreadsheets/d/' + unsafeWindow.publicDictionnarykey +'/export?format=csv', // dictionaire public
            headers: {"User-Agent": "Mozilla/5.0",
                      "Accept": "text/plain"},
            synchronous: false,
            onload: function (publicDictionary) {
                unsafeWindow.WME_CRN_1_publicDictionaryTxt = publicDictionary.responseText;
            }
        });
        return myCountryId ;
    }
    else {
        setTimeout (function () {waitForCountryTop();}, 1000); //alert ("On attend le pays");
    }
}

if ('undefined' == typeof WME_CRN_onload) { // le script n'est a pas encore chargé
    unsafeWindow.WME_CRN_onload = "In Progress";
    unsafeWindow.WME_CRN_1_mainDictionaryTxt = "In Progress";
    unsafeWindow.WME_CRN_1_publicDictionaryTxt = "In Progress";
    var mainDictionnaryURL = '' ;
    var publicDictionnaryURL = '' ;
    waitForCountryTop();
}

// *************
// **  INIT   **
// *************
function CRN_bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow = (function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    /* begin running the code! */
    //    log("starting");
    Check_Road_Name();
}

function Check_Road_Name() {
    if ('undefined' != typeof require && W && W.map && W.model) {
        start_Road_Name(); }
    else {
        setTimeout(Check_Road_Name , 1000); }
}

function start_Road_Name() {
    WME_CRN_Dictionary = []; // déclaration Hors "loadFiles" pour compatibilité Chrome
    WME_CRN_MainCountry = "";

    // *****************   COMPATIBILITY WITH NEW EDITOR     ***********
    //var WazeActionCreateObject = require("Waze/Action/CreateObject");
    //  var WazeActionAddOrGetCity         = require("Waze/Action/AddOrGetCity");
    //  var WazeActionAddOrGetStreet       = require("Waze/Action/AddOrGetStreet");
    var WazeActionMultiAction          = require("Waze/Action/MultiAction");
    var WazeActionUpdateObject         = require("Waze/Action/UpdateObject");
    var WazeActionAddAlternateStreet   = require("Waze/Action/AddAlternateStreet");
    var WazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
    //var WazeModelObjectType    = require("Waze/Model/ObjectType");
    // *****************************************************************

    loadFiles ();
    function loadFiles () {                  // Passage en variable locales
        if (WME_CRN_1_mainDictionaryTxt != "In Progress" && WME_CRN_1_publicDictionaryTxt != "In Progress") {
            traiteDictionary(WME_CRN_1_mainDictionaryTxt,1);                          // main directory line 1 +
            traiteDictionary(WME_CRN_1_publicDictionaryTxt,2001);                     // public directory line 2001 +
            delete WME_CRN_1_mainDictionaryTxt; delete WME_CRN_1_publicDictionaryTxt; // supprime les variables d'import de fichiers
            WME_CRN_onload = "Done";
            WME_CRN_MainCountry = W.model.getTopCountry().attributes.id;
            insertButton();
        }
        else {
            setTimeout (function () {loadFiles();}, 1000);
        }
    }

    function traiteDictionary(texte,N_ligne) {
        var generic = texte.replace (/\t\t/g,"\t"); // supprime les doubles tabulation
        generic = generic.replace (/\r/g,"\n"); // remplace /r par /n
        generic = generic.replace (/\n\n\n/g,"\n"); // supprime triplon CR
        generic = generic.replace (/\n\n/g,"\n"); // supprime doublon CR

        var lignes = generic.split(/\n/); // split

        var error = [];

        for(var i = 0; i < lignes.length; i++) {
            //alert (lignes[i]);
            if (lignes[i].search('"') === 0) {                                  // elimine les guillemets involontaires de l'import
                lignes[i] = lignes[i].replace (/^"/,'');
                lignes[i] = lignes[i].replace (/",/,',');
            }
            //alert (lignes[i]+' ' +lignes[i].search('//'));
            if (lignes[i].search('/')  !== 0) {continue;}                       // si la ligne ne commence pas par / , on saute
            if (lignes[i].search('//') === 0) {continue;}                       // si la ligne commence par // , on saute
            //alert( lignes[i]);
            var pos = lignes[i].search("//");
            if (pos != -1) {lignes[i] = lignes[i].substring(0,pos-1);}
            lignes[i] = lignes[i].replace (/"""/g,'"');                         // Traitement des guillemets suite au CSV
            lignes[i] = lignes[i].replace (/""/g,'"');                          // Traitement des guillemets suite au CSV
            //lignes[i] = lignes[i].replace (/^"/g,'');
            var inter1 = lignes[i].split(/,/);                                  // Split with comma Char
            if (inter1.length <2) {continue;}                                   // jump over if incorrect syntax
            if (inter1[0].substring(0,1) !="/") {inter1[0] = "/"+inter1[0]+"/";}//transform simple texte in regexp
            //inter1[1]="("+inter1[1].replace (/[ ]*$/g,"")+")";
            inter1[1]=inter1[1].replace (/[ ]*$/g,"");
            var toverified = inter1[0].substring(1,inter1[0].lastIndexOf("/")); // extrait la partie entre / pour egexp
            var flag = inter1[0].substring(inter1[0].lastIndexOf("/")+1);       // extrait le flag
            var correct = inter1[1].replace (/@/g,",");                         // replace à by comma
            if (correct == "()") {correct ='("")';}                            // interprete une chaine vide
            // WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified.replace (/@/g,",") , flags: flag.replace (/"/g,""), corrected : correct, fct : eval(correct)});

            toverified = toverified.replace (/@/g,",");
            flag = flag.replace (/"/g,"")
            if (correct[0]=='"') { // c'est du texte
                correct = correct.slice (1,correct.length-1);
                WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : correct});
            }
            if (correct.slice(0,8)== 'function') { // c'est une function
                switch (correct) {
                    case 'function(a) {return(a.toUpperCase());}': WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aToUpperCase}); break;
                    case 'function(a) {return(a.toLowerCase());}': WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aToLowercase}); break;
                    case 'function(a,x,y) {return(x+y.toUpperCase());}': WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: axyToUpperCase}); break;
                    case 'function(a,x,y) {return(x+y.toLowerCase());}': WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: axyToLowercase}); break;
                    case 'function(a,x,y) {return(x.toUpperCase()+y.toLowerCase());}': WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: axToUpperCaseyToLowercase}); break;
                    case "function(a) {return(a.split(/[eéèëê]/i).join('e'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplite}); break;
                    case "function(a) {return(a.split(/[eéèëê]/i).join('é'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSpliteaigu}); break;
                    case "function(a) {return(a.split(/[eéèëê]/i).join('è'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplitegrave}); break;
                    case "function(a) {return(a.split(/[eéèëê]/i).join('ë'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplitetrema}); break;
                    case "function(a) {return(a.split(/[eéèëê]/i).join('ê'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplitecirc}); break;
                    case "function(a) {return(a.split(/[oöô]/i).join('o'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplito}); break;
                    case "function(a) {return(a.split(/[oöô]/i).join('ö'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplitotrema}); break;
                    case "function(a) {return(a.split(/[oöô]/i).join('ô'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplitocirc}); break;

                    case "function(a) {return(a.split(/[iïî]/i).join('i'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSpliti}); break;
                    case "function(a) {return(a.split(/[iïî]/i).join('ï'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSplititrema}); break;
                    case "function(a) {return(a.split(/[iïî]/i).join('î'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct: aSpliticirc}); break;

                    case "function(a) {return(a.split(/[uüûù]/).join('u'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitu}); break;
                    case "function(a) {return(a.split(/[uüûù]/i).join('ü'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitutrema}); break;
                    case "function(a) {return(a.split(/[uüûù]/i).join('û'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitucirc}); break;
                    case "function(a) {return(a.split(/[uüûù]/i).join('ù'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitugrave}); break;
                    case "function(a) {return(a.split(/[aàä]/).join('â'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitacirc}); break;
                    case "function(a) {return(a.split(/[aàä]/).join('à'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitagrave}); break;
                    case "function(a) {return(a.split(/c/i).join('ç'));}": WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified, flags: flag, fct : aSplitcced}); break;

                    default:
                        console.log('Function non comprise en ligne :'+i+N_ligne+ "---"+correct);
                        error.push(correct);
                }

            }

            // WME_CRN_Dictionary.push({line :i+N_ligne, toVerify: toverified.replace (/@/g,",") , flags: flag.replace (/"/g,""), corrected : correct, fct : eval(correct)});

        }
    }

    function aToUpperCase(a) {return (a.toUpperCase());}
    function aToLowercase(a) {return (a.toLowerCase());}
    function axyToUpperCase(a,x,y) {return (x+y.toUpperCase());}
    function axyToLowercase(a,x,y) {return (x+y.toLowerCase());}
    function axToUpperCaseyToLowercase(a,x,y) {return (x.toUpperCase()+y.toLowerCase());}
    function aSplite(a) {return(a.split(/[éeèëê]/i).join('e'));}
    function aSpliteaigu(a) {return(a.split(/[éeèëê]/i).join('é'));}
    function aSplitegrave(a) {return(a.split(/[éeèëê]/i).join('è'));}
    function aSplitetrema(a) {return(a.split(/[éeèëê]/i).join('ë'));}
    function aSplitecirc(a) {return(a.split(/[éeèëê]/i).join('ê'));}
    function aSplito(a) {return(a.split(/[oöô]/i).join('o'));}
    function aSplitotrema(a) {return(a.split(/[oöô]/i).join('ö'));}
    function aSplitocirc(a) {return(a.split(/[oöô]/i).join('ô'));}
    function aSpliti(a) {return(a.split(/[iïî]/i).join('i'));}
    function aSplititrema(a) {return(a.split(/[iïî]/i).join('ï'));}
    function aSpliticirc(a) {return(a.split(/[iïî]/i).join('î'));}
    function aSplitu(a) {return(a.split(/[uüûù]/i).join('u'));}
    function aSplitutrema(a) {return(a.split(/[uüûù]/i).join('ü'));}
    function aSplitucirc(a) {return(a.split(/[uüûù]/i).join('û'));}
    function aSplitugrave(a) {return(a.split(/[uüûù]/i).join('ù'));}
    function aSplitacirc(a) {return(a.split(/[aàä]/).join('â'));}
    function aSplitagrave(a) {return(a.split(/[aàä]/).join('à'));}
    function aSplitcced(a) {return(a.split(/c/i).join('ç'));}

    function insertButton() {
        if(document.getElementById('sidepanel-CRN') === null) {
            // **** Création structure nouvel onglet
            var cntEnt = document.createElement('section');
            cntEnt.id = "WME_CRN_link"; cntEnt.style = "padding-top:2px; margin:2px; display:block;";
            cntEnt.innerHTML = '<label style="font-weight:normal"> <input type="checkbox" style="vertical-align: middle;margin: 0px" id="WME_CRN_enable" title="Enable or Disable WME CRN"> On-Off&emsp;</input></label>';
            cntEnt.innerHTML +='<div style="font-size:12px; display: inline"><a href="https://greasyfork.org/scripts/3776-wme-check-road-name" target="_blank"> Check Road Name ' + WME_CRN_version+ '</a></div>';
            cntEnt.innerHTML +='<div style="float:right; font-size:12px; padding:0 7px 0 3px; border-width:1px; border-color: SkyBlue; border-style:solid; border-radius:6px;" id = "WME_CRN_Dictionary" title="Go to dictionary" ><a href="https://docs.google.com/spreadsheets/d/'+publicDictionnarykey+'/edit#gid=0" target="_blank">'+WME_CRN_country.OTAN+'</a></div>'
            var cntRename = document.createElement('section');
            cntRename.id = "WME_CRN_rename"; cntRename.style = "padding-top:2px; margin:2px;display:block;";
            cntRename.innerHTML = '<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px;" id = "WME_CRN_chk" title="Click this button to Check Road Names">Check Address</button>';
            cntRename.innerHTML +='<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px;" id = "WME_CRN_stop" title="Click this button to stop">Check Stop</button>';
            cntRename.innerHTML +='<label style="font-weight:normal;height:20px;margin:0px 5px 0px 0px"> <input type="checkbox"; style="vertical-align: middle;margin: 0px;" id="WME_CRN_CheckRoadName" title="Click for automatic check of road name (and landmark if layer On)"> Auto </input></label>';
            cntRename.innerHTML +='<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin-right:5px;" id = "WME_CRN_raz" title="Click this button to Clear stored roads">Raz</button>';

            cntRename.innerHTML += '<label style="font-weight:normal;height:20px;margin:10px 5px 0px 0px;padding-left:15px;display:block"> <input type="checkbox" style="vertical-align: middle;margin: 0px;" id="WME_CRN_TestRoadName"> Check Road Name</input></label>';
            cntRename.innerHTML += '<label style="font-weight:normal;height:20px;margin: 0px 5px 0px 0px;padding-left:15px;display:block"> <input type="checkbox" style="vertical-align: middle;margin: 0px;" id="WME_CRN_TestAlternateRoadName"> Check Alternate Road Name</input></label>';
            cntRename.innerHTML += '<label style="font-weight:normal;height:20px;margin: 0px 5px 0px 0px;padding-left:15px;display:block"> <input type="checkbox" style="vertical-align: middle;margin: 0px;" id="WME_CRN_TestPOIName"> Check POI Name</input></label>';
            cntRename.innerHTML += '<label style="font-weight:normal;height:20px;margin: 0px 5px 0px 0px;padding-left:15px;display:none"> <input type="checkbox" style="vertical-align: middle;margin: 0px;" id="WME_CRN_TestAlternatePOIName"> Check Alternate POI Name</input></label>';

            var cntStrID = document.createElement('section');
            cntStrID.id = "WME_CRN_StrID_title"; cntStrID.style = "padding-top:5px; margin:2px;margin-top:5px;border-top:1px solid skyblue;";
            //            cntStrID.innerHTML = '<label style="font-weight:normal"> <input type="checkbox" style="vertical-align: middle; margin: 0px; " id="WME_CRN_StreetID" title="Show Street Attributes" > Street ID </input></label>';
            cntStrID.innerHTML = '<button class="waze-btn waze-btn-small waze-btn-white" id="WME_CRN_StreetID" style="display:block; padding:0px 6px; height:20px; margin: 2px 10%;width: 80%" title="Show Street Attributes" > Street ID </button>'
            var cntChgAlt1 = document.createElement('section');
            cntChgAlt1.id = "WME_CRN_ShowChangeToAltern"; cntChgAlt1.style = "padding-top:5px; margin:2px;margin-top:5px;border-top:1px solid skyblue;";
            cntChgAlt1.innerHTML = '<button class="waze-btn waze-btn-small waze-btn-white" id="WME_CRN_ChangeToAltern1" style="display:block; padding:0px 6px; height:20px; margin: 2px 10%;width: 80%" title="Click this button to change to alternate name">Change to Altern. Name (CRN)</button>'
            //            cntChgAlt1.innerHTML = '<label style="font-weight:normal"> <input type="checkbox" style="vertical-align: middle; margin: 0px; " id="WME_CRN_ShowChangeAlt" title="Show the Change Alternate button in segment editor" > Show "Change To Altern. Name" </input></label>';
            var cntLogs = document.createElement('section');
            cntLogs.id = "WME_CRN_Comments_title"; cntLogs.style = "padding-top:5px; margin:2px;margin-top:5px;border-top:1px solid skyblue;";
            cntLogs.innerHTML = '<label style="font-weight:normal;height:20px;margin:0px 5px 0px 0px"> <input type="checkbox"; style="vertical-align: middle;margin: 0px;" id="WME_CRN_show_logs" "> Show Logs </input></label>';
            cntLogs.innerHTML +='<button class= "waze-btn waze-btn-small waze-btn-white"style="float:right;padding:0px 6px; height:20px; margin-right:5px;" id = "WME_CRN_clear_logs" title="Click this button to Clear logs">Clear Logs</button>';
            cntLogs.innerHTML +='<div class= "waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; width:auto; max-height:500px; overflow-x:hidden; overflow-y:auto; margin:5px; display:none" id = "WME_CRN_logs" ><br></div>';
            var WME_CRN_Menu = document.createElement('div');
            WME_CRN_Menu.className = "tab-pane";
            WME_CRN_Menu.style="padding:2px 2px 2px 5px; border-width:3px; border-style:double;border-color: SkyBlue; border-radius:10px";
            WME_CRN_Menu.id = "sidepanel-CRN";

            WME_CRN_Menu.appendChild(cntEnt);
            WME_CRN_Menu.appendChild(cntRename);
            WME_CRN_Menu.appendChild(cntStrID)
            WME_CRN_Menu.appendChild(cntChgAlt1);
            WME_CRN_Menu.appendChild(cntLogs);

            // **** Création nouvel onglet
            var sidebar = document.getElementById('sidebar');
            var userTabs = document.getElementById('user-info');
            var editPanel= document.getElementById('edit-panel');
            var map = document.getElementById('map')
            if (sidebar.style.display == 'none' ||userTabs === null || map === null || editPanel=== null) {setTimeout (function () {insertButton();}, 500); return;}
            var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
            var tabContent = getElementsByClassName('tab-content', userTabs)[0];
            var newtab = document.createElement('li');
            newtab.innerHTML = '<a href="#sidepanel-CRN" data-toggle="tab">CRN</a>';
            navTabs.appendChild(newtab);
            tabContent.appendChild(WME_CRN_Menu);

            // **** Ajout Fonctions nouvel onglet
            document.getElementById ('WME_CRN_chk').onclick = function() {rename_Road2()};
            document.getElementById ('WME_CRN_stop').onclick = function() {stop_check()};
            document.getElementById ('WME_CRN_raz').onclick = function() {RAZ()};
            document.getElementById ('WME_CRN_show_logs').onclick = function() {show_logs()};
            document.getElementById ('WME_CRN_clear_logs').onclick = function() {clearLogs()};
            document.getElementById ('WME_CRN_StreetID').onclick = function() {afficheSegProperties()};
            document.getElementById ('WME_CRN_ChangeToAltern1').onclick = function() {ChAlternate()};
            document.getElementById ('WME_CRN_TestRoadName').onclick = function() {saveLocalStorage()};
            document.getElementById ('WME_CRN_TestAlternateRoadName').onclick = function() {saveLocalStorage()};
            document.getElementById ('WME_CRN_TestPOIName').onclick = function() {saveLocalStorage()};
            document.getElementById ('WME_CRN_TestAlternatePOIName').onclick = function() {saveLocalStorage()};

            // ****Boite de dialogue CRN
            var myDialogBox = $ ('<div id="WME_CRN_DialogBox" style="opacity: 1.0; display :block; z-index: 1500;position: absolute;top:50px; left: 30px;background-color:#EEE; border-width:3px; border-style:double;border-color: rgb(147, 196, 211); border-radius:10px"/>');

            var cnt000 = $('<label id= "WME_CRN_DialogBoxMain" >');
            var cnt001 = $('<label id= "WME_CRN_DialogBoxAlternate" >');
            var cnt002 = $('<label id= "WME_CRN_DialogBoxLandmark" >');
            var txt001 = $('<div id= "WME_CRN_DialogBoxTitle" style="height:auto; text-align:left"><p> d </p>');
            var cnt003 = $('<div class="waze-btn waze-btn-small waze-btn-white"  style="margin:5px;padding-top:2px;text-align: left;"; />');
            cnt003.append(cnt000,cnt001,cnt002,txt001);

            var inp01 = $('<input  id= "WME_CRN_newName" style ="margin:5px;border-radius:0px;width:95%" >" "/');
            var txt02 = $('<div id= "WME_CRN_myJson" style="display:none;""><b> </b>');

            var cnt10 = $('<section id= "WME_CRN_DialogBoxBottom" style ="border-top:1px solid SkyBlue; font-size:20px;"; />');
            var move = $('<i class="js-recenter w-icon w-icon-recenter"style="padding-left: 5px;;padding-right: 25px;vertical-align: middle;"></i>');
            var btn8 = 	$('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin:5px" >Cancel </button>');
            var btn9 = 	$('<button class="waze-btn waze-btn-small waze-btn-white" style="padding:0px 6px; height:20px; margin:5px" >Validate Change</button>');
            btn8.click(cancel_Change_Road_Name); btn9.click(valid_Change_Road_Name);
            cnt10.append(move,btn8,btn9);
            myDialogBox.append(cnt003,inp01,txt02,cnt10);
            $("#map").append(myDialogBox);

            //mobilité de la boite
            var CRNmoveBox = new moveDiv();
            getId('WME_CRN_DialogBoxBottom').onmousedown = CRNmoveBox.set;
            getId('WME_CRN_DialogBoxBottom').onmouseup = CRNmoveBox.reset;
            getId('WME_CRN_DialogBoxBottom').ondblclick = CRNmoveBox.resetPos;
            getId('map').onmouseover = CRNmoveBox.moveEl;

            delete mainDictionnaryKey;   // on supprime les variables globales du dictionnaire
            delete publicDictionnarykey; // on n'en a plus besoin

            init_WME_CRN();
        }

        console_log("Check Road Name "+ WME_CRN_version +" initialized");
    }

    var WME_CRN_badStreet = [];
    var WME_CRN_goodStreet = [];
    var listSegIDs = [];
    var listLmrkIDs = [];
    var myStreets = [];

    function ChAlternate (ev) {
        var selection = []; // Stocke la selection
        //        var selectedItems = W.selectionManager.getSelectedFeatures();
        var selectedItems = getSelectedFeatures();
        for (var j = 0; j< selectedItems.length;j++) {
            selection.push(selectedItems[j].model);
        }
        for (var i = 0; i<selection.length;i++) {
            var sel =selection[i];
            if (sel.type == "segment") {
                var street= W.model.streets.objects[sel.attributes.primaryStreetID];
                var streetName = (street.attributes.name)? street.attributes.name : "" ;
                var city = W.model.cities.objects[street.attributes.cityID];
                var cityName = city.attributes.name;
                var dxxx = streetName;
                if (/(^[A|D|E|N|M][1-9][0-9]*[.]*[0-9]*[a-z]*[0-9]*)/.test(streetName)) {					// le nom commence par un numéro de route
                    dxxx = dxxx.match(/(^[A|D|E|N|M][1-9][0-9]*[.]*[0-9]*[a-z]*[0-9]*)/)[0];                // On extrait le numéro de route																													// reset index regex
                    streetName = streetName.replace (/(^[A|D|E|N|M][1-9][0-9]*[.]*[0-9]*[a-z]*[0-9]*)/,"");
                    streetName = streetName.replace (/(^ \- )/,"");}  										// On extrait le nom de la rue
                var lieuDit = "";
                if (/[(]/.test(cityName) && /[)]/.test(cityName)) {                        					// c'est un lieudit
                    lieuDit = cityName.replace (/([a-zéèêîïëôâàû '-]*)[ ][(].*/gi,"$1");              		// extrait le lieudit
                    cityName = cityName.replace (/[a-zéèêîïëôâàû '-]*[ ][(](.*)/gi,"$1");                   // extrait la ville d'origine
                    cityName = cityName.replace (/([a-zéèêîïëôâàû '-)]*)([ ][(][0-9][0-9][)])*[)]/gi,"$1"); // supprime le département s'il existe
                    //                   add_alternative_street_city (lieuDit,cityName);										// on ajoute le lieudit en alternate de la ville
                    if (streetName==='') {streetName = lieuDit;}											// si la rue n'est pas nommée, elle prend le nom du lieudit
                }

                var multiaction = new WazeActionMultiAction();
//                multiaction.setModel(W.model);
//                multiaction.doSubAction(changeStreetAdress (sel, city.attributes.countryID, city.attributes.stateID,"", dxxx));
                W.model.actionManager.add (changeStreetAdress (sel, city.attributes.countryID, city.attributes.stateID,"", dxxx));
                sel.getAddress();
                if (streetName!==lieuDit && streetName!=="") {
//                    multiaction.doSubAction(add_Alternative_Street(sel,city.attributes.countryID,city.attributes.stateID,cityName,streetName));}
                    W.model.actionManager.add (add_Alternative_Street(sel,city.attributes.countryID,city.attributes.stateID,cityName,streetName));}
                if (lieuDit!=="" ) {
//  multiaction.doSubAction(add_Alternative_Street(sel,city.attributes.countryID,city.attributes.stateID,cityName,lieuDit));}
                    W.model.actionManager.add (add_Alternative_Street(sel,city.attributes.countryID,city.attributes.stateID,cityName,lieuDit));}
//                multiaction._description = I18n.t("save.changes_log.actions.UpdateFeatureAddress",{objectType: "segment"});
//                W.model.actionManager.add (multiaction);
            }
        }
    }

    function show_logs() {
        if (document.getElementById("WME_CRN_show_logs").checked == true) {
            document.getElementById("WME_CRN_logs").style.display = "block";}
        else {
            document.getElementById("WME_CRN_logs").style.display = "none";}
        saveLocalStorage();
    }

    function add_Alternative_Street (sel, country_ID, state_ID,city_Name, street_Name) {
        var attr = {
            countryID: country_ID,
            stateID: state_ID,
            cityName: city_Name,
            emptyCity: (city_Name==''),
            streetName: street_Name,
            emptyStreet: (street_Name=='')
        };
        var add_Alternative = new WazeActionAddAlternateStreet(sel, attr);
        add_Alternative._description = I18n.t("save.changes_log.actions.UpdateFeatureAddress", {objectType: "segment"});
        return add_Alternative;
    }

    function showMainRoad(ev) {
        if (!valideMyJson()) {CRNrefreshMap();}
        else {
            var obj = {};
            obj.myJson = JSON.parse(document.getElementById("WME_CRN_myJson").innerHTML);
            obj.polygonToflash = [];
            obj = traiteIds (obj, "main");
            obj = traiteIds (obj, "alternate");
            obj = traiteIds (obj, "landmark");
            for (var i = 0; i < obj.polygonToflash.length; i++) { // on flashe les polygones
                var polyline = getId(obj.polygonToflash[i]);
                if (checkPolygon (obj.polygonToflash[i],obj.myJson.modPolygonIds)== -1) {
                    obj.myJson.modPolygonIds.push({
                        id: obj.polygonToflash[i],
                        oldStroke: polyline.getAttribute("stroke"),
                        oldStrokeOpacity: polyline.getAttribute("stroke-opacity"),
                        oldStrokeWidth: polyline.getAttribute("stroke-width"),
                        oldWidth: polyline.getAttribute("width"),
                        oldHeight: polyline.getAttribute("height")
                    });
                    document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify(obj.myJson);
                }
                polyline.setAttribute("stroke", "red");
                polyline.setAttribute("stroke-opacity", "100");
                polyline.setAttribute("stroke-width", "12");

                polyline.setAttribute("width", "48");
                polyline.setAttribute("height", "48");
            }
        }
    }

    function traiteIds (obj, objType) {
        var check, myIds, featureArray;
        var totalObj = W.model.segments.objects;
        switch (objType) {
            case 'main':
                check = "WME_CRN_DialogBoxMainChk";
                myIds = obj.myJson.mySegs.main;
                featureArray = W.map.segmentLayer;
                break;
            case 'alternate':
                check = "WME_CRN_DialogBoxAlternateChk";
                myIds = obj.myJson.mySegs.alternate;
                featureArray = W.map.segmentLayer;
                break;
            case 'landmark':
                check = "WME_CRN_DialogBoxLandmarkChk";
                myIds = obj.myJson.myLdmkToCheckStreetID;
                totalObj = W.model.venues.objects;
                featureArray = W.map.venueLayer;
                break;
        }

        for (var i = 0; i < myIds.length; i++) {
            var segID= totalObj[myIds[i]].attributes.id;
            var polylineID = getGeoIdFromFeatures (segID,featureArray);

            if (document.getElementById(check).checked == true) { //C'est coché , on stocke les polygone pour le flash
                obj.polygonToflash.push(polylineID);
            }
            else {                                                //Ce n'est pas coché, on efface les polygones concernés les polygone pour le flash
                var index = checkPolygon(polylineID, obj.myJson.modPolygonIds);
                if ( index !=-1) {obj.myJson = effacePolyline (index, polylineID,obj.myJson)} // le segment existe en base modifié
            }
        }
        return obj;
    }

    function getGeoIdFromFeatures_old(featureID, featureArray) {
        var array = featureArray.features;
        for (var i = 0; i < array.length; i++) {
            if (array[i].data.wazeFeature.id == featureID) {
                return array[i].geometry.id;
            }
        }
    }

    function getGeoIdFromFeatures(featureID, featureArray) {
        var entries = featureArray.featureMap;
        for (const [segFrom, value] of entries.entries()) {
            if (segFrom == featureID) {
                return value.geometry.id;
            }
        }
    }

    function effacePolyline (index, polylineID,myJson) {
        var polyline = getId(polylineID);
        if (polyline) {
            polyline.setAttribute("stroke", myJson.modPolygonIds[index].oldStroke); // on remets les anciennes couleurs
            polyline.setAttribute("stroke-opacity", myJson.modPolygonIds[index].oldStrokeOpacity);
            polyline.setAttribute("stroke-width", myJson.modPolygonIds[index].oldStrokeWidth);
            polyline.setAttribute("width", myJson.modPolygonIds[index].oldWidth);
            polyline.setAttribute("height", myJson.modPolygonIds[index].oldHeight);
        }
        myJson.modPolygonIds.splice(index,1); // on supprime le polygone modifié
        document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify(myJson); // on sauvegarde
        return myJson;
    }

    function checkPolygon(polygonID, modPolygonIds) {
        for (var i = 0; i < modPolygonIds.length; i++) {
            if (polygonID == modPolygonIds[i].id) {return i;}
        }
        return -1;
    }

    function disableCheckRoad (flag) {
        document.getElementById('WME_CRN_chk').disabled = flag;
        document.getElementById('WME_CRN_stop').disabled = flag;
        document.getElementById('WME_CRN_CheckRoadName').disabled = flag;
        document.getElementById('WME_CRN_raz').disabled = flag;
    }

    function getSelectedFeatures() { // function de remplacement pour W.selectionManager.getSelectedFeatures() modifiée dans WME
        var selectedItems = W.selectionManager.getSegmentSelection().segments;
        var table = [];
        for (var i = 0; i < selectedItems.length; i++) {
            var obj = {};
            obj.model = selectedItems[i];
            table.push (obj);
        }
        return table;
    }

    function afficheSegProperties () {
        var selectedItems = getSelectedFeatures();
        if (selectedItems.length == 1) {
            var sel = selectedItems[0].model;
            if ((sel.type == "segment") && (sel.attributes.primaryStreetID !== null)) {
                var Street = sel.model.streets.get(sel.attributes.primaryStreetID);
                var City = sel.model.cities.get(Street.attributes.cityID);
                var states = sel.model.states.get(City.attributes.stateID);
                var country= sel.model.countries.get(City.attributes.countryID);
                var max_length = 2 + Math.max (sel.attributes.primaryStreetID.toString().length,Street.attributes.cityID.toString().length,City.attributes.stateID.toString().length, City.attributes.countryID.toString().length );
                var message = "StreetID = "+ completeWithSpaces (sel.attributes.primaryStreetID,max_length) +"    Street name = "+ Street.attributes.name;
                message += "\nCityID = " + completeWithSpaces(Street.attributes.cityID,max_length) +"       City name = "+ City.attributes.name;
                message += "\nStateID = " + completeWithSpaces(City.attributes.stateID,max_length) + "     State name = "+ states.attributes.name;
                message += "\nCountryID = " + completeWithSpaces(City.attributes.countryID,max_length) + "Country name = "+ country.attributes.name;
                alert (message);
            }
        }
        W.selectionManager.unselectAll(); // on vide la selection pour revenir sur CRN
    }

    function completeWithSpaces (name,lgth) {
        var name1 = name.toString();
        return (name1 + " ".repeat((lgth - name1.length)*2));
    }

    function RAZ (ev) {
        WME_CRN_badStreet.length = 0;
        WME_CRN_goodStreet.length = 0;
        myStreets.length = 0;
        document.getElementById('WME_CRN_raz').disabled = true; // on desactive le bouton RAZ puisque les tableaux sont vides
    }

    function stop_check (ev) {
        listSegIDs.length = 0;
        listLmrkIDs.length = 0;
        document.getElementById ('WME_CRN_CheckRoadName').checked = 0;
        document.getElementById ('WME_CRN_CheckRoadName').disabled = false;
        document.getElementById ('WME_CRN_chk').disabled = false;
        saveLocalStorage();
    }

    function rename_Road2 (ev) {
        //        if (findPending().length=== 0  && W.map.getOLMap().zoom > 1 && limitForSaveNotReach() )  {  // wait for loading
        if (W.map.getOLMap().zoom > 1 && limitForSaveNotReach() && document.getElementById("WME_CRN_DialogBox").style.display != "block" ) { // on ne relance pas s'il y a une modif en cours

            var name, oldName, newName;
            var roadID,ldmkID,cityID,goodstreet;
            listLmrkIDs.length = 0;
            listSegIDs.length = 0;

            videDialogBox()
            document.getElementById('WME_CRN_chk').disabled = true; // on désactive le bouton "check" durant le check
            document.getElementById('WME_CRN_CheckRoadName').disabled = true;

            myStreets.length = 0;
            if (WME_CRN_goodStreet.length > 1500) {WME_CRN_goodStreet.splice(0,750);} // on vide les plus anciennes  goods streets s'il y en a trop de stockées
            if (!limitForSaveNotReach()){myAlert ("<FONT color='red'><b>Please save and retry</b></FONT>");}
            for (var streetID in W.model.streets.objects) {
                var street = W.model.streets.objects[streetID];
                var street_ID = street.attributes.id;
                if (notInArray(street_ID,WME_CRN_goodStreet)
                    && notInArray(street_ID,WME_CRN_badStreet)
                    && street.attributes.name && street.attributes.name!="" && street.attributes.name !== null // verif nom existe
                    && street.attributes.cityID != null
                    && W.model.cities.objects[street.attributes.cityID]
                    && W.model.cities.objects[street.attributes.cityID].attributes.name!== null
                    && W.model.cities.objects[street.attributes.cityID].attributes.countryID == WME_CRN_MainCountry){
                    myStreets.push (W.model.streets.objects[streetID]); // on ne garde que les streets avec noms
                }
            }

            for (var i = 0; i < myStreets.length; i++) {

                if (document.getElementById("WME_CRN_DialogBox").style.display == "block") {break;} // il y a une modif en cours de validation on sort de la boucle

                name = myStreets[i].attributes.name;
                var streetId= myStreets[i].attributes.id;
                newName = rename2(name);
                if (newName == name) {WME_CRN_goodStreet.push(streetId);}// on stocke l'ID du bon nom pour ne pas le regarder à nouveau
                if (!limitForSaveNotReach()){myAlert ("<FONT color='red'><b>Please save and retry</b></FONT>");}
                if (newName!=name && limitForSaveNotReach()){
                    var mySegs = searchSegWithStreetID (streetId); // on extrait les primaryStreet & alternateStreet
                    var myLdmkToCheckStreetID = searchLdmkToCheckStreetID(streetId); //on extrait les landmark
                    if (mySegs.main.length + mySegs.alternate.length + myLdmkToCheckStreetID.length > 0) {
                        var myCityID = myStreets[i].attributes.cityID;
                        var city = W.model.cities.objects[myCityID];
                        if (mySegs.main.length>0) {
                            createCheckBox ("WME_CRN_DialogBoxMain",mySegs.main.length+" street(s) to change in main adress");
                        }
                        if (mySegs.alternate.length>0) {
                            createCheckBox ("WME_CRN_DialogBoxAlternate",mySegs.alternate.length+" street(s) to change in alternative adress");
                        }
                        if (myLdmkToCheckStreetID.length>0) {
                            createCheckBox ("WME_CRN_DialogBoxLandmark",myLdmkToCheckStreetID.length+" landmark(s) to change adress");
                        }
                        var name1 = split_diff(name,newName);
                        var message1 = "\nCity : "+city.attributes.name+"<br>"
                        message1 += "Département : "+ W.model.states.objects[city.attributes.stateID].attributes.name+"<br>"
                        message1 += "Old name is : "+name1.debut+"<span style='background-color:pink;color: red'>"+name1.milieu+"</span>"+name1.fin+"<br><br>"
                        message1 += "Confirm the new name or change it";

                        document.getElementById("WME_CRN_DialogBoxTitle").innerHTML = message1;
                        document.getElementById("WME_CRN_newName").value = newName;
                        var myJson = {name: name, myStreetsID: streetId,myCityID: myCityID, mySegs: mySegs, myLdmkToCheckStreetID :myLdmkToCheckStreetID,modPolygonIds:[]};
                        document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify(myJson);
                        document.getElementById("WME_CRN_DialogBox").style.display="block"; // on affiche la boite de dialogue
                    }
                }
            }

            // on traite les noms des landmark
            if (checkLayerState ("venues")) {
                var myWazeVenues = []; myWazeVenues = W.model.venues.objects;
                for (ldmkID in myWazeVenues) {
                    var ldmk = myWazeVenues[ldmkID];
                    if (ldmk!== null && ldmk.state !== "Delete" && onScreen(ldmk) && (ldmk.attributes.approved) && (ldmk.attributes.streetID!== null) && ldmk.isAllowed(ldmk.permissionFlags.EDIT_PROPERTIES) && !ldmk.attributes.adLocked) {
                        street = W.model.streets.objects[ldmk.attributes.streetID];
                        if (street && street.attributes.cityID !== null) {
                            city = W.model.cities.objects[street.attributes.cityID];
                            oldName = ldmk.attributes.name;
                            if (city && city.attributes.name!== null && city.attributes.countryID == WME_CRN_MainCountry && oldName && oldName!== "" && notInArray(oldName,WME_CRN_badStreet) && notInArray(oldName,WME_CRN_goodStreet)) { //  Le segment remplit toutes les conditions pour analyse ultérieure
                                listLmrkIDs.push (ldmkID); // alimente la base des rues a tester
                            }
                            var aliases = ldmk.attributes.aliases; // traitement des noms alternatifs
                            for (var j = 0; j < aliases.length ;j++) {
                                var altname = aliases[j];
                                if (city && city.attributes.name!== null && city.attributes.countryID == WME_CRN_MainCountry && altname && altname!== "" && notInArray(altname,WME_CRN_badStreet) && notInArray(altname,WME_CRN_goodStreet)) { //  Le segment remplit toutes les conditions pour analyse ultérieure
                                    listLmrkIDs.push (ldmkID); // alimente la bsase des rues a tester
                                }
                            }
                        }
                    }
                }
                listLmrkIDs = delete_multi_Ids (listLmrkIDs);
                checkLandmarkName (listLmrkIDs);
                //               modif = checkLandmarkName (listLmrkIDs);
            }

            setTimeout (function(){manage_CheckRoadName();},4001);
        }
    }

    function split_diff(name,newName){
        var name1 ={};
        name1.debut = name1.milieu = name1.fin = "";
        for (var i = 0; i < name.length ;i++) {if (name.charAt(i)!=newName.charAt(i)){break;}}
        for (var j = 0; j < name.length ;j++) {if (name.charAt(name.length-j)!=newName.charAt(newName.length-j)){break;}}
        name1.debut = name.substring(0,i);
        name1.fin = name.substring(name.length-j+1);
        if ((name1.debut.length + name1.fin.length)< name.length) {
            name1.milieu = encodeHTML(name.substring(i,name.length-j+1));}
        else {
            name1.milieu = encodeHTML(name.substring(i,i+1));
            name1.fin = name.substring(i+1);
        }
        name1.debut = encodeHTML(name1.debut);
        name1.fin = encodeHTML(name1.fin);
        return name1;
    }

    function createLog (objType,objIdsArray,newName,oldName) {
        var modObj=objIdsArray.toString();
        if (modObj.length>0) {
            if ( objType == "Segment") {modObj = "&segments="+modObj;}
            else {modObj = "&venues="+modObj;}
            var center = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
            var projTo = new OpenLayers.Projection("EPSG:4326");
            var projFrom = new OpenLayers.Projection("EPSG:900913")
            var cproj = center.transform(projFrom, projTo);
            modObj = "https://www.waze.com/fr/editor?env=row&lat="+cproj.lat.toFixed(5)+"&lon="+cproj.lon.toFixed(5)+"&zoom="+W.map.getZoom()+modObj;
            myAlert ('<hr style = "margin-top: 0px;margin-bottom:0px">');
            myAlert("<a href="+modObj+" target='_blank'>" + oldName+" => "+newName + "</a>");
        }
    }

    function createCheckBox(parentID,message) {
        var childID = parentID+"Chk";
        document.getElementById(parentID).style.fontWeight = "normal";
        document.getElementById(parentID).innerHTML = '<input type="checkbox" style="vertical-align: middle;margin: 0px" id='+childID+'> '+ message+'</input>';
        document.getElementById(childID).onclick = function(){showMainRoad()};
        document.getElementById(childID).checked = false;
        document.getElementById(parentID).style.display="block";
    }

    function valid_Change_Road_Name() {
        if (!valideMyJson()) {CRNrefreshMap();}
        else {
            var myJson = JSON.parse(document.getElementById("WME_CRN_myJson").innerHTML);
            var newName = document.getElementById("WME_CRN_newName").value;
            for (var i = myJson.modPolygonIds.length-1; i >= 0 ; i--) { // on efface les polyline affichées
                effacePolyline (i, myJson.modPolygonIds[i].id,myJson)}
            if (myJson.myCityID) { // on traite une adresse
                correctRoadName (newName,myJson.name, myJson.myStreetsID,myJson.myCityID,myJson.mySegs,myJson.myLdmkToCheckStreetID);}
            else {
                correctLandmarkName(newName,myJson.name,myJson.myLdmkToCheckStreetID,myJson.alt,myJson.aliasNbr);
            }
            videDialogBox();
            rename_Road2(); // on relance une recherche
        }
    }

    function correctLandmarkName(newName,oldName, myLdmkToCheckStreetID,alt,aliasNbr) {
        var ldmark = W.model.venues.objects[myLdmkToCheckStreetID];
        if (newName === null) {
            WME_CRN_badStreet.push (ldmark.attributes.name);
            document.getElementById('WME_CRN_raz').disabled = false;
        }
        else if (newName != oldName) {
            createLog ("Landmark "+alt+" Name",myLdmkToCheckStreetID,newName,oldName);
            if (alt!="Alternate") {
                W.model.actionManager.add (new WazeActionUpdateObject(ldmark,{name: newName}));}
            else {
                var alias = [];
                for (var i = 0; i < ldmark.attributes.aliases.length ;i++) {
                    alias[i]= ldmark.attributes.aliases[i];
                }
                alias[aliasNbr] = newName;
                W.model.actionManager.add (new WazeActionUpdateObject(ldmark,{aliases: alias}))
            }
            //				modif = true;
        }
    }

    function cancel_Change_Road_Name() {
        if (!valideMyJson()) {CRNrefreshMap();}
        else {
            var myJson = JSON.parse(document.getElementById("WME_CRN_myJson").innerHTML);
            for (var i = myJson.modPolygonIds.length-1; i >= 0 ; i--) { // on efface les polyline affichées
                effacePolyline (i, myJson.modPolygonIds[i].id,myJson)}
            if (myJson.myCityID) { // on traite une adresse
                WME_CRN_badStreet.push (myJson.myStreetsID);
                document.getElementById('WME_CRN_raz').disabled = false;
            }
            else {
                var ldmark = W.model.venues.objects[myJson.myLdmkToCheckStreetID];
                if (ldmark) {
                    if (myJson.alt!="Alternate") {WME_CRN_badStreet.push (ldmark.attributes.name);}
                    else { WME_CRN_badStreet.push (ldmark.attributes.aliases[myJson.aliasNbr]);}
                    document.getElementById('WME_CRN_raz').disabled = false;
                }
            }
            videDialogBox();
            rename_Road2(); // on relance une recherche
        }
    }

    function valideMyJson(){ // Check if objs in Json are always on the map
        var myJson = JSON.parse(document.getElementById("WME_CRN_myJson").innerHTML);
        var mySegMain = myJson.mySegs.main;
        var mySegAlternate = myJson.mySegs.alternate;
        var myLandmarksID = myJson.myLdmkToCheckStreetID;
        var myNewSegMain =[];
        var myNewSegAlternate =[];
        var myNewLandmarksID= [];
        for (var i=0; i<mySegMain.length;i++){
            if (W.model.segments.objects[mySegMain[i]]) {myNewSegMain.push(mySegMain[i]);}}
        for (var j=0; j<mySegAlternate.length;j++){
            if (W.model.segments.objects[mySegAlternate[j]]) {myNewSegAlternate.push(mySegAlternate[j]);}}
        for (var k=0; k<myLandmarksID.length;k++){
            if (W.model.venues.objects[myLandmarksID[k]]) {myNewLandmarksID.push(myLandmarksID[k]);}}
        myJson.mySegs.main = myNewSegMain;
        myJson.mySegs.alternate = myNewSegAlternate;
        myJson.myLdmkToCheckStreetID = myLandmarksID;
        document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify(myJson);

        return (mySegMain.length == myNewSegMain.length &&
                mySegAlternate.length == myNewSegAlternate.length &&
                myLandmarksID.length == myNewLandmarksID.length);
    }

    function videDialogBox() {
        var myJson = JSON.parse(document.getElementById("WME_CRN_myJson").innerHTML);
        if(myJson.modPolygonIds){
            for (var i = myJson.modPolygonIds.length-1; i >= 0 ; i--) { // on efface les polyline affichées
                effacePolyline (i, myJson.modPolygonIds[i].id,myJson)
            }
        }
        document.getElementById("WME_CRN_DialogBoxTitle").innerHTML = "";
        document.getElementById("WME_CRN_newName").value = "";
        document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify({})
        document.getElementById("WME_CRN_DialogBoxMain").style.display = "none";
        document.getElementById("WME_CRN_DialogBoxAlternate").style.display = "none";
        document.getElementById("WME_CRN_DialogBoxLandmark").style.display = "none";
        document.getElementById("WME_CRN_DialogBox").style.display="none";
        document.getElementById("WME_CRN_DialogBoxMain").innerHTML = "";
        document.getElementById("WME_CRN_DialogBoxAlternate").innerHTML = "";
        document.getElementById("WME_CRN_DialogBoxLandmark").innerHTML = "";
    }

    function correctRoadName (newName,name,myStreetsID,myCityID,mySegs,myLdmkToCheckStreetID) {
        var city = W.model.cities.objects[myCityID];
        if (newName === null) {
            WME_CRN_badStreet.push (myStreetsID);
            document.getElementById('WME_CRN_raz').disabled = false;}
        else {
            if (newName != name) {
                //               var multiaction = new WazeActionMultiAction();
                //                multiaction.setModel(W.model);
                // on traite les primaryStreet
                createLog ("Segment",mySegs.main,newName,name);
                for (var j = 0; j < mySegs.main.length; j++) {
                    var seg = W.model.segments.objects[mySegs.main[j]]
                    //              multiaction.doSubAction (changeStreetAdress (seg, city.attributes.countryID, city.attributes.stateID,city.attributes.name, newName));
                    W.model.actionManager.add (changeStreetAdress (seg, city.attributes.countryID, city.attributes.stateID,city.attributes.name, newName));
                    seg.getAddress();
                }
                // on traite les alternateStreet
                createLog ("Segment",mySegs.alternate,newName,name);
                for (var j1 = 0; j1 < mySegs.alternate.length; j1++) {
                    seg = W.model.segments.objects[mySegs.alternate[j1]]
                    var oldStreetIDs = seg.attributes.streetIDs;
                    var newStreetIDs = deleteInArray(myStreetsID,oldStreetIDs)
                    //                    multiaction.doSubAction (new WazeActionUpdateObject(seg, {streetIDs: newStreetIDs}));
                    //                   multiaction.doSubAction (add_Alternative_Street(seg,city.attributes.countryID,city.attributes.stateID,city.attributes.name,newName));
                    W.model.actionManager.add (new WazeActionUpdateObject(seg, {streetIDs: newStreetIDs}));
                    W.model.actionManager.add (add_Alternative_Street(seg,city.attributes.countryID,city.attributes.stateID,city.attributes.name,newName));
                    seg.getAddress();
                }
                // on traite les adresses des landmark
                if (checkLayerState ("venues")) {
                    createLog ("Landmark",myLdmkToCheckStreetID,newName,name);
                    for (var j2 = 0; j2 < myLdmkToCheckStreetID.length; j2++) {
                        var myLdmk = W.model.venues.objects[myLdmkToCheckStreetID[j2]];
                        var hn = myLdmk.attributes.houseNumber;
                        //multiaction.doSubAction(changeVenueAdress (myLdmk, city.attributes.countryID, city.attributes.stateID,city.attributes.name, newName));
                        // multiaction.doSubAction(new WazeActionUpdateObject (myLdmk,{houseNumber: hn} )); // remets le numéro (pour l'affichage WME)
                        W.model.actionManager.add(changeVenueAdress (myLdmk, city.attributes.countryID, city.attributes.stateID,city.attributes.name, newName));
                        W.model.actionManager.add(new WazeActionUpdateObject (myLdmk,{houseNumber: hn} )); // remets le numéro (pour l'affichage WME)
                        myLdmk.getAddress();
                    }
                }
                var modifiedSegsIds = delete_multi_Ids(mySegs.main.concat(mySegs.alternate));
                //                if (modifiedSegsIds.length== 1) {multiaction._description = I18n.t("save.changes_log.actions.UpdateFeatureAddress", {objectType: "segment"});}
                //                if (modifiedSegsIds.length > 1) {multiaction._description = I18n.t("save.changes_log.actions.MultiUpdateFeatureAddress", {count: modifiedSegsIds.length,objectType: "segment"});}
                //                if (myLdmkToCheckStreetID.length== 1) {
                //                    multiaction._description = multiaction._description +" & "+ I18n.t("save.changes_log.actions.UpdateFeatureAddress", {objectType: "venue"});
                //                }
                //                if (myLdmkToCheckStreetID.length > 1) {
                //                   multiaction._description = multiaction._description +" & "+ I18n.t("save.changes_log.actions.MultiUpdateFeatureAddress", {count: myLdmkToCheckStreetID.length,objectType: "venue"});
                //               }
                //              if ((modifiedSegsIds.length + myLdmkToCheckStreetID.length) > 0) {
                //                  W.model.actionManager.add (multiaction);
                //              }
            }
        }
    }

    function completeForSave(texte) {
        if (!texte) {texte=""}
        var nbChar = 20;
        var maxChar = nbChar*(Math.trunc(texte.length/nbChar)+1);
        if (texte.length > 0){
            texte += '&nbsp';
            for (var i = texte.length; i < maxChar; i=i+2) {texte+='&nbsp';}
        }
        return texte;
    }

    function searchLdmkToCheckStreetID (street_ID) {
        var myLdmks = [];
        for (var venues_ID in W.model.venues.objects){
            if (W.model.venues.objects[venues_ID].attributes.streetID == street_ID
                && ldmkIsAllowed(W.model.venues.objects[venues_ID])) {
                myLdmks.push(venues_ID);
            }
        }
        return myLdmks;
    }

    function searchSegWithStreetID(Street_ID) {
        var	mySegs = {};
        mySegs.main = [];
        mySegs.alternate = [];
        for (var segmentID in W.model.segments.objects){
            if (roadsIsAllowed(W.model.segments.objects[segmentID])) {
                if (getId ("WME_CRN_TestRoadName").checked == 1) {
                    if (W.model.segments.objects[segmentID].attributes.primaryStreetID == Street_ID) {
                        mySegs.main.push(segmentID);
                    }
                }
                if (getId ("WME_CRN_TestAlternateRoadName").checked == 1) {
                    if (W.model.segments.objects[segmentID].attributes.streetIDs
                        && isInArray(Street_ID, W.model.segments.objects[segmentID].attributes.streetIDs)) {
                        mySegs.alternate.push(segmentID);
                    }
                }
            }
        }
        return mySegs;
    }

    function ldmkIsAllowed(ldmk) {
        return (onScreen(ldmk) 			 // le segment est a l'écran
                && ldmk.arePropertiesEditable() // n'a pas de closures
                && !ldmk.attributes.adLocked // n'a pas de campagne commerciale
                && !ldmk.hasUpdateRequests()) // on a les droits d'edition){
    }

    function roadsIsAllowed(road) {
        return (onScreen(road) 							// le segment est a l'écran
                //        && !road.attributes.hasClosures                    // n'a pas de closures
                && road.isAllowed(road.permissionFlags.EDIT_PROPERTIES)) // on a les droits d'editioon){
    }

    function userIsCM() {
        return (W.loginManager.user.attributes.editableCountryIDs &&
                W.loginManager.user.attributes.editableCountryIDs.length !== 0 &&
                W.loginManager.user.attributes.editableCountryIDs[0] != ' ');
    }

    function userIsFrenchCM() {
        //return true;
        return (userIsCM() && isInArray (73,W.loginManager.user.attributes.editableCountryIDs));
    }

    function onScreen(obj){
        //    if (obj.geometry){
        //            return(W.map.getOLMap().getExtent().intersectsBounds(obj.geometry.getBounds()));}
        if (obj.getOLGeometry()){
            return(W.map.getOLMap().getExtent().intersectsBounds(obj.getOLGeometry().getBounds()));
        }
        return false;
    }

    function checkLandmarkName (listLmrkIDs) {
        var modif = false;
        var street,city,state,ldmark;
        var oldName, newName, cityName, ldmarkID;
        if (W.model.venues.objects.length === 0 ) { myAlert ("No landmark in memory");}
        for (var i = 0; i < listLmrkIDs.length; i++) {
            if (document.getElementById("WME_CRN_DialogBox").style.display == "block") {break;} // il y a une modif en cours de validation on sort de la boucle
            ldmark = W.model.venues.objects[listLmrkIDs[i]];
            if (ldmark!==null && onScreen(ldmark) && ldmkIsAllowed(ldmark)) {
                oldName = ldmark.attributes.name;
                if (getId ("WME_CRN_TestPOIName").checked == 1) {testLandmarkName (oldName, listLmrkIDs[i],"",0);}
                if (getId ("WME_CRN_TestAlternatePOIName").checked == 1) {
                    var aliases = ldmark.attributes.aliases; // test des noms alternatifs s'ils existent
                    for (var j = 0; j < aliases.length ;j++) {
                        var altname = aliases[j];
                        testLandmarkName (altname, listLmrkIDs[i], "Alternate", j);
                    }
                }
            }
        }
        return modif;
    }

    function testLandmarkName (oldName, ldmarkID, alt, aliasNbr) {
        var ldmark = W.model.venues.objects[ldmarkID];
        if (oldName !==null && oldName !=="" && !isInArray(oldName,WME_CRN_badStreet)) {
            if (ldmark.attributes.residential) { // on efface le nom sur place résidentielle
                var newName = "";}
            else {
                var newName = rename2 (oldName);
            }
            newName = newName.replace (/ *:[ -]*/g," - ");              // remplacement des ":"par "-" pour les landmarks
            if (newName == oldName) {WME_CRN_goodStreet.push(oldName);} // on stocke le bon nom pour ne pas le regarder à nouveau
            if (newName !=oldName && limitForSaveNotReach() ) {
                var street = W.model.streets.objects [ldmark.attributes.streetID];
                var city = W.model.cities.objects [street.attributes.cityID];
                var state = W.model.states.objects[city.attributes.stateID];
                if (typeof(city) === 'undefined' || city === null) {var cityName ="";}
                else {var cityName= city.attributes.name;}

                var name1 = split_diff(oldName,newName);
                var message1 = "\nType : " + ldmark.attributes.categories +"<br><br>";
                message1 += "\n\nDépartement : " + state.attributes.name +"<br>";
                message1 += "\nCity : " + cityName +"<br>";
                message1 += "Old "+alt+" name is : "+name1.debut+"<span style='background-color:pink;color: red'>"+name1.milieu+"</span>"+name1.fin+"<br><br>"
                message1 += "\n\nConfirm the new name or change it" ;

                document.getElementById("WME_CRN_DialogBoxTitle").innerHTML = message1;
                document.getElementById("WME_CRN_newName").value = newName;
                var myJson = {name: oldName,mySegs: {main: [], alternate: []}, myLdmkToCheckStreetID : [ldmarkID],modPolygonIds:[], alt: alt, aliasNbr: aliasNbr };
                document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify(myJson);
                createCheckBox ("WME_CRN_DialogBoxLandmark"," 1 landmark to rename");
                document.getElementById("WME_CRN_DialogBox").style.display="block"; // on affiche la boite de dialogue
            }
        }
    }

    function changeStreetAdress (sel, country_ID, state_ID,city_Name, street_Name) {
        var attr = {
            countryID: country_ID, stateID: state_ID,
            cityName: city_Name, emptyCity: (city_Name==''),
            streetName: street_Name, emptyStreet: (street_Name=='')
        };
        var changeStreet = new WazeActionUpdateFeatureAddress(sel, attr,{streetIDField: "primaryStreetID"});
        changeStreet.generateDescription();
        return changeStreet ;
    }

    function changeVenueAdress (sel, country_ID, state_ID,city_Name, street_Name) {
        var attr = {
            countryID: country_ID, stateID: state_ID,
            cityName: city_Name, emptyCity: (city_Name==''),
            streetName: street_Name, emptyStreet: (street_Name=='')
        };
        var changeVenue = new WazeActionUpdateFeatureAddress(sel, attr,{streetIDField: "streetID"});
        changeVenue.generateDescription();
        return changeVenue;
    }

    function rename2(old_name) {
        var new_name = genericCorrection(old_name);
        var name = new_name;
        var list = WME_CRN_Dictionary;
        for (var i = 0; i < list.length; i++) {
            //console_log("Test de la ligne " + list[i].line +" "+  list[i].toVerify +" "+ list[i].flags +" "+ eval(list[i].corrected ));                // trace modification
            try { // Capture des erreurs de regexp
                var regexp = new RegExp(list[i].toVerify, list[i].flags);
                var match = new_name.match(regexp)
                if (list[i].fct == "aToUpperCase") { name = new_name.replace (regexp, match.toUpperCase());}
                else {name = new_name.replace (regexp, list[i].fct);}
            }
            catch (e) { // Ca traite les erreurs
                var message = (list[i].line > 2000) ? (list[i].line - 2000) + " in public " : list[i].line + " in main " ;
                message = e + "\nLine "+ message + " dictionary has an error";
                message += "\n\nThis line is desactivated\n\nPlease correct it";
                alert (message);
                list.splice(i,1); // delete incorrect line in array
            }
            // informations de débug
            //if (name != new_name) {console_log("WME_CRN line " + list[i].line + ' OldName="'+new_name+'" ==> New_Name="'+name+'"');} // trace modification
            new_name = name;
        }
        return genericCorrection (new_name);
    }

    function genericCorrection (name) {
        name = name.replace (/ +/g," "); // delete double spaces
        name = name.replace (/^[ ]*/g,""); // delete "Space" at the begining of the name
        name = name.replace (/[ ]*$/g,""); // delete "Space" at the end of the name
        return name;
    }

    function checkLayerState (layerName) {
        var index = findLayerIndex (layerName);
        if (index !== null) {
            return W.map.getOLMap().controls[0].map.layers[index].visibility;
        }
        return false;
    }

    function activateLayer (layerName, flag) {
        if (flag === true || flag === false) {
            var index = findLayerIndex (layerName);
            if (index !== null) {
                var layerID = W.map.getOLMap().controls[0].map.layers[index].id;
                W.map.getOLMap().controls[0].map.getLayer(layerID).setVisibility(flag); //affiche le Layer "landmark"  "Waze.Layer.FeatureLayer_60"
            }
        }
    }

    function findLayerIndex (layerName) {
        var index ;
        var layers = W.map.getOLMap().controls[0].map.layers;
        for (var i = 0; i<layers.length; i++) {
            //            if (layers[i].options.uniqueName && layers[i].options.uniqueName.toUpperCase() == layerName.toUpperCase()) {index=i;}
            if (layers[i].name && layers[i].name.toUpperCase() == layerName.toUpperCase()) {index=i;}
        }
        return index;
    }

    function delete_multi_Ids (myArray) {
        var myNewArray = [];
        if (myArray.length > 0) {
            myNewArray[0]= myArray [0];
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (notInArray (myArray [i],myNewArray)) {myNewArray.push(myArray [i]);}
            }
        }
        return myNewArray;
    }

    function deleteInArray (item,array) {
        var newArray = [];
        for (var i = 0, len = array.length; i<len;i++) {
            if (array[i] != item ) {
                newArray.push (array[i]);
            }
        }
        return newArray;
    }

    function soustraitArray (array1,array2) {
        var newArray = [];
        for (var i = 0, len = array1.length; i<len;i++) {
            if (notInArray (array1[i] , array2)) {
                newArray.push (array1[i]);
            }
        }
        return newArray;
    }

    function isInArray (item,array) {return array.indexOf(item) !== -1;}
    function notInArray (item,array) {return array.indexOf(item) === -1;}
    function findPending() {
        var elements = W.map.getOLMap().controls[0].map.layers;
        for (var i = 0; i < elements.length;i++) { //scan all layers
            if (elements[i].loading === true ) {
                return [1];} // if it is loading return an array not null
        }
        return []; // return empty array (Compatibility with old pending manner)
        //return W.map.getOLMap().controls[5].pending;
    }

    function manage_WME_CRN(ev) {
        if(document.getElementById('WME_CRN_enable').checked == 1) {
            document.getElementById ('WME_CRN_rename').style.display = "block";
            document.getElementById ('WME_CRN_StrID_title').style.display = "block";
            document.getElementById ('WME_CRN_Dictionary').style.display = "inline";
            document.getElementById ('WME_CRN_Comments_title').style.display = "block";

            if (userIsFrenchCM() && isInArray(WME_CRN_MainCountry,WME_CRN_country.frenchCountry)) {
                document.getElementById ('WME_CRN_ShowChangeToAltern').style.display = "block";
            }
            else {
                document.getElementById ('WME_CRN_ShowChangeToAltern').style.display = "none";
            }
            traiteSelection ();
        }
        else {
            document.getElementById ('WME_CRN_rename').style.display = "none";
            document.getElementById ('WME_CRN_StrID_title').style.display = "none";
            document.getElementById ('WME_CRN_CheckRoadName').checked = 0;
            document.getElementById ('WME_CRN_Dictionary').style.display = "none";
            document.getElementById ('WME_CRN_ShowChangeToAltern').style.display = "none";
            document.getElementById ('WME_CRN_Comments_title').style.display = "none";
            videDialogBox() ; // On ferme la fonction "AutoChk")
            stop_check ();
            RAZ ();
            disableCheckRoad(true);
        }
        manage_CheckRoadName();
        WME_CRN_goodStreet.length = 0; // vide le tableau des rues correctes
    }

    function manage_CheckRoadName() {
        if (document.getElementById('WME_CRN_CheckRoadName').checked == 1) {
            document.getElementById('WME_CRN_CheckRoadName').disabled = true; // on désactive la case
            document.getElementById('WME_CRN_chk').disabled = true; // on désactive le lancement manuel
            rename_Road2();
        }
        else {
            document.getElementById('WME_CRN_CheckRoadName').disabled = false; // on désactive la case
            document.getElementById('WME_CRN_chk').disabled = false;
        }
        if (WME_CRN_badStreet.length===0 && WME_CRN_goodStreet.length===0) { // gestion du bouton raz
            document.getElementById('WME_CRN_raz').disabled = true;}
        else {
            document.getElementById('WME_CRN_raz').disabled = false;}
        saveLocalStorage();
    }

    function afficheObjet (objet) {for (var e in objet) {alert("objet["+e+"] ="+ objet[e]+" !");}}
    function console_log(msg) {if (console) {console.log(msg);}}

    function encodeHTML (var1) {
        var var2 = var1;
        var2 = var2.replace (/[&]/gi,"&amp;");
        var2 = var2.replace (/["]/gi,"&quot;");
        var2 = var2.replace (/[<]/gi,"&lsaquo;");
        var2 = var2.replace (/[>]/gi,"&rsaquo;");
        var2 = var2.replace (/[ ]/gi,"&nbsp;");
        return var2;
    }

    function init_WME_CRN() {
        localStorage.removeItem('WME_CRN_CheckLdmkName'); // Remove old item in LocalStorage
        localStorage.removeItem('WME_CRN_CheckCityName');
        localStorage.removeItem('WME_CRN_CheckRoadName');
        localStorage.removeItem('WME_CRN_enable');

        document.getElementById("WME_CRN_myJson").innerHTML = JSON.stringify({});
        videDialogBox();
        var mapDims = getId('map').getBoundingClientRect();
        getId('WME_CRN_logs').style.maxHeight = (mapDims.height - 270) + "px";
        restoreLocalStorage(); // restaure old Values (if exist)
        show_logs();
        document.getElementById('WME_CRN_enable').onclick = manage_WME_CRN;
        document.getElementById('WME_CRN_CheckRoadName').onclick = manage_CheckRoadName;
        W.selectionManager.events.register("selectionchanged", null, traiteSelection);
        W.model.actionManager.events.register("afterundoaction", null, CRNrefreshMap);
        W.model.actionManager.events.register("afterredoaction", null, CRNrefreshMap);
        W.map.olMap.events.register("zoomend", null, CRNrefreshMap1);
        W.map.olMap.events.register("moveend", null, CRNrefreshMap1);
        traiteSelection (); // init Change Alternate Button

        manage_WME_CRN ();
        myAlert("WME_CRN initialized");
        myAlert("Dictionary : " + W.model.countries.objects[WME_CRN_MainCountry].attributes.name);
    }

    function traiteSelection() {
        //        var selectedItems = W.selectionManager.getSelectedFeatures();
        var selectedItems = getSelectedFeatures();
        if (selectedItems.length == 1 && selectedItems[0].model.type == "segment") {
            document.getElementById("WME_CRN_StreetID").disabled = false;}
        else { document.getElementById("WME_CRN_StreetID").disabled = true;}
        if (selectedItems.length > 0 && selectedItems[0].model.type == "segment") {
            document.getElementById("WME_CRN_ChangeToAltern1").disabled = false;}
        else { document.getElementById("WME_CRN_ChangeToAltern1").disabled = true;}
    }

    function CRNrefreshMap1(){
        //        setTimeout (function(){CRNrefreshMap()},500);
        setTimeout (function(){CRNrefreshMap()},1000);
        //        setTimeout (function(){CRNrefreshMap()},3000);
    }

    function CRNrefreshMap(){
        if (document.getElementById("WME_CRN_DialogBox").style.display == "block"){
            videDialogBox();
            rename_Road2();
        }
    }

    function myAlert(message) {
        var alerte = document.getElementById ('WME_CRN_logs');
        if (alerte.innerHTML =='<br>') {
            alerte.innerHTML = message;}
        else {
            alerte.innerHTML = message + ((message.substring(0, 3)=='<hr')? '':'<br>') + alerte.innerHTML;
        }
    }

    function clearLogs() {
        var alerte = document.getElementById ('WME_CRN_logs');
        alerte.innerHTML = '<br>';
    }

    function limitForSaveNotReach() {
        if (W.model.actionManager.index) {return (W.model.actionManager.index < 3);}
        if (W.model.actionManager._undoStack) {return (W.model.actionManager._undoStack.length < 99);} // beta
    }

    function getElementsByClassName(classname, node) {
        if(!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i=0,j=els.length; i<j; i++){
            if (re.test(els[i].className)) a.push(els[i]);}
        return a;
    }

    function moveDiv(){
        var _mapBox, _crnBox;
        var _offsets = {};
        var _moveEl = false;
        var _top, _left;
        this.init = function(){
        }

        this.set = function(e1){
            getId('WME_CRN_DialogBoxBottom').style.cursor = 'move';
            _mapBox = getId('map').getBoundingClientRect();
            _crnBox = getId('WME_CRN_DialogBox').getBoundingClientRect();
            //Memorisation des offsets curseur / _crn_overlay
            _offsets.X = e1.clientX - _crnBox.left;
            _offsets.Y = e1.clientY - _crnBox.top;
            _offsets.nX = _crnBox.right - e1.clientX;
            _offsets.nY = _crnBox.bottom - e1.clientY;
            _moveEl = true;
        }

        this.reset = function(){
            getId('WME_CRN_DialogBoxBottom').style.cursor = 'default';
            _offsets.X = null;
            _offsets.nX = null;
            _offsets.Y = null;
            _offsets.nY = null;
            getId('WME_CRN_DialogBox').style.left = _left;
            getId('WME_CRN_DialogBox').style.top = _top;
            _moveEl = false;
            saveLocalStorage();
        }

        this.resetPos = function(){
            getId('WME_CRN_DialogBox').style.left = "30px";
            getId('WME_CRN_DialogBox').style.top = "50px";
            saveLocalStorage();
        }

        this.moveEl = function(e2){
            if(_moveEl){
                _left = e2.clientX - _offsets.X - _mapBox.left;
                _top = e2.clientY - _offsets.Y - _mapBox.top;
                if(_left <= 0)_left = 0;
                else if((e2.clientX + _offsets.nX) >= _mapBox.right)_left = _mapBox.width - _crnBox.width;
                if(_top <= 0)_top = 0;
                else if((e2.clientY + _offsets.nY) >= _mapBox.bottom)_top = _mapBox.height - _crnBox.height;
                getId('WME_CRN_DialogBox').style.left = parseInt(_left) + 'px';
                getId('WME_CRN_DialogBox').style.top = parseInt(_top) + 'px';
            }
        }
    }

    function getId(node){
        if(node != '')return document.getElementById(node);
        return false;
    }

    function restoreLocalStorage() {
        if(localStorage.CRN){
            var CRN_config = JSON.parse(localStorage.CRN);
            getId('WME_CRN_DialogBox').style.left= CRN_config.WME_CRN_DialogBoxLeft;
            getId('WME_CRN_DialogBox').style.top = CRN_config.WME_CRN_DialogBoxTop;
            getId('WME_CRN_enable').checked =      CRN_config.WME_CRN_enable;
            getId('WME_CRN_show_logs').checked =   CRN_config.WME_CRN_show_logs;
            getId('WME_CRN_CheckRoadName').checked=CRN_config.WME_CRN_CheckRoadName;
            getId('WME_CRN_TestRoadName').checked= CRN_config.WME_CRN_TestRoadName;
            getId('WME_CRN_TestPOIName').checked = CRN_config.WME_CRN_TestPOIName;
            getId('WME_CRN_TestAlternateRoadName').checked= CRN_config.WME_CRN_TestAlternateRoadName;
            getId('WME_CRN_TestAlternatePOIName').checked = CRN_config.WME_CRN_TestAlternatePOIName;
            getId('WME_CRN_TestAlternatePOIName').checked = 0; //inibit Test alternate name for POI
            manage_WME_CRN ();
        }
    }

    function saveLocalStorage() {
        var CRN_config = {};
        CRN_config.WME_CRN_DialogBoxLeft=getId('WME_CRN_DialogBox').style.left;
        CRN_config.WME_CRN_DialogBoxTop= getId('WME_CRN_DialogBox').style.top;
        CRN_config.WME_CRN_enable      = getId('WME_CRN_enable').checked;
        CRN_config.WME_CRN_show_logs   = getId('WME_CRN_show_logs').checked;
        CRN_config.WME_CRN_CheckRoadName=getId('WME_CRN_CheckRoadName').checked;
        CRN_config.WME_CRN_TestRoadName= getId('WME_CRN_TestRoadName').checked;
        CRN_config.WME_CRN_TestPOIName = getId('WME_CRN_TestPOIName').checked;
        CRN_config.WME_CRN_TestAlternateRoadName= getId('WME_CRN_TestAlternateRoadName').checked;
        CRN_config.WME_CRN_TestAlternatePOIName = getId('WME_CRN_TestAlternatePOIName').checked;
        localStorage.CRN = JSON.stringify(CRN_config);
    }

}

CRN_bootstrap();
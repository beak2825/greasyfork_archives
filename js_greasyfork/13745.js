
// ==UserScript==
// @name OIS_for_Iron_20
// @namespace  escaria
// @description Statistik anderer Inseln und KB Saver
// @include http://elysium.escaria.com/world/client*
// @require http://code.jquery.com/jquery-1.11.1.min.js
// @require http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @resource http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @version 5.4
// @downloadURL https://update.greasyfork.org/scripts/13745/OIS_for_Iron_20.user.js
// @updateURL https://update.greasyfork.org/scripts/13745/OIS_for_Iron_20.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}



initialized = false;

Release = '';
Browser = '';
World = '';


////// image-list
var IMG_Kbsaver = 'data:image/png;base64,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';
var IMG_Database = 'data:image/png;base64,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';
var IMG_Kbwrite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAEkElEQVR42p2UeUyTZxzH30KF4YVYO5OJx+Z0Mic7oqIy2cYUJTJYhuhgdcGDw2OGiUWig3EptHUcihQUOdtyDLlGtcoVAeUQlMM6DyxQWqBQ6DTAsLR899SwRInsj32Sb94/3uf5PL/npKaDYW5hZmfvuMjVnWXp6PzdcnuHHYvmzpzNIL9ok01mrVhhtWTzZtu1pqamFm+UrFlubuHgtCtlj+eBSj92wGAo79ygf2j0yCkOX3P0ZORDMkC2tfXH3EyB6HbVTbG6qalcGxT0SwmNRps91bXUbotT+dk4Ljoe38RARw2kdQKUFScgV3QBB3w8EcU9i4mJCbwYe4rh5/cxMDCgs7S0PEhNxY3lNRrDjwe09VDL6zA+rkdvTzdaGquREBuK69dKoNONob+vCs80zejo7ASTuTBwqsfI2+ewmHdJBEFWKjB6H49bypGYmIjdu3fB2cUFCmUPgDH0KSsxqK7D2NgY9u331pO+q18zvc1gbP85KEoXdC4ddTWFUHdVoZlU4+7hDhsbG7S3P4VO/zfUqnr09ZSR6nRIS0uF77GTWGX1keQ1maub+09+wTz9+Yw8KNpLcbdKhLLS6/Dy8kJ+QT6GhvqhGWyFUi6GVqvG8PAIOGF++C06BDs9vOSvumiH/U8knBMUISCci796aiHJ5SKKw8WdxkZonqmgHmiDsvMqNJoWGBBlCVGcxUFaagyCY1JGicPypWmTrd0Sv8DQvqjkXCSlZWC4vwExkSdQXCIBgSxyBbpkJVAqbmBc/wJdcgUC2YfQ0ZyNcF4UuJdyJhy+cTtNVG9RGz//ahM7PBrJV0qRmpmCUVUtnLasR0ubFINkah3tJeh4mocXWtXLRRcKhchKjYRGXglOPB/pVyRwcvvxj3nm5suotRs22rJ8/PRRF3NQXZYBaUM2Qtnfo6KyAPJOCRTya1CRatWDKiiVSpwJC4T8UTl6ZdXg8lPgHxGHT9dtKli2csX7FGOe+cr9h46pfQJC0PMoH7LWAkRHeEMo4JKzVIORkTvQ6kfQ1S2HIDMNv7JZeNBUCPmTUrDDeIhPyZ2wmM+MZTKZ8yjC7PV2jjVx5znA81JkXQ6Fs9N2PH/Wj5zsYESeOQHfAx7Yy3KBOOcM5K0CDHXfxL1bAly4LMTeg8e1xOFMTWJiTDfJ/nrrNjTVFiLwuC85UxPIEgnAPvoDkuPYqL3BR40kAX/Wp0PWeBGKh2LcLkuGp/cRmFswDLJPqFewoxkZq7c5fou799rwQCpFxKl9qCtPRUVxPB7UC/GkRYzHzVehar8KGdnJpIQ4vLv8A5C+PPqMGUbUFLaus16gH3oSi81f2CPxAge/i5JwvZBPKkuClAilDXlISeKB5bkf6zZ8CSMjo0RqGub7uS3W7lhvDMbCxThENiStqALldc0oKqsmC52BkIhwWK35DDNnzTVU1ECyZDqZ1eqlc3rJ15/kFglWfmgNV8/D2HuEjR0uO2HBWGCQ9JB34bThSlPTMceMbpi32b9XjGTP5Oj9JBoSGcl5Gp3+DvX/MJ5LXtD3iHsV3cSESZma0v+r9T88Uc8JBP2JrwAAAABJRU5ErkJggg==';
//var IMG_Overview = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAEEElEQVR42p2Uf0zUZRzHuTt/pIBSreayKcamsZysclqRUWk4RddSVjQ0UAnzBwRTjg4FPAUmCiF6SgjyM26MphggCQJ6IAh4HNwP7ji8u1ATKRVcblrx49XT/dGolWbv7f189uz7eV6f5/k+P1wepSfd3bxEmDnjmacXiOgpPNHlcbVs+cqUjeFbLyUfyqVRayC9oJzskgrCt8cM+fotK3Wf5jHrv3Amvue/Ik+ecgSlqogNn4YRn3yQDZE7OayuorpJyx7V1+xNU90WuQseBpJsjogZDI1KoL5YQUGWgh2KeDaGriNulxzTuQMiRhMSIScyLp7VgR/jOXvOjH8k+b39bnxsUsbYxdo0Nm6LIK+8hk6rjb77o/wG3B8b49QJJccLs2k3tlPVUE1SanqvGOr2d5brpi1R1BXIKVTnMzQ8yjBwY3iMgVG4NzbC3ZEHnNU0Ul2aSEPzWUw2Ix+GhOPj8+oHf52V3zueyoMquhoPc0GnZwy4M/wr9p8f0HPnHtaf7tJmMVNQfob6U0osji50+gts2BzGwsVLjv0JAqTB60N892TmsntnCIeP5zMK9A0NkaUuo6xWQ6WmiYqL7Rw4mk1rTQatHefRGZtRq7NYExxmHw97KiJafmuLIpkrzYc4kqdmYGiQTpuNE2UnKf2ujtMNTdR3dmMU3+VxUTS2a7jQep5r/XpURSd57vkXljphJcVFr2yNSaCwooGdkaEUHounqrYOg91GfWsLZzQacvJUWLU5fKVKoe5SI1pDM82X6/jhzlUUicn4rQiMdsKUe5Veaz5ahzz1KKU1LWL7FWx735uM3SFUiyPybX4s50riyMv9Esv177nc3YHBZsBg1dF7zYwiKR3Xqa4RTlhAwCrXhYsWX03OKqaisYO06EBqM8OJTUxg6XJ/Fr3xOkZ7D5Yb17EO3KTNbEDXa6bDrMXW7yBm1z4EZrUTBkhmz/FKj0pIpeR0DRVpm6jL2kGm6ghdPZeFO+jqNWHqH8A8cIvWnh7aLSZ0VyxoBXTJ0lUIjIfLOH3mPd+H4DX+9Fcpqaw4TWtbO3fv30Zv1Ql3iA0xY+2/ht5hRytm12LUE/xJGDLZhOti/KTxsGeFO2ND/dm/+3N01qs0NLUAYLZ3YXbocPTb6fvRgclhxuiwoNyXyqTJU4YlEmmQy3i9NnemRCJxAgdXrg0m80QJlTX1APT0mbDfMHNz0E6nuY2svBzWBq1nnvd8/rjO/3bPJaIJF/5lmocH22MT2Z+RgcmmR9fdgvqbAr5I3MeLL72MyEFU1ziX9wgtEq6WyiaMuLlPJyAojM3RCnzffIspU90QRR3CWx/noZQK+4rqnSKOSKUy8X+eGJRIZArRn+LyPzVRKpXOkkhl86SyydMflvg7M2+hazuvFIEAAAAASUVORK5CYII=';

var GLOBAL_Server = window.location.href.match(/http:\/\/(.+).escaria.com.+/)[1];
var GLOBAL_Username = '';
var GLOBAL_Tribe = '';

///////////////////////////// Allgemeine Funktionen //////////////////////////////////////////////

function getEl(Wert, parent){
    return document.evaluate(
        Wert,
        parent ? parent : document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
}

function gid(Wert){
    return document.getElementById(Wert);
}

function appendElement(eT, eP, attr, style){
    var e=document.createElement(eT), i;
    var css = '';
    for (var i in style)
        css += i + ':' + style[i] + ";";
    if(css)
        e.style.cssText=css;
    if(attr)
        for(i in attr)
            e[i] = attr[i];
    if(eP)
        eP.appendChild(e);
    return e;
}

function insertElementBefore(eT, eP, attr, style){
    var e = document.createElement(eT);
    var css = '';
    for (var i in style)
        css += i + ':' + style[i] + ";";
    if (css)
        e.style.cssText = css;
    if (attr)
        for (var i in attr)
            e[i] = attr[i];
    if (eP)
        eP.parentNode.insertBefore(e, eP);
    return e;
}

function removeElement(e){
    if (e) e.parentNode.removeChild(e);
}

function addDialogPanelButton(eT, attr, style)
{
    var Els = getEl("//div[@id='dialogPanel']//div[@class='additionalContent']");
    var div = appendElement(eT, Els.snapshotItem(0), attr, style);
//    div.addEventListener('click', buttonPress, false);

    return div;
}

function arrayIsEmpty(array)
{
    for (var element in array) {
        return false;
    }

    return true;
}

function blockElement(el){
  if(el){
    el.style.display = '';
  }
}

function noneElement(el){
  if(el){
    el.style.display = 'none';
  }
}

function addGlobalStyle(css){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.OIS_additionalContent { z-index:500;}');
addGlobalStyle('.CenterV {position: absolute; top: 50%; -webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);transform: translateY(-50%);}');
//addGlobalStyle('.CenterVtable {position: relative; top: 50%; -webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);transform: translateY(-50%);}');
addGlobalStyle('.CenterH {position:relative; margin-left:auto; margin-right:auto;}');//left: 50%; transform: translateX(-50%);

addGlobalStyle('.statusbar_box{'+
                'width: 100%;'+
                'height: 15px;'+	
                'position: relative;'+
                'border-style: solid;'+
                'border-width: 1px;'+
                'border-color: #000000;'+
                'z-index: 1;}');
              
addGlobalStyle('.statusbar_bar{'+
                'position: absolute;'+
                'width: 0%;'+
                'height: 100%;'+
                'border-style: solid;'+
                'border-width: 0px;'+ 
                'background-color: #0000ff;'+
                'z-index: 2;}');

addGlobalStyle('.statusbar_text{'+
                'position: relative;'+
                'width: 100%;'+
                'height: 100%;'+
                'line-height: 15px;'+ /*wie statusbar_box.height*/
                'text-align: center;'+
                'font-size: 18px;'+
                'color: #000000;'+
                'font-family: calibri;'+
                'font-weight: bold;'+
                'border-style: solid;'+
                'border-width: 0px;'+ 
                'z-index: 3;}');

addGlobalStyle('.select{'+
                'position: relative;'+
                'width: 300;'+
                'height: 95%;}');
///////////////////////////////////////////////////////////////////////////////
addGlobalStyle('.Dropdown.ownkb{'+
               'background-color: #D4D4D4;'+ 
               'font-size: 12px;'+
               'font-weight: normal;'+
               'color: #000000;'+
               'width: 100%;'+
               'padding-left: 2px;'+ 
               'position: relative;}');
addGlobalStyle('.Dropdown.ownkb:hover {'+
    'font-weight: bold;'+
    '}');

addGlobalStyle('.Dropdown.otherkb{'+
               'background-color: #818181;'+ 
               'font-size: 12px;'+ 
               'font-weight: normal;'+
               'color: #ffffff;'+
               'width: 100%;'+
               'padding-left: 2px;'+ 
               'position: relative;}');
addGlobalStyle('.Dropdown.otherkb:hover {'+
    'font-weight: bold;'+
    '}');

addGlobalStyle('.SelectOtherIslandKbDropdown{'+
               'width: 100%;'+
               'top: 22px;'+
               'left: -1px;'+
               'z-index: 20;'+
               'position: absolute;}');

addGlobalStyle('.SelectOtherIslandKb{'+
               'width: 300px;'+ 
               'float: left;'+ 
               'position: relative;}');
             
addGlobalStyle('.SelectOtherIslandKbButton{'+
               'width: 17px;'+ 
               'height: 19px;'+
               'left: 304px;'+
               'border: solid 1px darkgrey;'+
               'background-color: #ffffff;'+ 
               'position: absolute;}'); 
         
addGlobalStyle('.SelectOtherIslandKb:focus {'+
    'outline: none'+
    '}');
addGlobalStyle('.SelectOtherIslandButton:focus {'+
    'outline: none'+
    '}');

addGlobalStyle('.SelectOtherIslandKbWrapper {'+
    'position: absolute;'+
    'top: 10px;'+
    '}');
  
addGlobalStyle('.SelectOtherIslandKbWrapperContent{'+
    'border: solid blue 1px;'+
    'position: absolute;'+
    'top: -8px;'+
    'width: 323px;'+
    '}');
////////////////////////////////////////////////////////////////////////////////
  
addGlobalStyle('.mainpanel {'+
    'width: 100%;'+
//    'background-color:#DFC037;'+    
    '}');
    
addGlobalStyle('.leftpanel {'+
    'width: 70%;'+
//    'background-color:#DFC037;'+
    '}');
    
addGlobalStyle('.rightpanel {'+
    'width: 30%;'+
//    'background-color:#DEB709;'+
    '}');
    
addGlobalStyle('div.KbMainContentWrapper {'+
    'font-size: 10pt;'+
    '}');
    
addGlobalStyle('div.islandname {'+
    'float: left;'+
    'border-radius: 50%;'+
    '}');
    
addGlobalStyle('div.datetime {'+
    'border-radius: 50%;'+
    'float: right;'+
    '}');
    
addGlobalStyle('textarea.kbtextarea {'+
  'width: 260px;'+
  'max-width: 260px;'+
  'height: 160px;'+
  'max-height: 160px;'+
  'font-size: 8pt;'+
  'border-width: 0px;'+
  '}');

addGlobalStyle('textarea.kbnotepad {'+
  'width: 260px;'+
  'max-width: 260px;'+
  'height: 150px;'+
  'max-height: 300px;'+
  'font-size: 8pt;'+
  '}');

addGlobalStyle('select.selectxl {'+
//  'width: 350px;'+
  'height: 21px;'+
  'font-size: 8pt;'+
  '}');

addGlobalStyle('input.selectsm {'+
//  'width: 350px;'+
  'height: 14px;'+
  'font-size: 8pt;'+
  '}'); // selectxl





//addGlobalStyle('table.table.kboutputdatetime {'+
////  'position: relative;'+
//  'margin-left: auto;'+
//  'margin-right: auto;'+
//  '}');
//addGlobalStyle('table.table.kboutputdatetime {'+
////  'position: relative;'+
//  'margin-left: auto;'+
//  'margin-right: auto;'+
//  '}');

//addGlobalStyle('div.LogBookMessageBody {'+
////  'position: relative;'+
//  'margin-bottom: 30px;'+
//  'margin-left: auto;'+
//  'margin-right: auto;'+
//  '}');
//addGlobalStyle('.table.scanpanel {'+
//  'position: relative;'+
//  'margin-left: auto;'+
//  'margin-right: auto;'+
//  '}');
  

//addGlobalStyle('#kboutputcontent tbody tr td div div.LogBookMessageBody {'+
//    'width: 100%'+
////    'display: block'+
//    '}');
//
//addGlobalStyle('#kboutputcontent tbody tr td div div.LogBookMessageBody table {'+
//    'position: relative;'+
//    'width: 100%;'+
//    'margin-left: auto;'+
//    'margin-right: auto;'+
//    '}');
//
//addGlobalStyle('#kboutputcontent > tbody > tr > td > div > div.LogBookMessageBody table tbody tr td {'+
//    'width: 50%;'+
//    'border: solid black 1px;'+
//    '}');
//  
//addGlobalStyle('table.table.kboutputdatetime {'+
//    'width: 100%;'+
//    'border: solid black 1px;'+
//    'font-weight: bold;'+
//    '}');
//
//addGlobalStyle('.table.kboutputdatetime tbody tr td {'+
//    'width: 50%;'+
//    '}');
//
//addGlobalStyle('.table.kboutputdatetime tbody tr td:nth-child(1) div {'+
//    'float: left;'+
//    '}');
//  
//addGlobalStyle('.table.kboutputdatetime tbody tr td:nth-child(2) div {'+
//    'float: right;'+
//    '}');

// #scanPanelLeft table tbody tr:nth-child(1) td table tbody tr td

/////////////////////////////Datenbank///////////////////////////////////////////////////////////////////////////////

var tribe = [
    {"romans": [{"19": "romans_start_0.png); background-position: 0px 0px"}]},
    {"vikings": [{"19": "buildings_vikings_0.png); background-position: 0px -330px"}]},
    {"aztecs": [{"19": "buildings_aztecs_0.png); background-position: -552px -920px"}]}
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.toLowerCase().indexOf('opera')!=-1)
{
    move = appendElement('div', document.body, {id:'OIS_moveVars'}, 'display:none'),
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("OIS_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["clientAssetsBasePath"];'});
    Release = gid('OIS_moveVars').textContent;
    document.body.removeChild(script);
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("OIS_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["worldUsername"];'});
    GLOBAL_Username = gid('OIS_moveVars').textContent;
    document.body.removeChild(script);
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("OIS_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["tribe"];'});
    GLOBAL_Tribe = gid('OIS_moveVars').textContent;
    document.body.removeChild(script);
    document.body.removeChild(move);

    if(navigator.userAgent.toLowerCase().indexOf('opera')>-1) {
        Browser = 'opera';
    } else {
        Browser = 'chrome';
    }
}
else
{
    Browser = 'ff';
    Release = unsafeWindow.___stdlib_fastcall____startupConfiguration___.clientAssetsBasePath;
    GLOBAL_Username = unsafeWindow.___stdlib_fastcall____startupConfiguration___.worldUsername;
    GLOBAL_Tribe = unsafeWindow.___stdlib_fastcall____startupConfiguration___.tribe;
}

var firstRun = false;
var runs = 0;

waitingId01 = setInterval(function ()
{
    runs++;

    if (firstRun == true)
    {
        if (gid('logbook') != null && gid('island') != null)
        {
            if (initialized == false)
            {
                clearInterval(waitingId01);

                var worldRegExp = /http:\/\/static.(\w+).escaria.com\//;
                worldRegExp.exec(Release);
                World = RegExp.$1;
				
				

//                loadjscssfile('http://code.jquery.com/jquery-1.11.1.min.js', 'js');
//                loadjscssfile('http://code.jquery.com/ui/1.11.4/jquery-ui.js', 'js');
                loadjscssfile('http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css', 'css');
//                
                
                
                
                loadjscssfile('http://www.gpunktprojekt.de/ois/fusionchart/themes/fusioncharts.theme.fint.js', 'js');
                loadjscssfile('http://www.gpunktprojekt.de/ois/fusionchart/fusioncharts.js', 'js');
                
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/legacy.js', 'js');
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/picker.js', 'js');
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/picker.time.js', 'js');
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/picker.date.js', 'js');
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/themes/default.css', 'css');
//                loadjscssfile('http://www.gpunktprojekt.de/ois/pickadate.js-3.5.6/lib/themes/default.date.css', 'css');
                
                
                
                
                var user = {};
                    user.name = GLOBAL_Username;
                    user.pass = '';
                    user.islandId = unsafeWindow.___stdlib_fastcall____startupConfiguration___.islandId;
                    user.world = World;
                    
                var pos = {};
                    pos.left = (screen.availWidth - 300) / 2;
                    pos.top = (screen.availHeight - 100) / 2;
                
                
                window.addEventListener('hashchange', function(){
                  changeHash(user,pos);
                }, false);
                
                window.addEventListener("beforeunload", function(){
                  resetStatus(user);
                }, false);

                gid('seamapRingMenu').onmouseup = function(objEvt){
                    var objEvt = (window.event)? window.event: objEvt;
                    var objSrc = (objEvt.target)? objEvt.target : objEvt.srcElement;
                    if(!objSrc.parentNode.id){
                        if(!objSrc.parentNode.parentNode.parentNode.id){
//                            console.log('--- STAGE 03 ---- Nothing ---');
                        }else{
//                            console.log('--- STAGE 02 ---- Gratis&Perlen Spy ---');
                            var id = objSrc.parentNode.parentNode.parentNode.id;
                            var regexObj = /menu_item_lookAt.+/;
                            var bool = regexObj.test(id);
                            
                            if(bool){
                                var html = objSrc.parentNode.parentNode.parentNode.previousSibling.firstChild.firstChild.children[1].innerHTML;
                                var regexObj = /\[.+\](.+)\sb/;
                                regexObj.exec(html);
                                
                                user.spy = RegExp.$1;
//                                console.log('Spy auf -> ' + RegExp.$1);
                            }
                        }
                    }else{
//                        console.log('--- STAGE 01 ---- Gilden Spy ---');
                        var id = objSrc.parentNode.id;
                        var regexObj = /menu_item_lookAt.+/;
                        var bool = regexObj.test(id);
                        
                        if(bool){
                            var html = objSrc.parentNode.previousSibling.firstChild.firstChild.children[1].innerHTML;
                            var regexObj = /\[.+\](.+)\sb/;
                            regexObj.exec(html);
                            
                            user.spy = RegExp.$1;
                            console.log('Spy auf -> '+RegExp.$1);
                        }
                    }
                };
                
                
                if(gid('game').className === 'seamap'){
                  addDialogPanelButton('div', {
                    'className': 'clickable',
                    'id': 'OIS_Datenbank',
                    'title': 'OIS-Datenbank'
                  }, {
                      'position': 'relative',
                      'background-image': 'url('+IMG_Database+')',
                      'width': '50px',
                      'height': '59px'
                  });
                  gid('OIS_Datenbank').addEventListener('mouseup', function(){
                    user.window = 'db';
                    getLoginStatus(user,pos);
                  }, false);
                  
                  
                  addDialogPanelButton('div', {
                    'className': 'clickable',
                    'id': 'OIS_Kbsaver',
                    'title': 'OIS-Kbsaver'
                  }, {
                      'position': 'relative',
                      'background-image': 'url('+IMG_Kbsaver+')',
                      'width': '50px',
                      'height': '54px'
                  });
                  gid('OIS_Kbsaver').addEventListener('mouseup', function(){
                    user.window = 'kb';
                    getLoginStatus(user,pos);
                  }, false);
                }
                
                
                if(gid('game').className === 'logbook'){
                  getLoginStatus(user,pos);
                }
                
                initAttObserve();
                
                initialized == true;
                console.log("INIT: OIS");
            }
        }
    }

    firstRun = true;
}, 2000);
/////////////////////////////Allgemein//////////////////////////////////////////
function sO(str, obj){
  console.log(str+'->');
  console.log(obj);
}

function initAttObserve(cnt){
  // zu überwachende Zielnode (target) auswählen
  var target = getEl("//*[@id='game']/table/tbody/tr/td/div[@class='clickable' and contains(@title, 'Eingehende Angriffe')]").snapshotItem(0);

  // eine Instanz des Observers erzeugen
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      console.log(mutation.type);
      if(mutation.target.style.display !== 'none'){
        if(gid('OIS_Output')){
          gid('OIS_Alarm').style.backgroundColor = 'red';
          playSound();
        }
        
      }else{
        if(gid('OIS_Output')){
          gid('OIS_Alarm').style.backgroundColor = 'green';
        }
      }
    });    
  });

  // Konfiguration des Observers: alles melden - Änderungen an Daten, Kindelementen und Attributen
  var config = { attributes: true };

  // eigentliche Observierung starten und Zielnode und Konfiguration übergeben
  observer.observe(target, config);
}


function setAttStatus(){
  var target = getEl("//*[@id='game']/table/tbody/tr/td/div[@class='clickable' and contains(@title, 'Eingehende Angriffe')]").snapshotItem(0);
  if(target.style.display !== 'none'){
    gid('OIS_Alarm').style.backgroundColor = 'red';
  }
}


function playSound(){
console.log('play sound');

gid('OIS_Alarm').innerHTML='<embed src="http://www.gpunktprojekt.de/ois/audio/Alarm.mp3" hidden="true" autostart="true" loop="false" name="musik">';

//  var soundfile = "http://gpunktprojekt.de/ois/audio/Alarm.mp3";
//  var sound_id = "game";
//  var sound_message = '<';
//      sound_message +=  'embed src="' + soundfile + '" autostart="true" '+
//                        'loop="false" hidden="true" height="0" width="0"';
//      sound_message += ">";
//  document.getElementById(sound_id).innerHTML = sound_message;

}


function show_SoundMessage() {

}
////////////////////////////////////////////////////////////////////////////////
/**
 * stellt den aktuellen Prozentwert dar
 */
var percentValue = 0;
/**
 * Die Beschreibung, welche vor der Prozentzahl in den Balkengeschrieben wird.
 */
var description = "";
/**
 * setzt den ersten aufruf der Statusbar. Wichtig da die globale Variable
 * percentValue damit gesetzt wird.
 * @param value: mit welchen Wert in % soll angefangen werden.
 */
function main(value)
{
	setPercent(value);
}
/**
 * setzt die Beschreibung welche in die Statuszeile vor den Prozentwert geschrieben wird.
 * @param value: Statusbeschreibung
 */
function setDescription(value)
{
	description = value;
}
/**
 * Gibt den akutellen Prozentwert der Statuszeile zurück.
 * @return: akuteller Prozentwert
 */
function getPercent()
{
	return percentValue;
}

/**
 * rechnet Prameter value auf die bestehende Prozentzahl drauf oder ab.
 * @param value: Wert der auf den Prozentbalken addiert werden soll,
 * 		es können auch negative Werte übergeben werden.
 */
function addPercent(value)
{
	//akutellen Prozentsatz ausrechnen
	var p = percentValue;
	p += value;
	//nicht über 100 und unter 0
	if (p>100) {p=100;}
	if (p<0) {p=0;}
	//globalen merker schreiben
	percentValue = p;
	//Textanzeigen
	setPercentText(p);
	//setzen
	document.all.statusbar_bar.style.width = parseInt(p)+'%';
}

/**
 * Setzt den Prozenttext.
 * @param value: Prozentwert als Integer
 */
function setPercentText(value)
{
	statusbar_text.innerHTML = description + " " + parseInt(value)+" %";
}

/**
 * setzt einen absoluten Wert in die Statusbar.
 * @param value: Prozentwert (0 bis 100)
 */
function setPercent(value)
{
	//nicht über 100 und unter 0
	if (value>100) {value=100;}
	if (value<0) {value=0;}
	//globalen merker schreiben
	percentValue = value;
	//Textanzeigen
	setPercentText(value);
	//Prozentwert setzen mit Prozentzeichen
	document.all.statusbar_bar.style.width = parseInt(value)+'%';
}


///////////////////////////////LOGIN////////////////////////////////////////////
function changeHash(user,pos){
  if(gid('game').className === 'otherIsland'){
    gid('gwt-uid-93').setAttribute("style", "display: none");
    user.window = 'oi';
    getLoginStatus(user,pos);
  }else{
    noneElement(gid('OIS_Output'));
    removeElement(gid('OIS_Login'));
    removeElement(gid('PanelOpen'));
    removeElement(gid('ScanButton'));
    removeElement(gid('RightNavBar'));
    
    resetStatus(user);
    gid('gwt-uid-93').style.display = "block";
  }
  
  if(gid('game').className === 'seamap'){
    removeElement(gid('OIS_Datenbank'));
    removeElement(gid('OIS_Kbsaver'));
    noneElement(gid('OIS_Output'));
    
    resetStatus(user);


    addDialogPanelButton('div', {
      'className': 'clickable',
      'id': 'OIS_Datenbank',
      'title': 'OIS-Datenbank'
    }, {
      'position': 'relative',
      'background-image': 'url('+IMG_Database+')',
      'width': '50px',
      'height': '59px'
    });
    gid('OIS_Datenbank').addEventListener('mouseup', function(){
      user.window = 'db';
      getLoginStatus(user,pos);
    }, false);
    
    
    addDialogPanelButton('div', {
        'className': 'clickable',
        'id': 'OIS_Kbsaver',
        'title': 'OIS-Kbsaver'
      }, {
        'position': 'relative',
        'background-image': 'url('+IMG_Kbsaver+')',
        'width': '50px',
        'height': '54px'
      });
      gid('OIS_Kbsaver').addEventListener('mouseup', function(){
        user.window = 'kb';
        getLoginStatus(user,pos);
      }, false);
    
  }else{
    removeElement(gid('OIS_Datenbank'));
    removeElement(gid('OIS_Kbsaver'));
  }
  
  
  if(gid('game').className === 'logbook'){
    getLoginStatus(user,pos);
  }else{
    deleteLogbookSaveButton();
  }
}


function deleteLogbookSaveButton(){
  var el = getEl("//*[@id='gwt-uid-85framedDecoPanel']/div/table/tbody/tr/td/button[@class='OIS_SaveKb']");
    for(var i = 0; i < el.snapshotLength; ++i){
      removeElement(el.snapshotItem(i));
    }
}


function initButtonSaveKb(){
  
  var firstRun = false;
  waitingID = setInterval(function (){
    if (firstRun == true){
      var el = getEl("//*[@id='gwt-uid-85framedDecoPanel']/div/table[@class='logbooktable']");
      if (el.snapshotItem(i) != null){
        if (initialized == false){
          clearInterval(waitingID);
          
          deleteLogbookSaveButton();
          
          var el = getEl("//*[@id='gwt-uid-85framedDecoPanel']/div/table/tbody/tr/td/div/div/div[@class='gwt-Label inline LogBookMessageUnfold']");
          for(var i = 0; i < el.snapshotLength; ++i){
            if(el.snapshotItem(i).innerHTML === ' wurde von dir besiegt' || el.snapshotItem(i).innerHTML === ' hat dich besiegt'){
//              console.log('Name->' + el.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.children[1].outerHTML);
              var snap = el.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.children[1];
              var button = appendElement('button',snap,{'className':'OIS_SaveKb','type':'button'});
                  button.innerHTML = 'S';
                  button.addEventListener('mouseup',function(e){
                    getKb(e);
                  },false);
            }
          }
          
          initMoreButton();
          initMenuItemCombat();
          
          initialized == true;
        }
      }
    }
    firstRun = true; 
  },1000);
}


function initMenuItemCombat(){
  gid('menu_item_combat').addEventListener('mouseup', function(){
    initButtonSaveKb();
  },false);
}


function initMoreButton(){
  var el = getEl("//*[@id='gwt-uid-85framedDecoPanel']/button[@class='logbookMoreButton']").snapshotItem(0);
  el.addEventListener('mouseup',function(){
    initButtonSaveKb();
  },false);
}


function getKb(e){
  var el = (window.event)? window.event: e;
  var eSrc = (el.target)? el.target : el.srcElement;
  var html = eSrc.parentNode.parentNode;
  
  var obj = {};
      obj.user = GLOBAL_Username;
      obj.datetime = html.children[2].firstChild.innerHTML;
      obj.island = html.children[3].firstChild.firstChild.firstChild.innerHTML;
      obj.html = html.children[3].firstChild.outerHTML;
      insertKb(obj);
}


function clickSubBnt(user){
  user.pass = gid('PassBox').value;
  getLoginStatus(user);
  user.pass = '';
}


function createDataset(user){
  var data = countBuilding(user);
  InsertData(data);
   
}


function countBuilding(user){
  var arr = [];
  var data = JSON.parse(user.data);
  
  var json = '{';
  
  for(var a in data){
    var dat = data[a];
    
    var lvl01 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, '" +dat.img0+ "')]");
    var lvl07 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, '" +dat.img1+ "')]");
    var lvl19 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, '" +dat.img2+ "')]");
    
    json += '"'+dat.building+'":{"'+dat.product+'":{"L01":"'+lvl01.snapshotLength+'","L02":"'+lvl07.snapshotLength+'","L03":"'+lvl19.snapshotLength+'"}},';

  }; Jstr = json.substr(0, json.length-1); Jstr += '}';
  
  user.Jstr = Jstr;
  return user;
}


function getTribe(user){
  
  var Els01 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, 'romans_start_0.png); background-position: 0px 0px')]");
    if(Els01.snapshotLength >= 1){
      user.tribeName = 'romans';
      return user;
    }

  var Els02 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, 'buildings_vikings_0.png); background-position: 0px -330px')]");
    if(Els02.snapshotLength >= 1){
      user.tribeName = 'vikings';
      return user;
    }

  var Els03 = getEl("//div[@id='otherIsland']/div[@class='contentPanel']/div[@class='extendedHTML' and contains(@style, 'buildings_aztecs_0.png); background-position: -552px -920px')]");
    if(Els03.snapshotLength >= 1){
      user.tribeName = 'aztecs';
      return user;
    }
}


function  isKbSelectOptionValueEmpty(user){
  var user = {};
  
  if(gid('SelectOtherIslandKbDropdown')){
    if(gid('SelectOtherIslandKb').options[gid('SelectOtherIslandKb').selectedIndex].value === '' && gid('game').className === 'seamap'){
    }else{
      user.select = gid('SelectOtherIslandKb').options[gid('SelectOtherIslandKb').selectedIndex].value;
    }
  }
  
  return user;
}


function  isSelectOptionValueEmpty(user){
  if(gid('SelectOtherIsland')){
    if(gid('SelectOtherIsland').options[gid('SelectOtherIsland').selectedIndex].value === '' && gid('game').className === 'seamap'){
      user.flag = false;
      if(user.window === 'db'){
        user.tribeName = null;
      }

    }else{
      user.flag = true;
      user.select = gid('SelectOtherIsland').options[gid('SelectOtherIsland').selectedIndex].value;
      if(user.window === 'db'){
        user.tribeName = null;
      }
    }
  }
  
  return user;
}


function clickScreenPanelCloseButtonOtherIsland(){
  gid('OIS_Output').style.display = 'none';
}


function clickScreenPanelCloseButtonSeamap(){
  gid('OIS_Output').style.display = 'none';
  removeElement(gid('RightNavBar'));
        
  blockElement(gid('infoPanel'));
  blockElement(gid('minimapPanel'));
  blockElement(gid('islandViewOptions'));
  blockElement(gid('additionalControlsgwt-uid-24'));
  blockElement(gid('seaMapOptionMenu'));
  blockElement(gid('gwt-uid-92'));
  blockElement(gid('chatPanel'));
  blockElement(gid('resourcePanel').firstChild);
  blockElement(gid('seamap').children[2]);
  blockElement(getEl("//*[@id='game']/table[@class='statusPanel']").snapshotItem(0));
  blockElement(getEl("//*[@id='seamap']/div[@class='smallBoxWrapper navigationMenu']").snapshotItem(0));

}


function SpeculativeClass(user){
  
  var user = user;
  
  function setListeners(){
      var path = "//*[@id='ErrorLog']/table/tbody/tr/td/table/tbody/tr/td/div/select[@class='select_"+user.query+"']";
      var el = getEl(path);
      for(var i=0;i<el.snapshotLength;++i){
          el.snapshotItem(i).addEventListener('change',function(){
          ComputeSizeUnits(user);
        }, false);
      }
  }
  
  
  function ComputeSizeUnits(user){
    
    var size = 0;
      var path = "//*[@id='ErrorLog']/table/tbody/tr/td/table/tbody/tr/td/div/select[@class='select_"+user.query+"']";
      var el = getEl(path);

      for(var i=0;i<el.snapshotLength;++i){
        var val = parseInt(el.snapshotItem(i).options[el.snapshotItem(i).selectedIndex].value);
        var amo = parseInt(el.snapshotItem(i).parentNode.previousSibling.innerHTML);
        
        if(user.query === 'landunits'){
          size += val * amo * 50;
        }
        
        if(user.query === 'seaunits'){
          size += val * amo * 5;
        }
      }
      
    gid('unitsize').innerHTML = size;
  }
  
  this.getSize = function(){
    setListeners();
  };
}//class end


function cleanScreen(){
  noneElement(gid('infoPanel'));
  noneElement(gid('minimapPanel'));
  noneElement(gid('Ext_IslandButtonMenu'));
  noneElement(gid('islandViewOptions'));
  noneElement(gid('additionalControlsgwt-uid-24'));
  noneElement(gid('seaMapOptionMenu'));
  noneElement(gid('gwt-uid-92'));
  noneElement(gid('chatPanel'));
  noneElement(gid('resourcePanel').firstChild);
  noneElement(gid('seamap').children[2]);
  noneElement(getEl("//*[@id='game']/table[@class='statusPanel']").snapshotItem(0));
  noneElement(getEl("//*[@id='seamap']/div[@class='smallBoxWrapper navigationMenu']").snapshotItem(0));
}




//////////////////////////////////////REQUESTS//////////////////////////////////
function GetGraph(user){
  var gph = {};
      gph.myisland = user.name;
      gph.mytribe = GLOBAL_Tribe;
      gph.product = user.query;
      if(gid('game').className === 'seamap'){
        gph.otherisland = user.select;
      }
      if(gid('game').className === 'otherIsland'){
        gph.otherisland = user.spy;
      }
      
      
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/linegraphtest.php",
    data: JSON.stringify(gph),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      removeElement(gid('scanPanelRight').firstChild);
      var data = response.responseText;
      appendElement('div', gid('scanPanelRight'), {'id':'chart-container'}, {'height':'100%','width':'100%','display':'block'});

      FusionCharts.ready(function () {
        var amountChart = new FusionCharts({
          type: 'msstackedcolumn2d',
          renderAt: 'chart-container',
          width: '400',
          height: '600',
          dataFormat: 'json',
          dataSource: data
        });
        amountChart.render();
      });
    }
  });
}



function sendQuery(user){
  var json = JSON.stringify(user);

  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/selectdata3.php",
    data: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      
//      if(gid('ErrorLog')){
        removeElement(gid('scanPanelLeft').firstChild);
//        removeElement(gid('scanPanelRight').firstChild);
//      }
      
      var snapshot = appendElement('div', gid('scanPanelLeft'), {'id':'ErrorLog'}, {'display':'block'});
      snapshot.innerHTML = response.responseText;

      var result = new SpeculativeClass(user);
      result.getSize();
    }
  });
}



function GetOptionsForSeamapIslandSelect(json){
  var val = {};
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/islandselectoptions.php",
    data: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      
       gid('SelectOtherIsland').innerHTML = response.responseText;
       
       $('#SelectOtherIsland').change(function(){
         val.spy = $('#SelectOtherIsland').val();
         val.val = null;
         getOverview(val);
       });
    }
  });
}



function GetOptionsForSeamapKbSelect(user){
  
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/islandselectoptions1.php",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      gid('SelectOtherIslandKbDropdown').innerHTML = response.responseText;
       
      if(gid('SelectOtherIslandKb')){

       $('#SelectOtherIslandKbDropdown').hide();
       $('#SelectOtherIslandKb').focus();
       MYSELECT.initListener(user);
       MYSELECT.initDropdownListener(user);
      } 
    }
  });
}



function getSelectedKb(user){
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/getKB.php",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      removeElement(gid('scanPanelRight').firstChild);
      gid('scanPanelLeft').innerHTML = response.responseText;
      var el = getEl("//*[@id='kboutputcontent']/tbody/tr/td/div/div[@class='LogBookMessageBody']");
      for(var i = 0; i < el.snapshotLength; ++i){
        el.snapshotItem(i).style.display = 'block';
      }
       
      $('#kb_delete').click(function(){
        var send = {};
            send.value = $(this).attr('value');
            
        console.log(send);
        
        deleteOwnKB(send);
      });
    }
  });
}

function deleteOwnKB(val){
  console.log('BUTTON-VALUE');
  console.log(val);
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/deleteownkb.php",
    data: JSON.stringify(val),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      removeElement(gid('scanPanelLeft').firstChild);
      removeElement(gid('scanPanelRight').firstChild);
      var snapshot = appendElement('div', gid('scanPanelLeft'), {}, {});
      snapshot.innerHTML = response.responseText;
    }
  });
}

function getIslandData(user){
  var json = JSON.stringify(user);
  
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/selectdata2.php",
    data: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
//        if(gid('ErrorLog')){
            removeElement(gid('scanPanelLeft').firstChild);
//        }
        var snapshot = appendElement('div', gid('scanPanelLeft'), {'id':'ErrorLog'}, {'display':'block'});
        snapshot.innerHTML = response.responseText;
    }
  });
}



function  insertOtherIslandDataSet(user){
  var json = JSON.stringify(user);
  
  GM_xmlhttpRequest({
      method: "POST",
      url: "http://www.gpunktprojekt.de/ois/insertdata.php",
      data: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json"
      },
      onload: function(response) {

      }
  });
}



function InsertData(arr){
   GM_xmlhttpRequest({
      method: "POST",
      url: "http://www.gpunktprojekt.de/ois/insertdata2.php",
      data: JSON.stringify(arr),
      headers: {
        "Content-Type": "application/json"
      },
      onload: function(response) {

      }
  });
}



function getBuildingData(user){
   
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/getBuildingData.php",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      user.data = response.responseText;
      createDataset(user);
    }
  });
}



function resetStatus(user){
  var json = JSON.stringify(user);
  
  GM_xmlhttpRequest({
      method: "POST",
      url: "http://www.gpunktprojekt.de/ois/reset.php",
      data: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json"
      },
      onload: function(response) {
         
      }
  });
}



function getLoginStatus(user,pos){
  console.log('Try to login\n');
  console.log(user);
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/status.php",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response){
      var Json = JSON.parse(response.responseText);
      
      if(Json.open){
        if(!gid('OIS_Login')){
          var html = htmlLogin(user,pos);
          var log = appendElement('div', gid('game'), {'id':'OIS_Login'}, {'display':'block'});
              log.innerHTML = html;
              gid('PassBox').focus();
        }

        if(Json.remove){
          removeElement(gid('PassBox'));
          removeElement(gid('SubBnt'));
          removeElement(gid('LoginPanelCloseButton'));
        }

        if(Json.timer){
          var timer=0;
          var intervalID = setInterval(function (){
            if(timer == 3){
              clearInterval(intervalID);
              removeElement(gid('OIS_Login'));
            }
            ++timer;
          },1000);
        }

        if(gid('ErrorLabel')){
           gid('ErrorLabel').innerHTML = Json.error;
        }

        if(gid('SubBnt')){
          gid('SubBnt').addEventListener('mouseup', function(){
            clickSubBnt(user);
          }, false);
        }
          
        if(gid('LoginPanelCloseButton')){
          gid('LoginPanelCloseButton').addEventListener('mouseup', function(){
            resetStatus(user);
            removeElement(gid('OIS_Login'));
          }, false);
        }
          
        if(!Json.log){
          console.log('Logged on\n');
          if(gid('game').className === 'otherIsland' && user.window === 'oi'){
            
            setTimeout(function(){
              user = getTribe(user); 
              var data = getBuildingData(user);/////////////////////////////////

              var nav = {};
              nav.windowHeight = ((window.innerHeight/100)*60)+100;
              RightNavBar(nav,user);

              window.addEventListener('resize', function(){
                if(gid('RightNavBar')){
                  user = getTribe(user);
                  var nav = {};
                  nav.windowHeight = ((window.innerHeight/100)*60)+100;
                  RightNavBar(nav,user);
                }
              },false);
              console.log('USER');
    console.log(user);
              var val = {};
              val.spy = user.spy;
              val.val = null;
              
              setHtmlOutputPanel(user);
              getOverview(val);
              setAttStatus();
            },2000);
          }
          
          if(gid('game').className === 'seamap' && user.window === 'db'){
            var nav = {};
                nav.windowHeight = ((window.innerHeight/100)*60)+100;
            RightNavBar(nav,user);
            cleanScreen();
            setHtmlOutputPanel(user);
            setAttStatus();
          }
          
          
          if(gid('game').className === 'seamap' && user.window === 'kb'){
            cleanScreen();
            setHtmlOutputPanel(user);
            setAttStatus();
            
          }
          
          
          if(gid('game').className === 'logbook'){
            initButtonSaveKb();
          }
          
          
          if(gid('game').className === 'otherIsland'){
            initButtonSaveKb();
          }
          
          
         }
      }
    }
  }); 
}


////////////////////////////////////////////////////////////////////////////////

function insertKb(obj){
  
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/insertKb.php",
    data: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      
    }
  });
}


function getOverview(val){
  console.log('VAL1:');
  console.log(val);
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/getoverview.php",
    data: JSON.stringify(val),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      

      console.log(response.responseText);
      var res = JSON.parse(response.responseText);
      
      if(val.val === null){
        removeElement(gid('scanPanelLeft').firstChild);
        var snapshotLP = appendElement('div', gid('scanPanelLeft'), {}, {});
            snapshotLP.innerHTML = res.left;
      }
      
      removeElement(gid('scanPanelRight').firstChild);
//      var snapshotLP = appendElement('div', gid('scanPanelLeft'), {}, {});
//          snapshotLP.innerHTML = res.left;
      var snapshotRP = appendElement('div', gid('scanPanelRight'), {}, {});
          snapshotRP.innerHTML = res.right;
      
      $('.overview').bind('change',function(){
//        console.log($(this));
        var send = null;
        
        var value = $('.overview').map(function(){
          var result = this.value * parseInt(this.parentNode.parentNode.firstChild.firstChild.innerHTML);
          console.log(this.parentNode.parentNode.parentNode.outerHTML);
          if(this.parentNode.parentNode.parentNode.getAttribute('bgcolor') === '#BF84F7'){
            console.log('land');
//            key = 'land';
            send = {"land":result};
             console.log(send);
          }
          if(this.parentNode.parentNode.parentNode.getAttribute('bgcolor') === '#8784F7'){
            console.log('sea');
//            key = 'sea';
            send = {"sea":result};
            console.log(send);
          }
          return [send];
//          return [[this.value, this.parentNode.parentNode.firstChild.firstChild.innerHTML]];
        });
        val.val = value;
        console.log('VAL2:');
        console.log(val);
        getOverview(val);
        
//        value.each(function(){
//          console.log(this[0]);
//          console.log(this[1]);
//          
//          
//          
//          ++i;
//        });
      });
    }
  });
}
////////////////////////////////////HTML////////////////////////////////////////
function setHtmlOutputPanel(user){
  removeElement(gid('OIS_Output'));
  var html = '';
  html += '<div class="framedDecoPanelWrapper">'+
          '<div class="framedDecoPanelBackground"></div>'+
          '<div class="framedDecoPanelMiddleLeft"></div>'+
          '<div class="framedDecoPanelMiddleRight"></div>'+
          '<div class="framedDecoPanelTopCenter">'+
          '<div class="gwt-HTML" style="position: absolute; left: -25%; top: -42px; width: 150%; z-index: 9002;"><div class="FramedLine" style="text-align: center; top: -5px;"><div class="inner2"><div class="inner"><div class="gwt-HTML"><div class="gwt-HTML floatLeftLTR" style="position: relative; display: inline; padding: 6px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_middle.png);"><div class="extendedHTML" style="position: absolute; display: block; left: -7px; top: 0px; width: 15px; height: 33px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_left.png);"></div>';
  if(user.window === 'kb'){
    html += '<div class="gwt-Label" dir="ltr" style="margin-left: 4px; margin-right: 4px;">OIS - KB Saver</div>';
  }else{
    html += '<div class="gwt-Label" dir="ltr" style="margin-left: 4px; margin-right: 4px;">OIS - Other Island Spy</div>';
  }
  
  html += '<div class="extendedHTML" style="position: absolute; display: block; left: 100%; top: 0px;"><div class="extendedHTML" style="position: absolute; display: block; left: -8px; top: 0px; width: 16px; height: 33px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_right.png);"></div></div></div></div></div></div></div></div>'+

          '<table style="width: 100%">'+
          '<tr>';
          
          
  if(gid('game').className === 'seamap' && user.window === 'db'){
    var opt = {};
        opt.hash = 'db';
        
        
        html += '<th width="45%">'+
                  '<select id="SelectOtherIsland" class="select" style="height: 20px; width: 200px; position:relative; top: -8px">'+
                  '</select>'+
                '</th>';
        GetOptionsForSeamapIslandSelect(opt);
  }
  
  if(gid('game').className === 'seamap' && user.window === 'kb'){
    var opt = {};
        opt.hash = 'kb';
        opt.user = user.name;
        
    html += '<th width="70%">'+
              '<div class="SelectOtherIslandKbWrapper" style="position:absolute; top:10px";>'+
//                '<div style="max-width: 300px;">'+
                  '<div id="SelectOtherIslandKbWrapperContent" class="SelectOtherIslandKbWrapperContent">'+
                  '<input id="SelectOtherIslandKb" class="SelectOtherIslandKb" type="text" placeholder="Suchbegriff oder aus Dropdown wählen..."></input>'+
                  '<div id="SelectOtherIslandKbButton" class="SelectOtherIslandKbButton">&darr;</div>'+
//                  '</div>'+
                  '<div id="SelectOtherIslandKbDropdown" class="SelectOtherIslandKbDropdown"></div>'+
                '</div>'+
              '</div>'+
            '</th>';
    GetOptionsForSeamapKbSelect(opt);
    
    html += '<th id="icon_kbwrite" width="45%">'+
              
              
            '</th>';
        
       
  }
  if(gid('game').className === 'otherIsland'){
    html += '<th width="90%">'+
              '<div id="OIS_Alarm" name="incomming" title="Eingehender Angriff" style="margin-right:auto;margin-left:auto;position:relative;top:-6px;width:25px;height:20px;background-color: green">'+
//                '<audio id="OIS_Signal" controls preload="auto" style="position:absolute; z-index:50000;">'+
//                  '<source src="http://www.gpunktprojekt.de/ois/audio/Alarm_01_24.mp3" type="audio/mpeg"></source>'+
//                '</audio>'+
              '</div>'+
            '</th>';
  }else{
    html += '<th width="45%">'+
                '<div id="OIS_Alarm" name="incomming" title="Eingehender Angriff" style="margin-right:auto;margin-left:auto;position:relative;top:-6px;width:25px;height:20px;background-color: green">'+
//                  '<audio id="OIS_Signal" controls preload="auto" style="position:absolute; z-index:50000;">'+
//                  '<source src="http://www.gpunktprojekt.de/ois/audio/Alarm_01_24.mp3" type="audio/mpeg"></source>'+
//                '</audio>'+
                '</div>'+
            '</th>';   
  }      
         
//    html += '<th width="auto">'+
////              '<div class="statusbar_box" id="statusbar_box"><div class="statusbar_bar" id="statusbar_bar"></div><div class="statusbar_text" id="statusbar_text">xyz</div></div>'+
//            '</th>';
            
            if(gid('game').className === 'seamap'){
              html += '<th width="10%"><div id="ScreenPanelCloseButtonSeamap" class="clickable" style="float:right; display: block; position: relative; top: -6px; width: 35px; height: 35px; z-index:1000; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/ui_0.png); background-position: -420px -939px;"></div></th>';
            }
            if(gid('game').className === 'otherIsland'){
              html += '<th width="10%"><div id="ScreenPanelCloseButtonOtherIsland" class="clickable" style="float:right; display: block; position: relative; top: -6px; width: 35px; height: 35px; z-index:1000; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/ui_0.png); background-position: -420px -939px;"></div></th>';
            }
            
            
    html += '</tr>'+
            '</table>'+
            '</div>'+
            
            
            
            '<div class="framedDecoPanelBottomCenter"></div>'+
            '<div class="framedDecoPanelTopLeft"></div>'+
            '<div class="framedDecoPanelTopRight"></div>'+
            '<div class="framedDecoPanelBottomLeft"></div>'+
            '<div class="framedDecoPanelBottomRight"></div>'+
            
            '<div id="OIS_framedDecoPanelContentWrapper" class="framedDecoPanelContentWrapper" style="background-color:#DFC037">'+
            '<div id="OIS_OutputContentwrapper" class="framedDecoPanelContent">';///

  html +=   '<div>'+
            '<table id="ScanPanelTable" class="mainpanel" cellspacing="0" cellpadding="0">'+ // stylesheet
            '<tr>';
//  if(user.window === 'kb' || user.window === 'db' || gid('game').className === 'otherIsland'){  
        html += '<td id="scanPanelLeft" class="leftpanel" align="center">'+ // stylesheet
                  ///////////////////
                '</td>';
//  }  

//  if(user.window === 'db' || gid('game').className === 'otherIsland'){          
    html += '<td id="scanPanelRight" class="rightpanel" align="center">'+
              ///////////////////
            '</td>';
//  }        
            
    html += '</tr>'+
            '</table>'+
            '</div>';

    
    html += '</div>'+///
            '</div>'+
            '</div>';
    
  var snapshot1 = appendElement('div', gid('game'), {'id':'OIS_Output'}, {'display':'block'});
  snapshot1.innerHTML = html;
  





if(gid('SelectOtherIsland')){
  gid('SelectOtherIsland').focus();
    $(function () {
     var opts = $('#SelectOtherIsland option').map(function () {
         return [[this.value, $(this).text()]];
     });
  }); 
}  
          
            
            
    
//  if(user.window !== 'kb'){
//   appendElement('div', gid('scanPanelLeft'), {'id':'ErrorLog', 'className':'framedDecoPanelContent'}, {'display':'block'}); 
//  }  
    
    
  var bnt = appendElement('div', 
                          gid('icon_kbwrite'), {
                            'id':'icon_kbwrite',
                            'title':'Kampfbericht manuell einfügen'
                          },{
                              'position': 'relative',
                              'background-image': 'url('+IMG_Kbwrite+')',
                              'width': '19px',
                              'height': '20px',
                              'top':'-6px'
                          });
      bnt.addEventListener('mouseup', function(){
        var send = {};
            send.user = user.name;
            send.clk  = gid('icon_kbwrite').id;
        console.log('click');
        console.log(send);
        InitKbManuallyInput(send);
      }, false);
    
    if(gid('ScreenPanelCloseButtonSeamap')){
      gid('ScreenPanelCloseButtonSeamap').addEventListener('mouseup', clickScreenPanelCloseButtonSeamap, false);
    }
    if(gid('ScreenPanelCloseButtonOtherIsland')){
      gid('ScreenPanelCloseButtonOtherIsland').addEventListener('mouseup', clickScreenPanelCloseButtonOtherIsland, false);
    }
    
//    if(gid('SelectOtherIslandKb')){
//      gid('SelectOtherIslandKb').addEventListener('change',function(){
//        var user = isKbSelectOptionValueEmpty(user);
//        getSelectedKb(user);
//      },false);
//    }
    
 
}




var MYSELECT = {
  initListener:function(user){
    gid('game').onmouseup = function(objEvt){
      var objEvt = (window.event)? window.event: objEvt;
      var objSrc = (objEvt.target)? objEvt.target : objEvt.srcElement;

      if(objSrc.id !== 'SelectOtherIslandKbButton' && objSrc.id !== 'SelectOtherIslandKb' && objSrc.id !== 'SelectOtherIslandKbDropdown'){
        $('#SelectOtherIslandKbDropdown').hide();
        $('#SelectOtherIslandKbButton').html('&darr;');
        $('#SelectOtherIslandKb').blur();
      }
    };

    $('#SelectOtherIslandKbButton').bind( 'click', function() {
      $('#SelectOtherIslandKbWrapperContent').css({'border':'solid blue 1px'});
      $('#SelectOtherIslandKb').focus();

      if($('#SelectOtherIslandKbDropdown').css('display') === 'block'){
        $('#SelectOtherIslandKbDropdown').hide();
        $('#SelectOtherIslandKbButton').html('&darr;');
      }else{
        $('#SelectOtherIslandKbDropdown').show();
        $('#SelectOtherIslandKbButton').html('&uarr;');
      }
    });

    $( "#SelectOtherIslandKbWrapperContent" ).focusout(function() {
      $('#SelectOtherIslandKbWrapperContent').css({'border':'solid white 1px'});
    });

    $( "#SelectOtherIslandKbWrapperContent" ).focusin(function() {
      $('#SelectOtherIslandKbWrapperContent').css({'border':'solid blue 1px'});
    });
    
    $(function () {

      var opts = $('#SelectOtherIslandKbDropdown div').map(function () {
          return [[$(this).attr('value'), $(this).text(), $(this).attr('class')]];
      });
      
      $('#SelectOtherIslandKb').keyup(function () {
        if($('#SelectOtherIslandKbDropdown').css('display') !== 'block'){
          $('#SelectOtherIslandKbDropdown').show();
        }
        
        if($('#SelectOtherIslandKb').val() === ''){
          $('#SelectOtherIslandKbDropdown').hide();
          $('#SelectOtherIslandKbButton').html('&darr;');
        }else{
          $('#SelectOtherIslandKbDropdown').show();
          $('#SelectOtherIslandKbButton').html('&uarr;');
        }

        var rxp = new RegExp($('#SelectOtherIslandKb').val(), 'i');
        var optlist = $('#SelectOtherIslandKbDropdown').empty();

        opts.each(function () {
          if (rxp.test(this[1])) {
            optlist.append($('<div/>')
              .attr({value: this[0], align:"left"})
              .text(this[1])
              .addClass(this[2]));
          }
          
        });
        MYSELECT.initDropdownListener(user);
//        console.log(own);

      });

      

    });
  },
  initDropdownListener:function(user){
    
    var el = getEl("//*[@id='SelectOtherIslandKbDropdown']/div");
       for(var i = 0; i < el.snapshotLength; ++i){
          el.snapshotItem(i).addEventListener('mouseup', function(){
            user.value = this.getAttribute("value");
            getSelectedKb(user);
          },false);
        }
  }
};




function InitKbManuallyInput(send){
  removeElement(gid('scanPanelLeft').firstChild);
  removeElement(gid('scanPanelRight').firstChild);
  
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/initkbmanuallyinput.php",
    data: JSON.stringify(send),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      
//      console.log('response:');
//      console.log(response.responseText);
      
      var json = JSON.parse(response.responseText);

      var snapshotLP = appendElement('div', gid('scanPanelLeft'), {'className':'KbMainContentWrapper'}, {});
          snapshotLP.innerHTML = json.left;
      
      $('#islandname_kb').keyup(function () {
        var name =  $('#islandname_kb').val();// islandnamecopy
                    $('.islandnamecopy').empty();
                    $('.islandnamecopy').text(name).css("font-weight", "bold");
      });
      
      $(function() {
        $( "#date_kb" ).datepicker();
      });
      
      var snapshotRP = appendElement('div', gid('scanPanelRight'), {'className':'KbMainContentWrapper'}, {});
          snapshotRP.innerHTML = json.right;
          
      $('#save_kb').click(function(){
        DialogPanel(send);
      });
      
      FormatTextareaPlaceholder($('textarea'));
    }
  });
}


function insertFormularManualKb(obj){
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://www.gpunktprojekt.de/ois/insertmanualkb.php",
    data: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      removeElement(gid('scanPanelLeft').firstChild);
      removeElement(gid('scanPanelRight').firstChild);
      
//      var json = JSON.parse(response.responseText);
      
      var snapshotLP = appendElement('div', gid('scanPanelLeft'), {}, {'position':'relative'});
      snapshotLP.innerHTML = response.responseText;
//          snapshotLP.innerHTML = json.left;
//      var snapshotRP = appendElement('div', gid('scanPanelRight'), {}, {});
//          snapshotRP.innerHTML = res.right;
      console.log(response.responseText);
    }
  });
}

function DialogPanel(send){
  
  var array = [];
  var obj = {};
  var input  = $( "#maincontent_kb" ).find( "input" );
  var select = $( "#maincontent_kb" ).find( "select" );
  var textarea = $( "#maincontent_kb" ).find( "textarea" );

  input.each(function(){
    array.push(this.value);
//    console.log(this.value);
  });
  
  select.each(function(){
//    console.log(this.selectedOptions);
    var selected = this.selectedOptions;
    array.push(selected[0].text);
//    console.log(selected[0].text);
  });
  
  textarea.each(function(){
    array.push(this.value);
//    console.log(this.value);
  });
  
  obj.user = send.user;
  obj.content = array;
  console.log(obj);
  
  var html = '<div id="yesno_dialog" title="Yes Or No" align="center" style="width:600px; height:300px;overflow:scroll;">';
      html+= '<div><div class="LogBookMessageHeader">';
      html+= '<div class="gwt-HTML boldInline" style="cursor: pointer;">'+array[0]+'</div>';
      html+= '<div class="gwt-Label inline LogBookMessageUnfold"> '+array[2]+'</div></div>';
      html+= '<div class="LogBookMessageBody">';
      html+= '<div class="gwt-HTML boldInline" style="">'+array[0]+'</div><div class="inline"> '+array[3]+'</div>';
      html+= '<div class="gwt-HTML"><b>'+array[4]+'</b></div>';
      html+= '<div class="gwt-HTML"><br>'+array[5]+'</div><div class="gwt-HTML">'+array[8]+'</div><div></div>';
      html+= '<div class="gwt-HTML"><br>'+array[6]+'</div><div class="gwt-HTML"><br><b>Seeschlacht</b></div><table cellpadding="5" cellspacing="10"><colgroup><col><col></colgroup><tbody><tr><td><div class="gwt-HTML"><b>Angreifer</b></div></td><td><div class="gwt-HTML"><b>Verteidiger</b></div></td></tr><tr><td><div>';
      html+= '<div class="gwt-HTML">'+array[9]+'</div></div></td><td><div><div class="gwt-HTML">'+array[10]+'</div></div></td></tr></tbody></table>';
      html+= '<div class="gwt-HTML"><br>'+array[7]+'</div><div class="gwt-HTML"><br><b>Landschlacht</b></div><table cellpadding="5" cellspacing="10"><colgroup><col><col></colgroup><tbody><tr><td><div class="gwt-HTML"><b>Angreifer</b></div></td><td><div class="gwt-HTML"><b>Verteidiger</b></div></td></tr><tr><td><div>';
      html+= '<div class="gwt-HTML">'+array[11]+'</div></div></td><td><div>';
      html+= '<div class="gwt-HTML">'+array[12]+'</div></div></td></tr></tbody></table></div></div>';
      html+= '</div>';
  $('#game').append(html);
  $("#yesno_dialog").dialog({
    title: "Kampfbericht wirklich speichern?",
    width: 700,
    height: 500,
    resizable: false,
    modal: true,
    buttons: {
      "Ja" : function () {
        insertFormularManualKb(obj);
//                    alert("You chose yes.. now let's do something else here");
        $(this).dialog("close");
        $(this).remove();
      },
      "Nein" : function (){
//                    alert("You chose no.. now let's do something else here");
        $(this).dialog("close");
        $(this).remove();
      }
    }
  });
}
 
function FormatTextareaPlaceholder(el){
//  console.log(typeof(el));
  if(typeof(el) === 'object'){
    var textAreas = el;
    Array.prototype.forEach.call(textAreas, function(elem) {
    elem.placeholder = elem.placeholder.replace(/#/g, '\n');
  });
  }

} 

function htmlLogin(user,pos){
  
    var html =  '<div id="OIS_LoginForm" class="ThemeLabel" style="position: absolute; top:'+pos.top+'px; left:'+pos.left+'px; width:300px; height:100px; z-index: 9000; display: block;"><div class="body" style="display: block; position: relative; margin: 0px; padding: 0px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_background.png);"><div style="left: 0px; top: 0px;">'+
                '<div class="extendedHTML" style="position: relative; display: block; width: 200px; height: 20px;"></div><div class="extendedHTML" style="position: relative; display: block; margin-left: 17px; margin-right: 17px; text-align: center;">'+
                '<div id="ErrorLabel" style="font-size:14px">'+user.error+'</div>'+
                '<input id="PassBox" type="password" name="password" value="" placeholder="Password" tabindex="0" style="display:block" />'+
                '<input id="SubBnt" class="clickable" type="button" name="commit" value="Login" tabindex="1" style="display:block" />'+
                '</div><div class="extendedHTML" style="position: relative; display: block; width: 200px; height: 5px;"></div></div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; height: 100%; left: -9px; top: 0px; width: 13px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_left.png);">&nbsp;</div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; height: 100%; left: 100%; top: 0px; width: 15px;">&nbsp;<div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; height: 100%; width: 100%; left: -3px; top: 0px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_right.png);">&nbsp;</div><div class="gwt-HTML" style="display: block; position: absolute; z-index: 2; font-size: 1px; line-height: 0px; left: -13px; top: -13px; width: 26px; height: 27px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_corner_top_right.png);">&nbsp;</div></div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; width: 100%; left: -1px; top: -10px; height: 13px; z-index: 1; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_top.png);">&nbsp;</div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; width: 100%; left: -1px; top: 100%;">&nbsp;<div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; width: 100%; left: 0px; top: -3px; height: 14px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_bottom.png);">&nbsp;</div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; top: -16px; left: -15px; width: 33px; height: 34px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_corner_bottom_left.png);">&nbsp;</div></div><div class="gwt-HTML" style="display: block; position: absolute; z-index: 2; font-size: 1px; line-height: 0px; left: -15px; top: -16px; width: 31px; height: 32px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_corner_top_left.png);">&nbsp;</div><div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; height: 1px; width: 1px; left: 100%; top: 100%;">&nbsp;<div class="gwt-HTML" style="display: block; position: absolute; font-size: 1px; line-height: 0px; left: -16px; top: -17px; width: 33px; height: 34px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/info_window_corner_bottom_right.png);">&nbsp;</div></div><div class="gwt-HTML" style="position: absolute; left: -25%; top: -42px; width: 150%; z-index: 9002;">'+
                '<div class="FramedLine" style="text-align: center; top: -5px;">'+
                '<div class="inner2"><div id="LoginPanelCloseButton" class="clickable" style="display: block; position: absolute;top:40px; left:345px; width: 35px; height: 35px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/ui_0.png); background-position: -420px -939px;"></div>'+
                '<div class="inner"><div class="gwt-HTML"><div class="gwt-HTML floatLeftLTR" style="position: relative; display: inline; padding: 6px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_middle.png);"><div class="extendedHTML" style="position: absolute; display: block; left: -7px; top: 0px; width: 15px; height: 33px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_left.png);"></div>'+
                '<div class="gwt-Label" dir="ltr" style="margin-left: 4px; margin-right: 4px;">OIS - Login</div><div class="extendedHTML" style="position: absolute; display: block; left: 100%; top: 0px;"><div class="extendedHTML" style="position: absolute; display: block; left: -8px; top: 0px; width: 16px; height: 33px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/ui/window_small_title_right.png);"></div></div></div></div></div></div></div></div></div></div>';
              
  
  return html;
}



function RightNavBar(nav,user){
  removeElement(gid('RightNavBar'));
  var html =  '<div id="OIS_additionalControl" class="OIS_additionalContent" align="center">'+
              '<div id="Bnt_overview" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -130px -0px;" title="&Uuml;bersicht"></div>'+
              '<div id="Bnt_wood" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/start_icons_0.png); background-position: -455px -77px;" title="Holz"></div>'+
              '<div id="Bnt_food" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -320px -1078px;" title="Nahrung"></div>'+
              '<div id="Bnt_stone" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -65px -693px;" title="Stein"></div>'+
              '<div id="Bnt_iron" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -905px -231px;" title="Eisen"></div>';
              if(gid('game').className === 'seamap' && user.window === 'db'){
                html += '<div id="Bnt_alc" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/unsorted_0.png); background-position: -2650px -2726px;" title="Luxuswaren"></div>';
              }
              if(user.tribeName === 'vikings' && user.window !== 'db'){
                html += '<div id="Bnt_alc" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_vikings_0.png); background-position: 0px -308px;" title="Met"></div>';
              }
              if(user.tribeName === 'romans' && user.window !== 'db'){
                html += '<div id="Bnt_alc" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_romans_0.png); background-position: -625px -82px;" title="Wein"></div>';           
              }
              if(user.tribeName === 'aztecs' && user.window !== 'db'){
                html += '<div id="Bnt_alc" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/unsorted_0.png); background-position: -3300px -2265px;" title="Kakao"></div>';
              }
      html += '<div id="Bnt_save"class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -260px -0px;" title="Lager"></div>'+
              '<div id="Bnt_ground"class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -197px -233px;" title="Militär (Land)"></div>'+
              '<div id="Bnt_sea" class="clickable" disabled="disabled" style="display: block; position: relative; width: 65px; height: 77px; background-image: url(http://static.elysium.escaria.com/mono-hel-25d6c8_605-de/gfx/bundles/icons_0.png); background-position: -890px -155px;"title="Militär (See)"></div>'+
              '</div>';
  var snapshot = appendElement('div', gid('game'), {'id':'RightNavBar','className':'CenterV'}, {'display':'block','position':'relative','width':'100px','height': '92%', 'float':'right', 'overflow':'scroll','z-index':'80000'});
      snapshot.innerHTML = html;
      
  gid('Bnt_overview').addEventListener('mouseup',function(){
//    console.log('USER');
//    console.log(user);
    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    var val = {};
    if(gid('game').className === 'seamap'){
      val.spy = $('#SelectOtherIsland').val();
    }
    if(gid('game').className === 'otherIsland'){
      val.spy = user.spy;
    }
        
        val.val = null;
    getOverview(val);
  },false);
        
  gid('Bnt_wood').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'wood';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_food').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'food';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_stone').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'stone';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_iron').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'iron';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_alc').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'luxury';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_save').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'store';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_ground').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'landunits';
    GetGraph(user);
    sendQuery(user);
  }, false);

  gid('Bnt_sea').addEventListener('mouseup',function(){ 

    gid('OIS_Output').style.display = 'block';
    gid('ScanPanelTable').style.display = 'block'; 
    user = isSelectOptionValueEmpty(user);
    user.query = 'seaunits';
    GetGraph(user);
    sendQuery(user);
  }, false);
    
  gid('OIS_additionalControl').style.height = nav.windowHeight;
}



//*[@id="game"]/table[2]/tbody/tr[3]/td/div/div[2]/div

//var t = '<div class="gwt-Label" title="16:43:11" style="color: rgb(255, 34, 34); font-weight: bold; font-size: large;">00:56:16</div>';

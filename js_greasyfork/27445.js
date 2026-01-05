// ==UserScript==
// @name         RaChart™ Enhancer
// @namespace    Sighery
// @version      0.27.7.m4.b1
// @description  Enhances Rachel's charts in SG by highlighting you the games you own already
// @author		 Sighery (Modified by madjoki and BlackOnyx)
// @namespace    Sighery
// @icon         http://www.sighery.com/favicon.ico
// @supportURL   https://www.steamgifts.com/discussion/riOvr/
// @match        https://www.steamgifts.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/27445/RaChart%E2%84%A2%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/27445/RaChart%E2%84%A2%20Enhancer.meta.js
// ==/UserScript==

injectInterface();

if (window.location.href.match(".steamgifts.com/discussion/") !== null && confirmAuthor()) {
    var apiKey = localStorage.getItem('APIKey');
    var steamID64 = localStorage.getItem('SteamID64');
    
    var table = scanTable();
    
    appIDs = table[0];
    subIDs = table[1];
    
    if (appIDs.length > 0 || subIDs.length > 0) {
        importJSON(function (json, fallbackMode) {
        
            if (fallbackMode)
            {
                for (i = 0; i < subIDs.length; i++) {
                    getApps(subIDs[i]);
                }
            }
            else
            {
                for (i = 0; i < subIDs.length; i++) {
                    getApps2(subIDs[i], json);
                }
            }
            
        }, appIDs);
    }
}

function checkIDAPI() {
    var bAPIKey = localStorage.getItem("APIKey");
    var bSteamID64 = localStorage.getItem("SteamID64");

    if (bAPIKey === null && bSteamID64 === null) {
        alert("RaChart™ Enhancer: Both API key and Steam ID64 are missing, please add them for the script to work");
        return false;
    } else if (bAPIKey === null) {
        alert("RaChart™ Enhancer: API key missing, please add it for the script to work");
        return false;
    } else if (bSteamID64 === null) {
        alert("RaChart™ Enhancer: Steam ID64 missing, please add it for the script to work");
        return false;
    } else {
        return true;
    }
}

function importJSON(callback, appids_filter) {
    // 
    var link = "http://store.steampowered.com/dynamicstore/userdata/";
    var jsonFile;
    GM_xmlhttpRequest ({
        method: "GET",
        url: link,
        timeout: 10000,
        onload: function(response) {
            jsonFile = JSON.parse(response.responseText);
            
            for(var i = 0; i < jsonFile.rgIgnoredApps.length; i++) {
                highlightIgnored("app/" + jsonFile['rgIgnoredApps'][i]);
            }
            
            for(var i = 0; i < jsonFile.rgWishlist.length; i++) {
                highlightWishlist("app/" + jsonFile['rgWishlist'][i]);
            }     
            
            for(var i = 0; i < jsonFile.rgOwnedApps.length; i++) {
                highlight("app/" + jsonFile['rgOwnedApps'][i]);
            }
            
            
             
            
            
            if (jsonFile.rgOwnedApps.length == 0)
            {
                if (checkIDAPI())
                   importJSON2(callback, appids_filter);
            }
            else
            {
                callback(jsonFile, false);
            }
        },
    });
}

function importJSON2(callback, appids_filter) {
    //Needs more testing
    /*for (var i= 0; i <appids_filter.length; i++) {
        if (checkApp(appids_filter[i])) {
            highlight('app/' + appids_filter[i]);
            appids_filter.slice(i, 1);
        }
    }*/
    var int_appids_filter = turnToIntArray(appids_filter);
    var link = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=" + apiKey + '&input_json={"steamid":' + steamID64 + ',"appids_filter":' + JSON.stringify(int_appids_filter) + "}";
    var jsonFile;
    GM_xmlhttpRequest ({
        method: "GET",
        url: link,
        timeout: 5000,
        onload: function(response) {
            jsonFile = JSON.parse(response.responseText);
            if (jsonFile.response.game_count > 0) {
                for(var i = 0; i < jsonFile.response.games.length; i++) {
                    highlight("app/" + jsonFile['response']['games'][i]['appid']);
                    //Needs more testing
                    /*saveApp(jsonFile.response.games[i].appid);*/
                }
            }
            
            callback(jsonFile, true);
        },
    });
}

function injectInterface() {
    injectDlgStyle();
    injectDialog();
    injectFunctions();
    injectRow();
}

function injectFunctions() {
    var scriptCode = [
        "function retrieveChecked() {",
        "    if (localStorage.getItem('MBlueTheme') == 'true') {",
        "        document.getElementById('MBlueTheme').checked = true;",
        "    }",
        "    if (localStorage.getItem('MDarkTheme') == 'true') {",
        "        document.getElementById('MDarkTheme').checked = true;",
        "    }",
        "    if (localStorage.getItem('SPDarkTheme') == 'true') {",
        "        document.getElementById('SPDarkTheme').checked = true;",
        "    }",
        "    var APIKey = localStorage.getItem('APIKey');",
        "    var SteamID64 = localStorage.getItem('SteamID64');",
        "    if (APIKey !== null) {",
        "        document.getElementById('APIKey').value = APIKey;",
        "    }",
        "    if (SteamID64 !== null) {",
        "        document.getElementById('SteamID64').value = SteamID64;",
        "    }",
        "}",
        "",
        "retrieveChecked();"
    ].join("\n");
    var node = document.createElement('script');
    node.type = "text/javascript";
    node.appendChild(document.createTextNode(scriptCode));
    document.head.appendChild(node);
}

function injectRow() {
    var discDropdown = document.getElementsByClassName('nav__left-container')[0].children[2].children[0].children[0];

    var newRow = document.createElement('a');
    newRow.setAttribute('class', 'nav__row');
    newRow.href = "javascript:void(0)";

    if (document.getElementsByClassName('nav__left-container')[0].children[0].tagName == "IMG" || document.getElementsByClassName('SPGG_FixedNavbar') >= 1 || document.getElementsByClassName('sg-info').length >= 1) {
        setTimeout(function() {
            if (document.getElementsByClassName('nav__left-container')[0].children[0].tagName == "IMG" && document.getElementsByClassName('SPGG_FixedNavbar') >= 1 && document.getElementsByClassName('sg-info').length >= 1) {
                //For Extended SteamGifts, SG++ and SGLinkies at the same time
                document.getElementsByClassName('nav__left-container')[0].children[3].children[0].children[0].insertBefore(newRow, discDropdown.children[2]);
            } else if (document.getElementsByClassName('nav__left-container')[0].children[0].tagName == "IMG" && document.getElementsByClassName('sg-info').length >= 1) {
                //For Extended SteamGifts and SGLinkies
                document.getElementsByClassName('nav__left-container')[0].children[3].children[0].children[0].insertBefore(newRow, document.getElementsByClassName('nav__left-container')[0].children[3].children[0].children[0].children[2]);
            } else if (document.getElementsByClassName('sg-info').length >= 1) {
                //For SGLinkies
                discDropdown.insertBefore(newRow, discDropdown.children[2]);
            } else if (document.getElementsByClassName('nav__left-container')[0].children[0].tagName == "IMG") {
                //For Extended SteamGifts
                document.getElementsByClassName('nav__left-container')[0].children[3].children[0].children[0].appendChild(newRow);
            } else {
                discDropdown.appendChild(newRow);
            }
        }, 1000);
    } else {
        discDropdown.appendChild(newRow);
    }

    newRow.appendChild(document.createElement('i'));
    newRow.children[0].setAttribute('class', 'icon-blue fa fa-fw fa-table');

    newRow.appendChild(document.createElement('div'));
    newRow.children[1].setAttribute('class', 'nav__row__summary');

    newRow.children[1].appendChild(document.createElement('p'));
    newRow.children[1].children[0].setAttribute('class', 'nav__row__summary__name');
    newRow.children[1].children[0].innerHTML = "RaChart&trade; Enhancer";

    newRow.children[1].appendChild(document.createElement('p'));
    newRow.children[1].children[1].setAttribute('class', 'nav__row__summary__description');
    newRow.children[1].children[1].innerHTML = "Change the options for the enhancer.";

    newRow.addEventListener('click', function() {
        var blackbg = document.getElementById('black-background');
        var dlg = document.getElementById('dlgbox');
        blackbg.style.display = 'block';
        dlg.style.display = 'block';

        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        dlg.style.left = (winWidth/2) - 500/2 + 'px';
        dlg.style.top = '150px';
    });
}

function injectDialog() {
   var dlg = document.createElement('div');
    dlg.setAttribute('id', 'black-background');
    dlg.appendChild(document.createElement('div'));
    document.body.insertBefore(dlg, document.body.children[0]);

    dlg.children[0].setAttribute('id', 'dlgbox');
    dlg.children[0].appendChild(document.createElement('div'));
    dlg.children[0].appendChild(document.createElement('div'));

    var dlgHeader = dlg.children[0].children[0];
    dlgHeader.setAttribute('id', 'dlg-header');
    dlgHeader.appendChild(document.createElement('div'));
    dlgHeader.children[0].setAttribute('id', 'dlg-header-title');
    dlgHeader.children[0].appendChild(document.createElement('a'));
    dlgHeader.children[0].children[0].href = "https://www.steamgifts.com/discussion/riOvr/";
    dlgHeader.children[0].children[0].innerHTML = "RaChart&trade; Enhancer";
    
    dlgHeader.appendChild(document.createElement('button'));
    dlgHeader.children[1].setAttribute('id', 'Close-Options');
    dlgHeader.children[1].appendChild(document.createElement('i'));
    dlgHeader.children[1].children[0].setAttribute('class', 'fa fa-times');
    dlgHeader.children[1].children[0].style.fontSize = "25px";
    dlgHeader.children[1].children[0].style.marginTop = "-6px";

    var dlgBody = dlg.children[0].children[1];
    dlgBody.setAttribute('id', 'dlg-body');
    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[0].htmlFor = "APIKey";
    dlgBody.children[0].innerHTML = "API Key:";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[1].type = "textarea";
    dlgBody.children[1].setAttribute('id', 'APIKey');
    dlgBody.children[1].style.marginLeft = "36px";
    dlgBody.children[1].style.width = "300px";
    dlgBody.children[1].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[2].setAttribute('class', 'Submit-Button');
    dlgBody.children[2].innerHTML = "Submit";

    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[4].htmlFor = "SteamID64";
    dlgBody.children[4].innerHTML = "Steam ID64:";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[5].type = "textarea";
    dlgBody.children[5].setAttribute('id', 'SteamID64');
    dlgBody.children[5].style.marginLeft = "11px";
    dlgBody.children[5].style.width = "300px";
    dlgBody.children[5].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[6].setAttribute('class', 'Submit-Button');
    dlgBody.children[6].innerHTML = "Submit";
    
    dlgBody.appendChild(document.createElement('br'));
    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[9].htmlFor = "WishlistColor";
    dlgBody.children[9].innerHTML = "Wishlisted item color:";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[10].type = "color";
    dlgBody.children[10].setAttribute('id', 'WishlistColor');
    dlgBody.children[10].style.marginLeft = "43px";
    dlgBody.children[10].style.width = "150px";
    dlgBody.children[10].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[11].setAttribute('class', 'Submit-Button');
    dlgBody.children[11].innerHTML = "Submit";
    
    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[12].setAttribute('class', 'Reset-Button');
    dlgBody.children[12].innerHTML = "Reset";

    dlgBody.appendChild(document.createElement('br'));
    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[15].htmlFor = "PrimaryColor";
    dlgBody.children[15].innerHTML = "Owned item color:";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[16].type = "color";
    dlgBody.children[16].setAttribute('id', 'PrimaryColor');
    dlgBody.children[16].style.marginLeft = "61px";
    dlgBody.children[16].style.width = "150px";
    dlgBody.children[16].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[17].setAttribute('class', 'Submit-Button');
    dlgBody.children[17].innerHTML = "Submit";
    
    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[18].setAttribute('class', 'Reset-Button');
    dlgBody.children[18].innerHTML = "Reset";

    dlgBody.appendChild(document.createElement('br'));
    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[21].htmlFor = "SecondaryColor";
    dlgBody.children[21].innerHTML = "Partially owned item color:";
    
    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[22].type = "color";
    dlgBody.children[22].setAttribute('id', 'SecondaryColor');
    dlgBody.children[22].style.marginLeft = "10px";
    dlgBody.children[22].style.width = "150px";
    dlgBody.children[22].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[23].setAttribute('class', 'Submit-Button');
    dlgBody.children[23].innerHTML = "Submit";
    
    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[24].setAttribute('class', 'Reset-Button');
    dlgBody.children[24].innerHTML = "Reset";

    dlgBody.appendChild(document.createElement('br'));
    dlgBody.appendChild(document.createElement('br'));
    
    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[27].htmlFor = "IgnoredColor";
    dlgBody.children[27].innerHTML = "Ignored item color:";
    
    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[28].type = "color";
    dlgBody.children[28].setAttribute('id', 'IgnoredColor');
    dlgBody.children[28].style.marginLeft = "56px";
    dlgBody.children[28].style.width = "150px";
    dlgBody.children[28].style.lineHeight = "inherit";

    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[29].setAttribute('class', 'Submit-Button');
    dlgBody.children[29].innerHTML = "Submit";
    
    dlgBody.appendChild(document.createElement('button'));
    dlgBody.children[30].setAttribute('class', 'Reset-Button');
    dlgBody.children[30].innerHTML = "Reset";
    
    dlgBody.appendChild(document.createElement('br'));
    dlgBody.appendChild(document.createElement('br'));
    
    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[33].htmlFor = "MBlueTheme";
    dlgBody.children[33].appendChild(document.createElement('a'));
    dlgBody.children[33].children[0].href = "https://www.steamgifts.com/discussion/62TRf/steamgifties-blackblue-update-february-1st-v27";
    dlgBody.children[33].children[0].innerHTML = "Check this if you use Mullins' Blue Theme ";
    dlgBody.children[33].style.color = "rgba(25, 75, 100, 1)";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[34].setAttribute('id', 'MBlueTheme');
    dlgBody.children[34].type = "checkbox";
    dlgBody.children[34].style.width = "inherit";
    dlgBody.children[34].style.marginTop = "10px";

    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[36].htmlFor = "MDarkTheme";
    dlgBody.children[36].appendChild(document.createElement('a'));
    dlgBody.children[36].children[0].href = "https://www.steamgifts.com/discussion/62TRf/steamgifties-blackblue-update-february-1st-v27";
    dlgBody.children[36].children[0].innerHTML = "Check this if you use Mullins' Dark Theme ";
    dlgBody.children[36].style.color = "rgba(0, 0, 0, 1)";

    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[37].setAttribute('id', 'MDarkTheme');
    dlgBody.children[37].type = "checkbox";
    dlgBody.children[37].style.width = "inherit";
    dlgBody.children[37].style.marginTop = "2px";

    dlgBody.appendChild(document.createElement('br'));

    dlgBody.appendChild(document.createElement('label'));
    dlgBody.children[39].htmlFor = "SPDarkTheme";
    dlgBody.children[39].appendChild(document.createElement('a'));
    dlgBody.children[39].children[0].href = "https://www.steamgifts.com/discussion/iO230/userstyle-sgv2-dark-1424";
    dlgBody.children[39].children[0].innerHTML = "Check this if you use SquishedPotatoe's Dark Theme ";
    dlgBody.children[39].style.color = "rgba(23, 23, 23, 1)";
    
    dlgBody.appendChild(document.createElement('input'));
    dlgBody.children[40].setAttribute('id', 'SPDarkTheme');
    dlgBody.children[40].type = "checkbox";
    dlgBody.children[40].style.width = "inherit";
    dlgBody.children[40].style.marginTop = "2px";

    
    document.getElementById('Close-Options').addEventListener('click', function() {
        var blackbg = document.getElementById('black-background');
        var dlg = document.getElementById('dlgbox');

        blackbg.style.display = 'none';
        dlg.style.display = 'none';
    });

    dlgBody.children[2].addEventListener('click', function() {
        var input = document.getElementById('APIKey');
        localStorage.setItem(input.id, input.value);
    });

    dlgBody.children[6].addEventListener('click', function() {
        var input = document.getElementById('SteamID64');
        localStorage.setItem(input.id, input.value);
    });

      dlgBody.children[11].addEventListener('click', function() {
        var input = document.getElementById('WishlistColor');
        localStorage.setItem(input.id, input.value);
    });
    
     dlgBody.children[12].addEventListener('click', function() {
        localStorage.removeItem('WishlistColor');
    });
    
    dlgBody.children[17].addEventListener('click', function() {
        var input = document.getElementById('PrimaryColor');
        localStorage.setItem(input.id, input.value);
    });

    dlgBody.children[18].addEventListener('click', function() {
        localStorage.removeItem('PrimaryColor');
    });

    dlgBody.children[23].addEventListener('click', function() {
        var input = document.getElementById('SecondaryColor');
        localStorage.setItem(input.id, input.value);
    });
    
    dlgBody.children[24].addEventListener('click', function() {
        localStorage.removeItem('SecondaryColor');
    });
    
    dlgBody.children[29].addEventListener('click', function() {
        var input = document.getElementById('IgnoredColor');
        localStorage.setItem(input.id, input.value);
    });
    
    dlgBody.children[30].addEventListener('click', function() {
        localStorage.removeItem('IgnoredColor');
    });
    
    dlgBody.children[34].addEventListener('click', function() {
        var input = document.getElementById('MBlueTheme');
        if (input.checked == false) {
            localStorage.removeItem('MBlueTheme');
        } else {
            localStorage.removeItem('PrimaryColor');
            localStorage.removeItem('SecondaryColor');
            localStorage.removeItem('WishlistColor');
            localStorage.removeItem('IgnoredColor');
            localStorage.setItem(input.id, true);
        }
    });

    dlgBody.children[37].addEventListener('click', function() {
        var input = document.getElementById('MDarkTheme');
        if (input.checked == false) {
            localStorage.removeItem('MDarkTheme');
        } else {
            localStorage.removeItem('PrimaryColor');
            localStorage.removeItem('SecondaryColor');
            localStorage.removeItem('WishlistColor');
            localStorage.removeItem('IgnoredColor');
            localStorage.setItem(input.id, true);
        }
    });

    dlgBody.children[40].addEventListener('click', function() {
        var input = document.getElementById('SPDarkTheme');
        if (input.checked == false) {
            localStorage.removeItem('SPDarkTheme');
        } else {
            localStorage.removeItem('PrimaryColor');
            localStorage.removeItem('SecondaryColor');
            localStorage.removeItem('WishlistColor');
            localStorage.removeItem('IgnoredColor');
            localStorage.setItem(input.id, true);
        }
    });
}
function injectDlgStyle() {
    var dialogCSS = [
            "#black-background {",
            "  display: none;",
            "  width: 100%;",
            "  height: 100%;",
            "  position: fixed;",
            "  top: 0px;",
            "  left: 0px;",
            "  background-color: rgba(0, 0, 0, 0.75);",
            "  z-index: 8888;",
            "}",
            "#dlgbox{",
            "  display: none;",
            "  position: fixed;",
            "  width: 500px;",
            "  z-index: 9999;",
            "  border-radius: 10px;",
            "  background-color: #7c7d7e;",
            "}",
            "#dlg-header {",
            "  background-color: #6D84B4;",
            "  padding: 10px;",
            "  padding-bottom: 30px;",
            "  margin: 10px 10px 10px 10px;",
            "  color: white;",
            "  font-size: 20px;",
            "}",
            "#dlg-header-title {",
            "  float: left;",
            "}",
            "#dlg-body{",
            "  clear: both;",
            "  background-color: #C3C3C3;",
            "  color: white;",
            "  font-size: 14px;",
            "  padding: 10px;",
            "  margin: 0px 10px 10px 10px;",
            "}",
            "#Close-Options{",
            "  background-color: transparent;",
            "  color: white;",
            "  float: right;",
            "  border: none;",
            "  font-size: 25px;",
            "  margin-top: -5px;",
            "  opacity: 0.7;",
            "}",
            ".Submit-Button {",
            "  background-color: #fff;",
            "  border: 2px solid #333;",
            "  box-shadow: 1px 1px 0 #333,",
            "              2px 2px 0 #333,",
            "              3px 3px 0 #333,",
            "              4px 4px 0 #333,",
            "              5px 5px 0 #333;",
            "  color: #333;",
            "  display: inline-block;",
            "  padding: 4px 6px;",
            "  position: relative;",
            "  text-decoration: none;",
            "  text-transform: uppercase;",
            "  -webkit-transition: .1s;",
            "     -moz-transition: .1s;",
            "      -ms-transition: .1s;",
            "       -o-transition: .1s;",
            "          transition: .1s;",
            "}",
            ".Submit-Button:hover,",
            ".Submit-Button:focus {",
            "  background-color: #ded;",
            "}",
            ".Submit-Button:active {",
            "  box-shadow: 1px 1px 0 #333;",
            "  left: 4px;",
            "  top: 4px;",
            "}",
            ".Reset-Button {",
            "  background-color: #fff;",
            "  border: 2px solid #333;",
            "  box-shadow: 1px 1px 0 #333,",
            "              2px 2px 0 #333,",
            "              3px 3px 0 #333,",
            "              4px 4px 0 #333,",
            "              5px 5px 0 #333;",
            "  color: #333;",
            "  display: inline-block;",
            "  padding: 4px 6px;",
            "  position: relative;",
            "  text-decoration: none;",
            "  text-transform: uppercase;",
            "  -webkit-transition: .1s;",
            "     -moz-transition: .1s;",
            "      -ms-transition: .1s;",
            "       -o-transition: .1s;",
            "          transition: .1s;",
            "}",
            ".Reset-Button:hover,",
            ".Reset-Button:focus {",
            "  background-color: #edd;",
            "}",
            ".Reset-Button:active {",
            "  box-shadow: 1px 1px 0 #333;",
            "  left: 4px;",
            "  top: 4px;",
            "}",
            //For SquishedPotatoe's Dark Theme
            ".markdown td {",
            "  background-color: inherit !important;",
            "}"
    ].join("\n");
    var node = document.createElement('style');
    node.type = "text/css";
    node.appendChild(document.createTextNode(dialogCSS));
    document.getElementsByTagName('head')[0].appendChild(node);
}

function highlight(row) {
    var rows = document.getElementsByClassName(row);
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.textShadow = "none";
        if (localStorage.getItem('PrimaryColor') !== null) {
            rows[i].style.backgroundColor = localStorage.getItem('PrimaryColor');
        } else if (localStorage.getItem('MBlueTheme') !== null && localStorage.getItem('MBlueTheme') !== undefined && localStorage.getItem('MBlueTheme') != false) {
            rows[i].style.backgroundColor = "#0E4E0E";
        } else if (localStorage.getItem('MDarkTheme') !== null && localStorage.getItem('MDarkTheme') !== undefined && localStorage.getItem('MDarkTheme') != false) {
            rows[i].style.backgroundColor = "#0E4E0E";
        } else if (localStorage.getItem('SPDarkTheme') !== null && localStorage.getItem('SPDarkTheme') !== undefined && localStorage.getItem('SPDarkTheme') != false) {
            rows[i].style.backgroundColor = "#0E4E0E";
        } else {
            rows[i].style.backgroundColor = "#C2FFAD";
        }
    }
}

function highlightWishlist(row) {
    var rows = document.getElementsByClassName(row);
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.textShadow = "none";
        if (localStorage.getItem('WishlistColor') !== null) {
            rows[i].style.backgroundColor = localStorage.getItem('WishlistColor');
        } else if (localStorage.getItem('MBlueTheme') !== null && localStorage.getItem('MBlueTheme') !== undefined && localStorage.getItem('MBlueTheme') != false) {
            rows[i].style.backgroundColor = "rgba(177, 177, 251, 0.39)";
        } else if (localStorage.getItem('MDarkTheme') !== null && localStorage.getItem('MDarkTheme') !== undefined && localStorage.getItem('MDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(177, 177, 251, 0.39)";
        } else if (localStorage.getItem('SPDarkTheme') !== null && localStorage.getItem('SPDarkTheme') !== undefined && localStorage.getItem('SPDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(177, 177, 251, 0.39)";
        } else {
            rows[i].style.backgroundColor = "rgba(177, 177, 251, 0.39)";
        }
    }
}

function highlightIgnored(row) {
    var rows = document.getElementsByClassName(row);
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.textShadow = "none";
        if (localStorage.getItem('IgnoredColor') !== null) {
            rows[i].style.backgroundColor = localStorage.getItem('IgnoredColor');
        } else if (localStorage.getItem('MBlueTheme') !== null && localStorage.getItem('MBlueTheme') !== undefined && localStorage.getItem('MBlueTheme') != false) {
            rows[i].style.backgroundColor = "rgba(251, 177, 177, 0.39)";
        } else if (localStorage.getItem('MDarkTheme') !== null && localStorage.getItem('MDarkTheme') !== undefined && localStorage.getItem('MDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(251, 177, 177, 0.39)";
        } else if (localStorage.getItem('SPDarkTheme') !== null && localStorage.getItem('SPDarkTheme') !== undefined && localStorage.getItem('SPDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(251, 177, 177, 0.39)";
        } else {
            rows[i].style.backgroundColor = "rgba(252, 177, 177, 0.39)";
        }
    }
}

function highlightSub(row) {
    var rows = document.getElementsByClassName(row);
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.textShadow = "none";
        if (localStorage.getItem('SecondaryColor') !== null) {
            rows[i].style.backgroundColor = localStorage.getItem('SecondaryColor');
        } else if (localStorage.getItem('MBlueTheme') !== null && localStorage.getItem('MBlueTheme') !== undefined && localStorage.getItem('MBlueTheme') != false) {
            rows[i].style.backgroundColor = "rgba(120, 154, 201, 0.70)";
        } else if (localStorage.getItem('MDarkTheme') !== null && localStorage.getItem('MDarkTheme') !== undefined && localStorage.getItem('MDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(120, 154, 201, 0.70)";
        } else if (localStorage.getItem('SPDarkTheme') !== null && localStorage.getItem('SPDarkTheme') !== undefined && localStorage.getItem('SPDarkTheme') != false) {
            rows[i].style.backgroundColor = "rgba(255, 112, 67, 0.60)";
        } else {
            rows[i].style.backgroundColor = "#FFD68F";
        }
    }
}

function confirmAuthor() {
	var blacklist = [];
    var author = document.getElementsByClassName('comment__username')[0].children[0].innerHTML;
	if (checkLst(author, blacklist) === false) {
		return true;
	} else {
		return false;
	}
    /* Whitelist method, deprecated
	if (author == "rachellove" || author == "KTS" || author == "devotee" || author == "Sighery") {
        return true;
    }
    else {
        return false;
    }*/
}

function confirmRow(row) {
    if (row.children.length != 1) {
        return false;
    } if (row.getElementsByTagName("A").length < 1) {
		return false;
	} if (/store.steampowered.com/.test(row.getElementsByTagName("A")[0].href) === false) {
		return false;
	}
	/* Old method of checking, deprecated
	if (row.children[0].tagName != "STRONG") {
        return false;
    } if (row.children[0].children.length != 1) {
        return false;
    } if (row.children[0].children[0].tagName != "A") {
        return false;
    } if (row.children[0].children[0].hasAttribute("href") === false) {
        return false;
    } if (/store.steampowered.com/.test(row.children[0].children[0].href) === false) {
        return false;
    }*/
    return true;
}

function scanTable() {
    var elements = document.getElementsByTagName('td');
    var appIDs = [];
    var subIDs = [];
    for (var i = 0; i < elements.length; i++) {
        if (confirmRow(elements[i]) === false) {
            continue;
        }
        var id;
		var link = elements[i].getElementsByTagName("A")[0].href;
        if(/app/.test(link)) {
            id = /\d+/.exec(link)[0];
            appIDs.push(id);
            elements[i].parentNode.setAttribute('class', "app/" + id);
        } else if(/sub/.test(link)) {
            id = /\d+/.exec(link)[0];
            subIDs.push(id);
            elements[i].parentNode.setAttribute('class', "sub/" + id);
        }
    }
    var array = [appIDs, subIDs];
    return array;
}

function getApps2(subID, jsonFull) {
    
    if (jsonFull.rgOwnedPackages.indexOf(subID) > -1)
    {
        highlight("sub/" + subID);
        return;
    }
    
    var link = "https://store.steampowered.com/api/packagedetails/?packageids=" + subID;
    
    GM_xmlhttpRequest({
        method: "GET",
        url: link,
        timeout: 6000,
        onload: function(response) {
            var jsonFile = JSON.parse(response.responseText);
            var owned = 0;
            var total = 0;  
            
            for (var j = 0; j < jsonFile[subID]['data']['apps'].length; j++) {
                total++;
                var appid = parseInt(jsonFile[subID]['data']['apps'][j]['id']);
                
                if (jsonFull.rgOwnedApps.indexOf(appid) > -1)
                {
                   owned++;
                }
            }
                        
            if (owned == total && total > 0)
                highlight("sub/" + subID);
            else if (owned > 0)
                highlightSub("sub/" + subID);
           
        }
    });
}

function getApps(subID) {
    var link = "https://store.steampowered.com/api/packagedetails/?packageids=" + subID;
    GM_xmlhttpRequest({
        method: "GET",
        url: link,
        timeout: 3000,
        onload: function(response) {
            var jsonFile = JSON.parse(response.responseText);
            var arrayApps = [];
            for (var j = 0; j < jsonFile[subID]['data']['apps'].length; j++) {
                arrayApps.push(jsonFile[subID]['data']['apps'][j]['id']);
            }
            var int_appids_filter = turnToIntArray(arrayApps);
            var checkGames = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=" + apiKey + '&input_json={"steamid":' + steamID64 + ',"appids_filter":' + JSON.stringify(int_appids_filter) + "}";
            GM_xmlhttpRequest({
                method: "GET",
                url: checkGames,
                onload: function(response) {
                    var jsonFile = JSON.parse(response.responseText);
                    if (jsonFile['response']['game_count'] == arrayApps.length) {
                        highlight("sub/" + subID);
                    }
                    else if (jsonFile['response']['game_count'] != 0) {
                        highlightSub("sub/" + subID);
                    }
                }
            });
        }
    });
}

function turnToIntArray(oldArray) {
    var newArray = [];
    for (var i = 0; i < oldArray.length; i++) {
        newArray.push(parseInt(oldArray[i]));
    }
    return newArray;
}

function checkLst(value, list) {
    if (list.indexOf(value) == -1) {
        return false;
    } else {
        return true;
    }
}

/* Unused for now
function pickColor() {
    var test = document.getElementById('Test');
    var color = document.getElementById('ColorInput').value;
    test.style.backgroundColor = color;
}*/

//These two functions need more testing, to implement
/*
function checkApp(appID) {
    if ((GM_getValue('appids') !== null) && GM_getValue('appids') !== undefined) {
        var array = JSON.parse(GM_getValue('appids'));
        if (array.indexOf(appID) >= 0) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function saveApp(appID) {
    if ((GM_getValue('appids') !== null) && GM_getValue('appid') !== undefined) {
        var array = JSON.parse(GM_getValue('appids'));
        array.push(appID);
        GM_setValue('appids', JSON.stringify(array));
    } else {
        var array = [appID];
        GM_setValue('appids', JSON.stringify(array));
    }
}
*/

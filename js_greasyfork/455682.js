// ==UserScript==
// @name         pennergame bottle bot 2022
// @namespace    http://tampermonkey.net/
// @version      11.2022.7
// @description  bottle search menu
// @author       NullPointer
// @license      MIT
// @match        https://*.pennergame.de/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455682/pennergame%20bottle%20bot%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/455682/pennergame%20bottle%20bot%202022.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("my-profile-new") == null) {
        return;
    }

    var link = "";
    var url = document.location.href;
    if (url.indexOf("http://www.pennergame") >= 0) {link = "http://www.pennergame.de"}
    if (url.indexOf("http://pennergame") >= 0) {link = "http://pennergame.de"}
    if (url.indexOf("berlin.pennergame.de") >= 0) {link = "http://berlin.pennergame.de"}
    if (url.indexOf("www.berlin.pennergame.de") >= 0) {link = "http://www.berlin.pennergame.de"}
    if (url.indexOf("muenchen.pennergame.de") >= 0) {link = "http://muenchen.pennergame.de"}
    if (url.indexOf("www.muenchen.pennergame.de")>= 0) {link = "http://www.muenchen.pennergame.de"}
    if (url.indexOf("koeln.pennergame.de") >= 0) {link = "http://koeln.pennergame.de"}
    if (url.indexOf("www.koeln.pennergame.de") >= 0) {link = "http://www.koeln.pennergame.de"}
    if (url.indexOf("reloaded.pennergame.de") >= 0) {link = "http://reloaded.pennergame.de"}
    if (url.indexOf("www.reloaded.pennergame.de") >= 0) {link = "http://www.reloaded.pennergame.de"}
    if (url.indexOf("sylt.pennergame.de") >= 0) {link = "http://sylt.pennergame.de"}
    if (url.indexOf("www.sylt.pennergame.de") >= 0) {link = "http://www.sylt.pennergame.de"}
    if (url.indexOf("malle.pennergame.de") >= 0) {link = "http://malle.pennergame.de"}
    if (url.indexOf("http://halloweeen.pennergame.de") >= 0) {link = "http://halloweeen.pennergame.de"}
    if (url.indexOf("vatikan.pennergame.de") >= 0) {link = "http://vatikan.pennergame.de"}

    GM_addStyle("input[type=button].formbutton {margin: 4px 8px; padding: 8px; border: 1px solid #0a0; border-radius: 5px; cursor: pointer;} input[type=button].formbutton:hover {border: 1px solid #0c0; color: #fff;}");
    GM_addStyle("input[type=button].formbutton:disabled {color: #888; cursor: default;} input[type=button].formbutton:disabled:hover {border: 1px solid #0a0;}");
    GM_addStyle("div.bottlemenu {position: absolute; z-index: 100; display: block; min-width: 240px; font-size: 10pt; padding: 10px;  background-color: rgb(100, 100, 100, 0.75); border: 1px solid #555; border-radius: 10px;}");

    function _t(t) {
        var ul = "en";
        try {
            ul = navigator.language || navigator.userLanguage;
            ul = ul.split("-")[0];
        } catch(E) {}
        return _tr[ul][t];
    }
    const _tr = {
        "en": {
            "startBot": "Start BOT",
            "stopBot" : "Stop BOT",
            "loading" : "Loading...",
            "stopped" : "Stopped!",
            "searching" : "Searching... reload at ",
            "emptying" : "Emptying shopping cart...",
            "starting" : "Starting search...",
            "fighting" : "Fighting ",
            "bottles" : "Bottles ",
            "sell" : "Sell ",
            "pet" : "Pet straying until ",
        },
        "es": {
            "startBot" : "Start BOT",
            "stopBot" : "Stop BOT",
            "loading" : "Cargando...",
            "stopped" : "Parado!",
            "searching" : "Buscando... recarga a las ",
            "emptying" : "Vaciando carrito de compra...",
            "starting" : "Empezando b&uacute;squeda...",
            "fighting" : "Peleando ",
            "bottles" : "Botellas ",
            "sell" : "Venta ",
            "pet" : "Mascota vagando hasta ",
        },
        "de": {
            "startBot" : "Start BOT",
            "stopBot" : "Stop BOT",
            "loading" : "Laden...",
            "stopped" : "Gestoppt!",
            "searching" : "Suchen... laden bei ",
            "emptying" : "Einkaufswagen leeren...",
            "starting" : "Suche starten...",
            "fighting" : "Angriff ",
            "bottles" : "Flaschen ",
            "sell" : "Verkaufen ",
            "pet" : "Haustier streunen bis ",
        },
    };

    var menu = document.createElement("div");
    menu.setAttribute("class", "bottlemenu");
    menu.setAttribute("style", "top: " + (document.getElementById("header").offsetHeight * 1 - 5) + "px; left: " +
                      (document.getElementById("my-profile-new").getBoundingClientRect().left * 1 - 260) + "px;");
    menu.setAttribute("align", "left");
    menu.innerHTML +=
        '<div align="center" style="margin-bottom: 10px;">'+
        '<input id="startBtn" name="startBtn" class="formbutton" type="button" value="' + _t("startBot") + '">' +
        '</div>'+
        '<div id="out">&nbsp;' + _t("loading") + '...</div>' +
        '<div id="botStatus" style="color: #df2;">&nbsp;</div>' +
        '<div id="petInfo" style="color: #df2;">&nbsp;</div>';
    document.getElementsByTagName("body")[0].appendChild(menu);

    var botStarted = GM_getValue("botStarted", false);
    if (botStarted) {
        document.getElementById("startBtn").value = _t("stopBot");
        _check();
    }
    _petcheck();

    document.getElementById("startBtn").addEventListener("click", function() {
        GM_setValue("botStarted", !botStarted);
        location.reload();
    });

    function _check() {
        log("_check");
        if (!botStarted) {
            _status("Stopped!");
            return;
        }
        _out();
        var botSearch = GM_getValue("botSearch", 0);
        _status(_t("searching") + (new Date(botSearch)).toLocaleTimeString());
        var dif = botSearch - new Date().getTime();
        if (dif > 0) {
            log ("Waiting for " + (dif * 1 + 1000) + "ms");
            window.setTimeout(function() {
                _check();
            }, (dif * 1 + 1000));
            return;
        }
        GM.xmlHttpRequest({
            method: 'GET',
            url: link + '/activities/',
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                try {
                    var xx = content.split('720">12 Stunden</option>')[1].split('<div class')[0].split('Du bist auf')[1].split(':')[0];
                    log("Still searching ?");
                } catch(e) {
                    try{
                        content.split('von der')[1].split('.')[0];
                        _status(_t("emptying"));
                        window.setTimeout(function() {
                            _empty();
                        }, 1000);
                    } catch(e) {
                        try {
                            content.split('12 Stunden</option>')[1].split('</form>')[0].split('value="Sammeln gehen"')[1].split('type')[0];
                            _bottlecheck();
                            _status(_t("starting"));
                            window.setTimeout(function() {
                                _search();
                            }, 2000);
                        } catch(e) {
                            var s = content.search("gerade einen Angriff durch");
                            if (s != -1) {
                                window.setTimeout(function() {
                                    _status(_t("fighting") + document.getElementById("counter1").innerHTML);
                                }, 1000);// 1s
                                window.setTimeout(function() {
                                    _check();
                                }, 600000);// 10min
                            }
                        }
                    }
                }
            }
        });
    }
    function _status(s) {
        document.getElementById("botStatus").innerHTML = s;
    }
    function _out(a, b) {
        document.getElementById("out").innerHTML = '<table><tr><td>' + _t("bottles") + '&nbsp;</td><td>' + GM_getValue("bottles", 0) + '</td></tr><tr><td>' +
            _t("sell") + '&nbsp;</td><td>' + GM_getValue("price", 0) + '&euro;</td></tr></table>';
    }
    function _pet(s){
        document.getElementById("petInfo").innerHTML = s;
    }
    function _petcheck() {
        log("_petcheck");
        GM.xmlHttpRequest({
            method: 'GET',
            url: link + '/pet/',
            onload: function(responseDetails) {
                var zuruecktry = responseDetails.responseText.split('id="pet_roam_time">')[1];
                if (zuruecktry) {
                    var zuruecktry1 = zuruecktry.split('</span>')[0];
                    if (zuruecktry1) {
                        var zuruecktry2 = zuruecktry1.split('(')[1];
                        if (zuruecktry2) {
                            var zuruecktry3 = zuruecktry2.split(',')[0];
                            if (zuruecktry3) {
                                _pet(_t("pet") + (new Date(new Date().getTime() + zuruecktry3 * 1000)).toLocaleTimeString());
                            }
                        }
                    }
                }
            }
        });
    }
    function _bottlecheck() {
        log("_bottlecheck");
        GM.xmlHttpRequest({
            method: 'GET',
            url: link + '/stock/bottle/',
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                var flaschen = content.split('<td align="left" width="250">')[1].split('Preis:')[0].split('<span>')[1].split(' Pfandflaschen')[0].replace(/\s/g, "");
                var cent = content.split('zum akuellen Kurs:')[1].split('</b>')[0].split('euro;')[1].split(' ')[0].replace(/\,/g, ".");
                var preis = Math.round(flaschen * cent) * 1 / 1;
                GM_setValue("bottles", flaschen);
                GM_setValue("price", preis);
                _out();
            }
        });
    }
    function _empty() {
        log("_empty");
        var x = document.createElement("div");
        x.innerHTML = '<form id="myform" name="myform" action="/activities/bottle/" method="post"><input type="hidden" name="type" value="1"><input type="hidden" name="bottlecollect_pending" value="True"></form>';
        document.getElementsByTagName("body")[0].appendChild(x);
        document.myform.submit();
    }
    function _search() {
        log("_search");
        GM_setValue("botSearch", new Date().getTime() + 10 * 61 * 1000);
        var x = document.createElement("div");
        x.innerHTML = '<form id="myform" name="myform" action="/activities/bottle/" method="post"><input type="hidden" name="type" value="1">' +
            '<select name="time" class="dropdown" onchange="FlaschenRechner(this.value)"><option value="10" selected="">10 Minuten</option><option value="30">30 Minuten</option></select>' +
            '<input type="button" class="button_skill" name="Submit2" id="Submit2" onclick="javascript:setupForm(\'/activities/bottle/\')" value="Sammeln gehen">' +
            '<input type="hidden" name="sammeln" value="10"><input type="hidden" name="konzentrieren" value="1">'
            '</form>';
        document.getElementsByTagName("body")[0].appendChild(x);
        document.myform.submit();
    }
    function log(m) {
        console.log((new Date()).toLocaleString() + " - " + m);
    }
})();
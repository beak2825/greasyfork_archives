// ==UserScript==
// @name         rod ASS
// @namespace    http://tampermonkey.net/
// @version      2024.02.13
// @description  try to take over the world! RODAS working time
// @author       NullPointer
// @license      MIT
// @match        https://rodassso.ayesa.com/usuario/*
// @icon         https://rodassso.ayesa.com/images/favicon.ico
// @grant GM.xmlHttpRequest
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487275/rod%20ASS.user.js
// @updateURL https://update.greasyfork.org/scripts/487275/rod%20ASS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("div.formbutton {padding: 4px; border: 1px solid #050; border-radius: 5px; min-width: 100px; background-color: #eee; text-align: center;} div.formbutton:hover {border: 1px solid #080;}");
    GM_addStyle("div.pointer {cursor: pointer;}");
    GM_addStyle("div.left {float: left;}");

    var menu = document.createElement("div");
    menu.setAttribute("id", "rodASSmenu");
    menu.setAttribute("style", "position: absolute; z-index: 100; top: 60px; display: block; padding: 10px; color: #555; font-weight: bold;");
    menu.setAttribute("align", "left");
    document.getElementsByTagName("body")[0].appendChild(menu);

    document.getElementById("rodASSmenu").innerHTML = '<div id="rodASStimeRefreshButton" class="formbutton pointer left" title="Tiempo de trabajo">00:00</div><div id="rodASSfichajes" class="left"></div>';

    function refresh() {
        GM.xmlHttpRequest({
            method: 'GET',
            url: 'https://rodassso.ayesa.com/usuario/datosDiarios.aspx?Fecha='+new Date().toJSON().slice(0,10).split('-').reverse().join('/'),
            onload: function(r) {
                try {
                    var url = "";
                    var rr = r.responseText.split('<span id="Label_Ac1">')[1];
                    var f = "";
                    try {
                        var rrr = rr.split('<div class=" caja_media">')[1].split('</div>')[0];
                        var a = rrr.split('<p');
                        for (var i = 0; i < a.length; i++) {
                            var k = a[i].trim();
                            if (k == "") {
                                continue;
                            }
                            f += '<div class="formbutton left" style="background-image: ' + getImgUrl(k) + '; background-repeat: no-repeat; transform: scale(0.7); margin-right: -18px;">' + getTime(k) + '</div>';
                        }
                        if (a.length > 0) {
                            url = getImgUrl(a[a.length - 1]);
                        }
                    } catch(e1) {
                        console.log(e1);
                    }
                    document.getElementById('rodASStimeRefreshButton').style.backgroundImage = url;
                    document.getElementById('rodASStimeRefreshButton').style.backgroundRepeat = "no-repeat";
                    document.getElementById('rodASStimeRefreshButton').innerHTML = rr.split('</span>')[0];
                    document.getElementById('rodASSfichajes').innerHTML = f;
                } catch(e) {
                    console.log(e);
                }
            }
        });
    }

    function getTime(p) {
        var t = "";
        try {
            t = p.split('">')[1].split('<')[0].replace(' 99 TVR', '');
        } catch(e) {
            //
        }
        return t;
    }

    function getImgUrl(p) {
        var bg = "salida";
        try {
            var a = p.split('class="');
            if (a.length > 0) {
                bg = a[1].split('"')[0];
            }
        } catch(e) {
            //
        }
        return "url('https://rodassso.ayesa.com/images/" + bg + ".fw.png')";
    }

    refresh();

    document.getElementById("rodASStimeRefreshButton").addEventListener("click", function() {
        location.reload();
    });

})();
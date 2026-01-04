// ==UserScript==
// @name         vt portal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  working time for vt portal
// @author       NullPointer
// @license      MIT
// @match        https://visualtime.ibermatica.com/VTPortal/2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ibermatica.com
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/458879/vt%20portal.user.js
// @updateURL https://update.greasyfork.org/scripts/458879/vt%20portal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var menu = document.createElement("div");
    menu.setAttribute("id", "vtmenu");
    menu.setAttribute("style", "position: absolute; z-index: 100; top: 0px; left: 100px; display: block; padding: 11px; color: #080;");
    menu.setAttribute("align", "left");

    window.setTimeout(function() {
        document.getElementsByTagName("body")[0].appendChild(menu);
        if(window.addEventListener) {
            document.getElementsByTagName("body")[0].addEventListener('DOMSubtreeModified', _calc, false);
        } else if(window.attachEvent) {
            document.getElementsByTagName("body")[0].attachEvent('DOMSubtreeModified', _calc, false);
        }
        _calc();
    }, 5000);

    function _calc() {
        var lastCalc = GM_getValue("lastCalc", 0);
        if ((new Date().getTime()) - lastCalc > 10000) {
            window.setTimeout(function(){calc();}, 1000);
            GM_setValue("lastCalc", new Date().getTime());
        }
    }

    function calc() {
        var t = 0;
        var coll = document.getElementsByClassName("listMenuItemContent");
        for (let i = coll.length - 1; i >= 0; i--) {
            var c = coll[i].innerHTML.split('<div data-bind="text: $data.Name">')[1].split('</div>')[0];
            var hm = c.split(":");
            var d = new Date();
            d.setHours(hm[1].trim() * 1, hm[2].trim() * 1, 0);
            if (c.startsWith("Entrada")) {
                if (i == coll.length - 1) {
                    t += new Date().getTime();
                }
                t -= d.getTime();
            } else {
                t += d.getTime();
            }
        }
        var dd = new Date(t);
        var h = dd.getHours() - 1;
        var m = dd.getMinutes();
        document.getElementById("vtmenu").innerHTML = ((h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m);
    }

})();
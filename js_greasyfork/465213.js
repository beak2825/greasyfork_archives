// ==UserScript==
// @name          Website Customizer picker figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.8
// @description   Customize background color
// @author        figuccio
// @match         *://*/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465213/Website%20Customizer%20picker%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/465213/Website%20Customizer%20picker%20figuccio.meta.js
// ==/UserScript==
//Creazione del colorPicker
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
//avvia la funzione dopo che la pagina e stata caricata
$(document).ready(function() {
        var body = document.body;
        var customizer = document.createElement("div");
        customizer.id = "controll";
        customizer.style = "position:fixed; top:200px; left:200px; z-index:99999;";
        body.append(customizer);

        const savedPosition = GM_getValue('boxPosition');
        if (savedPosition) {
            const parsedPosition = JSON.parse(savedPosition);
            if (parsedPosition.top <= window.innerHeight && parsedPosition.left <= window.innerWidth) {
                $(customizer).css({ top: parsedPosition.top, left: parsedPosition.left });
            }
        }

        function makeDraggableLimited(element) {
            element.draggable({
                containment: "window",
                stop: function(event, ui) {
                    GM_setValue('boxPosition', JSON.stringify(ui.position));
                }
            });
        }

        makeDraggableLimited($(customizer));

        function toggleCustomizer() {
            customizer.style.display = (customizer.style.display !== 'none' ? 'none' : 'block');
        }

        GM_registerMenuCommand("Nascondi/Mostra Customizer", toggleCustomizer);

        const userdata = { color: 'Background' };
        var mycolor = GM_getValue(userdata.color, "#00ff00");

        function saveSetting(color) {
            GM_setValue(userdata.color, color);
            $('body').css("background-color", color);
        }

        let throttleTimeout;
        const observer = new MutationObserver(() => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    saveSetting(mycolor);
                    throttleTimeout = null;
                }, 200);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        GM_addStyle(`
            #code { margin-left:1px; color:lime; background-color:brown; border: 2px solid blue; border-radius: 5px; cursor:pointer; }
            #colorinput2 { margin-left:4px; margin-top:4px; background-color:#3b3b3b; color:red; border:2px solid green; border-radius: 5px; cursor:pointer; }
        `);

        customizer.innerHTML = `
            <div style="padding:10px; background-color:white; border-radius:10px; border:4px solid green; width:180px;">
                <div style="display: flex; justify-content: space-between; align-items:center;">
                    <h3 style="margin: 0; color:blue;">Figuccio-Color</h3>
                    <button id="closeButton" style="background-color:red; color:white; border:2px solid blue; border-radius:50%; width:25px; height:25px; cursor:pointer;">X</button>
                </div>
                 <div id="controls" style="display: block;">
                <button id="code">${mycolor}</button> <input type="color" list="colors" id="colorinput2"  value="${mycolor}">
            </div>
        </div>
    `;

        var colorinput2 = document.querySelector('#colorinput2');
        var code = document.querySelector('#code');
        colorinput2.addEventListener('input', function(e) {
            mycolor = e.target.value;
            code.innerHTML = e.target.value;
            saveSetting(mycolor);
        });

        var closeButton = document.querySelector('#closeButton');
        closeButton.addEventListener('click', toggleCustomizer, false);
    });
})();

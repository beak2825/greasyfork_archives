// ==UserScript==
// @name         Globo Full Tab
// @namespace    https://gist.github.com/leonelsr
// @version      0.1.3
// @description  Cria um botão para deixar em Tela Cheia (ou "aba cheia") qualquer vídeo em Globo.com (inclusive G1, Globo Play ou Globosat Play).
// @author       @leonelsr
// @match        *://*.globo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381467/Globo%20Full%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/381467/Globo%20Full%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('GFT adicionando evento.');
    window.addEventListener("load", function () {
        console.log('GFT rodou');
        function addBtn () {
            var btn = document.createElement("button");
            //btn.appendChild(document.createTextNode("Full Tab"));
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.position = 'fixed';
            btn.style.zIndex = 9999;
            btn.id = "fulltab";
            btn.dataset.function = "open";
            btn.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="#333333" d="M22.637,24h-4.381c-0.556,0-1.005-0.362-1.005-0.92 s0.449-1.01,1.005-1.01h2.438l-4.099-4.099c-0.376-0.376-0.376-0.985,0-1.36c0.376-0.376,0.984-0.376,1.36,0l4.099,4.099v-2.433 c0-0.559,0.423-1.011,0.979-1.011c0.559,0,0.951,0.452,0.951,1.011v4.376C23.985,23.397,23.381,24,22.637,24z M14.044,15.389 L9.946,11.29v2.433c0,0.558-0.422,1.01-0.98,1.01c-0.558,0-0.949-0.452-0.949-1.01V9.347C8.016,8.603,8.618,8,9.362,8h4.381 c0.556,0,1.006,0.362,1.006,0.92s-0.45,1.01-1.006,1.01h-2.437l4.099,4.099c0.376,0.375,0.376,0.984,0,1.36 C15.029,15.765,14.419,15.765,14.044,15.389z"></path></svg>';
            btn.style.width = '20px';
            btn.style.height = '20px';
            btn.style.padding = '0';
            btn.style.opacity = '0.07';
            btn.onmouseenter = function () {this.style.opacity = '1'; };
            btn.onmouseleave = function () {this.style.opacity = '0.07'; };

            btn.onclick = function () {
                var e = document.querySelector("[data-player]");
                var evideo = document.querySelector("[data-player] .master-container video");
                var btne = document.querySelector("#fulltab");
                if (btne.dataset.function == 'open') {
                    //e.style.width = "100%";
                    //e.style.height = "100%";
                    e.style.setProperty("width", "100%", "important");
                    e.style.setProperty("height", "100%", "important");
                    evideo.style.setProperty("height", "100%", "important");
                    e.style.position = "fixed";
                    e.style.top = 0;
                    e.style.left = 0;
                    e.style.zIndex = 9998;
                    btne.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path d="M17.7,16.3H22c0.6,0,1,0.4,1,0.9s-0.4,1-1,1h-2.4l4.1,4.1c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0l-4.1-4.1v2.4 c0,0.6-0.4,1-1,1c-0.6,0-1-0.5-1-1v-4.4C16.3,16.9,16.9,16.3,17.7,16.3z M9.7,8.3l4.1,4.1V9.9c0-0.6,0.4-1,1-1c0.6,0,0.9,0.5,0.9,1 v4.4c0,0.7-0.6,1.3-1.3,1.3H10c-0.6,0-1-0.4-1-0.9s0.5-1,1-1h2.4L8.3,9.6c-0.4-0.4-0.4-1,0-1.4C8.7,7.9,9.3,7.9,9.7,8.3z"></path></svg>';
                    btne.dataset.function = 'close';
                } else {
                    e.style.position = "";
                    e.style.top = '';
                    e.style.left = '';
                    evideo.style.height = '';
                    btne.dataset.function = 'open';
                    btn.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="#333333" d="M22.637,24h-4.381c-0.556,0-1.005-0.362-1.005-0.92 s0.449-1.01,1.005-1.01h2.438l-4.099-4.099c-0.376-0.376-0.376-0.985,0-1.36c0.376-0.376,0.984-0.376,1.36,0l4.099,4.099v-2.433 c0-0.559,0.423-1.011,0.979-1.011c0.559,0,0.951,0.452,0.951,1.011v4.376C23.985,23.397,23.381,24,22.637,24z M14.044,15.389 L9.946,11.29v2.433c0,0.558-0.422,1.01-0.98,1.01c-0.558,0-0.949-0.452-0.949-1.01V9.347C8.016,8.603,8.618,8,9.362,8h4.381 c0.556,0,1.006,0.362,1.006,0.92s-0.45,1.01-1.006,1.01h-2.437l4.099,4.099c0.376,0.375,0.376,0.984,0,1.36 C15.029,15.765,14.419,15.765,14.044,15.389z"></path></svg>';
                }
            };

            document.body.appendChild(btn);
        }
        if (document.querySelector("[data-player]")) {
            addBtn();
        }
    });
})();
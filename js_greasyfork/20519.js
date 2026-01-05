// ==UserScript==
// @name         Reddit SideBar Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the right sidebar in reddit, adds a tiny button to click to get it back
// @author       You
// @match        http*://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20519/Reddit%20SideBar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/20519/Reddit%20SideBar%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wrap_el =  document.createElement("div");
    var cont_el =  document.createElement("div");
    var header = document.getElementById("header");

    wrap_el['style'] = ["width:10px",
                        "height:10px",
                        "float:right",
                        ].join(';');
    cont_el['style'] = ["position:absolute",
                        "z-index:9999",
                        "right:0",
                        "border: thin solid orange",
                        "color: #0099FF",
                        "background-color:white",
                        "cursor: pointer",
                        "user-select: none",
                        "-webkit-user-select: none",
                        "-moz-user-select: none",
                        "-ms-user-select: none",
                        "-webkit-touch-callout: none",
                        ].join(';');
    cont_el.textContent = '+';
    header.appendChild(wrap_el);
    wrap_el.appendChild(cont_el);

    var sidebar = document.querySelector(".side");
    sidebar.style.display = 'none';

    cont_el['onclick'] = function(){
        sidebar.style.display = sidebar.style.display == 'none'? '' : 'none';
        cont_el.textContent = sidebar.style.display == 'none'? '+' : '—';
    };
})();
// ==UserScript==
// @name         NHK easy furikana toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www3.nhk.or.jp/news/easy/k10010971381000/k10010971381000.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29613/NHK%20easy%20furikana%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/29613/NHK%20easy%20furikana%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    var state = "on";
    
    var buttons = document.createElement("div");
    buttons.setAttribute("style", "background-color: rgba(255,255,255,0.8);padding:20px;position:fixed;top:0;left;0;");

    var toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle furikana";
    toggleButton.setAttribute("style", "cursor:pointer;font-size:16px;height:60px; border-radius: 10px; border: none;padding:10px;background-color:#FF8D14; color: white;");
    toggleButton.addEventListener("mouseup", function() {
        if(state == "on") {
            $("rt").css("display", "none");
            state = "off";
        }
        else if(state == "off") {
            $("rt").css("display", "block");
            state = "on";
        }
    });
    
    buttons.append(toggleButton);
    document.body.append(buttons);
})();
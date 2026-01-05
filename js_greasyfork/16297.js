// ==UserScript==
// @name        dark-one-fix
// @namespace   dark-one-fix
// @description Adding background color for sites that miss that attribute (see screenshots)
// @include     http://*
// @include     https://*
// @version     0.1.0
// @author      Sergey Ushakov <sergushakov.public@gmail.com>
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16297/dark-one-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16297/dark-one-fix.meta.js
// ==/UserScript==

/* globals window, document, Array */

(function() {
    'use strict';
    
    var bgColor = document.body.style.backgroundColor || "",
        color = document.body.style.color || "",
        inputs = ["input", "textarea"],
        colors = {
            bgColor: "#fff",
            color: "#000"
        },
        mozDefColors = {
            bgColor: "rgb(32, 31, 31)",
            color: "rgb(212, 210, 207)"
        }
    ;
    
    if (bgColor.length === 0) {
        document.body.style.backgroundColor = colors.bgColor;
    }
    
    if (color.length === 0) {
        document.body.style.color = colors.color;
    }

    inputs.forEach(function(selector) {
        
        Array.prototype.forEach.call(document.querySelectorAll(selector), function(x){
            
            var style = window.getComputedStyle(x, null);
            if (style.getPropertyValue("background-color") === mozDefColors.bgColor) {
                x.style.backgroundColor = colors.bgColor;
            }
            
            if (style.getPropertyValue("color") === mozDefColors.color) {
                x.style.color = colors.color;
            }
        });
    });
})();
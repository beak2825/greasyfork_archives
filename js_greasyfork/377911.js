// ==UserScript==
// @name         Remove ADs from blog.sina.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://blog.sina.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377911/Remove%20ADs%20from%20blogsinacom.user.js
// @updateURL https://update.greasyfork.org/scripts/377911/Remove%20ADs%20from%20blogsinacom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('DOMSubtreeModified', function (event) {
        try {
            (Array.from(document.querySelectorAll("div")).filter(d => d.id.indexOf("_panel") >= 0)).forEach(function(item){item.style.display='none'});
            (Array.from(document.querySelectorAll(".sinaad-toolkit-box"))).forEach(function(item){item.style.display='none'});
            (Array.from(document.querySelectorAll("ins"))).forEach(function(item){item.style.display='none'});
            (Array.from(document.querySelectorAll("#sinaAD_type_blogbf"))).forEach(function(item){item.style.display='none'});
            (Array.from(document.querySelectorAll("table"))).filter(t => t.className == "CP_w").filter(t => t.id.indexOf("_panel")).forEach(function(item){item.style.display='none'});
        } catch (error) {
            alert(error);
        }
    }, true);
})();
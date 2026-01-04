// ==UserScript==
// @name         FHP Names
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  puts the right names on the companies page for FHPs
// @author       You
// @match        https://app.goodlord.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389242/FHP%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/389242/FHP%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        setTimeout(function(){
            document.getElementById("checkbox1").addEventListener("change", function(){
                document.querySelector("[data-company_id='1158']").children[0].textContent = 'FHP Living Limited City'
                document.querySelector("[data-company_id='1159']").children[0].textContent = 'FHP Living Limited North'
                document.querySelector("[data-company_id='1160']").children[0].textContent = 'FHP Living Limited South'
                document.querySelector("[data-company_id='1161']").children[0].textContent = 'FHP Living Limited Student'
            })
        }, 200)
    };
})();
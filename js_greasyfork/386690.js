// ==UserScript==
// @name         unpaywall le parisien
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  just remove the blur on text and the modal after you watched 5 articles on leparisien.fr
// @author       Munch
// @match        http://www.leparisien.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386690/unpaywall%20le%20parisien.user.js
// @updateURL https://update.greasyfork.org/scripts/386690/unpaywall%20le%20parisien.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
       var content = document.querySelectorAll(".content");
        for(var i =0; i <content.length;i++){
            content[i].style.filter = null;
        }
        document.querySelectorAll(".piano-paywall")[0].remove();
    },4000)

})();
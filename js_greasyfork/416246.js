// ==UserScript==
// @name         D-BOX Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://axure.yixin.im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416246/D-BOX%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/416246/D-BOX%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var i = 0
        var height = '520px'
        var dropdowns = document.getElementsByClassName('ivu-select-dropdown');
        for(i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.maxHeight = height;
        }
        var menus = document.getElementsByClassName('ivu-cascader-menu');
        for(i = 0; i < menus.length; i++) {
            menus[i].style.height = height;
            menus[i].style.width = 'auto';
        }
    }, 2000);
})();
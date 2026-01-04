// ==UserScript==
// @name         Staff code spoiler
// @namespace    BrotherCash
// @version      0.1
// @description  Collapsing code blocks into spoilers
// @author       @BrotherCash
// @grant        none
// @include     https://staff.megagroup.ru/staff/blog/*
// @downloadURL https://update.greasyfork.org/scripts/374391/Staff%20code%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/374391/Staff%20code%20spoiler.meta.js
// ==/UserScript==
(function(){
    'use strict';
    var spoilerWrap = document.querySelectorAll('pre');

    function toggle(el) {
        el.style.display = (el.style.display == 'none') ? 'block' : 'none';
    }

    for(var i=0; i<spoilerWrap.length; i++) {

        var div = document.createElement('div');
        div.className = "spoilerHeader";
        div.innerHTML = "<label><input type='checkbox' checked>&nbsp;Развернуть/свернуть спойлер</label>";

        spoilerWrap[i].insertBefore(div, spoilerWrap[i].firstChild);
        var codeBlock = spoilerWrap[i].querySelector('code');
        toggle(codeBlock);

        div.addEventListener('mouseup', function(){
            var codeWrap = this.nextElementSibling;
            toggle(codeWrap);
        });
    }
})();
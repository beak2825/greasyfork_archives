// ==UserScript==
// @name         Custom Layout for monkeytype.com (new version)
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  custom keymap overlay for monkeytype
// @author       Sasha231
// @match        https://monkeytype.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439368/Custom%20Layout%20for%20monkeytypecom%20%28new%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439368/Custom%20Layout%20for%20monkeytypecom%20%28new%20version%29.meta.js
// ==/UserScript==

//CASE SENSITIVE! ALL OF THEM HAVE TO BE IN LOWERCASE!!
const row0 = ['1', '2', '3', '4','5','6','7','8','9','0'];
const row1 = ['q', 'w', 'e', 'r','t','y','u','i','o','p'];
const row2 = ['a', 's', 'd', 'f','g','h','j','k','l',';'];
const row3 = ['z', 'x', 'c', 'v','b','n','m','#','#','#'];

//const keys = [...row0, ...row1, ...row2, ...row3]
const keys = [...row1, ...row2, ...row3];

window.addEventListener('load', function() {
    'use strict';

    var cusid_ele = document.getElementsByClassName('keymap-key');
    for (var i = 0; i < cusid_ele.length; ++i) {
        var item = cusid_ele[i];
        item.setAttribute('data-key', keys[i].toUpperCase()+keys[i]);
        item.innerHTML = '<span class="letter">'+keys[i].toUpperCase()+'</span>'
    }

}, false);
// ==UserScript==
// @name         Chonch's True Form
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  Making Chonch's username more fitting
// @author       Sumap
// @match        https://facepunch.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32154/Chonch%27s%20True%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/32154/Chonch%27s%20True%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //Replace Username
    var name = document.getElementsByClassName('username_container');
    for(var x = 0, z = name.length; x < z; x++) {
        var na = name[x];
        na.innerHTML = na.innerHTML.replace(/Chonch/gi, '<font size=0.5>Increasingly Nervious Man</font>');
    }
    
    //Replace quote titles 
    var info = document.getElementsByClassName('information');

    for(var i = 0, l = info.length; i < l; i++) {
        var el = info[i];
        el.innerHTML = el.innerHTML.replace(/Chonch/gi, 'Increasingly Nervious Man');
    }
})();
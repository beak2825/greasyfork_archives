// ==UserScript==
// @name           remove target blank
// @include        *
// @version 0.0.1.20201123
// @description remove target blank,original author:ArmEagle,modify idea from: taoww 
// @run-at document-idle
// @namespace https://greasyfork.org/users/124367
// @downloadURL https://update.greasyfork.org/scripts/416617/remove%20target%20blank.user.js
// @updateURL https://update.greasyfork.org/scripts/416617/remove%20target%20blank.meta.js
// ==/UserScript==
          
if (window.top == window) {
    var ahrefs = document.querySelectorAll('a[target]');
    for ( a_ind = 0; a_ind < ahrefs.length; a_ind++ ) {
        var a = ahrefs[a_ind];
        a.removeAttribute('target');
    }
  
    // remove base target tag
    var bases = document.querySelectorAll("base[target]");
    for (ind = 0; ind < bases.length; ind++) {
        var base = bases[ind];
        base.removeAttribute('target');
    }
}
// ==UserScript==
// @name         kt.gy
// @namespace    kt.gy
// @version      0.2
// @description  kt.gy no more space
// @author       ME
// @include      https://kt.gy/tools.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370860/ktgy.user.js
// @updateURL https://update.greasyfork.org/scripts/370860/ktgy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(e) {
        e = e || window.event;
        var target = e.target ,
            text = target.textContent ,
            parent = target.parentElement ,
            child = parent.childNodes[1] ;
        if ((e.target.className.indexOf('inputLabel') !== -1) && (e.target.className.indexOf('label') !== -1)) {
            alert(child.value.replace(/\s/g,''));
        }

    }, false);

    $('body').css({'background-color' : 'black', 'color' : 'grey'});
    $('textarea').css({'background-color' : 'black', 'color' : 'grey'});
    $('input').css({'background-color' : 'black', 'color' : 'grey'});

})();
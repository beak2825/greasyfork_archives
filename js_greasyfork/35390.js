// ==UserScript==
// @name       Ukryj plusy
// @namespace  *://www.wykop.pl/*
// @version    1.1
// @description ukrywa plusy
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/35390/Ukryj%20plusy.user.js
// @updateURL https://update.greasyfork.org/scripts/35390/Ukryj%20plusy.meta.js
// ==/UserScript==

(function(){
    var x = document.getElementsByClassName('author ellipsis ');
    for(var i=0, j=x.length;i<j;i++){
        x[i].getElementsByTagName('p')[0].style.display="none";
    }
})();
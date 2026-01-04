// ==UserScript==
// @name       naprawianie obrazkow
// @namespace  http://www.wykop.pl/*
// @version    1.0
// @description Obrazki działają
// @include     *://www.wykop.pl/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/33584/naprawianie%20obrazkow.user.js
// @updateURL https://update.greasyfork.org/scripts/33584/naprawianie%20obrazkow.meta.js
// ==/UserScript==
(function(){
var s = setInterval(function(){
var x = document.getElementsByClassName('media-content hide-image');
for(var i=0, j=x.length;i<j;i++){
var k =  x[i].getElementsByTagName('a')[0];
k.click();
}
}, 1000);
})();

// ==UserScript==
// @name           Tate
// @version        0.1
// @description  Reduces the size of the original picture and open it in a new window
// @author         Cristo
// @include        https://www.mturkcontent.com/dynamic/*
// @copyright     1012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/4962/Tate.user.js
// @updateURL https://update.greasyfork.org/scripts/4962/Tate.meta.js
// ==/UserScript==

var page = document.getElementById('mturk_form');
var imagy = page.getElementsByTagName('img')[0];
imagy.style.height = '200px';
imagy.style.width = '200px';

var newWidth;
var newLeft;
if (window.screenX > (screen.width - (window.screenX + window.outerWidth))) {
    newWidth = window.screenX;						
    newLeft = "0";									
} else {											
    newWidth = screen.width - (window.screenX + window.outerWidth);		
    newLeft = window.screenX + window.outerWidth;
}
if (newWidth < screen.width/3) {
    window.open(imagy.src);
} else {
    var windowTo  = 'width=' + newWidth;
    windowTo += ', height=' + screen.height;
    windowTo += ', top=' + "0"; 
    windowTo += ', left=' + newLeft;
    window.open(imagy.src, "name", windowTo);  
}


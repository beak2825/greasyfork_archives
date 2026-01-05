// ==UserScript==
// @name          	Add Numbers To Scouting Bars
// @description    	Adds numbers to GLB scouting bars
// @include        	http://goallineblitz.com/*
// @author		pabst
// @version      	09.02.04
// @namespace https://greasyfork.org/users/1870
// @downloadURL https://update.greasyfork.org/scripts/1394/Add%20Numbers%20To%20Scouting%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/1394/Add%20Numbers%20To%20Scouting%20Bars.meta.js
// ==/UserScript==

window.setTimeout(function(){ 
    var bars = document.getElementsByClassName('rating_bar_fill');
    for (var i=0; i<bars.length; i++){ 
        bars[ i ].innerHTML = parseInt(bars[ i ].style.width);
    }
}, 100);

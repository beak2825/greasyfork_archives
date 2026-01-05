// ==UserScript==
// @name         GommeHD Namechange
// @namespace    *
// @version      0.3
// @description  enter something useful
// @author       Midnight Myth
// @include        http*://*.gommehd.net/*
// @downloadURL https://update.greasyfork.org/scripts/23201/GommeHD%20Namechange.user.js
// @updateURL https://update.greasyfork.org/scripts/23201/GommeHD%20Namechange.meta.js
// ==/UserScript==

if(document.title == 'Seelenwanderer | GommeHD.net'){
    document.title = 'Seelenlauch | GommeHD.net';
}

var seele4 = document.getElementsByTagName('dt');
for (var i = 0; i < seele4.length; ++i) {
    var item = seele4[i];
    if(item.innerHTML == 'Seelenwanderer wurde zuletzt gesehen:'){
    item.innerHTML = 'Seelenlauch wurde zuletzt gesehen:';
    }
}

var seele3 = document.getElementsByClassName('username');
for (var i = 0; i < seele3.length; ++i) {
    var item = seele3[i];
    if(item.innerHTML == 'Seelenwanderer'){
    item.innerHTML = 'Seelenlauch';
    }
}

var seele = document.getElementsByClassName('style14');
for (var i = 0; i < seele.length; ++i) {
    var item = seele[i];
    if(item.innerHTML == 'Seelenwanderer'){
    item.innerHTML = 'Seelenlauch';
    }
}


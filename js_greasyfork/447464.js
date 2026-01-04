// ==UserScript==
// @name        Dragcave egg monitor
// @namespace   http://localhost
// @description Monitor the location page and catch the egg you want.
// @include     *//dragcave.net/locations/*
// @version     1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/447464/Dragcave%20egg%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/447464/Dragcave%20egg%20monitor.meta.js
// ==/UserScript==
var container = document.getElementsByClassName("eggs");
for (var l = 0; l < container.length; l++) {
    container[l].setAttribute('id', 'eggs');
    var eggs = document.getElementById("eggs");
    var divs = eggs.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
// See how the pattern goes and update the text for new releases and all the good stuff ^_^
        if ((divs[i].innerHTML.indexOf("Mana courses throughout this glassy egg") != -1) || (divs[i].innerHTML.indexOf("Something about this egg seems to lure you in") != -1)) { 
            var div = divs[i];
            var link = divs[i].innerHTML.href;
            for (var b = 0; b < div.childNodes.length; b++) {
                var test = div.childNodes[0].href;
                //window.location.href = test;
open_tab(test);
            }
        }
    }
}

setTimeout(function () { window.location.href = window.location.href }, 500);

function open_tab(url )
{
  var win=window.open(url, '_self');
  win.focus();
}
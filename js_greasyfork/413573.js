// ==UserScript==
// @name         Berlex Color Support
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds color support to the Berlex Forums.
// @author       exampledev
// @match        http://ezekia.endl.site/forum/view-thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413573/Berlex%20Color%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/413573/Berlex%20Color%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // red
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[r\](.*)\[\]/g, "<font color=\"red\">$1</font>")
    // blue
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[b\](.*)\[\]/g, "<font color=\"blue\">$1</font>")
    // green
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[g\](.*)\[\]/g, "<font color=\"green\">$1</font>")
    // bold
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace('[bold]', '<b>')
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace('[/bold]', '</b>')
    // hex colors! yay
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[(#.*)\](.*)\[\]/g, "<span style=\"color: $1;\">$2</span>")
    // link
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace('[link]', '<a href="#" style="color: #59d3ff">')
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace('[/link]', '</a>')
    // image
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[img\](.*)\[\/img\]/g, "<img src=\"$1\" />")
    // video
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[video\](.*)\[\/video\]/g, "<video controls><source src=\"$1\">Your browser does not support HTML video.</video>")
    // iframe
    document.getElementsByClassName('col-md-8 text-black')[0].innerHTML = document.getElementsByClassName('col-md-8 text-black')[0].innerHTML.replace(/\[iframe\](.*)\[\/iframe\]/g, '<iframe src=\"$1\" frameborder=0 style="resize: both;"></iframe>')
})();
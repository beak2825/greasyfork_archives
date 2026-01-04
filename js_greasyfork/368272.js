// ==UserScript==
// @name         cda.pl - łatwe pobieranie filmów za darmo
// @include      https://www.cda.pl/video/*
// @version      0.1
// @description  pobierz i miej lepsze życie
// @author       You
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/368272/cdapl%20-%20%C5%82atwe%20pobieranie%20film%C3%B3w%20za%20darmo.user.js
// @updateURL https://update.greasyfork.org/scripts/368272/cdapl%20-%20%C5%82atwe%20pobieranie%20film%C3%B3w%20za%20darmo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var answer = confirm("Przejść do filmu?")
    if (answer) {
    if(window.location.href.search("cda.pl/video")!=-1){window.location.href=document.getElementsByTagName('html')[0].innerHTML.substring(document.getElementsByTagName('html')[0].innerHTML.search("preload=\"none\"") + 20, document.getElementsByTagName('html')[0].innerHTML.search("mp4")+3);}
    }
    })();
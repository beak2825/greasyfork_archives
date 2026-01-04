// ==UserScript==
// @name         Auto_StartNext
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate next race start after finish
// @author       оООооООо
// @include      https://klavogonki.ru/g/*
// @include      http://klavogonki.ru/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404428/Auto_StartNext.user.js
// @updateURL https://update.greasyfork.org/scripts/404428/Auto_StartNext.meta.js
// ==/UserScript==

setInterval(function(){
    var start = document.querySelector('#host_start[style=""]');
    var finished = document.querySelector('.delresult img');
    if(start){
        game.hostStart();
    } else if (finished){
        var getUrl = window.location.toString().match(/\d/g).join('');
        window.location='/g/' + getUrl + '.replay';
    } else {}
}, 500);
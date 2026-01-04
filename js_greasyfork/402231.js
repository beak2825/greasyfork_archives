// ==UserScript==
// @name         Скрипт для BR
// @namespace    Script for PetriDish.pw
// @version      1.2
// @description  macro, autorespawn, command
// @author       Mist
// @match        http://petridish.pw/ru/*
// @match        http://petridish.pw/en/*
// @match        http://donate.petridish.pw/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/402231/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/402231/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20BR.meta.js
// ==/UserScript==

window.onload = setTimeout(function() {
var script = document.createElement('script');
script.src = 'http://mist2020.000webhostapp.com/script_for_BR_and_BZZ.js?' + parseInt(new Date().getTime()/1000);
document.getElementsByTagName('body')[0].appendChild(script);
}, 1000);
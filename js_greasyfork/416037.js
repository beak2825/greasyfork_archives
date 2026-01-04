// ==UserScript==
// @name         Скрипт для BR(Бот на центр)
// @namespace    Script for PetriDish.pw
// @version      5.0
// @description  macro, autorespawn
// @author       Mist
// @match        http://petridish.pw/ru/*
// @match        http://petridish.pw/en/*
// @match        http://donate.petridish.pw/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/416037/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20BR%28%D0%91%D0%BE%D1%82%20%D0%BD%D0%B0%20%D1%86%D0%B5%D0%BD%D1%82%D1%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416037/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20BR%28%D0%91%D0%BE%D1%82%20%D0%BD%D0%B0%20%D1%86%D0%B5%D0%BD%D1%82%D1%80%29.meta.js
// ==/UserScript==

window.onload = setTimeout(function() {
var script = document.createElement('script');
script.src = 'http://mist2020-2.1gb.ua/petridish.pw/script_for_BR_and_BZZ.js?' + parseInt(new Date().getTime()/1000);
document.getElementsByTagName('body')[0].appendChild(script);
}, 1000);
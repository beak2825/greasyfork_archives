// ==UserScript==
// @name         Чекер серверов PetriDish.pw
// @namespace    Script for PetriDish.pw
// @version      1.2
// @description  Checking, macro, command
// @author       Mist
// @match        http://petridish.pw/ru/*
// @match        http://petridish.pw/en/*
// @match        http://donate.petridish.pw/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/401107/%D0%A7%D0%B5%D0%BA%D0%B5%D1%80%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2%20PetriDishpw.user.js
// @updateURL https://update.greasyfork.org/scripts/401107/%D0%A7%D0%B5%D0%BA%D0%B5%D1%80%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2%20PetriDishpw.meta.js
// ==/UserScript==

window.onload = setTimeout(function() {
var script = document.createElement('script');
script.src = 'http://mist2020.000webhostapp.com/CheckingServers.js?' + parseInt(new Date().getTime()/1000);
document.getElementsByTagName('body')[0].appendChild(script);
}, 1000);
// ==UserScript==
// @name        Osiris-Anti-S
// @namespace   nl.ru.sis
// @description Remove S on Osiris RU
// @include     https://sis.ru.nl/student/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4364/Osiris-Anti-S.user.js
// @updateURL https://update.greasyfork.org/scripts/4364/Osiris-Anti-S.meta.js
// ==/UserScript==

var input = document.querySelector('input[name=gebruikersNaam]');
var onChange = function (){
  input.value = input.value.replace(/s/, '');
};


input.addEventListener('keyup', onChange);
input.addEventListener('change', onChange);

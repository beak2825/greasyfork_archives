// ==UserScript==
// @name         Pikabu oldschool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       hant0508
// @description  Возвращает Бровастика в футер Пикабу
// @include      http://pikabu.ru/*
// @include      https://pikabu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22685/Pikabu%20oldschool.user.js
// @updateURL https://update.greasyfork.org/scripts/22685/Pikabu%20oldschool.meta.js
// ==/UserScript==

if(document.getElementById("brovdiv") !== null) {
  var brov = "http://cs.pikabu.ru/images/fun/chel.png";
  var elm = document.getElementById("brovdiv").children[0];
  elm.href = "http://pikabu.ru/profile/hant0508";
  if (elm.src !== undefined) elm.src = brov;
  else {
    elm.children[0].src = brov;
    elm.children[0].title = "Бровастик by hant0508";
}}
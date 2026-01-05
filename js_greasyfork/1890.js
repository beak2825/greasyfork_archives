// ==UserScript==
// @name        Radikal.ru: fix
// @namespace   http://userscripts.org/scripts/show/181126
// @description показ картинок с отключенным js для сайта
// @include     http://radikal-foto.ru/fp/*
// @include     http://radical-foto.ru/fp/*
// @include     http://radikal.ru/fp/*
// @include     http://radikal.ru/lfp/*
// @include     http://radikal.ru/big/*
// @include     http://f-page.ru/fp/*
// @include     http://f-page.ru/lfp/*
// @include     http://f-lite.ru/lfp/*
// @include     http://0xff.pro/fp/*
// @include     http://f-picture.net/lfp/*
// @include     http://f-picture.net/fp/*
// @include     https://radikal.ru/*
// @version     1.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1890/Radikalru%3A%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/1890/Radikalru%3A%20fix.meta.js
// ==/UserScript==

var re = /\"Url\":\"(.*?)\"/i;
document.body.innerHTML = "<img src=\""+document.body.innerHTML.match(re)[1]+"\" />";
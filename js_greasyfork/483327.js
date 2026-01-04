// ==UserScript==
// @name Pinterest Redirect to RU
// @version 1.0
// @license MIT
// @description Переадресовывает на домен с русской локализацией, без потери открытого пина или другой страницы
// @match     https://*.pinterest.at/*
// @match     https://*.pinterest.ca/*
// @match     https://*.pinterest.ch/*
// @match     https://*.pinterest.cl/*
// @match     https://*.pinterest.co.kr/*
// @match     https://*.pinterest.co.uk/*
// @match     https://*.pinterest.com.au/*
// @match     https://*.pinterest.com.mx/*
// @match     https://*.pinterest.de/*
// @match     https://*.pinterest.dk/*
// @match     https://*.pinterest.es/*
// @match     https://*.pinterest.fr/*
// @match     https://*.pinterest.ie/*
// @match     https://*.pinterest.info/*
// @match     https://*.pinterest.it/*
// @match     https://*.pinterest.jp/*
// @match     https://*.pinterest.nz/*
// @match     https://*.pinterest.ph/*
// @match     https://*.pinterest.pt/*
// @match     https://*.pinterest.se/*
// @exclude https://ru.pinterest.com/*
// @exclude https://pinterest.ru/*
// @grant none
// @namespace https://greasyfork.org/users/1240400
// @downloadURL https://update.greasyfork.org/scripts/483327/Pinterest%20Redirect%20to%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/483327/Pinterest%20Redirect%20to%20RU.meta.js
// ==/UserScript==

let currentUrl = window.location.href;
let regex = /www\.pinterest\.(at|ca|ch|cl|co\.kr|co\.uk|com\.au|com\.mx|de|dk|es|fr|ie|info|it|jp|nz|ph|pt|se|)/;

let newUrl = currentUrl.replace(regex, 'ru.pinterest.com');

window.location.replace(newUrl);
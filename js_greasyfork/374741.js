// ==UserScript==
// @name         faviconizer
// @namespace    01
// @version      0.1
// @description  Show favicons for links.
// @author       fbr10
// @exclude      https://www.yandex.ru/search/*
// @exclude      https://www.google.ru/search*
// @exclude      https://www.bing.com/search*
// @exclude      https://nova.rambler.ru/search*
// @include      *://*/*
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374741/faviconizer.user.js
// @updateURL https://update.greasyfork.org/scripts/374741/faviconizer.meta.js
// ==/UserScript==

(function(d) {
    'use strict';

  var faviconDiv = d.createElement('div');
  faviconDiv.style.display = 'none';
  faviconDiv.style.position = 'fixed';
  faviconDiv.style.width = '16px';
  faviconDiv.style.height = '16px';
  faviconDiv.style.border = '1px solid red';
  faviconDiv.style.boxShadow = '3px 3px 5px #808080';
  faviconDiv.style.zIndex = '9999';
  var favicon = d.createElement('img');
  faviconDiv.appendChild(favicon);
  d.body.appendChild(faviconDiv);

  var a = d.querySelectorAll('a');
  for (var i = 0; i < a.length; i++) {
    a[i].addEventListener("mouseover", faviconizer, false);
    a[i].addEventListener("mouseout", clean, false);
  };

  function faviconizer (event) {
    var host = this.host.replace(/www\./, "");
    var localhost = d.location.host.replace(/www\./, "");

    if (host === '' || host === localhost) {
        return
    } else {

    favicon.src = "https://www.google.com/s2/favicons?domain=" + host;

    faviconDiv.style.left = event.clientX + 30 + 'px';
    faviconDiv.style.top = event.clientY - 30 + 'px';
    faviconDiv.style.display = 'block';
  };
};

  function clean() {
    faviconDiv.style.display = 'none';
  };

})(document);
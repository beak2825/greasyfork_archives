// ==UserScript==
// @name TwitterOrig
// @namespace RudiaS
// @version 1.0
// @description Oriented original pixel size file when viewing Twitter image.
// @author RudiaS
// @homepage https://greasyfork.org/zh-TW/users/1026053-rudias
// @match https://pbs.twimg.com/media/*
// @icon https://www.google.com/s2/favicons?domain=twitter.com/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/459909/TwitterOrig.user.js
// @updateURL https://update.greasyfork.org/scripts/459909/TwitterOrig.meta.js
// ==/UserScript==

if (!sessionStorage.getItem('executed')) {
  sessionStorage.setItem('executed', true);

  (function() {
    'use strict';

    const currentUrl = window.location.href;
    let format = 'jpg';
    let regex = /(.*\/media\/)([\w-]+)(\?format=)(png|jpg)(&name=)(.*)/g;
    let match = regex.exec(currentUrl);

    if (!match) {
      regex = /(.*\/media\/)([\w-]+)\.(png|jpg)/g;
      match = regex.exec(currentUrl);
      if (match) {
        format = match[3];
      }

      let newUrl = match[1] + match[2] + "?format=" + format + "&name=orig";
      window.location.href = newUrl;
    } else {
      const newUrl = currentUrl.replace(regex, "$1$2?format=$4&name=orig");
      window.location.href = newUrl;
    }
  })();
}
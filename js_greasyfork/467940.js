// ==UserScript==
// @name         Shazam's Snay.io script
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A script that updates automatically, to bring you cool features for Snay.io.
// @author       ShazamHax
// @match        https://www.snay.io/*
// @license      MIT
// @icon         https://yt3.googleusercontent.com/TNVorEJ9iTsESmUbcZXizwaZgy5jB-Ihx3z9qxfuuatrFRDhJHotz5x_X7mGIu38VBsr5bvlkg=s176-c-k-c0x00ffffff-no-rj
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467940/Shazam%27s%20Snayio%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/467940/Shazam%27s%20Snayio%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fetch('https://raw.githubusercontent.com/ShazamHax/Snay.io-Script/main/ScriptCode.js')
  .then(response => response.text())
  .then(text => {
        var scriptCode = Function(text);
		scriptCode();
  })
  .catch(error => {
    console.error('Error:', error);
  });


})();

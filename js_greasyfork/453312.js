// ==UserScript==
// @name         Grenade Mod(change icons)| Shell Shockers | flygOn LiTe
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Change grenade icons in shell shockers
// @author       flygOn LiTe
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @icon         https://www.berrywidgets.com/assets/babyflygon-grenade.png
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453312/Grenade%20Mod%28change%20icons%29%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.user.js
// @updateURL https://update.greasyfork.org/scripts/453312/Grenade%20Mod%28change%20icons%29%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.meta.js
// ==/UserScript==

var open_prototype = XMLHttpRequest.prototype.open,
  intercept_response = function (callback) {
    XMLHttpRequest.prototype.open = function (method, url) {
      if (url.indexOf("shellshock.js") > -1) this.isScript = true;
      this.addEventListener("readystatechange", function (event) {
        if (this.readyState === 4 && this.isScript) {
          var response = callback(event.target.responseText);
          Object.defineProperty(this, "response", { writable: true });
          Object.defineProperty(this, "responseText", { writable: true });
          this.response = this.responseText = response;
        }
      });
      return open_prototype.apply(this, arguments);
    };
  };

intercept_response(function (response) {

  let flygonGrenade = response.replace(
    "img/ico_grenade.png?v=1",
    "https://www.berrywidgets.com/assets/babyflygon-grenade.png"
  );
  let finalResponse = flygonGrenade.replace(
    "img/ico_grenadeEmpty.png?v=1",
    "https://www.berrywidgets.com/assets/babyflygon-grenade-back.png"
  );
  return finalResponse;
});
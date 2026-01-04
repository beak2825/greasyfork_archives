// ==UserScript==
// @name         ToDesk 云游戏
// @namespace    https://daas.todesk.com/
// @version      1.2
// @description  针对todesk云电脑Web版 https://daas.todesk.com/ ，非华南地区启用云游戏功能，尽情享受!
// @author       anonymous
// @match        *://daas.todesk.com/*
// @match        *://daas-beta.todesk.com/*
// @icon         https://daas.todesk.com/console/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511871/ToDesk%20%E4%BA%91%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/511871/ToDesk%20%E4%BA%91%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const accessorResponseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
  accessorResponseText && Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
    get: function () {
      if ('responseHOOK' in this) return this.responseHOOK;
      return accessorResponseText.get.call(this);
    },
    set: function (str) {
      this.responseHOOK = str;
    },
    configurable: true
  });

  const accessorResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
  accessorResponse && Object.defineProperty(XMLHttpRequest.prototype, 'response', {
    get: function () {
      if ('responseHOOK' in this) return this.responseHOOK;
      return accessorResponse.get.call(this);
    },
    set: function (str) {
      this.responseHOOK = str;
    },
    configurable: true
  });

  const rawSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const originOnLoadEnd = this.onloadend;
    originOnLoadEnd && (this.onloadend = function () {
      if (this.responseURL.indexOf(`menu-service/daas/menus`) > -1) {
        this.response = this.response.replace('false', 'true');
        console.log(`%c menu-service/daas/menus: ${this.responseText}`, 'color: #ff0000; font-size: 14px; font-family: Monaco;');
      }
      if (originOnLoadEnd) {
        originOnLoadEnd.apply(this, arguments);
      }
    });
    rawSend.apply(this, arguments);
  };

})();
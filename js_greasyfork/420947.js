// ==UserScript==
// @name          Transparent standalone images
// @description   By default, the transparency of an image opened in a separate tab is indicated by a gray color. This script replaces it with a checkerboard pattern
// @version       3.0.1
// @match         *://*/*
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://i.imgur.com/KoWq1T8.png
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-end
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420947/Transparent%20standalone%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/420947/Transparent%20standalone%20images.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
  'use strict';

  const checkerboardsTypes = {
    base64: 'base64',
    gradient: 'gradient',
  };

  let menuId = null;
  let selectedCheckerboardType = GM_getValue(
    'selectedCheckerboardType', checkerboardsTypes.base64
  );

  if (window.top === window) {
    (function updateMenu() {
      if (menuId) GM_unregisterMenuCommand(menuId);

      const nextTypeMap = {
        [checkerboardsTypes.base64]: checkerboardsTypes.gradient,
        [checkerboardsTypes.gradient]: checkerboardsTypes.base64,
      };
      const nextType = nextTypeMap[selectedCheckerboardType];
      const menuText = `Change checkerboard type to ${nextType}`;

      menuId = GM_registerMenuCommand(menuText, () => {
        selectedCheckerboardType = nextType;
        GM_setValue('selectedCheckerboardType', nextType);
        updateMenu();

        const now = Date.now();
        const lastAlertTime = GM_getValue('lastCheckerboardChangeAlert', 0);
        const alertCooldown = 60 * 60 * 1000;

        if (now - lastAlertTime > alertCooldown) {
          GM_setValue('lastCheckerboardChangeAlert', now);
          alert(
            'Page reload is required for the checkerboard change to take effect'
          );
        }
      });
    }());
  }

  const checkerboards = {
    [checkerboardsTypes.base64]: [
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/`,
      `svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'`,
      ` preserveAspectRatio='xMidYMid meet' viewBox='0 0 640 640' wi`,
      `dth='24' height='24'%3E%3Cdefs%3E%3Cpath d='M320 0L640 0L640 `,
      `320L320 320L320 0Z' id='b6DWnM2ePn'/%3E%3Cpath d='M0 320L320 `,
      `320L320 640L0 640L0 320Z' id='ganUJTlXG'/%3E%3Cpath d='M0 0L3`,
      `20 0L320 320L0 320L0 0Z' id='aHdoSdhJb'/%3E%3Cpath d='M320 32`,
      `0L640 320L640 640L320 640L320 320Z' id='a3CbarKBKc'/%3E%3C/de`,
      `fs%3E%3Cg%3E%3Cg%3E%3Cuse xlink:href='%23b6DWnM2ePn' opacity=`,
      `'1' fill='%23cccccc' fill-opacity='1'/%3E%3C/g%3E%3Cg%3E%3Cus`,
      `e xlink:href='%23ganUJTlXG' opacity='1' fill='%23cccccc' fill`,
      `-opacity='1'/%3E%3C/g%3E%3Cg%3E%3Cuse xlink:href='%23aHdoSdhJ`,
      `b' opacity='1' fill='%23ffffff' fill-opacity='1'/%3E%3C/g%3E%`,
      `3Cg%3E%3Cuse xlink:href='%23a3CbarKBKc' opacity='1' fill='%23`,
      `ffffff' fill-opacity='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !imp`,
      `ortant`
    ].join(''),

    [checkerboardsTypes.gradient]: [
      'repeating-conic-gradient(#ccc 0deg 90deg, #fff 90deg 180deg, ',
      '#ccc 180deg 270deg, #fff 270deg 360deg) top left / 24px 24px ',
      '!important'
    ].join(''),
  };

  if (!document.contentType.startsWith('image/')) return;

  GM_addStyle(`
    @media not print {
      body > img:first-of-type {
        background: ${checkerboards[selectedCheckerboardType]};
      }
    }
  `);
}());

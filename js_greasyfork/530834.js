// ==UserScript==
// @name         Freigegebenen Einsatz markieren
// @namespace    leeSalami.lss
// @version      1.0
// @description  Färbt das Symbol vor dem Einsatznamen ein, falls der Einsatz im Verband freigegeben wurde
// @author       leeSalami
// @license      All Rights Reserved
// @match        https://*.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/530834/Freigegebenen%20Einsatz%20markieren.user.js
// @updateURL https://update.greasyfork.org/scripts/530834/Freigegebenen%20Einsatz%20markieren.meta.js
// ==/UserScript==

(() => {
  'use strict'

  if (!document.getElementById('new_mission_reply')) {
    return;
  }

  GM_addStyle(`
    #missionH1 > span.glyphicon {
      color: #5cb85c;
    }`);
})()

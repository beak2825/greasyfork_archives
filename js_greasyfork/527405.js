// ==UserScript==
// @name         Anzahl möglicher Einsätze ausgeben
// @namespace    leeSalami.lss
// @version      1.0.1
// @description  Zeigt die maximal mögliche Einsatzzahl im Tooltip der Einsatzfilter.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/527405/Anzahl%20m%C3%B6glicher%20Eins%C3%A4tze%20ausgeben.user.js
// @updateURL https://update.greasyfork.org/scripts/527405/Anzahl%20m%C3%B6glicher%20Eins%C3%A4tze%20ausgeben.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const missionSelectionElement = document.getElementById('mission_select_emergency');

  if (missionSelectionElement) {
    missionSelectionElement.title += ` | Maximal: ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(mission_count_max)}`;
  }

  const missionSwElement = document.getElementById('mission_select_sicherheitswache');

  if (missionSwElement) {
    missionSwElement.title += ` | Maximal: ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(timed_mission_count_max)}`;
  }
})();

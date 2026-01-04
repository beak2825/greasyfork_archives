// ==UserScript==
// @name         BS Modul Updater
// @namespace    https://bs.to/
// @version      3.2
// @description  Aktualisiert das Neueste Episoden und Serien Modul ohne Reload
// @author       Asu
// @match        https://bs.to
// @match        https://bs.to/home
// @icon         https://bs.to/favicon.ico
// @require      https://greasyfork.org/scripts/375096-bs-library/code/BS_Library.js?version=653622
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368789/BS%20Modul%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/368789/BS%20Modul%20Updater.meta.js
// ==/UserScript==
// jshint esversion: 6
const BS = window.BS;
const interval = 1000 * 60; //Intervall in Millisekunden (1000ms * 60 = 1min)

(function() {
    'use strict';
    setInterval(() => {
        BS.Module.MultiUpdate(['#newest_episodes', '#newest_series']);
    }, interval);
})();
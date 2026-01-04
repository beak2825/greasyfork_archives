// ==UserScript==
// @name         qbittorrent auto-set Downloading tab
// @namespace    https://greasyfork.org/en/scripts/483530
// @version      0.3.2
// @description  Set qbit status tab to "Downloading" in webUI to prevent loading all torrents
// @author       monad
// @match        http*://192.168.178.23:8080*
// @match        http*://QBIT_IP:PORT         /* have to edit this */

// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/New_qBittorrent_Logo.svg/240px-New_qBittorrent_Logo.svg.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483530/qbittorrent%20auto-set%20Downloading%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/483530/qbittorrent%20auto-set%20Downloading%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.setItem('selected_filter', 'downloading');
    localStorage.setItem('selected_category', '');
    localStorage.setItem('selected_tag', '');
    localStorage.setItem('selected_tracker', '');
    localStorage.setItem('filter_tracker_collapsed', 'true');
})();
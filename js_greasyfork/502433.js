// ==UserScript==
// @name         Deannoy proxmox ve
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the annoying subscription popup from proxmox ve web ui.
// @author       u-foka
// @include      https://*:8006/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502433/Deannoy%20proxmox%20ve.user.js
// @updateURL https://update.greasyfork.org/scripts/502433/Deannoy%20proxmox%20ve.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable subscription popup
    Proxmox.Utils.checked_command = function(orig){ orig(); };
})();
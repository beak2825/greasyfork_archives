// ==UserScript==
// @name         Free3D Paid models remover
// @namespace    https://greasyfork.org/es/scripts/404337-free3d-paid-models-remover
// @version      0.1
// @description  Removes paid models from catalogue
// @author       DonNadie
// @match        https://free3d.com/3d-models/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404337/Free3D%20Paid%20models%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/404337/Free3D%20Paid%20models%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.search-result.premium').forEach(el => el.remove());
})();
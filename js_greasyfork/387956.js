// ==UserScript==
// @name         Wix Ad Remover
// @namespace    cytrostudios.ga
// @version      1.0
// @description  Removes Wix Ads
// @author       Cytro Studios
// @match        https://*.wixsite.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387956/Wix%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/387956/Wix%20Ad%20Remover.meta.js
// ==/UserScript==

var element = document.querySelector('#top');
element.style.opacity = '0';
element.style.height = '0';
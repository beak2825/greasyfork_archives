// ==UserScript==
// @name         Murus Script Tag Testing
// @namespace    https://poplar.studio
// @version      0.1
// @description  Script Tag Test
// @author       Ollie Poplar
// @match        https://murus.art/*
// @icon         https://www.google.com/s2/favicons?domain=murus.art
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428598/Murus%20Script%20Tag%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/428598/Murus%20Script%20Tag%20Testing.meta.js
// ==/UserScript==

const script = document.createElement('script');
script.src = 'https://embed-tags.poplar.studio/murus-tag.js';
document.head.appendChild(script);
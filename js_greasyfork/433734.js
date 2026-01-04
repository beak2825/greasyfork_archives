// ==UserScript==
// @name         Poplar Script Tag Testing
// @namespace    https://poplar.studio
// @version      0.2
// @description  Script Tag Test
// @author       Ollie Poplar
// @icon         https://www.google.com/s2/favicons?domain=poplar.studio
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433734/Poplar%20Script%20Tag%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/433734/Poplar%20Script%20Tag%20Testing.meta.js
// ==/UserScript==

const tagName='murus-tag';
const query='';
const script = document.createElement('script');
script.src = `http://192.168.1.224:8080/compressed/murus-tag.js`;
document.head.appendChild(script);
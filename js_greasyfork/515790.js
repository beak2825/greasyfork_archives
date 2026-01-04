// ==UserScript==
// @name         JobNinja Clickout Debugger
// @namespace    http://jobninja.com/
// @version      0.0.3
// @description  JobNinja Clickout Debugger - This script does: - Adds timeout to the JobNinja clickouts for debugging.
// @author       Andy Werner
// @match        *://*.jobninja.com/*
// @include      https://*-jobninja.vercel.app/*
// @match        http://localhost:3000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jobninja.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515790/JobNinja%20Clickout%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/515790/JobNinja%20Clickout%20Debugger.meta.js
// ==/UserScript==

const LOG_ID = `UserScript '${GM_info.script.name}': `;
console.log(`${LOG_ID} Hello world!`)

window.jn_debug_timeout_before = 5000;
window.jn_debug_timeout_after = 5000;




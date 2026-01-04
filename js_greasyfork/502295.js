// ==UserScript==
// @name         Redo Commerce Cloud
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redo Commerce Cloud test
// @author       Redo
// @match        https://staging-na01-bodyguardz.demandware.net/*
// @match        bodyguardz.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502295/Redo%20Commerce%20Cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/502295/Redo%20Commerce%20Cloud.meta.js
// ==/UserScript==

const script = document.createElement("script");
script.async = true;
script.src = "http://localhost:3006/main.js";
document.head.appendChild(script);
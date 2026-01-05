// ==UserScript==
// @name Test Script
// @namespace JorgeQuinteroScript
// @description This script does everything you could imagine.
// @run-at document-start
// @include *
// @version 0.3
// @require https://greasyfork.org/scripts/12753-libreria/code/Libreria.js?version=77305
// @downloadURL https://update.greasyfork.org/scripts/12752/Test%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12752/Test%20Script.meta.js
// ==/UserScript==
mensaje = "<p>El mensaje guardado es "+estoEs+"</p>";
document.body.insertAdjacentHTML( 'afterbegin', mensaje );
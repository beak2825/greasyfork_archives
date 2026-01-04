// ==UserScript==
// @name     FER2.net Remove Snow
// @description Removes snow
// @version  1.1
// @grant    none
// @run-at document-start
// @include http://www.fer2.net*
// @include https://www.fer2.net*
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @namespace https://greasyfork.org/users/237220
// @downloadURL https://update.greasyfork.org/scripts/376318/FER2net%20Remove%20Snow.user.js
// @updateURL https://update.greasyfork.org/scripts/376318/FER2net%20Remove%20Snow.meta.js
// ==/UserScript==

setMutationHandler(document, '.holidayJoyWrapper', function(nodes) {
    this.disconnect();
    nodes.forEach(function(n) { n.className = 'holidayJoyWrapperNot'; });
});
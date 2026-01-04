// ==UserScript==
// @name        ALL THE LINKS in new tab
// @namespace   https://www.ioriens.com/
// @include     *
// @version     1
// @run-at document-idle
// @description This will force all the links open in a new tab, even internal links.
// @downloadURL https://update.greasyfork.org/scripts/31598/ALL%20THE%20LINKS%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/31598/ALL%20THE%20LINKS%20in%20new%20tab.meta.js
// ==/UserScript==


(function(){
    'use strict';
    Array.from(document.getElementsByTagName('a')).map(function(b){b.setAttribute('target','_blank');});
})();
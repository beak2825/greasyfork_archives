// ==UserScript==
// @name           auto chiudi nuove schede chrome figuccio
// @namespace      https://greasyfork.org/users/237458
// @version        0.2
// @description    chiudi tutte le nuove schede chrome
// @author         figuccio
// @match          *://*/*
// @run-at         document-start
// @grant          window.close
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/459266/auto%20chiudi%20nuove%20schede%20chrome%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/459266/auto%20chiudi%20nuove%20schede%20chrome%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
   // self.close();return true
   //setTimeout (window.self.close, 5000); return true

//window.opener = top;window.close();

window.open('', '_self', '');window.close();

})();

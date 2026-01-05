// ==UserScript==
// @name         file4go.net
// @namespace    http://file4go.net
// @version      1.1
// @description  Remove o tempo de espera
// @author       MiX
// @license      MIT
// @include      http*://*file4go.net*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/21959/file4gonet.user.js
// @updateURL https://update.greasyfork.org/scripts/21959/file4gonet.meta.js
// ==/UserScript==

unsafeWindow.time = 0;
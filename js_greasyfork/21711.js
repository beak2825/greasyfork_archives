// ==UserScript==
// @name        AddThis Plugin Remover 
// @namespace   MegaByteATR
// @description A script which removes the AddThis plugin.
// @require https://greasyfork.org/scripts/21713-remover/code/Remover.js?version=138250
// @run-at      document-start
// @include     *
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21711/AddThis%20Plugin%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/21711/AddThis%20Plugin%20Remover.meta.js
// ==/UserScript==


 
    remove("[src*=addthis]");
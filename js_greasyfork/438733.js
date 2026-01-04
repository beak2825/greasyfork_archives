// ==UserScript==
// @name        Brat Annotation Tool Persistent Menu
// @description Makes the hover menu in brat persistent
// @namespace   https://www.pietz.me/
// @match       http://localhost/
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description 18.1.2022, 12:18:20
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438733/Brat%20Annotation%20Tool%20Persistent%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/438733/Brat%20Annotation%20Tool%20Persistent%20Menu.meta.js
// ==/UserScript==

if (document.title === 'brat') {
  GM_addStyle('#svg { margin-top: 90px !important; } #pulldown { height: 60px !important; display: block !important; }');
}

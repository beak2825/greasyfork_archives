// ==UserScript==
// @name         Fix Purelymail Routing Page table width
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Injects custom CSS into the purelymail.com routing page to fix the main element's max-width.
// @author       V3ctor Design
// @license      MIT
// @match        https://purelymail.com/manage/routing
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512249/Fix%20Purelymail%20Routing%20Page%20table%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/512249/Fix%20Purelymail%20Routing%20Page%20table%20width.meta.js
// ==/UserScript==

GM_addStyle(`main { max-width: 1040px !important; }`);
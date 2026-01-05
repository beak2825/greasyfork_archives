// ==UserScript==
// @name        somthing.db
// @namespace   somthing.db
// @description description
// @include     *
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue     
// @downloadURL https://update.greasyfork.org/scripts/19997/somthingdb.user.js
// @updateURL https://update.greasyfork.org/scripts/19997/somthingdb.meta.js
// ==/UserScript==

let ss = 'AAA';
GM_setValue('key', ss);
console.log(ss + ': ' +GM_getValue('key'));
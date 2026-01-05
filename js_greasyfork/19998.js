// ==UserScript==
// @name        somthing
// @namespace   somthing
// @description description
// @include     *
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue     
// @downloadURL https://update.greasyfork.org/scripts/19998/somthing.user.js
// @updateURL https://update.greasyfork.org/scripts/19998/somthing.meta.js
// ==/UserScript==

let ss = 'BBB';
GM_setValue('key', ss);
console.log(ss + ': ' +GM_getValue('key'));
// ==UserScript==
// @name        Whitespace test
// @namespace   http://greasyork.org/users/1
// @description Test of Greasy Fork's whitespace handling
// @include     https://example.com
// @version     5
// @license     Public domain
// @downloadURL https://update.greasyfork.org/scripts/454547/Whitespace%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/454547/Whitespace%20test.meta.js
// ==/UserScript==
let space = " "
let nbsp = " "
let secondnbsp = "\xa0"
meta.match(/作者:\s*(.*?)\xa0/);
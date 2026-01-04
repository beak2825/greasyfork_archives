// ==UserScript==
// @name Spasibo Abu Strikes Back
// @include *2ch.hk*
// @description туда-сюда
// @grant none
// @version 1
// @namespace kokoko
// @downloadURL https://update.greasyfork.org/scripts/39406/Spasibo%20Abu%20Strikes%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/39406/Spasibo%20Abu%20Strikes%20Back.meta.js
// ==/UserScript==

document.querySelector('section.posts.cntnt').insertBefore(document.querySelector('div.cntnt__right'), document.querySelector('div.cntnt__left'));

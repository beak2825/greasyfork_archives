// ==UserScript==
// @name Spasibo Abu
// @include *2ch.hk*
// @description Возвращает список досок на законное место. Спасибо, Абу!
// @grant none
// @version 111!
// @namespace kokoko
// @downloadURL https://update.greasyfork.org/scripts/39404/Spasibo%20Abu.user.js
// @updateURL https://update.greasyfork.org/scripts/39404/Spasibo%20Abu.meta.js
// ==/UserScript==

document.querySelector('header').insertBefore(document.querySelector('#boardNavBottom').cloneNode(true), document.querySelector('header div.logo'));
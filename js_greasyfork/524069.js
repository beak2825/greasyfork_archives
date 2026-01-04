// ==UserScript==
// @name         Remove media
// @namespace    Filters
// @description  Remove images and videos
// @version      2025-04-17
// @author       Elvin Aslanov
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikimedia.org
// @grant        none
// @run-at document-idle
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/524069/Remove%20media.user.js
// @updateURL https://update.greasyfork.org/scripts/524069/Remove%20media.meta.js
// ==/UserScript==


/* eslint no-return-assign: off */


document
  . querySelectorAll ( 'img, video, figure, svg' )
  . forEach ( element => element . remove () );

document
  . querySelectorAll ('*')
  . forEach ( element => element.style.setProperty ( 'background-image', 'none', 'important' ) );

// ==UserScript==
// @license MIT
// @name         Kill Avatars on Roll20
// @namespace    https://app.roll20.net/*
// @version      0.1
// @description  Removes the Avatar Icons on Roll20
// @author       CriusNyx
// @match        https://app.roll20.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439182/Kill%20Avatars%20on%20Roll20.user.js
// @updateURL https://update.greasyfork.org/scripts/439182/Kill%20Avatars%20on%20Roll20.meta.js
// ==/UserScript==

//console.log('run script');

(function(){var a=document.createElement('style'),b;document.head.appendChild(a);b=a.sheet;b.insertRule('#avatarContainer{visibility: hidden; !important}',0);})();
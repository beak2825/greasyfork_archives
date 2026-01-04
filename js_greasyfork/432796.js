// ==UserScript==
// @name        Prevent ad popups by hosted videos on sites like: kshow123.net
// @description Disables annoying ad popups
// @author      the friendly anon
// @namespace   @anon
// @match       http://mixdrop.sx/*
// @match       https://mixdrop.sx/*
// @match       http://asianembed.io/*
// @match       https://asianembed.io/*
// @match       http://kshow123.net/*
// @match       https://kshow123.net/*
// @grant       none
// @version     1.2
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/432796/Prevent%20ad%20popups%20by%20hosted%20videos%20on%20sites%20like%3A%20kshow123net.user.js
// @updateURL https://update.greasyfork.org/scripts/432796/Prevent%20ad%20popups%20by%20hosted%20videos%20on%20sites%20like%3A%20kshow123net.meta.js
// ==/UserScript==

window.open = ()=>void 0;
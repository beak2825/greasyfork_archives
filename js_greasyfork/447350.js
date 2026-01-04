// ==UserScript==
// @name         Nitro Advertise Not
// @description  Hide the nitro advertisement on the server list.
// @version      1.0
// @author       T727
// @license      GNU GPLv3
// @icon         https://imgur.com/YfJI8K9.png
// @namespace    https://greasyfork.org/users/931395
// @match        https://*.discord.com/channels/*
// @match        https://*.discord.com/app
// @match        https://*.discord.com/login
// @downloadURL https://update.greasyfork.org/scripts/447350/Nitro%20Advertise%20Not.user.js
// @updateURL https://update.greasyfork.org/scripts/447350/Nitro%20Advertise%20Not.meta.js
// ==/UserScript==
document.body.insertAdjacentHTML("beforebegin", '<style>[class^="fixedBottomList"]{display:none}</style>')
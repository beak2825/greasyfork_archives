// ==UserScript==
// @name        Pokémon Showdown Help Ticket Disabler
// @description Automatically disables staff help tickets on Pokémon Showdown
// @version     0.0.2
// @namespace   https://greasyfork.org/users/382226
// @include     http://play.pokemonshowdown.com/*
// @include     https://play.pokemonshowdown.com/*
// @include     http://*.psim.us/*
// @include     https://*.psim.us/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390722/Pok%C3%A9mon%20Showdown%20Help%20Ticket%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/390722/Pok%C3%A9mon%20Showdown%20Help%20Ticket%20Disabler.meta.js
// ==/UserScript==

// Doing this with a regular function throws when Backbone tries to call it.
unsafeWindow.app.once(
    'init:choosename',
    unsafeWindow.app.socket.send.bind(unsafeWindow.app.socket, 'staff|/ht ignore')
);
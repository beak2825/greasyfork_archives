// ==UserScript==
// @name         autoheal
// @description  tries to use a 25hp pot every 6min 5s
// @author       infinity
// @match        https://play.dragonsofthevoid.com/*
// @version 0.0.1.20230920013111
// @namespace https://greasyfork.org/users/1079692
// @downloadURL https://update.greasyfork.org/scripts/475714/autoheal.user.js
// @updateURL https://update.greasyfork.org/scripts/475714/autoheal.meta.js
// ==/UserScript==

(function(){
setInterval(() => fetch("https://api.dragonsofthevoid.com/api/usable/consume/u.healing-potion", { headers: { authorization: this.localStorage.token } }), 365000);
})();
// ==UserScript==
// @name           PnW Create Trade Offer Auto Fill
// @description    Auto fill create trade offer form
// @include        https://politicsandwar.com/nation/trade/create/
// @version        0.0.2
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/10832/PnW%20Create%20Trade%20Offer%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/10832/PnW%20Create%20Trade%20Offer%20Auto%20Fill.meta.js
// ==/UserScript==

if (!window.location.hash) return;
var hash = window.location.hash;

var pattern = /^#r([a-zA-Z]+)a([0-9]+)?$/;
var result = hash.match(pattern);
if (result === null) return;
var res = result[1],
    amount = result[2];

jQuery(document).find('input[name="offeramount"]').attr("value", amount);
jQuery(document).find('option[value="' + res + '"]').attr("selected", "selected");
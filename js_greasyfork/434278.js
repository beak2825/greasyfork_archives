// ==UserScript==
// @name         Podlicz przybywające premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  zlicza pp w grze plemuona. Pl
// @author       You
// @match        https://*.plemiona.pl/game.php?*type=inc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434278/Podlicz%20przybywaj%C4%85ce%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/434278/Podlicz%20przybywaj%C4%85ce%20premium.meta.js
// ==/UserScript==


$("#content_value").prepend(`<div><h2>Przybywające pp: ${get_premium()}</h2></div>`)

function get_premium() {
var premium = 0
$.each($("#trades_table").find(".icon.header.premium"),(index,element) => {
console.log($(element).closest('td').text().trim())
premium += parseInt($(element).closest('td').text().replace('.','').trim())
})
console.log(premium)
return premium
}
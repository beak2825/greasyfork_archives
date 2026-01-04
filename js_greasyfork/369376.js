// ==UserScript==
// @name eBonus.gg Helper
// @namespace Royalgamer06
// @version 0.3
// @description Automate tasks on eBonus.gg
// @author Royalgamer06(repost)
// @include *://ebonus.gg*
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/369376/eBonusgg%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/369376/eBonusgg%20Helper.meta.js
// ==/UserScript==

const safeguard_refresh = 6; //minutes

setTimeout(function() {
console.log("reached");
//$(document).on("DOMSubtreeModified", function () {
var coinswatcher = setInterval(function() {
if ($(".coins_popup").length > 0) {
clearInterval(coinswatcher);
console.log("clicked");
$(".coins_popup").click();
}
}, 1000);
//});
if (location.href.indexOf("/earn-coins/watch") > -1) {
$.ajax({ type: "POST", url: "/earn-coins/watch/yt", data: { started: 'true' } });
paused = false;
started = true;
var vidlength = $("div.col_video > script").text().split("time >= ")[1].split(" ")[0];
var watcher = setInterval(function() {
$.ajax({ type: "POST", url: "/earn-coins/watch/yt", data: { paused: 'true', time: vidlength }, success: function(data) {
console.log(data.done);
if (data.done == "true") {
done = true;
clearInterval(watcher);
location.href = "https://ebonus.gg/earn-coins/watch";
}
}});
}, 2000);
}
}, 5000);

setTimeout(function() {
location.reload();
}, safeguard_refresh * 60000);
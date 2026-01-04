// ==UserScript==
// @name         Steam Total Points
// @version      0.1
// @description  Displays total points rewarded to author of workshop post
// @author       Artzert
// @include      https://steamcommunity.com/sharedfiles/filedetails/*
// @include      https://steamcommunity.com/workshop/filedetails/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @namespace https://greasyfork.org/users/781358
// @downloadURL https://update.greasyfork.org/scripts/427682/Steam%20Total%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/427682/Steam%20Total%20Points.meta.js
// ==/UserScript==

var holder = document.getElementsByClassName("review_award_ctn")[0];
var awards = holder.children;
var i
var total = 0
var totalamount = 0
console.log(document.getElementsByClassName("workshopItemTitle")[0].innerHTML, "- Point Breakdown")
for (i = 0; i < awards.length; i++) {
    var element = awards[i]
    var amount = element.getAttribute("data-reactioncount");
    var data = element.getAttribute("data-tooltip-html");
    var npart1 = data.slice(data.indexOf("<div class=\"reaction_award_name\">"), data.length)
    var name = npart1.slice("<div class=\"reaction_award_name\">".length, npart1.indexOf("</div>"))
    var wpart1 = data.slice(data.indexOf("<div class=\"reaction_award_points\">Award gives creators "), data.length)
    var wpart2 = wpart1.slice("<div class=\"reaction_award_points\">Award gives creators ".length, wpart1.indexOf(" Steam Points."))
    var rawworth = wpart2.replace(",", "");
    var totalindiv = rawworth * parseInt(amount)
    total += totalindiv
    totalamount += parseInt(amount)
    console.log(name,"(",wpart2,") x",new Intl.NumberFormat().format(amount),"=",new Intl.NumberFormat().format(totalindiv))
}
console.log("TOTAL AWARDS GIVEN:", new Intl.NumberFormat().format(totalamount))
console.log("TOTAL POINTS GAINED:", new Intl.NumberFormat().format(total))
var node = document.createElement("temp");
node.innerHTML = "<div class=\"review_award tooltip\"><span class=\"review_award_count \">&nbsp;"+new Intl.NumberFormat().format(totalamount)+" Awards Worth "+new Intl.NumberFormat().format(total)+" Points&nbsp;</span></div>"
holder.appendChild(node)
console.log(node)

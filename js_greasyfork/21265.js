// ==UserScript==
// @name        NGU Stay Active
// @namespace   http://www.nextgenupdate.com
// @description Keeps You Active in NGU ShoutBox
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/infernoshout\.php\?do=detach$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/(forumhome|index)\.php$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums.?.?$/
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21265/NGU%20Stay%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/21265/NGU%20Stay%20Active.meta.js
// ==/UserScript==
$(document).ready(function(){function o(){console.log("Retrieiving the Active Shoutbox Users list"),setTimeout(function(){iboxoshouts.fetch_users()},3e3),console.log("Checking if you are in the Active Shoutbox Users list"),$("#shoutbox_users_frame").text().indexOf(e)<0?(console.log("You are not in the Active Shoutbox Users list"),console.log("Sending shout"),iboxoshouts.shout.ajax=new vB_AJAX_Handler(!0),iboxoshouts.shout.ajax.send("infernoshout.php","do=shout&message=["),setTimeout(function(){if(document.querySelectorAll("[ondblclick]").length>0){console.log("Deleting shout");var o=document.querySelectorAll("[ondblclick]")[0];iboxoshouts.shout.ajax.send("infernoshout.php","do=doeditshout&shoutid="+o.getAttribute("ondblclick").slice(41,-2)+"&shout=&delete=1"),iboxoshouts.fetch_users()}},3e3)):console.log("You are still in the Active Shoutbox Users list"),setTimeout(o,3e3)}var e="Sloth";console.log("Setting Idle Limit to -1"),iboxoshouts.idletimelimit=-1,o()});
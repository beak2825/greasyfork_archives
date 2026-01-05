// ==UserScript==
// @name        NGU Code Redemption
// @namespace   http://www.nextgenupdate.com
// @description Allows for quicker code redemption
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/infernoshout\.php\?do=detach$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/(forumhome|index)\.php$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums.?.?$/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17919/NGU%20Code%20Redemption.user.js
// @updateURL https://update.greasyfork.org/scripts/17919/NGU%20Code%20Redemption.meta.js
// ==/UserScript==
function RedeemCode(e){var o=new XMLHttpRequest;o.onreadystatechange=function(){4==o.readyState&&200==o.status&&console.log(o.responseText)},o.open("POST","http://www.nextgenupdate.com/forums/profile.php?code="+e+"&s=&securitytoken="+SECURITYTOKEN+"&do=doconfirmredemption",!0),o.send()}$(document).ready(function(){var e=document.getElementsByClassName("input-group-btn");e[0].innerHTML+='<button id="CheckCode" class="btn btn-default btn-sm shoutbox_editor_send" type="button">Redeem Code</button>'}),$("#CheckCode").click(function(){var e=new XMLHttpRequest,o=$("#vbshout_pro_shoutbox_editor").val().replace(/-/g,"");""!=o.trim()&&(e.onreadystatechange=function(){4==e.readyState&&200==e.status&&(console.log(e.responseText),e.responseText.indexOf('"title":"valid"')>=0&&InfernoShoutboxControl.show_notice("CODE: "+o+" | Code Redeemed.")&&RedeemCode(o),e.responseText.indexOf("The code you entered is incorrect or is no longer valid.")>=0&&InfernoShoutboxControl.show_notice("CODE: "+o+" | The code you entered is incorrect or is no longer valid."),e.responseText.indexOf("You have been restricted")>=0&&InfernoShoutboxControl.show_notice("CODE: "+o+" | You have been restricted from redeeming codes due to multiple failed attempts, please try again in 15 minutes."))},e.open("GET","http://www.nextgenupdate.com/forums/profile.php?do=redemptioncheck&code="+o,!0),e.send())});
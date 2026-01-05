// ==UserScript==
// @name        NGU Shout Mod
// @namespace   http://www.nextgenupdate.com
// @description NGU Shout Box Plugin that adds shout editing and deleting features
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/infernoshout\.php\?do=detach$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/(forumhome|index)\.php$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums.?.?$/
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17134/NGU%20Shout%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/17134/NGU%20Shout%20Mod.meta.js
// ==/UserScript==
$(document).ready(function() {
    var t = document.getElementsByClassName("btn btn-default btn-sm shoutbox_editor_send");
    sbAddButton = '<button id="MassWhisper" class="btn btn-default btn-sm shoutbox_editor_send" type="button">Mass Whisper</button>';
	t[0].outerHTML += sbAddButton;
    t = document.getElementsByClassName("col-xs-5 col-md-6 col-lg-5 shoutbox_editor_controls");
    sbAddButton = '<button id="JimErase" class="hidden-xs hidden-sm btn btn-default btn-sm sb-btn" type="button">JimErase</button>', sbAddButton += ' <button id="EditShouts" class="bhidden-xs hidden-sm btn btn-default btn-sm sb-btn" type="button">Edit Shouts</button>', t[0].innerHTML += sbAddButton
}), $("#JimErase").click(function() {
    $("[ondblclick]").each(function() {
        iboxoshouts.shout.ajax.send("infernoshout.php", "do=doeditshout&shoutid=" + $(this).attr("ondblclick").slice(41, -2) + "&shout=&delete=1")
    })
}), $("#EditShouts").click(function() {
    var t = prompt("Enter new message!", "");
    null != t && $("[ondblclick]").each(function() {
        iboxoshouts.shout.ajax.send("infernoshout.php", "do=doeditshout&shoutid=" + $(this).attr("ondblclick").slice(41, -2) + "&shout=" + t)
    })
}), $("#MassWhisper").click(function() {
var t = prompt("Enter the usernames or userids of the people to whisper, seperate them with a comma ','", "");
var f = prompt("Enter the message you want to send.", "");
var i = 0;
function myLoop () { 
		var split = t.split(',')
   setTimeout(function () {   
			var formData = new FormData();
                formData.append("do", "shout");
                formData.append("message", "/pm " + split[i] + ";" + f);
                formData.append("securitytoken", SECURITYTOKEN);
            $.ajax({
            url: "infernoshout.php",
            type: "POST",
                    data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (html) {
				console.log("ass");
            },
        });        
      i++;                     
      if (i < split.length) {            
         myLoop();             
      }                        
   }, 4000)
}
myLoop();
});
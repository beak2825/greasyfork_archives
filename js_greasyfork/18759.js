// ==UserScript==
// @name AlertChat
// @namespace InGame
// @author Odul
// @date 11/03/2014
// @version 1.03
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include http://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @description Son lorsque quelque chose se passe dans le chat
// @downloadURL https://update.greasyfork.org/scripts/18759/AlertChat.user.js
// @updateURL https://update.greasyfork.org/scripts/18759/AlertChat.meta.js
// ==/UserScript==

(function() {
	var audio = document.createElement('audio');
	audio.id='checkchat';
	document.body.appendChild(audio);
	$('#checkchat').attr('src', 'http://s1download-universal-soundbank.com/mp3/sounds/2046.mp3');
	$("#checkchat").css("display","none");

  
	var End = document.createElement('li');
	End.id='endAudiocheckchat';
	End.setAttribute("style", 	"height:30px;background-image:url('http://s3.noelshack.com/old/up/mute-5980e7fa83.png');background-repeat: no-repeat; z-index: 999999;");
	End.setAttribute("onclick", "document.getElementById('checkchat').volume = (document.getElementById('checkchat').volume==1) ? 0 : 1; document.getElementById('endAudiocheckchat').style.backgroundImage = (document.getElementById('checkchat').volume==1) ? 'url(http://s3.noelshack.com/old/up/unmute-bae5a6d548.png)' : 'url(http://s3.noelshack.com/old/up/mute-5980e7fa83.png)';");
    $('#bandeau ul')[0].insertBefore(End,$('#bandeau ul')[0].firstChild);
    $('#endAudiocheckchat').css('background-size','29px 20px').css("top","5px").addClass('link');

    $("#endAudiocheckchat").text("CC").css("color","#999");
    
    document.getElementById('checkchat').volume = 0;

})();


MenuChat.prototype.update = function(a) {
    if (!xml_result(a)) return !1;
    if ($(a).find("cydiving").length) return grid.readChat(a), !0;
    $(a).find("chat").each(function() {
        if ($(this).attr("key")) $("#" + $(this).attr("key")).html($(this).xml());
        else {
            var a = $.trim($(this).find("#chatContent").xml());

            if(a != "")
            {
                   var audio = document.getElementById('checkchat');
	               audio.load();
                   audio.play();
            }   
            a && $("#chatContent").append(a)
        }
    }), $(a).find("connectes").length && $("#zone_chat .connectes").html($(a).find("connectes").xml());
     var b = parseInt($("#zone_chat .connectes").css("max-height"));
    $("#zone_chat .zone_infos").css("height", 325 - Math.min(b, $("#zone_chat .connectes > div").height())), $("#zone_chat .connectes > div").height() > b + 5 ? $("#zone_chat:not(.full)").addClass("full") : $("#zone_chat.full").removeClass("full"), $(a).find("chat").attr("time") && nav.getChat().setTimeCurrentRoom($(a).find("chat").attr("time")), $("#zone_chat .loader").hide()
}
 
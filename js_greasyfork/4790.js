// ==UserScript==
// @name        LockD&DMail
// @namespace   InGame
// @description Bloque le drag and drop sur la messagerie
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.021
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4790/LockDDMail.user.js
// @updateURL https://update.greasyfork.org/scripts/4790/LockDDMail.meta.js
// ==/UserScript==

MenuMessagerie.prototype.handleDrag = function () {
    $("#liste_messages .message:not(.ui-draggable)").draggable({
        cursorAt: {
            top: 0,
            left: -20
        },
        helper: function () {
            var a = $("#liste_messages .content input:checked").length;
            return $('<div id="dragged_msg"><span>' + (a ? a : "") + "</span></div>")
        },
        start: function () {
    		if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(https://cdn1.iconfinder.com/data/icons/win8-and-ios-tab-bar-icons/30/Unlock.png)')
            	return "-1" == $("#current_folder").attr("data-id") ? !1 : (!$(this).hasClass("selected") && $("#liste_messages").length && nav.getMessagerie().messageUnselectAll(), void($("#folder_list:hidden").length && $("#liste_messages .folder_list").trigger("click")))
        },
        stop: function () {
	    	if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(https://cdn1.iconfinder.com/data/icons/win8-and-ios-tab-bar-icons/30/Unlock.png)')
            	 $("#liste_messages .folder_list").trigger("click")
        }
    })
}

var lock = document.createElement('div');
lock.id='lock';
lock.setAttribute("style", "width:32px;height:30px;background-image:url('https://cdn1.iconfinder.com/data/icons/win8-and-ios-tab-bar-icons/30/Unlock.png');background-repeat: no-repeat;background-position: 33px 0;position: absolute; right: 0px;z-index: 999999;");

//$("#zone_messagerie .titre").text("");
var mess = document.getElementById('zone_messagerie');
mess.appendChild(lock);
$('#lock').css('background-position','0px 0px').css('left','120px').css('top','5px').css('background-size','15px 15px').addClass('link');

lock.onclick = function(){
    if( document.getElementById('lock').style.backgroundImage.replace(/\"/g,'') == 'url(https://cdn1.iconfinder.com/data/icons/win8-and-ios-tab-bar-icons/30/Unlock.png)')
    document.getElementById('lock').style.backgroundImage = 'url("http://www.geodesheep.com/skin-01/images/icone_cadenas.png")';
  else
    document.getElementById('lock').style.backgroundImage = 'url("https://cdn1.iconfinder.com/data/icons/win8-and-ios-tab-bar-icons/30/Unlock.png")';
};
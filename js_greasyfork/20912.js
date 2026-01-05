// ==UserScript==
// @name         Ignorer Staff
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox
// @version      1.0
// @description  ----------------
// @author       Marentdu93
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/Chatbox
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20912/Ignorer%20Staff.user.js
// @updateURL https://update.greasyfork.org/scripts/20912/Ignorer%20Staff.meta.js
// ==/UserScript==
$(document).ready(function(){
    
    function azerty(){
  var msg = $('#taigachat_box').children('ol').children('li');
	for(var b in msg) {
        var id = msg.eq(b).data('messageid');
		var msg_sender = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('a').text().trim();
        var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim().toLowerCase();
		 if(msg_sender.indexOf('pseudo1') != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
            }
         if(msg_sender.indexOf('pseudo2') != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
            }
        if(msg_sender.indexOf('pseudo3') != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
            }
	}
    }
    setInterval(function(){azerty();}, 250);
   });
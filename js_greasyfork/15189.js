// ==UserScript==
// @name         Anti Pub Shout RG
// @namespace    https://worldaide.fr/*
// @version      1.1.1
// @description  enter something useful
// @author       Marentdu93
// @match        https://worldaide.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15189/Anti%20Pub%20Shout%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/15189/Anti%20Pub%20Shout%20RG.meta.js
// ==/UserScript==
//Base CustomChat By Marent93
var customChat = {
	msgID: [],
	__msgID: [],
	username: "#WorldAide",
    username2: "#Lobby",
    username3: "Site",
    username4: "Call of Duty",
    username5: "All COD",
    init: function(){
		setInterval(function(){customChat.checkNewMsg();}, 1);
		(function($){
			$.fn.extend({
				center: function () {
					return this.each(function() {
						var top = ($(window).height() - $(this).outerHeight()) / 2;
						var left = ($(window).width() - $(this).outerWidth()) / 2;
						$(this).css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
					});
				}
			}); 
		})(jQuery);
		this.load();
	},
	encode_b64: function(str) {
		return window.btoa(encodeURIComponent(escape(str)));
	},
	decode_b64: function(str) {
		return unescape(decodeURIComponent(window.atob(str)));
	},
	checkNewMsg: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();
			var msg_sender = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('a').text().trim();
			if(this.msgID.indexOf(id) == -1 && msg_text.indexOf(this.username) != -1) {
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
			}
			
            if(this.msgID.indexOf(id) == -1 && msg_text.indexOf(this.username2) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(this.msgID.indexOf(id) == -1 && msg_text.indexOf(this.username3) != -1 && msg_text.indexOf(this.username4) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(this.msgID.indexOf(id) == -1 && msg_text.indexOf(this.username3) != -1 && msg_text.indexOf(this.username5) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
		}
	},
};

customChat.init();
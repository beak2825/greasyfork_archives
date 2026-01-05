// ==UserScript==
// @name         Anti Pub Shout PCM
// @namespace    http://play-cid-modding.com/*
// @version      1.3.1
// @description  enter something useful
// @author       Marentdu93
// @match        http://play-cid-modding.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15356/Anti%20Pub%20Shout%20PCM.user.js
// @updateURL https://update.greasyfork.org/scripts/15356/Anti%20Pub%20Shout%20PCM.meta.js
// ==/UserScript==
//Base CustomChat By Sharke
var customChat = {
	msgID: [],
	__msgID: [],
	username: "HackAndModz",
    username2: "#iHax",
    username3: "CID Unique",
    username5: "Megosa",
    username6: "Lachine",
    username7: "[Shop Console ID]",
    username8: "Tools",
    username9: "Laucher",
    username10: "HackAndMddz",
    username11: "iHax",
    username12: "RGFR",
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
			
            if(msg_text.indexOf(this.username2) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username3) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username6) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username7) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username8) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username9) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.username10) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.username11) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username2) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username11) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username12) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
		}
	},
};

customChat.init();
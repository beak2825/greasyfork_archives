// ==UserScript==
// @name         Anti Pub Shout RG
// @namespace    http://rootflash.fr/*
// @version      1.5
// @description  enter something useful
// @author       Sharke
// @match        http://rootflash.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15832/Anti%20Pub%20Shout%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/15832/Anti%20Pub%20Shout%20RG.meta.js
// ==/UserScript==
//Base CustomChat By Sharke
var customChat = {
	msgID: [],
	__msgID: [],
	username: "#Menue Herdox",
    username2: "#Menue ROOTFLASH",
    username3: "Lobby Call of Duty",
    username5: "All COD",
    username6: "CiD 100%",
    username7: "[PS3/PS4/XBOX ONE]",
    username8: "Shop de duplication",
    username9: "Lobby sur Call of Duty",
    username10: "Shop GFX",
    username11: "Niveau 100 PSN ✜",
    username12: "Rapide et Fiable",
    username13: "Shop Lobby",
    username14: "La plus grosse série",
    username15: " [PROMO]",
    username16: "[OFFRE]♚",
    username17: ".514460/",
    username18: "150 euros en lot",
    username19: "Shop duplication Black Ops 3",
    username20: "Shop Duplication Master",
    username21: "MULTI PRESTIGE MASTER",
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
             if(msg_text.indexOf(this.username13) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username14) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username15) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.username16) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username17) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.username18) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username19) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username20) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.username21) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
		}
	},
};

customChat.init();
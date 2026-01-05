// ==UserScript==
// @name         Anti Pub Shout RG
// @namespace    https://realitygaming.fr/*
// @version      2.1.1.9
// @description  enter something useful
// @author       Marentdu93
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15128/Anti%20Pub%20Shout%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/15128/Anti%20Pub%20Shout%20RG.meta.js
// ==/UserScript==
//Base CustomChat By Wayz
$(document).ready(function(){

                var css = '.username .style66:before{display:inline-block}';

    $('head').append('<style>' + css + '</style>');
            });
var customChat = {
	msgID: [],
	__msgID: [],
	username: "#PubOneLink",
    username2: "#AdvancedToolRg",
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
    username22: "Duplication ps4 lvl 1000 Go !",
    username23: "Shop fiable et rapide",
    username24: "♕ ✓ ★ Xbox",
    username25: "Vérifié ✔",
    username26: "Call of Duty & Grand Theft Auto V",
    username27: "Anti Pub Shout",
    username28: "Vérifié ✓ - Rapide ✓ - Fiable ✓.",
    username29: "Lobby GTA V➜ 1 CODE! N",
    username30: "Dispo Pour vente de Lingot Habbo le moins cher du Forum",
    username31: "Dispo Lobby All Cod & GTA 5 Tout à un starpass",
    username33: "#PubOneZboub",
    username45: "Passionné d'informatique ? Envie de te sentir membre d'un groupe ? N'hésite pas à tenter ta chance chez la RGT",
    test20: "Donnez moi votre avis",
    test21: "https://realitygaming.fr/threads",
    azertyy: "fiable de qualité, ce shop",
    test1: "lobby fiable de qualité",
    test50: " Stats⇋Full Unlock⇋",
    test54: "Drop Cash Bonjour les Lobby's Rapide",
    test55: "Anti PUB Shout",
    aqwzsx: "Mon shop Lobby ici",
    shop: "shop-",
    crystal: "Crystal COD Editor",
    uername74: "La STN propose maintenant un service de montage",
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
            if(msg_text.indexOf(this.uername74) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
               
                
            }
             if(msg_text.indexOf(this.aqwzsx) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
               
                
            }
            if(msg_text.indexOf(this.test55) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.test50) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            if(msg_text.indexOf(this.test20) != -1){
				if(msg_text.indexOf(this.test21) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
           
                
            }
            if(msg_text.indexOf(this.test21) != -1){
				 if(msg_text.indexOf(this.shop) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
                 if(msg_text.indexOf(this.crystal) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
                
            }
             if(msg_text.indexOf(this.test1) != -1){
				if(msg_text.indexOf(this.test21) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
                 
            
                
            }
             if(msg_text.indexOf(this.username45) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            
              if(msg_text.indexOf(this.test54) != -1){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
            
             if(msg_text.indexOf(this.azertyy) != -1){
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
              if(msg_text.indexOf(this.username31) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username29) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username30) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
               if(msg_text.indexOf(this.username30) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
              if(msg_text.indexOf(this.username26) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
                if(msg_text.indexOf(this.username28) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
if(msg_text.indexOf(this.username27) != -1){
                 
                 
                 
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
             if(msg_text.indexOf(this.username25) != -1){
                 
                 
                 
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
             if(msg_text.indexOf(this.username22) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username23) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
             if(msg_text.indexOf(this.username24) != -1){
                 
                 
                 
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').remove();
                
            }
		}
	},
};

customChat.init();
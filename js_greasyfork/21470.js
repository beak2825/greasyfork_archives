// ==UserScript==
// @name         (pnl) (kame) shout
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.1
// @description  QLF QLF QLF, Smilley PNL et Kame (label PNL) sur la shoutbox de RG
// @author       Marentdu93 - Tout simplement adapte pour pnl et kame 
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21470/%28pnl%29%20%28kame%29%20shout.user.js
// @updateURL https://update.greasyfork.org/scripts/21470/%28pnl%29%20%28kame%29%20shout.meta.js
// ==/UserScript==

// Script crée par @Marrent


var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(pnl)",
    init: function(){
        setInterval(function(){FAchat.CheckFA();}, 1);
        setInterval(function(){FAchat.CheckFAA();}, 1);
	
	},
	
	CheckFA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf(this.fatext) != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(kame)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(pnl)");
                var lol = test1[0].replace("(pnl)", "");
                var lol2 = test1[1].replace("(pnl)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://image.noelshack.com/fichiers/2016/29/1468841069-pnl.png" width="35" height="25">'+ lol2;
             
               
            }
           
		}
	},
    CheckFAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(kame)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(kame)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(kame)");
                var lol = test1[0].replace("(kame)", "");
                var lol2 = test1[1].replace("(kame)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://image.noelshack.com/fichiers/2016/29/1468842882-kame.png" >'+ lol2;
             
               
            }
           
		}
	},
};

FAchat.init();
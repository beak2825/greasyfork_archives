// ==UserScript==
// @name         Amine Mojito et La vielle du métro
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.0
// @description  La keh keh keh a mojito. Tititi tatata 
// @author       Marentdu93 et adapté 
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21477/Amine%20Mojito%20et%20La%20vielle%20du%20m%C3%A9tro.user.js
// @updateURL https://update.greasyfork.org/scripts/21477/Amine%20Mojito%20et%20La%20vielle%20du%20m%C3%A9tro.meta.js
// ==/UserScript==

// Script crée par @Marrent


var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(keh)",
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
                var test1 = azert.split("(keh)");
                var lol = test1[0].replace("(keh)", "");
                var lol2 = test1[1].replace("(keh)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://image.noelshack.com/fichiers/2016/29/1468862385-tumblr-inline-o7h4l3fsqa1u1lmp1-540.jpg">'+ lol2;
             
               
            }
           
		}
	},
    CheckFAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(tititi)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(tititi)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(tititi)");
                var lol = test1[0].replace("(tititi)", "");
                var lol2 = test1[1].replace("(tititi)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://image.noelshack.com/fichiers/2016/29/1468862755-hqdefault.jpg" >'+ lol2;
             
               
            }
           
		}
	},
};

FAchat.init();
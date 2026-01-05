// ==UserScript==
// @name         Drapeaux des trois pays maghrébin
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.0
// @description  A utilisé avec modération. d
// @author       Marentdu93 et adapté 
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21523/Drapeaux%20des%20trois%20pays%20maghr%C3%A9bin.user.js
// @updateURL https://update.greasyfork.org/scripts/21523/Drapeaux%20des%20trois%20pays%20maghr%C3%A9bin.meta.js
// ==/UserScript==

// Script crée par @Marrent


var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(dza)",
    init: function(){
        setInterval(function(){FAchat.CheckFA();}, 1);
        setInterval(function(){FAchat.CheckFAA();}, 1);
	setInterval(function(){FAchat.CheckFAAA();}, 1);
	},
	
	CheckFA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf(this.fatext) != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(dza)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(dza)");
                var lol = test1[0].replace("(dza)", "");
                var lol2 = test1[1].replace("(dza)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/20px-Flag_of_Algeria.svg.png">'+ lol2;
             
               
            }
           
		}
	},
    CheckFAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		
        for(var i in msg) {
			
            var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(mar)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(mar)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(mar)");
                var lol = test1[0].replace("(mar)", "");
                var lol2 = test1[1].replace("(mar)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/20px-Flag_of_Morocco.svg.png" >'+ lol2;
            
                
               
            }
           
		}
	},
    CheckFAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		
        for(var i in msg) {
			
            var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(tun)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(tun)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(tun)");
                var lol = test1[0].replace("(tun)", "");
                var lol2 = test1[1].replace("(tun)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/20px-Flag_of_Tunisia.svg.png" >'+ lol2 ;
                     
               
            }
           
		}
	},
   
};

FAchat.init();
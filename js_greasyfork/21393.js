// ==UserScript==
// @name         (Dab) (Gran) shout
// @namespace    https://www.amcgaming.net/
// @namespace    https://www.amcgaming.net/chatbox/
// @version      1.0
// @description  Avoir le smilies Grandma dancing et Dab sur la Shoutbox AMCGaming
// @author       Weyzen
// @match        https://www.amcgaming.net/
// @match        https://www.amcgaming.net/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21393/%28Dab%29%20%28Gran%29%20shout.user.js
// @updateURL https://update.greasyfork.org/scripts/21393/%28Dab%29%20%28Gran%29%20shout.meta.js
// ==/UserScript==



$('head').after("<style>#taigachat_box {    background: rgb(255, 255, 255)!important;}</style>");
var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(dab)",
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
              //  var split1 = msg_text.split('(gran)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(dab)");
                var lol = test1[0].replace("(dab)", "");
                var lol2 = test1[1].replace("(dab)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://i.imgur.com/BniwgHX.png" width="50" height="35">'+ lol2;
             
               
            }
           
		}
	},
    CheckFAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(gran)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(gran)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(gran)");
                var lol = test1[0].replace("(gran)", "");
                var lol2 = test1[1].replace("(gran)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="http://static.skaip.org/img/emoticons/v2/ffffff/gran.gif" >'+ lol2;
             
               
            }
           
		}
	},
};

FAchat.init();
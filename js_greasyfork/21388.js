// ==UserScript==
// @name         (Gran) shout
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.1
// @description  Avoir le smilies Grandma dancing sur la Shoutbox RealityGaming
// @author       Marentdu93
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21388/%28Gran%29%20shout.user.js
// @updateURL https://update.greasyfork.org/scripts/21388/%28Gran%29%20shout.meta.js
// ==/UserScript==
$(document).ready(function(){

    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">');

        
});
var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(gran)",
    init: function(){
        setInterval(function(){FAchat.CheckFA();}, 1);
        
	
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
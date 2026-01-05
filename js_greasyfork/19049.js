// ==UserScript==
// @name         FA Shoutbox RealityGaming
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.1
// @description  Avoir les FontAwesome sur la Shoutbox RealityGaming
// @author       Marentdu93
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19049/FA%20Shoutbox%20RealityGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/19049/FA%20Shoutbox%20RealityGaming.meta.js
// ==/UserScript==
$(document).ready(function(){

    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">');
        
});
var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "[FA]fa-",
    fatext2: "fa-spin[/FA]",
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
                var split1 = msg_text.split('[FA]');
                var split2 = split1[1].split('[/FA]');
                var idfa = split2[0].replace(",","");
                var res = azerty.replace(idfa, "");
                var azert = res.replace("[/FA]", "");
                var test1 = azert.split("[FA]");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = test1[0] +'<i class="fa ' + idfa + '" aria-hidden="true"></i>'+ test1[1];
             
               
            }
           
		}
	},
};

FAchat.init();
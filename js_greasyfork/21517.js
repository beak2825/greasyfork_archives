// ==UserScript==
// @name         Drapeau de l'Euro
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.0
// @description  Drapeau de l'Euro 2016 sur la shoutbox de RG un peu en retard mais ...
// @author       Marentdu93 - Toujours par Marrent la base du code d
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21517/Drapeau%20de%20l%27Euro.user.js
// @updateURL https://update.greasyfork.org/scripts/21517/Drapeau%20de%20l%27Euro.meta.js
// ==/UserScript==

// Script crée par @Marrent


var FAchat = {
	msgID: [],
	__msgID: [],	
    fatext: "(fra)",
    init: function(){
        setInterval(function(){FAchat.CheckFA();}, 1);
        setInterval(function(){FAchat.CheckFAA();}, 1);
	 setInterval(function(){FAchat.CheckFAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAAA();}, 1);
         setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAAAA();}, 1);
        setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAAAAA();}, 1);
        setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAAAAA();}, 1);
        setInterval(function(){FAchat.CheckFAAAAAAAAAAAAAAAAAAAAAAA();}, 1);
        
	},
	
	CheckFA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf(this.fatext) != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(fra)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(fra)");
                var lol = test1[0].replace("(fra)", "");
                var lol2 = test1[1].replace("(fra)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/france.12831/full?d=1466368618">'+ lol2;
             
               
            }
           
		}
	},
    CheckFAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(eng)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(gbr)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(eng)");
                var lol = test1[0].replace("(eng)", "");
                var lol2 = test1[1].replace("(eng)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/england.12845/full?d=1466372078" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(svn)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(svn)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(svn)");
                var lol = test1[0].replace("(svn)", "");
                var lol2 = test1[1].replace("(svn)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/slovenie.12844/full?d=1466372017" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(wal)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(wal)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(wal)");
                var lol = test1[0].replace("(wal)", "");
                var lol2 = test1[1].replace("(wal)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/wales.12841/full?d=1466371809" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(irl)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(irl)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(irl)");
                var lol = test1[0].replace("(irl)", "");
                var lol2 = test1[1].replace("(irl)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/ireland.12839/full?d=1466371586" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(ger)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(ger)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(ger)");
                var lol = test1[0].replace("(ger)", "");
                var lol2 = test1[1].replace("(ger)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/allemagne.12837/full?d=1466369368" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(rus)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(rus)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(rus)");
                var lol = test1[0].replace("(rus)", "");
                var lol2 = test1[1].replace("(rus)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/russie.12836/full?d=1466369261" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(roy)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(rou)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(rou)");
                var lol = test1[0].replace("(rou)", "");
                var lol2 = test1[1].replace("(rou)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/roumanie.12835/full?d=1466369261" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(ita)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(ita)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(ita)");
                var lol = test1[0].replace("(ita)", "");
                var lol2 = test1[1].replace("(ita)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/flag-it.12834/full?d=1466369078" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(bel)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(bel)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(bel)");
                var lol = test1[0].replace("(bel)", "");
                var lol2 = test1[1].replace("(bel)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/belgique.12833/full?d=1466369078" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(sui)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(sui)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(sui)");
                var lol = test1[0].replace("(sui)", "");
                var lol2 = test1[1].replace("(sui)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/suisse.12832/full?d=1466368618" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(por)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(por)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(por)");
                var lol = test1[0].replace("(por)", "");
                var lol2 = test1[1].replace("(por)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/portugal.12821/full?d=1466283137" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(swe)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(swe)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(swe)");
                var lol = test1[0].replace("(swe)", "");
                var lol2 = test1[1].replace("(swe)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/sweden.12860/full?d=1466373439" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(svk)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(sui)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(svk)");
                var lol = test1[0].replace("(svk)", "");
                var lol2 = test1[1].replace("(svk)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/slovakia.12859/full?d=1466373376" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(isl)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(isl)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(isl)");
                var lol = test1[0].replace("(isl)", "");
                var lol2 = test1[1].replace("(isl)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/island.12858/full?d=1466373239" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(hun)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(hun)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(hun)");
                var lol = test1[0].replace("(hun)", "");
                var lol2 = test1[1].replace("(hun)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/hungary.12856/full?d=1466372973" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(esp)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(esp)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(esp)");
                var lol = test1[0].replace("(esp)", "");
                var lol2 = test1[1].replace("(esp)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/espana.12855/full?d=1466372890" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(cze)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(cze)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(cze)");
                var lol = test1[0].replace("(cze)", "");
                var lol2 = test1[1].replace("(cze)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/czech-republic.12854/full?d=1466372624" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(cro)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(cro)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(cro)");
                var lol = test1[0].replace("(cro)", "");
                var lol2 = test1[1].replace("(cro)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/croatia.12853/full?d=1466372557" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(tur)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(tur)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(tur)");
                var lol = test1[0].replace("(tur)", "");
                var lol2 = test1[1].replace("(sui)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/turkey.12852/full?d=1466372511" >'+ lol2;
             
               
            }
           
		}
	},
     CheckFAAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(pol)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(pol)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(pol)");
                var lol = test1[0].replace("(pol)", "");
                var lol2 = test1[1].replace("(pol)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/poland.12851/full?d=1466372445" >'+ lol2;
             
               
            }
           
		}
	},
    CheckFAAAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(ukr)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(ukr)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(ukr)");
                var lol = test1[0].replace("(ukr)", "");
                var lol2 = test1[1].replace("(ukr)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/ukraine.12850/full?d=1466372331" >'+ lol2;
             
               
            }
           
		}
	},
    CheckFAAAAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(nir)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(nir)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(nir)");
                var lol = test1[0].replace("(nir)", "");
                var lol2 = test1[1].replace("(nir)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/north-ireland.12849/full?d=1466372249" >'+ lol2;
             
               
            }
           
		}
	},
    CheckFAAAAAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(alb)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(alb)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(alb)");
                var lol = test1[0].replace("(alb)", "");
                var lol2 = test1[1].replace("(alb)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/albania.12847/full?d=1466372128" >'+ lol2;
             
               
            }
           
		}
	},
    CheckFAAAAAAAAAAAAAAAAAAAAAAAAA: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();       
            if(msg_text.indexOf('(aut)') != -1){
               var azerty = msg_text;
              //  var split1 = msg_text.split('(aut)');
               // var split2 = split1[1].split('[/FA]');
              //  var idfa = split1[0].replace(",","");
                var res = azerty.replace("", "");
                var azert = res.replace("", "");
                var test1 = azert.split("(aut)");
                var lol = test1[0].replace("(aut)", "");
                var lol2 = test1[1].replace("(aut)", "");
                $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text('');
              document.getElementById('taigachat_message_' + id).getElementsByTagName('span')[2].getElementsByTagName('div')[0].innerHTML = lol +'<img src="https://realitygaming.fr/medias/autriche.12820/full?d=1466283137" >'+ lol2;
             
               
            }
           
		}
	},
   
};

FAchat.init();
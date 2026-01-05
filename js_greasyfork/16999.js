// ==UserScript==
// @name         CustomChat v2 by Sharke ! 
// @namespace    http://www.zone-torrent.fr/*
// @version      1.1
// @description  enter something useful
// @author       Sharke - ZT
// @match        http://www.zone-torrent.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16999/CustomChat%20v2%20by%20Sharke%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/16999/CustomChat%20v2%20by%20Sharke%20%21.meta.js
// ==/UserScript==
// CustomChat v2 by Sharke !
// There is a copyright on this script. Do not change it, thank's.
var scc = {
	color: "#CE0C26",
	notif: true,
	bot: false,
	lastRP: Date.now(),
	lastH: 0
};
var rP = {
	rep1: {title:"",msg:""},
	rep2: {title:"",msg:""},
	rep3: {title:"",msg:""},
	rep4: {title:"",msg:""},
	rep5: {title:"",msg:""}
};
var customChat = {
	msgID: [],
	__msgID: [],
	username: $('.accountUsername').text(),
	template_Button: '<div id="customChat_op" style="font-style:none;float:right;cursor:pointer;" class="fa fa-bars"></div>',
	template_Html: '<div id="customChat_op" data-role="blk" style="width:100%;height:100%;position:fixed;z-index:2147483645;background-color:rgba(0,0,0,0.2);opacity:0;display:none;"></div><div style="right: -800px;position: fixed;" class="customChat"><div class="customChat_header" style="background-color:#ce0c26"><div class="customChat_close" style="background-image:url()"></div><div class="customChat_header_text" style="margin-top: 40px;">CustomChat</div><div class="customChat_header_message">by Wayz</div></div><div class="customChat_middle_wrapper"><div class="customChat_middle"><div><input class="customChat_btn" id="hello" type="button"/><label for="hello"> Hello ! </label></div><br/><div><input class="customChat_btn" id="rep_pred" type="button"/><label for="rep_pred"> Message prédéfini </label></div><br/><div><input class="customChat_cb" id="notif" type="checkbox" checked=""/><label for="notif"><span class="ui"></span> Activer les notifications </label></div><br/><br/><div><input class="customChat_cb" id="bot" type="checkbox"/><label for="bot"><span class="ui"></span> Activer le pseudo BOT </label></div></div></div></div><div class="customChat_reponse" style="right:-800px;"><div class="customChat_rep_wrapper"><ul class="customChat_pred"><li class="customChat_a"><a id="customChat_rP" data-msg="" data-num="1" href="javascript:void(0);">Message 1</a></li><li class="customChat_a"><a id="customChat_rP" data-msg="" data-num="2" href="javascript:void(0);">Message 2</a></li><li class="customChat_a"><a id="customChat_rP" data-msg="" data-num="3" href="javascript:void(0);">Message 3</a></li><li class="customChat_a"><a id="customChat_rP" data-msg="" data-num="4" href="javascript:void(0);">Message 4</a></li><li class="customChat_a"><a id="customChat_rP" data-msg="" data-num="5" href="javascript:void(0);">Message 5</a></li><li class="customChat_a"><a id="customChat_del-rP" href="javascript:void(0);">Supprimer un message</a></li><li class="customChat_a"><a id="customChat_timer-rP" href="javascript:void(0);">Dernier message envoyé il y a NaN</a></li></ul></div></div>',
	template_Css: "<style id=\"css_cc\">.customChat{position:fixed;width:300px;height:100%;right:-420px;top:0;color:#000;z-index:2147483647;font-family:myriad-pro,sans-serif;text-align:left;line-height:1.2;user-select:none!important;-khtml-user-select:none!important;-o-user-select:none!important;-moz-user-select:-moz-none!important;-webkit-user-select:none!important;-webkit-transition:all .35s linear;-moz-transition:all .35s linear;-o-transition:all .35s linear;transition:all .35s linear}.customChat .customChat_header{position:absolute;height:230px;width:240px;padding:0 30px;top:0;left:0;overflow:hidden;border-left:1px solid rgba(0,0,0,.2);box-sizing:content-box}.customChat .customChat_header .customChat_header_text{width:100%;height:35px;padding-top:15px;text-align:center;color:#fff;font-family:\"Source Sans Pro\",sans-serif;font-size:25px;font-weight:lighter}.customChat .customChat_header .customChat_header_message{text-align:center;color:#fff;font-family:\"Source Sans Pro\",sans-serif;font-size:13px;font-weight:lighter}.customChat .customChat_middle_wrapper{height:auto;top:230px;bottom:0;width:100%;position:absolute;z-index:-2;border-left:1px solid rgba(0,0,0,.2);background-color:rgb(245,245,245)}.customChat>.customChat_middle_wrapper>.customChat_middle{background-color:#fff;position:absolute;top:0;left:0;width:100%;padding:10%;border-bottom:1px solid #dfdfdf;box-sizing:border-box;overflow:auto;max-height:100%}.customChat_pred{list-style:none;padding:4px;margin:0;background:#FEFEFE}.customChat_a a{display:block;margin:1px 0;padding:8px 20px;color:#34495E;background:#FFF;text-decoration:none;-webkit-transition:all .3s;-moz-transition:all .3s;transition:all .3s}.customChat_a a:focus,.customChat_a a:hover{background:#CE0C26;color:#FFF;padding-left:25px}.customChat_reponse{position:fixed;width:600px;height:100%;right:0px;top:0;color:#000;z-index:2147483646;font-family:myriad-pro,sans-serif;text-align:left;line-height:1.2;user-select:none!important;-khtml-user-select:none!important;-o-user-select:none!important;-moz-user-select:-moz-none!important;-webkit-user-select:none!important;-webkit-transition:all .35s linear;-moz-transition:all .35s linear;-o-transition:all .35s linear;transition:all .35s linear;margin-top:229px;}.customChat_rep_wrapper{background-color:#fff;position:absolute;top:0;left:0;width:100%;border:1px solid #dfdfdf;box-sizing:border-box;overflow:auto;max-height:50%;max-width:100%}.customChat_cb[type=checkbox]:checked,.customChat_cb[type=checkbox]:not(:checked){position:absolute;left:-9999px}.customChat_cb[type=checkbox]:checked+label,.customChat_cb[type=checkbox]:not(:checked)+label{position:relative;padding-left:75px;cursor:pointer}.customChat_cb[type=checkbox]:checked+label:after,.customChat_cb[type=checkbox]:checked+label:before,.customChat_cb[type=checkbox]:not(:checked)+label:after,.customChat_cb[type=checkbox]:not(:checked)+label:before{content:'';position:absolute}.customChat_cb[type=checkbox]:checked+label:before,.customChat_cb[type=checkbox]:not(:checked)+label:before{left:0;top:-3px;width:65px;height:30px;background:#DDD;border-radius:15px;-webkit-transition:background-color .2s;-moz-transition:background-color .2s;-ms-transition:background-color .2s;transition:background-color .2s}.customChat_cb[type=checkbox]:checked+label:after,.customChat_cb[type=checkbox]:not(:checked)+label:after{width:20px;height:20px;-webkit-transition:all .2s;-moz-transition:all .2s;-ms-transition:all .2s;transition:all .2s;border-radius:50%;background:#7F8C9A;top:2px;left:5px}.customChat_cb[type=checkbox]:checked+label:before{background:#34495E}.customChat_cb[type=checkbox]:checked+label:after{background:#CE0C26;top:2px;left:40px}.customChat_cb[type=checkbox]:checked+label .ui,.customChat_cb[type=checkbox]:checked+label .ui:after,.customChat_cb[type=checkbox]:not(:checked)+label .ui:before{position:absolute;left:6px;width:65px;border-radius:15px;font-size:14px;font-weight:700;line-height:22px;-webkit-transition:all .2s;-moz-transition:all .2s;-ms-transition:all .2s;transition:all .2s}.customChat_cb[type=checkbox]:not(:checked)+label .ui:before{content:'Non';left:32px}.customChat_cb[type=checkbox]:checked+label .ui:after{content:'Oui';color:#CE0C26}.customChat_btn[type=button]{background-color:#CE0C26;border-radius:15px;border:5px solid #34495E;width:65px;height:30px;cursor:pointer;margin-right:5px;-webkit-transition:all .3s;-moz-transition:all .3s;-ms-transition:all .3s;transition:all .3s}label{color:#34495E}.customChat_btn[type=button]:hover{background-color:#C94D4D}</style>", // base checkbox by @geoffrey_crofte
	template_Js: '<script id="js_cc">$("#rep_pred").click(function(){var s=$(".customChat_reponse");s.hasClass("visible")?($(this).css("backgroundColor","#6AD2EF"),s.animate({right:"-1000px"},200).removeClass("visible")):(s.animate({right:"0px"},200).addClass("visible"),$(this).css("backgroundColor","#C94D4D"))}),$("div#customChat_op").click(function(){var s=$(".customChat"),a=$(".customChat_reponse"), z=$("#modal_js");s.hasClass("visible")?(s.animate({right:"-1000px"},200).removeClass("visible"),a.animate({right:"-1000px"},200).removeClass("visible"),z.css("display", "none"),$("#rep_pred").css("backgroundColor","#6AD2EF"),$(\'div#customChat_op[data-role="blk"]\').animate({opacity:"0"},200,"swing",function(){$(\'div#customChat_op[data-role="blk"]\').css("display","none")})):(s.animate({right:"0px"},200).addClass("visible"),$(\'div#customChat_op[data-role="blk"]\').animate({opacity:"1"},200,"swing",function(){$(\'div#customChat_op[data-role="blk"]\').css("display","block")}))});</script>',
	template_M: '<div id="modal_js" style="display:none;width:600px;background-color:#fefefe;border:1px solid rgba(0, 0, 0, 0.2);border-radius:5px;-webkit-box-shadow: 0px 0px 15px rgba(0,0,0,0.3);-moz-box-shadow: 0px 0px 15px rgba(0,0,0,0.3);box-shadow: 0px 0px 15px rgba(0,0,0,0.3);z-index:9854136598742"><div id="modal_js_head" style="border-bottom:1px solid rgba(0, 0, 0, 0.2);padding:10px 15px 10px 15px;"></div><div id="modal_js_body" style="padding:15px;"></div><div id="modal_js_footer" style="border-top:1px solid rgba(0, 0, 0, 0.2);padding:10px 15px 25px 15px;text-align:right;"><input type="button" id="modal_js_cancel" class="button primary" value="Annuler" /><input type="button" id="modal_js_save" class="button" value="Sauvegarder" /></div></div>',
	init: function(){
		if(location.host == "dreamgaming.fr"){
			alert('PLA-PLA-PLAGIEUR');
			return location.href = "http://realitygaming.fr";
		}
		setInterval(function(){customChat.checkNewMsg();}, 250);
		if(location.pathname.indexOf('chatbox') != -1) {
			$('#taigachat_controls').append(this.template_Button);
			$('#customChat_op.fa.fa-bars').attr('style', 'font-style:none;float:right;cursor:pointer;font-size:24px;padding-right:10px;');
		}
		else {
			$('#taigachat_full').find('.nodeTitle').append(this.template_Button);
		}
		$('body').prepend(this.template_Html);
		$('body').prepend(this.template_Css);
		$('body').prepend(this.template_Js);
		$('body').prepend(this.template_M);
		var $notif = $('#notif[type=checkbox]');
		$notif.on('change', function(){
			scc.notif = $(this).is(':checked');
			customChat.save();
		});
		var $bot = $('#bot[type=checkbox]');
		$bot.on('change', function(){
			scc.bot = $(this).is(':checked');
			customChat.save();
		});
		var $hello = $('#hello[type=button]');
		$hello.on('click', function() {
			customChat.hello();
			customChat.save();
		});
		var $rep = $('a#customChat_rP');
		$rep.on('click', function(){
			if($(this).data('msg').length > 4) {
				scc.lastRP = Date.now();
				var $input = $('#taigachat_message');
				$input.val(($input.val().trim().length>1?$input.val().trim()+" ":"") + customChat.decode_b64($(this).data('msg')));
				customChat.save();
			}
			else {
				customChat.add_rP($(this));
			}
		});
		var $rep_del = $('a#customChat_del-rP');
		$rep_del.on('click', function(){
			customChat.del_rP();
		});
		
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
	save: function(){
		var settings_scc = JSON.stringify(scc);
		var settings_rP = JSON.stringify(rP);
		localStorage.setItem('settings_scc', settings_scc);
		localStorage.setItem('settings_rP', settings_rP);
	},
	load: function(){
		var a = localStorage.getItem("settings_scc");
		if(a){
			var b = Object.keys(scc);
			var c = JSON.parse(a);
			for(var i in b){
				if(c[b[i]] == undefined){
					this.save();
				}
				else {
					scc[b[i]] = c[b[i]];
				}
			}
		}
		else {
			this.save();
		}
		var z = localStorage.getItem("settings_rP");
		if(z){
			var b = Object.keys(rP);
			var c = JSON.parse(z);
			for(var i in b){
				if(c[b[i]] == undefined){
					this.save();
				}
				else {
					rP[b[i]] = c[b[i]];
				}
			}
		}
		else {
			this.save();
		}
		for(var i in rP){
			if(rP[i].title.length > 1 && rP[i].msg.length > 1){
				var num = i.substr(3);
				$('#customChat_rP[data-num="' + num + '"]').text(customChat.decode_b64(rP[i].title));
				$('#customChat_rP[data-num="' + num + '"]').data('msg', rP[i].msg);
			}
		}
		$('#notif[type=checkbox]').prop('checked', scc.notif);
		$('#bot[type=checkbox]').prop('checked', scc.bot);
		setInterval(function(){customChat.lastRP();}, 2000);
	},
	notify: function(msg) {
		if(scc.notif){
			if(!("Notification"in window)){console.error("Ce navigateur ne supporte pas les notifications !")}else if(Notification.permission==="granted"){var notification=new Notification(msg, {icon: 'http://i.imgur.com/UTnwcjK.png'})}else if(Notification.permission!=="denied"){Notification.requestPermission(function(e){if(!("permission"in Notification)){Notification.permission=e}if(e==="granted"){var t=new Notification(msg, {icon: 'http://realitygaming.fr/attachments/rg-png.14121/'})}})}
		}
		else {
			console.log('notif disable')
		}
	},
	checkNewMsg: function(){
		var msg = $('#taigachat_box').children('ol').children('li');
		for(var i in msg) {
			var id = msg.eq(i).data('messageid');
			var msg_text = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();
			var msg_sender = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('a').text().trim();
			if(this.msgID.indexOf(id) == -1 && msg_text.indexOf(this.username) != -1) {
				this.msgID.unshift(id);
				this.newMsg(id);
			}
			else if(this.__msgID.indexOf(id) == -1 && msg_sender == this.username && scc.bot){
				$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('a').children('span').attr('class', 'style10');
				this.__msgID.unshift(id);
			}
		}
	},
	newMsg: function(id) {
		$('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').css('backgroundColor', "rgba(179, 32, 32, 0.219608)");
		var msg = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('div').text().trim();
		var sender = $('#taigachat_box').children('ol').children('li[data-messageid="' + id + '"]').children('span').eq(1).children('a').text().trim();
		this.notify(sender + " - " + msg);
	},
	hello: function() {
		if((Date.now() - scc.lastH) >= 3600000){
			scc.lastH = Date.now();
			var user1 = $('#taigachat_box').children('ol').children('li').eq(5).children('span').eq(1).children('a').text();
			var user2 = $('#taigachat_box').children('ol').children('li').eq(17).children('span').eq(1).children('a').text();
			var user3 = $('#taigachat_box').children('ol').children('li').eq(23).children('span').eq(1).children('a').text();
			var userinchat = $('#taigachat_count').text();
			$("#taigachat_message").val("Salut à @" + user1 + " , @" + user2 + " , @" + user3 + " et aux " + userinchat + " membres actuellement sur le chat :)");
			this.save();
		}
		else{
			alert('Vous avez utilisé cette fonction il y a moins d\'un heure !');
		}
	},
	lastRP: function(){
		var ms = Date.now() - scc.lastRP,
		// http://stackoverflow.com/a/19700358
		seconds = parseInt((ms/1000)%60),
		minutes = parseInt((ms/(1000*60))%60),
		hours = parseInt((ms/(1000*60*60))%24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		var time = hours + ":" + minutes + ":" + seconds;
		$('#customChat_timer-rP').text('Dernier message envoyé il y a ' + time);
	},
	modal: function(title, body){
		$('#modal_js').css('display', 'block');
		$('#modal_js').center();
		$('#modal_js_head').html('<h2 style="font-family: \'Open Sans Condensed\',\'Arial\',sans-serif; font-size: 12pt; color: rgb(52, 73, 94);">' + title + '</h2>');
		$('#modal_js_body').html(body);
	},
	add_rP: function($rep){
		this.modal('Ajouter une réponse', '<input id="modal_js_rep_title" class="textCtrl" style="width:100%;height:20px;" placeholder="Entrez le titre du message" /><br/><br/><input id="modal_js_rep_body" class="textCtrl" style="width:100%;height:20px;" placeholder="Entrez le contenu du message" />');
		var is_add = true;
		$('#modal_js_save').on('click', function(){
			if(is_add){
				var rep_msg = $('#modal_js_rep_body').val().trim();
				var rep_title = $('#modal_js_rep_title').val().trim();
				if(rep_title.length > 2) {
					if(rep_msg.length > 4) {
						var cR = $rep.data('num');
						rP['rep' + cR].title = customChat.encode_b64(rep_title);
						rP['rep' + cR].msg = customChat.encode_b64(rep_msg);
						$('#modal_js').css('display', 'none');
						$rep.text(rep_title);
						$rep.data('msg', customChat.encode_b64(rep_msg));
						customChat.save();
						is_add = false;
					}
					else {
						alert('Votre message n\'est pas assez long !');
					}
				}
				else {
					alert('Votre titre n\'est pas assez long !');
				}
			}
		});
		$('#modal_js_cancel').on('click', function(){
			if(is_add){
				$('#modal_js').css('display', 'none');
				is_add = false;
			}
		});
	},
	del_rP: function(){
		this.modal('Entrer le chiffre de la réponse à supprimer', '<input id="modal_js_rep_num" class="textCtrl" style="width:100%;height:20px;" placeholder="Chiffre de la réponse à supprimer" /><br/>');
		var is_del = true;
		$('#modal_js_save').on('click', function(){
			if(is_del){
				var rep_num = $('#modal_js_rep_num').val().trim();
				if(rep_num > 0 && rep_num < 6){
					$('#customChat_rP[data-num="' + rep_num + '"]').text("Message " + rep_num);
					$('#customChat_rP[data-num="' + rep_num + '"]').data('msg', "");
					rP['rep' + rep_num].title = "";
					rP['rep' + rep_num].msg = "";
					$('#modal_js').css('display', 'none');
					customChat.save();
					is_del = false;
				}
			}
		});
		$('#modal_js_cancel').on('click', function(){
			if(is_del){
				$('#modal_js').css('display', 'none');
				is_del = false;
			}
		});
	}
};

customChat.init();
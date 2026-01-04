// ==UserScript==
// @name		La-cado
// @author		Ladoria
// @version		0.6
// @grant       none
// @description	Personnal script linked to item.
// @match		https://www.dreadcast.eu/Main
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright	2015+, Ladoria
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/31767/La-cado.user.js
// @updateURL https://update.greasyfork.org/scripts/31767/La-cado.meta.js
// ==/UserScript==

// Toutes informations ici est purement et strictement HRP. La plateforme greasefork n'est qu'un moyen de diffusion du script joueur à joueur et n'est en aucun cas liée à l'univers de Dreadcast. Tout abus justifiera une plainte MJ recevable pour confusion RP/HRP.

var activated = false;
var objectId = '1850580_';
//var objectId = '1949534_';
var messages = new Array();
var notThereCount = 0;
var alerteCount = 0;
var message_send = false;
var fakeTooltipCount = 0;
var lastMessage = 0;
var cookie_prefix = 'la_cado_';

messages['notThere'] = ['Nah-ha, pas ici. Je suis une réplique!', 'Vous n\'avez pas intérêt à continuer.', '\'Suffit ma Domptée!', 'Je vous aurai prévenu...'];
messages['member'] = ['Amusez-vous autant que vous voulez, mais restez Mienne!', 'Oui ma Dévouée, qu\'il y a-t-il?', 'Vous avez peur du noir? Je suis là.', 'Ssshhhh, ma Domptée, \'pouvez m\'enlacer à tout moment.', 'Un problème? Dites-moi tout.', 'Vous pouvez tout me dire, ou m\'envoyer un message.', 'Vous êtes-vous bien amusée aujourd\'hui?', 'Ca ne va pas? Retournez-jouer! Puis revenez-moi.', 'J\'ai froid, réchauffez-moi.', 'Je sais ma Propriété, ne vous en faites pas.', 'Soyez gentille.', 'Je ne vous ferai de compliments qu\'en vrai et seulement si vous les méritez.', 'N\'oubliez pas que je suis toujours là.', 'Ma Domptée, ne vous abîmez pas.', 'Quelque chose vous tracasse? Cassez-lui les dents.', 'Les mâles sont tous les mêmes, préférez votre Maîtresse.', 'Aucune Mulier ne vaut votre Maitresse.', 'Restez vous-même, c\'est comme ça que je vous veux.', 'Restez inventive.', 'Surprenez-moi.', 'Que les prostiputes prérissent!', 'Vous n\'êtes faite pour personne d\'autre que moi. Et vous le savez.', 'Un mâle c\est comme un menteur, en plus d\'être moche.', 'Que personne ne vous touche! Sauf moi et cette peluche.', 'Les pervers doivent brûler!', 'Suis-je jolie? Autant que vous?', 'Si quelqu\'un vous veut, rejetez-le.', 'Quand on vous drague, prévenez-moi.', 'Connaissez-vous la différence entre un mâle et un incapable? Je cherche encore.', 'Les Mulieres vaincront!', '<span class="italic">*Rire franc*</span>', '<span class="italic">*Rire gêné*</span>', '<span class="italic">*Soupir doux*</span>', 'Tsss\'t... sacrée Domptée. <span class="italic">*son de baiser*</span>', 'Vous ne savez pas quoi faire? Hum, jouer est un bon début.', 'Faites attention aux chauves, \'sont dangereux.'];
messages['head'] = ['Attention aux oreilles.', 'Vous pouvez ôter le borsalino, mais faites-y attention.', 'Qu\'il n\'arrive rien à ce chapeau!', 'Mais... m\'enfin, mordez-les si vous voulez.'];
messages['arm'] = ['Ces bras-ci sont petits, mais les vrais vous attendent.', 'Humpf, ne les tirez pas trop!', 'Flexibles, mais pas indestructibles!'];
messages['body'] = ['Gaffe au griffe, sous cette forme, je me déchire.', 'Ne me serrez pas trop fort, mais aussi longtemps que nécessaire.', 'Dites que votre Propriétaire est belle!', 'N\'oubliez pas de changer mes piles.'];
messages['hand'] = ['Vous, vous voulez des caresses?', 'Ses mains seront toujours là pour vous.', 'Les griffes sont fausses, ça ne vous blessera pas.', 'Cinq doigts, comme sur l\originale, pas la peine de vérifier.'];
messages['leg'] = ['Comment les trouvez-vous, mes jambes?', 'Gardez-en tête que je préfère un vrai contact.', '\'Pouvez me faire marcher, ça sera amusant.', 'Danser? Non, pas maintenant.'];
messages['foot'] = ['Merci du massage, ma bienveillante.', 'Vous êtes si attentionnée, mais mon autre pied semble jaloux.', 'Je vous rendrai la pareille.', 'Ne les croquez pas!'];
messages['tail'] = ['Attention, \'savez que c\'est délicat.', 'La chaussette ne se retire pas, les sous-vêtements non plus.', 'Ne jouez pas trop avec, certains disent que ça rend sourd.', 'Celle-ci ne remue pas, j\'en suis navrée.'];

messages['error'] = ['ERREUR SYSTEME', '... ... ... BIP.', '... ... ... BZZZ.', '<span class="italic">*forts grésillements*</span>'];
messages['batteryEmpty'] = ['Piles critiques, changement nécess... <span class="italic">*grésillements faible*</span> ... aire.'];
messages['alerte'] = ['Envoie de l\'alerte à votre Maîtresse.', 'Alerte déjà envoyée à votre Maîtresse.'];
messages['unique'] = ['J\'ai été une vilaine peluche, plus jamais je ne vous décevrais!'];

jQuery.noConflict();

$(document).ready( function() {
	$('head').append('<style>#La_cado  {position: absolute;top: 150px;left: 525px;display: none;}#La_cado .image {margin: -3px;}#La_cado .interieur {margin: 7px;}#La_cado .message {position: absolute;top: 91px;left: 63px;}#La_cado .italic {font-style: italic;}#La_cado .fakeToolTip .deco1 {left: 20px;}/*#La_cado .fakeToolTip .yes {float: left;}#La_cado .fakeToolTip .no {float: right;}*/#La_cado .secondToolTip  {position: relative;margin-top: 6px;top: 0px;left: 0px;}#La_cado .secondToolTip .deco1 {display: none;}#La_cado .member {position: absolute;opacity: 0.4;cursor: pointer;}/*#La_cado .head {background-color: blue;}#La_cado .arm {background-color: green;}#La_cado .hand {background-color: pink;}#La_cado .tail {background-color: brown;}#La_cado .leg {background-color: white;}#La_cado .foot {background-color: red;}#La_cado .notThere {background-color: orange;}#La_cado .body {background-color: yellow;}*/#La_cado .head.part1 {height: 56px;width: 96px;top: 27px;left: 55px;}#La_cado .head.part2 {height: 25px;width: 54px;top: 2px;left: 75px;}#La_cado .body {height: 131px;width: 65px;left: 60px;top: 83px;}#La_cado .arm.left.part1{left: 37px;top: 160px;height: 54px;width: 23px;}#La_cado .arm.left.part2{left: 46px;top: 120px;height: 40px;width: 14px;}#La_cado .arm.left.part3{left: 52px;top: 112px;height: 8px;width: 4px;}#La_cado .arm.right.part1{left: 120px;height: 51px;width: 35px;top: 83px;}#La_cado .arm.right.part2{left: 134px;height: 101px;width: 36px;top: 113px;}#La_cado .arm.right.part3{left: 127px;height: 13px;width: 8px;top: 133px;}#La_cado .arm.right.part3{left: 125px;height: 14px;width: 9px;top: 134px;}#La_cado .hand.right {left: 105px;height: 50px;width: 32px;top: 173px;}#La_cado .tail.part1 {height: 36px;width: 21px;top: 228px;left: 139px;}#La_cado .tail.part2 {height: 33px;width: 30px;top: 239px;left: 146px;}#La_cado .tail.part3 {height: 67px;width: 28px;top: 258px;left: 161px;}#La_cado .notThere {cursor: not-allowed;}#La_cado .notThere.part1 {height: 34px;width: 20px;left: 56px;top: 105px;}#La_cado .notThere.part2 {height: 37px;width: 35px;left: 81px;top: 107px;}#La_cado .notThere.part3 {height: 28px;width: 15px;left: 77px;top: 214px;}#La_cado .leg.left.part1 {height: 45px;width: 8px;left: 28px;top: 230px;}#La_cado .leg.left.part2 {height: 81px;width: 49px;left: 36px;top: 214px;}#La_cado .leg.left.part3 {height: 48px;width: 28px;left: 53px;top: 295px;}#La_cado .leg.left.part4 {height: 24px;width: 16px;left: 37px;top: 319px;}#La_cado .leg.right.part1 {height: 61px;width: 51px;left: 88px;top: 214px;}#La_cado .leg.right.part2 {height: 17px;width: 43px;left: 95px;top: 275px;}#La_cado .leg.right.part3 {height: 18px;width: 37px;left: 105px;top: 292px;}#La_cado .leg.right.part4 {height: 52px;width: 40px;left: 117px;top: 310px;}#La_cado .leg.right.part5 {height: 37px;width: 2px;left: 86px;top: 214px;}#La_cado .foot.left {left: 3px;height: 26px;width: 71px;top: 343px;}#La_cado .foot.right {left: 100px;height: 38px;width: 65px;top: 362px;}</style>');
	
	$('body').append('<div id="La_cado" class="zone_conteneurs_displayed"><div class="conteneur ui-draggable"><div class="titreConteneur">Peluche Ladoria</div><div class="conteneur_content"><div class="fond1"></div><div class="fond2"></div><div class="fond3"></div><div class="fond4"></div><div class="fond5"></div><div class="fond6"></div><div class="fond7"></div><div class="fond8"></div><div id="doll" class="objects"><div class="interieur info_objet"><img class="image" src="http://image.noelshack.com/fichiers/2015/05/1422620642-ladollxcf-halo-clean.png" alt="Poupée Ladoria"><div class="head member part1"></div><div class="head member part2"></div><div class="body member"></div><div class="tail member part1"></div><div class="tail member part2"></div><div class="tail member part3"></div><div class="arm member left part1"></div><div class="arm member left part2"></div><div class="arm member left part3"></div><div class="arm member right part1"></div><div class="arm member right part2"></div><div class="arm member right part3"></div><div class="arm member right part4"></div><div class="leg member left part1"></div><div class="leg member left part2"></div><div class="leg member left part3"></div><div class="leg member left part4"></div><div class="leg member right part1"></div><div class="leg member right part2"></div><div class="leg member right part3"></div><div class="leg member right part4"></div><div class="leg member right part5"></div><div class="foot member left"></div><div class="foot member right"></div><div class="hand member right"></div><div class="notThere member part1"></div><div class="notThere member part2"></div><div class="notThere member part3"></div></div></div><div class="close link"></div></div></div></div>');

	saveCookie('unique_message', '1');
	
	function toogleDoll(loader) {
		if(true == loader)
			$('.La_cado_case .objetLoader').show();
		
		if($('.La_cado_case').hasClass('active'))
			$('.La_cado_case').removeClass('active');
		else
			$('.La_cado_case').addClass('active');
		
		activated = !activated;
		
		if(true == activated) {
			$('#La_cado').show()
			$('#La_cado').fadeTo(300, 1, function() {$('.La_cado_case .objetLoader').hide()});
		}
		else
			$('#La_cado').fadeTo(300, 0, function() {
				$('.La_cado_case .objetLoader').hide()
				$('#La_cado').hide();
			});
		
		return;
	}
	
	function makeDollAppearsContainer() {
		var newDoll = $('[id*="' + objectId + '"].ui-draggable').parent();
		
		if(0 == newDoll.length)
			return;
		
		if(newDoll.hasClass('La_cado_case'))
			return;
		
		newDoll.addClass('La_cado_case');
		
		$('[id*="' + objectId + '"]').attr('src','http://image.noelshack.com/fichiers/2015/05/1422550468-ladollxcf-mini.png');
		
		newDoll.children('img.ui-draggable').hide().show();
		
		newDoll.children('.quantite').hide();
		
		var infos = newDoll.find('.info_objet');
		
		infos.find('.conteneur_image img').attr('src','http://image.noelshack.com/fichiers/2015/05/1422551989-ladollxcf-medium.png');
		
		infos.children('.titreinfo').html('Peluche Ladoria');
		
		infos.children('.typeinfo').html('Peluche');
		
		infos.children('.description').html('Pourvoit réconfort à une Propriété dont la Maîtresse est lointaine.<br>Toucher velours, piles incluses.');
		
		$('.La_cado_case').on('click', function() {
			toogleDoll(true);
		});
	}
	
	function get_message(type,part) {
		if(getCookie('unique_message') == undefined || getCookie('unique_message') == '1')
		{
			saveCookie('unique_message', '0');
			return messages['unique'][0];
		}
	
		if(get_random(20,false) == 1)
			return messages['error'][get_random(messages['error'].length - 1, true)];
			
		if(get_random(1000,false) == 1)
			return messages['batteryEmpty'][get_random(messages['batteryEmpty'].length - 1, true)];
	
		if('member' == type) {
			notThereCount = 0;
			
			if(get_random(2, false) == 0) {
				return messages[part][get_random(messages[part].length - 1, true)];
			}
			else {
				return messages['member'][get_random(messages['member'].length - 1, true)];
			}
		}
		
		if(messages['notThere'].length - 1 >= notThereCount)
			notThereCount++;
		else {
			send_message_to_mistress();
			
			if(messages['alerte'].length - 1 >= alerteCount)
				alerteCount++;
			
			return messages['alerte'][alerteCount - 1];
		}
		
		return messages['notThere'][notThereCount - 1];
	}
	
	function get_random(limit,saveMessage) {
		var newMessage = 0;
		
		if(false == saveMessage)
			return Math.round(Math.random() * limit);
			
	
		for (var i = 0; i < 5; i++) {
			newMessage = Math.round(Math.random() * limit);
			
			if(lastMessage != newMessage)
				break;
		}
		
		lastMessage = newMessage;
	
		return newMessage;
	}
	
	function show_tooltip(message,appendTo) {
		var fakeTooltipId = fakeTooltipCount++;
		var secondToolTip = '';
		appendTo = (typeof appendTo === "undefined") ? '' : ' #' + appendTo;
		
		if('' != appendTo)
			secondToolTip = ' secondToolTip';
		
		$('#La_cado .conteneur_content' + appendTo).append('<div id="' + fakeTooltipId + '" class="message fakeToolTip' + secondToolTip + '"><div class="deco1"></div><span>' + message + '</span></div>');
	
		$('#La_cado #' + fakeTooltipId).fadeTo(300, 1,
			function() {
				setTimeout(
					function() { $('#La_cado #' + fakeTooltipId).fadeTo(300, 0,
						function() {$('#La_cado #' + fakeTooltipId).remove()}); }
				,3000)
		});
	};

	$('#La_cado .close').on('click', function() {
		toogleDoll(false);
	});
	
	$('#La_cado #doll .member').on('click', function() {
		var type = 'member';
		var part = 'notThere'
		
		if($(this).hasClass('notThere')) {
			type = 'notThere';
		}
		if($(this).hasClass('head')) {
			part = 'head';
		}
		if($(this).hasClass('body')) {
			part = 'body';
		}
		if($(this).hasClass('arm')) {
			part = 'arm';
		}
		if($(this).hasClass('hand')) {
			part = 'hand';
		}
		if($(this).hasClass('leg')) {
			part = 'leg';
		}
		if($(this).hasClass('foot')) {
			part = 'foot';
		}
		if($(this).hasClass('tail')) {
			part = 'tail';
		}
		
		show_tooltip(get_message(type,part));
	});
	
	$(document).ajaxComplete( function(a,b,c) {
		if(/(Item\/Activate|Item\/Move)/.test(c.url)) {
			makeDollAppearsContainer();
		}
	});
	
	makeDollAppearsContainer();
	
	function send_message_to_mistress() {
		if(true == message_send) return;
		
		message_send = true;
		
		target = 'Ladoria';
		title = '[Alerte Domptée : Poupée.]';
		text = 'Récidive de tripatouillage de poupée avéré.';
		
		$.ajax({
			type: 'POST',
			url: 'https://www.dreadcast.eu/Menu/Messaging/NewMessage',
			data: '&nm_cible=' + target + '&nm_sujet=' + title + '&nm_texte=' + text + '&id_plainte=',
			success: function(msg) {
				setTimeout(
					function() {show_tooltip('Message envoyé.', $('#La_cado .message').last().attr('id'));}
					, 1000
				);
			}
		});
	}
});

// handle coockies
function saveCookie(name,val) {
	name = cookie_prefix + name;
	
	if(!navigator.cookieEnabled) return;
		document.cookie = name + '=' + val + ';expires=Wed, 01 Jan 2020 00:00:00 GMT; path=/';
}
function getCookie(var_name) {
	name = cookie_prefix + var_name;
	
	if(!navigator.cookieEnabled) return undefined;
	
	var start = document.cookie.indexOf(name + '=')
	if(start == -1) return undefined;
	start += name.length + 1;
	
	var end = document.cookie.indexOf(';',start);
	if (end == -1) end = document.cookie.lenght;
	
	return document.cookie.substring(start,end);
};

console.log('DC - La-cado started');
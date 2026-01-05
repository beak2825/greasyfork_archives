// ==UserScript==
// @name        Ubuntu-it Mod Helper
// @description Ubuntu-it Mod Helper Script
// @require     http://code.jquery.com/jquery-1.9.1.js
// @include     http*://forum.ubuntu-it.org/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     0.202001301110
// @namespace   https://greasyfork.org/users/3779
// @downloadURL https://update.greasyfork.org/scripts/4080/Ubuntu-it%20Mod%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4080/Ubuntu-it%20Mod%20Helper.meta.js
// ==/UserScript==

jQuery.expr[':'].Contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

function getPage(){
	return window.location.href.match(/[^\/?]+.php/)[0];
}

var TOR_LIST = 'https://www.dan.me.uk/torlist/';

var console = unsafeWindow ? unsafeWindow.console : console;

var knownEmailProviders = [
    'alexanderbroker.com',
    'alice.it',
    'antoniocalabro.it',
    'aruba.it',
    'baiologi.net',
    'ciopper.com',
//    'email.it',
    'emcelettronica.com',
    'excite.it',
    'fastwebnet.it',
    'giallo.it',
    'gmail.com',
    'googlemail.com',
    'hotmail.it',
    'hotmail.com',
    'icloud.com',
    'idesignwebstudio.com',
    'iol.it',
    'inwind.it',
    'libero.it',
    'katamail.com',
    'katamail.it',
    'kerigmainformaticasistemi.com',
    'live.it',
    'live.com',
    'mantissa.it',
    'mclink.it',
    'mclink.net',
    'me.com',
    'morins.it',
    'msn.com',
    'ostunimare.net',
    'outlook.com',
    'outlook.it',
    'poste.it',
    'ricercaict.it',
    'rocketmail.com',
    'studenti.unipd.it',
    'tim.it',
    'ubuntu.com',
    'ubuntu-it.org',
    'unibo.it',
    'teletu.it',
    'tin.it',
    'tiscali.it',
    'tiscalinet.it',
    'torrescalla.it',
    'uonline.it',
    'virgilio.it',
    'vodafone.it',
    'vogliaditerra.com',
    'yahoo.com',
    'yahoo.it',
    'yahoo.pt',
    'ymail.com'
];

if( !String.prototype.endsWith ){
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

function checkIfBanned( user, id, ifBannedCallback, endCallback ){
	var url = './mcp.php?i=ban&mode=user&u=' + id;
	$.get(url,function(res){
		var opt = $('#unban option',$(res)).filter(function() {
			return $(this).text() === user;
		});
		var banned = opt.length > 0;
		if( banned ){
			var matchLength = res.match("ban_length.*"+opt.val()+".*'(.*)'.*");
			var matchReason = res.match("ban_reason.*"+opt.val()+".*= '(.*)';");

            var length = matchLength && matchLength.length ? matchLength[1] : 0;
            var reason = matchReason && matchReason.length ? matchReason[1].replace('\\','') : 'motivo non trovato';

			ifBannedCallback(length, reason);
		}
		endCallback();
	});
}

function isTor(address, torAddresses){
	return torAddresses.indexOf(address)>=0;
}

function doWork(torAddresses){
	if( $('#viewprofile').length ){
		var user = $('.details:first dd:first span').text();
		var id = $('.details:first dd:first a:last').attr('href').match('u=([0-9]+)')[1];
		checkIfBanned( user, id, function(l,r){
			if( l === 'Definitivamente' ){
				var text = 'UTENTE BANNATO per "'+r+'"';
			}else{
				var text = 'UTENTE SOSPESO '+l+' per "'+r+'"';
			}
			var $msg = $('<h4>')
				.css({
					padding: '4px',
					borderRadius: '3px',
					color: "yellow",
					backgroundColor: 'red'
				})
				.text(text);
			$('#page-body h2:first').after($msg);
		});
	}else{
		$('a[href^="./memberlist.php?mode=viewprofile&u="]').each(function(){
			var $link = $(this);
			var href = $link.attr('href');
			var name = $link.text();
			var $locations = $link.parent().next().next();
			var user = $link.text();
			var id = href.replace('./memberlist.php?mode=viewprofile&u=','');
			checkIfBanned( 
				user, 
				id, 
				function(l,r){
					if( l === 'Permanente' ){
						var text = 'UTENTE BANNATO per "'+r+'"';
					}else{
						var text = 'UTENTE SOSPESO '+l+' per "'+r+'"';
					}
					var $msg = $('<div>')
						.css({
							padding: '4px',
							borderRadius: '3px',
							color: "yellow",
							backgroundColor: 'red'
						})
						.text(text);
					$link.parent().append($msg);
				},
				function(){
					
					$.get('//forum.ubuntu-it.org/mcp.php?i=notes&mode=user_notes&u='+id,function(data){
						$('form td',$(data)).filter(function(){
							return (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/).test( $(this).text() );
						}).each(function(){
							var ip = $(this).text().trim();
							var ipText = ip;
							if( isTor(ip,torAddresses) ){
								ipText = '<span style="font-weight: bold; color: #a00;">TOR! '+ip+'</span>';
							}
							var linkText = $(this).next().next().text() + ' by '+ $(this).prev().text() + ' ' + $(this).next().text();
							var ipLink = $('<a href="http://www.infobyip.com/ip-'+ip+'.html" target="_blank" title="'+linkText+'">'+ipText+'</a>').css({ margin: 5 });
							$locations.append(ipLink);
						});
					})
					$.get(href,function(data){
						var maillink = $('a[href^="mailto"]',$(data));
						if( maillink.length>0 ){
							var email = maillink.attr('href').substr(7);
							for( var p in knownEmailProviders ){
								if( email.endsWith( knownEmailProviders[p] ) ){
									$link.after(' ('+email+')');
									return;
								}
							}
							if( $('#email-warning').length === 0 ){
								$('.solo').append('<span id="email-warning" style="margin-left: 20px; font-size: 0.6em; color:#a00; background-color: yellow;">WARNING - ci sono <span style="font-weight: bold; font-size: 1.2em;" class="count">0</span> indirizzi email non riconosciuti in questa pagina</span>');
							}
							var $count = $('#email-warning .count');
							$count.text( parseInt( $count.text() ) + 1);
							$link.after(' (<span style="color: #a00; font-weight: bold;">'+email+'</span>)');
						}
					});
				}
			);
		});
	}
}

function LocalDBGet(key, defaultValue){
	defaultValue = defaultValue || null;
	var val = window.localStorage.getItem(key);
	return val === null ? defaultValue : JSON.parse(val);
}

function LocalDBSet(key, value){
	var val = JSON.stringify(value);
	window.localStorage.setItem(key,val);
}

function isUpdated(time){
	var delta = 1000*60*30;
	time = parseInt(time) + delta;
	return (time > getTime());
}

function getTime(){
	return new Date().getTime();
}

function getTorAddresses(callback){
	var torData = LocalDBGet('torData');
	if( torData && isUpdated(torData.time) ){
		console.log('torData loaded from cache');
		callback(torData.addresses);
	}else{
		GM_xmlhttpRequest({
			method: "GET",
			url: TOR_LIST,
			onload: function(response) {
				console.log('new torData request');
				var torData = {
					time: getTime(),
					addresses: response.responseText.split('\n')
				};
				LocalDBSet('torData',torData);
				callback(torData.addresses);
			},
			onerror: function(){
				callback([]);
			}
		});
	}
}

function moveHelper(){
	var select = $('select[name="to_forum_id"]');
	var autocomplete = $('<input type="text" placeholder="Ricerca veloce">');
	autocomplete.css({
		marginBottom: '5px',
		width: select.width()
	});
	autocomplete.keyup(function(e){console.debug(e);
		var val = autocomplete.val();
	  switch(e.key){
			case 'ArrowUp':
				select.val(select.find('option:selected').prev().val());
				break;
			case 'ArrowDown':
				select.val(select.find('option:selected').next().val());
				break;
			default:
				var options = select.find('option:not(:disabled):Contains("'+val+'")');
				select.val(options.val());
				break;
		}
	});
	select.before(autocomplete);
	autocomplete.focus().after('<br>');
}

switch( getPage() ){
	case 'memberlist.php':
    getTorAddresses( doWork );
		break;
	case 'mcp.php':
    moveHelper();
		break;
}

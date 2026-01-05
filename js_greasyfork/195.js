/*
 * Copyright (c) 2007-2016 OmertaBeyond Dev Team
 *
 * OmertaBeyond is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OmertaBeyond is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OmertaBeyond.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

// ==UserScript==
// @name                     Omerta Beyond
// @id                       Omerta Beyond
// @version                  2.0.67
// @date                     19-01-2016
// @description              Omerta Beyond 2.0 (We're back to reclaim the throne ;))
// @homepageURL              https://www.omertabeyond.net/
// @namespace                v4.omertabeyond.com
// @supportURL               https://github.com/OmertaBeyond/OBv2/issues
// @icon                     https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @screenshot               https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @author                   OBDev Team <info@omertabeyond.com>
// @author                   vBm <vbm@omertabeyond.com>
// @author                   Dopedog <dopedog@omertabeyond.com>
// @author                   Rix <rix@omertabeyond.com>
// @author                   MrWhite <mrwhite@omertabeyond.com>
// @author                   MurderInc <murderinc@omertabeyond.com>
// @author                   Sebbe <sebbe@omertabeyond.com>
// @author                   Brainscrewer <brainscrewer@omertabeyond.com>
// @author                   semitom <tom.gankema@gmail.com>
// @oujs:author              vBm
// @oujs:collaborator        Gwildor
// @oujs:collaborator        MurderInc
// @oujs:collaborator        Sebbe
// @oujs:collaborator        Brainscrewer
// @oujs:collaborator        Ivdbroek85
// @license                  GNU General Public License v3
// @contributionURL          https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=sbanks%40omertabeyond%2ecom&lc=GB&item_name=Omerta%20Beyond&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
// @contributionAmount       €3.00
// @encoding                 UTF-8
// @priority                 1
// @require                  https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require                  https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @require                  https://cdnjs.cloudflare.com/ajax/libs/howler/1.1.17/howler.min.js
// @resource    css          https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/scripts/beyond.css
// @resource    favicon      https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/favicon.png
// @resource    logo         https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/logo.png
// @resource    logo-old     https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/logo-old.png
// @resource    prev         https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/prev.png
// @resource    next         https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/next.png
// @resource    reply        https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/reply.png
// @resource    delete       https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/delete.png
// @resource    log          https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/changelog.png
// @resource    rip          https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/rip.png
// @resource    red-star     https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/red-star.png
// @resource    NRicon       https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/magnifier.png
// @resource    loadingicon  https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/loading.png
// @include                  http://*.barafranca.com/*
// @include                  https://*.barafranca.com/*
// @include                  http://barafranca.com/*
// @include                  https://barafranca.com/*
// @include                  http://*.barafranca.nl/*
// @include                  https://*.barafranca.nl/*
// @include                  http://barafranca.nl/*
// @include                  https://barafranca.nl/*
// @include                  http://*.barafranca.us/*
// @include                  https://*.barafranca.us/*
// @include                  http://barafranca.us/*
// @include                  https://barafranca.us/*
// @include                  http://*.barafranca.gen.tr/*
// @include                  https://*.barafranca.gen.tr/*
// @include                  http://barafranca.gen.tr/*
// @include                  https://barafranca.gen.tr/*
// @include                  http://omerta.com.tr/*
// @include                  https://omerta.com.tr/*
// @include                  http://*.omerta.com.tr/*
// @include                  https://*.omerta.com.tr/*
// @include                  http://*.omerta.dm/*
// @include                  https://*.omerta.dm/*
// @include                  http://omerta.dm/*
// @include                  https://omerta.dm/*
// @include                  http://*.omerta.pt/*
// @include                  https://*.omerta.pt/*
// @include                  http://omerta.pt/*
// @include                  https://omerta.pt/*
// @include                  https://*.omerta.land*
// @exclude                  http://*/game-register.php*
// @exclude                  https://*/game-register.php*
// @grant                    GM_getResourceText
// @grant                    GM_getResourceURL
// @grant                    GM_addStyle
// @grant                    GM_xmlhttpRequest
// @grant                    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/195/Omerta%20Beyond.user.js
// @updateURL https://update.greasyfork.org/scripts/195/Omerta%20Beyond.meta.js
// ==/UserScript==

/*
 * Define constants for our website
 */

var OB_WEBSITE = 'https://www.omertabeyond.net';
var OB_API_WEBSITE = 'https://gm.omertabeyond.net';
var OB_NEWS_WEBSITE = 'https://news.omertabeyond.net';
var OB_RIX_WEBSITE = 'https://rix.omertabeyond.net';
var OB_CDN_URL = 'https://d1oi19aitxwcck.cloudfront.net';
var OB_VERSION = '2.0.67';

/*
 * Define crucial functions and variables
 */

function whatV(hostname) {
	hostname = hostname || window.location.hostname;
	if (/(.*).omerta.land$/.test(hostname)) {
		return 'dev';
	}

	switch (hostname) {
		case 'www.omerta3.com':
		case 'omerta3.com':
		case 'www.barafranca.com':
		case 'barafranca.com':
		case 'www.barafranca.us':
		case 'barafranca.us':
			return 'com';
		case 'omerta.dm':
		case 'www.omerta.dm':
			return 'dm';
		case 'www.barafranca.nl':
		case 'barafranca.nl':
			return 'nl';
		case 'www.barafranca.gen.tr':
		case 'barafranca.gen.tr':
			return 'tr';
		case 'omerta.pt':
		case 'www.omerta.pt':
			return 'pt';
		default:
			return undefined;
	}
}

var v = whatV();
var ranks = ['Empty-suit', 'Delivery Boy', 'Delivery Girl', 'Picciotto', 'Shoplifter', 'Pickpocket', 'Thief', 'Associate', 'Mobster', 'Soldier', 'Swindler', 'Assassin', 'Local Chief', 'Chief', 'Bruglione', 'Capodecina', 'Godfather', 'First Lady'];
var cities = ['Detroit', 'Chicago', 'Palermo', 'New York', 'Las Vegas', 'Philadelphia', 'Baltimore', 'Corleone'];


if (localStorage.getItem('ob_uid') === null) {
	localStorage.setItem('ob_uid', Math.random().toString(36).substr(2, 9));
}

window.addEventListener('error', function(e) {
	$.post(OB_API_WEBSITE + '/?p=jserror', {
		message: e.message,
		stack: e.error.stack,
		filename: e.filename,
		line: e.lineno,
		game_version: v,
		ob_version: OB_VERSION,
		ob_uid: localStorage.getItem('ob_uid')
	});
});

/*
 * Settings helpers
 */

function getV(name, standard) {
	return (localStorage[name + '_' + v] || standard);
}

function setV(name, value) {
	return (localStorage[name + '_' + v] = value);
}

function getA(name) {
	return (JSON.parse(localStorage[name + '_' + v]));
}

if (localStorage['prefs_' + v]) {
	var prefs = getA('prefs');
} else {
	var prefs = {};
}

if (localStorage['sets_' + v]) {
	var sets = getA('sets');
} else {
	var sets = {};
}

function setA(name, pref, value) {
	if (name === 'prefs') {
		prefs[pref] = value;
		return (localStorage[name + '_' + v] = JSON.stringify(prefs));
	}
	if (name === 'sets') {
		sets[pref] = value;
		return (localStorage[name + '_' + v] = JSON.stringify(sets));
	}
}

/*
 * Helper functions
 */

function rand(min, max) {
	return Math.floor(((max - min) + 1) * Math.random()) + min;
}

function array_sum(array) {
	return array.reduce(function (a, b) {
		return (a + b);
	});
}

function iMax(array) {
	return array.indexOf(Math.max.apply({}, array));
}

function iMin(array) {
	return array.indexOf(Math.min.apply({}, array));
}

function on_page(str) {
	if (window.location.hash.indexOf(str) != -1) {
		return true;
	} else {
		return false;
	}
}

function time() {
	return Math.floor(parseInt(new Date().getTime(), 10) / 1000);
}

function GetParam(name) {
	var results = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href);
	return results === null ? 0 : (results[1] || 0);
}

function isVisible(node) {
	var win = $(window);
	var viewport = {
		top: win.scrollTop(),
		left: win.scrollLeft()
	};
	viewport.right = viewport.left + win.width();
	viewport.bottom = viewport.top + win.height();

	var bounds = node.offset();
	bounds.right = bounds.left + node.outerWidth();
	bounds.bottom = bounds.top + node.outerHeight();

	return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
}

// show footer div only when last tr is not visible
function toggleFooterVisibility() {
	if (isVisible($('tr:has(input[name="shipcity"])'))) {
		$('#footer').css('display', 'none');
	} else {
		$('#footer').css('display', 'block');
	}
}

function voteNow(save) {
	$('a[name="forticket"]').each(function () {
		window.open(this);
	});
	if (save) { // store last voting time
		setV('lastvote', time());
	}
}

function delMsg(what, name) {
	$('tr[class*="color"]').each(function () {
		var msgTr = $(this);
		var msgTitle = msgTr.find('td:eq(1)').text().replace(/\s/g, '').replace(/(\[\d+\])/g, '');
		var thismsgid = msgTr.find('td:eq(1)').find('a').attr('href').split('iMsgId=')[1];
		name = name.replace(/\s/g, '').replace(/(\[\d+\])/g, '');
		if (what == 'id') {
			if (name == thismsgid) {
				$.get('//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=delMsg&iId=' + thismsgid + '&iParty=2', function (data) {
					$('font[color="red"]').text('Message deleted.');
				});
				msgTr.hide();
				msgTr.next().hide();
			}
		} else if (what == 'name') {
			if (name == msgTitle) {
				$.get('//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=delMsg&iId=' + thismsgid + '&iParty=2', function (data) {
					$('font[color="red"]').text('Message deleted.');
				});
				msgTr.hide();
				msgTr.next().hide();
			}
		}
	});
}

function commafy(number) {
	var str = (number + '').split('.'),
		dec = str[1] || '',
		number = str[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
	return (dec) ? number + '.' + dec : number;
}

function getPow(name, i, def) {
	var info = getV(name, '' + def);
	var w;
	if (name == 'bninfo') {
		w = 2; // set width of buckets
	} else if (name == 'prefs') {
		w = 1;
	}
	return (1 * info.substr((i * w), w)); // return int version of bucket
}

function setPow(name, i, value) {
	var info = getV(name, '0');
	var w;
	if (name == 'bninfo') {
		w = 2; // set width of buckets
	} else if (name == 'prefs') {
		w = 1;
	}
	i = i * w; // set string index
	value += ''; // toString
	while (value.length < w) {
		value = '0' + value; // pad with zeros
	}
	if (i > 0 && (i + w) < info.length) {
		info = info.substring(0, i) + value + info.substring(i + w); // value goes in middle
	} else if (i === 0) {
		info = value + info.substring(w); // value goes at beginning
	} else if ((i + w) >= info.length) {
		info = info.substring(0, i) + value; // value goes at end
	} else {
		return;
	}
	setV(name, info); // store string
}

function grabHTML(url, func) {
	var r = 0;
	if (window.XMLHttpRequest) {
		r = new XMLHttpRequest();
	}
	r.onreadystatechange = function () {
		if (r.readyState == 4) {
			if (r.status == 200) {
				func(r.responseText, url);
			}
		}
	};
	r.open('GET', url, true);
	r.send(null);
}

function bnUpdate(current) {
	var nick, rank, bloodType, city, ride;
	if (!IsNewVersion()) {
		var xpath = current ? '#game_container' : '#str2dom'; // use current page OR xhr str2dom
		nick = $(xpath + ' > table > tbody > tr > td:eq(0) > table > tbody > tr:eq(' + (v == 'com' || v == 'nl' ? 2 : 1) + ') > td:eq(1) > a').text();
		rank = $(xpath + ' > table > tbody > tr > td:eq(0) > table > tbody > tr:eq(' + (v == 'com' || v == 'nl' ? 7 : 6) + ') > td:eq(1)').text();
		bloodType = $(xpath + ' > table > tbody > tr > td:eq(0) > table > tbody > tr:eq(' + (v == 'com' || v == 'nl' ? 9 : 8) + ') > td:eq(1) > a').text();
		city = $(xpath + ' > table > tbody > tr > td:eq(0) > table > tbody > tr:eq(' + (v == 'com' || v == 'nl' ? 10 : 9) + ') > td:eq(1) > a').text();
		ride = $(xpath + ' > table > tbody > tr > td:eq(2) > table:eq(1) > tbody > tr:eq(' + (v == 'com' || v == 'nl' ? 2 : 1) + ') > td:eq(1)').text();
	} else {
		nick = unsafeWindow.omerta.character.info.name();
		rank = unsafeWindow.omerta.character.progress.rank();
		bloodType = unsafeWindow.omerta.character.info.bloodtype();
		city = unsafeWindow.omerta.character.game.city();
		var possessions = unsafeWindow.omerta.modules.UserInformation.data.possessions;
		if (possessions) {
			$.each(possessions, function(i, v) {
				if (possessions[i].type == 'plane') {
					ride = possessions[i].name_owned;
				}
			});
		}
	}

	setV('bloodType', bloodType);
	setV('nick', nick);

	// define max b/n judging by rank
	var maxBooze = [1, 2, 2, 5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 70, 70];
	var maxNarcs = [0, 0, 0, 1, 2,  4,  5,  7,  8, 10, 11, 13, 14, 16, 17, 20, 20, 20];
	for (var booze = 0, narc = 0, i = 0; i <= 17; i++) {
		if (ranks[i] == rank) {
			booze = maxBooze[i];
			narc = maxNarcs[i];
			break;
		}
	}
	setPow('bninfo', 0, narc);
	setPow('bninfo', 1, booze);

	// parse city to ID
	for (var cityCode = 0, i = 0; i < 8; i++) {
		if (city == cities[i]) {
			cityCode = i + 4;
			break;
		}
	}
	setPow('bninfo', 2, cityCode); // save

	// parse plane to ID
	var rides = ['none', 'geen', 'Fokker DR-1', 'Havilland DH 82A', 'Fleet 7', 'Douglas DC-3'];
	for (var plane = 0, i = 0; i <= 5; i++) {
		if (rides[i] == ride) {
			plane = [0, 0, 1, 2, 3, 4][i];
			break;
		}
	}
	setPow('bninfo', 3, plane); // save
}

var beeping = false;
var beep = new Howl({
	urls: [ OB_CDN_URL + '/sounds/beep.wav' ], // doesn't work with GM_getResourceURL
	onend: function() {
		beeping = false;
	}
});

function playBeep() {
	if (beeping) {
		// don't play beep more than once at the same time
		return;
	}
	beeping = true;
	beep.play();
}

function CheckBmsg() {
	setTimeout(function () {
		var lastbmsg = getV('lastbmsg', 0);
		GM_xmlhttpRequest({
			method: 'GET',
			url: OB_API_WEBSITE + '/?p=bmsg&v=' + v + '&last=' + lastbmsg,
			onload: function (xhr) {
				var response = JSON.parse(xhr.responseText);
				var deaths = response['deaths'].length;
				var news = response['news'].length;
				if (news == 1 && (prefs['bmsgNews'] || prefs['bmsgNews_sound'])) {
					var bmsgNewsTxt = 'A new article is posted ' + OB_NEWS_WEBSITE + '\n\n';
					var bmsgNewsTitle = response['news'][0]['title'];
					bmsgNewsTxt += response['news'][0]['preview'];

					if (prefs['bmsgNews']) {
						var notification = new Notification(bmsgNewsTitle, {
							dir: 'auto',
							lang: '',
							body: bmsgNewsTxt,
							tag: 'news',
							icon: GM_getResourceURL('red-star')
						});
						notification.onclose = function () {
							setTimeout(CheckBmsg(), 60000);
						};
						notification.onclick = function () {
							window.open(OB_NEWS_WEBSITE + '/' + response['news'][0]['id']);
							notification.close();
						};

						var autoCloseSecs = parseInt(sets['autoCloseNotificationsSecs'] || 0, 10);
						if (autoCloseSecs > 0) {
							setTimeout(function() {
								notification.close();
							}, autoCloseSecs * 1000);
						}
					}

					if (prefs['bmsgNews_sound']) {
						playBeep();
					}
					setV('lastbmsg', response['news'][0]['ts']);
				} else if ((prefs['bmsgDeaths'] || prefs['bmsgDeaths_sound']) && (deaths >= 1)) {
					var bmsgDeathsTxt = response['deaths'].length + ' people died:\n\n';
					var bmsgDeathsTitle = 'Deaths! (' + v + ')';
					var am = (response['deaths'].length < 10 ? response['deaths'].length : 10);
					for (var i = 0; i < am; i++) {
						var bmsgD = new Date(response['deaths'][i]['ts'] * 1000);
						var bmsgTime = (bmsgD.getHours() < 10 ? '0' : '') + bmsgD.getHours() + ':' + (bmsgD.getMinutes() < 10 ? '0' : '') + bmsgD.getMinutes() + ':' + (bmsgD.getSeconds() < 10 ? '0' : '') + bmsgD.getSeconds();
						var bmsgExtra = (response['deaths'][i]['akill'] == 1) ? '(A)' : (response['deaths'][i]['bf'] == 1) ? '(BF)' : '';
						var bmsgFam = (response['deaths'][i]['fam'] === '') ? '(none)' : '(' + response['deaths'][i]['fam'] + ')';
						bmsgDeathsTxt += bmsgExtra + ' ' + bmsgTime + ' ' + response['deaths'][i]['name'] + ' ' + response['deaths'][i]['rank_text'] + ' ' + bmsgFam + '\n';
					}

					if (prefs['bmsgDeaths']) {
						var notification = new Notification(bmsgDeathsTitle, {
							dir: 'auto',
							lang: '',
							body: bmsgDeathsTxt,
							tag: 'deaths',
							icon: GM_getResourceURL('rip')
						});
						notification.onclose = function () {
							setTimeout(CheckBmsg(), 60000);
						};
						notification.onclick = function () {
							unsafeWindow.omerta.GUI.container.loadPage('./BeO/webroot/index.php?module=Statistics&action=global_stats');
							window.focus();
							notification.close();
						};

						var autoCloseSecs = parseInt(sets['autoCloseNotificationsSecs'] || 0, 10);
						if (autoCloseSecs > 0) {
							setTimeout(function() {
								notification.close();
							}, autoCloseSecs * 1000);
						}

					}

					if (prefs['bmsgDeaths_sound']) {
						playBeep();
					}

					setV('lastbmsg', response['deaths'][0]['ts']);
				}
				setTimeout(function () {
					CheckBmsg();
				}, 60000);
			}
		});
	}, 0);
}

var crimeTimer = false;
var gtaTimer = false;
var travelTimer = false;
var bulletTimer = false;
var bgTimer = false;
var notificationsArray = [];

function SendNotification(title, text, tag, callbackUrl, beyondIcon) {
	var notification = new Notification(title, {
		dir: 'auto',
		lang: '',
		body: text,
		tag: tag,
		icon: beyondIcon
	});
	notification.onclick = function () {
		if (callbackUrl !== null) {
			unsafeWindow.omerta.GUI.container.loadPage(callbackUrl);
		}
		window.focus();
		notification.close();
	};

	// Automatically close notification
	var autoCloseSecs = parseInt(sets['autoCloseNotificationsSecs'] || 0, 10);
	if (autoCloseSecs > 0) {
		setTimeout(function() {
			notification.close();
			delete(notificationsArray[tag]);
		}, autoCloseSecs * 1000);
	}

	notificationsArray[tag] = notification;
}

function CheckServiceVariable() {
	setInterval(function() {
		var serviceData = unsafeWindow.omerta.services.account.data;

		if (prefs['notify_health'] || prefs['notify_health_sound']) {
			var newHealth = parseFloat(serviceData.progressbars.health);
			var oldHealth = parseFloat(getV('serviceHealth', 0));
			if (oldHealth > 0 && (oldHealth > newHealth)) {
				var healthText = 'You lost ' + (oldHealth - newHealth) + ' health!';
				var healthTitle = 'Health (' + v + ')';
				if (prefs['notify_health']) {
					SendNotification(healthTitle, healthText, 'health', './BeO/webroot/index.php?module=Bloodbank', GM_getResourceURL('red-star'));
				}
				if (prefs['notify_health_sound']) {
					playBeep();
				}
			}

			setV('serviceHealth', newHealth);
		}

		// check for new messages if they want them
		if (serviceData.messages.inbox.length > 0 && (prefs['notify_messages'] || prefs['notify_messages_sound'])) {
			var lastMessage = parseInt(getV('lastMessage', 0), 10);

			var totalMessages = 0;
			$.each(serviceData.messages.inbox, function(i, val) {
				var id = parseInt(val.id, 10);
				if (lastMessage === id) {
					return false;
				}
				totalMessages += 1;
			});

			if (totalMessages !== 0) {
				var msgId = parseInt(serviceData.messages.inbox[0].id, 10);
				var msgTitle = '';
				var msgText = '';
				var callbackUrl = './BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=';

				setV('lastMessage', msgId);
				if (totalMessages === 1) {
					msgText = 'Message: ' + serviceData.messages.inbox[0].msg.replace(/<br \/>/g, '');
					msgTitle = 'New message from ' + serviceData.messages.inbox[0].frm + ': ' + serviceData.messages.inbox[0].sbj + ' (' + v + ')';
					callbackUrl = callbackUrl + msgId;
				} else {
					msgText = 'You have got ' + totalMessages + ' new messages';
					msgTitle = 'New messages (' + v + ')';
					callbackUrl = './BeO/webroot/index.php?module=Mail&action=inbox';
				}
				if (prefs['notify_messages']) {
					SendNotification(msgTitle, msgText, 'Mail', callbackUrl, GM_getResourceURL('red-star'));
				}
				if (prefs['notify_messages_sound']) {
					playBeep();
				}
			}
		}

		// check for new alerts if they want them
		if (serviceData.messages.alert.length > 0 && (prefs['notify_alerts'] || prefs['notify_alerts_sound'])) {
			// msgId -1 is a friend request
			var lastAlert = parseInt(getV('lastAlert', 0), 10);
			var totalAlerts = 0;
			$.each(serviceData.messages.alert, function(i, val) {
				var id = (val.id ? parseInt(val.id, 10) : -1);
				if (lastAlert === id) {
					return false;
				}
				totalAlerts += 1;
			});

			if (totalAlerts !== 0) {
				var msgId = (serviceData.messages.alert[0].id ? parseInt(serviceData.messages.alert[0].id, 10) : -1);
				var alertTitle = '';
				var alertText = '';
				var callbackUrl = './BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=';
				setV('lastAlert', msgId);
				if (totalAlerts === 1) {
					// If it's a friend request, it has no msg or id
					if (serviceData.messages.alert[0].sbj !== 'Friend Request(s)') {
						alertText = 'Alert: ' + serviceData.messages.alert[0].msg.replace(/<br \/>/g, '');
						alertTitle = 'Alert! ' + serviceData.messages.alert[0].sbj + ' (' + v + ')';
						callbackUrl = callbackUrl + msgId;
					} else {
						alertText = 'Alert: You got a new friend request!';
						alertTitle = 'Alert! ' + serviceData.messages.alert[0].sbj + ' (' + v + ')';
						callbackUrl = serviceData.messages.alert[0].link;
					}
				} else {
					alertText = 'You have got ' + totalAlerts + ' new alerts';
					alertTitle = 'Alert! (' + v + ')';
					callbackUrl = './BeO/webroot/index.php?module=Mail&action=inbox';
				}
				if (prefs['notify_alerts']) {
					SendNotification(alertTitle, alertText, 'alert', callbackUrl, GM_getResourceURL('red-star'));
				}
				if (prefs['notify_alerts_sound']) {
					playBeep();
				}
			}
		}

		if ((prefs['notify_gta'] || prefs['notify_gta_sound']) && !gtaTimer) {
			var gtaTime = parseInt($('[data-cooldown="car"]').attr('data-timeleft'), 10);
			if (gtaTime > 0) {
				gtaTimer = true;
				setTimeout(function() {
					gtaTimer = false;
					var gtaText = (v == 'nl' ? 'Je kunt weer een auto stelen' : 'You can nick a car');
					var gtaTitle = (v == 'nl' ? 'Steel een auto (' + v + ')' : 'Nick a car (' + v + ')');
					if (prefs['notify_gta']) {
						SendNotification(gtaTitle, gtaText, 'Car', './BeO/webroot/index.php?module=Cars', GM_getResourceURL('red-star'));
					}
					if (prefs['notify_gta_sound']) {
						playBeep();
					}
				}, gtaTime * 1000);
			}
		}

		if ((prefs['notify_crime'] || prefs['notify_crime_sound']) && !crimeTimer) {
			var crimeTime = parseInt($('[data-cooldown="crime"]').attr('data-timeleft'), 10);
			if (crimeTime > 0) {
				crimeTimer = true;
				setTimeout(function() {
					crimeTimer = false;
					var crimeText = (v == 'nl' ? 'Je kunt weer een misdaad doen' : 'You can do a crime');
					var crimeTitle = (v == 'nl' ? 'Misdaad (' + v + ')' : 'Crime (' + v + ')');
					if (prefs['notify_crime']) {
						SendNotification(crimeTitle, crimeText, 'Crime', './BeO/webroot/index.php?module=Crimes', GM_getResourceURL('red-star'));
					}
					if (prefs['notify_crime_sound']) {
						playBeep();
					}
				}, crimeTime * 1000);
			}
		}

		if ((prefs['notify_travel'] || prefs['notify_travel_sound']) && !travelTimer) {
			var travelTime = parseInt($('[data-cooldown="travel"]').attr('data-timeleft'), 10);
			if (travelTime > 0) {
				travelTimer = true;
				setTimeout(function() {
					travelTimer = false;
					var travelText = (v == 'nl' ? 'Je kunt reizen' : 'You can travel');
					var travelTitle = (v == 'nl' ? 'Reizen (' + v + ')' : 'Travel (' + v + ')');
					if (prefs['notify_travel']) {
						SendNotification(travelTitle, travelText, 'Travel', './BeO/webroot/index.php?module=Travel', GM_getResourceURL('red-star'));
					}
					if (prefs['notify_travel_sound']) {
						playBeep();
					}
				}, travelTime * 1000);
			}
		}

		if ((prefs['notify_bullets'] || prefs['notify_bullets_sound']) && !bulletTimer) {
			var bulletsTime = parseInt($('[data-cooldown="bullets"]').attr('data-timeleft'), 10);
			if (bulletsTime > 0) {
				bulletTimer = true;
				setTimeout(function() {
					bulletTimer = false;
					var bulletsText = (v == 'nl' ? 'Je kunt kogels kopen' : 'You can buy bullets');
					var bulletsTitle = (v == 'nl' ? 'Kogels (' + v + ')' : 'Bullets (' + v + ')');
					if (prefs['notify_bullets']) {
						SendNotification(bulletsTitle, bulletsText, 'Bullets', './bullets2.php', GM_getResourceURL('red-star'));
					}
					if (prefs['notify_bullets_sound']) {
						playBeep();
					}
				}, bulletsTime * 1000);
			}
		}
	}, 30000);
}

function getOmertaTime() {
	if (typeof(unsafeWindow.omerta.server.clock) !== 'undefined') {
		return unsafeWindow.omerta.server.clock.getTime();
	}

	if (typeof(unsafeWindow.omerta.Clock) !== 'undefined') {
		return unsafeWindow.omerta.Clock.getTime();
	}

	return Date.now();
}

var versionHasLogger = v == 'com' || v == 'nl' || v == 'dm' || v == 'pt';
var boozenames = ['NO BOOZE', 'Wine', 'Beer', 'Rum', 'Cognac', 'Whiskey', 'Amaretto', 'Port'];
var narcnames = ['NO NARCS', 'Morphine', 'Marijuana', 'Glue', 'Heroin', 'Opium', 'Cocaine', 'Tabacco'];

function addEndTimeTooltip(node) {
	// add a tooltip on every cooldown timer showing when it'll end (in OT)
	// let's make sure we don't break OB in case tipsy gets dropped
	if (unsafeWindow.$.fn.tipsy) {
		// .addBack is needed in case the element containing data-timeleft is the one being added to DOM tree
		// (which is the case on bullet waiting page, safehouse message, and probably others)
		$(node).find('[data-timeleft]').addBack('[data-timeleft]').each(function() {
			var cooldownEnd = new Date(getOmertaTime() + parseInt(this.getAttribute('data-timeleft'), 10) * 1000);
			// formating dates in js is fun. #not
			var tooltipTitle = ('0' + cooldownEnd.getUTCHours()).slice(-2) + ':' + ('0' + cooldownEnd.getUTCMinutes()).slice(-2) + ':' + ('0' + cooldownEnd.getUTCSeconds()).slice(-2);
			if (cooldownEnd.getUTCDate() != unsafeWindow.omerta.server.clock.getUTCDate()) {
				tooltipTitle += ' ' + ('0' + cooldownEnd.getUTCDate()).slice(-2) + '/' + ('0' + (cooldownEnd.getUTCMonth() + 1)).slice(-2);
			}
			tooltipTitle += ' OT';
			this.setAttribute('title', tooltipTitle);
			unsafeWindow.$(this).tipsy({
				gravity: 's'
			});
		});
	}
}

function calcRaidResult(profit, protection) {
	return profit * (110 - protection) / 1000;
}

// function to parse date string (09-07-2014 09:30:54)
function datestringParse(dateString) {
	var dateTime = dateString.split(' ');
	var date = dateTime[0].split('-');
	var dd = date[0];
	var mm = date[1] - 1;
	var yyyy = date[2];

	var time = dateTime[1].split(':');
	var h = time[0];
	var m = time[1];
	var s = parseInt(time[2], 10); // get rid of that 00.0;

	return new Date(yyyy, mm, dd, h, m, s);
}

function IsNewVersion() {
	if (v == 'dm' || v == 'pt' || v == 'dev') {
		return true;
	} else {
		return false;
	}
}

/**
 * Checks if the user is alive
 * @param  {[String]}  user
 * @return {Boolean}
 */
function checkUserAlive(user, callback) {
	$.getJSON(OB_API_WEBSITE + '/?p=stats&w=deaths&v=' + v + '&ing=' + user, function (data) {
		callback(!data['DiedAt']);
	});
}

function highlightChatMessage(messageContainer, isBufferedMessage) {
	var sender = $(messageContainer).find('.chat-sender-participant, .chat-sender-offline');
	var messageText = $(messageContainer).find('.chat-message-text');
	var nickRegex = new RegExp('\\b' + getV('nick', null) + '\\b', 'i');
	if (sender.text() == getV('nick', null)) {
		$(messageContainer).css('background-color', 'rgba(55, 162, 255, 0.42)');
	} else if (nickRegex.test($(messageText).text())) {
		$(messageContainer).css('background-color', 'rgba(125, 3, 2, 0.77)');
		if (!isBufferedMessage) {
			if (prefs['notify_highlight']) {
				SendNotification('Your name was mentioned in the chat', sender.text() + messageText.text(), 'Chat', null, GM_getResourceURL('red-star'));
			}
			if (prefs['notify_highlight_sound']) {
				playBeep();
			}
		}
	}
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= $(window).height() &&
		rect.right <= $(window).width()
	);
}

function addChatResizeImprovements() {
	if ($('#omerta_chat_room .ps-container').children().length === 0) {
		// wait till chat gets populated
		window.setTimeout(addChatResizeImprovements, 500);
		return;
	}
	var oldActiveElement;
	var originalStyle = ['#omerta_chat', '#omerta_chat_room', '#omerta_chat_room .ps-container', '#omerta_chat .chat', '#omerta_chat .chat input', 'footer'].map(function(selector) {
		return { 'selector': selector, 'css': $(selector).css(['width', 'height', 'opacity']) };
	});

	var chatIsMaximized = false;
	var chatIsMinimized = false;
	var chatIsPinned = false;

	$('.chat-controls-listing > a:eq(1)').click(function() {
		chatIsMinimized = true;
	});
	$('.chat-controls-listing > a:eq(2)').click(function() {
		chatIsMinimized = false;
	});

	$('#omerta_chat').hover(function() {
		if (chatIsMaximized || prefs['chat_resize_disabled']) {
			return;
		}
		chatIsMaximized = true;
		if (document.activeElement && isElementInViewport(document.activeElement)) {
			oldActiveElement = document.activeElement;
		} else {
			oldActiveElement = null;
		}
		var baseWidth = prefs['chat_width'] || Math.min(parseInt(document.documentElement.clientWidth * 0.50, 10), 650);
		var baseHeight = prefs['chat_height'] || Math.min(parseInt(document.documentElement.clientHeight * 0.70, 10), 550);
		$('#omerta_chat').css('width', baseWidth + 'px').css('height', baseHeight + 'px').css('opacity', 1);
		$('#omerta_chat_room, #omerta_chat_room .ps-container').css('width', '100%').css('height', (baseHeight - 80) + 'px');
		$('#omerta_chat .chat').css('width', (baseWidth - 20) + 'px');
		$('#omerta_chat .chat input').css('width', (baseWidth - 35) + 'px');
		$('footer').css('z-index', 100000);
		unsafeWindow.omerta.chat.utils.scrollChat(unsafeWindow.Strophe.getNodeFromJid(unsafeWindow.omerta.chat.data.selected()), true, false);
		$('.chat-controls-listing').prepend(
			$('<a>').attr('title', 'Pin chat window').attr('class', 'chat-pin').click(function() {
				chatIsPinned = !chatIsPinned;
				$('.chat input').focus();
			}).append(
				$('<i>').attr('class', 'ci icon-pushpin')
			)
		);
		$('.chat input').focus();

	}, function() {
		if (chatIsPinned || chatIsMinimized || prefs['chat_resize_disabled'] || prefs['chat_height'] !== '' || prefs['chat_width'] !== '') {
			return;
		}
		chatIsMaximized = false;
		originalStyle.forEach(function(element) {
			if (typeof element.css === 'undefined') {
				$(element.selector).css('width', 'auto').css('height', 'auto');
			} else {
				for (var key in element.css) {
					if (element.css.hasOwnProperty(key)) {
						$(element.selector).css(key, element.css[key]);
					}
				}
			}
		});
		if (oldActiveElement && isElementInViewport(oldActiveElement)) {
			$(oldActiveElement).focus();
		}
		$('.chat-pin').remove();
		unsafeWindow.omerta.chat.utils.scrollChat(unsafeWindow.Strophe.getNodeFromJid(unsafeWindow.omerta.chat.data.selected()), true, false);
	});
}

// ---------------- NickReader ----------------
var nickReaderIcon = GM_getResourceURL('NRicon');
var loadingIcon = GM_getResourceURL('loadingicon');
function parseGrab(html, url) {
	var body = html.slice(html.indexOf('</head>') + 7);
	// make sure all requests are handled separately
	var ident = url.split('=')[1];
	// Check for clicklimit
	if (body.indexOf('You reached your click limit.') == -1) {
		// Add placeholder div
		$('body').append(
			$('<div>').attr('id', 'XHRDiv' + ident).html(body).hide()
		);

		// grabbing keys
		var keys = [];
		$('#XHRDiv' + ident + ' > center > table#user > tbody > tr > td.subtableheader').each(function (n) {
			keys[n] = $.trim($(this).text());
		});
		keys.shift();

		// grabbing values
		var vals = [];
		$('#XHRDiv' + ident + ' > center > table#user > tbody > tr > td.profilerow').each(function (n) {
			vals[n] = $.trim($(this).text());
		});
		vals.pop();
		vals.shift(); vals.shift();

		// parse certain values to make them fit within the popup
		vals = vals.map(function(col) {
			// Limit status
			if (col.indexOf(' online ') != -1) {
				return col.slice(0, col.indexOf(' online ') + 7);
			}
			// Limit HP
			if (/\(Click|\(Klik/.test(col)) {
				return col.slice(0, col.indexOf('('));
			}
			// Limit family string
			if (col.indexOf('(CapoRegime:') != -1) {
				return col.slice(0, col.indexOf('('));
			}
			// Limit marital status
			if (/Married Couple:|Getrouwd stel:/.test(col)) {
				return col.split(/Married |Getrouwd /)[1];
			}
			return col;
		}).filter(function(col) {
			// Filter friends, SMS and organised crimes from vals
			return !/ Friends| vrienden/.test(col) && col.indexOf('Send SMS') == -1 && col.indexOf('Available') == -1 && col.indexOf('Tired') == -1 && col.indexOf('Beschikbaar') == -1 && col.indexOf('Moe') == -1;
		});

		keys = keys.filter(function(col) {
			// Filter friends, SMS and organised crimes from keys
			return !/Friends:|Vrienden:/.test(col) && !/Heist Status:/.test(col) && !/Organised Crime Status:|Georganiseerde Misdaad Status:/.test(col) && col.indexOf('SMS Status') == -1;
		});

		// Create table
		$('#' + ident).attr('name', 'done').empty().append(
			$('<table>').attr({
				'id': 'NRtable'
			}),
			$('<img>').attr('src', nickReaderIcon).addClass('NRicon')
		);

		// Add keys and values to table
		for (var i = 0; i < keys.length; i++) {
			$('#NRtable').append(
				$('<tr>').append(
					$('<td>').attr('height', '15').text(keys[i]),
					$('<td>').text(vals[i])
				)
			);
		}

		// Remove the placeholder div
		$('#XHRDiv' + ident).remove();

		// End the process
		$('#proc').text(0);
	} else {
		$('#' + ident).text('Clicklimit, please try again...');
		$('#proc').text(0);
	}
}

function checkNRdiv(url, nickId) {
	// is the NR activated?
	var on = ($('#shft').text() == '1' ? 1 : 0);
	// default is to add popup
	var go = 1;
	// check for an existing popup
	if ($('#' + nickId).length > 0) {
		var popup = $('#' + nickId);
		if (on) { // if it's there, let's see it
			popup.css('display', 'block');
		}
		go = 0; // we found a popup already
		// check for any empty values
		if (popup.html().indexOf('<td></td></tr>') != -1) {
			popup.remove();
			go = 1; // it's no good though
		}
		// check if it's loaded yet (clicklimit)
		if ($('#' + nickId).attr('name') == 'loading') {
			popup.remove();
			go = 1; // it's no good though
		}
	}
	// yes we may proceed to add the popup
	if (go && on) {
		$('body').append(
			$('<div>').attr('id', nickId).addClass('NRinfo').text('Loading info..').append(
				$('<img>').attr('src', loadingIcon)
			)
		);

		// add follow the mouse
		$(window).mousemove(function(mouse) {
			var divH = $('#' + nickId).height();
			var divW = $('#' + nickId).width();

			var X = mouse.pageX;
			var Y = mouse.pageY;
			var plusX = 20;
			var plusY = 20;

			if (X + divW + 20 > $(window).width()) { // if box falls of the right
				plusX = -20 - divW;
			}
			if (Y + divH + 20 > $(window).innerHeight()) { // if box falls of the bottom
				plusY = -20 - divH;
			}
			$('#' + nickId).css('left', X + plusX);
			$('#' + nickId).css('top', Y + plusY);
		});

		// add popup to page
		$('#' + nickId).attr('name', 'loading');

		// check if there isn't a process running already, otherwise grab the HTML
		if ($('#proc').text() === '0') {
			grabHTML(url, parseGrab); // (url to grab, function to execute after)
			$('#proc').text(1);
		} else {
			$('#' + nickId).text('Wait for the previous..');
		}
	}
}

function nickReader() {
	var nicks = $('a[href*="user.php"]:not([href*="&jh="])');
	if (nicks.length > 0) {
		// don't run this part twice
		if ($('#NRstatus').length === 0) {
			$('#game_header_marquee').append(
				$('<div>').attr('id', 'NRstatus').css({
					'position': 'relative',
					'display': 'none'
				}).append(
					$('<center>').append(
						$('<img>').attr('src', nickReaderIcon),
						$('<b>').text('Nickreader enabled')
					)
				)
			);

			// setup shift event checker
			if ($('#shft').length === 0) {
				$('body').append(
					$('<div>').attr('id', 'shft').text('0').hide()
				);
			}

			// setup process checker
			if ($('#proc').length === 0) {
				$('body').append(
					$('<div>').attr('id', 'proc').text('0').hide()
				);
			}

			// add shift keydown handler
			$(window).keydown(function(event) {
				var key = event.which;
				if (key == 16) {
					if ($('#shft').text() === '0') {
						$('#NRstatus').show('slow');
						$('#shft').text(1);
					} else {
						$('#NRstatus').hide('slow');
						$('#shft').text(0);
						$('#proc').text(0);
						$('div[id^="XHRDiv"]').remove();
					}
				}
			});
		}
		// add mouse event checkers
		nicks.each(function() {
			if ($(this).attr('href').search('cpuser') == -1) {
				var nickId = $(this).attr('href').split('=')[1];
				$(this).mouseover(function() {
					checkNRdiv($(this).attr('href'), nickId);
				});
				$(this).mouseout(function() {
					if ($('#' + nickId)) {
						$('#' + nickId).remove();
					}
				});
			}
		});
		// focus on frame so 'shift' event is noticed
		$(window).focus();
	}
}

/*
 * Chat listener
 */
if (document.getElementById('omerta_chat_room') !== null && typeof MutationObserver != 'undefined') {
	var firstMessageTs;
	var chatObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				var node = mutation.addedNodes[i];
				if (node.nodeType == 1 && !node.hasAttribute('data-beyond-fired') && $(node).hasClass('user-message-text')) {
					node.setAttribute('data-beyond-fired', true);
					if (typeof firstMessageTs == 'undefined') {
						firstMessageTs = $.now();
					}
					var isBufferedMessage = firstMessageTs >= $.now() - 500;
					highlightChatMessage(node, isBufferedMessage);
				}
			}
		});
	});

	chatObserver.observe(document.getElementById('omerta_chat_room'), {
		attributes: false,
		childList: true,
		subtree: true,
		characterData: false
	});

	addChatResizeImprovements();
}

/**
 * Check if a word is in a string
 * @param  {[String]} s    Haystack
 * @param  {[String]} word Needle
 * @return {[Booleon]}
 */
function wordInString(s, word) {
	return new RegExp('\\b' + word + '\\b', 'i').test(s);
}

/*
 * Main game listener
 */

if (document.getElementById('game_container') !== null) {
	var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	if (mutationObserver) {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				for (var i = 0; i < mutation.addedNodes.length; i++) {
					var node = mutation.addedNodes[i];
					if (node.nodeType == 1 && !node.hasAttribute('data-beyond-fired')) {
						node.setAttribute('data-beyond-fired', true);
						gameContainerChanged(node);
					}
				}
			});
		});

		observer.observe(document.getElementById('game_container'), {
			attributes: false,
			childList: true,
			characterData: false
		});
	} else {
		// jeez, get a new browser ;(
		// falling back to DOMNodeInserted event
		document.getElementById('game_container').addEventListener('DOMNodeInserted', function(event) {
			if (event.target.nodeType != 1) {
				return false;
			}

			if ($(event.target).attr('data-beyond-fired') !== undefined) {
				return false;
			}

			$(event.target).attr('data-beyond-fired', 'true');
			gameContainerChanged(event.target);
		}, true);
	}

	var gameContainerChanged = function(node) {
		var nn = node.tagName.toLowerCase();
		var nid = node.getAttribute('id');
		var nclass = node.className;
		var wlh = window.location.hash;

		// unbind events
		if (!on_page('garage.php') && !on_page('module=Cars')) {
			$(window).unbind('scroll');
			$('#game_wrapper_container div#footer').remove();
		}
		if (!on_page('action=showMsg')) {
			$(window).unbind('keydown');
		}
		// Disable nickreader when going to other page
		if ($('#shft').length > 0) {
			$('#shft').remove();
		}
		if ($('#proc').length > 0) {
			$('#proc').remove();
		}
		if ($('.NRinfo').length > 0) {
			$('.NRinfo').remove();
		}
		if ($('#NRstatus').length > 0) {
			$('#NRstatus').remove();
		}

		// hitting the click limit means the page won't contain what we expect. ignore it.
		if ($(node).filter(':contains("You reached your click limit."), :contains("Je hebt jouw kliklimiet bereikt.")').length > 0) {
			return;
		}

		// limit captcha to size and disabled to 3 letters is typed
		var codeInput = $('input#ver, input#lbfVer, input#bfVer, input[name="imgcode"]');
		var codeSubmit = codeInput.closest('form').find('input[type="submit"]');

		if (on_page('jail.php')) {
			codeSubmit.prop('disabled', false);
		} else {
			if (codeInput.length > 0) {
				codeSubmit.prop('disabled', true);
			}
			codeInput.attr('maxlength', 3).keydown(function() {
				if ($(this).val().length >= 2) {
					codeSubmit.prop('disabled', false);
				} else {
					codeSubmit.prop('disabled', true);
				}
			});
		}

		/*
		 * add end time tooltip to every countdown
		 * causes issues with Greasemonkey 2+, disabling till issue is fixed
		 * addEndTimeTooltip(node);
		 */

		// ---------------- FAMILY PAGE ----------------
		if (on_page('family.php') && nn == 'center') {
			nickReader();
			// add HR, Deaths and Worth
			var famid = wlh.split('=')[1];
			var famIdFromImg = $('img[src*="family_image.php"]').attr('src').match(/\d+/g)[0];
			var famname = $('td.profilerow').text().split(' ')[0].trim().toLowerCase();
			var url = (famid === famIdFromImg) ? 'id=' + famid : 'ing=' + famname;
			var ownfam = getV('family', '');

			// Count rows
			var tr = $('table.thinline:eq(0) tr').length;

			// add HQ space to members
			var hq = $('table.thinline:eq(0) tr:eq(' + (tr - 3) + ') td:last').text();
			var members = $('table.thinline:eq(0) tr:eq(' + (tr - 5) + ') td:last').text();
			$('table.thinline:eq(0) tr:eq(' + (tr - 5) + ') td:last').text(members + '/' + hq);

			// add color to HQ space
			var hqperc = ((members / hq) * 100);
			$('table.thinline:eq(0) tr:eq(' + (tr - 5) + ') td:last').css({
				'background': 'linear-gradient(to right, rgba(46, 188, 0, 1) ' + hqperc + '%, rgba(46, 188, 0, 0) ' + hqperc + '%)'
			});

			// add color to donating %
			var doperc = $('table.thinline:eq(0) tr:eq(' + (tr - 4) + ') td:last').text().split(' (')[0].trim();
			$('table.thinline:eq(0) tr:eq(' + (tr - 4) + ') td:last').css({
				'background': 'linear-gradient(to right, rgba(46, 188, 0, 1) ' + doperc + ', rgba(46, 188, 0, 0) ' + doperc + ')'
			});

			// add color to rank progress
			if (famname == ownfam.toLowerCase()) {
				var rankperc = $('table.thinline:eq(0) tr:last td:last').text().split(' (')[1].replace(')', '').trim();
				$('table.thinline:eq(0) tr:last td:last').css({
					'background': 'linear-gradient(to right, rgba(46, 188, 0, 1) ' + rankperc + ', rgba(46, 188, 0, 0) ' + rankperc + ')'
				});
			}

			// get tops
			var tops = [];
			$('table.thinline:eq(0) > tbody > tr > td:has(a)').each(function () {
				tops.push($(this).text().trim());
			});

			var nTop = tops.length; // # tops
			var SorC = (nTop == 3) ? 2 : /Consi/.test($('table.thinline:eq(0) tr:eq(7) td:first').text()); // Sotto or Consi
			var don = tops[0];
			var sotto = (nTop > 1 && (nTop == 3 || SorC === false)) ? tops.pop() : null;
			var cons = (nTop > 1 && (nTop == 3 || SorC === true)) ? tops.pop() : null;

			// get capos
			var capos = [];
			$('table.thinline:last > tbody > tr > td > a.tableheader').each(function () {
				capos.push($(this).text());
			});

			// get object owners
			var objects = [];
			$('table.thinline:eq(2) > tbody > tr > td:has(a)').each(function () {
				objects.push($(this).text());
			});

			$('#game_container a[href*="user.php"]').each(function () {
				var n = $(this).text(); // nick
				var vip = '';
				if (n == don) {
					$(this).html(n + '<small><sup>[D]</sup></small>');
					vip = '[D]';
				}
				if (n == sotto) {
					$(this).html(n + '<small><sup>[S]</sup></small>');
					vip = '[S]';
				}
				if (n == cons) {
					$(this).html(n + '<small><sup>[C]</sup></small>');
					vip = '[C]';
				}
				if ($.inArray(n, capos) != -1) {
					if (n != don) {
						$(this).html(n + '<small><sup>' + vip + '(c)</sup></small>');
						vip = vip + '(c)';
					}
				}
				if ($.inArray(n, objects) != -1) {
					if (n != don) {
						$(this).html(n + '<small><sup>' + vip + '(o)</sup></small>');
						vip = vip + '(o)';
					}
				}
			});

			if (versionHasLogger) {
				$.getJSON(OB_API_WEBSITE + '/?p=stats&w=fampage&v=' + v + '&' + url, function (data) {
					// Family position and worth
					$('td.subtableheader').first().closest('tr').after(
						$('<tr>').append(
							$('<td>').addClass('subtableheader').text('Position:'),
							$('<td>').addClass('profilerow').text('#' + data['pos'] + ' - Worth: ' + data['worth'] + '')
						)
					);

					// add HR
					$('table.thinline').first().find('tbody').append(
						$('<tr>').append(
							$('<td>').addClass('subtableheader').text('Ranks:'),
							$('<td>').addClass('profilerow').append(
								$('<table>').attr('width', '100%').append(
									$('<tr>').append($('<td>').text('Godfather/First Lady:'), $('<td>').addClass('bold').text(data['hr']['gf'])),
									$('<tr>').append($('<td>').text('Capodecina:'), $('<td>').addClass('bold').text(data['hr']['cd'])),
									$('<tr>').append($('<td>').text('Bruglione:'), $('<td>').addClass('bold').text(data['hr']['brug'])),
									$('<tr>').append($('<td>').text('Chief:'), $('<td>').addClass('bold').text(data['hr']['chief'])),
									$('<tr>').append($('<td>').text('Local Chief:'), $('<td>').addClass('bold').text(data['hr']['lc'])),
									$('<tr>').append($('<td>').text('Assassin:'), $('<td>').addClass('bold').text(data['hr']['assa'])),
									$('<tr>').append($('<td>').text('Swindler:'), $('<td>').addClass('bold').text(data['hr']['swin'])),
									$('<tr>').append($('<td>').attr('colspan', '2').append($('<hr />'))),
									$('<tr>').append($('<td>').text('Total points:'), $('<td>').addClass('bold').text(data['hr']['pts']))
								)
							)
						)
					);

					setTimeout(function () {
						// Family deaths
						$('table.thinline:eq(1)').closest('td').append(
							$('<br />'),
							$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
								$('<tr>').append(
									$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family deaths')
								),
								$('<tr>').append(
									$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
								),
								$('<tr>').append(
									$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Name'),
									$('<td>').addClass('bold').attr('align', 'center').text('Rank'),
									$('<td>').addClass('bold').attr('align', 'center').text('Date'),
									$('<td>').addClass('bold').css('text-align', 'right').text('Ago')
								)
							)
						);
						if (v === 'com') {
							$('<div>').addClass('dlContainer').append(
								$('<a>').attr({
									'href': OB_NEWS_WEBSITE + '/deathslog/latest/' + famid,
									'target': '_blank'
								}).append(
									$('<img>').addClass('brcImg').attr({
										src: GM_getResourceURL('log'),
										title: 'View full deathslog'
									})
								)
							).appendTo($('table.thinline:eq(2)>tbody>tr:eq(0)>td'));
						}

						var deaths_body = $('table.thinline:eq(2)').find('tbody');
						if (data['deaths']) {
							$.each(data['deaths'], function (k, v) {
								var extra = (v['Akill'] == 1) ? '(<b>A</b>) ' : (v['BF'] == 1) ? '(<b>BF</b>) ' : '';
								deaths_body.append(
									$('<tr>').append(
										$('<td>').html(extra).append(
											$('<a>').attr('href', 'user.php?name=' + v['Name']).text(v['Name'])
										),
										$('<td>').attr('align', 'center').append(
											$('<a>').attr('href', OB_API_WEBSITE + '/?p=history&v=' + v + '&name=' + v['Name']).text(v['Rank'])
										),
										$('<td>').attr('align', 'center').text(v['Date']),
										$('<td>').css('text-align', 'right').text(v['Agod'] + 'd ' + v['Agoh'] + 'h ' + v['Agom'] + 'm')
									)
								);
							});
						} else {
							deaths_body.append(
								$('<tr>').append(
									$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '4').text('There are no deaths yet!')
								)
							);
						}

						// add Famlog
						$('table.thinline:eq(1)').closest('td').append(
							$('<br />'),
							$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
								$('<tr>').append(
									$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family changes')
								),
								$('<tr>').append(
									$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
								),
								$('<tr>').append(
									$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Date'),
									$('<td>').addClass('bold').attr('align', 'left').text('Change')
								)
							)
						);
						if (v === 'com') {
							$('<div>').addClass('dlContainer').append(
								$('<a>').attr({
									'href': OB_NEWS_WEBSITE + '/famlog/latest/' + famid,
									'target': '_blank'
								}).append(
									$('<img>').addClass('brcImg').attr({
										src: GM_getResourceURL('log'),
										title: 'View full changelog'
									})
								)
							).appendTo($('table.thinline:eq(3)>tbody>tr:eq(0)>td'));
						}

						var changes_body = $('table.thinline:eq(3)').find('tbody');
						if (data['changes']) {
							$.each(data['changes'], function (k, v) {
								changes_body.append(
									$('<tr>').append(
										$('<td>').css('width', '28%').attr('align', 'left').attr('valign', 'top').text(v['date']),
										$('<td>').attr('align', 'left').text(v['text'])
									)
								);
							});
						} else {
							changes_body.append(
								$('<tr>').append(
									$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '2').text('There are no changes yet!')
								)
							);
						}
					}, 0);
				});
			}
		}
		// ---------------- My account ----------------
		if (on_page('/information.php') && nn == 'table') {
			var interest = parseInt(getV('interest', 0), 10);
			var banktleft = parseInt(getV('banktleft', 0), 10);
			// Update info
			bnUpdate(1);
			// Grab busts for Jail page
			var bos;
			// Save Will
			var willName;
			var willTR;
			var timestamp = getV('willTimestamp');
			var checkTimestamp = $.now() - (1000 * 30 * 60); //
			var defaultWillName = (v == 'nl' ? 'Niemand' : 'Nobody');

			// Get the values for the will, since .DM is not supported ill leave those out (for now)
			if (IsNewVersion()) {
				willTR = $('.thinline:eq(0)>tbody>tr:eq(10)>td:last');
			} else {
				willTR = $('.thinline:eq(0)>tbody>tr:eq(11)>td:last');
			}
			willName = willTR.text().replace(/,/g, '').trim();



			var appendDead = function() {
				willTR.append('<span class="red"> | Dead!</span>');
			};
			// Let's skip doing this if the will has not been set.

			if (getV('willTimestamp', 0) <= checkTimestamp && willName != defaultWillName) {
				checkUserAlive(willName, function(isAlive) {
					setV('willTimestamp', $.now());
					if (!isAlive) {
						setV('deadWillName', willName);
						appendDead();
					}
				});
			} else {
				var deadWillName = getV('deadWillName');

				// If the person in the will has been changed it shouldn't be shown anymore
				if (deadWillName == willName) {
					appendDead();
				}
			}

			if (!IsNewVersion()) {
				bos = $('.thinline:eq(5)>tbody>tr:eq(2)>td:last').text().replace(/,/g, '');
			} else {
				bos = $('.thinline:eq(5)>tbody>tr:eq(1)>td:last').text().replace(/,/g, '');
			}
			setV('bustouts', bos);

			// Interest reminder
			if (!$('#interestRow').length) {
				var inbank;
				if (!IsNewVersion()) {
					inbank = $('.thinline:eq(4)>tbody>tr:eq(3)>td:last>a').html().replace(/\D/g, '');
				} else {
					inbank = $('.thinline:eq(4)>tbody>tr:eq(2)>td:last>a').html().replace(/\D/g, '');
				}
				if (inbank > 0 && interest > 0) {
					var timestamp = Math.round(parseInt(new Date().getTime(), 10) / 1000);
					var left = (banktleft - timestamp);
					var bankTr = $('<tr>').attr({id: 'interestRow'}).append(
						$('<td>').html('<b>Interest</b>'),
						$('<td>').html('<a href="/bank.php">$ ' + commafy(interest) + '</a> (<span data-timeleft="' + left + '">Now!</span>)')
					);
					$('.thinline:eq(4)').append(bankTr);
				}
			}

			// Tell how old the account is
			var vTr = IsNewVersion() ? 5 : 6;
			var startElem = $('table.thinline:eq(0)>tbody>tr:eq(' + vTr + ')>td:last');
			var startDate = datestringParse(startElem.text());
			var diff = Math.abs(Date.now() - startDate.getTime());
			var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
			var startDay = startDate.getDate() >= 10 ? startDate.getDate() : '0' + startDate.getDate();
			var startMonth = startDate.getMonth() + 1 >= 10 ? (startDate.getMonth() + 1) : '0' + (startDate.getMonth() + 1);
			var previousText = startElem.text();
			startElem.html(startDay + '-' + startMonth + '-' + startDate.getFullYear() + ' (' + (diffDays - 1) + ' days old)').click(function() {
				var currentText = $(this).text();
				$(this).text(previousText);
				previousText = currentText;
			});


			if (!IsNewVersion()) {
				vTr = 4;
			} else {
				vTr = 3;
			}
			// car
			var carAttempts = parseInt($('table.thinline:eq(5)>tbody>tr:eq(' + vTr + ')>td:last').text().replace(',', ''), 10);
			var successCars = parseInt(getV('carSuccess', 0), 10);
			if (successCars >= 1) {
				var successRate = (successCars / carAttempts) * 100;
				var earned = getV('carMoney', 0);
				var newText = '<tr><td><b>Car nicking success</b></td><td>' + successCars + ' (' + successRate.toFixed(2) + '%, $' + commafy(earned) + ')</td></tr>';
				$('table.thinline:eq(5)>tbody>tr:eq(' + vTr + ')').after(newText);
			}

			vTr--;
			// crime stats
			var crimeAttempts = parseInt($('table.thinline:eq(5)>tbody>tr:eq(' + vTr + ')>td:last').text().replace(',', ''), 10);
			var successCrimes = parseInt(getV('crimeSuccess', 0), 10);
			if (successCrimes >= 1) {
				var successRate = (successCrimes / crimeAttempts) * 100;
				var earned = getV('crimeMoney', 0);
				var newText = '<tr><td><b>Crime success</b></td><td>' + successCrimes + ' (' + successRate.toFixed(2) + '%, $' + commafy(earned) + ')</td></tr>';
				$('table.thinline:eq(5)>tbody>tr:eq(' + vTr + ')').after(newText);
			}

			// Visual improvement
			if (!IsNewVersion()) {
				$('.thinline:eq(4)>tbody>tr:eq(3)>td:first').html('<a href="/bank.php"><b>In bank account</b></a>');
			} else {
				$('.thinline:eq(4)>tbody>tr:eq(2)>td:first').html('<a href="/bank.php"><b>In bank account</b></a>');
			}
		}
		// ---------------- NEW My account ----------------
		if (on_page('module=UserInformation')) {
			// Check for dead player in testament
			var willTs = getV('willTimestamp', 0);
			var checkWillTs = $.now() - (1000 * 10 * 60);
			var willName = unsafeWindow.omerta.character.info.testament();
			var willTr = $('div.gangster-info-body li:eq(2) a span');

			if (willName !== '') {
				if (willTs <= checkWillTs) {
					checkUserAlive(willName, function(isAlive) {
						setV('willTimestamp', $.now());
						if (!isAlive) {
							setV('deadWillName', willName);
							willTr.append($('<span>').addClass('red').text(' | Dead!'));
						}
					});
				} else {
					var deadWillName = getV('deadWillName');
					if (deadWillName == willName) {
						willTr.append($('<span>').addClass('red').text(' | Dead!'));
					}
				}
			}

			// Tell how old the account is
			var startElem = $('div.gangster-info-body li:eq(5) a span');
			var startDate = unsafeWindow.omerta.character.info.startdate();
			var diff = Math.abs(Date.now() - startDate.getTime());
			var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
			var startDay = startDate.getDate() >= 10 ? startDate.getDate() : '0' + startDate.getDate();
			var startMonth = startDate.getMonth() + 1 >= 10 ? (startDate.getMonth() + 1) : '0' + (startDate.getMonth() + 1);
			var previousText = startElem.html();
			startElem.html(startDay + '-' + startMonth + '-' + startDate.getFullYear() + ' (' + (diffDays - 1) + ' days old)').click(function() {
				var currentText = $(this).html();
				$(this).html(previousText);
				previousText = currentText;
			});
			// Update info
			setTimeout(function () {
				bnUpdate(0);
			}, 2000);
		}
		// -------------------- Jail --------------------
		if (on_page('/jail.php') && nn == 'form' && prefs['jailHL']) {
			if (getV('fam_colour', '') === '' || getV('friends_colour', '') === '') {
				unsafeWindow.omerta.GUI.container.loadPage('/jail_settings.php');
			}
			var bos;
			if (!IsNewVersion()) {
				bos = parseInt(getV('bustouts', 0), 10);
			} else {
				bos = unsafeWindow.omerta.modules.UserInformation.data.actions_stats[0].value;
			}
			var jailHL_sel = sets['jailHL_sel'] || 'highest';
			var jailHL_other = parseInt(sets['jailHL_other'] || 9, 10);
			var jailHL_friends = parseInt(sets['jailHL_friends'] || 5, 10);
			var jailHL_own_lackey = parseInt(sets['jailHL_own_lackey'] || 7, 10);
			var jailHL_fr_lackey = parseInt(sets['jailHL_fr_lackey'] || 8, 10);
			var jailHL_other_lackey = parseInt(sets['jailHL_other_lackey'] || 11, 10);

			var rows = $('tr[bgcolor]').length;
			var prior = null;
			// list for inmates with lowest priority
			var bustlist = [];
			var priority;
			// Build new row on top
			$('#game_container > form > center > table.thinline > tbody').prepend($('<tr>').attr('id', 'HLrow').css('border-bottom', '1px solid #000'));
			// Loop inmates
			$('tr[bgcolor]').each(function () {
				// Skip nobust
				if (getV('nobust', 0)) {
					var nobust = getV('nobust').toLowerCase().split(',');
					var fam = $(this).find('td:eq(1) > font').text().toLowerCase();
					var name = $(this).find('td:eq(0) > font > a > font').text().toLowerCase();
					if ((fam.length > 0 && $.inArray(fam, nobust) != -1) || $.inArray(name, nobust) != -1) {
						$(this).find('td').css('text-decoration', 'line-through');
						$(this).attr('nobust', true);
						return;
					}
				}
				if ($(this).find('td:eq(0)>font>span').text() === '') {
					// normal player
					if ($(this).attr('bgcolor') !== '') {
						// friends, family or custom group
						if (getV('custom_groups', '').indexOf($(this).attr('bgcolor')) > 0) {
							// custom group
							var cg = getV('custom_groups', '').split('|');
							cg.pop();
							for (var i = 0; i < cg.length; i++) {
								var g = cg[i].split(':');
								if (g[1] == $(this).attr('bgcolor')) {
									var cg_prio = parseInt(sets['jailHL_' + g[0]], 10);
									priority = cg_prio;
									if (!prior || priority <= prior) {
										if (!prior || priority < prior) {
											prior = priority;
											bustlist = [];
										}
										bustlist.push($(this));
									}
								}
							}
						} else if ($(this).attr('bgcolor') == getV('fam_colour') || $(this).attr('bgcolor') == getV('friends_colour')) {
							// friends or family
							priority = jailHL_friends;
							if (!prior || priority <= prior) {
								if (!prior || priority < prior) {
									prior = priority;
									bustlist = [];
								}
								bustlist.push($(this));
							}
						}
					} else {
						// other
						priority = jailHL_other;
						if (!prior || priority <= prior) {
							if (!prior || priority < prior) {
								prior = priority;
								bustlist = [];
							}
							bustlist.push($(this));
						}
					}
				} else {
					// lackey
					if ($(this).attr('bgcolor') !== '') {
						// friend, family or custom group
						if (getV('custom_groups', '').indexOf($(this).attr('bgcolor')) > 0) {
							// custom group
							var cg = getV('custom_groups', '').split('|');
							cg.pop();
							for (var i = 0; i < cg.length; i++) {
								var g = cg[i].split(':');
								if (g[1] == $(this).attr('bgcolor')) {
									var cg_prio = parseInt(sets['jailHL_' + g[0] + '_lackey'], 10);
									priority = cg_prio;
									if (!prior || priority <= prior) {
										if (!prior || priority < prior) {
											prior = priority;
											bustlist = [];
										}
										bustlist.push($(this));
									}
								}
							}
						} else if ($(this).attr('bgcolor') == getV('fam_colour') || $(this).attr('bgcolor') == getV('friends_colour')) {
							// friends or family
							priority = jailHL_fr_lackey;
							if (!prior || priority <= prior) {
								if (!prior || priority < prior) {
									prior = priority;
									bustlist = [];
								}
								bustlist.push($(this));
							}
						}
					} else {
						// other
						if ($(this).find('td:eq(0) > font > a').text() == getV('nick', '')) {
							// own
							priority = jailHL_own_lackey;
							if (!prior || priority <= prior) {
								if (!prior || priority < prior) {
									prior = priority;
									bustlist = [];
								}
								bustlist.push($(this));
							}
						} else {
							// other
							priority = jailHL_other_lackey;
							if (!prior || priority <= prior) {
								if (!prior || priority < prior) {
									prior = priority;
									bustlist = [];
								}
								bustlist.push($(this));
							}
						}
					}
				}
			}).click(function () {
				// Add selected on top
				$('#HLrow').html($(this).html());
				$('#HLrow').css('background-color', $(this).attr('bgcolor'));
				$(this).find('input[name="bust"]').attr('checked', true);
				$('input[name="ver"]').focus();
			});
			if (bustlist.length > 0) {
				var bustthis;
				if (jailHL_sel === 'lowest') {
					bustthis = bustlist[bustlist.length - 1];
				} else if (jailHL_sel === 'random') {
					bustthis = bustlist[rand(0, (bustlist.length - 1))];
				} else {
					bustthis = bustlist[0];
				}

				// select inmate
				$('#HLrow').html(bustthis.html());
				$('#HLrow').css('background-color', bustthis.attr('bgcolor'));
				bustthis.find('input[name="bust"]').attr('checked', true);
			}

			$('tr[bgcolor][nobust]').find('input[name="bust"]').attr('checked', false);
			// Add successful BO to total
			if (!IsNewVersion()) {
				var bustMsg = (v == 'nl' ? 'Je hebt deze gangster' : 'You busted this person');
				var bustFriendMsg = (v == 'nl' ? 'celmaat uit de gevangenis' : 'cellmate out of jail');
				if ($('#game_container:contains("' + bustMsg + '")').length) {
					if ($('#game_container:contains("' + bustFriendMsg + '")').length) {
						bos = (bos + 1);
					}
					bos = (bos + 1);
					setV('bustouts', bos);
				}
			}
			if (IsNewVersion()) {
				// Add amount of inmates and bustouts
				$('#game_container tr:first').prepend(
					$('<td>').css('width', '46%').append(
						$('<span>').text('In jail: ' + rows),
						$('<br />'),
						$('<span>').text('Bustouts: ' + bos)
					)
				);
				$('#game_container tr:first table').css('margin-left', '0');
			} else {
				// Add amount of inmates and bustouts
				$('table > tbody > tr > td > h1').parent().append(
					$('<span>').text('In jail: ' + rows),
					$('<br />'),
					$('<span>').text('Bustouts: ' + bos)
				);
				// Focus on code field
				$('input[name="ver"]').focus();
			}
		}

		// Shit we're busted!
		if (on_page('/jail.php') && nn == 'table') {
			var bo_hotkey = sets['bo_hotkey'] || '/';
			// Add buyout hotkey
			if ($('input[name="buymeout"]').length) {
				$('input[name="buymeout"]').attr('accesskey', bo_hotkey);
			}
			// Go back to jail when time is over
			if ($('#game_container span').attr('data-timeleft')) {
				$('#game_container span').on('DOMSubtreeModified', function() {
					if ($('#game_container span').attr('data-timeleft') == -1) {
						unsafeWindow.omerta.GUI.container.loadPage(window.location.hash.substr(1));
					}
				});
			}
		}
		// Save omerta jail settings
		if (on_page('/jail_settings.php') && nn == 'form') {
			// check if already saved
			if ($('form[name="jailcolours"]').attr('saving') != 'done') {
				// save omerta defaults
				setV('friends_colour', $('select[name="friends_colour_select"]').val());
				setV('fam_colour', $('select[name="fam_colour_select"]').val());
				// cycle custom groups
				var i = 1;
				var custom_groups = '';
				$('#game_container form center div').not('#creategroup').each(function() {
					var group_name = $(this).attr('id');
					var group_colour = $(this).find('select[name="editgroup_colour_select' + i + '"]').find('option:eq(0)').val();
					custom_groups = custom_groups + group_name + ':' + group_colour + '|';
					i++;
				});
				// save custom groups
				setV('custom_groups', custom_groups);

				$('form[name="jailcolours"]').attr('saving', 'done');
			}
		}
		// ---------------- 1-click voter ----------------
		if (on_page('/vfo.php') && nn == 'center') {
			$('a[href*="votelot.php"]').attr('name', 'forticket');

			$('td.tableheader:first').html(
				$('<span>').addClass('orange').css({
					'cursor': 'pointer'
				}).attr({
					'id': 'votelink',
					'title': ''
				}).text($('td.tableheader:first').text())
			).click(function () {
					voteNow(false);
				});
			var lastVote = getV('lastvote', 0); // get last voting time
			if (lastVote === 0) {
				if (confirm('You haven\'t used the 1-click voter yet!\nDo you want to use it now?')) {
					voteNow(true);
				}
			} else { // not first run
				var till = (parseInt(lastVote, 10) + 86400) - time(); // time till next vote
				var msg = '';
				if (till <= 0) { // user can vote again so ask
					var ago = time() - lastVote; // time since last vote
					msg += 'You haven\'t used the 1-click voter today!' + '\n' + 'Since you last used the 1-click voter, it\'s been:\n';
					msg += Math.floor(ago / 86400) + ' days, '; // days
					msg += Math.floor((ago % 86400) / 3600) + ' hours, '; // hours
					msg += Math.floor((ago % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(ago % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you want to use the 1-click voter now?';
				} else { // can't vote yet
					msg += 'You can\'t vote again yet!\nPlease wait another:\n';
					msg += Math.floor(till / 3600) + ' hours, '; // hours
					msg += Math.floor((till % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(till % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you still want to vote?';
				}
				if (confirm(msg)) {
					voteNow(true);
				}
			}
		}
		// ---------------- Group Crimes ----------------
		// GroupCrime general accept focus
		if (on_page('module=GroupCrimes') && nn == 'center') {
			// focus on accept
			$('a').filter(function () {
				return (/Accept/i).test($(this).text());
			}).focus();
			// focus on transfer
			$('a').filter(function () {
				return (/Make Transfer/i).test($(this).text());
			}).focus();
		}
		// Heist LE autoform
		if (on_page('module=Heist') && nn == 'center') {
			$('input[name="bullets"]').val('50');
			$('select[name="gun"]').val('real');
			if (GetParam('driver')) {
				var dr = GetParam('driver');
				$('input[name="driver"]').val(dr);
				$('input[type="submit"]').focus();
			} else {
				$('input[name="driver"]').focus();
			}
		}
		// OC accept focus
		if (on_page('/orgcrime2.php') && nn == 'br') {
			// focus on accept
			$('a').filter(function () {
				return (/Yes/i).test($(this).text());
			}).focus();
		}
		// OC Participants autoform
		if (on_page('?takepart=yes') && nn == 'form') {
			// WE
			$('input[name="bulletz"]').val('100');
			$('select[name="guns"]').val('2');
			// EE
			$('input:radio[name="exploz"]').prop('checked', true);
			// ALL
			$('input[type="submit"]').focus();
		}
		// MOC Participants autoform
		if (on_page('module=MegaOC') && nn == 'form') {
			// WE
			$('input[type="text"]').val('500');
			// EE
			$('input:radio:eq(2)').prop('checked', true);
			// ALL
			$('input[type="submit"]').focus();
		}
		// Raid LE autoform
		if (on_page('module=Spots') && nn == 'form') {
			var kind_text = (v == 'nl' ? 'Soort' : 'Kind');
			var text_real = 'Real';
			var text_fake = 'Fake';
			var raid_setting = getV('raid_setting', 'real_raid');

			$('table.thinline tr').eq(4).after($('<tr>').append(
				$('<td>').html('<b>' + kind_text + '</b>'),
					$('<td>').text(text_real).append(
						$('<input>').attr({
							type: 'radio',
							class: 'real_raid',
							checked: (raid_setting == 'real_raid') ? true : false
						})
					).append(
						text_fake
					).append(
						$('<input>').attr({
							type: 'radio',
							class: 'fake_raid',
							checked: (raid_setting == 'fake_raid') ? true : false
						})
					)
			));

			if (raid_setting == 'fake_raid') {
				$('input[name="bullets"]').val('0');
			} else {
				$('input[name="bullets"]').val('200');
			}

			$('input[type=radio]').change(function() {
				setV('raid_setting', $(this).attr('class'));
				raid_setting = getV('raid_setting');

				if (raid_setting == 'fake_raid') {
					$('input[name="bullets"]').val('0');
				} else {
					$('input[name="bullets"]').val('200');
				}

				$('input[type=radio]:checked').not(this).prop('checked', false);
			});

			if (GetParam('driver')) {
				var dr = GetParam('driver');
				$('input[name="driver"]').val(dr);
			} else {
				$('input[name="driver"]').focus();
			}
		}
		// ---------------- Mail ----------------
		// Inbox
		if ((on_page('action=inbox') || on_page('action=delMsg')) && nn == 'center') {
			// save unread msg and msg ids
			var msg = $('td[style="cursor:pointer;cursor:hand"]').length;
			var unreadmsg = $('tr.color2').length;
			var id = [];
			for (var i = 0; i < msg; i++) { // find first open spot
				id[i] = $('a[href*="showMsg"]:eq(' + i + ')').attr('href').split('?')[1].match(/\d+/g);
				setV('msgids', id.join(',')); // join and save values
			}
			var unreadid = [];
			for (var a = 0; a < unreadmsg; a++) { // find first open spot
				unreadid[a] = $('tr.color2 > td:eq(1) > a').attr('href').split('?')[1].match(/\d+/g);
				setV('unread', unreadid.join(',')); // join and save values
			}
			// delete and reply icons
			var num = 1;
			setTimeout(function () {
				$('tr[class*="color"]').each(function () {
					var id = $(this).children('td:eq(1)').children('a').attr('href').split('?')[1].match(/\d+/g)[0];
					if ($(this).attr('class') == 'color2') {
						$(this).children('td:eq(0)').append(
							$('<img />').addClass('inboxImg unread').attr({
								src: GM_getResourceURL('delete'),
								title: 'Delete'
							}).click(function () {
								delMsg('id', id);
							})
						);
					} else {
						$(this).children('td:eq(0)').append(
							$('<img />').addClass('inboxImg').attr({
								src: GM_getResourceURL('delete'),
								title: 'Delete'
							}).click(function () {
								delMsg('id', id);
							})
						);
					}
					if ($(this).children('td:eq(2)').children('a').length) { // add reply icon
						$(this).children('td:eq(0)').append(
							$('<a>').attr('href', 'BeO/webroot/index.php?module=Mail&action=sendMsg&iReply=' + id).html(
								$('<img />').addClass('inboxImg').attr({
									src: GM_getResourceURL('reply'),
									title: 'Reply'
								})
							)
						);
					}
					if (num < 11) { // add msg hotkeys
						var mailTitle = $(this).children('td:eq(1)').children();
						mailTitle.html('[' + (num == 10 ? 0 : num) + '] ' + mailTitle.html());
						mailTitle.attr('accesskey', (num == 10 ? 0 : num));
						num++;
					}
				});
			}, 0);
			// hotkeys for system delete
			var keys = ['-', '=', '[', ']', ';', '\''];
			var selectors = $('td[align="right"][colspan="100%"] > a');
			for (i = -1; ++i < selectors.length;) {
				$('td[align="right"][colspan="100%"] > a:eq(' + i + ')').attr({
					accesskey: keys[i],
					title: 'Hotkey: ' + keys[i]
				});
			}
			// select all button
			$('td[align="right"][colspan="100%"]').prepend(
				$('<span>').css('float', 'left').append(
					$('<input />').attr({
						type: 'button',
						value: '(Un)Select All'
					}).click(function () {
						$('[name="selective[]"]').each(function () {
							$(this).prop('checked', !$(this).prop('checked'));
						});
					})
				)
			);
			// add custom system delete
			// Declare translation variables

			var lottery_text = (v == 'nl' ? 'Super Loterij' : 'Super Lottery');
			var target_not_found_text = (v == 'nl' ? 'Doelwit niet gevonden' : 'Target not found');
			var target_found_text = (v == 'nl' ? 'Doelwit gevonden' : 'Target found');
			var promoted_text = (v == 'nl' ? 'Gepromoveerd' : 'Promoted');
			var obay_higherbid_text = (v == 'nl' ? 'Obay hoger bod informatie' : 'Obay higher bid information');


			$('td[align="right"][colspan="100%"] > a:eq(0)').before($('<br />'));
			$('td[align="right"][colspan="100%"]').append(
				$('<br />'),
				$('<span>').text('Delete System: '),
				$('<span>').css('cursor', 'pointer').text(lottery_text).click(function () {
					delMsg('name', lottery_text);
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text(target_not_found_text).click(function () {
					delMsg('name', target_not_found_text);
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text(target_found_text).click(function () {
					delMsg('name', target_found_text);
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text(promoted_text).click(function () {
					delMsg('name', promoted_text);
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text(obay_higherbid_text).click(function () {
					delMsg('name', obay_higherbid_text);
				})
			);
		}

		// Outbox
		if (on_page('action=outbox') && nn == 'center') {
			setTimeout(function () {
				$('a[href*="showSentMsg"]').each(function () {
					var id = $(this).attr('href').split('?')[1].match(/\d+/g)[0];
					$(this).parent().prepend(
						$('<img />').addClass('inboxImg').attr({
							src: GM_getResourceURL('delete'),
							title: 'Delete'
						}).click(function () {
								$.get('//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=delMsg&iId=' + id + '&iParty=1', function (data) {
									$('font[color="red"]').text('Message deleted.');
								});

								$(this).closest('tr').hide();
								$(this).closest('tr').next().hide();
						})
					);
				});
			}, 0);
		}

		// Show message
		if (on_page('action=showMsg') && nn == 'center') {
			var id = wlh.split('iMsgId=')[1].match(/\d+/g)[0];
			var ids = getV('msgids', '').split(',');
			for (var i = 0; i < ids.length; i++) {
				if (ids[i] == id) {
					var next = ids[i - 1];
					var prev = ids[i + 1];
				}
			}
			// check unread msg and grab obay bullets
			var unread = getV('unread', '').split(',');
			for (var x = 0; x < unread.length; ++x) {
				if (unread[x] !== '' && unread[x] == id) { // msg is unread
					var msgTyp = $('tr.tableitem').text().split('Type:')[1].split('Sent:')[0];
					var arr = $('table.thinline > tbody > tr:eq(7) > td').html().split(' ');
					var bulletmsg = new RegExp('Obay bid succesful');
					if (bulletmsg.test(msgTyp)) { // grab obay bullets from message
						setV('obaybul', (getV('obaybul', 0) + parseInt(arr[2], 10)));
					}
					// resave unread msg's, without our msg
					var str = '';
					for (var y = 0; y < unread.length; ++y) {
						if (unread[y] !== '' && unread[y] != id) {
							str += ',' + unread[y];
						}
					}
					setV('unread', str.substr(1));
					x = unread.length; // not needed to continue because we found our id
				}
			}
			// add previous and next arrows
			setTimeout(function () {
				$('table.thinline > tbody > tr > td.tableheader:eq(1)').append(
					$('<span>').css({
						'float': 'right',
						'padding-top': '2px'
					}).append(
						$('<a>').attr({
							id: 'prev',
							href: '/BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=' + prev
						}).append(
							$('<img>').addClass('inboxImg').attr({
								title: 'Previous',
								src: GM_getResourceURL('prev')
							})
						)
					).append(
						$('<a>').attr({
							id: 'next',
							href: '/BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=' + next
						}).append(
							$('<img>').addClass('inboxImg').attr({
								title: 'Next',
								src: GM_getResourceURL('next')
							})
						)
					)
				);
				for (var j = 0; j < ids.length; j++) {
					if (ids[j] == id) {
						if (j === 0) {
							$('a#next').css('visibility', 'hidden');
						}
						if (j == ids.length - 1) {
							$('a#prev').css('visibility', 'hidden');
						}
					}
				}
			}, 0);
			// replace reply and delete links
			var linkz = $('table.thinline > tbody > tr:eq(9) > td > a');
			if (linkz.length == 1) {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a').html(
						$('<img />').addClass('inboxImg').attr({
							src: GM_getResourceURL('delete'),
							title: 'Delete ([)'
						})
					).attr('accesskey', '[');
				}, 0);
			} else {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a:first').html(
						$('<img />').addClass('inboxImg').attr({
							src: GM_getResourceURL('delete'),
							title: 'Delete ([)'
						})
					).attr('accesskey', '[');
					$('table.thinline > tbody > tr:eq(9) > td > a:last').html(
						$('<img />').addClass('inboxImg').attr({
							src: GM_getResourceURL('reply'),
							title: 'Reply (])'
						})
					).attr('accesskey', ']');
				}, 0);
			}
			// Add arrow hotkeys
			$(window).keydown(function (event) {
				var key = event.which;
				var proto = document.location.protocol;
				if (key == 39) { // right, reply
					window.location.href = proto + '//' + document.location.hostname + '/game.php#' + proto + '//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=sendMsg&iReply=' + id;
				}
				if (key == 38 && id != ids[0]) { // up, select previous
					window.location.href = proto + '//' + document.location.hostname + '/game.php#' + proto + '//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=' + next;
				}
				if (key == 40 && id != ids[ids.length - 1]) { // down, select next
					window.location.href = proto + '//' + document.location.hostname + '/game.php#' + proto + '//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=showMsg&iMsgId=' + prev;
				}
				if (key == 37) { // left, delete
					window.location.href = proto + '//' + document.location.hostname + '/game.php#' + proto + '//' + document.location.hostname + '/BeO/webroot/index.php?module=Mail&action=delMsg&iId=' + id + '&iParty=2';
				}
			});
		}
		// focus on text area
		if (on_page('iReply=') && nn == 'center') {
			$('textarea').focus();
		}
		// redirect on send message
		if (on_page('action=sendMsg') && nn == 'b') { // needs testing
			if ($('font:eq(0)').text().indexOf('Message sent to') != -1) {
				setTimeout(function () {
					$('a[href*="inbox"]')[0].click();
				}, 1000);
			}
		}
		// ---------------- Bank ----------------
		if (on_page('/bank.php') && nn == 'center') {
			// auto reload after transfer
			if ($('#game_container center').html().search('<table') == -1) {
				setTimeout(function () {
					unsafeWindow.omerta.GUI.container.loadPage(window.location.hash.substr(1));
				}, 1000);
			}
			// Add amount of interest next to %
			if ($('table.thinline:eq(1) > tbody > tr:eq(1) > td:eq(1)').length) { // check for banked money
				var money = $('table.thinline:eq(1) > tbody > tr:eq(1) > td:eq(1)').text();
				var rx = $('table.thinline:eq(1) > tbody > tr:eq(3) > td:eq(1)').text(); // get received amount
				var tmp = 1 * rx.replace(/\D/g, '') - 1 * money.replace(/\D/g, ''); // calculate interest
				$('table.thinline:eq(1) > tbody > tr:eq(2) > td:eq(1)').html($('table.thinline:eq(1) > tbody > tr:eq(2) > td:eq(1)').text() + ' &rarr; ($' + commafy(tmp) + ')');
				setTimeout(function () {
					setV('interest', tmp);
				}, 0);

				// Interest reminder
				var seconds = parseInt($('table.thinline:eq(1) tbody span').attr('data-timeleft'), 10);
				setTimeout(function () {
					setV('banktleft', (time() + seconds));
				}, 0);
			}
			// Calculators
			if ($('td[width="33%"]:eq(2)').length) {
				$('td[width="33%"]:eq(2)').append(
					$('<br />'),
					$('<table>').addClass('thinline').attr({
						width: '100%',
						align: 'center',
						rules: 'none'
					}).append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '4').text('Calculators')
						), $('<tr>').append(
							$('<td>').attr({
								'align': 'left',
								'width': '20%'
							}).text('You send:'),
							$('<td>').attr({
								'align': 'left',
								'width': '25%'
							}).append(
								$('<input>').attr({
									'name': 'amount',
									'type': 'text',
									'value': '',
									'maxlength': '11',
									'size': '13'
								}).keyup(function () {
									var amt = $(this).val().replace(/\D+/g, '');
									$('#get').text('$' + commafy(Math.round(amt * 0.9)));
								})
							),
							$('<td>').attr({
								'align': 'left',
								'width': '23%'
							}).text('User gets:'),
							$('<td>').attr({
								'align': 'left',
								'id': 'get'
							}).text('$0')
						), $('<tr>').append(
							$('<td>').attr({
								'align': 'left',
								'width': '20%'
							}).text('You want:'),
							$('<td>').attr({
								'align': 'left',
								'width': '25%'
							}).append(
								$('<input>').attr({
									'name': 'amount',
									'type': 'text',
									'value': '',
									'maxlength': '11',
									'size': '13'
								}).keyup(function () {
									var amt = $(this).val().replace(/\D+/g, '');
									$('#give').text('$' + commafy(Math.round(amt / 0.9)));
								})
							),
							$('<td>').attr({
								'align': 'left',
								'width': '23%'
							}).text('User sends:'),
							$('<td>').attr({
								'align': 'left',
								'id': 'give'
							}).text('$0')
						), $('<tr>').append(
							$('<td>').attr({
								'align': 'left',
								'width': '20%'
							}).text('Deposit:'),
							$('<td>').attr({
								'align': 'left',
								'width': '25%'
							}).append(
								$('<input>').attr({
									'name': 'amount',
									'type': 'text',
									'value': '',
									'maxlength': '11',
									'size': '13'
								}).keyup(function () {
									var amt = $(this).val().replace(/\D+/g, '');
									$('#int').text('$' + commafy(Math.round(amt * (amt >= 1000000 ? (amt >= 3000000 ? (amt >= 6000000 ? (amt >= 10000000 ? (amt >= 15000000 ? (amt >= 21000000 ? (amt >= 27000000 ? (amt >= 35000000 ? 1.01 : 1.015) : 1.02) : 1.025) : 1.03) : 1.035) : 1.04) : 1.045) : 1.05))));
								})
							),
							$('<td>').attr({
								'align': 'left',
								'width': '23%'
							}).text('Receive:'),
							$('<td>').attr({
								'align': 'left',
								'id': 'int'
							}).text('$0')
						)
					)
				);
			}
			// m/k usage
			var inputs = $('input[name="amount"], input#amount');
			inputs.each(function () {
				$(this).keydown(function (event) {
					var symcode = event.which;
					if (symcode == 75) {
						$(this).val($(this).val() + '000');
					}
					if (symcode == 77) {
						$(this).val($(this).val() + '000000');
					}
					return (symcode == 75 || symcode == 77) ? false : true;
				});
			});
		}
		// ---------------- All users ----------------
		if (on_page('/allusers.php') && nn == 'div') {
			// add page number
			var start = parseInt(GetParam('start'), 10);
			var page = (start / 15) + 1;
			$('h4').before($('<h4>').text('Page: ' + page));

			// edit show/hide dead link
			var dead = GetParam('dead');
			if (dead !== null) {
				var url = wlh.replace('#', '');
				var hs = (dead == 'HIDE') ? 'SHOW' : 'HIDE';
				$('a[href*="/allusers.php?dead="]').attr('href', url.replace(dead, hs));
			}
		}
		// ---------------- TOP 3 ----------------
		// Control Panel
		if (on_page('module=Family') && nn == 'div') {
			if (GetParam('who')) {
				$('input[name="invite"]').val(GetParam('who'));
			}
			// linkify CP log
			if (nid == 'jsprogbar_fam_rank_progress') {
				$('table.color2:eq(0) > tbody > tr > td').not(':first').not(':last').each(function () {
					if ($(this).text() !== '') {
						var len = $(this).html().trim().split(' ').length - 1;
						var who = $(this).html().trim().split(' ');
						if (who[0].match(/[A-Z]/g)) {
							if (who[0] != 'Your') {
								who[0] = '<a href="/user.php?nick=' + who[0] + '"><b>' + who[0] + '</b></a>';
							}
						}
						if (who[len].match(/[A-Z]/g)) {
							if (who[len] != 'Capo(s)') {
								if (who[len] != 'Object(s)') {
									if (who[len] != 'Unlocked') {
										if (who[len] != 'Boss.') {
											who[len] = '<a href="/user.php?nick=' + who[len].match(/\D+/g)[0].replace('.', '') + '"><b>' + who[len] + '</b></a>';
										}
									}
								}
							}
						}
						$(this).html(who.join(' '));
					}
				});
				// Add promo calculation for GF/FL.
				var cdP = parseInt($('table.color2:eq(1) > tbody > tr:eq(16) > td > table > tbody > tr:eq(6) > td:eq(3)').text().replace(/\D/g, ''), 10);
				var perc = (cdP != '0') ? $('input[name="ppercentage"]').val() : 0;
				var gfP = parseInt((((cdP / 100) * perc) + parseInt(cdP, 10)), 10);
				$('table.color2:eq(1) > tbody > tr:eq(16) > td > table > tbody').append(
					$('<tr>').append(
						$('<td>').text('GF / FL'),
						$('<td>').text('$ ' + commafy(gfP))
					)
				);
			}
		}
		// linkify opened CP log
		if (on_page('/familylog.php') && nn == 'table') {
			$('table.color2 > tbody > tr > td').not(':first').each(function () {
				if ($(this).text() !== '') {
					var len = $(this).html().trim().split(' ').length - 1;
					var who = $(this).html().trim().split(' ');
					if (who[0].match(/[A-Z]/g)) {
						if (who[0] != 'Your') {
							who[0] = '<a href="/user.php?nick=' + who[0] + '"><b>' + who[0] + '</b></a>';
						}
					}
					if (who[len].match(/[A-Z]/g)) {
						if (who[len] != 'Capo(s)') {
							if (who[len] != 'Object(s)') {
								if (who[len] != 'Unlocked') {
									if (who[len] != 'Boss.') {
										who[len] = '<a href="/user.php?nick=' + who[len].match(/\D+/g)[0].replace('.', '') + '"><b>' + who[len] + '</b></a>';
									}
								}
							}
						}
					}
					$(this).html(who.join(' '));
				}
			});
		}
		// Family bank
		if (on_page('/cpbank.php') && nn == 'center') {
			$('table.thinline:eq(0)').after($('<br />'), $('<table>').addClass('thinline').attr({
				width: '600',
				align: 'center',
				rules: 'none'
			}).append(
				$('<tr>').append(
					$('<td>').addClass('tableheader').attr('colspan', '4').text('Calculators')
				), $('<tr>').append(
					$('<td>').attr({
						'align': 'right',
						'width': '25%'
					}).text('You send:'),
					$('<td>').attr({
						'align': 'center',
						'width': '25%'
					}).append(
						$('<input>').attr({
							'name': 'amount',
							'type': 'text',
							'value': '',
							'maxlength': '11',
							'size': '15'
						}).keyup(function () {
							var amt = $(this).val().replace(/\D+/g, '');
							$('#get').text('$' + commafy(Math.round(amt * 0.85)));
						})
					),
					$('<td>').attr({
						'align': 'right',
						'width': '25%'
					}).text('User gets:'),
					$('<td>').attr({
						'align': 'center',
						'width': '25%',
						'id': 'get'
					}).text('$0')
				), $('<tr>').append(
					$('<td>').attr({
						'align': 'right',
						'width': '25%'
					}).text('You want:'),
					$('<td>').attr({
						'align': 'center',
						'width': '25%'
					}).append(
						$('<input>').attr({
							'name': 'amount',
							'type': 'text',
							'value': '',
							'maxlength': '11',
							'size': '15'
						}).keyup(function () {
							var amt = $(this).val().replace(/\D+/g, '');
							$('#give').text('$' + commafy(Math.round(amt / 0.85)));
						})
					),
					$('<td>').attr({
						'align': 'right',
						'width': '25%'
					}).text('User sends:'),
					$('<td>').attr({
						'align': 'center',
						'width': '25%',
						'id': 'give'
					}).text('$0')
				)
			));

			// m/k usage
			var inputs = $('input[name="amount"]');
			inputs.each(function () {
				$(this).keydown(function (event) {
					var symcode = event.which;
					if (symcode == 75) {
						$(this).val($(this).val() + '000');
					}
					if (symcode == 77) {
						$(this).val($(this).val() + '000000');
					}
					$(this).val($(this).val().replace(/k|m/g, ''));
					return (symcode == 75 || symcode == 77) ? false : true;
				});
			});
		}
		// ---------------- SlotsTracker ----------------
		if ((on_page('/gambling/slotmachine.php') || on_page('module=Casino.SlotMachine')) && nn == 'center') {
			var slotjp = parseInt(getV('slotjp', 0), 10);
			var slotbar = parseInt(getV('slotbar', 0), 10);
			var slotgames = parseInt(getV('slotgames', 0), 10);
			var slotgwon = parseInt(getV('slotgwon', 0), 10);
			var slotmwon = parseInt(getV('slotmwon', 0), 10);
			var slotspent = parseInt(getV('slotspent', 0), 10);
			var slotbet = parseInt(getV('slotbet', 0), 10);
			var jpmwon = parseInt(getV('jpmwon', 0), 10);
			var str = $('#game_container > center > table > tbody > tr:eq(2) > td').text().replace(/,/g, '').replace(/\n/g, '').replace(/\t/g, '');
			var betinput = (!IsNewVersion() ? $('input[name="betted"]') : $('input[name="bet"]'));
			betinput.focus();
			betinput.keyup(function () {
				setV('slotbet', parseInt($(this).val(), 10));
			});

			if ($('#game_container:contains("Congratulations!")').length > 0 || $('#game_container:contains("YOU WON THE JACKPOT")').length > 0) {
				var S1 = $('img[src*="slotmachine"]:eq(0)').attr('src').replace(/">/g, '').split('/');
				var S2 = $('img[src*="slotmachine"]:eq(1)').attr('src').replace(/">/g, '').split('/');
				var S3 = $('img[src*="slotmachine"]:eq(2)').attr('src').replace(/">/g, '').split('/');
				if (S1[6] == 'a.gif' && S2[6] == 'a.gif' && S3[6] == 'a.gif') { // Jackpot
					var rexjp = new RegExp('You Win \\$(\\d+)');
					var jpm = str.match(rexjp); // get money
					jpmwon += parseInt(jpm[1], 10); // jp money won;
					setV('jpmwon', jpmwon);
					slotmwon += parseInt(jpm[1], 10); // money won;
					setV('slotmwon', slotmwon);
					slotjp += 1; // jackpot +1;
					setV('slotjp', slotjp);
				}
				if (S1[6] == 'b.gif' && S2[6] == 'b.gif' && S3[6] == 'b.gif') { // Triple Bar
					slotbar += 1; // triple bar +1;
					setV('slotbar', slotbar);
				}
				var rex = new RegExp((!IsNewVersion() ? 'Congratulations! You won \\$(\\d+)' : 'Congratulations! You won \\$ (\\d+)'));
				var smw = str.match(rex); // get money
				slotgames += 1; // games played +1;
				setV('slotgames', slotgames);
				slotgwon += 1; // games won +1;
				setV('slotgwon', slotgwon);
				slotmwon += parseInt(smw[1], 10); // money won;
				slotmwon += parseInt(slotbet, 10); // bet back;
				setV('slotmwon', slotmwon);
				slotspent += parseInt(slotbet, 10); // money spent
				setV('slotspent', slotspent);
			}
			if ($('#game_container:contains("Bummer")').length > 0) { // lost
				slotgames += 1; // games played +1;
				setV('slotgames', slotgames);
				slotspent += parseInt(slotbet, 10); // money spent
				setV('slotspent', slotspent);
			}

			var slotprofit = slotmwon - slotspent;
			if (slotspent >= 0) {
				if (slotprofit >= 0) {
					slotprofit = '$' + commafy(slotprofit);
				} else {
					slotprofit = '-$' + commafy(slotspent - slotmwon);
				}
			}
			var sgamesWon = Math.round((slotgwon / slotgames) * 100);
			var sgamesWon2 = isNaN(sgamesWon) ? 0 : sgamesWon;

			var SlTtop = parseInt(getV('SlTtop', '225'), 10);
			var SlTleft = parseInt(getV('SlTleft', '300'), 10);
			if ($('#SlTracker').length === 0) {
				$('#game_container').append(
					$('<div>').addClass('tracker').attr({
						id: 'SlTracker'
					}).css({
						top: SlTtop,
						left: SlTleft
					}).append(
						$('<div>').attr({
							id: 'slthead'
						}).append(
							$('<center>').text('SlotsTracker').css({
								fontWeight: 'bold'
							})
						).click(function () {
								$('#SlTracker').draggable();
							}),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'sltbody'
						}).html('Games played:<font style="float:right;"><b>' + commafy(slotgames) + '</b></font><br />Games won:<font style="float:right;"><b>' + commafy(slotgwon) + ' (' + sgamesWon2 + '%)</b></font><br />Jackpot:<font style="float:right;"><b>' + slotjp + ' ($' + commafy(jpmwon) + ')</b></font><br />Triple BAR:<font style="float:right;"><b>' + slotbar + '</b></font><br />Money spent:<font style="float:right;"><b>$' + commafy(slotspent) + '</b></font><br />Money won:<font style="float:right;"><b>$' + commafy(slotmwon) + '</b></font><br />Profit:<font style="float:right;"><b>' + slotprofit + '</b></font>'),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'sltreset'
						}).addClass('reset').text('Reset stats').click(function () {
							$(this).text('Stats have been reset!');
							$('#sltbody').html('Games played:<font style="float:right;"><b>0</b></font><br />Games won:<font style="float:right;"><b>0 (0%)</b></font><br />Jackpot:<font style="float:right;"><b>0 ($0)</b></font><br />Triple BAR:<font style="float:right;"><b>0</b></font><br />Money Spent:<font style="float:right;"><b>$0</b></font><br />Money won:<font style="float:right;"><b>$0</b></font><br />Profit:<font style="float:right;"><b>$0</b></font>');
							setV('slotgames', 0);
							setV('slotgwon', 0);
							setV('slotmwon', 0);
							setV('slotspent', 0);
							setV('slotjp', 0);
							setV('slotbar', 0);
							setV('jpmwon', 0);
						})
					)
				);
			}
			$('#SlTracker').mouseup(function () {
				var divOffset = $('#SlTracker').offset();
				var left = divOffset.left;
				var top = divOffset.top;
				setV('SlTleft', left);
				setV('SlTtop', top);
			});
			// m/k usage
			betinput.each(function () {
				$(this).keydown(function (event) {
					var symcode = event.which;
					if (symcode == 75) {
						$(this).val($(this).val() + '000');
					}
					if (symcode == 77) {
						$(this).val($(this).val() + '000000');
					}
					$(this).val($(this).val().replace(/k|m/g, ''));
					return (symcode == 75 || symcode == 77) ? false : true;
				});
			});
		}
		// ---------------- Scratch tracker ----------------
		if (on_page('/scratch.php') && (nn == 'center' || nn == 'form')) {
			var monin = parseInt(getV('monin', 0), 10);
			var mils = parseInt(getV('mils', 0), 10);
			var bullets = parseInt(getV('bullets', 0), 10);
			var scratches = parseInt(getV('scratches', 0), 10);

			if ($('#game_container:contains("Congratulations!"), #game_container:contains("Gefeliciteerd!")').length) { // grab winning event
				if ($('#game_container:contains("They have been added to your account!"), #game_container:contains("Ze zijn toegevoegd aan jouw account!")').length) { // bullets
					var rex = new RegExp('(\\d+) (bullets|Kogels)');
					var r = $('#game_container').text().match(rex);
					bullets += parseInt(r[1], 10);
					setV('bullets', bullets);
				}
				if ($('#game_container:contains("It has been added to your account!"), #game_container:contains("Het is toegevoegd aan je account!")').length) { // money
					var rex = new RegExp('\\$ (\\d+)');
					var str = $('#game_container').text().replace(/,/g, '');
					var r = str.match(rex);
					monin += parseInt(r[1], 10);
					setV('monin', monin);
					if (parseInt(r[1], 10) == 1000000) {
						mils += 1;
						setV('mils', mils);
					}
					$('input[name="scratch"]').focus();
				}
			}
			if ($('#game_container:contains("Start scratching"), #game_container:contains("Start met krassen")').length) { // grab scratching event
				scratches += 1;
				setV('scratches', scratches);
				if ($('input[name="Check"]').length) {
					$('input[name="Check"]').focus();
				} else {
					$('input[type="submit"]').focus();
				}
			} else {
				if ($('input[name="codescratch"]').length) { // focus on unclaimed prices
					$('input[type="submit"]:eq(1)').focus();
				} else { // focus on scratch
					$('input[name="scratch"]').focus();
				}
			}

			var monout = (scratches * 5000);
			var profit;
			if ((monin - monout) < 0) {
				profit = '-$' + commafy(monout - monin);
			} else {
				profit = '$' + commafy(monin - monout);
			}
			var ppk = Math.round((((monout - monin) / bullets) * 100000) / 100000);
			if (isNaN(ppk) || bullets === 0) {
				ppk = 0;
			}

			var STtop = parseInt(getV('STtop', '225'), 10);
			var STleft = parseInt(getV('STleft', '300'), 10);
			if ($('#STracker').length === 0) {
				$('#game_container').append(
					$('<div>').addClass('tracker').attr({
						id: 'STracker'
					}).css({
						top: STtop,
						left: STleft
					}).append(
						$('<div>').attr({
							id: 'sthead'
						}).append(
							$('<center>').text('ScratchTracker').css({
								fontWeight: 'bold'
							})
						).click(function () {
								$('#STracker').draggable();
							}),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'stbody'
						}).html('Scratched:<font style="float:right;"><b>' + commafy(scratches) + '</b></font><br />Money spent:<font style="float:right;"><b>$' + commafy(monout) + '</b></font><br />Money won:<font style="float:right;"><b>$' + commafy(monin) + '</b></font><br />Profit:<font style="float:right;"><b>' + profit + '</b></font><br />Millions:<font style="float:right;"><b>' + commafy(mils) + '</b></font><br />Bullets won:<font style="float:right;"><b>' + commafy(bullets) + '</b></font><br />Price per bullet:<font style="float:right;"><b>$' + commafy(ppk) + '</b></font>'),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'streset'
						}).addClass('reset').text('Reset stats').click(function () {
							$(this).text('Stats have been reset!');
							$('#stbody').html('Scratched:<font style="float:right;"><b>0</b></font><br />Money spent:<font style="float:right;"><b>$0</b></font><br />Money won: <font style="float:right;"><b>$0</b></font><br />Profit:<font style="float:right;"><b>$0</b></font><br />Millions:<font style="float:right;"><b>0</b></font><br />Bullets won:<font style="float:right;"><b>0</b></font><br />Price per bullet:<font style="float:right;"><b>$0</b></font>');
							setV('monin', 0);
							setV('mils', 0);
							setV('bullets', 0);
							setV('scratches', 0);
						})
					)
				);
			}
			$('#STracker').mouseup(function () {
				// alert('Set the x and y values using GM_getValue.');
				var divOffset = $('#STracker').offset();
				var left = divOffset.left;
				var top = divOffset.top;
				setV('STleft', left);
				setV('STtop', top);
			});
		}

		// ---------------- Bullet Tracker ----------------
		if (on_page('/bullets2.php') && nn == 'center') {
			if (notificationsArray['Bullets'] !== undefined) {
				notificationsArray['Bullets'].close();
				delete(notificationsArray['Bullets']);
			}

			var BTd = new Date();
			var btdate = getV('btdate', 0);
			if (BTd.getDate() > btdate) {
				setV('bttoday', 0);
			}
			var obaybul = parseInt(getV('obaybul', 0), 10);
			var btbullets = parseInt(getV('btbullets', 0), 10);
			var bttoday = parseInt(getV('bttoday', 0), 10);
			var btmoney = parseInt(getV('btmoney', 0), 10);
			if ($('#game_container:contains("Success, you bought")').length) {
				var rex = new RegExp('Success you bought (\\d+) bullets for \\$ (\\d+)');
				var str = $('#game_container').text().split('Bulletfactory')[0].replace(/,/g, '');
				var r = str.match(rex);
				btbullets += parseInt(r[1], 10);
				bttoday += parseInt(r[1], 10);
				btmoney += parseInt(r[2], 10);
				setV('btbullets', btbullets);
				setV('bttoday', bttoday);
				setV('btmoney', btmoney);
				setV('btdate', BTd.getDate());
			}
			var btdolpbul;
			if (btbullets === 0) {
				btdolpbul = 0;
			} else {
				btdolpbul = Math.round((btmoney / btbullets) * 100) / 100;
			}

			var BTtop = parseInt(getV('BTtop', '300'), 10);
			var BTleft = parseInt(getV('BTleft', '225'), 10);
			if ($('#BTracker').length === 0) {
				$('#game_container').append(
					$('<div>').addClass('tracker').attr({
						id: 'BTracker'
					}).css({
						top: BTtop,
						left: BTleft
					}).append(
						$('<div>').attr({
							id: 'bthead'
						}).append(
							$('<center>').text('BulletTracker').css({
								fontWeight: 'bold'
							})
						).click(function () {
								$('#BTracker').draggable();
							}),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'btbody'
						}).html('Bullets bought:<font style="float:right;"><b>' + commafy(btbullets) + '</b></font><br />Bought today:<font style="float:right;"><b>' + commafy(bttoday) + '</b></font><br />Money spent:<font style="float:right;">$<b>' + commafy(btmoney) + '</b></font><br />Price per bullet:<font style="float:right;">$<b>' + commafy(btdolpbul) + '</b></font><br />Bought on Obay:*<font style="float:right;"><b>' + commafy(obaybul) + '</b></font><br /><font size="1">*not included in total or price per bullet</font>'),
						$('<hr>').css({
							color: 'gray'
						}),
						$('<div>').attr({
							id: 'btreset'
						}).addClass('reset').text('Reset stats').click(function () {
							$(this).text('Stats have been reset!');
							$('#btbody > font:not(:last-child) > b').text('0');
							setV('btbullets', 0);
							setV('btmoney', 0);
							setV('bttoday', 0);
							setV('btdate', 0);
							setV('obaybul', 0);
						})
					)
				);
			}
			$('#BTracker').mouseup(function () {
				var divOffset = $('#BTracker').offset();
				var left = divOffset.left;
				var top = divOffset.top;
				setV('BTleft', left);
				setV('BTtop', top);
			});
		}
		// ---------------- User Profile ----------------
		if (on_page('user.php') && nn == 'center') {
			var status = $('span#status').text();
			var inFam = ($('span#family > a').length ? $('span#family > a').text() : $('span#family').text());
			var alive = status.search(/Dead|Dood/);
			var unick = $('span#username').first().text();
			// DEAD or AKILLED ?
			if (!alive) {
				var rankings = '<a href="/BeO/webroot/index.php?module=Rankings&nick=' + unick + '">View Rankings</a>';
				if ($('img[src*="/userbadges/rip.gif"]').parent().get(0).tagName != 'A') {
					var akill = '<span style="color:red; font-weight:bold;"> (Akill) </span>';
					status += akill;
				}
				$.getJSON(OB_API_WEBSITE + '/?p=stats&w=deaths&v=' + v + '&ing=' + unick, function (data) {
					if (data['DiedAt'] === null) {
						$('span#status').html(status + ' | Death date is not known');
					} else {
						$('span#status').html(status + ' | ' + rankings + ' | Died at ' + data['Date'] + ' OT (' + data['Agod'] + 'd ' + data['Agoh'] + 'h ' + data['Agom'] + 'm ago)');
					}
				});
			}
			if (status === 'Alive' || status === 'Levend') {
				$.getJSON(OB_API_WEBSITE + '/?p=stats&w=laston&v=' + v + '&ing=' + unick, function (data) {
					if (data['LastOn'] === 0) { // 1970, thus not seen by logger
						$('span#status').text(status + ' | This user has not been seen online by our logger yet');
					} else {
						$('span#status').html(status + ' | Last on: ' + data['Date'] + ' OT (' + data['Agod'] + 'd ' + data['Agoh'] + 'h ' + data['Agom'] + 'm ago)');
					}
				});
			}

			// Wealth
			var tr, x, y, z;
			tr = 10;
			x = $('#game_container').html().search('Marital status:');
			y = $('#game_container').html().search('SMS Status');
			z = $('#game_container').html().search('Family Buster of');

			if (x == -1) {
				tr--;
			}
			if (y == -1) {
				tr--;
			}
			if (z == -1) {
				tr--;
			}

			var wlth = $('#wealth').attr('value');

			var kind = [' ($0 - $50.000)', ' ($50.001 - $100.000)', ' ($100.001 - $500.000)', ' ($1.000.001 - $5.000.000)', ' ($5.000.001 - $15.000.000)', ' ( > $15.000.001)', ' ($500.001 - $1.000.000)'],
				i = 1;
			var wealth = (v == 'nl' ? ['Sloeber', 'Arm', 'Modaal', 'Erg rijk', 'Te rijk om waar te zijn', 'Rijker dan God', 'Rijk'] : ['Straydog', 'Poor', 'Nouveau Riche', 'Very rich', 'Too rich to be true', 'Richer than God', 'Rich']);
			var a = wealth.indexOf(wlth);

			$('#wealth').text(wlth + kind[a]);

			// Race form
			var rf = $('#raceform').attr('value');
			var driver = (v == 'nl' ? ['Brokkenpiloot', 'Wegpiraat', 'Nieuwkomer', 'Waaghals', 'Beginner', 'Taxirijder', 'Talent', 'Professional', 'Coureur', 'Racemonster', 'Wereldkampioen'] : ['Rookie', 'Co-Driver', 'Driver', 'Advanced Driver', 'Master Driver', 'Chauffeur', 'Advanced Chauffeur', 'Master Chauffeur', 'Racing Driver', 'Race Supremo', 'Champion']);
			var a = driver.indexOf(rf);
			$('#raceform').text((a + 1) + ' - ' + rf);

			// Bust ranks
			var bustrank = $('#bustrank').attr('value');

			var amount = [' (0-500)', ' (501-1.000)', ' (1.001-2.500)', ' (2.501-5.000)', ' (5.001-10.000)', ' (10.001-15.000)', ' (15.001-20.000)', ' (20.001-25.000)', ' (25.001-27.500)', ' (27.501+)'],
				i = 1;
			var brank = (v == 'nl' ? ['Beginner', 'In opleiding', 'Ray\'s Assistent', 'Gevorderde', 'Senior buster', 'Professioneel', 'Expert', 'Held van Alcatraz', 'Meesterbuster', 'Houdini'] : ['Rookie', 'Novice', 'Initiate', 'Decent', 'Apprentice', 'Intermediate', 'Professional', 'Expert', 'Ultimate', 'Extreme Expert']);

			var a = brank.indexOf(bustrank);

			$('#bustrank').text(bustrank + amount[a]);

			// Actions
			var self = ($('table.thinline > tbody > tr:eq(2) > td:eq(1) > a > span').text() == getV('nick', ''));
			$('td.tableheader').parent().after(
				$('<tr>').append(
					$('<td>').addClass('profilerow').attr({
						'id': 'actions',
						'colspan': '2',
						'align': 'center'
					}).css('display', 'none').html('<a href="BeO/webroot/index.php?module=Heist&action=&driver=' + unick + '">Heist</a> | <a href="' + document.location.protocol + '//' + document.location.hostname + '/BeO/webroot/index.php?module=Spots&driver=' + unick + '">Raid</a> | <a href="/BeO/webroot/index.php?module=Detectives&search=' + unick + '">Hire Detectives</a>')
				)
			);
			var historyLink = null;
			if (versionHasLogger) {
				historyLink = $('<span>').text('View History').css('cursor', 'pointer').click(function () {
					$.get(OB_API_WEBSITE + '/?p=history&v=' + v + '&name=' + unick, function (data) {
						$('#game_container').empty();
						$('#game_container').html(data);
					});
				});
			}
			if (!self && alive) {
				$('td.tableheader').append(
					$('<span>').text(' | '),
					historyLink,
					$('<span>').text(' | '),
					$('<span>').text('Actions').css('cursor', 'pointer').click(function () {
						$('#actions').toggle();
					})
				);
			} else {
				$('td.tableheader').append(
					$('<span>').text(' | '),
					historyLink
				);
			}
			if (parseInt(getPow('bninfo', 4, -1), 10) === 3 && inFam === 'None') {
				$('#actions').html($('#actions').html() + ' | <a href="/BeO/webroot/index.php?module=Family&who=' + unick + '">Invite to Family</a>');
			}
		}
		// ---------------- Linkify ----------------
		// Messages
		if (on_page('action=showMsg') && nn == 'center') {
			var msgType = $('.tableheader:eq(1) > b > strong').text();
			var msgType2 = $('.tableheader:eq(1) > b').text();
			var msgTxt = '.thinline:eq(1) > tbody > tr:eq(4) > td';
			var arr = $(msgTxt).html().split(' ');
			var linkify = ['Route 66 heist', 'Organised Crime', 'Mega Organized Crime', 'Target not found', 'Carrace invite', 'Target found', 'Kill success', 'Witness statement', 'Condolences', 'found', 'Ticket update', 'Crashed Message', 'Invitation', 'Raid Notification', 'Married', 'Wedding Gift', 'Wedding', 'Wedding Invitation', 'shot!'];

			var setArr = function (num) {
				if (arr[num].substr(-1) == '.') {
					return (arr[num] = '<a href="/user.php?nick=' + arr[num].match(/\w+/g)[0] + '"><b>' + arr[num].match(/\w+/g)[0] + '</b></a>.');
				} else {
					return (arr[num] = '<a href="/user.php?nick=' + arr[num].match(/\w+/g)[0] + '"><b>' + arr[num].match(/\w+/g)[0] + '</b></a>');
				}
			};

			var WitnessMsg = new RegExp(linkify[7]); // Witness statement
			if (WitnessMsg.test(msgType)) {
				setArr(3);
				setArr(5);
				$(msgTxt).html(arr.join(' '));
			}
			var TnFMsg = new RegExp(linkify[3]); // Target not found
			if (TnFMsg.test(msgType)) {
				setArr(5);
				$(msgTxt).html(arr.join(' '));
			}
			var HeistMsg = new RegExp(linkify[0]); // Route 66 heist
			if (HeistMsg.test(msgType)) {
				if (arr[2] == 'inviting') {
					setArr(0);
					setArr(13);
					$(msgTxt).html(arr.join(' '));
				} else {
					$(msgTxt).html($(msgTxt).html());
				}
			}
			var RaceMsg = new RegExp(linkify[4]); // Car Race invite
			if (RaceMsg.test(msgType)) {
				setArr(9);
				arr[arr.length - 15] = '<a href="/races.php"><strong>' + arr[arr.length - 15];
				arr[arr.length - 14] = arr[arr.length - 14] + '</strong></a>';
				$(msgTxt).html(arr.join(' '));
			}
			var RaidMsg = new RegExp(linkify[13]); // Raid Notification
			if (RaidMsg.test(msgType)) {
				setArr(9);
				arr[arr.length - 8] = arr[arr.length - 8].split('<br>')[0] + '<br /><br /><a href="/BeO/webroot/index.php?module=Spots"><strong>' + arr[arr.length - 8].split('<br>')[2] + '</strong></a>';
				$(msgTxt).html(arr.join(' '));
			}
			var OCMsg = new RegExp(linkify[1]); // Organized Crime
			if (OCMsg.test(msgType)) {
				if (arr[2] == 'inviting') {
					setArr(0);
					setArr(arr.length - 8);
					$(msgTxt).html(arr.join(' '));
				} else {
					$(msgTxt).html($(msgTxt).html());
				}
			}
			var MOCMsg = new RegExp(linkify[2]); // Mega Organized Crime
			if (MOCMsg.test(msgType2)) {
				if (arr[2] == 'invited') {
					setArr(0);
					arr[arr.length - 8] = '<a href="/BeO/webroot/index.php?module=MegaOC"><strong>' + arr[arr.length - 8];
					arr[arr.length - 7] = arr[arr.length - 7] + '</strong></a>';
					$(msgTxt).html(arr.join(' '));
				} else {
					$(msgTxt).html($(msgTxt).html());
				}
			}
			var KillMsg = new RegExp(linkify[6]); // Kill success
			if (KillMsg.test(msgType)) {
				setArr(2);
				$(msgTxt).html(arr.join(' '));
			}
			var CondMsg = new RegExp(linkify[8]); // Condolences
			if (CondMsg.test(msgType)) {
				setArr(2);
				setArr(arr.length - 15);
				$(msgTxt).html(arr.join(' '));
			}
			var InvMsg = new RegExp(linkify[12]); // Invite
			if (InvMsg.test(msgType)) {
				setArr(8);
				$(msgTxt).html(arr.join(' '));
			}
		}
		// ---------------- Lackeys ----------------
		if (on_page('module=Lackeys') && nn == 'div') {
			// General
			var logpath = 'table[data-info="log"] > tbody > tr';
			var itemspath = 'table[data-info="items"] > tbody > tr[data-id]';
			var credits = $('td[data-info="credits"]').text();
			var money = $('td[data-info="money"]').text().replace(/,/g, '');
			// Noodles
			if (on_page('type=2') && nn == 'div') {
				var carSuccess = parseInt(getV('carSuccess', 0), 10);
				var carMoney = parseInt(getV('carMoney', 0), 10);

				// Loop cars to grab values
				var x = 0;
				var totalCarval = 0;
				$(itemspath).each(function () {
					// grab value
					var carVal = parseInt($(itemspath + ':eq(' + x + ') > td:eq(4)').text().replace(',', '').replace('$', ''), 10);
					totalCarval += carVal;
					++x;
				});

				// Show total value of nicked cars
				$('div.oheader:eq(2)').text($(itemspath).length + $('div.oheader:eq(2)').text()).append(
					$('<span>').text('total value: $' + commafy(totalCarval))
				);

				// Save cars and value
				$('table[data-info="items"] > tbody > tr > td > input[type="submit"]').click(function() {
					setV('carSuccess', (x + carSuccess));
					setV('carMoney', (totalCarval + carMoney));
				});
			}
			// Sluggs
			if (on_page('type=6') && nn == 'div') {
				var sluggsHideLaughing = sets['sluggsHideLaughing'] === undefined ? true : sets['sluggsHideLaughing'];
				var price = $('input#setting_bullets_max_price_price_6').val();

				// commafy and alert money
				var needed = (credits / 5) * (price * 1000);
				var short = money.substr(1) - needed;
				var enough = (short < 0) ? '<p style="color:red;">' + commafy(money) + ' ($' + commafy(short) + ')</p>' : '<p style="color:green;">' + commafy(money) + '</p>';
				$('td[data-info="money"]').html(enough);

				// Price per bullet
				var x = 0;
				$(logpath).each(function () {
					// show price per bullet when Sluggs bought
					// Let's see if we can put the regexes in a variable, makes it easier to edit/match them

					var sluggs_bought_match_nl = /Sluggs kocht (\d+) kogels voor \$(\d+)/;
					var sluggs_bought_match_com = /Sluggs bought (\d+) bullets for \$(\d+)/;

					if (v == 'nl') {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(sluggs_bought_match_nl) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(sluggs_bought_match_nl);
							var ppb = Math.round(r[2] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + ppb + '/kogel)');
						}
						++x;
					} else {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(sluggs_bought_match_com) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(sluggs_bought_match_com);
							var ppb = Math.round(r[2] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + ppb + '/bullet)');
						}
						++x;
					}
				});

				// Hide useless entries
				var hideLaughing = function(hide) {
					setA('sets', 'sluggsHideLaughing', hide);
					sluggsHideLaughing = hide;
					x = 0;
					$(logpath).each(function () {

						var sluggs_laughs_match_nl = /Sluggs lacht om je lage limiet/;
						var sluggs_laughs_match_com = /Sluggs is laughing at your measly limit/;

						if (v == 'nl') {
							if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().match(sluggs_laughs_match_nl) && x != logpath.length) {
								if (hide) {
									$(this).hide();
								} else {
									$(this).show();
								}
							}
							++x;
						} else {
							if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().match(sluggs_laughs_match_com) && x != logpath.length) {
								if (hide) {
									$(this).hide();
								} else {
									$(this).show();
								}
							}
							++x;
						}
					});
				};
				var hide_text = (v == 'nl' ? 'Verberg "Sluggs lacht om" meldingen' : 'Hide "Sluggs is laughing" entries');
				$('div.oheader:last').append(
					$('<span>').append(
						$('<input>').attr({
							id: 'cb',
							type: 'checkbox'
						}).click(function () {
							hideLaughing($('#cb').is(':checked'));
						}),
						$('<label />').attr('for', 'cb').text(hide_text)
					)
				);
				if (sluggsHideLaughing === true) {
					$('#cb').prop('checked', true);
					hideLaughing(true);
				}
			}
			// Freekowtski
			if (on_page('type=4') && nn == 'div') {
				var x = 0;
				$(logpath).each(function () {
					// show price per unit when Freekowtski bought

					var free_bought_match_nl = /Freekowtski heeft zojuist (\d+) (\w+) gekocht voor \$(\d+)/;
					var free_bought_match_com = /Freekowtski just bought (\d+) of (\w+) for \$(\d+)/;

					if (v == 'nl') {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(free_bought_match_nl) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(free_bought_match_nl);
							var ppu = Math.round(r[3] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + commafy(ppu) + ' / eenheid)');
						}
						++x;
					} else {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(free_bought_match_com) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(free_bought_match_com);
							var ppu = Math.round(r[3] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + commafy(ppu) + ' / unit)');
						}
						++x;
					}
				});
			}
			// O'Rourke
			if (on_page('type=3') && nn == 'div') {
				var x = 0;
				$(logpath).each(function () {
					// show price per unit when O'Rourke bought

					var rourke_bought_match_nl = /O'Rourke heeft zojuist (\d+) (\w+) gekocht voor \$(\d+)/;
					var rourke_bought_match_com = /O'Rourke just bought (\d+) of (\w+) for \$(\d+)/;

					if (v == 'nl') {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(rourke_bought_match_nl) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(rourke_bought_match_nl);
							var ppu = Math.round(r[3] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + commafy(ppu) + ' / eenheid)');
						}
						++x;
					} else {
						if ($(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(rourke_bought_match_com) && x != logpath.length) {
							var r = $(logpath + ':eq(' + x + ') > td:eq(1)').html().replace(/,/g, '').match(rourke_bought_match_com);
							var ppu = Math.round(r[3] / r[1]);
							$(logpath + ':eq(' + x + ') > td:eq(1)').html($(logpath + ':eq(' + x + ') > td:eq(1)').html() + ' ($' + commafy(ppu) + ' / unit)');
						}
						++x;
					}
				});
			}
			// Fire all button
			$('input[data-action="addCredits"]').closest('td').css('width', '99%').after(
				$('<td>').attr('align', 'right').append(
					$('<input id="ob_fire_all" type="button" value="Fire all lackeys">').click(function() {
						if (confirm('Are you sure you want to fire ALL lackeys?')) {
							$('#ob_fire_all').val('Firing lackeys ...').prop('disabled', true);
							var jailWarn = false;
							var fireLackey = function (lackeyIndex) {
								$.post('BeO/webroot/?module=Lackeys&action=fire', { lackey: lackeyIndex }).done(function(data) {
									if (data.indexOf('jail') !== -1) {
										jailWarn = true;
									}
									if (lackeyIndex < 6) {
										fireLackey(lackeyIndex + 1);
									} else {
										if (jailWarn) {
											alert('At least one of your lackeys is in jail and cannot be fired!');
											$('#ob_fire_all').val('Fire all lackeys').prop('disabled', false);
										} else {
											$('#ob_fire_all').val('Lackeys fired!');
										}
									}
								});
							};
							fireLackey(1);
						}
					})
				)
			);
		}
		// ---------------- BRC ----------------
		if ((on_page('prices.php') && nn == 'center') || (on_page('smuggling.php') && nn == 'center')) {
			var carry_n, carry_b;
			var bninfo = getV('bninfo', -1);
			if (bninfo !== '' && bninfo != -1) { // extra checker for undefined crap
				if (bninfo.search(/[^0-9]/) != -1) {
					setV('bninfo', -1);
				}
			}
			// grab Lex
			var lex, lexDay, lexHour;
			if ($('span#lexhelpsyou').length) {
				var lex = parseInt($('span#lexhelpsyou').html().replace(/[^0-9]/g, ''), 10);
				setV('lex', lex);
				var BRCd = new Date();
				lexDay = BRCd.getDay();
				lexHour = BRCd.getHours();
				setV('lexHour', lexHour);
				setV('lexDay', lexDay);
			} else {
				lex = getV('lex', 0);
				lexDay = getV('lexDay', -1);
				lexHour = getV('lexHour', -1);
			}

			var fillBRC = function(n, b, mode) { // actually filling the forms
				var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // set defaults
				// booze    - narcs    == maximum user can buy
				// carry_b  - carry_n  == total user is carrying
				// b_amount - n_amount == amount per item user is carrying
				// b        - n        == item we want
				if (n > -1 && !lnarcs && mode != 3) { // do we want narcs?
					if (carry_n === 0) { // nothing in pocket, fill it all
						values[7 + n] = narcs;
						$('input[name="typedrugs"]:eq(1)').prop('checked', true); // buy
					} else { // something in pocket
						if (carry_n < narcs) { // we got space for more
							if (n_amount[n] < narcs) { // not full of wanted
								if (n_amount[n] != carry_n) { // there is unwanted stuff
									for (i = 0; i <= 6; i++) {
										if (i != n || mode == 1) { // only sell what we don't want
											values[i + 7] = n_amount[i];
										}
									}
									$('input[name="typedrugs"]:eq(0)').prop('checked', true); // sell
								} else { // only carrying wanted narcs
									values[7 + n] = narcs - carry_n; // if any, fill missing amount
									$('input[name="typedrugs"]:eq(1)').prop('checked', true); // buy
								}
							} else { // full of wanted
								if (mode > 0) { // CD/RP mode, sell all
									values[7 + n] = n_amount[n];
									$('input[name="typedrugs"]:eq(0)').prop('checked', true); // sell
								}
							}
						} else { // we go too much, guess it was a good heist
							for (i = 0; i <= 6; i++) { // check what we carry
								if (mode === 0 && i == n) {
									values[i + 7] = 0;
								} else {
									values[i + 7] = n_amount[i];
									$('input[name="typedrugs"]:eq(0)').prop('checked', true); // sell
								}
							}
						}
					}
				}
				if (n == -1 && mode == 4 && !lnarcs) {
					for (i = 0; i <= 6; i++) {
						values[i + 7] = n_amount[i];
						$('input[name="typedrugs"]:eq(0)').prop('checked', true); // sell
					}
				}

				// check for scenario: failed selling narcs in high
				var selling_n = 0;
				for (i = 0; i <= 6; i++) {
					selling_n += values[i + 7];
				}
				var fail_n = (carry_b === 0 && carry_n == narcs && mode === 0 && selling_n > 0) ? 1 : 0;

				if (b > -1 && !fail_n && !lbooze && mode != 3) { // do we want booze? Or are we still selling narcs in high?
					if (carry_b === 0) {
						values[b] = booze; // nothing in pocket, fill it all
						$('input[name="typebooze"]:eq(1)').prop('checked', true); // buy
					} else {
						if (carry_b < booze) { // we got space for more
							if (b_amount[b] < booze) { // not full of wanted
								if (b_amount[b] != carry_b) { // there is unwanted stuff
									for (i = 0; i <= 6; i++) {
										if ((i != b || true) || mode == 1) { // only sell what we don't want or in CD mode
											values[i] = b_amount[i];
										}
									}
									$('input[name="typebooze"]:eq(0)').prop('checked', true); // sell
								} else { // only carrying wanted narcs
									if (mode == 2) {
										values[b] = carry_b; // if any, fill missing amount
										$('input[name="typebooze"]:eq(0)').prop('checked', true); // sell
									} else {
										values[b] = booze - carry_b; // if any, fill missing amount
										$('input[name="typebooze"]:eq(1)').prop('checked', true); // buy
									}
								}
							} else { // full of wanted
								if (mode > 0) { // CD/RP mode, sell all
									values[b] = b_amount[b];
									$('input[name="typebooze"]:eq(0)').prop('checked', true); // sell
								}
							}
						} else { // we go too much, guess it was a good heist
							for (i = 0; i <= 6; i++) { // check what we carry
								if (mode === 0 && i == b) {
									values[i] = 0;
								} else {
									values[i] = b_amount[i];
									$('input[name="typebooze"]:eq(0)').prop('checked', true); // sell
								}
							}
						}
					}
				}
				if (b == -1 && mode == 4 && !lbooze) {
					for (i = 0; i <= 6; i++) {
						values[i] = b_amount[i];
						$('input[name="typebooze"]:eq(0)').prop('checked', true); // sell
					}
				}

				// fill in the fields with the calculated values
				var sorts = ['wine', 'cognac', 'whiskey', 'amaretto', 'beer', 'port', 'rum', 'morphine', 'heroin', 'opium', 'cocaine', 'marihuana', 'tabacco', 'glue'];
				var start = (lbooze) ? 7 : 0;
				var end = (lnarcs) ? 6 : 13;
				for (i = start; i <= end; i++) {
					var box = $('input[name="' + sorts[i] + '"]');
					box.val(values[i]);
				}

				// focus
				$('input#ver').focus();
			};

			var highlightRow = function (event) {
				$(this).css('backgroundColor', '#888');
			};

			var removeHighlight = function (event) {
				$(this).css('backgroundColor', 'transparent');
			};

			var fillBRCForCity = function () {
				fillBRC(parseInt($(this).attr('n'), 10), parseInt($(this).attr('b'), 10), 0);
			};

			var appBRC = function(BN) {
				if (!lboth) {
					var getInfo = $('div#info:eq(0)').text();
					getInfo = getInfo.split('*');
					var narc = getInfo[0];
					var booze = getInfo[1];
					var city = getInfo[2];
					var plane = getInfo[3];
					var fam = getInfo[4];
					var lex = parseInt(getInfo[6], 10);
					var lexHour = parseInt(getInfo[7], 10);
					var lexDay = parseInt(getInfo[8], 10);

					// extra city checker
					if (on_page('smuggling.php') && nn == 'center') {
						var smugCity = $('h3').text();
						for (i = 0; i < 8; i++) {
							if (smugCity.search(cities[i]) != -1) {
								city = i + 4;
								setPow('bninfo', 2, city);
							}
						}
					}
					// calc profits per item per city
					var lex = 1 + 0.01 * lex;
					var j;
					for (var nCityprofit = [], bCityprofit = [], i = 0; i <= 7; i++) { // get profit per single unit of b/n
						for (nCityprofit[i] = [], bCityprofit[i] = [], j = 0; j <= 6; j++) { // price there - price here
							nCityprofit[i].push(Math.round(BN[0][j][(i + 2)] * lex) - Math.round(BN[0][j][(city - 4 + 2)])); // -4 correction for city ID,
							bCityprofit[i].push(Math.round(BN[1][j][(i + 2)] * lex) - Math.round(BN[1][j][(city - 4 + 2)])); // +2 correction for min/max @ [0]+[1] in BN array
						}
						nCityprofit[i].unshift(Math.max.apply(null, nCityprofit[i])); // most profit per unit in this city
						bCityprofit[i].unshift(Math.max.apply(null, bCityprofit[i]));
					}
					// create BRC table
					var table = $('<table>').addClass('thinline').attr('id', 'brc').css('width', '500').append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '5').text('Best Run Calculator')
						),
						$('<tr>').append(
							$('<td>').attr({
								colspan: '5',
								height: '1'
							}).css('background-color', '#000')
						),
						$('<tr>').css({
							'border-bottom': '1px solid #000'
						}).append(
							$('<td>').html('&nbsp; City'),
							$('<td>').html('&nbsp; Booze'),
							$('<td>').html('&nbsp; Narc'),
							$('<td>').html('&nbsp; Profit'),
							$('<td>').html('&nbsp;')
						)
					);

					// add city rows with individual profits
					for (var allProfits = [], bestBN = [], i = 0; i <= 7; i++) {
						var tr = $('<tr>').attr('id', '2row' + (i + 2));
						tr.hover(highlightRow, removeHighlight);

						var td = $('<td>').attr('colspan', '5').css({
							'border-bottom': '1px solid #000',
							'heigth': '19px'
						});

						// --Calc profits
						if (i == city - 4) { // This is the current city
							td.css('text-align', 'center');
							td.html('<i>You are in ' + cities[i] + '</i>');
							tr.append(td);
							allProfits.push(0);
							bestBN.push([0, 0]);
						} else if (plane === 0 && (((city == 6 || city == 11) && (i + 4) != 6 && (i + 4) != 11) || ((city != 6 && city != 11) && ((i + 4) == 6 || (i + 4) == 11)))) { // No plane to travel there
							td.css('text-align', 'center');
							td.html('<i>You can\'t fly to ' + cities[i] + '</i>');
							tr.append(td);
							allProfits.push(0);
							bestBN.push([0, 0]);
						} else { // Nothing wrong, clear to go
							var bestNarc = nCityprofit[i][0] < 0 ? 0 : nCityprofit[i].lastIndexOf(nCityprofit[i][0]); // best, if any, narc?
							var profitNarc = (bestNarc === 0) ? 0 : nCityprofit[i][bestNarc]; // profit per unit
							profitNarc = profitNarc * narc;

							var bestBooze = bCityprofit[i][0] < 0 ? 0 : bCityprofit[i].lastIndexOf(bCityprofit[i][0]); // best, if any, booze?
							var profitBooze = (bestBooze === 0) ? 0 : bCityprofit[i][bestBooze]; // profit per unit
							profitBooze = profitBooze * booze;

							// calc travel cost
							var travelPrices = [ // travel costs from A to B
								[    0,   600, 10350, 1575,  3600, 1350,  1050, 10800], // det
								[  600,     0, 11025, 2025,  3000, 1725,  1425, 11400], // chi
								[10350, 11025,     0, 9075, 14025, 9450,  9750, 1875],  // pal
								[ 1575,  2025,  9075,    0,  5025,  375,   675, 9375],  // ny
								[ 3600,  3000, 14025, 5025,     0, 4650,  4350, 14400], // lv
								[ 1350,  1725,  9450,  375,  4650,    0,   300, 9750],  // phi
								[ 1050,  1425,  9750,  675,  4350,  300,     0, 10050], // bal
								[10800, 11400,  1875, 9375, 14400, 9750, 10050, 0]      // cor
							];  // det   chi    pal    ny    lv     phi   bal    cor
							var travelCost = travelPrices[i][(city - 4)];
							if (plane === 0) { // no plane => half travel cost
								travelCost /= 2;
							}

							// Our total profit in this city
							var totalProfit = (profitNarc + profitBooze) - Math.round(travelCost);

							// save all profits in array for later
							if (totalProfit < 0) {
								bestBN.push([0, 0]); // push dummy to complete array
							} else {
								bestBN.push([bestNarc, bestBooze]);
							}
							var wnarc = (bestNarc === 0) ? 0 : bestNarc - 1;
							var wbooze = (bestBooze === 0) ? 0 : bestBooze - 1;
							var narcsell = (BN[0][wnarc][0] * narc) * lex;
							var boozesell = (BN[1][wbooze][0] * booze) * lex;
							var pay = (Math.round(narcsell * [0, 0.1, 0.1, 0, 0.1][fam]) + Math.round(boozesell * [0, 0.1, 0.1, 0, 0.1][fam])); // famless, member no capo, capo, top3, member with capo
							totalProfit = totalProfit - pay;
							allProfits.push(totalProfit);

							// What's the result
							if (totalProfit < 0) { // no profit :(
								td.css('text-align', 'center');
								td.html('<i>You won\'t make any profit in ' + cities[i] + '</i>');
								tr.append(td);
							} else { // profit \o/
								td.html('&nbsp;' + cities[i]);
								td.attr('colspan', '1');
								tr.append(td);
								tr.append(
									$('<td>').css({
										'border-left': '1px solid #000',
										'border-bottom': '1px solid #000'
									}).html('&nbsp; ' + boozenames[bestBooze]),
									$('<td>').css({
										'border-left': '1px solid #000',
										'border-bottom': '1px solid #000'
									}).html(parseInt(narc, 10) === 0 ? 'NO NARCS' : '&nbsp; ' + narcnames[bestNarc]),
									$('<td>').css({
										'border-left': '1px solid #000',
										'border-bottom': '1px solid #000'
									}).html('&nbsp; $' + commafy(totalProfit))
								);

								if (on_page('smuggling.php') && nn == 'center') { // we need JS links @ smuggling and don't want to waste clicks
									var key = [0, 4, 6, 1, 2, 3, 5]; // convert b/n - bot prices order to smuggling order
									var n1 = key[bestNarc - 1];
									var b1 = key[bestBooze - 1];

									tr.append(
										$('<td>').css({
											'border-left': '1px solid #000',
											'border-bottom': '1px solid #000'
										}).html('&nbsp;').append(
											$('<span>').attr({
												id: 'go' + i,
												n: n1,
												b: b1
											}).css({
												'font-weight': 'inherit',
												'text-align': 'center',
												'cursor': 'pointer'
											}).text('Go!').click(fillBRCForCity)
										)
									);
								} else { // we need to GET to smuggling too
									tr.append(
										$('<td>').css({
											'border-left': '1px solid #000',
											'border-bottom': '1px solid #000'
										}).html('&nbsp;').append(
											$('<a>').attr({
												id: 'go' + i,
												href: '/smuggling.php?action=go&n=' + (bestNarc - 1) + '&b=' + (bestBooze - 1)
											}).css({
												'font-weight': 'inherit',
												'text-align': 'center',
												'cursor': 'pointer'
											}).text('Go!')
										)
									);
								}
							}
						}
						table.append(tr);
					}
					// add lex row
					if (lex > 1) {
						var lexDate = new Date();
						table.append(
							$('<tr>').append(
								$('<td>').attr('colspan', '5').css({
									'text-align': 'center',
									'font-size': '10px'
								}).text('Lex Level: ' + parseInt((lex - 1) * 100, 10) + ' - Seen ' + ((lexDate.getDay() != lexDay) ? '1 Day ago' : lexDate.getHours() - lexHour + ' Hours ago'))
							)
						);
					}
					// add table to page
					if (on_page('prices.php') && nn == 'center') {
						if ($('#brc').length === 0) {
							$('#game_container').append(
								$('<br />'),
								table
							);
						}
					} else {
						if ($('#brc').length === 0) {
							$('#game_container').append(
								$('<br />'),
								table
							);
						}
					}
					// bold-ify Best Run
					var bestRun = allProfits.lastIndexOf(Math.max.apply(null, allProfits));
					$('#brc > tbody > tr:eq(' + (3 + bestRun) + ')').css('font-weight', 'bold');

					if (on_page('smuggling.php') && nn == 'center') {
						var AF = function (sel, Xn, Xb) {
							sel = parseInt(sel, 10);
							var n = -1;
							var b = -1;
							// assemble info for AF
							inputs = $('input');
							var bn_xp = 'form > table > tbody > tr:eq(0) > td';
							var bn_text = $(bn_xp).html().split('|');

							cash = parseInt(bn_text[0].replace(/[^0-9.]/g, ''), 10);
							booze = parseInt(bn_text[1].replace(/[^0-9.]/g, ''), 10); // max amount user can carry
							narcs = parseInt(bn_text[2].replace(/[^0-9.]/g, ''), 10);

							var b_amount = [0, 0, 0, 0, 0, 0, 0];
							var n_amount = [0, 0, 0, 0, 0, 0, 0]; // what is user carrying
							var xpb = 'table.thinline > tbody > tr:eq(';
							var xpn = 'table.thinline:eq(1) > tbody > tr:eq(';
							for (i = 0; i <= 13; i++) { // define how much of this item is being carried
								if (i < 7 && !lbooze) {
									b_amount[i] = parseInt($(xpb + (i + 3) + ') > td:eq(2)').text(), 10);
								}
								if (i > 6 && !lnarcs) {
									n_amount[(i - 7)] = parseInt($(xpn + (i - 4) + ') > td:eq(2)').text(), 10);
								}
							}
							carry_n = array_sum(n_amount);
							carry_b = array_sum(b_amount); // how much is the user carrying already
							// which item do we want?
							key = [0, 4, 6, 1, 2, 3, 5];
							if (sel === 0) { // Calc for Best Run
								n = key[(bestBN[bestRun][0] - 1)]; // this trick works, even I'm amazed
								b = key[(bestBN[bestRun][1] - 1)];
							}
							if (sel == 1) { // CD Run
								for (i = 0; i <= 6; i++) {
									var nItem = parseInt(BN[0][i][(city - 4 + 2)], 10);
									var highNarc = ((i === 0) ? nItem : ((highNarc > nItem) ? highNarc : nItem));
									if (highNarc == nItem) {
										n = i;
									}
									var bItem = parseInt(BN[1][i][(city - 4 + 2)], 10);
									var highBooze = ((i === 0) ? bItem : ((highBooze > bItem) ? highBooze : bItem));
									if (highBooze == bItem) {
										b = i;
									}
								}
								n = key[n];
								b = key[b];
							}
							if (sel == 2) { // RP Run
								for (i = 0; i <= 6; i++) {
									var nItem = parseInt(BN[0][i][(city - 4 + 2)], 10);
									var lowNarc = ((i === 0) ? nItem : ((lowNarc < nItem) ? lowNarc : nItem));
									if (lowNarc == nItem) {
										n = i;
									}
									var bItem = parseInt(BN[1][i][(city - 4 + 2)], 10);
									var lowBooze = ((i === 0) ? bItem : ((lowBooze < bItem) ? lowBooze : bItem));
									if (lowBooze == bItem) {
										b = i;
									}
								}

								n = key[n];
								b = key[b];

								/*
								 * Don't fill in if we can't earn RP and AF would want to buy
								 * Omerta sometimes won't display "NOW" when rp can be earned for b/n actions.
								 * it just displays "The next time you can earn rank points from buying [booze|narcs] is<end>"
								 * we'll handle that case too.
								 */
								if (!lbooze) {
									if (!$('form > table > tbody > tr:eq(1) > td[align="center"]:eq(0)').text().match(/NOW|NU|booze is(\s+)$|kopen over(\s+)$/m) && $('input[name="typebooze"]:eq(1)').prop('checked') === true) {
										b = -1;
									}
								}
								if (!lnarcs) {
									if (!$('form > table > tbody > tr:eq(1) > td[align="center"]:eq(1)').text().match(/NOW|NU|narcotics is(\s+)$|kopen over(\s+)$/m) && $('input[name="typedrugs"]:eq(1)').prop('checked') === true) {
										n = -1;
									}
								}
							}
							if (sel == 3) { // None
								n = b = -1;
							}
							if (document.location.href.indexOf('action=go') !== -1) { // user manual override using external Go! link
								n = key[(GetParam('n'))];
								b = key[(GetParam('b'))];
							}

							// overrule with hotkeys [ ] =
							if (Xn) {
								n = -1;
							}
							if (Xb) {
								b = -1;
							}

							// we know our n and b => fill it in!
							fillBRC(n, b, sel);
						};
						AF(getInfo[5]);

						var AFtop = parseInt(getV('AFtop', '225'), 10);
						var AFleft = parseInt(getV('AFleft', '300'), 10);
						if (!$('#AF').length) {
							if ((sets['af_position'] || 'floating') == 'floating') {
								$('#game_container').append(
									$('<div>').addClass('BRCinfo').attr({
										id: 'AF'
									}).css({
										top: AFtop,
										left: AFleft
									})
								);
							} else {
								$('#city').after(
									$('<div>').attr({
										id: 'AF'
									})
								);
							}

							$('#AF').append(
								$('<center>').text('Auto-Fill').css('font-weight', 'bold'),
								$('<hr>').css({
									'color': 'gray'
								}),
								$('<span>').append(
									$('<input>').attr({
										id: 'brc0',
										type: 'radio',
										name: 'brc'
									}).click(function () {
										AF(0);
										try {
											setV('brcAF', 0);
										} catch (e) {}
									}),
									$('<label>').attr({
										id: 'a1',
										for: 'brc0',
										acceskey: '8',
										title: 'Fill in the most profitable b/n (Hotkey: 8 )'
									}).text('Best: (8)')
								),
								$('<span>').append(
									$('<br />'),
									$('<input>').attr({
										id: 'brc1',
										type: 'radio',
										name: 'brc'
									}).click(function () {
										AF(1);
										try {
											setV('brcAF', 1);
										} catch (e) {}
									}),
									$('<label>').attr({
										id: 'a2',
										for: 'brc1',
										acceskey: '9',
										title: 'Fill in the most expensive b/n (Hotkey: 9 )'
									}).text('CD: (9)')
								),
								$('<span>').append(
									$('<br />'),
									$('<input>').attr({
										id: 'brc2',
										type: 'radio',
										name: 'brc'
									}).click(function () {
										AF(2);
										try {
											setV('brcAF', 2);
										} catch (e) {}
									}),
									$('<label>').attr({
										id: 'a3',
										for: 'brc2',
										acceskey: '0',
										title: 'Fill in the cheapest b/n (Hotkey: 0 )'
									}).text('RP: (0)')
								),
								$('<span>').append(
									$('<br />'),
									$('<input>').attr({
										id: 'brc3',
										type: 'radio',
										name: 'brc'
									}).click(function () {
										AF(3);
										try {
											setV('brcAF', 3);
										} catch (e) {}
									}),
									$('<label>').attr({
										id: 'a4',
										for: 'brc3',
										acceskey: '-',
										title: 'Don\'t fill anything (Hotkey: - )'
									}).text('None: (-)')
								)
							);
						}
						if ((sets['af_position'] || 'floating') == 'floating') {
							$(function () {
								$('#AF').draggable();
							});
							$('#AF').mouseup(function () {
								// alert('Set the x and y values using GM_getValue.');
								var divOffset = $('#AF').offset();
								var left = divOffset.left;
								var top = divOffset.top;
								setV('AFleft', left);
								setV('AFtop', top);
							});
						} else {
							// show static AF settings in one row
							$('#AF hr, #AF br').remove();
						}

						var mode = getV('brcAF', 0);

						var xp = 'form > table > tbody > tr:eq(0) > td';
						if ($('#do_n').length === 0) {
							$(xp).append(
								$('<br />'),
								$('<span>').attr({
									id: 'do_n',
									title: 'AutoFill just narcs according to selected BRC mode (Hotkey: [ )',
									acceskey: '['
								}).css('cursor', 'pointer').text('Narcs'),
								$('<span>').text(' | '),
								$('<span>').attr({
									id: 'do_b',
									title: 'AutoFill just booze according to selected BRC mode (Hotkey: ] )',
									acceskey: ']'
								}).css('cursor', 'pointer').text('Booze'),
								$('<span>').text(' | '),
								$('<span>').attr({
									id: 'do_sell',
									title: 'Sell all you have (Hotkey: = )',
									acceskey: '='
								}).css('cursor', 'pointer').text('Sell All'),
								$('<br />')
							);
						}
						$('#do_n').click(function () {
							AF(getV('brcAF', 0), 0, 1);
						});
						$('#do_b').click(function () {
							AF(getV('brcAF', 0), 1, 0);
						});
						$('#do_sell').click(function () {
							AF(4, 1, 1);
						});

						$('input#brc' + mode).prop('checked', true);
					}
				}
			};
			if (getV('bninfo', -1) > 0) { // do we have info data?
				// create info div to transfer data to XHR function
				var narc = getPow('bninfo', 0, -1);
				var booze = getPow('bninfo', 1, -1);
				var city = getPow('bninfo', 2, -1);
				var plane = getPow('bninfo', 3, -1);
				var fam = getPow('bninfo', 4, -1);

				if ($('#info').length === 0) {
					$('#game_container').append(
						$('<div>').attr('id', 'info').css('display', 'none').text(narc + '*' + booze + '*' + city + '*' + plane + '*' + fam + '*' + getV('brcAF', 0) + '*' + lex + '*' + lexHour + '*' + lexDay)
					);
				}

				// get all prices
				var i;
				if (on_page('prices.php') && nn == 'center') { // prices are on the page
					var j, k;
					for (var BN = [], i = 0; i <= 1; i++) { // B/N
						for (BN[i] = [], j = 0; j <= 6; j++) { // type
							for (BN[i][j] = [], k = 0; k <= 7; k++) { // city
								BN[i][j].push(parseInt($('#game_container center:eq(' + i + ') > table > tbody > tr:eq(' + (3 + k) + ') > td:eq(' + (1 + j) + ')').text().replace(/[^0-9]/g, ''), 10));
							}
							BN[i][j].unshift(Math.min.apply(null, BN[i][j])); // get min
							BN[i][j].unshift(Math.max.apply(null, BN[i][j])); // get max
						}
					}
					appBRC(BN);
				} else {
					var parsePrices = function (resp, url) {
						var parser = new DOMParser();
						var dom = parser.parseFromString(resp, 'application/xml');

						for (var BN = [], i = 0; i <= 1; i++) { // B/N
							for (BN[i] = [], j = 0; j <= 6; j++) { // type
								for (BN[i][j] = [], k = 0; k <= 7; k++) {
									BN[i][j].push(parseInt(dom.getElementsByTagName((i === 0 ? (narcnames[(j + 1)]).replace('abacco', 'obacco') : boozenames[(j + 1)]).toLowerCase())[k].textContent, 10)); // city
								}
								BN[i][j].unshift(Math.min.apply(null, BN[i][j])); // get min
								BN[i][j].unshift(Math.max.apply(null, BN[i][j])); // get max
							}
						}
						appBRC(BN); // send prices to BRC function
					};
					grabHTML('//' + document.location.hostname + '/BeO/webroot/index.php?module=API&action=smuggling_prices', parsePrices);
				}
			}

			if (on_page('prices.php') && nn == 'center') {
				var i, j, k;
				var noBRC = false; // assume working BRC table
				var BN;
				if (typeof BN == 'undefined') { // see if prices are grabbed already
					noBRC = true; // no BRC mean no need to try and HL 'em
					for (BN = [], i = 0; i <= 1; i++) { // B/N
						for (BN[i] = [], j = 0; j <= 6; j++) { // type
							for (BN[i][j] = [], k = 0; k <= 7; k++) { // city
								BN[i][j].push(parseInt($('#game_container center:eq(' + i + ') > table > tbody > tr:eq(' + (3 + k) + ') > td:eq(' + (1 + j) + ')').text().replace(/[^0-9]/g, ''), 10));
							}
							BN[i][j].unshift(Math.min.apply(null, BN[i][j])); // get min
							BN[i][j].unshift(Math.max.apply(null, BN[i][j])); // get max
						}
					}
				}

				var highlightPriceRow = function (event) {
					$(this).css('backgroundColor', '#888');
					$('#' + (i ? 0 : 1) + 'row' + k).css('backgroundColor', '#888');
				};

				var removeHighlightPriceRow = function (event) {
					$(this).css('backgroundColor', 'transparent');
					$('#' + (i ? 0 : 1) + 'row' + k).css('backgroundColor', 'transparent');
				};

				for (i = 0; i <= 1; i++) {
					for (j = 0; j <= 6; j++) {
						for (k = 2; k <= 9; k++) {
							if (j === 0) { // add mouseover effects
								var row = $('#game_container center:eq(' + i + ') > table > tbody > tr:eq(' + (k + 1) + ')');
								row.attr('id', i + 'row' + k);
								row.css('borderTop', '1px solid #000');
								row.hover(highlightPriceRow, removeHighlightPriceRow);
							}

							var item = $('#game_container center:eq(' + i + ') > table > tbody > tr:eq(' + (k + 1) + ') > td:eq(' + (j + 1) + ')');
							item.css({
								'borderTop': '1px solid #000',
								'text-align': 'center',
								'width': '12%'
							});
							if (j % 2 === 0) { // add colors to rows
								item.css('backgroundColor', '#B0B0B0');
							}
							if (BN[i][j][k] == BN[i][j][0]) { // HL max
								item.css('fontWeight', 'bold');
								item.css('color', '#FF0000');
							}
							if (BN[i][j][k] == BN[i][j][1]) { // HL min
								item.css('fontWeight', 'bold');
								item.css('color', '#16E54A');
							}
							if (j == 5 && i === 0) { // bold-ify cocaine
								item.css('fontWeight', 'bold');
							}
						}
					}
				}
			}
		}
		// ---------------- Smuggling ----------------
		if (on_page('smuggling.php') && nn == 'center') {
			var lbooze = 0,
				lnarcs = 0,
				lboth = 0,
				lex = 0;

			// check if lackeys on
			if ($('#game_container').html().match('/orourke.jpg') !== null && $('#game_container').html().match('/freekowski.jpg') !== null) {
				lboth = 1;
			} else if ($('#game_container').html().match('/orourke.jpg') !== null) {
				lbooze = 1;
			} else if ($('#game_container').html().match('/freekowski.jpg') !== null) {
				lnarcs = 1;
			}

			// get input fields
			var inputs = $('input');
			var bn_xp = 'form > table > tbody > tr:eq(0) > td';
			var bn_text = $(bn_xp).html().split('<br>');

			var cash = parseInt(bn_text[3].replace(/[^0-9.]/g, ''), 10);
			var booze = parseInt(bn_text[4].match(/\d+/), 10); // max amount user can carry
			var narcs = parseInt(bn_text[5].match(/\d+/), 10);
			var lexD = new Date();
			var lexDay = lexD.getDay();
			var lexHour = lexD.getHours();
			if (bn_text[6]) {
				var lex = parseInt(bn_text[6].match(/\d+/), 10);
				setV('lex', lex);
				setV('lexHour', lexHour);
				setV('lexDay', lexDay);
			} else {
				setV('lex', 0);
				setV('lexHour', lexHour);
				setV('lexDay', lexDay);
			}

			var b_amount = [0, 0, 0, 0, 0, 0]; // what is user carrying
			var n_amount = [0, 0, 0, 0, 0, 0];

			var xpb = 'table.thinline > tbody > tr:eq(';
			var xpn = 'table.thinline:eq(1) > tbody > tr:eq(';

			if (!lboth) {
				for (var i = 0; i <= 13; i++) { // add click to fill stuff and hotkeys
					if (i < 7 && !lbooze) { // booze
						var x = i + 3;
						var bname = $(xpb + x + ') > td:eq(0)').text();
						b_amount[i] = parseInt($(xpb + x + ') > td:eq(2)').html(), 10); // define how much of this item is being carried
						$(xpb + x + ') > td:eq(0)').empty();
						$(xpb + x + ') > td:eq(0)').append(
							$('<span>').attr({
								id: 'bh' + i,
								index: i,
								acceskey: (i + 1),
								title: 'Fill in this booze (Hotkey: ' + (i + 1) + ')'
								// START of Disable "Don't make functions within a loop." error
								/*jshint -W083 */
							}).css('cursor', 'pointer').text((i + 1) + ' ' + bname).click(function () {
								var i = parseInt($(this).attr('index'), 10);
								var inpt = $('input[type="text"]');
								for (var j = 0; j <= 6; j++) { // reset form
									if (j != i) {
										inpt[j + 1].value = 0;
									}
								}
								var total = array_sum(b_amount);
								var missing = booze - b_amount[i];
								var value = parseInt(inpt[(i + 1)].value, 10);
								if (b_amount[i] === 0 && total < booze) {
									if (value === 0) {
										inpt[(i + 1)].value = booze;
										$('input[type="radio"]:eq(1)').prop('checked', true);
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (b_amount[i] == booze) {
									if (value === 0) {
										inpt[(i + 1)].value = booze;
										$('input[type="radio"]:eq(0)').prop('checked', true);
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (b_amount[i] < booze && total < booze) {
									if (value === 0) {
										inpt[(i + 1)].value = missing;
										$('input[type="radio"]:eq(1)').prop('checked', true);
									} else if (value == missing) {
										inpt[(i + 1)].value = b_amount[i];
										$('input[type="radio"]:eq(0)').prop('checked', true);
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (n_amount[i - 9] > booze) {
									if (value === 0) {
										inpt[(i + 1)].value = b_amount[i];
										$('input[type="radio"]:eq(0)').prop('checked', true);
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (b_amount[i] < booze && total > booze) {
									if (value === 0) {
										inpt[(i + 1)].value = b_amount[i];
										$('input[type="radio"]:eq(0)').prop('checked', true);
									} else {
										inpt[(i + 1)].value = 0;
									}
								}
								$('input#ver').focus();
							})
							/*jshint +W083 */
							// END of Disable "Don't make functions within a loop." error
						);
					}
					if (i > 6 && !lnarcs) { // narcs
						var x = i - 4;
						var nname = $(xpn + x + ') > td:eq(0)').text();
						n_amount[(i - 7)] = parseInt($(xpn + x + ') > td:eq(2)').html(), 10); // define how much of this item is being carried
						$(xpn + x + ') > td:eq(0)').empty();
						$(xpn + x + ') > td:eq(0)').append(
							$('<span>').attr({
								id: 'nh' + i,
								index: i,
								title: 'Fill in this narc'
								// START of Disable "Don't make functions within a loop." error
								/*jshint -W083 */
							}).css('cursor', 'pointer').text(nname).click(function () {
								var i = parseInt($(this).attr('index'), 10);
								var inpt = $('input[type="text"]');
								for (var j = 0; j <= 6; j++) { // reset form
									if (j != i - 7) {
										if (lbooze) {
											inpt[j + 1].value = 0;
										} else {
											inpt[j + 8].value = 0;
										}
									}
								}
								var total = array_sum(n_amount);
								var missing = narcs - n_amount[i - 7];
								var value;
								if (lbooze) {
									value = parseInt(inpt[i - 6].value, 10);
								} else {
									value = parseInt(inpt[(i + 1)].value, 10);
								}
								if (n_amount[i - 7] === 0 && total < narcs) {
									if (value === 0) {
										if (lbooze) {
											inpt[i - 6].value = narcs;
											$('input[type="radio"]:eq(1)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = narcs;
											$('input[type="radio"]:eq(3)').prop('checked', true);
										}
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (n_amount[i - 7] == narcs) {
									if (value === 0) {
										if (lbooze) {
											inpt[i - 6].value = narcs;
											$('input[type="radio"]:eq(0)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = narcs;
											$('input[type="radio"]:eq(2)').prop('checked', true);
										}
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (n_amount[i - 7] < narcs && total < narcs) {
									if (value === 0) {
										if (lbooze) {
											inpt[i - 6].value = missing;
											$('input[type="radio"]:eq(1)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = missing;
											$('input[type="radio"]:eq(3)').prop('checked', true);
										}
									} else if (value == missing) {
										if (lbooze) {
											inpt[i - 6].value = n_amount[i - 7];
											$('input[type="radio"]:eq(0)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = n_amount[i - 7];
											$('input[type="radio"]:eq(3)').prop('checked', true);
										}
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (n_amount[i - 7] > narcs) {
									if (value === 0) {
										if (lbooze) {
											inpt[i - 6].value = n_amount[i - 7];
											$('input[type="radio"]:eq(0)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = n_amount[i - 7];
											$('input[type="radio"]:eq(3)').prop('checked', true);
										}
									} else {
										inpt[(i + 1)].value = 0;
									}
								} else if (b_amount[i] < narcs && total > narcs) {
									if (value === 0) {
										if (lbooze) {
											inpt[i - 6].value = n_amount[i - 7];
											$('input[type="radio"]:eq(0)').prop('checked', true);
										} else {
											inpt[(i + 1)].value = n_amount[i - 7];
											$('input[type="radio"]:eq(2)').prop('checked', true);
										}
									} else {
										inpt[(i + 1)].value = 0;
									}
								}
								$('input#ver').focus();
							})
							/*jshint +W083 */
							// END of Disable "Don't make functions within a loop." error
						);
					}
				}
			}

			var inp = $('input[name="typebooze"], input[name="typedrugs"]');
			inp.each(function () {
				$(this).click(function () {
					if ($('input#ver').length) {
						$('input#ver').focus();
					}
				});
			});

			// visual fix
			if (lnarcs) {
				$('form > table > tbody > tr:eq(1) > td:eq(1)').prepend(
					$('<br />'),
					$('<br />')
				);
				$('table.thinline:eq(1)').append(
					$('<br />')
				);
			}
			if (lbooze) {
				$('form > table > tbody > tr:eq(1) > td:eq(0)').prepend(
					$('<br />'),
					$('<br />')
				);
				$('table.thinline:eq(0)').append(
					$('<br />')
				);
			}

			// create more efficient info text
			var str = $('<span>').text('Pocket: $ ' + commafy(cash) + ' | Booze: ' + booze + ' | Narcs: ' + narcs + ' | Lex: ' + lex);
			$(bn_xp).html(str).append(
				$('<br />'),
				$('<a>').attr({
					href: 'prices.php',
					target: 'main'
				}).text('Current Booze/Narcotics Prices')
			);
			if (!lboth) {
				$('input#ver').focus(); // focus captcha field
			}
		}

		if (on_page('module=travel')) {
			if (notificationsArray['Travel'] !== undefined) {
				notificationsArray['Travel'].close();
				delete(notificationsArray['Travel']);
			}
		}

		// ---------------- Crime Page ----------------
		if (!IsNewVersion()) {
			if (on_page('module=Crimes') && nn == 'br') {
				if (notificationsArray['Crime'] !== undefined) {
					notificationsArray['Crime'].close();
					delete(notificationsArray['Crime']);
				}
				// Always select last option
				setTimeout(function () {
					$('input.option:last').prop('checked', true);
				}, 100);
			}
			// Grab money stolen
			if (on_page('module=Crimes') && nn == 'font') {
				var moneyStolenText = $('#game_container').text().trim();
				if (moneyStolenText.match(/\$ ([,\d]+)/) !== null) {
					var oldValue = parseInt(getV('crimeMoney', 0), 10);
					var sum = parseInt(moneyStolenText.match(/\$ ([,\d]+)/)[1].replace(',', ''), 10);
					setV('crimeMoney', (sum + oldValue));

					var totalSuccess = parseInt(getV('crimeSuccess', 0), 10);
					++totalSuccess;
					setV('crimeSuccess', totalSuccess);
				}
			}
		} else {
			if (on_page('module=Crimes') && nid == 'module_Crimes') {
				if (notificationsArray['Crime'] !== undefined) {
					notificationsArray['Crime'].close();
					delete(notificationsArray['Crime']);
				}
				// Grab money stolen
				var moneyStolenText = $('#game_container').text().trim();
				if (moneyStolenText.match(/\$ ([,\d]+)/) !== null) {
					var oldValue = parseInt(getV('crimeMoney', 0), 10);
					var sum = parseInt(moneyStolenText.match(/\$ ([,\d]+)/)[1].replace(',', ''), 10);
					setV('crimeMoney', (sum + oldValue));

					var totalSuccess = parseInt(getV('crimeSuccess', 0), 10);
					++totalSuccess;
					setV('crimeSuccess', totalSuccess);
				}
			}
		}

		// ---------------- Cars Page ----------------
		if (!IsNewVersion()) {
			if (on_page('module=Cars')) {
				// Close notifications
				if (notificationsArray['Car'] !== undefined) {
					notificationsArray['Car'].close();
					delete(notificationsArray['Car']);
				}
			}
			// Lackeys are on, show lackey page enhancements
			if (on_page('module=Cars') && nn == 'div') {
				var itemspath = 'table[data-info="items"] > tbody > tr[data-id]';
				// Loop cars
				var x = 0;
				var totalCarval = 0;
				$(itemspath).each(function () {
					// Grab value
					var carVal = parseInt($(itemspath + ':eq(' + x + ') > td:eq(4)').text().replace(',', '').replace('$', ''), 10);
					totalCarval += carVal;
					++x;
				});
				// Show total value
				$('div.oheader:eq(2)').text($(itemspath).length + $('div.oheader:eq(2)').text()).append(
					$('<span>').text('total value: $' + commafy(totalCarval))
				);
			}
			// Grab value of stolen car (does not include cars stolen by lackeys)
			if (on_page('module=Cars') && nn == 'center') {
				var carValText = $('#game_container').text().trim();
				if (carValText.match(/\$ ([,\d]+)/) !== null) {
					var oldValue = parseInt(getV('carMoney', 0), 10);
					var sum = parseInt(carValText.match(/\$ ([,\d]+)/)[1].replace(',', ''), 10);
					setV('carMoney', (sum + oldValue));
					var totalSuccess = parseInt(getV('carSuccess', 0), 10);
					++totalSuccess;
					setV('carSuccess', totalSuccess);
				}
			}
		} else {
			if (on_page('module=Cars') && nid == 'module_Cars') {
				// Close notifications
				if (notificationsArray['Car'] !== undefined) {
					notificationsArray['Car'].close();
					delete(notificationsArray['Car']);
				}
				// Grab value of stolen car (does not include cars stolen by lackeys)
				var carValText = $('#game_container').text().trim();
				if (carValText.match(/\$ ([,\d]+)/) !== null) {
					var oldValue = parseInt(getV('carMoney', 0), 10);
					var sum = parseInt(carValText.match(/\$ ([,\d]+)/)[1].replace(',', ''), 10);
					setV('carMoney', (sum + oldValue));
					var totalSuccess = parseInt(getV('carSuccess', 0), 10);
					++totalSuccess;
					setV('carSuccess', totalSuccess);
				}
			}
			// Lackeys are on, show lackey page enhancements
			if (on_page('module=Cars') && nclass == 'otable widetable') {
				var itemspath = 'table[data-info="items"] > tbody > tr[data-id]';
				// Loop cars
				var x = 0;
				var totalCarval = 0;
				$(itemspath).each(function () {
					// grab value
					var carVal = parseInt($(itemspath + ':eq(' + x + ') > td:eq(4)').text().replace(',', '').replace('$', ''), 10);
					totalCarval += carVal;
					++x;
				});
				// Show total value
				$('div.oheader:eq(2)').text($(itemspath).length + $('div.oheader:eq(2)').text()).append(
					$('<span>').text('total value: $' + commafy(totalCarval))
				);
			}
		}
		// ---------------- Obay ----------------
		if (on_page('obay.php') && !on_page('specific') && nn == 'center') {
			$('table.thinline:eq(2) > tbody > tr').each(function () {
				if (['one', 'two', 'three'].indexOf($(this).attr('class')) > -1) { // this row has an object
					var sort_b = (on_page('type=11')) ? 1 : 0; // are we sorting on bullets?
					// add price per bullets
					if ($(this).text().indexOf('bullets') != -1) {
						var bullets = parseInt($(this).find('td:eq(' + (2 - sort_b) + ')').text().replace(/[^0-9.]/g, ''), 10);
						var money = parseInt($(this).find('td:eq(' + (3 - sort_b) + ')').text().replace(/[^0-9.]/g, ''), 10);
						var ppb = parseInt(money / bullets, 10);
						$(this).find('td:eq(' + (2 - sort_b) + ')').text($(this).find('td:eq(' + (2 - sort_b) + ')').text() + ' ($' + commafy(ppb) + ')');
					}
				}
			});
		}
		if (on_page('obay.php?specific=') && nn == 'center') {
			$('input[name="anon"][value="0"]').prop('checked', 'checked');
			$('input[type="submit"]').focus();
		}
		// ---------------- Garage ----------------
		if ((on_page('garage.php') || on_page('module=Cars')) && nn == 'h2') {
			var totVal = 0;
			var types = [
				['h',    8,  9, 13, 15, 16, 17, 18, 19, 21, 22, 27, 32, 34, 35, 40, 43],
				['oc',  23, 25, 26, 28, 29, 30, 31, 33, 39, 41, 42],
				['moc', 45, 47, 48],
				['tr',  23, 47, 54]
			];
			$('tr.thinline').each(function () { // loop rows
				var carid = $(this).find('td:eq(0)').text();
				var carVal = parseInt($(this).find('td:eq(3)').html().replace(',', '').replace('$', ''), 10); // get value
				totVal += carVal;
				$(this).click(function (e) {
					var check = $(this).find('input[value="' + carid + '"]');
					if (e.target.tagName != 'INPUT') {
						check.click();
					}
				});
			});
			// add amount of bullets
			var head = $('h2');
			var cars = head.text().match(/\d+/g)[2];
			if (cars > 0) {
				head.append(
					$('<span>').text(' | Potential Bullets: ' + cars * 12)
				);
			}
			// add amount of money
			if (totVal > 0) {
				head.append(
					$('<span>').text(' | Total car value of this page: $' + commafy(totVal))
				);
			}
			// scrolldown link
			$('<div>').css({
				'float': 'right',
				'cursor': 'pointer'
			}).append(
				$('<span>').text('Scroll down').click(function () {
					$(IsNewVersion() ? '#game_container_wrapper' : 'html').animate({
						scrollTop: $(IsNewVersion() ? '#game_container' : '#game_wrapper_master').height()
					}, 1000);
				})
			).insertBefore('table.thinline');
			$(window).scroll(toggleFooterVisibility);
			// add footer div only window is bigger then 1024px
			// floating footer is temporarily disabled on v5 due to recent updates
			if (window.innerWidth > 1024 && !IsNewVersion()) {
				$(IsNewVersion() ? '#game_wrapper_container' : '#game_container center').append(
					$('<div>').attr({
						id: 'footer'
					}).css({
						'position': IsNewVersion() ? 'absolute' : 'fixed',
						'bottom': IsNewVersion() ? '5px' : '0px',
						'left': IsNewVersion() ? '5px' : 'inherit',
						'background': IsNewVersion() ? '#50545A' : '#F0F0F0',
						'color': IsNewVersion() ? '#EEE' : '#000',
						'width': IsNewVersion() ? '98.15%' : '70%',
						'text-align': 'center',
						'border': '1px solid black',
						'border-bottom-right-radius': IsNewVersion() ? '4px' : '0px',
						'border-bottom-left-radius': IsNewVersion() ? '4px' : '0px'
					}).html($('tr:has(input[name="shipcity"]) td').html())
				);
				// remove cloned action_result input, otherwise the confirm() for sell etc. will be useless
				$('#footer input[name="action_result"]').remove();
				toggleFooterVisibility();
			}
			$('td:has(input[value="SH-cars"]), #footer').append(
				$('<select>').attr({
					name: 'selsort'
				}).append(
					$('<option>').attr('value', '0').text('-----'),
					$('<option>').attr('value', '1').text('Above'),
					$('<option>').attr('value', '2').text('Below'),
					$('<option>').attr('value', '3').text('Between')
				).on('change', function() {
					$(this).siblings('[name="selval2"]').toggle($(this).val() === '3');
				}),
				$('<input>').attr({
					type: 'text',
					name: 'selval',
					size: '9'
				}),
				$('<input>').attr({
					type: 'text',
					name: 'selval2',
					size: '9'
				}).css('display', 'none'),
				$('<input>').attr({
					type: 'button',
					name: 'selgo',
					value: 'Select'
				}).click(function () {
					var sort = $(this).siblings('[name="selsort"]').val();
					var val = $(this).siblings('[name="selval"]').val();
					if (val !== '' && sort != '-----') {
						var maxPrice = $(this).siblings('[name="selval2"]').val();
						$('tr.thinline').each(function () { // loop rows
							var carid = $(this).find('td:eq(0)').text();
							var carVal = parseInt($(this).find('td:eq(3)').html().replace(',', '').replace('$', ''), 10); // get value
							var check = $(this).find('input[value="' + carid + '"]');
							var comment = $(this).find('td:eq(6)').text().trim();
							if (check.prop('checked') === true) {
								check.click();
							}
							var carWorthAbove = sort == 1 && carVal > val;
							var carWorthBelow = sort == 2 && carVal < val;
							var carWorthBetween = (sort == 3 && carVal >= val && (carVal <= maxPrice));
							if (carWorthAbove || carWorthBelow || carWorthBetween) {
								if (comment.indexOf('IN SAFEHOUSE') === -1) {
									check.click();
								}
							}
						});
					}
				})
			);
		}
		// ---------------- Kill page ----------------
		if (on_page('module=Detectives') && nn == 'div') {
			if (nid == 'wrappertest') {
				if (GetParam('search')) {
					$('input[name="target"]').val(GetParam('search'));
				}
			}

			// Fire all Detectives that have failed searching for person X
			// Translation variables
			var failedMessage = (v == 'nl' ? 'gefaald' : 'failed');
			var fireDetectivesMessage = (v == 'nl' ? 'Verwijder gefaalde detectives' : 'Fire all failed detectives');

			$('input[data-action="fireAll"]').closest('td').css('width', 'auto').after(
				$('<td>').attr('align', 'right').append(
					$('<input id="ob_fire_all" type="button" value="' + fireDetectivesMessage + '"">').click(function() {
						$('#ob_fire_all').val('Firing..').prop('disabled', true);
						var fireDetectives = function () {

							// Loop over each row in the table, except the last row
							$('.otable > table > tbody > tr:not(:last-child)').each(function() {
								var detectiveText = $(this).find('td:first').text();
								var ajaxID = $(this).find('td:nth-child(2) a').attr('data-id');
								var elem = this;

								// Check if the row contains 'failed', which means the detective hasn't found the person
								// In case he hasn't, its safe to remove that detective

								if (wordInString(detectiveText, failedMessage)) {
									$.post('BeO/webroot/?module=Detectives&action=fire', { id: ajaxID }).done(function(data) {
										$('#ob_fire_all').val('Detectives fired!');
										$(elem).closest('tr').hide();
									});
								}
							});
						};
						fireDetectives();
					})
				)
			);

			// Disable the input box if there are no messages of failed detectives
			if ($('#detectives-hired-div:contains("' + failedMessage + '")').length > 0) {
				$('#ob_fire_all').prop('disabled', false);
			} else {
				$('#ob_fire_all').prop('disabled', true);
			}

			// If a user inserts '60k', automatically change it to '60.000'.
			// This should work for every value in front of the 'k'

			$('input[name="bullets"]').blur(function () {
				var textValue = $(this).val();

				// if the last character of the string is 'k'
				if (textValue.match(/k$/)) {
					// remove the last character
					var bulletValue = textValue.slice(0, textValue.length - 1);
					var newBulletValue = bulletValue * 1000;

					$('input[name="bullets"]').val(newBulletValue);
				}
			});

		}
		// ---------------- Misc ----------------
		// look its me
		if ((on_page('users_online') && nn == 'center') || (on_page('allusers.php') && nn == 'div') || (on_page('global_stats')) && nn == 'center') {
			var nick = getV('nick', '');
			if (nick !== '') {
				$('a[class!="link"]').each(function () {
					if ($(this).text() == nick || $(this).text() == nick + '+') {
						$(this).html('<span style="color:green;font-weight:bold;">' + $(this).html() + '</span>');
					}
				});
			}
		}
		// quick lookup
		if (on_page('user.php') && nn == 'span') {
			var input = GetParam('nick');
			var str = (v == 'nl' ? 'Deze speler bestaat niet' : 'This user does not exist');
			if ($('#game_container:contains("' + str + '")').length && input !== false) {
				setTimeout(function () {
					$.getJSON(OB_API_WEBSITE + '/?p=quicklookup&v=' + v + '&input=' + input, function (data) {
						$('#game_container').html(str + ': ' + input);
						var html = '';
						var i = 0;
						for (var results in data) {
							if (data.hasOwnProperty(results)) {
								if (i < 50) {
									html += '<br /><a href="user.php?nick=' + results + '" id="' + i + '" class="sel">' + results + '</a>';
								}
							}
							i++;
						}
						var total = i === 0 ? 0 : ++i;
						if (input.length < 3) {
							$('#game_container').html(str + ': ' + input + '<br />This will give too many results. Try to be more specific.');
						} else if (total !== 0) {
							if (IsNewVersion()) {
								$('#game_wrapper_container').css('height', '99%');
								$('span.title-main').text('Quick lookup by Omerta Beyond');
							}
							$('#game_container').html((total <= 50) ? str + ': ' + input + '<br />Maybe this is what you were looking for:<br />' : str + ': ' + input + '<br />Maybe this is what you were looking for:<br />Total results: ' + total + ' Showing first 50 results<br />');
							$('#game_container').html($('#game_container').html() + html);
							$('#0').focus();
							var j = 0;
							$(window).keydown(function (event) {
								if (event.keyCode == 40) {
									if (j < num - 1) {
										j++;
										$('#' + j).focus();
									}
								}
							});
							$(window).keydown(function (event) {
								if (event.keyCode == 38) {
									if (j !== 0) {
										j--;
										$('#' + j).focus();
									}
								}
							});
						} else {
							$('#game_container').html(str + ': ' + input + '<br />Sorry, we also couldn\'t find any alternatives.');
						}
					});
				}, 100);
			}
		}
		// ---------------- Blood AF ----------------
		if (on_page('module=Bloodbank') && nn == 'table') {
			var table, tr, A, B, m, type, types;
			type = getV('bloodType');

			var bloodAF = function (t) {
				// setup costs row
				table = $('table.thinline:eq(1)');
				tr = $('<tr>').html('<td><font size="2"><b> &nbsp;Total Costs </b></font></td><td align="center"><font size="2" id="A"></font></td><td align="center"><font size="2" id="B"></font></td><td align="center"><font size="2" id="AB"></font></td><td align="center"><font size="2" id="O"></font></td>');
				table.append(tr);

				function getType(num) {
					return parseInt($('table.thinline:eq(1) > tbody > tr:eq(2) > td:eq(' + num + ')').text().replace('$ ', ''), 10);
				}

				function setType(num) {
					return ($('select').get(0).selectedIndex = num);
				}

				function calc(a, b, ab, o) { // see if user can buy bloodtype and then calc total price
					$('font#A').text(a ? '$ ' + m * $('td[align="center"]:eq(9)').text().replace('$ ', '') : 'X');
					$('font#B').text(b ? '$ ' + m * $('td[align="center"]:eq(10)').text().replace('$ ', '') : 'X');
					$('font#AB').text(ab ? '$ ' + m * $('td[align="center"]:eq(11)').text().replace('$ ', '') : 'X');
					$('font#O').text(o ? '$ ' + m * $('td[align="center"]:eq(12)').text().replace('$ ', '') : 'X');
				}
				if ($('input[name="UnitsToBuy"]').length) {
					m = parseInt($('input[name="UnitsToBuy"]').val(), 10);
					types = [getType('1'), getType('2'), getType('3'), getType('4')];
					A = [types[0], types[3]];
					B = [types[1], types[3]];

					if (t == 'A') {
						calc(1, 0, 0, 1);
						setType(iMin(A));
					}
					if (t == 'B') {
						calc(0, 1, 0, 1);
						setType(iMin(B));
					}
					if (t == 'AB') {
						calc(1, 1, 1, 1);
						setType(iMin(types));
					}
					if (t == 'O') {
						calc(0, 0, 0, 1);
						setType(0);
					}
					$('input[name="Buy"]').focus();
				} else {
					calc(0, 0, 0, 0);
				}
			};
			bloodAF(type);
		}
		// ---------------- Bodyguards ----------------
		if (on_page('module=Bodyguards') && nn == 'div') {
			// Hide bio
			$('div[id$="BoughtBG"]').css('display', 'none');
			// set timer for BG if it counts down
			if ((prefs['notify_bg'] || prefs['notify_bg_sound']) && !bgTimer) {
				var bgTime = parseInt($('[data-timecb="bodyguard"]').attr('data-timeleft'), 10);
				if (bgTime > 0) {
					bgTimer = true;
					setTimeout(function() {
						bgTimer = false;
						var bgText = (v == 'nl' ? 'Je kunt je bodyguard weer trainen' : 'You can train your bodyguard again');
						var bgTitle = 'Train Bodyguard (' + v + ')';
						if (prefs['notify_bg']) {
							SendNotification(bgTitle, bgText, 'bodyguard', './BeO/webroot/index.php?module=Bodyguards', GM_getResourceURL('red-star'));
						}
						if (prefs['notify_bg_sound']) {
							playBeep();
						}
					}, bgTime * 1000);
				}
			}
		}
		// ---------------- Raid Result @ Statistics and Spots ----------------
		if (on_page('global_stats') || on_page('module=Spots')) {
			var isSpots = on_page('module=Spots');
			// add possible raid profit in a new column for all objects
			$('td:contains("Profit"), td:contains("Winst"), td:contains("Kazanc")').closest('table').find('tr').each(function() {
				var tableHeader;
				if (isSpots) {
					tableHeader = $(this).find('td[colspan="7"]');
				} else {
					tableHeader = $(this).find('td.tableheader, td[bgcolor="black"]');
				}
				if (tableHeader.length > 0) {
					// increase colspan of table header
					tableHeader.each(function() {
						$(this).attr('colspan', parseInt($(this).attr('colspan'), 10) + 1);
					});
					return;
				}
				if (isSpots && $(this).find('td:first').hasClass('tableheader')) {
					$(this).find('td.tableheader:eq(4)').after($('<td class="tableheader"><b class="raid_profit_tooltip" title="Best Possible Raid Result per Player">Result</b></td>'));
					return;
				} else {
					var firstRowText = $(this).find('td:first').text();
					if (firstRowText == 'City:' || firstRowText == 'Stad:') {
						// add table header
						$(this).append($('<td><b class="raid_profit_tooltip" title="Best Possible Raid Result per Player">Raid Result:</b></td>'));
						return;
					}
				}
				if (isSpots && $(this).find('td[colspan="3"]').length > 0) {
					// make Bankrupt/OOB columns wider
					$(this).find('td[colspan="3"]').attr('colspan', '4');
					return;
				}
				if (!isSpots) {
					// make city column a bit smaller
					$(this).find('td:first').attr('width', '130');
				}
				var profit;
				if (isSpots) {
					profit = parseInt($(this).find('td[style="color:green;"]').text().replace(/,|\$/g, ''), 10);
				} else {
					if ($(this).find('.profit').length > 0) {
						profit = parseInt($(this).find('.profit').text().replace(/,|\$/g, ''), 10);
					} else {
						profit = 0;
					}
				}
				if (profit > 0) {
					// row with running + profitable object
					var protection = parseInt($(this).find('.percent').text().replace('%', ''), 10);
					var raidResult = calcRaidResult(profit, protection);
					if (isSpots) {
						$(this).find('td:eq(4)').after('<td>$ ' + commafy(Math.floor(raidResult)) + '</td>');
					} else {
						$(this).append('<td>$ ' + commafy(Math.floor(raidResult)) + '</td>');
					}
				} else if (isSpots || $(this).find('.loss').length > 0 || $(this).text().indexOf('None') !== -1 || $(this).text().indexOf('Geen') !== -1) {
					// append empty column for spots with losses or no profit
					// border will be gone otherwise
					if (isSpots) {
						$(this).find('td:eq(4)').after('<td></td>');
					} else {
						$(this).append('<td></td>');
					}
				}
			});
		}
		// ---------------- END OF MAIN GAME CONTAINER ----------------

		// DM PREFS
		if (IsNewVersion()) {
			// prefs circle
			var prefs_div = $('<div>').addClass('sm-circle-bg ob-prefs-bg').append(
				$('<span>').addClass('sm-circle sm-health').append(
					$('<img>').attr({'src': GM_getResourceURL('favicon'), 'title': 'Omerta Beyond Preferences'}).addClass('ob-prefs-img')
				).hover(
					function() {
						$(this).css('background', '#000FF0');
					},
					function() {
						$(this).css('background', '#FFF');
					}
				)
			).click(function () {
				$('span.title-main').text('Omerta Beyond Preferences');
				$('#game_container').empty();
				$('#game_wrapper_container').css('height', '99%');
				$('#game_container').append(GetPrefPage());
			});
			if (versionHasLogger) {
				// live famstats circle (needs new icon!)
				var lf_div = $('<div>').addClass('sm-circle-bg ob-lf-bg').append(
					$('<span>').addClass('sm-circle sm-health').append(
						$('<img>').attr({'src': GM_getResourceURL('favicon'), 'title': 'Omerta Beyond Live Famstats'}).addClass('ob-prefs-img')
					).hover(
						function() {
							$(this).css('background', '#1EB418');
						},
						function() {
							$(this).css('background', '#FFF');
						}
					)
				).click(function () {
					window.open(OB_RIX_WEBSITE + '/stats.php?v=' + v + '&d=n');
				});

				if ($('.ob-lf-bg').length === 0) {
					$('div.omerta-widget-avatar-body').append(lf_div);
				}
			}

			if ($('.ob-prefs-bg').length === 0) {
				$('div.omerta-widget-avatar-body').append(prefs_div);
			}
		}
	};
}

/*
 * Pages without only text nodes
 */

$('#game_container').on('DOMNodeInserted', function(event) {
	if (on_page('jail.php')) {
		// Return when self bo
		if ($('#game_container:contains("You busted yourself out of jail")').length) {
			if (!$('#bo_fired').length) {
				var bos = parseInt(getV('bustouts', 0), 10);
				bos = (bos + 1);
				setV('bustouts', bos);
				$('#game_container').append($('<span>').attr('id', 'bo_fired'));
				unsafeWindow.omerta.GUI.container.loadPage(window.location.hash.substr(1));
			}
		}
		// Return when busted
		if ($('#game_container:contains("You are not in jail!")').length) {
			if (!$('#bo_fired').length) {
				$('#game_container').append($('<span>').attr('id', 'bo_fired'));
				unsafeWindow.omerta.GUI.container.loadPage(window.location.hash.substr(1));
			}
		}
	}
});

/*
 * Notifications trigger & marquee
 */

var prevPrices = [];
var firstTimePrice = true;
$('#game_container').one('DOMNodeInserted', function () {
	if (versionHasLogger) {
		setTimeout(function () {
			CheckBmsg();
		}, 1000);
	}
	setTimeout(function() {
		CheckServiceVariable();
	}, 1000);

	function buildMarquee() {
		setTimeout(function () {
			GM_xmlhttpRequest({
				method: 'GET',
				url: '/BeO/webroot/index.php?module=API&action=smuggling_prices',
				onload: function (resp) {
					var parser = new DOMParser();
					var dom = parser.parseFromString(resp.responseText, 'application/xml');

					function getPrice(drug, city) {
						return dom.getElementsByTagName(drug)[city].textContent;
					}

					function refreshMarquee(h, m) {
						h = (m >= 31 ? h + 1 : h);
						m = (m >= 31 ? 1 : 31);
						var marQd = new Date();
						marQd.setHours(h);
						marQd.setMinutes(m);
						marQd.setSeconds(0);
						marQd.setMilliseconds(0);
						return (marQd.getTime() - getOmertaTime());
					}

					var p = [];
					var q = [];
					var pricesChanged = false;

					for (var i = 0; i <= 7; i++) {
						p[i] = getPrice('cocaine', i);
						q[i] = p[i];
						if ((prevPrices === undefined || prevPrices[i] === undefined) || prevPrices[i] != p[i]) {
							pricesChanged = true;
						}
					}

					if (pricesChanged) {
						prevPrices = JSON.parse(JSON.stringify(q));
					} else {
						setTimeout(buildMarquee, 30000);
						return;
					}

					var max = p.sort(function (a, b) {
						return b - a;
					})[0];
					var min = p[(p.length - 1)];

					var highCity = '';
					var highCityPrice = 0;
					var lowCity = '';
					var lowCityPrice = 0;
					i = 0;
					q.forEach(function ($n) {
						if ($n == min) {
							q[i] = '<span style="color:#00ff00;">' + $n + '</span>';
							lowCity = cities[i];
							lowCityPrice = $n;
						}
						if ($n == max) {
							q[i] = '<span style="color:' + (IsNewVersion() ? '#ff5353' : '#ff0000') + ';">' + $n + '</span>';
							highCity = cities[i];
							highCityPrice = $n;
						}
						i++;
					});

					if (!firstTimePrice && (prefs['notify_bn'] || prefs['notify_bn_sound'])) {
						if (prefs['notify_bn']) {
							SendNotification('B/N prices changed', 'High city: ' + highCity + ' (' + highCityPrice + ')\nLow city: ' + lowCity + ' (' + lowCityPrice + ')', 'Booze', './BeO/webroot/index.php?module=Travel', GM_getResourceURL('red-star'));
						}

						if (prefs['notify_bn_sound']) {
							playBeep();
						}
					}

					firstTimePrice = false;

					var time = dom.getElementsByTagName('humantime')[0].textContent;
					time = time.split(' ')[0];
					time = time.split(':');
					time = (time[1] < 30) ? time[0] + ':00 OT' : time[0] + ':30 OT';

					function hovermenu(city, x, y) {
						var hoverStyle = IsNewVersion() ? {
							display: 'block',
							position: 'fixed',
							left: $('#marquee').offset().left,
							top: '42px',
							zIndex: '102',
							opacity: 0.8,
							backgroundColor: 'black',
							color: '#EEE',
							border: 'none',
							padding: '5px 15px 5px 15px'
						} : {
							display: 'inline',
							left: x
						};
						$('#hiddenbox').css(hoverStyle).html('Morphine: ' + getPrice('morphine', city) + ' | ' + 'Heroin: ' + getPrice('heroin', city) + ' | ' + 'Opium: ' + getPrice('opium', city) + ' | ' + 'Whiskey: ' + getPrice('whiskey', city) + ' | ' + 'Amaretto: ' + getPrice('amaretto', city) + ' | ' + 'Rum: ' + getPrice('rum', city));
					}

					function flytolink(city, priceStr, priceToFly, cityId) {
						var mycity = getPow('bninfo', 2, -1);
						var link = $('<a>').attr({
							id: cities[city],
							href: '#'
						}).css({
							color: '#FFF',
							fontSize: '10px'
						}).click(function () {
							if (mycity - 4 == city) {
								alert('You are already staying in this city!');
							} else if (confirm('Are you sure you want to travel to ' + cities[city] + '?')) {
								window.location = '/BeO/webroot/index.php?module=Travel&action=FetchInfo&CityId=' + ((city == 'nul') ? 0 : city);
							}
						});

						if (city == 5 || city == 6 || city == 7) {
							link.mouseover(function (event) {
								hovermenu(city, event.clientX - 560);
								$(this).css('textDecoration', 'underline');
							});
						} else if (city === 0 || city == 1 || city == 2) {
							link.mouseover(function (event) {
								hovermenu(city, event.clientX + 25);
								$(this).css('textDecoration', 'underline');
							});
						} else {
							link.mouseover(function (event) {
								hovermenu(city, event.clientX - 200);
								$(this).css('textDecoration', 'underline');
							});
						}
						link.mouseout(function (event) {
							$('#hiddenbox').css('display', 'none');
							$(this).css('textDecoration', 'none');
						});
						link.html(priceStr);

						return link;
					}

					var span = $('<span>').append(
						$('<span>').text(time + ': ').css('font-size', '10px')
					);

					i = 0;
					p.forEach(function ($n) {
						span.css('color', '#FFF');
						span.append(flytolink(i, cities[i] + ':' + q[i], 500, i), $('<span>').text(' | '));
						i++;
					});

					span.append(
						$('<a>').attr({
							href: 'prices.php'
						}).text('All Prices').css({
							color: '#FFF',
							fontSize: '10px'
						}).hover(function () {
							$(this).css('textDecoration', 'underline');
						}, function () {
							$(this).css('textDecoration', 'none');
						})
					);

					$('#marquee').html(span);
					setTimeout(buildMarquee, refreshMarquee(new Date().getHours(), new Date().getMinutes()));
				}
			});
		});
	}

	if (IsNewVersion()) {
		$('.top-nav .news').after(
			$('<li>').addClass('pull-left').css({
				width: '40%',
				padding: '0',
				display: 'table',
				lineHeight: '14px'
			}).append(
				$('<div>').attr('id', 'marquee').css({
					display: 'table-cell',
					verticalAlign: 'middle'
				}),
				$('<div>').attr('id', 'hiddenbox').addClass('marqueebox')
			)
		);
	} else {
		$('.menu > ul').append(
			$('<li>').addClass('right').append(
				$('<div>').attr('id', 'marquee').css({
					align: 'center',
					width: '100%',
					paddingTop: '5px'
				}),
				$('<div>').attr('id', 'hiddenbox').addClass('marqueebox')
			)
		);
	}

	buildMarquee();

	var city = getPow('bninfo', 2, -1);
	if (city > 0) {
		city = cities[city - 4];
		$('#' + city).css('font-style', 'italic');
	}
});

/*
 * Menu listener
 */

$('#game_menu').one('DOMNodeInserted', function () {
	if (!IsNewVersion()) {
		// We're too fast, 1 sec delay
		setTimeout(function () {
			// change all users link
			$('a[href*="/allusers.php"]').attr('href', '/allusers.php?start=0&order=lastrank&sort=DESC&dead=HIDE');

			// add beyond menu
			var a = $('<a>').addClass('link').attr({
				'href': '#',
				'data-box': 'true'
			}).append(
				$('<span>').addClass('title').css('background', 'url("' + GM_getResourceURL('favicon') + '") no-repeat scroll left center transparent').text('Beyond'),
				$('<span>').addClass('menu_open')
			);
			var div = $('<div>').addClass('menu').append(
				$('<span>').addClass('menuItem').text('Preferences').click(function () {
					$('#game_container').empty();
					$('#game_container').append(GetPrefPage());
				}),
				$('<span>').addClass('menuItem').text('Live Famstats').click(function () {
					window.open(OB_RIX_WEBSITE + '/stats.php?v=' + v + '&d=n');
				})
			);

			$('a.link:eq(2)').before(a);
			$('a.link:eq(3)').before(div);

		}, 1000);
	}
});

function GetPrefPage() {
	// set location.hash so other code doesn't get triggered
	// window.location.hash = 'OB_preferences';
	// ^ gonna comment this out for a quick .dm patch for new layout

	var setGroupPriority = function () {
		setA('sets', $(this).attr('id'), $(this).val());
	};

	var jailHL = (prefs['jailHL'] ? true : false);
	var jailHL_sel = sets['jailHL_sel'] || 'highest';
	var jailHL_other = sets['jailHL_other'] || 9;
	var jailHL_friends = sets['jailHL_friends'] || 5;
	var jailHL_own_lackey = sets['jailHL_own_lackey'] || 7;
	var jailHL_fr_lackey = sets['jailHL_fr_lackey'] || 8;
	var jailHL_other_lackey = sets['jailHL_other_lackey'] || 11;
	var autoCloseNotificationsSecs = sets['autoCloseNotificationsSecs'] || 0;
	var bo_hotkey = sets['bo_hotkey'] || '/';
	var custom_groups = getV('custom_groups', '').split('|');
	custom_groups.pop();
	var nobust = getV('nobust', '').split(',');
	var af_position = sets['af_position'] || 'floating';
	setA('prefs', 'NR', 1);

	// Build custom groups priority settings
	var c_group_div = null;
	for (var i = 0; i < custom_groups.length; i++) {
		var group_name = custom_groups[i].split(':')[0];
		var group_prio = sets['jailHL_' + group_name] || (i + 12);
		var group_lackey_prio = sets['jailHL_' + group_name + '_lackey'] || (i + 13);
		var jailTr = [
			$('<tr>').append(
				$('<td>').text(group_name),
				$('<td>').append(
					$('<input>').attr({
						id: 'jailHL_' + group_name,
						type: 'text',
						value: group_prio
					}).blur(setGroupPriority)
				)
			),
			$('<tr>').append(
				$('<td>').text(group_name + ' lackeys'),
				$('<td>').append(
					$('<input>').attr({
						id: 'jailHL_' + group_name + '_lackey',
						type: 'text',
						value: group_lackey_prio
					}).blur(setGroupPriority)
				)
			)
		];
		if (c_group_div === null) {
			c_group_div = jailTr;
		} else {
			c_group_div = c_group_div.concat(jailTr);
		}
	}

	function deleteNoBustEntry() {
		var entrySpan = $(this).prev();
		var index = nobust.indexOf(entrySpan.attr('id'));
		nobust.splice(index, 1);
		entrySpan.hide();
		$(this).hide();
		setV('nobust', nobust);
	}
	// Build no bust list
	var nobust_div = $('<div>').attr('id', 'nobust');
	for (var i = 0; i < nobust.length; i++) {
		if (nobust[i].length > 0) {
			nobust_div.append(
				$('<span>').attr({id: nobust[i]}).text(nobust[i]),
				$('<img />').addClass('inboxImg').attr({
					src: GM_getResourceURL('delete'),
					title: 'Delete'
				}).click(deleteNoBustEntry),
				$('<br>')
			);
		}
	}
	nobust_div.append(
		$('<input>').attr({
			id: 'new_nobust',
			type: 'text'
		}),
		$('<button>').text('Add').click(function() {
			// let's not add empty entries
			var newVal = $('#new_nobust').val();
			if (newVal.length > 0) {
				$('<span>').attr({id: newVal}).text(newVal).insertBefore($('#new_nobust'));
				$('<img />').addClass('inboxImg').attr({
					src: GM_getResourceURL('delete'),
					title: 'Delete'
				}).click(deleteNoBustEntry).insertBefore($('#new_nobust'));
				$('<br>').insertBefore($('#new_nobust'));
				nobust.push(newVal);
				setV('nobust', nobust);
				$('#new_nobust').val('');
			}
		})
	);

	var getNotificationItem = function(name, label) {
		return $('<tr>').append(
			$('<td>').text(label),
			$('<td>').css('text-align', 'center').append(
				$('<input>').attr({
					type: 'checkbox',
					checked: prefs[name] ? true : false
				}).click(function () {
					setA('prefs', name, $(this).prop('checked'));
				})
			),
			$('<td>').css('text-align', 'center').append(
				$('<input>').attr({
					type: 'checkbox',
					checked: prefs[name + '_sound'] ? true : false
				}).click(function () {
					setA('prefs', name + '_sound', $(this).prop('checked'));
				})
			)
		);
	};

	var notificationOptions = [
		{ name: 'bmsgDeaths', label: 'Deaths' },
		{ name: 'bmsgNews', label: 'News' },
		{ name: 'notify_bn', label: 'B/N prices changes'},
		{ name: 'notify_crime', label: 'Crime' },
		{ name: 'notify_gta', label: 'Nick a car' },
		{ name: 'notify_travel', label: 'Travel' },
		{ name: 'notify_bullets', label: 'Buy bullets' },
		{ name: 'notify_health', label: 'When losing health' },
		{ name: 'notify_messages', label: 'Receive new message' },
		{ name: 'notify_alerts', label: 'New alerts' },
		{ name: 'notify_bg', label: 'Train BG' },
		{ name: 'notify_highlight', label: 'Name mentioned in chat' }
	];

	var notificationMarkup = $('<table>').addClass('thinline').attr({ cellspacing: 0, cellpading: 2, width: '100%' }).append(
		$('<tr>').append(
			$('<td>').addClass('tableitem').attr('align', 'center').append(
				$('<b>').text('Event')
			),
			$('<td>').addClass('tableitem').attr('align', 'center').append(
				$('<b>').text('Notification')
			),
			$('<td>').addClass('tableitem').attr('align', 'center').append(
				$('<b>').text('Sound')
			)
		),
		notificationOptions.map(function(element) {
			return getNotificationItem(element.name, element.label);
		})
	);

	var chatResizeSettingsMarkup;

	if (document.getElementById('omerta_chat_room') !== null) {
		chatResizeSettingsMarkup = [
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Chat Settings')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').append(
					$('<input>').attr({
						name: 'chat_resize_disabled',
						id: 'chat_resize_disabled',
						type: 'checkbox',
						checked: prefs['chat_resize_disabled']
					}).click(function () {
						setA('prefs', 'chat_resize_disabled', $(this).prop('checked'));
					}),
					$('<label>').css('padding-left', '5px').attr('for', 'chat_resize_disabled').text('Prevent chat window from resizing automatically')
				)
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text('Set chat window size manually:')
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').append(
					$('<input>').attr('type', 'number').css('width', '50px').attr('placeholder', 'width').val(prefs['chat_width']).blur(function() {
						setA('prefs', 'chat_width', $(this).val());
					}),
					$('<span>').text('x'),
					$('<input>').attr('type', 'number').css('width', '50px').attr('placeholder', 'height').val(prefs['chat_height']).blur(function() {
						setA('prefs', 'chat_height', $(this).val());
					})
				)
			)
		];
	}

	var prefs_page = $('<center>').attr({
		id: 'prefsContainer'
	}).append(
		$('<table>').addClass('thinline').attr({ cellspacing: 0, cellpading: 2, width: '90%' }).append(
			$('<tr>').append(
				$('<td>').addClass('tableheader').attr('align', 'center').css('text-align', 'center').append(
					$('<span>').css('font-weight', 'bold').text('OmertaBeyond Preferences')
				)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').css('font-weight', 'normal').text('Version ' + OB_VERSION)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Notifications')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text('OmertaBeyond can send you desktop notifications or play a sound for events like deaths or news posts.').append(
					$('<br>'),
					$('<div>').attr('id', 'Authmsg'),
					$('<button id="btnNotification">').text('Authorize for notifications').click(function () {
						if ('Notification' in window) {
							Notification.requestPermission(function (perm) {
								$('#Authmsg').text('Authorization for notification is: ' + perm);
							});
						}
					}),
					$('<br>'),
					$('<label>').attr('for', 'autoCloseNotificationsSecs').text('Show notifications for X seconds (0 = always show)'),
					$('<input>').attr({
						id: 'autoCloseNotificationsSecs',
						type: 'text',
						value: autoCloseNotificationsSecs
					}).blur(function() {
						setA('sets', 'autoCloseNotificationsSecs', $('#autoCloseNotificationsSecs').val());
					}),
					$('<br>'),
					$('<div>').addClass('notify').append(
						notificationMarkup
					)
				)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Bust Priorities')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text(
					'Here you can choose which groups you want to bust before others.'
				).append(
					$('<br>'),
					$('<input>').attr({
						id: 'jailHL',
						type: 'checkbox',
						checked: jailHL
					}).click(function () {
						setA('prefs', 'jailHL', $('#jailHL:checked').length);
					}),
					$('<label>').attr('for', 'jailHL').text('Enable Bust Priorities'),
					$('<br>'),
					$('<span>').css('font-style', 'italic').text('Lower value means higher priority'),
					$('<table>').css('text-align', 'left').css('margin-left', '30%').append(
						$('<tr>').append(
							$('<td>').text('Other'),
							$('<td>').append(
								$('<input>').attr({
									id: 'jailHL_other',
									type: 'text',
									value: jailHL_other
								}).blur(function () {
									setA('sets', 'jailHL_other', $('#jailHL_other').val());
								})
							)
						),
						$('<tr>').append(
							$('<td>').text('Friends and Family'),
							$('<td>').append(
								$('<input>').attr({
									id: 'jailHL_friends',
									type: 'text',
									value: jailHL_friends
								}).blur(function () {
									setA('sets', 'jailHL_friends', $('#jailHL_friends').val());
								})
							)
						),
						$('<tr>').append(
							$('<td>').text('Own lackeys'),
							$('<td>').append(
								$('<input>').attr({
									id: 'jailHL_own_lackey',
									type: 'text',
									value: jailHL_own_lackey
								}).blur(function () {
									setA('sets', 'jailHL_own_lackey', $('#jailHL_own_lackey').val());
								})
							)
						),
						$('<tr>').append(
							$('<td>').text('Friend/Family lackeys'),
							$('<td>').append(
								$('<input>').attr({
									id: 'jailHL_fr_lackey',
									type: 'text',
									value: jailHL_fr_lackey
								}).blur(function () {
									setA('sets', 'jailHL_fr_lackey', $('#jailHL_fr_lackey').val());
								})
							)
						),
						$('<tr>').append(
							$('<td>').text('Other lackeys'),
							$('<td>').append(
								$('<input>').attr({
									id: 'jailHL_other_lackey',
									type: 'text',
									value: jailHL_other_lackey
								}).blur(function () {
									setA('sets', 'jailHL_other_lackey', $('#jailHL_other_lackey').val());
								})
							)
						),
						c_group_div,
						$('<tr>').append(
							$('<td>')
						),
						$('<tr>').append(
							$('<td>').text('Buyout hotkey'),
							$('<td>').append(
								$('<input>').attr({
									id: 'bo_hotkey',
									type: 'text',
									value: bo_hotkey
								}).blur(function () {
									setA('sets', 'bo_hotkey', $('#bo_hotkey').val());
									$('.ob_hotkey_pref').text($('#bo_hotkey').val());
								})
							)
						)
					),
					$('<p>').html('Depending on browser and operating system, you can use either Alt + Shift + <span class="ob_hotkey_pref">' + bo_hotkey + '</span>, Alt + <span class="ob_hotkey_pref">' + bo_hotkey + '</span> or Ctrl + Alt + <span class="ob_hotkey_pref">' + bo_hotkey + '</span> to buy yourself out.'),
					$('<span>').text('Do you want to choose players with highest/lowest remaining jailtime first, or pick one randomly?'),
					$('<br>'),
					$('<div>').addClass('notify').append(
						$('<input>').attr({
							name: 'jailHL_sel',
							id: 'jailHL_high',
							type: 'radio',
							checked: (jailHL_sel == 'highest' ? true : false)
						}).click(function () {
							setA('sets', 'jailHL_sel', 'highest');
						}),
						$('<span>').append(
							$('<label>').attr('for', 'jailHL_high').text('highest')
						),
						$('<br>'),
						$('<input>').attr({
							name: 'jailHL_sel',
							id: 'jailHL_low',
							type: 'radio',
							checked: (jailHL_sel == 'lowest' ? true : false)
						}).click(function () {
							setA('sets', 'jailHL_sel', 'lowest');
						}),
						$('<span>').append(
							$('<label>').attr('for', 'jailHL_low').text('lowest')
						),
						$('<br>'),
						$('<input>').attr({
							name: 'jailHL_sel',
							id: 'jailHL_rand',
							type: 'radio',
							checked: (jailHL_sel == 'random' ? true : false)
						}).click(function () {
							setA('sets', 'jailHL_sel', 'random');
						}),
						$('<span>').append(
							$('<label>').attr('for', 'jailHL_rand').text('random')
						)
					)
				)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Scumbag List')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text(
					'There is this one scumbag you wouldn\'t want to bust even if their life depended on it? Just add them here!'
				).append(
					$('<br>'),
					nobust_div,
					$('<span>').text('You can add family names too, by the way.')
				)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Best Run Calculator - Autofiller')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text(
					'Settings for the Best Run Calculator are visible on the Smuggling page'
				).append(
					$('<br>'),
					$('<br>'),
					$('<span>').text('You can choose between a movable window or showing the options on top of the page.'),
					$('<br>'),
					$('<div>').addClass('notify').append(
						$('<input>').attr({
							type: 'radio',
							id: 'AF_Floating',
							name: 'AF_Position',
							checked: af_position == 'floating'
						}).click(function() {
							setA('sets', 'af_position', 'floating');
						}),
						$('<label>').attr({ for: 'AF_Floating' }).text('Show settings in movable window'),
						$('<br>'),
						$('<input>').attr({
							type: 'radio',
							id: 'AF_Static',
							name: 'AF_Position',
							checked: af_position == 'static'
						}).click(function() {
							setA('sets', 'af_position', 'static');
						}),
						$('<label>').attr({ for: 'AF_Static' }).text('Show settings on top of the page')
					),
					$('<br>'),
					$('<br>'),
					$('<span>').text('If the movable window is gone, click here to reset its position.'),
					$('<br>'),
					$('<button>').text('Clear').click(function () {
						if (confirm('Are you sure?')) {
							setV('AFtop', '225');
							setV('AFleft', '300');
						}
					})

				)
			),
			chatResizeSettingsMarkup,
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Reset data')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text(
					'Manually reset all saved OB data.'
				).append(
					$('<br>'),
					$('<span>').text('Click the button to clear all settings, WARNING this resets all OB data'),
					$('<br>'),
					$('<button>').text('Clear').click(function () {
						if (confirm('Are you sure you want to clear ALL OB data?')) {
							localStorage.clear();
							alert('Please reload Omerta for the changes to take effect.');
						}
					})
				)
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').addClass('tableitem').attr('align', 'center').css('text-align', 'center').text('Report a Bug')
			),
			$('<tr>').append(
				$('<td>').attr({ height: '1', bgcolor: 'black' })
			),
			$('<tr>').append(
				$('<td>').attr('align', 'center').css('text-align', 'center').text(
					'Please report any bugs you might encounter on IRC in #beyond or post a comment '
				).append(
					$('<a>').text('here.').css('text-decoration', 'underline').click(function() {
						window.open('https://omertabeyond.net/');
					}),
					$('<br>'),
					$('<span>').html('To help us track down the issue, please include the following code:'),
					$('<br>'),
					$('<strong>').text(localStorage.getItem('ob_uid'))
				)
			)
		)
	); // here we can build prefs page

	if (!('Notification' in window)) {
		$('#Authmsg', prefs_page).text('Your browser doesn\'t support notifications');
		$('#btnNotification', prefs_page).remove();
	} else if (Notification.permission == 'granted') {
		$('#Authmsg', prefs_page).text('Authorization for notification is: ').append(
			$('<span>').text('granted').css({
				'font-weight': 'bold'
			})
		);
		$('#btnNotification', prefs_page).remove();
	}

	return prefs_page;
}

/*
 * Info grabber
 */

var infoD = new Date(); // check once every hour for new info
if (getV('bninfo', -1) == -1 || getV('brcDate', -1) != infoD.getHours()) {
	if (IsNewVersion()) {
		// Update shizzle
		bnUpdate(0);
		var nick = unsafeWindow.omerta.character.info.name();
		$.get('/user.php?nick=' + nick, function (data) {
			var a = data.split('<script');
			$('#game_wrapper').append(
				$('<div>').css('display', 'none').attr('id', 'xhr').html(a[0])
			);
			if ($('#xhr').length) {
				var role = 1; // default is in a family
				var pos = $('span#position').attr('value');
				var fam = ($('span#family > a').length ? $('span#family > a').text() : $('span#family').text());
				var hascapo = ($('span#capo').length) ? 1 : 0;
				if (/None|Geen/.test(fam)) {
					role = 0;
				} else {
					if (/Capo (of|van):/.test(pos)) {
						role = 2;
					}
					if (/(Sottocapo|Consiglieri|Don) (of|van):/.test(pos)) {
						role = 3;
					}
					if (hascapo) {
						role = 4;
					}
				}
				setV('family', fam);
				setPow('bninfo', 4, role); // save
			}
			setV('brcDate', infoD.getHours());
			$('#xhr').remove();
			$('#str2dom').remove();
		});
	} else {
		$.get('/information.php', function (data) {
			var a = data.split('<tbody');
			if (a[2]) { // fails on click limit or other error
				$('#game_wrapper').append(
					$('<div>').css('display', 'none').attr('id', 'str2dom').html(data)
				);
				bnUpdate(0); // call update function
				$.get('/user.php?nick=' + getV('nick', ''), function (data) {
					var a = data.split('<script');
					$('#game_wrapper').append(
						$('<div>').css('display', 'none').attr('id', 'xhr').html(a[1])
					);
					if ($('#xhr').length) {
						var role = 1; // default is in a family
						var pos = $('span#position').attr('value');
						var fam = ($('span#family > a').length ? $('span#family > a').text() : $('span#family').text());
						var hascapo = ($('span#capo').length) ? 1 : 0;
						if (/None|Geen/.test(fam)) {
							role = 0;
						} else {
							if (/Capo (of|van):/.test(pos)) {
								role = 2;
							}
							if (/(Sottocapo|Consiglieri|Don) (of|van):/.test(pos)) {
								role = 3;
							}
							if (hascapo) {
								role = 4;
							}
						}
						setV('family', fam);
						setPow('bninfo', 4, role); // save
					}
					setV('brcDate', infoD.getHours());
					$('#xhr').remove();
					$('#str2dom').remove();
				});
			}
		});
	}
}

// Reset on death
if (window.location.search.indexOf('action=omertician') != -1 || (window.location.search.indexOf('module=Account') != -1 && $('#table_accounts button[onclick*="module=Account&action=open"]').length === 0)) {
	if (confirm('Do you want to reset all OB data?')) {
		localStorage.clear();
	}
}

// Add focus on front page
$('input[name="email"]').focus();

// Replace Omerta's favicon
$('<link rel="shortcut icon" type="image/x-icon"/>').appendTo('head').attr('href', 'https://raw.githubusercontent.com/OmertaBeyond/OBv2/master/images/favicon.png');

/*
 * Logos replacing
 */

// Main logo in the game
$('#game_header_left').children('img').attr('src', GM_getResourceURL('logo'));
if (v === 'dm') {
	$('#omerta_header #logo').css({
		'background-image': 'url(' + GM_getResourceURL('logo') + ')',
		'top': '2px',
		'left': '0px',
		'width': '549px',
		'height': '104px'
	});
}
// Logo on homepage
$('img[src*="omerta-game-logo.gif"]').attr('src', GM_getResourceURL('logo-old'));
$('img[src*="pic_bg-logo.png"]').attr('src', GM_getResourceURL('logo-old'));
// Logo on /servers.php
$('img[src*="logo0.gif"]').attr('src', GM_getResourceURL('logo-old'));

GM_addStyle(GM_getResourceText('css'));

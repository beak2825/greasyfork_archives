// ==UserScript==
// @name         Lbast accessibilizer
// @name:ru-RU   Lbast accessibilizer
// @namespace    https://greasyfork.org/ru/users/672358-futyn
// @version      2021.09.26
// @description  Повышает эффективность управления онлайн-игрой "Последний бастион" (http://lbast.ru) при помощи клавиатуры, а также добавляет звуковую индикацию некоторых событий
// @description:ru-RU   Повышает эффективность управления онлайн-игрой "Последний бастион" (http://lbast.ru) при помощи клавиатуры, а также добавляет звуковую индикацию некоторых событий
// @author       Agent_
// @include        *lbast.ru*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @compatible chrome
// @compatible firefox
// @compatible opera
// @downloadURL https://update.greasyfork.org/scripts/408433/Lbast%20accessibilizer.user.js
// @updateURL https://update.greasyfork.org/scripts/408433/Lbast%20accessibilizer.meta.js
// ==/UserScript==

var str = $("body").text();
var xhr = new XMLHttpRequest();
var link = null;

function click(text) {
	$("a:contains('" + text + "')")[0].click();
}

function playSound(url) {
	var myAudio = document.createElement('audio');
	myAudio.src = url;
	myAudio.play();
}

function getLink(text) {
	xhr.open('GET', $("a:contains('" + text + "')")[0].href, false);
	xhr.send();
	link = document.createElement('html');
	link.innerHTML = xhr.responseText;
}

function getLinkHref(url) {
	xhr.open('GET', url, false);
	xhr.send();
	link = document.createElement('html');
	link.innerHTML = xhr.responseText;
}

if(~location.href.indexOf('arena_go')) {
	if(~str.indexOf('Сбр.пары')) {
		if(sessionStorage.played != 'true') {
			playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/beep.mp3');
			sessionStorage.played = 'true';
		}
	} else {
		sessionStorage.played = 'false';
	}
	if(~str.indexOf('Пары сброшены')) {
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/clear.mp3');
	}
	if(~str.indexOf('Вы уже бросали пары')) {
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/notclear.mp3');
	}
	if((~location.href.indexOf('otravleniya') || ~location.href.indexOf('oslableniya')) && ~str.indexOf('использует эль о')) {
		var success = str.substring(0, str.indexOf('использует эль о'));
		if(~success.indexOf('неудачно')) {
			playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/fail.mp3');
		} else {
			playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/success.mp3');
		}
	}
	Mousetrap.bind('alt+\\', function() {
		click('Сбр.пары');
	});
	Mousetrap.bind('alt+r', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction_elreg';
	});
	Mousetrap.bind('alt+j', function() {
		location.href = location.origin + '/arena_go.php?r=6074&mod=invaction_el_otravleniya';
	});
	Mousetrap.bind('alt+l', function() {
		location.href = location.origin + '/arena_go.php?r=1602&mod=invaction_bul';
	});
	Mousetrap.bind('alt+b', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction_porkaps';
	});
	Mousetrap.bind('alt+o', function() {
		location.href = location.origin + '/arena_go.php?r=5773&mod=invaction_ul_porkaps';
	});
	Mousetrap.bind('alt+k', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction_el_oslableniya';
	});
	Mousetrap.bind('alt+u', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction_drsvitokmaga';
	});
	Mousetrap.bind('alt+p', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction_minotavrrog';
	});
	Mousetrap.bind('alt+1', function() {
		getLink('Пояс');
		location.href = $("a:contains('Свиток')", link)[0].href;
	});
	Mousetrap.bind('alt+2', function() {
		getLink('Пояс');
		for(var url of $("a:contains('ликсир')", link)) {
			if(!~url.href.indexOf('zapoyasom=1065')) {
				location.href = url.href;
			}
		}
	});
	Mousetrap.bind('alt+3', function() {
		location.href = location.origin + '/arena_go.php?r=1613&poyas=1&zapoyasom=1065';
	});
	Mousetrap.bind('alt+i', function() {
		location.href = location.origin + '/arena_go.php?r=3238&mod=invaction';
	});
	Mousetrap.bind('alt+a', function() {
		location.href = location.origin + '/arena_go.php?r=1282&poyas=1';
	});
	Mousetrap.bind('alt+m', function() {
		location.href = location.origin + '/arena_go.php?r=7722&mod=magic';
	});
}
if(!~location.href.indexOf('arena_go')) {
	if(sessionStorage.played != undefined) {
		sessionStorage.removeItem('played');
	}
	Mousetrap.bind('ctrl+alt+r', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1037&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
	Mousetrap.bind('ctrl+alt+f', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1030&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
	Mousetrap.bind('ctrl+alt+b', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1043&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
	Mousetrap.bind('ctrl+alt+k', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1054&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
	Mousetrap.bind('ctrl+alt+v', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1055&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
	Mousetrap.bind('ctrl+alt+s', function() {
		getLinkHref(location.origin + '/inv.php?r=9899&pnum=15&invMod=6&item=1107&lgn=');
		open($("A:contains('Использовать')", link)[0].href);
	});
}
if(~location.href.indexOf('location.php')) {
	Mousetrap.bind('up', function() {
		getLinkHref($("a:contains('север')")[0].href);
		document.body.innerHTML = link.getElementsByTagName('body')[0].innerHTML;
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/north.mp3');
	});
	Mousetrap.bind('down', function() {
		getLinkHref($("a:contains('юг')")[0].href);
		document.body.innerHTML = link.getElementsByTagName('body')[0].innerHTML;
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/south.mp3');
	});
	Mousetrap.bind('left', function() {
		getLinkHref($("a:contains('запад')")[0].href);
		document.body.innerHTML = link.getElementsByTagName('body')[0].innerHTML;
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/west.mp3');
	});
	Mousetrap.bind('right', function() {
		getLinkHref($("a:contains('восток')")[0].href);
		document.body.innerHTML = link.getElementsByTagName('body')[0].innerHTML;
		playSound('https://raw.githubusercontent.com/Futyn-Maker/Lbast-Accessibilizer/main/sounds/east.mp3');
	});
}
if(~location.href.indexOf('mod=bojview')) {
	Mousetrap.bind('alt+[', function() {
		getLink('Вмешаться');
		link.innerHTML = link.innerHTML.substring(0, link.innerHTML.indexOf('<center>'));
		xhr.open('GET', $("a:contains('напасть')", link)[0].href, false);
		xhr.send();
		if(~xhr.responseText.indexOf('Вы напали')) {
			location.href = location.origin + '/arena_go.php';
		}
	});
	Mousetrap.bind('alt+]', function() {
		getLink('Вмешаться');
		link.innerHTML = link.innerHTML.substring(link.innerHTML.indexOf('<center>'));
		xhr.open('GET', $("a:contains('напасть')", link)[0].href, false);
		xhr.send();
		if(~xhr.responseText.indexOf('Вы напали')) {
			location.href = location.origin + '/arena_go.php';
		}
	});
}
if(~location.href.indexOf('forum.php') && !~location.href.indexOf('mod=')) {
	document.getElementsByName('cat')[0].removeAttribute('onchange');
}
if(~location.href.indexOf('obj=12') && ~str.indexOf('Магическая гильдия')) {
	for (var i = 2; i <= 6; i++) {
		document.getElementsByTagName('b')[i].setAttribute('role', 'heading');
	}
}
// ==UserScript==
// @name			Time Karma
// @namespace		using namespace std;
// @description		На странице информации персонажа показывает динамический счетчик времени до возможности поставить карму.
// @include			http://www.ganjawars.ru/info.php?id=*
// @include			http://www.ganjawars.ru/info.vote.php?id=*
// @license			MIT
// @version			1.1
// @author			MyRequiem
// @downloadURL https://update.greasyfork.org/scripts/33743/Time%20Karma.user.js
// @updateURL https://update.greasyfork.org/scripts/33743/Time%20Karma.meta.js
// ==/UserScript==

(function() {
//-----------------------------------------------------------------------------
	function formatTime(time) {
		var min = Math.floor(time / 60);
		var sec = time % 60;

		if (min == 0 && sec == 0) {
			span1.innerHTML = '&nbsp';
			span2.innerHTML = '';
			setData('0');
			return;
		}

		min = min < 10 ? '0' + min : min;
		sec = sec < 10 ? '0' + sec : sec;
		span2.innerHTML = min + ':' + sec;
		root.setTimeout(function() {formatTime(--time);}, 1000);
	}
//-----------------------------------------------------------------------------
	function setData(value) {st.setItem('time_karma_' + myID, value);}
//-----------------------------------------------------------------------------
	function getData() {return +st.getItem('time_karma_' + myID);}
//-----------------------------------------------------------------------------
	var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (root.self != root.top) return;
	var doc = root.document;
	var myID = doc.cookie.match('(^|;) ?uid=([^;]*)(;|$)')[2];
	var st = root.localStorage;

	if (!st) {
		alert('Ваш браузер не поддерживает технологию localStorage.\n'+
			'MyRequiеm рекомендует вам скачать и установить один из\n'+
			'ниже перечисленных браузеров или удалите скрипт\n'+
			'Time Karma:\n\nFireFox 4+\nOpera 11+\nChrome 12+');
		return;
	}

	if (!getData()) setData('0');

	//поставили карму, запоминаем время
	if (/vote/.test(root.location.href) && /Спасибо, Ваше мнение учтено/.test(doc.body.innerHTML)) {
		setData(new Date().getTime());
		return;
	}

	var time = getData();
	if (!time) return;

	var a = doc.getElementsByTagName('a');
	for (var i = 0; i < a.length; i++) {
		if (/info\.vote\.php\?id=\d+&vote=/.test(a[i].href) && /Отправить Ваш голос/.test(a[i].getAttribute('title'))) {
			setData('0');
			return;
		}
	}

	var now = new Date().getTime();
	//сколько прошло
	var difference = now - time;

	//если уже прошло 30 мин
	if (difference > 1800000) {
		setData('0');
		return;
	}

	var span1 = doc.createElement('span');
	span1.setAttribute('style', 'margin-left: 5px; color: #07A703;');
	span1.innerHTML = '» Вы сможете выставить карму через ';

	var span2 = doc.createElement('span');
	span2.setAttribute('style', 'color: #056802;');

	for (i = 0; i < a.length; i++) {
		if (/sms\-create\.php\?mailto=/.test(a[i].href)) {
			var target = a[i].parentNode.parentNode.parentNode.parentNode.parentNode;
			break;
		}
	}

	target.parentNode.removeChild(target.nextElementSibling);
	target.parentNode.insertBefore(span2, target.nextElementSibling);
	target.parentNode.insertBefore(span1, target.nextElementSibling);

	formatTime(((1800000 - difference) / 1000).toFixed(0));

}());

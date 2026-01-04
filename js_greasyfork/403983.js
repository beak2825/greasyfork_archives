// ==UserScript==
// @name        HWM_Tavern_AutoAccept_BlackList_Notification
// @author      emptimd
// @namespace   emptimd
// @description Скрипт для таверны, автоматически отклоняет людей что в черном списке / принимает игру либо воспроизводит оповещения об вступлении в заявку.
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com)\/(tavern.php)/
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403983/HWM_Tavern_AutoAccept_BlackList_Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/403983/HWM_Tavern_AutoAccept_BlackList_Notification.meta.js
// ==/UserScript==

/*
Variables
*/

// nicknames that the script will auto deny. To add a new nickname, place it inside quotes. '',
const blackList = [];

const autoAccept = 0; // 1 if should auto accept new games from players.
const soundAlert = 0; // 1 if should make a sound alert when some player made a request/script accepted request.
const maxTavernBallance = 500000; // if player has a bigger tavern balance then he will be skipped

/*
Code
*/

// sound alarm
function beep(vol, freq, duration) {
	var a=new AudioContext();
	var v=a.createOscillator()
	var u=a.createGain()
	v.connect(u)
	v.frequency.value=freq
	v.type="square"
	u.connect(a.destination)
	u.gain.value=vol*0.01
	v.start(a.currentTime)
	v.stop(a.currentTime+duration*0.001)
}

function make_alarm() {
	if(document.visibilityState === 'hidden') {
		beep(3, 300, 300);//first number stands for sound volume
	}
}

let a = document.querySelector('a[href^="acard_game.php"]');

if(!a) {
	delete localStorage['tavernRequestHtml'];
	throw new Error();
}

// check nickname
let nickname = a.previousSibling.previousSibling.childNodes[0].text;

if(blackList.includes(nickname)) {
	// deny
    window.open(a.nextElementSibling.href,'_self');
}else {
	//auto accept.
	if (autoAccept) window.open(a.href,'_self');
	else get_table();
}


function get_table() {
	// get html from localstorage
	if (localStorage['tavernRequestHtml']) return show_tables(localStorage['tavernRequestHtml']);

	// or make an ajax call to player profile to get html taver balance
	var href = a.previousSibling.previousSibling.childNodes[0].href;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", href, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
	xhr.send();
	xhr.onreadystatechange = function() { process_xhr(xhr); }
}

function process_xhr(xhr) {
	if (xhr.readyState != 4) return;

	if (xhr.status == 200) {
		var _perk_ = "<";
		var text = xhr.responseText.split('table');
		for(var i=1; i<text.length; i++){
		  if(text[i].indexOf('&nbsp;&nbsp;Всего&nbsp;игр:') > -1){
		    _perk_ += "table" + text[i] + "table" + text[i+1] + "table" + text[i+2] + "table" + text[i+3];
		  }
		}
		_perk_ += "table>";
		show_tables(_perk_);
	}
}

function show_tables(html) {
	var elements = htmlToElements(html);
	var docFragment = elementsToDocFragment(elements);
	//a.parentElement.parentElement.appendChild(docFragment);

	//make parent table relative
	a.parentElement.parentElement.parentElement.parentElement.style.position = 'relative';
	var element = a.parentElement.parentElement;
	element.parentNode.insertBefore(docFragment, element.nextSibling);
	element.nextElementSibling.style.backgroundColor = '#fff';
	element.nextElementSibling.style.position = 'absolute';
	element.nextElementSibling.style.top = '18px';
	element.nextElementSibling.style.left = '270px';

	var balance = getBalance(element.nextElementSibling.firstChild.childNodes);
	balance = parseInt(balance.replace(/,/g, ""), 10);

	// if big balance then skip
	if (balance > maxTavernBallance) window.open(a.nextElementSibling.href,'_self');

	//sound alert.
	if (soundAlert) make_alarm();

	// finnaly add html to localStorage to prevent multiple ajax requests.
	if (!localStorage['tavernRequestHtml']) localStorage['tavernRequestHtml'] = html;
}


/*Helpers*/
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function elementsToDocFragment(elements) {
	var docFrag = document.createDocumentFragment();
	for(var i = 0; i < elements.length; i++) {
	  docFrag.appendChild(elements[i]); // Note that this does NOT go to the DOM
	}
	return docFrag;
}

function getBalance(tavern_parent) {
        var text_bal = '  Баланс:';
        tavern_parent[0].childNodes[0].setAttribute('style', 'white-space: nowrap;');
        tavern_parent[1].childNodes[1].setAttribute('style', 'white-space: nowrap;');
        tavern_parent[2].childNodes[1].setAttribute('style', 'white-space: nowrap;');
        var tavern_0bal = tavern_parent[1].querySelector("tr");
        var tavern_1bal = tavern_parent[2].querySelector("tr");
        if ( !tavern_0bal && !tavern_1bal ) return;
        if ( tavern_0bal ) {
            tavern_0bal.childNodes[1].setAttribute('style', 'text-align: right; padding-right: 5px;');
            tavern_0bal = tavern_0bal.childNodes[1].innerHTML.replace(/,/g, "");
            tavern_parent[1].childNodes[3].firstChild.width = "100%";
            add_el = tavern_parent[1].cloneNode(true);
        } else { tavern_0bal = 0; }
        if ( tavern_1bal ) {
            tavern_1bal.childNodes[1].setAttribute('style', 'text-align: right; padding-right: 5px;');
            tavern_1bal = tavern_1bal.childNodes[1].innerHTML.replace(/,/g, "");
            tavern_parent[2].childNodes[3].firstChild.width = "100%";
            add_el = tavern_parent[2].cloneNode(true);
        } else { tavern_1bal = 0; }
        var tavern_bal = digit(tavern_0bal - tavern_1bal);
        add_el.firstChild.innerHTML = text_bal;
        add_el.childNodes[1].innerHTML = "";
        add_el.childNodes[2].innerHTML = " ";
        add_el.childNodes[3].innerHTML = '<table border="0" cellspacing="0" cellpadding="0" width="100%"><tbody><tr><td><img width="24" height="24" src="https://dcdn3.heroeswm.ru/i/gold.gif" border="0" title="Золото" alt=""></td><td style="text-align: right; padding-right: 5px;">454,000</td></tr></tbody></table>';
        add_el.querySelector("tr").childNodes[1].innerHTML = tavern_bal;
        tavern_parent[2].parentNode.insertBefore(add_el, tavern_parent[2].nextSibling);

        return tavern_bal;
}

function digit(value) {
    return value.toString().replace(/(?=\B(?:\d{3})+(?!\d))/g, ',');
}
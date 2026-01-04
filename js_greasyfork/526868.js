// ==UserScript==
// @name           LTScriptPack
// @description    Пак скриптов для ЛТ
// @namespace      linux.org.ru
// @include        http://linuxtalks.co/*
// @include        https://linuxtalks.co/*
// @author         damix9
// @license        MIT
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/526868/LTScriptPack.user.js
// @updateURL https://update.greasyfork.org/scripts/526868/LTScriptPack.meta.js
// ==/UserScript==

/*
MIT License
 
Copyright (c) 2024 damix9
Copyright (c) 2022 OpenA
Copyright (c) 2007-2009 Steven Levithan <stevenlevithan.com>
Copyright (с) 2013 Oleksandr Natalenko aka post-factum
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Настройки
const NEW_TO_OLD_SEARCH_BY_DEFAULT = true;
const HIDE_NEWS_AND_GALLERY = false;
const ADD_TAGS_AND_DOCS = true;
const TECH_ONLY_BY_DEFAULT = false;
const HIDE_STARS = true;


// Глобальные константы и переменные
const parser = new DOMParser();
const formats = ['jpeg', 'jpg', 'png', 'webp', 'tif', 'tiff'];
let CommentForm = null;
let tagListWrapper = null;
let divPopup = null; let timer = null;

// Функции

function _setup(el, attrs, events) {

	if (!el)
		return '';

	switch (typeof el) {
		case 'string':
			el = document.createElement(el);
		case 'object':
			for (const key in attrs) {
				attrs[key] === undefined ? el.removeAttribute(key) :
				key === 'html' ? el.innerHTML   = attrs[key] :
				key === 'text' ? el.textContent = attrs[key] :
				key in el    && (el[key]        = attrs[key] ) == attrs[key]
							 &&  el[key]       == attrs[key] || el.setAttribute(key, attrs[key]);
			}
			for (const name in events) {
				if (!events[name])
					continue;
				if (Array.isArray(events[name]))
					events[name].forEach(handler => el.addEventListener(name, handler, false));
				else
					el.addEventListener(name, events[name], false);
			}
	}
	return el;
}

// Возвращает расширение файла, находящегося по адресу url
function _getUrlExt(url) {
  	let oURL = new URL(url);
  	let path = oURL.pathname;
    return path.split('.').pop().toLowerCase();
}

// Возвращает название темы, выбранной в настройках
function getCurrentTheme() {
    let firstLinkNode = document.head.querySelector('link');
    let cssUrl = new URL(firstLinkNode.href);
    return cssUrl.pathname.split('/')[1]
}

// Добавляет CSS к странице
function addCss(sheet) {
  var head = document.head;
  let style = _setup('style', { text: sheet });
  head.appendChild(style);
}

function strContains(str, phrase) {
	return str.indexOf(phrase) !== -1;
}

// В течение 3 секунд показывает всплывающее уведомление с текстом text
function popup(text) {
    clearTimeout(timer);
    divPopup.innerHTML = text;
    divPopup.style.visibility = 'visible';
    divPopup.classList.add('shown');
    timer = setTimeout(() => {
        divPopup.classList.remove('shown');
        timer = setTimeout(() => {
            divPopup.style.visibility = 'hidden';
        }, 1000)
    }, 3000)
}

//******************************************************************************************
//
// A CGI program uses the following syntax to add cookie information to the HTTP header:
// 
// Set-Cookie:   name=value   
// [;EXPIRES=dateValue]   
// [;DOMAIN=domainName]   
// [;PATH=pathName]   
// [;SECURE]
//
// This function sets a client-side cookie as above.  Only first 2 parameters are required
// Rest of the parameters are optional. If no szExpires value is set, cookie is a session cookie.
//
// Prototype : setCookie(szName, szValue [,szExpires] [,szPath] [,szDomain] [,bSecure])
//******************************************************************************************


function setCookie(szName, szValue, szExpires, szPath, szDomain, bSecure)
{
 	var szCookieText = 	   escape(szName) + '=' + escape(szValue);
	szCookieText +=	 	   (szExpires ? '; EXPIRES=' + szExpires.toGMTString() : '');
	szCookieText += 	   (szPath ? '; PATH=' + szPath : '');
	szCookieText += 	   (szDomain ? '; DOMAIN=' + szDomain : '');
	szCookieText += 	   (bSecure ? '; SECURE' : '');
	
	document.cookie = szCookieText;
}

//******************************************************************************************
// This functions reads & returns the cookie value of the specified cookie (by cookie name) 
//
// Prototype : getCookie(szName)
//******************************************************************************************

function getCookie(szName)
{
 	var szValue =	  null;
	if(document.cookie)	   //only if exists
	{
       	var arr = 		  document.cookie.split((escape(szName) + '=')); 
       	if(2 <= arr.length)
       	{
           	var arr2 = 	   arr[1].split(';');
       		szValue  = 	   unescape(arr2[0]);
       	}
	}
	return szValue;
}

//******************************************************************************************
// To delete a cookie, pass name of the cookie to be deleted
//
// Prototype : deleteCookie(szName)
//******************************************************************************************

function deleteCookie(szName)
{
 	var tmp = 	  			 	 getCookie(szName);
	if(tmp) 
	{ setCookie(szName,tmp,(new Date(1))); }
}

// Добавляет к форме отправке сообщения кнопки для редактирования разметки, делает поле ввода сообщения широким
function handleCommentForm(form) {
    const TEXT_AREA    = form.elements.msg, TITLE_AREA = form.elements.title || { value: '' };
	const MARKUP_PANEL = _setup('div', { id: 'markup-panel', class: 'lorcode'});

	for (let attrs of [
		{ lorcode: 'b'  , title: 'Жирный' },
		{ lorcode: 'i'  , title: 'Курсив' },
		{ lorcode: 'u'  , title: 'Подчеркнутый' },
		{ lorcode: 's'  , title: 'Зачеркнутый' },
		{ lorcode: 'em' , title: 'Курсив выделения' },
        { lorcode: 'strong' , title: 'Жирный выделения' },
        { lorcode: 'url' , title: 'Ссылка' },
    { lorcode: 'img', title: 'Картинка' },
		{ lorcode: 'list' , title: 'Список' },
		{ lorcode: 'list' , title: 'Нумерованный список', attr: '1' },
        { lorcode: '*'    , title: 'Элемент списка' },
		{ lorcode: 'pre'   , title: 'Преформатированный текст' },
        { lorcode: 'br'    , title: 'С новой строки' },
		{ lorcode: 'code'  , title: 'Код' },
		{ lorcode: 'code'  , title: 'Bash', attr: 'bash' },
		{ lorcode: 'code'  , title: 'HTML', attr: 'html' },
		{ lorcode: 'code'  , title: 'CSS', attr: 'css' },
		{ lorcode: 'code'  , title: 'JavaScript', attr: 'js' },
		{ lorcode: 'code'  , title: 'PHP', attr: 'php' },
		{ lorcode: 'code'  , title: 'SQL', attr: 'sql' },
		{ lorcode: 'code'  , title: 'Си', attr: 'c' },
		{ lorcode: 'code'  , title: 'C++', attr: 'cpp' },
		{ lorcode: 'code'  , title: 'Java', attr: 'java' },
        { lorcode: 'inline', title: 'Код в той же строке' },
		{ lorcode: 'user'  , title: 'Ник пользователя' },
        { lorcode: 'quote' , title: 'Цитата' }
	]) {
		attrs.type  = 'button';
        attrs.id = 'btn-' + attrs.lorcode.toLowerCase();
		attrs.class = 'btn btn-default';
        let label  = _setup('span', { text: attrs.lorcode });
        if (attrs.attr) {
            let a = attrs.attr.toLowerCase();
            attrs.id += `-${a}`;
            label.innerHTML += `=${a}`
        }
        let button = _setup('button', attrs);
        button.appendChild(label);
		MARKUP_PANEL.append(button)
	}
    
    lorcodeMarkup = lorcodeMarkup.bind(TEXT_AREA);

    for (let i = 0; i < MARKUP_PANEL.childNodes.length; i++) {
        let btn = MARKUP_PANEL.childNodes[i];
        btn.addEventListener('click', function(e) {
    		e.preventDefault();
    		const tag  = this.getAttribute('lorcode');
            const attr = this.getAttribute('attr');
            lorcodeMarkup(tag, attr)
    	});
    }
    TEXT_AREA.parentNode.firstElementChild.after(MARKUP_PANEL);
    TEXT_AREA.style = "width: 70em; height: 10em;"
}

// Пишет в поле ввода сообщения текст str, туда, где стоял курсор,
// Ставит курсор в конец добавленного текста и выделяет поле ввода
function injectText(str) {
    const txtArea = CommentForm.elements.msg;
    
    let val = txtArea.value,
        len = txtArea.value.length,
      start = txtArea.selectionStart,
        end = txtArea.selectionEnd;
        
    txtArea.value = val.substring(0, start) + str + val.substring(end);
    
    txtArea.selectionStart = txtArea.selectionEnd = start + str.length;
    
    txtArea.focus()
}

// Берет выделенный текст в указанный тег с указанным аттрибутом
// Если тег br или * то ставит их еще и в начале каждой строки выделенного текста
// Всегда вызывать bind() или call(), передав в них textarea, в которой надо делать разметку
function lorcodeMarkup(tag, attr) {
    const val = this.value,
	      end = this.selectionEnd,
	    start = this.selectionStart,
	    collp = start === end;

	let mtext = '', open = '', close = '', 
        soff = 0, eoff = 0;
        
    mtext = val.substring(start, end);
    
    switch (tag) {
        case 'br':
            if (!collp)
                mtext = mtext.replace(/\n/gm, '\n'+'[br]');
            else 
                open = '[br]';
            break;
        case '*':
            open = '[*]';
            if (!collp)
                mtext = mtext.replace(/\[\/?\*\]/g, '').replace(/\n/gm, '\n'+'[*]');
            break;
        case 'url':
            let uri = prompt('Введите адрес ссылки');
            if (uri) {
                open = `[url=${uri}]`;
                close = '[/url]';
            }
            else {
                return;
            }
            break;
        default:
            open = attr ? `[${tag}=${attr}]` : `[${tag}]`;
            close = `[/${tag}]`;
    }
    
    soff = open.length; eoff = open.length + mtext.length;
    
    this.value = val.substring(0, start) + open + mtext + close + val.substring(end);
    this.focus();
    this.setSelectionRange(start + soff, start + eoff);
    this.dispatchEvent(new InputEvent('input', { bubbles: true }))
}

// Отправлет сообщение с текстом msg в тему c id topic
function sendMessageToTopic(topic, msg) {
    let newTab = open(`https://www.linux.org.ru/add_comment.jsp?topic=${topic}&msg=${msg}`, '_blank');
    newTab.focus()
}

// Обратиться к пользователю по нику
function castUser(nick) {
    injectText('[user]' + nick + '[/user], ')
}

// Цитировать. Аргументы опциональны. Если указаны, то цитировать с ником.
function quote(nick, link) {
    const wSelect = window.getSelection();
    if (wSelect.isCollapsed) {
        return
    }
    let simple = (nick === undefined) && (link === undefined);
    let text = simple ? '' : '\n[user]' + nick + '[/user] [url=' + link + ']пишет[/url]:\n';
    text += '[quote]' + wSelect.toString().trim() + '[/quote]' + '\n';
    injectText(text)
}

// Отправить модераторам ссылку на сообщение с нарушением правил
function reportHam(link) {
    
    let violation = prompt('Введите текст жалобы');
    
    if (violation == null) {
        return
    }
    
    let specTopicId = getCookie('SPECTOPIC_ID');
    let text = link;
    
    if (violation != "") {
        text += '%0D%0A%5Bbr%5D' + violation; // перенос строки и [br]
    }
    
    if (!(specTopicId)) {
        alert('Не задан спецтопик!\nОткройте его (Форум -> Linux-org-ru -> Ссылки на некорректные сообщения) и нажмите кнопку \"Это спецтопик\".');
        return
    }
    
    sendMessageToTopic(specTopicId, text)
}

// Сохраняет ID текущей темы в cookie SPECTOPIC_ID
function itsSpecTopic() {
    let path = window.location.pathname;
    let topicId = path.split('/')[3];
    let expires = new Date();
    expires.setDate(expires.getDate() + 60);
    setCookie('SPECTOPIC_ID', topicId, expires, '/');
    alert('Спецтопик установлен')
}

let firstLetter = '';

// Обновляет отображаемый список тегов, показывает теги, соответстующие 
// поисковому запросу, т.е. начинающиеся на строку, содержащуюся в поле ввода
async function searchTags(e) {
    let query = e.target.value.trim().toLowerCase();
    let queryFirstLetter = query.charAt(0);
    
    if (queryFirstLetter != firstLetter) {
        
        firstLetter = queryFirstLetter;
        
        if (firstLetter != '') {
            let response = await fetch('https://www.linux.org.ru/tags/' + firstLetter);
            let txt = await response.text();
            let oDoc = parser.parseFromString(txt, 'text/html');
            
            let content = oDoc.getElementById('bd');
            let tagList = content.getElementsByTagName('ul')[0];
            
            let oldTagList = tagListWrapper.firstChild;
            
            if (oldTagList) {
                tagListWrapper.replaceChild(tagList, oldTagList)
            }
            else {
                tagListWrapper.appendChild(tagList);
            }
        }
    }
    
    let tagList = tagListWrapper.firstChild;
    
    if (tagList) {
        for (let i = 0, c = tagList.children.length; i < c; i++) {
            let tag = tagList.children[i];
            let s = tag.children[0].text;
            if (s.startsWith(query)) {
                tag.style.display = 'list-item'
            }
            else {
                tag.style.display = 'none'
            }
        }
    }
}

// Добавляет к сообщению (теме или комментарию) недостающие ссылки внизу.
// Передать DOM Node элемента div.reply сообщения и логин его отправителя.
function addReplyLinks(replyNode, author) {
    
    let links = replyNode.firstElementChild;
    let linkToComment = links.lastElementChild.firstElementChild.href;
    
    let nick = _setup(
        'a',
        { text: 'Ник', href: linkToComment + '#nick' },
        { click: (e) => { e.preventDefault(); castUser(author) } }
    );
    let simpleQuote = _setup(
        'a',
        { text: 'Цитировать', href: linkToComment + '#quote' },
        { click: (e) => { e.preventDefault(); quote() } }
    );
    let advancedQuote = _setup(
        'a',
        { text: 'Цитировать с ником', href: linkToComment + '#quote' },
        { click: (e) => { e.preventDefault(); quote(author, linkToComment) } }
    );
    
    let nickLi = _setup('li');          nickLi.appendChild(nick);
    let quoteLi = _setup('li');         quoteLi.appendChild(simpleQuote);
    let advancedQuoteLi = _setup('li'); advancedQuoteLi.appendChild(advancedQuote);
    
    links.firstElementChild.before(nickLi);
    nickLi.after(' ');
    links.appendChild(quoteLi);
    quoteLi.before(' ');
    links.appendChild(advancedQuoteLi);
    advancedQuoteLi.before(' ')
}

// Принимает событие клика, копирует в буфер обмена текст поля, на котором кликнули
function copyNick (e) {
    e.target.select();
    if (document.execCommand('copy')) {
      	popup('Текст скопирован в буфер обмена')
    }
}

// Принимает блок с кодом, выделяет его текст
function selectCode (codeNode) {
    let range = document.createRange();
    range.selectNodeContents(codeNode.firstElementChild);
    
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range)
}

// Принимает блок с кодом, сворачивает/разворачивает его
function toggleCodeSpoiler(codeNode) {
    codeNode.classList.toggle('unspoiled')
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// Принимает событие отправки формы поиска в Google.
// Перенаправляет пользователя на страницу поиска Google по сайту
function searchByGoogle(event) {
    event.preventDefault();
    let term = document.getElementById('qg').value;
    let redirect = 'https://www.google.com/search?q=' + term + ' site:linuxtalks.co';
    window.location.href = redirect
}


// Основной код

let LOR_CSS = `
    .code {
        overflow: scroll;
    }

    .code.spoiled {
        overflow-y: scroll;
    }

    .code pre {
        overflow-x: unset;
        overflow-y: unset;
        word-wrap: initial;
    }

    pre code {
    	white-space: pre;
    }

    .code .spoiler-open {
        display: none;
    }

    #markup-panel .btn {
        margin: 2px;
    }

    #qg {
        margin-right: 5px;
    }

    a img.lorpic {
        max-width: 700px;
    }

    @media (max-width: 900px) {
        a img.lorpic {
            max-width: 60vw;
            height: auto;
        }
        
        .popup-message {
            width: 90vw;
        }
    }

    .user-tag {
        display: none;
    }

    .popup-message {
        visibility: hidden;
        opacity: 0;
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding: 10px;
        width: 300px;
        border-style: solid;
        transition-property: opacity;
        transition-duration: 1s;
        transition-timing-function: linear;
    }

    .shown {
        visibility: visible;
        opacity: 1;
    }
`;
const LOR_DARK = `
    .messages .by-ts {
        background-color: #3d2300;
    }

    a img.lorpic {
        background-color: #FFC;
    }

    .popup-message {
        border-width: thin;
        border-color: #8ae234;
        background-color: #033;
    }
`;
const LOR_LIGHT = `
    .messages .by-ts {
        background-color: #FFC;
    }

    .popup-message {
        border-width: medium;
        border-color: #000;
        background-color: #FC6;
    }
    
    div.code {
        background-color: #FFF;
    }
`;

const LOR_BLACK = `
    .ts-nick::after {
        content: '[ТС]';
        color: #F30;
        font-weight: bold;
    }

    a img.lorpic {
        background-color: #FFC;
    }

    .popup-message {
        border-width: thin;
        border-color: #8ae234;
        background-color: #033;
    }
`;

if (HIDE_STARS) {
    LOR_CSS += `
        .stars {
            display: none;
        }
    `
}

const theme = getCurrentTheme();

addCss(LOR_CSS);

if (theme == 'tango') {
    addCss(LOR_DARK)
}
else if (theme == 'waltz') {
    addCss(LOR_LIGHT)
}
else if (theme == 'black') {
    addCss(LOR_BLACK)
}

CommentForm = document.forms.commentForm || document.forms.messageForm;

if (CommentForm) {
    handleCommentForm(CommentForm);
}

let firstSign = document.querySelector('footer div.sign');
let TS = firstSign ? firstSign.firstElementChild.textContent : null;
if (TS) {
  	let nextBlock = firstSign.parentElement.nextElementSibling;
    if (nextBlock.className == "reply") {
    	addReplyLinks(nextBlock, TS)
    }
}

let comments = document.getElementById('comments') && document.getElementById('comments').getElementsByClassName('msg-container');

if (comments) {

    for (let i = 0, c = comments.length; i < c; i++) {
        
        let sign  = comments[i].getElementsByClassName('sign')[0];
        let reply = comments[i].getElementsByClassName('reply')[0];
        
        let author = sign.firstElementChild.textContent;
        let parentNode = comments[i].parentElement;
        
        if (author == TS) {
            parentNode.classList.add('by-ts');
            sign.classList.add('ts-nick')
        }
        
        // Если индекс комментария в массиве comments четный,
        if ((i % 2) == 0) {
            // то по счету комментарий нечетный
            parentNode.classList.add('odd')
        }
        else {
            parentNode.classList.add('even')
        }
        // Первый комментарий имеет индекс 0
        
        if (reply) {
            addReplyLinks(reply, author)
        }
    }
}


// Делаем местное время

/*let times = document.getElementsByTagName("time");
let c = times.length;

for (i = 0; i < c; i++) {
    let attrTime = new Date(times[i].getAttribute("datetime", 0));
	let nowTime = new Date();
	let diff = Math.round(nowTime.getTime() / 1000) - Math.round(attrTime.getTime() / 1000);
    
    let attrDay = new Date(attrTime.getTime()); 
    let nowDay = new Date(nowTime.getTime());
    attrDay.setHours(0, 0, 0, 0);
    nowDay.setHours(0, 0, 0, 0);
    let today = attrDay.getTime() == nowDay.getTime();
    let yesterday = (attrDay.getTime() + 86400000) == nowDay.getTime();
    let timeText;
    
    if ((strContains(document.URL, "/tracker") || strContains(document.URL, "/notifications"))) { 
        let minutes = Math.ceil(diff / 60);
        if (minutes < 60) {
            timeText = minutes + " мин."
        }
        else if (today) {
            timeText = dateFormat(attrTime.getTime(), "HH:MM:ss")
        }
        else if (yesterday) {
            timeText = "вчера " + dateFormat(attrTime.getTime(), "HH:MM:ss")
        }
        else {
            timeText = dateFormat(attrTime.getTime(), "dd.mm.yy HH:MM")
        }
    }
    else {
        if (today) {
            timeText = "сегодня " + dateFormat(attrTime.getTime(), "HH:MM")
        }
        else if (yesterday) {
            timeText = "вчера " + dateFormat(attrTime.getTime(), "HH:MM")
        }
        else {
            timeText = dateFormat(attrTime.getTime(), "dd.mm.yyyy HH:MM")
        }
    }
    times[i].innerHTML = timeText
}*/


// Настраиваем меню

if (theme == 'tango' || theme == 'waltz') {
    let menu = document.getElementsByClassName('menu')[0].getElementsByTagName('ul')[0]; // Главное меню

    if (TECH_ONLY_BY_DEFAULT) {
        menu.children[4].firstElementChild.href = '/tracker/?filter=tech';
    }

    if (HIDE_NEWS_AND_GALLERY) {
        // Убираем первые два раздела - новости и галерею
        menu.firstElementChild.remove();
        menu.firstElementChild.remove();
    }

    if (ADD_TAGS_AND_DOCS) {
        let itmTags = _setup('li');  let itmWiki = _setup('li');
        let linkTags = _setup(
            'a',
            { href: '/tags/', text: 'Теги' }
        );
        let linkWiki = _setup(
            'a',
            { href: 'http://lorwiki.zhbert.ru/', text: 'Документация', target: '_blank' }
        );
        itmTags.appendChild(linkTags); itmWiki.appendChild(linkWiki);

        menu.appendChild(itmTags);
        menu.appendChild(itmWiki);
        itmWiki.before(' ');
    }
}

// =================================================================================

// Добавляем всплывающее уведомление
divPopup = _setup(
    'div',
    { class: 'popup-message' }
);
document.body.appendChild(divPopup);


// Сворачиваемый и копируемый код

let codes = document.querySelectorAll('div.code');

for (let i = 0, c = codes.length; i < c; i++) {
    let code = codes[i];
    let linkToggleCodeSpoiler = _setup(
        'a',
        { href: '#toggleCodeSpoiler', text: 'Развернуть/Свернуть' },
        { click: (e) => { e.preventDefault(); toggleCodeSpoiler(code) } }
    );
    let linkSelectCode = _setup(
        'a',
        { href: '#selectCode', text: 'Выделить' },
        { click: (e) => { e.preventDefault(); selectCode(code) } }
    );
  	let codeControls = _setup(
      	'div',
      	{ class: 'code-controls' }
     );
  	codeControls.appendChild(linkToggleCodeSpoiler);
  	codeControls.appendChild(linkSelectCode);
  	
    linkToggleCodeSpoiler.before('[');
    linkSelectCode.before('] [');
    linkSelectCode.after(']');
  
  	code.before(codeControls)
}

// ================================================================================

if (window.location.pathname.startsWith('/people')) {
    let profile = document.getElementsByClassName('vcard')[0]
    
    if (profile) {
        let nick = profile.getElementsByClassName('nickname')[0];
        let nickName = '[user]' + nick.textContent.trim() + '[/user]';
        
      	profile.appendChild(_setup('br'));
        profile.appendChild(_setup('b', { text: 'Копировать ник: ' }));
        let copyInput = _setup(
            'input', 
            { value: nickName, size: nickName.length, readOnly: true },
            { click: copyNick }
        );
        profile.appendChild(copyInput);
        profile.appendChild(_setup('br'))
    }
}

if ((window.location.pathname == '/search.jsp') && (window.location.search == '')) {
    let searchContainer = document.getElementById('bd');
    let hdrGoogle = _setup(
        'h1',
        { text: 'Поиск в Google' }
    );
    let inpGoogle = _setup(
        'input',
        { id: 'qg', size: 50, class: 'input-lg', type: 'search', maxlength: 250 }
    );
    let btnGoogle = _setup(
        'button',
        { class: 'btn btn-primary', text: 'Поиск' }
    )
    let googleSearchBar = _setup(
        'form', 
        { class: 'control-group' },
        { submit: searchByGoogle }
    );
    googleSearchBar.appendChild(hdrGoogle);
    googleSearchBar.appendChild(inpGoogle);
    googleSearchBar.appendChild(btnGoogle);
    
    searchContainer.appendChild(googleSearchBar);
    
    let defaultSortOrder = _setup(
        'input',
        { type: 'hidden', name: 'sort', value: 'DATE' }
    );
    
    if (NEW_TO_OLD_SEARCH_BY_DEFAULT) {
        searchContainer.getElementsByTagName('form')[0].appendChild(defaultSortOrder)
    }
}
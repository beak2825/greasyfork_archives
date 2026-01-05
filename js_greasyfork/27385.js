// ==UserScript==
// @name LORCode Tools Native
// @description Кнопка цитирования выделенного и панель тегов для LORCode
// @author Алексей Соловьев aka moscwich
// @author Емельянов Эдуард aka Eddy_Em -- Fork && upgrade
// @license Creative Commons Attribution 3.0 Unported
// @version 0.21.4
// @grant       none
// @namespace http://www.linux.org.ru/*
// @namespace https://www.linux.org.ru/*
// @include http://www.linux.org.ru/*
// @include https://www.linux.org.ru/*
// @downloadURL https://update.greasyfork.org/scripts/27385/LORCode%20Tools%20Native.user.js
// @updateURL https://update.greasyfork.org/scripts/27385/LORCode%20Tools%20Native.meta.js
// ==/UserScript==

// Based on MultiCodePanel 2.2 (v. 0.22)
// http://al-moscwich.tk/tag/multicodepanel

function noDef(evt){ // remove default event action
	evt.stopPropagation();
	evt.preventDefault();
}

function removeElements () {
	for (i = arguments.length-1; i > -1; i--) {
		var p = arguments[i].parentNode;
		if (p) p.removeChild (arguments[i]);
	}
}

function set (p, z) {
	for (i = 0; i < arguments.length && (arguments[i] === undefined); i++) {}
	return arguments[i];
}

i = j = undefined;
a = b = undefined;

form = document.getElementById ("commentForm") || document.getElementById ("messageForm") || document.getElementById ("changeForm").getElementsByTagName ("label")[7];
msg = document.getElementById ("msg") || document.getElementById ("form_msg") || document.getElementById ("info");
var u = window.location.href;

// Panel
var panel = document.createElement ("div");
panel.id = 'atag';
panel.createBlock = function () {
	block = document.createElement ("span");
	for (i = 0; i < arguments.length; i++) {
		link = document.createElement ("a");
		link.className = 'btn btn-default';
		link.textContent = arguments[i][0];
		link.title = arguments[i][1];
		link.exec = arguments[i][2];
		link.onclick = function(e){
			noDef(e);
			eval(this.exec);
			return false;
		};
		block.appendChild (link);
	}
	return this.appendChild (block);
};
panel.createBlock (
	["[b]", "Полужирный", 'intag ("b");'],
	["[i]", "Курсив", 'intag ("i");'],
	["[s]", "Зачеркнутый", 'intag ("s");'],
	["[u]", "Подчеркнутый", 'intag ("u");']
);
panel.createBlock (
	["[quote]", "Цитата", 'intag ("quote", "\\n");'],
	["[code]", "Код", 'intag ("code", "\\n");'],
	["[inline]", "Внутристрочный код", 'intag ("inline");'],
	["[pre]", "Код", 'intag ("pre", "\\n");']
);
panel.createBlock (
	["[url]", "URL", 'url ();'],
	["[user]", "Участник", 'intag ("user");']
);
panel.createBlock (
	["[list]", "Список", 'lst();'],
	["[*]", "Элемент списка", 'wrtSel ("[*]", "");']
);
panel.createBlock (
	["«»", "Кавычки", 'wrtSel ("«", "»");'],
/*	["„“", "Кавычки", 'wrtSel ("„", "“");'],*/
	["[br]", "Перевод строки", 'wrtSel ("[br]", "");']
);
panel.createBlock (
/*	[" fix ", "Превратить знаки и обозначения в соответствующие спец. символы", 'fix();'],*/
	[" deltags ", "Удалить крайнее входящие обрамление тегами", 'deltagsin ();'],
	[" brs ", "Добавить [br] к переводам строк", 'brs ();']
);
panel.createBlock (
	["[cut]", "Спойлер", 'cut ();']
);

msg.parentNode.insertBefore (panel, msg);
msg.cols = 100;
msg.rows = 20;

// Styles
obj = document.createElement ("style");
obj.innerHTML = '#atag a {' +
	'margin:1px;cursor: pointer;' +
	'-o-transform-origin: 14px 17px; background-color: rgb(39, 44, 45);' +
	'border-bottom-color: rgb(114, 159, 207); border-bottom-left-radius: 5px;' +
	'border-bottom-right-radius: 5px; border-bottom-style: solid;' +
	'border-bottom-width: 1px; border-left-color: rgb(114, 159, 207);' +
	'border-left-style: solid; border-left-width: 1px;' +
	'border-right-color: rgb(114, 159, 207); border-right-style: solid;' +
	'border-right-width: 1px; border-top-color: rgb(114, 159, 207);' +
	'border-top-left-radius: 5px; border-top-right-radius: 5px;' +
	'border-top-style: solid; border-top-width: 1px;' +
	'color: rgb(114, 159, 207);' +
	'font-family: "Trebuchet MS";' +
	'display: inline !important;' +
	'font-size: 14px; height: 22px; line-height: 22.4px !important; margin-bottom: 5px; margin-top: 5px; max-height: none;' +
	'max-width: none; padding: 5px 4px !important; text-align: center;' +
	'text-decoration: none;' +
	'width: 16px;' +
	'}' +
	'#atag a:hover {background-color:rgb(84, 84, 84); border-color:rgb(186, 189, 182);}' +
	'#atag {' +
	'margin-top: 5px; margin-bottom: 5px;' +
	'padding: 3px 1px; font-size: 0.9em;' +
	'}' +
	'#atag > span {margin-right: 3px;}' +
	'label[for="msg"] {display: inline-block; margin-top: 5px;}' +
	'#msg {width: 50em !important;}' +
	'label[for="title"], label[for="form_mode"] {display: inline-block; margin: 5px 0 3px 0;}' +
	'.msg_body p {margin: 0.3em 0 !important;}' +
	'.quote > p {margin: 0.5em 0 0.3em 0 !important;}';
document.getElementsByTagName ("head")[0].appendChild (obj);

// Remove formating tips
// COMMENTED (I don't know why, but it breaks whole script)
/*if (u.indexOf ("add.jsp") <= -1 &&
		u.indexOf ("edit.jsp") <= -1 &&
		u.indexOf ("register.jsp") <= -1)
	removeElements (form.getElementsByTagName ('font')[0],
		(i = form.getElementsByTagName ('br'))[5],
		i[6]
	);*/

// Add quote links
function cre_links(o, L){
	var S = document.createElement("span");
	console.log("LEN: " + L.length + " obj: " + o);
	var Ll = L.length;
	for (j = 0; j < Ll; j++){
		qlink = document.createElement ("a");
		qlink.textContent = L[j][0];
		d = document.createElement("span");
		if(L[j][0] == "#"){
			qlink.href = getMsgURL(o);
		}else{
			qlink.href = "#";
		}
		d.onclick = L[j][1];
		d.innerHTML = "[" + qlink.outerHTML + "] ";
		S.appendChild(d);
	}
	if(o.firstElementChild && o.firstElementChild.nodeName != "IMG"){
		clink = o.firstChild;
		o.insertBefore(S, clink);
	}else
		o.appendChild(S);
}

var t = document.getElementsByClassName("title");
t.createQlink = function(){
	for (i = 0; i < this.length; i++){
		if(this[i].parentNode.nodeName != "ARTICLE") continue;
		var A = Array.prototype.slice.call(arguments);
		cre_links(this[i], A);
	}
};

// Add \n to <br>
var mbs = document.getElementsByClassName("msg_body");
for (var j in mbs) if (!isNaN (j)) {
	var mps = mbs[j].getElementsByTagName ("p");
	for (var i in mps)
		if (!isNaN (i))
			mps[i].innerHTML = mps[i].innerHTML.replace (/<br\/?>(?![\n\r])/g, "<br>\n");
}


/*		Main		*/

//	Auxiliary functions
function wrtSel(subj, offset, before, after, zset){ //Also msg.wrtSel (before, after, offset)
	if(typeof offset == "string") {
		after = offset;
		offset = before;
		before = subj;
		subj = undefined;
	}
	before = before || "";
	after = after || "";
	offset = set (offset, before.length);
	zset = zset || 0;
	startSel = set (a, msg.selectionStart);
	endSel = set (b, msg.selectionEnd);
	subj = before + set (subj, msg.value.substring (startSel, endSel)) + after;

	msg.value = msg.value.substring (0, startSel) + subj + msg.value.substring (endSel);
	msg.selectionStart = msg.selectionEnd = startSel+offset;
	msg.focus();
	a = b = undefined;
}

function lst(){
	a = msg.selectionStart; b = msg.selectionEnd;
	z = msg.value.substring(a, b).replace(/([^\n\r]+)[\n\r]*/g, "[*]$1\n");
	z = z.replace(/^[\s\r\n]+/g, '').replace(/^$/g,'');
	if(z.length === 0) z = "[*]\n";
	wrtSel(z, 6, "\n[list]\n", "[/list]\n");
}

function addbr (c) {
	return c.replace (/^((?:(?!\[\/?(?:quote|code|list|br)(?:=.*)?\]$)[^\n\r])+)(\r?\n)(?!\n|\[\/?(?:br|quote(?:=.*)?|code(?:=.*)?)\])/gm, "$1[br]$2");
}

function getTextContent (post) {
	var text = "";
	var pTags = post.getElementsByClassName ("msg_body")[0].getElementsByTagName ("p");
	for (i = 0; i < pTags.length; i++)
		if (pTags[i].parentNode.className.indexOf ('msg_body') > -1) {
			text += pTags[i].textContent;
			if (i != pTags.length - 1) text += "\n\n";
		}
	return text;
}

function getUserName(evt){
	var post = getMsg(evt.target);
	if (i == post.getElementsByClassName("sign")[0].getElementsByTagName("a")[0])
		return i.innerHTML;
	else return "anonymous";
}

// Functions to run
function intag (tag, arg) {
	arg = arg || "";
	wrtSel(
		undefined,
		tag.length + 2 + arg.length*2,
		arg + "[" + tag + "]" + arg,
		arg + "[/" + tag + "]" + arg
	);
}

// reparce quotations if checked in glob settings
function reparce(text){
	var bef = text.split("[code]");
	bef[0] = bef[0].replace(/"/g, "&#34;");
	var N = bef.length;
	for(var m = 1; m < N; m++){
		var aft = bef[m].split("[/code]");
		aft[1] = aft[1].replace(/"/g, "&#34;");
		bef[m] = aft.join("[/code]");
	}
	text = bef.join("[code]");
	return text;
}

function fix () {
	var a = msg.selectionStart, b = msg.selectionEnd;
	var repc = function (c) {
		c = c.replace (/\(c\)/gi, "©");	c = c.replace (/\([rр]\)/gi, "®");
		c = c.replace (/\(f\)/gi, "£");	c = c.replace (/\(e\)/gi, "€");
		c = c.replace (/%\/10/g, "‰");	c = c.replace (/%\/100/g, "‱");
		c = c.replace (/\(V\)/g, "✓");	c = c.replace (/\(V\+\)/g, "✔");
		c = c.replace (/\(x\)/g, "✗");	c = c.replace (/\(x\+\)/g, "✘");
		c = c.replace (/`/g, "&#769;");	c = c.replace (/\(p\)/gi, "§");
		c = c.replace (/(^| )- /g, "$1— ");	c = c.replace (/\.\.\./g, "…");
		c = c.replace (/\(\*\+?\)/g, "★");	c = c.replace (/\(\*-\)/g, "☆");
		c = c.replace (/\([tт][mм]\)/gi, "™");
		c = c.replace (/-->/g, "→");
		return c;
	};

	if (a != b) {
		var c = msg.value.substring (a, b);
		var z = repc (c);
		wrtSel(z, 0, "", "", z.length - c.length);
	}
	else
		msg.value = repc (msg.value);
}

function url(U){
	U = U || "";
	a = msg.selectionStart; b = msg.selectionEnd;
	z = msg.value.substring (a, b);
	if(U !== ""){
		wrtSel (z, 6+U.length,
			"[url=" + U + "]", "[/url]",
			-z.length
		);
	}
	else if (/((ftp|http|https):\/\/)[\.\w- ]{2,}\.[A-Za-z]{2,4}(\/?$|\/.*)/.test(z) || z.length === 0) {
		wrtSel (z, z.length+6,
		        "[url=", "][/url]"
		);
	}
	else if (/[\.\w- ]{2,}\.[A-Za-z]{2,4}(\/?$|\/.*)/.test(z)) {
		wrtSel (
		    "http://"+z, z.length+13,
		    "[url=", "][/url]", 7
		);
	}
	else {
		wrtSel (z, 5,
		        "[url=]", "[/url]",
		        -z.length
		);
	}
}

function cut(C){
	var U = U || "";
	a = msg.selectionStart; b = msg.selectionEnd;
	z = msg.value.substring (a, b);
	wrtSel (z, 5,"[cut]", "[/cut]",-z.length);
}

function deltagsin () {
	z = msg.value.substring (a = msg.selectionStart, b = msg.selectionEnd);
	c = z.replace (/\[\w+\](.*)\[\/\w+\]/, "$1");
	wrtSel (c, 0, "", "", - z.length + c.length);
}

function brs () {
	var a = msg.selectionStart, b = msg.selectionEnd;
	if (a != b) {
		var c = msg.value.substring (a, b);
		var z = addbr (c);
		wrtSel (z, 0, "", "", z.length - c.length);
	}
	else {
		msg.value = addbr (msg.value);
	}
}

function substTags(chN){
	if(!chN) return;
	var LORtagz = [ "b", "i","s","u","url","code","list","br","*","em","strong",
				"pre", "quote"];
	var txt = "", incode = false, latex = false;
	var Tpre="", Tpost="";
	if(chN.className == "sign" || chN.className == "reply") return "";
	if(chN.nodeName == "B"){Tpre="[b]"; Tpost="[/b]";}
	else if(chN.nodeName == "I"){Tpre="[i]"; Tpost="[/i]";}
	else if(chN.nodeName == "S"){Tpre="[s]"; Tpost="[/s]";}
	else if(chN.nodeName == "U"){Tpre="[u]"; Tpost="[/u]";}
	else if(chN.nodeName == "A"){Tpre="[url="+chN.href+"]"; Tpost="[/url]";}
	else if(chN.nodeName == "CODE"){Tpre="\n[code"+(chN.className ? "="+chN.className:"")+"]\n"; Tpost="[/code]"; incode = true;}
	else if(chN.nodeName == "UL"){Tpre="\n[list]\n"; Tpost="\n[/list]";}
	else if(chN.nodeName == "OL"){Tpre="\n[list=\""+chN.type+"\"]\n"; Tpost="\n[/list]";}
	else if(chN.nodeName == "BR")Tpost="[br]\n";
	else if(chN.nodeName == "LI"){Tpre="[*] "; Tpost="\n";}
	else if(chN.nodeName == "EM"){Tpre="[em]"; Tpost="[/em]";}
	else if(chN.nodeName == "STRONG"){Tpre="[strong]"; Tpost="[/strong]";}
	else if(chN.nodeName == "PRE"){Tpre="[pre]\n"; Tpost="[/pre]";}
	else if(chN.nodeName == "P"){Tpre="\n"; Tpost="\n";}
	else if(chN.nodeName == "SPAN"){Tpre=""; Tpost="\n";}
	else if(chN.nodeName == "CITE"){Tpre="[b]"; Tpost="[/b][br]\n";}
	else if(chN.nodeName == "IMG"){Tpre="[latex]"; Tpost="[/latex]"; latex = true;}
	//else if(chN.nodeName == ""){Tpre=""; Tpost="";}
	else if(chN.className == "quote"){Tpre="[quote]"; Tpost="[/quote]";}
	if(latex) txt = chN.title;
	else if(incode) txt = chN.textContent;
	else if(chN.childNodes && chN.childNodes.length)
		for (var ch in chN.childNodes)
			txt += substTags(chN.childNodes[ch]);
	else if(typeof(chN.textContent) != "undefined"){
		txt = chN.textContent; //.replace(/\[/g, '[[').replace(/\]/g, ']]');
		for(var j in LORtagz){
			var Tg = LORtagz[j];
			txt = txt.split("["+Tg+"]").join("[["+Tg+"]]");
			txt = txt.split("[/"+Tg+"]").join("[[/"+Tg+"]]");
		}
	}
	txt = Tpre + txt + Tpost;
	return txt.replace(/^[\s\r\n]+$/, '').replace(/^$/,'');
}

function qb(e){
	noDef(e);
	var post, seltxt = getSelection ();
	function f(s,o){
		return "[quote" + (getMsg(o) != getMsg(msg) ? "=" + getUserName (e) : "") +
			"]" + substTags(s) + "\n[/quote]\n\n";
	}
	if (seltxt !== "") {
		post = getMsg(seltxt.getRangeAt(0).commonAncestorContainer);
		wrtSel(i = f(seltxt.getRangeAt (0).cloneContents(),this), i.length);
	}
	else {
		post = getMsg(this);
		wrtSel (i = f(post.getElementsByClassName ("msg_body")[0], this), i.length);
	}
	return false;
}

function q(e) {
	noDef(e);
	var seltxt = getSelection ();
	if (seltxt !== "") {
		post = getMsg(seltxt.getRangeAt(0).commonAncestorContainer);
		wrtSel (i = seltxt.toString ().replace (/(\n\r?|^)(?:\n\r?)?/g, "$1> ") + "\r\n", i.length);
	}
	else {
		post = getMsg(this);
		wrtSel (i = getTextContent (post).replace (/(\n\r?|^)(?:\n\r?)?/g, "$1> ")  + "\r\n", i.length);
	}
	return false;
}

function user (e) {
	noDef(e);
	if ((i = getUserName(e)) != "anonymous")
		wrtSel (i = "[user]" + i + "[/user], ", i.length);
	else wrtSel (i = "[strong]Аноним[/strong], ", i.length);
	return false;
}

function insurl(e){
	noDef(e);
	url(e.target.href);
}
// ==UserScript==
// @name LORCode Tools
// @description Кнопка цитирования выделенного и панель тегов для LORCode
// @author Алексей Соловьев aka moscwich; Емельянов Эдуард aka Eddy_Em -- Fork && upgrade
// @license Creative Commons Attribution 3.0 Unported
// @version 0.0.3
// @grant       none
// @namespace http://www.linux.org.ru/*
// @namespace https://www.linux.org.ru/*
// @include http://www.linux.org.ru/*
// @include https://www.linux.org.ru/*
// @downloadURL https://update.greasyfork.org/scripts/27089/LORCode%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/27089/LORCode%20Tools.meta.js
// ==/UserScript==

// Based on MultiCodePanel 2.2 (v. 0.22)
// http://al-moscwich.tk/tag/multicodepanel

/*
 * CHANGELOG
 *
 * 25.12.2014 Eddy_Em
 *     Fixed bug with menu "sort tracker"
 *     Warning! refresh your stylish rules to see normal menu
 *
 * 16.07.2014 Eddy_Em
 *     Some little fixes with JS syntax + no quotes substitution in [inline]
 *
 * 16.05.2014  Eddy_Em
 *     Fixed regular Maxcom's caprice with "tracker/?filter=all" instead of simple "tracker"
 *
 * 07.02.2014  Eddy_Em
 *     Hiding of "Similar topics"
 *
 * 02.12.2013  Eddy_Em
 *     Latex imaging + quotation
 *
 * 08.11.2013  Edward V. Emelianoff  <eddy@sao.ru>
 *     Add collapsing of large code blocks
 *
 * 13.02.2013 Eddy_Em
 *    Add "replace quotes by quotes" to fight with hizel's shit
 *
 * 4.02.2013 Eddy_Em
 *    Add "Show seconds in datetime"
 *
 * 14.12.2012 Eddy_Em
 *     Fixed small bug with editing of topics
 *
 * 13.12.2012 Eddy_Em
 *     Fixed bug with no panels in edit form
 *     Fixed tag focusing
 *     Modified [list] tag in case of nonempty selection
 *
 * 29.11.2012  Eddy_Em
 *     Fixed problems with new LOR formatting
 *     Now script works in tango too
 *
 * 22.11.2012  Eddy_Em
 *     Fix problem with citing & add tags in block-quote
 *
 * 21.11.2012  Eddy_Em
 *     Some little fixes + add global settings in user profile
 *
 * 19.11.2012  Eddy_Em
 *     Some little fixes
 *
 * TODO:
 * - don't change <<>> to "" in [code] and [inline]
 * - changing of <<>> to "" in topic form
 * - direct change of user comment
 * - preview of links to images
 * - messages preview
 */
(function(){

const TEST = false; // set to false in release

if(window.parent != window){
	unsafeWindow.console.log("INFRAME!!!");
	return;
}

const pluginVersion = "0.0.3"; // версия скрипта; нужна для оповещения при внесении изменений

unsafeWindow.console.log("start");
function tlog__(msg){unsafeWindow.console.log(msg);}
var tlog;
if(TEST) tlog = tlog__;
else tlog = function(msg){};

/*
 *                  GLOBAL FUNCTIONS
 */
tlog("begin");
var Glob; // global settings
/*
 * Load object nm from local storage
 * if it's absent set it to defval or return null if devfal undefined
 */
function LoadObject(nm, defval){
	var val = JSON.parse(localStorage.getItem(nm));
	if(val == null && typeof(defval) != "undefined"){
		tlog("Can't load object, try to use defaults");
		val = defval;
	}
	return val;
}
/*
 * Save object obj in local storage as nm
 */
function SaveObject(obj, nm){
	tlog("save " + obj);
	localStorage.setItem(nm, JSON.stringify(obj));
}

function $(id){
	return document.getElementById(id);
}
function noDef(evt){ // remove default event action
	evt.stopPropagation();
	evt.preventDefault();
}
function rmElement(el){ // remove element from DOM tree
	if(typeof(el) != "undefined" && el)
		el.parentNode.removeChild(el);
}
function getURL(full){ // get URL of current page
// if full defined && true, don't cut GET parameters from URL
	var qpos, CurURL = location.href;
	if(typeof(full) == "undefined" || !full){
		qpos = CurURL.indexOf("?");
		if(qpos > -1) CurURL = CurURL.substring(0,qpos);
	}
	qpos = CurURL.indexOf("//") + 2;
	CurURL = CurURL.substring(qpos);
	if(CurURL.charAt(CurURL.length - 1) == "/")
		CurURL = CurURL.substring(0,CurURL.length - 1);
	return CurURL;
}
// insert newElement after targetElement
function insertAfter(newElement, targetElement){
	var parent = targetElement.parentNode;
	if(parent.lastchild == targetElement)
		parent.appendChild(newElement);
	else
		parent.insertBefore(newElement, targetElement.nextSibling);
}
// indicate that iframe content is loaded
var iframeLoaded = false, nTries = 0;
function iframeIsLoaded(){
	var F = $("innerFrame");
	if (F.src == "") return;
	var D = (F.contentDocument) ? F.contentDocument : F.contentWindow.document;
	if(D.getElementsByClassName("head").length == 0 && D.getElementsByClassName("menu").length == 0){
		nTries = 100; return; // frame is blocked by AdBlock
	}
	iframeLoaded = true; nTries = 0;
	tlog("IFRAME loaded " + F.src);
}
// alert that iframe could be blocked by adBlock
function IFRMerror(){
	tlog("CAN'T LOAD IFRAME!");
	alert("Не могу подгрузить дополнительные сообщения!\n"+
			"Проверьте, не блокирует ли adBlock элементы iframe на ЛОРе\n"+
			"(нажмите в меню adBlock \"Открыть список элементов\" и снимите "+
			"блокировку с элемента \"фрейм\"");
}
/*
 *                      USERSCRIPT ITSELF
 */
function AlertOnFirstRun(){
	alert("Вы запускаете в первый раз LOR-panel, либо обновили ее!\n"
	+"Обратите внимание на то, что настройки скрипта находятся в вашем профиле"
	+"(«Настройки пользовательского скрипта»)\n"
	+"для полноценного отображения меню добавьте в ЛОР-стиль Stylish следующее:\n\n"
	+".SortTrackMenu{position: absolute;  margin: auto;"
	+"background: none repeat scroll 0 0  #0000ff !important; text-align: left;}\n"
	+".SortTrackMenuItem{left: 0px; margin: 1px; background-color: #c0c0c0 !important; color: black;}\n\n"
	+"либо что-нибудь свое"
	)
	SaveObject(pluginVersion, "LOR-panel.version");
}
var savedVersion = LoadObject("LOR-panel.version", false);
if(pluginVersion != savedVersion) AlertOnFirstRun();
// parent with class "msg" for element el of first element with class "msg"
function getMsg(el){
	while(el && el.className != "msg") el = el.parentElement;
	if(!el) el = document.getElementsByClassName("msg")[0];
	return el;
}
// get URL of message, aMsg -- article element
function getMsgURL(aMsg){
	aMsg = getMsg(aMsg);//while(aMsg.className != "msg") aMsg = aMsg.parentElement;
	var id = aMsg.id;
	var href = "";
	if(id.indexOf("topic") != -1){ // topic
		var H = aMsg.getElementsByTagName("h1");
		if(H.length > 0) href = H[0].firstElementChild.href;
	}else{ // message
		//href = pMsg.firstElementChild.firstElementChild.href;
		var As = aMsg.getElementsByTagName("a");
		for(var l in As)
			if(As[l].innerHTML == "Ссылка"){href = As[l].href; break;}
		//href = pMsg.getElementsByClassName("reply")[0].firstElementChild.lastElementChild.firstElementChild.href;
	}
	return href;
}

/*
 * Global settings
 */
function GlobSettings(){
function nope(){};
// array: item name, defval, menu name, appr. function
var GMitems = [ ["addSortMenu",  true, "фильтрация трекера", addSortMenu],
				["rmAttInAll",  false, "удалить прикрепленные везде", rmAttInAll],
				["rmAttInTalks", true, "удалить прикрепленные только в Talks", rmAttInTalks],
				["expandCollapseCODE", true, "сворачивать большие блоки CODE", expandCollapseCODE],
				//["tagsInSpoiler",true, "помещать теги в профиле в спойлер", mkSpoiler],  Broken by Maxcom & Hizel
//				["noSymbols",    true, "удалить «страшный глаз»", idioticSymbolsRemove], Мне глаз нужен
				["addUserPanel" ,true, "добавить пользовательскую панель", AddUserPanel],
				["showSeconds",  true, "отображать секунды в дате", ShowSecondsInDate],
				["reparceQuots",false, "заменять кавычки кавычками", nope],
				["SortBackwards", false, "отображать новые сообщения первыми", SortBackwards],
				["HideSimilar", true, "скрывать «Похожие темы»", HideSimilar]
			];
var milen = GMitems.length;
var i, defvar = new Object();
for(i = 0; i < milen; i++) defvar[GMitems[i][0]] = GMitems[i][1];
Glob = LoadObject("GlobalLORoptions", defvar);
if(TEST)for(i = 0; i < milen; i++) tlog("GL["+GMitems[i][0]+"] = "+Glob[GMitems[i][0]]);
if(location.href == getProfile()){tlog("Load global menu"); UserGlobMenu();}
for(i = 0; i < milen; i++)
	if(Glob[GMitems[i][0]])GMitems[i][3]();
function getProfile(){ // check whether this is "black" or "tango" → get URL of user's profile
	var hd = document.getElementsByClassName("head");
	if(hd.length > 0){
		var ankor = hd[0].getElementsByTagName("a");
		if(ankor.length > 1) return ankor[1].href; // black
	}
	// no? maybe tango ???
	var grt = $("loginGreating");
	if(typeof(grt) != "undefined"){
		var ankor = grt.getElementsByTagName("a");
		if(ankor.length > 0) return ankor[0].href; // tango
	}
	unsafeWindow.console.log("Incorrect style or document");
	return "";
}
function UserGlobMenu(){
	function onkey(evt){
		noDef(evt);
		if(evt.keyCode != 27) return;
		menuShowHide();
	}
	var oldkeyd;
	function menuShowHide(){
		var M = $('UserSettingsButton').nextSibling;
		if(M.style.display != "block"){
			M.style.display = "block";
			oldkeyd = document.body.onkeydown;
			document.body.onkeydown = onkey;
			return;
		}else{
			document.body.onkeydown = oldkeyd;
			M.style.display = "none";
			var boxes = M.getElementsByTagName("input");
			for(var b in boxes){
				var B = boxes[b];
				if(B.type != "checkbox") continue;
				Glob[B.id] = B.checked;
			}
			SaveObject(Glob, "GlobalLORoptions");
		}
	}
	function SaveMenu(evt){
		noDef(evt);
		menuShowHide();
		return;
	}
	function genMenuBoxes(parent){ // generate menu
		for(var i = 0; i < milen; i++){
			var str = document.createElement('div');
			str.className = "SortTrackMenuItem";
			var inp = document.createElement('input'); inp.type = "checkbox";
			inp.id = GMitems[i][0]; inp.checked = Glob[GMitems[i][0]];
			str.appendChild(inp);
			var txt = document.createTextNode(GMitems[i][2]);
			str.appendChild(txt);
			parent.appendChild(str);
		}
	}
	var ul, found = false, h2 = document.getElementsByTagName("h2");
	for(var el in h2)
		if(h2[el].innerHTML == "Действия"){
			found = true; ul = h2[el].nextElementSibling; break;
		}
	if(!found) return;
	var msi = document.createElement('li');
	var mitem = document.createElement('a');
	mitem.href = "'#'"; mitem.innerHTML = "Настройки пользовательского скрипта";
	mitem.id = "UserSettingsButton"; mitem.onclick = SaveMenu;
	msi.appendChild(mitem);

	var Smenu = document.createElement('div');
	Smenu.className = "UserSettingsMenu";
	Smenu.style.display = "none";
	genMenuBoxes(Smenu);
	msi.appendChild(Smenu);
	ul.appendChild(msi);
}
}
tlog("BEFORE");
GlobSettings();
tlog("AFTER");

/*
 * Expand/collapse large (more than 6 lines) code blocks
 */
function expandCollapseCODE(){
tlog("expandCollapseCODE()");
var Code_blocks = document.getElementsByTagName("code");
function codeshowhihide(E){
	if(E.style.maxHeight == "100px"){
		E.style.maxHeight = "";
		E.title = "Click to collapse";
	}else{
		E.style.maxHeight = "100px";
		E.title = "Click to expand";
	}
}
function ShowBlk(e){
	var E = e.target;
	if(E.tagName != "PRE") E = E.parentNode;
	codeshowhihide(E);
}
for(var i in Code_blocks){
	var tN = Code_blocks[i].tagName;
	if(tN != "CODE") continue;
	var lines = Code_blocks[i].textContent.split("\n");
	if(lines.length < 6) continue;
	var P = Code_blocks[i].parentNode;
	codeshowhihide(P);
	P.style.overflowY = "auto";
	P.onclick = ShowBlk;
}
}

/*
 * sort tracker
 */
function addSortMenu(){
tlog("addSortMenu()");
var CurURL = getURL(true); // don't sort sorted tracker
tlog("URL: "+CurURL);
if(CurURL.indexOf("www.linux.org.ru/tracker") == -1) return;
const maxElems = 50; // maximum amount of records in tracker
var WasSorted = false; // whether tracker was sorted?
var menuitems = ["general", "desktop", "admin", "linux-install", "development",
				"linux-org-ru", "security", "linux-hardware", "talks", "science", "job",
				"games", "web-development", "lor-source", "mobile",
				"multimedia", "midnight"];
var milen = menuitems.length;
var ichkd = LoadObject("FilterTracker");
if(!ichkd) ichkd = new Array();
var ichkdlen = ichkd.length;
var TotalElements = 0;
function onkey(evt){ // Sort tracker by ESC
	noDef(evt);
	if(evt.keyCode != 27) return;
	menuShowHide();
}
function getCheckedItems(){ // save checked menu items in local storage
	ichkd = [];
	for(var i = 0; i < milen; i++)
		if($('MB'+i).checked)
			ichkd.push(i);
	ichkdlen = ichkd.length;
	SaveObject(ichkd, "FilterTracker");
}
function checkHref(a, tbl){ // check if topic is selected
	var H = a.href;
	var addEl = (typeof(tbl) != "undefined"); // whether add needed or remove unneeded
	if(H.charAt(H.length - 1) == "/") // cut forum name
		H = H.slice(0,-1);
	var slashpos = H.lastIndexOf("/");
	H = H.slice(slashpos+1);
	var found = false;
	for(var i = 0; i < ichkdlen; i++)
		if(H == menuitems[ichkd[i]]){
			found = true; break;
		}
	if(!found){
		if(!addEl) rmElement(a.parentNode.parentNode);
	}else{
		TotalElements++;
		if(addEl)
			tbl.appendChild(a.parentNode.parentNode);
	}
}
function genMenuBoxes(parent){ // generate menu
	var i;
	for(i = 0; i < milen; i++){
		var str = document.createElement('div');
		str.className = "SortTrackMenuItem";
		var inp = document.createElement('input'); inp.type = "checkbox";
		inp.onclick = function(){menuwaschanged = true;}; inp.id = "MB"+i;
		str.appendChild(inp);
		var txt = document.createTextNode(menuitems[i]);
		str.appendChild(txt);
		parent.appendChild(str);
	}
}
/*
 * Добавить в Stylish для ЛОРа [ОБЯЗАТЕЛЬНО!]:
.SortTrackMenu{position: absolute;  margin: auto;
background: none repeat scroll 0 0  #0000ff !important; text-align: left;}
.SortTrackMenuItem{left: 0px; margin: 1px; background-color: #c0c0c0 !important; color: black;}
*/
function appendMenu(genmenu){ // add menu
	//var menu = document.getElementsByClassName('nav-buttons')[0];
	var menu = document.getElementsByTagName('nav')[0];
	//var C = menu.firstElementChild;
	//var unneed = C.firstElementChild;
	var unneed = menu.firstElementChild;
	var msi = document.createElement('span');
	var mitem = document.createElement('a');
	mitem.href = "'#'"; mitem.innerHTML = "Фильтрация";
	mitem.id = "SortTrackerButton";
	//if(unneed.getElementsByClassName("current").length)mitem.className = "current";
	mitem.className = "btn btn-default";
	if(genmenu) mitem.onclick = SortTracker;
	msi.appendChild(mitem);
	if(genmenu){
		var Smenu = document.createElement('div');
		Smenu.className = "SortTrackMenu";
		Smenu.style.display = "none";
		genMenuBoxes(Smenu);
		msi.appendChild(Smenu);
	}else mitem.href = "/tracker";
	//C.insertBefore(msi, C.firstChild);
	menu.insertBefore(msi, unneed);
	rmElement(unneed);
	for(i = 0; i < ichkdlen; i++)
		$("MB"+ichkd[i]).checked = "true";
}
if(CurURL != "www.linux.org.ru/tracker"){
	appendMenu(false);
	return;
}
appendMenu(true);
// create iframe
var innerFrame = document.createElement('iframe');
innerFrame.id = "innerFrame";
innerFrame.width = 0; innerFrame.height = 0; innerFrame.style.display = "none";
document.body.appendChild(innerFrame);
innerFrame.onload = iframeIsLoaded;
innerFrame.src = "/tracker/?offset=50";
function collectHrefs(doc, tbl){ // add more topics from iframe
	function chkA(A){
		if(typeof(A) != "undefined" && typeof(A.href) != "undefined" && A.parentNode.nodeName == "TD")
			checkHref(A, tbl);
	}
	var i, hrefs = doc.getElementsByClassName("secondary");
	if(typeof(tbl) == "undefined")
		for(i = hrefs.length-1; i > -1; i--){
			if(TotalElements >= maxElems) return;
			chkA(hrefs[i]);
		}
	else
		for(i in hrefs){
			if(TotalElements >= maxElems) return;
			chkA(hrefs[i]);
		}
}
var Wto;
function AddMoreItems(){ // find table with topics & try to add to it more items
	clearTimeout(Wto);
	if(!iframeLoaded){
		if(nTries > 10){
			IFRMerror();
			return;
		}
		nTries++;
		Wto = setTimeout(AddMoreItems, 300);
		return;
	}
	mTbl = document.getElementsByClassName("message-table")[0];
	if(typeof(mTbl) == "undefined") return;
	var chlds = mTbl.childNodes;
	for(var n in chlds)
		if(chlds[n].nodeName == "TBODY"){
			mTbl = chlds[n];
			break;
		}
	var innerDoc = (innerFrame.contentDocument) ? innerFrame.contentDocument : innerFrame.contentWindow.document;
	var hrefs = innerDoc.getElementsByClassName("secondary");
	collectHrefs(innerDoc, mTbl);
}
function StartSorting(){ // Start filtering of tracker
	var nav = document.getElementsByClassName("nav");
	rmElement(nav[nav.length - 1]); // remove navigation since it won't work
	WasSorted = true;
	TotalElements = 0;
	collectHrefs(document);
	if(TotalElements < 50){
		if(!iframeLoaded){
			nTries = 0;
			Wto = setTimeout(AddMoreItems, 300);
		}
		else
			AddMoreItems();
	}
}
var oldkeyd;
var menuwaschanged = false;
function menuShowHide(){ // show menu || start filtering
	var M = $('SortTrackerButton').nextSibling;
	if(M.style.display != "block"){
		menuwaschanged = false;
		M.style.display = "block";
		oldkeyd = document.body.onkeydown;
		document.body.onkeydown = onkey;
		return;
	}
	if(!menuwaschanged){
		document.body.onkeydown = oldkeyd;
		M.style.display = "none";
		return;
	}
	getCheckedItems();
	location.reload(true);
	document.location.reload(true);
}
function SortTracker(evt){ // menu's "onclick"
	noDef(evt);
	menuShowHide();
	return false;
}
if(ichkdlen) StartSorting();
}
/*
 * Remove glued topics
 */
var filtered = false;
function goodtalks(isAll){
	tlog("goodtalks()");
	var CurURL = getURL();
	if(isAll){
		var pos = CurURL.indexOf("/"), count;
		for(count = 0; pos != -1; count++)
			pos = CurURL.indexOf("/", pos + 1);
		if(count != 2) return; // remove attached anywhere
	}else
		if(CurURL != "www.linux.org.ru/forum/talks" && !filtered) return;
	var i, blk = document.getElementsByClassName("infoblock");
	for(i = blk.length-1; i > -1; i--){
		rmElement(blk[i]);
	}
	blk = document.getElementsByTagName("td");
	// remove attached
	for(i = blk.length-1; i > -1; i--){
		for (var c in blk[i].children){
			var C = blk[i].children[c];
			if(C.nodeName == "IMG" && C.title == "Прикреплено"){
				rmElement(blk[i].parentNode);
				break;
			}
		}
	}
	filtered = true;
}
function rmAttInAll(){
	goodtalks(true);
}
function rmAttInTalks(){
	goodtalks(false);
}
/*
 * button "knock-knock!"
 */
var knockHref = "", badHref = "";
function knock_knock(e){
tlog("knock-knock!");
noDef(e);
var T = e.target;
rmElement($("RePoRtFoRm"));
rmElement($("cnockFrame"));
if(knockHref == ""){
	var iF = document.createElement('iframe');
	iF.id = "innerFrame";
	iF.width = 0; iF.height = 0; iF.style.display = "none";
	document.body.appendChild(iF);
	iF.onload = iframeIsLoaded;
	iF.src = "/forum/linux-org-ru/";
	var Wto = setTimeout(LORready, 300);
	return false;
}else MKmalyava();
function LORready(){
	clearTimeout(Wto);
	if(!iframeLoaded){
		if(nTries > 10){
			rmElement($("innerFrame"));
			IFRMerror();
			return;
		}
		nTries++;
		Wto = setTimeout(LORready, 300);
		return;
	};
	var iF = $("innerFrame");
	var D = (iF.contentDocument) ? iF.contentDocument : iF.contentWindow.document;
	var i, blk = D.getElementsByTagName("td");
	for(i in blk){
		for (var c in blk[i].children){
			var C = blk[i].children[c];
			if(C.nodeName == "I"){
				var A = C.nextElementSibling;
				if(A.nodeName == "I") // пропускаем знак "Решето"
					A = A.nextElementSibling;
				tlog(A.innerHTML);
				if(A.innerHTML.indexOf("Ссылки на некорректные сообщения") > -1){
					var hr = A.href.replace(/.*\//,"");
					knockHref = "/comment-message.jsp?topic=" + hr.replace(/\?.*/, "");
					i = blk.length + 1;
				}
				break;
			}
		}
	}
	rmElement(iF);
	if(knockHref != "") MKmalyava();
}
var pMsg;
function MKmalyava(){
	var i, href = "";
	pMsg = T;
	while(pMsg.className != "msg") pMsg = pMsg.parentElement;
	href = getMsgURL(pMsg);
	if(href == ""){ alert("Упс. Ссылка потерялась!"); return;}
	badHref = href;
	var iF = document.createElement('iframe');
	iF.id = "cnockFrame";
	iF.width = 0; iF.height = 0; iF.style.display = "none";
	document.body.appendChild(iF);
	iF.onload = fillFrame;
	iF.src = knockHref;
}
function fillFrame(){
	var iF = $("cnockFrame");
	var D = (iF.contentDocument) ? iF.contentDocument : iF.contentWindow.document;
	var msg, form = D.getElementById("commentForm");
	if(typeof(form) == "undefined" || form == null){
		alert("Ошибка загрузки формы"); rmElement(iF); return;
	}
	var F = document.createElement('div');
	F.style.border = "2px dotted"; F.style.padding = "5px";
	F.id = "RePoRtFoRm";
	//F.innerHTML = form.outerHTML;
	F.innerHTML = "<textarea id=\"RepMsg\" required=\"\" cols=\"100\" rows=\"5\"></textarea>"+
				"<br><br><button id=\"putMSG\">Поместить</button>&nbsp;&nbsp;"+
				"<button id=\"cnslMSG\">Отмена</button>";
	insertAfter(F, pMsg);
	$("putMSG").onclick = sbmForm;
	$("cnslMSG").onclick = rmForm;
	msg = $("RepMsg");
	msg.value = "Некорректное сообщение:\n\n" + badHref;
	msg.focus();
}
function rmForm(){rmElement($("RePoRtFoRm")); rmElement($("cnockFrame"));}
function sbmForm(){
	var iF = $("cnockFrame");
	iF.onload = delFrm;
	var D = (iF.contentDocument) ? iF.contentDocument : iF.contentWindow.document;
	var form = D.getElementById("commentForm");
	var msg = D.getElementById("msg");
	var ori = $("RepMsg");
	msg.value = ori.value;
	rmElement($("RePoRtFoRm"));
	form.submit();
}
function delFrm(){rmElement($("cnockFrame")); alert("Жалоба принята");}
return false;
}

/*
 * Spoiler-like show/hide tags in profile
 */
function mkSpoiler(){
	tlog("mkSpoiler()");
function SwitchVis(e){
	var F = e.target;
	if(F.nodeName == "LEGEND") F = F.parentNode;
	if(F.nodeName != "FIELDSET") return;
	noDef(e);
	for (var c in F.children) {
		var C = F.children[c];
		if(C.nodeName != "LEGEND" && C.nodeType == 1)
			C.style.display = (C.style.display == "none") ? "block" : "none";
	}
}
var fields = document.getElementsByTagName("fieldset");
var L = fields.length;
for(var i = 0; i < L; i++){
	var F = fields[i];
	var invis = 0;
	for (var c in F.children) {
		var C = F.children[c];
		if(C.nodeName == "LEGEND" && C.innerHTML.indexOf("теги") > -1){
			invis = 1;
			F.onclick = SwitchVis;
			C.onclick = SwitchVis;;
		}else{
			str = "invis = " + invis + " text = " + C.innerHTML + " type=" + C.nodeType;
			if(invis && C.nodeType == 1){
			C.style.display = "none";
			}
		}
	}
}
}

/*
 * Remove idiot symbols of quasy-eye and so on
 */
function idioticSymbolsRemove(){
	tlog("idioticSymbolsRemove()");
// original of next functions was snatched from LOR code, don't beat me for it!s
if(!$("memories_count") || !$("favs_count")) return;
var memcntr = Number($("memories_count").innerHTML);
var favcntr = Number($("favs_count").innerHTML);
function memories_add(event, id, w) {
	event.preventDefault();
	var target = $(id);
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("click", true, true);
	target.dispatchEvent(evt);
	memories_form_setup(w,0);
}
function memories_remove(event, id, w){
	event.preventDefault();
	var target = $(id);
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("click", true, true);
	target.dispatchEvent(evt);
	memories_form_setup(w,0);
}
function memories_form_setup(watch, clear) {
	var el, Id, ParentId, text;
	var memcntr = Number($("memories_count").innerHTML);
	var favcntr = Number($("favs_count").innerHTML);
	if (watch){
		Id = 'memories0_button';
		ParentId = 'memories_button';
	}else{
		Id = 'favs0_button';
		ParentId = 'favs_button';
	}
	el = $(Id);
	if(typeof(clear) != "undefined"){
		text = "Подождите, пожалуйста";
	}else{
		parCls = $(ParentId).className;
		if (parCls=="") {
			text = watch?"Отслеживать ("+memcntr+")":"В избранное ("+favcntr+")";
			el.onclick = function(evt){ memories_add(evt, ParentId,watch);};
		} else {
			text = watch?"Не отслеживать ("+memcntr+")":"Удалить из избранного ("+favcntr+")";
			el.onclick = function(evt){ memories_remove(evt, ParentId,watch);};
		}
	}
	el.title = text;
	el.innerHTML = text;
}
var NonShown = document.getElementsByClassName("fav-buttons");
for(var i=0,j=NonShown.length; i<j; i++) NonShown[i].style.display = "none";
var TM = $("topicMenu");
if(!TM) return; // edit topic
var favs = document.createElement("li");
var mems = document.createElement("li");
favs.innerHTML = "<a id='favs0_button' href='#'></a>";
mems.innerHTML = "<a id='memories0_button' href='#'></a>";
TM.appendChild(favs);
TM.appendChild(mems);
var Itimeout = window.setInterval(initForms, 300);
function initForms(){
	clearInterval(Itimeout);
	memories_form_setup(false);
	memories_form_setup(true);
	Itimeout = window.setInterval(initForms, 3000);
}
var shit = document.getElementsByClassName("icon-tag");
if(shit.length > 0) for(var i = shit.length - 1; i > -1; i--) rmElement(shit[i]);
}

/*
 * Format datetime
 */
function ShowSecondsInDate(){
	tlog("ShowSecondsInDate()");
	var Tt = document.getElementsByTagName("time");
	for(var T in Tt){
		var A = Tt[T].attributes;
		if(!A || !A.datetime) continue;
		var aDate = new Date(A.datetime.value);
		Tt[T].innerHTML = aDate.toLocaleDateString() + " " + aDate.toLocaleTimeString();
	}
}

function SortBackwards(){
	var comments = document.getElementsByClassName("msg");
	var nav = $("comments");
	var L = comments.length;
	for(var l = L - 1; l > 0; l--)
		nav.appendChild(comments[l]);
}

function HideSimilar(){
	rmElement($("related-topics"));
}

/*
 * Script originally written by moscwich
 */
function AddUserPanel(){
	tlog("AddUserPanel()");
function removeElements () {
	tlog("remove "+arguments.length+" elements");
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
panel.createBlock =
	function () {
		block = document.createElement ("span");
		for (i = 0; i < arguments.length; i++) {
			link = document.createElement ("a");
			link.textContent = arguments[i][0];
			link.title = arguments[i][1];
			link.exec = arguments[i][2];
			link.onclick = function(e){
				noDef(e)
				eval(this.exec);
				return false;
			}
			block.appendChild (link);
		}
		return this.appendChild (block);
	}
panel.createBlock (
	 ["[b]", "Полужирный", 'intag ("b");']
	,["[i]", "Курсив", 'intag ("i");']
	,["[s]", "Зачеркнутый", 'intag ("s");']
/*	,["[u]", "Подчеркнутый", 'intag ("u");']*/
);
panel.createBlock (
	 ["[quote]", "Цитата", 'intag ("quote", "\\n");']
	,["[latex]", "Формула латех", 'intag ("latex");']
	,["[code]", "Код", 'intag ("code", "\\n");']
	,["[inline]", "Внутристрочный код", 'intag ("inline");']
);
panel.createBlock (
	 ["[url]", "URL", 'url ();']
	,["[user]", "Участник", 'intag ("user");']
);
panel.createBlock (
	 ["[list]", "Список", 'lst();']
	,["[*]", "Элемент списка", 'wrtSel ("[*]", "");']
);
panel.createBlock (
	["«»", "Кавычки", 'wrtSel ("«", "»");'],
	["„“", "Кавычки", 'wrtSel ("„", "“");'],
	["[br]", "Перевод строки", 'wrtSel ("[br]", "");']
);
panel.createBlock (
	[" fix ", "Превратить знаки и обозначения в соответствующие спец. символы", 'fix();']
	/*,[" deltags-in ", "Удалить крайнее входящие обрамление тегами", 'deltagsin ();']*/
	,[" brs ", "Добавить [br] к переводам строк", 'brs ();']
);

msg.parentNode.insertBefore (panel, msg);
msg.cols = 100;
msg.rows = 20;

// Styles
obj = document.createElement ("style");
obj.innerHTML =
	'#atag a {\
		padding:2px 3px; margin:2px; cursor: pointer;\
		text-decoration: none; color: #FFF !important;\
		background-color:#004; border: #888 outset 1px;\
	}\
	#atag a:hover {background-color:#008; border-color:#888;}\
	#atag {\
		margin-top: 5px; margin-bottom: 5px;\
		padding: 3px 1px; font-size: 0.9em;\
	}\
	#atag > span {margin-right: 4px;}\
	label[for="msg"] {display: inline-block; margin-top: 5px;}\
	#msg {width: 50em !important;}\
	label[for="title"], label[for="form_mode"] {display: inline-block; margin: 5px 0 3px 0;\
	.msg_body p {margin: 0.3em 0 !important;}\
	.quote > p {margin: 0.5em 0 0.3em 0 !important;}';
document.getElementsByTagName ("head")[0].appendChild (obj);

// Add quote links
function cre_links(o, L){
	var S = document.createElement("span");
	tlog("LEN: " + L.length + " obj: " + o);
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
		S.appendChild(d)
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
		var A = Array.prototype.slice.call(arguments)
		cre_links(this[i], A);
	}
}
t.createQlink(['#', insurl], ['пожаловаться', knock_knock], ['юзер', user],
			['блок-цитата', qb], ['цитата', q]
			);
t = document.getElementsByTagName("header")[0];
cre_links(t, [['#', insurl], ['пожаловаться', knock_knock], ['юзер', user],
			['блок-цитата', qb], ['цитата', q]]
			);

// Add \n to <br>
var mbs = document.getElementsByClassName("msg_body");
for (j in mbs) if (!isNaN (j)) {
	var mps = mbs[j].getElementsByTagName ("p");
	for (i in mps)
		if (!isNaN (i))
			mps[i].innerHTML = mps[i].innerHTML.replace (/<br\/?>(?![\n\r])/g, "<br>\n");
}


	/*		Main		*/

//	Auxiliary functions
function wrtSel(subj, offset, before, after, zset){ //Also msg.wrtSel (before, after, offset)
	tlog("MSGWRT!!!");
	if(typeof offset == "string")
		var
			after = offset, offset = before,
			before = subj, subj = undefined;
	var
		before = before || "", after = after || "",
		offset = set (offset, before.length), zset = zset || 0;
	var
		startSel = set (a, msg.selectionStart), endSel = set (b, msg.selectionEnd),
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
	if(z.length == 0) z = "[*]\n";
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
	if (i = post.getElementsByClassName("sign")[0].getElementsByTagName("a")[0])
		return i.innerHTML;
	else return "anonymous";
}

// Functions to run
function intag (tag, arg) {
	var arg = arg || "";
	wrtSel(
		undefined,
		tag.length + 2 + arg.length*2,
		arg + "[" + tag + "]" + arg,
		arg + "[/" + tag + "]" + arg
	);
}

// reparce quotations if checked in glob settings
function reparceinline(text){
	var bef = text.split("[inline]");
	bef[0] = bef[0].replace(/"/g, "&#34;");
	var N = bef.length;
	for(var m = 1; m < N; m++){
		var aft = bef[m].split("[/inline]");
		aft[1] = aft[1].replace(/"/g, "&#34;");
		bef[m] = aft.join("[/inline]");
	}
	text = bef.join("[inline]");
	return text;
}
function reparce(text){
	var bef = text.split("[code]");
	//bef[0] = bef[0].replace(/"/g, "&#34;");
	bef[0] = reparceinline(bef[0]);
	var N = bef.length;
	for(var m = 1; m < N; m++){
		var aft = bef[m].split("[/code]");
		//aft[1] = aft[1].replace(/"/g, "&#34;");
		aft[1] = reparceinline(aft[1]);
		bef[m] = aft.join("[/code]");
	}
	text = bef.join("[code]");
	return text;
}
tlog("rep: "+Glob["reparceQuots"]);
if(Glob["reparceQuots"]){form.onsubmit = function(){msg.value = reparce(msg.value);}}

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
	}
	if (a != b) {
		var c = msg.value.substring (a, b);
		var z = repc (c);
		wrtSel(z, 0, "", "", z.length - c.length);
	}
	else
		msg.value = repc (msg.value);
}
function url(U){
	var U = U || "";
	a = msg.selectionStart; b = msg.selectionEnd;
	z = msg.value.substring (a, b);
	if(U != ""){
		wrtSel (z, 6+U.length,
			"[url=" + U + "]", "[/url]",
			-z.length
		);
	}
	else if (/((ftp|http|https):\/\/)[\.\w- ]{2,}\.[A-Za-z]{2,4}(\/?$|\/.*)/.test(z) || z.length == 0) {
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
	//else if(chN.className == "quote"){Tpre="[quote]"; Tpost="[/quote]";}
	else if(chN.nodeName == "BLOCKQUOTE"){Tpre="[quote]"; Tpost="[/quote]";}
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
		var T = "[quote" + (getMsg(o) != getMsg(msg)
		? "=" + getUserName (e)
		: "") + "]"
		+ substTags(s) + "\n[/quote]\n\n";
		return T.replace(/(^[ \t]*\n)/gm, "")
	}
	if (seltxt != "") {
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
	console.log(seltxt);
	if (seltxt != "") {
		var post = getMsg(seltxt.getRangeAt(0).commonAncestorContainer);
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
}


// *****************************************************************************
// here - all functions that have no setup in profile
/*
 * Allow to put html tags into user info
 */
var UInfoArr = document.getElementsByClassName("user-remark");
tlog("L+"+UInfoArr.length );
for(var i = 0, j = UInfoArr.length; i < j; i++){
	str = UInfoArr[i].innerHTML;
	tlog(str);
	str = str.replace(/&lt;/g, "<");
	str = str.replace(/&gt;/g, ">");
	UInfoArr[i].innerHTML = str;
}

/*
 * Convert contents of tag [latex] into image from codecogs
 */
function showLatex(){
	var t = document.getElementsByClassName("msg_body");
	function chk(a,str){
		if(a) return str;
		else return '';
	}
	function getInner(str, fstrun){
		var a = str.indexOf("[latex]");
		if(a == -1) return chk(fstrun, str);
		var b = str.indexOf("[/latex]", a+7);
		if (b == -1) return chk(fstrun, str);
		var head = str.substr(0, a);
		var tail = str.substr(b+8);
		var midtext = str.substr(a+7, b-a-7);
		return head + "<img src=\"http://latex.codecogs.com/svg.latex?"+
			midtext+"\""+"title=\""+midtext+"\">"+getInner(tail,1);
		//return head + "<img src=\"http://texify.com/img/\\LARGE\\!" +
		//return head + "<img src=\"http://texify.com/img/" +
		//	midtext + ".gif\" " + "title=\""+midtext+"\">"+getInner(tail,1);
	}
	t.parceLatex = function(){
		var L = this.length;
		for(i = 0; i < L; i++){
			var txt = this[i].innerHTML, newtxt = '', innertext='';
			innertext = getInner(txt, 0);
			if(innertext.length == 0) continue;
			this[i].innerHTML = innertext;
			tlog(innertext);
		}
	}
	t.parceLatex();
}
showLatex();

}());

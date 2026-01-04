// ==UserScript==
// @name     CWEditor For Browsers
// @version  1.5.4.1
// @include http://*.cyber-warrior.org*
// @include https://*.cyber-warrior.org*
// @include https://*.ihbarweb.org.tr*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @description  www.cyber-warrior.org için HTML Editör
// @namespace https://greasyfork.org/users/256866
// @downloadURL https://update.greasyfork.org/scripts/379443/CWEditor%20For%20Browsers.user.js
// @updateURL https://update.greasyfork.org/scripts/379443/CWEditor%20For%20Browsers.meta.js
// ==/UserScript==
/*global unsafeWindow*/


var document_css = "\
.ozeltag .td_context{\
  border: 1px solid gray;\
}\
.ozeltag .ozeltag_kapat{\
  border: 1px solid gray;\
  border-bottom: none;\
  background-color: white;\
  border-radius: 8px 8px 0px 0px;\
  cursor: pointer;\
  font-size: small;\
  color: lightslategray;\
  z-index: 99;\
}\
.ozeltag .ozeltag_kapat:hover{\
  background-color: whitesmoke;\
  color: darkslategray;\
}\
#toolbar {\
  border-top-left-radius:10px;\
  border-top-right-radius:10px;\
}\
#font {\
  margin-left: 5px;\
}\
#editorturu{\
  margin-right: 5px;\
}\
#editor_boyut_div {\
 border: 1px solid gray;\
}\
#editor_bottom_last{\
  border-bottom-left-radius:10px;\
  border-bottom-right-radius:10px;\
}\
#messageCWF, #message_CWEditor {\
  border: 2px solid gray;\
}\
.Toolbar span.Text{\
  margin: 2px;\
}\
.dropdown-content li:first-child{\
  border-top: none;\
}\
.dropdown-content ul {\
  list-style: none;\
  margin:unset;\
  padding:unset;\
}\
.dropdown-content li {\
  color: unset;\
  padding: 12px 12px;\
  text-decoration: none;\
  display: block;\
  border-top: 1px solid #bad9ba;\
  font-size: unset;\
  cursor: pointer;\
}\
\
.dropdown-content li:hover {background-color: #cff9d4}\
.dropdown-content {\
  display: none;\
  position: absolute;\
  background-color: #eefbf6;\
  width: calc(100% - 2px);\
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
  z-index: 1;\
  border: 1px solid #098d00;\
  color: #187c28;\
  font-size:smaller;\
  margin-top: 1px;\
}\
.drop_div{\
  width: 22%;\
  position: relative;\
  display: inline-block;\
  margin: 6px 3px;\
}\
#editor_bottom input, button{\
  background-color: #36ad1e;\
  color: white;\
  text-align: center;\
  text-decoration: none;\
  font-size: 12px;\
  cursor: pointer;\
  border: 2px solid #098d00;\
  margin: 6px 3px;\
  padding: 6px 12px;\
  width: 22%;\
  border-radius: 3px;\
  white-space: normal;\
  word-wrap: unset;\
}\
#editor_bottom input:hover, button:hover {\
  border: 2px solid #00c208;\
  background-color: #5cd72e;\
  font-weight: bold;\
}\
#editor_bottom input:active, button:active {\
  background-color: #3bd21d;\
  text-decoration: underline;\
  font-weight: bold;\
  border: 2px solid lightgreen;\
}\
#editor_bottom input:disabled, button:disabled  {\
  border: 2px solid #e2f9e3;\
  color: #989898;\
  background-color: #f2fff3;\
  cursor: default;\
  font-weight: normal;\
  text-decoration: none;\
  white-space: normal;\
  word-wrap: unset;\
}\
#toolbar_smileys div {\
    align-items: center;\
    width: 40px; \
    height: 40px; \
    border: 1px solid gray;\
    display: inline-flex;\
    float:left;\
}\
#toolbar_smileys div:hover {\
  background-color: #f2fff3;\
  cursor: pointer;\
}\
#toolbar_smileys a {\
    position: relative;\
    top: 0;\
    bottom: 0;\
    margin: auto;\
    cursor: hand;\
}\
#toolbar_smileys img {\
    position: relative;\
    top: 0;\
    bottom: 0;\
    margin: auto;\
    cursor: hand;\
}\
.img_tool {\
    position: absolute;\
    top: 0;\
    bottom: 0;\
    margin: auto;\
}\
.image {\
    min-height: 50px\
}\
.Toolbar\
{\
	list-style: none;\
	width: 700px;\
	height: auto;\
	margin: 0;\
	border: 1px solid #CCCCCC;\
	background-repeat: repeat-x;\
	background: #D4FFDF;\
}\
.Smileys\
{\
	list-style: none;\
	width: 700px;\
	margin: 0;\
	padding: 0 0 1 2px;\
	border: 1px solid black;\
	background-repeat: repeat-x;\
	background: #E7EEF5;\
}\
.selected\
{\
    padding: 5px;\
    border: 1px solid limegreen;\
    background: lime;\
    float: left;\
    display: block;\
}\
#imgtoolbar img:not([class='selected'])\
{\
    padding: 5px;\
    display: block;  \
    border: 1px solid #a2db8e;;\
    float: left;\
}\
#imgtoolbar img:not([class='selected']):hover { \
  border-color: DarkSeaGreen;\
  background-color: lightgreen;\
}\
.selected:hover\
{\
  border-color: DarkSeaGreen;\
  background-color: limegreen;\
}\
textarea\
{\
	margin: 0;\
	clear: left;\
	border-color: black;\
	border-bottom-width: 1px;\
}\
.CWF\
{\
	background: #FFFFFF;\
}\
.cwe_modal {\
    display: none;\
    position: fixed;\
    z-index: 1;\
    padding-top: 150px;\
    left: 0;\
    top: 0;\
    width: 100%;\
    height: 100%;\
    overflow: auto;\
    background-color: rgb(0,0,0);\
    background-color: rgba(0,0,0,0.4);\
}\
.cwe_modal-content {\
    background-color: #fefefe;\
    margin: auto;\
    padding: 20px;\
    border: 1px solid #888;\
    width: 25%;\
}\
.cwe_modal2 {\
    display: none;\
    position: fixed;\
    z-index: 1;\
    padding-top: 150px;\
    left: 0;\
    top: 0;\
    width: 200%;\
    height: 200%;\
    overflow: auto;\
    background-color: rgb(0,0,0);\
    background-color: rgba(0,0,0,0.4);\
}\
.cwe_modal2-content {\
    background-color: #fefefe;\
    margin: auto;\
    padding: 20px;\
    border: 1px solid #888;\
    width: 50%;\
}\
.cwe_close {\
    color: #aaaaaa;\
    float: right;\
    font-weight: bold;\
}\
.cwe_close:hover,\
.cwe_close:focus {\
    color: #000;\
    text-decoration: none;\
    cursor: pointer;\
}";

Giris();
function Giris()
{
		//AddScriptFile("file://C:/CWEF/data/CWEditor.js");
        //AddCssFile("file:///C:/CWEF/data/CWEditor.css");
        GM_addStyle(document_css);
	}

function AddScriptFile(location)
{
	var ExModFile = document.createElement('script');
	ExModFile.setAttribute("type","text/javascript");
    ExModFile.setAttribute("src", location);
	ExModFile.setAttribute("charset", "UTF-8")
	document.getElementsByTagName("head")[0].appendChild(ExModFile);
}
function AddCssFile(location)
{
    var ExModFile = document.createElement('link');
    ExModFile.setAttribute("rel","stylesheet");
	ExModFile.setAttribute("type","text/css");
    ExModFile.setAttribute("href", location);
	ExModFile.setAttribute("charset", "UTF-8")
	document.getElementsByTagName("head")[0].appendChild(ExModFile);
}
function getElementByXpath(basedocument, parentd, path) {
  return basedocument.evaluate(path, parentd, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function FindHtmlElement(Mnodename, text)
{
	var alldoc = document.getElementsByTagName(Mnodename);
	if(alldoc == null) return false;
	for(var i = 0; i < alldoc.length; i++)
	{
		if(alldoc[i].innerHTML == text)
		{
			return alldoc[i];
		}
	}
	return null;
}
function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
};
function isValidEMail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function GetHtmlElement2(mDocument, Mnodename, attribute, value, isendwith = true)
{
	var alldoc = mDocument.getElementsByTagName(Mnodename);
	if(alldoc == null) return false;
	for(var i = 0; i < alldoc.length; i++)
	{
		if(alldoc[i].getAttribute(attribute) == undefined || alldoc[i].getAttribute(attribute) == null) continue;
		if(!isendwith)
		{
			if(alldoc[i].getAttribute(attribute) == value)
			{
				return alldoc[i];
			}
		}
		else
		{
			if(alldoc[i].getAttribute(attribute).endsWith(value))
			{
				return alldoc[i];
			}
		}
	}
	return null;
}
function GetHtmlElementInner(mDocument, Mnodename, value)
{
	var alldoc = mDocument.getElementsByTagName(Mnodename);
	if(alldoc == null) return false;
	for(var i = 0; i < alldoc.length; i++)
	{
		if(alldoc[i].innerHTML == value)
		{
			return alldoc[i];
		}
	}
	return null;
}
function GetHtmlElement(Mnodename, attribute, value, isendwith = true)
{
	return GetHtmlElements(document, Mnodename, attribute, value, isendwith)[0];
}
function GetHrefElements(mDocument)
{
	var mArray = new Array();
	var alldoc = mDocument.getElementsByTagName("a");
	if(alldoc == null) return false;
	for(var i = 0; i < alldoc.length; i++)
	{
		for(var j = 2; j < arguments.length;j++)
		{
			var value = arguments[j];
			if(alldoc[i].href.toLowerCase() == value.toLowerCase())
			{
				mArray.push(alldoc[i]);
			}
		}
	}
	return mArray;
}
function GetHtmlElements(mDocument, Mnodename, attribute, value, isendwith = true)
{
	var mArray = new Array();
	var alldoc = mDocument.getElementsByTagName(Mnodename);
	if(alldoc == null) return false;
	for(var i = 0; i < alldoc.length; i++)
	{
		if(alldoc[i].getAttribute(attribute) == undefined || alldoc[i].getAttribute(attribute) == null) continue;
		if(!isendwith)
		{
			if(alldoc[i].getAttribute(attribute)== value)
			{
				mArray.push(alldoc[i]);
			}
		}
		else
		{
			if(alldoc[i].getAttribute(attribute).endsWith(value))
			{
				mArray.push(alldoc[i]);
			}
		}

	}
	return mArray;
}
function GetHtmlDoFunc(mUrlAdres, mFunc)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", mUrlAdres, true);
	xmlHttp.overrideMimeType('text/html; charset=iso-8859-9');
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		  mFunc(xmlHttp);
		}
	};
    xmlHttp.send(null);
}
function GetHtmlDoFuncPost(mUrlAdres, mFunc, mData)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", mUrlAdres, true);
	xmlHttp.overrideMimeType('text/html; charset=iso-8859-9');
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		  mFunc(xmlHttp);
		}
	};
    xmlHttp.send(mData);
}

function GetHtml(mUrlAdres)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", mUrlAdres, true);
	xmlHttp.overrideMimeType('text/html; charset=iso-8859-9');
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function GetPage()
{
	var tsplt = document.URL.split('/');
	var webst = null;
    var webex = null;
	if(tsplt != null)
	{
		webst = tsplt[tsplt.length - 1];
		webex = webst.split('?');
		if(webex != null)
		{
			webst = webex[0];
		}
	}
	if(webst != null)
	{
		webex = webst.split('#');
		if(webex != null) webex = webst[0];
	}
	return webst;
}
function GetDataValue(mUrlStr, mName)
{
	var mSplt = mUrlStr.split('?');
	if(mSplt == null) return null;
	if(mSplt.length <= 1) return null;
	var DataArea = mSplt[1];
	mSplt = DataArea.split('&');
    var ValueEx;
	if(mSplt != null)
	{
		for(var i = 0; i < mSplt.length; i++)
		{
			ValueEx = mSplt[i].split('=');
			if(ValueEx[0].toLowerCase() == mName.toLowerCase())
			{
				if(ValueEx.length > 1)
				{
					return ValueEx[1];
				}
				else
				{
					return "";
				}
			}
		}
	}
	else
	{
		ValueEx = mSplt.split('=');
		if(ValueEx[0].toLowerCase() == mName.toLowerCase())
		{
			if(ValueEx.length > 1)
			{
				return ValueEx[1];
			}
			else
			{
				return "";
			}
		}
	}
	return null;
}
function Str_StartWith(mstring, mvalue)
{
	if(mstring == null) return false;
	if(mvalue == null) return false;
	if(mvalue.length > mstring) return false;
	if(mstring.substring(0, mvalue.length) == mvalue) return true;
	return false;
}
function StringFormat(tstring)
{
	if(arguments.length < 1) return null;
	if(arguments.length == 1) return tstring;
	for(var i = 1; i < arguments.length;i++)
	{
		tstring = tstring.split("{" + (i - 1).toString() + "}").join(arguments[i].toString());
	}
	return tstring;
}
var mvalue = "";

function GetCookieArray()
{
	var Arr = new Array();
	var Excook = document.cookie;
	if(Excook == null) Excook = "";
	var mSplt = Excook.split(";");
	var mValueEx;
	var mName_M = "";
	var mValue = "";
    var mAyarItem;
	if(mSplt != null && Excook.length > 0)
	{
		for(var i = 0; i < mSplt.length; i++)
		{
            mValueEx = mSplt[i].indexOf('=');
			mName_M = "";
			mValue = "";
			if(mValueEx == -1)
			{
				mName_M = mSplt[i];
			}
			else
			{
				mName_M = mSplt[i].substring(0, mValueEx);
				mValue = mSplt[i].substring(mValueEx + 1);
			}
			mName_M = mName_M.trim();
			mAyarItem = new function() {
				this.AyarAd = mName_M;
				this.AyarDeger = mValue;
				return this;
			};
			Arr.push(mAyarItem);
		}
	}
	else
	{
		mValueEx = Excook.indexOf('=');
		mName_M = "";
		mValue = "";
		if(mValueEx == -1)
		{
			mName_M = Excook
		}
		else
		{
			mName_M = Excook.substring(0, mValueEx);
			mValue = Excook.substring(mValueEx + 1);
		}
		if(mName_M == null) mName_M = "";
		mName_M = mName_M.trim();
		if(mName_M == "")
		{
			return Arr;
		}
		mAyarItem = new function() {
			this.AyarAd = mName_M;
			this.AyarDeger = mValue;
			return this;
		};
		Arr.push(mAyarItem);
	}
	return Arr;
}
function GetCookie(mName)
{
	var Arr = GetCookieArray();
	if(Arr.length == 0) return null;
	for(i = 0; i < Arr.length; i++)
	{
		if(Arr[i].AyarAd.toLowerCase() == mName.toLowerCase())
		{
			return Arr[i].AyarDeger;
		}
	}
	return null;
}
function SetCookie(mName, mValue)
{
	if(mName.indexOf(";")>= 0) return false;
	var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = mName + "=" + mValue.toString() + "; " + expires + "; path=/";
	return true;
}
function DeleteCookie(mName, mValue)
{
	if(GetCookie(mName) == null) return false;
	document.cookie = mName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
	return true;
}
function DeleteArray(ArrayBase, index)
{
	if(ArrayBase == null) return ArrayBase;
	if(ArrayBase.length == 0) return ArrayBase;
	if(index < 0) return ArrayBase;
	if(index >= ArrayBase.length) return ArrayBase;
	var ArrayN = new Array(ArrayBase.length - 1);
	var total = 0;
	for(i = 0; i < ArrayBase.length; i++)
	{
		if(i == index) continue;
		ArrayN[total] = ArrayBase[i];
		total++;
	}
	return ArrayN;
}
function CWETimListesiniAl(cwtimdokuman)
{
	var CWETimlistesi = new Array();
	var CWETimHtmlText = GetHtml("https://www.cyber-warrior.org/Forum/OYS.Asp");
	var CWETimHtmlText = cwtimdokuman;
	if(CWETimHtmlText == null) return;
	var TiMparser = new DOMParser();
    var xmlDocTim = TiMparser.parseFromString(CWETimHtmlText,"text/html");
	var ilkKisimTL = GetHtmlElementInner(xmlDocTim, "td", "TIM Lideri ");
	if(ilkKisimTL == null) ilkKisimTL = GetHtmlElementInner(xmlDocTim, "td", "TIM Lideri");
	if(ilkKisimTL == null) return CWETimlistesi;
	var ikinciKisim = ilkKisimTL.parentNode.parentNode;
	for(cwetimi = 2; cwetimi < ikinciKisim.children.length - 1; cwetimi++)
	{
		var cwetimcurTrElem = ikinciKisim.children[cwetimi];
		var cwetimElem = new function() {
			this.TimAdi = getElementByXpath(xmlDocTim, cwetimcurTrElem, "td[1]/a").innerHTML;
			this.TimLink = "https://www.cyber-warrior.org/Forum/OYS.Asp" + getElementByXpath(xmlDocTim, cwetimcurTrElem, "td[1]/a").getAttribute("href");
			this.TimOuter = StringFormat('<a href="{0}">{1}</a>', this.TimLink, this.TimAdi);
			return this;
		};
		CWETimlistesi.push(cwetimElem);
	}
	return CWETimlistesi;
}
function CWETimListesiIndexOf(CWETimList, CWETimLink)
{
	if(CWETimList == null) return -1;
	for(cwetimj = 0; cwetimj < CWETimList.length; cwetimj++)
	{
		if(CWETimList[cwetimj].TimLink.toLowerCase() == CWETimLink.toLowerCase()) return cwetimj;
	}
	return -1;
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function setformpassword(formid, activeuser, fpassword)
{
	if(activeuser == "") return;
	var frmidtext = activeuser + "_frm_" + formid;
	var frmidcrypt = getformname(formid, activeuser);
	var passwordcrypt = CryptoJS.AES.encrypt("ar-ge_" + fpassword, "ar-ge_" + activeuser + "_" + formid);
	GM_setValue(frmidcrypt, passwordcrypt.toString());
}
function getformpassword(formid, activeuser, deleteafter = false)
{
	if(activeuser == "") return "";
	var frmidcrypt = getformname(formid, activeuser);
	var frmpassword = GM_getValue(frmidcrypt, "");
	if(deleteafter)
	{
		GM_deleteValue(frmidcrypt);
	}
	if(frmpassword == "") return "";
	var frmpassword_decoded = CryptoJS.AES.decrypt(frmpassword, "ar-ge_" + activeuser + "_" + formid);
	if(frmpassword_decoded == undefined || frmpassword_decoded == null) return "";
	frmpassword_decoded = frmpassword_decoded.toString(CryptoJS.enc.Utf8);

	if(!frmpassword_decoded.startsWith("ar-ge_")) return "";
	return frmpassword_decoded.replace("ar-ge_", "");
}
function getformname(formid, activeuser)
{
	if(activeuser == "") return "";
	var frmidtext = activeuser + "_frm_" + formid;
	var fmridcrypt = md5("ar-ge_" + activeuser + "_" + formid);
	return fmridcrypt.toString();
}
function deleteformpass(formid, activeuser)
{
	if(activeuser == "") return "";
	var frmidcrypt = getformname(formid, activeuser);
	GM_deleteValue(frmidcrypt);
}
var totalitem = 0;
var pms = 0;
var pms_real = 0;
var pms_bahsedilme = 0;
var pms_begeni = 0;
var keflt = 0;
var moys = 0;
var moysother = 0;
var mpmsmaxp = 0;
var mpmscurp = 0;
var cwe_inf_sayisi = 0;
var mntw = 0;
var intervaladded = false;
var controlled = 0;
var lastselindex = -1;
var Surum = "1.5.4";
var SPMS_a = "";
var SPMS_b = "";
var SPMS_c = "";
var mCurrentUTPM = new Array();
var mCurrentUTPMIndex = 0;
var mnaccble = false;
unsafeWindow.sbmtresult = false;
var genbgcolor = "#ffffff";
var AnaSayfada = false;
unsafeWindow.AnaSayfada = false;
var CWEYuklendi = false;
var CWEGecerliSayfa = "";
var OYSSayfasinda = false;
unsafeWindow.OYSSayfasinda = false;
var CWE_CreatePMInner = "";
var CWE_Guncelleniyor = false;
var TimListesiCWE;
var cwe_curelement = undefined;
var cwe_activeusername = "";
var onkeydownmsg_cwe;
Baslangic();
function TasarimDuzenle()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return;
	if(document.getElementById("cwe_bildirimyeri") != null) return;

	//if(document.URL.toLowerCase().indexOf("/forum/") < 0) return;

	var TabloElem = undefined;
	if(GirisYapildi2())
	{
		var nXElemX = GetHtmlElements(document, "a", "href", "MemberNetwork.Asp", true)[0];
		if(nXElemX == undefined || nXElemX == null) return;
		TabloElem = nXElemX.parentNode.parentNode.parentNode.parentNode;

	}
	else
	{

		var nXElemX = GetHtmlElements(document, "a", "href", "pop_up_profile.asp?profile=0", true)[0];
		if(nXElemX == undefined || nXElemX == null) return;
		TabloElem = nXElemX.parentNode.parentNode.parentNode.parentNode;
	}
	var nexttable = GetHtmlElements(document, "form", "name", "form1")[0].parentNode.parentNode.parentNode;

	//genbgcolor = getElementByXpath(GetHtmlElements(document, "table", "width", "98%")[0], "tbody/tr/td").getAttribute("bgcolor");
	genbgcolor = nexttable.children[0].children[0].children[0].getAttribute("bgcolor");
	TabloElem.setAttribute("style", "border-bottom:1px solid #ebebeb; border-top:1px solid #ebebeb;border-bottom:1px solid #c2cde0;");
	TabloElem.setAttribute("width", "98%");
	var Tablo2Ex = 	GetHtmlElements(document, "table", "width", "100%")[0];
	Tablo2Ex.setAttribute("width", "98%");
	Tablo2Ex.setAttribute("align", "center");
	var firsttdelem = getElementByXpath(document, TabloElem, "tbody[1]/tr/td");
	firsttdelem.setAttribute("bgcolor", genbgcolor);
	firsttdelem.setAttribute("align", "center");
	firsttdelem.setAttribute("width", "250");
	firsttdelem.setAttribute("style", "border-top:1px solid #c2cde0;border-left:1px solid #c2cde0;border-bottom:1px solid #c2cde0;border-right:1px solid #c2cde0");
	firsttdelem.nextSibling.nextSibling.setAttribute("style", "border-top:1px solid #c2cde0;border-bottom:1px solid #c2cde0;border-right:1px solid #c2cde0;");
	firsttdelem.nextSibling.nextSibling.children[0].setAttribute("style", "background-color: " + genbgcolor);

	var hgelem = firsttdelem.children[0];
	hgelem.setAttribute("style", "border:none; font-weight:normal; color:#bfbfbf;border-right:1px solid #c2cde0;");
	//firsttdelem.children[1].style.border="none";
	var newtablenode = "<table style=\"border: none;\">";
	newtablenode += "<tr><td align=center>"
	hgelem.setAttribute("style", "border:none; font-weight:normal; color:#bfbfbf;");
	hgelem.setAttribute("id", "activeuser");
	newtablenode += hgelem.outerHTML // + firsttdelem.children[1].outerHTML;
	if(firsttdelem.children.length > 2)
	{
		firsttdelem.children[2].style.border = "none";
	}

	newtablenode += "</td></tr><tr><td style=\"background-colorf: #ACFFAC\" align=\"center\">"
	var nSimgem =  undefined;
	if(GirisYapildi2())
	{
		var nSimgePar =  GetHtmlElements(document, "td", "width", "130")[0];
		nSimgem = nSimgePar.children[0];
		if(nSimgem == null || nSimgem == undefined)
		{
			nSimgem = GetHtmlElements(document, "img", "onerror", "this.src='Cyber-WarriorAvatar/blank.gif', height='0';")[0];
		}
	}
	else
	{
		nSimgem = GetHtmlElements(document, "img", "src", " Cyber-WarriorAvatar/default.gif ")[0];
	}
	nSimgem.setAttribute("style", "border-radius:20px;border-color: green");
	nSimgem.setAttribute("border", "2");
	newtablenode += nSimgem.outerHTML;
	nSimgem.parentNode.removeChild(nSimgem);
	var nexttext = "&nbsp;";
	if(firsttdelem.children.length > 2)
	{
		nexttext = firsttdelem.children[1].outerHTML + firsttdelem.children[2].outerHTML //+ firsttdelem.children[3].outerHTML;
	}
	newtablenode += "</td></tr><td align=center>" + nexttext + "</td></tr></table>";
	firsttdelem.innerHTML = "";
	firsttdelem.setAttribute("id", "cwe_bildirimyeri");
	var trnode = document.createElement("tr");
	var trinnertext = "<td align=center valign=middle style=\"background-color:" + genbgcolor +  ";border-right:1px solid #c2cde0;border-left:1px solid #c2cde0;\">";
	trinnertext += newtablenode;

	var nform = GetHtmlElements(document, "form", "name", "form1")[0];
	nform.innerHTML = nform.nextSibling.nextSibling.innerHTML;
	nform.nextSibling.nextSibling.innerHTML = "<div style=\"padding-top:13px;\">" + nform.outerHTML + "</div>";
	nform.parentNode.removeChild(nform);
	nexttable.setAttribute("width", "auto");
	nexttable.setAttribute("style", "table-layout:fixed;border-collapse: collapse; border-bottom: 1px solid #c2cde0;");
	nexttable.setAttribute("bgcolor", genbgcolor);
	trinnertext += "</td><td bgcolor=" + genbgcolor + " valign=top style=\"border-right:1px solid #c2cde0;\">" + nexttable.outerHTML;
	nexttable.innerHTML = "";
	nexttable.parentNode.removeChild(nexttable);
	trinnertext += "</td>";
	trnode.innerHTML = trinnertext;
	TabloElem.appendChild(trnode);
	var ilktablo = GetHtmlElements(document, "table", "width", "100%")[0];
	ilktablo.setAttribute("width", "98%");
	ilktablo.setAttribute("align", "center");
	var sonraki = document.getElementById("navbar-holder");
	sonraki.setAttribute("style", "width: 98%;");
	var cntrnode = document.createElement("center");
	cntrnode.innerHTML = sonraki.outerHTML;
	sonraki.parentNode.replaceChild(cntrnode, sonraki);
}
function CWEIhbarKismi()
{
	var hElement = document.getElementById("navbarmenu2");
	if(hElement == undefined) return;
	var hYeniLiElem = document.createElement("li");
	hYeniLiElem.setAttribute("class", "navbarmenu2-item");
	hYeniLiElem.innerHTML = "<a href=\"#\" onclick=\"SikayetFormGoster()\"><font color=orangered><b>Site ihbar Et!</b></font></a>";
	hElement.appendChild(hYeniLiElem);
}
unsafeWindow.SikayetFormGoster = function()
{
	MesajGosterIhbar(cwe_islemyap_ihbar);
}
function degerleriKontrolEt(ilist)
{
	var ihata = 0;
	for(var i = 0; i < ilist.childNodes.length; i++)
	{
		//var cTur = parseInt(document.getElementsByName("itur")[i].value);
		var cSite = document.getElementsByName("iweb")[i].value;
		var cDetay = document.getElementsByName("idetay")[i].value;
		if(!isValidURL(cSite) || cDetay == "")
		{
			ilist.childNodes[i].setAttribute("bgcolor", "#FF0000");
			ihata++;
		}
		else
		{
			ilist.childNodes[i].setAttribute("bgcolor", "limegreen");
		}
		//var cIcerik = parseInt(document.getElementsByName("iicerik")[i].value);
	}
	var iiletisimpaylas = document.getElementById("iibilgipaylas");
	if(iibilgipaylas.checked)
	{
		var itr1 = document.getElementById("ibrow1");
		var itr2 = document.getElementById("ibrow2");
		var iad = document.getElementsByName("iiad")[0].value;
		var isoyad = document.getElementsByName("iisoyad")[0].value;
		var itc = document.getElementsByName("iitc")[0].value;
		var ieposta = document.getElementsByName("iieposta")[0].value;
		if(!isValidEMail(ieposta) || iad.length < 2 || isoyad.length < 2 ||itc.length != 11)
		{
			itr1.setAttribute("bgcolor", "#FF0000");
			itr2.setAttribute("bgcolor", "#FF0000");
			ihata++;
		}
		else
		{
			itr1.setAttribute("bgcolor", "limegreen");
			itr2.setAttribute("bgcolor", "limegreen");
		}
	}
	return ihata;
}
unsafeWindow.cwe_islemyap_ihbar =  function(cwe_etype, cwe_userdata)
{
	var ilist = document.getElementById("ihbar_sitelistesi");
	var imsj = document.getElementById("ihbarmesaj");
	if(degerleriKontrolEt(ilist) > 0)
	{
		imsj.innerHTML = "<font color=red>Lütfen <b>kırmızı</b> ile işaretlenen satırlardaki hataları düzelttikten sonra tekrar '<b>Tamam</b>' tuşuna basın</font><br/><br/>";
		return;
	}
	else
	{
		imsj.innerHTML = "";
	}
	var iiletisimpaylas = document.getElementById("iibilgipaylas");
	var iad = document.getElementsByName("iiad")[0].value;
	var isoyad = document.getElementsByName("iisoyad")[0].value;
	var itc = document.getElementsByName("iitc")[0].value;
	var ieposta = document.getElementsByName("iieposta")[0].value;
	var itel = document.getElementsByName("iitelefon")[0].value;
	for(var i = 0; i < ilist.childNodes.length; i++)
	{
		var cTur = parseInt(document.getElementsByName("itur")[i].value);
		var cSite = document.getElementsByName("iweb")[i].value;
		var cDetay = document.getElementsByName("idetay")[i].value;
		var cIcerik = parseInt(document.getElementsByName("iicerik")[i].value);
		if(iiletisimpaylas.checked)
		{
			IhbarSekmesindeAcBilgipaylas(i, cTur, cSite, cDetay, cIcerik, itc, iad, isoyad, ieposta, itel);
		}
		else
		{
			IhbarSekmesindeAc(i, cTur, cSite, cDetay, cIcerik);
		}
	}
	document.getElementById("CWE_MesajKutusu").innerHTML = "";
	document.getElementById("CWE_MesajKutusu").style.display = "none";
	alert("Listede girmiş olduğunuz websiteleri yeni bir sekmede açılıp içeriği otomatik olarak doldurulacaktır, diğer sekmelerde güvenlik resmindeki bilgilerini manuel girmeniz gereklidir.");
	//IhbarSekmesindeAc(0, 1, "http://www.site.com", "Deneme üretilmiş key", 7);
	//curTab.addEventListener('load', someFunction, false);
}
unsafeWindow.IhbarSatirEkleVeyaSil =  function(sadecesil)
{
	var ilist = document.getElementById("ihbar_sitelistesi");
	if(ilist == undefined) return;
	if(sadecesil)
	{
		if(ilist.childNodes.length <= 1) return;
		ilist.removeChild(ilist.childNodes[ilist.childNodes.length - 1]);
	}
	else
	{
		if(ilist.childNodes.length >= 10) return;
		var mYeniSatir = document.createElement("tr");
		mYeniSatir.innerHTML = CreateIhbarRow(ilist.childNodes.length + 1);
		ilist.appendChild(mYeniSatir);
	}
}
function MesajGosterIhbar(mesajgosterfunc, mcweuserdata)
{
	var cwe_innertext = '<div class="cwe_modal2-content">';
	cwe_innertext += '<table  width="100%" style="border: 1px solid"><tr><td align=center><b>' + "WebSite İhbar Formu ( <a href=javascript:IhbarSatirEkleVeyaSil(false)>+</a> , <a href=javascript:IhbarSatirEkleVeyaSil(true)>-</a> )" + '</b><span onclick="document.getElementById(\'CWE_MesajKutusu\').style.display = \'none\';document.getElementById(\'CWE_MesajKutusu\').innerHTML = \'\';" class=cwe_close>X</span></td></tr></table>';
	cwe_innertext += '<table border=1 id=cwe_bild_info width="100%" style="border: 1px solid">';
	onkeydownmsg_cwe = ' onkeydown="if(event.keyCode == 13){' + "cwe_islemyap_ihbar" +'(' + 8 + ',' + mcweuserdata + ');}"';
	cwe_innertext += '<tr><td width="5%"><b>Sıra</b></td><td width="20%"><b>Site</b></td><td width="20%"><b>İhbar Şekli</b></td><td width="40%"><b>İhbar Detayı</b></td><td width="15%"><b>İhbar İçeriği</b></td></tr></table>';
	cwe_innertext += '<div style="max-height: 200px;overflow-y: auto;"><table border=1 width="100%"><tbody id=ihbar_sitelistesi>';
	cwe_innertext += '<tr>' + CreateIhbarRow(1) + '</tr>';
	cwe_innertext += '</tbody></table></div>';
	cwe_innertext += '<table border=1  width="100%" style="border: 1px solid;"><tr><td colspan=6 align=center><b>İletişim Bilgisi Paylaş</b><input id="iibilgipaylas" type="checkbox" onclick=iletisimBilgisipaylas(this);></td></tr>';
	cwe_innertext += '<tr id=ibrow1 style="display: none;"><td align=center width="10%"><b>TC</b>*</td><td width="23%"><input maxlength=11 name=iitc type="input" style="width:100%" value=""></td><td align=center width="10%"><b>Ad</b>*</td><td width="23%"><input name=iiad type="input" style="width:100%" value=""></td><td align=center width="10%"><b>Soyad</b>*</td><td width="23%"><input name=iisoyad type="input" style="width:100%" value=""></td></tr>';
	cwe_innertext += '<tr id=ibrow2 style="display: none;"><td align=center width="10%"><b>E-Posta</b>*</td><td><input name=iieposta type="input" style="width:100%" value=""></td><td align=center width="10%"><b>Telefon</b></td><td><input name=iitelefon type="input" style="width:100%" value=""></td></tr>';
	cwe_innertext += '</table>';
	cwe_innertext += '<table  width="100%" style="border: 1px solid"><tr><td align=center><div id=ihbarmesaj></div><input onclick="' + "cwe_islemyap_ihbar" +'(' + 8 + ');" type="button" value="Tamam"></td></tr></table></div>';
	document.getElementById("CWE_MesajKutusu").innerHTML = cwe_innertext;
	document.getElementById("CWE_MesajKutusu").style.display = "block";
}
unsafeWindow.iletisimBilgisipaylas =  function(cbx)
{
	var itr1 = document.getElementById("ibrow1");
	var itr2 = document.getElementById("ibrow2");
	if(cbx.checked)
	{
		itr1.style.display = "";
		itr2.style.display = "";
	}
	else
	{
		itr1.style.display = "none";
		itr2.style.display = "none";
	}
}
function CreateIhbarRow(rsira)
{
	var ihtml = '<td align=center width="5%">{0}</td><td width="20%">{1}</td><td width="20%">{2}</td><td width="40%">{3}</td><td width="15%">{4}</td>';
	ihtml = StringFormat(ihtml, rsira, CreateIhbarInputWeb(), CreateIhbarTurRow(), CreateIhbarDetay(), CreateIhbarIcerik());
	return ihtml;
}
function CreateIhbarInputWeb()
{
	var ihtml = '<input name=iweb type="input" style="width:100%" value="http://">';
	return ihtml;
}
function CreateIhbarDetay()
{
	var ihtml = '<textarea name=idetay style="width:100%"></textarea>';
	return ihtml;
}
function CreateIhbarTurRow()
{
	var ihtml = '<select name=itur><option value="1">İntihara Yönlendirme</option><option value="2">Çocukların Cinsel İstismarı</option><option value="3">Uyuşturucu Madde</option><option value="4">Sağlık için Teh. Madde</option><option value="5">Müstehcenlik</option><option value="6">Fuhuş</option><option value="7">Kumar Oynaması</option><option value="8">5816 Kanunu Aleyhine</option></select>';
	return ihtml;
}
function CreateIhbarIcerik()
{
	var ihtml = '<select name=iicerik ><option value="2">Web</option><option value="1">Eposta</option><option value="4">Anlık Mesajlaşma</option><option value="5">Sohbet</option><option value="6">Dosya Paylaşımı</option><option value="7" selected>Diğer</option></select>';
	return ihtml;
}
function CWEMesajAlani()
{
	var mCWEMbox = document.createElement("div");
	mCWEMbox.setAttribute("id", "CWE_MesajKutusu");
	mCWEMbox.setAttribute("class", "cwe_modal");
	document.body.appendChild(mCWEMbox);

}
function SurumToNum(surumt)
{
	if(surumt.indexOf(".") < 0) return -1;
	var mSSplt = surumt.split(".");
	if(mSSplt.length != 3) return -1;
	var mNumArray = new Array(3);
	for(mAlt = 0; mAlt < mSSplt.length; mAlt++)
	{
		if(isNaN(mSSplt[mAlt]))
		{
			return -1;
		}
		if(mSSplt[mAlt].length > 2 || mSSplt[mAlt].length == 0)
		{
			return -1;
		}
		if(mSSplt[mAlt].length == 1)
		{
			mNumArray[mAlt] = parseInt(mSSplt[mAlt]) * 10;
		}
		else
		{
			mNumArray[mAlt] = parseInt(mSSplt[mAlt])
		}
	}
	mNumArray[0] = mNumArray[0] / 10;
	var mResults = (mNumArray[0] * 99 * 99) + (mNumArray[1] * 99) + mNumArray[2];
	return mResults;
}
unsafeWindow.Global = function()
{
	if(GetCookie("cwe_load") == null)
	{
		FirstInitial();
	}
	if(!CWE_Guncelleniyor) ExtendCookie();
}
function SPMS(mUn, mMsT, mMsC)
{
	SPMS_a = mUn;
	SPMS_b = mMsT;
	SPMS_c = mMsC;
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/pm_new_message_form.asp?cwe_off=1", GetPMSesAsync);
}
function GetPMSesAsync(Dokuman)
{
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		return "";
	}
	if(mHtml == "")
	{
		return "";
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var mInput = xmlDoc.getElementById("frmAddMessage");
	if(mInput == null) return "";
	SPMSF(mInput.getAttribute("action"), SPMS_a, SPMS_b, SPMS_c);
}
function SPMSF(mKey, mUn, mMsT, mMsC)
{
	if(mUn == "") return;
	if(mUn.length <= 0) return;
	var mMesaj = escape(mMsC);
	mMesaj = mMesaj.replace(/(%0A)/gi, "%0D%0A");
	var PostD = StringFormat("member={0}&SubjectForm={1}&priority=0&selectFont=Default&selectColour=BLACK&selectMode=1&message={2}&message_CWEditor=true&Submit=Mesaj%FD+G%F6nder&cwe_off=1", escape(mUn), escape(mMsT), mMesaj);
	GetHtmlDoFuncPost("https://www.cyber-warrior.org/Forum/" + mKey, SPMSAsync, PostD);
}
function SPMSAsync(Dokuman)
{
	if(mCurrentUTPMIndex >= mCurrentUTPM.length) return;
	if(Dokuman.responseText.indexOf("Başarıyla Gönderilmiştir...") >= 0)
	{
		mCurrentUTPM[mCurrentUTPMIndex].PMGonderildi = true;
	}
	else
	{
		mCurrentUTPM[mCurrentUTPMIndex].PMGonderildi = false;
	}
	mCurrentUTPMIndex++;
	var mdcmntpmtd = document.getElementById("cwe_pmmsgtd");
	mdcmntpmtd.innerHTML = "Özel Mesaj(lar) Gönderiliyor " + mCurrentUTPMIndex.toString() + "/" + mCurrentUTPM.length.toString();
	if(mCurrentUTPMIndex >= mCurrentUTPM.length)
	{
		SAPMSSEnd();
	}
	else
	{
		SAPMS();
	}
}
function SearchUserByName(mSearchStr)
{
	var userN = document.getElementsByName("member");
	if(userN == null) return false;
	userN = userN[0];
	if(userN == null) return false;
	if(userN.readOnly) return false;
	GetHtmlDoFunc(StringFormat("https://www.cyber-warrior.org/Forum/forum_members.asp?find={0}&Submit=Ara&ReturnPage=&ForumID=0&TopicID=0&PagePosition=0&SearchPagePosition=0&search=&searchMode=&searchIn=&forum=&searchSort=&cwe_off=1", escape(mSearchStr)), SearchUserByNameAsync);
}
function SearchUserByNameAsync(Dokuman)
{
	EnableSearch2();
	var mElem = document.getElementById("arama_alani");
	if(mElem == null)
	{
		EnableSearch();
		return false;
	}
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		EnableSearch();
		return false;
	}
	if(mHtml == "")
	{
		EnableSearch();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var mTables = xmlDoc.getElementsByTagName("table");
	if(mTables == null)
	{
		mElem.style.display = "none";
		return false;
	}
	if(mTables.length < 9)
	{
		mElem.style.display = "none";
		return false;
	}
	var mTbl = mTables[8].children[0];
	if(mTbl.children.length <= 3)
	{
		mElem.style.display = "none";
		return false;
	}
	var totall = mTbl.children.length - 3;
	var mt = 0;
	var owidth = document.getElementsByName("member")[0].offsetWidth;
	var m_SearchText = '<table style="color: black; background: #d8f0f3;border: 2px solid lightblue;" border="0" width=' + owidth + '><tbody><tr>';
	if(totall > 10)
	{
		m_SearchText += '<td><b>Alakalı Üyeler</b>: 10+<div style="float: right;margin-top: -1"><b><a href="JavaScript:HideSearch();">X</a></b></div></td></tr>';
	}
	else
	{
		m_SearchText += StringFormat('<td><b>Alakalı Üyeler</b>: {0}<div style="float: right;margin-top: -1"><b><a href="JavaScript:HideSearch();">X</a></b></div></td></tr>', totall);
	}
	m_SearchText += '</tbody></table>';
	m_SearchText += '<table style="color: black; background: #ecf7f9;border: 1px solid lightblue;border-collapse: collapse;" width=' + owidth + '>';
	for(var mi = 2; mi < mTbl.children.length - 1; mi++)
	{
		var childm = mTbl.children[mi].children[0].children[0];
		childm.setAttribute("href", "javascript:" + "InsertUNValue('" + childm.innerHTML + "');");
		m_SearchText += "<tr style='border: 1px solid lightblue'><td>" + mTbl.children[mi].children[0].children[0].outerHTML + "</td></tr>";
		mt++;
		if(mt >= 10) break;
	}
	m_SearchText += '</tbody></table>';
	mElem.innerHTML = m_SearchText;
	mElem.style.display = "";
}
unsafeWindow.SearchByName = function(mSearchStr)
{
	var konub = document.getElementById("SubjectForm");
	if(konub == null) return false;
	if(konub.readOnly) return false;
	konub.readOnly = true;
	DisableSearch();
	GetHtmlDoFunc(StringFormat("https://www.cyber-warrior.org/Forum/search_ax1433_.asp?search={0}&searchMode=allwords&searchIn=Topic&forum=0&searchSort=dateDESC&Submit=Aramaya+Ba%FEla&cwe_off=1", escape(mSearchStr)), SearchByNameAsync);
}
function ShowSearchNotFound()
{
	var mElem = document.getElementById("arama_alani");
	if(mElem == null)
	{
		return false;
	}
	var owidth = document.getElementById("SubjectForm").offsetWidth;
	var m_SearchText = '<table style="color: black; background: #d8f0f3;border: 2px solid lightblue;" border="0" width=' + owidth + '><tbody><tr>';
	m_SearchText += '<td><b>Alakalı Başlıklar</b>: 0<div style="float: right;margin-top: -1"><b><a href="JavaScript:HideSearch();">X</a></b></div></td></tr>';
	m_SearchText += '</tbody></table>';
	m_SearchText += '<table style="color: black; background: #ecf7f9;border: 1px solid lightblue;border-collapse: collapse;" width="' + owidth +'">';
	m_SearchText += "<tr style='border: 1px solid lightblue'><td>Aramayla alakalı herhangi bir sonuç bulunamadı veya yasaklı bir kelime aradınız.</td></tr>";
	m_SearchText += '</tbody></table>';
	mElem.innerHTML = m_SearchText;
	mElem.style.display = "";
}
function SearchByNameAsync(Dokuman)
{
	var mElem = document.getElementById("arama_alani");
	if(mElem == null)
	{
		EnableSearch();
		return false;
	}
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		EnableSearch();
		return false;
	}
	if(mHtml == "")
	{
		EnableSearch();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var mTables = xmlDoc.getElementsByTagName("table");
	if(mTables == null)
	{
		ShowSearchNotFound();
		EnableSearch();
		return false;
	}
	if(mTables.length < 8)
	{
		ShowSearchNotFound();
		EnableSearch();
		return false;
	}
	var mTbl = mTables[6].children[0];
	if(mTbl.children.length <= 2)
	{
		ShowSearchNotFound();
		EnableSearch();
		return false;
	}

	var totall = mTbl.children.length - 2;
	var mt = 0;
	var owidth = document.getElementById("SubjectForm").offsetWidth;
	var m_SearchText = '<table style="color: black; background: #d8f0f3;border: 2px solid lightblue;" border="0" width=' + owidth + '><tbody><tr>';
	if(totall > 5)
	{
		m_SearchText += '<td><b>Alakalı Başlıklar</b>: 5+<div style="float: right;margin-top: -1"><b><a href="JavaScript:HideSearch();">X</a></b></div></td></tr>';
	}
	else
	{
		m_SearchText += StringFormat('<td><b>Alakalı Başlıklar</b>: {0}<div style="float: right;margin-top: -1"><b><a href="JavaScript:HideSearch();">X</a></b></div></td></tr>', totall);
	}
	m_SearchText += '</tbody></table>';
	m_SearchText += '<table style="color: black; background: #ecf7f9;border: 1px solid lightblue;border-collapse: collapse;" width=' + owidth + '>';
	for(var mi = 2; mi < mTbl.children.length - 1; mi++)
	{
		m_SearchText += "<tr style='border: 1px solid lightblue'><td>" + mTbl.children[mi].children[1].children[0].outerHTML + "</td></tr>";
		mt++;
		if(mt >= 5) break;
	}
	m_SearchText += '</tbody></table>';
	mElem.innerHTML = m_SearchText;
	mElem.style.display = "";
	EnableSearch();
}
unsafeWindow.HideSearch = function()
{
	var mSElem = document.getElementById("arama_alani");
	if(mSElem == null) return false;
	mSElem.innerHTML = "";
	mSElem.style.display = "none";
}
function ExtendCookie()
{
	if(GetCookie("cwe_load2") != null) return;
	if(!GirisYapildi2()) return;
	var nArr = GetCookieArray();
	if(nArr.length == 0) return null;
	for(var Nalt = 0; Nalt < nArr.length; Nalt++)
	for(Nalt = 0; Nalt < nArr.length; Nalt++)
	{
		var mName = nArr[Nalt].AyarAd;
		var mValue = nArr[Nalt].AyarDeger;
		DeleteCookie(mName);
		SetCookie(mName, mValue);
	}
	SetCookie("cwe_load2", 1);
}
function FirstInitial()
{
	SetCookie("cwe_load", 1);
}
unsafeWindow.CWAddonGuncelle = function()
{
	if(document.getElementById("b_güncelle") == null) return false;
	if(GetDataValue(document.URL, "cwe_off") == "1") return false;
	CWE_Guncelleniyor = true;
	Baslangic();
}
function RemoveSup(mSupid)
{
	var hElem = document.getElementById(mSupid);
	if(hElem == null) return;
	hElem.parentNode.removeChild(hElem);
}
function Baslangic()
{

	pms = 0;
	pms_bahsedilme = 0;
	pms_begeni = 0;
	pms_real = 0;
	keflt = 0;
	mntw = 0;
	moys = 0;
	moysother = 0;
	mpmsmaxp = 0;
	mpmscurp = 0;
	totalitem = 0;
	if(document.body.id == "icerik_body")
	{
		return;
	}
	setTimeout("Global()", 1000);
	setTimeout("Basla()", 500);



}
function IhbarSekmesindeAcBilgipaylas(rownum, szIhbarTur, szSiteAdi, szDetay, szIcerik, szTC, szAd, szSoyad, szEMail, szTel)
{
	var svalueid = createIhbarWebKey(rownum);
	GM_setValue(svalueid + "_url", szSiteAdi);
	GM_setValue(svalueid + "_detay", szDetay);
	GM_setValue(svalueid + "_icrk", szIcerik);
	GM_setValue(svalueid + "_bpaylas", "1");
	GM_setValue(svalueid + "_tc", szTC);
	GM_setValue(svalueid + "_ad", szAd);
	GM_setValue(svalueid + "_soyad", szSoyad);
	GM_setValue(svalueid + "_email", szEMail);
	GM_setValue(svalueid + "_tel", szTel);
	GM_openInTab ("https://www.ihbarweb.org.tr/ihbar.php?subject=" + szIhbarTur + "&svid=" + svalueid);
}
function IhbarSekmesindeAc(rownum, szIhbarTur, szSiteAdi, szDetay, szIcerik)
{
	var svalueid = createIhbarWebKey(rownum);
	GM_setValue(svalueid + "_url", szSiteAdi);
	GM_setValue(svalueid + "_detay", szDetay);
	GM_setValue(svalueid + "_icrk", szIcerik);
	GM_openInTab ("https://www.ihbarweb.org.tr/ihbar.php?subject=" + szIhbarTur + "&svid=" + svalueid);
}
function createIhbarWebKey(rownum)
{
	return sbaslik = "ihb" + rownum + "_" + Math.floor(Math.random() * 1001);
}
function parseIhbarWeb(szpage)
{
	if(szpage != "ihbar.php")
	{
		return;
	}
	var ssubject = GetDataValue(document.URL, "subject");
	var svalueid = GetDataValue(document.URL, "svid");
	if(ssubject == "" || svalueid == "")
	{
		return;
	}
	var weburi = GM_getValue(svalueid + "_url", "");
	var ihbardty = GM_getValue(svalueid + "_detay", "");
	var ihbaricrk =  GM_getValue(svalueid + "_icrk", "");
	var ipaylastate = (GM_getValue(svalueid + "_bpaylas", "") == "1");
	var itc =  GM_getValue(svalueid + "_tc", "");
	var iad =  GM_getValue(svalueid + "_ad", "");
	var isoyad =  GM_getValue(svalueid + "_soyad", "");
	var iemail =  GM_getValue(svalueid + "_email", "");
	var itel =  GM_getValue(svalueid + "_tel", "");

	GM_deleteValue(svalueid + "_url");
	GM_deleteValue(svalueid + "_detay");
	GM_deleteValue(svalueid + "_icrk");
	GM_deleteValue(svalueid + "_bpaylas");
	GM_deleteValue(svalueid + "_tc");
	GM_deleteValue(svalueid + "_ad");
	GM_deleteValue(svalueid + "_soyad");
	GM_deleteValue(svalueid + "_email");
	GM_deleteValue(svalueid + "_tel");

	document.getElementById("adres").value = weburi;
	document.getElementById("detay").value = ihbardty;
	var elems = document.getElementsByName("suc");
	for(var i = 0; i < elems.length; i++)
	{
		if(elems[i].getAttribute("value") == ihbaricrk)
		{
			elems[i].checked = true;
			break;
		}
	}
	if(ipaylastate)
	{
		var iiletisim = document.getElementById("geri");
		iiletisim.click();
		document.getElementById("ad").value = iad;
		document.getElementById("soyad").value = isoyad;
		document.getElementById("tckimlik").value = itc;
		document.getElementById("email").value = iemail;
		document.getElementById("tel").value = itel;
	}
}
unsafeWindow.Basla = function()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return false;
	var mPage = GetPage();
	if(mPage == null) mPage = "";
	mPage = mPage.toLowerCase();
	if(!document.URL.startsWith("https://www.cyber-warrior.org"))
	{
		parseIhbarWeb(mPage);
		return false;
	}
	if(document.URL == "https://www.cyber-warrior.org/Forum/")
	{
		mPage = "default.asp";
	}
	CWEGecerliSayfa = mPage;
	if(!CWE_Guncelleniyor)
	{
		TasarimDuzenle();
		CWEMesajAlani();
		if(GirisYapildi2()) CWEIhbarKismi();
		if(GirisYapildi2())
		{
			var helem = cwe_activeusername = document.getElementById("activeuser");
			if(helem != null && helem != undefined)
			{
				cwe_activeusername = helem.innerHTML;
			}
		}
		switch(mPage)
		{
			case "post_message_form.asp":
				YeniKonuKismi();
				break;
			case "forum_password_form.asp":
				ForumSifresi();
				SifreHatirla();
				SanalKlavyeGizle();
				break;
			case "login_user.asp":
				ForumSifresi();
				SanalKlavyeGizle();
				break;
			case "pm_new_message_form.asp":
				YeniPMKismiExtreme();
				GetUserRank();
				NewPm();
				break;
			case "kefalet.asp":
				KefaletHesapla();
				break;
			case "default.asp":
				if(GirisYapildi())
				{
					AnaSayfada = true;
					unsafeWindow.AnaSayfada = true;
					AnaSayfa();
				}
				break;
			case "form.asp":
				ButonlariGizleForm();
				break;
			case "oys.asp":
				OYSSayfasinda = true;
				unsafeWindow.OYSSayfasinda = true;
				break;
		}
	}
	else
	{
		if(GirisYapildi2())
		{
			var helem = cwe_activeusername = document.getElementById("activeuser");
			if(helem != null && helem != undefined)
			{
				cwe_activeusername = helem.innerHTML;
			}
		}
	}

	var CWEBildirimDDisi = false;
	var nSecureItem = GetHtmlElements(document, "input", "name", "securityCode");
	if(CWEGecerliSayfa == "forum_password_form.asp")
	{
		CWEBildirimDDisi = true;
	}
	if(nSecureItem.length > 0)
	{
		CWEBildirimDDisi = true;
	}
	if(!CWEBildirimDDisi)
	{
		Bildirimler();
	}
	else
	{
		inSertDropDown();
		document.getElementById("b_güncelle").innerHTML = '...';
	}
}
function ButonlariGizleForm()
{
	var mItemExx = document.getElementsByName("selectFont");
	if(mItemExx == undefined) return;
	if(mItemExx == null) return;
	if(mItemExx[0] == undefined) return;
	if(mItemExx[0] == null) return;
	var mItem = mItemExx[0].parentNode.parentNode;
	mItem.parentNode.removeChild(mItem.nextSibling.nextSibling);
	mItem.parentNode.removeChild(mItem);
	var sbmtbtn = document.getElementsByName("Submit2")[0];
	sbmtbtn.setAttribute("onclick", "posted_on_submit = true;SetValueCWForm();");
    is_portal_editor = true;
}
function GetUsrRb(mRtbtxt)
{
	if(!GirisYapildi2())
	{
		return -1;
	}
	var mRtbs = ["Komodor", "General", "Orgeneral", "Kuvvet Komutanı", "Üst Düzey Yönetici", "Co (Administrator)","Administrator", "Kurucu"];
	return mRtbs.indexOf(mRtbtxt);
}
function GetUserRank()
{
	if(!GirisYapildi2())
	{
		return "";
	}
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/default.asp?cwe_off=1", GetUserRankA);
}
function GetUserRankA(Dokuman)
{
	var mAnasyfTxt = Dokuman.responseText;
	if(mAnasyfTxt == null) return "";
	if(mAnasyfTxt == "") return "";
	var mparser = new DOMParser();
	var xmlDoc = mparser.parseFromString(mAnasyfTxt,"text/html");
	if(xmlDoc == undefined) return "";
	var mElem = GetHtmlElement2(xmlDoc, "a", "href", "MemberNetwork.Asp").previousSibling.previousSibling.previousSibling.previousSibling;
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/" + mElem.getAttribute("href") + "&cwe_off=1", GetUserRankB);
}
function GetUserRankB(Dokuman)
{
	var profiletxt = Dokuman.responseText;
	if(profiletxt == null) return;
	if(profiletxt == "") return;
	var mparser = new DOMParser();
	var xmlDoc = mparser.parseFromString(profiletxt,"text/html");
	if(xmlDoc == undefined) return;
	var HItem = GetHtmlElementInner(xmlDoc, "td", "Rütbe");
	if(HItem == null || HItem == undefined) return;
	if(GetUsrRb(getElementByXpath(xmlDoc,HItem.parentNode,  "td[2]/b/font/font").textContent) != -1)
	{
		mnaccble = true;
	}
	else
	{
		mnaccble = false;
	}
	mnaccble = true;
	YeniPMKismi();
	if(mnaccble) YeniPMKismiEx();
}
function OzelMesajlar()
{
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/pm_welcome.asp?cwe_off=1", OzelMesajlarAsync);
}
function OzelMesajlarAsync(Dokuman)
{
	controlled++;
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		ListeKontrol();
		return false;
	}
	if(mHtml == "")
	{
		ListeKontrol();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var mElems = GetHtmlElements(xmlDoc, "span", "class", "bold");
	if(mElems.length < 2) return false;
	var mindex = mElems[1].innerHTML;
	mindex = mindex.replace("Toplam ", "");
	mindex = mindex.replace(" yeni özel mesajınız var!", "");
	if(isNaN(mindex))
	{
		ListeKontrol();
		return false;
	}
	var toplam = parseInt(mindex);
	if(toplam == null)
	{
		ListeKontrol();
		return false;
	}
	pms = toplam;
	ListeKontrol();
}
function YeniPMKismi()
{
	var userNmX = document.getElementsByName("member");
	if(userNmX == null) return false;
	var userNm = userNmX[0];
	if(userNm == undefined) return false;
	if(mnaccble) userNm.setAttribute("maxlength", "1500");
	var divelem = document.createElement("div");
	divelem.setAttribute("id", "arama_alani");
	divelem.setAttribute("style", "position: absolute;display: none;");
	userNm.parentNode.insertBefore(divelem, userNm.nextSibling);
	//userNm.setAttribute("onkeyup", "SearchUserCtrl(this)");
}
function YeniPMKismiEx()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return false;
	var nPMSArea = document.getElementsByName("Submit")[0];
	if(nPMSArea == undefined) return;
	var nPMSAreParent = document.getElementsByName("Submit")[0].parentNode.parentNode.parentNode;
	var trelem = document.createElement("tr");
	trelem.setAttribute("id", "cwe_pmmsgtr");
	trelem.style.display = "none";
	trelem.innerHTML = "<td id='cwe_pmmsgtd' align=center colspan=2></td>";
	nPMSAreParent.parentNode.insertBefore(trelem, nPMSAreParent.nextSibling);
	var submtbtn = document.getElementById("frmAddMessage");
	if(submtbtn != null)
	{
		submtbtn.setAttribute("onsubmit", "SAPMSStrt(); return sbmtresult;")
	}
}
function YeniPMKismiExtreme()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return false;
	if(document.getElementById("searchimageex") != null) return false;
	var konub = GetHtmlElements(document, "input", "name", "member")[0];
	if(konub == null) return false;
	var divelem = document.createElement("div");
	divelem.setAttribute("id", "arama_alani");
	divelem.setAttribute("style", "position: absolute;display: none;z-index: 1;");
	konub.parentNode.insertBefore(divelem, konub.nextSibling);
	var SearchImg = document.createElement("img");
	SearchImg.setAttribute("id", "searchimageex");
	SearchImg.setAttribute("style", "margin-left: 3px; cursor: pointer; opacity: 1.0; margin-bottom:-4px");
	SearchImg.setAttribute("width", "18");
	SearchImg.setAttribute("height", "20");
	SearchImg.setAttribute("title", "Üye aramak için tıkla");
	SearchImg.setAttribute("src", "https://www.cyber-warrior.org/Forum/forum_images/icon_mini_search.gif");
	konub.parentNode.insertBefore(SearchImg, konub.nextSibling);
	SearchImg.setAttribute("onclick", 'UyeAraYeni();');
}
unsafeWindow.UyeAraYeni = function()
{
	DisableSearch2();
	SearchUserCtrl(GetHtmlElements(document, "input", "name", "member")[0]);
}
function EnableSearch2()
{
	var searchb = document.getElementById("searchimageex");
	if(searchb == null) return;
	searchb.setAttribute("onclick", 'UyeAraYeni();');
	searchb.setAttribute("style", "margin-left: 3px; cursor: pointer; opacity: 1.0; margin-bottom:-4px");
}
function DisableSearch2()
{
	var searchb = document.getElementById("searchimageex");
	if(searchb == null) return;
	searchb.setAttribute("onclick", '');
	searchb.setAttribute("style", "margin-left: 3px; opacity: 0.3; margin-bottom:-4px");
}
function YeniKonuKismi()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return false;
	if(document.getElementById("searchimage") != null) return false;
	var konub = document.getElementById("SubjectForm");
	if(konub == null) return false;
	konub.setAttribute("onkeyup", "SearchOnChange(this)");
	var divelem = document.createElement("div");
	divelem.setAttribute("id", "arama_alani");
	divelem.setAttribute("style", "position: absolute;display: none;z-index: 1;");
	konub.parentNode.insertBefore(divelem, konub.nextSibling);
	var SearchImg = document.createElement("img");
	SearchImg.setAttribute("id", "searchimage");
	SearchImg.setAttribute("style", "cursor: pointer; opacity: 1.0; margin-bottom:-4px");
	SearchImg.setAttribute("width", "18");
	SearchImg.setAttribute("height", "20");
	SearchImg.setAttribute("title", "Benzer konuları aramak için tıkla.");
	SearchImg.setAttribute("src", "https://www.cyber-warrior.org/Forum/forum_images/icon_mini_search.gif");
	konub.parentNode.appendChild(SearchImg);
	SearchOnChange(konub);
}
var mSonIdSUC = -1;
unsafeWindow.InsertUNValue = function(mText)
{
	if(!mnaccble)
	{
		SetUNValue(mText);
		return;
	}
	var untext = document.getElementsByName('member')[0].value;
	untext = untext.trim();
	untext = untext.replace(/^\;/, "");
	untext = untext.replace(/\;$/, "");
	var ntext = mText;
	if(untext.indexOf(';') >= 0)
	{
		ntext = "";
		var splttext = untext.split(';');
		for(var abcd = 0; abcd < splttext.length - 1; abcd++ )
		{
			ntext += splttext[abcd] + ";";
		}
		ntext += mText;

	}
	document.getElementsByName('member')[0].value = ntext;
	HideSearch();
	document.getElementsByName('member')[0].focus();
}
function SetUNValue(mText)
{
	document.getElementsByName('member')[0].value = mText
	HideSearch();
	document.getElementsByName('member')[0].focus();
}
unsafeWindow.SAPMSStrt = function()
{
	if(!mnaccble)
	{
		sbmtresult = true;
		return
	}
	var mdcmntpmtr = document.getElementById("cwe_pmmsgtr");
	var mdcmntpmtd = document.getElementById("cwe_pmmsgtd");
	if(mdcmntpmtr == null || mdcmntpmtr == undefined)
	{
		sbmtresult = true;
		return
	}
	if(mdcmntpmtd == null || mdcmntpmtd == undefined)
	{
		sbmtresult = true;
		return
	}
	sbmtresult = false;
	mCurrentUTPMIndex = 0;
	mCurrentUTPM = toDesiredUsertoPM();
	if(mCurrentUTPM.length <= 1)
	{
		sbmtresult = true;
		return;
	}
	mdcmntpmtr.style.display = "";
	document.getElementsByName("Submit")[0].disabled = "disabled";
	mdcmntpmtd.innerHTML = "Özel Mesaj(lar) Gönderiliyor 0/" + mCurrentUTPM.length.toString();
	SAPMS();
}
function SAPMSSEnd()
{
	if(!mnaccble) return;
	var mdcmntpmtd = document.getElementById("cwe_pmmsgtd");
	var mGonderilenler = "";
	var mGonderilemeyenler = "";
	var mGondC = 0;
	var mNGondC = 0;
	for	(var bbb = 0; bbb < mCurrentUTPM.length; bbb++)
	{
		if(mCurrentUTPM[bbb].PMGonderildi)
		{
			mGonderilenler += mCurrentUTPM[bbb].HedefUye + ", ";
			mGondC++;
		}
		else
		{
			mGonderilemeyenler += mCurrentUTPM[bbb].HedefUye + ", ";
			mNGondC++;
		}
	}
	var cMesaj = "";
	if(mGondC > 0)
	{
		cMesaj = "Özel Mesaj(lar) aşağıdaki üyelere <font color=green>gönderildi.</font><br>" + mGonderilenler;
	}
	if(mNGondC > 0)
	{
		if(mGondC > 0)
		{
			cMesaj += "<br>";
		}
		cMesaj += "Özel Mesaj(lar) aşağıdaki üyelere <font color=red>gönderilemedi.</font><br>" + mGonderilemeyenler;
	}
	mdcmntpmtd.innerHTML = cMesaj;
	document.getElementsByName("Submit")[0].disabled = "";
}
function SAPMS()
{
	if(mCurrentUTPMIndex >= mCurrentUTPM.length) return;
	var mtitlemsg = document.getElementById("SubjectForm");
	if(mtitlemsg == undefined || mtitlemsg == null) return;
	SetValueCW();
	var mcontentmsg = document.getElementById("message");
	if(mcontentmsg == undefined || mcontentmsg == null) return;
	var ttttmsg = mcontentmsg.value.replace(/(\$\{username\})/gi, mCurrentUTPM[mCurrentUTPMIndex].HedefUye);
	SPMS(mCurrentUTPM[mCurrentUTPMIndex].HedefUye, mtitlemsg.value + " - " + mCurrentUTPM[mCurrentUTPMIndex].HedefUye, ttttmsg);
}
function toDesiredUsertoPM()
{
	var tDUPMArr = new Array();
	if(document.getElementsByName('member') == undefined) return tDUPMArr;
	var untext = document.getElementsByName('member')[0].value;
	untext = untext.trim();
	untext = untext.replace(/^\;/, "");
	untext = untext.replace(/\;$/, "");
	if(untext.indexOf(';') >= 0)
	{
		var splttextex = untext.split(';');
		for	(var bcda = 0; bcda < splttextex.length; bcda++)
		{
			var mTDUPMArrItem = new function() {
				this.HedefUye = splttextex[bcda];
				this.PMGonderildi = false;
				return this;
			};
			tDUPMArr.push(mTDUPMArrItem);
		}
	}
	else
	{
		mTDUPMArrItem = new function() {
			this.HedefUye = untext;
			this.PMGonderildi = false;
			return this;
		};
		tDUPMArr.push(mTDUPMArrItem);
	}
	return tDUPMArr;
}
function SearchUserCtrl(mSender)
{
	if(mSender == null) return;
	if(mSender.value.length < 1) return;
	if(mSonIdSUC != -1)
	{
		window.clearTimeout(mSonIdSUC);
		mSonIdSUC = -1;
	}
	var ntext = mSender.value;
	if(mnaccble)
	{
		if(ntext.indexOf(';') > -1)
		{
			var Splittext = ntext.split(';');
			ntext = Splittext[Splittext.length - 1];
			if(ntext.length <= 0) return;
		}
	}
	mSonIdSUC = setTimeout(function(){ SearchUserByName(ntext); }, 1000);
}
unsafeWindow.SearchOnChange = function(mSender)
{
	if(mSender.value.length <= 2)
	{
		DisableSearch();
	}
	else
	{
		EnableSearch();
	}
}
function EnableSearch()
{
	var konub = document.getElementById("SubjectForm");
	konub.readOnly  = false;
	var searchb = document.getElementById("searchimage");
	if(searchb == null) return;
	searchb.setAttribute("onclick", 'HideSearch();SearchByName(document.getElementById("SubjectForm").value)');
	searchb.setAttribute("style", "cursor: pointer; opacity: 1.0; margin-bottom:-4px");
}
function DisableSearch()
{
	var searchb = document.getElementById("searchimage");
	if(searchb == null) return;
	searchb.setAttribute("onclick", '');
	searchb.setAttribute("style", "opacity: 0.3; margin-bottom:-4px");
}
function AnaSayfa()
{
	if(!GirisYapildi2()) return;
	if(GetDataValue(document.URL, "cwe_off") == "1") return;
}
function Bildirimler()
{
	if(!GirisYapildi2()) return;
	if(GetDataValue(document.URL, "cwe_off") == "1") return;
	if(document.getElementById("cwe_bildirimyeri") == null) return;
	//if(document.URL.toLowerCase().indexOf("/forum/") < 0) return;
	controlled = 1;
	inSertDropDown();
	if(AnaSayfada)
	{
		CWEYuklendi = true;
	}
	if(!CWEYuklendi)
	{
		document.getElementById("b_güncelle").innerHTML = '<a style="color: gray;" href="JavaScript:CWAddonGuncelle()">Güncelle</a>';
		document.getElementById("toplam_bildirim").innerHTML = "<b>?</b>";
	}
	else
	{
		document.getElementById("b_güncelle").innerHTML = "<img src=\"../ajaxtabs/loading.gif\">";
	}
	if(CWEYuklendi)
	{
		Yorumlar();
		KefilHavuz();
		//OzelMesajlar();
		OysMesajlar();
		CWEBildirimleriAyir();
	}
	else
	{
		setTimeout("CWAddonGuncelle()", 10000);
	}
	CWEYuklendi = true;
	if(!intervaladded) RutbeleriAyarla();
	if(!intervaladded)
	{
		if(AnaSayfada)
		{
			intervaladded = true;
			setInterval("CWAddonGuncelle()", 120000);
		}
	}
}
function RutbeleriAyarla()
{
	var Elem = FindHtmlElement("td", "Rütbeler");
	if(Elem == null) return;
	var mNext = Elem.parentNode.children[1];
	for(alt = 0; alt < mNext.children.length; alt++)
	{
		mNext.children[alt].setAttribute("onclick", "RtbGosterGizle(this)");
		mNext.children[alt].setAttribute("style", "cursor: pointer;text-decoration: underline");
	}
	var Elem2 = FindHtmlElement("td", "Ünvanlar");
	if(Elem2 == null) return;
	var mNext2 = Elem2.parentNode.children[1];
	for(var alt = 0; alt < mNext2.children.length -1; alt++)
	{
		mNext2.children[alt].setAttribute("onclick", "RtbGosterGizle(this)");
		mNext2.children[alt].setAttribute("style", "cursor: pointer;text-decoration: underline");
	}
	var RutbeAlani = document.getElementById("divOnlineUser");
	var Arr = new Array(RutbeAlani.children.length);
	for(alt = 0; alt < RutbeAlani.children.length; alt++)
	{
		Arr[alt] = "<span><span id=comma" + alt.toString() + ">, </span>" + RutbeAlani.children[alt].outerHTML + "</span>";
	}
	var mHtl = "";
	for(alt = 0;alt < Arr.length; alt++)
	{
		mHtl += Arr[alt];
	}
	RutbeAlani.innerHTML = mHtl;
	RutbeAlani.children[0].children[0].style.display = "none";
	lastselindex = 0;
}
unsafeWindow.RtbGosterGizle = function(gonderen)
{
	if(gonderen == null) return;
	var RutbeAlani = document.getElementById("divOnlineUser");
	if(RutbeAlani == null) return;
	var gizle = gonderen.style.textDecoration == "underline";
	var mcolor = gonderen.getAttribute("color");
	if(mcolor == "#282828")
	{
		mcolor = "#454545";
	}
	if(mcolor == "#6d6d6d")
	{
		mcolor = "#393939";
	}
	var firstinserted = false;
	if(RutbeAlani.children[0].nodeName != "SPAN")
	{
		RutbeleriAyarla();
		return;
	}
	if(lastselindex >= 0) RutbeAlani.children[lastselindex].children[0].style.display = "";
	var total = 0;
	for(var alt = 0; alt < RutbeAlani.children.length; alt++)
	{
		var hcolor;
		if(RutbeAlani.children[alt].children[1].children.length <= 0)
		{
			hcolor = "#a7a8a6";
		}
		else
		{
			hcolor = RutbeAlani.children[alt].children[1].children[0].getAttribute("color");
		}
		if(mcolor != hcolor)
		{
			if(RutbeAlani.children[alt].style.display != "none")
			{
				if(!firstinserted)
				{
					lastselindex = alt;
					RutbeAlani.children[alt].children[0].style.display = "none";
					firstinserted = true;
				}
				total++;
			}
			continue;
		}
		if(gizle)
		{
			RutbeAlani.children[alt].style.display = "none";
		}
		else
		{
			total++;
			RutbeAlani.children[alt].style.display = "";
			if(!firstinserted)
			{
				lastselindex = alt;
				RutbeAlani.children[alt].children[0].style.display = "none";
				firstinserted = true;
			}
		}
	}
	if(gizle)
	{
		gonderen.style.textDecoration = "none";
	}
	else
	{
		gonderen.style.textDecoration = "underline";
	}
	var tUserid = document.getElementById("toplamUser");
	if(tUserid != null)
	{
		var mText = RutbeAlani.children.length.toString();
		if(total < RutbeAlani.children.length)
		{
			mText = StringFormat("{0}({1})", total, RutbeAlani.children.length);
		}
		tUserid.innerHTML = mText;
	}
}
function OysMesajlar()
{
	mpmsmaxp = 1;
	mpmscurp = 1;
	CWE_CreatePMInner = "";
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/pm_inbox.asp?cwe_off=1", OysAsync);
}
function OysAsync(Dokuman)
{
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		controlled++;
		pms -= moys;
		CheckOysSub();
		ListeKontrol();
		return false;
	}
	if(mHtml == "")
	{
		controlled++;
		pms -= moys;
		CheckOysSub();
		ListeKontrol();
		return false;
	}

	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	if(mpmscurp == 1)
	{
		var mmaxpstn = xmlDoc.getElementsByName("SelectTopicPage")[0];
		if(mmaxpstn != undefined)
		{
			mpmsmaxp = mmaxpstn.options.length;
		}
	}
	var Okunmamislar = GetHtmlElements(xmlDoc, "img", "src", "forum_images/unread_private_message.png");

	for(var bbbb = 0; bbbb < Okunmamislar.length - 1; bbbb++)
	{
		var mPMText = Okunmamislar[bbbb].parentNode.nextSibling.nextSibling.textContent;

		if(mPMText.match(/^(\[[0-9]+\] Operasyon TIM Uyarı)$/gi) != null)
		{
			moys++;
			continue;
		}
		if(mPMText.match(/^(\[[^\r\n\t]+\] Bir Gönderide Sizi Etiketledi)$/gi) != null)
		{
			moysother++;
			continue;
		}
		CWE_CreatePMInner += StringFormat("<tr><td><b>{0}</b>: {1}</td></tr>",getElementByXpath(xmlDoc, Okunmamislar[bbbb].parentNode.parentNode, "td[3]").innerHTML, Okunmamislar[bbbb].parentNode.nextSibling.nextSibling.innerHTML);
	}
	if(mpmscurp >= mpmsmaxp || mpmscurp >= 3)
	{
		document.getElementById("cwe_b_özelmesaj_ayrinti_table").innerHTML = CWE_CreatePMInner;
		controlled++;
		pms -= (moys + moysother);
		CheckOysSub();
		ListeKontrol();
		return false;
	}
	mpmscurp++;
	GetHtmlDoFunc(StringFormat("https://www.cyber-warrior.org/Forum/pm_inbox.asp?PagePosition={0}&cwe_off=1", mpmscurp), OysAsync);
}
function CheckOysSub()
{
	var mElemOys = GetHtmlElement("a", "href", "OYS.Asp");
	if(mElemOys == null) return;
	if(moys <= 0)
	{
		mElemOys.style.fontWeight = "normal";
		mElemOys.style.color = "";
		RemoveSup("spoys");
		return;
	}
	mElemOys.style.color = "Red";
	mElemOys.style.fontWeight = "bold";
	if(document.getElementById("spoys") == null) mElemOys.innerHTML += "<sup id=spoys style='color: red;'>" + moys.toString() + "</sup>";
	document.getElementById("spoys").innerHTML = moys.toString();
}
function SetRegular(htag)
{
	document.getElementById(htag).style.color = "blue";
	document.getElementById(htag).style.fontWeight = "normal";
}
function SetBold(htag)
{
	document.getElementById(htag).style.color = "red";
	document.getElementById(htag).style.fontWeight = "bold";
}
function ListeKontrol()
{
	if(controlled < 5) return;
	ListeyeYansit();
}
function ListeyeYansit()
{
	if(document.getElementById("toplam_bildirim") == null) return false;
	totalitem = pms + mntw + keflt + moys + pms_bahsedilme;
	if(totalitem < 0) totalitem = 0;
	document.getElementById("toplam_bildirim").innerHTML = totalitem.toString();
	if(totalitem > 0)
	{
		SetBold("toplam_bildirim");
	}
	else
	{
		SetRegular("toplam_bildirim");
	}
	var InfElems = GetHtmlElements(document, "a", "href", "javascript:AXBildirim();")[0];
	if(InfElems != null)
	{
		var InfElemsText = InfElems.textContent.replace(" INF", "");
		if(!isNaN(InfElemsText) && InfElemsText != "" && InfElemsText != " ")
		{
			var infelmnum = parseInt(InfElemsText);
			if(infelmnum < pms_begeni + pms_bahsedilme)
			{
				infelmnum =  pms_begeni + pms_bahsedilme;
			}
			pms = pms_real - infelmnum;
			if(parseInt(InfElemsText) <= 0)
			{
				InfElems.style.color = "";
			}
			else
			{
				InfElems.style.color = "red";
			}
		}
		else
		{
			InfElems.style.color = "";
		}
		var PMElem = GetHtmlElements(document, "img", "src", "forum_images/PmNew.png")[0];
		if(PMElem == null) PMElem = GetHtmlElements(document, "img", "src", "forum_images/Pm.png")[0];
		if(pms <= 0)
		{
			PMElem.parentNode.style.color = "";
			PMElem.parentNode.innerHTML = '<img src="https://www.Cyber-Warrior.Org/Forum/forum_images/Pm.png" style="padding-right:6px; vertical-align:middle;" title="Özel Mesajlar" border="0">PM';
			pms = 0;
		}
		else
		{
			PMElem.parentNode.setAttribute("color", "#e53743");
			PMElem.parentNode.innerHTML = '<img src="https://www.Cyber-Warrior.Org/Forum/forum_images/PmNew.png" style="padding-right:6px; vertical-align:middle;" title="9 Okunmamış Yeni Mesaj" border="0">' + pms.toString() + ' PM';
		}
	}
	document.getElementById("b_özelmesaj").innerHTML = pms.toString();
	if(pms > 0)
	{
		document.getElementById("cwe_b_özelmesaj").style.display = "";
		SetBold("b_özelmesaj");
		document.getElementById("b_özelmesaj_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_özelmesaj");
		SetRegular("b_özelmesaj");
		document.getElementById("b_özelmesaj_b").style.fontWeight = "normal";
	}
	document.getElementById("b_member").innerHTML = mntw.toString();
	if(mntw > 0)
	{
		document.getElementById("cwe_b_member").style.display = "";
		SetBold("b_member");
		document.getElementById("b_member_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_member");
		SetRegular("b_member");
		document.getElementById("b_member_b").style.fontWeight = "normal";
	}
	document.getElementById("b_kefalet").innerHTML = keflt.toString();
	if(keflt > 0)
	{
		document.getElementById("cwe_b_kefalet").style.display = "";
		SetBold("b_kefalet");
		document.getElementById("b_kefalet_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_kefalet");
		SetRegular("b_kefalet");
		document.getElementById("b_kefalet_b").style.fontWeight = "normal";
	}
	document.getElementById("b_oys").innerHTML = moys.toString();
	if(moys > 0)
	{
		document.getElementById("cwe_b_oys").style.display = "";
		SetBold("b_oys");
		document.getElementById("b_oys_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_oys");
		SetRegular("b_oys");
		document.getElementById("b_oys_b").style.fontWeight = "normal";
	}

	document.getElementById("b_güncelle").innerHTML = '<a style="color: gray;" href="JavaScript:CWAddonGuncelle()">Güncelle</a>';
}
unsafeWindow.ToggleDrop = function()
{
	if(document.getElementById('dropcontent').style.display != 'none')
	{
		document.getElementById('dropcontent').style.display = 'none';
	}
	else
	{
		document.getElementById('dropcontent').style.display = 'inline-table';
	}
}
function inSertDropDown()
{
	if(document.getElementById("dropheader") != null) return false;
	var mElemeX = document.getElementById("cwe_bildirimyeri");
	var tablenodeEx = document.createElement("table");
	tablenodeEx.setAttribute("border", "1");
	tablenodeEx.setAttribute("id", "dropheader");
	tablenodeEx.setAttribute("width", "220");
	tablenodeEx.setAttribute("style", "display: inline-table; background-color: #f9f9f9; clear:both;border: 1px solid #c2cde0;border-collapse: collapse;");
	tablenodeEx.innerHTML = '<tr><td width=180>Bildirimleriniz (<font color=gray size=1 id="b_güncelle"><img src="../ajaxtabs/loading.gif"></font>)</td><td width=40 style=""><a href="JavaScript:ToggleDrop();"><div id="toplam_bildirim" style="text-align: center;">0</div></a></td></tr>';
	mElemeX.appendChild(tablenodeEx);

	var tablenode2Ex = document.createElement("table");
	tablenode2Ex.setAttribute("style", 'display: none; position:absolute; background: #f9f9f9; color: black; z-index: 1; border: 1px solid #c2cde0;border-collapse: collapse;');
	tablenode2Ex.setAttribute("border", "1");
	tablenode2Ex.setAttribute("id", "dropcontent");
	tablenode2Ex.setAttribute("width", "220");
	AddItemDD(tablenode2Ex, "Özel Mesaj(lar)", "b_özelmesaj", "pm_inbox.asp#");
	AddItemDD(tablenode2Ex, "Bahsedilmeler", "b_etiket", "pm_inbox.asp#");
	AddItemDD(tablenode2Ex, "Beğeniler", "b_begeni", "pm_inbox.asp#");
	AddItemDD(tablenode2Ex, "Member Network", "b_member", "MemberNetwork.Asp#");
	AddItemDD(tablenode2Ex, "OYS", "b_oys", "OYS.asp#");
	AddItemDD(tablenode2Ex, "Kefalet Havuzu", "b_kefalet", "KefilHavuz.asp#");
	//mElem.children[0].appendChild(tablenode);
	mElemeX.children[0].appendChild(tablenode2Ex);

}
function AddItemDD(mTableNode, tnameTN, tidTN, linkTN)
{
	var mtextTNex = StringFormat('<tr><td width=200 id={1}_b>{0}<div  id="cwe_{1}" onclick="CWEBildGosterGizle(this);" style="display: none;float:right;color: blue;cursor: pointer;">▼</div></td><td width=20><a href={2}><div id={1} style="text-align: center;">0</div></a></td></tr>', tnameTN, tidTN, linkTN);
	mtextTNex += StringFormat('<tr style="display:none;" id="cwe_{0}_ayrinti"><td colspan=2><div style="overflow: auto;max-height: 120px;"><table id=cwe_{0}_ayrinti_table border=1  width=90% align=center  style="background: #f9f9f9; color: black; z-index: 1; border: 1px solid #c2cde0;border-collapse: collapse;"></table></div></td></tr>', tidTN);
	mTableNode.innerHTML += mtextTNex;
}
function GirisYapildi2()
{
	var FrCook = GetCookie("Forum");
	if(FrCook == null) return false;
	if(FrCook.indexOf("LOGGED%2DOFF") >= 0) return false;
	return true;
}
function GirisYapildi()
{
	var mElem = GetHtmlElement("a", "href", "pop_up_profile.asp?profile=0");
	if(mElem != null)
	{
		if(mElem.innerHTML == "Sivil")
		{
			return false;
		}
	}
	return true;
}
function CWEBildirimleriAyir()
{
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/OYS.Asp", CWETimleriAl);
}
function CWETimleriAl(Dokuman)
{
	TimListesiCWE = CWETimListesiniAl(Dokuman.responseText);
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/AXdiv.asp", CWEBildirimleriAyirAsync);
}
function CWEBildirimleriAyirAsync(Dokuman)
{
	controlled++;
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		ListeKontrol();
		return false;
	}
	if(mHtml == "")
	{
		ListeKontrol();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var CWE_AllBildItem = GetHtmlElements(xmlDoc, "td", "class", "TdRowG");
	if(CWE_AllBildItem.length <= 0)
	{
		ListeKontrol();
		return false;
	}
	var CWE_AllBildFR = "";
	var CWE_AllTimArray = new Array();
	var CWE_AllTimArrayNum = new Array();
	var CWETimlist = 0;
	var CWEEtiket = 0;
	var CWEBegeni = 0;
	var cwe_etiketbildinner = "";
	var cwe_begenibildinner = "";
	for(var ababab = 0; ababab < CWE_AllBildItem.length - 1; ababab++)
	{
		CWE_AllBildFR = CWE_AllBildItem[ababab].textContent.trim().split("\n")[0];
		var OYSAItems = CWE_AllBildItem[ababab].getElementsByTagName("a");
		if(CWE_AllBildFR.match(/^(\[[0-9]+\] Operasyon TIM Uyarı)$/gi) != null)
		{
			var OYSAText = OYSAItems[1].getAttribute("href");
			if(CWE_AllTimArray.indexOf(OYSAText) >= 0)
			{
				CWE_AllTimArrayNum[CWE_AllTimArray.indexOf(OYSAText)]++;
			}
			else
			{
				CWE_AllTimArray.push(OYSAText);
				CWE_AllTimArrayNum.push(1);
			}
			CWETimlist++;
			continue;
		}
		if(CWE_AllBildFR.match(/^(\[[^\r\n\t]+\] Bir Mesajınızı Begendi)$/gi) != null)
		{
			CWEBegeni++;
			cwe_begenibildinner += StringFormat("<tr><td><b>{0}</b>: {1}</td></tr>", OYSAItems[0].outerHTML, OYSAItems[1].outerHTML);
			continue;
		}
		if(CWE_AllBildFR.match(/^(\[[^\r\n\t]+\] Bir Mesajınızı Begenmekten Vazgecti)$/gi) != null)
		{
			CWEBegeni++;
			cwe_begenibildinner += StringFormat("<tr><td><b>{0}</b>: {1}</td></tr>", OYSAItems[0].outerHTML, OYSAItems[1].outerHTML);
			continue;
		}
		if(CWE_AllBildFR.match(/^(\[[^\r\n\t]+\] Bir Gönderide Sizi Etiketledi)$/gi) != null)
		{
			CWEEtiket++;
			cwe_etiketbildinner += StringFormat("<tr><td><b>{0}</b>: {1}</td></tr>", OYSAItems[0].outerHTML, OYSAItems[1].outerHTML);
			continue;
		}
	}
	var cwe_timbildInner = "";
	for(ababab = 0; ababab < CWE_AllTimArray.length; ababab++)
	{
		var cwe_timindex = CWETimListesiIndexOf(TimListesiCWE, "https://www.cyber-warrior.org/Forum/" + CWE_AllTimArray[ababab]);
		if(cwe_timindex < 0) continue;
		cwe_timbildInner += StringFormat("<tr><td><b>{0}</b>: {1}</td></tr>", TimListesiCWE[cwe_timindex].TimOuter, CWE_AllTimArrayNum[ababab]);
	}
	CheckBegeni(CWEBegeni);
	CheckEtiket(CWEEtiket);
	pms_bahsedilme = CWEEtiket;
	pms_begeni = CWEBegeni;
	var SecureItem = GetHtmlElements(document, "input", "name", "securityCode");
	if((AnaSayfada | OYSSayfasinda ) && CWETimlist > 0 && SecureItem.length <= 0)
	{
		var BildirimSupIds = new Array();
		for(ababab = 0; ababab < CWE_AllTimArray.length; ababab++)
		{
			var aratext  = CWE_AllTimArray[ababab].replace(" PM", "");
			var argtext1 = "https://www.cyber-warrior.org/Forum/" + CWE_AllTimArray[ababab];
			var argtext2 = argtext1.replace("&Oid=" + GetDataValue(argtext1, "Oid"), "Oid=0");
			var oystimCWEElems = GetHrefElements(document, argtext1, argtext2);
			if(oystimCWEElems == null || oystimCWEElems.undefined) continue;
			for(abababex = 0; abababex < oystimCWEElems.length; abababex++)
			{
				oystimCWEElem = oystimCWEElems[abababex];
				if(oystimCWEElem == null || oystimCWEElem.undefined) continue;
				var Ntimcreatedid = "sp-" + GetDataValue(oystimCWEElem.href, "OPTeamid") + "_" + GetDataValue(oystimCWEElem.href, "Oid");
				oystimCWEElem.setAttribute("cwe_tag", "oyssup");
				CheckTimSub(oystimCWEElem, ababab, CWE_AllTimArrayNum[ababab], Ntimcreatedid);
				BildirimSupIds.push(Ntimcreatedid);

			}

		}
		var AllTimSuppedElem = GetHtmlElements(document, "sup", "cwe_tag", "oyssup");
		var AllTimSuppedElemA = GetHtmlElements(document, "a", "cwe_tag", "oyssup");
		for(ababab = 0; ababab < AllTimSuppedElem.length; ababab++)
		{
			if(BildirimSupIds.indexOf(AllTimSuppedElem[ababab].id) >= 0) continue;
			CheckTimSub(AllTimSuppedElemA[ababab], ababab, 0, AllTimSuppedElem[ababab].id);
		}
	}
	document.getElementById("cwe_b_oys_ayrinti_table").innerHTML = cwe_timbildInner;
	document.getElementById("cwe_b_etiket_ayrinti_table").innerHTML = cwe_etiketbildinner;
	document.getElementById("cwe_b_begeni_ayrinti_table").innerHTML = cwe_begenibildinner;
	ListeKontrol();
}
function CheckBegeni(bgncount)
{
	document.getElementById("b_begeni").innerHTML = bgncount.toString();
	if(bgncount > 0)
	{
		document.getElementById("cwe_b_begeni").style.display = "";
		SetBold("b_begeni");
		document.getElementById("b_begeni_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_begeni");
		SetRegular("b_begeni");
		document.getElementById("b_begeni_b").style.fontWeight = "normal";
	}
}
function CheckEtiket(etktcount)
{
	document.getElementById("b_etiket").innerHTML = etktcount.toString();
	if(etktcount > 0)
	{
		document.getElementById("cwe_b_etiket").style.display = "";
		SetBold("b_etiket");
		document.getElementById("b_etiket_b").style.fontWeight = "bold";
	}
	else
	{
		CWEBildSetDisplayNone("cwe_b_etiket");
		SetRegular("b_etiket");
		document.getElementById("b_etiket_b").style.fontWeight = "normal";
	}
}
function CheckTimSub(timelement, timindex, timbnumber, timcreatedid )
{
	if(timbnumber <= 0)
	{
		timelement.style.fontWeight = "normal";
		RemoveSup(timcreatedid);
		return;
	}
	timelement.style.fontWeight = "bold";
	if(document.getElementById(timcreatedid) == null) timelement.innerHTML += "<sup cwe_tag=oyssup id=" + timcreatedid + " style='color: red;'>" + timbnumber.toString() + "</sup>";
	document.getElementById(timcreatedid).innerHTML = timbnumber.toString();
}
function KefilHavuz()
{
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/KefilHavuz.asp?cwe_off=1", KefilHavuzAsync);
}
function KefilHavuzAsync(Dokuman)
{
	controlled++;
	/*
	var mElem = GetHtmlElement("a", "href", "KefilHavuz.asp");
	if(mElem == null)
	{
		ListeKontrol();
		return false;
	}*/
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		ListeKontrol();
		return false;
	}
	if(mHtml == "")
	{
		ListeKontrol();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var nYorumYazanlar = xmlDoc.getElementsByTagName("textarea");
	var sayi = nYorumYazanlar.length;
	var CWEKefilInner = "";
	for(var cbab = 0; cbab < sayi; cbab++)
	{
		var cweYorumyparent = nYorumYazanlar[cbab].parentNode.parentNode.parentNode;
		CWEKefilInner += StringFormat("<tr><td><b>{0}</b>: {1} <abbr title='{2}'>...</abbr></td></tr>", getElementByXpath(xmlDoc, cweYorumyparent,  "td[1]").textContent, nYorumYazanlar[cbab].value.substr(0, 30), nYorumYazanlar[cbab].value);
	}
	document.getElementById("cwe_b_kefalet_ayrinti_table").innerHTML = CWEKefilInner;
	/*
	if(sayi <= 0)
	{
		mElem.style.fontWeight = "normal";
		RemoveSup("spkefil");
		ListeKontrol();
		return false;
	}

	mElem.style.fontWeight = "bold";
	if(document.getElementById("spkefil") == null) 	mElem.innerHTML += "<sup id=spkefil>" + sayi.toString() + "</sup>";
	document.getElementById("spkefil").innerHTML = sayi.toString();*/
	keflt = sayi;
	ListeKontrol();
}
function Yorumlar()
{
	GetHtmlDoFunc("https://www.cyber-warrior.org/Forum/MemberNetwork.Asp?cwe_off=1", YorumlarAsync);
}
function YorumlarAsync(Dokuman)
{
	controlled++;
	var mElem = GetHtmlElement("a", "href", "MemberNetwork.Asp");

	if(mElem == null)
	{
		ListeKontrol();
		return false;
	}
	var mHtml = Dokuman.responseText;
	if(mHtml == null)
	{
		ListeKontrol();
		return false;
	}
	if(mHtml == "")
	{
		ListeKontrol();
		return false;
	}
	var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(mHtml,"text/html");
	var pmcountext = GetHtmlElements(xmlDoc, "a", "href", "pm_inbox.asp")[0].textContent;
	pmcountext = pmcountext.replace(" PM", "");
	pms = 0;
	if(!isNaN(pmcountext) && pmcountext != "" && pmcountext != " ")
	{
		var toplam = parseInt(pmcountext);
		pms = toplam;
		pms_real = pms;

	}
	var YorumYazanlar = xmlDoc.getElementsByTagName("textarea");
	var sayi = YorumYazanlar.length;

	if(sayi <= 0)
	{
		document.getElementById("cwe_b_member_ayrinti_table").innerHTML = "";
		mElem.style.fontWeight = "normal";
		RemoveSup("spyorum");
		ListeKontrol();
		return false;
	}
	var YorumYazanlarInner = "";
	for(var abab = 0; abab < sayi; abab++)
	{
		var cweYorumyparent = YorumYazanlar[abab].parentNode.parentNode;
		YorumYazanlarInner += StringFormat("<tr><td><b>{0}</b>: {1} <abbr title='{2}'>...</abbr></td></tr>", getElementByXpath(xmlDoc, cweYorumyparent,  "td[1]").innerHTML, YorumYazanlar[abab].value.substr(0, 30), YorumYazanlar[abab].value);
	}
	document.getElementById("cwe_b_member_ayrinti_table").innerHTML = YorumYazanlarInner;
	mElem.style.fontWeight = "bold";
	if(document.getElementById("spyorum") == null) mElem.innerHTML += "<sup id=spyorum style='color: red;'>" + sayi.toString() + "</sup>";
	document.getElementById("spyorum").innerHTML = sayi.toString();
	mntw = sayi;
	ListeKontrol();
}
function KefaletHesapla()
{
	if(document.getElementById("email") == null) return;
	var inputitems = document.getElementsByName("Re");
	var yer = document.getElementsByClassName("tHeading");
	if(yer == null) return false;
	if(yer.length < 2) return false;
	if(inputitems == null) return false;
	var kabuledenler = 0;
	var kabuletmeyenler = 0;
	for(var i = 0; i < inputitems.length; i++)
	{
		if(inputitems[i].disabled)
		{
			kabuledenler++;
		}
		else
		{
			kabuletmeyenler++;
		}
	}
	var innertext = StringFormat("(<font color=lime>Davete İcabet Edenler: <b>{0}</b></font>, <font color=orange>Davete İcabet Etmeyenler: <b>{1}</b></font>)", kabuledenler, kabuletmeyenler);
	yer[1].innerHTML += innertext;
}
function NewPm()
{
	var usernm = GetDataValue(document.URL, "name");
	if(usernm == null) return false;
	if(usernm == "") return false;
	var membrelem = document.getElementsByName("member");
	if(membrelem == null) return false;
	membrelem = membrelem[0];
	if(membrelem == undefined) return false;
	membrelem.value = unescape(toTrChar(usernm.replace(/\+/gi, " ")));
}
function toTrChar(mmtn)
{
	var mnnmextra = mmtn;
	mnnmextra = mnnmextra.replace(/\%FD/gi, "ı")
	mnnmextra = mnnmextra.replace(/\%C4%B0/gi, "İ")
	mnnmextra = mnnmextra.replace(/\%DE/gi, "Ş")
	mnnmextra = mnnmextra.replace(/\%FE/gi, "ş")
	mnnmextra = mnnmextra.replace(/\%DD/gi, "İ")

	return mnnmextra;
}
function SanalKlavyeGizle()
{
	var passelm = document.getElementById("sanalklavye");
	if(passelm == null) return false;

	passelm.style.visibility = "hidden";
}
function ForumSifresi()
{
	var passelm = document.getElementsByName("password");
	if(passelm == null) return false;
	passelm = passelm[0];
	var inputelem = document.createElement("input");
	inputelem.setAttribute("type", "checkbox");
	inputelem.setAttribute("tabindex", "-1");
	inputelem.setAttribute("onchange", "PasswordChanged(this);");
	inputelem.setAttribute("title", "Göster/Gizle");
	passelm.parentNode.appendChild(inputelem);
}
function SifreHatirla()
{
	var passelem = document.getElementsByName("password")[0];
	if(passelem == null || passelem == undefined) return false;
	var trelem = document.createElement("tr");
	trelem.innerHTML = "<td align=right><input id=sifrehatirla type=checkbox title=Parolayı Hatırla onchange='' /></td><td align=left><span class=text>Parolayı Hatırla</span></td>";
	var passelemparent = passelem.parentNode.parentNode.parentNode;
	passelemparent.insertBefore(trelem, passelem.parentNode.parentNode.nextSibling);

	var trelem2 = document.createElement("tr");
	trelem2.id = "kayitliparola_sil";
	passelemparent.insertBefore(trelem2, trelem.nextSibling);
	var formid = GetDataValue(document.URL, "ForumID");
	trelem2.innerHTML = StringFormat("<td></td><td align=left><a href=\"javascript:DeletePassword('{0}');\">Kayıtlı Parolayı Sil</a></td>", formid);
	var submtbtn = document.getElementsByName("frmLogin")[0];
	if(submtbtn != null && submtbtn != undefined)
	{
		submtbtn.setAttribute("onsubmit", StringFormat("return SaveFormPassword('{0}');", formid))
	}

	if(formid != "" && formid != "0")
	{
		var psswrd = getformpassword(formid, cwe_activeusername);
		passelem.value = psswrd;
		var shatirla = document.getElementById("sifrehatirla");
		if(shatirla != null && shatirla != undefined && psswrd != "")
		{
			shatirla.checked = true;
			trelem2.style.display = "";
		}
		else
		{
			trelem2.style.display = "none";
		}
	}
}
unsafeWindow.DeletePassword = function(sender, formid)
{
	if(!confirm("Bu form için kaydedilmiş parolayı sistemden silmek istediğinizden eminmisiniz(İşlemin geri dönüşü yoktur.)?"))
	{
		return;
	}
	deleteformpass(formid, cwe_activeusername);
	alert("Kayıtlı parola hafızadan silindi.");
	document.getElementById("kayitliparola_sil").style.display = "none";
}
unsafeWindow.SaveFormPassword = function(formid)
{
	var passelem = document.getElementsByName("password")[0];
	if(passelem == null || passelem == undefined) return 1;
	if(formid == "" || formid == "0") return 1;
	var shatirla = document.getElementById("sifrehatirla");
	if(shatirla == null || shatirla == undefined || !shatirla.checked)
	{
		deleteformpass(formid, cwe_activeusername);
	}
	else
	{
		setformpassword(formid, cwe_activeusername, passelem.value);
	}
	return 1;
}
unsafeWindow.PasswordChanged = function(item)
{
	if(item.checked)
	{
		document.getElementsByName("password")[0].setAttribute("type", "input");
	}
	else
	{
		document.getElementsByName("password")[0].setAttribute("type", "password");
	}
}
function CWEBildSetDisplayNone(bilditem_id)
{
	document.getElementById(bilditem_id).innerHTML = "▼";
	document.getElementById(bilditem_id).style.display = "none";
	document.getElementById(bilditem_id + "_ayrinti").style.display = "none";
}
unsafeWindow.CWEBildGosterGizle = function(cwesender)
{
	if(cwesender == undefined || cwesender == null) return;
	var cwesenderayrinti = document.getElementById(cwesender.getAttribute("id") + "_ayrinti");
	if(cwesenderayrinti == null) return;
	if(cwesenderayrinti.style.display == "none")
	{
		cwesenderayrinti.style.display = "";
		cwesender.innerHTML = "▲";
	}
	else
	{
		cwesenderayrinti.style.display = "none";
		cwesender.innerHTML = "▼";
	}
}

function MesajGoster(cwem_baslik, cwem_icerik, cwe_element, cwe_type, mesajgosterfunc, musehtml, mcweuserdata)
{
	cwe_curelement = cwe_element;
	var cwe_innertext = '<div class="cwe_modal-content">';
	cwe_innertext += '<table  width="100%" style="border: 1px solid"><tr><td align=center><b>' + cwem_baslik + '</b><span id=span_kapat onclick="document.getElementById(\'CWE_MesajKutusu\').style.display = \'none\';document.getElementById(\'CWE_MesajKutusu\').innerHTML = \'\';" class=cwe_close>X</span></td></tr></table>';
	cwe_innertext += '<table border=1 id=cwe_bild_info width="100%" style="border: 1px solid">';
	onkeydownmsg_cwe = ' onkeydown="if(event.keyCode == 13 && !event.shiftKey){' + mesajgosterfunc.name +'(' + cwe_type + ',' + mcweuserdata + '); event.preventDefault();}else if(event.keyCode == 27) {document.getElementById(\'span_kapat\').click();}"';
	switch(cwe_type)
	{
		case 0: //Sadece metin
			cwe_innertext += '<tr><td>' + cwem_icerik + '</td></tr>';
			break;
		case 1: //Linki düzenle
			if(cwe_element.tagName != "A") return;
			cwe_innertext += '<tr><td width="30%">Link</td><td><input type="input" id="cwe_linka" style="width:100%" value="' + cwe_element.getAttribute("href") + '"' + onkeydownmsg_cwe + '></td></tr>';
			var innertext = cwe_element.innerHTML.replaceAll("\"", "&quot;");
			if(musehtml != undefined && musehtml)
			{
				innertext = HtmlToCW(false, innertext);
			}
			cwe_innertext += '<tr><td width="30%">Link Yazısı</td><td><input type="input" id="cwe_linkb" style="width:100%" value="' + innertext+ '\"' + onkeydownmsg_cwe + '></td></tr>';
			break;
		case 2: //EPosta Düzenle
			if(cwe_element.tagName != "A") return;
			var nCWEDefault = cwe_element.getAttribute("href");
			if(Str_StartWith(nCWEDefault, "mailto:"))
			{
				nCWEDefault = nCWEDefault.substring(7);
			}
			cwe_innertext += '<tr><td width="35%">E-Posta</td><td><input type="input" id="cwe_linka" style="width:100%" value="' + nCWEDefault + '"' + onkeydownmsg_cwe + '></td></tr>';
			innertext = cwe_element.innerHTML.replaceAll("\"", "&quot;");
			if(musehtml != undefined && musehtml)
			{
				innertext = HtmlToCW(false, innertext);
			}
			cwe_innertext += '<tr><td width="35%">E-Posta Yazısı</td><td><input type="input" id="cwe_linkb" style="width:100%" value="' + innertext+ '\"' + onkeydownmsg_cwe + '></td></tr>';
			break;
		case 3: //Resim Yükle
			if(cwe_element.tagName != "IMG") return;
			nCWEDefault = cwe_element.getAttribute("src");
			if(nCWEDefault==null) nCWEDefault = "";
			nCWEDefault = nCWEDefault.replaceAll("\"", "&quot;");
			if(musehtml != undefined && musehtml)
			{
				nCWEDefault = HtmlToCW(false, nCWEDefault);
			}
			cwe_innertext += '<tr><td width="30%">Resmin Linki</td><td><input type="input" id="cwe_linkresim" style="width:100%" value="' + nCWEDefault+ '\"' + onkeydownmsg_cwe + '></td></tr>';
			break;
		case 4: //Liste Yeni Editör için
			cwe_innertext += '<tr><td colspan=2>Liste Biçimi: <select id=cwe_lists> <option value="0">Numaralı</option><option value="1">Numarasız</option></select></td></tr>';
			break;
		case 5: //Liste Eski Editör için
			cwe_innertext += '<tr><td colspan=2>&nbsp;Liste Biçimi: <select id=cwe_lists> <option value="0">Numaralı</option><option value="1">Numarasız</option></select> ( <a href="javascript:CWE_ListeEkleCikart(true);"><b>+</b></a>, <a href="javascript:CWE_ListeEkleCikart(false);"><b>-</b></a> )</td></tr>';
			cwe_innertext += '<tr><td><div style="max-height: 200px;overflow-y: auto;"><table width="100%" id=cwe_bild_info_list><tr cwe_info="list-tr"><td align=center>1.</td><td><input type="input" name=cwe_listitem style="width:100%" value=""' + onkeydownmsg_cwe + '></td></tr></table></div></td></tr>';
			break;
		case 6: //Ayet Ekle
            nCWEDefault = cwe_element.innerHTML;
			if(musehtml)
			{
				nCWEDefault = HtmlToCW(false, nCWEDefault);
			}
			nCWEDefault = nCWEDefault.replaceAll("\"", "&quot;");
			cwe_innertext += '<tr><td colspan=2><textarea id=cwe_ayet rows="6" style="width:100%"' + onkeydownmsg_cwe + '>' + nCWEDefault +'</textarea></td></tr>';
			break;
		case 7: //Youtube Video
			nCWEDefault = cwe_element.innerHTML;
			nCWEDefault = nCWEDefault.replaceAll("\"", "&quot;");
			cwe_innertext += '<tr><td width="35%">Youtube Linki</td><td><input type="input" id="cwe_youtube" style="width:100%" value="' + nCWEDefault+ '\"' + onkeydownmsg_cwe + '></td></tr>';
			break
		case 8: //WebSite Şikayet Formu
			cwe_innertext += '<tr><td colspan=2>&nbsp;Liste Biçimi: <select id=cwe_lists> <option value="0">Numaralı</option><option value="1">Numarasız</option></select> ( <a href="javascript:CWE_ListeEkleCikart(true);"><b>+</b></a>, <a href="javascript:CWE_ListeEkleCikart(false);"><b>-</b></a> )</td></tr>';
			cwe_innertext += '<tr><td><div style="max-height: 200px;overflow-y: auto;"><table width="100%" id=cwe_bild_info_list><tr cwe_info="list-tr"><td align=center>1.</td><td><input type="input" name=cwe_listitem style="width:100%" value=""' + onkeydownmsg_cwe + '></td></tr></table></div></td></tr>';
			break;
	}
	if(mesajgosterfunc == undefined) mesajgosterfunc = cwe_islemyap;
	cwe_innertext += '</tr></table><table  width="100%" style="border: 1px solid"><tr><td align=center><input onclick="' + mesajgosterfunc.name +'(' + cwe_type + ',' + mcweuserdata +');" type="button" value="Tamam"></td></tr></table></div>';
	document.getElementById("CWE_MesajKutusu").innerHTML = cwe_innertext;
	document.getElementById("CWE_MesajKutusu").style.display = "block";
}
function cwe_islemyap()
{
}
unsafeWindow.cwe_islemyap = function(cwe_type, cwe_userdata)
{
	document.getElementById('CWE_MesajKutusu').style.display = 'none';
	switch(cwe_type)
	{
		case 1: //Linki düzenle
			if(cwe_curelement.tagName != "A") return;
			cwe_curelement.setAttribute("href", document.getElementById("cwe_linka").value);
			cwe_curelement.innerHTML = document.getElementById("cwe_linkb").value;
		break;
	}
	document.getElementById('CWE_MesajKutusu').innerHTML = "";
}
window.onclick = function(event) {
    if (event.target == document.getElementById('CWE_MesajKutusu')) {
        document.getElementById('CWE_MesajKutusu').style.display = "none";
		document.getElementById('CWE_MesajKutusu').innerHTML = "";
    }
}
unsafeWindow.CWE_ListeEkleCikart = function(cwe_ekle)
{
	var AllItems = GetHtmlElements(document, "tr", "cwe_info", "list-tr");
	if(cwe_ekle)
	{
		var mCWETableItem = document.getElementById("cwe_bild_info_list");
		var mCWETableTRNode = document.createElement("tr");
		mCWETableTRNode.setAttribute("cwe_info", "list-tr");
		mCWETableTRNode.innerHTML = "<td align=center>" + (AllItems.length + 1).toString() + '.</td><td><input name="cwe_listitem" style="width:100%" value="" type="input"' + onkeydownmsg_cwe + '></td>'
		mCWETableItem.appendChild(mCWETableTRNode);
	}
	else
	{
		if(AllItems.length == 0) return;
		AllItems[AllItems.length - 1].parentNode.removeChild(AllItems[AllItems.length - 1]);
	}
}
unsafeWindow.posted_on_submit = false;
var is_portal_editor = false;
var toolitems = new Array();
var activeCWEditor;
var addedscount = 0;
var ColorIndex = new Array();
var prevselstart = 0;
CWEditorBasla();
var oncekimesaj;
function CWEditorBasla()
{
	setTimeout("Giris()", 100);
}
var originalwidth = 700;
var originalheight = 350;
var modifiedwidth = originalwidth;
var modifiedheight = originalheight;
var totalbuyultme = 0;
var editorboyut_min =  -2;
var editorboyut_max = 5;
unsafeWindow.CWEditor = function(textId)
{
	this.theTextarea = document.getElementById(textId);
	this.theContainer = document.createElement("div");
	this.mIframe = document.createElement("iframe");
	this.mIframe.width = modifiedwidth - 2;
	this.mIframe.height = modifiedheight;
	this.theInput = document.createElement("input");
	this.theExtraInput = document.createElement("input");
	if (this.theTextarea.id == null)
	{
		this.theTextarea.id = this.theTextarea.name;
	}
	this.theTextarea.style.visibility = "hidden";
	this.theTextarea.style.resize = "none";
	this.theTextarea.setAttribute("spellcheck", "false");
	this.theContainer.id = this.theTextarea.id + "CWEditr";
    this.theContainer.ondrop = onDropEditor;
    this.theContainer.ondragover = onDropAllowEditor;


	this.theContainer.className = "CWEditr";
	this.mIframe.id = this.theTextarea.id + "CWF";
	this.mIframe.className = "CWF";
	this.YeniEditor = true;
	this.theInput.type = "hidden";
	this.theInput.id = this.theTextarea.id;
	this.theInput.name = this.theTextarea.name;
	this.mToolbar = document.createElement("div");
	this.mToolbar.setAttribute("id", "toolbar");
	var mHeader1 = '\
                            <tbody><tr> \
                              <td colspan=2 width="396"><div style="padding:5px;padding-left:2px;padding-right:0px;border-bottom:1px solid gray;"> \
                                <select name="selectFont" id=font onchange="OnClickElemnt(\'font\');">\
                                  <option value="Default" selected="">-- \
                                  Font\
                                  --</option>\
								  <option value="Default">Standart</option>\
                                  <option value="Arial">Arial</option>\
                                  <option value="Courier">Courier New</option>\
                                  <option value="Times">Times New Roman</option>\
                                  <option value="Verdana">Verdana</option>\
                                </select>\
                                <select name="selectSize" id=head onchange="OnClickElemnt(\'head\');">\
                                  <option selected="" value="">-- \
                                  Boyut\
                                  --</option>\
								  <option value="">Standart</option>\
                                  <option value="1">1</option>\
                                  <option value="2">2</option>\
                                  <option value="3">3</option>\
                                  <option value="4">4</option>\
                                  <option value="5">5</option>\
                                  <option value="6">6</option>\
                                </select>\
                                <select name="selectColour" id=color onchange="OnClickElemnt(\'color\');">\
                                  <option value="BLACK" selected="">-- \
                                  Renk\
                                  --</option>\
								  <option value="BLACK"> \
								  Standart\
								  </option>\
                                  <option value="WHITE"> \
                                  Beyaz\
                                  </option>\
                                  <option value="BLUE"> \
                                  Mavi\
                                  </option>\
                                  <option value="RED"> \
                                  Kırmızı\
                                  </option>\
                                  <option value="GREEN"> \
                                  Yeşil\
                                  </option>\
                                  <option value="YELLOW"> \
                                  Sarı\
                                  </option>\
                                  <option value="ORANGE"> \
                                  Turuncu\
                                  </option>\
                                  <option value="BROWN"> \
                                  Kahverengi\
                                  </option>\
                                  <option value="MAGENTA"> \
                                  Pembe\
                                  </option>\
                                  <option value="CYAN"> \
                                  Açık Mavi\
                                  </option>\
                                  <option value="LIME GREEN"> \
                                  Açık Yeşil\
                                  </option>\
                                </select>                             \
                              <span id=code_form  class="text"><span style="font-size: 10px;"><a href="JavaScript:openWin(\'forum_codes.asp\',\'codes\',\'toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=550,height=400\')" style="font-size: 10px;"> \
                                Forum Kodları\
                                </a></span></span><div style="float:right;padding-right:2px;"> \
								                     <span class="text"> Editör\
                                :</span> \
                                <select name="selectMode" id=editorturu onchange="EditorDegis()">\
                                  <option value="1" selected=""> \
                                  Yeni\
                                  </option>\
                                  <option value="0"> \
                                  Klasik\
                                  </option>\
                                </select>                              \
								</div></div></td> \
                            </tr></tbody>';
		var mHeader2 = '<table id="imgtoolbar" border="0" cellpadding="1" cellspacing="1" width="100%">\
                            <tbody><tr>\
                              <td width="550">\
								<a href="javascript:OnClickElemnt(\'bold\');"><img id="bold" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_bold.png" title="Kalın(Ctrl + B)" align="absmiddle" border="0"></a> \
                                <a href="javascript:OnClickElemnt(\'italic\');"><img id="italic" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_italic.png" title="İtalic(Ctrl + I)" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'underline\');"><img id="underline" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_underline.png" title="Altı Çizili(Ctrl + U)" align="absmiddle" border="0"></a>\
                                <a href="javascript:OnClickElemnt(\'hyperlink\');"><img id="hyperlink" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_hyperlink.png" title="Web Sitesi Linki Ekle(Ctrl + E)" align="absmiddle" border="0"></a>\
                                <a href="javascript:OnClickElemnt(\'email\');"><img id="email" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_email.png" title="E-Mail Link Ekle" align="absmiddle" border="0"></a>\
                                <a href="javascript:OnClickElemnt(\'center\');"><img id="center" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_centre.png" title="Ortala(Ctrl + O)" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'list\');"><img id="list" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_list.png" title="Liste(Ctrl + L)" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'outdent\');"><img id="outdent"  src="https://www.cyber-warrior.org/Forum/forum_images/post_button_indent.png" style="-webkit-transform: rotate(180deg);-moz-transform: rotate(180deg);-o-transform: rotate(180deg);-ms-transform: rotate(180deg);transform: rotate(180deg);" title="Dışarıya dığru" align="absmiddle"></a>\
								<a href="javascript:OnClickElemnt(\'indent\');"><img id="indent" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_indent.png" title="İçeriye doğru(Ctrl + Shift + Q)" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'image\');"><img id="image" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_image.png" title="Resim Ekle(Ctrl + Y)" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'ayet\');"><img id="ayet" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_kuran.png" title="Ayet Ekle" align="absmiddle" border="0"></a>\
								<a href="javascript:OnClickElemnt(\'ytvideo\');"><img id="ytvideo" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_youtube.png" title="Youtube Video Ekle" align="absmiddle" border="0"></a>\
                                <a href="javascript:OnClickElemnt(\'smiley\');"><img id="smiley" src="https://www.cyber-warrior.org/Forum/forum_images/post_button_smiley.png" title="Hareketli Gülücükler" align="absmiddle" border="0"></a>\
                                </td>\
                              <td align="right" width="136"> \
          </td>\
                            </tr>\
                          </tbody>\
</table>';
	this.theExtraInput.type = "hidden";
	this.theExtraInput.id = this.theTextarea.id + "_CWEditor";
	this.theExtraInput.name = this.theTextarea.name + "_CWEditor";
	this.theExtraInput.value = "true";
	this.theTextarea.id += "_CWEditor";
	this.IsSignatureArea = this.theTextarea.name == "signature";
	this.theTextarea.name += "_CWEditor";
	this.mToolbar.innerHTML = mHeader1 + mHeader2;
	this.mToolbar.className = "Toolbar";
	this.mToolbar.style = "border:1px solid gray;";
	this.mSmileys = document.createElement("div");
	this.mSmileys.setAttribute("style", "float:left;position:relative;display:none;border-right: 1px solid gray;");
	this.mSmileys.setAttribute("id", "toolbar_smileys");
	var SmHtml = "";//StartSmiley();
	SmHtml = AddSmiley(SmHtml, "smileys/01.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/10.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a03.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/y06.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e06.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/02.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/09.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a04.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/y05.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e07.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/03.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/08.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a05.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/y01.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e08.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/04.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/12.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a06.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/y03.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e10.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/05.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/11.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a07.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/y02.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e09.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/06.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e01.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a08.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e04.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e05.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/07.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e02.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/a02.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e03.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e15.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e13.gif");
	SmHtml = AddSmiley(SmHtml, "smileys/e11.gif", 17, 30);
	SmHtml = AddSmiley(SmHtml, "smileys/e12.gif", 26, 30);
	SmHtml = AddSmiley(SmHtml, "smileys/e16.gif", 38, 30);
	SmHtml = AddSmiley(SmHtml, "smileys/e14.gif");
	SmHtml = FinishSmiley(SmHtml);
	this.mSmileys.onclick = function(sender)
	{
		if(sender == null || sender.srcElement == null) return;
		if(sender.srcElement.tagName.toUpperCase() != "DIV")
		{
			return;
		}
		if(sender.srcElement.firstChild == null || sender.srcElement.firstChild == undefined)
		{
			return;
		}
		if(sender.srcElement.firstChild.tagName.toUpperCase() != "a")
		{
			sender.srcElement.firstChild.click();
		}
	};

	this.mSmileys.innerHTML = SmHtml;
	this.mSmileys.className = "Toolbar";
	this.theContainer.appendChild(this.mToolbar);
	this.theContainer.appendChild(this.mSmileys);
	this.editorDivItem = document.createElement("div");
	this.editorDivItem.setAttribute("style", "clear:left;");
	this.editorDivItem.appendChild(this.mIframe);
	this.theContainer.appendChild(this.editorDivItem);
	this.theContainer.appendChild(this.theInput);
	this.theContainer.appendChild(this.theExtraInput);
	this.theContainer.style.visibility = "hidden";
	this.theInput.widgEditorObject = this;
	this.theTextarea.parentNode.replaceChild(this.theContainer, this.theTextarea);
	this.writeDocument(this.theInput.value);
	this.initEdit();
	var ResponseHtml = null;
	if(!this.IsSignatureArea)
	{
		ResponseHtml = GetMessageDirect();
		if(ResponseHtml == null)
		{
			var InPm = GetInnerPmText();

			if(InPm == null)
			{
				this.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtml(this.theTextarea.value);
			}
			else
			{
				var spltm = this.theTextarea.value.split('\n');
				var ekhtml = "";
				for(var j = 0; j < 5; j++)
				{
					ekhtml += CWtoHtml(spltm[j]) + "<br/>";
				}
				this.mIframe.contentWindow.document.getElementById("icerik").innerHTML = ekhtml + "<br/>" + InPm;
			}
		}
		else
		{
			var InMsg = GetContent(ResponseHtml);
			if(InMsg == null)
			{
				this.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtml(this.theTextarea.value);
			}
			else
			{
				this.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtmlLite(InMsg);
				/*this.mIframe.contentWindow.document.querySelectorAll("img").forEach(
					function(elem)
					{
						elem.setAttribute("contenteditable", "false");
					}
				);*/
			}
		}
	}
	else
	{
		this.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtml(this.theTextarea.value);
	}
	var msgeditor = document.getElementById("messageCWEditr");
	var selem = document.createElement("div");
	selem.setAttribute("id", "bottom");
	selem.setAttribute("class", "Toolbar");
	selem.setAttribute("style", "border: 1px solid gray;display: flex; justify-content: flex-end; ");
	//selem.innerHTML = "<table width='100%'  ><tbody><tr><td width='52%'><font class=text>CW Editor Sürüm: <b>1.5.4</b></font></td><td width='14%' align=center style='border: 1px solid;'><a href='javascript:EditorBuyultKucult(1)'>Büyült (+)</a></td><td width='14%' align=center style='border: 1px solid;'><a href='javascript:EditorBuyultKucult(0)'>Küçült (-)</a></td><td width='20%' align=center>" + createBoyut_All() + "</td></tr></tbody></table>";
	selem.innerHTML = "<table width='100%'  ><tbody><tr id=resim_area style='display: none;'><td  style='border-bottom: 1px solid gray;text-align: center;height: 40px;' colspan=3><div id=resim_area_div>Resim Yükleniyor...</div></td></tr><tr><td width='55%'><font class=text>CW Editor Sürüm: <b>v1.5.4</b></font></td><td width='15%' align=right><span class=text>Boyut: &nbsp;</span></td><td width='20%' align=center>" + createBoyut_All() + "</td></tr></tbody></table>";
	var e_tbl = msgeditor.closest("tbody");
	if(e_tbl == null || e_tbl == undefined)
	{
		e_tbl = msgeditor.closest("table");
	}
	msgeditor.appendChild(selem);
	var actbutton_elems = document.getElementById("form_act_button");
	if(this.IsSignatureArea) actbutton_elems = null;
	var uyarimsginner = "";
	if(actbutton_elems == null)
	{
		var hatavar = true;
		var tempitem = document.getElementsByName("Submit2")[0];
		if(tempitem != null && tempitem != undefined)
		{
			var temphdritem = tempitem.closest("div");
			if(temphdritem != null && temphdritem != undefined)
			{
				hatavar = false;
				actbutton_elems = temphdritem;
				var fntelem = actbutton_elems.getElementsByTagName("font")[0];

				if(fntelem != undefined && fntelem != null)
				{

					uyarimsginner = fntelem.outerHTML;
					actbutton_elems.removeChild(fntelem);

				}
			}

		}
		if(hatavar)
		{
			selem.setAttribute("id", "editor_bottom_last");
			return;
		}

	}
	var innerhtm = actbutton_elems.innerHTML;

	actbutton_elems.innerHTML = "";
	var whitecls = document.querySelector("span[class=white]");
	if(whitecls != undefined && whitecls != null)
	{
		uyarimsginner = whitecls.innerHTML;
		//whitecls.innerHTML = "";
		whitecls.parentElement.removeChild(whitecls);
	}
	msgeditor.appendChild(create_html_obj("div", uyarimsginner, "Toolbar", "border: 0px;border-left: 1px solid gray;border-right: 1px solid gray;text-align:center;padding-top:10px;", "editor_bottom2"));
	msgeditor.appendChild(create_html_obj("div", innerhtm, "Toolbar", "border: 0px;display: flex; justify-content: center;border-left: 1px solid gray;border-right: 1px solid gray; padding-top: 5px; ",  "editor_bottom"));
	var signatureelem = document.getElementsByName("signature")[0];
	var bottominner = "";
	if(signatureelem != null && signatureelem != undefined && signatureelem != null)
	{
		var tdparent = signatureelem.closest("td");
		if(tdparent != undefined)
		{
			bottominner = tdparent.innerHTML;
			//tdparent.innerHTML = "";
			tdparent.parentElement.removeChild(tdparent);
		}
	}
	msgeditor.appendChild(create_html_obj("div", bottominner, "Toolbar", "border: 0px;display: flex; justify-content: flex-end;border-left: 1px solid gray;border-right: 1px solid gray;border-bottom: 1px solid gray;padding-bottom:10px;padding-top:5px", "editor_bottom_last"));
	//e_tbl.insertBefore(selem, msgeditor.closest("tr").nextSibling);
}
function create_html_obj(tagname, innerhtml, classname= "", style = "", id = "")
{
	var selem = document.createElement(tagname);
	if(id != "")
	{
		selem.id = id;
	}
	if(style != "")
	{
		selem.setAttribute("style", style);
	}
	if(classname != "")
	{
		selem.setAttribute("class", classname);
	}
	selem.innerHTML = innerhtml;
	return selem;
}
function createBoyut_All()
{
	var allHtml = "<div id='editor_boyut_div'><select style='width: 100%;' id=editor_boyut name=editor_boyut onchange='BoyutDegis(this)'>";
	allHtml += createBoyut_single("Döküman", "5");
	allHtml += createBoyut_single("Çok Büyük", "3");
	allHtml += createBoyut_single("Büyük", "2");
	allHtml += createBoyut_single("Orta", "1");
	allHtml += createBoyut_single("Varsayılan", "0 selected");
	allHtml += createBoyut_single("Küçük", "-1");
	allHtml += createBoyut_single("Çok Küçük", "-2");
	allHtml += "</select></div>";
	return allHtml;
}
function createBoyut_single(oName, oValue)
{
	return StringFormat("<option value={0}>{1}</option>", oValue, oName);
}
unsafeWindow.BoyutDegis = function(boyutitem)
{
	//var edtrprp = document.getElementById("editorturu");
	totalbuyultme = boyutitem.value;
	SetEditorSize();
	SetCookie("editor_boyut", totalbuyultme.toString());
}
unsafeWindow.EditorBuyultKucult = function(buyult)
{
	if(buyult)
	{
		if(totalbuyultme >= editorboyut_max) return;
		totalbuyultme++;
	}
	else
	{
		if(totalbuyultme <= editorboyut_min) return;
		totalbuyultme--;
	}
	SetCookie("editor_boyut", totalbuyultme.toString());
	SetEditorSize();

}
function SetEditorSize()
{
	var enboyoran = originalheight / originalwidth;
	var newwidth = originalwidth + (originalwidth / 4 * totalbuyultme);
	var newheight = newwidth * enboyoran;
	modifiedwidth = newwidth;
	modifiedheight = newheight;
	SetEditorSizeWH(newwidth, newheight);
}
function SetEditorSizeWH(nwidth, nheight)
{
	activeCWEditor.theTextarea.style.width = nwidth + 2;
	activeCWEditor.theTextarea.style.height = nheight;
	activeCWEditor.mIframe.style.width = nwidth - 2;
	activeCWEditor.mIframe.style.height = nheight;
	document.querySelectorAll("[class=Toolbar]").forEach
	(
		function(helem)
		{
			helem.style.width = nwidth;
		}
	);
	var elmid = document.getElementById("editor_boyut");
	elmid.value = totalbuyultme;
	var cwe_prevmsg = document.getElementById("cwe_prevmsg");
	if(cwe_prevmsg != null)
	{
		cwe_prevmsg.style.height = "";
		cwe_prevmsg.style.height = cwe_prevmsg.parentElement.clientHeight.toString() + "px";
	}

}
unsafeWindow.Giris = function()
{
	if(GetDataValue(document.URL, "cwe_off") == "1") return;
	ArraylariKur();
	var Editor = document.getElementById("message");
	if(Editor == null)
	{
		Editor = document.querySelector("textarea[name=signature]");
		if(Editor != null)
		{
			Editor.id = "message";
			document.querySelectorAll("form td").forEach(function(item) {item.removeAttribute("width");});
			var tdelem = Editor.closest("tr");
			if(tdelem != null) tdelem.firstElementChild.width = "50%";
		}
	}
	if(Editor == null)
	{
		return;
	}
	else
	{
		if(Editor.type == "hidden")
		{
			return;
		}
	}
	setTimeout("EditorOlustur('message')", 100);
	//setTimeout("var unsafeWindow.activeCWEditor = new CWEditor('" + "message"+ "');SetProp();", 100);
	var rstbtn = document.getElementsByName("Reset")[0];
	oncekimesaj = GM_getValue("CWE_SonMesaj", "");
	oncekimesaj = oncekimesaj.trim();
	if(rstbtn != undefined && rstbtn != null)
	{
		rstbtn.setAttribute("type", "button");
		rstbtn.setAttribute("onclick", "ResetText(true);");
		addOtherButton(rstbtn);
		rstbtn.parentNode.id = "form_act_button";
	}
	else
	{
		var tempitem = document.getElementsByName("Submit2")[0];
		if(tempitem != null && tempitem != undefined)
		{
			addOtherButton(tempitem);
		}
	}

	var msgprnt = document.getElementsByName("selectMode")[0];
	if(msgprnt != undefined)
	{
		msgprnt = msgprnt.parentNode.parentNode.parentNode.parentNode.parentNode;
		if(msgprnt != undefined)
		{
			msgprnt.outerHTML = "";
		}
	}
	var previewbtn = document.getElementsByName("Preview")[0];
	if(previewbtn != undefined)
	{
		previewbtn.setAttribute("onclick", "SetValueCW();OpenPreviewWindow();");
	}
	var sbmtbtn = document.getElementsByName("Submit")[0];
	sbmtbtn.setAttribute("onclick", "posted_on_submit = true;SetValueCW();");
    is_portal_editor = false;
	//document.querySelectorAll("#dropcontent_msg a").forEach(function(item) { item.setAttribute();});

}
function addOtherButton(mparent)
{
	if(document.querySelector("textarea[name=signature]") != null)
	{
		return;
	}
	var prevmsgbtn = document.createElement("input");

	prevmsgbtn.setAttribute("type", "button");
	prevmsgbtn.setAttribute("id", "cwe_prevmsg");
	//prevmsgbtn.setAttribute("onclick", "DoPrevMsg();");
	prevmsgbtn.setAttribute("onclick", "ShowButtonDropDown(this);");
	prevmsgbtn.style.margin = "0px";
	prevmsgbtn.style.width = "100%";
	prevmsgbtn.style.height = "100%";
	prevmsgbtn.value = "Diğer";
	var divelem = document.createElement("div");
	divelem.appendChild(prevmsgbtn);
	divelem.setAttribute("class", "drop_div");
	divelem.innerHTML += '  <div class="dropdown-content" id="dropcontent_msg"></div>';
	mparent.parentNode.appendChild(divelem);
	checkDigerButton();
}
function checkDigerButton()
{
	var prevmsgbtn = document.getElementById("cwe_prevmsg");
	if(recreateOtherButton() > 0)
	{
		prevmsgbtn.disabled = false;
	}
	else
	{
		prevmsgbtn.disabled = true;
		resetOtherButton();
	}
}
function resetOtherButton()
{
	var delem = document.getElementById("dropcontent_msg");
	if(delem == null) return;
	if(delem.style.display == "block")
	{
		ShowButtonDropDown(document.getElementById("cwe_prevmsg"));
	}
}
function recreateOtherButton()
{
	var dropelem = document.getElementById("dropcontent_msg");
	if(dropelem == undefined || dropelem == null) return 0;
	dropelem.innerHTML = "";
	var htmlstring = "<ul>";
	var keyformat = '<li name={0} onclick="DropMenuAction(this);return false;">{1}</li>';
	var totaladded = 0;
    totaladded++;
    htmlstring += StringFormat(keyformat, "resim_yükle", "Resim Yükle");
	if(oncekimesaj != "")
	{
		totaladded+= 2;
		htmlstring += StringFormat(keyformat, "oncekimesaj_getir", "Önceki Mesajı Getir");
		htmlstring += StringFormat(keyformat, "oncekimesaj_sil", "Önceki Mesajı Sil");

	}

	dropelem.innerHTML = htmlstring + "</ul>";
	return totaladded;
}
unsafeWindow.DropMenuAction = function(sender)
{
	var sname = sender.getAttribute("name");
	if(sname == "oncekimesaj_getir")
	{
		DoPrevMsg();
	}
	else if(sname == "oncekimesaj_sil")
	{
		if(DoDeletePrevMsg())
		{
			checkDigerButton();
		}
	}
    else if(sname == "resim_yükle")
    {
        var input = document.createElement('input');
        input.accept = "image/*";
        input.type = 'file';

        input.onchange = e => {
            DoPostImage(e.target.files[0]);
        }
        input.click();
    }
	resetOtherButton();

}
unsafeWindow.onDropAllowEditor = function(e)
{
    e.preventDefault()
}
unsafeWindow.onDropEditor = function(e)
{
    e.preventDefault()
    var files = e.dataTransfer.files;
    if(files.length <= 0) return;
    DoPostImage(files[0]);

}
unsafeWindow.hideResimTR = function()
{
    window.parent.document.getElementById("resim_area").style.display = "none";
    return false;
}
function DoPostImage(imgFile)
{
       var ihtmlsubstr = StringFormat("   (<a href=# onclick=' return hideResimTR();'>Kapat</a>)");
       var rdiv = window.parent.document.getElementById("resim_area_div");
       var rtable = window.parent.document.getElementById("resim_area");
       rtable.style.display = "";
       rdiv.innerHTML = "Durum: Resim Yükleniyor...";
       rdiv.style.color = "orange";
       postImage(imgFile, function(r) {
           if(r.success)
           {
               rdiv.style.color = "green";
               rdiv.innerHTML = r.message + ihtmlsubstr;
           }
           else
           {
               rdiv.style.color = "red";
               rdiv.innerHTML = "Hata: " + r.message + ihtmlsubstr;
           }



       }
       );
}
function DoDeletePrevMsg()
{
	if(oncekimesaj == "") return false;
	if(!confirm("Bir önceki hafızaya alınan mesajı silmek istediğinizden eminmisiniz?(İşlemin geri dönüşü yoktur.)?"))
	{
		return false;
	}
	oncekimesaj = "";
	GM_deleteValue("CWE_SonMesaj", "");
	return true;
}
unsafeWindow.ShowButtonDropDown = function(sender)
{
	var delem = document.getElementById("dropcontent_msg");
	if(delem == undefined || delem == null) return;
    if(delem.style.display != "block")
    {
    	delem.style.display = "block";
        sender.style.backgroundColor = "#3bd21d";
        sender.style.fontWeight = "bold";
		sender.style.borderRadius = "0px";
    }
    else
    {
    	delem.style.display = "none";
        sender.style.backgroundColor = "";
        sender.style.fontWeight = "";
		sender.style.borderRadius = "";
    }
}
unsafeWindow.EditorOlustur = function(message)
{
	activeCWEditor =  new CWEditor(message);
	SetProp();
    document.body.onbeforeunload = function (e) {
        e = e || window.event;
        if(posted_on_submit) return undefined;
        if(is_portal_editor)
        {
            SetValueCWForm();
        }
        else
        {
            SetValueCW();
        }
        if(document.getElementById("message").value.trim().length <= 3)
        {
            return undefined;
        }
        if (e) {
            e.returnValue = 'Sure?';
        }
        // For Safari
        return 'Sure?';
    };
}
function GetInnerPmText()
{
	var pmhtml = GetMessageOnPm();
	if(pmhtml == null) return null;
	var mparser = new DOMParser();
	var PMxmlDoc = mparser.parseFromString(pmhtml,"text/html");
	/*
	var spnindex = pmhtml.indexOf('<span class="text">');
	if(spnindex < 0) return null;
	var endspanindex = pmhtml.indexOf("</span>", spnindex);
	if(endspanindex < 0) return null;
	var msgstr =  pmhtml.substring(spnindex + '<span class="text">'.length, endspanindex);*/
	var msgstr = GetHtmlElements(PMxmlDoc, "font", "class", "Mesaj")[0].innerHTML;
	return msgstr;
}
function GetMessageOnPm()
{
    var mThreadId;
	var PMid = mThreadId;
    mThreadId = GetDataValue(document.URL, "pm");
    PMid = mThreadId;
	if(PMid == null) return null;
	if(PMid == "") return null;
	return GetMessageOnPmBase(PMid);
}
function GetMessageOnPmBase(mPM)
{
	var defurl = StringFormat("https://www.cyber-warrior.org/Forum/pm_show_message.asp?ID={0}&Page=1&cwe_off=1", mPM);
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", defurl, false);
	xmlHttp.overrideMimeType('text/html; charset=iso-8859-9');
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function GetMessageDirect()
{
	var mUrl = document.URL;
	var mMode = GetDataValue(mUrl, "mode");
	var mThreadNo = GetDataValue(mUrl, "threadNo");
	if(mThreadNo == null)
	{
		if(mMode == "new" || mMode == null || mMode == "") return null;
	}
	else
	{
		mMode = "edit";
	}
	var mThreadId = null;
	if(mMode == "edit")
	{
		mThreadId = GetDataValue(mUrl, "messageID");
	}
	else
	{
		mThreadId = GetDataValue(mUrl, "threadID");
	}
	if(mThreadId == null || mThreadId == "") return null;
	var mFormId = GetDataValue(mUrl, "ForumID");
	if(mFormId == null || mFormId == "") return null;
	return GetMessage(mMode, mFormId, mThreadId);
}
function GetMessage(mode, formid, PostId)
{
	if(mode == "new") return null;
	var mUrl = "IE_textbox.asp?mode={0}&ForumID={1}&code=&MessageID={2}&postID={3}&ID=0";
	var mText = "";
	if(mode == "edit")
	{
		mText = "https://www.cyber-warrior.org/Forum/" + StringFormat(mUrl, mode, formid, PostId, 0);
	}
	else
	{
		mText = "https://www.cyber-warrior.org/Forum/" + StringFormat(mUrl, mode, formid, 0, PostId);
	}
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", mText + "&cwe_off=1", false);
	xmlHttp.overrideMimeType('text/html; charset=iso-8859-9');
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function GetOptionIndex(mArray, mValue)
{
	if(mArray == null) return -1;
	for(var i=0;i<mArray.length;i++)
	{
		if(mArray[i].value.toLowerCase().replace(" ", "") == mValue.toLowerCase())
		{
			return i;
		}
	}
	return -1;
}
function CWtoHtmlLite(CWstring)
{
	var nhtml = CWstring
	//nhtml = nhtml.replace(/^( +)|( +)$/gmi, "&nbsp;");
	nhtml = nhtml.replace(/\r/gi, "<br>");
	nhtml = nhtml.replace(/\n/gi, "<br>");
	nhtml = nhtml.replace(/\[AYET\](.*?)\[\/AYET\]/gi, AyetTablosuOlustur("$1"));
	return nhtml;
}
function CWtoHtml(CWstring)
{
	if(CWstring == undefined) return "";
	var nhtml = CWstring
	//nhtml = nhtml.replace(/^( +)|( +)$/gmi, "&nbsp;");
	nhtml = nhtml.replace(/\</gi, "&lt;");
	nhtml = nhtml.replace(/\>/gi, "&gt;");
	nhtml = nhtml.replace(/\r/gi, "<br>");
	nhtml = nhtml.replace(/\n/gi, "<br>");
	var CWSM = nhtml.match(/\[NOPARSE\](.*?)\[\/NOPARSE\]/gi);
	if(CWSM != null)
	{
		for(var i = 0; i < CWSM.length; i++)
		{
			nhtml = nhtml.replace(/\[NOPARSE\](.*?)\[\/NOPARSE\]/i, ":)CWNoparseArea_001100110011(:" + i.toString() + "_|");
		}
	}
	nhtml = nhtml.replace(/\[CENTER\]/gi, "<div align=center>");
	nhtml = nhtml.replace(/\[\/CENTER\]/gi, "</div>");
	nhtml = nhtml.replace(/\[B\]/gi, "<b>");
	nhtml = nhtml.replace(/\[\/B\]/gi, "</b>");
	nhtml = nhtml.replace(/\[P\]/gi, "<p>");
	nhtml = nhtml.replace(/\[\/P\]/gi, "</p>");
	nhtml = nhtml.replace(/\[INDENT\]/gi, "<blockquote>");
	nhtml = nhtml.replace(/\[\/INDENT\]/gi, "</blockquote>");
	nhtml = nhtml.replace(/\[HR\]/gi, "<hr>");
	nhtml = nhtml.replace(/\[BLOCKQUOTE\]/gi, "<blockquote>");
	nhtml = nhtml.replace(/\[\/BLOCKQUOTE\]/gi, "</blockquote>");
	nhtml = nhtml.replace(/\[I\]/gi, "<i>");
	nhtml = nhtml.replace(/\[\/I\]/gi, "</i>");
	nhtml = nhtml.replace(/\[LI\]/gi, "<li>");
	nhtml = nhtml.replace(/\[\/LI\]/gi, "</li>");
	nhtml = nhtml.replace(/\[U\]/gi, "<u>");
	nhtml = nhtml.replace(/\[\/U\]/gi, "</u>");
	nhtml = nhtml.replace(/\[\URL\=(.*?)\]/gi, "<a href=\"$1\">");
	var CWFSC = nhtml.match(/\[\SIZE\=([1-6])\]/gi);
	if(CWFSC != null)
	{
		for(i = 0; i < CWFSC.length; i++)
		{
			var mrslt = (/\[\SIZE\=([1-6])\]/gi.exec(CWFSC[i]));
			var ssnc = parseInt(mrslt[1]);
			nhtml = nhtml.replace(mrslt[0], "<font size=" + ssnc.toString() + ">");
		}
	}
	nhtml = nhtml.replace(/\[\LIST\=1\]/gi, "<ol start=1>");
	nhtml = nhtml.replace(/\[\LIST\]/gi, "<ul>");
	nhtml = nhtml.replace(/\[\/LIST\=1\]/gi, "</ol>");
	nhtml = nhtml.replace(/\[\/LIST\]/gi, "</ul>");
	nhtml = nhtml.replace(/\[\/URL\]/gi, "</a>");
	nhtml = nhtml.replace(/\[\EMAIL\=(.*?)\]/gi, "<a href=\"mailto:$1\">");
	nhtml = nhtml.replace(/\[\/EMAIL\]/gi, "</a>");
	nhtml = nhtml.replace(/\[IMG\]([^\[\x20]+)\[\/IMG\]/gi, "<img src=\"$1\">");
	nhtml = nhtml.replace(/\[\/FONT\]/gi, "</font>");


	var clrprp = document.getElementById("color");
	var fntprp = document.getElementById("font");
	for(i = 0; i < clrprp.options.length;i++)
	{
		nhtml = nhtml.replace(new RegExp("\\[" + clrprp.options[i].value + "]", "gmi"), "<font color=\"" + clrprp.options[i].value.replace(" ", "") +"\">" );
	}
	for(i = 0; i < fntprp.options.length;i++)
	{
		nhtml = nhtml.replace(new RegExp("\\[FONT\\=" + fntprp.options[i].value + "\]", "gi"), "<font face=\"" + fntprp.options[i].value +"\">" );
	}
	if(CWSM != null)
	{
		for(i = 0; i < CWSM.length; i++)
		{
			nhtml = nhtml.replace(":)CWNoparseArea_001100110011(:" + i.toString() + "_|", CWSM[i]);
		}
	}
	//nhtml = nhtml.replace(/\[\AYET\]/gi, "<ayet>");
	//nhtml = nhtml.replace(/\[\/AYET\]/gi, "</ayet>");
	nhtml = nhtml.replace(/\[AYET\](.*?)\[\/AYET\]/gi, AyetTablosuOlustur("$1"));
	return nhtml;
}
function HtmlToCW(iseditor, nHtmlMetin)
{
	var clrprp = document.getElementById("color");
	var fntprp = document.getElementById("font");
	var headprp = document.getElementById("head");
    var htmlMetin;
	if(nHtmlMetin == undefined)
	{
		htmlMetin = activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").cloneNode(true);
	}
	else
	{
		if(typeof nHtmlMetin == "string")
		{

			htmlMetin = document.createElement("div");
			htmlMetin.innerHTML = nHtmlMetin;
		}
		else
		{
			htmlMetin = nHtmlMetin.cloneNode(true);
		}
	}
	var mchildren = htmlMetin;
	htmlMetin.innerHTML = htmlMetin.innerHTML.replace(/(\r|\n)/gmi,"");
	var crntindex = 0;
	var firstdivindex = htmlMetin.innerHTML.indexOf("<div");
	while(mchildren != null)
	{
		crntindex++;
		var outher = mchildren.innerHTML;
		switch(mchildren.nodeName.toLowerCase())
		{
			case 'table':
				if(mchildren.getAttribute("cw_ozel_tag") == "AYET")
				{
					var delem = mchildren.querySelector("div[name=CWOZEL_icerik]");
					if(delem != null)
					{
						outher = "[Ayet]" +  delem.innerHTML + "[/Ayet]";
					}
					else
					{
						outher = "";
					}
				}
				break;
			case 'div':
				//if(mchildren.getAttribute("id") == "CWE_MesajKutusu")
				//{
					//break;
				//}
				var iscentered = false;
				if(mchildren.getAttribute("align") != null)
				{
					iscentered = mchildren.getAttribute("align").toLowerCase() == "center";
				}
				else
				{
					if(mchildren.getAttribute("style") != null)
					{
						iscentered = (mchildren.getAttribute("style").indexOf("text-align: center") > -1);
					}
				}
				var brindexof = outher.indexOf("<br");
				if(iscentered)
				{
					outher = "[CENTER]" + outher + "[/CENTER]";
				}
				if(firstdivindex >= 0 && !iscentered && brindexof == -1)
				{
					//outher = "\r" + outher;
					outher += "\r";
				}
				break;
			case 'hr':
				outher += "[HR]";
				break;
			case 'blockquote':
				outher = "[BLOCKQUOTE]" + outher + "[/BLOCKQUOTE]";
				break;
			case 'br':
				outher = "\r" + outher;
				break;
			case 'b':
			case 'strong':
				outher = "[B]" + outher + "[/B]";
				break;
			case 'u':
				outher = "[U]" + outher + "[/U]";
				break;
			case 'i':
				outher = "[I]" + outher + "[/I]";
				break;
			case 'a':
				if(mchildren.getAttribute("href") != null)
				{
					if(Str_StartWith(mchildren.getAttribute("href"), "mailto:"))
					{
						var mText = mchildren.getAttribute("href").substring(7);
						outher = "[EMAIL=" + mText + "]" + outher + "[/EMAIL]";
					}
					else
					{
						outher = "[URL=" + mchildren.getAttribute("href") + "]" + outher + "[/URL]";
					}
				}
				break;
			case 'img':
				if(mchildren.getAttribute("src") != null)
				{
					outher = "[IMG]" + mchildren.getAttribute("src") + "[/IMG]";
				}
				break;
			case 'ul':
				outher = "[LIST]" + outher + "[/LIST]";
				break;
			case 'ol':
				outher = "[LIST=1]" + outher + "[/LIST=1]";
				break;
			case 'li':
				outher = "[LI]" + outher + "[/LI]";
				break;
			case 'p':
				outher = "[P]" + outher + "[/P]";
				break;
			case 'font':
				var added = 0;
				var findex = -1;
				var outerh = "";
				if(mchildren.getAttribute("face") != null)
				{
					findex = GetOptionIndex(fntprp.options, mchildren.getAttribute("face"));
					if(findex >= 2)
					{
						outerh += "[FONT=" + mchildren.getAttribute("face") + "]";
						added++;
					}
				}
				if(mchildren.getAttribute("color") != null)
				{
					findex = GetOptionIndex(clrprp.options, mchildren.getAttribute("color"));
					if(findex == -1)
					{
						findex = ColorIndex.indexOf(mchildren.getAttribute("color"));
						findex += 1;
					}
					if(findex >= 0)
					{
						outerh += "[" + clrprp.options[findex].value + "]";
						added++;
					}
				}
				if(mchildren.getAttribute("size") != null)
				{
					findex = GetOptionIndex(headprp.options, mchildren.getAttribute("size"));
					if(findex >= 2)
					{
						outerh += "[SIZE=" + (findex - 1).toString() + "]";
						added++;
					}
				}
				outher = outerh + outher;
				for(var i = 0; i < added; i++)
				{
					outher += "[/FONT]";
				}
				break;
		}
		if(mchildren.parentNode != null)
		{
			mchildren.outerHTML = outher;
		}
		mchildren = htmlMetin.children[0];
	}
	var nhtml = "";

	nhtml = htmlMetin.textContent;
	if(htmlMetin.children.length > 0)
	{
		nhtml = nhtml.replace(/\&nbsp;/g, " ");
	}
	else
	{
		nhtml = nhtml.replace(/\&nbsp;/g, " ");
	}

	nhtml = nhtml.replace(/\&lt;/gi, "<");
	nhtml = nhtml.replace(/\&gt;/gi, ">");
	return nhtml;
}
function ArraylariKur()
{
	ColorIndex.push("#000000", "#ffffff", "#0000ff", "#ff0000", "#008000", "#ffff00", "#ffa500", "#a52a2a", "#ff00ff", "#00ffff", "#32cd32");
	AddItem("bold", "b", "strong");
	AddItem("italic", "i");
	AddItem("underline", "u");
	AddItem("list", "ol", "ul");
	AddItem("center", "center");
	AddItem("indent", "blockquote");
	AddItem("hyperlink", "_");
	AddItem("email", "_");
	AddItem("smiley", "_");
	AddItem("ayet", "_");
}
function AddItem()
{
	if(arguments.length <= 1) return false;
	var args = Array.prototype.slice.call(arguments);
	toolitems.push(args);
	return true;
}
function YeniEditor()
{
	activeCWEditor.YeniEditor = true;
	activeCWEditor.editorDivItem.replaceChild(activeCWEditor.mIframe, activeCWEditor.theTextarea);
	activeCWEditor.writeDocument(activeCWEditor.theInput.value);
	activeCWEditor.initEdit();
	activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtml(activeCWEditor.theTextarea.value);
}
function EskiEditor()
{
	RefreshToolItem();
	activeCWEditor.YeniEditor = false;
	activeCWEditor.theTextarea.value = HtmlToCW(false);
	activeCWEditor.theTextarea.style.width = modifiedwidth + 2;
	activeCWEditor.theTextarea.style.height = modifiedheight;
	activeCWEditor.editorDivItem.replaceChild(activeCWEditor.theTextarea, activeCWEditor.mIframe);
}
unsafeWindow.EditorDegis = function()
{
	var edtrprp = document.getElementById("editorturu");
	if(edtrprp.value == "1")
	{
		DeleteCookie("editor_klasik");
		YeniEditor();
		setCaretAsLast();
	}
	else
	{
		SetCookie("editor_klasik", "1");
		EskiEditor();
	}
	FocusEditor();
}
function setCaretAsLast()
{
	//var textNode = activeCWEditor.mIframe.contentWindow.document.body.lastChild;
	//if(textNode == null || textNode == undefined)
	//{
		//return;
	//}
    var vrange = document.createRange();
    vrange.selectNode(activeCWEditor.mIframe.contentWindow.document.getElementById("icerik"));
    vrange.selectNodeContents(activeCWEditor.mIframe.contentWindow.document.getElementById("icerik"));
    const selection = activeCWEditor.mIframe.contentWindow.getSelection();
    selection.removeAllRanges();
    selection.addRange(vrange);
	//activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").execCommand('selectAll', false, "");
	//var carpos = textNode.textContent.length;
	var sel = activeCWEditor.mIframe.contentWindow.getSelection();
	//var range = activeCWEditor.mIframe.contentWindow.document.createRange();
	//range.setStart(textNode, carpos);
	//range.setEnd(textNode, carpos);
	//range.collapse(true);
	sel.collapseToEnd();
	//sel.removeAllRanges();
	//sel.addRange(range);
}
function TextAreaSelText()
{
	var SelStart = activeCWEditor.theTextarea.selectionStart;
	var SelEnd = activeCWEditor.theTextarea.selectionEnd;
	return activeCWEditor.theTextarea.value.substring(SelStart, SelEnd);
}
function TextAreaReplace(NewText)
{
	var SelStart = activeCWEditor.theTextarea.selectionStart;
	var SelEnd = activeCWEditor.theTextarea.selectionEnd;
	activeCWEditor.theTextarea.value = activeCWEditor.theTextarea.value.substring(0,SelStart) + NewText + activeCWEditor.theTextarea.value.substring(SelEnd, activeCWEditor.theTextarea.length);
	activeCWEditor.theTextarea.selectionStart = SelStart + NewText.length;
	activeCWEditor.theTextarea.selectionEnd = SelStart + NewText.length;
	}
unsafeWindow.OnClickElemnt = function(ename)
{
	var SOn;
	var theIframe = activeCWEditor.mIframe;
	var theSelection;
	var SeciliAlan;
	var SeciliText;
	var SeciliHtml;
	var messageshowed = false;
	if(activeCWEditor.YeniEditor)
	{

		theSelection = theIframe.contentWindow.getSelection();
		if(theSelection.rangeCount <= 0)
		{
			FocusEditorBody();
		}
		SeciliAlan = theSelection.getRangeAt(0);
		SeciliText = theSelection.toString();
		SeciliHtml = SelectionHtml(activeCWEditor);
	}
	else
	{
		SeciliAlan = null;
		SeciliText = TextAreaSelText();
		SeciliHtml = SeciliText;
	}

	var bbeditorxofs = 0;
	switch(ename)
	{
		case 'smiley':
			if(document.getElementById("toolbar_smileys").style.display != "none")
			{
				document.getElementById("toolbar_smileys").style.display = "none";
				DeSelectTool("smiley");
				DeleteCookie("editor_showsmiley")

			}
			else
			{
				document.getElementById("toolbar_smileys").style.display = "inline";
				SelectTool("smiley");
				SetCookie("editor_showsmiley", 1);
			}
			break;
		case 'email':
			messageshowed = true;
			if(activeCWEditor.YeniEditor)
			{
				var SeciliYok = false;
				var GYazi = "";
				SOn = getTagOnSelection(activeCWEditor, "a");
				if(SeciliText == "" && SOn == null)
				{
					//var GYazi = prompt("Lütfen linkin yazısını girin", "");
					SeciliYok = true;
				}
				if(!SeciliYok && SOn != null)
				{
					var atext = SOn.getAttribute("href");
					if(!Str_StartWith(atext, "mailto:"))
					{
						OnClickElemnt('hyperlink');
						return;
					}
				}
				var mDefault = "mailto:";
				if(SOn != null)
				{
					mDefault = SOn.getAttribute("href");
				}
				var tempCWEBild = SOn
				if(tempCWEBild == null)
				{
					tempCWEBild = document.createElement("a");
					tempCWEBild.setAttribute("href", mDefault);
					tempCWEBild.innerHTML = SeciliHtml;
				}
				MesajGoster("E-Posta Düzenle", "Lütfen geçerli bir değer girin.", tempCWEBild, 2, cwe_islemyap_editor, true);
			}
			else
			{
				tempCWEBild =  document.createElement("a");
				tempCWEBild.setAttribute("href", "mailto:");
				tempCWEBild.innerHTML = SeciliText;
				MesajGoster("E-Posta", "Lütfen geçerli bir değer girin.", tempCWEBild, 2, cwe_islemyap_editor);
			}
			break;
		case 'font':
			var tvalue = document.getElementById("font");
			if(activeCWEditor.YeniEditor)
			{
				theIframe.contentWindow.document.execCommand('fontName', false, tvalue.value);
			}
			else
			{
				if(tvalue.value == "") break;
				TextAreaReplace("[FONT=" + tvalue.value + "]" + SeciliText + "[/FONT]");
				bbeditorxofs = "[/FONT]".length;
			}

			break;
		case 'color':
			tvalue = document.getElementById("color");
			if(activeCWEditor.YeniEditor)
			{
				theIframe.contentWindow.document.execCommand('foreColor', false, tvalue.value.replace(" ", ""));
			}
			else
			{
				if(tvalue.value == "") break;
				TextAreaReplace("[" + tvalue.value + "]" + SeciliText + "[/FONT]");
				bbeditorxofs = "[/FONT]".length;
			}

			break;
		case 'list':
			messageshowed = true;
			if(activeCWEditor.YeniEditor)
			{
				if(!isSelected(ename))
				{
					MesajGoster("Liste Ekle", "Lütfen geçerli bir değer girin.", undefined, 4, cwe_islemyap_editor, true);
				}
				else
				{
					SOn = getTagOnSelection(activeCWEditor, "ol");
					if(SOn != null)
					{
						theIframe.contentWindow.document.execCommand('insertOrderedList', false, "");
					}
					if(SOn == null)
					{
						SOn = getTagOnSelection(activeCWEditor, "ul");
						if(SOn != null)
						{
							theIframe.contentWindow.document.execCommand('insertUnOrderedList', false, "");
						}
					}
					if(isSelected(ename))
					{
						DeSelectTool(ename);
					}
					else
					{
						SelectTool(ename);
					}
				}
			}
			else
			{
				MesajGoster("Liste Ekle", "Lütfen geçerli bir değer girin.", undefined, 5, cwe_islemyap_editor, true);
			}
			break;
		case 'outdent':
			if(!activeCWEditor.YeniEditor) break;
			SOn = getTagOnSelection(activeCWEditor, "blockquote");
			if(SOn != null)
			{
				SOn.outerHTML = SOn.innerHTML;
				SOn = getTagOnSelection(activeCWEditor, "blockquote");
				if(SOn == null)
				{
					DeSelectTool("indent");
				}
			}
			break;
		case 'indent':
			if(activeCWEditor.YeniEditor)
			{
				theIframe.contentWindow.document.execCommand('indent', false, "");
				SelectTool(ename);
			}
			else
			{
				TextAreaReplace("[BLOCKQUOTE]" + SeciliText + "[/BLOCKQUOTE]");
				bbeditorxofs = "[/BLOCKQUOTE]".length;
			}
			break;
		case 'center':
			if(activeCWEditor.YeniEditor)
			{
				var iscentered = false;
				SOn = getTagOnSelection(activeCWEditor, "div");
				if(SOn != null)
				{
					if(SOn.getAttribute("align") != null)
					{
						iscentered = SOn.getAttribute("align").toLowerCase() == "center";
					}
					else
					{
						if(SOn.getAttribute("style") != null)
						{
							iscentered = (SOn.getAttribute("style").indexOf("text-align: center") > -1);
						}
					}
				}
				if(iscentered)
				{
					theIframe.contentWindow.document.execCommand('justifyLeft', false, theIframe.value);
					DeSelectTool(ename);
				}
				else
				{
					theIframe.contentWindow.document.execCommand('justifyCenter', false, theIframe.value);
					SelectTool(ename);
				}
			}
			else
			{
				TextAreaReplace("[CENTER]" + SeciliText + "[/CENTER]");
				bbeditorxofs = "[/CENTER]".length;
			}
			break;
		case 'head':
			tvalue = document.getElementById("head");
			if(activeCWEditor.YeniEditor)
			{
				SOn = getTagOnSelection(activeCWEditor, "font");
				if(SOn != null && tvalue.value == "")
				{

					if(SOn.getAttribute("size") != null)
					{
						if(SOn.attributes.length == 1)
						{
							SOn.outerHTML = SOn.innerHTML;
						}
						else
						{
							SOn.removeAttribute("size");
						}

					}
				}
				else
				{
					theIframe.contentWindow.document.execCommand('fontSize', false, tvalue.value);
				}
			}
			else
			{
				if(tvalue.value == "") break;
				TextAreaReplace("[SIZE=" + tvalue.value + "]" + SeciliText + "[/FONT]");
				bbeditorxofs = "[/FONT]".length;
			}
			break;
		case 'image':
			messageshowed = true;
			tempCWEBild = document.createElement("img");
			if(!activeCWEditor.YeniEditor)
			{
				tempCWEBild.setAttribute("src", SeciliText);
			}
			MesajGoster("Resim Ekle", "Lütfen geçerli bir değer girin.", tempCWEBild, 3, cwe_islemyap_editor, true);
			break;
		case 'bold':
		case 'italic':
		case 'underline':
			var mindex = getTIndex(ename);
			if(activeCWEditor.YeniEditor)
			{
				theIframe.contentWindow.document.execCommand(ename, false, "");
				if(!isSelected(ename))
				{
					SelectTool(ename);
				}
				else
				{
					DeSelectTool(ename);
				}
			}
			else
			{
				if(mindex < 0) break;
				TextAreaReplace("[" + toolitems[mindex][1] + "]" + SeciliText + "[/" + toolitems[mindex][1] +"]");
				bbeditorxofs = ("[/" + toolitems[mindex][1] +"]").length;
			}
			break;
		case 'hyperlink':
			messageshowed = true;
			if(activeCWEditor.YeniEditor)
			{
				SeciliYok = false;
				GYazi = "";
				SOn = getTagOnSelection(activeCWEditor, "a");
				if(SeciliText == "" && SOn == null)
				{
					//var GYazi = prompt("Lütfen linkin yazısını girin", "");
					SeciliYok = true;
				}
				if(!SeciliYok && SOn != null)
				{
					var atext = SOn.getAttribute("href");
					if(Str_StartWith(atext, "mailto:"))
					{
						OnClickElemnt('email');
						return;
					}
				}
				mDefault = "http://";
				if(SOn != null)
				{
					mDefault = SOn.getAttribute("href");
				}
				tempCWEBild = SOn
				if(tempCWEBild == null)
				{
					tempCWEBild = document.createElement("a");
					tempCWEBild.setAttribute("href", mDefault);
					tempCWEBild.innerHTML = SeciliHtml;
				}
				MesajGoster("Linki Düzenle", "Lütfen geçerli bir değer girin.", tempCWEBild, 1, cwe_islemyap_editor, true);
			}
			else
			{
				tempCWEBild = document.createElement("a");
				tempCWEBild.setAttribute("href", "http://");
				tempCWEBild.innerHTML = SeciliText;
				MesajGoster("Linki Düzenle", "Lütfen geçerli bir değer girin.", tempCWEBild, 1, cwe_islemyap_editor);
			}
			break;
		case 'ayet':
			messageshowed = true;
			tempCWEBild = document.createElement("span");
			var mishtml = true;
			if(activeCWEditor.YeniEditor)
			{
				SOn = getTagOnSelection(activeCWEditor, "table");
				if(SOn != null && SOn.getAttribute("cw_ozel_tag") == "AYET")
				{
					SeciliHtml = SOn.querySelector("div[name=CWOZEL_icerik]").innerHTML;
				}
				tempCWEBild.innerHTML = SeciliHtml;
			}
			else
			{
				tempCWEBild.innerHTML = SeciliText;
				mishtml = false;
			}
			MesajGoster("Ayet Ekle", "Lütfen geçerli bir değer girin.", tempCWEBild, 6, cwe_islemyap_editor, mishtml);
			break;
		case 'ytvideo':
			messageshowed = true;
			tempCWEBild = document.createElement("span");
			if(activeCWEditor.YeniEditor)
			{
				tempCWEBild.innerHTML = SeciliHtml;
			}
			else
			{
				tempCWEBild.innerHTML = SeciliText;
			}
			MesajGoster("Video Ekle", "Lütfen geçerli bir değer girin.", tempCWEBild, 7, cwe_islemyap_editor, false);
			break;
	}
	if(!messageshowed)
	{
		if(!activeCWEditor.YeniEditor)
		{
			if(bbeditorxofs > 0)
			{
				activeCWEditor.theTextarea.selectionStart -= bbeditorxofs;
				activeCWEditor.theTextarea.selectionEnd = activeCWEditor.theTextarea.selectionStart ;
			}
		}
		FocusEditor();
	}
}
function cwe_islemyap_editor()
{
}
unsafeWindow.cwe_islemyap_editor =  function(cwe_etype, cwe_userdata)
{
	document.getElementById('CWE_MesajKutusu').style.display = "none";
	var SOn;
	var theIframe = activeCWEditor.mIframe;
	var theSelection;
	var SeciliHtml;
	var SeciliAlan;
	var SeciliText;
	var FirsTagParent;
	if(activeCWEditor.YeniEditor)
	{

		theSelection = theIframe.contentWindow.getSelection();
		if (theSelection.rangeCount <= 0)
		{
			FocusEditorBody();
		}
		SeciliAlan = theSelection.getRangeAt(0);
		SeciliText = theSelection.toString();
		SeciliHtml = SelectionHtml(activeCWEditor);
		FirsTagParent = getTagOnSelectionPar(activeCWEditor, -1);
	}
	else
	{
		SeciliAlan = null;
		SeciliText = TextAreaSelText();
		SeciliHtml = SeciliText;
	}
	var SeciliAlanParent = null;
	var SelectionHtmlText = "";
	var bbeditorxofs = 0;
	switch(cwe_etype)
	{
		case 1: //hyperlink
		case 2: //email
			var cwemb_href = document.getElementById("cwe_linka").value;
			var cwemb_inner = document.getElementById("cwe_linkb").value;
			if(activeCWEditor.YeniEditor)
			{
				var SeciliYok = false;
				var GYazi = cwemb_inner;
				SOn = getTagOnSelection(activeCWEditor, "a");
				if(SeciliText == "" && SOn == null)
				{
					GYazi = cwemb_inner;
					SeciliYok = true;
				}
				var UrlSor = cwemb_href;
				if (UrlSor != null)
				{
					if(SOn != null)
					{
						if(UrlSor == "")
						{
							SOn.outerHTML = SOn.innerHTML;
							DeSelectTool("hyperlink");
						}
						else
						{
							if(cwe_etype == 1)
							{
								SOn.setAttribute("href", UrlSor);
							}
							else
							{
								SOn.setAttribute("href", "mailto:" + UrlSor);
							}
							SOn.innerHTML = CWtoHtml(cwemb_inner);
						}
					}
					else
					{
						if(cwemb_inner == "") break;
						if(SeciliYok)
						{
							if(GYazi == "") GYazi = UrlSor;
							var urlnode = document.createElement("a");
							if(cwe_etype == 1)
							{
								urlnode.setAttribute("href", UrlSor);
							}
							else
							{
								urlnode.setAttribute("href", "mailto:" + UrlSor);
							}
							urlnode.innerHTML = CWtoHtml(GYazi) ;
							SeciliAlan.insertNode(urlnode);
						}
						else
						{
							if(FirsTagParent != null)
							{
								theIframe.contentWindow.document.execCommand('delete', false);
							}
							if(cwe_etype == 1)
							{
								theIframe.contentWindow.document.execCommand('insertHTML', false, '<a href="' + cwemb_href + '">' + CWtoHtml(cwemb_inner) + '</a>');
							}
							else
							{
								theIframe.contentWindow.document.execCommand('insertHTML', false, '<a href="mailto:' + cwemb_href + '">' + CWtoHtml(cwemb_inner) + '</a>');
							}
						}
						if(cwe_etype == 1)
						{
							SelectTool("hyperlink");
						}
						else
						{
							SelectTool("email");
						}
					}
				}
				else
				{
					if(SOn != null)
					{
						SOn.outerHTML = SOn.innerHTML;
						if(cwe_etype == 1)
						{
							DeSelectTool("hyperlink");
						}
						else
						{
							DeSelectTool("email");
						}

					}
				}
			}
			else
			{
				var UrlAd = cwemb_inner;
				if(SeciliText == "")
				{
					UrlAd = cwemb_inner;
					if(UrlAd == null) UrlAd = "";
				}
				var UrlLink = cwemb_href;
				if(UrlLink == null) break;
				if(UrlLink == "") break;
				if(UrlAd == "") UrlAd = UrlLink;
				if(cwe_etype == 1)
				{
					SelectTool("hyperlink");
				}
				else
				{
					SelectTool("email");
				}
				if(cwe_etype == 1)
				{
					TextAreaReplace("[URL=" + UrlLink + "]" + UrlAd + "[/URL]");
				}
				else
				{
					TextAreaReplace("[EMAIL=" + UrlLink + "]" + UrlAd + "[/URL]");
				}
				bbeditorxofs = "[/URL]".length;

			}
			break;
		case 3: //resim
			var cwemb_src = document.getElementById("cwe_linkresim").value;
			if(activeCWEditor.YeniEditor)
			{
				if(cwemb_src != null && cwemb_src != "")
				{
					var imgnode = document.createElement("img");
					imgnode.setAttribute("src", cwemb_src);
					//imgnode.setAttribute("contenteditable", false);
					//SeciliAlan.insertNode(imgnode);
					theIframe.contentWindow.document.execCommand('insertHTML', false, imgnode.outerHTML);
				}
			}
			else
			{
				if(cwemb_src == "") break;
				TextAreaReplace("[IMG]" + cwemb_src + "[/IMG]");
				bbeditorxofs = "[/IMG]".length;
			}

			break;
		case 4: //list yeni editör
			if(activeCWEditor.YeniEditor)
			{
				var mListType = document.getElementById("cwe_lists").value;
				if(mListType == "0")
				{
					theIframe.contentWindow.document.execCommand('insertOrderedList', false, "");
				}
				else
				{
					theIframe.contentWindow.document.execCommand('insertUnOrderedList', false, "");
				}
				SelectTool('list');
			}
			break;
		case 5: //list eski editör
			if(!activeCWEditor.YeniEditor)
			{
                mListType = document.getElementById("cwe_lists").value;
                var inputitems = GetHtmlElements(document, "input", "name", "cwe_listitem");
				if(inputitems.length <= 0) break;
				var TMesaj = "";
				for(var bca = 0; bca < inputitems.length;bca++)
				{
					TMesaj += "[LI]" + inputitems[bca].value + "[/LI]";
				}
				if(TMesaj != null && TMesaj != "")
				{
					if(mListType == "0")
					{
						TextAreaReplace("[LIST=1]" + TMesaj + "[/LIST=1]");
					}
					else
					{
						TextAreaReplace("[LIST]" + TMesaj + "[/LIST]");
					}
				}
			}
            break;
		case 6: //ayet
			var mTextAreacwe = document.getElementById("cwe_ayet").value;
			if(mTextAreacwe == "") break;
			if(activeCWEditor.YeniEditor)
			{
				SOn = getTagOnSelection(activeCWEditor, "table");
				if(SOn != null && SOn.getAttribute("cw_ozel_tag") == "AYET")
				{
					var qselector = SOn.querySelector("div[name=CWOZEL_icerik]");
					qselector.innerHTML = CWtoHtml(mTextAreacwe);
				}
				else
				{
					//theIframe.contentWindow.document.execCommand('insertText', false, "[Ayet]" + mTextAreacwe + "[/Ayet]");
					theIframe.contentWindow.document.execCommand('insertHTML', false, AyetTablosuOlustur(mTextAreacwe));
				}

			}
			else
			{

				TextAreaReplace("[Ayet]" + mTextAreacwe + "[/Ayet]");
				bbeditorxofs = "[/Ayet]".length;
			}

			break;
		case 7: //ytvide
			mTextAreacwe = document.getElementById("cwe_youtube").value;
			if(GetDataValue(mTextAreacwe, "v") != null)
			{
				mTextAreacwe = GetDataValue(mTextAreacwe, "v");
			}
			if(mTextAreacwe == "") break;
			if(activeCWEditor.YeniEditor)
			{
				theIframe.contentWindow.document.execCommand('insertText', false, "[Youtube=" + mTextAreacwe + "]");
			}
			else
			{

				TextAreaReplace("[Youtube=" + mTextAreacwe + "]");
			}
			bbeditorxofs = 1;
			break;
	}
	document.getElementById('CWE_MesajKutusu').innerHTML = "";
	if(activeCWEditor.YeniEditor)
	{
		if(bbeditorxofs > 0)
		{
			var iparent = getTagOnSelectionPar(activeCWEditor, 0, false);
			if(iparent == null) return;
			var carpos = iparent.textContent.length;
			var range = activeCWEditor.mIframe.contentWindow.document.createRange();
			var sel = activeCWEditor.mIframe.contentWindow.getSelection();
			var newcarpos = carpos;
			if(sel.rangeCount > 0)
			{
				var exrange = sel.getRangeAt(0);
				newcarpos = exrange.startOffset;
			}
			newcarpos -= bbeditorxofs;
			if(newcarpos < 0) return;
			range.setStart(iparent, newcarpos);
			range.setEnd(iparent, newcarpos);
			sel.removeAllRanges();
			sel.addRange(range);
		}

	}
	else
	{
		if(bbeditorxofs > 0)
		{
			activeCWEditor.theTextarea.selectionStart -= bbeditorxofs;
			activeCWEditor.theTextarea.selectionEnd = activeCWEditor.theTextarea.selectionStart ;
		}
	}
	FocusEditor();
}
function KaldirilabilirItemOlustur(tableprop, InnerHtml, InnerStyle, InnerBefore, bgcolor)
{
	var restring = StringFormat('<table class="ozeltag" cw_ozel_tag="{0}" contenteditable=false width="100%" cellspacing="0" cellpadding="3"><tr><td width="85%"></td><td class="ozeltag_kapat" height="20" contenteditable="false" bgcolor="white" align="center" onclick="var tableelem = this.closest(&quot;table&quot;);if(tableelem == null) return;tableelem.parentNode.removeChild(tableelem);return false;">Kaldır</td></tr>', tableprop);
	restring += StringFormat('<tr><td class="td_context" colspan=2 onclick="var divitem = this.querySelector(&quot;div[name=CWOZEL_icerik]&quot;);if(divitem == null || divitem == undefined) return;divitem.focus();" height="40" bgcolor="{0}">{1}<div name="CWOZEL_icerik" style="width: 100%;display: block;{2}" contenteditable="true">{3}</div></td></tr></table>', bgcolor, InnerBefore, InnerStyle, InnerHtml);
	return restring;
}
function AyetTablosuOlustur(AYET)
{
	//"color:#525252; font-size:16px; font-family:Georgia, Arial"
	var restring = KaldirilabilirItemOlustur("AYET", AYET, "color:#525252; font-size:16px; font-family:Georgia, Arial",  '<div style="float:left;"><img src="https://www.cyber-warrior.org/Forum/forum_images/ayet.png" org_width="20" org_height="20" width="20" height="20" align="absmiddle"></div>', "#95bd00");
	return restring;
}
unsafeWindow.DeleteAYETtable = function(sender)
{
	var tableelem = sender.closest("table");if(tableelem == null) return;tableelem.parentNode.removeChild(tableelem);
}
unsafeWindow.FocusAYETdiv = function(divitem)
{
	if(divitem == null || divitem == undefined) return;divitem.focus();
}
unsafeWindow.SetProp = function()
{
	SetColor();
	SetFont();
	if(GetCookie("editor_showsmiley") == "1")
	{
		document.getElementById("toolbar_smileys").style.display = "inline";
		document.getElementById("smiley").className = "selected";
	}
	var eboyut = GetCookie("editor_boyut");
	if(eboyut != null && eboyut != "" && !isNaN(eboyut))
	{
		totalbuyultme = parseInt(eboyut);
		if(totalbuyultme < editorboyut_min) totalbuyultme = editorboyut_min;
		if(totalbuyultme > editorboyut_max) totalbuyultme = editorboyut_max;
		SetEditorSize();
	}
	else
	{
		totalbuyultme = 0;
		SetEditorSize();

	}
	var mPage = GetPage();
	if(mPage == null) mPage = "";
	mPage = mPage.toLowerCase();
	if(mPage != "form.asp")
	{
		if(GetCookie("editor_klasik") == "1")
		{
			var edtrprp = document.getElementById("editorturu");
			edtrprp.selectedIndex = 1;
			EditorDegis();
		}
	}
	else
	{
		edtrprp = document.getElementById("editorturu");
		edtrprp.disabled = "disabled";
		edtrprp.setAttribute("onchange", "");
		document.getElementById("code_form").style.visibility = "hidden";
	}

}
function SetColor()
{
	var clropt = document.getElementById("color");
	for(var i = 0; i < clropt.options.length;i++)
	{
		clropt.options[i].style.color = clropt.options[i].value.replace(" ", "");
		clropt.options[i].style.backgroundColor = "lightgray";
	}
}
function SetSize()
{
	var sizeprp = document.getElementById("head");
	for(var i = 0; i < sizeprp.options.length;i++)
	{
		sizeprp.options[i].style.fontSize = parseInt(sizeprp.options[i].value);
	}
}
function SetFont()
{
	var fntprp = document.getElementById("font");
	for(var i = 0; i < fntprp.options.length;i++)
	{
		fntprp.options[i].style.fontFamily = fntprp.options[i].value;
	}
}

function GetContent(ResponseHtml)
{
	var bodyindex = ResponseHtml.indexOf("<body");
	if(bodyindex < 0) return null;
	var qtindex = ResponseHtml.indexOf(">", bodyindex) + 1;
	if(qtindex < 0) return null;
	var endbodyindex = ResponseHtml.indexOf("</body>", qtindex);
	if(endbodyindex < 0) return null;
	return ResponseHtml.substring(qtindex, endbodyindex);
}
function StartSmiley()
{
	return 	'<tbody id=smileys><table id=smileystable style="display: none">';
}
unsafeWindow.AddSmileyIcon = function(smileyname)
{
	var theIframe = activeCWEditor.mIframe;

	if(activeCWEditor.YeniEditor)
	{
		var theSelection = theIframe.contentWindow.getSelection();
		if(theSelection.rangeCount <= 0)
		{
			FocusEditorBody();
		}
		//var SeciliAlan = theSelection.getRangeAt(0);
		var SeciliText = theSelection.toString();
		//var SeciliHtml = SelectionHtml(activeCWEditor);
		var imgnode = document.createElement("img");
		imgnode.setAttribute("src", smileyname);
		theIframe.contentWindow.document.execCommand('insertHTML', false, imgnode.outerHTML);
		//SeciliAlan.insertNode(imgnode);
	}
	else
	{
		SeciliText = TextAreaSelText();
		TextAreaReplace("[IMG]" + smileyname + "[/IMG]")
	}
	FocusEditor();
}
function AddSmiley(prthtml, smileyloc, mw = 0, mh = 0)
{
	var ntxt = "";
	//if(addedscount % 15 == 0)
	//{
		//ntxt = "<tr>";
	//}
	//ntxt += '<td width="48"><a href="javascript:AddSmileyIcon(\'https://www.cyber-warrior.org/Forum/{0}\')"><img src="https://www.cyber-warrior.org/Forum/{0}" width={1} height={2} style="cursor: hand;"></a></td>';
	var iwidth = "";
	var iheight = "";
	if(mw > 0)
	{
		iwidth = StringFormat(" width={0} ", mw);
	}
	if(mh > 0)
	{
		iheight = StringFormat(" height={0} ", mh);
	}
	ntxt = '<div><a href="javascript:AddSmileyIcon(\'https://www.cyber-warrior.org/Forum/{0}\')"><img src="https://www.cyber-warrior.org/Forum/{0}"{1}{2}align=middle></a></div>';
	addedscount++;
	prthtml += StringFormat(ntxt, smileyloc, iwidth, iheight);
	return prthtml
}
function FinishSmiley(prthtml)
{
	//prthtml += '</table></tbody>'
	return prthtml;
}
CWEditor.prototype.writeDocument = function(documentContent)
{
	var Sablon = '\
		<html>\
			<meta http-equiv="content-type" content="text/html; charset=windows-1254">\
			<meta http-equiv=content-type content=text/html;charset=iso-8859-9>\
			<meta http-equiv="content-language" content="TR">\
			<head>\
				<style>INSERT:STYLESHEET:END</style>\
			</head>\
			<body id=icerik_body ondrop="window.parent.onDropEditor(event)" ondragover="window.parent.onDropAllowEditor(event)" >\
                <div id=icerik spellcheck="false" style="word-wrap: break-word;">\
				INSERT:CONTENT:END\
                </div>\
			</body>\
		</html>\
	';
	if (typeof document.all != "undefined")
	{
		Sablon = Sablon.replace(/INSERT:STYLESHEET:END/, '<link rel="stylesheet" type="text/css" href="' + "" + '"></link>');
	}
	else
	{
		Sablon = Sablon.replace(/INSERT:STYLESHEET:END/, document_css);
	}
	Sablon = Sablon.replace(/INSERT:CONTENT:END/, documentContent);
	Sablon = Sablon.replace(/INSERT:CONTENT:HEADER/, "");
	this.mIframe.contentWindow.document.open();
	this.mIframe.contentWindow.document.write(Sablon);
	this.mIframe.contentWindow.document.close();
	return true;
}
CWEditor.prototype.initEdit = function()
{
	var self = this;
	try
	{
		this.mIframe.contentWindow.document.designMode = "off";
        var icerik = this.mIframe.contentWindow.document.getElementById("icerik");
		icerik.setAttribute("contenteditable", "true");
        icerik.style.width = "100%";
        icerik.style.height = "100%";
	}
	catch (e)
	{
		setTimeout(function(){self.initEdit()}, 150);
		return false;
	}
	this.theContainer.style.visibility = "visible";
	this.theTextarea.style.visibility = "visible";
	this.mIframe.contentWindow.document.addEventListener("keydown", function(e){self.CWEKeyDown(e); return true;}, false);
	this.mIframe.contentWindow.document.addEventListener("click", function(e){CWEKeyUp(self); return true;}, false);
	this.mIframe.contentWindow.document.addEventListener("dblclick", function(e){CheckImg(e);  return true;}, false);
	this.mIframe.contentWindow.document.addEventListener("selectionchange", function(e){CWESelectionChange(self); return true;}, false);
	this.theTextarea.onkeydown = function (e)
	{
	   OnKeyUpSrc(e);
	};
	document.addEventListener("click", function(e){CheckBtnDropdown(e); return true;}, false);
	return true;
}
unsafeWindow.CWESelectionChange = function(e)
{
	CheckSelected(activeCWEditor);
}
function OnKeyUpSrc(e)
{
	var keyPressed = null;
	var mEvent = null;
	if (e)
	{
		mEvent = e;
	}
	else
	{
		mEvent = event;
	}
	var mAllowKeys = [66, 73, 85, 79, 69, 76, 89];
	var mAllowKeys2 = [81];
	var mfounded = false;
	if(mEvent.ctrlKey && mEvent.shiftKey)
	{
		if(mAllowKeys2.indexOf(mEvent.keyCode) > -1)
		{
			mEvent.preventDefault();
			mfounded = true;
		}
		if(mEvent.keyCode == 81)
		{
			OnClickElemnt("indent");
		}
	}
	else if(mEvent.ctrlKey)
	{
		if(mAllowKeys.indexOf(mEvent.keyCode) > -1)
		{
			mEvent.preventDefault();
			mfounded = true;
		}
		if(mEvent.keyCode == 66)
		{
			OnClickElemnt("bold");
		}
		if(mEvent.keyCode == 73)
		{
			OnClickElemnt("italic");
		}
		if(mEvent.keyCode == 85)
		{
			OnClickElemnt("underline");
		}
		if(mEvent.keyCode == 79)
		{
			OnClickElemnt("center");
		}
		if(mEvent.keyCode == 69)
		{
			OnClickElemnt("hyperlink");
		}
		if(mEvent.keyCode == 76)
		{
			OnClickElemnt("list");
		}
		if(mEvent.keyCode == 89)
		{
			OnClickElemnt("image");
		}
		if(mfounded) return true;
	}
	return false;
}
CWEditor.prototype.CWEKeyDown = function(e)
{
	OnKeyUpSrc(e);
	var mKeyboardex = [37, 38, 39, 40, 8, 9, 13, 46, 33, 34];
	if(mKeyboardex.indexOf(e.keyCode) > - 1)
	{
		CheckSelected(activeCWEditor);
	}
}
function CheckSelected(mCWEditor)
{
	if(mCWEditor.mIframe == null || mCWEditor.mIframe.contentWindow == null) return;
	var Selection = mCWEditor.mIframe.contentWindow.getSelection();
	if(Selection.rangeCount <= 0)
	{
		FocusEditorBody();
	}
	var Alan = Selection.getRangeAt(0);
	var mParentNode = Alan.commonAncestorContainer;
	RefreshToolItem();
	while (mParentNode.nodeType == 3)
	{
		mParentNode = mParentNode.parentNode;
	}
	var selectedarrays = new Array();
	while (true)
	{
		if(mParentNode == null) break;
		if(mParentNode.nodeName == null) break;
		if(mParentNode.nodeName == "") break;
		if(mParentNode.nodeName == "body") break;
		selectedarrays.push(mParentNode);
		mParentNode = mParentNode.parentNode;
	}
	for(var i = selectedarrays.length -1; i > -1; i--)
	{
		SelectTool(selectedarrays[i].nodeName.toLowerCase(), selectedarrays[i]);
	}
	selectedarrays = [];
}
function isSelected(mtname)
{
	if(!activeCWEditor.YeniEditor) return false;
	var mindex = getTIndex(mtname);
	if(mindex < 0)
	{
		return false;
	}
	if(document.getElementById(toolitems[mindex][0]).className == "selected")
	{
		return true;
	}
	return false;
}
function SelectTool(mtname, sitem = undefined)
{
	if(!activeCWEditor.YeniEditor && mtname != "smiley") return false;
	var mindex = getTIndex(mtname);
	if(mindex < 0)
	{
		return SelectOther(mtname, sitem);
	}
	document.getElementById(toolitems[mindex][0]).className = "selected";
	return true;
}
function DeSelectTool(mtname)
{
	var mindex = getTIndex(mtname);
	if(mindex < 0)
	{
		return false;
	}
	document.getElementById(toolitems[mindex][0]).className = "";
	return true;
}
function SelectOther(mtname, trgtparent = undefined)
{
	var SOn = trgtparent;
	switch(mtname)
	{
		case 'table':
			if(SOn == undefined)
			{
				SOn = getTagOnSelection(activeCWEditor, "table");
			}
			if(SOn != null && SOn.getAttribute("cw_ozel_tag") == "AYET")
			{
				document.getElementById("ayet").className = "selected";
			}
			break;
		case 'a':
			if(SOn == undefined)
			{
				SOn = getTagOnSelection(activeCWEditor, "a");
			}
			if(SOn != null)
			{
				var atext = SOn.getAttribute("href");
				if(Str_StartWith(atext, "mailto:"))
				{
					SelectTool("email");
				}
				else
				{
					SelectTool("hyperlink");
				}
			}
			break;
		case 'div':
			var iscentered = false;
			if(SOn == undefined)
			{
				SOn = getTagOnSelection(activeCWEditor, "div");
			}
			if(SOn != null)
			{

				if(SOn.getAttribute("align") != null)
				{
					iscentered = SOn.getAttribute("align").toLowerCase() == "center";
				}
				else
				{
					if(SOn.getAttribute("style") != null)
					{
						iscentered = (SOn.getAttribute("style").indexOf("text-align: center") > -1);
					}
				}
			}
			if(iscentered)
			{
				SelectTool("center");
			}
			break;
		case 'font':
			if(SOn == undefined)
			{
				SOn = getTagOnSelection(activeCWEditor, "font");
			}
			var clropt = document.getElementById("color");
			var fontpt = document.getElementById("font");
			var szpt = document.getElementById("head");
			if(SOn.getAttribute("color") != null)
			{

				for(i = 0; i < clropt.options.length;i++)
				{
					var findex = ColorIndex.indexOf(SOn.getAttribute("color"));
					var mValue = SOn.getAttribute("color").toLowerCase();
					if(findex > -1)
					{
						mValue = clropt.options[findex + 2].value.toLowerCase();
					}
					if(clropt.options[i].value.replace(" ", "").toLowerCase() == mValue)
					{
						clropt.selectedIndex = i;
						break;
					}
				}
			}
			if(SOn.getAttribute("face") != null)
			{
				for(i = 0; i < fontpt.options.length;i++)
				{
					if(fontpt.options[i].value.toLowerCase() == SOn.getAttribute("face").toLowerCase())
					{
						fontpt.selectedIndex = i;
						break;
					}
				}
			}
			if(SOn.getAttribute("size") != null)
			{
				for(var i = 0; i < szpt.options.length;i++)
				{
					if(szpt.options[i].value.toLowerCase() == SOn.getAttribute("size").toLowerCase())
					{
						szpt.selectedIndex = i;
						break;
					}
				}
			}
			break;
	}
	return false;
}
function SelectionHtml(mCWEditor)
{
    var Selection;

	if(mCWEditor.YeniEditor)
	{
		Selection = mCWEditor.mIframe.contentWindow.getSelection();

	}
	else
	{
		Selection = document.getSelection();
	}
	if(Selection.rangeCount <= 0)
	{
		FocusEditorBody();
	}
	var Alan = Selection.getRangeAt(0);
	var mParentNode = Alan.commonAncestorContainer;
	var divc = document.createElement("div");
	for (var i = 0, len = Selection.rangeCount; i < len; ++i)
	{
		divc.appendChild(Selection.getRangeAt(i).cloneContents());
    }
	return divc.innerHTML;
}
function getTagOnSelectionPar(mCWEditor, iprev, crosstext = true)
{
	if(iprev == undefined) iprev = 0;
	var Selection = mCWEditor.mIframe.contentWindow.getSelection();
	if(Selection.rangeCount <= 0)
	{
		FocusEditorBody();
	}
	var Alan = Selection.getRangeAt(0);
	var mParentNode = Alan.commonAncestorContainer;
	if(crosstext)
	{
		while (mParentNode.nodeType == 3)
		{
			mParentNode = mParentNode.parentNode;
		}
	}
	var aaabbaa = 0;
	while (true)
	{
		if(mParentNode == null) break;
		if(mParentNode.nodeName == null) break;
		if(mParentNode.nodeName == "") break;
		if(mParentNode.nodeName == "BODY") break;
		if(aaabbaa == iprev)
		{
			return mParentNode;
		}
		if(iprev == -1)
		{
			if(mParentNode.parentNode != null && mParentNode.parentNode.nodeName == "BODY")
			{
				return mParentNode;
			}
		}
		mParentNode = mParentNode.parentNode;
		aaabbaa++;
	}
	return null;
}
function getTagOnSelection(mCWEditor, mtagname)
{
	var Selection = mCWEditor.mIframe.contentWindow.getSelection();
	if(Selection.rangeCount <= 0)
	{
		FocusEditorBody();
	}
	var Alan = Selection.getRangeAt(0);
	var mParentNode = Alan.commonAncestorContainer;
	while (mParentNode.nodeType == 3)
	{
		mParentNode = mParentNode.parentNode;
	}
	while (true)
	{
		if(mParentNode == null) break;
		if(mParentNode.nodeName == null) break;
		if(mParentNode.nodeName == "") break;
		if(mParentNode.nodeName == "body") break;
		if(mParentNode.nodeName.toLowerCase() == mtagname.toLowerCase())
		{
			return mParentNode;
		}
		mParentNode = mParentNode.parentNode;
	}
	return null;
}
function getTIndex(mtname)
{
	for (var i = 0; i <  toolitems.length; i++)
	{
		for (var j = 0; j <  toolitems[i].length; j++)
		{
			if(mtname == toolitems[i][j]) return i;
		}
	}
	return -1;
}
function RefreshToolItem()
{
	document.getElementById("color").selectedIndex = 0;
	document.getElementById("font").selectedIndex = 0;
	document.getElementById("head").selectedIndex = 0;
	for (var i = 0; i < toolitems.length; i++)
	{
		var mTitem = document.getElementById(toolitems[i][0]);
		if(mTitem == null) continue;
		mTitem.className = "";
	}
	if(document.getElementById("toolbar_smileys").style.display != "none")
	{
		SelectTool("smiley");
	}
}
function CheckBtnDropdown(e)
{
	var mEvent;
	if (e)
	{
		mEvent = e;
	}
	else
	{
		mEvent = event;
	}
	if(!mEvent.target.matches('#dropcontent_msg,#cwe_prevmsg'))
	{
		resetOtherButton();
	}
}
function CheckImg(e)
{
	var mEvent;
	if (e)
	{
		mEvent = e;
	}
	else
	{
		mEvent = event;
	}
	if(mEvent.srcElement == null || mEvent.srcElement == undefined) return;
	var imgelem = mEvent.srcElement;
	if(imgelem == null || imgelem == undefined) return;
	if(imgelem.tagName.toUpperCase() != "IMG")
	{
		return;
	}
	if(imgelem.closest("table") != null && imgelem.closest("table").getAttribute("cw_ozel_tag") == "AYET") return;
	toggleimageresize(imgelem);
}
function toggleimageresize(image) {
    var ikucult = 0;
    var attribute_w = image.getAttribute("org_width");
    var attribute_h = image.getAttribute("org_height");
    if (attribute_w == undefined || attribute_w == "") {
        image.setAttribute("org_width", image.width);
        image.setAttribute("org_height", image.height);
        ikucult = 1;
    }
    else {
        var org_w = image.width.toString();
        if (org_w != attribute_w) {
            ikucult = 0;
        }
        else {
            ikucult = 1;
        }
    }
    if (ikucult == 1) {
        image.setAttribute("width", "250");
        image.setAttribute("height", "200");
    }
    else {
        image.setAttribute("width", attribute_w);
        image.setAttribute("height", attribute_h);
    }
}
function CWEKeyUp(Editor)
{
	CheckSelected(Editor);
	/*
	if(Editor.YeniEditor)
	{
		document.getElementById("message").value = Editor.mIframe.contentWindow.document.getElementById("icerik").innerHTML;
	}*/
}
unsafeWindow.SetValueCWForm = function()
{
	var mhtdoc = activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").innerHTML;
	mhtdoc = mhtdoc.replace(/\<div /gi, "<p ");
	mhtdoc = mhtdoc.replace(/\<\/div\>/gi, "</p>");
	document.getElementsByName("message")[0].value = activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").innerHTML;
	GM_setValue("CWE_SonMesaj", HtmlToCW(false));
}
unsafeWindow.SetValueCW = function()
{
	if(activeCWEditor.YeniEditor)
	{
		document.getElementById("message").value = HtmlToCW(false);
	}
	else
	{
		document.getElementById("message").value = activeCWEditor.theTextarea.value;
	}
	GM_setValue("CWE_SonMesaj", document.getElementById("message").value);
}
unsafeWindow.DoPrevMsg = function()
{
	if(!confirm("Bir önceki hafızaya alınan mesaj getirilsinmi(mevcut mesaj silinecek)?"))
	{
		return;
	}
	if(activeCWEditor.YeniEditor)
	{
		activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").innerHTML = CWtoHtml(oncekimesaj);
	}
	else
	{
		activeCWEditor.theTextarea.value = oncekimesaj;
	}
	document.getElementById("message").value = oncekimesaj;
	RefreshToolItem();
}
unsafeWindow.ResetText = function(sorusor)
{
	if(sorusor)
	{
		if(!confirm("Yazdığınız metni temizlemek istiyormusunuz?"))
		{
			return false;
		}
	}
	if(activeCWEditor.YeniEditor)
	{
		activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").innerHTML = "";
	}
	document.getElementById("message").value = "";
	activeCWEditor.theTextarea.value = "";
	RefreshToolItem();
	return true;
}
unsafeWindow.FocusEditorBody = function()
{
	activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").focus();
}
unsafeWindow.FocusDirect = function()
{
	//activeCWEditor.mIframe.contentWindow.focus();
}
unsafeWindow.FocusEditor = function(istimed = false)
{
		if(!istimed)
		{
			//setTimeout("FocusDirect();", 100);
			//return;
		}
		if(activeCWEditor.YeniEditor)
		{
			theSelection = activeCWEditor.mIframe.contentWindow.getSelection();
			if(theSelection.rangeCount <= 0)
			{
				FocusEditorBody();
				return;
			}
			var iparent = getTagOnSelectionPar(activeCWEditor, -1, true);
			if(iparent != null && iparent != undefined)
			{
				//activeCWEditor.mIframe.contentWindow.document.body.focus();
				//iparent = iparent.parentElement;
				if(iparent.getAttribute("contenteditable") != "true")
				{
					var iindex = iparent.querySelector("[contenteditable=true]");
					if(iindex == null)
					{
						iindex = activeCWEditor.mIframe.contentWindow.document.getElementById("icerik");
					}
					iparent = iindex;
				}
				iparent.focus();

				//activeCWEditor.mIframe.contentWindow.focus();
			}
			else
			{
				activeCWEditor.mIframe.contentWindow.document.getElementById("icerik").focus();
			}
			//document.getElementById("messageCWF").focus();
			//theIframe.focus();
			//activeCWEditor.mIframe.get(0).contentWindow.focus();
			//document.getElementById("messageCWF").contentWindow.focus();
			//setTimeout("FocusDirect()", 300);
		}
		else
		{
			activeCWEditor.theTextarea.focus();
		}
}
function postImage(imgFile, uploadfinished)
{
	GM_xmlhttpRequest({
    method: "GET",
    url: "https://imguploads.net/",
    headers: {
		"Accept": "text/html"
    },
    onload: function(r) {
        var result = r.responseText.match(/auth_token = \"([\w]+)\";/i);
		var resultObject = new Object();
        if(result == null)
        {

			resultObject.success = 0;
			resultObject.message = "token key bulunamadı";

			uploadfinished(resultObject);
			return;

        }
		var formData = new FormData();
		formData.append("auth_token", result[1]);
		formData.append("timestamp", new Date().getTime());
		formData.append("type", "file");
		formData.append("action", "upload");
		formData.append("nsfw", "0");
		formData.append("source", imgFile);
		GM_xmlhttpRequest({
		method: "POST",
		url: "https://imguploads.net/json",
		headers: {
			"Accept": "application/json",
			"Referer": "https://imguploads.net/json"
		},
		data: formData,
		onload: function(ret) {
            if(ret.status != 200 || ret.responseText == undefined || ret.responseText == null)
            {
                resultObject.success = 0;
                resultObject.message = "Resim yüklenemedi";
                uploadfinished(resultObject);

            }
            else
            {

                var obj = JSON.parse(ret.responseText);
                console.log(obj);
                if(obj == undefined || obj.image == null || obj.image.url == undefined)
                {
                    resultObject.success = 0;
                    resultObject.message = "Resim yüklenemedi";
                }
                else
                {
                    resultObject.success = 1;
                    resultObject.message = obj.image.url;

                }
                uploadfinished(resultObject);


            }

			}
		});


    }

    });
}
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();


function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}
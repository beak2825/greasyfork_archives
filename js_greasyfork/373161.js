	// ==UserScript==
// @name     Writing.com's Archive Navigation Enhancement
// @version         22
// @description A script that I create to better navigate writing archived
// @include  http*://web.archive.org/web/*writing.com*
// @include  http*://web.archive.org/web/*writingbk*
// @include  http*://web.archive.org/web/*writingbackupproject*
// @include  http*://web.archive.org/web/*writingbackup.000webhostapp*
// @namespace https://greasyfork.org/users/218817
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373161/Writingcom%27s%20Archive%20Navigation%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/373161/Writingcom%27s%20Archive%20Navigation%20Enhancement.meta.js
// ==/UserScript==

/////block warning messages/////
addJS_Node (null, null, overrideSelectNativeJS_Functions);

function overrideSelectNativeJS_Functions () {
    window.alert = function alert (message) {
        console.log (message);
    }
}

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

//block annoying pops up
(function(){

/* PREFERENCE OPTIONS */
var remove_href_popups = "true"; // <a href="javascript:window.open ....
var remove_event_popups = "true"; // <a href="#" onclick="window.open ....
var remove_target_popups = "true"; // <a .... target="_blank"
var remove_script_popups = "true"; // all "in-page" script pop-ups - MAY BREAK LINK
var nullify_all = "true"; // nullifies open in all scripts (external too) - MAY BREAK LINK
var form_targets = "true"; // for <form .. target="_blank"
/* END OF PREFERENCE OPTIONS */

var allLinks, thisLink, L_att_vals, L_attr;
var allScriptTags, target_string;
var allForms, thisForm, F_att_vals, F_attr;

var expression = /(.)*(window\.open\([\'|\"])(https?\:\/\/)?(www\.)?([-_A-Z0-9\/\.]+[^#|?|\'|\"|\s])*/gi;

allLinks = document.evaluate(
			'//a',
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null
			);
	for (var i = 0; i < allLinks.snapshotLength; i++)
	{
		thisLink = allLinks.snapshotItem(i);
		L_att_vals = thisLink.attributes;
		for (var j = 0; j < L_att_vals.length; j++)
		{
			L_attr = L_att_vals[j].value;
				if((L_att_vals[j].name == "href") && L_attr.match(expression) && (remove_href_popups == "true"))
			{
				thisLink.setAttribute("href", RegExp.$3 + RegExp.$4 + RegExp.$5);
			}
				if((L_att_vals[j].name != "href") && L_attr.match(expression) && (remove_event_popups == "true"))
			{
				thisLink.setAttribute("href", RegExp.$3 + RegExp.$4 + RegExp.$5);
				thisLink.setAttribute(L_att_vals[j].name, "");
			}
				if((L_att_vals[j].name == "target") && L_attr.match(/_blank/gi) && (remove_target_popups == "true"))
			{
				thisLink.setAttribute(L_att_vals[j].name, "_self");
			}

		}
	}

if(remove_script_popups == "true")
{
allScriptTags = document.evaluate(
			'//script',
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null
			);
	for (var k = 0; k < allScriptTags.snapshotLength; k++)
	{
		target_string = allScriptTags.snapshotItem(k).innerHTML;
		if(target_string.match(/window\.open/gi))
		{
			target_string = target_string.replace(/window\.open/gi, "");
			var new_script_tag = document.createElement('script');
			new_script_tag.setAttribute("type","text/javascript");
			new_script_tag.innerHTML = target_string;
			document.body.appendChild(new_script_tag);
		}
	}
}

if(nullify_all == "true")
{
	var nulling_script_tag = document.createElement('script');
	nulling_script_tag.setAttribute("type","text/javascript");
	nulling_script_tag.innerHTML = "open = null;"
	document.body.appendChild(nulling_script_tag);
}

if(form_targets == "true")
{
allForms = document.evaluate(
			'//form',
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null
			);
	for (var m = 0; m < allForms.snapshotLength; m++)
	{
		thisForm = allForms.snapshotItem(m);
		F_att_vals = thisForm.attributes;
		for (var n = 0; n < F_att_vals.length; n++)
		{
			F_attr = F_att_vals[n].value;
			if((F_att_vals[n].name == "target") && F_attr.match(/_blank/gi))
			{
				thisForm.setAttribute(F_att_vals[n].name, "_self");
			}
		}
	}
}

})();

/////block media fastclick bullshit/////
var linkList = document.querySelectorAll ("a");

Array.prototype.forEach.call (linkList, function (link) {
    if (link.hostname.includes("fastclick") ||
       link.hostname.includes("media.fastclick")) {
        //-- Block the link
        link.src = "javascript:void(0)";
        link.style = "text-decoration: none;background: #f3f315;";
    }
} );


var linkList = document.querySelectorAll ("a");

Array.prototype.forEach.call (linkList, function (link) {
    if (link.hostname.includes("_static") ||
       link.hostname.includes("_static")) {
        //-- Block the link
        link.src = "javascript:void(0)";
        link.style = "text-decoration: none;background: #f3f315;";
    }
} );

//Prevents Adblock Redirect and annoyances
window.onload = function() {
	var d = document;	// shorthand
	var scripts = d.getElementsByTagName('script');
	for(var i = 0; i < scripts.count; i++) {
		if(scripts[i].src.indexOf('dataStore.js') != -1) {
			scripts[i].src = '';
		}
	}
}


window.onload = function() {
	var d = document;	// shorthand
	var scripts = d.getElementsByTagName('script');
	for(var i = 0; i < scripts.count; i++) {
		if(scripts[i].src.indexOf('is.js') != -1) {
			scripts[i].src = '';
		}
	}
}


window.onload = function() {
	var d = document;	// shorthand
	var scripts = d.getElementsByTagName('script');
	for(var i = 0; i < scripts.count; i++) {
		if(scripts[i].src.indexOf('optionsadvert.js') != -1) {
			scripts[i].src = '';
		}
	}
}


/////block images and bullshit/////
var style = "text-align: right;position: fixed;z-index:9999999;bottom: 0;width: auto;right: 1%;cursor: pointer;line-height: 0;display:block !important;";
var elems = document.getElementsByTagName('div');
for (var i = 0; i < elems.length; i++)   {
    if(elems[i].getAttribute('style') == style) {
        elems[i].style.display = 'none';
    }
}

var images = document.getElementsByTagName ("img");
var x=0;
while(x<images.length)
{
if(images[x].src == "http://web.archive.org/web/20190713212940im_/https://i.imgur.com/MY7IEW1.gif")
{
images[x].src = "https://web.archive.org/web/20190714031110/https://i.imgur.com/S3jkJhG.gif";
}
x=x+1;
}

/////fix link redirection problem/////
var links,thisLink;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/(.*)https://www.writing.com/main/redirect(.*)&redirect_url=(.*?)'),
                                      'http://web.archive.org/web/$4');

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/(.*)/item_id/(.*?)-(.*)\/action\/outline'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/(.*)/item_id/(.*?)\/action\/outline'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');
}

/////change all links from pages "chapter_edit/view/chapter_map" to "chapter_edit/view/chapter_map"/////
if (/\/chapter_edit\/view\/chapter_map/.test (location.pathname) ) {
var qLinks  = document.querySelectorAll ("a[href*='map']");

for (var J = qLinks.length - 1;  J >= 0;  --J) {
    var oldHref = qLinks[J].getAttribute ('href');
    var newHref = oldHref.replace (/\map/, "chapter_edit/view/chapter_map");

    //console.log (oldHref + "\n" + newHref);
    qLinks[J].setAttribute ('href', newHref);
}
}

/////change all links from pages "action/view/chapter_map" to "action/view/chapter_map"/////
else if (/\/action\/view\/chapter_map/.test (location.pathname) ) {
var qLinks  = document.querySelectorAll ("a[href*='map']");

for (var J = qLinks.length - 1;  J >= 0;  --J) {
    var oldHref = qLinks[J].getAttribute ('href');
    var newHref = oldHref.replace (/\map/, "action/view/chapter_map");

    //console.log (oldHref + "\n" + newHref);
    qLinks[J].setAttribute ('href', newHref);
}
}

/////change all links from pages "edit/view/chapter_map" to "edit/view/chapter_map"/////
if (/\/edit\/view\/chapter_map/.test (location.pathname) ) {
var qLinks  = document.querySelectorAll ("a[href*='map']");

for (var J = qLinks.length - 1;  J >= 0;  --J) {
    var oldHref = qLinks[J].getAttribute ('href');
    var newHref = oldHref.replace (/\map/, "edit/view/chapter_map");

    //console.log (oldHref + "\n" + newHref);
    qLinks[J].setAttribute ('href', newHref);
}
}

/////if page URL does not contain "/chapter_map/" or "/cid/" redirect to index instead first chapter when viewing page synopsis/////
if(document.URL.indexOf("/cid/") == -1)
if(document.URL.indexOf("/map/") == -1)
if(document.URL.indexOf("/chapter_map/") == -1)
{
var links,thisLink;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/200(.*)/item_id/(.*?)-(.*)\/map/1'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/201[0-7](.*)/item_id/(.*?)-(.*)\/map/1'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/201[8-9](.*)/item_id/(.*?)-(.*)\/map/1'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');

thisLink.href = thisLink.href.replace(RegExp('http(.*)://web.archive.org/web/20[2-9](.*)/item_id/(.*?)-(.*)\/map/1'),
                                      'https://archive.org/download/stories_files/stories.zip/$3.html');
}
}

/////redirect "/action/view/" not founded pages to "/edit/view/" founded pages and vice-versa/////
if (/The Wayback Machine has not archived that URL/i.test (document.body.innerHTML) )
{
    if (/\/action\/view\/chapter_map/.test (location.pathname) ) {
    //alert ("This page is being redirect, please wait!");
        window.location = document.URL.replace("/action/view/","/edit/view/")
    }
}

if (/The Wayback Machine has not archived that URL/i.test (document.body.innerHTML) )
{
    if (/\/edit\/view\/chapter_map/.test (location.pathname) ) {
    //alert ("This page is being redirect, please wait!");
        window.location = document.URL.replace("/edit/view/","/action/view/")
    }
}



////adds redirect to "outline" on writingbackupproject archived pages////
if (/writingbackupproject/.test (location.pathname) )
if(document.URL.indexOf("outline.html") == -1) {
$("body").append ( '                                                \
    <div id="gmRightSideBar"><a href="outline.html">Outline</a></div>\
' );

GM_addStyle ( "                                                     \
    #gmRightSideBar {                                               \
        text-align:              center;                             \
        position:               relative;                              \
        top:                    60;                                  \
        font-family: sans-serif; \
        background:             white;                             \
        padding: 5px 10px;                                             \
        width:                  60%;                              \
        border:                5px solid black;                   \
        border-top: 0px; \
        height:                10%;                               \
        margin:                auto;                                \
    }                                                               \
" );
}


/////hide pop up/////
Array.from( document.querySelectorAll('div.test') )
  .filter( node => /\b(Handtekening|Thuis)\b/i.test(node.textContent) )
  .forEach( node => node.style.display = 'none' );


/////fix font problems that happens during archive/////
(function() {var css = [
	"#Top_Half_Page_Wrapper_Inner {",
	"    font-size: 13px!important;",
	"}",
	"",
	".norm {",
	"    font-size: 13px!important;",
	"}",
	"",
	"",
	".sblueroll {",
	"    font-size: 13px!important;",
	"}",
	"",
	".skinLinks {",
	"    font-size: 13px!important;",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

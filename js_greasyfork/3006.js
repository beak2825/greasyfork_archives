// ==UserScript==
// @name           Pokec Preview
// @namespace      marki
// @description    Preview profile images on Pokec/AZet
// @include        http://*.azet.sk/*
// @include        http://*.aktuality.sk/*
// @include        http://*.zive.sk/*
// @icon           http://www.azet.sk/favicon.ico
// @grant	GM_setValue
// @grant	GM_getValue
// @grant	GM_xmlhttpRequest
// @version        1.2
// @downloadURL https://update.greasyfork.org/scripts/3006/Pokec%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/3006/Pokec%20Preview.meta.js
// ==/UserScript==

// Code based on FFixer http://userscripts.org/scripts/show/8861
// v0.2 - preview also for photo albums, also profile pic in comments
// v0.3 - 2011-03-09 - fixed images URL due to change on azet, change in photoalbum big picture filename
// v0.4 - 2011-06-14 - show popup on left if thumbnail is on right
// v0.5 - 2012-01-23 - added support for new image urls, added icon, added search URL aktuality.sk
// v0.6 - 2012-04-05 - again new URL (m1.aimg.sk instead of m.aimg.sk)
// v1.1 - 2015-04-17 - all profile pics are now protected; need to fetch user profile to get URL of full size pic
// v1.2 - 2015-05-03 - on profile page, show date of last visit
//        2015-05-09 - show date of last visit also on list of users page

// *** WARNING: ***
// This version won't work without changing URL http://XXXX/azet_prof_img.php to your copy of PHP script

(function() {

var showPopupPicTimeout;
var hidePopupPicTimeout;

//
// Add styles used by script
//
addStyle(
	'.fbfPopup { padding:10px; background:#f6f6f6; border:3px double #666666; -moz-border-radius:5px; -webkit-border-radius:5px; -khtml-border-radius:5px; border-radius:5px; }'+
	'#qq-popup-div { display:none; background:white; border:1px solid #333; position:fixed !important; top:3px !important; padding:4px; min-width:130px; z-index:99999 !important; -moz-border-radius:3px; -webkit-border-radius:3px; -khtml-border-radius:3px; border-radius:3px; }'+
	'.qq-popup-div { right:3px !important; left:auto !important; -moz-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -webkit-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -khtml-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); box-shadow:-5px 5px 5px rgba(0,0,0,0.6); }'+
	'.qq-popup-div-left  { left: 3px !important; right:auto !important; -moz-box-shadow:5px 5px 5px rgba(0,0,0,0.6); -webkit-box-shadow:5px 5px 5px rgba(0,0,0,0.6); -khtml-box-shadow:5px 5px 5px rgba(0,0,0,0.6); box-shadow:5px 5px 5px rgba(0,0,0,0.6); }'+
	'.qq-popup-div-right { right:3px !important; left:auto  !important; -moz-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -webkit-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -khtml-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); box-shadow:-5px 5px 5px rgba(0,0,0,0.6); }'+
	'#qq-pic-close { display:none; position:absolute; top:4px; right:10px; color:#ff9999; cursor:pointer; font-weight:bold; font-size:14px; }'+
	'#qq-popup-div:hover #ff-popup-pic-close { display:block; }'+
	'#qq-pic-close:hover { color:#aa6666; }'+
	'#ff-popup-pic-image { text-align:center; }'+
	'#ff-popup-pic-image img { color:#999999; display:block; }'+
	'#visitDiv { text-align: center; }'
);


// profile page visits
function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );}
var last, Nick, text;
if (/http:\/\/pokec\.azet\.sk\/[^/]+\/?\?i9/.test(location)) {
  Nick = location.toString().replace(/\/?\?.*$/, "");
  Nick = Nick.replace(/http:\/\/pokec\.azet\.sk\//, "");
  console.log("Profile page for "+Nick);
  last = GM_getValue("lastProf-"+Nick,"");
  if (!last) text="<b>Profil este nebol pozrety</b>"; else text="Posledna navsteva: <b>"+last+"</b>";
  var metaViz  = document.evaluate("//div[@class='metaVizitka']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var visitDiv = document.createElement('div');
  visitDiv.id  = 'visitDiv';
  visitDiv.innerHTML = '<div>'+text+'</div>';
  insertAfter(visitDiv, metaViz);
  last = new Date();
  text = last.getDate() +"."+ (last.getMonth()+1) +"."+ last.getFullYear();
  GM_setValue("lastProf-"+Nick, text);
}


// list of users (add profile visits)
var allLinks, thisLink, i;
if (/http:\/\/pokec\.azet\.sk\/sluzby\/pouzivatelia\//.test(location)) {
  allLinks = document.evaluate('//div[@class="userContainer"]//h3//a', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < allLinks.snapshotLength; i++) {
    thisLink = allLinks.snapshotItem(i);
    Nick = thisLink.href.toString().replace(/\/?\?.*$/, "");
    Nick = Nick.replace(/http:\/\/pokec\.azet\.sk\//, "");
    //console.log("Profile link found for "+Nick);
    last = GM_getValue("lastProf-"+Nick,"");
    if (last) {
      visitDiv = document.createElement('div');
      visitDiv.innerHTML = '<div style="padding-left:10px;font-weight:bold;font-size:80%;color:#3878C0">'+last+'</div>';
      insertAfter(visitDiv, thisLink);
    }
  }
}

//
// Add div for showing big profile pics
//
var popupPicDiv = document.createElement('div');
popupPicDiv.id = 'qq-popup-div';
popupPicDiv.className = 'fbfPopup qq-popup-div';
popupPicDiv.innerHTML = '<div id="qq-pic-close" title="Close">x</div><div id="ff-popup-pic-image"><span></span></div>';

try {
	document.body.insertBefore(popupPicDiv, document.body.lastChild.nextSibling);
	document.getElementById('qq-pic-close').addEventListener('click', function() { document.getElementById('qq-popup-div').style.display='none'; }, false);
} catch(x) {
	var fbppdivAdder = setInterval(function() {
		try {
			document.body.insertBefore(popupPicDiv, document.body.lastChild.nextSibling);
			document.getElementById('qq-pic-close').addEventListener('click', function() { document.getElementById('qq-popup-div').style.display='none'; }, false);
			if ($('#qq-popup-div')) { clearInterval(fbppdivAdder); }
		} catch(x) {}
	}, 250);
}
// Listeners are added by the code for showing the popups

//
// Listen for image mouseovers/mouseouts to show/hide popups
//
// http://213.215.107.127/fotky/1272/79/n_12727989.jpg?v=4
// http://213.215.107.125/fotky/1518/42/n_15184211.jpg?v=5 -- thumb
// http://213.215.107.125/fotky/1171/72/n_11717223.jpg?v=5 -- profil
// http://213.215.107.127/fotky/ 622/47/s_6224758 .jpg?v=2 -- zoznam priatelov
// http://213.215.107.127/fotky/ 622/47/m_6224758 .jpg?v=2 -- komentare v profile
// http://213.215.107.125/fotky/ 542/71/  5427111 .jpg?v=3 -- big

// http://213.215.107.78/fotoalbumy/356/357/nf_356357110_be87b7135c37a25cb494877aa5bd4480.jpg - thumb
// http://213.215.107.78/fotoalbumy/356/357/ f_356357110_be87b7135c37a25cb494877aa5bd4480.jpg - big photo
// http://213.215.107.78/fotoalbumy/356/357/mf_356357110_be87b7135c37a25cb494877aa5bd4480.jpg - 2011-03-09 big photo
// http://213.215.107.77/fotoalbumy/356/357/ f_356357907_fe56924742d842826c03c551811c0dbc.jpg

// found 2012-01-23
// http://m.aimg.sk/profil/m_15702354.jpg?v=5
// http://m.aimg.sk/profil/s_15702354.jpg?v=5
// http://m.aimg.sk/profil/  15702354.jpg?v=5

picRegex = /http:\/\/(u\.aimg\.sk|213\.215\.107\.[0-9]+)\/fotky\/[0-9]+\/[0-9]{2}\/[nsm]_([0-9]+\.jpg)/;
albRegex = /http:\/\/(u\.aimg\.sk|213\.215\.107\.[0-9]+)\/fotoalbumy\/[0-9]+\/[0-9]+\/nf_[0-9]+_[0-9a-f]+\.jpg/;
newRegex = /http:\/\/m[0-9]*\.aimg\.sk\/profil\/[nsm]_([0-9]+\.jpg)/;
proRegex = /http:\/\/t[0-9]*\.aimg\.sk\/pokec\/fotoalbumy\/[0-9]+\/[0-9a-f_]+\.jpg/;

function showPopupPic(e) {
	try {
		var t = e.target;
		var oldSrc;
		var newSrc;

		if (t.tagName == 'IMG' && picRegex.test(t.src)) { newSrc = t.src.replace(/[nsm]_/, ""); }
		if (t.tagName == 'IMG' && albRegex.test(t.src)) { newSrc = t.src.replace(/nf_/   , "mf_"); }
		if (t.tagName == 'IMG' && newRegex.test(t.src)) { newSrc = t.src.replace(/[nsm]_/, ""); }
		if (t.tagName == 'IMG' && proRegex.test(t.src)) { newSrc = GM_getValue(t.src, ""); if (newSrc) console.log("From cache: "+newSrc); } // fetch URL from local storage

		if (oldSrc || newSrc) {
			clearTimeout(hidePopupPicTimeout);
			t.removeEventListener('mouseout', hidePopupPic, false);
			t.addEventListener('mouseout', hidePopupPic, false);
			showPopupPicTimeout = setTimeout(function(){
				$('#ff-popup-pic-image').innerHTML = '<img src="' + newSrc + '" alt="PokecPreview - Nacitavam..." style="max-height:' + (window.innerHeight-35) + 'px;"/>';
				$('#qq-popup-div').style.display = 'block';
				$('#qq-popup-div').className = 'fbfPopup qq-popup-div-' + (e.pageX>document.body.clientWidth/2 ? 'left' : 'right');
			}, 250);
		}
		/* 2015-04-17: all profile photos are now fotoalbum protected images; 1st fetch users profile */
		// on List of users, there is parent DIV, then A
		if (!newSrc && t.tagName == 'IMG' && proRegex.test(t.src) && ((t.parentNode.tagName=='A') || (t.parentNode.parentNode.tagName=='A'))) {
			var nick;
			if (t.parentNode.tagName=='A') nick = t.parentNode.href; else nick = t.parentNode.parentNode.href;
			if (!/http:\/\/pokec\.azet\.sk\/[^/]+\/?\?i9/.test(nick)) { console.log("No profile: "+nick); return; }
			nick = nick.replace(/\/\?.*$/, "");
			nick = nick.replace(/http:\/\/pokec\.azet\.sk\//, "");
			clearTimeout(hidePopupPicTimeout);
			t.removeEventListener('mouseout', hidePopupPic, false);
			t.addEventListener('mouseout', hidePopupPic, false);
			showPopupPicTimeout = setTimeout(function(){
				newSrc = "";
				$('#ff-popup-pic-image').innerHTML = '<img src="' + newSrc + '" alt="PokecPreview - Nacitavam..." style="max-height:' + (window.innerHeight-35) + 'px;"/>';
				$('#qq-popup-div').style.display = 'block';
				$('#qq-popup-div').className = 'fbfPopup qq-popup-div-' + (e.pageX>document.body.clientWidth/2 ? 'left' : 'right');
				GM_xmlhttpRequest({ method: "GET", url: "http://XXXX/azet_prof_img.php?nick="+nick, timeout: 5000, onload: function(resp) {
					var r = resp.responseText;
					$('#ff-popup-pic-image').innerHTML = '<img src="' +r+ '" alt="Foto '+nick+'" style="max-height:'+(window.innerHeight-35)+'px;"/>';
					//console.log("Image big: "+r);
					if (/jpg/.test(r)) GM_setValue(t.src, r);
					//var match;
					//if (match = /property="og:image" content="(.*)"/.exec(resp.responseText)) { $('#ff-popup-pic-image').innerHTML = '<img src="' + match[1] + '" style="max-height:'+(window.innerHeight-35)+'px;"/>'; console.log("Image big: "+match[1]); }
				} });
			}, 250);
		}

	} catch(x) { logError('Popup Pic', x); }
}

$('#qq-popup-div').addEventListener('mouseover', function(e) { clearTimeout(hidePopupPicTimeout); }, false);
$('#qq-popup-div').addEventListener('mouseout',  function(e) {
	var r = e.relatedTarget;
	if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
		while (r.parentNode && r.id!='qq-popup-div') { r = r.parentNode; }
		if (r.id!='qq-popup-div') { document.getElementById('qq-popup-div').style.display = 'none'; }
	}
}, false);

window.addEventListener('mouseover', function(e) {
	if (!e.shiftKey && !e.ctrlKey && !e.altKey) { showPopupPic(e); }
}, false);

function hidePopupPic(e) {
	clearTimeout(showPopupPicTimeout);
	if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
		hidePopupPicTimeout = setTimeout(function() { document.getElementById('qq-popup-div').style.display = 'none'; }, 30);
	}
}

function logError(category, x) {
	msg = "PokecPreview Error (" + category + ") - " +  x.name + ' - ' + x.message + ' in file <' + x.fileName + '> on line ' + x.lineNumber;
	console.log(msg);
}

function $(q, root, single) {
	root = root || document;
	if (q[0]=='#') { return root.getElementById(q.substr(1)); }
	else if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
		if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
		return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	else if (q[0]=='.') { return root.getElementsByClassName(q.substr(1)); }
	return root.getElementsByTagName(q);
}

function addStyle(css) {
	if (typeof GM_addStyle !== 'undefined') { return GM_addStyle(css); }
	else if (heads = document.getElementsByTagName('head')) {
		var style = document.createElement('style');
		try { style.innerHTML = css; }
		catch(x) { style.innerText = css; }
		style.type = 'text/css';
		heads[0].appendChild(style);
	}
}

}) ();

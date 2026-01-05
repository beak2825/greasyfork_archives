// ==UserScript==
// @name           Forum Image Link Copier
// @namespace      http://forum.celebtop.com/memberlist.php?mode=viewprofile&u=2129
// @description    Copies the urls for images in the current post, use in conjunction with JDownloader or similar program.
// @match          *://*.celebtop.com/viewtopic.php*
// @match          *://*.nudecelebforum.com/showthread.php*
// @match          *://*.celebfanforum.com/showthread.php*
// @match          *://*.ns4w.org/showthread.php*
// @version 0.0.1.20160303021407
// @downloadURL https://update.greasyfork.org/scripts/17587/Forum%20Image%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/17587/Forum%20Image%20Link%20Copier.meta.js
// ==/UserScript==

var images;
var oldparent = null;
var imageGroup = new Array();

if(images == undefined) {
	images = findImages();
}

for(var i = 0; i < images.length; i++) {
	var thisparent = images[i][0].parentNode.parentNode;
	if(oldparent != null) {
		if(thisparent != oldparent) {
			createLink(imageGroup);
			oldparent = thisparent;
			imageGroup = new Array();
		}
		imageGroup.push(images[i]);
	} else {
		imageGroup.push(images[i]);
		oldparent = thisparent;
	}
}
if(imageGroup.length > 0) {
	createLink(imageGroup);
}

function createLink(urls) {
	var span = document.createElement('span');
	var lasturl = urls[urls.length-1];
	var frag = document.createDocumentFragment();
	span.style.background = "rgb(128, 192, 255)";
	span.style.cursor = "pointer";
	span.appendChild(document.createTextNode(" Copy links in this post "));
	span.addEventListener("click", function(ev) {copyLinks(ev, urls);}, false);
	frag.appendChild(document.createElement('br'));
	frag.appendChild(span);
	frag.appendChild(document.createElement('br'));
	if(lasturl[0].nextSibling) {
		lasturl[0].parentNode.insertBefore(frag, lasturl[0].nextSibling);
	} else {
		lasturl[0].parentNode.appendChild(frag);
	}
}

function copyLinks(ev, urls) {
	var copytext = "";
	for(var i = 0; i < urls.length; i++) {
		copytext += urls[i][1]+"\n";
	}
	if(copyTextToClipboard(copytext)) {
		ev.target.innerHTML = " Copied "+urls.length+" links ";
	} else {
		ev.target.innerHTML = "I couldn't copy these automatically, you'll have to do it manually:<br>"+copytext.replace("\n", "<br>");
	}
}

function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	var successful = false;
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	textArea.style.padding = 0;
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	textArea.style.background = 'transparent';
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	try {
    successful = document.execCommand('copy');
  } catch (err) {
    successful = false;
  }
  document.body.removeChild(textArea);
  return successful;
}

function findImages() {
	var imgs = document.getElementsByTagName("img");
	var imagelinks = new Array();
	var d = currentDomain().toLowerCase();
	for(var i = 0; i < imgs.length; i++) {
		var p = imgs[i].parentNode;
		if(p && p.tagName.toUpperCase() == "A") {
			if(p.href.toLowerCase().indexOf(d) == -1) {
				imagelinks.push([p, p.href]);
			}
		}
	}
	return imagelinks;
}

function currentDomain() {
	var i = 0;
	var domain = document.domain;
	var p = domain.split('.');
	var s = '_gd'+(new Date()).getTime();
	while(i<(p.length-1) && document.cookie.indexOf(s+'='+s)==-1){
		domain = p.slice(-1-(++i)).join('.');
		document.cookie = s+"="+s+";domain="+domain+";";
	}
	document.cookie = s+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+domain+";";
	return domain;
}


// ==UserScript==
// @name         Instagram Reloaded (my)
// @icon         http://fs5.directupload.net/images/170509/yp3n3e2v.png
// @homepage     https://greasyfork.org/en/scripts/14755-instagram-reloaded
// @version      2.12
// @description  View or download the full-size Instagram image/video. Super simple: press alt+f or shift & click to view media - alt & click saves file. Read for more options.
// @author       despecial
// @match        *://*.instagram.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/112442
// @downloadURL https://update.greasyfork.org/scripts/29610/Instagram%20Reloaded%20%28my%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29610/Instagram%20Reloaded%20%28my%29.meta.js
// ==/UserScript==

var ig = '#react-root section main article > div > div:has(> div > img),';
    ig+= '#react-root section main article > div > div > div div:has(video),';
    ig+= '#react-root section main article > div div div a,';
    ig+= 'div[role="dialog"] article header + div,';
    ig+= '#react-root section main article div:has(> div > img),';
    ig+= '.EmbedFrame.EmbedMedia';
var alt_trigger = 'div[role="dialog"] article header + div, #react-root section main article div:has(> div > img)';

function despecial_ig(e,$this,a) {
  if(!e) e = window.event;
  if(e.shiftKey || e.shiftKey || a == "rm") {
	 var p,v;
    if($('div[role="dialog"] article header + div').length && a == "rm") {
	     v = $this.find('video').attr('src');
	     p = "";
   	} else {
	 	 p = $this.find('img').attr('src');
	     v = $this.find('video').attr('src');
       }
	var ep = $this.find('.efImage').css('background-image'),
	 rplcd = new Array('\/sh0.08','(\/[s|p][\\d]+x[\\d]+)','\/c[\\d]+\\.[\\d]+.[^\\/]*','[?+].+','[?+].+'),
	     t = (e.shiftKey) ? '_self' : '_blank',
	    fs = (typeof ep === "string" || ep instanceof String) ? ep.replace(/^url\(['"]?([^'"]+)['"]?\)/,'$1') : p;
	for (var i = 0; i < rplcd.length; ++i) {
	  var r = new RegExp(rplcd[i],'i');
	  if( r.test(fs) ) fs=fs.replace(r,'');
	}
	var isChrome = !!window.chrome && !!window.chrome.webstore;
   if(isChrome && e.altKey) {
	  if(fs) direct_download(fs);
	   if(v) direct_download(v);
   } else {
    if(v) { e.preventDefault(); GM_openInTab(v, t); }
    if(fs) GM_openInTab(fs, t);
   }
  }
}

/* dynamic download link */
function direct_download(url) {
	var filename = url.match('[^/]*$')[0];
	var dl = $('<a>',{ 'href': url, 'download': filename});
		dl.appendTo('body');
		dl[0].click();
		dl.remove();
}

/* left-click and hold shift key to open desired item */
$(document).on('click',ig,function(e,a) {
   despecial_ig(e,$(this),a);
});

/* keyboard shortcut alt+f(ullsize) works on video popup, single photo, single video pages */
$(document).delegate(alt_trigger,'ig_press',function(e,a) {
   despecial_ig(e,$(this),a);
});

document.onkeydown = function(e){
    e = e || event;
    if (e.altKey && e.keyCode==70) $(alt_trigger).trigger('ig_press',['rm']);
};


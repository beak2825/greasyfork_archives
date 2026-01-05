// ==UserScript==
// @name        Flickr Original Link
// @namespace   https://greasyfork.org/scripts/1190-flickr-original-link
// @include 	/flickr\.com/
// @version	6.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant 	GM_addStyle
// @require 	https://code.jquery.com/jquery-3.3.1.min.js
// @description  Show direct links to download biggest Flickr image available and some other sizes.
// @downloadURL https://update.greasyfork.org/scripts/1190/Flickr%20Original%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/1190/Flickr%20Original%20Link.meta.js
// ==/UserScript==
var postfix = "_d.jpg";
var prefix = "DOWNLOAD ";
var isChecked_openLink = "";
var isChecked_alwaysShow = "";
var key_openLink = "flickr_openLink";
var key_alwaysShow = "flickr_alwaysShow";
var value_openLink = false;
var value_alwaysShow = false;
var imageSizeOrder = ["9k","8k","7k","6k","5k","4k","3k","2k","o", "k", "h", "l","b", "c", "z"];
var globalObserver = null;

function log(s) {
	console.log(s);
}
log("Begin flickr script");

function getSetting() {
	log("Begin get settings");
	value_openLink = GM_getValue(key_openLink, false);
	value_alwaysShow = GM_getValue(key_alwaysShow, false);
	if (value_openLink) {
		postfix = ".";
		isChecked_openLink = ' checked="checked" ';
		prefix = "OPEN ";
	}
	else {
		postfix = "_d.";
		isChecked_openLink = "";
		prefix = "DOWNLOAD ";
	}
	if (value_alwaysShow) {
		isChecked_alwaysShow = ' checked="checked" ';
	}
	else {
		isChecked_alwaysShow = "";
	}
}

function checkAlwaysShow() {
	if (value_alwaysShow) {
		$('div.interaction-view').css('opacity', '1');
	}
	$('div.interaction-bar').css('bottom', '1.1em');
}

function action_single_page() {
	if ($('.commonButton').length > 0) return false;
	var action = function (sourceCode) {
		var sizes = sourceCode.match(/modelExport: {.+?"sizes":{.+?}}/i);
		var mSize = sizes[0].match(/"width":"?\d+"?,"height":"?\d+"?,/ig);
		var mLink = sizes[0].match(/"displayUrl":"[^"]+"/ig);
		var length = mLink.length;
		for (var k = 0; k < length; k++) {
			mSize[k] = mSize[k].replace(/"width":(\d+),"height":(\d+),/i, "$1 x $2");
			mLink[k] = mLink[k].replace(/"displayUrl":"([^"]+)"/i, "$1").replace(/\\/g, "").replace(/(_[0-9a-z]+)\.([a-z]{3,4})/i, '$1' + postfix + '$2');
		}
	  var insertLocation = $('.sub-photo-right-row1').filter(':first');
		var str = '<div><a class="commonButton bigButton" href="' + mLink[length - 1] + '">' + prefix + mSize[length - 1] + ' px</a>';
		for (k = length - 2; k >= length - 7 && k >= 0; --k) {
			str += '<a class="commonButton smallButton" href="' + mLink[k] + '">' + mSize[k] + ' px</a>';
		}
    str+="</div>";
    //2024.08.16: Add button closer to the top of right column. Sometimes the button is not displayed, just reload the page.
    insertLocation.prop('outerHTML',str+insertLocation.prop('outerHTML'));
	};
	$.get(document.URL, action);
}

function getLinkFromSource(data) {
	if (data === null) return;// source code is not loaded, or empty, or has nothing good
	var sizes = data.match(/"sizes":.+?}}/ig);
	if (sizes === null) return false; // source code is not loaded, or empty, or has nothing good
	var dates = data.match(/"datePosted":"\d+"/ig);
	if (dates == null) {
		log("cannot find any dates");
	}
  //default: type == 'normal'
	var e2 = $('div.photo-list-photo-view');
  //2024.08.15: apply to new album page
  if (type == 'album')
  {
    e2 = $('div.photo-card-view div.foot');
  }
  log("Number of photo in this page: "+e2.length);
	for (var index = 0; index < e2.length; index++) {
		var e = $(e2[index]);
		if (e.find('.myFuckingLink').filter(':first').length > 0) continue;
		e.html(e.html() + '<a class="myFuckingLink"></a>');
		for (var i = 0; i < imageSizeOrder.length; ++i) {
			var photo = sizes[index].match(new RegExp('"' + imageSizeOrder[i] + '".*?:{"displayUrl":"([^"]+)","width":(\\d+),"height":(\\d+)', "i"));
			if (photo === null) continue;

			var b = e.find('.myFuckingLink');

			//b.attr('href', "http:" + photo[1].replace(/\\/g, "").replace(/(_[a-z])\.([a-z]{3,4})/i, '$1' + postfix + '$2'));
			//new flickr update 4/4/2019. Links now included https and are full address.
			b.attr('href', photo[1].replace(/\\/g, "").replace(/(_[0-9a-z]+)\.([a-z]{3,4})/i, '$1' + postfix + '$2'));

			var timestamp = dates[index].match(/\d+/i);
			var t = new Date((new Number(timestamp)) * 1000);
			b.attr('title', prefix + photo[2] + " x " + photo[3] + " | Upload: " + t.toLocaleDateString());

			b.html(prefix + photo[2] + " x " + photo[3]);
			break;
		}
	}
}

function action_normal_page(theType) {
	var target = $('#content')[0];
	var config = {
		childList: true,
		subtree: true,
	};
	var prevUrl = "none";
	var prevThumbLength = 0;
	var sourceCode = null;

	var action = function (x) {
    //default type == 'normal'
		var e3 = $('div.photo-list-photo-view');
    //2024.08.16: Album page is different
    if (x == 'album')
    {
        e3 = $('div.photo-card-view');
    }
		if (document.URL == prevUrl) {
			if (e3.length == prevThumbLength) return false; // number of thumbnail is not change, no need to process further
			checkAlwaysShow();
			prevThumbLength = e3.length;
			log("Number of thumb: " + prevThumbLength);
			// source code is get, use it now
			getLinkFromSource(sourceCode);
		}
		else {
			var e1 = e3.find('a').filter(':first');
			if (e1.length < 1) return false; // not found any link to valid single image page
			checkAlwaysShow();
			// get full source code for this page
			sourceCode = null;
			prevUrl = document.URL;
			var link1 = e1.attr('href');
			console.time("GetSource");
			$('#content').append('<div id="loadingIndicator" style="position:fixed;left:5px;bottom:2em;display:block;background-color:pink;border:solid;padding:3px">Getting original link<br>Please wait...</div>');
			log("Begin get source 1: " + link1);
			$.get(link1, function (data) {// process single image page source to get entry-type link
				var link2 = data.match(/<a\s+class=.+?entry-type.+?href='([^']+)/i)[1];
				link2 = link2.replace("/albums/", "/sets/");
				log("Begin get source 2: " + link2);
				$.get(link2, function (data) {// process page source to get image links
					log("Got final source: " + link2);
					console.timeEnd("GetSource");
					$('#loadingIndicator').remove();
					sourceCode = data;
					getLinkFromSource(sourceCode);
				});
			});
		}
	};
	action(theType);
	globalObserver = new MutationObserver(function (mutations, ob) {
		action(theType);
	});
	globalObserver.observe(target, config);
}

function flickr_mouseenter() {
	var e = $(this);
	if (e.find('.myFuckingLink').filter(':first').length > 0) {
		e.off('mouseenter');
		return false;
	}
	var url = e.find('a').filter(':first').attr('href');
	if (typeof url == "undefined" || url === null) return false;
	e.append('<a class="myFuckingLink">(Link loading...)</a>');
	$.get(url, function (data) {
		var photo = data.match(/"displayUrl":"([^"]+)","width":(\d+),"height":(\d+)[^}]+}}/i);
		var link = photo[1].replace(/\\/g, "").replace(/(_[0-9a-z]+)\.([a-z]{3,4})/i, '$1' + postfix + '$2');
		var text = prefix + photo[2] + " x " + photo[3] + " Upload: ";
		var b = e.find('.myFuckingLink');
		b.attr('href', link);
		b.attr('title', text);
		b.html(text);
	});
}

function action_hover_page() {
	var target = $('body')[0];
	var config = {
		childList: true,
		subtree: true,
	};
	var prevLength = 0;
	globalObserver = new MutationObserver(function (mutations, ob) {
		var e = $('div.photo-list-photo-view');
		if (e.length == prevLength) return false; // no new Thumbnail, don't do anything
		log("Number of thumb: " + e.length);
		prevLength = e.length;
		checkAlwaysShow();
		e.mouseenter(flickr_mouseenter);
	});
	globalObserver.observe(target, config);
}

function pageType() {
	var t = "none";
	var htmlClass = $('html').attr('class');
	console.log("HTML class: " + htmlClass);
	if (htmlClass.match(/html-photo-page.+scrappy-view/i) !== null) t = 'single';
	else if (htmlClass.match(/html-(search-photos-unified|group-pool)-page-view/i) !== null) t = 'hover';
	else if ($('div.photo-list-photo-view').filter(':first').length > 0) t = 'normal';
  else if ($('div.photo-list-view').filter(':first').length > 0) t = 'album';
	console.log("Page type: " + t);
	return t;
}

var prevType = "none";
var type = "none";
var oldUrl = "none";
var count = 0;

function kickStart() {
	oldUrl = document.URL;
	type = pageType();
	getSetting();
	checkAlwaysShow();
  //default type == 'normal'
	var strCss = ".myFuckingLink{position:absolute;z-index:999999;left:3px;bottom:0px;width:100%;display:block;color:white!important;} .myFuckingLink:hover{background-color:rgba(100, 100, 255,0.65)!important} .commonButton{display: inline-block;border-radius: 0.5em;margin: 0.2em;padding: 0.5em;font-size: 90%;height: fit-content;} .bigButton{background-color: lightgreen} .smallButton{background-color:pink}";
  //2024.08.16: Album page is different
  if (type == 'album')
  {
    strCss = ".myFuckingLink{position:absolute;z-index:999999;left:5px;bottom:0px;width:100%;display:block;} .myFuckingLink:hover{background-color:rgba(100, 100, 255,0.65)!important} .commonButton{display: inline-block;border-radius: 0.5em;margin: 0.2em;padding: 0.5em;font-size: 90%;height: fit-content;} .bigButton{background-color: lightgreen} .smallButton{background-color:pink}";
  }
	GM_addStyle(strCss);
	$('.myOptionBox').remove();
	$('ul.nav-menu:first').append('<li class="myOptionBox"><div style="color:pink;padding:1px"><input id="optionbox_openLink" type="checkbox"' + isChecked_openLink + 'style="margin:2px"/>Open image link in browser<br><input id="optionbox_alwaysShow" type="checkbox"' + isChecked_alwaysShow + 'style="margin:2px"/>Always show image information in Photostream</div></li>');
	$('#optionbox_openLink').change(function () {
		GM_setValue(key_openLink, $(this).prop('checked'));
	});
	$('#optionbox_alwaysShow').change(function () {
		GM_setValue(key_alwaysShow, $(this).prop('checked'));
	});
	if (type == 'single') action_single_page();
	else if (type == 'normal' || type == 'album') action_normal_page(type);
	else if (type == 'hover') action_hover_page();
}

// kickstart
log("Kickstart");

var timestamp = "1469473824";
var number = new Number(timestamp);
var t = new Date(number * 1000);
log("Time number: " + t.toLocaleDateString('vi-VN'));

kickStart();

var target = $('html')[0];
var config = {
	childList: false,
	attributes: true,
};
var observer = new MutationObserver(function (mutations, ob) {
	if (oldUrl == document.URL) return;
	if (globalObserver !== null) globalObserver.disconnect();
	kickStart();
});
observer.observe(target, config);
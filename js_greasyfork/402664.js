// ==UserScript==
// @name				Pobieramy24
// @namespace		http://tampermonkey.net/
// @version			0.14
// @description	QoL at pobieramy24
// @author			MrOne
// @grant				none
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at			document-idle
// @include			https://pobieramy24.pl/forum/*
// @downloadURL https://update.greasyfork.org/scripts/402664/Pobieramy24.user.js
// @updateURL https://update.greasyfork.org/scripts/402664/Pobieramy24.meta.js
// ==/UserScript==

var defaultTitle = document.title;
var imgHostings = ["imgur", "postimg", "gifyu", "fastpic", "ibb.co", "fwcdn.pl", "funkyimg", "tvp.pl", "liczniki.org", "wordpress.com", "imgbox.com"];
var fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval(function() {
	if (this.lastPathStr !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash)) {
		this.lastPathStr = location.pathname;
		this.lastQueryStr = location.search;
		this.lastHashStr = location.hash;
		gmMain();
	}
}, 111);

function gmMain() {
	defaultTitle = defaultTitle.replace("P24Team - Filmy ","");
	defaultTitle = defaultTitle.replace("P24Team - ","");
	defaultTitle = defaultTitle.replace("Nasze ","");
  var pageHeader = document.getElementsByClassName("ipsPageHeader ipsClearfix")[0];
  pageHeader.id = "scroll";
  window.location.hash = 'scroll';
	var topicList = document.getElementsByClassName("cTopicList")[0];
	var newItems = topicList.getElementsByClassName("ipsDataItem ipsDataItem_responsivePhoto ipsDataItem_unread");
	if (newItems.length > 0) {
		document.title = "[" + newItems.length + "] " + defaultTitle;
	} else {
		document.title = defaultTitle;
	}
	//console.log ('A "New" page has loaded.');
	var style = document.createElement('style');
	style.innerHTML = `
    #topicImage {
      transition:0.5s ease;
      transform-origin: left top;
      z-index: 1;
      height: 50px;
      overflow: auto;
      position: relative;
    }
    #topicImage:hover {
      transform: scale(10);
      z-index: 1;
      align-left: 100;
    }
    `;
	document.head.appendChild(style);
	var sp2 = topicList.getElementsByClassName("ipsDataItem_icon ipsPos_top");
	//console.log("Elements: " + sp2.length);
	for (var i = 0; i < sp2.length; i++) {
		//console.log(i);
		var coverLink = topicList.getElementsByClassName("ipsType_break ipsContained")[i].getElementsByTagName("a")[0].href;
		var html;
		$.ajax({
			url: coverLink,
			async: false,
			success: function(data) {
				html = data;
			}
		});
		doc = new DOMParser().parseFromString(html, "text/html");
		var cover = doc.getElementsByClassName('cPost_contentWrap ipsPad')[0].getElementsByTagName('img')[0].getAttribute("data-src");
		//console.log(cover);
		if (cover && contains(cover, imgHostings)) {
			var img = document.createElement("img");
			img.setAttribute("id", "topicImage");
			img.src = cover;
			var div = document.createElement("div");
			div.setAttribute("class", "ipsDataItem_main");
			div.setAttribute("style", "width:auto !important;");
			div.appendChild(img);
			sp2[i].insertAdjacentElement('afterend', div);
		}
	}
}

function contains(target, pattern) {
	var value = 0;
	pattern.forEach(function(word) {
		value = value + target.includes(word);
	});
	return (value === 1)
}
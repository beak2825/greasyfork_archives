// ==UserScript==
// @name        巴哈姆特哈拉開圖器 fixed
// @description	直接顯示巴哈姆特哈啦區文章的圖片和影片。跳過站外連結警告。
// @namespace   eight04.blogspot.com
// @include     http://forum.gamer.com.tw/*
// @include     https://forum.gamer.com.tw/*
// @version     1.3.0
// @author		akiratw
// @contributor	eight04 <eight04@gmail.com> (https://github.com/eight04)
// @homepage	https://github.com/eight04/baha-embed-images
// @supportURL	https://github.com/eight04/baha-embed-images/issues
// @license		MIT
// @compatible	firefox
// @compatible	chrome
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/28759/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E6%8B%89%E9%96%8B%E5%9C%96%E5%99%A8%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/28759/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E6%8B%89%E9%96%8B%E5%9C%96%E5%99%A8%20fixed.meta.js
// ==/UserScript==

/* globals getCookie */

if (getCookie("ckForumLegend") == "yes") {
	displayImage();
	displayYouTube();
}
redirectLinks();

function redirectLinks() {
    var links = document.querySelectorAll('a'),
        regex = /.*redir\.php\?url=(.+)/i;

    for (var i = links.length - 1; i >= 0; i--) {
        var link = links[i],
            url = link.getAttribute('href');

        if (regex.test(url)) {
            link.setAttribute(
                'href',
                decodeURIComponent(url.replace(regex, '$1'))
            );
        }
		if (link.onclick && link.matches("#BH-master article a")) {
			link.onclick = null;
		}
    }
}

function displayYouTube() {
    var links = document.querySelectorAll('a'),
        regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/i;

    for (var i = links.length - 1; i >= 0; i--) {
        var link = links[i],
            url = link.getAttribute('href');
			
		if (!url) continue;
		
		var matches = url.match(regex);

        if (matches) {
            url = '//www.youtube.com/embed/' + matches[1];
            var iframe = document.createElement('iframe');
            iframe.setAttribute('width', '560');
            iframe.setAttribute('height', '315');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('src', url);
            link.parentNode.replaceChild(iframe, link);
        }
    }
}

function displayImage() {
	var links = document.querySelectorAll('a'),
		limit = 3;
		
	links = Array.from(links);
	
	while (limit--) {
		deque();
	}
	
	function deque() {
		var link = links.shift();
		
		if (!link) return;
		
        var src = link.id || link.href;
            
		if (!/(\.gif|\.jpg|\.jpeg|\.png|\.bmp)/i.test(src) || !/圖片|開圖/.test(link.textContent)) {
			return deque();
		}
		
		var img = new Image;
		img.src = src;
		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleLoad);
		
		link.innerHTML = "";
		link.onclick = null;
		link.target = "_blank";
		link.appendChild(img);
		link.classList.remove("image-load");
	}
	
	function handleLoad(e) {
		e.target.removeEventListener("load", handleLoad);
		e.target.removeEventListener("error", handleLoad);
		return deque();
	}
}

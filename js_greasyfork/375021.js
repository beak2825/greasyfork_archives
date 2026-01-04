// ==UserScript==
// @name        复制spotify歌曲名
// @name:zh     复制spotify歌曲名
// @name:en     print(copy) spotify song names
// @namespace   https://greasyfork.org/users/129338
// @version      1.1
// @description  打印出网页中spotify的歌曲名，以复制
// @description:en  print song names of spotify's playlist.
// @author       Jeffrey.Deng
// @match        http://open.spotify.com/*
// @match        https://open.spotify.com/*
// @downloadURL https://update.greasyfork.org/scripts/375021/%E5%A4%8D%E5%88%B6spotify%E6%AD%8C%E6%9B%B2%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/375021/%E5%A4%8D%E5%88%B6spotify%E6%AD%8C%E6%9B%B2%E5%90%8D.meta.js
// ==/UserScript==

// @weibo       http://weibo.com/3983281402
// @blog        https://imcoder.site

// 1.1 2020.03.19 fixed bug，请在页面完全加载后执行 printList(); 不然会报  Cannot read property 'querySelectorAll' of null

(function() {
    'use strict';

    // Your code here...
    var printList = function () {
        var nodes = document.querySelector('#main .tracklist-container .tracklist').querySelectorAll("div > li > div.tracklist-col.name > div > div");
		if (!nodes) {
			console.warn("not find the songs nodes!!");
			return;
		}
		var playList = [];
		var song = function(_title, _singer) {
			this.title = _title;
			this['singer • album'] = _singer;
		};
		var len = nodes.length;
		for (var i = 0; i < len; i += 2) {
			var one = new song(nodes[i].innerText, nodes[i+1].innerText.replace(/\n/g, ' '));
			playList.push(one);
		}
		console.table(playList);
    }
    unsafeWindow.printList = printList;
    console.log("Now, you can type \"printList();\" in console, then will get the song names");
})();
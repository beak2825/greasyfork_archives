// ==UserScript==
// @name           Extract Video for GomTV
// @description    Extract video for GomTV
// @match *://gox.gomtv.com/*
// @match *://www.gomtv.com/*
// @match *://toptoon.com/*
// @version 0.0.1.20200316110826
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/33117/Extract%20Video%20for%20GomTV.user.js
// @updateURL https://update.greasyfork.org/scripts/33117/Extract%20Video%20for%20GomTV.meta.js
// ==/UserScript==

(function() {
	function ExtractGomTVDownLink(url) {
		var tag = document.getElementsByTagName("ref");
		for(var i = 0; i < tag.length; ++i) {
			var retn = Array();
			var link = tag[i].getAttribute("href");
			link = link.replace(/&level_flag=\d+?&/gi, "&level_flag=256&");
			link = link.replace(/&player=.+?&/gi, "&player=HTML5&");
			link = link.replace(/&isfree=\d+?&/gi, "&isfree=1&");
			link = link.replace(/&preview=\d+?&/gi, "&preview=0&");
			link = link.replace(/&end_sec=\d+?&/gi, "&end_sec=0&");
			retn[0] = "use ffmpeg";
			retn[1] = link;
			ShowResult(retn, "");
		}
	}

	function ExtractGomTV(url) {
		var retn = Array();
		var liveNum = /([^\/]\d+?)$/.exec(url);
		if(liveNum !== null) {
			var gomData = "mode=play&contentsid=" + liveNum[1] + "&player=FLASH&screen=2&vieworder=1&isvrix=1";
			retn[0] = "open the new tab";
			retn[1] = "http://gox.gomtv.com/cgi-bin/gox_play.cgi?" + gomData;
		} else {
			retn[0] = "error";
			retn[1] = "";
		}
		ShowResult(retn, "");
	}

	function addimg(url, savename) {
		var downbtn = document.createElement('a');
		downbtn.setAttribute('href', url+"&title="+encodeURIComponent(savename).replace(/'/g, "%27"));
		downbtn.setAttribute('download', savename);
		downbtn.setAttribute('style', 'display:block;margin-left:50px;font-size:12pt;');
		downbtn.innerText = savename;

		var savepage = document.getElementById('savepage');
		if(savepage === undefined || savepage === null)
		{
			savepage = document.createElement('div');
			savepage.setAttribute('id', 'savepage');
			savepage.setAttribute('style', 'width:100%;position:absolute;z-index:1000;margin-top:65px;');
			document.body.parentElement.insertBefore(savepage, document.body);
		}
		savepage.appendChild(downbtn);
	}

	function savetoon(url) {
		var filename = "";

		if (/gmtv.aspw/g.test(url)) {
			var title = document.getElementsByClassName('title');
			var maintitle = title[0].textContent;

			var desc = document.getElementsByClassName('desc');
			var ep = desc[0].textContent;

			filename = maintitle + ' ' + ep;
		}
		else if (/toptoon.com/g.test(url)) {
			var title = document.getElementsByClassName('comic_title');
			var maintitle = title[0].textContent;

			var desc = document.getElementsByClassName('episode_title');
			var ep = desc[0].textContent;

			var sub = document.getElementsByClassName('episode_subtitle');
			var subtitle = sub[0].textContent;

			filename = maintitle + ' ' + ep + ' ' + subtitle;
		}

		filename = filename.replace(/[\\\/:\*\?"<>\|]/, "_");

		var page = 1;
		var imglist = document.getElementsByClassName('c_img');
		[].forEach.call(imglist, function (el) {
			var img = el.getElementsByTagName('img');
			[].forEach.call(img, function (el) {
				addimg(el.src, filename + '_' + page + '.jpg');
				++page;
			});
		});
	}

	function start() {
		var url = document.location.href;
		var extractFunc = null;
		if (/gox.gomtv.com/g.test(url))
			extractFunc = ExtractGomTVDownLink;
		else if (/www.gomtv.com/g.test(url))
			extractFunc = ExtractGomTV;
		else if (/toptoon.com/g.test(url))
			extractFunc = savetoon;

		extractFunc(url);

		// delete ad
		var ad = document.getElementsByClassName("g_adplayer");
		for(var i = 0; i < ad.length; ++i)
		{
			ad[i].outerHTML = "";
		}
	}

	function ShowResult(results, color) {
		var status;
		var extractLink;
		if(color === "")
			color = "white";
		if (results.length === 0) {
			status = "Parse error...";
			extractLink = "Not found...";
		} else {
			status = results[0];
			extractLink = results[1];
		}
		var trends_dom = document.createElement('div');
		var title_dom = document.createElement('strong');
		title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; height:23px; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
			'<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: pink; font: 12px Meiryo;">' + status + '</div>',
			'<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + '; font: 12px Meiryo;"><a href="' + extractLink + '">' + extractLink + '</div>',
			'</div>'
		].join(' ');

		trends_dom.appendChild(title_dom);
		trends_dom.style.cssText = [
			'background-color: cornflowerblue;',
			'color: #000;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:1000;',
			'width:100%;',
			'height:24px;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
		].join(' ');
		document.body.style.cssText = 'position: relative; margin-top: 45px';
		document.body.parentElement.insertBefore(trends_dom, document.body);
	}

	start();
})();
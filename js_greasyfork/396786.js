// ==UserScript==
// @name         信管网辅助插件
// @namespace    https://github.com/sarentumulus/TamperMonkey-Scripts/
// @version      1.0.3
// @description  为信管网注册学员下载课件、直播视频及打印课后习题报告提供辅助功能
// @icon         https://www.cnitpm.com/favicon.ico
// @author       柒默然
// @license      MIT
// @match        *://www.cnitpm.com/pm1/*.html
// @match        *://www.ruantiku.com/xg/exam/ExamMAMResult.aspx?sid=*
// @match        *://www.cnitpm.com/live/play.aspx*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396786/%E4%BF%A1%E7%AE%A1%E7%BD%91%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/396786/%E4%BF%A1%E7%AE%A1%E7%BD%91%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _pageUrl = window.location.href;

    var _logSeqs = {};
    Object.defineProperties(_logSeqs, {
    	_index: {
    		writable: true,
    		value: 0
    	},
    	_increment: {
    		writable: true,
    		value: 1
    	},
    	sequence: {
    		get: function(){
    			return this._index += this._increment;
    		}
    	}
    });

    var _pageLog = {};
    Object.defineProperties(_pageLog, {
    	logHeadText: {
    		writable: true,
    		value: 'itpm.log.'
    	},
    	log: {
    		get: function(){
    			return this.logHeadText + (Array(2).join('0')
    				+ _logSeqs.sequence.toString()).slice(-2) + ' : ';
    		}
    	}
    });

    var _pageLst = {
    	pattern: {
    		live:'^(http|https)\\:\\/{2}w{3}\\.cnitpm\\.com\\/live\\/.*play\\.aspx.*',
    		courseware:'^(http|https)\\:\\/{2}w{3}\\.cnitpm\\.com\\/pm1\\/\\d+\\.html$',
    		exercises:'^(http|https)\\:\\/{2}w{3}\\.ruantiku\\.com\\/xg\\/exam\\/ExamMAMResult\\.aspx.*'
    	}
    };

    var _pageEvt = {
    	PlayerInitialized: function(e){
    		if(e.path[e.path.length - 1]!=null && typeof(e.path[e.path.length - 1])!='undefined'){
    			var wndObj = e.path[e.path.length - 1];
    			// display the detail info of current video file
    			if(typeof(wndObj.player)!='undefined' && typeof(wndObj.player.HTML5)!='undefined'
    				&& typeof(wndObj.player.HTML5.videoInfo)!='undefined'){
	    			// release EventListener
	    			wndObj.document.querySelector('#plv').removeEventListener('DOMNodeInserted', 
	    				_pageEvt.PlayerInitialized, true);
	    			// analysis and print video details
    				var ph5Obj = wndObj.player.HTML5;
    				console.log(_pageLog.log + 'argPid: ' + ph5Obj.pid);
    				console.log(_pageLog.log + 'argVid: ' + ph5Obj.vid);
    				console.log(_pageLog.log + 'Video Title: ' + ph5Obj.videoInfo.title);
    				console.log(_pageLog.log + 'Video Link: '  + ph5Obj.videoInfo.videolink);
    				console.log(_pageLog.log + 'HLS SOURCE: '  + ph5Obj.videoInfo.mp4[0]);
    				console.log(_pageLog.log + 'HLS INDEX: '  + ph5Obj.videoInfo.hlsIndex);
    				console.log(_pageLog.log + 'HLS TS: '  + ph5Obj.videoInfo.hls[0]);
    				console.log(_pageLog.log + 'M3U8 URL: '  + ph5Obj.videoInfo.hls[0] + '?pid='
    					+ ph5Obj.pid + '&device=desktop');
	    			console.log('+-----------------------------------------------------------------------------+');
	    			console.log(_pageLog.log + 'try downloading...');
	    			// generate correct download url with user's arguments
	    			var targetUrl = ph5Obj.videoInfo.hls[0] + '?pid=' + ph5Obj.pid + '&device=desktop';
	    			// put the download url to system clipboard
	    			GM_setClipboard(targetUrl);
	    			console.log(_pageLog.log + 'the m3u8 link address of the video has been copied'
	    				+ ' to the system clipboard.');
	    			// make sure
	    			var rsu = confirm('M3U8下载连接已经复制到剪贴板中，需要将该文件下载至本地保存吗？');
	    			// try to download target video
	    			if(rsu){
		    			GM_download({
		    				url: targetUrl,
		    				name: ph5Obj.videoInfo.title + '.m3u8',
		    				onload: function(){
		    					console.log(_pageLog.log + 'finished.');
		    				},
		    				onerror: function(){
		    					console.log(this.error);
		    				},
		    				saveAs: true
		    			});
	    			}else{
	    				console.log(_pageLog.log + 'current task has been canceled.');
	    			}
	    			// the end of processing
	    			console.log('+-----------------------------------------------------------------------------+');
    			}
    		}
    	}
    };

    console.clear();
    console.log(_pageLog.log + 'processing start.');

    var rxpObj;	// The RegExp object is used for matching text with a pattern.

    rxpObj = new RegExp(_pageLst.pattern.live, 'i');

    if(rxpObj.test(_pageUrl)){
    	if(window.frames.length>0 && typeof(window.frames[0])!='undefined'){
    		window.frames[0].addEventListener('DOMContentLoaded', function(e){
    			var wndObj = e.target.defaultView;
    			console.log('+-------------------------------- VIDEO INFO ---------------------------------+');
    			console.log(_pageLog.log + 'Origin: ' + wndObj.origin);
    			console.log(_pageLog.log + 'Url: '    + wndObj.location.href);
    			console.log(_pageLog.log + 'Path: '   + wndObj.location.pathname);
    			console.log(_pageLog.log + 'Search: ' + wndObj.location.search);
    			console.log('+-----------------------------------------------------------------------------+');
    			wndObj.document.querySelector('#plv').addEventListener('DOMNodeInserted',
    				_pageEvt.PlayerInitialized, true);
    		}, true);
    	}
    }

    rxpObj = new RegExp(_pageLst.pattern.courseware, 'i');

    if(rxpObj.test(_pageUrl)){
    	console.log('+-------------------------------- COURSEWARE URL -----------------------------+');
    	document.onreadystatechange = function(){
    		if(window.document.readyState == 'complete'){
    			// get the maxmium number of pages first and try to use it to get
    			// the maxmium number of pictures.
    			var pageLst = document.getElementsByClassName('nextpage');
    			if(pageLst!=null && typeof(pageLst)!='undefined' && pageLst.length>0){
    				var pageLnk = pageLst[0].getElementsByTagName('a');
    				var pageNum = pageLnk[pageLnk.length-1].innerText.replace(new RegExp('\\D', 'ig'), '');
    				console.log(_pageLog.log + 'The maxmium number of pages is ' + pageNum.toString());
    				var pageIdx = parseInt(pageNum) - 1;
    				var pageUrl = _pageUrl.replace('.html', '_' + pageIdx.toString() + '.html');
    				console.log(_pageLog.log + 'The url of last page: ' + pageUrl);
    				// try to get the content of last page
    				var xhr = new XMLHttpRequest();
    				xhr.onload = function(){
    					console.log('+---------------------------- COURSEWARE DOWNLOADING -------------------------+');
    					var domObj = xhr.response;
    					var imgContainer = domObj.getElementsByClassName('newcon');
    					// try to download all the pictures of the courseware
    					if(imgContainer!=null && typeof(imgContainer)!='undefined' && imgContainer.length>0){
    						var imgList = imgContainer[0].getElementsByTagName('img');
    						if(imgList.length>0 && imgList[0].hasAttribute("src")){
    							var rxpMatch = imgList[imgList.length - 1].src.match(new RegExp('^(?:http|https).*'
    								+ '(?<=img=)(.*)(?<=\\/)(\\w+)-(\\d+)\\.(jpg|jpeg|png)$', 'i'));
    							var maxCount = parseInt(rxpMatch[3]);	// the maxmium number of the pictures
    							var targetFile;
    							// try to download all the pictures
    							for(var i=1; i<=maxCount; i++){
    								targetFile = 'http://www.cnitpm.com/user/imgshow.aspx?type=1&img=' + rxpMatch[1]
    									+ rxpMatch[2] + '-' + i.toString() + '.' + rxpMatch[4];
    								console.log(_pageLog.log + 'start download : ' + targetFile);
    								GM_download({
    									url: targetFile,
    									name: rxpMatch[2] + '-' + i.toString() + '.' + rxpMatch[4],
    									saveAs: false
    								});
    							}
    						}
    					}
    					// the end of processing
    					console.log('+-----------------------------------------------------------------------------+');
    				}
    				xhr.onreadystatechange = function(){
    					if(xhr.readyState === 4 && xhr.status === 200){
    						console.log(_pageLog.log + 'request finished, now try resolving the response data...');
    					}
    				};
    				xhr.open('GET', pageUrl, true);
    				xhr.setRequestHeader('Content-Type', 'text/html');
    				xhr.responseType = 'document';
    				xhr.withCredentials = true;
    				xhr.send();
    			}
    		}
    	};
    }

    rxpObj = new RegExp(_pageLst.pattern.exercises, 'i');

    if(rxpObj.test(_pageUrl)){
    	console.log('+-------------------------------- PRINT REPORT -------------------------------+');
    	// processing start
    	window.onbeforeprint = function(){
    		var rNode;
    		// try to remove the content on top and bottom from page
    		rNode = document.querySelectorAll("div.ruantop");
    		if(typeof(rNode)!="undefined" && rNode.length>0){ rNode[0].remove(); }
    		rNode = document.getElementById("content2");
    		if(rNode!=null && typeof(rNode)!="undefined"){ rNode.remove(); }
    		// logging
    		console.log(_pageLog.log + 'the content of top and bottom has been removed from the page.');
    		// the end of processing
    		console.log('+-----------------------------------------------------------------------------+');
    	};
    }

})();
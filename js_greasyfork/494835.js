// ==UserScript==
// @name         USTC回放优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化USTC课程的回放视频
// @author       H-OH
// @match        https://incast.v.ustc.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494835/USTC%E5%9B%9E%E6%94%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494835/USTC%E5%9B%9E%E6%94%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	"use strict";
	let key=window.location.href;
	let data=GM_getValue(key,-1);
	let observer=new MutationObserver(mutations=>
		mutations.forEach(mutation=>
		{
			let id=mutation.target.id;
			if(!(/instructor\d+_html5_api/.test(id)&&mutation.target.src)) return;
			let video=document.getElementById(id);
			let src=video.getAttribute("src");
			console.log(src);
			let container=document.getElementById("incast");
			container.style.width="100vw";
			container.style.height="100vh";

			let script=document.createElement("script");
			script.type="text/javascript";
			script.src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js";
			script.onload=()=>new Artplayer(
				{container:"#incast",url:src,volume:1,fullscreen:true},
				function onReady()
				{
					this.currentTime=data;
					setInterval(()=>GM_setValue(key,this.currentTime),1000);
				}
			);
			document.body.appendChild(script);

			observer.disconnect();
		})
	);

	observer.observe(document.body,{subtree:true,attributeFilter:["src"]});
})();
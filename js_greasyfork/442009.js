// ==UserScript==
// @name         Inoreader Auto-Load Full Article By Selected Sites
// @namespace    lcomplete
// @version      1.0
// @description  Automatically load full content by selected sites when opening an article in Inoreader; 提升 Inoreader 的使用体验，根据选择的网站决定在阅读时是否自动加载全文。
// @author       lcomplete
// @match        https://www.inoreader.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442009/Inoreader%20Auto-Load%20Full%20Article%20By%20Selected%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/442009/Inoreader%20Auto-Load%20Full%20Article%20By%20Selected%20Sites.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
	//----- configure (change as desired) -----
	const excludedSources = ['The Associated Press']; //subscriptions to exclude from auto-load
	const waitTime = 200; //time in ms to wait for page load (1 sec: 1000ms)
	//-----------------------------------------

	loadFullArticle();
	window.onpopstate = loadFullArticle;
    let tm;

	function loadFullArticle() {
		if (window.location.pathname.includes('article/')) {
            let selectedArticle;
            document.querySelectorAll(`.article_current a`).forEach(a => {
                if (!selectedArticle && a.href.startsWith(`http`)) {
                    selectedArticle = a;
                }
            });
            if(!selectedArticle){
                return;
            }
            let rawHref = selectedArticle.href;
            let sites = ["sspai.com","tech.meituan.com"];
            let autoLoad = false;
            for(var i=0;i<sites.length;i++){
                if(rawHref.indexOf(sites[i])>0){
                    autoLoad=true;
                    break;
                }
            }
            if(!autoLoad){
                return;
            }

            if(tm){
                clearTimeout(tm);
            }

			setTimeout(() => {
				try {
					const source = document.getElementsByClassName('boldlink')[0];
					const button = document.getElementsByClassName('icon-button-mobilize-empty')[0];
					if (!excludedSources.includes(source.innerHTML.trim())) {
						button.click();
					}
				} catch (err) {
					console.log('page has not loaded');
				}
			}, waitTime);
		}
	}
})();
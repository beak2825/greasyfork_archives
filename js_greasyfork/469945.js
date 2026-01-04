// ==UserScript==
// @name         nhentai布局优化
// @namespace    https://greasyfork.org/zh-CN/scripts/469945
// @version      0.7
// @description  优化页面布局
// @author       雷锋
// @match        http*://nhentai.net/*
// @match        http*://nhentai.antecer.com/*
// @icon         http://nhentai.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469945/nhentai%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469945/nhentai%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async () => {
	let Sleep = (millisecond) => new Promise((resolve) => setTimeout(resolve, millisecond));
	// 优化翻页按钮布局
	(async () => {
		while (!document.querySelector('.pagination')) await Sleep(200);
		var htmlLabelPG = '';
		var htmlLabelFL = '';
		document.querySelectorAll('.pagination>a').forEach((node) => {
			node.classList.contains('page') ? (htmlLabelPG += node.outerHTML) : (htmlLabelFL += node.outerHTML);
		});
		if (!htmlLabelFL.includes('first')) htmlLabelFL = '<a></a><a></a>' + htmlLabelFL;
		if (!htmlLabelFL.includes('last')) htmlLabelFL = htmlLabelFL + '<a></a><a></a>';
		document.querySelector('.pagination').innerHTML = `
        <style>.menutab{display:flex;justify-content:space-between;}</style>
        <div class="menutab">${htmlLabelPG}</div>
        <div class="menutab">${htmlLabelFL}</div>
        <div class="ios-mobile-webkit-bottom-spacing">&nbsp;&nbsp;</div>
        `;
        console.log(`已优化布局`, location.href);
	})();

	// 优化阅览体验
	(async () => {
		while (!document.querySelector('.thumb-container img')) await Sleep(200);

		document.querySelectorAll('.thumb-container a').forEach((node) => {
            node.setAttribute('src-href', node.href);
            node.removeAttribute('href');
        });

		document.querySelectorAll('.thumb-container img').forEach((img) => {
			let src = img.getAttribute('data-src').replace(/\/t(\d+)/, '/i$1').replace(/t(\.[a-z]+)+$/, '$1').replace(/webp.webp$/,'webp');
            let url = new URL(src);
            url.hostname = url.hostname.replace('nhentai.net', location.hostname);
			img.setAttribute('data-src', url);
			if (img.src.startsWith('https://t')) img.src = url;
		});
		document.body.insertAdjacentHTML('beforeend', `<style>.thumb-container, .thumb-container img {width: 100%;height: auto;}</style>`);
        console.log(`已优化页面`, location.href);
	})();

    (async () => {
        while (true){
            await Sleep(100);
            document.querySelectorAll('[style*="height:100%"]').forEach((node)=>{
                node.visibility = 'hidden';
                node.style.display = 'none';
            });
            document.querySelectorAll('[class*="ts-im-container"]').forEach((node)=>{
                node.visibility = 'hidden';
                node.style.display = 'none';
            });
            document.querySelectorAll('.advertisement').forEach((node)=>{
                node.visibility = 'hidden';
                node.style.display = 'none';
            });
        }
    })();
})();

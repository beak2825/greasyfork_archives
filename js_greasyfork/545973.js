// ==UserScript==
// @name               JanitorAI Proxy Checker
// @name:zh-CN         JanitorAI 代理检查器
// @name:ja            JanitorAI プロキシチェッカー
// @name:es            JanitorAI Comprobador de proxy
// @name:nl            JanitorAI Proxy-checker
// @namespace          http://tampermonkey.net/
// @version            2025-08-23
// @description        Marks characters as proxy-compatible or not primarily in search.
// @description:zh-CN  将角色标记为是否兼容代理（主要在搜索中）。
// @description:ja     主に検索で、キャラクターがプロキシ対応かどうかを表示します。
// @description:es     Marca si los personajes son compatibles con proxies o no, principalmente en la búsqueda.
// @description:nl     Maakt zichtbaar of karakters proxy-compatibel zijn of niet, voornamelijk in de zoekfunctie.
// @author             https://github.com/xskutsu
// @match              *://janitorai.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @license            GNU AGPLv3
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/545973/JanitorAI%20Proxy%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/545973/JanitorAI%20Proxy%20Checker.meta.js
// ==/UserScript==

void !(function () {
	"use strict";
    const proxyAllowedForKey = "paf_cache_";
	async function proxyAllowedFor(characterURL) {
        const key = proxyAllowedForKey + characterURL;
        const cache = GM_getValue(key);
        if (cache) {
            const { allowed, timestamp } = JSON.parse(cache);
            if (Date.now() - timestamp < 86400000) {
                return { allowed: allowed, cached: true };
            }
        }
		const response = await fetch(characterURL);
		const page = await response.text();
		const allowed = page.includes("<div>proxy allowed</div>");
        GM_setValue(key, JSON.stringify({ allowed: allowed, timestamp: Date.now() }));
        return { allowed: allowed, cached: false };
	}
	setInterval(async function () {
		const characterCardElements = [...document.querySelectorAll(".profile-character-card-stack-link-component")];
		for (let i = 0; i < characterCardElements.length; i++) {
			const element = characterCardElements[i];
            if (!document.body.contains(element)) {
                continue;
            }
			if (element.getAttribute("proxy-checked") === null) {
				element.setAttribute("proxy-checked", "yes");
				const titleElement = element.children[0].children[0];
                const result = await proxyAllowedFor(element.href);
				if (result.allowed) {
					titleElement.textContent = "✅" + titleElement.textContent;
				} else {
					element.parentElement.parentElement.style.opacity = 0.25;
					titleElement.textContent = "❌" + titleElement.textContent;
				}
				if (!result.cached) {
                    await new Promise(r => setTimeout(r, 100));
                }
			}
		}
	}, 2500);
})();
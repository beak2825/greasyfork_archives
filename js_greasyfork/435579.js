// ==UserScript==
// @name         PTT 相關網站自動轉址到 pttweb.cc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  PTT相關網站，自動轉跳到 www.pttweb.cc
// @author       RzChan
// @match        *://www.ptt.cc/bbs/*
// @match        *://ptthito.com/*
// @match        *://disp.cc/b/*
// @icon         https://www.google.com/s2/favicons?domain=ptt.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435579/PTT%20%E7%9B%B8%E9%97%9C%E7%B6%B2%E7%AB%99%E8%87%AA%E5%8B%95%E8%BD%89%E5%9D%80%E5%88%B0%20pttwebcc.user.js
// @updateURL https://update.greasyfork.org/scripts/435579/PTT%20%E7%9B%B8%E9%97%9C%E7%B6%B2%E7%AB%99%E8%87%AA%E5%8B%95%E8%BD%89%E5%9D%80%E5%88%B0%20pttwebcc.meta.js
// ==/UserScript==

(function ()
{
	'use strict';

	const doRedirect = () =>
	{
		let pathname = window.location.pathname;
		switch (window.location.host)
		{
			case "www.ptt.cc":
				{
					break;
				}
			case "ptthito.com":
				{
					pathname = pathname.replaceAll("-", ".");
					const secondPathReg = new RegExp(/(?<=\/.+\/.*).+(?=.*\/)/g);
					const secondPath = secondPathReg.exec(pathname)[0];
					pathname = pathname.replace(/(?<=\/.+\/.*).+(?=.*\/)/g, secondPath.toUpperCase())
					pathname = pathname.replace(/\/$/g, "");
					pathname = `/bbs${pathname}`;
					break;
				}
			case "disp.cc":
				{
					const linkElement = document.evaluate("//span[contains(text(),'※ 文章網址: ')]/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					if (linkElement !== null)
					{
						const link = linkElement.href;
						link = link.replace("www.ptt.cc", "www.pttweb.cc");
						window.location.href = link;
					}
					return;
				}
		}

		window.location.href = `https://www.pttweb.cc${pathname}`;
	}
	doRedirect();
})();
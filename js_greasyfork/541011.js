// ==UserScript==
// @name 			ESJZoneCoverImgSrcRedirect
// @name:zh-TW 		ESJZone 封面重新導向
// @name:zh-CN 		ESJZone 封面重新导向
// @namespace 		https://greasyfork.org/scripts/541011
// @version 		0.1.5.1
// @description 		Try to reduce the network traffic with img-proxy (wsrv.nl) on ESJZone (Gallery-View).
// @description:zh-TW 	試著在 ESJZone (圖庫模式)上利用圖片代理服務(wsrv.nl)來減少網路流量。
// @description:zh-CN 	尝试在 ESJZone (图库模式)上利用图片代理服务(wsrv.nl)来减少网络流量。
// @author 			DarkRover
// @include 		/^https?:\/\/(?:[^\/\.]+\.){0,}esjzone\.(?:cc|me|one)(?:\:[0-9]+)?(?:\/(?:|(?:(?:update|list|tags)[^\/\?#]*)(?:[\/\?#].*))?)?$/
// @run-at 			document-end
// @grant 			none
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/541011/ESJZoneCoverImgSrcRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/541011/ESJZoneCoverImgSrcRedirect.meta.js
// ==/UserScript==
(function() {
	'use strict';
	if (window.ESJZoneCoverImgSrcRedirect) return;
	else window.ESJZoneCoverImgSrcRedirect = true;
	let myDbMsgLv = 0; // ## Debug-Message;
	function myMain(){
		const ESJZoneLogoSrc = 'img.kookapp.cn/assets/2023-01/rhv1ugUjQw0dd0ef.png';
		// ## ===[Separator/]===
		const myExcludeCol = [
			/^wsrv\.nl/i,
			/*-
			/^i\.imgur\.com/i,
			/^telegra\.ph/i,
			// ## ===[Separator/]===
			/static\.zerochan\.net/i,
			/m\.media-amazon\.com/i,
			/img\.syosetu\.org/i,
			/i0\.wp\.com/i,
			/cdn\.novelupdates\.com/i,
			/i\.postimg\.cc/i,
			/img\.picgo\.net/i,
			-*/
		];
		const myProxyURL = 'https://wsrv.nl';
		const myDefaultImgOp = [
			'1', // ## Redirects to the original image when there is a problem loading an image.
			encodeURIComponent(`wsrv.nl/?w=300&h=480&default=1&fit=cover&cbg=0000&output=webp&n=1&q=100&ll&url=${encodeURIComponent(ESJZoneLogoSrc)}`),
		][1]; /*- ## Usage of the index for `myDefaultImgOp`: 
		-*- [0]: redirects to the original image.
		-*- [1]: redirects to the ESJZone logo image.
		-*/
		const myCGIArg01Col = [
			'w=300',
			'h=480',
			`default=${myDefaultImgOp}`,
			'fit=cover',
			'cbg=0000',
			'output=webp',
			'n=1',
			'q=100',
			'll',
		];
		// ## ===[Separator/]===
		const myCSSQueryP01 = 'div.main-img >div[class*=\"lazyload\"]';
		const myCSSQSp01 = ', ';
		let myCoverCol = document.querySelectorAll([
			myCSSQueryP01 + '[data-src^=\"http\"]', 
			myCSSQueryP01 + '[data-src^=\"//\"]', 
		].join(myCSSQSp01));
		let isExcluded, myCover, mySrcURL, mySrcURLClip01;
		for (let i = 0 ; i < myCoverCol.length ; i++) {
			myCover = myCoverCol[i];
			mySrcURL = myCover.getAttribute('data-src');
			mySrcURLClip01 = mySrcURL.replace(/^(https?:)?\/\//gi, '');
			isExcluded = false;
			for (let j = 0 ; j < myExcludeCol.length ; j++) {
				if (mySrcURLClip01.search(myExcludeCol[j])>-1) {
					isExcluded ||= true;
					break;
				};
			};
			if (!isExcluded) {
				myCover.setAttribute(
					'data-src', 
					[
						myProxyURL, 
						`/?${myCGIArg01Col.join('&')}`, 
						`&url=${encodeURIComponent(mySrcURLClip01)}`, 
					].join(''), 
				);
				if (myDbMsgLv > 2) console.log(`■ mySrcURLClip01:[${encodeURIComponent(mySrcURLClip01)}]`);
			};
		};
		if (myDbMsgLv > 1) console.log(`■ myExcludeCol:[${myExcludeCol.length}]`);
		if (myDbMsgLv > 1) console.log(`■ myCoverCol:[${myCoverCol.length}]`);
	};
	myMain();
})();
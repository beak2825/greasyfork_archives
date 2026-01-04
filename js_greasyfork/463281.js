// ==UserScript==
// @name        FuckElonMusk - twitter.com
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @run-at			document-start
// @homepage		https://github.com/al0rid4l/fkElonMusk
// @grant       none
// @version     1.2
// @author      al0rid4l
// @license			GPLv3
// @description 4/5/2023, 1:19:10 AM
// @downloadURL https://update.greasyfork.org/scripts/463281/FuckElonMusk%20-%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/463281/FuckElonMusk%20-%20twittercom.meta.js
// ==/UserScript==
const preloadStyle = new CSSStyleSheet();
preloadStyle.replaceSync(`
	a[aria-label="Twitter"] > div {
		visibility: hidden!important;
	}
	#placeholder > svg {
		display: none!important;
	}
`);
const imgSrc = "data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3Etwitter-logo%3C/title%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M170.2264 442.7654c162.2648 0 251.0168-140.0367 251.0168-261.4758 0-3.9775 0-7.9371-.258-11.8788 17.2659-13.009 32.1701-29.1167 44.0148-47.5687-16.1013 7.4318-33.1817 12.3057-50.6712 14.4587 18.4168-11.4849 32.2005-29.5486 38.786-50.8295-17.3177 10.7044-36.2637 18.2483-56.0204 22.3062-27.3466-30.29-70.8-37.7036-105.9942-18.0837-35.194 19.62-53.3763 61.3941-44.351 101.8979-70.9346-3.7043-137.0242-38.6047-181.8212-96.0154-23.4157 41.9903-11.4554 95.7083 27.3136 122.6754-14.0397-.4335-27.7732-4.3786-40.0416-11.5025v1.1646c.0115 43.7452 29.6141 81.4229 70.778 90.085-12.9882 3.6897-26.6156 4.229-39.8352 1.5766 11.5575 37.4355 44.6783 63.0807 82.4224 63.8192-31.2398 25.5748-69.831 39.4584-109.564 39.4166A172.495 172.495 0 0 1 35 401.4854c40.345 26.9696 87.2885 41.275 135.2264 41.2083' fill='%231DA1F2'/%3E%3Cpath d='M35 35h430v430H35z'/%3E%3C/g%3E%3C/svg%3E%0A";
const bgStyle = size => `
	background-image: url("${imgSrc}");
	background-size: ${size};
	background-repeat: no-repeat;
	background-position: center;
`;

document.adoptedStyleSheets = [preloadStyle];
window.addEventListener('DOMContentLoaded', () => {
	// 还是会白一下...
	const loadingEl = document.getElementById('placeholder');
	if (loadingEl) {
		loadingEl.innerHTML = '';
		const blueBird = document.createElement('div');
		blueBird.style.cssText = `
		width: 72px;
		height: 72px;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
		${bgStyle('90%')}
		`;
		loadingEl.appendChild(blueBird);
	}

	// MutationObserver太卡了...不过也没必要追求立马显示
	const hdr = setInterval(() => {
		const logoXpath = document.evaluate('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[1]/div[1]/h1/a/div', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (logoXpath?.snapshotLength) {
			const logoEl = logoXpath.snapshotItem(0);
			logoEl.innerHTML = '';
			// 不记得原来的logo尺寸了, 这个大小看上去差不多就这样吧
			logoEl.style.cssText = bgStyle('80%');
			preloadStyle.replaceSync('');
			clearInterval(hdr);
		}
	}, 100);
});



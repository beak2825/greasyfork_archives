// ==UserScript==
// @name Romeo Additions Fake GPS
// @namespace https://greasyfork.org/en/users/723211-ray/
// @version 9.2.0
// @description Allows manual GPS location picking with the Romeo Additions
// @description:de Erlaubt manuelle GPS-Standortauswahl mit den Romeo Additions
// @author -Ray-
// @match *://*.romeo.com/*
// @license MIT
// @grant none
// @iconURL https://www.romeo.com/assets/favicons/711cd1957a9d865b45974099a6fc413e3bd323fa5fc48d9a964854ad55754ca1/favicon.ico
// @supportURL https://greasyfork.org/en/scripts/521311
// @downloadURL https://update.greasyfork.org/scripts/521311/Romeo%20Additions%20Fake%20GPS.user.js
// @updateURL https://update.greasyfork.org/scripts/521311/Romeo%20Additions%20Fake%20GPS.meta.js
// ==/UserScript==

let fakeGps;

function ext()
{
	str.strings["applyAsGps"] =
	{
		de: "Als GPS anwenden",
		en: "Apply as GPS",
	};

	dom.on(`div.js-side-content.layer__column.layer__column--detail.layer__column--left-nav-top-margin
		> div.layout.layout--vertical.layout--consume > div.layout-item > div.layer-actionbar`, el =>
	{
		const btApply = el.querySelector("button.js-apply");
		const btApplyGps = dom.add(el, `<button class="${btApply.classList}">${str.get("applyAsGps")}</button>`);
		btApplyGps.addEventListener("click", e =>
		{
			fakeGps = true;
			btApply.click();
		});
	});

	net.on("xhr:send", "PUT /api/v4/locations/profile", e =>
	{
		if (fakeGps)
		{
			fakeGps = false;
			e.body.sensor = true;
		}
	});
}

(window.romeoExts ??= []).push(ext);
if (window.romeo)
	ext();

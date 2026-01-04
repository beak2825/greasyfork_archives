// ==UserScript==
// @name           TC4Shell.com - Add Download Buttons for 7-Zip Plugins page
// @name:ru        TC4Shell.com - Добавьте кнопки загрузки для cтраница плагинов архиватора 7-Zip
// @description    Add download buttons to TC4Shell.com's 7-Zip plugins listing page, so one may download from the listing page directly, without opening plugin's page.
// @description:ru Добавьте кнопки загрузки на страницу списка плагинов 7-Zip TC4Shell.com, чтобы можно было загружать напрямую со страницы списка, не открывая страницу плагина.
// @namespace      RainSlide
// @author         RainSlide
// @match          *://www.tc4shell.com/en/7zip/
// @match          *://www.tc4shell.com/ru/7zip/
// @version        1.2
// @license        blessing
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/392830/TC4Shellcom%20-%20Add%20Download%20Buttons%20for%207-Zip%20Plugins%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/392830/TC4Shellcom%20-%20Add%20Download%20Buttons%20for%207-Zip%20Plugins%20page.meta.js
// ==/UserScript==

const links = document.querySelectorAll('#content a');

if (links.length > 0) {

// const pageURL = location.origin + location.pathname;
const pageURL = new URL("./", location).href;

const match = (x, arr) => arr.some( y => y === x );

const plugins = Array.from(links).filter(
	plugin => (
		plugin.href.replace(/[^/]+\/$/, "") === pageURL &&
		match(plugin.parentNode.tagName, ["H2", "P"])
	)
);

if (plugins.length > 0) {

document.head.appendChild(document.createElement("style")).textContent =
`#content h1 ~ div > h2 { display: flex; justify-content: space-between; }
.button_download_small { height: 2em; line-height: 1; padding: .5em;
	font-family: inherit; font-size: .75em; background-color: #e84c3d; }
.button_download_small:hover { background-color: #ff605f; }`;

plugins.forEach(
	plugin => {

		const pluginName = plugin.textContent.split(" ", 1)[0];

		const fileName = match(pluginName, ["Asar7z", "Lzip7z"])
			? pluginName.replace(/7z$/, "")
			: pluginName;

		const i18nMap = new Map([["en", "Download"], ["ru", "Скачать"]]);

		const download = Object.assign(
			document.createElement("a"), {
				href: "/binary/" + fileName + ".zip",
				download: "",
				textContent: i18nMap.get(location.pathname.slice(1, 3)) || "Download"
			}
		);

		switch (plugin.parentNode.tagName) {
			case "H2":
				download.className = "button button_download_small";
				plugin.after(download);
				break;
			case "P":
				plugin.after(" (", download, ")");
				break;
		}

	}
);

}

}

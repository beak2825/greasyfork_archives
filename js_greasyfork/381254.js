// ==UserScript==
// @name         IMDb Youtube Trailer Button
// @namespace    1N07
// @version      0.3.3
// @description  Youtube trailers on imdb
// @author       1N07
// @icon         https://cdn.jsdelivr.net/gh/OneNot/Userscripts@a3d6c9f0bc76a605a47ba9ccee3d0ead7a7fa3cd/IMDb%20Youtube%20Trailer%20Button/logo.png
// @icon64       https://cdn.jsdelivr.net/gh/OneNot/Userscripts@a3d6c9f0bc76a605a47ba9ccee3d0ead7a7fa3cd/IMDb%20Youtube%20Trailer%20Button/logo.png
// @license      Unlicense
// @compatible   firefox Tested on Firefox v130.0.1 with Tampermonkey 5.1.1. Likely to work on other userscript managers as well, but not tested.
// @compatible   chrome Latest version untested, but likely works with at least Tampermonkey
// @compatible   opera Latest version untested, but likely works with at least Tampermonkey
// @compatible   edge Latest version untested, but likely works with at least Tampermonkey
// @compatible   safari Latest version untested, but likely works with at least Tampermonkey
// @match        *://www.imdb.com/title/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381254/IMDb%20Youtube%20Trailer%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/381254/IMDb%20Youtube%20Trailer%20Button.meta.js
// ==/UserScript==

(() => {
	$("head").append(`
		<style>
			#ytButton,
			#ytButton:visited
			{
				position: absolute;
				bottom: 90px;
				left: 0px;
				height: 45px;
				width: 105px;
				background-color: transparent;
				border-radius: 0 10px 10px 0;
				fill: rgba(255,255,255,.3);
				z-index: 100;
			}

			#ytButton:active,
			#ytButton:hover
			{
				background-color: rgba(0,0,0,.6);
			}

			.slate_wrapper
			{
				position: relative;
			}
		</style>
	`);

	const ytsvg = `<svg height="100%" version="1.1" viewBox="0 0 67 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-21"></use><path class="ytp-svg-fill" d="M 45.09 10 L 45.09 25.82 L 47.16 25.82 L 47.41 24.76 L 47.47 24.76 C 47.66 25.14 47.94 25.44 48.33 25.66 C 48.72 25.88 49.16 25.99 49.63 25.99 C 50.48 25.99 51.1 25.60 51.5 24.82 C 51.9 24.04 52.09 22.82 52.09 21.16 L 52.09 19.40 C 52.12 18.13 52.05 17.15 51.90 16.44 C 51.75 15.74 51.50 15.23 51.16 14.91 C 50.82 14.59 50.34 14.44 49.75 14.44 C 49.29 14.44 48.87 14.57 48.47 14.83 C 48.27 14.96 48.09 15.11 47.93 15.29 C 47.78 15.46 47.64 15.65 47.53 15.86 L 47.51 15.86 L 47.51 10 L 45.09 10 z M 8.10 10.56 L 10.96 20.86 L 10.96 25.82 L 13.42 25.82 L 13.42 20.86 L 16.32 10.56 L 13.83 10.56 L 12.78 15.25 C 12.49 16.62 12.31 17.59 12.23 18.17 L 12.16 18.17 C 12.04 17.35 11.84 16.38 11.59 15.23 L 10.59 10.56 L 8.10 10.56 z M 30.10 10.56 L 30.10 12.58 L 32.59 12.58 L 32.59 25.82 L 35.06 25.82 L 35.06 12.58 L 37.55 12.58 L 37.55 10.56 L 30.10 10.56 z M 19.21 14.46 C 18.37 14.46 17.69 14.63 17.17 14.96 C 16.65 15.29 16.27 15.82 16.03 16.55 C 15.79 17.28 15.67 18.23 15.67 19.43 L 15.67 21.06 C 15.67 22.24 15.79 23.19 16 23.91 C 16.21 24.62 16.57 25.15 17.07 25.49 C 17.58 25.83 18.27 26 19.15 26 C 20.02 26 20.69 25.83 21.19 25.5 C 21.69 25.17 22.06 24.63 22.28 23.91 C 22.51 23.19 22.63 22.25 22.63 21.06 L 22.63 19.43 C 22.63 18.23 22.50 17.28 22.27 16.56 C 22.04 15.84 21.68 15.31 21.18 14.97 C 20.68 14.63 20.03 14.46 19.21 14.46 z M 56.64 14.47 C 55.39 14.47 54.51 14.84 53.99 15.61 C 53.48 16.38 53.22 17.60 53.22 19.27 L 53.22 21.23 C 53.22 22.85 53.47 24.05 53.97 24.83 C 54.34 25.40 54.92 25.77 55.71 25.91 C 55.97 25.96 56.26 25.99 56.57 25.99 C 57.60 25.99 58.40 25.74 58.96 25.23 C 59.53 24.72 59.81 23.94 59.81 22.91 C 59.81 22.74 59.79 22.61 59.78 22.51 L 57.63 22.39 C 57.62 23.06 57.54 23.54 57.40 23.83 C 57.26 24.12 57.01 24.27 56.63 24.27 C 56.35 24.27 56.13 24.18 56.00 24.02 C 55.87 23.86 55.79 23.61 55.75 23.25 C 55.71 22.89 55.68 22.36 55.68 21.64 L 55.68 21.08 L 59.86 21.08 L 59.86 19.16 C 59.86 17.99 59.77 17.08 59.58 16.41 C 59.39 15.75 59.07 15.25 58.61 14.93 C 58.15 14.62 57.50 14.47 56.64 14.47 z M 23.92 14.67 L 23.92 23.00 C 23.92 24.03 24.11 24.79 24.46 25.27 C 24.82 25.76 25.35 26.00 26.09 26.00 C 27.16 26.00 27.97 25.49 28.5 24.46 L 28.55 24.46 L 28.76 25.82 L 30.73 25.82 L 30.73 14.67 L 28.23 14.67 L 28.23 23.52 C 28.13 23.73 27.97 23.90 27.77 24.03 C 27.57 24.16 27.37 24.24 27.15 24.24 C 26.89 24.24 26.70 24.12 26.59 23.91 C 26.48 23.70 26.43 23.35 26.43 22.85 L 26.43 14.67 L 23.92 14.67 z M 36.80 14.67 L 36.80 23.00 C 36.80 24.03 36.98 24.79 37.33 25.27 C 37.60 25.64 37.97 25.87 38.45 25.96 C 38.61 25.99 38.78 26.00 38.97 26.00 C 40.04 26.00 40.83 25.49 41.36 24.46 L 41.41 24.46 L 41.64 25.82 L 43.59 25.82 L 43.59 14.67 L 41.09 14.67 L 41.09 23.52 C 40.99 23.73 40.85 23.90 40.65 24.03 C 40.45 24.16 40.23 24.24 40.01 24.24 C 39.75 24.24 39.58 24.12 39.47 23.91 C 39.36 23.70 39.31 23.35 39.31 22.85 L 39.31 14.67 L 36.80 14.67 z M 56.61 16.15 C 56.88 16.15 57.08 16.23 57.21 16.38 C 57.33 16.53 57.42 16.79 57.47 17.16 C 57.52 17.53 57.53 18.06 57.53 18.78 L 57.53 19.58 L 55.69 19.58 L 55.69 18.78 C 55.69 18.05 55.71 17.52 55.75 17.16 C 55.79 16.81 55.87 16.55 56.00 16.39 C 56.13 16.23 56.32 16.15 56.61 16.15 z M 19.15 16.19 C 19.50 16.19 19.75 16.38 19.89 16.75 C 20.03 17.12 20.09 17.7 20.09 18.5 L 20.09 21.97 C 20.09 22.79 20.03 23.39 19.89 23.75 C 19.75 24.11 19.51 24.29 19.15 24.30 C 18.80 24.30 18.54 24.11 18.41 23.75 C 18.28 23.39 18.22 22.79 18.22 21.97 L 18.22 18.5 C 18.22 17.7 18.28 17.12 18.42 16.75 C 18.56 16.38 18.81 16.19 19.15 16.19 z M 48.63 16.22 C 48.88 16.22 49.08 16.31 49.22 16.51 C 49.36 16.71 49.45 17.05 49.50 17.52 C 49.55 17.99 49.58 18.68 49.58 19.55 L 49.58 21 L 49.59 21 C 49.59 21.81 49.57 22.45 49.5 22.91 C 49.43 23.37 49.32 23.70 49.16 23.89 C 49.00 24.08 48.78 24.17 48.51 24.17 C 48.30 24.17 48.11 24.12 47.94 24.02 C 47.76 23.92 47.62 23.78 47.51 23.58 L 47.51 17.25 C 47.59 16.95 47.75 16.70 47.96 16.50 C 48.17 16.31 48.39 16.22 48.63 16.22 z " id="ytp-id-21"></path></svg>`;

	const nameElem = $("h1[data-testid='hero__pageTitle']:first");
	const name = nameElem.text().trim().replace(/\s/g, "+");
	//$("[data-testid='title-container']:first a[title]:first").prop("title").trim().replace(/\s/g, "+"); //for video page if I want to support that later

	let yearContainer = nameElem.next("ul");
	if (!yearContainer.length) {
		yearContainer = nameElem.nextUntil("ul").last().next();
	}
	const year = yearContainer
		.find("a[href*='releaseinfo']:first")
		.text()
		.trim()
		.replace(/\D/g, "");

	if (name && name.length > 0) {
		const theLink = `https://www.youtube.com/results?search_query=${name}${year?.length ? `+(${year})` : ""}+trailer`;
		const theLinkButton = `<div id="ytButton"><a href="${theLink}" target="_blank">${ytsvg}</a></div>`;

		const pos = $(".video-preference:first");
		pos.after(theLinkButton);
	}
})();

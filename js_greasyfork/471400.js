// ==UserScript==
// @name         Good MangaSee/MangaLife UI
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix shitty interphase, single page is intended
// @author       RUUKU
// @license      GPL3
// @match        https://mangasee123.com/read-online/*
// @match        https://manga4life.com/read-online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangasee123.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471400/Good%20MangaSeeMangaLife%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/471400/Good%20MangaSeeMangaLife%20UI.meta.js
// ==/UserScript==

(() => {
    const css = `
:root {
	--main-bg-color: #1d2021;
	--btn-outline-color: #6588BE;
}

.img-fluid {
	max-height: calc(100dvh - 44px);
	width: auto;
	max-width: 100% !important;
	height: unset !important;
	scroll-snap-type: y mandatory;
	scroll-snap-stop: always;
	scroll-snap-align: end;
    cursor: none;
}

.MainContainer {
	padding-bottom: 0px;
}

html {
	scrollbar-width: none;
}

.DesktopNav {
	background-color: var(--main-bg-color);
	margin-top: 0px;
}

.ImageGallery {
	margin-top: 0px !important;
    cursor: unset !important;
}

.HasGap {
    margin-top: 0px !important;
}

body,
html {
	background-color: var(--main-bg-color);
}

.btn-outline-secondary {
	color: var(--btn-outline-color);
	border-color: unset !important;
	border-width: 0px;
}

.btn-outline-secondary:hover {
	color: #fff;
	background-color: var(--btn-outline-color);
}

.top-10.DesktopNav.container > .row {
    display: none;
}

#Footer {
    display: none;
}

li.d-md-block.d-none.nav-item:nth-of-type(4) > .nav-link {
    display: none;
}

.col-lg-5 {
    display: none;
}

li.d-md-block.d-none.nav-item:nth-of-type(1) > .ng-binding.nav-link {
    display: none;
}

li.d-md-block.d-none.nav-item:nth-of-type(3) > .ng-binding.nav-link {
    display: none;
}

.ng-binding.nav-link {
    display: none;
}

`
    GM_addStyle(css)
    // const page = document.querySelector('#TopPage')
    // page.addEventListener('load', page.scrollIntoView({ behavior: "smooth", block: "end" }));

    window.addEventListener("keyup", (event) => {
        /**
         * "f": Toggles fullscreen
         */
        if (event.code === "KeyF") {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                document.documentElement.requestFullscreen()
            }
        }

        /**
         * "s": Opens current page in a new tab
         */
        if (event.code === "KeyS") {
            let current_page_src = document.querySelector(".img-fluid").src
            window.open(current_page_src, "_blank").focus()
        }

        /**
         * "c": opens current thumbnail cover of the titles entry
         */
        if (event.code === "KeyC") {
            let cover_src = document.querySelector('[property="og:image"]').content
            window.open(cover_src, "_blank").focus()
        }
    });

})();
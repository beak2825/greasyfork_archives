// ==UserScript==
// @name         PlexSpace: A KoGaMa Theme
// @namespace    discord.gg/C2ZJCZXKTu
// @version      2
// @description  A cosy yet boring dark mode theme with orange hues.
// @author       ⛧ simmy
// @match        *://*.kogama.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505810/PlexSpace%3A%20A%20KoGaMa%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/505810/PlexSpace%3A%20A%20KoGaMa%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
/* GLOBAL ROOT */
:root {
    --transition-delay: 0.4s;
    --font-family-main: 'IBMPlexSerif', serif;
    --font-spacing: 0.7em;
    --font-spacing-hover: 0.1em;
    --color-subtext: #666;
    --color-soft-subtext: #858484;
    --color-dark-subtext: #202020;
    --color-bg-dark: #171717;
    --color-bg-react: #1e1e1e;
    --color-bg-nav: #222222;
    --color-header-text: #ffb650;
    --color-react-clickable: #ffffff;
    --color-react-clickable2: #d78d25;
    --color-react-clickable2-hover: #bb781b;
    --color-react-clickable3-hover: #ffb650;
}

/* WEBSITE SURFACE FONT */
@font-face {
    font-family: 'IBMPlexSerif';
    src: url('https://cdn.jsdelivr.net/gh/IBM/plex@master/packages/plex-serif/fonts/complete/woff2/IBMPlexSerif-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

body,
p,
h1,
h2,
h3,
h4,
h5,
h6,
a,
span,
div,
input,
button,
textarea {
    font-family: var(--font-family-main) !important;
    font-weight: 500 !important;
}

body * {
    font-family: var(--font-family-main) !important;
    font-weight: 500 !important;
}

/* WEBPAGE */
body#root-page-mobile.spring,
body#root-page-mobile.summer,
body#root-page-mobile.autumn,
body#root-page-mobile.winter {
    background-image: none !important;
    background-color: var(--color-bg-dark) !important;
}
body#root-page-mobile {
    background-image: none !important;
    background-color: var(--color-bg-dark) !important;
}
.MuiPaper-root {
    background-color: var(--color-bg-react) !important;
}

._33DXe {
    background-image: none !important;
}
.zUJzi {
    background-color: var(--color-bg-react);
    color: var(--color-soft-subtext);
    border: none !important;
}
.uwn5j ._3DYYr ._28mON header {
    color: var(--color-react-clickable2) !important;
}
._375XK .F3PyX ._2XzvN {
    color: var(--color-react-clickable2) !important;
}
.uwn5j ._3DYYr ._1j2Cd {
    color: var(--color-soft-subtext);
    text-transform: uppercase !important;
}
._375XK textarea {
    background-color: var(--color-bg-react);
    color: var(--color-soft-subtext);
    border: none !important;
}
._375XK ._2XaOw ._1j2Cd p {
    background-color: var(--color-bg-nav);
    color: var(--color-subtext);
    transition: all 0.4s ease-in-out;
}
._375XK ._2XaOw ._1j2Cd p:hover {
    letter-spacing: var(--font-spacing) !important;
}
._375XK ._2XaOw ._1j2Cd._1Xzzq p {
    background-color: var(--color-bg-nav);
    color: var(--color-soft-subtext) !important;
    transition: all 0.4s ease-in-out;
}
._375XK ._2XaOw ._1j2Cd._1Xzzq p:hover {
    letter-spacing: var(--font-spacing) !important;
}
.MuiTypography-colorPrimary,
._13UrL ._23KvS ._25Vmr ._2IqY6 h1,
._13UrL ._23KvS ._25Vmr ._2IqY6 h1 a {
    color: var(--color-header-text) !important;
}

.MuiButton-containedPrimary {
    background-color: var(--color-react-clickable2) !important;
    letter-spacing: var(--font-spacing) !important;
    text-transform: uppercase !important;
    transition: all 0.4s ease-in-out !important;
}

.MuiButton-containedPrimary:hover {
    background-color: var(--color-react-clickable2-hover) !important;
    letter-spacing: var(--font-spacing-hover) !important;
}
.MuiTypography-colorTextSecondary {
    color: var(--color-react-clickable) !important;
}
.MuiTypography-colorTextSecondary:hover {
    color: var(--color-react-clickable2-hover) !important;
    text-decoration: none !important;
}
.MuiLink-underlineHover:hover {
    text-decoration: none !important;
}
.MuiButton-label {
    color: var(--color-react-clickable) !important;
    text-transform: uppercase !important;
    letter-spacing: var(--font-spacing) !important;
    transition: all 0.4s ease-in-out !important;
}
.MuiButton-label:hover {
    color: var(--color-react-clickable) !important;
    letter-spacing: var(--font-spacing-hover) !important;
}
a {
    transition: all 0.4s ease-in-out !important;
}
a:hover {
    color: var(--color-react-clickable2-hover) !important;
}
a.MuiButton-root:hover {
    color: var(--color-react-clickable2-hover) !important;
}
.MuiButton-root:hover {
    color: var(--color-react-clickable2-hover) !important;
}

.MuiButton-contained {
    background-color: var(--color-react-clickable2) !important;
    color: var(--color-dark-subtext) !important;
    transition: all 0.4s ease-in-out !important;
}

.MuiChip-root {
    background-color: var(--color-react-clickable) !important;
    text-transform: uppercase !important;
    color: var(--color-dark-subtext) !important;
    transition: all 0.4s ease-in-out !important;
}
.MuiChip-root:hover {
    background-color: var(--color-react-clickable2-hover) !important;
    color: var(--color-dark-subtext) !important;
}
body#root-page-mobile header#pageheader .pageheader-inner {
    background-color: var(--color-bg-nav) !important;
    text-transform: uppercase !important;
}
._13UrL ._23KvS ._1jTCU ._20K92 {
    font-size: 0.65em !important;
    text-transform: uppercase !important;
    color: var(--color-subtext) !important;
}
._13UrL ._23KvS ._1z4jM {
    display: none !important;
}
.MuiPaper-root h2 {
    position: relative;
    font-size: 0;
}
.icon-cancel:before {
    color: var(--color-react-clickable2-hover) !important;
}
.MuiPaper-root h2::before {
    position: absolute;
    left: 0;
    top: 0;
    content: "about";
    font-size: 1.5rem;
    text-transform: uppercase !important;
    text-align: center;
    color: var(--color-subtext) !important;
    width: 100%;
}
._13UrL .kR267 ._9smi2 ._1rJI8 ._1aUa_ {
    text-transform: uppercase !important;
    color: var(--color-soft-subtext) !important;
}
footer.authenticated {
    display: none !important;
}
.MuiSnackbar-anchorOriginBottomRight {
    display: none !important;
}
body#root-page-mobile header#pageheader nav.menu > ol > li a {
    color: var(--color-subtext) !important;
    transition: all 0.4s ease-in-out !important;
    height: 50px;
    overflow: hidden;
}

body#root-page-mobile header#pageheader nav.menu > ol > li a:hover {
    border-bottom: 4px solid hsla(0, 0%, 100%, 0.13);
    height: 48px;
}
._2E1AL {
    display: none !important;
}
.MuiDrawer-paperAnchorRight {
    text-transform: uppercase !important;
}
.xp-bar .xp-text {
    color: var(--color-dark-subtext) !important;
}
.xp-bar .progress {
    background-color: var(--color-react-clickable2) !important;
}
.xp-bar .progress .progression-bar {
    background-color: var(--color-react-clickable3-hover) !important;
}
body#root-page-mobile header#pageheader .logo .logo-image {
    background-image: url('https://i.imgur.com/oEaseOY.jpeg') !important;
}
._1q4mD ._1sUGu ._1u05O {
background-color: transparent !important;
}

    `);

    function replaceImageAndTooltip() {
        const targetElement = document.querySelector('div._2Jlgl a');

        if (targetElement) {
            const newImageUrl = 'https://i.imgur.com/oEaseOY.jpeg';
            const imgElement = targetElement.querySelector('img');
            if (imgElement) {
                imgElement.src = newImageUrl;
                imgElement.srcset = newImageUrl + ' 2x';
            }
            const newTooltipText = 'PlexSpace Theme by Simon';
            targetElement.setAttribute('title', newTooltipText);
        }
    }
    window.addEventListener('load', replaceImageAndTooltip);

    function changePlaceholderText() {
        const relaxarea = document.querySelector('._375XK textarea');
        if (relaxarea) {
            relaxarea.placeholder = 'Make them smile ❤';
        }
        const relaxarea2 = document.querySelector('.zUJzi ._2BvOT ._375XK textarea');
        if (relaxarea2) {
            relaxarea2.placeholder = 'Make them smile ❤';
        }
    }
    window.addEventListener('load', changePlaceholderText);
})();

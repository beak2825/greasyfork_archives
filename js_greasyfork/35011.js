// ==UserScript==
// @name         Tweakers.net styling
// @match        https://tweakers.net/*
// @description  Remove bullshit
// @version      2017.11.10
// @namespace    greasy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35011/Tweakersnet%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/35011/Tweakersnet%20styling.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.id='blaise';
style.textContent = `

html .article, html .article > *,
html .reactieContent {
font: normal 16px/24px georgia, serif;
}

html .reactieContent {
font-size: 15px;
}

html #toc {
opacity: 0.1;
}
html #toc:hover {
opacity: 1;
}

html #contentArea .centered {
width: 660px;
}

html .relatedContentContainer,
html .filterBox,
html #reacties h2 {
margin-left: 0;
padding-left: 0;
}

html .centeredReactions #reacties,
html #contentArea .headingContent {
margin-left: 0 !important;
}

html .article h2,html .article h3 {
font-weight: bold;
}

html p.author,html p.author * {
font: normal 14px/24px georgia, serif;
}

html .reactie {
margin-left: -1px;
margin-top: -11px !important;
}

html .highlights td {
font: normal 14px/16px georgia, serif;
}

html .articleOptions,
html .karmaCards,
html .wvhj,
html #true,
html #b_re,
html #sponsored,
html #jobs,
html #streamone,
html #newsletter,
html #socialButtons,
html .streamer,
html .relatedContentContainer,
html .reactie .scoreButton {
display: none !important;
}

html x#search {
left: 50%;
margin-left: -300px;
padding-top: 0;
position: absolute;
top: 10px;
width: auto;
z-index: 100;
}

html #searchbar {
height: 25px;
}


#reacties #reactieContainer,
#reacties #reactieForm {
border-left: none !important;
margin: 0 !important;
padding: 20px 0 !important;
}
`;

document.documentElement.appendChild(style);

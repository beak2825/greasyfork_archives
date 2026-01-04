// ==UserScript==
// @name         FA Download Button
// @namespace    https://gist.github.com/dragantic
// @version      0.2
// @description  Adds a hovering download button in gallery pages on FurAffinity
// @author       Dragantic
// @match        *://*.furaffinity.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/463064/FA%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/463064/FA%20Download%20Button.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(
`@keyframes fadein {
	0%   {opacity: 0;}
	100% {opacity: 0.5;}
}

#fatabs {
	width: 60px !important;
	height: 60px !important;
	left: calc(50% - 30px);
	z-index: 2147483647;
	position: absolute;
	cursor: pointer;

	animation: fadein 0.1s;
	transition: 0.1s;

	filter: hue-rotate(240deg);
	background-color: black;
	opacity: 0.5;
}

#fatabs.hide {
	opacity: 0;
}

#fatabs:hover {
	opacity: 1;
}

*[data-fav] #fatabs {
	filter: hue-rotate(120deg);
}

*[data-fav='1'] #fatabs {
	filter: hue-rotate(0deg);
}`);

    let img;
    let a;
    let fav;
    const btn = document.createElement('img');
    btn.id = 'fatabs';
    btn.src = 'data:image/svg+xml;base64,' + btoa( // From KDE's Breeze Dark theme
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
<defs id="defs3051">
  <style type="text/css" id="current-color-scheme">
	 .ColorScheme-Text { color:#ffff00; }
  </style>
</defs>
<g transform="translate(1,1)">
  <path style="fill:currentColor;fill-opacity:1;stroke:none" d="M 8 3 L 8 9 L 9 9 L 9 4 L 13 4 L 13 9 L 14 9 L 14 3 L 13 3 L 9 3 L 8 3 z M 5.7929688 10 L 5 10.816406 L 11 17 L 17 10.816406 L 16.207031 10 L 11 15.367188 L 5.7929688 10 z M 4 17 L 4 19 L 5 19 L 17 19 L 18 19 L 18 17 L 17 17 L 17 18 L 5 18 L 5 17 L 4 17 z " class="ColorScheme-Text"/>
</g>
</svg>`);
    btn.addEventListener('click', (e) => {
        const prev = fav;
        fav = +!fav;
        btn.title = (fav ? 'UnFav' : 'Fav') + ' Image';
        a.dataset.fav = fav.toString();
        fetch(a.href)
            .then((response) => response.text())
            .then((text) => {
            if (prev < 0) { // download
                const m = text.match(/(d\.furaffinity\.net\/.*?)"/);
                if (m) {
                    const name = m[1].substring(m[1].lastIndexOf('/') + 1);
                    GM_download({
                        url: `https://${m[1]}`,
                        name: name,
                        onerror: (result) => { console.log(result); }
                    });
                }
            }
            else { // (un)fav
                const m = text.match(new RegExp(`(/${prev ? 'un' : ''}fav/.*?)"`));
                m && fetch(`https://www.furaffinity.net${m[1]}`);
            }
        });
        e.preventDefault();
    });
    document.addEventListener('mouseover', (e) => {
        const t = e.target;
        if (t === btn) {
            return;
        }
        if (t instanceof HTMLImageElement
            && (t.offsetWidth >= 180 || t.offsetHeight >= 180)) {
            btn.className = '';
            if (img !== t) {
                const anc = t.closest('a');
                if (anc) {
                    (a = anc).prepend(btn);
                    img = t;
                    fav = parseInt(a.dataset.fav || '-1');
                    btn.title = (fav == -1 ? 'Download' :
                        (fav == 0 ? 'Fav' : 'UnFav')) + ' Image';
                }
            }
        }
        else {
            btn.className = 'hide';
        }
    });
})();

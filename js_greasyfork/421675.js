// ==UserScript==
// @name         Google Infogalactic
// @namespace    -
// @version      1.0
// @description  -
// @author       -
// @icon         https://google.com/favicon.ico
// @include      https://www.google.*/search?*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421675/Google%20Infogalactic.user.js
// @updateURL https://update.greasyfork.org/scripts/421675/Google%20Infogalactic.meta.js
// ==/UserScript==

(() => {
    const box = document.querySelector('.kp-wholepage .kno-rdesc');
    if (!box) return;
    
    const heading = document.querySelector('.kp-wholepage span[role="heading"], .kp-wholepage h2')?.innerText;
    if (!heading) return;

    const url = 'https://infogalactic.com/info/Special:Search/' + heading;

    GM.xmlHttpRequest({
        url,
        method: 'GET',
        headers: {
            Origin: 'infogalactic.com'
        },
        onload: res => {
            if (res.status !== 200) return console.warn('Bad status from infogalactic:', res.status);
            let txt = res.responseText.replace(/<table[^<>]*>((.|\n)*?)<\/table>/g, '');
            let r = /id="mw-content-text"(?:.|\n)*?<p>((.|\n)*?)<\/p>/g.exec(txt);
            if (!r) return console.warn('Infogalactic returned a bad body, or no matching articles were found');
            let regex = /<p>((?:.|\n)*?)<\/p>/g;
            txt = res.responseText.substring(r.index);
            while (r && r[1].length < 10) {
                r = regex.exec(txt);
            }
            if (!r) return console.warn('Infogalactic returned a bad body, or no matching articles were found');
            const el = document.createElement('div');
            el.innerHTML = r[1];
            [...el.querySelectorAll('sup')].forEach(ref => ref.remove());
            box.innerHTML = `<span>${el.innerText}</span><span> </span><a href="${url}">Infogalactic</a>`;
        },
        onerror: console.warn
    });
})();
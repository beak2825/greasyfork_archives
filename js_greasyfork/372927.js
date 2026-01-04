// ==UserScript==
// @name         biggest-apples
// @namespace    http://modsgarden.cc/
// @version      0.1.0
// @description  displays a window with links to most thanked items
// @author       me
// @match        http://modsgarden.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372927/biggest-apples.user.js
// @updateURL https://update.greasyfork.org/scripts/372927/biggest-apples.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function() {
    'use strict';
    const best = Array.from(
        document.querySelectorAll('#thank_you_list_link a'),
        el => ({
            link: document.location.origin + document.location.pathname + '#msg' + el.getAttribute('href').split('msg=')[1],
            count: parseInt(el.querySelector('strong').innerText, 10)
        })
    )
    .sort((a, b) => b.count - a.count);

    if (best.length) {
        const box = document.createElement('div');
        box.setAttribute('style', 'position: fixed; top: 10px; right: 10px; width: 100px; height: 300px; background: white; opacity: 0.7; border: 1px solid #ccc; box-shadow: 3px 3px 25px 0px rgba(135,135,135,1); overflow: auto; padding: 5px;');

        best.forEach((el, idx) => {
            const link = document.createElement('a');
            link.setAttribute('href', el.link);
            link.setAttribute('style', 'display: block; margin-bottom: 5px');
            link.innerHTML = `<b>${idx + 1}.</b> ${el.count}`;
            box.appendChild(link);
        });
        document.body.appendChild(box);
    }
})();
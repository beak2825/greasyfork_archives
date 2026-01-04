// ==UserScript==
// @name         Erome Like Visible On Albums
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Show album like count from any page with albums
// @author       throwinglove23
// @license      MIT
// @match        https://www.erome.com/*
// @match        http://www.erome.com/*
// @exclude      http://www.erome.com/a/*/
// @exclude      https://www.erome.com/a/*/
// @exclude      https://www.erome.com/a/*/edit
// @exclude      http://www.erome.com/a/*/edit
// @icon         https://www.erome.com/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455319/Erome%20Like%20Visible%20On%20Albums.user.js
// @updateURL https://update.greasyfork.org/scripts/455319/Erome%20Like%20Visible%20On%20Albums.meta.js
// ==/UserScript==
/* jshint esversion: 11 */ 

function likeShowable()
{
    const albums = Array.from(document.getElementsByClassName('album-link'));
    albums.forEach(async function(album)
        {
            const hr = album.href;
            const hdr = await fetch(hr);
            const data = await hdr.text();
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, 'text/html');
            // nullish coalescing es11
            let countArea = doc.querySelector('#like_count');
            let count = 0;
            if (countArea == null)
            {
                countArea = doc.querySelector('.far.fa-heart.fa-lg');
                count = countArea.nextElementSibling.firstChild.textContent.trim();
            }
            else
            {
                count = countArea.textContent.trim();
            }
            
            if (+count < 1)
            {
                return;
            }
            if (album.parentElement.querySelector('.album-bottom-right').children.length > 1)
            {
                const viewSec = album.parentElement.querySelector('.album-bottom-right').lastElementChild.insertAdjacentHTML("afterbegin", `<span style="
        position: absolute;
        bottom: 26px;
        right: -0.1px;
    ">${count}</span><i class="ml-5 mr-5 fas pink fa-heart fa-lg" aria-hidden="true" style="bottom: 30px;position: absolute;left: 10px;"></i>`);
            }
            else
            {
                const viewSec = album.parentElement.querySelector('.album-bottom-right').lastElementChild.insertAdjacentHTML("afterbegin", `<span style="
        position: absolute;
        bottom: 26px;
        left: 10px;
    ">${count}</span><i class="ml-5 mr-5 fas pink fa-heart fa-lg" aria-hidden="true" class="ml-5 mr-5"style="bottom: 30px;position: absolute;left: -15px;"></i>`);
            }
        });
}

window.addEventListener('load', likeShowable);

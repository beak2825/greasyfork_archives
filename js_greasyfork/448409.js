// ==UserScript==
// @name         kickass torrent, add magnet link buttons
// @description  adds magnet link button in the search results so you won't have to open the page just to downlaod
// @namespace    https://github.com/FarisHijazi
// @author       Faris Hijazi
// @version      0.2
// @icon         https://www.google.com/s2/favicons?domain=kikass.to
// @match        *
// @include      http*kickass*
// @include      http*kikass*
// @include      http*kat*
// @grant        window.open
// @run-at       document-end
// @license      MIT
// @noframes
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/448409/kickass%20torrent%2C%20add%20magnet%20link%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/448409/kickass%20torrent%2C%20add%20magnet%20link%20buttons.meta.js
// ==/UserScript==


function fetchDoc(url) {
    return fetch(url, {
        'credentials': 'include',
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors'
    })
        .then((res) => res.text())
        .then((html) => {
            // return doc
            return new DOMParser().parseFromString(html, 'text/html');
        });
}


document.querySelectorAll("#wrapperInner > div.mainpart > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td > div > table > tbody > tr > td:nth-child(1) > div.torrentname > div > a").forEach(torrent=>{
    var torrentButton = torrent.closest('td').querySelector('[title="Download torrent file"]');
    var magnetButton = document.createElement('a');
    torrentButton.before(magnetButton);
    magnetButton.outerHTML = '<a class="kaGiantButton" target="_blank" data-nop="" title="Magnet link"><i class="ka ka-magnet"></i></a>';
    magnetButton = torrentButton.previousSibling;
    var getMagnet = function(event) {
        if (magnetButton.href) return;
        event.preventDefault();
        console.log('event', event);

        fetchDoc(torrent.href).then(doc=>{
            var a = doc.querySelector('a[title="Magnet link"]');
            var magnet = a.href;
            magnetButton.href = magnet;
            console.log('magnet', magnet);
        });
    }
    magnetButton.addEventListener('mouseover', getMagnet);
    magnetButton.addEventListener('click', getMagnet);
});


// ==UserScript==
// @name                A L Z E ~ P R O X Y 2.0
// @description         EN İYİ CROXY AÇICI
// @version             2.0
// @match               *://gartic.io/*
// @match               *://www.croxyproxy.rocks/*
// @grant               GM_addStyle
// @grant               GM_openInTab
// @license             MIT
// @icon                https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @namespace           ALZE
// @downloadURL https://update.greasyfork.org/scripts/515583/A%20L%20Z%20E%20~%20P%20R%20O%20X%20Y%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/515583/A%20L%20Z%20E%20~%20P%20R%20O%20X%20Y%2020.meta.js
// ==/UserScript==

if (location.href.includes('gartic.io')) {
    let button = document.createElement('div');
    button.innerHTML = '<span style="font-size: 10px; font-family: Arial, sans-serif;">ＡＬＺＥ</span>';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.background = 'linear-gradient(145deg, #222, #111)';
    button.style.color = '#fff';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    button.style.transition = 'box-shadow 0.3s ease-in-out';

    button.addEventListener('click', () => openproxy(15));

    document.body.appendChild(button);

    function openproxy(count) {
        let link = "https://www.croxyproxy.rocks/";
        for (let i = 0; i < count; i++) {
            GM_openInTab(link);
        }
    }
}

setInterval(function () {
    let linkyeri = document.querySelector('input[placeholder="Enter an URL or a search query to access"]');
    if (window.location.href.includes("croxyproxy.rocks")) {
        if (linkyeri && linkyeri.value === "") {
            linkyeri.value = "gartic.io/favicon.ico";
            let goButton = document.querySelector('i[class="fa fa-arrow-right"]');
            if (goButton) {
                goButton.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
            }
        }
    }
}, 300);


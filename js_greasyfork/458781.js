// ==UserScript==
// @name        Download enabler - downloads.khinsider.com
// @namespace   https://github.com/Thibb1
// @match       https://downloads.khinsider.com/*
// @grant       GM_xmlhttpRequest
// @version     1.1.1
// @author      Thibb1
// @description Simple download enabler for downloads.khinsider.com
// @downloadURL https://update.greasyfork.org/scripts/458781/Download%20enabler%20-%20downloadskhinsidercom.user.js
// @updateURL https://update.greasyfork.org/scripts/458781/Download%20enabler%20-%20downloadskhinsidercom.meta.js
// ==/UserScript==

function downloadMusic(url) {
    const filename = decodeURIComponent(url.split('/').pop());
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: 'blob',
        onload: function (response) {
            const url = window.URL.createObjectURL(response.response);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
        }
    });
}

function getFlacUrl(url) {
    return url.replace(/\.mp3$/, '.flac');
}

window.onload = function () {
    const style = document.createElement('style');
    style.innerHTML = `
    .audioplayerBar {
        width: 370px;
    }
    .audioplayerBar div {
        width: inherit;
    }
    .audioplayerButtons {
        width: auto;
    }
    `;
    document.head.appendChild(style);

    const audioWrap = document.querySelector('#audiowrap > *');
    let urlMp3 = audioWrap?.children[0]?.getAttribute('src');
    let urlFlac = getFlacUrl(urlMp3);

    const audioButtons = document.querySelector('.audioplayerButtons');

    function createDownloadButton(iconName) {
        const button = document.createElement('a');
        button.setAttribute('href', '#');
        const icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons');
        icon.innerText = iconName;
        button.appendChild(icon);
        audioButtons.appendChild(button);
        return button;
    }

    const mp3Button = createDownloadButton('file_download');
    const flacButton = createDownloadButton('high_quality');

    mp3Button.addEventListener('click', function (e) {
        e.preventDefault();
        downloadMusic(urlMp3);
    });

    flacButton.addEventListener('click', function (e) {
        e.preventDefault();
        downloadMusic(urlFlac);
    });

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "attributes") {
                urlMp3 = mutation.target.getAttribute('src');
                urlFlac = getFlacUrl(urlMp3);
            }
        });
    });
    observer.observe(audioWrap?.children[0], {
        attributes: true
    });
};
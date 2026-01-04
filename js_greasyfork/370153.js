// ==UserScript==
// @name            Anime Download Skipper
// @name            animedownloadskipper
// @description     Skip some bullshit automatically in anime download link
// @version         1
// @grant           none
// @match           *://*.siotong.com/*
// @match           *://*.greget.space/*
// @match           *://*.tetew.info/*
// @match           *://*.anjay.info/*
// @match           *://*.coeg.in/*
// @match           *://*.davinsurance.com/*
// @match           *://*.idsly.bid/*
// @match           *://drive.google.com/file/d/*
// @match           *://*.zippyshare.com/v/*/file.html
// @namespace https://greasyfork.org/users/195347
// @downloadURL https://update.greasyfork.org/scripts/370153/Anime%20Download%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/370153/Anime%20Download%20Skipper.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const links = {
    samehadaku: [
        'siotong.com',
        'greget.space',
        'tetew.info',
        'anjay.info',
        'coeg.in',
    ],
}

function samehadaku() {
    let link = document.querySelector('.download-link > a');
    if (link === null) return;

    let params = new URLSearchParams(link.search);
    let encoded = params.get('r');
    if (encoded === null) return;

    let target = window.atob(encoded);
    window.location.replace(target);
}

function davinsurance() {
    let params = new URLSearchParams(window.location.search);
    let encoded = params.get('r');
    if (encoded === null) return;

    let target = window.atob(encoded);
    window.location.replace(target);
}

function idsly() {
    let link = document.querySelector('#link-view button');
    if (link === null) {
        let clicker = setInterval(() => {
            let btn = document.querySelector('a.get-link');
            if (btn !== null && btn.href.includes('http')) {
                clearInterval(clicker);
                window.location.replace(btn.href);
            }
        }, 1000);
        return;
    }

    if (link.textContent.toLowerCase().trim().includes('visit link')) {
        link.click();
        return;
    }
}

function googleDrive() {
    let id = window.location.pathname.replace("/file/d/", "").replace("/view", "");
    let protocol = window.location.protocol;
    let host = window.location.hostname;
    let url = protocol + '//' + host + '/uc?export=download&id=' + id;

    window.location.replace(url);
}

(function () {
    window.stop();

    for (let i = 0; i < links.samehadaku.length; ++i) {
        if (window.location.hostname.includes(links.samehadaku[i])) {
            samehadaku();
            return;
        }
    }

    if (window.location.hostname.includes('davinsurance.com')) {
        davinsurance();
        return;
    }

    if (window.location.hostname.includes('idsly.bid')) {
        idsly();
        return;
    }

    if (window.location.hostname.includes('drive.google.com')) {
        googleDrive();
        return;
    }

    if (window.location.hostname.includes('zippyshare.com')) {
        window.location.replace(document.querySelector('#dlbutton').href);
        return;
    }
})();

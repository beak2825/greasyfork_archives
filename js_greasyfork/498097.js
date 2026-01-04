// ==UserScript==
// @name         Play Video Locally
// @namespace    https://naeembolchhi.github.io/
// @version      0.7
// @description  Gives you a simple button on certain media servers to send the video to a local player.
// @author       NaeemBolchhi
// @match        http*://circleftp.net/*
// @match        http*://10.16.100.244/*
// @match        http*://freedrivemovie.com/*
// @match        http*://movies.discoveryftp.net/*
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZjA1MzA4NC02ODgzLWQ5NDgtYjg0Yy1iMTVlMzgyZmJhNjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTQ0REMwMkMyQkM1MTFFRkIxRTZDMzBFNEJFMkQ4NDciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTQ0REMwMkIyQkM1MTFFRkIxRTZDMzBFNEJFMkQ4NDciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N2YwNTMwODQtNjg4My1kOTQ4LWI4NGMtYjE1ZTM4MmZiYTY0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdmMDUzMDg0LTY4ODMtZDk0OC1iODRjLWIxNWUzODJmYmE2NCIv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
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498097/Play%20Video%20Locally.user.js
// @updateURL https://update.greasyfork.org/scripts/498097/Play%20Video%20Locally.meta.js
// ==/UserScript==

// Supported video formats
const vform = [".mp4",".mkv"];

// Hide video players (change value to "invisible" to hide a player, and to "visible" to show it)
const vvid = {
    "potplayer": "visible",
    "vlcplayer": "visible",
    "xplayer": "visible",
    "mxplayer": "visible",
    "mxplayerpro": "visible"
};

// SVG Icons
const icons = {
    "toggle":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11H1v2h6v-2zm2.17-3.24L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41zM13 1h-2v6h2V1zm5.36 6.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM17 11v2h6v-2h-6zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zm-9.19.71l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12zM11 23h2v-6h-2v6z"/></svg>`,
    "next":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="M150.4 180.1c-5.1-5.6-9.7-10.6-14.2-15.7-29.7-32.7-59.3-65.4-89-98.1-4.9-5.4-10.8-8.8-18.2-9.6C15.6 55.2 2.5 65.3.4 78.5c-1.4 9.4 1.7 17.2 8 24.1 24.9 27.3 49.7 54.7 74.5 82 14.8 16.3 30.1 32.1 44.1 49 10.9 13.1 34.8 12.8 46.1 0 38.9-43.9 78.6-87 118-130.4 6.1-6.7 9.9-14 8.7-23.3-1.4-10.7-7.3-18.3-17.5-21.8-10.9-3.8-20.7-1.1-28.5 7.3-18.5 20.1-36.7 40.3-55 60.5l-47.1 51.9c-.4.7-.7 1.4-1.3 2.3z"/></svg>`,
    "prev":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="M150.4 119.7c-5.1 5.6-9.7 10.6-14.2 15.7-29.7 32.7-59.3 65.4-89 98.1-4.9 5.4-10.8 8.8-18.2 9.6-13.4 1.5-26.5-8.6-28.6-21.8-1.4-9.4 1.7-17.2 8-24.1 24.9-27.3 49.7-54.7 74.5-82 14.8-16.3 30.1-32.1 44.1-49 10.9-13.1 34.8-12.8 46.1 0 38.9 43.9 78.6 87 118 130.4 6.1 6.7 9.9 14 8.7 23.3-1.4 10.7-7.3 18.3-17.5 21.8-10.9 3.8-20.7 1.1-28.5-7.3-18.5-20.1-36.7-40.3-55-60.5L151.7 122c-.4-.7-.7-1.4-1.3-2.3z"/></svg>`,
    "player":``,
    "mobile":``,
    "pc":``
};

// Get URL variables
function getVar(vlink) {
    let vars = {};
    let parts = vlink.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Generate protocol URL
function getURL(player, url, text) {
    let matchList = [
        {"key": "none", "val": `${url}`},
        {"key": "potplayer", "val": `potplayer://${url}`},
        {"key": "vlcplayer", "val": `vlc://${url}`},
        {"key": "xplayer", "val": `intent:${url}#Intent;package=video.player.videoplayer;S.title=${text};end`},
        {"key": "mxplayer", "val": `intent:${url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${text};end`},
        {"key": "mxplayerpro", "val": `intent:${url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${text};end`}
    ]

    for (let x = 0; x < matchList.length; x++) {
        if (player === matchList[x].key) {
            return matchList[x].val;
        }
    }
}

// Make any new element
function elemake(tag, innr, attr) {
    let element = document.createElement(tag);
    if (innr) {element.innerHTML = innr;}
    if (!attr) {return element;}

    for (let x = 0; x < attr.key.length; x++) {
        element.setAttribute(attr.key[x], attr.val[x]);
    }
    return element;
}

// let sample = elemake("div","ja monchay",{"key":["id","class"],"val":["oneDiv","nav pointer"]});
// document.body.appendChild(sample);

// Find supported videos in "src" and "href" of all tags
function getVids() {
    let allLinks = document.querySelectorAll('*[src], *[href]'),
        print = [];

    for (let x = 0; x < allLinks.length; x++) {
        var tmpl = "";
        if (allLinks[x].href !== undefined) {tmpl = allLinks[x].href;}
        if (allLinks[x].src !== undefined) {tmpl = allLinks[x].src;}

        if (tmpl.match(/source/)) {
            tmpl = decodeURIComponent(getVar(tmpl).source);
        }

        var ext = tmpl.replace(/.*(....)$/,'$1'),
            okay = 'no';

        for (let y = 0; y < vform.length; y++) {
            if (ext === vform[y]) {okay = 'yes';}
        }

        if (okay === 'yes' && print.indexOf(tmpl) === -1) {
            print.push(tmpl);
        }
    }

    window.vidlinks = JSON.stringify(print);
}

// Determine visibility
function visble(what, txt) {
    if (vvid[what] === "visible") {
        return `<a class="avid ${what}">Open with ${txt}</a>`;
    } else {
        return `<a class="avid ${what} hidden">Open with ${txt}</a>`;
    }
}

// Visualize the interface
function inTerface() {
    const inStyle = `<style type="text/css">
    #playVideoLocally, #playVideoLocally * {
        outline: none;
    }
    #playVideoLocally {
        position: fixed;
        display: block;
        z-index: 2147483647;
    }
    #playVideoLocally section {
        position: fixed;
        bottom: 0;
        left: 0;
        background: transparent;
        height: 100%;
        width: 100%;
        display: block;
        z-index: 2147483641;
        transition: opacity .1s linear, filter .1s linear, transform .1s linear;
    }
    #playVideoLocally section:not(.clicked) {
        opacity: 0;
        filter: blur(6px);
        transform: translateY(100%);
    }
    #playVideoLocally section > backdrop {
        position: fixed;
        background: transparent;
        height: 100svh;
        width: 100svw;
        display: block;
        z-index: 2147483640;
    }
    #playVideoLocally > .btn-main {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2147483642;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        padding: 10px;
        margin: 0 0 20px 20px;
        border-radius: 100%;
        fill: #cdd6f4;
        background: #11111b;
        cursor: pointer;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.25);
        transition: opacity .1s linear;
    }
    #playVideoLocally > .btn-main > svg {
        transition: transform .1s linear;
    }
    #playVideoLocally > .btn-main.clicked > svg {
        transform: rotate(-90deg);
    }
    #playVideoLocally > .btn-main:not(.clicked) {
        opacity: .5;
    }
    #playVideoLocally > .btn-main:not(.clicked):hover {
        fill: #ffffff;
        opacity: 1;
    }
    #playVideoLocally > .btn-main.clicked:hover {
        opacity: 1;
        color: #ffffff;
        fill: #ffffff;
        background: #444654;
    }
    #playVideoLocally section > .section-sub {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2147483641;
        margin: 0 0 70px 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    #playVideoLocally section > .section-sub > span {
        height: 40px;
        width: 40px;
        padding: 10px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        color: #cdd6f4;
        fill: #cdd6f4;
        background: #11111b;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.25);
        cursor: pointer;
    }
    #playVideoLocally section > .section-sub > .current {
        cursor: default;
    }
    #playVideoLocally section > .section-sub > span:hover {
        color: #ffffff;
        fill: #ffffff;
        background: #444654;
    }
    #playVideoLocally section > .section-sub > span.disabled {
        fill: #999999 !important;
        cursor: not-allowed;
    }
    #playVideoLocally section > .section-main {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2147483641;
        margin: 0 0 20px 70px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    #playVideoLocally section > .section-main > a {
        height: 40px;
        min-width: 40px;
        width: fit-content;
        display: flex;
        align-items: center;
        padding: 15px;
        font-size: 14px;
        border-radius: 500px;
        color: #cdd6f4;
        fill: #cdd6f4;
        background: #11111b;
        text-decoration: none;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.25);
    }
    #playVideoLocally section > .section-main > a:hover {
        color: #ffffff;
        fill: #ffffff;
        background: #444654;
    }
    #playVideoLocally .next > svg {
        transform: translateY(1px);
    }
    #playVideoLocally .prev > svg {
        transform: translateY(-1px);
    }
    #playVideoLocally .next:not(.disabled):active, #playVideoLocally .prev:not(.disabled):active {
        transform: scale(.75);
    }
    #playVideoLocally .hidden {
        display: none !important;
    }
    </style>`;

    const inSide = `
    <div class="btn-main">${icons.toggle}</div>
    <section>
        <div class="section-sub">
            <span class="prev">${icons.prev}</span>
            <span class="current"></span>
            <span class="next">${icons.next}</span>
        </div>
        <div class="section-main">
            ${visble('potplayer', 'PotPlayer')}
            ${visble('vlcplayer', 'VLC Player')}
            ${visble('xplayer', 'XPlayer')}
            ${visble('mxplayer', 'MX Player')}
            ${visble('mxplayerpro', 'MX Player Pro')}
            <a class="avid raw filename"></a>
        </div>
        <backdrop></backdrop>
    </section>
    `;

    let mainDiv = elemake("div", inStyle + inSide, {"key":["id"],"val":["playVideoLocally"]});
    document.body.appendChild(mainDiv);
}

// Make it interactive
function inTeract(num) {
    if (num > JSON.parse(window.vidlinks).length - 1) {
        var numX = JSON.parse(window.vidlinks).length - 1;
    } else if (num < 0) {
        var numX = 0;
    } else {
        var numX = num;
    }

    let disLink = JSON.parse(window.vidlinks)[numX],
        disTitle = decodeURIComponent(disLink.replace(/.*\/(.*)$/,'$1'));

    document.querySelector('#playVideoLocally .filename').innerText = disTitle;

    document.querySelector('#playVideoLocally .avid.raw').href = getURL('none', disLink, disTitle);
    document.querySelector('#playVideoLocally .avid.potplayer').href = getURL('potplayer', disLink, disTitle);
    document.querySelector('#playVideoLocally .avid.vlcplayer').href = getURL('vlcplayer', disLink, disTitle);
    document.querySelector('#playVideoLocally .avid.xplayer').href = getURL('xplayer', disLink, disTitle);
    document.querySelector('#playVideoLocally .avid.mxplayer').href = getURL('mxplayer', disLink, disTitle);
    document.querySelector('#playVideoLocally .avid.mxplayerpro').href = getURL('mxplayerpro', disLink, disTitle);

    document.querySelector('#playVideoLocally .prev').classList.remove('disabled','hidden');
    document.querySelector('#playVideoLocally .next').classList.remove('disabled','hidden');

    document.querySelector('#playVideoLocally .current').innerText = numX + 1;
    document.querySelector('#playVideoLocally .current').setAttribute('data-num', numX);

    if (numX === 0) {
        document.querySelector('#playVideoLocally .prev').classList.add('disabled');
    } else if (numX === JSON.parse(window.vidlinks).length - 1) {
        document.querySelector('#playVideoLocally .next').classList.add('disabled');
    }

    if (JSON.parse(window.vidlinks).length === 1) {
        document.querySelector('#playVideoLocally .prev').classList.add('hidden');
        document.querySelector('#playVideoLocally .next').classList.add('hidden');
    }
}

// Event listeners
function inVent() {
    let prev = document.querySelector('#playVideoLocally .prev'),
        next = document.querySelector('#playVideoLocally .next'),
        current = document.querySelector('#playVideoLocally .current'),
        main = document.querySelector('#playVideoLocally .btn-main'),
        section = document.querySelector('#playVideoLocally section'),
        backdrop = document.querySelector('#playVideoLocally backdrop');

    document.addEventListener('click', function(e) {
        if (e.target == prev || prev.contains(e.target)) {
            inTeract(parseInt(current.getAttribute('data-num')) - 1);
        }
        if (e.target == next || next.contains(e.target)) {
            inTeract(parseInt(current.getAttribute('data-num')) + 1);
        }
        if (e.target == main || main.contains(e.target)) {
            try {getVids();} catch {}
            try {inTeract(0);} catch {}
            if (main.classList.contains('clicked')) {
                main.classList.remove('clicked');
                section.classList.remove('clicked');
            } else {
                main.classList.add('clicked');
                section.classList.add('clicked');
            }
        }
        if (e.target == backdrop || backdrop.contains(e.target)) {
            main.click();
        }
    });
}

if (!document.body.classList.contains('jwplayer')) {
    try {getVids();} catch {}
    try {inTerface();} catch {}
    try {inTeract(0);} catch {}
    try {inVent();} catch {}
}
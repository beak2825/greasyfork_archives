// ==UserScript==
// @name         Anchor Tags for WebToEpub
// @namespace    https://naeembolchhi.github.io/
// @version      0.5
// @description  A userscript that generates anchor tags from certain webnovel websites to be used with WebToEpub extension.
// @author       NaeemBolchhi
// @match        https://www.lightnovelworld.com/*
// @match        https://libread.com/*
// @match        https://freewebnovel.com/*
// @match        https://novelfire.net/*
// @match        https://readnovelfull.com/*
// @match        https://ranobes.top/*
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,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
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503137/Anchor%20Tags%20for%20WebToEpub.user.js
// @updateURL https://update.greasyfork.org/scripts/503137/Anchor%20Tags%20for%20WebToEpub.meta.js
// ==/UserScript==

const siteMatch = [{
        "name": "https://www.lightnovelworld.com",
        "link": "ul.chapter-list",
        "avoid": "",
        "color": "#6258cc",
        "color1": "#272727",
        "color2": "#333333"
    }, {
        "name": "https://libread.com",
        "link": "#idData",
        "avoid": "",
        "color": "#009688",
        "color1": "#222222",
        "color2": "#696969"
    }, {
        "name": "https://freewebnovel.com",
        "link": "#idData",
        "avoid": "",
        "color": "#14425d",
        "color1": "#222222",
        "color2": "#696969"
    }, {
        "name": "https://novelfire.net",
        "link": "ul.chapter-list",
        "avoid": "",
        "color": "#ea2d2d",
        "color1": "#272727",
        "color2": "#333333"
    }, {
        "name": "https://ranobes.top",
        "link": ".chapters__container",
        "avoid": ".chapters__container div:not(.cat_line)",
        "color": "#687d52",
        "color1": "#272727",
        "color2": "#333333"
    }, {
        "name": "https://readnovelfull.com",
        "link": "#list-chapter",
        "avoid": "",
        "color": "#14425d",
        "color1": "#272727",
        "color2": "#333333"
}];

function getLinks(where, ignore) {
    let status = document.querySelector('#userButtons > span');

    if (!document.querySelector(where)) {
        status.innerText = "Invalid!";

        setTimeout(function() {
            status.innerText = "Ready!";
        }, 1000);

        return;
    }

    let container = document.querySelector(where),
        anchors = container.querySelectorAll('a'),
        print = '';

    for (let x = 0; x < anchors.length; x++) {
        if (ignore && ignore !== "") {
            if (anchors[x].closest(ignore)) {
                setTimeout(function() {
                    status.innerText = `${x + 1} / ${anchors.length}`;
                }, 2 * x);

                continue;
            }
        }

        print += `<a href="${anchors[x].href}">${anchors[x].title}</a><br>`;
        // Artificial delay to make it seem like the script is hard at work. Snu snu.
        // In reality, this completes too fast to show any progress.
        setTimeout(function() {
            status.innerText = `${x + 1} / ${anchors.length}`;
        }, 2 * x);
    }

    setData(print.replace(/\<br\>/g,'\n'));

    setTimeout(function() {
        status.innerText = "Ready!";
    }, (2 * anchors.length) + 1000);
}

function setData(what) {
    sessionStorage.setItem('userlinks', getData() + what);
}

function clearData() {
    sessionStorage.removeItem('userlinks');

    let status = document.querySelector('#userButtons > span');

    status.innerText = "Data cleared!";

    setTimeout(function() {
        status.innerText = "Ready!";
    }, 1000);
}

function getData() {
    if (!sessionStorage.userlinks) {return '';}

    return sessionStorage.getItem('userlinks');
}

function copyLinks() {
    let status = document.querySelector('#userButtons > span');

    navigator.clipboard.writeText(getData()).then(() => {
        status.innerText = "Copied!";
    }).catch(err => {
        status.innerText = "Failed!";
    });

    setTimeout(function() {
        status.innerText = "Ready!";
    }, 1000);
}

function matchReturn(what) {
    for (let x = 0; x < siteMatch.length; x++) {
        if (window.location.origin === siteMatch[x].name) {
            return siteMatch[x][what];
        }
    }
}

function createButtons() {
    const inTags = `
    <btn title="Clear data from any previous sessions.">Clear Saved Links</btn>
    <btn title="Capture and store visible chapter links in memory.">Update Links</btn>
    <btn title="Copy links from memory to clipboard.">Copy to Clipboard</btn>
    <span title="See current state of the script.">Ready!</span>
    `,
          inStyle = `
    #userButtons {
        position: fixed;
        display: flex;
        flex-direction: column;
        left: 0;
        bottom: 0;
        z-index: 2147483647;
        gap: 16px;
        padding: 16px;
    }
    #userButtons span, #userButtons btn {
        display: block;
        padding: 12px 16px;
        color: #eeeeee;
        background: ${matchReturn("color1")};
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: transform .1s linear;
    }
    #userButtons btn:hover {
        background: ${matchReturn("color2")};
    }
    #userButtons btn:active {
        transform: scale(.9);
    }
    #userButtons span {
        background: ${matchReturn("color")};
        cursor: default;
    }
    `;

    let div = document.createElement('div');
    div.id = 'userButtons';
    div.innerHTML = inTags + '<style type="text/css">' + inStyle + '</style>';

    document.body.appendChild(div);
}

function clicky() {
    let btns = document.querySelectorAll('#userButtons > btn');

    btns[0].addEventListener('click', function() {
        clearData();
    });
    btns[1].addEventListener('click', function() {
        getLinks(matchReturn("link"), matchReturn("avoid"));
    });
    btns[2].addEventListener('click', function() {
        copyLinks();
    });
}

createButtons();
clicky();
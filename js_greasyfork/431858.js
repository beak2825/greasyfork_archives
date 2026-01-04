// ==UserScript==
// @name            Immortal Life
// @namespace       http://tampermonkey.net/
// @version         0.4.1
// @description     Become immortal!
// @author          Particle_G
// @icon            https://www.google.com/s2/favicons?domain=stackoverflow.com
// @include		    *://liferestart.syaro.io/*
// @require         https://cdn.jsdelivr.net/npm/md5@2.3.0/dist/md5.min.js
// @require         https://cdn.jsdelivr.net/npm/mdui@1.0.2/dist/js/mdui.min.js
// @resource        MDUI_CSS https://cdn.jsdelivr.net/npm/mdui@1.0.2/dist/css/mdui.min.css
// @grant		    GM_addElement
// @grant		    GM_addStyle
// @grant           GM_getResourceText
// @grant		    GM_log
// @grant		    GM_xmlhttpRequest
// @grant		    window.close
// @run-at		    document-start
// @downloadURL https://update.greasyfork.org/scripts/431858/Immortal%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/431858/Immortal%20Life.meta.js
// ==/UserScript==

async function injectMDUI() {
    const MDUI_CSS = GM_getResourceText("MDUI_CSS");
    GM_addStyle(MDUI_CSS);
    await waitUntilDocumentReady();
    document.body.className += "mdui-theme-primary-blue mdui-theme-accent-deep-orange";
}

function startNewLife() {
    if (!document.getElementById('restart')) {
        if (!document.getElementById('again')) {
            document.getElementById('summary').click();
        }
        document.getElementById('again').click();
    }
    document.getElementById('restart').click();
    let finished = false;
    while (!finished) {
        for (let i = 0; i < 1000; i++) {
            document.querySelector('#random').click();
        }
        document.querySelectorAll('.grade0b,.grade1b,.grade2b').forEach(item => item.remove());
        try {
            let hasGod = false, hasBox = false, hasFortune = false;
            document.querySelectorAll('.grade3b').forEach(item => {
                if (!hasGod && item.innerText.search('半神') !== -1) {
                    item.click();
                    hasGod = true;
                }
                if (!hasBox && item.innerText.search('神秘的小盒子') !== -1) {
                    item.click();
                    hasBox = true;
                }
                if (!hasFortune && item.innerText.search('天命') !== -1) {
                    item.click();
                    hasFortune = true;
                }
                if (hasGod && hasBox && hasFortune) {
                    throw new Error('');
                }
            });
        } catch (_) {
            finished = true;
        }
    }
    document.querySelector('#next').click();

    let buttons = document.querySelectorAll('.propbtn');
    for (let i = 0; i < 10; i++) {
        buttons[0].click();
        buttons[2].click();
        buttons[4].click();
        buttons[6].click();
    }
    for (let i = 0; i < 3; i++) {
        buttons[1].click();
    }
    for (let i = 0; i < 10; i++) {
        buttons[3].click();
        buttons[5].click();
    }
    for (let i = 0; i < 5; i++) {
        buttons[7].click();
    }

    document.querySelector('#start').click();
    for (let i = 0; i < 500; i++) {
        document.querySelector('#lifeTrajectory').click();
    }
}

(async () => {
    await injectMDUI();
    injectButton();
})();

function injectButton() {
    addElement(
        "div",
        "",
        {
            id: "TM_translateButtons",
            className: "mdui-float-right",
        },
        document.body
    );
    addElement(
        "div",
        "",
        {
            id: "TM_translateSpinner",
            className: "mdui-spinner mdui-spinner-colorful mdui-float-right mdui-hidden"
        },
        document.body
    );
    addElement(
        "button",
        `<div class="mdui-text-color-white-text">开始新的修仙人生</div>`,
        {
            className: "mdui-m-x-1 mdui-btn mdui-btn-raised mdui-color-theme mdui-float-right",
            onclick: () => { startNewLife() }
        },
        document.getElementById("TM_translateButtons")
    );
    /* addElement(
        "button",
        `<div class="mdui-text-color-white-text"></div>`,
        {
            className: "mdui-m-x-1 mdui-btn mdui-btn-raised mdui-color-theme-accent mdui-float-right",
            onclick: () => { translateNovelText(true) }
        },
        document.getElementById("TM_translateButtons")
    ); */
}

function addElement(tagName, innerHTML = "", options = {}, parentNode = document.body) {
    const el = document.createElement(tagName);
    el.innerHTML = innerHTML;
    Object.assign(el, options);
    parentNode.appendChild(el);
}

async function waitUntilDocumentReady() {
    let isReady = false;
    do {
        isReady = document.readyState == "complete" && document.querySelector("#main");
        await sleep(100);
    } while (!isReady);
    GM_log("Document is ready!");
}


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
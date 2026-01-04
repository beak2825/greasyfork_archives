// ==UserScript==
// @name         youtube auto-hide header
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  youtubeのヘッダーを自動で隠します（スクロールか画面上部ホバーで表示）
// @author       y_kahou
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=1051149
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414234/youtube%20auto-hide%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/414234/youtube%20auto-hide%20header.meta.js
// ==/UserScript==


/** スクロール後ヘッダーが表示されている時間 */
const SHOW_INTERVAL_SCROLL = 3000;

/** topにマウスを載せてからヘッダーが出るまでの時間 */
const SHOW_INTERVAL_HOVER = 300;

/** topからマウスをどけてヘッダーが消えるまでの時間 */
const HIDE_INTERVAL_HOVER = 1000;

let mouseX = -1, mouseY = -1;

(function() {

    // innerHTML を使うためのおまじない
    if (window.trustedTypes && trustedTypes.createPolicy) {
        if (!trustedTypes.defaultPolicy) {
            const passThroughFn = (x) => x;
            trustedTypes.createPolicy('default', {
                createHTML: passThroughFn,
                createScriptURL: passThroughFn,
                createScript: passThroughFn,
            });
        }
    }

    // ページ遷移を検知できるようにする
    y_method.DetectPagetransition();

    y_method.PageLauncher([
        {
            match: 'https://www.youtube.com/watch',
            css: `html:not([fullscreen]) ytd-app { margin-top: -56px; }`,
            run: hide
        }
    ]);
    // 最初の一回
    y_method.TriggerPagetransition();


    y_method.addStyle('auto-hide-header', `
    #masthead #background {
        opacity: 1!important;
    }
    #yah-setting {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: #888b;
        z-index: 10000;
        user-select: none;
    }
    #yah-setting .modal-back {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    #yah-setting .modal {
        display: grid;
        justify-items: center;
        margin: 100px auto;
        padding: 50px;
        width: fit-content;
        background: white;
    }
    #yah-setting label {
        font-size: large;
    }
    `);

    const defaultValue = (key, val) =>
        (typeof GM_getValue(key) == "undefined") ? GM_setValue(key, val) : '';
    defaultValue('yah-1', true);
    defaultValue('yah-2', false);

    // setting
    GM_registerMenuCommand('Setting', () => {
        let modal = document.createElement('div')
        modal.id = 'yah-setting'
        modal.innerHTML = trustedTypes.defaultPolicy.createHTML(`
        <div id="yah-setting">
            <div class="modal-back"></div>
            <div class="modal">
                <h1>show action</h1>
                <label><input type="checkbox" id="yah-1">scroll</label>
                <label><input type="checkbox" id="yah-2">hover top</label>
            </div>
        </div>`)
        document.body.appendChild(modal)

        function col(id) {
            const chk = document.querySelector('#' + id);
            chk.checked = GM_getValue(id);
            chk.addEventListener('change', e => GM_setValue(id, e.currentTarget.checked));
        }
        col('yah-1');
        col('yah-2');
        document.querySelector('#yah-setting .modal-back').addEventListener('click', e => {
            modal.parentNode.removeChild(modal)
        })
    })


    function show() {
        document.querySelector('ytd-app').removeAttribute('masthead-hidden')
    }
    function hide() {
        let act = document.activeElement
        if (act.tagName == 'INPUT' && act.id == 'search') return;
        if (0 <= mouseY && mouseY <= 56) return;
        document.querySelector('ytd-app').setAttribute('masthead-hidden','')
    }

    // scroll
    let interval;
    window.onscroll = () => {
        if (!GM_getValue('yah-1')) return;
        show();
        clearTimeout(interval);
        interval = setTimeout(hide, SHOW_INTERVAL_SCROLL);
    }


    let hover;
    document.addEventListener('mousemove', e => {
        if (!GM_getValue('yah-2')) return;
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (0 <= mouseY && mouseY <= 56) {
            if (!hover) {
                hover = true;
                document.dispatchEvent(new Event('headhover'))
            }
        } else {
            if (hover) {
                hover = false;
                document.dispatchEvent(new Event('headleave'))
            }
        }
    })
    document.addEventListener('mouseleave', e => {
        if (!GM_getValue('yah-2')) return;
        if (hover) {
            hover = false;
            mouseY = -1;
            document.dispatchEvent(new Event('headleave'))
        }
    })

    let over, leave;
    document.addEventListener('headhover', () => {
        if (!GM_getValue('yah-2')) return;
        clearTimeout(over);
        clearTimeout(leave);
        over = setTimeout(show, SHOW_INTERVAL_HOVER);
    })
    document.addEventListener('headleave', () => {
        if (!GM_getValue('yah-2')) return;
        clearTimeout(over);
        clearTimeout(leave);
        leave = setTimeout(hide, HIDE_INTERVAL_HOVER);
    })


    // // blur
    // $(document).on('blur', 'input#search', e => {
    //     e.currentTarget.blur();
    //     hide();
    // });


    // fullscreen
    document.addEventListener('fullscreenchange', e => {
        if (document.fullscreenElement) {
            document.querySelector('html').setAttribute('fullscreen', '')
        } else {
            document.querySelector('html').removeAttribute('fullscreen')
        }
    })
})();
// ==UserScript==
// @name            解除网页复制限制
// @name:en         Copy Enabler
// @namespace       https://tautcony.xyz/
// @license         GPL version 3
// @encoding        utf-8
// @version         0.4
// @description     在Chrome下实现全面的解除网页复制限制
// @description:en  Disable all copy restriction in Chrome
// @date            2020/05/18
// @modified        2020/05/18
// @author          TautCony
// @include         *
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/403673/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403673/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


function _copyEnabler(curr_window) {
    const eventArr = ['contextmenu', 'dragstart', 'mouseup', 'mousedown', 'mousemove', 'copy', 'cut', 'beforecopy', 'selectstart', 'select', 'keydown'];
    function runScript(curr_window) {
        let _jq_ = curr_window.jQuery || curr_window.$j;
        if (typeof _jq_ !== "undefined" && _jq_.toString().includes("[Command Line API]")) {
            _jq_ = undefined;
        }
        if (typeof _jq_ === "undefined") {
            console.warn("No jQuery found");
        }
        const unbind = function (ele) {
            let listeners = {};
            if (typeof getEventListeners === "function") {
                listeners = getEventListeners(ele);
                /* if (Object.keys(listeners).length > 0) console.log(listeners); */
            }
            for (const evt of eventArr) {
                ele['on' + evt] = null;
                if (_jq_) {
                    const jq_ele = _jq_(ele);
                    if (jq_ele.off) jq_ele.off(evt); else if (jq_ele.unbind) jq_ele.unbind(evt);
                }
                if (ele.style && ele.style.userSelect === 'none') ele.style.userSelect = 'text';
                if (listeners[evt]) {
                    for (const handler of listeners[evt]) {
                        ele.removeEventListener(evt, handler.listener, handler.useCapture);
                    }
                }
                try {
                    if (/frame/i.test(ele.tagName)) {
                        if (ele.src.startsWith(curr_window.location.origin)) {
                            runScript(ele.contentWindow);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        [curr_window, curr_window.document].forEach(unbind);
        Array.from(curr_window.document.all).filter(ele => ele.nodeType === Node.ELEMENT_NODE).forEach(unbind);
        (function utanet() {
            const img = document.querySelector('#flash_area>img');
            if (img && img.style) img.style.display = 'none';
        })();
    }
    runScript(curr_window);
}

window.copyEnabler = () => _copyEnabler(window);

document.addEventListener('keydown', (e) => {
    if (e.keyCode = 123) {
        const max_id = setTimeout(()=>{});
        for (let i = 0; i < max_id; ++i) {
            try {
                clearInterval(i);
                clearTimeout(i);
            } catch (ignore) {
            }
        }
    }
}, false);

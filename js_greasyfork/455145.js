// ==UserScript==
// @name         iLearning Player Enhancement
// @version      1.0
// @description  Enhance the iLearning Player (e.g., add more shortcuts...)
// @namespace    https://greasyfork.org/zh-TW/scripts/455145-ilearning-player-enhancement
// @author       ZhiYu
// @match        https://i-learning.cycu.edu.tw/learn/*
// @match        https://lcms.cycu.edu.tw/*
// @icon         https://i-learning.cycu.edu.tw/base/10001/door/tpl/icon.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/663650
// @downloadURL https://update.greasyfork.org/scripts/455145/iLearning%20Player%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/455145/iLearning%20Player%20Enhancement.meta.js
// ==/UserScript==

(function() {
    // ref: https://stackoverflow.com/questions/45702427/userscript-to-bypass-same-origin-policy-for-accessing-nested-iframes
    'use strict';
    const offset = 5;

    function checkVod() {
        return typeof vod !== 'undefined' && vod !== null
    }

    function vodMoveTime(offset) {
        let newTime = vod.currentTime() + offset;
        if(newTime > vod.duration()) newTime = vod.duration();
        else if(newTime < 0) newTime = 0;
        vod.currentTime(newTime);
    }

    function tryVodMoveTime(offset) {
        if (!checkVod()) return;
        let newTime = vod.currentTime() + offset;
        if(newTime > vod.duration()) newTime = vod.duration();
        else if(newTime < 0) newTime = 0;
        vod.currentTime(newTime);
    }
    function tryVodToggle() {
        if (!checkVod()) return;
        if(vod.paused()) {
            vod.play();
        } else {
            vod.pause();
        }
    }

    if (window.location.host === "lcms.cycu.edu.tw" ) {
        // ===== Mount Keydown Listener =====
        // for fast-forward/backward shortcut
        let keydown = function(e) {
            e = e || window.event;
            if (e.keyCode == '38') {
                // up arrow
            } else if (e.keyCode === 40) {
                // down arrow
            } else if (e.keyCode === 37) {
                // left arrow
                tryVodMoveTime(-offset);
            } else if (e.keyCode === 39) {
                // right arrow
                tryVodMoveTime(+offset);
            } else if (e.keyCode === 32) {
                tryVodToggle();
            }
        }
        window.addEventListener('keydown', keydown, false);
        // ===== End Mount Keydown Listener =====


        // ===== Mount Player Control Panel Observer =====
        // keep control panel display
        // to prevent 'div.jp-gui' display:none after pause or fast-forward/backward shortcut
        const config = { attributes: true, childList: false, subtree: false };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    mutation.target.style.display = 'block'
                }
            }
        };

        const observer = new MutationObserver(callback);
        let iii = setInterval(function() {
            let targetNode = document.querySelector('div.jp-gui');
            if (targetNode) {
                observer.observe(targetNode, config);
                clearInterval(iii);
            }
        }, 100)
        // ===== End Mount Player Control Panel Observer =====
    } // if domain=lmcs.cycu.edu.tw
})();
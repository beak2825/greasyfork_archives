// ==UserScript==
// @name         taittsuu-spotlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  タイッツーspotlight
// @author       You
// @license      MIT
// @match        https://taittsuu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taittsuu.com
// @require      https://cdn.jsdelivr.net/npm/spotlight.js@0.7.8/dist/spotlight.bundle.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476398/taittsuu-spotlight.user.js
// @updateURL https://update.greasyfork.org/scripts/476398/taittsuu-spotlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const addedNode = function (node) {
        const post_media = node.querySelector('div.post-media');
        post_media.classList.add('spotlight-group');
        const array = post_media.querySelectorAll('a');
        array.forEach(function(a){
            a.classList.add('spotlight');
        });
    };

    // 変更を監視するノードを選択
    let targetNode = document.querySelector('#posts');
    if(!targetNode) {
        targetNode = document.querySelector('#searchPosts');
    }

    // (変更を監視する) オブザーバーのオプション
    const config = { childList: true };

    // 変更が発見されたときに実行されるコールバック関数
    const callback = function (mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch (mutation.type) {
                case 'childList':
                    if(mutation.addedNodes.length){
                        addedNode( mutation.addedNodes[0] );
                    }
                    break;
            }
        });
    };

    // コールバック関数に結びつけられたオブザーバーのインスタンスを生成
	const observer = new MutationObserver(callback);

    // 対象ノードの設定された変更の監視を開始
    if(targetNode){
        observer.observe(targetNode, config);
    }

})();

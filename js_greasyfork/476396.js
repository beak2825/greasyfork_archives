// ==UserScript==
// @name         taittsuu-lightbox2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  タイッツーlightbox2
// @author       You
// @license      MIT
// @match        https://taittsuu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taittsuu.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js
// @resource     lightboxcss https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/476396/taittsuu-lightbox2.user.js
// @updateURL https://update.greasyfork.org/scripts/476396/taittsuu-lightbox2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    GM_addStyle(GM_getResourceText("lightboxcss"));
    const base = 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/';
    GM_addStyle(
        '.lightbox {z-index: 100000;}\n'+
        '.lb-cancel {background: url(' + base + 'images/loading.gif) no-repeat;}\n'+
        '.lb-nav a.lb-prev {background: url(' + base + 'images/prev.png) left 48% no-repeat;}\n'+
        '.lb-nav a.lb-next {background: url(' + base + 'images/next.png) right 48% no-repeat;}\n'+
        '.lb-data .lb-close {background: url(' + base + 'images/close.png) top right no-repeat;}\n');

    lightbox.option({
        'fadeDuration': 200,
        'imageFadeDuration': 0,
        'resizeDuration': 0
    });

    const addedNode = function (node) {
        const array = node.querySelectorAll('div.post-media > a');
        array.forEach(function(a){
            a.dataset.lightbox = 'lightbox_' + node.id;
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

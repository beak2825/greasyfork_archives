// ==UserScript==
// @name         taittsuu-fslightbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  タイッツーfslightbox
// @author       You
// @license      MIT
// @match        https://taittsuu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taittsuu.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/fslightbox/3.4.1/index.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476397/taittsuu-fslightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/476397/taittsuu-fslightbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const opengallery = function (node, index) {
        let lightbox = new FsLightbox();
        const array = node.querySelectorAll('div.post-media > a');
        array.forEach(function(a,index){
            lightbox.props.sources.push(a.href);
            lightbox.props.type = "image";
        });
        lightbox.open(index);
    };

    const addedNode = function (node) {
        const array = node.querySelectorAll('div.post-media > a');
        array.forEach(function(a,index){
            a.dataset.fslightbox = 'fslightbox_' + node.id;
            a.dataset.index = index;
            a.addEventListener ( 'click', (e) => {
                opengallery(node, a.dataset.index);
                //e.stopPropagation();
                e.preventDefault();
                return false;
            });
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

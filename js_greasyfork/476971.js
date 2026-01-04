// ==UserScript==
// @name         taittsuu-thumbnail-youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  タイッツーthumbnail-youtube
// @author       You
// @license      MIT
// @match        https://taittsuu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taittsuu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476971/taittsuu-thumbnail-youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/476971/taittsuu-thumbnail-youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    GM_addStyle(
        '.thumbnail-youtube-image{max-width:100%;}\n'+
        '.thumbnail-youtube-image:hover{opacity:80%;}\n');

    const addedNode = function (node) {
        //youtube
        var getid = function( url ){
            if( url.match(/^https?:\/\/(?:(?:www\.|m\.|)youtube\.com\/watch\?.*v=|youtu\.be\/)([\w-]+)/) ){return RegExp.$1;}
            var href = url.split('?')[0];
            if( href.match(/.*youtube.com\/shorts\/(.*)/) ){return RegExp.$1;}
            if( href.match(/.*youtube.com\/live\/(.*)/) ){return RegExp.$1;}
            return '';
        }
        var list = [];
        const array = node.querySelectorAll('div.post-content > a');
        array.forEach(function(a,index){
            const id = getid(a.href);
            if(id){
                list.push({href:a.href,id:id});
            }
        });
        if(list.length){
            const target = node.querySelector('.post-content-wrapper > a');
            const div = document.createElement('div');
            div.classList.add('thumbnail-youtube');
            target.append(div);
            list.forEach(function(item){
                const a = document.createElement('a');
                a.classList.add('thumbnail-youtube-link');
                a.target = '_blank';
                a.href = item.href;
                a.innerHTML = '<img class="thumbnail-youtube-image" src="https://i.ytimg.com/vi/'+item.id+'/mqdefault.jpg">';
                div.append(a);
            });
        }
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

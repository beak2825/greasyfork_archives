// ==UserScript==
// @name        Twitter GIFs fullscreener
// @namespace   Create fullscreen icon over twitter GIFs post to allows toggle full screen mode
// @match       https://twitter.com/*
// @grant       none
// @version     1.0
// @author      aleha_84
// @description 22.05.2022, 18:24:12
// @downloadURL https://update.greasyfork.org/scripts/445385/Twitter%20GIFs%20fullscreener.user.js
// @updateURL https://update.greasyfork.org/scripts/445385/Twitter%20GIFs%20fullscreener.meta.js
// ==/UserScript==

console.log('hello there from injected script!')

let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {

        if( mutation.addedNodes) {
            for(let addedNode of mutation.addedNodes) {
                findVideoElement(addedNode);
            }
        }
     }
 });

 let createBtn = function(node) {

    if(node.parentNode.parentNode.parentNode.querySelector('span') == null)
        return;

    let btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'FS';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '100000000';
    btn.style.visibility = 'hidden';
    btn.onclick = () => {
        node.requestFullscreen();
    }

    node.parentNode.parentNode.parentNode.addEventListener('mouseover', function () {
        btn.style.visibility = '';
    });
    node.parentNode.parentNode.parentNode.addEventListener('mouseout', () => {
        
        btn.style.visibility = 'hidden';
    })

    node.insertAdjacentElement('afterend', btn);
 }

 let findVideoElement = (node) => {
    if(node.nodeName === 'VIDEO') {
        setTimeout(() => 
        {
            createBtn(node);
        },
        20);

        return;
    }

    if(node.childNodes) {
        for(let childNode of node.childNodes) {
            findVideoElement(childNode);
        }
    }
 }

 observer.observe(document, { childList: true, subtree: true });
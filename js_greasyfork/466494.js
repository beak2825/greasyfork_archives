// ==UserScript==
// @name         Better WeRead
// @namespace    http://fastgo.vip/
// @version      0.1.3
// @description  Let WeRead display better
// @license      GNU
// @author       AaronW
// @match        https://weread.qq.com/web/reader/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466494/Better%20WeRead.user.js
// @updateURL https://update.greasyfork.org/scripts/466494/Better%20WeRead.meta.js
// ==/UserScript==

function $(el){
  return document.querySelector(el);
}

let wrpWidth;

function updateImg() {
    document.querySelectorAll('.passage-content img').forEach(img => {
        if (img.classList.contains('kindle-cn-inline-image1')) return
        img.style.width = 'inherit';
        img.style.height = 'inherit';
        let transform = img.style.transform;
        let imgWidth = img.getAttribute('data-w');
        imgWidth = imgWidth.substr(0, imgWidth.length - 2)

        console.log('imgWidth', imgWidth);


        transform = transform.replace(/\(.*px,/, `(${(wrpWidth - imgWidth) / 2}px,`);
//        let translatePos = /\(.*\)$/.exec(transform)[0];
//        let transY = translatePos.split(",")[1];
        console.log('new transform: ', transform)
        img.style.transform = transform;
    })
}

(function() {
    'use strict';
    console.log("script loaded");
    let content = document.querySelector('.readerContent .app_content');
    content.style['max-width'] = window.innerWidth + "px";

    content.addEventListener('DOMNodeInserted', () => {
        wrpWidth = $('#renderTargetContent').getBoundingClientRect().width;

    console.log("wrp width", wrpWidth);
        updateImg()
        content.removeEventListener('DOMNodeInserted', () => {});
    })

    $('.readerTopBar').style['max-width'] = "inherit";
})();
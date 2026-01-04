// ==UserScript==
// @name         【已失效】Bilibili 黄嘉琪小助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  生成评论区伪装链接
// @author       as042971
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @license MIT
// @grant        none
// @esversion    8
// @downloadURL https://update.greasyfork.org/scripts/439620/%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91Bilibili%20%E9%BB%84%E5%98%89%E7%90%AA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439620/%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91Bilibili%20%E9%BB%84%E5%98%89%E7%90%AA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const solveInput = function(input) {
        const reg = /BV[A-Za-z0-9]{10}/;
        const result = reg.exec(input);
        if (result) {
            const bvID = result[0];
            const avID = window.aid;
            const link = 'http://b23.tv/av' + avID + '?' + bvID;

            // 复制到剪贴板
            let aux = document.createElement("input");
            aux.setAttribute("value", link);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
        }
    }

    const inject = function(box) {
        let fakeDiv = document.createElement('div');
        fakeDiv.setAttribute('class','share-link');
        let fakeInput = document.createElement('input');
        fakeInput.setAttribute('type','text');
        fakeInput.setAttribute('placeholder', '在这里粘贴封面视频地址…');
        let fakeBtn = document.createElement('span');
        fakeBtn.setAttribute('class','btn');
        fakeBtn.innerHTML = '生成诈骗链接';

        fakeBtn.onclick = () => {
            solveInput(fakeInput.value);
        }

        fakeDiv.appendChild(fakeInput);
        fakeDiv.appendChild(fakeBtn);
        box.appendChild(fakeDiv);
    };

    const injectOld = function(box) {
        let fakeLi = document.createElement('li');
        let fakeTitle = document.createElement('span');
        fakeTitle.setAttribute('class','name');
        fakeTitle.innerHTML = '诈骗链接';
        let fakeInput = document.createElement('input');
        fakeInput.setAttribute('type','text');
        fakeInput.setAttribute('placeholder', '在这里粘贴封面视频地址…');
        let fakeBtn = document.createElement('span');
        fakeBtn.setAttribute('class','btn');
        fakeBtn.innerHTML = '生成';
        fakeBtn.onclick = () => {
            solveInput(fakeInput.value);
        }
        fakeLi.appendChild(fakeTitle);
        fakeLi.appendChild(fakeInput);
        fakeLi.appendChild(fakeBtn);
        box.appendChild(fakeLi);
    }

    let body = document.body;
    let observerOptions = {
      childList: true,
      attributes: false,
      subtree: false
    };

    let observer = new MutationObserver((mutation_records) => {
        let box = document.querySelector('.box-left');
        if (box) {
            inject(box);
            observer.disconnect();
        }
        let oldBox = document.querySelector('.share-address');
        if (oldBox) {

            injectOld(oldBox.childNodes[2]);
            observer.disconnect();
        }
    });
    observer.observe(body, observerOptions);
})();
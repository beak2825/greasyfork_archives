// ==UserScript==
// @name         ShowPic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  excited!
// @author       You
// @license      MIT
// @include        http://*zerobyw*/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/490825/ShowPic.user.js
// @updateURL https://update.greasyfork.org/scripts/490825/ShowPic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let chapterDiv = document.querySelector('.uk-grid-collapse.uk-child-width-1-4.uk-grid');
    if (!!chapterDiv) {
        let chapterList = [];
        let childs = [...chapterDiv.children];
        for (const child of childs) {
            chapterList.push(child.children[0].href);
        }
        GM_setValue('chapterList', chapterList);
        GM_setValue('nowChapter', 0);
        console.log(chapterList);
        return;
    }



    let msg = document.querySelector('.uk-alert.uk-alert-danger.uk-text-center')?.innerText;
    if (!!msg && msg.includes('vip观看')) {
        //debugger;
        let regex = /http(s)?:[\w.\/\\-]+\.(jpg|png|gif){1}/g;
        let imgText = document.querySelector('#jameson_manhua').children[8].innerText;
        let imgList = imgText.match(regex);
        let mapRes = imgList.map((cur, index, arr) => { return cur.replaceAll('\\', ''); })
        console.log(mapRes);
        GM_setValue('imgList', mapRes);
        GM_setValue('nowPage', 0);
        let chapterList = GM_getValue('chapterList');
        let nowChapter = chapterList.findIndex(item => item == window.location.href);
        GM_setValue('nowChapter', nowChapter);
        GM_openInTab(mapRes[0], { active: true });
        return;
    }

    //debugger;
    let imgs = GM_getValue('imgList');
    //let nowPage = GM_getValue('nowPage');
    let chapterList = GM_getValue('chapterList');
    let nowChapter = GM_getValue('nowChapter');
    let nowPage = imgs.findIndex(item =>
                                 item == window.location.href);

    let b1 = document.createElement('button');
    b1.textContent = '前';
    b1.classList.add('floating-button');
    b1.style.bottom="160px";

    let b2 = document.createElement('button');
    b2.textContent = '后';
    b2.classList.add('floating-button');
    b2.style.bottom="110px";

    let b3 = document.createElement('button');
    b3.textContent = '上';
    b3.classList.add('floating-button');
    b3.style.bottom="60px";

    let b4 = document.createElement('button');
    b4.textContent = '下';
    b4.classList.add('floating-button');
    b4.style.bottom="10px";

    let div = document.createElement('div');
    let pageId = Number(nowPage) + Number(1);
    div.innerText = 'now page: ' + pageId + '\nall page: ' + imgs.length;
    div.style.position="fixed";
    div.style.right="20px";

    document.body.append(b1);
    document.body.append(b2);
    document.body.append(b3);
    document.body.append(b4);
    document.body.append(div);

    let url = window.location.href;
    let last = url.lastIndexOf('/');
    let index = url.substring(last + 1);
    let page = index.split('.')[0];
    let newIndex;
    let newChapter;

    b1.addEventListener('click', () => {
        newIndex = Number(nowPage) - Number(1);
        if (newIndex < 0) {
            alert('finish');
            return;
        }
        GM_setValue('nowPage', newIndex);
        window.location.href = imgs[newIndex];
    });

    b2.addEventListener('click', () => {
        newIndex = Number(nowPage) + Number(1);
        if (newIndex >= imgs.length) {
            alert('finish');
            return;
        }
        GM_setValue('nowPage', newIndex);
        window.location.href = imgs[newIndex];
    });

    b3.addEventListener('click', () => {
        newChapter = Number(nowChapter) - Number(1);
        window.location.href = chapterList[newChapter];
    });

    b4.addEventListener('click', () => {
        newChapter = Number(nowChapter) + Number(1);
        if (newChapter >= chapterList.length) {
            alert('finish');
            return;
        }
        window.location.href = chapterList[newChapter];
    });

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 37) {
            console.log('按下左');
            b1.click();
        }
    })

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 39) {
            console.log('按下右');
            b2.click();
        }
    })
    addStyle();
    let img = document.querySelector('.shrinkToFit');
    if(!!img){
        img.style.position="static";
    }

})();

function addStyle() {
    let css = `
    .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        background: #f4524d;
        color: #fff;
        font-size: 24px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
      .floating-button:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transform: translateY(-5px);
      }
      .floating-button:active {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: translateY(2px);
      }
    `
    GM_addStyle(css)
}

// ==UserScript==
// @name         Yuntech Eclass 按鍵控制影片
// @name:en         Yuntech Eclass Video controls
// @description  按鍵控制影片
// @description:en  Video controls with keyboard
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       BeenYan
// @match        https://eclass.yuntech.edu.tw/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        GM_addStyle
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/443858/Yuntech%20Eclass%20%E6%8C%89%E9%8D%B5%E6%8E%A7%E5%88%B6%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/443858/Yuntech%20Eclass%20%E6%8C%89%E9%8D%B5%E6%8E%A7%E5%88%B6%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==
GM_addStyle(`
.add, .decrease {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0px;
    bottom: 0px;
    margin: auto 0px;
    width: 180px;
    height: 180px;
    background-color: rgba(0,0,0,.4);
    border-radius: 50%;
    z-index: 100;
    right: 10%;
    font-size: 24px
}

.decrease {
    right: unset;
    left: 10%;
}
`);
(() => {
    'use strict';
    const AddElement = document.createElement('div');
    AddElement.className = 'add';
    AddElement.innerText = '快進五秒 > >';
    const DecreaseElement = document.createElement('div');
    DecreaseElement.className = 'decrease';
    DecreaseElement.innerText = '< < 到退五秒';

    function showSecondChange(Video, element){
        if (secondElement !== undefined)
            secondElement.remove();
        secondElement = element.cloneNode(true);
        Video.parentNode.append(secondElement);
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            secondElement.remove();
        }, 1000);
    }

    let secondElement;
    let timeOut;

    window.addEventListener('keydown', (event) => {
        const Video = document.querySelector('video');
        const KeyCode = event.keyCode;

        if (KeyCode === 39) { // right
            Video.currentTime += 5;
            showSecondChange(Video, AddElement);
        } else if (KeyCode === 37) { // left
            Video.currentTime -= 5;
            showSecondChange(Video, DecreaseElement);
        } else if (KeyCode === 32) { // space
            if (Video.paused) {
                Video.play()
            } else {
                Video.pause()
            }
        }
    }
                           );
})();
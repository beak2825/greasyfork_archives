// ==UserScript==
// @name        隐藏chatGPT头像
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  用来隐藏chatGPT上的头像,以便截图时不泄露个人信息,点击页面左侧按钮,即可实现隐藏头像和用户名
// @author       loran
// @match        https://chat.openai.com/*
// @icon         //https://chat.openai.com/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464952/%E9%9A%90%E8%97%8FchatGPT%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/464952/%E9%9A%90%E8%97%8FchatGPT%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==
(function () {
    //'use strict';
    let button = document.createElement('button');
    button.innerHTML = '隐藏头像';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '0px';
    button.style.background = '#fae69e';
    button.style.color = '#343541';
    button.style.fontFamily = 'font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;'
    button.style.fontSize = '12px'
    button.style.borderRadius = '6px'
    button.style.padding = '4px 8px'
    button.style.border = '0px solid rgb(217, 217, 227)'
    button.style.fontWeight='700'
    document.body.appendChild(button);


    button.addEventListener('click', () => {

        let grow = document.getElementsByClassName('grow')[0];
        let prompt = grow.innerHTML.trim();
        let imgs = document.querySelectorAll(`img[alt="${prompt}"]`);
        console.log(grow);
        console.log(prompt);
        console.log(imgs);

        // if (button.innerHTML === '隐藏头像') {

        //     showHide('none', '显示头像')

        // } else if (button.innerHTML === '显示头像') {

        //     showHide('block', '隐藏头像')

        // }

        showHide('none', '隐藏头像');

        function showHide(isShow, btnContent) {

            if (prompt) {

                for (const key in imgs) {

                    if (imgs.hasOwnProperty.call(imgs, key)) {

                        const element = imgs[key];
                        element.style.display = isShow;
                        grow.style.display = isShow;
                        button.innerHTML = btnContent;

                    }

                }

            }

        }

    });

})();

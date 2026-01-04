// ==UserScript==
// @name         QqoneAutoClick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个QQ空间点赞脚本
// @author       jgckM
// @match        *://user.qzone.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446914/QqoneAutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/446914/QqoneAutoClick.meta.js
// ==/UserScript==
(function () {
    let style = document.createElement('style');
    let body = document.querySelector('body');
    style.innerHTML =
        '.box{position:fixed;top:200px;left:10px;min-width:100px;max-width:200px;width:auto;padding:10px;display:flex;justify-content:center;align-items:center;box-shadow:none;border-radius:10px;border:1px solid #a0a0a0;background-color:#f7f7f9;transition:left 0.3s cubic-bezier(0.03,0.21,0,1.32)}.box label{font-size:18px}.box input{border:1px solid #a0a0a0;outline:none;min-width:40px;border-radius:5px;max-width:60px}.box button{border-radius:5px;border-width:1px;width:50px}.box .toggle{font-size:14px;text-align:center;position:absolute;right:-20px;width:20px;height:40px;background-color:darkgray;border-radius:5px}';
    body.appendChild(style);
})();

window.addEventListener('load', function () {
    // Removeiframe();
    let box = document.createElement('div');
    let body = document.querySelector('body');
    box.className = 'box';
    box.innerHTML = ` <form action="javascript:void(0)">
    <label>点赞数量</label>
    <input class="clicknum" required type="number" value="100" max="999" />
    <button class="start">开始</button>
    <label>滚动速度</label>
    <input class="speed" required type="number" value="260" max="999" />
    /ms
</form>
<div class="toggle">收起</div>`;
    body.appendChild(box);

    // function Removeiframe() {
    //     let iframes = document.querySelectorAll('iframe');
    //     iframes.forEach(function (iframe) {
    //         iframe.remove();
    //     });
    // }

    let start = document.querySelector('.box .start');
    let clicknum = document.querySelector('.box .clicknum');
    let toggle = document.querySelector('.box .toggle');
    let speed = document.querySelector('.box .speed');
    let timer = null;
    let flag = true;
    start.addEventListener('click', function () {
        clearInterval(timer);
        if (flag) {
            this.innerHTML = '暂停';
            timer = window.setInterval(autoClick, speed.value);
            flag = false;
        } else {
            clearInterval(timer);
            this.innerHTML = '开始';
            flag = true;
        }
    });
    let toggleFlage = true;
    toggle.addEventListener('click', function () {
        if (toggleFlage) {
            this.innerHTML = '展开';
            box.style.left = '-220px';
            toggleFlage = false;
        } else {
            box.style.left = '10px';
            toggleFlage = true;
            this.innerHTML = '收起';
        }
    });
    let y = 0,
        x = 0,
        index = 0;

    function autoClick() {
        // Removeiframe();
        y = y + 5;
        let zan = document.getElementsByClassName('item qz_like_btn_v3');
        for (let i = 0; i < zan.length; i++) {
            if (clicknum.value < index) {
                clearInterval(timer);
                start.innerHTML = '开始';
                alert(`${clicknum.value}个点赞任务已完成`);
                index = 0;
                break;
            }
            if (zan[i].attributes[6].value == 'like') {
                zan[i].firstChild.click();
                console.log(index);
                index++;
            }
        }
        window.scrollBy(x, y);
    }
});

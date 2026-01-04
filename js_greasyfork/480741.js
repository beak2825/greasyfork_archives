// ==UserScript==
// @name         💯【U校园】挂必修学习时长防检测
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  🚀针对U校园，实现在必修章节保持挂机积累学习时长
// @author       ConRain7
// @match        https://ucontent.unipus.cn/_pc_default/pc.html?cid=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480741/%F0%9F%92%AF%E3%80%90U%E6%A0%A1%E5%9B%AD%E3%80%91%E6%8C%82%E5%BF%85%E4%BF%AE%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF%E9%98%B2%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480741/%F0%9F%92%AF%E3%80%90U%E6%A0%A1%E5%9B%AD%E3%80%91%E6%8C%82%E5%BF%85%E4%BF%AE%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF%E9%98%B2%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 定义启动滚动的时间（毫秒）
    let intervalArticle = getRandomInterval(2, 3) * 1000; 
    let intervalLeft = getRandomInterval(4, 7) * 1000; 
    let intervalRight = getRandomInterval(5, 11) * 1000; 

    // 开始滚动
    setTimeout(scrollArticle, intervalArticle);
    setTimeout(scrollLeft, intervalLeft);
    setTimeout(scrollRight, intervalRight);


    function scrollArticle() {
        let element = document.querySelector('.presentationContent--presentation-article-1vwbU');
        if (element) {
            let scrollAmount = element.clientHeight; 
            element.scrollBy(0, scrollAmount);
        }
        setTimeout(scrollArticle, getRandomInterval(2, 300) * 1000);
    }

    
    function scrollLeft() {
        let element = document.querySelector('.undefined.left');
        if (element) {
            let scrollAmount = element.clientHeight; 
            element.scrollBy(0, scrollAmount);
        }
        setTimeout(scrollLeft, getRandomInterval(4, 400) * 1000);
    }

   
    function scrollRight() {
        let element = document.querySelector('.undefined.right');
        if (element) {
            let scrollAmount = element.clientHeight / 2; 
            element.scrollBy(0, scrollAmount);
        }
        setTimeout(scrollRight, getRandomInterval(1, 500) * 1000);
    }
    ///////////////////////////////
       setTimeout(() => {
        //关闭必修提示弹窗
        var x = document.getElementsByClassName("dialog-header-pc--close-yD7oN"); x[0].click();
        document.querySelector("div.dialog-header-pc--dialog-header-2qsXD").parentElement.querySelector('button').click();
    }, 2500);



    function getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})();


// 弹窗
(function() {
    'use strict';


    const modalCSS = `
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        max-width: 34%;
        max-height: 80%;
        overflow: auto;
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    .close:hover,
    .close:focus {
        color: black;
        cursor: pointer;
    }
    `;


    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = modalCSS;
    document.head.appendChild(style);


    const modalHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h1>欢迎使用U校园学习时长脚本</h1><br>
            <h2>U校园学习时长计分规则：</h2>
            <p>学习时长大于等于20小时得满分；小于等于0小时不得分；学习时长在0小时至20小时之间，得分为学习时长/20*100*20%。</p>
            <h2>U校园学习时长统计规则：</h2>
            <p>各必修Task学习时长相加后的累计时长。PC端和App端同时在线学习时，系统只记录其中最近活跃一端的学习时间。</p>
            <h2>脚本使用方法：</h2>
            <p>打开U校园对应必修学习章节后挂机即可，本脚本会定时翻滚页面，防止出现“长时间未操作”而导致的学习时间无法计入的情况。</p>
            <h2>注意：</h2>
            <p>※本脚本目前仅支持U校园Reading comprehension和Reading in detail两个模块的挂机，二者任选其一即可。
            <br>※挂机时请勿最小化浏览器，防止脚本失灵。</p>
            <p>作者/GitHub：@ConRain7
            <br>2023.11.25</p>
        </div>
    </div>
    `;


    document.body.insertAdjacentHTML('beforeend', modalHTML);


    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];


    modal.style.display = "flex";


    span.onclick = function() {
        modal.style.display = "none";
    };


    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
})();
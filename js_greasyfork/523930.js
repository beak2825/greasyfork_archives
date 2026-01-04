    // ==UserScript==
    // @name         视频3倍数播放
    // @namespace    http://tampermonkey.net/
    // @version      2025-01-15
    // @description  哔哩哔哩视频3倍数播放，Alt+0隐藏/显示脚本界面
    // @author       I6xn-Xc
    // @match        *://www.bilibili.com/video/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523930/%E8%A7%86%E9%A2%913%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523930/%E8%A7%86%E9%A2%913%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.meta.js
    // ==/UserScript==
    (function() {
        'use strict';
        const style = document.createElement('style');
        style.innerHTML = `

     #box-all {
            position: absolute;
            width: 280px; /* 增加宽度以确保有足够空间 */
            height: 180px;
            top: 100px;
            z-index: 9999; /* 提高z-index值 */
            background-color: rgba(255, 255, 255, 0.9); /* 添加背景色以提高可见性 */
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .form-group {
            display: flex;
            align-items: center; /* 垂直居中 */
            margin-bottom: 10px; /* 控制组之间的间距 */
            margin-top: 36px;

        }

        .form-group span {
            margin-right: 10px; /* 控制 label 和 input 之间的间距 */
            min-width: 60px; /* 确保标签宽度一致 */
            text-align: right; /* 右对齐标签文本 */


        }

        .inp_all {
            width: 60px; /* 增加输入框宽度 */
            height: 30px;
            border-radius: 5px;
            border: 1px solid #8BC34A;
        }

        #box-all button {
            z-index: 9998; /* 提高z-index值 */
            height: 40px; /* 固定高度 */
            width: auto; /* 自适应宽度 */
            min-width: 80px; /* 最小宽度 */
            text-align: center;
            border-radius: 30px;
            margin-top: 10px;
            background-color: transparent;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
            cursor: pointer;
            color: #424242;
            border: 1px solid #132217;
            flex-grow: 1; /* 让按钮在容器中均匀分布 */
        }

        #disabled-but {
            margin-left: 10px; /* 调整间距 */
        }

        #but-box {
            display: flex;
            justify-content: space-between; /* 水平排列 */
            align-items: center; /* 垂直居中 */
            margin-top: 50px;
            flex-wrap: nowrap; /* 确保不换行 */
        }
`;
        document.head.appendChild(style);
        const box_all = document.createElement('div');
        box_all.id = 'box-all';
        box_all.innerHTML = `
<div class="form-group">
    <span>倍数</span>
    <input id="speed--inp" class="inp_all" type="text" placeholder="Speed" value="1">
</div>
<div id="but-box">
    <button id="btn-sub">设置</button>
    <button id="disabled-but">隐藏按钮</button>
</div>
`;
        document.body.appendChild(box_all);
        let btt_sub = document.getElementById('btn-sub');
        let btt_dis = document.getElementById('disabled-but');
        let speed_num = document.getElementById('speed--inp');
        let my_speed = '';
        let initialHref = '';
        document.getElementsByTagName("video")[0].classList.add('real-video')
        let real_video=document.querySelector('.real-video');
        const regex = /\/video\/(BV[0-9A-Za-z]+)/;
        function isNumeric(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
        // sub按钮点击
        btt_sub.addEventListener('click', () => {
            if (isNumeric(speed_num.value)) {
                // 输入的是数字
                initialHref=location.href.match(regex)[1]
                my_speed = speed_num.value;
                alert(`设置倍数-->${my_speed}`)
                if (my_speed !== '') {
                    my_speed=speed_num.value;
                    real_video.playbackRate=parseFloat(my_speed);
                }
            } else {
                alert('输入框内请输入整数,speed默认不输为1')
            }
        });
        function handleVideoPlay(e){
            e.target.classList.add('real-video');
            my_speed=my_speed===''?'1':my_speed;
            if (location.href.match(regex)[1]===initialHref){
                // 同一个合集
                real_video.playbackRate = parseFloat(my_speed);
            }else {
            }
        }
        document.addEventListener('play', handleVideoPlay, true);
        // 按钮隐藏
        btt_dis.addEventListener('click', () => {
            box_all.style.display = 'none'; // 隐藏整个 div
        });
        document.addEventListener('keydown', function (event) {
            if (event.altKey && event.key === '0') {
                if (box_all.style.display === 'block') {
                    box_all.style.display = 'none'
                } else {
                    box_all.style.display = 'block'
                }
            }
        });
    })();
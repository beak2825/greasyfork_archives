// ==UserScript==
// @name         UESTC防止暂停
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  阻止dxpx学习平台暂停和弹窗，并自动切换视频
// @match        https://dxpx.uestc.edu.cn/jjfz/play*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495473/UESTC%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/495473/UESTC%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==
/*
该脚本默认是针对积极分子刷课的，为了简单和稳定起见，将所有视频观看页面写入到列表中，该脚本会自动切换小节的视频，并在所有小节看完后切换到下一个视频。
如果需要改成其他课别：
1. 修改第6行中的@match为需要启用的网页
2. 修改下面的urls列表(需要手动收集)
*/

var urls = [
    // 第一章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7287&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7288&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7289&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7290&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7292&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7293&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7295&r=video&t=2&pg=1",
    // 第二章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7335&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7337&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7342&r=video&t=2&pg=1",
    // 第三章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7368&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7369&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7370&r=video&t=2&pg=1",
    // 第四章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7388&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7389&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7391&r=video&t=2&pg=1",
    // 第五章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7412&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7413&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7414&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=8759&r=video&t=2&pg=1",
    // 第六章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7431&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7432&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7433&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7434&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7440&r=video&t=2&pg=1",
    // 第七章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7442&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7444&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7445&r=video&t=2&pg=1",
    // 第八章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7452&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7453&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7457&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7461&r=video&t=2&pg=1",
    // 第九章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7487&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7488&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7490&r=video&t=2&pg=1",
    // 第十章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7514&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7515&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7516&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7520&r=video&t=2&pg=1",
    // 第十一章
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7546&r=video&t=2&pg=1",
    "https://dxpx.uestc.edu.cn/jjfz/play?v_id=7549&r=video&t=2&pg=1"
];

(function() {
    'use strict';

    // 保存原始的 player.pause 函数
    var originalPause = player.pause;

    // 重写 player.pause 函数,禁止暂停
    player.pause = function() {
        window.clearTimeout(flag);
        clearInterval(timer);   //定时器清除；

        // 不执行任何操作，不暂停媒体的播放
        console.log('阻止播放暂停....');
    };

    // 如果是已播放完的暂停状态开始
    if(player.paused)
    {
        player.play();
    }

    // 重写弹窗函数
    window.public_alert = function public_alert(s, i, t, e, l, n) {
        $(".public_close").click(function () {
            console.log("跳过弹窗");
        });

        if (s == 1) {
            if (t.includes("当前视频播放完毕")) // 自动跳转到下一个视频
            {
                const itemList = document.querySelector("body > div.wrap_video > div.video_fixed.video_cut > div:nth-child(5) > ul");
                let currentVideoIndex = 0;

                // 遍历列表中的每个项
                for (let i = 0; i < itemList.children.length; i++) {
                    const item = itemList.children[i];
                    // 检查item是否为class 'video_red1'
                    // 检查item是否具有class 'video_red1'
                    if (item.classList.contains('video_red1')) {
                        // 如果找到具有指定class的item，跳出循环
                        currentVideoIndex = i;
                        break;
                    }
                }

                if (currentVideoIndex + 1 < itemList.children.length) {
                    // 获取下一个视频的链接
                    const nextVideo = itemList.children[currentVideoIndex + 1];
                    const relativePath = nextVideo.querySelector("a").getAttribute("href");
                    const absolutePath = "https://dxpx.uestc.edu.cn" + relativePath;
                    // 跳转到下一个视频
                    window.location.href = absolutePath;
                } else {
                    // 当前播放视频为最后一个视频，跳转到下一个列表
                    let index = parseInt(localStorage.getItem('index')) || 0;
                    index = (index + 1) % urls.length;
                    localStorage.setItem('index', index);
                    window.location.href = urls[index];
                }
            }
            else
            {
                l();
            }
        } else {
            n();
        }
    }




})();
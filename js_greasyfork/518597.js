// ==UserScript==
// @name         UOOC_优课刷课_sztu软件工程
// @namespace    https://www.sztu.edu.cn/
// @version      2024-11-24
// @license      MPL
// @description  该刷课网站会自动跳转到未刷的课自动播放，章节测试会被跳过，请自行完成章节测试。
// @author       somebody in SZTU
// @include      http://www.uooc.net.cn/home/learn/index*
// @include      https://www.uooc.net.cn/home/learn/index*
// @match        http://www.uooc.net.cn/home/learn/*
// @match        https://www.uooc.net.cn/home/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518597/UOOC_%E4%BC%98%E8%AF%BE%E5%88%B7%E8%AF%BE_sztu%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518597/UOOC_%E4%BC%98%E8%AF%BE%E5%88%B7%E8%AF%BE_sztu%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B.meta.js
// ==/UserScript==

/*调试信息*/
//视频倍速
let speed = 2;
//视频静音
let mute = true;

(function () {
    "use strict";

    // 寻找未刷的课
    async function searchUncomplete(query){
        return new Promise(async (resolve) => {
            let catalog = query.children;
            for (let i = 0; i < catalog.length; i++) {
                // 寻找第一层列表的可点击元素
                await checkActive(catalog[i]);
            }
            resolve();
        })
    }

    // 检测是否未刷
    async function checkActive(catalog){
        return new Promise(async (resolve) => {
            let children = catalog.children
            // 检测是否未刷：是否未刷通过子元素第一个的class列表来获取
            let elem = catalog?.firstElementChild;
            if (elem && elem.classList.contains("uncomplete") && !elem.innerText.includes("测试")) {
                console.log("搜寻"+elem.innerText);
                // 检测是否已经打开：查找该元素中的 <i> 标签，检测class
                let iElement = elem.getElementsByTagName("i")[0];
                if(iElement.classList.contains("icon-xiangxia")){
                    elem.click();
                }
                console.log("found ");
                await sleep(1000); // 等待 1000 毫秒
                console.log("查找")
                // 未刷则检测所有子元素，重点查看<div>是否是任务点、<ul>则递归使用检测未刷
                for(let i = 1; i < children.length; i++){
                    // 如果是div，则有可能是未完成的任务节点，是则点入。
                    if(children[i].tagName==="DIV" && children[i]?.firstElementChild && !children[i].firstElementChild.classList.contains("complete")){
                        let spanElem = children[i].firstElementChild.children[1]

                        if(spanElem.classList.contains("taskpoint") && !spanElem.innerText.includes("测验")){
                            children[i].firstElementChild.click();
                            console.log("等待视频播放完毕...");
                            clearShader();
                            await waitForCondition();
                        }
                    }
                    // 如果不是div，则继续递归寻找未完成的课
                    else if(children[i].tagName==="UL"){
                        await searchUncomplete(children[i]);
                    }
                }
            }
            resolve();
        })
    }

    // 避免视频失去焦点 + 检测视频是否播放完毕
    function waitForCondition() {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                let videoButton = document.getElementsByClassName(
                    "vjs-big-play-button animated fadeIn"
                )[0];
                if (videoButton !== undefined) {
                    let video = document.getElementById("player_html5_api");
                    video.onended = function() {
                        console.log("视频播放完毕");
                        clearInterval(intervalId);
                        resolve();
                    };
                    video.muted = mute;
                    video.playbackRate = speed;
                    videoButton.click();
                }
            }, 1000);
        });
    }

    // 阻塞辅助
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 清理全屏灰色遮罩
    function clearShader() {
        let shaders = document.querySelectorAll("div.layui-layer-shade");
        shaders.forEach(shader => {
            shader.remove(); // 删除每一个遮罩层
        });
    }

    $(document).ready(function () {
        // 等待元素加载完成
        setTimeout(()=>{
            searchUncomplete(document.querySelectorAll("ul.rank-1")[0]);
        }, 1000); // 延迟2秒等待元素加载
    });
})();

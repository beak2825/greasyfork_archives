// ==UserScript==
// @name         扇贝背单词专用
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  删除释义删除单词
// @author       五显庙挖机老师傅
// @match        https://web.shanbay.com/wordsweb/*
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443088/%E6%89%87%E8%B4%9D%E8%83%8C%E5%8D%95%E8%AF%8D%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443088/%E6%89%87%E8%B4%9D%E8%83%8C%E5%8D%95%E8%AF%8D%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

window.onload = function() {
    // 生词本功能
    // 删除释义
    var state1 = 0;
    var items1 = document.getElementsByClassName(
        "CollectionList_definitionCn__3MoTq"
    );

    delete_definition = function() {
        if (state1 == 0) {
            for (let i = 0; i < items1.length; i++) {
                items1[i].style.display = "none";
            }
            state1 = 1;
            clonedNode1.innerHTML = "删除释义-还原"; // 修改文字
        } else {
            for (let i = 0; i < items1.length; i++) {
                items1[i].style.display = "block";
            }
            state1 = 0;
            clonedNode1.innerHTML = "删除释义"; // 修改文字
        }
    }

    // 删除单词
    var state2 = 0;
    var items2 = document.getElementsByClassName("CollectionList_word__7zQwd");

    delete_word = function() {
        if (state2 == 0) {
            for (let i = 0; i < items2.length; i++) {
                items2[i].style.display = "none";
            }
            state2 = 1;
            clonedNode2.innerHTML = "删除单词-还原"; // 修改文字
        } else {
            for (let i = 0; i < items2.length; i++) {
                items2[i].style.display = "block";
            }
            state2 = 0;
            clonedNode2.innerHTML = "删除单词"; // 修改文字
        }
    };

    // 自动播放
    var state3 = 0;

    auto_play = function() {
        if (state3 == 0) {
            state3 = 1;
            // 注意，此功能只适用于生词本-未学单词
            // 1.显示当前页数（扇贝bug从第5页后无法显示页码）
            var state4 = 1;
            var pageBtn = document.querySelector(".index_pageContainer__2l7E1"); //翻页父节点
            var pageBtn_clonedNode1 = pageBtn.children[1].cloneNode(true); // 克隆节点
            pageBtn.firstChild.setAttribute("onClick", "pageUp()"); // 监听上一页
            pageBtn.lastChild.setAttribute("onClick", "pageDown()"); // 监听下一页
            pageBtn.appendChild(pageBtn_clonedNode1); // 在父节点插入克隆的节点

            var pageUp = function () {
                state4 = parseInt(pageBtn_clonedNode1.innerText) - 1;
                pageBtn_clonedNode1.innerHTML = state4;
            };
            var pageDown = function () {
                state4 = parseInt(pageBtn_clonedNode1.innerText) + 1;
                pageBtn_clonedNode1.innerHTML = state4;
            };
            clonedNode3.innerHTML = "自动播放-开始"; // 修改文字
        } else {
            state3 = 0;
            // 2.自动播放-生词本
            let word = document.getElementsByClassName("Pronounce_audio__3xdMh");
            // 初始化播放
            function play() {
                let i = -1;
                let word_interval = setInterval(() => {
                    if (i <= 9) {
                        let step1 = setTimeout(() => {
                            word[i].click();
                            clearTimeout(step1);
                        }, 1500);
                        i++;
                    } else {
                        pageBtn.lastChild.previousElementSibling.click(); // 下一页
                        clearInterval(word_interval);
                    }
                }, 2000);
            }
            let page_interval = setInterval(() => {
                play();
            }, 22000);
            clonedNode3.innerHTML = "自动播放-等待"; // 修改文字
        }
    };

    // 生词本->未学单词
    // 克隆节点
    var upload = document.querySelector(".index_batchUploadBtn__37bsL"); //批量上传按钮
    var upload_father = document.querySelector(".index_right__1uJCb"); //批量上传父节点
    var clonedNode1 = upload.cloneNode(true); // 克隆节点
    upload_father.appendChild(clonedNode1); // 在父节点插入克隆的节点
    clonedNode1.innerHTML = "删除释义"; // 修改文字
    clonedNode1.setAttribute("onclick", "delete_definition()"); // 绑定事件

    var clonedNode2 = upload.cloneNode(true); // 克隆节点
    upload_father.appendChild(clonedNode2); // 在父节点插入克隆的节点
    clonedNode2.innerHTML = "删除单词"; // 修改文字
    clonedNode2.setAttribute("onclick", "delete_word()"); // 绑定事件

    var clonedNode3 = upload.cloneNode(true); // 克隆节点
    upload_father.appendChild(clonedNode3); // 在父节点插入克隆的节点
    clonedNode3.innerHTML = "自动播放"; // 修改文字
    clonedNode3.setAttribute("onclick", "auto_play()"); // 绑定事件
}
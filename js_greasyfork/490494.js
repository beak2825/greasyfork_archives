// ==UserScript==
// @name         爱学习-教学ppt导出
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  教学ppt导出
// @author       3hex
// @match      https://bsk.aixuexi.com/courseInfo.html*
// @icon         https://th.bing.com/th?id=ODLS.8ce4b207-3847-4d34-8440-46dbf328d9f6&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490494/%E7%88%B1%E5%AD%A6%E4%B9%A0-%E6%95%99%E5%AD%A6ppt%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490494/%E7%88%B1%E5%AD%A6%E4%B9%A0-%E6%95%99%E5%AD%A6ppt%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href;
    var pattern = /https:\/\/bsk\.aixuexi\.com\/courseInfo\.html#\/kejian/;
    var pattern2 = /https:\/\/bsk\.aixuexi\.com\/courseInfo\.html#\/viewPrint/;
    addNewBtn();

    //localStorage.setItem('jump_flag', '0');
    var jumpFlag = localStorage.getItem('jump_flag');
    console.log(jumpFlag);
    if (jumpFlag && jumpFlag == '1'){
        createPPT();
        localStorage.setItem('jump_flag', '0');
        jumpFlag = localStorage.getItem('jump_flag');
        console.log(jumpFlag);
    }

    function createPPT() {
        if(pattern2.test(url)){
            var startNode = document.getElementById('app-body');
            delNode(startNode, '[data-v-3e25f112]');
            delNode(startNode, 'p.header-title');
            delNode(startNode, 'div.content-main ul');

            delNodeClass(startNode, 'img.litimg', ["width", "height", "data-v-6972d9ab"]);
        }
    }

    function delNodeClass(startNode, dstType, dstClass) {
        var intervalID2 = setInterval(function() {
            var nodes = startNode.querySelectorAll(dstType);
            //console.log(nodes);
            if (nodes.length != 0) {
                clearInterval(intervalID2);
                for(var i = 0; i< nodes.length; i++) {
                    for(var j = 0; j< dstClass.length; j++){
                        nodes[i].removeAttribute(dstClass[j]);
                    }
                }
            }
        }, 100); // 每100毫秒检测一次
    }

    function delNode(startNode, dstType) {
        var intervalID2 = setInterval(function() {
            var nodes = startNode.querySelectorAll(dstType);
            //console.log(nodes);
            if (nodes.length != 0) {
                clearInterval(intervalID2);
                for(var i = 0; i< nodes.length; i++) {
                    nodes[i].parentNode.removeChild(nodes[i]);
                }
            }
        }, 100); // 每100毫秒检测一次
    }

    function addNewBtn() {
        if (pattern.test(url)) {
            console.log("爱学习-教学ppt导出");

            var intervalID = setInterval(function() {
                var btn = document.querySelector('.ant-btn.ant-btn-primary');
                //检查按钮是否已经加载出来
                if (btn) {
                    clearInterval(intervalID);
                    var newBtn = document.createElement('button');  // 创建新的button节点

                    //给新的按钮加上样式类，这使得新按钮看起来与原本的按钮相似
                    newBtn.className = 'ant-btn ant-btn-block';
                    newBtn.style.marginLeft = '20px';
                    // 修改新按钮的onclick事件，当点击时会将当前URL替换'kejian'为'viewPrint'，并跳转
                    newBtn.onclick = function() {
                        localStorage.setItem('jump_flag', '1');
                        var currentUrl = window.location.href;
                        var newUrl = currentUrl.replace('kejian', 'viewPrint');
                        // window.location.href = newUrl;
                        window.open(newUrl, '_blank');
                    }

                    //给新按钮添加标签
                    newBtn.innerText = '去打印PPT';

                    btn.parentNode.insertBefore(newBtn, btn.nextSibling); // 在当前按钮后面插入新按钮
                }
            }, 100); // 每100毫秒检测一次
        }
    }

})();
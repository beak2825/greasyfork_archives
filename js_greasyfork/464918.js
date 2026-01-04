// ==UserScript==
// @name         Discord快速下载高清原图
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  自用脚本:0.11:由于在Discord消息中MidJourney Bot生成的图片显示的是缩略图，批量生成图片时，需要反复点击U1,U2,U3,U4，点开图片再右键另存为才能保存高清原图。本脚本简化这一过程，点击"下载图片"即可下载高清原图到浏览器默认下载位置,不用再跳转去MidJourney主页下载。 0.21:在Discord其他频道也可快速下载原图。
// @author       Yuzu
// @match        https://discord.com/channels/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT License

// @downloadURL https://update.greasyfork.org/scripts/464918/Discord%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464918/Discord%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function getImgDirectly(Msg) {// 获取消息中图片的真实链接
        var c = Msg.getElementsByClassName("originalLink-Azwuo9");
        var d = c.item(0);
        var imgUrl = d.getAttribute("href"); 
        console.log(imgUrl);
        downloadImage(imgUrl);

    }

    function getLastMsgId() {
        var allMsg = document.getElementsByClassName("messageListItem-ZZ7v6g"); //获取消息列表
        var lastMsgId = allMsg[allMsg.length - 1].id; //获取最后一条消息的id
        return lastMsgId;
    }

    function addDLBtn() {//添加下载按钮

        var addDownloadButton =
            '<button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg DLBtn"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">下载图片</div></div></div></button>';
        var bb = $('.mediaAttachmentsContainer-1WGRWy');

        var i = 0;
        for (i = 0; i < bb.length; i++) {
            var x = bb[i].innerHTML;
            if (bb[i].querySelector('button.DLBtn') == null){
                bb[i].innerHTML = x + addDownloadButton;
            }

        }
        const DLBtn1 = document.querySelectorAll("button.DLBtn");

        for (var checkbtn of DLBtn1) {
            var randomId = "random-id-" + Math.floor(Math.random() * 100000).toString();

            checkbtn.setAttribute("id", "idToDL" + randomId);
            checkbtn.addEventListener("click", function (event) {

                var a = event.target.id;
                var clickId = document.getElementById(a);
                var message = clickId.closest("li");
                if (message) {
                    var messageId = message.id;

                    console.log("消息 ID 为：" + messageId);
                    loopButtons(messageId); // 开始循环点击所有按钮并执行操作
                }

            });
        }

        return bb[0];
    }

    // 点击按钮并检查是否有新消息
    async function handleButtonClick(buttonId, clickid) {
        const button = buttonId;
        var clickMSG = document.getElementById(clickid);
        var myList = clickMSG.closest("ol");
        var preCount = myList.getElementsByTagName("li").length;
        button.click();
        await waitForNewMessage(clickid, preCount);
    }

    // 等待新消息出现并检查是否有图片
    async function waitForNewMessage(clickid, preCount) {
        let imgFound = false;
        var clickMSG = document.getElementById(clickid);
        var myList = clickMSG.closest("ol");

        while (!imgFound) {
            // 检查消息列表是否有新消息
            await sleep(1000); // 等待2秒钟再继续检查
            console.log("等待消息加载……");
            var lis = myList.getElementsByTagName("li");
            if (lis.length > preCount) {
                // 如果有新消息，则检查其中是否包含png图片
                for (let i = preCount; i < lis.length; i++) {
                    while (!imgFound) {
                        await sleep(3000);
                        console.log("loading");
                        var img1 = lis[i].querySelector(".originalLink-Azwuo9");

                        if (img1 != null) {

                            var imgUrl = img1.getAttribute("href");

                            if (imgUrl != null & imgUrl.endsWith(".png")) {
                                imgFound = true;

                                console.log(imgUrl);
                                downloadImage(imgUrl); // 下载图片
                                break; // 结束循环，不再检查其它消息
                            }
                        }
                    }
                }
            }
        }
        return imgUrl;
    }

    function downloadImage(imgUrl) {
        // 创建一个 XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imgUrl, true);
        xhr.responseType = 'blob';// 请求的数据类型为二进制流

        // 当请求完成时执行该函数
        xhr.onload = function() {
            // 如果请求成功
            if (xhr.status === 200) {
                // 获取响应中的二进制数据
                const blob = xhr.response;

                // 创建一个超链接元素
                const link = document.createElement('a');
                const blobUrl = URL.createObjectURL(blob);
                link.style.display = 'none';
                link.href = blobUrl;// 将二进制数据转换成 URL


                var urlStr = imgUrl.split('/');
                var imgName = urlStr[urlStr.length - 1];
                link.download = imgName; // 指定文件名
                document.body.appendChild(link);
                link.click(); // 触发点击事件进行下载
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);
            }
        };

        // 发送请求
        xhr.send();
    }



    // 等待指定的时间（单位：毫秒）
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // 循环点击所有按钮并执行操作
    async function loopButtons(clickid) {
        var allMsg = document.getElementById(clickid);
        const buttonArr = allMsg.querySelectorAll("button");
        if(allMsg.textContent.includes('Favorite') ){//如果这条消息含有Favorite按钮直接下载此图片
            getImgDirectly(allMsg);
        }else if(buttonArr.length == 1){
            const images = allMsg.querySelectorAll(".originalLink-Azwuo9");
            if(images.length == 1){
                getImgDirectly(allMsg);
            }else{
                for(let i=0 ;i<images.length;i++){

                    var imgUrl = images[i].getAttribute("href");
                    //console.log(imgUrl);
                    downloadImage(imgUrl);
                }

            }
        }else{
            const buttonArr = allMsg.querySelectorAll("button");
            for (let i = 1; i < 5; i++) {
                //循环点击指定的四个按钮
                await handleButtonClick(buttonArr[i], clickid);
            }


        }

        addDLBtn();
    }


    // 主函数main
    async function main() {
        console.log('启动脚本...');

        await sleep(3000);
        var bb = document.getElementsByClassName("children-2XdE_I");

        while (bb.length <= 0) {
            await sleep(1000);

            bb = document.getElementsByClassName("children-2XdE_I");
        }

        var aa = addDLBtn();
        var newMsg = getLastMsgId();
        let path = window.location.pathname;

        setInterval(function() {

            if (window.location.pathname != path || newMsg != getLastMsgId()) {
                path = window.location.pathname;
                console.log('页面路径为：', path);
                addDLBtn();

            }
            newMsg = getLastMsgId();
        }, 1000); // 每秒检查一次路径是否变化

    }

    // 调用主函数
    main();
})();
// ==UserScript==
// @name         Hello_Appeal
// @namespace    Hello_Appeal
// @description  申诉审核过程帮助
// @homepageURL  https://greasyfork.org/zh-CN/scripts/414211-hello-appeal
// @version      1.31
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/414211/Hello_Appeal.user.js
// @updateURL https://update.greasyfork.org/scripts/414211/Hello_Appeal.meta.js
// ==/UserScript==


window.onload = function() {
    if (window.location.href.indexOf("appeal/index") >= 0) {


        setTimeout(function() {

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(1)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(1)").click();
                    console.log("1")
                }
            });

            sleep(500).then(() => {
                console.log("li-1")
                var linode_1 = document.createElement('div');
                linode_1.id = 'linode_1';
                linode_1.style.height = 'auto';
                linode_1.style.width = '33%';
                linode_1.style.float = 'left';
                linode_1.style.display = 'inline';
                linode_1.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_1);
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(2)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(2)").click();
                    console.log("2")
                }
            });

            sleep(500).then(() => {
                console.log("li-2")
                var linode_2 = document.createElement('div');
                linode_2.id = 'linode_2';
                linode_2.style.height = 'auto';
                linode_2.style.width = '33%';
                linode_2.style.float = 'left';
                linode_2.style.display = 'inline';
                console.log(document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0]);
                linode_2.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_2);
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(3)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(3)").click();
                    console.log("3")
                }
            });

            sleep(500).then(() => {
                console.log("li-3")
                var linode_3 = document.createElement('div');
                linode_3.id = 'linode_3';
                linode_3.style.height = 'auto';
                linode_3.style.width = '33%';
                linode_3.style.float = 'left';
                linode_3.style.display = 'inline';
                linode_3.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_3);
            });
        },500);

        setInterval(function(){
            try {
                var li_d1 = document.querySelector("#linode_1 > div > div.video-container.ant-spin-nested-loading");
                var li_d2 = document.querySelector("#linode_2 > div > div:nth-child(3)");
                var li_d3 = document.querySelector("#linode_3 > div > div.user-appeal");
                var r_d1 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.video-container.ant-spin-nested-loading");
                var r_d2 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.anchor-container.ant-spin-nested-loading");
                var r_d3 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.user-appeal");

                li_d1.innerHTML = r_d1.innerHTML;
                li_d2.innerHTML = r_d2.innerHTML;
                li_d3.innerHTML = r_d3.innerHTML;
            } catch (e) {
                console.log("li 替换 r error")
            }
        }, 1000);


        document.onkeydown = onKeyDown;
        function onKeyDown() {
            //Q81,w87,e69,r82
            if(window.event.keyCode == 81){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(2)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 87){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(3)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 69){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(4)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 82){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(5)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
        }
    }


    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };





};



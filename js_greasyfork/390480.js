// ==UserScript==
// @name         aliexpress
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.aliexpress.com/wholesale*
// @match        https://www.aliexpress.com/category/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390480/aliexpress.user.js
// @updateURL https://update.greasyfork.org/scripts/390480/aliexpress.meta.js
// ==/UserScript==

(function() {
    var jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
    document.getElementsByTagName('head')[0].appendChild(jquery);

    var outputText = "";

    setTimeout(() => {
        addButton();

        // 打开页面自动下载
        setTimeout(() => {
            single();
            setTimeout(() => {
                btnSave();
            }, 200);

        }, 3000);

        // 添加按钮
        function addButton() {
            var btnPositon = document.querySelector("body");
            var btnSearch = document.createRange();
            var btnParse = btnSearch.createContextualFragment.bind(btnSearch);
            var btnSearchTitle = btnParse(`
            <style>
                .btnClass1 {
                    position: fixed;
                    top: 45%;
                    left: 0;
                    width: 96px;
                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    color: #fff;
                    background: #4DC86F;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 5px;
                    display: inline-block;
                    border: 0;
                }
                .btnClass2 {
                    position: fixed;
                    top: 52% ;
                    left: 0;
                    width: 96px;
                    height: 34px;
                    line-height:34 px;
                    text-align:center;
                    color:#fff;
                    background:#4DC86F;
                    border-radius:4px;
                    cursor:pointer;
                    margin-top:5px;
                    display:inline-block;
                    border:0;
                }
            </style>
            <button class="btnClass1" id="btnClear">清空</button>
            <button class="btnClass2" id="btnSave">保存</button>
        `);
            btnPositon.appendChild(btnSearchTitle);
        }

        // 清除事件
        document.querySelector("#btnClear").addEventListener("click", function () {
            btnClear();
        })

        // 保存事件
        document.querySelector("#btnSave").addEventListener("click", function () {
            btnSave();
        })

        // 清除保存值
        function btnClear() {
            outputText = "";
            console.log("数据清除成功");

        }

        // 保存
        function btnSave() {
            var timestamp = new Date().getTime();
            download(timestamp.toString(), outputText);
        }


        function fake_click(obj) {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent(
                "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
            );
            obj.dispatchEvent(ev);
        }

        function download(name, data) {
            var urlObject = window.URL || window.webkitURL || window;

            var downloadData = new Blob([data]);

            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(downloadData);
            save_link.download = name;
            fake_click(save_link);
        }

        // 获取当页数据
        function single() {

            stieString = $("#app-download-qrcode").next().html();

            regItemId = /productId":([0-9]{1,20}),"\w\w\w\w\w\w\w\w":/g;
            arrItemId = stieString.match(regItemId);
            regItemIdEnd = /\d+/;
            itemId = arrItemId.map((v) => {
                return v.match(regItemIdEnd)[0];
            });

            regStoreName = /"storeName":"(.*?)","storeId"/g;
            arrStoreName = stieString.match(regStoreName);
            regStoreNameEnd = /"storeName":"(.*?)","storeId"/;
            storeName = arrStoreName.map((v) => {
                return regStoreNameEnd.exec(v)[1].replace("/\u0028WF", "(").replace("/\u0029", "(");
            })

            var itemIdName = [];
            for (let index = 0; index < itemId.length; index++) {
                const element = "https://www.aliexpress.com/item/" + itemId[index] + ".html" + "----" + storeName[index];
                itemIdName.push(element);
            }
            outputText += itemIdName.join("\r\n");
            console.log("本页采集完成");
        }

        // 下一页点击事件
        var findbtn = setInterval(() => {
            if (document.querySelector(".next-pagination-pages")) {
                console.log("按钮加载完成，可正常使用");
                document.querySelector(".next-pagination-pages").addEventListener("click", () => {
                    console.log("网页加载中，等待采集");

                    setTimeout(() => {
                        single();
                    }, 3000);
                });
                clearInterval(findbtn);
            } else {
                console.log("首次加载，等待绑定按钮加载中...");
            }
        }, 500)


    }, 1000);
})();
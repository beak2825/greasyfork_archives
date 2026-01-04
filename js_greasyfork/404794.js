// ==UserScript==
// @name         右键二维码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按住ctrl键右键超链接，可生成相应二维码方便手机扫描
// @icon         https://s1.ax1x.com/2020/05/18/YWucdO.png
// @author       seast19
// @license      MIT
// @include      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/404794/%E5%8F%B3%E9%94%AE%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/404794/%E5%8F%B3%E9%94%AE%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function checkURLFormat(string) {
        if (!/^(https?:)?\/\/(\S+\.)+\S{2,}$/i.test(string)) {
            return false;
        }
        return true;
    }

    // qrcode组件
    let qcBox = document.createElement('div');
    qcBox.id = 'qcBox'
    qcBox.style = 'display:none;z-index:999;position:fixed; left:50%;top:45%;border: 1px solid #ccc;padding: 5px 10px 10px 10px;background-color: #f5f5f5;';

    //关闭图标
    let qcCancel = document.createElement('a')
    qcCancel.id = 'qcCancel'
    qcCancel.innerHTML = '<svg t="1591418834527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1143" width="16" height="16"><path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z" p-id="1144"></path></svg>'
    qcCancel.setAttribute('href', 'javascript:;')
    qcCancel.style = 'float:right;'

    //qrcode框
    let qcImg = document.createElement('div');
    qcImg.id = 'qcImg';

    // 挂在组件
    document.querySelector('body').append(qcBox)
    document.querySelector("#qcBox").append(qcCancel)
    document.querySelector("#qcBox").append(qcImg)


    //关闭二维码
    function closeBox() {
        document.querySelector("#qcBox").style.display = 'none'
        document.querySelector("#qcImg").innerHTML = ''
    }

    //生成二维码
    function openBox(url) {
        let qrcode = new QRCode(document.querySelector("#qcImg"), {
            text: url,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        document.querySelector("#qcBox").style.display = "block"
    }



    // 关闭二维码窗口并清除数据    
    document.querySelector("#qcCancel").addEventListener('click', (e) => {
        closeBox()

    })

    // 按ctrl+鼠标右击事件
    document.addEventListener("contextmenu", (e) => {
        if (e.ctrlKey) {
            // 清除上一次生成的二维码
            if (document.querySelector("#qcBox").style.display === "block") {
                closeBox()
            }

            var target = e.target;
            if (!/^(a|img)$/i.test(target.tagName)) {
                while (!/^(body|html)$/i.test(target.tagName)) {
                    target = target.parentNode;
                    if (/^(a|img)$/i.test(target.tagName)) {
                        break;
                    }
                }
            }

            if (target.tagName === "A" && checkURLFormat(target.href)) {
                openBox(target.href)
                return;
            }

            if (target.tagName === "IMG" && checkURLFormat(target.src)) {
                openBox(target.src);
                return;
            }
        } 
    })



})();
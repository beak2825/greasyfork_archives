// ==UserScript==
    // @name         OCR文字识别
    // @namespace    https://vnpocket.com
    // @version      0.01
    // @description  测试
    // @author       tuite
    // @match        https://vnpocket.com/Game/**
    // @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/tesseract.js/2.1.5/tesseract.min.js
    // @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/html2canvas/1.4.1/html2canvas.min.js
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519034/OCR%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/519034/OCR%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB.meta.js
    // ==/UserScript==
    (function () {
        'use strict';

        let zb = []
        // 在屏幕左下角添加一个按钮
        var button = document.createElement("button");
        button.innerHTML = "OCR";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.left = "10px";
        button.style.zIndex = "9999";
        button.onclick = function (e) {
            // 为当前页面添加一个点击事件，点击后将坐标放入zb
            document.addEventListener("click", function (e) {
                if (zb.length > 2) return
                zb.push([e.clientX, e.clientY]);

                if (zb.length === 2) {
                    createCanvas()
                }
            });
        };
        document.body.appendChild(button);

        // 在屏幕最下方生成一个区域显示扫描出的文字，要求白底黑字带边框
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.bottom = "10px";
        div.style.left = "55px";
        div.style.width = "300px";
        div.style.height = "200px";
        div.style.backgroundColor = "white";
        div.style.border = "1px solid black";
        div.style.zIndex = "9999";
        div.id = 'orcResult'
        div.innerHTML = "OCR结果";
        document.body.appendChild(div);

        function createCanvas() {
            let zb1 = zb[0]
            let zb2 = zb[1]

            let width = Math.abs(zb1.x - zb2.x)
            let height = Math.abs(zb1.y - zb2.y)

            html2canvas(document.body, {
                x: Math.min(zb1.x, zb2.x),
                y: Math.min(zb1.y, zb2.y),
                width: width,
                height: height
            }).then(function (canvas) {
                Tesseract.recognize(canvas.toDataURL(), 'eng', {
                    logger: m => console.log(m)
                }).then(({data: {text}}) => {
                    console.log(text)
                    
                    document.getElementById('orcResult').innerHTML = text

                    // 销毁canvas
                    canvas.remove()

                })
            })

            zb = [] // 重置坐标数组
        }
    })();
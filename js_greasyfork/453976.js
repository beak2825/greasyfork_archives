// ==UserScript==
// @name         道客88
// @namespace    Tampermonkey
// @version      1.1
// @description  以pdf形式下载道客88文件
// @author       12321
// @match        https://www.doc88.com/*
// @icon         none
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453976/%E9%81%93%E5%AE%A288.user.js
// @updateURL https://update.greasyfork.org/scripts/453976/%E9%81%93%E5%AE%A288.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...


    function canvases2pdf(canvases) {
        var name = document.getElementsByClassName("doctopic")[0].getElementsByTagName("h1")[0].getAttribute("title");
        var pdf = new jspdf.jsPDF({
            format: [595.28, 841.89]
        });
        for (var i = 0; i < canvases.length; i++) {
            var pageData = canvases[i].toDataURL('image/png', 1.0);
            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(pageData, 'PNG', 0, 0, 595.28, 841.89, null, 'NONE');
        }
        pdf.save(name + ".pdf");
    }


    //下载图片转canvas(递归函数) 并保存为pdf
    function h2c_2pdf(id, i) {
        try {
            //跳转界面
            window.location.hash = id + i;
            //等待加载
            window.setTimeout(function () {
                //转换并下载
                var page = $(id + i)[0];
                if (page == null) {
                    canvases2pdf(canvases);
                } else {
                    html2canvas(page, {
                        useCORS: true,
                        allowTaint: false,
                    }).then(function (canvas) {
                        canvases.push(canvas);
                        h2c_2pdf(id, i + 1);
                    })
                }
            }, 1000)//等待时间1s
        } catch (err) {
            console.log(err);
        }
    }

    var canvases = [];
    //创建按钮
    var button = document.createElement("button");
    button.innerHTML = "下载-pdf";
    button.onclick = function () {
        //点击继续按钮
        try {
            var con_button = document.getElementById("continueButton");
            con_button.click();
        } catch (err) {
            console.log("没有找到继续按钮");
        }
        var id = '#outer_page_';
        h2c_2pdf(id, 1);
    }

    //网页加载1s后生成按钮
    window.setTimeout(function () {
        var x = document.getElementById("item-page-panel");
        var y = document.createElement("li");
        y.appendChild(button);
        x.appendChild(y);
    }, 1000);

})();
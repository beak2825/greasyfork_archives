// ==UserScript==
// @name         OA
// @namespace    http://sorziax.net/
// @version      2024-02-04
// @description  extension for self system
// @author       SorziaX
// @connect      github.io
// @connect      xhd.cn
// @require
// @match        *://oa.xhd.cn/workflow/request/ManageRequestNoForm.jsp*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486395/OA.user.js
// @updateURL https://update.greasyfork.org/scripts/486395/OA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var buttonHTML = '<button id="floatDiv" style="width: 100%;height: 80px;background-color:#3c78d8!important;color:white;font-size: 40px;">启动</button>';
    var topDiv = document.createElement("div");
    topDiv.style.width = "100%";
    topDiv.innerHTML = buttonHTML;
    topDiv.addEventListener('click', initPDFCheck);
    document.body.insertBefore(topDiv, document.body.children[0]);

    initPDF(floatDiv);
})();


async function initPDF(floatDiv){
    await import ("https://mozilla.github.io/pdf.js/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';
    floatDiv.innerHTML = "启动";
}

async function initPDFCheck(){
    var iframe = document.getElementById("bodyiframe");
    var bodyDocument = iframe.contentDocument;
    var tds = bodyDocument .getElementsByClassName("fieldvalueClass");
    var table = tds[0].parentElement.parentElement.parentElement;

    // 设置table属性
    table.style.width = "1050px";
    var texts = [];
    for(var i = 0; i < tds.length - 1; i++){
        var td = tds[i];
        var a = td.children[0].children[1].children[0].children[0];
        var text = a.innerHTML;
        texts[i] = text;

        if(text.endsWith(".pdf")) {
            // 下载
            var onclick = a.onclick.toString();
            var items = onclick.split("'");
            var downloadId = items[items.length - 2];
            const loadingTask = pdfjsLib.getDocument({
                url: "https://oa.xhd.cn/weaver/weaver.file.FileDownload?fileid=" + downloadId,
                cMapUrl: "https://mozilla.github.io/pdf.js/web/cmaps/",
                cMapPacked: true,
                standardFontDataUrl: "https://mozilla.github.io/pdf.js/web/standard_fonts/",
                useSystemFonts: true,
                disableFontFace: false
            });
            // 等待PDF载入完成
            const pdf = await loadingTask.promise;

            for(var p = 0; p < pdf.numPages ; p++) {
                var page = await pdf.getPage(p + 1);
                var pageDiv = await createPage(page, bodyDocument);

                td.appendChild(createClearDiv());
                td.appendChild(pageDiv);
                td.appendChild(createClearDiv());
                td.appendChild(createBlock(20));
            }

        }
    }
}

async function createPage(page, document){
    let WIDTH = 800;
    let WIDTH_SMALL = 400;
    var objects = (await page.getTextContent()).items;

    var number = "";
    var code = "";

    var numberX = 0;
    var numberY = 0;
    var codeX = 0;
    var codeY = 0;

    var index = 0;
    for(var key in objects) {
        var object = objects[key];

        try{
            var x = object.transform[4];
            var y = object.transform[5];
        } catch(e){}

        if(object.str == "发票代码：" || object.str == "发票代码:") {
            codeX = x + object.width - 2;
            codeY = y;
            continue;
        }
        if(object.str == "发票号码：" || object.str == "发票号码:") {
            numberX = x + object.width - 2;
            numberY = y;
            continue;
        }

        var offset = 8;

        if(numberX != 0 && Math.abs(x - numberX) < offset && Math.abs(y - numberY) < offset) {
            number = object.str;
            continue;
        }

        if(codeX != 0 && Math.abs(x - codeX) < offset && Math.abs(y - codeY) < offset) {
            code = object.str;
            continue;
        }

        index++;
    }

    var div = document.createElement("div");
    div.style.float = "left";

    var buttonTitle;
    var status = 0;
    if(number != "" && code != "") {
        buttonTitle = "发票号码: " + number + " | 发票代码: " + code;
        status = 0;
    } else if(number != ""){
        buttonTitle = "发票号码: " + number;
        status = 0;
    } else {
        buttonTitle = "提取失败";
        status = 1;
    }
    div.innerHTML = getButton(buttonTitle, status);

    // 添加消息提示div
    var messageDiv = document.createElement("div");
    messageDiv.style.float = "left";
    messageDiv.hidden = true;
    messageDiv.innerHTML = getMessage("复制成功");

    // 如果发票号码有效，则添加复制功能
    if(number != "") {
        addCopyToDiv(div, number, messageDiv);
    }

    // 尺寸计算
    var pageWidth = page.view[2];
    var pageHeight = page.view[3];
    var scale = WIDTH/pageWidth;
    var scaledViewport = page.getViewport({ scale: scale });

    var width = WIDTH;
    var height = width / pageWidth * pageHeight;

    // 创建canvas
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext("2d");
    var renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
    };
    page.render(renderContext);

    var canvasDiv = document.createElement("div");
    canvasDiv.style.float = "left";
    canvasDiv.width = width;
    canvasDiv.height = height;
    canvasDiv.style.border = "1px solid #000000";
    canvasDiv.appendChild(canvas);

    var pageDiv = document.createElement("div");
    pageDiv.style.float = "left";
    pageDiv.style.marginLeft = "40px";
    pageDiv.appendChild(canvasDiv);
    pageDiv.appendChild(createClearDiv());
    pageDiv.appendChild(div);
    pageDiv.appendChild(messageDiv);

    return pageDiv;
}

function addPreviewToDiv(){
}

function createClearDiv() {
    var div = document.createElement("div");
    div.style.clear = "both";
    return div;
}

function createBlock(height) {
    var div = document.createElement("div");
    div.style.height = height;
    return div;
}

function addCopyToDiv(div, text, messageDiv) {
    div.style.cursor = "pointer";
    div.addEventListener('click', function (event){
        console.log("copy:" + text);
        GM_setClipboard(text);
        messageDiv.hidden = false;
    });

    var timer = setInterval(function () {
        messageDiv.hidden = true;
        clearInterval(timer);
    }, 2000);
}

function getButton(title, status = 0) {
    var color;
    if(status == 0) {
        // 成功
        color = "#6387ed";
    }
    else if(status == 1) {
        // 失败
        color = "#fda6a6";
    }
    var buttonStart = '<div class = "kh_button" style="height:60px;line-height:28px;width:800px"><div style="margin:5px 5px 5px 5px;background-color:' + color + ';border-radius: 4px;"><div style="text-align:center;"><p style="color:#FFFFFF!important;">';
    var buttonEnd = '</p></div></div></div>';
    return buttonStart + title + buttonEnd;
}

function getMessage(title) {
    var messageStart = '<div class = "kh_button" style="float:left;height:40px;line-height:28px;"><div style="margin:5px 5px 5px 5px;border-radius: 4px;"><div style="text-align:center;"><p style="color:#000000!important;">';
    var messageEnd = '</p></div></div></div>';
    return messageStart + title + messageEnd;
}

/*
const loadingTask = pdfjsLib.getDocument({
    url: "",
    cMapUrl: "https://mozilla.github.io/pdf.js/web/cmaps/",
    cMapPacked: true,
});
const pdf = await loadingTask.promise;
var page = await pdf.getPage(1);
var content = await page.getTextContent();
var objects = (await page.getTextContent()).items;
*/


// ==UserScript==
// @name         OA报销-顶栏/下载
// @namespace    KHOA
// @version      0.7.1
// @description  extension for self system
// @author       AsChar
// @connect      github.io
// @connect      unpkg.com
// @connect      xhd.cn
// @connect      localhost
// @connect      localhost:9876
// @require
// @match        *://oa.xhd.cn/workflow/request/ManageRequestNoForm.jsp*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488504/OA%E6%8A%A5%E9%94%80-%E9%A1%B6%E6%A0%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488504/OA%E6%8A%A5%E9%94%80-%E9%A1%B6%E6%A0%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

let pdfjsSrcUrl = "unpkg.com/pdfjs-dist@4.0.379/build/";
let pdfjsCMapUrl = "unpkg.com/pdfjs-dist@4.0.379/";
//let pdfjsCMapUrl = "mozilla.github.io/pdf.js/";

var topBar;
var showsTopBar = false;
var hasInitPDFCheck = false;

const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

(function() {
    'use strict';
    var buttonHTML = '<button id="floatDiv" style="width: 100%;height: 50px;overflow:hidden;background-color:#3c78d8!important;color:white;font-size: 30px;"></button>';
    var topDiv = document.createElement("div");
    topDiv.style.width = "100%";
    topDiv.innerHTML = buttonHTML;
    topDiv.addEventListener('click', initPDFCheck);
    document.body.insertBefore(topDiv, document.body.children[0]);

    topBar = document.createElement("div");
    topBar.id = "OATopBar";
    topBar.style.width = "100%";
    topBar.style.height = "500px";
    topBar.style.whiteSpace = "nowrap";
    topBar.style.overflowX = "scroll";
    topBar.style.backgroundColor = "#DDDDDD";
    topBar.hidden = true;;
    showsTopBar = false;
    document.body.insertBefore(topBar, document.body.children[1]);

    initPDF();
})();

function showTopBar(){
    var iframe = document.getElementById("bodyiframe");
    if(showsTopBar) {
        topBar.hidden = true;
        showsTopBar = false
        iframe.style.height = "100%";
    } else {
        topBar.hidden = false;
        showsTopBar = true;
        iframe.style.height = "50%";
    }
}


async function initPDF(){
    await import ("https://" + pdfjsSrcUrl + "pdf.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "//" + pdfjsSrcUrl + "pdf.worker.min.mjs";
}

async function initPDFCheck(){
    // UI变化
    showTopBar();
    if(hasInitPDFCheck) {
        return;
    }
    hasInitPDFCheck = true;

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

            /*
            var response = await GM.xmlHttpRequest(
            {
                method: "get",
                responseType: "arraybuffer",
                url: "http://localhost:9876/test2.pdf",
            }).catch(e => console.error(e));
            const data = response.response;
            */

            let url;
            let pdf;

            downloads(downloadId);
            delay(800);

            try {
                // 等待PDF载入完成
                url = "https://oa.xhd.cn/weaver/weaver.file.FileDownload?fileid=" + downloadId;
                pdf = await getPDFDataByUrl(url);
            }catch(e){
                console.log("can't load file by fileId:\n" + e);
                console.log(url);
            }

            if(pdf == null){
                try {
                    // 等待PDF载入完成
                    url = "https://oa.xhd.cn/weaver/weaver.file.FileDownload?imagefileid=" + downloadId;
                    pdf = await getPDFDataByUrl(url);
                }catch(e){
                    console.log("can't load file by imagefileId:\n" + e);
                    console.log(url);
                }
            }

            console.log(url);

            // pdf不存在就插入空白方块
            if(pdf == null) {
                console.log("can't load pdf");
                topBar.appendChild(createBlankPage(bodyDocument, createTitle(text, url, 30)));
                topBar.appendChild(createInlineBlock(40));
                continue;
            }

            for(var p = 0; p < pdf.numPages ; p++) {
                var page = await pdf.getPage(p + 1);
                var pageDiv = await createPage(page, bodyDocument, p == 0 ? createTitle(text, url, 30) : createBlock(30));

                pageDiv.style.display = "inline-block";
                pageDiv.style.padding = "5px";
                pageDiv.style.margin = "0";
                pageDiv.style.verticalAlign = "top";
                pageDiv.style.backgroundColor = "#FFFFFF";
                topBar.appendChild(pageDiv);
            }
            topBar.appendChild(createInlineBlock(40));

        }
    }
}

async function getPDFDataByUrl(url){
    let response = await GM.xmlHttpRequest({ url: url ,responseType: "arraybuffer", method: "get"}).catch(e => console.error(e));
    const data = response.response;
    const loadingTask = pdfjsLib.getDocument({
                data: data,
                //url: url,
                cMapUrl: "https://" + pdfjsCMapUrl + "cmaps/",
                cMapPacked: true,
                standardFontDataUrl: "https://" + pdfjsCMapUrl + "standard_fonts/",
                useSystemFonts: true,
            });
    const pdf = await loadingTask.promise;
    return pdf;
}

function createTitle(text, href, height){
    var div = document.createElement("div");
    var a = document.createElement("a");
    div.appendChild(a);

    div.style.float = "left";
    div.style.height = height + "px";
    div.style.paddingLeft = "5px";

    a.href = href;
    a.innerHTML = text;
    a.target = "_blank";
    a.style.fontSize = "24px";
    a.style.color = "#888888";
    return div;

}

function createBlankPage(document, title){
    var pageDiv = document.createElement("div");
    pageDiv.style.display = "inline-block";
    pageDiv.style.padding = "5px";
    pageDiv.style.margin = "0";
    pageDiv.style.verticalAlign = "top";
    pageDiv.style.backgroundColor = "#FFFFFF";
    pageDiv.appendChild(title);
    pageDiv.appendChild(createClearDiv());
    return pageDiv;
}

async function createPage(page, document, title){
    let WIDTH = 600;
    let WIDTH_SMALL = 400;
    var objects = (await page.getTextContent()).items;

    var number = "";
    var code = "";

    var numberX = 0;
    var numberY = 0;
    var codeX = 0;
    var codeY = 0;

    var index = 0;
    var x = 0;
    var y = 0;
    var object;
    // 第一遍循环，获取所需文本位置
    for(var key in objects) {
        object = objects[key];

        try{
            x = object.transform[4];
            y = object.transform[5];
        } catch(e){
            continue;
        }

        if(object.str == "发票代码：" || object.str == "发票代码:" || object.str == "发票代码") {
            codeX = x + object.width - 2;
            codeY = y;
            continue;
        }
        if(object.str == "发票号码：" || object.str == "发票号码:" || object.str == "发票号码") {
            numberX = x + object.width - 2;
            numberY = y;
            continue;
        }

        if(codeX != 0 && codeY != 0 && numberX != 0 && numberY != 0) break;
        index++;
    }

    // 第三遍循环，查找对应位置的文本
    var defaultX = 470; // 经验位置
    var defaultY = 348; // 经验位置
    var offsetX = 15;
    var offsetY = 8;
    for(var key2 in objects) {
        object = objects[key2];

        try{
            x = object.transform[4];
            y = object.transform[5];
        } catch(e){
            continue;
        }
        if(numberX != 0 && numberY != 0) {
            // 当numberX&numberY存在时，直接定位号码
            if(Math.abs(x - numberX) < offsetX && Math.abs(y - numberY) < offsetY) {
                number = object.str;
                continue;
            }
        } else {
            // 当numberX&numberY不存在时，按照经验位置定位号码
            if(Math.abs(x - defaultX) < 2 * offsetX && Math.abs(y - defaultY) < 2 * offsetY) {
                var n = Number(object.str);
                // 排除情况
                if(isNaN(n) || object.str.includes(".") || object.str.length < 5 || object.str.length > 30 || n != parseInt(n)) continue;

                if(number == "") {
                    number = object.str;
                } else {
                    if(number.length > object.str.length) {
                        code = number;
                        number = object.str;
                    } else {
                        code = object.str;
                    }
                }
                continue;
            }
        }

        if(codeX != 0 && Math.abs(x - codeX) < offsetX && Math.abs(y - codeY) < offsetY) {
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

    // 如果发票号码有效，则添加复制功能
    if(number != "") {
        addCopyToDiv(div, number, div.children[0].children[0].children[0].children[0]);
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
    pageDiv.appendChild(title);
    pageDiv.appendChild(createClearDiv());
    pageDiv.appendChild(div);
    pageDiv.appendChild(createClearDiv());
    pageDiv.appendChild(canvasDiv);

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
    div.style.height = height + "px";
    div.style.width = height + "px";
    return div;
}

function createInlineBlock(height) {
    var div = document.createElement("div");
    div.style.display = "inline-block";


    var innerDiv = document.createElement("div");
    innerDiv.style.height = height + "px";
    innerDiv.style.width = height + "px";
    div.appendChild(innerDiv);

    return div;
}

function addCopyToDiv(div, text, messageDiv) {
    div.style.cursor = "pointer";
    div.addEventListener('click', function (event){
        console.log("copy:" + text);
        GM_setClipboard(text);
        var innerHTML = messageDiv.innerHTML;
        if(innerHTML == "复制成功") return;
        messageDiv.innerHTML = "复制成功";

        setTimeout(function () {
            messageDiv.innerHTML = innerHTML;
        }, 1000);
    });
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
    var buttonStart = '<div class = "kh_button" style="height:36px;line-height:32px;width:600px"><div style="margin:5px 5px 5px 5px;background-color:' + color + ';border-radius: 4px;"><div style="text-align:center;"><p style="color:#FFFFFF!important;">';
    var buttonEnd = '</p></div></div></div>';
    return buttonStart + title + buttonEnd;
}

/*
await import ("https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.min.mjs");
pdfjsLib.GlobalWorkerOptions.workerSrc = "//unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";
const loadingTask = pdfjsLib.getDocument({
    //url: "https://oa.xhd.cn/weaver/weaver.file.FileDownload?fileid=1432902",
    url: "https://oa.xhd.cn/docs/docs/DocDspExt.jsp?id=862071&imagefileId=1432904",
    cMapUrl: "https://unpkg.com/pdfjs-dist@4.0.379/cmaps/",
    cMapPacked: true,
});
const pdf = await loadingTask.promise;
var page = await pdf.getPage(1);
var content = await page.getTextContent();
var objects = (await page.getTextContent()).items;
*/
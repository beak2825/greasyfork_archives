// ==UserScript==
// @name          下载小说
// @description   下载小说为表格
// @require       https://code.jquery.com/jquery-3.4.1.min.js
// @require       https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @match         http://*.example.com/*
// @version       1.0
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/432323/%E4%B8%8B%E8%BD%BD%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/432323/%E4%B8%8B%E8%BD%BD%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==


//网站是编码"gbk"或者"utf-8"
var textdecoderStr = "gbk";
var xiaoshuo_name = "师姐请自重";
var xiaoshuo_data = [];
var titleSelector = "#wrapper > div.content_read > div > div.bookname > h1";
var contentSelector = "#content";
var nextPageSelector = "#wrapper > div.content_read > div > div.bottem2 > a:nth-child(4)";
var homePage = "https://www.hehuamei.com/251/251253/81438391.html";

getData(window.location.href);

function getData(strUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', strUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if (this.status == 200) {
            // 抓取二进制数据，通过二进制转换正确的文字编码，因为有些网站是"gbk"编码，直接抓取response会显示乱码。
            var arraybuffer = this.response;
            var x = new Uint8Array(arraybuffer);
            var result = new TextDecoder(textdecoderStr).decode(x);

            //  将正确编码的文本转化为可操作的DOM
            var para = document.createElement("p");
            para.innerHTML = result;

            //  提取标题和内容
            var tempData = {};
            tempData.title = para.querySelector(titleSelector).innerText;
            tempData.tip1 = "#1111#";
            tempData.content = para.querySelector(contentSelector).innerText;
            tempData.tip2 = "######";
            xiaoshuo_data.push(tempData);

            //  进行下一页的抓取
            var nextPage = para.querySelector(nextPageSelector).href;
            if (nextPage != homePage) {
                //判断下一页是否为目录页
                console.log(tempData.title);
                setTimeout(getData, Math.floor(Math.random() * 2600), nextPage);
            } else {
                //如果下一页是目录页，那么就导出数据。
                DownloadFile(xiaoshuo_name, xiaoshuo_data);
            }
            return;
        }
    }
    ;
    xhr.onerror = function() {
        console.log("抓取失败：");
        console.log(xhr.status);
        console.log(xhr.readyState);
        console.log(xhr.statusText);
        DownloadFile(xiaoshuo_name, xiaoshuo_data);
    }
    ;
    xhr.send();
}

/*
下面部分代码用于将内容写入Excel
*/
function DownloadFile(filename, arr) {
    // 创建隐藏的可下载链接			
    var option = {};
    option.fileName = filename;
    option.datas = [{
        sheetData: arr,
        sheetName: '小说内容',
        sheetFilter: ["title", "tip1", "content", "tip2"],
        sheetHeader: ["标题", "tip1", "内容", "tip2"]
    }/*, {
        sheetData: arr
    }*/
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
}


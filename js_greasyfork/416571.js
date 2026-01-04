// ==UserScript==
// @name              医学金字塔书籍下载
// @namespace          ccc
// @version            1.0.1
// @description       提供医学金字塔书籍下载按钮，下载整本书籍
// @author            andrew.asa
// @icon              data:image/jpg;base64,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
// @namespace         https://greasyfork.org/users/
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @require           https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js
// @require           https://cdn.bootcss.com/jspdf/1.3.4/jspdf.debug.js
// @match             *://www.jztyx.com/read/*
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416571/%E5%8C%BB%E5%AD%A6%E9%87%91%E5%AD%97%E5%A1%94%E4%B9%A6%E7%B1%8D%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/416571/%E5%8C%BB%E5%AD%A6%E9%87%91%E5%AD%97%E5%A1%94%E4%B9%A6%E7%B1%8D%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    function getBookHashId(){
        var url = document.location.toString();
        var arrUrl = url.split("//");

        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

        if(relUrl.indexOf("?") != -1){
            relUrl = relUrl.split("?")[0];
        }
        var book_hash_id = relUrl.split("/")[2].split(".")[0]

        return book_hash_id;
    }

    function getBookPageUrl(bookHashId,page){
        return '/imgFileStream/' + bookHashId+'/'+page;
    }

    // 从url中获取图片
    function getImgFromUrl(url,callback){
        var img = new Image();
        img.src = url;
        img.onload = function() {
            callback(img);
            console.log("complete download " + url);
        };
        var tryTime = 0;
        img.onerror = function(){
            tryTime ++;
            if(tryTime<4){
                console.log("download "+url + "error try to get angain");
                getImgFromUrl(url,callback);
            }else{
                console.log("超过尝试次数" +url);
            }
        }
    }

    function getImgFromUrls(urls,callback){
        var data = {};
        var urlLen = urls.length;
        for(const url of urls){
            getImgFromUrl(url,function(img){
                data[url]=img;
                urlLen--;
                if(urlLen<=0){
                    callback(data)
                }
            });
        }
    }

    $("#top").append("<a href='#' id='downloadpdf'>下载</a><div id='downloadpdftip'></div>");
    $("#downloadpdf").click(function(){
        console.log("正在下载");
        $("#downloadpdf").hide();
        $("#downloadpdftip").empty().text("正在下载，耐心等待...");
        var imageUrls =[];
        var bookName = $($("#top").find("a")[1]).text();
        var bookHashId = getBookHashId();
        var pageNum = $('#page center').first().contents().eq(2).text().replace(/\//g,'').replace(/ /g,'');
        var doc = new jsPDF();
        imageUrls=[];
        for(var i=1;i<=pageNum;i++){
            imageUrls[i-1]=getBookPageUrl(bookHashId,i);
        }
        getImgFromUrls(imageUrls,function(imgs){
            console.log("正在导出");
            var first = 1;
            for(const url of imageUrls){
                if(first){
                    first=0;
                }else{
                    doc.addPage(200,300);
                }
                doc.addImage(imgs[url],'JPG', 0, 0,200,300);
                console.log("create pdf "+url);
            }
            doc.save(bookName+".pdf");
            $("#downloadpdf").show();
            $("downloadpdftip").hide();
        });

    });
})()
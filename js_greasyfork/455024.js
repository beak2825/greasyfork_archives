// ==UserScript==
// @name         zhihuZhuanLanDownload
// @namespace    http://xzystudy.com
// @version      0.1
// @description  zhihu
// @author       xzy
// @match        https://*.zhihu.com/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455024/zhihuZhuanLanDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/455024/zhihuZhuanLanDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadBook() {
        $("#downStatus").remove();
        $("#currentDownload").remove();
        $("[class^=CatalogModule-title-]").append('<span id="downStatus">  【下载中】</span>');
        $("[class^=CatalogModule-title-]").append('<span id="currentDownload" >【已下载<span id="currentDownloadNum"></span>%】</span>');


        let bookArr = [];
        addBookMetaDataToArr(bookArr);

        let sectiobMetaData = getSectiobMetaData();
        let sectionNum = Array.from(sectiobMetaData.values()).filter(i=>i.type===0).length;

        $("#currentDownloadNum").data("sectionNum",sectionNum);

        sectiobMetaData.forEach(function(value, key) {
            if(value.type === 0){
                value.ajax = $.ajax({
                    type: 'get',
                    url: value.url,
                    dataType: 'html',
                    data:{},
                    success: function (data) {
                        let page = $(data);
                        let content = page.find("#manuscript").text();
                        value.content = content;
                        ajaxCallback();
                    }
                });
            }
        });
        $.when(...Array.from(sectiobMetaData.values()).filter(i=>i.ajax!=null).map(i=>i.ajax)).done(function(){
            debugger
            addSectionToBook(bookArr,sectiobMetaData);
            doDownLoad(bookArr);
            $("#downStatus").text("【下载完成】");
            $("#currentDownload").remove();
            $("#downloadAllBtn").attr("style",'cursor: pointer;');
        });

    }

    function addSectionToBook(bookArr,sectiobMetaData){
        let sectionArr = Array.from(sectiobMetaData.values());
        sectionArr.sort((a,b)=>a.serialNumber - b.serialNumber);
        sectionArr.forEach(function(item) {
            bookArr.push(item.title+"\n");
            if(item.type===0){
                bookArr.push(item.url+"\n");
                bookArr.push(item.words+"\n\n");
                bookArr.push(item.content);
                bookArr.push('\n\n\n\n');
            }
        });
    }
    function ajaxCallback(){
        //获取已下载章节数
        let downloadNum = $("#currentDownloadNum").data("downloadNum")||0;
        $("#currentDownloadNum").data("downloadNum",++downloadNum);

        //全部章节数
        let sectionNum = $("#currentDownloadNum").data("sectionNum");
        $("#currentDownloadNum").text((downloadNum/sectionNum*100).toFixed(2));
    }

    function doDownLoad(bookArr) {
        let bookName = $("[class^=HeaderInfo-title]").find("span:not([class*=HeaderInfo-titleTag])").text();
        var blob = new Blob(bookArr, {type: 'text/plain'});
        var aLink = document.createElement('a')
        aLink.href = URL.createObjectURL(blob);

        aLink.setAttribute('download',bookName+'.txt')
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
    }

    function getSectiobMetaData() {

        let href = window.location.href;
        let bookId = href.substring(href.lastIndexOf("/")+1);
        let sectionMap = new Map();


        let arts = $("[class^=ChapterItem-root],[class^=CatalogModule-chapterCommonTitle-]");
        arts.each(function(i,item){
            let art = $(item);
            //章节类型 0：有实际内容   1：大标题没有实际内容
            let serialNumber = i;
            let type = 0;
            //章节ID
            let id = null;
            //章节url
            let url = null;
            //章节标题
            let title = null;
            //章节字数
            let words = null;
            if(art.attr("class").includes("CatalogModule-chapterCommonTitle")) {
                //章目录  没有文章内容
                type = 1;
                title = art.text();
            }else{
                let cardInfo = JSON.parse(art.attr("data-za-extra-module"));
                id = cardInfo.card.content.id;
                url = 'https://www.zhihu.com/market/paid_column/'+bookId+'/section/'+id
                title = art.find("[class^=ChapterItem-title]").text();
                words = art.find("[class^=ChapterItem-extraText] span:nth-child(1)").text();
            }
            sectionMap.set(id,{
                serialNumber:serialNumber,
                type:type,
                id:id,
                url:url,
                title:title,
                words:words,
                content:'',
                ajax:null
            });

        });
        return sectionMap;
    }

    function getBookMetaData(){
        return {
            //书名
            bookName :$("[class^=HeaderInfo-title]").find("span:not([class*=HeaderInfo-titleTag])").text(),
            //评分
            score :$("[class^=HeaderInfo-source").text(),
            //评论数
            reviews : $("[class^=HeaderInfo-reviewsInfo] div:nth-child(1)").text(),
            //章节信息
            sectionInfo :$("[class^=CatalogModule-updateText]").text(),
            //简介
            intro : $("[class^=IntroModule-description-] [class*=IntroSummary-richText]").text(),
            //链接
            href : window.location.href
        }
    }

    function addBookMetaDataToArr(bookArr) {
        let bookMeataData = getBookMetaData();

        bookArr.push(bookMeataData.bookName+"\n\n");
        bookArr.push("简介：" + bookMeataData.intro+ "\n\n");
        bookArr.push("评分:"+bookMeataData.score+"\n");
        bookArr.push(bookMeataData.reviews+"\n");
        bookArr.push(bookMeataData.sectionInfo+"\n");
        bookArr.push(bookMeataData.href+"\n");
        bookArr.push("\n\n\n\n");
    }

    function downloadAll() {
        $("#downloadAllBtn").attr("style",'pointer-events:none;color:#cccccc!important;');

        if ($("[class^=CatalogModule-allSection]").length === 0) {
            $("#moreStatus").remove();
            console.log("加载完毕");
            $("[class^=IntroSummary-expandButton-]").click();
            downloadBook();
        }else {
            if($("#moreStatus").length===0) {
                $("[class^=CatalogModule-title-]").append('<span id="moreStatus">  【正在加载全部章节...】</span>');
            }
            $("[class^=CatalogModule-allSection]").click();
            setTimeout(function(){
                downloadAll();
            },1000);

        }
    }


    $(document).ready(function(){
        let a = $('<a id="downloadAllBtn" style="cursor: pointer;">&nbsp;&nbsp;&nbsp;批量下载</a>');
        a.on("click",function(){
            try {
                downloadAll();
            } catch (error) {
                a.attr("style",'cursor: pointer;');
            }

        });
        $("[class^=CatalogModule-title-]").append(a);

        $("[class^=IntroSummary-expandButton-]").click();
    });


})();
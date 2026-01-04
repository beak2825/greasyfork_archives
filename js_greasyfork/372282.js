// ==UserScript==
// @name         Nyaa Helper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  文章列表:自動高亮下載超過800的文  內文:自動開啟第一個連結
// @author       Yich
// @include        https://sukebei.nyaa.si/*
// @grant          GM_openInTab
// @grant        window.close
// @grant GM_setValue
//@grant GM_getValue
//@require https://code.jquery.com/jquery-3.3.1.min.js
//@require https://cdnjs.cloudflare.com/ajax/libs/jquery.sticky/1.0.4/jquery.sticky.min.js
//@run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/372282/Nyaa%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/372282/Nyaa%20Helper.meta.js
// ==/UserScript==

//====================文章列表=============================
if( !UrlContains("view")){
    var maxWindowOpen = 15;//設定下拉選單開啟文章的間隔
    var articles = $(".table-responsive table tr");
    var DownloadCount = GM_getValue("DownloadCount",100);//defaultDownloadcount的預設值
    $(".sticky-wrapper").remove();
    $('.navbar-collapse').append("<div id=\"stickyMenu\"></div>");


    //下載數量若超過此值，就標上success的class
     $("#stickyMenu").append("<ul class=\"nav navbar-nav\" style=\"margin-top:10px;margin-right:5px;\">  \
                         <input type=\"number\" id=\"defaultDownloadcount\" style=\"width:60px\" value="+ DownloadCount +" placeholder=\"高亮指定下載數\" />\
                         <span style=\"color:red;background-color:white\">Count: <span id=\"matchCount\">0</span></span></ul>");

     $("#stickyMenu").append("<ul  class=\"nav navbar-nav\"style=\"margin-top:10px;margin-right:5px;\"><select id=\"OpenwindowIn////dexDropdown\"></select></ul>");

    document.getElementById ("defaultDownloadcount").addEventListener("input",  function(){
        GM_setValue("DownloadCount",this.value);
        HighLightArticle(articles,this.value);
        GenerateOpenwindowIndexDropDown($("#matchCount").text(),maxWindowOpen);
    }, false);

    HighLightArticle(articles,$("#defaultDownloadcount").val());
    GenerateOpenwindowIndexDropDown($("#matchCount").text(),maxWindowOpen);

    //加入按鈕
    $("#stickyMenu").append("<ul class=\"nav navbar-nav\" style=\"margin-top:7px\"><li><button type=\"button\"  id=\"btnOpenAll\" class=\"btn btn-success\">開啟高亮文章</button></li></ul>");
    //點擊按鈕事件 開啟超過指定瀏覽數的文章
    document.getElementById ("btnOpenAll").addEventListener ("click",  function(){
    var start = $('#OpenwindowIndexDropdown option:selected').val() || 0;//start是目前下拉選單的值
   var end = parseInt(parseInt(start)+parseInt(maxWindowOpen));
    $(".OverBrowseCount").slice(start, end).each(function() {
        var url = "https://"+window.location.hostname + $(this).find("td:eq(1)>a").attr("href");
        //console.log($(this).find("td:eq(1)>a").text());
        GM_openInTab( url, true );
    });
}, false);
    //將stickyMenu置頂
         $("#stickyMenu").sticky({topSpacing:0,zIndex:9999});

}
    //將瀏覽數超過指定數量的文章標上success
function HighLightArticle(articles,DownLoadCount){
        //移除所有class
    articles.removeClass();
    var matchCount = 0;
    articles.each(function() {
        var currentDownloadCount = $(this).find('td:last').html();
        if(parseInt(currentDownloadCount) >= parseInt(DownLoadCount)){
             $(this).addClass("success").addClass("OverBrowseCount");
            matchCount+=1;
        }
    });
    $("#matchCount").html(matchCount);
}

//產生用來控制開啟特定範圍的下拉選單
function GenerateOpenwindowIndexDropDown(articleCount,maxWindowOpen){
      articleCount = articleCount || 75;
      $("#OpenwindowIndexDropdown").find('option').remove();
      for(var i=0; i < articleCount/maxWindowOpen; i++)
     {
         var indexStart = i*maxWindowOpen;
         var end = parseInt(parseInt(indexStart)+parseInt(maxWindowOpen));
         if(end>articleCount)end=articleCount;
          $('#OpenwindowIndexDropdown').append("<option value=\""+indexStart+"\">"+indexStart+"~"+end+"</option>")
     }

}
//====================文章內文=============================
if(UrlContains("view")){
        //取得description區塊的html
        var html = $("#torrent-description").html();
        var rawHtml = decodeEntities(html);
        //找出區塊裡的連結
        var reg = /((?:\w+):\/\/([\w@][\w.:@-]+)\/?[\w\.?=%&=\-@\/$,]*)/g;
        var url;
        while (url = reg.exec(rawHtml)) {
            if(!url[1].includes('offkab')&&!url[1].includes('dailyjav')){
                //彈出視窗
                GM_openInTab( url[1], true );
                break;
            }
        }

    //按下ctrl+Q自動開啟磁力連結且自動關閉視窗
    document.onkeydown =function(e){
   e = e || window.event; // for IE to cover IEs window event-object
  if(e.which = 18 && e.which == 81){
      window.location.href = $('a[href^="magnet"]').attr('href');
      window.close();
  }
}
            //加入說明文字
            if(!$("#pluginInfo").length){
            $('.navbar-collapse').append("<ul class=\"nav navbar-nav\" style=\"margin-top:15px\"><li><span id=\"pluginInfo\"style=\"color:red\">Ctrl+Q:複製磁力連結&關閉視窗    Ctrl+W:關閉視窗</span></li></ul>");
        }
}

//=======================utility======================

function UrlContains(urlfragment){
	return document.URL.indexOf(urlfragment) != -1;
}

//url decode
function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}
//複製字串到剪貼簿
function copyToClipboard(strbecopy) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(strbecopy).select();
    document.execCommand("copy");
    $temp.remove();
}
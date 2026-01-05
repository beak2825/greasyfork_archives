// ==UserScript==
// @name         ReadKanquwen
// @namespace    http://ReadKanquwen.JMNSY/
// @version      0.1
// @description  对看趣闻网站的文章进行阅读标记的脚本，目前只有简体标记
// @match        http://kanquwen.com/*
// @license      MIT
// @copyright    2015.7.25, JMNSY
// @downloadURL https://update.greasyfork.org/scripts/11187/ReadKanquwen.user.js
// @updateURL https://update.greasyfork.org/scripts/11187/ReadKanquwen.meta.js
// ==/UserScript==
$().ready(function(){
    var link = window.location.href;
    if(/\/\d{1,}\//.test(link)){
        var id_temp = link.match(/\/\d{1,}\//)[0];
        var id = id_temp.substring(1,id_temp.length - 1);
        var arr = window.localStorage.getItem("postid") == null?{}:JSON.parse(window.localStorage.getItem("postid"));
        if(arr[id] == null){
            arr[id] = true;
            window.localStorage.setItem("postid",JSON.stringify(arr));
        }
    }
    var postid = window.localStorage.getItem("postid") == null?{}:JSON.parse(window.localStorage.getItem("postid"));
    $(".post_title").each(function(){
        var temp = $(this);
        var postindex_temp = temp.children(":first").attr("href").match(/\/\d{1,}\//)[0];
        var postindex = postindex_temp.substring(1,postindex_temp.length - 1);
        if(postid[postindex] && !/com\/\d{1,}\//.test(link)){
            var img1 = new Image();
            img1.className="read";
            img1.src="data:image/gif;base64,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";
            temp.next().children(":first").before(img1);
        }
    });
    $(".read").css("float","right").css("z-index","999").css("width","13%").css("length","13%");
    $(".meta").append("<div style='clear:right'>");
});
//如果需要清除阅读痕迹，请在控制台执行下面这句
//localStorage.clear();
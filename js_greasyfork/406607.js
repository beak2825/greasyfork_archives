// ==UserScript==
// @name         百度网盘搜索助手
// @namespace    soledadchao
// @version      1.0.0
// @description  百度网盘下载！
// @author       soledad.chao@gmail.com
// @include      *://www.baidu.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/406607/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406607/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addBtn();
    inputSearch();

    function addBtn(){
                var search = "<div id='baiduPanSearch'   style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;overflow:visible'><p style='font-size:25px;color:red'>免费搜索</p></div>";
                $("body").append(search);
    }
    
    function inputSearch(){
        var inputBox = "<input id='inputSearchBox' width='200px' height='40px'></input>" ;
        $("search").append(inputBox);
    }
    
    function getDownloadURL(){
        var url = window.location.href;
        url =  url.replace(/baidu.com/g,"baiduvvv.com");
        return url;
    }

   function addDownloadBtnEvent(url){
       $("#wenkudownload").click(function(){
       window.open(url);
       });
   }
})();
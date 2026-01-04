// ==UserScript==
// @name 163 Music Downloader 网易云音乐下载助手
// @author       Zszen John
// @namespace    https://www.jianshu.com/u/15893823363f
// @version 3.0
// @include /^https?://music\.163\.com/.*$/
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require https://cdn.staticfile.org/downloadjs/1.4.8/download.min.js
// @compatible Chrome
// @compatible Safari
// @grant        none
// @description 用于在网页端直接下载网易云音乐, 增加大封面下载，增加了歌词下载, 修复有时候不出现按钮的问题
// @note        2020.07-29 v3.0 修正有时无法显示按钮问题
// @downloadURL https://update.greasyfork.org/scripts/379002/163%20Music%20Downloader%20%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/379002/163%20Music%20Downloader%20%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var plugin_name = "163MD"
    var is_debug = 1;
    if(is_debug) console.log([plugin_name,"init"]);
    //is_debug = false;
    var regexp_id = /https\:\/\/music\.163\.com\/#\/song\?id\=(\d+)/;

    loop_check();

    function loop_check(){
        var iframe = $("#g_iframe");
        if(is_debug) console.log([plugin_name,iframe]);
        if(iframe){
            if(is_debug) console.log([plugin_name,"run"]);
            var url = geturl(getid());
            if (window.location.href.search(regexp_id)==0){
                if(is_debug) console.log([plugin_name,"true"]);
                insertElem(url, iframe);
            }
        }else{
            setTimeout(loop_check ,500);
        }
        //iframe.on('load', function () {
        //});
    }

    function export_raw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;

        var export_blob = new Blob([data]);

        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fake_click(save_link);
    }

    function fake_click(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click", true, false, window, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        obj.dispatchEvent(ev);
    }

    function getid() {
        var id = regexp_id.exec(window.location.href)[1];
        return id;
    }

    function geturl(id) {
        var str1 = "http://music.163.com/song/media/outer/url?id=";
        var str2 = ".mp3"
        return str1 + id + str2;
    }

    function save_lyric(){
        var part1 = $("iframe#g_iframe").contents().find("div.bd.bd-open")[0].innerText;
        var part2 = $("iframe#g_iframe").contents().find("div#flag_more")[0].innerText;
        var idx = part1.lastIndexOf("展开")
        if(idx>=0){
            part1 = part1.substr(0,part1.lastIndexOf("展开"))
            part1 += "\n"+part2
        }
        export_raw("lyric.txt",part1)
    }

    function insertElem(url, iframe) {
        //var title = $(document).attr("title");
        //var titles = title.split(" - ");
        var content_frame = $("#content-operation", document.getElementById('g_iframe').contentWindow.document.body)
        if(is_debug) console.log([plugin_name,"content_frame=",content_frame]);
        var album = $("#g_iframe").contents().find(".u-cover.u-cover-6.f-fl>img");
        var name = getid();
        var element = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 1" hidefocus="true" title="直接下载" target="_blank" href="'+url+'" download="'+name+'"><i><em class="ply"></em>直接下载</i></a>');
        //var element = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 1" id="'+url+'" hidefocus="true" title="直接下载" target="_blank" href="javascript:"><i><em class="ply"></em>直接下载</i></a>');
        //element.click(evt=>{
           // dl(evt.target.id, getid()+'.mp3', 'mp3');
         //   var title = $(document).attr("title");
         //   var titles = title.split(" - ");
        //    var exts = url.split(".");
       //     export_raw(titles[0]+"."+exts[exts.length-1], url);
            //alert([titles[0]+"."+exts[exts.length-1], url]);
        //});
        content_frame.append(element);

        var element2 = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 2" hidefocus="true" title="下载封面" target="_blank" href="'+album.attr("data-src")+'"><i><em class="ply"></em>下载封面</i></a>');
        content_frame.append(element2);

        var el2img = $("<img src='"+album.attr("data-src")+"' style='width:30px;'>");
        //el2img.src = album.attr("data-src");
        content_frame.append(el2img);

        //alert($("div.bd.bd-open").length)

        var element3 = $('<a class="u-btn2 u-btn2-2 u-btni-addply f-fl 3" hidefocus="true" title="下载歌词"><i><em class="ply"></em>下载歌词</i></a>');
        content_frame.append(element3);
        element3.on("click",save_lyric)
    }


    function dl(url, strFileName, strMimeType) {
        var xmlHttp = null;
        if (window.ActiveXObject) {
            // IE6, IE5 浏览器执行代码
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlHttp = new XMLHttpRequest();
        }
        //2.如果实例化成功，就调用open（）方法：
        if (xmlHttp != null) {
            xmlHttp.open("get", url, true);
            xmlHttp.responseType = 'blob';//关键
            xmlHttp.send();
            xmlHttp.onreadystatechange = doResult; //设置回调函数
        }
        function doResult() {
            if (xmlHttp.readyState == 4) { //4表示执行完成
                if (xmlHttp.status == 200) { //200表示执行成功
                    download(xmlHttp.response, strFileName, strMimeType);
                }
            }
        }
    }
})();
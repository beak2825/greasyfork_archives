// ==UserScript==
// @name         bilibili_vedio_list_export_mdfile
// @namespace    jarzhen@163.com
// @version      0.2
// @description  b站视频列表获取，点击[选集]导出[复选框,视频序号,视频名,视频时长]视频列表的md文件
// @author       jiazhen
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424651/bilibili_vedio_list_export_mdfile.user.js
// @updateURL https://update.greasyfork.org/scripts/424651/bilibili_vedio_list_export_mdfile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function prepare(){
        var video_list = [];
        var video_name = $("#viewbox_report > h1 > span").html();
        $("#multi_page > div.cur-list > ul li").each(function(){
            var video = {};
            video.part_num = $(this).find("span.page-num").html();
            video.part_name = $(this).find("span.part").html();
            video.duration = $(this).find("div.duration").html();
            video_list.push(video);
        });
        //生成json
        //console.log(JSON.stringify(video_list));
        //生成markdown格式文本
        var md_text = "";
        video_list.forEach((item,index,array)=>{
            var i = 0;
            for(var d in item) {
                //debugger;
                if(i==0){
                    md_text+="- [ ] ";
                }else{
                    md_text+="  ";
                }
                md_text+=item[d];
                i++;
            }
            if(index < array.length-1){
                md_text+="\r\n";
            }
        });
        download(video_name+".md",md_text);
    }
    //console.log(md_text);
    //写入文件
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    $("#eplist_module > div.list-title.clearfix").on("click", prepare);
    $("#multi_page > div.head-con").on("click", prepare);
})();
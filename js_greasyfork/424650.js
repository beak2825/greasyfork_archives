// ==UserScript==
// @name         weread_pc_directory_export_mdfile
// @namespace    jarzhen@163.com
// @version      1.5
// @description  使用[微信读书]电脑版读书时，打开目录按下键盘D下载名为[书名_作者.md]的文件，该文件内容为带有缩进层级和选项框的目录，便于标记书籍已读。
// @author       jiazhen
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match        https://weread.qq.com/web/reader/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424650/weread_pc_directory_export_mdfile.user.js
// @updateURL https://update.greasyfork.org/scripts/424650/weread_pc_directory_export_mdfile.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var jq = jQuery.noConflict();
    function prepare(){
        //此处jq就代表JQuery
        var title_list = [];
        //书名
        var book = jq("#routerView > div > div:nth-child(5) > div.readerCatalog > div.readerCatalog_bookInfo.readerCatalog_bookInfo > div.readerCatalog_bookInfo_right > h2 > span.readerCatalog_bookInfo_title_txt").html();
        //作者
        var author = jq("#routerView > div > div:nth-child(5) > div.readerCatalog > div.readerCatalog_bookInfo.readerCatalog_bookInfo > div.readerCatalog_bookInfo_right > div").html();
        //目录
        jq("li.readerCatalog_list_item>div").each(function(){
            var title = {};
            title.retract = parseInt(jq(this).attr("class").split(" ")[1].substr("readerCatalog_list_item_level_".length));
            title.name = jq(this).find("div.readerCatalog_list_item_title_text").html();
            title_list.push(title);
        });
 
        //生成json
        //console.log(JSON.stringify(title_list));
        //生成markdown格式文本
        var md_text = "";
        title_list.forEach((item,index,array)=>{
            var i = 0;
            for(var d in item) {
                if(i==0){
                    md_text+="  ".repeat(item[d]-1)+"- [ ] ";
                }else{
                    md_text+=item[d];
                }
                i++;
            }
            if(index < array.length-1){
                md_text+="\r\n";
            }
        });
        //console.log(md_text);
        //写入文件
        download(book+"_"+author+".md",md_text);
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    //绑定键盘字母D点击事件
    jq(document).keyup(function(e){
        switch(e.keyCode) {
            case 68:
                prepare();
            return;
        }
    });
 
})();
// ==UserScript==
// @name         neatreader_web_directory_export_mdfile
// @license MIT
// @namespace    jarzhen@163.com
// @version      1.5
// @description  使用[NeatReader]网页版读书时，点击键盘字母D下载名为[书名.md]的文件，该文件内容为带有缩进层级和选项框的目录，便于标记书籍已读。
// @author       jiazhen
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match        https://www.neat-reader.cn/webapp*
// @match        https://neat-reader.cn/webapp*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468158/neatreader_web_directory_export_mdfile.user.js
// @updateURL https://update.greasyfork.org/scripts/468158/neatreader_web_directory_export_mdfile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = jQuery.noConflict();
    function prepare(){
        var importJs=document.createElement('script'); //在页面新建一个script标签
        importJs.setAttribute("type","text/javascript"); //给script标签增加type属性
        importJs.setAttribute("src", 'https://cdn.jsdelivr.net/npm/jquery@3.4.1');
        var title_list = [];
        //书名
        var book = jq("title").html();
        //目录
        jq("div.book-catalog div").each(function(){
            var title = {};
            title.retract = parseInt(jq(this).attr("class").split(" ")[0].substr("nav-level-".length));
            title.name = jq(this).attr("data-label");
            title_list.push(title);
        });
        //生成json
        //console.log(JSON.stringify(title_list));
        //生成markdown格式文本
        var md_text = "";
        title_list.forEach((item,index,array)=>{
            var i = 0;
            for(var d in item) {
                //debugger;
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
        //写入文件
        download(book+".md",md_text);
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
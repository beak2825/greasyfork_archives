// ==UserScript==
// @name         保存下载资源页
// @namespace    https://greasyfork.org/zh-CN/scripts/391440-%E4%BF%9D%E5%AD%98%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%E9%A1%B5
// @version      0.1.3
// @description  再VIP资源站中，生成用于you-get下载的资源List文件，内容格式为 URL!!Name
// @author       Michael.Y.Ma
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @match        *://*.okzy.co/*
// @match        *://*.zuidazy1.net/*
// @match        *://*.zxziyuan.com/*
// @match        *://*.zuidazy1.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391440/%E4%BF%9D%E5%AD%98%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/391440/%E4%BF%9D%E5%AD%98%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%E9%A1%B5.meta.js
// ==/UserScript==

function DoCopyStyleUrl(){
    if($('.warp')){
     var filmName = $('.container>.nvc>dl>dd>a:last').text()
     var copyUrl = new Array()
     var urls = $(':checkbox[value$=m3u8]')
     var clipText=''
     $.each(urls,function(i,u){
       var url = $(u)
       if(url.val().endWith('m3u8')){
           var content = url.parent().text().split('$')
           copyUrl.push(content)
       }
     })
     if(copyUrl.length==1){
         clipText = copyUrl[0][1]+'!!'+filmName
     }
     else if(copyUrl.length > 1){
         copyUrl.forEach((url,i)=>{
             clipText += url[1]+'!!'+url[0]+'\r\n'
         })
     }
     download(clipText, 'List.txt','text/plain')
    }
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

(function() {
    'use strict';
    String.prototype.endWith=function(s){
        if(s==null||s==""||this.length==0||s.length>this.length)
            return false;
        if(this.substring(this.length-s.length)==s)
            return true;
        else
            return false;
        return true;
    }

    String.prototype.startWith=function(s){
        if(s==null||s==""||this.length==0||s.length>this.length)
            return false;
        if(this.substr(0,s.length)==s)
            return true;
        else
            return false;
        return true;
    }

    var btn = $( '<button>下载you-get连接</button>' )
    btn.bind('click',DoCopyStyleUrl)
    $('.vodplayinfo').first().append(btn)
})();
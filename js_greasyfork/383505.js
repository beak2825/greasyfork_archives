// ==UserScript==
// @name         IluutionPngDownload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于在yu3.shop代理打开的Illution 网站下载对应的png资源，当前只支持yu3.shop代理打开的资源
// @author       You
// @include      *yu3.shop*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383505/IluutionPngDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/383505/IluutionPngDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var obj = document.getElementsByName("download");
    var buttonText = '<input type = "button" value = "Download" style="color: #7ED321" onClick="window.execute(this.form);"/>';
    var div = document.createElement("div");
    div.innerHTML = buttonText;
    console.log(obj.length);
    for(var v of obj){
        v.appendChild(div.cloneNode(true));
    }


 //   });

    window.execute = function(form){
         var path = form.path_image.getAttribute('value');
     //   console.log(path);
        var name = path.split("/");
        var url = 'http://www.yu3.shop/browse.php?u=http%3A%2F%2Fupemocre.illusion.jp'+path+'&b=21&f=norefer'
    //    console.log(url);
    //   window.open(url,"DOWNLOAD");
        download(url);
    }
    function download(url){
        var eleLink = document.createElement('a');
        eleLink.download = url;
        eleLink.style.display = 'none';
// // 字符内容转变成blob地址
        eleLink.href = url;
// // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
// // 然后移除
        document.body.removeChild(eleLink);
    }

})();
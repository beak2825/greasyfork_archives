// ==UserScript==
// @name         蓝奏云连接转换
// @namespace    https://greasyfork.org/zh-CN/scripts/408717-%E8%93%9D%E5%A5%8F%E4%BA%91%E8%BF%9E%E6%8E%A5%E8%BD%AC%E6%8D%A2
// @version      0.5
// @description  从蓝奏云连接转换成pan.lanzou.com解决一部分蓝奏云用户无法打开蓝奏云网站的问题！
// @AuThor       KongKe
// @include       *
// @exclude    *://*.lanzou*/*
// @exclude    *://pc.woozooo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408717/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%BF%9E%E6%8E%A5%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/408717/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%BF%9E%E6%8E%A5%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    function replaceLanZou(str){
        if(str!= undefined && str.indexOf("lanzou")>=0){
            console.log(str);
            console.log("发现蓝奏云链接,已进行替换!");
            return str.replace(/(https?:\/\/)?([a-zA-Z0-9\.]+)?lanzou[a-z]{1}/g,"https://pan.lanzou");
        }
        return str;
    }

    document.addEventListener('copy', function(e) {
        if(e.path[0].id != 'copy_input'){
            var content = window.getSelection().toString();
            var netContent = replaceLanZou(content);
            if(content != netContent){
                var input = document.createElement("input");
                input.setAttribute("id", "copy_input");
                input.setAttribute("value", netContent);
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
            }
        }
    });


    function replaceTextNode(node) {
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
            replaceTextNode(children[i])
        }
        if (node.nodeType === 3) {
            var data = replaceLanZou(node.data);
            if(node.data != data){
                node.data = data;
            }
        }
    }


    setTimeout(function(){
        var arr = document.getElementsByTagName("a");
        for(var i = 0;i<arr.length;i++){
            var a = arr[i];
            var href = a.getAttribute("href");
            var newHref = replaceLanZou(href);
            if(href != newHref){
                a.setAttribute("href", newHref);
            }
        }
        replaceTextNode(document);
    },1500);


})();
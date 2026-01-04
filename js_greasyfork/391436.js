// ==UserScript==
// @name         百度云盘去掉shareset
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove &shfl=shareset
// @homepage     https://greasyfork.org/zh-CN/scripts/391436
// @author       knva
// @match        https://pan.baidu.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.js
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.core.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391436/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E5%8E%BB%E6%8E%89shareset.user.js
// @updateURL https://update.greasyfork.org/scripts/391436/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E5%8E%BB%E6%8E%89shareset.meta.js
// ==/UserScript==

(function() {
    'use strict';

    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };
    ah.hook({
        //拦截回调
        onreadystatechange:function(xhr){
            //console.log("onreadystatechange called: %O",xhr)
        },
        onload:function(xhr){
            //   console.log("onload called: %O",xhr)
        },
        //拦截方法
        open:function(arg,xhr){
            //  console.log("open called: method:%s,url:%s,async:%s",arg[0],arg[1],arg[2]);

        },
        responseText: {
            getter: tryParseJson2
        },
        response: {
            getter:tryParseJson2
        }
    })

    function tryParseJson2(v,xhr){
        var contentType=xhr.getResponseHeader("content-type")||"";

        if(contentType.toLocaleLowerCase().indexOf("json")!==-1&&xhr.responseURL.indexOf("/set")>=0){
            console.log(v);
            v  =  v.replaceAll("&shfl=shareset","");
            // v=JSON.parse(v);
            console.log(v);

            //不能在属性的getter钩子中再读取该属性，这会导致循环调用
            //v=JSON.parse(xhr.responseText);
        }
        return v;
    }
})();
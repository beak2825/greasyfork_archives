// ==UserScript==
// @name         v2ex 帖子预览
// @namespace    oneisall_v2ex
// @version      0.0.2
// @description  在主题标题，添加预览内容功能
// @author       oneisall
// @require      https://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @match        *://*.v2ex.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444543/v2ex%20%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444543/v2ex%20%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function downloadCssAndAppend2Header(){
        // https://cdn.liuzhicong.cn/backupjs/opentip-jquery.2.4.6.min.css
        $.ajax({
          type : "get",
          url : "https://cdn.jsdelivr.net/npm/opentip@2.4.3/css/opentip.css",
          async : false,
          success : function(data){
            appendCss2Header(data)
          }
        });
    }
    function appendCss2Header(cssText){
        if (typeof GM_addStyle != "undefined") {
            console.log("插入css方式","GM_addStyle")
            GM_addStyle(cssText);
        } else if (typeof PRO_addStyle != "undefined") {
            console.log("插入css方式","PRO_addStyle")
            PRO_addStyle(cssText);
        } else if (typeof addStyle != "undefined") {
            console.log("插入css方式","addStyle")
            addStyle(cssText);
        } else {
            console.log("插入方式","head")
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(cssText));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
    }
    function downloadOpentipJsAndInitTip(){
        // https://cdn.liuzhicong.cn/backupjs/opentip-jquery.2.4.6.min.js
        $.ajax({
          type : "get",
          url : "https://cdn.jsdelivr.net/npm/opentip@2.4.3/downloads/opentip-jquery.min.js",
          dataType:"script",
          async : false,
          success : function(data){
            console.log("加载Opentip成功")
            if(! Opentip ){
                console.log("Opentip 加载后不存在")
            }else{
                initTip()
            }
          }
        });
    }
    function initTip(){
        $("a.topic-link").each(function(index,aTopicElement) {
            var $aTopicElement=$(aTopicElement)
            var href = $aTopicElement.attr("href");
            var pattern = /\/t\/(\d+)#?/;
            var arr = pattern.exec(href);
            if (arr.length ===2) {
                var id=arr[1]
                $.ajax({
                    type : "get",
                    url : "https://www.v2ex.com/api/topics/show.json?id="+id,
                    dataType:"json",
                    success : function(data){
                        debugger
                        if($.isArray(data)){
                            $.each(data,function(i,e){
                                if((e['id']+"")===(id+"")){
                                    var content=(e['content']||"")
                                    /**if(content.length>500){
                                        content=content.substr(0,500)+"......"
                                    }*/
                                    // 具体配置：http://www.opentip.org/documentation.html
                                    new Opentip($aTopicElement,content,{group:"v2exTopic",escapeContent:true});
                                }
                            })
                        }else if($.isPlainObject(data)){
                             new Opentip($aTopicElement,"出错了："+JSON.stringify(data),{group:"v2exTopic"});
                        }else {
                            new Opentip($aTopicElement,"出错了，未知格式："+data,{group:"v2exTopic"});
                        }
                    }
                })
            }
        });
    }
    function main(){
        downloadCssAndAppend2Header();
        downloadOpentipJsAndInitTip();
    }
    main();
})();
// ==UserScript==
// @name         飞书开放平台搜索干预参数获取脚本
// @namespace    https://open.feishu.cn
// @version      0.0.1
// @description  移除可能导致出现 Bad Case 的内容，降低截图的成本。
// @author       bestony
// @match        https://open.feishu.cn/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Open-Platform.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455917/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E5%B9%B2%E9%A2%84%E5%8F%82%E6%95%B0%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455917/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E5%B9%B2%E9%A2%84%E5%8F%82%E6%95%B0%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        setTimeout(function(e){
            var docInfo = document.getElementsByClassName("doc-content-info")
            if(docInfo.length ==0) {
                console.log("can't find element");
                return;
            };

            docInfo[0].innerHTML = docInfo[0].innerHTML + ` &nbsp;<a id="get-search-param">提取搜索干预参数</a>`

            function viewAuthor(){
                try{
                    var pathName = window.location.pathname;
                    var apiPath = pathName.replace("/document","https://open.feishu.cn/api/tools/document/detail?fullPath=");

                    fetch(apiPath).then(res => res.json()).then(res => {
                        let id = res.data.document.id;
                        let text = `${id}#official_version#zh_CN`
                        navigator.clipboard.writeText(text).then(
                            () => {
                              alert("复制成功，请进行干预配置");
                            },
                            (e) => {
                                 console.error(e);
                              alert("复制失败，请联系脚本开发者定位问题");
                            }
                        );

                    });
                }catch(e){
                    console.error(e);
                    alert("复制失败，请联系脚本开发者定位问题");
                }

            }

            var link = document.getElementById("get-search-param");
            if(link){
                link.addEventListener ("click", viewAuthor , false);
            }
        },1000);
    });
})();
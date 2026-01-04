// ==UserScript==
// @name         删除知识星球水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除知识星球文章水印
// @author       Mrxn
// @homepage     https://mrxn.net/
// @supportURL   https://github.com/Mr-xn/Kill_zsxq_Watermark
// @license      MIT
// @run-at       document-end
// @match        https://*.zsxq.com/*
// @icon         https://wx.zsxq.com/dweb2/assets/images/favicon_32.ico
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zsxq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480190/%E5%88%A0%E9%99%A4%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480190/%E5%88%A0%E9%99%A4%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function del_watermarkdel_watermark(){
        //首页
        // 使用document.querySelectorAll方法获取带有特定属性的元素
        var index_elements = document.querySelectorAll("[watermark]");
        if (index_elements) {
            // 循环遍历每个元素，并输出元素的文本内容
            for (var i = 0; i < index_elements.length; i++) {
                // 修改元素的样式，删除水印
                if (index_elements[i].style.backgroundImage !== "none !important;"){
                    //console.log("删除首页水印");
                    index_elements[i].style.backgroundImage = "none !important;";
                    // 修改元素的样式，以防万一,设置水印大小为0
                    index_elements[i].style.backgroundSize = "0px";
                }
            }
        }

        // 文章页
        // 获取所有带有.js_watermark类的元素
        var articles_elements = document.querySelectorAll(".js_watermark");
        if (articles_elements) {
            // 循环遍历每个元素
            for (var j = 0; j < articles_elements.length; j++) {
                // 修改元素的样式，删除水印
                if (articles_elements[j].style.backgroundImage !== "none !important;") {
                    //console.log("删除文章水印");
                    articles_elements[j].style.backgroundImage = "none !important;";
                    // 修改元素的样式，以防万一,设置水印大小为0
                    articles_elements[j].style.backgroundSize = "0px";
                }
            }
        }

    }

    //details-container 点击展开
    function details_listen() {
        var detailsContainer = document.querySelectorAll('.details-container');
        if (detailsContainer) {
            //console.log("删除topic水印");
            for (var y = 0; y < detailsContainer.length; y++) {
                detailsContainer[y].addEventListener('click', function() {
                    // 在点击div后500毫秒检查一次
                    setInterval(function() {
                        //文章点开 topic-detail-panel
                        var topic_elements = document.getElementsByClassName("topic-detail-panel");
                        if (topic_elements) {
                            // 循环遍历每个元素
                            for (var x = 0; x < topic_elements.length; x++) {
                                // 修改元素的样式，删除水印
                                if (topic_elements[x].style.backgroundImage !== "none !important;") {
                                    topic_elements[x].style.backgroundImage = "none !important;";
                                    // 修改元素的样式，以防万一,设置水印大小为0
                                    topic_elements[x].style.backgroundSize = "0px";
                                }
                            }
                        }
                    }, 500);
                });
            }
        }
    }
    function topic_preview(){
        var topicpreview = document.querySelectorAll('.topic-preview');
        if (topicpreview){
            // 删除 搜索结果页的水印
            for (var z = 0; z < topicpreview.length; z++) {
                topicpreview[z].addEventListener('click', function() {
                    //console.log("删除topicpreview水印");
                    // 在点击div后500毫秒检查一次
                    setInterval(function() {
                        //文章点开 topic-detail-panel
                        var topic_elements_z = document.getElementsByClassName("topic-detail-panel");
                        if (topic_elements_z) {
                            // 循环遍历每个元素
                            for (var xz = 0; xz < topic_elements_z.length; xz++) {
                                // 修改元素的样式，删除水印
                                if (topic_elements_z[xz].style.backgroundImage !== "none !important;") {
                                    topic_elements_z[xz].style.backgroundImage = "none !important;";
                                    // 修改元素的样式，以防万一,设置水印大小为0
                                    topic_elements_z[xz].style.backgroundSize = "0px";
                                }
                            }
                        }
                    }, 500);
                });
            }
        }else{
            console.log("nothing");
        }
    }
    // 鼠标滚动触发
    window.addEventListener("scroll", function() {
        del_watermarkdel_watermark();
        details_listen();
        topic_preview();
    });
})();
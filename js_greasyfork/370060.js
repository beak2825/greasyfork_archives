// ==UserScript==
// @name         CSDN论坛去评论流广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只保留评论内容，其余一律屏蔽
// @author       You
// @match        https://bbs.csdn.net/topics/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370060/CSDN%E8%AE%BA%E5%9D%9B%E5%8E%BB%E8%AF%84%E8%AE%BA%E6%B5%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/370060/CSDN%E8%AE%BA%E5%9D%9B%E5%8E%BB%E8%AF%84%E8%AE%BA%E6%B5%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeNodesByClass(className){
        var nodeList = document.getElementsByClassName(className);
        for (var i=0;i<nodeList.length;i++)
        {
            var node = nodeList[i];
            removeNode(node);
            i--;
        }
    }
    function removeNodeById(eleId){
        var node = document.getElementById(eleId);
        removeNode(node);
    }
    function removeRecAd(){
        var recList = document.getElementsByClassName("mod_topic_wrap");
        for (var i=0;i<recList.length;i++)
        {
            var rec = recList[i];
            if(rec.getAttribute("data-topic-id") == null){
                removeNode(rec);
                i--;
            }
        }
    }
    function removeNode(node){
        node.parentNode.removeChild(node);
    }
    //移除顶栏
    removeNodeById("csdn-toolbar");
    removeNodesByClass("news-nav");
    //移除顶栏广告
    var topAd = document.getElementsByClassName("owner_top clearfix")[0].nextElementSibling;
    removeNode(topAd);
    //去除评论无关链接
    removeNodesByClass("recom_b");
    //去除大图片广告
    removeNodesByClass("mediav_ad");
    //去除评论中夹杂的csdn推荐
    removeRecAd();
    //去除页面底栏
    removeNodesByClass("pub_fo");
})();
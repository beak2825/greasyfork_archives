// ==UserScript==
// @name         动漫花园增强
// @namespace    https://greasyfork.org/users/390742
// @version      1.0.5
// @description  dmhy.org 动漫花园增强。当前提供磁力链接dn属性修改为资源标题的功能
// @author       fjqingyou
// @match        *://dmhy.org/*
// @require      https://greasyfork.org/scripts/402991-url-editor/code/Url-Editor.js?version=803587
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402994/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/402994/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function(UrlEditor) {
    'use strict';


    // Your code here...

    function $id(id){
        return document.getElementById(id);
    }

    /**
     * 添加磁力链接的显示名称
     */
    function addMagnetDisplayName(magnetDom, displayName){
        if(magnetDom && displayName && displayName.length > 0){//执行的前置环境
            var url = magnetDom.href;
            var dn = UrlEditor.getUrlParam(url, "dn");
            if(!dn){//如果不存在这个参数
                magnetDom.href = UrlEditor.setUrlParam(url, 'dn', encodeURIComponent(displayName));
            }
        }
    }


    /**
     * 增强 show 页面
     */
    function onTopicsView(){
        //显示名称来自标题
        var displayName = document.title;
        for(var i = 0 ; i < 2; i++){
            var index = displayName.lastIndexOf(" - ");
            if(index > -1){
                displayName = displayName.substring(0, index);
            }
        }

        var magnetDownloadDomList = [
            $id("a_magnet"),
            $id("magnet2")
        ];

        for(var j = 0; j < magnetDownloadDomList.length; j++){
            var magnetDom = magnetDownloadDomList[j];
            if(!magnetDom){//如果这个还未准备就绪
                //延迟一会儿再尝试
                setTimeout(onTopicsView, 100);
                break;
            }else{
                //添加磁力链接的显示名称
                addMagnetDisplayName(magnetDom, displayName);

            }
        }

        //截图显示尺寸
        resetViewImageSize();
    }

    /**
     * 增强 list 页面
     */
    function onTopicsList(){
        var magnetDownloadDomList = document.getElementsByClassName("download-arrow");
        for(var i = 0; i < magnetDownloadDomList.length; i++){
            var magnetDom = magnetDownloadDomList[i];
            if(magnetDom){
                //获取 title 的 dom 节点
                var titleDom = magnetDom.parentElement.parentElement.getElementsByClassName("title")[0];
                var linkList = titleDom.querySelectorAll("a");
                var aDom = linkList[linkList.length - 1];
                if(aDom){
                    var displayName = aDom.innerText;

                    //添加磁力链接的显示名称
                    addMagnetDisplayName(magnetDom, displayName);
                }
            }
        }
        if(document.getElementsByClassName("footer").length < 1){//如果页面还未全部加载完毕
            setTimeout(onTopicsList, 100);//稍后重新尝试
        }
    }

    /**
    * show 页面重置图片尺寸
    */
    function resetViewImageSize(){
        var topic_nfos = document.getElementsByClassName("topic-nfo");
        for(var i = 0; i < topic_nfos.length; i++){
            var topic_nfo = topic_nfos[i];
            var imgs = topic_nfo.getElementsByTagName("img")
            for(var j = 0; j < imgs.length; j++){
                var img = imgs[j];
                img.style.width = "100%";
            }
        }
    }

    /**
     * 初始化
     */
    function init(){
        var uri = document.location.pathname;
        if(uri === "/" || uri.indexOf("/topics/list") > -1){
            onTopicsList();
        }else if(uri.indexOf("/topics/view/") > -1){
            onTopicsView();
        }
    }

    //执行初始化
    init();
})(UrlEditor);
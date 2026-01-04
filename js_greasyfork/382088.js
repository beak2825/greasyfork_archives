// ==UserScript==
// @name         ImageViewer
// @namespace    ethan_peng
// @version      0.7
// @description  大图预览oa中图片
// @author       ethan_peng
// @match        *://oa.infoepoch.com/*
// @require     https://cdn.bootcss.com/viewerjs/1.3.3/viewer.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382088/ImageViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/382088/ImageViewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    dynamicLoadCss("https://cdn.bootcss.com/viewerjs/1.3.3/viewer.css");
    //图片点击放大
    var content = document.getElementsByClassName('comment-container');
    for(var i=0;i<content.length;i++){
        new Viewer(content[i]);
    }
    
    var canvasContents = document.querySelector("#canvas");
    if(canvasContents!=null){
        var contents = canvasContents.querySelectorAll("div .element");
            if(contents!=null){
            for(var j=0;j<contents.length;j++){
                 var cContent=contents[j].querySelector("div .content");
                 cContent.onclick=function(event){
                    if(event.shiftKey==1){
                        alert(this.innerHTML);
                    }
                 }
            }
        }
    }
    
    
    /**
     * 动态加载CSS
     * @param {string} url 样式地址
     */
    function dynamicLoadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    
    /**
     * 动态加载CSS
     * @param {string} newStyle 样式
     */
    function addNewStyle(newStyle) {
            var styleElement = document.getElementById('styles_js');

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = 'styles_js';
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            
            styleElement.appendChild(document.createTextNode(newStyle));
        }
})();
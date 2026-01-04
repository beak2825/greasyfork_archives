// ==UserScript==
// @name         南方城乡建设教育平台-星亚科技版
// @namespace    http://tampermonkey.net/
// @version      2022.12.23.1
// @description  自动播放下一节
// @author       XY-Technology
// @match        https://*.gzcots.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457047/%E5%8D%97%E6%96%B9%E5%9F%8E%E4%B9%A1%E5%BB%BA%E8%AE%BE%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/457047/%E5%8D%97%E6%96%B9%E5%9F%8E%E4%B9%A1%E5%BB%BA%E8%AE%BE%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80%E7%89%88.meta.js
// ==/UserScript==


var frame = document.getElementsByTagName("iframe")[1].contentWindow.document
var current = frame.getElementsByClassName("el-tree-node is-expanded is-current is-focusable")[0]
//判断当前视频播放结束
if(current.getElementsByClassName("el-tree-node__expand-icon el-icon-caret-right is-leaf").length>0){
    for(var i = 0; i < frame.getElementsByClassName("el-tree-node is-expanded is-focusable").length; i++){
        //如果是大章节，就跳过
        if(frame.getElementsByClassName("el-tree-node is-expanded is-focusable")[i].getElementsByClassName("el-tree-node__expand-icon el-icon-caret-right expanded").length>0){
            continue;
        }
        //遍历所有视频，如果没有播放完成，就播放它
        if(frame.getElementsByClassName("el-tree-node is-expanded is-focusable")[i].getElementsByClassName("el-tree-node is-expanded is-focusable").length==0){
            frame.getElementsByClassName("el-tree-node is-expanded is-focusable")[0].click()
        }
    }
}
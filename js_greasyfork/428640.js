// ==UserScript==
// @name         虎扑网页端摸鱼版（
// @namespace    http://tampermonkey.net/
// @version      0.6
// @author       TmIgVl
// @match         *://bbs.hupu.com/*
// @description 首页和内容简洁展示
// @downloadURL https://update.greasyfork.org/scripts/428640/%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%91%B8%E9%B1%BC%E7%89%88%EF%BC%88.user.js
// @updateURL https://update.greasyfork.org/scripts/428640/%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%91%B8%E9%B1%BC%E7%89%88%EF%BC%88.meta.js
// ==/UserScript==



(function(){
    'use strict';
    const path = window.location.pathname
    const root = document.getElementById('container')
    const isDetail = path.endsWith('html')
    if(!isDetail){
        // main page
        document.body.style.padding = '0 10rem'
        const [target] = document.getElementsByClassName("bbs-index-web-middle")
        const [a] =document.getElementsByClassName("bbs-sl-web-topic-wrap")
        const result = target || a
        root.replaceWith(result)
    }else{
        const [target] = document.querySelectorAll('[class^="index_bbs-post-web-body-right-wrapper"]') // START WITH THIS CLASS
        target.remove()
    }

}())
// ==UserScript==
// @name         fuck知乎
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自用 简改知乎
// @author       jokewu
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/*/*/*
// @match        https://www.zhihu.com/topic/*/hot
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37722/fuck%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/37722/fuck%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    var css=".ArticleItem-image{width:100px}.content_image{width:50px}.zh-lightbox-thumb{width:100px}.origin_image{width:100px,height:100px}.is-hidden{display:none}";
    css+=".TopstorySideBar{display:none}.Question-sideColumn--sticky{display:none}.column-gif{width:150px}.RichContent-cover{display:none}.VideoCard{width:150px}";
    css+=".TopstoryItem--advertCard{display:none}.GlobalSideBar{display:none}a[href='//www.zhihu.com']{display:none}.AppHeader-nav{display:none}";
    css+=".AppHeader{min-width:200px}.AppHeader-inner{width:552px;margin-left:1px}div[data-reactid='5']{width:368px}headerheader[role='banner']{width:368px}.SearchBar .QuestionAskButton{display:none}";
    css+=".AppHeader-userInfo{flex:0}.SearchBar-input{width:200px}.SearchBar-toolWrapper{width:200px}.Sticky.AppHeader{background:bottom;box-shadow:inherit}.ContentItem-title{font-size:16px;font-weight:normal}";
    css+=".SearchBarExperiment-input{width:200px}.SearchBarExperiment-toolWrapper{width:200px}.Sticky.AppHeader.is-fixed{background:bottom;box-shadow:inherit}";
    var style=document.createElement('style');
    style.type="text/css";
    style.innerHTML=css;
    document.getElementsByTagName('head')[0].appendChild(style);

})();
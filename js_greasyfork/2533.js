// ==UserScript==
// @name 饭否-手机版中自动在新标签页打开链接
// @version 1.0.0
// @author HackMyBrain
// @description m.fanfou.com 上, 点击/触摸即在新标签页打开指定类型的链接
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2533/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E4%B8%AD%E8%87%AA%E5%8A%A8%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/2533/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E4%B8%AD%E8%87%AA%E5%8A%A8%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function (){
    
    // 设置开始
    var config = {
        homepageAllLinks : true, 
        //若为 true, 以下各项(除了第二项statuspage)即使设置为false均无效果,首页的所有链接都会在新tab打开(除了"添加/取消收藏"、"刷新"、"饭否logo"、"存为书签"、"退出"、"下页"、"上页"、"更多"(由免刷新翻页脚本引入))
        
        statuspage : false, //若为 false, 在 http://m.fanfou.com/statuses/* 上不使用此脚本
        
        // 第一项 homepageAllLinks 为 false 时, 以下各项的改动才会生效
        author : true, //  在新tab打开指向其他饭er的链接
        reply : true, // 在新tab打开“回复”消息
        forward : true, // 在新tab打开“转发”消息
        createPM : true, // http://m.fanfou.com/privatemsg.create/*
        replyPM : true, // 在新tab打开“回复”私信
        tlImage : true, // 在新tab打开首页上的图片
        albumImage : true, // 浏览某相册时, 在新tab打开被点击/触摸的图片
        tlTraceback : true // 在新tab打开首页中用于回溯消息的 “>>”
    };
    // 设置结束
    
    
    
    function openLinkInNewTab(e) {
        var target;
        if ( e.target.tagName.toLowerCase() == 'a' ) { 
            target = e.target;
        }
        else if ( e.target.tagName.toLowerCase() == 'img' && e.target.parentElement.tagName.toLowerCase() == 'a') {
            target = e.target.parentElement;
        } 
        else return;
        
        var url = target.href;
        if ( /^http\:\/\/m\.fanfou\.com\/autologin|logout|msg\.favorite|home($|\/|\?v=|\?max_id=)/.test(url) ) return;
        // 点击目标是 存为书签、退出、(取消)收藏消息、首页、下页、上页、刷新、更多(autopager)
        
        if (    ( /^\/home($|\/|\?v=|\?max_id=)/.test(location.pathname) && config.homepageAllLinks ) || 
                ( target.className == 'p' && config.author ) ||
                ( /\/msg\.reply\//.test(url) && target.innerHTML == '回复' && config.reply ) ||
                ( /\/msg\.forward\//.test(url) && target.innerHTML == '转发' && config.forward ) ||
                ( /\/privatemsg\.create\//.test(url) && config.createPM ) ||
                ( /\/privatemsg\.reply\//.test(url) && config.replyPM ) ||
                ( target.className == 'photo' && config.tlImage ) ||
                ( e.target.alt == '照片' && config.tlImage ) ||
                ( /^http\:\/\/m\.fanfou\.com\/statuses\//.test(url) && !/^\/statuses/.test(location.pathname) && config.tlTraceback )   ) {
            window.open(url);
            e.preventDefault();
        }  
    }

    if ( ! ( /^\/statuses\//.test(location.pathname) && !config.statuspage ) ) {
        document.addEventListener('click', openLinkInNewTab, false);
    }
})();
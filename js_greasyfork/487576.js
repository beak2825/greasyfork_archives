// ==UserScript==
// @name         NGA优化摸鱼体验-调整浏览宽度
// @version      0.3.2
// @author       xiaoyaoyuxin
// @description  自定义NGA列表宽度和贴内宽度
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// @namespace https://github.com/xiaoyaoyuxin
// @downloadURL https://update.greasyfork.org/scripts/487576/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C-%E8%B0%83%E6%95%B4%E6%B5%8F%E8%A7%88%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/487576/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C-%E8%B0%83%E6%95%B4%E6%B5%8F%E8%A7%88%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    registerPlugin({
        name: 'widthAuto',  // 插件唯一KEY
        title: 'NGA调整宽度',  // 插件名称
        desc: '自定义列表宽度和贴内宽度',  // 插件说明
        settings: [{
            key: 'listWidth',
            title: '自定义宽度',
            default: 1200
        } ],
        initFunc: function () {
            let customWidth = this.pluginSettings['listWidth'];
            //页面
            mc.style.width = customWidth + "px";
            mc.style.marginLeft = "auto";
            mc.style.marginRight = "auto";
            /*
            //帖子列表
            let threadList = document.getElementById("topicrows");
            if (threadList) {
                threadList.style.width = customWidth + "px";
                threadList.style.marginLeft = "auto";
                threadList.style.marginRight = "auto";
            }

            //帖子详情
            let threadDetail = document.getElementById("m_posts");
            if (threadDetail) {
                threadDetail.style.width = customWidth + "px";
                threadDetail.style.marginLeft = "auto";
                threadDetail.style.marginRight = "auto";
            }

            //页码按钮
            let threadBtntop = document.getElementById("m_pbtntop");
            if (threadBtntop) {
                threadBtntop.style.width = customWidth + "px";
                threadBtntop.style.marginLeft = "auto";
                threadBtntop.style.marginRight = "auto";
            }
            let threadBtnbtm = document.getElementById("m_pbtnbtm");
            if (threadBtnbtm) {
                threadBtnbtm.style.width = customWidth + "px";
                threadBtnbtm.style.marginLeft = "auto";
                threadBtnbtm.style.marginRight = "auto";
            }
            */
        }
    })

})(function(plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});

// ==UserScript==
// @name         微博视频下载助手
// @version      1.1.1
// @description  微博视频旁边自动展示下载按钮，点击即可下载(蚩尤后裔)
// @author       蚩尤后裔
// @homepage     https://greasyfork.org/zh-CN/scripts/458716-%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B
// @match        http*://weibo.com/*
// @match        http*://*.weibo.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/downloadjs/1.4.8/download.js
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @license      MIT
// @namespace https://greasyfork.org/users/1008816
// @downloadURL https://update.greasyfork.org/scripts/458716/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458716/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';

    /**
     * 查找视频标签<video>
     * 注意事项：因为微博的 html 内容都是通过 js 动态加载的，而且随着滚动条下拉，加载的内容也会更多，
     * 所以采用定时器持续查找视图标签。
     */
    function findVideoEle() {
        setInterval(function(){
            let videoJQList = $("video");
            if(videoJQList.length > 0 ){
                console.log("可下载视频个数："+ videoJQList.length);
                videoJQList.each(function (index) {
                    if($(this).attr("src")){
                        // 向视频旁边添加【下载】按钮
                        appendDownloadEle($(this));
                    }
                });
            }
        }, 3000);
    }

    /**
     * 向视频上边添加【下载】按钮
     */
    function appendDownloadEle(videoJQ) {
        let downloadIdAttrName = videoJQ.attr("id") + "_download";
        if($("#" + downloadIdAttrName).length <= 0) {
            // 【下载】按钮
            let downloadJQ = $("<a>下 载</a>");
            downloadJQ.css({
                'background-color': 'rgba(255,130,0, 1)',
                "color": "#fff",
                'font-size': '20px',
                'cursor': 'pointer',
                "border-radius": "10px",
                "padding-left": "10px",
                "padding-right": "10px",
                "margin-bottom": "2px"
            });
            downloadJQ.attr("id", downloadIdAttrName);
            downloadJQ.attr("href", videoJQ.attr("src"));
            downloadJQ.attr("target", "_balnk");
            videoJQ.parent().before(downloadJQ);
            // console.log(videoJQ.attr("id") +" 添加下载按钮：" + downloadIdAttrName +", src=" + videoJQ.attr("src"));

            // 为下载按钮绑定单击事件下载视频
            downloadJQ.on("click", function (event) {
                // console.log("下载视频：" + $(this).attr("id") + ", href=" +  $(this).attr("href"));
                // 阻止 a 标签默认行为
                event.preventDefault();
                if($(this).attr("href")) {
                    // 下载视频
                    download($(this).attr("href"));
                    // 打开一个新的标签页面: 新标签页获取页面焦点,新标签页面关闭后，焦点重新回到源页面
                    GM_openInTab($(this).attr("href"),{ active: true, setParent :true});

                }
            });
        } else {
            // console.log(videoJQ.attr("id") +" 已存在下载按钮：" + downloadIdAttrName + ", src=" + videoJQ.attr("src"));
        }
    }

    $(function () {
        // 查找视频标签<video>,向视频上边添加【下载】按钮.
        findVideoEle();
    });

})();
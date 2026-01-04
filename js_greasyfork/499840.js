// ==UserScript==
// @name         dgj's bilibili ads guard
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  remove all ads from bilibili.com
// @author       noobdawn
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499840/dgj%27s%20bilibili%20ads%20guard.user.js
// @updateURL https://update.greasyfork.org/scripts/499840/dgj%27s%20bilibili%20ads%20guard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockData = localStorage.getItem("dgjBlockData");
    //if (blockData === null)
    {
        blockData = {
            "up_name": "",
            // up主的名字

            "up_uid": "",
            // up主的UID

            "video_keyword": 
                // sb游戏
                "剑网3,原神,崩坏,星穹铁道,星铁,绝区,未定事件簿,米哈游,仙家军,明日方舟,鹰角,海猫,鸣潮,战双帕弥什,库洛,少前,少女前线,面包房少女,散爆,羽中,无期迷途,叠纸,奇迹暖暖,无限暖暖,恋与深空,恋与制作人,百面千相,姚润昊,深空之眼,来古弥新,物华弥新,新月同行,归龙潮,破晓序列,卡拉彼丘,碧蓝档案,蔚蓝档案,雀魂,以闪亮之名,光与夜之恋,尘白禁区",
            // 视频的关键词

            "video_label": 
                // sb游戏 
                "鸣潮,鸣潮公测二创,鸣潮公测创作者激励计划,新三国,火影忍者手游,地下城与勇士,dnf,dnfpk,300英雄,MOBA,三百英雄,剑网3,星穹铁道2.2波提欧,暴雪,原神,崩坏,崩坏学园2,崩坏3,崩坏星穹铁道,星穹铁道,绝区零,绝区0,未定事件簿,米哈游,仙家军,明日方舟,鹰角,鹰角网络,海猫,鸣潮,战双帕弥什,库洛,少前,少前2,少女前线,少女前线2,面包房少女,散爆,羽中,叠纸游戏,奇迹暖暖,无限暖暖,恋与深空,恋与制作人,百面千相,姚润昊,深空之眼,来古弥新,物华弥新,新月同行,归龙潮,望月,破晓序列,卡拉彼丘,碧蓝档案,蔚蓝档案,雀魂,以闪亮之名,光与夜之恋,尘白禁区" +
                // 没营养的东西
                "助眠,生活,情感,日常,校园,娱乐,记录,舞蹈,Vtuber,hololive,免单挑战,探店,美食,时尚,穿搭"
            // 视频的标签
            
        };
        blockData.up_name = blockData.up_name.split(",");
        blockData.video_keyword = blockData.video_keyword.split(",");
        blockData.video_label = blockData.video_label.split(",");
        blockData.up_uid = blockData.up_uid.split(",");
        localStorage.setItem("dgjBlockData", JSON.stringify(blockData));
    }

    const DEBUG = true;

    function removeAds(node, msg) {
        if (DEBUG)
        {
            // 删除所有子元素
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            // 添加一个文本节点
            node.appendChild(document.createTextNode(msg));
        }
        else
            node.remove();
    }

    // 从URL中获取UID
    function GetUidFromUrl(url) {
        var index = url.indexOf("space.bilibili.com/");
        if (index === -1)
            return -1;
        // 将剩下的所有字符转换为字符串
        var uid = url.substring(index + 19);
        return parseInt(uid);
    }

    // 根据UP主屏蔽视频
    function BlockVideoByUp(node) {
        // 向下查找，找到class为"bili-video-card__info--owner"的a，这就是UP主的链接
        var owner = node.getElementsByClassName("bili-video-card__info--owner");
        if (owner.length > 0) {
            var uid = GetUidFromUrl(owner[0].href);
            if (uid === -1)
                return true;
            // 如果uid在blockData的up_uid数组中，就删除这个视频
            if (blockData.up_uid.indexOf(uid) !== -1)
            {
                removeAds(node, "触发UP主：" + uid);
                return true;
            }
            owner = node.getElementsByClassName("bili-video-card__info--author");
            if (owner.length > 0) {
                var name = owner[0].innerText;
                // 如果name在blockData的up_name数组中，就删除这个视频
                if (blockData.up_name.indexOf(name) !== -1)
                {
                    removeAds(node, "触发UP主：" + name);
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    // 根据视频屏蔽视频
    function BlockVideoByVideo(node) {
        var link = node.getElementsByClassName("bili-video-card__info--tit");
        if (link.length > 0) {
            console.log(link[0].title);
            var title = link[0].title;
            for (var j = 0; j < blockData.video_keyword.length; j++){
                if (title.includes(blockData.video_keyword[j])) {
                    removeAds(node, "触发关键字：" + blockData.video_keyword[j]);
                    return;
                }
            }
        }
        // 向下查找，找到class为"bili-video-card__image--link"的a，这就是视频的链接
        link = node.getElementsByClassName("bili-video-card__image--link");
        if (link.length > 0) {
            var url = link[0].href;
            // 打开视频链接，获取视频的关键词和标签
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var data = response.responseText;
                    // 找到<meta data-vue-meta="true" itemprop="keywords" name="keywords" content="
                    let start_string = "<meta data-vue-meta=\"true\" itemprop=\"keywords\" name=\"keywords\" content=\"";
                    let end_string = "\"><meta";
                    var index = data.indexOf(start_string);
                    if (index !== -1)
                    {
                        var keywords = data.substring(index + start_string.length, data.indexOf(end_string, index));
                        var keywordArray = keywords.split(",");
                        // 抛弃第一个元素
                        keywordArray.shift();
                        console.log(keywordArray);
                        // 如果labels数组中有一个元素在blockData的video_label数组中，就删除这个视频
                        for (i = 0; i < keywordArray.length; i++)
                        {
                            if (blockData.video_label.indexOf(keywordArray[i]) !== -1)
                            {
                                removeAds(node, "触发标签：" + keywordArray[i]);
                                return;
                            }
                        }
                    }
                }
            });
        }
    }

    // 每次页面元素变化时，都会触发此函数
    var observer = new MutationObserver(function(mutations) {
        // 遍历所有变化
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node instanceof HTMLDivElement) {
                    // 为菜单新增一个按钮
                    if (node.className === "bili-video-card__info--no-interest-panel")
                    {
                        // 创建一个新的选项，class为"bili-video-card__info--no-interest-panel--item"，innerText为"屏蔽此UP主"
                        var item = document.createElement("div");
                        item.className = "bili-video-card__info--no-interest-panel--item";
                        item.innerText = "屏蔽此UP主";
                        // 将新的选项插入到菜单中
                        node.appendChild(item);
                        // 监听点击事件
                        item.addEventListener("click", function() {
                            // todo
                        });
                    }

                    // 如果新增的节点的class为"floor-single-card"，这部分一般是直播间、番剧、国创、课堂、综艺推荐卡片，干掉
                    if (node.className === "floor-single-card") {
                        removeAds(node, "Ban原因：推送");
                        return;
                    }
                    // 如果新增的节点的class为"bili-video-card is-rcmd"，这部分一般是不能点不感兴趣的卡片，直接干掉
                    if (node.className === "bili-video-card is-rcmd") {
                        removeAds(node, "Ban原因：广告");
                        return;
                    }
                    if (node.className === "bili-video-card is-rcmd enable-no-interest")
                    {
                        node.style.marginTop = '22px';
                    }
                    
                    if (BlockVideoByUp(node) !== true)
                        BlockVideoByVideo(node);
                }
            });
        });
    });

    // 监听整个文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 移除滚动播放广告
    // 找到所有class为"recommended-swipe grid-anchor"的div，这就是左上角的广告滚动页
    var ads = document.getElementsByClassName("recommended-swipe grid-anchor");
    for (var i = 0; i < ads.length; i++) {
        removeAds(ads[i], "Ban原因：广告滚动页");
    }

    // 找到所有首页的广告
    // 找到所有class为"bili-video-card is-rcmd"的div
    ads = document.getElementsByClassName("bili-video-card is-rcmd");
    for (i = 0; i < ads.length; i++) {
        if (ads[i].className === "bili-video-card is-rcmd")
        {
            if (ads[i].parentNode.className === "feed-card")
                removeAds(ads[i].parentNode, "Ban原因：广告");
            else
                removeAds(ads[i], "Ban原因：广告");
        }
    }

    ads = document.getElementsByClassName("feed-card");
    for (i = 0; i < ads.length; i++) {
        // 将样式中的margin-top设为40像素
        ads[i].style.marginTop = '22px';
        if (BlockVideoByUp(ads[i]) !== true)
            BlockVideoByVideo(ads[i]);
    }


})();
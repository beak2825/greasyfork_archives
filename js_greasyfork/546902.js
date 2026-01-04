// ==UserScript==
// @name         bai
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  百家号主页UID提取，隐藏图片，作品首次发布时间由相对时间改为绝对时间，解除复制限制
// @author       天天爆文 yuanban@yeah.net
// @match        https://author.baidu.com/home/*
// @icon         https://www.baidu.com/favicon.ico
// @license      AGPL-3.0-only
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546902/bai.user.js
// @updateURL https://update.greasyfork.org/scripts/546902/bai.meta.js
// ==/UserScript==
 
//隐藏百度登陆条
GM_addStyle(".pc-topbar{display:none !important}");
 
//隐藏全部文章的封面图片
GM_addStyle(".s-col.s-col-4.sfi-article-cover{display:none !important}");
GM_addStyle(".s-col.s-col-4.s-right-img-texts-cover{display:none !important}");
 
//隐藏全部动态的封面图片
GM_addStyle(".s-col.s-col-4.s-image-set-cover{display:none !important}");
GM_addStyle(".s-col.s-col-8.s-image-set-cover{display:none !important}");
 
//隐藏全部视频的封面图片，但是单列视频的封面保留
GM_addStyle(".s-col.s-col-4.s-right-img-texts-cover{display:none !important}");
GM_addStyle(".sfi-video-image{display:none !important}");
//GM_addStyle(".s-video-card-cover{display:none !important}");
//隐藏全部视频的封面图片，但是单列视频的封面保留，直播的封面也保留
GM_addStyle(".s-row.s-row-flex.s-row-wrap.sfi-n-smallVideo.imgsize-1{display:none !important}");
 
//隐藏所有小头像
GM_addStyle(".avatar{display:none !important}");
 
//隐藏按钮“私信”
GM_addStyle(".operate-btn.chat{display:none !important}");
 
//隐藏按钮“关注”
GM_addStyle(".s-subscribes.head.pc-user-uhFollow.operate-btn{display:none !important}");
 
(function() {
    'use strict';
 
    // 时间格式化配置
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
 
        const pad = n => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
 
        return (year === now.getFullYear())
            ? `${month}-${day} ${hours}:${minutes}`
            : `${year}-${month}-${day} ${hours}:${minutes}`;
    };
 
    // 类型处理配置表
    const typeConfig = {
        article: {
            selector: '.sfi-article-subscript',
            timeIndex: 2,
            insertPosition: 'beforeend'
        },
        dynamic: {
            selector: '.sfi-dynamic-subscript',
            timeIndex: null,
            insertPosition: 'beforeend'
        },
        mainSmallVideo: {
            selector: '.sfi-n-smallVideo-subscript',
            timeIndex: null,
            insertPosition: 'beforeend'
        },
        video: {
            selector: '.sfi-video-subscript',
            timeIndex: 1,
            insertPosition: 'beforeend'
        },
        zhibo: {
            selector: '.sfi-live-subscript',
            timeIndex: 1,
            insertPosition: 'beforeend',
            extraProcess: (container) => {
                const liveTag = document.querySelector('.sfi-live-status-tag');
                if (liveTag) {
                    const viewers = liveTag.parentNode.textContent.match(/\d+/)?.[0] || '未知';
                    container.insertAdjacentHTML('afterbegin',
                        `<span>${liveTag.textContent}: ${viewers}人观看</span>`);
                    liveTag.parentNode.remove();
                }
            }
        }
    };
 
    // 核心处理器
    const processItem = (item) => {
        const itemType = item.getAttribute('itemtype').split('/').pop();
        const config = typeConfig[itemType];
        if (!config) return;
 
        const container = item.querySelector(config.selector);
        if (!container) return;
 
        // 处理时间戳
        if (config.timeIndex !== null) {
            const timeSpan = container.children[config.timeIndex];
            const timestamp = item.children[0].getAttribute('publish_at');
            if (timeSpan && timestamp) {
                timeSpan.textContent = formatTimestamp(timestamp);
            }
        }
 
        // 插入nid信息
        const feedId = item.getAttribute('feed_id');
        if (feedId && !container.querySelector('[data-nid-added]')) {
            const nidSpan = document.createElement('span');
            nidSpan.textContent = `nid: ${feedId}`;
            nidSpan.dataset.nidAdded = true;
            container.insertAdjacentElement(config.insertPosition, nidSpan);
        }
 
 
        // 执行额外处理
        config.extraProcess?.(container);
    };
 
    // DOM监听器
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('[itemtype]')) {
                    processItem(node);
                }
            });
        });
    });
 
    // 初始化执行
    document.querySelectorAll('[itemtype]').forEach(processItem);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
// ==UserScript==
// @name        多功能脚本
// @namespace   none
// @match       https://tool.chinaz.com/*
// @match       https://ping.chinaz.com/*
// @match       https://report.chinaz.com/*
// @match       https://whois.chinaz.com/*
// @match       https://www.runoob.com/*
// @match       https://www.json.cn/*
// @match       https://www.bilibili.com/video/*
// @match       https://www.bilibili.com/bangumi/play/*
// @grant       none
// @version     1.0.2
// @icon        https://avatars.githubusercontent.com/u/51319096?s=40&v=4
// @description 🔥多功能整合脚本 - 站长工具/菜鸟教程/json在线解析去广告 + B站专属视频自动跳下一集
// @author      erkang
// @note        2026/1/28 v1.0.2 整合B站自动跳过专属视频功能
// @note        2023/2/8 v1.0.1 新增【菜鸟教程】去广告、菜鸟教程搜索样式为居中
// @note        2023/2/7 v1.0.0 初版发布,新增【站长工具】、【json在线解析】去广告
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/459691/%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459691/%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前域名
    const currentHost = window.location.hostname;
    const currentUrl = window.location.href;

    // 站长工具相关域名
    const chinazDomains = ['tool.chinaz.com', 'ping.chinaz.com', 'report.chinaz.com', 'whois.chinaz.com'];
    const isChinaz = chinazDomains.some(domain => currentHost.includes(domain));

    // 菜鸟教程
    const isRunoob = currentHost.includes('runoob.com');

    // json在线解析
    const isJsonCn = currentHost.includes('json.cn');

    // B站视频
    const isBilibiliVideo = currentHost.includes('bilibili.com') &&
                           (currentUrl.includes('/video/') || currentUrl.includes('/bangumi/play/'));

    // 执行对应的功能
    if (isChinaz || isRunoob || isJsonCn) {
        runAdRemoval();
    }

    if (isBilibiliVideo) {
        runBilibiliAutoSkip();
    }

    // 去广告功能
    function runAdRemoval() {
        console.log('执行去广告功能');

        // 菜鸟教程去广告
        if (isRunoob) {
            // 移除右侧教程列表
            $("div.right-column").remove();
            // 移除底部google广告
            $("#ad-336280").remove();
            // 移除建议分享按钮
            $(".feedback-btn").remove();
            // 移除底部footer
            $("#footer").remove();
            // 移除关注二维码
            $(".qrcode").remove();
            // 修改搜索样式为居中最大
            var middleColumn = document.querySelector('div.big-middle-column');
            if(middleColumn !== null){
                middleColumn.className='col big-middle-column';
            }
        }

        // 站长工具去广告
        if (isChinaz) {
            // 移除左侧广告条
            $('#toolLeftImg').remove();
            // 移除头部广告
            $('.fr').remove();
            // 移除头部下面的横批广告
            $('#navAfter').remove();
            // 移除底部广告
            $('.wrapperTopBtm').remove();
            $('.bg-gray02').remove();
            // 移除最底部广告
            $('#bottomImg').remove();
            // 移除VIP工具
            $('.toItem').remove();
            // 移除下拉广告
            $('.HeaderAdvert').remove();
        }

        // json在线解析去广告
        if (isJsonCn) {
            // 移除底部广告条
            $('.footer-gg-b-addr-img').remove();
            // 右侧服务器广告
            $('.tool ul').remove();
            // csdn
            // 右侧
            $('#recommendAdBox').remove();
            // 顶部
            $('.toolbar-advert').remove();
            // 点击全屏
            $('.fullScreen').click();
            // 双11广告
            $('#shuangshi1Modal1 .close').click();
        }
    }

    // B站自动跳过专属视频功能
    function runBilibiliAutoSkip() {
        console.log('执行B站自动跳过专属视频功能');

        // 状态标记，防止短时间内重复触发点击
        let isSkipping = false;

        const checkAndSkip = () => {
            if (isSkipping) return;

            // 1. 查找"去开通" (付费/会员提示)
            const playerContainer = document.querySelector('#bilibili-player') || document.body;
            const xpath = ".//*[contains(text(), '去开通')]";
            const result = document.evaluate(xpath, playerContainer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const targetNode = result.singleNodeValue;

            // 2. 如果检测到阻断提示
            if (targetNode && targetNode.offsetParent !== null) {
                console.log('前端检测：遇到专属视频，尝试切集...');
                triggerNextVideo();
            }
        };

        const triggerNextVideo = () => {
            // 查找 B站播放器控制栏的"下一集"按钮
            // 类名 .bpx-player-ctrl-next 是目前B站播放器通用的
            const nextBtn = document.querySelector('.bpx-player-ctrl-next');

            if (nextBtn) {
                isSkipping = true;

                // 模拟点击
                nextBtn.click();

                console.log('已触发"下一集"点击');

                // 3秒后重置状态，给页面加载留缓冲时间
                setTimeout(() => {
                    isSkipping = false;
                }, 3000);
            } else {
                console.log('未找到"下一集"按钮，可能已是最后一集或非合集视频');
            }
        };

        // 监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            checkAndSkip();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检查
        checkAndSkip();
    }
})();
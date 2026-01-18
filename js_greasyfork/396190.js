// ==UserScript==
// @name         手机网页版IT之家去除广告和干扰
// @namespace    https://greasyfork.org/zh-CN/users/442617-punkjet
// @version      2026.01.05
// @description  手机网页版IT之家去除广告，文章页去除分享、评分相关文章等，优化稳定性和清理效果。
// @author       PunkJet
// @run-at       document-end
// @match        *://m.ithome.com/*
// @grant        none
// @icon         https://img.ithome.com/img/soft/ithome.svg
// @downloadURL https://update.greasyfork.org/scripts/396190/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396190/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0.meta.js
// ==/UserScript==

(function() {
    'use strict'; // 全局启用严格模式

    // ******** 优化点1：增加jQuery存在性校验，避免报错阻断执行 ********
    if (typeof $ === 'undefined') {
      //  console.error('jQuery 加载失败，脚本核心功能无法执行');
      //  return;
    }

    // 移除初始可见的干扰元素
    function removeInitialElements() {
        $(".open-app-banner, .open-app, .brand-column-lapin, .main-site, .news-class").remove();
        $(".modal.has-title.loaded").remove(); // 修正多class选择器
        removeHongbao(); // 移除iframe广告
        removeIthomeAds(); // 移除核心广告
        removeIthomeArticleAds(); // 移除文章页广告
    }

    // 移除iframe红包广告
    function removeHongbao() {
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach(iframe => iframe.remove());
    }

    // 移除文章页专属干扰元素
    function removeIthomeArticleAds() {
        // 统一使用类选择器，提高健壮性（支持多class元素匹配）
        $(".down-app-box, .relevant-news, .hot-app, .ggp-promotion, .grade, #bd-share-box, .lapin").remove();
    }

    // 移除核心广告和关键词相关内容
    function removeIthomeAds() {
        // 批量处理tip类元素，简化代码
        $("span.tip-suggest, span.tip.tip-gray, span.tip.tip-green").each(function() {
            $(this).closest("div.placeholder").remove();
        });

        // 清理含指定关键词的标题内容
        const deleteStr = ["领券", "红包", "福包", "元", "大促", "开售", "预约", "限免", "精选", "限时", "节", "抢", "折", "补贴", "省钱", "618", "11","超级88"];
        $("p.plc-title").each(function() {
            const titleText = $(this).text().trim();
            // 使用for...of遍历数组元素，更规范安全
            for (const keyword of deleteStr) {
                if (titleText.includes(keyword)) { // 用includes替代match，更适合纯文本匹配
                    $(this).closest("div.placeholder").remove();
                    break; // 匹配到一个关键词即停止，提高效率
                }
            }
        });
    }

    // 滚动事件节流函数（减少触发频率，优化性能）
    function throttle(fn, delay = 200) {
        let timer = null;
        return function() {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(this, arguments);
                    timer = null;
                }, delay);
            }
        };
    }

    // ******** 优化点2：移除冗余的spans判断，规范清空span的方式 ********
    function handleNewNodes(nodes) {
        nodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('.post-img-list')) {
                    decodeAndDisplayImage(node);
                }
                // 递归处理子节点
                node.querySelectorAll('.post-img-list').forEach((childNode) => {
                    decodeAndDisplayImage(childNode);
                });
            }
        });
    }

    function decodeAndDisplayImage(node) {
        const spans = node.querySelectorAll('span.img-placeholder');
        // 移除冗余的if (spans)判断，NodeList无需额外判断
        spans.forEach((span) => {
            const dataS = span.getAttribute('data-s');
            if (dataS) {
                try { // 增加解码容错，避免异常阻断后续操作
                    const decodedUrl = atob(dataS);
                    const img = document.createElement('img');
                    img.src = decodedUrl;
                    img.style.width = "100%";
                    // 用textContent清空，更安全规范，替代innerHTML
                    span.textContent = '';
                    span.appendChild(img); // 添加img元素
                } catch (e) {
                    console.warn('图片解码失败：', e);
                }
            }
        });
    }

    // 初始化执行
    removeInitialElements();

    // 节流监听滚动事件，避免频繁执行DOM操作
    window.addEventListener("scroll", throttle(function() {
        removeIthomeAds();
        removeIthomeArticleAds();
    }, 200));

    // ******** 优化点3：补全MutationObserver回调，调用handleNewNodes处理新增节点 ********
    const observer = new MutationObserver((mutations) => {
        // 先执行广告移除逻辑
        removeIthomeAds();
        removeIthomeArticleAds();
        removeHongbao();

        // 提取所有新增节点，传入handleNewNodes处理动态图片
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                handleNewNodes(Array.from(mutation.addedNodes));
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化时处理已有的节点
    document.querySelectorAll('.post-img-list').forEach((node) => {
        decodeAndDisplayImage(node);
    });

})();
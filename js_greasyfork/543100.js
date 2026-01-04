// ==UserScript==
// @name         🤖 B站人机筛选
// @namespace    https://ez118.github.io/
// @version      0.1
// @description  对于B站评论区内各用户的粉丝数、关注量、LV等数据进行综合考量，初次判断是否是人机、低质量账号（电脑网页上用鼠标点评论区用户名即可）
// @author       ZZY_WISU
// @match        https://www.bilibili.com/video/*
// @match        https://bilibili.com/video/*
// @license      MIT
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/zepto@1.2.0/dist/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/543100/%F0%9F%A4%96%20B%E7%AB%99%E4%BA%BA%E6%9C%BA%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543100/%F0%9F%A4%96%20B%E7%AB%99%E4%BA%BA%E6%9C%BA%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var posList = []; // 记录坐标，防止重复

    GM_addStyle(`
        :root{--text-color:#386a1f;--border-color:#285a0f;--active-bg-color:#d7e1cd;--close-btn-bg:#386a1f;--close-btn-text:#FFF;}
        @media (prefers-color-scheme:dark){:root{--text-color:#7edb7b;--border-color:#7edb7b;--active-bg-color:#7edb7b;--close-btn-text:#00390a;}}

        .userscript-botDetectTooltip{position:absolute;z-index:9999;user-select:none;background:var(--active-bg-color);color:var(--close-btn-text);padding:1px 8px;font-size:12px;font-weight:normal;height:fit-content;border-radius:16px;border:1px solid var(--border-color);}
    `);

    // 监听 bili-comments 元素的插入
    const observer = new MutationObserver((mutationsList, observer) => {
        const biliComments = document.querySelector("bili-comments");
        if (biliComments && biliComments.shadowRoot) {
            // 初始化对 shadowRoot 的观察
            initShadowRootObserver(biliComments.shadowRoot);
            //observer.disconnect(); // 停止观察，避免重复
        }
    });

    // 观察 document.body 的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });

    function initShadowRootObserver(shadowRoot) {
        // 监听 shadowRoot 的子节点变化
        const rootObserver = new MutationObserver((mutationsList, observer) => {
            processElements(shadowRoot);
        });

        rootObserver.observe(shadowRoot, { childList: true, subtree: true });

        // 初始处理
        processElements(shadowRoot);
    }

    function processElements(shadowRoot) {
        const threadRenderers = shadowRoot.querySelectorAll("bili-comment-thread-renderer");
        const userInfoEles = [];

        threadRenderers.forEach(item => {
            const renderer = item.shadowRoot?.querySelector("bili-comment-renderer");
            if (renderer && renderer.shadowRoot) {
                const userInfo = renderer.shadowRoot.querySelector("bili-comment-user-info");
                if (userInfo && userInfo.shadowRoot) {
                    userInfoEles.push(userInfo.shadowRoot);
                }
            }
        });

        // 绑定事件，避免重复
        userInfoEles.forEach(item => {
            if (!item.querySelector("#info").hasAttribute('data-bound')) {
                $(item).on('mouseenter', () => {
                    const link = item.querySelector('a');
                    if (link) {
                        const mid = link.href.split("/")[3];
                        const rect = getDocumentCoordinates(link.parentNode);
                        doReview(mid, { x: rect.left, y: rect.top + 20 });
                    }
                });
                item.querySelector("#info").setAttribute('data-bound', 'true');
            }
        });
    }

    function getDocumentCoordinates(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            right: rect.right + window.pageXOffset,
            bottom: rect.bottom + window.pageYOffset
        };
    }

    function doReview(mid, pos) {
        if(posList.includes(pos.y)) { return; }
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.bilibili.com/x/web-interface/card?mid=${mid}`,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.data) {
                        const judgeRes = isBot(data);
                        const $div = $('<div>', {
                            class: 'userscript-botDetectTooltip',
                            text: judgeRes.result ? (judgeRes.reasons.join("·")) : "真",
                            css: {
                                left: pos.x + 'px',
                                top: pos.y + 'px'
                            }
                        });

                        $div.appendTo('body');

                        posList.push(pos.y);
                    }
                } catch (e) {
                    console.error("解析失败", e);
                }
            }
        });
    }

    function isBot(res) {
        const threshold = 35; // 阈值

        const data = res.data.card;
        let score = 0;
        let reasons = [];

        // 1. 等级 ≤ 2
        if (data.level_info?.current_level <= 3) {
            score += 15;
            reasons.push("等级 ≤ 3");
        }
        if (data.level_info?.current_level >= 6) {
            score -= 10;
        }

        // 2. 性别为“保密”
        if (data.sex === "保密") {
            score += 5;
            reasons.push("性别保密");
        }

        // 3. 签名为空或默认
        const sign = data.sign || "";
        if (sign.trim() === "" || sign === "这个人很懒，什么都没有留下") {
            score += 5;
            reasons.push("无签名");
        }

        // 4. 没有小勋章
        if (!data.nameplate || !data.nameplate.name || !data.nameplate.level) {
            score += 5;
            reasons.push("无勋章");
        }

        // 5. 未认证但粉丝数高
        if (data.Official?.type === -1 && data.fans > 1000) {
            score += 10;
            reasons.push("无认证高粉丝");
        }

        // 6. 无大会员且非硬核会员
        if (data.vip?.vipStatus === 0 && !data.is_senior_member) {
            score += 5;
            reasons.push("无会员");
        }

        // 7. 粉丝数高但等级低
        if (data.fans > 5000 && data.level_info?.current_level < 4) {
            score += 15;
            reasons.push("粉丝多等级低");
        }

        // 8. 关注数远高于粉丝数
        if (data.attention > data.fans * 3 && data.fans > 100) {
            score += 10;
            reasons.push("关注数远高于粉丝数");
        }

        // 9. 账号被封禁
        if (data.spacesta === -2) {
            score += 15;
            reasons.push("封禁账号");
        }

        // 10. 默认头像
        if (data.face === "https://i0.hdslb.com/bfs/face/member/noface.jpg") {
            score += 10;
            reasons.push("无头像");
        }

        // 11. 点赞数
         if (data.like_num <= 10) {
            score += 5;
            reasons.push("获赞少");
        }


        const isBot = score >= threshold;

        return {
            result: isBot,
            score,
            threshold,
            reasons
        };
    }
})();
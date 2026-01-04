// ==UserScript==
// @name         返利链接检查beta
// @version      1.1.0
// @description  豆瓣车组文章中对疑似推广返利链接进行识别的小工具，仅限在车组中使用。学习交流而已
// @author       Ezio Lin
// @match        https://www.douban.com/group/topic/*
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    fl-detection-beta
// @downloadURL https://update.greasyfork.org/scripts/415418/%E8%BF%94%E5%88%A9%E9%93%BE%E6%8E%A5%E6%A3%80%E6%9F%A5beta.user.js
// @updateURL https://update.greasyfork.org/scripts/415418/%E8%BF%94%E5%88%A9%E9%93%BE%E6%8E%A5%E6%A3%80%E6%9F%A5beta.meta.js
// ==/UserScript==

function notify(text) {
    GM_notification({
        title: '车车子提醒您',
        text,
        timeout: 4000
    });
}

function markAnchor(anchorNode) {
    anchorNode.style.color = 'red';
    anchorNode.style.cursor = 'not-allowed';
}

function readClipboard() {
    return navigator.clipboard && navigator.clipboard.readText ?
        navigator.clipboard.readText()
    : Promise.reject('does not support read clipboard');
}

const clipboardVal = 'clipboardData';

function setCopyValue(text) {
    GM_setValue(clipboardVal, text);
}

function getCopyValue() {
    return GM_getValue(clipboardVal, '');
}

function detectionTaoPassword() {
    const text = getCopyValue();
    if (/[\w\d]{11}/.test(text)) {
        fetch(`https://fl-detection.ninesuns-lin.workers.dev?text=${encodeURIComponent(text)}`, { mode: 'cors' })
            .then((res) => res.text())
            .then((ret) => { notify(ret === 'ok' ? '应该不是返利链接' : '淘口令疑似返利链接，请小心'); });
    } else {
        notify('oh 复制的文案中没有淘口令的样子');
    }
}

function onArticleCopy() {
    readClipboard().then(
        setCopyValue,
        (error) => { console.log('read clipboard error', error); }
    );
}

/**
 * 检查运行环境是否车组的文章
 * 本插件只适用于豆瓣车组，其他情况下
 */
const isTargetGroup = (groupUrl) => /\/group\/669481\//.test(groupUrl);

(async function() {
    'use strict';

    const topicContent = document.querySelector("div#topic-content.topic-content.clearfix>div.topic-doc");
    // 登录用户对于 是否是车组组员 会有 dom 上的区别
    // 因此放宽范围
    const targetGroup = document.querySelector('div#wrapper>div#content>div>div.aside div.info>div.title>a[href*="www.douban.com/group/"]');

    if (targetGroup && isTargetGroup(targetGroup.href) && topicContent) {
        console.log('识别插件运行中');

        topicContent.addEventListener('copy', onArticleCopy);

        navigator.permissions.query({
            name: 'clipboard-read'
        }).then((result) => {
            if (['granted', 'prompt'].includes(result.state)) {
                GM_registerMenuCommand('检测淘口令', detectionTaoPassword);
            }
            result.onChange = function() {
                if (this.state === 'granted') {
                    onArticleCopy();
                }
            }
        });

        // 京东短链接 个人目前不知道用什么逻辑去识别是否是推广链接
        // 所以只是将 a 标签中 href 和 text 不相等的这种略带欺骗的情况纳入提醒范围
        const jdPromotion = Array.from(
            topicContent.querySelectorAll('a[href*="u.jd.com/"]')
        )
        .filter((anchor) => anchor.text !== anchor.href);

        jdPromotion.forEach(markAnchor);

        // 淘宝短链接 请求 fl-detection 服务 查看是否是疑似推广链接
        const rets = await Promise.all(
            Array.from(
                topicContent.querySelectorAll('a[href*="m.tb.cn"]')
            )
            .map(anchor => [anchor, anchor.href])
            .map(([anchor, href]) => [anchor, encodeURIComponent(href)])
            .map(
                ([anchor, shortUrl]) =>
                fetch(`https://fl-detection.ninesuns-lin.workers.dev?url=${shortUrl}`, { mode: 'cors' })
                .then(async (res) => [anchor, await res.text()])
            )
        );

        const taobaoPromotion = rets.filter(([, ret]) => ret !== 'ok');
        taobaoPromotion.map(([anchor]) => anchor).forEach(markAnchor);

        notify(jdPromotion.length > 0 || taobaoPromotion.length > 0 ? '文章中存在疑似返利的链接，已经帮你标红了，请小心' : '没有发现可疑的链接哦');
    }
})();
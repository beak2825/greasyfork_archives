// ==UserScript==
// @name         爆杀网络阴阳人
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  屏蔽那些阴阳怪气的言论！还世界一个清净。
// @author       K@M0me
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @source      https://github.com/MakinoharaShoko/NoYYGQ
// @include     https://www.bilibili.com/*
// @include     https://www.zhihu.com/*
// @include     https://space.bilibili.com/*
// @include     https://tieba.baidu.com/*
// @include     https://www.weibo.com/*
// @include     https://weibo.com/*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431610/%E7%88%86%E6%9D%80%E7%BD%91%E7%BB%9C%E9%98%B4%E9%98%B3%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/431610/%E7%88%86%E6%9D%80%E7%BD%91%E7%BB%9C%E9%98%B4%E9%98%B3%E4%BA%BA.meta.js
// ==/UserScript==
'use strict';

const blackList = [
    '一开口就知道', '那你是真的', '孝子', '幕刃', '女拳', '蝻性', '男拳', '原批', 'op', '绷不住了', '欧泡', '蚌埠住了',
    '急了', 'lkd', '郭楠', '蝈蝻', '赢了', 'mxz', '猿神', '利刃','不会吧不会吧','啊对对对',
    '这是傻逼', '圣母', '米猴', '烂裤裆', '孤儿', 'mzr', '(你.*?品)', '不会有人真的', '真是有够', '那您可真', '那您是真的',
    '宁可真', '宁真', '你爹', '您爹', '你马', '您马', '肖战', '吴签', '割割', '😅', '[女母]狗', '[他她它]急了', '[男女]👊', '男狗', '寄吧谁',
    'jb谁', '几把谁', '鸡巴谁', '[他她]只是失去了', '[他她]们只是失去了', '差不多得了'
];

const siteList = ['.t_con', '.p_content', '.lzl_cnt', '.CommentRichText', '.RichContent-inner', '.text', '.text-con', '.WB_text W_f14', '.WB_text', ''];
(function () {
    function debounce(fn, wait) {
        const timeout = null;
        return function () {
            if (timeout !== null)
                clearTimeout(timeout);
            timeout = setTimeout(fn, wait);
        }
    }
    // 处理函数
    function handle() {
        for (let j = 0; j < siteList.length; j++) {
            document.querySelectorAll(siteList[j]).forEach(function (item) {
                const str = item.textContent;
                for (let i = 0; i < blackList.length; i++) {
                    const r = new RegExp(blackList[i]);
                    const res = r.test(str);
                    if (res) { // 找到就删除该信息流
                        console.log(blackList[i]+' FOUND');
                        item.style.borderRadius = '4px';
                        item.style.color = 'rgba(0,0,0,0)'
                        item.style.background = `rgba(0,92,175,0.3)`
                        // item.remove();
                    }
                }
            });
        };
    }
    // 滚动事件
    window.addEventListener('scroll', debounce(handle, 1000));

})();
// ==UserScript==
// @name         Text Zoom Only - 只放大文字大小
// @namespace    Text
// @version      1.1
// @author       tanoak
// @description  网页文字放大
// @license      MIT
// @include      *://wenku.baidu.com/*
// @include      *://www.wocali.com/tampermonkey/doc/download
// @include      *://api.ebuymed.cn/ext/*
// @include      *://www.ebuymed.cn/
// @include      *://pan.baidu.com/s/*
// @include      *://yun.baidu.com/s/*
// @include      *://pan.baidu.com/share/init*
// @include      *://yun.baidu.com/share/init*
// @include      *://www.zhihu.com/*
// @include      *://www.bilibili.com/read/*
// @include      *://b.faloo.com/*
// @include      *://bbs.coocaa.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://book.zhulang.com/*
// @include      *://book.zongheng.com/*
// @include      *://book.hjsm.tom.com/*
// @include      *://chokstick.com/*
// @include      *://chuangshi.qq.com/*
// @include      *://yunqi.qq.com/*
// @include      *://city.udn.com/*
// @include      *://cutelisa55.pixnet.net/*
// @include      *://huayu.baidu.com/*
// @include      *://tiyu.baidu.com/*
// @include      *://yd.baidu.com/*
// @include      *://yuedu.baidu.com/*
// @include      *://imac.hk/*
// @include      *://life.tw/*
// @include      *://luxmuscles.com/*
// @include      *://read.qidian.com/*
// @include      *://www.15yan.com/*
// @include      *://www.17k.com/*
// @include      *://www.18183.com/*
// @include      *://www.360doc.com/*
// @include      *://www.eyu.com/*
// @include      *://www.hongshu.com/*
// @include      *://www.coco01.com/*
// @include      *://news.missevan.com/*
// @include      *://www.hongxiu.com/*
// @include      *://www.imooc.com/*
// @include      *://www.readnovel.com/*
// @include      *://www.tadu.com/*
// @include      *://www.jjwxc.net/*
// @include      *://www.xxsy.net/*
// @include      *://www.z3z4.com/*
// @include      *://yuedu.163.com/*
// @downloadURL https://update.greasyfork.org/scripts/539955/Text%20Zoom%20Only%20-%20%E5%8F%AA%E6%94%BE%E5%A4%A7%E6%96%87%E5%AD%97%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539955/Text%20Zoom%20Only%20-%20%E5%8F%AA%E6%94%BE%E5%A4%A7%E6%96%87%E5%AD%97%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项：你可以在这里修改默认字体大小
    const MIN_FONT_SIZE_PX = 20; // 最小字体大小，可改为 16、20 等

    // 递归设置文字大小，避免影响图片、布局
    function adjustFontSize(el) {
        const excludedTags = ['SCRIPT', 'STYLE', 'IMG', 'CANVAS', 'SVG'];
        if (excludedTags.includes(el.tagName)) return;

        const computed = window.getComputedStyle(el);
        if (computed && computed.fontSize) {
            const currentSize = parseFloat(computed.fontSize);
            if (currentSize < MIN_FONT_SIZE_PX) {
                el.style.fontSize = MIN_FONT_SIZE_PX + 'px';
            }
        }

        // 遍历子元素
        for (let child of el.children) {
            adjustFontSize(child);
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        adjustFontSize(document.body);
        console.log('✅ Text zoom applied.');
    });
})();

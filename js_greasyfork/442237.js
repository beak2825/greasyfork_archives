// ==UserScript==
// @license MIT
// @name         飞书一键新建文档
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  效率提升一点点的
// @author       李坤雨
// @match        https://lqhg4mvjeq.feishu.cn/docx/doxcn5Kaa9UlykUSPZeq03kDLVd
// @match        https://lqhg4mvjeq.feishu.cn/docs/doccnjnICu091ZzmMayEXtdR5kR
// @match        https://lqhg4mvjeq.feishu.cn/sheets/shtcnRjLAfTykfJrDpsDjyrKhRf
// @match        https://lqhg4mvjeq.feishu.cn/base/bascn7TLtkPKGpojUtphD6bxdsz?table=tblPjd1VvkCmUHqG&view=vew6ZscDel
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442237/%E9%A3%9E%E4%B9%A6%E4%B8%80%E9%94%AE%E6%96%B0%E5%BB%BA%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/442237/%E9%A3%9E%E4%B9%A6%E4%B8%80%E9%94%AE%E6%96%B0%E5%BB%BA%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=() => {
        try {
            console.log("哈哈哈哈今天也要开心呀")
            document.querySelector(".template-mark-banner__content__right .ud__button").click()
            console.log("哈哈哈哈今天也要开心呀2")
            setTimeout(() => {
            console.log("哈哈哈哈正在关闭模版窗口，等待3秒了");
            window.close()
        }, 3000);
        }
        catch(err) {
            console.log("哈哈哈哈元素还没加载完成")
            setTimeout(() => {
                console.log("哈哈哈哈等了6秒啦～")
                document.querySelector(".template-mark-banner__content__right .ud__button").click()
                console.log("尝试执行点击事件")
            }, 6000);
            setTimeout(() => {
            console.log("哈哈哈哈正在关闭模版窗口，等待8秒了");
            window.close()
        }, 8000);

        }
    }
})();
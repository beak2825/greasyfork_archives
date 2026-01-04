// ==UserScript==
// @name         绕过openwrite公众号导流
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  去除openwrite“博客导流公众号”功能
// @author       GoodbyeNJN
// @license      GPLv3
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423789/%E7%BB%95%E8%BF%87openwrite%E5%85%AC%E4%BC%97%E5%8F%B7%E5%AF%BC%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/423789/%E7%BB%95%E8%BF%87openwrite%E5%85%AC%E4%BC%97%E5%8F%B7%E5%AF%BC%E6%B5%81.meta.js
// ==/UserScript==

/**
 * openwrite 脚本基本逻辑：
 * 函数名和属性名储存在一个数组中(搜索“阅读全文”可定位到)，取值时通过对应的索引取出对应的值。
 * 先构造一个对象(搜索“const .* = function”可定位到)，在下方不远处给它的 prototype 上添加 options 和 init。
 * 点击弹窗中的“提交”按钮时，触发回调(搜索“alert”可定位到)，解析后具体代码如下：

 * function () {
 *     const val = $("#btw-modal-input").val();
 *     if (val === "") {
 *         alert("请输入校验码！");
 *         $("#btw-modal-input").focus();
 *         return;
 *     }
 *     const { blogId } = btw.options
 *     const api = "https://my.openwrite.cn/code/check";
 *     const url = "" + api + "?blogId=" + blogId + "&code=" + val + "";
 *     $.get(url, function (res) {
 *         if (res.result === true) {
 *             localStorage.setItem("TOKEN_" + blogId + "", blogId);
 *             $("#btw-modal-wrap, #read-more-wrap").remove();
 *             $("#" + btw.options.id + "").height("");
 *         } else {
 *             alert("校验码有误！");
 *         }
 *     });
 * }

 */

"use strict";

const READ_MORE_ID = "read-more-wrap";

/**
 * 判断是否存在插件
 */
const hasBtwPlugin = () => {
    const hasBTWPlugin = typeof BTWPlugin === "function";
    const hasJquery = typeof $ === "function";

    return hasBTWPlugin && hasJquery;
};

/**
 * 判断是否存在“阅读全文”按钮
 */
const hasReadMoreBtn = () => {
    return !!document.getElementById(READ_MORE_ID);
};

/**
 * 获取插件初始化选项
 */
const getOptions = () => {
    return (
        BTWPlugin.prototype.options || {
            id: "container",
            blogId: "",
            name: "",
            qrcode: "",
            keyword: "",
        }
    );
};

/**
 * 监听“阅读全文”按钮的出现
 * 用于首次触发该脚本且无按钮时，监听后续的按钮出现事件
 */
const listenReadMoreBtnShow = fn => {
    const observer = new MutationObserver(mutations =>
        mutations.forEach(mutation =>
            mutation.addedNodes.forEach(node => {
                if (node.id === READ_MORE_ID) {
                    observer.disconnect();
                    fn();
                }
            }),
        ),
    );

    const { id } = getOptions();
    const parent = document.getElementById(id);
    parent && observer.observe(parent, { childList: true });
};

/**
 * 监听部分 history 改动事件
 * 用于 spa 页面路由变化时自动展示全文
 */
const listenHistoryChange = fn => {
    const wrap = type => {
        const fn = history[type];
        return function (...args) {
            const res = fn.apply(this, args);
            const e = new Event(type);
            e.arguments = args;
            window.dispatchEvent(e);
            return res;
        };
    };

    history.pushState = wrap("pushState");
    history.replaceState = wrap("replaceState");

    window.addEventListener("replaceState", fn);
    window.addEventListener("pushState", fn);
    window.addEventListener("hashchange", fn);
};

/**
 * 展示全文
 */
const showHiddenText = () => {
    const { id, blogId } = getOptions();
    console.log("id:", id);
    localStorage.setItem(`TOKEN_${blogId}`, blogId);
    $(`#${READ_MORE_ID}`).remove();
    $(`#${id}`).height("");
};

(function () {
    if (!hasBtwPlugin()) {
        return;
    }

    $().ready(() => {
        listenHistoryChange(showHiddenText);

        if (hasReadMoreBtn()) {
            showHiddenText();
        } else {
            listenReadMoreBtnShow(showHiddenText);
        }
    });
})();

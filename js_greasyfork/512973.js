// ==UserScript==
// @name        b站首页视频列数调整
// @namespace   http://tampermonkey.net/
// @license     MIT
// @version     0.1.1
// @author      byhgz
// @description 修改b站首页视频列表的列数吗，并移除大图
// @icon        https://static.hdslb.com/images/favicon.ico
// @noframes    
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @match       https://www.bilibili.com/
// @match       https://www.bilibili.com/?spm_id_from=333.337.0.0
// @require     https://greasyfork.org/scripts/462234-message/code/Message.js?version=1170653
// @downloadURL https://update.greasyfork.org/scripts/512973/b%E7%AB%99%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E5%88%97%E6%95%B0%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/512973/b%E7%AB%99%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E5%88%97%E6%95%B0%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
"use strict";

const Util = {
    //设置数据
    setData(key, content) {
        GM_setValue(key, content);
    },
    //读取数据
    getData(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    },
    //删除数据
    delData(key) {
        if (!this.isData(key)) {
            return false;
        }
        GM_deleteValue(key);
        return true;
    },
    isData(key) {//判断数据是否存在
        return this.getData(key) !== undefined;
    },
    addStyle(style){
        GM_addStyle(style);
    },
    /**
     *注册一个菜单并返回菜单id，可在插件中点击油猴时看到对应脚本的菜单
     * @param {string}text 显示文本
     * @param {function}func 事件
     * @param {string}shortcutKey 快捷键
     * @return menu 菜单id
     */
    addGMMenu(text, func, shortcutKey = null) {
        return GM_registerMenuCommand(text, func, shortcutKey);
    },
}


const Tip={
    success(text, config) {
        Qmsg.success(text, config);
    },
    successBottomRight(text) {
        this.success(text, {position: "bottomright"});
    },
}

// 这里是项目主文件，请在这里编写代码同样这也是最后执行的JS文件;
"use strict";//设置严格模式，可以避免一些潜在的错误，不需要可以删除该行

//作者b站账号：https://space.bilibili.com/473239155
const bili_url = "https://space.bilibili.com/473239155";

const defVideoListColumn = 6;

const i1 = setInterval(() => {
    const els = document.querySelectorAll(".feed-card");
    if (els.length === 0) return;
    clearInterval(i1);
    Util.addStyle(`@media (min-width: 1560px) and (max-width: 2059.9px) {
    .recommended-container_floor-aside .container > *:nth-of-type(n + 8) {
        margin-top: 0 !important;
    }
}`);
    const msg = "已移除首页推荐视频区域中的顶部空白";
    console.log(msg);
    Tip.successBottomRight(msg);
}, 500);

const videoListColumn = Util.getData("videoListColumn", defVideoListColumn);

const i2 = setInterval(() => {
    const el = document.querySelector(".recommended-container_floor-aside .container");
    if (el === null) return;
    clearInterval(i2);
    Util.addStyle(`@media (min-width: 1560px) and (max-width: 2059.9px) and (min-width: 1560px) and (max-width: 2059.9px) {
    .recommended-container_floor-aside .container {
        grid-column: span 5;
        grid-template-columns: repeat(${videoListColumn}, 1fr) !important;
    }
}
`);
}, 1000);

const i4 = setInterval(() => {
    const el = document.querySelector(".bili-feed4-layout");
    if (el === null) return;
    clearInterval(i4);
    Util.addStyle(`.bili-feed4-layout {
    padding-bottom: 100px;
}`);
    const msg = "已调整视频列表底部距离";
    console.log(msg);
    Tip.successBottomRight(msg);
}, 1000);


Util.addGMMenu("设置列数", () => {
    let input = prompt("请输入视频列表列数，范围2-13，默认为" + defVideoListColumn, defVideoListColumn.toString());
    if (input === null) return;
    input = input.trim();
    if (isNaN(input)) {
        return alert("请输入数字！");
    }
    input = Number.parseInt(input);
    if (input < 2 || input > 13) {
        return alert("请输入2-13之间的整数！");
    }
    Util.setData("videoListColumn", input);
    alert(`已将视频列表列数设置为${input}！\n刷新页面生效。\n如不生效，请反馈给作者。`);
});


Util.addGMMenu("查看设置的列数", () => {
    const videoListColumn = Util.getData("videoListColumn", defVideoListColumn);
    alert(`当前脚本视频列表列数为${videoListColumn}！\n如不生效，请刷新页面。再不行，请反馈给作者。`);
});

Util.addGMMenu("反馈作者", () => {
    window.open(bili_url, "_blank");
});

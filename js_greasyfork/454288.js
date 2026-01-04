// ==UserScript==
// @name         一键举报 GreasyFork 用户
// @namespace    dsy4567
// @version      0.7
// @description  一键举报用户搜索页内违规用户(根据用户名判断), 找违规用户
// @author       dsy4567
// @license      WTFPL
// @match        *://*.greasyfork.org/*/users?*
// @match        *://*.greasyfork.org/*/users
// @icon         https://greasyfork.org/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/454288/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5%20GreasyFork%20%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454288/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5%20GreasyFork%20%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const kwd = "加微 新百胜 上分 新锦江 押金 加q xbs0688 知乎 淘宝 带货 91y 娱乐 薇信 你懂 啪啪啪 老街 鑫百利 缅甸 游戏 服务 福利 晚上 国际 网投 微信 兼职 在线 免费 澳洲".split(" ");
    GM_registerMenuCommand("一键举报当前页违规用户", oncontextmenu = ()=>{
        if (confirm("继续举报将打开一大堆标签页, 是否继续?")) {
            document.querySelectorAll("#browse-user-list > li > a").forEach((ele)=>{
                open("https://greasyfork.org/zh-CN/reports/new?item_class=user&item_id=" + ele.href.split("/").at(-1).split("-")[0], "_blank");
            }
            );
        }

    }
    );
    GM_registerMenuCommand("找违规用户", ()=>{
        open("https://greasyfork.org/zh-CN/users?banned=0&q=" + kwd[Math.floor(Math.random() * kwd.length)], "_blank");
    });
}
)();


// ==UserScript==
// @name         河师大结课评价快速全选
// @namespace    net.myitian.js.HNU.PJ
// @version      0
// @description  河南师范大学教务管理系统结课评价快速全选“优秀”（配合Fiddler的AutoResponder修改pj.js来允许提交全部相同的选项使用效果更佳）
// @author       Myitian
// @license      MIT
// @match        https://jwc.htu.edu.cn/new/student/teapj
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521519/%E6%B2%B3%E5%B8%88%E5%A4%A7%E7%BB%93%E8%AF%BE%E8%AF%84%E4%BB%B7%E5%BF%AB%E9%80%9F%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521519/%E6%B2%B3%E5%B8%88%E5%A4%A7%E7%BB%93%E8%AF%BE%E8%AF%84%E4%BB%B7%E5%BF%AB%E9%80%9F%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

function selectAll() {
    document.querySelectorAll("div>input:nth-of-type(1)").forEach(x => x.click());
}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function main() {
    while (true) {
        const header = document.querySelector("div.panel-header");
        if (header != null && header.querySelector("button#myt-x-quick-sel-all") == null) {
            const tool = header.querySelector("div.panel-tool");
            const button = document.createElement("button");
            button.id = "myt-x-quick-sel-all"
            button.innerText = "快速全选";
            button.onclick = selectAll;
            header.insertBefore(button, tool);
        }
        const dialog = document.querySelector("div.ui-dialog");
        if (dialog != null) {
            const body = dialog.querySelector("div.ui-dialog-body");
            const button = dialog.querySelector("button.ui-button");
            if (body != null && button != null && body.innerText == "评价成功") {
                button.click();
            }
        }
        await sleep(100);
    }
}

main();
// ==UserScript==
// @name         fir.im自动生成MD信息（用时再打开）
// @namespace    https://djzhao.js.org
// @version      0.1
// @description  自动生成MD文本
// @author       djzhao
// @match        https://fir.im/*
// @create       2019-02-18
// @icon         https://avatars1.githubusercontent.com/u/10238070?s=460&v=4
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/384003/firim%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90MD%E4%BF%A1%E6%81%AF%EF%BC%88%E7%94%A8%E6%97%B6%E5%86%8D%E6%89%93%E5%BC%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/384003/firim%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90MD%E4%BF%A1%E6%81%AF%EF%BC%88%E7%94%A8%E6%97%B6%E5%86%8D%E6%89%93%E5%BC%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        var updateDate = $("div.release-info > p:nth-child(2) > span").text();
        var arr = updateDate.split(" ");
        var day = arr[0];
        var time = arr[1];

        var changlogcontent = $(".master-section.section > pre").text();
        changlogcontent = changlogcontent == "" ? "--" : changlogcontent.replace(/\n/g, "<br />");

        var version = $("div.release-info > p:nth-child(1) > span").text().replace("\n               ", "");

        var name = $("body > div.out-container > div > header > div > div > div > h1 > span").text().trim();

        var platform = $("body > div.out-container > div > header > span:nth-child(3)").text() == "ios" ? "(iOS) " : "(Android) ";
        var result = "#### " + day + "\n\n| 时间 | 反馈人 | 内容 | 附件 |\n| :--: | -- | -- | -- |\n| " + time +" |  | " + changlogcontent + " | " + name + platform + version + " |";
        prompt("请手动复制", result);
    }, 2000);
})();
// ==UserScript==
// @name         获取草榴小说列表
// @namespace    蒋晓楠
// @version      20240316
// @description  获取草榴文学区的小说列表
// @author       蒋晓楠
// @license      MIT
// @match        https://t66y.com/thread0806.php?fid=20&search=&page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490586/%E8%8E%B7%E5%8F%96%E8%8D%89%E6%A6%B4%E5%B0%8F%E8%AF%B4%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490586/%E8%8E%B7%E5%8F%96%E8%8D%89%E6%A6%B4%E5%B0%8F%E8%AF%B4%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
let Page = GM_getValue("Page", 50)
let NewData = ""
let Labels = document.querySelectorAll("#ajaxtable .tr3 h3 a");
for (let i = 0; i < Labels.length; i++) {
    let Label = Labels[i];
    NewData += Label.textContent + "|" + Label.href + "\r\n"
}
if (Page >= 1) {
    GM_setValue("Page", Page - 1)
    GM_setValue("List", GM_getValue("List", "") + NewData)
    location.href = "https://t66y.com/thread0806.php?fid=20&search=&page=" + Page
} else {
    let TextFile = document.createElement("a");
    TextFile.download = "小说列表.txt";
    TextFile.href = URL.createObjectURL(new Blob([GM_getValue("List", "")]));
    TextFile.click();
    alert("完成")
}
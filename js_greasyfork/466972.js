// ==UserScript==
// @name        智慧职教下载和上傳作业
// @namespace   Violentmonkey Scripts
// @match       https://course.icve.com.cn/learnspace/learn/learn/templateeight/index.action
// @grant       none
// @version     1.2
// @author      xxyx
// @description 可以下载和上傳作业
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466972/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E4%B8%8B%E8%BD%BD%E5%92%8C%E4%B8%8A%E5%82%B3%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/466972/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E4%B8%8B%E8%BD%BD%E5%92%8C%E4%B8%8A%E5%82%B3%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==
const wrap = document.createElement('div');
const downHtml = document.createElement('button');
const upHtml = document.createElement('button');
wrap.style.width = 200+"px";
wrap.style.height = 200+"px";
wrap.style.position = "absolute";
wrap.style.right = "10%";
wrap.style.top = "20px";
downHtml.innerText = "下載資料";
downHtml.style.position = 'absolute';
downHtml.style.right = "100px";
downHtml.style.top = "0";
downHtml.style.backgroundColor = "brown";
downHtml.style.borderRadius = "20px";
upHtml.innerText = "上傳作業";
upHtml.style.position = 'absolute';
upHtml.style.right = "0";
upHtml.style.top = "0px";
upHtml.style.backgroundColor = "brown";
upHtml.style.borderRadius = "20px";
downHtml.addEventListener("click", () => {
const iframe = document.getElementsByClassName("contentIframe");
const childDoc = iframe[0].contentDocument;
const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: iframe.contentWindow,
});
const down = childDoc.querySelectorAll("[data-w-e-type='attachment']");
if (down.length !== 0) {
    console.log(down);
    down[0].dispatchEvent(event);
    console.log("下载成功！");
}else{
  alert("請轉到下載作業的頁面，謝謝！")
}
})
upHtml.addEventListener("click", () => {
const iframe = document.getElementsByClassName("contentIframe");
const childDoc = iframe[0].contentDocument;
const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: iframe.contentWindow,
});
const up = childDoc.getElementsByClassName("affix_uploadBtn");
  console.log(up)
if (up.length !== 0) {
    console.log(up);
    up[0].dispatchEvent(event);
    console.log("上傳成功！");
}else{
  alert("請轉到提交作業的頁面，謝謝！")
}
})
document.body.appendChild(wrap);
wrap.appendChild(downHtml);
wrap.appendChild(upHtml);
// ==UserScript==
// @name         twitter已关注隐藏
// @description  twitter正在关注列表只显示未关注
// @version      1.4.1
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include       https://twitter.com/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403924/twitter%E5%B7%B2%E5%85%B3%E6%B3%A8%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403924/twitter%E5%B7%B2%E5%85%B3%E6%B3%A8%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
var ziji = GM_getValue("ziji","在这里输入自己的推特名");
GM_setValue("ziji", ziji);
function gl() {
     var i,a,aa,topics,z,x;
     z=[];
     if (location.href.split(".com/")[1].indexOf(ziji)>-1){return}
            $("section div > div > div > div.css-1dbjc4n > div > div[role=\"button\"]").each(function () {
        if ($(this).text()=="显示"){
            $(this).click();
        }
    })
     if (location.href.indexOf("/following")>-1){
          topics = document.querySelectorAll(`#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wtj0ep > div.css-1dbjc4n.r-19u6a5r > div > div[dir="auto"]`);         for (i = 0; i < topics.length; i++) {
               a = topics[i];
               if (a.innerText.indexOf("正在关注")>-1 || a.innerText.indexOf("已屏蔽")>-1 ){
                    console.log("删除 ：",a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerText);
                    if (a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("aria-label")=="时间线：正在关注"){
                         z.push(a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                         //a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML="";
                    }}
          }
          for (i=z.length-1;i>-1;i--){
               z[i].innerHTML="";
          }
          z=[];
     }
     aa=document.querySelectorAll(`#layers div[role="menu"] div.css-1dbjc4n>div[role="menuitem"],#layers div[role="menu"] div.css-1dbjc4n>a[role="menuitem"]`);
     for (i = 0; i < aa.length; i++) {
          a = aa[i].innerText;
          if (a.indexOf("嵌入推文")>-1 || a.indexOf("举报")>-1|| a.indexOf("隐藏 @")>-1|| a.indexOf("关注 @")>-1|| a.indexOf("复制链接到")>-1){
               z.push(aa[i]);
          }
     }
     for (i=z.length-1;i>-1;i--){
          z[i].remove();
     }
}
gl;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (records) {
          records.map(function (record) {
               if (record.addedNodes) {
                    gl();
               }
          });
});
var option = {
     childList: true,
     subtree: true,
};
observer.observe(document.body, option);

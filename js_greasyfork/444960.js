// ==UserScript==
// @name 百度网盘直链提取
// @namespace zyxubing & mogu
// @description 百度网盘直链提取配合IDM下载
// @version 1.0.2
// @include https://pan.baidu.com/disk/*
// @connect baidu.com
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/444960/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444960/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

console.log('脚本加载成功~');
console.log('仅供学习 严禁贩卖');
console.log('非会员点击分享获取下载链接 会员点击下载获取下载链接');
var uri = window.location.href;
if(uri.indexOf('homeFlow')!=-1){
alert('请使用旧版地址');
window.location.href='https://pan.baidu.com/disk/home?stayAtHome=true';
}
!function() {
  let x = Date.now(), y = localStorage.getItem("idmIntro");
  if (null == y || x > y) {
    localStorage.setItem("idmIntro", x + 3e7);
  }
  let task = setInterval(() => {
    let dom, t = document.querySelector("a.g-button[data-button-id][title=\u4e0b\u8f7d]");
    if (t) {
      clearInterval(task);
      dom = t.cloneNode(true);
      t.after(dom);
      dom.removeAttribute("style");
      t.remove();
      dom.addEventListener("click", () => {
        let dom = window.event.currentTarget, arr = require("system-core:context/context.js").instanceForSystem.list.getSelected();
        dom.setAttribute("style", "background-color: #09e; color: #fff");
        1 == arr.length && 0 == arr[0].isdir ? GM_xmlhttpRequest({
          "url": "https://d.pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&origin=dlna&ver=1.0&clienttype=8&type=nolimit&to=nd0&method=locatedownload&path=" + encodeURIComponent(arr[0].path),
          "method": "GET",
          "responseType": "json",
          "headers": {
            "User-Agent": "netdisk"
          },
          "onload": r => {
            dom.removeAttribute("style");
            r.response.hasOwnProperty("client_ip") && GM_setClipboard('https://nd0.baidupcs.com'+r.response.path, "text");
            alert("\u94fe\u63a5\u5df2\u590d\u5236\uff0c\u8bf7\u653e\u5165IDM\u4e0b\u8f7d\uff0c\u8bbe\u7f6eUser-Agent\u4e3anetdisk");
          }
        }) :
        alert("\u53ea\u80fd\u52fe\u9009\u4e00\u4e2a\u6587\u4ef6\u8fdb\u884c\u4e0b\u8f7d");
      });
    }
  }, 1e3);
}();
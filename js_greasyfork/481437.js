// ==UserScript==
// @name         复制番茄链接
// @namespace   Violentmonkey Scripts
// @match       *://www.52tt.net/*
// @version     1.0.3
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @grant       GM_registerMenuCommand
// @run-at      document-body
// @license MIT
// @author      zhizhu

// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/481437/%E5%A4%8D%E5%88%B6%E7%95%AA%E8%8C%84%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/481437/%E5%A4%8D%E5%88%B6%E7%95%AA%E8%8C%84%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
    "use strict";
  
    function customAction() {
      // 需要导出的文本内容
      let text = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      let authorList = [];
      let exists;
      let localUrlArray =  JSON.parse(localStorage.getItem("key"))
      let num = 0
  
    //   function delSameUrl(){
    //    let item = localUrlArray.shift()
    //    if(!item){
    //     // 创建一个Blob对象表示文本内容
    //   const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    //   // 创建一个下载链接
    //   const url = URL.createObjectURL(blob);
    //   // 创建一个隐藏的a标签并设置下载属性
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "my-document.txt";
    //   a.style.display = "none";
    //   // 将a标签添加到DOM中，并触发点击事件
    //   document.body.appendChild(a);
    //   a.click();
    //   // 从DOM中移除a标签并释放URL对象
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(url);
    //     return
    //    }
    //    let url = item.match(urlRegex);
  
    //    function request(){
    //     console.log(url)
    //     GM_xmlhttpRequest({
    //       method: "GET",
    //       url: `https://api.cooluc.com/?url=${url}`,
    //       onload: function(response) {
    //         console.log(JSON.parse(response.responseText));
    
    //         if (JSON.parse(response.responseText).success) {
    //           exists = authorList.some(function (el) {
    //             return (
    //               JSON.stringify(el) ===
    //               JSON.stringify({
    //                 name: JSON.parse(response.responseText).nickname,
    //               })
    //             );
    //           });
    //           if (!exists) {
    //             authorList.push({
    //               name: JSON.parse(response.responseText).nickname,
    //             });
    //             text += `${item}\r\n`;
    //           }
    //           delSameUrl()
    
    //         } else {
    //           num++
    //           if(num<10){
    //              request()
    //           }else{
    //           delSameUrl()
    //           }
    //         }
    
    //       }
    //     });
    //    }
  
    //    request()
      
  
    //   }
    //   delSameUrl()
  
      for (const item of JSON.parse(localStorage.getItem("key"))) {
        let url = item.match(urlRegex);

        if(item!==""){
          text += `${item}\r\n`;
        }


  
        // fetch(
        //   `https://eeapi.cn/api/video/32F2E78631CFE958A60BCD7BD9ECD91A537F12012A9F62E5E2/462/?url= ${url}`,
        //   {
        //     method: "get",
        //   }
        // )
        //   .then((response) => response.json())
        //   .then((res) => {
        //     // 状态码 200 表示请求成功
  
        //     if (res.data.code == 200) {
        //     } else {
        //       exists = authorList.some(function (el) {
        //         return (
        //           JSON.stringify(el) ===
        //           JSON.stringify({
        //             name: res.data.Name,
        //             avatar: res.data.avatar,
        //           })
        //         );
        //       });
        //       if (!exists) {
        //         authorList.push({
        //           name: res.data.Name,
        //           avatar: res.data.avatar,
        //         });
        //         text += `${item}\r\n`;
        //       }
        //     }
        //   })
        //   .catch(console.error);
      }
          // 创建一个Blob对象表示文本内容
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      // 创建一个下载链接
      const url = URL.createObjectURL(blob);
      // 创建一个隐藏的a标签并设置下载属性
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-document.txt";
      a.style.display = "none";
      // 将a标签添加到DOM中，并触发点击事件
      document.body.appendChild(a);
      a.click();
      // 从DOM中移除a标签并释放URL对象
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    }
  
    function clearAction() {
      localStorage.clear();
    }
    function stopAction() {
      clearInterval(interval);
    }
  
    GM_registerMenuCommand("导出文本", customAction);
    GM_registerMenuCommand("清除已保存的网址", clearAction);
    GM_registerMenuCommand("停止", stopAction);
  
    let urlList = [];
    if (localStorage.getItem("key", urlList)) {
      urlList = JSON.parse(localStorage.getItem("key"));
    }
  
    var interval = setInterval(() => {
      console.log(urlList);
      document.querySelector(".dy-list-card-footer .u-hairline-border.u-btn--default").click()
      

      if(document.querySelector("body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view > uni-view.u-drawer > uni-view.u-drawer-content.u-drawer-center.u-drawer-content-visible.u-animation-zoom > uni-view.u-mode-center-box > uni-scroll-view > div > div > div > uni-view > uni-view > uni-view:nth-child(3) > uni-view:nth-child(2) > uni-view.dy-popup-card-style > uni-view > uni-input > div > input").value==''){
        window.location.reload()
      }else{
        urlList.push(document.querySelector("body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view > uni-view.u-drawer > uni-view.u-drawer-content.u-drawer-center.u-drawer-content-visible.u-animation-zoom > uni-view.u-mode-center-box > uni-scroll-view > div > div > div > uni-view > uni-view > uni-view:nth-child(3) > uni-view:nth-child(2) > uni-view.dy-popup-card-style > uni-view > uni-input > div > input").value)
      localStorage.setItem("key", JSON.stringify(urlList));

      }



      
    }, 2000);
  
    // Your code here...
  })();
  
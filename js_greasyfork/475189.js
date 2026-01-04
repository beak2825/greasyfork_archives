// ==UserScript==
// @name         复制优加链接
// @namespace   Violentmonkey Scripts
// @match       *://dy.touvip.cn/*
// @version     1.1.1
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
// @author      zhizhu

// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/475189/%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8A%A0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/475189/%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8A%A0%E9%93%BE%E6%8E%A5.meta.js
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

    function delSameUrl(){
     let item = localUrlArray.shift()
     if(!item){
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
      return
     }
     let url = item.match(urlRegex);

     function request(){
      console.log(url)
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.cooluc.com/?url=${url}`,
        onload: function(response) {
          console.log(JSON.parse(response.responseText));
  
          if (JSON.parse(response.responseText).success) {
            exists = authorList.some(function (el) {
              return (
                JSON.stringify(el) ===
                JSON.stringify({
                  name: JSON.parse(response.responseText).nickname,
                })
              );
            });
            if (!exists) {
              authorList.push({
                name: JSON.parse(response.responseText).nickname,
              });
              text += `${item}\r\n`;
            }
            delSameUrl()
  
          } else {
            num++
            if(num<10){
               request()
            }else{
            delSameUrl()
            }
          }
  
        }
      });
     }

     request()
    

    }
    delSameUrl()

    // for (const item of JSON.parse(localStorage.getItem("key"))) {
    //   let url = item.match(urlRegex);

    //   fetch(
    //     `https://eeapi.cn/api/video/32F2E78631CFE958A60BCD7BD9ECD91A537F12012A9F62E5E2/462/?url= ${url}`,
    //     {
    //       method: "get",
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((res) => {
    //       // 状态码 200 表示请求成功

    //       if (res.data.code == 200) {
    //       } else {
    //         exists = authorList.some(function (el) {
    //           return (
    //             JSON.stringify(el) ===
    //             JSON.stringify({
    //               name: res.data.Name,
    //               avatar: res.data.avatar,
    //             })
    //           );
    //         });
    //         if (!exists) {
    //           authorList.push({
    //             name: res.data.Name,
    //             avatar: res.data.avatar,
    //           });
    //           text += `${item}\r\n`;
    //         }
    //       }
    //     })
    //     .catch(console.error);
    // }
    
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
    if (new RegExp("web/qr-code.htm").test(window.location.href)) {
      if (document.querySelector(".urlLink")) {
        // if(new RegExp("复制打开抖音").test(document.querySelector(".urlLink").innerHTML)){
        //     urlList.push(document.querySelector(".urlLink").innerHTML.split("千金不换。# 治愈系风景  ")[1])
        // }
        if (
          document.querySelector(".urlLink").innerHTML !==
          "\n\n                        "
        ) {
          urlList.push(document.querySelector(".urlLink").innerHTML);
        }

        localStorage.setItem("key", JSON.stringify(urlList));

        setTimeout(() => {
          document.querySelector(".change-btn.mb15").click();
        }, 3000);
      }
    }
    if (new RegExp("dy.touvip.cn/web/index.html").test(window.location.href)) {
      document.querySelector("#taskBtn2").click();
    }
  }, 5000);

  // Your code here...
})();

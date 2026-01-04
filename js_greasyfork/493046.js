// ==UserScript==
// @name         下载超星的ppt和其他资源
// @namespace    http://tampermonkey.net/
// @version      1
// @description  第一次写脚本
// @author       buffplum
// @license MIT
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493046/%E4%B8%8B%E8%BD%BD%E8%B6%85%E6%98%9F%E7%9A%84ppt%E5%92%8C%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493046/%E4%B8%8B%E8%BD%BD%E8%B6%85%E6%98%9F%E7%9A%84ppt%E5%92%8C%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function() {
 window.onload = function() {
      setTimeout(function() {
          let parentIframe = document.getElementById('iframe');
        if (parentIframe) {
           try {
                // 确保 iframe 内容已加载
               let objectids=[];
               let subIframes = parentIframe.contentWindow.document.querySelectorAll('iframe');
               subIframes.forEach(function(iframe, index) {
                  let data =iframe.getAttribute('data');
                  let obj= JSON.parse(data);
                   objectids.push(obj.objectid);
               });
               objectids.forEach((e,index)=>{
                    let now = new Date();
                   let url=`https://mooc1.chaoxing.com/ananas/status/${e}?flag=normal&_dc=${ now.getTime()}`
                   console.log(url)
                    setTimeout(() => {
                  fetch(url)
                      .then(response => {
                      // 确保请求成功
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.json(); // 解析JSON数据
                  })
                      .then(data => {
                     let downloadLink = document.createElement('a');
                   downloadLink.href = data.download;
                   downloadLink.setAttribute('download','');
                   document.body.appendChild(downloadLink);

                   // 模拟点击链接
                   downloadLink.click();

                   // 最后从文档中移除这个链接
                   document.body.removeChild(downloadLink);

                  })
                      .catch(error => {
                      console.error('Failed to fetch data:', error);
                  });
                    }, 1000 * index)

               })

            } catch (error) {
                console.error('Error accessing sub-iframes:', error);
            }
        } else {
            console.log('No iframe with ID "iframe" found.');
        }
        }, 3000); // Delay in milliseconds (3000ms = 3 seconds)
    };
})();
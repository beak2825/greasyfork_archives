// ==UserScript==
// @name         B站去广告
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  清楚B站首页广告
// @author       啦A多梦
// @license      MIT
// @match        https://www.bilibili.com/
// @icon         *://www.google.com/s2/favicons?sz=64&domain=dyxs31.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483287/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/483287/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        for(let i=0; i<document.getElementsByClassName("feed-card").length; i++){
            if((/creative-ad|palette-ad|info--ad/i).test(document.getElementsByClassName("feed-card")[i].innerHTML)){
                document.getElementsByClassName("feed-card")[i].remove()
            }
        }
        for(let i=0; i<document.getElementsByClassName("bili-video-card").length; i++){
            if((/creative-ad|palette-ad|info--ad/i).test(document.getElementsByClassName("bili-video-card")[i].innerHTML)){
                document.getElementsByClassName("bili-video-card")[i].remove()
            }
        }
    },1000
            )

    // hook Fetch
    const oldfetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(url, config){
      let response = await oldfetch(url, config);
      if(url.indexOf("/x/web-interface/wbi/index/top/feed/rcmd")!=-1){
        let json = () =>
        response.clone().json().then(function(data){
          for(let i=0; i<data.data.item.length; i++){
            if(data.data.item[i].goto == "ad"){
              data.data.item.splice(i, 1);
              console.log(data.data);
            }
          }
          return data;
        })
        response.json = json;
      }
      return response;
    }
})();
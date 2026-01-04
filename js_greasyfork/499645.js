// ==UserScript==
// @name         B站去广告
// @namespace    http://tampermonkey.net/
// @version      1
// @license      MIT
// @description  去除首页广告
// @author       You
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499645/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/499645/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
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

    window.onload = function(){
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
    }
})();
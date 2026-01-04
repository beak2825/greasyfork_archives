// ==UserScript==
// @name         西瓜视频自动高清
// @namespace    https://github.com/TheKonka
// @version      0.1.2
// @description  西瓜视频自动选择最高清的分辨率
// @author       konka
// @match        https://www.ixigua.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467785/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/467785/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let checkInt = setInterval(()=>{
            const resolutions = document.querySelectorAll('.control_definition .xgplayer-control-item__popover li')
          const highest = resolutions[0]
          if(!highest) return
            if(Array.from(highest.classList).includes('isActive') ){
                  clearInterval(checkInt);
            }else{
                highest.dispatchEvent(new Event('click',{bubbles:true}))
            }
    },100);
})();
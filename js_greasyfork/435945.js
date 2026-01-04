// ==UserScript==
// @name        招聘网视频静音并自动播放 - zhaopin.com
// @namespace   Violentmonkey Scripts
// @match       https://course.zhaopin.com/
// @license MIT
// @version     1.0
// @author      yuzhi535
// @description 11/23/2021, 8:22:31 PM
// @downloadURL https://update.greasyfork.org/scripts/435945/%E6%8B%9B%E8%81%98%E7%BD%91%E8%A7%86%E9%A2%91%E9%9D%99%E9%9F%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20-%20zhaopincom.user.js
// @updateURL https://update.greasyfork.org/scripts/435945/%E6%8B%9B%E8%81%98%E7%BD%91%E8%A7%86%E9%A2%91%E9%9D%99%E9%9F%B3%E5%B9%B6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20-%20zhaopincom.meta.js
// ==/UserScript==

setInterval(function f() { 
  // document.querySelector("#my_video > div").children[2].muted=true;  // 静音
  if (document.querySelector("#my_video > div").children[2].muted===false)
    document.querySelector("#my_video > div > div.vcp-controls-panel.hide > div.vcp-volume > span").click();
  // document.querySelector("#my_video > div > video").muted=true;  
  if (document.querySelector("#my_video").children[0].children[5].children[2].textContent.substring(8) === document.querySelector("#my_video").children[0].children[5].children[2].textContent.substring(0, 5)
) { 
    lists = document.querySelector("#root > div > div > section > div > div.videoPlayer > div > div.videoPlayer-chapterList > div > div.el-scrollbar__wrap > section > div > div").children; 
    var i=0; 
    for (i = 0; i < lists.length; ++i) { 
      if ( lists[i].getAttribute('class')==='courseCatalogueCon active') { 
        console.log('change!');
        lists[i+1].click(); break; 
      }
    }
  }
}, 1000);



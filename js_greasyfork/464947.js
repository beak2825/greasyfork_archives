// ==UserScript==
// @name        点击翻页
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @version     1.1.1
// @author      逍遥
// @description 手机浏览器点按翻页
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464947/%E7%82%B9%E5%87%BB%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/464947/%E7%82%B9%E5%87%BB%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 左侧距离 屏幕百分比
    let l_left = 5;
    let r_left = 85;
    //上方距离 屏幕百分比
    let top = 70;
    // 透明度
    let opacity = 0.5;

    //每次滚动的距离
    let h = window.innerHeight * 0.8;

    //箭头最小宽度 vw
    let min_width = 12;

    function createNode(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.children[0];
    }
    let arrow_p = GM_getValue("arrow_p");
    let position = { top: top, left: arrow_p === 'l' ? l_left : r_left };
    let html = `
  <div draggable="true"
      style="position:fixed !important;z-index:2147483647 !important;top:${position.top}vh !important; left:${position.left}vw !important; display: flex; flex-direction: column;align-items: center; opacity: ${opacity} !important;">
  
      <img id="up"
          src="data:image/gif;base64,R0lGODlhJAAkAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAkACQAAAKAlI9pAOoPDwihxQunqbgjfXAeBiLi+JTJiX5BxLbqE3szVF83bHX7lVP8MEHJq2XqCY/IpGPYikGRp2mTM6FotxQY98sIi8VMR2WM1pUVRd96pURC26S3s7mwh+Iy/YaPMgc4IoiXx2MoUGi4iNfY9CjnJ0Cnhsj4BZaIxjl4UAAAOw==" 
          style="min-width: ${min_width}vw;"
          />
  
      <span style="margin: 10px;">O</span>
  
      <img id="down"
       src="data:image/gif;base64,R0lGODlhJAAkAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAkACQAAAKAlI9pAOoPDwihxQunqbgjfXAeBiLi+JTJiX5BxLbqE3szVF83bHX7lVP8MEHJq2XqCY/IpGPYikGRp2mTM6FotxQY98sIi8VMR2WM1pUVRd96pURC26S3s7mwh+Iy/YaPMgc4IoiXx2MoUGi4iNfY9CjnJ0Cnhsj4BZaIxjl4UAAAOw=="
       style="min-width: ${min_width}vw;transform: rotate(180deg) !important;" />
  </div>
      `

    let div = createNode(html);

    div.children[0].onclick = function () { window.scrollBy(0, -h) };
    div.children[2].onclick = function () { window.scrollBy(0, h) };


    div.children[1].onclick = function () {
        if (arrow_p === 'l') {
            arrow_p = 'r';
            div.style.left = `${r_left}vw`;
        } else {
            arrow_p = 'l';
            div.style.left = `${l_left}vw`;
        }
        GM_setValue("arrow_p", arrow_p);
    };
    document.getElementsByTagName("html").item(0).appendChild(div);
})();
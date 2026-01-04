// ==UserScript==
// @name         自动检测荒废贴吧
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当访问 tieba.baidu.com 时自动检测所有已关注的贴吧是否荒废, 基于贴吧最新的一条回复时间.
// @author       You
// @match        *://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463956/%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E8%8D%92%E5%BA%9F%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/463956/%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E8%8D%92%E5%BA%9F%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==
class ProgressBar {
  constructor() {
    this.text = document.createElement("div");
    Object.assign(this.text.style, {
        position: "fixed",
        top: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "5px 10px",
        backgroundColor: "#4e6ef2",
        color: "white",
        borderRadius: "10px",
        zIndex: "9999"
    });
    document.body.appendChild(this.text);
  }

  start() {
    this.show(`loading`);
  }

  show(text = "") {
    this.text.textContent = text;
  }

  stop() {
    document.body.removeChild(this.text);
  }
}



(function() {
    'use strict';
    // 获取要触发hover和取消hover的元素
const moreForumElement = document.getElementById('moreforum');

// 模拟鼠标移动到元素上
const mouseOverEvent = new MouseEvent('mouseover', {
  bubbles: true,
  cancelable: true,
  view: window
});

moreForumElement.dispatchEvent(mouseOverEvent);


  const mouseOutEvent = new MouseEvent('mouseout', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  moreForumElement.dispatchEvent(mouseOutEvent);


const main = async ()=>{
    const progress = new ProgressBar();
    progress.start();
    const tiebalist = [...document.querySelectorAll('a[rel="noopener"] span.forum_level')].map(e => e.closest('a'))
    for (let i = 0; i < tiebalist.length; i++) {
        progress.show(`检测荒废贴吧: ${i+1}/${tiebalist.length}`)
        const item = tiebalist[i];
        const url = `https://tieba.baidu.com/mg/f/getFrsData?kw=${encodeURIComponent(item.title||item.innerText)}&sort_type=0`;
        try {
            const response = await fetch(url);
            const res = await response.json();
            const threadList = res.data.thread_list;
            const latestThread = threadList.sort((a, b) => b.last_time_int - a.last_time_int)[0];
            const now = Date.now();
            const diffDays = Math.floor((now - latestThread.last_time_int * 1000) / (24 * 3600 * 1000));
            if (diffDays > 365) {item.className ='';
                item.style.backgroundColor = 'black';
            } else if (diffDays > 180) {item.className ='';
                item.style.backgroundColor = 'gray';
            } else if (diffDays > 30) {item.className ='';
                item.style.backgroundColor = 'red';
            } else if (diffDays > 7) {item.className ='';
                item.style.backgroundColor = 'orange';
            }
        } catch (error) {
            console.log(error);
        }
    }
    progress.stop();
}
main()
})();
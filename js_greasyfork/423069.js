// ==UserScript==
// @name         整洁知乎
// @namespace    http://tampermonkey.net/
// @version      0.1_Beta
// @description  去除登录弹窗
// @author       Elimated 632489313@qq.com
// @match
// @include      *://*.zhihu.com/*
// @icon         https://pic2.zhimg.com/80/v2-f6b1f64a098b891b4ea1e3104b5b71f6_720w.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423069/%E6%95%B4%E6%B4%81%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/423069/%E6%95%B4%E6%B4%81%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==
/*====== 开始：辅助函数 ======*/

/**
 * 休眠
 * @param time    休眠时间，单位秒
 * @param desc
 * @returns {Promise<unknown>}
 */
function sleep(time, desc = 'sleep') {
  return new Promise(resolve => {
    //sleep
    setTimeout(() => {
      console.log(desc, time, 's')
      resolve(time)
    }, Math.floor(Math.abs(time) * 1000))
  })
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function skip_log() {
    //sleep(1)
    var btn=document.querySelector('button.Button.Modal-closeButton.Button--plain');
    if(btn.isConnected==true)
    {
        console.log("skip error");
        //return false
    }
    btn.click();
    console.log("skip OK");
    return true
}

skip_log()

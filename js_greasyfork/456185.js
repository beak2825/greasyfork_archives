// ==UserScript==
// @name         家庭教育培训自动下一节课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  家庭教育培训自动下一节课，自动切换下一节课，不做题，配合倍速播放
// @author       You
// @match        https://www.cfept.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/456185/%E5%AE%B6%E5%BA%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456185/%E5%AE%B6%E5%BA%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_log("开始测试播放");
    // Your code here...
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
      }, Math.floor(time * 1000))
    })
  };
function main(){

        setInterval(() => {
            const more_element = $(".courseContent")
           // console.log('btn',more_element.children().children()[2])
            const nextOrReplay=more_element.children().children()[2];
            console.log(nextOrReplay)
            if(nextOrReplay.style.display){
                GM_log("元素存在，点击加载更多。。。")
            }else{
            console.log("观看完毕，点击第一节课")
                const nextBtn = $(".nextBtn");
                nextBtn.click();
            }
        }, 1000);

}
    main();
})();
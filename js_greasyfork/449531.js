// ==UserScript==
// @name         Acfun修改个人点击链接，直接跳转视频tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Acfun跳转修改
// @author       You
// @match        *://www.acfun.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diwork.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449531/Acfun%E4%BF%AE%E6%94%B9%E4%B8%AA%E4%BA%BA%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E8%A7%86%E9%A2%91tab.user.js
// @updateURL https://update.greasyfork.org/scripts/449531/Acfun%E4%BF%AE%E6%94%B9%E4%B8%AA%E4%BA%BA%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E8%A7%86%E9%A2%91tab.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const newHref = 'https://www.acfun.cn/member/feeds?tab=video'
  let timeId;

  const typeChecker = (type) => (val) =>
    Object.prototype.toString.call(val).slice(8, -1) === type;

  const isObject = typeChecker("Object");

  function parseStyle(styleObj) {
    if (!isObject(styleObj)) {
      window.console.error("style对象解析错误");
    }
    const cssTextArr = Object.entries(styleObj).reduce((res, cur) => {
      let [styleProp, styleValue] = cur;
      let formatStyleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
      res.push(`${formatStyleProp}: ${styleValue}`);
      return res;
    }, []);
    return cssTextArr.join(";");
  }

  function logWithColor(
    message,
    style = {
      backgroundColor: "red",
      color: "yellow",
      borderRadius: "5px",
      padding: "3px 5px",
      fontSize: "40px",
    }
  ) {
    const cssText = parseStyle(style);
    window.console.log(`%c ${message}`, cssText);
  }
  
  function loopSetHref(){
    timeId = window.setInterval(() => {
      const targetMemberEle = document.querySelector('#header-guide .guide-user>a');
      if (targetMemberEle) {
        const href = targetMemberEle.getAttribute('href');
        if (href !== newHref) {
          targetMemberEle.setAttribute('href', newHref);
          window.clearInterval(timeId);
          timeId = null;
          logWithColor(`油猴脚本写入 href=${newHref}，定时器清除成功`)
        }
      }
    }, 300)
  }
  loopSetHref();
})();

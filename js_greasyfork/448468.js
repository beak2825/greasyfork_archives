// ==UserScript==
// @name         中国保密在线网--自动视频打卡
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  中国保密在线网-自动完成视频打卡插件,进入每一个视频页面，点击播放即可完成，2024年6月更新
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448468/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91--%E8%87%AA%E5%8A%A8%E8%A7%86%E9%A2%91%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/448468/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91--%E8%87%AA%E5%8A%A8%E8%A7%86%E9%A2%91%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==


(function() {
    'use strict';

class HttpRequest extends window.XMLHttpRequest {
  constructor() {
    super(...arguments);
    this._url = "";
    this._params = "";
  }
  open() {
    const arr = [...arguments];
    const url = arr[1];
    if (/studyTime\/saveCoursePackage.do/g.test(url)) {
      const [path, params] = url.split(/\?/);
      this._url = path;
      this._params = params;
      const replaceNum = url.match(/resourceLength=(\d*)&/)[1];
      if (this._params) {
        arr[1] = url.replace(/(?<=studyLength=)(\d*)/, replaceNum).replace(/(?<=studyTime=)(\d*)/, replaceNum);
      }
      Toast("任务完成");
    }

    return super.open(...arr);
  }
}

function Toast(msg, duration) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement("div");
  m.innerHTML = msg;
  m.style.cssText =
    "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
  document.body.appendChild(m);
  setTimeout(function () {
    var d = 0.5;
    m.style.webkitTransition =
      "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
    m.style.opacity = "0";
    setTimeout(function () {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
}

window.XMLHttpRequest = HttpRequest;
    // Your code here...
})();
// ==UserScript==
// @name         文心去水印
// @name:zh      文心去水印
// @name:zh-CN   文心去水印
// @name:en      文心去水印
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  文心一言，文心去水印(MutationObserver版本)，去图片水印，去刷新弹窗
// @description:en  文心一言，文心去水印(MutationObserver版本)，去图片水印，去刷新弹窗
// @author       You
// @match        https://yiyan.baidu.com/
// @icon         https://nlp-eb.cdn.bcebos.com/logo/favicon.ico
// @grant        none
// @run-at document-start
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/462157/%E6%96%87%E5%BF%83%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462157/%E6%96%87%E5%BF%83%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

MutationObserver.prototype.observe = function(target, options) {
    console.log("Hook MutationObserver observe")
    this.disconnect();
    remove_water_mask();
}

Element.prototype._attachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function () {
    return this._attachShadow( { mode: "open" } );
};


function remove_water_mask() {
  let x = document.getElementsByTagName("div");
  let flag = false;
  for (var i = 0; i < x.length; i++) {
    if(x[i].shadowRoot && x[i].id.length == 36){
      x[i].shadowRoot.childNodes.forEach((node) => (node.innerText = ""));
      flag = true;
    }
  }
  if (!flag) {
    setTimeout(remove_water_mask, 100);
  }
}

setInterval(() => {
  // 移除刷新
  let refresh_dialog = document.querySelector(".ant-modal-root");
  if (refresh_dialog) {
    refresh_dialog.remove();
  }
  // 移除图片水印
  let img_water_mask = document.getElementsByTagName('img');
  for (var i = 0; i < img_water_mask.length; i++) {
    let imgUrl = img_water_mask[i].getAttribute("src");
    if (imgUrl.indexOf("wm_ai") > -1) {
      img_water_mask[i].setAttribute("src", imgUrl.replace(/style\/wm_ai/, ""));
    }
  }
}, 500);

(function () {
  "use strict";
  remove_water_mask();
})();

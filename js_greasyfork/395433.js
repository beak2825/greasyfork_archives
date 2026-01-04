// ==UserScript==
// @name         钉钉web版文档预览页错误弹框自动关闭
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  钉钉web版的文档预览是个嵌入的iframe页，经常弹个错误弹框，关闭就可继续预览，所以本脚本就是检测到弹框，点弹框窗体就可以直接关闭
// @author       easyt
// @match        https://im.dingtalk.com/preview/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395433/%E9%92%89%E9%92%89web%E7%89%88%E6%96%87%E6%A1%A3%E9%A2%84%E8%A7%88%E9%A1%B5%E9%94%99%E8%AF%AF%E5%BC%B9%E6%A1%86%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/395433/%E9%92%89%E9%92%89web%E7%89%88%E6%96%87%E6%A1%A3%E9%A2%84%E8%A7%88%E9%A1%B5%E9%94%99%E8%AF%AF%E5%BC%B9%E6%A1%86%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==


document.getElementById("application").addEventListener('mouseover', function (e) {
              if (e.target.id=="WACDialogPanel") { // 错误弹框的id
    console.log("自动关闭错误弹框脚本mouseover",e.target.id);
          document.getElementById("WACDialogPanel").style.display = 'none'; //错误弹框隐藏
          document.getElementById("WACDialogOverlay").style.display = 'none'; // 错误弹框下遮罩隐藏
      }

});

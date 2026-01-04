// ==UserScript==
// @name        医真云-电子胶片导出 - yizhen.cn
// @namespace   医真云-电子胶片导出，使用方法：按住 Shift键 + 鼠标左键 点击胶片图片 即可下载，双击胶片图片可以放大缩小。
// @version      1.0.0
// @match       https://hnsy-idoctor.yizhen.cn:60001/*
// @grant       none
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/477145
// @license MIT
// @description 2023/10/11 11:36:32
// @downloadURL https://update.greasyfork.org/scripts/477145/%E5%8C%BB%E7%9C%9F%E4%BA%91-%E7%94%B5%E5%AD%90%E8%83%B6%E7%89%87%E5%AF%BC%E5%87%BA%20-%20yizhencn.user.js
// @updateURL https://update.greasyfork.org/scripts/477145/%E5%8C%BB%E7%9C%9F%E4%BA%91-%E7%94%B5%E5%AD%90%E8%83%B6%E7%89%87%E5%AF%BC%E5%87%BA%20-%20yizhencn.meta.js
// ==/UserScript==

(function(){
  console.log('医真云-电子胶片导出: OK');
  document.body.addEventListener('click', function(e){
    var el = e.target;
    if (el.tagName === 'CANVAS' && !el.classList.contains('magnifyTool') && e.shiftKey) {
      // console.log(e);
      var a = document.createElement('a');
      a.setAttribute('href', el.toDataURL());
      a.setAttribute('download', 'download-image');
      a.click();
    }
  })
})();
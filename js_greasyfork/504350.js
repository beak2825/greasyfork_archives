// ==UserScript==
// @name        云朵禅道增强工具
// @namespace   yunduoketang
// @match       http*://cd.yunduoketang.com.cn/index.php*
// @grant       none
// @version     1.0
// @author      yejian
// @license     MIT
// @description 2024/8/20 14:08:04
// @downloadURL https://update.greasyfork.org/scripts/504350/%E4%BA%91%E6%9C%B5%E7%A6%85%E9%81%93%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/504350/%E4%BA%91%E6%9C%B5%E7%A6%85%E9%81%93%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
$(function(){
  $(document).on('keydown', function(e) {
      if (e.ctrlKey && e.keyCode === 13) { // Ctrl+C
          console.log('ctrl + enter 保存');
          // 你可以在这里执行你想要的操作
        $("#submit").trigger("click");
      }
  });
});
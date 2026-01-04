
// ==UserScript==
// @name         🔥拓展增强🔥它人帖子管理按钮替换
// @namespace    https://www.dlsite.cn
// @version      0.31
// @description  把其他用户页面的管理操作替换成感谢，直接发送感谢分享
// @author       yh翼城、老六
// @match       *://yaohuo.me/bbs*
// @match       *://www.yaohuo.me/bbs*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502510/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%AE%83%E4%BA%BA%E5%B8%96%E5%AD%90%E7%AE%A1%E7%90%86%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/502510/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%AE%83%E4%BA%BA%E5%B8%96%E5%AD%90%E7%AE%A1%E7%90%86%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==


(function() {
  window.reply = function (txt) {
    //console.log(txt)
    //填写内容
    let domTextarea = document.querySelector("textarea");
    domTextarea.value = txt;
    //点击回复按钮
    let domInput = document.querySelectorAll("input");
    for (let iii = domInput.length - 1; iii > 0; iii--) {
      if (domInput[iii].value == "快速回复") {
        domInput[iii].click();
      }
      if (domInput[iii].value == "发表回复") {
        domInput[iii].click();
      }
    }
  }
    // 替换文本并设置点击事件
    function replaceTextAndSend() {
        const louzhuxinxiDiv = document.querySelector('.louzhuxinxi.subtitle');
        if (louzhuxinxiDiv) {
            const managementButtons = louzhuxinxiDiv.querySelectorAll('a[href*="Book_View_admin"]');
            managementButtons.forEach(button => {
                button.href = "javascript:;";
                button.textContent = "感谢"; // 修改按钮文本
                button.onclick = function(event) {
                    event.preventDefault(); // 阻止默认行为
                    // 构造发送感谢消息的请求
                    window.reply("感谢分享"+Date.now());
                };
            });
        }
    }

    // 初始化
    function init() {
        // 获取隐藏字段的值
        const touserid = document.querySelector('input[name="touserid"]') && document.querySelector('input[name="touserid"]').value;
        const myuserid = document.querySelector('input[name="myuserid"]') && document.querySelector('input[name="myuserid"]').value;

        // 只有当 touserid 和 myuserid 不同时才执行初始化
        if (touserid !== myuserid) {
            replaceTextAndSend();
        }
    }

    // 执行初始化
    init();
})();
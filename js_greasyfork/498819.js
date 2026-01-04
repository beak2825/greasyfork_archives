// ==UserScript==
// @name        auto wof
// @namespace   Violentmonkey Scripts
// @match       https://cf.hdkylin.com/wof.php
// @match       https://www.hdkyl.in/wof.php
// @grant       none
// @version     0.0.2
// @author      Exception
// @description 自动大转盘
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498819/auto%20wof.user.js
// @updateURL https://update.greasyfork.org/scripts/498819/auto%20wof.meta.js
// ==/UserScript==

(function () {

    var host = window.location.host;

    if (sessionStorage.getItem('confirm') != 'ok') {
        if (confirm("确定要执行操作吗？")) {
            sessionStorage.setItem('confirm', 'ok');
        } else {
            window.location.assign('https://' + host)
        }
    }

    var wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    if (window.location.href.indexOf('https://' + host + '/wof.php') == 0) {
        wait(5000).then(() => {
          var newWindow = window.open('https://' + host + '/wof/ajax_chs.php?app=lottery_json', '_blank'); // 替换为你想要打开的网址

          // 等待1秒后尝试关闭窗口
          if (newWindow) {
              setTimeout(function() {
                  try {
                      // 尝试关闭窗口
                      newWindow.close();
                  } catch (e) {
                      // 浏览器可能会阻止关闭，所以这里什么都不会发生
                      console.error('无法关闭窗口:', e);
                  }
                location.reload();
              }, 1000); // 1秒后尝试关闭
          }

        });
    }

    var timer1 = setInterval(function () {
        // 查找具有 class="layui-layer-btn0" 的元素
        var element = document.querySelector('.layui-layer-btn0');
        if (element) {
            // 如果找到了元素
            clearInterval(timer1);
            $(element).click();
        }
    }, 2000);
})();
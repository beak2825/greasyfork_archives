// ==UserScript==
// @name        auto lucky draw
// @namespace   Violentmonkey Scripts
// @match       https://zmpt.cc/plugin/lucky-draw
// @match       https://hdfans.org/plugin/lucky-draw
// @match       https://hhanclub.top/plugin/lucky-draw
// @match       https://ptvicomo.net/plugin/lucky-draw
// @match       https://www.agsvpt.com/plugin/lucky-draw
// @match       https://www.ptlsp.com/plugin/lucky-draw
// @grant       none
// @version     0.0.1
// @description 自动破产工具
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484024/auto%20lucky%20draw.user.js
// @updateURL https://update.greasyfork.org/scripts/484024/auto%20lucky%20draw.meta.js
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
 
    if (window.location.href.indexOf('https://' + host + '/plugin/lucky-draw') == 0) {
        wait(5000).then(() => {
            $('#pointer').click();
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
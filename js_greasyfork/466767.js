// ==UserScript==
// @name         fsm 首页推荐隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  非私人场合还是不太方便的, 避免错误打开, 默认隐藏, 添加了按钮控制
// @author       IITII
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://fsm.name
// @match        https://fsm.name/
// @match        https://fsm.name/Index
// @icon         https://avatars.githubusercontent.com/u/33705067?v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466767/fsm%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466767/fsm%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==


(async function () {
    'use strict';
    let show = false, button, flow = jQuery('.panel-body .container-fluid')
    function hide_show() {
        console.log(`show -> ${show}`);
        if (show) {
            flow.show()
        } else {
            flow.hide()
        }
    }
    button = $('<button>显示猜你喜欢</button>').addClass("btn btn-outline-info btn-sm")
        .css({ 'margin-right': '5px' })
    button.on("click", function () {
        show = !show
        hide_show()
    });

    $("#clipboardBtn").before(button)

    hide_show()
    
})();
// ==UserScript==
// @name         天翼账号密码登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跳转天翼账号账密登录
// @author       wuq1
// @license      MIT
// @match        https://open.e.189.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end

// @downloadURL https://update.greasyfork.org/scripts/466014/%E5%A4%A9%E7%BF%BC%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466014/%E5%A4%A9%E7%BF%BC%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        $('#tab-sms').click();
        $("#j-jump-psw").css('display','block').click()
        $('#J_change_type').click();
        $("#j-accLogin-link").css("display",'block')[0].click()
        //e_189();
    },300)
    function e_189() {
        $('#J_change_type').click();
        $('#j-accLogin-link').css("display",'block')[0].click()
        const targetNode = $('#tab-sms')[0]
        observe(targetNode, (mutations, observer) => {
            for (let mutation of mutations) {
                if (mutation.type === 'attributes') {
                    if (!$(targetNode).hasClass('current')) {
                        targetNode.click()
                        $("#j-jump-psw").css('display','block').click()
                        // 停止观察
                        observer.disconnect()
                    }
                }
            }
        })
    }
    function observe(targetNode, callback, extendConf) {
        if (targetNode) {
            console.log("targetNode", targetNode)
            targetNode.classList.add('temp')
            setTimeout(() => targetNode.classList.remove('temp'), 0)
        }

        // 观察器的配置（需要观察什么变动）
        const defaultConf = { childList: true, attributeFilter: ["class", "style"] }

        const conf = $.extend({}, defaultConf, extendConf)
        // if (extendConf)
            console.log('observer conf', conf)
        if (callback) {
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback)
            // 以上述配置开始观察目标节点
            if (targetNode) observer.observe(targetNode, conf)
        }
    }
    // Your code here...
})();
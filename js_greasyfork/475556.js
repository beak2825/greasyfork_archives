// ==UserScript==
// @name         地理信息安全在线培训挂课
// @namespace    https://greasyfork.org/
// @version      1.00
// @description  单页面挂时长,可后台
// @author       QL
// @match        https://gistraining.webmap.cn/index.php*
// @license      MIT
// @run-at       document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/475556/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E6%8C%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475556/%E5%9C%B0%E7%90%86%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E6%8C%82%E8%AF%BE.meta.js
// ==/UserScript==
(function (win) {

    var originalSubmitAjax = undefined;
    function Hook_submitAjax(data) {
        if(!!data && !!data.url && data.url == 'index.php?course-app-course-ajax-updatestudytime&studytime=50'){
            //自行调整倍率
            console.log('Hook studytime');
            data.url = 'index.php?course-app-course-ajax-updatestudytime&studytime=50'
        }
        return originalSubmitAjax(data);
    };

    function init() {
        console.log("脚本开始");
        //hook网络访问函数
        var clearTimeer = setInterval(() => {
            if(!!win.submitAjax){
                console.log("Hook submitAjax");
                originalSubmitAjax = win.submitAjax;
                win.submitAjax = Hook_submitAjax;
                clearInterval(clearTimeer);
            }
        },3000);

        //屏蔽超时提醒
        setInterval(() => {
            var body = document.querySelector('html');
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            body.dispatchEvent(event);
        },5000);

        // setInterval(() => {
        //     console.log("studytime=>",win.studytime,"xxjs=>",win.jstime,"submitAjax=>",win.submitAjax);
        // },2000);
    }

    init();
})(unsafeWindow);


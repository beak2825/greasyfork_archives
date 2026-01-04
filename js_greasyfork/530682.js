// ==UserScript==
// @name         cloud
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       hua
// @match        https://h5.cp.139.com/*
// @connect      gcore.jsdelivr.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://gcore.jsdelivr.net/gh/wuhua111/monkeyApi@a0d0574d18e2784db3529bcd810f52caccb45424/quicklymodel.module.1.0.6.js
// @run-at       document-start
// @description none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530682/cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/530682/cloud.meta.js
// ==/UserScript==


const api = new QuicklyModelCore({
    dev: true,
    disableDefault: true,
    enable: ["AntiDebugger"],
});
const logger = new api.utils.Logger({ moduleName: 'cloud' });
const $ = api.dom.query.$;
const $$ = api.dom.query.$$;
const href = unsafeWindow.location.href;

(function () {
    main();

    function main() {
        if (href.includes('/phone/#/index/user')) {
            api.dom.waitElement(unsafeWindow.document.documentElement, ()=>{
                return $(".container")
            }).then(() => {
                setTimeout(() => {
                    logger.info('点击首页');
                    $$(".container .tabbar-item")[1].click();  // 首页
                    setTimeout(() => {
                        logger.info('点击进入');
                        $('.m-bottom .text').click() // 进入
                    }, 2000);
                }, 5000);
            })
        }
    }
    function start() {
        logger.info('开始');
        $(".operate-wrap button").click() // 登录
    }

    if (href.includes('/phone/#/login')) {
        GM_registerMenuCommand('开始', () => {
            start();
        });
    }

})();
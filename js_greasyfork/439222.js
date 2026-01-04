// ==UserScript==
// @name         QQ书友群自动同意入群
// @namespace    https://userscript.snomiao.com/
// @version      0.5
// @description  rt
// @author       snomiao@gmail.com
// @match        https://web.qun.qq.com/cgi-bin/sys_msg/getmsg?ver=7800&filter=0&ep=1
// @match        https://web.qun.qq.com/cgi-bin/sys_msg/getmsg?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439222/QQ%E4%B9%A6%E5%8F%8B%E7%BE%A4%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%85%A5%E7%BE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/439222/QQ%E4%B9%A6%E5%8F%8B%E7%BE%A4%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%85%A5%E7%BE%A4.meta.js
// ==/UserScript==
//
// 使用方法：
// https://web.qun.qq.com/cgi-bin/sys_msg/getmsg?ver=7800&filter=0&ep=1#[/书友/,/(1[6789]........)/]
//
(function () {
    'use strict';

    var main = () => {
        document.title = new Date().toISOString();
        [...document.querySelectorAll('dd.undeal')]
            .map((e) => {
                var info = e.innerText;
                var 答案 = ((e) => e && e[1])(
                    info.match(/问题：.*?\n答案：(.*?)\n同意\n忽略/)
                );
                // 答案.match(答案模式)
                var 邀请人 = ((e) => e && e[1])(
                    info.match(
                        /申请加入群\n书友.*?\n来自群成员\n(.*?)\n的邀请\n同意\n忽略/
                    )
                );
                return { e, 答案, 邀请人, 通过: !!答案 || !!邀请人 };
            })
            .filter(({ 通过 }) => 通过)
            .map(({ e }) => {
                try {
                    e.querySelector('.agree_btn').click();
                } catch {}
            });
    };
    var refresh = () => {
        window.location = window.location;
    };
    setInterval(refresh, 5000);
    setInterval(main, 1000);

    main();
})();

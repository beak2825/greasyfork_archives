// ==UserScript==
// @name         超星提前解锁章节
// @name:zh      超星提前解锁章节
// @namespace    https://userscript.snomiao.com
// @version      0.9.0
// @description  【解锁章节功能已失效 --- 划掉，2021-04-10 有小朋友反馈还能用，各位看情况安吧】在视频播放页面（非课程首页），右边侧边栏可以提前解锁章节。在首页右上角可以查看章节统计。我是热爱学习的好孩子
// @author       snomiao@gmail.com
// @match        https://*.chaoxing.com/*
// @supportURL   https://github.com/snomiao/userscript.js/blob/master/%E8%B6%85%E6%98%9F%E6%8F%90%E5%89%8D%E8%A7%A3%E9%94%81%E7%AB%A0%E8%8A%82.userscript.js
// @downloadURL https://update.greasyfork.org/scripts/397180/%E8%B6%85%E6%98%9F%E6%8F%90%E5%89%8D%E8%A7%A3%E9%94%81%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/397180/%E8%B6%85%E6%98%9F%E6%8F%90%E5%89%8D%E8%A7%A3%E9%94%81%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==
//
// 据说还能用的评论：
// [超星提前解锁章节 - 反馈]( https://greasyfork.org/zh-CN/scripts/397180-%E8%B6%85%E6%98%9F%E6%8F%90%E5%89%8D%E8%A7%A3%E9%94%81%E7%AB%A0%E8%8A%82/discussions/78545 )
//
// 作者已近毕业不再使用超星课堂，想维护的同学 fork 或者 pr 或者 邮箱提交代码 到 snomiao@gmail.com 都可以。
//
(() => {
    var 解锁 = async () => {
        var query = new URLSearchParams(window.location.search);
        var courseId = query.get('courseId');
        var clazzid = query.get('clazzid');
        [...document.querySelectorAll('h4>a, h5>a')].map((a) => {
            var h4 = a.parentElement;
            var chapterId = h4.id.match(/(?<=cur)\d+/)[0];
            /* 表示已解锁 */
            var rp = h4.querySelector('.roundpointStudent.lock');
            rp && (rp.innerHTML = '/');

            /* 激活链接 */
            a.href =
                `javascript: getTeacherAjax('` +
                courseId +
                `','` +
                clazzid +
                `','` +
                chapterId +
                `');`;
        });
    };
    var 新元素 = (innerHTML, attributes = {}) => {
        var e = document.createElement('div');
        e.innerHTML = innerHTML;
        return Object.assign(e.children[0], attributes);
    };
    var 增加统计功能 = async () => {
        if (
            [...document.querySelectorAll('.navshow ul li')].filter(
                (e) => e.innerText.trim() == '统计'
            ).length
        )
            return;
        //
        var 取统计地址 = () => {
            var h = document.head.innerHTML + document.body.innerHTML;
            var userId =
                localStorage.userId ||
                (localStorage.userId = h.match(/(?<=userId: ')\d+/)[0]);
            return (
                '/moocAnalysis/chapterStatisticByUser?courseId=' +
                h.match(/(?<=courseId=)\d+/)[0] +
                '&classId=' +
                h.match(/(?<=classId=)\d+/)[0] +
                '&userId=' +
                userId +
                '&ut=s&vc=1&cpi=' +
                h.match(/(?<=cpi=)\d+/)[0] +
                '&enc=' +
                h.match(/(?<=enc=)\w+/)[0]
            );
        };

        var e = document.querySelector('.navshow ul');
        e &&
            e.appendChild(
                新元素(
                    '<li><a target="_blank" href="' +
                        取统计地址() +
                        '">统计</a></li>'
                )
            );
    };
    var main = () => {
        解锁().catch(console.error);
        增加统计功能().catch(console.error);
    };
    main();
    window.addEventListener('load', main);
    // document.addEventListener("load", main);
    // setInterval(main, 10000)
})();

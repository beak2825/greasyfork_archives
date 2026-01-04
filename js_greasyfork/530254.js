// ==UserScript==
// @name         SCBOY 综合雷达插件1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  检测F91/nono/sed/tutu/乌龟/八甲神牛等用户的回复
// @author       You
// @match        *://*.scboy.cc/?forum-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scboy.cc
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/530254/SCBOY%20%E7%BB%BC%E5%90%88%E9%9B%B7%E8%BE%BE%E6%8F%92%E4%BB%B611.user.js
// @updateURL https://update.greasyfork.org/scripts/530254/SCBOY%20%E7%BB%BC%E5%90%88%E9%9B%B7%E8%BE%BE%E6%8F%92%E4%BB%B611.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置需要监测的用户列表
    const users = [
        { id: 29, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/157.png', name: 'F91' },
        { id: 9, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/86.png', name: 'nono' },
        { id: 10, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/149.png', name: 'sed' },
        { id: 56789, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/135.png', name: 'tutu' },
        { id: 14, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/13.png', name: '八甲神牛' },//好像没有八甲神牛的表情，暂时用头上也有角的法人代替
        { id: 89053, icon: 'https://www.scboy.cc/plugin/scboy_moj/face/sb/156.png', name: '乌龟' }
    ];

    // 获取用户回复数据
    const fetchUserData = user =>
        $.ajax({
            url: `https://www.scboy.cc/?user-${user.id}.htm`,
            timeout: 5000
        }).then(res => ({
            user,
            data: $(res).find('.media-body .text-dark[title="主题回复"]')
        })).catch(console.error);

    // 主处理函数
    Promise.all(users.map(fetchUserData)).then(results => {
        const urlMap = new Map();

        // 构建URL映射
        results.forEach(({user, data}) => {
            data.each((i, el) => {
                const url = el.href.replace(/^https:\/\/www\.scboy\.cc\//, '').split('#')[0];
                urlMap.has(url) ? urlMap.get(url).push(user) : urlMap.set(url, [user]);
            });
        });

        // 在标题后添加图标
        $('.list-unstyled li.media .xs-thread-a').each((i, link) => {
            const url = link.href.replace(/^https:\/\/www\.scboy\.cc\//, '').split('#')[0];
            const matchedUsers = urlMap.get(url);

            if (matchedUsers?.length) {
                const container = $('<div>').css({
                    display: 'inline-flex',
                    gap: '2px',
                    marginLeft: '5px'
                });

                matchedUsers.forEach(user => {
                    $('<img>')
                        .attr({ src: user.icon, title: `${user.name}已回复` })
                        .css({ width: 25, height: 25, cursor: 'help' })
                        .appendTo(container);
                });

                $(link).after(container);
            }
        });
    });
})();
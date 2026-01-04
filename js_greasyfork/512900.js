// ==UserScript==
// @name         LOL 领取每日精粹宝箱
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  LOL 领取每日精粹宝箱,登录LOL官网, 快捷登录, 后会自动领取宝箱, 1.2秒领取一次, 过快会触发限流
// @author       zhengchalei
// @match        https://lol.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512900/LOL%20%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E7%B2%BE%E7%B2%B9%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/512900/LOL%20%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E7%B2%BE%E7%B2%B9%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const LOLServerSelect = [
        {t: "艾欧尼亚   电信", v: "1"}, {t: "比尔吉沃特 网通", v: "2"},
        {t: "祖安      电信", v: "3"}, {t: "诺克萨斯   电信", v: "4"},
        {t: "班德尔城  电信", v: "5"}, {t: "德玛西亚   网通", v: "6"},
        {t: "皮尔特沃夫 电信", v: "7"}, {t: "战争学院   电信", v: "8"},
        {t: "弗雷尔卓德 网通", v: "9"}, {t: "巨神峰    电信", v: "10"},
        {t: "雷瑟守备   电信", v: "11"}, {t: "无畏先锋   网通", v: "12"},
        {t: "裁决之地   电信", v: "13"}, {t: "黑色玫瑰   电信", v: "14"},
        {t: "暗影岛     电信", v: "15"}, {t: "恕瑞玛     网通", v: "16"},
        {t: "钢铁烈阳   电信", v: "17"}, {t: "水晶之痕   电信", v: "18"},
        {t: "均衡教派   网通", v: "19"}, {t: "扭曲丛林   网通", v: "20"},
        {t: "教育网专区", v: "21"}, {t: "影流      电信", v: "22"},
        {t: "守望之海   电信", v: "23"}, {t: "征服之海   电信", v: "24"},
        {t: "卡拉曼达   电信", v: "25"}, {t: "巨龙之巢   网通", v: "26"},
        {t: "皮城警备   电信", v: "27"}, {t: "男爵领域   全网络", v: "30"}
    ];

    const fetchReceive = async (server) => {
        const url = `https://apps.game.qq.com/daoju/igw/main?_service=buy.plug.svr.sysc_ext&paytype=8&iActionId=22565&propid=338943&buyNum=1&_app_id=1006&_plug_id=72007&_biz_code=lol&areaid=${server.v}`;

        try {
            const response = await fetch(url, {credentials: 'include'});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log(`[${server.t}] 请求成功.`);
            console.log(`[${server.t}] 消息: ${data.act_amount ? JSON.parse(data.msg)[0].sMsg : data.msg}`);
        } catch (error) {
            console.error(`[${server.t}] 请求失败: ${error}`);
        }
    };

    for (const server of LOLServerSelect) {
        await fetchReceive(server);
        await new Promise(resolve => setTimeout(resolve, 1200)); // Wait for 1.2 seconds
    }
})();

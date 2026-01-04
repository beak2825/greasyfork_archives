
// ==UserScript==
// @name         糊狸-B站成分查询Helper
// @namespace    www.bilibili.com
// @version      1.0.0
// @description  用于标注B站评论区用户成分属性,三相与Vtuber的数据来源于原插件"新三相之力指示器F",与本人无关;其余为自己添加,优化了原插件堆了七八百行的屎山,动态化处理后仅200余行;仅供娱乐不代表本人任何立场
// @author       biyuehu
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/541044/%E7%B3%8A%E7%8B%B8-B%E7%AB%99%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/541044/%E7%B3%8A%E7%8B%B8-B%E7%AB%99%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2Helper.meta.js
// ==/UserScript==

/*** 
 * @Author: Biyuehu
 * @Blog: http://imlolicon.tk
 * @Date: 2023-02-15 17:46:12
 */

(function () {
    'use strict';

    /* 配置区 */
    const config = {
        times: 2500, // 标签处理间隔时间 单位:ms
        testLog: true // 是否开启调试日志
    }
    // 显示标签配置在👇面

    const threeList = [
        ["【 传奇 | 三相之力】", "原神&明日方舟&王者荣耀", "#FFD700"],
        ["【 史诗 | 二刺螈双象限】", "原神&明日方舟&!王者荣耀", "#FF0000"],
        ["【 史诗 | 双批齐聚】", "原神&!明日方舟&王者荣耀", "#FF0000"],
        ["【 史诗 | 稀有的存在】", "!原神&明日方舟&王者荣耀", "#FF0000"],
        ["【 稀有 | 原批】", "原神&!明日方舟&!王者荣耀", "#6600CC"],
        ["【 稀有 | 粥畜】", "!原神&明日方舟&王者荣耀", "#6600CC"],
        ["【 稀有 | 农批】", "!原神&!明日方舟&王者荣耀", "#6600CC"]
    ];

    const vtuberList = [
        ["嘉心糖", "嘉然", "#E799B0"],
        ["雏草姬", "塔菲", "#FF00CC"],
        ["棺材板", "東雪蓮", "#C0C0C0"],
        ["杰尼", "七海", "#947583"],
        ["喵喵露", "猫雷", "#00FF00"],
        ["三畜", "小狗说", "#B8A6D9"],
        ["顶碗人", "向晚", "#9AC8E2"],
        ["贝极星", "贝拉", "#DB7D74"],
        ["奶淇琳", "乃琳", "#576690"],
        ["小星星", "星瞳", "#E0E0E0"],
        ["小孩梓", "梓", "#9900FF"]
    ];

    const vocaloadList = [
        ["骑士团", "初音|miku|MIKU", "#00CC99"],
        ["洛天依", "天依", "#33CCFF"]
    ];

    const igameList = [
        ["仙剑"],
        ["古剑"],
        ["逆水寒"],
        ["诛仙世界"],
        ["剑网"]
    ];

    const cgameList = [
        ["黑神话"],
        ["LOL", "英雄联盟|LOL"],
        ["COD", "使命召唤"]
    ];

    const ecygameList = [
        ["幻塔", null, "#FFCC66"],
        ["战双"],
        ["鸣潮"],
        ["米-零", "绝区零", "#0066FF"],
        ["米-崩", "崩坏|崩三", "#0066FF"],
        ["米-铁", "星穹铁道", "#0066FF"],
        ["光遇"],
        ["碧蓝", null, "#33CCC"],
        ["月球人", "FGO|冠位指定"],
        ["公主", "公主连结", "#CCFF99"],
        ["车万人", "东方project|灵梦|芙兰朵露|魔理沙"]
    ];

    const zgameList = [
        ["塞尔达"],
        ["怪猎", "怪物猎人"]
    ];

    const ogameList = [
        ["安慕希", "MINECRAFT|Minecraft|我的世界", "#006600"],
        ["传说之下", "UNDERTALE|undertale|Undertale|传说之下", "#333366"],
        ["SCP", null, "#330000"]
    ];

    const otherList = [
        ["【 隐藏 | 动态抽奖】", "抽奖", "#254680"]
    ];

    const defaultTag = ["【 普通 |  纯良】", "#11DD77"];

    // 不需要显示的注释即可
    const captor = [
        ['Vtuber', vtuberList],
        ['', threeList],
        ['V家', vocaloadList],
        ['网游', igameList, "#6666FF"],
        ['端游', cgameList, "#6699FF"],
        ['二游', ecygameList, "pink"],
        ['主机', zgameList],
        ['混沌', ogameList, "#FF6600"],
        ['', otherList]
    ];


    /* Functions */
    const getUid = function (htmlEntity) {
        if (isNew) {
            return htmlEntity.dataset['userId'];
        } else {
            return htmlEntity.children[0]['href'].replace(/[^\d]/g, "");
        }
    }

    const getCommentList = function () {
        if (isNew) {
            let lst = new Set();
            for (let c of document.getElementsByClassName('user-name')) {
                lst.add(c);
            }
            for (let c of document.getElementsByClassName('sub-user-name')) {
                lst.add(c);
            }
            return lst;
        } else {
            return document.getElementsByClassName('user');
        }
    }

    const log = function (message) {
        return config.testLog ? console.log(message) : null;
    };

    const searchStr = function (text, rule) {
        const ruleAnd = rule.split('&');
        let trueNum = 0;
        ruleAnd.forEach((rule2) => {
            const ruleOr = rule2.split('|');
            ruleOr.forEach(rule3 => {
                if ((rule3.substr(0, 1) === '!' && text.includes(rule3.substr(1)) !== true) || (rule3.substr(0, 1) !== '!' && text.includes(rule3))) {
                    trueNum++;
                } else {
                    return false;
                }
            });
        });

        return trueNum >= ruleAnd.length;
    }

    const spawnHtml = function (data) {
        return `<b style='color: ${data[1]}' >${data[0]}</b>`
    }

    const handel = function (text, htmlEntity) {
        let result = false;
        for (let num = 0; num < captor.length; num++) {
            let captorName = captor[num][0],
                arr = captor[num][1] ?? '#000000',
                captorColor = captor[num][2],
                isof;

            for (let init = 0; init < arr.length; init++) {
                let tempArr = arr[init];
                let viewName = tempArr[0],
                    keyword = tempArr[1] || viewName,
                    color = tempArr[2];

                if (searchStr(text, keyword)) {
                    result = true;
                    if (captorName) {
                        isof || (htmlEntity.innerHTML += `<b style='color: ${captorColor}' > 【 ${captorName}  `);
                        isof = true;
                        htmlEntity.innerHTML += '|  </b>' + `<b style='color: ${color}'> ${viewName}</b>`;
                    } else {
                        htmlEntity.innerHTML += spawnHtml([viewName, color]);
                    }
                }
                init === arr.length - 1 && isof && (htmlEntity.innerHTML += `<b style='color: ${captorColor}' >】</b>`);
            }
        };

        result || (htmlEntity.innerHTML += spawnHtml(defaultTag));
    }

    const unknown = new Set();
    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=';
    // 检测是不是新版
    const isNew = document.getElementsByClassName('item goback').length != 0;

    log(isNew);
    log("Loading...");

    setInterval(() => {
        const commentlist = getCommentList();
        if (commentlist.length != 0) {
            commentlist.forEach(htmlEntity => {
                if (htmlEntity.innerHTML.indexOf(`<span id="huli">`) == -1) {
                    htmlEntity.innerHTML += `<span id="huli">`;
                    const uid = getUid(htmlEntity);
                    unknown.add(uid)

                    GM_xmlhttpRequest({
                        method: "get",
                        url: blog + uid,
                        data: '',
                        headers: {
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                        },
                        onload: res => {
                            if (res.status === 200) {
                                unknown.delete(uid);
                                const text = JSON.stringify(JSON.parse(res.response).data);
                                handel(text, htmlEntity);
                            } else {
                                log('Fail');
                                log(res);
                            }
                        },
                    });
                    htmlEntity.innerHTML += `</span>`;
                }
            });
        }
    }, config.times)
})();

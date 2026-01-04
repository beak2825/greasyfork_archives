// ==UserScript==
// @name               自研 - 多个站点 - 切换文字遮罩
// @name:en_US         Self-made - Multi-site - Toggle text mask
// @description        按下`.`键或菜单命令，即可切换文字遮罩展示或隐藏。目前支持萌娘百科、萌娘百科镜像站、罗德岛初级终端服务·维基和MC百科。
// @description:en_US  Press the `.` key or use the menu command to toggle the display of text masks on or off. Currently compatible with MoeGirl, MoeGirl Mirror-site, PRTS.wiki, and MCMOD.
// @version            2.0.0
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @supportURL         https://www.gitlink.org.cn/CPlayerCHN/UserScript/issues
// @match              *://zh.moegirl.org.cn/*
// @match              *://mzh.moegirl.org.cn/*
// @match              *://mobile.moegirl.org.cn/*
// @match              *://moegirl.uk/*
// @match              *://moegirl.icu/*
// @match              *://prts.wiki/*
// @match              *://m.prts.wiki/*
// @match              *://www.mcmod.cn/*
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/489333/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E5%88%87%E6%8D%A2%E6%96%87%E5%AD%97%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/489333/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E5%88%87%E6%8D%A2%E6%96%87%E5%AD%97%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「配置」「重复触发」变量，「开关」函数。
    const config = [
        // {
        //     "name": "规则名",
        //     "match": /匹配网页/,
        //     "transition": "需要调整动效的元素",
        //     "style": "修改样式",
        //     "title": {
        //         "elements": "需要去除 title 元素参数的元素",
        //         "defaultText": "元素参数默认文本"
        //     },
        //     "reproduce": "复现"
        // }
        {
            "name": "萌娘百科、萌娘百科镜像站和罗德岛初级终端服务·维基",
            "match": /http(s)?:\/\/(zh\.|mzh\.|mobile\.|m\.)?(moegirl|prts)\.(org\.cn|uk|icu|wiki)\/*/,
            "transition": ".heimu, .heimu a, .colormu, .wenzimohu",
            "style": "/*去除遮罩*/ body.ttm-enable .heimu, body.ttm-enable .colormu > span { color: #FFFFFF !important } body.ttm-enable .hovers-blur { filter: blur(.5px) } body.ttm-enable .heimu a { color: #5291FF !important } /*美化链接*/ a { color: #0A59F7 }",
            "title": {
                "elements": ".heimu, .heimu a, .colormu, .wenzimohu",
                "defaultText": "你知道的太多了"
            },
            "reproduce": ["https://zh.moegirl.org.cn/Template:格式模板", "https://moegirl.uk/Template:黑幕", "https://moegirl.icu/Template:黑幕", "https://prts.wiki/w/模板:黑幕"]
        },
        {
            "name": "MC百科（MCMOD）",
            "match": /http(s)?:\/\/www.mcmod.cn\/*/,
            "transition": ".uknowtoomuch",
            "style": "/*去除遮罩*/ body.ttm-enable .uknowtoomuch { color: #FFFFFF !important }",
            "title": {
                "elements": "",
                "defaultText": ""
            },
            "reproduce": ["https://www.mcmod.cn/class/4170.html"]
        },
    ];
    let isKeyDown = false;

    function toggler() {

        // 判断 body 元素类是否有`ttm-enable`，有就去除，没有就添加。
        if(/ttm-enable/.test(document.body.className)) {

            document.body.classList.remove("ttm-enable");

        }else {

            document.body.classList.add("ttm-enable");

        }
    }


    // 修改样式、移除`title`元素参数。
    config.forEach((data) => {

        // 如果规则与页面链接匹配，就添加对应样式
        if(data.match.test(location.href)) {

            // 定义「动效样式」变量
            let transitionStyle = "";

            // 如果「需要调整动效的元素」不是空字符串，就加入样式。
            if(data.transition !== "") {
                transitionStyle = `${data.transition} { transition: .3s cubic-bezier(0.00, 0.00, 0.40, 1.00) !important } ${data.transition} { transition-property: color, filter }`
            };

            // 写入样式
            GM_addStyle(`${transitionStyle} ${data.style}`);


            // 如果「需要去除 title 元素参数的元素」不是空字符串，移除非默认状态下的`title`元素参数。
            if(data.title.elements !== "") {

                document.querySelectorAll(data.title.elements).forEach((ele) => {

                    if(ele.title === data.title.defaultText) {

                        ele.removeAttribute('title');

                    }

                });
            }


            // 结束遍历。
            return;

        }

    });



    // 按下`.`键时，执行「开关」函数。
    document.addEventListener("keydown", (keyData) => {

        // 判断是否重复触发，是的话就结束语句
        if(isKeyDown) return;

        // 如果按下的是`.`键，就将「重复触发」设置为真和执行「开关」函数。
        if(keyData.key === ".") {

            isKeyDown = true;
            toggler();

        }

    });

    document.addEventListener("keyup", () => {

        // 将「重复触发」设置为假
        isKeyDown = false;

    });

    // 点击菜单命令时，执行「开关」函数。
    GM_registerMenuCommand('切换隐藏与显示', () => toggler() );

    // 初始时，执行「开关」函数。
    toggler();

})();
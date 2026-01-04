// ==UserScript==
// @name         知乎 -  首页推荐软文删除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动删除知乎首页推荐信息流中的软文
// @author       zll
// @match        https://www.zhihu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @require http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480005/%E7%9F%A5%E4%B9%8E%20-%20%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%BD%AF%E6%96%87%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/480005/%E7%9F%A5%E4%B9%8E%20-%20%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%BD%AF%E6%96%87%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 黑名单的分组
    let blacklist = {
        "电子产品": [
            "学习机",
            "电视",
            "手机 and 推荐 and 购买",
            "手机 and 哪个好",
            "洗衣机",
            "oppo",
            "投影仪",
            "耳机",
            "一体机",
            "净水器",
            "油烟",
            "家电",
            "华为",
            "空调",
            "入手",
            "浴霸",
            "音响",
            "沐浴",
            "净化",
            "净水",
            "空气消毒机",
            "扫地机",
            "马桶",
            "按摩",
            "拼多多 and 赚",
            "AR and 眼镜"
        ],
        "健康和美容": [
            "头发",
            "发量",
            "植发",
            "甲醛",
            "护眼",
            "法令纹",
            "脱发",
            "护肤品",
            "鼾 or 呼噜",
            "须刀",
            "牙齿",
            "烟酰胺",
            "护肤",
            "隆胸",
            "美白",
            "口臭",
            "洗发水",
            "鼻子",
            "沐浴露",
            "牙刷"
        ],
        "工作和学习": ["教程", "做抖音", "做自媒体", "兼职", "副业"],
        "其他": [
            "推荐",
            "流量卡",
            "测评 or 横评",
            "为何如此受欢迎",
            "赚到 and 万元",
            "为什么 and 没 and 效果",
            "！ or 就够了",
            "买"
        ]
    }
    ;


    // 词法分析
    function tokenize(expression) {
        return expression.split(/(and|or|\(|\))/).map(e => e.trim()).filter(e => e);
    }

    // 语法分析
    function parse(tokens) {
        function parseExpression() {
            let node = parseTerm();
            while (tokens[0] === "and") {
                tokens.shift();
                let right = parseTerm();
                node = { type: "AND", left: node, right: right };
            }
            return node;
        }

        function parseTerm() {
            let node = parseFactor();
            while (tokens[0] === "or") {
                tokens.shift();
                let right = parseFactor();
                node = { type: "OR", values: [node, right] };
            }
            return node;
        }

        function parseFactor() {
            let token = tokens.shift();
            if (token === "(") {
                let node = parseExpression();
                tokens.shift(); // pop ")"
                return node;
            }
            return token;
        }

        return parseExpression();
    }

    // 逻辑表达式的求值
    function evaluate(node, content) {
        if (node.type === "AND") {
            return evaluate(node.left, content) && evaluate(node.right, content);
        } else if (node.type === "OR") {
            return evaluate(node.values[0], content) || evaluate(node.values[1], content);
        } else {
            return content.includes(node);
        }
    }

    function matchesExpression(expression, content) {
        let tokens = tokenize(expression);
        let ast = parse(tokens);
        return evaluate(ast, content);
    }

    // 黑名单检查
    function matchesBlacklist(content) {
        content = content.toLowerCase();
        for (let category in blacklist) {
            for (let item of blacklist[category]) {
                if (matchesExpression(item, content)) {
                    return [true, item];
                }
            }
        }
        return [false, null];
    }

    // 移除广告内容的函数
    function removeAds(){
        $('.Topstory-recommend .Card.TopstoryItem-isRecommend').each(function() {
//             if($(this).find('button').filter((i,e)=>$(e).text() == '​添加评论').length>0){
//                 $(this).remove();
//                 console.log('Removed:' + $(this).find('h2.ContentItem-title a').text() + ' by rule: no comment')
//                 return;
//             }

            let ct = $(this).find('h2.ContentItem-title a').text();
            var r = matchesBlacklist(ct);
            if (ct && r[0]) {
                $(this).remove();
                console.log('Removed:' + ct + ' by rule: ' + r[1])
            }
        });
    }

    // 调用定时器来定期移除广告
    window.setInterval(function(){
        removeAds()
    }, 200);


})();
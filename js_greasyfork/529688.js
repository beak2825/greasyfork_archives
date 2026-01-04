// ==UserScript==
// @name         gamemodels3d反和谐
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       poi
// @description  gamemodels3d的日本舰船反和谐
// @match        https://gamemodels3d.com/*
// @icon         https://gamemodels3d.com/favicon.ico
// @license     GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529688/gamemodels3d%E5%8F%8D%E5%92%8C%E8%B0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/529688/gamemodels3d%E5%8F%8D%E5%92%8C%E8%B0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceMap = {
        // 基础替换规则‌:ml-citation{ref="1" data="citationList"}
        '\\b荷兰\\b': '荷兰', // 确保独立词汇匹配
        '\\b凤凰\\b': '凤凰',
        '凤(?!凰)': '凤翔', // 匹配"凤"但排除"凤凰"中的凤‌:ml-citation{ref="2" data="citationList"}
        '荷(?!兰)': '峰云',
        '枭':'龙骧',
        '鹬':'翔鹤',
        '鹫':'白龙',
        '鹮':'赤龙',
        '鸾':'加贺',
        '鹗':'信浓',
        '鹩':'大凤',
        '鲑':'河内',
        '鲛':'妙义',
        '魟':'扶桑',
        '鲤':'金刚',
        '鳗':'石锤',
        '鲨':'长门',
        '鲐':'三笠',
        '鳐':'天城',
        '鲸':'大和',
        '鲟':'出云',
        '鹏':'萨摩',
        '鲶':'弓张',
        '鳢':'安达太良',
        '鳣':'丰后',
        '鲭':'陆奥',
        '鲔':'爱鹰',
        '鲣':'纪伊',
        '鲲':'武藏',
        '鲙':'敷岛',
        '螯':'日向',
        '鲃':'肥前',
        '鳌':'伊势',
        '鲯':'石见',
        '鳇':'大山',
        '鮣':'剑',
        '鲷':'穗高',
        '狐':'夕张',
        '狼':'古鹰',
        '犹':'青叶',
        '鬣':'妙高',
        '狮':'最上',
        '虎':'伊吹',
        '熊':'球磨',
        '豺':'天龙',
        '貂':'利根',
        '貆':'岩城',
        '象':'藏王',
        '獾':'筑摩',
        '鼠':'桥立',
        '犬':'爱宕',
        '豼':'阿贺野',
        '麂':'五濑',
        '獭':'雄物',
        '犰':'四万十',
        '狒':'高梁',
        '狍':'淀',
        '鹿':'香取',
        '狸':'矢矧',
        '狲':'十胜',
        '猉':'吾妻',
        '犮':'摩耶',
        '狤':'吉野',
        '獚':'北上',
        '犀':'枪',
        '獴':'筑摩 II',
        '猿':'铃谷',
        '枳':'橘',
        '藤':'海风',
        '柳':'矶风',
        '樱':'峰风',
        '芒':'岛风',
        '杨':'风神',
        '菖':'若竹',
        '枫':'神风',
        '松':'睦月',
        '桐':'吹雪',
        '蕾':'晓',
        '杏':'秋月',
        '苽':'山雾',
        '梅':'初春',
        '梿':'白露',
        '萩':'阳炎',
        '榎':'夕云',
        '葫':'春云',
        '蕉':'北风',
        '椿':'夕立',
        '葵':'疾风',
        '柊':'朝潮',
        '茜':'东云',
        '莲':'雪风',
        '荷':'峰云',
        '狏':'那智',
        '狳':'足柄',
        '獒':'高雄',
        '驼':'雾岛',
        '鲮':'榛名',
        '鱿':'比叡',
        '菽':'晴风'
    };

    function advancedReplace() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            let text = walker.currentNode.nodeValue;

            // 按规则长度倒序执行
            Object.entries(replaceMap)
                .sort((a, b) => b.length - a.length)
                .forEach(([pattern, replacement]) => {
                const regex = new RegExp(pattern, 'gmu');
                text = text.replace(regex, replacement);
            });

            // 新增纠错步骤
            text = text.replace(/峰云兰/gmu, '荷兰'); // 将可能的错误替换还原

            walker.currentNode.nodeValue = text;
        }
    }

advancedReplace();
})();
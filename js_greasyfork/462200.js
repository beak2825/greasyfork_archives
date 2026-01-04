// ==UserScript==
// @name         J高亮关键词-分组版
// @namespace    https://github.com/mudssky/highlight-keywords
// @version      0.2.1
// @description  高亮关键词,可设置关键词的样式,支持正则匹配,自行修改脚本配置
// @author       mudssky
// @include      /^.*(jav|bus|dmm|see|cdn|fan){2}\..*$/
// @include      https://theporndude.com/*
// @include      https://www.hxaa*.com/*
// @license      MIT
// @homepageURL https://github.com/mudssky/highlight-keywords
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/462200/J%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D-%E5%88%86%E7%BB%84%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462200/J%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D-%E5%88%86%E7%BB%84%E7%89%88.meta.js
// ==/UserScript==

(function() {

var RuleList = [
        {keyword: '一琳', styleText: 'background:green;color:White',},
        {keyword: 'HY清风', styleText: 'background:green;color:White',},
        {keyword: '免费', styleText: 'background:green;color:White',},
        {keyword: '限免', styleText: 'background:green;color:White',},
        {keyword: '韩语中字', styleText: 'background:green;color:White',},
        {keyword: '日语中字', styleText: 'background:green;color:White',},
        {keyword: '江英伟', styleText: 'background:green;color:White',},
        {keyword: '黄岩', styleText: 'background:green;color:White',},
        {keyword: '现金', styleText: 'background:green;color:White',},
        {keyword: '河南', styleText: 'background:green;color:White',},
		  	{keyword: '字幕', styleText: 'background:red;color:white;padding:4px;',},

        {keyword: '楓ふうあ', styleText: 'background:green;color:White',},
        {keyword: '夏目彩春', styleText: 'background:green;color:White',},
        {keyword: '森日向子', styleText: 'background:green;color:White',},
        {keyword: '三宮つばき', styleText: 'background:green;color:White',},
        {keyword: '梓ヒカリ', styleText: 'background:green;color:White',},
        {keyword: '蓮実クレア', styleText: 'background:green;color:White',},
        {keyword: '天音まひな', styleText: 'background:green;color:White',},
        {keyword: '神宮寺ナオ', styleText: 'background:green;color:White',},

        {keyword: 'Aika', styleText: 'background:red;color:White',},
        {keyword: 'Hitomi', styleText: 'background:red;color:White',},
        {keyword: 'ななせ麻衣', styleText: 'background:red;color:White',},
        {keyword: 'ひとみ', styleText: 'background:red;color:White',},
        {keyword: '一ノ瀬綾乃', styleText: 'background:red;color:White',},
        {keyword: '七ツ森りり', styleText: 'background:red;color:White',},
        {keyword: '七瀬ひな', styleText: 'background:red;color:White',},
        {keyword: '久里くらら', styleText: 'background:red;color:White',},
        {keyword: '楠木花菜', styleText: 'background:red;color:White',},
        {keyword: '咲乃柑菜', styleText: 'background:red;color:White',},
        {keyword: '伊藤舞雪', styleText: 'background:red;color:White',},
        {keyword: '佐田茉莉子', styleText: 'background:red;color:White',},
        {keyword: '冨安れおな', styleText: 'background:red;color:White',},
        {keyword: '冬愛ことね', styleText: 'background:red;color:White',},
        {keyword: '加瀬ななほ', styleText: 'background:red;color:White',},
        {keyword: '吉永真弓', styleText: 'background:red;color:White',},
        {keyword: '大島優香', styleText: 'background:red;color:White',},
        {keyword: '大森優里', styleText: 'background:red;color:White',},
        {keyword: '天海麗', styleText: 'background:red;color:White',},
        {keyword: '天海つばさ', styleText: 'background:red;color:White',},
        {keyword: '天音ゆい', styleText: 'background:red;color:White',},
        {keyword: '宇佐美雪', styleText: 'background:red;color:White',},
        {keyword: '宮名遥', styleText: 'background:red;color:White',},
        {keyword: '宮森みすず', styleText: 'background:red;color:White',},
        {keyword: '小倉由菜', styleText: 'background:red;color:White',},
        {keyword: '小向美奈子', styleText: 'background:red;color:White',},
        {keyword: '小宵こなん', styleText: 'background:red;color:White',},
        {keyword: '小川あさ美', styleText: 'background:red;color:White',},
        {keyword: '小早川怜子', styleText: 'background:red;color:White',},
        {keyword: '山口珠理', styleText: 'background:red;color:White',},
        {keyword: '岬さくら', styleText: 'background:red;color:White',},
        {keyword: '希島あいり', styleText: 'background:red;color:White',},
        {keyword: '平守ほなみ', styleText: 'background:red;color:White',},
        {keyword: '平岡里枝子', styleText: 'background:red;color:White',},
        {keyword: '愛田奈々', styleText: 'background:red;color:White',},
        {keyword: '成咲優美', styleText: 'background:red;color:White',},
        {keyword: '日向なつ', styleText: 'background:red;color:White',},
        {keyword: '日本', styleText: 'background:red;color:White',},
        {keyword: '明里つむぎ', styleText: 'background:red;color:White',},
        {keyword: '春菜はな', styleText: 'background:red;color:White',},
        {keyword: '月乃ルナ', styleText: 'background:red;color:White',},
        {keyword: '朝比奈ななせ', styleText: 'background:red;color:White',},
        {keyword: '本田もも', styleText: 'background:red;color:White',},
        {keyword: '東凛', styleText: 'background:red;color:White',},
        {keyword: '桐谷まつり', styleText: 'background:red;color:White',},
        {keyword: '水戸かな', styleText: 'background:red;color:White',},
        {keyword: '時田亜美', styleText: 'background:red;color:White',},
        {keyword: '永岡雅美', styleText: 'background:red;color:White',},
        {keyword: '永野いち夏', styleText: 'background:red;color:White',},
        {keyword: '江波りゅう', styleText: 'background:red;color:White',},
        {keyword: '河北彩花', styleText: 'background:red;color:White',},
        {keyword: '瀬田一花', styleText: 'background:red;color:White',},
        {keyword: '田中瞳', styleText: 'background:red;color:White',},
        {keyword: '由愛可奈', styleText: 'background:red;color:White',},
        {keyword: '白峰ミウ', styleText: 'background:red;color:White',},
        {keyword: '白木優子', styleText: 'background:red;color:White',},
        {keyword: '白石茉莉奈', styleText: 'background:red;color:White',},
        {keyword: '白花こう', styleText: 'background:red;color:White',},
        {keyword: '白鳥寿美礼', styleText: 'background:red;color:White',},
        {keyword: '知野ことり', styleText: 'background:red;color:White',},
        {keyword: '秋吉ひな', styleText: 'background:red;color:White',},
        {keyword: '穂高結花', styleText: 'background:red;color:White',},
        {keyword: '紗々原ゆり', styleText: 'background:red;color:White',},
        {keyword: '紺野みいな', styleText: 'background:red;color:White',},
        {keyword: '緑川みやび', styleText: 'background:red;color:White',},
        {keyword: '美乃すずめ', styleText: 'background:red;color:White',},
        {keyword: '美ノ嶋めぐり', styleText: 'background:red;color:White',},
        {keyword: '美谷朱里', styleText: 'background:red;color:White',},
        {keyword: '花宮あむ', styleText: 'background:red;color:White',},
        {keyword: '茜はるか', styleText: 'background:red;color:White',},
        {keyword: '葵つかさ', styleText: 'background:red;color:White',},
        {keyword: '藍芽みずき', styleText: 'background:red;color:White',},
        {keyword: '藤森里穂', styleText: 'background:red;color:White',},
        {keyword: '藤浦めぐ', styleText: 'background:red;color:White',},
        {keyword: '西宮ゆめ', styleText: 'background:red;color:White',},
        {keyword: '赤井美月', styleText: 'background:red;color:White',},
        {keyword: '金谷うの', styleText: 'background:red;color:White',},
        {keyword: '高瀬りな', styleText: 'background:red;color:White',},
        {keyword: '鷲尾めい', styleText: 'background:red;color:White',},
        {keyword: 'https://www.buscdn.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.buscdn.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busdmm.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busdmm.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busfan.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busjav.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busjav.icu', styleText: 'background:red;color:White',},
        {keyword: 'https://www.busjav.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.cdnbus.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.cdnbus.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.dmmbus.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.dmmsee.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.fanbus.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javbus.com', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javbus.in', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javbus.lol', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.bar', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.bid', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.blog', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.cam', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.cc', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.cloud', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.club', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.icu', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.in', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.info', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.life', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.me', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.men', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.one', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.org', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.pw', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.us', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.work', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.xyz', styleText: 'background:red;color:White',},
        {keyword: 'https://www.javsee.zone', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seedmm.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.bar', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.blog', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.cam', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.cc', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.cfd', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.cloud', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.club', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.co', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.fun', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.icu', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.in', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.life', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.me', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.men', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.one', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.org', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.pw', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.work', styleText: 'background:red;color:White',},
        {keyword: 'https://www.seejav.zone', styleText: 'background:red;color:White',},
    ];
    // 筛选匹配当前页面的规则
    var matchedRuleList = RuleList.filter(function (rule) {
        // 检查是否存在matchUrl选项,如果没有直接报错,默认当作匹配所有网站处理,直接通过过滤
        if (!rule.matchUrl) {
            console.error('this rule should have a match url');
            return rule;
        }
        // 存在matchUrl选项,则过滤匹配当前页面的rule
        if (rule.matchUrl) {
            var urlPattern = new RegExp(rule.matchUrl);
            if (urlPattern.test(window.location.href)) {
                return rule;
            }
        }
    });
    // 这个变量存放最后修改后的html
    var lastHtml = document.body.innerHTML;
    // console.log(matchedRuleList)
    // 使用innerhtml 替换的方式,替换关键词为带高亮style的html
    for (var i in matchedRuleList) {
        // 作为中间变量，每次循环从上次的结果基础上进行。
        var currentHtml = lastHtml;
        var htmlPattern = new RegExp("(<[^>]+>[^<>]*?)" + matchedRuleList[i].keyword + "([^<>]*?<[^>]+>)", 'g');
        lastHtml = currentHtml.replaceAll(htmlPattern, "$1<em style=\"" + matchedRuleList[i].styleText + "\">" + matchedRuleList[i].keyword + "</em>$2");
    }
    document.body.innerHTML = lastHtml;

})();

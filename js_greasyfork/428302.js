// ==UserScript==
// @name         hightlight-keywords-nyaa
// @namespace    https://github.com/mudssky/highlight-keywords
// @version      0.2.2
// @license 	MIT
// @description  高亮关键词,可设置关键词的样式,支持正则匹配,自行修改脚本配置
// @author       mudssky
// @include       *://sukebei.nyaa.si/*
// @grant        GM_openInTab 
// @homepageURL https://github.com/mudssky/highlight-keywords
// @supportURL        https://github.com/mudssky/highlight-keywords/issues
// @downloadURL https://update.greasyfork.org/scripts/428302/hightlight-keywords-nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/428302/hightlight-keywords-nyaa.meta.js
// ==/UserScript==


"use strict";
// 因为是用的@require 方法引用脚本，就和页面引入js一样是会阻塞线程的导致页面加载不出，这边onload等页面加载完再执行
// window.onload = function () {
//   setTimeout(() => {
//     main()
//   }, 3000)
// }
;
(function () {
    // const defaultStyleText = 'background:gold;'
    // interface RuleList
    var RuleList = [
        {
            keyword: '成年コミック',
            // color: 'yellow',
            styleText: 'background:gold;',
            matchUrl: 'sukebei.nyaa.si',
        },
        {
            keyword: '月刊',
            // color: 'yellow',
            styleText: 'background:red;',
            matchUrl: 'nyaa.si',
        },
        {
            keyword: '週刊',
            // color: 'yellow',
            styleText: 'background:gold;',
            matchUrl: 'nyaa.si',
        },
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
        lastHtml = currentHtml.replaceAll(htmlPattern, "$1<em data-hightlight=\"true\" style=\"" + matchedRuleList[i].styleText + "\">" + matchedRuleList[i].keyword + "</em>$2");
    }
    document.body.innerHTML = lastHtml;
    document.body.insertAdjacentHTML('beforeend', "<button id=\"hightlight-batchopen\" style=\"position:fixed;top:30vh;\">\n  \u6279\u91CF\u6253\u5F00\u9AD8\u4EAE\u94FE\u63A5\n  </button>");
    var bacthOpenBtn = document.querySelector('#hightlight-batchopen');
    bacthOpenBtn.onclick = function () {
        // alert('批量打开')
        var excuteStartTime = 0;
        var delay = 1000;
        var urlList = [];
        document.querySelectorAll('a em[data-hightlight=true]').forEach(function (emDom) {
            var link = emDom.parentNode.href;
            if (link && !urlList.includes(link))
                urlList.push(link);
        });
        console.log('open url', urlList);
        urlList.forEach(function (url) {
            // window.open((emDom.parentNode as HTMLLinkElement).href, '_blank')
            setTimeout(function () {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                GM_openInTab(url);
            }, excuteStartTime);
            excuteStartTime += delay;
            // console.log('2w', url)
        });
    };
})();

// ==UserScript==
// @name         自动展开豆瓣、站长之家、米坛、cnbeta、知乎、慕课网、Awesomes、喜马拉雅、CSDN博客、CSDN下载、道客88、百度文库、百度知道、回形针、人民日报客户端、凤凰网页面的隐藏内容
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  自动展开一些PC网站的隐藏内容；个人觉得手机端不需要做，故只在PC端有用；为了更好的上网体验，不兼容低版本浏览器和IE浏览器。大家如有发现类似需要手动点开隐藏内容的网站，请至以下网址反馈吧https://greasyfork.org/zh-CN/forum/discussion/72571/x
// @author       life0001
// @match        *blog.csdn.net/*
// @match        *bbs.csdn.net/*
// @match        *download.csdn.net/download/*/*
// @match        *www.doc88.com/*
// @match        *wenku.baidu.com/view/*
// @match        *zhidao.baidu.com/question*
// @match        *www.ipaperclip.net/doku.php?id=*
// @match        *wap.peopleapp.com/article/*
// @match        *ishare.ifeng.com/c/s/*
// @match        *www.ximalaya.com/*
// @match        *www.awesomes.cn/*
// @match        *www.imooc.com/article/*
// @match        *www.zhihu.com/question/*
// @match        *www.bandbbs.cn/*
// @match        *www.cnbeta.com/*
// @match        *www.chinaz.com/*
// @match        *www.douban.com/note/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397933/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%B1%86%E7%93%A3%E3%80%81%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E3%80%81%E7%B1%B3%E5%9D%9B%E3%80%81cnbeta%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%E3%80%81Awesomes%E3%80%81%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E3%80%81CSDN%E5%8D%9A%E5%AE%A2%E3%80%81CSDN%E4%B8%8B%E8%BD%BD%E3%80%81%E9%81%93%E5%AE%A288%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E5%9B%9E%E5%BD%A2%E9%92%88%E3%80%81%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5%E5%AE%A2%E6%88%B7%E7%AB%AF%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/397933/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%B1%86%E7%93%A3%E3%80%81%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E3%80%81%E7%B1%B3%E5%9D%9B%E3%80%81cnbeta%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%E3%80%81Awesomes%E3%80%81%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E3%80%81CSDN%E5%8D%9A%E5%AE%A2%E3%80%81CSDN%E4%B8%8B%E8%BD%BD%E3%80%81%E9%81%93%E5%AE%A288%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E3%80%81%E5%9B%9E%E5%BD%A2%E9%92%88%E3%80%81%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5%E5%AE%A2%E6%88%B7%E7%AB%AF%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const btns = Array(
        '.btn-readmore',
        '.show-hide-btn',
        '.down-arrow',
        '.paperclip__showbtn',
        '.expend',
        '.shadow-2n5oidXt',
        '.read_more_btn',
        '.QuestionRichText-more',
        '.QuestionMainAction',
        '.ContentItem-expandButton',
        '.js_show_topic',
        '.tbl-read-more-btn',
        '.more-intro-wrapper',
        '.showMore',
        '.unfoldFullText',
        '.taboola-open',
    ),
        asyncBtns = Array(
            '#continueButton',
            '.read-more-zhankai',
            '.wgt-answers-showbtn',
            '.wgt-best-showbtn',
            '.bbCodeBlock-expandLink'
        ), delay = 500;
    let timer;

    function showFull(btns, fn, isDone) {
        for (let i = 0; i < btns.length; i++) {
            try {
                continue
            }
            finally {
                const d = btns[i], dom = document.querySelectorAll(d);
                if (!!dom[0]) {
                    fn(dom, d);
                }
            }
        }
        clearTimeout(timer);
        if (!isDone) timer = setTimeout(() => showFull(btns, fn, false), delay);
    }

    function doShow(dom, d) {
        if (d === '.paperclip__showbtn') {
            dom.forEach(item => item.click());
        } else if (d === '.showMore') {
            dom[0].querySelector('span').click();
        } else {
            dom[0].click();
        }
    }

    function doAsyncShow(dom, d) {
        dom[0].click();
    }

    showFull(btns, doShow, false);
    window.addEventListener("load", () => {
        clearTimeout(timer);
        setTimeout(() => showFull(asyncBtns, doAsyncShow, true), delay);
    });
})();
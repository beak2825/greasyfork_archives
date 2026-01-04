// ==UserScript==
// @name   知乎浏览助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description 知乎浏览助手. 如果想报 bug, 可以通过知乎私信联系我, zhihu.com/people/kougazhang
// @author        kgzhang
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/400790/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/400790/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

    /****************** Global ****************************************/
    // Be largger the font;
    GM_addStyle("body {font-size: 25px}");
    // Hidden Topstory-hot
    GM_addStyle('a[aria-controls="Topstory-hot"] { display: none !important; }');
    // Hidden Topstory-zvideo
    GM_addStyle('a[aria-controls="Topstory-zvideo"] { display: none !important; }');
    // Hidden Topstory-recommend
    // GM_addStyle('a[aria-controls="Topstory-recommend"] { display: none !important; }');
    // Display 首页 only
    GM_addStyle('ul[class~="AppHeader-Tabs"] :not(:first-child) { display: none !important; }')
    // Hidden placeholder of search bar
    GM_addStyle('::placeholder {color: transparent !important;}');
    // rightButton 收起
    GM_addStyle('.ContentItem-rightButton {color: red}');
    // 返回顶部
    GM_addStyle('.Zi--BackToTop {color: red}');
     // hidden images
    let displayImages = GM_getValue("displayImages", true);
    // try to hide images in loading page
    if (!displayImages) {
        GM_addStyle("img {display: none !important; }");
    }
    GM_registerMenuCommand('Display images', function() {
        displayImages = !displayImages;
        GM_setValue("displayImages", displayImages);
        if (displayImages) {
            GM_addStyle("img {display: block !important; }");
        } else {
            GM_addStyle("img {display: none !important; }");
        }
        alert("Now displaying images is " + displayImages);
    }, 'r');
    /****************** Global ****************************************/

    /****************** CornerButtons ****************************************/
    // GM_addStyle('.CornerButtons { right: 400px; bottom: 50px}')
    // GM_addStyle('.CornerAnimayedFlex { background: red; }')
    /****************** CornerButtons ****************************************/


    /***************** Follow page***********************/
    // Remove RightSideBar
    GM_addStyle("div[data-za-detail-view-path-module='RightSideBar']  { display: none !important; } ");
    // Remove AD
    GM_addStyle(".TopstoryItem--advertCard {display: none; }");
    // Widen mainColumn
    GM_addStyle(".Topstory-container { width: 1500px !important; } ");
    GM_addStyle(".Topstory-mainColumn { width: 1500px !important; } ");
    // Be lagger the font of question title
    GM_addStyle('.ContentItem-title {font-size: x-large}');
    /***************** Follow page***********************/

    /***************** Recommand page***********************/
    // hidden video
    GM_addStyle(".TopstoryItem-isRecommend:has(.VideoAnswerPlayer-video) { display: none !important; } ");
    GM_addStyle(".TopstoryItem-isRecommend:has(.ZVideoItem-video) { display: none !important; } ");
    GM_addStyle(".TopstoryItem-isRecommend:has(.RichText-video) { display: none !important; } ");
    // hidden article
    GM_addStyle(".TopstoryItem-isRecommend:has(.CopyrightRichText-richTex) { display: none !important; } ");
    // hidden having -LinkCard
    GM_addStyle(".TopstoryItem-isRecommend:has(.RichText-LinkCardContainer) { display: none !important; } ");
    // hidden for edu RichText-EduCardContainer
    GM_addStyle(".TopstoryItem-isRecommend:has(.RichText-EduCardContainer) { display: none !important; } ");
    // hidden zhuanlan
    GM_addStyle('.TopstoryItem-isRecommend:has(div[data-za-extra-module*="Post"]) { display: none !important; }');
    // hidden Ecommerce
    GM_addStyle("TopstoryItem-isRecommend:has(.RichText-Ecommerce) {display: none !important; }");
    GM_addStyle(".TopstoryItem-isRecommend:has(.ecommerce-ad-box) {display: none !important; }");

    // color
    // GM_addStyle(".TopstoryItem-isRecommend:nth-child(odd) {background: #f6f6f6}")
    // GM_addStyle(".TopstoryItem-isRecommend:nth-child(even) {background: #dfe1e5}")
    /***************** Recommand page***********************/

    /****************** Question page *********************************/
    // Widen mainColumn
    GM_addStyle(".Question-main { width: 1500px !important; } ");
    GM_addStyle(".Question-mainColumn { width: 1500px !important; } ");
    // display & Make time at top
    GM_addStyle('meta[itemprop="dateModified"] {display: block; height: 20px; padding: 10px}');
    GM_addStyle('meta[itemprop="dateModified"]::after {content: "DateModified: " attr(content); color:#8590a6;}');
    // hidden link,
    // GM_addStyle(".AnswerItem:has(.RichText-LinkCardContainer) { display: none !important; } ");
    // hidden video
    GM_addStyle(".AnswerItem:has(.VideoCard-video-content) { display: none !important; } ");
    GM_addStyle(".AnswerItem:has(.VideoAnswerPlayer) { display: none !important; } ");
    // go back and refresh
    document.querySelector('div[class="CornerButtons"]').addEventListener('click', (e)=>{
           location.reload();
        });
    /****************** Question page *********************************/

    /****************** Search page ***********************************************/
    // Hidden right bar
    GM_addStyle(".css-knqde {display: none !important;}");
    // Widen main bar
    GM_addStyle(".Search-container { width: 1500px !important; } ");
    GM_addStyle(".SearchMain { width: 1500px !important; } ");
    /****************** Search page ***********************************************/

    /****************** Topic page ***********************************************/
    // Widen main bar
    GM_addStyle('div[data-za-detail-view-path-module="TopicItem"] { max-width: 1500px !important; } ');
    /****************** Topic page ***********************************************/

    /****************** Column page **********************************************************/
    // GM_addStyle('main[role="main"]>div>div:last-child {width: 1500px}');
    // GM_addStyle('main[role="main"]>div>div:last-child > div > div {width: 1500px}');
    /****************** Column page **********************************************************/

    /**************************** is-collapsed *************************************************/
    // reload for MutationObserver
    window.addEventListener('load', (e)=>{
        console.log("load", e);
        let btn=document.querySelector('a[class="QuestionMainAction ViewAll-QuestionMainAction"]');
        btn.addEventListener('click', (e)=>{
            e.stopPropagation();
            let h = window.open(btn.href, "_self");
            h.location.reload();
        })
    });
    // close to is collapsed
    try {
        (new MutationObserver(mutations => {
        if (!window.location.href.contains("zhihu.com/question")) {
            console.log("href", window.location.href);
            return
        }
        for(let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                  if (node===null) {
                      continue;
                  }
                  node.querySelector('button[data-zop-retract-question="true"]').click();
                }
            }
        }
    })).observe(document.querySelector('div[role="list"]'), {
        childList: true, // 观察直接子节点
        subtree: true,
        attributes: false,
        characterData: false
    });
    } catch (e) {
        console.log(e)
    }
    /**************************** is-collapsed *************************************************/

    /******************* Free copy**********************************************/
    let body = document.getElementsByTagName('body')[0];
    body.addEventListener('copy', function (e) {
        e.stopPropagation();
        console.log("copy...");
    }, false);
    body.addEventListener('contextmenu', (e) => {
        e.stopPropagation();
    }, false);
    body.addEventListener('select', (event) => {
        event.stopPropagation();
    }, false);
    body.addEventListener('selectstart', (event) => {
        event.stopPropagation();
    }, false);
    body.addEventListener('cut', (event) => {
        event.stopPropagation();
    }, false);
    body.addEventListener('dragstart', (event) => {
        event.stopPropagation();
    }, false);
    body.addEventListener('mousemove', (event) => {
        event.stopPropagation();
    }, false);
    /******************* Free copy**********************************************/
})()
// ==UserScript==
// @name        Block Zhihu Ad Question
// @namespace   undefined
// @description 屏蔽知乎带广告回答
// @include     *://www.zhihu.com/question/*
// @version     0.02
// @license MIT
// @connect-src       www.zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/444822/Block%20Zhihu%20Ad%20Question.user.js
// @updateURL https://update.greasyfork.org/scripts/444822/Block%20Zhihu%20Ad%20Question.meta.js
// ==/UserScript==
(function () {
        'use strict';
        setInterval(() => {
            let answerItem = document.getElementsByClassName("AnswerItem");
            for (let key in answerItem) {
                try {
                    let answerItemElement = answerItem[key];
                    let cards = answerItemElement.getElementsByClassName("GoodsRecommendCard");
                    let ads = answerItemElement.getElementsByClassName("ecommerce-ad-commodity");
                    console.log(cards)
                    console.log(cards.length)
                    if (cards.length + ads.length > 0) {
                        answerItemElement.style.display = "none"
                    }
                } catch (e) {

                }
            }
        }, 2000)
    }
)
();
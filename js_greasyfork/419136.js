// ==UserScript==
// @name           知乎去广告、视频
// @namespace   http://tampermonkey.net/
// @version         1.10
// @description   a script to remove ads in www.zhihu.com
// @author          CoderBen
// @match          https://www.zhihu.com/*
// @exclude        https://www.zhihu.com/question/*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @grant           none
// @icon            https://tse2-mm.cn.bing.net/th/id/OIP.7D-LqgunUUDXVESZYas8GAHaHa?pid=Api&rs=1
// @downloadURL https://update.greasyfork.org/scripts/419136/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/419136/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf('/people/') > -1) return

    try {
        const words = [
            '拒交智商税', '怎么选','职业兴趣测试', '工作计划安排', '保险', '心理咨询师', '如何成为', '全流程', '空气净化器', '空气炸锅', '烤箱', '大佬手把手', '超融合', '品牌推荐',
            '手动剃须刀', '实测', '深度测评', '值得买', '选购', '流量卡', '在线硕士', '痛经', '选购', '松果煲粥','深度测评','植皮','感染真菌','星卡', '拿香港身份', '哪家装修',
            '亲测有效', '抖小店','推荐！','申请攻略', '留学中介',
        ]

        removeHomeBar()
        removeAds()
        removeMovies()

        window.onscroll = throttle(function() {
            removeAds()
            removeMovies()
        }, 500)

        document.querySelector('.Topstory-tabsLink').onclick = () => {
            const timer = setTimeout(() => {
                removeAds()
                removeMovies()
                clearTimeout(timer)
            }, 3000)
        }
    } catch (e) {
        console.error('油猴插件【知乎去广告、视频】：出现错误', e)
    }

    function removeAds () {
        $('.TopstoryItem--advertCard')?.each((index,elem) => elem.style.display = 'none')
        $('.Pc-card')?.each((index,elem) => elem.style.display = 'none')

        const cards = document.querySelectorAll('.TopstoryItem-isRecommend')
        cards.forEach(item => {
            words.forEach(word => {
              if (item.innerText.includes(word)) {
                item.remove()
              }
            })
        })
    }

    function removeMovies() {
        $('.ZVideoItem')?.each((index,elem) => $(elem).parent('.TopstoryItem-isRecommend')?.context?.remove())
        $('.VideoAnswerPlayer')?.each((index,elem) => $(elem).parent('.TopstoryItem-isRecommend')?.context?.remove())
    }

    function removeHomeBar() {
        $('.Topstory-container').prev()?.remove()
    }

    function throttle(func, delay) {
       let last;
       return function () {
           const _this = this;
           const _args = arguments;
           const now = +new Date();
           if (last && now < last + delay) {
               clearTimeout(func.tid);
               func.tid = setTimeout(function () {
                   last = now;
                   func.call(_this, [..._args]);
               }, delay);
           } else {
               last = now;
               func.call(_this, [..._args]);
           }
       }
   }

})();
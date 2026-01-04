// ==UserScript==
// @name         Javmost只展示有评分的内容
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  javmost筛选评分>8的影片
// @author       You
// @match        https://www.javmost.cx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javmost.cx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471433/Javmost%E5%8F%AA%E5%B1%95%E7%A4%BA%E6%9C%89%E8%AF%84%E5%88%86%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/471433/Javmost%E5%8F%AA%E5%B1%95%E7%A4%BA%E6%9C%89%E8%AF%84%E5%88%86%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        handleNavBarStyle();
        filterScoredCard();
    },2000)

    const handleNavBarStyle = ()=> {
        let navBar = document.getElementById('nav-page');
        navBar.style.backgroundColor = 'transparent';
        navBar.style.width = '20px';
    }

    // 只展示评分>8
    const filterScoredCard = () => {
        let cardListWrap = document.getElementsByClassName('row')[0];
        let cardWrap = [...cardListWrap.children];
        cardWrap.forEach((card, index)=>{
            let cardChild = [...card.getElementsByClassName('card-text')];
            if(!cardChild.length) return cardListWrap.removeChild(card);
            let flag = false;
            cardChild[0].childNodes.forEach((child)=>{
                if(child.nodeName == '#text'){
                    let matchResult = child.nodeValue.match(/\sRating\s(\d).*/)
                    // 没评分或非评分所在节点
                    if(!matchResult) return;
                    // 评分<8
                    if(parseInt(matchResult[1]) < 8) return;
                    // 评分>8
                    flag = true
                    card.style.height = '500px';
                }
            })
            if(!flag) cardListWrap.removeChild(card);
        })
    }

    // 只展示有评分
    const filterScoredCard1 = () => {
        let cardListWrap = document.getElementsByClassName('row')[0];
        let cardWrap = [...cardListWrap.children];
        cardWrap.forEach((card, index)=>{
            let starObj = card.getElementsByClassName('fa-star');
            if(!starObj.length || starObj[0]){
                return cardListWrap.removeChild(card);
            }
        })
    }

})();
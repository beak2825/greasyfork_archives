// ==UserScript==
// @name         虎扑屏蔽用
// @namespace    敲掉我不想看到的部分
// @version      0.3
// @description  Bonk!
// @author       路过虎扑原版的jr
// @match        *://*.hupu.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/6788/6788572.png?x-oss-process=image/resize,m_fill,w_72,h_72
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461596/%E8%99%8E%E6%89%91%E5%B1%8F%E8%94%BD%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461596/%E8%99%8E%E6%89%91%E5%B1%8F%E8%94%BD%E7%94%A8.meta.js
// ==/UserScript==

// 黑名单设置
var blacklists = [
    '阿成','成都哥','内鬼','黑泥', '测试用词',
    '白白胖胖哦',
    "不要阴阳怪气",
    '秀b2',
    'hupu_4c19370d28c9a123',
    '稻妻三板斧',
    '白术king',
    '斯卡拉姆齐夜兰',
    '17岁的单车和我',
    '苏州城外的微笑z',
    '我的花莱仕到了',
    '成都人吊打北上光',
    'Last成'];

// 判断网页元素是否含有黑名单
function checking(htmlElement) {
    for(var i = 0; i < blacklists.length; i++) {
        if(htmlElement.innerText.indexOf(blacklists[i]) !== -1) {
            return true
        }
    }
}

// bonk!
function bonking(bonkingEl, destination) {
    for(var bonk = 0; bonk < bonkingEl.length; bonk++) {
        if(checking(bonkingEl[bonk]) == true) {
            bonkingEl[bonk].closest(destination).style.display = 'none';
        }
    }
}

// 选取元素
//
var postTitle = document.querySelectorAll('.p-title');
var postAuthor = document.querySelectorAll('.post-auth');
var post = '.bbs-sl-web-post-body'
//
var commentAuthor = document.querySelectorAll('.user-base-info');
var bonkQuoting = document.querySelectorAll('.index_quote-text__HggrH');
var comment = '.post-reply-list '
//
var myMessage = ".bbs-message-web-container .my-message .content .item .right .top .nickname";
var myChat = ".personalWarp .prersonbody .prersonbodymiddle .presonListCardItem .nickNameTitle";
var bbsMessage = document.querySelectorAll(myMessage);
var bbsChat = document.querySelectorAll(myChat);
var userCard = ".personalWarp .prersonbody .prersonbodymiddle .presonListCardItem"

// 登 龙 剑
bonking(postTitle, post);
bonking(postAuthor, post);

bonking(commentAuthor, comment);
bonking(bonkQuoting, comment);

bonking(bbsMessage, '.item');
bonking(bbsChat, userCard);




// ==UserScript==
// @name         小黑盒PC网页端功能增强
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  小黑盒PC网页端跳转社区 更多功能待实现
// @match        *.xiaoheihe.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466892/%E5%B0%8F%E9%BB%91%E7%9B%92PC%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466892/%E5%B0%8F%E9%BB%91%E7%9B%92PC%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var button1 = document.createElement('button');
    button1.innerHTML = 'PC游戏--';
    button1.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/1/list/';
    };
    document.body.appendChild(button1);
 
    var button2 = document.createElement('button');
    button2.innerHTML = '盒友杂谈--';
    button2.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/7214/list/';
    };
    document.body.appendChild(button2);
 
    var button3 = document.createElement('button');
    button3.innerHTML = '沙雕日常--';
    button3.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/73907/list/';
    };
    document.body.appendChild(button3);
 
    var button4 = document.createElement('button');
    button4.innerHTML = 'roll区--';
    button4.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/486554/list/';
    };
    document.body.appendChild(button4);
 
    var button5 = document.createElement('button');
    button5.innerHTML = 'roll专区--';
    button5.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/54539/list/';
    };
    document.body.appendChild(button5);
 
    var button6 = document.createElement('button');
    button6.innerHTML = '情投一盒--';
    button6.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/416158/list/';
    };
    document.body.appendChild(button6);
 
    var button7 = document.createElement('button');
    button7.innerHTML = 'gal游戏综合区--';
    button7.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/53182/list/';
    };
    document.body.appendChild(button7);
 
    var button8 = document.createElement('button');
    button8.innerHTML = '主机游戏--';
    button8.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/23563/list/';
    };
     document.body.appendChild(button8);
 
    var button9 = document.createElement('button');
    button9.innerHTML = '数码硬件--';
    button9.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/18745/list/';
    };
     document.body.appendChild(button9);
 
    var button10 = document.createElement('button');
    button10.innerHTML = 'switch--';
    button10.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/66738/list/';
    };
     document.body.appendChild(button10);
 
    var button9 = document.createElement('button');
    button9.innerHTML = '英雄联盟--';
    button9.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/55058/list/';
    };
     document.body.appendChild(button9);
    var button = document.createElement('button');
 
    var button10 = document.createElement('button');
    button10.innerHTML = 'CS：GO--';
    button10.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/43/list/';
    };
     document.body.appendChild(button10);
    var button = document.createElement('button');
 
    var button11 = document.createElement('button');
    button11.innerHTML = '永劫无间--';
    button11.onclick = function() {
        window.location.href = 'https://www.xiaoheihe.cn/community/72984/list/';
    };
     document.body.appendChild(button11);
    var button = document.createElement('button');
 
    button.innerHTML = '回到顶部';
    button.onclick = function() {
        window.scrollTo(0, 0);
    };
    document.body.appendChild(button);
 
  
 
    function isThumbnail(element) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (width < 100 || height < 100) {
            return true;
        }
        return false;
    }
 
 
})();
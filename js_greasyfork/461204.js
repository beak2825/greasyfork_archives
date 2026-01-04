// ==UserScript==
// @name         简书屏蔽热门故事
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  简书屏蔽烦人的热门故事
// @match        https://www.jianshu.com/p/*
// @grant        none
// @license      MIT
// @author       https://greasyfork.org/users/574395-frammolz-amanda
// @downloadURL https://update.greasyfork.org/scripts/461204/%E7%AE%80%E4%B9%A6%E5%B1%8F%E8%94%BD%E7%83%AD%E9%97%A8%E6%95%85%E4%BA%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461204/%E7%AE%80%E4%B9%A6%E5%B1%8F%E8%94%BD%E7%83%AD%E9%97%A8%E6%95%85%E4%BA%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var flag_1 = false
    var flag_2 = false
    var task = setInterval(function(){
        const sections = document.getElementsByTagName('section');
        for (let i = 0; i < sections.length; i++) {
            var uls = sections[i].getElementsByTagName('ul');
            if (uls.length === 1 && sections[i].children.length === 1) {
                if (uls[0].children.length === uls[0].getElementsByTagName('li').length) {
                    sections[i].parentNode.removeChild(sections[i]);
                    flag_1 = true
                }
            }
            const h3 = sections[i].getElementsByTagName('h3')[0];
            if (h3 && h3.textContent.trim() === '热门故事') {
                sections[i].parentNode.removeChild(sections[i]);
                flag_2 = true
            }
            if (flag_1 && flag_2) clearInterval(task)
        }
    },50)
})();
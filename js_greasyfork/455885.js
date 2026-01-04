// ==UserScript==
// @name         DMBJNames
// @version      0.1
// @namespace    http://tampermonkey.net/
// @description  Change the translated DMBJ names back to pinyin
// @author       laireshi
// @match        https://merebear474765851.wordpress.com/*
// @downloadURL https://update.greasyfork.org/scripts/455885/DMBJNames.user.js
// @updateURL https://update.greasyfork.org/scripts/455885/DMBJNames.meta.js
// ==/UserScript==

const fixDMBJNames = () => {
    'use strict';
    const characters = {'Poker-Face': 'Menyouping', 'Poker-face': 'Menyouping', 'Little Brother Zhang' : 'Xiao Zhangge', 'Little Brother' : 'Xiaoge',
                'Mr. Naive' : 'Tianzhen', 'Mr. Naïve' : 'Tianzhen', 'Fatty' : 'Pangzi', 'Black Glasses' : 'Hei Yanjing', 'Black Blind' : 'Hei Xiazi',
                'Little Master Three' : 'Xiao Sanye', 'Master Three' : 'Sanye', 'Uncle Three' : 'Sanshu', 'Uncle Two' : 'Ershu',
                'Rain Village' : 'Yucun'}
    let regex, newText;
    const chapter = Array.from(document.querySelectorAll('.entry-content > p'));
    chapter.forEach(para => {
        for (let key in characters){
            regex = new RegExp(key, 'g')
            newText = para.innerHTML.replace(regex, characters[key]);
            para.innerHTML = newText;
        }
    })
}

fixDMBJNames();
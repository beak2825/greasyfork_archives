// ==UserScript==
// @name         shanbey-helper
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在【在学单词】页面添加快捷键, 进入背单词页面后全屏
// @author       wanglongbiao
// @match        https://web.shanbay.com/wordsweb/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/407871/shanbey-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/407871/shanbey-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("hashchange", () => {
        if(location.hash == '#/study?type=book'){
            document.documentElement.requestFullscreen()
            return;
        }
    }, false);
    
    if('#/words-table' != location.hash)
        return
    window.addEventListener('keydown', function(event){
        console.log(event.keyCode)
        switch(event.code){
            case 'KeyN':
                $('li:contains(下一页)').click()
                break
            case 'KeyP':
                $('li:contains(上一页)').click()
                break
            case 'KeyG':
                $('div:contains(在学单词)').click()
                break
        }
    }, true)
    // $('li:contains(下一页)').click()
})();
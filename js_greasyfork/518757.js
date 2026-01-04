// ==UserScript==
// @name         律师云学院助理
// @version      0.2
// @description  自动刷律协培训课程
// @author       yagizaMJ
// @match        https://lawschool.lawyerpass.com/course/*
// @match        https://lawschool.lawyerpass.com/center/*
// @icon         https://lawschool.lawyerpass.com/assets/images/favicon.ico
// @grant        none
// @license      yagizaMJ
// @namespace    0.1    
// @downloadURL https://update.greasyfork.org/scripts/518757/%E5%BE%8B%E5%B8%88%E4%BA%91%E5%AD%A6%E9%99%A2%E5%8A%A9%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/518757/%E5%BE%8B%E5%B8%88%E4%BA%91%E5%AD%A6%E9%99%A2%E5%8A%A9%E7%90%86.meta.js
// ==/UserScript==

function qSelector(selector) {
    return document.querySelector(selector)
};

function qSelectorAll(selector) {
    return document.querySelectorAll(selector)
};

function qXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null ).iterateNext()
};

function urlHas(text) {
    return document.location.href.indexOf(text) != -1
};



(function() {
    'use strict';


    function play() {
        if (qSelector(".prism-play-btn.playing") === null) {
            qSelector(".prism-play-btn").click()
        }
    };



    function checkBlock() {
        var btn = qSelector(".ant-modal-confirm-btns > button")
        if ( btn !== null ) {
            btn.click();
            play();
        }
    };

    function progress() {
        var progress = qSelector('div.name.pull-left > div.ng-star-inserted').innerText.split('：')[1]
        return parseInt(progress);
    }

    function check100Percent() {
        
        if ( progress() >= 99 ) {
            qSelector('.entrance').click();
        }
    };

    function setTitle() {
        var title = qSelector(".title")
        if (title !== null) {
            document.title = progress() + "% - " + title.textContent.trim().split(' ')[0];
        }
    };
    function stats() {
        var done = qSelectorAll('.text-green').length;
        var not_done = qSelectorAll('.text-yellow').length;
        qSelector('.username').innerHTML += `<br/> 共 ${done+not_done} 课，已完成 ${done} 课，未完成 ${not_done} 课 `
    }

    if (urlHas('trainPlan')){
        window.addEventListener('load', stats, false);
    }

    
    // 培训列表界面
    setInterval(function(){
        if (urlHas('trainPlan')) {
            qSelector("button.issue-btn.issue-default-btn.ng-star-inserted").click();
            var div = Array.from(qSelectorAll('.progress-num')).find( el => el.innerText == '0%');
            div.parentElement.parentElement.querySelector('a').click()
        }

    // 培训课程界面

        if (urlHas('course')) {
            setTitle();
            check100Percent();
            checkBlock();
            play();
        }
    }, 15000);

})();
// ==UserScript==
// @name         boss直聘去除已沟通脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用。boss直聘滚动新增的时候去除已经沟通的候选人。这不会改变这一次查询增加的数据，极端情况会导致一轮跟新完全不增加视图。凑合着用吧。
// @author       hilshire
// @match        *://www.zhipin.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380845/boss%E7%9B%B4%E8%81%98%E5%8E%BB%E9%99%A4%E5%B7%B2%E6%B2%9F%E9%80%9A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/380845/boss%E7%9B%B4%E8%81%98%E5%8E%BB%E9%99%A4%E5%B7%B2%E6%B2%9F%E9%80%9A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList' && mutation.addedNodes.length !== 0) {
                filterCandidate()
            }
            else if (mutation.type == 'attributes') {
                // console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document.querySelector('.sec-content.candidate-card'), config);

    filterCandidate()

    function filterCandidate() {
        var candidates = Array.from(document.querySelector('.sec-content.candidate-card').querySelectorAll('li[data-uid]'))

        if(!candidates || candidates.length === 0) return

        candidates.filter(i => i.querySelector('.btn-continue')).forEach(j => (j.style.display = 'none'))
    }

})();
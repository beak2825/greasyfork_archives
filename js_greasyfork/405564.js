// ==UserScript==
// @name         百度 icode 自动+1
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  百度内部 icode 自动+1 code review 脚本
// @author       观主
// @match        http://icode.baidu.com/repos/baidu/*/reviews/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405564/%E7%99%BE%E5%BA%A6%20icode%20%E8%87%AA%E5%8A%A8%2B1.user.js
// @updateURL https://update.greasyfork.org/scripts/405564/%E7%99%BE%E5%BA%A6%20icode%20%E8%87%AA%E5%8A%A8%2B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function start() {
        var l = document.querySelectorAll('[class^="file-tree-modify-node-"] .ant-tree-title')
        var index = 0

        function commit() {
            index++
            var lines = Array.from(document.querySelectorAll('.diff-gutter-insert')).reverse()
            console.log(lines.length)
            if(lines.length < 100) {
            for(var i in lines){
                var node = lines[i]
                node.click()
                var textarea = document.querySelector('textarea')
                delete textarea.value;
                textarea.value = 'hao';

                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, false);
                textarea.dispatchEvent(event);
                document.querySelector('[class^="comment-box-context-"] textarea + div').querySelector('a:nth-child(4)').click()
            }
                setTimeout(loop, lines.length/8*1e3)
            } else {
                setTimeout(loop, 2*1e3)
            }
        }

        function review() {
            document.querySelector('[class*="score-score-"]').click()
            var a = document.querySelectorAll('[class*="review-score-positive-"]')
            if(a.length) {
                document.querySelectorAll('[class*="review-score-positive-"]')[1].click()
                document.querySelector('button.ant-btn.etui-button-button.etui-button-size-s.etui-button-type-solid.etui-button-theme-primary').click()
            } else {
                document.querySelector('[class*="score-comment-footer-"] .etui-button-type-solid').click()
            }
        }

        function loop() {
            if(index < l.length) {
                l[index].click()
                setTimeout(commit, 800)
            } else {
                setTimeout(review, 5*1e3)
            }
        }

        loop()
    }

    var btn = document.createElement('button')
    btn.id = 'startBtn'
    btn.style.width = '129px'
    btn.style.height = '38px'
    btn.textContent = 'Start'
    btn.style.position = 'fixed'
    btn.style.right = 0
    btn.style.top = '49px'
    btn.onclick = start
    document.body.appendChild(btn)
})();
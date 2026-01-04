// ==UserScript==
// @name         jenkins
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  扩大jenkins构建时的分支面板，添加搜索功能，优化优化Build History 列表
// @author       IceRing
// @match        http://172.16.1.35:8180/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480673/jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/480673/jenkins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(document.querySelector('#gitParameterSelect')) {
        document.querySelector('#gitParameterSelect').style.width='400px';
        document.querySelector('#gitParameterSelect').style.height='400px';
        document.querySelector('#gitParameterSelect').style.overflow='auto';
        let input = document.createElement('input');
        input.style.display = 'block';
        input.style.marginBottom = '10px';
        input.style.border = '1px solid';
        input.style.outline = 'none';
        input.style.width = '400px';
        input.oninput = (e) => {
            filterHandle();
        };
        input.addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                event.stopPropagation();
                filterHandle();
            }
        });
        document.querySelector('#gitParameterSelect').parentNode.insertBefore(input,document.querySelector('#gitParameterSelect').parentElement.children[1]);
        input.focus();
        input.value = ''; // 常用分支名称，自动搜索
        let value = input.value;
        setTimeout(() => {
            filterHandle();
        },1000)
        function filterHandle() {
            let value = input.value;
            let options = document.querySelector('#gitParameterSelect').children;
            for (let option of options) {
                if (option.value.include(value)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            }
        }
    }
    function jenkins() {
        const $ = window.jQuery;
        if (!$) {
            return;
        }
        //'<a><img src="/static/f80a2d63/images/16x16/terminal.png" width="16" height="16" alt=""></a>&nbsp;'
        $('.build-row-cell').each((index, _node) => {
            const node = $(_node);
            const cmdlink = node.find('.build-status-link').attr('href');
            const ele = node.find('.pane.build-controls .build-badge');
            if (!ele.length) {
                return;
            }
            ele.prepend(`&nbsp;<a href='${cmdlink}' title='控制台输出'><img src="/static/f80a2d63/images/16x16/terminal.png" width="16" height="16" alt=""></a>&nbsp;`)
            const reg = cmdlink.replace(/console.*/, '')
            ///(?!=\/view\/.+)\d+(?!=console)/.exec(cmdlink);
            if (reg) {
                ele.prepend(`&nbsp;<a href='${reg}rebuild' title='Build with Parameters'><img src="/static/f80a2d63/images/16x16/clock.png" width="16" height="16" alt=""></a>&nbsp;`)
            }
        });
    }

    jenkins();
})();
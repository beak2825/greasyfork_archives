// ==UserScript==
// @name         iCafe Helper 简洁版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键复制iCafe单信息，形成iCode提测邮件icode信息
// @author       mzvast@gmail.com
// @match        http://newicafe.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377057/iCafe%20Helper%20%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377057/iCafe%20Helper%20%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const makeCommitMsg = (issueId, fullTitle) => {
        let scope = '';
        let title = fullTitle.replace(/\s/g,'');
        if (title.indexOf('【') !== -1 && fullTitle.indexOf('】') !== -1) {
            const matchedScope = fullTitle
            .match(/【(.*?)】/g)
            .map(t => t.match(/【(.*)】/)[1]);
            scope = `:(${matchedScope.join(',')})`;
            title = title.match(/【.*】(.*)/)[1];
        }
        return `${issueId}${title}`;
    };
    const copyText = text => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        console.log('copied:', text);
    };
    document.addEventListener(
        'click',
        e => {
            // console.log(e.target);
            if (e.target) {
                if (e.target.matches('.titleValue.showIssueView.value')) {
                    // console.log('.titleValue.showIssueView.value');
                    const fullTitle = e.target.getAttribute('title');
                    const issueId = e.target.getAttribute('data-issueid');
                    const result = makeCommitMsg(issueId, fullTitle);
                    copyText(result);
                } else if (e.target.matches('a.taskLink.titleLink')) {
                    // console.log('a.taskLink.titleLink');
                    const fullTitle = e.target.text;
                    const issueId = e.target
                    .getAttribute('href')
                    .match(/issue\/(.*)\/show/)[1];
                    const result = makeCommitMsg(issueId, fullTitle);
                    copyText(result);
                }
            }
        },
        true
    );

})();
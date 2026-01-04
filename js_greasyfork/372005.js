// ==UserScript==
// @name         iCode Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  一键复制iCafe单信息，形成Git Commit Msg,支持旧版迭代计划和工作台
// @author       mzvast@gmail.com
// @match        http://newicafe.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372005/iCode%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/372005/iCode%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const makeCommitMsg = (cardType, issueId, fullTitle) => {
        let type = /bug/i.test(cardType)?'fix':'feat';
        let scope = '';
        let title = fullTitle.replace(/\s/g,'');
        if (title.indexOf('【') !== -1 && fullTitle.indexOf('】') !== -1) {
            const matchedScope = fullTitle
            .match(/【(.*?)】/g)
            .map(t => t.match(/【(.*)】/)[1]);
            scope = `:(${matchedScope.join(',')})`;
            title = title.match(/【.*】(.*)/)[1];
        }
        return `${type}${scope}:[${issueId}]${title}`;
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
            console.log(e.target);
            if (e.target) {
                if (e.target.matches('.titleValue.showIssueView.value')) {
                    // console.log('.titleValue.showIssueView.value');
                    const type = e.target.parentElement.parentElement.parentElement.nextElementSibling.children[0].children[0].textContent;
                    const fullTitle = e.target.getAttribute('title');
                    const issueId = e.target.getAttribute('data-issueid');
                    const result = makeCommitMsg(type, issueId, fullTitle);
                    copyText(result);
                } else if (e.target.matches('a.taskLink.titleLink')) {
                    // console.log('a.taskLink.titleLink');
                    const type = e.target.parentElement.parentElement.nextElementSibling.childNodes[1].textContent.replace(/\s/g,'');
                    const fullTitle = e.target.text;
                    const issueId = e.target
                    .getAttribute('href')
                    .match(/issue\/(.*)\/show/)[1];
                    const result = makeCommitMsg(type, issueId, fullTitle);
                    copyText(result);
                }
            }
        },
        true
    );

})();
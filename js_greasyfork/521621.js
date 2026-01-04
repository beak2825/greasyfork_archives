// ==UserScript==
// @name         职培考试拦截JS文件并自动答题（手动下一题）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  拦截JS文件，自动选择正确答案并点击，但不会自动跳转下一题。手动控制下一步操作。
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521621/%E8%81%8C%E5%9F%B9%E8%80%83%E8%AF%95%E6%8B%A6%E6%88%AAJS%E6%96%87%E4%BB%B6%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E6%89%8B%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521621/%E8%81%8C%E5%9F%B9%E8%80%83%E8%AF%95%E6%8B%A6%E6%88%AAJS%E6%96%87%E4%BB%B6%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E6%89%8B%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 替换规则定义
    const replacements = [
        {
            search: 'for(var s=0;s<e.topicList2.length;s++)"单选题"==e.topicList2[s].ttop010?e.danx.push(e.topicList2[s]):"不定项选择题"==e.topicList2[s].ttop010?e.duox.push(e.topicList2[s]):"判断题"==e.topicList2[s].ttop010?e.pand.push(e.topicList2[s]):"填空题"==e.topicList2[s].ttop010?e.tinak.push(e.topicList2[s]):"简答题"==e.topicList2[s].ttop010?e.jiand.push(e.topicList2[s]):e.zuh.push(e.topicList2[s]);',
            replace: `
            for(var s=0;s<e.topicList2.length;s++) {
                var question = e.topicList2[s];
                if ("单选题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.danx.push(question);
                } else if ("不定项选择题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022.split(""));
                    e.duox.push(question);
                } else if ("判断题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.pand.push(question);
                } else if ("填空题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022.split("$$"));
                    e.tinak.push(question);
                } else if ("简答题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.jiand.push(question);
                } else {
                    e.zuh.push(question);
                }
            }`
        },
        {
            search: '.ttop016',
            replace: '.ttop022'
        }
    ];

    let interceptedFiles = [];

    // 修改JS文件内容的函数
    function modifyJSContent(text, url) {
        let modifiedText = text;

        replacements.forEach(replacement => {
            if (modifiedText.includes(replacement.search)) {
                modifiedText = modifiedText.split(replacement.search).join(replacement.replace);
                console.log(`替换内容：${replacement.search} -> ${replacement.replace}`);
            }
        });

        interceptedFiles.push({ url, content: modifiedText });
        return modifiedText;
    }

    // 自动答题功能
    function autoAnswer() {
        const radiogroup = document.querySelector('[role="radiogroup"]');
        if (radiogroup) {
            console.log('找到题目容器，准备答题');
            const options = radiogroup.querySelectorAll('[role="radio"]');
            const correctOption = Array.from(options).find(option => option.getAttribute('aria-checked') === 'true');

            if (correctOption) {
                console.log('找到正确答案，点击:', correctOption.innerText || correctOption.textContent);
                correctOption.click();
                correctOption.dispatchEvent(new Event('click', { bubbles: true }));
            } else {
                console.log('未找到正确答案，请手动检查此题');
            }
        } else {
            console.log('未找到题目容器，请手动检查');
        }
    }

    // 监听页面变化并自动答题
    const observer = new MutationObserver(() => {
        setTimeout(() => {
            autoAnswer();
        }, 1); // 页面变化后延迟执行答题
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 拦截 XMLHttpRequest
    (function (open, send) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            open.call(this, method, url, async, user, password);
        };

        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200 && this._url.endsWith('.js')) {
                    const modifiedText = modifyJSContent(this.responseText, this._url);
                    if (modifiedText) {
                        Object.defineProperty(this, 'responseText', { value: modifiedText });
                    }
                }
            });
            send.call(this, body);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

    // 拦截 fetch 请求
    (function (fetch) {
        window.fetch = function () {
            return fetch.apply(this, arguments).then(response => {
                if (response.url.endsWith('.js')) {
                    return response.clone().text().then(text => {
                        const modifiedText = modifyJSContent(text, response.url);
                        if (modifiedText) {
                            return new Response(modifiedText, {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        }
                        return response;
                    });
                }
                return response;
            });
        };
    })(window.fetch);

    // 拦截动态 <script> 标签
    (function (createElement) {
        const originalCreateElement = document.createElement;
        document.createElement = function () {
            const element = originalCreateElement.apply(this, arguments);
            if (arguments[0].toLowerCase() === 'script') {
                Object.defineProperty(element, 'src', {
                    set: function (url) {
                        if (url.endsWith('.js')) {
                            fetch(url).then(response => response.text()).then(text => {
                                const modifiedText = modifyJSContent(text, url);
                                if (modifiedText) {
                                    const blob = new Blob([modifiedText], { type: 'text/javascript' });
                                    const newUrl = URL.createObjectURL(blob);
                                    element.setAttribute('src', newUrl);
                                }
                            });
                        } else {
                            element.setAttribute('src', url);
                        }
                    }
                });
            }
            return element;
        };
    })(document.createElement);
})();
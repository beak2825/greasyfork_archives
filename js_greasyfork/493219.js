// ==UserScript==
// @name         名言彩带
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display a random quote with each character in a different color at the top center of the Discourse forum and change it every 3 seconds, without covering menu options
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493219/%E5%90%8D%E8%A8%80%E5%BD%A9%E5%B8%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/493219/%E5%90%8D%E8%A8%80%E5%BD%A9%E5%B8%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const quotes = [
        "人生就是不断放下的过程。- 佚名",
        "我们是我们选择成为的人。- 简·奥斯汀",
        "一切皆有可能，只要你有勇气去追求。- 卡门·拉佩塔",
        "事常与人违，事总在人为。- 范仲淹",
        "人的大脑和肢体一样，多用则灵，不用则废。- 裴多菲",
        "天才只意味着终身不懈的努力。- 高尔基",
        "软件就像性一样，免费时更好。- 林纳斯·托瓦兹",
        "读万卷书，行万里路。- 董其昌",
        "不为失败找理由，要为成功找方法。- 张瑞敏",
        "黑夜无论怎样悠长，白昼总会到来。- 狄更斯",
        "哪里有阴影，哪里就有光。- 雨果",
        "人的一生是短的，但如果卑劣地过这一生，就太长了。- 莎士比亚",
        "天行健，君子以自强不息。- 《周易·乾·象》",
        "地势坤，君子以厚德载物。- 《周易·乾·象》",
        "我喜欢做的事，我就欣然而为。- 普京",
        "在我的力量还不足的时候，我就得忍让，违心的忍让!- 成吉思汗",
        "只有经历过地狱般的磨砺，才能练就创造天堂的力量- 泰戈尔",
        "生活不可能像你想象的那么好，但也不会像你想象的那么糟。- 莫泊桑",
        "不管怎么样，明天又是新的一天。- 《飘》玛格丽特·米切尔"
    ];

    const quoteElement = document.createElement('div');
    quoteElement.style.position = 'fixed';
    quoteElement.style.top = '30px';
    quoteElement.style.left = '50%';
    quoteElement.style.transform = 'translateX(-50%)';
    quoteElement.style.maxWidth = '80%';
    quoteElement.style.textAlign = 'center';
    quoteElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    quoteElement.style.fontSize = '16px';
    quoteElement.style.padding = '5px 0';
    quoteElement.style.fontWeight = 'bold';
    quoteElement.style.zIndex = '1000';
    quoteElement.style.pointerEvents = 'none';
    document.body.appendChild(quoteElement);

    function displayQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.innerHTML = '';
        for (let char of randomQuote) {
            const charElement = document.createElement('span');
            charElement.textContent = char;
            charElement.style.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
            quoteElement.appendChild(charElement);
        }
    }

    displayQuote(); // Display the first quote immediately
    setInterval(displayQuote, 3000); // Change quote every 3 seconds
})();
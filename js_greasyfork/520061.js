// ==UserScript==
// @name         讨论区投票
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  为Quicker网站的讨论区添加投票功能
// @author       HDG
// @license      MIT
// @icon         data:image/png;base64,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
// @match        https://getquicker.net/Common/Topics/ViewTopic/*
// @match        https://getquicker.net/QA/Question/*
// @downloadURL https://update.greasyfork.org/scripts/520061/%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520061/%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const floors = document.querySelectorAll(".p-3 .media");
    floors.forEach(floor => {
        const text = floor.querySelector(".answer-body").innerText;
        var match = text.match(/^\s*【投票】\s*\n(.*?)\s*\n【说明】\s*\n(.*?)\s*\n【选项】\s*\n((?:\d+-[^\s].{0,19}\s*\n?){1,9})$/);
        if (match) {
            const [, title, description, options] = match;
            const optionsRegex = /\d+-([^\n]+)/g;
            const optionsMatches = options.match(optionsRegex);
            const optionsArray = optionsMatches.map(option => {
                return { number: option.match(/\d+/)[0], content: option.split('-')[1].trim() };
            });

            const author = floor.querySelector(".username .user-link").href;
            const innerFloors = floor.querySelectorAll(".hover-container.d-flex");
            let votes = {};
            innerFloors.forEach(iFloor => {
                const iText = iFloor.querySelector(".flex-grow-1 .user-content").innerText;
                var iMatch = iText.match(/^【投给】(\d)$/);
                if (iMatch) {
                    const QASelector = ".pb-1 .user-link";
                    const TopicSelector = "div.font12 > .user-link";
                    var currectSelector = window.location.href.match(/https:\/\/getquicker\.net\/QA\/Question\/.*/) ? QASelector : TopicSelector;
                    const voter = iFloor.querySelector(currectSelector).href;
                    const option = iMatch[1];
                    if (!votes.hasOwnProperty(voter) && voter != author) {
                        votes[voter] = option;
                    }
                    removeItem(iFloor);
                }
            });

            const votingInterface = document.createElement('div');
            votingInterface.className = 'voting-interface';
            votingInterface.innerHTML = `
            <h4 calss="voteTitle">${title}</h4>
            <p>${description}</p>
            <hr>
            <ol>
                ${optionsArray.map(option => `<li data-option="${option.number}" floor="${floor.querySelector(".floor-parent a").innerText.slice(1)}">${option.content}（${Object.values(votes).filter(x => x == option.number).length} Vote）</li>`).join('')}
            </ol>
            <hr>
            <p>共有${Object.keys(votes).length}位网友参与</p>
        `;
            const answerBody = floor.querySelector(".answer-body");
            answerBody.innerHTML = '';
            answerBody.appendChild(votingInterface);

            const optionsList = votingInterface.querySelectorAll('li');
            optionsList.forEach(option => {
                option.addEventListener('click', function () {
                    const option = this.getAttribute('data-option');
                    const floor = floors[this.getAttribute('floor') - 1];
                    floor.querySelector(".cursor-pointer").click();
                    setTimeout(function () {
                        const textbox = document.querySelector(".card-block");
                        triggerInputEvent(textbox, `【投给】${option}`);
                    }, 100);
                });
            });
        }
    });
})();

function removeItem(element) {
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
}

function triggerInputEvent(element, text) {
    element.textContent = text;
    let event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
}
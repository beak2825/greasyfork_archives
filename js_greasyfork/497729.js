// ==UserScript==
// @name         GameTame Points And Duration Collector
// @name:zh-CN   GameTame 分数及时长整理器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Collect, sort, and display points and duration from GameTame Your Surveys for GameTame, with quick jump to the survey.
// @description:zh-cn   收集并排序 GameTame Your Surveys 中的调查分数和时长，并提供快速跳转到所选调查。
// @author       37
// @match        https://gametame.com/your-surveys/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497729/GameTame%20Points%20And%20Duration%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/497729/GameTame%20Points%20And%20Duration%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 0;
        background-color: transparent;
    }
    .tab-header {
        display: flex;
        border-bottom: 1px solid #ccc;
    }
    .tab-header button {
        flex: 1;
        padding: 5px;
        cursor: pointer;
        background-color: #f1f1f1;
        border: none;
        outline: none;
    }
    .tab-header button.active {
        background-color: #ddd;
    }
    .tab-content {
        display: none;
    }
    .tab-content.active {
        display: block;
    }
    `;
    document.head.appendChild(style);

    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '20%';
    box.style.right = '10px';
    box.style.width = '200px';
    box.style.backgroundColor = '#ffffff60';
    box.style.border = '1px solid #00000060';
    box.style.padding = '10px';
    box.style.zIndex = '10000000';
    box.style.overflowY = 'scroll';
    box.style.height = '60%';
    box.classList.add('custom-scrollbar');
    document.body.appendChild(box);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '▲';
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '5px';
    toggleButton.style.right = '5px';
    toggleButton.style.padding = '0';
    toggleButton.style.border = 'none';
    toggleButton.style.backgroundColor = '#9e9e9e';
    toggleButton.style.color = 'white';
    box.appendChild(toggleButton);

    const title = document.createElement('h2');
    title.textContent = 'Collector';
    title.style.fontSize = '16px';
    title.style.margin = '0 0 10px 0';
    title.style.textAlign = 'center';
    box.appendChild(title);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    box.appendChild(contentDiv);

    const tabHeader = document.createElement('div');
    tabHeader.className = 'tab-header';
    contentDiv.appendChild(tabHeader);

    const pointsTabButton = document.createElement('button');
    pointsTabButton.textContent = 'Points';
    pointsTabButton.className = 'active';
    tabHeader.appendChild(pointsTabButton);

    const durationTabButton = document.createElement('button');
    durationTabButton.textContent = 'Duration';
    tabHeader.appendChild(durationTabButton);

    const pointsContent = document.createElement('div');
    pointsContent.className = 'tab-content active';
    contentDiv.appendChild(pointsContent);

    const durationContent = document.createElement('div');
    durationContent.className = 'tab-content';
    contentDiv.appendChild(durationContent);

    toggleButton.onclick = function() {
        if (box.classList.contains('collapsed')) {
            box.classList.remove('collapsed');
            box.style.height = '60%';
            box.style.overflowY = 'scroll';
            toggleButton.textContent = '▲';
            contentDiv.style.display = 'block';
        } else {
            box.classList.add('collapsed');
            box.style.height = '';
            box.style.overflowY = 'hidden';
            toggleButton.textContent = '▼';
            contentDiv.style.display = 'none';
        }
    };

    pointsTabButton.onclick = function() {
        pointsTabButton.classList.add('active');
        durationTabButton.classList.remove('active');
        pointsContent.classList.add('active');
        durationContent.classList.remove('active');
    };

    durationTabButton.onclick = function() {
        durationTabButton.classList.add('active');
        pointsTabButton.classList.remove('active');
        durationContent.classList.add('active');
        pointsContent.classList.remove('active');
    };

    function updatePointsContent(pointsMap) {
        while (pointsContent.firstChild) {
            pointsContent.removeChild(pointsContent.firstChild);
        }

        const sortedPoints = Array.from(pointsMap.entries()).sort((a, b) => b[0] - a[0]);

        sortedPoints.forEach(([point, elements]) => {
            const p = document.createElement('p');
            p.textContent = `${point} Points`;

            elements.forEach((el, index) => {
                const link = document.createElement('a');
                link.textContent = ` (${index + 1})`;
                link.href = "#";
                link.style.marginLeft = '5px';
                link.onclick = function(event) {
                    event.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.style.border = "2px solid red";
                    setTimeout(() => el.style.border = "", 2000);
                };
                p.appendChild(link);
            });

            pointsContent.appendChild(p);
        });
    }

    function updateDurationContent(durationMap) {
        while (durationContent.firstChild) {
            durationContent.removeChild(durationContent.firstChild);
        }

        const sortedDurations = Array.from(durationMap.entries()).sort((a, b) => b[0] - a[0]);

        sortedDurations.forEach(([duration, elements]) => {
            const p = document.createElement('p');
            p.textContent = `${duration} Minutes`;

            elements.forEach((el, index) => {
                const link = document.createElement('a');
                link.textContent = ` (${index + 1})`;
                link.href = "#";
                link.style.marginLeft = '5px';
                link.onclick = function(event) {
                    event.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.style.border = "2px solid blue";
                    setTimeout(() => el.style.border = "", 2000);
                };
                p.appendChild(link);
            });

            durationContent.appendChild(p);
        });
    }

    // Points
    const pointsMap = new Map();
    document.querySelectorAll('a.btn.btn-success.btn-sm').forEach(a => {
        const text = a.textContent.trim();
        const pointValue = parseFloat(text.split(' ')[0]);
        if (pointsMap.has(pointValue)) {
            pointsMap.get(pointValue).push(a);
        } else {
            pointsMap.set(pointValue, [a]);
        }
    });

    // Duration
    const durationMap = new Map();
    document.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        const match = text.match(/Estimated Completion Time:\s*(\d+)\s*Minutes/);
        if (match) {
            const durationValue = parseInt(match[1], 10);
            if (durationMap.has(durationValue)) {
                durationMap.get(durationValue).push(p);
            } else {
                durationMap.set(durationValue, [p]);
            }
        }
    });

    updatePointsContent(pointsMap);
    updateDurationContent(durationMap);

})();

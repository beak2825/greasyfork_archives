// ==UserScript==
// @name         GITHUBSTAR: GitHub互赞互粉助手
// @description  GitHub互赞、互粉工具,帮助开发者快速积累Star和关注者。
// @namespace    http://githubstar.pro
// @version      1.0.0
// @author       githubstar
// @match        *://*/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/529914/GITHUBSTAR%3A%20GitHub%E4%BA%92%E8%B5%9E%E4%BA%92%E7%B2%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529914/GITHUBSTAR%3A%20GitHub%E4%BA%92%E8%B5%9E%E4%BA%92%E7%B2%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    function initGithubstarAssistant() {
        const githubstarAssistant = document.createElement('div');
        githubstarAssistant.style.cssText = `
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #fff8e1, #fffbeb);
        padding: 12px;
        border-radius: 0 5px 5px 0;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        `;

        const closeAssistantBtn = document.createElement('div');
        closeAssistantBtn.innerHTML = '✕';
        closeAssistantBtn.style.cssText = `
        position: absolute;
        top: -15px;
        right: -15px;
        width: 30px;
        height: 30px;
        background-color: #fef3c7;
        color: #92400e;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        closeAssistantBtn.onclick = () => document.body.removeChild(githubstarAssistant);

        const assistantFeatures = [
            { name: '互赞大厅', url: 'https://githubstar.pro/zh-CN/repo/star', desc: '快速获取Star' },
            { name: '互粉大厅', url: 'https://githubstar.pro/zh-CN/follow', desc: '扩展开发者人脉' }
        ];

        githubstarAssistant.appendChild(closeAssistantBtn);

        assistantFeatures.forEach(feature => {
            const featureBtn = document.createElement('button');
            featureBtn.innerHTML = feature.name;
            featureBtn.style.cssText = `
                display: block;
                width: 100%;
                margin: 8px 0;
                background-color: #fffbeb;
                color: #713f12;
                border: none;
                border-radius: 4px;
                padding: 10px;
                cursor: pointer;
                text-align: left;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            `;

            featureBtn.onmouseenter = function() {
                this.style.transform = 'translateX(5px)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            };

            featureBtn.onmouseleave = function() {
                this.style.transform = 'translateX(0)';
                this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            };

            featureBtn.onclick = () => window.open(feature.url, '_blank');

            const featureTooltip = document.createElement('span');
            featureTooltip.textContent = feature.desc;
            featureTooltip.style.cssText = `
                visibility: hidden;
                width: 120px;
                background-color: #92400e;
                color: #fef3c7;
                text-align: center;
                border-radius: 4px;
                padding: 5px;
                position: absolute;
                z-index: 1;
                top: 50%;
                left: 105%;
                margin-top: -15px;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            featureBtn.appendChild(featureTooltip);

            featureBtn.onmouseover = () => {
                featureTooltip.style.visibility = 'visible';
                featureTooltip.style.opacity = '1';
            };

            featureBtn.onmouseout = () => {
                featureTooltip.style.visibility = 'hidden';
                featureTooltip.style.opacity = '0';
            };

            githubstarAssistant.appendChild(featureBtn);
        });

        document.body.appendChild(githubstarAssistant);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGithubstarAssistant);
    } else {
        initGithubstarAssistant();
    }
})();
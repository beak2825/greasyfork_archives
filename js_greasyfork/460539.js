// ==UserScript==
// @name         豆沙绿护眼模式Plus
// @version      4.3
// @description  改网页背景色为豆沙绿，支持按域名禁用
// @author       DeepSeek
// @run-at       document-start
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/460539/%E8%B1%86%E6%B2%99%E7%BB%BF%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/460539/%E8%B1%86%E6%B2%99%E7%BB%BF%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FPlus.meta.js
// ==/UserScript==

// 初始化禁用域名列表
let disabledDomains = GM_getValue('disabledDomains', []);
const currentDomain = window.location.hostname;
const isDisabled = disabledDomains.includes(currentDomain);

// 根据当前状态注册单一菜单命令
if (isDisabled) {
    GM_registerMenuCommand('在此域名启用护眼模式', () => {
        disabledDomains = disabledDomains.filter(domain => domain !== currentDomain);
        GM_setValue('disabledDomains', disabledDomains);
        location.reload();
    });
} else {
    GM_registerMenuCommand('在此域名禁用护眼模式', () => {
        disabledDomains.push(currentDomain);
        GM_setValue('disabledDomains', disabledDomains);
        location.reload();
    });
}

// 检查是否启用夜间模式
function isNightMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

if (!isNightMode() && !isDisabled) {
    function background() {
        let elementList = document.querySelectorAll('*');
        for (let i = 0; i < elementList.length; i++) {   
            if (!(elementList[i].matches('[class*="player"] > *') || 
                elementList[i].matches('.video > *'))) {
                let srcBgColor = window.getComputedStyle(elementList[i]).backgroundColor;
                let splitArray = srcBgColor.match(/[\d\.]+/g);
                if (splitArray) {
                    let r = parseInt(splitArray[0], 10),
                        g = parseInt(splitArray[1], 10),
                        b = parseInt(splitArray[2], 10);
                    if (r > 150 && g > 150 && b > 150) {
                        elementList[i].style.backgroundColor = '#C7EDCC';
                    }
                }
            }
        }
        // 更改链接颜色
        let links = document.querySelectorAll("a[href^='http']:not(.button)");
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = "#40933C";
            links[i].style.textDecoration = "none";
        }
    }
    
    background();
    window.onload = function() {
        background();
    };

    setTimeout(function() {
        let observer = new MutationObserver(function(mutations) {
            background();
            window.setTimeout(background2, 50);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 5);

    function background2() {
        let elements = document.querySelectorAll("DIV#gb-main,DIV.url.clearfix,DIV.nav-bar-v2-fixed > * > *:not(div.nav-bar-bottom),DIV.se-page-hd-content");
        elements.forEach(element => {
            element.style.backgroundColor = "#C7EDCC";
        });
    }

    background2();
    window.setTimeout(background2, 100);
}
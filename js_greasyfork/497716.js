// ==UserScript==
// @name        github commits { display: calendar; }
// @namespace   leizingyiu.net
// @include     /^https:\/\/github.com\/[^/]+\/[^/]+\/(commits|commit)\/.*/
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @version     2024.06.12.17:44
// @author      leizingyiu
// @license      GNU GPLv3
// @description show github commits as calendar
// @downloadURL https://update.greasyfork.org/scripts/497716/github%20commits%20%7B%20display%3A%20calendar%3B%20%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/497716/github%20commits%20%7B%20display%3A%20calendar%3B%20%7D.meta.js
// ==/UserScript==

/* 
history : 2024.06.04.01.26.04 : init
2024.06.12.17:44: add zh support ; fixed margin style ;
*/
const is_zh = detectBrowserLanguage().indexOf('zh') != -1;

function detectBrowserLanguage() {
    var language;

    if (navigator.languages && navigator.languages.length) { // Chrome, Firefox, IE11+
        language = navigator.languages[0];
    } else if (navigator.language) { // Modern browsers
        language = navigator.language;
    } else if (navigator.userLanguage) { // IE11-
        language = navigator.userLanguage;
    }

    return language;
}


function getDayOfWeek(dateString) {
    const days = [0, 1, 2, 3, 4, 5, 6];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return (days[dayIndex] + 6) % 7;
}


function addCSS(url, id, removeReg) {
    'use strict';

    if (document.getElementById(id) !== null) { return; }
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            if (response.status === 200) {
                var style = document.createElement('style');
                style.id = id;
                style.textContent = response.responseText.replace(removeReg, '');
                document.head.appendChild(style);
            } else {
                console.error('Failed to load CSS file:', response.statusText);
            }
        },
        onerror: function (error) {
            console.error('Error loading CSS file:', error);
        }
    });
}

function yiu_github_commits_calendar() {


    console.log('yiu-github-calendar start');

    addCSS('https://userstyles.world/api/style/16743.user.css', 'yiu-github-commits-calendar-style', /(@[^{\n]*\{\n)|(\}(?![\n\r]))/g);

    let vIdx = 0, phIdx = 7, nowHIdx = 0, startHIdx = 7;
    [...document.querySelectorAll(".mb-3 .Timeline-Item")].map((item, idx, arr) => {
        const days = is_zh ?
            ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"] :
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        let date = item.querySelector("h3").innerText.replace("Commits on ", "");

        let hIdx = getDayOfWeek(date); // 横向序号

        if (hIdx >= phIdx) { // 如果当前序号大于上一个  , 说明这里换行

            vIdx += 1;
            nowHIdx = 0;
            item.classList.add("clearFloat");

            startHIdx = 7;
        }

        startHIdx = hIdx < startHIdx ? hIdx : startHIdx;




        item.querySelector("h3").innerText =
            item.querySelector("h3").innerText.replace("Commits on ", "");
        item.setAttribute('yiu-github-calendar-day', `${days[hIdx]}`);
        item.querySelector("h3").setAttribute('yiu-github-calendar-day', `${days[hIdx]}`);


        Object.entries({
            "--yiu-github-calendar-offset": hIdx - nowHIdx,
            "--yiu-github-calendar-day": hIdx
        }).map(([k, v], _idx, _arr) => {
            item.style.setProperty(k, v);
            item.nextElementSibling.style.setProperty(k, v);
        });

        item.setAttribute("yiu-github-calendar-row", vIdx);

        nowHIdx += 1;

        phIdx = hIdx;


        if (idx == arr.length - 1) {
            [...document.querySelectorAll(`[yiu-github-calendar-row="${vIdx}"]`)].map(
                (i) => {
                    i.style.setProperty("--yiu-github-calendar-move", nowHIdx);
                    i.nextElementSibling.style.setProperty("--yiu-github-calendar-move", nowHIdx);
                },
            );
        }

    });
    console.log('yiu-github-calendar end ');
}





const main = () => {
    yiu_github_commits_calendar();
};

(function () {
    /* from https://greasyfork.org/zh-CN/scripts/434592 */
    'use strict';
    /**
     * 在浏览器窗口大小改变时自动重新定位设置菜单
     */
    window.onresize = function () {
        // 监听窗口大小改变
        main();
    }
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    document.addEventListener('pjax:success', function () {
        // 由于 GitHub 使用 pjax 而不是页面跳转的方式在仓库内导航，因此将 main 函数绑定到 pjax 监听器上
        window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('locationchange', function () {
        console.log('locationchange!');
        main();
    });
    main();
})();

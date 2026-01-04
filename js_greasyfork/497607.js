// ==UserScript==
// @name         北京市图书馆书籍信息自动展开|可预约馆藏地高亮标注
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动高亮显示能预约的馆藏地书籍，并高亮显示馆藏地标签
// @license      MIT
// @author       lediet
// @match        https://primo.clcn.net.cn/primo_library/libweb/action/display.do*
// @match        https://primo.clcn.net.cn/primo_library/libweb/action/search.do*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497607/%E5%8C%97%E4%BA%AC%E5%B8%82%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%B9%A6%E7%B1%8D%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%7C%E5%8F%AF%E9%A2%84%E7%BA%A6%E9%A6%86%E8%97%8F%E5%9C%B0%E9%AB%98%E4%BA%AE%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497607/%E5%8C%97%E4%BA%AC%E5%B8%82%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%B9%A6%E7%B1%8D%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%7C%E5%8F%AF%E9%A2%84%E7%BA%A6%E9%A6%86%E8%97%8F%E5%9C%B0%E9%AB%98%E4%BA%AE%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const highlightClass = 'highlight-reserve';
    const highlightTitleClass = 'highlight-title';

    // 添加高亮显示的CSS样式
    GM_addStyle(`
        .${highlightClass} {
            background-color: #FF0000 !important;
            border: 2px solid #FF0000 !important;
        }
        .${highlightTitleClass} {
            background-color: #FFA07A !important; /* 浅红色 */
            border: 2px solid #FFA07A !important;
        }
    `);

    // 切换到“馆藏地”标签
    function clickLocationsTab() {
        const locationsTab = document.querySelector('li#exlidResult0-LocationsTab a');
        if (locationsTab) {
            locationsTab.click();
            return true;
        }
        return false;
    }

    // 将所有 EXLLocationSub 修改为 EXLLocationSubSelected
    function selectAllLocationSubs() {
        const subDivs = document.querySelectorAll('div.EXLLocationSub');
        subDivs.forEach(div => {
            div.className = 'EXLLocationSubSelected';
        });
    }

    // 批量展开所有馆藏地
    function expandAllLocations(callback) {
        const expandLinks = document.querySelectorAll('a.EXLLocationsIcon');
        const linksCount = expandLinks.length;
        console.log(`找到 ${linksCount} 个 EXLLocationsIcon 链接`);

        expandLinks.forEach((link, index) => {
            setTimeout(() => {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                link.dispatchEvent(event);

                console.log(`点击了第 ${index + 1} 个 EXLLocationsIcon 链接`);

                // 如果所有链接都已点击完毕，调用回调函数
                if (index === linksCount - 1) {
                    console.log('所有馆藏地已展开');
                    callback();
                }
            }, index * 80); // 每个链接点击之间间隔80毫秒
        });
    }

    // 高亮显示可预约的馆藏地书籍和馆藏地标签
    function highlightHoldings() {
        const targetSelector = 'li.EXLLocationTableActionsFirstItem';
        const holdings = document.querySelectorAll(targetSelector);
        console.log(`找到 ${holdings.length} 个预约请求状态元素`);
        let hasReservation = false;

        holdings.forEach(holding => {
            if (holding.innerText.trim() === '预约') {
                hasReservation = true;
                console.log('Found reservation option at:', holding);
                const parentRow = holding.closest('tr');
                if (parentRow) {
                    parentRow.classList.add(highlightClass);
                    console.log('父行已高亮');
                }
                let summaryElement = parentRow.closest('td.EXLSummary');
                if (summaryElement) {
                    summaryElement.classList.add(highlightTitleClass);
                    console.log('父级 EXLSummary 已高亮');
                }
            }
        });

        if (!hasReservation) {
            alert('无可预约');
            console.log('无可预约');
        }
    }

    // 延迟加载后执行操作
    function delayedAction(delayTime) {
        setTimeout(() => {
            selectAllLocationSubs();
            expandAllLocations(() => {
                setTimeout(highlightHoldings, 2000); // 2秒延迟以确保展开内容加载完成
            });
        }, delayTime); // 延迟时间以确保标签切换内容加载完成
    }

    window.addEventListener('load', function() {
        if (window.location.href.includes('display.do')) {
            if (clickLocationsTab()) {
                delayedAction(1000); // 1秒延迟
            }
        } else if (window.location.href.includes('search.do')) {
            const locationsTabs = document.querySelectorAll('li.EXLLocationsTab a');
            console.log(`找到 ${locationsTabs.length} 个馆藏地标签`);
            locationsTabs.forEach(tab => {
                console.log('点击馆藏地标签:', tab);
                tab.click();
            });

            delayedAction(3000); // 3秒延迟
        }
    }, false);
})();

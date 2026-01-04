// ==UserScript==
// @name         分析双色球
// @author       monat151
// @license      CC BY-ND
// @namespace    https://greasyfork.org/zh-CN/users/325815-monat151
// @version      1.0.0
// @description  根据查询到的双色球开奖信息分析历代频次最高的中奖号码
// @match        https://datachart.500star.com/ssq/history/history.shtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=500star.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526353/%E5%88%86%E6%9E%90%E5%8F%8C%E8%89%B2%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/526353/%E5%88%86%E6%9E%90%E5%8F%8C%E8%89%B2%E7%90%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$

    function getTopNFrequentElements(arr, N = 10) {
        const frequencyMap = {}
        // 统计每个字符串的出现频次
        arr.forEach(item => {
            frequencyMap[item] = (frequencyMap[item] || 0) + 1
        })
        // 将频率数据转换成数组，并按频率排序
        const sortedByFrequency = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1]).slice(0, N)
        return sortedByFrequency.map(([item, count]) => item/*({ item, count })*/)
    }

    setTimeout(() => {
        const anaBtn = document.createElement('button')
        anaBtn.innerHTML = '分析'
        anaBtn.addEventListener('click', () => {
            const reds = [], blues = []
            $('td.t_cfont2').each(function() {
                const red = $(this).text().trim()
                if (red) reds.push(red)
            })
            $('td.t_cfont4').each(function() {
                const blue = $(this).text().trim()
                if (blue) blues.push(blue)
            })
            console.log('reds:', reds, '\nblues:', blues)
            const top10Reds = getTopNFrequentElements(reds, 10)
            const top3Blues = getTopNFrequentElements(blues, 3)
            alert(`最高频率的红球：${top10Reds.join(', ')}\n最高频率的蓝球：${top3Blues.join(', ')}`)
        })
        $('div#content4')[0].appendChild(anaBtn)
    }, 500)
})();
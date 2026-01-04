// ==UserScript==
// @name         获取指定项目的工时
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  获取指定项目的工时，内部用
// @author       You
// @match        https://teamwork.tongdun.me/myWork/manHour/submit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongdun.me
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.0/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444187/%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E9%A1%B9%E7%9B%AE%E7%9A%84%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444187/%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E9%A1%B9%E7%9B%AE%E7%9A%84%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fetchDetail = (date, projectCode) => {
        return fetch(`https://teamwork.tongdun.me/api/my_work/man_hour/detail_v2?date=${date}&t=${new Date().getTime()}`, {
            "method": "GET",
            "credentials": "include"
        }).then(res => res.json())
            .then((response) => {
            if (response.success) {
                const data = response.data?.detailList?.find((item) => item?.projectId?.toString() === projectCode)

                if (data) {
                    return data.hourCount;
                }
            }
        });
    }

    const fetchDetailListFromTargetDate = async (startDate, endDate, projectCode) => {
        let startDay = dayjs(startDate)
        const endDay = dayjs(endDate)
        const result = []
        let index = 0

        alert('开始获取数据')

        while(!startDay.isAfter(endDay, 'day')) {
            const data = await fetchDetail(startDay.format('YYYY-MM-DD'), projectCode)

            result[index] = data

            startDay = startDay.add(1, 'day')
            index += 1
        }

        alert('获取数据完毕')

        new ClipboardJS('#hack-btn', {
            text: function(trigger) {
                return result.join('	');
            }
        })
        alert('点击按钮复制文本')

        console.log(result.join('	'))
    }

    const init = () => {
        const button = document.createElement('button')
        const copyButton = document.createElement('button')

        copyButton.id = 'hack-btn'
        copyButton.innerHTML = '复制结果'
        copyButton.style.position = 'absolute'
        copyButton.style.right = '140px'
        copyButton.style.top = '10px'
        button.innerHTML = '获取指定项目工时'
        button.style.position = 'absolute'
        button.style.right = '10px'
        button.style.top = '10px'
        button.addEventListener('click', () => {
            const input = prompt('输入开始日期、结束日期和项目代码，用英文逗号隔开。示例：2022-1-2,2022-2-2,116455')
            const [startDate, endDate, projectCode] = input.split(',')

            fetchDetailListFromTargetDate(startDate, endDate, projectCode)
        })
        document.body.appendChild(button)
        document.body.appendChild(copyButton)
    }

    init();
})();
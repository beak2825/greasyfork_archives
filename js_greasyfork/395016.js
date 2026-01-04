// ==UserScript==
// @name         JustMySocksAffiliates
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  整理JustMySocks推广数据
// @homeurl     https://greasyfork.org/zh-CN/scripts/395016
// @match        https://justmysocks1.net/members/affiliates.php
// @match        https://justmysocks.net/members/affiliates.php
// @match        https://justmysocks2.net/members/affiliates.php
// @match        https://justmysocks3.net/members/affiliates.php
// @require      https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395016/JustMySocksAffiliates.user.js
// @updateURL https://update.greasyfork.org/scripts/395016/JustMySocksAffiliates.meta.js
// ==/UserScript==

(function () {
    'use strict'

    function $x (xpath) {
        let item = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        )
        let array = []
        for (let i = 0; i < item.snapshotLength; i++) {
            array.push(item.snapshotItem(i))
        }
        return array
    }

    function numberUnit (num) {
        return num >= 10000 ? (num / 10000).toFixed(2) + "万" : num
    }

    function extractFloat (str) {
        let replace = str.replace(",", "")
        let reg = /(\d+(\.\d+)?)/
        let match = reg.exec(replace)
        return parseFloat(match ? match[0] : replace)
    }

    const group = "//div[@class=\"col-xs-12 main-content\"]"
    const clicks = $x(group + '/div[2]/div[1]/div/span')[0].textContent
    const signups = $x(group + '/div[2]/div[2]/div/span')[0].textContent
    const conversions = $x(group + '/div[2]/div[3]/div/span')[0].textContent

    const pending = extractFloat($x(group + '/div[4]/div/table/tbody/tr[1]/td[2]/strong')[0].textContent)
    const available = extractFloat($x(group + '/div[4]/div/table/tbody/tr[2]/td[2]/strong')[0].textContent)
    const withdrawn = extractFloat($x(group + '/div[4]/div/table/tbody/tr[3]/td[2]/strong')[0].textContent)
    const total = (pending + available + withdrawn).toFixed(2)
    const info = {
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        clicks: clicks,
        signups: signups,
        conversions: extractFloat(conversions) / 100,
        pending: pending,
        available: available,
        withdrawn: withdrawn,
        total: total
    }
    const log = `${info.date}\n点击量&nbsp;[&nbsp;${numberUnit(info.clicks)}次&nbsp;]\t注册&nbsp;[&nbsp;${numberUnit(info.signups)}个&nbsp;]\t转化率&nbsp;[&nbsp;${(info.conversions * 100).toFixed(2)}%&nbsp;]\n待确认&nbsp;[&nbsp;$${info.pending}]\t可用&nbsp;[&nbsp;$${info.available}&nbsp;]\t已提现&nbsp;[&nbsp;$${info.withdrawn}&nbsp;]\t\t总数&nbsp;[&nbsp;$${info.total}&nbsp;]`
    console.info(info)

    $($x(group + '/div[2]')[0]).append(`<p id="intercept" style="margin: 20px;font-size: 16px;padding-top: 80px;white-space: pre-wrap;font-family: 'Open Sans',Verdana,Tahoma,serif;">${log}</p>`)

    $.post({
        url: "https://aff.jichang.us/receive",
        data: info,
        success: function (result) {
            console.debug(result)
            if (result.diff) {
                const diff = `距离上次接收\n点击量&nbsp;[&nbsp;${numberUnit(result.diff.clicks)}次&nbsp;]\t\t注册&nbsp;[&nbsp;${numberUnit(result.diff.signups)}个&nbsp;]\t\t\t转化率&nbsp;[&nbsp;${(result.diff.conversions * 100).toFixed(2)}%&nbsp;]\n待确认&nbsp;[&nbsp;$${result.diff.pending}]\t总数&nbsp;[&nbsp;$${result.diff.total}&nbsp;]`
                $("#intercept").append("<br/><br/>" + diff)
            }else{
                $("#intercept").append("<br/><br/>" + result)
            }
        }
    })
})()

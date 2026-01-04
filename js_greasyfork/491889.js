// ==UserScript==
// @name         邢小信
// @namespace    xingxiaoxin
// @version      0.0.2
// @description  xingxiaoxin
// @author       xingxiaoxin
// @match     https://web.xingxiaoxin.com/specifyQuery/*
// @icon         https://www.google.com/s2/favicons?domain=xingxiaoxin.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://update.greasyfork.org/scripts/4274/13748/FileSaverjs.js
// @require      https://update.greasyfork.org/scripts/448905/1180324/xlsxcore.js
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/491889/%E9%82%A2%E5%B0%8F%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/491889/%E9%82%A2%E5%B0%8F%E4%BF%A1.meta.js
// ==/UserScript==




;
(function() {
    'use strict'
    document.oncontextmenu = null
    document.oncopy = null
    document.onkeydown = null
    document.onselectstart = null

    function onMarkList(e) {
        console.log(e.target)
        $(e.target).html('采集中...')
        $(e.target).attr('disabled', 'true')
        var allRuleEle = $('.content .items .item')
        var allDoveEle = $('.content .lists .list')
        let tabhd1 = ['会员名', '环号']
        let tabhd2 = ['', '']
        var allRuleObj = {}
        for (let index = 0; index < allRuleEle.length; index++) {
            const element = allRuleEle.eq(index)
            var title = element.find('.title').text()
            var value = element.find('.value').text()
            if (!Object.hasOwnProperty.call(allRuleObj, title)) {
                allRuleObj[title] = {
                    index,
                    value
                }
                tabhd1.push(title)
                tabhd2.push(value)
            }
        }
        var allRuleBet = [tabhd1, tabhd2]
        for (let index = 0; index < allDoveEle.length; index++) {
            const dataArr = Array.from({ length: allRuleEle.length }, () => null);
            const element = allDoveEle.eq(index)
            var name = element.find('.title').text().slice(5)
            var rciloopno = element.find('.main div').eq(0).text().slice(3)
            dataArr[0] = name
            dataArr[1] = rciloopno
            var ruleRow = element.find('.card .item')
            for (let index = 0; index < ruleRow.length; index++) {
                const curRule = ruleRow.eq(index).html()
                const curRuleIndex = allRuleObj[curRule].index + 2
                dataArr[curRuleIndex] = curRule
            }
            allRuleBet.push(dataArr)
        } 
        downLoad(allRuleBet)
        $(e.target).removeAttr('disabled')
        $(e.target).html('采集')
    }

    function downLoad(tableData) {
        try {
            let ws = XLSX.utils.aoa_to_sheet(tableData)
            let wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, '指定清单')
            XLSX.writeFile(wb, $('.arco-select-view-value').text() + Date.now() + '.xlsx')
        } catch (error) {
            console.error(error)
            this.$message.error(error.message)
        }
    }

    var btn = $(
        '<button type="button" style="position: absolute;left: 1px;top: 1px;z-index: 0;">采集</button>'
    )
    btn.on('click', onMarkList)
    $('body').append(btn)
})()
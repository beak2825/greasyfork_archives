// ==UserScript==
// @name         采购网插件
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  这是一个好的采购网爬虫
// @author       You
// @include      http://search.ccgp.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.2/xlsx.full.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460845/%E9%87%87%E8%B4%AD%E7%BD%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460845/%E9%87%87%E8%B4%AD%E7%BD%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

; (function () {
    'use strict'
    let stop = false
    function sleep(d) {
        for (var t = Date.now(); Date.now() - t <= d;);
    }
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
    }

    let controller = new AbortController()
    let titles = []

    function getPageInfo(docParam) {
        const more_elements = docParam
            .querySelector('.vT-srch-result-list-bid')
            .querySelectorAll('li > a')
        for (let value of more_elements) {
            titles.push({ 标题: trim(value.text), 地址: value.href })
        }
    }

    async function xfetch(ss) {
        const res = await fetch(ss, { signal: controller.signal })
        const response = await res.text()
        if (!response) {
            console.log('返回空')
            return
        }
        let doc = new DOMParser().parseFromString(response, 'text/html')
        getPageInfo(doc)
        console.log($.cookie("search.ccgp.gov.cn"))
        console.log($.cookie("www.ccgp.gov.cn"));
    }

    async function downloadExcel() {
        controller = new AbortController()
        titles = []
        getPageInfo(document)
        stop = false
        const pageParent = document.getElementsByClassName('pager')[0].children
        const page =  pageParent[pageParent.length - 2] || 1
        // const page = document.querySelector(
        //     'body > div:nth-child(9) > div:nth-child(1) > div > p.pager > a:nth-last-child(2)'
        // )
        if (!page) {
            alert('没有分页数据，无法下载')
            return
        }
        let totalPage = page.text
        console.log('页数:' + totalPage)
        let reqUrl = window.location.href

        console.log(reqUrl)
        for (let i = 2; i <= totalPage; i++) {
            let ss = reqUrl.slice().replace('page_index=1', 'page_index=' + i)
            console.log('请求:' + i + ':' + ss)
            if (stop) {
                break
            }
            await xfetch(ss)
        }

        console.log('结束下载')

        // 1. 创建一个工作簿 workbook
        let workBook = XLSX.utils.book_new()
        // 2. 创建工作表 worksheet
        let workSheet = XLSX.utils.json_to_sheet(titles)
        workSheet['!cols'] = [{ wpx: 500 }, { wpx: 500 }]
        //设置超链接
        for (let y = 0; y < titles.length; y++) {
            workSheet['A' + (y + 2)].l = {
                Target: titles[y].地址,
                Tooltip: '点击跳转',
            }
        }
        // 3. 将工作表放入工作簿中
        XLSX.utils.book_append_sheet(workBook, workSheet)
        // 4. 生成数据保存
        XLSX.writeFile(workBook, `测试.xlsx`, {
            bookType: 'xlsx',
        })
    }

    $('#searchForm').append(
        "<input type='button' value='下载Excel' id='doSearch3' onclick='' style='font-size:14px;font-weight:bolder;width:70px;cursor:pointer;background:#5dd400;color:#fff;float:left;height:34px' class='main'>"
    )
    $('#doSearch3').click(function () {
        console.log('点击下载excel...')
        downloadExcel()
    })

    $('#searchForm').append(
        "<input type='button' value='停止下载' id='doSearch4' onclick='' style='font-size:14px;font-weight:bolder;width:70px;cursor:pointer;background:#cc0000;color:#fff;float:left;height:34px' class='main'>"
    )
    $('#doSearch4').click(function () {
        console.log('停止下载...')
        if (!controller.signal.aborted) {
            controller.abort()
        }
        stop = true
    })
})()

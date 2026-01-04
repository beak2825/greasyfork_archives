// ==UserScript==
// @name         云校同步父级任务状态
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  云校同步父级任务状态（方便查看）
// @author       ZhengHongXing
// @match        https://devops.aliyun.com/projex/project/*/task
// @match        https://devops.aliyun.com/projex/workitem*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471159/%E4%BA%91%E6%A0%A1%E5%90%8C%E6%AD%A5%E7%88%B6%E7%BA%A7%E4%BB%BB%E5%8A%A1%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/471159/%E4%BA%91%E6%A0%A1%E5%90%8C%E6%AD%A5%E7%88%B6%E7%BA%A7%E4%BB%BB%E5%8A%A1%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const originalXMLHttpRequest = window.XMLHttpRequest
    const colorMap = {
        '预发布': '#e91e63',
        '待发布': '#838011'
    }
    let screenTaskVal = 'all'
    let taskList = []

    function main() {
        interceptXHR()
        screenParentStatus()
    }

    function screenParentStatus() {
        document.addEventListener('keydown', event => {
            if (event.key === 'F9') {
                const screenTaskValArr = ['all', '就绪（待开发）', '开发中', '待测试', '测试中', '待验收', '验收中', '预发布', '待发布']
                let index = screenTaskValArr.indexOf(screenTaskVal)
                let nextIndex = screenTaskValArr.length == index + 1 ? 0 : index + 1
                screenTaskVal = screenTaskValArr[nextIndex]

                const table = document.querySelector('.next-table-body')
                if (typeof table != 'object') {
                    return
                }
                const trList = table.querySelectorAll('.next-table-row')
                if (typeof trList != 'object') {
                    return
                }
                let parentStatus
                for (const tr of trList) {
                    if (typeof tr != 'object') {
                        continue
                    }
                    parentStatus = tr.getAttribute('parent-status')
                    if (screenTaskVal != 'all' && screenTaskVal != parentStatus) {
                        tr.style.display = 'none'
                    } else {
                        tr.style.removeProperty('display')
                    }
                }
            }
        })
    }

    async function setParentStatus() {
        const table = document.querySelector('.next-table-body')
        if (!table) {
            return setTimeout(setParentStatus, 100)
        }
        if (table.getAttribute('zhx-get-parent') == 1) {
            return setTimeout(setParentStatus, 1000)
        }
        const trList = table.querySelectorAll('.next-table-row')
        if (typeof trList != 'object') {
            return setTimeout(setParentStatus, 100)
        }
        table.setAttribute('zhx-get-parent', 1)
        for (const tr of trList) {
            if (typeof tr != 'object') {
                continue
            }
            const titleDom = tr.querySelector('span[id^="table-row-"]')
            const workitemId = titleDom.getAttribute('id').split('-')[2]
            let parentIdentifier = taskList[workitemId] || ''
            if (!parentIdentifier) {
                let parentWorkitem = await getWorkitem(workitemId)
                parentIdentifier = parentWorkitem.parentIdentifier
            }
            if (parentIdentifier == 'EMPTY_VALUE') {
                continue
            }
            getWorkitem(parentIdentifier, data => {
                let parentStatus = 'none'
                if (data) {
                    parentStatus = data.status.name
                    const statusButton = tr.querySelector('[class*="workitemStatus--statusMenu--"]')
                    if (statusButton) {
                        const statusDom = statusButton.querySelector('span').querySelector('div').querySelector('span')
                        let statusText = statusDom.innerText.split('/')
                        if (typeof colorMap[data.status.name] != 'undefined') {
                            statusDom.innerHTML = statusText[0] + '/<span style="color: ' + colorMap[data.status.name] + '; font-weight: 600">' + data.status.name + '</span>'
                        } else {
                            statusDom.innerText = statusText[0] + '/' + data.status.name
                        }
                        if (['策划中', '待处理'].indexOf(data.status.name) !== -1) {
                            tr.style.opacity = 0.2
                        }
                    }
                }
                tr.setAttribute('parent-status', parentStatus)
            })
        }
        setTimeout(setParentStatus, 1000)
    }

    function interceptXHR() {
        window.XMLHttpRequest = function () {
            const xhr = new originalXMLHttpRequest()
            xhr.originalOpen = xhr.open
            xhr.open = function (method, url) {
                if (url === '/projex/api/workitem/workitem/list?_input_charset=utf-8') {
                    xhr.addEventListener('load', function () {
                        if (xhr.status === 200) {
                            const responseData = JSON.parse(xhr.responseText)
                            if (responseData.code != 200) {
                                return
                            }
                            for (let item of responseData.result) {
                                taskList[item.identifier] = item.parentIdentifier
                            }
                            setParentStatus()
                        }
                    })
                }
                xhr.originalOpen.apply(this, arguments)
            }
            return xhr
        }
    }

    function getWorkitem(id, callback) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://devops.aliyun.com/projex/api/workitem/workitem/' + id + '?_input_charset=utf-8', true)
        xhr.withCredentials = true
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let res = JSON.parse(xhr.responseText)
                    callback(res.result)
                } else {
                    console.error('Api Error', xhr.status)
                }
            }
        }
        xhr.send()
    }

    main()
})()
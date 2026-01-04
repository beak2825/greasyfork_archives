// ==UserScript==
// @name         ERP开发效率脚本
// @namespace    http://tampermonkey.net/
// @version      1.9.9.4
// @description  try to take over the ERP!
// @author       sbotAzlt
// @match        *://edge.dev.kye-erp.com/*
// @match        *://www.kye-erp.com/*
// @license      GPL-3.0 License
// @match        *://edge.uat.kye-erp.com/*
// @match        *://edge-stg.kye-erp.com/*
// @match        *://sec.local.kye-erp.com/*
// @match        *://app.mockplus.cn/*
// @match        *://img02.mockplus.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kye-erp.com
// @downloadURL https://update.greasyfork.org/scripts/450965/ERP%E5%BC%80%E5%8F%91%E6%95%88%E7%8E%87%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450965/ERP%E5%BC%80%E5%8F%91%E6%95%88%E7%8E%87%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const actions = [
        {
            func: 'getAuths',
            name: '获取权限编码'
        },
        {
            func: 'getCooApi',
            name: '快速获取API'
        },
        {
            func: 'getQueryTableCodes',
            name: '获取通用查询code'
        },
        {
            func: 'getToken',
            name: '获取Token'
        },
        {
            func: 'getQueryKeyAndSearchCode',
            name: '获取自定义列对应key label 字典'
        },
        {
            func: 'getQueryTableFormPage',
            name: '获取自定义查询配置'
        },
        {
            func: 'getPrototypeQueryTablePage',
            name: '通过原型获取通用查询列表配置'
        },
        {
            func: 'getPrototypeBackEndQueryTablePage',
            name: '通过原型后端获取通用查询列表配置'
        },
        {
            func: 'queryTableColumnSetKey',
            name: '通过自定义匹配开放平台key'
        },
        {
            func: 'draggingQueryTableSetWindth',
            name: '拖动自定义列修改宽度获取修改后配置'
        }
    ]
    const funcs = {
        // 获取权限编码
        getAuths: () => {
            const { hash } = window.location
            if (hash !== '#/uamp/module-auth-conf') {
                alert('请进入【模块权限配置】模块执行')
                return
            }
            const tb = document.querySelectorAll('.query-table-container')[1].__vue__
            const data = tb.getData()
            const { rows } = data
            const auths = rows.map(item => ({
                method: item.authCode,
                authCode: item.permissionCode,
                buttonId: item.id
            }))
            console.group('=====获取权限编码 strat=====')
            console.log('=======>>>> auths', auths)
            console.log('权限编码获取成功，自动复制到剪切板 ', auths)
            console.table(auths)
            copyLink(JSON.stringify(auths))
            console.groupEnd()
        },
        // coo快速生成api
        getCooApi: () => {
            const { hash } = window.location
            if (hash !== '#/uamp/module-auth-conf') {
                alert('请进入【模块权限配置】模块执行')
                return
            }
            let API = {}
            let str = ''
            const tb = document.querySelectorAll('.query-table-container')[1].__vue__
            const data = tb.getData()
            const { rows } = data
            rows.forEach((item) => {
                const codeList = item.authCode.split('.')
                const key = codeList[codeList.length - 2] + codeList[codeList.length - 1].replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
                API = Object.assign(API, {
                    [key]: {
                        name: item.name,
                        method: item.authCode,
                        authCode: item.permissionCode,
                        buttonId: item.id
                    },
                })
            })
            Object.keys(API).forEach(v => {
                str += `export const ${v} = ${JSON.stringify(API[v])} \n`
      })
            copyLink(str)
            console.group('=====coo快速生成api strat=====')
            console.log('api生成结果成功:，自动复制到剪切板 ', str)
            console.groupEnd()
        },
        // 获取queryTable自定义查询code
        getQueryTableCodes: () => {
            const container = document.querySelector('.query-table-container').__vue__;
            const searchCodes = container.tables.map(item => item.searchCode);
            const genericSearchCode = container.generic ? container.generic.searchCode : '';
            const optionSearchCode = container.option ? container.option.searchCode : '';
            console.group('=====获取获取queryTable自定义查询code strat=====')
            copyLink(`自定义列: ${searchCodes || '无'}, 自定义查询 ${optionSearchCode || '无'}, 通用查询查询${genericSearchCode || '无'}`)
            console.log('自定义列code，自动复制到剪切板====>>>>', searchCodes)
            console.log('自定义查询code，自动复制到剪切板====>>>>', optionSearchCode)
            console.log('通用查询查询code，自动复制到剪切板====>>>>', genericSearchCode)
            console.groupEnd()
        },
        // 获取getToken
        getToken: () => {
            const token = window.sessionStorage.getItem('ERPTOKEN')
            console.log('当前token获取成功，自动复制到剪切板', token)
            copyLink(token)
        },
        // 获取queryTable key adn searchCode
        getQueryKeyAndSearchCode() {
            const el = document.querySelectorAll('.query-table-container')
            const result = {}
            el.forEach(vItem => {
                vItem.__vue__.tables.forEach(item => {
                    result[item.searchCode] = {[`${item.option.label || ''} ===>> searchCode`]: item.searchCode }
                    item.columns.forEach(v=> {
                        result[item.searchCode][v.filter && v.filter.args ? `${v.label} ===>> 字典:${v.filter.args.join(',')}` : v.label] = `${v.key}`.trim()
                        if (v.children && v.children.length) {
                            v.children.forEach(vc => {
                                result[item.searchCode][vc.filter && vc.filter.args ? `${v.label} ===>> ${vc.label} ===>> 字典:${vc.filter.args.join(',')} ` :`${v.label}===>>>${vc.label}`] = vc.key.trim()
                            })
                        }
                    })
                })
            })
            console.group('=====获取queryTable Key code strat=====')
            copyLink(JSON.stringify(result))
            Object.keys(result).forEach(v => {
                console.table(result[v])
            })
            console.groupEnd()
        },
        // 通过原型获取通用查询列表配置
        async getPrototypeQueryTablePage(isLog = true) {
            const { host } = window.location
            if (!host.includes('mockplus.cn')) {
                alert('请进入【摹客】模块执行')
                return
            }
            // iFrame 页面会导致跨域，剥离掉一层 刚好src是 about:blank ，是否为摹客bug？
            if (!host.includes('img02.mockplus.cn')) {
                const axurePageSrc = document.getElementById("axure-page").src
                window.open(axurePageSrc)
                return
            }
            const topWin = document.getElementById("mainFrame").contentWindow
            let oneTableALL = topWin.document.querySelectorAll(`[data-label="一级表头"]`)
            let towTableALL = topWin.document.querySelectorAll(`[data-label="二级表头"]`)
            if (!oneTableALL.length && !towTableALL.length) {
                oneTableALL = topWin.document.querySelectorAll(`.panel_state_content > [data-label="一级表头"]`)
                towTableALL = topWin.document.querySelectorAll(`.panel_state_content > [data-label="二级表头"]`)
            }
            if (!oneTableALL.length && !towTableALL.length) {
                alert('未找到一级表头/二级表头，联系产品修改原型规范')
                return
            }
            let oneTable = []
            let towTable = []
            towTableALL.forEach(item => {
                function queryEle(el) {
                    if (el.style.display === 'none') {
                        return
                    }
                    if (el.id === 'base' || el.parentElement.id ==='base') {
                        towTable.push(item)
                        return
                    }
                    queryEle(el.parentElement)
                }
                queryEle(item)
            })
            oneTableALL.forEach((item, index) => {
                function queryEle(el) {
                    if (el.style.display === 'none') {
                        return
                    }
                    if (el.id === 'base' || el.parentElement.id ==='base') {
                        oneTable.push(item)
                        return
                    }
                    queryEle(el.parentElement)
                }
                queryEle(item)
            })
            if (!oneTable.length && !towTable.length) {
                alert('递归过滤失败，请重试！！')
                return
            }
            const result = {}
            const splitTemp = {
                1: '<br>',
                2: '/n',
                3: '/n/r',
                4: '<p>',
                5: '<span>'
            }
            const oneTables = {} // 一级表头数据
            const towTables = {} // 二级表头数据
            oneTable.forEach((oneItem, oneIndex) => {
                const text = oneItem.querySelectorAll('.text')
                oneTables[`${oneIndex}`] = []
                text.forEach((tItem, tIndex) => {
                    const spanText = tItem.querySelectorAll('span')
                    let html = ''
                    if (spanText.length > 1) {
                        html = `${spanText[0].innerHTML} <br> ${spanText[1].innerHTML}`
                    } else {
                        html = spanText[0] && spanText[0].innerHTML ? spanText[0].innerHTML : ''
                    }
                    if (!oneTables[`${oneIndex}`].includes(html) && !!html) {
                        oneTables[`${oneIndex}`].push(html)
                    }
                })
                if (JSON.stringify(oneTables) !== '{}') {
                    Object.keys(oneTables).forEach((tableIndex) => {
                        createTable(oneTables, tableIndex)
                    })
                }
                if (towTable.length) {
                    setTowTable(oneIndex)
                }
            })
            // 设置二级表头数据
            function setTowTable (oneIndex) {
                towTable.forEach((towItem, towIndex) => {
                    const panelStateContent = towItem.querySelectorAll('.ax_default')
                    panelStateContent.forEach((pItem, pIndex) => {
                        if (!towTables[`${oneIndex}-${towIndex}`]) {
                            towTables[`${oneIndex}-${towIndex}`] = []
                        }
                        const text = pItem.querySelectorAll('.text')
                        text.forEach(tItem => {
                            const spanText = tItem.querySelectorAll('span')
                            let html = ''
                            if (spanText.length > 1) {
                                html = `${spanText[0].innerHTML} <br> ${spanText[1].innerHTML}`
                            } else {
                                html = spanText[0].innerHTML
                            }
                            if (pItem.dataset.label === '二级表头上' ) { // 只有一个的是二级表头的顶部头
                                if(!towTables[`${oneIndex}-${towIndex}`].includes(`title-${html}`)) {
                                    towTables[`${oneIndex}-${towIndex}`].push(`title-${html}`)
                                }
                            } else {
                                if(!towTables[`${oneIndex}-${towIndex}`].includes(html) && !towTables[`${oneIndex}-${towIndex}`].includes(`title-${html}`)) {
                                    towTables[`${oneIndex}-${towIndex}`].push(html)
                                }
                            }
                        })
                    })
                })
                if (JSON.stringify(towTables) !== '{}') {
                    Object.keys(towTables).forEach((item) => {
                        createTable(towTables, item)
                    })
                    mergeResult(result)
                }
            }
            // 页面多个表格数据进行数据合并
            function mergeResult (arr) {
                const indexs = [...new Set(Object.keys(arr).map(v => v.split('-')[0]))]
                Object.keys(arr).forEach(item => {
                    if (item.includes('-')) { // 处理 二级表child
                        const child = arr[item].find(fItem => fItem.label.includes('title-'))
                        child["children"] = []
                        arr[item].forEach(aItem => {
                            if (!aItem.label.includes('title-')) {
                                child.children.push(aItem)
                            }
                        })
                        child.label = child.label.replaceAll('title-', '')
                        arr[item] = child
                    }
                })
                indexs.forEach(item => {
                    Object.keys(arr).forEach((aItem, index) => {
                        if (arr[item]) {
                            if (arr[`${item}-${index}`]) {
                                arr[item].push(arr[`${item}-${index}`])
                                delete arr[`${item}-${index}`]
                            }
                        }
                    })
                    resetTable(arr[item])
                })
            }
            // 重置二级表头宽度
            function resetTable (arr) {
                arr.forEach(item => {
                    const isSortKeys = item.sortKeys && item.sortKeys.length ? true : false
                    if (item.children && item.children.length) {
                        item.children.forEach(cItem => {
                            const isSortKeys = cItem.sortKeys && cItem.sortKeys.length ? true : false
                            cItem.width = Math.ceil(getLabelWidth({label: cItem.label, labelSplit: cItem.labelSplit||0, isSortKeys}))
                        })
                        return
                    }
                    item.width = Math.ceil(getLabelWidth({label: item.label, labelSplit: item.labelSplit||0, isSortKeys}))
                })
            }
            // 生成表格数据
            function createTable (arr, tableIndex) {
                arr[tableIndex].forEach((item, index) => {
                    if (['序号', '操作'].includes(item)) {
                        return
                    }
                    const labelMark = getIsLine(item)
                    let isLine = {}
                    const key = `todo_key${index}_${Math.floor(Math.random() * (9999999 - 1)) + 1}`
                    const dataTemp = {
                        "label": getLabel(item, labelMark),
                        key,
                        "show": true,
                        "width": '',
                    }
                    if (item.includes('◥') || item.includes('↑') || item.includes('△')|| item.includes('▼') || item.includes('^')) {
                        dataTemp.sortKeys = [key, key]
                    }

                    if (labelMark !== -1) {
                        isLine = { // 是否换行
                            "safeWidth": false,
                            "labelSplit": getLabelSplit(item, labelMark)
                        }
                    }
                    if (!result[tableIndex] || !result[tableIndex].length) {
                        result[tableIndex] = []
                    }
                    if (dataTemp.label.includes('时间')) {
                        dataTemp.filter = 'minute'
                    }
                    if (dataTemp.label.includes('日期')) {
                        dataTemp.filter = 'date'
                    }
                    dataTemp.width = Math.ceil(getLabelWidth({label: dataTemp.label, labelSplit: dataTemp.labelSplit||0, isSortKeys: labelMark!== -1}))
                    const inLabel = result[tableIndex].find(v => v.label === dataTemp.label)
                    if (!inLabel) {
                        result[tableIndex].push({ ...dataTemp, ...isLine })
                    }
                })
            }
            // 获取表头宽度
            function getLabelWidth ({ label, labelSplit, isSortKeys }) {
                const topTextWidth = computeFontSize(label.slice(0, labelSplit), isSortKeys)
                const btmTextWidth = computeFontSize(label.slice(labelSplit), isSortKeys)
                return Math.max(topTextWidth, btmTextWidth)
            }
            // canvas计算字体宽度
            function computeFontSize (str, isSortKeys) {
                if (!str) {
                    return 0
                }
                const font = "normal 12px Microsoft YaHei"
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                context.font = font
                const width = context.measureText(str).width + (isSortKeys? 8 : 0)
                return parseInt(width, 10) + 16
            }
            // 表头换行数据计算
            function getLabelSplit (lable, labelMark) {
                return lable.indexOf(splitTemp[labelMark]) !== -1 ? lable.indexOf(splitTemp[labelMark]) - 1 : 0
            }
            // 表头label特殊字符截取
            function getLabel (lable, labelMark) {
                switch(labelMark) {
                    case 4 :
                        return lable.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('◥', '').replaceAll('▼', '').replaceAll('△', '').replaceAll('↑', '').replaceAll('&nbsp;', '').replaceAll('^', '').replaceAll(' ', '')
                    case 5:
                        return lable.replaceAll('<span>', '').replaceAll('</span>', '').replaceAll('◥', '').replaceAll('▼', '').replaceAll('△', '').replaceAll('↑', '').replaceAll('&nbsp;', '').replaceAll('^', '').replaceAll(' ', '')
                    default:
                        return lable.replaceAll(splitTemp[labelMark], '').replaceAll('◥', '').replaceAll('▼', '').replaceAll('↑', '').replaceAll('△', '').replaceAll('^', '').replaceAll('&nbsp;', '').replaceAll(' ', '')
                }
            }
            // 获取label是否换行特殊标识,需要优化
            function getIsLine (lable) {
                if (lable.includes('<br>')) {
                    return 1
                }
                if (lable.includes('/n')) {
                    return 2
                }
                if (lable.includes('/n/r')) {
                    return 3
                }
                if (lable.includes('<p>')) {
                    return 4
                }
                if (lable.includes('<span>')) {
                    return 5
                }
                return -1
            }
            if (isLog) {
                console.group('===== 通过原型获取通用查询列表配置 strat=====')
                console.log('=======>>>> 自定义列配置结果值，自动复制到剪切板', result)
                console.log('=======>>>> 一级表头数据', oneTables)
                console.log('=======>>>> 二级表头数据', towTables)
                copyLink(JSON.stringify(result))
                console.groupEnd()
            }
            return result
        },
        // 通过原型后端获取通用查询列表配置
        async getPrototypeBackEndQueryTablePage() {
            let tableData = await funcs.getPrototypeQueryTablePage(false)
            const { host } = window.location
            let code
            // 未匹配成功的字段
            const errKeys = []
            if (host.includes('img02.mockplus.cn')) {
                code = prompt('输入后端请求code')
            }
            if (!code && host.includes('img02.mockplus.cn')) {
                alert('接口code不能为空')
                return
            }
            // tosreport.intercityMonitor.mainRealTime
            const apiData = await fetch(`https://coo-generator-uat.kyslb.com/query?generatorArg=${code}`)
            const res = await apiData.json()
            if (!res || !res.length) {
                alert(`code ===> ${code} 为空，请联系后端是否在开放平台配置`)
                return
            }
            // tableData[0]
            Object.keys(tableData).forEach(item => {
                let apiKey = res.find(v => v.label === tableData[item].label)
                if (apiKey) {
                    tableData[item].key = apiKey.key
                } else {
                    errKeys.push(tableData[item].label)
                }
                if (tableData[item].children && tableData[item].children.length) {
                    tableData[item].children.forEach(cItem => {
                        let cApiKey = res.find(v => v.label === cItem.label)
                        if (cApiKey) {
                            cItem.key = cApiKey.key
                        } else {
                            errKeys.push(cItem.label)
                        }
                    })
                }
            })
            console.group('===== 通过原型后端获取通用查询列表配置 strat=====')
            console.log('=======>>>> 自定义列配置，自动复制到剪切板', tableData)
            console.log('=======>>>> 开放平台返回code值', res)
            console.log('=======>>>> 匹配的code', code)
            console.log('=======>>>> 匹配失败的字段')
            console.table({...errKeys})
            copyLink(JSON.stringify(tableData))
            console.groupEnd()
        },
        // 获取自定义查询配置
        getQueryTableFormPage() {
            const { formFields } = document.querySelector('.query-table-container').__vue__
            const result = {}
            formFields.forEach(item => {
                result[item.label] = `${item.propertyName} ${item.lookupCode ? '===>> 字典：' + item.lookupCode + ' 字典值：'+ JSON.stringify(item.options) : ''}`
            })
            console.group('=====获取自定义查询配置=====')
            copyLink(JSON.stringify(result))
            console.table(result)
            console.groupEnd()
        },
        // 通过自定义匹配开放平台key tosreport.deliveryTime.getPickupTrunkList
        async queryTableColumnSetKey() {
            let code = prompt('输入后端请求code')
            if (!code) {
                return
            }
            // 未匹配成功的字段
            const errKeys = []
            const { tables } = document.querySelector('.query-table-container').__vue__
            const tablesData = _.cloneDeep(tables)
            if (!tablesData || !tablesData.length) {
                alert('请先配置query-table自定义列')
                return
            }
            const table = tablesData.find(v => v.url.method === code)
            if (!table) {
                alert('自定义列method配置与输入code不一致')
                return
            }
            const apiData = await fetch(`https://coo-generator-uat.kyslb.com/query?generatorArg=${code}`)
            const res = await apiData.json()
            const result = table.columns.map(item => {
                const fixedKey = {'组织': {key: 'departName'}, '负责人': {key: 'chargeName'}}
                const apiData = res.find(v => v.label === item.label || v.label.includes(item.label)) || fixedKey[item.label]
                const c = {key: item.key, label:item.label, show:true, width: item.width}
                if (!apiData) {
                    errKeys.push(item.label)
                    if (item.fixed) {
                        c.fixed = item.fixed
                    }
                    if (item.sortKeys && item.sortKeys.length) {
                        c.sortKeys = item.sortKeys
                    }
                    if (item.children && item.children.length) {
                        c.children = setChildren(item.children, item)
                    }
                    if (item.labelSplit) {
                        c.safeWidth = item.safeWidth
                        c.labelSplit = item.labelSplit
                    }
                    if (item.filter) {
                        c.filter = item.filter
                    }
                    return c
                }
                if (item.fixed) {
                    c.fixed = item.fixed
                }
                c.key = apiData.key || item.key
                if (item.sortKeys && item.sortKeys.length) {
                    c.sortKeys = [apiData.key || item.key, apiData.key || item.key]
                }
                if (item.children && item.children.length) {
                    c.children = setChildren(item.children, item)
                }
                if (item.labelSplit) {
                    c.safeWidth = item.safeWidth
                    c.labelSplit = item.labelSplit
                }
                if (item.filter) {
                    c.filter = item.filter
                }
                return c
            })
            function setChildren (children, item) {
                return children.map(cItem => {
                    const apiKeyChildreb = res.find(v => v.label === `${item.label}-${cItem.label}` || v.label.includes(`${item.label}-${cItem.label}`))
                    const c1 = {key: cItem.key, label:cItem.label, show:true, width: cItem.width}
                    if (!apiKeyChildreb) {
                        errKeys.push(`${item.label}-${cItem.label}`)
                        if (item.fixed) {
                            c1.fixed = item.fixed
                        }
                        if (item.sortKeys && item.sortKeys.length) {
                            c1.sortKeys = item.sortKeys
                        }
                        if (item.labelSplit) {
                            c1.safeWidth = item.safeWidth
                            c1.labelSplit = item.labelSplit
                        }
                        if (item.filter) {
                            c1.filter = item.filter
                        }
                        return c1
                    }
                    if (item.fixed) {
                        c1.fixed = item.fixed
                    }
                    if (item.labelSplit) {
                        c1.safeWidth = item.safeWidth
                        c1.labelSplit = item.labelSplit
                    }
                    c1.key = apiKeyChildreb.key || item.key
                    if (item.sortKeys && item.sortKeys.length) {
                        c1.sortKeys = apiData.key || item.key
                    }
                    if (item.filter) {
                        c1.filter = item.filter
                    }
                    return c1
                })
            }
            console.group('===== 通过自定义匹配开放平台key strat=====')
            console.log('=======>>>> 自定义列配置，自动复制到剪切板', result)
            console.log('=======>>>> 开放平台返回code值', res)
            console.log('=======>>>> 匹配的code', code)
            console.log('=======>>>> 匹配失败的字段')
            console.table({...errKeys})
            copyLink(JSON.stringify(result))
            console.groupEnd()
        },
        // 拖动自定义列修改宽度获取修改后配置
        draggingQueryTableSetWindth() {
            const { tables,$route } = document.querySelector('.query-table-container').__vue__
            const tablesData = _.cloneDeep(tables)
            const result = {}
            if (!tables || !tables.length) {
                alert('请先配置query-table自定义列')
                return
            }
            const globalColWidth= JSON.parse(localStorage.getItem('GLOBAL_COL_WIDTH'))
            if (!globalColWidth) {
                alert('请先配置拖动自定义列')
                return
            }
            const { tag } = $route.meta
            tables.forEach(item => {
                const data = globalColWidth[`${tag}?${item.searchCode}`]
                if (data) {
                    item.columns.forEach(cItem => {
                        const globalColWidthKes = Object.keys(data)
                        if(globalColWidthKes.includes(cItem.key)) {
                            cItem.width = Math.ceil(data[cItem.key])
                        }
                        if (cItem.children && cItem.children.length) {
                            delete cItem.width
                            cItem.children.forEach(chItem => {
                                if(globalColWidthKes.includes(chItem.key)) {
                                    chItem.width = Math.ceil(data[chItem.key])
                                }
                            })
                        }
                    })
                }
                result[`${item.option.label}==>>${item.searchCode}`] = item.columns.map(mItem => {
                    const c = {key: mItem.key, label:mItem.label, show:true, width: mItem.width}
                    if (mItem.children && mItem.children.length) {
                        c.children = mItem.children.map(v => {
                            const c = {key: v.key, label:v.label, show:true, width: v.width}
                            if (v.sortKeys) {
                                c.sortKeys = [v.sortKeys[0], v.sortKeys[1]]
                            }
                            if (v.fixed) {
                                c.fixed = v.fixed
                            }
                            if (v.labelSplit) {
                                c.safeWidth = v.safeWidth
                                c.labelSplit = v.labelSplit
                            }
                            if (v.filter) {
                                c.filter = v.filter
                            }
                            return c
                        })
                    }
                    if (mItem.sortKeys) {
                        c.sortKeys = [mItem.sortKeys[0], mItem.sortKeys[1]]
                    }
                    if (mItem.filter) {
                        c.filter = mItem.filter
                    }
                    if (mItem.labelSplit) {
                        c.safeWidth = mItem.safeWidth
                        c.labelSplit = mItem.labelSplit
                    }
                    if (mItem.fixed) {
                        c.fixed = mItem.fixed
                    }
                    return c
                })
            })
            console.group('===== 拖动自定义列修改宽度获取修改后配置 strat=====')
            console.log('=======>>>> 自定义列配置，自动复制到剪切板', result)
            copyLink(JSON.stringify(result))
            console.groupEnd()
        },
    }
    //拷贝到剪切板
    function copyLink (value) {
        if (window.clipboardData) {
            window.clipboardData.clearData()
            window.clipboardData.setData('text', value)
        } else if (document.execCommand) {
            const element = document.createElement('SPAN')
            element.innerHTML = value
            document.body.appendChild(element)
            if (document.selection) {
                const range = document.body.createTextRange()
                range.moveToElementText(element)
                range.select()
            } else if (window.getSelection) {
                const range = document.createRange()
                range.selectNode(element)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
            }
            document.execCommand('copy')
            element.remove ? element.remove() : element.removeNode(true)
        }
    }
    const div = document.createElement('div')
    const html = `
    <style>
     #__js {
        position: relative;
        height: 50px;
        line-height: 50px;
        color: #fff;
      }
      #__js> .conent-item {
        cursor: pointer;
        transform-origin: center bottom;
        position: absolute;
        top: 36px;
        left: 0;
        z-index: 99999999;
        padding: 10px 0;
        margin: 5px 0;
        background-color: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        display: none;
      }
      #__js> .conent-item > .item {
        line-height: 36px;
        padding: 0 20px;
        margin: 0;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        outline: none;
        white-space: nowrap;
      }
      #__js> .conent-item > .item:hover {
        background: #e9f3ff;
        color: #65adff;
      }
      #__js> .conent-item:after {
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        position: absolute;
        top: -10px;
        left: 10px;
      }
      #__js:hover .conent-item {
        display: block !important;
        color: red !important;
      }
    </style>
    <div id="__js">
      <span style="color:#fe4066">开发脚本</span>
      <div class="conent-item">
        ${actions.map(item => `<div class="item" data-id="${item.func}">${item.name}</div>`)}
      </div>
    </div>
  `.replaceAll(',', '')
    div.style = div.style = "position:fixed;right: 528px;top: 0px;z-index: 999999999;"
div.innerHTML = html
div.addEventListener('click', (e) => {
    const dataId = e.target.getAttribute('data-id')
    if (dataId) {
        try {
            funcs[dataId]()
        } catch (e) {
            console.error(e)
            alert('报错了，请前往控制台查看')
        }
    }
})
document.body.appendChild(div)
})();
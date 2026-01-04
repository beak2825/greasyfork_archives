// ==UserScript==
// @name         一键生成 GitLab 周报汇总
// @namespace    https://github.com/kiccer
// @version      2.3.4
// @description  一键生成 GitLab 周报汇总，生成自定义时间段的汇报。(主要为公司内部开发使用。因 gitlab 版本不确定性，不保证完全兼容其他 gitlab 版本，如有需求，请到 github 留 issues。)
// @author       kiccer<1072907338@qq.com>
// @supportURL   https://github.com/kiccer/TampermonkeyScripts/issues
// @license      MIT
// @match        http://192.168.1.128:8088/*
// @icon         https://gd-hbimg.huaban.com/690fe61ca630eaffd3e052c73d3aa7d66d45d95a6101-gORZdx_fw658/format/webp
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/bootstrap-daterangepicker/3.1/moment.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/bootstrap-daterangepicker/3.1/daterangepicker.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.js
// @resource toastr_css https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css
// @resource daterangepicker_css https://cdn.bootcdn.net/ajax/libs/bootstrap-daterangepicker/3.1/daterangepicker.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446761/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%20GitLab%20%E5%91%A8%E6%8A%A5%E6%B1%87%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/446761/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%20GitLab%20%E5%91%A8%E6%8A%A5%E6%B1%87%E6%80%BB.meta.js
// ==/UserScript==

/* globals $ moment toastr */

$(() => {
    'use strict'

    const targetPath = $('.header-user-dropdown-toggle').attr('href')
    const currentPath = location.pathname

    // 判断是否是目标地址
    if (targetPath !== currentPath) return

    // 加载 CSS
    GM_addStyle(GM_getResourceText('toastr_css'))
    GM_addStyle(GM_getResourceText('daterangepicker_css'))
    GM_addStyle(`
        .kiccer-daterange-input {
            visibility: hidden;
            width: 0;
            height: 32px;
            border: 0;
            padding: 0;
            margin: 0;
            position: absolute;
        }
    `)

    // 按钮容器
    const btnContainer = $('.cover-controls')

    // 日报
    const copyBtn = $('<a>')
    copyBtn.addClass('btn btn-gray')
    copyBtn.html('生成日报')
    copyBtn.appendTo(btnContainer)
    copyBtn.on('click', async e => {
        const startTime = moment().format('YYYY-MM-DD 00:00:00')
        const endTime = moment().format('YYYY-MM-DD 23:59:59')
        const summaryList = await getSummary(startTime, endTime)
        const text = getTextBySummary(startTime, endTime, summaryList)

        copy(text)
        toastr.success('复制成功！')
    })

    // 智能生成周报
    const smartBtn = $('<a>')
    smartBtn.addClass('btn btn-gray')
    smartBtn.attr('title', '获取过去最近的工作周，自动判断法定节假日。')
    smartBtn.html('智能周报')
    smartBtn.appendTo(btnContainer)
    smartBtn.on('click', async e => {
        const end = await findDate(moment(), [0])
        const start = await findDate(end.subtract(1, 'day'), [1, 2])
        const startTime = start.add(1, 'day').format('YYYY-MM-DD 00:00:00')
        const endTime = end.format('YYYY-MM-DD 23:59:59')
        const summaryList = await getSummary(startTime, endTime)
        const text = getTextBySummary(startTime, endTime, summaryList)

        copy(text)
        toastr.success('复制成功！')
    })

    // 自定义汇总时间范围
    const customBtn = $('<a>')
    customBtn.addClass('btn btn-gray')
    customBtn.html('自定义时间')
    customBtn.appendTo(btnContainer)
    customBtn.on('click', e => {
        dateRange.click()
    })

    // 日期选择期 (https://github.com/dangrossman/daterangepicker)
    const dateRange = $('<input type="text" name="daterange" class="kiccer-daterange-input" />')
    customBtn.append(dateRange)

    dateRange.on('click', e => {
        e.stopPropagation()
    })

    $('input[name="daterange"]').daterangepicker({
        opens: 'left',
        locale: {
            format: 'YYYY-MM-DD',
            separator: ' - ',
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '从',
            toLabel: '至',
            customRangeLabel: '自定义',
            weekLabel: '周',
            daysOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    }, (start, end, label) => {
        // daterange changed.
    }).on('apply.daterangepicker', async (ev, picker) => {
        customBtn.attr('disabled', true)

        const startTime = picker.startDate.format('YYYY-MM-DD 00:00:00')
        const endTime = picker.endDate.format('YYYY-MM-DD 23:59:59')
        const summaryList = await getSummary(startTime, endTime)
        const text = getTextBySummary(startTime, endTime, summaryList)

        copy(text)
        toastr.success('复制成功！')
        customBtn.attr('disabled', false)
    })

    // 向前寻找日期，工作日0 周末1 法定节假日2，例：findDate(今天, 0) 从今天开始往前找，返回最近的一个工作日日期。
    function findDate (start, type = [0]) {
        return new Promise((resolve, reject) => {
            const loop = (time) => {
                // 节假日万年历API: https://www.mxnzp.com/doc/detail?id=1
                GM_xmlhttpRequest({
                    url: `https://www.mxnzp.com/api/holiday/single/${time}?ignoreHoliday=false&app_id=rkkpflimunbjzeki&app_secret=SHI3cDNEQTRXOHNnYmxiallNeEM3Zz09`,
                    onload: res => {
                        const { data, code, msg } = JSON.parse(res.response)

                        if (code === 1) {
                            output(`${moment(time).format('YYYY-MM-DD')} 是 ${['工作日', '周末', '法定节假日'][data.type]}`)

                            // console.log(data)
                            if (type.includes(data.type)) {
                                resolve(moment(time))
                            } else {
                                loop(moment(time).subtract(1, 'day').format('YYYYMMDD'))
                            }
                        } else {
                            alert(msg)
                        }
                    }
                })
            }

            loop(moment(start).format('YYYYMMDD'))
        })
    }

    // 控制台输出
    function output (msg) {
        console.log(`%c[${moment().format('HH:mm:ss')}'${String(Date.now() % 1000).padStart(3, '0')}] %c${msg}`, 'color: red', 'color: blue')
    }

    // 加载页面 (v2.2 改为接口请求，然后放到一个隐藏元素内，兼容 gitlab 多版本)
    const hideList = $('<div class="content_list_hide" style="display: none;">')
    $('#activity').append(hideList)

    const pageInfo = {
        offset: 0,
        limit: 20,
        hasNext: true
    }

    function loadPage () {
        return new Promise((resolve, reject) => {
            if (!pageInfo.hasNext) {
                reject(Error('no more pages.'))
                return
            }

            output('加载页面：' + (pageInfo.offset / pageInfo.limit + 1))

            $.ajax({
                type: 'GET',
                url: $('.content_list').data('href'),
                data: `limit=${pageInfo.limit}&offset=${pageInfo.offset}`,
                dataType: 'json',

                success: (data) => {
                    // console.log(data)
                    hideList.html(hideList.html() + data.html)
                    pageInfo.offset += pageInfo.limit
                    pageInfo.hasNext = data.count === pageInfo.limit
                    resolve()
                },

                error: err => {
                    reject(err)
                }
            })
        })
    }

    loadPage() // 加载第一页

    // 按日期加载足够的页面
    function loadPageUntil (time) {
        return new Promise((resolve, reject) => {
            // 循环加载页面直到满足指定获取完日期范围的数据
            const loop = () => {
                const lastEventItemTime = moment($('.content_list_hide .event-item:last time').attr('datetime'))

                if (lastEventItemTime < time) {
                    resolve()
                } else {
                    // 加载完，还有页面就继续加载，没了就退出。
                    loadPage().then(res => {
                        loop()
                    }).catch(() => {
                        resolve()
                    })
                }
            }

            loop()
        })
    }

    // 获取汇总列表
    async function getSummary (startTime, endTime) {
        await loadPageUntil(moment(startTime))

        const eventItem = $('.content_list_hide .event-item')
        const inScoped = []

        // 提取内容
        eventItem.each((index, item) => {
            const it = $(item)
            const time = moment(it.find('time').attr('datetime'))

            if (time >= moment(startTime) && time <= moment(endTime)) {
                inScoped.push({
                    time,
                    project: it.find('.project-name').text(),
                    branch: it.find('.event-title strong a[title]').text(),
                    commit: [...it.find('.event_commits .commit')].map(n =>
                        $(n).text().replace(/^\n\n[0-9a-f]{8}\n·\n\s*(.+)\s*\n\n$/i, '$1')
                    ).filter(n => !/^Merge.*into.*/.test(n))
                })
            }
        })

        // 内容归整
        const project = []

        inScoped.forEach(scope => {
            const projectName = scope.project
            const itemProject = project.find(n => n.name === projectName)

            if (itemProject) {
                const itemBranch = itemProject.branch.find(n => n.name === scope.branch)

                if (itemBranch) {
                    itemBranch.commit.push(scope)
                } else {
                    itemProject.branch.push({
                        name: scope.branch,
                        commit: [scope]
                    })
                }
            } else {
                project.push({
                    name: projectName,
                    branch: [{
                        name: scope.branch,
                        commit: [scope]
                    }]
                })
            }
        })

        // commit 排序后合并成 Array<String> 格式
        project.forEach(n => {
            n.branch.forEach(m => {
                m.commit = m.commit.sort((x, y) => moment(x.time) - moment(y.time))
                    .map(x => x.commit)
                    .flat()
            })
        })

        return project
    }

    // 生成文本汇总信息
    function getTextBySummary (startTime, endTime, summaryList) {
        const res = [
            `周报日期：${startTime.slice(0, 10)} ~ ${endTime.slice(0, 10)}`
        ]

        summaryList.forEach(project => {
            res.push(`\n${project.name}`)

            project.branch.forEach((branch, index) => {
                res.push(`${index ? '\n' : ''}    ${branch.name}`)

                branch.commit.forEach(commit => {
                    res.push(`        ${commit}`)
                })
            })
        })

        res.push('\n总结：\n    ')

        return res.join('\n')
    }

    // 拷贝到剪贴板
    function copy (text) {
        GM_setClipboard(text, 'text')
    }
})

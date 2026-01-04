// ==UserScript==
// @name         Liquipedia Page Modifier
// @namespace    https://greasyfork.org/zh-CN/scripts/484965-liquipedia-page-modifier
// @version      1.1.6
// @description  通用的Liquipedia页面修改器,逐步移植其他项目的功能
// @author       monat151
// @license      MIT
// @match        https://liquipedia.net/dota2/*
// @icon         http://liquipedia.net/favicon.ico
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/484965/Liquipedia%20Page%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/484965/Liquipedia%20Page%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /** 一些通用组件 */
    const $ = window.$

    let retry_count = 0

    setTimeout(() => {
        // 修改页面背景色
        $('body').css('background-color', '#F9EFD6')
        // 修改页面字体(暂未启用)
        // $('body').css('font-family', '"思源黑体 CN Light","Microsoft YaHei"')
        // 生成'启用/禁用编辑模式'的按钮UI
        generatePageEditUi()
        // 生成'复制奖金池'的按钮UI
        generatePrizePoolCatcherUi()
        // 生成'复制赛事贴框架'的按钮UI
        generateMatchBaseCatcherUi()
        // 生成'复制所有比赛'的按钮UI
        generateAllMatchesCatcherUi()
        // 生成'复制所有信息'的按钮UI (仅限Liquipedia DB页面 / 需要登录)
        if (document.location.href.match('Special:LiquipediaDB')) { generateDbCatcherUi() }
        // 生成'复制小组赛排名'的按钮UI
        generateGroupStageRankingCatcherUi()
    }, 100);

    /** 生成获取比赛信息并生成赛事贴基本框架的按钮UI
      * Patch: 1.1.5, Date: 2024.12.24
      */
    function generateMatchBaseCatcherUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_MatchBaseCatcher'
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '复制赛事贴框架',
            /*tip*/ '获取比赛信息并生成赛事贴基本框架',
            /*onclick*/ () => {
                const data = {}

                data.title = $('h1#firstHeading>span:nth-child(1)').text()

                // 基本信息 (右边栏)
                const baseInfo = {}
                $('.fo-nttax-infobox').find('div').each(function() {
                    let title = $(this).find('.infobox-description').text().trim()
                    let value = $(this).find('div[style="width:50%"]').text().trim()
                    if (title && value) {
                        value = value.replace(/<.*?>/g, '').trim()
                        baseInfo[title] = value;
                    }
                })
                data.baseInfo = baseInfo

                // 赛制
                data.matchFormat = ''
                if ($('#Format').length) {
                    const startH2 = $('h2').has('span.mw-headline[id="Format"]')
                    startH2.nextUntil('h2').filter('ul').each(function() {
                        if (data.matchFormat) data.matchFormat += '\n'
                        data.matchFormat += convertToBBCode($(this))
                    })

                    function convertToBBCode($content) {
                        $content.find('b, strong').each(function() {
                            $(this).replaceWith('[b]' + $(this).text() + '[/b]')
                        })
                        $content.find('i').each(function() {
                            $(this).replaceWith('[color=silver]' + $(this).text() + '[/color]')
                        })
                        $content.find('ul').each(function() {
                            let bbcodeList = '[list]'
                            $(this).find('li').each(function() {
                                bbcodeList += '\n[*]' + $(this).text().trim()
                            });
                            bbcodeList += '\n[/list]'
                            $(this).replaceWith(bbcodeList)
                        })
                        $content.find('ol').each(function() {
                            let bbcodeList = '[list=1]'
                            $(this).find('li').each(function() {
                                bbcodeList += '\n[*]' + $(this).text().trim()
                            })
                            bbcodeList += '\n[/list]'
                            $(this).replaceWith(bbcodeList)
                        })
                        return $content.html().replaceAll('<li>', '[list][*]').replaceAll('</li>', '[/list]')
                    }
                }

                // 其他块
                const ignoreBlocks = ['Format', 'Prize_Pool', 'Participants', 'Event', 'Additional_Content', 'References']
                data.otherBlocks = []
                $('h2').find('span.mw-headline').each(function() {
                    if (!ignoreBlocks.includes($(this)[0].id)) {
                        data.otherBlocks.push($(this).text())
                    }
                })

                // 生成BBSCODE
                let result = `[align=center]这里放抬头图推荐宽度600`
                result += `\n[color=gray][size=125%]${data.title}[/size][/color][/align]`

                const genTitle = text => {
                    return `[color=purple][size=115%][b]· ${text}[/b][/size][/color][h][/h]`
                }
                const genContent = title => {
                    if (title.includes('小组赛')) {
                        return genAutoUpdateBlocks('au-groupmatches-day{i}')
                    } else if (title === '淘汰赛') {
                        return genAutoUpdateBlocks('au-playoffs-day{i}')
                    } else {
                        return '待更新\n'
                    }

                    function genAutoUpdateBlocks (key) {
                        let content = ''
                        for (let i = 1; i <= 10; i++) {
                            const _key = key.replace('{i}', i)
                            content += `[size=0%][${_key}-start][/size]`
                            content += `[size=0%][${_key}-end][/size]`
                            content += '\n'
                        }
                        return content
                    }
                }

                result += `\n\n${genTitle('赛事简介')}`
                result += `\n[quote][list]`
                if (data.baseInfo['主办方']) {
                    result += `\n[*][b]主办方:[/b] ${data.baseInfo['主办方']}`
                }
                if (data.baseInfo['类型']) {
                    let _type = data.baseInfo['类型']
                    if (_type === '线上赛') {
                        if (data.baseInfo['服务器']) {
                            _type += `(${data.baseInfo['服务器']})`
                        }
                    } else {
                        const location = []
                        if (data.baseInfo['位置']) location.push(data.baseInfo['位置'])
                        if (data.baseInfo['地点']) location.push(data.baseInfo['地点'])
                        if (location.length) {
                            _type += `(${location.join(' - ')})`
                        }
                    }
                    result += `\n[*][b]类型:[/b] ${_type}`
                }
                if (data.baseInfo['开始日期']) {
                    result += `\n[*][b]开始日期:[/b] ${data.baseInfo['开始日期']}`
                }
                if (data.baseInfo['结束日期']) {
                    result += `\n[*][b]结束日期:[/b] ${data.baseInfo['结束日期']}`
                }
                result += `\n[/list][/quote]`
                if (data.matchFormat) {
                    result += `\n[quote]${data.matchFormat}\n[/quote]`
                }

                result += `\n\n${genTitle('参赛战队')}`
                result += `\n[quote]待更新\n[/quote]`

                data.otherBlocks.forEach(block => {
                    result += `\n\n${genTitle(block)}`
                    result += `\n[quote]${genContent(block)}[/quote]`
                })

                result += `\n\n${genTitle('最终结果')}`
                result += `\n[quote]待更新\n[/quote]`

                console.log(data)
                GM_setClipboard(result)
                alert('复制成功')
            },
            /*cellAction*/ cell => {
                const container = document.getElementById("firstHeading")
                container.appendChild(cell)
            }
        )
    }

    /** 生成获取小组赛排名的按钮UI
      * Patch: 1.1.3, Date: 2024.02.29
      */
    function generateGroupStageRankingCatcherUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_GroupStageRankingCatcher'
        const getColor = className => {
            switch(className) {
                case 'bg-up': return 'green'
                case 'bg-stay': return 'orange'
                case 'bg-down': return 'red'
                default: return ''
            }
        }
        const onclick = e => {
            const groups = []
            const groupTables = $(e.target).parents('h2:first').nextUntil('h2').find('.grouptable')
            groupTables.each(function() {
                const rows = $(this).find('tr')
                const group = {}
                // try-get group name
                let h3 = $(this)
                while (!h3.is('body')) {
                    const prevs = h3.prevAll('h3:first')
                    if (prevs.length) { h3 = prevs; break; }
                    else { h3 = h3.parent(); }
                }
                if (h3.is('body')) h3 = null
                const title_h3 = h3?.find('.mw-headline:first')?.text()
                const title_table = $(rows[0]).text()
                if (!title_table.match(/积分榜|Standings/i)) {
                    group.name = title_table
                } else if (h3 != null) {
                    group.name = title_h3
                } else {
                    group.name = '未知'
                }

                group.teams = []
                for (let i = 1; i < rows.length; i++) {
                    const team = {}
                    const row = rows[i]
                    team.color = getColor(row.className)
                    const cells = $(row).children('td')
                    const cell_rank = cells[0]
                    team.rank = $(cell_rank).text()
                    team.rankColor = getColor(cell_rank.className)
                    const cell_team = cells[1]
                    team.teamName = $(cell_team).find('.team-template-text:first').text()
                    const cell_score_1 = cells[2]
                    team.score1 = $(cell_score_1).text()
                    const cell_score_2 = cells[3]
                    team.score2 = $(cell_score_2)?.text()
                    group.teams.push(team)
                }

                groups.push(group)
            })
            GM_setClipboard(JSON.stringify(groups))
            alert('复制成功')
        }
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '复制排名(JSON)',
            /*tip*/ '将阶段排名以JSON格式复制,从而可以进一步操作',
            /*onclick*/ onclick,
            /*cellAction*/ cell => {
                $('h2').each(function() {
                    const title = $(this).text()
                    if (title.match(/小组|Group/i)) {
                        const _cell = cell.cloneNode(true) // 生成多个按钮时,必须使用深拷贝切断引用
                        _cell.addEventListener("click", onclick)
                        this.append(_cell)
                    }
                })
            }
        )
    }

    /** 生成获取比赛所有信息的按钮UI (仅限Liquipedia DB页面 / 需要登录)
      * Patch: 1.1.2, Date: 2024.02.22
      */
    function generateDbCatcherUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_DbCatcher'
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '复制所有信息(JSON)',
            /*tip*/ '将比赛的所有信息以JSON格式复制,从而可以进一步操作',
            /*onclick*/ () => {
                const data = {}
                $('.table-responsive').each(function() {
                    const o = {}
                    const rows = $(this).find('tr')
                    for (let i = 0; i < rows.length; i++) {
                        const row = $(rows[i])
                        const key = row.children('td:first').children('code').text()
                        if (!key) continue
                        const value = row.children('td:last').text()
                        o[key] = value
                    }
                    const group = $(this).prevAll('h3:first').contents()[0].textContent
                    if (!data[group]) data[group] = [o]
                    else data[group].push(o)
                })
                GM_setClipboard(JSON.stringify(data))
                alert('复制成功')
            },
            /*cellAction*/ cell => {
                const container = document.getElementById("firstHeading")
                container.appendChild(cell)
            }
        )
    }

    /** 生成获取所有比赛信息的按钮UI
      * Patch: 1.1.1, Date: 2024.02.16
      */
    function generateAllMatchesCatcherUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_AllMatchesCatcher'
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '复制所有比赛(JSON)',
            /*tip*/ '将所有比赛信息以JSON格式复制,从而可以进一步操作',
            /*onclick*/ () => {
                const catchClassKey = 'monatliq-matches-block'
                $('.toggle-area').addClass(catchClassKey)
                $('.toggle-group').addClass(catchClassKey)
                $('.brkts-bracket-wrapper').addClass(catchClassKey)
                const matches = []
                $('.brkts-match-info-popup').each(function(){
                    const team_left = {}, team_right = {}
                    const team_names = $(this).find('span.name')
                    const team_icons = $(this).find('.team-template-image-icon')
                    team_left.name = $(team_names[0]).text()
                    if (!team_left.name) team_left.name = '待定'
                    team_left.logo_src = $(this).find('.team-template-image-icon:nth(1)').find('img')[0]?.src
                    team_right.name = $(team_names[1])?.text()
                    if (!team_right.name) team_right.name = '待定'
                    team_right.logo_src = $(this).find('.team-template-image-icon:nth(2)').find('img')[0]?.src

                    team_left.score = $(this).find('.brkts-popup-header-opponent-score-left:first').text()
                    team_right.score = $(this).find('.brkts-popup-header-opponent-score-right:first').text()

                    const match_group = $(this).parents('div.' + catchClassKey + ':last').prevAll('h2:first').children('span:first').text()

                    const match = {
                        team_left: team_left,
                        team_right: team_right,
                        group: match_group
                    }
                    const page_timer = $(this).find('.timer-object')[0]
                    match.date = page_timer?.dataset?.timestamp
                    if (page_timer?.dataset?.finished) {
                        match.finished = true
                    } else {
                        match.finished = false
                    }
                    match.games = []

                    if (!match.date) {
                        return // 没有开始日期的比赛不予记录
                    }

                    // 小组赛时，尝试抓取比赛所属的组别
                    const groupStageMatchTitle = $(this).parent().prevAll('.brkts-matchlist-title:last').contents()[0]?.textContent
                    if (groupStageMatchTitle) {
                        const pedictGroup = groupStageMatchTitle.slice(-1)
                        if (pedictGroup.match(/[A-Z]/)) {
                            match.type = pedictGroup
                        }
                    }

                    let ptr = 0
                    $(this).find('.brkts-popup-body-game').each(function() {
                        const left_team_picks = [], right_team_picks = []
                        $(this).find('.brkts-popup-body-element-thumbs-left:first').find('img').each(function() {
                            left_team_picks.push(this.alt)
                        })
                        $(this).find('.brkts-popup-body-element-thumbs-right:first').find('img').each(function() {
                            right_team_picks.push(this.alt)
                        })

                        const game_duration = $(this).find('abbr:first').text()

                        let game_winner = ''
                        const page_game_results = $(this).find('.brkts-popup-spaced')
                        if ($(page_game_results[0]).find('i.fas').length > 0) {
                            game_winner = 'left'
                        } else if ($(page_game_results[1]).find('i.fas').length > 0) {
                            game_winner = 'right'
                        }

                        match.games.push({
                            winner: game_winner,
                            duration: game_duration,
                            finished: !game_duration.match('Game'),
                            left_team_picks: left_team_picks,
                            right_team_picks: right_team_picks
                        })
                    })
                    matches.push(match)
                })

                GM_setClipboard(JSON.stringify(matches))
                alert('复制成功')
            },
            /*cellAction*/ cell => {
                const container = document.getElementById("firstHeading")
                container.appendChild(cell)
            }
        )
    }

    /** 生成获取奖金池及最终结果信息的按钮UI
      * Patch: 1.1.0, Date: 2024.02.01
      */
    function generatePrizePoolCatcherUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_PrizePoolCatcher'
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '复制为JSON',
            /*tip*/ '将奖金池及最终结果信息以JSON格式复制,从而可以进一步操作',
            /*onclick*/ () => {
                let rankIndex = 0, prizeIndex = 1, extraPrizeIndex, extraPrizeType, teamBeginIndex = 1
                const header = $('.prizepooltable-header')[0]
                const head_cells = $(header).children('.csstable-widget-cell')
                for (let index = 0; index < head_cells.length; index++) {
                    const _title = head_cells[index]?.textContent?.trim() ?? ''
                    if (_title.match('名次')) {
                        rankIndex = index
                    } else if (_title.match('美元')) {
                        prizeIndex = index
                    } else if (_title.match('积分')) {
                        extraPrizeIndex = index; extraPrizeType = _title
                    } else if (_title.match('参赛队伍')) {
                        teamBeginIndex = index - 1
                    }
                }
                myForEach(head_cells, _cell => {
                    const title = _cell?.textContent?.trim()
                })

                const rows = $('.csstable-widget-row:not(.prizepooltable-header)')
                const result = []

                myForEach(rows, _row => {
                    const row = $(_row)
                    const cells = row.children('.csstable-widget-cell')
                    if (!cells[2]) return // 排除表格的折叠ui

                    const rank = cells[rankIndex].textContent.trim()
                    let prize = cells[prizeIndex].textContent.trim()
                    if (extraPrizeIndex) {
                        prize += ' & ' + cells[extraPrizeIndex].textContent.trim() + ' ' + extraPrizeType
                    }

                    const teams = []
                    const team_cells = $(cells[teamBeginIndex]).nextAll()
                    myForEach(team_cells, team_cell => {
                        const team_info_doms = $(team_cell).find('a')
                        const icon_dom = team_info_doms[0]
                        const name_dom = team_info_doms[team_info_doms.length-1]
                        const team_image_src = $(icon_dom)?.children('img')[0]?.src
                        const team_name = $(name_dom)?.text()?.trim()
                        teams.push({ team_image_src, team_name })
                    })
                    result.push({ rank, prize, teams })
                })

                GM_setClipboard(JSON.stringify(result))
                alert('复制成功')
            },
            /*cellAction*/ cell => {
                const container = $('.prizepool-section-wrapper:first').prev()[0].nodeName === 'H2'
                      ? $('.prizepool-section-wrapper:first').prev()
                      : $('.prizepool-section-wrapper:first').prevUntil('h2').prev()
                container.append(cell)
            }
        )
    }

    /** [1.0.0] 生成'启用/禁用编辑模式'的按钮UI */
    function generatePageEditUi() {
        retry_count = 0 // 重置重试计数器
        const cellId = 'LiquipediaPageModifier_PageEdit'
        generateLiquipediaCell(
            /*id*/ cellId,
            /*text*/ '启用编辑模式',
            /*tip*/ '允许或禁止直接在页面输入修改内容',
            /*onclick*/ () => {
                console.warn('document.body.contentEditable:', document.body.contentEditable)
                const currEditable = document.body.contentEditable
                const _clicker = document.getElementById(cellId)
                if (currEditable === 'true') {
                    _clicker.innerHTML = '启用编辑模式'
                    document.body.contentEditable = 'inherit'
                } else {
                    _clicker.innerHTML = '禁用编辑模式'
                    document.body.contentEditable = true
                }
            },
            /*cellAction*/ cell => {
                const header = document.getElementById("firstHeading");
                header.appendChild(cell)
            }
        )
    }

    /** 生成通用的Liquipedia超链接CellUI
      * Patch: 1.1.0, Date: 2024.02.01
      *
      * @param id cell的超链接部分的HTML-ID
      * @param text cell的超链接部分的文本
      * @param tip 鼠标悬浮在cell的超链接部分上时的提示(title)
      * @param onclick cell的超链接部分的点击事件,可以填写超链接或点击事件
      * @param cellAction 生成按钮成功之后执行的事件(callback)
      */
    function generateLiquipediaCell(id, text, tip, onclick, cellAction) {
        try {
            const cell = document.createElement("span")
            cell.className = 'mw-editsection';

            const left_sb = document.createElement("span")
            left_sb.className = 'mw-editsection-bracket'
            left_sb.innerHTML = '['
            const right_sb = document.createElement("span")
            right_sb.className = 'mw-editsection-bracket'
            right_sb.innerHTML = ']'

            const clicker = document.createElement("a")
            clicker.id = id
            clicker.innerHTML = text
            clicker.title = tip
            if (typeof(onclick) === 'string') {
                clicker.href = onclick
            } else {
                clicker.href = 'javascript:void(0);'
                clicker.addEventListener("click", onclick)
            }

            cell.appendChild(left_sb)
            cell.appendChild(clicker)
            cell.appendChild(right_sb)

            cellAction(cell)
        } catch (e) {
            if (retry_count < 30) {
                console.warn(id + ' generate failed due to', e, ' . Retrying...');
                retry_count++;
                setTimeout(() => {
                    generateLiquipediaCell();
                }, 50);
            } else {
                console.error(id + ' generate failed and retry count goes to its limit.');
            }
        }
    }

    /**
      * 自定义的遍历方法,可以处理一些不支持array.forEach的数组
      * 如果要使用异步的处理函数,请使用myForEachAsync
      * @param {any[]} array 传入要遍历的对象
      * @param {Function} cb 遍历元素的处理函数 any => void
      */
    function myForEach(array, cb) {
        if (!array || !array.length || !cb) {
            return
        }
        for (let i = 0; i < array.length; i++) {
            const element = array[i]
            cb(element)
        }
    }
    async function myForEachAsync(array, cb) {
        if (!array || !array.length || !cb) {
            return
        }
        for (let i = 0; i < array.length; i++) {
            const element = array[i]
            await cb(element)
        }
    }
})();
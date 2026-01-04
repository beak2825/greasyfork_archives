// ==UserScript==
// @name         Liquipedia Statistics Catcher
// @namespace    fufu.net
// @version      0.9.11
// @description  Get statistics table.
// @author       monat151
// @match        https://liquipedia.net/dota2/*/Statistics*
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/461383/Liquipedia%20Statistics%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/461383/Liquipedia%20Statistics%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /** 赛程贴tid */
    const var_MatchTid = '44015356';
    /** 比赛版本 */
    const var_MatchPatch = '7.38c';

    const threshold_HotHeroBpRate = 60; // 热门英雄的BP率标准
    const threshold_GoodWinRatexx = 55; // 优秀胜率的阈值
    const threshold_BadWinRatexxx = 45; // 糟糕胜率的阈值
    const threshold_LeastPickTime = 5; // 二次分析要求的PICK场次最小值
    const threshold_RbLeastPickTime = 5; // 胜率红黑榜要求的PICK场次最小值

    function sortBy(property, asc) {
        if (asc==undefined) {
            asc = -1
        } else {
            asc=asc ? -1 : 1
        }
        return function (value1, value2) {
            let a = value1[property]
            let b = value2[property]
            return a < b ? asc : a > b ? asc*-1 : 0
        }
    }
    function getTable() {
        let _commonArray_AllStatisticRows = []
        let _anaArray_PatchAnswers = []
        let _anaArray_PatchTraps = []
        let _anaArray_RedBlackRows = []
        console.warn('Catch starts.')
        const matchName = document.getElementById('firstHeading')?.children[0]?.innerText?.replace(' Statistics', '') ?? '未知比赛'
        const tableElement = document.getElementsByClassName('wikitable table-striped sortable jquery-tablesorter')[0]
        console.log('table:', tableElement)
        const tableBodies = tableElement.children[1].children //.children[0]
        var result = `[quote][b]数据来源:[/b] [url=${document.location.href}]liquipedia 统计数据[/url]
[b]比赛版本:[/b] ${var_MatchPatch}[/quote]
[quote]本贴是关于 [b]${matchName}[/b] 的赛事统计数据。
更多赛事内容请参阅[url]https://bbs.nga.cn/read.php?tid=${var_MatchTid}[/url][/quote]
[quote][b]上次更新:[/b] ${new Date().toLocaleString()}
数据统计贴可能在每日比赛结束或比赛阶段(小组赛阶段、淘汰赛阶段等)结束时更新。[/quote]

[quote][b]1. 英雄B/P场次排名[/b][h][/h]
[collapse=点此查看]
[table]
[tr]
[td][align=center][b]排名[/b][/align][/td]
[td][align=center][b]英雄[/b][/align][/td]
[td][align=center][b]B&P场次[/b][/align][/td]
[td][align=center][b]BAN[/b][/align][/td]
[td][align=center][b]PICK[/b][/align][/td]
[td][align=center][b]胜场[/b][/align][/td]
[td][align=center][b]胜率[/b][/align][/td]
[/tr]`
        for (var i=0; i<tableBodies.length; i++) {
            const rank = i+1
            const line = tableBodies[i]
            var heroName = line.children[1].outerText.substring(1)
            const pick = line.children[2].outerText
            const pickRate = line.children[6].outerText
            const ban = line.children[15].outerText
            const banRate = line.children[16].outerText
            const BandP = Number(line.children[17].outerText)
            const bandpRate = line.children[18].outerText
            const win = line.children[3].outerText
            const winRate = line.children[5].outerText
            _commonArray_AllStatisticRows.push({
                rank: rank,
                heroName: heroName,
                pick: pick, pickRate: pickRate,
                ban: ban, banRate: banRate,
                BandP: BandP, bandpRate: bandpRate,
                win: win, winRate: winRate
            })
            const _num_bpRate = Number(bandpRate.replace('%', ''))
            const _num_winRate = Number(winRate.replace('%', ''))
            const _num_picks = Number(pick)
            if (_num_bpRate >= threshold_HotHeroBpRate && _num_winRate >= threshold_GoodWinRatexx && _num_picks >= threshold_LeastPickTime) {
                _anaArray_PatchAnswers.push({
                    heroName: heroName,
                    pick: pick, pickRate: pickRate,
                    ban: ban, banRate: banRate,
                    BandP: BandP, bandpRate: bandpRate,
                    win: win, winRate: winRate
                })
            }
            if (_num_bpRate >= threshold_HotHeroBpRate && _num_winRate <= threshold_BadWinRatexxx && _num_picks >= threshold_LeastPickTime) {
                _anaArray_PatchTraps.push({
                    heroName: heroName,
                    pick: pick, pickRate: pickRate,
                    ban: ban, banRate: banRate,
                    BandP: BandP, bandpRate: bandpRate,
                    win: win, winRate: _num_winRate
                })
            }
            if (_num_picks >= threshold_RbLeastPickTime) {
                _anaArray_RedBlackRows.push({
                    heroName: heroName,
                    pick: pick, pickRate: pickRate,
                    ban: ban, banRate: banRate,
                    BandP: BandP, bandpRate: bandpRate,
                    win: win, winRate: _num_winRate
                })
            }
            _anaArray_PatchAnswers = _anaArray_PatchAnswers.sort(sortBy('winRate', false))
            _anaArray_PatchTraps = _anaArray_PatchTraps.sort(sortBy('winRate', true))
        }
        _commonArray_AllStatisticRows = _commonArray_AllStatisticRows.sort(sortBy('BandP', false))
        let team_bp_rank = 1
        _commonArray_AllStatisticRows.forEach((row) => {
            result += generateTableRow(team_bp_rank, row)
            team_bp_rank++
        })
        result += '[/table][/collapse][/quote]'

        const allTables = document.getElementsByClassName('wikitable')
        const matchLengthTable = allTables[allTables.length - 4].children[0]
        const unPickTable = allTables[allTables.length - 3].children[0].children[1].children[0].children[0].children
        const unBanTable = allTables[allTables.length - 2].children[0].children[1].children[0].children[0].children
        const unBPTable = allTables[allTables.length - 1].children[0].children[1].children[0].children[0].children

        const matchLengthTitles = matchLengthTable.children[1].children
        const matchLengthContents = matchLengthTable.children[2].children
        result += `

[quote][b]2. 比赛时长统计[/b][h][/h]
[collapse=点此查看][table][tr]
[td1][align=center][b]时长[/b][/align][/td]`
        for (i=0;i<matchLengthTitles.length;i++) {
            result += `[td1][align=center][b]${matchLengthTitles[i].outerText}[/b][/align][/td]`
        }
        result += `[/tr][tr]
[td1][align=center][b]场次[/b][/align][/td]`
        const _match_length_array = []; let _match_length_count = 0
        for (i=0;i<matchLengthContents.length;i++) {
            const _cont = Number(matchLengthContents[i].outerText)
            result += `[td1][align=center]${matchLengthContents[i].outerText}[/align][/td]`
            _match_length_array.push(_cont); _match_length_count += _cont
        }
        result += `[/tr][tr]
[td1][align=center][b]比例[/b][/align][/td]`
        _match_length_array.forEach((m) => {
            result += `[td1][align=center]${(m / _match_length_count * 100).toFixed(2)}%[/align][/td]`
        })
        result += `[/tr][/table][/collapse][/quote]`

        result += `

[quote][b]3. 尚未被PICK的英雄${ unPickTable.length ? '(共' + unPickTable.length + '位)' : '' }[/b][h][/h]
`
        var hrs = ''
        if (unPickTable.length) {
            result += `[collapse=点此查看]
`
            hrs = ''
            for (i=0;i<unPickTable.length;i++) {
                if (hrs != '') { hrs += ' | '}
                hrs += `${unPickTable[i].title}`
            }
            result += hrs + '[/collapse]'
        } else {
            result += '在本比赛中，所有的英雄都曾经被选用过。'
        }
        result += '[/quote]'

        result += `

[quote][b]4. 尚未被BAN的英雄${ unBanTable.length ? '(共' + unBanTable.length + '位)' : '' }[/b][h][/h]
`
        if (unBanTable.length) {
            result += `[collapse=点此查看]
`
            hrs = ''
            for (i=0;i<unBanTable.length;i++) {
                if (hrs != '') { hrs += ' | '}
                hrs += `${unBanTable[i].title}`
            }
            result += hrs + '[/collapse]'
        } else {
            result += '在本比赛中，所有的英雄都曾经被禁用过。'
        }
        result += '[/quote]'

        result += `

[quote][b]5. 尚未被BAN/PICK的英雄${ unBPTable.length ? '(共' + unBPTable.length + '位)' : '' }[/b][h][/h]
`
        if (unBPTable.length) {
            result += `[collapse=点此查看]
`
            hrs = ''
            for (i=0;i<unBPTable.length;i++) {
                if (hrs != '') { hrs += ' | '}
                hrs += `${unBPTable[i].title}`
            }
            result += hrs + '[/collapse]'
        } else {
            result += '在本比赛中，所有的英雄都曾经被禁用或选用过。'
        }
        result += '[/quote]'

        const matchCountBody = tableElement.children[2].children[0]
        const _m_total = matchCountBody.children[1].innerHTML.split(' ')[0]
        const _m_radient_won = matchCountBody.children[2].innerHTML.split('W')[0]
        const _m_radient_winrate = matchCountBody.children[2].innerHTML.split('(')[1].replace(')','')
        const _m_dire_won = matchCountBody.children[3].innerHTML.split('W')[0]
        const _m_dire_winrate = matchCountBody.children[3].innerHTML.split('(')[1].replace(')','')
        result += `

[quote][b]6. 天辉/夜魇胜场统计[/b][h][/h]
[table][tr]
[td36][align=center][b]总场数[/b][/align][/td]
[td32][align=center][b]天辉方胜场[/b][/align][/td]
[td32][align=center][b]夜魇方胜场[/b][/align][/td][/tr]
[tr]
[td][align=center][b]${_m_total}[/b][/align][/td]
[td][align=center]${_m_radient_won}[size=60%][color=silver](${_m_radient_winrate})[/color][/size][/align][/td]
[td][align=center]${_m_dire_won}[size=60%][color=silver](${_m_dire_winrate})[/color][/size][/align][/td][/tr][/table][/quote]
`

        result += `
[quote][b]7. 数据分析[/b][h][/h]
[color=red]下方内容是对统计数据的机械筛选分析。[/color]
`

        result += `[b]7.1 | 版本答案[/b] (BP率>=${threshold_HotHeroBpRate}%, 胜率>=${threshold_GoodWinRatexx}%, 上场次数>=${threshold_LeastPickTime})
`
        if (_anaArray_PatchAnswers.length > 0) {
            const heroes = []
            _anaArray_PatchAnswers.forEach((line) => {
                heroes.push(line.heroName)
            })
            result += `[collapse=点此查看概览]${heroes.join(' | ')}[/collapse][collapse=点此查看详情]
[table]
[tr]
[td][align=center][b]排名[/b][/align][/td]
[td][align=center][b]英雄[/b][/align][/td]
[td][align=center][b]B&P场次[/b][/align][/td]
[td][align=center][b]BAN[/b][/align][/td]
[td][align=center][b]PICK[/b][/align][/td]
[td][align=center][b]胜场[/b][/align][/td]
[td][align=center][b]胜率[/b][/align][/td]
[/tr]`
            let rank = 1
            _anaArray_PatchAnswers.forEach((line) => {
                result += `[tr]
[td][align=center]${rank}[/align][/td]
[td][align=center]${line.heroName}[/align][/td]
[td][align=center]${line.BandP}[size=60%][color=silver](${line.bandpRate})[/color][/size][/align][/td]
[td][align=center]${line.ban}[size=60%][color=silver](${line.banRate})[/color][/size][/align][/td]
[td][align=center]${line.pick}[size=60%][color=silver](${line.pickRate})[/color][/size][/align][/td]
[td][align=center]${line.win}[/align][/td]
[td][align=center]${line.winRate}[/align][/td][/tr]
`
                rank++
            })
            result += `[/table][/collapse]
`
        } else {
            result += `无

`
        }

        result += `[b]7.2 | 版本陷阱[/b] (BP率>=${threshold_HotHeroBpRate}%, 胜率<=${threshold_BadWinRatexxx}%, 上场次数>=${threshold_LeastPickTime})
`
        if (_anaArray_PatchTraps.length > 0) {
            const heroes = []
            _anaArray_PatchTraps.forEach((line) => {
                heroes.push(line.heroName)
            })
            result += `[collapse=点此查看概览]${heroes.join(' | ')}[/collapse][collapse=点此查看详情]
[table]
[tr]
[td][align=center][b]排名[/b][/align][/td]
[td][align=center][b]英雄[/b][/align][/td]
[td][align=center][b]B&P场次[/b][/align][/td]
[td][align=center][b]BAN[/b][/align][/td]
[td][align=center][b]PICK[/b][/align][/td]
[td][align=center][b]胜场[/b][/align][/td]
[td][align=center][b]胜率[/b][/align][/td]
[/tr]`
            let rank = 1
            _anaArray_PatchTraps.forEach((line) => {
                result += generateTableRow(rank, line)
                rank++
            })
            result += `[/table][/collapse]
`
        } else {
            result += `无

`
        }

        result += `[b]7.3 | 胜率红黑榜[/b] (上场次数>=${threshold_RbLeastPickTime})
`

        result += `· 7.3.1 | 红榜 (胜率前5名)[h][/h]
`
        _anaArray_RedBlackRows = _anaArray_RedBlackRows.sort(sortBy('winRate', false))
        result += `[collapse=点此查看][table]
[tr]
[td][align=center][b]排名[/b][/align][/td]
[td][align=center][b]英雄[/b][/align][/td]
[td][align=center][b]B&P场次[/b][/align][/td]
[td][align=center][b]BAN[/b][/align][/td]
[td][align=center][b]PICK[/b][/align][/td]
[td][align=center][b]胜场[/b][/align][/td]
[td][align=center][b]胜率[/b][/align][/td]
[/tr]`
        var redBlackLineCount = Math.min(5, _anaArray_RedBlackRows.length);
        for (let i = 0; i < redBlackLineCount; i++) {
            result += generateTableRow(i+1, _anaArray_RedBlackRows[i])
        }
            result += `[/table][/collapse]
`

        result += `· 7.3.2 | 黑榜 (胜率末5名)[h][/h]
`
        _anaArray_RedBlackRows = _anaArray_RedBlackRows.sort(sortBy('winRate', true))
        result += `[collapse=点此查看][table]
[tr]
[td][align=center][b]排名[/b][/align][/td]
[td][align=center][b]英雄[/b][/align][/td]
[td][align=center][b]B&P场次[/b][/align][/td]
[td][align=center][b]BAN[/b][/align][/td]
[td][align=center][b]PICK[/b][/align][/td]
[td][align=center][b]胜场[/b][/align][/td]
[td][align=center][b]胜率[/b][/align][/td]
[/tr]`
        for (let i = 0; i < redBlackLineCount; i++) {
            result += generateTableRow(i+1, _anaArray_RedBlackRows[i])
        }
            result += `[/table][/collapse]
`

        result += `[/quote]`

        GM_setClipboard(result)
        alert('复制成功')
    }
    function generateTableRow(rank, line) {
        const banCell = `${line.ban}[size=60%][color=silver](${line.banRate})[/color][/size]`
        const pickCell = `${line.pick}[size=60%][color=silver](${line.pickRate})[/color][/size]`
        return `[tr]
[td][align=center]${rank}[/align][/td]
[td][align=center]${line.heroName}[/align][/td]
[td][align=center]${line.BandP}[size=60%][color=silver](${line.bandpRate})[/color][/size][/align][/td]
[td][align=center]${banCell}[/align][/td]
[td][align=center]${pickCell}[/align][/td]
[td][align=center]${line.win}[/align][/td]
[td][align=center]${typeof(line.winRate) == 'number' ? line.winRate.toFixed(2) + '%' : line.winRate}[/align][/td][/tr]
`
    }
    function generateButtons() {
        var retry_count = 0
        try {
            const parent = document.getElementsByClassName('wikitable table-striped sortable jquery-tablesorter')[0].children[0].children[0].children[0]
            var copyer = document.createElement('a');
            copyer.innerHTML = `<a href="javascript:void(0)" title="复制为NGA表格" >复制到NGA</a>`
            copyer.addEventListener('click', ()=>{getTable()});
            parent.appendChild(copyer);
        }
        catch(e) {
            if (retry_count < 30) {
                console.warn('generate failed. Retrying...')
                retry_count++;
                setTimeout(()=>{
                    generateButtons()
                },1000)
            } else {
                console.error('generate failed and retry count goes to its limit. Use "window.selfdef_copyToNga_Statistics" to call.')
                window.selfdef_copyToNga_Statistics = getTable
            }
        }
    }

    setTimeout(()=>{
        // window.selfdef_copyToNga_Statistics = getTable
        generateButtons()
    },1000);
})();
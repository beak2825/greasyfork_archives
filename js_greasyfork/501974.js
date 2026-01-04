// ==UserScript==
// @name         500ok
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  从500彩票网和澳客网提取足彩信息
// @author       onedayl
// @match        https://odds.500.com/fenxi/shuju-*.shtml
// @match        https://odds.500.com/fenxi/ouzhi-*.shtml
// @match        https://odds.500.com/fenxi/yazhi-*.shtml
// @match        https://odds.500.com/fenxi/daxiao-*.shtml
// @match        https://www.okooo.com/jingcai/
// @match        https://www.okooo.com/soccer/match/*/history/
// @match        https://www.okooo.com/soccer/match/*/exchanges/
// @match        https://www.okooo.com/jingcai/shuju/peilv/
// @icon         https://www.500.com/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/501974/500ok.user.js
// @updateURL https://update.greasyfork.org/scripts/501974/500ok.meta.js
// ==/UserScript==

const style = `
#float-ball {
    position: fixed;
    bottom: 330px;
    right: 88px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 30px;
    background-color: #E60013;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    z-index: 9999;
    cursor: pointer;
}

.message {
    max-width: 200px;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    background-color: #E60013;
    border-radius: 6px;
    padding: 10px 14px;
    position: fixed;
    top: -42px;
    left: calc(50% - 100px);
    z-index: 9999;
    transition: top 0.1s ease-out;
}

.message-show {
    top: 100px;
}
`

GM_addStyle(style);
let gameId = '';

async function getDataInfo() {
    const infoList = []

    // 比赛时间
    const gameTime = /比赛时间(.*)/.exec(document.querySelector('.game_time').innerText)[1]
    infoList.push(gameTime)

    // 比赛场次
    const gameSerial = document.querySelector('#link73').innerText
    infoList.push(gameSerial)

    // 对战双方
    const hdNameEl = document.querySelectorAll('.hd_name')
    const teamHostEl = hdNameEl[0]
    const teamHost = teamHostEl.innerText
    const teamGuestEl = hdNameEl[2]
    const teamGuest = teamGuestEl.innerText
    infoList.push(`${teamHost} vs ${teamGuest}\n`)

    // 两队排名
    const teamHostRank = teamHostEl.parentElement.nextSibling.innerText
    const teamGuestRank = teamGuestEl.parentElement.nextSibling.innerText

    infoList.push(`两队排名\n${teamHost}：${teamHostRank}`)
    infoList.push(`${teamGuest}：${teamGuestRank}\n`)

    // 交战历史
    infoList.push(`两队交战历史\n赛事 比赛日期 主队 比分 客队 半场 赛果`)
    const gameHistoryRows = Array.from(document.querySelectorAll('#team_jiaozhan tr'))

    for(let i = 2; i < gameHistoryRows.length; i++) {

        const gameHistoryCols = Array.from(gameHistoryRows[i].querySelectorAll('td'))
        const gameHistoryInfo = []

        for(let j = 0; j < gameHistoryCols.length; j++) {
            gameHistoryInfo.push(gameHistoryCols[j].innerText.replaceAll('\n', ' '))
            if(j == 4) { break}
        }

        infoList.push(gameHistoryInfo.join(' '))
    }

    await GM_setValue('totalInfo', infoList.join('\n'))
    await sleep(500)
    location.href = `https://odds.500.com/fenxi/ouzhi-${getGameId()}.shtml`
}

async function getEuropeIndexInfo() {
    const infoList = []
    const avwinc2 = document.querySelector('#avwinc2').innerText
    const avdrawc2 = document.querySelector('#avdrawc2').innerText
    const avlostc2 = document.querySelector('#avlostc2').innerText
    const avwinj2 = document.querySelector('#avwinj2').innerText
    const avdrawj2 = document.querySelector('#avdrawj2').innerText
    const avlostj2 = document.querySelector('#avlostj2').innerText

    infoList.push(`\n\n胜负值\n初始胜负值：${avwinc2} ${avdrawc2} ${avlostc2}`)
    infoList.push(`即时胜负值：${avwinj2} ${avdrawj2} ${avlostj2}`)

    await GM_setValue('totalInfo', await GM_getValue('totalInfo') + infoList.join('\n'))
    await sleep(500)
    location.href = `https://odds.500.com/fenxi/yazhi-${getGameId()}.shtml`
}

async function getAsiaIndexInfo() {
    const infoList = []
    const plTables = document.querySelectorAll('.pl_table_data')

    infoList.push(`\n\n让球\n初始让球：${plTables[3].innerText.split('\t').join(' ')}`)
    infoList.push(`即时让球：${plTables[2].innerText.replaceAll('↑', '').replaceAll('↓', '').split('\t').join(' ')}`)

    await GM_setValue('totalInfo', await GM_getValue('totalInfo') + infoList.join('\n'))
    await sleep(500)
    location.href = `https://odds.500.com/fenxi/daxiao-${getGameId()}.shtml`
}

async function getBigOrSmallInfo() {
    const infoList = []
    const plTables = document.querySelectorAll('.pl_table_data')

    infoList.push(`\n\n进球\n初始进球：${plTables[3].innerText.split('\t').join(' ')}`)
    infoList.push(`即时进球：${plTables[2].innerText.replaceAll('↑', '').replaceAll('↓', '').split('\t').join(' ')}`)

    await GM_setValue('totalInfo', await GM_getValue('totalInfo') + infoList.join('\n'))
    await sleep(500)
    location.href = 'https://www.okooo.com/jingcai/'
}

async function getExchangeInfo() {
    const infoList = []
    const trEls = document.querySelectorAll('.noBberBottom')[0].querySelectorAll('tr')

    for(let i = 2; i < trEls.length; i++) {
        const tdList = trEls[i].innerText.replaceAll('\n', '').split('\t')
        infoList.push(`${tdList[0]} ${tdList[5]} ${tdList[6]} ${tdList[7]} ${tdList[8]}`)
    }

    await GM_setValue('temExchangeInfo', JSON.stringify(infoList))
    await sleep(500)
    location.href = 'https://www.okooo.com/jingcai/shuju/peilv/'

}

async function getKellyVarianceInfo() {
    const tableEl = document.querySelector(`#table${gameId}`)
    const infoList = []

    if(tableEl) {
        const trList = tableEl.querySelectorAll('tr')
        const kvList = trList[trList.length -2 ].innerText.split('\t')
        const temExchangeInfo = await GM_getValue('temExchangeInfo')
        const exchangeInfo = JSON.parse(temExchangeInfo).map((itm, idx) => {
            return `${itm} ${kvList[idx + 1]}`
        }).join('\n')

        const infoHead = '球队名称 成交价 成交量 庄家盈亏 赔率 凯利方差(‰)'
        GM_setClipboard(await GM_getValue('totalInfo') + `\n\n市场信息\n${infoHead}\n${exchangeInfo}`, 'text', () => {
            showMessage('全部信息已提取并复制到剪贴板')
        })

        await GM_setValue('gameId', '')
        await GM_setValue('tempExchangeInfo', '')
        await GM_setValue('totalInfo', '')
    }
}


async function showFloatBall() {
    const gameId = /shuju-(\d+)/.exec(location.href)[1]
    await GM_setValue('gameId', gameId)
    const floatBall = document.createElement('div')
    floatBall.id = 'float-ball'
    floatBall.innerText = '500ok'

    floatBall.addEventListener('click', async () => {
        await GM_setValue('gameId', getGameId())
        await GM_setValue('totalInfo', '')
        getDataInfo()
    })

    document.body.append(floatBall)
}

function getGameId() {
    return /-(\d+)/.exec(location.href)[1]
}

function showMessage(msgText) {
    const messageEl = document.createElement('div')
    messageEl.innerText = msgText
    messageEl.classList.add('message')
    document.body.append(messageEl)
    setTimeout(() => {
        messageEl.classList.add('message-show')
    }, 50)

    setTimeout(() => {
        messageEl.remove()
    }, 3000)
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

(function() {
    'use strict'
    window.onload = async function() {
        gameId = await GM_getValue('gameId')

        if(location.href.indexOf('fenxi/shuju') != -1) {
            showFloatBall()

        } else if(gameId != '') {

            if(location.href.indexOf('fenxi/ouzhi') != -1) {
                getEuropeIndexInfo()

            } else if (location.href.indexOf('fenxi/yazhi') != -1) {
                getAsiaIndexInfo()

            } else if (location.href.indexOf('fenxi/daxiao') != -1) {
                getBigOrSmallInfo()

            } else if (location.href == 'https://www.okooo.com/jingcai/') {
                showMessage('请点击进入对应比赛的分析页面')

            } else if (location.href.indexOf('/history/') != -1) {
                const okGameId = /\d+/.exec(location.href)[0]
                await GM_setValue('gameId', okGameId)
                location.href = `https://www.okooo.com/soccer/match/${okGameId}/exchanges/`

            } else if (location.href.indexOf('/exchanges/') != -1) {
                getExchangeInfo()

            } else if (location.href.indexOf('/jingcai/shuju/peilv/') != -1) {
                getKellyVarianceInfo()
            }

        }
    }
})()
// ==UserScript==
// @name         BF1Tracker优化
// @version      20251123
// @description  去广告，自动获取玩家名, 地图名, 北京时间
// @author       bilibili22
// @match        https://tracker.gg/bf1/*
// @icon         https://trackercdn.com/static-files/trackergg/production/dist/client/assets/0r7m9y2i.png
// @grant        GM_xmlhttpRequest
// @connect      ea-api.2788.pro
// @namespace    https://greasyfork.org/users/1281680
// @downloadURL https://update.greasyfork.org/scripts/491265/BF1Tracker%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491265/BF1Tracker%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict'

    function removeAdContainers() {
        document.querySelector('.primisslate')?.remove()
        document.querySelector('.ad-container')?.remove()
        document.querySelector('.bordered-davert')?.remove()
        document.querySelector('[id^="google_ads_iframe_"]')?.remove()
    }

    removeAdContainers()

    const observer = new MutationObserver(removeAdContainers);

    observer.observe(document.body, { childList: true, subtree: true })


    const mapPrettyName = { MP_Amiens: '亚眠', MP_ItalianCoast: '帝国边境', MP_ShovelTown: '攻占托尔', MP_MountainFort: '格拉巴山', MP_Graveyard: '决裂', MP_FaoFortress: '法欧堡', MP_Chateau: '流血宴厅', MP_Scar: '圣康坦的伤痕', MP_Suez: '苏伊士', MP_Desert: '西奈沙漠', MP_Forest: '阿尔贡森林', MP_Giant: '庞然暗影', MP_Verdun: '凡尔登高地', MP_Trench: '尼维尔之夜', MP_Underworld: '法乌克斯要塞', MP_Fields: '苏瓦松', MP_Valley: '加利西亚', MP_Bridge: '勃鲁西洛夫关口', MP_Tsaritsyn: '察里津', MP_Ravines: '武普库夫山口', MP_Volga: '窝瓦河', MP_Islands: '阿尔比恩', MP_Beachhead: '海丽丝岬', MP_Harbor: '泽布吕赫', MP_Ridge: '阿奇巴巴', MP_River: '卡波雷托', MP_Hell: '帕斯尚尔', MP_Offensive: '索姆河', MP_Naval: '黑尔戈兰湾', MP_Blitz: '伦敦：夜袭', MP_London: '伦敦：灾祸', MP_Alps: '剃刀边缘' }
    const modePrettyName = { BreakthroughLarge: '行动模式', Breakthrough: '闪击行动', Conquest: '征服', TugOfWar: '前线', TeamDeathMatch: '团队死斗', Possession: '战争信鸽', Domination: '抢攻', Rush: '突袭', ZoneControl: '空降补给', AirAssault: '空中突击' }

    const xhrOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url) {
        const xhr = this

        function block() {
            xhr.send = () => { }
            return xhrOpen.apply(xhr, arguments)
        }

        if (url.startsWith('https://api.tracker.gg/api/v2/bf1/standard/profile') && url.endsWith('?forceCollect=true')) return block()

        function hook(callback) {
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get
            Object.defineProperty(xhr, 'responseText', {
                get: () => {
                    let resp = getter.call(xhr)
                    if (xhr.status !== 200) return resp
                    resp = callback(resp)
                    return resp
                },
            })
        }

        if (url.startsWith('https://api.tracker.gg/api/v2/bf1/standard/matches/origin/')
            || url.startsWith('https://api.tracker.gg/api/v2/bf1/standard/matches/psn/')
            || url.startsWith('https://api.tracker.gg/api/v2/bf1/standard/matches/xbl/')
        ) {
            hook((resp) => {
                resp = JSON.parse(resp)
                resp.data.matches.forEach(match => {
                    match.metadata.mapName = mapPrettyName[match.attributes.mapKey]
                    match.metadata.gamemodeName = modePrettyName[match.attributes.gamemodeKey.slice(0, -1)]
                })
                resp = JSON.stringify(resp)
                return resp
            })
        } else if (url.startsWith('https://api.tracker.gg/api/v2/bf1/standard/matches/')) {
            hook((resp) => {
                resp = JSON.parse(resp)
                resp.data.metadata.mapName = mapPrettyName[resp.data.attributes.mapKey]
                resp.data.metadata.gamemodeName = modePrettyName[resp.data.attributes.gamemodeKey.slice(0, -1)]
                const date = new Date(resp.data.metadata.timestamp).toLocaleString('zh-cn', { timeZone: 'Asia/Shanghai' })
                const ids = []
                resp.data.segments
                    .filter(data => data.type === 'player' && data.metadata.playerName === 'Unknown')
                    .forEach(player => {
                        player.metadata.playerName = `#${player.attributes.playerId}`
                        ids.push(+player.attributes.playerId)
                    })
                resp = JSON.stringify(resp)

                if (ids.length) {
                    GM_xmlhttpRequest({
                        url: `https://ea-api.2788.pro/v2/utils/getNamesByPersonaIds?personaIds=${ids.join(',')}`,
                        onload(xhr) {
                            if (xhr.status !== 200) {
                                console.error('获取玩家名失败', xhr)
                                return
                            }
                            const playerNames = JSON.parse(xhr.responseText)
                            const replace = async function () {
                                while (true) {
                                    const elements = Array.from(document.querySelectorAll('.player-header .info .name'))
                                    if (!elements.length) {
                                        await new Promise(resolve => setTimeout(resolve, 500))
                                        continue
                                    }
                                    for (const element of elements) {
                                        const text = element.textContent.trim()
                                        if (!text.startsWith('#')) continue
                                        const name = playerNames[text.slice(1)]
                                        if (!name) continue
                                        element.textContent = name
                                        element.href += name
                                        element.parentNode.replaceChild(element.cloneNode(true), element)
                                    }
                                    const timeElement = document.querySelector('.report-info .time')
                                    timeElement.textContent = date
                                    break
                                }
                            }
                            replace()
                        },
                    })
                }

                return resp
            })
        }
        return xhrOpen.apply(xhr, arguments)
    }
})()

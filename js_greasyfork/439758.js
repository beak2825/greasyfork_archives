// ==UserScript==
// @name         Roblox加入最少人的伺服器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  尋找最少人的伺服器加入
// @author       cow03haha
// @match        https://www.roblox.com/games/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439758/Roblox%E5%8A%A0%E5%85%A5%E6%9C%80%E5%B0%91%E4%BA%BA%E7%9A%84%E4%BC%BA%E6%9C%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439758/Roblox%E5%8A%A0%E5%85%A5%E6%9C%80%E5%B0%91%E4%BA%BA%E7%9A%84%E4%BC%BA%E6%9C%8D%E5%99%A8.meta.js
// ==/UserScript==

/* jshint esversion:8 */

(function() {
    const placeId = Number(window.location.pathname.split('/')[2]);
    if (!placeId) return;

    async function findServer(placeId) {
        const server = {
            Guid: '',
            playerCount: 1000,
        }
        let page = 0

        await fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startindex=${page}`)
            .then(response => response.json())
            .then(data => { page = data.TotalCollectionSize - 1 })
            .catch(error => {
                console.log(error)
                alert('發生錯誤! 請稍後重試')
                return
            })

        await fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startindex=${page}`)
            .then(response => response.json())
            .then(data => {
                server.Guid = data.Collection[0].Guid
                server.playerCount = data.Collection[0].CurrentPlayers.length
                if (confirm(`目前最少人的伺服器有${server.playerCount}人，你要加入嗎?`)) Roblox.GameLauncher.joinGameInstance(placeId, server.Guid)
                else return
            })
            .catch(error => {
                console.log(error)
                alert('發生錯誤! 請稍後重試')
                return
            })
    }

    const h3ader = document.createElement('h3')
    h3ader.innerHTML = '伺服器尋找工具'

    let btn = document.createElement('span')
    btn.id = '-meow-findServer'
    btn.onclick = function() { findServer(placeId) }
    btn.innerHTML = '加入最少人的伺服器'
    btn.className = 'btn-secondary-md'

    document.getElementById('game-instances').prepend(btn)
    document.getElementById('game-instances').prepend(h3ader)
})();
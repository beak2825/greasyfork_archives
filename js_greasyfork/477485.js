// ==UserScript==
// @name         显示Steam游戏在线人数
// @description  在Steam商店页右侧信息面板增加在线人数, 便于观察游戏的实际热度
// @icon         https://store.steampowered.com/favicon.ico
// @version      1.7
// @author       cweijan
// @namespace    cweijan/steam_online_players
// @license      MIT
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @include      *store.steampowered.com/app/*
// @downloadURL https://update.greasyfork.org/scripts/477485/%E6%98%BE%E7%A4%BASteam%E6%B8%B8%E6%88%8F%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477485/%E6%98%BE%E7%A4%BASteam%E6%B8%B8%E6%88%8F%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0.meta.js
// ==/UserScript==

function makeElement(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}


let onlineTextNode, onedayPeakTextNode;
let initText = GM_xmlhttpRequest ? '数据加载中' : '无网络权限!', onedayInitText = initText
const appId = location.href.match(/app\/(\d+)/)?.[1];

function colorization(msg, node) {
    let color = '#848683';
    if (Number.isNaN(parseInt(msg))) return color;
    if (msg > 100000) {
        color = '#e72424'
    } else if (msg > 50000) {
        color = '#ce3a3a'
    } else if (msg > 10000) {
        color = '#7cc53f'
    } else if (msg > 3000) {
        color = '#579227'
    }
    if (node) {
        node.setAttribute('style', `color: ${color}`)
    }
    return color;
}

function fillText(msg, type) {
    if (type == 'peak') {
        if (onedayPeakTextNode) {
            onedayPeakTextNode.textContent = msg
            colorization(msg, onedayPeakTextNode)
        }
        else onedayInitText = msg
        return;
    }
    if (onlineTextNode) {
        onlineTextNode.textContent = msg
        colorization(msg, onlineTextNode)
    }
    else initText = msg
}

if (GM_xmlhttpRequest) {
    // 接口参考: https://partner.steamgames.com/doc/webapi/ISteamUserStats#GetNumberOfCurrentPlayers
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`,
        onload(response) {
            try {
                const playerCount = JSON.parse(response.responseText).response.player_count;
                fillText(playerCount || 0)
            } catch (error) {
                fillText(`解析API返回值失败:${response.responseText}`)
            }
        },
        onerror(response) {
            console.log(response)
            fillText("请求失败")
        }
    })
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://steamcharts.com/app/${appId}`,
        onload(response) {
            try {
                const playerCount = response.responseText.match(/(?<="num">)(\d+)/g)[1];
                fillText(playerCount, 'peak')
            } catch (error) {
                fillText(`解析返回值失败`, 'peak')
            }
        },
        onerror(response) {
            console.log(response)
            fillText("请求失败", 'peak')
        }
    })
}

let addedHistory = false;
const observer = new MutationObserver(mutationList => {
    for (var mutation of mutationList) {
        for (var node of mutation.addedNodes) {
            if (!node.querySelectorAll) continue;
            if (node.getAttribute("class") == 'btn_addtocart' && !addedHistory) {
                addedHistory = true;
                // 增加历史价格记录
                const historyBtnHtml = `<div class="btn_addtocart"><a class="btn_blue_steamui btn_medium" href="https://steamdb.info/app/${appId}/#pricehistory" target="_blank"> <span>查看历史价格</span> </a></div>`
                node.parentNode.insertBefore(makeElement(historyBtnHtml), node)
            } else if (node.getAttribute("id") == 'userReviews') {
                // 增加查看所有评价的链接
                node.appendChild(makeElement(`<a style="padding-left: 104px;" target="_blank" href="https://steamcommunity.com/app/${appId}/reviews?browsefilter=toprated">浏览所有评测</a>`))
                // 当前正在玩
                const html = `<div class="user_reviews">
                                <div class="user_reviews_summary_row">
                                    <div class="subtitle column">在玩人数：</div>
                                    <div class="summary column">
                                        <span id="onlinePlayers" style="color: ${colorization(initText)};">${initText}</span>
                                    </div>
                                </div>
                                <div class="user_reviews_summary_row">
                                    <div class="subtitle column">24小时峰值：</div>
                                        <div class="summary column">
                                        <span id="onedayPeakPlayers" style="color: ${colorization(onedayInitText)};">${onedayInitText}</span>
                                    </div>
                                </div>
                            </div>`
                // node.insertBefore(makeElement(html), node.firstChild)
                node.parentNode.insertBefore(makeElement(html), node)
                onlineTextNode = document.getElementById('onlinePlayers')
                onedayPeakTextNode = document.getElementById('onedayPeakPlayers')
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });
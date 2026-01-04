// ==UserScript==
// @name         Roblox 無人伺服器尋找工具
// @namespace    http://tampermonkey.net/
// @version      Alpha 1.1
// @description  尋找無人的伺服器
// @author       Jamie Jiami
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421939/Roblox%20%E7%84%A1%E4%BA%BA%E4%BC%BA%E6%9C%8D%E5%99%A8%E5%B0%8B%E6%89%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/421939/Roblox%20%E7%84%A1%E4%BA%BA%E4%BC%BA%E6%9C%8D%E5%99%A8%E5%B0%8B%E6%89%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    // Gets the game ID
    const gid = Number(window.location.pathname.split('/')[2]);
    if(!gid) return;
    // Gets the game URL
    const url = `https://www.roblox.com/games/${gid}`;

    const searchForGame = function(gid, min, max) {
        // Get the game page
        var page = Math.round((max + min) / 2);
        // Fetch roblox's servers
        fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${gid}&startindex=${page}`)
        // Turn the response into JSON
            .then((resp) => resp.json())
            .then(function(data) {
            if (data.Collection.length < 10 && data.Collection.length > 0) {
                var server = data.Collection[data.Collection.length - 1];
                console.log('發現無人伺服器:', server, '\n擁有的玩家數量(不一定完全準確):', server.CurrentPlayers.length);
                if(confirm("尋找到伺服器有 " + server.CurrentPlayers.length + " 個玩家.\你要加入嗎?")) {
                    try {
                        eval(server.JoinScript);
                    } catch(e) {
                        console.log('Error:', e);
                    };
                } else {
                    min = page;
                    console.log('使用者取消, 嘗試尋找其他伺服器:', page);
                    searchForGame(gid, min, max);
                    return false;
                };
                return true;
            } else if (data.Collection.length == 0) {
                max = page;
                console.log('頁面空白，嘗試其他的吧。:', page);
                searchForGame(gid, min, max);
            } else {
                min = page;
                console.log('沒有無人的伺服器。:', page);
                searchForGame(gid, min, max);
            }
        })
    }

    let h3ader = document.createElement("h3")
    h3ader.innerHTML = "伺服器尋找工具"

    let btn = document.createElement("span");
    btn.id = "-meow-findServer"
    btn.onclick = function() {searchForGame(gid, 0, 10000);};
    btn.innerHTML = "加入無人伺服器"
    btn.className = "btn-secondary-md"

    document.getElementById("game-instances").prepend(btn)
    document.getElementById("game-instances").prepend(h3ader)
})();
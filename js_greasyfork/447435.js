// ==UserScript==
// @name         Gats.io - replay viewer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  save and view replays.
// @author       nitrogem35
// @match        https://gats.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gats.io
//
// @downloadURL https://update.greasyfork.org/scripts/447435/Gatsio%20-%20replay%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/447435/Gatsio%20-%20replay%20viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //You are free to modify and redistribute my code, just make sure to give credit where it's due :)
    var map = ['pistol','smg','shotgun','assault','sniper','lmg']
    var socket
    var token
    var cookies = document.cookie.split("; ")
    var obj = {}
    //create a token for authentication if it doesn't exist (not accessing your login cookies btw)
    for (var i in cookies) {
        var cookie = cookies[i].split("=")
        eval(`obj['${cookie[0]}'] = '${cookie[1]}'`)
    }
    if (obj.token) {
        token = obj.token
    }
    else {
        token = Math.random().toString(36).substring(4)
        document.cookie = `token=${token}; expires=Tue, 19 Jan 2038 03:14:07 UTC;`
    }
    class Game {
        constructor() {
            this.spawnPacket = null
            this.body = []
            this.deathPacket = null
            this.gameMode = null
        }
    }
    var game = new Game()
    var games = []
    function getSocket() {
        var loop = setInterval(() => {
            try {
                if (RF.list[0].socket.readyState == 1 && !RF.list[0].socket.url.includes("ping")) {
                    socket = RF.list[0].socket
                    socket.addEventListener('close', () => {
                        getElem("connected-status").innerHTML = "No 🔴"
                        socket = null
                        getSocket()
                    })
                    socket.addEventListener('message', function (event) {
                        var data = new TextDecoder().decode(event.data)
                        if (data == '.') return
                        var packets = data.split("|")
                        if (socket.url.includes("repl.co")) {
                            for (var i = 0; i < packets.length; i++) {
                                var vars = packets[i].split(",")
                                if(packets[i].startsWith("b")) {
                                    if(vars[1] == c3) RD.pool[c3].playerAngle = parseInt(vars[6])
                                }
                            }
                            return
                        }
                        for (var i = 0; i < packets.length; i++) {
                            if (packets[i].startsWith("a")) {
                                game.spawnPacket = data
                                return
                            }
                            if (packets[i].startsWith("sta")) {
                                game.deathPacket = data
                                game.gameMode = c22
                                games.push(JSON.parse(JSON.stringify(game)))
                                game = new Game()
                                uploadReplays()
                                return
                            }
                        }
                        game.body.push(data)
                    })
                    getElem("connected-status").innerHTML = "Yes 🟢"
                    clearInterval(loop)
                }
            }
            catch (err) {
                //ignore errors
            }
        }, 100)
    }
    getSocket()

    async function auth() {
        var url = "https://nitrogem.loca.lt/authenticate"
        var resp = await fetch(url, {
            headers: {
                "token": token,
                "bypass-tunnel-reminder": true
            }
        })
        var code = await resp.text()
        getElem("auth-status").innerText = "Send a DM (g auth <code>) to the ShowStatsFr Discord bot with the following code:"
        getElem("auth-code").innerHTML = `<code>${code}</code>`
    }
    unsafeWindow.auth = auth

    async function checkAuth() {
        var url = "https://nitrogem.loca.lt/checkAuth"
        var resp = await fetch(url, {
            headers: {
                "token": token,
                "bypass-tunnel-reminder": true
            }
        })
        if(resp.status == 202) return undefined
        else {
            var username = await resp.text()
            getElem("account-status").innerHTML = username
        }
    }
    unsafeWindow.checkAuth = checkAuth
    checkAuth()

    async function loadReplays() {
        var url = "https://nitrogem.loca.lt/replays"
        var resp = await fetch(url, {
            headers: {
                "token": token,
                "bypass-tunnel-reminder": true
            }
        })
        if(resp.status == 202) return undefined
        else {
            var replays = await resp.json()
            getElem("replayBody").innerHTML = ''
            for(var i = 0; i < Object.keys(replays).length; i++) {
                var gameMode = replays[Object.keys(replays)[i]].gameMode
                var tr = document.createElement("tr")
                var killCount = document.createElement("td")
                killCount.innerHTML = replays[Object.keys(replays)[i]].killCount
                tr.appendChild(killCount)
                var utcDate = Object.keys(replays)[i]
                var localDate = new Date(parseInt(utcDate))
                var minutes = localDate.getMinutes()
                if (minutes < 10) minutes = `0${minutes}`
                var seconds = localDate.getSeconds()
                if (seconds < 10) seconds = `0${seconds}`
                var formattedDate = `${localDate.getMonth() + 1}/${localDate.getDate()}/${localDate.getFullYear()} @${localDate.getHours()}:${minutes}:${seconds}`
                var date = document.createElement("td")
                date.innerHTML = formattedDate
                tr.appendChild(date)
                var btn = document.createElement("span")
                btn.innerHTML = `<button class="btn btn-info" onclick="a120('replay-loader.nitrogem35.repl.co/${utcDate}','${gameMode}', 'public')">View</button>`
                tr.appendChild(btn)
                getElem("replayBody").appendChild(tr)
            }
        }
    }
    unsafeWindow.loadReplays = loadReplays
    //unsafeWindow allows this function to be called when you, say, click a button

    function uploadReplays() {
        if (games.length == 0) return
        var opacity = 100
        getElem("upload").innerHTML = `Uploading games (${games.length})`
        getElem("upload").style.opacity = opacity / 100
        var url = "https://nitrogem.loca.lt/stats"
        postData(url, games[0]).then((data) => {
            if (data == "ok") {
                games.shift()
                getElem("upload").innerHTML = `Game uploaded.`
                setTimeout(() => {
                    var lowerOpacity = setInterval(() => {
                        if (opacity <= 0) clearInterval(lowerOpacity)
                        getElem("upload").style.opacity = opacity / 100
                        opacity--
                    }, 16)
                }, 500)
            }
            if (data.startsWith("ERR")) {
                games.shift()
                getElem("upload").innerHTML = `${data}`
                setTimeout(() => {
                    var lowerOpacity = setInterval(() => {
                        if (opacity <= 0) clearInterval(lowerOpacity)
                        getElem("upload").style.opacity = opacity / 100
                        opacity--
                    }, 16)
                }, 500)
            }
        })
        .catch((err) => {
            games.shift()
            getElem("upload").innerHTML = `Game failed to upload.`
            setTimeout(() => {
                    var lowerOpacity = setInterval(() => {
                        if (opacity <= 0) clearInterval(lowerOpacity)
                        getElem("upload").style.opacity = opacity / 100
                        opacity--
                    }, 16)
             }, 500)
        })
    }

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "token": token,
                "bypass-tunnel-reminder": true
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        return response.text()
    }
    var params = new URLSearchParams(window.location.search)
    var replayId = params.get('replayId')
    if(replayId) {
        var loop = setInterval(() => {
            if (!RF.list[0].socket.readyState == 1 || RF.list[0].socket.url.includes("ping")) return
            fetch('https://nitrogem.loca.lt/gameType', {
                "timestamp": replayId,
                "bypass-tunnel-reminder": true
            })
            .then(data => data.text())
            .then(gameType => {
                RF.list[0].socket.close()
                a120(`replay-loader.nitrogem35.repl.co/${replayId}`,`${gameType}`, 'public')
            })
            clearInterval(loop)
        }, 100)
        }

    //create a gui on the right side of the page
    var gui = document.createElement('div')
    gui.id = 'gui'
    gui.style.position = 'fixed'
    gui.style.right = '0'
    gui.style.top = '50%'
    gui.style.zIndex = '9999'
    document.body.appendChild(gui)
    gui.innerHTML = `
    <b>Gats.io - replay viewer</b>
    <div>Connected: <span id="connected-status">No 🔴</span></div>
    <div>Account: <span id="account-status">N/A</span></div>
    <div id="upload"></div>
    <div>End replay [1]</div>
    <div>Toggle GUI [2]</div>
    <style>
        #gui {
            user-select: none;
        }
    </style>
    `
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 49) RF.list[0].socket.send(e('z'))
        if (event.keyCode == 50) {
            if(gui.style.display == 'none') gui.style.display = ''
            else gui.style.display = 'none'
        }
    })

    function e(msg) {
        return new TextEncoder().encode(msg)
    }

    function getElem(id) {
        return document.getElementById(id)
    }
    var append1 = new DOMParser().parseFromString(`
    <style id="style1">
        @media(max-width: 650px) {
            #authButton {
                padding: 3px 5px;
                font-size: 14px
            }
        }
        @media(min-width: 650px) and (max-width:849px) {
            #authButton {
                padding: 5px 8px
            }
        }
        @media(min-width: 850px) and (max-width:1059px) {
            #authButton {
                padding: 5px 8px
            }
        }
    </style>
    <button id="authButton" type="button" class="auth-btn btn btn-lg" data-toggle="modal" data-target="#authModal"
        style="display: inline-block;" draggable="true" unselectable="off" onclick="auth()">Authenticate</button>
    `, 'text/html')
    var style1 = append1.getElementById("style1")
    var authBtn = append1.getElementById("authButton")
    getElem("actrls").prepend(style1)
    getElem("actrls").prepend(authBtn)

    var append2 = new DOMParser().parseFromString(`
    <div class="modal fade" tabindex="-1" role="dialog" id="authModal" style="display: none;">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">×</span></button>
                    <h4 class="modal-title">Authentication</h4>
                </div>
                <div class="modal-body">
                    <p id="auth-status">Getting auth code...</p>
                    <b id="auth-code"></b>
                    <p id="spacer"></p>
                    <p id="notice">Note: Auth codes expire after 10 minutes.</p>
                    <a href="https://discord.gg/2jBb4Ga28P">Don't share any servers with the bot? Click here</a>
                </div>
                <div class="modal-footer">
                    <button id="refreshStatus" onclick="checkAuth()" class="btn btn-success">Refresh Auth Status</button>
                </div>
            </div>
        </div>
    </div>
    `, 'text/html')
    var authModal = append2.getElementById("authModal")
    document.body.appendChild(authModal)

    var append3 = new DOMParser().parseFromString(`
    <li id="replayTab">
        <a data-toggle="tab" href="#replayList" onclick="loadReplays()">
            Replays
        </a>
    </li>
    <div id="replayList" class="tab-pane fade">
        <label style="margin-top:10px;">View one of your replays</label>
        <table class="table table-striped server-table">
            <thead>
                <tr>
                    <th>Kills</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="replayBody" class="server-table-body">
            </tbody>
        </table>
    </div>
    `, 'text/html')
    var replayTab = append3.getElementById("replayTab")
    document.getElementsByClassName("nav nav-tabs")[0].appendChild(replayTab)
    var replayList = append3.getElementById("replayList")
    document.getElementsByClassName("tab-content")[0].appendChild(replayList)

    setInterval(() => {
        getElem("announcementMessage").textContent = `Note: Replay speed is 0.5x the position of the gun you picked. (${(map.indexOf(c1.weapon) * 0.5) + 0.5})`
    }, 50)
})();
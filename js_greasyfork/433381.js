// ==UserScript==
// @name         Friends List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add people and join their lobbies when they're online.
// @author       Two
// @match        https://sketchful.io/
// @icon         https://www.google.com/s2/favicons?domain=sketchful.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.4/socket.io.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433381/Friends%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/433381/Friends%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var log = false,
        bindn = false,
        upd,
        url = "https://cors.bridged.cc/https://sk-fl.glitch.me/flist",
        tb,
        id,
        pages = ["mainp", "settingp", "infop"],
        titles = ["Friends List", "Settings", "Information"],
        logged = `<tr>
      <th></th><th></th>

      <th> </th>
    <th></th></tr>
  <tr><td style="
    font-size: 10px;
"><span style="
    white-space: nowrap;
">You are currently logged out.</span><hr><span style="
    white-space: nowrap;
    display: block;
">How to login:</span><ol><li>Login to Sketchful</li><li>Refresh the page or play a round.</li></ol></td>
    </tr>`,
        nof = `<tr>
      <th></th><th></th>

      <th> </th>
    <th></th></tr>
  <tr><td style="
    font-size: 10px; width: 100%;
"><span style="
    white-space: nowrap;
">You have no friends :(</span><hr><span style="
    white-space: nowrap;
    display: block;
">Adding Friends:</span><ol><li>Click the gear on the bottom right.</li><li>Add someone using their ID.</li></ol></td>
    </tr>`,
        room,
        name;
    try {
        let ls = JSON.parse(window.localStorage.getItem("id"))
        var nc = setInterval(async function () {
            if (document.querySelector(".fname input")) {
                document.querySelector(".fname input").value = ls.name;
                clearInterval(nc)
            }
        }, 100)
        name = ls.name;
    } catch (e) {
        window.localStorage.setItem("id", JSON.stringify({}))
    }
    bind();

    function bind() {
        if (log) return;
        if (bindn) return;
        bindn = true;
        Function.prototype.bind2 = Function.prototype.bind;
        Function.prototype.bind = function (o, t, th, f, fi) {
            if (t) return this.bind2(o, t, th)
            let i = o
            if (o.game) i = o.game;
            if (i.login) {
                setTimeout(() => {
                    if (i.login.data) {
                        try {
                            if (id) return this.bind2(o);
                            id = o.login.data.uuid
                            connect()
                            bindn = false;
                            Function.prototype.bind = Function.prototype.bind2
                        } catch (e) {}
                    }
                }, 100)
            }
            return this.bind2(o)
        }
    }

    function setItem(c, n) {
        let prev = JSON.parse(window.localStorage.getItem("id"));
        prev[c] = n;
        window.localStorage.setItem("id", JSON.stringify(prev));
    }
    document.addEventListener("DOMContentLoaded", function (event) {
        document.body.insertAdjacentHTML('beforeend', `<div>
<style>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.hide {
    display: none !important;
}
.fixed{
display: block;
height: 107px;
overflow-y: scroll;
overflow-x: hidden;
}
.flist{
    border-radius: 10px;
    border: 2px solid black;
    right: 10px;
    position: absolute;
    background: lightgray;
    bottom: -160px;
    width: 149px;
    height: 190px;
    z-index: 100;
    transition: transform 1s;
    overflow: hidden;
}
.open {
    -webkit-transform-origin: 100% 50%;
    transform: translateY(-160px);
}

.close2 {
    -webkit-transform-origin: 100% 50%;
    transform: translateY(0px);
}
.overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 70px;
}

.overflow:hover {
  overflow: visible;
}

.overflow:hover a {
  position: relative;
  background-color: white;
  box-shadow: 0 0 4px 0 black;
  border-radius: 1px;
}
.setting img{
    width: 25px;
    height: 25px;
    cursor: pointer;
}
.setting{
    position: absolute;
    bottom: 0;right: 0;
}
.logout{
    position: absolute;
    bottom: 1px;left: 4px;
}
.logout img{
    width: 13px;
    height: 17px;
    cursor: pointer;
}
.info{
    margin-top:-18px;
    margin-left:3px;
    position: sticky;
    z-index:1;
}
.info img{
    width: 17px;
    height: 17px;
    cursor: pointer;
}
.settingp{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 30px;
}
.settingp div p{
    position: absolute;
    display: contents;
}
.settingp div input{
    width: 81px;
    height: 20px;
    right: 0px;
    position: absolute;
}
.add img{
    width: 15px;
    margin-top: -5px;
    margin-left: 5px;
    cursor: pointer;
}
.add input{
    width: 120px !important;
}
.fid{
    font-size: larger;
    padding: 0 25px;
}
#flistb{
    cursor: pointer;
    width: 100%;
    height: 15%;
}
#ftitle{
    text-align: center;
    padding: 4px 31px;
    margin-top: 10px;
    border: 2px solid black;
    white-space: nowrap;
    margin-left: -2px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.status{
    cursor: pointer;
}
.status:hover span {
    display:none
}
.status:hover:before {
    content:"⭕"
}
</style><div class="flist open" id="flist"><div>
    <div id="flistb"><span id="ftitle">Friends List</span></div>
    <br><div id="pages"><div class="info"><img src="https://i.imgur.com/lWJ0olo.png"></div><table class="mainp fixed">
      <colgroup>
      <col width="40">
      <col width="70">
      <col width="30">
      <col width="40">
      <col width="20">
    </colgroup>
    <tbody id="tb">` + logged + `</tbody></table><div class="settingp hide">
    <strong class="fid">ID: </strong>
    <div class="fname"><p>Name</p><input></div>
    <div class="add"><img src="https://i.imgur.com/9KXko34.png"><input type="number"></div>
    </div><div class="infop hide">
    <div style="
    font-size: 10px;
    max-height: 101px;
    overflow-y: auto;
    overflow-x: hidden;
"><ul style="
    display: contents;
"><li>1. Sometimes you have to refresh twice to login. Keep that in mind.</li><br><li>2. You can friend someone by adding them with their ID in the settings.</li><br><li>3. To join a friend's lobby, you both must have eachother added. Then click their name when it goes blue.</li><br><li>4. Friends can be removed by clicking their status icon.</li>
<br><li>5. You can change your name with the "Name" textbox in the settings.</li><br><li>6. Please keep in mind that there might be some bugs :)</li><br><li>7. If something went wrong, please contact Two#2131 on Discord. Although, after some time he'll probably stop responding.</li></ul></div>
    </div></div>
<div class="logout"><img src="https://i.imgur.com/pMzdGB1.png"></div>
<div class="setting"><img src="https://static.thenounproject.com/png/1524589-200.png"></div></div></div></div>`);
        let settingi = document.getElementsByClassName("setting")[0]
        let infoi = document.getElementsByClassName("info")[0]
        tb = document.getElementById("tb")
        String.prototype.replace2 = String.prototype.replace;
        String.prototype.replace = function (o, t, tr) {
            if (o == "#" && this.toString().length == 6) {
                let tmproom = this.toString().replace2("#", "")
                setTimeout(() => {
                    if (tmproom == document.getElementById("roomInfoLink").value.split("/")[2]) {
                        room = tmproom;
                        updateRoom();
                    }
                }, 3000)
            }
            return this.toString().replace2(o, t)
        }
        settingi.onclick = function (f) {
            let isOn = getPage("setting").classList.contains("hide") ? changePage("settingp") : changePage("mainp")
        }
        infoi.onclick = function (f) {
            let isOn = getPage("info").classList.contains("hide") ? changePage("infop") : changePage("mainp")
        }
        document.getElementById("flistb").onclick = function (f) {
            let flist = document.getElementById("flist")
            if (flist.classList.contains('close2')) {
                flist.classList.remove('close2')
                flist.classList.add('open');
            } else {
                flist.classList.remove('open')
                flist.classList.add('close2');
            }
        }
        document.getElementsByClassName("logout")[0].onclick = function (f) {
            logout();
        }
        document.querySelector(".add img").onclick = function (f) {
            let input = document.querySelector(".add input")
            if (input.value && /^\d+$/.test(input.value)) add(input.value, "add");
        }
        var timer;
        document.querySelector(".fname input").onkeyup = function (f) {
            let input = document.querySelector(".fname input")
            clearTimeout(timer);
            if (input.value) {
                timer = setTimeout(() => {
                    name = input.value;
                    setItem("name", name);
                }, 5000);
            }
        }
    })

    function getPage(page) {
        return document.getElementsByClassName([page + "p"])[0]
    }

    function changePage(page) {
        let pad = ["31px", "43px", "31px"]
        let title = document.getElementById("ftitle")
        let pageC = document.getElementsByClassName(page)[0]
        pageC.classList.remove("hide")
        title.style.padding = "4px " + pad[pages.indexOf(page)]
        title.innerHTML = titles[pages.indexOf(page)]
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] != page) document.getElementsByClassName(pages[i])[0].classList.add("hide")
        }
    }

    function updateFriends(friends) {
        tb.innerHTML = "";
        friends = friends.filter(Boolean)
        if (!friends.length) tb.innerHTML = nof;
        for (var i = 0; i < friends.length; i++) {
            tb.insertAdjacentHTML('beforeend', `  <tr>
      <td title="${friends[i].status}" class="status" data-id="${friends[i].uuid}"><span>${friends[i].status=="Online"?"🟢":"⚫"}</span></td><td class="overflow"><a title='#${friends[i].lobby.code}' ${(friends[i].lobby.players||0)>0?`href="#" onclick="lobbyConnect('#${friends[i].lobby.code}')`:""}">${friends[i].name}</a></td>

      <td> </td>
    <td>${(friends[i].lobby.players||0)+"/?"}</td></tr>`)
            document.getElementsByClassName("status")[i].onclick = function (f) {
                add(this.getAttribute("data-id"), "remove");
            }
        }
        if (friends.length) sortTable(1);
    }
    async function connect() {
        var chk = setInterval(async function () {
            if (document.getElementsByClassName("fid").length) {
                clearInterval(chk);
                let exists = await (await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        "type": "setid",
                        "id": id
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })).json();
                await login(id);
            }
        }, 2000)
    }
    async function login(id) {
        let login = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": "login",
                "id": id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        document.getElementsByClassName("fid")[0].innerHTML = "ID: " + login.uuid;
        updateName(login.name);
        log = true;
        let friends = login.friends;
        updateFriends(friends);
        upd = setInterval(() => {
            if (log) updateRoom()
        }, 10000);
    }
    async function updateRoom() {
        if (!log) return;
        let players = Array.from(document.querySelector("#gamePlayersList").children).length;
        if (!players) room = ""
        let login = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": "update",
                "ping": Date.now(),
                "id": id,
                "players": players,
                "room": room,
                "name": name || "no name"
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        updateName(login.name);
        updateFriends(login.friends);
    }
    async function updateName(n) {
        if (n != name) {
            name = n;
            document.querySelector(".fname input").value = n;
            setItem("name", n)
        }
    }
    async function logout() {
        clearInterval(upd);
        log = false;
        window.localStorage.setItem("id", JSON.stringify({}))
        tb.innerHTML = logged
        let logout = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": "logout",
                "id": id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        id = ""
        await bind();
    }
    async function add(num, t) {
        let add = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": ((t == "add") ? "add" : "remove"),
                "id": id,
                "added": num
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        if (add.error) alert(add.error)
        if (!add.error && t=="add") alert("Added!")
        await updateRoom();
    }
    async function sortTable(n) {
        let tb = document.getElementById("tb");
        Array.from(tb.rows).sort((a, b) => {
            let st = a.firstElementChild.firstElementChild.innerHTML
            let st2 = b.firstElementChild.firstElementChild.innerHTML
            if (st.charCodeAt(0) > st2.charCodeAt(0)) {
                return -1;
            } else if (st.charCodeAt(0) < st2.charCodeAt(0)) {
                return 1;
            }
            return 0;
        }).sort((a, b) => {
            if (a.firstElementChild.firstElementChild.innerHTML == "⚫") return 0;
            let st = a.children[1].firstElementChild.innerHTML
            let st2 = b.children[1].firstElementChild.innerHTML
            if (st.charCodeAt(0) < st2.charCodeAt(0)) {
                return -1;
            } else if (st.charCodeAt(0) > st2.charCodeAt(0)) {
                return 1;
            }
            return 0;
        }).sort((a, b) => {
            if (a.firstElementChild.firstElementChild.innerHTML == "🟢") return 1;
            let st = a.children[1].firstElementChild.innerHTML
            let st2 = b.children[1].firstElementChild.innerHTML
            if (st.charCodeAt(0) < st2.charCodeAt(0)) {
                return 0;
            } else {
                return -1;
            }
            return 0;
        }).forEach((tr, i) => {
            if (i == 0) {
                tb.innerHTML = ""
            }
            tb.appendChild(tr)
        })
    }
})();
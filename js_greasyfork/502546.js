// ==UserScript==
// @name Script finder
// @namespace http://tampermonkey.net/
// @version 1
// @description press ctrl+shift+q to find scripts made for ther current site
// @author You
// @match *://*/*
// @icon https://cdn.discordapp.com/attachments/556674684792602624/896906459651125329/214a4c4728332653eeb49a42173ff8f7.png
// @grant none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502546/Script%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/502546/Script%20finder.meta.js
// ==/UserScript==

//YT: https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A


onkeydown = async function(e) {
    if (e.key.match(/(q)|Q/g) && e.ctrlKey && e.shiftKey) {
        var n = this.open("", "", "width:200"),
            o = `https://greasyfork.org/en/scripts.json?page=${page}&q=${document.domain}}`;
        const e = new XMLHttpRequest;
        e.open("GET", o), e.send();
        var t = [];
        await new Promise(((...n) => {
            e.onload = o => {
                t = JSON.parse(e.responseText), n[0]()
            }
        }));
        var r = document.createElement("div");
        t.forEach((e => {
            let n = e;
            var o, t = document.createElement("p"),
                a = "Script by:" + n.users[0].name + "\n";
            document.createElement("h2"), document.createElement("h3");
            (o = document.createElement("a")).href = n.users[0].url, o.innerText = a, o.target = "_blank", o.id = "user", t.appendChild(o), (o = document.createElement("a")).href = n.code_url, o.innerText = n.name, o.id = "name", o.target = "_blank", t.appendChild(o), (o = document.createElement("small")).innerText = "\nTotal installs:" + n.total_installs.toString() + "\nDescription:" + n.description + "\nLast update:" + n.code_updated_at + "\nVersion:" + n.version, o.id = "desc", t.appendChild(o), r.appendChild(t), r.appendChild(document.createElement("br"))
        })), document.createElement("button").onclick = function() {
            r.innerHTML = ""
        };
        var a = this.document.createElement("style");
        a.innerHTML = "body{background-color: rgb(34, 32, 32);}body{color: white;font-size: large;}input{    background-color: rgba(0,0,0,0);    outline: none;    border: none;    color: red;}.empty{    content: attr(value);}select,select:focus{    background-color: rgba(0,0,0,0);    outline: none;    border: none;    color: rgb(255, 136, 0);}button{    background-color: rgba(0,0,0,0);    outline: none;    border: 2px solid rgb(208, 255, 0);    color: rgb(94, 255, 0);}button:hover,input:focus{    background-color: rgba(0,0,0,0);    outline: none;    border: 2px solid rgb(255, 0, 0);    color: rgb(0, 132, 255);}img,picture{    width: 50px;    height: auto;    border-radius: 25px;    border: 2px solid #2a21ad;}::-webkit-scrollbar{    display:none;}::-webkit-resizer{    display: block;}#user{color:red}#name{color:darkred}#desc{color:green}", n.document.head.appendChild(a), n.document.body.appendChild(r), onunload = function() {
            n.close()
        }
    }
};
// ==UserScript==
// @name         teambition隐藏非自己的card
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.teambition.com/project/*/sprint/section/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405618/teambition%E9%9A%90%E8%97%8F%E9%9D%9E%E8%87%AA%E5%B7%B1%E7%9A%84card.user.js
// @updateURL https://update.greasyfork.org/scripts/405618/teambition%E9%9A%90%E8%97%8F%E9%9D%9E%E8%87%AA%E5%B7%B1%E7%9A%84card.meta.js
// ==/UserScript==

window.onload = function(){setInterval(register_myfuncs, 8000)}

var myprofile
var paths = window.location.pathname.split("/")
var project_id = paths[2]
var sprint = paths[5]
var users_url = "https://www.teambition.com/api/searchers/options?q=&_projectId=" + project_id + "&id=executorId&pageToken=&pageSize=1"

function register_myfuncs(){
    if (!(window.location.href.includes("https://www.teambition.com/project/") && window.location.href.includes("/sprint/section/"))) {
        return
    }
    if (document.getElementById("myhidebtn")) {
        if (document.getElementById("myhidebtn").innerText == "显示") {
            var cards = document.getElementsByClassName("kanban-dnd-card")
            for (var card of cards) {
                var head = card.getElementsByClassName("avatar__1gRA")
                var name
                if (head.length == 0) name = ""
                else name = card.getElementsByClassName("avatar__1gRA")[0].attributes["data-title"].value
                if (name != myprofile.name) {
                    card.style.display = "none"
                }
            }
        }
        return
    }

    console.log("start register")

    fetch(users_url).then(function(response) {
        return response.json();
    }).then(function(myJson) {
        myprofile = myJson.result[0]
    })

    var btn = document.createElement("button")
    btn.id = "myhidebtn"
    btn.innerText = "隐藏"
    btn.onclick = function () {
        var cards = document.getElementsByClassName("kanban-dnd-card")
        var other_cards = []
        for (var card of cards) {
            var head = card.getElementsByClassName("avatar__1gRA")
            var name
            if (head.length == 0) name = ""
            else name = card.getElementsByClassName("avatar__1gRA")[0].attributes["data-title"].value
            if (name != myprofile.name) {
                other_cards.push(card)
            }
        }

        function hidden_not_mine() {
            for (var card of other_cards) {
                card.style.display = "none"
            }
        }
        function show_not_mine() {
            for (var card of other_cards) {
                card.style.display = ""
            }
        }
        if (btn.innerText == "隐藏") {
            btn.innerText = "显示"
            hidden_not_mine()
        } else {
            btn.innerText = "隐藏"
            show_not_mine()
        }
    }
    document.getElementsByClassName('board-view-top-mode__20ny')[0].getElementsByTagName('div')[0].appendChild(btn)

    console.log("end register")
}
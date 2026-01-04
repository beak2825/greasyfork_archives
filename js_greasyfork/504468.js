// ==UserScript==
// @name         soc-words monitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  monitor specific words from specific people especially soc's accounts
// @author       vasi
// @match        https://generals.io/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=generals.io
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504468/soc-words%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/504468/soc-words%20monitor.meta.js
// ==/UserScript==

(function () {
    "use strict"
    GM_registerMenuCommand("添加监听用户", addUsername)
    GM_registerMenuCommand("删除监听用户", delUsername)
    GM_registerMenuCommand("添加监听字段", addWord)
    GM_registerMenuCommand("删除监听字段", delWord)
    var str = '<div id="socCard" style="position: sticky;vertical-align: middle;font-size: 16px;padding: 5 0 10 0;margin: 0px;width: 390px;padding-left: 10px;"></div>'
    document.querySelector(".chat-messages-container").parentNode.insertAdjacentHTML('beforebegin', str);
    function genCard(word) {
        var str2 = `<div id=${word} style=" color: white; display: inline-flex; align-items: center; margin: 4px; width: auto; "><div class="word" style="display: inline-block; padding: 0 5 0 5; background-color: #2ca625; color: white; border-radius: 3px; margin-right: 4px;">${word}</div><div id=${word + "i"}>${wordList[word]}次</div></div>`
        document.querySelector("#socCard").insertAdjacentHTML('beforeend', str2);
    }
    function addUsername() {
        let addedUsername = prompt(`当前监听小号：${usernameList.join(",")}。请输入添加用户名：`)
        if (!usernameList.includes(addedUsername) && addedUsername != "" && addedUsername != null) {
            usernameList.push(addedUsername)
            localStorage.setItem("soc-list", JSON.stringify(usernameList))
            alert("添加成功")
        } else {
            alert("您已添加过该用户名")
        }
    }
    function delUsername() {
        let delUsername = prompt(`当前监听小号：${usernameList.join(",")}。请输入删除用户名：`)
        if (usernameList.includes(delUsername) && delUsername != "" && delUsername != null) {
            usernameList.pop(delUsername)
            localStorage.setItem("soc-list", JSON.stringify(usernameList))
            alert("删除成功")
        } else {
            alert("您未添加过该用户名")
        }
    }
    function addWord() {
        let addedWord = prompt(`当前监听字段：${Object.keys(wordList).join(",")}。请输入添加字段：`)
        if (!wordList.hasOwnProperty(delWord) && addedWord != "" && addedWord != null) {
            wordList[addedWord] = 0
            localStorage.setItem("soc-word", JSON.stringify(wordList))
            genCard(addedWord)
            alert("添加成功")
        } else {
            alert("您已添加过该字段")
        }
    }
    function delWord() {
        let delWord = prompt(`当前监听字段：${Object.keys(wordList).join(",")}。请输入删除字段：`)
        if (wordList.hasOwnProperty(delWord) && delWord != "" && delWord != null) {
            delete wordList[delWord]
            localStorage.setItem("soc-word", JSON.stringify(wordList))
            document.getElementById(delWord).innerHTML = ""
            alert("删除成功")
        } else {
            alert("您未添加过该字段")
        }
    }
    let usernameList, wordList
    if (!localStorage.getItem("soc-list")) {
        usernameList = ["23662.22", "I like 23"]
        localStorage.setItem("soc-list", JSON.stringify(usernameList))
    } else {
        usernameList = JSON.parse(localStorage.getItem("soc-list"))
    }
    if (!localStorage.getItem("soc-word")) {
        wordList = { "绷": 0, "乐": 0, "Joker": 0, "小丑": 0, "菜": 0 }
        localStorage.setItem("soc-word", JSON.stringify(wordList))
    } else {
        wordList = JSON.parse(localStorage.getItem("soc-word"))
    }
    for (let word in wordList) {
        genCard(word)
    }
    socket.on("chat_message", (a, msg) => {
        for (let username of usernameList) {
            if (msg.username == username) {
                for (let word in wordList) {
                    if (msg.text.includes(word)) {
                        wordList[word]++
                        document.getElementById(word + "i").innerHTML = wordList[word] + "次"
                        localStorage.setItem("soc-word", JSON.stringify(wordList))
                    }
                }
            }
        }
    })
})();
// ==UserScript==
// @name         block users (removes blocked user's threads)
// @namespace    http://tampermonkey.net/
// @version      4.20
// @description  Removes threads of users that are blocked
// @author       Jesus Christ
// @match        https://v3rmillion.net/*
// @icon         https://stepbrofurious.xyz/favicon.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449349/block%20users%20%28removes%20blocked%20user%27s%20threads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449349/block%20users%20%28removes%20blocked%20user%27s%20threads%29.meta.js
// ==/UserScript==

function isJson(str){ //thanks for the json check stackoverflow <3
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
$(document).ready(function () {
    var reportbuttons = Array.prototype.slice.call(document.getElementsByClassName("button small_button report_user_button"), 0);
    var authors = Array.prototype.slice.call(document.getElementsByClassName("author smalltext"), 0);
    var blocklist = []
    if (localStorage.getItem("blocklist")) {
        if (isJson(localStorage.getItem("blocklist"))){
            blocklist = JSON.parse(localStorage.getItem("blocklist"))
        }else{
            localStorage.setItem("blocklist", JSON.stringify([]));
        }
    }else{
        localStorage.setItem("blocklist", JSON.stringify([]));
    }
    if(reportbuttons.length === 1){
        var reportbutton = reportbuttons[0]
        var parent = reportbutton.parentNode
        var id = reportbutton.getAttribute("href")
        id = id.replace("javascript:Report.reportUser(", "")
        id = id.replace(");", "")
        const found = blocklist.find(element => element == Number(id))
        var blockbutton = reportbutton.cloneNode(true);
        blockbutton.class = "button small_button block_user_button"
        if(found){
            blockbutton.innerText = "Unblock User"
            blockbutton.setAttribute("href", `javascript:var array = JSON.parse(localStorage.getItem("blocklist"));for(var i = 0; i < array.length; i++){if (array[i] === ${id}){array.splice(i, 1)}};localStorage.setItem("blocklist", JSON.stringify(array));location.reload()`)
        }else{
            blockbutton.innerText = "Block User"
            blockbutton.setAttribute("href", `javascript:var array = JSON.parse(localStorage.getItem("blocklist"));var found = array.find(element => element == Number(${id}));if(found == undefined){array.push(${id});localStorage.setItem("blocklist", JSON.stringify(array))};location.reload()`)
        }
        parent.appendChild(blockbutton);
    }else{
        for (var i = 0; i < authors.length; i++) {
            var authorid = authors[i].childNodes[0].getAttribute("href")
            authorid = authorid.replace("https://v3rmillion.net/member.php?action=profile&uid=", "")
            const found = blocklist.find(element => element == Number(authorid))
            if(found){
                var element = authors[i].parentNode.parentNode.parentNode
                element.remove(element);
                console.log(`removed thread from ${authorid}`)
            }
        }
    }
});
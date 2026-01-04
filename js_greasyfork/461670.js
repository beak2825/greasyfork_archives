// ==UserScript==
// @name         贴吧自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @author       You
// @match        https://tieba.baidu.com/home/main?*
// @match        https://tieba.baidu.com/f?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461670/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/461670/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
let href = window.location.href
let usign_list = []
if(window.localStorage.getItem("usign_list") != null && window.localStorage.getItem("usign_list") != ""){
    usign_list = window.localStorage.getItem("usign_list").split(",")
}

if(href.search("https://tieba.baidu.com/home/main") != -1){
    $("#forum_group_wrap>span").click()
    let temp = $(".unsign")
    for(let i = 0;i < temp.length; i++){
        usign_list.push(temp[i].href)
    }
    jump()
}else if(href.search("https://tieba.baidu.com/f") != -1){
    let index = 0
    let id = setInterval(() => {
        if($('.j_cansign').length == 1){
            $("[title=签到]")[0].click()
        }else if($(".signstar_signed").length == 1){
            clearInterval(id)
            jump()
        }else if(index == 10){
            clearInterval(id)
        }
        index += 1
    },500)
}

function jump(){
    if(usign_list.length != 0){
        let href = usign_list.shift()
        window.localStorage.setItem("usign_list",usign_list)
        window.location.href = href
    }
}

// ==UserScript==
// @name         Geekhub ban user
// @namespace    http://ora.moe/
// @version      0.2
// @description  A extension for ban user on https://geekhub.com
// @author       You
// @match        https://geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407290/Geekhub%20ban%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/407290/Geekhub%20ban%20user.meta.js
// ==/UserScript==
var thisw=window
JSON.tryparse=function(...e){
    try{
        return JSON.parse.apply(this,e)
    }catch(e){
        return {}
    }
}
if(JSON.tryparse(localStorage["blackObj"]).blacklist===undefined){
   localStorage["blackObj"]=JSON.stringify({blacklist:[]})
}
thisw.blacklist=JSON.tryparse(localStorage["blackObj"]).blacklist
thisw.BanUser=function(username){
    var select=confirm("你确定将"+username+"加入黑名单?")
    if(select){
        blacklist[blacklist.length]=username
        var BlackObj={blacklist}
        localStorage["blackObj"]=JSON.stringify(BlackObj)
        location.reload()
        return false
    }
}
document.querySelectorAll(".flex.items-center.px-2.py-3.border-t.border-color").forEach(e=>{
    if(blacklist.includes(e.children[1].children[1].children[2].children[0].innerHTML)){
        e.style.display="none"
    }
})
document.body.outerHTML+="<hr><h2>Ban User for Geekhub</h2><h2>当前屏蔽用户:"+blacklist.join(",")+`</h2><hr><a href='javascript:delete localStorage["blackObj"];location.reload()'>一键清除</a><br><input type="text" onchange="javascript:BanUser(this.value)" placeholder="待封禁用户名..."></input>`
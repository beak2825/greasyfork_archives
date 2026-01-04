// ==UserScript==
// @name         更圆润的Bilibili
// @namespace    bilibili.com
// @version      0.1
// @description  让B站更圆润
// @author       MicroBlock
// @include        *://www.bilibili.com/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401935/%E6%9B%B4%E5%9C%86%E6%B6%A6%E7%9A%84Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/401935/%E6%9B%B4%E5%9C%86%E6%B6%A6%E7%9A%84Bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
    *:not(.bilibili-danmaku){
            transition: all 2s;
}
#internationalHeader > div{
border-radius:100px;
}
.bilibili-player-video-wrap{
border-radius:20px;
filter:drop-shadow(0px 0px 20px #555555)
}
.mini-upload:not(.a){
border-radius:20px;
filter:drop-shadow(0px 0px 5px #555555)
!important
}
` );

function similar(s, t, f) {
    if (!s || !t) {
        return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function(a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
        }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
}

/*————————————————
版权声明：本文为CSDN博主「何必诗债换酒钱」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u014395524/article/details/100562174

从dalao那抄来的相似度算法（
*/
const 最大相似弹幕数量=10,相似度界限=0.7,判断长度=5;
    var statlj=0,checked=[];
function checkr(){
var list={}
document.querySelector("#bilibiliPlayer > div.bilibili-player-area > div.bilibili-player-video-wrap > div.bilibili-player-video-danmaku").children.forEach(function(a){
var flagp=false;
    if(a.hidden==true||checked.includes(a));else{
checked.push(a);
    console.log(checked)
    a.checked=true
    for(var m=1;m<((a.innerText.length>判断长度)?判断长度:a.innerText.length);m++){
   
        if(a.innerText.substr(0,m)==a.innerText.substr(m,m)&&a.innerText.substr(0,m)==a.innerText.substr(2*m,m)){
    console.log("拦截弹幕："+a.innerText+" 理由：重复刷屏\nStat:"+"拦截总数："+statlj)
            a.hidden=true
            statlj++;
return 0;
    
    }
    }
Object.keys(list).forEach(function(b){

if(similar(a.innerText,b)>相似度界限){
flagp=true;
if(list[b]>=最大相似弹幕数量){
a.hidden=true
console.log("拦截弹幕："+a.innerText+" 理由：同样弹幕过多\nStat:"+"拦截总数："+statlj)
    console.log(list)
    statlj++
}else{
list[b]++
}
}

})
if(flagp==false){
list[a.innerText]=1
}
}})


for(let key in list){
    delete list[key];
}
}
    setInterval(checkr,4)

    document.querySelector("html").style.filter="blur(10px)"
window.onload=function(){
document.querySelector("html").style.filter="blur(0px)"
}
setTimeout(function chka(){
try{
document.querySelector("#nav_searchform").style.borderRadius="100px"
document.querySelector("#nav_searchform").style.filter="drop-shadow(0px 0px 5px #555555)"
document.querySelector("#nav_searchform > div").style.borderRadius="40px"
document.querySelector("#internationalHeader > div > div > div.nav-user-center > div:nth-child(3) > span > span").style.borderRadius="20px"
document.querySelectorAll(".pic").forEach(function(a){a.style.borderRadius="20px";a.style.filter="drop-shadow(0px 0px 5px #555555)"})
document.querySelectorAll(".rec-footer").forEach(function(a){a.style.borderRadius="20px";a.style.filter="drop-shadow(0px 0px 5px #555555)"})
    document.querySelectorAll(".video-page-card").forEach(function(a){a.style.marginTop="18px"})
    document.querySelectorAll("#comment > div > div.comment > div.bb-comment > div.comment-list > div").forEach(function(a){
        a.style.borderRadius="20px";//a.style.boxShadow="0px 0px 10px black"
    a.style.marginTop="25px"
    })

    document.querySelectorAll(".paging-box-big .current, .paging-box-big .dian, .paging-box-big .next, .paging-box-big .prev, .paging-box-big .tcd-number").forEach(function(a){a.style.borderRadius="20px";a.style.filter="drop-shadow(0px 0px 5px #555555)"})
    document.querySelector("#playerAuxiliary > div > div.player-auxiliary-collapse.bui.bui-collapse > div > div.bui-collapse-header").style.borderRadius="20px"
    document.querySelector("#playerAuxiliary > div > div.player-auxiliary-collapse.bui.bui-collapse > div > div.bui-collapse-header").style.filter="drop-shadow(0px 0px 5px #555555)"
    document.querySelector("#playerAuxiliary > div > div.player-auxiliary-collapse.bui.bui-collapse > div > div.bui-collapse-header > div.player-auxiliary-filter").style.borderRadius="20px"
    document.querySelector("#v_upinfo > div.btn-panel > div").style.borderRadius="20px"
    if(document.querySelector("#live_recommand_report")!=null)document.querySelector("#live_recommand_report").remove()
    if(document.querySelector(".float-nav")!=null)document.querySelector(".float-nav").remove()
    setTimeout(chka,100)
}
    catch {
        setTimeout(chka,1000)

}
},100)
    // Your code here...
})();
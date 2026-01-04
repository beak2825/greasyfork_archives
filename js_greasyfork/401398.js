// ==UserScript==
// @name         ヒカマニ時間
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  みなさんは毎日どのくらいの時間hikakin_mania見てますか？
// @author       You
// @require
// @match        https://www.nicovideo.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401398/%E3%83%92%E3%82%AB%E3%83%9E%E3%83%8B%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/401398/%E3%83%92%E3%82%AB%E3%83%9E%E3%83%8B%E6%99%82%E9%96%93.meta.js
// ==/UserScript==
let today = new Date();
let dat = today.getDate()
let time = localStorage.getItem("viewsecond")
let date = localStorage.getItem('date')
let _second = localStorage.getItem("viewsecond")
let second = parseInt(_second)
time = Math.floor(time/60);
console.log(time)
console.log(dat)
console.log(date)
if(dat != date){
    second = 0
    localStorage.setItem('date',dat)
    localStorage.setItem("viewsecond",second)
    localStorage.setItem("yesterday",time)

}
let yes = localStorage.getItem("yesterday")


let todayseeing = "<div style='white-space: nowrap;background-color:#f2f2f2;width:400px;height:150px;'><p style='font-family:Noto Sans JP;font-size:20px;padding:10px;color:#3d3d3d';>今日の視聴時間</p><div style='display:flex;flex-direction:row-reverse; align-items:flex-end;'><div style='font-size:50px;text-align:right;font-family:Noto Sans JP;color:#3d3d3d;margin-bottom:10px;'>分</div><div style='font-size:100px;font-family:Noto Sans JP;color:#3d3d3d;'>"+time+"</div></div></div>"
let yeseeing = "<div style='white-space: nowrap;background-color:#f2f2f2;width:400px;height:150px;'><p style='font-family:Noto Sans JP;font-size:20px;padding:10px;color:#3d3d3d';>昨日の視聴時間</p><div style='display:flex;flex-direction:row-reverse; align-items:flex-end;'><div style='font-size:50px;text-align:right;font-family:Noto Sans JP;color:#3d3d3d;margin-bottom:10px;'>分</div><div style='font-size:100px;font-family:Noto Sans JP;color:#3d3d3d;'>"+yes+"</div></div></div>"

let list = document.querySelector("#siteHeaderRightMenuContainer")
console.log(list)
var mori = document.createElement("li");
mori.innerHTML = "<a href='/hikamanijikan'>ヒカマニ時間</a>"
list.append(mori)

if(document.URL.match("hikamanijikan")){

    document.title = "niconico(ニコニコ) - ヒカマニ時間"
    document.querySelector(".contents").innerHTML = "<link href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap' rel='stylesheet'><h1 style='font-size:20px;'>■ヒカマニ時間</h1><br><p>みなさんは毎日どのくらいの時間ヒカマニ見てますか？</p><br>"+todayseeing+yeseeing
    console.log(time)
}


if(document.URL.match("watch")){
    let taglist = document.querySelector('.TagList').textContent
    if (taglist.match("Hikakin")||taglist.match("hikakin")||taglist.match("ヒカマニ")){
        console.log(String(second))
        function timep(){

            second += 1
            localStorage.setItem('viewsecond', second);
            console.log(String(second))
        }
        setInterval(timep,1000)
    }


}
if(document.URL.match("tag/Hikakin_")){
    let class_ = document.querySelector('.contentBody')
    let logo = document.querySelector('.logo')
    let hidari = document.querySelector(".hidariue")
    hidari.innerHTML = '<a href="https://www.nicovideo.jp/hidariue"><img src="https://i.imgur.com/m3hiJ1q.gif" alt="左上"></a>'
    let hhtml = "<link href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap' rel='stylesheet'><div style='display:flex;align-items:flex-end;'>"+todayseeing+yeseeing+"</div>"
    class_.insertAdjacentHTML('beforeend',hhtml);
    logo.innerHTML ="<img style='height:50px;width:185px' src = 'https://i.imgur.com/41d3RiU.png'></img>"
}
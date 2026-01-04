// ==UserScript==
// @name         対戦譜面詳細表示
// @namespace    http://tampermonkey.net/
// @version      2024-03-23
// @description  aaa
// @author       You
// @license MIT
// @match        https://typing-tube.net/movie/show/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490612/%E5%AF%BE%E6%88%A6%E8%AD%9C%E9%9D%A2%E8%A9%B3%E7%B4%B0%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490612/%E5%AF%BE%E6%88%A6%E8%AD%9C%E9%9D%A2%E8%A9%B3%E7%B4%B0%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

$("#controlbox").on("DOMNodeInserted",e=>{
    if(e.target.id == "RTCPlayModeDiv"){
        $("#controlbox").off("DOMNodeInserted");
        const a = setInterval(()=>{
            console.log("lyrics探してる")
            if(lyrics_array){
                clearInterval(a)
                let [time,text] = lyrics_array.find(e=>{
                    if(e[2] != ""){
                        console.log(e[2]);
                        return [e[0],e[1]];
                    }
                })
                time = time == 0 ? `<span style="color:#ff0000;">${Number(time).toFixed(2)}</span>秒` : time < 0.5 ?
                    `<span style="color:#ffff00;">${Number(time).toFixed(2)}</span>秒` : `<span style="color:#008000;">${Number(time).toFixed(2)}</span>秒`;
                $("#RTCPlayModeDiv").before(`<div style="margin:5px 5px;">start&nbsp;${time}&nbsp;<span style="color:#fd5">${text}</span></div>`)
            }
        },100)
    }
})
/*
*/
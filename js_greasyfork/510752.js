// ==UserScript==
// @name         明日方舟塞壬唱片自动跳过纯伴奏歌曲
// @namespace    
// @version      0.1
// @description  明日方舟塞壬唱片官网(https://monster-siren.hypergryph.com/)的音乐中，有许多有人声的歌曲的纯伴奏版本，可能有些听众和我一样更喜欢有人声版，黑听时听到无人声版总会觉得缺点味道，这个脚本将会自动跳过这些歌曲
// @author       何必胜
// @match        https://monster-siren.hypergryph.com/*
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510752/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%BA%AF%E4%BC%B4%E5%A5%8F%E6%AD%8C%E6%9B%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/510752/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%BA%AF%E4%BC%B4%E5%A5%8F%E6%AD%8C%E6%9B%B2.meta.js
// ==/UserScript==

//下一首歌曲
function nextMusic(){
    console.log("nextMusic");
    var nextBotton=document.getElementsByClassName("control___CdZsu")[3]
     nextBotton.click()
}
(function() {
    'use strict';
    setTimeout(function () {
        setInterval(function () {

            var nowMusicNameNode=document.getElementsByClassName("playListNormal___1b8dK")[0];
            var nowMusicName=nowMusicNameNode.textContent
            console.log("nowMusicName:"+nowMusicName)
            if(nowMusicName.includes("(Instrument)")||nowMusicName.includes("(Instrumental)")||nowMusicName.includes("(instrumental)")||nowMusicName.includes("(instrument)")
              ||nowMusicName.includes("（Instrument）")||nowMusicName.includes("（Instrumental）")||nowMusicName.includes("（instrumental）")||nowMusicName.includes("（instrument）")){
                console.log("nextName:"+nowMusicName)

                nextMusic();
            }


        }, 1000);



    }, 3000);



       // var b=document.getElementsByTagName("div");
      //  console.log(b)
       // console.log(b.length)
       // console.log(b[25])
       // console.log(b[25].childNodes)
         //setInterval(function () {


        // }, 1000);



    // Your code here...
})();
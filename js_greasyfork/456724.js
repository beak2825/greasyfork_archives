// ==UserScript==
// @name        豆瓣控评破壁人 - douban.com
// @namespace   Violentmonkey Scripts
// @match       https://movie.douban.com/subject/*/comments
// @grant       none
// @version     1.1
// @author      卿空曦
// @description 12/17/2022, 5:53:44 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456724/%E8%B1%86%E7%93%A3%E6%8E%A7%E8%AF%84%E7%A0%B4%E5%A3%81%E4%BA%BA%20-%20doubancom.user.js
// @updateURL https://update.greasyfork.org/scripts/456724/%E8%B1%86%E7%93%A3%E6%8E%A7%E8%AF%84%E7%A0%B4%E5%A3%81%E4%BA%BA%20-%20doubancom.meta.js
// ==/UserScript==


function main(){
    var weight=[4.5,3,1.5],HighStar=$(".comment-percent")[1].innerText.split('%')[0],result=0;
    weight[0]+=((HighStar-90)>0)?((HighStar-90)*0.05*(2-(HighStar-90)/10)):0;
    $(".comment-percent").slice(-3).map(function (i,v) {
        result+=weight[i]*v.innerText.split('%')[0]*0.02;
    })
    console.log(result)
    $('body').append(`<div style="font-size:3vw;
    width:15vw;
    position:absolute;top:25%;right:3%;
    opacity:0.7;
    background:#000;
    color:#FFF;
    text-align:center;border-radius:3vw;padding:1vw">豆瓣破壁人评分${result}</div>`)
}
main()
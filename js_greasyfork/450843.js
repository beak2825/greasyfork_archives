// ==UserScript==
// @name         课
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       pawn
// @description  用于Bistu职业生涯与就业指导平台
// @match        https://bistu.wnssedu.com/course/newcourse/watch*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450843/%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450843/%E8%AF%BE.meta.js
// ==/UserScript==
var currenttime
var durationtime
var url
let time2=setInterval(()=>{

    document.querySelector(".pv-volumebtn").click()
    document.querySelector(".pv-icon-btn-play").click()
    if(document.querySelector(".pv-time-current")){
    clearTimeout(time2)
}
},1000)

url=window.location.search

var c=url.match(/\d+(.\d+)?/g)

var courseId=c[0]

var coursewareId=parseInt(c[1])+1+""
var VideoId=parseInt(c[2])+1+""

let time=setInterval(()=>{
     if(document.querySelector(".pv-ask-skip")!=null){
    document.querySelector(".pv-ask-skip").click()
    }
    if(document.querySelector(".pv-time-current").innerHTML==document.querySelector(".pv-time-duration").innerHTML){

       self.location="https://bistu.wnssedu.com/course/newcourse/watch.htm?courseId="+courseId+"&lCoursewareId="+coursewareId+"&lVideoId="+VideoId+"&nViewSecond=0&type=0"
    }
},1000
)

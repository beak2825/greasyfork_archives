// ==UserScript==
// @name         传智播客一键刷所有视频2023/5/28【亲测可用】
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  一键跳过所有视频，视频进度全100%
// @author       DongJ
// @match        https://stu.ityxb.com/preview/detail/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467308/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E4%B8%80%E9%94%AE%E5%88%B7%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%912023528%E3%80%90%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467308/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E4%B8%80%E9%94%AE%E5%88%B7%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%912023528%E3%80%90%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    setInterval(function() {
        document.querySelectorAll("video")[0].playbackRate=10.0
        console.log(document.querySelectorAll("video").playbackRate)
        var boxs = document.querySelectorAll("#point_undefined > div > span.point-progress-box");
        for (var i in boxs){
            if(boxs[i].innerText!="100%"&&boxs[i].previousSibling.innerText!="习题"){
                boxs[i].parentNode.click()
                document.getElementsByTagName("video")[0].play()
                return
            }
        }
    }, 8000);

    // Your code here...
    */
    document.querySelector("body > div:nth-child(3) > div > div.center-content.preview_play-container > div.preview_play-header > span:nth-child(3)").innerHTML = "<button id='dongj'>完成本集合中所有视频</button>"
    var uid = location.href.split("/").slice(-1)
    var reqlist = "https://stu.ityxb.com/back/bxg/preview/info?previewId="
    let resList = []
    fetch(reqlist+uid)
        .then((response) => response.json())
        .then((res) => {
            for(let i of res.resultObject.chapters){
                for(let j of i.points){
                      resList.push(j)
                }
            }
            //resList = res.resultObject.chapters[0].points
    });
    let count = 0
    let f = 0
    setInterval(()=>{
        if(f){
            f=0
        alert("##DongJ## 已经完成"+count+"/"+resList.length+",可以刷新查看啦!")

        }
    },3000)
    document.querySelector("#dongj").onclick = ()=>{
        f = 1
        for(let obj of resList){
        setTimeout(()=>{
          console.log(resList)
           let data={
              previewId:uid,
              pointId:obj["point_id"],
              watchedDuration:9999
          }
           console.log(obj)
         console.log(data)
        fetch("https://stu.ityxb.com/back/bxg/preview/updateProgress",{
          headers:{
            "Content-Type":"application/x-www-form-urlencoded"
           },
          method:"POST",
           body:new URLSearchParams(data)
          })
           .then((response) => response.json())
           .then((res) => {

            if(res.success == true){
                 count++
            }
           });
        },600)
    }}


})();
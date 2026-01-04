// ==UserScript==
// @name        四川学法考试自用
// @namespace   Violentmonkey Scripts
// @match       https://www.scxfks.com/*
// @match       http*://scxfks.com/study/*
// @grant       none
// @version     4.0
// @author      -
// @description 2025/6/4 11:44:53
// @downloadURL https://update.greasyfork.org/scripts/427449/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427449/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(async function() {

    var TT
    'use strict';
    console.log(window.location.href.slice(0,36))
  if(window.location.href === "https://www.scxfks.com/study/courses/year"){
    self.location.href="https://www.scxfks.com/study/courses/all"
  }else if(window.location.href === "https://www.scxfks.com/study/courses/all"){
        var buttons = [];
        while (buttons.length == 0) {
            buttons=document.querySelectorAll("td>a");
        }
        console.log(buttons)

        var exams = Array.prototype.slice.call(buttons);
        console.log(exams)

        for (var j=0;j<exams.length-1;j++){
            if(exams[j].innerText==="开始学习"||"继续学习"){
                console.log(exams[j].innerText)



                await sleep(1000)

                exams[j].click();

            }}
        await sleep(10000000)
        function sleep (time) {
            //console.log("sleep");
            return new Promise((resolve) => setTimeout(resolve, time));

        }
        //window.alert(6 + 7);
        //exams[0].click();
    }else if(window.location.href === "https://www.scxfks.com/study/500"){
        history.back()


    }else if(window.location.href.slice(0,36) === "https://www.scxfks.com/study/course/"){
        //TT=TT+1
      console.log("学习中")
        if(window.location.href.length<48){

            await sleep(1000)
            var buttons1 = [];
            while (buttons1.length == 0) {
                buttons1=document.querySelectorAll("li.c_item>table>tbody>tr>td>div");
              await sleep(1000)
                console.log(`查找新课:`, buttons1);

            }
            //console.log(buttons1)

            var exams1 = Array.prototype.slice.call(buttons1);
            //console.log(exams1)
            var len=buttons1.length
            for (var jj=0;jj<exams1.length;jj++){
                console.log(exams1[jj]);
//                 await sleep(10000)
                if(exams1[jj].innerText==="   " ){
                  console.log("点击")
                    exams1[jj].click();
                    await sleep(1000)
                }}

            await sleep(500)
            self.location.href="https://www.scxfks.com/study/courses/all"
            function sleep (time) {
                //console.log("sleep");
                return new Promise((resolve) => setTimeout(resolve, time));

            }
        }
        else{//运行具体学习页面
            const scoreElement = document.querySelector('[data-intro="当颜色变为蓝色，则表示已获得相关分数"]');
            if (scoreElement){
              console.log(scoreElement.innerText)
              if(scoreElement.innerText==="每日最多学习5分，您已到达今日上限"){
                console.log("休息一下，30分钟后刷新");
                await sleep(1800000)
                //alert("完成学习！")
              }

            }
            await sleep(1000)
            console.log(TT);
            var buttons2 = [];
            while (buttons2.length == 0) {
                buttons2=document.querySelectorAll("button");
            }
            var exams2 = Array.prototype.slice.call(buttons2);
            console.log(buttons2)
            console.log(exams2)
            if(exams2.length == 1){
                var buttons3=document.getElementById("video_Url_");
                while (buttons3!=null) {
                    console.log(buttons3)
                    buttons3.autoplay = true;
                    buttons3.load();
                    buttons3.play()
                    await sleep(10000)
                    //buttons3.click();
                    console.log(buttons3)
                    buttons2[0].click();
                }

            }
            await sleep(10000)
            buttons2[0].click();
            function sleep (time) {
                //console.log("sleep");
                return new Promise((resolve) => setTimeout(resolve, time));


            }

        }
    }
})();
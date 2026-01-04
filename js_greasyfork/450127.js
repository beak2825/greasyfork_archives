// ==UserScript==
// @name         湖南正中华自动学习器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  学习交流
// @author       MGZ
// @match        *://hn.ischinese.cn/learncenter/buycourse
// @license       wwd all
// @downloadURL https://update.greasyfork.org/scripts/450127/%E6%B9%96%E5%8D%97%E6%AD%A3%E4%B8%AD%E5%8D%8E%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/450127/%E6%B9%96%E5%8D%97%E6%AD%A3%E4%B8%AD%E5%8D%8E%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    Start();
    async function Start() {
        var url = window.location.href;
        console.log("当前网址:" + url);
        var kcList = await FindEleShowByClassName("progress_text");
        console.log("kcList=" + kcList[0].textContent);
        var Fen = document.getElementsByClassName("hour")[0].textContent;
        console.log("已购与已学: " + Fen)
        if(!BiJiao(Fen)){//有未学完的课程
            console.log("存在未学完的课程.");
            var kcListCount = kcList.length
            for(var i=0;i<kcListCount;i++){
                var bfb=kcList[i].textContent;

                if(bfb!="100%") {
                    console.log("开始播放第" + (i+1) + "个视频");
                    //document.getElementsByClassName("buyCourse_classStudy")[i].click();
                    $(".buyCourse_classStudy")[i].click();
                    await Delay(2500);
                    await play();
                    await Delay(4000);
                    console.log("第" + (i+1) + "个视频播放结束");

                }
                console.log("bfb=" + bfb + "  kcList=" + kcList.length)
            }
        }
    }



    //视频播放中...
    async function play(){
        console.log("视频播放中...");
        await Delay(4000);
        var isply = await isPlay();
        console.log("isply=" + isply);
        if(isply=="false"){
            console.log("点击大播放按钮.");
            //$(".vjs-big-play-button" button)[0].click(); //点击播放按钮
            //$(".vjs-big-play-button span" )[0].click();
            //document.getElementsByClassName("vjs-tech")[0].click();
        }

        await Delay(1000);
        //$(".vjs-big-play-button")[0].click(); //点击播放按钮
        return new Promise(function(resolve){
            let playInterVal = setInterval(()=>{
                var ele = document.getElementsByClassName("progress");
                if(ele.length>0){
                    let pBfb = ele[0].getElementsByTagName("div")[0].getElementsByTagName("span")[1].textContent;
                    console.log("当前进度: " + pBfb);
                    if(pBfb=="100%"){
                        clearInterval(playInterVal);
                        console.log("学习完毕");
                        window.history.back();
                        resolve("done");

                    }
                }else {
                    console.log("播放异常...");
                    window.history.back();
                    resolve("done");
                }

            },4000);


        });
    }

    async function isPlay(){
        var jdbfb1 = $(".vjs-current-time-display")[0].textContent;
        console.log(jdbfb1);
        await Delay(2500);
        var jdbfb2 = $(".vjs-current-time-display")[0].textContent;
        console.log(jdbfb2);
        if(jdbfb1==jdbfb2) return "false";
        else return "true";
    //$(".vjs-big-play-button")[0].click(); //点击播放按钮
    }
    //播放页执行代码
    function WaitingPlay() {
        return new Promise(function (resolve) {
            let playInterVal = setInterval(() => {
                var ele = document.getElementsByClassName(eleString);
                //if (ele[0]!=undefined) {
                if (ele.length>0) {
                    clearInterval(playInterVal);//停止定时器
                    //console.log("停止定时器...");
                    //console.log("ele:" + ele.length);
                    console.log("ele:" + ele[0].textContent);
                    resolve(ele);
                }else console.log("等待中...");
            }, 30);
        })
    }

    //progress_text
    //播放页执行代码
    function FindEleShowByClassName(eleString) {
        return new Promise(function (resolve) {
            let nextInterVal = setInterval(() => {
                var ele = document.getElementsByClassName(eleString);
                //if (ele[0]!=undefined) {
                if (ele.length>0) {
                    clearInterval(nextInterVal);//停止定时器
                    //console.log("停止定时器...");
                    //console.log("ele:" + ele.length);
                    console.log("ele:" + ele[0].textContent);
                    resolve(ele);
                }else console.log("等待中...");
            }, 3000);
        })
    }

    function BiJiao(FenStr){
        var sp=FenStr.split("，");
        return sp[1].substr(2)==sp[0].substr(2)
    }

    function Delay(time) {
        if (!Number.isInteger(time)) {
            time = 1000;
        }
        return new Promise(resolve => {
            setTimeout(function () {
                resolve('done');
            }, time);
        });
    }
})();
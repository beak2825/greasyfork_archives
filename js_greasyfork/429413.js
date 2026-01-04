// ==UserScript==
// @name         继续自动教育
// @version      0.4
// @description  让教育自动继续!
// @author       小强
// @match        https://jsglpt.gdedu.gov.cn/ncts/*
// @match        https://jsxx.gdedu.gov.cn/study/course/*
// @match        https://jsxx.gdedu.gov.cn/a_*
// @icon         https://img.zcool.cn/community/01c2ac57beb18d0000012e7eaa6d19.jpg@1280w_1l_2o_100sh.jpg
// @grant        none
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/429413/%E7%BB%A7%E7%BB%AD%E8%87%AA%E5%8A%A8%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/429413/%E7%BB%A7%E7%BB%AD%E8%87%AA%E5%8A%A8%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

var times=0
var tt=0
const NCTS_URL = 'https://jsglpt.gdedu.gov.cn/ncts'
var my_url=""
console.log('开工！！！')
setInterval(crack,6*1000);

function sleep(time, desc = 'sleep') {
    return new Promise(resolve => {
        //sleep
        setTimeout(() => {
            console.log(desc, time, 's')
            resolve(time)
        }, Math.floor(Math.abs(time) * 1000))
    })
}


function crack(){
    if(times==0){
        tt=$('[id="viewTimeTxt"]').text();
    }
    times++;
    console.log('crack!',times,tt,$('[id="viewTimeTxt"]').text());
    if(times>30){
       if($('[id="viewTimeTxt"]').text()==tt)
       {
           console.log('时间数据没更新，刷新!');
           location.reload();
       }
        else{
            times=0;
        }
    }

    if(isComplete)
    {
        console.log('课程完成，进入下一节！')
        goNext();
    }
    if($('.mylayer-closeico')[0])
    {
        console.log('没时间回答问题，退下吧！')
        $('#questionDiv').stopTime('C');
        $('.mylayer-closeico').trigger('click');
        player.videoMute();
        parent.player.videoPlay();
    }
    if (player.volume) {
        player.videoMute();
    }
        //暂停时自动开始播放
    if (player.V.paused) {
       console.log('视频已暂停，正在重启播放');
       player.videoPlay();
    }
}
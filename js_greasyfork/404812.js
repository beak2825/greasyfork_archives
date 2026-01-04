// ==UserScript==
// @name         行知学徒自动网课
// @namespace    http://ifdo.ml/
// @version      2021.2.271
// @description  （行知学徒旗下）自动观看,增加新版人脸识别与自动播放
// @match       *://www.ixueto.com/*
// @grant        none
// @icon        https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=766487563,3702239434&fm=26&gp=0.jpg
// @downloadURL https://update.greasyfork.org/scripts/404812/%E8%A1%8C%E7%9F%A5%E5%AD%A6%E5%BE%92%E8%87%AA%E5%8A%A8%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404812/%E8%A1%8C%E7%9F%A5%E5%AD%A6%E5%BE%92%E8%87%AA%E5%8A%A8%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let faceinfoid = 1;
    let info = 0;
    let asdf = function(){
        $("#layui-layer-shade4").click();
        //console.log("点击...");
    }
    let url=window.location.pathname;
    if(url.lastIndexOf('/web/') + 1){
        window.location.href="//www.ixueto.com/login.aspx";
    }
    if(window.location.pathname=="/usercompletetest.aspx"){
        if(!$('#dvpass')[0].hidden){
            window.location.href=$('a')[0].href;
        }
    }
let autoNext = function(){
    info++;
	//获取提示信息
	let timeStr = $("#s_message").html();
    let faceid=$("#btn_face").html();
    let playinfo =$("#s_message2").html();
    let passinfo = $("#dvpass").html();
    let faceinfo = $("#tips").html();

    if(faceinfo=='识别成功，计时中...'){
        $("#layui-layer-shade4").click();
        if($("#layui-layer-shade1").length){
            asdf();
        }
    }

    if(passinfo=='恭喜您通过了课程测试！'){
        $("a")[0].click();
    }
    if(faceid=='人脸识别'){
        if(faceinfoid){
            $("#btn_face").click();
            faceinfoid=0;
        }
        console.log("正在认证...");
    }

    //如果已经学完,直接下一集
    //if(timeStr == '本课时已学完，请完成最后一次人脸识别!'){
         //location.reload();
    //}
    if(timeStr=='本课时已学完'){
        if($("span")[0].innerText=='单元测试'){
            test();
            return;
        }
        if($("span")[0].innerText=='查看试题'){
            fun_nextLesson();
            return;
        }
    }
    if(faceid==undefined){
        player.videoPlay();
        faceinfoid=1;

    }

    //let metaData = player.getMetaDate();
    //if(metaData.paused){
        //player.playOrPause();
    //}
    if(faceinfo=='课程已结束...'){
       fun_nextLesson();
    }

	//获取已学习时长
   if(playinfo=='识别成功，计时中'){
        $("body").click();
         $("#layui-layer-shade4").click();
        console.log(playinfo);

       //1.开始位置,结束位置
       let startKey = '已学习：';
       let endKey = '秒';
       let startPos = timeStr.indexOf(startKey)+startKey.length;
       let endPos = timeStr.indexOf(endKey);
       //2.截取时长
       let alreadySeconds = timeStr.substring(startPos,endPos);


       //获取总学习时长

       //1.开始位置,结束位置
       let startKey2 = '总时长：';
       let endKey2 = '秒';
       let startPos2 = timeStr.indexOf(startKey2)+startKey2.length;
       let endPos2 = timeStr.indexOf(endKey2, timeStr.indexOf(endKey2)+1);
       //2.截取时长
       let sumSeconds = timeStr.substring(startPos2,endPos2);


       //判断两个时长是否相等
       if (alreadySeconds == sumSeconds) {
           //如果相等,那就点击下一课
           //不用点击按钮了,因为直接有个下一级的函数,执行就行
           //fun_nextLesson();

           setInterval(test(), 5500)
       } else {
           console.log('时间还没到');
           console.log(timeStr);
       }
   }

    console.log("运行："+info+"次！");
}


setInterval(autoNext, 5000); //每1000ms执行一次判断函数
    // Your code here...
})();
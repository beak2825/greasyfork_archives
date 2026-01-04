// ==UserScript==
// @name         国家智慧教育公共服务平台|国家中小学智慧教育平台|教师研修|自动挂机刷课|自动答题
// @namespace    挂机刷课
// @version      1.7
// @license      CC BY-NC-SA
// @description  进入研修专题，然后选择到你要看课的网址，直接点进去就行，会自动开始刷课和挂机。
// @author       hikonl更新 【aluyunjie【bug+v:aluyunjiesmile】】
// @match        https://www.zxx.edu.cn/teacherTraining/*
// @icon         https://www.zxx.edu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463413/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/463413/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(zhongxiaoxue,7000,"每隔7秒执行一次");

    //【document.querySelector('video').playbackRate = 16;】改变视频播放速度，如果想快点刷，请把【】里的代码在浏览器F12控制台里 复制粘贴进去，会发现看视频速度快了很多
    //适配https://www.zxx.edu.cn/training/bdbe4c1e-f540-4e9f-9fae-855ab44e2d32
    //最小化以后，后台就不会自动播放了，建议把窗口改小
    function zhongxiaoxue(){




        //检测题目
        var jiancetimu = document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_header_35MsH > div:nth-child(1) > span.index-module_title_1HDZy")
        var text = null
        if(jiancetimu == null){
            console.log("没有发现题目")		

            var playAgain = document.getElementsByClassName("course-video-reload")[0]

            if(playAgain == null){
                console.log("执行播放")
                //没题目，但是播放器没有在播放视频，因此这一步进行点击播放器的按钮
                for(var i = 0 ;i<3;i++){
                    document.getElementsByClassName("vjs-big-play-button")[0].click()

                    var jingyin =document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0]
                    if(jingyin == null){
                        console.log("静音为空，不执行静音操作");
                        document.querySelector('video').playbackRate = 16;
                    }else{
                        document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0].click();
                        document.querySelector('video').playbackRate = 16;
                    }

                }	

            }else{
                var teachAgain =  playAgain.textContent
                console.log("执行下一条视频")
                if(teachAgain == '再学一遍'){
                    //进行判断视频是否是上一个看完的，然后点击下一个视频

                    //先判断正在进行中的视频//iconfont icon_processing_fill进行中
                    var processing = document.getElementsByClassName("iconfont icon_processing_fill")[0]
                    var linear = document.getElementsByClassName("iconfont icon_checkbox_linear")[0]
                    if(processing.title == '进行中' ){
                        processing.click();
                        document.querySelector('video').playbackRate = 16;
                    }else{
                        if(linear == '未开始'){
                            linear.click()
                        }
                    }





                    //iconfont icon_checkbox_linear未开始



                }
            }



        }else{
            text = jiancetimu.textContent
        }

        if(text == '练习'){
            console.log("检测到题目")
            console.log("开始判断题型")

            var tixing = document.getElementsByClassName("_qti-title-prefix-qtype")[0].innerText
            if(tixing == '单选题'){
                console.log("题型为单选题")
                console.log("开始做题")
                //选择第一项
                document.getElementsByClassName("nqti-check")[0].click()

                setTimeout(danjixiayitianniu(),1000)
                setTimeout(danjixiayitianniu(),1000)
            }
            if(tixing =='多选题'){
                console.log("题型为多选")
                console.log("开始做题")
                //选择第一项
                document.getElementsByClassName("nqti-check")[0].click()
                //选择第二项
                document.getElementsByClassName("nqti-check")[1].click()
                document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
                setTimeout(danjixiayitianniu(),1000)
                setTimeout(danjixiayitianniu(),1000)
            }
            if(tixing =='判断题'){
                console.log("题型为判断")
                console.log("开始做题")
                //选择第一项
                document.getElementsByClassName("nqti-check")[0].click()

                document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
                setTimeout(danjixiayitianniu(),1000)
                setTimeout(danjixiayitianniu(),1000)
            }


        }

        // 新进去视频的弹出对话框“我知道了”处理
        var iknow = document.getElementsByClassName("fish-btn fish-btn-primary")[1]
        if(iknow == null){
            console.log("我知道了按钮没有发现，不执行操作")
        }else{
            var iknowtext = iknow.textContent
            if(iknowtext == '我知道了'){
                //点击我知道了按钮
                document.getElementsByClassName("fish-btn fish-btn-primary")[1].click()
            }

        }





        function danjixiayitianniu(){
            //单击下一题按钮
            document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
        }


        function clickQueDingAnNiu2(){
            // 点击视频播放按钮
            document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0].click()
            //点击静音按钮
            document.querySelector("#vjs_video_1 > div.vjs-control-bar > div.vjs-volume-panel.vjs-control.vjs-volume-panel-horizontal > button > span.vjs-icon-placeholder").click()
        }



    }

    // Your code here...
})();
// ==UserScript==
// @name         广东省专业技术人员继续教育公需课（2023版）
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  公需课
// @author       cyh09
// @match http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play* 
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469606/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882023%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469606/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882023%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

//更新了广东省专业技术人员继续教育公需课（2023版）
//借鉴了Edison 广东省教师继续教育公需课（2023）的代码
//地址：https://greasyfork.org/zh-CN/scripts/466788-%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE-2023

(function() {
    // Your code here...
    var interval = 1000;
    var choice = 0;
    var current_index=-1;


    var clickEvent = document.createEvent('MouseEvents')
    clickEvent.initEvent('click', false, false);

    var moveEvent = document.createEvent('MouseEvents')
    moveEvent.initEvent('mousemove', false, false);

    var title = document.getElementsByClassName("menuRightHeadTitle font-overhidden");
    var titleCourse =title[0].innerText;
    console.log(titleCourse);


    if(current_index>0){
        main();
    }

    function main(){

        var tag=0;

        //视频播放
        var v = document.getElementsByTagName("video")[0];
        v.dispatchEvent(clickEvent);
        document.querySelector('.prism-big-play-btn').click();


        //延时0.5秒等待服务器结果返回，获取当前课
        setTimeout(function(){
            current_index=getCurrent();

            //当前已完成百分比
            var vt = document.getElementById("realPlayVideoTime");
            console.log(vt.innerText + '%');
        },500)

        // 需要观看时长
        var s = document.getElementById("askTime");
        console.log(`需要观看时长: ${s.innerText}`);

        // 每秒检测
        function tick1(){

            var vt = document.getElementsByClassName("learnpercent");

            //console.log(vt.innerText);
            var p = vt[0].children[0].innerText;
            if(p.indexOf('已完成')!= -1 ){
                //exam();

                var txt = document.querySelectorAll("li.level1");
                var cur = getCurrent();

                var a= txt[cur + 1].getElementsByClassName("level1");
                a[1].click();

                return;
            }

            v.dispatchEvent(moveEvent);

            // 答题检测
            //var c = document.getElementsByClassName("exam-subject-text-queanswar-answer");

            var ui = document.getElementsByClassName("panel window");

            if(ui.length > 0 && ui[0].style.display !="none"){
                console.log("答题检测");

                if (choice >= ui.length){
                    choice = 0;
                }
                // 选一个
                ui[choice++].childNodes[1].checked =true ;


                // 提交按钮
                if(tag==0){
                    var reply = document.querySelectorAll("a.reply-sub");
                    reply[0].click();
                    tag=1;

                    //延时0.5秒等待服务器结果返回，自动点击确定
                    setTimeout(function(){

                        window.showModalDialog=null;

                        var c = document.getElementsByClassName("l-btn l-btn-small");
                        if(c[0]){
                            c[0].click();
                        }
                    },500)

                }else{
                    //关闭结果弹窗
                    var close = document.querySelectorAll(".panel-tool-close");
                    close[0].click();
                }

                //关闭题目
                $('#dd').dialog({onBeforeClose:function(){
                    return true;
                }});
                $('#e8888b74d1229efec6b4712e17cb6b7a_e').data('canplay','1');
                $('#dd').dialog('close');

                //再次播放
                if(v.paused){
                    document.querySelector('.prism-big-play-btn').click();
                }
            }

            setTimeout(tick1, interval);
        }

        function getCurrent(){
            var cur =-1;
            var txt = document.querySelectorAll("li.level1");
            for (var i=0, len=txt.length; i<len; i=i+1) {
                var n = txt[i].getElementsByClassName("node_name");
                if(n[0].innerText==titleCourse){

                    cur = i;
                    console.log("当前课"+ cur);
                    break;
                }
            }
            return cur;
        }


        tick1();
    }

    window.onload = main;
})();
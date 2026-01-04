// ==UserScript==
// @name         城市美日常辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  城市美日常辅助工具。
// @author       城市美
// @match        https://*.baidu.com/*
// @match        https://gzwy.gov.cn/dsfa/nc/pc/course/views/*
// @match        https://gzwy.gov.cn/page.html#/pc/nc/pagecourse/coursePlayer
// @match        https://*.gov.cn/*
// @match        *.gov.cn/*
// @match        http://*.gzjxjy.gzsrs.cn/*
// @match        http://www.gzjxjy.gzsrs.cn/*
// @match        http://www.gzjxjy.gzsrs.cn/personback/*
// @match        http://www.gzjxjy.gzsrs.cn/personback/#/courseNet
// @match        https://www.gzjxjy.gzsrs.cn/*
// @match        https://www.gzjxjy.gzsrs.cn/personback/*
// @match        https://www.gzjxjy.gzsrs.cn/personback/#/courseNet
// @match        https://gzjxjy.gzsrs.cn/*
// @require
// @grant        none

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/462012/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462012/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("test");
    // Your code here...
    /* globals jQuery, $, waitForKeyElements */
    //定义站点模块匹配

    var SiteMatch = {
        id:1001,data:{site:["百度"],match:["https://*.baidu.com/*"],function:"addRibbon_BaiduTest()"},
        id:1002,data:{site:["贵州省党员干部网络学院"],match:["https://gzwy.gov.cn/dsfa/nc/pc/course/views/*"],function:"addRibbon_VideoAutoPlay()",}
    };

    window.onload=function(){
         //if (typeof jQuery=='undefined') {
             // jQuery 已加载
           //  alert("有jQuery")
         //} else {
             // jQuery 未加载
        //     alert("无jQuery")
        // }

        if(typeof jQuery=='undefined'){
            // alert("jQuery未加载")
            //jQuery未加载
            function dynamicLoadJs(url, callback) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                if(typeof(callback)=='function'){
                    script.onload = script.onreadystatechange = function () {
                        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
                            callback();
                            script.onload = script.onreadystatechange = null;
                        }
                    };
                }
                head.appendChild(script);
            };
            dynamicLoadJs('https://libs.baidu.com/jquery/2.1.4/jquery.min.js',function(){
                 //alert('动态加载JQ成功')


                addToolBox();//基本界面
                addRibbon();//业务模块主控
            });
        } else{
            //已加载
            //alert("jQuery已加载")


            //addToolBox();//基本界面
            //addRibbon();//业务模块主控
        }


    };

            addToolBox();//基本界面
            addRibbon();//业务模块主控

})();


//业务模块主控
function addRibbon(){
    var timerInterval_ToolBox
    var pageURL = $(location).attr("href");
                timerInterval_ToolBox = self.setInterval(function(){
  console.log("Notifiy");
                    if ($("#My_ToolBox").length>0){

                        // 1、百度测试业务模块
                        if (My_matchStr(pageURL,"https://*.baidu.com/*")) {
                            addRibbon_BaiduTest();

                        }

                        // 2、自动播放业务模块 调用 （贵州省党员干部网络学院）
                        // https://gzwy.gov.cn/page.html#/pc/nc/pagecourse/coursePlayer/*
                        // https://gzwy.gov.cn/*
                        // https://gzwy.gov.cn/dsfa/nc/pc/course/views/*
                        if (My_matchStr(pageURL,"https://gzwy.gov.cn/*") || My_matchStr(pageURL,"https://*.gov.cn/*")) {
                            addRibbon_VideoAutoPlay();
                            // 面板重布局 （贵州省党员干部网络学院）
                            $("#My_ToolBox").css({
                                'min-height': 'auto',
                                'top': '120px',
                                'left':'auto',
                                'right':'5px'
                                // 'line-height': '42px',
                                // 'background-color': '#2ffe84',
                                // 'cursor': 'pointer'
                            });
                        }
                        // 3、自动播放业务模块 调用 （贵州省专业技术人员继续教育）
                        // https://gzjxjy.gzsrs.cn/*
                        if (My_matchStr(pageURL,"https://*.gzjxjy.gzsrs.cn/*")||My_matchStr(pageURL,"https://gzjxjy.gzsrs.cn/*")) {
                            addRibbon_VideoAutoPlay();
                            addRibbon_BaiduTest();
                            //alert("这里弹窗测试，啥用没有！");
                        }
                    };
                    clearInterval(timerInterval_ToolBox); // 清除定时器
                }, 1000);




    //1、百度测试业务模块
    function addRibbon_BaiduTest(){
        var My_BaiduTestBox = "<div id='My_BaiduTestBox'>百度测试：<spen id='My_BaiduTestButton' Style='cursor:pointer'>请点击</spen></div>";
        $("#My_ToolBoxBody").append(My_BaiduTestBox);
        $("#My_BaiduTestBox").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });
        $("#My_BaiduTestButton").on("click",function(){
            alert("这里弹窗测试，啥用没有！");
        });
    }

    //2、自动播放业务模块
    function addRibbon_VideoAutoPlay(){
        var timerInterval_AutoPlay
        var timerInterval_ProgressUnlock
        var mydate
        var mytime
        var mydatetime

        //添加控件 智能播放
        var My_VideoAutoPlayBox = "<div id='My_VideoAutoPlayBox'>智能播放：<spen id='My_VideoAutoPlayButton' Style='cursor:pointer'>已停用</spen></div>";
        $("#My_ToolBoxBody").append(My_VideoAutoPlayBox);
        $("#My_VideoAutoPlayBox").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });

        //添加控件 倍数播放
        var My_VideoPlaySpeedBox = "<div id='My_VideoPlaySpeedBox'>倍数播放：<spen id='My_VideoPlaySpeedButton' Style='cursor:pointer'>1x</spen></div>";
        $("#My_ToolBoxBody").append(My_VideoPlaySpeedBox);
        $("#My_VideoPlaySpeedBox").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });

        //绑定事件  倍数播放控件(单击事件)
        $("#My_VideoPlaySpeedButton").on("click",function(){
            if ($("#My_VideoPlaySpeedButton").text()=="1x") {
                $("#My_VideoPlaySpeedButton").text("10x");
            } else {
                $("#My_VideoPlaySpeedButton").text("1x");
            }
        })


        //添加控件 调转播放
       // var My_JumpPlayBox="<div id='My_JumpPlayBox'>进度条：<spen id='My_JumpPlayButton' Style='cursor:pointer'>未解锁</spen></div>";
       // var My_JumpPlayBox="<div id='My_JumpPlayBox'><spen id='My_JumpPlayButton' Style='cursor:pointer'>一键完成</spen></div>";
       // $("#My_ToolBoxBody").append(My_JumpPlayBox);
        var My_JumpPlayBox2="<div id='My_JumpPlayBox2'><spen id='My_JumpPlayButton2' Style='cursor:pointer'>一键完成</spen></div>";
        $("#My_ToolBoxBody").append(My_JumpPlayBox2);
        $("#My_ToolBoxBody").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });

        //绑定事件  调转播放控件(单击事件)
        $("#My_JumpPlayButton").on("click",function(){
            console.log("调转播放");
            console.log($("video")[0].duration);
            //设置 进度了超过历史最大进度
            $("#app")[0].__vue__.$children[0].currentVideoStatHour=$("video")[0].duration;
            $("video")[0].currentTime=$("video")[0].duration;
            $("video")[0].trigger('pause');
            //$("video")[0].currentTime = $("video")[0].duration-5;
        });

        //绑定事件2  调转播放控件(单击事件)
        $("#My_JumpPlayButton2").on("click",function(){
            $("video")[0].play()
            $("#My_JumpPlayButton2").css({"color": "#AAAAAA",'pointer-events': 'none'});
            setTimeout(()=>{
                $("#My_JumpPlayButton2").css({"color": "#FFFFFF",'pointer-events': 'auto'});
                app.__vue__.$children[0].$children[0].$children[0].$children[0].$children[0].$children[0].realWatchTime2 =  app.__vue__.$children[0].$children[0].$children[0].$children[0].$children[0].$children[0].curVideoAllTime;
                $("#My_JumpPlayButton2").css({"color": "#AAAAAA",'pointer-events': 'none'});
            },1000);
            setTimeout(()=>{
                $("#My_JumpPlayButton2").css({"color": "#FFFFFF",'pointer-events': 'auto'});
                $("video")[0].pause()
            },2000);
        })



        //进度条解锁
        timerInterval_ProgressUnlock = self.setInterval(function(){
            //currentTime
            if($("#app")[0].__vue__.$children[0].currentVideoStatHour==$("video")[0].duration){
                $("#My_JumpPlayButton").text("一键完成");
                $("#My_JumpPlayButton").css('color', '#fff');
            }else{
                $("#My_JumpPlayButton").text("一键完成");
                $("#My_JumpPlayButton").css('color', '#fff');
            }
        },1000);

/*
        // 一键完成
        // $("#app").__vue__.$children[0]
        var My_OneKeyComplete="<div id='My_OneKeyCompleteBox'><spen id='My_OneKeyCompleteButton' Style='cursor:pointer'>一键完成</spen></div>";
        $("#My_ToolBoxBody").append(My_OneKeyComplete);

        //绑定事件  一键完成控件(单击事件)
        $("#My_OneKeyCompleteButton").on("click",function(){
            console.log("一键完成控件(单击事件)");
            var My_courseId=$("#app")[0].__vue__.$children[0].courseId
            var My_worksId=$("#app")[0].__vue__.$children[0].mediaId
            var My_totalHour=$("#app")[0].__vue__.$children[0].totalHour
            var My_studyTime=My_totalHour
            var My_userId=$("#app")[0].__vue__.$children[0].userId
            var GetData={
                courseId:My_courseId,
                worksId:My_worksId,
                totalHour:My_totalHour,
                studyTime:My_studyTime,
                userId:My_userId,
            }
            var PostData={
                courseId:My_courseId,
                worksId:My_worksId,
                totalHour:My_totalHour,
                studyTime:My_studyTime,
            }
            console.log(GetData);
            console.log(PostData);
            if ($("#My_OneKeyCompleteButton").text()=="一键完成"){
                console.log("开始发送数据");
                $("#My_OneKeyCompleteButton").text("发送中，请等待！")
                $.ajax({
                    url:"http://117.187.247.151:80",
                    type:"GET",
                    data:GetData,
                    success:function(result,status,xhr){
                        console.log(result);
                        console.log(status);
                        console.log(xhr);
                    },
                    error:function(xhr,status,error){
                        console.log(xhr);
                        console.log(status);
                        console.log(error);
                    }
                });
            }else{
                console.log("发送中,请等待！");
            }
        })

*/

        //绑定事件  智能播放控件(单击事件)
        $("#My_VideoAutoPlayButton").on("click",function(){
            let fgjobj_click_count = 0
            if ($("#My_VideoAutoPlayButton").text()=="已停用") {
                $("#My_VideoAutoPlayButton").text("已启用");
                timerInterval_AutoPlay = self.setInterval(function(){

                    //查找video，后台持续播放部分
                    if ($("video").length>0){
                        $("video").trigger('play');//后台持续播放
                        // $("video").prop('muted', true);//静音
                        // $("video").prop('playbackRate', '16');//加速
                        if($("#My_VideoPlaySpeedButton").text()=="10x"){
                            $("video").prop('playbackRate', '10');
                        }else{
                            $("video").prop('playbackRate', '1');
                        }
                    };

                    //添加自动下一视频
                    if($(".active span:contains('已学完')").length>0){
                        if($(".active").html()!=$(".is-flex").html()){
                            $(".active").next().children(".el-step__main").children(".el-step__title").children("p").click();
                            mydate = new Date();
                            mytime=mydate.toLocaleTimeString(); //获取当前时间
                            mydatetime=mydate.toLocaleString( ); //获取日期与时间
                            console.log(mydatetime + "  " + $(".active").find("p").attr("title")+ "  已完成学习。");
                            console.log(mydatetime + "  切换播放下一视频：" + $(".active").next().find("p").attr("title"));
                        }
                    }


                    //查找“防挂机提醒，请点击确定继续学习”，点击确定
                    var fgjobj=$("div>p:contains('防挂机提醒，请点击确定继续学习')").parent().next().children().children()
                    if (fgjobj.length>0 && fgjobj.text()=="确 定"){
                        fgjobj.click();
                        fgjobj_click_count=fgjobj_click_count+1
                        mydate = new Date();
                        mytime=mydate.toLocaleTimeString(); //获取当前时间
                        mydatetime=mydate.toLocaleString( ); //获取日期与时间
                        console.log(mydatetime + "  平台 防挂机提醒 点击 "+ fgjobj_click_count + " 次。");
                    };
                    // console.clear();
                    // mydate = new Date();
                    // mytime=mydate.toLocaleTimeString(); //获取当前时间
                    // mydatetime=mydate.toLocaleString( ); //获取日期与时间
                    // console.log(mydatetime);

                }, 1000);
            } else {
                $("#My_VideoAutoPlayButton").text("已停用");
                clearInterval(timerInterval_AutoPlay); // 清除定时器
                // console.log("已停用");
            }
        });
    }
}



//基本界面
function addToolBox(){
    var ToolBox = "<div id='My_ToolBox' ></div>";

    var timerInterval_Body
    timerInterval_Body = self.setInterval(function(){
        if ($("body").length>0){
            clearInterval(timerInterval_Body);
            // alert("body已加载")

    $("body").before(ToolBox);
    /*
        方法：
        1、元素之前.before()；
        2、元素之后.after()；
        3、元素内部的结尾插入append()；
        4、元素内部的开头插入.prepend()。
        */
    $("#My_ToolBox").css({
        // 'width':120,
        // 'width':5,
        // 'height':50,
        'display': 'block',
        'vertical-align': 'top',
        // 'background-color': '#25ae84',
        'background-color': '#1155ff',
        'color': '#ffffff',
        'margin-bottom': '2px',
        'z-index':99999,
        'position': 'fixed',
        'top':'100px',
        'left':'11px',
        '-moz-user-select':'none',
        '-webkit-user-select':'none'
        // 'text-align': 'center',
        // 'line-height': '42px',
        // 'cursor': 'pointer'
    });

    var ToolBoxTille = "<div id='My_ToolBoxTille'>工具面板</div>";
    $("#My_ToolBox").append(ToolBoxTille);
    $("#My_ToolBoxTille").css({
        'font-size': '16px',
        'text-align': 'center',
        'line-height': '42px',
        'display':'none'
        // 'cursor': 'pointer'
    });

    var ToolBoxBody = "<div id='My_ToolBoxBody'></div>";
    $("#My_ToolBox").append(ToolBoxBody);
    $("#My_ToolBoxBody").css({
        // 'width':80,
        'font-size': '16px',
        'text-align': 'center',
        'height':'100%',
        'line-height': '42px',
        'display':'none'
        // 'background-color': '#2ffe84',
        // 'cursor': 'pointer'
    });

    var ToolBoxDisplay = "<div id='My_ToolBoxDisplay'>＋</div>";
    $("#My_ToolBox").append(ToolBoxDisplay);
    $("#My_ToolBoxDisplay").css({
        'font-size': '16px',
        'text-align': 'center',
        // 'height':'auto',
        // 'line-height': '42px',
        'background-color': '#ff0000',
        'cursor': 'pointer',
        'position': 'absolute',
        'top': '-11px',
        'right': '-11px',
        'border-radius': '50%',
        'height': '23px',
        'width': '23px',
    });

    //绑定事件
    $("#My_ToolBoxDisplay").on("click",function(){

        if ($("#My_ToolBoxDisplay").text()=='×') {
            $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                'display':'none'
            });
            $("#My_ToolBoxDisplay").css({
                'display':'block'
            });
            $("#My_ToolBoxDisplay").text('＋');
        } else {
            $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                'display':'block'
            });
            $("#My_ToolBoxDisplay").css({
            });
            $("#My_ToolBoxDisplay").text('×');
        }
    });

        };
    }, 1000);

}



//公共函数部分

//1、通配符字符串比较
function My_matchStr(str1,str2){
    // 用法：
    // My_matchStr(原始字符串,带通配符字符串)
    // 返回true/false
    // 仅支持*，不支持?
    return matchRuleShort(str1,str2);
    // matchRuleShort(原始字符串,带通配符字符串)
    // alert(
    //     "1. " + matchRuleShort("bird123", "bird*") + "\n" +
    //     "2. " + matchRuleShort("123bird", "*bird") + "\n" +
    //     "3. " + matchRuleShort("123bird123", "*bird*") + "\n" +
    //     "4. " + matchRuleShort("bird123bird", "bird*bird") + "\n" +
    //     "5. " + matchRuleShort("123bird123bird123", "*bird*bird*") + "\n" +
    //     "6. " + matchRuleShort("s[pe]c 3 re$ex 6 cha^rs", "s[pe]c*re$ex*cha^rs") + "\n" +
    //     "7. " + matchRuleShort("should not match", "should noo*oot match") + "\n"
    // );
    function matchRuleShort(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    };
    function matchRuleExpl(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        rule = rule.split("*").map(escapeRegex).join(".*");
        rule = "^" + rule + "$"
        var regex = new RegExp(rule);
        return regex.test(str);
    };
};
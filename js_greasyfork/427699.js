// ==UserScript==
// @name         aq100lite
// @namespace    https://bjdc.100anquan.com/
// @version      1.0
// @description  安全生产快速学习
// @author       Shining
// @match        https://*.100anquan.com/*
// @match        http://*.100anquan.com/*
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @connect      100anquan.com
// @run-at       document-end
// ==/使用网页自带的@require      https://libs.baidu.com/jquery/1.8.3/jquery.min.js
// ==/不require引入jquery时
// ==/不引入jquery,$设置的是原网页的jquery,如果设置为document-start时：因为提前注入，无法使用原网页的jquery，会提示找不到$
// ==/unsafeWindow 沙盒模式
// ==/document-end 文件加载后运行插件
// @downloadURL https://update.greasyfork.org/scripts/427699/aq100lite.user.js
// @updateURL https://update.greasyfork.org/scripts/427699/aq100lite.meta.js
// ==/UserScript==
var tooberUrl = unsafeWindow.location.href;
var $ = unsafeWindow.$;
GM_log(tooberUrl);
var orgProjectId = 0; //https://bjdc.100anquan.com/project/projectV2/21381/Detai
window.onload = function() {
    if (tooberUrl == "https://bjdc.100anquan.com/" || tooberUrl.indexOf("loginGeneralV2/") != -1) {
        GM_log("进入首页");
        var logFun = unsafeWindow.GetLoginInfo;
        unsafeWindow.GetLoginInfo = function() {
            GM_log("登录事件");
            //----拦截方法1
            //可以logFun.toString()
            //替换字符串后，再见eval
            //var funStr = logFun.toString();
            //GM_log(funStr);
            //return unsafeWindow.eval(funStr);
            //----拦截方法2
            var accountName = $("#txtLogonUserCode");
            if (accountName.length > 0 != undefined && accountName.val() != "") {
                var user = {
                    userName: accountName.val()
                };
                GM_setValue("aq100_user", user);
            }
            GM_log(accountName);
            logFun();
        }
    }
    if (tooberUrl.indexOf("/course/courseEleView?") != -1) {
        //因为@run-at document-start，在此设置页面加载完才运行
        GM_log("学习项");
        //注意前端函数
        unsafeWindow.hackTime = hackTime;
        //------手动按钮----
        $("#Menu").before('<input id="hackBtn" style="background-color:yellow;font-size:20px" type="button" style="height:60px" onclick="hackTime()" value="【破解学习】">');
       //自动执行
        window.setInterval(function() {
            hackTime();
        },
        1000);
    } else if (tooberUrl.indexOf("/directExam/examIndexAutoV2") != -1) {
        //HTML directExam();
        //https://bjdc.100anquan.com/directExam/freePracticeV2/2141/4456/stochastic
        //（单/多选、判断题都有的考试地） https://bjdc.100anquan.com/directExam/examIndexAutoV2?examId=1523&examPaperId=19461&orgProjectId=2900
        GM_log("考试");
        var subBtn = $("div[onclick='subTest()']");
        if (subBtn.length > 0) {
            if ($("div").length > 0) {
                $("div").eq(0).before('<h1 style="text-align:center;background-color:black;color:white">已为您答完，您可以校对【答案】，或直接点击【交卷】完成考试。</h1>');
            }
        }
        $("ul").each(function() {
            var ul = $(this);
            var dl = ul.parent().parent().parent().parent().attr("id");
            GM_log(dl);
            var sty = [];
            if (dl != undefined) {
                sty = dl.split("_");
            }
            ul.find("li").each(function() {
                var attr = $(this).attr('onclick');
                if (typeof attr !== typeof undefined && attr !== false) {
                    if (attr.indexOf("chooseAnswer(") != -1) {
                        //单选题chooseAnswer
                        //chooseAnswer('4','205549','0','0');  //最后一位是'1'是正确的
                        if (endWidth(attr, "'1');")) {
                            $(this).append('&nbsp;&nbsp;&nbsp;&nbsp;<strong style="background-color:green;font-size:20px;color:white">【✔】</strong>');
                            $(this).click(); //自动点击正确
                            if (sty.length >= 2) {
                                $("#SHOWSTYLE_" + sty[1]).removeClass().addClass("li_2");
                            }
                        }
                    } else if (attr.indexOf("chooseJudgeAnswer(") != -1) {
                        //判断题chooseJudgeAnswer
                        //chooseJudgeAnswer('T','332956','1')
                        //选择题以1结尾的应该选择正确，以0结尾的应该选择错误
                        if (endWidth(attr, "'1');")) {
                            if (ul.find(".hkmsg").length <= 0) { //避免重复添加
                                ul.find("li").eq(0).append('&nbsp;&nbsp;&nbsp;&nbsp;<strong class="hkMsg" style="background-color:green;font-size:20px;color:white">【✔】</strong>');
                                ul.find("li").eq(0).click(); //自动点击正确
                                if (sty.length >= 2) {
                                    //$("#SHOWSTYLE_" + sty[1]).removeClass().addClass("li_2");
                                    $("#SHOWSTYLE_" + sty[1]).removeClass();
                                    $("#SHOWSTYLE_" + sty[1]).css({
                                        "border": "1px solid #44d441",
                                        "background": "#ddfddc",
                                        "color": "blue"
                                    });
                                }
                            }
                        } else {
                            if (ul.find(".hkmsg").length <= 0) {
                                ul.find("li").eq(1).append('&nbsp;&nbsp;&nbsp;&nbsp;<strong class="hkMsg" style="background-color:green;font-size:20px;color:white">【✔】</strong>');
                                ul.find("li").eq(1).click(); //自动点击错误
                                if (sty.length >= 2) {
                                    //$("#SHOWSTYLE_" + sty[1]).removeClass().addClass("li_2");
                                    $("#SHOWSTYLE_" + sty[1]).removeClass();
                                    $("#SHOWSTYLE_" + sty[1]).css({
                                        "border": "1px solid #44d441",
                                        "background": "#ddfddc",
                                        "color": "blue"
                                    });
                                }
                            }
                        }
                    } else if (attr.indexOf("chooseMoreAnswer(") != -1) {
                        //多选题chooseAnswer
                        //chooseMoreAnswer('1','244380','0','1');  //最后一位是'1'是正确的
                        if (endWidth(attr, "'1');")) {
                            $(this).append('&nbsp;&nbsp;&nbsp;&nbsp;<strong style="background-color:green;font-size:20px;color:white">【✔】</strong>');
                            $(this).click(); //自动点击正确
                            if (sty.length >= 2) {
                                //$("#SHOWSTYLE_" + sty[1]).removeClass().addClass("li_2");
                                $("#SHOWSTYLE_" + sty[1]).removeClass();
                                $("#SHOWSTYLE_" + sty[1]).css({
                                    "border": "1px solid #44d441",
                                    "background": "#ddfddc",
                                    "color": "red"
                                });
                            }
                        }
                    }
                }
            });
        });
    } else if (tooberUrl.indexOf("/directExam/examInfoTestv2") != -1) {
        //HTML directExam();
        //强行考试https://bjdc.100anquan.com/directExam/freePracticeV2/2141/4456/stochastic
        GM_log("强行考试");
        //也可以加button强引网址考试
        //onclick
        $(".tj_btn").before('<button style="background-color:yellow;font-size:20px" onclick="directExam();">强行考试</button>');
    } else if (tooberUrl.indexOf("/loginV2/userLogin") != -1) {
        GM_log("跳过弱密码修改");
        if ($("html").html().indexOf("鉴于您的密码过于简单") != -1) {
            unsafeWindow.window.location.href = "https://bjdc.100anquan.com/index";
        }
    }else if(tooberUrl.indexOf("/daxing/exam/examPractice?studyCourseId=") != -1){
        //小考
        //https://bjdc.100anquan.com/daxing/exam/examPractice?studyCourseId=13593&studyCourseElementId=35906&orgProjectId=21381&eleIndex=1&allIndex=0
        $('input[value="1"]').each(function() {
             $(this).click();
           });
    }else if (tooberUrl.indexOf("/course/personStudyPage/") != -1) {
        //https://bjdc.100anquan.com/daxing/course/personStudyPage/3292/21762
        ////查看考试地址https://bjdc.100anquan.com/directExam/examInfoTestv2/2141?orgProjectId=4456
        GM_log("学习列表");
        var projectId= orgProjectId //"21381";//■■■课程ID■■■
        //hook掉判断学习时间函数，原函数里面也有一个错误 [url] 未定义
        unsafeWindow.judgeScoreXinjiang = function(courseId, obj, elementId, wareIndex) {
            GM_log("hook judgeScoreXinjiang");
            //21381//21314
            unsafeWindow.window.location.href = "/daxing/course/courseEleView?elementId=" + elementId + "&courseId=" + courseId + "&wareIndex=" + wareIndex + "&orgProjectId="+projectId;
            return;
        };
        function abc(arr){
           //https://bjdc.100anquan.com/daxing/course/courseEleView?elementId=35889&courseId=13593&wareIndex=2&orgProjectId=21381
            var element = unsafeWindow.window.location.href;
            var array = element.match(/\d+/g);
            var courseId = array[2];
            var elementId = arr[0].replace(new RegExp("'",("gm")),"");
            var wareIndex = arr[1].replace(new RegExp("'",("gm")),"");

           GM_log(elementId);
           GM_log(courseId);
           GM_log(wareIndex);
           var uuu ="https://bjdc.100anquan.com/daxing/course/courseEleView?elementId="+elementId+"&courseId="+courseId+"&wareIndex="+wareIndex+"&orgProjectId="+projectId;
            GM_openInTab(uuu);
        }
        unsafeWindow.fast = function(){
           $('[value="进入学习"]').each(function() {
               var arr = $(this).attr("onclick");
               //eval("refreshPage(this,'35889','2');");
               var array = arr.match(/'\d+'/g);
               abc(array);
           });
            $('[value="继续学习"]').each(function() {
               var arr = $(this).attr("onclick");
               //eval("refreshPage(this,'35889','2');");
               var array = arr.match(/'\d+'/g);
               abc(array);
           });
        }
        //gotoExam('1987','4460')
        //var btn = $("input[onclick^='gotoExam(']");
        //if(btn.length >0){
        //判断jquery元素是否存在不能判断undefined需要判断length
        //var arr = btn.eq(0).attr("onclick").match(/\d+/g);
        //var url = "https://bjdc.100anquan.com/directExam/examInfoTestv2/" + arr[0] +"?orgProjectId=" + arr[1];
        //GM_log("hack " + url);
        //}
        var tables = $("table");
        if (tables.length >= 1) {
            $(".table_a").eq(0).before('<button style="background-color:yellow;font-size:20px" onclick="fast();">快速学习</button>');
        }

        //***自动申请学时
        // 寻找是否有进入学习的按钮refreshPage(this,'31664','1');
        var arr = $("input[onclick^='refreshPage(']");
        if (arr.length > 0) {
            var flag = false;
            var okNum = 0; //已学习的项
            arr.each(function() {
                var str = $(this).val();
                if (str == "已学习") {
                    okNum++;
                }
            });
            if (okNum == arr.length) {
                // 拦截修改autoPayScore里的alert,修改为申请成功才返回
                // 避免重复刷新后又执行autoPayScore
                var autoPayScore = unsafeWindow.autoPayScore;
                var autoPayScoreStr = unsafeWindow.autoPayScore.toString();
                autoPayScoreStr = autoPayScoreStr.replace('location = location;', '');
                autoPayScoreStr = autoPayScoreStr.replace('alert("申请成功!")', 'alert("申请学时成功!");location = location;');
                if ($("input[onclick='autoPayScore()']").length > 0) {
                    GM_log("未申请学时,将自动申请");
                    //unsafeWindow.autoPayScore();
                    //拦截以后
                    //eval里的autoPayScoreStr字符串不是能直接执行的script
                    //而是定义的 function autoPayScore()方法；
                    //需要在eval后面追加立即执行字符串
                    unsafeWindow.eval(autoPayScoreStr + "autoPayScore();");

                } else {
                    GM_log("已申请学时");
                }
                $("title").html("■已学完■");
            }
        }
    } else if (tooberUrl.indexOf("/project/projectV2/") != -1) {
        //https://bjdc.100anquan.com/project/projectV2/4010/Detai
        //破解后 https://bjdc.100anquan.com/person/personOrgSubjectList?orgProjectId=4515
        var array = tooberUrl.match(/\/\d+\//g);
        orgProjectId = array[0].replace(new RegExp("/",("gm")),"");
        GM_log("课程列表"+orgProjectId);
        var regBtn = $("button[onclick^='registration(']").eq(0);
        if (regBtn != undefined) {
            var onc = regBtn.attr("onclick");
            //registration('0.0','2020-02-25 10:59:40.0')
            if (onc != undefined && onc.indexOf("registration('0.0'") == -1) {
                //收费的
                var substr = tooberUrl.match(/\/(\d+)\//);
                if (substr.length >= 1) {
                    var num = substr[0].replace(/\//g, '');
                    var script = "javascrtpt:window.location.href='https://bjdc.100anquan.com/person/personOrgSubjectList?orgProjectId=" + num + "'";
                    regBtn.parent().before('<br/><button class="btn-primary" style="margin-right:100px;" onclick="' + script + '">破解学习</button>');
                }
            }
        }
    }
    //else if(tooberUrl.indexOf("/course/personStudyPage/") != -1){
    //    // personStudyPage/4456/18881     orgProjectId/courseId
    //    // refreshPage(this,'59851','1');
    //    // goto https://bjdc.100anquan.com/daxing/course/courseEleView?elementId=59851&courseId=18881&wareIndex=1&orgProjectId=4456
    //    unsafeWindow.getItem = getItem //同名函数注入到前台
    //    $(".btn_ab").each(function(){
    //        var onc = $(this).attr("onclick");
    //        if(onc.indexOf("refreshPage") != -1){
    //            var arr = tooberUrl.split("\/");
    //            var orgProjectId = arr[arr.length - 2];
    //            var courseId = arr[arr.length - 1];
    //            var elementId = onc.split(",")[1].replace(/'/g,"");
    //            var wareIndex = onc.split(",")[2].replace(/'|\);/g,"");
    //            $(this).before('<input name="button2" type="button" class="btn_ab" id="button2" onclick="getItem('+elementId+','+courseId+','+wareIndex+','+orgProjectId+');" value="学习完毕">');
    //        }
    //    });
    //}

    function endWidth(str, target) {
        var start = str.length - target.length;
        var arr = str.substr(start, target.length);
        if (arr == target) {
            return true;
        }
        return false;
    }
    function getItem(elementId, courseId, wareIndex, orgProjectId) {
        var url = "https://bjdc.100anquan.com/daxing/course/courseEleView?elementId=" + elementId + "&courseId=" + courseId + "&wareIndex=" + wareIndex + "&orgProjectId=" + orgProjectId;
        get(url,
        function(html) {
            GM_log(html);
        });
    }
    function get(url, call) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {},
            onload: function(responseDetails) {
                var html = responseDetails.responseText;
                call(html);
            }
        });
    }
    function hackTime(nextOnClick) {
            $("#stayInVideoTime").val(10000);
            unsafeWindow.ajaxSendData();
            unsafeWindow.returnForward();
    }
    function hackTime1(nextOnClick) {
        var isFlash = false; //判断是否是flash控件播放
        var player = unsafeWindow.window.cc_js_Player;
        if (player == undefined) {
            isFlash = true;
        }
        var time = 0;
        if (!isFlash) {
            time = Math.round(unsafeWindow.window.cc_js_Player.getDuration());
        } else {
            time = Math.round(unsafeWindow.player.j2s_getDuration());
        }
        if (!isNaN(time) && time > 0) {
            $("#stayInVideoTime").val(time);
            unsafeWindow.ajaxSendData();
            $("#hackBtn").val("已学完【" + time + "】秒");
            $("#hackBtn").css({
                'background-color': 'green',
                'color': 'white'
            });
            $('#hackBtn').attr("disabled", "disabled");
                unsafeWindow.returnForward();

        } else {
            var timestamp = new Date().getSeconds();
            $("#hackBtn").val("网慢无法加载时按【F5】键刷新,视频加载中【" + timestamp + "】");
            $("#hackBtn").css({
                'background-color': 'red',
                'color': 'white'
            });
        }
        try {
            if (!isFlash) {
                unsafeWindow.window.cc_js_Player.pause();
            } else {
                GM_log("FLASH NOT FUNCTION PAUSE();");
            }
        } catch(err) {
            GM_log(err);
        }
    }
}
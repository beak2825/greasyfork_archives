// ==UserScript==
// @name         小小星继续教育学习工具
// @namespace    SmilerGo
// @version      2.2
// @description  成都市中小学继续教育网学习小工具
// @author       小新学IT
// @match        https://www.cdjxjy.com/IndexMain.aspx
// @icon         https://t7.baidu.com/it/u=1951548898,3927145&fm=193&f=GIF
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442701/%E5%B0%8F%E5%B0%8F%E6%98%9F%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442701/%E5%B0%8F%E5%B0%8F%E6%98%9F%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    var current = 0;
    var alreadV = false;
    var globalControl = false;

    window.listInit = function () {
        var baseDivId4 = "fnode4";
        var baseDivId5 = "fnode5";
        console.log("列表数据初始化");
        if (sessionStorage.notFirst === undefined) {
            sessionStorage.notFirst = 1;
        }
        // var w = window.fnode4;
        var w = $(baseDivId4);

        // 课程名称（可点击）
        let aList = $("#UpdatePanel1 .table_all .litable .color_span",window.frames[baseDivId5].document);
        console.log("课程信息");
        console.log(aList);
        // 课程名称（可点击）
        var btnList = $("#UpdatePanel1 .table_all .litable .xx_ben a", window.frames[baseDivId5].document);
        // 课程信息检索
        console.log("课程名称点击按钮");
        console.log(btnList);
        // list 数据
        var litable = $("#UpdatePanel1 .table_all .litable", window.frames[baseDivId5].document);
        // 翻页按钮
        var actionList = $("#AspNetPager1 div", window.frames[baseDivId5].document).eq(0).children().get();

        var index = 0;

        if (actionList.length >= 0) {
            var selectclassid = getParams('scid', btnList[index].href);
            console.log("当前课程ID:" + selectclassid);
            var pyh_doc_ht = "当前学习课程ID：" + selectclassid;
            $("#pyh_dis").html(pyh_doc_ht);
            // 锁定新的课程
            lockCourse(selectclassid);
        } else {
            current += 1
            if (current < actionList.length) {
                console.log(actionList[current]);
                actionList[current].click();
                window.setTimeout(listInit, 3000);
            } else {
                console.log('没有找到需要学习的课程');
            }
        }

        // 课程锁定
        function lockCourse(id) {
            $.ajax({
                url: "/ashx/SelectApi.ashx?a=UpdateSelectState",
                type: "POST",
                data: { "selectclassid": id },
                dataType: "json",
                success: function (data) {
                    console.log("课程锁定结果:" + data);
                    current = 0;
                    alreadV = false;
                    aList[index].click();
                    window.setTimeout(studyCourse, 3000);
                },
                complete: function(){
                    current = 0;
                    alreadV = false;
                    aList[index].click();
                    window.setTimeout(studyCourse, 3000);
                    window.setTimeout(printStatus, 1000);
                    console.log("课程锁定完成!");
                }
            });
        }
        // 学习课程
        function studyCourse () {
            var w = document.fnode5;
            w.updata = updata;
            w.showyzm = showyzm;
            // openOtherInfo()
            var timer = window.setInterval(function () {
                w.UpdateTime();
                $.ajax({
                    url: "/ashx/SelectApi.ashx?a=UpdateLookTime",
                    type: "POST",
                    data: { "selectclassid": w.selectclassid },
                    dataType: "json",
                    success: function (data) {
                        if (w.Startime > 2700 || (data.message.indexOf('已完成') > -1) || !data) {
                            console.log("当前课程已学习结束!")
                            alreadV = true;
                            window.clearInterval(timer);
                            window.location.reload();
                            window.setTimeout(listInit, 3000);
                        }
                    },
                    complete: function(){
                        console.log("5分钟刷新时间记录已执行!");
                    }
                });
            }, 300000);
            window.setTimeout(automaticRecording, 60000);
        }

        function showyzm () {
            console.log("验证码弹窗已调用");
        }

        function updata() {
            var w = document.fnode5;
            console.log(w);
            w.UpdateTime();
            $.ajax({
                url: "/ashx/SelectApi.ashx?a=UpdateLookTime",
                type: "POST",
                data: { "selectclassid": w.selectclassid },
                dataType: "json",
                success: function (data) {
                    console.log("课程锁定时间更新结果:");
                    console.log(data);
                }
            });
        }
        // 自动填写学习记录
        function automaticRecording () {
            var w = document.fnode5;
            w.VerifyRead = VerifyRead;
            w.alert = function () {}
            // 点击获取评论
            var btn = $("#btncommment", w.document).get()[0];
            // 学习记录
            var tab = $(".course-tab .tabItem", w.document).eq(1).get()[0];
            btn.click();
            tab.click();
            window.setTimeout(function () {
                console.log("自动填写观看评语中...");
                var firstlabel = $("#UpdatePanel2 .label", w.document).eq(0).get()[0];
                var content = firstlabel.innerHTML || '';
                console.log(firstlabel);
                console.log(content);
                $("#txtareainnertContents", w.document).val(content);
                $("#txtareaExperience", w.document).val(content);
                $("#AddRecord", w.document).click();
            }, 3000)
        }

        function VerifyRead() {
            var w = document.fnode5;
            var btntext = $("#AddRecord", w.document).text();
            if (btntext == "立即提交") {
                var inncount = $("#txtareainnertContents", w.document).val();
                var Experience = $("#txtareaExperience", w.document).val();
                var readlength = inncount.length + Experience.length;
                if (inncount == "") {
                    // layer.alert("学习记录内容不能为空！");
                    console.log("学习记录内容不能为空!");
                    return false;
                }
                if (Experience == "") {
                    // layer.alert("学习记录体会不能为空！");
                    console.log("学习记录体会不能为空!");
                    return false;
                }
                if (readlength < 50) {
                    //layer.alert("你的学习记录未达到50字！");
                    console.log("你的学习记录未达到50字!");
                    return false;
                }
                else {
                    var CourseId = '59bfec83-e81b-4617-89c4-18b2f446011b';
                    $("#AddRecord", w.document).text("提交中...");
                    $.ajax({
                        url: "/ashx/SelectApi.ashx?a=addRecord",
                        type: "POST",
                        data: { "selectclassid": selectclassid, "MainContents": inncount, "PerceptionExperience": Experience, "CourseGuId": CourseId },
                        dataType: "json",
                        success: function (data) {
                            console.log("addRecord");
                            console.log(data);
                            if (data.state == "success") {
                                // layer.alert("学习记录已提交成功！");
                                console.log("学习记录已提交成功!");
                                $("#AddRecord", w.document).text("学习记录已提交");
                                $("#labstudentRecord", w.document).text("2、您已满足学习记录要求！");

                                var fbdate = new Date();
                                // var htmls = "<div class='time'>发表时间：" + fbdate.Format("yyyy-MM-dd hh:mm:ss")+"</div>";
                                var htmls = "<div class='time'>发表时间：" + fbdate.toLocaleString()+"</div>";
                                htmls += " <div class='txt'> 内容：" + inncount + "</div>";
                                htmls += " <div class='txt'> 体会：" + Experience + "</div>";
                                $("#Recorddiv", w.document).html(htmls);
                                exitPage();
                            }
                            else {
                                //layer.alert(data.message);
                                console.log(data.message);
                                $("#AddRecord", w.document).text("立即提交");
                            }
                        }
                    });

                }
            }
        }
    }

    // 获取当前窗口相对路径
    function GetUrlRelativePath(){
        let pathName = window.location.pathname;
        console.log("当前窗口路径:" + pathName);
        return pathName;
    }

    console.log("当前窗口路径:" + GetUrlRelativePath() + window.location.hash);

    if (GetUrlRelativePath() === "/IndexMain.aspx") {
        // window.location.href='https://www.cdjxjy.com/IndexMain.aspx#/student/SelectCourseRecord.aspx';
        // window.location.replace("https://www.cdjxjy.com/IndexMain.aspx#/student/SelectCourseRecord.aspx")
        console.log("进入/IndexMain.aspx");
        globalControl = false;
    }
    if (GetUrlRelativePath() === '/IndexMain.aspx' && location.hash.indexOf('SelectCourseRecord') > -1) {
        // globalControl = window.confirm('是否开启自动化操作???');
        // window.location.reload();
        console.log("进入SelectCourseRecord");

        layer.msg('窗口核验完毕！！！');
        globalControl = true
    }

    var progressParent = "<div id=\"pyh_dis\" class=\"layui-progress\" style=\"width: 100%; height: 30px; line-height: 30px; margin: 5px 15px; display: block; \"> <div class=\"layui-progress-bar\" lay-percent=\"10%\"></div>"
        +"<a class=\"sc_btn\" style=\"width: 84px; height: 26px; color: #ffffff; float: right; cursor: pointer; display: block; margin: 5px 30px; background:url(../images/xx_btn.jpg) no-repeat; line-height: 26px; text-align: center;\" onclick=\"listInit()\">starrt</a>"+
        +"</div>";
    console.log("进度条代码" + progressParent);
    $("#form1").prepend(progressParent);

    // window.setTimeout(listInit, 3010); // 观看五十分钟 + 10s
    window.setTimeout(listInit, 5000); // 开始执行课程数据解析

    function printStatus() {
        var w = document.fnode5;
        var html_time = "<->><<-> 你已经学习了" + w.hou + "小时" + w.min + "分"+ w.sec + "秒";
        $("#pyh_dis").html(html_time);
        if(!alreadV) {
            window.setTimeout(printStatus, 1000);
        }
    }
    //  获取课程信息
    function getParams(name, target) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = target.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
})();
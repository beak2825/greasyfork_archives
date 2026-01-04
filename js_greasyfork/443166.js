// ==UserScript==
// @name         电子科大在线助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  登录后进入“在线学习模块”自动开始学习
// @author       Idwins
// @match        https://student.uestcedu.com/console/apply/student/student_learn.jsp*
// @match        http://learning.uestcedu.com/learning2021/course/course_learning.jsp*
// @match        https://learning.uestcedu.com/learning2021/course/course_learning.jsp*
// @match        http://learning.uestcedu.com/learning2019/course/course_learning.jsp*
// @match        https://learning.uestcedu.com/learning2019/course/course_learning.jsp*
// @match        http://learning.uestcedu.com/learning2020/course/course_learning.jsp*
// @match        https://learning.uestcedu.com/learning2020/course/course_learning.jsp*
// @match        http://learning.uestcedu.com/learning3/scorm/scoplayer/load_sco.jsp*
// @match        https://learning.uestcedu.com/learning3/scorm/scoplayer/load_sco.jsp*
// @match        http://learning.uestcedu.com/learning2020/scorm/scoplayer/load_sco.jsp*
// @match        http://learning.uestcedu.com/learning2021/scorm/scoplayer/load_sco.jsp*
// @match        http://learning.uestcedu.com/learning2019/scorm/scoplayer/load_sco.jsp*
// @match        https://learning.uestcedu.com/learning2020/scorm/scoplayer/load_sco.jsp*
// @match        https://learning.uestcedu.com/learning2021/scorm/scoplayer/load_sco.jsp*
// @match        https://learning.uestcedu.com/learning2019/scorm/scoplayer/load_sco.jsp*
// @match        http://learning.uestcedu.com/learning2021/exam/portal/view_answer.jsp*
// @match        http://learning.uestcedu.com/learning2019/exam/portal/view_answer.jsp*
// @match        http://learning.uestcedu.com/learning2020/exam/portal/view_answer.jsp*
// @match        https://learning.uestcedu.com/learning2021/exam/portal/view_answer.jsp*
// @match        https://learning.uestcedu.com/learning2019/exam/portal/view_answer.jsp*
// @match        https://learning.uestcedu.com/learning2020/exam/portal/view_answer.jsp*
// @match        http://learning.uestcedu.com/learning2021/homework/portal/view_answer2.jsp**
// @match        http://learning.uestcedu.com/learning2019/homework/portal/view_answer2.jsp*
// @match        http://learning.uestcedu.com/learning2020/homework/portal/view_answer2.jsp*
// @match        https://learning.uestcedu.com/learning2021/homework/portal/view_answer2.jsp**
// @match        https://learning.uestcedu.com/learning2019/homework/portal/view_answer2.jsp*
// @match        https://learning.uestcedu.com/learning2020/homework/portal/view_answer2.jsp*
// @match        http://learning.uestcedu.com/learning2021/exam/portal/exam.jsp*
// @match        http://learning.uestcedu.com/learning2019/exam/portal/exam.jsp*
// @match        http://learning.uestcedu.com/learning2020/exam/portal/exam.jsp*
// @match        https://learning.uestcedu.com/learning2021/exam/portal/exam.jsp*
// @match        https://learning.uestcedu.com/learning2019/exam/portal/exam.jsp*
// @match        https://learning.uestcedu.com/learning2020/exam/portal/exam.jsp*
// @match        http://learning.uestcedu.com/learning2021/homework/portal/do_exam.jsp*
// @match        http://learning.uestcedu.com/learning2020/homework/portal/do_exam.jsp*
// @match        http://learning.uestcedu.com/learning2019/homework/portal/do_exam.jsp*
// @match        https://student.uestcedu.com/console/apply/student/appraise_course.jsp?*
// @match        https://learning.uestcedu.com/learning2021/homework/portal/do_exam.jsp*
// @match        https://learning.uestcedu.com/learning2020/homework/portal/do_exam.jsp*
// @match        https://learning.uestcedu.com/learning2019/homework/portal/do_exam.jsp*

// @match       https://uestcedu.yuketang.cn/pro/lms/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener


// @connect *
// @require      https://www.layuicdn.com/layui-v2.6.11/layui.js

// @license      for shengda education.


// @downloadURL https://update.greasyfork.org/scripts/443166/%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443166/%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://www.layuicdn.com/layui-v2.6.11/layui.js";
document.documentElement.appendChild(script);
let CSSscript = document.createElement('link');
CSSscript.setAttribute('rel', 'stylesheet');
CSSscript.setAttribute('type', 'text/css');
CSSscript.href = "https://www.layuicdn.com/layui-v2.7.6/css/layui.css";
document.documentElement.appendChild(CSSscript);

var context = `<button class="layui-btn layui-btn-warm" style="top:10px;position:fixed;left: 10px;z-index: 99999;"  id="btn"><i class="layui-icon layui-icon-down layui-icon-face-smile-b"></i>助手工作台<span class="layui-badge layui-bg-gray">0</span></button>
<form class="layui-form" action="" id="contDom"   style="display: none;">
<div id="workspeach"> 
<div class="layui-form-item">
    <label class="layui-form-label" style="width: 120px;">学员姓名</label>
   <div class="layui-form-mid layui-word-aux"  id="fullName"></div>
     <label class="layui-form-label">学号</label>
    <div class="layui-form-mid layui-word-aux" id="registNo"></div>
</div>
<div class="layui-form-item"> 
    <label class="layui-form-label">专业</label>
    <div class="layui-form-mid layui-word-aux" id="majorName"></div> 
     <label class="layui-form-label" style="font-size:12px">上次登录时间</label>
    <div class="layui-form-mid layui-word-aux" id="lastLoginTime"></div>
</div>
 
  <div class="layui-form-item">
           <label class="layui-form-label">课程总数</label>
    <div class="layui-form-mid layui-word-aux" id="AllCount"></div>
     <label class="layui-form-label" style="font-size:12px">总完成数量</label>
    <div class="layui-form-mid layui-word-aux" id="nowTotal"></div>
    <label class="layui-form-label" style="font-size:12px">当前视频位置</label>
    <div class="layui-form-mid layui-word-aux" id="nowLession"></div>
  </div>
  <div class="layui-form-item">
    <div class="layui-progress layui-progress-big" lay-showpercent="true" lay-filter="divPercent">
         <div class="layui-progress-bar" lay-percent="0%"></div>
    </div>
  </div></div><textarea id="txtLog" placeholder="系统记录..." class="layui-textarea" style="height:300px;resize: none;"></textarea></form>`;
//间隔时间
var intervalTime = 20000;
var parcentage = "0%";
//用户信息
var userEntity = {
    fullName: "",
    majorName: "",
    registNo: "",
    lastLoginTime: "",
    nowLession: { courseId: "", coursName: "", lessonName: "", lessonCount: 0, lessonComplete: 0 },
    arrCourse: [],
    AllCount: 0,
    nowTotal: 0
};
var layer, element, $;
setTimeout(() => {
    layui.use(['form', 'layedit', 'element', 'jquery'], function () {
        layer = layui.layer, element = layui.element, $ = layui.jquery;
        $(context).appendTo($("body"));
        $(document).on('click', '#btn', function () {
            layer.open({
                title: '在线听课助手', type: 1, btn: ['重置', '关闭'], yes: function (index, layero) {
                    // setCookie('userEntity_' + userEntity.registNo, null);
                    // parent.parent.window.location.href = parent.parent.window.location.href + "&t=" + Math.random();;
                },
                area: ['720px', '610px'], content: $("#contDom")
            });
            element.progress('divPercent', parcentage);
        });
        //判断当前页面进行不同操作
        var url = window.location.pathname;
        var pageName = url.substring(url.lastIndexOf("/") + 1);
        console.log(pageName);
        //主页课程列表 
        if (pageName == "student_learn.jsp") {
            //基本信息获取
            var registNo = parent.window.document.getElementById("item_logout").innerText;
            registNo = registNo.substring(registNo.lastIndexOf("(") + 1, registNo.lastIndexOf("'"));
            var userInfo = getCookie('userEntity_' + registNo);
            if (typeof (userInfo) == "null" || userInfo == "" || typeof (userInfo) == "undefined") {
                //初始化用户
                GM_setValue('globalUser', userEntity);
                //获取用户信息
                $.ajax({
                    type: "get",
                    url: "https://student.uestcedu.com/console/apply/student/roll_student_list.jsp",
                    async: false,
                    success: function (res) {
                        var resData = $.parseHTML(res);
                        var tds = $(resData[11]).find("td");
                        userEntity.fullName = tds.eq(11).text().replace("\n", "");
                        userEntity.majorName = tds.eq(15).text().replace("\n", "");
                        userEntity.registNo = tds.eq(9).text().replace("\n", "");
                        userEntity.lastLoginTime = getFormatDate();
                    }
                });

            } else userEntity = JSON.parse(userInfo);
            //获取当前课程数
            var tempAs = $("a:contains('开始学习'),a:contains('学堂在线')", "#tblDataList"), arrCourse = [];
            for (let i = 0; i < tempAs.length; i++) {
                var tds = tempAs.eq(i).parent().siblings();
                var coursName = $.trim(tds.eq(1).text());
                var courseId = $.trim(tds.eq(7).children("div").eq(0).attr("learning_course_id"));
                //已经合格的不用继续听
                var coursState = $.trim(tds.eq(4).text());
                var lessonState = false;
                if (coursState.indexOf("合格") > -1) lessonState = true;
                var row = { coursName: coursName, courseId: courseId, lessonState: lessonState };
                arrCourse[i] = row;
            }
            userEntity.arrCourse = arrCourse;
            userEntity.AllCount = arrCourse.length;
            doUserInfo();
            //提交全局变量
            GM_setValue('globalUser', userEntity);
            //获取课程更新汇总数据 
            setInterval(doIndexList, intervalTime);
        }
        //课程播放主页 old 
        else if (pageName == "course_learning.jsp") {
            userEntity = GM_getValue('globalUser');
            userEntity.nowLession.courseId = getQueryVariable("course_id");
            setLog("进入课程播放主页 old，若作业未完成则自动前往作业...");
            $("#workspeach").hide();
            //获取未上完的课程  作业提交
            var tabs = $("table.topic_border");
            //默认 tab(1)是课程
            var tabCourse = tabs.eq(1);
            //判断是否是作业
            var isZy = tabs.eq(0).is(':contains("作业提交")');
            //非作业开始判断
            if (isZy) {
                //自动去做作业
                var workDiv = tabs.eq(0).find("div.scorm:not('div.scorm.completed,div.scorm.blank,div.scorm.passed')");
                var t = workDiv.eq(0).parent().next().next().find("a");
                if (t.length > 0) {

                    userEntity.arrCourse.filter(function (o, i) {
                        if (o.courseId == userEntity.nowLession.courseId) {
                            userEntity.arrCourse[i] = o;
                            GM_setValue('globalUser', userEntity);
                            return;
                        }
                    });
                    t[0].click();
                    return;
                }
            } else {
                tabCourse = tabs.eq(0);
            }
            var nowDiv = tabCourse.find("div.scorm:not('div.scorm.completed,div.scorm.blank,div.scorm.passed')");
            if (nowDiv.length > 0) {
                var nowLink = nowDiv.eq(0).parent().parent().find("a")[0];
                var _ac = tabCourse.find("div.scorm:not('div.scorm.blank')").length;
                userEntity.nowLession.lessonCount = _ac;
                var _nt = tabCourse.find("div.scorm.completed").length;
                userEntity.nowLession.lessonComplete = _nt;
                userEntity.nowLession.lessonName = nowLink.innerText;
                GM_setValue('globalUser', userEntity);
                layer.open({
                    title: '听课助手提示[3s自动关闭]', icon: '1', content: "检测到未完成课程，将自动听课...", end: function () {
                        nowLink.click();
                    }, time: 3000
                });
            } else {
                userEntity.arrCourse.filter(function (o, i) {
                    if (o.courseId == userEntity.nowLession.courseId) {
                        setLog("当前上完全部课程");
                        o.lessonState = true;
                        userEntity.arrCourse[i] = o;
                        userEntity.nowLession = { courseId: "", coursName: "", lessonName: "", lessonCount: 0, lessonComplete: 0 };
                        GM_setValue('globalUser', userEntity);
                        //回到主页
                        layer.open({ title: '听课助手提示', icon: '1', content: "当前课程已全部完成，即将自动关闭页面，开始下一科目..." });
                        window.parent.open("about:blank", "_self").close();
                        return;
                    }
                });

            }
        }
        //在线课程页面 old 
        else if (pageName == "load_sco.jsp") {
            var nowpage = window.document.getElementById('w_sco');
            if (nowpage.contentDocument != null) {
                var cWindow = nowpage.contentWindow;
                url = cWindow.document.location.href;
                var prePageName = url.substring(url.lastIndexOf("/") + 1);
                console.log(prePageName);
                if (prePageName.indexOf("exam_info") > -1) {
                    $("#workspeach").hide();
                    setLog("进入作业列表页面");
                    var btnDown = cWindow.document.getElementsByClassName("btn90");
                    if (btnDown.length > 0) {
                        //判断是否已经读取过答案                  
                        var sName = 'QasArr_' + getQueryVariable("content_id");
                        var QasArr = sessionStorage.getItem(sName);
                        if (QasArr != null && typeof (QasArr) != "undefined") {
                            QasArr = JSON.parse(QasArr);
                            setLog("检测到已经读取过答案");
                            cWindow.confirm = function () { return 1 };
                            var tempFont = cWindow.document.getElementsByTagName("font")[1].innerText;
                            tempFont = tempFont.substring(tempFont.indexOf("(") + 1).replace(")", "");
                            var arrFonts = tempFont.split("/");
                            console.log(arrFonts);
                            if (arrFonts[0] != arrFonts[1]) {
                                cWindow.document.getElementsByClassName("btn120")[0].click();
                            } else {
                                layer.open({
                                    title: '听课助手提示[5s自动关闭]', icon: '1', content: "已经满分啦，等待列表页刷新结果...", end: function () {
                                        parent.parent.window.location.href = parent.parent.window.location.href + "&t=" + Math.random();;
                                    }, time: 5000
                                });

                            }

                        } else {
                            setLog("前往读取答案...");
                            btnDown[0].click();
                        }
                    } else {
                        //首次 进入
                        setLog("检测到未做过此作业，首次进入将自动提交，再获取答案...");
                        cWindow.document.getElementById("btnExam").click();

                    }
                } else if (prePageName.indexOf("exam_info2") > -1) {
                    setLog("进入作业列表页面2");
                    $("#workspeach").hide();
                }
                else if (prePageName.indexOf("homework_info_1") > -1) {
                    setLog("进入作业列表页面3");
                    $("#workspeach").hide();
                    cWindow.confirm = function () { return 1 };
                    var btnDown = cWindow.document.getElementsByClassName("btn120");
                    if (btnDown.length > 0) {
                        if (btnDown[0].value == "完成作业") {
                            setLog("检测到未做过此作业3，首次进入将自动提交，再获取答案...");
                            btnDown[0].click();
                        } else {
                            //判断是否已经读取过答案                  
                            var sName = 'QasArr_' + getQueryVariable("content_id");
                            var QasArr = sessionStorage.getItem(sName);
                            if (QasArr != null && typeof (QasArr) != "undefined") {
                                QasArr = JSON.parse(QasArr);
                                setLog("检测到已经读取过答案");
                                var tempFont = cWindow.document.getElementsByTagName("font")[0].innerText;
                                tempFont = tempFont.substring(tempFont.indexOf("(") + 1).replace(")", "");
                                var arrFonts = tempFont.split("/");
                                console.log(arrFonts);
                                if (arrFonts[0] != arrFonts[1]) {
                                    setLog("检测到已经读取过答案");
                                    btnDown[0].click();
                                } else {
                                    layer.open({
                                        title: '听课助手提示[5s自动关闭]', icon: '1', content: "已经满分啦，等待列表页刷新结果...", end: function () {
                                            parent.parent.window.location.href = parent.parent.window.location.href + "&t=" + Math.random();;
                                        }, time: 5000
                                    });
                                }
                            } else {
                                setLog("前往读取答案...");
                                btnDown = cWindow.document.getElementsByClassName("btn90");
                                btnDown[0].click();

                            }
                        }
                    }
                }
            }
            //听课页面播放页面 old
            else {

                userEntity = GM_getValue('globalUser');
                setLog("进入在线课程播放页面 old");
                $('div[class="layui-form-item"]:lt(2)').hide();
                var _ac = userEntity.nowLession.lessonCount;
                $("#AllCount").html(_ac);
                var _nt = userEntity.nowLession.lessonComplete;
                $("#nowTotal").html(_nt);
                $("#nowLession").html(userEntity.nowLession.lessonName);
                $("span.layui-badge.layui-bg-gray").html(_nt);
                if (_nt > 0) parcentage = (_nt / _ac * 100).toFixed(2) + "%";
                layer.open({
                    title: '听课助手提示[5s自动关闭]',
                    icon: '1',
                    content: "即将自动听课，无需任何操作，完成后自动回到主页，点击左上角“助手工作台”可查看听课详情。",
                    time: 5000,
                    end: function () {
                        //获取课程更新汇总数据 
                        setInterval(doWork, intervalTime);
                    }
                });


            }

        }//读取作业答案 old
        else if (pageName == "view_answer.jsp") {
            setLog("读取作业答案");
            var trs = $("table[isitem='1']");
            //保存答案
            var QasArr = "["
            for (let index = 0; index < trs.length; index++) {
                const element = $(trs[index]);
                var val = element.find("div[style='color:darkred;font-size:10pt']").text();
                val = val.substring(6, 7);
                //正确选项汉字 
                val = element.find("td:contains('(" + val + ")')").next().children();
                var txt = val.html();
                txt = txt.substring(txt.lastIndexOf("/") + 1).replace("\">", "");
                val = val.attr("for");
                val = val.substring(0, val.length - 2);
                QasArr += "{\"val\":\"" + encodeURIComponent(val) + "\",\"txt\":\"" + encodeURIComponent(txt) + "\"},"
            }
            QasArr = QasArr.substring(0, QasArr.length - 1);
            QasArr += "]";
            console.log(QasArr);
            var sName = 'QasArr_' + getQueryVariable("content_id");
            sessionStorage.setItem(sName, QasArr);
            setLog("保存作业答案成功");
            parent.parent.parent.window.location.href = parent.parent.parent.window.location.href + "&t=" + Math.random();;
        }//读取作业答案 old2
        else if (pageName == "view_answer2.jsp") {
            setLog("读取作业答案2");
            var ars = $("font[style='font-size:10pt']");
            //保存答案
            var QasArr = "["
            for (let index = 0; index < ars.length; index++) {
                var txt = $(ars[index]).text();
                txt = txt.substring(4, 5);
                QasArr += "{\"val\":\"" + (index + 1) + "\",\"txt\":\"" + txt + "\"},"

            }
            QasArr = QasArr.substring(0, QasArr.length - 1);
            QasArr += "]";
            console.log(QasArr);
            sessionStorage.setItem('QasArr_' + getQueryVariable("content_id"), QasArr);
            setLog("保存作业答案2成功");
            parent.parent.parent.window.location.href = parent.parent.parent.window.location.href + "&t=" + Math.random();;
        }
        //自动做作业
        else if (pageName == "exam.jsp") {
            setLog("自动开始做作业");
            window.parent.frames["w_left"].window.confirm = function () { return 1 };
            var QasArr = sessionStorage.getItem('QasArr_' + getQueryVariable("content_id"));
            if (QasArr != null && typeof (QasArr) != "undefined") {
                QasArr = JSON.parse(QasArr);
                //获取页面表单
                for (let ind = 0; ind < QasArr.length; ind++) {
                    var val = decodeURIComponent(QasArr[ind].val);
                    var txt = decodeURIComponent(QasArr[ind].txt);
                    //图片选项
                    if (txt.indexOf(".jpg") > -1) {
                        var chio = $('input[name="' + val + '"]');
                        for (let index = 0; index < chio.length; index++) {
                            const tdTxt = $(chio[index]).parent().next().next().html();
                            if (tdTxt.indexOf(txt) > -1) {
                                chio[index].checked = true;
                            }
                        }
                    } else {
                        $('input[name="' + val + '"]').parent().parent().find("label").each(function (index, domEle) {
                            var nowTxt = $(domEle).text();
                            if (nowTxt == txt) {
                                var t = $(domEle).first();
                                t.click();
                            }
                        });

                    }
                }
                setLog("已完成自动作业答案，但需要等待10s方能提交");
            } else {
                setLog("第一次进入无需答题，等待10s自动提交后获取答案...");
            }
            layer.open({
                title: '听课助手提示[12s自动关闭]', icon: '1', content: "等待12s后再点确定，这个[确定]可能要手动点！！！", end: function () {
                    setTimeout(() => { parent.parent.parent.parent.window.location.href = parent.parent.parent.parent.window.location.href + "&t=" + Math.random(); }, 100);
                    window.parent.frames["w_left"].window.doOut(false);
                }, time: 12000
            });
        }
        //自动做作业2
        else if (pageName == "do_exam.jsp") {
            setLog("自动开始做作业2");
            window.parent.frames["w_left"].window.confirm = function () { return 1 };
            var QasArr = sessionStorage.getItem('QasArr_' + getQueryVariable("content_id"));
            if (QasArr != null && typeof (QasArr) != "undefined") {
                QasArr = JSON.parse(QasArr);
                console.log(QasArr);
                var inputs = $("input[class='item_blank']");
                //获取页面表单
                for (let ind = 0; ind < QasArr.length; ind++) {
                    inputs.eq(ind).val(QasArr[ind].txt);
                }
                setLog("已完成自动作业答案2");
            } else {
                setLog("第一次进入作业2无需答题，等待10s自动提交后获取答案...");
            }
            layer.open({
                title: '听课助手提示[12s自动关闭]', icon: '1', content: "等待12s后再点确定，这个[确定]可能要手动点！！！", end: function () {
                    setTimeout(() => { parent.parent.parent.parent.window.location.href = parent.parent.parent.parent.window.location.href + "&t=" + Math.random(); }, 100);
                    window.parent.frames["w_left"].window.doOut(false);
                }, time: 12000
            });
        }
        //课程播放主页 new 
        else if (pageName == "studycontent") {
            userEntity = GM_getValue('globalUser');
            $('div[class="layui-form-item"]:lt(2)').hide();
            setLog("进入课程播放主页 new");
            layer.open({ title: '听课助手提示[5s自动关闭]', icon: '1', content: "自动听课中，无需操作...", time: 5000 });
            var allCourse = $("div.el-tooltip.item");
            var infinish = allCourse.filter(".blue-color");
            var finish = allCourse.filter(".color-9b");
            userEntity.nowLession.lessonCount = allCourse.length;
            userEntity.nowLession.lessonComplete = finish.length;
            $("#AllCount").html(userEntity.nowLession.lessonCount);
            $("#nowTotal").html(userEntity.nowLession.lessonComplete);
            $("span.layui-badge.layui-bg-gray").html(userEntity.nowLession.lessonComplete);
            if (userEntity.nowLession.lessonComplete > 0) parcentage = (userEntity.nowLession.lessonComplete / userEntity.nowLession.lessonCount * 100).toFixed(2) + "%";
            GM_setValue('globalUser', userEntity);
            setInterval(doCourseNewList, intervalTime);
        }
        //在线课程页面 new 
        else if (!isNaN(pageName)) {
            $("#workspeach").hide();
            if (url.indexOf("video") > 0) {
                setLog("进入在线课程播放页面 new");
                layer.open({
                    title: '听课助手提示[5s自动关闭]',
                    icon: '1',
                    content: "即将自动听课，无需任何操作...",
                    time: 5000,
                    end: function () {
                        setInterval(doNewWork, intervalTime);
                    }
                });
            } else if (url.indexOf("homework") > 0) {
                setLog("进入作业页面 new");
                //3s 执行一次 ，否则系统限制
                setInterval(function () { doNewHomeWork() }, 4000);

            }
        }
    });

}, 4000)//一定间隔1500以上，不然layui没加载完
/*
主页列表的刷新事件
*/
function doIndexList() {
    var tFinishi = userEntity.arrCourse.filter(function (o) {
        if (o.lessonState) {
            var nowDiv = $('div[learning_course_id="' + o.courseId + '"]');
            nowDiv.parent().parent().css("background-color", "#5FB878");
            return true;
        }
    });
    $("#nowTotal").html(tFinishi.length);//总完成数             
    $("span.layui-badge.layui-bg-gray").html(tFinishi.length);
    //未完课程
    var tNotFinishi = userEntity.arrCourse.filter(function (o) {
        return o.lessonState == false;
    });
    if (tNotFinishi.length > 0) {
        //判断当前是否有打开的页面
        userEntity = GM_getValue('globalUser');
        if (userEntity.nowLession.courseId == "") {
            userEntity.nowLession.coursName = tNotFinishi[0].coursName;
            userEntity.nowLession.courseId = tNotFinishi[0].courseId;
            $("#nowLession").html(tNotFinishi[0].coursName);
            var nowDiv = $('div[learning_course_id="' + tNotFinishi[0].courseId + '"]');
            nowDiv.parent().parent().css("background-color", "darkred");
            //判断打开类型
            var tdAs = nowDiv.parent().prev().find("a");
            nowDiv.parent().parent().css("background-color", "darkred");
            if (tdAs.eq(0).text().indexOf("开始学习") > -1)
                el(tNotFinishi[0].courseId);
            else if (tdAs.eq(0).text().indexOf("学堂在线") > -1)
                xl(tNotFinishi[0].courseId, '20220')//20220不知道是不是年份
            setLog("已打开[" + tNotFinishi[0].coursName + "]打开听课页面...");
        } else {
            var nowDiv = $('div[learning_course_id="' + userEntity.nowLession.courseId + '"]');
            nowDiv.parent().parent().css("background-color", "darkred");
            setLog("[" + tNotFinishi[0].coursName + "]正在听课...若未打开听课页面，请手动点击背景为红色的课程。");

        }

    }

    //提交全局变量
    GM_setValue('globalUser', userEntity);
}
/*
定义主要执行方法 old 
*/
function doWork() {
    var remark = "系统配对准备中...";
    userEntity = GM_getValue('globalUser');
    var SCORM = $('table td:contains("您正在学习SCORM课件")');
    if (SCORM.length > 0) {
        remark = "正在学习中...";
    }
    var isok = $('table td:contains("已经学习完毕")');
    var other = $('table td:contains("你已累计获取10.00分")');
    if (isok.length > 0 || other.length > 0) {
        remark = "已完成本节学习";
        setLog(remark);
        //更新状态数据 
        var nowTotal = userEntity.nowLession.lessonComplete;
        var _ac = userEntity.nowLession.lessonCount;
        nowTotal++;
        userEntity.nowLession.lessonComplete = nowTotal;
        //总共完成
        $("#nowTotal").html(nowTotal);
        $("span.layui-badge.layui-bg-gray").html(nowTotal);
        //更新进度
        if (nowTotal > 0)
            parcentage = (nowTotal / _ac * 100).toFixed(2) + "%";
        //下一个学习
        //判断当前是否最后一个
        var islast = window.parent.parent.frames[1].frames["w_code"].document.getElementById('btnNext').disabled;
        if (!islast) {
            window.parent.parent.frames[1].frames["w_code"].loadNextSCO();
        } else {
            //回到首页
            parent.parent.window.location.href = parent.parent.window.location.href + "&t=" + Math.random();;
        }
        return;
    } else
        setLog(remark);


}
/*
定义主要执行方法 new 
*/
function doNewWork() {
    var strState = $("span.text").eq(1).text();
    //防止页面卡死 完成度：96%_1
    var lastState = sessionStorage.getItem("strState");
    if (lastState != null) {
        var co = 0;
        if (lastState.indexOf("_") > 0) {
            co = lastState.substring(lastState.indexOf("_") + 1);
            //判断状态是否改变，以便归零，反之累加
            if (lastState.substring(0, lastState.indexOf("_")) != strState)
                co = 0;
            else {
                co++;
                if (co > 20) {//当前状态20次循环*间隔秒，可能卡死，刷新页面
                   sessionStorage.setItem('strState', strState + "_0");
                    window.location.href = window.location.href;
                    return;
                }
            }
        }
        sessionStorage.setItem('strState', strState + "_" + co);
    } else sessionStorage.setItem('strState', strState + "_0");
    console.log(lastState);
    if (strState.indexOf("100%") > 0) {
        //下一个学习 
        userEntity = GM_getValue('globalUser');
        userEntity.nowLession.lessonName = "reload";
        GM_setValue('globalUser', userEntity);
        setLog("完成当前学习，自动关闭中...");
        setTimeout(() => { window.close(); }, 1000);
    }
    setLog(strState);
}
/*
课程列表的执行方法 new 
*/
function doCourseNewList() {
    userEntity = GM_getValue('globalUser');
    var _nl = userEntity.nowLession.lessonName;
    //没有开始听课
    if (_nl == null || _nl == "") {
        var allCourse = $("div.el-tooltip.item");
        var infinish = allCourse.filter(".blue-color");
        if (infinish.length > 0) {
            //本次总时长，开始时间            
            var txt = infinish.eq(0).parent().parent().prev().find("span.title").text();
            userEntity.nowLession.lessonName = txt;
            $("#nowLession").html(txt);
            GM_setValue('globalUser', userEntity);
            //打开听课页面
            infinish.eq(0).click();

        } else {
            setLog("完成当前课程，自动关闭中...");
            userEntity.arrCourse.filter(function (o, i) {
                if (o.courseId == userEntity.nowLession.courseId) {
                    o.lessonState = true;
                    userEntity.arrCourse[i] = o;
                    return;
                }
            });
            userEntity.nowLession.lessonName = { courseId: "", coursName: "", lessonName: "", lessonCount: 0, lessonComplete: 0 };
            GM_setValue('globalUser', userEntity);
            setTimeout(() => { window.close(); }, 1000);
        }
    } else if (_nl == "reload") {
        userEntity.nowLession.lessonName = "";
        GM_setValue('globalUser', userEntity);
        setTimeout(() => { window.location.href = window.location.href; }, 1000);//刷新页面更新页面数据
    } else {
        setLog(_nl + " 课程学习中...若未打开听课页面，请手动点击课程打开第一个听课页面。");
    }
}

//执行作业 new
function doNewHomeWork() {
    var tipsDiv = $("div[class='problem-remark']");
    var arrChois = ["0,1", "0,2", "0,3", "1,2", "1,3", "2,3", "0,1,2", "0,1,3", "0,2,3", "1,2,3", "0,1,2,3"] //11种多选可能
    if (tipsDiv != null && tipsDiv.length > 0) {
        //正确答案
        var chk = tipsDiv.find("div:contains('正确答案')").eq(0).text();
        chk = chk.substring(chk.lastIndexOf("：") + 1);
        if (chk == "") {
            var chkItem = sessionStorage.getItem("chkItem");
            chkItem++;
            sessionStorage.setItem("chkItem", chkItem);
            var rdoLab = $("span[class='el-radio__label']:eq(" + chkItem + ")");
            if (rdoLab.length == 0) {
                //4个选项
                $("ul[class='list-unstyled list-unstyled-checkbox'] label").each(function (index, domEle) {
                    if (chkItem < 11) {
                        //判断当前是否选中
                        var ischk = $(domEle).hasClass("is-checked");
                        //判断是否应该选中  页面下标与选中小标对比                        
                        var shoudChk = arrChois[chkItem].indexOf(index) > -1 ? true : false;
                        if (ischk) {//当前选中的
                            if (!shoudChk)  //不该选中则取消
                                setTimeout(() => { $(domEle).click(); }, 500);
                        } else {
                            if (shoudChk)
                                setTimeout(() => { $(domEle).click(); }, 500);
                        }
                        console.log("nowCHk:" + arrChois[chkItem]);
                    }
                    else console.log("超出最大下标");
                });
            } else
                rdoLab.click();

            setLog("自动提交中，勿操作...");
            //提交
            var t = $("button[class='el-button el-button--primary el-button--medium']").click();
        } else {
            //点击下一题
            setLog("此题完成，正在进入下一题【4s回答一次，避免系统异常】...");
            sessionStorage.setItem("chkItem", 0);
            var btn = $("button[class='el-button el-button--text']").last();
            if (btn.text() == "下一题")
                btn.click();
            else {
                userEntity = GM_getValue('globalUser');
                userEntity.nowLession.lessonName = "reload";
                GM_setValue('globalUser', userEntity);
                setLog("完成当前作业，自动关闭中...");
                setTimeout(() => { window.close(); }, 1000);
            }
        }
    } else {
        //第一次页面未选择
        sessionStorage.setItem("chkItem", 0);
        //默认选中第一项
        var rdoLab = $("span[class='el-radio__label']:eq(0)");
        if (rdoLab.length == 0) {
            setTimeout(() => { $("span[class='el-checkbox__label']:eq(0)").click(); }, 500);
            setTimeout(() => { $("span[class='el-checkbox__label']:eq(1)").click(); }, 500);
        } else
            rdoLab.click();
        //提交
        var t = $("button[class='el-button el-button--primary el-button--medium']").click();
    }

}
/*
通过session 记录当前状态
*/
function setLog(txt) {
    //考虑跨页面   
    var sestxt = sessionStorage.getItem('txtLog');
    if (sestxt == null) sestxt = "助手初始化...";
    if (sestxt.length > 500)//最多500字
        sestxt = sestxt.substring(sestxt.length - 500);
    txt = getFormatDate() + "：" + txt;
    var newTxt = txt + "\n" + sestxt;
    sessionStorage.setItem('txtLog', newTxt);
    //  layer.tips(txt, '#btn', { tips: [2, '#c00'], time: time });
    layer.open({
        type: 1,
        offset: 'lt',
        time: 3000,
        shade: 0,
        title: '进度提醒',
        content: txt
    });
    $("#txtLog").text(newTxt);
}

/*
获取 当前时间
*/
function getFormatDate() {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

//秒转时间
function formatSeconds(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

    let res = '';
    if (h !== '00') res += `${h}h `;
    if (m !== '00') res += `${m}min `;
    res += `${s}s`;
    return res;
}

//获取url参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
//设置cookie
function setCookie(cname, cvalue) {
    var d = new Date(), exdays = 14;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain:'.uestcedu.com'";
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
}
/*
这个API的作用就是可以对存储在GM中的变量进行监听,当值变化时,可以触发一个函数,
name是要监听的变量名称, 字符串类型, name指向的变量必须是基本数据类型,如果是js中的引用类型object是无法触发监听函数的
监听函数,第一个参数是变量名称, 第二个是旧值,第三个是新值, 第四个是表示,值的变化是在当前浏览器窗口还是其他脚本触发的, 其他窗口为true 其他脚本触发的为false
具体用法需要搭配GM_setValue 函数,对变量进行赋值
*/
GM_addValueChangeListener('globalUser', function (name, old_user, new_user, remote) {
    if (new_user.registNo != "") {
        //保存cookie userEntity_123456789
        setCookie('userEntity_' + new_user.registNo, JSON.stringify(new_user));
    }
    console.log(name, old_user, new_user, remote)
})

/*
更新用户信息
*/
function doUserInfo() {
    //更新页面
    $("#fullName").html(userEntity.fullName);
    $("#majorName").html(userEntity.majorName);
    $("#registNo").html(userEntity.registNo);
    $("#lastLoginTime").html(userEntity.lastLoginTime);
    $("#AllCount").html(userEntity.AllCount);//总课程
}
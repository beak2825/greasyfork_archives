// ==UserScript==
// @name         吉林大学挂机宝
// @namespace    www.qqkzw.com
// @license MIT
// @version      1.0.1
// @description  吉林大学（网络教育）全自动在线挂机学习&自动考试
// @author       Horjer
// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.js
// @resource     layer http://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @match        https://dec.jlu.edu.cn/console/main.html*
// @match        https://dec.jlu.edu.cn/console/apply/student/student_learn.jsp*
// @match        http://learning.uestcedu.com/learning*
// @match        http://ispace.uestcedu.com/ispace2_sync/scormplayer/index_sco.jsp*
// @match        http://ispace.uestcedu.com/ispace2_upload/scormplayer/index_sco.jsp*
// @match        http://ispace.uestcedu.com/ispace2_upload/*/ch_index.html*
// @match        https://cejlu.yuketang.cn/pro/lms*
 
 
// ***********************************特此声明***********************************************
// 该脚本完全免费，仅供学习使用，严谨倒卖！！！ 如果您是通过购买所得，请找卖家退款！！！
// 尊重作者权益，请勿在未经允许的情况下擅自修改代码和发布到其他平台!
// 作者: Horjer
// 更新时间: 2022年06月06日
// 版本: v2.0.0
// ****************************************************************************************
// @downloadURL https://update.greasyfork.org/scripts/446403/%E5%90%89%E6%9E%97%E5%A4%A7%E5%AD%A6%E6%8C%82%E6%9C%BA%E5%AE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/446403/%E5%90%89%E6%9E%97%E5%A4%A7%E5%AD%A6%E6%8C%82%E6%9C%BA%E5%AE%9D.meta.js
// ==/UserScript==
 
GM_addStyle(GM_getResourceText('layer'));
GM_addStyle(".site-dir{display:none;}.site-dir li{line-height:26px;overflow:visible;list-style-type:disc;}.site-dir li a{display:block;text-decoration:none}.site-dir li a:active{color:#01AAED;}.site-dir li a.layui-this{color:#01AAED;}body .layui-layer-dir{box-shadow:none;border:1px solid #d2d2d2;}body .layui-layer-dir .layui-layer-content{padding:10px;}.site-dir a em{padding-left:5px;font-size:12px;color:#c2c2c2;font-style:normal;}");
GM_addStyle(".layui-layer-ico16,.layui-layer-loading.layui-layer-loading2{width:32px;height:32px;background:url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/loading-2.gif)no-repeat;}.layui-layer-ico{background: url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/icon.png) no-repeat;}");
 
unsafeWindow.layer = window.layer; // 把layer设置到原始window对象中
 
//初始化调用
(function() {
    console.log("===================" + GetUrlRelativePath())
    if(new RegExp("/learning.*/course/course_learning.jsp").test(GetUrlRelativePath())){
        if(window.document.getElementsByTagName("body")[0].innerHTML == ""){
            setTimeout(function (){
                autoConfirm(10000, '检测到页面空白，有可能是学习平台太卡导致的！<br/>（如果一直不行，可以尝试先从学生管理平台单独点开课程试试看）<br/>下面将进行页面刷新重试?（10秒后无操作，将默认重试）', function(){
                    window.location.reload();
                });
            }, 3000);
        }else{
            openOtherInfo();
            openCoursesDir(getUrlParam("course_id"));
            window.top.localStorage.setItem("scanLearningProgress", "false");
            autoConfirm(3000, '是否开始学习本课程?（3秒后无操作，将默认学习）', function(){
                layer.msg('执行自动学习', {offset: 'b'});
                window.top.localStorage.setItem("scanLearningProgress", "true");
                startLookCurriculum();
            });
        }
    }
    if (new RegExp("/learning.*/console/").test(GetUrlRelativePath())) {
        console.log("===========执行自动学习监听=================");
        try {
            checkIfTheCoursePageIsLoaded();
            monitorLogin();
            timedRefresh();
        } catch (err) {
            console.error(err);
        }
        setInterval(monitorCourseLearningProgress, 1000 * 10); //扫描
    }
    if(GetUrlRelativePath() === "/ispace2_sync/scormplayer/index_sco.jsp"){
        updateLoadInterval();
    }
    if(GetUrlRelativePath().indexOf("/ch_index.html") != -1){
        videoPage()
    }
    if(new RegExp("/learning.*/scorm/scoplayer/load_sco.jsp").test(GetUrlRelativePath())){
        videoProgress();
    }
    if(new RegExp("/learning.*/scorm/scoplayer/code.htm").test(GetUrlRelativePath())){
        window.top.localStorage.setItem("scanLearningProgress", "true"); // 进入到该页面，就可以开始监控
    }
    if(new RegExp("/learning.*/exam/portal/exam_info.jsp").test(GetUrlRelativePath())){
        layer.msg('请稍等，正在检查考试状况', {offset: 'b'});
        //setTimeout(function() {
        //    examInfo();
        //}, 1000);
        $(document).ready(function(){
            examInfo();
        });
    }
    if(new RegExp("/learning.*/exam/portal/exam.jsp").test(GetUrlRelativePath())){
        layer.msg('进入考试页面', {offset: 'b'});
        setTimeout(function() {
            exam();
        }, 1000);
    }
    if(new RegExp("/learning.*/exam/portal/view_answer.jsp").test(GetUrlRelativePath())){
        layer.msg('进入查看试卷页面', {offset: 'b'});
        setTimeout(function() {
            viewAnswer();
        }, 1000);
    }
    if(GetUrlRelativePath() === "/console/apply/student/student_learn.jsp"){
        studentLearn();
    }
    if(GetUrlRelativePath() === "/console/main.html"){
        studentLogin()
    }
    if(new RegExp("/learning.*/course/ajax_learn_content.jsp").test(GetUrlRelativePath())){
        console.log("进入课程")
    }
    if(new RegExp("/pro/lms/.*/.*/studycontent").test(GetUrlRelativePath())){
        console.log("进入学堂在线章节目录")
        openOtherInfo();
        xl_startLearn();
    }
    if(new RegExp("/pro/lms/.*/.*/homework/.*").test(GetUrlRelativePath())){
        console.log("进入学堂在线习题页面")
        openOtherInfo();
    }
    if(new RegExp("/pro/lms/.*/.*/video/.*").test(GetUrlRelativePath())){
        console.log("进入学堂在线学习课程的页面")
        openOtherInfo();
        xl_learnVideo();
    }
})();
 
// 学生管理平台登录
function studentLogin(){
    $.ajax({
        url:"https://dec.jlu.edu.cn/console/user_info.jsp?" +  Math.random(),
        dataType: "json",
        success:function (data){
            if(!data.user_name){
                if(window.invalidLayer){
                    layer.close(window.invalidLayer)
                }
                window.invalidLayer = layer.confirm('检测到登录已失效，是否去登录?', {icon: 3, title:'提示'}, function(index){
                    window.location.href = "https://dec.jlu.edu.cn/console/";
                });
            }
        }
    });
    setTimeout(studentLogin, 1000 * 60);
}
 
// 学生管理平台在线学习
function studentLearn(){
    openOtherInfo();
    var txtSiteId = $("input[name='txtSiteId']").val();
    var coursesElement = $("#tblDataList").find("a:contains('开始学习')");
    var courses = [];
 
    for (let i = 0; i < coursesElement.length; i++) {
        var courseElement = $(coursesElement[i]);
        var trElement = courseElement.parent().parent();
        var courseId = courseElement.attr("onclick").split('\'')[1];
        var courseName = trElement.children("td:eq(1)").text();
        courses[i] = {'courseName' : courseName, 'courseId' : courseId, 'state' : '等待学习'};
    }
 
    // 采集云学堂课程
    coursesElement = $("#tblDataList").find("a:contains('学堂在线')");
    for (let i = 0; i < coursesElement.length; i++) {
        var courseElement = $(coursesElement[i]);
        var trElement = courseElement.parent().parent();
        var courseId = courseElement.attr("onclick").split('\'')[1];
        var sExamCode = courseElement.attr("onclick").split('\'')[3];
        var courseName = trElement.children("td:eq(1)").text();
        var courseUrl = xl_login(courseId, sExamCode);
        courses.push({'courseName' : courseName, 'courseId' : courseId, 'sExamCode': sExamCode, 'state' : '', courseSource: '学堂在线', courseUrl: courseUrl});
    }
 
    $.ajax({
        url: "https://dec.jlu.edu.cn/rs/loginCheck/learning?" + Math.random(),
        type: "POST",
        data: {
            "course_id": courses[0].courseId
        },
        success: function (data) {
            if (data.success == true) {
                GM_setValue("baseLearningUrl", data.data.loginUrl.split("/uestc_login.jsp")[0]);
 
                var userData = {'account': data.data.loginName, 'password': data.data.password, 'data': data.data};
                GM_setValue("userData", userData);
 
                GM_setValue("courses", courses);
                GM_setValue("txtSiteId", txtSiteId);
 
                layer.confirm('一切已准备就绪，开始自动学习全部课程?（您也可以手动点击某个课程进行学习）', {icon: 3, title: '提示'}, function (index) {
                    layer.close(index);
                    window.open(getCoursePage(courses[0].courseId));
                });
            } else {
                layer.alert('插件准备工作执行失败，请稍后再试！', {icon: 3, title: '提示'});
            }
        }
    })
}
 
// 获取课程页面
function getCoursePage(courseId) {
    var userData = GM_getValue("userData");
    if (userData) { // 有用户信息，就用最新的方式进入课程
        var url = login(userData, courseId);
        return url;
    } else {
        return GM_getValue("baseLearningUrl") + "/console/?urlto=" + GM_getValue("baseLearningUrl") + "/course/course_learning.jsp?course_id=" + courseId + "&course_name=" + Math.random()
    }
}
 
// 打开考试确认页面
function examInfo(){
    var win = window.parent.parent.document.getElementById("w_lms_content").contentWindow.document.getElementById("w_sco").contentWindow;
    var contentId = getUrlParam("content_id");
    var datas = window.localStorage.getItem(contentId);  // 试题和答案
    var btnExam = win.document.getElementById("btnExam");
    var lookButton = btnExam.nextSibling.nextSibling;
 
    if(btnExam.value === '继续考试'){
        autoConfirm(5000, '当前处于考试中，是否继续完成考试?（5秒后无操作，将默认继续考试。注意：部分课程不是选择题，无法自动考试，请自行考试）', function(){
            btnExam.click();
        });
        return;
    }
 
    var succeedColor = win.document.getElementsByTagName("font")[1].color; // 考试是否通过，绿色就通过
    if(succeedColor == 'green'){
        autoConfirm(3000, '该作业已完成，是否退出?（3秒后无操作，将默认退出）', function(){
            top.window.location.reload();
        });
        return;
    }
    if(lookButton == undefined || datas){
        autoConfirm(20000, '是否开始考试?' +
            '</br><span style="color: blue">需知: 插件第一次默认全部选A，交卷后会返回查看答案，并记录正确答案，最后会自动重考</span>' +
            '</br><span style="color: red">注意：部分课程作业不是选择题，无法自动考试，请自行考试</span>' +
            '</br>（20秒后无操作，将默认开始考试）'
            , function(){
                // win.frames["w_exam"].location.href = win.$api.fn.getActionURL("com.lemon.learning.exam.StudentExamAction?op=before_exam&exam_id=3163&reexam=" + (win.sExamStatus=="reexamine"?"1":"0")+"&script=parent.afterCheckExam()");
                win.sExamStatus = ''; // 不是重考
                btnExam.click();
            });
    }else{
        lookButton.click();
    }
}
 
// 考试答题页面
function exam(){
    layer.msg('开始自动做题', {offset: 'b'});
    var contentId = getUrlParam("content_id");
    var datas = window.localStorage.getItem(contentId);  // 试题和答案
    if(datas){
        datas = JSON.parse(datas);
    }
    var dataTr = $("#tblDataList tr");
    for (let i = 0; i < dataTr.length; i++) {
        const dataTrElement = $(dataTr[i]);
        var item = dataTrElement.find("table[isitem='1']"); // 题目table
        var timu = $(item.find("tr td")[0]).html(); // 题目内容
        console.log(timu);
 
        var temoption = item.find("table[isitemoption='1']"); // 答案table
        var optiontype = temoption.attr("optiontype"); // 答案类型，单选：radio， 多选：
        var tds = temoption.find("tr td");
        var input = $(tds[0]); // 答题input
 
        if(!datas){
            // 目前还没有答案
            $(tds.find("input")[0]).attr("checked", "checked"); // 全部选择A选项
        }else{
            // 有答案了
            for (const data of datas) {
                if(data.timu === timu){
                    var temoption = item.find("table[isitemoption='1']"); // 答案选项
                    var answersElement = temoption.find("label"); // 可选择的答案
                    for (let j = 0; j < answersElement.length; j++) {
                        const $answer = $(answersElement[j]);
                        for (const answer of data.answer) {
                            if(answer == $answer.html()){
                                var $input = $answer.parent().prev().prev().find("input")
                                $input.attr("checked", "checked")
                            }
                        }
                    }
                }
            }
            // 填写后，清楚已保存的答案。避免下次重考答案是错的
            window.localStorage.removeItem(contentId);
        }
    }
 
    layer.msg('正在等待提交试卷中\t(需要15秒时间等待，否则提交试卷成绩不作数。\t 如果成绩一直无法更新，可以尝试手动点击重考)', {
        icon: 16,
        shade: 0.3,
        time: -1
    });
 
    // 交卷
    setTimeout(function() {
        parent.frames["w_right"].doSubmit(true,"console.log('您已经选择交卷，请点击确定退出考试！');");
        // setTimeout(function() {
        //     $("#cboxClose")[0].click()
        // }, 3000);
    }, 15000);
}
 
// 查看试卷
function viewAnswer(){
    var trs = $("form[name='form1']").find("table tr");
    var testQuestions = []; // 所有题目和答案
    for (let i = 0; i < trs.length; i++) {
        const dataTrElement = $(trs[i]);
        var item = dataTrElement.find("table[isitem='1']"); // 题目table
        var timu = $(item.find("tr td")[0]).html(); // 题目内容
        if(!timu){
            continue;
        }
        var data = {"timu": timu}
        var temoption = item.find("table[isitemoption='1']"); // 答案选项
        var answer = item.find("tr td div:last").text().replace("[参考答案：", "").split("]")[0]; // 正确答案选项
        data.answer = [];
        for (var j=0; j<answer.length; j++){
            var answerText = temoption.find("td:contains('(" +  answer.charAt(j) + ")')").next().find("label").html(); // 正确答案内容
            data.answer.splice(j, 0, answerText);
        }
        testQuestions.splice(i, 0, data);
    }
    console.log(testQuestions);
    var contentId = getUrlParam("content_id");
    window.localStorage.setItem(contentId, JSON.stringify(testQuestions));  // 试题和答案
    //window.history.back(-1);
    autoConfirm(3000, '答案已搜集完毕，是否返回?（3秒后无操作，将默认返回）', function(){
        doReturn();
    });
}
 
// 修改获取最新学习进度的时间间隔
function updateLoadInterval(){
    console.log("=========修改最新学习的时间间隔==========")
    clearAllInterval();
    window.setInterval("window_onunload()","5000");
    window.onbeforeunload = function(e){
        console.log("=========删除获取学习进度任务==========")
        clearAllInterval();
    }
}
 
// 删除所有定时任务
function clearAllInterval(){
    for(var i = 1; i < 1000; i++) {
        clearInterval(i);
    }
}
 
// 课程最少学习时间
function videoProgress(){
    var td = $(".scorm.incomplete").parent();
    var text = td.text();
    text = text.substring(text.indexOf("。最少要求学习")+1, text.length -3);
    var s = text.split("习")[1].split("秒")[0];
    td.parent().parent().append("<tr><td align='center' style='background-color: beige'>挂机插件提醒您：本课程最少需学习：" + secondsFormat(s) +"</td></tr>")
}
 
// 格式化时间
function secondsFormat( s ) {
    var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整
    var hour = Math.floor( (s - day*24*3600) / 3600);
    var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 );
    var second = s - day*24*3600 - hour*3600 - minute*60;
    return day + "天"  + hour + "时" + minute + "分" + second + "秒";
}
 
// 查找未学习的课程
function startLookCurriculum(){
    setTimeout(function(){
        console.log("查找还未读完的课程")
        layer.msg('查找还未读完的课程', {offset: 'b'});
        if($("div[name*=frame_learning_content_] #tblDataList").length == 0 || $("#frame_user_score").length == 0){
            // 课程没有被确认过
            autoConfirm(10000, '加载课程可能发生失败，是否尝试重新加载?（10秒后无操作，将默认重新加载，如一直无法加载成功，请检查网站本身是否正常，也可联系作者查看）', function(){
                enterCourse(getUrlParam("course_id"));
            });
            return;
        }
        var success = false;
        var divs = $(".scorm.incomplete,.notattempt");
        for(var i = 0; i < divs.length; i++) {
            var a = $(divs[i]).parent().parent().find("a");
            var href = a.attr("href");
            //if(href && href.indexOf("scorm_content") != -1){
            if(href){
                success = true;
                window.top.localStorage.setItem("scanLearningProgress", "true"); // 开始监控
                a[0].click();
                break;
            }
        }
        if(!success){
            var courses =  GM_getValue("courses") || [];
            var course;
            for(var j = 0; j < courses.length; j++) {
                if(courses[j].state === '等待学习'){
                    course = courses[j];
                    break;
                }
            }
            if(course != undefined){
                course.state = '学习完毕';  // 修改学习状态
                GM_setValue("courses", courses);
                autoConfirm(3000, '本课程已学完，是否自动学习下个课程?（3秒后无操作，将默认学习）', function(){
                    window.top.location.href = getCoursePage(course.courseId);
                });
            }else{
                var retry = setTimeout(function(){
                    startLookCurriculum();
                }, 3000);
                layer.alert('课程已全部学习完毕', {icon: 3, title:'提示'}, function(index){
                    window.clearInterval(retry);
                    layer.close(index);
                });
            }
        }
    }, 5000);
}
 
// 显示课程目录
function openCoursesDir(currentCourseId){
    var courses =  GM_getValue("courses") || [];
    if(courses.length <= 0){
        return;
    }
 
    var siteDir = '<ul class="site-dir layui-layer-wrap" style="display: block;">';
    for(var j = 0; j < courses.length; j++) {
        siteDir += '<li><a href="javascript:void(0);"';
        if(courses[j].courseSource === '学堂在线'){
            siteDir += ' onclick="window.top.location.href = \'' + courses[j].courseUrl + '\'"';
        }else{
            siteDir += ' onclick="window.top.location.href = \'' + getCoursePage(courses[j].courseId) + '\'"';
        }
        if(currentCourseId === courses[j].courseId){
            siteDir +=  'class="layui-this"';
        }
        siteDir +=  '>' + courses[j].courseName;
 
        if(courses[j].state){
            var color = courses[j].state === '学习完毕' ? '#b31c1c' : '#00b100'
            siteDir +=  '<em style="color: ' + color +';font-size: xx-small;">(' + courses[j].state + ')</em>';
        }
 
        if(courses[j].courseSource === '学堂在线'){
            siteDir += "<em>【学堂在线】</em>"
        }
        siteDir += '</a></li>';
    }
    siteDir += '</ul>';
 
    layer.open({
        type: 1
        ,content: siteDir
        ,skin: 'layui-layer-dir'
        ,area: 'auto'
        ,maxHeight: $(window).height() - 300
        ,title: '课程目录'
        //,closeBtn: false
        ,offset: 'r'
        ,shade: false
        ,success: function(layero, index){
            layer.style(index, {
                marginLeft: -15
            });
        }
    });
 
}
 
// 查看视频的页面处理方法
function videoPage(){
    console.log("进入课程页面");
    $(".chapter span:last").click(); // 先点击一下最后一个PPT
}
 
// 监听课程学习进度
function monitorCourseLearningProgress(){
    if(window.localStorage.getItem("scanLearningProgress") === 'true'){
        console.log("扫描学习情况");
        layer.msg('挂机插件正常工作中，莫慌张....', {offset: 'b'});
        try{
            var aa = window.document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByTagName('frame')[1].contentWindow.document.getElementsByTagName('td')[1].innerText;
            if(aa.indexOf("学习完毕")!= -1 /*|| aa.indexOf("你已累计获取10.00分")!= -1*/){
                console.log("学习完毕")
                window.localStorage.setItem("scanLearningProgress", "false")
                autoConfirm(3000, '学习完毕，是否自动学习下一节课?（3秒后无操作，将默认学习）', function(){
                    window.location.reload();
                });
            }else{
                window.errorCount = window.errorCount || 0; // 错误次数计数器
                if(aa === window.txtInfo){
                    layer.msg("第" + ++window.errorCount + "次检测到学习时间没发生变化</br>(这是学习平台自身的BUG，过一会就好了。如持续5次未检测到变化，将刷新页面重试)</br>" + aa, {time: 10000})
                    if(window.errorCount >= 5){
                        window.localStorage.setItem("scanLearningProgress", "false")
                        window.location.reload();
                    }
                }else{
                    window.errorCount = 0;
                }
                window.txtInfo = aa;
            }
        }catch(err){}
    }
}
 
// 自动确认
function autoConfirm(time, content, fun, fun2){
    var timeoutIndex = setTimeout(function(){
        window.clearTimeout(timeoutIndex);
        fun();
    }, time);
    layer.confirm(content, {icon: 3, title:'提示'}, function(index){
        window.clearTimeout(timeoutIndex);
        fun();
    }, function(index){
        window.clearTimeout(timeoutIndex);
        if(fun2 != undefined){
            fun2();
        }
    });
}
 
// 监听登录状态
function monitorLogin(){
    console.log("监听登录状态");
    layer.msg('监听登录状态', {offset: 'b'});
    if(!validLogin()){
        var userData = GM_getValue("userData");
        if(!userData || !userData.account){
            layer.confirm('无效登录状态。本地没有您的账号信息，无法完成自动登录，需要进行手动登录?', {icon: 3, title:'提示'}, function(index){
                window.location.href = "https://dec.jlu.edu.cn/console/";
            });
        }else{
            autoConfirm(3000, '无效登录状态，正在尝试自动登录?（3秒后无操作，将默认尝试登录）', function(){
                var url = login(userData, userData.data.courseId);
                window.location.href = url;
            });
        }
    }
    setTimeout(monitorLogin, 1000 * 60); // 1分监听一次登录状态
}
 
// 校验网络学习平台登录状态
function validLogin(){
    var login = true;
    $.ajax({
        url: GM_getValue("baseLearningUrl") + "/json/login_info.jsp",
        async: false,
        dataType:"json",
        success:function(data){
            if(data.username === ''){
                console.log("无效登录状态");
                login = false;
            }else{
                layer.msg('定时检测登录状态：当前登录状态有效', {offset: 'b'});
            }
        },
        error:function(){
            layer.alert('网络学习平台繁忙，检测登陆状态失败！', {icon: 3, title:'提示'}, function(index){
                layer.close(index);
            });
        }
    })
    return login;
}
 
// 登录网络学习平台
function login(userData, courseId){
    var url = GM_getValue("baseLearningUrl") + "/uestc_login.jsp?" + Math.random();
    url += "&txtLoginName=" + userData.account;
    url += "&txtPassword=" + userData.password;
    url += "&txtCourseId=" + courseId;
    url += "&txtUserType=" + userData.data.userType;
    url += "&txtClassId=" + userData.data.classId;
    url += "&txtClassName=" + userData.data.className;
    url += "&txtSiteId=" + userData.data.siteId;
 
    return url; // 返回登录url（登录后会自动跳转到课程）
 
    /*
    // 去除以前旧的登录方式
    $.ajax({
        url: GM_getValue("baseLearningUrl") + "/uestc_login.jsp?" + Math.random(),
        type: "get",
        data: {
            "txtLoginName": userData.account,
            "txtPassword": userData.password,
            "txtCourseId": userData.data.courseId,
            "txtUserType": userData.data.userType,
            "txtClassId": userData.data.classId,
            "txtClassName": userData.data.className,
            "txtSiteId": userData.data.siteId
        },
        timeout: 3000,
        success: function (data) {
            $.ajax({
                url: GM_getValue("baseLearningUrl") + "/servlet/com.lemon.web.ActionServlet?handler=com%2euestc%2euser%2eUserLoginAction&op=login&type=to_learning&op=execscript&urlto=&script=parent.afterAction()&_no_html=1&" + Math.random(),
                headers : {
                    'Referer': GM_getValue("baseLearningUrl") + '/'
                },
                type: "POST",
                data: {
                    "txtLoginName": userData.account,
                    "txtPassword": userData.password,
                    "txtCourseId": userData.data.courseId,
                    "ran": Math.random()
                },
                timeout:3000,
                success:function(data){
                    console.log(data);
 
                    var body = document.getElementsByTagName("body");
                    var div = document.createElement("div");
                    div.innerHTML = '<iframe id="idFrame" name="idFrame" src="' + GM_getValue("baseLearningUrl") + '/" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
                    document.body.appendChild(div)
                    window.location.reload();
                },
                error:function(){
                    layer.alert('网络学习平台繁忙，无法帮你完成登录，请稍后再试！', {icon: 3, title:'提示'}, function(index){
                        layer.close(index);
                    });
                }
            })
        },
        error: function () {
            layer.alert('网络学习平台繁忙，无法帮你完成登录，请稍后再试！', {icon: 3, title: '提示'}, function (index) {
                layer.close(index);
            });
        }
    })*/
}
 
// 获取当前窗口相对路径
function GetUrlRelativePath(){
    var url = document.location.toString();
 
    var arrUrl = url.split("//");
 
    var start = arrUrl[1].indexOf("/");
 
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
 
    if(relUrl.indexOf("?") != -1){
 
        relUrl = relUrl.split("?")[0];
 
    }
    return relUrl;
}
 
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
 
// 进入课程
function enterCourse(txtCourseId){
    $.ajax({
        url: GM_getValue("baseLearningUrl") + "/course/enter_in_course.jsp?" + Math.random(),
        headers : {
            'Referer': GM_getValue("baseLearningUrl") + '/uestc_login.jsp?' + Math.random()
        },
        type: "POST",
        data: {
            "txtLoginName": "userData.account",
            "txtPassword": "userData.password",
            "txtCourseId": txtCourseId,
            "txtUserType": "student",
            "txtClassId": "txtClassName",
            "txtSiteId": GM_getValue("txtSiteId")
        },
        success:function(data){
            window.top.location.href = getCoursePage(txtCourseId);
        }
    })
}
 
function checkIfTheCoursePageIsLoaded(){
    var mainWin = $("iframe[name=w_main]")[0].contentWindow;
    if(mainWin.document.body.innerHTML == ""){
        layer.alert('课程加载失败');
    }
 
    /*var mainWin = $("iframe[name=w_main]")[0].contentWindow;
    if (mainWin.document.getElementsByTagName("body").length == 0) {
        layer.load(0, {shade: false});
    }*/
}
 
// 显示作者信息
function openOtherInfo(){
    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['420px', '560px'], //宽高
        offset: 'rb',
        shade :0,
        content: '<div style="padding: 10px;">该插件仅供学习使用，严谨倒卖<br/>如插件失效，可加微信联系作者进行适配' +
            '<img src="data:image/jpeg;base64,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" alt=""/>' +
            '<img src="data:image/png;base64,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cvc83wEmgSkgpQ+eylDlirQ5A5CCMrKQyWQQABEkAAPkiLqqub4nQLZ1NANyRVM8zwVEEEKC3JPKFR6A4vmCScEVLhH3nOLgAWaEYu7u7v7444+feuqpp59+OpPJKIoSDocPO+yw884776STTkokEgGr4z90jEmklMuXL//Zz3723nvvWZY1ZMiQX//619Qr5wsi9J0ECO4Avk1L6wBsTqstCj3SzEyJXqJlo1MFI962bezl+CzOpNIlAgQEXShojxJcus+9Ub6TcDfBrL4vDEV/CWA7AZYcEakgg9JMxa+SUrbQCzkvnicQkQ4hsiK6K4KrE/sZxTsD/QSPT4fQGoceMyAuC87Qvz2F4zh0+KGlSj04CyJ7CeDKysq2bduWz+ffeeedNWvW6Lo+bNiw73//+yeffHLwPezV1BVHocgTLvZ6mpub77nnntdff33s2LFHHnnkvHnzampqEBGklBJcz/U9D8DPZjsQGYLGVO44loMZAFmwstIXAGRFBAAKKRGYFEBejOe5qqIqnLlOAbkihOIrCmOMSSlgD8TQdh1gIBEKBScajfqMfgEAkL5gjCFj+7cksldRTU1NL7300uLFi1esWEGpgQEDBpx++umTJk2aNWtWSUlJ0IBqr0rel/YA4PHHH1+xYgUNCDLHB/b2/kUihOjp6Xnuued6enpojiEUXDabfe2115qamiigcO6556bTaSHEli1bXnnlFQpKHXXUUZS9hiKTGg6HH374YUQMhUJHHHHEiBEj+tiFQYMGLViwgBYmjLEg43PssccGNA57lWDslZeXX3jhhX2c6P4703fe1tb26quvEmidziCljMViX/7ylwcPHhw0VCUzunLlSnIlUqnU7NmzqXNQcELG2NSpU+m/3d3dy5Yt27lzJ0HpZs6cOX36dAD46KOPKJkVDoenTJkyatQowl5RK1UAGD9+/Ny5c6WUPT09K1eupG5nra2tjY2NdOa6urrf/e53uq6HQqEJEyZMmDDhEI6Zz7IGSaVSCxcurK+vf/PNN9euXdva2mpZVmtr644dOxAxm82+8sorf/nLXyZMmDBt2rSysjKKFVHND3y6/rL4tLKX12vnzp0bN25ctmzZunXrbrnllmg06vm+8D3P9T3fYygty/JFC0jF9TxkUhGSc+76rvCFBIEMUDK55y3SifcENXrtv0RAhXFN1XzfQ8YQ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" alt=""/>' +
            '</div>'
    });
}
 
function timedRefresh(){
    if (window.location == parent.location) {
        setInterval(function () {
            autoConfirm(10000, '您已挂机5分钟。为防止页面长时间执行引起的各种小问题的出现，将为您自动刷新页面（10秒后无操作，将默认刷新）', function(){
                window.location.reload();
            });
        }, 1000 * 60 * 5);
    }
}
 
// 学堂在线：登录学堂在线系统
function xl_login(sLearningCourseId, sExamCode) {
    var sUrl = "https://dec.jlu.edu.cn/rs/loginCheck/yuketang";
    var sData = {
        course_id: sLearningCourseId,
        exam_code: sExamCode,
        ran: Math.random()
    }
 
    var url;
    $.ajax({
        url: sUrl,
        data: sData,
        async: false,
        type: "POST",
        success: function (json) {
            if (!json.success) {
                alert(json.message);
            } else {
                url = json.message;
            }
        }
    });
    return url;
}
 
// 学堂在线：进入章节目录，开始学习课程
function xl_startLearn(){
    autoConfirm(10000, '是否开始学习所有章节下的课程?（10秒后无操作，将默认学习）<br/><br/>说明：插件将打开多个子窗口，对本章节下所有课程执行学习！', function(){
        layer.msg('执行自动学习', {offset: 'b'});
        var vue = document.querySelector('[data-v-3d8fef40]').__vue__;
        var chapterList = vue.$data.chapter_list; // 所有章节目录
        var leafList = new Array(); // 所有课程
 
        // 收集课程
        function collectLeaf(chapterList, leafList) {
            for (const chapter of chapterList) {
                if (chapter.leafinfo_id) { // 说明是课程
                    if (chapter.leaf_type != 6) { // 暂时不计入习题
                        leafList.push(chapter);
                    }
                } else {
                    var childList = chapter.section_leaf_list || chapter.leaf_list; // 存在子节点，继续递归
                    if (childList) {
                        collectLeaf(childList, leafList);
                    }
                }
            }
        }
        collectLeaf(chapterList, leafList);
        console.log("所有课程：" , leafList)
 
        // 获取所有未学习完成的课程
        function getNotSuccessLeafList() {
            var leafSchedules = vue.$data.leaf_schedules; // 所有课程完成情况
            var notSuccessLeafList = leafList.filter(leaf => leafSchedules[leaf.id] == null || leafSchedules[leaf.id] < 1);
            console.log("所有未完成的课程：", notSuccessLeafList);
            return notSuccessLeafList;
        };
 
        // 学习课程
        function learningCourses(notSuccessLeafList){
            var sign = vue.$data.sign;
            var classroomId = vue.$data.classroom_id; // 教堂ID
            window.learningCourse = window.learningCourse || new Object(); // 学习中的课程
            for (const notSuccessLeaf of notSuccessLeafList) {
                var leafOpenCount = Object.keys(window.learningCourse).length;
                if (leafOpenCount < 5 && !window.learningCourse.hasOwnProperty(notSuccessLeaf.id)) {
                    window.learningCourse[notSuccessLeaf.id] = notSuccessLeaf;
                    setTimeout(function () {
                        layer.open({
                            title: "正在学习课程：" + notSuccessLeaf.name,
                            type: 2,
                            shade: false,
                            area: '500px',
                            maxmin: true,
                            content: 'https://cejlu.yuketang.cn/pro/lms/' + sign + '/' + classroomId + '/video/' + notSuccessLeaf.id,
                            zIndex: layer.zIndex,
                            success: function (layero) {
                                layer.setTop(layero);
                            },
                            end: function () {
                                delete window.learningCourse[notSuccessLeaf.id];
                            }
                        });
                    }, leafOpenCount * 3000);
                }
            }
        };
 
        // 扫描并学习没有学过的课程
        const scanAndLearning = function () {
            // 重新获取一次最新的学习进度
            xl_getLearnSchedule();
 
            // 获取未读完的课程
            var notSuccessLeafList = getNotSuccessLeafList();
 
            if (notSuccessLeafList) {
                // 开始学习所有没有读的课程
                learningCourses(notSuccessLeafList);
            } else {
                clearInterval(scanLeafInterIndex);
                layer.alert('本章节课程已全部学习完毕', {icon: 3, title: '提示'}, function (index) {
                    layer.close(index);
                });
            }
 
            return scanAndLearning;
        };
        var scanLeafInterIndex = setInterval(scanAndLearning(), 1000 * 30);
    });
}
 
// 学堂在线：章节目录页面，重新获取学习进度
function xl_getLearnSchedule(){
    layer.msg('插件正在加载章节最新学习进度....', {offset: 'b'});
    document.querySelector('[data-v-3d8fef40]').__vue__.getLearnSchedule();
}
 
// 学堂在线：学习课程视频
function xl_learnVideo() {
    var intervalIndex = setInterval(function () {
        layer.msg('扫描课程学习进度', {offset: 'b'});
        var rate = document.querySelector('[data-v-3cb05906]').__vue__.$data.rate; // 课程学习情况
        if (rate >= 1) {
            clearInterval(intervalIndex);
            if (unsafeWindow.parent.layer && unsafeWindow.parent.layer.getFrameIndex(window.name)) {
                autoConfirm(3000, '本课程已学习完毕，是否关闭子窗口?（3秒后无操作，将默认关闭）', function () {
                    var index = unsafeWindow.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    unsafeWindow.parent.layer.close(index); //再执行关闭
                });
            } else {
                layer.alert('本课程已学习完毕', {icon: 3, title: '提示'}, function (index) {
                    layer.close(index);
                });
            }
        }
    }, 1000 * 10); //扫描课程学习情况
}
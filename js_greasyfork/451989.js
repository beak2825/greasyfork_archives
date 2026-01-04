// ==UserScript==
// @name         雨课堂辅助学习
// @version      0.0.6
// @description  copy 电子科大挂机宝
// @author       Horjer
// @require      https://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.js
// @resource     layer http://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @match        *://*.yuketang.cn/pro/lms/*

// @namespace http://tmpermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/451989/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/451989/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
 
GM_addStyle(GM_getResourceText('layer'));
GM_addStyle(".site-dir{display:none;}.site-dir li{line-height:26px;overflow:visible;list-style-type:disc;}.site-dir li a{display:block;text-decoration:none}.site-dir li a:active{color:#01AAED;}.site-dir li a.layui-this{color:#01AAED;}body .layui-layer-dir{box-shadow:none;border:1px solid #d2d2d2;}body .layui-layer-dir .layui-layer-content{padding:10px;}.site-dir a em{padding-left:5px;font-size:12px;color:#c2c2c2;font-style:normal;}");
GM_addStyle(".layui-layer-ico16,.layui-layer-loading.layui-layer-loading2{width:32px;height:32px;background:url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/loading-2.gif)no-repeat;}.layui-layer-ico{background: url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/icon.png) no-repeat;}");
 
unsafeWindow.layer = window.layer; // 把layer设置到原始window对象中
unsafeWindow.JQ = window.$; // 把layer设置到原始window对象中
 
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
        url: "https://student.uestcedu.com/rs/loginCheck/learning?" + Math.random(),
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
        layer.close(index);
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
                window.location.href = "https://student.uestcedu.com/console/";
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
        area: ['400px', '200px'], //宽高
        offset: 'rb',
        shade :0,
        content: '<h1 style="ltext-align:center">仅供参考学习，请勿刷课。</h1>'    });
}

function goNextVideo(){
        var url = window.location.href;
        var newVideoId = parseInt(/video\/([0-9]+)$/.exec(url)[1]) + 1;
        var newUrl = url.replace(/video\/[0-9]+$/,"video/" + newVideoId);
        window.location.href = newUrl;
    }
 
 
function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
}
 
 
    function main(){
        var progress = 'null';
        //PlayandSpeed();
        try{
            progress = document.querySelectorAll('span.text')[1].textContent.split("：")[1];
        }catch(e){
            console.log('读取时出错，查看是否为video');
            var elem= document.querySelector('.video-box');
            if(elem.innerHTML == ''){
                goNextVideo();
                return;
            }else{
                location.reload();
            }
        }
        try{
            //document.querySelector("video").playbackRate = 2.0;
            progress = parseInt(progress.split("%")[0]);
            document.querySelector('div.title-fl:first-child').innerText = '检测到进度：' + progress + '%';
            if(progress >= 95){
                goNextVideo();
                return;
            }
            setTimeout(main, 1000);
            document.querySelector(".xt_video_player_common_value").text = "2.00X";
            document.querySelector(".xt_video_player_common_value").click();
        }catch(e){
           console.log('读取时出错，尝试重试');
           location.reload();
        }
 
    }
 
var url = window.location.href;
if (url.match("/video")){
 
        if (window.onurlchange === null) {
            window.addEventListener("urlchange", () => {
                setTimeout(main, 2000);
 
            });
        }
        setTimeout(main, 2000);
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
    var sUrl = "https://student.uestcedu.com/rs/loginCheck/yuketang";
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
 
 
// 学堂在线：学习课程视频
function xl_learnVideo() {
    clearAllInterval();
 
    var intervalIndex = setInterval(function () {
        layer.msg('扫描课程学习进度', {offset: 'b'});
        var rate = document.querySelector('[data-v-6e71ac7e]').__vue__.$data.rate; // 课程学习情况
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
 
    // 修改倍数
    autoConfirm(3000, '是否修改课程学习倍数?（3秒后无操作，将默认执行修改）', function(){
        var videoIntervalIndex = setInterval(function () {
            var player = document.querySelector('[data-v-2259ff49]').__vue__.$data.player;
            if (player != null) {
                clearInterval(videoIntervalIndex);
 
                $(".xt_video_player_common_active").removeClass("xt_video_player_common_active");
                var $li = $(".xt_video_player_common_list li :first");
                var speed = 1; // 倍数（如果学习进度不更新，把这里改回1倍数）
                var speedText = "插件:" + speed + "X";
                $li.text(speedText);
                $li.attr("keyt", speed);
                $li.addClass("xt_video_player_common_active");
                $li[0].dataset.speed = speed;
 
                var $speedPlayerCommon = $(".xt_video_player_speed .xt_video_player_common_value");
                $speedPlayerCommon.text(speedText);
 
                $(".xt_video_player_speed").mouseout();
                $li[0].click();
 
                // 处理静音
                $(".xt_video_player_common_icon").click();
                $("video")[0].muted = true;
                player.video.muted = true;
 
                // 处理自动播放
                var payIntervalIndex = setInterval(function () {
                    if (player.video.play != null) {
                        clearInterval(payIntervalIndex);
 
                        player.video.play(); // 强制播放视频
 
                        //player.$video.off("timeupdate.speed");
                        player.$video.on("timeupdate.speed", function () {
                            player.options.speed.value = speed;
                            player.video.playbackRate = speed;
                            $speedPlayerCommon.text(speedText);
                            player.video.play(); // 强制播放视频
                        });
                    }
                }, 500);
 
            } else {
                layer.msg('等待视频加载....', {offset: 'b'});
                //window.location.reload(); // 视频没加载到，刷新页面
            }
        }, 500);
    });
}
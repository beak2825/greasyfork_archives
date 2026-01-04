// ==UserScript==
// @name         gdsspt_ext
// @namespace    x664@qq.com
// @version      0.0.4
// @description  广东松山职业技术学院部分网站功能扩展、页面美化、自动跳转登录界面
// @author       x664
// @match        *://*.gdsspt.cn/*
// @match        *://*.gdsspt.net/*
// @match        *://*.gdsspt.edu.cn/*
// @match        *://192.168.62.121/*
// @match        *://192.168.62.196/*
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/386250/gdsspt_ext.user.js
// @updateURL https://update.greasyfork.org/scripts/386250/gdsspt_ext.meta.js
// ==/UserScript==
var _self = unsafeWindow,
url = location.pathname,
host = location.host,
top = _self;

try {
    while (top != _self.top) top = top.parent.document ? top.parent: _self.top;
} catch(err) {
    top = _self;
}

var $ = _self.jQuery || top.jQuery;

var extnavli = "<li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-hit tree-collapsed\"></span><span class=\"tree-icon tree-folder\"></span><span class=\"tree-title\">增强功能</span></div><ul style=\"display: none;\"><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('成绩查看','/ScoreAudit/List?MNU=Mn_Sco_In_Audit','Mn_Sco_In_Audit')\" style=\"text-decoration:none;\">成绩查看</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('学生成绩','/StudentScore/List?MNU=Mn_Sco_Sco_Stu','Mn_Sco_Sco_Stu')\" style=\"text-decoration:none;\">学生成绩</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('个人成绩','/PersonalScore/List?MNU=Mn_Sco_Sco_Per','Mn_Sco_Sco_Per')\" style=\"text-decoration:none;\">个人成绩</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('专业成绩','/SpecialityScoreSum/List?MNU=Mn_Sco_Sco_Spe','Mn_Sco_Sco_Spe')\" style=\"text-decoration:none;\">专业成绩</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('学生课表','/EducationSchedulingReport/StudentReport?MNU=Mn_Sch_Sch_Student','Mn_Sch_Sch_Student')\" style=\"text-decoration:none;\">学生课表</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('班级课表','/EducationSchedulingReport/ClassmajorReport?MNU=Mn_Sch_Sch_Class','Mn_Sch_Sch_Class')\" style=\"text-decoration:none;\">班级课表</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('教师课表','/EducationSchedulingReport/TeacherReport?MNU=Mn_Sch_Sch_Teacher','Mn_Sch_Sch_Teacher')\" style=\"text-decoration:none;\">教师课表</a></span></div></li><li><div class=\"tree-node\" style=\"cursor: pointer;\"><span class=\"tree-indent\"></span><span class=\"tree-indent\"></span><span class=\"tree-icon tree-file\"></span><span class=\"tree-title\"><a href=\"javascript:$.System.addTab('教室课表','/EducationSchedulingReport/ClassroomReport?MNU=Mn_Sch_Sch_Classroom','Mn_Sch_Sch_Classroom')\" style=\"text-decoration:none;\">教室课表</a></span></div></li></ul></li>";
var extScoreAudit = "<a class=\"easyui-linkbutton icon-detail l-btn l-btn-plain\" name=\"Mn_Sco_In_Audit_Report\" href=\"javascript:ScoreAudit_Report()\"><span class=\"l-btn-left\"><span class=\"icon-detail l-btn-icon-left\">详细成绩</span></span></a>";

console.log(url);
if (host == 'jw.gdsspt.cn' || host == 'jw.gdsspt.net' || host == '192.168.62.121' || host == 'jw.gdsspt.edu.cn') {
    location.replace('http://' + host + ':88/Account/Login');
} else if (host == 'xg.gdsspt.cn' || host == 'xg.gdsspt.net' || host == '192.168.62.196') {
    if (url == '/xg/web') {
        $('.quick_xgxt>a')[0].click();
    }
} else if (host == 'jw.gdsspt.cn:88' || host == 'jw.gdsspt.net:88' || host == '192.168.62.121:88' || host == 'jw.gdsspt.edu.cn:88') {
    if (url == '/Account/Login') {
        $("body").css('user-select','none')
        $("#Table_01").css({'width':'100%'});
        $(".mainDiv01").parent("tr").remove();
        $(".mainDiv02").parent("tr").remove();
        $(".mainDiv03").parent("tr").remove();
        $(".mainDiv04").remove();
        $(".mainDiv05").removeClass("mainDiv05");
        $(".mainDiv06").remove();
        $(".mainDiv07").parent("tr").remove();
        $(".mainDiv08").parent("tr").remove();
        $("form table").css({'border':'1px solid #a0b1c4','padding':'0px 00px 50px','border-radius':'5px'});
        $(".loginbutton").addClass("_loginbutton");
        $(".loginbutton").removeClass("loginbutton");
        $("._loginbutton").html('<div class="login_button">登 录</div>');
        $("img").addClass("imgclass");
        $("#vcodeimg").removeClass("imgclass");
        $(".imgclass").parent("td").remove();
        $("#UserName").parent("td").parent("tr").before('<tr"><td class="loginhead"><div class="login_title">广东松山职业技术学院教务系统</div></td></tr>');
        $(".loginhead").css({'height':'50px','border-bottom':'1px solid #a0b1c4','background-color':'#f9fbfe','border-radius':'5px 5px 0px 0px'});
        $("#UserName").parent("td").css("padding-top", "51px");
        $("td").css({"padding-left":"30px","padding-right":"30px"});
        $("#UserName").css({'padding':'10px 40px 10px 10px','border':'1px solid #96a5b4','border-radius':'3px','width':'232px'});
        $("#Password").css({'padding':'10px 40px 10px 10px','border':'1px solid #96a5b4','border-radius':'3px','width':'232px'});
        $("[name=VerifyCode]").css({'padding':'10px 40px 10px 10px','border':'1px solid #96a5b4','border-radius':'3px','width':'148px'});
        $("#vcodeimg").css({'height':'46px','width':'80px'});
        $("[href='/Account/ForgotPassword']").parent("div").parent("td").parent("tr").css({'height':'16px'});
        $("[href='/Account/ForgotPassword']").parent("div").parent("td").remove();
        $("#UserName").mouseover(function () {
        	$("#UserName").css("border", "1px solid #4892e7");
        });
        $("#UserName").mouseout(function () {
        	$("#UserName").css("border", "1px solid #96a5b4");
        });
        $(".login_button").css({'background-color':'rgb(90,152,222)','border-radius':'30px','height':'40px','line-height':'40px','text-align':'center','font-family':'黑体','font-size':'16px','font-weight':'bold','color':'White','cursor':'pointer','user-select':'none'});
        $(".login_button").mouseover(function () {
        	$(".login_button").css("background-color", "rgb(106,162,224)");
        });
        $(".login_button").mouseout(function () {
        	$(".login_button").css("background-color", "rgb(90,152,222)");
        });
        $(".login_button").click(function () {
        	$(document.forms[0]).submit();
        });
        $(".loginhead").css("padding", "0px");
        $(".login_title").css({'width':'100%','font-size':'16px','line-height':'50px','text-align':'center','color':'black','font-family':'微软雅黑','font-weight':'bold','user-select':'none'});
    } else if (url == '/') {
        var navul = $(".easyui-tree").html();
        var SystemClockid = $("[name='SystemClock']").attr("id");
        var SystemClockOrigin = $("[name='SystemClock']").html();
        $(".easyui-tree").html(navul + extnavli);
        $(".layout-panel-west>.panel-header").remove();
        var SystemClockdiv = "<span name='SystemClock' id=\"" + SystemClockid + "\" >" + SystemClockOrigin + "</span>";
        $("#divCurrentInformation").html(SystemClockdiv);
    } else if (url == '/ScoreAudit/List') {
        var ScoreAudittoolbar = $(".toolbar").html();
        $(".toolbar").html(ScoreAudittoolbar + extScoreAudit);
    }
}
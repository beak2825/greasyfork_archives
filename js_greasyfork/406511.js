// ==UserScript==
// @name         SCU CourseSelectorHelper
// @namespace    http://tampermonkey.net/
// @version      0.9.7
// @description  多项功能集成 | 教务处七天免登录接口与自动输入学号密码 | 所有成绩信息显示 | 登陆后页面优化 | 抢课(主打)
// @author       Y4tacker
// @include      http://202.115.47.141/*
// @include      http://zhjw.scu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406511/SCU%20CourseSelectorHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/406511/SCU%20CourseSelectorHelper.meta.js
// ==/UserScript==

// Setting
var setting = {
    username: '',//此处输入你的学号
    password: '',//此处输入你的密码
    specialty: '5519',
    select_number: '',
    termInfo: ''
};

// controlInfo
var gradesObj = {}

// Functions
function springRememberMe() {
    const div = document.createElement('div');
    const login = document.querySelector('#formContent > form.form-signin');
    div.style.margin = '5px 0'
    div.innerHTML = '<input class="fadeIn third" type="checkbox" name="_spring_security_remember_me" style="margin-bottom: 5px;text-align: left;" checked="">两周之内不必登录'
    login.insertBefore(div, login.children[5])
};
function autoLogin(us, ps) {
    document.getElementById("input_username").value = us;
    document.getElementById("input_password").value = ps;
};
function getAllGradePoint() {
    let results = null;
    results = $.ajax({
        url: "/main/academicInfo",
        cache: false,
        type: "get",
        data: "",
        dataType: "json",
        async: false,
        success: function(result) {
            return result;
        }
    });
    gradesObj.allCourseGradePoint = results.responseJSON[0].gpa
}
function getGradesInfo() {
    let results = null;
    let infoList = [];
    // 总课程数量
    let number = 0;
    results = $.ajax({
        url: "/student/integratedQuery/scoreQuery/allPassingScores/callback",
        cache: false,
        type: "get",
        data: "",
        dataType: "json",
        async: false,
        success: function(result) {
            return result;
        }
    });
    let gradesList = results.responseJSON.lnList;
    gradesObj.eachTermInfo = []
    gradesObj.totalNum = gradesList.length;
    for (let i = 0;i < gradesObj.totalNum;i++){
        let grades = {};
        grades.termInfo = gradesList[i].cjbh;
        grades.courseInfo = gradesList[i].cjList;
        grades.courseNum = grades.courseInfo.length;
        number += parseInt(grades.courseNum);
        infoList.push(grades)
    }
    gradesObj.allCourseInfo =  infoList;
    gradesObj.totalCourseNum = number;
    // 执行每学期课程数据计算
    let info = gradesObj.allCourseInfo
    for (let i=0;i<info.length;i++){
        // 所有课程加权平均分
        let allWeightedAverageScore = 0;
        // 所有课程绩点
        let allGradesPoint = 0;
        //所有必修加权平均分
        let impWeightedAverageScore = 0;
        // 必修绩点
        let impGradePoint = 0;
        // 所有学科学分
        let totalCredits = 0;
        // 所有必修学科学分
        let impCredits = 0;
        let infoObj = {};
        let courseInfo = info[i].courseInfo;
        for (let j=0;j<courseInfo.length;j++){
            totalCredits += parseInt(courseInfo[j].credit)
            allWeightedAverageScore += (parseFloat(courseInfo[j].courseScore) * parseFloat(courseInfo[j].credit));
            allGradesPoint += (parseFloat(courseInfo[j].gradePointScore) * parseFloat(courseInfo[j].credit));
            // 必修相关计算
            if (courseInfo[j].courseAttributeName.indexOf("必修") != -1){
                impCredits += parseInt(courseInfo[j].credit);
                impGradePoint += (parseFloat(courseInfo[j].gradePointScore) * parseFloat(courseInfo[j].credit));
                impWeightedAverageScore += (parseFloat(courseInfo[j].courseScore) * parseFloat(courseInfo[j].credit));
            }
        }
        infoObj.allGradesPoint = (allGradesPoint/totalCredits).toPrecision(5)
        infoObj.allWeightedAverageScore = (allWeightedAverageScore/totalCredits).toPrecision(5)
        infoObj.impWeightedAverageScore = (impWeightedAverageScore/impCredits).toPrecision(5)
        infoObj.impGradePoint = (impGradePoint/impCredits).toPrecision(5)
        gradesObj.eachTermInfo.push(infoObj)
    }
}
function generateBody(){
    let place = null;
    let div = null;
    place = document.querySelector('#page-content-template');
    div = document.createElement('div');
    div.className = 'row';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7)');
    div = document.createElement('div');
    div.className = 'sua-widget-container-gpa-calculator col-sm-12 widget-container-col self-margin';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7) > div');
    div = document.createElement('div');
    div.className = 'widget-box';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7) > div > div');
    div = document.createElement('div');
    div.className = 'widget-header';
    div.innerHTML = '<h5  class="widget-title gpa-title">我的成绩信息<span  class="badge badge-primary" style="padding-top: 3px; position: relative; top: -3px;">SCU CourseSelectorHelper</span></h5><div  class="widget-toolbar"><div  class="widget-menu"><a  id="gpa-toolbar-detail" data-action="settings" data-toggle="dropdown" window.location.href=\'/student/integratedQuery/scoreQuery/allPassingScores/index\'><i  class="ace-icon fa fa-bars"></i></a></div></div></div>';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7) > div > div');
    div = document.createElement('div');
    div.className = 'widget-body';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body');
    div = document.createElement('div');
    div.className = 'widget-main';
    place.appendChild(div);
    place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div:nth-child(1)');
    div = document.createElement('div');
    div.className = 'sua-container-gpa-calculator';
    place.appendChild(div);
}
function generateAdditionalInfo() {
    let insert = null;
    let parent = null;
    parent = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div')
    insert = document.createElement('div');
    insert.className = 'gpa-tt row';
    insert.innerHTML = '<div class="col-sm-12">'+
        '<h4 class="header smaller lighter grey">'+
        '<i class="menu-icon fa fa-calendar"></i>'+
        '全部学期成绩<span class="gpa-info-badge badge badge-yellow">'+gradesObj.totalCourseNum+' 门</span> '+
        '<span class="gpa-info-badge badge badge-yellow">'+gradesObj.totalCredits+' 学分</span> '+
        '</h4><div style="display: inline-block;"><span class="gpa-tt-tag label label-success">必修加权平均分：'+gradesObj.impWeightedAverageScore+'</span> '+
        '<span class="gpa-tt-tag label label-success">必修绩点：'+gradesObj.impGradePoint+'</span> '+
        '<span class="gpa-tt-tag label label-purple">全部加权平均分：'+gradesObj.allWeightedAverageScore+'</span> '+
        '<span class="gpa-st-tag label label-purple">全部成绩绩点：'+gradesObj.allCourseGradePoint+'</span> <p></p><p></p><p></p></div></div>';
    parent.insertBefore(insert, parent.children[0]);

}
function generateDetailedInfo() {
    let info = gradesObj.allCourseInfo
    let number = info.length
    // 所有学科学分
    let totalCredits = 0
    // 所有必修学科学分
    let impCredits = 0
    // 所有学科加权平均分
    let allWeightedAverageScore = 0
    // 必修加权平均分
    let impWeightedAverageScore = 0
    // 必修绩点
    let impGradePoint = 0
    for (let i = 0;i < number; i++){
        let place = null;
        let insert = null;
        let parent = null;
        // 绘制组件
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div:nth-child(1) > div');
        insert = document.createElement('div');
        insert.className = 'gpa-st-container row';
        place.appendChild(insert);
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div > div.gpa-st-container.row')
        insert = document.createElement('div')
        insert.className = 'gpa-st col-xs-12 self-margin'
        insert.style = 'width: 50%;'
        place.appendChild(insert)
        // 绘制各个学期的表
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div > div.gpa-st-container.row > div:nth-child('+(i+1)+')')
        insert = document.createElement('h4')
        insert.className = 'header smaller lighter grey'
        let tmp = info[i].termInfo.split("(")[0]
        insert.innerHTML = '<i  class="menu-icon fa fa-calendar"></i>' + tmp
        place.appendChild(insert)
        // 生成每学期数据
        parent = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div.sua-container-gpa-calculator > div:nth-child(1) > div:nth-child('+(i+1)+')')
        insert = document.createElement('div');
        insert.className = 'gpa-tt row';
        insert.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<div style="display: inline-block;">'+
            '<span class="gpa-st-tag label label-success">必修加权平均分：'+gradesObj.eachTermInfo[i].impWeightedAverageScore+'</span> '+
            '<span class="gpa-st-tag label label-success">必修绩点：'+gradesObj.eachTermInfo[i].impGradePoint+'</span> '+
            '<span class="gpa-st-tag label label-purple">全部加权平均分：'+gradesObj.eachTermInfo[i].allWeightedAverageScore+'</span> '+
            '<span class="gpa-st-tag label label-purple">全部绩点：'+gradesObj.eachTermInfo[i].allGradesPoint+'</span><p></p></div>';
        parent.appendChild(insert)
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div > div.gpa-st-container.row > div:nth-child('+(i+1)+')')
        insert = document.createElement('table')
        insert.className = 'gpa-st-table table table-striped table-bordered table-hover'
        place.appendChild(insert)
        // 绘制表头
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div > div.gpa-st-container.row > div:nth-child('+(i+1)+') > table')
        insert = document.createElement('thead')
        insert.innerHTML = '<tr><th>课程名</th><th class="center">学分</th><th class="center">属性</th><th class="center">分数</th><th class="center">等级</th><th class="center">绩点</th></tr>'
        place.appendChild(insert)
        // 生成成绩信息
        place = document.querySelector('#page-content-template > div:nth-child(7) > div > div > div.widget-body > div > div > div.gpa-st-container.row > div:nth-child('+(i+1)+') > table')
        insert = document.createElement('tbody')
        insert.id = 'scoretbody' + (i+1)
        place.appendChild(insert)
        let courseInfo = info[i].courseInfo
        for (let j=0;j<courseInfo.length;j++){
            place = document.querySelector('#scoretbody'+ (i+1))
            insert = document.createElement('tr')
            insert.className = 'gpa-st-item'
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = ''
            insert.innerText = courseInfo[j].courseName
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = 'center'
            insert.innerText = courseInfo[j].credit
            totalCredits += parseInt(courseInfo[j].credit)
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = 'center'
            insert.innerText = courseInfo[j].courseAttributeName
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = 'center'
            insert.innerText = courseInfo[j].courseScore
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = 'center'
            insert.innerText = courseInfo[j].gradeName
            place.appendChild(insert)
            place = document.querySelector('#scoretbody'+ (i+1) +' > tr:nth-child('+(j+1)+')')
            insert = document.createElement('td')
            insert.className = 'center'
            insert.innerText = courseInfo[j].gradePointScore
            place.appendChild(insert)
            // 计算全部加权平均分
            allWeightedAverageScore += (parseFloat(courseInfo[j].courseScore) * parseFloat(courseInfo[j].credit))
            // 计算必修加权平均分
            if (courseInfo[j].courseAttributeName.indexOf("必修") != -1){
                impCredits += parseInt(courseInfo[j].credit)
                impGradePoint += (parseFloat(courseInfo[j].gradePointScore) * parseFloat(courseInfo[j].credit))
                impWeightedAverageScore += (parseFloat(courseInfo[j].courseScore) * parseFloat(courseInfo[j].credit))
            }
        }
    }
    gradesObj.totalCredits = totalCredits
    gradesObj.allWeightedAverageScore = (allWeightedAverageScore/totalCredits).toPrecision(5)
    gradesObj.impWeightedAverageScore = (impWeightedAverageScore/impCredits).toPrecision(5)
    gradesObj.impGradePoint = (impGradePoint/impCredits).toPrecision(4)
}
function viewXkCount(zxjxjhh, kch, kxh) {
    $.ajax({
        url: "/student/courseSelect/selectCourse/viewXkCount/" + zxjxjhh + "/" + kch + "/" + kxh,
        cache: false,
        type: "post",
        data: "",
        dataType: "json",
        beforeSend: function() {},
        complete: function() {},
        success: function(d) {
            setting.select_number = d;
            urp.alert("该课程已选人数为：" + d + "人")
        },
        error: function(xhr) {
            urp.alert("错误代码[" + xhr.readyState + "-" + xhr.status + "]:获取数据失败！");
        }
    });
};
function getCourseInfo(bxkc) {
    var idarr = new Array();
    var kcarr = new Array();
    for (var i = 0; i < bxkc.length; i++) {
        var qcjson = bxkc[i];
        idarr[idarr.length] = qcjson.kch + "@" + qcjson.kxh + "@" + qcjson.zxjxjhh;
        kcarr[kcarr.length] = qcjson.kcm.replace(/#@urp001@#/g, "'") + "(" + qcjson.kch + "@" + qcjson.kxh + ")";
    }
    console.log(idarr)
    console.log(kcarr)
    $("#kcIds").val(idarr.join(","));
    var xx = kcarr.join(",");
    var xxa = "";
    for (var ii = 0; ii < xx.length; ii++) {
        xxa += xx.charCodeAt(ii) + ",";
    }
    $("#kcms").val(xxa);
}

//界面美化
function functionBar() {
    const place = document.querySelector('#menus');
    const li = document.createElement('li');
    li.className = 'hsub sua-menu-list';
    li.id = 'sua-menu-qiangke';
    li.onclick = 'rootMenuClick(this);';
    li.innerHTML = '<a href=\'#\' class=\'dropdown-toggle\'><i class=\'menu-icon fa fa-gavel\'></i><span class=\'menu-text\'>SCU抢课助手</span><b class=\'arrow fa fa-angle-down\'></b></a><b class=\'arrow\'></b><ul class=\'submenu nav-hide\' onclick=\'stopHere();\' style=\'display: none;\'><li class=\'hsub sua-menu open\' id=\'menu-utility-tools\'><a href=\'#\' class=\'dropdown-toggle\'>功能区<b class=\'arrow fa fa-angle-down\'></b></a><b class=\'arrow\'></b><ul class=\'submenu nav-show\' style=\'display: block;\'><li class=\'sua-menu-item\' id=\'menu-item-自由选课\'><a href=\'http://zhjw.scu.edu.cn/student/courseSelect/freeCourse/index?fajhh='+setting.specialty+'\'>&nbsp;&nbsp; 自由选课界面</a><b class=\'arrow\'></b></li></ul>'
    place.insertBefore(li, place.children[place.children.length - 1]);
};
function followMe(arg) {
    const ul = arg;
    const li = document.createElement('li');
    li.className = 'red';
    li.style = 'text-align: center';
    ul.insertBefore(li, ul.children[1]);
    li.innerHTML = '<a data-toggle="dropdown" class="dropdown-toggle" href="#" ><i class="ace-icon fa fa-cogs"></i>SCU CourseSelectorHelper<i class="ace-icon fa fa-caret-down"></i></a>';
    let parent = document.querySelector('#navbar-container > div.navbar-buttons.navbar-header.pull-right > ul > li.red');
    let insert = document.createElement('ul');
    insert.className ='user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close';
    insert.style= 'width: 100%;background-color: white;';
    insert.innerHTML = '<li><a href="javascript:;" title="获取更新" id="0" onclick="update();"><i class="ace-icon fa fa-bolt"></i>获取更新</a></li><li><a href="javascript:;)" onclick="lookMe();"><i class="ace-icon fa fa-search-plus"></i>联系我</a></li>';
    parent.appendChild(insert);
};
function beautifyInterface() {
    let tmp2 = $('#page-content-template > div.row > div.col-sm-6.widget-container-col')[0]
    // 代办事项
    $('#page-content-template > div.row > div.col-xs-12.self-margin > div.row > div:nth-child(2)').after(tmp2)
    //大布局更改
    let tmpDoc = $('#page-content-template > div.row > div > div.row > div')
    tmpDoc[0].style = 'padding-right: 0px !important; flex: 1 1 0%; min-width: 250px; margin-bottom: 15px;'
    tmpDoc[1].style = 'flex: 2 1 0%; min-width: 500px; padding-right: 0px; margin-bottom: 15px;'
    tmpDoc[2].style = 'padding-right: 12px; flex: 1 1 0%; min-width: 250px; margin-bottom: 15px;'
    $('#page-content-template > div.row > div > div.row > div:nth-child(3)').css('width',500)
    $('#page-content-template > div.row > div > div.row > div:nth-child(3) > div').css('height',366)
    $('#page-content-template > div.row > div > div.row > div:nth-child(1) > div > div.widget-body > div').css('padding',0)
    // 学业信息
    let tmp = document.querySelectorAll('#page-content-template > div:nth-child(1) > div > div.row > div:nth-child(2) > div > div.widget-body > div > div')
    for(var i=0;i<tmp.length;i++){
        a[i].style = 'width: 100%; border: none; margin: 0px; background-color: white;'
    }
    $('#page-content-template > div.row > div > div.row > div:nth-child(1) > div > div.widget-body > div').css('padding',0)
    $('#page-content-template > div:nth-child(1) > div.col-xs-12.self-margin > div.row > div:nth-child(1) > div').css('height',366)
    $('#page-content-template > div:nth-child(1) > div.col-xs-12.self-margin > div.row > div:nth-child(1)').css('width',263)
    // 学业信息第五排有点毛病单独弄一个长度250
    $('#page-content-template > div:nth-child(1) > div.col-xs-12.self-margin > div.row > div:nth-child(1) > div > div.widget-body > div > div:nth-child(5)').css('width',250)
    // 通知
    $('#page-content-template > div:nth-child(1) > div.col-xs-12.self-margin > div.row > div:nth-child(2) > div').css('height',366)
    $('#page-content-template > div:nth-child(1) > div.col-xs-12.self-margin > div.row > div:nth-child(2)').css('width',500)
}
// Adding Web Elements
const ulForLoginSuccess = document.querySelector('#navbar-container > div.navbar-buttons.navbar-header.pull-right > ul');
const loginIndex = document.querySelector('#loginButton');
if (loginIndex != null){
    if (setting.username.length > 0 && setting.password.length > 0){
        autoLogin(setting.username, setting.password);
    };
    const new_element = document.createElement("script");
    new_element.setAttribute("type", "text/javascript");
    new_element.setAttribute("src", "http://202.115.47.141/js/customjs/urpjs.js");
    document.body.appendChild(new_element);
    window.onload = function() {
        urp.alert("欢迎使用Y4tacker's教务系统功能插件");
    };
    springRememberMe();
};
if (ulForLoginSuccess != null){
    let src = document.createElement('script');
    src.innerHTML = 'function lookMe(){window.open("https://blog.csdn.net/solitudi")};function update() {window.open("https://greasyfork.org/zh-CN/scripts/406511-scu-courseselectorhelper")};';
    document.body.appendChild(src);
    followMe(ulForLoginSuccess);
    functionBar();
};
if(window.location.href.indexOf('student')==-1){
    beautifyInterface();
    getAllGradePoint();
    getGradesInfo();
    generateBody();
    generateDetailedInfo();
    generateAdditionalInfo();
}
if(window.location.href.indexOf("fajhh") != -1 ){
    $('#div_kc_tj > form > div:nth-child(6)').after("<div style='width:100%;'><span class='input-icon' style='width:30%;'><input type='text' name='ywhname' placeholder='请输入课程名称' onkeyup='changedtj(this.value);' id='ywh1' style='width:100%;height:32px;border-radius:5px !important;line-height:32px;'><i class='ace-icon fa fa-search'></i></span><label style='color: #336199;margin-left:10px;margin-right:10px;'>输入课程号</label><span class='input-icon' style='width:20%;'><input type='text' name='ywhvalue' placeholder='格式（123456_12）' onkeyup='changedtj(this.value);' id='ywh2' style='width:80%;height:32px;border-radius:5px !important;line-height:32px;'></span><button id='queryButton' class='btn btn-info btn-xs btn-round search_btn' onclick='getValue();return false;' style='top:-1px;margin-left:30px !important;' type='button'><i class='ace-con fa fa-search white bigger-120'></i> 抢课</button><span id='span-clear' style='color:gray;cursor:pointer;padding:3px 6px;position:relative;left:-135px;display:none;' onclick='cleartj(this);'><i class='ace-icon glyphicon glyphicon-remove'></i></span></div>")
    $('head > script:nth-child(23)').after("<script type='text/javascript'>function selectCourse(name,number){this.name = name;this.number = number;this.xuanze = function(){var kch= number;var kcmc = name;var target_class = kcmc;var target_kechenghao_kexuhao = kch;var n = kch.split('_');var target_kechenghao = n[0];var target_kexuhao = n[1];var kcIds = kch + '_' + '2019-2020-2-1';var kcms_ = kcmc + '_' + target_kexuhao;var kcms = '';for(let i=0; i <kcms_.length;i++){kcms += kcms_[i].charCodeAt() + ',';}$('#kcms').val(kcms);$('#kcIds').val(kcIds);$('#sj').val('0_0');console.log('课程信息拼接成功'+kcms);}};function getValue(){var aa = document.getElementById('ywh1').value;var bb = document.getElementById('ywh2').value;var xgg = new selectCourse(aa,bb);xgg.xuanze()}</script>")

};
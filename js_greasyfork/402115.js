// ==UserScript==
// @name         SCU抢课助手
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  try to take over the world!
// @author       杨文豪
// @include      http://202.115.47.141/*
// @include      http://zhjw.scu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402115/SCU%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402115/SCU%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
function getValue(){
        var aa = document.getElementById("ywh1").value;
        var bb = document.getElementById("ywh2").value;
        selectCourse(aa,bb)
}
function post(URL, PARAMS) {
  var temp = document.createElement("form");
  temp.action = URL;
  temp.method = "post";
  temp.style.display = "none";
  for (var x in PARAMS) {
    var opt = document.createElement("textarea");
    opt.name = x;
    opt.value = PARAMS[x];
    // alert(opt.name)
    temp.appendChild(opt);
  }
  document.body.appendChild(temp);
  temp.submit();
  return temp;
}
function selectCourse(name,number){
//提交选课
this.name = name;
this.number = number;
this.xuanze = function(){
	var kch= number;
    var kcmc = name;
    var target_class = kcmc;
    var target_kechenghao_kexuhao = kch;
    var n = kch.split("_");
    var target_kechenghao = n[0];
    var target_kexuhao = n[1];
    var kcIds = kch + "_" + "2019-2020-2-1";
    var kcms_ = kcmc + "_" + target_kexuhao;
    var kcms = "";
    for(let i=0; i <kcms_.length;i++){
        kcms += kcms_[i].charCodeAt() + ",";
    }
    $("#kcms").val(kcms);
    $("#kcIds").val(kcIds);
    $("#sj").val("0_0");
    console.log("课程信息拼接成功"+kcms);
}
}
var tokenvalue;
var fajhh = 5519;
$("#\\31 25903579").after("<li class='hsub sua-menu-list' id='sua-menu-qiangke' onclick='rootMenuClick(this);'><a href='#' class='dropdown-toggle'><i class='menu-icon fa fa-gavel'></i><span class='menu-text'>SCU抢课助手</span><b class='arrow fa fa-angle-down'></b></a><b class='arrow'></b><ul class='submenu nav-hide' onclick='stopHere();' style='display: none;'><li class='hsub sua-menu open' id='menu-utility-tools'><a href='#' class='dropdown-toggle'>实用工具<b class='arrow fa fa-angle-down'></b></a><b class='arrow'></b><ul class='submenu nav-show' style='display: block;'><li class='sua-menu-item' id='menu-item-自由选课'><a href='http://zhjw.scu.edu.cn/student/courseSelect/freeCourse/index?fajhh=5519'>&nbsp;&nbsp; 自由选课界面</a><b class='arrow'></b></li></ul></li>")
if(window.location.href.indexOf("login") != -1 ){
$('#formContent > form.form-signin > a').after('<br /><input type="checkbox" checked name="_spring_security_remember_me" class="fadeIn third" style="margin-bottom: 5px;text-align: left;">&nbsp;两周之内不必登录<br />');
}
$('#navbar-container > div.navbar-buttons.navbar-header.pull-right > ul > li:nth-child(2)').before('<li class="light-orange" style="text-align: center;"><a href="#" onclick="myFunction()"><i class="ace-icon fa fa-gavel"></i>SCU抢课助手</a></li>\n<script>\nfunction myFunction() {var messageStr = "请输入课程名称";var defaultStr = "格式：韩语（中级）";kcmc= window.prompt(messageStr, defaultStr);var messageStr = "输入课程号_课序号";var defaultStr = "格式：123456_12";kch=window.prompt(messageStr, defaultStr);target_class = kcmc;target_kechenghao_kexuhao = kch;var n = kch.split("_");target_kechenghao = n[0];target_kexuhao = n[1];kcIds = kch + "_" + "2019-2020-2-1";var kcms_ = kcmc + "_" + target_kexuhao;kcms = "";for(let i=0; i <kcms_.length;i++){kcms += kcms_[i].charCodeAt() + ",";}console.log("课程信息拼接成功"+kcms);}\n</script>');
if(window.location.href.indexOf("fajhh") != -1 ){
    $('#div_kc_tj > form > div:nth-child(6)').after("<div style='width:100%;'><span class='input-icon' style='width:30%;'><input type='text' name='ywhname' placeholder='请输入课程名称' onkeyup='changedtj(this.value);' id='ywh1' style='width:100%;height:32px;border-radius:5px !important;line-height:32px;'><i class='ace-icon fa fa-search'></i></span><label style='color: #336199;margin-left:10px;margin-right:10px;'>输入课程号</label><span class='input-icon' style='width:20%;'><input type='text' name='ywhvalue' placeholder='格式（123456_12）' onkeyup='changedtj(this.value);' id='ywh2' style='width:80%;height:32px;border-radius:5px !important;line-height:32px;'></span><button id='queryButton' class='btn btn-info btn-xs btn-round search_btn' onclick='getValue();return false;' style='top:-1px;margin-left:30px !important;' type='button'><i class='ace-con fa fa-search white bigger-120'></i> 抢课</button><span id='span-clear' style='color:gray;cursor:pointer;padding:3px 6px;position:relative;left:-135px;display:none;' onclick='cleartj(this);'><i class='ace-icon glyphicon glyphicon-remove'></i></span></div>")
    $('head > script:nth-child(23)').after("<script type='text/javascript'>function selectCourse(name,number){this.name = name;this.number = number;this.xuanze = function(){var kch= number;var kcmc = name;var target_class = kcmc;var target_kechenghao_kexuhao = kch;var n = kch.split('_');var target_kechenghao = n[0];var target_kexuhao = n[1];var kcIds = kch + '_' + '2019-2020-2-1';var kcms_ = kcmc + '_' + target_kexuhao;var kcms = '';for(let i=0; i <kcms_.length;i++){kcms += kcms_[i].charCodeAt() + ',';}$('#kcms').val(kcms);$('#kcIds').val(kcIds);$('#sj').val('0_0');console.log('课程信息拼接成功'+kcms);}};function getValue(){var aa = document.getElementById('ywh1').value;var bb = document.getElementById('ywh2').value;var xgg = new selectCourse(aa,bb);xgg.xuanze()}</script>")
    $('#queryButton').after("<button id='queryButton' class='btn btn-info btn-xs btn-round search_btn' onclick='viewXkCount(a,'505021040','01');return false;' style='top:-1px;margin-left:30px !important;' type='button'><i class='ace-con fa fa-search white bigger-120'></i> GO</button>")  
}

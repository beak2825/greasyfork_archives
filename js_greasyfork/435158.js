// ==UserScript==
// @name         教师资格证考试报名 强制非IE浏览器登录
// @namespace    http://bwwssqjwlf.net/
// @version      0.3
// @description  自己使用登陆教资网
// @author       偷偷学技术
// @license      Unlicense
// @match        *.neea.edu.cn/apply/memapp/memLogin
// @match        *.neea.edu.cn/apply/memapp/ieNote
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435158/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%AF%81%E8%80%83%E8%AF%95%E6%8A%A5%E5%90%8D%20%E5%BC%BA%E5%88%B6%E9%9D%9EIE%E6%B5%8F%E8%A7%88%E5%99%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435158/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%AF%81%E8%80%83%E8%AF%95%E6%8A%A5%E5%90%8D%20%E5%BC%BA%E5%88%B6%E9%9D%9EIE%E6%B5%8F%E8%A7%88%E5%99%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (location.href.match("//(.*).neea.edu.cn/apply/memapp/ieNote") != null) {
        document.write(`

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="renderer" content="webkit">
<title>中小学教师资格考试 - 中国教育考试网</title>
<style>
body {
	margin: 0;
	padding: 0;
	font: 14px "Microsoft YaHei", san-serif;
	text-align: center;
	background:/*url(/res/Home/structure/15070330.jpg) repeat-x */#fff;
	color: #333;
}
div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, input {
	padding: 0;
	margin: 0;
}
ul, li {
	list-style: None;
}
table, td, tr, th {
}
img {
	border: 0;
	margin: 0px;
}
h1, h2, h3, h4, h5, h6 {
	font-weight: normal;
}
a {
	text-decoration: none;
	color: #333333;
}
a:hover {
	text-decoration: underline;
	color: #FE8500;
}
.clear {
	clear: both
}
#Content {
	min-height: 600px;
	background: url(../../imagesxxc/bg_img.png) no-repeat 10% bottom;
}
.header-top {
	height: 35px;
	border-bottom: 1px solid #ddd;
	background: #f2f2f2;
}
.header-top-con, .w1150 {
	width: 1050px;
	position: relative;
	margin: 0 auto;
	overflow: hidden;
	text-align: left
}
.header-top-con {
	height: 35px
}
.headerLogo {
	position: absolute;
	left: 5px;
	top: 10px;
}
.headerBgImg {
	position: absolute;
	left: 172px;
	top: -10px;
	height: 60px;
}
.header-top-right {
	float: right;
	width: 500px;
	position: relative;
	color: #313F61;
	line-height: 35px;
	font-size: 12px;
	text-align: center;
}
.header-top-right em {
	font-style: normal
}
.header-top-right img {
	vertical-align: middle;
}
.log-btn {
	display: block;
	position: absolute;
	background: url(http://csesearch.neea.edu.cn/res/Home/structure/indexsprite.png) no-repeat left top;
	padding-left: 22px;
	right: 252px;
	z-index: 9
}
.welcome {
	position: absolute;
	right: 171px;
}
.reg-btn {
	display: block;
	position: absolute;
	right: 172px;
	background: url(http://csesearch.neea.edu.cn/res/Home/structure/indexsprite.png) no-repeat -80px top;
	padding-left: 25px;
}
.header-top-right span {
	position: absolute;
	right: 17px;
}
.header-top-right a {
	color: #313F61;
}
.logonline {
	border-bottom: solid 1px #E4E4E4;
	overflow: hidden;
}
.header_bottom {
	height: 80px;
	float: left;/*position:relative;*/
	width: 300px
}
.header_bottom .CurrentlyImg {
	padding: 10px 0 0px 0;
}
/*页脚*/
#Footer {
	height: 80px;
	background: #ddd;
	color: #303D5D;
	border-top: 1px solid #ccc;
}
.copyright {
	position: absolute;
	top: 0px;
	height: 50px;
	/*background: url(../imagesxxc/indexfooter_logo.png) no-repeat left 8px;*/
	text-align: left;
	padding-left: 100px;
	line-height: 100%;
	padding-top: 10px;
	left: 0;/*color:#b3c1ce;*/
}
.footer {
	height: 80px;
	background: #f4f4f4;
	color: #303D5D;/*position:absolute;*/
	bottom: 0;
	width: 100%;
}
.links {
	padding: 56px 0px 22px 0px;
	background: url(http://csesearch.neea.edu.cn/res/Home/structure/indexlinks_bg.png) no-repeat center bottom;
}
.links select {
	width: 185px;
}
.footer-nav {
	font-weight: bold;
	color: red;
	padding-bottom: 5px;
}
.footer-nav a {
	color: #303D5D;
}
.footer-bottom {
	width: 1000px;
	margin: 0 auto;
	position: relative;
}
.motto {
	position: absolute;
	top: 55px;
	right: 0px;
}
.motto i {
	font-style: normal;
	color: #FE8500
}
.motto i a {
	color: #D80000
}
.nav ul li {
	text-align: center
}
.moreClass {
	text-align: right;
	padding: 0px 50px 0 0;
	width: 660px;
}
.moreClass a {
	color: #FF7F00
}
/*内容*/
#Content1 {
	width: 900px;
	margin: 0 auto;

}
.logo_img {
	margin: 60px 0;
	text-align: left;
}
.login_con {
	position: relative;
	overflow: hidden;
	width: 700px;
	margin-left: 0px;
}
.con_left {
	width: 350px;
	float: left;
	border-right: 1px solid #ccc;
	padding-right: 20px;
}
.con_right {
	float: left;
	text-align: left;
	width: 310px;
}
.con_right p {
	margin: 20px;
	margin-left: 40px;
	line-height: 2em;
}
.logpic {
	text-align: right;
	font-size: 16px;
}
.input {
	width: 200px;
	height: 34px;
	line-height: 34px;
	border: 1px solid #a7bccf;
	font-size: 14px;
}
.textc2{
	width: 160px;
	height: 34px;
	line-height: 34px;
	border: 1px solid #a7bccf;
	font-size: 14px;
	text-indent: 1em;
	background:url(/apply/common/verifycode) no-repeat right #FFF;
}

.con_left tr {
	height: 56px;
}
.blue {
	color: #0da3e2;
}
.btns {
	width: 120px;
	height: 46px;
	background-color: #0da3e2;
	border: none;
	font-size: 18px;
	color: #fff;
	cursor: pointer;
}
</style>
</head>
<script>
//系统日期
// JavaScript Document
function RunGLNL(){
var today=new Date();
var d=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
var DDDD= today.getFullYear()+"年"+(today.getMonth()+1)+"月"+today.getDate()+"日 ";
//DDDD = DDDD+ d[today.getDay()];
DDDD =DDDD+ " " +  (CnDateofDateStr(today)); //显示农历
//DDDD = DDDD+SolarTerm(today); //显示二十四节气
document.write(DDDD);
}
function DaysNumberofDate(DateGL){
return parseInt((Date.parse(DateGL)-Date.parse(DateGL.getFullYear()+"/1/1"))/86400000)+1;
}
function CnDateofDate(DateGL){
var CnData=new Array(
0x16,0x2a,0xda,0x00,0x83,0x49,0xb6,0x05,0x0e,0x64,0xbb,0x00,0x19,0xb2,0x5b,0x00,
0x87,0x6a,0x57,0x04,0x12,0x75,0x2b,0x00,0x1d,0xb6,0x95,0x00,0x8a,0xad,0x55,0x02,
0x15,0x55,0xaa,0x00,0x82,0x55,0x6c,0x07,0x0d,0xc9,0x76,0x00,0x17,0x64,0xb7,0x00,
0x86,0xe4,0xae,0x05,0x11,0xea,0x56,0x00,0x1b,0x6d,0x2a,0x00,0x88,0x5a,0xaa,0x04,
0x14,0xad,0x55,0x00,0x81,0xaa,0xd5,0x09,0x0b,0x52,0xea,0x00,0x16,0xa9,0x6d,0x00,
0x84,0xa9,0x5d,0x06,0x0f,0xd4,0xae,0x00,0x1a,0xea,0x4d,0x00,0x87,0xba,0x55,0x04
);
var CnMonth=new Array();
var CnMonthDays=new Array();
var CnBeginDay;
var LeapMonth;
var Bytes=new Array();
var I;
var CnMonthData;
var DaysCount;
var CnDaysCount;
var ResultMonth;
var ResultDay;
var yyyy=DateGL.getFullYear();
var mm=DateGL.getMonth()+1;
var dd=DateGL.getDate();
if(yyyy<100) yyyy+=1900;
  if ((yyyy < 1997) || (yyyy > 2020)){
    return 0;
    }
  Bytes[0] = CnData[(yyyy - 1997) * 4];
  Bytes[1] = CnData[(yyyy - 1997) * 4 + 1];
  Bytes[2] = CnData[(yyyy - 1997) * 4 + 2];
  Bytes[3] = CnData[(yyyy - 1997) * 4 + 3];
  if ((Bytes[0] & 0x80) != 0) {CnMonth[0] = 12;}
  else {CnMonth[0] = 11;}
  CnBeginDay = (Bytes[0] & 0x7f);
  CnMonthData = Bytes[1];
  CnMonthData = CnMonthData << 8;
  CnMonthData = CnMonthData | Bytes[2];
  LeapMonth = Bytes[3];
for (I=15;I>=0;I--){
    CnMonthDays[15 - I] = 29;
    if (((1 << I) & CnMonthData) != 0 ){
      CnMonthDays[15 - I]++;}
    if (CnMonth[15 - I] == LeapMonth ){
      CnMonth[15 - I + 1] = - LeapMonth;}
    else{
      if (CnMonth[15 - I] < 0 ){CnMonth[15 - I + 1] = - CnMonth[15 - I] + 1;}
      else {CnMonth[15 - I + 1] = CnMonth[15 - I] + 1;}
      if (CnMonth[15 - I + 1] > 12 ){ CnMonth[15 - I + 1] = 1;}
    }
  }
  DaysCount = DaysNumberofDate(DateGL) - 1;
  if (DaysCount <= (CnMonthDays[0] - CnBeginDay)){
    if ((yyyy > 1901) && (CnDateofDate(new Date((yyyy - 1)+"/12/31")) < 0)){
      ResultMonth = - CnMonth[0];}
    else {ResultMonth = CnMonth[0];}
    ResultDay = CnBeginDay + DaysCount;
  }
  else{
    CnDaysCount = CnMonthDays[0] - CnBeginDay;
    I = 1;
    while ((CnDaysCount < DaysCount) && (CnDaysCount + CnMonthDays[I] < DaysCount)){
      CnDaysCount+= CnMonthDays[I];
      I++;
    }
    ResultMonth = CnMonth[I];
    ResultDay = DaysCount - CnDaysCount;
  }
  if (ResultMonth > 0){
    return ResultMonth * 100 + ResultDay;}
  else{return ResultMonth * 100 - ResultDay;}
}
function CnYearofDate(DateGL){
var YYYY=DateGL.getFullYear();
var MM=DateGL.getMonth()+1;
var CnMM=parseInt(Math.abs(CnDateofDate(DateGL))/100);
if(YYYY<100) YYYY+=1900;
if(CnMM>MM) YYYY--;
YYYY-=1864;
return CnEra(YYYY)+"年";
}
function CnMonthofDate(DateGL){
var  CnMonthStr=new Array("零","正","二","三","四","五","六","七","八","九","十","冬","腊");
var  Month;
  Month = parseInt(CnDateofDate(DateGL)/100);
  if (Month < 0){return "闰" + CnMonthStr[-Month] + "月";}
  else{return CnMonthStr[Month] + "月";}
}
function CnDayofDate(DateGL){
var CnDayStr=new Array("零",
    "初一", "初二", "初三", "初四", "初五",
    "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五",
    "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五",
    "廿六", "廿七", "廿八", "廿九", "三十");
var Day;
  Day = (Math.abs(CnDateofDate(DateGL)))%100;
  return CnDayStr[Day];
}
function DaysNumberofMonth(DateGL){
var MM1=DateGL.getFullYear();
    MM1<100 ? MM1+=1900:MM1;
var MM2=MM1;
    MM1+="/"+(DateGL.getMonth()+1);
    MM2+="/"+(DateGL.getMonth()+2);
    MM1+="/1";
    MM2+="/1";
return parseInt((Date.parse(MM2)-Date.parse(MM1))/86400000);
}
function CnEra(YYYY){
var Tiangan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
//var Dizhi=new Array("子(鼠)","丑(牛)","寅(虎)","卯(兔)","辰(龙)","巳(蛇)",
                    //"午(马)","未(羊)","申(猴)","酉(鸡)","戌(狗)","亥(猪)");
var Dizhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
return Tiangan[YYYY%10]+Dizhi[YYYY%12];
}
function CnDateofDateStr(DateGL){
  if(CnMonthofDate(DateGL)=="零月") return "　请调整您的计算机日期!";
  else return "农历 "+CnYearofDate(DateGL)+ " " + CnMonthofDate(DateGL) + CnDayofDate(DateGL);
}
function SolarTerm(DateGL){
  var SolarTermStr=new Array(
        "小寒","大寒","立春","雨水","惊蛰","春分",
        "清明","谷雨","立夏","小满","芒种","夏至",
        "小暑","大暑","立秋","处暑","白露","秋分",
        "寒露","霜降","立冬","小雪","大雪","冬至");
  var DifferenceInMonth=new Array(
        1272060,1275495,1281180,1289445,1299225,1310355,
        1321560,1333035,1342770,1350855,1356420,1359045,
        1358580,1355055,1348695,1340040,1329630,1318455,
        1306935,1297380,1286865,1277730,1274550,1271556);
  var DifferenceInYear=31556926;
  var BeginTime=new Date(1901/1/1);
  BeginTime.setTime(947120460000);
     for(;DateGL.getFullYear()<BeginTime.getFullYear();){
        BeginTime.setTime(BeginTime.getTime()-DifferenceInYear*1000);
     }
     for(;DateGL.getFullYear()>BeginTime.getFullYear();){
        BeginTime.setTime(BeginTime.getTime()+DifferenceInYear*1000);
     }
     for(var M=0;DateGL.getMonth()>BeginTime.getMonth();M++){
        BeginTime.setTime(BeginTime.getTime()+DifferenceInMonth[M]*1000);
     }
     if(DateGL.getDate()>BeginTime.getDate()){
        BeginTime.setTime(BeginTime.getTime()+DifferenceInMonth[M]*1000);
        M++;
     }
     if(DateGL.getDate()>BeginTime.getDate()){
        BeginTime.setTime(BeginTime.getTime()+DifferenceInMonth[M]*1000);
        M==23?M=0:M++;
     }
  var JQ="二十四节气";
  if(DateGL.getDate()==BeginTime.getDate()){
    JQ+="    今日 <font color='#598F03'><b>"+SolarTermStr[M] + "</b></font>";
  }
  else if(DateGL.getDate()==BeginTime.getDate()-1){
    JQ+="　 明日 <font color='#598F03'><b>"+SolarTermStr[M] + "</b></font>";
  }
  else if(DateGL.getDate()==BeginTime.getDate()-2){
    JQ+="　 后日 <font color='#598F03'><b>"+SolarTermStr[M] + "</b></font>";
  }
  else{
   JQ=" 二十四节气";
   if(DateGL.getMonth()==BeginTime.getMonth()){
      JQ+=" 本月";
   }
   else{
     JQ+=" 下月";
   }
   JQ+=BeginTime.getDate()+"日"+"<font color='#598F03'><b>"+SolarTermStr[M]+"</b></font>";
  }
return JQ;
}



// 设置为主页
function SetHome(obj,vrl)
{
	try
	{
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);

	}catch(e)
	{
		if(window.netscape)
		{
			try
			{
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}catch (e)
			{
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage',vrl);
		}else
		{
			alert("您的浏览器不支持，请按照下面步骤操作：1.打开浏览器设置。2.点击设置网页。3.输入："+vrl+"点击确定。");
		}
	}
}
// 加入收藏 兼容360和IE6
function shoucang(sTitle,sURL)
{
try
{
window.external.addFavorite(sURL, sTitle);
}
catch (e)
{
try
{
window.sidebar.addPanel(sTitle, sURL, "");
}
catch (e)
{
alert("加入收藏失败，请使用Ctrl+D进行添加");
}
}
}
</script>
<body>
<div id="Body">
    <div id="Header"><!--{section:15111025}-->
        <div class="header-top">
            <div class="header-top-con"> <img class="headerBgImg" src="../imagesxxc/headerimg.png"/>
                <div style="float:left;text-align:left;line-height:35px;font-size:12px;padding-left:10px">&nbsp;&nbsp;&nbsp;</div>
                <div class="header-top-right"><em><script>RunGLNL()</script></em></div>
            </div>
        </div>
    </div>
    <div id="Content">
        <div id="Content1">
            <div class="logo_img"><img src="../imagesxxc/logl.jpg"></div>
            <div class="login_con">
                <div class="con_left">
                    <form action="/apply/memapp/doLogin" method="post" name="aForm" id="aForm" >
                        <table border="0">
                            <tbody>
                                <tr >
                                    <td class="logpic"><span>身份证号：</span></td>
                                    <td style="text-align:left"><input id="idCard" name="idCard" class="input" size="20" placeholder="请输入身份证号码" maxlength="18"></td>
                                </tr>
                                <tr>
                                    <td class="logpic"><span>登录密码：</span></td>
                                    <td style="text-align:left"><input id="password" name="password" class="input" type="password" size="20" placeholder="请输入密码" maxlength="20"></td>
                                </tr>
		                      <tr>
		                        <td class="logpic"><span>验证码：</span></td>
		                        <td style="text-align:left"><input maxlength="6" id="verifycode" name="verifycode" class="textc2"></td>
		                      </tr>
                                <tr>
                                    <td style="text-align:left;padding-left:80px" colspan="2">
                                        <span class="reg-a"><a href="memReg" class="blue" style="margin-left: 30px;">点击注册</a> </span>
                                        <span class="reg-a"><a href="forgetFront" class="blue" style="margin-left: 30px;">忘记密码</a> </span>
                                    </td>
                                </tr>
                                <tr id="logintr">
                                    <td>&nbsp;</td>
                                    <td style="padding-left:40px;padding-right:70px">
                                    	<input name="button2" type="button" value="登录" class="btns" onclick="loginDo()" style="cursor:pointer">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div class="con_right">
                    <div style="color:red;font-weight:bold;line-height:30px;margin-left:20px;padding-left:10px;">

				      		<br><br>所有考生（含以前参加过国家统考笔试的考生）报名前均需要重新进行注册、填报个人信息和上传个人照片。重新注册不影响考生已获得的笔试和面试成绩。


                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="Footer">
        <div class="footer">
            <div class="footer-bottom">
                <div class="copyright">
                    <div class="footer-nav">&nbsp;重要提示：请考生使用 IE 系列浏览器。如使用 IE11 浏览器，请将 neea.edu.cn 域名添加到兼容性站点列表中。<br>（操作如下：1.同时按键盘 ALT+X+B 三键，在弹出窗口中添加 neea.edu.cn 至兼容性站点列表中。2.重新访问报名网站。）</div>
                </div>
            </div>
        </div>
    </div>

</div>

</body>

<script type="text/javascript">



if('' == 'error')
{
	if('Y' == 'Y')
	{
		alert('证件号或密码错误！\\n注意：密码连续输错10次，账户将被锁定1小时！\\n提示：如忘记密码，可通过“密码保护问题”、“短信”、“客服”三种方式找回密码。')
	}else
	{
		alert('证件号或密码错误!')
	}

}else if('' == 'verifyerror')
{
	alert('验证码有误，请重新输入!')
}else if('' == 'lock')
{
	alert('由于密码连续输错10次，账户现在被锁定中...')
}
document.getElementById("idCard").focus();

function checkForm()
{

	document.getElementById("idCard").value = trim(document.getElementById("idCard").value)
	if(document.getElementById("idCard").value=="")
	{
		alert('证件号码不能为空');
		return false;
	}
	document.getElementById("password").value = trim(document.getElementById("password").value)
	if(document.getElementById("password").value=="")
	{
		alert('登录密码不能为空');
		return false;
	}
	 if(''!= '' || 'n9qe' != ''){
	if(document.getElementById("verifycode").value=="")
	{
		alert('验证码不能为空');
		return false;
	}
	 }
	return true;

}

function loginDo()
{
	if(checkForm())
	{
		aForm.submit();
	}
}

function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}


</script>

</html>
`);

    } else {
        document.querySelectorAll("script")[2].remove();
    }


    // Your code here...
})();

function checkForm()
{

	document.getElementById("idCard").value = trim(document.getElementById("idCard").value)
	if(document.getElementById("idCard").value=="")
	{
		alert('证件号码不能为空');
		return false;
	}
	document.getElementById("password").value = trim(document.getElementById("password").value)
	if(document.getElementById("password").value=="")
	{
		alert('登录密码不能为空');
		return false;
	}
	 if(''!= '' || 'n9qe' != ''){
	if(document.getElementById("verifycode").value=="")
	{
		alert('验证码不能为空');
		return false;
	}
	 }
	return true;

}

function loginDo()
{
	if(checkForm())
	{
		aForm.submit();
	}
}

function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
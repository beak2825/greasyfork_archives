// ==UserScript==
// @name ZQGJ自动填健康卡
// @description 自动填健康卡
// @version ver0.002
// @namespace www.wjx.top
// @match *://www.wjx.top/m/*
// @grant unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/400523/ZQGJ%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%81%A5%E5%BA%B7%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/400523/ZQGJ%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%81%A5%E5%BA%B7%E5%8D%A1.meta.js
// ==/UserScript==


//该代码只是让你减少重复选项的录入。健康卡内容请自己如实填写，如瞒报、错报造成问题的，责任自负。


//获取当前日期
var day2 = new Date();
day2.setTime(day2.getTime());
var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();

//1、填报日期
document.getElementById("q1").value = s2

//2.姓名
document.getElementById("q2").value = "XXX"

//3、性别
document.getElementById("q3_1").checked = true;		//男的用这两行
$("#q3_1").next().first().attr("class","jqradio jqchecked")	//男的用这两行,这行代码是为了显示这个选项是被选中了，否则即使选中了，也不显示选中状态。你改为其它选项时，这个q3_1也要改为对应题目的选项名

//document.getElementById("q3_2").checked = true;		//女的用这行,把行前面的//删除即可，上面行男的加上//
//$("#q3_2").next().first().attr("class","jqradio jqchecked")


//第4、第5题设置了只有一个选项的，不用管


//6.目前职业。   
//document.getElementById("q6_1").checked = true;		//在校学生
document.getElementById("q6_2").checked = true;		//院校教职工
//document.getElementById("q6_3").checked = true;		//其他职业

//7.手机号码是
document.getElementById("q7").value = "138888888";

//8.出生日期
document.getElementById("q8").value = "1978-05-15";

//9.籍贯
document.getElementById("q9").value = "广东-云浮市-罗定市";		//自己先在网页选一次，然后一模一样抄过来

//10.你目前的家庭住址
document.getElementById("q10_0").value = "广东-肇庆市-端州区";			
document.getElementById("q10_1").value = "前进南路xxxxxxx";

//11.体温自己选吧


//12.寒假是否有外出旅游
document.getElementById("q12_1").checked = true;		//是
$("#q12_1").next().first().attr("class","jqradio jqchecked")	//这行代码是为了显示这个选项是被选中了，否则即使选中了，也不显示选中状态
$("#q12_1").click()

//document.getElementById("q12_2").checked = true;		//否

//13、寒假外出时间
document.getElementById("q13_0").value = "2020-01-20";	//出发时间
document.getElementById("q13_1").value = "2020-01-21";	//返肇时间

//14、寒假外出旅游地
document.getElementById("q14").value = "广东-广州";		//自己先在网页选一次，然后一模一样抄过



//16、您和家人有无与新冠肺炎确诊接触情况(单选题*必答)
//document.getElementById("q16_1").checked = true;		//有，已向有关部门报备
//document.getElementById("q16_2").checked = true;		//有，但未向有关部门报备
document.getElementById("q16_3").checked = true;		//无
$("#q16_3").next().first().attr("class","jqradio jqchecked")	//显示选中

//17. 您和家人有无与新冠肺炎疑似病例接触情况(单选题*必答)（若答案为“有，已向有关部门报备”或“有，但未向有关部门报备”，则需回答第18题，若为“无”，则直接回答第19题）
//document.getElementById("q17_1").checked = true;		//有，已向有关部门报备
//document.getElementById("q17_2").checked = true;		//有，但未向有关部门报备
document.getElementById("q17_3").checked = true;		//无
$("#q17_3").next().first().attr("class","jqradio jqchecked")	//显示选中状态


//18. 您的家人临床异常表现情况。按下面格式，每个家庭成员一行：
//document.getElementById("q18").value = "自己写内容";


//19. 您和家人在寒假期间是否有接触“两史”人员（“两史”人员指疫情重点地区旅行史、暴露史或与重点疫情地区人员接触史）(单选题*必答)（若答案为“是”，则需继续回答第20题；若“否”，则结束答题）
//document.getElementById("q19_1").checked = true;		//是
document.getElementById("q19_2").checked = true;		//否
$("#q19_2").next().first().attr("class","jqradio jqchecked")

//20. 所接触“两史”人员情况，第个人一行，格式如下：接触人员姓名，电话，临床异常表现情况
//document.getElementById("q20").value = "自己写内容";
  

// ==UserScript==
// 远程调用代码 ：   https://greasyfork.org/scripts/441509-dgsxjs/code/dgsxjs.user.js
//  <script src="https://greasyfork.org/scripts/441509-dgsxjs/code/dgsxjs.user.js<?php echo "?v=".rand(1,10000);?>"></script>
// @name            dgsxjs
// @namespace       moe.canfire.flf

// @description     顶岗实习平台js
// @author          mengzonefire
// @license         MIT
// @match           *
 
// @resource jquery         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @version 0.0.1.20220318144626
// @downloadURL https://update.greasyfork.org/scripts/441509/dgsxjs.user.js
// @updateURL https://update.greasyfork.org/scripts/441509/dgsxjs.meta.js
// ==/UserScript==

 
//找不到函数定义的解决方法
/*
不要用 function test(){};
而要： "use strict";
test=function(){ };或 String.test=function(){}; 
*/
var nowDate = new Date();
var cloneNowDate = new Date();

var fullYear = nowDate.getFullYear();
var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
var date = nowDate.getDate();

var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天

// 格式化日期 (2016-02-14)
function getFullDate(targetDate) {
    var D, y, m, d;
    if (targetDate) {
        D = new Date(targetDate);
        y = D.getFullYear();
        m = D.getMonth() + 1;
        d = D.getDate();
    } else {
        y = fullYear;
        m = month;
        d = date;
    }
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;

    return y + '-' + m + '-' + d;
}

// 一天的时间戳(毫秒为单位)
var timestampOfDay = 1000*60*60*24;

// 今天，昨天
var fullToday = getFullDate();
var fullYesterday = getFullDate(nowDate - timestampOfDay);

var nowDay = nowDate.getDay(); // getDay 方法返回0 表示星期天
nowDay = nowDay === 0 ? 7 : nowDay;

// 本周一，本周末(星期天)
// 注：在safari下（nowDate +- 0）不会转换为时间戳，这里在nowDate前加上运算符+，手动转换时间戳运算
var fullMonday = getFullDate( +nowDate - (nowDay-1)*timestampOfDay );
var fullSunday = getFullDate( +nowDate + (7-nowDay)*timestampOfDay );

// 月初，月末
var fullStartOfMonth = getFullDate( cloneNowDate.setDate(1) );
var fullEndOfMonth = getFullDate( cloneNowDate.setDate(endOfMonth) );

 
var strfunc={
 getBefore:function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return '';
  return sourcestr.substr(0,p);
},
 getAfter:function(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return sourcestr;
  return sourcestr.substr(p+str.length);
},
getBetween:function(fullstr,str1,str2){
   //注意转义问题
   return  this.getBefore( this.getAfter(fullstr,str1)+str2,str2);
}//   
}

function getFirstDayOfWeek (date) {//星期几
    var day = date.getDay() || 7;
    return day;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
};

window.chatQQ=function(qqno){
   window.location.href="mqqwpa://im/chat?chat_type=wpa&uin="+qqno+"&version=1&src_type=web&web_src=https://blog.csdn.net/jstzjjk";
}
window.chatPhone=function(Phone){
   window.location.href="tel:"+Phone;
}
window.dosetting=function(){
  var defaulttxt='stuno=1907450843,stuname=章洁,qq=99,phone=88;stuno=1707451301,stuname=曹自强,qq=99,phone=88;';
  if( (window.localStorage.namelist+'').length<20 )window.localStorage.namelist=defaulttxt;
  window.localStorage.namelist= prompt('按格式输入学生信息列表',window.localStorage.namelist);
   doExtraList();
}
function date_formate(){

}
function date_isBigThan(bigDate,littleDate){
    //日期是否大于另一日期 标准格式 2022/03/15
    bigDate=bigDate.replace(/-/g,"/");//把日期字符串转换成日期格式
    littleDate=littleDate.replace(/-/g,"/");
        var oDatebig = new Date(bigDate);
        var oDatelittle = new Date(littleDate);
       //  console.log(oDatebig.getTime()+'   '+ oDatelittle.getTime()  );
        if (oDatebig.getTime() >= oDatelittle.getTime()) return true;
        else         return false;
}

function date_isBetween(aDate,dateBegin,dateEnd){//日期是否在某个日期之间
  if( (date_isBigThan(aDate,dateBegin))&&(date_isBigThan(dateEnd,aDate)) ) {
      return true;
  }
  return false;
}
function date_AddDays(dateStr,dayCount) {//日期加减天数
   var tempDate=new Date(dateStr.replace(/-/g,"/"));//把日期字符串转换成日期格式
   var resultDate=new Date((tempDate/1000+(86400*dayCount))*1000);//增加n天后的日期
   var resultDateStr=resultDate.getFullYear()+"-"+(resultDate.getMonth()+1)+"-"+(resultDate.getDate());//将日期转化为字符串格式
   return resultDateStr;
}
 
 var reportlist;
  //上周1,上周末
 var lastMonday=date_AddDays(fullMonday,-7);
 var lastSunday=date_AddDays(fullSunday,-7)
 //本周1,本周末
//fullMonday,fullSunday
 console.log( date_isBigThan("2022-03-14","2022-03-14")  );
 console.log( "上周："+lastMonday+","+lastSunday  );
 console.log( "本周："+fullMonday+","+fullSunday  );

 

var txt=`
序号	班级	学号	姓名	QQ	手机
1	19会计3+3	1905400127	袁子奕	1041393603	13141987663
2	19会计3+3	1905400126	杨蓉	2569998080	18305260550
3	19会计3+3	1905400125	杨凌	2796089024	13952683400
4	19会计3+3	1905400128	翟晶静	2822937893	18651140747
5	19物流	1911100127	王一凡	840273902	19852198110
6	19物流管理	1907450843	章洁	1743793882	18068910985
7	19物流	1907510134	张士洁	2482259587	18551448409
8	19营销	1707451301	曹自强	3133834016	17712702017
9	19营销社招	S2005170111	蒋文雅	1256508414	17606160270

`;


 
function hangNameList_fromStorage(){
        // console.log( window.localStorage.getItem('rawExcelTable') );
        window.rawExcelTable=''+window.localStorage.getItem('rawExcelTable');
        window.rawExcelTable=window.rawExcelTable.replace(/\n/g,';');
	    window.rawExcelTable=window.rawExcelTable.replace(/\r/g,';');
	    window.rawExcelTable=window.rawExcelTable.replace(/;;/g,';');
        window.rawExcelTable=window.rawExcelTable.replace(/\t/g,',');
        window.localStorage.setItem('rawExcelTable',rawExcelTable);
        var studentlist=jstr.excelTable2json(window.rawExcelTable,'no,class,stuno,stuname,qq,phone',2);
        //console.log( studentlist );
        //把名单挂起来;
        var el=jfloatDiv.show('namelist');
        var html='';
        for(let key in studentlist){
            var stuinfo=studentlist[key];
            html=html+`<div id="stuno_${stuinfo.stuno}"
style="border:1px solid silver;color:blue;background:fuchsia;">
<a href="mqqwpa://im/chat?chat_type=wpa&uin=${stuinfo.qq}&version=1&src_type=web&web_src=https://blog.csdn.net/jstzjjk">${stuinfo.stuname}</a>
&nbsp;
<a href="tel://${stuinfo.phone}">phone</a>

</div>`;
        }
//<span style="cursor:pointer;" onclick="window.chatQQ( ${stuinfo.qq} )">QQ</span>&nbsp;
//<span style="cursor:pointer;" onclick="window.chatPhone(${stuinfo.phone})">Tel</span>&nbsp;
        el.innerHTML=`<div style="color:green;font-weight:bold;border:1px solid red;" onclick="resetNameList()">重置名单</div><thisweek><div style="color:green;font-weight:bold;">本周</div>${html}</thisweek><lastweek><div style="color:green;font-weight:bold;">上周</div>${html}</lastweek>`;
 
}

function resetNameList(){
    jwidget.inputdialog.show('fsf','注意','请输入：',window.rawExcelTable,'90%','70%;',function(btncaption,inputvalue){
        window.localStorage.setItem('rawExcelTable',inputvalue);
        hangNameList_fromStorage();
    });    
}
function getReportedList(){
 // console.log('=============');
 console.log(thisweekReport);
 var thisweekReport=JSON.parse(window.localStorage.getItem('thisweekReport'));
 var lastweekReport=JSON.parse(window.localStorage.getItem('lastweekReport'));
 if('undefined,null'.indexOf(typeof(thisweekReport))) thisweekReport={};
 if('undefined,null'.indexOf(typeof(thisweekReport))) lastweekReport={};
 
//与汇报信息比对
var ss="#contentoverflow .listbox___3jlbr";
 $(ss).each(function(){
     //
     $(this).children().eq(2).hide();
	 $(this).children().eq(3).hide();
     $(this).children().eq(4).hide();
     $(this).children().eq(5).hide();
     $(this).children().eq(8).hide(); 
$(this).children().eq(6).children().eq(0).hide();
$(this).children().eq(7).children().eq(0).hide();
     //第2行
     var stuinfo=$(this).children().eq(2).children().eq(1).text(); 
     var stuname=strfunc.getBefore(stuinfo,"[");
     var stuno=strfunc.getBetween(stuinfo,'[',']');
     var stuclass=$(this).children().eq(3).children().eq(1).text();
     var reportsite=$(this).children().eq(6).children().eq(1).text();
     var reportdate=$(this).children().eq(7).children().eq(1).text().substring(0,9).trim();

     //if(stuclass.indexOf('')==-1)
     $(this).children().eq(1).text(stuclass+' '+stuinfo);

     var datedesc="";
     var datehtml="";
     if( date_isBetween(reportdate,lastMonday,lastSunday) ) datedesc='上周';
     else if( date_isBetween(reportdate,fullMonday,fullSunday) ) datedesc='本周';
	 else  datedesc='更早';
      console.log(stuno +' '+stuname +' ' +  reportdate+' ' +  datedesc);
       var lastweekrange=lastMonday+lastSunday;
       lastweekrange=lastweekrange.replace(/[\/-]/g,'_');
       var thisweekrange=fullMonday+fullSunday;
       thisweekrange=thisweekrange.replace(/[\/-]/g,'_');

      // console.log( thisweekrange +'  '+lastweekrange);
	  console.log(datedesc);
      if(datedesc=='上周'){
          lastweekReport['stuno_'+stuno]='reported';
		  var datehtml=`<font color=red>${datedesc}</font>`;
      }
      if(datedesc=='本周'){
         thisweekReport['stuno_'+stuno]='reported';
		  var datehtml=`<font color=blue>${datedesc}</font>`;
     }
	  //移动未评阅
       $(this).children().eq(7).children().eq(1).html(reportdate+" "+datehtml+' '+$(this).children().eq(8).children().eq(1).html());
 })
 // console.log(thisweekReport);
 //   console.log('thisweekReport');
  window.localStorage.setItem('thisweekReport',JSON.stringify(thisweekReport) );
  window.localStorage.setItem('lastweekReport',JSON.stringify(lastweekReport) );

}

shownamelist=function(){
    hangNameList_fromStorage();//挂出所有名单列表
    getReportedList(); //获取已回复的情况；
   //更新名单列表的颜色，表示回复情况;
   var  thisweekReport=JSON.parse(window.localStorage.getItem('thisweekReport'));
   var  lastweekReport=JSON.parse(window.localStorage.getItem('lastweekReport'));

  for(var key in thisweekReport){
      var elms=document.querySelectorAll('thisweek #'+key);
      if(elms.length>0)
	  elms[0].style.cssText='border:1px solid silver;color:blue;background:lime;';
  }
//console.log(lastweekReport);
  for(var key in lastweekReport){
     var elms=document.querySelectorAll('lastweek #'+key);
     if(elms.length>0)elms[0].style.cssText='border:1px solid silver;color:blue;background:lime;';
   }

}//shownamelist


function apply(){
try{
   jfloatDiv.close('namelist');

 
  //如果是登录界面

  if(jstr.contains(window.location.href,'dgsxapp_new/#/login')){
     // window.shownamelist();
       //登录时清空，回复的记录；
       jtoast("默认密码： 工号后六位@tzpc");
       window.localStorage.removeItem('lastweekReport');
       window.localStorage.removeItem('thisweekReport');
       $('.loginlogo___8gYYY').hide();
      $('#vcode').attr('autocomplete', 'off'); 
  }
  //如果当前查看列表界面
  if(jstr.contains(window.location.href,'dgsxapp_new/#/teacher/DgsxxdJsSearch')){
     window.shownamelist();
  }
//回复界面简化
  if(jstr.contains(window.location.href,'teacher/DgsxxdJsSearch?title')){
$('.am-wingblank').hide();
$('.anticon').hide();

var ss=".changelistbox___1tzrS";
 $(ss).each(function(){
	 $(this).children().eq(0).hide();
      $(this).children().eq(1).hide();
	 
	 $(this).children().eq(2).hide();
     $(this).children().eq(3).hide();
	 $(this).children().eq(4).hide();
     $(this).children().eq(5).hide();
	 $(this).children().eq(6).hide();
	// $(this).children().eq(7).hide();
 
   var stuname=$(this).children().eq(0).children().eq(1).text();
   var stuclass=$(this).children().eq(1).children().eq(1).text();
   var stusite=$(this).children().eq(2).children().eq(1).text();
   var stujob=$(this).children().eq(3).children().eq(1).text();
   var datesubmit=$(this).children().eq(4).children().eq(1).text();
   var daterange1=$(this).children().eq(5).children().eq(1).text();
   var daterange2=$(this).children().eq(6).children().eq(1).text();
	 //alert(stuname+stuclass);
var html=`
 <div style="display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;">
 <div>${stuclass} ${stuname} </div> 
<div>${stusite}  ${daterange1}  </div> 
</div>
  `;
   $(this).children().eq(7).html( html);
 });
}
   }catch(e){} 
}

 
$(function(){

  apply();
 
})

  
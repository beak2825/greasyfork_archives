// ==UserScript==
// @name         志愿云，日期自动填写脚本
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @description  对4个日期框做数据同步，修改起始日期会默认对结束日期+7，同时会对“服务时间”框日期部分进行更新。
// @version      0.2.3
// @include      *://www.fjvs.org/app/opp/*
// @include      *://fj.zhiyuanyun.com/app/opp/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/389392/%E5%BF%97%E6%84%BF%E4%BA%91%EF%BC%8C%E6%97%A5%E6%9C%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389392/%E5%BF%97%E6%84%BF%E4%BA%91%EF%BC%8C%E6%97%A5%E6%9C%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
Date.prototype.Format=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

var Weekdiv = document.createElement('div') //创建div标签
Weekdiv.setAttribute('id',"Weekdiv");//定义标签ID
Weekdiv.style.display='inline-block';//设置显示方式
Weekdiv.style.color='white';//设置显示方式
Weekdiv.style.padding='0px 15px'
Weekdiv.style.fontWeight='bold'

var titileStringEL=document.getElementById('opp_name');
titileStringEL.parentNode.appendChild(Weekdiv)

var userV1=document.getElementById('opp_start_date');
var userV2=document.getElementById('opp_end_date');
var userV3=document.getElementById('opp_recruit_start_date');
var userV4=document.getElementById('opp_recruit_end_date');
var userOpp_date_desc=document.getElementById('opp_date_desc');

userV1.removeAttribute('readonly')
userV2.removeAttribute('readonly')
userV3.removeAttribute('readonly')
userV4.removeAttribute('readonly')
for(var i=0;i<4;i++){
    document.getElementById('jSelectDateContainer1').remove()
}
userV3.style.opacity='0.3';//灰色显示
userV4.style.opacity='0.3';//灰色显示

var userWeekDiv=document.getElementById('Weekdiv');
var titileStringDate
var startDate
var endDate

function getFormatedDate(str){
    var DateStr=str.split('-');
    return new Date(DateStr[0],DateStr[1]-1,DateStr[2]);
}
function getWeekDay(date){
    var weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var colors;
    switch(date.getDay()){
        case 0:
            colors='red'
            break;
        case 6:
            colors='green'
            break;
        default:
            colors='black'
            break;
    }
    Weekdiv.style.backgroundColor=colors;//设置显示方式
    return weekDay[date.getDay()];
}


function setAllDate(){
    titileStringDate=getFormatedDate(titileStringEL.value.match(/(\(=?)(\S*)(?=\))/)[2]);//拿到标题日期字符串并转为日期格式
    startDate=addDate(titileStringDate, -6);//初始化开始日期为结束前的6天
    endDate=addDate(startDate,6);//初始化结束日期为周六
    userV1.value=startDate.Format('yyyy-MM-dd')
    setOtherDate();//设置其余日期
    userOpp_date_desc.value=userOpp_date_desc.value.replaceAll(/\d{4}-\d{2}-\d{2}/g,titileStringDate.Format('yyyy-MM-dd'));
}

function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 0;
    }
    return new Date(date.valueOf()+ days * 24 * 60 * 60 * 1000);
}
function setOtherDate(){
    userV2.value=endDate.Format('yyyy-MM-dd')
    userV3.value=userV1.value
    userV4.value=userV2.value
    userWeekDiv.innerHTML=getWeekDay(titileStringDate);
}
titileStringEL.addEventListener('keyup',function(){setAllDate()});//注册事件
userV1.addEventListener('keyup',function(){userV3.value=userV1.value;setOtherDate()});//注册事件
userV2.addEventListener('keyup',function(){userV4.value=userV2.value});//注册事件

setAllDate();
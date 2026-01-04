// ==UserScript==
// @name         百度自定义
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  try to take over the world!
// @author       csg329
// @include           *www.baidu.com*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410142/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/410142/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==////https://ef.zhiweidata.com/

!(function() {
    $('div[class="title-text c-font-medium c-color-t"]').html(" 百度热榜|今天是"+format(new Date(),"yyyy年MM月dd日")+"("+getWeek(new Date())+"),"+isSingle());
    $('a[href="https://www.hao123.com"]').text('快递100-查件记录').attr("href","https://buyer.kuaidi100.com/");
    $('a[href="http://map.baidu.com"]').text('高德地图').attr("href","https://amap.com/");
    $('a[href="https://haokan.baidu.com/?sfrom=baidu-top"]').text('哔哩哔哩').attr("href","https://www.bilibili.com/");
    $('a[href="http://news.baidu.com"]').text('后续-新闻').attr("href","https://houxu.app/");
      $('a[href="http://xueshu.baidu.com"]').text('知微事见').attr("href","https://ef.zhiweidata.com/");
    //$('#qrcode').html($('#qrcode').html()+'<iframe name="kuaidi100" src="https://www.kuaidi100.com/frame/index.html" width="900" height="120" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="yes"></iframe>');
})();

function getDays(date1){
    var bb=new Date().getTime();  //返回1970到现在的秒数
    var atime=Date.parse(date1);    //返回1970到现在指定日期的秒数
    var c=bb-atime;
    var miao=c/1000;
    var fen=miao/60;
    var shi=fen/60;
    var day=shi/24;
    return day;
}

function isSingle(){
    var days=getDays("2019-10-7");//这周是小周
    var weeks=parseInt(days/7);
    return weeks%2==0?"单休":"双休";//"小周":"大周";
}

function getWeek(date){
var week=["周日","周一","周二","周三","周四","周五","周六"];
return week[date.getDay()];
}

function format(date,fmt){
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   }
    for(var k in o)   {
        if(new RegExp("("+ k +")").test(fmt))   {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   }}
    return fmt;
}
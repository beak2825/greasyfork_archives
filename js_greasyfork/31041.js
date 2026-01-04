// ==UserScript==
// @name	腾讯QQ邮箱自动扩容
// @description	腾讯QQ邮箱每90天可以扩容一次，此脚本用于可扩容时自动扩容
// @author	me
// @match	https://mail.qq.com/cgi-bin/today*
// @match	https://mail.qq.com/cgi-bin/quotaupdatelog*
// @version	2017.07.09.3
// @grant	none
// @namespace	d99057bd7439b8d4d423e56aa4ce522b
// @downloadURL https://update.greasyfork.org/scripts/31041/%E8%85%BE%E8%AE%AFQQ%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E6%89%A9%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/31041/%E8%85%BE%E8%AE%AFQQ%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E6%89%A9%E5%AE%B9.meta.js
// ==/UserScript==



// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//计算天数差的函数，通用
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
	var  aDate,  oDate1,  oDate2,  iDays  ;
	aDate  =  sDate1.split("-");
	oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);    //转换为12-18-2002格式
	aDate  =  sDate2.split("-");
	oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  ;
	iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);  //把相差的毫秒数转换为天数
	return  iDays;
}

// Run
(function (){
	if ( typeof(parent.g_uin) == "string" ) {
		var g_uin=parent.g_uin;
	} else {return;}
	if ( location.href.indexOf("mail.qq.com/cgi-bin/today") != -1 && typeof(parent.check_quotaup) != "number" ) {
		if ( document.body.innerHTML.indexOf("您是第0位无限容量用户") != -1 ) {
			var today=(new Date()).Format("yyyy-MM-dd");
			var sid=location.href.split("sid=")[1].split("&")[0];
			var thisurl='/cgi-bin/quotaupdatelog?sid='+sid+'&t=mailcleaner&s=clean5&loc=today,store,0,1';// +"&thisqq="+g_uin;
			var thishtml='<iframe width=1 height=1 style="display:none" src="'+thisurl+'"></iframe>';
			if ( localStorage["quotaupdate"+g_uin] === undefined || DateDiff(localStorage["quotaupdate"+g_uin],today) > 89 ) {
				parent.check_quotaup=1;
				//parent.document.getElementsByTagName("div")[0].innerHTML+=thishtml;
				location.href=thisurl;
			}
		}
	} else if ( location.href.indexOf("mail.qq.com/cgi-bin/quotaupdatelog") != -1 ) {
		if ( document.body.innerHTML.indexOf("您可以立即将邮箱容量") != -1 ) {
			setTimeout( function () {
				all_elem = document.getElementsByTagName("input");
				for (var i = 0; i < all_elem.length; i++) {
					if (all_elem[i].value.indexOf("立即免费扩容") != -1 ) {
						parent.quotauped=1;
						all_elem[i].click();
					}
				}
			},0);
		} else if ( document.body.innerHTML.indexOf("扩容后需隔3个月才可以再次扩容") != -1 ) {
			var thisday=document.getElementsByClassName("volumeBox")[document.getElementsByClassName("volumeBox").length-1].parentNode.parentNode.getElementsByTagName("td")[0].innerHTML;
			localStorage.setItem("quotaupdate"+g_uin,thisday);
			if ( typeof(parent.quotauped) != "number" ) {
				if ( typeof(parent.check_quotaup) == "number" ) {
					parent.check_quotaup=undefined;
					history.back();
				}
			} else if ( typeof(parent.quotauped) == "number" ) {
				parent.check_quotaup=undefined;
				parent.quotauped=undefined;
				var volumeboxtxt=document.getElementsByClassName("volumeBox")[document.getElementsByClassName("volumeBox").length-1].innerText;
				parent.showInfo("自动扩容成功，目前容量"+volumeboxtxt);
			}
		}
	}
})();
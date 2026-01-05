// ==UserScript==
// @name        The Pirate Bay Torrent Age Color
// @name:ar     The Pirate Bay Torrent Age Color
// @namespace   Majed Alotaibi
// @author      ماجد العتيبي
// @description Adds "age" column with colors on The Pirate Bay search results.
// @description:ar إضافة عمود لعمر التورنت بالألوان في موقع ذا بايرت بي
// @include     https://thepiratebay.*/search/*
// @include     https://thepiratebay.*/s*/*
// @include     https://pirateproxy.*/s*/*
// @include     https://piratebays.*/s*/*
// @include     https://piratebayproxy.*/s*/*
// @include     https://theproxybay.*/s*/*
// @version     1.0.2
// @require     https://code.jquery.com/jquery-1.11.3.js
// @grant       none
// @icon        
// @downloadURL https://update.greasyfork.org/scripts/23246/The%20Pirate%20Bay%20Torrent%20Age%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/23246/The%20Pirate%20Bay%20Torrent%20Age%20Color.meta.js
// ==/UserScript==

$(document).ready(function() {                        //عند إكتمال تحميل الصفحة 

//==============================================================================
//تغيير لون التورنت حسب العمر 

var CurrentYear = new Date().getFullYear()            //السنة الحالية
var CurrentMonth = new Date().getMonth() + 1;         //الشهر الحالي - يبدأ من 0
var CurrentDay = new Date().getDate();                //اليوم الحالي
var CurrentDate = new Date(CurrentMonth+'/'+CurrentDay+'/'+CurrentYear);
var SizeID = 0;                                      //معرف لخلية الحجم

$('.detDesc').each(function()
{
    
	var Description = $(this).text();                     //وصف التورنت
	var TorrentYearCell = '';                             //محتوى خلية عمر التورنت

	//تم رفعه اليوم
 	var patt = new RegExp(/Uploaded Today/i);   
	var isNew = patt.test(Description);
	//تم رفعه بالأمس
	patt = new RegExp(/Y-day/i);   
	var isYesterday = patt.test(Description);
	if (isNew == true) { 
		TorrentYearCell ='<td align="center"; bgcolor="#6aec19">Today !</td>'; 
	} else if (isYesterday == true) { 
		TorrentYearCell ='<td align="center"; bgcolor="#6aec19">Yesterday !</td>'; 
	} else {
		//إذا كان يحتوي ساعة ودقائق فقد تم رفعه هذه السنة
		var patt = new RegExp(/\d\d:\d\d/i);     //ex: 17:35    
		var isNew = patt.test(Description);
		if (isNew == true) { 
			//إيجاد الشهر
			var patt = new RegExp(/Uploaded (\d\d)-(\d\d).+/i);
			var MonthFound = patt.test(Description);
			if (MonthFound == true) { 
				var TorrentMonth = Description.replace(patt,"$1");    //الشهر
				var TorrentDay = Description.replace(patt,"$2");      //اليوم
				var Diff = CurrentMonth - TorrentMonth;               //الفرق بين الشهرين
				//تم الرفع في الشهر الحالي
				if (Diff == 0) {                                       
					var DiffDays = CurrentDay - TorrentDay;
					TorrentYearCell = '<td align="center"; bgcolor="#6aec19">'+DiffDays+' days</td>';
				//تم الرفع في الشهر السابق
				} else if (Diff == 1) {     
					var TorrentDate = new Date(TorrentMonth+'/'+TorrentDay+'/'+CurrentYear);
                    var TimeDiff = Math.abs(CurrentDate.getTime() - TorrentDate.getTime());
					var DiffDays = Math.ceil(TimeDiff / (1000 * 3600 * 24)); 			
					TorrentYearCell = '<td align="center"; bgcolor="#6aec19">'+DiffDays+' days</td>';
				//تم الرفع مابين شهرين إلى 6
				} else if (Diff >= 2 && Diff <= 6) {
					TorrentYearCell = '<td align="center"; bgcolor="#76db57">≈ '+Diff+' months</td>';
				//تم الرفع في السنة الحالية
				} else {
					TorrentYearCell = '<td align="center"; bgcolor="#43cbff">≈ '+Diff+' months</td>'; 
				}
			}
		}
	}
	
	//إذا تم رفعه في سنة أقدم
	var patt = new RegExp(/.+\d\d.{1}(\d\d\d\d).+/i);
	var YearFound = patt.test(Description);    //إيجاد السنة
	
	if (YearFound == true)                     //إذا وجد السنة
	{
		var TorrentYear = Description.replace(patt,"$1");	
		
		if ((CurrentYear - TorrentYear) == 1 ) {
			TorrentYearCell = '<td align="center"; bgcolor="#f9c525">'+TorrentYear+'</td>';
		} else if ((CurrentYear - TorrentYear) == 2 ) {
			TorrentYearCell = '<td align="center"; bgcolor="#f97a25">'+TorrentYear+'</td>';
		} else if ((CurrentYear - TorrentYear) == 3 ) {
			TorrentYearCell = '<td align="center"; bgcolor="#f97a25">'+TorrentYear+'</td>';
		} else if ((CurrentYear - TorrentYear) == 4 ) {
			TorrentYearCell = '<td align="center"; bgcolor="#f97a25">'+TorrentYear+'</td>';
		} else if (CurrentYear > TorrentYear ) {
			TorrentYearCell = '<td align="center"; bgcolor="#ff3939">'+TorrentYear+'</td>';
		}			
	}
	
	//--------------------------------------
	//إضافة حجم التورنت  
	if (Description.match("MiB")) { 
		var patt = new RegExp(/.+Size (\d+)[\.\d]*.{1}(\w+).+/i);   //مبسط بالميغابايت
	} else {
		var patt = new RegExp(/.+Size (\d+[\.\d]*).{1}(\w+).+/i);   //مفصل للجيجابايت
	}  
	var SizeFound = patt.test(Description); 
	if (SizeFound == true)
	{
		var TorrentSize = Description.replace(patt,"$1 $2");
		SizeID = SizeID + 1;
		//تغيير لون الخط حسب الحجم
		if ( TorrentSize.indexOf( 'MiB' ) > -1 ) {
			TorrentSize = '<font color="blue"; id="MySize'+SizeID+'">'+TorrentSize+'</font>';
		} else {
			TorrentSize = '<font color="brown"; id="MySize'+SizeID+'">'+TorrentSize+'</font>';
		}
		//$(this).append(' ' + TorrentSize);
		$(this).parent().after('<td align="center"; >'+TorrentSize+'</td>');
	}
	
	//إضافة خلية العمر قبل الحجم
	$(this).parent().after(TorrentYearCell);;
	
});
//=================================================================================================
//إضافة أعمدة للجدول
 $('#tableHead > tr > th:nth-child(2)').after('<th>Size ≈</th>');
 $('#tableHead > tr > th:nth-child(2)').after('<th>Age/Year</th>');
//=================================================================================================

});
// ==UserScript==
// @name         ixbt.com новости 2023
// @version      0.3
// @description	Простой дизайн, открытие новостей без открывания окна
// @author			Vladimir
// @match			https://www.ixbt.com/news/*
// @icon			https://www.google.com/s2/favicons?sz=64&domain=ixbt.com
// @require			https://code.jquery.com/jquery-3.1.0.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.32/sweetalert2.min.js
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_addStyle
// @grant			GM_registerMenuCommand
// @grant			GM.xmlHttpRequest
// @run-at			document-end
// @license			GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1031682
// @downloadURL https://update.greasyfork.org/scripts/477128/ixbtcom%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/477128/ixbtcom%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8%202023.meta.js
// ==/UserScript==
(function() {
	'use strict';
	const $ = window.jQuery,
		hostname = location.origin;
	GM_addStyle(`@import "https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.32/sweetalert2.min.css";@import "https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css";#swal2-html-container {font-size: 18px;}body, html {width: auto;font-size: 22px;padding-right: 0 !important }.item > a:visited {color: #8c0008;}li, ul {margin: 3px 0px;}.g-grid {margin: 0 25px;}.g-grid_column__big {width: auto;max-width: 1900px;margin: 0px;}.b-content__pagecontent, .branding .b-content__breadcrumbs {width: auto;max-width: 1900px;margin-left: 104px;}.b-content--wrapper {width: auto;max-width: 1900px;margin: 0px;}.vote.vote-count-positive .vote-count {color: #080 !important;font-size: 30px;}.b-num {height: auto;top: 0px;width: 32px;padding: 1px;line-height: initial;display: inline-table;font-size: 18px;}.comment .comment-info li.vote {top: -3px;}`);
	var get_url = location.href, get_full_url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
	if(/ixbt.com\/news\/[0-9]+\/[0-9]+\/[0-9]+\/$/i.test(get_url)) {
		async function ShowSweetAlertInfo(GetURL) {
			GM_addStyle(`#swal2-html-container > p {text-align: left;}`);
			function getInfo(GetURL) {
				return fetch(get_full_url + GetURL).then(response => {
					if (response.ok === true) {
						return response.text()
					} else {
						throw new error("HTTP status code" + response.status);
					}
				}).then(data => {
					const parser = new DOMParser();
					const get_data = parser.parseFromString(data, "text/html");
					return {
						get_header: get_data.body.querySelector("div.b-article__header"),
						get_content: get_data.body.querySelector("div.b-article__content")
					};
				}).catch(error => {
					console.error("IXBT Ошибка #" + i + "\nfunction getInfo(GetURL)\n" + error)
				});
			}
			getInfo(GetURL).then(result => {
				const show_header = result.get_header.innerHTML,
					  show_content = result.get_content.innerHTML
				Swal.fire({
					width: "1200px",
					html: show_header+show_content,
					showConfirmButton: false,
					showDenyButton: false,
					denyButtonText: 'Закрыть'
				});
			});
		}
		$('li.item').each(function(i, el) {
			var GetURL = $(el).find("a.item__text--title").attr('href'),
				Title = $(el).find("a.item__text--title")[0].innerText.toUpperCase(),
				Text = $(el).find("a.item__text--title")[0].innerHTML;
			$(el).find("a.item__text--title")[0].outerHTML = '<a href="javascript:void(0);" id="get_info_' + i + '" data-t="" class="item__text--title">'+Text+'</a>';
			$("a#get_info_" + i).click(async function () {await ShowSweetAlertInfo(GetURL,"");});
		});
	}
	!function(){var e,t,n,s=Date,i=s.prototype,r=s.CultureInfo,a=function(e,t){return t||(t=2),("000"+e).slice(-1*t)};i.clearTime=function(){return this.setHours(0),this.setMinutes(0),this.setSeconds(0),this.setMilliseconds(0),this},i.setTimeToNow=function(){var e=new Date;return this.setHours(e.getHours()),this.setMinutes(e.getMinutes()),this.setSeconds(e.getSeconds()),this.setMilliseconds(e.getMilliseconds()),this},s.today=function(){return(new Date).clearTime()},s.compare=function(e,t){if(isNaN(e)||isNaN(t))throw new Error(e+" - "+t);if(e instanceof Date&&t instanceof Date)return e<t?-1:e>t?1:0;throw new TypeError(e+" - "+t)},s.equals=function(e,t){return 0===e.compareTo(t)},s.getDayNumberFromName=function(e){for(var t=r.dayNames,n=r.abbreviatedDayNames,s=r.shortestDayNames,i=e.toLowerCase(),a=0;a<t.length;a++)if(t[a].toLowerCase()==i||n[a].toLowerCase()==i||s[a].toLowerCase()==i)return a;return-1},s.getMonthNumberFromName=function(e){for(var t=r.monthNames,n=r.abbreviatedMonthNames,s=e.toLowerCase(),i=0;i<t.length;i++)if(t[i].toLowerCase()==s||n[i].toLowerCase()==s)return i;return-1},s.isLeapYear=function(e){return e%4==0&&e%100!=0||e%400==0},s.getDaysInMonth=function(e,t){return[31,s.isLeapYear(e)?29:28,31,30,31,30,31,31,30,31,30,31][t]},s.getTimezoneAbbreviation=function(e){for(var t=r.timezones,n=0;n<t.length;n++)if(t[n].offset===e)return t[n].name;return null},s.getTimezoneOffset=function(e){for(var t=r.timezones,n=0;n<t.length;n++)if(t[n].name===e.toUpperCase())return t[n].offset;return null},i.clone=function(){return new Date(this.getTime())},i.compareTo=function(e){return Date.compare(this,e)},i.equals=function(e){return Date.equals(this,e||new Date)},i.between=function(e,t){return this.getTime()>=e.getTime()&&this.getTime()<=t.getTime()},i.isAfter=function(e){return 1===this.compareTo(e||new Date)},i.isBefore=function(e){return-1===this.compareTo(e||new Date)},i.isToday=function(){return this.isSameDay(new Date)},i.isSameDay=function(e){return this.clone().clearTime().equals(e.clone().clearTime())},i.addMilliseconds=function(e){return this.setMilliseconds(this.getMilliseconds()+e),this},i.addSeconds=function(e){return this.addMilliseconds(1e3*e)},i.addMinutes=function(e){return this.addMilliseconds(6e4*e)},i.addHours=function(e){return this.addMilliseconds(36e5*e)},i.addDays=function(e){return this.setDate(this.getDate()+e),this},i.addWeeks=function(e){return this.addDays(7*e)},i.addMonths=function(e){var t=this.getDate();return this.setDate(1),this.setMonth(this.getMonth()+e),this.setDate(Math.min(t,s.getDaysInMonth(this.getFullYear(),this.getMonth()))),this},i.addYears=function(e){return this.addMonths(12*e)},i.add=function(e){if("number"==typeof e)return this._orient=e,this;var t=e;return t.milliseconds&&this.addMilliseconds(t.milliseconds),t.seconds&&this.addSeconds(t.seconds),t.minutes&&this.addMinutes(t.minutes),t.hours&&this.addHours(t.hours),t.weeks&&this.addWeeks(t.weeks),t.months&&this.addMonths(t.months),t.years&&this.addYears(t.years),t.days&&this.addDays(t.days),this},i.getWeek=function(){var s,i,r,a,o,u,h;return e=e||this.getFullYear(),t=t||this.getMonth()+1,n=n||this.getDate(),t<=2?(h=(i=((s=e-1)/4|0)-(s/100|0)+(s/400|0))-(((s-1)/4|0)-((s-1)/100|0)+((s-1)/400|0)),r=0,a=n-1+31*(t-1)):(r=(h=(i=((s=e)/4|0)-(s/100|0)+(s/400|0))-(((s-1)/4|0)-((s-1)/100|0)+((s-1)/400|0)))+1,a=n+(153*(t-3)+2)/5+58+h),e=t=n=null,(u=a+3-(a+(o=(s+i)%7)-r)%7|0)<0?53-((o-h)/5|0):u>364+h?1:1+(u/7|0)},i.getISOWeek=function(){return e=this.getUTCFullYear(),t=this.getUTCMonth()+1,n=this.getUTCDate(),a(this.getWeek())},i.setWeek=function(e){return this.moveToDayOfWeek(1).addWeeks(e-this.getWeek())},s._validate=function(e,t,n,s){if(void 0===e)return!1;if("number"!=typeof e)throw new TypeError(e+" is not a Number.");if(e<t||e>n)throw new RangeError(e+" is not a valid value for "+s+".");return!0},s.validateMillisecond=function(e){return s._validate(e,0,999,"millisecond")},s.validateSecond=function(e){return s._validate(e,0,59,"second")},s.validateMinute=function(e){return s._validate(e,0,59,"minute")},s.validateHour=function(e){return s._validate(e,0,23,"hour")},s.validateDay=function(e,t,n){return s._validate(e,1,s.getDaysInMonth(t,n),"day")},s.validateMonth=function(e){return s._validate(e,0,11,"month")},s.validateYear=function(e){return s._validate(e,0,9999,"year")},i.set=function(e){return s.validateMillisecond(e.millisecond)&&this.addMilliseconds(e.millisecond-this.getMilliseconds()),s.validateSecond(e.second)&&this.addSeconds(e.second-this.getSeconds()),s.validateMinute(e.minute)&&this.addMinutes(e.minute-this.getMinutes()),s.validateHour(e.hour)&&this.addHours(e.hour-this.getHours()),s.validateMonth(e.month)&&this.addMonths(e.month-this.getMonth()),s.validateYear(e.year)&&this.addYears(e.year-this.getFullYear()),s.validateDay(e.day,this.getFullYear(),this.getMonth())&&this.addDays(e.day-this.getDate()),e.timezone&&this.setTimezone(e.timezone),e.timezoneOffset&&this.setTimezoneOffset(e.timezoneOffset),e.week&&s._validate(e.week,0,53,"week")&&this.setWeek(e.week),this},i.moveToFirstDayOfMonth=function(){return this.set({day:1})},i.moveToLastDayOfMonth=function(){return this.set({day:s.getDaysInMonth(this.getFullYear(),this.getMonth())})},i.moveToNthOccurrence=function(e,t){var n=0;if(t>0)n=t-1;else if(-1===t)return this.moveToLastDayOfMonth(),this.getDay()!==e&&this.moveToDayOfWeek(e,-1),this;return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(e,1).addWeeks(n)},i.moveToDayOfWeek=function(e,t){var n=(e-this.getDay()+7*(t||1))%7;return this.addDays(0===n?n+=7*(t||1):n)},i.moveToMonth=function(e,t){var n=(e-this.getMonth()+12*(t||1))%12;return this.addMonths(0===n?n+=12*(t||1):n)},i.getOrdinalNumber=function(){return Math.ceil((this.clone().clearTime()-new Date(this.getFullYear(),0,1))/864e5)+1},i.getTimezone=function(){return s.getTimezoneAbbreviation(this.getUTCOffset())},i.setTimezoneOffset=function(e){var t=this.getTimezoneOffset(),n=-6*Number(e)/10;return this.addMinutes(n-t)},i.setTimezone=function(e){return this.setTimezoneOffset(s.getTimezoneOffset(e))},i.hasDaylightSavingTime=function(){return Date.today().set({month:0,day:1}).getTimezoneOffset()!==Date.today().set({month:6,day:1}).getTimezoneOffset()},i.isDaylightSavingTime=function(){return this.hasDaylightSavingTime()&&(new Date).getTimezoneOffset()===Date.today().set({month:6,day:1}).getTimezoneOffset()},i.getUTCOffset=function(){var e,t=-10*this.getTimezoneOffset()/6;return t<0?(e=(t-1e4).toString()).charAt(0)+e.substr(2):"+"+(e=(t+1e4).toString()).substr(1)},i.getElapsed=function(e){return(e||new Date)-this},i.toISOString||(i.toISOString=function(){function e(e){return e<10?"0"+e:e}return'"'+this.getUTCFullYear()+"-"+e(this.getUTCMonth()+1)+"-"+e(this.getUTCDate())+"T"+e(this.getUTCHours())+":"+e(this.getUTCMinutes())+":"+e(this.getUTCSeconds())+'Z"'}),i._toString=i.toString,i.toString=function(e){var t=this;if(e&&1==e.length){var n=r.formatPatterns;switch(t.t=t.toString,e){case"d":return t.t(n.shortDate);case"D":return t.t(n.longDate);case"F":return t.t(n.fullDateTime);case"m":return t.t(n.monthDay);case"r":return t.t(n.rfc1123);case"s":return t.t(n.sortableDateTime);case"t":return t.t(n.shortTime);case"T":return t.t(n.longTime);case"u":return t.t(n.universalSortableDateTime);case"y":return t.t(n.yearMonth)}}return e?e.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g,(function(e){if("\\"===e.charAt(0))return e.replace("\\","");switch(t.h=t.getHours,e){case"hh":return a(t.h()<13?0===t.h()?12:t.h():t.h()-12);case"h":return t.h()<13?0===t.h()?12:t.h():t.h()-12;case"HH":return a(t.h());case"H":return t.h();case"mm":return a(t.getMinutes());case"m":return t.getMinutes();case"ss":return a(t.getSeconds());case"s":return t.getSeconds();case"yyyy":return a(t.getFullYear(),4);case"yy":return a(t.getFullYear());case"dddd":return r.dayNames[t.getDay()];case"ddd":return r.abbreviatedDayNames[t.getDay()];case"dd":return a(t.getDate());case"d":return t.getDate();case"MMMM":return r.monthNames[t.getMonth()];case"MMM":return r.abbreviatedMonthNames[t.getMonth()];case"MM":return a(t.getMonth()+1);case"M":return t.getMonth()+1;case"t":return t.h()<12?r.amDesignator.substring(0,1):r.pmDesignator.substring(0,1);case"tt":return t.h()<12?r.amDesignator:r.pmDesignator;case"S":return function(e){switch(1*e){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th"}}(t.getDate());default:return e}})):this._toString()}}();
	var pathArray = window.location.pathname.split('/');
	var data = pathArray[2] + "-" + pathArray[3] + "-" + pathArray[4];
	var day = new Date(Date.parse(data)).toString("yyyy/MM/dd");
	var dayp = new Date(Date.parse(data)).addDays(1).toString("yyyy/MM/dd");
	var daym = new Date(Date.parse(data)).addDays(-1).toString("yyyy/MM/dd");
	GM_addStyle(`.refresh_panel {font-size: 20px;position: fixed !important;z-index: 1060 !important;top: 400px !important;margin-left: -127px !important;background: #bbe2f7;border: 1px solid #76b7db;-webkit-border-radius: 2px;padding: 5px 5px;text-align: center;}a.nbtn {cursor: pointer;user-select: none;color: #fff;text-shadow: rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 1px 1px 1px;}a.nbtn:hover {color: #ffff00;}`);
	//console.log(dayp1,daym1);
	var set_buttons = document.querySelector("a.href_right, div.g-grid_column p");
	set_buttons.outerHTML = `
<div class="refresh_panel">
<a href="/news/${daym}/" class="nbtn"><b>НАЗАД</b></a><br>
<a onClick="window.location.reload();" class="nbtn"><b>ОБНОВИТЬ</b></a><br>
<a href="/news/${dayp}/" class="nbtn"><b>ВПЕРЁД</b></a>
</div>`;
})();
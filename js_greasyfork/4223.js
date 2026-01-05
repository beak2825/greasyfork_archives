// ==UserScript==
// @name       export app Annie
// @namespace annieExport
// @version    0.1
// @description  导出起点app评论内容
// @match      http://www.appannie.com/apps/ios/app/534174796/reviews/*
// @downloadURL https://update.greasyfork.org/scripts/4223/export%20app%20Annie.user.js
// @updateURL https://update.greasyfork.org/scripts/4223/export%20app%20Annie.meta.js
// ==/UserScript==
// thanks excellentexport by jmaister
var n=String.fromCharCode,p;a:{try{document.createElement("$")}catch(q){p=q;break a}p=void 0} window.btoa||(window.btoa=function(b){for(var g,c,f,h,e,a,d=0,r=b.length,s=Math.max,l="";d<r;){g=b.charCodeAt(d++)||0;c=b.charCodeAt(d++)||0;a=b.charCodeAt(d++)||0;if(255<s(g,c,a))throw p;f=g>>2&63;g=(g&3)<<4|c>>4&15;h=(c&15)<<2|a>>6&3;e=a&63;c?a||(e=64):h=e=64;l+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e)}return l}); window.atob||(window.atob=function(b){b=b.replace(/=+$/,"");var g,c,f,h,e=0,a=b.length,d=[];if(1===a%4)throw p;for(;e<a;)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),g=(g&63)<< 2|c>>4&3,c=(c&15)<<4|f>>2&15,f=(f&3)<<6|h&63,d.push(n(g)),c&&d.push(n(c)),f&&d.push(n(f));return d.join("")}); ExcellentExport=function(){function b(e,a){return e.replace(RegExp("{(\\w+)}","g"),function(d,e){return a[e]})}var g={excel:"data:application/vnd.ms-excel;base64,",csv:"data:application/csv;base64,"},c={excel:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\x3c!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--\x3e</head><body><table>{table}</table></body></html>'},f= ",",h="\r\n";return{excel:function(e,a,d){a=a.nodeType?a:document.getElementById(a);var f=g.excel;a=b(c.excel,{a:d||"Worksheet",table:a.innerHTML});a=window.btoa(window.unescape(encodeURIComponent(a)));e.href=f+a;return!0},csv:function(e,a,d,b){void 0!==d&&d&&(f=d);void 0!==b&&b&&(h=b);a=a.nodeType?a:document.getElementById(a);var c="",l,k;for(d=0;d<a.rows.length;d++){l=a.rows[d];for(b=0;b<l.cells.length;b++){k=l.cells[b];var c=c+(b?f:""),m=k.textContent.trim();k=m;var t=-1!==m.indexOf(f)||-1!==m.indexOf("\r")|| -1!==m.indexOf("\n");(m=-1!==m.indexOf('"'))&&(k=k.replace(/"/g,'""'));if(t||m)k='"'+k+'"';c+=k}c+=h}a=g.csv+window.btoa(window.unescape(encodeURIComponent(c)));e.href=a;return!0}}}();
var mynameSpace = {};
mynameSpace.pagesize = 50;
mynameSpace.done = false;
mynameSpace.current = window.location.search;

var intervaltimer;
mynameSpace.fetch = function(page_index){
	$.get('http://www.appannie.com/apps/ios/app/534174796/reviews/table/'+mynameSpace.current+'&page='+page_index+'&limit='+mynameSpace.pagesize,function(commentData){
        	$.each(commentData.data.rows,function(i,v){
				$('#export-data-custom').append("<tr><td>"+v.date+"</td><td>"+v.author+"</td><td>"+v.title+"</td><td>"+v.content+"</td><td>"+v.rating+"</td><td>"+v.version+"</td></tr>");
			});
			if(page_index*mynameSpace.pagesize<commentData.data.totalServerItems){
				mynameSpace.fetch(page_index+1);
			}else{
				mynameSpace.done = true;
				intervaltimer = setInterval(function(){
					if(mynameSpace.done=true){
						console.log('ok');
						$('<a download="somedata.xls" href="#" id="my-export" onclick="return ExcellentExport.excel(this, \'export-data-custom\', \'Sheet Name Here\');">Export to Excel</a>').prependTo('.right-align-controls');
						clearInterval(intervaltimer);
					}
				},1000);
			}
    },'json');
}


$(document).ready(function(){
    //$("<button download='somedata.xls'>export</button>").click(function(){
		mynameSpace.done = false;
		$("#export-data-custom").remove();
		$('body').append('<table id="export-data-custom" style="display:none;"><tr><td>日期</td><td>作者</td><td>标题</td><td>内容</td><td>评分</td><td>版本</td></table>');
        mynameSpace.fetch(1);
		that = this;
		
    //}).appendTo(".widget-addthis");
	
	
	setInterval(function(){
		if(mynameSpace.current!=window.location.search){
			mynameSpace.current = window.location.search;
			$('#my-export').remove();
			mynameSpace.done = false;
			mynameSpace.fetch(1);
		}
	},500);
});
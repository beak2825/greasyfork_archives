// ==UserScript==
// @name        山东大学勤工助学系统表格显示兼容脚本
// @namespace   https://github.com/liuycsd/shell-scripts/tree/master/user.js
// @description 显示山东大学勤工助学系统表格（仅支持列表显示，暂不支持排序导出等功能）
// @include     http://202.194.15.34:8000/*
// @version     0.2.1
// @grant       none
// @todo        rewrite using newer version of ActiveWidgets
// @downloadURL https://update.greasyfork.org/scripts/3260/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%8B%A4%E5%B7%A5%E5%8A%A9%E5%AD%A6%E7%B3%BB%E7%BB%9F%E8%A1%A8%E6%A0%BC%E6%98%BE%E7%A4%BA%E5%85%BC%E5%AE%B9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/3260/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%8B%A4%E5%B7%A5%E5%8A%A9%E5%AD%A6%E7%B3%BB%E7%BB%9F%E8%A1%A8%E6%A0%BC%E6%98%BE%E7%A4%BA%E5%85%BC%E5%AE%B9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
if(window.location.href.indexOf('http://202.194.15.34:8000/jiajiao.gg.do')>=0||window.location.href.indexOf('http://202.194.15.34:8000/xnqgzx.xn_dwzpxx.do')>=0||window.location.href.indexOf('http://202.194.15.34:8000/xnqgzx.xn_sqb.do')>=0){
	g='<tr style="border:1px solid;">';
	for (i=0;i<gridColumns.length;i++) g+='<th style="border:1px solid;">'+gridColumns[i]+'</th>';
	g+='</tr>';
	for(j=0;j<gridData.length;j++) {
		g+='<tr style="border:1px solid;">';
		for (i=0;i<gridData[j].length;i++) g+='<td style="border:1px solid;">'+gridData[j][i]+'</td>';
		g+='</tr>'
	}
	var otab= document.getElementsByTagName('table')[1];
	var gtab = document.createElement('table');
	gtab.innerHTML = g;
	gtab.style='border:1px solid;';
	otab.parentNode.insertBefore(gtab,otab);
}

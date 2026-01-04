// ==UserScript==
// @name         百度云文件数量统计
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  修订版
// @author       Brainiac
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/link*
// @match             *://yun.baidu.com/share/link*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371300/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%96%87%E4%BB%B6%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/371300/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%96%87%E4%BB%B6%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

/************
*百度查询接口
http://pan.baidu.com/api/list?
dir=				//查询目录
&num=100000			//分页大小 最大支持99999999999999 默认1000
&page=1				//页码
&order=time			//排序属性
&desc=1				//排序顺序
&clienttype=0
&showempty=0
************/



var root = "/";//指定目录，空取当前目录
var rootDir = "";//取当前目录
var maxPageSize=99999999999999; //最多支持这么多，超过此值报错
var dskApi="https://pan.baidu.com/api/list?order=name&desc=0&showempty=0&web=1&num="+maxPageSize+"&page=1&dir=";
var totalCount = 0;
var startTime = new Date();
var asyncType=false;//true 异步，false 同步

function timeSpan(stime, etime) {
	var usedTime = etime - stime;
	var days = Math.floor(usedTime / (24 * 3600 * 1000));
	var leave1 = usedTime % (24 * 3600 * 1000);
	var hours = Math.floor(leave1 / (3600 * 1000));
	var leave2 = leave1 % (3600 * 1000);
	var minutes = Math.floor(leave2 / (60 * 1000));
	var leave3 = leave2 % (60 * 1000);
	var seconds = Math.round(leave3 / 1000);
	var time ="";
	if(days>0)
	{
		time+=days+"天";
	}
	if(hours>0)
	{
		time+=hours+"小时";
	}
	if(minutes>0)
	{
		time+=minutes+"分钟";
	}

	time+=seconds+"秒";

    return time;
}

(function($){
    $.getUrlParam = function (name) {
        var search = document.location.hash;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
		return items;
    }
})(jQuery);

if(rootDir=="")
{
	rootDir = $.getUrlParam("path");
}

function GetFilesCount(fileLists)
{
	var count=0;

	if(fileLists==undefined)
	{
		return 0;
	}
	if(rootDir == "/")
		return 0;
	var ffList=fileLists.filter(function (e) { return e.isdir == 0; });
	if(ffList.length > 0 && ffList[0].path.indexOf(rootDir)!=-1)
		count=ffList.length;
	totalCount=totalCount+count;
	var ddList=fileLists.filter(function (e) { return e.isdir == 1; });
	var dl=ddList.length;
	if(dl>0)
	{
		for (var index=0; index<dl; index++) {
			if(ddList[index].path.indexOf(rootDir) ==-1 && rootDir.indexOf(ddList[index].path) ==-1)
				continue;
			(function(index) {
				var file=ddList[index];//%2B
				var filepath = file.path.replace(/\+/g,"\%2B");
				count=count+GetDirFilsCount(filepath);
			})(index);

		 }
	}
	return count;
}

function GetDirFilsCount(dirName)
{
	var dfCount=0;
	$.ajax({
		url: dskApi+''+dirName,
		type: 'get',
		async: asyncType,
		timeout: 3000,          // 设置超时时间
		success: function(data) {
			var fileLists = data.list;
			dfCount=GetFilesCount(fileLists);
	}
	});	
	return dfCount;
}
$(function(){
	setTimeout(function(){
		GetDirFilsCount(root);
		$("#layoutHeader a:contains('更多')").text($("#layoutHeader a:contains('更多')").text() + "——>统计目录["+decodeURIComponent(rootDir).substring(decodeURIComponent(rootDir).lastIndexOf("/")+1)+"]——总文件数["+totalCount+"]——用时[" +timeSpan(startTime, new Date())+"]");
	} ,2000);
})
})();
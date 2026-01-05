// ==UserScript==
// @name         Acfun导出
// @namespace    http://zhihaofans.com/
// @version      0.1.0
// @description  导出Acfun的部分用户数据
// @author       zhihaofans
// @match        http://www.aixifan.com/member/*
// @match        http://www.acfun.tv/member/*
// @grant        none
// @note         开源地址:https://github.com/zhihaofans/Acfun/blob/master/acfun.tv/AcExport/ac.export.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/22310
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/22310/Acfun%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/22310/Acfun%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
function StarPostExport2(arrays,page_a)
{
    $.getJSON('/member/collection.aspx?count=20&channelId=0&pageNo='+page_a, function (data_a) {
        console.log("page:"+data_a.page.pageNo);
        $.info("info", "正在导出:"+data_a.page.pageNo+"/"+data_a.totalpage+"页");
        $.each(data_a.contents, function(i, item_a) {
            console.log("ac"+item_a.cid);
            arrays.push("ac"+item_a.cid);
        });
        if(data_a.page.pageNo<data_a.totalpage)
        {
            StarPostExport2(arrays,data_a.page.nextPage,data_a.totalpage);
        }
        else
        {
            StarExportFinish(arrays);
        }
    });
}
function StarPostExport()
{
    $.info("warning", "开始导出收藏(稿件)。");
    console.log("开始导出收藏(稿件)。");
    var star=[];
    var page=1;
    $.getJSON('/member/collection.aspx?count=20&channelId=0&pageNo='+page, function (data){
        if(data.success===true)
        {
            var totalpage=data.totalpage;
            $.info("info", "稿件收藏数量:"+data.totalcount);
            $.info("info", "正在导出:"+data.page.pageNo+"/"+data.totalpage+"页");
            console.log("page:"+data.page.pageNo);
            $.each(data.contents, function(i, item) {
                console.log("ac"+item.cid);
                star.push("ac"+item.cid);
            });
            console.log(star);
            if(totalpage>1)
            {
                StarPostExport2(star,2,totalpage);
            }
            else
            {
                StarExportFinish(star);
            }
        }
        else
        {
            $.info("error", "导出失败，请登陆。");
            console.log("导出失败，请登陆。");
        }
    });
}
function StarExportFinish(star_a)
{
	console.log(star_a);
	var star_json=JSON.stringify(star_a);
	console.log("最后结果:");
	console.log(star_json);
	$.info("warning", "正在生成json数据");
	setTimeout(function(){
		prompt("请复制json数据",star_json);
		$.info("success", "导出成功。");
	}, 500);
}
$(document).ready(function(){
    $.info("info", "Acfun导出脚本开始载入");
	var aa='<div class="part-guide-left"><div class="banner"><a class="tab fixed" href="javascript:void(0)" id="star-export"><i class="icon icon-upload"></i><font color="#FF0000">导出收藏</font></a></div></div>';
    $("#list-guide-left").html(aa+"\n"+$("#list-guide-left").html());
	$.info("info", "载入完毕，点击'导出收藏'开始导出");
	$("#star-export").click(function(){
		switch(location.href)
		{
		case "http://"+location.hostname+"/member/#area=favourite":
			StarPostExport();
			break;
		case "http://"+location.hostname+"/member/#area=favourite-bangumi":
			$.info("error", "暂不支持剧集收藏导出。");
			break;
		case "http://"+location.hostname+"/member/#area=favourite-album":
			$.info("error", "暂不支持合辑收藏导出。");
			break;
		}
	});
});

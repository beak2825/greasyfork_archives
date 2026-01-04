// ==UserScript==
// @name         修改DLsite作品标题格式
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  非作品详情页，标题=作品名+RJ号。在作品详情页，标题=RJ号+社团名+（系列名）+作品名+声优。添加手动输入声优按钮与复制标题按钮。
// @author       LaprasC
// @match       *://www.dlsite.com/maniax/*
// @match       *://www.dlsite.com/home/*

// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/535103/%E4%BF%AE%E6%94%B9DLsite%E4%BD%9C%E5%93%81%E6%A0%87%E9%A2%98%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535103/%E4%BF%AE%E6%94%B9DLsite%E4%BD%9C%E5%93%81%E6%A0%87%E9%A2%98%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==
/*global $, confirm, console, GM_addStyle*/
(function() {
    'use strict';

    //非作品详情页
    $(".work_name>a").each(function(){
    var t=$(this);
        var name=t.text();
        var link=t.attr("href");
        var RJ=link.slice(link.indexOf("RJ"),link.indexOf(".html"));
       t.text(name+'  '+RJ);
    });




	//作品详情页
	if(window.location.href.indexOf("product_id")!=-1){



		var group=$(".maker_name").text();
        group=Trim(group);
		var b=$(".topicpath_item>a").length;
        b=b-1;
		var name=$(".topicpath_item>a:eq("+b+")>span").text();
		var rj;
		var str_name='';

		rj=$("#work_left").attr("data-product-id");
        rj=window.location.href;
        var p=rj.indexOf("RJ");
        rj=rj.slice(p,p+11);
        var p2=rj.indexOf(".");
        rj=rj.slice(0,p2);
		str_name+='('+rj+") ["+group+"] ";
        var series= GetSeries();
        if(series)
        {
           str_name+="["+series+"] ";
        }
       str_name+=name;
		var voice=GetVoice();
		if(voice)//有无声优信息，若无可手动添加
		{
			str_name+=' 【'+voice+'】';
			$('h1').html(str_name);
			AddCopyBtn(str_name);//复制文件名按钮
            AddPicBtn(str_name);
		}
		else
		{
			$('h1').html(str_name);
			InputCV();
            AddCopyBtn(str_name);
            AddPicBtn(str_name);
		}
        var link_HVDB="http://hvdb.me/Dashboard/WorkDetails/"+rj;
        $("h1").append('<a href="'+link_HVDB+'"><input type="button" value="HVDB"></a>');
        $("#work_outline>tbody").append('<tr><th>RJ号</th><td><a>'+rj+'</a></td>  </tr>');
        $("#work_outline>tbody").append('<tr><th>标题</th><td><a>'+name+'</a></td>  </tr>');
	}
})();

function Trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}



function GetSeries()//获取声优信息
{
    var series='';
    var a=$("#work_outline>tbody>tr:eq("+3+")>td>a:eq(1)").text();
    var b=$("#work_outline>tbody>tr").length;

    $("#work_outline>tbody>tr").each(function()
    {
        if($(this).find("th").text()=="シリーズ名" || $(this).find("th").text()=="系列名")
        {
            //series+=$(this).find("td>a:eq(0)").text();
            $(this).find("td>a").each(function(){series+=$(this).text()+' ';});
        }
    });
    series=series.slice(0,-1);
    return series;
}

function GetVoice()//获取声优信息
{
    var voice='';
    var a=$("#work_outline>tbody>tr:eq("+3+")>td>a:eq(1)").text();
    var b=$("#work_outline>tbody>tr").length;
    $("#work_outline>tbody>tr").each(function()
    {
        if($(this).find("th").text()=="声優" || $(this).find("th").text()=="声优")
        {
            //voice+=$(this).find("td>a:eq(0)").text();
            $(this).find("td>a").each(function(){voice+=$(this).text()+' ';});
        }
    });
    voice=voice.slice(0,-1);
    return voice;
}


function InputCV()//手动输入声优信息按钮，并复制添加声优信息后的文件名，若无输入则直接复制文件名
{
     var downloader_style = [
		'.CV {',
		'position: fixed;',
		'right: 1; bottom: 20;',
		'border: 1px solid gray;',
		'z-index:999}'
	 ];
	GM_addStyle(downloader_style.join(' '));

	var btn = [
		'<div class="CV">',
		'<input type="text" class="CV_Input" />',
		'<button type="button" class="CV_Btn">添加声优</button>',
		'</div>'
	 ];
	$('body').prepend(btn.join('\n'));


    $('.CV_Btn').on('click', function() {
         var cv=$('.CV_Input').val();

         var filename=$("#work_name").text();
         if(cv){
             filename=$("#work_name").text().slice(0,-12)+" 【"+cv+'】';
             //filename=Trim($("#work_name").text())+" 【"+cv+'】';
         }

         $("#work_name").text(filename);
          GM_setClipboard(filename);
        AddCopyBtn(filename);
            AddPicBtn(filename);

    });
}


function AddCopyBtn(filename)//复制文件名按钮
{
    var btn = [
   '<div class="Copy">',
    '<button type="button" class="Copy_Btn">复制标题</button>',
    '</div>'
    ];
    $('h1').append(btn.join('\n'));

    $('.Copy_Btn').on('click', function() {
         GM_setClipboard(filename);
    });
}

function AddPicBtn(filename)//下载封面
{
    var btn = [
   '<div class="Pic">',
    '<button type="button" class="Pic_Btn">下载封面</button>',
    '</div>'
    ];
    $('h1').append(btn.join('\n'));

    $('.Pic_Btn').on('click', function() {
        //alert($("#work_left>div>div>div:eq(0)").html());
        var pic=$("#work_left>div>div>div:eq(0)").html();
        var p1=pic.indexOf("data-src");
        var p2=pic.indexOf("jpg");
        pic=pic.slice(p1+12,p2+3);
        GM_setClipboard(filename);
        //alert(pic);
      GM_download("https://"+pic,filename+".jpg");
    }).get();

}
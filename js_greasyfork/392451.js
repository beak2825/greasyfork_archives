// ==UserScript==
// @name         轩轩运营工具箱
// @namespace    xuansir
// @version      V1127
// @description  描述暂时没有
// @author       xuansir
// @icon 		 data:image/png;base64,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
// @include      **.toutiao.**
// @include      **.ixigua.**
// @include      **.bilibili.com/video/**
// @include      **.baidu.**
// @include      **.tieba.**
// @include      **.cctv.**
// @include      **.cnbeta.**
// @include      **.ifanr.**
// @include      **news.qq.**
// @include      **36kr.com/p/**
// @include      **tmtpost.com/**
// @include      **content.bytedance.net/channel_hot/**、
// @include      **bytedance.net/**
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-end
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @downloadURL https://update.greasyfork.org/scripts/392451/%E8%BD%A9%E8%BD%A9%E8%BF%90%E8%90%A5%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/392451/%E8%BD%A9%E8%BD%A9%E8%BF%90%E8%90%A5%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==


///开始获取文章详情页地址CIAurl

    var str1 = window.location.href;
    var arr1 = str1.split("/");
    var groupid = arr1[3];
        groupid = groupid.substr(1,groupid.length-1)

    var CIAurl = "https://content.bytedance.net/detail/#/?item_type=pgc&item_id=" + groupid;

////结束开始获取文章详情页地址CIAurl

///开始获取作者TOP地址

    var RunUidstr1 = window.location.href; //返回当前页面的 href (URL)
    var RunUidarr1 = RunUidstr1.split("/"); //切割字符串，结果返回由字符串元素组成的一个列表,比如['http:', 'www.toutiao.com', '56789098765']
    var uid = RunUidarr1[5]; // 这里返回第五个值，也就是 uid
    var UidUrl = "https://top.bytedance.net/#/detail_query/author_query?searchType=uid&searchValue=" + uid;

///结束获取作者TOP地址


/// 开始在头条查当前页面
    var ToutiaoSerchurl = "https://www.toutiao.com/search/?keyword=" + document.title; //document.title 就是当前网页的标题，document.domain 可以返回当前域名

/// 结束在头条查当前页面

/// 开始在baidu查当前页面
    var BaiduSerchurl = "https://www.baidu.com/s?ie=UTF-8&wd=" + document.title;
/// 结束在baidu查当前页面

/// 开始在Bilibili查当前页面
    var BilibiliSerchurl = "http://search.bilibili.com/all?keyword=" + document.title;
/// 结束在Bilibili查当前页面


(function() {
	'use strict';
	if (window.top != window.self){
    	return;
	}
    var $ = $ || window.$;
    var setup={
    	"offsetTop":"0px", //距离顶部的距离
    	"offsetLeft":"50px", //距离左边的距离，停用

    	//可更改成自己喜欢的色系：color_n：n标识色块位置
    	"color_1":"#336699",
    	"color_2":"#996600",
    	"color_3":"#003366",
    	"color_4":"#003388",
    	"color_5":"#003399",
    	"color_6":"#0033CC",
    	"color_7":"#0033FF",
    	"color_8":"#990033",
    	"color_9":"#CCCC99",
    	"color_10":"#FFCCCC",
    };
	var websites = [
		//可更改成自己喜欢的网址
		{"name":"查看详情※", "url": CIAurl },
		//{"name":"查头条", "url":ToutiaoSerchurl},
		//{"name":"查百度", "url":BaiduSerchurl},
		//{"name":"查B站", "url":BilibiliSerchurl},
        {"name":"（作者页）Top 查作者", "url":UidUrl},
		{"name":"要闻：科技", "url":"https://content.bytedance.net/channel_hot/3189398999/keynews"},
		{"name":"手机", "url":"https://content.bytedance.net/channel_hot/3462388073/keynews"},
		{"name":"数码", "url":"https://content.bytedance.net/channel_hot/3189398981/keynews"},
		{"name":"5G", "url":"https://content.bytedance.net/channel_hot/94349538318/keynews"},
		{"name":"科学", "url":"https://content.bytedance.net/channel_hot/4310262997/keynews"},
		{"name":"提报青云", "url":"https://top.bytedance.net/task_manage/award/"}
	];
    var searchBox = {};
    searchBox.create=function(){



		var css = "";
			css += '<style>';
			css += '.search-box-xs85144jlx {position: fixed;margin-left: 40%;top: '+setup.offsetTop+';font-size: 0px;z-index:9999999;}'; //left: '+setup.offsetLeft+'  // margin-left 水平居中
			css += '.search-box-xs85144jlx .box-dd25{height:33px;padding:5px;line-height: 30px;color: #FFFFFF;display: inline-block;text-align: center;text-decoration: none;font-size: 13px;}';
			css += '.search-box-xs85144jlx .box-header{width:15px;}';
			css += '.search-box-xs85144jlx .websites{display: none;}'; //默认出现工具栏，如果是 none，则是默认不出现，show是默认出现
			css += '.search-box-xs85144jlx .c0{background: -webkit-linear-gradient('+setup.color_1+', '+setup.color_10+');background: -o-linear-gradient('+setup.color_1+', '+setup.color_10+');background: -moz-linear-gradient('+setup.color_1+', '+setup.color_10+'); background: linear-gradient('+setup.color_1+', '+setup.color_10+'); }';
			css += '.search-box-xs85144jlx .c1{background-color: '+setup.color_1+';}';
			css += '.search-box-xs85144jlx .c2{background-color: '+setup.color_2+';}';
			css += '.search-box-xs85144jlx .c3{background-color: '+setup.color_3+';}';
			css += '.search-box-xs85144jlx .c4{background-color: '+setup.color_4+';}';
			css += '.search-box-xs85144jlx .c5{background-color: '+setup.color_5+';}';
			css += '.search-box-xs85144jlx .c6{background-color: '+setup.color_6+';}';
			css += '.search-box-xs85144jlx .c7{background-color: '+setup.color_7+';}';
			css += '.search-box-xs85144jlx .c8{background-color: '+setup.color_8+';}';
			css += '.search-box-xs85144jlx .c9{background-color: '+setup.color_9+';}';
			css += '.search-box-xs85144jlx .c10{background-color: '+setup.color_10+';}';
			css += '</style>';
		var html = '<div class="search-box-xs85144jlx" id="search-box-xs85144jlx">'+
						'<a class="box-dd25 box-header c0" id="box-header-xs85144jlx" href="javascript:void(0);">◖</a>';
			html += '<span class="websites" id="websites-xs85144jlx">';
			for(var i=0;i<websites.length;i++){
				html += '<a class="box-dd25 c'+(i+1)+'" href="'+websites[i].url+'">'+websites[i].name+'</a>';
			}

			html += '</span>';
			html += '</div>';

		$("head").append(css);
		$("body").append(html);

//下面这些代表是控制显示隐藏的

        		var isShowWebsite = false;
		$("body").on("mouseover", "#box-header-xs85144jlx", function(){
			$("#websites-xs85144jlx").show();
		});
		$("body").on("mouseout", "#box-header-xs85144jlx", function(){
			setTimeout(function(){
				if(!isShowWebsite){
					$("#websites-xs85144jlx").show();
				}
			},100)
		});
		$("body").on("mouseover", "#websites-xs85144jlx", function(){
			isShowWebsite = true;
			$(this).show();
		});
		$("body").on("mouseout", "#websites-xs85144jlx", function(){
			isShowWebsite = false;
			$(this).show();
		});
    };
    searchBox.create();

})();


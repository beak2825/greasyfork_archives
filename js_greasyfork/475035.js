// ==UserScript==
// @name         批量打开
// @namespace    fux
// @version      1.2
// @description   批量打开2048
// @namespace    https://greasyfork.org/
// @author       fux
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @include      *://pbs.8jva2.org/*

// @icon         https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @icon64       https://lain.bgm.tv/pic/icon/s/000/00/13/1391.jpg?r=1357822756
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/475035/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/475035/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
/*
批量打开

 */
$(function() {



	$('.pages:first').append('<button id="btnClass" class="btnClass">一键批量打开</botton>');
	// 点击【一键批量打开】
	$('#btnClass').click(function() {

		// 判断是否使用自动加载下一页脚本,如果加载了下一页,重新循环遍历更改值
		// if ($('.tal  a').length != objList.toUrls.length) {

		objList = {
			toUrls: [],
			isZhKey: false,
			isJpKey: false,
			isZhIndex: [],
			isJpIndex: []
		};
		// 循环遍历【中文辩题】链接地址
		// $('.tal  a').each(function(index, ele) {
		//     // 判断是否勾选
		//     var selfAEle = $(this).prop('href');
		//     // 添加链接
		//     objList.toUrls.push(selfAEle);
		//     // 获取输入框内容
		//     var inputBox = $('.searchInputL').val();
		//     // 判断是否有搜索结果
		//     var isValue = $(this).text();
		//     isValue = isValue.indexOf(inputBox);
		//     // 如果不为空,进入判断
		//     if (isValue) {
		//         objList.isZhKey = true;
		//         objList.isZhIndex.push(index);
		//     }
		var links2 = []; // 创建一个空数组用于存储链接
		$('.tal a').each(function(index,ele) {
			    var href = $(this).attr('href'); // 获取链接的href属性
			    var text = $(this).text(); // 获取链接的文本内容

			var keywords = ["中文", "国产","无码"];

		$.each(keywords, function(index, keyword) {
		  if (text.indexOf(keyword) !== -1) {

				 links2.push(href);

		  }
		  })
			//  if (text.indexOf(keywords) !== -1) {
			// // if ($.inArray(text, keywords) !== -1) {
			// // if (text.contains(keyword)) {
			// 	console.log(href,text);
            // }


		})
       var links= Array.from(new Set(links2))
		// 循环遍历每个链接元素

	$.each(links, function(index, link) {
        setTimeout( console.log(link),500)
	window.open(link);
	});

	})
	// console.log(objList);

	// 循环遍历跳转链接
	// for (var i = 0; i < links.length; i++) {
	// 	// 同时打开
	// 	  // window.open(objList.toUrls[i], "_blank");
	// 	  window.open(links[i], "_blank");
	// }
	/*console.log(
	  objList.toUrls
	);*/


// 获取传入url参数[得到url参数]为对象
function getQueryArgs(url) {
	var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
		//保存每一项
		args = {},
		//得到每一项
		items = qs.length ? qs.split('&') : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
	for (i = 0; i < len; i++) {
		item = items[i].split('='),
			name = decodeURIComponent(item[0])
		value = decodeURIComponent(item[1])
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
}

// 设置样式
$('.btnClass').css({
	"margin": "5px",
	"color": "#fff",
	"line-height": "1.499",
	"position": "relative",
	"display": "inline-block",
	"font-weight": "400",
	"white-space": "nowrap",
	"text-align": "center",
	"background-image": "none",
	"border": "1px solid transparent",
	"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
	"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
	"cursor": "pointer",
	"-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
	"transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
	"-webkit-user-select": "none",
	"-moz-user-select": "none",
	"-ms-user-select": "none",
	"user-select": "none",
	"-ms-touch-action": "manipulation",
	"touch-action": "manipulation",
	"height": "32px",
	"padding": "0 15px",
	"font-size": "14px",
	"border-radius": "4px",
	"background-color": "#fff",
	"border-color": "#d9d9d9",
	// "background-color": "#FF5A44",
	"background-color": "#F09199",
	"border-color": "#FF5A44",
	"text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
	"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
	"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)"
});
$('.fixedLeft1').css({
	"position": "fixed",
	"bottom": "0",
	"z-index": "999",
	"left": "0",
	'font-size': '12px'
})
// 设置按钮hover事件
$('.btnClass').hover(function() {
	// hover时效果
	$(this).css({
		'background': '#02A3FB',
		"border": "1px solid transparent"
	});
}, function() {
	//非 hover时效果
	$(this).css({
		'background': '#F09199'
	});
});
// 保存url等信息
var objList = {
	toUrls: [],
	isZhKey: false,
	isJpKey: false,
	isZhIndex: [],
	isJpIndex: []
};

/* ===================  添加新标签打开 Start ===================
                      2020年6月18日19:03:15
                      2020年6月18日20:40:32
*/
function $addBtn() {
	// 清空按钮,防止自动刷新下一页,添加按钮重复
	$('.addBtn').remove();
	// 添加按钮
	if ($('p.rateInfo').length != 0) {
		$('p.domesticClass').before('<button class="addBtn showHiheBtn" flag="1">显示/隐藏列表</button>');
		$('p.domesticClass').before('<button class="addBtn toNewUrl">新标签打开</button>');
		$('p.domesticClass').before('<button class="addBtn toDetailsPageAndAniDB">同时打开详情页/AniDB</button>');
	} else {
		$('p.info.tip').after('<button class="addBtn toDetailsPageAndAniDB">同时打开详情页/AniDB</button>');
		$('p.info.tip').after('<button class="addBtn toNewUrl">新标签打开</button>');
		$('p.info.tip').after('<button class="addBtn showHiheBtn" flag="1">显示/隐藏列表</button>');;
	}
	// 设置【新标签打开】按钮样式
	$('.toNewUrl').css({
		"margin": "10px 5px",
		"color": "#fff",
		"line-height": "1.499",
		"position": "relative",
		"display": "inline-block",
		"font-weight": "400",
		"white-space": "nowrap",
		"text-align": "center",
		"background-image": "none",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"cursor": "pointer",
		"-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"-webkit-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none",
		"-ms-touch-action": "manipulation",
		"touch-action": "manipulation",
		"height": "32px",
		"padding": "5px",
		"font-size": "12px",
		"border-radius": "4px",
		"background-color": "#fff",
		"border-color": "#d9d9d9",
		"background-color": "#4EB1D4",
		"border-color": "#FF5A44",
		"text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"border": "1px solid transparent"
	});
	// 设置同时打开详情页/AniDB 按钮样式
	$('.toDetailsPageAndAniDB').css({
		"margin": "10px 5px",
		"color": "#fff",
		"line-height": "1.499",
		"position": "relative",
		"display": "inline-block",
		"font-weight": "400",
		"white-space": "nowrap",
		"text-align": "center",
		"background-image": "none",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"cursor": "pointer",
		"-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"-webkit-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none",
		"-ms-touch-action": "manipulation",
		"touch-action": "manipulation",
		"height": "32px",
		"padding": "5px",
		"font-size": "12px",
		"border-radius": "4px",
		"background-color": "#fff",
		"border-color": "#d9d9d9",
		"background-color": "#4EB1D4",
		"border-color": "#FF5A44",
		"text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"border": "1px solid transparent"
	});
	// 设置【显示/隐藏列表】按钮样式
	$('.showHiheBtn').css({
		"margin": "10px 5px",
		"color": "#fff",
		"line-height": "1.499",
		"position": "relative",
		"display": "inline-block",
		"font-weight": "400",
		"white-space": "nowrap",
		"text-align": "center",
		"background-image": "none",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.015)",
		"cursor": "pointer",
		"-webkit-transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"transition": "all .3s cubic-bezier(.645, .045, .355, 1)",
		"-webkit-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none",
		"-ms-touch-action": "manipulation",
		"touch-action": "manipulation",
		"height": "32px",
		"padding": "5px",
		"font-size": "12px",
		"border-radius": "4px",
		"background-color": "#fff",
		"border-color": "#d9d9d9",
		"background-color": "#4EB1D4",
		"border-color": "#FF5A44",
		"text-shadow": "0 -1px 0 rgba(0, 0, 0, 0.12)",
		"-webkit-box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"box-shadow": "0 2px 0 rgba(0, 0, 0, 0.045)",
		"border": "1px solid transparent"
	});
	// 设置【新标签跳转】按钮hover事件
	$('.toNewUrl').hover(function() {
		// hover时效果
		// 添加点击透明度更改,有点击效果
		$(this).css({
			'opacity': '0.5'
		})
	}, function() {
		//非 hover时效果
		$(this).css({
			'opacity': '1'
		});
	});
	// 设置【同时打开详情页/AniDB 按钮样式】按钮hover事件
	$('.toDetailsPageAndAniDB').hover(function() {
		// hover时效果
		// 添加点击透明度更改,有点击效果
		$(this).css({
			'opacity': '0.5'
		})
	}, function() {
		//非 hover时效果
		$(this).css({
			'opacity': '1'
		});
	});
	// 设置【显示/隐藏列表】按钮hover事件
	$('.showHiheBtn').hover(function() {
		// hover时效果
		// 添加点击透明度更改,有点击效果
		$(this).css({
			'opacity': '0.5'
		})
	}, function() {
		//非 hover时效果
		$(this).css({
			'opacity': '1'
		});
	});
	// 默认隐藏
	$('.showHiheBtn').click();
}
// 添加按钮
$addBtn();
// 点击【新标签跳转】按钮,触发点击事件
$(document).on('click', '.toNewUrl', function(e) {
	// 获取当前列表a标签链接
	var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
	// 新标签打开
	window.open(selfUrl, "_blank");
});
// 点击【同时打开详情页/AniDB 按钮样式】按钮,触发点击事件
$(document).on('click', '.toDetailsPageAndAniDB', function(e) {
	var selfUrl = $(this).parent().parent().find('h3 a').prop('href');
	// 新标签打开
	window.open(selfUrl, "_blank");
	// 获取AniDB的位置索引正确
	var AniDBIndex = 0;
	$(this).parent().parent().find('p').each(function(index, ele) {
		// 判断索引
		if ($(this).find('a:eq(0)').html() == "AniDB") {
			AniDBIndex = index;
		}
	})
	// 获取当前AniDB的a标签链接
	var selftoAniDBUrl = $(this).parent().parent().find('p:eq(' + AniDBIndex + ') a:eq(0)').prop('href');
	// 新标签打开
	window.open(selftoAniDBUrl, "_blank");
});

// 默认隐藏
$('.showHiheBtn').click();
// 4.设置【显示/隐藏列表】按钮hover事件
$('.showHiheBtn').hover(function() {
	// hover时效果
	// 添加点击透明度更改,有点击效果
	$(this).css({
		'opacity': '0.5'
	})
}, function() {
	//非 hover时效果
	$(this).css({
		'opacity': '1'
	});
});


})();
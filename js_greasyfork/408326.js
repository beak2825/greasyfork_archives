// ==UserScript==
// @name         武汉大学教务系统看板娘
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  计算GPA以及自定义教务系统背景等等
// @author       saayuuk1
// @match        http://bkjw.whu.edu.cn/stu/stu_index.jsp
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408326/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%9C%8B%E6%9D%BF%E5%A8%98.user.js
// @updateURL https://update.greasyfork.org/scripts/408326/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%9C%8B%E6%9D%BF%E5%A8%98.meta.js
// ==/UserScript==

function analysePointfromScore(score) {
	if (score >= 90.0) {
		return 4.0;
	} else if (score >= 85.0) {
		return 3.7;
	} else if (score >= 82.0) {
		return 3.3;
	} else if (score >= 78.0) {
		return 3.0;
	} else if (score >= 75.0) {
		return 2.7;
	} else if (score >= 72.0) {
		return 2.3;
	} else if (score >= 68.0) {
		return 2.0;
	} else if (score >= 64.0) {
		return 1.5;
	} else if (score >= 60.0) {
		return 1.0;
	} else {
		return 0.0;
	}
}

async function getGPA() {
    'use strict';

    // Your code here...
    var GPA = 4.0;
	await $.ajax('/servlet/Svlt_QueryStuScore?year=0&term=&learnType=&scoreFlag=0').done(function (data) {
		var
			i,
			re = /<tr null>([\s\S]*?)<\/tr>/g,
			str,
			re_score = /<!-- 成绩 -->([\s\S]*?)<td>([\s\S]*?)<\/td>/,
			re_credit = /<!-- 学分 -->([\s\S]*?)<td>([\s\S]*?)<\/td>/,
			str_s,
			point,
			credit,
			total_point = 0.0,
			total_credit = 0.0;
		while (true) {
			str = re.exec(data);
			if (!str) {
				break;
			} else {
				str_s = re_score.exec(str);
				if (!str_s || !str_s[2]) {
					continue;
				} else {
					point = analysePointfromScore(parseFloat(str_s[2]));
				}
				str_s = re_credit.exec(str);
				if (!str_s || !str_s[2]) {
					continue;
				} else {
					credit = parseFloat(str_s[2]);
				}
				total_point += point * credit;
				total_credit += credit;
			}
		}
        GPA = total_point / total_credit;
    }).fail(function (xhr, status) {

    }).always(function () {

    });
    return GPA;
};

$(function beautifyIndex(url, opacity) {
    //背景图片URL
    url = 'url(' + url + ')';
	//关闭二维码页面
	var KF = $(".keifu");
	var kf_close = $(".keifu .keifu_close");
	$(kf_close).click(function(){

		KF.animate({width:"0"},200,function(){
			wkbox.hide();
			icon_keifu.show();
			KF.animate({width:26},300);
		});
	});
    $(kf_close).click();
	//设置背景图片
	var
		width = $('#container').css('width'),
		height = $('#main_contaier').css('height');
	$('#footer').css('height', '0px');
	$('#main_contaier').css('width', width);
	$('#container').css('height', height);
    $('#main_contaier').css('height', '880px');
	$('#main_contaier').css('background-image', url);
    //设置框架透明度
    $('#page_iframe').css('opacity', opacity);
    $('#bar_iframe').css('opacity', opacity);
    //将选项置于框架前
    $('#btn1').css('z-index', '1');
    $('#btn2').css('z-index', '1');
    $('#btn3').css('z-index', '1');
    $('#btn5').css('z-index', '1');
    $('#btn9').css('z-index', '1');
});

/*$(function beautifySubmit() {
	$('#background-submit').click(function () {
		var url = $('#background-url');
		var opacity = $('#background-opacity');
		beautifyIndex(url[0].value || 'https://pic4.zhimg.com/v2-d6a6db9d5db45618fb67536920c50c10_r.jpg', opacity[0].value || '0.8');
		$('#background-config').remove();
	});
});*/

function beautifyConfig() {
	//自定义界面设置
	$('#top').append('<form id="background-config">\
	<input type="text" id="background-url" placeholder="请输入图片链接" style="position:absolute;left:600px;top:100px"/>\
	<input type="text" id="background-opacity" placeholder="请输入透明度(0~1)" style="position:absolute;left:800px;top:100px"/>\
	<input type="button" id="background-submit" value="确认" style="width:45px;position:absolute;left:1000px;top:102px;text-align:justify;"/>\
		<style>\
			input{\
				font-size:12px;\
				height:30px;\
				border-radius:4px;\
				border:1px solid #c8cccf;\
				color:#986655;\
				outline:0;\
				text-align:left;\
				padding-left: 10px;\
				display:block;\
				cursor: pointer;\
				box-shadow: 2px 2px 5px 1px #ccc;z-index: 1;\
				}\
			input::-webkit-input-placeholder{\
				color:#986655;\
				font-size: 12px;\
			}\
		</style>');
    $('#background-submit').click(function () {
		var url = $('#background-url');
		var opacity = $('#background-opacity');
		beautifyIndex(url[0].value || 'https://pic4.zhimg.com/v2-d6a6db9d5db45618fb67536920c50c10_r.jpg', opacity[0].value || '0.8');
		$('#background-config').remove();
	});
}

function beautify() {
	//beautifyIndex();
	beautifyConfig();
}

(function () {
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>\
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css"/>\
    <script src="https://cdn.jsdelivr.net/gh/saayuuk1/live2d-widget@1.0.3/autoload.js"></script>');
})();
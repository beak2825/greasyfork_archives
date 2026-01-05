// ==UserScript==
// @name        ku岛改版
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @include     http://www.kukuku.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27213/ku%E5%B2%9B%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/27213/ku%E5%B2%9B%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

//(function() {
//"use strict";
//$("#h-menu-top").css("font-size","110%");
//$("*").css({" text-shadow":"0.1em 0.1em 0.1em #999999"});


//console.log($(".h-threads-list .h-threads-item").eq(2).height());



//.css('display','none');
function listload(){
	$($(window).width() > 1000 ? $(".h-threads-item").css("width","1000px") : $(".h-threads-item").css("width","100%"));
	$(".h-threads-item").css({"margin":"25px auto","padding":"10px","background-color":"rgba(255,255,255,0.3)","box-shadow":"0 0 3px 1px rgba(160,160,160,0.4)"});
	$(".h-threads-item .h-threads-content").css({"margin":"15px 5px"});
	$(".uk-container").css({"max-width":"100%"});
	$(".h-threads-item-reply").css({"width":"100%","margin-right":"10px"});
	//$("h-threads-list").css({"width":"100%"});
	$(".h-threads-info-createdat").css({"float":"right"});
	$(".h-threads-tips").css({"width":"100%","padding":"5px 0","float":"left","margin":"5px 0","background-color":"#f0e0d6","cursor":"default"});
}


$("#h-tool .h-tool-btn").css({"opacity":"0.85","border-radius":"50%",'margin-left':'60px'});
$("#h-tool").css({"width":"100px","right":"-50px"}).on("mouseover", ".h-tool-btn",function(){
	$(this).css("box-shadow","0 3px 6px 1px grey");
});
$("#h-tool").on("mouseout", ".h-tool-btn",function(){
	$(this).css("box-shadow","none");
});
$("#h-tool .h-tool-btn").last().after($('<a href="#"class="h-tool-btn" title="删除最后一次发的串(*不能反悔)" style="margin-left:60px;border-radius:50%;opacity:0.85" onclick="deleteLastPost();"><i id="del_th" class="uk-icon-chevron-up" style=" color:black;width:18px;height:2px;display: block;background-color: white;position:absolute;margin:12px 11px 26px 11px"></i></div>'));
document.styleSheets[0].insertRule('#del_th::before{width: 5px;height: 4px;position: absolute;left: 6px;bottom: 0;background-color: white;content: ""}',0);
document.styleSheets[0].insertRule('#del_th::after{width: 12px;left:3px;height: 15px;background-color: white;position: absolute;content:"";top: 3px;border-radius: 0 0 2px 2px;}',0);

$("#h-menu").css({"width":"150px","padding-top":"70px","border":"0","display":"block","background-color":"#ffffee"});
//$('#h-menu').height(function (index, value){return 100%-$('#h-content-top-nav').height();});
$("#h-menu-top a").css({"line-height":"30px","font-size":"150%","letter-spacing":"5px"});
$("#h-menu-content").css("font-size","115%");
$(".uk-parent").css({"line-height":"33px"});
$(".uk-parent ul").css({"padding":"0"});
$(".uk-parent div li a").css({"position":"relative","padding-left":"25px"});
$(".uk-parent div li").css({"position":"relative","overflow":"hidden"});

//$(".uk-nav-sub li a").css({"line-height":"30px","padding":"0 0 0 15px"});
$(".uk-nav-sub li a.h-active").css("margin-left","0px");
$("#h-menu-search-keyword").css({"height":"20px","width":"95%"});

$(".uk-breadcrumb").css("margin","0");
$(".uk-breadcrumb").find("li,a,span").css({"font-size":"18px","color":"white"});

$(".h-title").appendTo($("#h-content-top-nav")).css({"position":"fixed","top":"0","left":"42%","margin":"0px","line-height":"60px","color":"white"});
//$("#h-post-form").css("display","none");
// console.log($(".h-post-form-input:first").text());
//document.getElementById("h-content-top-nav").style.cssText +='width:100%;position:fixed;background-color:#ccc;left:0;margin:0;padding:0;line-height:50px;display:block;z-index:999;box-shadow:-6px 0 5px black';
$("#h-content-top-nav").css({"width":"100%","position":"fixed","background-color":"rgb(197, 120, 84)"/*"#b9673e"*/,"left":"0","margin":"0","padding":"0","line-height":"60px","display":"block","z-index":"999","box-shadow":"0 2px 6px grey"});
$(".uk-float-left ").prepend($("<li><div id='in-menu'></div><li>"));
$(".uk-float-left  li:eq(1)").remove();
//$(".uk-nav-sub").css("font-size","200%");
$("<style>#h-menu::-webkit-scrollbar{width:0px}#in-menu{ color:white;width:20px;height:2px;box-shadow:inset 0 0 0 32px,0 -6px,0 6px;margin:30px 20px 30px 25px}</style>").appendTo('head');

$("#h-post-form").css({"margin-top":"80px"});
$("#h-post-form .h-post-form-option input").css({"background-color":" #4CAF50","height":"21px","padding":"1.5px 8px","border":" none","color":" white","text-align":" center","text-decoration":" none"});
//$("#h-post-form .h-post-form-title").css({"width":"50px"});
//$("#h-post-form .h-post-form-input").css({"padding-left":"20px"});

$(".uk-float-right small").parent().css("display","none");


//隐藏"顶","踩"
hide_btn = function(){
	var btn = $(".h-threads-info span");
	for (i=0;i<btn.length;i++){
		//console.log(btn.eq(i).text());
		if (btn.eq(i).text() == "顶[0]" || btn.eq(i).text() == "踩[0]" || btn.eq(i).text() == "无标题" || btn.eq(i).text() == " - "){btn.eq(i).remove();}
	}
	$(".h-threads-list hr,.h-threads-item-reply-icon").remove();
	$(".uk-pagination").hide();
};



//侧边工具
$(document).on("mouseenter","#h-tool",function(e){
	for(var i=0;i<$("#h-tool .h-tool-btn").length;i++){
		$("#h-tool .h-tool-btn").eq(i).animate({
			'margin-left':'0'
		},i*100,'swing');
	}
	//tool_ani('0');
});

$(document).on("mouseleave","#h-tool",function(e){
	$("#h-tool .h-tool-btn").animate({
		'margin-left':'60px'
	},100,'swing',function(){
		$("#h-tool .h-tool-btn").stop();
		$("#h-tool .h-tool-btn").css("margin-left","60px");
	});
});

//底部导航栏
$(document).on("mousemove","body",function(e){
	if(e.screenY - parseInt($(window).height()) > 20){
		$("#h-bottom-nav").css({"border":"none","box-shadow":"1px 0 5px 1px grey"}).slideDown(400);
	}else{
		$("#h-bottom-nav").slideUp(400);
	}
});


//拟瀑布流
/*
function falls(){
	if($(window).width() > 2000){
		$(".h-threads-item").css({"width":"47.5%"});
		$(".lcl").removeClass("lcl");
		$(".rcl").removeClass("rcl");
		var j = 1,k = 1;
		var it = $(".h-threads-list .h-threads-item");
		it.eq(0).addClass("lcl");
		it.eq(1).addClass("rcl");
		var lhe = $(".lcl").eq(0).height();
		var rhe = $(".rcl").eq(0).height();
		var l_r = 0;
		for(var i=1;i<$(".h-threads-list .h-threads-item").length - 1;i++){
			if(lhe>rhe){
				it.eq(i+1).addClass("rcl");
				rhe += $(".rcl").eq(j).height();
				j ++;
				//	console.log(rhe +"r");
			}else if(rhe>lhe){
				it.eq(i+1).addClass("lcl");
				lhe += $(".lcl").eq(k).height();
				k ++;
				//console.log(lhe + "l");
			}
		}
		$(".rcl").css({"float":"right","clear":"right"});
		$(".lcl").css({"float":"left","clear":"left"});
	}
}
*/
/*
//鼠标悬浮显示串回复内容
$(document).on("mouseover",".h-threads-list .ubb-content-ref",function(){
	$("#h-ref-view .h-threads-item-ref").fiest().css({"border":"none","box-shadow":"0 1px 10px 1px rgb(47, 20, 3)"});
	var rep_num = $(this).attr("data-id");
	var rep_id = "#reply_" + rep_num;
	var top_id = "topic_" + rep_num;
	var rep_main = $(rep_id).find(".h-threads-item-reply-main");
	var ref_rem = function(){$("#h-ref-view .h-threads-item").remove();};
	var ins_ref = function(){rep_main.clone().appendTo($("#h-ref-view")).wrap('<div class="h-threads-item"><div data-threads-id="'+rep_num+'" class="h-threads-item-reply h-threads-item-ref" style="overflow:hidden"></div></div>');};
	if ($(this).parents(".h-threads-item").attr("id") == top_id){
		ref_rem();
		rep_main = $("#"+top_id).find(".h-threads-item-main");
		ins_ref();
	}else{
		ref_rem();
		ins_ref();
	}
	$("#h-ref-view").css({"display":"block","top":$(this).position().top,"left":$(this).position().left});
});
$(".uk-clearfix").on("mouseenter",function(){
	$("#h-ref-view").hide();
});
$("#h-ref-view").on("mouseleave",function(){
	if($("#h-ref-view").css('display') !=="block"){
		$("#h-ref-view").css("display","block");
	}else{
		$("#h-ref-view").hide();
	}
});
*/



//点击隐藏侧栏
$("#in-menu").parent().click(function(){
	if($("#h-menu").css('display') == 'block'){
		$("#h-menu").animate({
			left : '-150px'
		},300,'swing',function(){
			$(this).css("display","none");
			//falls();
		});
		$("#h-content").animate({
			"margin-left" : 0
		},300,'swing');
	}else{
		$("#h-menu").animate({
			left : '0px'
		},300,'swing',function(){
			$(this).css("display","block");
			//falls();
		});
		$("#h-content").animate({
			"margin-left" : '150px'
		},300,'swing');
	}
});



//for(var i=0;i<$(".h-threads-img-tool").length;i++){
//$(".h-threads-img-tool").eq(i).find(".h-threads-img-tool-btn").last().after($('<span class="h-threads-img-tool-btn feat-img-wid uk-button-link"><i class="uk-icon-search-plus"></i>适应图片宽度</span>'));
//}

function ins_img_tool(){
	for(var i=0;i<$(".h-threads-img-tool").length;i++){
		if($(".h-threads-img-tool").eq(i).find(".feat-img-wid").length === 0){
			$(".h-threads-img-tool").eq(i).find(".h-threads-img-tool-btn").last().after($('<span class="h-threads-img-tool-btn feat-img-wid uk-button-link"><i class="uk-icon-search-plus"></i>适应图片宽度</span>'));
		}
	}
}


var img_wid,img_txt,img_mar_le,img_css;
//$(".h-threads-img-tool").on("click",".feat-img-wid",function(){
function img_wid_cli(){
	$(".feat-img-wid").on("click",function(){
		// $(this).attr("src",$(this).attr("data-src"));//
		//$(this).parent().find('img').css({"max-width":"1000%"});
		img_txt = $(this).parent().parent().find('.h-threads-img-tool-small').first().text();
		//img_wid = parseInt($(this).parent().find('.h-threads-img-tool-small').first().text().substring(_this.find('.h-threads-img-tool-small').text().lastIndexOf(',')).match(/\d+/));
		img_wid = parseInt(img_txt.substring(img_txt.lastIndexOf(',')).match(/\d+/));
		//img_wid = img_wid
		img_css = $(this).parent().parent().find('a img').first();
		if($(this).parent().width() < parseInt(img_wid)){
			img_mar_le = -(img_wid - $(this).parent().width())/2 +"px";
		}
		if(img_css.css("max-width") =="10000%"){
			img_css.css({"box-shadow":"none","max-width":"250px","margin":"0 20px"});
		}else{
			img_css.css({"box-shadow":"0 0 10px 1px grey","max-width":"10000%"}).css("margin-left",img_mar_le);
			console.log($(this).parent().width());
			console.log(img_wid);
			console.log(img_mar_le);
		}
	});
}


//loading动画
function insloadani(ele){
	$(ele).last().append($('<div class="loadani" style="display:block;width:25px;height:25px;position:relative;margin: 0 auto;"><div class="b1"></div><div class="b2"></div></div>'));
	$(".loadani div").css({"width":" 100%","height":"100%","border-radius":"50%","background-color":"#f17436","opacity":"0.6","position":"absolute","top":"0","left":"0","animation":"sk-bounce 2.0s infinite ease-in-out"});
	$("loadani .b2").css( style="animation-delay: -1.0s");
}
document.styleSheets[0].insertRule('@keyframes sk-bounce {0%, 100% {transform: scale(0.0);} 50% {transform: scale(1.0);}}',0);

//点击打开隐藏内容
var th_num,th_hide_num,th_id,url,th_ori_num,rp_page;
$(".h-threads-list").on("click",".h-threads-tips",function(e){
	th_num =$(e.target).parent().attr("data-threads-id");
	th_hide_num = $(e.target).text().match(/\d+/)[0];
	th_id ="#topic_"+ th_num;
	url = "http://www.kukuku.cc/t/" + th_num;
	th_ori_num = $(th_id).find(".h-threads-tips:first").text().match(/\d+/)[0];
	th_load = function(){$(th_id).find(".h-threads-item-replys").last().load(url + " .h-threads-item-reply",function(){
		ready_load();
		$(e.target).hide();
		apd_btn($(th_id));
	} );};
	th_appe = function(){$('<div class="h-threads-item-replys"></div><div class="more h-threads-tips"> <i data-threads-id="'+th_num+'" class="uk-icon-plus-square h-threads-show-all-btn"></i> 回应还有 '+th_hide_num +' 篇被省略。点击展开 </div>').appendTo($(th_id));};
	insloadani(th_id +" .h-threads-tips");
	if(th_ori_num >15){
		if($(this).hasClass("more")){
			rp_page = Math.ceil((parseInt(th_ori_num) - parseInt(th_hide_num) + 5) / 20) +1 ;
			url = "http://www.kukuku.cc/t/" + th_num +"/" +rp_page;
			//console.log(url);
			th_hide_num -= 20;
			th_load();
			console.log(th_hide_num);
			if(th_hide_num>5){
				th_appe();
			}
		}else{
			th_hide_num -= 15;
			th_load();
			th_appe();
		}
	}else{
		th_hide_num=0;
		th_load();
	}
});

//显示全部按钮
function apd_btn(ele){
	ele.find(".h-threads-tips").append('<span class="showall_btn" style="color: white;font-size:14px;float: right;margin-right: 20px;background: rgba(119, 58, 35, 0.8);line-height: 20px;padding: 0 4px;border-radius: 2px;" >显示全部</span>');
	//console.log($(ele).find(".h-threads-tips").length);
}

var rp_page=1;
$(".h-threads-list").on("click",".showall_btn",function(e){
	e.stopPropagation();
	th_num =$(e.target).parent().parent().attr("data-threads-id");
	th_id ="#topic_"+ th_num;
	th_ori_num = $(th_id).find(".h-threads-tips:first").text().match(/\d+/)[0];
	th_hide_num = $(th_id).find(".h-threads-tips:last").text().match(/\d+/)[0];
	url = "http://www.kukuku.cc/t/" + th_num +"/" +rp_page;
	function rp_load(){$(th_id).find(".h-threads-item-replys").last().load(url + " .h-threads-item-reply");}
	th_appe = function(){$('<div class="h-threads-item-replys" ></div><div class="h-threads-tips" style="display:none;"> <i data-threads-id="'+th_num+'" class="uk-icon-plus-square h-threads-show-all-btn"></i> 回应还有 '+th_hide_num +' 篇被省略。点击展开 </div>').appendTo($(th_id));};
	if(th_hide_num == th_ori_num){
		$(th_id).find(".h-threads-item-replys").eq(rp_page-1).load(url + " .h-threads-item-reply",function(){
			ready_load();
			if(rp_page<Math.ceil((parseInt(th_ori_num)+5)/20)+1){
				$(e.target).parent().hide();
				th_appe();
				apd_btn($(th_id));
				$($(th_id).find(".showall_btn").eq(rp_page)).click();
				console.log(rp_page);
				rp_page++;
			}else{
				$(th_id).find(".showall_btn").remove();
				$(th_id).find(".h-threads-tips:not(:first)").remove();
				rp_page =1 ;
			}
		});
	}else if(parseInt(th_hide_num) < parseInt(th_ori_num)){
		rp_page = Math.ceil((parseInt(th_ori_num) - parseInt(th_hide_num) + 5) / 20) +1 ;
		url = "http://www.kukuku.cc/t/" + th_num +"/" +rp_page;
		$(th_id).find(".h-threads-item-replys").eq(rp_page-1).load(url + " .h-threads-item-reply",function(){
			ready_load();
			if(rp_page<Math.ceil((parseInt(th_ori_num)+5)/20)+1){
				//alert();
				$(e.target).parent().hide();
				th_hide_num -= 20;
				apd_btn($(th_id));
				if(th_hide_num>0){
					th_appe();
					$($(th_id).find(".showall_btn").eq(rp_page)).click();
				}
				console.log(rp_page);
				rp_page++;
			}else{
				$(th_id).find(".showall_btn").remove();
				$(th_id).find(".h-threads-tips:not(:first)").remove();
				rp_page =1 ;
			}
		});
		console.log(th_num+' ' +th_hide_num +' ' +th_ori_num+' '+url);
	}
});


//滚到底部加载下一页
var page=2,page_url;
$(document).scroll(function(){
	if($("#h-content .h-threads-list").length==1){
		if($(document).height()-$(document).scrollTop()-$(window).height()<200){
			page_url = location.href+"/" + page;
			console.log(page_url);
			$("#h-content .h-threads-list").after($('<div class="h-threads-list" style="display:block;"></div>'));
			insloadani("#h-content .h-threads-list");
			if(window.location.href.match(/\/t\//g) && page -1 < $(".uk-pagination").find('li').length -2){
				if(page -1 < $(".uk-pagination").find('li').length -2){
					console.log($(".uk-pagination").find('li').length -2);
					$("#h-content .h-threads-list").last().load(page_url+"#h-content .h-threads-item-reply",function(){
						$("#h-content .h-threads-list").last().find(".h-threads-item-reply").appendTo($("#h-content .h-threads-item-replys").first());
						$("#h-content .h-threads-list").last().remove();
						hide_btn();
						listload();
						page++;
					});
				}else{
				return false;
				}
			}else{
				$("#h-content .h-threads-list").last().load(page_url+"#h-content .h-threads-item",function(){
					apd_btn($("#h-content .h-threads-list").last());
					$("#h-content .h-threads-list").last().find(".h-threads-item").appendTo($("#h-content .h-threads-list").first());
					$("#h-content .h-threads-list").last().remove();
					hide_btn();
					listload();
					page++;
				});
			}
		}
	}
});


//document.styleSheets[0].insertRule('#h-menu::-webkit-scrollbar-thumb{background:red}',0);
//document.styleSheets[0].insertRule('.ink {display: block; position: absolute;background: hsl(180, 40%, 80%);border-radius: 100%;transform: scale(0);}.ink.animate {animation: ripple 0.65s linear;}@keyframes ripple {100% {opacity: 0; transform: scale(2.5);}}',0);
document.styleSheets[0].insertRule('.uk-parent div li:hover{background-color:rgba(115,115,115,0.1);}',0);
document.styleSheets[0].insertRule('.ink {display: block; position: absolute;background: rgba(0,0,0,0.4);border-radius: 100%;transform: scale(0);}',0);
document.styleSheets[0].insertRule('.ink.animate {animation: ripple 0.65s linear;}',0);
document.styleSheets[0].insertRule('@keyframes ripple {100% {opacity: 0; transform: scale(2.5);}}',0);
var par, ink, dd, xx, yy;
$(".uk-parent div li a").click(function(e) {
	//e.preventDefault();
	par = $(this).parent();
	if (par.find(".ink").length === 0)
		par.prepend("<span class='ink'></span>");
	ink = par.find(".ink");
	ink.removeClass("animate");
	if (!ink.height() && !ink.width()) {
		dd = Math.max(par.outerWidth(), par.outerHeight());
		ink.css({
			height: dd,
			width: dd
		});
	}
	xx = e.pageX - par.offset().left - ink.width() / 2;
	yy = e.pageY - par.offset().top - ink.height() / 2;
	console.log(e.pageX+" "+e.pageY);
	console.log(xx+ ' ' +yy +" "+ $(".ink").position().left);
	ink.css({
		top: yy + 'px',
		left: xx + 'px'
	}).addClass("animate");
});



//图片浏览
//点击图片放大

//function initImageBox(){
var img_flag = 1;

function img_cli(){
	$(document).on("click",'img',function(e){

		//$("a img").on("click",function(e){
		//e.preventDefault();
		//console.log($(this));
		console.log(img_flag);

		//if ($(this).parent().parent().hasClass('h-active')) {
		//$(this).resize();
		//$(this).parent().parent().removeClass('h-active');
		//alert();
		//img_flag++;
		//if(img_flag%4 === 0 ||img_flag%4 == 1){
		//initImageBox();
		//$(this).click();
		//}else{
		//img_flag ++;
		//}
		//return false;
	});
	//}
}

function ready_load(){
	listload();
	initContent();
	hide_btn();
	//initImageBox();
	ins_img_tool();
	img_wid_cli();
	img_cli();
	//if(img_flag%2 == 1){
	initImageBox();
	img_flag++;
	//	}
}
$().ready(function(){
	apd_btn($(".h-threads-item"));
	//falls();
	//rotate();
	//initImageBoxs();
	ins_img_tool();
	listload();
	initContent();
	hide_btn();
	$("#h-bottom-nav").css({"border":"none","box-shadow":"1px 0 5px 1px grey"}).slideUp(400);
});



// console.log(menu.innerHTML);
// Your code here...
//})();
// ==UserScript==
// @name              【屏蔽广告】屏蔽谷歌广告、百度广告、知乎广告、隐藏谷歌和百度搜索增强百度搜索结果的各种广告等等（过滤所有采用谷歌联盟和百度联盟等广告联盟的广告）
// @namespace http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @version           4.808
// @description      强力模式可隐藏大部分悬浮广告，新增twitter和Youtube微博视频下载以及广告过滤，可按网址和关键词屏蔽过滤百度谷歌必应bing360微信微博知乎豆瓣B站的搜索结果、屏蔽谷歌推广的广告和去知乎广告、csdn广告、去百度搜索广告、去百度知道广告、去百度文库广告、去360搜索广告、去必应Bing搜索广告、百度文库去广告、去百度在别的网站的推广广告，移除知乎的强制登陆弹窗。去豆瓣广告、去B站广告
// @icon    data:image/png;base64,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
// @match        *://*.baidu.com/*
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://*.so.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.douban.com/*
// @match        *://*.weibo.com/*
// @match        *://twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.csdn.net/*
// @match        *://*/*
// @inject-into content
// @require https://unpkg.com/jquery@2.1.4/dist/jquery.min.js
// @require https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @require https://unpkg.com/html2canvas@0.5.0-beta4/dist/html2canvas.js
// @require https://cdn.jsdelivr.net/npm/echarts@5.0.1/dist/echarts.min.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at document-start
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_openInTab
// @grant             GM_download
// @license             End-User License Agreement
// @noframes
// @connect     zhihu.com
// @connect     baidu.com
// @connect     baiducontent.com
// @connect     dadiyouhui02.cn
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/460743/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%91%E5%B1%8F%E8%94%BD%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E3%80%81%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E3%80%81%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E3%80%81%E9%9A%90%E8%97%8F%E8%B0%B7%E6%AD%8C%E5%92%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9A%84%E5%90%84%E7%A7%8D%E5%B9%BF%E5%91%8A%E7%AD%89%E7%AD%89%EF%BC%88%E8%BF%87%E6%BB%A4%E6%89%80%E6%9C%89%E9%87%87%E7%94%A8%E8%B0%B7%E6%AD%8C%E8%81%94%E7%9B%9F%E5%92%8C%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F%E7%AD%89%E5%B9%BF%E5%91%8A%E8%81%94%E7%9B%9F%E7%9A%84%E5%B9%BF%E5%91%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/460743/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%91%E5%B1%8F%E8%94%BD%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E3%80%81%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E3%80%81%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E3%80%81%E9%9A%90%E8%97%8F%E8%B0%B7%E6%AD%8C%E5%92%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9A%84%E5%90%84%E7%A7%8D%E5%B9%BF%E5%91%8A%E7%AD%89%E7%AD%89%EF%BC%88%E8%BF%87%E6%BB%A4%E6%89%80%E6%9C%89%E9%87%87%E7%94%A8%E8%B0%B7%E6%AD%8C%E8%81%94%E7%9B%9F%E5%92%8C%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F%E7%AD%89%E5%B9%BF%E5%91%8A%E8%81%94%E7%9B%9F%E7%9A%84%E5%B9%BF%E5%91%8A%EF%BC%89.meta.js
// ==/UserScript==
/*
需要更多功能和建议的话，
欢迎跟帖反馈
【网站广告优化】百度贴吧、百度知道、百度搜索等百度系去广告优化
大多数网站若使用了谷歌广告、百度广告的页面都将会被净化并隐藏相关广告
针对大部分网站通用的广告样式进行屏蔽美化
可按网址和关键词过滤搜索结果
您可自由修改网址和关键词词库且可随意导入导出备份
过滤大多数网站中谷歌联盟百度联盟的广告
去知乎广告,移除知乎官方不登录不让浏览的登陆弹窗
twitter和Youtube微博视频下载以及广告过滤
强化知乎B站豆瓣油管的过滤，过滤功能对搜索结果、评论、昵称等可以同时生效
	【模块化设计可自由的自定义开关功能】
若因为使用的网站更新而我们未及时更新导致部分功能异常的你都可以自由选择关闭和开启。
	【搜索结果优化】自动隐藏搜索结果中的各种广告，
可按网址和关键词屏蔽过滤搜索结果，已支持的搜索：百度、谷歌、百度、必应bing、360等
例如你可以自行添加需要屏蔽的网址或则关键词，如：百家号、baijiahao.baidu.com之类的
	【新增】twitter和Youtube微博视频下载以及广告过滤。播放遇到广告可自动跳过和屏蔽使用视频下载功能需自带梯子，不然无法下载。
视频解析功能基于视频解析站实现。感谢相关网站的服务
	白名单解决有些网页被错误过滤的情况，设置白名单后插件将在名单的页面停止运行
	2023.06.19  被动去广告增加对页面悬浮广告的删除能力。能屏蔽大部分牛皮癣广告了。
-如果误杀请自行关闭被动去广告
-如果页面显示错误可自行关闭被动去广告
-如果网页异常可在插件管理器里排除在该网站网址内运行
	增加对简书的广告过滤和某MP4下载站的广告过滤
	
说明：
声明：请您知晓本插件本是个人测试自用，本不完美也不保证可用性。
相关功能及代码均来自互联网及网友分享，我们仅做了相关功能的整合。
如无意中侵犯了哪个企业或个人等的知识产权，请联系我们将及时删除等相关处理
	2023.06.19  被动去广告增加对页面悬浮广告的删除能力。能屏蔽大部分牛皮癣广告了。
如果误杀请自行关闭被动去广告
	   */
	
var mmmjhy=0;
var bili22girl=true;
	function isMobile() {
let flag= false;
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
 flag= true;
}
return flag
}
	GM_setValue('zkdz_name', 'baiduga');
	function kgpingbisinfo() {
	  if (GM_getValue('allconfig')) {
    return;
  }
  if (GM_getValue('hasRunkgpingbisBefore')) {
  return;
  }
  GM_setValue('hasRunkgpingbisBefore', true);
  swal({
   title: "欢迎您、插件已针对大部分网站通用的广告样式进行屏蔽美化",
    text: "本插件提供了很多自定义功能，可以自由开启/关闭相应功能，本次更新新增了被动去广告。被动去广告并且会过滤大部分网站的图片悬浮广告。建议开启增加广告过滤效果",
    icon: "success",
    buttons: ['暂时不用', '开启被动去广告模式'],
  }).then((value) => {
    if (value) {
   let allconfig = GM_getValue('allconfig') || {};
      allconfig.baidu = allconfig.baidu || {};
      allconfig.baidu.kgpingbis = true;
      GM_setValue('allconfig', allconfig);
       swal({
      title: "已为您开启被动去广告模式。过滤规则后续会继续更新，过滤规则可能不兼容所有的页面。如果页面显示不正常可将当前页面加入白名单、或者在控制面板-高级功能--特色功能关闭",
      icon: "info",
    });
    } else {
    swal({
      title: "您已取消被动去广告模式,如果想体验被动去广告模式可在控制面板-高级功能-特色功能中开启",
      icon: "info",
    });
  }
  });
     }
	(function() {
	let windodwhost=window.location.host;
let ipdchcek=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
if (windodwhost.indexOf(':') >0 || ipdchcek.test(windodwhost)==true ){
return false;
	}
	// kgpingbisinfo();
	var configm='aHR0cHM6Ly93d3cuZGFkaXlvdWh1aTAxLmNuL2FwcC90b29sL3Y0LWJkdG9vbC5odG1s';
	configm=window.atob(configm);
	   GM_registerMenuCommand("【♐  控制面板-点击设置】", function(){
GM_openInTab(configm, {active: !0});
    });
var allconfig=new Array();
allconfig=
{
"baidu":       {'baidumenu':true,'baidulogo':true,'baidulianjie':true,'baiduhot':true,'baidueye':false,'baiducss':false,'baidutbq':true,'baidujdq':true,'kgbaidued':true,'kgbaiduad':true,'kggoogleed':true,'kggooglead':true,'kg360ed':true,'kg360ad':true,'kgbinged':true,'kgbingad':true,'kgtwied':true,'kgtwimv':true,'kgtwiad':true,'kgyoued':true,'kgyoumv':true,'kgyouad':true,'kgweixined':true,'kgweixinad':true,'kgdoubaned':true,'kgdoubanad':true,'kgzhihued':true,'kgzhihuad':true,'kgbilied':true,'kgbiliad':true,'kgweiboed':true,'kgweiboad':true,'kgweibomv':true,'kgpingbis':false,'Proactivelyads':false,'kgpingbiiframe':false,'addkwssbutton':true,'addssbutton':true,'baidueyecolor':'rgba(204,232,207,1)'},
"google":        {},
"so360":        {},
"pingbiurl":     [],
"whiteurl":     [],
"pingbikw":     [],
    };
    if (GM_getValue('allconfig')){
	   }else{
	   GM_setValue('allconfig', allconfig);
	   }
var configurl=window.location.href;
var configmain = document.domain;
var faviconurl = "https://favicon.yandex.net/favicon/v2/";
var faviconurlb = "https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=";
var favicmnurlb = "https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=";
var allconfigtime=1661760210;
var allconfigcz=0;
   if (GM_getValue('allconfigtime')){
   	   if (parseInt(GM_getValue('allconfigtime'))<allconfigtime){
   	   	   allconfigcz=1;
   	   	    GM_setValue('allconfigtime', allconfigtime);
   	   }
	   }else{
	   GM_setValue('allconfigtime', allconfigtime);
	   allconfigcz=1;
	   }
	   if (allconfigcz==1){
	   	   var saallconfig=new Array();
saallconfig=
{
"baidu":      {'baidumenu':true,'baidulogo':true,'baidulianjie':true,'baiduhot':true,'baidueye':false,'baiducss':false,'baidutbq':true,'baidujdq':true,'kgbaidued':true,'kgbaiduad':true,'kggoogleed':true,'kggooglead':true,'kg360ed':true,'kg360ad':true,'kgbinged':true,'kgbingad':true,'kgtwied':true,'kgtwimv':true,'kgtwiad':true,'kgyoued':true,'kgyoumv':true,'kgyouad':true,'kgweixined':true,'kgweixinad':true,'kgdoubaned':true,'kgdoubanad':true,'kgzhihued':true,'kgzhihuad':true,'kgbilied':true,'kgbiliad':true,'kgweiboed':true,'kgweiboad':true,'kgweibomv':true,'kgpingbis':false,'Proactivelyads':false,'kgpingbiiframe':false,'addkwssbutton':true,'addssbutton':true,'baidueyecolor':'rgba(204,232,207,1)'},
"google":        {},
"so360":        {},
"pingbiurl":     GM_getValue('allconfig').pingbiurl,
"whiteurl":     GM_getValue('allconfig').whiteurl,
"pingbikw":    GM_getValue('allconfig').pingbikw,
    };
GM_setValue('allconfig', saallconfig);
 console.log('已重置');
	   }
	    if(configmain.indexOf("baidu.com") > 0 ) {
$(document).ready(function(e) {
 $(this).keydown(function (e){
  if(e.which == "13"){
 bdgokw();
    }
 })
});
$('body').on('click',"input[id='su']",function(){
  bdgokw()
  })
      function bdgokw() {
      if (document.domain.indexOf("baidu.com") > 0 ) {
   if  ($("input[id='su']").length > 0 && $("input[id='kw']").length > 0 && $("input[class='search-input']").length ==0){
        let kwtxt=$("input[id='kw']").val();
   let kwurl='https://www.baidu.com/s?ie=utf-8&wd='+encodeURIComponent(kwtxt);
	     window.location.href=kwurl;
          }
   }
}
	 setTimeout(function(){
   if($("span[name='tj_settingicon']").length > 0){
 $("span[name='tj_settingicon']").after('<a class="s-top-right-text c-font-normal c-color-t s-top-right-new "style="position:relative;overflow: visible; " id="zk-top-gobtn"  >控制面板</ a>');
 $('body').on('click','#zk-top-gobtn',function(){
  GM_openInTab(configm, {active: !0});
  })
     }
}, 1000);
	   }
 function configjc() {
if (configmain.indexOf(window.atob('ZGFkaXlvdWh1aQ==')) >0 && configurl.indexOf(window.atob('YmR0b29sLmh0bWw=')) >0 ){
        if ($('#configload').length == 0 ) {
 $('body').attr('id','configload');
$('#dataversion').attr('version',GM_info.script.version);
$('#dataversion').html(GM_info.script.updateURL);
        }
  }else{
  	  return;
  }
   }
   $(document).ready(function(){
$('body').on('click','.layui-btn.whiteurl',function(){
	configjc();
    if ($(this).siblings('input').attr("data_zt")=="0"){
$(this).siblings('input').attr("data_zt","1");
$(this).text("准备删除中，手动点击保存后方可生效");
// 手动点击保存后方可生效，不点击保存按钮不会生效
	//若需按网址和关键词屏蔽过滤。请在控制面板中添加，并且手动点击保存后方可生效，不点击保存按钮不会生效
$(this).css("background-color","#908d8d");
        }else{
$(this).siblings('input').attr("data_zt","0");
$(this).text("删除");
$(this).css("background-color","#009688");
        }
	
})
	$('body').on('click','.layui-btn.pingbiurl',function(){
	configjc();
    if ($(this).siblings('input').attr("data_zt")=="0"){
$(this).siblings('input').attr("data_zt","1");
$(this).text("准备删除中，手动点击保存后方可生效");
// 手动点击保存后方可生效，不点击保存按钮不会生效
	//若需按网址和关键词屏蔽过滤。请在控制面板中添加，并且手动点击保存后方可生效，不点击保存按钮不会生效
$(this).css("background-color","#908d8d");
        }else{
$(this).siblings('input').attr("data_zt","0");
$(this).text("删除");
$(this).css("background-color","#009688");
        }
	
})
$('body').on('click','.layui-btn.pingbikw',function(){
	configjc();
    if ($(this).siblings('input').attr("data_zt")=="0"){
$(this).siblings('input').attr("data_zt","1");
	$(this).text("准备删除中，手动保存后方可生效");
$(this).css("background-color","#908d8d");
        }else{
$(this).siblings('input').attr("data_zt","0");
$(this).text("删除");
$(this).css("background-color","#009688");
        }
	
})
$('body').on('click','.layui-btn.whiteurladd',function(){
	configjc();
let addurl=$(this).siblings('input').val();
	
  if (addurl.length <5){
            alert("输入的网址太短");
 return;
   }
 if (addurl.indexOf("http") >=0){
 let addurldomain = addurl.split("/");
     if( addurldomain[2] ) {
    addurl=addurldomain[2];
}else{
     alert("输入的网址错误");
 return;
   }
     }else{
    if (addurl.indexOf(".") >0){
   }else{
     alert("输入的网址不合法");
 return;
   }
     }
	
	$("#whiteurl").prepend('<label class="layui-form-label" style=" width: 150px;">新增网址</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+addurl+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn whiteurl" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
$(this).siblings('input').val('');
	})
	$('body').on('click','.layui-btn.pingbiurladd',function(){
	configjc();
let addurl=$(this).siblings('input').val();
	
  if (addurl.length <5){
            alert("输入的网址太短");
 return;
   }
	 if (addurl.indexOf("www.baidu.com/link?") >=0){
             alert("此网址是百度的网址，屏蔽后可能出现问题。请使用其他的网站的链接");
	 return;
   }
 if (addurl.indexOf("http") >=0){
 let addurldomain = addurl.split("/");
     if( addurldomain[2] ) {
    addurl=addurldomain[2];
}else{
     alert("输入的网址不合法");
 return;
   }
     }else{
    if (addurl.indexOf(".") >0){
   }else{
     alert("输入的网址不合法");
 return;
   }
     }
	
	$("#pingbiurl").prepend('<label class="layui-form-label" style=" width: 150px;">新增网址</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+addurl+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn pingbiurl" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
$(this).siblings('input').val('');
	})
	$('body').on('click','.layui-btn.pingbikwadd',function(){
	configjc();
let addkw=$(this).siblings('input').val();
	
  if (addkw.length <2){
            alert("输入的关键词必须大于等于2个字 ");
 return;
   }
	
$("#pingbikw").prepend('<label class="layui-form-label" style=" width: 150px;">新增关键词</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+addkw+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn pingbikw" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
$(this).siblings('input').val('');
	})
 })
function sosave() {
	configjc();
	var whiteurlen=new Array();
	 $(".layui-btn.whiteurl").siblings('input').each(function(index,element) {
 if ($(this).attr("data_zt")=="0" && $(this).val().length >1){
  whiteurlen.push($(this).val());
}
})
whiteurlen=Array.from(new Set(whiteurlen));
whiteurlen=whiteurlen.slice(0,999);
	var pingbiurlen=new Array();
	 $(".layui-btn.pingbiurl").siblings('input').each(function(index,element) {
 if ($(this).attr("data_zt")=="0" && $(this).val().length >1){
  pingbiurlen.push($(this).val());
}
})
pingbiurlen=Array.from(new Set(pingbiurlen));
pingbiurlen=pingbiurlen.slice(0,999);
var pingbiukwen=new Array();
	 $(".layui-btn.pingbikw").siblings('input').each(function(index,element) {
 if ($(this).attr("data_zt")=="0" && $(this).val().length >1){
  pingbiukwen.push($(this).val());
}
})
pingbiukwen=Array.from(new Set(pingbiukwen));
pingbiukwen=pingbiukwen.slice(0,999);
var saallconfig=new Array();
saallconfig=
{
"baidu":      {'baidumenu':$("#baidumenu").find("input").prop("checked"),'baidulogo':$("#baidulogo").find("input").prop("checked"),'baidulianjie':$("#baidulianjie").find("input").prop("checked"),'baiduhot':$("#baiduhot").find("input").prop("checked"),'baidutbq':$("#baidutbq").find("input").prop("checked"),'baidujdq':$("#baidujdq").find("input").prop("checked"),'kgbaidued':$("#kgbaidued").find("input").prop("checked"),'kgbaiduad':$("#kgbaiduad").find("input").prop("checked"),'kggoogleed':$("#kggoogleed").find("input").prop("checked"),'kggooglead':$("#kggooglead").find("input").prop("checked"),'kg360ed':$("#kg360ed").find("input").prop("checked"),'kg360ad':$("#kg360ad").find("input").prop("checked"),'kgbinged':$("#kgbinged").find("input").prop("checked"),'kgbingad':$("#kgbingad").find("input").prop("checked"),'kgtwied':$("#kgtwied").find("input").prop("checked"),'kgtwimv':$("#kgtwimv").find("input").prop("checked"),'kgtwiad':$("#kgtwiad").find("input").prop("checked"),'kgyoued':$("#kgyoued").find("input").prop("checked"),'kgyoumv':$("#kgyoumv").find("input").prop("checked"),'kgyouad':$("#kgyouad").find("input").prop("checked"),'kgweixined':$("#kgweixined").find("input").prop("checked"),'kgweixinad':$("#kgweixinad").find("input").prop("checked"),'kgdoubaned':$("#kgdoubaned").find("input").prop("checked"),'kgdoubanad':$("#kgdoubanad").find("input").prop("checked"),'kgzhihued':$("#kgzhihued").find("input").prop("checked"),'kgzhihuad':$("#kgzhihuad").find("input").prop("checked"),'kgbilied':$("#kgbilied").find("input").prop("checked"),'kgbiliad':$("#kgbiliad").find("input").prop("checked"),'kgweiboed':$("#kgweiboed").find("input").prop("checked"),'kgweiboad':$("#kgweiboad").find("input").prop("checked"),'kgweibomv':$("#kgweibomv").find("input").prop("checked"),'kgpingbis':$("#kgpingbis").find("input").prop("checked"),'Proactivelyads':$("#Proactivelyads").find("input").prop("checked"),'kgpingbiiframe':$("#kgpingbiiframe").find("input").prop("checked"),'addkwssbutton':$("#addkwssbutton").find("input").prop("checked"),'addssbutton':$("#addssbutton").find("input").prop("checked"),'baiducss':$("#baiducss").find("input").prop("checked"),'baidueye':$("#baidueye").find("input").prop("checked"),'baidueyecolor':$("#baidueyecolor").val()},
"google":        {},
"so360":        {},
"pingbiurl":     pingbiurlen,
"whiteurl":     whiteurlen,
"pingbikw":    pingbiukwen,
    };
GM_setValue('allconfig', saallconfig);
	alert("已保存设置");
}
	function sosoreset() {
	if (configmain.indexOf(window.atob('ZGFkaXlvdWh1aQ==')) >0 && configurl.indexOf(window.atob('YmR0b29sLmh0bWw=')) >0 ){
	         if (GM_getValue('allconfig')){
	   }else{
	   GM_setValue('allconfig', allconfig);
	   }
    let allwconfig=GM_getValue('allconfig');
for(let i in allwconfig){
	    if ( Object.keys(allwconfig[i]).length > 0){
   if (i=="pingbiurl"){
$("#pingbiurl").html("");
        for(let b in allwconfig[i]){
     $("#pingbiurl").append('<label class="layui-form-label" style=" width: 150px;">已经屏蔽的网址'+(Number(b)+1)+'</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+allwconfig[i][b]+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn pingbiurl" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
           }
        }
   if (i=="whiteurl"){
$("#whiteurl").html("");
        for(let b in allwconfig[i]){
     $("#whiteurl").append('<label class="layui-form-label" style=" width: 150px;">白名单网址'+(Number(b)+1)+'</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+allwconfig[i][b]+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn whiteurl" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
           }
        }
 if (i=="pingbikw"){
$("#pingbikw").html("");
        for(let b in allwconfig[i]){
     $("#pingbikw").append('<label class="layui-form-label" style=" width: 150px;">已经屏蔽的关键词'+(Number(b)+1)+'</label>  <div class="layui-input-block" > <input type="text" name="title" data_zt="0" lay-verify="title"  value ="'+allwconfig[i][b]+'" autocomplete="off"   class="layui-input"   readonly="readonly" style="width: 300px;display: inline-block;margin-left: 50px;color: #898989;">   <button type="button" class="layui-btn pingbikw" style="display: inline-block;margin-left: 50px;">删除</button></div>'  );
           }
        }
	    for(let k in allwconfig[i]){
       //测试
           if (k=="baidueyecolor"){
       $("#"+k).val(allwconfig[i][k]);
        }
        if (k!="baidueyecolor"){
        if (allwconfig[i][k]==true){
$("#"+k).children("input:eq(0)").prop( "checked", true );
$("#"+k).children("div:eq(0)").attr("class","layui-unselect layui-form-switch layui-form-onswitch");
$("#"+k).find("em").html("ON");
            }else{
$("#"+k).children("input:eq(0)").prop( "checked", false );
$("#"+k).children("div:eq(0)").attr("class","layui-unselect layui-form-switch");
$("#"+k).find("em").html("OFF");
            }
 }
    }
    }
}
	}
}
$(document).ready(function(){
	    configjc();
    sosoreset();
	$('body').on('click','.layui-btn.sososave',function(){
configjc();
  //保存
   GM_setValue('allconfig', allconfig);
     sosave();
	           });
	$('body').on('click','.layui-btn.layui-btn-primary.sosoreset',function(){
  //重置
  configjc();
   GM_setValue('allconfig', allconfig);
     sosoreset();
     alert("已还原默认设置");
	           });
 })
		var zkddomain = document.domain;
		var zkdurldomain = location.href;
		 var zhihudl=0;
 		 var kgmmm=0;
if (GM_getValue('allconfig').whiteurl){
 if (GM_getValue('allconfig').whiteurl.length>0 ){
    for(let b in GM_getValue('allconfig').whiteurl){
         if (zkddomain.indexOf(GM_getValue('allconfig').whiteurl[b]) >=0){
          kgmmm=1;
         }
             }
             if (kgmmm==1){
             	 return;
             }
             }
           }
	
	if(zkddomain.indexOf(".op.gg") > 0 ) {
 $(".vm-placement").remove();
 $(".vm-placemmment").remove();
}
	if(zkddomain.indexOf(".ctyun.cn") >= 0 || zkddomain.indexOf("cloud.189.cn") >= 0) {
return;
}
	
	
	
var goingnuma=1;
var goingnumb=10;
 $(document).ready(function() {
 var ref = setInterval(function() {
kgpingbisgo();
}, 1000);
	setTimeout(function() {
  clearInterval(ref);
}, 2000);
	var t1 = setInterval(function(){
zkdurldomain = location.href;
delgoogle();
delzhihu();
delbili();
deldouban();
bing();
delbaidu();
delother();
del360();
	goingnuma++;
if (goingnuma>=goingnumb ){
	clearInterval(t1);
}
	},1000);
});
	
	
      if (window.top == window.self){
     if(zkdurldomain.indexOf("twitter.com") >= 0  || location.href.indexOf("youtube.com/watch?") >= 0 ) {
       $('body').on('click','#gogoxvideoa',function(){
    	 GM_setValue('gogoxvideodown', $(this).attr('data-url'));
    	window.open("https://www.getfvid.com/zh/twitter");
    })
    $('body').on('click','#gogoxvideob',function(){
    	 GM_setValue('gogoxvideodown', $(this).attr('data-url'));
    	window.open("https://9convert.com");
    })
    $('body').on('click','#gogoxvideoc',function(){
    	 GM_setValue('gogoxvideodown', $(this).attr('data-url'));
    	window.open("https://www.y2mate.com/download-youtube");
    })
    $('body').on('click','#gogoxvideod',function(){
    	 GM_setValue('gogoxvideodown', $(this).attr('data-url'));
    	window.open("https://zh.savefrom.net");
    })
	    }
      }
	  let tab_bd_tabcss = `#wrapper #content_left > div a{position:relative;text-decoration:none;}#wrapper #content_left > div a:before{content:"";position:absolute;width:0;left:0;bottom:-2px;border-bottom:solid 2px;-webkit-transition:width .38s ease-in-out;transition:width .38s ease-in-out;}#wrapper #content_left > div a:hover{color:#3476d2;}#wrapper #content_left > div a:hover:before{width:100%;}#wrapper #content_left >.c-container{padding:5px 20px 5px 20px;}#wrapper #content_left >.c-container:hover{border-radius:10px;box-shadow:0 6px 20px 0 rgb(0 0 0 / 30%);}`;
  let tab_bing_tabcss = `#b_results>.b_algo{padding: 12px 30px 0;}.b_algo a{position:relative;text-decoration:none;}.b_algo  a:before{text-decoration:none;content:"";position:absolute;width:0;left:0;bottom:-2px;border-bottom:solid 2px;-webkit-transition:width .38s ease-in-out;transition:width .38s ease-in-out;}.b_algo  a:hover{text-decoration:none;color:#3476d2;}.b_algo  a:hover:before{width:100%;}li.b_algo{padding:5px 20px 5px 20px;}li.b_algo:hover{border-radius:10px;box-shadow:0 6px 20px 0 rgb(0 0 0 / 30%);}`;
	  let tab_google_tabcss = `div.g{padding:5px 20px 5px 20px;}div.g:hover{border-radius:10px;box-shadow:0 6px 20px 0 rgb(0 0 0 / 30%);}`;
	  if (GM_getValue('allconfig').baidu.baiducss==true){
  if(zkdurldomain.indexOf('google.com') > 0  && zkdurldomain.indexOf('/search?') > 0 && !isMobile()){
  	  GM_addStyle(tab_google_tabcss);
  }
  if ((zkdurldomain.indexOf('/s?word') > 0 || zkdurldomain.indexOf('&wd=') > 0 || zkdurldomain.indexOf('?wd=') > 0 || zkdurldomain.indexOf('&word=') > 0)   && zkdurldomain.indexOf('baidu.com') > 0 && zkdurldomain.indexOf('&rtt=') < 0 && !isMobile()){
  	  GM_addStyle(tab_bd_tabcss);
  }
    if(zkdurldomain.indexOf('bing.com/search?') > 0 && zkdurldomain.indexOf('q=') > 0 && !isMobile()){
GM_addStyle(tab_bing_tabcss);
  }
  }
function kgpingbisgo() {
 var kgpingbiswhitezt=true;
 var kgpingbiswhiteurl = [
"recaptcha.google",
"captcha.qq.com",
"alicdn.com",
"aliyun.com",
"taobao.com",
"mall.com",
"weibo.com",
".le.com",
"iqiyi.com",
"tudou.com",
"qq.com",
"douyin.com",
"javascript:",
"youku.com",
"sohu.com",
"pptv.com",
"twitter.com",
"facebook.com",
"instagram.com",
"tiktok.com",
"imdb.com",
"vk.com",
"mtv.com",
"56.com",
"ku6.com",
"cntv.cn",
"cctv.cn",
"mgtv.com",
"yinyuetai.com",
"wasu.cn",
"163.com",
"1905.com",
"xunlei.com",
"funshion.com",
"youhui",
"pornhub.com",
"youtube.com",
"bilibili.com",
"mama.com",
"zhihu.com",
"baidu.com"];
	var whiteHosts = [
  'suning.com',
  'vip.com',
  'jd.com',
  'taobao.com',
  'mall.com'
];
	
if (whiteHosts.some(function (host) {
  return location.hostname.indexOf(host) > -1;
})) {
  kgpingbiswhitezt = false;
}
	var inputList = $("input").filter(":visible");;
	inputList.each(function() {
  var $this = $(this);
  var placeholder = $this.attr('placeholder') || '';
  if ($this.attr('name') === 'username' ||
      $this.is('[type="password"]') ||
      $this.attr('name') === 'password' ||
      $this.attr('type') === 'email' ||
       $this.attr('type') === 'phone' ||
      $this.attr('name') === 'email' ||
      $this.attr('name') === 'code' ||
      $this.attr('name') === 'phone' ||
      placeholder.indexOf('手机') !== -1 ||
      placeholder.indexOf('邮箱') !== -1 ||
      placeholder.indexOf('账号') !== -1 ||
      placeholder.indexOf('密码') !== -1 ||
      placeholder.indexOf('注册') !== -1) {
    kgpingbiswhitezt = false;
    return false;
  }
});
 //说明：此处是为了匹配某些网站登陆时插件错误屏蔽登陆验证的页面需要，防止不能正常登陆。并无没有收集用户的任何信息
 var classNames = ['data-down-ui', 'data-down-ui1', 'data-down-ui2'];
for (var i = 0; i < classNames.length; i++) {
    var className = classNames[i];
    if (document.getElementsByClassName(className).length > 0) {
      kgpingbiswhitezt = false;
        return;
    }
}
     if (GM_getValue('allconfig').whiteurl){
 if (GM_getValue('allconfig').whiteurl.length>0 ){
    for(let b in GM_getValue('allconfig').whiteurl){
         if (zkddomain.indexOf(GM_getValue('allconfig').whiteurl[b]) >=0){
          kgpingbiswhitezt=false;
         }
             }
             }
           }
 if (GM_getValue('allconfig').baidu.kgpingbiiframe==true && kgpingbiswhitezt){
 	  let iframehost=window.location.host;
	
 	  $("iframe").each(function(index){
	 	var iframeon=0;
	 	  	 if ($(this).attr("src")){
 	  	 	 let iframesrc=$(this).attr("src");
 	   for(let i = 0; i < kgpingbiswhiteurl.length; i++) {
      	  	   if (iframesrc.indexOf(kgpingbiswhiteurl[i])>=0){
      	  	   	   kgpingbiswhitezt=false;
      	  	   	   }
      }
	 	  	   if ($(this).attr("src").indexOf("http")==0 && window.location.href.indexOf("tool")<0 && window.location.href.indexOf("video")<0  && $(this).attr("src").indexOf("video")<0 &&  $(this).attr("src").indexOf("?url=")<0 && $(this).attr("src").indexOf(iframehost)<0 && kgpingbiswhitezt){
 	  	   	     $(this).remove();
 	  	   	      iframeon=1;
 	  	  }
 	  	 	 }
 if ( iframeon==0){
	       try {
    var inputElements = $(this).contents();
    try {
      var inputLength = inputElements.find('input').length;
       var textareaLength = inputElements.find('textarea').length;
       var imgLength = inputElements.find('img').length;
       var videoLength = inputElements.find('video').length;
      var bodyText = inputElements.find('body').first().text();
      var bodyTextLength =bodyText.length;
 if (inputLength > 0 || textareaLength > 0   || imgLength==0 || videoLength>0  || bodyTextLength > 200) {
        kgpingbiswhitezt = false;
      }
      if (kgpingbiswhitezt){
var imgElements = inputElements.find('img');
  var maxImgElement = null;
  var maxImgArea = 0;
	  imgElements.each(function() {
    var imgWidth = $(this).width();
    var imgHeight = $(this).height();
    var imgArea = imgWidth * imgHeight;
    if (imgArea > maxImgArea) {
      maxImgArea = imgArea;
      maxImgElement = this;
    }
  });
	  var iframeWidth = $(this).width();
  var iframeHeight = $(this).height();
  var iframeArea = iframeWidth * iframeHeight;
  var imgWidth = $(maxImgElement).width();
  var imgHeight = $(maxImgElement).height();
  var imgArea = imgWidth * imgHeight;
	  if (imgArea / iframeArea > 0.5) {
    $(this).remove();
     kgpingbiswhitezt = false;
  }
}
         if (kgpingbiswhitezt){
$(this).remove();
}
    } catch (error) {
      console.log('读取 iframe 失败');
    }
	} catch (error) {
  console.log('第', index + 1, '个非同源的 iframe');
}
	 	}
 		 	  })
}
 if (GM_getValue('allconfig').baidu.kgpingbis==true && kgpingbiswhitezt){
function getImageSize(element) {
	 if (element.attr('kxtool') ) {
  	    return false;
	}
  if (element.prop('tagName') === 'HTML' || element.prop('tagName') === 'HEADER'  || element.prop('tagName') === 'BODY' || element.prop('tagName') === 'MAIN') {
  	    return false;
	}
	  var childElements = element.find("*");
  for (var i = 0; i < childElements.length; i++) {
    var childTag = $(childElements[i]).prop('tagName');
	    if (childTag === 'HTML' || childTag === 'HEADER' || childTag === 'BODY'  || childTag=== 'MAIN') {
      return false;
    }
  }
  var $elem = element;
  var targets = [];
  if ($elem.prop('tagName') === 'IMG') {
    targets.push($elem);
  }
	    var $imgs = $elem.find('img');
    if ($imgs.length > 0) {
      var maxWidth = 0;
      $imgs.each(function() {
        var width = $(this).prop('naturalWidth') || $(this).width();
        if (width > maxWidth) {
          maxWidth = width;
          targets.push($(this));
        }
      });
    }
	  var $bgImgs = $elem.find('*').filter(function() {
    var style = getComputedStyle(this);
    return (
      style['background-image'] !== 'none' && style['background-image'] !== ''
    ) || (
      style['background'] && style['background'].includes('url(')
    );
  });
  if ($bgImgs.length > 0) {
    $bgImgs.each(function() {
      targets.push($(this));
    });
  }
	
  if (targets.length > 0) {
    var maxTarget = targets.reduce(function(max, target) {
      var width = target.width();
      return width > max.width ? {target: target, width: width} : max;
    }, {target: null, width: 0});
	if (maxTarget.target) {
  return {
    width: maxTarget.width,
    tag: maxTarget.target.prop('tagName'),
    url: maxTarget.target.attr('src'),
    rl: maxTarget.target.attr('style'),
    height: maxTarget.target.height()
  };
}
  }
	  return false;
}
	var windowHeight = $(window).height();
var windowwidth= $(window).width() *0.8;
var removeHeight=200;
if (isMobile()){
	 removeHeight=150;
	 windowwidth= $(window).width() *0.9;
}
var datag=true;
    if (window.location.href.indexOf('dadi') >0 || window.location.href.indexOf('teng') >0 ) {
 datag=false;
    }
    if (datag){
    		$('img').filter(function() {
  var $this = $(this);
  var offsetTop = $this.offset().top;
  return offsetTop >= 50 &&  $this.parents('picture').length === 0 &&  $this.width() >= windowwidth && $this.height() >10 && $this.height() <= removeHeight && $this.is(':visible');
}).remove();
	$('[style*="position: fixed"]').add('*')
  .filter(function() {
    return ($(this).css('position') === 'fixed');
  })
  .filter(function() {
    var classes = $(this).attr('class');
    return (!classes || !classes.match(/\b.*nav.*\b/));
  })
  .filter(':visible')
  .not('form, input')
  .each(function() {
    var $this = $(this);
    var hasFormOrInput = $this.find('form, input').length > 0;
    if (hasFormOrInput) {
      return;
    }
    var $imgs = $this.find('img');
    if ($imgs.length === 0) {
      return;
    }
    var $maxImg = $imgs.eq(0);
    var divarea = $this.width() * $this.height();
	    let getSize = getImageSize($this);
    if (getSize) {
      var IMGarea = getSize.width * getSize.height;
      if (IMGarea >= divarea * 0.8) { 
        $this.remove();
      } else {
        let Divthistext = /^\s*$/.test($this.text());
        if (Divthistext) {
          $this.remove();
        }
      }
    }
  });
	}
		}
	}
function delother() {
	var kuaizixun= "www.360kuai.com/";
var biliurl= "search.bilibili.com/";
var weixinurl= "weixin.sogou.com/weixin?";
var zhihuurl= "www.zhihu.com/search?";
var doubanurl= "www.douban.com/search?";
var doubanaurl= "search.douban.com/movie/subject_search?";
var weibourl= "weibo.com/";
var youurl= ".youtube.com";
var twiurl= "twitter.com/";
var csdn= "csdn.net";
var wanweibaike= "wanweibaike.net/wiki";
var yinhua= "dmh8.com";
var webkemono= "kemono.party";
	 if(zkdurldomain.indexOf("dang.com") >= 0  ){
 $('.fixed_s').remove();
}
	 if(zkdurldomain.indexOf(webkemono) >= 0  ){
 $("div[class='exo_wrapper exo_notransition']").remove();
  $("div[class='exo_wrapper']").remove();
    $("div[class='ad-container']").remove();
}
	 if(zkdurldomain.indexOf("www.jianshu.com/p") >= 0  ){
 $('div[style^="width: 200px; height: 400px; position: fixed; top:"]').remove();
 $('div[style^="display: block; padding: 0px; margin: 0px; z-index:"]').remove();
 $('div[style^="display: block; padding: 0px; margin: 0px; position: fixed; "]').remove();
}
	 if(zkdurldomain.indexOf("mp4") >= 0  ){
 $('#HMcoupletDivleft').remove();
  $('#HMcoupletDivright').remove();
  $('#hbidbox').remove();
  $('#HMRichBox').remove();
}
	$("script[src*='pos.baidu.com']").remove();
$("iframe[src^='https://g.163.com']").remove();
$("iframe[src*='pos.baidu.com']").remove();
$("iframe[src*='//googleads']").remove();
$("iframe[src*='show-3.mediav.com']").remove();
$("div[class*='wwads-cn wwads']").remove();
$("div[data-type='GoogleRender']").remove();
	 if(zkdurldomain.indexOf(yinhua) >= 0  ){
 	   $("#HMRichBox").remove();
 	   $("#fix_bottom_dom").remove();
 	   $("#HMCOVER_ID1").remove();
 	   $("div[style^='width:300px;height:300px;']").remove();
}
	
	 if(zkdurldomain.indexOf(wanweibaike) >= 0  ){
 	   $(".real-all-mask").css("position","unset");
 	   $("#page-report-modal").css("display","none");
}
 if(zkdurldomain.indexOf(csdn) >= 0  ){
 	 	 if ($("span[class='hide-preCode-bt']").length>0  ){
 	 	 $("span[class='hide-preCode-bt']").click();
 	 }
$("div[class='wwads-cn wwads-vertical']").remove();
$("#blogExtensionBox").remove();
	$("iframe[src*='//kunpeng-sc.csdn']").remove();
$("div[class='passport-login-container']").remove();
$("div[id='kp_box_blog_up']").remove();
$("div[id='kp_box_www_swiper']").remove();
$(".ad_fullWidth").remove();
$("div[class='weixin-shadowbox wap-shadowbox']").css("display","none");
$("div[class='hide-article-box hide-article-pos text-center']").css("display","none");
 $("div[id='article_content']").css({"overflow":"auto" ,"height":"auto"});
	$("div[class='readall_box']").css("display","none");
$("div[class='article_content']").css({"overflow":"auto" ,"height":"auto"});
 $('body').on('click','.hljs-button.signin,.unlogin-comment-bt,.toolbar-btn-login',function(){
 window.location.href="//passport.csdn.net/login";
    })
 if(zkdurldomain.indexOf('ink.csdn.net/?target=') >= 0  ){
 	 if($("a[class='loading-btn']").length>0  ){
 window.location.href=$("a[class='loading-btn']").attr("href");
  }
  }
	 }
 if(zkdurldomain.indexOf(weibourl) >= 0  ){
		 $("div[class='vue-recycle-scroller__item-view']").each(function(k,v){
    let zxcvlkw=$(this).find(".wbpro-feed-content").text();
    let bhnm=0;
     for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
          bhnm=1;
         }
             }
             	   if (GM_getValue('allconfig').baidu.kgweibomv==true){
   if ($(this).find(".wbpv-tech") && bhnm==0){
    if($(this).find(".wbpv-tech").attr('src') ){
    		if ($(this).find(".wbpv-tech").attr('data_zt') ){
   	   }else{
   	         $(this).find(".wbpro-feed-content").find("div:first").find("a:last").after('<a target="_blank"   href="'+$(this).find(".wbpv-tech").attr('src')+'">➦下载视频</a>');
   	   $(this).find(".wbpv-tech").attr('data_zt','0');
   	   }
    	}
    	}
   }
})
	   if (GM_getValue('allconfig').baidu.kgweibomv==true){
if(zkdurldomain.indexOf(weibourl) >= 0 &&  zkdurldomain.indexOf("/tv/show/") >= 0   ){
	 if($(".wbpv-tech").length>0  ){
	   if($(".wbpv-tech").attr('src') ){
    		if ($(".wbpv-tech").attr('data_zt') ){
   	   }else{
   	   $(".wbpv-tech").attr('data_zt','0');
   	      $("div[class='woo-box-flex woo-box-alignCenter']").prepend('<div class="woo-box-flex woo-box-alignCenter Detail_opt_2w8oi"><i class="star-font star-font--retweet"></i><a class="star-f12" style="color:#939393" href="'+$(".wbpv-tech").attr("src")+'">下载</a></div>');
	   	        	   }
    	}
}
}
	 }
}
	 if(zkdurldomain.indexOf(biliurl) >= 0 && GM_getValue('allconfig').baidu.kgbiliad==true){
 	 $(".video-list-item > .bili-video-card").each(function(k,v){
    let zxcvlkw=$(this).text();
      for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).hide();
         }
             }
})
 }
	 if(zkdurldomain.indexOf('bilibili.com/video/') >= 0 && GM_getValue('allconfig').baidu.kgbiliad==true){
 $("div[class='comment-list ']").find(".list-item.reply-wrap ").each(function(k,v){
     let zxcvlkw=$(this).find("p[class='text']").text().replace(/\ +/g,"");
     //主题
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
$("div[class='user']").each(function(h,j){
     let zxcvlkw=$(this).find("span[class='text-con']").text().replace(/\ +/g,"");
    // console.log(zxcvlkw);
     //评论
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
	 }
  if(zkdurldomain.indexOf('zhihu.com/question') >= 0 && GM_getValue('allconfig').baidu.kgzhihuad==true){
  	   $("div[class='css-14nvvry']").each(function(k,v){
   let zxcvlkw=$(this).text().replace(/\ +/g,"");
   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
    //$(this).remove();
            $(this).html('<div class="CommentContent css-1ygdre8">触发自定义关键词，已屏蔽</div>');
         }
             }
  	   })
	
 $("div[role='list']").find(".List-item").each(function(k,v){
 	 if ($(this).attr("zkdx")){}else{
 $(this).attr("zkdx","1");
     let zxcvlkw=$(this).find("div[class='RichContent-inner']").text().replace(/\ +/g,"");
     let zhdazhu=$(this).find("span[class='UserLink AuthorInfo-name']").text();
     zxcvlkw=zxcvlkw+zhdazhu;
     //问题回答
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
	
             	 if ( $(this).find("li").length>0){
  //问题评论
             	   	    $(this).find("li").each(function(h,j){
   let zxcvlkw=$(this).find("div[class='CommentRichText CommentItemV2-content']").text().replace(/\ +/g,"");
     let zhdazhu=$(this).find("a[class='UserLink-link']").text();
     zxcvlkw=zxcvlkw+zhdazhu;
   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
             	   	    	})
             }
	}
})
	
 }
     if(zkdurldomain.indexOf(doubanaurl) >= 0 && GM_getValue('allconfig').baidu.kgdoubanad==true){
 	 $("div[class='root']").find(".item-root").each(function(k,v){
    let zxcvlkw=$(this).find(".title").text();
// console.log(zxcvlkw);
      for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
	         }
             }
})
 }
	     if(zkdurldomain.indexOf(doubanurl) >= 0 && GM_getValue('allconfig').baidu.kgdoubanad==true){
 	 $("div[class='result-list']").find(".result").each(function(k,v){
    let zxcvlkw=$(this).find("h3").text();
      for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
 }
	  if(zkdurldomain.indexOf('douban.com/group/') >= 0 && GM_getValue('allconfig').baidu.kgdoubanad==true){
 $("table[class='olt']").find("tr").each(function(k,v){
    let zxcvlkw=$(this).text().replace(/\ +/g,"");
    	//主题
  	//console.log(zxcvlkw);
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
$("ul[class='topic-reply']").find("li").each(function(k,v){
    let zxcvlkw=$(this).text().replace(/\ +/g,"");
  	//评论
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
 }
	 //主页推荐
   if(zkdurldomain.indexOf(youurl) >= 0 && GM_getValue('allconfig').baidu.kgyouad==true){
 $("ytd-rich-item-renderer[class='style-scope ytd-rich-grid-row']").each(function(k,v){
    let zxcvlkw=$(this).text().replace(/\ +/g,"");
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
//搜索结果
 $("ytd-video-renderer[class='style-scope ytd-item-section-renderer']").each(function(k,v){
    let zxcvlkw=$(this).text().replace(/\ +/g,"");
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
	//评论
 $("ytd-comment-thread-renderer[class='style-scope ytd-item-section-renderer']").each(function(h,j){
    let zxcvlkw=$(this).text().replace(/\ +/g,"");
  	   for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
 }
	   if(zkdurldomain.indexOf(zhihuurl) >= 0 && GM_getValue('allconfig').baidu.kgzhihuad==true){
 	 $("div[class='List']").find(".Card.SearchResult-Card").each(function(k,v){
    let zxcvlkw=$(this).find(".Highlight").text();
  for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
 }
	  if(zkdurldomain.indexOf(weixinurl) >= 0 && GM_getValue('allconfig').baidu.kgweixinad==true){
 	 $("ul > li").each(function(k,v){
    let zxcvlkw=$(this).text();
    for(let b in GM_getValue('allconfig').pingbikw){
         if (zxcvlkw.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(this).remove();
         }
             }
})
 }
	 if(zkdurldomain.indexOf(kuaizixun) > 0 ){
 	 $("article[data-ggclick='ad']").remove();
 	  $("#as_shop_gg").remove();
 	  $("div[class='content clearfix']").not("[data-primitive-rawurl^='http']").remove();
 	 $("div[class='position--fixed--right--bottom']").remove();
 	 $(".unslider-ad").remove();
$("li[class*='recommend__item--gg--video']").remove();
$("div[class*='lawnfooter-image__panel']").remove();
$("div[class*='open-screen__ad']").remove();
 $("iframe[src*='mediav.com']").remove();
 $("div[class='card default detail--v3 default clearfix img--3']").hide();
 $("div[class='card default detail--v3 default clearfix img--0']").hide();
 $("div[class='kzx__showcase kzx__showcase--normal']").hide();
 $("div[class='right_aside_wrapper float--left']").hide();
 $("div[class='position--fixed--right--bottom  ']").hide();
 $("div[class='content__block clearfix']").hide();
 $("li[class='aside__item float--left recommend__item recommend__item--gg gg-subscript']").hide();
 $("div[class='bkg-block']").hide();
 $("div[class='recommend__item--gg']").hide();
 $("a[class='article__content__textgg']").hide();
 $("div[class='g4 ']").hide();
  $(".recommend-article__wrapper").hide();
  $("div[data-ggsrc]").remove();
}
 }
function delgoogle() {
		  if(zkdurldomain.indexOf('google.com') > 0  && zkdurldomain.indexOf('/search?') > 0){
	    	   if ( $('#bingconfig_btn').length>0){
  	   }  else{
  // $('#hdtb-tls').before('<a id="bingconfig_btn" class="gb_Sc" style="border: 1px solid transparent;   text-align: center;    border-radius: 2px;    line-height: 19px;    cursor: pointer;    margin-left: -1px;    padding: 4px 11px;  margin-right: -11px;"  href="'+configm+'"  >设置</a>');
  // 谷歌搜索页面的搜索控制按钮，注释后不会显示测按钮
  	   }
	  	    $($("div[id='rso']")).find("div[lang*='zh-']").each(function(zxb,hfd){
  	    	 let urlxzv="";
  	    	   let urlxzt="";
  	    	 urlxzv=$(hfd).find("a").attr("href");
 	  urlxzt=$(hfd).text();
	    let pingbijc=0;
     if (urlxzv){
     	        if (urlxzv.indexOf('/url?')==0 && urlxzv.indexOf('&url=')>0  ){
    let sdcurl = urlxzv.match(/\&url\=(\S*)\&/);
     	        	if (sdcurl){
    	urlxzv = sdcurl[1];
    	urlxzv=decodeURIComponent(urlxzv);
    	$(hfd).find("a").attr("href",urlxzv);
     	        	}
         	 	 }
    if (GM_getValue('allconfig').baidu.kggooglead==true){
    	   $("a[href*='http']").each(function() {
    	   	   if ( $(this).attr("zlogo")){}else{
    	   	   	 if ( $(this).find("h3").length>0){
    	   	   	 	 let logurl=$(this).attr("href");
    	    let urldomain = logurl.split("/");
let urldofavicon = "";
if( urldomain[2] ) {
 urldofavicon=faviconurl+urldomain[2]+"?size=32";
		}
$(this).attr("zlogo","1");
$(this).find("h3").prepend('<div style="border-radius: 1%;display: inline-block; max-width:24px; position: relative; top: 3px;background: rgba(0, 0, 0, 0);margin-right: 8px;"><img  style="max-width:24px;" src="'+urldofavicon+'"  ></div>');
	    	   	   	 }
    	   	   	 }
        })
	    	    if (GM_getValue('allconfig').baidu.baidulianjie==true){
         for(let b in GM_getValue('allconfig').pingbiurl){
         if (urlxzv.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
           $(hfd).remove();
             pingbijc=1;
         }
             }
    }
	  if ( pingbijc==0  ){
         for(let b in GM_getValue('allconfig').pingbikw){
         if (urlxzt.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(hfd).remove();
	         }
             }
    }
     }
 }
	  	     });
	}
	     if (GM_getValue('allconfig').baidu.kggoogleed==true){
$(".adsbygoogle").remove();
//$("#taw").remove();
$("#bottomads").remove();
$("script[src*='adsbygoogle.js']").remove();
$("script[src*='g.doubleclick.net']").remove();
$("div[id*='google_ads']").remove();
$("div[data-google-query-id]").remove();
	 }
	}
	function bing() {
	
  if(zkdurldomain.indexOf('bing.com/search?') > 0 && zkdurldomain.indexOf('q=') > 0 ){
   if (GM_getValue('allconfig').baidu.kgbinged==true){
  	   $(".b_ad").remove();
$(".b_bingoad").remove();
   $(".b_algo").each(function() {
   	   let b_algokg=0;
   	   	 if ($(this).find("p")){
		 	  if ($(this).find("p").attr("class")){
		 	  	  b_algokg=1;
		 	  }
		 }
		 	   if ($(this).text().indexOf('广告') >0){
		 	   	   b_algokg=1;
		 	   }
let anum=$(this).find(".b_attribution").children().length;
if (anum==1 && b_algokg==1){
//$(this).hide();
}
})
}
    	   if ( $('#bingconfig_btn').length>0){
  	   }  else{
  	   	    $('#id_sc').before('<span id="bingconfig_btn" class="cbtn" style="line-height: 45px;  margin-left:20px;margin-right:20px;"  onclick="window.location.href=\''+configm+'\';"  ><input type="button"   value="控制面板"></span>');
  	   }
     if (GM_getValue('allconfig').baidu.kgbingad==true){
  	    $($("li[class='b_algo']")).each(function(zxb,hfd){
	  	    	 let urlxzv="";
  	    	   let urlxzt="";
  	    	 urlxzv=$(hfd).find("h2").find("a").attr("href");
 	  urlxzt=$(hfd).text();
//console.log(urlxzv)
     let pingbijc=0;
     if (urlxzv){
    if (GM_getValue('allconfig').baidu.baidulianjie==true){
         for(let b in GM_getValue('allconfig').pingbiurl){
         if (urlxzv.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
           $(hfd).remove();
             pingbijc=1;
         }
             }
    }
    }
  if ( pingbijc==0 && urlxzt ){
         for(let b in GM_getValue('allconfig').pingbikw){
         if (urlxzt.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(hfd).remove();
	         }
             }
    }
	
  	     });
  	     	}
	}
	}
function del360() {
 if ( zkdurldomain=='https://www.so.com/' ||  zkdurldomain=='https://www.so.com' ||zkdurldomain.indexOf('www.so.com/?') > 0){
 if (GM_getValue('allconfig').baidu.kg360ed==true){
 	 $("ul[class*='mh-list g-list mh-sdk-sad gclearfix']").remove();
 	 $("div[class*='open-screen__ad']").remove();
 	 $("#__lawnImageContainer").remove();
 	  if($("div[id='lawnFooterCloseBtn']").length>0  ){
 	  	  $("div[id='lawnFooterCloseBtn']").click();
 	  }
 	   if($("div[id='lawnFooterCloseBtn']").length>0  ){
 	  	  $("div[id='lawnFooterCloseBtn']").click();
 	  }
	  $("#res_news_flow ").find("li").each(function() {
 if ($(this).find("span[class='txt']").length > 0){
      if ($(this).find("span[class='txt']").text()=='广告'){
$(this).remove();
   }
        }
        })
        	}
      	 }
      	        	  if (zkdurldomain.indexOf('m.so.com/s') > 0 ){
      	  openxcd();
      	  $("div[class^='g-card res-list']").each(function(mindex,mment) {
      	  	     if ( $(this).attr("data-kwkwed")==undefined ){
if ($(this).text()){
	 $(this).attr("data-kwkwed","1");
	            let pingbici=$(this).text();
 if (GM_getValue('allconfig').baidu.kg360ad==true){
         for(let b in GM_getValue('allconfig').pingbikw){
         if (pingbici.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
 $(mment).remove();
	         }
             }
  }
}
}
 if ( $(this).attr("data-kwurled")==undefined ){
	 $(this).attr("data-kwurled","1");
   	if ($(this).find("a").attr('href')){
   		let zogourl=decodeURIComponent($(this).find("a").attr('href').replace(/https:\/\/m.so.com\/jump\?u=/g,''));
   	for(let b in GM_getValue('allconfig').pingbiurl){
         if (zogourl.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
            $(mment).remove();
         }
             }
$(this).find("a").attr("href",zogourl);
        	}
        	}
        })
	      	  }
      	  if (GM_getValue('allconfig').baidu.kg360ed==true){
 	   if (zkdurldomain.indexOf('news.so.com') > 0 ){
 	   	   $("li[data-from='ad']").remove();
 	   }
 	      if (zkdurldomain.indexOf('tv.360kan.com') > 0 ){
 	   	   $("li > div[data-so-mod='list-ad']").remove();
 	   	   $("li > div[data-so-c='list-ad']").remove();
 	   }
 	     if (zkdurldomain.indexOf('image.so.com') > 0 ){
 	   $("li[class='cell']").each(function() {
 if ($(this).find("s").length > 0){
      if ($(this).find("s").text()=='广告'){
$(this).remove();
   }
        }
        })
 	   }
 	   if (zkdurldomain.indexOf('ly.so.com') > 0 ){
 	   $(".f-list-wrap").find("li").each(function() {
 if ($(this).find("i").length > 0){
 	 $(this).remove();
        }
        })
 	   }
 	     if (zkdurldomain.indexOf('baike.so.com') > 0 ){
  	     $(".right-ad-concern").remove();
  	     $("#J-mod-right-ad-interest").remove();
  	     $("#J-mod-right-recommend").remove();
  	     $(".doc-widget-rightbanner").remove();
   	$("div[class='box-bd cl js-plus-body']").remove();
   	$("div[class='boxwrap").remove();
	 	   }
 	      if (zkdurldomain.indexOf('wenku.so.com') > 0 ){
  	     $(".rt-side").remove();
  	     $(".side-mod").remove();
 	   }
 	   if (zkdurldomain.indexOf('fanyi.so.com') > 0 ){
  	     $("#card_container").remove();
 	   }
 	   if (zkdurldomain.indexOf('m.so.com') > 0 ){
	 	   	  $("div[class^='g-ad-card']").remove();
  $("div[class='tg-wrap").remove();
  $("div[data-so-biz-type]").remove();
 	   }
	 	    if (zkdurldomain.indexOf('m.news.so.com') > 0 ){
 	   	  $(".g-card.res-list.has-summary").remove();
 	   }
 	   if (zkdurldomain.indexOf('m.image.so.com') > 0 ){
 	      $("li").each(function() {
 if ($(this).find("div[class='li-txt li-cm li-cm--default']").length > 0){
$(this).remove();
        }
        })
 	   }
 	   if (zkdurldomain.indexOf('m.video.360kan.com/') > 0 ){
 	    $("li[data-so-mod='ad']").remove();
 	     $("li[class='recommend-item recommend-item__cm recommend-item__no-img']").remove();
	   }
	   if (zkdurldomain.indexOf('360kan.com') > 0 ){
	   $("li[class='v-list-item']:empty").remove();
	    $("li[data-so-mod='ad']").remove();
 	    $("a[class='link js-ad-curl']").remove();
 	    $("div[class*='info-flow__ad']").remove();
 	     $("div[class*='open-screen__ad']").remove();
  	   }
 	    if (zkdurldomain.indexOf('wenda.so.com') > 0 ){
 	    $("li[class='left-rec-list js-left-flow-busi']").remove();
 	    $("#attention").remove();
 	    $("div[class='mod-detail-normal pt25 hide js-mod-flow ']").remove();
 	    $("article[class='card']").remove();
 	    $("article[class='card-bor']").remove();
 	    $("div[class='busi-article js-busi-article']").remove();
 	    $("div[class='js-relate-list']").remove();
 	     $("ul[class='relate-list']").remove();
 	     $("section[class='g-card recflow-list js-recflow-list']").remove();
 	    $("#js-sd-list").remove();
	 	   }
 	     }
	   if (zkddomain.indexOf('so.com') > 0 && zkdurldomain.indexOf('so.com/s') > 0){
  if ( $("div[class='close").length > 0){
$("div[class='close").click();
      }
      $("ul[class='mh-list g-list mh-sdk-sad gclearfix']").remove();
	    $('.title.home-nav').attr('href',configm);
   	   $('.title.home-nav').text('控制面板');
   	   $("li[class='m-spread-middle e-buss").remove();
   	   $("#mohe-360pic_ext--normal").remove();
	   $($("li[class='res-list']")).each(function(zx,hfd){
 let urlxzv="";
  let urlxzt="";
 if ($(hfd).children("h3").children("a").attr("data-mdurl")){
	  urlxzv=$(hfd).children("h3").children("a").attr("data-mdurl");
 }else{
 urlxzv=$(hfd).children("h3").children("a").attr("href");
 }
 urlxzt=$(hfd).text();
//console.log(urlxzv)
     let pingbijc=0;
     if (urlxzv){
     	    if (GM_getValue('allconfig').baidu.kg360ad==true){
    if (GM_getValue('allconfig').baidu.baidulianjie==true){
         for(let b in GM_getValue('allconfig').pingbiurl){
         if (urlxzv.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
           $(hfd).remove();
             pingbijc=1;
         }
             }
    }
	  if ( pingbijc==0){
         for(let b in GM_getValue('allconfig').pingbikw){
         if (urlxzt.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
          $(hfd).remove();
	         }
             }
    }
    }
 }
});
	
     if (GM_getValue('allconfig').baidu.kg360ed==true){
	   	   $("#e_idea_pp").remove();
	   	      //  $("#side").remove();
	   $("#right_show_top").remove();
	   $("#right_show").remove();
	   $("#so_kw-ad").remove();
	   $("#lm-rightbottom").remove();
	   $("#res-mediav-right").remove();
	   $(".res-mediav-right").remove();
	   	    $("#mohe-360pic_sad--normal").remove();
	   	     $("#e_map_idea").remove();
	   	      $("#e_idea_pp_vip_bottom").remove();
  }
	
	   }
	        if (GM_getValue('allconfig').baidu.kg360ed==true){
	   	   if(zkddomain.indexOf('so.com') > 0 ){
		   	   $(".aside").remove();
		   	   	    $("#js-bussiness-bot-list").remove();
	   	      $("#js-mod-fixed-inn").remove();
	   	        $("#e_idea_wenda_leftBox").remove();
		}
	  if(zkddomain.indexOf('360kan.com') > 0 ){
	   	 $("li[data-clicklog]").remove();
    }
    }
}
	function openxcd() {
	if (GM_getValue('allconfig').baidu.baidumenu==true    && isMobile() ){
 if($(".zxbcopenxcd").length==0  ){
	$('body').append('<div   class="zxbcopenxcd" style="position: fixed;top: 85%;   right: 10%; width: 30px; z-index: 999999;"><img src="data:image/png;base64,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"   style="width: 30px;" >	</div>');
	}
	setTimeout(function(){
            $(".zxbcopenxcd").hide();
        }, 2500);
	}
  if (GM_getValue('allconfig').baidu.baidueye==true){
$("html body #page-bd article").css("background-color",GM_getValue('allconfig').baidu.baidueyecolor);
$("#head,#foot,.se-head-tablink,#relativewords,#page-hd,#page,#rs,#help,.foot-inner").css("background-color",GM_getValue('allconfig').baidu.baidueyecolor);
$("div[class='res-list g-mohe g-card g-block']").css("background-color",GM_getValue('allconfig').baidu.baidueyecolor);
   }
  }
$('body').on('click','.zxbcopenxcd',function(){
  GM_openInTab(configm, {active: !0});
  })
	function delbaidu() {
	   if(zkdurldomain.indexOf("baidu.com/") > 0 ) {
 if ( $("span[class='s-menu-item s-menu-mine']").length > 0 && $("span[class='s-menu-item current']").length > 0 &&  $("span[class='s-menu-item s-menu-mine']").attr('current') ==undefined ){
 	 $("span[class='s-menu-item s-menu-mine']").attr('current',1);
  	 $("span[class='s-menu-item s-menu-mine']").click();
	}
   	 //移动端
   	 	 if (GM_getValue('allconfig').baidu.kgbaidued==true){
  	 	 var xcbdjc=0;
   	 	   if ((zkdurldomain.indexOf('/s?word') > 0 || zkdurldomain.indexOf('&wd=') > 0 || zkdurldomain.indexOf('?wd=') > 0 || zkdurldomain.indexOf('&word=') > 0)  && zkdurldomain.indexOf('&rtt=') < 0){
   	 	   	   xcbdjc=1;
   	 	   	   goingnumb=600;
}
	
  if (xcbdjc==1){
 if ( $("div[class='result c-container new-pmd']").length > 0){
  	   	   $("div[class='c-result-content']").each(function(mindex,mment) {
   if ( $(this).find("a[data-click*=':']").length > 0){
   	            if ( $(this).find("a[data-click*=':']").text().indexOf("广告") >=0){
$(this).remove();
 }
 }
  })
        }
	      $("div[class='result-op c-container xpath-log new-pmd'][tpl='sp_hot_sale']").remove();
      $("div[class='result-op c-container xpath-log new-pmd'][tpl='b2b_prod']").remove();
      $("b[class^='cur-tab c-color-t cur-tab']").css('color','#626675;');
        $("#content_right").find(".c-row").remove();
     if ( $("a[class='toindex']").attr('href')!=configm){
        $("a[class='toindex']").attr('href',configm);
   	 $("a[class='toindex']").text('控制面板');
        }
  	    $("#top-ad").remove();
   if (isMobile()){
      	   openxcd();
      	   $('body').on('click','a',function(){
	if ($(this).attr("href")){
	window.location.href=$(this).attr("href");
	}
  })
   	   $("span[ref='open']").parent().parent().remove();
      	  $(".ec_wise_ad").remove();
       $(".ec-result-inner").remove();
        $(".c-result.result[srcid='xcx_multi']").remove();
        $("div[data-module='b']").remove();
         if (GM_getValue('allconfig').baidu.kgbaiduad==true){
$("div[class='c-result-content']").each(function(mindex,mment) {
if ($(mment).text()){
	            let pingbici=$(this).text();
         if ( $(mment).attr("data-kwkwed")==undefined ){
         for(let b in GM_getValue('allconfig').pingbikw){
 $(mment).attr("data-kwed","1");
         if (pingbici.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
 $(mment).remove();
         }
             }
    }
	}
    if ( $(mment).attr("data-kwurled")==undefined ){
if ($(mment).find("article")){
	if ($(mment).find("article").attr("rl-link-href")){
let bdzxmurl=$(mment).find("article").attr("rl-link-href");
  GM_xmlhttpRequest({
                  method : "GET",
                 dataType: "json",
                 timeout: 1000,
                url : bdzxmurl,
  onreadystatechange : function (response) {
  	  if (response.responseText){
bdzxmurl=response.responseText.match(/url=(\S*)"/)[1];
$(mment).find("article").attr("rl-link-href",bdzxmurl)
$(mment).find("a").attr("href",bdzxmurl)
 $(mment).attr("data-kwurled","1");
  for(let b in GM_getValue('allconfig').pingbiurl){
         if (bdzxmurl.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
	 $(mment).remove();
         }
             }
  	  }
	}
})
}
}
}
	        })
       }
    }
    }
     }
   //
         if(zkdurldomain=="https://www.baidu.com/"  || zkdurldomain=="https://www.baidu.com" || zkdurldomain.indexOf('www.baidu.com/?') > 0   ) {
         	   $("div[class='san-card'][tpl='feed-ad']").remove();
      	    if (GM_getValue('allconfig').baidu.baiduhot==true){
   $("div[class='hot-news-wrapper']").remove();
  $("#s-hotsearch-wrapper").remove();
	}
      	   }
      	     if(zkdurldomain.indexOf('baijiahao.baidu.com/s') > 0   ) {
       if (GM_getValue('allconfig').baidu.baiduhot==true){
     $("div[class^='index-module_topList']").remove();
}
      	    }
      	          	       if ((location.href.indexOf('.baidu.com/s') > 0 || location.href.indexOf('word=') > 0)   && location.href.indexOf('&rtt=') < 0 && isMobile()){
 $("div[class='c-result result']").each(function(index,element) {
 	     if ($(element).attr("d-lg") ){
 }else{
 	 let durl="";
 	 let durldata="";
 	 if ($(element).attr("data-log")){
 	 durldata=$(element).attr("data-log");
 	 durldata =JSON.parse(durldata);
durl=durldata.mu;
 	 }
      	$(element).attr("d-lg","1");
  if (  durl.indexOf("//")>= 0  ) {
      	 let urldomain = durl.split("/");
let urldofavicon = "";
if( urldomain[2] ) {
    urldofavicon=faviconurl+urldomain[0]+"//"+urldomain[2]+"?size=32";
	}
		if (GM_getValue('allconfig').baidu.baidulogo==true){
		if ($(element).find(".bd-icon-s").length==0){
	$(element).find(".single-text").before('<div class="c-img c-img-circle c-gap-right-xsmall" style="border-radius: 1%;display: inline-block;position: relative; top: 3px;background: rgba(0, 0, 0, 0);max-width:24px;"><span class="c-img-border c-img-source-border c-img-radius-large" style="background: rgba(0, 0, 0, 0);border: 0px solid rgba(0,0,0,0);"></span><img style="max-width:18px;border-radius: 3px;" src="'+urldofavicon+'"    onerror="javascript:this.parentNode.style.display = \'none\';" ></div>');
	$(".single-text").css("overflow","initial");
}
}
	}
}
 })
          }
   if(zkdurldomain.indexOf('www.baidu.com/s') > 0 && zkdurldomain.indexOf('&rtt=') < 0){
   	   	 if (GM_getValue('allconfig').baidu.kgbaidued==true){
        $("[cmatchid]").remove();
//$("#content_right").remove();
	  $("#top-ad").remove();
 $(".ec-pc_mat_c_banner__cc_banner_background_b").remove();//品牌广告模块
}
//右边栏
  if (GM_getValue('allconfig').baidu.baiduhot==true){
  	  $("#con-ar").remove();//热搜
}
$(".layout").remove();
$(".hint_right_middle").remove();
//$("#content_left").css("width","100%");
//$(".c-container").css("width","100%").css("padding-bottom","20px");
       if (GM_getValue('allconfig').baidu.baidueye==true){
$("html body").css("background-color",GM_getValue('allconfig').baidu.baidueyecolor);
$("#head,#foot,#page,#rs,#help,.foot-inner").css("background-color",GM_getValue('allconfig').baidu.baidueyecolor);
   }
//
	
	 $("div[id='content_left'] >div").each(function(index,element) {
 	 let t = $(element).children(':last-child').children(':last-child').text();
	if (t=="广告"){
		 if (GM_getValue('allconfig').baidu.kgbaidued==true){
 $(element).remove();
 }
}
   let xzggbt =$(element).find("span");
 if (xzggbt){
 	 	 if (GM_getValue('allconfig').baidu.kgbaidued==true){
 	 xzggbt.each(function(index,elnt) {
 	 if  ( $(elnt).text()=="广告"){
 	 	  $(element).remove();
 	 }
 	 })
 	 	 }
 }
	   let xzbt =$(element).find("h3").find("a");
  	    let durl=xzbt.attr("href");
	      if ($(element).attr("d-new") ){
           }else{
	
  	    	    if (durl){
	           if ( durl.indexOf("baidu.com/link?") >0  ){
           	     if  (durl.indexOf("eqid") < 0  ){
                    durl = durl + "&wd=&eqid=";
                  }
             let durltxt=xzbt.text();
           let durlhtml=durltxt;
            let wurl="";
                  GM_xmlhttpRequest({
                  method : "GET",
                 dataType: "json",
                 timeout: 2000,
                url : durl,
  onreadystatechange : function (response) {
  if (response.response){
   var urlzxa2=response.response.match(/URL=\'(\S*)\'/);
   xzbt.attr("href",urlzxa2[1]);
   durl=urlzxa2[1];
    $(element).attr("d-new","1");
	    	 if (durl){
    	 let bdvbt = $(element).children(':last-child').find('.c-showurl.c-color-gray');
	  if (bdvbt){
  	    let durlvtxt=bdvbt.text();
  	     let addurl=urlzxa2[1];
  //	    console.log(bdvbt.html())
   let addxurldomain = urlzxa2[1].split("/");
     if( addxurldomain[2] ) {
    addxurl=addxurldomain[2];
}
    	 	    if (durlvtxt.indexOf('.') < 0){
    	durlvtxt=durlvtxt+'：'+addxurl;
}else{
	durlvtxt=addxurl;
}
	bdvbt.text(durlvtxt);
bdvbt.attr('href',durl);
}
if (GM_getValue('allconfig').baidu.kgbaiduad==true){
     	 	   if (GM_getValue('allconfig').baidu.baidulianjie==true){
	         for(let b in GM_getValue('allconfig').pingbiurl){
         if (durl.indexOf(GM_getValue('allconfig').pingbiurl[b]) >=0){
	 $(element).remove();
         }
             }
    }
      }
      	       if ($(element).attr("d-lg") ){
	           }else{
           	     	$(element).attr("d-lg","1");
     	 let urldomain = durl.split("/");
let urldofavicon = "";
if( urldomain[2] ) {
    urldofavicon=faviconurl+urldomain[0]+"//"+urldomain[2]+"?size=32";
	}
	if($(element).find("h3").find("img").attr('src') ) {
	  urldofavicon=$(element).find("h3").find("img").attr('src');
}
	if (GM_getValue('allconfig').baidu.baidulogo==true){
if($(element).find("h3").find("img").attr('src') ) {
}else{
	if ($(element).find("h3").length==1){
	$(element).find("h3").find("a").prepend('<div class="c-img c-img-circle c-gap-right-xsmall" style="border-radius: 1%;display: inline-block;position: relative; top: 3px;background: rgba(0, 0, 0, 0);max-width:24px;"><span class="c-img-border c-img-source-border c-img-radius-large" style="background: rgba(0, 0, 0, 0);border: 0px solid rgba(0,0,0,0);"></span><img style="max-width:24px;" src="'+urldofavicon+'"    onerror="javascript:this.parentNode.style.display = \'none\';" ></div>');
}
}
	}
	    }
 }
}
	}
})
           }
    }
	}
      if ($(element).attr("d-old") ){
	           }else{
           	    	$(element).attr("d-old","1");
    let pingbijc=0;
 if (GM_getValue('allconfig').baidu.kgbaiduad==true){
         if ( pingbijc==0 ){
         for(let b in GM_getValue('allconfig').pingbikw){
         let pingbici=	 $(element).find("h3").find("a").text()+ $(element).find(".c-abstract").text();
         if (pingbici.indexOf(GM_getValue('allconfig').pingbikw[b]) >=0){
 $(element).remove();
	 pingbijc=1;
	         }
             }
    }
  }
     	 }
	
	})
	 if (GM_getValue('allconfig').baidu.kgbaidued==true){
   if(zkdurldomain.indexOf("sf/vsearch") < 0 ) {
      $("#content_left").find("div:eq(0)").each(function() {
          let bid = String($(this).attr("id"));
          let bclass = String($(this).attr("class"));
            if (bid == "undefined" && bclass == "undefined" ) {
      $(this).remove();
            }
        })
}
 }
	}
  if (GM_getValue('allconfig').baidu.kgbaidued==true){
    if(zkdurldomain.indexOf('zhidao.baidu.com') > 0){
        $(".shop-entrance").remove();
        $(".activity-entry").remove();
        $(".task-list-button").remove();
    }
     if(zkdurldomain.indexOf('zhidao.baidu.com/index/') > 0){
     	    if (isMobile()){
    	   	    $("div[class='ecs-wraper']").remove();
    	   }
     }
    if(zkdurldomain.indexOf('zhidao.baidu.com/search') > 0){
    	    	 if ($("i[class='ariaicon ariaicon-exit ariaexit fixedSelect ariaskiptheme']").length>0){
    	 	  $("i[class='ariaicon ariaicon-exit ariaexit fixedSelect ariaskiptheme']").click();
    	 }
    	   if (isMobile()){
    	   	    $("div[class='ecs-wraper']").remove();
    	   }
	        $(".bannerdown").remove();
        $(".aside.fixheight").remove();
        $(".wgt-bottom-ask").remove();
        $(".leftup").remove();
        $(".wgt-iknow-special-business").remove();
    }
    if(zkdurldomain.indexOf('zhidao.baidu.com/question') > 0){
	    	 if ($("i[class='ariaicon ariaicon-exit ariaexit fixedSelect ariaskiptheme']").length>0){
    	 	  $("i[class='ariaicon ariaicon-exit ariaexit fixedSelect ariaskiptheme']").click();
    	 }
         $("div[class^='wgt-vva']").remove();
        $(".feed-recommend-list").remove();
    	   	   if (isMobile()){
    	    $("div[class='wap-youx-change-asp']").remove();
    	    $("#feed-recommend").remove();
         $("div[class*='ecom-ads']").remove();
	
          if($(".circusee-bg").length>0  ){
          	$(".circusee-bg").hide();
	          	 $("div[class='chat-consult shorten']").css('height','auto');
          }
    }
           if($(".circusee-bg").length>0  ){
          	$(".circusee-bg").hide();
          	 $(".chat-consult-box").css('height','auto');
          }
    	$("#knowledge-answer").remove();
    	$(".grid-r.qb-side").remove();
        $(".wgt-ads").remove();
        $(".wgt-bottom-union").remove();
        $(".adTopImg").remove();
        $(".exp-topwld-tip").remove();
        $("#wgt-ecom-banner").remove();
        $("#wgt-ecom-right").remove();
        $(".question-number-text-chain").remove();
	            $(".ec-pc_mat_coeus__related_link_text-content").remove();
	    }
	     if(zkdurldomain.indexOf('wapbaike.baidu.com/item') >= 0){
	$("div[class='yitiao-content J-yitiao-content']").remove();
}
    if(zkdurldomain.indexOf('baike.baidu.com') > 0){
	            $("#navbarAdNew").remove();
            $(".userbar_mall").remove();
	    }
    if(zkdurldomain.indexOf('baike.baidu.com/item') > 0){
 $("a[onclick^='page.Mixedor.mixedOpen(this").remove();
	$(".yitiao-container").remove();
        //$(".before-content").remove(); 百度百科多义词和秒懂百科视频相关
        $(".configModuleBanner").remove();
	            $(".topA").remove();
            $(".right-ad").remove();
            $(".bottom-recommend-wrapper").remove();
            $(".lemmaWgt-promotion-vbaike").remove();
            $(".lemmaWgt-promotion-slide").remove();
            $("#side_box_unionAd").remove();
	    }
	    if(zkdurldomain.indexOf('wenku.baidu.com') > 0){
        $(".banner-ad").remove();
        $(".ad-box").remove();
        $("#banurl").remove();
        $("#my-wkHome-vip-tips").parent().remove();
        $(".vip-card").remove();
	            $(".zsj-topbar").remove();
            $(".lastcell-dialog").remove();
            $(".zsj-toppos").remove();
            $(".fc-result-container").remove();
	    }
    if(zkdurldomain.indexOf('wenku.baidu.com/search') > 0){
        $("#fengchaoad").remove();
         $("div[class='adlist-wrap']").remove();
        $(".yuedu-recommend-wrap").remove();
        $(".search-aside-adWrap").remove();
  $(".fc-first-result-wrap").remove();
    }
     if(zkdurldomain.indexOf('wk.baidu.com/') > 0){
            	$(".fc-result").remove();
           }
                 if(zkdurldomain.indexOf('haokan.baidu.com/') > 0){
         	$(".landrightbanner-content").remove();
       }
        if(zkdurldomain.indexOf('wk.baidu.com/view') > 0){
        	if (isMobile()){
	$(".middle-box-root").remove();
	$(".fc-ad-contain").remove();
	$(".shops-hot").remove();
	$(".b-bigpic-root").remove();
	$(".video-rec-wrap").remove();
	$(".shops-hot").remove();
	 $("div[class='new-guideapp-card-btn new-guideapp-card-animation']").remove();
$("div[class='reader-wrap reader-copy']").css('height','auto');
$("#view-app").css('max-height','');
	}
        }
    if(zkdurldomain.indexOf('wenku.baidu.com/view') > 0){
if (isMobile()){
	$(".middle-box-root").remove();
	$(".fc-ad-contain").remove();
	$(".shops-hot").remove();
	$(".b-bigpic-root").remove();
	$(".video-rec-wrap").remove();
	$(".shops-hot").remove();
	 $("div[class='fold-pager with-margin']").remove();
$("div[class='reader-wrap reader-copy']").css('height','auto');
$("#view-app").css('max-height','auto');
}
    	 $(".hx-bottom-wrapper").remove();
$(".hx-warp").remove();
$(".fc-fold-page").remove();
$(".hx-recom-wrapper").remove();
    	 $(".hx-bottom-wrapper").remove();
        $(".relative-recommend-wrapper").remove();
        $(".fc-container").remove();
        $("#ggbtm").parent().remove();
        $(".union-ad-bottom").remove();
        $(".ad-vip-close-bottom").remove();
    	   $(".operation-wrapper").remove();
        $(".relative-course-wrapper").remove();
        $(".hot-search-wrapper").remove();
        $(".hx-right-wrapper").remove();
        $("#relative-videos-wrap").remove();
        $(".add-has-money-pay").remove();
        $(".wk-color-vip-red").parent().parent().remove();
        $(".vip-tips-wrap").parent().remove();
        $(".top-ads-banner-wrap").remove();
	            $(".wangpan-tip").remove();
            $(".new-user-discount-tip").remove();
            $(".pay-vip-btn-wrap").remove();
            $(".relative-doc-ad-wrapper").remove();
	
            $(".view-like-recom-fc").remove();
	    }
	 if(zkdurldomain.indexOf('baidu.com/video/page') > 0){
 	$("div[class='na-ec-item']").each(function() {
 if ($(this).find("a[data-type='native_ad']").length > 0){
$(this).remove();
        }
        })
 }
 if(zkdurldomain.indexOf('baidu.com/s?') > 0){
 	 	$("div[class*='c-container ec_resitem']").remove();
 	 	$("span[ref='open']").parent().parent().remove();
 }
 if(zkdurldomain.indexOf('m.baidu.com') > 0 || zkdurldomain.indexOf('www.baidu.com') > 0){
 	 	$("div[style='overflow: hidden;background: #fff;position: relative;']").remove();
 }
 if(zkdurldomain.indexOf('baidu.com/sf/vsearch?pd=image_content') > 0){
	 	 	 $("body").on("click","div[class^='c-image-viewer-img']",function(){
  if($(this).find("img").length>0  ){
 	window.location.href=$(this).find("img").attr("src");
	 }
	 				 })
  $("body").on("click",".icon.icon-download",function(){
  if($(".c-image-viewer-item-current").find("img").length>0  ){
 	window.location.href=$(this).find("img").attr("src");
	 }
 				 })
	 	       $("div[class^='sfc-image-content-waterfall-item']").each(function() {
 if ($(this).find("div[class='sfc-image-content-img-toolbar-ad-text']").length > 0){
$(this).remove();
        }
         if ($(this).find("div[class='commodity-row-item']").length > 0){
$(this).remove();
        }
        })
 }
  if(zkdurldomain.indexOf('baidu.com/sf/vsearch?pd=video') > 0){
$("div[data-type='ad']").remove();
 }
   if(zkdurldomain.indexOf('baidu.com/sf/vsearch?pd=wenku') > 0){
     $("div[data-tpl='adv_wenku_fc']").remove();
 }
   if(zkdurldomain.indexOf('baidu.com/sf/vsearch?pd=tieba') > 0 || zkdurldomain.indexOf('baidu.com/sf/vsearch?pd=wenda_tab') > 0){
$("div[class*='c-container ec-container']").remove();
 }
    if(zkdurldomain.indexOf('image.baidu.com/search/index') > 0){
$("li[class='newfcImgli']").remove();
        $("#pnlBeforeContent").remove();
	            $(".fcImgli").remove();
	    }
    if(zkdurldomain.indexOf('image.baidu.com/search/detail') > 0){
        $(".text-link-ads").remove();
        $(".rsresult-card").remove();
        $("#adCard").remove();
    }
	if(zkdurldomain.indexOf('tieba.baidu.com/sf/vsearch') > 0){
        $("div[class*='c-container ec-container']").remove();
    }
    if(zkdurldomain.indexOf('tieba.baidu.com/f/search') > 0){
        $(".s_aside").remove();
    }
           if(zkdurldomain.indexOf('tieba.baidu.com/p/') > 0){
        	   	   if (isMobile()){
$("div[class='banner-wrapper-defensive']").remove();
$("div[class='fengchao-banner-defensive']").remove();
$("div[class='list-content']").find("div[class='list-content']").remove();
}
        	}
    if(zkdurldomain.indexOf('tieba.baidu.com/f?') > 0){
    		$(".bus-top-activity-wrap").remove();
    	$(".plat_recom_carousel").hide();
    	 $(".activity_head ").hide();
    	 $("#branding_ads").hide();
	    	 if ($(".activity_head").length>0){
    	 	 $(".head_main").css("margin-top","100px");
    	 }
    	  if (isMobile()){
$("div[class='tb-banner-wrapper-defensive tb-banner tb-threadlist__item']").remove();
}
    		 $("img[class='close_btn j_click_close']").click();
    		 $("div[class='clearfix thread_item_box']").remove();
    		 $("div[id='fc-wrap']").remove();
    		 $("#mediago-frs-aside").remove();
    		 $("#mediago-tb-pb-list-aside").remove();
    		 $("div[class='fengchao-wrap']").hide();
	
           $(".fengchao-wrap-box").remove();
 $("div[class='fengchao-wrap']").remove();
 $("div[id*='mediago-tb-']").remove();
$("div[class*='l_post'][data-field='{}']").remove();
$("div[ad-dom-img]").remove();
	
	
    }
    if(zkdurldomain.indexOf('tieba.baidu.com/p') > 0){
        //setInterval(function(){ }, 1000);
        //$("span:contains('广告')").parent().parent().parent().parent().parent().parent().remove();
        $("#branding_ads").hide();
         $("div[id='aside-ad-wrapper']").hide();
      $("#mediago-frs-aside").remove();
       $("div[id='aside-ad-wrapper']").hide();
      $("div[class='fengchao-wrap-feed']").hide();
    	$("#mediago-tb-pb-list-aside").remove();
    	$("div[class='fengchao-wrap']").hide();
	$("div[id*='mediago-tb-']").remove();
$("div[class*='l_post'][data-field='{}']").remove();
$("div[ad-dom-img]").remove();
    }
	
    if(zkdurldomain.indexOf('map.baidu.com/search') > 0){
	
            $(".damoce-search-item.damoce-search-item-nopoi").remove();
	    }
	
    if(zkdurldomain.indexOf('jingyan.baidu.com/search') > 0){
        $(".ec_ad").parent().remove();
        $("a[class='gogoxvideo']").remove();
    }
    if(zkdurldomain.indexOf('jingyan.baidu.com/article') > 0){
        $("#fresh-share-exp-e").remove();
        $(".wgt-income-money").remove();
        $(".aside-pro-container").remove();
        $("#bottom-ads-container").remove();
        $(".magzine-list").remove();
                $("div[class='aside-wrap wgt-cms-banner']").hide();
       $("div[class='right-fixed-related-wrap']").hide();
        $("div[class='ad-card']").hide();
       $("aside[class='rel-exp-feed-ad-item']").hide();
    }
	
	    if(zkdurldomain.indexOf('video.baidu.com') > 0 || zkdurldomain.indexOf('v.baidu.com') > 0){
	        	 $("#PCallpagesidebar1").remove();
            $("#PCallpagesidebar2").remove();
            $(".bdvideo-adver-carousel").parent().remove();
            $("div[id*='adone']").remove();
            $("div[id*='adtwo']").remove();
            $("#pallcommoncolumnad").remove();
            $("#index_right_top").remove();
            $("#qzfcadid").remove();
            $("#pcshortchannelTopRight").remove();
            $("#__lawnImageContainer").parent().parent().remove();
	            $("#detail_adm_right").remove();
            $(".ctt-adver1-banner").remove();
            $("div[id*='PCDetailPageTopRightList']").remove();
	
	
        	   $("div[id*='channelBannerAdver']").remove();
            $("div[id*='channelColumn']").parent().remove();
            $("div[id*='ChannelColumn']").parent().remove();
            $("div[id*='pc']").remove();
            $("div[id*='PC']").remove();
            $("div[id*='adv-carousel-item']").parent().remove();
            $("[id*='FeedAdSys']").remove();
            $("div[id*='TabAd']").remove();
            $(".section-ad").remove();
            $(".full-collunm-ad").remove();
	    }
    if(zkdurldomain.indexOf('video.baidu.com/v') > 0 || zkdurldomain.indexOf('v.baidu.com/v') > 0){
	        $(".top-ad-cont").remove();
	
            $("div[id*='searchMoreLong']").remove();
            $("#searchPagefeedBanner").remove();
            $(".side-content").remove();
            $("#psBottomColumn").parent().remove();
	
	            $("#searchResultAdOne").remove();
            $("#searchHotShortSeven").remove();
            $("#searchHotShortSevenTwo").remove();
	    }
    if(zkdurldomain.indexOf('www.baidu.com/sf/vsearch') > 0){
	        $("#s_tab").next().next().each(function() {
            var id = String($(this).attr("id"));
            if (id == "undefined") {
                $(this).remove();
            }
        })
    }
     }
 }
  }
 function delzhihu() {
 	 if (location.href.indexOf('link.zhihu.com/?target=')>= 0 ) {
	 if ($('p[class="link"]').length>0  ){
   window.location.href=$("p[class='link']").text();
  }
	}
 if(zkdurldomain.indexOf('zhihu.com') > 0){
   if (GM_getValue('allconfig').baidu.kgzhihued==true){
   	   $("div[class='Pc-card Card']").remove();
   	    if(zkdurldomain.indexOf('zhihu.com/signin?') > 0){
   	    	window.location.href='https://www.zhihu.com/knowledge-plan/hot-question/hot/0/day';
   	        }
	   	      	   if (isMobile()){
        $("a[class='MBannerAd']").remove();
        $("a[class='MHotFeedAd']").remove();
        $("div[class='Card RelatedReadings']").remove();
    }
	   if ( $('.Button.Button--primary.Button--blue').length>1  ){
   $('.Button.Button--primary.Button--blue').each(function(k,v){
  if ($(this).text().indexOf('立即登录/注册') ==0){
 	$(this).parent().hide();
 		    }
})
   }
 		   if ( $(".Button.Modal-closeButton.Button--plain").length>0 && $(".signFlowModal-container").length>0 &&  zhihudl==0){
 		   	   zhihudl=1;
 		   	   $(".Button.Modal-closeButton.Button--plain").click();
  	   }
	
$(".Pc-word").hide();
$(".Pc-feedAd").remove();
$(".Banner-adsense").remove();
	$("img").each(function(){
	      if ($(this).attr("alt")=="广告"){
	  $(this).remove();
	  }
});
    }
 }
}
	
 function delbili() {
if(zkdurldomain.indexOf('bilibili.com') > 0){
	   if (GM_getValue('allconfig').baidu.kgbilied==true){
$("div[class='flip-view p-relative over-hidden w-100']").remove();
if (bili22girl==true  && $("button[class='minimize-btn pointer bg-contain']").length>0){
 	$("div[class='haruna-ctnr none-select']").hide();
		bili22girl=false;
		   }
 $(".bili-video-card").each(function() {
 	 if ($(this).find("a")){
 	  if ($(this).find("a").attr('href')){
 	  if ($(this).find("a").attr('href').indexOf('cm.bilibili.com/cm/api/fees') > 0){
 	  $(this).hide();
 	 }
 	 }
 	 }
	   	           	})
        $("a[target='_blank']").each(function() {
           if ($(this).attr('href')) {
           	    if($(this).attr('href').indexOf('cm.bilibili.com/cm/api/fees') > 0){
           	    	 $(this).hide();
	           	    }
            }
	        })
    }
  }
}
	 function deldouban() {
 if(zkdurldomain.indexOf('douban.com') > 0){
// $('div[ad-status]').attr('ad-status')
  if (GM_getValue('allconfig').baidu.kgdoubaned==true){
        $('div[ad-status]').each(function() {
            if ($(this).attr('ad-status') == "appended") {
                $(this).remove();
            }
        })
    }
 }
}
 //test
	
    function closeytAds(){
        var adclose = document.querySelector('.ytp-ad-skip-button')||document.querySelector('.ytp-ad-overlay-close-button');
        var adybremove = document.querySelector('#player-ads')||document.querySelector('div#sparkles-container')||document.querySelector('ytd-compact-promoted-item-renderer')||document.querySelector('ytd-video-masthead-ad-v3-renderer');
          if (GM_getValue('allconfig').baidu.kgyoued==true){
        if(adybremove){
            adybremove.remove();
        }
        }
        if(adclose){
            adclose.click();
        }
    }
        function getytvele(){
    if($('div#info-contents').length>0){
       // addbtn();
    }else{
    setTimeout(getytvele,500);
    }
    }
      function inybit(){
        document.querySelector('ytd-popup-container').style.display='';
        document.querySelector('ytd-app').style.zIndex='';
    }
        function reytb(){
        closeytAds();
	        if(location.href!==zkdurldomain)
        {
	        inybit();
        zkdurldomain=location.href;
        getytvele();
        }
	    }
    if(zkdurldomain.indexOf("youtube.com") >= 0 ) {
	goingnumb=999999992;
      setInterval(function(){
     reytb();
     reydown();
       },1500);
    }
      setInterval(function(){
     deltwitter()
       },1500);
	
     function deltwitter() {
    if(zkdurldomain.indexOf("twitter.com") >= 0 ) {
	 $("article").each(function(index,element) {
  if ($(element).attr("d-twitter") ){
	           }else{
   let xzggtt =$(element).find("span");
 if (xzggtt){
 	 xzggtt.each(function(index,elnt) {
 	 if  ( $(elnt).text()=="推荐"){
 	 	  if (GM_getValue('allconfig').baidu.kgtwied==true){
 	 	  $(element).hide();
 	 	   }
 	 }
 	 })
 }
   }
	     let xzggaurl =$(element).find("a");
      let xzggavideo =$(element).find("video");
       let xzggatime =$(element).find("time");
	 if (xzggaurl && xzggavideo){
 	  if ($(element).attr("d-vurl") ){
	           }else{
 	if (xzggatime.length<2){
 		 xzggavideo.each(function(index,vurl) {
 	 if  (  $(vurl).attr('preload')){
 	 	   if ($(vurl).attr("d-vurl") ){
	           }else{
 	 xzggaurl.each(function(index,aurl) {
 	 if  ( $(aurl).attr('href')){
 	 	   if ($(vurl).attr("d-vurl") ){
	           }else{
   if (GM_getValue('allconfig').baidu.kgtwimv==true){
  if ($(aurl).attr('href').indexOf("status") >= 0 ) {
  	  let videourl = $(aurl).attr('href');
videourl = videourl.match(/status\/(\S*)/)[1];
videourl="https://twitter.com/i/status/"+videourl;
	 	   	    $(vurl).attr("d-vurl","1");
 	    $(vurl).attr("d-video",videourl);
 	    $(element).attr("d-vurl","1");
 	    $(element).find("div[role='group'][id^='id']").each(function(index,downbut) {
 	    	//$(downbut).remove();
  	    	    if ($(this).attr('downdown')==undefined){
  	    	    	$(this).attr('downdown','1');
  	    	    	$(this).attr('style',' border-top-width:0px !important;');
 	    	 $(downbut).before('<div style="margin-top: 10px;" downdown="1"><a style=" text-align:center;border:2px solid #DCDCDC;padding:3px 10px; background:#dddddd;border-radius:10px;-moz-border-radius:10px;" id="gogoxvideoa"  data-url="'+videourl+'" >下载视频线路一</a><a style=" text-align:center;border:2px solid #DCDCDC;padding:3px 10px; background:#dddddd;border-radius:10px;-moz-border-radius:10px;margin-left: 10px;" id="gogoxvideod" data-url="'+videourl+'" >下载视频线路二</a><div>'  );
}
	
	 	    	})
 }
 	   	    }
 	    }
 	 }
 	 })
 	 	 }
 	 }
 	  //   console.log('')
 	 	 })
 	 }
 	  }
 }
 $(element).attr("d-twitter","1");
	 })
	
 }
    }
	
	function reydown(){
    	  if(location.href.indexOf("youtube.com/watch?") >= 0 ) {
   if (GM_getValue('allconfig').baidu.kgyoumv==true){
  if ($("a[class='gogoxvideo']").attr('data-url')==location.href){
  	  return;
}  else {
	$(".gogoxvideo").remove();
 var basebtn = '<div style="margin-top:8px;" downdown="1" ><a    style="text-align:center;border:2px solid #DCDCDC;padding:3px 20px; background:#dddddd;border-radius:10px;-moz-border-radius:10px;width: 80px;" id="gogoxvideod"   class="gogoxvideo" data-url="'+location.href+'" data-durl="https://zh.savefrom.net" >下载视频线路一</a><a    style="margin-left: 10px;text-align:center;border:2px solid #DCDCDC;padding:3px 20px; background:#dddddd;border-radius:10px;-moz-border-radius:10px;width: 80px;" id="gogoxvideob"   class="gogoxvideo" data-url="'+location.href+'" data-durl="https://9convert.com" >高清线路二</a><a    style="margin-left: 10px;text-align:center;border:2px solid #DCDCDC;padding:3px 20px; background:#dddddd;border-radius:10px;-moz-border-radius:10px;width: 80px;" id="gogoxvideoc" class="gogoxvideo"  data-url="'+location.href+'"   data-durl="https://www.y2mate.com/download-youtube" >高清线路三</a></div>';
	     if($("div[downdown='1']").length==0){
  $('div#info-contents').after(basebtn);
   	 let playLineTd = document.querySelectorAll('.gogoxvideo');
	playLineTd.forEach(function(item){
	item.addEventListener('click',function(){
 console.log('custom click event triggered');
  GM_setValue('gogoxvideodown', $(this).attr('data-url'));
    	window.open($(this).attr('data-durl'));
	})
		})
}
	}
	 }
	    }
    }
    window.onload = function() {
       $('body').on('click','.gogoxvideo',function(){
 console.log("11");
    })
    	}
      if(location.href.indexOf("9convert.com") >= 0 ) {
  	  if (GM_getValue('gogoxvideodown')){
       setTimeout(function(){
       $("input[name='query']").attr('value',GM_getValue('gogoxvideodown'));
  GM_deleteValue('gogoxvideodown');
   $(".btn-red").click();
        }, 1000);
	  	  }
	    }
	    if(location.href.indexOf("y2mate.com/") >= 0 && location.href.indexOf("/download-youtube") >= 0 ) {
  	  if (GM_getValue('gogoxvideodown')){
  	      setTimeout(function(){
  $("input[name='query']").attr('value',GM_getValue('gogoxvideodown'));
  GM_deleteValue('gogoxvideodown');
   $("button[id='btn-submit']").click();
        }, 1000);
	  	  }
	    }
	  if(location.href.indexOf("savefrom.net") >= 0 ) {
  	  if (GM_getValue('gogoxvideodown')){
     setTimeout(function(){  $("input[name='sf_url']").attr('value',GM_getValue('gogoxvideodown'));
  GM_deleteValue('gogoxvideodown');
	     $("button[class='submit']").click();
        }, 1000);
	  	  }
	    }
      if(location.href.indexOf("getfvid.com/zh/twitter") >= 0 ) {
$("#s-hotsearch-wrapperwebone").remove();
$("#s-hotsearch-wrapperwebtone").remove();
$("#s-hotsearch-wrapperwebcone").remove();
$("#s-hotsearch-wrapperwebbone").remove();
  	  if (GM_getValue('gogoxvideodown')){
     setTimeout(function(){  $("input[name='url']").attr('value',GM_getValue('gogoxvideodown'));
  GM_deleteValue('gogoxvideodown');
     $("button[id='btn_submit']").click();
        }, 1000);
	  	  }
	    }
//
	    })()
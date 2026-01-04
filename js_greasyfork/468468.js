// ==UserScript==
// @name         【科学工具箱】整合好玩实用的各种功能，不定时持续更新中...
// @version     27
// @author      Paladin-M
// @namespace Z3JlYXN5Zm9yaw==
// @description   网站视频下载、图片批量下载。在线视频播放器。可以画中画播放。支持大部分网站视频、音频、图片等资源的下载，智能抠图去水印，新增二维码工具、新增m3u8视频下载、画中画功能
// @match        *://*/*
// @icon   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFySURBVDhPzdA/S0JhFMfxXxd6Ab0DjUywIashqPdQbbqVFaRDBWl/IW0JRKU9acsSGi1Qm4NKG6Jora2xqE3uc8/pPNf7aHsNDh8uZzjf+3DwNeNzXLN+6vLZHBliGg+sLT8hnm+A92uw03WQsV+Ho/1DwFv6nhtkQ2bF0YAEgmtLz0gUmmBZUplrsGFCPRHw2W1+1eVruTeYCKwuPiKeu3Nv0NIRQ99EA0WGSeNokA2KDiuOhZgmQ8n1dySKb+B8E6rwADZkJg0Uxq5rHHsGh7FDYzikAUyNvmAkVkNyoY4V+SaM+SriGnBKm64Sbf2S6jvjA0lMUxZTVLbSVMaGSHWcI6mhr0KkWZfMhsyq/4YZR5ShC2T41WJqQLEc05CZNHnBh+1Rv7SsigTytE3HSPOtBKpoUQ2qowpb0wFylT65QyLWlQSytEsn8oKmBGSJ6/J3j8yk9UbA8bRDbbY+JnK8Q0UJ3Ls3sM2Sx9H+GIDzA5wTVm/Huk5xAAAAAElFTkSuQmCC
// @require https://unpkg.com/jquery@2.1.4/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @require https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @require https://cdn.jsdelivr.net/npm/jquery.qrcode@1.0.3/jquery.qrcode.min.js
// @require https://greasyfork.org/scripts/469053-jsqr/code/jsQR.js?version=1207999

// @require https://cdn.jsdelivr.net/npm/m3u8-parser@4.7.1/dist/m3u8-parser.min.js
// @require https://greasyfork.org/scripts/468518-addqrcode/code/addqrcode.js?version=1204970

// @require https://update.greasyfork.org/scripts/468541/1398387/ADDimgdown.js


// @require https://cdn.jsdelivr.net/npm/vue@2.6.1/dist/vue.min.js
// @require https://greasyfork.org/scripts/468820-m3u8-hls/code/m3u8-hls.js?version=1206200
// @require https://greasyfork.org/scripts/468821-mux-mp4/code/mux-mp4.js?version=1206201
// @require https://greasyfork.org/scripts/469054-streamsaver/code/StreamSaver.js?version=1208001
// @require https://greasyfork.org/scripts/468813-downm3u8/code/downm3u8.js?version=1213558
// @require https://update.greasyfork.org/scripts/544081/1632542/hlsminjs.js
// @require https://update.greasyfork.org/scripts/469703/1296888/kxtool.js
// @license           End-User License Agreement
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
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
// @grant             GM_addStyle
// @grant             GM_download
// @downloadURL https://update.greasyfork.org/scripts/468468/%E3%80%90%E7%A7%91%E5%AD%A6%E5%B7%A5%E5%85%B7%E7%AE%B1%E3%80%91%E6%95%B4%E5%90%88%E5%A5%BD%E7%8E%A9%E5%AE%9E%E7%94%A8%E7%9A%84%E5%90%84%E7%A7%8D%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%8D%E5%AE%9A%E6%97%B6%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/468468/%E3%80%90%E7%A7%91%E5%AD%A6%E5%B7%A5%E5%85%B7%E7%AE%B1%E3%80%91%E6%95%B4%E5%90%88%E5%A5%BD%E7%8E%A9%E5%AE%9E%E7%94%A8%E7%9A%84%E5%90%84%E7%A7%8D%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%8D%E5%AE%9A%E6%97%B6%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.meta.js
// ==/UserScript==


/*
食用方法：
 安装插件成功后，
 会在页面最左边的中间出现一个橙色小竖条，
 鼠标移动到上面即可出现菜单页面
 所有功能都会被整合到此菜单中

 点击菜单即可享受

 2023.07.01 视频工具内置播放器可播放m3u8和mp4的视频，并且增加无限倍率以及画中画功能

 2023.06.29 增加主动过滤广告和被动过滤广告功能。基本上你可以自由的关闭页面的广告了。
你可以自由的删除网页上你不喜欢的内容
【被动去广告功能根据过滤规则过滤广告，
如果有些网页被错误过滤，可以点击浏览器右上方的油猴图标，
选择脚本右边的选项，选择排除该站点。这样可以使脚本在该网页停止运行】


 2023.06.27 新增视频画中画功能。此功能在视频工具菜单里，
粘贴视频地址后点击在线播放后，鼠标移动到视频画面中间有按钮。点击就可以进入画中画播放。
视频地址仅支持m3u8以及mp4格式


2023.06.22 增加视频下载和播放工具，可以在线观看和下载m3u8、MP4的视频

2023.06.13  增加二维码生成工具，可查看当前页面的二维码，可自定义二维码内容
 方便手机查看。解析二维码内容

 2023.06.12  第一个版本，支持大部分网站视频、音频、图片等资源的下载
并以缩略图形式展示，便于选择下载内容，
节省时间和流量。
部分加密视频无法下载，

请知悉。欢迎留言增加新功能

*/


var dataversion=8;
var mytoolzxSwitch=true;
var tooldve=false;
GM_setValue('m3u8url','');
// tooldve=true; //
(function() {
    'use strict';
var link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
 var $menu = $('<div id="mytoolzxmenu"></div>');
$menu.css({
    'position': 'fixed',
    'left': '0',
    'top': '40%',
    'transform': 'translateY(-50%)',
    'z-index': '9999999998',
    'cursor': 'pointer',
    'background-color': '#ff9900',
    'width': '5px',
    'height': '60px',
    'border-radius': '1px',
    'transition': 'width .5s'
})
.attr("mytoolzxversion", GM_info.script.version)
.appendTo('body');

// Add the click and hover events to the menu

$('body').on('click mouseenter',"#mytoolzxmenu",function(){
 if (!mytoolzxSwitch){
 	 return false
 }

     if ($("#mytoolzxmenuPage").is(':visible')) {
         $(this).animate({width: '5px'}, 300);
          $("#mytoolzxmenuPage").fadeOut(1000);
}else{
$("#mytoolzxmenuPage").fadeIn();
$(this).animate({width: '5px'}, 100);
}

});

$('body').on('mouseleave',"#mytoolzxmenuPage",function(){
	 if (!mytoolzxSwitch){
 	 return false
 }
if (tooldve){
}else{
   $("#mytoolzxmenu").animate({width: '3px'}, 300);
    $(this).fadeOut(1000);
}
});

// Set up the menu items
var Menudata = {
    version:dataversion,
    data: {
    download: {
        name: "常用功能",
        items: [
            { name: "下载页面资源" ,val: "img-down",tag: "0",type: ""},
            { name: "二维码工具" ,val: "addqrcode",tag: "0",type: ""},
            { name: "图片去水印" ,val: "0",go: "https://quququ.cn",tag: "0",type: ""},
            { name: "图片压缩" ,val: "0",go: "https://tinify.cn/",tag: "0",type: ""},
            { name: "智能抠图" ,val: "0",go: "https://www.remove.bg/zh",tag: "0",type: ""},
            { name: "在线PS" ,val: "0",go: "https://ps.gaoding.com/#/",tag: "0",type: ""},
            { name: "图片工具" ,val: "0",go: "https://picwish.cn/tools",tag: "0",type: ""},
            { name: "视频工具" ,val: "downm3u8",tag: "0",type: ""},
        ]
    },
    search: {
        name: "其他功能",
        items: [
            { name: "提需求",val: "0",go: "https://greasyfork.org/zh-CN/scripts/468468/feedback",tag: "0",type: ""},
            { name: "赏好评",val: "0",go: "https://greasyfork.org/zh-CN/scripts/468468/feedback" ,tag: "0",type: ""},
             { name: "征集好用好玩的网站。我会添加到这里",val: "0",go: "https://greasyfork.org/zh-CN/scripts/468468/discussions/187908",tag: "0",type: "" },
        ]
    },
    	f2h: {
        name: "自定义开关功能区",
        items: [
        	 { name: "主动去广告" ,val: "Proactivelyads",tag: "0",type: "button",str: "打开后页面右上角会出现调试按钮。进入调试模式移动鼠标，可以点击你需要删除的页面元素包括广告。误删可以使用恢复按钮即可让页面恢复正常。适合大部分网页。重新打开页面生效"},
        	 { name: "被动去广告" ,val: "Passiveads",tag: "1",type: "button",str: "打开此功能后会自动删除常见的悬浮广告和第三方iframe广告，适合大部分网页。重新打开页面生效"},
    		 { name: "陆续开发中有建议反馈" ,val: "addqrcode",tag: "1",type: "button"},
    		     ]
    },
},
};




  function defaultMenua(Menudata) {
  	  GM_setValue('Menua',Menudata);
  	  toastr.success('操作成功！', '', {
  positionClass: 'toast-bottom-right',
  closeButton: true, // 是否显示关闭按钮
  progressBar: true, // 是否显示进度条
  timeOut: 2000 // 显示时间（毫秒）
});
  }




  function shouldUpdateMenua(Menulold, Menulnew) {

// 比较版本号大小，确定新版本和旧版本
var Menuall = (Menulold.version > Menulnew.version) ? Menulold : Menulnew;
var oldVersion = (Menulold.version < Menulnew.version) ? Menulold : Menulnew;

// 如果存在旧版本，则将新版本的tag按照旧版本保存
    for (var item in Menuall.data) {
        if (Menuall.data.hasOwnProperty(item)) {
            for (var i = 0; i < Menuall.data[item].items.length; i++) {
                var newTag = Menuall.data[item].items[i].tag;
                 var oldTag = (oldVersion && oldVersion.data[item].items[i]) ? oldVersion.data[item].items[i].tag : 0;
                if (newTag !== oldTag) {
                if (newTag=="1"){
                	 Menuall.data[item].items[i].tag=="1";
            }else{
              Menuall.data[item].items[i].tag = oldTag;
            }
                }
            }
        }
    }


GM_setValue('Menua', Menuall);
  return Menuall;
  }

var Menuall = GM_getValue("Menua", Menudata);

Menuall= shouldUpdateMenua(Menudata, Menuall);

setTimeout(function(){
//
},1000)


var $menuPage = $('<div id="mytoolzxmenuPage"></div>');
$menuPage.css({
    'position': 'fixed',
    'left': '0',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'z-index': '9999999999',
    'padding': '20px',
    'background-color': '#fff',
    'max-width': '500px',
    'max-height': '800px',
    'min-width': '250px',
    'min-height': '450px',
    'border-radius': '0 20px 20px 0',
    'box-shadow': '5px 0 15px rgba(0,0,0,0.3)',
    'display': 'none',
    'flex-direction': 'column',
    'align-items': 'stretch',
    'overflow-y': 'auto'
})
.attr("mytoolzxversion", GM_info.script.version)
.appendTo('body');

var mytoolzxmenuPage = $('#mytoolzxmenuPage[mytoolzxversion="'+GM_info.script.version+'"]');
    var label = $('<div class="label" godefault="default">[重置]  版本:'+GM_info.script.version+'</div>');
    mytoolzxmenuPage.append(label);
    GM_addStyle('#mytoolzxmenuPage {position: relative;} .label {position: absolute;bottom: 0;left: 0;font-size: 12px;color: #666;}');


window.onload = function() {
  setTimeout(removemyFunction(), 500);
};
function removemyFunction() {
	$('[id="mytoolzxmenu"]').each(function() {
  var elementVersion = $(this).attr("mytoolzxversion");
  if (!elementVersion) {
  	  mytoolzxSwitch=false;
if (confirm("发现工具箱旧版本，旧版本和新版本不兼容。关闭旧版本后升级。是否确定升级？")) {
  window.location.href = "https://greasyfork.org/zh-CN/scripts/468468";
}
  }
});
$("[mytoolzxversion]").each(function() {
  var  elementVersion = $(this).attr("mytoolzxversion");
  if (elementVersion && parseFloat(elementVersion) < parseFloat(GM_info.script.version)) {
  	mytoolzxSwitch=false;
    console.log("停止脚本运行，版本不匹配");
    $(this).remove();
}
});

}
// Add the menu items to the menu page
var Menualldata=Menuall.data;
for (var key in Menualldata) {
    var $menuItem = $('<div class="menuItem"></div>');
    $menuItem.css({
        'display': 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'center',
        'justify-content': 'center',
        'width': '100%',
        'border-radius': '10px',
        'margin-bottom': '10px',
        'margin-top': '30px',
        'cursor': 'pointer',
        'transition': 'all .2s',
        'position': 'relative',
        'height': 'auto',
    })
    .appendTo($menuPage);

    var $categoryName = $('<div class="categoryName"></div>');
    $categoryName.text(Menualldata[key].name);
    $categoryName.css({
        'color': '#ff9900',
        'font-size': '16px',
        'position': 'absolute',
        'top': '-25px',
        'left': '50%',
        'transform': 'translateX(-50%)',
    })
    .appendTo($menuItem);

    var totalHeight = 0;
    var subItemCount = Menualldata[key].items.length;

    for (var i in Menualldata[key].items) {
        var $subItem = $('<div class="subItem"></div>');
        var subItem=Menualldata[key].items[i].name;
        $subItem.text(Menualldata[key].items[i].name);
        $subItem.css({
            'padding': '5px 0px ',
            'border-radius': '5px',
            'cursor': 'pointer',
            'transition': 'all .2s',
            'flex-grow': 1,
            'min-width': '80px',
            'max-width': '100px',
            	'font-size': '15px',
            	'font-weight': '500',
            	'justify-content': 'center',
            	'align-items': 'center',
            	'text-align': 'center',
            	'border': '1px solid #ccc',
            	'background': '#fff',
            	'margin': '2px 5px',
            	'position': 'relative',
        })
        .attr("gotool", Menualldata[key].items[i].val)
        .hover(function() {
	  $(this).css({'background-color': '#ff9900', 'color': '#fff'});

            if ($(this).index() == 0) {
                $(this).parent().find('.categoryName').css('visibility', 'visible');
            }
        }, function() {

            if ($(this).attr("tag")=="1") {
   $(this).css({'background-color': '#e1dfdf', 'color': '#978e8e'});
}  else{
$(this).css({'background-color': '#fff', 'color': '#000'});
}
            if ($(this).index() == $(this).parent().children().length - 1) {
                $(this).parent().find('.categoryName').css('visibility', 'visible');
            }
        })
        .appendTo($menuItem);
// 获取自定义属性值
var customAttr = $subItem.attr('gotool');

// 根据自定义属性值更改背景色
if (Menualldata[key].items[i].val=="Proactivelyads" && Menualldata[key].items[i].tag=="0" ) {

var butjc = GM_getValue(Menualldata[key].items[i].val);
if (butjc !== undefined && butjc == "0") {
		ProactivelyadsBtn()
	}
 Proactivelyads();
var intervalID = null;
window.addEventListener('load', function() {
  intervalID = setInterval(Proactivelyads, 1000);
});

setTimeout(function() {
  clearInterval(intervalID);
}, 5000);



}
if (Menualldata[key].items[i].val=="Passiveads" && Menualldata[key].items[i].tag=="0" ) {
  var intervalID = null;
window.addEventListener('load', function() {
  intervalID = setInterval(Passiveads, 1000);
});

setTimeout(function() {
  clearInterval(intervalID);
}, 15000);
}



if (Menualldata[key].items[i].go) {
    $subItem.attr("go", Menualldata[key].items[i].go);
}
if (Menualldata[key].items[i].tag) {
    $subItem.attr("tag", Menualldata[key].items[i].tag);
    $subItem.attr("title", Menualldata[key].items[i].name);
if (Menualldata[key].items[i].str){
$subItem.attr("str", Menualldata[key].items[i].str);
}
    if (Menualldata[key].items[i].tag=="1") {
     $subItem.css({'background-color': '#e1dfdf', 'color': '#978e8e'});
   $subItem.html('<span class="line"></span>'+ $subItem.attr("title"));
}
}
if (Menualldata[key].items[i].type) {
    $subItem.attr("type", Menualldata[key].items[i].type);
}
        totalHeight += $subItem.outerHeight(true)-5;
    }

    // Set the height of menuItem to the total height of subItems plus 40px padding
   // $menuItem.css('height', totalHeight + 40);

    // Calculate the border radius based on whether it's the first or last row
    if (subItemCount == 1) {
        $menuItem.css('border-radius', '10px');
    } else if (key == 0) {
        $menuItem.css('border-top-left-radius', '10px');
        $menuItem.css('border-top-right-radius', '10px');
    } else if (key == Object.keys(Menuall).length - 1) {
        $menuItem.css('border-bottom-left-radius', '10px');
        $menuItem.css('border-bottom-right-radius', '10px');
    }


// Inject the CSS
GM_addStyle('#mytoolzxmenuPage .menuItem:first-child { margin-top: 0; }');

GM_addStyle(`
.subItem .line {
  display: block;
  width: 100%;
  position: absolute;
  top: 50%;
  border-bottom: 1px dashed #fff;
}

#mytoolzxmenuPage .menuItem {
    background-color: #fff;
    color: #000;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
#mytoolzxmenuPage .subItem:hover {

}
`);
}

    // bind click event to download button
$("body").on('click', '[godefault="default"]', function() {
	hidemenu();
	  swal({
    title: "提示",
    text: "您是否要重置工具箱的所有设置？",
    icon: "warning",
    buttons: ["取消", "确定"],
  }).then((value) => {
    if (value == true) {
  defaultMenua(Menudata);
    } else {
      return;
    }

  })

	})
$("body").on('click', '[gotool][go]', function() {
 GM_openInTab($(this).attr("go"), {active: !0});
 return false
	})

 $("body").on('click', '[gotool][tag][type="button"]', function() {
 	 var  vthis= $(this);
 	  hidemenu();
 if (!mytoolzxSwitch){
 	 return false
 }
if (vthis.attr("gotool")=="Proactivelyads"){
		  swal({
    title: "提示",
    text: ""+vthis.attr("str")+"",
    icon: "warning",
    buttons: ["取消", "确定"],
  }).then((value) => {
    if (value == true) {
GM_setValue(vthis.attr("gotool"),'0');
 ProactivelyadsBtn();
    } else {
      return;
    }

  })

    return;
 }
var txt="";
var tag=vthis.attr("tag");

var ftxt="";
if (tag=="1"){
	txt="开启【"+vthis.attr("title")+"】";
	ftxt="关闭";
}else{
txt="关闭【"+vthis.attr("title")+"】";
ftxt="开启";
}
 	  swal({
    title: "提示",
    text: "是否"+txt+"此功能？\n"+txt+"后再次点击此按钮继续"+ftxt+"此功能\n"+vthis.attr("str")+"",
    icon: "warning",
    buttons: ["取消", "确定"],
  }).then((value) => {
    if (value == true) {
   changetag(vthis);
    } else {
      return;
    }

  })

	})
$("body").on('click', '[gotool="addqrcode"]', function() {
		 if (!mytoolzxSwitch){
 	 return false
 }
ADDqrcode();
hidemenu();
	})

$("body").on('click', '[gotool="img-down"]', function() {
		 if (!mytoolzxSwitch){
 	 return false
 }
         hidemenu();
         ADDimgdown()
})
$("body").on('click', '[gotool="downm3u8"]', function() {
		 if (!mytoolzxSwitch){
 	 return false
 }
         hidemenu();

         sectionm3u8menu(GM_getValue("m3u8url", ""));
})

function hidemenu() {
	 if (!mytoolzxSwitch){
 	 return false
 }
	$("#mytoolzxmenu").animate({width: '3px'}, 300);
       $("#mytoolzxmenuPage").fadeOut(1000);
     }
function changetag(v) {
   var tagValue = v.attr("tag");
   var tag="0";
   if (tagValue == "0") {
   tag="1";
    v.attr("tag", tag);
    v.html('<span class="line"></span>'+v.attr("title"));
    v.css({'background-color': '#e1dfdf', 'color': '#978e8e'});
  } else {
   v.attr("tag", tag);
   v.find("span").remove();
   v.css({'background-color': '#fff', 'color': '#000'});
  }


var Menuall = GM_getValue('Menua', Menudata);

var itemName = v.attr("title");
for (const key in Menuall.data) {
  if (Menuall.data.hasOwnProperty(key)) {
    const items = Menuall.data[key].items;
    for (const item of items) {
      if (item.name === itemName) {
        item.tag =tag;
      }
    }
  }
}
GM_setValue('Menua', Menuall);

  }


})();
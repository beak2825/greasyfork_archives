// ==UserScript==
// @name         百度手机版
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  百度安卓电脑版适配手机版
// @author       happmaoo
// @license MIT
// @match        http://www.baidu.com/*
// @match        https://www.baidu.com/*
// @match        https://top.baidu.com/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/508409/%E7%99%BE%E5%BA%A6%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/508409/%E7%99%BE%E5%BA%A6%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
// 手机上搜索:https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%s&oq=%s&rsv_pq=99d32142000c53f2&rsv_t=ec2cbBIDFAlU2Z1C%2F3y%2Bo2AvambNkqHArI4qC438tZwMhd1VVGcOrl5ySRg&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t
  function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=0.9, minimum-scale=0.9, maximum-scale=0.9, user-scalable=no";
    document.head.append(el);
  }

(function() {
    'use strict';
viewport();

/*普通页面*/
var mycss = `

#lg,#result_logo,#content_right,#foot,#left-tool,#right-tool,#s-hotsearch-wrapper,#s_popup_advert,#s_wrap,.no-login-aigc-container,#s_side_wrapper{display:none!important;}
#content_left,.result-molecule,.s_form,.s_tab_inner,#s_tab{padding-left:0!important;}
#page>div{padding:0;}
#chat-input-main{width:auto!important;min-width:400px!important;}
#container{margin:0!important;padding:0!important;}
#content_left,.result-molecule{margin-left:5px!important;padding:0px!important;}
.s_ipt_wr{width:auto!important;}

body,#head{min-width:auto!important;width:auto!important;}
#head{position:absolute!important;}
#u,#searchTag{display:none;}
.container_s{width:auto!important;}
#content_left{width:auto!important;}
#page{width:auto!important;white-space: break-spaces!important;}
.s-tab-note,.s-tab-map,.s-tab-wenku,.s-tab-csaitab,.s-tab-more{display:none!important;}
#page div a,#page div strong{margin-right:0!important;}
#page{margin-bottom:20px!important;}
.s_ipt{width:350px!important;}
#form{margin:0!important;}
#su,.s_btn_wr{width:70px!important;}
.c-container{width:400px!important;}
#rs_new td a{width:auto!important;}
#rs_new{width:auto!important;}
`;

// 要执行的函数
function myFunction() {
  //console.log("这条信息每隔2秒钟打印一次");
  GM_addStyle(mycss);
  $('#rs_new a[href^="/s?wd="]').each(function()
   {
      var text = $(this).text();
      $(this).attr('href', "https://www.baidu.com/s?wd="+text+"&oq="+text+"&ie=utf-8&f=8&rsv_bp=1&tn=baidu&rsv_pq=99d32142000c53f2&rsv_t=ec2cbBIDFAlU2Z1C%2F3y%2Bo2AvambNkqHArI4qC438tZwMhd1VVGcOrl5ySRg&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t");

   });
}

// 页面加载后 每 x 秒执行一次，运行 x 次
let count = 0;
const intervalId = setInterval(function() {
    myFunction();
    count++;
    if (count >= 5) {
        clearInterval(intervalId);
    }
}, 200);
// 滚动时运行，1秒内只运行一次
let lastExecution = 0;
window.addEventListener("scroll", function() {
    const now = Date.now();
    if (now - lastExecution >= 1000) {
        lastExecution = now;
        myFunction();
    }
});
// myFunction();

// 百度热搜页面
if (window.location.hostname === 'top.baidu.com') {


var linksArray = []; // 创建一个数组来保存链接

$('.row-start-center').each(function() {
    var text = $(this).children().eq(1).text();
    var link = "<li><a target='_blank' href='https://m.baidu.com/s?wd=" + text + "'>" + text + "</a></li>";
    linksArray.push(link); // 将生成的链接添加到数组中
});
// 将数组中的链接合并为一个字符串
var linksString = linksArray.join(''); // 使用空字符串连接数组元素

// 现在 linksString 包含所有生成的链接
$("body").html("<ol>"+linksString+"</ol>"); // 输出字符串


var mycss2 = `

ol{margin:auto!important;padding:auto!important;}
li{margin:0 0 10px 0;color: #aaa;}
a{text-decoration: none;}
a:link{color:#1f1f1f;}
a:visited {  color: #aaa;}
body{padding:10px!important;background: #fff!important;}
`;
GM_addStyle(mycss2);

}

})();
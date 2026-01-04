// ==UserScript==
// @name         微博pixiv直跳
// @version      2.2.1
// @description  微博月子喵改(北方棲姬)以及 黑长直赛高 pixiv链接自动跳转
// @author       gotland
// @sauce-code   部分代码来自于@北方棲姬, Yurui, 以及 wlkz.
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*   
// @match        *://link.zhihu.com/?target=*  
// @match        *://t.cn/*
// @match        *://weibo.cn/sinaurl?*  
// @grant        none
// @license      MIT
// @namespace https://weibo.com/2921080027/K63K1tpyb?from=page_1005052921080027&ssl_rnd=1615665340.8435&type=comment#_rnd1615665343968
// @downloadURL https://update.greasyfork.org/scripts/423180/%E5%BE%AE%E5%8D%9Apixiv%E7%9B%B4%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/423180/%E5%BE%AE%E5%8D%9Apixiv%E7%9B%B4%E8%B7%B3.meta.js
// ==/UserScript==

///////////判断是否为bing网页
var url=window.location.href;  //获取url
 if(url.indexOf("bing.com") >= 0 ) { //判断url地址
 
//则执行bing跳转功能
(function() {
    'use strict';
    let url = document.getElementById("sb_form_q").value
    var pixiv = url.search("https://")
    if (pixiv != -1 )
      {window.location.href=url;}
  else
    {return;}
})();
   
}

////////////////////////////////////////////////////////////////////////////  
 
//判断是否为知乎网页
var url=window.location.href;  //获取url
  if(url.indexOf("link.zhihu.com") >= 0 ) { //判断url地址

//则执行知乎跳转功能   
(function() {
     document.getElementsByTagName("html")[0].innerHTML='';
})();

(function() {
    'use strict';
    var url = window.location.href;
    window.stop();
    
    if (url.indexOf('https://link.zhihu.com/?target=') != -1) //判断
    {
        url = url.replace('https://link.zhihu.com/?target=', '')  //替换
    }
    function all_replace(a, b, c)
    {
        var reg = new RegExp(b, "g");
        a = a.replace(reg, c);
        return a;
    }
    url = all_replace(url, "%3A", ":")
    url = all_replace(url, "%2F", "/")
    window.location.replace(url);
})();
 }

///////////////////////////////////////////////////////////////////////
///黑长直赛高短链接跳转

(function() {
    'use strict';
    function redirectTo(url) {
        location.replace(url);
    }
 
    function processer() {
        // match '未完成域名备案，可能存在风险' page
        var targetElement = document.getElementsByClassName('desc')[0];
        var matchElement = document.getElementsByClassName('text')[0];
 
        if (matchElement !== undefined && matchElement.textContent.trim() === "将要访问" && targetElement !== undefined) { //检测关键字
            var targetLink = targetElement.textContent;
            if (targetLink) {
                var p = document.createElement("p");
                p.textContent = '检测到短链接,跳转中...' //替换显示内容提示脚本运行
                document.getElementsByClassName('text')[0].append(p);
                setTimeout(redirectTo, 1000, targetLink);
                return true;
            }
        }
        return false;
    }
 
    processer(); //调用function
  
})();
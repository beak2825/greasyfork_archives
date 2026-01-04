// ==UserScript==
// @name         百度网盘界面美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pan.baidu.com/disk/home
// @match        https://pan.baidu.com/*
// @grant        none
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387376/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/387376/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {   
    var styleCode = ".frame-all{background-size : 100% 120%;background-image : url(http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/810a19d8bc3eb1350591eec3aa1ea8d3fd1f4477.jpg);}div#frame-main,div#layoutMain,div.DxdbeCb,div.KPDwCE,div.JDeHdxb,ul.FuIxtL,dd.AuPKyz,div.OFaPaO div.oclLlDK,input.klzvyY8g,.xGLMIab .FcQMwt,ul.QAfdwP li.yfHIsP{background: rgba(80, 80, 120, 0) !important;background-color: rgba(80, 80, 120, 0) !important;}div.KPDwCE,div.JDeHdxb,div.xGLMIab li.fufHyA span,dd.AuPKyz span,dd.AuPKyz a.ltvdXqk,a.g-button,a.g-button em.icon,a.eusnL6Or,span.icon,div.oclLlDK span.bclyoDz,ul.FuIxtL li span.EKIHPEb,ul.FuIxtL li span.KLxwHFb{color: #FFFFFF !important;}div.tcuLAu a.g-button{border: 1px solid #FFFFFF;}div.tcuLAu a.g-button-blue,div.tcuLAu a.g-button:hover{color: #FFFFFF;border: 1px solid #09AAFF;}span.g-dropdown-button-second a.g-button span.g-button-right{color: #09AAFF !important;}div.oclLlDK span.arsyZng.icon{margin-right: 5px;}div.uuuLp2v,span.newIcon,span.cMEMEF i.find-light-icon{display: none !important;}div.JDeHdxb,ul.FuIxtL,ul.FuIxtL li{height: 32px !important;line-height: 32px !important;}ul.FuIxtL li a{margin: 5px auto;height: 32px;min-width: 80px;border: 1px solid #FFFFFF;padding: 5px 10px;border-radius: 2px;background: rgaa(0, 0, 0, 0);color: #FFFFFF;text-decoration: none;}ul.FuIxtL li a:first{background-color: rgaa(9, 170, 255, 1) !important;}input.klzvyY8g{left: -25px;width: 120% !important;height: 20px !important;padding: 4px 25px;color: #FFFFFF;border: 1px solid #FFFFFF !important;border-radius: 20px;}div.global-clearfix{left: 120px !important;}div.QxJxtg:hover {background: rgba(255, 255, 255,.25) !important;}div.xGLMIab li.fufHyA:hover {background: rgba(80, 80, 120, 0) !important;border-color: rgba(80, 80, 120, 0) !important;}dd.AuPKyz:hover{background: rgba(80, 80, 120,.2) !important;}dd.AuPKyz a.ltvdXqk:hover{margin-left: 2px;}";
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            func_ul_FuIxtL_span_EgMMec(mutation.target);
        });
    });
    $(document).ready(function(){
//      $(".frame-all").css("background-image","url(http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/810a19d8bc3eb1350591eec3aa1ea8d3fd1f4477.jpg)");
        $(".frame-all").css("background-size","100% 120%");
        loadCssCode(styleCode);
        func_ul_FuIxtL_span_EgMMec($("ul.FuIxtL"));
        var config = { attributes: true } ;
        observer.observe($("ul.FuIxtL")[0], config);
    });
    function func_ul_FuIxtL_span_EgMMec(element){
        if ($(element).css("display") == "none")
            $("span.EgMMec").css("visibility","visible");
        else $("span.EgMMec").css("visibility","hidden");
    }
    //loadStyle('test.css');
    function loadStyle(url){
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }
    //loadCssCode('body{background-color:#f00}');
    function loadCssCode(code){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(code));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})()
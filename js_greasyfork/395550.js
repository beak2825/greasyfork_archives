// ==UserScript==
// @name         盒子论坛样式改造
// @namespace    https://www.yge.me
// @version      0.2
// @description  try to take over the world!
// @author       Y.A.K.E
// @match        http://bbs.2ccc.com/*
// @grant        none
// @run-at       document-end
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
// @require      https://cdn.jsdelivr.net/npm/magnific-popup@1.1.0/dist/jquery.magnific-popup.min.js
// @downloadURL https://update.greasyfork.org/scripts/395550/%E7%9B%92%E5%AD%90%E8%AE%BA%E5%9D%9B%E6%A0%B7%E5%BC%8F%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/395550/%E7%9B%92%E5%AD%90%E8%AE%BA%E5%9D%9B%E6%A0%B7%E5%BC%8F%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //老衲也不是很懂JS/CSS 都是百度东拼西凑凑来的.

    //设置  隐藏首页回帖,默认开启.
    var set_hide_home_reply =  1;




    //测试是否加入一个按钮
    window._yake_test_inject_button = 0;
    //别的地方抄来的插入JS/CSS函数
    function loadjscssfile(filename,filetype){

        if(filetype == "js"){
            var fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src",filename);
        }else if(filetype == "css"){

            var fileref = document.createElement('link');
            fileref.setAttribute("rel","stylesheet");
            fileref.setAttribute("type","text/css");
            fileref.setAttribute("href",filename);
        }
        if(typeof fileref != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }

    }

    //别的地方抄来的css插入函数
    var importStyle=function importStyle(b){
        var a=document.createElement("style");
        var c=document;c.getElementsByTagName("head")[0].appendChild(a);
        if(a.styleSheet){
            a.styleSheet.cssText=b
        }else{
            a.appendChild(c.createTextNode(b))
        }
    };
    importStyle('* { font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,"Helvetica Neue",Arial,sans-serif !important;font-size:14px !important;line-height:25px !important;  }');
    importStyle('hr {border: 1px solid rgb(229, 229, 229) !important;}');

    //背景颜色
    importStyle('body  {background-color: #cccccc !important;}');
    importStyle('td  {background-color: #cccccc !important;}');

    //隐藏首页回帖
    if (set_hide_home_reply) {
        importStyle('.child  {display: none;}');
    }



    //首页贴子标题
    importStyle('.parent a {color: #2d64b3!important; font-size:15px !important;}');

    //引用响应式框架bootstrap样式文件
    loadjscssfile("https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css","css");

    //引用灯箱样式(当前页面放大预览图片)
    loadjscssfile("https://cdn.jsdelivr.net/npm/magnific-popup@1.1.0/dist/magnific-popup.css","css");



    //引用jquery
    loadjscssfile("https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js","js");
    //引用响应式框架bootstrap js文件
    loadjscssfile("https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js","js");

    //引用灯箱脚本(当前页面放大预览图片)
    loadjscssfile("https://cdn.jsdelivr.net/npm/magnific-popup@1.1.0/dist/jquery.magnific-popup.min.js","js");



    //--------------------通用
    //总体宽度加宽,
    jQuery('body > table').wrap("<div class='container'></div>").css('width','100%');
    //主体框架比例调整
    jQuery('body > .container > table:eq(2) >tbody>tr>td:eq(0)').css('width','9.7%');
    jQuery('body > .container > table:eq(2) >tbody>tr>td:eq(1)').css('width','0.3%');
    jQuery('body > .container  > table:eq(2) >tbody>tr>td:eq(2)').css('width','90%');



    //-------------------首页
    //每个标题追加间距
    jQuery('div.parent').css({'margin-top': '20px'});
    jQuery('div.parent:eq(0)').css({'margin-top': '0px'});//首行无需

    //回帖预览最小高度
    jQuery('div.child > table > tbody >tr').css({'min-height':'30px'});

    //调整首页回帖预览宽度

    if (!set_hide_home_reply) {
        jQuery('div.child > table > tbody >tr ').each(function(){
            jQuery(this).find('td').eq(0).css({'width':'1%'});
            jQuery(this).find('td').eq(1).css({'width':'66%'})
            jQuery(this).find('td').eq(2).css({'width':'18%'})
            jQuery(this).find('td').eq(3).css({'width':'15%'})
        });
    }



    //-------------贴子详情页



    //贴子页回帖每楼间距加大
    //添加边框线
    jQuery('body > .container  > table:eq(2) >tbody>tr>td:eq(2) >table').css({'margin': '30px 0px','border': '1px solid #E5E5E5'});
    jQuery('body > .container  > table:eq(2) >tbody>tr>td:eq(2)>table').css('margin','0%');

    //移除签名的横线,用hr标签代替.
    jQuery('body > .container  > table:eq(2) >tbody>tr>td:eq(2) >table >tbody ').each(function(){
        var tmp_dom = jQuery(this).find('td').last();
        jQuery(tmp_dom).children('font').last().html('<hr />');
        jQuery(tmp_dom).children('br').last().remove();

        //var tmp_dom_all = jQuery(tmp_dom).children();
        //console.log(tmp_dom_all);
    });



    //图片灯箱效果
    //移除图片链接新页面打开的设置.
    //用灯箱接管
    jQuery("a[href!='#']>img").parent().removeAttr('target').addClass('image-popup-fit-width');



    //灯箱函数,官方demo直接抄来的
    jQuery('.image-popup-fit-width').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        image: {
            verticalFit: false
        }
    });


    //------------------------发帖功能扩展

    //改变按钮颜色
    jQuery('input.button').addClass('btn btn-info');

    //加上一个代码插入的按钮
    jQuery('#ubbDiv').on('DOMNodeInserted',function(){
        if (window._yake_test_inject_button == 0){
            window._yake_test_inject_button = 1; //标记已经添加,防止重复添加

            //showcode函数是论坛自带ubb.js 里面的.
            jQuery(this).prepend('<input name="Submit2" type="button" class="button btn btn-primary" onclick="showcode()" value="代码插入">');

        }
    });

    // Your code here...
})();
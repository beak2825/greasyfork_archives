// ==UserScript==
// @name         wandaOA
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用wandaOA能在firefox、Chrome下使用（Linux、MacOS）
// @author       wangfei
// @match        http://oa.wanda.cn/*
// @match        http://erp.wanda.cn/*
// @grant        GM_log
// //@require      http://oa.wanda.cn/homepage/element/content/js/jquery/jquery-1.9.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389455/wandaOA.user.js
// @updateURL https://update.greasyfork.org/scripts/389455/wandaOA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //覆盖createElment的实现，变相兼容IE
    //https://blog.csdn.net/weixin_34232744/article/details/85802200
    document.createEl = document.createElement;
    document.createElement = function (obj) {
        if (obj.toString().indexOf("<") > -1) {
            return $(obj)[0];
        }
        else {
            return document.createEl(obj);
        }
    }

    if(window.location.pathname=='/'){
        //alert($('title').text());
        var redirectUrl = "/login/wdLogin.jsp?logintype=1" ;
        var width = $(window).width();
        var height = $(window).height() ;

        //if (height == 768 ) height -= 75 ;
        //if (height == 600 )
        height -= 100 ;
        var szFeatures = "top=0," ;
        szFeatures +="left=0," ;
        szFeatures +="width="+width+"," ;
        szFeatures +="height="+height+"," ;
        szFeatures +="directories=no," ;
        szFeatures +="status=yes," ;
        szFeatures +="menubar=yes," ;

        if (height <= 600 ) szFeatures +="scrollbars=yes," ;
        else szFeatures +="scrollbars=yes," ;

        szFeatures +="resizable=yes" ; //channelmode

        /**
  * 检查窗口是否被阻止
  * updated by cyril on 2008-06-02
  */
        var newwin = window.open(redirectUrl,"",szFeatures) ;
        if(newwin==null) {
            var helpurl='/help/sys/help.html'
            location.href = redirectUrl;
        }
        else {
            window.opener='ecology';
            window.open('','_self');
            window.close();
        }

    }

    if(window.location.pathname=='/main.jsp'){
        //重设框架高度
        var leftframe = $('#leftFrame');
        leftframe.attr('style','border:0px;height:1000px;');
        //leftframe.parent().attr('style','width: 1240px;margin: 0 auto;"')

        var header2 = $('.header2');
        header2.attr('style','margin-top: -48px;');

        var rightmenu = $('#rightMenu');
        rightmenu.attr('style','display:none;');

        leftframe.contentWindow.document.frames[1].document.location.href = "/homepage/HomepageRedirect.jsp";

    }

    if($("#mainFrame").attr("src")=='/homepage/Homepage.jsp'){//不起作用
        GM_log("mainFrame alert.");
    }

})();
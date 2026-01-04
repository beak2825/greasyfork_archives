// ==UserScript==
// @name         WIT武汉工程大学教务系统助手（测试版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  教师评价界面按回车键自动评价，iframe框架左下角添加看板娘
// @author       Yuhang Shang
// @match        *://jwxt.wit.edu.cn/*
// @icon         https://www.shangyuhang.icu/favicon/64_64.ico
// @grant        none
// @supportURL   yuhang.shang@qq.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438084/WIT%E6%AD%A6%E6%B1%89%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438084/WIT%E6%AD%A6%E6%B1%89%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //全局变量
    var iiframe;
    var girl_link;
    var girl_script;


    //键盘监听事件
    document.addEventListener('keydown', my);
    function my(e){
        if(e.keyCode==13){//回车键的keyCode是13
            write();
            document.querySelector('#qx').click();
        }
    }

    //自动评价功能
    function write(){
        document.querySelector('#pj0601id_3_1').checked=true;
        document.querySelector('#pj0601id_7_1').checked=true;
        document.querySelector('#pj0601id_2_1').checked=true;
        document.querySelector('#pj0601id_1_1').checked=true;
        document.querySelector('#pj0601id_9_1').checked=true;
        document.querySelector('#pj0601id_6_1').checked=true;
        document.querySelector('#pj0601id_5_2').checked=true;
        document.querySelector('#pj0601id_8_1').checked=true;
        document.querySelector('#pj0601id_4_1').checked=true;
        document.querySelector('#pj0601id_10_1').checked=true;
        document.querySelector('#jynr').value='非常满意';
    }

    //添加看板娘
    //createGirl();
    //window.onload=function {setTimeout(deleteGirl(),5000);}

    //判断是否有iframe框架
    if(iiframe = document.getElementById('Frame0'))
    {
        //等待内部框架加载完毕再生成看板娘
        iiframe.onload=function(){
            //获取iframe窗口句柄
            iiframe = document.getElementById('Frame0').contentWindow;
            //添加link元素
            girl_link = iiframe.document.createElement('link');
            girl_link.setAttribute('hreflang','zh');
            girl_link.setAttribute('rel','stylesheet');
            girl_link.setAttribute('href','https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css');
            girl_link.setAttribute('id','girl_link');
            iiframe.document.head.appendChild(girl_link);
            //添加script元素
            girl_script=iiframe.document.createElement('script');
            girl_script.setAttribute('src','https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js');
            girl_script.setAttribute('id','girl_script');
            iiframe.document.head.appendChild(girl_script);}

    }

    //在内嵌iframe页面删除看板娘
    function deleteGirl(){
        window.alert('delete');
        iiframe = document.getElementById('#iframeautoheight').contentWindow;
        iiframe.document.querySelector('#live2d').remove();
    }

    //左下角添加看板娘(全局作用，慎用)
    function createGirl(){
        var girl_link = document.createElement('link');
        girl_link.setAttribute('hreflang','zh');
        girl_link.setAttribute('rel','stylesheet');
        girl_link.setAttribute('href','https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css');
        document.head.appendChild(girl_link);
        var girl_script=document.createElement('script');
        girl_script.setAttribute('src','https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js');
        document.head.appendChild(girl_script);
    }
})();
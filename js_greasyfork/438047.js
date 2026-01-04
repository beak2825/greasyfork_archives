// ==UserScript==
// @name         AHMU安徽医科大学教务系统助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  安徽医科大学登录页面自动输入密码，教师评价界面按回车键自动评价,左下角添加看板娘
// @author       Yuhang Shang
// @match        *://jwgl.ahmu.edu.cn/eams/*
// @icon         https://www.shangyuhang.icu/favicon/64_64.ico
// @grant        none
// @supportURL   yuhang.shang@qq.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438047/AHMU%E5%AE%89%E5%BE%BD%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438047/AHMU%E5%AE%89%E5%BE%BD%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //=======================================
    //    请在此填写您的账号和密码
    //=======================================
    var your_username='你的账号';
    var your_password='你的密码';

    //全局变量
    var StudentEvalutionURL="jwgl.ahmu.edu.cn/eams/homeExt.action";
    var StudentLoginURL="jwgl.ahmu.edu.cn/eams/loginExt.action";
    var iiframe;
    var girl_link;
    var girl_script;

    //学生登录系统
    var windowURL = window.location.href;
    if (windowURL.indexOf(StudentLoginURL) != -1) {
        document.querySelector('#loginForm span').textContent='账号密码已经帮你填好啦O(∩_∩)O'
        document.querySelector('#username').value=your_username;
        document.querySelector('#password').value=your_password;
    }

    //评教系统

    //键盘监听事件(因为脚本需要在网页完全加载完毕注入，所以需要设为全局事件）
    document.addEventListener('keydown', my);
    function my(e){
        if(e.keyCode==13){//回车键的keyCode是13
            write();
            document.querySelector('#sub').click();
        //window.alert("press");
        }
    }

    //自动评价功能
    function write(){
       let radios=document.getElementsByClassName("option-radio");
       for (let i = 0; i < radios.length; i=i+5) {
        radios[i].checked=true;
       }
    }

    //判断是否有iframe框架
    if(iiframe = document.getElementById('iframeMain'))
    {
        //等待内部框架加载完毕再生成看板娘
        iiframe.onload=function(){
            //获取iframe窗口句柄
            iiframe = document.getElementById('iframeMain').contentWindow;
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

    //添加看板娘
    //createGirl();

    //左下角添加看板娘(全局添加，慎用）
    function createGirl(){
        var girl_link = document.createElement('link');
        girl_link.setAttribute('hreflang','zh');
        girl_link.setAttribute('rel','stylesheet');
        girl_link.setAttribute('href','https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css');
        girl_link.setAttribute('id','girl_link');
        document.head.appendChild(girl_link);
        var girl_script=document.createElement('script');
        girl_script.setAttribute('src','https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js');
        girl_script.setAttribute('id','girl_script');
        document.head.appendChild(girl_script);
    }

})();
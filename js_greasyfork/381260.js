// ==UserScript==
// @name         自动完成安全作业
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成安全平台的作业
// @author       Jedliu@104
// @match        https://fuzhou.xueanquan.com/*
// @match        https://huodong.xueanquan.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/381260/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AE%89%E5%85%A8%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/381260/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AE%89%E5%85%A8%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var 本次作业1 = 'https://fuzhou.xueanquan.com/JiaTing/JtMyHomeWork.html';

    var 登陆页面 = 'https://fuzhou.xueanquan.com/login.html';
    var 登陆主页 = 'https://fuzhou.xueanquan.com/mainpage.html';
    var next = 'nextuser';

    var current = 0;

    var students = [
        {name:'刘翰宸', username:'liuhanchen1776'},
        {name:'陈怡熹', username:'chenyixi8811'},
        {name:'陈泊宇', username:'chenboyu8772'},
        {name:'杨梓铭', username:'yangziming1132'},
        {name:'伍忆辰', username:'wuyichen7971'},
        {name:'郭钧妍', username:'guojunyan4536'},
        {name:'吴锦儿', username:'wujiner0830'},
        {name:'刘林彬', username:'liulinbin5104'},
        {name:'罗旭尧', username:'luoxuyao2283'},
        {name:'石子莹', username:'shiziying2445'},
        {name:'欧亦飞', username:'ouyifei2122'},
        {name:'翁其锐', username:'wengjirui2146'},
        {name:'肖锌玥', username:'xiaoxinyue6971'},
        {name:'刘恩琦', username:'liuenqi0706'},
        {name:'杨安琪', username:'yanganqi4723'},
        {name:'李云璐', username:'liyunlu5169'},
        {name:'李云瑶', username:'liyunyao2054'},
        {name:'汤诗雅', username:'shangshiya3374'},
        {name:'陈果', username:'chenguo0987'},
        {name:'李孟熹', username:'limengxi1925'},
        {name:'黄临溪', username:'huanglinxi4143'},
        {name:'池睿希', username:'chiruixi5853'},
        {name:'翁澜', username:'wenglan5591'},
        {name:'潘星宇', username:'panxingyu8916295'},
        {name:'林俊赫', username:'linjunhe7540'},
        {name:'张书鹏', username:'zhangshupeng8490'},
        {name:'俞梓馨', username:'yuzixin2608'},
        {name:'林子轩', username:'linzixuan7780466'},
        {name:'吴雨霏', username:'wuyufei3080366'},
        {name:'阮柯玮', username:'ruankewei6910'},
        {name:'林泽辰', username:'linzechen1282'},
        {name:'江绍航', username:'jiangshaohang1024'},
        {name:'郑纾青', username:'zhengshuqing0131'},
        {name:'吴玮杰', username:'wuweijie5314'},
        {name:'林宇辰', username:'linyuchen3668'},
        {name:'洪紫涵', username:'hongzihan3665'},
        {name:'方乐萱', username:'fanglexuan3768'},
        {name:'刘翾曈', username:'liuxuantong5493'},
        {name:'张佳琦', username:'zhangjiaqi4721891'},
        {name:'陈安琪', username:'chenanqi0582'},
        {name:'陈雨萌', username:'chenyumeng9891'},
        {name:'丁诺涵', username:'dingnuohan1097'},
        {name:'冯雅飞', username:'fengyafei1119'},
        {name:'李法伸', username:'lifashen6354'},
        {name:'林乐', username:'linle5188'},
        {name:'梅以宁', username:'meiyining6100'},
        {name:'潘妍烯', username:'panyanxi5201891'},
        {name:'石俊豪', username:'shijunhao2733'},
        {name:'苏铂宸', username:'subochen6758'},
        {name:'刘奕宏', username:'liuyihong1448'},
        {name:'潘昊霖', username:'panhaolin2570'}
    ];

    //GM_setValue(next, 0);
    var username = '';

    setTimeout(function(){
        console.info('当前的页面是：'+getUrl());
        switch(getUrl()){
            case 登陆页面:
                current = GM_getValue(next)?GM_getValue(next):0;
                GM_setValue(next, current+1);
                if(current>51){
                    current = 0;
                    GM_setValue(next,0);
                }
                username = students[current].username;

                //执行登陆操作，使用统一的密码
                login(username,'tjsyxx104');
                break;
            case 登陆主页:
                delayGo(本次作业1,2000);
                break;
        }
    }, 2000);

    //自动确认重置密码，如完成后需要关闭此处的功能
    /*setInterval(function(){
        if($('.confirm').is(':visible')){
            $('.confirm').find('.button').first().click();
        }else if($('.correct').is(':visible')){
            $('.correct').find('.button').first().click();
        }
    },1000);*/
    /*
    var timeInterval =  setInterval(modifyPassword,500);
    function modifyPassword(){
        if($('#userPassword').is(":visible")){
            clearInterval(timeInterval);
            console.info('当前修改的用户名称：'+username);
            document.querySelector('input[id=newpwd]').value='tjsyxx104';
            document.querySelector('input[id=conpwd]').value='tjsyxx104';
        }
    }*/

    /*
    var timeInterval2 =  setInterval(goback,500);
    function goback(){
        if($('#userSecurity').is(":visible")){
            clearInterval(timeInterval2);
            delayGo(本次作业1,2000);
        }
    }*/


    //登陆安全作业系统
    function login(username, password){
        if(getUrl()=='https://fuzhou.xueanquan.com/login.html'){
            document.querySelector('input[id=UName]').value = username;
            document.querySelector('input[id=PassWord]').value = password;
            document.querySelector('a[id=LoginButton]').click();
        }
    }

    //获得当前网页网址
    function getUrl(){
      return document.location.href.toLocaleLowerCase();
    };

    //跳转到页面
    var delayGo = function(url){
        delay(function(){
            window.location = url;
        },5000);
    };

    //延迟执行
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

})();
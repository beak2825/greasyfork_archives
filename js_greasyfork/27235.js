// ==UserScript==
// @name         51JOB前程无忧屏蔽助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提供简单的屏蔽功能，去除烦人的培训机构！
// @author       kearon
// @match        http://search.51job.com/*
// @grant        none
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/27235/51JOB%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/27235/51JOB%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E5%B1%8F%E8%94%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// "["成都中软卓越","上海美戈信息技术有限公司","杭州灵漫数码科技有限公司","上海首图信息科技有限公司","众凯教育进修学校","中软信息技术","中软信息科技","众软信息科技","中峦科技（上海）","中软科技（上海）","中软ETC（上海）","上海挚品互联网科技有限公司","众阮科技（上海）","上海众阮科技","中软卓越（上海）","上海育创网络科技股份有限公司","中软软件（上海）","广州森迪信息科技有限公司","中软国际科技教育集团（上海）","上海旅烨网络科技有限公司","上海华是进修学院","中软国际(上海)","中软卓越教育服务有限公司","上海默哲实业有限公司"]";

var list = localStorage.list ? JSON.parse(localStorage.list) :  [] ;

(function() {
    'use strict';
    map2Block();
    $('.t2 a').after('<a href="javascript:;" class="block" style="color: blueviolet;">&nbsp;&nbsp;X</a>');
    block();
    getStatusByJsonp();
})();

function block(){
    $('.block').click(function(){
        //var $this = $(this);
        var $company = $(this).siblings().attr('title');
        list.push($company);
        localStorage.list = JSON.stringify(list);
        //window.location.reload();
        blockByName($company);
    });
}

function map2Block(){
    $('.t2 a').each(function(x,i){
        $.each(list,function(y,z){
            if($(i).attr('title') == z){
                //$(i).parent().parent().hide(500);
                $(i).parent().parent().remove();
                return false;
            }

        });
    });
}
function blockByName(name){
    $('.t2 a').each(function(x,i){
        if($(i).attr('title') == name){
            $(i).parent().parent().hide(500);
            //return false;
        }
    });
}

function getStatusByJsonp(){
    $('.t1 input').each(function(){
        var $this = $(this);
        var url = 'http://jobs.51job.com/ajax/checkcvlog.php?jsoncallback=?';
        $.ajax(url, {
            data: {
                'jobid':$(this).val()
            },
            dataType: 'jsonp',
            crossDomain: true,
            success: function(data) {
                if(data.status == '1'){
                    $this.next().append('(已申请)');
                }
            }
        });
    });
}

// ==UserScript==
// @name             51JOB前程无忧找工作助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  提供简单的屏蔽功能，去除烦人的培训机构！在职位介绍页面添加一键天眼查功能
// @author         zhangolve  ( zhangolve@gmail.com  )
// @match          *://search.51job.com/*
// @match          *://sou.zhaopin.com/*
// @match          *://jobs.zhaopin.com/*
// @match          *://jobs.51job.com/*
// @grant             GM_setValue
// @grant             GM_getValue
// @grant              GM_deleteValue
// @grant             GM_addStyle




// @downloadURL https://update.greasyfork.org/scripts/29097/51JOB%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E6%89%BE%E5%B7%A5%E4%BD%9C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/29097/51JOB%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E6%89%BE%E5%B7%A5%E4%BD%9C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var items=["成都中软卓越", "现代国际金融理财标准(上海)有限公司", "上海美戈信息技术有限公司", "杭州灵漫数码科技有限公司", "上海首图信息科技有限公司", "众凯教育进修学校", "中软信息技术", "中软信息科技", "众软信息科技", "中峦科技（上海）", "中软科技（上海）", "中软ETC（上海）", "上海挚品互联网科技有限公司", "众阮科技（上海）", "上海众阮科技", "中软卓越（上海）", "上海育创网络科技股份有限公司", "中软软件（上海）", "广州森迪信息科技有限公司", "中软国际科技教育集团（上海）", "上海旅烨网络科技有限公司", "上海华是进修学院", "中软国际(上海)", "中软卓越教育服务有限公司", "上海默哲实业有限公司", "上海孜米网络科技有限公司", "上海付费通信息服务有限公司", "上海班凯信息技术服务有限公司", "广东溢达科技有限公司", "广东华夏天网智能科技有限公司", "大学长(北京)网络教育科技有限公司", "北京优才创智科技有限公司上海分公司", "大连淘车网络科技有限公司上海分公司", "中软博创(北京)科技有限公司", "中软亚信(北京)科技有限公司", "广西软博科技有限公司", "北京中科普德科技有限公司", "上海御笙服饰有限公司", "广东晶美莱特科技有限公司", "广东晋佑科技股份有限公司", "广东会圆宝科技有限公司", "广东樱雪科技有限公司", "上海伍易信息科技有限公司", "中青才智教育投资(北京)有限公司", "广东麦菲尔膜科技有限公司", "北京百知教育科技有限公司", "华锐祥博(北京)科技有限公司", "上海道丞软件信息技术有限公司", "上海锦马实业有限公司", "中软卓越", "中公教育", "北京广信联合国际教育咨询有限公司", "云软中创(北京)科技有限公司", "中能信息科技(上海)有限公司", "北京中科建友科技有限公司", "北京无忧前程科技有限公司", "北京华为云端科技有限公司", "北京中软承志科技有限公司", "深圳市一风行科技有限公司", "深圳市麦亲科技有限公司", "河南云和数据信息技术有限公司深圳分公司", "深圳市云联时空科技有限公司", "深圳市时空数通科技有限公司", "深圳市惠科软件开发有限公司", "深圳市融联辉科技有限公司", "深圳万德菲电子商务有限公司", "深圳堉云信息技术有限公司", "深圳市斯密达网络科技开发有限公司", "深圳市互联安达科技有限公司", "深圳语风科技有限公司", "深圳七啸科技有限公司", "深圳市瑞滋德科技有限公司"];
var list = GM_getValue('list') ? JSON.parse(GM_getValue('list') ) :  items;
/*block 51 jobs*/
(function() {
    'use strict';
    if(window.location.host=='search.51job.com')
    {
        map2Block51job();
        $('.t2 a').after('<a href="javascript:;" class="block" style="color: blueviolet;">&nbsp;&nbsp;X</a>');
        jobBlockHandler();
    }
})();

/*block zhaopin */
(function() {
    'use strict';
    if(window.location.host=='sou.zhaopin.com')
    {
     setTimeout(function(){
     mapBlockZhaopin();
     $('.commpanyName a').append('<a href="javascript:;" class="block" style="color: blueviolet;">&nbsp;&nbsp;X</a>');
     zhaopinBlockHandler();
     },3000)
    }
})();

function mapBlockZhaopin(){
   $('.commpanyName a').each(function(i,item){
      $.each(list,function(j,company){
      if(company===$(item).attr('title')) {
        $(item).closest('.listItemBox').hide();
      }
      });
   });
}

function zhaopinBlockHandler(){
       $('.block').click(function(){
          var $this = $(this);
          var $company = $(this).parent().attr('title');
          list.push($company);
          GM_setValue("list", JSON.stringify(list));
          blockByName($company);
    });
}

function jobBlockHandler(){
    $('.block').click(function(){
        var $company = $(this).siblings().attr('title');
        list.push($company);
        GM_setValue("list", JSON.stringify(list));
        blockByName($company);
    });
}

function map2Block51job(){
    $('.t2 a').each(function(x,i){
        $.each(list,function(y,z){
            if($(i).attr('title') == z){
                $(i).closest('.el').remove();
            }
        });
    });
}

function blockByName(name){
    if(window.location.host=="search.51job.com"){
    $('.t2 a').each(function(x,i){
        if($(i).attr('title') === name){
            $(i).closest('.el').hide(500);
            return false;
        }
    });
    }
    if(window.location.host=="sou.zhaopin.com"){
     $('.commpanyName a').each(function(i,item){
      if($(item).attr('title')===name){
          $(item).closest('.listItemBox').hide(500);
        }
     })
    }
}



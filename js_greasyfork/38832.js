// ==UserScript==
// @name         暴风勇士
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  try to take over the world!
// @author       You
// @match        http://1.bfys.xh456.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38832/%E6%9A%B4%E9%A3%8E%E5%8B%87%E5%A3%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/38832/%E6%9A%B4%E9%A3%8E%E5%8B%87%E5%A3%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // document.getElementById('aspnetForm').submit();
    //$("#ctl02_Button2").trigger('click');
    var js = '<script src="http://jianfeile.com:91/Public/js/jquery.timer.js"></script>';
    $('body').append(js);
    var htmx = '<input class="button9 bt_main_button_navi" id="auto_do" type="button" value="自动处理"><input class="button9 bt_main_button_navi" id="auto_fuben" type="button" value="自动副本"><input class="button9 bt_main_button_navi" id="auto_huanjing" type="button" value="自动幻境"><input class="button11 bt_main_button_navi" id="auto_guaji" type="button" value="自动挂机（经验）">';
    $('#div_navigation div').last().append(htmx);


  $('#auto_do').click(function(){
      //message 发言
     var tt = $.timer(function(){
          $('#ta_message').val('hi');
          send_message_check();
      });tt.once(50);
      //签到
        tt = $.timer(function(){

          wancheng_qiandao_check();
      });tt.once(60);


      //richangrenwu
      //show_div_renwu();//show
      //笨鸟先飞
      tt = $.timer(function(){
          benniao_lingqu_richang_renwu_check();
      });tt.once(120);
      //每日一吼
      tt = $.timer(function(){
          zhaogao_lingqu_richang_renwu_check();
      });tt.once(200);

      //英雄的馈赠
      tt = $.timer(function(){
          lingqu_feilin_kuizeng_check();
      });tt.once(400);
var i;
      //护送取经
      for(i=0;i<4;i++){
          tt = $.timer(function(){
              start_husong_qujing_check();
          });tt.once(600+i*300);
      }

      //神秘矿洞
      for(i=0;i<10;i++){
          tt = $.timer(function(){
              wakuang_shenmi_kuangdong_check();
          });tt.once(2000+i*500);
      }

      //摇钱树
      for(i=0;i<10;i++){
          tt = $.timer(function(){
              yao_yaoqianshu_check();
          });tt.once(8800+i*500);
      }

  });

    // 自动副本
    $('#auto_fuben').click(function(){
	var tt = $.timer(function(){
          show_div_fuzhuangbei(); //切换装备
      });tt.once(100);
	tt = $.timer(function(){
	show_equipment_info_fuzhuangbei_check(5); // *副本荣誉套
      });tt.once(450);

	tt = $.timer(function(){
	   qiehuan_fuzhuangbei_check(); //确认切换装备
      });tt.once(850);
	tt = $.timer(function(){
	  show_div_fuben(); //显示副本页
      });tt.once(8000);


     for(var i=0;i<10;i++){
          tt = $.timer(function(){
              reset_fuben_cishu_check(); //购买副本
          });tt.once(8500+i*200);
      }
	tt = $.timer(function(){
	  show_div_fuben_saodang_cishu_check(24,'扫荡24号怪'); //扫荡超神
      });tt.once(11000);
	tt = $.timer(function(){
	  $('#ipt_fuben_saodang_amount_flow').val(550); //更新扫荡次数
      });tt.once(11500);
});

    //自动幻境
    $('#auto_huanjing').click(function(){
	var tt = $.timer(function(){
          show_div_fuzhuangbei(); //切换装备
      });tt.once(100);
	tt = $.timer(function(){
	show_equipment_info_fuzhuangbei_check(2); // *幻境荣誉套
      });tt.once(450);

	tt = $.timer(function(){
	   qiehuan_fuzhuangbei_check(); //确认切换装备
      });tt.once(850);
	tt = $.timer(function(){
	  show_div_huanjin(); //显示幻境页
      });tt.once(5000);

	tt = $.timer(function(){
	  show_div_huanjing_saodang_cishu_check(36,'痛肠'); //扫荡超神
      });tt.once(5500);
	tt = $.timer(function(){
	  $('#ipt_huanjing_saodang_amount_flow').val(570); //更新扫荡次数
      });tt.once(6000);

});//huanjing

    //自动挂机
$('#auto_guaji').click(function(){
	var tt = $.timer(function(){
          show_div_fuzhuangbei(); //切换装备
      });tt.once(100);
	tt = $.timer(function(){
	show_equipment_info_fuzhuangbei_check(4); // *经验套
      });tt.once(450);

	tt = $.timer(function(){
	   qiehuan_fuzhuangbei_check(); //确认切换装备
      });tt.once(850);
	tt = $.timer(function(){
     show_div_renwu_tiaozhan();
	  show_renwu_monster_list_check(85); //显示幻境页
      });tt.once(2000);

});//自动挂机

})();
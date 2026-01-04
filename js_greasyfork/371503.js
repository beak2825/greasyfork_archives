// ==UserScript==
// @name         飞将三国
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  【简单功能】签到和领取福利!
// @author       Laoyu
// @match        http://fjsg.xh456.com/game/index.html*
// @require      https://greasyfork.org/scripts/3465-jquery-timers/code/jQuerytimers.js?version=10415
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371503/%E9%A3%9E%E5%B0%86%E4%B8%89%E5%9B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/371503/%E9%A3%9E%E5%B0%86%E4%B8%89%E5%9B%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
   $('body').everyTime('1s',function(){
       if($('#span_juben_fight_player_lv').is(":visible")){
          $('body').stopTime();

            $('#span_juben_fight_player_lv').css('color','#f00');
            $('#span_juben_fight_player_lv').bind("click",function(){
               var lv = $('#span_juben_fight_contrast_boss_lv').html(); //lv
                $('body').oneTime('1ds',function(){juben_stop_fight_check($(this));});//stop flight
                $('body').oneTime('3ds',function(){juben_fight_return_map_check($(this));}); //return map

                $('body').oneTime('5ds',function(){qiandao_wancheng_check();}); //签到
                $('body').oneTime('6ds',function(){meiri_libao_lingqu_check($(this));}); //每日礼包

                $('body').oneTime('1s',function(){
                    var mpid = getmp(lv);

                    juben_create_fight_check(mpid);
                });
            })
           // 获取当前挂机地图leavel
           juben_fight_show_boss_info_flow();
            $('body').oneTime('1ds',function(){juben_fight_hide_boss_info_flow();});

       }else{
           i++;
           console.log(i);
       }

       });

  function getmp(lv){
   var arr = {};
        arr['1'] = 1;
      arr['10'] = 2;
      arr['20'] = 3;
      arr['30'] = 4;
      arr['40'] = 5;
      arr['50'] = 6;
      arr['60'] = 7;
      arr['70'] = 8;
      arr['80'] = 9;
      arr['90'] = 10;
      arr['100'] = 11;
      arr['110'] = 12;
      arr['120'] = 13;
      arr['130'] = 14;
      arr['140'] = 15;
      arr['150'] = 16;
      arr['160'] = 17;
      arr['170'] = 18;
      arr['180'] = 19;
      arr['190'] = 20;
      arr['200'] = 21;
      arr['210'] = 22;
      arr['220'] = 23;
      arr['230'] = 24;
      arr['240'] = 25;
      arr['250'] = 26;
      arr['260'] = 27;
      arr['270'] = 28;
      arr['280'] = 29;
      arr['290'] = 30;
      arr['300'] = 31;
      arr['310'] = 32;
      arr['320'] = 33;
      arr['330'] = 34;
      arr['340'] = 35;
      arr['350'] = 36;
      arr['360'] = 37;
      arr['370'] = 38;
      arr['380'] = 39;
      arr['390'] = 40;
      arr['400'] = 41;
      arr['410'] = 42;
      arr['420'] = 43;
      arr['430'] = 44;
      arr['440'] = 45;
      arr['450'] = 46;
      arr['460'] = 47;
      arr['470'] = 48;
      arr['480'] = 49;
      arr['490'] = 50;
      arr['500'] = 51;
      arr['510'] = 52;
      arr['520'] = 53;
      arr['530'] = 54;
      arr['540'] = 55;
      arr['550'] = 56;
      arr['560'] = 57;
      arr['570'] = 58;
      arr['580'] = 59;
      arr['590'] = 60;
      arr['600'] = 61;
      arr['610'] = 62;
      arr['620'] = 63;
      arr['630'] = 64;
      arr['640'] = 65;
      arr['650'] = 66;
      arr['660'] = 67;
      arr['670'] = 68;
      arr['680'] = 69;
      arr['690'] = 70;
      arr['700'] = 71;
      arr['710'] = 72;
      arr['720'] = 73;
      arr['730'] = 74;
      arr['740'] = 75;
      arr['750'] = 76;
      arr['760'] = 77;
      arr['770'] = 78;
      arr['780'] = 79;
      arr['790'] = 80;
      arr['800'] = 81;
      arr['810'] = 82;
      arr['820'] = 83;
      arr['830'] = 84;
      arr['840'] = 85;
      arr['850'] = 86;
      arr['860'] = 87;
      arr['870'] = 88;
      arr['880'] = 89;
      arr['890'] = 90;
      arr['900'] = 91;
      arr['910'] = 92;
      arr['920'] = 93;
      arr['930'] = 94;
      arr['940'] = 95;
      arr['950'] = 96;
      arr['960'] = 97;
      arr['970'] = 98;
      arr['980'] = 99;
      arr['990'] = 100;
      arr['1000'] = 101;
      arr['1010'] = 102;
      arr['1020'] = 103;
      arr['1030'] = 104;
      arr['1040'] = 105;
      arr['1050'] = 106;
      arr['1060'] = 107;
      arr['1070'] = 108;
      arr['1080'] = 109;
      arr['1090'] = 110;
      arr['1100'] = 111;
      arr['1110'] = 112;
      arr['1120'] = 113;
      arr['1130'] = 114;
      arr['1140'] = 115;
      arr['1150'] = 116;
      arr['1160'] = 117;
      arr['1170'] = 118;
      arr['1180'] = 119;
      arr['1190'] = 120;
      arr['1210'] = 121;
      arr['1220'] = 122;
      arr['1230'] = 123;
      arr['1240'] = 124;
      arr['1250'] = 125;
      arr['1260'] = 126;
      arr['1270'] = 127;
      arr['1280'] = 128;
      arr['1290'] = 129;
      arr['1300'] = 130;
      arr['1310'] = 131;
      arr['1320'] = 132;
      arr['1330'] = 133;
      arr['1340'] = 134;
      arr['1350'] = 135;
      arr['1360'] = 136;
      arr['1370'] = 137;
      arr['1380'] = 138;
      arr['1390'] = 139;
      arr['1400'] = 140;

      return arr[lv];
  }
})();
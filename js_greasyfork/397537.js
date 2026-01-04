// ==UserScript==
// @name         侠客传说
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://*.xkcs.nmb666.com/*
// @require      https://greasyfork.org/scripts/3465-jquery-timers/code/jQuerytimers.js?version=10415
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397537/%E4%BE%A0%E5%AE%A2%E4%BC%A0%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/397537/%E4%BE%A0%E5%AE%A2%E4%BC%A0%E8%AF%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var btn =
        " <a id='s3' href='http://3.xkcs.nmb666.com/index.aspx' class='bt_guaji_action' style='display:inline-block; width:80px'>server_3</a>  ";
    $('body').everyTime('1s', "A", function () {
        //fight
        if ($('#div_img_fuben_boss').is(':visible')) {
            $('body').oneTime('3ds', function () {
                fuben_fight_start();
                $('#div_role_fight_aciton_container').remove()
            })
        }
        

     if ($('#bt_confirm_fuben_fight_success').is(':visible')) {
            confirm_fuben_fight_success_check()
      }

      if ($('#bt_create_fuben_fight').is(':visible')) {
            create_fuben_fight_check()
      }
      // crack Boss limit
      if ($('#div_role_tishi_jump').is(':visible') && $('#div_role_tishi_jump').text()=='今日攻击BOSS已达上限' ) {
           $('#div_fuben_description_flow').hide();
      }
    })


$('body').on('click','#div_equipment_list_equipment_unlock>div',function(){
 console.log('show_fuben_description_check()');

  let aa = $(this).html();
  let e = /check\(\d+/;
  let id = e.exec(aa)[0].replace('check(','');
    let CK;
  //土豪金
      if($('#bt_equipment_tuhaojin').is(':visible')){
          $('#div_jiesuo_equipment_jiesuo').parent().unbind('click')
          $('body').oneTime('1ds',function(){
              $('.relative_div_container').on('click',function(){
                  $('#div_equipemnt_shuxing_flow').hide();
              })
          })

        //  $('#bt_equipment_tuhaojin').remove();
      }else{
      // $(this).on('click','button',function(){
          for(let i=0;i<=6;i++){
              $('body').oneTime(i*2+'ds',function(){
                  equipemnt_qianghua_check();
              })
          }
      // })

    }

})

    $('#span_fuben_map_fenye_title').on('click', function () {
        console.log('3333');
        $('body').everyTime('2s', 'F', function () {
            if ($('#div_fuben_description_flow').is(':hidden') && $('#div_img_fuben_boss').is(
                    ':hidden')) {
               autopk();
             //  autopkrev();
            }
        })
    })


    function autopk() {
        var obj, src;

        for (var i = 1; i <= 10; i++) {
            obj = $('#div_fuben_map_list_' + i + ' img');
            src = obj.attr('src');
            if (src.indexOf('filter_monster') > 0) {
                console.log(i);

                $('#div_fuben_map_list_' + (i - 1) + ' img').click();
                break;
            } else {
                if ($('#div_fuben_boss_jiantou').is(':visible')) {
                    $('#div_fuben_map_list_10 img').click();
                } else {
                    show_fuben_map_list_nextpage();
                }

            }
        }
    }

    function autopkrev(){
     var obj,src;
      if ($('#div_fuben_boss_jiantou').is(':visible')) {
           $('#div_fuben_map_list_10 img').click();
        } else {
            show_fuben_map_list_nextpage();
        }
    }


    $('#span_fuben_map_fenye_title').append("<button id='auto'>auto</button>");
    $('#auto').click(function () {
        console.log(44444)
    })
})();
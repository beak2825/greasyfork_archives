// ==UserScript==
// @name         怪物归来
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  The monster come back,you'll game over!
// @author       Jack
// @match        http://*.gwgl.nmb666.com/index.aspx
// @match        http://1.gwgl.nmb666.com/index.aspx
/* @require      https://greasyfork.org/scripts/367762-jquery-timer-js/code/jquerytimerjs.js?version=596413 */
// @require      https://greasyfork.org/scripts/3465-jquery-timers/code/jQuerytimers.js?version=10415
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367729/%E6%80%AA%E7%89%A9%E5%BD%92%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/367729/%E6%80%AA%E7%89%A9%E5%BD%92%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var mpid = 27; //30级
   var lasthxs = 0;
     // 移除daoguang

    //显示最小攻击-------------------------


        let xx = $('#span_role_player_gongji_monster_fight').siblings().last();
        xx.show();

    function getgj(){
        let gj = $('#span_role_player_gongji_monster_fight').text();
        gj = gj.split('-');
        let min = gj[0]*1;
        let fy = $('#span_role_boss_fangyu_monster_fight').text();
        fy = fy*1;
        let mx = parseInt(min / fy)*2;
        let sm = $('#span_role_boss_shengming_shangxian_monster_fight').text()*1;
        if(mx>=sm){
            mx = mx + ' OK';
        }else{
            mx = mx + ' × '+(mx-sm);
        }
        let jyy = calcjy();
        $('#span_role_player_nick_name_monster_fight').parent().append('<div>'+jyy+'</div>')
        return mx;
    }
    function getid(){
      let nn =$('#span_role_boss_nick_name_monster_fight').text();
      for(let id in mss){
          if(mss[id].name == nn.toLowerCase()){
              return mss[id].id
          }
      }
    }
    function startflight(id){
        qiangzhi_tuichu_monster_fight_check(); //stop
        setTimeout(()=>{
            return_monster_fight_check(); //back;
            create_monster_fight_check(id); //flight
            setTimeout(()=>{
                let info = $('#div_system_channel div:last-child').text();
                if(info=='错误'){return 'error';}
                let money = $('#span_role_boss_jingyan_monster_fight').text();

                return money;
            },500)
        },500);
     }

   function calcjy(){
       let yy = $('#div_role_jingyan_jump').text();
       let ya = yy.split('点经验');
       return Math.round(ya[0]*1*120/100000000)+'E/分钟';
   }
    xx.oneTime('1ds',function loadmin(){
        let CK,ax;
        let mx1 = getgj();
        $('#span_role_player_zhiye_info_monster_fight').html(mx1);

        let str = xx.html()
        str = str.replace('职业','最小攻击');
        xx.html(str);
        let i=0;
        CK= setInterval(function(){
            if(!$('#div_monster_fight_shuxing').is(':visible'))return false;

            mpid = getid();
            $('#mp').val(mpid);
            ax = $('#span_role_player_zhiye_info_monster_fight').text();
            if(ax=='无'){
                 mx1 = getgj();
                 $('#span_role_player_zhiye_info_monster_fight').html(mx1);
            }
        },1000)
    });

   // 显示最小攻击 END--------------------
      $('#div_boss_fight_aciton_container').remove()
      $('#div_role_fight_aciton_container').remove();

//list
    var mss = [
{"id":120,"name":"于阗恶狼(lv.111)"},
{"id":121,"name":"于阗白痴(lv.111)"},
{"id":122,"name":"于阗强盗(lv.111)"},
{"id":124,"name":"疏勒狼人(lv.112)"},
{"id":125,"name":"疏勒树精(lv.112)"},
{"id":126,"name":"疏勒小鬼(lv.112)"},
{"id":128,"name":"龟兹猛虎(lv.113)"},
{"id":129,"name":"龟兹兵俑(lv.113)"},
{"id":130,"name":"龟兹花妖(lv.113)"},
{"id":132,"name":"西羌野狼(lv.114)"},
{"id":133,"name":"西羌黑熊(lv.114)"},
{"id":134,"name":"西羌雪豹(lv.114)"},
{"id":136,"name":"青尾巨蝎(lv.115)"},
{"id":137,"name":"风火巨蜥(lv.115)"},
{"id":138,"name":"熔岩巨魔(lv.115)"},
{"id":140,"name":"绿腹白蚁(lv.116)"},
{"id":141,"name":"匈奴勇士(lv.116)"},
{"id":142,"name":"匈奴狼骑(lv.116)"},
{"id":144,"name":"寒梅鹿(lv.117)"},
{"id":145,"name":"焦木虎(lv.117)"},
{"id":146,"name":"赤面白猿(lv.117)"},
{"id":148,"name":"鬼面侏儒(lv.118)"},
{"id":149,"name":"榆木傀儡(lv.118)"},
{"id":150,"name":"遗弃铜人(lv.118)"},
{"id":152,"name":"朔方石人(lv.119)"},
{"id":154,"name":"朔方树人(lv.119)"},
{"id":155,"name":"朔方岩魔(lv.119)"},
{"id":157,"name":"红袍蜘蛛(lv.120)"},
{"id":159,"name":"沙漠野人(lv.120)"},
{"id":160,"name":"沙漠鬣狗(lv.120)"},
{"id":206,"name":"盗墓贼(lv.132)"},
{"id":207,"name":"墓穴甲虫(lv.133)"},
{"id":208,"name":"地宫工匠(lv.134)"},
{"id":209,"name":"秦皇精兵俑(lv.135)"},
{"id":210,"name":"机关石人(lv.136)"},
{"id":211,"name":"地宫幽灵(lv.137)"},
{"id":212,"name":"秦将护卫(lv.138)"},
{"id":213,"name":"机关守卫(lv.139)"},
{"id":214,"name":"秦将侍卫(lv.140)"},
{"id":215,"name":"秦陵蝙蝠(lv.141)"},
{"id":216,"name":"秦陵御卫(lv.142)"},
{"id":217,"name":"秦陵葬妃(lv.143)"},
{"id":218,"name":"西域马匪(lv.144)"},
{"id":219,"name":"荒原蝎(lv.145)"},
{"id":220,"name":"火翼牛(lv.146)"},
{"id":221,"name":"铁甲翼牛(lv.147)"},
{"id":222,"name":"大黑熊(lv.148)"},
{"id":223,"name":"巴伦莽盖(lv.149)"},
{"id":224,"name":"重甲莽盖(lv.150)"},
{"id":225,"name":"火精灵(lv.151)"},
{"id":227,"name":"藤甲勇士(lv.153)"},
{"id":228,"name":"苗越刺客(lv.154)"},
{"id":229,"name":"嗜血鳄鱼(lv.155)"},
{"id":230,"name":"鳄鱼帮杀手(lv.156)"},
{"id":231,"name":"鳄鱼帮堂主(lv.157)"},
{"id":232,"name":"河妖(lv.158)"},
{"id":233,"name":"木牛流马(lv.159)"},
{"id":234,"name":"远古石像(lv.160)"},
{"id":235,"name":"利爪鬼魂(lv.161)"},
{"id":236,"name":"风精灵(lv.162)"},
{"id":237,"name":"铁箱怪(lv.163)"},
{"id":238,"name":"西凉亡魂(lv.164)"},
{"id":239,"name":"鬼刀兵(lv.165)"},
{"id":206,"name":"盗墓贼(lv.132)"},
{"id":207,"name":"墓穴甲虫(lv.133)"},
{"id":208,"name":"地宫工匠(lv.134)"},
{"id":209,"name":"秦皇精兵俑(lv.135)"},
{"id":210,"name":"机关石人(lv.136)"},
{"id":211,"name":"地宫幽灵(lv.137)"},
{"id":212,"name":"秦将护卫(lv.138)"},
{"id":213,"name":"机关守卫(lv.139)"},
{"id":214,"name":"秦将侍卫(lv.140)"},
{"id":215,"name":"秦陵蝙蝠(lv.141)"},
{"id":216,"name":"秦陵御卫(lv.142)"},
{"id":217,"name":"秦陵葬妃(lv.143)"},
{"id":218,"name":"西域马匪(lv.144)"},
{"id":219,"name":"荒原蝎(lv.145)"},
{"id":220,"name":"火翼牛(lv.146)"},
{"id":221,"name":"铁甲翼牛(lv.147)"},
{"id":222,"name":"大黑熊(lv.148)"},
{"id":223,"name":"巴伦莽盖(lv.149)"},
{"id":224,"name":"重甲莽盖(lv.150)"},
{"id":225,"name":"火精灵(lv.151)"},
{"id":227,"name":"藤甲勇士(lv.153)"},
{"id":228,"name":"苗越刺客(lv.154)"},
{"id":229,"name":"嗜血鳄鱼(lv.155)"},
{"id":230,"name":"鳄鱼帮杀手(lv.156)"},
{"id":231,"name":"鳄鱼帮堂主(lv.157)"},
{"id":232,"name":"河妖(lv.158)"},
{"id":233,"name":"木牛流马(lv.159)"},
{"id":234,"name":"远古石像(lv.160)"},
{"id":235,"name":"利爪鬼魂(lv.161)"},
{"id":236,"name":"风精灵(lv.162)"},
{"id":237,"name":"铁箱怪(lv.163)"},
{"id":238,"name":"西凉亡魂(lv.164)"},
{"id":239,"name":"鬼刀兵(lv.165)"},
{"id":240,"name":"持剑灵鬼(lv.166)"},
{"id":241,"name":"西凉怨灵(lv.167)"},
{"id":242,"name":"幽鬼锤将(lv.168)"},
{"id":243,"name":"狂蛮魈(lv.169)"},
{"id":244,"name":"黄巾傀儡(lv.170)"},
{"id":247,"name":"炙热蚂蚁(lv.172)"},
{"id":248,"name":"机械战戟(lv.173)"},
{"id":249,"name":"机械弩兵(lv.174)"},
{"id":250,"name":"金刚獠(lv.175)"},
{"id":251,"name":"魔能火屠(lv.176)"},
{"id":252,"name":"旋刀侍卫(lv.177)"},
{"id":253,"name":"磁电僵尸兵(lv.178)"},
{"id":254,"name":"合金弩兵(lv.179)"},
{"id":255,"name":"铁甲鲨人(lv.180)"},
{"id":257,"name":"前哨匪军(lv.182)"},
{"id":258,"name":"重锤匪军(lv.183)"},
{"id":259,"name":"匪军法祀(lv.184)"},
{"id":261,"name":"水镜绿蛙(lv.186)"},
{"id":262,"name":"水镜仙灵(lv.187)"},
{"id":263,"name":"水镜花灵(lv.188)"},
{"id":264,"name":"水镜树灵(lv.189)"},
{"id":266,"name":"紫魄幽灵(lv.191)"},
{"id":267,"name":"碧魂幽灵(lv.192)"},
{"id":268,"name":"幽灵法师(lv.193)"},
{"id":269,"name":"幽灵统领(lv.194)"},
{"id":271,"name":"赤色狮狼(lv.196)"},
{"id":272,"name":"独眼蜘蛛(lv.197)"},
{"id":273,"name":"山贼祭师(lv.198)"},
{"id":274,"name":"喷火异人(lv.199)"},
{"id":276,"name":"蛮夷枪兵(lv.201)"},
{"id":277,"name":"蛮夷锤兵(lv.202)"},
{"id":278,"name":"蛮夷弩兵(lv.203)"},
{"id":279,"name":"蛮夷炮兵(lv.204)"},
{"id":281,"name":"地宫守卫(lv.206)"},
{"id":282,"name":"地宫力侍(lv.207)"},
{"id":283,"name":"地宫统领(lv.208)"},
{"id":284,"name":"地宫怪兽(lv.209)"},
{"id":288,"name":"皇陵兵俑(lv.211)"},
{"id":289,"name":"皇陵石卫(lv.212)"},
{"id":291,"name":"皇陵机关(lv.213)"},
{"id":293,"name":"皇陵将卫(lv.214)"},
{"id":295,"name":"剑阁校尉(lv.216)"},
{"id":296,"name":"剑阁锤兵(lv.217)"},
{"id":297,"name":"剑阁戟兵(lv.218)"},
{"id":298,"name":"剑阁刀兵(lv.219)"},
{"id":300,"name":"徐州力士(lv.221)"},
{"id":301,"name":"徐州禁卫(lv.222)"},
{"id":302,"name":"徐州锤兵(lv.223)"},
{"id":303,"name":"徐州校尉(lv.224)"},
{"id":305,"name":"峡谷黑熊(lv.226)"},
{"id":306,"name":"峡谷巨锷(lv.227)"},
{"id":307,"name":"峡谷野狼(lv.228)"},
{"id":308,"name":"峡谷狼王(lv.229)"},
{"id":311,"name":"硕鼠(lv.231)"},
{"id":312,"name":"金毛犬(lv.232)"},
{"id":313,"name":"毒刺狂蜂(lv.233)"},
{"id":314,"name":"炼狱使者(lv.234)"},
{"id":316,"name":"大闸蟹(lv.236)"},
{"id":317,"name":"水兽(lv.237)"},
{"id":318,"name":"豚仔(lv.238)"},
{"id":319,"name":"虾米小兵(lv.239)"},
{"id":322,"name":"巨型蜗牛怪(lv.241)"},
{"id":323,"name":"巨食人花(lv.242)"},
{"id":324,"name":"沙漠幻蝶(lv.243)"},
{"id":325,"name":"灵异小妖(lv.244)"},
{"id":328,"name":"工蚁(lv.246)"},
{"id":329,"name":"兵蚁(lv.247)"},
{"id":330,"name":"巡逻蚁(lv.248)"},
{"id":332,"name":"守卫蚁(lv.249)"},
{"id":334,"name":"殷商法师(lv.251)"},
{"id":335,"name":"殷商铁骑 (lv.252)"},
{"id":336,"name":"殷商战车(lv.253)"},
{"id":337,"name":"殷商战将(lv.254)"},
{"id":339,"name":"铁甲虫(lv.256)"},
{"id":340,"name":"幻蝶(lv.257)"},
{"id":341,"name":"巨蝎(lv.258)"},
{"id":342,"name":"黑蛛(lv.259)"},
{"id":344,"name":"竹熊怪(lv.261)"},
{"id":345,"name":"苍狼(lv.262)"},
{"id":346,"name":"机关鸟(lv.263)"},
{"id":347,"name":"饿兽鬼王(lv.264)"},
{"id":349,"name":"象妖(lv.266)"},
{"id":350,"name":"蟹将(lv.267)"},
{"id":351,"name":"虾兵(lv.268)"},
{"id":352,"name":"牛妖(lv.269)"},
{"id":354,"name":"远古三角龙(lv.271)"},
{"id":355,"name":"远古猛犸象(lv.272)"},
{"id":356,"name":"远古剑龙(lv.273)"},
{"id":357,"name":"远古犀牛(lv.274)"},
{"id":359,"name":"牛头战将(lv.276)"},
{"id":360,"name":"暗夜魔女(lv.277)"},
{"id":361,"name":"黑暗猎手(lv.278)"},
{"id":362,"name":"千年狐妖 (lv.279)"},
{"id":365,"name":"倭国骑兵(lv.280)"}
];
    var html = '<select id="mp" >';
     for(let ix in mss){
        html = html +'<option value="'+mss[ix].id+'"><span id="s'+mss[ix].id+'">'+mss[ix].name+'</span></option>';
     }

       html += '</select>';
 
    html +=  '  &nbsp; <a href="#" id="huanjing">幻境扫荡</a>';
//<a  href="javascript:void(0)" class="start">开始</a>  &nbsp;
    $('.div_img_chongzhi').parent().append(html)
    $('.div_img_chongzhi').parent().parent().parent().css('width','550px');
  $('#mp').on('change',function(){
      let id = $('#mp').val();
     startflight(id);
  })
 //
    $(".start").click(function(){

       var gid = $('#mp').val();
      //  stopit();
            $('body').oneTime('5ds',function(){
                    qiangzhi_tuichu_monster_fight_check();
                   console.log("----------停止战斗----------");
                });
            $('body').oneTime('10ds',function(){
                  return_monster_fight_check();
                console.log('退出fight');
            });
             $('body').oneTime('20ds',function(){
                   mpid = gid;
                   //$('.div_img_chongzhi').click();
                  create_monster_fight_check(mpid);///77
                    console.log('开始挂机');
                  $('body').stopTime('B');
                  $('body').oneTime('8ds',function(){show_div_map_npc_check('剑灵')});
                  $('body').oneTime('1s',function(){checkbag(mpid);});
                  $('body').everyTime('60s','B',function(){checkbag(mpid);});
             });
    })

    var qa ='<div id="quick" style="display:none"> <a href="#" class="dirct" data="7">15-1</a>  <a href="#" class="dirct" data="11">20-2</a>  <a href="#" class="dirct" data="15">25-3</a>  <a href="#" class="dirct" data="19">30-4</a>  <a href="#" class="dirct" data="23">35-5</a>  <a href="#" class="dirct" data="27">40-6</a>  <a href="#" class="dirct" data="31">45-7</a>  <a href="#" class="dirct" data="35">50-8</a>  <a href="#" class="dirct" data="39">55-9</a>  <a href="#" class="dirct" data="43">60-10</a>  <a href="#" class="dirct" data="47" >65-11</a>  <a href="#" class="dirct" data="51">70-12</a>  <a href="#" class="dirct" data="55">75-14</a> <a href="#" class="dirct" data="59">80-16</a> <a href="#" class="dirct" data="63">85-18</a> <a href="#" class="dirct" data="67">90-20</a> <a href="#" class="dirct" data="71">95-22</a> <a href="#" class="dirct" data="75">100-24/1</a> <a href="#" class="dirct" data="79">100-26/2</a> <a href="#" class="dirct" data="83">101-28/3</a> <a href="#" class="dirct" data="87">102-30/4</a> <a href="#" class="dirct" data="91">103-33/5</a> <a href="#" class="dirct" data="95">104-36/6</a> <a href="#" class="dirct" data="99">105-39/7</a> <a href="#" class="dirct" data="103">106-42/8</a> </div> ';
    $('#div_daguai_lianji .div_main_title_flow2').parent().append(qa);

    $('#qdao').click(function(){ //qiandao
       //获取当前挂机图
        var mp = $('#span_role_boss_nick_name_monster_fight').text();
        console.log(mp);
        var lv = mp.split('.');
        mp = lv[0].split('(');
        lv[1] = lv[1].replace('\)','');
        var id = 4;
        if(lv[1]<132){ id = 5;}
        if(lv[1]>=132){ id = 6;}
        if(lv[1]>=166){ id = 7;}
        if(lv[1]>=206){ id = 8;}
        stopit();
        $('body').oneTime('10ds',function(){wancheng_qiandao_check();console.log('已签到');});//qiandao

        $('body').oneTime('15ds',function(){biwudahui_baoming_check();console.log('武林大会已报名');$('#div_system_channel').append('<div style="color:yellow;font-weight:bold;padding:5px;">***** 武林大会报名成功 ******</div>')});//guozhan
        $('body').oneTime('15ds',function(){
             show_div_map_npc_check('炼造坊')
            lanzhuang_liangang_equipment_all_check();
            $('#div_lianzaofang').hide();
        });
        $('body').oneTime('18ds',function(){show_daguai_lianji_boss_list_container(id,'Map'+id);});
        $('body').oneTime('30ds',function(){
           $('#div_daguai_lianji_boss_list div').each(function(){
             if($(this).html().indexOf(mp[0])>0){
             $(this).find('img').click();
            }
          })
        });
    })

    $('#huanjing').click(function(){
        stopit();
       var mp = $('#span_role_boss_nick_name_monster_fight').text();
      show_div_map_npc_check('幻境冒险');
      $('body').oneTime('5ds',function(){
        var ii;
          $('#div_huanjing_maoxian_boss_list button').each(function(i,el){
              if($(this).text() == '扫荡'){
                  ii = i;
              }
          });
          $('#div_huanjing_maoxian_boss_list button').eq(ii).click()
          var cs = $('#span_huanjing_maoxian_cishu_vip').text()*1+100;
          $('#ipt_huanjing_saodang_cishu').val(cs);
      })
    })

    $('#showqa').click(function(){
      $('#quick').show();
    })

   $('.dirct').click(function(){
      mpid = $(this).attr('data');
      create_monster_fight_check(mpid);///77
       
   })//dirct

  /*  if($('#span_role_player_shengming_monster_fight').is(":visible")){
      $.getScript('http://jianfeile.com:91/Public/js/jquery.timer.js',function(){
              ex.Timer.play();
            })

    }
    */

$('.div_img_chongzhi').removeAttr('onclick').html('挂机').click(function(){
     $('body').oneTime('5ds',function(){
                    qiangzhi_tuichu_monster_fight_check();

                });
            $('body').oneTime('10ds',function(){
                  return_monster_fight_check();
            });
            $('body').oneTime('20ds',function(){
                    create_monster_fight_check(mpid);///77
                    console.log('开始挂机');
                    $('body').stopTime('B');
                     $('body').oneTime('1s',function(){checkbag(mpid);});
              	    $('body').everyTime('60s','B',function(){checkbag(mpid);});
             });
})





// check bag, if the bag is full then sell
function checkbag(mpid){

	$('body').oneTime('1ds',function(){
		show_flow_renwu_shuxing_check();
        $('#div_renwu_shuxing').hide();
	});
    $('body').oneTime('3ds',function(){
	   show_material_list_renwu_shuxing_check2();
	});
    $('body').oneTime('8ds',function(){
      var hxs = $('#div_baoguo_list_flow_renwu_shuxing div').eq(0).text().trim();
      var tar = $('#span_need_huanxianshi_jianling').text()*1;
      var s = hxs.replace(/[^0-9]/ig,"");
      var xs = lasthxs == 0 ? 0 :  s - lasthxs ;
      tar = tar - s;
      lasthxs = s;
	   console.log( hxs+ " ↑" +xs +' →'+tar);
       console.log("大约需要："+parseInt(tar/xs)+' min');
	});
	$('body').oneTime('10ds',function(){
		var t = $('#span_equipment_num_limit_system_state').text().split('/');
		console.log("包裹: "+t[0]+'/'+t[1]);
		if(t[1]-t[0]<20){
			stopit();
		    $('body').oneTime('15ds',function(){
			         ronglian_equipment_all_jianling_check();
			         console.log('兑换：'+t[0]);
			    });
	    	$('body').oneTime('20ds',function(){
			         create_monster_fight_check(mpid);
			    }); //

		}
	});
	var s = 0;
	$('body').stopTime('SS');
	$('body').everyTime('1s','SS',function(){
	    s++;
	    $('#Button1').html('查看 '+ s +'s');
		})


}
//stop fight
function stopit(){
   qiangzhi_tuichu_monster_fight_check();
    $('body').oneTime('6ds',function(){
                  return_monster_fight_check();
        console.log('stopme战斗');
      });
}




})();
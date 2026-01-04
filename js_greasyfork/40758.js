// ==UserScript==
// @name         炼狱勇士
// @namespace    http://tampermonkey.net/
// @version      5.00
// @description  try to take over the world!
// @author       Laoyu!
// @match        http://lyys.nmb666.com/*
// @require      https://greasyfork.org/scripts/3465-jquery-timers/code/jQuerytimers.js?version=10415
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40758/%E7%82%BC%E7%8B%B1%E5%8B%87%E5%A3%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/40758/%E7%82%BC%E7%8B%B1%E5%8B%87%E5%A3%AB.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var xu, dc, m, s, count = 0;
	var sw, sw0, mm, mm0, lv0 = 0,
		_lv, lv1, lv2, lv3 = 0;
	var sec = 0;
	var _sw = 200000000000;
	//  var js = '<script src="http://jianfeile.com:91/Public/js/jquery.timer.js"></script>';
	//    $('body').append(js);
	var htmx = '<span id="mm0" style="display:none"></span><span id="sw0" style="display:none"></span><span id="_lv" style="display:none"></span><input class="button9 bt_main_button_navi" id="auto_do" type="button" value="自动战斗"><button id="qiandao">签到</button><button id="songqian">房租</button>';
	$('#bt_stop_fight_maoxian').parent().append(htmx);

         var scode = "<div id='fee' style='display:block; clear:both'><input id='scode' style='clear:both; width:50%' value=\"$('body').everyTime('1ds','AA',function(){shengji_shenshou_check(1)})\" /><button id='run'>RUN</button>  <button id='stop' >Stop</button></div>"
        $('#div_shenshou_list').append(scode);

	var htmc = '<input class="button1 bt_main_navigation" style="background-color:#ffe988" onclick="show_div_youjian()" type="button" value="邮件" /><input type="checkbox" id="bcc" value="yes" style="display:none"><select name="lvs" id="lvs" style="display:none"><option value="lv.190|8">lv.190</option><option value="lv.250|9">lv.250</option><option value="lv.300|10">lv.300</option><option value="lv.350|11">lv.350</option><option value="lv.400|12">lv.400</option><option value="lv.450|13">lv.450</option><option value="lv.500|14">lv.500</option><option value="lv.550|15">lv.550</option><option value="lv.600|16">lv.600</option><option value="lv.650|17">lv.650</option><option value="lv.700|18">lv.700</option><option value="lv.750|19">lv.750</option><option value="lv.800|20">lv.800</option><option value="lv.850|21">lv.850</option><option value="lv.900|22">lv.900</option></select> <span id="jiechu">解除</span>';
	$('#div_navigation').append(htmc);
	$('#div_game_list b').replaceWith('<b id="jacc" style="cursor:help">炼狱勇士</a></b>');

	$('body').everyTime('1s', function () {

		if ($('#ffcc').length == 0) {
			htmx = '<div id="ffcc"><div>------------------------------</div><div>难度：<span id="nd" style="padding-right:40px;"></span> 积分：<span id="first-jf"></span></div><div>声望：<span id="sw" ></span>&nbsp;  <span id="sw1"></span>/min</div><div>金钱：<span id="mm" ></span>&nbsp;  <span id="mm1"></span>/min</div><div>时间：<span id="time0"></span></div><div >DC：<span id="dc"></span></div><div>LV:<span id="lv"></span></div><span id="timestamp" style="display:none"></span><div id="barbg" style="height:10px;width:200px; background:#fff;"><div id="bar" style="height:10px;background:#f00"></div></div></div>';
			$('#div_zhudong_skill_list_maoxian_fight').append(htmx);

		}
		ajx();
	})

	var myDate = new Date();
	var hh = myDate.getHours(); //获取当前小时数(0-23)

	$('#qiandao').everyTime('1s', 'init', function () {
		if ($('#div_navigation').is(":visible")) {
			$('#qiandao').stopTime('init');



			$('body').oneTime('1s', function () {
				 $('#qiandao').click();
			});

		} else {
			console.log('waiting...')
		}
	})




	function ajx() {
		$('#nd').html($('#span_nandu_lv_renwu_shuxing').html());
		$('#first-jf').html($('#span_score_renwu_shuxing').text());
		if ($('#div_navigation').is(":visible")) {

      let nstamp = Date.parse(new Date())/1000;
      let stamp = $('#auto_do').attr('stamp')*1;


			$('#time0').html(sec + ' s');
			sw = $('#span_shengwang_renwu_shuxing').text();
            sw = getmoney(sw);
			mm = $('#span_money_renwu_shuxing').text();

			mm = getmoney(mm);

			var sw1 = parseInt((sw * 1 - sw0 * 1) / sec) * 60;
			var mm1 = parseInt((mm * 1 - mm0 * 1) / sec) * 60;

            sec = nstamp - stamp;
			// $('#sw').html(sw*1 - sw0 *1);
			// $('#mm').html(mm*1 - mm0 *1);
			$('#sw').html(sw);

			$('#mm').html($('#span_money_renwu_shuxing').text());
			$('#sw1').html(sw1);
			$('#mm1').html(mm1);

			dc = (_sw - sw) / sw1;
			dc = parseInt(dc * 60);
			hh = parseInt(dc / 3600);
			m = parseInt((dc % 3600) / 60);
			s = dc % 60;
			dc = hh + ":" + m + ":" + s;
			$('#dc').html(dc);
            var lv;
		    let lv_score = $('#span_jingyan_renwu_shuxing').text();
            lv_score = getmoney(lv_score);
       let     lv_up = $('#span_jingyan_limit_renwu_shuxing').text();
      var bar = (lv_score / lv_up) * 200;

      lv1 = lv_score - lv0;    // 周期增加
      lv2 = lv_up - lv_score;  // 实时剩余升级
      _lv = $('#_lv').html(); // 初始经验
      _lv = getmoney(_lv)
      lv3 =  lv_score - _lv;

      lv0 = lv_score;
			_lv = parseInt(lv3 / sec);
			lv = parseInt(lv2 / _lv); //剩余时间

			//lv = parseInt(lv * 60);
			hh = parseInt(lv / 3600);
			m = parseInt((lv % 3600) / 60);
			s = lv % 60;
		//	lv = hh + ":" + m + ":" + s;
            lv = lv>600 ? parseInt(lv/60) + 'm': lv+ 's';

			m = parseInt(lv2 / _lv / 60);
            if(_lv>100000){
            lv2 = parseInt(lv2 / 10000)+'万';
            lv3 = parseInt(lv3 / 10000)+'万';
            _lv = parseInt(_lv / 10000)+'万';}
			$('#lv').html(' ' + lv2 + '/' + lv3 + '/' + _lv + '/' + lv );
			$('#bar').css('width', bar + 'px');

			var lvs = $("#lvs").val().split('|');
			if (!$("#bcc").is(':checked')) {
				return false;
			}
		} else {
			console.log('waiting。。。')
		}
	}





	// Your code here...
	// 获取血量

	$('#auto_do').click(function () {
        sec = 0;
         $(this).attr('stamp',Date.parse(new Date()) / 1000);
        console.log( $('#timestamp').html(),$(this).attr('stamp'));
		sw0 = $('#span_shengwang_renwu_shuxing').text();
		mm0 = $('#span_money_renwu_shuxing').text();
        sw0 = getmoney(sw0);
		$('#sw0').html(sw0);
		$('#mm0').html(mm0);
		mm0 = getmoney(mm0);

		lv3 = $('#span_jingyan_renwu_shuxing').text().split('/');
		$('#_lv').html(lv3[0]);

		$('#nd').html($('#span_nandu_lv_renwu_shuxing').html());
		$('#qiandao').html("签到" + $('#span_wakuang_cishu').html());
		//积分
		$('#first-jf').html($('#span_score_renwu_shuxing').text());


$('#div_maoxian_fight_message_container').parent().next().html('<span id="getlogs" style="color:#fff;cursor:pointer">获取日志 </span><span class="cls">清空</span><pre style="display:block" id="logs"></pre>');
						$('#getlogs').click(function () {
							var txt = $('#div_maoxian_fight_message').html();
							console.log(txt);
							txt = txt.replace(/<div.*?>/ig, '');
							txt = txt.replace(/<\/div>/ig, '\n');
							txt = txt.replace(/^怪物.*\n/i, '');
							$('#logs').html(txt);
						});
						$('.cls').click(function () {
							$('#logs').html('')
						})

	});


	$('#jiechu').click(function () {
		$('#div_navigation input').removeAttr('disabled')
	})

	$('.bt_main_navigation').click(function () {
		$('#div_kuilei div').eq(0).html(' 积分: ' + $('#span_score_renwu_shuxing').html())
	})



	$('#jacc').click(function () {
		var xx;
		var obj = $('#div_server_list button');
		var x = is_login;

		$.each(obj, function (i, o) {
			$(o).removeAttr('onclick');
			$(o).bind('click', function () {
				xx = $(o).html().replace('区', '').trim();

				if (is_login) {
					window.open("game/index.aspx?server_id=" + xx + "&guid=" + guid + "&login_suiji_string=" + login_suiji_string + "&" + Math.random());
				}
			});
		});
		console.log(xx)
	});

	//songqian
	$('#songqian').click(function () {
		stop_fight_maoxian_check(); //stop
		var mpid = getid();
		if (!mpid) {
			alert('系统忙，2秒后再重试');
			return false
		}

		var guid = '63B33A07-3A1C-4A9E-8778-2C49F3663520'; //10086
		if ($('#span_nick_name_renwu_shuxing').html() == '10086') {
			alert('禁止给自己转钱');
			return false;
		}

		var money = getmoney($('#span_money_renwu_shuxing').html()) * 0.96;
		money = parseInt(money);
		show_div_youji_money_flow_check();
		$('body').oneTime('2ds', function () {
			$('#tb_youji_money_receiver_id').val(guid);
			$('#tb_youji_money').val(money);
		})
		$('body').oneTime('5ds', function () {
			youji_money_check();
		})


			$('body').oneTime('5ds', function () {
				create_maoxian_fight_check(mpid);
				setTimeout(function () {
					window.close()
				}, 500);
			})


	});


	$('#qiandao').click(function () {
		var kk;
		var myDate = new Date();
		var hh = myDate.getHours(); //获取当前小时数(0-23)
		
		show_div_wakuang();
		$('body').oneTime('5ds',function(){
			kk = parseInt($('#span_wakuang_cishu').html());
		if (kk == 10 || hh<8) {
            let mi = getid();
			stop_fight_maoxian_check(); //stop
            $("body").oneTime('4ds', function () {
					lingqu_jingjichang_jiangli_check();
				}) //领取礼包
            $("body").oneTime('8ds', function () {
                create_maoxian_fight_check(mi);//
			$('#auto_do').click();
            })
			
			return false;
		} else {


			var mpid = getid();

			if (!mpid) {
				$('body').oneTime('2s',function(){$('#qiandao').click();})
                mpid=8;
				//return false
			}

			stop_fight_maoxian_check(); //stop
			// show_div_qiandao()
			// $("body").oneTime('1ds', function () {
			// 		qiandao_check();
			// 	}) //签到

			$("body").oneTime('4ds', function () {
					lingqu_jingjichang_jiangli_check();
				}) //领取礼包
			$("body").oneTime('5ds', function () {
				show_div_wakuang();
			})
			$("#jiechu").everyTime('5ds', 'wk', function () {
				kk = parseInt($('#span_wakuang_cishu').html());


				if (kk < 10) {
					wakuang_check();
				} else {
					$("#jiechu").stopTime('wk');

					$('body').oneTime('1s', 'mx', function () {


						create_maoxian_fight_check(mpid);
						$('body').oneTime('1s', function () {
							$('#auto_do').click();
						});


					});


				}
			})

		}
		})


	})

	//自动开启辅助
	$('#div_maoxian_list input').click(function () {
		console.log('---');
	}, function () {
		//$('#auto_do').click();
	})

    $('#run').click(function(){
       eval($('#scode').val());
    })
    $('#stop').click(function(){
       $('body').stopTime('AA');
    })

	//stop
	function getid() {
		//  var lv = $('#div_monster_maoxian_fight_33 div').eq(1).text().split('.');
		//    if(!lv[0]){alert('时机未成熟，请稍候！');return false;}


		var arr = {};
		arr['1'] = '1';
		arr['10'] = '2';
		arr['25'] = '3';
		arr['45'] = '4';
		arr['70'] = '5';
		arr['100'] = '6';
		arr['140'] = '7';
		arr['190'] = '8';
		arr['250'] = '9';
		arr['300'] = '10';
		arr['350'] = '11';
		arr['400'] = '12';
		arr['450'] = '13';
		arr['500'] = '14';
		arr['550'] = '15';
		arr['600'] = '16';
		arr['650'] = '17';
		arr['700'] = '18';
		arr['750'] = '19';
		arr['800'] = '20';
		arr['850'] = '21';
		arr['900'] = '22';
		arr['950'] = '23';
		arr['1000'] = '24';
		arr['1050'] = '25';
		arr['1100'] = '26';
		arr['1150'] = '27';
		arr['1200'] = '28';
		arr['1250'] = '29';
		arr['1300'] = '30';
		arr['1350'] = '31';
		arr['1400'] = '32';
		arr['1450'] = '33';
		arr['1500'] = '34';
		arr['1600'] = '35';
		arr['1800'] = '36';
		arr['2000'] = '37';
		var tt;
		for (var i = 1; i <= 33; i++) {
			tt = $('#div_monster_maoxian_fight_' + i + ' div').eq(1).text();
			if (tt) {
				var t1 = tt.split('.')[1];
				return arr[t1];
			}
		}
		//      lv = lv[1];
		// return arr[lv];
		return false;
	}

	function getmoney(str) {
		str = str.replace('万', '亿');
		s = str.split('亿');
        if(!isNaN(parseInt(s[2]))){
           return parseInt(s[0]) * 100000000 + parseInt(s[1]) * 10000 + parseInt(s[2]);
        }else{
           return parseInt(s[0]) * 10000 + parseInt(s[1]) ;
        }
	}
})(); // JavaScript Document

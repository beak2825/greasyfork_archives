// ==UserScript==
// @name           bro3-MultipleAutoTroopTool
// @namespace      https:mixi.jp
// @description    出兵ツール
// @include        http://*.3gokushi.jp/*
// @version        ver 2016.06.20.00
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
 
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
 
// @downloadURL https://update.greasyfork.org/scripts/20767/bro3-MultipleAutoTroopTool.user.js
// @updateURL https://update.greasyfork.org/scripts/20767/bro3-MultipleAutoTroopTool.meta.js
// ==/UserScript==
// ver 0.1 α版
// 選択中の拠点にセットされている武将を出兵先で指定した座標にすべて出兵する
// ただし、攻撃の基礎値が3000以上とする
// ver 1.0
// テキスト入力による登録を廃止。領地画面から登録/解除できるように。
// ver 1.1
// 援軍も可能に。攻撃と違い制限は無し。
// ver 1.2
// g1-t MAP対応
// ver 1.3
// 出兵画面仕様が変わったことで援軍できなくなっていた為、突貫修正。
// ver 2016.06.19_01 大剣兵を固定で400つけて出兵させた
// ver 2016.06.20.00 出兵処理後【兵士管理】画面の［全て表示］タブへ移動させる 

j$ = jQuery.noConflict(true);
(function ($){
  
	// Chrome用GM_関数 ---------------------------------------------------------------------------------
	// @copyright 2009, James Campos
	// @license cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
	if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {
		GM_addStyle = function(css) {
			var style = document.createElement('style');
			style.textContent = css;
			document.getElementsByTagName('head')[0].appendChild(style);
		};
 
		GM_deleteValue = function(name) {
			localStorage.removeItem(name);
		};
 
		GM_getValue = function(name, defaultValue) {
			var value = localStorage.getItem(name);
			if (!value)
			return defaultValue;
			var type = value[0];
			value = value.substring(1);
				switch (type) {
					case 'b':
					return value == 'true';
					case 'n':
					return Number(value);
					default:
					return value;
				}
		};
 
		GM_log = function(message) {
			if (window.opera) {
				opera.postError(message);
			return;
			}
			console.log(message);
		};
 
		GM_registerMenuCommand = function(name, funk) {
		//todo
		};
 
		GM_setValue = function(name, value) {
			value = (typeof value)[0] + value;
			localStorage.setItem(name, value);
		};
	}

	// サーバー名の取得(localstorageのkeyに利用)
	var serverName = location.hostname.split(".")[0];
 
	// 出兵ボックスを生成 ---------------------------------------------------------------------------------
	function makeTroopBox(param){
 
		var troopXY = GM_getValue(serverName + "_troopXY", "");
		var param = {};
		if(troopXY == void(0) || troopXY == ""){
			param.troopXY = '<span style="color:#FF0000">未設定</span>';
		}else{
			var xy_obj = troopXY.match(/([\-0-9]{1,4}),([\-0-9]{1,4})/);
			param.troopXY = '<a href="/land.php?x='+xy_obj[1]+'&y='+xy_obj[2]+'">'+troopXY+'</a>';
		}

		var troop_html = (function(param){/*
			<li>
			<div id="troopBox" class="clerfix">
				{{html troopXY}}
				<div id="troop_run"></div>
				　<a class="troop_run" href="javascript:void(0)" data-code="302">討伐</a>　
				<a class="troop_run" href="javascript:void(0)" data-code="301">援軍</a>
			</div>
			<style>
			<!--
				#troopBox{
					font-size:0.8em;
					padding:5px;
					top:0;left:0;
					background-color:#000000;
					border:1px solid #FFFFFF;
				}
				#troop_xy{
					width: 90%;
				}
				#troop_run{
					padding:2px 5px 0 5px;
					margin-bottom:5px;
					color:#FFFFFF;
				}
				.troop_run{
					padding:2px 5px 0 5px;
					color:#000000;
					text-decoration:none;
					pointer:curor;
					background-color:#FFFFFF;
				}
			-->
			</style>
			</li>
		*/}).toString().replace(/(\n)/g, '').split('*')[1];
		var html = $.tmpl(troop_html,param) || '';
 
		var $target = $("#sidebar > ul:first-child");// 表示位置の指定？
		$target.css("position","relative");
		$target.append(html);

		// 出兵ボタンEvent
		$(".troop_run").off("click").on("click",function(){
			var troopXY = GM_getValue(serverName + "_troopXY");
			var troopCode = $(this).attr("data-code");

			if(troopXY == void(0) || troopXY == ""){
				alert("出兵先が未設定です");
				return false;
			}


			$("#troop_run").html('出兵開始');
 
			var card_nos = [];
			var troopDatas = [];
 
			// 設定中のXY座標を取得する
			var check_xy = troopXY.match(/([\-0-9]{1,4}),([\-0-9]{1,4})/);
			if(!$.isArray(check_xy)){
				$("#troop_run").html('出兵');
				alert("出兵先座標の値が不正です");
				return false;
			}
			var troop_x = parseInt(check_xy[1]);
			var troop_y = parseInt(check_xy[2]);
			if(!(troop_x >= -800 && troop_x <= 800 && troop_y >= -800 && troop_y <= 800)){
				$("#troop_run").html('出兵');
				alert("出兵先座標の値が不正です");
				return false;
			}

			// 出兵画面の情報を取得する
			var onePageData = getTroopPageData(troop_x,troop_y,card_nos,troopCode);
			onePageData.then(
				function(){
					// 出兵実行
					if(card_nos.length > 0){
						$(card_nos).each(function(index,value){
							var unit_assign_card_id = value;
							var oneTroopData = troopRun(unit_assign_card_id,troop_x,troop_y,troopCode);
							troopDatas.push(oneTroopData);
						});
						$.when.apply($,troopDatas).then(
							function(){
								//location.href="/facility/unit_status.php";
								location.href="/facility/unit_status.php?type=all";// 【兵士管理】画面の［全て表示］タブへ移動させる 2016.06.20.00
							}
						);
 
					}else{
						$("#troop_run").html('出兵');
						alert("出兵可能な武将が存在しません");
						return false;
					}
				},function(){
 
				}
			);
 
		});
 
		// 出兵画面のデータを取得する
		function getTroopPageData(x,y,card_nos,troopCode){
			var d = new $.Deferred;
 
			$.ajax({
				type: 'get',
				url: '/facility/castle_send_troop.php?x='+x+'&y='+y,
				dataType: 'html',
			}).then(
				function(data){
//					$(data).find(".bushoList > table").each(function(){
					$(data).find(".bushoList > table:not(:first)").each(function(){ 
						var busho_data = $(this).find("tr").eq(1).find("td").eq(1).html();
						var reg_busho_data = busho_data.match(/[-]?[0-9]+(\.[0-9]+)?/g);
						// [2]:カードID [3]:討伐ゲージ
 
						var busho_status = $(this).find("tr").eq(1).find("td").eq(2).html();
						var reg_busho_status = busho_status.match(/[-]?[0-9]+(\.[0-9]+)?/g);
						// [0]:LV [1]:HP [2]:攻撃 [4]:速度
 
						if(troopCode == 302){
							// 出兵条件(攻撃3000以上とする)
							if(parseInt(reg_busho_status[2]) >= 10){ // 3000 → 10 *** 2016.06.19
								if($.inArray(reg_busho_status[2], card_nos) == '-1'){
									card_nos.push(parseInt(reg_busho_data[2]));
								}
							}
						}else{
							card_nos.push(parseInt(reg_busho_data[2]));
						}
					});
					d.resolve(data);
				},function(data){
					d.reject();
				}
			);
			return d.promise();
		}
 
		// 出兵処理
		function troopRun(unit_assign_card_id,x,y,code){
			var d = new $.Deferred;
 
			var params = {};
			params["village_x_value"] = x;
			params["village_y_value"] = y;
			params["village_name"] = "";
	
			params["unit_assign_card_id"] = unit_assign_card_id;
 
			params["radio_move_type"] = code;	// 301:援軍 302:賊討伐 303:強襲
			params["radio_reserve_type"] = 0;
			params["card_id"] = 204;	
			params["btn_send"] = "出兵";
	    // 大剣兵の数を指定（今回は400) *** 2016.06.19　
      params["large_infantry_count"] = large_infantry_N;
			$.ajax({
				type: 'post',
				url: '/facility/castle_send_troop.php',
				data: params,
			}).then(
				function(data){
					d.resolve(data);
				},function(data){
					d.reject();
				}
			);
			return d.promise();
		}
 
 
	}
 
	// 領地登録ボックスを生成 ---------------------------------------------------------------------------------
	function makeLandSaveBox(param){

		var tmpCurrentLand = $("#basepoint .xy").text();
		var regCurrentLand = tmpCurrentLand.match(/(\(.*\))/g);
		var currentLand = regCurrentLand[0];

		var troopXY = GM_getValue(serverName + "_troopXY");
		
		var param = {};
		if(troopXY == void(0)){
			param.xy = '未設定';
		}else{
			param.xy = troopXY;
		}

		var troop_html = (function(param){/*
			<div id="landDataBox">
				出兵ツール 領地：<a class="save">[登録]</a> <a class="del">[解除]</a><br />
				現在の設定値：<span class="troop_land_xy">${xy}</span>
			</div>
			<style>
			<!--
				#landDataBox{
					width:200px;
					padding:5px;
					background-color:#FFFFFF;
					border:1px solid #000000;
					color:#333333;
				}
				#landDataBox a{
					color:#0000DD;
					cursor:pointer;
				}
				#landDataBox span{
					color:#DD0000;
				}
			-->
			</style>
		*/}).toString().replace(/(\n)/g, '').split('*')[1];
		var html = $.tmpl(troop_html,param) || '';
		$("#tMenu_btnif").append(html);

		// 登録無し 解除ボタンを非表示にする
		if(troopXY == void(0)){
			$("#landDataBox a.del").hide();
		}

		// 登録ボタンEvent
		$("#landDataBox a.save").off("click").on("click",function(){
			// localstorageにデータを保存
			GM_setValue(serverName + "_troopXY",currentLand);
			$("#landDataBox a.del").show();
			$("#landDataBox .troop_land_xy").html(currentLand);

			$("#troopBox").closest("li").remove();
			makeTroopBox();

			alert("「"+currentLand+"」を出兵先として登録しました");
		});

		// 解除ボタンEvent
		$("#landDataBox a.del").off("click").on("click",function(){
			// localstorageにデータを削除
			GM_deleteValue(serverName + "_troopXY");
			$("#landDataBox .troop_land_xy").html("未設定");
			$("#landDataBox a.del").hide();

			$("#troopBox").closest("li").remove();
			makeTroopBox();
			alert("出兵先を解除しました");
		});

	}


	// Run
	
	makeTroopBox();

	if (location.pathname == '/land.php') {
		makeLandSaveBox();
	}


})(j$);

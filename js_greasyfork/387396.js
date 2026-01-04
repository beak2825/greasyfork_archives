
// ==UserScript==
// @name         【PPP】リザルト入力サポーター
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://control1993.reversion.jp/scenario/replay/*
// @match        https://control1993.reversion.jp/scenario/replay_result/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387396/%E3%80%90PPP%E3%80%91%E3%83%AA%E3%82%B6%E3%83%AB%E3%83%88%E5%85%A5%E5%8A%9B%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/387396/%E3%80%90PPP%E3%80%91%E3%83%AA%E3%82%B6%E3%83%AB%E3%83%88%E5%85%A5%E5%8A%9B%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==
(function() {
  var href = window.location.href ;
  /*イベシナ用リザルト入力*/
  //リプレイチェック
  if(document.getElementsByClassName("active")[0].innerHTML == "リプレイ入力"){

	document.head.innerHTML +=
	  '<style>'+
	  "#replay::placeholder{color:red;font-weight:bold;font-size:120%;}"+
	  '</style>'
	;
	document.getElementById('replay').placeholder = "※注意※\n名声先設定が未定です。";

	//テキストエリアとリンクの追加
	var checker = document.createElement('div');
	checker.classList.add('checker');
	checker.innerHTML ='<a id="membercheck">【キャラクター登場回数チェック】</a><br><span id="test2"></span>';

	var matching = document.createElement('textarea');
	matching.classList.add('matching');
	matching.style.width="100%";
	matching.placeholder="参加者名をカンマ（,）で区切って入力してください"+
	  "\n拡張機能で追加される『参加者』ボタンをクリックすると表示できます";

	var my_div = document.getElementsByClassName('errors-global')[0];
	my_div.parentNode.insertBefore(matching, my_div);
	my_div.parentNode.insertBefore(checker, my_div);

	//キャラクター登場チェッククリック時の動作
	var membercheck = document.getElementById('membercheck');
	membercheck.addEventListener( "click" , function () {
	  var matching_value = document.getElementsByClassName('matching')[0].value;
	  var replay_value = document.getElementById('replay').value;
	  var test2 = document.getElementById('test2');
	  if(matching_value == ""){
		alert("キャラクターリストを入力してください");
		return;
	  }
	  var matching_ary = matching_value.split(',');
	  var matching_list = "";
	  for(var ma1=0;ma1<matching_ary.length;ma1++){
		if(replay_value.match(matching_ary[ma1])){
		  matching_list += matching_ary[ma1]+
			"："+
			replay_value.match(RegExp(matching_ary[ma1], "g") || []).length+
			"回<br>";
		}else{
		  matching_list += "<font color='red'>"+matching_ary[ma1]+"が登場していません</font><br>";
		}
	  }
	  test2.innerHTML = matching_list;
	} , false );
  }


  if(document.getElementsByClassName("active")[0].innerHTML == "リザルト入力"){
	//パンドラ・名声の一括入力
	document.head.innerHTML += '<style>'+
	  /*余計な名声フォームの非表示*/
//	  '#replay_form .fame + .fame{display:none;}'+
	  /*MVPその他の注意書き追加*/
	  '#replay_form > div:nth-child(2) > br:nth-child(6){display:none;}'+
	  /*成功度の注意書きを非表示*/
	  '#nanido{display:none;}'+
	  '</style>';

	//成功度の注意書きの表示非表示ボタン
	var navigate = document.createElement('a');
	navigate.id='navigate';
	navigate.innerHTML =
	  '【成功条件表示／非表示】';

	var breadcrumb = document.getElementById('replay_form').getElementsByTagName('div')[1];
	breadcrumb.parentNode.insertBefore(navigate, breadcrumb);

	var nanido = document.getElementById('replay_form')
	.getElementsByTagName('div')[1]
	.getElementsByTagName('dl')[0];
	nanido.id = "nanido";

	var navigate_on = document.getElementById('navigate');
	navigate.addEventListener( "click" , function () {
	  if(document.getElementById('nanido').style.display != 'block'){
		document.getElementById('nanido').style.display = 'block';
	  }else{
		document.getElementById('nanido').style.display = 'none';
	  };
	} , false );

	/*パンドラ増減目安表の追加*/
	document.getElementsByTagName("tbody")[2]
	  .getElementsByTagName("th")[0].innerHTML +=
	  '<br>MVP:パ+2､名+5 ／ 戦闘不能:パ-1～3 ／ 重傷:パ-2～5／ パンドラ復活:パ-3／ 薄プレ:名-2～3'


	//個別名声フォームの省略、リザルト初期値個別入力
	//成功度表から規定の数値を取得
	var seikou_result = document.getElementById('replay_form')
	.getElementsByTagName('tbody')[0]
	.getElementsByTagName('tr')[1]
	.getElementsByTagName('td')[2].innerHTML;
	var seikou_meisei = seikou_result.replace(/名(-?[0-9]+).+/g, '$1');
	var seikou_pandora = seikou_result.replace(/.+パ([0-9]+)/g, '$1');
	var sippai_result = document.getElementById('replay_form')
	.getElementsByTagName('tbody')[0]
	.getElementsByTagName('tr')[1]
	.getElementsByTagName('td')[1].innerHTML;
	var sippai_meisei = sippai_result.replace(/名±?(-?[0-9]+)/g, '$1');
	var daiseikou_result = document.getElementById('replay_form')
	.getElementsByTagName('tbody')[0]
	.getElementsByTagName('tr')[1]
	.getElementsByTagName('td')[3].innerHTML;
	var daiseikou_meisei = daiseikou_result.replace(/名(-?[0-9]+).+/g, '$1');
	var daiseikou_pandora = daiseikou_result.replace(/.+パ([0-9]+)/g, '$1');

	/*初期状態は成功にしといて*/
	if(document.getElementsByName("result_condition_common_fame_param[1]")[0]
	   .value == ""){
	  document.getElementsByName("result_condition_common_pandora_param")[0]
		.value = seikou_pandora;
	  document.getElementsByName("result_condition_common_fame_param[1]")[0]
		.value = seikou_meisei;
	}
	/*分配ボタンは押せるようにしといて*/
	document.getElementById('distribute-fame').removeAttribute('disabled');


	/*シナリオ成否をいじると数値が自動で入力されるやつ*/
	var success = document.getElementsByClassName('success')[0];
	success.addEventListener( "change" , function () {
	  if(success.value == "great"){//大成功時
		document.getElementsByName("result_condition_common_pandora_param")[0]
		  .value = daiseikou_pandora;
		document.getElementsByName("result_condition_common_fame_param[1]")[0]
		  .value = daiseikou_meisei;
	  }
	  if(success.value == "failure"){//失敗時
		document.getElementsByName("result_condition_common_pandora_param")[0]
		  .value = 0;
		document.getElementsByName("result_condition_common_fame_param[1]")[0]
		  .value = sippai_meisei;
	  }
	  if(success.value == "success"){//成功時
		document.getElementsByName("result_condition_common_pandora_param")[0]
		  .value = seikou_pandora;
		document.getElementsByName("result_condition_common_fame_param[1]")[0]
		  .value = seikou_meisei;
	  }
	})

	//パンドラ使用時くらいワンクリックでいけよ！
	var form_pandora = document.querySelectorAll('[id^=form_pandora]');
	var Pandorabutton = [];
	for(var fp3=0;fp3<form_pandora.length;fp3++){
	  Pandorabutton[fp3] = document.createElement('input');
	  Pandorabutton[fp3].value = "Ｐ使";
	  Pandorabutton[fp3].setAttribute('type', 'button');
	  Pandorabutton[fp3].setAttribute('onclick', 'this.nextElementSibling.value=-3');

	  form_pandora[fp3].parentNode.insertBefore(Pandorabutton[fp3], form_pandora[fp3]);
	}

	//アイテム・スキルIDフォームの非表示
	var form_item_id = document.querySelectorAll('[id^=form_item_id]');
	var form_skill_id = document.querySelectorAll('[id^=form_skill_id]');
	for(var iif1=0;iif1<form_item_id.length;iif1++){
	  form_item_id[iif1].parentNode.parentNode.style.display = "none";
	  form_skill_id[iif1].parentNode.parentNode.style.display = "none";
	}
  }
})();
// ==UserScript==
// @name Ersatz_Blockerasdf_func
// @author Tomo
// @description remove matome ad
// @include http://*
// @include https://*
// @match   http*://*/*
// @license 
// @version 0.22
// @history 0.1   ¥は使えない
// @history 0.2   addiconとsetsStatusColor分離
// @history 0.3   livedoorは上で対応可
// @history 0.4   setattribute onclick X
// @history 0.5   window.location.reload()すると、変数もやはり初期化
// @history 0.6   createelementしてすぐにID設定はできない。appendしてから。	alert('callback');
// @history 0.7   querySelectorAllを使用
// @history 0.8   これまでgetvalue setvalue動いていなかったのに気づかなかった
// @history 0.9   jsonの入出力完了 クリップボードに貼り付け成功
// @history 0.10  Xpathでの削除を追加
// @history 1.0  TargetSiteが１つしかHitしていなかったのを改善
// @history 1.0  counter実装→queryselectorに変更。queryselectorallとの切り替え
// @history 1.0  chromeでlocal保存は無理そう。
// @history 1.0  アイコンボタンを複数実装
// @history 0.20  tampermonkeyからSleipnir動作確認、function(){/* */}から文字列取り出しはES5の手法。グレイヴ・アクセントを使用する。
// @history 0.21  toString()でSleipnirでは改行、タブなどが消失している様子。match(/\n({\s\S}*)\n/)がHitしなくなる。

// @namespace https://greasyfork.org/users/1222402
// @downloadURL https://update.greasyfork.org/scripts/483399/Ersatz_Blockerasdf_func.user.js
// @updateURL https://update.greasyfork.org/scripts/483399/Ersatz_Blockerasdf_func.meta.js
// ==/UserScript==

   window.addEventListener('load', (function(){
console.log(8);
    })(),false);

  $(window).scroll(function() {
//oreore();
  });

function oreore(){
alert();
};
 console.log(5);
console.log(mmmm);
	/* "  \	/	 \b(バックスペース)	 \f(改ページ)	  \n(改行)	 \r(キャリッジリターン)	   \t(タブ)   */
	const S1 = [{
			"repnTimes": 8,
			"repInterTime": 150,
			"switch_SelorSelAll": 1,
			"LocalStrage":["StopDeleteMenu3",
							"This_Site_AdList",
							"ErsatzBlockerJson",
							],
			"Icon_aspect":"1/1",
			"Icon_StartPos":"4em",
			"Icon_RightPos":"0em",
			"Icon_LeftPos":"0em",
			"Icon_Transitiontime":"0.2s",
			"Icon_Raduius":"20%",
			"Icon_opacity":0.9,
			"Icon_run_color":"green",
			"Icon_end_color":"blue",
			"Icon_off_color":"red",
			"Icon_visible":"hidden",
			"txt_shadow":"1px 1px 2px black",
			"txt_overflow": "hidden",
			"txt_color": "white",
			"txt_bold": "bold",
			"switchContainer_top": "0.5em",
			
			"DoubleL_border":"solid 1px black",
			"DoubleL_outL":"solid 3px black",
			"DoubleL_outL_off":"2px",
			"DoubleL_margin":"25x",

	}];
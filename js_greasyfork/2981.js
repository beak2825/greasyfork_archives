// ==UserScript==
// @id                   niconico_layout_changer_for_GINZA
// @name                 niconico layout changer for GINZA
// @version              1.7
// @namespace            https://greasyfork.org/ja/scripts/2981
// @homepageURL          https://greasyfork.org/ja/scripts/2981
// @license              https://creativecommons.org/licenses/by-nc-sa/3.0/
// @author               noi
// @description          Expand video-infomation. @nicovideo(GINZA)
// @include              http://www.nicovideo.jp/watch/*
// @run-at               document-start
// @grant                GM_log
// @downloadURL https://update.greasyfork.org/scripts/2981/niconico%20layout%20changer%20for%20GINZA.user.js
// @updateURL https://update.greasyfork.org/scripts/2981/niconico%20layout%20changer%20for%20GINZA.meta.js
// ==/UserScript==

/**********************************************************
概要
ニコニコ動画(GINZA)の「動画情報」を見やすくするためのレイアウトに変更します。

※液晶解像度の幅が1800以上のみ動作します。
※ニコニコが「動画情報を開く」状態をcookieに保存するようになったため、低解像度の対応を外しました。


・動画情報と動画プレイヤーを左右に並べて表示


***********************************************************
更新履歴

05/19/2016 - v1.7 fix:cssの不具合修正
05/19/2016 - v1.6 fix:kusa5.mod対応＆修正
05/16/2016 - v1.5 add:要望のあったkusa5と併用できるように動画位置指定追加
11/13/2014 - v1.4 fix:ニコニコチャンネルの表示バグ＆プレイヤー大画面モードのバグなど
11/13/2014 - v1.3 fix:ニコニコの仕様変更対応＆大規模な作り替え
08/08/2014 - v1.2 fix:css
07/15/2014 - v1.1 fix:表示調整
07/03/2014 - v1.0 release
**********************************************************/


(function() {

	const mid1920 = 500 + 70 + 30;	//最小値定数(中画面プレイヤー500+情報70 + 隙間30)
	const nor1920 = 600 + 70 + 30;	//最小値定数(大画面プレイヤー500+情報70 + 隙間30)

	var mode = "";		//現在のプレイヤーサイズ
	var hInfo = 0;		//詳細情報の高さ
	var height1920 = 0;	//動画プレイヤー枠の高さ
	var move1920=0;		//動画情報の移動量

	var objBody = "";
	var objInfo = "";	//動画情報
	var objFrame = "";	//動画プレイヤー枠


	document.addEventListener("DOMContentLoaded", function(evt){
		var node = evt.target;
		setCSS();
		main(node);
		startObserver();
	}, false);



	//要素の変更監視
	function startObserver(){
		var observer = new MutationObserver(function(mutations){
		    mutations.forEach(function(mutation) {
			
			switch (mutation.type) {

			case 'attributes' : // 属性が変更された
			//mutation.target; // 属性を持つ要素
			//mutation.attributeName; // 属性の名前
			//mutation.attributeNamespace; // 属性の名前空間
			//mutation.oldValue; // 変更前の属性値

				//最大化・縮小化
				if(objBody.clientWidth < 1800 && objFrame.getAttribute("style") != "" && !document.getElementById('kusa5')){
					objFrame.setAttribute("style","");
					return;
				}else if(objFrame.getAttribute("style") == ""){
					check();
					return;
				}


				if(!mutation.target.id.match(/^(videoThumbnailImage|playerAlignmentArea)$/i)) return;

				var strClass = mutation.target.className;
				//動画サイズ(size_normal(フルスクリーンもこれ)、size_medium、size_small)
				if(mutation.target.id.match(/^playerAlignmentArea$/i)){
					if(strClass.match(/^size_/)){
						var tmp = strClass.replace(/^size_/,"");
						if(mode == tmp) return;

						mode = tmp
						check(mode);
					}
					return;
				}


				var thumbTitle = mutation.target.getAttribute("alt");

				if(mutation.oldValue != thumbTitle){
					check();
				}

				return;

			}
		    });
		});

		var target = document.body;
		var config = { childList: true ,subtree: true ,attributes:true};
		observer.observe(target, config);
	}


	//main========================================================================================
	function main(){
try{

		if(!objBody){
			objBody = document.getElementsByTagName("body")[0];
			objInfo = document.getElementById("videoInfo");		//動画情報
			objFrame = document.getElementById("playerContainerWrapper");	//動画プレイヤー枠
		}

		hInfo = objInfo.clientHeight;					//詳細情報の高さ
		var hDif = hInfo  - mid1920;					//詳細情報と最小値定数の差分(詳細情報 - 最小値定数)
		height1920 = mid1920 + hDif + 30;				//CSS1920に使う高さ(最小値定数 + 差分 + 隙間30)
		if(height1920 < mid1920) height1920 = mid1920;

		if(hDif < 0) hDif = 0;
		move1920 = - 830 - hDif;					//固定移動量-830 - 差分

		setData(move1920,height1920);

}catch(e){
	GM_log("nicoLC:"+e);
}

	}//mainここまで=================================================================


	//CSS-----------------------------------
	function setCSS(){

		/*CSS*/
		var css1920 = '@media screen and (min-width: 1800px) {'
		+	'#videoDetailInformation,'	/*スクリプトで上に追加される動画情報*/
		+	'#videoComment > H4,'			/*「動画説明」というタイトル*/
		+	'.toggleDetailExpand,'			/*動画詳細情報を開く*/
		+	'.shortVideoInfo{'			/*動画情報の短縮版*/
		+		'display:none!important;'
		+	'}'
			/*下に最初から読み込まれる動画情報(動画情報を上に表示している状態では非表示にされるため)*/
		+	'.videoMainInfoContainer{display:block!important;}'
			/*動画情報の背景*/
		+	'#videoInfo{position:absolute;left:20px;z-index:999;width:calc(100% - 1120px);min-height:580px;padding:5px 0 0 20px;background:rgba(255,255,255,0.5); }'
		+	'body.size_normal #videoInfo{ width:calc(100% - 1350px);}'
			/*動画情報のタイトル部分などの調整*/
		+	'#videoInfoHead,.videoInformation,#videoComment{ width:100%!important;}'
			/*動画プレイヤーの全体枠(検索などの最小化の時)*/
		+	'body.size_small #playerContainerWrapper{ min-height:150px!important;}'
			/*動画プレイヤー(普通サイズ)*/
		+	'body.size_medium #playerContainerSlideArea{position:absolute;top:100px;right:50px;}'
			/*動画プレイヤー(拡大表示)*/
		+	'body.size_normal #playerContainerSlideArea{position:absolute;top:100px;right:50px;}'
			/*kusa5の動画プレイヤー*/
		+	'body.size_medium #kusa5,body.size_normal #kusa5{position:absolute!important;top:100px!important;left:calc(100% - 1060px)!important; max-width:calc(100% - (100% - 1020px)); max-height: calc(100% - 150px);}'
		+	'#playerContainerWrapper{padding:10px 0 10px 0!important;}'
			/*共有のポップアップ*/
		+	'.expandContainer{position:absolute;z-index:999999;}'
			/*ユーザープロファイル*/
		+	'.userProfile{position:absolute!important;top:-10px;left:calc(100% + 700px);max-width:300px!important;background:rgba(255,255,255,0.5);}'
			/*ユーザープロファイルの子情報*/
		+	'.userProfile *{ max-width:200px!important; }'
			/*チャンネルプロファイル*/
		+	'.ch_prof{width:350px;position:absolute!important;top:-10px;left:calc(100% + 700px);background:rgba(255,255,255,0.5);}'
		+	'.channelFavoriteLink{float:right!important;}'
			/*親動画情報*/
		+	'.parentVideoInfo{position:absolute!important;top:-10px;left:calc(100% + 20px);display:block!important;background:rgba(255,255,255,0.5);}'
			/*動画詳細情報を開く*/
		+	'#bottomVideoDetailInformation{position:absolute;top:20px;right:20px;}'
			/*「動画詳細情報を開く」のポップアップメニュー*/
		+	'.supplementary{position:absolute;top:20px;right:0px;z-index:99;width:300px;background:rgba(255,255,255,0.8);}'

			/*ニコニコ市場*/
			/*市場の枠*/
		+	'.outer{margin-left:5%!important; width:85%!important;}'
		+	'.main{width:75%!important;}'
		+	'#nicoIchiba,#ichibaMain{width:100%!important;}'
			/*改行*/
		+	'#ichibaMain .rowJustify{display:none!important;}'
			/*市場アイテム*/
		+	'.ichiba_mainitem{height:350px;}'

		+'}';//ここまで



		addStyle(css1920);

	}

	//===========================================================================


	//CSSを追加------------------------------------------------
	function addStyle(css) {
		var head = document.getElementsByTagName('head')[0];
		if (!head) { return };

		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}


	//動画情報のリサイズに、枠の高さと詳細情報の移動量を変更する
	function check(flg){
		if(flg == "small" || document.getElementById('kusa5'))return;
		var resize = 0;
		var hInfoNow = objInfo.clientHeight;

		if(hInfo != hInfoNow){
			resize = hInfoNow - hInfo;
			hInfo = hInfoNow;
		}


		if(resize != 0 || flg){
			var sizePlayer = objFrame.getAttribute("nicoLC_height");
			var sizeMove = objInfo.getAttribute("nicoLC_move");

			sizePlayer = parseInt(sizePlayer) + resize;
			sizeMove = parseInt(sizeMove) - resize;

			if(flg == "normal" && sizePlayer < nor1920){
				sizeMove = sizeMove - (nor1920 - sizePlayer);
				sizePlayer = nor1920;
			}else if(flg == "medium"){

				if(sizePlayer > hInfo && sizePlayer > mid1920 - 100) main();
				return;
			}

			setData(sizeMove,sizePlayer);
		}

	}

	//リサイズに対応したデータをセット
	function setData(move,height){
		objInfo.setAttribute("nicoLC_move",move);
		objInfo.setAttribute("style","top:" + move + "px;");
		objFrame.setAttribute("nicoLC_height",height);
		objFrame.setAttribute("style","min-height:" + height + "px;");
	}

})();
// ==UserScript==
// @name        futaba_catalog_large_thumb
// @namespace   https://github.com/himuro-majika
// @description may以外のカタログも大きい画像にしちゃう
// @include     http://*.2chan.net/*/futaba.php?mode=cat*
// @exclude     http://may.2chan.net/b/futaba.php?mode=cat
// @version     1.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14759/futaba_catalog_large_thumb.user.js
// @updateURL https://update.greasyfork.org/scripts/14759/futaba_catalog_large_thumb.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {

	/*
	 * 設定
	 */
	var IMAGE_MAX_SIZE = "100px";	// 画像の最大横サイズ
	var USE_INTERVAL = true;	// 赤福で読み込んだ画像にも反応する


	replace_img();
	var akahukuloadstat;
	if(USE_INTERVAL) {
		setInterval(function(){
			check_akahuku_reload();
		}, 100);
	}
	function replace_img() {
			var Start = new Date().getTime();//count parsing time
		var $thumb = $("body > table[align='center'] > tbody > tr > td > a > img");
		$thumb.each(function(){
			$(this).attr("src",$(this).attr("src").replace("/cat/","/thumb/"));
		});
		$thumb.attr({
			"height": "",
			"width": ""
		}).css({
			"max-width": IMAGE_MAX_SIZE,
			"max-height": IMAGE_MAX_SIZE
		});
			console.log('futaba_catalog_large_thumb Parsing: '+((new Date()).getTime()-Start) +'msec');//log parsing time
	}
	/*
	 *赤福の動的リロードの状態を取得
	 */
	function check_akahuku_reload() {
		if ( get_akahuku_reloading_status() === 0 || get_akahuku_reloading_status() == 1 ) {
			akahukuloadstat = true;
		}
		else if ( get_akahuku_reloading_status() == 2 || get_akahuku_reloading_status() == 3 ) {
			if ( akahukuloadstat ) {
				replace_img();
			}
			akahukuloadstat = false;
		}
		function get_akahuku_reloading_status() {
			var $acrs = $("#akahuku_catalog_reload_status");	//赤福
			var $fvw = $("#fvw_mes");							//ふたクロ
			var relstat;
			if ( $acrs.length ) {
				//赤福
				if ( $acrs.text().match(/ロード中/) ) {
					relstat = 0;
				}
				else if ( $acrs.text().match(/更新中/) ) {
					relstat = 1;
				}
				else if ( $acrs.text().match(/完了しました/) ) {
					relstat = 2;
				}
				else {
					relstat = 3;
				}
			}
			if ( $fvw.length ){
				//ふたクロ
				if ( $fvw.text().match(/Now Loading/) ) {
					relstat = 0;
				}
				else if ( $fvw.text().match(/更新しました/) ) {
					relstat = 2;
				}
				else {
					relstat = 3;
				}
			}
			return relstat;
		}
	}

})(jQuery);

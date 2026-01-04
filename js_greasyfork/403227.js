// ==UserScript==
// @name         マクロミル（SP版）ラクラク連射
// @namespace    macromill_rakuraku_sp
// @version      0.0.1alpha7
// @description  見にくくなる代わりに回答しやすくするスクリプト
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/smartAnswerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @license     新UI作ったやつはうんちでも食べてろ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403227/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E3%83%A9%E3%82%AF%E3%83%A9%E3%82%AF%E9%80%A3%E5%B0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/403227/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%EF%BC%89%E3%83%A9%E3%82%AF%E3%83%A9%E3%82%AF%E9%80%A3%E5%B0%84.meta.js
// ==/UserScript==

/*
このスクリプトを使用すると一部回答不可能な項目がある場合があります。
その場合都度スクリプトを停止して下さい。

*/


(function() {
    'use strict';

	/* 全体の表示画面をウィンドウサイズ分増やす */
	$(document).ready(function(){
		setTimeout(function(){
		  $('body').height($('body').height() + $(window).height()+1000);
		},5000);
	});

	/* 回答をクリックすると自動的にスクロールするようにする */
	$('.qnr-q-ch-form').on("click", function() {
		$(window).scrollTop($(window).scrollTop() + 44);
	});

	/* 個々の設問のサイズを固定する */
	try {
		$('.matrix-item-text').css('max-height','24px');
		$('.matrix-item-text').css('height','24px');
	} catch (e) {}

	/* 個々の設問にある小さな数字を表示しない */
	try {
		$('.matrix-item-counter-disp').css('display','none');
	} catch (e) {}

    /* ABアンケの個々の設問のサイズを固定する */
	try {
		$('.matrix-item-mtt').css('max-height','44px');
		$('.matrix-item-mtt').css('height','44px');
	} catch (e) {}

	/* マトリックスの回答部分の高さを固定する */
	try {
		$('.qnr-q-ch-form').css('max-height','44px');
		$('.qnr-q-ch-form').css('padding','0px 0px 0px 0px');
		$('.qnr-q-ch-form').css('margin','0px 0px 0px 0px');
	} catch (e) {}


 	/* 設問欄の回答欄の画像を削除する */
	/* 念のためにサーバーにアクセスするため遅延削除に変更 */
  try {
		$(document).ready(function(){
			setTimeout(function(){
				$('.matrix-item-text img').remove();
			},2000);
		});
	} catch (e) {}

	/* マトリックスの回答欄の画像を削除する */
	/* 念のためにサーバーにアクセスするため遅延削除に変更 */
  try {
		$(document).ready(function(){
			setTimeout(function(){
				$('.qnr-q-ch-form img').remove();
			},2000);
		});
	} catch (e) {}

	/* マトリックス中の説明文字を取り除く 1 */
	try {
		$('.qnr-q-ch-matrixcomment STRONG').remove();
	} catch (e) {}

	/* マトリックス中の説明文字を取り除く 2 */
	try {
		$('.qnr-q-ch-matrixcomment div').remove();
	} catch (e) {}

	/* マトリックス中の説明文字を取り除く 3 */
	try {
		$('li.qnr-q-ch-matrixcomment').remove();
	} catch (e) {}

	/* マトリックス中の説明文字を取り除く 4 */
	try {
		$('.qnr-q-ch-comment').remove();
	} catch (e) {}

  /* 設問ごとにある閉じるボタンを取り除く */
  try {
    $('.matrix-selection-close').hide();
  } catch (e) {}

  /* 画面の上を取り除く */
  try {
   setTimeout(function(){
      $('.qnr-q-comment').remove();
   }, 4000);
  } catch (e) {}
})();

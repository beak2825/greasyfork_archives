// ==UserScript==
// @name         AtCoderPerformanceColorizer
// @namespace    https://satanic0258.github.io/
// @version      1.0.4
// @description  Colorize performance values in AtCoder's gradebook.
// @author       satanic0258
// @include      https://atcoder.jp/users/*/history*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @copyright    2021, satanic0258 (https://satanic0258.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/371693/AtCoderPerformanceColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/371693/AtCoderPerformanceColorizer.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

$(function() {
    'use strict';

    // -------------->8---------------------------->8--------------

    // 色づけモードには以下の数値を指定します
    // -        0 : なし
    // -        1 : 文字を色づけ
    // -        2 : 背景を色づけ
    // - それ以外 : デフォルト設定

    // パフォーマンス値の色づけモード
    const perfColorizeMode = 2;

    // レート値の色づけモード
    const rateColorizeMode = 2;

    // --------------8<----------------------------8<--------------

    // 読み込み元と整合性を取る
    // https://wiki.greasespot.net/Third-Party_Libraries
    this.$ = this.jQuery = jQuery.noConflict(true);

    // 文字に色付けする
    function colorizeCellFont(cell, value){
        cell.text('');

        if(value >= 3200) { // 王冠をつける
            const floorValue = Math.floor(value / 400) * 400;
            cell.append('<img src="https://img.atcoder.jp/assets/icon/crown' + floorValue + '.gif"> ');
        }

        let colorClass = 'user-black'; // 黒
        /**/ if(value <  400) colorClass = 'user-gray';   // 灰
        else if(value <  800) colorClass = 'user-brown';  // 茶
        else if(value < 1200) colorClass = 'user-green';  // 緑
        else if(value < 1600) colorClass = 'user-cyan';   // 水
        else if(value < 2000) colorClass = 'user-blue';   // 青
        else if(value < 2400) colorClass = 'user-yellow'; // 黄
        else if(value < 2800) colorClass = 'user-orange'; // 橙
        else /*            */ colorClass = 'user-red';    // 赤

        cell.append('<span class="' + colorClass + '">' + value + '</span>');
    }

    // 背景に色付けする
    function colorizeCellBackGround(cell, value){
        cell.text(value);

        if(value < 3200) {
            let colorCode = '#FFFFFF'; // 白
            /**/ if(value <  400) colorCode = '#D9D9D9'; // 灰
            else if(value <  800) colorCode = '#D9C5B2'; // 茶
            else if(value < 1200) colorCode = '#B2D9B2'; // 緑
            else if(value < 1600) colorCode = '#B2ECEC'; // 水
            else if(value < 2000) colorCode = '#B2B2FF'; // 青
            else if(value < 2400) colorCode = '#ECECB2'; // 黄
            else if(value < 2800) colorCode = '#FFD9B2'; // 橙
            else /*value < 3200*/ colorCode = '#FFB2B2'; // 赤

            cell.attr('style', 'background-color:' + colorCode + ';>');
        }
        else if(value < 3600) { // 銀
            cell.attr('style', 'background-image: linear-gradient(135deg, #E4E4E4, #EEEEEE, #E4E4E4, #CCCCCC, #C4C4C4);>');
        }
        else { // 金
            cell.attr('style', 'background-image: linear-gradient(135deg, #FFD325, #FDEBA6, #FFE065, #FFCC00, #F0BE00);>');
        }
    }

    // セルをmodeで色づけ
    function colorizeCell(cell, mode){
        const value = cell.text();
        if(isNaN(value)) return;

        if (mode === 0) { // なし
            cell.text(value);
        }
        else if (mode === 1) { // 文字を色づけ
            colorizeCellFont(cell, value);
        }
        else if (mode === 2) { // 背景を色づけ
            colorizeCellBackGround(cell, value);
        }
    }

    $('#history').find('tbody').find('tr').each(function(i, contestInfo) {
        const tds = $(contestInfo).find('td');
        colorizeCell($(tds[3]), perfColorizeMode);
        colorizeCell($(tds[4]), rateColorizeMode);
    });
});
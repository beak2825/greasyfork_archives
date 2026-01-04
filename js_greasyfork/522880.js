// ==UserScript==
// @name         Hameln RelativeGraph
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  ハーメルンの評価グラフを最も評価されたものを100％とした割合基準に再構成します。
// @author       Tomoki
// @match        https://syosetu.org/?mode=ss_detail&nid=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522880/Hameln%20RelativeGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/522880/Hameln%20RelativeGraph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rows = document.querySelectorAll('.table1.no_border')[0].querySelectorAll('table.table1 tr'); // 各評価バー部分のDOMを取得
    var rate_list = []; // 評価数のコレクション


    // * 評価数を取得して割合を計算

    for(var i = 1; i < rows.length; i++){
        var m = rows[i].children[0].textContent.match(/:(\d+)/); // 評価数を取得

        if(m != null){
            rate_list.push(Number(m[1]));
        }
        else{
            rate_list.push(0);
        }
    }

    const max = Math.max(...rate_list);                                             // 評価の最大値（100%に相当する値）
    const rate_percents = rate_list.map(x => Math.ceil(x / max * 100 * 100) / 100); // 各評価の割合（%付き文字列形式）小数点第三位切り上げ


    // * 計算した割合を評価バーに適用

    for(i = 1; i < rows.length; i++){
        var bar = rows[i].children[1].children[0];
        var bar_width  = rate_percents[i - 1]; // rate_percentは作成の際、評価数と関係のないrows[0]を無視して作成している。その調整のため -1

        if(rows[i].children[1].childElementCount >= 2){ // 評価バーの右隣に白色とか黒色とか、詰め物的な使い方がされてるバーがあるパターンがあるので、その対応
            var right_bar = rows[i].children[1].children[1];
            var right_width = 100 - bar_width;

            // right_var の色調整 基準の100%以外は絶対右側空くはずなので（青→黒とかで右側が白色じゃないケースがある）
            if(bar_width != 100){
                right_bar.style.backgroundColor = "rgb(255, 255, 255)";
                right_bar.style.border          = "1px solid rgb(255, 255, 255)"; // 1pxとかsolidとかはたぶん固定値でいい。知らんけど
            }
            else{
                right_bar.style.backgroundColor = bar.style.backgroundColor;
                right_bar.style.border          = bar.style.border;

                // 左側のバーを100%にしてしまうと右側バーがすぐ下にズレて表示されるので、99と1にしておく。どうせ色同じなので見た目変わらん
                bar_width   = 99;
                right_width = 1;
            }

            // 100%の評価バーが黒色だと左バーと右バーの境界線が見えてしまうので消去する（黒色だけ境界線の色がグレーに設定されるっぽい）
            if(right_bar.style.backgroundColor != right_bar.style.borderColor){
                      bar.style.borderRight = 'none';
                right_bar.style.borderLeft  = 'none';
            }

                  bar.style.width =   bar_width + '%';
            right_bar.style.width = right_width + '%';
        }
        else{ // 評価バー本体しか無いパターン
            bar.style.width = bar_width + '%';

            if(bar.style.float == 'right'){ // なんか評価バーのAlignmentが右のケースがあるので
                bar.style.float = 'left';
            }
        }
    }
})();
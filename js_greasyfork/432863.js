// ==UserScript==
// @name         amazonリンク一発取得
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  amazon商品ページにリンクをコピーするボタンを追加
// @author       ikakonbu
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/gp/product/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432863/amazon%E3%83%AA%E3%83%B3%E3%82%AF%E4%B8%80%E7%99%BA%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/432863/amazon%E3%83%AA%E3%83%B3%E3%82%AF%E4%B8%80%E7%99%BA%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
        //ボタン作成
	var target_element = document.getElementById('line');
	var new_element = document.createElement('button');
	new_element.id = "shortlink_copy";
     new_element.textContent = 'リンクコピー';
	target_element.after(new_element);

        //そのままだと長すぎるので無駄な情報をカットしたURLを生成
    var id = location.href;
    var data = id.match("/[dg]p/(product/)?.+?[/?]");
    var url = "https://www.amazon.co.jp" + data[0];

        //CSS生成
    $('#shortlink_copy').css({'border':'0','background':'#f8d57c','padding':'10px 20px 10px 20px','margin-top':'20px','font-size':'15px','font-weight':'600', 'border-radius':'8px', 'box-shadow': '0 5px 5px 0 rgba(0, 0, 0, .3)'});
    $('shortlink_copy_ac').css({'box-shadow':'0 5px 5px 0 rgba(0, 0, 0, .0)','backfgound':'#ffdba8'});

        //クリック時の処理
        document.getElementById("shortlink_copy").onclick = function(){
            if(navigator.clipboard) {
                new_element.id = "shortlink_copy_ac";
                new_element.textContent = 'コピーしたよ！';

                setTimeout(function() {
                    new_element.id = "shortlink_copy";
                    new_element.textContent = 'リンクコピー';// 3000ms後に処理
                }, 3000);

                navigator.clipboard.writeText(url).then(function() {
                });
            } else {
                alert('対応していません。');
            }
        };
    };

})();
// ==UserScript==
// @name         togetter_comment_counter
// @namespace    https://github.com/nukisashineko
// @version      0.2
// @description  putting user's comment counter next to commented user's id
// @author       nukisashineko
// @match        https://togetter.com/li/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32234/togetter_comment_counter.user.js
// @updateURL https://update.greasyfork.org/scripts/32234/togetter_comment_counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初期値を設定出来るHashクラス
    function Hash(undefined_value, initinal_hash_obj){
        if(typeof undefined_value === "undefined" ){
            undefined_value = undefined;
        }
        if(typeof initinal_hash_obj === "undefined" ){
            initinal_hash_obj = {};
        }
        if( typeof initinal_hash_obj !== "object" ){
            throw new Error("Type error: initinal_hash_object's type must be 'undefined' or 'object'");
        }

        return new Proxy(initinal_hash_obj, {
            get: function(target, name) {
                return target.hasOwnProperty(name) ? target[name] : undefined_value;
            }
        });
    }

    // 要素の後ろに挿入
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // 色の取得
    function getColorCodeFromCommentCount(n){
        var colorCode = new Hash("#FF2D2D",{ // else 赤
            1: "#000000", // 黒
            2: "#2D81FF", // 青
            3: "#2DFF85", // 緑
            4: "#EBFF2D", // 黄
            5: "#EBFF2D", // 黄
        });
        return colorCode[n];
    }

    window.addEventListener ("load", function(){
        // ユーザーごとの全コメ数を取得
        var comment_box = document.querySelector('#comment_box');
        var comment_users = Array.prototype.map.call(comment_box.querySelectorAll('div .status_name'), function(x){ return x.innerHTML; });
        var all_user_counts = comment_users.reduce(function(counts, twitterid){ counts[twitterid]++; return counts; }, new Hash(0) );

        // コメントを上から順に処理。
        var current_user_counts = new Hash(0);
        comment_box.querySelectorAll('div[id^=comment_id_] .status_name').forEach(function(twitterid_node, i) {
            // 現コメ数を更新
            var twitterid = twitterid_node.innerHTML;
            current_user_counts[twitterid]++;

            // 必死度で色分けして、twitter idの横に"[現コメ数/全コメ数]"を追加する。
            var user_count_node = document.createElement('span');
            user_count_node.style = "color:"+ getColorCodeFromCommentCount(all_user_counts[twitterid]);
            user_count_node.innerHTML = "["+current_user_counts[twitterid]+"/"+all_user_counts[twitterid]+"]";
            insertAfter(user_count_node, twitterid_node);
        });
    });
})();

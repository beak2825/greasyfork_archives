// ==UserScript==
// @name         ニコニコ静画最新コメ表示10件化
// @namespace    https://greasyfork.org/ja/users/663316
// @version      1.2
// @description  ニコニコ静画のイラストページの最新コメントの表示を10件にします。
// @author       shromichi
// @match        https://seiga.nicovideo.jp/seiga/im*
// @license      public domain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406474/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E6%9C%80%E6%96%B0%E3%82%B3%E3%83%A1%E8%A1%A8%E7%A4%BA10%E4%BB%B6%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406474/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%E6%9C%80%E6%96%B0%E3%82%B3%E3%83%A1%E8%A1%A8%E7%A4%BA10%E4%BB%B6%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // コメント表示数
    const show_comments = 10;
    // 広告エリア非表示
    const hidden_ads = true;

    const remove_ads = false;



    // 全コメント取得関数
    const getAllComments = ((url) => {
        // 要求ヘッダ
        const headers = new Headers();
        // jsonのみ受け入れるように設定
        headers.set("Accept", "application/json");

        // 要求オブジェクト初期設定
        //   GETメソッドを指定
        //   要求ヘッダを設定
        //   キャッシュを無効
        const init = {
            method: "GET",
            headers: headers,
            cache: "no-cache",
        }

        // 要求オブジェクト
        const request = new Request(url, init);

        // fetch()メソッドを使用して非同期ネットワーク通信を行う
        return fetch(request).then((response) => {
            // fetch完了時の処理(responseにはfetchの戻り値が代入されている)

            // Response OKの場合jsonを取得し、取得したものを戻り値とする
            if (response.ok) {return response.json()};

            // Response OKでない場合は例外を投げる
            throw new Error("Network response was not ok.");
        });
    });

    // 表示コメントを指定した数だけ設定する関数
    const setShowComments = ((data, vm, sc) => {
        // 取得したコメント数が現在の表示コメント数よりも大きい場合
        if(data.comment_list.length > vm.commentShowCount()){
            // 取得したコメント数が表示したいコメント数よりも大きい場合
            if(data.comment_list.length > sc){
                // 取得したコメント一覧の先頭(最も過去)から「総コメント数 - 表示したいコメント数」分の要素を削除
                data.comment_list.splice(0, data.comment_list.length - sc);
            }

            // 現在表示しているコメントの全消去
            vm.items.removeAll();
            // コメントの一覧を追加する
            vm.addCommentItemList(data.comment_list);
        }
    });

    // 広告エリア非表示関数
    const hiddenAdsArea = ((id, hidden, remove) => {
        // 広告エリアのノードを取得
        const target = document.getElementById(id);
        // 広告エリア非表示が有効ならスタイルで表示されないようにする
        if(target && hidden){
            target.style.display = "none";
        }
        if(target && remove){
            target.parentNode.removeChild(target);
        }
    });



    // 広告エリアを非表示
    hiddenAdsArea("ads_pc_seiga_illust_watch_east", hidden_ads, remove_ads);

    // id名「ko_comment」の要素
    const ko_comment = document.getElementById("ko_comment");

    // ko_comment のコンテキストのViewModel
    const vm = ko_comment ? window.ko.contextFor(ko_comment).$data : null;

    // イラストID
    const illust_id = vm ? vm.targetId : null;
    // イラストIDが取得できなかった場合は終了
    if (!illust_id) {return;}

    // jsonを取得するurl
    const url = `https://seiga.nicovideo.jp/ajax/illust/comment/list?id=${illust_id}&mode=all`
    // 指定したURLから全コメントを取得する
    getAllComments(url).then((data) => {
        // 取得完了時の処理(dataには戻り値が代入されている)
        setShowComments(data, vm, show_comments);
    }).catch((error) => {
        // 例外処理
        console.log('There has been a problem with your fetch operation: ', error.message);
    });
})();
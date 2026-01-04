// ==UserScript==
// @name         LK reader_開発版
// @name:en      LK reader_dev
// @namespace    http://tampermonkey.net/
// @version      2021.11.13α
// @description  WeLoveManga用のリーダースクリプト（開発版）。
// @description:en A reader for WeLoveManga(dev-edition).
// @author       NfoAlex
// @match        https://welovemanga.net/*
// @include      https://weloma.net/*
// @include      https://klmanga.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422429/LK%20reader_%E9%96%8B%E7%99%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/422429/LK%20reader_%E9%96%8B%E7%99%BA%E7%89%88.meta.js
// ==/UserScript==

/*

THINGS TO DO
- add support for klmanga.com

*/

var modDisabled = 0; //スクリプトが無効化されているかどうか
var modLoaded = false; //スクリプトの主要動作が一度でも実行されたかどうか

var pageReading = 2; //読み込めた漫画の更新欄のページの数

var containerSize = 65; //漫画が入るセクションの横幅（%単位)
var imageHeight = 0; //そのページの漫画の画像に使われる高さ
var imageLoaded = 0; //ロードされた画像の数
var imageSorted = 0; //主要動作によって処理された画像の数

var altMode = 1; //画像を1枚ずらして処理するかどうか
var altBefore = 0; //ずらしを適用する前のスクロール位置の記録

//サイドバーを追加するのに使うスタイル
var styleContainer = '"position:fixed; border-radius:1em 0px 0px 1em; width:3vw; top:15vh; right:0; border:gray solid 2px; background-color:white;"';
var stylePara = '"margin:1px;"';
var styleAlt = '"width:2vh; height:2vh;"';
var styleToggle = '"width:2vh; height:2vh;"';

(function() {

    //もっと古い更新の漫画を表示するボタンを追加する関数
    function loadNext(pR) {
        if ( document.getElementsByClassName("row-last-update" + (pR - 1))[0] != undefined || pR == 2 ) { //もし最近の更新欄の２ページ目が読み込めたら
            $($(".card-body.bg-dark")[1]).append("<div class='row-last-update" + pR + "'></div>");
            //次のページへのボタンを追加
            $(".row-last-update" + pR).load("/manga-list.html?listType=pagination&page=" + pR + "&sort=last_update&sort_type=DESC .row-last-update");

            var addButtonFunc;
            addButtonFunc = setInterval( function () { //一つ前の要素がロードできていなかったらループ
                console.log("loadNext :: trying to add button...");
                if ( document.getElementsByClassName("row-last-update" + pR)[0] != undefined ) { //一つ前の要素がロード完了していたら
                    //追加の漫画更新リストを持ってくるボタンを追加
                    $($(".card-body.bg-dark")[1]).append(`<div id="updateList" class="thumb-item-flow col-6 col-md-3 see-more"><div class="thumb-wrapper"><div class="a6-ratio"><div class="content img-in-ratio" style="background-image:url(app/manga/themes/dark/assets/images/no-cover.png.pagespeed.ce.bllN8QhFwt.png)"></div></div><div class="thumb-see-more"><div class="see-more-inside"><div class="see-more-content"><div class="see-more-icon"><i class="fa fa-arrow-right" aria-hidden="true"></i></div><div class="see-more-text">See more</div></div></div></div></div></div>`);
                    console.log("loadNext :: button added");

                    pageReading++; //更新した漫画リストの個数を更新
                    clearInterval(addButtonFunc); //ループ停止

                } else {
                    console.log("loadNext :: retrying to add button...");

                }

            }, 750);

        } else {
            alert("Page is still updating...");

        }

    }

     //その時いた漫画の位置を計算するだけ
    function getPos(aM) {
        if ( aM == 1 ) {
            altBefore = $($("html")[0]).scrollTop() + $(".chapter-content").width() * 0.05 + $(".chapter-img")[0].height; //1枚ずらしでの位置補完

        } else if ( aM == 2 ) {
            altBefore = $($("html")[0]).scrollTop() - $(".chapter-img")[0].height; //2枚並べから始めるときの位置補完

        } else {
            altBefore = $($("html")[0]).scrollTop();

        }

        return altBefore;

    }

    //sidebar button :: モード変更
    $("body").on("click", "#btAlt", function () {
        altMode++;
        if ( altMode > 2 ) { // 1=画像を１枚残す、2=残さない
            altMode = 1;

        }

        altBefore = getPos(altMode); //今いる漫画の位置を記録

        sortImage(altBefore, 1); //ソート開始

    });

    //sidebar button :: ソートし直す
    $("body").on("click", "#btRef", function () {
        modLoaded = false;
        imageSorted = 0;
        //altBefore = getPos(0);

        //sortImage(altBefore);
        sortImage();

    });

    //sidebar button :: コンテナのサイズを拡大
    $("body").on("click", "#btSizePlus", function () {
        containerSize+=5; //倍率（変数）を更新
        for ( var i=0; i<$(".chapter-img").length; i++ ) { //すべての画像で探索
            $(".chapter-img")[i].style.height = ""; //すべての画像の高さ解除

        }

        imageSorted = 0;

        $(".chapter-content").css("width",containerSize + "%"); //漫画コンテナーのサイズ倍率を適用

        sortImage();

    });

    //sidebar button :: コンテナのサイズを縮小
    $("body").on("click", "#btSizeMinus", function () {
        containerSize-=5;
        for ( var i=0; i<$(".chapter-img").length; i++ ) {
            $(".chapter-img")[i].style.height = "";

        }

        imageSorted = 0;

        console.log("OUT :: コンテナサイズ変数 : " + containerSize);
        $(".chapter-content").css("width",containerSize + "%");

        sortImage();

    });

    var lFirst = []; //横の広い画像を取り込む

    //画像が２個で１個分かどうかをチェック
    function checkSize(iL) { // iL = sortImage関数が指定したロードされたイメージの範囲
        var l = []; //横幅の広い画像を取り込む仮配列（処理中の変化防止）
        var c = imageSorted; //画像探索用のカウント変数

        if ( c < 2 ) c = 2; //画像を３番目から探索するために

        //全画像の高さの制限解除
        for ( var i=0; i<$(".chapter-img").length; i++ ) {
            $(".chapter-img")[i].style.height = "";

        }

        //０番目と１番目の画像は探索する際なぜか取得データがおかしいので手動で対策
        if ( $(".chapter-img")[0].offsetWidth > $(".chapter-img")[0].offsetHeight ) { //もし横が縦よりも広かったら
            l.push(0); //仮配列にプッシュ

        }
        if ( $(".chapter-img")[1].offsetWidth > $(".chapter-img")[1].offsetHeight ) {
            l.push(1);

        }

        //範囲分の画像の幅チェック
        while ( c < iL ) {//画像を３番目から探索
            if ( $(".chapter-img")[c].offsetWidth > $(".chapter-img")[c].offsetHeight ) { //もし横が縦よりも広かったら
                l.push(c); //仮配列にプッシュ

            }

            c++; //カウントアップ

        }

        lFirst = l; //配列をグローバル変数に渡す
        return l;

    }

    //画像の高さを調節して２個に並べるメインの関数
    function sortImage(aB, aL) { //aB => 処理する直前の位置 , aL => すべてをソートし直すのかどうか
        var imageLoadedNow = imageLoaded; //処理中に値変わったらマズイから
        console.log("sortImage :: image loaded at start => " + imageLoadedNow);

        var imageDiffs = checkSize(imageLoadedNow); //画像の横幅でかいやつだけを除外

        $(".chapter-img")[0].style.height = "auto"; //最初は高さを可変にする
        if ( $(".chapter-img")[0].offsetHeight <= 50 ) { //最初の画像の高さがバグってたら処理ストップ
            return;

        }

        //すべての画像のサイズを基準を設定(横)
        var containerImageWidth = $(".chapter-content")[0].offsetWidth / 2 - 0.2; //画像の横をいい感じに設定（コンテナの半分くらい）

        //基準を基に横幅の設定
        for ( var i=imageSorted; i<=imageLoadedNow; i++ ) { //画像を全探索
            if ( imageDiffs.indexOf(i) == -1 ) { //もし画像サイズが広くなかったら（通常）
                $(".chapter-img")[i].style.width = containerImageWidth + "px";

            } else { //もし広かったら
                $(".chapter-img")[i].style.width = $(".chapter-content").css("width"); //幅をコンテナに合わせる


            }
            $(".chapter-img")[i].style.marginTop = "5%"; //上を空ける

        }

        if ( !modLoaded ){
            //画像の最初の高さを取得
            if ( $(".chapter-img")[0].src.indexOf("https://welovemanga.net/uploads/lazy_loading.gif") == -1 && $(".chapter-img")[0].offsetHeight > 50 ) { //最初の画像がロードされきっているかどうか
                console.log("sortImage :: この画像を高さの基準と設定 => " + $(".chapter-img")[0].src + ", 高さ:" + $(".chapter-img")[0].height);

            } else { //もしロードされていないなら
                console.log("sortImage :: まだ一番上の画像がロード中");
                setTimeout(sortImage, 500); //関数をやり直す
                return;

            }

        }

        console.log("sortImage :: sorting image[" + imageSorted + "] from image[" + imageLoaded +"]");

        //画像の位置を設定する
        if ( altMode == 2 ) { //スタートから1枚もずらさずやる
            $(".chapter-img")[0].style.marginLeft = ""; //最初の画像の位置設定を解除
            $(".chapter-img")[0].style.float = ""; //floatを初期化
            if ( aL == 1 ) {imageSorted = 1;}

            if ( imageSorted == 0 ) {imageSorted = 1;} //最初の画像の位置設定を無効化するため
            var c = imageSorted;　//画像配置のカウントを処理した画像の順番に合わせる

            for ( i=imageSorted; i<=imageLoadedNow; i++ ) { //画像の位置設定開始
                if ( c%2==0 && imageDiffs.indexOf(i) == -1 ) { //偶数番目で、横が狭い画像だったら
                    $(".chapter-img")[i].style.float="right"; //右に設定
                    c++;

                } else if ( imageDiffs.indexOf(i) == -1 ) { //奇数番目だったら
                    $(".chapter-img")[i].style.float="left"; //左に設定
                    c++;

                }

            }

        } else { //これも位置設定、しかし1枚を最初に残した場合
            if ( imageSorted == 0 ) { imageSorted++; } //１枚ずらすモードなので１を足す
            var c = imageSorted; //画像配置のカウントを処理した画像の順番に合わせる
            $(".chapter-img")[0].style.float = ""; //１枚を残すためにずらしを無効化
            $(".chapter-img")[0].style.marginLeft = "12.5%"; //真ん中に近づけるスタイル

            if ( aL == 1 ) {imageSorted = 1; c = 1;} //もしすべてをソートし直すなら"最初から"と指定
            if ( imageDiffs.indexOf(1) != -1 ) {c = 1;} //もし２枚目が横に広い画像だった時の対策

            for ( i=imageSorted; i<=imageLoadedNow; i++ ) { //画像の位置設定開始
                if ( c%2==0 && imageDiffs.indexOf(i) == -1 ) { //偶数番目だったら
                    $(".chapter-img")[i].style.float="left";
                    c++;

                } else if ( imageDiffs.indexOf(i) == -1 ) { //奇数番目だったら
                    $(".chapter-img")[i].style.float="right";
                    c++;

                }

            }

        }

        console.log("sortImage :: 使用する高さ : " + $(".chapter-img")[0].height);

        //すべての画像を最初と同じ画像の高さに指定
        for ( var i=1; i<$(".chapter-img").length; i++ ) {
            if ( imageDiffs.indexOf(i) == -1 ) {
                $(".chapter-img")[i].style.height = $(".chapter-img")[0].offsetHeight + "px";

            }

        }

        if ( !modLoaded ) {
            for ( var i=0;i<$("br").length-2;i++ ) { //広告用の余分な余白を削除
                $("br")[0].remove();

            }

            console.log("sortImage :: main function loaded.");
            modLoaded = true; //スクリプトを実行済みにする

        }

        //画像の１枚ズラしの時に位置がズレるのも直す(altBeforeのやつ)
        if ( !(isNaN(aB)) ) {
            $(window).scrollTop(aB); //スクロール

        }

        console.log("sortImage :: image ["+imageSorted+"] from image["+imageLoaded+"] has sorted");
        imageSorted = imageLoadedNow; //処理した画像の数を更新

    }

    var imageStuckAt = 0; //画像ロードで詰まっている場所
    var imageStuckCount = 0; //画像ロードで詰まった回数
    var imageStuckTried = 0; //画像を再読み込みした回数

    //画像の読み込み具合をチェック
    function loadCheck() {
        console.log("loadCheck :: 最後の画像のhref : " + $(".chapter-img")[$(".chapter-img").length-1].src);
        for (var i=3; i<$(".chapter-img").length; i++ ) {
            //if ( $(".chapter-img")[i].currentSrc.indexOf("pagespeed") != -1 || $(".chapter-img")[i].height <= 50 || $(".chapter-img")[i].className.indexOf("lazyloaded") == -1 ) { //すべての画像に対して読み込めてるかをチェック
            if ( $(".chapter-img")[i].currentSrc.indexOf("pagespeed") != -1 || $(".chapter-img")[i].height <= 50 || $(".chapter-img")[i].currentSrc.indexOf("lazy_loading.gif") != -1 ) { //すべての画像に対して読み込めてるかをチェック
                imageLoaded = i;

                console.log("loadCheck :: amount of image loaded => " + imageLoaded + " / " + $(".chapter-img").length);
                $(".loadingDiv")[0].innerText = "LOADING... \n images "+imageLoaded+"/"+$(".chapter-img").length;

                if ( imageStuckCount > 2 ) { //もし3回以上詰まったら
                    $($(".chapter-img")[i]).attr("src", $(".chapter-img")[i].src+"?timestamp=" + new Date().getTime());
                    imageStuckCount = 0;
                    imageStuckTried++; //再読み込みを試した回数

                }

                if ( imageStuckAt == i ) { //もし詰まったと確認したら
                    imageStuckCount++; //詰まった回数を更新
                    console.log("loadCheck :: 画像["+i+"]で詰まっています! ("+imageStuckCount+"回目)");

                } else if ( imageStuckAt < i ) { //もし詰まったのが違う画像に移ったら
                    imageStuckAt = i; //詰まった画像の場所を更新
                    imageStuckCount = 0; //詰まった回数をリセット
                    imageStuckTried = 0;

                }

                if ( imageStuckTried > 3 ) { //もし３回を超えて読み込んで無理なら
                    imageStuckCount = 0; //読み込み直した回数をリセット
                    console.log("loadCheck :: 読み込みループ停止");

                }

                //setTimeout(loadCheck, 750);
                return 1;

            } else if ( i == $(".chapter-img").length-1 ) {
                console.log("loadCheck :: all image has loaded => " + i);
                imageLoaded = i;
                sortImage();
                return 0;

            }

        }

        return 0; //ソートを含めロードがすべて終わったら

    }


    //すべてを始める関数(sortImageを起動)
    function trigg () {
        if ( $(".chapter-img")[0].currentSrc.indexOf("/uploads/lazy_loading.gif") != -1 || (location.host == "welovemanga.net" && $(".chapter-img")[0].className.indexOf("lazyloaded") == -1) || $(".chapter-img")[3].height <= 50 ) { setTimeout(trigg, 500); console.log("trigg :: 初期チェックまだ！"); return;}
        if ( !(loadCheck()) ) { //iもしすべての画像のソートが終わったら
            $(".loadingDiv").remove();
            console.log("trigg :: トリガー終了");
            return;

        } else {
            sortImage();
            setTimeout(trigg, 1000); //画像並べの関数処理のトリガー

        }

    }

      ///////////////////////////////////////////
     ///      ここから直で実行する部分      ///
    /////////////////////////////////////////

    //トップページで"See More"を押されたら
    $(".card-body").on("click", "#updateList", function () {
        $(this).remove(); //押されたボタンを削除
        loadNext(pageReading); //次のページを一覧に追加

    });

    //トップページの最新更新欄を拡張する（２倍に）
    if ( location.pathname == "/home" ) { //もしトップページだったら
        $(".card.card-dark")[1].remove(); //上のスマホアプリ宣伝を削除
        $(".card.card-dark")[2].remove(); //下の謎エリアを削除

        //読み込みのラグからのセレクタバグを考慮し250ms遅らせる
            //ここで表示消えている => おそらくパスに/homeがついているせい
        var addContentUpdated = setTimeout( function () {
            $(".row-last-update").load("/manga-list.html?listType=pagination&sort=last_update&sort_type=DESC .row-last-update"); //"最近の更新"の１ページ目を持ってくる

        }, 250);

        //$(".row-last-update").load("/manga-list.html?listType=pagination&page=1&sort=last_update&sort_type=DESC .row-last-update"); //"最近の更新"の１ページ目を持ってくる
        var addButtonFirst;
        addButtonFirst = setInterval( function () {
            if ( document.getElementsByClassName("row-last-update")[0] != undefined ) {
                loadNext(2);
                clearInterval(addButtonFirst);

            }

        }, 750);

        modDisabled = 1;

    }

    //もし漫画の紹介ページだったら
    if ( $(".manga")[0] != undefined || location.pathname.indexOf("manga-list") > 0 ) { //URL判別
        modDisabled = 1;

    }

    //漫画の画像が４つ以下だったら
    if ( $(".chapter-img").length < 4 ) {
        modDisabled = 1; //無駄なソートを止めるため無効化

    }

    // --- サイドバー用素材集 ---

    var buttonRefresh = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
  </svg>`;

    var buttonAlt = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-front" viewBox="0 0 16 16">
    <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z"/>
    </svg>`;

    var buttonEnabled = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-on" viewBox="0 0 16 16">
    <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
  </svg>`;

    var buttonDisabled = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16">
    <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
  </svg>`;

    // --- ここまで ---

    //URLからスクリプトの状態を把握、UIを出力
    if ( location.search.split("Disabled=")[1] == 1 || modDisabled == 1 ) { //もし無効化されているなら
        modDisabled = 1; //スクリプトを無効化したと設定
        if ( location.pathname != "/" ) {
            var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?\';" class="btStyle">'+buttonDisabled+'</button><button id="btAlt" class="btStyle">'+buttonAlt+'</button><button id="btRef" class="btStyle">Ref</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button><p>2020.<br>10.15</p></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>2020.10.15');
            $("body").append(sidebar); //サイドバーを挿入

        }

    } else {
        modDisabled = 0; //有効化なのでそのまま
        var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?readerDisabled=1\';" class="btStyle">'+buttonEnabled+'</button><button id="btAlt" class="btStyle">'+buttonAlt+'</button><button id="btRef" class="btStyle">'+buttonRefresh+'</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button><p>2020.<br>10.15</p></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>');
        $("body").append(sidebar); //サイドバーを挿入
        //↓Loadingとダイアログを表示
        $("body").append('<div class="loadingDiv" style="color:white; background-color:rgba(0, 0, 0, 0.7); border-radius:20px; font-size:20px; text-align:center; padding-top:1%; width:10%; height:10%; position:fixed; bottom:10%; right:1%; transform:translate(-50%, 50%);"><p>LOADING...</p><p>images 0/'+$(".chapter-img").length+'</p></div>');


    }

    //漫画のページだったら準備
    if ( !modDisabled ) {
        //下準備
        $("h5").remove(); //広告のための要素削除

        //$($(".chapter-img")[$(".chapter-img").length-1]).addClass("image-vol") //ボランティア募集の画像だけ除外
        //$($(".chapter-img")[$(".chapter-img").length-1]).removeClass("chapter-img");
        $(".image-vol").css("margin-top","5%")

        for ( var i=0;i<$("br").length-2;i++ ) { //無駄な空白を削除
            $("br")[0].remove();

        }
        for ( var i=0; i<$(".chapter-img").length; i++) { //すべての画像からボーダーを削除
            $(".chapter-img")[i].style.border = "0";

        }

        $(".chapter-content").css("width","65%"); //漫画を表示する範囲の指定

    }

    //他の要素をCSS調節
        //コメント枠の部分
    if ( location.host == "welovemanga.com" ) $("#commentbox")[0].style.width　=　parseInt($(".chapter-img")[0].style.width) * 2 + "px";

        //チャプター選択の部分
    $(".chapter-before")[0].style.position = "fixed";
    $(".chapter-before")[0].style.bottom = "50px";
    $(".chapter-before")[0].style.left= "0px";
    $(".chapter-before")[0].style.width = $(".chapter-content")[1].offsetLeft + "px";

    $(".select-chapter")[0].style.width="250px";

    try {
    $(".next")[1].style.width = "150px"; //もし次のチャプターが存在するなら
    }
    catch(e){}

    try {
    $(".prev")[1].style.width = "150px"; //もし前のチャプターが存在するなら
    }
    catch(e){}


    if ( !modDisabled ) { //もしスクリプトが無効化、あるいは実行するべき場所じゃないとき
        setTimeout(trigg, 500); //画像並べの関数処理のトリガー

    }

})();

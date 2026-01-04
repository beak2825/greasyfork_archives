// ==UserScript==
// @name         MT reader_開発版
// @name:en      MT reader_dev
// @namespace    http://tampermonkey.net/
// @version      2021.08.07α
// @description  mangaToro用のリーダースクリプト（開発版）。
// @description:en A reader for MangaToro(dev-edition).
// @author       NfoAlex
// @match        https://ja.mangatoro.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430496/MT%20reader_%E9%96%8B%E7%99%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/430496/MT%20reader_%E9%96%8B%E7%99%BA%E7%89%88.meta.js
// ==/UserScript==

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
var stylePara = '"margin:0px 25%;"';
var styleAlt = '"width:2vh; height:2vh;"';
var styleToggle = '"width:2vh; height:2vh;"';

var chapterContent = $(".reading-detail")[0];

(function() {

     //その時いた漫画の位置を計算するだけ
    function getPos(aM) {
        if ( aM == 1 ) {
            altBefore = $($("html")[0]).scrollTop() + $(".reading-detail").width() * 0.05 + $(".page-chapter")[0].firstChild.height; //1枚ずらしでの位置補完

        } else if ( aM == 2 ) {
            altBefore = $($("html")[0]).scrollTop() - $(".page-chapter")[0].firstChild.height; //2枚並べから始めるときの位置補完

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
        for ( var i=0; i<$(".page-chapter").length; i++ ) { //すべての画像で探索
            $(".page-chapter")[i].firstChild.style.height = ""; //すべての画像の高さ解除

        }

        imageSorted = 0;

        $(".reading-detail").css("width",containerSize + "%"); //漫画コンテナーのサイズ倍率を適用

        sortImage();

    });

    //sidebar button :: コンテナのサイズを縮小
    $("body").on("click", "#btSizeMinus", function () {
        containerSize-=5;
        for ( var i=0; i<$(".page-chapter").length; i++ ) {
            $(".page-chapter")[i].firstChild.style.height = "";

        }

        imageSorted = 0;

        console.log("OUT :: コンテナサイズ変数 : " + containerSize);
        $(".reading-detail").css("width",containerSize + "%");

        sortImage();

    });

    var lFirst = []; //横の広い画像を取り込む

    //画像が２個で１個分かどうかをチェック
    function checkSize(iL) { // iL = sortImage関数が指定したロードされたイメージの範囲
        var l = []; //横幅の広い画像を取り込む仮配列（処理中の変化防止）
        var c = imageSorted; //画像探索用のカウント変数

        if ( c < 2 ) c = 2; //画像を３番目から探索するために

        //全画像の高さの制限解除
        for ( var i=0; i<$(".page-chapter").length; i++ ) {
            $(".page-chapter")[i].firstChild.style.height = "";

        }

        //０番目と１番目の画像は探索する際なぜか取得データがおかしいので手動で対策
        if ( $(".page-chapter")[0].firstChild.offsetWidth > $(".page-chapter")[0].firstChild.offsetHeight ) { //もし横が縦よりも広かったら
            l.push(0); //仮配列にプッシュ

        }
        if ( $(".page-chapter")[1].firstChild.offsetWidth > $(".page-chapter")[1].firstChild.offsetHeight ) {
            l.push(1);

        }

        //範囲分の画像の幅チェック
        while ( c < iL ) {//画像を３番目から探索
            if ( $(".page-chapter")[c].firstChild.offsetWidth > $(".page-chapter")[c].firstChild.offsetheight ) { //もし横が縦よりも広かったら
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

        $(".page-chapter")[0].firstChild.style.height = "auto"; //最初は高さを可変にする
        if ( $(".page-chapter")[0].firstChild.offsetHeight <= 50 ) { //最初の画像の高さがバグってたら処理ストップ
            return;

        }

        //すべての画像のサイズを基準を設定(横)
        var containerImageWidth = $(".reading-detail")[0].offsetWidth / 2 - 0.2; //画像の横をいい感じに設定（コンテナの半分くらい）

        //基準を基に横幅の設定
        for ( var i=imageSorted; i<=imageLoadedNow; i++ ) { //画像を全探索
            if ( imageDiffs.indexOf(i) == -1 ) { //もし画像サイズが広くなかったら（通常）
                $(".page-chapter")[i].firstChild.style.width = containerImageWidth + "px";

            } else { //もし広かったら
                $(".page-chapter")[i].firstChild.style.width = $(".reading-detail").css("width"); //幅をコンテナに合わせる


            }
            $(".page-chapter")[i].firstChild.style.marginTop = "5%"; //上を空ける

        }

        if ( !modLoaded ){
            //画像の最初の高さを取得
            if ( $(".page-chapter")[0].firstChild.src.indexOf("https://welovemanga.net/uploads/lazy_loading.gif") == -1 && $(".page-chapter")[0].firstChild.offsetHeight > 50 ) { //最初の画像がロードされきっているかどうか
                console.log("sortImage :: この画像を高さの基準と設定 => " + $(".page-chapter")[0].firstChild.src + ", 高さ:" + $(".page-chapter")[0].firstChild.height);

            } else { //もしロードされていないなら
                console.log("sortImage :: まだ一番上の画像がロード中");
                setTimeout(sortImage, 500); //関数をやり直す
                return;

            }

        }

        console.log("sortImage :: sorting image[" + imageSorted + "] from image[" + imageLoaded +"]");

        //画像の位置を設定する
        if ( altMode == 2 ) { //スタートから1枚もずらさずやる
            $(".page-chapter")[0].firstChild.style.marginLeft = ""; //最初の画像の位置設定を解除
            if ( aL == 1 ) {imageSorted = 0;}

            var c = imageSorted;　//画像配置のカウントを処理した画像の順番に合わせる

            for ( i=imageSorted; i<=imageLoadedNow; i++ ) { //画像の位置設定開始
                if ( c%2==0 && imageDiffs.indexOf(i) == -1 ) { //偶数番目で、横が狭い画像だったら
                    $(".page-chapter")[i].firstChild.style.float="right"; //右に設定
                    c++;

                } else if ( imageDiffs.indexOf(i) == -1 ) { //奇数番目だったら
                    $(".page-chapter")[i].firstChild.style.float="left"; //左に設定
                    c++;

                }

            }

        } else { //これも位置設定、しかし1枚を最初に残した場合
            if ( imageSorted == 0 ) { imageSorted++; } //１枚ずらすモードなので１を足す
            var c = imageSorted; //画像配置のカウントを処理した画像の順番に合わせる
            $(".page-chapter")[0].firstChild.style.float = ""; //１枚を残すためにずらしを無効化
            $(".page-chapter")[0].firstChild.style.marginLeft = "12.5%"; //真ん中に近づけるスタイル

            if ( aL == 1 ) {imageSorted = 1; c = 1;} //もしすべてをソートし直すなら"最初から"と指定
            if ( imageDiffs.indexOf(1) != -1 ) {c = 1;} //もし２枚目が横に広い画像だった時の対策

            for ( i=imageSorted; i<=imageLoadedNow; i++ ) { //画像の位置設定開始
                if ( c%2==0 && imageDiffs.indexOf(i) == -1 ) { //偶数番目だったら
                    $(".page-chapter")[i].firstChild.style.float="left";
                    c++;

                } else if ( imageDiffs.indexOf(i) == -1 ) { //奇数番目だったら
                    $(".page-chapter")[i].firstChild.style.float="right";
                    c++;

                }

            }

        }

        //画像の１枚ズラしの時に位置がズレるのも直す(altBeforeのやつ)
        if ( !(isNaN(aB)) ) {
            $(window).scrollTop(aB); //スクロール

        }

        if ( !modLoaded ) {
            for ( var i=0;i<$("br").length-2;i++ ) { //広告用の余分な余白を削除
                $("br")[0].remove();

            }

            console.log("sortImage :: main function loaded.");
            modLoaded = true; //スクリプトを実行済みにする

        }

        console.log("sortImage :: 使用する高さ : " + $(".page-chapter")[0].firstChild.height);

        //すべての画像を最初と同じ画像の高さに指定
        for ( var i=1; i<$(".page-chapter").length; i++ ) {
            if ( imageDiffs.indexOf(i) == -1 ) {
                $(".page-chapter")[i].firstChild.style.height = $(".page-chapter")[0].firstChild.offsetHeight + "px";

            }

        }

        console.log("sortImage :: image ["+imageSorted+"] from image["+imageLoaded+"] has sorted");
        imageSorted = imageLoadedNow; //処理した画像の数を更新

    }

    //最近の更新から7つ余分な漫画を削除
    function cleanList() {
        if ( $("#history > .thumb-item-flow") != undefined ) { //もし拡張し終えたら
            try { //拡張したが中がまだ読み終えたかどうかを確認
                for ( var i=0; i<7; i++ ) { //７個分まわす
                    $("#history > .thumb-item-flow")[0].remove(); //余分な分を削除（消されたのを考慮して[0]を消す）

                }

            }
            catch(e) { //読み終えてない場合
                setTimeout(cleanList, 750);

            }

        } else { //もし終わったら
            setTimeout(cleanList, 750);

        }

    }

    var imageStuckAt = 0; //画像ロードで詰まっている場所
    var imageStuckCount = 0; //画像ロードで詰まった回数
    var imageStuckTried = 0; //画像を再読み込みした回数

    //画像の読み込み具合をチェック
    function loadCheck() {
        console.log("loadCheck :: 最後の画像のhref : " + $(".page-chapter")[$(".page-chapter").length-1].firstChild.src);
        for (var i=3; i<$(".page-chapter").length; i++ ) {
            //if ( $(".page-chapter")[i].firstChild.currentSrc.indexOf("pagespeed") != -1 || $(".page-chapter")[i].firstChild.height <= 50 || $(".page-chapter")[i].firstChild.className.indexOf("lazyloaded") == -1 ) { //すべての画像に対して読み込めてるかをチェック
            if ( $(".page-chapter")[i].firstChild.currentSrc.indexOf("pagespeed") != -1 || $(".page-chapter")[i].firstChild.height <= 50 || $(".page-chapter")[i].firstChild.currentSrc.indexOf("lazy_loading.gif") != -1 ) { //すべての画像に対して読み込めてるかをチェック
                imageLoaded = i;

                console.log("loadCheck :: amount of image loaded => " + imageLoaded + " / " + $(".page-chapter").length);
                $(".loadingDiv")[0].innerText = "LOADING... \n images "+imageLoaded+"/"+$(".page-chapter").length;

                if ( imageStuckCount > 2 ) { //もし3回以上詰まったら
                    $($(".page-chapter")[i].firstChild).attr("src", $(".page-chapter")[i].firstChild.src+"?timestamp=" + new Date().getTime());
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

            } else if ( i == $(".page-chapter").length-1 ) {
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
        if ( $(".page-chapter")[0].firstChild.currentSrc.indexOf("netsnippet.com") == -1 || $(".page-chapter")[3].firstChild.height <= 50 ) { setTimeout(trigg, 500); console.log("trigg :: 初期チェックまだ！"); return;}
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

    //もし漫画の紹介ページだったら
    if ( $(".reading-control")[0] == undefined || location.pathname.indexOf("manga") == -1 || location.pathname.indexOf("chapter") == -1 ) { //URL判別
        modDisabled = 1;

    }

    //漫画の画像が４つ以下だったら
    if ( $(".page-chapter").length < 4 ) {
        modDisabled = 1; //無駄なソートを止めるため無効化

    }

    //URLからスクリプトの状態を把握、UIを出力
    if ( location.search.split("=")[1] == 0 || modDisabled == 1 ) { //もし無効化されているなら
        modDisabled = 1; //スクリプトを無効化したと設定
        var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?rd=1\';" class="btStyle"><img style='+styleToggle+' src="https://www.flaticon.com/svg/static/icons/svg/1827/1827834.svg"></button><button id="btAlt" class="btStyle"><img style='+styleAlt+' src="https://www.flaticon.com/svg/static/icons/svg/3602/3602305.svg"> </button><button id="btRef" class="btStyle">Ref</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>');
        $("body").append(sidebar); //サイドバーを挿入

    } else {
        modDisabled = 0; //有効化なのでそのまま
        var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?rd=0\';" class="btStyle"><img style='+styleToggle+' src="https://www.flaticon.com/svg/static/icons/svg/1827/1827904.svg"></button><button id="btAlt" class="btStyle"><img style='+styleAlt+' src="https://www.flaticon.com/svg/static/icons/svg/3602/3602305.svg"> </button><button id="btRef" class="btStyle">Ref</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>');
        $("body").append(sidebar); //サイドバーを挿入
        //↓Loadingとダイアログを表示
        $("body").append('<div class="loadingDiv" style="color:white; background-color:rgba(0, 0, 0, 0.7); border-radius:20px; font-size:20px; text-align:center; padding-top:1%; width:10%; height:10%; position:fixed; bottom:10%; right:1%; transform:translate(-50%, 50%);"><p>LOADING...</p><p>images 0/'+$(".page-chapter").length+'</p></div>');


    }

    //漫画のページだったら準備
    if ( !modDisabled ) {
        //下準備
        $("h5").remove(); //広告のための要素削除

        for ( var i=0;i<$("br").length-2;i++ ) { //無駄な空白を削除
            $("br")[0].remove();

        }
        for ( var i=0; i<$(".page-chapter").length; i++) { //すべての画像からボーダーを削除
            $(".page-chapter")[i].firstChild.style.border = "0";

        }

        $(".reading-detail").css("width","65%"); //漫画を表示する範囲の指定

    }

    //他の要素をCSS調節
    $(".reading-detail").css("margin-left","auto");
    $(".reading-detail").css("margin-right","auto");
    $(".comment").css("width",$(".reading-detail").css("width"));
    $(".comment").css("margin","0");

    if ( !modDisabled ) { //もしスクリプトが無効化、あるいは実行するべき場所じゃないとき
        setTimeout(trigg, 500); //画像並べの関数処理のトリガー

    }

    console.log("STATUS ==>>>=== " + modDisabled);

})();

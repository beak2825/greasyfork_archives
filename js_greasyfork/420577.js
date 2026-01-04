// ==UserScript==
// @name         LK reader
// @name:en      LK reader
// @namespace    http://tampermonkey.net/
// @version      2021.03.06
// @description  Lovehug用のリーダースクリプト。
// @description:en A reader for lovehug.
// @author       NfoAlex
// @match        https://lovehug.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420577/LK%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/420577/LK%20reader.meta.js
// ==/UserScript==

/*

THINGS TO DO
- Make a function with adding more content loading on top page's  "NEW MANGA UPDATED" section dynamically.

*/

var modDisabled = 0; //スクリプトが無効化されているかどうか
var modLoaded = false; //スクリプトの主要動作が一度でも実行されたかどうか

var containerSize = 65; //漫画が入るセクションの横幅（%単位)
var imageHeight = 0; //そのページの漫画の画像に使われる高さ
var imageLoaded = 0; //ロードされた画像の数
var imageSorted = 0; //主要動作によって処理された画像の数

var altMode = 1; //画像を1枚ずらして処理するかどうか
var altBefore = 0; //ずらしを適用する前のスクロール位置の記録

(function() {

    //サイドバーを追加するのに使うスタイル
    var styleContainer = '"position:fixed; border-radius:1em 0px 0px 1em; width:3vw; top:15vh; right:0; border:gray solid 2px; background-color:white;"';
    var stylePara = '"margin:0px 25%;"';
    var styleAlt = '"width:2vh; height:2vh;"';
    var styleToggle = '"width:2vh; height:2vh;"';

    //トップページの最新更新欄を拡張する（２倍に）
    if ( location.pathname == "/" ) { //もしトップページだったら
        $($(".card-body.bg-dark")[1]).append("<div class='row-last-update2'></div>"); //更新を含む要素を複製
        $(".card.card-dark")[2].remove(); //下の謎エリアを削除

        $(".row-last-update").load("/manga-list.html?listType=pagination&page=1&sort=last_update&sort_type=DESC .row-last-update"); //"最近の更新"の１ページ目を持ってくる
        $(".row-last-update2").load("/manga-list.html?listType=pagination&page=2&sort=last_update&sort_type=DESC .row-last-update"); //"最近の更新"の2ページ目を持ってくる

        setTimeout(addNext, 750); //もっと古い更新を見るボタンを追加

        return;

    }

    //もっと古い更新の漫画を表示するボタンを追加する関数
    function addNext() {
        if ( $(".row-last-update2")[0].innerText.length > 0 ) { //もし最近の更新欄の２ページ目が読み込めたら
            //次のページへのボタンを追加
            $(".row-last-update2").append(`<div class="thumb-item-flow col-6 col-md-3 see-more"><div class="thumb-wrapper"><div class="a6-ratio"><div class="content img-in-ratio" style="background-image:url(app/manga/themes/dark/assets/images/no-cover.png.pagespeed.ce.bllN8QhFwt.png)"></div></div><a href="/manga-list.html?listType=pagination&page=3&sort=last_update&sort_type=DESC"><div class="thumb-see-more"><div class="see-more-inside"><div class="see-more-content"><div class="see-more-icon"><i class="fa fa-arrow-right" aria-hidden="true"></i></div><div class="see-more-text">See more</div></div></div></div></a></div></div>`);

        } else {
            setTimeout(addNext, 750) //もし読み込めてないならもう一回

        }

    }

    //もし漫画の紹介ページだったら
    if ( $(".manga")[0] != undefined || location.pathname.indexOf("manga-list") > 0 ) { //URL判別
        return; //スクリプトを停止

    }


    //URLからスクリプトの状態を把握、制御
    if ( location.search.split("=")[1] == 0 ) { //もし無効化されているなら
        modDisabled = 1; //スクリプトを無効化したと設定
        var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?rd=1\';" class="btStyle"><img style='+styleToggle+' src="https://www.flaticon.com/svg/static/icons/svg/1827/1827834.svg"></button><button id="btAlt" class="btStyle"><img style='+styleAlt+' src="https://www.flaticon.com/svg/static/icons/svg/3602/3602305.svg"> </button><button id="btRef" class="btStyle">Ref</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>');
        $("body").append(sidebar); //サイドバーを挿入

        return;

    } else {
        modDisabled = 0; //有効化なのでそのまま
        var sidebar = ('<div class="sideBar" style='+styleContainer+'><p style='+stylePara+'>LK Reader</p><br><button onClick="location.href = \'?rd=0\';" class="btStyle"><img style='+styleToggle+' src="https://www.flaticon.com/svg/static/icons/svg/1827/1827904.svg"></button><button id="btAlt" class="btStyle"><img style='+styleAlt+' src="https://www.flaticon.com/svg/static/icons/svg/3602/3602305.svg"> </button><button id="btRef" class="btStyle">Ref</button><br><p style='+stylePara+'>Zoom</p><button id="btSizePlus" class="btStyle">+</button><button id="btSizeMinus" class="btStyle">-</button></div><style>.btStyle{display:block; border-radius:50%; margin: 5%; width:2vw; height:2vw;}</style>');
        $("body").append(sidebar); //サイドバーを挿入
        //↓Loadingとダイアログを表示
        $("body").append('<div class="loadingDiv" style="color:white; background-color:rgba(0, 0, 0, 0.7); border-radius:20px; font-size:20px; text-align:center; padding-top:1%; width:10%; height:10%; position:fixed; bottom:10%; right:1%; transform:translate(-50%, 50%);"><p>LOADING...</p><p>images 0/'+$(".chapter-img").length+'</p></div>');


    }

    //下準備
    $("h5").remove(); //広告のための要素削除

    $($(".chapter-img")[$(".chapter-img").length-1]).addClass("image-vol") //ボランティア募集の画像だけ除外
    $($(".chapter-img")[$(".chapter-img").length-1]).removeClass("chapter-img");
    $(".image-vol").css("margin-top","5%")

    for ( var i=0;i<$("br").length-2;i++ ) { //無駄な空白を削除
        $("br")[0].remove();

    }
    for ( var i=0; i<$(".chapter-img").length; i++) { //すべての画像からボーダーを削除
        $(".chapter-img")[i].style.border = "0";

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

        sortImage();

    });

    //sidebar button :: コンテナのサイズを拡大
    $("body").on("click", "#btSizePlus", function () {
        containerSize+=5; //倍率（変数）を更新
        for ( var i=0; i<$(".chapter-img").length; i++ ) { //すべての画像で探索
            $(".chapter-img")[i].style.height = ""; //すべての画像の高さ解除

        }

        $(".chapter-content").css("width",containerSize + "%"); //漫画コンテナーのサイズ倍率を適用

        sortImage();

    });

    //sidebar button :: コンテナのサイズを縮小
    $("body").on("click", "#btSizeMinus", function () {
        containerSize-=5;
        for ( var i=0; i<$(".chapter-img").length; i++ ) {
            $(".chapter-img")[i].style.height = "";

        }

        $(".chapter-content").css("width",containerSize + "%");

        sortImage();

    });

    var lFirst = []; //横の広い画像を取り込む

    //画像が２個で１個分かどうかをチェック
    function checkSize(iL) { // iL = sortImage関数が指定したロードされたイメージの範囲
        var l = []; //横幅の広い画像を取り込む仮配列（処理中の変化防止）

        for ( var i=imageSorted; i<iL; i++ ) { //処理対象の範囲を探索
            if ( $(".chapter-img")[i].offsetWidth > $(".chapter-img")[i].offsetHeight ) { //もし横が縦よりも広かったら
                l.push(i); //仮配列にプッシュ

            }

        }

        lFirst = l; //配列をグローバル変数に渡す
        return l;

    }

    //画像の高さを調節して２個に並べるメインの関数
    function sortImage(aB, aL) { //aB => 処理する直前の位置 , aL => すべてをソートし直すのかどうか
        var imageLoadedNow = imageLoaded; //処理中に値変わったらマズイから

        var imageDiffs = checkSize(imageLoadedNow); //画像の横幅でかいやつだけを除外

        //もし初回実行だったら
        if ( !modLoaded ) {
            $(".chapter-img")[0].style.height = "auto";
            $(".chapter-content").css("width","65%"); //漫画を表示する範囲の指定

        }

        //すべての画像のサイズを設定(横)
        for ( var i=0; i<=imageLoadedNow; i++ ) { //画像を全探索
            if ( imageDiffs.indexOf(i) == -1 ) { //もし画像サイズが広くなかったら（通常）
                $(".chapter-img")[i].style.width = Math.floor( parseInt( $(".chapter-content")[0].offsetWidth ) / 2 - 0.1 ) + "px"; //画像の横をいい感じに設定（コンテナの半分くらい）

            } else { //もし広かったら
                $(".chapter-img")[i].style.width = $(".chapter-content").css("width"); //幅をコンテナに合わせる


            }
            $(".chapter-img")[i].style.marginTop = "5%"; //上を空ける

        }

        if ( !modLoaded ){
            //画像の最初の高さを取得
            if ( $(".chapter-img")[0].src.indexOf("https://lovehug.net/uploads/lazy_loading.gif") != -1 && $(".chapter-img")[0].style.height != "auto" ) { //最初の画像がロードされきっているかどうか
                setTimeout(sortImage, 500); //関数をやり直す
                return;

            }

        }

        //画像の位置を設定する
        if ( altMode == 2 ) { //スタートから1枚もずらさずやる
            $(".chapter-img")[0].style.marginLeft = ""; //最初の画像の位置設定を解除
            if ( aL == 1 ) {imageSorted = 0;}

            var c = imageSorted;　//画像配置のカウントを処理した画像の順番に合わせる

            for ( i=imageSorted; i<=imageLoadedNow; i++ ) { //画像の位置設定開始
                if ( c%2==0 && imageDiffs.indexOf(i) == -1 ) { //偶数番目だったら
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

            if ( aL == 1 ) {imageSorted = 1;} //もしすべてをソートし直すなら"最初から"と指定

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

        //画像の１枚ズラしの時に位置がズレるのも直す(altBeforeのやつ)
        if ( !(isNaN(aB)) ) {
            $(window).scrollTop(aB); //スクロール

        }

        if ( !modLoaded ) {
            for ( var i=0;i<$("br").length-2;i++ ) { //広告用の余分な余白を削除
                $("br")[0].remove();

            }
            //他の要素をCSS調節
                //コメント枠の部分
            $("#commentbox")[0].style.width　=　parseInt($(".chapter-img")[0].style.width) * 2 + "px";

                //チャプター選択の部分
            $(".chapter-before")[0].style.position = "fixed";
            $(".chapter-before")[0].style.bottom = "50px";
            $(".chapter-before")[0].style.left= "0px";
            $(".chapter-before")[0].style.width = $(".chapter-content")[1].offsetLeft + "px";

            $(".select-chapter")[0].style.width="250px";

           try {
            $(".next")[1].style.width = "150px";
           }
            catch(e){}

           try {
            $(".prev")[1].style.width = "150px";
           }
           catch(e){}

            modLoaded = true;

        }

        //すべての画像を最初と同じ画像の高さに指定
        for ( var i=1; i<$(".chapter-img").length; i++ ) {
            $(".chapter-img")[i].style.height = $(".chapter-img")[0].offsetHeight + "px";

        }

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

    //var imageLoadDone = false; //すべての画像がロードされたかどうか
    var imageStuckAt = 0; //画像ロードで詰まっている場所
    var imageStuckCount = 0; //画像ロードで詰まった回数
    var imageStuckTried = 0; //画像を再読み込みした回数

    function loadCheck() {
        for (var i=3; i<$(".chapter-img").length; i++ ) { //check on all image
            if ( $(".chapter-img")[i].currentSrc.indexOf("pagespeed") != -1 || $(".chapter-img")[i].height <= 50 ) {
                imageLoaded = i - 1;

                $(".loadingDiv")[0].innerText = "LOADING... \n images "+imageLoaded+"/"+$(".chapter-img").length;

                if ( imageStuckCount > 2 ) { //もし3回以上詰まったら
                    $($(".chapter-img")[i]).attr("src", $(".chapter-img")[i].src+"?timestamp=" + new Date().getTime());
                    imageStuckCount = 0;
                    imageStuckTried++; //再読み込みを試した回数

                }

                if ( imageStuckAt == i ) { //もし詰まったと確認したら
                    imageStuckCount++; //詰まった回数を更新

                } else if ( imageStuckAt < i ) { //もし詰まったのが違う画像に移ったら
                    imageStuckAt = i; //詰まった画像の場所を更新
                    imageStuckCount = 0; //詰まった回数をリセット
                    imageStuckTried = 0;

                }

                if ( imageStuckTried > 3 ) { //もし３回を超えて読み込んで無理なら
                    imageStuckCount = 0; //読み込み直した回数をリセット

                }

                return 1;

            } else if ( i == $(".chapter-img").length-1 ) {
                imageLoaded = i;
                sortImage();
                return 0;

            }

        }

        return 0; //ソートを含めロードがすべて終わったら

    }


    //すべてを始める関数(sortImageを起動)
    function trigg () {
        if ( $(".chapter-img")[2].src.indexOf("https://lovehug.net/uploads/lazy_loading.gif") != -1 || $(".chapter-img")[2].height <= 50 ) { setTimeout(trigg, 500); return;}
        if ( loadCheck() ) {
            sortImage();

            setTimeout(trigg, 750);

        } else { //iもしすべての画像のソートが終わったら
            $(".loadingDiv").remove();
            return;

        }

    }

    setTimeout(trigg, 500); //画像並べの関数処理のトリガー

})();

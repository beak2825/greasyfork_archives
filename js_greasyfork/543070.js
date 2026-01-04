// ==UserScript==
// @name         査定MOD
// @namespace 　 S2
// @license      Suruga-ya
// @version      3.0
// @author       S2
// @match        https://atoo-kaitori.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=atoo-kaitori.com
// @description  ja
// @downloadURL https://update.greasyfork.org/scripts/543070/%E6%9F%BB%E5%AE%9AMOD.user.js
// @updateURL https://update.greasyfork.org/scripts/543070/%E6%9F%BB%E5%AE%9AMOD.meta.js
// ==/UserScript==

//)-------------設定( "" 内を空白にすれば無効になります)-------------
//色コード→ https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F
var BGColor = "#FFFF00"; //重複チェック背景色
var HighlightColor = "#FF0000";　//ハイライト背景色
var FontColor = "#FFFF00";　//ハイライト文字色

//ハイライトワード(配列,部分一致) //複数のワードをカンマ(,)で区切ってください
var Words = ("アニメDVD,アニメブルーレイ,アニメBlu-ray,ブルーレイ,アダルトアニメ,アニメ雑誌,声優雑誌,テレホンカード,金券,特撮");

//ハイライトお客様氏名(文字列,完全一致) //スペース不要(例：駿河屋　太郎→駿河屋太郎)
var blacklist = "山口翔太郎,小野秀一郎,與那覇桂助,坂本康暢,吉田涼,外山智恵,伊藤功,栗原佐知,松下猛,佐藤涼太,四方田健成" +
                "山田耕児,遠藤由記,齋藤貴由紀,小島匠,小島敏子,大木則人,倉持利行,奥本修,中井晋也,山谷良悠,久戸瀬学,與那覇桂助" +
                "松岡泰宏,遠藤裕行,遠藤照巨,遠藤広樹,山谷真衣,空閑大樹,桜井知行,萩野雅俊,佐々木将人,岡部裕紀,桜井知行,安田裕樹";

//)--------------------------設定終わり------------------------------

//以下はプログラム本体、編集禁止

var $ = window.jQuery;

// === ページの読み込みが完了したら、以下の処理を実行 ===
$(function() {
    //button追加
    $('body').prepend('<div><button class="fixed" id="run">実行</button></div>');
    $('#run').css({
        'position': 'absolute',
        'top': '5px',
        'left': '230px',
        'width': '60px',
        'background-color': '#205081',
        'color': '#fff',
        'padding': '1.5px',
        'border': '1px solid #fff',
        'border-radius': '5px',
        'cursor': 'pointer'
    });

    $('body').prepend('<div><button class="fixed" id="export">査定数EX</button></div>');
    $('#export').css({
        'position': 'absolute',
        'top': '5px',
        'left': '300px',
        'width': '100px',
        'background-color': '#205081',
        'color': '#fff',
        'padding': '1.5px',
        'border': '1px solid #fff',
        'border-radius': '5px',
        'cursor': 'pointer'
    });

    // 実行メッセージのdivを追加
    $('body').append('<div id="warning-ms" style="display:none;">査定MOD有効化にしました</div>');
    $('#warning-ms').css({
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)',
        'background-color': 'rgba(0, 0, 0, 0.7)',
        'color': '#fff',
        'padding': '40px 60px',
        'border-radius': '8px',
        'font-size': '40px',
        'z-index': '1000'
    });

    // ボタンを押下の処理
    $('#run').on('click', function() {
        main();
    });
    $('#export').on('click', function() {
        SateiSu();
    });

    // 初回実行（ページの動的コンテンツの読み込みを待つため3秒遅延）
    setTimeout(main, 3000);

});

// main
function main() {
    if ($('.table-records').length != 0 && $('#satei-mod-indicator').length == 0) {
        $('.table-records').eq(1).after(' <a id="satei-mod-indicator"">TRUE</a>');
        $('#satei-mod-indicator').css({
            'display' : 'inline-block',
            'text-align' : 'center',
            'width' : '50px',
            'background-color' : '#5cb85c',
            'color' : '#fff' ,
            'padding': '5px',
            'border' : '1px solid #5cb85c',
            'border-radius': '5px',
        });
    };

    //実行メッセージを消す
    $('#warning-ms').fadeIn(500, function() {
        $(this).delay(1500).fadeOut(500); // Show for 1.5 seconds, then fade out
    });

    //業者と重複品番をハイライトする
    $('.ag-body-viewport.ag-layout-normal').scroll(function() {
        var r = document.getElementsByTagName('div');
        var i;
        var url = location.href;
        var temp = [];

        //動的nを算出
        for (i = 0; i < r.length; i++) {
            var col = r[i].getAttribute('col-id');
            if (col == "shohinBango") {
                //shohinBangoが英数字記号でない場合、飛ばす
                if (ja2Bit(r[i].innerText.replace(/\r|\n|\s/g, ""))) {
                    continue;
                }
                temp.push(i);
            };
        };
        var n = temp[1] - temp[0];

        for (i = 0; i < r.length; i++) {
            //業者名をマッチング、背景色変更
            var names = r[i].getAttribute('col-id');
            if (names == 'shimei') {
                var name = r[i].innerText.replace(/\r|\n|\s| |　/g, ""); //スペースや改行の削除を行う
                if (blacklist.indexOf(name) != -1) {
                    r[i].style.backgroundColor = BGColor
                };
            };

            //前後の品番一致したら、背景色変更
            var id = r[i].getAttribute('col-id');
            if (id == "shohinBango") {
                //shohinBangoが日本語だったら飛ばす
                if (ja2Bit(r[i].innerText.replace(/\r|\n|\s/g, ""))) {
                    continue;
                }
                var hinban1 = r[i].innerText.replace(/\r|\n|\s/g, "");
                if (r[i + n]) { // r[i+n]が存在するかチェック
                    var hinban2 = r[i + n].innerText.replace(/\r|\n|\s/g, "");
                    if (hinban1 == hinban2) {
                        r[i].style.backgroundColor = BGColor;
                        r[i + n].style.backgroundColor = BGColor;
                    };
                }
            };
        };
    });

    //スクロールで青文字をハイライトにする
    $('.ag-body-viewport.ag-layout-normal').scroll(function() {
        //複数ワードをハイライトにする
        var word = Words.split(",")
        var i;
        for (i = 0; i < word.length; i++) {
            HighlightWords((word)[i]);
        }
    });
}

//各種ショートカットキー
$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === '.' || e.keyCode === 190)) {
    e.preventDefault();
    $('button[label="次へ"]').click();
    setTimeout(ShimeiChecker, 1000);
  }
});

$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === ',' || e.keyCode === 188)) {
    e.preventDefault();
    $('button[label="前へ"]').click();
    setTimeout(ShimeiChecker, 1000);
  }
});

$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === 'n' || e.keyCode === 78)) {
    e.preventDefault();
    $('button[label="査定履歴"]').click();
    setTimeout(ShimeiChecker, 1000);
  }
});

$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === 'm' || e.keyCode === 77)) {
    e.preventDefault();
    $('button[label="戻る"]').click();
    setTimeout(main, 3000);
  }
});

//未査定のみ
$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === 'q' || e.keyCode === 81)) {
    e.preventDefault();
    $('.ui-button-text.ui-unselectable-text').first().click();
  }
});

//更新
$(document).on('keydown', function(e) {
  if (e.altKey && (e.key === 'a' || e.keyCode === 65)) {
    e.preventDefault();
    $('.fa.fa-refresh').first().click();
  }
});

//文字列判定関数：英数字記号のみの場合がfalseで返す
function ja2Bit(str) {
    return (str.match(/^[a-zA-Z0-9!-/:-@\[-`{-~]*$/)) ? false : true
}

//指定ワードハイライトにする関数
function HighlightWords(word) {
    var m;
    var n;
    var xpath = "//text()[contains(., '" + word + "')]";
    var texts = document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (m = 0; m < texts.snapshotLength; m++) {
        var textNode = texts.snapshotItem(m);
        var p = textNode.parentNode;
        // すでにハイライトされている場合はスキップ
        if (p.nodeName === 'SPAN' && p.style.backgroundColor === HighlightColor.toLowerCase()) {
            continue;
        }
        var a = [];
        var frag = document.createDocumentFragment();
        textNode.nodeValue.split(word).forEach(function(text, n) {
            var node;
            if (n) {
                node = document.createElement('span');
                node.style.backgroundColor = HighlightColor;
                node.style.color = FontColor;
                node.style.fontSize = "100%"
                node.appendChild(document.createTextNode(word));
                frag.appendChild(node);
            }
            if (text.length) {
                frag.appendChild(document.createTextNode(text));
            }
            return a;
        });
        p.replaceChild(frag, textNode);
    }
}

function SateiSu(){
    var container = $('div[role="presentation"][ref="eBodyViewport"]');
    var list = [];

    container.find('div[col-id]').each(function() {
        var $div = $(this);
        var id = $div.attr('col-id');
        var text = $div.text().replace(/\r?\n/g, ' ');

        if (id === 'shohinBango') {
            list.push(text + ',');
        } else if (id === 'sateiSu') {
            list.push(text + '\n');
        }
    });

    var newWindowDoc = window.open().document;
    newWindowDoc.writeln('<textarea rows="30" cols="30">' + list.join('') + '</textarea>');
    newWindowDoc.close();
}

function ShimeiChecker(){
    var Shimei = {};

    $('[col-id="shimei"]').each(function() {
        var text = $(this).text().trim();
        if (text && text !== '氏名') { // テキストが空でない場合のみカウント
            Shimei[text] = (Shimei[text] || 0) + 1;
        }
    });

    // 2. 再度 col-id="shimei" を持つすべての要素をチェック
    $('[col-id="shimei"]').each(function() {
        const text = $(this).text().trim();
        // 出現回数が2回以上（重複している）の場合
        if (Shimei[text] > 1) {
            $(this).css('background-color', 'yellow');
        }
    });
}
// ==UserScript==
// @license Suruga-ya
// @name 目録MOD
// @namespace S2
// @match http://192.168.0.12/mokuroku/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant GM_xmlhttpRequest
// @version 1.1.3
// @icon    https://www.google.com/s2/favicons?domain=https://www.suruga-ya.jp/
// @description ja
// @downloadURL https://update.greasyfork.org/scripts/543069/%E7%9B%AE%E9%8C%B2MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/543069/%E7%9B%AE%E9%8C%B2MOD.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    //相場業務に不要な要素を削除
    $('#resultForm > input').remove();

    //入力コードにある空白を自動削除
    var replaceword = function(){
    var text = $('#searchWord').val(); //入力した文字列をキャッチ
		var myword = text.replace(/　| /g,"");//正規表現でキーワードを置換
		$('#searchWord').val(myword); //置換後の文字列をセット
	};

	$('#searchWord').on('input',replaceword); //入力したらFunction実行する
    $('#searchWord').attr('accesskey','Q');

    var $detailLinks = $('a').filter(function() {
        return $(this).text().trim() === '詳細';
    });

    //[詳細]が一つのみ存在する場合は自動で商材ページに変遷する
    if ($detailLinks.length === 1) {
        var LinkHref = $detailLinks.attr('href');
        if (LinkHref) {
            window.location.href = LinkHref;
        }
    };

    //[詳細]を先頭に移し、見やすくにする
    $detailLinks.each(function() {
        var $thisLink = $(this);
        $thisLink.parent().prepend($thisLink);
        $thisLink.css({
            'font-size': '15px',
            'background-color': '#ff7300',
            'color': '#fff',
            'border-radius': '5px',
            'padding': '4px 15px',
            'text-decoration': 'none',
        });
    });

    $('td').filter(function() {
        // .html()で要素内のHTMLを文字列として取得し、id="f_check"が含まれるかチェック
        return $(this).html().includes('id="f_check"');
    }).css({'font-size':'14px','color':'red'});

    $('td').filter(function() {
        // .html()で要素内のHTMLを文字列として取得し、カテゴリ:が含まれるかチェック
        return $(this).html().includes('カテゴリ:');
    }).append('<p></p><hr></hr>');

    if ( $('#guide').length > 0 ){
        //画像表示
        var hinban = $('#shinaban1').text().trim();
        var gazou = "https://www.suruga-ya.jp/pics/boxart_m/"+ hinban +"m.jpg";
        $('#left').append('<img class= "gazou" src=' + gazou +' alt="画像ありません">');
        $('.gazou').css({'border': '4px solid #ff7300'});

        // GM_xmlhttpRequestを使ってBページのHTMLを取得
        var detailURL = 'https://www.suruga-ya.jp/product/detail/' + hinban;

        // GM_xmlhttpRequestを使ってBページのHTMLを取得
        GM_xmlhttpRequest({
            method: 'GET',
            url: detailURL,
            onload: function(response) {
                // レスポンスがない、または空の場合は処理を中断
                if (response.status !== 200 || !response.responseText) {
                    console.error('駿河屋のページ取得に失敗しました。Status:', response.status);
                    $('#main').append('<p>駿河屋から情報を取得できませんでした。</p>');
                    return;
                }

                var parser = new DOMParser();
                var doc = parser.parseFromString(response.responseText, 'text/html');
                var detailinfo = $('#item_detailInfo', doc)

                // コンテナを作成する
                var heading = $('<h1>')
                .text('駿河屋HP備考')
                .css({
                    'position': 'absolute',
                    'top': '140px',
                    'left': '1000px',
                    'width': '880px',
                    'z-index': '9999',
                    'color': '#333',
                    'background-color': '#eeeeee',
                    'font-size':'18px'
                });

                $('body').append(heading);

                var container = $('<div>')
                .attr('id', 'surugayainfo')
                .css({
                    //'position': 'fixed',    // 画面の特定位置に固定
                    'position': 'absolute',
                    'top': '170px',
                    'left': '1000px',
                    'width': '850px',
                    'max-height': '690px',
                    'overflow-y': 'auto',     // 縦方向にコンテンツがはみ出たらスクロールバーを出す
                    'background-color': '#fff',// 背景色を白に
                    'border': '2px solid #ccc',// 枠線
                    'padding': '15px',        // 内側の余白
                    'z-index': '9999'
                });

                // 取得したHP備考の要素をコンテナに入れる
                container.append(detailinfo);

                // コンテナをページのbodyに追加する
                $('body').append(container);
            }
        });

        //詳細ページで検索フォーム追加する
        //検索フォームのHTMLを用意する
        var searchFormHtml =
        `<div id="search" class="box">
            <form id="searchForm" name="searchForm" method="post" enctype="application/x-www-form-urlencoded" action="/mokuroku/view/mokuroku/resultList.html">
                <h3>商品マスタ検索</h3>
                <input type="text" id="searchWord" name="searchForm:searchWord" value="" accesskey="Q" />
                <input type="submit" id="doSearchItem" name="searchForm:doSearchItem" value="検索" /><br clear="none" />
                <input type="hidden" name="searchForm/view/mokuroku/resultList.html" value="searchForm" />
            </form>
        </div>`;
                //<a shape="rect" href="easySearch.html">簡単検索</a>
                //<a shape="rect" href="detailSearch.html">詳細検索</a>

        //leftの先頭に作成した検索フォームを追加する
        var left = $('#left');
        left.prepend(searchFormHtml);
    }

    //UIを見やすくに変更
    $('#main').css('width','990px');
    $('#right').css('width','780px');
    $('#left').css('width','200px');
    $('#searchWord').css('width','190px');
    $('.box').css('width','200px');
    $('.kisu').css('width','600px');
    $('#detail').children().css('width', '700px');
    $('#searchZinmei').attr('size','18');
    $('#listForm').remove();

})();
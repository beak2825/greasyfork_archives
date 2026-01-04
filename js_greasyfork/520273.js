// ==UserScript==
// @license Suruga-ya
// @name 駿河屋検索改造
// @namespace S2
// @match *.suruga-ya.jp/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version 3.1.3
// @icon    https://www.google.com/s2/favicons?domain=https://www.suruga-ya.jp/
// @description ja
// @downloadURL https://update.greasyfork.org/scripts/520273/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E6%A4%9C%E7%B4%A2%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/520273/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E6%A4%9C%E7%B4%A2%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==

//設定-------------------------------------------------------------------
var safe_searchOFF = 1; //セーフサーチ(1:OFF／0:手動設定)
var z_hyoji= 1; //在庫切れ(1:表示／0:非表示)
var viewableIC = 1; // インストアコード(1:表示／0:非表示)
var icColor = '#B40404'; //表示したインストアコードの色(''で黒字に戻る)
var formatIC = 1; // インストアコードを整えてみる(1:実行／0:非実行)
var copyButton = 1; // インストアコピーボタン(1:表示／0:非表示)
var largeImageLink = 1; // 拡大画像のリンク(1:表示／0:非表示)
var HyperLink = 1; // 追加ハイパーリンク(1:表示／0:非表示)
var category = 0; // 買取検索リンクのカテゴリー(0:指定なし)
var ponly = 0; // 買取検索リンク画像のみ(1:on／0:off)
var rankBy = ""; // 買取検索リンクソート
var fixedpager = 1; // pager追従(1:on／0:off)
var fixedserchbox = 1; // 検索窓追従(1:on／0:off)
var largesearchbox = 1; //検索窓拡張(1:on／0:off)
var simplepage = 1; //業務に不要な要素(ログインボタン/SNSアイコンなど)を削除する(1:on／0:off)
var keywordreplace = 1; //キーワード置換(1:on／0:off)
var directTOothers = 1;　//他サイトへダイレクト(1:on／0:off)
var linkToAmazonUS = 1;
var linkToAucMer = 1;
var linkToDmmArzon = 1;
var rechangewidth = 1400;//画像のみ時の可視領域幅

//削除したいキーワード"/g"の前に追加、複数キーワードは"|"で区切り
//責|猥|褻|痴|姦|淫|犯|隷|教|虐|畜|辱|拷|レイプ|
var pattern = /数量限定|アウトレット|ｱｳﾄﾚｯﾄ|通常版|通常盤|スタンダード版|ｽﾀﾝﾀﾞｰﾄﾞ版|単品|単巻|不備有|付録無|付録欠|ランクB|ﾗﾝｸB|アダルト|\(AA\)|（AA）|#|＃|ﾚ\)|レ）|レ\)|ﾚ）|▽|●|○|★|☆|◆|■|□|（|）|「|」|｢|｣|【|】|~|～|\&|\＆|\-|\+|\=|\/|\*|\(|\)|\[|\]|\*|\_/g

//設定終わり-------------------------------------------------------------
var $ = window.jQuery;

//セーフサーチ自動OFF
if (safe_searchOFF){
    document.cookie = "safe_search_option=3";
    document.cookie = "safe_search_expired=1";
};

//在庫切れ表示
if (z_hyoji){
    document.cookie = "z_hyoji=1";
};

//検索ワード自動削除
if (keywordreplace){
	var replaceword = function(){
    var text = $('#searchText,#txt-search').val(); //入力した文字列をキャッチ
		var myword = text.replace(pattern,' '); //正規表現でキーワードを置換
        //myword = myword.trim(); //前後のスペースを除外
		$('#searchText,#txt-search').val(myword); //置換後の文字列をセット
	};

	$('#searchText,#txt-search').on('input',replaceword); //入力したらFunction実行する
};

//検索MOD
$(function() {

    var nav = $('.fixed');
    var pager = $('.fixedb');
    var navTop = nav.offset().top;

    if (pager.length) {
        var pagerBottom = pager.offset().top;
    }

    //ウインドウスクロール時の追従処理
    $(window).scroll(function () {
        var winTop = $(this).scrollTop();
        var winHeight = $(this).height();
        var winBottom = winTop + winHeight;
        if (winTop >= navTop) {
            nav.css({'position': 'fixed',
                     'top': '0',
                     'margin':'0 auto',
                     'z-index':'9',
                     'background-color':'#C0C0C0'});
        }
        else if (winTop <= navTop) {
            nav.css({'position': '',
                     'top':'',
                     'z-index':'',
                     'left':'',
                     'background-color':''});
        }

        if (pager.length) {
            if (winBottom <= pagerBottom) {
                pager.css({'position': 'fixed',
                           'left':'40%',
                           'top': winHeight - pager.height()});
            }
            else if (winBottom >= pagerBottom) {
                pager.css({'position': '',
                           'left': '',
                           'top': ''});
            }
        }
    });

    if( largesearchbox ) {

        //買取ページICListボタン処理
        $('#listcopy').on('click', function() {
            $('#inslist').remove();
            var list = [];
            var a = $('.iccopy');

          	a.each(function() {
       				var id = $(this).attr('name');
              list.push(id);
            })

            $('<textarea rows="3" cols="20" id="inslist"></textarea>').insertAfter('.word01');
  			$('#inslist').css({'display':'block',
                               'margin':'0 0 0 auto'});
            $('#inslist').text(list.join("\n"));
        });

        //販売ページICListボタン処理
        $('#listcopyc').on('click', function() {
            $('#inslist').remove();
            var list = [];
            var a = $('.iccopy');

          	a.each(function() {
       				var id = $(this).attr('name');
              list.push(id);
            })

            $('<textarea rows="3" cols="20" id="inslist"></textarea>').insertAfter('.topicPath_h1');
   			$('#inslist').css({'display':'block',
                               'margin':'0 0 0 auto'});
            $('#inslist').text(list.join("\n"));
        });


        //買取ページクリアボタン処理
        $('#clearform').on('click', function() {
            $('#searchText').val('');
            $('#searchText').focus();
        });
      	//販売ページクリアボタン処理
        $('#cleartext').on('click', function() {
            $('#txt-search').val('');
            $('#txt-search').focus();
        });
    }

    //インストアコピーボタンが押されたらコピー関数にnameを投げる
    //検索フォームをアクテイブの状態にする
    $('.iccopy').on('click', function(){
        iccopyButtonClick($(this).attr('name'));
        $('#searchText,#txt-search').select();
    });

    //詳細データを遷移せずに表示
    //詳細ページのarticle1、detailを埋め込む
    $('.viewdetail').on('click', function(){
        var detailurl = 'https://www.suruga-ya.jp/kaitori_detail/' + $(this).attr('name');
        $.ajax({
            url: detailurl,
            cache: false,
            success: function(html){
                $(html).find('#article1').each(function() {
                    $('#article1').html($(this).html());
                    return false;
                });
                $(html).find('#detail').each(function() {
                    $('#detail').html($(this).html());
                    return false;
                });
            }
        });
        showDetail();
    });

    //拡大画像を遷移せずに表示
    $('.viewimage').on('click', function(){
        var imageurl = 'https://www.suruga-ya.jp/database/pics/game/' + $(this).attr('name').toLowerCase() + '.jpg';
        $('#article1').css('height', '550px');
      	$('#article1').css('text-align', 'center');
        $('#detail').css('height', '0px');
        $('#article1').html('<img src="' + imageurl + '">');
        $('#detail').html('');
        showDetail();
    });

    //商品詳細BOXの[ close ]付近をクリックでデータ表示スペースを非表示
    $('#closebox').on('click', function(){
        $('#detailbase').hide();
    });
});

//あんしん買取検索リザルト画面に詳細データ表示スペースの用意
$('<div id="detailbase" style="display:none;"><div id="closebox">[CLOSE]</div><div id="article1"></div><div id="detail"></div></div>').prependTo('#main2');
$('#detailbase').css({'width': '1000px',
                      'height': '700px',
                      'border': 'solid 1px #CCC',
                      'background-color': '#FAFAFA',
                      'z-index': '9',
                      'inset': '0',
                      'margin': 'auto'});

$('#article1').css({'width': '1000px',
                    'height': '300px',
                    'overflow': 'auto'});

$('#detail').css({'width': '1000px',
                  'height': '360px',
                  'overflow': 'auto'});

$('#closebox').css({'text-align': 'right',
                    'font-size': '150%'});
$('.gazou').attr('style', 'height: 300px');

//検索窓追従
if(fixedserchbox) {
    $('#keyword').addClass('fixed');
  	$("[class='form-inline search-form-top']").addClass('fixed');
}

//pager追従
if(fixedpager) {
    $('#pager').addClass('fixedb');
    $('#ansin > div.page').eq(1).addClass('fixedb');
}

//検索窓周りの拡張
if(largesearchbox){

    //買取ページカスタマイズ
    $('#searchText').css({'width':'220px',
                          'max-width':'220px'});
  	$('#txt-search').css({'width':'245px',
                         'max-width':'245px'});

    $('#searchText,#txt-search').attr('accesskey','Q');
    $('div.gazo > ul > li:nth-child(2) > a').attr('accesskey', 'A');
    $('<a> </a><button id="clearform" type="button" style="width:70px">クリア</button>').insertAfter('#btn');
    if (URLcheck("detail")){
        $('<a> </a><button id="clearform" type="button" style="width:70px">クリア</button>').insertAfter('#btn_txt');
    };
    $('<button id="listcopy" class="btnIC" style="width:70px">IClist</button>').appendTo('.word01');
    $('#search_category').css('width','100px');

  	//販売ページカスタマイズ
    $('.header_right').css({'width':'120px',
                             'max-width':'120px',
                             'margin':'0 0 0 auto'});

    $('.search_box_wraper').css({'width':'360px',
                                 'max-width':'360px'});
    $("[class='form-inline search-form-top fixed']").css({'width':'590px',
                                                         'max-width':'590px'});
    $('.select-wrapper').css('flex','0 0 120px');

    $('<button id="cleartext" class="fixedc" type="button" style="width:70px">クリア</button>').insertAfter('.search_top_btn_wraper').first();
    $('<button id="listcopyc" class="btnIC" style="width:70px">IClist</button>').appendTo('.topicPath_h1');
  	$('.btnIC').css({'display':'block',
                     'margin':'0 0 0 auto'});
    $('#cleartext').css({'background':'#2D3081',
                         'color':'#FFFFFF',
                         'height':'32',
                         'width':'70',
                         'margin':'auto'});
}

//買取ページ
var i;
if(viewableIC) {
    var allForms = $('.kato');
    var allGazou = $('.syosai');
    var inputNode = 0;
    if(allGazou.length == 0) {
        allGazou = $('.gazou4');
        inputNode = 1;
    }
    for(i = 0; i < allForms.length; i++) {
        var hinban = allForms[i].getElementsByTagName('input')["shinaban"].value;

        $('<button class="iccopy" name="' + hinban + '" accesskey="' + (i + 1) + '">copy　</button>').appendTo(allGazou[i]);
        if(copyButton) {
            $('<p style="font-size:100%; margin-bottom:0" class="ic">[<span id="' + hinban + '" class="instore" name="' + hinban + '">' + hinban + '</span>]</p>').appendTo(allGazou[i]);
        }
        if(largeImageLink) {
            $('<p style="font-size:100%; margin-bottom:0" class="ic"><span class="viewimage" name="' + hinban + '">[拡大画像]</span></p>').appendTo(allGazou[i]);
            $('<p style="font-size:100%; margin-bottom:0" class="ic"><span class="viewdetail" name="' + hinban + '">[詳細確認]</span></p>').appendTo(allGazou[i]);
        }
        if(URLcheck('p_only') == true) {
             $('<p style="font-size:80%; margin-bottom:0" class="category"><span class="viewcategory" name="' + hinban + '">' + GetCategory(hinban) +'</span></p>').prependTo(allGazou[i]);
             $('.category').css('color','#0000FF');
             $('.category').css('background','#E8E8E8');
        }
    }

    //画像のみONの場合表示領域拡大など
    if( URLcheck('p_only') == true ){
        $('#container_ansin').css('margin-left','10px');
        $('body').css('width',rechangewidth+'px');
        $('#ansin').css('width',rechangewidth+'px');
        $('.word01').css('width',rechangewidth-50+'px');
        $('.word02').css('width',rechangewidth-50+'px');
        $('.button01').css('width',rechangewidth-50+'px');
        $("#utility").remove();
    };

    $('.ic').css('color', icColor);

    //業務に不要な要素を削除する
    if (simplepage){
        $("#utility").remove();
        $('#blockLogin').remove();
        $('.affiliate_button').remove();
        $('.d-flex.align-items-center.justify-content-end').remove();

        if(inputNode == 0) {//TOP買取ページ
            $('[id=sellcart]').remove();
            $('.syosai a').remove();
            $('.sp_delete').remove();
            $('.btn-gray.mgnR0.barcode_search_pc').remove();
        }
        else {//検索結果ページ
            $('[id=sellcart2]').remove();
            $('.gc').remove();
            $('.gs').remove();
            $('.sp_delete').remove();
            $('.list-icon-share').css('display','none');
            $('.btn-gray.mgnR0.barcode_search_pc').remove();
            $('#icon_list').remove();
        }
    }
}

//販売ページに追加情報表示
if ( URLcheck('search_buy') == false ) {
    var allTitles = $('.title');
    for(i = 0; i < allTitles.length; i++) {
        var href = allTitles[i].getElementsByTagName('a')[0].href;

        if(href.match(/product/)) {
            var tmp = href.split(/[/?]/);
            var tmplength = tmp.length;
            var instoreCode;

            if(href.match(/\d{9}/) && formatIC) {
                //instoreCode = tmp[tmplength-1].substr(0,9);
                instoreCode=href.match(/\d{9}/)[0]
            }
            else if(href.match(/n$/) && formatIC) {
                instoreCode = tmp[tmplength-1].substr(0,tmp[tmplength-1].length-1);
            }
            else if(href.match(/tenpo_cd/)||href.match(/branch_number/)) {
                instoreCode = tmp[tmplength-2];
            }
            else {
                instoreCode = tmp[tmplength-1];
            }

            //拡大画像リンク
            if(largeImageLink) {
                $('<p style="font-size:100%; margin-bottom:0" class="ic"><span class="viewimage" name="' + instoreCode + '">[拡大画像]</p>').insertAfter(allTitles[i]);
            }

            //インストアコード＆コピーボタン表示&詳細確認
            if(viewableIC) {
                $('<p style="font-size:100%; margin-bottom:0" class="ic">[<span id="' + instoreCode + '" class="viewdetail" name="' + instoreCode + '">詳細確認</span>]</p>').insertAfter(allTitles[i]);
                $('<p style="font-size:120%; margin-bottom:0" class="ic">[<span id="' + instoreCode + '" class="instore" name="' + instoreCode + '">' + instoreCode + '</span>]</p>').insertAfter(allTitles[i]);
                if(copyButton) {
                    $('<button class="iccopy" name="' + instoreCode + '" accesskey="' + (i + 1) + '">copy　</button>').insertAfter(allTitles[i]);
                }
            }
        }
    }

    $('.ic').css('color', icColor);
};

//他サイトダイレクト（買取ページ）
if(directTOothers == true & URLcheck('kaitori') == true){
    //hrefのリンク先
    var amazonlink= "https://www.amazon.co.jp/s?k="
    var dmmlink = "https://www.dmm.co.jp/mono/-/search/=/searchstr="
    var arzonlink = "https://www.arzon.jp/itemlist.html?t=&m=all&s=&q="
    var aucfreelink = "https://aucfree.com/search?o=t2&q="
    var mercarilink = "https://jp.mercari.com/search?keyword="
    //hrefのcss設定
    var css= " style=font-size:12pt;color:#006AD6;background-color:#CDEDDB;font-weight:600"

    //検索テキストを取得
    var myword = $('#searchText').val();
    //テキストを省略表示
    var sliceword = myword.length > 20 ? (myword).slice(0,20)+"…" : myword;

    if(myword){
        var EncodedWord = encodeURI(myword);
        if (linkToAmazonUS) {
            $("<br><a class='link' target='_blank' href="+ amazonlink + EncodedWord + css + ">" + sliceword + "をAmazon.jpで検索</a>").appendTo('.TabbedPanels');
        }
        if (linkToAucMer) {
            $("<br><a class='link' target='_blank' href="+ aucfreelink + EncodedWord + css + ">" + sliceword + "をAucFreeで検索</a><br><a target='_blank' href=" + mercarilink + EncodedWord + css + ">" + sliceword + "をメルカリで検索</a>").appendTo('.TabbedPanels');
        }
        if (linkToDmmArzon) {
            $("<br><a class='link' target='_blank' href="+ dmmlink + EncodedWord + css + ">" + sliceword + "をFANZAで検索</a><br><a target='_blank' href=" + arzonlink + EncodedWord + css + ">" + sliceword + "をArzonで検索</a>").appendTo('.TabbedPanels');
        }
    }
}

//ハイパーリンク
if(HyperLink == true & URLcheck('kaitori') == true ) {
    var Table = $('#configurations');
    var allTd = Table.find('td');
    var AllTitles = $('.title');

    //検索結果ページにハイパーリンクを追加
    for (i = 1; i < AllTitles.length; i++) {
        //タイトルで検索
        var TitlesStr = AllTitles[i].innerText.replace(pattern," ")
        $(AllTitles[i]).append("<br><a href='https://www.suruga-ya.jp/kaitori/search_buy?category=&search_word=" + TitlesStr + "&searchbox=1'> [買取ページで検索]</a>");
        $(AllTitles[i]).append("<br><a target='_blank' href='https://www.suruga-ya.jp/search?category=&search_word=" + TitlesStr + "&searchbox=1'> [販売ページで検索]</a>");
    };

    //商品詳細ページのハイパーリンクを追加
    if ( Table.length > 0 ){
        //タイトルで検索
        var Title = $('.title_h2').eq(0);
        var TitleStr = Title.text().replace(pattern," ");
        $(Title).after("<br><a href='https://www.suruga-ya.jp/kaitori/search_buy?category=&search_word=" + TitleStr + "&searchbox=1' style=font-size:10pt> [買取ページで検索]</a>");
        $(Title).after("<br><a target='_blank' href='https://www.suruga-ya.jp/search?category=&search_word=" + TitleStr + "&searchbox=1' style=font-size:10pt> [販売ページで検索]</a>");
        //JANコードで検索
        var janCodeCell = $('#configurations td:contains("JAN")').next('td');
        var janCode = janCodeCell.text().trim();
        janCodeCell.html("<a href='https://www.suruga-ya.jp/kaitori/search_buy?category=&search_word=" + janCode + "&searchbox=1'>" + janCode +"</a>");
    }
}


//インストアコピーボタン処理
function iccopyButtonClick(targetname) {
    var targetnode = document.getElementById(targetname);
    var range = document.createRange();
    range.selectNode(targetnode);
    var selection = window.getSelection();
    selection.collapse(document.body, 0);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    return 0;
}

//あんしん買い取り検索上の商品詳細データ表示領域の可視化
function showDetail() {
    $('#detailbase').css({'display': '',
                          'position': 'fixed'});
    $('#detailbase').show();
    return 0;
}

//URLキーワードチェッカー ある:true なし:false
function URLcheck(keyword){
    if (location.href.indexOf(keyword) < 0 ){
        return false;
    }else{
        return true;
    };
};

//検索固定ワード（検索ワード直接追加するとENTERキー検索は反応しないため、パラメータに追加するのオススメ）
$('#txt-search').before('<input type="search" id="subtxt" size="3" style="background-color:#FFFFCC;color:#0000FF;font-weight: bold">')
$('#searchText').before('<input type="search" id="subtxt" size="3" style="background-color:#FFFFCC;color:#0000FF;font-weight: bold"> ')

// 固定ワードテキストボックスへの入力を検知してローカルストレージに保存
$('#subtxt').on('input', function() {
    localStorage.setItem("subtxt", $(this).val());
});

// ローカルストレージに保存された値があれば、固定ワードのテキストボックスに設定
var savedSubtxt = localStorage.getItem("subtxt");
if (savedSubtxt) {
    $('#subtxt').val(savedSubtxt);
}

// 固定ワードが存在する場合、固定ワードを検索ワードに追加する（パラメータを使用）
$('#btn,#btn_txt,#btn-search').on('click', function(e) {
    var url = new URL(window.location.href);
    var subtxtValue = $('#subtxt').val();
    var mainSearchValue = $('#txt-search, #searchText').val();

    if ( subtxtValue && (url.searchParams.has('search_word')) ){
        e.preventDefault(); // デフォルトのフォーム送信をキャンセル
        // 固定ワードを検索ワードに追加してURLのパラメーターを更新
        url.searchParams.set('search_word', mainSearchValue + " " + subtxtValue);
        url.searchParams.delete('page');

        // 更新されたURLに遷移
        window.location.href = url.toString();

    // 一部パラメーター存在しないページでは検索URLを作る
    } else if ( subtxtValue &&　URLcheck("kaitori") ){
        e.preventDefault();
        window.location.href =　"https://www.suruga-ya.jp/kaitori/search_buy?category=&search_word=" + mainSearchValue + " " + subtxtValue + "&searchbox=1"
    } else if ( subtxtValue &&　URLcheck("www.suruga-ya.jp") ){
        e.preventDefault();
        window.location.href =　"https://www.suruga-ya.jp/search?category=&search_word=" + mainSearchValue + " " + subtxtValue + "&searchbox=1"
    } else {
        //subtxt空白の場合はデフォルトで送信する
        this.submit();
    }
});

//画面遷移したときに強制的にリロードする
//window.onpageshow = function(event) {
//	if (event.persisted) {
//		 window.location.reload();
//	}
//};

//品番からカテゴリ判定
function GetCategory(hinban){
//画像のみカテゴリー判定
    var 映像ソフト ="122,965,966,967,968,969,970,971,972,973,974,975,976,977,528,529,530,531,532,533,534,535,536,537,538,539,551,552,553,554,555,556,557,146,404,405,928,929,931,932,933,934,935,936,937,938,939,951,952,953,955,956,957,958,959,960,961,962,963,964"
    var 映像ソフトBRD ="402,403,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,451,452,453,454,455,456,457,828,829,830,831,832,833,834,835,836,837,838,839,851,"
    var 映像ソフトDVD ="128,129,130,131,132,133,134,135,136,137,138,139,151,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,351,352,353,354,355,356,357,400,401,406,407,408,409,410,411,412,413,414,415,450,540,541,542,543,544,728,729,730,731,732,733,734,735,736,737,738,739,751,752,753,754,755,756,757,"
    var 音楽ソフトCD ="120,121,211,212,213,214,215,216,217,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,250,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,340,341,416,417,418,419,420,421"
    var 音楽ソフトテープ ="251"
    var 音楽ソフトLPEP ="252,253,254"
    var テレホンカード="978,979,980"
    var 金券="981"
    var 同人ソフト ="186,187"
    var PC ="127,150,123,323,153,154,126,155,125,145,152,124,170"
    var カレンダー ="605,"
    var キャンプ用品 ="893,894,895,896,897,898,899"
    var ゲーム3DO ="168,268,818"
    var ゲームNEOGEO ="163,263,813"
    var ゲームNINTENDO64 ="147,247,847"
    var ゲームPCエンジンCD ="812,162,262"
    var ゲームPCエンジンHuカード ="161,261,811"
    var ゲームPSP ="177,277,827,927,"
    var ゲームPSVITA ="105,205,805,905,"
    var ゲームWii ="102,202,802"
    var ゲームWiiU ="106,206,806,906,"
    var ゲームXboxOne ="108,808,908"
    var ゲームXbox ="158,258,858"
    var ゲームXbox360 ="101,201,801,901,"
    var ゲームアーケードゲーム基板 ="180,"
    var ゲームインストラクションカード ="181,"
    var ゲームゲームギア ="166,266,816"
    var ゲームゲームキューブ ="157,257,857"
    var ゲームゲームボーイ ="165,265,815"
    var ゲームゲームボーイアドバンス ="175,275,825"
    var ゲームゲーム用プリペイド ="849,"
    var ゲームスーパーファミコン ="167,267,817"
    var ゲームセガサターン ="141,241,841"
    var ゲームその他ハード ="100,800"
    var ゲームドリームキャスト ="142,242,842"
    var ゲームニンテンドー3DS ="104,204,804,904,"
    var ゲームニンテンドーDS ="176,276,826,926,"
    var ゲームニンテンドースイッチ ="109,"
    var ゲームバーチャルボーイ ="171,271,821"
    var ゲームファミコン ="160,174,810"
    var ゲームプレイステーション ="140,240,840"
    var ゲームプレイステーション2 ="144,244,844"
    var ゲームプレイステーション3 ="103,203,803,903,"
    var ゲームプレイステーション4 ="107,807,907"
    var ゲームプレイステーション5 ="110,"
    var ゲームメガドライブ ="164,264,814"
    var ゲームワンダースワン ="143,243,843"
    var ゲームその他 ="148,248,848"
    var 食玩 ="660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679"
    var 食品 ="580,581,612,614,615,616,619,654,655,656,659,690,691,692,693,694,695,696,697,698"
    var 同人雑貨 ="982,983,984,985,986,987,988,989,"
    var ドールドールアクセサリー ="990,991,996,997,"
    var パズル ="649,"
    var ハッピーセット ="699,"
    var フィギュアぬいぐるみ ="602,646"
    var プラモデルミニカーNゲージ ="600,603,610,613,770,780"
    var ペットボトルキャップ ="648,658"
    var ミニチュアゲーム ="644,"
    var ラジコン ="771,"
    var 衣類 ="609,"
    var トレーディングフィギュア ="601,611"
    var 雑貨 ="382,482,508,560,561,582,583,584,608,618,882,995,368,468,868,385,485,885,370,470,358,458,892,993,359,459,859,371,471,871,376,476,876,361,461,861,389,489,889,391,491,891,390,490,890,377,477,877,375,475,875,360,460,860,870,379,479,879,374,474,874,763,764,765,378,478,878,380,480,880,369,469,869,366,466,866,383,483,883,387,487,887,367,467,867,381,481,881,992,384,484,884,388,488,888,386,486,886,994,507,766,767,768"
    var 雑貨ZIPPOライター ="760,761,762"
    var 雑貨クッション抱き枕本体 ="363,463,863"
    var 雑貨クッションカバーピローケース ="365,465,865"
    var 雑貨タオル手ぬぐい ="362,462,862"
    var 雑貨タペストリー ="373,473,873"
    var 雑貨抱き枕カバーシーツ ="364,464,864"
    var 書籍コミック ="500,501,502,503,504,510,511,512,513,514,520,521,522,523,524"
    var 塗料工具 ="606,645"
    var アダルトグッズ ="301,"
    var おもちゃ ="607,617,"
    var 家電 ="701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,"
    var トレカ生写真 ="589,590,591,592,593,594,595,596,597,598,599,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,647,650,651,652,653,657,680,681,682,683,684,685,686,687,688,689"
    var トレカサプライ ="604"
    var 書籍1 ="179,184,185,188,"
    var 書籍2 ="2K,2L,2M,2N,2W,2X,2Y,3W,3X,3Z,4W,4X,4Y,5A,5B,5C,5D,5F,5G,5H,5I,5J,5K,5Z,8A,8B,8C,8D,8E,8F,8G,8H,8I,8J,8K,8L,8M,8N,8O,8P,8Q,8R,8S,8T,8U,8V,8W,8X,8Y,8Z,9A,9B,9C,9D,9F,9G,9H,9I,9J,9K,9L,9S,9T,9U,9V,9W,9X,9Y,9Z,BN,BO,BQ,BS,CA,DA,DB,DC,DD,DE,DF,DG,DH,DI,DJ,DK,DL,DM,DO,HA,HB,HC,HD,HE,HF,HG,HI,HK,IP,JA,JB,JY,KA,LI,QS,QY,RA,RB,RC,RD,RE,RF,RG,RH,RI,RJ,RK,RL,RM,RN,RP,RQ,RR,RS,RT,RU,RV,RW,RX,RY,RZ,SY,CM,OA,OB,OC,OD,OE,OF,OG,OH,OI,OJ,OK,OL,OM,ON,OR,OS,OT,OU,OV,OW,OX,OY,OZ,SJ,SK,SL,SN,ST,SW,WA,WB,WC,WD,WG,WH,WI,WJ,WK,WL,WM,WN,WO,WR,WT,WU,WW,WX,WY,XA,XB,XC,XD,XE,XF,XG,XH,XI,XJ,XK,XL,XM,XN,XO,XP,XQ,XR,XS,XT,XU,XV,XW,XX,XY,XZ"
    var 雑誌 ="ZA,ZH,ZI,ZK,ZM,ZN,ZR,ZS,ZT,ZU,ZW,ZY,"

    //特殊パターンの処理
    var G = /^G\w{7}/;
    var ZHO =/^ZHO/;
    var Instore = /^\d{9}$/;

    if ( hinban.match(G) ) {
        return "トレカ/生写真"
        }
    if ( hinban.match(ZHO) ) {
        return "同人誌"
        }
    if ( hinban.match(/^(5|6)089/)){
        return "雑貨【ポスター】"
    }
    if (hinban.match(/^607[5-8]/)){
        return "ボードゲーム"
    }
    //9桁数字の場合
    if ( hinban.match(Instore) ) {
        //頭3桁切り取り、数字に変換
        var x = hinban.slice(0,3);
        switch (true) {
            case 映像ソフト.indexOf(x) >= 0 :
                return "映像ソフト"
                break
            case 映像ソフトDVD.indexOf(x) >= 0 :
                return "映像ソフト【DVD】"
                break
            case 映像ソフトBRD.indexOf(x) >= 0 :
                return "映像ソフト【BRD】"
                break
            case 音楽ソフトCD.indexOf(x) >= 0 :
                return "音楽ソフト【CD】"
                break
            case 音楽ソフトLPEP.indexOf(x) >= 0 :
                return "音楽ソフト【LP・EP】"
                break
            case 音楽ソフトテープ.indexOf(x) >= 0 :
                return "音楽ソフト【ﾐｭｰｼﾞｯｸﾃｰﾌﾟ】"
                break
            case テレホンカード.indexOf(x) >= 0 :
                return "テレホンカード"
                break
            case 金券.indexOf(x) >= 0 :
                return "金券"
                break
            case PC.indexOf(x) >= 0 :
                return "PC"
                break
            case アダルトグッズ.indexOf(x) >= 0 :
                return "アダルトグッズ"
                break
            case おもちゃ.indexOf(x) >= 0 :
                return "おもちゃ"
                break
            case 家電.indexOf(x) >= 0 :
                return "家電"
                break
            case カレンダー.indexOf(x) >= 0 :
                return "カレンダー"
                break
            case キャンプ用品.indexOf(x) >= 0 :
                return "キャンプ用品"
                break
            case 食玩.indexOf(x) >= 0 :
                return "食玩"
                break
            case 食品.indexOf(x) >= 0 :
                return "食品"
                break
            case 書籍1.indexOf(x) >= 0 :
                return "書籍"
                break
            case 同人雑貨.indexOf(x) >= 0 :
                return "同人雑貨"
                break
            case 同人ソフト.indexOf(x) >= 0 :
                return "同人ソフト"
                break
            case ドールドールアクセサリー.indexOf(x) >= 0 :
                return "ドール/ドールアクセサリー"
                break
            case トレカ生写真.indexOf(x) >= 0 :
                return "トレカ/生写真"
                break
            case トレカサプライ.indexOf(x) >= 0 :
                return "トレカサプライ"
                break
            case パズル.indexOf(x) >= 0 :
                return "パズル"
                break
            case ハッピーセット.indexOf(x) >= 0 :
                return "ハッピーセット"
                break
            case フィギュアぬいぐるみ.indexOf(x) >= 0 :
                return "フィギュア/ぬいぐるみ"
                break
            case プラモデルミニカーNゲージ.indexOf(x) >= 0 :
                return "プラモデル/ミニカー/Nゲージ"
                break
            case ペットボトルキャップ.indexOf(x) >= 0 :
                return "ペットボトルキャップ"
                break
            case ミニチュアゲーム.indexOf(x) >= 0 :
                return "ミニチュアゲーム"
                break
            case ラジコン.indexOf(x) >= 0 :
                return "ラジコン"
                break
            case 衣類.indexOf(x) >= 0 :
                return "衣類"
                break
            case トレーディングフィギュア.indexOf(x) >= 0 :
                return "トレーディングフィギュア"
                break
            case 雑貨.indexOf(x) >= 0 :
                return "雑貨"
                break
            case 雑貨ZIPPOライター.indexOf(x) >= 0 :
                return "雑貨【ZIPPO・ライター】"
                break
            case 雑貨クッション抱き枕本体.indexOf(x) >= 0 :
                return "雑貨【クッション・抱き枕・本体】"
                break
            case 雑貨クッションカバーピローケース.indexOf(x) >= 0 :
                return "雑貨【クッションカバー・ピローケース】"
                break
            case 雑貨タオル手ぬぐい.indexOf(x) >= 0 :
                return "雑貨【タオル・手ぬぐい】"
                break
            case 雑貨タペストリー.indexOf(x) >= 0 :
                return "雑貨【タペストリー】"
                break
            case 雑貨抱き枕カバーシーツ.indexOf(x) >= 0 :
                return "雑貨【抱き枕カバー・シーツ】"
                break
            case 書籍コミック.indexOf(x) >= 0 :
                return "書籍【コミック】"
                break
            case 塗料工具.indexOf(x) >= 0 :
                return "塗料工具"
                break

            case ゲーム3DO.indexOf(x) >= 0 :
                return "ゲーム【3DO】"
                break
            case ゲームNEOGEO.indexOf(x) >= 0 :
                return "ゲーム【NEOGEO】"
                break
            case ゲームNINTENDO64.indexOf(x) >= 0 :
                return "ゲーム【NINTENDO64】"
                break
            case ゲームPCエンジンCD.indexOf(x) >= 0 :
                return "ゲーム【PCエンジンCD】"
                break
            case ゲームPCエンジンHuカード.indexOf(x) >= 0 :
                return "ゲーム【PCエンジンHuカード】"
                break
            case ゲームPSP.indexOf(x) >= 0 :
                return "ゲーム【PSP】"
                break
            case ゲームPSVITA.indexOf(x) >= 0 :
                return "ゲーム【PSVITA】"
                break
            case ゲームWii.indexOf(x) >= 0 :
                return "ゲーム【Wii】"
                break
            case ゲームWiiU.indexOf(x) >= 0 :
                return "ゲーム【WiiU】"
                break
            case ゲームXboxOne.indexOf(x) >= 0 :
                return "ゲーム【Xbox One】"
                break
            case ゲームXbox.indexOf(x) >= 0 :
                return "ゲーム【Xbox】"
                break
            case ゲームXbox360.indexOf(x) >= 0 :
                return "ゲーム【Xbox360】"
                break
            case ゲームアーケードゲーム基板.indexOf(x) >= 0 :
                return "ゲーム【アーケードゲーム基板】"
                break
            case ゲームインストラクションカード.indexOf(x) >= 0 :
                return "ゲーム【インストラクションカード】"
                break
            case ゲームゲームギア.indexOf(x) >= 0 :
                return "ゲーム【ゲームギア】"
                break
            case ゲームゲームキューブ.indexOf(x) >= 0 :
                return "ゲーム【ゲームキューブ】"
                break
            case ゲームゲームボーイ.indexOf(x) >= 0 :
                return "ゲーム【ゲームボーイ】"
                break
            case ゲームゲームボーイアドバンス.indexOf(x) >= 0 :
                return "ゲーム【ゲームボーイアドバンス】"
                break
            case ゲームゲーム用プリペイド.indexOf(x) >= 0 :
                return "ゲーム【ゲーム用プリペイド】"
                break
            case ゲームスーパーファミコン.indexOf(x) >= 0 :
                return "ゲーム【スーパーファミコン】"
                break
            case ゲームセガサターン.indexOf(x) >= 0 :
                return "ゲーム【セガサターン】"
                break
            case ゲームその他ハード.indexOf(x) >= 0 :
                return "ゲーム【その他ハード】"
                break
            case ゲームドリームキャスト.indexOf(x) >= 0 :
                return "ゲーム【ドリームキャスト】"
                break
            case ゲームニンテンドー3DS.indexOf(x) >= 0 :
                return "ゲーム【ニンテンドー3DS】"
                break
            case ゲームニンテンドーDS.indexOf(x) >= 0 :
                return "ゲーム【ニンテンドーDS】"
                break
            case ゲームニンテンドースイッチ.indexOf(x) >= 0 :
                return "ゲーム【ニンテンドースイッチ】"
                break
            case ゲームバーチャルボーイ.indexOf(x) >= 0 :
                return "ゲーム【バーチャルボーイ】"
                break
            case ゲームファミコン.indexOf(x) >= 0 :
                return "ゲーム【ファミコン】"
                break
            case ゲームプレイステーション.indexOf(x) >= 0 :
                return "ゲーム【プレイステーション】"
                break
            case ゲームプレイステーション2.indexOf(x) >= 0 :
                return "ゲーム【プレイステーション2】"
                break
            case ゲームプレイステーション3.indexOf(x) >= 0 :
                return "ゲーム【プレイステーション3】"
                break
            case ゲームプレイステーション4.indexOf(x) >= 0 :
                return "ゲーム【プレイステーション4】"
                break
            case ゲームプレイステーション5.indexOf(x) >= 0 :
                return "ゲーム【プレイステーション5】"
                break
            case ゲームメガドライブ.indexOf(x) >= 0 :
                return "ゲーム【メガドライブ】"
                break
            case ゲームワンダースワン.indexOf(x) >= 0 :
                return "ゲーム【ワンダースワン】"
                break
            case ゲームその他.indexOf(x) >= 0 :
                return "ゲーム【その他】"
                break
            default:
                return "不明"
        }
    //9桁数字でない場合
    } else {
        var z = hinban.slice(0,2)
        switch (true){
            case 書籍2.indexOf(z) >= 0 :
                return "書籍"
                break
            case 雑誌.indexOf(z) >= 0 :
                return "雑誌"
                break
            default:
                return "不明"
        }

    };

};

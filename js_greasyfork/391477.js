// ==UserScript==
// @name          bro3_trade_lump
// @namespace     bro3_trade_lump
// @description   ブラウザ三国志 トレード一括落札　byほっと
// @include       https://*.3gokushi.jp/card/trade.php*
// @include       http://*.3gokushi.jp/card/trade.php*
// @version       1.1
// @require	https://code.jquery.com/jquery-2.1.4.min.js
// @require	https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @resource	jqueryui_css	http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css


// @downloadURL https://update.greasyfork.org/scripts/391477/bro3_trade_lump.user.js
// @updateURL https://update.greasyfork.org/scripts/391477/bro3_trade_lump.meta.js
// ==/UserScript==
// version date       author
// 1.1    2019/10/06  作成開始

// to do
// 表示されているカードを上から順に即殺を入札していく

// load jQuery
jQuery.noConflict();
j$ = jQuery;

//----------//
// 変数定義  //
//----------//
// ソフトウェアバージョン
var VERSION = "1.1";
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
// 特殊定数
var PROTOCOL = location.protocol;
var HOST = location.hostname;        // アクセスURLホスト
var SERVICE = '';                  　　　　　　　　　　　　  // サービス判定が必要な場合に使用する予約定数
var SVNAME = HOST.substr(0,location.hostname.indexOf(".")) + SERVICE;
var SERVER_SCHEME = location.protocol + "//";
var BASE_URL = SERVER_SCHEME + location.hostname;
var BTL_KEY = "BTL_" + HOST.substr(0,HOST.indexOf("."));

// 固定設定
var BTL_MAXNUM = 20;   //入札上限
var BTL_INTERVAL = 1100;   // (ms)
var BTL_DEFPRICE = 10;
var BTL_DEFNUM = 10;
var BTL_MAXPAGE = 5;   // 最大入札ページ数

//----------------------
// メインルーチン
//----------------------
(function() {
        // ボタンを設置
       j$(".freeword").append(
                "<p><span>" +
                    "<label >即落入札額：</label>" +
                    "<input type='text' id='btlprice_text' size='10' ></input>" +
                    "<label >TP以下なら即落</label>" +
           　　　　　　　　"<label style='margin-left: 30px;' >落札上限数：</label>" +
                    "<input type='text' id='btlnum_text' size='10' ></input>" +
                    "<input type='button' id='btlbid_btn' value='即落入札'></input>" +
                    "<input type='button' id='btldef_btn' value='デフォルト設定'></input>" +
                "</span></p>"
        );

        var m_btl_tp=btl_getValue(BTL_KEY + '_btl_tp', BTL_DEFPRICE);
        var m_btl_num=btl_getValue(BTL_KEY + '_btl_num', BTL_DEFNUM);

       j$("#btlprice_text").val(m_btl_tp);
       j$("#btlnum_text").val(m_btl_num);

        //---------------------
	    // 即落ボタン
	    //---------------------
        j$("#btlbid_btn").click(
            function() {
                if　(isInteger(Number(j$("#btlprice_text").val()))){
                    if (Number(j$("#btlprice_text").val())<10){
                        alert("即落入札額には10以上の整数を入力してください");
                        return;
                    }
                    if　(isInteger(Number(j$("#btlnum_text").val()))){
                        var promise = Promise.resolve();
                        promise
                            .then(btl_trade_buy())     // 処理
                            .then(tbl_reload())      // リロード
                            .catch(onRejectted);
                    } else {
                       alert("入札ページ数には整数を入力してください");
                       return;
                    }
                } else {
                    alert("即落入札額には整数を入力してください");
                    return;
                }
            }
        );
       //---------------------
	   // デフォルト設定ボタン
	   //---------------------
       j$("#btldef_btn").click(
            function() {
                btl_setValue(BTL_KEY + '_btl_tp', j$("#btlprice_text").val());
                btl_setValue(BTL_KEY + '_btl_num', j$("#btlnum_text").val());
            }
        );
})();

function onRejectted(error) {
    console.log("error = " + error);
}

//----------------------------//
// リロード                   //
//----------------------------//
function tbl_reload(){
    return function() {
        return new Promise(function(resolve, reject) {
            console.log('リロードを行います');
            var timer = setInterval(
                    function () {
                        location.reload();
                        clearInterval(timer);
                        resolve(0);
                    }, 1000
                );
        });
    }
}
//---------------------
//   入札する
//---------------------
function btl_trade_buy(){
    return function() {
        return new Promise(function (resolve, reject) {
            // パラメータ取得
            var l_param = location.search
            console.log(l_param)
            var l_page=(btl_getParam('p'));
            if (!l_page) {
                if (l_param=="") {
                    l_param="?p=1"
                } else {
                    l_param="?p=1&"+l_param.slice(1)
                }
                l_page=1;
            }
            //ページ数取得
            var l_maxpage=1;
            if (j$("ul[class=pager]").length > 0) {
                var l_pages = j$("ul[class=pager] li");
                for (var i = 0; i < l_pages.length; i++) {
                    var l_ckpage = parseInt(j$(l_pages[i]).text(),10);
                    if (!isNaN(l_ckpage) && l_maxpage < l_ckpage) {
                        l_maxpage = l_ckpage;
                    }
                }
            }
            j$("#btlbid_btn").off('click');
            var l_limitprice=Number(j$("#btlprice_text").val());
            var l_limitnum=Number(j$("#btlnum_text").val());
            var l_wait = false;
            var l_count = 0;
            var l_url=　BASE_URL + '/card/trade.php';

            var str_text=j$("div[class^='right-box']").text();
            var l_match = str_text.match(/持てる武将カード残り(\d+)枚/);
            var l_busyo = Number(l_match[1]);
            console.log(l_busyo);
            //TP
            str_text=j$("div[id='status_point']").text();
            l_match = str_text.match(/(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            var l_tp=Number(l_match[3]);
            console.log(l_tp);
            var l_sumcnt=0;
            var timer1 = setInterval(function() {
                if (l_wait) {
                    return;
                }
                l_wait = true;
                j$("#btlbid_btn").val("処理中");
                var l_purl=l_url+l_param;
                // 送信データの作成
                j$.ajax({
                    url: l_purl,
                    type: 'get',
                    datatype: 'html',
                    cache: false
                }).done(function(res){
                    console.log(l_purl);
                    var l_num=0;
                    var l_ssid = btl_getSessionId();
                    j$(res).find("table[class='tradeTables'] td[class='trade']").each(function(index){
                        l_num=l_num+1;
                        var l_check=j$("a", this).eq(0).attr('href');
                        if (l_check==null){
                            //TP不足・カード上限
                            return 0;
                        } else {
                            if ((l_busyo>0) && ( l_sumcnt<l_limitnum)){
                                l_match =  j$("a", this).eq(0).attr('href').match(/trade_bid.php\?id=(\d+)&t=([^&]*)&k=([^&]*)&p=([^&]*)&s=([^&]*)&o=(.*)/);
                                if (l_match.length==7){
                                    var l_timelimit=j$(res).find("table[class='tradeTables'] tr:eq("+l_num+") td[class='limit']").eq(0).text();
                                    var l_price=j$(res).find("table[class='tradeTables'] tr:eq("+l_num+") td:eq(7) strong").eq(0).text();
                                    var l_cidmatch=j$(res).find("table[class='tradeTables'] tr:eq("+l_num+") td[class='busho'] div").attr('id');
                                    var l_cid = l_cidmatch.match(/(\d+)/);
                                    if (l_price<=l_limitprice){
                                        var ary1 = {};
                                        var l_flag=0;
                                        ary1.id = l_match[1];
                                        //ary1.t = l_match[2];
                                        //ary1.k = l_match[3];
                                        //ary1.p = l_match[4];
                                        //ary1.s = l_match[5];
                                        //ary1.o = l_match[6];
                                        ary1.cid = l_cid[1];
                                        //TPチェック
                                        if (l_tp>=l_price) {
                                            if (l_timelimit=="---"){
                                                ary1.buy = '落札する'
                                                l_tp=l_tp-l_price;
                                                l_busyo=l_busyo-1;
                                                l_sumcnt++;
                                                console.log(l_tp);
                                                console.log(l_busyo);
                                                console.log(l_sumcnt);
                                                var l_url2=　BASE_URL + '/card/trade_bid.php';

                                                // 送信データの作成
                                                var params = new Object;
                                                params['ssid'] = l_ssid;
                                                params['exhibit_id'] = ary1.id;
                                                params['exhibit_cid'] = ary1.cid;
                                                params['buy_btn'] = ary1.buy;
                                                j$.ajax({
                                                    url: l_url2,
                                                    type: 'post',
                                                    datatype: 'html',
                                                    cache: false,
                                                    data: params
                                                }).done(function(res2){
                                                    console.log(params);
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });

                    l_count++;
                    var l_numpage= Number(l_page) + l_count;
                    if  ( l_count >=　BTL_MAXPAGE || l_numpage>l_maxpage ) {
                        clearInterval(timer1);
                        resolve(0);
                    } else {
                        l_wait = false;
                    }
                    var l_setpage= 'p=' + l_numpage;
                    l_param=l_param.replace(/p=\d+/g, l_setpage);
                });
            }, BTL_INTERVAL);
        });
    };
}

//------------------//
// 整数チェック //
//------------------//
function isInteger(x) {
    return Math.round(x) === x;
}
function btl_setValue(name, value) {
    value = (typeof value)[0] + value;
    localStorage.setItem(name, value);
}
function btl_getValue(name, defaultvalue) {
    var value = localStorage.getItem(name);
    if (!value) return defaultvalue;
    var type = value[0];
    value = value.substring(1);
    switch (type) {
    case 'b':
        return value == 'true';
    case 'n':
        return Number(value);
    default:
        return value;
    }
}
//------------------//
// セッションID取得 //
//------------------//
function btl_getSessionId() {
    return btl_getCookie('SSID');
}
function btl_getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function btl_getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// ==UserScript==
// @name        AmazonMOD
// @license     Suruga-ya
// @namespace   S2
// @include     https://www.amazon.co.jp/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version     1.0
// @description ja
// @downloadURL https://update.greasyfork.org/scripts/543071/AmazonMOD.user.js
// @updateURL https://update.greasyfork.org/scripts/543071/AmazonMOD.meta.js
// ==/UserScript==

//設定
var RedirectToDMM = 0; //JAN検索時、見つからなかったらDMMにリダイレクト(1:する／0:しない)
var RedirectToArzon = 0; //JAN検索時、見つからなかったらArzonにリダイレクト(1:する／0:しない)
var linkToDmmArzon = 1; //Dmm,Arzonのリンクを表示(1:する／0:しない)
var linkToAucMer = 1; //Aucfree,メルカリのリンクを表示(1:する／0:しない)
var linkToAmazonUS = 1; //Amazon.comのリンクを表示(1:する／0:しない)

var amazonuslink = "https://www.amazon.com/s?k="
var dmmlink = "https://www.dmm.co.jp/mono/-/search/=/searchstr="
var arzonlink = "https://www.arzon.jp/itemlist.html?t=&m=all&s=&q="
var aucfreelink = "https://aucfree.com/search?o=t2&q="
var mercarilink = "https://jp.mercari.com/search?keyword="

//検索MOD
var $ = window.jQuery;
setTimeout(function() {
    if ($('#a-popover-1').text().indexOf('あなたは18歳以上ですか？') != -1){
        $('.a-button a-button-primary .a-button-inner').trigger('click');
    };
},2000);

var url = location.href;
var SearchWord = url.match(/s\?k=(.*?)\&/)[1];
var DecodedWord = decodeURI(SearchWord);

var SliceWord = DecodedWord.length > 20 ? (DecodedWord).slice(0,20)+"…" : DecodedWord; //長い文字列を省略表示
var JANCode = SearchWord.match(/\d{13}/);


if (linkToAmazonUS) {
    //$(.a-section.a-spacing-none).eq(0)
    $('#search').before ("<a target='_blank' href="+ amazonuslink + SearchWord+ ">" + SliceWord + "をAmazon.comで検索</a><br />");
}
if (linkToAucMer) {
    $('#search').before ("<a target='_blank' href="+ aucfreelink + SearchWord+ ">" + SliceWord + "をAucFreeで検索</a><br /><a target='_blank' href=" + mercarilink + SearchWord + ">" + SliceWord + "をメルカリで検索</a><br />");
}
if (linkToDmmArzon) {
    $('#search').before ("<a target='_blank' href="+ dmmlink + SearchWord+ ">" + SliceWord + "をDMMで検索</a><br /><a target='_blank' href=" + arzonlink + SearchWord + ">" + SliceWord + "をArzonで検索</a><br />");
}

if (RedirectToDMM && JANCode) {
    location.href = "http://www.dmm.co.jp/search/=/searchstr=" + JANCode + "/n1=FgRCTw9VBA4GCF5WXA__/n2=Aw1fVhQKX19XC15nV0AC/";
}
else if (RedirectToArzon && JANCode) {
    location.herf = "http://www.arzon.jp/itemlist.html?t=&m=all&s=&q=" + JANCode;
}
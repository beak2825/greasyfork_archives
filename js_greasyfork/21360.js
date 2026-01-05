// ==UserScript==
// @name        いろいろ非表示
// @namespace   @tatuya00
// @description 非表示
// @description:en 非表示
// @include     http://live.nicovideo.jp/*
// @include     http://com.nicovideo.jp/*
// @include     http://www.nicovideo.jp/*
// @include     http://www.pixiv.net/*
// @include     http://www.cavelis.net/*
// @include     https://www.facebook.com/*
// @include     https://www.google.co.jp/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21360/%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/21360/%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

var del = [
	//ニコニコ
	"watch_zapping_box",  //ニコ生プレイヤー下のザッピング
	"_personalFrame",
	"personalFrame",      //ニコニコトップおすすめ情報
	"nicoIchiba",         //ニコニコ市場
	"followContainer",    //ニコニコミュニティの変な余白
	"ps4-programs-block", //ニコ生PS4配信一覧
	"eden_pickup_program_area",//同上
	"parentVideoInfo",    //ニコ動クリエイターなんたら
	"banner-watch-broadcaster",//ニコ生配信のプレイヤー上にあるバナー
	"videoTopRecommend",  //ニコ動トップピックアップ
	"chokaigi2016countdown03",
	"pickupRanking",
	"trendtag",
	"nicoliveNotification onair",
	"user-ad-block",
	"videoTopBanner",
	
	//pixiv
	"rounded", //pixivニュース
	"premium-header-banner", //pixivヘッダープレミアム
	"side-menu group-list left-premium-menu", //pixiv左にあるプレミアムのなんか
	"_mypage-premium-banner",
	"upload ad-printservice",
	"comic-hot-works",
	"user-recommend-introduction",
	
	//cavetube
	"rectangle_area", //アドセンスなんたらの表示
	"amazon_advertise_area", //トップページ真ん中の余白
	"archive_area", //最近の配信
	
	//facebook
	"commentable_item",
	"_5hn6",
	
	//その他
	"taw",
	"ads-ad",
	"inter_background",
];

for(var i=0; i<del.length; i++){
	
	//idの非表示処理
	var id = document.getElementById(del[i]);
	if(id != null) id.parentNode.removeChild(id);
	
	//classの非表示処理
	var cla = document.getElementsByClassName(del[i]);
	if(cla != null) {
		//cla = document.createElement("style")
		for(var f=0; f<cla.length; f++){
			cla[f].style.display = "none";
		}
	}
	
}

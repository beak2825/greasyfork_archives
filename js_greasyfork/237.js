// ==UserScript==
// @name				CustomGinzaWatch
// @include				http://www.nicovideo.jp/watch/*
// @version				4.0.56
// @namespace		http://d.hatena.ne.jp/wfwjfow/
// @description		ニコニコ動画:GINZAの動画プレイヤーのUIをお手軽カスタマイズ。
// @grant				GM_getValue
// @grant				GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/237/CustomGinzaWatch.user.js
// @updateURL https://update.greasyfork.org/scripts/237/CustomGinzaWatch.meta.js
// ==/UserScript==

/*
■参考スクリプト■
NicoRankingKidokuDelete　→　http://userscripts.org/scripts/show/45927
*/


var main = function () {

if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {

GM_getValue = function(name, defaultValue) {
var value = localStorage.getItem(name);
if (!value)
return defaultValue;
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
GM_setValue = function(name, value) {
value = (typeof value)[0] + value;
localStorage.setItem(name, value);
}
if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; } 
}




	//ヘッダーを開閉式に
	function headertoggle(){
		if( GM_getValue("headertoggle")=="on"){

			var headbar = document.createElement("div");
			headbar.id = "headbar";
			document.body.appendChild(headbar);

			$("#headbar").click(function(){
				$("#siteHeader").animate(
					{height:"toggle",opacity:"toggle"},
					"500"
				);
			setTimeout(function(){
				GM_setValue("headdisplay",$("#siteHeader").css("display"));
			},1000);
		});
		if(GM_getValue("headdisplay","block")=="none"){
			$("#siteHeader").hide();
		};

			$("head").append('<style type="text/css">body{padding-top:0!important;}body #content{padding-top:7px!important;}body.nofix #siteHeader{position:relative!important;}#headbar{background-color:#222222;position:fixed;top:0;font-size:0px;display:block;width:100%;height:5px;z-index:999999999;cursor:pointer;margin-left:0!important;}</style>');
		}
	}
	//右上の検索ボックスを消す
	function delsearchbox(){
		if( GM_getValue("delsearchbox")=="on"){
			$("head").append('<style type="text/css">#videoHeaderMenu .searchContainer{display:none!important;}</style>');
		}
	}
	//タグクリック等時に同じタブで開く
	function targetself(){
		if( GM_getValue("targetself")=="on"){
			function onajitab(){
				$(".videoDescription a[href*='http://www.nicovideo.jp/mylist/'],#videoHeaderTagList li.videoHeaderTag a.videoHeaderTagLink").click( function() {
					$("body").css("display","none")
					$("#videoExplorerBackContainer").click();
					window.location.href=this.href;
				});
			}
			onajitab();
			setInterval(function(){onajitab()},1000);

			$("head").append('<style type="text/css"></style>');
		}
	}
	//タグクリック等時に別タブで開く
	function targetblank(){
		if( GM_getValue("targetblank")=="on"){
			function betsutab(){
				$(".videoDescription a[href*='http://www.nicovideo.jp/mylist/'],#videoHeaderTagList li.videoHeaderTag a.videoHeaderTagLink").click( function() {
					window.open(this.href,'blank');
					setTimeout(function(){
						$("#videoExplorerBackContainer").click();
					},200);
				});
			}
			betsutab();
			setInterval(function(){betsutab()},1000);

			$("head").append('<style type="text/css"></style>');
		}
	}
	//コメント欄のソーシャルボタンを消す
	function delkomesocial(){
		if( GM_getValue("delkomesocial")=="on"){
			$("head").append('<style type="text/css">#playerTabContainer .socialButtons{display:none!important;}</style>');
		}
	}
	//もっと見るで簡易大百科記事を消す
	function delminidic(){
		if( GM_getValue("delminidic")=="on"){
			$("head").append('<style type="text/css">#videoExplorer div.tagRelatedNicopedia{display:none!important;}</style>');
		}
	}
	//もっと見るでユーザー広告を消す
	function deluserad(){
		if( GM_getValue("deluserad")=="on"){
			$("head").append('<style type="text/css">#videoExplorer div.uadTagRelated{display:none!important;}</style>');
		}
	}
	//ブラックモード
	function backblack(){
		if( GM_getValue("backblack")=="on"){
			$("head").append('<style type="text/css">body{background-color:#393939!important;}#content,#videoHeader,#outline{background:transparent!important;color:#ccc!important;}*{color:#ccc!important;}#ichibaMain .balloonUe * , #prefDiv * , #playerTabContainer *,#divmottoright *,#menudivmenu *{color:#000000!important;}#videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit{background-color:#000000!important;}#content #videoTagContainer .tagInner #videoHeaderTagList li.videoHeaderTag a{color:#ccc!important;}#videoStats{border:1px solid #ccc!important;}span.isNotFavoritedText{color:#000000!important;}</style>');
//			$("head").append('<style type="text/css">body{background-color:#111111!important;}#content,#videoHeader,#outline{background:transparent!important;color:#ccc!important;}*{color:#ccc!important;}#ichibaMain .balloonUe * , #prefDiv * , #playerTabContainer *,#divmottoright *,#menudivmenu *{color:#000000!important;}#videoTagContainer{border:1px solid #027B76!important;background: -moz-linear-gradient(-45deg, #027B76,#18D4CC 50%,#027B76)!important;background: -webkit-gradient(linear, left top,right bottom, from(#027B76),color-stop(0.5,#18D4CC),to(#027B76))!important;}#content #videoTagContainer .tagInner #videoHeaderTagList li.videoHeaderTag a,#content #videoTagContainer .tagInner #videoHeaderTagList li a,#videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit .toggleTagEditInner{color:#000000!important;}span.isNotFavoritedText{color:#000000!important;}#videoHeaderDetail #videoStats{border:1px solid #027B76!important;background: -moz-linear-gradient(-45deg, #027B76,#18D4CC 50%,#027B76)!important;background: -webkit-gradient(linear, left top,right bottom, from(#027B76),color-stop(0.5,#18D4CC),to(#027B76))!important;}#videoHeaderDetail #videoStats li,#videoHeaderDetail #videoStats li span{color:#000000!important;}#ichibaMain #ichibaMainFooter .commandArea input{color:#000000!important;}#content #videoTagContainer a:link,div.toggleTagEditInner{text-decoration:underline!important;}span[style="font-size: 45px;line-height:1.1;"],span[style="font-size: 90px;line-height:1.1;"],span[style="font-size: 60px;line-height:1.1;"],span[style="font-size: 36px;line-height:1.1;"],span[style="font-size: 30px;line-height:1.1;"]{color:#4a6ebc!important;font-weight:bold!important;}#videoHeaderDetail h2 span.videoHeaderTitle{color:#18D4CC!important;}#videoHeaderDetail h2 p.toko .ranking{color:#ccc!important;}#videoHeaderDetail h2 p.toko .ranking a.icon,#videoHeaderDetail h2 p.toko .ranking span.categoryName{color:#18D4CC!important;}#playlist .playlistInformation .generationMessage{color:#18D4CC!important;}body #videoTagContainer .tagInner #videoHeaderTagList li.toggleTagEdit{margin:0 17px 0 0!important;padding:0!important;background:transparent!important;display:block!important;height:100%!important;}</style>');
		}
	}
	//タグを開閉式に
	function tagtoggle(){
		if( GM_getValue("tagtoggle")=="on"){
		$("#playerNicoplayer").append("<a id='toggle9'>Tagの開閉</a>"); 

			$("#toggle9").click(function(){
				$("#videoTagContainer").toggle();
				GM_setValue("tagDisplay",$("#videoTagContainer").css("display"));
			});
			if(GM_getValue("tagDisplay")=="none"){
				$("#videoTagContainer").hide();
			}
			$("head").append('<style type="text/css">#toggle9{float:left!important;margin-left:15px;cursor:pointer;}</style>');
		}
	}
	//ウォールのアイコンだけを消す
	function walliconoff(){
		if( GM_getValue("walliconoff")=="on"){
			$("head").append('<style type="text/css">#chipWallList{display:none!important;}</style>');
		}
	}
	//タグのピンを常時表示
	function tagpinon(){
		if( GM_getValue("tagpinon")=="on"){
			$("head").append('<style type="text/css">#videoTagContainer .tagInner #videoTagContainerPin{display:block!important;}</style>');
		}
	}
	//ウォールを消す
	function walloff(){
		if( GM_getValue("walloff")=="on"){
			$("head").append('<style type="text/css">#wallImageContainer .wallAlignmentArea , #chipWallList{display:none!important;}#wallImageContainer{height:0!important;}</style>');
		}
	}
	//タグのピンを消す
	function deltagpin(){
		if( GM_getValue("deltagpin")=="on"){
			$("head").append('<style type="text/css">#videoTagContainerPin{display:none!important;}</style>');
		}
	}
	//プレイヤーのサイズを大きく
	function bigwatch(){
		if( GM_getValue("bigwatch")=="on" && GM_getValue("komepaneltoggle_on")=="off"){
			
$("head").append('<style type="text/css">#playerAlignmentArea.size_normal{width:99%!important;}body.size_normal #playerTabWrapper{float:right!important;position:relative!important;}body.size_normal #playerNicoplayer{float:left!important;}body.size_normal #nicoplayerContainer #external_nicoplayer{top:0!important;}#playerContainerWrapper{padding-bottom:0!important;}</style>');

			$(window).on("load resize", function(){
				var wh = $(window).height();
				var ww = $(window).width();
				var tw = $("#playerTabWrapper").width();
				var ww2= Math.round(ww*0.99-tw-15)+"px";
				var wh2= Math.round((ww*0.99-tw-15)*0.562)+"px";
				var wh2_2= (Math.round((ww*0.99-tw-15)*0.562)+25)+"px";

				$("body.size_normal #playerContainerWrapper,body.size_normal #playerContainerSlideArea,body.size_normal #playerAlignmentArea.size_normal,body.size_normal #playerAlignmentArea.size_normal #playerContainer.controll_panel").css({'cssText':'height:'+wh2_2+'!important;'});
				$("#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerNicoplayer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner #external_nicoplayer").css({'cssText':'width:'+ww2+'!important;height:'+wh2+'!important;'});
				$("#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerTabWrapper").css({'cssText': 'height:'+wh2+'!important;'});
			});
			
			}else if( GM_getValue("bigwatch")=="on" && GM_getValue("komepaneltoggle_on")=="on"){

$("head").append('<style type="text/css">body.size_normal #playerAlignmentArea.size_normal{width:99%!important;}body.size_normal #playerTabWrapper{float:right!important;position:relative!important;}body.size_normal #playerNicoplayer{float:left!important;}body.size_normal #nicoplayerContainer #external_nicoplayer{top:0!important;}#playerContainerWrapper{padding-bottom:0!important;}</style>');

			function panelcheck(){
				var wh = $(window).height();
				var ww = $(window).width();
				var tw = $("#playerTabWrapper").width();
				var tdis = $("#playerTabWrapper").css("display");
				if(tdis=="none"){

				var ww2= (Math.round(ww*0.99)-1)+"px";
				var wh2= Math.round(ww*0.99*0.562)+"px";
				var wh2_2= (Math.round(ww*0.99*0.562)+25)+"px";

				$("body.size_normal #playerContainerWrapper,body.size_normal #playerContainerSlideArea,body.size_normal #playerAlignmentArea.size_normal,body.size_normal #playerAlignmentArea.size_normal #playerContainer.controll_panel").css({'cssText':'height:'+wh2_2+'!important;'});
				$("#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerNicoplayer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner #external_nicoplayer").css({'cssText':'width:'+ww2+'!important;height:'+wh2+'!important;'});

				}else{
				var thide = "block";
				
				var ww2= Math.round(ww*0.99-tw-15)+"px";
				var wh2= Math.round((ww*0.99-tw-15)*0.562)+"px";
				var wh2_2= (Math.round((ww*0.99-tw-15)*0.562)+25)+"px";

				$("body.size_normal #playerContainerWrapper,body.size_normal #playerContainerSlideArea,body.size_normal #playerAlignmentArea.size_normal,body.size_normal #playerAlignmentArea.size_normal #playerContainer.controll_panel").css({'cssText':'height:'+wh2_2+'!important;'});
				$("#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerNicoplayer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner,#playerAlignmentArea.size_normal #playerContainer.controll_panel #nicoplayerContainer #nicoplayerContainerInner #external_nicoplayer").css({'cssText':'width:'+ww2+'!important;height:'+wh2+'!important;'});
				$("#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerTabWrapper").css({'cssText': 'height:'+wh2+'!important;display:'+thide});
			}
			}
			panelcheck();
			setInterval(function(){panelcheck()},1000);

			}
		
	}
	//ツイートボタン等を消去
	function delsocial(){
		if( GM_getValue("delsocial")=="on"){
			$("head").append('<style type="text/css">#videoShareLinks{display:none!important;}#topVideoInfo .socialLinks{display:none!important;}</style>');
		}
	}
	//動画詳細情報を消去
	function delshosai(){
		if( GM_getValue("delshosai")=="on"){
			$("head").append('<style type="text/css">#bottomVideoDetailInformation,#bottomVideoDetailInformation .supplementary{display:none!important;}#topVideoInfo .hiddenInfoTabContent,#topVideoInfo .hiddenInfoTabHeader{display:none!important;}</style>');
		}
	}
	//マイリスボタン・とりあえずマイリスボタン以外を消去
	function delbuttons(){
		if( GM_getValue("delbuttons")=="on"){
			$("head").append('<style type="text/css">#videoMenuTopList .uadButton,#videoMenuTopList .mymemoryButton,#videoMenuTopList .downloadButton,#videoMenuTopList .menuAward,#videoMenuTopList #speedChecker,#videoMenuTopList .userChannel,#videoMenuTopList li.videoMenuList.menuUad,#videoMenuTopList li.videoMenuList a.facebookButton,#videoMenuTopList li.videoMenuList a.twitterButton{display:none!important;width:0!important;height:0!important;}#videoMenuWrapper{height:auto!important;}#videoTagContainer{min-height:48px!important;}</style>');
		}
	}
	//コンテンツツリー消去
	function ctreeCut(){
		if( GM_getValue("ctree_off")=="on"){
			$("head").append('<style type="text/css">.parentVideoInfo{display:none!important;}</style>');
		}
	}
	//下の動画説明文・動画情報を消去
	function deljosdes(){
		if( GM_getValue("deljosdes")=="on"){
			$("head").append('<style type="text/css">#videoInfo{display:none!important;}#videoComment{display:none!important;}</style>');
		}
	}
	//広告消去
	function senCut2(){
		if( GM_getValue("senden2")=="on"){
			$("head").append('<style type="text/css">#videoExplorerSideFollowAdAds,#rectangleAd,#sideFollowAd,#superBanner,#tagRelatedBannerContainer,#tagRelatedBanner,#playerBottomAd,#pageFooterAds,#selectionFooter,#videoReviewBottomAd,#resultContainer .resultAdsWrap,#selectionSideAd,.nicoSpotAds{display:none!important;}#videoStartAds{display:none!important;}#leftPanelAdAds,#leftPanelAd{display:none!important;}.ja-jp .panel_ads_shown #playerCommentPanel.has_panel_ads .section #commentDefault.commentTable, .ja-jp .panel_ads_shown #playerCommentPanel.has_panel_ads .section #commentLog.commentTable, .ja-jp .panel_ads_shown #playerCommentPanel.has_panel_ads .section #commentNgSetting.commentTable{bottom:5px!important;}#playerTabWrapper .player-tab-content{bottom:0!important;}#playerTabContainer .playerTabAds{display:none!important;}#videoExplorerSuperBanner{display:none!important;}</style>');
		}
	}
	//コメント一覧非表示
	function comeCut(){
		if( GM_getValue("come_off")=="on"){
			$("head").append('<style type="text/css">#playerTabWrapper{display:none!important;}</style>');
		}
	}
	//コメント一覧を開閉式に
	function komepaneltoggle(){
		if( GM_getValue("komepaneltoggle_on")=="on"){
		$("#playerNicoplayer").append("<a id='toggle2'>コメント一覧の開閉</a>"); 

			$("#toggle2").click(function(){
				$("#playerTabWrapper").toggle();
				GM_setValue("commentpanelDisplay",$("#playerTabWrapper").css("display"));
			});
			if(GM_getValue("commentpanelDisplay")=="none"){
				$("#playerTabWrapper").hide();
			}
			$("head").append('<style type="text/css">#toggle2{float:right!important;margin-left:15px;cursor:pointer;}</style>');
		}
	}
	//コメント一覧を閉じた時、幅をワイドに。
	function wideon(){
		if( GM_getValue("wideon")=="on" && GM_getValue("bigwatch")=="off" && GM_getValue("marquee_off")=="on"){

			function panelcheck2(){
				var tdis = $("#playerTabWrapper").css("display");
				if(tdis=="none"){

					var headwidth = $("#videoHeader").width();
					var pw4 = headwidth+"px";
					var ph4 = Math.round(headwidth*0.562)+"px";
					var ph5 = (Math.round(headwidth*0.562)+25)+"px"
					
				$("#playerAlignmentArea.size_normal,#playerAlignmentArea.size_normal #playerContainer,#playerAlignmentArea.size_normal #playerNicoplayer").css({'cssText': 'width:'+pw4+'!important;height:582px!important;'});
				$("#playerAlignmentArea.size_normal #nicoplayerContainer,#playerAlignmentArea.size_normal #nicoplayerContainerInner,#playerAlignmentArea.size_normal #external_nicoplayer").css({'cssText': 'width:'+pw4+'!important;height:555px!important;'});
				$("#playerAlignmentArea.size_medium,#playerAlignmentArea.size_medium #playerContainer,#playerAlignmentArea.size_medium #playerNicoplayer").css({'cssText': 'width:'+pw4+'!important;height:486px!important;'});
				$("#playerAlignmentArea.size_medium #nicoplayerContainer,#playerAlignmentArea.size_medium #nicoplayerContainerInner,#playerAlignmentArea.size_medium #external_nicoplayer").css({'cssText': 'width:'+pw4+'!important;height:461px!important;'});
$("head").append('<style type="text/css">body.size_normal #nicoplayerContainer #external_nicoplayer,body.size_medium #nicoplayerContainer #external_nicoplayer{top:0!important;}</style>');
				}else{
					$("#playerAlignmentArea.size_normal,#playerAlignmentArea.size_normal #playerContainer,#playerAlignmentArea.size_normal #playerNicoplayer").css({'cssText': 'width:'+pw4+'!important;height:582px!important;'});
					$("#playerAlignmentArea.size_normal #nicoplayerContainer,#playerAlignmentArea.size_normal #nicoplayerContainerInner,#playerAlignmentArea.size_normal #external_nicoplayer").css({'cssText': 'width:898px!important;height:555px!important;'});
					$("#playerAlignmentArea.size_medium,#playerAlignmentArea.size_medium #playerContainer,#playerAlignmentArea.size_medium #playerNicoplayer").css({'cssText': 'width:'+pw4+'!important;height:486px!important;'});
					$("#playerAlignmentArea.size_medium #nicoplayerContainer,#playerAlignmentArea.size_medium #nicoplayerContainerInner,#playerAlignmentArea.size_medium #external_nicoplayer").css({'cssText': 'width:672px!important;height:461px!important;'});
				}

			}
			panelcheck2();
			setInterval(function(){panelcheck2()},500);

		}
	}
	//動画上マーキー消去
	function marqueeCut(){
		if( GM_getValue("marquee_off")=="on"){
			$("head").append('<style type="text/css">#textMarquee{display:none!important;}#playerContainerSlideArea.size_medium #playerContainer.controll_panel.oldTypeCommentInput.text_marquee,#playerContainerSlideArea.size_normal #playerContainer.controll_panel.oldTypeCommentInput.text_marquee{height:auto!important;}#playerContainerSlideArea.size_medium #playerContainer.full_with_browser.oldTypeCommentInput.text_marquee,#playerContainerSlideArea.size_normal #playerContainer.full_with_browser.oldTypeCommentInput.text_marquee{height:100%!important;}</style>');
			$("head").append('<style type="text/css">#playerAlignmentArea.size_medium #playerContainer.controll_panel #playerTabWrapper{height:459px!important;}#playerAlignmentArea.size_normal #playerContainer.controll_panel #playerTabWrapper{height:553px!important;}#playerAlignmentArea.size_medium #playerContainer{height:475px!important;}#playerAlignmentArea.size_normal #playerContainer{height:570px!important;}body.full_with_browser #playerAlignmentArea.size_normal #playerContainer,body.full_with_browser #playerAlignmentArea.size_medium #playerContainer{height:100%!important;}</style>');
		}
	}
	//フィードバックリンク消去
	function feedbackCut(){
		if( GM_getValue("feedback_off")=="on"){
			$("head").append('<style type="text/css">#feedbackLink{display:none!important;}</style>');
		}
	}
	//もっと見るにマイリスコメント？常時表示
	function infoPlus(){
		if( GM_getValue("infoplus")=="on"){
				$("head").append('<style type="text/css">#videoExplorer .column4 .video .balloon{display:block!important;height:auto!important;min-height:46px!important;box-shadow:none!important;padding-top:5px!important;line-height:1.4em!important;top:-80px!important;left:0!important;}#videoExplorer .column4 li.video{margin-top:70px!important;}#videoExplorer .column4 li .balloon ul.videoInformation{display:block!important;}#videoExplorer .column4 li .balloon .videoInformationOuter .videoInformation li{float:none!important;}.balloon .contentInfo{display:none!important;}.balloon .uadComments{font-size:13px!important;line-height:1.2em!important;}</style>');
		}
	}

	//レビュー消去
	function reviewCut(){
		if( GM_getValue("review_off")=="on"){
			$("head").append('<style type="text/css">#videoReview{display:none!important;}</style>');
		}
	}
	//レビューを開閉式に
	function reviewtoggle(){
		if( GM_getValue("reviewtoggle_on")=="on"){
		$("#playerNicoplayer").append("<a id='toggle3'>レビューの開閉</a>"); 

			$("#toggle3").click(function(){
				$("#videoReview").toggle();
				GM_setValue("reviewDisplay",$("#videoReview").css("display"));
			});
			if(GM_getValue("reviewDisplay")=="none"){
				$("#videoReview").hide();
			}
			$("head").append('<style type="text/css">#toggle3{float:right!important;margin-left:15px;cursor:pointer;}</style>');
		}
	}
	//市場消去
	function ichibaCut(){
		if( GM_getValue("ichiba_off")=="on"){
			$("head").append('<style type="text/css">#nicoIchiba{display:none!important;}</style>');
		}
	}
	//市場を開閉式に
	function ichibatoggle(){
		if( GM_getValue("ichibatoggle_on")=="on"){
		$("#playerNicoplayer").append("<a id='toggle4'>市場の開閉</a>"); 

			$("#toggle4").click(function(){
				$("#nicoIchiba").toggle();
				GM_setValue("ichibaDisplay",$("#nicoIchiba").css("display"));
			});
			if(GM_getValue("ichibaDisplay")=="none"){
				$("#nicoIchiba").hide();
			}
			$("head").append('<style type="text/css">#toggle4{float:left!important;margin-left:15px;cursor:pointer;}</style>');
		}
	}
	//マイリスボタン等常時表示
	function tvchanCut(){
		if( GM_getValue("tvchan_off")=="on"){
			$("head").append('<style type="text/css">.videoMenuToggle{display:none !important;}#videoHeader.menuOpened #videoHeaderDetail{margin-top:0px!important;}#videoHeader.menuClosed #videoHeaderDetail{margin-top:0px!important;}#videoMenuTopList li{display:block!important;}#videoTagContainer{padding-right:0!important;}#videoMenuTopList li.videoMenuList{font-size:0!important;height:37px!important;width:37px!important;}#videoMenuTopList li.videoMenuList a span , #videoMenuTopList li.videoMenuList .button{width:37px!important;height:37px!important;border-radius: 5px;}#videoTagContainer.default{width:779px!important;min-width:779px!important;}#videoTagContainer{width:779px!important;min-width:779px!important;}#videoMenuTopList{padding-right:0!important;}#videoMenuWrapper{float:right!important;}#videoTagContainer{float:left!important;margin-top:0!important;height:auto!important;min-height:70px!important;}body.size_normal #videoTagContainer{width:898px!important;min-width:898px!important;}body.size_normal #videoTagContainer.dafault{width:898px!important;min-width:898px!important;}#videoMenuWrapper{overflow:visible!important;}#videoMenuTopList{margin-top:0!important;}#videoHeader.menuOpened #editorMenu{margin-top: 0!important;}#videoHeader.menuOpened .editor-menu{margin-top: 0px!important;}#videoHeader.menuClosed .editor-menu{margin-top: 0px!important;}#editorMenu{margin-top:0!important;}#videoHeader.menuOpened .tvChanMenuHeightController{margin-top:0!important;}</style>');
			if( GM_getValue("infocombine3")=="off"){
				$("head").append('<style type="text/css">#videoMenuTopList{width:185px!important;}#videoMenuWrapper{width:185px!important;height:75px!important;}</style>');
			}
		}
	}
	//コメント一覧の幅を広げる
	function komespread(){
		if( GM_getValue("spread_on")=="on"){
			$("head").append('<style type="text/css">#playerAlignmentArea.size_medium{width:1082px!important;}#playerAlignmentArea.size_normal{width:1307px!important;}#playerTabWrapper{float:right!important;position:relative!important;width:400px!important;}#playerNicoplayer{float:left!important;}#playerTabContainer .player-tab-header .nicommend{border-right: 1px solid #333333;}#commentDefault .commentTableContainer{width:386px!important;}#appliPanel{display:none!important;}.area-JP .panel_ads_shown #playerTabContainer.has_panel_ads .playerTabAds{display:none!important;}body.size_normal #videoHeader{width:1307px!important;}body.size_medium #videoHeader{width:1082px!important;}body.size_medium .outer{width:1082px!important;}body.size_normal .outer{width:1307px!important;}#commentLog div.commentTableContainer{width:100%!important;}#playerTabContainer .player-tab-header .playerTabItem{width:133px!important;}</style>');
		}
	}
	//プレイヤー下のプレイリストを消去
	function playlistCut(){
		if( GM_getValue("playlist_off")=="on"){
			$("head").append('<style type="text/css">#playlist{display:none!important;}</style>');
		}
	}
	//もっと見るバーを消去
	function mottoCut(){
		if( GM_getValue("motto_off")=="on"){
			$("head").append('<style type="text/css">#videoExplorerExpand{display:none!important;}</style>');
		}
	}

	//市場の幅を広げる
	function wideichiba(){
		if( GM_getValue("wideichiba_on")=="on"){

			if( GM_getValue("infotocomepanel_on")=="on"　|| GM_getValue("spread_on")=="on"){
				$("head").append('<style type="text/css">body .main{width:100%!important;}#nicoIchiba{width:100%!important;}#ichibaMain{width:100%!important;margin:0 auto!important;}#bottomContentTabContainer #outline .outer .main #videoInfo{margin:0 auto;}#ichibaMainFooter{clear:both!important;}.rowJustify{clear:none!important;}body.size_medium #bottomContentTabContainer #outline .outer{width:1082px!important;}body.size_normal #bottomContentTabContainer #outline .outer{width:1307px!important;}#ichibaMain dl{height:330px!important;}</style>');
				if( GM_getValue("miniichiba_on")=="off"){
					$("head").append('<style type="text/css">body.size_medium #ichibaMain dl{margin: 0 18px 10px!important;}body.size_normal #ichibaMain dl{margin: 0 18px 10px!important;}</style>');
				}else{
					$("head").append('<style type="text/css">body.size_medium #ichibaMain dl{margin: 0 6px 10px!important;}body.size_normal #ichibaMain dl{margin: 0 4px 10px!important;}</style>');
				}
			}else{
				$("head").append('<style type="text/css">body.size_normal .outer,body.size_normal .main{width:1234px!important;}#nicoIchiba{width:100%!important;}#ichibaMain{width:100%!important;margin:0 auto!important;}#bottomContentTabContainer #outline .outer .main #videoInfo{margin:0 auto;}#ichibaMainFooter{clear:both!important;}.rowJustify{clear:none!important;}#ichibaMain #ichibaMainHeader{margin-right: 20px!important;}#bottomContentTabContainer #outline .outer .main #videoInfo{width:1008px;}body.size_normal #bottomContentTabContainer #outline .outer .main #videoInfo{width:1234px;}body .main{width:100%!important;}#ichibaMain dl{height:330px!important;}</style>');
				if( GM_getValue("miniichiba_on")=="off"){
					$("head").append('<style type="text/css">body.size_medium #ichibaMain dl{margin: 0 10px 10px!important;}body.size_normal #ichibaMain dl{margin: 0 12px 10px!important;}</style>');
				}else{
					$("head").append('<style type="text/css">body.size_medium #ichibaMain dl{margin: 0 11px 10px!important;}body.size_normal #ichibaMain dl{margin: 0 7px 10px!important;}</style>');
				}
			}
		}
	}
	//市場の商品画像等を小さく
	function miniichiba(){
		if( GM_getValue("miniichiba_on")=="on"){
			
			if( GM_getValue("infotocomepanel_on")=="on"　|| GM_getValue("spread_on")=="on"){
			$("head").append('<style type="text/css">.ichiba_item img{width:120px!important;height:120px!important;}#ichibaMain dl{width:122px!important;overflow:hidden!important;}#ichibaMain dd.mobile a.uta{background-size: 70% auto!important;background-position: 0 -49px!important;}#ichibaMain dd.mobile a.kashi{background-size: 73% auto!important;background-position: 0 -208px!important;}#ichibaMain dd.mobile a.utafull{background-size: 73% auto!important;background-position: 0 -392px!important;}#ichibaMain dl.pia dd.pia{width:123px!important;}#ichibaMain dd.mobile a.decome{background-size: 71% auto!important;background-position: 0 -75px!important;}</style>');
			}else{
			$("head").append('<style type="text/css">.ichiba_item img{width:120px!important;height:120px!important;}#ichibaMain dl{width:122px!important;overflow:hidden!important;}#ichibaMain dd.mobile a.uta{background-size: 70% auto!important;background-position: 0 -49px!important;}#ichibaMain dd.mobile a.kashi{background-size: 73% auto!important;background-position: 0 -208px!important;}#ichibaMain dd.mobile a.utafull{background-size: 73% auto!important;background-position: 0 -392px!important;}#ichibaMain dl.pia dd.pia{width:123px!important;}#ichibaMain dd.mobile a.decome{background-size: 71% auto!important;background-position: 0 -75px!important;}</style>');
			}
		}
	}
	//下の動画詳細情報を常時表示に
	function infonontoggle(){
		if( GM_getValue("infonontoggle_on")=="on"){
			$("head").append('<style type="text/css">.extraVideoTrigger .open, .extraVideoTrigger .close{display:none!important;}.supplementary{display:block!important;}#topVideoInfo .hiddenInfoTabContent{display:block!important;}</style>');
		}
	}
	//左寄せにする
	function hidariyose(){
		if( GM_getValue("left_on")=="on"){
			$("head").append('<style type="text/css">#videoHeader,#siteHeaderInner,.outer,#foot_inner{margin:0 0 0 15px!important;}#playerContainerSlideArea{margin-bottom:5px!important;}#playlist{clear:both!important;}#playerAlignmentArea{margin-left:15px!important;}#playerContainerSlideArea.size_small{margin-left:0!important;}#siteHeader #siteHeaderInner .siteHeaderMenuList{float:left!important;}body.full_with_browser #playerAlignmentArea{margin-left:0!important;}</style>');
		}
	}
	//フッター消去
	function footcut(){
		if( GM_getValue("footer_off")=="on"){
			$("head").append('<style type="text/css">#footer{display:none!important;}body,#content{background-color:#F3F3F3!important;}.outer{margin-bottom:0!important;}</style>');
		}
	}
	//旧検索をコメント欄内の動画説明文に追加
	function oldsearch2(){
		if( GM_getValue("oldsearch2")=="on" && GM_getValue("infotocomepanel_on")=="on"){
			$("head").append('<style type="text/css">#des_search{width:370px;padding-left:15px;margin-bottom:15px;}#bar_search{width:220px;height: 26px;}#selectsearch{background-color:#FFFFFF!important;border:none;height:26px;color:#222222;width:100px;}#des_search input#bar_search{background-color:#FFFFFF!important;border:none;border-right:1px solid #222222!important;height:26px;color:#222222;}#submitbutton{background-image:url("http://uni.res.nimg.jp/img/zero_index/theme/default/icon.png");height:26px;width:29px;border:none;}div#siteHeader div#siteHeaderInner div.searchText div.clear-button{display:none!important;}</style>');

			$("#videoInfo").append("<div id='des_search'><form id='des_search_form' method='get' target='_blank' action='http://www.nicovideo.jp/search/'><select id='selectsearch' name='selectsearch'><option value='word'>word</option><option value='tag'>tag</option></select><input id='bar_search' name='s' value='' type='text'><input name='submit' id='submitbutton' type='submit' value=''></form></div>");

			$("#selectsearch").change(function() {
				if($("#selectsearch").val()=="word"){
					$("#des_search_form").attr("action","http://www.nicovideo.jp/search/")
				}else if($("#selectsearch").val()=="tag"){
					$("#des_search_form").attr("action","http://www.nicovideo.jp/tag/")
				}
			});
		}
	}
	//旧検索をヘッダーに追加
	function oldsearch(){
		if( GM_getValue("oldsearch_on")=="on"){
			$("head").append('<style type="text/css">#bar_search{width:150px;height: 22px;}#head_search{margin-top:6px!important;float:left;}#selectsearch{background-color:#525252!important;border:none;height:24px;color:#FFFFFF;}#head_search input#bar_search{background-color:#525252!important;border:none;border-right:1px solid #474747!important;height:24px;color:#FFFFFF;}#submitbutton{background-image:url("http://uni.res.nimg.jp/img/zero_index/theme/default/icon.png");background-position: -1px -2px;height:24px;width:28px;border:none;}div#siteHeader div#siteHeaderInner div.searchText div.clear-button{display:none!important;}</style>');

			$("#siteHeaderInner").append("<div id='head_search'><form id='head_search_form' method='get' target='_blank' action='http://www.nicovideo.jp/search/'><select id='selectsearch' name='selectsearch'><option value='word'>word</option><option value='tag'>tag</option></select><input id='bar_search' name='s' value='' type='text'><input name='submit' id='submitbutton' type='submit' value=''></form></div>");

			$("#selectsearch").change(function() {
				if($("#selectsearch").val()=="word"){
					$("#head_search_form").attr("action","http://www.nicovideo.jp/search/")
				}else if($("#selectsearch").val()=="tag"){
					$("#head_search_form").attr("action","http://www.nicovideo.jp/tag/")
				}
			});
		}
	}
	//プレイリストを開閉式に
	function playlisttoggle(){
		if( GM_getValue("playlisttoggle_on")=="on"){
		$("#playerNicoplayer").append("<a id='toggle'>Playlistの開閉</a>"); 

			$("#toggle").click(function(){
				$("#playlist").toggle();
				GM_setValue("playlistDisplay",$("#playlist").css("display"));
			});
			if(GM_getValue("playlistDisplay")=="none"){
				$("#playlist").hide();
			}
			$("head").append('<style type="text/css">#toggle{float:left!important;cursor:pointer;}</style>');
		}
	}
	//再生数等を上に移動3
	function infoCombine3(){
		if( GM_getValue("infocombine3")=="on"){
			var divimg=document.createElement("div");
			divimg.id="divimg";
			document.body.appendChild(divimg);
			$("#videoThumbnailImage").css("height","100px").appendTo("#divimg");
			$("#divimg").insertBefore(".videoDetailExpand h2");
			$("#videoInfoHead p:first-child").appendTo(".videoDetailExpand h2").addClass("toko");
			$(".videoHeaderTitle").appendTo(".videoDetailExpand h2");
			$("#videoStats .ranking").appendTo(".toko");
			$(".dicIcon").appendTo(".videoDetailExpand h2").css({"color":"#00BFFF","cursor":"pointer"});
			
			$("#userProfile,#videoInfo .videoMainInfoContainer .ch_prof").appendTo("#videoHeaderDetail");
			$(".usericon").css({"width":"100px","height":"100px","float":"left"});
			$("#videoStats").appendTo("#videoHeaderDetail");


			$("head").append('<style type="text/css">#divimg{float:left;}#videoTagContainer{float:left!important;margin-top:0!important;}#videoStats{float:right!important;height:48px!important;}#videoTagContainer .tagInner #tagEditContainer{padding-top:0!important;}#videoTagContainer .tagInner #tagEditContainer .tagAddButton input{height:18px!important;}#videoHeader{padding:0!important;}body #videoHeaderDetail{width:1008px!important;}body.size_normal #videoHeaderDetail{width:1234px!important;}#videoHeaderDetail h2{font-size:100%!important;float:left;margin-right:0!important;}.toko{font-weight:normal!important;line-height:1.3!important;}.videoHeaderTitle{font-size:18px!important;}.ranking{color:#666666!important;}body.size_medium .videoDetailExpand h2{padding-left:10px!important;width:450px!important;min-height:100px!important;}body.size_normal .videoDetailExpand h2{padding-left:15px!important;width:662px!important;height:100px!important;}.videoDetailExpand{width:592px!important;float:left!important;padding:0!important;margin-bottom:7px!important;}#videoMenuTopList{width:76px!important;padding-right:0!important;right:0!important;margin-top:0!important;}#videoDetailInformation{clear:both!important;}p.dicIcon span.dic.enable{background: url("http://res.nimg.jp/img/watch_zero/sprites/watch-s272f9b3d8b.png") no-repeat scroll 0 -3350px rgba(0, 0, 0, 0);}p.dicIcon span.dic.disable{background: url("http://res.nimg.jp/img/watch_zero/sprites/watch-s272f9b3d8b.png") no-repeat scroll 0 -3377px rgba(0, 0, 0, 0);}p.dicIcon{display:inline-block!important;}p.dicIcon span.dic{display:inline-block!important;text-indent:-9999px!important;width:17px!important;height:17px!important;}.arrow{display:none!important;}#videoHeader.menuOpened .videoMenuToggle{right:-76px!important;}#videoHeaderMenu{margin-top:0!important;}#videoHeader.menuOpened #videoHeaderDetail{margin-top:0px!important;}#videoHeaderDetail .videoDetailExpand{cursor:auto!important;}span.dicIcon{display:none!important;}.userIconContainer{width:110px!important;}.profile{margin-top:0px!important;}#siteHeaderInner .searchContainer .searchText{height:36px;padding:5px;margin-top:0;}#siteHeaderInner .searchContainer{display:block!important;position:relative;width:180px;float:left;}#siteHeader{height:36px!important;}.ch_prof{float: right !important;margin:0!important;background: transparent!important;padding:0!important;margin-bottom:7px!important;}.channel .ch_prof a.symbol{width:100px!important;}.channel .ch_prof a.symbol img{width:100px!important;height:100px!important;box-shadow:none!important;}.channel .ch_prof a.symbol:hover img{box-shadow:none!important;}.channel .ch_prof .info{padding:0 0 0 110px!important;}.ch_prof div.info p.bread{margin:0!important;}.channel .channelFavoriteLink{margin-bottom:0!important;}#userProfile .profile h4 a{padding-left:0!important;}#topVideoInfo div.userProfile{display:none!important;}#topVideoInfo div.videoMainInfoContainer .videoThumb,#topVideoInfo div.videoMainInfoContainer .infoHeadOuter,#topVideoInfo div.videoMainInfoContainer .videoInformation{display:none!important;}.userIconContainer a img{border:none!important;}.size_normal .videoDetailExpand{width:808px!important;}.videoMenuToggle{display:none !important;}#userProfile{float:right!important;margin-bottom:7px!important;}#videoTagContainer.default{width:671px!important;min-width:671px!important;}#videoTagContainer{float:left!important;margin-top:0!important;height:auto!important;}body.size_normal #videoTagContainer{width:808px!important;min-width:808px!important;}body.size_normal #videoTagContainer.dafault{width:808px!important;min-width:808px!important;}body.size_medium #videoMenuWrapper{left:592px!important;position:absolute!important;width:80px!important;}body.size_normal #videoMenuWrapper{left:818px!important;position:absolute!important;width:80px!important;}#topVideoInfo div.ch_prof{display:none!important;}#videoMenuWrapper{overflow:visible!important;position:absolute!important;left:592px!important;width:76px!important;}body.size_medium #videoTagContainer .tagInner #videoHeaderTagList{padding-left: 80px!important;}#videoHeader div.shortVideoInfo,#videoHeader div.toggleDetailExpand{display:none!important;}#videoStats *{font-size:14px!important;line-height:24px!important;}#videoStats span{padding-right:20px;float:right;}#videoStats{line-height:1.5;background-color:#FFFFFF!important;}#videoStats li{float:left!important;color:#444444!important;padding-left:5px;}#siteHeaderInner .searchContainer .searchText input{width:115px!important;}#siteHeaderInner .searchContainer .searchText{width:180px!important;background-color:#272727!important;border:none!important;}#siteHeaderInner .searchContainer .searchText a,#siteHeaderInner .searchContainer .searchText button,#siteHeaderInner .searchContainer .searchText input{background-color:#474747!important;color:#FFFFFF!important;border:none!important;}.searchContainer .searchText button{background:url("http://uni.res.nimg.jp/img/zero_index/theme/default/icon.png")!important;border:none!important;width:30px!important;}.searchContainer .searchText a.searchKeywordIcon{background:url("http://uni.res.nimg.jp/img/zero_my/search.png");background-position: -45px -28px;}.searchContainer .searchText a.searchTagIcon{background:url("http://uni.res.nimg.jp/img/zero_my/search.png");background-position: -149px -29px!important;}#siteHeaderInner .searchContainer .searchText a.searchKeywordIcon{width:23px!important;}.searchContainer .searchOption ul li.searchKeyword span{background:url("http://uni.res.nimg.jp/img/zero_my/search.png");background-position: -45px -28px;width:20px!important;}.searchContainer .searchOption ul li.searchTag span{background:url("http://uni.res.nimg.jp/img/zero_my/search.png");background-position: -149px -29px!important;width:20px!important;}body #content {margin-top:7px!important;}div#siteHeader div#siteHeaderInner div.searchText div.clear-button{display:none!important;}div.ch_breadcrumb{display:none!important;}#videoHeaderMenu .searchContainer{display:none!important;}.channelFavoriteLink, .favVideoOwner{height:auto!important;line-height:normal!important;margin:3px 0!important;}body.size_medium #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit{height:auto!important;width:60px!important;padding:4px 4px 3px 4px!important;}body.size_normal #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit{height:auto!important;width:80px!important;padding:4px 4px 3px 4px!important;}body.size_normal #videoTagContainer .tagInner #videoHeaderTagList{padding-left:100px!important;}#videoHeader.menuOpened #editorMenu{margin-top: 0!important;}#videoHeader.menuOpened .editor-menu{margin-top: 0px!important;}#videoHeader.menuClosed .editor-menu{margin-top: 0px!important;}#editorMenu{margin-top:0!important;}.channelFavoriteLink, .favVideoOwner{width:70%!important;}.channel .ch_prof h6{font-size:100%!important;}.ch_prof div.info p.bread{font-size:100%!important;line-height:1.2em!important;}.channelFavoriteLink, .favVideoOwner{line-height:22px!important;}#videoHeader.menuOpened .tvChanMenuHeightController{margin-top:0!important;}#videoMenuTopList li{display:block!important;}#videoTagContainer{padding-right:0!important;}</style>');

//旧マイリスボタンとか
$("head").append('<style type="text/css">#videoMenuTopList li.videoMenuList{font-size:0!important;}#videoMenuWrapper #videoMenuTopList li.videoMenuList a.mylistButton span{background-position:0 0!important;background-image:url("http://res.nimg.jp/img/watch/my_btn/mylist_1.png")!important;background-size:contain;}#videoMenuWrapper #videoMenuTopList li.videoMenuList a.defmylistButton span{background-position:0 0!important;background-image:url("http://res.nimg.jp/img/watch/my_btn/default_1.png")!important;background-size:contain;}#videoMenuWrapper #videoMenuTopList li.videoMenuList a.mylistButton span{width:75px!important;height:30px!important;}#videoMenuWrapper #videoMenuTopList li.videoMenuList a.defmylistButton span{width:75px!important;height:25px!important;}#videoMenuWrapper #videoMenuTopList li.videoMenuList{width:75px!important;height:30px!important;}</style>');
//その他のボタンは消す
$("head").append('<style type="text/css">#videoMenuTopList .uadButton,#videoMenuTopList .mymemoryButton,#videoMenuTopList .downloadButton,#videoMenuTopList .menuAward,#videoMenuTopList #speedChecker,#videoMenuTopList .userChannel,#videoMenuTopList li.videoMenuList.menuUad,#videoMenuTopList li.videoMenuList a.facebookButton,#videoMenuTopList li.videoMenuList a.twitterButton{display:none!important;width:0!important;height:0!important;}#videoMenuWrapper{height:auto!important;}#videoTagContainer{min-height:48px!important;}</style>');

//新しいマイリスボタンとかの方
//$("head").append('<style type="text/css">#videoMenuWrapper #videoMenuTopList li.videoMenuList.menuUad,#videoMenuWrapper #videoMenuTopList li.videoMenuList.mymemoryButton,#videoMenuWrapper #videoMenuTopList li.videoMenuList.userChannel{height:37px!important;width:37px!important;}#videoMenuTopList li.videoMenuList a span , #videoMenuTopList li.videoMenuList .button{width:37px!important;height:37px!important;border-radius: 5px;}</style>');

			$("#videoTitle").remove();
//			$("#videoHeaderMenu .searchContainer").appendTo("#siteHeaderInner");

			if( GM_getValue("infotocomepanel_on")=="on"　|| GM_getValue("spread_on")=="on"){
				$("head").append('<style type="text/css">body #videoHeaderDetail{width:1082px!important;}body.size_normal #videoHeaderDetail{width:1307px!important;}#userProfile{width:400px!important;}.profile{width:280px!important;}#videoStats{width:400px!important;}#videoStats li{width:190px!important;}.ch_prof{width:400px!important;}</style>');
			}else{
				$("head").append('<style type="text/css">body #videoHeaderDetail{width:1008px!important;}body.size_normal #videoHeaderDetail{width:1234px!important;}#userProfile{width:326px!important;}.profile{width:192px!important;}#videoStats{width:324px!important;}#videoStats li{width:150px!important;}.ch_prof{width:324px!important;}</style>');
			}

		}
	}

	//動画情報をコメントパネルに
	function infotocomepanel(){
		if( GM_getValue("infotocomepanel_on")=="on"){
			$("head").append('<style type="text/css">#playerAlignmentArea.size_medium{width:1082px!important;}#playerAlignmentArea.size_normal{width:1307px!important;}#playerTabWrapper{float:right!important;position:relative!important;width:400px!important;}#playerNicoplayer{float:left!important;}#commentDefault .commentTableContainer{width:100%!important;}#appliPanel{display:none!important;}.area-JP .panel_ads_shown #playerTabContainer.has_panel_ads .playerTabAds{display:none!important;}#kirikae1{line-height: 52px!important;float:right;cursor:pointer;position:relative;z-index:999999;text-align:center!important;}#videoComment h4{display:none!important;}#hiddenUserProfile,.mymemory,div.videoInformation span.community{display:none;}body.size_medium #videoInfo{border:none!important;text-align:left!important;border-bottom:none!important;padding-top:10px!important;height:394px!important;overflow-y:scroll!important;overflow-x:hidden!important;}body.size_normal #videoInfo{border:none!important;text-align:left!important;border-bottom:none!important;padding-top:15px!important;height:485px!important;overflow-y:scroll!important;}#bottomVideoDetailInformation .triger {background: transparent!important;}#videoInfoHead{margin:0!important;}#videoInfo .videoMainInfoContainer{border-bottom:none!important;}#videoInfo .videoEditMenu{margin:0!important;padding:0!important;}#videoInfoHead,#videoShareLinks,#bottomVideoDetailInformation,.parentVideoInfo,.videoEditMenu,.blogLinks{padding-left:7px!important;width:370px!important;}#appliPanel{height:0!important;}div#topVideoInfo.videoInfo p.videoDescription{width:auto!important;}span.dicIcon{display:none!important;}#topVideoInfo .videoDescriptionHeader,#videoDetailInformation .description{display:none!important;}#topVideoInfo .videoMainInfoContainer{display:none!important;}#videoDetailInformation,.arrow{display:none!important;}#kirikae1{-moz-box-sizing:border-box;background-color: #CCCCCC;border-left:1px solid #333333;color:#666666;cursor:pointer;font-weight:bold;border-bottom:1px solid #000000;height:52px;width:121px;}#kirikae1.active{background-color: #F4F4F4;color:#333333;cursor: default;border-bottom:medium none;height:50px;}.player-panel-tabs .player-tab-header .player-tab-item{height:50px!important;}#bottomVideoDetailInformation .trigger{background:transparent!important;}#videoHeader div.shortVideoInfo,#videoHeader div.toggleDetailExpand{display:none!important;}body.size_normal #videoHeader{width:1307px!important;}body.size_medium #videoHeader{width:1082px!important;}#videoComment{border-bottom: 1px solid #CCCCCC !important;margin-left:8px!important;width:365px!important;padding-bottom:15px!important;margin-bottom:0!important;}#videoComment .videoDescription{line-height:1.5em!important;}#playerTabContainer .player-tab-content{top:50px!important;}#commentLog div.commentTableContainer{width:100%!important;}#commentToolTip{width:200px!important;}span.message{display:block!important;white-space:normal!important;word-wrap:break-word!important;}.ch_prof{width:400px !important;}#videoInfoHead div.infoHeadOuter p{width:100%!important;}.player-panel-tabs .player-tab-content{padding:5px 0 0 0!important;}#videoInfo .videoMainInfoContainer{margin-bottom:2px!important;}.player-panel-tabs .panel-grid{border:none!important;}div.player-tab-content #videoInfo .parentVideoInfo{padding-top:10px!important;border-top:1px solid #ccc!important;}div.player-tab-content #videoShareLinks{padding-top:10px!important;border-top:1px solid #ccc!important;}#playerTabContainer.has_panel_ads{height:100%!important;}</style>');

			$("#videoInfo").appendTo("#playerTabContainer div.player-tab-content");
			$("#bottomVideoDetailInformation").appendTo("#videoInfo .videoMainInfoContainer");
			$("#videoInfo .parentVideoInfo").appendTo("#videoInfo .videoMainInfoContainer");
			$("#videoShareLinks").appendTo("#videoInfo .videoMainInfoContainer");

			var kirikae1=document.createElement("div");
			kirikae1.id="kirikae1";
			kirikae1.innerHTML="動画説明文";
			document.body.appendChild(kirikae1);
			$("#kirikae1").appendTo("#playerTabContainer thead.player-tab-header tr");
				$("#videoInfo").css("display","none");

			$("#kirikae1").click(function() {
				$("#playerTabContainer .player-tab-content .comment,#playerTabContainer .player-tab-content .ng").removeClass("active");
				$("#playerTabContainer .player-tab-header .comment,#playerTabContainer .player-tab-header .ng").removeClass("active");
				$("#videoInfo").css("display","block");
				$("#kirikae1").addClass("active");
			});

			$("#playerTabContainer .player-tab-header th.comment").click(function() {
				$("#playerTabContainer .player-tab-header .ng,#kirikae1").removeClass("active");
				$("#playerTabContainer .player-tab-content .ng").removeClass("active");
				$("#videoInfo").css("display","none");
				$("#playerTabContainer .player-tab-content .comment,#playerTabContainer .player-tab-header .comment").addClass("active");
			});

			$("#playerTabContainer .player-tab-header th.ng").click(function() {
				$("#playerTabContainer .player-tab-header .comment,#kirikae1").removeClass("active");
				$("#playerTabContainer .player-tab-content .comment").removeClass("active");
				$("#videoInfo").css("display","none");
				$("#playerTabContainer .player-tab-header .ng,#playerTabContainer .player-tab-content .ng").addClass("active");
			});


var timerID = setInterval( 
	function(){
		if(document.getElementById("playerTabContainer").getElementsByClassName("comment-panel")[0].getElementsByClassName("grid-canvas")[0].style.height!="0px"){

			setTimeout(function(){
				$("#kirikae1").click();
				
				clearInterval(timerID);
				timerID = null;
			},1000);
		}
	},1000);


			if( GM_getValue("infocombine3")=="off"){
				$("head").append('<style type="text/css">#videoStats{clear:both!important;margin-bottom:10px!important;}#videoStats li{margin-top:10px!important;}p.dicIcon span.dic.enable{background: url("http://res.nimg.jp/img/watch_zero/sprites/watch-s272f9b3d8b.png") no-repeat scroll 0 -3350px rgba(0, 0, 0, 0);}p.dicIcon span.dic.disable{background: url("http://res.nimg.jp/img/watch_zero/sprites/watch-s272f9b3d8b.png") no-repeat scroll 0 -3377px rgba(0, 0, 0, 0);}p.dicIcon{display:inline-block!important;}p.dicIcon span.dic{display:inline-block!important;text-indent:-9999px!important;width:17px!important;height:17px!important;}#userProfile{margin-left:10px!important;width:360px!important;}#videoInfo #userProfile .profile{width:200px!important;}#videoInfo div.videoMainInfoContainer div.ch_prof{margin-left:10px!important;width:360px!important;padding:0!important;}#videoHeaderDetail,#videoTagContainer{width:740px!important;}body #videoTagContainer{min-width:700px!important;}#videoTagContainer{padding-right:10px!important;}</style>');
			}
		
		}
	}




	function labelElement(str,che){
		var k = document.createElement("label");
		k.innerHTML = str;
		k.style.cursor = "hand";
		k.setAttribute("for",che);
		k.style.lineHeight = "1.5em";
		k.style.fontSize = "16px";
		return k;
	}

	function interface_kidoku(){
		var prefDiv = document.createElement("div");
			prefDiv.style.width = "500px";
			prefDiv.style.height = "400px";
			prefDiv.style.overflowY = "scroll";
			prefDiv.innerHTML = "カスタマイズ設定" + "<br>";
			prefDiv.style.backgroundColor = "#ccccff";
			prefDiv.style.color = "black";
			prefDiv.style.border = "1px solid #888";
			prefDiv.style.position = "fixed";
			prefDiv.style.bottom = "0px";
			prefDiv.style.right = "0px";
			prefDiv.style.margin = "0 0 0 0";
			prefDiv.style.zIndex = 999999;
			prefDiv.id = "prefDiv";
			document.body.appendChild(prefDiv);

		var memo=document.createElement("div");
		memo.setAttribute("class", "bunrui");
		memo.innerHTML = "【併用時にレイアウトが崩れやすい項目】" ;
		var memo2=document.createElement("div");
		memo2.setAttribute("class", "bunrui");
		memo2.innerHTML = "【まずはわかりやすい設定項目】";
		var memo3=document.createElement("div");
		memo3.setAttribute("class", "bunrui");
		memo3.innerHTML = "【若干細かい設定1】";
		var memo4=document.createElement("div");
		memo4.setAttribute("class", "bunrui");
		memo4.innerHTML = "【特殊設定項目】";
		var memo5=document.createElement("div");
		memo5.setAttribute("class", "bunrui");
		memo5.innerHTML = "【オススメ設定項目】";
		var memo6=document.createElement("div");
		memo6.setAttribute("class", "bunrui");
		memo6.innerHTML = "【若干細かい設定2】";
		$("head").append('<style type="text/css">div.bunrui{font-size:20px;padding:5px 0 5px 0;margin:20px 0 10px 0;background-color:#FFFFFF;border-bottom:1px solid #CCC;}</style>');
		
		var tojiru=document.createElement("div");
		tojiru.innerHTML = "閉じる";
		tojiru.style.position = "absolute";
		tojiru.style.top = "0px";
		tojiru.style.right = "5px";
		tojiru.style.color="#00BFFF";
		tojiru.style.cursor = "pointer";
		tojiru.id="tojiru";

		var reset00=document.createElement("div");
		reset00.innerHTML = "リセット";
		reset00.style.position = "absolute";
		reset00.style.right = "5px";
		reset00.style.color="#00BFFF";
		reset00.style.cursor = "pointer";
		reset00.id="reset00";
		reset00.addEventListener("click",function(e){

		var settings = document.getElementById("prefDiv").getElementsByTagName("input");
		for (var i=0;i<settings.length;i++){
			settings[i].checked=false;
		}
		for (var i=0;i<links.length;i++){
			GM_setValue(links[i].name,"off");
		}

		},false);


		var linkdelminidic = document.createElement("input");
			linkdelminidic.name = "delminidic";
			linkdelminidic.caption = "もっと見るで簡易大百科を消去";
		var linkdeluserad = document.createElement("input");
			linkdeluserad.name = "deluserad";
			linkdeluserad.caption = "もっと見るでユーザー広告を消去";
		var linkbackblack = document.createElement("input");
			linkbackblack.name = "backblack";
			linkbackblack.caption = "背景黒モード(※適当です)";
		var linktagtoggle = document.createElement("input");
			linktagtoggle.name = "tagtoggle";
			linktagtoggle.caption = "タグを開閉式に(若干のネタバレ回避)";
		var linkwalliconoff = document.createElement("input");
			linkwalliconoff.name = "walliconoff";
			linkwalliconoff.caption = "ウォールのアイコンだけを消去";
		var linktagpinon = document.createElement("input");
			linktagpinon.name = "tagpinon";
			linktagpinon.caption = "タグのピンを常時表示(ピン留め後は不要な設定。プレイヤーがグラグラ動く人はピン留めをお願いします。)";
		var linkwalloff = document.createElement("input");
			linkwalloff.name = "walloff";
			linkwalloff.caption = "ウォールを消去";
		var linkdeltagpin = document.createElement("input");
			linkdeltagpin.name = "deltagpin";
			linkdeltagpin.caption = "タグのピンを消去(ピン留め後ピンを解除しない人で、ピンが邪魔な人向け)";
		var linkbigwatch = document.createElement("input");
			linkbigwatch.name = "bigwatch";
			linkbigwatch.caption = "プレイヤーサイズを大きく(大画面時のみ)";
		var linkdelsocial = document.createElement("input");
			linkdelsocial.name = "delsocial";
			linkdelsocial.caption = "ツイートボタン等消去";
		var linkdelshosai = document.createElement("input");
			linkdelshosai.name = "delshosai";
			linkdelshosai.caption = "動画詳細情報消去";
		var linkdelbuttons = document.createElement("input");
			linkdelbuttons.name = "delbuttons";
			linkdelbuttons.caption = "マイリス・とりあえずマイリスボタン以外消去";
		var linkctree = document.createElement("input");
			linkctree.name = "ctree_off";
			linkctree.caption = "コンテンツツリー消去";
		var linkdeljosdes = document.createElement("input");
			linkdeljosdes.name = "deljosdes";
			linkdeljosdes.caption = "下の動画説明文・情報を消去(上の開閉で読む人向け)";
		var linkSen2 = document.createElement("input");
			linkSen2.name = "senden2";
			linkSen2.caption = "広告を消去";
		var linkmarq = document.createElement("input");
			linkmarq.name = "marquee_off";
			linkmarq.caption = "動画上のニュースを消去";
		var linkfeed = document.createElement("input");
			linkfeed.name = "feedback_off";
			linkfeed.caption = "フィードバックリンクを消去";
		var linkinfo = document.createElement("input");
			linkinfo.name = "infoplus";
			linkinfo.caption = "もっと見るでマイリスコメント？を常時表示";
		var linkreview = document.createElement("input");
			linkreview.name = "review_off";
			linkreview.caption = "レビュー欄消去";
		var linkichiba = document.createElement("input");
			linkichiba.name = "ichiba_off";
			linkichiba.caption = "市場消去";
		var linktv = document.createElement("input");
			linktv.name = "tvchan_off";
			linktv.caption = "マイリスボタン常時表示";
		var linkspread = document.createElement("input");
			linkspread.name = "spread_on";
			linkspread.caption = "コメント一覧の幅を広げる";
		var linkleft = document.createElement("input");
			linkleft.name = "left_on";
			linkleft.caption = "左寄せにする";
		var linklist = document.createElement("input");
			linklist.name = "playlist_off";
			linklist.caption = "プレイリストを消去";
		var linkmotto = document.createElement("input");
			linkmotto.name = "motto_off";
			linkmotto.caption = "もっと見るバーを消去";
		var linkwideichiba = document.createElement("input");
			linkwideichiba.name = "wideichiba_on";
			linkwideichiba.caption = "市場の幅を広く(要レビュー消去)";
		var linkinfonontoggle = document.createElement("input");
			linkinfonontoggle.name = "infonontoggle_on";
			linkinfonontoggle.caption = "動画詳細情報を常時表示に";
		var linkfootcut = document.createElement("input");
			linkfootcut.name = "footer_off";
			linkfootcut.caption = "フッター消去";
		var linkinfo33 = document.createElement("input");
			linkinfo33.name = "infocombine3";
			linkinfo33.caption = "サムネ・再生数・投稿者サムネ等を上に移動(旧マイリスボタンを常時表示/その他ボタン消去/検索ボックス消去)(マイリスボタン常時表示と併用不可。)";
		var linkoldsearch = document.createElement("input");
			linkoldsearch.name = "oldsearch_on";
			linkoldsearch.caption = "旧検索をヘッダーに追加(↓と併用不可)";
		var linkoldsearch2 = document.createElement("input");
			linkoldsearch2.name = "oldsearch2";
			linkoldsearch2.caption = "旧検索をコメント欄内動画説明文に追加";
		var linkplaylisttoggle = document.createElement("input");
			linkplaylisttoggle.name = "playlisttoggle_on";
			linkplaylisttoggle.caption = "プレイリストを開閉式に";
		var linkminiichiba = document.createElement("input");
			linkminiichiba.name = "miniichiba_on";
			linkminiichiba.caption = "市場の商品画像等を小さく";
		var linkkometoggle = document.createElement("input");
			linkkometoggle.name = "komepaneltoggle_on";
			linkkometoggle.caption = "コメントパネルを開閉式に";
		var linkwideon = document.createElement("input");
			linkwideon.name = "wideon";
			linkwideon.caption = "コメントパネル閉じた時、ワイドに(要ニュース消去・プレイヤーを大きくと併用不可。)";
		var linkreviewtoggle = document.createElement("input");
			linkreviewtoggle.name = "reviewtoggle_on";
			linkreviewtoggle.caption = "レビューを開閉式に";
		var linkichibatoggle = document.createElement("input");
			linkichibatoggle.name = "ichibatoggle_on";
			linkichibatoggle.caption = "市場を開閉式に";
		var linkdelkomesocial = document.createElement("input");
			linkdelkomesocial.name = "delkomesocial";
			linkdelkomesocial.caption = "コメント欄のソーシャルボタンを消す";
		var linkdelsearchbox = document.createElement("input");
			linkdelsearchbox.name = "delsearchbox";
			linkdelsearchbox.caption = "右上の検索ボックスを消す";
		var linkheadertoggle = document.createElement("input");
			linkheadertoggle.name = "headertoggle";
			linkheadertoggle.caption = "ヘッダーを開閉式に(ヘッダーの上部をクリックで開閉)(ヘッダー追従不可)";
		var linktargetblank = document.createElement("input");
			linktargetblank.name = "targetblank";
			linktargetblank.caption = "タグクリック等時に別タブで開く";
		var linktargetself = document.createElement("input");
			linktargetself.name = "targetself";
			linktargetself.caption = "タグクリック等時に同じタブで開く";
		var linkinfotocomepanel = document.createElement("input");
			linkinfotocomepanel.name = "infotocomepanel_on";
			linkinfotocomepanel.caption = "動画情報をコメント一覧に(※コメント一覧の幅も広くなります/※上の説明文を開かないでください)";

		var form = document.createElement("form");

		var links = 
			[linkSen2,linkmarq,linkfeed,linkinfo,linkreview,linkichiba,linktv,linkspread,linkleft,linklist,linkmotto,linkwideichiba,linkinfonontoggle,linkfootcut,linkoldsearch,linkplaylisttoggle,linkinfo33,linkminiichiba,linkreviewtoggle,linkichibatoggle,linkinfotocomepanel,linkdeljosdes,linkctree,linkdelbuttons,linkdelshosai,linkdelsocial,linkbigwatch,linkdeltagpin,linkwalloff,linktagpinon,linkwalliconoff,linktagtoggle,linkbackblack,linkdeluserad,linkdelminidic,linkdelkomesocial,linktargetblank,linktargetself,linkkometoggle,linkwideon,linkdelsearchbox,linkheadertoggle,linkoldsearch2];

		for (var i=0;i<links.length;i++){
				links[i].type = "checkbox";
				links[i].defaultValue = "off";
		}

		for (var i=0;i<links.length;i++){
			if (!GM_getValue(links[i].name)) {
				GM_setValue(links[i].name, links[i].defaultValue);
			}
				links[i].id = links[i].name;
				links[i].checked = (GM_getValue(links[i].name) != "on") ? false : true;
				links[i].addEventListener("click", function(e){
					GM_setValue(this.name, (GM_getValue(this.name) != "on") ? "on" : "off");
				}, true);
		}



		//登録
		form.appendChild(tojiru);
		form.appendChild(document.createElement("hr"));
		form.appendChild(memo2);
		form.appendChild(linkSen2);
		form.appendChild(labelElement(linkSen2.caption, linkSen2.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkmarq);
		form.appendChild(labelElement(linkmarq.caption, linkmarq.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkfeed);
		form.appendChild(labelElement(linkfeed.caption, linkfeed.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkwalloff);
		form.appendChild(labelElement(linkwalloff.caption, linkwalloff.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkwalliconoff);
		form.appendChild(labelElement(linkwalliconoff.caption, linkwalliconoff.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelkomesocial);
		form.appendChild(labelElement(linkdelkomesocial.caption, linkdelkomesocial.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkheadertoggle);
		form.appendChild(labelElement(linkheadertoggle.caption, linkheadertoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkfootcut);
		form.appendChild(labelElement(linkfootcut.caption, linkfootcut.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkreview);
		form.appendChild(labelElement(linkreview.caption, linkreview.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkichiba);
		form.appendChild(labelElement(linkichiba.caption, linkichiba.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linklist);
		form.appendChild(labelElement(linklist.caption, linklist.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkmotto);
		form.appendChild(labelElement(linkmotto.caption, linkmotto.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelsearchbox);
		form.appendChild(labelElement(linkdelsearchbox.caption, linkdelsearchbox.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkreviewtoggle);
		form.appendChild(labelElement(linkreviewtoggle.caption, linkreviewtoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkichibatoggle);
		form.appendChild(labelElement(linkichibatoggle.caption, linkichibatoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkplaylisttoggle);
		form.appendChild(labelElement(linkplaylisttoggle.caption, linkplaylisttoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linktagtoggle);
		form.appendChild(labelElement(linktagtoggle.caption, linktagtoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkkometoggle);
		form.appendChild(labelElement(linkkometoggle.caption, linkkometoggle.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(memo5);
		form.appendChild(linkinfo33);
		form.appendChild(labelElement(linkinfo33.caption, linkinfo33.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkinfotocomepanel);
		form.appendChild(labelElement(linkinfotocomepanel.caption, linkinfotocomepanel.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(memo3);
		form.appendChild(linkspread);
		form.appendChild(labelElement(linkspread.caption, linkspread.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linktv);
		form.appendChild(labelElement(linktv.caption, linktv.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelbuttons);
		form.appendChild(labelElement(linkdelbuttons.caption, linkdelbuttons.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkwideichiba);
		form.appendChild(labelElement(linkwideichiba.caption, linkwideichiba.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkminiichiba);
		form.appendChild(labelElement(linkminiichiba.caption, linkminiichiba.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linktargetblank);
		form.appendChild(labelElement(linktargetblank.caption, linktargetblank.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linktargetself);
		form.appendChild(labelElement(linktargetself.caption, linktargetself.id));
		form.appendChild(memo6);
		form.appendChild(linkctree);
		form.appendChild(labelElement(linkctree.caption, linkctree.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelshosai);
		form.appendChild(labelElement(linkdelshosai.caption, linkdelshosai.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkinfonontoggle);
		form.appendChild(labelElement(linkinfonontoggle.caption, linkinfonontoggle.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelsocial);
		form.appendChild(labelElement(linkdelsocial.caption, linkdelsocial.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkbackblack);
		form.appendChild(labelElement(linkbackblack.caption, linkbackblack.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdeljosdes);
		form.appendChild(labelElement(linkdeljosdes.caption, linkdeljosdes.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkoldsearch);
		form.appendChild(labelElement(linkoldsearch.caption, linkoldsearch.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkoldsearch2);
		form.appendChild(labelElement(linkoldsearch2.caption, linkoldsearch2.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkinfo);
		form.appendChild(labelElement(linkinfo.caption, linkinfo.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdeluserad);
		form.appendChild(labelElement(linkdeluserad.caption, linkdeluserad.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelminidic);
		form.appendChild(labelElement(linkdelminidic.caption, linkdelminidic.id));
		form.appendChild(memo4);
		form.appendChild(linktagpinon);
		form.appendChild(labelElement(linktagpinon.caption, linktagpinon.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdeltagpin);
		form.appendChild(labelElement(linkdeltagpin.caption, linkdeltagpin.id));
		form.appendChild(memo);
		form.appendChild(linkleft);
		form.appendChild(labelElement(linkleft.caption, linkleft.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkbigwatch);
		form.appendChild(labelElement(linkbigwatch.caption, linkbigwatch.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkwideon);
		form.appendChild(labelElement(linkwideon.caption, linkwideon.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createElement("br"));
		form.appendChild(reset00);


		prefDiv.appendChild(form);


		var customsettei = document.createElement("a");
		customsettei.innerHTML = "カスタマイズ設定";
		customsettei.id = "zero";

		document.getElementById("siteHeaderRightMenuContainer").appendChild(customsettei);

		$("#zero").click(function(){
			$("#prefDiv").animate(
				{width:"toggle",height:"toggle",opacity:"toggle"},
				"slow"
			);
			setTimeout(function(){
				GM_setValue("prefDisplay",$("#prefDiv").css("display"));
			},1000);
		});
		if(GM_getValue("prefDisplay","block")=="none"){
			$("#prefDiv").hide();
		};

		$("#tojiru").click(function(){
			$("#prefDiv").animate(
				{width:"hide",height:"hide",opacity:"hide"},
				"slow"
			);
			setTimeout(function(){
				GM_setValue("prefDisplay",$("#prefDiv").css("display"));
			},1000);
		});
		if(GM_getValue("prefDisplay","block")=="none"){
			$("#prefDiv").hide();
		};

		$("head").append('<style type="text/css">#zero{margin-left:15px;color:#000000!important;cursor:pointer;}span[style="font-size: 45px;line-height:1.1;"],span[style="font-size: 90px;line-height:1.1;"],span[style="font-size: 60px;line-height:1.1;"],span[style="font-size: 36px;line-height:1.1;"],span[style="font-size: 30px;line-height:1.1;"]{font-size:18px!important;}#siteHeader #siteHeaderInner{width:98%!important;max-width:none!important;min-width:none!important;}.socialLinks .socialLinkTwitter,.socialLinks .socialLinkFacebook{width:150px!important;}.socialLinks .socialLinkFacebook .facebook{width:140px!important;}#siteHeaderNotificationPremium{display:none!important;}#videoTagContainer .tagInner #videoHeaderTagList li.videoHeaderTag a{color:#292F2F !important;}#videoTagContainer .tagInner #videoHeaderTagList li{margin-bottom:1px!important;text-decoration: underline!important;}#videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit{height:auto!important;}#videoTagContainer .tagInner #videoHeaderTagList li .tagControlContainer, #videoTagContainer .tagInner #videoHeaderTagList li .tagControlEditContainer{padding:0 4px 0 0!important;}#ichibaMain .itemname a {color: #4A6EBC!important;}.videoStart #nicoplayerContainer #nicoplayerContainerInner{top:0!important;}#siteHeader #siteHeaderInner ul li a.siteHeaderPoint small{display:none!important;}body.full_with_browser #playerAlignmentArea.size_normal #playerNicoplayer, #playerAlignmentArea.size_normal #external_nicoplayer{width:100%!important;}body.full_with_browser #playerAlignmentArea{width:100%!important;}#videoInformationWrapper{display:none!important;}#bottomContentTabContainer #outline .outer .main #videoInfo,body .outer{width:1008px;}#ichibaMainLogo,#ichibaMainHeader{display:none!important;}#ichibaMain #ichibaMainFooter .commandArea{text-align:left!important;}#outline{padding-top:15px!important;}#outline{background-color:#F3F3F3!important;}#ichibaMain #ichibaMainFooter .info,#ichibaMain #ichibaMainFooter .associate{display:none!important;}#ichibaMain #ichibaMainFooter{min-height:0!important;}#ichibaMain p.noItem{margin:30px auto!important;}#videoTagContainer .tagInner #videoHeaderTagList li{margin-right:16px!important;}</style>');


		if(GM_getValue("ctree_off")=="off" && $("#outline").attr("class")=="wrapper commonsTreeExists"){
			$("head").append('<style type="text/css">#videoInfo .parentVideoInfo{display:block!important;}</style>');
		};

//ユーザーアイコンがあるかどうかチェック
			var iconcheck = $("#userProfile a.userIconLink").attr("href");
			if(iconcheck==""){
				$("#userProfile").css("display","none");
			}





	}

interface_kidoku();
infotocomepanel();
senCut2();
marqueeCut();
feedbackCut();
infoPlus();
reviewCut();
ichibaCut();
tvchanCut();
komespread();
hidariyose();
playlistCut();
mottoCut();
wideichiba();
infonontoggle();
oldsearch();
footcut();
playlisttoggle();
infoCombine3();
miniichiba();
ichibatoggle();
reviewtoggle();
deljosdes();
ctreeCut();
delbuttons();
delshosai();
delsocial();
bigwatch();
deltagpin();
walloff();
tagpinon();
walliconoff();
tagtoggle();
backblack();
deluserad();
delminidic();
delkomesocial();
targetblank();
targetself();
komepaneltoggle();
wideon();
delsearchbox();
headertoggle();
oldsearch2();

};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);
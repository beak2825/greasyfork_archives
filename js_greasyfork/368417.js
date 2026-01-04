// ==UserScript==
// @name          css-巴哈姆特深色主題 - 首頁、登入畫面
// @namespace     hbl917070
// @description	  巴哈姆特深色主題 - 首頁、登入畫面
// @author        hbl917070(深海異音)
// @homepage      https://home.gamer.com.tw/homeindex.php?owner=hbl917070
// @include       https://www.gamer.com.tw/
// @include       https://www.gamer.com.tw/index*
// @include       https://user.gamer.com.tw/login.php
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @version       0.18
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/368417/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C%20-%20%E9%A6%96%E9%A0%81%E3%80%81%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/368417/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C%20-%20%E9%A6%96%E9%A0%81%E3%80%81%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2.meta.js
// ==/UserScript==

/*
標題：css-巴哈姆特深色主題 - 首頁、登入畫面
範圍：首頁、登入畫面
最後修改日期：2022 / 08 / 03
作者：hbl917070（深海異音）
說明：https://forum.gamer.com.tw/C.php?bsn=60076&snA=2621599

預設背景圖片來源：https://www.pixiv.net/member_illust.php?mode=medium&illust_id=61945737
*/

/**
 * 2022/08/03：修復區塊與文字顏色錯誤
 * 2022/01/19：修復文字顏色錯誤
 * 2021/05/19：修復使用阻擋廣告的軟體導致腳本失效的問題
 * 2019/09/17：修復通知顏色
 *
 */

(function () {
	// ▼ ▼ ▼ 這裡的設定可以修改 ▼ ▼ ▼

	var 背景圖片網址 = "https://i.imgur.com/d5fXfwG.jpg";

	var 背景圖片上面的漸層顏色 =
		"linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

	// ▲ ▲ ▲ 這裡的設定可以修改 ▲ ▲ ▲

	//-----------------------

	//設定技巧

	//背景圖片網址：
	//輸入「圖片網址」或「base64」，圖片大小盡量不要使用超過500k，不然可能會造成網頁lag
	//可以把要使用的圖片上傳的imgur。https://imgur.com/
	//或是把圖片透過DataURL.net轉換成bese64格式。http://dataurl.net/#dataurlmaker

	//背景圖片上面的漸層顏色：
	//deg：代表漸層的角度，所以「90deg」就是「水平由左至右」
	//角度後面有兩個rgba()：第一個是漸層的起始的顏色，第二個是漸層結束的顏色
	//rgba() 後面的 0% 跟 100%：就是起始跟結尾的意思，基本上不用修改
	//rgba 四個參數分別是 (紅, 綠, 藍, 透明度)
	//rgba(255,255,255,1) = 白色
	//rgba(0,0,0,1) =       黑色
	//rgba(255,0,0,1) =     紅色
	//rgba(0,0,0, 0.3) =    30%透明的黑色
	//rgba(0,0,0,0) =       完全透明

	//如果不想用背景圖片可以兩個rgba都輸入 rgba(45,45,45,1)

	//-----------------------------------

	var css = "";
	var url = document.location.href;

	/**
	 *
	 * @param {*} url
	 * @param {*} callback
	 */
	function toDataURL(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			var reader = new FileReader();
			reader.onloadend = function () {
				callback(reader.result);
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open("GET", url);
		xhr.responseType = "blob";
		xhr.send();
	}

	if (
		url.indexOf("https://www.gamer.com.tw/index") === 0 ||
		url == "https://www.gamer.com.tw/"
	) {
		css = `/*
*
*
*標題：css-巴哈姆特-深色主題（首頁）
*
*最後修改日期：2022 / 08 / 03
*作者：HBL917070（深海異音）
*作者小屋：https://home.gamer.com.tw/homeindex.php?owner=hbl917070
*
*
*/

body {
  /*背景圖片，修改【url()裡面的網址即可】*/
  background-image: bac_img_color, url(bac_img_url) !important;
  background-attachment: fixed !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-color: rgba(45, 45, 45, 1) !important;
}

/*下面的推薦文章*/
#rivers figure {
  background: rgba(45, 45, 45, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*標題顏色*/
#rivers figcaption a {
  color: #8edbff;
}
/*右上角通知圖示的顏色 2018-05-23*/
.BA-top .TOP-btn a::before {
  color: #fff !important;
}
.BA-top .TOP-my ul li a::before {
  color: #fff !important;
}

/*縮小廣告 2017/05/15 */
/*#flyRightBox div {
  transform: scale(0.3);
  transition: 0.3s transform;
}*/

#flyRightBox div:hover {
  transform: scale(1);
}

/*2018/02/15、關掉新年特效*/
.BA-topbg::after {
  background: none !important;
  background-image: none !important;
}

/*文字預設的顏色*/
#BH-background {
  color: #fff !important;
}

/* 上面【我要登入、註冊】*/
.TOP-my a {
  color: #fff !important;
}

/*--------------------------------------------------------------*/

/*所有超連結*/

[href]:hover {
  /*超連結*/
  color: #87dfff !important;
}
/*--------------------------------------------------------------*/

/*哈哈姆特通知的顏色 2019-03-26 */
.im_bhtop-user-name {
  color: #87dfff !important;
}
.im_bhtop-message-summary {
  color: #fff !important;
}
#topBarHahamut .im_bhtop-msg-item {
  border: none !important;
  border-top: none !important;
}

/*--------------------------------------------------------------*/

/*2019-09-16 【通知視窗】*/

/*最上面的通知*/
.BA-topbg {
  background: none !important;
  background-color: rgba(45, 45, 45, 0.4) !important;
}
.BA-menu a {
  color: #fff;
}

/*避免指過去是文字顏色不清楚*/
.BA-menu li a:hover {
  background-color: rgba(0, 0, 0, 0) !important;
  color: #87dfff !important;
  border: 1px solid #87dfff !important;
}

/*最上面那條（通知、訂閱、推薦）*/
.TOP-bh {
  background-color: rgba(0, 0, 0, 1) !important;
  background: rgba(0, 0, 0, 1) !important;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
}
#BH-menu-path {
  background-color: rgba(0, 0, 0, 0) !important;
}

/*哈啦區    場外休憩區    文章列表    精華區    板規    水桶*/
.BH-menuE a:link,
.BH-menuE a {
  color: #fff !important;
  opacity: 1 !important;
}
/*滑鼠移入時顯示的選單*/
.dropList a {
  background-color: rgba(0, 0, 0, 0.9) !important;
}

/*底下滑動的光條*/
#navBarHover {
  background: #117e96 !important;
  box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0) !important;
  border: none !important;
}

/*刪除多餘的垂直線*/
.TOP-btn {
  border-right: none !important;
}
/*刪除多餘的垂直線*/
.TOP-my ul > li {
  border: none !important;
}
/*統一右上角按鈕為白色圖示*/
.TOP-btn a::before {
  color: #fff !important;
}
/*統一右上角通知按鈕的寬度*/
.TOP-btn a {
  width: 30px !important;
}
/*右上角的按鈕，在第三個按鈕加入一個垂直分割線*/
.TOP-btn {
  border-right: 1px solid rgba(255, 255, 255, 0.4);
}

/*整體*/
.TOP-msg {
  background-color: rgba(45, 45, 45, 0.9) !important;
  color: #fff !important;
  border: 2px solid #249db8 !important;
}
.TOP-msg span {
  background-color: rgba(0, 0, 0, 0) !important;
  color: #fff;
}
.TOP-msglist {
  background: none !important;
  background-color: none !important;
}
.TOP-msglist div:hover,
.TOP-msglist a:hover {
  /*移到上面時*/
  background-color: rgba(45, 45, 45, 0.95) !important;
}

/*通知 項目的分界線*/
.TOP-msglist div {
  background-color: rgba(0, 0, 0, 0) !important;
  color: #fff;
}
.TOP-msg .new {
  /*新通知*/
  background-color: rgba(50, 100, 80, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.TOP-msgpic {
  /*圖片底色*/
  background-color: rgba(0, 0, 0, 0) !important;
}
.TOP-msgbtn {
  /*最下面那條*/
  background-color: rgba(0, 0, 0, 0) !important;
  border-top: 2px solid #249db8 !important;
}

.TOP-msglist a.msg-ellipsis {
  display: block !important;
}

/*通知項目的標題顏色*/
.TOP-msglist a .link,
.TOP-msglist > div.new .link {
  color: #87dfff !important;
}

/*把右邊黑色的鈴鐺圖示變成白色*/
.TOP-msglist a.msg-ellipsis img {
  -webkit-filter: invert(1);
}

/*通知的顏色，統一為白色*/
.TOP-btn a.topb1::before {
  background-image: url("https://i2.bahamut.com.tw/navicon_notification_active.png") !important;
}

/*通知-訂閱 作者顏色*/
.TOP-msglist a .msgname {
  color: #87dfff !important;
}

/*通知的icon顏色*/
#topBarMsgList_light_0 .TOP-msgpic img {
  /*灰階*/
  filter: grayscale(100%);
  /*影像堆疊方式*/
  mix-blend-mode: hard-light;
}

/*超連結顏色(標題前後的文字)*/
.TOP-msg [href] {
  color: #fff !important;
}

/*我曾訂閱的看板*/
#topBarMsgList_forum a {
  color: #87dfff !important;
}

/*每個項目的分割線*/
.TOP-msglist > div {
  border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.title textarea {
  /*社團快速留言*/
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.check-group h6 {
  color: #fff !important;
}
#topBarMsg_member ul li a:hover {
  background-color: rgba(0, 0, 0, 0) !important;
}

.TOP-board {
  background-color: rgba(0, 0, 0, 0) !important;
}
.TOP-more ul li:hover {
  background: Transparent !important;
  box-shadow: 0 1px 3px 0 rgba(255, 255, 255, 0) !important;
}

.TOP-more ul:hover {
  background: rgba(0, 0, 0, 0) !important;
}
.TOP-more > div p {
  background: rgba(0, 0, 0, 0) !important;
  color: #fff;
}

#topBarMsg_member ul li:hover,
#topBarMsg_member ul li:focus,
#topBarMsg_member ul li:active {
  background: rgba(0, 0, 0, 0.7);
}
.TOP-msglist a:hover,
.TOP-msglist div:hover {
  background-color: rgba(0, 0, 0, 0) !important;
}
/*滑鼠移入的顏色*/
.TOP-msglist > div:hover {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
.TOP-more > div.nav-platform ul li.platform-ac:hover {
  background-color: rgba(0, 0, 0, 0) !important;
}

/*右上角選單、平台專區*/
#topBarMsgList_more a {
  color: #fff !important;
}

/*看所有通知、設定*/
.TOP-msgbtn a i {
  color: #87dfff !important;
}

/*--------------------------------------------------------------*/

/*左上角的（  GNN新聞 哈啦區  ＡＰＰ....）*/

.BA-serve {
  background-color: hsla(0, 0%, 18%, 0.5) !important;
  margin-top: 30px;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.BA-serve li a {
  color: #fff !important;
}

/*--------------------------------------------------------------*/

/*主框*/

.BA-cbox {
  transition: all 0.3s;
  background-color: rgba(45, 45, 45, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.BA-cbox a,
.BA-cbox span {
  color: #fff !important;
}

.BA-cbox:hover {
  /* transition: all 0.3s;
  background-color: rgba(0, 0, 0, 0.5) !important; */
}

/*--------------------------------------------------------------*/

#gnn_normal p span {
  /*網底*/
  background-color: hsla(200, 70%, 50%, 0.5) !important;
}

.BA-cbox6E {
  background-color: hsla(200, 70%, 50%, 0.5) !important;
}

/*--------------------------------------------------------------*/

/*標籤*/

.BA-ctag1 li a:hover {
  /*選中*/
  color: #222 !important;
}

.BA-ctag1 li a {
  /*未選中*/
  margin-top: 30px;
}

/*--------------------------------------------------------------*/

/*table表頭*/

.BA-cbox7 tr:first-child,
.BA-cbox5 tr:first-child {
  background-color: rgba(0, 0, 0, 0) !important;
}

/*--------------------------------------------------------------*/

/*最底下那個框的數字編號*/

.BA-cbox7 span {
  color: #189696 !important;
}

/*--------------------------------------------------------------*/

/*--------------------------------------------------------------*/

/*框的【更多】*/

.BA-cbox4B a,
.BA-cbox6F a:link,
#gnn_normal div a:link,
.BA-cbox8A a:link,
#hotboard .BA-cbox5C a,
#hothala p a,
.BA-cbox9C a:link {
  color: #87dfff !important;
}

/*創作的超鏈接*/

#homeOdata a:link {
  color: #87dfff !important;
}

/*圖片背景*/

.BA-cbox4A div,
.BA-cbox6B {
  background-color: hsla(0, 0%, 0%, 0.4) !important;
}

/*看更多 - 2018-05-23*/
.BA-cbox10B,
.BA-cbox9C {
  background-color: rgba(45, 45, 45, 0.4) !important;
  color: #87dfff !important;
}
.BA-cbox9C a {
  color: #87dfff !important;
}
.BA-cbox10B,
.BA-cbox9C {
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/*移除多餘的水平線 - 2018-05-23 */
.BA-cbox10B::before,
.BA-cbox9C::before {
  height: 0px !important;
}

/*--------------------------------------------------------------*/

/*廣告*/

.BA-billboard,
#floatingAd div {
  opacity: 0 !important;
  height: 0px !important;
  pointer-events: none !important;
}

.BA-billboard:hover,
#floatingAd div:hover {
  transition: all 0.5s;
  opacity: 1;
}

/*--------------------------------------------------------------*/

/*版權宣告*/

.BA-footer a {
  color: #fff;
}

/*--------------------------------------------------------------*/

/*標籤
(GNN 新聞    TGS 2019    手機遊戲    PC    TV 掌機    動漫畫    電競   主題報導)*/
.BA-ctag1 a {
  background-image: none !important;
  background-color: rgba(45, 45, 45, 0.4) !important;
  color: #fff;
  border: none;
}

/*滑鼠移入*/
.BA-ctag1 li a:hover {
  color: #87dfff !important;
}
/*選中*/
.BA-ctag1 .BA-ctag1now {
  color: #87dfff !important;
  background-color: rgba(45, 45, 45, 1) !important;
  border: 1px solid #87dfff !important;
}

/*--------------------------------------------------------------*/

/*左邊的 「動畫瘋新番」*/
/*.BA-lbox3 a:nth-child(2n){
  background-color: rgba(45,45,45,0.4) !important;
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-top: none !important;
  color: #FFF !important;
}


.BA-lbox {
  background-color: rgba(45,45,45,0.4) !important;
  border: 1px solid rgba(255,255,255,0.4) !important;
}

.BA-newanime ul li .newanime_name {
  color: #87dfff !important;
}*/

.rank-ranking-list-area .ranking-list-4to10-area .ranking-list-list > p {
  color: #fff;
}

.card_headnews {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.gnn-container .gnn-text {
  color: #fff !important;
}

.gnn-allnews-block {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.bh-index_commontab ul li a {
  color: #fff !important;
}

.bh-section {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.bh-section a {
  color: #fff !important;
}

/*-----------------*/

/* 問題反應｜合作提案｜招兵買馬 隱私權聲明｜著作權聲明 */
.BA-lbox-copyright li a {
  color: rgba(255, 255, 255, 0.7);
}
`;
	}

	if (url == "https://user.gamer.com.tw/login.php") {
		css = `/**
 * 
 * 標題：css-巴哈姆特-深色主題（首頁）
 * 
 * 最後修改日期：2018 / 05 / 25
 * 作者：HBL917070（深海異音）
 * 作者小屋：http://home.gamer.com.tw/homeindex.php?owner=hbl917070
 * 
 **/

/*整體的背景*/
html {
  /*-webkit-animation:myGradual 1s;
   -moz-animation:myGradual 1s;*/

  /*背景圖片，修改【url()裡面的網址即可】*/
  background-image: bac_img_color, url(bac_img_url) !important;

  background-attachment: fixed !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;

  background-color: rgba(45, 45, 45, 1) !important;
}

body {
  font-family: "微軟正黑體" !important;
  background-color: rgba(0, 0, 0, 0) !important;
}
/*整體的外框*/
.inner {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5) !important;
}
/*背景顏色*/
.wrapper {
  background-color: rgba(0, 0, 0, 0) !important;
}

/*「下面的提示文字」不要在公用電腦勾選*/
#tips {
  width: auto;
  background-color: rgba(0, 0, 0, 0) !important;
}

/*漸變特效（畫面緩緩顯示）*/
/*@-webkit-keyframes myGradual {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes myGradual {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }*/

/*修改帳號密碼的頁面*/
.main {
  background: #fff !important;
}

.card{
  background:none !important;
  box-shadow: none !important;
}`;
	}

	/* 把背景圖片轉成base64 */
	if (背景圖片網址 == GM_getValue("bac_img_url")) {
		背景圖片網址 = GM_getValue("bac_base64");
	} else {
		if (背景圖片網址.substr(0, 4).toLowerCase() == "http") {
			toDataURL(背景圖片網址, function (dataUrl) {
				GM_setValue("bac_base64", dataUrl);
				GM_setValue("bac_img_url", 背景圖片網址);
				console.log("深色主題-重新下載圖片");
			});
		}
	}

	//修改背景圖片
	css = css.replace(/bac_img_color/g, 背景圖片上面的漸層顏色);
	css = css.replace(/bac_img_url/g, 背景圖片網址);

	//注入 CSS
	function addCss(dom_css) {
		let dom_html = document.getElementsByTagName("html");
		let dom_head = document.head;
		if (dom_html.length > 0) {
			dom_html[0].appendChild(dom_css);
		} else if (dom_head != null) {
			dom_head.appendChild(dom_css);
		} else {
			setTimeout(() => {
				addCss(dom_css);
			}, 10);
		}
	}
	let dom_css = document.createElement("style");
	dom_css.innerHTML = css;
	addCss(dom_css);


})();


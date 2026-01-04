// ==UserScript==
// @name          css-巴哈姆特深色主題 - 新聞
// @description	  巴哈姆特深色主題 - 新聞
// @include       https://gnn.gamer.com.tw*
// @require       https://code.jquery.com/jquery-3.6.0.js
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @version       0.7
// @namespace https://greasyfork.org/users/867867
// @downloadURL https://update.greasyfork.org/scripts/438966/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C%20-%20%E6%96%B0%E8%81%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/438966/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C%20-%20%E6%96%B0%E8%81%9E.meta.js
// ==/UserScript==

(function () {
    var css = "";
    var url = document.location.href;

    if (
        url.indexOf("https://gnn.gamer.com.tw/") === 0
    ) {
        css = `
body {
  background-image: url(https://i.imgur.com/NBVKfL9.jpg) !important;

  background-attachment: fixed !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-color: rgba(45, 45, 45, 1) !important;
  overflow-y: scroll;
}

/*隱藏「相關新聞」「猜你喜歡」*/
#BH-master .gnn-promotenews,
#BH-master h4:nth-child(1)
{
    display:none
}

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓最上面功能條區塊*/
/*整體*/
.TOP-msg {
  background-color: rgba(45, 45, 45,0) !important;
  color: #fff !important;
  border: 2px solid #249db8 !important;
}
.TOP-msg span {
  background-color: rgba(0, 0, 0, 1) !important;
  color: #fff
}
.TOP-bh{
 background: rgb(0,0,0) !important;
}

.TOP-msglist{
  background: none  !important;
  background-color: #000 !important;
}
.TOP-msglist div:hover,
.TOP-msglist a:hover {
  /*移到上面時*/
  background-color: rgba(45, 45, 45, 0.95) !important;
}

/*通知 項目的分界線*/
.TOP-msglist div {
  background-color: rgba(0, 0, 0, 0) !important;
}
.TOP-msglist .time{
  color: #fff !important;
}
.TOP-msg .new {
  /*新通知*/
  background-color: rgba(50, 100, 80, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*哈哈姆特-列表內容*/
.im_bhtop-message-summary{
  color:#fff !important;
}

/*哈哈姆特-列表名字*/
.im_bhtop-user-name{
  color:#8bc2f9 !important;
}

.TOP-msgpic {
  /*圖片底色*/
  background-color: rgba(0, 0, 0, 0) !important;
}
.TOP-msgbtn {
  /*最下面那條*/
  background-color: rgba(0, 0, 0, 1) !important;
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

/*通知底色部透明度*/
.TOP-msglist > div.is-disabled{
  opacity:1 !important;
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
  background-color: rgba(0, 0, 0, 1) !important;
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
.TOP-msglist a:hover ,.TOP-msglist div:hover{
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

/*所有超連結*/
[href]:hover {
  /*超連結*/
  color: #87dfff !important;
}

/*上功能條*/
#BH-top-data{
  background-color: rgb(0,0,0) !important;
}

/*上選單*/
.BH-menu {
  background-color: #000000 !important;
}

/*上選單-GNN新聞*/
ul.BH-menuE li:first-child > a{
  background-color: #000000 !important;
  color: #bfffff !important;
}

/*上搜尋欄位*/
.TOP-search form.gsc-search-box .gsc-input-box input.gsc-input{
  background: #7e7e7e !important;
  color: #fff !important;
}

/*右搜尋欄位*/
.BH-searchC input{
  background: #7e7e7e !important;
  color: #fff !important;
}

/*搜尋按鈕*/
.TOP-search form.gsc-search-box .gsc-search-button{
  background: #a1a1a1 !important;
}

/*放大鏡*/
.TOP-search form.gsc-search-box .gsc-search-button:before{
  color: #ffffff !important;
}

.BH-menuE li dl{
  background: rgba(0, 0, 0, 0.9) !important;
}

.BH-menuE li dl dd a{
  color: #bfffff !important;
}

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓新聞內容區塊*/
/*標題字*/
.GN-lbox3 h1{
  color: #fff !important;
}

/*SWITCH ICON*/
.GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-ns, .GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-ds, .GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-wii, .GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-wiiu {
  background-color: #cd6464 !important;
}

/*IOS ICON*/
.GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-ios{
  background-color: #5f5e5e !important;
}

/*PC ICON*/
.GN-lbox3 .GN-lbox3B ul.platform-tag li.platform-pc{
  background-color: #388bb1 !important;
}

/*中背景*/
.BH-lbox{
  background-color: rgba(51, 51, 51, 0.6) !important;
}

/*底背景*/
#BH-wrapper{
  background-color: transparent !important;
  color: #fff !important;
}

/*內文紅色轉換*/
.pic-desc{
  color: #e6e6e6 !important;
}

/*內文深藍色轉換*/
.GN-lbox3 .GN-lbox3B h3 {
  color: #2b79c9 !important;
}

/*功能鈕ICON*/
.TOP-btn a:before{
  color: #ffffff !important;
}

/*超連結字顏色*/
.GN-lbox3B div a{
  color: #8bc2f9 !important;
}

.GN-lbox3E a{
  color: #8bc2f9 !important;
}

/*內文特殊區塊*/
.gnn-table tr td{
  background-color: #383838 !important;
}
.gnn-table tr td div h3{
color: #8bc2f9  !important;
}

/*追蹤區塊*/
.gamecard__info{
  background-color: #4b4a4a !important;
}

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓底部區塊:新聞評語、相關新聞、最新頭條*/
/*社群ICON*/
.community_sharebtn li:hover{
  background-color: #000000 !important;
}

/*顯示所有的評語*/
.GN-lbox4A a{
  color: #fff !important;
}

/*新聞評語*/
#BH-master h4{
  background-color: transparent !important;
  border-top: thin solid #fff !important;
  border-left: thin double #fff !important;
  border-right: thin double #fff !important;
  color: #fff !important;
}
/*巴哈LOGO*/
#BH-master h4 img{
  content:url(https://i.imgur.com/VN1aJij.png) !important;
}

/*留言區-留言*/
#comment .GN-lbox6A{
  background-color: #1e1a1a !important;
}

/*留言區-名字顏色*/
.GN-lbox6A p a{
  color: #8bc2f9 !important
}

/*留言顏色*/
.comment-text{
  color: #fff !important;
}

/*檢舉按鈕*/
.GN-lbox6A button{
  background-color: #636363 !important;
  color: #fff !important;
}

/*發表新聞評語-外部框*/
.GN-lbox6 .GN-lbox6B{
  background-color: #00000054 !important;
}

/*發表新聞評語-輸入框*/
.GN-lbox6 .GN-lbox6B input{
  background-color: #000000 !important;
  color: #fff !important;
}

/*底部超連結顏色*/
.GN-lbox9 a,
.GN-lbox8 a
{
  color: #fff !important;
}

/*輸入框預設文字顏色*/
input::-webkit-input-placeholder{
  color: #fff !important;
}

/*底下ICON旁的...TOOLTIP展開*/
#tippy-tooltip-1 ul{
  background-color: #000000 !important;
}
#tippy-tooltip-1 li a{
  color: #fff !important;
}

/*相關新聞、猜你喜歡 超連結文字*/
.gnn-promotenews a{
  color:#fff !important;
}

/*購物區塊*/
.desk_ec-block .ec-slider-list .scroll-card > a .product-info {
  background-color: #000000c4 !important;
  border: 1px solid rgb(255 255 255 / 50%) !important;
}

.desk_ec-block .ec-slider-list .scroll-card > a .calltobuy{
  background-color: #000000c4 !important;
  border: 1px solid rgb(255 255 255 / 50%) !important;
}

.desk_ec-block .ec-slider-list .scroll-card > a .product-info p{
  color: #cbcbcb !important;
}

#BH-master h4 {
  background: transparent !important;
  border-left: transparent !important;
  border-right: transparent !important;
}

`;
    }

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

var $ = window.jQuery;
$(document).ready(function() {
    //內文亮色轉換
    $(".GN-lbox3B div div span").each(function () {
        var color = $(this).css("color");
        if (color == "rgb(0, 0, 255)") {
            $(this).css("color", "#a5a5f6");
        }
        else if(color ==="rgb(178, 34, 34)"){
            $(this).css("color", "#cd6464");
        }
        else if(color ==="rgb(102, 102, 102)"){
            $(this).css("color", "#a6a6a6");
        }
    });

    //內文間隔區塊
    $(".gnn-table tr td span").each(function () {
        var color = $(this).css("color");
        if (color == "rgb(0, 0, 0)") {
            $(this).css("color", "#ffffff");
        }
    });
});
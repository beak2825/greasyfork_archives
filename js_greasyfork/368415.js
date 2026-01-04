// ==UserScript==
// @name          css-巴哈姆特深色主題
// @namespace     hbl917070
// @description      巴哈姆特深色主題
// @author        hbl917070(深海異音)
// @homepage      https://home.gamer.com.tw/homeindex.php?owner=hbl917070
// @include       https://forum.gamer.com.tw*
// @include       https://home.gamer.com.tw/creation*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @version       0.39
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/368415/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/368415/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A1%8C.meta.js
// ==/UserScript==

/*
標題：css-巴哈姆特深色主題
範圍：哈啦區的：文章列表、文章
最後修改日期：2024 / 06 / 12
作者：hbl917070（深海異音）
說明：https://forum.gamer.com.tw/C.php?bsn=60076&snA=2621599

*/

/**
 * 更新紀錄
 * 2024/06/12：從右鍵選單內新增或移除背景圖片，並支援隨機圖片
 * 2022/11/15：處理「投票」的區塊
 * 2022/08/16：隱藏「猜你喜歡」的區塊
 * 2022/08/03：調整「子版標籤」「大家都在看」的顏色
 * 2022/01/19：隱藏下面的公會區塊
 * 2021/05/14：修復使用阻擋廣告的軟體導致腳本失效的問題
 * 2020/02/22：修復某些圖片異常消失的BUG
 * 2020/02/19：修復快速回文的顏色
 * 2019/10/02：修復文章列表顏色
 * 2019/09/17：修復通知顏色
 * 2019/07/04：修復回文框的顏色
 * 2019/03/26：修復哈哈姆特通知的顏色
 * 2019/03/09：新增「縮圖模式」的支援
 *
 */


(() => {

    // ▼ ▼ ▼ 這裡的設定可以修改 ▼ ▼ ▼

    var 背景圖片上面的漸層顏色 = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

    var 擴充CSS = ``;

    // ▲ ▲ ▲ 這裡的設定可以修改 ▲ ▲ ▲

    //-----------------------
    /*
    設定技巧
  
    背景圖片網址：
        把要使用的圖片上傳至 https://imgur.com 或是其他的圖片空間
        然後對網頁右鍵 Tampermonkey → 新增背景圖片

    背景圖片上面的漸層顏色：
        deg：代表漸層的角度，所以「90deg」就是「水平由左至右」
        角度後面有兩個rgba()：第一個是漸層的起始的顏色，第二個是漸層結束的顏色
        rgba() 後面的 0% 跟 100%：就是起始跟結尾的意思，基本上不用修改
        rgba 四個參數分別是 (紅, 綠, 藍, 透明度)
        rgba(255,255,255,1) = 白色
        rgba(0,0,0,1) =       黑色
        rgba(255,0,0,1) =     紅色
        rgba(0,0,0, 0.3) =    30%透明的黑色
        rgba(0,0,0,0) =       完全透明
    */

    // -----------------------------------

    var css = "";
    var url = document.location.href;

    // 「不啟用」 投票、勇者議事堂、版務專用網頁、發文或回文的頁面
    if (
        url.startsWith("https://forum.gamer.com.tw/vresult") ||
        url.startsWith("https://forum.gamer.com.tw/opinion") ||
        url.startsWith("https://forum.gamer.com.tw/gemadmin/bmAttendance.php") ||
        url.startsWith("https://forum.gamer.com.tw/gemadmin/snippet_manage.php?bsn=1") ||
        url.startsWith("https://forum.gamer.com.tw/applyBM") ||
        url.startsWith("https://forum.gamer.com.tw/post1.php?")
    ) {
        return;
    }

    // 哈啦區
    if (url.startsWith("https://forum.gamer.com.tw")) {
        css += `

body {
    background-image: bac_img_color, url(bac_img_url) !important;

    background-attachment: fixed !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    background-color: rgba(45, 45, 45, 1) !important;
    overflow-y: scroll;
}
/*文字預設的顏色*/
#BH-background {
    color: #fff !important;
}

/*縮圖模式 BETA中*/
.side_gray_box h3 {
    color: #fff !important;
}

/*避免聊天室突然冒出來導致點錯東西*/
#chatRoom:not(.BH-rbox-message) {
    height: 450px;
    margin-bottom: 10px;
}

/*--------------------------------*/

/*快速回文框*/
#post_textarea_1 .form-control {
    background-color: rgba(0, 0, 0, 0) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*送出按鈕*/
.btn--send {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff !important;
}
.btn--send:hover {
    border: 1px solid #87dfff !important;
}

/*「插入範本」按鈕*/
.c-editor__input .option .toolbar button.add-template_c {
    background-color: rgba(0, 0, 0, 0) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.c-editor__input .option .toolbar button.add-template_c:hover,
.c-editor__input .option .toolbar button.add-template_c.is-active {
    background-color: rgba(0, 0, 0, 0) !important;
    border: 1px solid #87dfff !important;
}

/*「插入範本」 文字顏色*/
.add-template_box .c-section a {
    color: #000 !important;
}

.b-list__filter__latest {
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background-color: rgba(0, 0, 0, 0) !important;
}

.is-active {
    /* border: 1px solid #87dfff !important; */
}

.b-list__head .BH_forum_mainop > span a {
    color: #fff !important;
    background-color: rgba(0, 0, 0, 0) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.now_stop {
    border: 1px solid #87dfff !important;
}

/*--------------------------------*/

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
/*--------------------------------*/
/*文章列表的 縮圖模式 2019-03-07 */

/*回復數、瀏覽人氣 的數字*/
.b-imglist-wrap .b-imglist-info span,
.b-imglist-wrap .b-imglist-info p {
    color: rgb(255, 255, 255) !important;
}
/*內容顏色*/
.b-imglist-wrap .b-list__brief {
    color: #ffffff !important;
    padding-left: 37px !important;
}
/*滑鼠移入列表的顏色*/
.b-imglist-wrap .b-list__row:hover {
    background: rgba(0, 0, 0, 0.2) !important;
}
/*區分每一筆文章的底線*/
.b-imglist-wrap .b-list-item {
    border-bottom: solid 1px rgba(255, 255, 255, 0.2) !important;
}
/*最後一筆不要加底線*/
.b-imglist-wrap .b-list__row:last-of-type .b-list-item {
    border-bottom: none !important;
}
/*置頂文章的底線*/
.b-imglist-wrap .b-list__row--sticky {
    border-bottom: none !important;
}

/*文章列表的面的文章頁數*/
.b-imglist-wrap .b-list__main__pages a {
    color: #87dfff !important;
}
/*發文者*/
.b-imglist-wrap .b-list__author a {
    color: #87dfff !important;
}

/*--------------------------------*/
/*文章列表上面，切換縮圖模式或清單模式的按鈕*/

.b-list__filter__gp,
.b-list__filter__feature,
.b-list__filter__expert {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.b-list__head .is-active,
.b-list__head .now_stop {
    outline: 1px solid #87dfff !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
}
/*----------*/

/*廣告*/
#ad-native-c {
    width: 0px !important;
    height: 0px !important;
    display: block !important;
    overflow: auto !important;
    pointer-events: none !important;
    opacity: 0 !important;
}

/*----------*/
/*右邊 哈哈姆特 2019-03-08*/

/*上半部*/
#message-scoller_forum {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
}
/*下半部*/
#send_msg_div_forum {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
}

#chatRoom {
    background-color: rgba(0, 0, 0, 0) !important;
}
/*整體框線*/
#chatRoom {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*超連結顏色*/
.as-mes-wrapper .msg-log a:link {
    color: #87dfff !important;
}
/*外框顏色*/
.as-mes-wrapper .msg-log {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*名字*/
.msg-log-title {
    color: #fff !important;
}

/*時間*/
.msg-log-time {
    color: rgba(250, 190, 255, 0.8) !important;
}
/*文字框*/
.msg-log {
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #fff !important;
}
/*標題列『廣場聊天室』*/
.bh-b-title {
    background-color: rgba(0, 0, 0, 0) !important;
}
#send_msg_div {
    background-color: rgba(255, 255, 255, 0.75) !important;
}
/*輸入框*/
#message-input__editer_forum {
    background-color: rgba(255, 255, 255, 0) !important;
    color: #fff !important;
}

/*輸入框無文字的狀態。 請勿違反站規，歡迎下載APP聊天*/
.as-mes-wrapper .message-input__editer::placeholder {
    color: rgba(255, 255, 255, 0) !important;
}

/*下面圖示的顏色*/
.message-input__toolbar img {
    -webkit-filter: brightness(2);
    opacity: 1 !important;
}
.message-input__toolbar .mini-input:hover {
    outline: solid 2px #87dfff !important;
}
/*右下角的 送出 按鈕*/
.as-mes-wrapper .btn-send-message {
    background: none !important;
}
/*--------*/

/*版務、文章列表下面的 刪除、回覆刪除、置頂、鎖定、收入精華 ...*/
.managertools {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
}
.managertools .btn--sm {
    background: rgba(0, 0, 0, 0.4) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.managertools .btn--sm:hover {
    border: 1px solid #87dfff !important;
}

/*版務、刪除選取留言*/
.btn--sm {
    color: #fff !important;
}

/*版務、您有*件文章檢舉待處理 */
#auseNum {
    margin: 0px !important;
    padding: 0px !important;
    position: relative !important;
    height: 60px !important;
}
.FM-master-btn > a {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff !important;
}
.FM-master-btn > a:hover {
    border: 1px solid #87dfff !important;
}

#auseNum font[style] {
}
#auseNum font {
    margin: 10px 0px !important;
    padding: 5px !important;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.4) !important;
    color: #fff !important;
}
#auseNum font a font {
    font-weight: 900;
    color: #f36d3c !important;
    background-color: rgba(0, 0, 0, 0) !important;
    margin: 0px !important;
}
#auseNum font a font:hover {
    font-weight: 900;
    color: rgb(172, 41, 172) !important;
    margin: 0px !important;
}

/*2018-10-22 文章列表的廣告*/
.b-list_ad {
    height: 0px !important;
    width: 0px !important;
    border: none !important;
    margin: 0px !important;
    padding: 0px !important;
    overflow: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    display: block !important;
    position: absolute !important;
}

section.c-section {
}

/*--------------------------------------------------------------*/

/*留言圖片自動放大*/
/* .reply-content img {
transition: all 0.3s;
}

.reply-content:hover img {
transition: all 500ms cubic-bezier(1, 0.09, 1, -0.315);

max-width: 100% !important;
max-height: 500px !important;
} */

/*避免留言變色*/
.c-reply__item:hover {
    background-color: rgba(0, 0, 0, 0) !important;
}

/*--------------------------------------------------------------*/

/*文章列表*/
.b-imglist-wrap .b-imglist-item .b-list__main__title {
    color: #fff;
}
/*「被刪除文章」的顏色*/
.b-imglist-wrap .b-imglist-item.is-del .b-list__main__title {
    color: #fff;
}

.b-list__main__title:hover {
    color: #87dfff !important;
}

.b-list__main__title:visited {
    color: rgb(134, 134, 134) !important;
}

.b-list__page {
    color: #87dfff !important;
    display: inline-block;
    margin: 0 3px;
}
.b-list__page:hover {
    text-decoration: underline !important;
}

/*「滑鼠移入時」的顏色*/
.b-imglist-wrap .b-imglist-item a:hover .b-list__main__title {
    color: #87dfff !important;
}

/*--------------------------------------------------------------*/
/*文章已鎖定*/
.c-article__content span[style="color: #333333"] {
    background-color: rgba(255, 255, 255, 0.6);
}
.c-article__content font[color="#474e56"] {
    background-color: rgba(255, 255, 255, 0.6);
}
/*--------------------------------------------------------------*/
/*右下角的「哈哈姆特按鈕」、2018-05-25 */
#btn_quick {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
}
#btn_quick:hover {
    border: 1px solid #87dfff !important;
}
/*--------------------------------------------------------------*/
/*https://forum.gamer.com.tw/*/
/*哈啦區首頁列表「縮圖」*/
.forum_list {
    background-color: rgba(45, 45, 45, 0.4) !important;
}
.forum_list:hover {
    background-color: rgba(0, 0, 0, 0.6) !important;
}
.forum_list a {
    color: #fff !important;
}
/*右下角的排行名次*/
.forum_list_title span:first-child {
    color: #fff !important;
    opacity: 0.4;
}

/*--------------------------------------------------------------*/
/*哈啦區首頁列表「清單」*/
#data-container .BH-table {
    background-color: rgba(45, 45, 45, 0.4) !important;
}
.BH-table1 tr:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.2) !important;
}
#data-container .BH-table a {
    color: #fff !important;
}
#data-container .BH-table tr:hover {
    background-color: rgba(0, 0, 0, 1) !important;
}

/*右上角的搜尋相關關鍵字*/
.right-child {
    background: rgba(45, 45, 45, 0.4) !important;
}

/*--------------------------------------------------------------*/

/*留言標記  2017-10-05*/
div[data-template-id="#tagList"] {
    /*背景陰影*/
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.7) !important;
}
div[data-template-id="#tagList"] .tag-list {
    /*背景顏色*/
    background-color: rgba(230, 230, 230, 0.9) !important;
}
div[data-template-id="#tagList"] .tag-list .username {
    /*文字顏色*/
    color: #000 !important;
}
div[data-template-id="#tagList"] .tag-list h3 {
    /*標題(留言名單、好友名單)*/
    color: rgba(255, 120, 20, 1) !important;
    border-top: none !important;
    margin-top: 10px !important;
    border-bottom: 2px solid rgba(255, 120, 20, 1) !important;
    font-size: 18px !important;
    font-weight: 900 !important;
}
div[data-template-id="#tagList"] .enter {
    /*底下的圓圈*/
    background: none !important;
}

/*--------------------------------------------------------------*/
/*2017/08/14 界面大更新*/

/*文章裡面*/

/*固定在最上面的工具列*/
.c-menu__scrolldown {
    background-color: rgba(0, 0, 0, 0.7) !important;
    color: #fff !important;
    position: relative;
    margin-bottom: 0px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
}
.c-menu__scrolldown a,
.c-menu__scrolldown h1 {
    color: #fff !important;
}
.toolbar a:hover {
    color: #87dfff !important;
}
.BH-menuE,
.c-menu,
#BH-menu-path {
    border-top: none !important;
}
#BH-menu-path {
    background-color: rgba(0, 0, 0, 0) !important;
}

.BH-menu fixed {
    background-color: rgba(0, 0, 0, 0) !important;
}

.c-menu {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
    background: rgba(0, 0, 0, 0) !important;
}

/*關閉動畫*/
/*.c-menu__scrolldown , #BH-menu-path , .c-fixed--header .is-scroll{
  transition: none  !important;
}*/

/*文章區塊*/
.c-post {
    color: #fff !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*文章預設文字顏色*/
.c-article__content {
    color: #fff;
}
/*超連結顏色*/
.c-post a[href] {
    color: #87dfff;
}

/*文章主內容*/
.c-post__body {
    border-top: solid 1px rgba(255, 255, 255, 0.4) !important;
    padding-top: 30px !important;
}

/*簽名檔上面的水平線*/
.c-post__body__signature {
    border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*作者*/
.username {
    color: #fff !important;
}

/*時間*/
.edittime {
    color: rgba(255, 255, 255, 0.7) !important;
}

/*留言區塊*/
.c-post__footer {
    color: #fff;
    background-color: rgba(0, 0, 0, 0);
    border-top: solid 1px rgba(255, 255, 255, 0.4) !important;
}
.c-reply {
    background: rgba(0, 0, 0, 0) !important;
}
.c-reply span {
    color: #fff;
}
.c-reply a[href] {
    color: #87dfff !important;
}
.c-reply a[href]:hover {
    text-decoration: underline !important;
}

/*右下角的『回覆』*/
.jumptocomment button {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.jumptocomment button:hover {
    border: 1px solid #87dfff !important;
}

/*留言輸入框*/
.reply-input {
    background-color: rgba(0, 0, 0, 0) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff !important;
}
.content-edit {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
}
.reply-input div {
    color: #fff !important;
}

/*快速回覆*/
.c-section__main {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.c-section__main h1 {
    color: #fff !important;
}
.ql-editor {
    color: #fff;
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.option {
    background-color: rgba(0, 0, 0, 0) !important;
}

/*本版熱門推薦*/
.popular__item a {
    color: #fff;
    text-decoration: none;
}
.popular .popular__item:hover .name {
    color: #87dfff !important;
    text-decoration: none;
}

/*上下一頁的按鈕*/
.c-section__main .next,
.c-section__main .prev {
    height: 52px;
    margin: -12px 0px;
    line-height: 50px !important;
    border-radius: 0px !important;
}

/*頁碼的底色*/
.prev,
.next,
.BH-pagebtnA a[href] {
    background-color: rgba(0, 0, 0, 0.4) !important;
}

/*右邊的『切回舊版』視窗*/
.c-test {
    background-color: rgba(45, 45, 45, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*右下角『電梯』、『回最上面』、『回列表』*/
.jumpfloor,
.jumpfloor input,
.c-quicktool .goback,
.c-quicktool .gotop {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff;
}
.jumpfloor input:hover,
.c-quicktool .goback:hover,
.c-quicktool .gotop:hover {
    border: 1px solid #87dfff !important;
}
.baha_quicktool .quicktool.jumpfloor input {
    color: #fff !important;
}
/*--------------------------------------------------------------*/

/*2017/08/14*/

/*文章列表*/
.b-list-wrap {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    margin-top: 30px;
}
.b-list-wrap td {
    border-bottom: 1px dotted rgba(255, 255, 255, 0.4) !important;
}
.b-list__row:nth-child(2n + 1) {
    background-color: rgba(255, 255, 255, 0) !important;
}

/*標題列*/
.b-list__head {
    background-color: rgba(0, 0, 0, 0.5) !important;
}

/*頂置*/
.b-list__row--sticky {
    background-color: rgba(30, 100, 80, 0) !important;
    border-bottom: 1px dotted rgba(255, 255, 255, 0.4) !important;
}

/*移入*/
.b-list-wrap tr:hover {
    background-color: rgba(0, 0, 0, 0.3) !important;
    /* outline: 2px solid #87dfff !important; */
}

/*標題醒目的顏色*/
.is-highlight {
    color: rgba(50, 180, 190, 1) !important;
}

/*作者帳號顏色*/
.b-list__count__user a,
.b-list__time__user a,
.b-list__main__pages a {
    color: #87dfff !important;
}
.b-list-wrap a {
    color: #fff !important;
}

/*移入的顏色*/
.b-list-wrap a:hover {
    color: #87dfff !important;
}

/*icon『圖片』顏色*/
.icon-photo {
    color: rgba(100, 200, 150, 1) !important;
}
/*icon『影片』顏色*/
.icon-video {
    color: rgba(250, 100, 150, 1) !important;
}
/*icon『鎖』顏色*/
.icon-lock {
    color: rgba(150, 100, 200, 1) !important;
}

/*頁碼前面的虛線『>>...』*/
.b-list__main__pages {
    color: rgba(255, 255, 255, 0.7) !important;
}

/*回到文章列表的動畫顏色*/
@keyframes highlight {
    0% {
        background: rgba(150, 100, 100, 0);
    }
    50% {
        background: rgba(150, 100, 100, 0.5);
    }
    100% {
        background: rgba(150, 100, 100, 0);
    }
}
@-moz-keyframes highlight {
    0% {
        background: rgba(150, 100, 100, 0);
    }
    50% {
        background: rgba(150, 100, 100, 0.5);
    }
    100% {
        background: rgba(150, 100, 100, 0);
    }
}
@-webkit-keyframes highlight {
    0% {
        background: rgba(150, 100, 100, 0);
    }
    50% {
        background: rgba(150, 100, 100, 0.5);
    }
    100% {
        background: rgba(150, 100, 100, 0);
    }
}

/*文章列表-版本熱門推薦*/
.b-popular {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*標題文字*/
.b-popular a {
    color: #fff;
    outline: none !important;
}
.b-popular .name:hover {
    color: #87dfff !important;
}
/*上面的類別按鈕*/
.b-tags a {
    background-color: rgba(45, 45, 45, 0.4) !important;
    outline: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff !important;
}
.b-tags a:hover {
    outline: 1px solid #87dfff !important;
}
/*--------------------------------------------------------------*/

/* 改版的【上方主選單】----最後修改：2018-07-03 */

/* 哈啦區    場外休憩區    文章列表    精華區    板規    水桶 */
ul.BH-menuE > li > a {
    color: #fff;
}
ul.BH-menuE li:first-child > a {
    color: #fff;
}
ul.BH-menuE li > a:hover {
    color: #87dfff;
}
ul.BH-menuE .now {
    color: #87dfff;
}

/** 精華區最上面的選單 */
ul.rwd-nav .rwd-nav-main-items > li > a {
    color: #fff !important;
}
ul.rwd-nav .rwd-nav-main-items > li .now{
    color: #87dfff !important;
}

/* 滑鼠移入時顯示的選單 */
.dropList dl {
    background-color: rgba(0, 0, 0, 0.9) !important;
}
/* 2022-11-15 移除背景的陰影 */
.box-shadow__soft {
    box-shadow: none !important;
}

/** 已訂閱 */
ul.BH-menuE li.BH-menu-forumA-right.nav-text-btn.is-active > a {
    color: #fff;
}
/** 訂閱 */
ul.BH-menuE li.BH-menu-forumA-right > a {
    color: #fff;
}
/** 選單的項目 */
ul.BH-menuE dl a {
    color: #fff !important;
}

/* 底下滑動的光條 */
#navBarHover {
    background: #117e96 !important;
    box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0) !important;
    border: none !important;
}

.dropList a {
    background-color: rgba(0, 0, 0, 0) !important;
}

/* 顏色 */
.BH-menuE,
.BH_menu-search {
    background-color: rgba(0, 0, 0, 0.7) !important;
    color: #000 !important;
    /*display:block!important; 讓【搜尋】預設就是展開的狀態*/
}

/* 右上角「回列表」按鈕 */
.c-menu__scrolldown .toolbar .back {
    margin-right: 5px !important;
}
.BH-menu-forumA-back .is-active {
    margin-right: 5px !important;
}

.BH-searchC input[type="text"] {
    /*【搜尋】的文字框*/

    background-color: rgba(255, 255, 255, 0.3) !important;
    color: #fff !important;
    font-weight: bold !important;
}

/*--------------------------------------------------------------*/

/*2019-09-16 【通知視窗】*/

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
#topBarMsg_member div,
#topBarMsg_more div {
    background-color: rgba(45, 45, 45, 0) !important;
}

/*通知 項目的分界線*/
.TOP-msglist div {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
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
    background: rgba(0, 0, 0, 0.3) !important;
    /* box-shadow: 0 1px 3px 0 rgba(255, 255, 255, 0.4) !important; */
    outline: 1px solid rgba(255, 255, 255, 0.4);
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

/*最上面那條（通知、訂閱、推薦）*/
.TOP-bh {
    background-color: rgba(0, 0, 0, 1) !important;
    background: rgba(0, 0, 0, 1) !important;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
}
#BH-top-data {
    background-color: rgba(0, 0, 0, 0) !important;
}
/*最上面的搜尋*/
#top_search_q {
    /*display: none !important;    */
    background-color: rgba(255, 255, 255, 0.3) !important;
    color: rgba(255, 255, 255, 1) !important;
}

/*--------------------------------------------------------------*/

/*【移除FB點讚】*/
.fb-like {
    display: none !important;
    height: 0px !important;
}
/*【移除廣告】上面、右邊 */
#BH-ad_banner,
#flySalve,
#BH-bigbanner {
    opacity: 0 !important;
    height: 0px !important;
    pointer-events: none !important;
    overflow: hidden !important;
}

/*上面的廣告*/
.a-mercy-d {
    display: block;
    opacity: 0 !important;
    height: 0px !important;
    pointer-events: none !important;
    overflow-y: scroll !important;
}

/*下面的廣告（2016-10-14）*/
.forum-bottom-banner {
    opacity: 0 !important;
    height: 0px !important;
    pointer-events: none !important;
    overflow-y: scroll !important;
}

/*--------------------------------------------------------------*/

/*最近閱覽看板*/
.BH-rbox a {
    color: #fff !important;
}

/*google搜尋*/
#BH-search {
    background-color: rgba(45, 45, 45, 0.4) !important;
}

/*--------------------------------------------------------------*/

/* http://forum.gamer.com.tw/ */
/*看版首頁*/
.FM-abox5B {
    background-color: rgba(0, 0, 0, 0) !important;
}
.FM-abox2A,
.FM-abox8A {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #ddd !important;
}
.BH-lbox {
    /*要先讓底色透明*/
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.FORUM-master_box1 strong {
    /*標題*/
    background-color: rgba(0, 0, 0, 0) !important;
}

/**/
.FORUM-master_box1 a,
.FORUM-master_box1 p {
    color: #fff !important;
    border: 0px solid rgba(255, 255, 255, 0.4) !important;
}
.FORUM-master_box1 a:hover {
    color: #87dfff !important;
}

/*每個版的樣式*/
.FORUM-master_box1 div {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    margin-bottom: 5px !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    box-sizing: border-box;
}
.FORUM-master_box1 div strong {
    /*標題*/
    background-color: rgba(0, 0, 0, 0.7) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.FM-abox2A a[href] {
    color: #87dfff !important;
}

/*達人專區*/
.FM-abox8 a {
    color: #fff !important;
}

/*最上面的（搜尋）*/
.BH-search2 input {
    background-color: #000 !important;
    color: #ddd !important;
}

/*文章搜尋的文字顏色*/
.BH-search2 span {
    color: #000 !important;
}

/*--------------------------------------------------------------*/

/*每個版的首頁*/

.FM-abox6B a[href] {
    /*作品介紹*/
    color: #87dfff !important;
}
.ACG-box span,
.ACG-box p {
    color: #fff !important;
}

#BH-master h4 {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
}
#BH-master h4 img[src="https://i2.bahamut.com.tw/h1_img.gif"]
{
    display: none;
}
/*--------------------------------------------------------------*/

/*文章列表*/
.fmb tr,
.fmb {
    background-color: rgba(0, 0, 0, 0) !important;
    border-collapse: collapse;
    border: none !important;
}

.fmb tr {
    border-bottom: 0px solid rgba(255, 255, 255, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*滑鼠移動到上面的顏色*/
.fmb tr:hover td {
    background-color: rgba(0, 0, 0, 0) !important;
    /*transform: scale(1.2);*/
}

/*底色*/
.fmb td {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border-bottom: none !important;
}
/*文章列表-文字*/
.FM-blist a {
    color: #eee !important;
    /*font-size:15px;*/ /*讓文章列表的文字變大*/
}
/*單數行的底色*/
.FM-row td {
    background-color: rgba(0, 0, 0, 0.5) !important;
    border-bottom: none !important;
}
/*頂置文章的底色*/
.FM-sticky td {
    background-color: rgba(40, 70, 50, 0.4) !important;
}
/*GP數量*/
.FM-blist4 {
    color: #cc55cc !important;
}

.FM-blist tr:hover {
    background-color: rgba(0, 0, 0, 0.4) !important;
}

/*--------------------------------------------------------------*/

/*推薦\精華\達人*/
.FM-blist1 td {
    background: #000 !important;
    background-color: #000 !important;
}
.FM-blist1 a {
    background: none !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.FM-blist1 a:hover {
    border: 1px solid #87dfff !important;
}
/*文章子板 、頁數*/
.FM-blist2 a,
.FM-blist3 span a {
    color: #87dfff !important;
}
/*文章瀏覽人數*/
.FM-blist5 {
    color: #ccc !important;
}
/*文章列表-作者*/
.FM-blist5 a,
.FM-blist6 a {
    color: #87dfff !important;
}
/*GP篩選*/
.gplist a,
.gplist {
    color: #000 !important;
}

/*--------------------------------------------------------------*/

/*    看板首頁    板規    文章列表    精華區*/
#BH-main_menu,
.BH-search2 {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4);
}
#BH-main_menu a {
    color: #fff !important;
}

/*文章分類的標籤-框架*/
.FM-tags {
    border-bottom: 0px solid rgba(255, 255, 255, 0.4) !important;
    margin-bottom: 10px !important;
}
/*文章分類的標籤*/
.FM-tags a {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.FM-tags a:hover {
    border: 1px solid #87dfff !important;
}
/*選中的*/
#FM-tagsnow {
    background-color: #3c91c9 !important;
    color: #000 !important;
}

/*--------------------------------------------------------------*/

/*最上面（文章在哪一個版的文字*/
#BH-pathbox a {
    color: #fff;
}

/*--------------------------------------------------------------*/

/*右邊區塊的標題（動漫電玩通、版務*/
#BH-slave h5 {
    background-color: rgba(0, 0, 0, 0.7) !important;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-bottom: none !important;
}

/*右邊區塊（動漫電玩通、版務*/
.BH-rbox {
    color: #fff;
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*同上的超連結文字*/
.BH-rbox a[href] {
    color: #87dfff !important;
}

/*--------------------------------------------------------------*/

/*文章區塊-整體*/
.FM-cbox1 {
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #fff !important;
    margin-bottom: 30px !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*文章當中的超連結*/
.FM-cbox7 a:link {
    color: #87dfff !important;
} /*文章當中點選過得超連結*/
.FM-cbox7 a:visited {
    color: #c78dff !important;
}
/*文章-作者ID */
.FM-cbox5 a:link {
    color: #87dfff !important;
}
/*文章勇者區*/
.FM-cbox2 {
    background: none !important;
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*勇者區上面的標題*/
.FM-cbox3 {
    background: none !important;
    background-color: #000 !important;
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.FM-cbox9 {
    border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*文章的GP、BP*/
.FM-cbox9 p a {
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #87dfff !important;
}
/*看她的文、開啟圖片*/
.FM-cbox4 a {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background: none !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #ddd !important;
}
.FM-cbox4 a:hover {
    border: 1px solid #87dfff !important;
}

/*檢舉*/
.FM-cbox10 button {
    background-color: #000 !important;
    color: #ddd !important;
}

/*--------------------------------------------------------------*/

/*留言*/
.FM-cbox10D {
    border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
    background-color: rgba(0, 0, 0, 0) !important;
}

.FM-cbox10D a {
    color: #87dfff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background-color: rgba(45, 45, 45, 0.4) !important;
    padding: 5px !important;

    line-height: 30px !important;
}
.FM-cbox10D a:hover {
    border: 1px solid #87dfff !important;
}

/*留言的名字*/
.FM-msgbg a {
    color: #5588cc !important;
}
/*留言的日期*/
.FM-msgbg span {
    color: #558855 !important;
}
/*留言區的漸層*/
.FM-cbox10A,
.FM-cbox10 {
    background: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/*留言-輸入框*/
.FM-cbox10C textarea {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*--------------------------------------------------------------*/

/*快速回復*/

/*本體 \ 未登入*/
.FM-reply,
.FM-replyB {
    background-color: rgba(45, 45, 45, 0.4) !important;

    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #ddd !important;
}

#reply0 {
    /*輸入框*/
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.FM-replyA input[type="text"] {
    /*驗證碼輸入框*/
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    width: 80px !important;
    padding: 5px;
}
.FM-replyC a[style],
.FM-replyA button {
    /*【button】完整編輯、快速回覆*/
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #87dfff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    padding: 3px;
}
.FM-replyC a[style]:hover,
.FM-replyA button:hover {
    border: 1px solid #87dfff !important;
}

/*--------------------------------------------------------------*/

/*避免進階編輯出現背景*/
.editstyle {
    background: none !important;
    background-color: #fff !important;
    color: #000 !important;
}

/*--------------------------------------------------------------*/

/*下面的 本版熱門推薦*/
.FM-blist8 {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    margin-top: 10px !important;
}
/*移除外框*/
.FM-blist8 a {
    border: none !important;
}
/*移除外框*/
.popular .popular__item .img {
    outline: none !important;
}
.popular .popular__item .name:hover {
    color: #87dfff !important;
}
/*--------------------------------------------------------------*/

/*版權宣告*/
#BH-footer {
    color: rgba(255, 255, 255, 0.4) !important;
    border: none;
}

/*--------------------------------------------------------------*/

/*編輯器的按鈕（原始碼、即時瀏覽）*/
#_bhrte_btn_text,
#_bhrte_btn_rte {
    background-color: #ccc;
}

/*Google Chrome 編輯器文字矯正*/
#form1 .FM-lbox3C {
    color: #ccaacc !important;
}

/*--------------------------------------------------------------*/

/*看版首頁的【投票區】*/
.FM-abmbar {
    /*color:#000 !important;
  background-color: #222;   */
    background-color: rgba(0, 0, 0, 0) !important;
}

/*--------------------------------------------------------------*/

/*水桶名單 表格【http://forum.gamer.com.tw/water.php?bsn=60076】*/
.FM-stb1,
.FM-stb1 tr {
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #fff !important;
}
.FM-stb1 tr td,
.FM-stb1 tr td a {
    color: #fff !important;
}
.FM-stb1 tr td span {
    color: #aaffcc !important;
}

/*--------------------------------------------------------------*/

/*精華區索引*/
/*http://forum.gamer.com.tw/listG.php?bsn=60076*/

.FM-sbox3B table a {
    color: #fff !important;
}

/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/

/*【反轉顏色】*/

/*【反轉顏色】(公佈欄 公佈欄*/
.FM-abox5B a[href],
.FM-abox5B a[href] font[color] {
    color: #87dfff !important;
}

/*【文字顏色反轉】（版規*/
#BH-master div.FM-lbox4 a[href],
#BH-master div.FM-lbox4 a[href] font[color] {
    color: #87dfff !important;
}

/*【反轉顏色】(哈拉區的文章*/
.FM-cbox7 a[href],
.FM-cbox7 a[href] font[color] {
    color: #87dfff !important;
}

/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/

/* 本板熱門推薦 */
.FM-blist8 p:hover {
    outline: 1px solid #87dfff !important;
}

.FM-cbox9 .back:hover,
button[name="accuse_tip"]:hover,
.FM-lbox1 button:hover,
.FM-msgbg button:hover {
    border: 1px solid #87dfff !important;
}

button[name="accuse_tip"],
.FM-lbox1 button,
.FM-msgbg button {
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    line-height: 0px;
}

#BH-pagebtn a:link {
    background: rgba(0, 0, 0, 0.4) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

#BH-pagebtn a {
    color: #fff !important;
}

#BH-pagebtn a:hover {
    border: 1px solid #87dfff !important;
    background: rgba(0, 0, 0, 0.4) !important;
}

#BH-pagebtn .pagenow,
#BH-pagebtn .no {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
#BH-pagebtn .pagenow:hover {
    background-color: #148aa4 !important;
}
#BH-pagebtn .no {
    background-color: rgba(45, 45, 45, 0.4) !important;
    color: #444 !important;

    opacity: 0;
}
#BH-pagebtn .no:hover {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/*動漫電玩通*/
.BH-qabox1 button {
    background: rgba(0, 0, 0, 0.4) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.BH-qabox1 button:hover {
    border: 1px solid #87dfff !important;
}

/*針對【BahaForumPreviewer】的優化（在文章列表顯示內文的插件）2017-02-02*/
.FM-blist table tr,
.FM-blist table,
.FM-blist table td {
    border: none !important;
    background: rgba(0, 0, 0, 0) !important;
    color: rgba(240, 255, 205, 1) !important;
}

/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/

/* 我們了解您不想看到廣告的心情⋯ 若您願意支持巴哈姆特永續經營，請將 gamer.com.tw 加入廣告阻擋工具的白名單中，謝謝 ! */
body div[style*="position: fixed; left: 20px; right: 20px;"] {
    display: block !important;
    opacity: 0 !important;
    height: 0px !important;
    pointer-events: none !important;
}

/* 搜尋 2024-06-11 */
#searchbox {
    background: rgba(255, 255, 255, 0.4) !important;
}
.gsib_a {
    background: rgba(0, 0, 0, 0) !important;
}
.gcse-bar .gcse-main div.gsc-input-box table.gstl_50 td.gsib_a input.gsc-input {
    color: #fff !important;
}

.TOP-data .gcse-bar .gcse-option .gcse-dropdown.gcse-suggest .gcse-suggest-tag a {
    border: 1px solid #87dfff !important;
    color: #87dfff !important;
    background: rgba(0, 0, 0, 0) !important;
}

/* 修正白底問題   2017/07/26 */
.gcse-wrapper {
    background-color: rgba(0, 0, 0, 0) !important;
}
.gsc-control-cse {
    background-color: rgba(0, 0, 0, 0) !important;
}
.gsc-webResult.gsc-result,
.gsc-results .gsc-imageResult {
    background-color: rgba(0, 0, 0, 0) !important;
}

/*2017/07/07 上面的搜尋框*/
#old_search_searchbox {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
}
#old_search_form * {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
}

/*2017/07/07 搜尋框的熱門搜尋*/
.gcse-dropdown {
    background-color: rgba(0, 0, 0, 0.8) !important;
    color: #fff !important;
}
.gcse-suggest-tag a {
    color: #87dfff !important;
}

/*2017/07/07 下拉選單（搜尋方式）*/
.gcse-dropdown span {
    color: #fff !important;
}

/* 2017/07/07 右邊的熱門推薦*/
.right-child {
    background-color: rgba(45, 45, 45, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
.right-child a {
    color: #87dfff !important;
}

/*右邊哈哈姆特 人物名字顏色*/
#chatRoom .msg-log-title {
    color: #fff !important;
}
#chatRoom {
    padding: 0px !important;
}

/*右下角哈哈姆特 人物名字顏色*/
.as-mes-box .msg-log-title {
    color: #666 !important;
}
.as-mes-box .msg-log-time {
    color: #888 !important;
}

/*文章顏色如果是預設值，就設定成白色*/
font[color="unset"] {
    color: #fff !important;
}

/*格式化文章*/
div[ge_shi_hua="true"] .c-article__content * {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
    font-size: 18px !important;
}

div[ge_shi_hua="true"] .c-article__content a:link {
    color: #87dfff !important;
}
/*擴充按鈕、文章格式化的按鈕*/
.ge_shi_hua {
    width: 25px;
    height: 25px;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    /*border-left: solid 1px rgba(255, 255, 255, 0.4);
border-top: solid 1px rgba(255, 255, 255, 0.4);*/
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    float: right;
    text-align: center;
    line-height: 25px;
    margin-top: -25px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0Mi4wMzUgNDQyLjAzNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQyLjAzNSA0NDIuMDM1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjQ4LjIyNywzOTkuMjAxYy05LjYxNiwwLTE3LjQ4Myw3Ljg2Ny0xNy40ODMsMTcuNDgzczcuODY3LDE3LjQ4MywxNy40ODMsMTcuNDgzSDQwOC40OSAgIGM5LjYxNiwwLDE3LjQ4My03Ljg2NywxNy40ODMtMTcuNDgzVjEzOC40MDljMC00Ljk1NC0yLjA0LTkuNjE2LTUuNTM2LTEyLjgyMUwyODkuMzEzLDQuNjYyQzI4Ni4xMDgsMS43NDgsMjgxLjczNywwLDI3Ny4zNjYsMCAgIEg4Mi4xMzZDNzIuNTIsMCw2NC42NTMsNy44NjcsNjQuNjUzLDE3LjQ4M3YxODkuNDAyYzAsOS42MTYsNy44NjcsMTcuNDgzLDE3LjQ4MywxNy40ODNzMTcuNDgzLTcuODY3LDE3LjQ4My0xNy40ODNWMzQuOTY3ICAgaDEzOS44NjZ2MTUxLjUyMmMwLDkuNjE2LDcuODY3LDE3LjQ4MywxNy40ODMsMTcuNDgzaDEzMS4xMjVjMC44NzQsMCwyLjA0LDAsMi45MTQtMC4yOTF2MTk1LjUyMUgyNDguMjI3eiBNMzg4LjA5MywxNjkuMDA1ICAgSDI3NC40NTJWMzguNDYzbDExNi41NTUsMTA3LjUyMnYyMy4zMTFDMzkwLjEzMywxNjkuMDA1LDM4OC45NjcsMTY5LjAwNSwzODguMDkzLDE2OS4wMDV6IE0yMS4yMzYsNDEyLjAyMmw0MS4wODYtNDEuMDg2ICAgbC0zOS4wNDYtMzkuMDQ2Yy02LjcwMi02LjcwMi02LjcwMi0xNy43NzUsMC0yNC43NjhjNi43MDItNi43MDIsMTcuNzc1LTYuNzAyLDI0Ljc2OCwwbDM5LjA0NiwzOS4wNDZsMzcuMDA2LTM3LjAwNiAgIGM2LjcwMi02LjcwMiwxNy43NzUtNi43MDIsMjQuNzY4LDBjNi43MDIsNi43MDIsNi43MDIsMTcuNzc1LDAsMjQuNzY4bC0zNy4wMDYsMzcuMDA2bDM5LjA0NiwzOS4wNDYgICBjNi43MDIsNi43MDIsNi43MDIsMTcuNzc1LDAsMjQuNzY4Yy0zLjQ5NywzLjQ5Ny03Ljg2Nyw1LjI0NS0xMi4yMzgsNS4yNDVzLTkuMDMzLTEuNzQ4LTEyLjIzOC01LjI0NWwtMzkuMDQ2LTM5LjA0NiAgIEw0Ni4yOTUsNDM2Ljc5Yy0zLjQ5NywzLjQ5Ny03Ljg2Nyw1LjI0NS0xMi4yMzgsNS4yNDVzLTkuMDMzLTEuNzQ4LTEyLjIzOC01LjI0NUMxNC4yNDMsNDMwLjA4OSwxNC4yNDMsNDE5LjAxNiwyMS4yMzYsNDEyLjAyMnoiIGZpbGw9IiNGRkZGRkYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    background-size: 22px 22px;
    background-position: center center;
    background-repeat: no-repeat;
    opacity: 0.4;
}
.ge_shi_hua:hover {
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 1;
}

/*修正Chrome瀏覽器導致「Google搜尋頁面」的原生下拉選單物件，文字顏色變成白色 的問題*/
#filter-subbsn option {
    color: #000 !important;
}

/*ACG 同好圈 X 閒聊取暖 X 自由經營公會新手村*/
.forum-b_promot-block {
    display: none;
}

/* 文章子版標籤 */
.c-post__header .tag-category .tag-category_item {
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    background-color: rgba(0, 0, 0, 0);
}

/* 下面的 大家都在看 */
.c-section__main.popular .popular__item .author a {
    color: #87dfff !important;
}

/* 猜你喜歡 */
.c-section__more {
    display: none;
}

/* ------------------ */

/* 投票 */
.vote-block {
    backdrop-filter: saturate(180%) blur(15px);
    border: none !important;
    color: #fff !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
}
.vote-block .c-post__body {
    border-top: none !important;
    padding-top: 0px !important;
}
/* 格式化按鈕 */
.vote-block .ge_shi_hua {
    display: none;
}
/* 一人限投 1 票 / 2022-12-16 到期 / 匿名投票 / 票數即時顯示 */
.vote-block .c-post__header small {
    color: rgba(255, 255, 255, 0.7) !important;
}

/* 選項 */
.vote-item div.form-control {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background-color: rgba(0, 0, 0, 0) !important;
    color: #ffffff !important;
}
/* 選項 選取後值的顏色 */
.vote-item div.form-control .progress-bar {
    background: rgb(0, 139, 177, 0.5) !important;
}    
        `;

        css += 擴充CSS;

        // 使用者還沒新增背景的時，需要設定為空陣列，否則會出現錯誤
        let bac_img_url_temp = GM_getValue("bac_img_url");
        let bac_img_url = Array.isArray(bac_img_url_temp) ? bac_img_url_temp : [];
        let bac_base64 = GM_getValue("bac_base64") || [];
        console.log("bac_img_url", bac_img_url.join("\n"));
        // 增刪圖片網址時更新 base64
        if (bac_base64.length !== bac_img_url.length) {
            bac_base64 = [];
            bac_img_url.forEach(url => {
                toDataURL(url, (dataUrl) => {
                    adjustImageAspectRatio(dataUrl, 2560, 1440, (adjustedDataUrl) => {
                        bac_base64.push(adjustedDataUrl);
                        GM_setValue("bac_base64", bac_base64);
                    });
                });
            });
            GM_setValue("bac_img_url", bac_img_url);
        }

        // 隨機取
        var 背景圖片 = bac_img_url[Math.floor(Math.random() * bac_img_url.length)];
        var 背景圖片網址 = bac_base64[bac_img_url.indexOf(背景圖片)];

        // 選單功能
        GM_registerMenuCommand("顯示目前的背景圖片網址", () => {
            showDialog("目前背景圖片: " + 背景圖片 + "<br><br>所有背景圖片:<br>" + bac_img_url.join("<br><br>"));
        });
        GM_registerMenuCommand("新增背景圖片", () => {
            let newUrl = prompt("輸入網址:");
            if (newUrl && bac_img_url.indexOf(newUrl) === -1) {
                toDataURL(newUrl, (dataUrl) => {
                    adjustImageAspectRatio(dataUrl, 2560, 1440, (adjustedDataUrl) => {
                        bac_img_url.push(newUrl);
                        bac_base64.push(adjustedDataUrl);
                        GM_setValue("bac_img_url", bac_img_url);
                        GM_setValue("bac_base64", bac_base64);
                        console.log("bac_img_url", GM_getValue("bac_img_url").join("\n"));
                        console.log("bac_base64", GM_getValue("bac_base64").join("\n\n\n\n"));
                        alert("成功添加!");
                    });
                });
            } else {
                alert("網址無效或該圖片重複！");
            }
        });
        GM_registerMenuCommand("刪除背景圖片", () => {
            let removeUrl = prompt("輸入目前已有要刪除的圖片網址:");
            if (removeUrl && bac_img_url.indexOf(removeUrl) !== -1) {
                let index = bac_img_url.indexOf(removeUrl);
                bac_img_url.splice(index, 1);
                bac_base64.splice(index, 1);
                GM_setValue("bac_img_url", bac_img_url);
                GM_setValue("bac_base64", bac_base64);
                alert("成功刪除！");
            } else {
                alert("網址無效或該圖片不存在！");
            }
        });

        // 調整圖片長寬比例並填補圖片左側
        function adjustImageAspectRatio(dataUrl, targetWidth, targetHeight, callback) {
            const img = new Image();
            img.onload = function () {

                // 如果圖片的 size 小於目標 size，則直接使用原圖的 size
                if (img.width < targetWidth && img.height < targetHeight) {
                    // 目標大小的比例
                    const targetAspectRatio = targetWidth / targetHeight;
                    // 原圖的比例
                    const originalAspectRatio = img.width / img.height;
                    // 如果原圖的比例大於目標比例，則以目標寬度為準
                    if (originalAspectRatio > targetAspectRatio) {
                        targetHeight = img.height;
                        targetWidth = img.height * targetAspectRatio;
                    } else {
                        targetWidth = img.width;
                        targetHeight = img.width / targetAspectRatio;
                    }
                }

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const originalWidth = img.width;
                const originalHeight = img.height;

                const scaleFactor = targetHeight / originalHeight;
                const scaledWidth = originalWidth * scaleFactor;

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const offsetX = targetWidth - scaledWidth;
                context.drawImage(img, offsetX, 0, scaledWidth, targetHeight);
                // 抓取圖片邊緣平均顏色
                const fillColor = getAverageColor(img, 0, 0, 1, originalHeight);

                const paddingWidth = offsetX;
                if (paddingWidth > 0) {
                    context.fillStyle = fillColor;
                    context.fillRect(0, 0, paddingWidth, targetHeight);
                }

                callback(canvas.toDataURL("image/webp"));
            };
            img.src = dataUrl;
        }

        function getAverageColor(img, x, y, width, height) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);

            let totalRed = 0;
            let totalGreen = 0;
            let totalBlue = 0;
            const pixelCount = width * height;

            const imageData = context.getImageData(x, y, width, height).data;

            for (let i = 0; i < imageData.length; i += 4) {
                totalRed += imageData[i];
                totalGreen += imageData[i + 1];
                totalBlue += imageData[i + 2];
            }

            const averageRed = Math.round(totalRed / pixelCount);
            const averageGreen = Math.round(totalGreen / pixelCount);
            const averageBlue = Math.round(totalBlue / pixelCount);

            return `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;
        }

        function showDialog(content) {
            // 創建對話框和關閉按鈕
            var dialog = document.createElement('div');
            var closeButton = document.createElement('button');

            // 設定對話框的樣式
            dialog.style.width = '80%';
            dialog.style.height = '80%';
            dialog.style.backgroundColor = '#000';
            dialog.style.color = '#fff';
            dialog.style.position = 'fixed';
            dialog.style.top = '10%';
            dialog.style.left = '10%';
            dialog.style.padding = '20px';
            dialog.style.boxSizing = 'border-box';
            dialog.style.overflowY = 'scroll';
            dialog.style.zIndex = '99999';

            // 設定關閉按鈕的樣式
            closeButton.style.position = 'absolute';
            closeButton.style.right = '0px';
            closeButton.style.top = '0px';
            closeButton.style.height = '20px';
            closeButton.textContent = '×';

            // 當按下關閉按鈕時，移除對話框
            closeButton.onclick = function () {
                document.body.removeChild(dialog);
            };

            // 將內容和關閉按鈕加到對話框中
            dialog.innerHTML = content;
            dialog.appendChild(closeButton);

            // 將對話框加到頁面中
            document.body.appendChild(dialog);
        }

        document.addEventListener("DOMContentLoaded", function () {
            simplifyArticleLinks(); // 簡化文章列表的超連結
            addHorizontalLineToArticleList(); // 文章列表插入水平線
            formatDocument(); // 文章內容格式化
            reverseTextColorAndBackground();
            cancelImageLazyLoading(); // 取消圖片延遲載入
            fixFastReplyColor(); // 修正快速回文的顏色
        });

    }

    // Google 搜尋的頁面
    if (url.startsWith("https://forum.gamer.com.tw/search")) {
        css += `

/* 搜尋頁面最上面的選單 */
ul.rwd-nav .rwd-nav-main-items > li > a {
    color: #fff;
}
ul.rwd-nav .rwd-nav-main-items > li .now {
    color: #87dfff;
}

#BH-master {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
}
/** 全部 精華 M文 達人 金選 板務 */
.search_nav li a {
    color: #fff;
}
/** 選中的項目 */
.search_nav li.is-active a {
    color: #87dfff;
}
/** 選擇子板  排序 */
.search_result_filter ul li a[aria-expanded]{
    color: #fff !important;
}
/** 搜尋結果： 共有  筆 */
.search_result_data {
    color: #aaa !important;
}
/** 進階篩選 */
.search_result_filter ul li a:hover {
    color: #fff !important;
}
/* 整體 */
.search-result_wapper {
    background: rgba(0, 0, 0, 0) !important;
}
/* 內文 */
.search-result_text {
    color: #fff !important;
}
/** 日期 GP by */
.search-result_article .forum-textinfo span {
    color: #aaa !important;
}
/* 標題超鏈接 */
.search-result_title a {
    color: #87dfff !important;
}
/** 發文者 */
.forum-textinfo a {
    color: #87dfff !important;
}

/* 右側區塊 */
.right-child {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: #fff !important;
}
.right-child h3 {
    color: #fff !important;
}
.right-child a {
    color: #87dfff !important;
}
#BH-slave .search-suggest .search-suggest-tag a {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #87dfff !important;
    border: 1px solid #87dfff !important;
    cursor: pointer;
}

        `;

    }

    // 全域套用的CSS
    css += `
    `;

    // 修改背景圖片
    css = css.replace(/bac_img_color/g, 背景圖片上面的漸層顏色);
    css = css.replace(/bac_img_url/g, 背景圖片網址);

    // 注入 CSS
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


    /**
     * 焦點在快速回文的方塊時，背景改成白色，失去焦點則改回深色
     */
    function fixFastReplyColor() {

        let iframe_editor = document.getElementById("editor");

        if (iframe_editor === null) { return }

        iframe_editor = document.getElementById("editor").contentWindow.document;

        if (iframe_editor != undefined) {

            iframe_editor = document.getElementById("editor").contentWindow.document;
            iframe_editor.body.setAttribute("is_focus", "no"); // 預設為失去焦點的 css

            iframe_editor.body.onblur = function () { // 失去焦點
                iframe_editor.body.setAttribute("is_focus", "no")
            }

            iframe_editor.body.onfocus = function () { // 取得焦點

                iframe_editor.body.setAttribute("is_focus", "yes")

                if (iframe_editor.getElementById("css_shense") == undefined) {

                    let editor_style = document.createElement("style");
                    editor_style.setAttribute("id", "css_shense");
                    editor_style.innerHTML = `
                        body, body * {
                            transition: background-color 0.2s, color 0.1s;
                        }

                        body[is_focus=yes] {
                            background-color: rgba(255, 255, 255, 0.9) !important;
                            color: #000 !important;
                        }

                        body[is_focus=no],body[is_focus=no] * {
                            background-color: rgba(0,0,0,0) !important;
                            color: #FFF !important;
                        }`;

                    iframe_editor.head.appendChild(editor_style);
                }
            }

        } else {
            // 如果物件不存在，就持續遞迴
            setTimeout(function () {
                fixFastReplyColor();
                console.log('重新執行 修正快速回文的顏色')
            }, 200);
        }
    }

    /**
     * 取消圖片延遲載入
     */
    function cancelImageLazyLoading() {
        let ar = document.querySelectorAll('.c-section__main img.lazyloaded');
        if (ar.length === 0) {
            return;
        }
        for (let i = 0; i < ar.length; i++) {
            let src = ar[i].getAttribute('data-src');
            ar[i].setAttribute('src', src)
        }
    }

    /**
     * 避免文章內容看不清楚，所以新增一個可以格式化文章顏色的按鈕
     */
    function formatDocument() {
        try {
            let ar_tools = document.getElementsByClassName("c-post__header");
            for (let i = 0; i < ar_tools.length; i++) {
                let obj_but = document.createElement("but");
                obj_but.innerHTML = "";
                obj_but.title = "格式化文章顏色";
                obj_but.setAttribute("class", "ge_shi_hua");
                let obj_this = ar_tools[i];
                obj_but.onclick = function () {
                    //套用CSS
                    if (obj_this.parentNode.getAttribute("ge_shi_hua") == "true") {
                        obj_this.parentNode.setAttribute("ge_shi_hua", "");
                    } else {
                        obj_this.parentNode.setAttribute("ge_shi_hua", "true");
                    }
                };
                ar_tools[i].parentNode.insertBefore(obj_but, ar_tools[i].nextSibling.nextSibling);
            }
        } catch (error) {
            console.log("深色主題、文章內容格式化、Error");
        }
    }

    /**
     * 簡化文章列表的超連結，避免 css 的 visited 無法順利變色
     */
    function simplifyArticleLinks() {
        try {

            var ar_list = document.querySelectorAll('a[href*="&tnum="]');//取得所有文章的超連結

            if (ar_list.length === 0) { return; }

            for (let i = 0; i < ar_list.length; i++) {

                let s_href = ar_list[i].href;

                if (s_href === undefined) { continue; }
                if (s_href.indexOf('&page=') > -1) { continue; }//排除指定到特定頁碼的連結
                if (s_href.indexOf('&last=') > -1) { continue; }//排除直達最後一頁的連結

                let int_index = s_href.indexOf("&tnum=");
                if (int_index > 0) {
                    ar_list[i].href = s_href.substr(0, int_index);
                }
            }
        } catch (error) {
            console.log("深色主題、簡化文章列表的超連結、Error");
            console.log(error);
        }
    }

    /**
     * 區分文章列表的置頂公告與一般文章
     */
    function addHorizontalLineToArticleList() {
        try {
            let stickyElements = document.getElementsByClassName("b-list__row--sticky");

            if (stickyElements.length === 0) { return; }

            let lastStickyElement = stickyElements[stickyElements.length - 1];
            let tableRow = document.createElement("tr");
            tableRow.style.height = "20px";
            tableRow.style.background =
                "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUAQMAAADFiO34AAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAZtJCCVUAAAArSURBVAjXYwACBQYQcEAiG0AEIwOCZAKTLEgkBxIpwIAwRgHZGHTDmOAkAKrqAtL90ZhdAAAAAElFTkSuQmCC)";
            tableRow.innerHTML = "<td colspan='20'></td>";
            tableRow.style.pointerEvents = "none";
            tableRow.setAttribute("class", "b-list__hr");

            lastStickyElement.parentNode.insertBefore(tableRow, lastStickyElement.nextSibling);
        } catch (error) {
            console.log("深色主題、文章列表插入水平線、Error");
        }
    }

    /**
     * 圖片轉 base64
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

    /**
     * 文章文字顏色反轉
     */
    function reverseTextColorAndBackground() {

        let m = new Main();

        m.reverseTextBackgroundAndColor();
        m.reverseTr();
        m.reverseTd();

        //--------------------------------------------------------------

        function Main() {

            /**
             * 反轉 文字顏色 與 背景色
             */
            this.reverseTextBackgroundAndColor = function () {
                var obj = document.querySelectorAll('font');

                for (var i = 0; i < obj.length; i++) {
                    var b = reverseRGBColor(obj[i].style.backgroundColor); // 文字背景色
                    if (b != '') {
                        obj[i].style.backgroundColor = b;
                    }

                    var c = reverseColor(obj[i].color) + ''; // 文字顏色
                    if (c != '') {
                        obj[i].color = c;
                    }
                }
            };

            this.reverseTr = function () {

                let obj = document.querySelectorAll('#BH-master tr');

                if (obj.length === 0) { return }

                for (let i = 0; i < obj.length; i++) {
                    let b = reverseRGBColor(obj[i].bgColor); // 表格背景色
                    if (b != '') {
                        obj[i].bgColor = b;
                    }
                }
            };

            this.reverseTd = function () {

                let obj = document.querySelectorAll('#BH-master td');

                if (obj.length === 0) { return }

                for (let i = 0; i < obj.length; i++) {
                    let b = reverseRGBColor(obj[i].bgColor); // 表格背景色
                    if (b != '') {
                        obj[i].bgColor = b;
                    }
                }
            };

            // 顏色單字 → 顏色碼 或 #FFFFFF → #000000
            function reverseColor(c) {
                // 顏色單字對應表
                var colorMap = [
                    new Array("windowtext", "#000000"), new Array("black", "#000000"), new Array("aliceblue", "#f0f8ff"), new Array("cadetblue", "#5f9ea0"),
                    new Array("lightyellow", "#ffffe0"), new Array("coral", "#ff7f50"), new Array("dimgray", "#696969"), new Array("lavender", "#e6e6fa"),
                    new Array("darkcyan", "#008b8b"), new Array("lightgoldenrodyellow", "#fafad2"), new Array("tomato", "#ff6347"), new Array("gray", "#808080"),
                    new Array("lightslategray", "#778899"), new Array("teal", "#008080"), new Array("lemonchiffon", "#fffacd"), new Array("orangered", "#ff4500"),
                    new Array("darkgray", "#a9a9a9"), new Array("slategray", "#708090"), new Array("seagreen", "#2e8b57"), new Array("wheat", "#f5deb3"),
                    new Array("red", "#ff0000"), new Array("silver", "#c0c0c0"), new Array("darkslategray", "#2f4f4f"), new Array("darkolivegreen", "#556b2f"),
                    new Array("burlywood", "#deb887"), new Array("crimson", "#dc143c"), new Array("lightgrey", "#d3d3d3"), new Array("lightsteelblue", "#b0c4de"),
                    new Array("darkgreen", "#006400"), new Array("tan", "#d2b48c"), new Array("mediumvioletred", "#c71585"), new Array("gainsboro", "#dcdcdc"),
                    new Array("steelblue", "#4682b4"), new Array("green", "#008000"), new Array("khaki", "#f0e68c"), new Array("deeppink", "#ff1493"),
                    new Array("white", "#ffffff"), new Array("royalblue", "#4169e1"), new Array("forestgreen", "#228b22"), new Array("yellow", "#ffff00"),
                    new Array("hotpink", "#ff69b4"), new Array("snow", "#fffafa"), new Array("midnightblue", "#191970"), new Array("mediumseagreen", "#3cb371"),
                    new Array("gold", "#ffd700"), new Array("palevioletred", "#db7093"), new Array("ghostwhite", "#f8f8ff"), new Array("navy", "#000080"),
                    new Array("darkseagreen", "#8fbc8f"), new Array("orange", "#ffa500"), new Array("pink", "#ffc0cb"), new Array("whitesmoke", "#f5f5f5"),
                    new Array("darkblue", "#00008b"), new Array("mediumaquamarine", "#66cdaa"), new Array("sandybrown", "#f4a460"), new Array("lightpink", "#ffb6c1"),
                    new Array("floralwhite", "#fffaf0"), new Array("mediumblue", "#0000cd"), new Array("aquamarine", "#7fffd4"), new Array("darkorange", "#ff8c00"),
                    new Array("thistle", "#d8bfd8"), new Array("linen", "#faf0e6"), new Array("blue", "#0000ff"), new Array("palegreen", "#98fb98"),
                    new Array("goldenrod", "#daa520"), new Array("magenta", "#ff00ff"), new Array("antiquewhite", "#faebd7"), new Array("dodgerblue", "#1e90ff"),
                    new Array("lightgreen", "#90ee90"), new Array("peru", "#cd853f"), new Array("fuchsia", "#ff00ff"), new Array("papayawhip", "#ffefd5"),
                    new Array("cornflowerblue", "#6495ed"), new Array("springgreen", "#00ff7f"), new Array("darkgoldenrod", "#b8860b"), new Array("violet", "#ee82ee"),
                    new Array("blanchedalmond", "#ffebcd"), new Array("deepskyblue", "#00bfff"), new Array("mediumspringgreen", "#00fa9a"), new Array("chocolate", "#d2691e"),
                    new Array("plum", "#dda0dd"), new Array("bisque", "#ffe4c4"), new Array("lightskyblue", "#87cefa"), new Array("lawngreen", "#7cfc00"),
                    new Array("sienna", "#a0522d"), new Array("orchid", "#da70d6"), new Array("moccasin", "#ffe4b5"), new Array("skyblue", "#87ceeb"),
                    new Array("chartreuse", "#7fff00"), new Array("saddlebrown", "#8b4513"), new Array("mediumorchid", "#ba55d3"), new Array("navajowhite", "#ffdead"),
                    new Array("lightblue", "#add8e6"), new Array("greenyellow", "#adff2f"), new Array("maroon", "#800000"), new Array("darkorchid", "#9932cc"),
                    new Array("peachpuff", "#ffdab9"), new Array("powderblue", "#b0e0e6"), new Array("lime", "#00ff00"), new Array("darkred", "#8b0000"),
                    new Array("darkviolet", "#9400d3"), new Array("mistyrose", "#ffe4e1"), new Array("paleturquoise", "#afeeee"), new Array("limegreen", "#32cd32"),
                    new Array("brown", "#a52a2a"), new Array("darkmagenta", "#8b008b"), new Array("lavenderblush", "#fff0f5"), new Array("lightcyan", "#e0ffff"),
                    new Array("yellowgreen", "#9acd32"), new Array("firebrick", "#b22222"), new Array("purple", "#800080"), new Array("seashell", "#fff5ee"),
                    new Array("cyan", "#00ffff"), new Array("olivedrab", "#6b8e23"), new Array("indianred", "#cd5c5c"), new Array("indigo", "#4b0082"), new Array("oldlace", "#fdf5e6"),
                    new Array("aqua", "#00ffff"), new Array("olive", "#808000"), new Array("rosybrown", "#bc8f8f"), new Array("darkslateblue", "#483d8b"), new Array("ivory", "#fffff0"),
                    new Array("turquoise", "#40e0d0"), new Array("darkkhaki", "#bdb76b"), new Array("darksalmon", "#e9967a"), new Array("blueviolet", "#8a2be2"),
                    new Array("honeydew", "#f0fff0"), new Array("mediumturquoise", "#48d1cc"), new Array("palegoldenrod", "#eee8aa"), new Array("lightcoral", "#f08080"),
                    new Array("mediumpurple", "#9370db"), new Array("mintcream", "#f5fffa"), new Array("darkturquoise", "#00ced1"), new Array("cornsilk", "#fff8dc"),
                    new Array("salmon", "#fa8072"), new Array("slateblue", "#6a5acd"), new Array("azure", "#f0ffff"), new Array("lightseagreen", "#20b2aa"),
                    new Array("beige", "#f5f5dc"), new Array("lightsalmon", "#ffa07a"), new Array("mediumslateblue", "#7b68ee")
                ];

                if (color == "") return "";

                // 把顏色單字轉成色碼
                for (var i = 0; i < colorMap.length; i++) {
                    if (c.toLowerCase() == colorMap[i][0].toLowerCase()) {
                        c = colorMap[i][1];
                        break;
                    }
                }

                color = c.replace('#', '');
                var color = (0xffffff - Math.floor('0x' + color)).toString(16);
                var len = 6 - color.length;
                for (var i = 0; len != i; i++) {
                    color = '0' + color;
                }

                if (color == '000NaN') return '';
                else return '#' + color;
            }

            // rgb(255,255,255) → rgb(0,0,0)
            function reverseRGBColor(color) {

                if (color == '') return '';

                if (color.toLowerCase().indexOf('rgb') > -1) {
                    let c = color;
                    c = c.replace(' ', '');
                    c = c.replace(' ', '');
                    c = c.replace('rgb(', '');
                    c = c.replace(')', '');
                    let ar = c.split(',');

                    let x1 = 255 - Number(ar[0]);
                    let x2 = 255 - Number(ar[1]);
                    let x3 = 255 - Number(ar[2]);

                    let x = `rgb(${x1},${x2},${x3})`;

                    return x;
                }

                return reverseColor(color); // 如果不是rgb模式，就用一般的反轉
            }
        }

    }

})();

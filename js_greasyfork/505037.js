// ==UserScript==
// @name        追放官方社区移动版电脑宽屏页面适配
// @namespace   GFL2-PC-BBS
// @license     MIT
// @icon        https://community-cdn.exiliumgf.com/prod/emoji/%E8%AE%A9%E6%88%91%E7%9C%8B%E7%9C%8B.jpg
// @match       https://gf2-bbs.exiliumgf.com/m/*
// @match       https://gf2-bbs.sunborngame.com/m/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-end
// @version     0.0.20
// @author      Mirco
// @description 拉伸页面至宽屏+明暗模式切换+自定义背景
// @downloadURL https://update.greasyfork.org/scripts/505037/%E8%BF%BD%E6%94%BE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E7%A7%BB%E5%8A%A8%E7%89%88%E7%94%B5%E8%84%91%E5%AE%BD%E5%B1%8F%E9%A1%B5%E9%9D%A2%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/505037/%E8%BF%BD%E6%94%BE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E7%A7%BB%E5%8A%A8%E7%89%88%E7%94%B5%E8%84%91%E5%AE%BD%E5%B1%8F%E9%A1%B5%E9%9D%A2%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

//----------布局调整----------

GM_addStyle(`

/*--主页--*/
.home_main{max-width:100% !important}
.head_pc{max-width:unset !important}
.pc_nav{
  left:0.5rem !important;
  transform:unset !important;
}
.pc_right{
  right:0.1rem;
  transform:unset !important;
  left:unset !important;
}
.content{max-width:calc(100% - 4rem) !important}
.swiper-container1{position:absolute !important}
.nav_con{
  height:1.1rem;
  width:calc(100% - 3.58rem) !important;
  margin:0.1rem 0 0.1rem 3.58rem !important
}
.index_con{width:100% !important}
.index_news_item p{width:calc(100% - 0.6rem) !important}
.card_item{width:auto !important}
.content .tab_box_fixed{
  max-width:calc(100% - 4rem) !important;
  min-width:calc(100% - 4rem);
}
.card_item .card_m .img_box{display:unset !important}
.card_item .card_m .img_box div{
  display:inline-block;
  margin-right:5px;
}

/*--帖子页--*/
.content .head{max-width:unset !important}
.content .post_box{max-width:calc(100% - 4rem) !important}
.emoji_box{width:unset !important}
.content .comment_head{width:unset !important}
.card_m1>p{
  font-size:0.18rem !important;
  line-height:0.4rem !important;
  font-weight:bold;
}
.card_m1 .showImg{
  max-width:600px;
  max-height:600px;
}
.card_item .card_con{width:unset !important}
.card_item .card_con_reply{width:unset !important}
.index_con .strage_item{width:98% !important}
.swiper-container2{width:100% !important}
.swiper-container2 .swiper-slide img{
  width:auto !important;
  max-height:100%;
}
.img_popup{
  width:100%;
  height:100%;
}

/*--攻略页--*/
.strage_item>div{width:calc(100% - 1.6rem) !important}
.van-tabs{min-width:calc(100% - 4rem)}
.tab_box_fixed .van-tabs{max-width:unset !important}

/*--通知页--*/
.van-list .message_item{width:98% !important}
.message_item .message{width:calc(100% - 0.6rem) !important}
.message_item .message .me_con{width:unset !important}
.show_message{
  width:50% !important;
  height:70% !important;
  margin:auto;
}

/*--信息卡页--*/
.mine_box{width:90% !important}
.top .top_img{
  height:2.9rem !important;
  width:100% !important;
}
.content .van-list{margin-top:unset !important}

/*--兑换页--*/
.items{width:unset !important}
.strage_item .score{width:auto !important}
.sign{width:unset !important}
.task{width:unset !important}

/*--搜索页--*/
.fire_box{width:unset !important}

/*登录页*/
.login_content{max-width:unset !important}

`);



//----------明暗模式----------

GM_registerMenuCommand("切换明暗模式(刷新生效)", switch_dark_bright);

function switch_dark_bright(){
  GM_setValue("darkmode",!GM_getValue("darkmode"));
  console.log("darkmode:"+GM_getValue("darkmode"));
}

if (GM_getValue("darkmode") == true){
  GM_addStyle(`

html,body,.card_con_reply,.post_box>span,.van-search,.van-popup,.searc_box,.sign_box,.mine_box .data_box{
  background-color:#444 !important;
  color:#eee !important;
}

.nav_con,.van-tabs__nav,.index_news,.conditions1,.card_item,.van-button--primary,.van-button--plain,.comment_head,.post_box,.van-action-sheet__cancel
,.list_wrap li,.van-list,.mine_box,.btn1,.btn2,.t_box>div,.item,.w-e-toolbar,.w-e-text-container,.top_box,.sign,.task,.content_rule,.gift_user,.van-action-sheet__item
,.content .van-cell,.content .head1 select,.van-search__content,.user_box,.user_box .user_item input,.type_box,.head_item,.van-dialog,.van-button--default{
  background-color:#333 !important;
  background:#333 !important;
}

.van-tab,.card_tit p,.card_m1 div,.comment_head>span,.van-action-sheet__cancel,.list_wrap>p,.show_message p,.show_message span,.mine_box p
,.item>p,.sign_box>p,.gift_user,.comment_head .ac,.van-field__control,.content .head1 select,.card_con_reply p>i>i,.mine_box .data_box span,.van-button--default{color:#eee !important}

.sign_box>p b{color:#ff0 !important}
.sign_box{background:unset !important}
.card_m1 div a,.show_message a{color:#999 !important}
.card_item,.post_box,.comment_head,.mine_box,.btn1,.btn2,.top_box,.sign,.task,.content .van-field,.content #div1,.user_box,.type_box,.head_item{-webkit-box-shadow:0 2px 15px #777 !important}
.pc_right_bt a{color:#444 !important}
.van-dialog__confirm{color:#e02 !important}
.img_popup{background-color:transparent !important}

.login_box input{color:#000 !important}

`);
}


//----------自定义背景----------

GM_registerMenuCommand("使用自定义背景图(刷新生效)",mod_bg);
function mod_bg(){
  console.log(GM_getValue("bg_url"));
  var temp_bg_url =prompt("背景图片的URL:\n需允许外链或者是社区内的图片\n留空则为取消设置背景图",GM_getValue("bg_url"));
  if(temp_bg_url!=null){
    GM_setValue("bg_url",temp_bg_url);
  console.log(GM_getValue("bg_url"));
  }
}

if(GM_getValue("bg_url") != undefined && GM_getValue("bg_url") != "" && GM_getValue("bg_url") != null){
  GM_addStyle(`

html{
  background-image:url(${GM_getValue("bg_url")});
  background-attachment: fixed;
  background-size: cover;
}
body,.van-search,.searc_box{background-color:unset !important}
/*.main{
  backdrop-filter:blur(3px);
  min-height:100%;
}*/

.head_pc,.head,.content,.searr_box,.van-button{opacity:0.98}
.index_con img,.card_item img{opacity:1}

`);
}


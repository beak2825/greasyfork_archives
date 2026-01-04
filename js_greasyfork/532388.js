// ==UserScript==
// @name ニコニコスタイル変更
// @namespace https://greasyfork.org/ja/users/1456051-test-nico
// @version 1.0.5
// @description ニコニコ動画のスタイル変更
// @author test_nico
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nicovideo.jp/*
// @downloadURL https://update.greasyfork.org/scripts/532388/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/532388/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
let css = `
/*nicovideo.jp*/
/*全体*/
body {
    font-size: 100%;
    }
    
/*検索バーのフォロー中のタグの文字サイズと色*/
span.fs_s.ov_hidden.tov_ellipsis.white-space_nowrap {
    font-size: 105%;
    color: #000000;
    }

/*カスタムランキングのタイトルを3行に*/
.h_\\[calc\\(\\{lineHeights\\.base\\}_\\*_2em\\)\\] {
    height: calc(var(--line-heights-base) * 3em);
    font-size: 120%;
    }

/*カスタムランキングの余分なスペースを消去*/
.max-w_100\\%.min-w_\\[calc\\(1280px_-_\\{sizes\\.webDrawer\\.currentWidth\\}_-_var\\(--scrollbar-width\\)\\)\\].w_\\[calc\\(100vw_-_\\{sizes\\.webDrawer\\.currentWidth\\}_-_var\\(--scrollbar-width\\)_-_\\{sizes\\.x3\\}_\\*_2\\)\\].gap_x1_5.flex-d_column.d_flex {
    transform: scale(0.85);
    transform-origin: top left;
    margin: -2em -0em -0em -1em;
    }

div.h_min-content.contain_style.p_x1_5.bdr_m.bg-c_layer\\.surfaceHighEm:nth-of-type(n) {
    margin: -1.5em -0em -0em -0em;
    }

    
/*カスタムランキングのランキングカテゴリのヘッダー追従を解除*/
@layer utilities {
    .pos_sticky {
    position: initial;
        }
    }

@layer utilities {
    .z_sticky {
    z-index:initial;
        }
    }

/*カスタムランキングの広告動画を非表示*/
.grid-tc_1fr_1fr_1fr_1fr_1fr_0px.gap_x3.d_grid.w_\\[calc\\(100\\%_-_\\{sizes\\.x5\\}\\)\\].pt_x0_5{
    display:none;
    }

/*ランキングの広告動画を非表示*/
div.pl_\\[calc\\(\\{sizes\\.x5\\}_\\+_\\{sizes\\.x1_5\\}\\)\\] {
    display:none;
    }

/*ランキングの広告枠を非表示*/
.left_-x0_5.top_-x0_5.pos_absolute{
    display:none;
    }

/*ランキングの左のメニューを消去*/
.min-w_webDrawer\\.miniWidth{
    display:none;
    }

/*ランキングの余分なスペースを消去*/
.gap_x3.flex-d_column.d_flex.w_100\\% > div.gap_x2.flex-d_column.d_flex {
    margin: -1em -0em 1em -0em;
    }

div.w_100\\%.gap_x1_5.d_flex > .flex-g_1 > .gap_x2.d_flex {
    line-height: 1;
    }

div#nrn-config-bar{
        margin: -2em -0em -0em -0em;
    }

/*ランキングの右のエリアを非表示*/
div.gap_x2.bg-c_layer\\.surfaceHighEm.bdr_m.p_x2.flex-d_column.d_flex:nth-of-type(n) {
    display:none;
    }
    
/*ランキングの横幅をウィンドウに合わせる*/
body {
    --sizes-web-drawer-current-width : initial;
    }

.min-w_\\[468px\\] {
	min-width: initial;
    }
   
.grid-tc_auto_440px {
	grid-template-columns: auto 15%;
    }

/*ランキングのサムネイルを小さく*/

.min-w_thumbnail\\.2xl.w_thumbnail\\.2xl.ov_hidden.bdr_m.bg-c_layer\\.surfaceHighEmBlack.asp_16\\:9.pos_relative {
    transform: scale(0.7);
    margin: -2.0em -3.5em;
    }

.min-w_thumbnail\\.l.w_thumbnail\\.l.ov_hidden.bdr_m.bg-c_layer\\.surfaceHighEmBlack.asp_16\\:9.pos_relative{
    transform: scale(1);
    margin: -0.1em -0em -0em -0em;
    }

.pos_relative > .min-w_thumbnail\\.2xl.w_thumbnail\\.2xl.ov_hidden.bdr_m.bg-c_layer\\.surfaceHighEmBlack.asp_16\\:9.pos_relative > .pos_absolute{
    transform: scale(1.42);
        margin: 0.4em 0.9em 0.5em 0em;
    }

/*ランキング（幅広）の動画タイトルを大きく*/

.fs_l.groupHover\\:text-layer_accentAzure.mb_x0_5.lc_2.fw_bold {
    font-size: 125%;
    }

/*ランキング（幅狭）の動画タイトルを大きく*/
.fs_base.groupHover\\:text-layer_accentAzure.mb_x0_5.lc_2.fw_bold {
    font-size: 125%;
    }

/*閲覧済みのページをグレーに*/
@layer reset {
    a:visited {
        color: #939393;
        }
    }

/*検索バーのヘッダー追従の解除*/
 @layer utilities {
    .top_\\[\\{sizes\\.commonHeader\\.fixedHeight\\}\\] {
        top: initial;
        }
    }
    
@layer utilities {
    .z_forward {
        z-index: initial;
        }
    }

/*ヘッダーのプロフィールアイコン左寄せ*/
.nico-CommonHeaderRoot .common-header-wb7b82 {
    flex: 0 auto;
    margin-left: 50px;
    }

/*プレミアム消去？*/
.common-header-po0rm8 {
    display: none;
    }

.nico-CommonHeaderRoot .common-header-m5ds7e {
    display: none;
    }

/*zenzaの動画タイトルサイズ*/
.zenzaWatchVideoHeaderPanel .videoTitle {
    font-size: 180%;
    font-weight: bold;
    }

.zenzaVideoPlayerDialogInner {
    font-size: 120%;
    }
    
.popupMessageContainer {
    font-size: 140%;
    font-weight: bold;
    }
    
.ai_center.gap_x3.flex-d_column.d_flex.grid-area_right {
        display:none
    }

/*古いやつ*/
.NC-MediaObjectTitle {
    font-size: 120%;
    }

/*検索ページの広告動画消去*/
li.nicoadVideoItemWrapper:nth-child(n){
    display: none;
    }
    
.nicodicNicoadVideoList.uad.video.contentBody {
    display:none;
    }    
    
/*検索ページの広告枠消去*/
.video .itemThumbWrap::before {
    display: none;
    }

/*検索ページの左のメニューの消去*/
.NC-VideoMenuDrawerPlaceHolder {
    display: none;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

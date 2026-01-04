// ==UserScript==
// @name       bro3_rokaku_tool2_event
// @namespace   bro3_rokaku_tool2_event
// @description   ブラウザ三国志 鹵獲イベント用
// @include        https://*.3gokushi.jp/*
// @include        http://*.3gokushi.jp/*
// @exclude        https://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude        http://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude        https://*.3gokushi.jp/maintenance*
// @exclude        http://*.3gokushi.jp/maintenance*
// @exclude        https://info.3gokushi.jp/*
// @exclude        http://info.3gokushi.jp/*
// @version     1.62.1
// @grant    GM_addStyle
// @grant    GM_deleteValue
// @grant    GM_getValuezfF
// @grant    GM_log
// @grant    GM_setValue
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @resource    jqueryui_css    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @require    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js

// @downloadURL https://update.greasyfork.org/scripts/371213/bro3_rokaku_tool2_event.user.js
// @updateURL https://update.greasyfork.org/scripts/371213/bro3_rokaku_tool2_event.meta.js
// ==/UserScript==
// version date       author
// 1.0    2017/08/15  作成開始
// 1.59   2018/05/25  拠点表示
// 1.60   2018/05/27  ログ出力追加
// 1.61   2018/06/18  自動寄付機能追加
// 1.62   2018/07/02  糧を続ける設定を追加
// 1.62.1   2018/08/15  プロトコル変更対応

// load jQuery
jQuery.noConflict();
j$ = jQuery;

// GreaseMonkeyラッパー関数の定義
rinitGMWrapper();

//----------//
// 変数定義 //
//----------//
// ソフトウェアバージョン
var VERSION = "1.61";
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
// 特殊定数
var PROTOCOL = location.protocol;
var HOST = location.hostname;        // アクセスURLホスト
var SERVICE = '';                    // サービス判定が必要な場合に使用する予約定数
var SVNAME = HOST.substr(0,location.hostname.indexOf(".")) + SERVICE;
var GM_KEY = "RKK11_" + HOST.substr(0,HOST.indexOf("."));

// 保存データデリミタ
var DELIMIT1 = "#$%";
var DELIMIT2 = "&?@";
var DELIMIT3 = "{=]";
var DELIMIT4 = "|-/";

//メイン
//使用する設定
var USECONF1 = 'useconf1'; // 鹵獲スキル
var USECONF2 = 'useconf2'; // 鹵獲パッシブ
//設定優先順位
var USEDLST1 = 'usedlst1'; // 鹵獲スキル
var USEDLST2 = 'usedlst2'; // 鹵獲パッシブ
//出兵拠点
var ROKAKU_VIL = 'rokaku_vil';
var ROKAKU_VIL2 = 'rokaku_vil2';
var YN_SUBVIL = 'yn_subvil';
//回復スキル使用拠点
var KAIHK_VIL = 'kaihk_vil';
//出兵座標
var WOOD_X = 'wood_x';   // 木x
var WOOD_Y = 'wood_y';   // 木y
var STONE_X = 'stone_x'; // 石x
var STONE_Y = 'stone_y'; // 石y
var IRON_X = 'iron_x';   // 鉄x
var IRON_Y = 'iron_y';   // 鉄y
var RICE_X = 'rice_x';   // 糧x
var RICE_Y = 'rice_y';   // 糧y
//出兵座標２
var WOOD_X2 = 'wood_x2';   // 木x
var WOOD_Y2 = 'wood_y2';   // 木y
var STONE_X2 = 'stone_x2'; // 石x
var STONE_Y2 = 'stone_y2'; // 石y
var IRON_X2 = 'iron_x2';   // 鉄x
var IRON_Y2 = 'iron_y2';   // 鉄y
var RICE_X2 = 'rice_x2';   // 糧x
var RICE_Y2 = 'rice_y2';   // 糧y
//優先度
var WOOD_RATE = 'wood_rate';   // 木
var STONE_RATE = 'stone_rate'; // 石
var IRON_RATE = 'iron_rate';   // 鉄
var RICE_RATE = 'rice_rate';   // 糧
var YN_RICE_ROKAKU = 'yn_rice_rokaku';   // 糧ループ
//仁君設定
var JIN_LABEL = 'jin_label';           // ラベル
var JIN_SKILLV = 'jin_skillv';         // スキルレベル
// 神医の施術設定
var SEJYU_LABEL = 'sejyu_label';       // ラベル
var SEJYU_SKILLV = 'sejyu_skillv';     // スキルレベル
//弓腰姫の愛設定
var KYUYOKI_LABEL = 'kyuyoki_label';   // ラベル
var KYUYOKI_SKILLV = 'kyuyoki_skillv'; // スキルレベル
//皇后の慈愛
var KGJAI_LABEL = 'kgjai_label';       // ラベル
var KGJAI_SKILLV = 'kgjai_skillv';     // スキルレベル
//桃色吐息:
var MOMO_LABEL = 'momo_label';         // ラベル
var MOMO_SKILLV = 'momo_skillv';       // スキルレベル
//酔吟吐息
var SUIGIN_LABEL = 'suigin_label';     // ラベル
var SUIGIN_SKILLV = 'suigin_skillv';   // スキルレベル
//文姫の慈愛
var BNKJAI_LABEL = 'bnkjai_label';     // ラベル
var BNKJAI_SKILLV = 'bnkjai_skillv';   // スキルレベル
//神卜の方術
var SINBK_LABEL = 'sinbk_label';       // ラベル
var SINBK_SKILLV = 'sinbk_skillv';     // スキルレベル
//娘々敬慕
var NNKEB_LABEL = 'nnkeb_label';       // ラベル
var NNKEB_SKILLV = 'nnkeb_skillv';     // スキルレベル
//熊猫の麺匠
var PNDMEN_LABEL = 'pndmen_label';     // ラベル
var PNDMEN_SKILLV = 'pndmen_skillv';   // スキルレベル

// 神医の術式設定
var JYUTU_LABEL = 'jyutu_label';       // ラベル
var JYUTU_SKILLV = 'jyutu_skillv';     // スキルレベル
//劉備の契り
var CIGIRI_LABEL = 'cigiri_label';     // ラベル
var CIGIRI_SKILLV = 'cigiri_skillv';   // スキルレベル
//神卜の術式
var BKJYUTU_LABEL = 'bkjyutu_label';   // ラベル
var BKJYUTU_SKILLV = 'bkjyutu_skillv'; // スキルレベル
//傾国設定
var KEI_LABEL = 'kei_label';           // ラベル
var KEI_SKILLV = 'kei_skillv';         // スキルレベル
//回復時用の空きコスト
var YN_RKKAI = 'yn_rkkai';             //デッキコスト空き
var RKKAICST = 'rkkaicst';             //コスト空き

//メイン2
var YN_BMNAME = 'yn_bmname';          //簡易出兵先名チェック
//カード名からの座標指定（１）
var YN_DECAREA1 = 'yn_decarea1';      //有効無効
var DECAREACD1 = 'decareacd1';        //カード名
var DECAREA1_X = 'decarea1_x';        //x軸
var DECAREA1_Y = 'decarea1_y';        //y軸
var DECNOTE1 = 'decnote1';            //メモ
//カード名からの座標指定（２）
var YN_DECAREA2 = 'yn_decarea2';      //有効無効
var DECAREACD2 = 'decareacd2';        //カード名
var DECAREA2_X = 'decarea2_x';        //x軸
var DECAREA2_Y = 'decarea2_y';        //y軸
var DECNOTE2 = 'decnote2';            //メモ
//カード名からの座標指定（３）
var YN_DECAREA3 = 'yn_decarea3';      //有効無効
var DECAREACD3 = 'decareacd3';        //カード名
var DECAREA3_X = 'decarea3_x';        //x軸
var DECAREA3_Y = 'decarea3_y';        //y軸
var DECNOTE3 = 'decnote3';            //メモ
//カード名からの座標指定（４）
var YN_DECAREA4 = 'yn_decarea4';      //有効無効
var DECAREACD4 = 'decareacd4';        //カード名
var DECAREA4_X = 'decarea4_x';        //x軸
var DECAREA4_Y = 'decarea4_y';        //y軸
var DECNOTE4 = 'decnote4';            //メモ
//カード名からの座標指定（５）
var YN_DECAREA5 = 'yn_decarea5';      //有効無効
var DECAREACD5 = 'decareacd5';        //カード名
var DECAREA5_X = 'decarea5_x';        //x軸
var DECAREA5_Y = 'decarea5_y';        //y軸
var DECNOTE5 = 'decnote5';            //メモ
//カード名からの座標指定（６）
var YN_DECAREA6 = 'yn_decarea6';      //有効無効
var DECAREACD6 = 'decareacd6';        //カード名
var DECAREA6_X = 'decarea6_x';        //x軸
var DECAREA6_Y = 'decarea6_y';        //y軸
var DECNOTE6 = 'decnote6';            //メモ
//カード名からの座標指定（７）
var YN_DECAREA7 = 'yn_decarea7';      //有効無効
var DECAREACD7 = 'decareacd7';        //カード名
var DECAREA7_X = 'decarea7_x';        //x軸
var DECAREA7_Y = 'decarea7_y';        //y軸
var DECNOTE7 = 'decnote7';            //メモ
//カード名からの座標指定（８）
var YN_DECAREA8 = 'yn_decarea8';      //有効無効
var DECAREACD8 = 'decareacd8';        //カード名
var DECAREA8_X = 'decarea8_x';        //x軸
var DECAREA8_Y = 'decarea8_y';        //y軸
var DECNOTE8 = 'decnote8';            //メモ
//カード名からの座標指定（９）
var YN_DECAREA9 = 'yn_decarea9';      //有効無効
var DECAREACD9 = 'decareacd9';        //カード名
var DECAREA9_X = 'decarea9_x';        //x軸
var DECAREA9_Y = 'decarea9_y';        //y軸
var DECNOTE9 = 'decnote9';            //メモ
//カード名からの座標指定（１０）
var YN_DECAREA10 = 'yn_decarea10';    //有効無効
var DECAREACD10 = 'decareacd10';      //カード名
var DECAREA10_X = 'decarea10_x';      //x軸
var DECAREA10_Y = 'decarea10_y';      //y軸
var DECNOTE10 = 'decnote10';          //メモ

var decareanum=10;                    //座標指定最大数

//鹵獲開始時間予約
var RKK_RES_STARTMON = 'rkk_res_startmon';    // 月
var RKK_RES_STARTDAY = 'rkk_res_startday';    // 日
var RKK_RES_STARTHOUR = 'rkk_res_starthour';  // 時
var RKK_RES_STARTMIN = 'rkk_res_startmin';    // 分
//鹵獲停止時間予約
var RKK_RES_STOPMON = 'rkk_res_stopmon';     // 月
var RKK_RES_STOPDAY = 'rkk_res_stopday';     // 日
var RKK_RES_STOPHOUR = 'rkk_res_stophour';   // 時
var RKK_RES_STOPMIN = 'rkk_res_stopmin';     // 分
//鹵獲再開時間予約
var RKK_RES_RESTARTMON = 'rkk_res_restartmon';    // 月
var RKK_RES_RESTARTDAY = 'rkk_res_restartday';    // 日
var RKK_RES_RESTARTHOUR = 'rkk_res_restarthour';  // 時
var RKK_RES_RESTARTMIN = 'rkk_res_restartmin';    // 分

//しきい値攻撃
var YN_ATTKCHK = 'yn_attkchk';        //有効無効
var ATTKCHK = 'attkchk';              //攻撃値
//しきい値速度
var YN_SPEEDCHK = 'yn_speedchk';     //有効無効
var SPEEDCHK = 'speedchk';           //速度値

//鹵獲スキル
//鹵獲スキル設定
var ROKAKU_LABEL = 'rokaku_label';       // ラベル
//全軍系（１）
var YN_ROKAKUZEN1 = 'yn_rokakuzen1';     // 有効無効
var ROKAKU_ZANCD1 = 'rokaku_zancd1';     // カード名
var ROKAKU_ZANLBL1 = 'rokaku_zanlbl1';   // ラベル
var ROKAKU_ZANCST1 = 'rokaku_zancst1';   // コスト
// 全軍系（２）
var YN_ROKAKUZEN2 = 'yn_rokakuzen2';     // 有効無効
var ROKAKU_ZANCD2 = 'rokaku_zancd2';     // カード名
var ROKAKU_ZANLBL2 = 'rokaku_zanlbl2';   // ラベル
var ROKAKU_ZANCST2 = 'rokaku_zancst2';   // コスト
// 全軍系（３）
var YN_ROKAKUZEN3 = 'yn_rokakuzen3';     // 有効無効
var ROKAKU_ZANCD3 = 'rokaku_zancd3';     // カード名
var ROKAKU_ZANLBL3 = 'rokaku_zanlbl3';   // ラベル
var ROKAKU_ZANCST3 = 'rokaku_zancst3';   // コスト
// 全軍系（４）
var YN_ROKAKUZEN4 = 'yn_rokakuzen4';     // 有効無効
var ROKAKU_ZANCD4 = 'rokaku_zancd4';     // カード名
var ROKAKU_ZANLBL4 = 'rokaku_zanlbl4';   // ラベル
var ROKAKU_ZANCST4 = 'rokaku_zancst4';   // コスト
// 全軍系（５）
var YN_ROKAKUZEN5 = 'yn_rokakuzen5';     // 有効無効
var ROKAKU_ZANCD5 = 'rokaku_zancd5';     // カード名
var ROKAKU_ZANLBL5 = 'rokaku_zanlbl5';   // ラベル
var ROKAKU_ZANCST5 = 'rokaku_zancst5';   // コスト

var rkkzennum=5;

// 出兵有無
var YN_RKZENDK = 'yn_rkzendk';
// 使用する鹵獲スキル
var ROKAKU_USEDSKIL1 = 'rokaku_usedskil1';    // 劉備の大徳
var ROKAKU_USEDSKIL2 = 'rokaku_usedskil2';    // 鬼神の鹵獲
var ROKAKU_USEDSKIL3 = 'rokaku_usedskil3';    // 猛将の鹵獲
var ROKAKU_USEDSKIL4 = 'rokaku_usedskil4';    // 趁火打劫
var ROKAKU_USEDSKIL5 = 'rokaku_usedskil5';    // 迅速劫略
var ROKAKU_USEDSKIL6 = 'rokaku_usedskil6';    // 神速劫略
var ROKAKU_USEDSKIL7 = 'rokaku_usedskil7';    // 龍神の縮地劫略
var ROKAKU_USEDSKIL8 = 'rokaku_usedskil8';    // 鬼神の縮地劫略
var ROKAKU_USEDSKIL9 = 'rokaku_usedskil9';    // 猛将の縮地劫略
var ROKAKU_USEDSKIL10 = 'rokaku_usedskil10';  // 猛暑の縮地収穫
var ROKAKU_USEDSKIL11 = 'rokaku_usedskil11';  // 桃賊の襲撃
//使用する回復スキル
var FLERECSKIL1 ='flerecskil1';
//使用しない回復スキル
var UNRECSKIL1 ='unrecskil1';

// 鹵獲パッシブ
// 鹵獲カード（１）
var YN_ROKAKUP1 = 'yn_rokakup1';     // 有効無効
var ROKAKUP_CD1 = 'rokakup_cd1';     // カード名
var ROKAKUP_CST1 = 'rokakup_cst1';   // コスト
var ROKAKUP_LBL1 = 'rokakup_lbl1';   // ラベル
var YN_USEKEI1='yn_usekei1';         // 傾国使用
// 鹵獲カード（２）
var YN_ROKAKUP2 = 'yn_rokakup2';     // 有効無効
var ROKAKUP_CD2 = 'rokakup_cd2';     // カード名
var ROKAKUP_CST2 = 'rokakup_cst2';   // コスト
var ROKAKUP_LBL2 = 'rokakup_lbl2';   // ラベル
var YN_USEKEI2='yn_usekei2';         // 傾国使用
// 鹵獲カード（３）
var YN_ROKAKUP3 = 'yn_rokakup3';     // 有効無効
var ROKAKUP_CD3 = 'rokakup_cd3';     // カード名
var ROKAKUP_CST3 = 'rokakup_cst3';   // コスト
var ROKAKUP_LBL3 = 'rokakup_lbl3';   // ラベル
var YN_USEKEI3='yn_usekei3';         // 傾国使用
// 鹵獲カード（４）
var YN_ROKAKUP4 = 'yn_rokakup4';     // 有効無効
var ROKAKUP_CD4 = 'rokakup_cd4';     // カード名
var ROKAKUP_CST4 = 'rokakup_cst4';   // コスト
var ROKAKUP_LBL4 = 'rokakup_lbl4';   // ラベル
var YN_USEKEI4='yn_usekei4';         // 傾国使用
// 鹵獲カード（５）
var YN_ROKAKUP5 = 'yn_rokakup5';     // 有効無効
var ROKAKUP_CD5 = 'rokakup_cd5';     // カード名
var ROKAKUP_CST5 = 'rokakup_cst5';   // コスト
var ROKAKUP_LBL5 = 'rokakup_lbl5';   // ラベル
var YN_USEKEI5='yn_usekei5';         // 傾国使用
// 鹵獲カード（６）
var YN_ROKAKUP6 = 'yn_rokakup6';     // 有効無効
var ROKAKUP_CD6 = 'rokakup_cd6';     // カード名
var ROKAKUP_CST6 = 'rokakup_cst6';   // コスト
var ROKAKUP_LBL6 = 'rokakup_lbl6';   // ラベル
var YN_USEKEI6='yn_usekei6';         // 傾国使用
// 鹵獲カード（７）
var YN_ROKAKUP7 = 'yn_rokakup7';     // 有効無効
var ROKAKUP_CD7 = 'rokakup_cd7';     // カード名
var ROKAKUP_CST7 = 'rokakup_cst7';   // コスト
var ROKAKUP_LBL7 = 'rokakup_lbl7';   // ラベル
var YN_USEKEI7='yn_usekei7';         // 傾国使用
// 鹵獲カード（８）
var YN_ROKAKUP8 = 'yn_rokakup8';     // 有効無効
var ROKAKUP_CD8 = 'rokakup_cd8';     // カード名
var ROKAKUP_CST8 = 'rokakup_cst8';   // コスト
var ROKAKUP_LBL8 = 'rokakup_lbl8';   // ラベル
var YN_USEKEI8='yn_usekei8';         // 傾国使用
// 鹵獲カード（９）
var YN_ROKAKUP9 = 'yn_rokakup9';     // 有効無効
var ROKAKUP_CD9 = 'rokakup_cd9';     // カード名
var ROKAKUP_CST9 = 'rokakup_cst9';   // コスト
var ROKAKUP_LBL9 = 'rokakup_lbl9';   // ラベル
var YN_USEKEI9='yn_usekei9';         // 傾国使用
// 鹵獲カード（１０）
var YN_ROKAKUP10 = 'yn_rokakup10';     // 有効無効
var ROKAKUP_CD10 = 'rokakup_cd10';     // カード名
var ROKAKUP_CST10 = 'rokakup_cst10';   // コスト
var ROKAKUP_LBL10 = 'rokakup_lbl10';   // ラベル
var YN_USEKEI10='yn_usekei10';         // 傾国使用
// 鹵獲カード（１１）
var YN_ROKAKUP11 = 'yn_rokakup11';     // 有効無効
var ROKAKUP_CD11 = 'rokakup_cd11';     // カード名
var ROKAKUP_CST11 = 'rokakup_cst11';   // コスト
var ROKAKUP_LBL11 = 'rokakup_lbl11';   // ラベル
var YN_USEKEI11='yn_usekei11';         // 傾国使用
// 鹵獲カード（１２）
var YN_ROKAKUP12 = 'yn_rokakup12';     // 有効無効
var ROKAKUP_CD12 = 'rokakup_cd12';     // カード名
var ROKAKUP_CST12 = 'rokakup_cst12';   // コスト
var ROKAKUP_LBL12 = 'rokakup_lbl12';   // ラベル
var YN_USEKEI12='yn_usekei12';         // 傾国使用
// 鹵獲カード（１３）
var YN_ROKAKUP13 = 'yn_rokakup13';     // 有効無効
var ROKAKUP_CD13 = 'rokakup_cd13';     // カード名
var ROKAKUP_CST13 = 'rokakup_cst13';   // コスト
var ROKAKUP_LBL13 = 'rokakup_lbl13';   // ラベル
var YN_USEKEI13='yn_usekei13';         // 傾国使用

var rkknum=13;

var YN_RKPDK = 'yn_rkpdk';          // 出兵有無
var YN_RKPJYUTU = 'yn_rkpjyutu';    // 神医使用有無
var YN_RKPJIN = 'yn_rkpjin';        // 仁君使用有無
var RKPJINHP = 'rkpjinhp';          // 仁君使用HP

//使用する回復スキル
var RECSKIL2 ='recskil2';
//使用しない回復スキル
var UNRECSKIL2 ='unrecskil2';

//全軍系（１）
var YN_ROKAKUPZEN1 = 'yn_rokakupzen1';   // 有効無効
var ROKAKUP_ZANCD1 = 'rokakup_zancd1';   // カード名
var ROKAKUP_ZANLBL1 = 'rokakup_zanlbl1'; // ラベル
var ROKAKUP_ZANCST1 = 'rokakup_zancst1'; // コスト
//全軍系（２）
var YN_ROKAKUPZEN2 = 'yn_rokakupzen2';   // 有効無効
var ROKAKUP_ZANCD2 = 'rokakup_zancd2';   // カード名
var ROKAKUP_ZANLBL2 = 'rokakup_zanlbl2'; // ラベル
var ROKAKUP_ZANCST2 = 'rokakup_zancst2'; // コスト
//全軍系（３）
var YN_ROKAKUPZEN3 = 'yn_rokakupzen3';   // 有効無効
var ROKAKUP_ZANCD3 = 'rokakup_zancd3';   // カード名
var ROKAKUP_ZANLBL3 = 'rokakup_zanlbl3'; // ラベル
var ROKAKUP_ZANCST3 = 'rokakup_zancst3'; // コスト
//全軍系（４）
var YN_ROKAKUPZEN4 = 'yn_rokakupzen4';   // 有効無効
var ROKAKUP_ZANCD4 = 'rokakup_zancd4';   // カード名
var ROKAKUP_ZANLBL4 = 'rokakup_zanlbl4'; // ラベル
var ROKAKUP_ZANCST4 = 'rokakup_zancst4'; // コスト
//全軍系（５）
var YN_ROKAKUPZEN5 = 'yn_rokakupzen5';   // 有効無効
var ROKAKUP_ZANCD5 = 'rokakup_zancd5';   // カード名
var ROKAKUP_ZANLBL5 = 'rokakup_zanlbl5'; // ラベル
var ROKAKUP_ZANCST5 = 'rokakup_zancst5'; // コスト

var rkkpznum=5;

var YN_RKPZENDK = 'yn_rkpzendk';       //出兵有無
//傾国回復デッキ下ろすカード
var KEI_DKCD = 'kei_dkcd';             // カード名
var KEI_DKLBL = 'kei_dklbl';           // ラベル

//帰還時間で回復
var YN_JINKIKAN = 'yn_jinkikan';
var RKPJINKIKAN = 'rkpjinkikan';

//入替予約
var RKK_RES_VIL = 'rkk_res_vil';       // セット拠点
var RKK_RES_MON = 'rkk_res_mon';       // 月
var RKK_RES_DAY = 'rkk_res_day';       // 日
var RKK_RES_HOUR = 'rkk_res_hour';     // 時間
var RKK_RES_MIN = 'rkk_res_min';       // 分
//var RKK_RES_CHK = 'rkk_res_chk';       // 実行
//予約カード１
var RKK_YN_RES1 = 'rkk_yn_res1';       // 有効無効
var RKK_RESCD1 = 'rkk_rescd1';         // カード名
var RKK_RESCDID1 = 'rkk_rescdid1';     // カードID
var RKK_RESLBL1 = 'rkk_reslbl1';       // ラベル
var RKK_RESCST1 = 'rkk_rescst1';       // コスト
var RKK_RESSKL1 = 'rkk_resskl1';       // 発動スキル
//予約カード２
var RKK_YN_RES2 = 'rkk_yn_res2';       // 有効無効
var RKK_RESCD2 = 'rkk_rescd2';         // カード名
var RKK_RESCDID2 = 'rkk_rescdid2';     // カードID
var RKK_RESLBL2 = 'rkk_reslbl2';       // ラベル
var RKK_RESCST2 = 'rkk_rescst2';       // コスト
var RKK_RESSKL2 = 'rkk_resskl2';       // 発動スキル
//予約カード３
var RKK_YN_RES3 = 'rkk_yn_res3';       // 有効無効
var RKK_RESCD3 = 'rkk_rescd3';         // カード名
var RKK_RESCDID3 = 'rkk_rescdid3';     // カードID
var RKK_RESLBL3 = 'rkk_reslbl3';       // ラベル
var RKK_RESCST3 = 'rkk_rescst3';       // コスト
var RKK_RESSKL3 = 'rkk_resskl3';       // 発動スキル
//予約カード４
var RKK_YN_RES4 = 'rkk_yn_res4';       // 有効無効
var RKK_RESCD4 = 'rkk_rescd4';         // カード名
var RKK_RESCDID4 = 'rkk_rescdid4';     // カードID
var RKK_RESLBL4 = 'rkk_reslbl4';       // ラベル
var RKK_RESCST4 = 'rkk_rescst4';       // コスト
var RKK_RESSKL4 = 'rkk_resskl4';       // 発動スキル
//予約カード５
var RKK_YN_RES5 = 'rkk_yn_res5';       // 有効無効
var RKK_RESCD5 = 'rkk_rescd5';         // カード名
var RKK_RESCDID5 = 'rkk_rescdid5';     // カードID
var RKK_RESLBL5 = 'rkk_reslbl5';       // ラベル
var RKK_RESCST5 = 'rkk_rescst5';       // コスト
var RKK_RESSKL5 = 'rkk_resskl5';       // 発動スキル
//予約カード６
var RKK_YN_RES6 = 'rkk_yn_res6';       // 有効無効
var RKK_RESCD6 = 'rkk_rescd6';         // カード名
var RKK_RESCDID6 = 'rkk_rescdid6';     // カードID
var RKK_RESLBL6 = 'rkk_reslbl6';       // ラベル
var RKK_RESCST6 = 'rkk_rescst6';       // コスト
var RKK_RESSKL6 = 'rkk_resskl6';       // 発動スキル
//予約カード７
var RKK_YN_RES7 = 'rkk_yn_res7';       // 有効無効
var RKK_RESCD7 = 'rkk_rescd7';         // カード名
var RKK_RESCDID7 = 'rkk_rescdid7';     // カードID
var RKK_RESLBL7 = 'rkk_reslbl7';       // ラベル
var RKK_RESCST7 = 'rkk_rescst7';       // コスト
var RKK_RESSKL7 = 'rkk_resskl7';       // 発動スキル
//予約カード８
var RKK_YN_RES8 = 'rkk_yn_res8';       // 有効無効
var RKK_RESCD8 = 'rkk_rescd8';         // カード名
var RKK_RESCDID8 = 'rkk_rescdid8';     // カードID
var RKK_RESLBL8 = 'rkk_reslbl8';       // ラベル
var RKK_RESCST8 = 'rkk_rescst8';       // コスト
var RKK_RESSKL8 = 'rkk_resskl8';       // 発動スキル
//予約カード９
var RKK_YN_RES9 = 'rkk_yn_res9';       // 有効無効
var RKK_RESCD9 = 'rkk_rescd9';         // カード名
var RKK_RESCDID9 = 'rkk_rescdid9';     // カードID
var RKK_RESLBL9 = 'rkk_reslbl9';       // ラベル
var RKK_RESCST9 = 'rkk_rescst9';       // コスト
var RKK_RESSKL9 = 'rkk_resskl9';       // 発動スキル
//予約カード１０
var RKK_YN_RES10 = 'rkk_yn_res10';     // 有効無効
var RKK_RESCD10 = 'rkk_rescd10';       // カード名
var RKK_RESCDID10 = 'rkk_rescdid10';   // カードID
var RKK_RESLBL10 = 'rkk_reslbl10';     // ラベル
var RKK_RESCST10 = 'rkk_rescst10';     // コスト
var RKK_RESSKL10 = 'rkk_resskl10';     // 発動スキル
//予約カード１１
var RKK_YN_RES11 = 'rkk_yn_res11';     // 有効無効
var RKK_RESCD11 = 'rkk_rescd11';       // カード名
var RKK_RESCDID11 = 'rkk_rescdid11';   // カードID
var RKK_RESLBL11 = 'rkk_reslbl11';     // ラベル
var RKK_RESCST11 = 'rkk_rescst11';     // コスト
var RKK_RESSKL11 = 'rkk_resskl11';     // 発動スキル
//予約カード１２
var RKK_YN_RES12 = 'rkk_yn_res12';     // 有効無効
var RKK_RESCD12 = 'rkk_rescd12';       // カード名
var RKK_RESCDID12 = 'rkk_rescdid12';   // カードID
var RKK_RESLBL12 = 'rkk_reslbl12';     // ラベル
var RKK_RESCST12 = 'rkk_rescst12';     // コスト
var RKK_RESSKL12 = 'rkk_resskl12';     // 発動スキル
//予約カード１３
var RKK_YN_RES13 = 'rkk_yn_res13';     // 有効無効
var RKK_RESCD13 = 'rkk_rescd13';       // カード名
var RKK_RESCDID13 = 'rkk_rescdid13';   // カードID
var RKK_RESLBL13 = 'rkk_reslbl13';     // ラベル
var RKK_RESCST13 = 'rkk_rescst13';     // コスト
var RKK_RESSKL13 = 'rkk_resskl13';     // 発動スキル
//予約カード１４
var RKK_YN_RES14 = 'rkk_yn_res14';     // 有効無効
var RKK_RESCD14 = 'rkk_rescd14';       // カード名
var RKK_RESCDID14 = 'rkk_rescdid14';   // カードID
var RKK_RESLBL14 = 'rkk_reslbl14';     // ラベル
var RKK_RESCST14 = 'rkk_rescst14';     // コスト
var RKK_RESSKL14 = 'rkk_resskl14';     // 発動スキル
//予約カード１５
var RKK_YN_RES15 = 'rkk_yn_res15';     // 有効無効
var RKK_RESCD15 = 'rkk_rescd15';       // カード名
var RKK_RESCDID15 = 'rkk_rescdid15';   // カードID
var RKK_RESLBL15 = 'rkk_reslbl15';     // ラベル
var RKK_RESCST15 = 'rkk_rescst15';     // コスト
var RKK_RESSKL15 = 'rkk_resskl15';     // 発動スキル

var rkkresnum=15;

var EXPAREA = 'exparea';              // exp/imp area
var ROKAKU_LOG="";
var LOGCOUNT='logcount';              // ログ件数
var NGCDLIST="";
var DEBUGFLG = 'debugflg';            //デバッグフラグ

//遠訓貯金
var RKK_YN_ENBANK = 'rkk_yn_enbank';      // 遠訓貯金フラグ

var RKK_WOOD_LIMIT = 'rkk_wood_limit';    // 木しきい値
var RKK_STONE_LIMIT = 'rkk_stone_limit';  // 石しきい値
var RKK_IRON_LIMIT = 'rkk_iron_limit';    // 鉄しきい値
var RKK_RICE_LIMIT = 'rkk_rice_limit';    // 糧しきい値

var RKK_NOTBANKVIL1 = 'rkk_notbankvil1';  // 対象外拠点
var RKK_NOTBANKVIL2 = 'rkk_notbankvil2';  // 対象外拠点
var RKK_NOTBANKVIL3 = 'rkk_notbankvil3';  // 対象外拠点
var RKK_NOTBANKVIL4 = 'rkk_notbankvil4';  // 対象外拠点
var RKK_NOTBANKVIL5 = 'rkk_notbankvil5';  // 対象外拠点

var RKK_YN_ENVIEW = 'rkk_yn_enview';      // 遠訓貯金状況表示

// 自動寄付
var RKK_YN_AUTODONATION = 'rkk_yn_autodonation';      // 自動寄付フラグ

var RKK_AD_WOOD_LIMIT = 'rkk_ad_wood_limit';    // 木しきい値
var RKK_AD_STONE_LIMIT = 'rkk_ad_stone_limit';  // 石しきい値
var RKK_AD_IRON_LIMIT = 'rkk_ad_iron_limit';    // 鉄しきい値
var RKK_AD_RICE_LIMIT = 'rkk_ad_rice_limit';    // 糧しきい値

var RKK_AD_WOOD = 'rkk_ad_wood';    // 木寄付額
var RKK_AD_STONE = 'rkk_ad_stone';  // 石寄付額
var RKK_AD_IRON = 'rkk_ad_iron';    // 鉄寄付額
var RKK_AD_RICE = 'rkk_ad_rice';    // 糧寄付額

// オプション設定管理用
var rokakuflg = "stop";
var m_rokaku_options;
var selectValues1 = { "1": "1", "2": "2","3": "3" };
var selectValues2 = { };
var selectValues3= { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10","11":"11","12":"12","13":"13","14":"14" };
var selectValues4= { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10" };
var selectValues5 = { "1": "1", "2": "1.5","3": "2","4":"2.5","5":"3","6":"3.5","7":"4","8":"4.5"};
var defrecskil = { "1":"仁君",  "2":"神医の施術",  "3":"弓腰姫の愛",  "4":"皇后の慈愛",  "5":"桃色吐息",
                  "6":"酔吟吐息",  "7":"文姫の慈愛",  "8":"神卜の方術",  "9":"娘々敬慕",  "10":"神医の術式",  "11":"劉備の契り",  "12":"神卜の術式",  "13":"熊猫の麺匠"};
var defunrecskil = { };
var defflerecskil = { "1":"神医の術式",  "2":"劉備の契り",  "3":"神卜の術式"};
var rokakuskillist = { "1":"劉備の大徳",  "2":"鬼神の鹵獲",  "3":"猛将の鹵獲",  "4":"趁火打劫",  "5":"迅速劫略",
                      "6":"神速劫略",  "7":"龍神の縮地劫略",  "8":"鬼神の縮地劫略",  "9":"猛将の縮地劫略",  "10":"猛暑の縮地収穫",  "11":"桃賊の襲撃"};
var waitskillist = [ "仁君", "皇后の慈愛", "文姫の慈愛"];

//遠訓貯金資源最低値
var rrk_enkdf_wood=7500000;
var rrk_enkdf_stone=9000000;
var rrk_enkdf_iron=11500000;
var rrk_enkdf_rice=10000000;

var m_EndFlag=0;
var addflg=0;
var statngnum=5;

//----------------//
// メインルーチン //
//----------------//
(function() {
    //前回のリロードから30分以上経っていればツールOFF
    var dt = new Date();
    var dt2=GM_getValue(GM_KEY + '_chktime', null);
    if (dt2!=null){
        var diff = dt.getTime() - Date.parse(dt2);
        var minute = diff/(1000*60);
        if (minute>30){
            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
        }
    } else {
        GM_setValue(GM_KEY +"RokakuAutoFlg", false);
    }
    GM_setValue(GM_KEY + '_chktime', dt);
    var startflg=GM_getValue(GM_KEY + "_startflg",0);
    if (startflg==1){
        //各ラベルのページ数を取得
        setlblpage();
        GM_setValue(GM_KEY + "_startflg",0);
    }

    // 実行判定
    if (rkkisExecute() === false) {
        return;
    }
    // 設定のロード
    loadRokakuSettings();
    rcreateSettingWindow();

    // 君主プロフィール
    if (location.pathname == "/user/" || location.pathname == "/user/index.php") {
        rkksaveUserProfile();
    }
    // 都市画面
    if (location.pathname == "/village.php") {
        // セッションIDの取得
        var session_id = rkkgetSessionId();
        if( session_id === "" ){
            alert("ページの仕様が変更されたため情報が取れませんでした。");
            return;
        }
        //遠訓貯金残り時間
        if (m_rokaku_options[RKK_YN_ENVIEW]==true){
            //遠訓貯金表示の全画面取得時間
            var enkviewtime=GM_getValue(GM_KEY +"_enkviewtime", "");
            if (enkviewtime!=""){
                var dt = new Date();
                var diff = dt.getTime() - Date.parse(enkviewtime);
                //24時間以上経過しているかどうか
                if (diff > 86400000){
                    //画面に描写
                    rkkdrawenktimer();
                    //全ページ読み込み
                    rkk_allvil();
                    rkkgetenklist();
                    GM_setValue(GM_KEY +"_enkviewtime", dt.toString());
                } else {
                    rkkgetenktime();
                }
            } else {
                //画面に描写
                rkkdrawenktimer();
                //全ページ読み込み
                rkk_allvil();
                rkkgetenklist();
                var dt = new Date();
                GM_setValue(GM_KEY +"_enkviewtime", dt.toString());
            }
        }
        //入替予約設定チェック
        var l_resflg=GM_getValue(GM_KEY + '_resfun', 0);
        var l_resrestartflg=GM_getValue(GM_KEY +"_resrestartflg", false);
        if ((l_resrestartflg!=true) && (l_resflg!=2)){
            var rk_restime=GM_getValue(GM_KEY +"_restime", "");
            if (rk_restime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_restime){
                    //予約設定に移る
                    GM_setValue(GM_KEY + '_resfun', 1);
                    var diff = dt.getTime() - rk_restime;
                    var minute = diff/(1000*60);
                    if (minute>60){
                        //1時間経っても乗せ変わらないなら処理停止
                        //開始予約があるかチェック
                        if ((GM_getValue(GM_KEY + '_resrestartfun', false)==true)||
                            ((GM_getValue(GM_KEY + '_resrestartfun', false)!=true) && (GM_getValue(GM_KEY +"_resrestarttime", "")==""))){
                            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                        } else {
                            GM_setValue(GM_KEY +"_resrestartflg", true);
                            GM_setValue(GM_KEY + '_resfun', 2);
                        }
                    }
                }
            }
        }
        //停止予約チェック
        var l_resstopflg=GM_getValue(GM_KEY + '_resstopfun', false);
        if (l_resstopflg!=true){
            var rk_resstoptime=GM_getValue(GM_KEY +"_resstoptime", "");
            if (rk_resstoptime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resstoptime){
                    //停止
                    setrokakulog("鹵獲ツールを停止します");
                    GM_setValue(GM_KEY + '_resstopfun', true);
                    //開始予約があるかチェック
                    if ((GM_getValue(GM_KEY + '_resrestartfun', false)==true)||
                        ((GM_getValue(GM_KEY + '_resrestartfun', false)!=true) && (GM_getValue(GM_KEY +"_resrestarttime", "")==""))){
                        GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                    } else {
                        GM_setValue(GM_KEY +"_resrestartflg", true);
                    }
                    l_resstopflg=true;
                }
            }
        }
        //開始予約チェック
        var l_resstartstep=0;
        var l_resstartflg=GM_getValue(GM_KEY + '_resstartfun', false);
        if (l_resstartflg!=true){
            var rk_resstarttime=GM_getValue(GM_KEY +"_resstarttime", "");
            if (rk_resstarttime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resstarttime){
                    var diff = dt.getTime() - rk_resstarttime;
                    var minute = diff/(1000*60);
                    if (minute<60){
                        //開始
                        setrokakulog("鹵獲ツールを開始します");
                        l_resstartstep=1;
                        getdecklist();         //デッキのカード情報取得
                        //デッキからすべてのカードを下す
                        if (rrk_res_startunset()==0){
                            GM_setValue(GM_KEY + '_resstartfun', true);
                        }
                    } else {
                        GM_setValue(GM_KEY + '_resstartfun', true);
                    }
                } else {
                    //スタートしない
                    l_resstartstep=2;
                    rkwait(60).done(function() {
                        location.reload();
                    });
                }
            }
        }

        //再開予約チェック
        var l_resrestarfun=GM_getValue(GM_KEY + '_resrestartfun', false);
        var l_resrestartflg=GM_getValue(GM_KEY +"_resrestartflg", false);
        var l_resflg=GM_getValue(GM_KEY + '_resfun', 0);  //入替予約状況
        if (((l_resrestarfun!=true) && (l_resrestartflg==true)) || ((l_resflg==1) && (l_resrestartflg!=true))){
            var rk_resrestarttime=GM_getValue(GM_KEY +"_resrestarttime", "");
            if (rk_resrestarttime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resrestarttime){
                    if ((l_resflg==1) && (l_resrestartflg!=true)){
                        GM_setValue(GM_KEY +"_resrestartflg", true);
                        GM_setValue(GM_KEY + '_resfun', 2);
                    }
                    var diff = dt.getTime() - rk_resrestarttime;
                    var minute = diff/(1000*60);
                    if (minute<60){
                        //再開
                        setrokakulog("鹵獲ツールを再開します");
                        getdecklist();         //デッキのカード情報取得
                        //デッキからすべてのカードを下す
                        if (rrk_res_startunset()==0){
                            GM_setValue(GM_KEY + '_resrestartfun', true);
                            GM_setValue(GM_KEY +"_resrestartflg", false);
                        }
                    } else {
                        GM_setValue(GM_KEY + '_resrestartfun', true);
                        GM_setValue(GM_KEY +"_resrestartflg", false);
                    }
                }
            }
        }
        // 自動寄付
        if (m_rokaku_options[RKK_YN_AUTODONATION]==true){
            rkk_autodonation();
        }

        //鹵獲設定確認
        var l_cdtrolflg=GM_getValue(GM_KEY +"_cdtrolflg", false);
        var l_rokakuautoflg=GM_getValue(GM_KEY +"RokakuAutoFlg", false);
        var l_resrestartflg=GM_getValue(GM_KEY +"_resrestartflg", false);
        var l_resflg=GM_getValue(GM_KEY + '_resfun', 0);  //入替予約状況
        if (((l_resflg==0)&&(l_resstopflg!=true)&&(l_resstartstep!=2)&&(l_cdtrolflg!=true)&&(l_resrestartflg!=true)) ||
            ((l_resstopflg==true)&&(l_resrestartflg!=true)) || ((l_resflg==2) && (l_resrestartflg!=true))) {
            // 鹵獲処理
            if(l_rokakuautoflg==true){
                rokakutool();
             }
        } else if ((l_resflg==1) && (l_rokakuautoflg==true)){
            //予約処理
            getdecklist();    //デッキのカード情報取得
            rrk_res_unset();  //デッキからすべてのカードを下す
            //予約カードをデッキに乗せる
            if (rrk_res_cdset()!=0) {
                rkwait(60).done(function() {
                    location.reload();
                });
            } else {
                //予約カードがデッキに全部のった
                //再開予約があるかチェック
                if ((GM_getValue(GM_KEY + '_resrestartfun', false)==true)||
                    ((GM_getValue(GM_KEY + '_resrestartfun', false)!=true) && (GM_getValue(GM_KEY +"_resrestarttime", "")==""))){
                    GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                } else {
                    GM_setValue(GM_KEY +"_resrestartflg", true);
                    GM_setValue(GM_KEY + '_resfun', 2);
                    rkwait(60).done(function() {
                        location.reload();
                    });
                }
            }
        } else if (((l_cdtrolflg==true) && (l_rokakuautoflg==true)) || ((l_resrestartflg==true) && (l_rokakuautoflg==true))){
            rkwait(60).done(function() {
                location.reload();
            });
        }
    }
    //領地画面
    if (location.pathname == "/land.php") {
        getrokakuarea();
    }
    //デッキ画面
    if (location.pathname == "/card/deck.php") {
        getrokakusetcd();
    }
})();

// 鹵獲ツールの設定のロード
function loadRokakuSettings() {
    // 保存データの取得
    var obj = GM_getValue(GM_KEY + '_rokaku_options', null);
    var options;
    if (obj == null) {
        options = getrkkDefaultOptions();
    } else {
        options = JSON.parse(obj);
    }

    // 保存データにデフォルト設定の情報がない場合、デフォルト設定を追加
    var defaults = getrkkDefaultOptions();
    for (var key in defaults) {
        if (typeof options[key] == "undefined") {
            options[key] = defaults[key];
        }
    }
    m_rokaku_options = options;
}

//--------------//
// 設定画面作成 //
//--------------//
function rcreateSettingWindow() {
    //css定義を追加
    addRokakuCss();
    //画面描画(設定画面)
    rkkdrawSettingButton();
    //鹵獲ボタン設定
    setRokakuAutoflag();
}

//----------------------------------//
//鹵獲設定画面起動ボタンを描画      //
//----------------------------------//
function rkkdrawSettingButton() {
    j$("#sidebar").prepend(
        "<span style=\"color: #ffffff;\"><a href='#' id=rokakutoolButton class='rokakutoollink'>鹵獲(イベ)</a></span> \
         <button type=button id=btn_rokaku style=\"width:70px;\">実行する</button>"
    );
    drawSetRokakuWindow();
    rkkbtnchange();
    j$("#rokakutoolButton").on("click", function(){
        var villageList = rloadData(GM_KEY+"VillageList", "[]", true);
        if (villageList.length === 0) {
            alert("プロフィールページにアクセスして、拠点情報の読み込みを行ってください。");
        } else {
            // 設定のロード
            loadRokakuSettings();

            // 保存されているoption設定を設定画面に反映
            for (var key in m_rokaku_options) {
                if (j$("#" + key).length > 0) {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', m_rokaku_options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(m_rokaku_options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == m_rokaku_options[key];}).prop('selected', true);
                    }
                }
            }
            //新しくHP回復スキルが追加されてたらリストに追加
            if (addflg==0){
                j$.each(defrecskil, function(key1, value1) {
                    var l_ckflg=0;
                    var ckobj = m_rokaku_options[RECSKIL2];
                    for(var ln in ckobj){
                        if (ckobj[ln]==value1){l_ckflg=1;}
                    }
                    var ckobj2 = m_rokaku_options[UNRECSKIL2];
                    for(var ln2 in ckobj2){
                        if (ckobj2[ln2]==value1){l_ckflg=1;}
                    }
                    if (l_ckflg==0){
                        j$("#unrecskil2")
                            .append(j$("<option></option>")
                                    .attr("value",key1)
                                    .text(value1));
                    }
                });
                addflg=1;
            }
            //NGカードリスト取得
            var l_arycdlst=new Array();
            var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
            if (l_ngcdlist!=""){
                l_arycdlst = GM_getValue(GM_KEY + '_ngcdlist', []).split(',');
                var l_arycdlen=l_arycdlst.length;
                NGCDLIST="";
                for (var i=0; i<l_arycdlen; i++){
                    NGCDLIST = NGCDLIST + l_arycdlst[i] + "\n";
                }
                j$("#ngcdlistarea").val(NGCDLIST);
            }

            //ログ取得
            var l_log=new Array();
            var l_chklog=GM_getValue(GM_KEY + '_rokakulog', "");
            if (l_chklog!=""){
                l_log = GM_getValue(GM_KEY + '_rokakulog', []).split(',');
                var l_loglen=l_log.length;
                ROKAKU_LOG="";
                for (var i=l_loglen; i--;){
                    ROKAKU_LOG = ROKAKU_LOG + l_log[i] + "\n";
                }
                j$("#rlogarea").val(ROKAKU_LOG);
            }
            j$("#rokaku_setting_view").css({'display':'block'});
        }
    });
}

//----------------------------//
//  遠訓貯金完了時間描画      //
//----------------------------//
function rkkgetenktime(){
    //描写
    rkkdrawenktimer();
    var l_lilen = j$("#buildList li").length;
    var l_enkli=0;
    for (var k=0; k<l_lilen; k++) {
        var l_txt=j$("#buildList li").eq(k).text();
        //遠征訓練所の一括建築を取得
        if ((l_txt.indexOf("一括建設")!=-1) && (l_txt.indexOf("遠征訓練所(レベル20)")!=-1)){
            var l_kanryotime = j$("#buildList span[class='buildTime']").eq(k).text();
            var l_nokoritime = j$("#buildList span[class='buildClock']").eq(k).text();
            var l_kanryo = l_kanryotime.split(":");
            var l_nokori = l_nokoritime.split(":");
            var l_nokorimin = ((parseInt(l_nokori[0]))*3600)+((parseInt(l_nokori[1]))*60)+(parseInt(l_nokori[2]));
            var l_dt = new Date();
            l_dt.setSeconds(l_dt.getSeconds() + l_nokorimin);
            var l_hours = l_dt.getHours();  //残り時間から計算した時間
            if (((parseInt(l_kanryo[0]))==23)&&(l_hours==0)){
                l_dt.setDate(l_dt.getDate() - 1);
            }
            if (((parseInt(l_kanryo[0]))==0)&&(l_hours==23)){
                l_dt.setDate(l_dt.getDate() + 1);
            }
            //完了日時を登録
            l_dt.setHours((parseInt(l_kanryo[0])),(parseInt(l_kanryo[1])),(parseInt(l_kanryo[2])));
            var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
            var l_name = j$(".basename span").eq(0).text();
            var l_timer = l_dt.getTime(); //ミリ秒

            //遠訓貯金リスト更新
            var l_chk=0;
            var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
            var enkTimeAll = [];
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
            if (enkTimeList.length != 0 ) {
                for( var el = 0; el < enkTimeList.length; el++ ){
                    var enkTime = new Object;
                    if (enkTimeList[el].id==l_vilid){
                        enkTime.id=l_vilid;
                        enkTime.name=l_name;
                        enkTime.timer=l_timer;
                        l_chk=1;
                    } else {
                        enkTime.id=enkTimeList[el].id;
                        enkTime.name=enkTimeList[el].name;
                        enkTime.timer=enkTimeList[el].timer;
                    }
                    enkTimeAll.push(enkTime);
                }
            }
            if (l_chk!=1){
                var enkTime = new Object;
                enkTime.id=l_vilid;
                enkTime.name=l_name;
                enkTime.timer=l_timer;
                enkTimeAll.push(enkTime);
            }
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
            l_enkli=1;
        }
    }
    //ない場合は、前回あったものがあれば消す
    if (l_enkli==0){
        //遠訓貯金リスト更新
        var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
        var enkTimeAll = [];
        rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
        var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
        if (enkTimeList.length != 0 ){
            for( var el = 0; el < enkTimeList.length; el++ ){
                var enkTime = new Object;
                if (enkTimeList[el].id!=l_vilid){
                    enkTime.id=enkTimeList[el].id;
                    enkTime.name=enkTimeList[el].name;
                    enkTime.timer=enkTimeList[el].timer;
                    enkTimeAll.push(enkTime);
                }
            }
        }
        rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
    }
    rkkgetenklist();
}
//----------------------------//
//遠訓貯金リスト描写          //
//----------------------------//
function rkkdrawenktimer(){
    j$("#maps").prepend(
        "<div id=rkk_enkview style='border: 2px #FFBD4C solid;border-radius: 10px;background-color: #FFD999;border-radius: 1em;width:320px;margin-left: 230px;margin-top: -55px;'>\
         <span id=rkk_enkhead style='margin-left: 10px;margin-top: 5px;font-size:12px;'>遠訓建築予約  実行中:</span><input type='button' value=\"更新\" id=rkk_enkbtn style='width: 40px; height: 18px;font-size:10px;margin-left: 10px;'> \
         <div id=rkk_enktext style='overflow-y:scroll;margin: 5px 5px 5px 5px;height:30px;font-size:10px;'></div> \
        </div>"
    );
    j$("#rkk_enkbtn").on("click", function(){
        j$("#rkk_enkbtn").text("取得中");
        //遠訓建築情報初期化
        var enkTimeAll = [];
        rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
        //全ページ読み込み
        rkk_allvil();
        rkkgetenklist();
        var dt = new Date();
        GM_setValue(GM_KEY +"_enkviewtime", dt.toString());
        j$("#rkk_enkbtn").val("完了");
    });
}
//----------------------------//
//遠訓貯金リスト取得          //
//----------------------------//
function rkkgetenklist(){
    var l_vilcnt=0;
    j$("div[class='sideBoxInner basename'] ul li").each(function(index){
        if (!(j$("span", this).eq(1).hasClass('buildingText'))){
            l_vilcnt=l_vilcnt+1;
        }
    });
    var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
    j$("#rkk_enkhead").text("遠訓建築予約  実行中:"+enkTimeList.length+"/"+l_vilcnt);
    if (enkTimeList.length != 0 ){
        //時間でソート
        enkTimeList.sort(function(a,b){
            if(a.timer < b.timer) return -1;
            if(a.timer > b.timer) return 1;
            return 0;
        });
        var l_dt = new Date();
        var l_html="";
        for(var el = 0; el < enkTimeList.length; el++){
            //残り時間取得
            console.log(enkTimeList[el].timer);
            console.log(l_dt.getTime());
            var diff = enkTimeList[el].timer - l_dt.getTime();
            var dif_txt = computeDuration(diff);
            var setDate = new Date();
            setDate.setTime(enkTimeList[el].timer); //ミリ秒から日時に変換
            //月
            //1月が0、12月が11。そのため+1をする。
            var l_month = setDate.getMonth()+1;
            //日
            var l_date = setDate.getDate();
            //曜日
            //日曜が0、土曜日が6。配列を使い曜日に変換する。
            var dateT = ["日","月","火","水","木","金","土"];
            var l_day = dateT[setDate.getDay()];
            //時
            var l_hours = setDate.getHours();
            //分
            var l_minutes = setDate.getMinutes();
            //秒
            //var l_seconds = dt.getSeconds();
            var l_daytxt= enkTimeList[el].name+"　"+l_month+"/"+l_date+"("+l_day+") "+l_hours+":"+l_minutes+"残り("+dif_txt+")";
            if (el!=0){
                l_html=l_html+"<br />";
            }
            var diffhour = diff/(1000*60*60);
            if (diffhour<30){
                l_html=l_html+"<span style='font-weight:bold;color:#CC0000;scrollbar-face-color:#FFBD4C;scrollbar-arrow-color: #ffffff;'>"+l_daytxt+"</span>";
            } else {
                l_html=l_html+l_daytxt;
            }
        }
        j$("#rkk_enktext").empty();
        j$("#rkk_enktext").append(l_html);
    }
}
//-----------------------------//
//ミリ秒を時分秒へ変換         //
//-----------------------------//
function computeDuration(ms){
    if (ms<360000000){
        var h = String(Math.floor(ms / 3600000) + 100).substring(1);
    } else {
        var h = String(Math.floor(ms / 3600000) + 1000).substring(1);
    }
    var m = String(Math.floor((ms - h * 3600000)/60000)+ 100).substring(1);
    var s = String(Math.round((ms - h * 3600000 - m * 60000)/1000)+ 100).substring(1);
    return h+':'+m+':'+s;
}
//-----------------------//
// 拠点読み込み          //
//-----------------------//
function rkk_allvil(){
    //拠点一覧取得
    var arry_villist=[];
    var arry_url=[];
    var l_vilcnt=0;
    var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
    j$("div[class='sideBoxInner basename'] ul li").each(function(index){
        var l_current = false;
        if (j$(this).attr("class") == 'on') {
            l_current = true;
        }
        var search;
        if (l_current == true) {
            arry_villist[l_vilcnt]=j$("span", this).eq(0).text();
            var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
            l_url=PROTOCOL　+ "//" + HOST + "/village_change.php?village_id=" + l_vilid + "&from=menu&page=%2Fvillage.php";
            arry_url[l_vilcnt]=l_url;
        } else {
            if (!(j$("span", this).eq(1).hasClass('buildingText'))){
                arry_villist[l_vilcnt]=j$("a", this).eq(0).text();
                l_url=PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                arry_url[l_vilcnt]=l_url;
            }
        }
        l_vilcnt=l_vilcnt+1;
    });
    Label1:
    for(var vil= 0; vil < arry_villist.length; vil++) {
        rkk_getvillage(arry_url[vil]);
    }
    l_url=PROTOCOL　+ "//" + HOST + "/village_change.php?village_id=" + l_vilid + "&from=menu&page=%2Fvillage.php";
    rkk_loadURL(l_url);
}
//-----------------//
//領地取得         //
//-----------------//
function getrokakuarea() {
    j$("#tMenu_btnif ul[class='upper clearfix']").after(
        "<div style='margin-bottom: 4px;'><select id=cicrokakuarea name=cicrokakuarea>" +
        "<option selected>鹵獲ツール：出兵先選択</option>" +
        "<optgroup label='優先度出兵先１'>" +
        "<option value='1'>優先度:出兵先(木)</option>" +
        "<option value='2'>優先度:出兵先(石)</option>" +
        "<option value='3'>優先度:出兵先(鉄)</option>" +
        "<option value='4'>優先度:出兵先(糧)</option>" +
        "</optgroup>" +
        "<optgroup label='カード名による出兵先指定'>" +
        "<option value='9'>出兵先指定01</option>" +
        "<option value='10'>出兵先指定02</option>" +
        "<option value='11'>出兵先指定03</option>" +
        "<option value='12'>出兵先指定04</option>" +
        "<option value='13'>出兵先指定05</option>" +
        "<option value='14'>出兵先指定06</option>" +
        "<option value='15'>出兵先指定07</option>" +
        "<option value='16'>出兵先指定08</option>" +
        "<option value='17'>出兵先指定09</option>" +
        "<option value='18'>出兵先指定10</option>" +
        "</optgroup>" +
        "<optgroup label='優先度出兵先２'>" +
        "<option value='19'>優先度:出兵先2(木)</option>" +
        "<option value='20'>優先度:出兵先2(石)</option>" +
        "<option value='21'>優先度:出兵先2(鉄)</option>" +
        "<option value='22'>優先度:出兵先2(糧)</option>" +
        "</optgroup>" +
        "</select>" +
        "<button type=button id=btn_choicearea style='width:50px;'>登録</button>" +
        "</div>"
    );

    var RX_VAL ="";
    var RY_VAL ="";
    j$("#btn_choicearea").on("click",function(){
        var l_lctmth = location.href.match(/land.php\?x=([-]?\d+)&y=([-]?\d+)/);
        if (l_lctmth != null) {
            //設定のロード
            loadRokakuSettings();
            //設定値取得
            var val = j$('#cicrokakuarea').val();
            var x_val=l_lctmth[1];
            var y_val=l_lctmth[2];
            //保存
            switch (val) {
                case "1":
                    m_rokaku_options[WOOD_X]=x_val;
                    m_rokaku_options[WOOD_Y]=y_val;
                    break;
                case "2":
                    m_rokaku_options[STONE_X]=x_val;
                    m_rokaku_options[STONE_Y]=y_val;
                    break;
                case "3":
                    m_rokaku_options[IRON_X]=x_val;
                    m_rokaku_options[IRON_Y]=y_val;
                    break;
                case "4":
                    m_rokaku_options[RICE_X]=x_val;
                    m_rokaku_options[RICE_Y]=y_val;
                    break;
                case "19":
                    m_rokaku_options[WOOD_X2]=x_val;
                    m_rokaku_options[WOOD_Y2]=y_val;
                    break;
                case "20":
                    m_rokaku_options[STONE_X2]=x_val;
                    m_rokaku_options[STONE_Y2]=y_val;
                    break;
                case "21":
                    m_rokaku_options[IRON_X2]=x_val;
                    m_rokaku_options[IRON_Y2]=y_val;
                    break;
                case "22":
                    m_rokaku_options[RICE_X2]=x_val;
                    m_rokaku_options[RICE_Y2]=y_val;
                    break;
                case "9":
                case "10":
                case "11":
                case "12":
                case "13":
                case "14":
                case "15":
                case "16":
                case "17":
                case "18":
                    var l_val=parseInt(val)-8;
                    RX_VAL = eval("DECAREA" + l_val + "_X");
                    RY_VAL = eval("DECAREA" + l_val + "_Y");
                    m_rokaku_options[RX_VAL]=x_val;
                    m_rokaku_options[RY_VAL]=y_val;
                    break;
            }
            var options=m_rokaku_options;
            //設定を保存
            GM_setValue(GM_KEY + '_rokaku_options', JSON.stringify(options));
            alert("保存しました。");
        }
    });
}

//--------------------//
// スクリプト実行判定 //
//--------------------//
function rkkisExecute() {
    // mixi鯖障害回避用: 広告iframe内で呼び出されたら無視
    if (j$("#container").length === 0) {
        return false;
    }

    // 歴史書モードの場合、ツールを動かさない
    if( j$("#sidebar img[title=歴史書]").length > 0 ){
        return false;
    }
    return true;
}

//--------------------//
// 鹵獲実行ボタン     //
//--------------------//
function rkkbtnchange(){
    j$("#btn_rokaku").on("click",function(){
        if(GM_getValue(GM_KEY +"RokakuAutoFlg", true)==true){
            j$(this).text("実行する");
            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
        }else{
            j$(this).text("実行中");
            GM_setValue(GM_KEY +"RokakuAutoFlg", true);
            GM_setValue(GM_KEY + "_startflg",1);
            GM_setValue(GM_KEY + "before_mode",0);
            GM_setValue(GM_KEY +"_kekoku_kaitime", "");
            GM_setValue(GM_KEY +"_kekokusk_kaitime", "");
            GM_setValue(GM_KEY +"_FLERECSKIL1_kaitime", "");
            GM_setValue(GM_KEY +"_RECSKIL2_kaitime", "");
            GM_setValue(GM_KEY +"_rokaku_kaitime", "");
            GM_setValue(GM_KEY +"_siegetime", "");
            GM_setValue(GM_KEY +"_kaiflg1", 0);
            GM_setValue(GM_KEY +"_kaiflg2", 0);
            GM_setValue(GM_KEY +"_siegeflg", 0);
            GM_setValue(GM_KEY +"_cdtrolflg", false);
            GM_setValue(GM_KEY +"_enbankflg", false);
            GM_setValue(GM_KEY + '_resrestartflg', false);  //鹵獲再開予約フラグ(停止後、予約があればtrue
            GM_setValue(GM_KEY +"_enkviewtime", "");        //遠訓貯金表示の全画面取得時間
            var rk_restime=GM_getValue(GM_KEY +"_restime", "");
            if (rk_restime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_restime){
                    //過去なら初期化
                    GM_setValue(GM_KEY + '_resfun', 0);
                    GM_setValue(GM_KEY + '_restskil', false);
                    GM_setValue(GM_KEY +"_restime", "");
                    GM_setValue(GM_KEY + '_restimeValue', "");
                }
            }
            var rk_resstarttime=GM_getValue(GM_KEY +"_resstarttime", "");
            if (rk_resstarttime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resstarttime){
                    //過去なら初期化
                    GM_setValue(GM_KEY + '_resstartfun', false);
                    GM_setValue(GM_KEY + '_resstarttime', "");
                    GM_setValue(GM_KEY + '_resstarttimeValue', "");
                }
            }
            var rk_resstoptime=GM_getValue(GM_KEY +"_resstoptime", "");
            if (rk_resstoptime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resstoptime){
                    //過去なら初期化
                    GM_setValue(GM_KEY + '_resstopfun', false);
                    GM_setValue(GM_KEY + '_resstoptime', "");
                    GM_setValue(GM_KEY + '_resstoptimeValue', "");
                }
            }
            var rk_resrestarttime=GM_getValue(GM_KEY +"_resrestarttime", "");
            if (rk_resrestarttime!=""){
                var dt = new Date();
                if (dt.getTime() > rk_resrestarttime){
                    //過去なら初期化
                    GM_setValue(GM_KEY + '_resrestartfun', false);
                    GM_setValue(GM_KEY + '_resrestarttime', "");
                    GM_setValue(GM_KEY + '_resrestarttimeValue', "");
                }
            }
        }
        GM_setValue(GM_KEY + "RokakuMode", 1);
        setrokakulog("鹵獲モード:1");
        location.reload();
    });
}

function setRokakuAutoflag(){
    var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
    if(GM_getValue(GM_KEY +"RokakuAutoFlg", false)==true){
        j$("#btn_rokaku").text("実行中(" + rokaku_mode + ")");
    }else{
        j$("#btn_rokaku").text("実行する");
    }
}

//------------------//
// セッションID取得 //
//------------------//
function rkkgetSessionId() {
    return rgetCookie('SSID');
}

//------------------------//
// プロフィール情報を保存 //
//------------------------//
function rkksaveUserProfile(targetObject){
    // 検索ターゲットの決定
    var target = null;
    if (typeof targetObject != 'undefined') {
        target = targetObject;
    }

    // プレイヤープロフィール判定
    if (j$("#statMenu", target).length === 0) {
        // 他人のプロフィール画面の場合は何もしない
        return;
    }

    // 拠点一覧の取得
    var villageList = [];
    j$("table[class=commonTables] tr:has(a[href*='village_change.php'])", target).slice(0,11).each(
        // 拠点情報を持つ行のみ処理対象
        function() {
            var vId = null, vName = null, vPosX = null, vPosY = null;
            // beyond並走時にいらないセルを拾うため、ブラ三運営の作成セルのみを対象
            j$("td:not([id*=beyond])", this).each(
                function(index) {
                    if (index === 0) {
                        // 拠点ID
                        j$("a", this).attr("href").match(/village_id=(\d+)/);
                        vId = RegExp.$1;
                        vName = j$("a", this).text();
                    } else if (index == 1) {
                        // 座標
                        j$(this).text().match(/([-]*\d+),([-]*\d+)/);
                        vPosX = RegExp.$1;
                        vPosY = RegExp.$2;
                    } else if (index == 2) {
                        // 人口エリアに記述がある場合のみ拠点情報をpush
                        if (j$(this).text().trim() !== "" && vId !== null && vPosX !== null && vPosY !== null) {
                            villageList.push({"id":vId, "name":vName});
                        }
                    }
                }
            );
        }
    );
    if (villageList.length === 0) {
        alert("プロフィールページの仕様が変更されたため情報が取れませんでした。");
        return;
    }

    var savedVillageList = rloadData(GM_KEY+"VillageList", "[]", true);   // 保存された拠点情報
    if (savedVillageList.length === 0) {
        villageList[0].roundgo = true;
    }

    // 拠点情報の保存
    rsaveData(GM_KEY+"VillageList", villageList, true );
}

//-----------------------//
// 鹵獲処理実行          //
//-----------------------//
function rokakutool(){
    //簡易出兵先チェック
    var l_ckbm=0;
    var l_chkvil=0;
    if ((j$("div[class='sideBoxInner bookmark'] ul li").length>0) && (m_rokaku_options[YN_BMNAME]==true)){
        console.log(j$("div[class='sideBoxInner bookmark'] ul li").eq(0).text());
        if (j$("div[class='sideBoxInner bookmark'] ul li").eq(0).text().match(/※/)) {
            //※簡易出兵先の一番最初の行に※を含むかどうか
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("簡易出兵先の名前によりツール停止中");}
            l_ckbm=1;
        }
    }
    if (l_ckbm!=1){
        //鹵獲拠点へ移動
        j$("div[class='sideBoxInner basename'] ul li").each(
            function(index){
                var current = false;
                if ( j$(this).attr("class") == 'on') {
                    current = true;
                }
                var search;
                if (current == true) {
                    if (m_rokaku_options[DEBUGFLG]==true){
                        var l_txt = j$("span", this).eq(0).text().replace( /,/g , "." );
                        setrokakulog("出兵拠点：" + l_txt);
                    }
                    if (j$("span", this).eq(0).text() == m_rokaku_options[ROKAKU_VIL]) {
                        l_chkvil=1;
                        rokakurank();
                    }
                } else {
                    if (m_rokaku_options[DEBUGFLG]==true){
                        var l_txt = j$("a", this).eq(0).text().replace( /,/g , "." );
                        setrokakulog("拠点：" + l_txt);
                    }
                    if (j$("a", this).eq(0).text() == m_rokaku_options[ROKAKU_VIL]) {
                        l_chkvil=1;
                        console.log(j$("a", this).eq(0).attr('href'));
                        location.href = PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                    }
                }
            });
        if (l_chkvil!=1){
            //サブ出兵先の設定確認
            if (m_rokaku_options[YN_SUBVIL]==true){
                if (m_rokaku_options[ROKAKU_VIL]!=m_rokaku_options[ROKAKU_VIL2]){
                    //設定のロード
                    loadRokakuSettings();
                    m_rokaku_options[ROKAKU_VIL] = m_rokaku_options[ROKAKU_VIL2];
                    var options=m_rokaku_options;
                    //設定を保存
                    GM_setValue(GM_KEY + '_rokaku_options', JSON.stringify(options));
                    //リロード
                    location.reload();
                }
            }
        }
    } else {
        rkwait(60).done(function () {
            location.reload();
        });
    }
}
//-----------------------//
// 鹵獲優先順位          //
//-----------------------//
function rokakurank(){
    var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
    var l_ckmode=0;
    while (l_ckmode < 1) {
        rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
        if (m_rokaku_options[USEDLST1] == rokaku_mode){
            if (!m_rokaku_options[USECONF1]){
                rokaku_mode++;
                GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
                setrokakulog("鹵獲モード:"+rokaku_mode);
            } else {
                console.log('鹵獲優先順位 : %d', rokaku_mode);
                rokakuskill();
                l_ckmode=1;
            }
        } else if (m_rokaku_options[USEDLST2] == rokaku_mode){
            if (!m_rokaku_options[USECONF2]){
                rokaku_mode++;
                GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
                setrokakulog("鹵獲モード:"+rokaku_mode);
            } else {
                console.log('鹵獲優先順位 : %d', rokaku_mode);
                rokakupassive();
                l_ckmode=1;
            }
        } else {
            if (rokaku_mode > 2){
                rokaku_mode=1;
                GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
                setrokakulog("鹵獲モード:"+rokaku_mode);
            }
            l_ckmode=1;
        }
    }
    if (m_EndFlag==1){
        var rk_restime=GM_getValue(GM_KEY +"_restime");
        if (rk_restime!=""){
            GM_setValue(GM_KEY +"_cdtrolflg", true);
        } else {
            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
        }
    }

    var kaiflg1=GM_getValue(GM_KEY +"_kaiflg1", 0);
    var kaiflg2=GM_getValue(GM_KEY +"_kaiflg2", 0);
    var l_ret=0;
    if ((m_rokaku_options[USECONF1]==true)&&(kaiflg1==0)){l_ret=1;}
    if ((m_rokaku_options[USECONF2]==true)&&(kaiflg2==0)){l_ret=1;}
    var l_siege = GM_getValue(GM_KEY +"_siegeflg", 0);
    if(l_ret==0){
        rkwait(300).done(function () {
            location.reload();
        });
    } else if(l_siege==1){
        //籠城中
        rkwait(600).done(function () {
            location.reload();
        });
    } else {
        rkwait(60).done(function () {
            location.reload();
        });
    }
}
//-----------------------//
// 鹵獲スキル処理        //
//-----------------------//
function rokakuskill(){
    var l_chk2=0;
    var rokaku_kai=GM_getValue(GM_KEY +"_rokaku_kaitime", "");
    var flerecskil1=GM_getValue(GM_KEY +"_FLERECSKIL1_kaitime", "");
    var siegetime=GM_getValue(GM_KEY +"_siegetime", "");
    if (flerecskil1!=""){
        var dt = new Date();
        if (dt.getTime() > Date.parse(flerecskil1)){
            GM_setValue(GM_KEY +"_FLERECSKIL1_kaitime", "");
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("神医系スキルが回復完了");}
        } else {
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode++;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("神医系スキルが回復中:" + flerecskil1);}
            return 0;
        }
    }
    if (rokaku_kai!=""){
        var dt = new Date();
        if (dt.getTime() > Date.parse(rokaku_kai)){
            GM_setValue(GM_KEY +"_rokaku_kaitime", "");
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲スキルが回復完了");}
        } else {
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode++;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲スキルが回復中:" + rokaku_kai);}
            return 0;
        }
    }
    if (siegetime!=""){
         //籠城時間
        var dt = new Date();
        var diff = dt.getTime() - Date.parse(siegetime);
        //5時間以上経過しているかどうか
        if (diff > 18000000){
            GM_setValue(GM_KEY +"_siegetime", "");
            GM_setValue(GM_KEY +"_siegeflg", 0);
        } else {
            return 0;
        }
    }
    var l_bfrMd=GM_getValue(GM_KEY + "before_mode", 0);
    GM_setValue(GM_KEY + "deckList",  "");
    getdecklist();                                           //デッキのカード情報取得
    if (l_bfrMd!=1){
        if (rokakuskilwait()==true){                         //他の設定カードがあれば待機
            //鹵獲スキルで回復しているものがあるか
            if (chkrokakucare()==0){
                return 0;
            }
        } else {
            return 0;
        }
    }
    var l_chk=rokakucdunset();                               //鹵獲カードを下ろす
    if (l_chk==0){
        //全軍を乗せるデッキコストがあるかチェック
        if  (chkrokakuzen()==false) {
            //優先順位 +1
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode=rokaku_mode+1;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
        } else {
            var l_ret=chkrokakucare();                      //回復が必要かチェック
            if ((l_ret==1) && (l_ret!=0)) {
                l_chk2=rokakucare('FLERECSKIL1');           //回復処理
            }
            if ((l_ret!=0) && (l_chk2!=1)){
                rokakuzen("ROKAKU_ZANCD", "ROKAKU_ZANLBL","YN_ROKAKUZEN");   //全軍乗せる
                rokakucdset();                             //鹵獲カードセットする
                rokakucdtrol();                            //鹵獲カード出兵
                GM_setValue(GM_KEY + "before_mode",1);
            }
        }
    }

}
//-----------------------//
// 鹵獲パッシブ処理      //
//-----------------------//
function rokakupassive(){
    var recskil=GM_getValue(GM_KEY +"_RECSKIL2_kaitime", "");
    var keiskil=GM_getValue(GM_KEY +"_kekoku_kaitime", "");
    var siegetime=GM_getValue(GM_KEY +"_siegetime", "");
    if (recskil!=""){
        var dt = new Date();
        if (dt.getTime() > Date.parse(recskil)){
            GM_setValue(GM_KEY +"_RECSKIL2_kaitime", "");
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("仁君系スキルが回復完了");}
        } else {
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode++;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("仁君系スキルが回復中:" + recskil);}
            return 0;
        }
    }
    if (keiskil!=""){
        var dt = new Date();
        if (dt.getTime() > Date.parse(keiskil)){
            GM_setValue(GM_KEY +"_kekoku_kaitime", "");
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国スキルが回復完了");}
        } else {
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode++;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国スキルが回復中:" + keiskil);}
            return 0;
        }
    }
    if (siegetime!=""){
         //籠城時間
        var dt = new Date();
        var diff = dt.getTime() - Date.parse(siegetime);
        //5時間以上経過しているかどうか
        if (diff > 18000000){
            GM_setValue(GM_KEY +"_siegetime", "");
            GM_setValue(GM_KEY +"_siegeflg", 0);
        } else {
            return 0;
        }
    }
    var l_chk2=0;
    var l_chk3=0;
    var l_chk4=0;
    var l_bfrMd = GM_getValue(GM_KEY + "before_mode",0);
    if (l_bfrMd!=2){
        //傾国があるか
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("スキル回復済み傾国が存在するかチェック開始");}
        if (rkeiExi()==0){
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("スキル回復済み傾国が存在しない");}
            return 0;
        }
    }
    GM_setValue(GM_KEY + "deckList",  "");
    getdecklist();                                      //デッキのカード情報取得
    if (l_bfrMd!=2){
        if (passivewait()!=true){                       //他の設定カードがあれば待機
            return 0;
        }
    }
    var l_chk=passivecdunset();                         //鹵獲パッシブ以外のカードを下ろす
    if (l_chk==0){
        //全軍を乗せるデッキコストがあるかチェック
        if  (chkpassivezen()==false) {
            //優先順位 +1
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode=rokaku_mode+1;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            setrokakulog("鹵獲モード:"+rokaku_mode);
        } else {
            var l_ret=chkpassivecare();                 //神医系回復が必要かチェック
            if (l_ret==1){
                l_chk2=passivecare();                   //神医系回復処理
            }
            if (l_chk2!=1){
                rokakuzen("ROKAKUP_ZANCD","ROKAKUP_ZANLBL","YN_ROKAKUPZEN"); //全軍乗せる
                passivecdset();                         //パッシブ設定カード乗せる
                l_chk4=passivejinset();                 //パッシブHP処理
                if ((l_chk4!=1) && (l_chk4!=2)) {
                    var keiskskil=GM_getValue(GM_KEY +"_kekokusk_kaitime", "");
                    if (keiskskil!=""){
                        var dt = new Date();
                        if (dt.getTime() > Date.parse(keiskskil)){
                            GM_setValue(GM_KEY +"_kekokusk_kaitime", "");
                            l_chk3=passivekeiset();     //パッシブ傾国処理
                        }
                    } else {
                        l_chk3=passivekeiset();         //パッシブ傾国処理
                    }
                    if ((l_chk3!=2) && (l_chk3!=3)) {
                        passivecdtrol();                //鹵獲カード出兵
                        GM_setValue(GM_KEY + "before_mode",2);
                    }
                }
            }
        }
    }
}


//-------------------------------//
// デッキのカードリスト取得      //
//-------------------------------//
function getdecklist(){
    var url;
    var deckListAll = [];
    url=PROTOCOL　+ "//" + HOST + "/card/deck.php";
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(GM_KEY+"UseCost", usecost);
        GM_setValue(GM_KEY+"DeckCost", deckcost);
        rsaveData(GM_KEY+"deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkilli =  j$(this).find("div[class='cardWrapper'] ul[class='back_skill'] li").length;
            var cdSubli =  j$(this).find(".back_skill span[class^='subgeneralSkillName']").length;
            var cdSkil1 =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill").eq(0).find("div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill").eq(0).find("div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if ((cdSkilli-cdSubli)> 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            if (cdSubli>0) {
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    if (j$(this).find(".back_skill span[class^='subgeneralSkillName4 skill_name_subgeneral']").text().match(/副攻:/)){
                        fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                        fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                        fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                        fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                    }
                }
            }
            var cid ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cid = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/\d+/g)[1];
            }

            deckList.name = j$.trim(cdName.text());         //カード名
            deckList.cdid = cid;                            //カードID
            deckList.setvil = j$.trim(setVillage.text());   //拠点
            deckList.setsta = j$.trim(setStatus.text());    //状態
            deckList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            deckList.hp = cdHp;                             //HP
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            if ((cdSkilli-cdSubli)> 3){                     //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID

            console.log(deckList);
            if (m_rokaku_options[DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                setrokakulog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                setrokakulog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                setrokakulog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                setrokakulog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                setrokakulog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        rsaveData(GM_KEY+"deckList", deckListAll, true );
    });
}
//----------------------------------//
// ファイルのカードリスト取得       //
//----------------------------------//
function getfilelist(l_label, l_page){
    var url;
    var fileListAll = [];
    url=PROTOCOL　+ "//" + HOST + "/card/deck.php?l=" + l_label + "&p=" + l_page;
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        // ファイルにあるカード情報取得
        j$(data).find("#cardFileList div[class='statusDetail clearfix']").each(function(){
            var fileList = new Object;
            var cdName = j$(this).find(".illustMini img[class='lazy']").attr("title");
            var cid =  j$(this).find(".illustMini a[class^='thickbox']").attr("href").match(/\d+/g)[2];
            var setStatus ="";
            if (j$(this).find(".left div").hasClass("set dis_set_mini")){
                setStatus = j$(this).find(".left div[class='set dis_set_mini']").text();
            } else {
                setStatus = "set"
            }
            var cdGage = j$(this).find(".right table[class='statusParameter1'] tr").eq(6).find("td").eq(0);
            var cdHp = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" span[class='cost-for-sub']").text();
            var cdTrade = "";
            if (j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='sub-control-buttons-wrapper sub-control-buttons-wrapper--buttons-in-a-row'] img").length>0){
                cdTrade = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("div[class='sub-control-buttons-wrapper sub-control-buttons-wrapper--buttons-in-a-row'] img").eq(0).attr("title");
            }
            var cdSkil =  j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill']  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] span[class^='skillName1']").text();
            var cdSkil1kai =  !(j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1).length > 0 ){
                cdSkil1id = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] span[class^='skillName2']").text();
            var cdSkil2kai =  !(j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2).length > 0 ){
                cdSkil2id = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] span[class^='skillName3']").text();
            var cdSkil3kai =  !(j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3).length > 0 ){
                cdSkil3id = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            if (cdSkil.length > 3){
                cdSkil4 =  j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] span[class^='skillName4']").text();
                cdSkil4kai =  !(j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4).length > 0 ){
                    cdSkil4id = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find("#cardWindow_" + cid +" ul[class='back_skill'] div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            var Skilkaitime1 =  "";
            var Skilkaitime2 =  "";
            var Skilkaitime3 =  "";
            var Skilkaitime4 =  "";
            if ((j$.trim(cdSkil1)!="") && (cdSkil1kai==false)){
                Skilkaitime1 = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "div[class='otherDetail clearfix'] div[class='kaifuku_wrap wrap9'] div[class='kaifuku_cnt'] p").eq(2).text();
            }
            if ((j$.trim(cdSkil2)!="") && (cdSkil2kai==false)){
                Skilkaitime2 = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "div[class='otherDetail clearfix'] div[class='kaifuku_wrap wrap9'] div[class='kaifuku_cnt'] p").eq(3).text();
            }
            if ((j$.trim(cdSkil3)!="") && (cdSkil3kai==false)){
                Skilkaitime3 = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "div[class='otherDetail clearfix'] div[class='kaifuku_wrap wrap9'] div[class='kaifuku_cnt'] p").eq(4).text();
            }
            if ((j$.trim(cdSkil4)!="") && (cdSkil4kai==false)){
                Skilkaitime4 = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "div[class='otherDetail clearfix'] div[class='kaifuku_wrap wrap9'] div[class='kaifuku_cnt'] p").eq(5).text();
            }

            fileList.name = j$.trim(cdName);                //カード名
            fileList.cdid = cid;                            //カードID
            fileList.setsta = j$.trim(setStatus);           //状態
            fileList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            fileList.hp = cdHp;                             //HP
            fileList.level = cdLevel;                       //カードレベル
            fileList.cost = cdCost;                         //コスト
            fileList.trade = cdTrade;                       //トレード
            fileList.cdskil1 = j$.trim(cdSkil1);            //スキル１
            fileList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            fileList.cdskil1id = cdSkil1id;                 //スキル1ID
            fileList.skilkaitime1 = j$.trim(Skilkaitime1).replace(/-/g,"/");  //スキル回復時間
            fileList.cdskil2 = j$.trim(cdSkil2);            //スキル2
            fileList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            fileList.cdskil2id = cdSkil2id;                 //スキル2ID
            fileList.skilkaitime2 = j$.trim(Skilkaitime2).replace(/-/g,"/");  //スキル回復時間
            fileList.cdskil3 = j$.trim(cdSkil3);            //スキル3
            fileList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            fileList.cdskil3id = cdSkil3id;                 //スキル3ID
            fileList.skilkaitime3 = j$.trim(Skilkaitime3).replace(/-/g,"/");  //スキル回復時間
            if (cdSkil.length > 3){                         //スキル4
                fileList.cdskil4 = j$.trim(cdSkil4);
            } else {
                fileList.cdskil4 ="";
            }
            fileList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            fileList.cdskil4id = cdSkil4id;                 //スキル4ID
            fileList.skilkaitime4 = j$.trim(Skilkaitime4).replace(/-/g,"/");  //スキル回復時間
            //console.log(fileList);
            fileListAll.push(fileList);
        });
        rsaveData(GM_KEY+"fileList", fileListAll, true);
    });
}

//-----------------------//
// 領地名取得            //
//-----------------------//
function getBasename(x_value, y_value){
    var url;
    var cdName="";
    url=PROTOCOL　+ "//" + HOST + "/land.php?x=" + x_value + "&y=" + y_value;
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        cdName = j$(data).find( "#basepoint span[class='basename']").text();
    });
    return cdName;
}

//-----------------------//
// 拠点情報取得          //
//-----------------------//
function rkk_getvillage(i_url){
    console.log(i_url);
    var vilinfoALL = [];
    j$.ajax({
        type: 'get',
        url: i_url,
        datatype: 'html',
        cache: false,
        async: false
    })
    .done(function(data){
        var vilinfo = new Object;
        var l_vilid = j$(data).find(".basenameForm input:hidden[name='village_id']").val();
        var l_ckskil = j$(data).find(".base-skill a");
        var l_skil1="";
        var l_skil2="";
        if (l_ckskil.length > 0){
           var l_cdtxt=j$(data).find(".base-skill a").text();
           var l_cnt=l_cdtxt.split(':').length - 1;
           if (l_cnt>2){
               var l_split=l_cdtxt.split(':');
               l_skil1 = l_split[1].slice(0, l_split[1].indexOf("(",0)).trim();
               if (l_skil1=="--"){l_skil1="";}
               if (l_cnt>3){
                   l_skil2 = l_split[4].slice(0, l_split[4].indexOf("(",0)).trim();
                   if (l_skil2=="--"){l_skil2="";}
               }
           }
        }
        var l_enkin=false;   //遠征訓練所が存在するか
        var l_enkLevel="";   //遠征訓練所のレベル
        var x_val="";
        var y_val="";
        var l_enkres=true;   //遠征訓練所が建設予約中かどうか
        j$(data).find("#maps map[id='mapOverlayMap'] area").each(function(){
            if (j$(this).attr("title").match(/遠征訓練所/)){
                l_enkin=true;
                l_enkLevel=j$(this).attr("title");
                var l_lctmth = j$(this).attr("href").match(/facility.php\?x=(\d+)&y=(\d+)/);
                x_val=l_lctmth[1];
                y_val=l_lctmth[2];
                //遠征訓練所が建設予約中かどうか
                j$(data).find("#maps img").each(function(){
                    if (j$(this).attr("src").match(/facility_246_/)){
                        l_enkres=false;
                    }
                });
            }
        });

        //建設予約数
        var l_rescnt=0;
        var l_lilen = j$(data).find("#buildList li").length;
        for (var k=0; k<l_lilen; k++) {
            var l_txt=j$(data).find("#buildList li").eq(k).text();
            //削除中と武器・防具強化は無視
            if ((l_txt.indexOf("を強化しています。")==-1) && (l_txt.indexOf("を削除中です。")==-1)){
                l_rescnt=l_rescnt+1;
            }
        }

        vilinfo.vilid=l_vilid;        //拠点ID
        vilinfo.skil1=l_skil1;        //発動中の内政スキル
        vilinfo.skil2=l_skil2;        //発動中の副将内政スキル
        vilinfo.enkin=l_enkin;        //遠征訓練所の存在有無(有:true)
        vilinfo.enklevel=l_enkLevel;  //遠征訓練所のレベル
        vilinfo.enkres=l_enkres;      //遠征訓練所が建設予約中か(予約中:true)
        vilinfo.x_val=x_val;          //遠征訓練所位置x
        vilinfo.y_val=y_val;          //遠征訓練所位置y
        vilinfo.rescnt=l_rescnt;      //拠点の建設予約数

        vilinfoALL.push(vilinfo);

        var l_lilen = j$(data).find("#buildList li").length;
        var l_enkli=0;
        for (var k=0; k<l_lilen; k++) {
            var l_txt=j$(data).find("#buildList li").eq(k).text();
            //遠征訓練所の一括建築を取得
            if ((l_txt.indexOf("一括建設")!=-1) && (l_txt.indexOf("遠征訓練所(レベル20)")!=-1)){
                var l_kanryotime = j$(data).find("#buildList span[class='buildTime']").eq(k).text();
                var l_nokoritime = j$(data).find("#buildList span[class='buildClock']").eq(k).text();
                var l_kanryo = l_kanryotime.split(":");
                var l_nokori = l_nokoritime.split(":");
                var l_nokorimin = ((parseInt(l_nokori[0]))*3600)+((parseInt(l_nokori[1]))*60)+(parseInt(l_nokori[2]));
                var l_dt = new Date();
                l_dt.setSeconds(l_dt.getSeconds() + l_nokorimin);
                var l_hours = l_dt.getHours();  //残り時間から計算した時間
                if (((parseInt(l_kanryo[0]))==23)&&(l_hours==0)){
                    l_dt.setDate(l_dt.getDate() - 1);
                }
                if (((parseInt(l_kanryo[0]))==0)&&(l_hours==23)){
                    l_dt.setDate(l_dt.getDate() + 1);
                }
                //完了日時を登録
                l_dt.setHours((parseInt(l_kanryo[0])),(parseInt(l_kanryo[1])),(parseInt(l_kanryo[2])));
                var l_vilid = j$(data).find(".basenameForm input:hidden[name='village_id']").val();
                var l_name = j$(data).find(".basename span").eq(0).text();
                var l_timer = l_dt.getTime(); //ミリ秒

                //遠訓貯金リスト更新
                var l_chk=0;
                var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
                var enkTimeAll = [];
                rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
                if (enkTimeList.length != 0 ) {
                    for( var el = 0; el < enkTimeList.length; el++ ){
                        var enkTime = new Object;
                        if (enkTimeList[el].id==l_vilid){
                            enkTime.id=l_vilid;
                            enkTime.name=l_name;
                            enkTime.timer=l_timer;
                            l_chk=1;
                        } else {
                            enkTime.id=enkTimeList[el].id;
                            enkTime.name=enkTimeList[el].name;
                            enkTime.timer=enkTimeList[el].timer;
                        }
                        enkTimeAll.push(enkTime);
                    }
                }
                if (l_chk!=1){
                    var enkTime = new Object;
                    enkTime.id=l_vilid;
                    enkTime.name=l_name;
                    enkTime.timer=l_timer;
                    enkTimeAll.push(enkTime);
                }
                rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
                l_enkli=1;
            }
        }
        //ない場合は、前回あったものがあれば消す
        if (l_enkli==0){
            //遠訓貯金リスト更新
            var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
            var enkTimeAll = [];
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
            var l_vilid = j$(data).find(".basenameForm input:hidden[name='village_id']").val();
            if (enkTimeList.length != 0 ){
                for( var el = 0; el < enkTimeList.length; el++ ){
                    var enkTime = new Object;
                    if (enkTimeList[el].id!=l_vilid){
                        enkTime.id=enkTimeList[el].id;
                        enkTime.name=enkTimeList[el].name;
                        enkTime.timer=enkTimeList[el].timer;
                        enkTimeAll.push(enkTime);
                    }
                }
            }
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
        }
    });
    rsaveData(GM_KEY+"_vilinfo", vilinfoALL, true);
}

//-----------------------//
// URL LOAD              //
//-----------------------//
function rkk_loadURL(i_url){
    console.log(i_url);
    var vilinfoALL = [];
    j$.ajax({
        type: 'get',
        url: i_url,
        datatype: 'html',
        cache: false,
        async: false
    })
    .done(function(data){
    });
}

//-------------------------------//
// 遠征訓練所LV20建築予約        //
//-------------------------------//
function rkk_enkbanksend(i_vilid,x_val,y_val){
    var ssid = rkkgetSessionId();
    var url=PROTOCOL　+ "//" + HOST + "/facility/build.php";

    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['village_id'] = i_vilid;
    params['x'] = x_val;
    params['y'] = y_val;
    params['any_level_up_flg'] = 1;
    params['target_level'] = 20;

    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        var l_lilen = j$(data).find("#buildList li").length;
        var l_enkli=0;
        for (var k=0; k<l_lilen; k++) {
            var l_txt=j$(data).find("#buildList li").eq(k).text();
            //遠征訓練所の一括建築を取得
            if ((l_txt.indexOf("一括建設")!=-1) && (l_txt.indexOf("遠征訓練所(レベル20)")!=-1)){
                var l_kanryotime = j$(data).find("#buildList span[class='buildTime']").eq(k).text();
                var l_nokoritime = j$(data).find("#buildList span[class='buildClock']").eq(k).text();
                var l_kanryo = l_kanryotime.split(":");
                var l_nokori = l_nokoritime.split(":");
                var l_nokorimin = ((parseInt(l_nokori[0]))*3600)+((parseInt(l_nokori[1]))*60)+(parseInt(l_nokori[2]));
                var l_dt = new Date();
                l_dt.setSeconds(l_dt.getSeconds() + l_nokorimin);
                var l_hours = l_dt.getHours();  //残り時間から計算した時間
                if (((parseInt(l_kanryo[0]))==23)&&(l_hours==0)){
                    l_dt.setDate(l_dt.getDate() - 1);
                }
                if (((parseInt(l_kanryo[0]))==0)&&(l_hours==23)){
                    l_dt.setDate(l_dt.getDate() + 1);
                }
                //完了日時を登録
                l_dt.setHours((parseInt(l_kanryo[0])),(parseInt(l_kanryo[1])),(parseInt(l_kanryo[2])));
                var l_vilid = j$(data).find(".basenameForm input:hidden[name='village_id']").val();
                var l_name = j$(data).find(".basename span").eq(0).text();
                var l_timer = l_dt.getTime(); //ミリ秒

                //遠訓貯金リスト更新
                var l_chk=0;
                var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
                var enkTimeAll = [];
                rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
                if (enkTimeList.length != 0 ) {
                    for( var el = 0; el < enkTimeList.length; el++ ){
                        var enkTime = new Object;
                        if (enkTimeList[el].id==l_vilid){
                            enkTime.id=l_vilid;
                            enkTime.name=l_name;
                            enkTime.timer=l_timer;
                            l_chk=1;
                        } else {
                            enkTime.id=enkTimeList[el].id;
                            enkTime.name=enkTimeList[el].name;
                            enkTime.timer=enkTimeList[el].timer;
                        }
                        enkTimeAll.push(enkTime);
                    }
                }
                if (l_chk!=1){
                    var enkTime = new Object;
                    enkTime.id=l_vilid;
                    enkTime.name=l_name;
                    enkTime.timer=l_timer;
                    enkTimeAll.push(enkTime);
                }
                rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
                l_enkli=1;
            }
        }
        //ない場合は、前回あったものがあれば消す
        if (l_enkli==0){
            //遠訓貯金リスト更新
            var enkTimeList = rloadData(GM_KEY+"_enkTime", "[]", true);
            var enkTimeAll = [];
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
            var l_vilid = j$(data).find(".basenameForm input:hidden[name='village_id']").val();
            if (enkTimeList.length != 0 ){
                for( var el = 0; el < enkTimeList.length; el++ ){
                    var enkTime = new Object;
                    if (enkTimeList[el].id!=l_vilid){
                        enkTime.id=enkTimeList[el].id;
                        enkTime.name=enkTimeList[el].name;
                        enkTime.timer=enkTimeList[el].timer;
                        enkTimeAll.push(enkTime);
                    }
                }
            }
            rsaveData(GM_KEY+"_enkTime", enkTimeAll, true);
        }
    });
}

//-------------------------------//
// 出兵画面の表示                //
//-------------------------------//
function dispatchtool(cardid, skilid,fukcardid, fukskilid,x_value,y_value){
    var l_dom="";
    var l_siege=0;
    var url=PROTOCOL　+ "//" + HOST + "/facility/castle_send_troop.php";
    // 送信データの作成
    var params = new Object;
    params["use_skill_id[" + cardid + "]"] = skilid;
    if (fukcardid!=""){
        params["use_skill_id[" + fukcardid + "]"] = fukskilid;
    }
    params['village_x_value'] = x_value;
    params['village_y_value'] = y_value;
    params['unit_assign_card_id'] = cardid;
    params['radio_move_type'] = 302;
    params['radio_reserve_type'] = 0;
    params['card_id'] = 204;
    params['btn_send'] = '出兵';
    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        l_dom = j$(data).find("#gray02Wrapper table[class='commonTables']").eq(1).find("tr").eq(1);
        if (l_dom.length) {
            if (l_dom.find("td").eq(1).length){
                if(l_dom.find("td").eq(1).text().indexOf('※籠城中は出兵できません') != -1){
                    console.log("籠城中です");
                    l_siege=1;
                }
            }
        }
    });
    return l_siege;
}
//-------------------------------//
// 出兵確認画面の表示            //
//-------------------------------//
function chkdispatchtool(cardid, skilid,fukcardid, fukskilid,x_value,y_value){
    var l_dom="";
    var l_ckflg=0;
    var l_attk=0;
    var l_speed=0;
    var url=PROTOCOL　+ "//" + HOST + "/facility/castle_send_troop.php";
    // 送信データの作成
    var params = new Object;
    params["use_skill_id[" + cardid + "]"] = skilid;
    if (fukcardid!=""){
        params["use_skill_id[" + fukcardid + "]"] = fukskilid;
    }
    params['village_x_value'] = x_value;
    params['village_y_value'] = y_value;
    params['unit_assign_card_id'] = cardid;
    params['radio_move_type'] = 302;
    params['radio_reserve_type'] = 0;
    params['btn_preview'] = '出兵確認へ';
    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        //籠城チェック
        l_dom = j$(data).find("#gray02Wrapper table[class='commonTables']").eq(1).find("tr").eq(1);
        if (l_dom.length) {
            if (l_dom.find("td").eq(1).length){
                if(l_dom.find("td").eq(1).text().indexOf('※籠城中は出兵できません') != -1){
                    console.log("籠城中です");
                    l_ckflg=1;
                }
            }
        }
        if (l_ckflg!=1) {
            l_dom = j$(data).find("#gray02Wrapper div[class='fightingpower'] strong[class='size1']");
            if (l_dom.length) {
                l_attk=l_dom.eq(0).text();
                l_attk = l_attk.replace( /,/g , "" ) ;
                l_speed=l_dom.eq(1).text();
                if(m_rokaku_options[YN_ATTKCHK]==true){
                    //攻撃閾値
                    if(parseFloat(m_rokaku_options[ATTKCHK]) > parseFloat(l_attk)){
                        //攻撃足りない
                        l_ckflg=2;
                    }
                }
                if ((m_rokaku_options[YN_SPEEDCHK]==true) && (l_ckflg!=2)){
                    //速度閾値
                    if(parseFloat(m_rokaku_options[SPEEDCHK]) > parseFloat(l_speed)){
                        //速度足りない
                        l_ckflg=3;
                    }
                }
            }
        }
    });
    return l_ckflg;
}

//-------------------------------//
// デッキに乗せる                //
//-------------------------------//
function setdeckcard(cardid, vilid){
    var url=PROTOCOL　+ "//" + HOST + "/card/deck.php";
    var ssid = rkkgetSessionId();
    var deckListAll = [];
    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['target_card'] = cardid;
    params["selected_village[" + cardid + "]"] = vilid;
    params['mode'] = "set";
    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        console.log("cdid:" + cardid + "をデッキに乗せました");
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(GM_KEY+"UseCost", usecost);
        GM_setValue(GM_KEY+"DeckCost", deckcost);
        rsaveData(GM_KEY+"deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkilli =  j$(this).find("div[class='cardWrapper'] ul[class='back_skill'] li").length;
            var cdSubli =  j$(this).find(".back_skill span[class^='subgeneralSkillName']").length;
            var cdSkil1 =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill").eq(0).find("div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill").eq(0).find("div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if ((cdSkilli-cdSubli)> 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            if (cdSubli>0) {
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    if (j$(this).find(".back_skill span[class^='subgeneralSkillName4 skill_name_subgeneral']").text().match(/副攻:/)){
                        fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                        fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                        fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                        fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                    }
                }
            }
            var cid ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cid = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/\d+/g)[1];
            }

            deckList.name = j$.trim(cdName.text());         //カード名
            deckList.cdid = cid;                            //カードID
            deckList.setvil = j$.trim(setVillage.text());   //拠点
            deckList.setsta = j$.trim(setStatus.text());    //状態
            deckList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            deckList.hp = cdHp;                             //HP
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            if ((cdSkilli-cdSubli)> 3){                     //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID

            console.log(deckList);
            if (m_rokaku_options[DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                setrokakulog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                setrokakulog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                setrokakulog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                setrokakulog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                setrokakulog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        rsaveData(GM_KEY+"deckList", deckListAll, true );
    });
}

//------------------------------------------//
// デッキに設定し、内政スキル発動           //
//------------------------------------------//
function setdeckskill(cardid, skilid,vilid, acttype){
    var url=PROTOCOL　+ "//" + HOST + "/card/deck.php";
    var ssid = rkkgetSessionId();
    var deckListAll = [];
    var l_chkstat=0;
    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['target_card'] = cardid;
    params['mode'] = "domestic_set";
    params["selected_village[" + cardid + "]"] = vilid;
    params['action_type'] = acttype;   //1:内政スキル発動 2:内政スキル発動、戻す
    params['choose_attr1_skill'] = skilid;
    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(GM_KEY+"UseCost", usecost);
        GM_setValue(GM_KEY+"DeckCost", deckcost);
        rsaveData(GM_KEY+"deckList", deckListAll, true );
        var l_status = j$(data).find("#gray02Wrapper div[align='center'] span[class='notice']").text();
        //状態を変更できませんでした //武将を内政に設定できませんでした
        if (l_status.indexOf('できませんでした') != -1) {
            //状態変更に失敗した
            console.log("cdid:" + cardid + "のスキルの使用に失敗しました");
            l_chkstat=1;
        } else {
            console.log("cdid:" + cardid + "のスキルを使用しました");
        }
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkilli =  j$(this).find("div[class='cardWrapper'] ul[class='back_skill'] li").length;
            var cdSubli =  j$(this).find(".back_skill span[class^='subgeneralSkillName']").length;
            var cdSkil1 =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill").eq(0).find("div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill").eq(0).find("div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if ((cdSkilli-cdSubli)> 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            if (cdSubli>0) {
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    if (j$(this).find(".back_skill span[class^='subgeneralSkillName4 skill_name_subgeneral']").text().match(/副攻:/)){
                        fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                        fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                        fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                        fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                    }
                }
            }
            var cid ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cid = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/\d+/g)[1];
            }

            deckList.name = j$.trim(cdName.text());         //カード名
            deckList.cdid = cid;                            //カードID
            deckList.setvil = j$.trim(setVillage.text());   //拠点
            deckList.setsta = j$.trim(setStatus.text());    //状態
            deckList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            deckList.hp = cdHp;                             //HP
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            if ((cdSkilli-cdSubli)> 3){                     //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID

            console.log(deckList);
            if (m_rokaku_options[DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                setrokakulog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                setrokakulog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                setrokakulog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                setrokakulog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                setrokakulog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        rsaveData(GM_KEY+"deckList", deckListAll, true );
    });
    return l_chkstat;
}

//------------------------------------------//
// デッキから下ろす                         //
//------------------------------------------//
function unsetdeckcard2(cardid){
    var url=PROTOCOL　+ "//" + HOST + "/card/deck.php";
    var ssid = rkkgetSessionId();
    var deckListAll = [];
    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['target_card'] = cardid;
    params['mode'] = "unset";
    console.log(params);
    console.log(url);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        console.log("cdid:" + cardid + "をデッキから下ろしました");
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(GM_KEY+"UseCost", usecost);
        GM_setValue(GM_KEY+"DeckCost", deckcost);
        rsaveData(GM_KEY+"deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkilli =  j$(this).find("div[class='cardWrapper'] ul[class='back_skill'] li").length;
            var cdSubli =  j$(this).find(".back_skill span[class^='subgeneralSkillName']").length;
            var cdSkil1 =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill").eq(0).find("div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill").eq(0).find("div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if ((cdSkilli-cdSubli)> 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            if (cdSubli>0) {
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    if (j$(this).find(".back_skill span[class^='subgeneralSkillName4 skill_name_subgeneral']").text().match(/副攻:/)){
                        fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                        fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                        fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                        fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                    }
                }
            }
            var cid ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cid = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/\d+/g)[1];
            }

            deckList.name = j$.trim(cdName.text());         //カード名
            deckList.cdid = cid;                            //カードID
            deckList.setvil = j$.trim(setVillage.text());   //拠点
            deckList.setsta = j$.trim(setStatus.text());    //状態
            deckList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            deckList.hp = cdHp;                             //HP
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            if ((cdSkilli-cdSubli)> 3){                     //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID

            console.log(deckList);
            if (m_rokaku_options[DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                setrokakulog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                setrokakulog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                setrokakulog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                setrokakulog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                setrokakulog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        rsaveData(GM_KEY+"deckList", deckListAll, true );
    });
}

//----------------------------------//
// 内政解除                         //
//----------------------------------//
function unsetdomestic(cardid){
    var url=PROTOCOL　+ "//" + HOST + "/card/domestic_setting.php";
    var deckListAll = [];
    // 送信データの作成
    var params = new Object;
    params['id'] = cardid;
    params['mode'] = "u_domestic";
    console.log(params);
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    })
        .done(function(data) {
        console.log("cdid:" + cardid + "をデッキから下ろしました");
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(GM_KEY+"UseCost", usecost);
        GM_setValue(GM_KEY+"DeckCost", deckcost);
        rsaveData(GM_KEY+"deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkilli =  j$(this).find("div[class='cardWrapper'] ul[class='back_skill'] li").length;
            var cdSubli =  j$(this).find(".back_skill span[class^='subgeneralSkillName']").length;
            var cdSkil1 =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill").eq(0).find("span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill").eq(0).find("div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill").eq(0).find("div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if ((cdSkilli-cdSubli)> 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            if (cdSubli>0) {
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    if (j$(this).find(".back_skill span[class^='subgeneralSkillName4 skill_name_subgeneral']").text().match(/副攻:/)){
                        fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                        fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                        fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                        fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                    }
                }
            }
            var cid ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cid = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/\d+/g)[1];
            }

            deckList.name = j$.trim(cdName.text());         //カード名
            deckList.cdid = cid;                            //カードID
            deckList.setvil = j$.trim(setVillage.text());   //拠点
            deckList.setsta = j$.trim(setStatus.text());    //状態
            deckList.gage = j$.trim(cdGage.text());         //討伐ゲージ
            deckList.hp = cdHp;                             //HP
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            if ((cdSkilli-cdSubli)> 3){                     //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID

            console.log(deckList);
            if (m_rokaku_options[DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                setrokakulog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                setrokakulog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                setrokakulog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                setrokakulog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                setrokakulog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        rsaveData(GM_KEY+"deckList", deckListAll, true );
    });
}
//----------------------------------//
//出兵する資源を設定                //
//----------------------------------//
function setmark() {
    var l_flg=0;
    var max = parseInt(j$("#wood_max").text());
    var wood = parseInt(j$("#wood").text());
    var stone =parseInt( j$("#stone").text());
    var iron =parseInt(j$("#iron").text());
    var rice = parseInt(j$("#rice").text());
    console.log("max:" + max + " wood:" + wood + " stone:" + stone + " iron:" + iron + " rice:" + rice);
    console.log("[木:石:鉄:糧]=[" + m_rokaku_options[WOOD_RATE] + " : " + m_rokaku_options[STONE_RATE] + " : " + m_rokaku_options[IRON_RATE] + " : " + m_rokaku_options[RICE_RATE] + "]");
    var txt="倉庫:" + max + " 木:" + wood + " 石:" + stone + " 鉄:" + iron + " 糧:" + rice;

    if (wood<10){wood=10;}
    if (stone<10){stone=10;}
    if (iron<10){iron=10;}
    if (rice<10){rice=10;}

    var r_wood = 0;
    var r_stone = 0;
    var r_iron = 0;
    var r_rice = 0;
    var rmax = max*0.98;
    var minre="";

    if (parseInt(m_rokaku_options[WOOD_RATE]) != 0) {r_wood = wood/parseInt(m_rokaku_options[WOOD_RATE]);}
    if (parseInt(m_rokaku_options[STONE_RATE]) != 0) { r_stone = stone/parseInt(m_rokaku_options[STONE_RATE]);}
    if (parseInt(m_rokaku_options[IRON_RATE]) != 0) {r_iron = iron/parseInt(m_rokaku_options[IRON_RATE]);}
    if (parseInt(m_rokaku_options[RICE_RATE]) != 0) {r_rice = rice/parseInt(m_rokaku_options[RICE_RATE]);}
    if (rmax < wood) {r_wood=0;}
    if (rmax < stone) {r_stone=0;}
    if (rmax < iron) {r_iron=0;}
    if (rmax < rice) {r_rice=0;}

    console.log(" rwood:" + r_wood + " rstone:" + r_stone + " riron:" + r_iron + " rrice:" + r_rice);
    if ((r_wood==0) && (r_stone==0) && (r_iron==0) && (r_rice==0)){
        if (m_rokaku_options[YN_RICE_ROKAKU]==true){
            l_flg=2;
            minre = "rice";
        } else {
            l_flg=1;
            m_EndFlag=1;  //鹵獲終了
            setrokakulog(txt);  //倉庫の状態
            setrokakulog("優先度[木:石:鉄:糧]=[" + m_rokaku_options[WOOD_RATE] + " : " + m_rokaku_options[STONE_RATE] + " : " + m_rokaku_options[IRON_RATE] + " : " + m_rokaku_options[RICE_RATE] + "]");
            setrokakulog("鹵獲を終了します");
        }
    }

    var min = "";
    if (l_flg==0){
        if (r_wood != 0){ min =r_wood;} else if (r_stone != 0){ min =r_stone;} else if (r_iron != 0){ min =r_iron;} else if (r_rice != 0){ min =r_rice;}

        if ((min > r_wood)&&(r_wood != 0)){min =r_wood;}
        if ((min > r_stone)&&(r_stone != 0)){min =r_stone;}
        if ((min > r_iron)&&(r_iron != 0)){min =r_iron;}
        if ((min > r_rice)&&(r_rice != 0)){min =r_rice;}

        if (min==r_wood){minre="wood";}
        if (min==r_stone){minre="stone";}
        if (min==r_iron){minre="iron";}
        if (min==r_rice){minre="rice";}
        console.log("最小:" + minre );
    }
    return minre;
}

//-------------------------------//
// 回復が必要かチェック          //
//-------------------------------//
function chkrokakucare(){
    console.log("回復が必要かチェック開始");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("神医系回復チェックを行います");}
    var l_chk = 0;
    var l_page;
    var l_chkzen=false;
    var l_hp;
    var l_level;
    var l_label;
    var kaitime="";
    var l_chkdec=0;
    console.log("全軍が設定されているカードがHPが足りずに乗せられないかどうか");
    rlabel1:
    for (var k = 1; k <= rkkzennum; k++) {
        //全軍に設定されているカードを乗せる
        var ZANCD = eval("ROKAKU_ZANCD" + k);
        var ZANLBL = eval("ROKAKU_ZANLBL" + k);
        var YNZEN = eval("YN_ROKAKUZEN" + k);
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)){
            //全軍カードがデッキに乗っているか
            l_chkzen=false;
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if(deckList[d].name == m_rokaku_options[ZANCD] ) {
                        //全軍と同じ名前のカードが存在する
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は全軍に設定されていてデッキに存在するカード名です");}
                        l_chkzen=true;
                    }
                }
            }
            l_label = m_rokaku_options[ZANLBL];
            if (l_chkzen==false){
                //カードがデッキに乗ってない
                l_page= GM_getValue(GM_KEY + 'lblpage' + l_label ,1);
                rlabel2:
                for (var m = 1; m <= l_page ; m++) {
                    //ファイルのカードを取得
                    console.log("fileno: %d   page:  %d" , l_label , m);
                    getfilelist(l_label , m);
                    var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                    if (fileList.length != 0 ) {
                        rlabel3:
                        for( var fa= 0; fa < fileList.length; fa++ ) {
                            console.log("fileno: %d  カード名: %s HP: %d  カードLV:  %d" , l_label , fileList[fa].name, fileList[fa].hp, fileList[fa].level);
                            if (fileList[fa].name == m_rokaku_options[ZANCD]){
                                l_hp=parseInt(fileList[fa].hp);
                                l_level=parseInt(fileList[fa].level);
                                if ((l_hp<100) && (l_level>0)){
                                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は全軍に設定されていてデッキに存在しないカード名です。回復必要");}
                                    console.log("HP100以下なので回復する");
                                    l_chk = 1;
                                    break rlabel1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("鹵獲カードでHPが足りずに出兵できないものがあるかどうか");
    l_chkdec=0;
    if (l_chk ==0){
        l_page = GM_getValue(GM_KEY + 'lblpage' + m_rokaku_options[ROKAKU_LABEL],1);
        rlabel5:
        for (var m = 1; m <= l_page ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + m_rokaku_options[ROKAKU_LABEL] +"page:" +m);
            getfilelist(m_rokaku_options[ROKAKU_LABEL] , m);
            var fileList = rloadData(GM_KEY+"fileList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("ラベル:"+m_rokaku_options[ROKAKU_LABEL]+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    //セットできるカードが鹵獲スキルかチェックする
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+fileList[fa].name+" HP:"+fileList[fa].hp+" 討伐:"+fileList[fa].gage+" ボタン:"+fileList[fa].setsta);}
                    if (fileList[fa].setsta =="set" &&  parseInt(fileList[fa].gage)  > 99){  //デッキにセット可能  かつ討伐ゲージ100以上
                        //鹵獲スキルを持ち、かつ、スキル回復中じゃない
                        console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + "skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + "skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        //攻撃NGリストにないことを確認
                        if (m_rokaku_options[YN_ATTKCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){
                                            var txt=fileList[fa].name +":攻撃NGリストのカードです。";
                                            setrokakulog(txt);
                                        }
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        //速度NGリストにないことを確認
                        if (m_rokaku_options[YN_SPEEDCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){
                                            var txt=fileList[fa].name +":速度NGリストのカードです。";
                                            setrokakulog(txt);
                                        }
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        if (l_chkdec==0){
                            j$.each(rokakuskillist, function(key, value) {
                                var SKCK = eval("ROKAKU_USEDSKIL" + key );
                                if (m_rokaku_options[SKCK]==true){
                                    var syupeflag = false;
                                    if ((fileList[fa].cdskil1.indexOf(value) != -1) && (fileList[fa].cdskil1kai == true)){ syupeflag = true;}
                                    else if ((fileList[fa].cdskil2.indexOf(value) != -1) && (fileList[fa].cdskil2kai == true)){ syupeflag = true;}
                                    else if ((fileList[fa].cdskil3.indexOf(value) != -1) && (fileList[fa].cdskil3kai == true)){ syupeflag = true;}
                                    else if ((fileList[fa].cdskil4.indexOf(value) != -1) && (fileList[fa].cdskil4kai == true)){ syupeflag = true;}
                                    if (syupeflag == true){
                                        console.log("出兵できるカードが存在する");
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+fileList[fa].name+"は回復せずに出兵できる");}
                                        l_chk = 2;
                                        return false;
                                    }
                                }
                            });
                            if  (l_chk==2){
                                break rlabel5;
                            }
                        }
                    }
                } //fa
            }
        }
    }
    l_chkdec=0;
    if (l_chk ==0){
        l_page = GM_getValue(GM_KEY + 'lblpage' + m_rokaku_options[ROKAKU_LABEL],1);
        rlabel6:
        for (var m = 1; m <= l_page ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + m_rokaku_options[ROKAKU_LABEL] +"page:" +m);
            getfilelist(m_rokaku_options[ROKAKU_LABEL] , m);
            var fileList = rloadData(GM_KEY+"fileList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("ラベル:"+m_rokaku_options[ROKAKU_LABEL]+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    //セットできるカードが鹵獲スキルかチェックする
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+fileList[fa].name+" HP:"+fileList[fa].hp+" 討伐:"+fileList[fa].gage+" ボタン:"+fileList[fa].setsta);}
                    if ((parseInt(fileList[fa].gage)  > 99) && (fileList[fa].setsta.indexOf("操作不可") == -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1)){  //討伐ゲージ100以上
                        //鹵獲スキルを持ち、かつ、スキル回復中じゃない
                        console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + "skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + "skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        //攻撃NGリストにないことを確認
                        if (m_rokaku_options[YN_ATTKCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){
                                            var txt=fileList[fa].name +":攻撃NGリストのカードです。";
                                            setrokakulog(txt);
                                        }
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        //速度NGリストにないことを確認
                        if (m_rokaku_options[YN_SPEEDCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){
                                            var txt=fileList[fa].name +":速度NGリストのカードです。";
                                            setrokakulog(txt);
                                        }
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        if (l_chkdec==0){
                            j$.each(rokakuskillist, function(key, value) {
                                var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                                if (m_rokaku_options[SKCK]==true){
                                    var syupeflag = false;
                                    if (( fileList[fa].cdskil1.indexOf(value) != -1) && (fileList[fa].cdskil1kai == true)){ syupeflag = true;}
                                    else if (( fileList[fa].cdskil2.indexOf(value) != -1) && (fileList[fa].cdskil2kai == true)){ syupeflag = true;}
                                    else if (( fileList[fa].cdskil3.indexOf(value) != -1) && (fileList[fa].cdskil3kai == true)){ syupeflag = true;}
                                    else if (( fileList[fa].cdskil4.indexOf(value) != -1) && (fileList[fa].cdskil4kai == true)){ syupeflag = true;}
                                    if (syupeflag == true){
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+fileList[fa].name+"はHP回復すれば出兵できるカードが存在する");}
                                        console.log("HPが回復できれば出兵できるカードが存在する");
                                        l_chk = 1;
                                        return false;
                                        //break rlabel6;
                                    } else {
                                        if ((fileList[fa].cdskil1.indexOf(value) != -1) && (fileList[fa].cdskil1kai == false)){
                                            if (kaitime==""){
                                                kaitime=fileList[fa].skilkaitime1;
                                            } else {
                                                if (Date.parse(fileList[fa].skilkaitime1) < Date.parse(kaitime)){
                                                    kaitime=fileList[fa].skilkaitime1;
                                                }
                                            }
                                        }
                                        if ((fileList[fa].cdskil2.indexOf(value) != -1) && (fileList[fa].cdskil2kai == false)){
                                            if (kaitime==""){
                                                kaitime=fileList[fa].skilkaitime2;
                                            } else {
                                                if (Date.parse(fileList[fa].skilkaitime2) < Date.parse(kaitime)){
                                                    kaitime=fileList[fa].skilkaitime2;
                                                }
                                            }
                                        }
                                        if ((fileList[fa].cdskil3.indexOf(value) != -1) && (fileList[fa].cdskil3kai == false)){
                                            if (kaitime==""){
                                                kaitime=fileList[fa].skilkaitime3;
                                            } else {
                                                if (Date.parse(fileList[fa].skilkaitime3) < Date.parse(kaitime)){
                                                    kaitime=fileList[fa].skilkaitime3;
                                                }
                                            }
                                        }
                                        if ((fileList[fa].cdskil4.indexOf(value) != -1) && (fileList[fa].cdskil4kai == false)){
                                            if (kaitime==""){
                                                kaitime=fileList[fa].skilkaitime4;
                                            } else {
                                                if (Date.parse(fileList[fa].skilkaitime4) < Date.parse(kaitime)){
                                                    kaitime=fileList[fa].skilkaitime4;
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                            if  (l_chk==1){
                                break rlabel6;
                            }
                        }
                    }
                } //fa
            }
        }
    }
    if( l_chk ==0){
        console.log("HPが回復しても出兵できるカードは存在しない");
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("HPが回復しても出兵できるカードは存在しない");}
        //優先順位 +1
        var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
        rokaku_mode=rokaku_mode+1;
        GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
        GM_setValue(GM_KEY +"_rokaku_kaitime", kaitime);
        GM_setValue(GM_KEY +"_kaiflg1", 1);
        setrokakulog("鹵獲モード:"+rokaku_mode);
    }
    return l_chk;
}

//-------------------------------//
// パッシブ回復が必要かチェック  //
//-------------------------------//
function chkpassivecare(){
    console.log("回復が必要かチェック開始");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("神医系の回復が必要かチェック開始");}
    var l_chk = 0;
    var l_page;
    var l_chkzen=false;
    var l_hp;
    var l_level;
    var l_label;
    console.log("全軍が設定されているカードがHPが足りずに乗せられないかどうか");
    label1:
    for (var k = 1; k <= rkkpznum; k++) {
        //全軍に設定されているカードかどうか
        var ZANCD = eval("ROKAKUP_ZANCD" + k);
        var ZANLBL = eval("ROKAKUP_ZANLBL" + k);
        var YNPZEN = eval("YN_ROKAKUPZEN" + k);
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
            //全軍カードがデッキに乗っているか
            l_chkzen=false;
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if(deckList[d].name == m_rokaku_options[ZANCD] ) {
                        //全軍と同じ名前のカードが存在する
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は全軍に設定されているカードでデッキに存在します");}
                        l_chkzen=true;
                    }
                }
            }
            l_label = m_rokaku_options[ZANLBL];
            if (l_chkzen==false){
                //カードがデッキに乗ってない
                l_page= GM_getValue(GM_KEY + 'lblpage' + l_label ,1);
                label2:
                for (var m = 1; m <= l_page ; m++) {
                    //ファイルのカードを取得
                    console.log("fileno: %d   page:  %d" , l_label , m);
                    getfilelist(l_label , m);
                    var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                    if (fileList.length != 0 ) {
                        label3:
                        for( var fa= 0; fa < fileList.length; fa++ ) {
                            console.log("fileno: %d  カード名: %s HP: %d  カードLV:  %d" , l_label , fileList[fa].name, fileList[fa].hp, fileList[fa].level);
                            if (fileList[fa].name == m_rokaku_options[ZANCD]){
                                l_hp=parseInt(fileList[fa].hp);
                                l_level=parseInt(fileList[fa].level);
                                if ((l_hp<100) && (l_level>0)){
                                    console.log("HP100以下なので回復する");
                                    if (m_rokaku_options[DEBUGFLG]==true){
                                        var txt=m_rokaku_options[ZANCD]+":鹵獲パッシブ全軍に設定されているカードで、デッキになくHP100以下。回復必要";
                                        setrokakulog(txt);
                                    }
                                    l_chk = 1;
                                    break label1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("鹵獲パッシブカードでHPが足りずに乗せられないのか");
    if (l_chk ==0){
        label1:
        for (var k = 1; k <= rkknum; k++) {
            //パッシブに設定されているカードかどうか
            var ZANCD = eval("ROKAKUP_CD" + k);
            var ZANLBL = eval("ROKAKUP_LBL" + k);
            var YNRP = eval("YN_ROKAKUP" + k);
            if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNRP]==true)){
                //パッシブカードがデッキに乗っているか
                l_chkzen=false;
                var deckList = rloadData(GM_KEY+"deckList", "[]", true);
                if (deckList.length != 0 ) {
                    for( var d = 0; d < deckList.length; d++ ) {
                        if( deckList[d].name == m_rokaku_options[ZANCD] ) {
                            //パッシブと同じ名前のカードが存在する
                            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"はパッシブに設定されているカードでデッキに存在します");}
                            l_chkzen=true;
                        }
                    }
                }
                l_label = m_rokaku_options[ZANLBL];
                if (l_chkzen==false){
                    //カードがデッキに乗ってない
                    l_page= GM_getValue(GM_KEY + 'lblpage' + l_label ,1);
                    label2:
                    for (var m = 1; m <= l_page ; m++) {
                        //ファイルのカードを取得
                        console.log("fileno: %d   page:  %d" , l_label , m);
                        getfilelist(l_label , m);
                        var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                        if (fileList.length != 0 ) {
                            label3:
                            for( var fa= 0; fa < fileList.length; fa++ ) {
                                console.log("fileno: %d  カード名: %s HP: %d  状態:  %s" , l_label , fileList[fa].name, fileList[fa].hp,fileList[fa].setsta);
                                if (fileList[fa].setsta.match(/HP回復中/) && (fileList[fa].name == m_rokaku_options[ZANCD])){
                                    console.log("HP100以下なので回復する");
                                    if (m_rokaku_options[DEBUGFLG]==true){
                                        var txt=m_rokaku_options[ZANCD]+":鹵獲パッシブに設定されているカードで、デッキになくHP100以下。回復必要";
                                        setrokakulog(txt);
                                    }
                                    l_chk = 1;
                                    break label1;
                                } else if (fileList[fa].setsta.match(/デッキコスト不足/) && (fileList[fa].name == m_rokaku_options[ZANCD])){
                                    if (m_rokaku_options[DEBUGFLG]==true){
                                        var txt=m_rokaku_options[ZANCD]+":鹵獲パッシブに設定されているカードで、コスト不足";
                                        setrokakulog(txt);
                                    }
                                    break label1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return l_chk;
}
//----------------------------------//
//  鹵獲設定回復処理                //
//----------------------------------//
function rokakucare(cdlist){
    console.log("回復処理開始");
    //回復拠点に内政設定武将が存在する
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    if (deckList.length != 0 ) {
        for( var d = 0; d < deckList.length; d++ ) {
            if ((deckList[d].setsta.indexOf("内政セット済") != -1) && (m_rokaku_options[KAIHK_VIL]==deckList[d].setvil)){
                setrokakulog("回復拠点に内政武将が存在します");
                return 0;
            }
        }
    }
    var CDLST = eval(cdlist);
    var obj = m_rokaku_options[CDLST];
    var l_page=0;
    var l_lbl=0;
    var kaitime="";
    var l_ret=0;
    var l_chk=false;
    var l_status=0;
    var l_ckNgnum=0;
    Label0:
    for(var k in obj){
        console.log(obj[k] + "のスキルを探す");
        if (m_rokaku_options[DEBUGFLG]==true){
            var txt=obj[k] + "のスキルを探す処理を開始";
            setrokakulog(txt);
        }
        var kailabl="";
        var kailevel="";
        var kaipage="";
        if (obj[k]=="仁君"){kailabl=m_rokaku_options[JIN_LABEL]; kailevel=m_rokaku_options[JIN_SKILLV];}
        else if (obj[k]=="神医の施術"){kailabl=m_rokaku_options[SEJYU_LABEL]; kailevel=m_rokaku_options[SEJYU_SKILLV]; }
        else if (obj[k]=="弓腰姫の愛"){kailabl=m_rokaku_options[KYUYOKI_LABEL]; kailevel=m_rokaku_options[KYUYOKI_SKILLV]; }
        else if (obj[k]=="皇后の慈愛"){kailabl=m_rokaku_options[KGJAI_LABEL]; kailevel=m_rokaku_options[KGJAI_SKILLV]; }
        else if (obj[k]=="桃色吐息"){kailabl=m_rokaku_options[MOMO_LABEL]; kailevel=m_rokaku_options[MOMO_SKILLV]; }
        else if (obj[k]=="酔吟吐息"){kailabl=m_rokaku_options[SUIGIN_LABEL]; kailevel=m_rokaku_options[SUIGIN_SKILLV]; }
        else if (obj[k]=="文姫の慈愛"){kailabl=m_rokaku_options[BNKJAI_LABEL]; kailevel=m_rokaku_options[BNKJAI_SKILLV];}
        else if (obj[k]=="神卜の方術"){kailabl=m_rokaku_options[SINBK_LABEL]; kailevel=m_rokaku_options[SINBK_SKILLV];}
        else if (obj[k]=="娘々敬慕"){kailabl=m_rokaku_options[NNKEB_LABEL]; kailevel=m_rokaku_options[NNKEB_SKILLV];}
        else if (obj[k]=="熊猫の麺匠"){kailabl=m_rokaku_options[PNDMEN_LABEL]; kailevel=m_rokaku_options[PNDMEN_SKILLV];}
        else if (obj[k]=="神医の術式"){kailabl=m_rokaku_options[JYUTU_LABEL]; kailevel=m_rokaku_options[JYUTU_SKILLV];}
        else if (obj[k]=="劉備の契り"){kailabl=m_rokaku_options[CIGIRI_LABEL]; kailevel=m_rokaku_options[CIGIRI_SKILLV];}
        else if (obj[k]=="神卜の術式"){kailabl=m_rokaku_options[BKJYUTU_LABEL]; kailevel=m_rokaku_options[BKJYUTU_SKILLV];}

        kaipage= GM_getValue(GM_KEY + 'lblpage' + kailabl,1);
        for (var m = 1; m <= kaipage ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + kailabl +" page:" +m +" skillevel:" + kailevel);
            //if ((l_page==m)&&(l_lbl==kailabl)){} else {
                getfilelist(kailabl, m);
            //    l_page=m;
            //    l_lbl=kailabl;
            //}
            var fileList = rloadData(GM_KEY+"fileList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("ラベル:"+kailabl+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                    console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                    console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                    var kaiflag = false;
                    var kaiskilid="";
                    var kainame="";
                    if (( fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                    else if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                    else if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                    else if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                    if (m_rokaku_options[DEBUGFLG]==true){
                        setrokakulog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        setrokakulog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        setrokakulog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        setrokakulog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta);
                    }
                    //デッキに乗せる
                    if (kaiflag == true){
                        l_chk=true;
                        if (fileList[fa].setsta =="set"){
                            console.log("内政セットしてスキル発動する");
                            //回復拠点設定
                            var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                            var setvillage ="";
                            for (var ln = 0; ln< lists.length; ln++) {
                                if(lists[ln].name==m_rokaku_options[KAIHK_VIL]){
                                    setvillage=lists[ln].id;
                                }
                            }
                            if (setvillage!=""){
                                console.log("回復拠点ID:" + setvillage);
                                l_status=setdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                                if (l_status==0){
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                                    setrokakulog(txt);
                                    break Label0;
                                } else {
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                                    setrokakulog(txt);
                                    l_chk=false;
                                    l_ckNgnum=l_ckNgnum+1;
                                }
                            } else {
                                setrokakulog("拠点が存在しません");
                                GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                break Label0;
                            }
                            if (parseInt(l_ckNgnum)>parseInt(statngnum)){
                                setrokakulog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                                GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                break Label0;
                            }
                        }
                    } else {
                        if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].cdskil1kai == false) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime1;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime1) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime1;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].cdskil2kai == false) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime2;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime2) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime2;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].cdskil3kai == false) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime3;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime3) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime3;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].cdskil4kai == false) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime4;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime4) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime4;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==false){
        setrokakulog("使用できる神医系回復武将が存在しない");
        //優先順位 +1
        var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
        if (m_rokaku_options[USEDLST1] == rokaku_mode){
            GM_setValue(GM_KEY +"_kaiflg1", 1);
        } else if (m_rokaku_options[USEDLST2] == rokaku_mode){
            GM_setValue(GM_KEY +"_kaiflg2", 1);
        }
        rokaku_mode=rokaku_mode+1;
        GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
        GM_setValue(GM_KEY +"_"+cdlist+"_kaitime", kaitime);
        setrokakulog("鹵獲モード:"+rokaku_mode);
        l_ret=1;
    }
    return l_ret;
}

//----------------------------------//
//  傾国回復処理                    //
//----------------------------------//
function rkeicare(){
    console.log("傾国スキルを探す");
    if (m_rokaku_options[DEBUGFLG]==true){
        setrokakulog("傾国スキルを探す");
    }
    var l_chk=0;
    var l_rank=false;
    var kailabl=m_rokaku_options[KEI_LABEL];
    var kailevel=m_rokaku_options[KEI_SKILLV];
    var kaipage= GM_getValue(GM_KEY + 'lblpage' + kailabl,1);
    var kaitime="";
    var l_status=0;
    var l_ckNgnum=0;
    Label0:
    for (var m = 1; m <= kaipage ; m++) {
        //ファイルのカードを取得
        console.log("fileno:" + kailabl +" page:" + m +" skillevel:" + kailevel );
        getfilelist(kailabl , m);
        var fileList = rloadData(GM_KEY+"fileList", "[]", true);
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国ラベル:"+kailabl+" ページ:"+m);}
        if (fileList.length != 0 ) {
            for( var fa= 0; fa < fileList.length; fa++ ) {
                console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                var kaiflag = false;
                var kaiskilid="";
                var kainame="";
                if ((fileList[fa].cdskil1.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                else if ((fileList[fa].cdskil2.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                else if ((fileList[fa].cdskil3.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                else if ((fileList[fa].cdskil4.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                if (m_rokaku_options[DEBUGFLG]==true){
                        setrokakulog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        setrokakulog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        setrokakulog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        setrokakulog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta + " 回復コストフラグ:" + m_rokaku_options[YN_RKKAI]);
                 }
                //デッキに乗せる
                if (kaiflag == true){
                    if (fileList[fa].setsta =="set"){
                        l_rank=true;
                        console.log("傾国セットしてスキル発動する");
                        //回復拠点設定
                        var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                        var setvillage ="";
                        for (var ln = 0; ln< lists.length; ln++) {
                            if(lists[ln].name==m_rokaku_options[KAIHK_VIL]){
                                setvillage=lists[ln].id;
                            }
                        }
                        if (setvillage!=""){
                            console.log("回復拠点ID:" + setvillage);
                            l_status=setdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                            if (l_status==0){
                                var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                                setrokakulog(txt);
                                break Label0;
                            } else {
                                var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                                setrokakulog(txt);
                                l_rank=false;
                                l_ckNgnum=l_ckNgnum+1;
                            }
                        } else {
                            setrokakulog("拠点が存在しません");
                            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                            break Label0;
                        }
                        if (parseInt(l_ckNgnum)>parseInt(statngnum)){
                            setrokakulog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                            GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                            break Label0;
                        }
                    } else {
                        if ((fileList[fa].cdskil1.indexOf("傾国") != -1) && (fileList[fa].cdskil1kai == false) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime1;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime1) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime1;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil2.indexOf("傾国") != -1) && (fileList[fa].cdskil2kai == false) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime2;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime2) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime2;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil3.indexOf("傾国") != -1) && (fileList[fa].cdskil3kai == false) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime3;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime3) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime3;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil4.indexOf("傾国") != -1) && (fileList[fa].cdskil4kai == false) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime4;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime4) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime4;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_rank==false){
        if (m_rokaku_options[DEBUGFLG]==true){
            setrokakulog("傾国スキルで回復しているものが存在しない");
        }
        //攻奪カードが存在するか
        var deckList = rloadData(GM_KEY+"deckList", "[]", true);
        if (deckList.length != 0 ) {
            for( var d= 0; d < deckList.length; d++ ) {
                for (var k = 1; k <= rkknum; k++) {
                    var PVCD = eval("ROKAKUP_CD" + k);
                    var KEIFLG = eval("YN_USEKEI" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        //パッシブ設定カードかどうか
                        if(deckList[d].name == m_rokaku_options[PVCD] ) {
                            //鹵獲拠点にパッシブ設定カードのカードが存在する
                            if ((m_rokaku_options[KEIFLG]==false)&& (deckList[d].setvil == m_rokaku_options[ROKAKU_VIL])) {
                                GM_setValue(GM_KEY +"_kekokusk_kaitime", kaitime);
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国使用なし設定のカードが存在する:"+deckList[d].name);}
                                l_chk=1;
                            }
                        }
                    }
                }
            }
        }
        if (l_chk!=1){
            setrokakulog("傾国スキルの回復している武将が存在しない");
            //優先順位 +1
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode=rokaku_mode+1;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            GM_setValue(GM_KEY +"_kekoku_kaitime", kaitime);
            GM_setValue(GM_KEY +"_kaiflg2", 1);
            setrokakulog("鹵獲モード:"+rokaku_mode);
            l_chk=2;
        }
    }
    return l_chk;
}

//----------------------------------//
//  傾国スキルの存在                //
//----------------------------------//
function rkeiExi(){
    console.log("傾国スキルが回復しているか");
    var l_chk=0;
    var l_rank=false;
    var kailabl=m_rokaku_options[KEI_LABEL];
    var kailevel=m_rokaku_options[KEI_SKILLV];
    var kaipage= GM_getValue(GM_KEY + 'lblpage' + kailabl,1);
    var kaitime=0;
    Label0:
    for (var m = 1; m <= kaipage ; m++) {
        //ファイルのカードを取得
        console.log("fileno:" + kailabl +" page:" + m +" skillevel:" + kailevel );
        getfilelist(kailabl , m);
        var fileList = rloadData(GM_KEY+"fileList", "[]", true);
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国ラベル:"+kailabl+" ページ:"+m);}
        if (fileList.length != 0 ) {
            for( var fa= 0; fa < fileList.length; fa++ ) {
                console.log("fileno:" + kailabl +"カード名:"+ fileList[fa].name);
                console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                var kaiflag = false;
                var kaiskilid="";
                if ((fileList[fa].cdskil1.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil1id;}
                else if ((fileList[fa].cdskil2.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil2id;}
                else if ((fileList[fa].cdskil3.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil3id;}
                else if ((fileList[fa].cdskil4.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){kaiflag = true; kaiskilid = fileList[fa].cdskil4id;}
                if (m_rokaku_options[DEBUGFLG]==true){
                        setrokakulog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        setrokakulog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        setrokakulog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        setrokakulog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta);
                 }
                //傾国スキルがある
                if (kaiflag == true){
                    l_rank=true;
                    l_chk=1;
                    break Label0;
                } else {
                    if ((fileList[fa].cdskil1.indexOf("傾国") != -1) && (fileList[fa].cdskil1kai == false) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                        if (kaitime==""){
                            kaitime=fileList[fa].skilkaitime1;
                        } else {
                            if (Date.parse(fileList[fa].skilkaitime1) < Date.parse(kaitime)){
                                kaitime=fileList[fa].skilkaitime1;
                            }
                        }
                    }
                    if ((fileList[fa].cdskil2.indexOf("傾国") != -1) && (fileList[fa].cdskil2kai == false) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                        if (kaitime==""){
                            kaitime=fileList[fa].skilkaitime2;
                        } else {
                            if (Date.parse(fileList[fa].skilkaitime2) < Date.parse(kaitime)){
                                kaitime=fileList[fa].skilkaitime2;
                            }
                        }
                    }
                    if ((fileList[fa].cdskil3.indexOf("傾国") != -1) && (fileList[fa].cdskil3kai == false) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                        if (kaitime==""){
                            kaitime=fileList[fa].skilkaitime3;
                        } else {
                            if (Date.parse(fileList[fa].skilkaitime3) < Date.parse(kaitime)){
                                kaitime=fileList[fa].skilkaitime3;
                            }
                        }
                    }
                    if ((fileList[fa].cdskil4.indexOf("傾国") != -1) && (fileList[fa].cdskil4kai == false) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                        if (kaitime==""){
                            kaitime=fileList[fa].skilkaitime4;
                        } else {
                            if (Date.parse(fileList[fa].skilkaitime4) < Date.parse(kaitime)){
                                kaitime=fileList[fa].skilkaitime4;
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_rank==false){
        //傾国使用武将しかいない
        for (var k = 1; k <= rkknum; k++) {
            var PVCD = eval("ROKAKUP_CD" + k);
            var KEIFLG = eval("YN_USEKEI" + k);
            var YNRP = eval("YN_ROKAKUP" + k);
            if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                if (m_rokaku_options[KEIFLG]==false) {
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("傾国使用なし設定のカードが存在する");}
                    GM_setValue(GM_KEY +"_kekokusk_kaitime", kaitime);
                    l_chk=2;
                }
            }
        }
        //優先順位 +1
        if (l_chk!=2){
            setrokakulog("傾国スキルの回復している武将が存在しない");
            var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
            rokaku_mode=rokaku_mode+1;
            GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
            GM_setValue(GM_KEY +"_kekoku_kaitime", kaitime);
            l_chk=0;
            GM_setValue(GM_KEY +"_kaiflg2", 1);
            setrokakulog("鹵獲モード:"+rokaku_mode);
        }
    }
    return l_chk;
}

//-------------------------------//
// パッシブ回復                  //
//-------------------------------//
function passivecare(){
    var l_ret=0;
    if (m_rokaku_options[YN_RKKAI]==false){
        var deckList = rloadData(GM_KEY+"deckList", "[]", true);
        console.log("LV0のカードを下ろす処理開始");
        if (m_rokaku_options[DEBUGFLG]==true){
            setrokakulog("LV0のカードを下ろす処理開始");
        }
        var l_chk=false;
        if (deckList.length != 0 ) {
            Label1:
            for( var d = 0; d < deckList.length; d++ ) {
                if((parseInt(deckList[d].level) == 0) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                    //出撃中のカードで２分以内の着弾がない
                    console.log("120秒以内の着弾があるか");
                    var l_second=getsortie();
                    if (l_second > 120){
                        console.log("120秒以内の着弾なし");
                        unsetdeckcard2(deckList[d].cdid);
                        var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                        setrokakulog(txt);
                    } else {
                        if (m_rokaku_options[DEBUGFLG]==true){
                            setrokakulog("着弾120秒以内の武将がいる");
                        }
                    }
                    break Label1;
                }
            }
        }
    }
    l_ret=rokakucare('FLERECSKIL1');
    return l_ret;
}
//-------------------------------//
// HP回復処理                    //
//-------------------------------//
function passivejinset(){
    var l_chk=0;
    var l_ret=0;
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    //HP回復処理が必要かチェック
    if (m_rokaku_options[YN_RKPJIN]==true){
        l_chk=0;
        if (deckList.length != 0 ) {
            for(var d= 0; d < deckList.length; d++) {
                for (var k = 1; k <= rkknum; k++) {
                    var PVCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        //パッシブ設定カードかどうか
                        if(deckList[d].name == m_rokaku_options[PVCD]) {
                            //鹵獲拠点に待機中のパッシブ設定カードでHP(設定値)以下のカードが存在する
                            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                            if ((deckList[d].setsta.match(/待機中/))  && (parseInt(deckList[d].hp) < parseInt(m_rokaku_options[RKPJINHP])) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                                //if (m_rokaku_options[DEBUGFLG]==true){
                                    var txt="カード:"+ deckList[d].cdid + " " +deckList[d].name+" HP:"+deckList[d].hp+" HP回復要";
                                    setrokakulog(txt);
                                //}
                                l_chk=1;
                            }
                        }
                    }
                }
            }
        }
        if ( l_chk==1){
            l_ret=rhpcare('RECSKIL2');
        }
    }
    return l_ret;
}

//-------------------------------//
// 傾国回復処理                  //
//-------------------------------//
function passivekeiset(){
    var l_chk=0;
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var l_ret=0;
    var l_chksec=0;
    //傾国回復処理が必要かチェック
    if (deckList.length != 0 ) {
        for( var d= 0; d < deckList.length; d++ ) {
            for (var k = 1; k <= rkknum; k++) {
                var PVCD = eval("ROKAKUP_CD" + k);
                var KEIFLG = eval("YN_USEKEI" + k);
                var YNRP = eval("YN_ROKAKUP" + k);
                if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                    //パッシブ設定カードかどうか
                    if( deckList[d].name == m_rokaku_options[PVCD] ) {
                        //鹵獲拠点に待機中のパッシブ設定カードで討伐100以下のカードが存在する
                        console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 討伐:"+ deckList[d].gage);
                        if ((deckList[d].setsta.match(/待機中/))  && (parseInt(deckList[d].gage) < 100) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                            if (m_rokaku_options[DEBUGFLG]==true){
                                setrokakulog(deckList[d].name+":待機中で討伐ゲージ100以下の武将が存在する");
                            }
                            l_chk=1;
                        }
                    }
                }
            }
        }
    }
    if ( l_chk==1){
        //指定カード以外のカードは待機中
        for( var d= 0; d < deckList.length; d++ ) {
            for (var k = 1; k <= rkknum; k++) {
                var PVCD = eval("ROKAKUP_CD" + k);
                var KEIFLG = eval("YN_USEKEI" + k);
                var YNRP = eval("YN_ROKAKUP" + k);
                if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                    //パッシブ設定カードかどうか
                    if ((deckList[d].name == m_rokaku_options[PVCD])  && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                        //待機中以外のカード
                        if (m_rokaku_options[KEIFLG]==true){
                            if (deckList[d].setsta.indexOf('待機中') == -1) {
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    setrokakulog("出兵中で傾国使用武将が存在するので戻るまで待機する");
                                }
                                //待機・リロード
                                l_chk=2;
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==2){
        //指定カードが待機中のときは、l_chk=4;
        for( var d= 0; d < deckList.length; d++ ) {
            for (var k = 1; k <= rkknum; k++) {
                var PVCD = eval("ROKAKUP_CD" + k);
                var KEIFLG = eval("YN_USEKEI" + k);
                var YNRP = eval("YN_ROKAKUP" + k);
                if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                    //パッシブ設定カードかどうか
                    if ((deckList[d].name == m_rokaku_options[PVCD])  && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                        //待機中のカード
                        if (m_rokaku_options[KEIFLG]==false){
                            if (deckList[d].setsta.match(/待機中/)) {
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    setrokakulog(deckList[d].name+"は傾国が必要ないカードで待機中");
                                }
                                //待機・リロード
                                l_chk=4;
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==1){
        //回復拠点に内政設定武将が存在する
        var deckList = rloadData(GM_KEY+"deckList", "[]", true);
        if (deckList.length != 0 ) {
            for( var d = 0; d < deckList.length; d++ ) {
                if ((deckList[d].setsta.indexOf("内政セット済") != -1) && (m_rokaku_options[KAIHK_VIL]==deckList[d].setvil)){
                    setrokakulog("回復拠点に内政武将が存在します");
                    l_chk=3;
                }
            }
        }
    }
    if (l_chk==1){
        //傾国カードが存在するか
        var l_keiflag=rkeiExi();
        if (l_keiflag==1){
            //レベル0のカードを下す
            if (m_rokaku_options[YN_RKKAI]==false){
                var deckList = rloadData(GM_KEY+"deckList", "[]", true);
                console.log("LV0のカードを下ろす処理開始");
                if (m_rokaku_options[DEBUGFLG]==true){
                    setrokakulog("LV0のカードを下ろす処理開始");
                }
                if (deckList.length != 0 ) {
                    Label1:
                    for( var d = 0; d < deckList.length; d++ ) {
                        if((parseInt(deckList[d].level) == 0) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                            //出撃中のカードで２分以内の着弾がない
                            console.log("120秒以内の着弾があるか");
                            var l_second=getsortie();
                            if (l_second > 120){
                                console.log("120秒以内の着弾なし");
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                            } else {
                                l_chksec=1;
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    setrokakulog("120秒以内に着弾する武将が存在するので待機");
                                }
                            }
                            break Label1;
                        }
                    }
                }
            }
            if (l_chksec!=1){
                l_ret=rkeicare();
            }
            if (l_ret==2){
                l_chk=3;
            } else {
                l_chk=0;
            }
        } else if(l_keiflag==0){
            l_chk=3;
        }
    }
    return l_chk;
}

//----------------------------------//
//  鹵獲HP回復処理                  //
//----------------------------------//
function rhpcare(cdlist){
    console.log("HP回復処理開始");
    //回復拠点に内政設定武将が存在する
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    if (deckList.length != 0 ) {
        for( var d = 0; d < deckList.length; d++ ) {
            if ((deckList[d].setsta.indexOf("内政セット済") != -1) && (m_rokaku_options[KAIHK_VIL]==deckList[d].setvil)){
                setrokakulog("回復拠点に内政武将が存在します");
                return 0;
            }
        }
    }
    var CDLST = eval(cdlist);
    var obj = m_rokaku_options[CDLST];
    var l_rank=false;
    var l_page=0;
    var l_lbl=0;
    var kaitime=0;
    var l_chk=0;
    var l_chkcst=0;
    var l_chkname=0;
    var l_status=0;
    var l_ckNgnum=0;
    var l_load=0;
    var l_decklv0=0;
    Label1:
    for(var k in obj){
        console.log(obj[k] + "のスキルを探す");
        if (m_rokaku_options[DEBUGFLG]==true){
            var txt=obj[k] + "のスキルを探す処理を開始";
            setrokakulog(txt);
        }
        var kailabl="";
        var kailevel="";
        var kaipage="";
        l_chk=0;
        l_load=0;
        if (obj[k]=="仁君"){kailabl=m_rokaku_options[JIN_LABEL]; kailevel=m_rokaku_options[JIN_SKILLV];}
        else if (obj[k]=="神医の施術"){kailabl=m_rokaku_options[SEJYU_LABEL]; kailevel=m_rokaku_options[SEJYU_SKILLV]; }
        else if (obj[k]=="弓腰姫の愛"){kailabl=m_rokaku_options[KYUYOKI_LABEL]; kailevel=m_rokaku_options[KYUYOKI_SKILLV]; }
        else if (obj[k]=="皇后の慈愛"){kailabl=m_rokaku_options[KGJAI_LABEL]; kailevel=m_rokaku_options[KGJAI_SKILLV]; }
        else if (obj[k]=="桃色吐息"){kailabl=m_rokaku_options[MOMO_LABEL]; kailevel=m_rokaku_options[MOMO_SKILLV]; }
        else if (obj[k]=="酔吟吐息"){kailabl=m_rokaku_options[SUIGIN_LABEL]; kailevel=m_rokaku_options[SUIGIN_SKILLV]; }
        else if (obj[k]=="文姫の慈愛"){kailabl=m_rokaku_options[BNKJAI_LABEL]; kailevel=m_rokaku_options[BNKJAI_SKILLV];}
        else if (obj[k]=="神卜の方術"){kailabl=m_rokaku_options[SINBK_LABEL]; kailevel=m_rokaku_options[SINBK_SKILLV];}
        else if (obj[k]=="娘々敬慕"){kailabl=m_rokaku_options[NNKEB_LABEL]; kailevel=m_rokaku_options[NNKEB_SKILLV];}
        else if (obj[k]=="熊猫の麺匠"){kailabl=m_rokaku_options[PNDMEN_LABEL]; kailevel=m_rokaku_options[PNDMEN_SKILLV];}
        else if (obj[k]=="神医の術式"){kailabl=m_rokaku_options[JYUTU_LABEL]; kailevel=m_rokaku_options[JYUTU_SKILLV];}
        else if (obj[k]=="劉備の契り"){kailabl=m_rokaku_options[CIGIRI_LABEL]; kailevel=m_rokaku_options[CIGIRI_SKILLV];}
        else if (obj[k]=="神卜の術式"){kailabl=m_rokaku_options[BKJYUTU_LABEL]; kailevel=m_rokaku_options[BKJYUTU_SKILLV];}

        kaipage= GM_getValue(GM_KEY + 'lblpage' + kailabl,1);
        Label0:
        for (var m = 1; m <= kaipage ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + kailabl +" page:" +m +" skillevel:" + kailevel );
            //if ((l_page==m)&&(l_lbl==kailabl)){} else {
                getfilelist(kailabl , m);
           //     l_page=m;
           //     l_lbl=kailabl;
           // }
            var fileList = rloadData(GM_KEY+"fileList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("ラベル:" +kailabl+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                    console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                    console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                    var kaiflag = false;
                    var kaiskilid="";
                    var kainame="";
                    if (m_rokaku_options[YN_RKKAI]==true){
                        if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                        else if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                        else if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                        else if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                    } else {
                        if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99)){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                        else if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99)){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                        else if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99)){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                        else if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99)){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                    }
                    if (m_rokaku_options[DEBUGFLG]==true){
                        setrokakulog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        setrokakulog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        setrokakulog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        setrokakulog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta + " 回復コストフラグ:" + m_rokaku_options[YN_RKKAI]);
                    }
                    if (kaiflag == true){
                        l_rank=true;
                        //デッキに同一名のカードがない
                        var deckList = rloadData(GM_KEY+"deckList", "[]", true);
                        var l_name=false;
                        var l_skilflg = false;
                        if ((deckList.length != 0 ) && (m_rokaku_options[YN_RKKAI]==false)) {
                            for( var d = 0; d < deckList.length; d++ ) {
                                if(deckList[d].name == fileList[fa].name) {
                                    //回復で下すレベル0カードならOK
                                    if ((m_rokaku_options[YN_RKKAI]==false) && (parseInt(deckList[d].level) == 0)){
                                        l_chkname=1;
                                    } else {
                                        console.log("デッキに同一名のカードが存在");
                                        if (m_rokaku_options[DEBUGFLG]==true){
                                            setrokakulog("カード名:"+fileList[fa].name+" デッキに同一名のカードが存在する");
                                        }
                                        l_name=true;
                                    }
                                }
                            }
                        }
                        if (l_name==false){
                            //待機中のみが対象スキル？
                            for( var i= 0; i < waitskillist.length; i++ ) {
                                if (waitskillist[i]==obj[k]){
                                    if (m_rokaku_options[DEBUGFLG]==true){
                                        var txt=obj[k] + "は待機中の武将にのみスキルが有効";
                                        setrokakulog(txt);
                                    }
                                    l_skilflg = true;
                                }
                            }
                        }
                        if ((l_skilflg == true) && (m_rokaku_options[YN_JINKIKAN]==false)){
                            //全ての鹵獲カードが待機中でなければリロード
                            for (var n = 1; n <= rkknum; n++) {
                                var PVCD = eval("ROKAKUP_CD" + n);
                                var YNRP = eval("YN_ROKAKUP" + n);
                                if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                                    for( var d = 0; d < deckList.length; d++ ) {
                                        //パッシブ設定カードかどうか
                                        if ((deckList[d].name == m_rokaku_options[PVCD]) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]) ) {
                                            //鹵獲拠点のパッシブ設定カードで待機中以外のものが存在
                                            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                                            if (deckList[d].setsta.indexOf('待機中') == -1) {
                                                //if (m_rokaku_options[DEBUGFLG]==true){
                                                    var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                                    setrokakulog("カード名:"+ deckList[d].name + " 状態:"+ l_setsta +" 戻るまで待機");
                                                //}
                                                //待機・リロード
                                                l_chk=2;
                                                break Label1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //帰還時間チェック
                        if ((l_skilflg == true) && (m_rokaku_options[YN_JINKIKAN]==true)){
                            if (m_rokaku_options[DEBUGFLG]==true){
                                setrokakulog("帰還時間をチェックする");
                            }
                            getSoldierall();
                            l_load=1;
                            var l_kikakn=parseInt(GM_getValue(GM_KEY + '_kikansec', "99999"));
                            var l_statkikan=m_rokaku_options[RKPJINKIKAN];
                            if (l_statkikan==""){l_statkikan=180;}
                            setrokakulog("帰還時間(秒):"+l_kikakn);
                            if (l_kikakn <= parseInt(l_statkikan)){
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    setrokakulog("設定時間内に帰還する兵士が存在するので待機");
                                }
                                //待機・リロード
                                l_chk=2;
                                break Label1;
                            }
                        }
                        if ((l_chk!=2) && (l_name==false)){
                            //LV0の武将を下ろすなら着弾が2分以内かチェック
                            if (m_rokaku_options[YN_RKKAI]==false){
                                console.log("LV0のカードを下ろす処理開始");
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    setrokakulog("LV0のカードを下ろす処理開始");
                                }
                                if (deckList.length != 0 ) {
                                    Label2:
                                    for( var d = 0; d < deckList.length; d++ ) {
                                        if((parseInt(deckList[d].level) == 0) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])) {
                                            l_decklv0=1;
                                            //空きコストがあるか
                                            var l_usecst = GM_getValue(GM_KEY+"UseCost", 0);
                                            var l_deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
                                            console.log("使用コスト: %d  デッキコスト: %d   Lv0カードコスト: %d",l_usecst,l_deckcst,deckList[d].cost);
                                            var l_cost=(parseFloat(l_deckcst))-(parseFloat(l_usecst))+(parseFloat(deckList[d].cost));
                                            if (l_cost>(parseFloat(fileList[fa].cost))){
                                                if(l_chkname==1) {
                                                    if(deckList[d].name != fileList[fa].name) {
                                                        return true;
                                                    }
                                                }
                                                //出撃中のカードで２分以内の着弾がない
                                                console.log("120秒以内の着弾があるか");
                                                var l_second=99999;
                                                if (l_load==0){
                                                    l_second=getsortie();
                                                } else {
                                                    l_second=parseInt(GM_getValue(GM_KEY + '_sortiesec', "99999"));
                                                }
                                                setrokakulog("着弾時間(秒):"+l_second);
                                                if (l_second > 120){
                                                    console.log("120秒以内の着弾なし");
                                                    unsetdeckcard2(deckList[d].cdid);
                                                    var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                                    setrokakulog(txt);
                                                    l_chkcst=1;
                                                } else {
                                                    if (m_rokaku_options[DEBUGFLG]==true){
                                                        setrokakulog("着弾120秒以内の武将が存在するので待機");
                                                    }
                                                    break Label1;
                                                }
                                                break Label2;
                                            }
                                        }
                                    }
                                }
                                if(l_decklv0==0){
                                    setrokakulog("LV0の武将がデッキに存在しません");
                                    break Label1;
                                }
                            }
                            if ((m_rokaku_options[YN_RKKAI]==true) || (l_chkcst==1)){
                                console.log("内政セットしてスキル発動する");
                                //回復拠点設定
                                var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                                var setvillage ="";
                                for (var vil = 0; vil< lists.length; vil++) {
                                    if(lists[vil].name==m_rokaku_options[KAIHK_VIL]){
                                        setvillage=lists[vil].id;
                                    }
                                }
                                if (setvillage!=""){
                                    console.log("回復拠点ID:" + setvillage);
                                    l_status=setdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                                    if (l_status==0){
                                        var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                                        setrokakulog(txt);
                                        break Label1;
                                    } else {
                                        var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                                        setrokakulog(txt);
                                        l_rank=false;
                                        l_ckNgnum=l_ckNgnum+1;
                                    }
                                } else {
                                   setrokakulog("拠点が存在しません");
                                   GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                   break Label1;
                                }
                                if (parseInt(l_ckNgnum)>parseInt(statngnum)){
                                    setrokakulog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                                    GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                    break Label1;
                                }
                            }
                        }
                    } else {
                        if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].cdskil1kai == false) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime1;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime1) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime1;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].cdskil2kai == false) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime2;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime2) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime2;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].cdskil3kai == false) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime3;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime3) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime3;
                                }
                            }
                        }
                        if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].cdskil4kai == false) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){
                            if (kaitime==""){
                                kaitime=fileList[fa].skilkaitime4;
                            } else {
                                if (Date.parse(fileList[fa].skilkaitime4) < Date.parse(kaitime)){
                                    kaitime=fileList[fa].skilkaitime4;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==2){
        //傾国使用無のカードがHPがある場合は進む
        for (var n = 1; n <= rkknum; n++) {
            var PVCD = eval("ROKAKUP_CD" + n);
            var YNKEI = eval("YN_USEKEI" + n);
            var YNRP = eval("YN_ROKAKUP" + n);
            if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if ((deckList[d].name == m_rokaku_options[PVCD]) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]) && (m_rokaku_options[YNKEI]==false)) {
                        //鹵獲拠点のパッシブ設定カードで待機中で傾国使用無のカードが存在する
                        console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                        if ((deckList[d].setsta.match(/待機中/)) && (parseInt(deckList[d].hp) > parseInt(m_rokaku_options[RKPJINHP]))) {
                            if (m_rokaku_options[DEBUGFLG]==true){
                                setrokakulog("傾国使用＆HP回復必要ない鹵獲パッシブ武将が存在する");
                            }
                            l_chk=3;
                        }
                    }
                }
            }
        }
    }
    if (l_rank==false){
        if (m_rokaku_options[DEBUGFLG]==true){
            setrokakulog("使用できるHP回復武将が存在しない");
        }
        //優先順位 +1
        console.log("優先順位UP");
        var rokaku_mode = GM_getValue(GM_KEY +"RokakuMode", 1);
        GM_setValue(GM_KEY +"_kaiflg2", 1);
        rokaku_mode=rokaku_mode+1;
        GM_setValue(GM_KEY +"RokakuMode", rokaku_mode);
        GM_setValue(GM_KEY +"_"+cdlist+"_kaitime", kaitime);
        setrokakulog("鹵獲モード:"+rokaku_mode);
        l_chk=1;
    }
    return l_chk;
}

//----------------------------------//
//鹵獲全軍配置処理                  //
//----------------------------------//
function rokakuzen(i_zen, i_lbl,i_yn){
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("全軍に設定されているカードを乗せる");}
    var l_num=1;
    var l_ckNgnum=0;
    if (i_zen=="ROKAKU_ZANCD"){
        l_num=rkkzennum;
    } else if(i_zen=="ROKAKUP_ZANCD"){
        l_num=rkkpznum;
    }
    Label0:
    for (var k = 1; k <= l_num; k++) {
        //全軍に設定されているカードを乗せる
        var chkzen=false;
        var ZANCD = eval(i_zen + k);
        var ZANLBL = eval(i_lbl + k);
        var YNZEN = eval(i_yn + k);
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
            //全軍カードがデッキに乗っているか
            chkzen=false;
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if(deckList[d].name == m_rokaku_options[ZANCD]) {
                        //全軍と同じ名前のカードが存在する
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は全軍に設定されていてデッキに存在するカード名です");}
                        chkzen=true;
                    }
                }
            }
            var lblpage = GM_getValue(GM_KEY + 'lblpage' + m_rokaku_options[ZANLBL],1);
            if (chkzen==false){
                for (var m = 1; m <= lblpage ; m++) {
                    //ファイルのカードを取得
                    console.log("fileno:" + m_rokaku_options[ZANLBL] +"page:" +m);
                    getfilelist(m_rokaku_options[ZANLBL] , m);
                    var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                    if (fileList.length != 0 ) {
                        for( var fa= 0; fa < fileList.length; fa++ ) {
                            console.log("fileno:" +m_rokaku_options[ZANLBL]  +"カード名:"+ fileList[fa].name);
                            if ((fileList[fa].name == m_rokaku_options[ZANCD]) && (fileList[fa].setsta =="set")) {
                                console.log("全軍設定"+ k + "と一致");
                                //カードをデッキに乗せる
                                //拠点設定
                                var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                                var setvillage ="";
                                for (var ln = 0; ln< lists.length; ln++) {
                                    if(lists[ln].name==m_rokaku_options[ROKAKU_VIL]){
                                        setvillage=lists[ln].id;
                                    }
                                }
                                if (setvillage!=""){
                                    console.log("鹵獲拠点ID:" + setvillage);
                                    setdeckcard(fileList[fa].cdid, setvillage);
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                                    setrokakulog(txt);
                                } else {
                                    setrokakulog("拠点が存在しません");
                                    GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                    break Label0;
                                }
                            }
                        } //fa
                    }
                }
            }
        }
    }
}
//----------------------------------//
//全軍全部乗ってるかチェック        //
//----------------------------------//
function chksetallzen(chkskil,i_yn){
    console.log("全軍カードがすべてデッキにのっているか");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("全軍カードがすべてデッキにのっているかチェック");}
    var l_num=1;
    if (chkskil=="ROKAKU_ZANCD"){
        l_num=rkkzennum;
    } else if (chkskil=="ROKAKUP_ZANCD"){
        l_num=rkkpznum;
    }
    //全軍が全部乗ってるか
    var l_chk=0;
    var chkzen=false;
    label1:
    for (var k = 1; k <= l_num; k++) {
        //全軍に設定されているカードを乗せる
        l_chk=0;
        var ZANCD = eval(chkskil + k );
        var YNZEN = eval(i_yn + k);
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[ZANCD].length+":全軍チェックカード");}
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[YNZEN]+":全軍チェックフラグ");}
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
            chkzen=false;
            //全軍カードがデッキに乗っているか
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("デッキに存在するカードチェック");}
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+":デッキに存在するカード名");}
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[ZANCD]+":チェックカード");}
                    if(deckList[d].name == m_rokaku_options[ZANCD] ) {
                        //全軍と同じ名前のカードが存在する
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[ZANCD]+"はデッキに存在します");}
                        chkzen=true;
                    }
                }
                if (chkzen==false){
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は全軍に設定されていてデッキに存在しない");}
                    console.log("全軍で乗ってないカードあり");
                    l_chk=1;
                    break label1;
                }
            }
        }
    }
    return l_chk;
}

//----------------------------------//
//鹵獲カードセット処理              //
//----------------------------------//
function rokakucdset(){
    console.log("鹵獲スキルをデッキに乗せる");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲カードをデッキに乗せる処理を開始する");}
    //鹵獲スキルのカードを取得
    var lblpage = GM_getValue(GM_KEY + 'lblpage' + m_rokaku_options[ROKAKU_LABEL],1);
    var l_chk=0;
    var l_chkdec=0;
    var syupeflag = false;
    //全軍が全部乗ってるかチェック
    if (chksetallzen("ROKAKU_ZANCD","YN_ROKAKUZEN")==1){
        l_chk=1;
    }
    if (l_chk==0){
        Label1:
        for (var m = 1; m <= lblpage ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + m_rokaku_options[ROKAKU_LABEL] +"page:" +m);
            getfilelist(m_rokaku_options[ROKAKU_LABEL] , m);
            var fileList = rloadData(GM_KEY+"fileList", "[]", true);
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("ラベル:" + m_rokaku_options[ROKAKU_LABEL] +" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    console.log("fileno:" +m_rokaku_options[ROKAKU_LABEL]  +" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage);
                    //セットできるカードが鹵獲スキルかチェックする
                    if (m_rokaku_options[DEBUGFLG]==true){
                        var txt=" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage;
                        setrokakulog(txt);
                    }
                    if (fileList[fa].setsta =="set" &&  parseInt(fileList[fa].gage)  > 99){  //デッキにセット可能  かつ討伐ゲージ100以上
                        //鹵獲スキルを持ち、かつ、スキル回復中じゃない
                        console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + "skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + "skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        //攻撃NGリストにないことを確認
                        if (m_rokaku_options[YN_ATTKCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+" "+fileList[fa].name+"は攻撃NGカードです");}
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        //速度NGリストにないことを確認
                        if (m_rokaku_options[YN_SPEEDCHK]==true){
                            var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                            var l_arycdid=new Array();
                            //リストのカード取得
                            if (l_ngcdid!=""){
                                l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                for (var num = 0; num < l_arycdid.length; num++) {
                                    if (fileList[fa].cdid==l_arycdid[num]){
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+fileList[fa].cdid+" "+fileList[fa].name+"は速度NGカードです");}
                                        l_chkdec=1;
                                        break;
                                    }
                                }
                            }
                        }
                        if (l_chkdec==0){
                            j$.each(rokakuskillist, function(key, value) {
                                var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                                if (m_rokaku_options[SKCK]==true){
                                    syupeflag = false;
                                    if ((fileList[fa].cdskil1.indexOf(value) != -1) && (fileList[fa].cdskil1kai == true)){ syupeflag = true;}
                                    else if ((fileList[fa].cdskil2.indexOf(value) != -1) && (fileList[fa].cdskil2kai == true)){syupeflag = true;}
                                    else if ((fileList[fa].cdskil3.indexOf(value) != -1) && (fileList[fa].cdskil3kai == true)){syupeflag = true;}
                                    else if ((fileList[fa].cdskil4.indexOf(value) != -1) && (fileList[fa].cdskil4kai == true)){syupeflag = true;}
                                    //デッキに乗せる
                                    if (syupeflag == true){
                                        console.log("出兵するためにデッキに乗せる");
                                        //カードをデッキに乗せる
                                        //拠点設定
                                        var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                                        var setvillage ="";
                                        for (var ln = 0; ln< lists.length; ln++) {
                                            if(lists[ln].name==m_rokaku_options[ROKAKU_VIL]){
                                                setvillage=lists[ln].id;
                                            }
                                        }
                                        if (setvillage!=""){
                                            console.log("鹵獲拠点ID:" + setvillage);
                                            setdeckcard(fileList[fa].cdid, setvillage);
                                            var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                                            setrokakulog(txt);
                                            return false;
                                        } else {
                                           setrokakulog("拠点が存在しません");
                                           GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                           return false;
                                        }
                                    }
                                }
                            });
                            if (syupeflag == true){
                                break Label1;
                            }
                        }
                    }
                } //fa
            }
        }
    }
}
//----------------------------------//
//鹵獲カード出兵処理                //
//----------------------------------//
function rokakucdtrol(){
    console.log("鹵獲スキルの出兵処理");
    var l_chk=0;
    var l_siege=0;
    var l_ckarea=0;
    var l_chkatk=0;
    var l_chkdec=0;
    var l_chkenk=0;
    //全軍が全部乗ってるかチェック
    if (chksetallzen("ROKAKU_ZANCD","YN_ROKAKUZEN")==1){
        l_chk=1;
    }
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲スキルの出兵処理を開始する");}
    Label0:
    if (l_chk==0){
        var deckList = rloadData(GM_KEY+"deckList", "[]", true);
        if (deckList.length != 0 ) {
            for( var d= 0; d < deckList.length; d++ ) {
                console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 討伐:"+ deckList[d].gage);
                //討伐ゲージ100以上、鹵獲拠点にある
                if (m_rokaku_options[DEBUGFLG]==true){
                    var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                    var txt=" カード名:"+ deckList[d].name + " 状態:"+ l_setsta + " 討伐:"+ deckList[d].gage;
                    setrokakulog(txt);
                }
                if (deckList[d].setsta.match(/待機中/)  &&  parseInt(deckList[d].gage)  > 99 && deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL] ){
                    //鹵獲スキルを持ち、かつ、スキル回復中じゃない
                    console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
                    console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
                    //攻撃NGリストにないことを確認
                    if (m_rokaku_options[YN_ATTKCHK]==true){
                        var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                        var l_arycdid=new Array();
                        //リストのカード取得
                        if (l_ngcdid!=""){
                            l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                            for (var num = 0; num < l_arycdid.length; num++) {
                                if (deckList[d].cdid==l_arycdid[num]){
                                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+deckList[d].cdid+" "+deckList[d].name+"は攻撃NGカードです");}
                                    l_chkdec=1;
                                    break;
                                }
                            }
                        }
                    }
                    //速度NGリストにないことを確認
                    if (m_rokaku_options[YN_SPEEDCHK]==true){
                        var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                        var l_arycdid=new Array();
                        //リストのカード取得
                        if (l_ngcdid!=""){
                            l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                            for (var num = 0; num < l_arycdid.length; num++) {
                                if (deckList[d].cdid==l_arycdid[num]){
                                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+deckList[d].cdid+" "+deckList[d].name+"は速度NGカードです");}
                                    l_chkdec=1;
                                    break;
                                }
                            }
                        }
                    }
                    if(l_chkdec!=1){
                        j$.each(rokakuskillist, function(key, value) {
                            var SKCK = eval("ROKAKU_USEDSKIL" + key);
                            if (m_rokaku_options[SKCK]==true){
                                var syupeflag = false;
                                var skilid ="";
                                if ((deckList[d].cdskil1.indexOf(value) != -1 ) && (deckList[d].cdskil1kai == true)){ syupeflag = true; skilid = deckList[d].cdskil1id;}
                                else if ((deckList[d].cdskil2.indexOf(value) != -1 ) && (deckList[d].cdskil2kai == true)){ syupeflag = true; skilid= deckList[d].cdskil2id;}
                                else if ((deckList[d].cdskil3.indexOf(value) != -1) && (deckList[d].cdskil3kai == true)){ syupeflag = true; skilid= deckList[d].cdskil3id;}
                                else if ((deckList[d].cdskil4.indexOf(value) != -1 ) && (deckList[d].cdskil4kai == true)){ syupeflag = true; skilid= deckList[d].cdskil4id;}
                                //出兵する
                                if (syupeflag == true){
                                    console.log("出兵する");
                                    //カードをデッキに乗せる
                                    console.log("カードID:" + deckList[d].cdid +"スキルID:" + skilid);
                                    //副将スキル
                                    var fukcdid="";
                                    var fukskilid="";
                                    if ((deckList[d].fukcd!="") && (deckList[d].fukkai==true)){
                                        fukcdid=deckList[d].fukcdid;
                                        fukskilid=deckList[d].fukskilid;
                                    }
                                    var x_value = 0;
                                    var y_value = 0;
                                    var xyarea="";
                                    for(var declst=1; declst<= decareanum; declst++){
                                        var DECCD = eval("DECAREACD" + declst);
                                        var CKDEC = eval("YN_DECAREA" + declst);
                                        var DEC_X = eval("DECAREA" + declst + "_X");
                                        var DEC_Y = eval("DECAREA" + declst + "_Y");
                                        if ((m_rokaku_options[DECCD]==deckList[d].name) && (m_rokaku_options[CKDEC]==true)){
                                            if ((m_rokaku_options[DEC_X]!="") && (m_rokaku_options[DEC_Y]!="")){
                                                x_value = parseInt(m_rokaku_options[DEC_X]);
                                                y_value = parseInt(m_rokaku_options[DEC_Y]);
                                                var bname=getBasename(x_value,y_value);
                                                if (j$.trim(bname)!="空き地"){
                                                    var txt="指定領地が空き地ではありません。[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                                    setrokakulog(txt);
                                                    x_value = "";
                                                    y_value = "";
                                                } else {
                                                    l_ckarea=1;
                                                    xyarea="指定座標[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                                }
                                            }
                                        }
                                    }
                                    if (l_ckarea!=1){
                                        xyarea=setmark();
                                        if (xyarea=="wood"){x_value = parseInt(m_rokaku_options[WOOD_X]); y_value = parseInt(m_rokaku_options[WOOD_Y]);}
                                        else if(xyarea=="stone"){x_value = parseInt(m_rokaku_options[STONE_X]); y_value = parseInt(m_rokaku_options[STONE_Y]);}
                                        else if(xyarea=="iron"){x_value = parseInt(m_rokaku_options[IRON_X]); y_value = parseInt(m_rokaku_options[IRON_Y]);}
                                        else if(xyarea=="rice"){x_value = parseInt(m_rokaku_options[RICE_X]); y_value = parseInt(m_rokaku_options[RICE_Y]);}
                                        else {return false;}
                                        if (m_EndFlag!=1){
                                            var bname=getBasename(x_value,y_value);
                                            if (j$.trim(bname)!="空き地"){
                                                setrokakulog(xyarea+"1が空き地ではありません");
                                                if (xyarea=="wood"){ x_value = parseInt(m_rokaku_options[WOOD_X2]); y_value = parseInt(m_rokaku_options[WOOD_Y2]);}
                                                else if(xyarea=="stone"){ x_value = parseInt(m_rokaku_options[STONE_X2]); y_value = parseInt(m_rokaku_options[STONE_Y2]);}
                                                else if(xyarea=="iron"){ x_value = parseInt(m_rokaku_options[IRON_X2]); y_value = parseInt(m_rokaku_options[IRON_Y2]);}
                                                else if(xyarea=="rice"){ x_value = parseInt(m_rokaku_options[RICE_X2]); y_value = parseInt(m_rokaku_options[RICE_Y2]);}
                                                bname=getBasename(x_value,y_value);
                                                if (j$.trim(bname)!="空き地"){
                                                    setrokakulog(xyarea+"2が空き地ではありません");
                                                    x_value = "";
                                                    y_value = "";
                                                }
                                            }
                                        } else {
                                            x_value = "";
                                            y_value = "";
                                        }
                                    }
                                    if ((x_value != "") && (y_value != "")){
                                        if ((m_rokaku_options[YN_ATTKCHK]==true)||(m_rokaku_options[YN_SPEEDCHK]==true)) {
                                            l_chkatk=chkdispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid, x_value, y_value);
                                            if (l_chkatk==2){
                                                //攻撃NG
                                                var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                                                var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                                var l_arycdid=new Array();
                                                var l_arycdlist=new Array();
                                                if (l_ngcdid!=""){
                                                    l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                                }
                                                l_arycdid.push(deckList[d].cdid);
                                                GM_setValue(GM_KEY + '_ngatkcdid', l_arycdid);  //カードid保存
                                                if (l_ngcdlist!=""){
                                                    l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                                }
                                                l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 攻撃力NG");
                                                GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //カードid保存
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+deckList[d].cdid+" "+deckList[d].name+"は攻撃NGカードです");}
                                                return false;
                                            }
                                            if (l_chkatk==3){
                                                //速度NG
                                                var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                                                var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                                var l_arycdid=new Array();
                                                var l_arycdlist=new Array();
                                                if (l_ngcdid!=""){
                                                    l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                                }
                                                l_arycdid.push(deckList[d].cdid);
                                                GM_setValue(GM_KEY + '_ngspdcdid', l_arycdid);  //カードid保存
                                                if (l_ngcdlist!=""){
                                                    l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                                }
                                                l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 速度NG");
                                                GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //カードid保存
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+deckList[d].cdid+" "+deckList[d].name+"は速度NGカードです");}
                                                return false;
                                            }
                                        }
                                        if (l_chkatk==0){
                                            l_siege=dispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid, x_value, y_value);
                                        }
                                        if ((l_siege==1) || (l_chkatk==1)){
                                            //籠城中
                                            setrokakulog("籠城中です");
                                            var dt = new Date();
                                            GM_setValue(GM_KEY +"_siegetime", dt.toString());
                                            GM_setValue(GM_KEY +"_siegeflg", 1);
                                            return false;
                                        } else if(l_chkatk==0){
                                            var txt=deckList[d].name+" LV"+deckList[d].level+"を"+ xyarea + "に出兵しました";
                                            setrokakulog(txt);
                                            l_chkenk=1;
                                            return false;
                                        }
                                    }
                                    return false;
                                }
                            }
                        });
                        if (l_siege==1){
                            break Label0;
                        }
                    }
                }
            } //d
        }
    }
    //遠征貯金処理(出兵処理が行われたら実施)
    if (l_chkenk==1){
        rkk_chkenkbank();
    }
}
//----------------------------------//
//パッシブカードデッキ設定          //
//----------------------------------//
function passivecdset(){
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("パッシブ設定カードをデッキに乗せる");}
    console.log("パッシブ設定カードをデッキに乗せる");
    var l_chk=0;
    var l_fg=0;
    //全軍が全部乗ってるかチェック
    if (chksetallzen("ROKAKUP_ZANCD","YN_ROKAKUPZEN")==1){
        l_chk=1;
    }
    if (l_chk==0){
        //getdecklist();
        label11:
        for (var k = 1; k <= rkknum; k++) {
            l_fg=0;
            var PVCD = eval("ROKAKUP_CD" + k);
            var PVCST = eval("ROKAKUP_CST" + k);
            var PVLBL = eval("ROKAKUP_LBL" + k);
            var YNRP = eval("YN_ROKAKUP" + k);
            if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                var deckList = rloadData(GM_KEY+"deckList", "[]", true);
                //デッキ設定
                label2:
                for(var d= 0; d < deckList.length; d++) {
                    //パッシブ設定カードかどうか
                    if (deckList[d].name == m_rokaku_options[PVCD]) {
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"はパッシブ設定カードでデッキに存在する");}
                        l_fg=1;
                        break label2;
                    }
                }
                if (l_fg==0){
                    //デッキコストが存在するか
                    var rkacost=0;
                    if (m_rokaku_options[YN_RKKAI]==true){
                        rkacost = parseFloat(selectValues5[(m_rokaku_options[RKKAICST])]);
                    }
                    var usecst = GM_getValue(GM_KEY+"UseCost", 0);
                    var deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
                    console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,rkacost);
                    var chkcost= deckcst - usecst - rkacost;
                    var pcdcst = parseFloat(selectValues5[(m_rokaku_options[PVCST])]);
                    if (pcdcst > chkcost){
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[PVCD]+"を乗せるデッキコストが存在しない");}
                        l_fg=1;
                    }
                }
                if (l_fg==0){
                    //ファイルのカードを取得
                    var l_label = m_rokaku_options[PVLBL];
                    var l_page = GM_getValue(GM_KEY + 'lblpage' + l_label ,1);
                    console.log("カード名: %s  fileno:  %d  page: %d",m_rokaku_options[PVCD], m_rokaku_options[PVLBL], l_page);
                    for(var m= 0; m <= l_page; m++){
                        getfilelist(l_label , m);
                        var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                        if (fileList.length != 0 ) {
                            for( var fa= 0; fa < fileList.length; fa++ ) {
                                console.log("fileno:" + l_label +" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " HP:"+ fileList[fa].hp);
                                if ((fileList[fa].setsta =="set") && (fileList[fa].name==m_rokaku_options[PVCD])){
                                    if (m_rokaku_options[YN_RKKAI]==true){
                                        //デッキコストが空いてるかチェック
                                        var usecst = GM_getValue(GM_KEY+"UseCost", 0);
                                        var deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
                                        var kaicst = parseFloat(selectValues5[(m_rokaku_options[RKKAICST])]);
                                        var chkcost= parseFloat(deckcst) - parseFloat(usecst) - parseFloat(kaicst);
                                        console.log("使用コスト: %d  デッキコスト: %d 設定空コスト:  %d", usecst,deckcst,kaicst);
                                        if (parseFloat(chkcost)< parseFloat(fileList[fa].cost)){
                                            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(m_rokaku_options[PVCD]+"を乗せるデッキコストが存在しない");}
                                            l_fg=1;
                                        }
                                    }
                                    //攻撃NGリストにないかチェック
                                    if (l_fg==0){
                                        if (m_rokaku_options[YN_ATTKCHK]==true) {
                                            var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                                            var l_arycdid=new Array();
                                            //リストのカード取得
                                            if (l_ngcdid!=""){
                                                l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                                for (var num = 0; num < l_arycdid.length; num++) {
                                                    if (fileList[fa].cdid==l_arycdid[num]){
                                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(fileList[fa].name+":攻撃NGリストのカードです");}
                                                        l_fg=1;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    //速度NGリストにないかチェック
                                    if (l_fg==0){
                                        if (m_rokaku_options[YN_SPEEDCHK]==true) {
                                            var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                                            var l_arycdid=new Array();
                                            //リストのカード取得
                                            if (l_ngcdid!=""){
                                                l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                                for (var num = 0; num < l_arycdid.length; num++) {
                                                    if (fileList[fa].cdid==l_arycdid[num]){
                                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(fileList[fa].name+":速度NGリストのカードです");}
                                                        l_fg=1;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (l_fg==0){
                                        console.log("設定カードデッキに乗せる");
                                        //拠点設定
                                        var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                                        var setvillage ="";
                                        for (var i = 0;  i < lists.length; i++) {
                                            if(lists[i].name==m_rokaku_options[ROKAKU_VIL]){
                                                setvillage=lists[i].id;
                                            }
                                        }
                                        if (setvillage!=""){
                                            console.log("鹵獲拠点ID:" + setvillage);
                                            setdeckcard(fileList[fa].cdid, setvillage);
                                            var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                                            setrokakulog(txt);
                                        } else {
                                           setrokakulog("拠点が存在しません");
                                           GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                           break label11;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


//----------------------------------//
//鹵獲パッシブ出兵処理              //
//----------------------------------//
function passivecdtrol(){
    console.log("鹵獲パッシブの出兵処理");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲パッシブ出兵処理を開始する");}
    var l_chk=0;
    var l_hpchk=0;
    var l_keichk=0;
    var l_siege=0;
    var l_ckarea=0;
    var l_chkatk=0;
    var l_chkdec=0;
    var l_chkenk=0;
    //全軍が全部乗ってるかチェック
    if (chksetallzen("ROKAKUP_ZANCD","YN_ROKAKUPZEN")==1){
        l_chk=1;
    }
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    if (l_chk==0){
        //HP回復処理が必要かチェック
        if (m_rokaku_options[YN_RKPJIN]==true){
            if (deckList.length != 0 ) {
                for( var d= 0; d < deckList.length; d++ ) {
                    for (var k = 1; k <= rkknum; k++) {
                        var PVCD = eval("ROKAKUP_CD" + k);
                        var YNRP = eval("YN_ROKAKUP" + k);
                        if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                            //パッシブ設定カードかどうか
                            if( deckList[d].name == m_rokaku_options[PVCD] ) {
                                //鹵獲拠点に待機中のパッシブ設定カードでHP(設定値)以下のカードが存在する
                                console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                                if ((deckList[d].setsta.match(/待機中/))  && (parseInt(deckList[d].hp) < parseInt(m_rokaku_options[RKPJINHP])) && (deckList[d].setvil==m_rokaku_options[ROKAKU_VIL])) {
                                    if (m_rokaku_options[DEBUGFLG]==true){
                                        var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                        setrokakulog("カード名:"+ deckList[d].name + " 状態:"+ l_setsta + " HP:"+ deckList[d].hp+"はHP回復が必要");
                                    }
                                    l_chk=2;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==0){
        if (deckList.length != 0 ) {
            for( var d= 0; d < deckList.length; d++ ) {
                for (var k = 1; k <= rkknum; k++) {
                    var PVCD = eval("ROKAKUP_CD" + k);
                    var KEIFLG = eval("YN_USEKEI" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        //パッシブ設定カードかどうか
                        if( deckList[d].name == m_rokaku_options[PVCD] ) {
                            //鹵獲拠点に待機中の傾国回復設定のパッシブカードで討伐100以下が存在
                            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 討伐:"+ deckList[d].gage);
                            if ((deckList[d].setsta.match(/待機中/))  && (parseInt(deckList[d].gage)  < 100) &&
                                (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]) && (m_rokaku_options[KEIFLG]==true)) {
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                    setrokakulog("カード名:"+ deckList[d].name + " 状態:"+ l_setsta + " 討伐:"+ deckList[d].gage+"は討伐回復が必要");
                                }
                                l_chk=2;
                            }
                        }
                    }
                }
            }
        }
    }
    if ((l_chk==0)&&(l_siege==0)){
        //出兵する
        if (deckList.length != 0 ) {
            Label1:
            for( var d= 0; d < deckList.length; d++ ) {
                for (var k = 1; k <= rkknum; k++) {
                    var PVCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        //鹵獲拠点にあるパッシブ設定カードを出兵する
                        if ((deckList[d].setsta.match(/待機中/)) && (deckList[d].name == m_rokaku_options[PVCD])  &&
                            (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]) && (parseInt(deckList[d].gage)  > 99)) {
                            console.log("出兵する: %s", deckList[d].name);
                            //副将スキル
                            var fukcdid="";
                            var fukskilid="";
                            if ((deckList[d].fukcd!="") && (deckList[d].fukkai==true)){
                                fukcdid=deckList[d].fukcdid;
                                fukskilid=deckList[d].fukskilid;
                            }
                            var x_value = 0;
                            var y_value = 0;
                            var xyarea="";
                            for(var declst=1; declst<= decareanum; declst++){
                                var DECCD = eval("DECAREACD" + declst);
                                var CKDEC = eval("YN_DECAREA" + declst);
                                var DEC_X = eval("DECAREA" + declst + "_X");
                                var DEC_Y = eval("DECAREA" + declst + "_Y");
                                if ((m_rokaku_options[DECCD]==deckList[d].name) && (m_rokaku_options[CKDEC]==true)){
                                    if ((m_rokaku_options[DEC_X]!="") && (m_rokaku_options[DEC_Y]!="")){
                                        x_value = parseInt(m_rokaku_options[DEC_X]);
                                        y_value = parseInt(m_rokaku_options[DEC_Y]);
                                        var bname=getBasename(x_value,y_value);
                                        if (j$.trim(bname)!="空き地"){
                                            var txt="指定領地が空き地ではありません。[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                            setrokakulog(txt);
                                            x_value = "";
                                            y_value = "";
                                        } else {
                                            l_ckarea=1;
                                            xyarea="指定座標[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                        }
                                    }
                                }
                            }
                            if (l_ckarea!=1){
                                xyarea=setmark();
                                if (xyarea=="wood"){ x_value = parseInt(m_rokaku_options[WOOD_X]); y_value = parseInt(m_rokaku_options[WOOD_Y]);}
                                else if(xyarea=="stone"){ x_value = parseInt(m_rokaku_options[STONE_X]); y_value = parseInt(m_rokaku_options[STONE_Y]);}
                                else if(xyarea=="iron"){ x_value = parseInt(m_rokaku_options[IRON_X]); y_value = parseInt(m_rokaku_options[IRON_Y]);}
                                else if(xyarea=="rice"){ x_value = parseInt(m_rokaku_options[RICE_X]); y_value = parseInt(m_rokaku_options[RICE_Y]);}
                                else {break Label1;}
                                if (m_EndFlag!=1){
                                    var bname=getBasename(x_value,y_value);
                                    if (j$.trim(bname)!="空き地"){
                                        setrokakulog(xyarea+"1が空き地ではありません");
                                        if (xyarea=="wood"){ x_value = parseInt(m_rokaku_options[WOOD_X2]); y_value = parseInt(m_rokaku_options[WOOD_Y2]);}
                                        else if(xyarea=="stone"){ x_value = parseInt(m_rokaku_options[STONE_X2]); y_value = parseInt(m_rokaku_options[STONE_Y2]);}
                                        else if(xyarea=="iron"){ x_value = parseInt(m_rokaku_options[IRON_X2]); y_value = parseInt(m_rokaku_options[IRON_Y2]);}
                                        else if(xyarea=="rice"){ x_value = parseInt(m_rokaku_options[RICE_X2]); y_value = parseInt(m_rokaku_options[RICE_Y2]);}
                                        bname=getBasename(x_value,y_value);
                                        if (j$.trim(bname)!="空き地"){
                                            setrokakulog(xyarea+"2が空き地ではありません");
                                            x_value = "";
                                            y_value = "";
                                        }
                                    }
                                } else {
                                    x_value = "";
                                    y_value = "";
                                }
                            }
                            if ((x_value != "") && (y_value != "")){
                                if ((m_rokaku_options[YN_ATTKCHK]==true)||(m_rokaku_options[YN_SPEEDCHK]==true)) {
                                    l_chkatk=chkdispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid, x_value, y_value);
                                    if (l_chkatk==2){
                                        //攻撃NG
                                        var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                                        var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                        var l_arycdid=new Array();
                                        var l_arycdlist=new Array();
                                        if (l_ngcdid!=""){
                                            l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                        }
                                        l_arycdid.push(deckList[d].cdid);
                                        GM_setValue(GM_KEY + '_ngatkcdid', l_arycdid);  //カードid保存
                                        if (l_ngcdlist!=""){
                                            l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                        }
                                        l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 攻撃力NG");
                                        GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //表示用カード保存
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "攻撃NGカードです");}
                                    }
                                    if (l_chkatk==3){
                                        //速度NG
                                        var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                                        var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                        var l_arycdid=new Array();
                                        var l_arycdlist=new Array();
                                        if (l_ngcdid!=""){
                                            l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                        }
                                        l_arycdid.push(deckList[d].cdid);
                                        GM_setValue(GM_KEY + '_ngspdcdid', l_arycdid);  //カードid保存
                                        if (l_ngcdlist!=""){
                                            l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                        }
                                        l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 速度NG");
                                        GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //表示用カード保存
                                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "速度NGカードです");}
                                    }
                                }
                                if (l_chkatk==0){
                                    var skilid ="";
                                    if ((deckList[d].cdskil1 !="") && (deckList[d].cdskil1kai == true) && (deckList[d].cdskil1pa == false)){skilid = deckList[d].cdskil1id;}
                                    else if ((deckList[d].cdskil2 !="") && (deckList[d].cdskil2kai == true) && (deckList[d].cdskil2pa == false)){skilid= deckList[d].cdskil2id;}
                                    else if ((deckList[d].cdskil3 !="") && (deckList[d].cdskil3kai == true) && (deckList[d].cdskil3pa == false)){skilid= deckList[d].cdskil3id;}
                                    else if ((deckList[d].cdskil4 !="") && (deckList[d].cdskil4kai == true) && (deckList[d].cdskil4pa == false)){skilid= deckList[d].cdskil4id;}
                                    l_siege=dispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid,x_value, y_value);
                                }
                                if ((l_siege==1) || (l_chkatk==1)){
                                    //籠城中
                                    setrokakulog("籠城中です");
                                    var dt = new Date();
                                    GM_setValue(GM_KEY +"_siegetime", dt.toString());
                                    GM_setValue(GM_KEY +"_siegeflg", 1);
                                    break Label1;
                                } else if(l_chkatk==0){
                                    var txt=deckList[d].name+" LV"+deckList[d].level+"を"+ xyarea + "に出兵しました";
                                    setrokakulog(txt);
                                    l_chkenk=1;
                                }
                            } else {
                                break Label1;
                            }
                        }
                    }
                }
            }
        }
    }
    if ((l_chk==2)&&(l_siege==0)){
        //出兵する
        if (deckList.length != 0 ) {
            Label2:
            for(var d=0; d < deckList.length; d++ ) {
                for (var k = 1; k <= rkknum; k++) {
                    var PVCD = eval("ROKAKUP_CD" + k);
                    var KEIFLG = eval("YN_USEKEI" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[PVCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        //鹵獲拠点にあるパッシブ設定カードで、傾国使用フラグなし、討伐ゲージ、HPあれば出兵
                        if ((deckList[d].name == m_rokaku_options[PVCD])  && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]) &&
                            //(m_rokaku_options[KEIFLG]==false) && (parseInt(deckList[d].gage)  > 99) && (deckList[d].setsta.match(/待機中/))) {
                            (parseInt(deckList[d].gage)  > 99) && (deckList[d].setsta.match(/待機中/))) {
                            if (((m_rokaku_options[YN_RKPJIN]==true) && (parseInt(deckList[d].hp) > parseInt(m_rokaku_options[RKPJINHP]))) || (m_rokaku_options[YN_RKPJIN]==false)){
                                //攻撃NGリストにないことを確認
                                if (m_rokaku_options[YN_ATTKCHK]==true){
                                    var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                                    var l_arycdid=new Array();
                                    //リストのカード取得
                                    if (l_ngcdid!=""){
                                        l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                        for (var num = 0; num < l_arycdid.length; num++) {
                                            if (deckList[d].cdid==l_arycdid[num]){
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "攻撃NGカードです");}
                                                l_chkdec=1;
                                                break;
                                            }
                                        }
                                    }
                                }
                                //速度NGリストにないことを確認
                                if (m_rokaku_options[YN_SPEEDCHK]==true){
                                    var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                                    var l_arycdid=new Array();
                                    //リストのカード取得
                                    if (l_ngcdid!=""){
                                        l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                        for (var num = 0; num < l_arycdid.length; num++) {
                                            if (deckList[d].cdid==l_arycdid[num]){
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "速度NGカードです");}
                                                l_chkdec=1;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (l_chkdec!=1){
                                    console.log("出兵する: %s", deckList[d].name);
                                    //副将スキル
                                    var fukcdid="";
                                    var fukskilid="";
                                    if ((deckList[d].fukcd!="") && (deckList[d].fukkai==true)){
                                        fukcdid=deckList[d].fukcdid;
                                        fukskilid=deckList[d].fukskilid;
                                    }
                                    var x_value = 0;
                                    var y_value = 0;
                                    var xyarea="";
                                    for(var declst=1; declst<= decareanum; declst++){
                                        var DECCD = eval("DECAREACD" + declst);
                                        var CKDEC = eval("YN_DECAREA" + declst);
                                        var DEC_X = eval("DECAREA" + declst + "_X");
                                        var DEC_Y = eval("DECAREA" + declst + "_Y");
                                        if ((m_rokaku_options[DECCD]==deckList[d].name) && (m_rokaku_options[CKDEC]==true)){
                                            if ((m_rokaku_options[DEC_X]!="") && (m_rokaku_options[DEC_Y]!="")){
                                                x_value = parseInt(m_rokaku_options[DEC_X]);
                                                y_value = parseInt(m_rokaku_options[DEC_Y]);
                                                var bname=getBasename(x_value,y_value);
                                                if (j$.trim(bname)!="空き地"){
                                                    var txt="指定領地が空き地ではありません。[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                                    setrokakulog(txt);
                                                    x_value = "";
                                                    y_value = "";
                                                } else {
                                                    l_ckarea=1;
                                                    xyarea="指定座標[x="+ x_value.toString() + "][y=" + y_value.toString() + "]";
                                                }
                                            }
                                        }
                                    }
                                    if (l_ckarea!=1){
                                        xyarea=setmark();
                                        if (xyarea=="wood"){ x_value = parseInt(m_rokaku_options[WOOD_X]); y_value = parseInt(m_rokaku_options[WOOD_Y]);}
                                        else if(xyarea=="stone"){ x_value = parseInt(m_rokaku_options[STONE_X]); y_value = parseInt(m_rokaku_options[STONE_Y]);}
                                        else if(xyarea=="iron"){ x_value = parseInt(m_rokaku_options[IRON_X]); y_value = parseInt(m_rokaku_options[IRON_Y]);}
                                        else if(xyarea=="rice"){ x_value = parseInt(m_rokaku_options[RICE_X]); y_value = parseInt(m_rokaku_options[RICE_Y]);}
                                        else {break Label2;}
                                        if (m_EndFlag!=1){
                                            var bname=getBasename(x_value,y_value);
                                            if (j$.trim(bname)!="空き地"){
                                                setrokakulog(xyarea+"1が空き地ではありません");
                                                if (xyarea=="wood"){ x_value = parseInt(m_rokaku_options[WOOD_X2]); y_value = parseInt(m_rokaku_options[WOOD_Y2]);}
                                                else if(xyarea=="stone"){ x_value = parseInt(m_rokaku_options[STONE_X2]); y_value = parseInt(m_rokaku_options[STONE_Y2]);}
                                                else if(xyarea=="iron"){ x_value = parseInt(m_rokaku_options[IRON_X2]); y_value = parseInt(m_rokaku_options[IRON_Y2]);}
                                                else if(xyarea=="rice"){ x_value = parseInt(m_rokaku_options[RICE_X2]); y_value = parseInt(m_rokaku_options[RICE_Y2]);}
                                                bname=getBasename(x_value,y_value);
                                                if (j$.trim(bname)!="空き地"){
                                                    setrokakulog(xyarea+"2が空き地ではありません");
                                                    x_value = "";
                                                    y_value = "";
                                                }
                                            }
                                        } else {
                                            x_value = "";
                                            y_value = "";
                                        }
                                    }
                                    if ((x_value != "") && (y_value != "")){
                                        if ((m_rokaku_options[YN_ATTKCHK]==true)||(m_rokaku_options[YN_SPEEDCHK]==true)) {
                                            l_chkatk=chkdispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid, x_value, y_value);
                                            if (l_chkatk==2){
                                                //攻撃NG
                                                var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                                                var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                                var l_arycdid=new Array();
                                                var l_arycdlist=new Array();
                                                if (l_ngcdid!=""){
                                                    l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                                                }
                                                l_arycdid.push(deckList[d].cdid);
                                                GM_setValue(GM_KEY + '_ngatkcdid', l_arycdid);  //カードid保存
                                                if (l_ngcdlist!=""){
                                                    l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                                }
                                                l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 攻撃力NG");
                                                GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //カードid保存
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "攻撃NGカードです");}
                                            }
                                            if (l_chkatk==3){
                                                //速度NG
                                                var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                                                var l_ngcdlist=GM_getValue(GM_KEY + "_ngcdlist", "");
                                                var l_arycdid=new Array();
                                                var l_arycdlist=new Array();
                                                if (l_ngcdid!=""){
                                                    l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                                                }
                                                l_arycdid.push(deckList[d].cdid);
                                                GM_setValue(GM_KEY + '_ngspdcdid', l_arycdid);  //カードid保存
                                                if (l_ngcdlist!=""){
                                                    l_arycdlist = GM_getValue(GM_KEY + "_ngcdlist", []).split(',');
                                                }
                                                l_arycdlist.push("カードID:"+deckList[d].cdid+" カード名:"+deckList[d].name+" 速度NG");
                                                GM_setValue(GM_KEY + '_ngcdlist', l_arycdlist);  //カードid保存
                                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "速度NGカードです");}
                                            }
                                        }
                                        if (l_chkatk==0){
                                            var skilid ="";
                                            if ((deckList[d].cdskil1 !="") && (deckList[d].cdskil1kai == true) && (deckList[d].cdskil1pa == false)){skilid = deckList[d].cdskil1id;}
                                            else if ((deckList[d].cdskil2 !="") && (deckList[d].cdskil2kai == true) && (deckList[d].cdskil2pa == false)){skilid= deckList[d].cdskil2id;}
                                            else if ((deckList[d].cdskil3 !="") && (deckList[d].cdskil3kai == true) && (deckList[d].cdskil3pa == false)){skilid= deckList[d].cdskil3id;}
                                            else if ((deckList[d].cdskil4 !="") && (deckList[d].cdskil4kai == true) && (deckList[d].cdskil4pa == false)){skilid= deckList[d].cdskil4id;}
                                            l_siege=dispatchtool(deckList[d].cdid, skilid, fukcdid, fukskilid, x_value, y_value);
                                        }
                                        if ((l_siege==1) || (l_chkatk==1)){
                                            //籠城中
                                            setrokakulog("籠城中です");
                                            var dt = new Date();
                                            GM_setValue(GM_KEY +"_siegetime", dt.toString());
                                            GM_setValue(GM_KEY +"_siegeflg", 1);
                                            break Label2;
                                        } else if(l_chkatk==0){
                                            var txt=deckList[d].name+" LV"+deckList[d].level+"を"+ xyarea +"に出兵しました";
                                            setrokakulog(txt);
                                            l_chkenk=1;
                                        }
                                    } else{
                                        break Label2;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //遠征貯金処理(出兵処理が行われたら実施)
    if (l_chkenk==1){
        rkk_chkenkbank();
    }
}

//----------------------------------//
//鹵獲カード下げる処理              //
//----------------------------------//
function rokakucdunset(){
    console.log("デッキから不要カードを下す処理を開始");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("デッキから不要カードを下す処理を開始");}
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_fg=0;
    if (deckList.length != 0 ) {
        label1:
        for( var d= 0; d < deckList.length; d++ ) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("全軍に設定されているカードかチェック");
            label2:
            for (var k = 1; k <= rkkzennum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKU_ZANCD" + k);
                var YNZEN = eval("YN_ROKAKUZEN" + k);
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲スキル全軍に設定されていて、デッキに存在するカードです");}
                        chk=2;
                        break label2;
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF2]==true)){
                label3:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            if (deckList[d].setsta.match(/待機中/)){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブに設定されているカードです");}
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break label3;
                            } else {
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブに設定されていて待機中ではないカードです。戻るまで待機");}
                                console.log("待機・リロード");
                                l_fg=1;
                                break label1;
                            }
                        }
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF2]==true)){
                label4:
                for (var k = 1; k <= rkkpznum; k++) {
                    var RUPCD = eval("ROKAKUP_ZANCD" + k);
                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブ全軍に設定されているカードです");
                            if (deckList[d].setsta.match(/待機中/)){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブ全軍に設定されているカードです");}
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break label4;
                            } else {
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブ全軍に設定されていて待機中ではないカードです。戻るまで待機");}
                                console.log("待機・リロード");
                                l_fg=1;
                                break label1;
                            }
                        }
                    }
                }
            }
            if (chk==0){
                if ((deckList[d].setsta.match(/待機中/)) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])){
                    //鹵獲スキルを持ち、かつ、スキル回復中
                    console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
                    console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
                    j$.each(rokakuskillist, function(key, value) {
                        var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                        if (m_rokaku_options[SKCK]==true){
                            var syupeflag = false;
                            var skilid ="";
                            var skilhas = false;
                            if ((deckList[d].cdskil1.indexOf(value) != -1 ) && (deckList[d].cdskil1kai == true)){ syupeflag = true;}
                            else if ((deckList[d].cdskil2.indexOf(value) != -1 ) && (deckList[d].cdskil2kai == true)){ syupeflag = true;}
                            else if ((deckList[d].cdskil3.indexOf(value) != -1) && (deckList[d].cdskil3kai == true)){ syupeflag = true;}
                            else if ((deckList[d].cdskil4.indexOf(value) != -1 ) && (deckList[d].cdskil4kai == true)){ syupeflag = true;}
                            if ((deckList[d].cdskil1.indexOf(value) != -1 ) ||  (deckList[d].cdskil2.indexOf(value) != -1 ) ||
                                (deckList[d].cdskil3.indexOf(value) != -1) || (deckList[d].cdskil4.indexOf(value) != -1 )){ skilhas = true;}
                            if ((syupeflag == false) && (skilhas == true) && deckList[d].setsta.match(/待機中/)){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲スキルを持ち、スキル回復中のカードです。");}
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                return false;
                            }
                        }
                    });
                }
            }
            if (chk==0){
                //攻撃NGリストのカード
                if (m_rokaku_options[YN_ATTKCHK]==true) {
                    var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                    var l_arycdid=new Array();
                    //リストのカード取得
                    if (l_ngcdid!=""){
                        l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                        for (var num = 0; num < l_arycdid.length; num++) {
                            if (deckList[d].cdid==l_arycdid[num]){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "攻撃NGカードです");}
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break;
                            }
                        }
                    }
                }
            }
            if (chk==0){
                //速度NGリストのカード
                if (m_rokaku_options[YN_SPEEDCHK]==true) {
                    var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                    var l_arycdid=new Array();
                    //リストのカード取得
                    if (l_ngcdid!=""){
                        l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                        for (var num = 0; num < l_arycdid.length; num++) {
                            if (deckList[d].cdid==l_arycdid[num]){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("カード:"+ deckList[d].cdid+" "+deckList[d].name + "速度NGカードです");}
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return l_fg;
}
//----------------------------------//
//パッシブ以外のカード下げる処理    //
//----------------------------------//
function passivecdunset(){
    console.log("デッキから不要カードを下す処理を開始");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("デッキから不要カードを下す処理を開始");}
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_flg=0;
    if (deckList.length != 0 ) {
        label1:
        for( var d= 0; d < deckList.length; d++ ) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("全軍に設定されているカードかチェック");
            label2:
            for (var k = 1; k <= rkkpznum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKUP_ZANCD" + k);
                var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        console.log("鹵獲パッシブ全軍に設定されているカードです");
                        if (m_rokaku_options[DEBUGFLG]==true){
                            var txt=deckList[d].name+":鹵獲パッシブ全軍に設定されているカードです";
                            setrokakulog(txt);
                        }
                        chk=2;
                        break label2;
                    }
                }
            }
            if (chk==0){
                label3:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲パッシブに設定されているカードです";
                                setrokakulog(txt);
                            }
                            chk=3;
                            break label3;
                        }
                    }
                }
            }
//            if (chk==0){
//                for (var k = 1; k <= rkkpznum; k++) {
//                    chk=0;
//                    var ZANCD = eval("ROKAKUP_ZANCD" + k);
//                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
//                    label6:
//                    if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==false)) {
//                        if (deckList[d].name == m_rokaku_options[ZANCD]){
//                            console.log("鹵獲パッシブ全軍・未使用に設定されているカードです");
//                            if (m_rokaku_options[DEBUGFLG]==true){
//                                var txt=deckList[d].name+":鹵獲パッシブ全軍・未使用に設定されているカードです。カードを下します";
//                                setrokakulog(txt);
//                            }
//                            if (deckList[d].setsta.match(/待機中/)){
//                                console.log("カードを下ろす");
//                                chk=1;
//                                unsetdeckcard2(deckList[d].cdid);
//                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
//                                setrokakulog(txt);
//                                break label6;
//                            } else {
//                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"がデッキに戻るまで待機");}
//                                console.log("待機・リロード");
//                                l_flg=1;
//                                break label1;
//                            }
//                        }
//                    }
//                }
//            }
            if ((chk==0) && (m_rokaku_options[USECONF1]==true)){
                if (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                    console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
                    console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
                    j$.each(rokakuskillist, function(key, value) {
                        var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                        if (m_rokaku_options[SKCK]==true){
                            var skilhas = false;
                            if (( deckList[d].cdskil1.indexOf(value) != -1 ) ||  ( deckList[d].cdskil2.indexOf(value) != -1 ) ||
                                ( deckList[d].cdskil3.indexOf(value) != -1) || ( deckList[d].cdskil4.indexOf(value) != -1 )){ skilhas = true;}
                            if (skilhas == true){
                                console.log("鹵獲スキルのカードです");
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                    var txt=deckList[d].name +":"+ l_setsta +":鹵獲スキルのカードです。カードを下します";
                                    setrokakulog(txt);
                                }
                                if (deckList[d].setsta.match(/待機中/)){
                                    console.log("カードを下ろす");
                                    chk=1;
                                    unsetdeckcard2(deckList[d].cdid);
                                    var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                    setrokakulog(txt);
                                    return false;
                                } else {
                                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"がデッキに戻るまで待機");}
                                    console.log("待機・リロード");
                                    l_flg=1;
                                    return false;
                                }
                            }
                        }
                    });
                    if ( l_flg==1){
                        break label1;
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF1]==true)){
                for (var k = 1; k <= rkkzennum; k++) {
                    chk=0;
                    var ZANCD = eval("ROKAKU_ZANCD" + k);
                    var YNZEN = eval("YN_ROKAKUZEN" + k);
                    label4:
                    if ((m_rokaku_options[ZANCD].length > 0)) {
                        if ((deckList[d].name == m_rokaku_options[ZANCD]) && (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL])){
                            console.log("鹵獲スキル全軍に設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                var txt=deckList[d].name +":"+ l_setsta +":鹵獲スキル全軍のカードです。カードを下します";
                                setrokakulog(txt);
                            }
                            if (deckList[d].setsta.match(/待機中/)){
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break label4;
                            } else {
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"がデッキに戻るまで待機");}
                                console.log("待機・リロード");
                                l_flg=1;
                                break label1;
                            }
                        }
                    }
                }
            }
            if ((chk==0)|| (chk==3)){
                //攻撃NGリストのカード
                if (m_rokaku_options[YN_ATTKCHK]==true) {
                    var l_ngcdid=GM_getValue(GM_KEY + "_ngatkcdid", "");
                    var l_arycdid=new Array();
                    //リストのカード取得
                    if (l_ngcdid!=""){
                        l_arycdid = GM_getValue(GM_KEY + "_ngatkcdid", []).split(',');
                        for (var num = 0; num < l_arycdid.length; num++) {
                            if (deckList[d].cdid==l_arycdid[num]){
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    var txt=deckList[d].name +":攻撃NGリストのカードです。カードを下します";
                                    setrokakulog(txt);
                                }
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break;
                            }
                        }
                    }
                }
            }
            if ((chk==0)|| (chk==3)){
                //速度NGリストのカード
                if (m_rokaku_options[YN_SPEEDCHK]==true) {
                    var l_ngcdid=GM_getValue(GM_KEY + "_ngspdcdid", "");
                    var l_arycdid=new Array();
                    //リストのカード取得
                    if (l_ngcdid!=""){
                        l_arycdid = GM_getValue(GM_KEY + "_ngspdcdid", []).split(',');
                        for (var num = 0; num < l_arycdid.length; num++) {
                            if (deckList[d].cdid==l_arycdid[num]){
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    var txt=deckList[d].name +":速度NGリストのカードです。カードを下します";
                                    setrokakulog(txt);
                                }
                                console.log("カードを下ろす");
                                chk=1;
                                unsetdeckcard2(deckList[d].cdid);
                                var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                                setrokakulog(txt);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return l_flg;
}

//----------------------------------//
//鹵獲以外のカードがあれば待機      //
//----------------------------------//
function rokakuskilwait(){
    console.log("デッキから不要カードを下す処理を開始");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("鹵獲スキル以外のカードが出兵中あれば待機する処理チェック");}
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_fg=0;
    if (deckList.length != 0 ) {
        label1:
        for( var d= 0; d < deckList.length; d++ ) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("全軍に設定されているカードかチェック");
            label2:
            for (var k = 1; k <= rkkzennum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKU_ZANCD" + k);
                var YNZEN = eval("YN_ROKAKUZEN" + k);
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲スキル全軍に設定されているカードです");}
                        chk=2;
                        break label2;
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF2]==true)){
                label3:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            if (deckList[d].setsta.match(/待機中/)){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブに設定されているカードです：待機中");}
                                chk=2;
                                break label3;
                            } else {
                                console.log("待機・リロード");
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブに設定されているカードです：待機ではない");}
                                setrokakulog("デッキに戻るまで待機");
                                chk=1;
                                l_fg=1;
                                break label1;
                            }
                        }
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF2]==true)){
                label4:
                for (var k = 1; k <= rkkpznum; k++) {
                    var RUPCD = eval("ROKAKUP_ZANCD" + k);
                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブ全軍に設定されているカードです");
                            if (deckList[d].setsta.match(/待機中/)){
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブ全軍に設定されているカードです：待機中");}
                                chk=2;
                                break label4;
                            } else {
                                console.log("待機・リロード");
                                if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲パッシブ全軍に設定されているカードです：待機ではない");}
                                setrokakulog("デッキに戻るまで待機");
                                chk=1;
                                l_fg=1;
                                break label1;
                            }
                        }
                    }
                }
            }
            //if (chk==0){
            //    if (deckList[d].setsta.match(/待機中/)  &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL] ){
            //        //鹵獲スキルを持ち、かつ、スキル回復中
            //        console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
            //        console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
            //        j$.each(rokakuskillist, function(key, value) {
            //            var SKCK = eval( "ROKAKU_USEDSKIL" + key );
            //            if (m_rokaku_options[SKCK]==true){
            //                var syupeflag = false;
            //                var skilid ="";
            //                var skilhas = false;
            //                if ((deckList[d].cdskil1.indexOf(value) != -1 ) && (deckList[d].cdskil1kai == true)){ syupeflag = true;}
            //                else if ((deckList[d].cdskil2.indexOf(value) != -1 ) && (deckList[d].cdskil2kai == true)){ syupeflag = true;}
            //                else if ((deckList[d].cdskil3.indexOf(value) != -1) && (deckList[d].cdskil3kai == true)){ syupeflag = true;}
            //                else if ((deckList[d].cdskil4.indexOf(value) != -1 ) && (deckList[d].cdskil4kai == true)){ syupeflag = true;}
            //                if ((deckList[d].cdskil1.indexOf(value) != -1 ) ||  ( deckList[d].cdskil2.indexOf(value) != -1 ) ||
            //                    (deckList[d].cdskil3.indexOf(value) != -1) || ( deckList[d].cdskil4.indexOf(value) != -1 )){ skilhas = true;}
            //                if (skilhas == true){
            //                    if (deckList[d].setsta.match(/待機中/)){
            //
            //                        chk=2;
            //                        return false;
            //                    } else {
            //                        console.log("待機・リロード");
            //                        setrokakulog("デッキに戻るまで待機");
            //                        chk=1;
            //                        l_fg=1;
            //                        return false;
            //                    }
            //                }
            //            }
            //        });
            //        if (l_fg==1){
            //            break label1;
            //        }
            //    }
            //}
        }
    }
    if (chk!=1){
        return true;
    } else {
        return false;
    }
}

//----------------------------------//
//パッシブ以外のカードがあれば待機  //
//----------------------------------//
function passivewait(){
    console.log("パッシブ以外のカードがあれば待機");
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("パッシブ以外のカードが存在するかチェック開始");}
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_flg=0;
    if (deckList.length != 0 ) {
        label1:
        for( var d= 0; d < deckList.length; d++ ) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("全軍に設定されているカードかチェック");
            label2:
            for (var k = 1; k <= rkkpznum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKUP_ZANCD" + k);
                var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        console.log("鹵獲パッシブ全軍に設定されているカードです");
                        if (m_rokaku_options[DEBUGFLG]==true){
                            var txt=deckList[d].name+":鹵獲パッシブ全軍に設定されているカードです";
                            setrokakulog(txt);
                        }
                        chk=2;
                        break label2;
                    }
                }
            }
            if (chk==0){
                label3:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲パッシブに設定されているカードです";
                                setrokakulog(txt);
                            }
                            chk=2;
                            break label3;
                        }
                    }
                }
            }
//            if (chk==0){
//                for (var k = 1; k <= rkkpznum; k++) {
//                    chk=0;
//                    var ZANCD = eval("ROKAKUP_ZANCD" + k);
//                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
//                    label6:
//                    if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==false)) {
//                        if (deckList[d].name == m_rokaku_options[ZANCD]){
//                            console.log("鹵獲パッシブ全軍・未使用に設定されているカードです");
//                            if (m_rokaku_options[DEBUGFLG]==true){
//                                var txt=deckList[d].name+":鹵獲パッシブ全軍・未使用に設定されているカードです";
//                                setrokakulog(txt);
//                            }
//                            if (deckList[d].setsta.match(/待機中/)){
//                                chk=2;
//                                break label6;
//                            } else {
//                                console.log("待機・リロード");
//                                setrokakulog("デッキに戻るまで待機");
//                                chk=1;
//                                break label1;
//                            }
//                        }
//                    }
//                }
//            }
            if ((chk==0) && (m_rokaku_options[USECONF1]==true)){
                if (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL] ){
                    console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
                    console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
                    j$.each(rokakuskillist, function(key, value) {
                        var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                        if (m_rokaku_options[SKCK]==true){
                            var skilhas = false;
                            if (( deckList[d].cdskil1.indexOf(value) != -1 ) ||  ( deckList[d].cdskil2.indexOf(value) != -1 ) ||
                                ( deckList[d].cdskil3.indexOf(value) != -1) || ( deckList[d].cdskil4.indexOf(value) != -1 )){ skilhas = true;}
                            if (skilhas == true){
                                console.log("鹵獲スキルのカードです");
                                if (m_rokaku_options[DEBUGFLG]==true){
                                    var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                    var txt=deckList[d].name +":"+ l_setsta +":鹵獲スキルのカードです";
                                    setrokakulog(txt);
                                }
                                if (deckList[d].setsta.match(/待機中/)){
                                    chk=2;
                                    return false;
                                } else {
                                    console.log("待機・リロード");
                                    setrokakulog("デッキに戻るまで待機");
                                    chk=1;
                                    l_flg=1;
                                    return false;
                                }
                            }
                        }
                    });
                    if (l_flg==1){
                        break label1;
                    }
                }
            }
            if ((chk==0) && (m_rokaku_options[USECONF1]==true)){
                for (var k = 1; k <= rkkzennum; k++) {
                    chk=0;
                    var ZANCD = eval("ROKAKU_ZANCD" + k);
                    var YNZEN = eval("YN_ROKAKUZEN" + k);
                    label4:
                    if ((m_rokaku_options[ZANCD].length > 0)) {
                        if (deckList[d].name == m_rokaku_options[ZANCD]){
                            console.log("鹵獲スキル全軍に設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                var txt=deckList[d].name +":"+ l_setsta +":鹵獲スキル全軍のカードです";
                                setrokakulog(txt);
                            }
                            if (deckList[d].setsta.match(/待機中/)){
                                chk=2;
                                break label4;
                            } else {
                                console.log("待機・リロード");
                                setrokakulog("デッキに戻るまで待機");
                                chk=1;
                                break label1;
                            }
                        }
                    }
                }
            }
        }
    }
    if (chk!=1){
        return true;
    } else {
        return false;
    }
}

//----------------------------------//
//全軍が乗せれるかチェック          //
//----------------------------------//
function chkrokakuzen(){
    console.log("全軍が乗せれるかチェック");
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var zcst=0;
    for (var k = 1; k <= rkkzennum; k++) {
        //全軍に設定されているカードを乗せる
        var chkzen=false;
        var ZANCD = eval("ROKAKU_ZANCD" + k);
        var ZANLBL = eval("ROKAKU_ZANLBL" + k);
        var ZANCST = eval("ROKAKU_ZANCST" + k);
        var YNZEN = eval("YN_ROKAKUZEN" + k);
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
            //全軍カードがデッキに乗っているか
            console.log("カード名:  %s  コスト:  %s",m_rokaku_options[ZANCD],selectValues5[(m_rokaku_options[ZANCST])]);
            chkzen=false;
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if( deckList[d].name == m_rokaku_options[ZANCD] ) {
                        //全軍と同じ名前のカードが存在する
                        chkzen=true;
                    }
                }
            }
            if (chkzen==false){
                console.log("デッキに乗ってない");
                zcst = zcst+parseFloat(selectValues5[(m_rokaku_options[ZANCST])]);
            }
        }
    }
    if (zcst == 0){
        console.log("全軍カードは全部デッキに存在する");
        return true;
    }
    console.log("下ろせるカードをチェック");
    var unsetcst=0;
    if (deckList.length != 0 ) {
        rlabel1:
        for( var d= 0; d < deckList.length; d++ ) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("全軍に設定されているカードかチェック");
            rlabel2:
            for (var k = 1; k <= rkkzennum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKU_ZANCD" + k);
                var YNZEN = eval("YN_ROKAKUZEN" + k);
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==true)) {
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        chk=2;
                        break rlabel2;
                    }
                }
            }
            if (chk==0){
                rlabel3:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            chk=1;
                            unsetcst = unsetcst+parseFloat(deckList[d].cost);
                            break rlabel3;
                        }
                    }
                }
            }
            if (chk==0){
                rlabel4:
                for (var k = 1; k <= rkkpznum; k++) {
                    var RUPCD = eval("ROKAKUP_ZANCD" + k);
                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD] &&  deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL]){
                            console.log("鹵獲パッシブ全軍に設定されているカードです");
                            chk=1;
                            unsetcst = unsetcst+parseFloat(deckList[d].cost);
                            break rlabel4;
                        }
                    }
                }
            }
        }
    }
    var usecst = GM_getValue(GM_KEY+"UseCost", 0);
    var deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
    console.log("下ろせる分のコスト: %d  使用コスト: %d  デッキコスト: %d 全軍必要コスト:  %d", unsetcst,usecst,deckcst,zcst);
    var chkcost= deckcst - usecst + unsetcst;
    if (zcst <= chkcost){
        console.log("空きコストあり");
        return true;
    } else {
        console.log("空きコストなし");
        return false;
    }
    return false;
}

//----------------------------------//
//パッシブ全軍が乗せれるかチェック  //
//----------------------------------//
function chkpassivezen(){
    console.log("パッシブ全軍が乗せれるかチェック");
    if (m_rokaku_options[DEBUGFLG]==true){
        setrokakulog("パッシブ全軍を乗せるデッキコストが存在するかチェック");
    }
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var zcst=0;
    for (var k = 1; k <= rkkpznum; k++) {
        //パッシブ全軍に設定されているカードをチェック
        var chkzen=false;
        var ZANCD = eval("ROKAKUP_ZANCD" + k);
        var ZANLBL = eval("ROKAKUP_ZANLBL" + k);
        var ZANCST = eval("ROKAKUP_ZANCST" + k);
        var YNPZEN = eval("YN_ROKAKUPZEN" + k);
        if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
            //全軍カードがデッキに乗っているか
            console.log("カード名:  %s  コスト:  %s",m_rokaku_options[ZANCD],m_rokaku_options[ZANCST]);
            chkzen=false;
            if (deckList.length != 0 ) {
                for( var d = 0; d < deckList.length; d++ ) {
                    if( deckList[d].name == m_rokaku_options[ZANCD] ) {
                        //全軍と同じ名前のカードが存在する
                        if (m_rokaku_options[DEBUGFLG]==true){
                            var txt=m_rokaku_options[ZANCD]+":鹵獲パッシブ全軍に設定されていてデッキに存在するカードです";
                            setrokakulog(txt);
                        }
                        chkzen=true;
                    }
                }
            }
            if (chkzen==false){
                console.log("デッキに乗ってない");
                if (m_rokaku_options[DEBUGFLG]==true){
                    var txt= m_rokaku_options[ZANCD] + ":デッキに存在しないカードです";
                    setrokakulog(txt);
                }
                zcst = zcst+parseFloat(selectValues5[(m_rokaku_options[ZANCST])]);
            }
        }
    }
    if (zcst == 0){
        console.log("全軍カードは全部デッキに存在する");
        if (m_rokaku_options[DEBUGFLG]==true){
            setrokakulog("設定されている全軍カードは全部デッキに存在します");
        }
        return true;
    }
    console.log("下ろせるカードをチェック");
    if (m_rokaku_options[DEBUGFLG]==true){
        setrokakulog("下ろせるカードをチェック開始");
    }
    var unsetcst=0;
    if (deckList.length != 0 ) {
        for( var d= 0; d < deckList.length; d++ ) {
            if (deckList[d].setvil ==m_rokaku_options[ROKAKU_VIL] ){
                console.log("skil1:" + deckList[d].cdskil1 + " skil1回復:" + deckList[d].cdskil1kai + "skil2:" + deckList[d].cdskil2 +" skil2回復:" + deckList[d].cdskil2kai);
                console.log("skil3:" + deckList[d].cdskil3 + " skil3回復:" + deckList[d].cdskil3kai + "skil4:" + deckList[d].cdskil4 +" skil4回復:" + deckList[d].cdskil4kai);
                label1:
                j$.each(rokakuskillist, function(key, value) {
                    var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                    if (m_rokaku_options[SKCK]==true){
                        var skilhas = false;
                        if (( deckList[d].cdskil1.indexOf(value) != -1 ) ||  ( deckList[d].cdskil2.indexOf(value) != -1 ) ||
                            ( deckList[d].cdskil3.indexOf(value) != -1) || ( deckList[d].cdskil4.indexOf(value) != -1 )){ skilhas = true;}
                        if (skilhas == true){
                            console.log("鹵獲スキルのカードです");
                            chk=1;
                            unsetcst = unsetcst+parseFloat(deckList[d].cost);
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲スキルのカードです 下げるコスト:"+unsetcst.toString();
                                setrokakulog(txt);
                            }
                            return false;
                            //break label1;
                        }
                    }
                });
            }
        }
        if (chk==0){
            for (var k = 1; k <= rkkzennum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKU_ZANCD" + k);
                var YNZEN = eval("YN_ROKAKUZEN" + k);
                label4:
                if ((m_rokaku_options[ZANCD].length > 0)) {
                    for( var d= 0; d < deckList.length; d++) {
                        if (deckList[d].name == m_rokaku_options[ZANCD]){
                            console.log("鹵獲スキル全軍に設定されているカードです");
                            chk=1;
                            unsetcst = unsetcst+parseFloat(deckList[d].cost );
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲スキル全軍のカードです 下げるコスト:"+unsetcst.toString();
                                setrokakulog(txt);
                            }
                            break label4;
                        }
                    }
                }
            }
        }
        //パッシブ全軍未使用を下す
        if (chk==0){
            for (var k = 1; k <= rkkpznum; k++) {
                chk=0;
                var ZANCD = eval("ROKAKUP_ZANCD" + k);
                var YNZEN = eval("YN_ROKAKUPZEN" + k);
                label7:
                if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNZEN]==false)) {
                    for( var d= 0; d < deckList.length; d++) {
                        if (deckList[d].name == m_rokaku_options[ZANCD]){
                            console.log("パッシブ全軍未使用に設定されているカードです");
                            chk=1;
                            unsetcst = unsetcst+parseFloat(deckList[d].cost );
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":パッシブ全軍未使用のカードです 下げるコスト:"+unsetcst.toString();
                                setrokakulog(txt);
                            }
                            break label7;
                        }
                    }
                }
            }
        }
    }
    var rkacost=0;
    if (m_rokaku_options[YN_RKKAI]==true){
        rkacost = parseFloat(selectValues5[(m_rokaku_options[RKKAICST])]);
    }
    var usecst = GM_getValue(GM_KEY+"UseCost", 0);
    var deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
    console.log("下ろせる分のコスト: %d  使用コスト: %d  デッキコスト: %d 全軍必要コスト:  %d 回復コスト:%d", unsetcst,usecst,deckcst,zcst,rkacost);
    if (m_rokaku_options[DEBUGFLG]==true){
        var txt="下ろせる分のコスト:使用コスト:デッキコスト:全軍必要コスト: 回復コスト="+ unsetcst.toString() + ":"+ usecst.toString() + ":"+ deckcst.toString() + ":"+ zcst.toString() + ":" + rkacost.toString();
        setrokakulog(txt);
    }
    var chkcost= deckcst - usecst + unsetcst - rkacost;
    if (zcst <= chkcost){
        console.log("空きコストあり");
        return true;
    } else {
        console.log("空きコストなし");
        return false;
    }
    return false;
}


//----------------------------------//
//各ラベルのページ数取得            //
//----------------------------------//
function setlblpage(){
    console.log("各ラベルのページ数取得");
    for (var i = 1; i < 15; i++) {
        getlblpage(i);
    }
}
function getlblpage(l_label){
    var url;
    var fileListAll = [];
    url=PROTOCOL　+ "//" + HOST + "/card/deck.php?l=" + l_label + "#file-1";
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        var urlprm = j$(data).find("#tab-labels a[class$='cur']").attr('href').match(/\d+/g)[0];
        //console.log(urlprm);
        var pagenum =  j$(data).find( "#rotate div[class='rotateInfo clearfix'] ul[class='pager'] li").length;
        if (pagenum < 2){pagenum =1;} else { pagenum = pagenum-1; }
        GM_setValue(GM_KEY + 'lblpage' + urlprm, pagenum );
        console.log("ラベルNO: %d  ページ数: %d ", urlprm, pagenum);
    });
}

//----------------------------------//
//出兵情報取得                      //
//----------------------------------//
function getsortie(){
    var url;
    var l_time;
    var l_date;
    var second =0;
    url=PROTOCOL　+ "//"  + HOST + "/facility/unit_status.php?type=sortie";
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        var l_chk =  j$(data).find( "#rotate_gui2 table[class='commonTables'] th").hasClass("ttl3 w50");
        if ( l_chk == true){
            l_time = j$(data).find( "#rotate_gui2 table[class='commonTables'] td[class='w300']").eq(1).text();
            console.log( l_time.indexOf("("));
            l_time = l_time.slice(0, l_time.indexOf("(",0));
            console.log(l_time);
            setrokakulog(l_time);
            l_date = Date.parse(j$.trim(l_time).replace(/-/g,"/"));
            var dtnow = new Date();
            var diff =  l_date - dtnow.getTime();
            second = diff/1000;  //秒取得
            console.log(second);
        } else {
            second = parseInt("99999");  //出兵なし
            console.log(second);
        }
    });
    return second;
}

//----------------------------------//
//兵士情報取得                      //
//----------------------------------//
function getSoldierall(){
    var url;
    var l_time;
    var l_date;
    var second =0;
    var l_kikansec =0;
    url=PROTOCOL　+ "//" + HOST + "/facility/unit_status.php?type=all";
    console.log(url);
    GM_setValue(GM_KEY + '_kikansec', 99999);
    GM_setValue(GM_KEY + '_sortiesec', 99999);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    })
        .done(function(data) {
        second = parseInt("99999");
        l_kikansec=parseInt("99999");
        j$(data).find("#rotate_gui2 table[class='commonTables']").each(function(index){
            if (j$(this).attr("summary") == '帰還') {
                l_time =  j$(this).find("td[class='returnUnit']").eq(0).text();
                console.log(l_time.indexOf("("));
                l_time = l_time.slice(0, l_time.indexOf("(",0));
                console.log(l_time);
                setrokakulog(l_time);
                l_date = Date.parse(j$.trim(l_time).replace(/-/g,"/"));
                var dtnow = new Date();
                var diff =  l_date - dtnow.getTime();
                l_kikansec = diff/1000;  //秒取得
                console.log(l_kikansec);
                GM_setValue(GM_KEY + '_kikansec', l_kikansec);
            }
            if (j$(this).attr("summary") == '出撃') {
                l_time =  j$(this).find("td[class='w300']").eq(1).text();
                console.log(l_time.indexOf("("));
                l_time = l_time.slice(0, l_time.indexOf("(",0));
                console.log(l_time);
                setrokakulog(l_time);
                l_date = Date.parse(j$.trim(l_time).replace(/-/g,"/"));
                var dtnow = new Date();
                var diff =  l_date - dtnow.getTime();
                second = diff/1000;  //秒取得
                console.log(second);
                GM_setValue(GM_KEY + '_sortiesec', second);
            }
        });
    });
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("帰還時間(秒):"+l_kikansec);}
    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("出撃時間(秒):"+second);}
}

//----------------------------------//
//ログ保存                          //
//----------------------------------//
function setrokakulog(l_logtxt){
    var l_chlogtxt = l_logtxt.replace( /,/g , "." );
    var dt = new Date();
    var l_strDate = rtoLocaleString(dt);
    var l_log=new Array();
    var l_chklog=GM_getValue(GM_KEY + '_rokakulog', "");
    var lognum=50;
    if (l_chklog!=""){
        l_log = GM_getValue(GM_KEY + '_rokakulog', []).split(',');
        var l_loglen=l_log.length;
        if(!isNaN(m_rokaku_options[LOGCOUNT])){
            lognum=m_rokaku_options[LOGCOUNT];
        }
        if (l_loglen > lognum){
            //多いログを消す
            l_log.splice(lognum, l_loglen-lognum);
            //ログ末尾削除
            l_log.pop();
        }
    }
    //最初に挿入
    l_log.unshift(l_chlogtxt);
    GM_setValue(GM_KEY + '_rokakulog', l_strDate+" "+l_log);  //ログ保存
}

function rtoLocaleString(date)
{
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}

//----------------------------------//
//予約日時の設定              //
//----------------------------------//
function rrk_res_settime(i_mon,i_day,i_hour,i_min,i_restime,i_restimeValue){
    var evMON = eval(i_mon);
    var evDAY = eval(i_day);
    var evHOUR = eval(i_hour);
    var evMIN = eval(i_min);

    var l_strmonth=m_rokaku_options[evMON];
    var l_strday=m_rokaku_options[evDAY];
    var l_strhour=m_rokaku_options[evHOUR];
    var l_strmin=m_rokaku_options[evMIN];
    var l_intyear=2000;
    var l_intmonth=0;
    var l_intday=0;
    var l_inthour=0;
    var l_intmin=0;

    if (isNaN(l_strmonth) || isNaN(l_strday)|| isNaN(l_strhour) || isNaN(l_strmin)) {
       return 0;   //数値変換できない値を含む
    } else {
       var dt = new Date();
       l_intyear = dt.getFullYear();
       l_intmonth = parseInt(l_strmonth)-1;
       l_intday = parseInt(l_strday);
       l_inthour = parseInt(l_strhour);
       l_intmin = parseInt(l_strmin);

       var dt_res = new Date(l_intyear,l_intmonth,l_intday,l_inthour,l_intmin);
       if (isNaN(dt_res.getTime())){
           return 0;   //日付変換できない
       } else {
           //今より過去
           if (dt.getTime() > dt_res.getTime()){
               l_intyear=l_intyear+1; //1年増やす
               dt_res = new Date(l_intyear,l_intmonth,l_intday,l_inthour,l_intmin);
           }
           GM_setValue(GM_KEY + i_restime, dt_res.getTime());  //予約時間保存
           var l_strtime=l_intyear.toString()+"年"+(("0"+l_strmonth).slice(-2))+"月"+(("0"+l_strday).slice(-2))+"日  "+
                                                         (("0"+l_strhour).slice(-2))+":"+(("0"+l_strmin).slice(-2));
           GM_setValue(GM_KEY + i_restimeValue, l_strtime);    //予約日時
       }
    }
}

//----------------------------------//
//デッキからすべてのカードを下す    //
//----------------------------------//
function rrk_res_unset(){
    console.log("デッキからすべてのカードを下す処理開始");
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_fg=0;
    if (deckList.length != 0 ) {
        for(var d= 0; d < deckList.length; d++) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("入替カードに設定されているカードかチェック");
            label1:
            for (var k = 1; k <= rkkresnum; k++) {
                chk=0;
                var RESCD = eval("RKK_RESCDID" + k);
                var YNRES = eval("RKK_YN_RES" + k);
                if ((deckList[d].cdid == m_rokaku_options[RESCD]) && (m_rokaku_options[YNRES]==true)) {
                    chk=1;
                    break label1;
                }
            }
            if (chk==0){
                //待機中のカードを下す
                if (deckList[d].setsta.match(/待機中/)){
                    console.log("カードを下ろす");
                    chk=1;
                    unsetdeckcard2(deckList[d].cdid);
                    var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                    setrokakulog(txt);
                }
            }
            if (chk==0){
                //内政セット済の場合拠点移動か内政解除
                if (deckList[d].setsta.match(/内政セット済/)){
                    //現在の拠点を取得
                    j$("div[class='sideBoxInner basename'] ul li").each(function(index){
                        var current = false;
                        if (j$(this).attr("class") == 'on') {
                            current = true;
                        }
                        var search;
                        if (current == true) {
                            if (j$("span", this).eq(0).text() == deckList[d].setvil) {
                                //内政解除
                                unsetdomestic(deckList[d].cdid);
                                //カードを下す
                                unsetdeckcard2(deckList[d].cdid);
                            }
                        } else {
                            if (j$("a", this).eq(0).text() == deckList[d].setvil) {
                                console.log(j$("a", this).eq(0).attr('href'));
                                location.href = PROTOCOL　+ "//"  + HOST + j$("a", this).eq(0).attr('href');
                            }
                        }
                    });
                }
            }
        }
    }
}

//----------------------------------//
//デッキからすべてのカードを下す    //
//----------------------------------//
function rrk_res_startunset(){
    console.log("デッキからすべてのカードを下す処理開始");
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    var chk=0;
    var l_fg=0;
    var l_unsetflag=0;
    if (deckList.length != 0 ) {
        label1:
        for(var d= 0; d < deckList.length; d++) {
            console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " 場所:"+ deckList[d].setvil);
            console.log("鹵獲場所にないカードはすべて下す");
            chk=0;
            if (deckList[d].setvil!=m_rokaku_options[ROKAKU_VIL] ){
                //待機中のカードを下す
                if (deckList[d].setsta.match(/待機中/)){
                    console.log("カードを下ろす");
                    chk=1;
                    unsetdeckcard2(deckList[d].cdid);
                    var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                    setrokakulog(txt);
                }
            }
            //if (chk==0){
            //    //援軍中のカードは無視
            //    if (deckList[d].setsta.match(/援軍中/)){
            //        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は援軍中のカードです");}
            //        chk=1;
            //    }
            //}
            //待機中で鹵獲スキル以外のカードは下す
            if (chk==0){
                label2:
                for (var k = 1; k <= rkkzennum; k++) {
                    chk=0;
                    var ZANCD = eval("ROKAKU_ZANCD" + k);
                    var YNZEN = eval("YN_ROKAKUZEN" + k);
                    if (deckList[d].name == m_rokaku_options[ZANCD]){
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲スキル全軍に設定されていて、デッキに存在するカードです");}
                        chk=2;
                        break label2;
                    }
                }
            }
            if (chk==0){
                label3:
                for (var k = 1; k <= rkkpznum; k++) {
                    chk=0;
                    var ZANCD = eval("ROKAKUP_ZANCD" + k);
                    var YNPZEN = eval("YN_ROKAKUPZEN" + k);
                    if ((m_rokaku_options[ZANCD].length > 0) && (m_rokaku_options[YNPZEN]==true)) {
                        if (deckList[d].name == m_rokaku_options[ZANCD]){
                            console.log("鹵獲パッシブ全軍に設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲パッシブ全軍に設定されているカードです";
                                setrokakulog(txt);
                            }
                            chk=2;
                            break label3;
                        }
                    }
                }
            }
            if (chk==0){
                label4:
                for (var k = 1; k <= rkknum; k++) {
                    var RUPCD = eval("ROKAKUP_CD" + k);
                    var YNRP = eval("YN_ROKAKUP" + k);
                    if ((m_rokaku_options[RUPCD].length > 0) && (m_rokaku_options[YNRP]==true)) {
                        if (deckList[d].name == m_rokaku_options[RUPCD]){
                            console.log("鹵獲パッシブに設定されているカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){
                                var txt=deckList[d].name+":鹵獲パッシブに設定されているカードです";
                                setrokakulog(txt);
                            }
                            chk=2;
                            break label4;
                        }
                    }
                }
            }
            if (chk==0){
                j$.each(rokakuskillist, function(key, value) {
                    chk=0;
                    var SKCK = eval( "ROKAKU_USEDSKIL" + key );
                    if (m_rokaku_options[SKCK]==true){
                        var skilhas = false;
                        if ((deckList[d].cdskil1.indexOf(value) != -1) ||  (deckList[d].cdskil2.indexOf(value) != -1) ||
                            (deckList[d].cdskil3.indexOf(value) != -1) || (deckList[d].cdskil4.indexOf(value) != -1)){ skilhas = true;}
                        if (skilhas == true){
                            console.log("鹵獲スキルのカードです");
                            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].name+"は鹵獲スキルを持ち、デッキに存在するカードです");}
                            chk=2;
                            return false;
                        }
                    }
                });
            }
            if (chk==0){
                //鹵獲カード以外の待機中のカードは下す
                if (deckList[d].setsta.match(/待機中/)){
                    console.log("カードを下ろす");
                    chk=1;
                    unsetdeckcard2(deckList[d].cdid);
                    var txt="カードID:"+deckList[d].cdid+" "+deckList[d].name+"をデッキから下しました";
                    setrokakulog(txt);
                }
            }
            if (chk==0){
                //内政セット済の場合拠点移動か内政解除
                if (deckList[d].setsta.match(/内政セット済/)){
                    //現在の拠点を取得
                    j$("div[class='sideBoxInner basename'] ul li").each(function(index){
                        var current = false;
                        if (j$(this).attr("class") == 'on') {
                            current = true;
                        }
                        var search;
                        if (current == true) {
                            if (j$("span", this).eq(0).text() == deckList[d].setvil) {
                                //内政解除
                                unsetdomestic(deckList[d].cdid);
                                //カードを下す
                                unsetdeckcard2(deckList[d].cdid);
                                chk=1;
                            }
                        } else {
                            if (j$("a", this).eq(0).text() == deckList[d].setvil) {
                                console.log(j$("a", this).eq(0).attr('href'));
                                location.href = PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                            }
                        }
                    });
                }
            }
            if (chk==0){
                l_unsetflag=1;
            }
        }
    }
    return l_unsetflag;
}

//----------------------------------//
//予約カードをデッキセット            //
//----------------------------------//
function rrk_res_cdset(){
    console.log("予約カードをデッキに乗せる");
    var l_chk=0;
    var l_fg=0;
    label1:
    for (var k = 1; k <= rkkresnum; k++) {
        var CDID = eval("RKK_RESCDID" + k);
        var RESCST = eval("RKK_RESCST" + k);
        var RESLBL = eval("RKK_RESLBL" + k);
        var YNRES = eval("RKK_YN_RES" + k);
        var RESSKL = eval("RKK_RESSKL" + k);
        if (((m_rokaku_options[CDID])!="") && (m_rokaku_options[YNRES]==true)) {
            l_fg=0;
            var deckList = rloadData(GM_KEY+"deckList", "[]", true);
            //デッキ設定
            label2:
            for(var d= 0; d < deckList.length; d++) {
                //デッキにすでに乗っている
                if (deckList[d].cdid == m_rokaku_options[CDID]) {
                    l_fg=1;
                    break label2;
                }
            }
            if (l_fg==0){
                //デッキコストが存在するか
                var usecst = GM_getValue(GM_KEY+"UseCost", 0);
                var deckcst = GM_getValue(GM_KEY+"DeckCost", 0);
                console.log("使用コスト: %d  デッキコスト: %d",usecst,deckcst);
                var chkcost= deckcst - usecst;
                var rescst = parseFloat(selectValues5[(m_rokaku_options[RESCST])]);
                if (rescst > chkcost){
                    l_fg=2;  //コストが足りない
                }
            }
            if (l_fg==0){
                //ファイルのカードを取得
                var l_label = m_rokaku_options[RESLBL];
                var l_page = GM_getValue(GM_KEY + 'lblpage' + l_label ,1);
                console.log("カードID: %s  fileno:  %d  page: %d",m_rokaku_options[CDID], l_label, l_page);
                for(var m= 0; m <= l_page; m++) {
                    getfilelist(l_label , m);
                    var fileList = rloadData(GM_KEY+"fileList", "[]", true);
                    if (fileList.length != 0 ) {
                        for(var fa= 0; fa < fileList.length; fa++) {
                            console.log("fileno:" + l_label +" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " HP:"+ fileList[fa].hp);
                            if ((fileList[fa].setsta =="set") && (fileList[fa].cdid==m_rokaku_options[CDID])){
                                //発動スキル
                                var resflag = false;
                                var resskilid="";
                                var resname="";
                                var l_ressklfg=GM_getValue(GM_KEY + '_restskil', false);    //スキル使用フラグ
                                if ((m_rokaku_options[RESSKL] != "") && (l_ressklfg==false)){
                                    var l_resskil=m_rokaku_options[RESSKL];
                                    if ((fileList[fa].cdskil1.indexOf(l_resskil) != -1) && (fileList[fa].cdskil1kai == true)){resflag = true; resskilid = fileList[fa].cdskil1id;resname=fileList[fa].cdskil1;}
                                    else if ((fileList[fa].cdskil2.indexOf(l_resskil) != -1) && (fileList[fa].cdskil2kai == true)){resflag = true; resskilid = fileList[fa].cdskil2id;resname=fileList[fa].cdskil2;}
                                    else if ((fileList[fa].cdskil3.indexOf(l_resskil) != -1) && (fileList[fa].cdskil3kai == true)){resflag = true; resskilid = fileList[fa].cdskil3id;resname=fileList[fa].cdskil3;}
                                    else if ((fileList[fa].cdskil4.indexOf(l_resskil) != -1) && (fileList[fa].cdskil4kai == true)){resflag = true; resskilid = fileList[fa].cdskil4id;resname=fileList[fa].cdskil4;}
                                }
                                //拠点設定
                                var lists = rloadData(GM_KEY+"VillageList", "[]", true);
                                var setvillage ="";
                                for (var i = 0;  i < lists.length; i++) {
                                    if(lists[i].name==m_rokaku_options[RKK_RES_VIL]){
                                        setvillage=lists[i].id;
                                    }
                                }
                                if (setvillage !=""){
                                    console.log("設定拠点ID:" + setvillage);
                                    console.log("設定カードデッキに乗せる");
                                    if (resflag==false){
                                        setdeckcard(fileList[fa].cdid, setvillage);
                                        var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                                        setrokakulog(txt);
                                    } else {
                                        setdeckskill(fileList[fa].cdid, resskilid,setvillage,1);
                                        GM_setValue(GM_KEY + '_restskil', true);    //スキル使用フラグ
                                        var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                                        setrokakulog(txt);
                                    }
                                } else {
                                    //設定拠点がない
                                    setrokakulog("拠点が存在しません");
                                    GM_setValue(GM_KEY +"RokakuAutoFlg", false);
                                    l_chk=0;
                                    break label1;
                                }
                            }
                        }
                    }
                }
            }
            if (l_fg!=1){
                l_chk=1;
            }
        }
    }
    return l_chk;  //0:すべての設定カードがデッキに存在 または 拠点が存在しない
}

//-----------------------------//
// 遠訓貯金チェック            //
//-----------------------------//
function rkk_chkenkbank(){
    var l_wood=0;
    var l_stone=0;
    var l_iron=0;
    var l_rice=0;
    var l_enbankflg=GM_getValue(GM_KEY +"_enbankflg", false);
    if ((m_rokaku_options[RKK_YN_ENBANK]==true) && (l_enbankflg==false)){
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("遠訓貯金処理を始める");}
        //自動施設ボタンチェック
        if(j$("#mapboxInner div").hasClass('autoLvUpBtn')){
            var l_Itmtitle=j$("#mapboxInner").find("div[class='autoLvUpBtn'] img").attr("alt");
            if(l_Itmtitle.match(/自動施設レベルアップ/)){
                //資源がしきい値以上かどうか
                l_wood=parseInt(j$("#wood").text());
                l_stone=parseInt(j$("#stone").text());
                l_iron=parseInt(j$("#iron").text());
                l_rice= parseInt(j$("#rice").text());

                console.log("wood:" + l_wood + " stone:" + l_stone + " iron:" + l_iron + " rice:" + l_rice);
                console.log("しきい値[木:石:鉄:糧]=[" + m_rokaku_options[RKK_WOOD_LIMIT] + " : " + m_rokaku_options[RKK_STONE_LIMIT] + " : " + m_rokaku_options[RKK_IRON_LIMIT] + " : " + m_rokaku_options[RKK_RICE_LIMIT] + "]");
                var l_txt="木:" + l_wood + " 石:" + l_stone + " 鉄:" + l_iron + " 糧:" + l_rice;
                //setrokakulog(txt);  //倉庫の状態

                if ((m_rokaku_options[RKK_WOOD_LIMIT]<l_wood) && (m_rokaku_options[RKK_STONE_LIMIT]<l_stone) &&
                          (m_rokaku_options[RKK_IRON_LIMIT]<l_iron) && (m_rokaku_options[RKK_RICE_LIMIT]<l_rice)){
                   if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(l_txt);}
                   rkk_enkbankfun();    //遠訓貯金処理
                }
            }
        }
    }
}

//-----------------------------//
// 遠訓貯金処理                //
//-----------------------------//
function rkk_enkbankfun(){
    var l_url="";
    //デッキに大治世がある
    //getdecklist();  //デッキのカード取得
    var l_skilflg=false;
    var l_enkflg=0;
    var deckList = rloadData(GM_KEY+"deckList", "[]", true);
    l_url=PROTOCOL　+ "//" + HOST + "/village.php";
    rkk_loadURL(l_url);
    var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
    //デッキ設定
    label0:
    for(var d= 0; d < deckList.length; d++) {
        //内政設定されているカードで「大治世」を含むスキルが回復中ではない
        if (deckList[d].setsta.match(/内政セット済/)){
            var l_skillname="大治世";
            if (((deckList[d].cdskil1.indexOf(l_skillname) != -1) && (deckList[d].cdskil1kai == true)) ||
                ((deckList[d].cdskil2.indexOf(l_skillname) != -1) && (deckList[d].cdskil2kai == true)) ||
                ((deckList[d].cdskil3.indexOf(l_skillname) != -1) && (deckList[d].cdskil3kai == true)) ||
                ((deckList[d].cdskil4.indexOf(l_skillname) != -1) && (deckList[d].cdskil4kai == true)) ||
                ((deckList[d].fukcd.indexOf(l_skillname) != -1) && (deckList[d].fukKai == true))){

                //拠点チェック
                j$("div[class='sideBoxInner basename'] ul li").each(function(index){
                    var l_current = false;
                    if (j$(this).attr("class") == 'on') {
                        l_current = true;
                    }
                    var search;
                    if (l_current == true) {
                        if (j$("span", this).eq(0).text() == deckList[d].setvil) {
                            l_url=PROTOCOL　+ "//" + HOST + "/village_change.php?village_id=" + l_vilid + "&from=menu&page=%2Fvillage.php";
                            rkk_getvillage(l_url);
                        }
                    } else {
                        if (!(j$("span", this).eq(1).hasClass('buildingText'))){
                            if (j$("a", this).eq(0).text() == deckList[d].setvil) {
                                console.log(j$("a", this).eq(0).attr('href'));
                                l_url=PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                                rkk_getvillage(l_url);
                            }
                        }
                    }
                });

                var vilinfo = rloadData(GM_KEY+"_vilinfo", "[]", true);
                if ((vilinfo[0].skil1.indexOf(l_skillname) != -1) || (vilinfo[0].skil2.indexOf(l_skillname) != -1)){
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(deckList[d].setvil + ":大治世使用中");}
                    l_skilflg=true;
                    break label0;
                }
            }
        }
    }
    l_enkflg=0;
    if (l_skilflg==false){
        //拠点一覧取得
        var arry_villist=[];
        var arry_url=[];
        var l_vilcnt=0;
        j$("div[class='sideBoxInner basename'] ul li").each(function(index){
            var l_current = false;
            if (j$(this).attr("class") == 'on') {
                l_current = true;
            }
            var search;
            if (l_current == true) {
                arry_villist[l_vilcnt]=j$("span", this).eq(0).text();
                var l_vilid = j$(".basenameForm input:hidden[name='village_id']").val();
                l_url=PROTOCOL　+ "//" + HOST + "/village_change.php?village_id=" + l_vilid + "&from=menu&page=%2Fvillage.php";
                arry_url[l_vilcnt]=l_url;

                if (j$("span", this).eq(1).hasClass('deletingText')){
                   arry_villist[l_vilcnt]=j$("span", this).eq(0).text()+"(破棄中)";
                }
            } else {
                if (!(j$("span", this).eq(1).hasClass('buildingText'))){
                    arry_villist[l_vilcnt]=j$("a", this).eq(0).text();
                    l_url=PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                    arry_url[l_vilcnt]=l_url;

                    if (j$("span", this).eq(0).hasClass('deletingText')){
                        arry_villist[l_vilcnt]=j$("a", this).eq(0).text()+"(破棄中)";
                    }
                }
            }
            l_vilcnt=l_vilcnt+1;
        });
        Label1:
        for(var vil= 0; vil < arry_villist.length; vil++) {
            //破棄中ではない
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(arry_villist[vil]);}
            if (arry_villist[vil].indexOf("(破棄中)")==-1) {
                //遠訓予約対象外拠点ではない
                if ((m_rokaku_options[RKK_NOTBANKVIL1]!=arry_villist[vil]) && (m_rokaku_options[RKK_NOTBANKVIL2]!=arry_villist[vil]) &&
                    (m_rokaku_options[RKK_NOTBANKVIL3]!=arry_villist[vil]) && (m_rokaku_options[RKK_NOTBANKVIL4]!=arry_villist[vil]) &&
                    (m_rokaku_options[RKK_NOTBANKVIL5]!=arry_villist[vil])){

                    rkk_getvillage(arry_url[vil]);
                    var vilinfo = rloadData(GM_KEY+"_vilinfo", "[]", true);
                    //レベル1の遠訓があり、かつ予約中ではない
                    if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(vilinfo[0].enklevel+"遠訓予約フラグ"+vilinfo[0].enkres);}
                    if ((vilinfo[0].enklevel=="遠征訓練所 LV.1") && (vilinfo[0].enkres==false)){
                        l_enkflg=1;
                        //内政スキルに治世と王佐を含まない
                        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("内政スキル1:"+vilinfo[0].skil1+" 内政スキル2:"+vilinfo[0].skil2);}
                        if ((vilinfo[0].skil1.indexOf("治世")==-1) && (vilinfo[0].skil1.indexOf("王佐")==-1) &&
                            (vilinfo[0].skil2.indexOf("治世")==-1) && (vilinfo[0].skil2.indexOf("王佐")==-1)){
                            //建築予約は１つ以下
                            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("建築予約数:"+vilinfo[0].rescnt);}
                            if (vilinfo[0].rescnt<2){
                                //遠訓貯金実施
                                rkk_enkbanksend(vilinfo[0].vilid,vilinfo[0].x_val,vilinfo[0].y_val);
                                setrokakulog("遠征訓練所LV20の予約建築を実施しました");
                                break Label1;
                            }
                        }
                    }
                }
            }
        }
        //遠訓貯金出来る拠点が存在しない
        if (l_enkflg==0){
            if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("遠訓貯金出来る拠点が存在しない");}
            GM_setValue(GM_KEY +"_enbankflg", true);
        }
    }
    l_url=PROTOCOL　+ "//" + HOST + "/village_change.php?village_id=" + l_vilid + "&from=menu&page=%2Fvillage.php";
    rkk_loadURL(l_url);
}

//--------------------//
// 自動寄付            //
//--------------------//
function rkk_autodonation(){

    //資源がしきい値以上かどうか
    var l_wood = parseInt(j$("#wood").text());
    var l_stone = parseInt(j$("#stone").text());
    var l_iron = parseInt(j$("#iron").text());
    var l_rice = parseInt(j$("#rice").text());

    console.log("wood:" + l_wood + " stone:" + l_stone + " iron:" + l_iron + " rice:" + l_rice);
    console.log("しきい値[木:石:鉄:糧]=[" + m_rokaku_options[RKK_AD_WOOD_LIMIT] + " : " + m_rokaku_options[RKK_AD_STONE_LIMIT] + " : " + m_rokaku_options[RKK_AD_IRON_LIMIT] + " : " + m_rokaku_options[RKK_AD_RICE_LIMIT] + "]");
    var l_txt="木:" + l_wood + " 石:" + l_stone + " 鉄:" + l_iron + " 糧:" + l_rice;

    var l_ad_wood_limit = parseInt(m_rokaku_options[RKK_AD_WOOD_LIMIT]);
    var l_ad_stone_limit = parseInt(m_rokaku_options[RKK_AD_STONE_LIMIT]);
    var l_ad_iron_limit = parseInt(m_rokaku_options[RKK_AD_IRON_LIMIT]);
    var l_ad_rice_limit = parseInt(m_rokaku_options[RKK_AD_RICE_LIMIT]);
    if (isNaN(l_ad_wood_limit) || isNaN(l_ad_stone_limit) || isNaN(l_ad_iron_limit) || isNaN(l_ad_rice_limit)) {
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("自動寄付しきい値が数値ではありません");}
    }
    var l_ad_wood = parseInt(m_rokaku_options[RKK_AD_WOOD]);
    var l_ad_stone = parseInt(m_rokaku_options[RKK_AD_STONE]);
    var l_ad_iron = parseInt(m_rokaku_options[RKK_AD_IRON]);
    var l_ad_rice = parseInt(m_rokaku_options[RKK_AD_RICE]);
    if (isNaN(l_ad_wood) || isNaN(l_ad_stone) || isNaN(l_ad_iron) || isNaN(l_ad_rice)) {
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("自動寄付しきい値が数値ではありません");}
    }

    if ((l_ad_wood_limit<l_wood) && (l_ad_stone_limit<l_stone) && (l_ad_iron_limit<l_iron) && (l_ad_rice_limit<l_rice)){
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog(l_txt);}
        if (m_rokaku_options[DEBUGFLG]==true){setrokakulog("自動寄付処理を始めます");}
        l_txt="木:" + l_ad_wood + " 石:" + l_ad_stone + " 鉄:" + l_ad_iron + " 糧:" + l_ad_rice;
        // 送信データの作成
        var params = new Object;
        params['wood'] = l_ad_wood;
        params['stone'] = l_ad_stone;
        params['iron'] = l_ad_iron;
        params['rice'] = l_ad_rice;
        params['contribution'] = 1;
        console.log(params);
        j$.ajax({
            type: 'POST',
            url: PROTOCOL　+ "//" + HOST + "/alliance/level.php",
            datatype: 'html',
            cache: false,
            async: false,
            data: params
        }) .done(function(data) {
            setrokakulog(l_txt + " 寄付しました");
        });
    }
}

//-----------------------//
// 鹵獲設定画面描画      //
//-----------------------//
function drawSetRokakuWindow() {
    //表示コンテナ作成
    var RKKfacContainer = j$("<div>");
    RKKfacContainer.attr('id', 'rokaku_setting_view');
    RKKfacContainer.css('position','absolute');
    RKKfacContainer.css('backgroundColor','#eee');
    RKKfacContainer.css('opacity',1.0);
    RKKfacContainer.css('border','solid 2px black');
    RKKfacContainer.css('left', '20px');
    RKKfacContainer.css('top', '20px');
    RKKfacContainer.css('display','none');
    RKKfacContainer.css('margin-bottom','3px');
    RKKfacContainer.css('zIndex','9999');
    RKKfacContainer.css('width','800px');

    j$("#header").append(RKKfacContainer);
    RKKfacContainer.draggable();

    var arr1 = ['メイン設定','メイン設定２', '鹵獲スキル設定', '鹵獲パッシブ設定', 'デッキ入替予約', '時間予約','遠訓貯金', 'EXP/IMP','ログ'];
    var rul = j$("<ul>");
    rul.css({'margin-bottom':0,'font-weight':'bold','font-size':'12px'});
    rul.addClass('rokakutab');
    var arrlen = arr1.length;

    for(var i = 0; i < arrlen; i++) {
        var newli = j$('<li>');
        newli.text(arr1[i]);
        if (i==0){
            newli.addClass('select');
        }
        rul.append(newli);
    }
    RKKfacContainer.append(rul);

    var rul = j$("<ul>");
    rul.css({'margin-top':0,'font-size':'12px'});
    rul.addClass('tab_contents');

    for(var i = 1; i < arrlen+1; i++) {
        if (i!=1){
            var newli=j$('<li>',{'class':'hide', 'id': 'rokaku_tabs-'+i});
        } else {
            var newli=j$('<li>',{'id': 'rokaku_tabs-'+i});
        }
        rul.append(newli);
    }
    RKKfacContainer.append(rul);

    rokaku_setting0();
    rokaku_setting1();
    rokaku_setting2();
    rokaku_setting3();
    rokaku_setting4();
    rokaku_setting5();
    rokaku_setting6();
    rokaku_setting7();
    rokaku_setting8();

    j$('.rokakutab li').click(function() {
        var index = j$('.rokakutab li').index(this);
        j$('.tab_contents li').css('display','none');
        j$('.tab_contents li').eq(index).css('display','block');
        j$('.rokakutab li').removeClass('select');
        j$(this).addClass('select');
    });
    j$(document).on('click',"#btn_up1", function() {
        moveUpElement("flerecskil1");
    });
    j$(document).on('click',"#btn_down1", function() {
        moveDownElement("flerecskil1");
    });
    j$(document).on('click',"#btn_right1", function() {
        moveRLElement("flerecskil1","unrecskil1");
    });
    j$(document).on('click',"#btn_left1", function() {
        moveRLElement("unrecskil1","flerecskil1");
    });
    j$(document).on('click',"#btn_up2", function() {
        moveUpElement("recskil2");
    });
    j$(document).on('click',"#btn_down2", function() {
        moveDownElement("recskil2");
    });
    j$(document).on('click',"#btn_right2", function() {
        moveRLElement("recskil2","unrecskil2");
    });
    j$(document).on('click',"#btn_left2", function() {
        moveRLElement("unrecskil2","recskil2");
    });

    // 保存ボタン
    j$("[id^='saveSetWindow']").on('click',
                      function() {
            rokaku_gmset();
            alert("保存しました。");
            loadRokakuSettings();
            j$("#td52").text("設定保存拠点："+m_rokaku_options[ROKAKU_VIL]);
            j$("#td5a2").text("第二設定保存拠点："+m_rokaku_options[ROKAKU_VIL2]);
            j$("#td62").text("回復スキル保存拠点："+m_rokaku_options[KAIHK_VIL]);
    });
    // 閉じるボタンのクリックイベント
    j$(document).on('click',"[ id^='closeSetWindow' ]",function() {
        j$("#rokaku_setting_view").css('display', 'none');
    });
    // エクスポートオプション
    j$("#rexpbtn").on('click',
        function() {
            //一旦保存
            rokaku_gmset();
            j$("#rexparea").val(JSON.stringify(m_rokaku_options));
        });
    // インポートオプション
    j$("#rimpbtn").on('click',
                      function() {
        var options;
        try {
            options = JSON.parse(j$("#rexparea").val());
        } catch(e) {
            alert("文法エラーがあるため設定を取り込めません");
            return;
        }
        if (typeof options !="object") {
            alert("文法エラーがあるため設定を取り込めません");
            return;
        }
        // インポートした設定に戻す
        for (var key in options) {
            if (j$("#" + key).length > 0) {
                if ((key=='flerecskil1') || (key=='unrecskil1') || (key=='recskil2') || (key=='unrecskil2')){
                    j$("#" + key).children().remove();
                    j$.each(options[key], function(key1, value1) {
                        j$("#" + key)
                            .append(j$("<option></option>")
                                    .attr("value",key1)
                                    .text(value1));
                    });
                } else {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == options[key];}).prop('selected', true);
                    }
                }
            }
        }
        alert("設定を適用する場合は保存ボタンを押してください");
    });

    // すべて初期化
    j$("[ id^='initSetWindow' ]").on('click',function() {
        var options = getrkkDefaultOptions();
        // 初期値設定に戻す
        for (var key in options) {
            if (j$("#" + key).length > 0) {
                if ((key=='flerecskil1') || (key=='unrecskil1') || (key=='recskil2') || (key=='unrecskil2')){
                    j$("#" + key).children().remove();
                    j$.each(options[key], function(key1, value1) {
                        j$("#" + key)
                            .append(j$("<option></option>")
                                    .attr("value",key1)
                                    .text(value1));
                    });
                } else {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == options[key];}).prop('selected', true);
                    }
                }
            }
        }
        alert("設定を適用する場合は保存ボタンを押してください");
    });

    //タブごとの初期化
    j$("[id^='inittabSetWindow']").on("click",function(){
        var btnid  = j$(this).attr("id");
        var btnnum = btnid.match(/\d+/g)[0];
        var options = "";
        if (btnnum==0){options = getrkktab0Default();}
        else if (btnnum==1){options = getrkktab1Default();}
        else if (btnnum==2){options = getrkktab2Default();}
        else if (btnnum==3){options = getrkktab3Default();}
        else if (btnnum==6){options = getrkktab6Default();}
        else if (btnnum==7){options = getrkktab7Default();}
        else if (btnnum==8){options = getrkktab8Default();}

        // 初期値設定に戻す
        for (var key in options) {
            if (j$("#" + key).length > 0) {
                if ((key=='flerecskil1') || (key=='unrecskil1') || (key=='recskil2') || (key=='unrecskil2')){
                    j$("#" + key).children().remove();
                    j$.each(options[key], function(key1, value1) {
                        j$("#" + key)
                            .append(j$("<option></option>")
                                    .attr("value",key1)
                                    .text(value1));
                    });
                } else {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == options[key];}).prop('selected', true);
                    }
                }
            }
        }
        alert("設定を適用する場合は保存ボタンを押してください");
    });

    //NGリストを削除
    j$("#deletecdlist").on('click',function() {
        GM_setValue(GM_KEY + "_ngatkcdid", "");
        GM_setValue(GM_KEY + '_ngspdcdid', "");
        GM_setValue(GM_KEY + '_ngcdlist', "");
        j$("#ngcdlistarea").val("");
   });

  // 予約設定
  j$("#rkk_res_setbtn").on('click',
  function() {
      //予約時間設定
      rokaku_gmset();
      loadRokakuSettings();
      rrk_res_settime("RKK_RES_MON","RKK_RES_DAY","RKK_RES_HOUR","RKK_RES_MIN","_restime","_restimeValue");
      var l_restimeVal =GM_getValue(GM_KEY + '_restimeValue', "");
      if (l_restimeVal!=""){
          //GM_setValue(GM_KEY + '_resfun', 0);
          var l_resflg=GM_getValue(GM_KEY + '_resfun', 0);
          var l_ressts="";
          if (l_resflg==false){
              //l_ressts="(予約中)";
              var l_restime=GM_getValue(GM_KEY + '_restime', "");
              if (l_restime!=""){
                  var dt = new Date();
                  var diff=l_restime-dt.getTime();
                  var hour = diff/(1000*60*60);
                  l_ressts="(約" + hour.toFixed(1) + "時間後予約)";
              }
          } else {
              l_ressts="(実行済)"
          }
          j$("#td3_121").text("予約日時:"+l_restimeVal+l_ressts);
      }
   });
   //予約リセット
   j$("#rkk_res_resetbtn").on('click',
   function() {
        GM_setValue(GM_KEY + '_resfun', 0);      //実行フラグ
        GM_setValue(GM_KEY + '_restime', "");        //予約時間保存
        GM_setValue(GM_KEY + '_restimeValue', "");   //予約日時
        GM_setValue(GM_KEY + '_restskil', false);    //スキル使用フラグ
        j$("#td3_121").text("予約日時:");
   });

  // 鹵獲開始予約設定
  j$("#rkk_res_startsettbtn").on('click',
  function() {
      //予約時間設定
      rokaku_gmset();
      loadRokakuSettings();
      rrk_res_settime("RKK_RES_STARTMON","RKK_RES_STARTDAY","RKK_RES_STARTHOUR","RKK_RES_STARTMIN","_resstarttime","_resstarttimeValue");
      var l_restimeVal =GM_getValue(GM_KEY + '_resstarttimeValue', "");
      if (l_restimeVal!=""){
          //GM_setValue(GM_KEY + '_resstartfun', false);
          var l_resflg=GM_getValue(GM_KEY + '_resstartfun', false);
          var l_ressts="";
          if (l_resflg==false){
              //l_ressts="(予約中)";
              var l_restime=GM_getValue(GM_KEY + '_resstarttime', "");
              if (l_restime!=""){
                  var dt = new Date();
                  var diff=l_restime-dt.getTime();
                  var hour = diff/(1000*60*60);
                  l_ressts="(約" + hour.toFixed(1) + "時間後予約)";
              }
          } else {
              l_ressts="(実行済)"
          }
          j$("#td8_51").text("開始予約日時:"+l_restimeVal+l_ressts);
      }
   });
   //鹵獲開始予約リセット
   j$("#rkk_res_startresetbtn").on('click',
   function() {
        GM_setValue(GM_KEY + '_resstartfun', false);      //実行フラグ
        GM_setValue(GM_KEY + '_resstarttime', "");        //予約時間保存
        GM_setValue(GM_KEY + '_resstarttimeValue', "");   //予約日時
        j$("#td8_51").text("開始予約日時:");
   });

  // 鹵獲停止予約設定
  j$("#rkk_res_stopsettbtn").on('click',
  function() {
      //予約時間設定
      rokaku_gmset();
      loadRokakuSettings();
      rrk_res_settime("RKK_RES_STOPMON","RKK_RES_STOPDAY","RKK_RES_STOPHOUR","RKK_RES_STOPMIN","_resstoptime","_resstoptimeValue");
      var l_restimeVal =GM_getValue(GM_KEY + '_resstoptimeValue', "");
      if (l_restimeVal!=""){
          //GM_setValue(GM_KEY + '_resstopfun', false);
          var l_resflg=GM_getValue(GM_KEY + '_resstopfun', false);
          var l_ressts="";
          if (l_resflg==false){
              //l_ressts="(予約中)";
              var l_restime=GM_getValue(GM_KEY + '_resstoptime', "");
              if (l_restime!=""){
                  var dt = new Date();
                  var diff=l_restime-dt.getTime();
                  var hour = diff/(1000*60*60);
                  l_ressts="(約" + hour.toFixed(1) + "時間後予約)";
              }
          } else {
              l_ressts="(実行済)"
          }
          j$("#td8_101").text("停止予約日時:"+l_restimeVal+l_ressts);
      }
   });
   //鹵獲停止予約リセット
   j$("#rkk_res_stopresetbtn").on('click',
   function() {
        GM_setValue(GM_KEY + '_resstopfun', false);      //実行フラグ
        GM_setValue(GM_KEY + '_resstoptime', "");        //予約時間保存
        GM_setValue(GM_KEY + '_resstoptimeValue', "");   //予約日時
        j$("#td8_101").text("停止予約日時:");
   });
    // 鹵獲再開予約設定
    j$("#rkk_res_restartsettbtn").on('click',
                                     function() {
        //予約時間設定
        rokaku_gmset();
        loadRokakuSettings();
        rrk_res_settime("RKK_RES_RESTARTMON","RKK_RES_RESTARTDAY","RKK_RES_RESTARTHOUR","RKK_RES_RESTARTMIN","_resrestarttime","_resrestarttimeValue");
        var l_restimeVal =GM_getValue(GM_KEY + '_resrestarttimeValue', "");
        if (l_restimeVal!=""){
            //GM_setValue(GM_KEY + '_resrestartfun', false);
            var l_resflg=GM_getValue(GM_KEY + '_resrestartfun', false);
            var l_ressts="";
            if (l_resflg==false){
                //l_ressts="(予約中)"
                var l_restime=GM_getValue(GM_KEY + '_resrestarttime', "");
                if (l_restime!=""){
                    var dt = new Date();
                    var diff=l_restime-dt.getTime();
                    var hour = diff/(1000*60*60);
                    l_ressts="(約" + hour.toFixed(1) + "時間後予約)";
                }
            } else {
                l_ressts="(実行済)"
            }
            j$("#td8_151").text("再開予約日時:"+l_restimeVal+l_ressts);
        }
    });
    //鹵獲再開予約リセット
    j$("#rkk_res_restartresetbtn").on('click',
    function() {
        GM_setValue(GM_KEY + '_resrestartfun', false);      //実行フラグ
        GM_setValue(GM_KEY + '_resrestarttime', "");        //予約時間保存
        GM_setValue(GM_KEY + '_resrestarttimeValue', "");   //予約日時
        j$("#td8_151").text("再開予約日時:");
    });
}

//-----------------------------------------------//
//  遠訓貯金最低値以下の場合最低値に変換         //
//-----------------------------------------------//
function rkk_chglimitfun(){
    var l_num=0;
    var l_txt=j$("#rkk_wood_limit").val();
    if (!isNaN(l_txt)) {
        l_num = parseInt(l_txt);
        if (l_num<rrk_enkdf_wood){
            j$("#rkk_wood_limit").val(rrk_enkdf_wood);
        }
    } else {
        j$("#rkk_wood_limit").val(rrk_enkdf_wood);
    }
    var l_txt=j$("#rkk_stone_limit").val();
    if (!isNaN(l_txt)) {
        l_num = parseInt(l_txt);
        if (l_num<rrk_enkdf_stone){
            j$("#rkk_stone_limit").val(rrk_enkdf_stone);
        }
    } else {
        j$("#rkk_stone_limit").val(rrk_enkdf_stone);
    }
    var l_txt=j$("#rkk_iron_limit").val();
    if (!isNaN(l_txt)) {
        l_num = parseInt(l_txt);
        if (l_num<rrk_enkdf_iron){
            j$("#rkk_iron_limit").val(rrk_enkdf_iron);
        }
    } else {
        j$("#rkk_iron_limit").val(rrk_enkdf_iron);
    }
    var l_txt=j$("#rkk_rice_limit").val();
    if (!isNaN(l_txt)) {
        l_num = parseInt(l_txt);
        if (l_num<rrk_enkdf_rice){
            j$("#rkk_rice_limit").val(rrk_enkdf_rice);
        }
    } else {
        j$("#rkk_rice_limit").val(rrk_enkdf_rice);
    }
}

//---------------------------//
//    設定を保存する         //
//---------------------------//
function rokaku_gmset() {
    //遠訓貯金最低値以下の場合最低値に変換
    rkk_chglimitfun();

    var options = getrkkDefaultOptions();
    var obj = new Object;
    var items = j$("#rokaku_setting_view input");
    for (var i = 0; i < items.length; i++) {
        if (items.eq(i).attr('type') == 'checkbox') {
            obj[items.eq(i).attr('id')] = items.eq(i).prop('checked');
        } else if (items.eq(i).attr('type') == 'text') {
            if (!isNaN(items.eq(i).val())) {
                var num = parseInt(items.eq(i).val());
                if (!isNaN(num)) {
                    obj[items.eq(i).attr('id')] = num;
                } else {
                    obj[items.eq(i).attr('id')] = options[items.eq(i).attr('id')];
                }
            } else {
                obj[items.eq(i).attr('id')] = items.eq(i).val().trim();
            }
        }
    }
    var items1 = j$("#rokaku_setting_view select");
    for (var i = 0; i < items1.length; i++) {
        if (!isNaN(items1.eq(i).val())) {
            var num = parseInt(items1.eq(i).val());
            if (!isNaN(num) && num > 0) {
                obj[items1.eq(i).attr('id')] = num;
            } else {
                obj[items1.eq(i).attr('id')] = options[items1.eq(i).attr('id')];
            }
        } else {
            obj[items1.eq(i).attr('id')] = items1.eq(i).val().trim();
        }
    }

    var items2 = j$(".setrecskil");
    var hash = {};
    for (var i = 0; i < items2.length; i++) {
        hash = {};
        for (var k = 0; k <  j$("#" + items2.eq(i).attr('id')).children( 'option').length; k++) {
            hash[k] = j$("#" + items2.eq(i).attr('id')).children( 'option').eq(k).text();
        }
        obj[items2.eq(i).attr('id')] = hash;
    }
    //設定を保存
    GM_setValue(GM_KEY + '_rokaku_options', JSON.stringify(obj));
}
//---------------------------//
//    設定画面の描画         //
//---------------------------//
function rokaku_setting0() {
    var table1 = j$("<table>");
    j$( "#rokaku_tabs-1" ).append(table1);
    j$(table1).
        append(j$("<tr><td colspan='6' id=td11></td></tr>\
                <tr><td class=ctd0></td>\
                <td id=td21 class=ctd1></td>\
                <td id=td22 class=ctd1></td>\
                <td id=td23 class=ctd1></td>\
                <td></td></tr>\
                <tr><td colspan='6' id=td31></td></tr>\
                <tr><td class=ctd0></td>\
                <td id=td41 class=ctd1></td>\
                <td id=td42 class=ctd1></td>\
                <td id=td43 class=ctd1></td>\
                <td></td></tr>\
                <tr><td colspan='3' id=td51></td><td colspan='3' id=td52 style='color: #3300ff;'></td></tr>\
                <tr><td colspan='4' id=td5a1></td><td class=ctd0></td><td id=td5a2 style='color: #3300ff;'></td></tr>\
                <tr><td colspan='3' id=td61></td><td colspan='3' id=td62 style='color: #3300ff;'></td></tr>\
                <tr><td colspan='6' id=td71></td></tr>\
                <tr><td class=ctd0></td><td colspan='5' id=td81></td></tr>\
                <tr><td colspan='6' id=td91></td></tr>\
                <tr><td class=ctd0></td><td colspan='5' id=td101></td></tr>\
                <tr><td colspan='6' id=td111></td></tr>\
                <tr><td class=ctd0></td><td colspan='5' id=td121></td></tr>\
                <tr><td class=ctd0></td><td colspan='5' id=td12a1></td></tr>\
                <tr><td colspan='6'>\
                <table>\
                <tr><td colspan='3' id=td131></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td141></td><td id=td142></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td151></td><td id=td152></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td161></td><td id=td162></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td171></td><td id=td172></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td181></td><td id=td182></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td191></td><td id=td192></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td201></td><td id=td202></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td211></td><td id=td212></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td221></td><td id=td222></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td321></td><td id=td322></td></tr>\
                <tr><td colspan='3' id=td231></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td241></td><td id=td242></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td251></td><td id=td252></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td261></td><td id=td262></td></tr>\
                <tr><td colspan='3' id=td271></td></tr>\
                <tr><td class=ctd0></td><td class=ctd2 id=td281></td><td id=td282></td></tr>\
                </table>\
                </td></tr>\
                <tr><td colspan='6' id=td1_191></td></tr>\
                <tr><td class=ctd0></td><td colspan='5'><table>\
                <tr><td  id=td1_201></td><td  id=td1_202 class=ctd0></td>\
                <td  id=td1_203></td></tr>\
                <tr><td  id=td1_211></td><td  id=td1_212 class=ctd0></td>\
                <td  id=td1_213></td></tr></table></td></tr>\
                <tr><td colspan='6' id=td291></td></tr>\
                <tr><td colspan='6' id=td301></td></tr>\
                <tr><td colspan='6' id=td311 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td11", "使用する設定");
    rcreateCheckBox("#td21", "useconf1" , "鹵獲スキル","useconf","1",m_rokaku_options[USECONF1]);
    rcreateCheckBox("#td22", "useconf2" , "鹵獲パッシブ","useconf","2",m_rokaku_options[USECONF2]);
    rcreateSpan("#td31", "設定優先順位");
    rcreateSelectBox("#td41", "usedlst1" , "鹵獲スキル","select2",m_rokaku_options[USEDLST1],selectValues1);
    rcreateSelectBox("#td42", "usedlst2" , "鹵獲パッシブ","select2",m_rokaku_options[USEDLST2],selectValues1);
    rcreateSelectBox("#td51", "rokaku_vil" , "出兵拠点：","select1", m_rokaku_options[ROKAKU_VIL] ,selectValues2);
    rcreateSpan("#td52", "設定保存拠点："+m_rokaku_options[ROKAKU_VIL]);
    rcreateCheckBox("#td5a1", "yn_subvil" , "","yn_subvil","1",m_rokaku_options[YN_SUBVIL]);
    rcreateSelectBox("#td5a1", "rokaku_vil2" , "出兵拠点が存在しない場合は","select1", m_rokaku_options[ROKAKU_VIL2] ,selectValues2);
    rcreateSpan("#td5a1", "を出兵拠点とする");
    rcreateSpan("#td5a2", "第二設定保存拠点："+m_rokaku_options[ROKAKU_VIL2]);
    rcreateSelectBox("#td61", "kaihk_vil" , "回復スキル使用拠点：","select1", m_rokaku_options[KAIHK_VIL] ,selectValues2);
    rcreateSpan("#td62", "回復スキル保存拠点："+m_rokaku_options[KAIHK_VIL]);
    rcreateSpan("#td71", "出兵座標");
    rcreateTextBox("#td81", "wood_x" , "木：(",m_rokaku_options[WOOD_X],'4','30px',false);
    rcreateTextBox("#td81", "wood_y" , ",",m_rokaku_options[WOOD_Y],'4','30px',false);
    rcreateSpan("#td81", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td81", "stone_x" , "石：(",m_rokaku_options[STONE_X],'4','30px',false);
    rcreateTextBox("#td81", "stone_y" , ",",m_rokaku_options[STONE_Y],'4','30px',false);
    rcreateSpan("#td81", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td81", "iron_x" , "鉄：(",m_rokaku_options[IRON_X],'4','30px',false);
    rcreateTextBox("#td81", "iron_y" , ",",m_rokaku_options[IRON_Y],'4','30px',false);
    rcreateSpan("#td81", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td81", "rice_x" , "糧：(",m_rokaku_options[RICE_X],'4','30px',false);
    rcreateTextBox("#td81", "rice_y" , ",",m_rokaku_options[RICE_Y],'4','30px',false);
    rcreateSpan("#td81", ")");
    rcreateSpan("#td91", "出兵座標２(任意)※上の出兵座標が空き地ではない場合に出兵する");
    rcreateTextBox("#td101", "wood_x2" , "木：(",m_rokaku_options[WOOD_X2],'4','30px',false);
    rcreateTextBox("#td101", "wood_y2" , ",",m_rokaku_options[WOOD_Y2],'4','30px',false);
    rcreateSpan("#td101", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td101", "stone_x2" , "石：(",m_rokaku_options[STONE_X2],'4','30px',false);
    rcreateTextBox("#td101", "stone_y2" , ",",m_rokaku_options[STONE_Y2],'4','30px',false);
    rcreateSpan("#td101", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td101", "iron_x2" , "鉄：(",m_rokaku_options[IRON_X2],'4','30px',false);
    rcreateTextBox("#td101", "iron_y2" , ",",m_rokaku_options[IRON_Y2],'4','30px',false);
    rcreateSpan("#td101", ")&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td101", "rice_x2" , "糧：(",m_rokaku_options[RICE_X2],'4','30px',false);
    rcreateTextBox("#td101", "rice_y2" , ",",m_rokaku_options[RICE_Y2],'4','30px',false);
    rcreateSpan("#td101", ")");
    rcreateSpan("#td111", "優先度※乱数によって変わるので目安です。");
    rcreateTextBox("#td121", "wood_rate" , "木：石：鉄：糧 ＝ ",m_rokaku_options[WOOD_RATE],'1','15px',false);
    rcreateTextBox("#td121", "stone_rate" , "：",m_rokaku_options[STONE_RATE],'1','15px',false);
    rcreateTextBox("#td121", "iron_rate" , "：",m_rokaku_options[IRON_RATE],'1','15px',false);
    rcreateTextBox("#td121", "rice_rate" , "：",m_rokaku_options[RICE_RATE],'1','15px',false);
    rcreateCheckBox("#td12a1", "yn_rice_rokaku" , "倉庫がいっぱいになったら糧だけ鹵獲を続ける","yn_rice_rokaku","1",m_rokaku_options[YN_RICE_ROKAKU]);
    rcreateSpan("#td131", "HP回復スキル使用設定<デッキ>");
    rcreateSpan("#td141", "仁君:");
    rcreateSelectBox("#td142", "jin_label" , "ラベル:","select2",m_rokaku_options[JIN_LABEL],selectValues3);
    rcreateSpan("#td142", " | ");
    rcreateSelectBox("#td142", "jin_skillv" , "スキルレベル:","select2",m_rokaku_options[JIN_SKILLV],selectValues4);
    rcreateSpan("#td142", "以上");
    rcreateSpan("#td151", "神医の施術:");
    rcreateSelectBox("#td152", "sejyu_label" , "ラベル:","select2",m_rokaku_options[SEJYU_LABEL],selectValues3);
    rcreateSpan("#td152", " | ");
    rcreateSelectBox("#td152", "sejyu_skillv" , "スキルレベル:","select2",m_rokaku_options[SEJYU_SKILLV],selectValues4);
    rcreateSpan("#td152", "以上");
    rcreateSpan("#td161", "弓腰姫の愛:");
    rcreateSelectBox("#td162", "kyuyoki_label" , "ラベル:","select2",m_rokaku_options[KYUYOKI_LABEL],selectValues3);
    rcreateSpan("#td162", " | ");
    rcreateSelectBox("#td162", "kyuyoki_skillv" , "スキルレベル:","select2",m_rokaku_options[KYUYOKI_SKILLV],selectValues4);
    rcreateSpan("#td162", "以上");
    rcreateSpan("#td171", "皇后の慈愛:");
    rcreateSelectBox("#td172", "kgjai_label" , "ラベル:","select2",m_rokaku_options[KGJAI_LABEL],selectValues3);
    rcreateSpan("#td172", " | ");
    rcreateSelectBox("#td172", "kgjai_skillv" , "スキルレベル:","select2",m_rokaku_options[KGJAI_SKILLV],selectValues4);
    rcreateSpan("#td172", "以上");
    rcreateSpan("#td181", "桃色吐息:");
    rcreateSelectBox("#td182", "momo_label" , "ラベル:","select2",m_rokaku_options[MOMO_LABEL],selectValues3);
    rcreateSpan("#td182", " | ");
    rcreateSelectBox("#td182", "momo_skillv" , "スキルレベル:","select2",m_rokaku_options[MOMO_SKILLV],selectValues4);
    rcreateSpan("#td182", "以上");
    rcreateSpan("#td191", "酔吟吐息:");
    rcreateSelectBox("#td192", "suigin_label" , "ラベル:","select2",m_rokaku_options[SUIGIN_LABEL],selectValues3);
    rcreateSpan("#td192", " | ");
    rcreateSelectBox("#td192", "suigin_skillv" , "スキルレベル:","select2",m_rokaku_options[SUIGIN_SKILLV],selectValues4);
    rcreateSpan("#td192", "以上");
    rcreateSpan("#td201", "文姫の慈愛:");
    rcreateSelectBox("#td202", "bnkjai_label" , "ラベル:","select2",m_rokaku_options[BNKJAI_LABEL],selectValues3);
    rcreateSpan("#td202", " | ");
    rcreateSelectBox("#td202", "bnkjai_skillv" , "スキルレベル:","select2",m_rokaku_options[BNKJAI_SKILLV],selectValues4);
    rcreateSpan("#td202", "以上");
    rcreateSpan("#td211", "神卜の方術:");
    rcreateSelectBox("#td212", "sinbk_label" , "ラベル:","select2",m_rokaku_options[SINBK_LABEL],selectValues3);
    rcreateSpan("#td212", " | ");
    rcreateSelectBox("#td212", "sinbk_skillv" , "スキルレベル:","select2",m_rokaku_options[SINBK_SKILLV],selectValues4);
    rcreateSpan("#td212", "以上");
    rcreateSpan("#td221", "娘々敬慕:");
    rcreateSelectBox("#td222", "nnkeb_label" , "ラベル:","select2",m_rokaku_options[NNKEB_LABEL],selectValues3);
    rcreateSpan("#td222", " | ");
    rcreateSelectBox("#td222", "nnkeb_skillv" , "スキルレベル:","select2",m_rokaku_options[NNKEB_SKILLV],selectValues4);
    rcreateSpan("#td222", "以上");
    rcreateSpan("#td321", "熊猫の麺匠:");
    rcreateSelectBox("#td322", "pndmen_label" , "ラベル:","select2",m_rokaku_options[PNDMEN_LABEL],selectValues3);
    rcreateSpan("#td322", " | ");
    rcreateSelectBox("#td322", "pndmen_skillv" , "スキルレベル:","select2",m_rokaku_options[PNDMEN_SKILLV],selectValues4);
    rcreateSpan("#td322", "以上");
    rcreateSpan("#td231", "HP回復スキル使用設定<ファイル>");
    rcreateSpan("#td241", "神医の術式:");
    rcreateSelectBox("#td242", "jyutu_label" , "ラベル:","select2",m_rokaku_options[JYUTU_LABEL],selectValues3);
    rcreateSpan("#td242", " | ");
    rcreateSelectBox("#td242", "jyutu_skillv" , "スキルレベル:","select2",m_rokaku_options[JYUTU_SKILLV],selectValues4);
    rcreateSpan("#td242", "以上");
    rcreateSpan("#td251", "劉備の契り:");
    rcreateSelectBox("#td252", "cigiri_label" , "ラベル:","select2",m_rokaku_options[CIGIRI_LABEL],selectValues3);
    rcreateSpan("#td252", " | ");
    rcreateSelectBox("#td252", "cigiri_skillv" , "スキルレベル:","select2",m_rokaku_options[CIGIRI_SKILLV],selectValues4);
    rcreateSpan("#td252", "以上");
    rcreateSpan("#td261", "神卜の術式:");
    rcreateSelectBox("#td262", "bkjyutu_label" , "ラベル:","select2",m_rokaku_options[BKJYUTU_LABEL],selectValues3);
    rcreateSpan("#td262", " | ");
    rcreateSelectBox("#td262", "bkjyutu_skillv" , "スキルレベル:","select2",m_rokaku_options[BKJYUTU_SKILLV],selectValues4);
    rcreateSpan("#td262", "以上");
    rcreateSpan("#td271", "討伐ゲージ回復スキル使用設定");
    rcreateSpan("#td281", "傾国:");
    rcreateSelectBox("#td282", "kei_label" , "ラベル:","select2",m_rokaku_options[KEI_LABEL],selectValues3);
    rcreateSpan("#td282", " | ");
    rcreateSelectBox("#td282", "kei_skillv" , "スキルレベル:","select2",m_rokaku_options[KEI_SKILLV],selectValues4);
    rcreateSpan("#td282", "以上");
    rcreateSpan("#td1_191", "使用する神医的回復スキル(デッキ乗せる処理のとき使用)※上の方が優先順位高");
    rcreateSpan("#td1_201", "使用する");
    rcreateSelectListBox("#td1_211","flerecskil1","setrecskil", "7", m_rokaku_options[FLERECSKIL1] );
    rcreateButton("#td1_212", "btn_up1", "▲", "rbtn_a");
    rcreateButton("#td1_212", "btn_down1", "▼", "rbtn_a");
    rcreateButton("#td1_212", "btn_right1", ">>", "rbtn_a");
    rcreateButton("#td1_212", "btn_left1", "<<", "rbtn_a");
    rcreateSpan("#td1_203", "使用しない");
    rcreateSelectListBox("#td1_213","unrecskil1","setrecskil", "7",  m_rokaku_options[UNRECSKIL1] );
    rcreateCheckBox("#td291", "yn_rkkai" , "回復用に","yn_rkkai","1",m_rokaku_options[YN_RKKAI]);
    rcreateSelectBox("#td291", "rkkaicst" , "コスト:","select2",m_rokaku_options[RKKAICST],selectValues5);
    rcreateSpan("#td291", "コスト分デッキは空ける");
    rcreateSpan("#td301", "※チェックしなければLV0カードを下ろして回復する");
    rcreateButton("#td311", "saveSetWindow0", "設定を保存", "rbtn_c");
    rcreateButton("#td311", "inittabSetWindow0", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td311", "initSetWindow0", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td311", "closeSetWindow0", "閉じる", "rbtn_c");
    rkkcreatetitle("#td311");

    //拠点プルダウン設定
    var lists = rloadData(GM_KEY+"VillageList", "[]", true);
    var plist ;
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#rokaku_vil").append(plist);
    }
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#rokaku_vil2").append(plist);
    }
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#kaihk_vil").append(plist);
    }
}

function rokaku_setting1() {
    var table2 = j$("<table>");
    j$( "#rokaku_tabs-3" ).append(table2);
    j$(table2).
        append(j$("<tr><td colspan='6' id=td1_11></td></tr>\
                <tr><td colspan='6' id=td1_81></td></tr>\
                <tr><td class=ctd0></td><td id=td1_91 colspan='5'></td></tr>\
                <tr><td colspan='6' id=td1_101></td></tr>\
                <tr><td class=ctd0></td><td id=td1_111 colspan='5'></td></tr>\
                <tr><td class=ctd0></td><td id=td1_121 colspan='5'></td></tr>\
                <tr><td class=ctd0></td><td id=td1_131 colspan='5'></td></tr>\
                <tr><td class=ctd0></td><td id=td1_13a1 colspan='5'></td></tr>\
                <tr><td class=ctd0></td><td id=td1_13b1 colspan='5'></td></tr>\
                <tr><td class=ctd0></td><td colspan='5' id=td1_141></td></tr>\
                <tr><td colspan='6' id=td1_151></td></tr>\
                <tr><td class=ctd0></td><td id=td1_161></td>\
                </td><td id=td1_162></td></td><td id=td1_163></td>\
                </td><td id=td1_164></td></td><td id=td1_165></td></tr>\
                <tr><td class=ctd0></td><td id=td1_171></td>\
                </td><td id=td1_172></td></td><td id=td1_173></td>\
                </td><td id=td1_174></td></td><td id=td1_175></td></tr>\
                <tr><td class=ctd0></td><td id=td1_181></td>\
                </td><td id=td1_182></td></td><td id=td1_183></td>\
                </td><td id=td1_184></td></td><td id=td1_185></td></tr>\
                <tr><td colspan='6' id=td1_301 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td1_81", "鹵獲スキルのラベル");
    rcreateSelectBox("#td1_91", "rokaku_label" , "ラベル:","select2",m_rokaku_options[ROKAKU_LABEL],selectValues3);
    rcreateSpan("#td1_101", "乗せたい全軍系カード ※同じラベルに同じ名前のカードがあれば、どちらが選択されるか運次第");
    rcreateCheckBox("#td1_111", "yn_rokakuzen1" , "","yn_rokakuzen1","1",m_rokaku_options[YN_ROKAKUZEN1]);
    rcreateTextBox("#td1_111", "rokaku_zancd1" , "カード名:",m_rokaku_options[ROKAKU_ZANCD1],'15','150px',false);
    rcreateSpan("#td1_111", "| ");
    rcreateSelectBox("#td1_111", "rokaku_zancst1" , "コスト:","select2",m_rokaku_options[ROKAKU_ZANCST1],selectValues5);
    rcreateSpan("#td1_111", " | ");
    rcreateSelectBox("#td1_111", "rokaku_zanlbl1" , "ラベル:","select2",m_rokaku_options[ROKAKU_ZANLBL1],selectValues3);
    rcreateCheckBox("#td1_121", "yn_rokakuzen2" , "","yn_rokakuzen2","1",m_rokaku_options[YN_ROKAKUZEN2]);
    rcreateTextBox("#td1_121", "rokaku_zancd2" , "カード名:",m_rokaku_options[ROKAKU_ZANCD2],'15','150px',false);
    rcreateSpan("#td1_121", "| ");
    rcreateSelectBox("#td1_121", "rokaku_zancst2" , "コスト:","select2",m_rokaku_options[ROKAKU_ZANCST2],selectValues5);
    rcreateSpan("#td1_121", " | ");
    rcreateSelectBox("#td1_121", "rokaku_zanlbl2" , "ラベル:","select2",m_rokaku_options[ROKAKU_ZANLBL2],selectValues3);
    rcreateCheckBox("#td1_131", "yn_rokakuzen3" , "","yn_rokakuzen3","1",m_rokaku_options[YN_ROKAKUZEN3]);
    rcreateTextBox("#td1_131", "rokaku_zancd3" , "カード名:",m_rokaku_options[ROKAKU_ZANCD3],'15','150px',false);
    rcreateSpan("#td1_131", "| ");
    rcreateSelectBox("#td1_131", "rokaku_zancst3" , "コスト:","select2",m_rokaku_options[ROKAKU_ZANCST3],selectValues5);
    rcreateSpan("#td1_131", " | ");
    rcreateSelectBox("#td1_131", "rokaku_zanlbl3" , "ラベル:","select2",m_rokaku_options[ROKAKU_ZANLBL3],selectValues3);
    rcreateCheckBox("#td1_13a1", "yn_rokakuzen4" , "","yn_rokakuzen4","1",m_rokaku_options[YN_ROKAKUZEN4]);
    rcreateTextBox("#td1_13a1", "rokaku_zancd4" , "カード名:",m_rokaku_options[ROKAKU_ZANCD4],'15','150px',false);
    rcreateSpan("#td1_13a1", "| ");
    rcreateSelectBox("#td1_13a1", "rokaku_zancst4" , "コスト:","select2",m_rokaku_options[ROKAKU_ZANCST4],selectValues5);
    rcreateSpan("#td1_13a1", " | ");
    rcreateSelectBox("#td1_13a1", "rokaku_zanlbl4" , "ラベル:","select2",m_rokaku_options[ROKAKU_ZANLBL4],selectValues3);
    rcreateCheckBox("#td1_13b1", "yn_rokakuzen5" , "","yn_rokakuzen5","1",m_rokaku_options[YN_ROKAKUZEN5]);
    rcreateTextBox("#td1_13b1", "rokaku_zancd5" , "カード名:",m_rokaku_options[ROKAKU_ZANCD5],'15','150px',false);
    rcreateSpan("#td1_13b1", "| ");
    rcreateSelectBox("#td1_13b1", "rokaku_zancst5" , "コスト:","select2",m_rokaku_options[ROKAKU_ZANCST5],selectValues5);
    rcreateSpan("#td1_13b1", " | ");
    rcreateSelectBox("#td1_13b1", "rokaku_zanlbl5" , "ラベル:","select2",m_rokaku_options[ROKAKU_ZANLBL5],selectValues3);
    rcreateSpan("#td1_141", "※全軍を乗せられなければ出兵しません");
    rcreateSpan("#td1_151", "使用する鹵獲スキル");
    rcreateCheckBox("#td1_161", "rokaku_usedskil1" , "劉備の大徳","rokaku_usedskil","1",m_rokaku_options[ROKAKU_USEDSKIL1]);
    rcreateCheckBox("#td1_162", "rokaku_usedskil2" , "鬼神の鹵獲","rokaku_usedskil","2",m_rokaku_options[ROKAKU_USEDSKIL2]);
    rcreateCheckBox("#td1_163", "rokaku_usedskil3" , "猛将の鹵獲","rokaku_usedskil","3",m_rokaku_options[ROKAKU_USEDSKIL3]);
    rcreateCheckBox("#td1_164", "rokaku_usedskil4" , "趁火打劫","rokaku_usedskil","4",m_rokaku_options[ROKAKU_USEDSKIL4]);
    rcreateCheckBox("#td1_165", "rokaku_usedskil5" , "迅速劫略","rokaku_usedskil","5",m_rokaku_options[ROKAKU_USEDSKIL5]);
    rcreateCheckBox("#td1_171", "rokaku_usedskil6" , "神速劫略","rokaku_usedskil","6",m_rokaku_options[ROKAKU_USEDSKIL6]);
    rcreateCheckBox("#td1_172", "rokaku_usedskil7" , "龍神の縮地劫略","rokaku_usedskil","7",m_rokaku_options[ROKAKU_USEDSKIL7]);
    rcreateCheckBox("#td1_173", "rokaku_usedskil8" , "鬼神の縮地劫略","rokaku_usedskil","8",m_rokaku_options[ROKAKU_USEDSKIL8]);
    rcreateCheckBox("#td1_174", "rokaku_usedskil9" , "猛将の縮地劫略","rokaku_usedskil","9",m_rokaku_options[ROKAKU_USEDSKIL9]);
    rcreateCheckBox("#td1_175", "rokaku_usedskil10" , "猛暑の縮地収穫","rokaku_usedskil","10",m_rokaku_options[ROKAKU_USEDSKIL10]);
    rcreateCheckBox("#td1_181", "rokaku_usedskil11" , "桃賊の襲撃","rokaku_usedskil","11",m_rokaku_options[ROKAKU_USEDSKIL11]);
    rcreateButton("#td1_301", "saveSetWindow1", "設定を保存", "rbtn_c");
    rcreateButton("#td1_301", "inittabSetWindow1", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td1_301", "initSetWindow1", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td1_301", "closeSetWindow1", "閉じる", "rbtn_c");
    rkkcreatetitle("#td1_301");
}

function rokaku_setting2() {
    var table3 = j$("<table>");
    j$("#rokaku_tabs-4" ).append(table3);
    j$(table3).
        append(j$("<tr><td colspan='4' id=td2_11></td></tr>\
                <tr><td colspan='4' id=td2_191></td></tr>\
                <tr><td class=ctd0></td><td id=td2_201 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_211 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_221 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_22a1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_22b1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td colspan='3' id=td2_231></td></tr>\
                <tr><td colspan='4' id=td2_81></td></tr>\
                <tr><td class=ctd0></td><td id=td2_91 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_101 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_111 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_121 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_131 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13a1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13b1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13c1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13d1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13e1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13f1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13g1 colspan='3'></td></tr>\
                <tr><td class=ctd0></td><td id=td2_13h1 colspan='3'></td></tr>\
                <tr><td colspan='4' id=td2_141></td></tr>\
                <tr><td colspan='4' id=td2_151></td></tr>\
                <tr><td colspan='4' id=td2_161></td></tr>\
                <tr><td colspan='4' id=td2_171></td></tr>\
                <tr><td class=ctd0></td><td colspan='3'><table>\
                <tr><td  id=td2_181></td><td  id=td2_182 class=ctd0></td>\
                <td  id=td2_183></td></tr>\
                <tr><td  id=td2_291></td><td  id=td2_292 class=ctd0></td>\
                <td  id=td2_293></td></tr></table></td></tr>\
                <tr><td colspan='4' id=td2_301></td></tr>\
                <tr><td colspan='4' id=td2_281 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td2_81", "鹵獲パッシブカード ※同じラベルに同じ名前のカードがあれば、どちらが選択されるか運次第");
    rcreateCheckBox("#td2_91", "yn_rokakup1" , "","yn_rokakup1","1",m_rokaku_options[YN_ROKAKUP1]);
    rcreateTextBox("#td2_91", "rokakup_cd1" , "カード名:",m_rokaku_options[ROKAKUP_CD1],'15','150px',false);
    rcreateSpan("#td2_91", " | ");
    rcreateSelectBox("#td2_91", "rokakup_cst1" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST1],selectValues5);
    rcreateSpan("#td2_91", " | ");
    rcreateSelectBox("#td2_91", "rokakup_lbl1" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL1],selectValues3);
    rcreateSpan("#td2_91", " | ");
    rcreateCheckBox("#td2_91", "yn_usekei1" , "傾国使用","yn_usekei1","1",m_rokaku_options[YN_USEKEI1]);
    rcreateCheckBox("#td2_101", "yn_rokakup2" , "","yn_rokakup2","1",m_rokaku_options[YN_ROKAKUP2]);
    rcreateTextBox("#td2_101", "rokakup_cd2" , "カード名:",m_rokaku_options[ROKAKUP_CD2],'15','150px',false);
    rcreateSpan("#td2_101", " | ");
    rcreateSelectBox("#td2_101", "rokakup_cst2" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST2],selectValues5);
    rcreateSpan("#td2_101", " | ");
    rcreateSelectBox("#td2_101", "rokakup_lbl2" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL2],selectValues3);
    rcreateSpan("#td2_101", " | ");
    rcreateCheckBox("#td2_101", "yn_usekei2" , "傾国使用","yn_usekei2","1",m_rokaku_options[YN_USEKEI2]);
    rcreateCheckBox("#td2_111", "yn_rokakup3" , "","yn_rokakup3","1",m_rokaku_options[YN_ROKAKUP3]);
    rcreateTextBox("#td2_111", "rokakup_cd3" , "カード名:",m_rokaku_options[ROKAKUP_CD3],'15','150px',false);
    rcreateSpan("#td2_111", " | ");
    rcreateSelectBox("#td2_111", "rokakup_cst3" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST3],selectValues5);
    rcreateSpan("#td2_111", " | ");
    rcreateSelectBox("#td2_111", "rokakup_lbl3" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL3],selectValues3);
    rcreateSpan("#td2_111", " | ");
    rcreateCheckBox("#td2_111", "yn_usekei3" , "傾国使用","yn_usekei3","1",m_rokaku_options[YN_USEKEI3]);
    rcreateCheckBox("#td2_121", "yn_rokakup4" , "","yn_rokakup4","1",m_rokaku_options[YN_ROKAKUP4]);
    rcreateTextBox("#td2_121", "rokakup_cd4" , "カード名:",m_rokaku_options[ROKAKUP_CD4],'15','150px',false);
    rcreateSpan("#td2_121", " | ");
    rcreateSelectBox("#td2_121", "rokakup_cst4" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST4],selectValues5);
    rcreateSpan("#td2_121", " | ");
    rcreateSelectBox("#td2_121", "rokakup_lbl4" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL4],selectValues3);
    rcreateSpan("#td2_121", " | ");
    rcreateCheckBox("#td2_121", "yn_usekei4" , "傾国使用","yn_usekei4","1",m_rokaku_options[YN_USEKEI4]);
    rcreateCheckBox("#td2_131", "yn_rokakup5" , "","yn_rokakup5","1",m_rokaku_options[YN_ROKAKUP5]);
    rcreateTextBox("#td2_131", "rokakup_cd5" , "カード名:",m_rokaku_options[ROKAKUP_CD5],'15','150px',false);
    rcreateSpan("#td2_131", " | ");
    rcreateSelectBox("#td2_131", "rokakup_cst5" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST5],selectValues5);
    rcreateSpan("#td2_131", " | ");
    rcreateSelectBox("#td2_131", "rokakup_lbl5" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL5],selectValues3);
    rcreateSpan("#td2_131", " | ");
    rcreateCheckBox("#td2_131", "yn_usekei5" , "傾国使用","yn_usekei5","1",m_rokaku_options[YN_USEKEI5]);
    rcreateCheckBox("#td2_13a1", "yn_rokakup6" , "","yn_rokakup6","1",m_rokaku_options[YN_ROKAKUP6]);
    rcreateTextBox("#td2_13a1", "rokakup_cd6" , "カード名:",m_rokaku_options[ROKAKUP_CD6],'15','150px',false);
    rcreateSpan("#td2_13a1", " | ");
    rcreateSelectBox("#td2_13a1", "rokakup_cst6" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST6],selectValues5);
    rcreateSpan("#td2_13a1", " | ");
    rcreateSelectBox("#td2_13a1", "rokakup_lbl6" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL6],selectValues3);
    rcreateSpan("#td2_13a1", " | ");
    rcreateCheckBox("#td2_13a1", "yn_usekei6" , "傾国使用","yn_usekei6","1",m_rokaku_options[YN_USEKEI6]);
    rcreateCheckBox("#td2_13b1", "yn_rokakup7" , "","yn_rokakup7","1",m_rokaku_options[YN_ROKAKUP7]);
    rcreateTextBox("#td2_13b1", "rokakup_cd7" , "カード名:",m_rokaku_options[ROKAKUP_CD7],'15','150px',false);
    rcreateSpan("#td2_13b1", " | ");
    rcreateSelectBox("#td2_13b1", "rokakup_cst7" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST7],selectValues5);
    rcreateSpan("#td2_13b1", " | ");
    rcreateSelectBox("#td2_13b1", "rokakup_lbl7" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL7],selectValues3);
    rcreateSpan("#td2_13b1", " | ");
    rcreateCheckBox("#td2_13b1", "yn_usekei7" , "傾国使用","yn_usekei7","1",m_rokaku_options[YN_USEKEI7]);
    rcreateCheckBox("#td2_13c1", "yn_rokakup8" , "","yn_rokakup8","1",m_rokaku_options[YN_ROKAKUP8]);
    rcreateTextBox("#td2_13c1", "rokakup_cd8" , "カード名:",m_rokaku_options[ROKAKUP_CD8],'15','150px',false);
    rcreateSpan("#td2_13c1", " | ");
    rcreateSelectBox("#td2_13c1", "rokakup_cst8" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST8],selectValues5);
    rcreateSpan("#td2_13c1", " | ");
    rcreateSelectBox("#td2_13c1", "rokakup_lbl8" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL8],selectValues3);
    rcreateSpan("#td2_13c1", " | ");
    rcreateCheckBox("#td2_13c1", "yn_usekei8" , "傾国使用","yn_usekei8","1",m_rokaku_options[YN_USEKEI8]);
    rcreateCheckBox("#td2_13d1", "yn_rokakup9" , "","yn_rokakup9","1",m_rokaku_options[YN_ROKAKUP9]);
    rcreateTextBox("#td2_13d1", "rokakup_cd9" , "カード名:",m_rokaku_options[ROKAKUP_CD9],'15','150px',false);
    rcreateSpan("#td2_13d1", " | ");
    rcreateSelectBox("#td2_13d1", "rokakup_cst9" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST9],selectValues5);
    rcreateSpan("#td2_13d1", " | ");
    rcreateSelectBox("#td2_13d1", "rokakup_lbl9" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL9],selectValues3);
    rcreateSpan("#td2_13d1", " | ");
    rcreateCheckBox("#td2_13d1", "yn_usekei9" , "傾国使用","yn_usekei9","1",m_rokaku_options[YN_USEKEI9]);
    rcreateCheckBox("#td2_13e1", "yn_rokakup10" , "","yn_rokakup10","1",m_rokaku_options[YN_ROKAKUP10]);
    rcreateTextBox("#td2_13e1", "rokakup_cd10" , "カード名:",m_rokaku_options[ROKAKUP_CD10],'15','150px',false);
    rcreateSpan("#td2_13e1", " | ");
    rcreateSelectBox("#td2_13e1", "rokakup_cst10" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST10],selectValues5);
    rcreateSpan("#td2_13e1", " | ");
    rcreateSelectBox("#td2_13e1", "rokakup_lbl10" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL10],selectValues3);
    rcreateSpan("#td2_13e1", " | ");
    rcreateCheckBox("#td2_13e1", "yn_usekei10" , "傾国使用","yn_usekei10","1",m_rokaku_options[YN_USEKEI10]);
    rcreateCheckBox("#td2_13f1", "yn_rokakup11" , "","yn_rokakup11","1",m_rokaku_options[YN_ROKAKUP11]);
    rcreateTextBox("#td2_13f1", "rokakup_cd11" , "カード名:",m_rokaku_options[ROKAKUP_CD11],'15','150px',false);
    rcreateSpan("#td2_13f1", " | ");
    rcreateSelectBox("#td2_13f1", "rokakup_cst11" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST11],selectValues5);
    rcreateSpan("#td2_13f1", " | ");
    rcreateSelectBox("#td2_13f1", "rokakup_lbl11" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL11],selectValues3);
    rcreateSpan("#td2_13f1", " | ");
    rcreateCheckBox("#td2_13f1", "yn_usekei11" , "傾国使用","yn_usekei11","1",m_rokaku_options[YN_USEKEI11]);
    rcreateCheckBox("#td2_13g1", "yn_rokakup12" , "","yn_rokakup12","1",m_rokaku_options[YN_ROKAKUP12]);
    rcreateTextBox("#td2_13g1", "rokakup_cd12" , "カード名:",m_rokaku_options[ROKAKUP_CD12],'15','150px',false);
    rcreateSpan("#td2_13g1", " | ");
    rcreateSelectBox("#td2_13g1", "rokakup_cst12" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST12],selectValues5);
    rcreateSpan("#td2_13g1", " | ");
    rcreateSelectBox("#td2_13g1", "rokakup_lbl12" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL12],selectValues3);
    rcreateSpan("#td2_13g1", " | ");
    rcreateCheckBox("#td2_13g1", "yn_usekei12" , "傾国使用","yn_usekei12","1",m_rokaku_options[YN_USEKEI12]);
    rcreateCheckBox("#td2_13h1", "yn_rokakup13" , "","yn_rokakup13","1",m_rokaku_options[YN_ROKAKUP13]);
    rcreateTextBox("#td2_13h1", "rokakup_cd13" , "カード名:",m_rokaku_options[ROKAKUP_CD13],'15','150px',false);
    rcreateSpan("#td2_13h1", " | ");
    rcreateSelectBox("#td2_13h1", "rokakup_cst13" , "コスト:","select2",m_rokaku_options[ROKAKUP_CST13],selectValues5);
    rcreateSpan("#td2_13h1", " | ");
    rcreateSelectBox("#td2_13h1", "rokakup_lbl13" , "ラベル:","select2",m_rokaku_options[ROKAKUP_LBL13],selectValues3);
    rcreateSpan("#td2_13h1", " | ");
    rcreateCheckBox("#td2_13h1", "yn_usekei13" , "傾国使用","yn_usekei13","1",m_rokaku_options[YN_USEKEI13]);
    rcreateCheckBox("#td2_161", "yn_rkpjin" , "HPが","yn_rkpjin","1",m_rokaku_options[YN_RKPJIN]);
    rcreateTextBox("#td2_161", "rkpjinhp" , "", m_rokaku_options[RKPJINHP],'3','30px',false);
    rcreateSpan("#td2_161", "以下なら仁君的なカードを使用する");
    rcreateSpan("#td2_171", "使用する仁君的回復スキル(デッキのHP回復処理使用)※上の方が優先順位高");
    rcreateSpan("#td2_181", "使用する");
    rcreateSelectListBox("#td2_291","recskil2","setrecskil", "13", m_rokaku_options[RECSKIL2]);
    rcreateButton("#td2_292", "btn_up2", "▲", "rbtn_a");
    rcreateButton("#td2_292", "btn_down2", "▼", "rbtn_a");
    rcreateButton("#td2_292", "btn_right2", ">>", "rbtn_a");
    rcreateButton("#td2_292", "btn_left2", "<<", "rbtn_a");
    rcreateSpan("#td2_183", "使用しない");
    rcreateSelectListBox("#td2_293","unrecskil2","setrecskil", "13", m_rokaku_options[UNRECSKIL2]);
    rcreateSpan("#td2_191", "乗せたい全軍系カード ※同じラベルに同じ名前のカードがあれば、どちらが選択されるか運次第");
    rcreateCheckBox("#td2_201", "yn_rokakupzen1" , "","yn_rokakupzen1","1",m_rokaku_options[YN_ROKAKUPZEN1]);
    rcreateTextBox("#td2_201", "rokakup_zancd1" , "カード名:", m_rokaku_options[ROKAKUP_ZANCD1],'15','150px',false);
    rcreateSpan("#td2_201", "| ");
    rcreateSelectBox("#td2_201", "rokakup_zancst1" , "コスト:","select2",m_rokaku_options[ROKAKUP_ZANCST1],selectValues5);
    rcreateSpan("#td2_201", " | ");
    rcreateSelectBox("#td2_201", "rokakup_zanlbl1" , "ラベル:","select2", m_rokaku_options[ROKAKUP_ZANLBL1],selectValues3);
    rcreateCheckBox("#td2_211", "yn_rokakupzen2" , "","yn_rokakupzen2","1",m_rokaku_options[YN_ROKAKUPZEN2]);
    rcreateTextBox("#td2_211", "rokakup_zancd2" , "カード名:",m_rokaku_options[ROKAKUP_ZANCD2],'15','150px',false);
    rcreateSpan("#td2_211", "| ");
    rcreateSelectBox("#td2_211", "rokakup_zancst2" , "コスト:","select2",m_rokaku_options[ROKAKUP_ZANCST2],selectValues5);
    rcreateSpan("#td2_211", " | ");
    rcreateSelectBox("#td2_211", "rokakup_zanlbl2" , "ラベル:","select2",m_rokaku_options[ROKAKUP_ZANLBL2],selectValues3);
    rcreateCheckBox("#td2_221", "yn_rokakupzen3" , "","yn_rokakupzen3","1",m_rokaku_options[YN_ROKAKUPZEN3]);
    rcreateTextBox("#td2_221", "rokakup_zancd3" , "カード名:",m_rokaku_options[ROKAKUP_ZANCD3],'15','150px',false);
    rcreateSpan("#td2_221", "| ");
    rcreateSelectBox("#td2_221", "rokakup_zancst3" , "コスト:","select2",m_rokaku_options[ROKAKUP_ZANCST3],selectValues5);
    rcreateSpan("#td2_221", " | ");
    rcreateSelectBox("#td2_221", "rokakup_zanlbl3" , "ラベル:","select2",m_rokaku_options[ROKAKUP_ZANLBL3],selectValues3);
    rcreateCheckBox("#td2_22a1", "yn_rokakupzen4" , "","yn_rokakupzen4","1",m_rokaku_options[YN_ROKAKUPZEN4]);
    rcreateTextBox("#td2_22a1", "rokakup_zancd4" , "カード名:",m_rokaku_options[ROKAKUP_ZANCD4],'15','150px',false);
    rcreateSpan("#td2_22a1", "| ");
    rcreateSelectBox("#td2_22a1", "rokakup_zancst4" , "コスト:","select2",m_rokaku_options[ROKAKUP_ZANCST4],selectValues5);
    rcreateSpan("#td2_22a1", " | ");
    rcreateSelectBox("#td2_22a1", "rokakup_zanlbl4" , "ラベル:","select2",m_rokaku_options[ROKAKUP_ZANLBL4],selectValues3);
    rcreateCheckBox("#td2_22b1", "yn_rokakupzen5" , "","yn_rokakupzen5","1",m_rokaku_options[YN_ROKAKUPZEN5]);
    rcreateTextBox("#td2_22b1", "rokakup_zancd5" , "カード名:",m_rokaku_options[ROKAKUP_ZANCD5],'15','150px',false);
    rcreateSpan("#td2_22b1", "| ");
    rcreateSelectBox("#td2_22b1", "rokakup_zancst5" , "コスト:","select2",m_rokaku_options[ROKAKUP_ZANCST5],selectValues5);
    rcreateSpan("#td2_22b1", " | ");
    rcreateSelectBox("#td2_22b1", "rokakup_zanlbl5" , "ラベル:","select2",m_rokaku_options[ROKAKUP_ZANLBL5],selectValues3);
    rcreateSpan("#td2_231", "※全軍を乗せられなければ出兵しません");
    rcreateCheckBox("#td2_301", "yn_jinkikan" , "待機中のみに効果のある回復スキルは","yn_jinkikan","1",m_rokaku_options[YN_JINKIKAN]);
    rcreateTextBox("#td2_301", "rkpjinkikan" , "帰還時間が", m_rokaku_options[RKPJINKIKAN],'4','30px',false);
    rcreateSpan("#td2_301", "秒以上ならスキルを使用する");
    rcreateButton("#td2_281", "saveSetWindow2", "設定を保存", "rbtn_c");
    rcreateButton("#td2_281", "inittabSetWindow2", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td2_281", "initSetWindow2", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td2_281", "closeSetWindow2", "閉じる", "rbtn_c");
    rkkcreatetitle("#td2_281");
}

function rokaku_setting3() {
    var table4 = j$("<table>");
    j$( "#rokaku_tabs-5" ).append(table4);
    j$(table4).
        append(j$("<tr><td colspan='2' id=td3_11></td></tr>\
                <tr><td colspan='2' id=td3_21></td></tr>\
                <tr><td class=ctd0></td><td id=td3_31></td></tr>\
                <tr><td class=ctd0></td><td id=td3_41></td></tr>\
                <tr><td class=ctd0></td><td id=td3_51></td></tr>\
                <tr><td class=ctd0></td><td id=td3_61></td></tr>\
                <tr><td class=ctd0></td><td id=td3_71></td></tr>\
                <tr><td class=ctd0></td><td id=td3_81></td></tr>\
                <tr><td colspan='2' id=td3_91></td></tr>\
                <tr><td colspan='2' id=td3_91a></td></tr>\
                <tr><td colspan='2' id=td3_101></td></tr>\
                <tr><td class=ctd0></td><td id=td3_111></td></tr>\
                <tr><td class=ctd0></td><td id=td3_121 style='padding-top:5px;padding-bottom:5px;color: #ff0000;'></td></tr>\
                <tr><td class=ctd0></td><td id=td3_131 style='padding-bottom:10px;'></td></tr>\
                <tr><td colspan='2' id=td3_141></td></tr>\
                <tr><td class=ctd0></td><td id=td3_151></td></tr>\
                <tr><td class=ctd0></td><td id=td3_161></td></tr>\
                <tr><td class=ctd0></td><td id=td3_171></td></tr>\
                <tr><td class=ctd0></td><td id=td3_181></td></tr>\
                <tr><td class=ctd0></td><td id=td3_191></td></tr>\
                <tr><td class=ctd0></td><td id=td3_201></td></tr>\
                <tr><td class=ctd0></td><td id=td3_211></td></tr>\
                <tr><td class=ctd0></td><td id=td3_221></td></tr>\
                <tr><td class=ctd0></td><td id=td3_231></td></tr>\
                <tr><td class=ctd0></td><td id=td3_241></td></tr>\
                <tr><td class=ctd0></td><td id=td3_251></td></tr>\
                <tr><td class=ctd0></td><td id=td3_261></td></tr>\
                <tr><td class=ctd0></td><td id=td3_271></td></tr>\
                <tr><td class=ctd0></td><td id=td3_281></td></tr>\
                <tr><td class=ctd0></td><td id=td3_291></td></tr>\
                <tr><td colspan='2' id=td3_391 class=ctdb></td></tr>\
    "));
    rcreateSpan("#td3_11", "デッキ入替予約設定");
    rcreateSpan("#td3_21", "<前提条件>");
    rcreateSpan("#td3_31", "・デッキに設定されているカードは全部下します(内政設定されているカードも全て)");
    rcreateSpan("#td3_41", "・出兵中のカードが存在する場合は戻ってきたら下します");
    rcreateSpan("#td3_51", "・ファイルは小60枚設定のみ動作します。また、ラベル未設定のカードは対応してません。");
    rcreateSpan("#td3_61", "・神医は使用しないので設定されているカードはHP100にしておくこと");
    rcreateSpan("#td3_71", "・設定されているカードは上から順に乗せます");
    rcreateSpan("#td3_81", "・ログアウトやWindowsアップデートによる再起動には各自注意");
    rcreateSpan("#td3_91", "================================================================");
    rcreateSelectBox("#td3_91a", "rkk_res_vil" , "セット拠点：","select1", m_rokaku_options[RKK_RES_VIL] ,selectValues2);
    rcreateSpan("#td3_101", "日時設定(24時間表記・半角数字で入力)");
    rcreateTextBox("#td3_111", "rkk_res_mon" , "",m_rokaku_options[RKK_RES_MON],'2','20px',false);
    rcreateTextBox("#td3_111", "rkk_res_day" , "月 ",m_rokaku_options[RKK_RES_DAY],'2','20px',false);
    rcreateTextBox("#td3_111", "rkk_res_hour" , "日 ",m_rokaku_options[RKK_RES_HOUR],'2','20px',false);
    rcreateTextBox("#td3_111", "rkk_res_min" , "時 ",m_rokaku_options[RKK_RES_MIN],'2','20px',false);
    rcreateSpan("#td3_111", "分");
    rcreateSpan("#td3_121", "予約日時:");
    rcreateButton("#td3_131", "rkk_res_setbtn", "予約設定", "rbtn_c");
    rcreateButton("#td3_131", "rkk_res_resetbtn", "予約リセット", "rbtn_c");
    rcreateSpan("#td3_141", "カード設定(ID取得するのでファイルから選択すること)");
    rcreateCheckBox("#td3_151", "rkk_yn_res1" , "","rkk_yn_res1","1",m_rokaku_options[RKK_YN_RES1]);
    rcreateTextBox("#td3_151", "rkk_rescd1" , "01:",m_rokaku_options[RKK_RESCD1],'100','100px',true);       //カード名
    rcreateSpan("#td3_151", "| ");
    rcreateTextBox("#td3_151", "rkk_rescdid1" , "ID:",m_rokaku_options[RKK_RESCDID1],'10','80px',true);     //カードID
    rcreateSpan("#td3_151", "| ");
    rcreateSelectBox("#td3_151", "rkk_reslbl1" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL1],selectValues3); //ラベル
    rcreateSpan("#td3_151", "| ");
    rcreateSelectBox("#td3_151", "rkk_rescst1" , "コスト:","select2",m_rokaku_options[RKK_RESCST1],selectValues5); //コスト
    rcreateSpan("#td3_151", "| ");
    rcreateTextBox("#td3_151", "rkk_resskl1" , " 発動スキル:",m_rokaku_options[RKK_RESSKL1],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_161", "rkk_yn_res2" , "","rkk_yn_res2","1",m_rokaku_options[RKK_YN_RES2]);
    rcreateTextBox("#td3_161", "rkk_rescd2" , "02:",m_rokaku_options[RKK_RESCD2],'100','100px',true);       //カード名
    rcreateSpan("#td3_161", "| ");
    rcreateTextBox("#td3_161", "rkk_rescdid2" , "ID:",m_rokaku_options[RKK_RESCDID2],'10','80px',true);     //カードID
    rcreateSpan("#td3_161", "| ");
    rcreateSelectBox("#td3_161", "rkk_reslbl2" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL2],selectValues3); //ラベル
    rcreateSpan("#td3_161", "| ");
    rcreateSelectBox("#td3_161", "rkk_rescst2" , "コスト:","select2",m_rokaku_options[RKK_RESCST2],selectValues5); //コスト
    rcreateSpan("#td3_161", "| ");
    rcreateTextBox("#td3_161", "rkk_resskl2" , " 発動スキル:",m_rokaku_options[RKK_RESSKL2],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_171", "rkk_yn_res3" , "","rkk_yn_res3","1",m_rokaku_options[RKK_YN_RES3]);
    rcreateTextBox("#td3_171", "rkk_rescd3" , "03:",m_rokaku_options[RKK_RESCD3],'100','100px',true);       //カード名
    rcreateSpan("#td3_171", "| ");
    rcreateTextBox("#td3_171", "rkk_rescdid3" , "ID:",m_rokaku_options[RKK_RESCDID3],'10','80px',true);     //カードID
    rcreateSpan("#td3_171", "| ");
    rcreateSelectBox("#td3_171", "rkk_reslbl3" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL3],selectValues3); //ラベル
    rcreateSpan("#td3_171", "| ");
    rcreateSelectBox("#td3_171", "rkk_rescst3" , "コスト:","select2",m_rokaku_options[RKK_RESCST3],selectValues5); //コスト
    rcreateSpan("#td3_171", "| ");
    rcreateTextBox("#td3_171", "rkk_resskl3" , " 発動スキル:",m_rokaku_options[RKK_RESSKL3],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_181", "rkk_yn_res4" , "","rkk_yn_res4","1",m_rokaku_options[RKK_YN_RES4]);
    rcreateTextBox("#td3_181", "rkk_rescd4" , "04:",m_rokaku_options[RKK_RESCD4],'100','100px',true);       //カード名
    rcreateSpan("#td3_181", "| ");
    rcreateTextBox("#td3_181", "rkk_rescdid4" , "ID:",m_rokaku_options[RKK_RESCDID4],'10','80px',true);     //カードID
    rcreateSpan("#td3_181", "| ");
    rcreateSelectBox("#td3_181", "rkk_reslbl4" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL4],selectValues3); //ラベル
    rcreateSpan("#td3_181", "| ");
    rcreateSelectBox("#td3_181", "rkk_rescst4" , "コスト:","select2",m_rokaku_options[RKK_RESCST4],selectValues5); //コスト
    rcreateSpan("#td3_181", "| ");
    rcreateTextBox("#td3_181", "rkk_resskl4" , " 発動スキル:",m_rokaku_options[RKK_RESSKL4],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_191", "rkk_yn_res5" , "","rkk_yn_res5","1",m_rokaku_options[RKK_YN_RES5]);
    rcreateTextBox("#td3_191", "rkk_rescd5" , "05:",m_rokaku_options[RKK_RESCD5],'100','100px',true);       //カード名
    rcreateSpan("#td3_191", "| ");
    rcreateTextBox("#td3_191", "rkk_rescdid5" , "ID:",m_rokaku_options[RKK_RESCDID5],'10','80px',true);     //カードID
    rcreateSpan("#td3_191", "| ");
    rcreateSelectBox("#td3_191", "rkk_reslbl5" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL5],selectValues3); //ラベル
    rcreateSpan("#td3_191", "| ");
    rcreateSelectBox("#td3_191", "rkk_rescst5" , "コスト:","select2",m_rokaku_options[RKK_RESCST5],selectValues5); //コスト
    rcreateSpan("#td3_191", "| ");
    rcreateTextBox("#td3_191", "rkk_resskl5" , " 発動スキル:",m_rokaku_options[RKK_RESSKL5],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_201", "rkk_yn_res6" , "","rkk_yn_res6","1",m_rokaku_options[RKK_YN_RES6]);
    rcreateTextBox("#td3_201", "rkk_rescd6" , "06:",m_rokaku_options[RKK_RESCD6],'100','100px',true);       //カード名
    rcreateSpan("#td3_201", "| ");
    rcreateTextBox("#td3_201", "rkk_rescdid6" , "ID:",m_rokaku_options[RKK_RESCDID6],'10','80px',true);     //カードID
    rcreateSpan("#td3_201", "| ");
    rcreateSelectBox("#td3_201", "rkk_reslbl6" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL6],selectValues3); //ラベル
    rcreateSpan("#td3_201", "| ");
    rcreateSelectBox("#td3_201", "rkk_rescst6" , "コスト:","select2",m_rokaku_options[RKK_RESCST6],selectValues5); //コスト
    rcreateSpan("#td3_201", "| ");
    rcreateTextBox("#td3_201", "rkk_resskl6" , " 発動スキル:",m_rokaku_options[RKK_RESSKL6],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_211", "rkk_yn_res7" , "","rkk_yn_res7","1",m_rokaku_options[RKK_YN_RES7]);
    rcreateTextBox("#td3_211", "rkk_rescd7" , "07:",m_rokaku_options[RKK_RESCD7],'100','100px',true);       //カード名
    rcreateSpan("#td3_211", "| ");
    rcreateTextBox("#td3_211", "rkk_rescdid7" , "ID:",m_rokaku_options[RKK_RESCDID7],'10','80px',true);     //カードID
    rcreateSpan("#td3_211", "| ");
    rcreateSelectBox("#td3_211", "rkk_reslbl7" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL7],selectValues3); //ラベル
    rcreateSpan("#td3_211", "| ");
    rcreateSelectBox("#td3_211", "rkk_rescst7" , "コスト:","select2",m_rokaku_options[RKK_RESCST7],selectValues5); //コスト
    rcreateSpan("#td3_211", "| ");
    rcreateTextBox("#td3_211", "rkk_resskl7" , " 発動スキル:",m_rokaku_options[RKK_RESSKL7],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_221", "rkk_yn_res8" , "","rkk_yn_res8","1",m_rokaku_options[RKK_YN_RES8]);
    rcreateTextBox("#td3_221", "rkk_rescd8" , "08:",m_rokaku_options[RKK_RESCD8],'100','100px',true);       //カード名
    rcreateSpan("#td3_221", "| ");
    rcreateTextBox("#td3_221", "rkk_rescdid8" , "ID:",m_rokaku_options[RKK_RESCDID8],'10','80px',true);     //カードID
    rcreateSpan("#td3_221", "| ");
    rcreateSelectBox("#td3_221", "rkk_reslbl8" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL8],selectValues3); //ラベル
    rcreateSpan("#td3_221", "| ");
    rcreateSelectBox("#td3_221", "rkk_rescst8" , "コスト:","select2",m_rokaku_options[RKK_RESCST8],selectValues5); //コスト
    rcreateSpan("#td3_221", "| ");
    rcreateTextBox("#td3_221", "rkk_resskl8" , " 発動スキル:",m_rokaku_options[RKK_RESSKL8],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_231", "rkk_yn_res9" , "","rkk_yn_res9","1",m_rokaku_options[RKK_YN_RES9]);
    rcreateTextBox("#td3_231", "rkk_rescd9" , "09:",m_rokaku_options[RKK_RESCD9],'100','100px',true);       //カード名
    rcreateSpan("#td3_231", "| ");
    rcreateTextBox("#td3_231", "rkk_rescdid9" , "ID:",m_rokaku_options[RKK_RESCDID9],'10','80px',true);     //カードID
    rcreateSpan("#td3_231", "| ");
    rcreateSelectBox("#td3_231", "rkk_reslbl9" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL9],selectValues3); //ラベル
    rcreateSpan("#td3_231", "| ");
    rcreateSelectBox("#td3_231", "rkk_rescst9" , "コスト:","select2",m_rokaku_options[RKK_RESCST9],selectValues5); //コスト
    rcreateSpan("#td3_231", "| ");
    rcreateTextBox("#td3_231", "rkk_resskl9" , " 発動スキル:",m_rokaku_options[RKK_RESSKL9],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_241", "rkk_yn_res10" , "","rkk_yn_res10","1",m_rokaku_options[RKK_YN_RES10]);
    rcreateTextBox("#td3_241", "rkk_rescd10" , "10:",m_rokaku_options[RKK_RESCD10],'100','100px',true);       //カード名
    rcreateSpan("#td3_241", "| ");
    rcreateTextBox("#td3_241", "rkk_rescdid10" , "ID:",m_rokaku_options[RKK_RESCDID10],'10','80px',true);     //カードID
    rcreateSpan("#td3_241", "| ");
    rcreateSelectBox("#td3_241", "rkk_reslbl10" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL10],selectValues3); //ラベル
    rcreateSpan("#td3_241", "| ");
    rcreateSelectBox("#td3_241", "rkk_rescst10" , "コスト:","select2",m_rokaku_options[RKK_RESCST10],selectValues5); //コスト
    rcreateSpan("#td3_241", "| ");
    rcreateTextBox("#td3_241", "rkk_resskl10" , " 発動スキル:",m_rokaku_options[RKK_RESSKL10],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_251", "rkk_yn_res11" , "","rkk_yn_res11","1",m_rokaku_options[RKK_YN_RES11]);
    rcreateTextBox("#td3_251", "rkk_rescd11" , "11:",m_rokaku_options[RKK_RESCD11],'100','100px',true);       //カード名
    rcreateSpan("#td3_251", "| ");
    rcreateTextBox("#td3_251", "rkk_rescdid11" , "ID:",m_rokaku_options[RKK_RESCDID11],'10','80px',true);     //カードID
    rcreateSpan("#td3_251", "| ");
    rcreateSelectBox("#td3_251", "rkk_reslbl11" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL11],selectValues3); //ラベル
    rcreateSpan("#td3_251", "| ");
    rcreateSelectBox("#td3_251", "rkk_rescst11" , "コスト:","select2",m_rokaku_options[RKK_RESCST11],selectValues5); //コスト
    rcreateSpan("#td3_251", "| ");
    rcreateTextBox("#td3_251", "rkk_resskl11" , " 発動スキル:",m_rokaku_options[RKK_RESSKL11],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_261", "rkk_yn_res12" , "","rkk_yn_res12","1",m_rokaku_options[RKK_YN_RES12]);
    rcreateTextBox("#td3_261", "rkk_rescd12" , "12:",m_rokaku_options[RKK_RESCD12],'100','100px',true);       //カード名
    rcreateSpan("#td3_261", "| ");
    rcreateTextBox("#td3_261", "rkk_rescdid12" , "ID:",m_rokaku_options[RKK_RESCDID12],'10','80px',true);     //カードID
    rcreateSpan("#td3_261", "| ");
    rcreateSelectBox("#td3_261", "rkk_reslbl12" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL12],selectValues3); //ラベル
    rcreateSpan("#td3_261", "| ");
    rcreateSelectBox("#td3_261", "rkk_rescst12" , "コスト:","select2",m_rokaku_options[RKK_RESCST12],selectValues5); //コスト
    rcreateSpan("#td3_261", "| ");
    rcreateTextBox("#td3_261", "rkk_resskl12" , " 発動スキル:",m_rokaku_options[RKK_RESSKL12],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_271", "rkk_yn_res13" , "","rkk_yn_res13","1",m_rokaku_options[RKK_YN_RES13]);
    rcreateTextBox("#td3_271", "rkk_rescd13" , "13:",m_rokaku_options[RKK_RESCD13],'100','100px',true);       //カード名
    rcreateSpan("#td3_271", "| ");
    rcreateTextBox("#td3_271", "rkk_rescdid13" , "ID:",m_rokaku_options[RKK_RESCDID13],'10','80px',true);     //カードID
    rcreateSpan("#td3_271", "| ");
    rcreateSelectBox("#td3_271", "rkk_reslbl13" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL13],selectValues3); //ラベル
    rcreateSpan("#td3_271", "| ");
    rcreateSelectBox("#td3_271", "rkk_rescst13" , "コスト:","select2",m_rokaku_options[RKK_RESCST13],selectValues5); //コスト
    rcreateSpan("#td3_271", "| ");
    rcreateTextBox("#td3_271", "rkk_resskl13" , " 発動スキル:",m_rokaku_options[RKK_RESSKL13],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_281", "rkk_yn_res14" , "","rkk_yn_res14","1",m_rokaku_options[RKK_YN_RES14]);
    rcreateTextBox("#td3_281", "rkk_rescd14" , "14:",m_rokaku_options[RKK_RESCD14],'100','100px',true);       //カード名
    rcreateSpan("#td3_281", "| ");
    rcreateTextBox("#td3_281", "rkk_rescdid14" , "ID:",m_rokaku_options[RKK_RESCDID14],'10','80px',true);     //カードID
    rcreateSpan("#td3_281", "| ");
    rcreateSelectBox("#td3_281", "rkk_reslbl14" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL14],selectValues3); //ラベル
    rcreateSpan("#td3_281", "| ");
    rcreateSelectBox("#td3_281", "rkk_rescst14" , "コスト:","select2",m_rokaku_options[RKK_RESCST14],selectValues5); //コスト
    rcreateSpan("#td3_281", "| ");
    rcreateTextBox("#td3_281", "rkk_resskl14" , " 発動スキル:",m_rokaku_options[RKK_RESSKL14],'10','100px',false);   //スキル
    rcreateCheckBox("#td3_291", "rkk_yn_res15" , "","rkk_yn_res15","1",m_rokaku_options[RKK_YN_RES15]);
    rcreateTextBox("#td3_291", "rkk_rescd15" , "15:",m_rokaku_options[RKK_RESCD15],'100','100px',true);       //カード名
    rcreateSpan("#td3_291", "| ");
    rcreateTextBox("#td3_291", "rkk_rescdid15" , "ID:",m_rokaku_options[RKK_RESCDID15],'10','80px',true);     //カードID
    rcreateSpan("#td3_291", "| ");
    rcreateSelectBox("#td3_291", "rkk_reslbl15" , "ラベル:","select2",m_rokaku_options[RKK_RESLBL15],selectValues3); //ラベル
    rcreateSpan("#td3_291", "| ");
    rcreateSelectBox("#td3_291", "rkk_rescst15" , "コスト:","select2",m_rokaku_options[RKK_RESCST15],selectValues5); //コスト
    rcreateSpan("#td3_291", "| ");
    rcreateTextBox("#td3_291", "rkk_resskl15" , " 発動スキル:",m_rokaku_options[RKK_RESSKL15],'10','100px',false);   //スキル

    rcreateButton("#td3_391", "saveSetWindow3", "設定を保存", "rbtn_c");
    rcreateButton("#td3_391", "inittabSetWindow3", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td3_391", "initSetWindow3", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td3_391", "closeSetWindow3", "閉じる", "rbtn_c");
    rkkcreatetitle("#td3_391");

    //拠点プルダウン設定
    var lists = rloadData(GM_KEY+"VillageList", "[]", true);
    var plist ;
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#rkk_res_vil").append(plist);
    }
    var l_restimeVal =GM_getValue(GM_KEY + '_restimeValue', "");
    if (l_restimeVal!=""){
        var l_resflg=GM_getValue(GM_KEY + '_resfun', 0);
        var l_ressts="";
        if (l_resflg==false){
            var l_restime=GM_getValue(GM_KEY + '_restime', "");
            if (l_restime!=""){
                var dt = new Date();
                var diff=l_restime-dt.getTime();
                var hour = diff/(1000*60*60);
                l_ressts="(約" + hour.toFixed(1) + "時間後予約)"
            }
        } else {
            l_ressts="(実行済)"
        }
        j$("#td3_121").text("予約日時:"+l_restimeVal+l_ressts);
    }
}

function rokaku_setting4() {
    var table5 = j$("<table>");
    j$("#rokaku_tabs-8").append(table5);
    j$(table5).
        append(j$("<tr><td colspan='3' id=td4_11></td></tr>\
                <tr><td class=ctd0></td><td id=td4_21 colspan='2'></td></tr>\
                <tr><td colspan='3' id=td4_201 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td4_11", "設定のエクスポート／インポート");
    rcreateTextArea("#td4_21", "rexparea", '40','90', false);
    rcreateButton("#td4_201", "rexpbtn", "エクスポート", "rbtn_c");
    rcreateButton("#td4_201", "rimpbtn", "インポート", "rbtn_c");
    rcreateButton("#td4_201", "saveSetWindow4", "設定を保存", "rbtn_c");
    rcreateButton("#td4_201", "closeSetWindow4", "閉じる", "rbtn_c");
    rkkcreatetitle("#td4_201");
}

function rokaku_setting5() {
    var table6 = j$("<table>");
    j$("#rokaku_tabs-9").append(table6);
    j$(table6).
        append(j$("<tr><td colspan='3' id=td5_11 style='font-size:12px;margin:2px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td5_11a></td></tr>\
                <tr><td class=ctd0></td><td id=td5_21></td></tr>\
                <tr><td colspan='3' id=td5_201 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td5_11", "直近のログ    ");
    rcreateTextBox("#td5_11a", "logcount" , " ログ件数:",m_rokaku_options[LOGCOUNT],'4','40px',false);
    rcreateCheckBox("#td5_11a", "debugflg" , "詳細出力","debugflg","1",m_rokaku_options[DEBUGFLG]);
    rcreateTextArea("#td5_21", "rlogarea",'40','75', false);
    rcreateButton("#td5_201", "saveSetWindow5", "設定を保存", "rbtn_c");
    rcreateButton("#td5_201", "closeSetWindow5", "閉じる", "rbtn_c");
    rkkcreatetitle("#td5_201");

}

function rokaku_setting6() {
    var table7 = j$("<table>");
    j$("#rokaku_tabs-2").append(table7);
    j$(table7).
        append(j$("<tr><td colspan='3' id=td6_11 style='font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_21 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_31 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_41 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_51 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_61 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_71 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_81 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_91 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_101 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_111 colspan='2'></td></tr>\
                <tr><td colspan='3' id=td6_121 style='padding-top:5px;font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_131 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_141 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_151 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_161 colspan='2'></td></tr>\
                <tr><td colspan='3' id=td6_171 style='font-size:12px;font-weight:bold;padding-top:5px'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_181 colspan='2'></td></tr>\
                <tr><td class=ctd0></td><td id=td6_191 colspan='2'></td></tr>\
                <tr><td colspan='3' id=td6_301 style='padding-bottom:5px;font-size:12px;margin:2px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td colspan='3' id=td6_311></td></tr>\
                <tr><td class=ctd0></td><td colspan='2'><table>\
                <tr style='text-align: center;'><td id=td6_321></td><td id=td6_322></td><td id=td6_323></td><td id=td6_324></td></tr>\
                </table></td></tr>\
                <tr><td colspan='3' id=td6_331></td></tr>\
                <tr><td class=ctd0></td><td colspan='2'><table>\
                <tr style='text-align: center;'><td id=td6_341></td><td id=td6_342></td><td id=td6_343></td><td id=td6_344></td></tr>\
                </table></td></tr>\
                <tr><td colspan='3' id=td6_201 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td6_11", "出兵先指定  ※出兵するカード名から出兵先を指定します。");
    rcreateCheckBox("#td6_21", "yn_decarea1" , "","yn_decarea1","1",m_rokaku_options[YN_DECAREA1]);
    rcreateTextBox("#td6_21", "decareacd1" , "カード名01:", m_rokaku_options[DECAREACD1],'15','150px',false);
    rcreateSpan("#td6_21", "| ");
    rcreateTextBox("#td6_21", "decarea1_x" , "出兵座標：(",m_rokaku_options[DECAREA1_X],'4','30px',false);
    rcreateTextBox("#td6_21", "decarea1_y" , ",",m_rokaku_options[DECAREA1_Y],'4','30px',false);
    rcreateSpan("#td6_21", ")|");
    rcreateTextBox("#td6_21", "decnote1" , "memo:", m_rokaku_options[DECNOTE1],'15','150px',false);
    rcreateCheckBox("#td6_31", "yn_decarea2" , "","yn_decarea2","1",m_rokaku_options[YN_DECAREA2]);
    rcreateTextBox("#td6_31", "decareacd2" , "カード名02:", m_rokaku_options[DECAREACD2],'15','150px',false);
    rcreateSpan("#td6_31", "| ");
    rcreateTextBox("#td6_31", "decarea2_x" , "出兵座標：(",m_rokaku_options[DECAREA2_X],'4','30px',false);
    rcreateTextBox("#td6_31", "decarea2_y" , ",",m_rokaku_options[DECAREA2_Y],'4','30px',false);
    rcreateSpan("#td6_31", ")|");
    rcreateTextBox("#td6_31", "decnote2" , "memo:", m_rokaku_options[DECNOTE2],'15','150px',false);
    rcreateCheckBox("#td6_41", "yn_decarea3" , "","yn_decarea3","1",m_rokaku_options[YN_DECAREA3]);
    rcreateTextBox("#td6_41", "decareacd3" , "カード名03:", m_rokaku_options[DECAREACD3],'15','150px',false);
    rcreateSpan("#td6_41", "| ");
    rcreateTextBox("#td6_41", "decarea3_x" , "出兵座標：(",m_rokaku_options[DECAREA3_X],'4','30px',false);
    rcreateTextBox("#td6_41", "decarea3_y" , ",",m_rokaku_options[DECAREA3_Y],'4','30px',false);
    rcreateSpan("#td6_41", ")|");
    rcreateTextBox("#td6_41", "decnote3" , "memo:", m_rokaku_options[DECNOTE3],'15','150px',false);
    rcreateCheckBox("#td6_51", "yn_decarea4" , "","yn_decarea4","1",m_rokaku_options[YN_DECAREA4]);
    rcreateTextBox("#td6_51", "decareacd4" , "カード名04:", m_rokaku_options[DECAREACD4],'15','150px',false);
    rcreateSpan("#td6_51", "| ");
    rcreateTextBox("#td6_51", "decarea4_x" , "出兵座標：(",m_rokaku_options[DECAREA4_X],'4','30px',false);
    rcreateTextBox("#td6_51", "decarea4_y" , ",",m_rokaku_options[DECAREA4_Y],'4','30px',false);
    rcreateSpan("#td6_51", ")|");
    rcreateTextBox("#td6_51", "decnote4" , "memo:", m_rokaku_options[DECNOTE4],'15','150px',false);
    rcreateCheckBox("#td6_61", "yn_decarea5" , "","yn_decarea5","1",m_rokaku_options[YN_DECAREA5]);
    rcreateTextBox("#td6_61", "decareacd5" , "カード名05:", m_rokaku_options[DECAREACD5],'15','150px',false);
    rcreateSpan("#td6_61", "| ");
    rcreateTextBox("#td6_61", "decarea5_x" , "出兵座標：(",m_rokaku_options[DECAREA5_X],'4','30px',false);
    rcreateTextBox("#td6_61", "decarea5_y" , ",",m_rokaku_options[DECAREA5_Y],'4','30px',false);
    rcreateSpan("#td6_61", ")|");
    rcreateTextBox("#td6_61", "decnote5" , "memo:", m_rokaku_options[DECNOTE5],'15','150px',false);
    rcreateCheckBox("#td6_71", "yn_decarea6" , "","yn_decarea6","1",m_rokaku_options[YN_DECAREA6]);
    rcreateTextBox("#td6_71", "decareacd6" , "カード名06:", m_rokaku_options[DECAREACD6],'15','150px',false);
    rcreateSpan("#td6_71", "| ");
    rcreateTextBox("#td6_71", "decarea6_x" , "出兵座標：(",m_rokaku_options[DECAREA6_X],'4','30px',false);
    rcreateTextBox("#td6_71", "decarea6_y" , ",",m_rokaku_options[DECAREA6_Y],'4','30px',false);
    rcreateSpan("#td6_71", ")|");
    rcreateTextBox("#td6_71", "decnote6" , "memo:", m_rokaku_options[DECNOTE6],'15','150px',false);
    rcreateCheckBox("#td6_81", "yn_decarea7" , "","yn_decarea7","1",m_rokaku_options[YN_DECAREA7]);
    rcreateTextBox("#td6_81", "decareacd7" , "カード名07:", m_rokaku_options[DECAREACD7],'15','150px',false);
    rcreateSpan("#td6_81", "| ");
    rcreateTextBox("#td6_81", "decarea7_x" , "出兵座標：(",m_rokaku_options[DECAREA7_X],'4','30px',false);
    rcreateTextBox("#td6_81", "decarea7_y" , ",",m_rokaku_options[DECAREA7_Y],'4','30px',false);
    rcreateSpan("#td6_81", ")|");
    rcreateTextBox("#td6_81", "decnote7" , "memo:", m_rokaku_options[DECNOTE7],'15','150px',false);
    rcreateCheckBox("#td6_91", "yn_decarea8" , "","yn_decarea8","1",m_rokaku_options[YN_DECAREA8]);
    rcreateTextBox("#td6_91", "decareacd8" , "カード名08:", m_rokaku_options[DECAREACD8],'15','150px',false);
    rcreateSpan("#td6_91", "| ");
    rcreateTextBox("#td6_91", "decarea8_x" , "出兵座標：(",m_rokaku_options[DECAREA8_X],'4','30px',false);
    rcreateTextBox("#td6_91", "decarea8_y" , ",",m_rokaku_options[DECAREA8_Y],'4','30px',false);
    rcreateSpan("#td6_91", ")|");
    rcreateTextBox("#td6_91", "decnote8" , "memo:", m_rokaku_options[DECNOTE8],'15','150px',false);
    rcreateCheckBox("#td6_101", "yn_decarea9" , "","yn_decarea9","1",m_rokaku_options[YN_DECAREA9]);
    rcreateTextBox("#td6_101", "decareacd9" , "カード名09:", m_rokaku_options[DECAREACD9],'15','150px',false);
    rcreateSpan("#td6_101", "| ");
    rcreateTextBox("#td6_101", "decarea9_x" , "出兵座標：(",m_rokaku_options[DECAREA9_X],'4','30px',false);
    rcreateTextBox("#td6_101", "decarea9_y" , ",",m_rokaku_options[DECAREA9_Y],'4','30px',false);
    rcreateSpan("#td6_101", ")|");
    rcreateTextBox("#td6_101", "decnote9" , "memo:", m_rokaku_options[DECNOTE9],'15','150px',false);
    rcreateCheckBox("#td6_111", "yn_decarea10" , "","yn_decarea10","1",m_rokaku_options[YN_DECAREA10]);
    rcreateTextBox("#td6_111", "decareacd10" , "カード名10:", m_rokaku_options[DECAREACD10],'15','150px',false);
    rcreateSpan("#td6_111", "| ");
    rcreateTextBox("#td6_111", "decarea10_x" , "出兵座標：(",m_rokaku_options[DECAREA10_X],'4','30px',false);
    rcreateTextBox("#td6_111", "decarea10_y" , ",",m_rokaku_options[DECAREA10_Y],'4','30px',false);
    rcreateSpan("#td6_111", ")|");
    rcreateTextBox("#td6_111", "decnote10" , "memo:", m_rokaku_options[DECNOTE10],'15','150px',false);
    rcreateSpan("#td6_121", "しきい値設定  ※チェックが増えるので指定した場合さらに重くなります");
    rcreateCheckBox("#td6_131", "yn_attkchk" , "攻撃が","yn_attkchk","1",m_rokaku_options[YN_ATTKCHK]);
    rcreateTextBox("#td6_131", "attkchk" , "", m_rokaku_options[ATTKCHK],'8','80px',false);
    rcreateSpan("#td6_131", "未満なら出兵しない");
    rcreateCheckBox("#td6_141", "yn_speedchk" , "速度が","yn_speedchk","1",m_rokaku_options[YN_SPEEDCHK]);
    rcreateTextBox("#td6_141", "speedchk" , "", m_rokaku_options[SPEEDCHK],'8','80px',false);
    rcreateSpan("#td6_141", "未満なら出兵しない");
    rcreateSpan("#td6_151", "しきい値でのNGカードリスト");
    rcreateButton("#td6_151", "deletecdlist", "リスト削除", "rbtn_c");
    rcreateTextArea("#td6_161", "ngcdlistarea", '10','50',true);
    rcreateCheckBox("#td6_171", "yn_bmname" , "一番上の簡易出兵先の名前に「※」が付いていたらツール停止(外したら再開)","yn_bmname","1",m_rokaku_options[YN_BMNAME]);
    rcreateSpan("#td6_181", "*時間予約設定やデッキ入替設定を実施している場合、そちらが先に働きます");
    rcreateSpan("#td6_191", "**再開時、デッキに上がっている鹵獲と関係ないカードは勝手に下しません");
    rcreateCheckBox("#td6_301", "rkk_yn_autodonation" , "自動寄付を行う","rkk_yn_autodonation","1",m_rokaku_options[RKK_YN_AUTODONATION]);
    rcreateSpan("#td6_311", "自動寄付しきい値　**半角数字以外を入力した場合ツール止まります");
    rcreateTextBox("#td6_321", "rkk_ad_wood_limit" , "木：",m_rokaku_options[RKK_AD_WOOD_LIMIT],'11','100px',false);
    rcreateSpan("#td6_321", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_322", "rkk_ad_stone_limit" , "石：",m_rokaku_options[RKK_AD_STONE_LIMIT],'11','100px',false);
    rcreateSpan("#td6_322", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_323", "rkk_ad_iron_limit" , "鉄：",m_rokaku_options[RKK_AD_IRON_LIMIT],'11','100px',false);
    rcreateSpan("#td6_323", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_324", "rkk_ad_rice_limit" , "糧：",m_rokaku_options[RKK_AD_RICE_LIMIT],'11','100px',false);
    rcreateSpan("#td6_331", "自動寄付額　**半角数字以外を入力した場合ツール止まります");
    rcreateTextBox("#td6_341", "rkk_ad_wood" , "木：",m_rokaku_options[RKK_AD_WOOD],'11','100px',false);
    rcreateSpan("#td6_341", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_342", "rkk_ad_stone" , "石：",m_rokaku_options[RKK_AD_STONE],'11','100px',false);
    rcreateSpan("#td6_342", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_343", "rkk_ad_iron" , "鉄：",m_rokaku_options[RKK_AD_IRON],'11','100px',false);
    rcreateSpan("#td6_343", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td6_344", "rkk_ad_rice" , "糧：",m_rokaku_options[RKK_AD_RICE],'11','100px',false);
    rcreateButton("#td6_201", "saveSetWindow6", "設定を保存", "rbtn_c");
    rcreateButton("#td6_201", "inittabSetWindow6", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td6_201", "initSetWindow6", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td6_201", "closeSetWindow6", "閉じる", "rbtn_c");
    rkkcreatetitle("#td6_201");

}


function rokaku_setting7() {
    var table8 = j$("<table>");
    j$("#rokaku_tabs-7").append(table8);
    j$(table8).
        append(j$("<tr><td colspan='2' id=td7_11></td></tr>\
                <tr><td colspan='2' id=td7_21></td></tr>\
                <tr><td class=ctd0></td><td id=td7_41></td></tr>\
                <tr><td class=ctd0></td><td id=td7_51></td></tr>\
                <tr><td class=ctd0></td><td id=td7_61></td></tr>\
                <tr><td class=ctd0></td><td id=td7_71></td></tr>\
                <tr><td class=ctd0></td><td id=td7_81></td></tr>\
                <tr><td class=ctd0></td><td id=td7_91></td></tr>\
                <tr><td class=ctd0></td><td id=td7_101></td></tr>\
                <tr><td class=ctd0></td><td id=td7_10a1 style='font-size:12px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td7_10b1 style='font-size:12px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td7_10c1 style='font-size:12px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td7_111 style='padding-bottom:10px;'></td></tr>\
                <tr><td colspan='2' id=td7_121 style='padding-bottom:5px;font-size:12px;margin:2px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td7_12a1></td></tr>\
                <tr><td colspan='2' id=td7_131></td></tr>\
                <tr><td class=ctd0></td><td><table>\
                <tr style='text-align: center;'><td id=td7_141></td><td id=td7_142></td><td id=td7_143></td><td id=td7_144></td></tr>\
                <tr style='text-align: center;'><td id=td7_151></td><td id=td7_152></td><td id=td7_153></td><td id=td7_154></td></tr>\
                <tr><td colspan='4' id=td7_161></td></tr>\
                <tr><td colspan='4' id=td7_171></td></tr>\
                </table></td></tr>\
                <tr><td colspan='2' id=td7_181 style='padding-top:5px;'></td></tr>\
                <tr><td class=ctd0></td><td id=td7_191></td></tr>\
                <tr><td class=ctd0></td><td id=td7_201></td></tr>\
                <tr><td class=ctd0></td><td id=td7_211></td></tr>\
                <tr><td class=ctd0></td><td id=td7_221></td></tr>\
                <tr><td class=ctd0></td><td id=td7_231></td></tr>\
                <tr><td colspan='2' id=td7_241 style='padding-top:5px;color: #ff0000;font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td7_501 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td7_11", "遠訓貯金設定：LV1の遠征訓練所が存在する拠点でLv2->20になるように建築予約する");
    rcreateSpan("#td7_21", "<前提条件>");
    rcreateSpan("#td7_41", "・遠征訓練所Lv2->20に必要な資源が存在しない場合は処理しない");
    rcreateSpan("#td7_51", "・自動建設が無効の場合(無課金の状態の場合)は処理しない");
    rcreateSpan("#td7_61", "・内政スキルに「大治世」を含むスキル発動中は実施しない");
    rcreateSpan("#td7_71", "・既に２つ以上建築予約がされている拠点では実施しない");
    rcreateSpan("#td7_81", "・内政スキルに「治世」「王佐」を含むスキル発動中の拠点では実施しない");
    rcreateSpan("#td7_91", "・破棄中の拠点では実施しない");
    rcreateSpan("#td7_101", "・遠征訓練所予約対象外となっている拠点では実施しない");
    rcreateSpan("#td7_10a1", "※画面のフォーマットの仕様が変わった場合、上の条件を満たさない可能性があります。");
    rcreateSpan("#td7_10b1", "  特に「大治世」スキルの読み取りが出来なくなった場合に遠訓貯金を実施する可能性がありますので、");
    rcreateSpan("#td7_10c1", "  大治世使用時は設定の「遠訓貯金処理を実施する」のチェックをなるべく外してください");
    rcreateSpan("#td7_111", "================================================================");
    rcreateCheckBox("#td7_121", "rkk_yn_enbank" , "遠訓貯金処理を実施する","rkk_yn_enbank","1",m_rokaku_options[RKK_YN_ENBANK]);
    rcreateCheckBox("#td7_12a1", "rkk_yn_enview" , "遠訓貯金状況を画面に表示する","rkk_yn_enview","1",m_rokaku_options[RKK_YN_ENVIEW]);
    rcreateSpan("#td7_131", "遠訓貯金しきい値(下の数値は最低値)");
    rcreateTextBox("#td7_141", "rkk_wood_limit" , "木：",m_rokaku_options[RKK_WOOD_LIMIT],'11','100px',false);
    rcreateSpan("#td7_141", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td7_142", "rkk_stone_limit" , "石：",m_rokaku_options[RKK_STONE_LIMIT],'11','100px',false);
    rcreateSpan("#td7_142", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td7_143", "rkk_iron_limit" , "鉄：",m_rokaku_options[RKK_IRON_LIMIT],'11','100px',false);
    rcreateSpan("#td7_143", "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateTextBox("#td7_144", "rkk_rice_limit" , "糧：",m_rokaku_options[RKK_RICE_LIMIT],'11','100px',false);
    rcreateSpan("#td7_144", "&nbsp;&nbsp;&nbsp;&nbsp;");
    rcreateSpan("#td7_151", "(7,500,000)");
    rcreateSpan("#td7_152", "(9,000,000)");
    rcreateSpan("#td7_153", "(11,500,000)");
    rcreateSpan("#td7_154", "(10,000,000)");
    rcreateSpan("#td7_161", "参考：Lv2-20の施設建設にかかるコスト 木 7,334,350 | 石 8,968,138 | 鉄 11,170,849 | 糧 6,172,478");
    rcreateSpan("#td7_171", "※糧はマイナスの場合を考えて最低値はLv2-20建設必要コストよりやや多め");
    rcreateSpan("#td7_181", "遠征訓練所予約対象外拠点 ※この拠点では遠訓貯金を行いません！");
    rcreateSelectBox("#td7_191", "rkk_notbankvil1" , "対象外拠点１：","select1", m_rokaku_options[RKK_NOTBANKVIL1] ,selectValues2);
    rcreateSelectBox("#td7_201", "rkk_notbankvil2" , "対象外拠点２：","select1", m_rokaku_options[RKK_NOTBANKVIL2] ,selectValues2);
    rcreateSelectBox("#td7_211", "rkk_notbankvil3" , "対象外拠点３：","select1", m_rokaku_options[RKK_NOTBANKVIL3] ,selectValues2);
    rcreateSelectBox("#td7_221", "rkk_notbankvil4" , "対象外拠点４：","select1", m_rokaku_options[RKK_NOTBANKVIL4] ,selectValues2);
    rcreateSelectBox("#td7_231", "rkk_notbankvil5" , "対象外拠点５：","select1", m_rokaku_options[RKK_NOTBANKVIL5] ,selectValues2);
    rcreateButton("#td7_501", "saveSetWindow7", "設定を保存", "rbtn_c");
    rcreateButton("#td7_501", "inittabSetWindow7", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td7_501", "initSetWindow7", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td7_501", "closeSetWindow7", "閉じる", "rbtn_c");
    rkkcreatetitle("#td7_501");

    //拠点プルダウン設定
    var lists = rloadData(GM_KEY+"VillageList", "[]", true);
    var plist ;
    for (var k = 1; k < 6; k++) {
        j$("#rkk_notbankvil"+k).append(j$('<option>').html("設定なし").val("設定なし"));
        for (var i = 0; i < lists.length; i++) {
            plist = j$('<option>').html(lists[i].name).val(lists[i].name);
            j$("#rkk_notbankvil"+k).append(plist);
        }
    }

    //遠訓フラグ設定
    var l_enbankflg=GM_getValue(GM_KEY +"_enbankflg", false);
    if (l_enbankflg==true) {
        rcreateSpan("#td7_241", "現在、遠訓貯金が出来る拠点は存在しません   ※リセットはツールのON/OFFしてください");
    }
}

function rokaku_setting8() {
    var table9 = j$("<table>");
    j$("#rokaku_tabs-6").append(table9);
    j$(table9).
        append(j$("<tr><td colspan='2' id=td8_11></td></tr>\
                <tr><td colspan='2' id=td8_21 style='padding-top:5px;font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td8_31 style='padding-bottom:10px;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_41></td></tr>\
                <tr><td class=ctd0></td><td id=td8_51 style='padding-top:5px;padding-bottom:5px;color: #ff0000;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_61 style='padding-bottom:10px;'></td></tr>\
                <tr><td colspan='2' id=td8_71 style='font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td8_81 style='padding-bottom:10px;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_91></td></tr>\
                <tr><td class=ctd0></td><td id=td8_101 style='padding-top:5px;padding-bottom:5px;color: #ff0000;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_111 style='padding-bottom:10px;'></td></tr>\
                <tr><td colspan='2' id=td8_121 style='padding-top:5px;font-size:12px;font-weight:bold;'></td></tr>\
                <tr><td colspan='2' id=td8_131 style='padding-bottom:10px;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_141></td></tr>\
                <tr><td class=ctd0></td><td id=td8_151 style='padding-top:5px;padding-bottom:5px;color: #ff0000;'></td></tr>\
                <tr><td class=ctd0></td><td id=td8_161 style='padding-bottom:10px;'></td></tr>\
                <tr><td colspan='2' id=td8_171></td></tr>\
                <tr><td colspan='2' id=td8_181></td></tr>\
                <tr><td class=ctd0></td><td id=td8_191></td></tr>\
                <tr><td class=ctd0></td><td id=td8_201></td></tr>\
                <tr><td class=ctd0></td><td id=td8_211></td></tr>\
                <tr><td class=ctd0></td><td id=td8_221></td></tr>\
                <tr><td class=ctd0></td><td id=td8_231></td></tr>\
                <tr><td class=ctd0></td><td id=td8_241></td></tr>\
                <tr><td class=ctd0></td><td id=td8_251></td></tr>\
                <tr><td class=ctd0></td><td id=td8_261></td></tr>\
                <tr><td class=ctd0></td><td id=td8_271></td></tr>\
                <tr><td colspan='2' id=td8_301></td></tr>\
                <tr><td class=ctd0></td><td id=td8_311></td></tr>\
                <tr><td class=ctd0></td><td id=td8_321></td></tr>\
                <tr><td class=ctd0></td><td id=td8_331></td></tr>\
                <tr><td colspan='2' id=td8_401 style='padding-top:5px;'></td></tr>\
                <tr><td colspan='2' id=td8_411></td></tr>\
                <tr><td colspan='2' id=td8_421></td></tr>\
                <tr><td colspan='2' id=td8_431></td></tr>\
                <tr><td colspan='2' id=td8_501 class=ctdb></td></tr>\
    "));

    rcreateSpan("#td8_21", "鹵獲開始予約日時設定(24時間表記・半角数字で入力)");
    rcreateSpan("#td8_31", "※鹵獲ボタンを[実行中]にしておくことで設定が有効になる");
    rcreateTextBox("#td8_41", "rkk_res_startmon" , "",m_rokaku_options[RKK_RES_STARTMON],'2','20px',false);
    rcreateTextBox("#td8_41", "rkk_res_startday" , "月 ",m_rokaku_options[RKK_RES_STARTDAY],'2','20px',false);
    rcreateTextBox("#td8_41", "rkk_res_starthour" , "日 ",m_rokaku_options[RKK_RES_STARTHOUR],'2','20px',false);
    rcreateTextBox("#td8_41", "rkk_res_startmin" , "時 ",m_rokaku_options[RKK_RES_STARTMIN],'2','20px',false);
    rcreateSpan("#td8_41", "分");
    rcreateSpan("#td8_51", "開始予約日時:");
    rcreateButton("#td8_61", "rkk_res_startsettbtn", "開始予約設定", "rbtn_c");
    rcreateButton("#td8_61", "rkk_res_startresetbtn", "開始予約リセット", "rbtn_c");
    rcreateSpan("#td8_71", "鹵獲停止予約日時設定(24時間表記・半角数字で入力)");
    rcreateSpan("#td8_81", "※注：デッキ入替予約完了前に時間を設定すると入替予約が無効になる。また、停止後に開始予約は出来ない(再開予約をしてください)");
    rcreateTextBox("#td8_91", "rkk_res_stopmon" , "",m_rokaku_options[RKK_RES_STOPMON],'2','20px',false);
    rcreateTextBox("#td8_91", "rkk_res_stopday" , "月 ",m_rokaku_options[RKK_RES_STOPDAY],'2','20px',false);
    rcreateTextBox("#td8_91", "rkk_res_stophour" , "日 ",m_rokaku_options[RKK_RES_STOPHOUR],'2','20px',false);
    rcreateTextBox("#td8_91", "rkk_res_stopmin" , "時 ",m_rokaku_options[RKK_RES_STOPMIN],'2','20px',false);
    rcreateSpan("#td8_91", "分");
    rcreateSpan("#td8_101", "停止予約日時:");
    rcreateButton("#td8_111", "rkk_res_stopsettbtn", "停止予約設定", "rbtn_c");
    rcreateButton("#td8_111", "rkk_res_stopresetbtn", "停止予約リセット", "rbtn_c");
    rcreateSpan("#td8_121", "鹵獲再開予約日時設定(24時間表記・半角数字で入力)");
    rcreateSpan("#td8_131", "※停止予約機能または入替予約機能後、手動でツールのON/OFFしないまま鹵獲再開したい場合に利用");
    rcreateTextBox("#td8_141", "rkk_res_restartmon" , "",m_rokaku_options[RKK_RES_RESTARTMON],'2','20px',false);
    rcreateTextBox("#td8_141", "rkk_res_restartday" , "月 ",m_rokaku_options[RKK_RES_RESTARTDAY],'2','20px',false);
    rcreateTextBox("#td8_141", "rkk_res_restarthour" , "日 ",m_rokaku_options[RKK_RES_RESTARTHOUR],'2','20px',false);
    rcreateTextBox("#td8_141", "rkk_res_restartmin" , "時 ",m_rokaku_options[RKK_RES_RESTARTMIN],'2','20px',false);
    rcreateSpan("#td8_141", "分");
    rcreateSpan("#td8_151", "再開予約日時:");
    rcreateButton("#td8_161", "rkk_res_restartsettbtn", "再開予約設定", "rbtn_c");
    rcreateButton("#td8_161", "rkk_res_restartresetbtn", "再開予約リセット", "rbtn_c");
    rcreateSpan("#td8_171", "================================================================");
    rcreateSpan("#td8_181", "＜動作する設定＞");
    rcreateSpan("#td8_191", "開始予約設定のみ");
    rcreateSpan("#td8_201", "停止予約設定のみ");
    rcreateSpan("#td8_211", "デッキ入替予約設定のみ");
    rcreateSpan("#td8_221", "開始予約設定時間　→　停止予約設定時間");
    rcreateSpan("#td8_231", "開始予約設定時間　→　デッキ入替予約設定時間");
    rcreateSpan("#td8_241", "停止予約設定時間　→　再開予約設定時間");
    rcreateSpan("#td8_251", "デッキ入替予約設定時間　→　再開予約設定時間");
    rcreateSpan("#td8_261", "開始予約設定時間　→　停止予約設定時間　→　再開予約設定時間");
    rcreateSpan("#td8_271", "開始予約設定時間　→　デッキ入替予約設定時間　→　再開予約設定時間");
    rcreateSpan("#td8_301", "＜動作しない設定＞");
    rcreateSpan("#td8_311", "再開予約設定のみ");
    rcreateSpan("#td8_321", "停止予約設定時間　→　開始予約設定時間（停止までは実施される）");
    rcreateSpan("#td8_331", "デッキ入替予約設定時間　→　開始予約設定時間（停止までは実施される）");
    rcreateSpan("#td8_401", "※ただし、途中でツールをON/OFFしたり設定値を変更した場合、内部の設定がリセットされたりするので、どう動作するか不明");
    rcreateSpan("#td8_421", "　設定値を変えた場合　→　ON/OFFし直す");
    rcreateSpan("#td8_431", "　ON/OFFした場合　→　設定を見直す(設定が消えてないか等)");
    rcreateButton("#td8_501", "saveSetWindow8", "設定を保存", "rbtn_c");
    rcreateButton("#td8_501", "inittabSetWindow8", "タブ設定を初期化", "rbtn_c");
    rcreateButton("#td8_501", "initSetWindow8", "全ての設定を初期化", "rbtn_c");
    rcreateButton("#td8_501", "closeSetWindow8", "閉じる", "rbtn_c");
    rkkcreatetitle("#td8_501");

    var l_restimeVal =GM_getValue(GM_KEY + '_resstarttimeValue', "");
    if (l_restimeVal!=""){
        var l_resflg=GM_getValue(GM_KEY + '_resstartfun', false);
        var l_ressts="";
        if (l_resflg==false){
            var l_restime=GM_getValue(GM_KEY + '_resstarttime', "");
            if (l_restime!=""){
                var dt = new Date();
                var diff=l_restime-dt.getTime();
                var hour = diff/(1000*60*60);
                l_ressts="(約" + hour.toFixed(1) + "時間後予約)"
            }
        } else {
            l_ressts="(実行済)"
        }
        j$("#td8_51").text("開始予約日時:"+l_restimeVal+l_ressts);
    }
    l_restimeVal =GM_getValue(GM_KEY + '_resstoptimeValue', "");
    if (l_restimeVal!=""){
        var l_resflg=GM_getValue(GM_KEY + '_resstopfun', false);
        var l_ressts="";
        if (l_resflg==false){
            var l_restime=GM_getValue(GM_KEY + '_resstoptime', "");
            if (l_restime!=""){
                var dt = new Date();
                var diff=l_restime-dt.getTime();
                var hour = diff/(1000*60*60);
                l_ressts="(約" + hour.toFixed(1) + "時間後予約)"
            }
        } else {
            l_ressts="(実行済)"
        }
        j$("#td8_101").text("停止予約日時:"+l_restimeVal+l_ressts);
    }
    l_restimeVal =GM_getValue(GM_KEY + '_resrestarttimeValue', "");
    if (l_restimeVal!=""){
        var l_resflg=GM_getValue(GM_KEY + '_resrestartfun', false);
        var l_ressts="";
        if (l_resflg==false){
            var l_restime=GM_getValue(GM_KEY + '_resrestarttime', "");
            if (l_restime!=""){
                var dt = new Date();
                var diff=l_restime-dt.getTime();
                var hour = diff/(1000*60*60);
                l_ressts="(約" + hour.toFixed(1) + "時間後予約)"
            }
        } else {
            l_ressts="(実行済)"
        }
        j$("#td8_151").text("再開予約日時:"+l_restimeVal+l_ressts);
    }
}
function rcreateCheckBox(container, rid, rtext, rclass, rvalue, ckflag){
    var lbl = j$("<label>").text(rtext);
    var ckBox = j$("<input>",{
        type: 'checkbox',
        id: rid,
        class: rclass,
        value: rvalue,
        checked: ckflag
    });
    j$(container).append(ckBox);
    j$(container).append(lbl);
}

function rcreateSpan(container, rtext){
    var stext = j$("<span>");
    stext.html(rtext);
    j$( container ).append(stext);
}
function rkkcreatetitle(container){
    j$(container).append(
    "<span style='font-size:12px;margin:2px;color:#ff0000;font-weight:bold;text-align:right;'>ver."+VERSION+"</span>"
    );
}

function rcreateSelectBox(container, rid, rtext, rclass, rvalue, selectValues){
    var lbl = j$("<label>").text(rtext);
    var rslct = j$("<select>",{
        id: rid,
        class: rclass
    });
    j$(container).append(lbl);
    j$(container).append(rslct);

    j$.each(selectValues, function(key, value) {
         j$("#" + rid)
             .append(j$("<option></option>")
                        .attr("value",key)
                        .text(value));
    });
    j$("#" + rid).val(rvalue);
}

function rcreateTextBox(container, rid, rtext, rvalue, rlen, rsize, yinput){
    var lbl = j$("<label>").text(rtext);
    var txBox = j$("<input>",{
        type: 'text',
        id: rid,
        value: rvalue,
        maxlength: rlen,
        width: rsize,
        readonly: yinput
    });
    j$(container).append(lbl);
    j$(container).append(txBox);
}
function rcreateTextArea(container, rid, rrow, rcols, yinput){
    var txBox = j$("<textarea>",{
        id: rid,
        value: "",
        rows: rrow,
        cols: rcols,
        disabled: yinput
    });
    j$(container).append(txBox);
}
function rcreateButton(container, rid, rtext, rclass){
    var btn = j$("<input>",{
        type: 'button',
        id: rid,
        class: rclass,
        value: rtext
    });
    j$( container ).append(btn);
}

function rcreateSelectListBox(container, rid, rclass, rsize, selectValues){
    var rslct = j$("<select>",{
        id: rid,
        class: rclass
    });

    j$(container).append(rslct);
    j$(rslct).attr("size", rsize);
    j$(rslct).width(100);
    j$.each(selectValues, function(key, value) {
         j$("#" + rid)
             .append(j$("<option></option>")
                        .attr("value",key)
                        .text(value));
    });
}

function moveUpElement(rid) {
    var selectbox = j$("#" + rid);
    var option_list = j$("#" + rid + " option");
      for (var i = 0; i < selectbox.children('option').length; i++) {
        if (option_list[i].selected) {
          if (i > 0 && !option_list[i-1].selected) {
            j$("#" + rid +" option:selected").insertBefore(j$("#" + rid +" option:selected").prev());
          }
        }
      }
      selectbox.focus();
}

function moveDownElement(rid) {
    var selectbox = j$("#" + rid);
    var option_list = j$("#" + rid + " option");
    for (var i = selectbox.children('option').length-1; i >= 0; i--) {
        if (option_list[i].selected) {
          if (i < selectbox.children('option').length-1 && !option_list[i+1].selected) {
              j$("#" + rid +" option:selected").insertAfter(j$("#" + rid +" option:selected").next());
          }
        }
      }
      selectbox.focus();
}

function moveRLElement(_this, tgtid) {
    j$("#" +  _this + " option:selected").each(function() {
        j$("#" + tgtid).append(j$("#" +  _this + " option:selected").clone());
        j$("#" +  _this + " option:selected").remove();
    });
}

//-------------------//
// css定義の追加     //
//-------------------//
function addRokakuCss() {
    var css =" \
    .rokakutab{overflow:hidden;} \
    .rokakutab li{background:#ccc; padding:5px 10px; float:left; margin-right:1px;list-style:none;} \
    .rokakutab li.select{background:#eee;} \
    .tab_contents li{background:#eee; padding:10px; list-style:none;} \
    .hide {display:none;} \
    table {border: 0px solid #000;} \
    table .ctd0{width: 30px;} \
    table .ctd1{width: 120px;} \
    table .ctd2{width: 100px;} \
    table .ctdb{padding-top: 20px;} \
    .rbtn_a {width: 30px;} \
    .rbtn_c {border:1px solid #777; \
        padding: 4px 10px; \
        color: #fff; \
        cursor: pointer; \
        background: #428ec9; \
        border-radius: 5px;} \
    ";
    GM_addStyle(css);
}

//---------------------------//
//鹵獲カード設定ボックス     //
//---------------------------//
function getrokakusetcd() {
    var filelist = j$("#cardFileList div[class='cardStatusDetail label-setting-mode']");
    var filenum=filelist.length;
    for (var i = 0; i < filenum; i++) {
        var select_id = "selrkkarea_" + i;
        var btn_id = "btn_choicercd_" + i;
        var selrkkHtml = "<div style='margin-bottom: 4px;'><select id='" + select_id + "' name='" + select_id + "' style='width: 170px;'>" +
                         "<option selected>鹵獲ツール武将を選択</option>" +
                         "<optgroup label='鹵獲スキル設定'>" +
                         "<option value='1'>スキル全軍カード１</option>" +
                         "<option value='2'>スキル全軍カード２</option>" +
                         "<option value='3'>スキル全軍カード３</option>" +
                         "<option value='4'>スキル全軍カード４</option>" +
                         "<option value='5'>スキル全軍カード５</option>" +
                         "</optgroup>" +
                         "<optgroup label='鹵獲パッシブ設定'>" +
                         "<option value='6'>パッシブ全軍カード１</option>" +
                         "<option value='7'>パッシブ全軍カード２</option>" +
                         "<option value='8'>パッシブ全軍カード３</option>" +
                         "<option value='9'>パッシブ全軍カード４</option>" +
                         "<option value='10'>パッシブ全軍カード５</option>" +
                         "<option value='11'>パッシブカード１</option>" +
                         "<option value='12'>パッシブカード２</option>" +
                         "<option value='13'>パッシブカード３</option>" +
                         "<option value='14'>パッシブカード４</option>" +
                         "<option value='15'>パッシブカード５</option>" +
                         "<option value='16'>パッシブカード６</option>" +
                         "<option value='17'>パッシブカード７</option>" +
                         "<option value='18'>パッシブカード８</option>" +
                         "<option value='19'>パッシブカード９</option>" +
                         "<option value='20'>パッシブカード１０</option>" +
                         "<option value='21'>パッシブカード１１</option>" +
                         "<option value='22'>パッシブカード１２</option>" +
                         "<option value='23'>パッシブカード１３</option>" +
                         "</optgroup>" +
                         "<optgroup label='デッキ入替設定'>" +
                         "<option value='24'>カード設定01</option>" +
                         "<option value='25'>カード設定02</option>" +
                         "<option value='26'>カード設定03</option>" +
                         "<option value='27'>カード設定04</option>" +
                         "<option value='28'>カード設定05</option>" +
                         "<option value='29'>カード設定06</option>" +
                         "<option value='30'>カード設定07</option>" +
                         "<option value='31'>カード設定08</option>" +
                         "<option value='32'>カード設定09</option>" +
                         "<option value='33'>カード設定10</option>" +
                         "<option value='34'>カード設定11</option>" +
                         "<option value='35'>カード設定12</option>" +
                         "<option value='36'>カード設定13</option>" +
                         "<option value='37'>カード設定14</option>" +
                         "<option value='38'>カード設定15</option>" +
                         "</optgroup>" +
                         "</select>";

        j$("div[class='otherDetail clearfix'] dl[class='label-name clearfix']", filelist.eq(i)).after(
            selrkkHtml +
            "<button type=button id="+ btn_id + " style=\"width:40px;\">登録</button>" +
            "</div>"
        );
    }

    j$("[id^='btn_choicercd_']").on("click",function(){
        var btnid  = j$(this).attr("id");
        var selnum = btnid.match(/\d+/g)[0];
        var select_val = j$('#selrkkarea_' + selnum).val();
        var rightprm = filelist.find("div[class='statusDetail clearfix'] table[class='statusParameter1']").eq(selnum);
        var cd_costtxt =rightprm.find("tr").eq(3).find("td").eq(0).text(); //コスト
        //カード名
        var cd_name = filelist.find("div[class='statusDetail clearfix'] div[class='illustMini']").eq(selnum).find("img[class='lazy']").attr("title");
        var cd_cost="";
        j$.each(selectValues5, function(key, value){
            if(parseFloat(cd_costtxt) == parseFloat(value)){
                cd_cost=key;
            }
            //break;
        });
        var cd_lbl = filelist.find("div[class='otherDetail clearfix'] dl[class='label-name clearfix'] select").attr("class").match(/changelabelbox sel_label_(\d+)/)[1];  //ラベル
        var cd_id = filelist.eq(selnum).find("div[class='statusDetail clearfix'] div[class='illustMini'] a[class^='thickbox']").attr("href").match(/\d+/g)[2]; //id
        if (cd_lbl==0){
            cd_lbl=1;
        }

        var CDNAME="";
        var CDCOST="";
        var CDLBL="";
        var CDID="";
        var l_val=0;
        var l_chk=0;
        //設定のロード
        loadRokakuSettings();
        //保存
        switch (select_val) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
                CDNAME = eval("ROKAKU_ZANCD" + select_val);
                CDCOST = eval("ROKAKU_ZANCST" + select_val);
                CDLBL = eval("ROKAKU_ZANLBL" + select_val);
                m_rokaku_options[CDNAME]=cd_name;
                m_rokaku_options[CDCOST]=cd_cost;
                m_rokaku_options[CDLBL]=cd_lbl;
                break;
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
                l_val=parseInt(select_val)-5;
                CDNAME = eval("ROKAKUP_ZANCD" + l_val);
                CDCOST = eval("ROKAKUP_ZANCST" + l_val);
                CDLBL = eval("ROKAKUP_ZANLBL" + l_val);
                m_rokaku_options[CDNAME]=cd_name;
                m_rokaku_options[CDCOST]=cd_cost;
                m_rokaku_options[CDLBL]=cd_lbl;
                break;
            case "11":
            case "12":
            case "13":
            case "14":
            case "15":
            case "16":
            case "17":
            case "18":
            case "19":
            case "20":
            case "21":
            case "22":
            case "23":
                l_val=parseInt(select_val)-10;
                CDNAME = eval("ROKAKUP_CD" + l_val);
                CDCOST = eval("ROKAKUP_CST" + l_val);
                CDLBL = eval("ROKAKUP_LBL" + l_val);
                m_rokaku_options[CDNAME]=cd_name;
                m_rokaku_options[CDCOST]=cd_cost;
                m_rokaku_options[CDLBL]=cd_lbl;
                break;
            case "24":
            case "25":
            case "26":
            case "27":
            case "28":
            case "29":
            case "30":
            case "31":
            case "32":
            case "33":
            case "34":
            case "35":
            case "36":
            case "37":
            case "38":
                l_val=parseInt(select_val)-23;
                CDNAME = eval("RKK_RESCD" + l_val);
                CDCOST = eval("RKK_RESCST" + l_val);
                CDLBL = eval("RKK_RESLBL" + l_val);
                CDID = eval("RKK_RESCDID" + l_val);
                m_rokaku_options[CDNAME]=cd_name;
                m_rokaku_options[CDCOST]=cd_cost;
                m_rokaku_options[CDLBL]=cd_lbl;
                m_rokaku_options[CDID]=cd_id;
                break;
        }
        //設定を保存
        if (l_chk==0){
            var options=m_rokaku_options;
            GM_setValue(GM_KEY + '_rokaku_options', JSON.stringify(options));
            alert("保存しました。");
        }
    });
}

//---------------------------------//
// rokakuの設定の読み込み・保存    //
//---------------------------------//
// デフォルトオプション定義の取得
function getrkkDefaultOptions() {
    var settings = new Object;

    // メイン
    // 使用する設定
    settings[USECONF1] = false;    // 鹵獲スキル
    settings[USECONF2] = false;    // 鹵獲パッシブ
    //設定優先順位
    settings[USEDLST1] = 1;        // 鹵獲スキル
    settings[USEDLST2] = 2;        // 鹵獲パッシブ
    //出兵拠点
    settings[ROKAKU_VIL] = '';
    settings[ROKAKU_VIL2] = '';
    settings[YN_SUBVIL] = false;
    //回復スキル使用拠点
    settings[KAIHK_VIL] = '';

    //出兵座標
    settings[WOOD_X] = '';         // 木x
    settings[WOOD_Y] = '';         // 木y
    settings[STONE_X] = '';        // 石x
    settings[STONE_Y] = '';        // 石y
    settings[IRON_X] = '';         // 鉄x
    settings[IRON_Y] = '';         // 鉄y
    settings[RICE_X] = '';         // 糧x
    settings[RICE_Y] = '';         // 糧y
    //出兵座標２
    settings[WOOD_X2] = '';        // 木x
    settings[WOOD_Y2] = '';        // 木y
    settings[STONE_X2] = '';       // 石x
    settings[STONE_Y2] = '';       // 石y
    settings[IRON_X2] = '';        // 鉄x
    settings[IRON_Y2] = '';        // 鉄y
    settings[RICE_X2] = '';        // 糧x
    settings[RICE_Y2] = '';        // 糧y
    //優先度
    settings[WOOD_RATE] = 1;       // 木
    settings[STONE_RATE] = 1;      // 石
    settings[IRON_RATE] = 1;       // 鉄
    settings[RICE_RATE] = 1;       // 糧
    settings[YN_RICE_ROKAKU] = false;
    //仁君設定
    settings[JIN_LABEL] = 1;       // ラベル
    settings[JIN_SKILLV] = 1;      // スキルレベル
    // 神医の施術設定
    settings[SEJYU_LABEL] = 1;     // ラベル
    settings[SEJYU_SKILLV] = 1;    // スキルレベル
    //弓腰姫の愛設定
    settings[KYUYOKI_LABEL] = 1;   // ラベル
    settings[KYUYOKI_SKILLV] = 1;  // スキルレベル
    //皇后の慈愛
    settings[KGJAI_LABEL] = 1;     // ラベル
    settings[KGJAI_SKILLV] = 1;    // スキルレベル
    //桃色吐息:
    settings[MOMO_LABEL] = 1;      // ラベル
    settings[MOMO_SKILLV] = 1;     // スキルレベル
    //酔吟吐息
    settings[SUIGIN_LABEL] = 1;    // ラベル
    settings[SUIGIN_SKILLV] = 1;   // スキルレベル
    //文姫の慈愛
    settings[BNKJAI_LABEL] = 1;    // ラベル
    settings[BNKJAI_SKILLV] = 1;   // スキルレベル
    //神卜の方術
    settings[SINBK_LABEL] = 1;     // ラベル
    settings[SINBK_SKILLV] = 1;    // スキルレベル
    //娘々敬慕
    settings[NNKEB_LABEL] = 1;     // ラベル
    settings[NNKEB_SKILLV] = 1;    // スキルレベル
    //熊猫の麺匠
    settings[PNDMEN_LABEL] = 1;    // ラベル
    settings[PNDMEN_SKILLV] = 1;   // スキルレベル
    // 神医の術式設定
    settings[JYUTU_LABEL] = 1;     // ラベル
    settings[JYUTU_SKILLV] = 1;    // スキルレベル
    //劉備の契り
    settings[CIGIRI_LABEL] = 1;    // ラベル
    settings[CIGIRI_SKILLV] = 1;   // スキルレベル
    //神卜の術式
    settings[BKJYUTU_LABEL] = 1;   // ラベル
    settings[BKJYUTU_SKILLV] = 1;  // スキルレベル
    //傾国設定
    settings[KEI_LABEL] = 1;       // ラベル
    settings[KEI_SKILLV] = 1;      // スキルレベル

    settings[YN_RKKAI] = false;  // ynコスト空き
    settings[RKKAICST] = 4;      // コスト空き

    //メイン２
    //簡易出兵先名
    settings[YN_BMNAME] = false;       // 有効無効
    //カード座標時指定(１)
    settings[YN_DECAREA1] = false;     // 有効無効
    settings[DECAREACD1] = '';         // カード名
    settings[DECAREA1_X] = '';         // x軸
    settings[DECAREA1_Y] = '';         // y軸
    settings[DECNOTE1] = '';           // メモ
    //カード座標時指定(２)
    settings[YN_DECAREA2] = false;     // 有効無効
    settings[DECAREACD2] = '';         // カード名
    settings[DECAREA2_X] = '';         // x軸
    settings[DECAREA2_Y] = '';         // y軸
    settings[DECNOTE2] = '';           // メモ
    //カード座標時指定(３)
    settings[YN_DECAREA3] = false;     // 有効無効
    settings[DECAREACD3] = '';         // カード名
    settings[DECAREA3_X] = '';         // x軸
    settings[DECAREA3_Y] = '';         // y軸
    settings[DECNOTE3] = '';           // メモ
    //カード座標時指定(４)
    settings[YN_DECAREA4] = false;     // 有効無効
    settings[DECAREACD4] = '';         // カード名
    settings[DECAREA4_X] = '';         // x軸
    settings[DECAREA4_Y] = '';         // y軸
    settings[DECNOTE4] = '';           // メモ
    //カード座標時指定(５)
    settings[YN_DECAREA5] = false;     // 有効無効
    settings[DECAREACD5] = '';         // カード名
    settings[DECAREA5_X] = '';         // x軸
    settings[DECAREA5_Y] = '';         // y軸
    settings[DECNOTE5] = '';           // メモ
    //カード座標時指定(６)
    settings[YN_DECAREA6] = false;     // 有効無効
    settings[DECAREACD6] = '';         // カード名
    settings[DECAREA6_X] = '';         // x軸
    settings[DECAREA6_Y] = '';         // y軸
    settings[DECNOTE6] = '';           // メモ
    //カード座標時指定(７)
    settings[YN_DECAREA7] = false;     // 有効無効
    settings[DECAREACD7] = '';         // カード名
    settings[DECAREA7_X] = '';         // x軸
    settings[DECAREA7_Y] = '';         // y軸
    settings[DECNOTE7] = '';           // メモ
    //カード座標時指定(８)
    settings[YN_DECAREA8] = false;     // 有効無効
    settings[DECAREACD8] = '';         // カード名
    settings[DECAREA8_X] = '';         // x軸
    settings[DECAREA8_Y] = '';         // y軸
    settings[DECNOTE8] = '';           // メモ
    //カード座標時指定(９)
    settings[YN_DECAREA9] = false;     // 有効無効
    settings[DECAREACD9] = '';         // カード名
    settings[DECAREA9_X] = '';         // x軸
    settings[DECAREA9_Y] = '';         // y軸
    settings[DECNOTE9] = '';           // メモ
    //カード座標時指定(１０)
    settings[YN_DECAREA10] = false;    // 有効無効
    settings[DECAREACD10] = '';        // カード名
    settings[DECAREA10_X] = '';        // x軸
    settings[DECAREA10_Y] = '';        // y軸
    settings[DECNOTE10] = '';          // メモ
    //しきい値攻撃
    settings[YN_ATTKCHK] = false;      // 有効無効
    settings[ATTKCHK] = '';            // 攻撃値
    //しきい値速度
    settings[YN_SPEEDCHK] = false;     // 有効無効
    settings[SPEEDCHK] = '';           // 速度値
    //鹵獲開始時間予約
    settings[RKK_RES_STARTMON] = '';   // 月
    settings[RKK_RES_STARTDAY] = '';   // 日
    settings[RKK_RES_STARTHOUR] = '';  // 時
    settings[RKK_RES_STARTMIN] = '';   // 分
    //鹵獲停止時間予約
    settings[RKK_RES_STOPMON] = '';    // 月
    settings[RKK_RES_STOPDAY] = '';    // 日
    settings[RKK_RES_STOPHOUR] = '';   // 時
    settings[RKK_RES_STOPMIN] = '';    // 分
    //鹵獲再開時間予約
    settings[RKK_RES_RESTARTMON] = '';  // 月
    settings[RKK_RES_RESTARTDAY] = '';  // 日
    settings[RKK_RES_RESTARTHOUR] = ''; // 時
    settings[RKK_RES_RESTARTMIN] = '';  // 分
    // 自動寄付
    settings[RKK_YN_AUTODONATION] = false;    // 遠訓貯金フラグ
    settings[RKK_AD_WOOD_LIMIT] = 20000000;   // 木しきい値
    settings[RKK_AD_STONE_LIMIT] = 20000000;  // 石しきい値
    settings[RKK_AD_IRON_LIMIT] = 20000000;   // 鉄しきい値
    settings[RKK_AD_RICE_LIMIT] = 20000000;   // 糧しきい値
    settings[RKK_AD_WOOD] = 0;                // 木寄付額
    settings[RKK_AD_STONE] = 0;               // 石寄付額
    settings[RKK_AD_IRON] = 0;                // 鉄寄付額
    settings[RKK_AD_RICE] = 0;                // 糧寄付額

    //鹵獲スキル
    //鹵獲スキル設定
    settings[ROKAKU_LABEL] = 1;      // ラベル
    //全軍系（１）
    settings[YN_ROKAKUZEN1] = true;  // 有効無効
    settings[ROKAKU_ZANCD1] = '';    // カード名
    settings[ROKAKU_ZANLBL1] = 1;    // ラベル
    settings[ROKAKU_ZANCST1] = 1;    // コスト
    // 全軍系（２）
    settings[YN_ROKAKUZEN2] = true;  // 有効無効
    settings[ROKAKU_ZANCD2] = '';    // カード名
    settings[ROKAKU_ZANLBL2] = 1;    // ラベル
    settings[ROKAKU_ZANCST2] = 1;    // コスト
    // 全軍系（３）
    settings[YN_ROKAKUZEN3] = true;  // 有効無効
    settings[ROKAKU_ZANCD3] = '';    // カード名
    settings[ROKAKU_ZANLBL3] = 1;    // ラベル
    settings[ROKAKU_ZANCST3] = 1;    // コスト
    // 全軍系（４）
    settings[YN_ROKAKUZEN4] = true;  // 有効無効
    settings[ROKAKU_ZANCD4] = '';    // カード名
    settings[ROKAKU_ZANLBL4] = 1;    // ラベル
    settings[ROKAKU_ZANCST4] = 1;    // コスト
    // 全軍系（５）
    settings[YN_ROKAKUZEN5] = true;  // 有効無効
    settings[ROKAKU_ZANCD5] = '';    // カード名
    settings[ROKAKU_ZANLBL5] = 1;    // ラベル
    settings[ROKAKU_ZANCST5] = 1;    // コスト

    // 出兵有無
    settings[YN_RKZENDK] = '';
    // 使用する鹵獲スキル
    settings[ROKAKU_USEDSKIL1] = true;   // 劉備の大徳
    settings[ROKAKU_USEDSKIL2] = true;   // 鬼神の鹵獲
    settings[ROKAKU_USEDSKIL3] = true;   // 猛将の鹵獲
    settings[ROKAKU_USEDSKIL4] = true;   // 趁火打劫
    settings[ROKAKU_USEDSKIL5] = true;   // 迅速劫略
    settings[ROKAKU_USEDSKIL6] = true;   // 神速劫略
    settings[ROKAKU_USEDSKIL7] = true;   // 龍神の縮地劫略
    settings[ROKAKU_USEDSKIL8] = true;   // 鬼神の縮地劫略
    settings[ROKAKU_USEDSKIL9] = true;   // 猛将の縮地劫略
    settings[ROKAKU_USEDSKIL10] = true;  // 猛暑の縮地収穫
    settings[ROKAKU_USEDSKIL11] = true;  // 桃賊の襲撃
    //使用する回復スキル
    settings[FLERECSKIL1] = defflerecskil;
   //使用しない回復スキル
    settings[UNRECSKIL1] = defunrecskil;

    // 鹵獲パッシブ
    // 鹵獲カード（１）
    settings[YN_ROKAKUP1] = true;    // 有効無効
    settings[ROKAKUP_CD1] = '';      // カード名
    settings[ROKAKUP_CST1] = 5;      // コスト
    settings[ROKAKUP_LBL1] = 1;      // ラベル
    settings[YN_USEKEI1] = true;     // 傾国使用
    // 鹵獲カード（２）
    settings[YN_ROKAKUP2] = true;    // 有効無効
    settings[ROKAKUP_CD2] = '';      // カード名
    settings[ROKAKUP_CST2] = 5;      // コスト
    settings[ROKAKUP_LBL2] = 1;      // ラベル
    settings[YN_USEKEI2] = true;     // 傾国使用
    // 鹵獲カード（３）
    settings[YN_ROKAKUP3] = true;    // 有効無効
    settings[ROKAKUP_CD3] = '';      // カード名
    settings[ROKAKUP_CST3] = 5;      // コスト
    settings[ROKAKUP_LBL3] = 1;      // ラベル
    settings[YN_USEKEI3] = true;     // 傾国使用
    // 鹵獲カード（４）
    settings[YN_ROKAKUP4] = true;    // 有効無効
    settings[ROKAKUP_CD4] = '';      // カード名
     settings[ROKAKUP_CST4] = 5;     // コスト
    settings[ROKAKUP_LBL4] = 1;      // ラベル
    settings[YN_USEKEI4] = true;     // 傾国使用
    // 鹵獲カード（５）
    settings[YN_ROKAKUP5] = true;    // 有効無効
    settings[ROKAKUP_CD5] = '';      // カード名
     settings[ROKAKUP_CST5] = 5;     //コスト
    settings[ROKAKUP_LBL5] = 1;      // ラベル
    settings[YN_USEKEI5] = true;     // 傾国使用
    // 鹵獲カード（６）
    settings[YN_ROKAKUP6] = true;    // 有効無効
    settings[ROKAKUP_CD6] = '';      // カード名
     settings[ROKAKUP_CST6] = 5;     // コスト
    settings[ROKAKUP_LBL6] = 1;      // ラベル
    settings[YN_USEKEI6] = true;     // 傾国使用
    // 鹵獲カード（７）
    settings[YN_ROKAKUP7] = true;    // 有効無効
    settings[ROKAKUP_CD7] = '';      // カード名
     settings[ROKAKUP_CST7] = 5;     // コスト
    settings[ROKAKUP_LBL7] = 1;      // ラベル
    settings[YN_USEKEI7] = true;     // 傾国使用
    // 鹵獲カード（８）
    settings[YN_ROKAKUP8] = true;    // 有効無効
    settings[ROKAKUP_CD8] = '';      // カード名
     settings[ROKAKUP_CST8] = 5;     // コスト
    settings[ROKAKUP_LBL8] = 1;      // ラベル
    settings[YN_USEKEI8] = true;     // 傾国使用
    // 鹵獲カード（９）
    settings[YN_ROKAKUP9] = true;    // 有効無効
    settings[ROKAKUP_CD9] = '';      // カード名
     settings[ROKAKUP_CST9] = 5;     // コスト
    settings[ROKAKUP_LBL9] = 1;      // ラベル
    settings[YN_USEKEI9] = true;     // 傾国使用
    // 鹵獲カード（１０）
    settings[YN_ROKAKUP10] = true;    // 有効無効
    settings[ROKAKUP_CD10] = '';      // カード名
     settings[ROKAKUP_CST10] = 5;     // コスト
    settings[ROKAKUP_LBL10] = 1;      // ラベル
    settings[YN_USEKEI10] = true;     // 傾国使用
    // 鹵獲カード（１１）
    settings[YN_ROKAKUP11] = true;    // 有効無効
    settings[ROKAKUP_CD11] = '';      // カード名
    settings[ROKAKUP_CST11] = 5;      // コスト
    settings[ROKAKUP_LBL11] = 1;      // ラベル
    settings[YN_USEKEI11] = true;     // 傾国使用
    // 鹵獲カード（１２）
    settings[YN_ROKAKUP12] = true;    // 有効無効
    settings[ROKAKUP_CD12] = '';      // カード名
    settings[ROKAKUP_CST12] = 5;      // コスト
    settings[ROKAKUP_LBL12] = 1;      // ラベル
    settings[YN_USEKEI12] = true;     // 傾国使用
    // 鹵獲カード（１３）
    settings[YN_ROKAKUP13] = true;    // 有効無効
    settings[ROKAKUP_CD13] = '';      // カード名
    settings[ROKAKUP_CST13] = 5;      // コスト
    settings[ROKAKUP_LBL13] = 1;      // ラベル
    settings[YN_USEKEI13] = true;     // 傾国使用
    //設定
    settings[YN_RKPDK] = true;       // 出兵有無
    settings[YN_RKPJYUTU] = true;    // 神医使用有無
    settings[YN_RKPJIN] = true;      // 仁君使用有無
    settings[RKPJINHP] = 80;         // 仁君使用HP
    //使用する回復スキル
    settings[RECSKIL2] = defrecskil;
   //使用しない回復スキル
    settings[UNRECSKIL2] = defunrecskil;

    //全軍系（１）
    settings[YN_ROKAKUPZEN1] = true;  // 有効無効
    settings[ROKAKUP_ZANCD1] = '';    // カード名
    settings[ROKAKUP_ZANLBL1] = 1;    // ラベル
    settings[ROKAKUP_ZANCST1] = 1;    // コスト
    //全軍系（２）
    settings[YN_ROKAKUPZEN2] = true;  // 有効無効
    settings[ROKAKUP_ZANCD2] = '';    // カード名
    settings[ROKAKUP_ZANLBL2] = 1;    // ラベル
    settings[ROKAKUP_ZANCST2] = 1;    // コスト
    //全軍系（３）
    settings[YN_ROKAKUPZEN3] = true;  // 有効無効
    settings[ROKAKUP_ZANCD3] = '';    // カード名
    settings[ROKAKUP_ZANLBL3] = 1;    // ラベル
    settings[ROKAKUP_ZANCST3] = 1;    // コスト
    settings[YN_RKPZENDK] = true;     //出兵有無
    //全軍系（４）
    settings[YN_ROKAKUPZEN4] = true;  // 有効無効
    settings[ROKAKUP_ZANCD4] = '';    // カード名
    settings[ROKAKUP_ZANLBL4] = 1;    // ラベル
    settings[ROKAKUP_ZANCST4] = 1;    // コスト
    //全軍系（５）
    settings[YN_ROKAKUPZEN5] = true;  // 有効無効
    settings[ROKAKUP_ZANCD5] = '';    // カード名
    settings[ROKAKUP_ZANLBL5] = 1;    // ラベル
    settings[ROKAKUP_ZANCST5] = 1;    // コスト

    settings[YN_RKPZENDK] = true;     // 出兵有無
    //傾国回復デッキ下ろすカード
    settings[KEI_DKCD] = '';          // カード名
    settings[KEI_DKLBL] = 1;          // ラベル

    //帰還時間で回復
    settings[YN_JINKIKAN] = false;
    settings[RKPJINKIKAN] = '180';

    //入替予約
    settings[RKK_RES_VIL] = '';       // セット拠点
    settings[RKK_RES_MON] = '';       // 月
    settings[RKK_RES_DAY] = '';       // 日
    settings[RKK_RES_HOUR] = '';      // 時
    settings[RKK_RES_MIN] = '';       // 分
    //予約カード１
    settings[RKK_YN_RES1] = false;    // 有効無効
    settings[RKK_RESCD1] = '';        // カード名
    settings[RKK_RESCDID1] = '';      // カードID
    settings[RKK_RESLBL1] = 1;        // ラベル
    settings[RKK_RESCST1] = 1;        // コスト
    settings[RKK_RESSKL1] = '';       // スキル
    //予約カード２
    settings[RKK_YN_RES2] = false;    // 有効無効
    settings[RKK_RESCD2] = '';        // カード名
    settings[RKK_RESCDID2] = '';      // カードID
    settings[RKK_RESLBL2] = 1;        // ラベル
    settings[RKK_RESCST2] = 1;        // コスト
    settings[RKK_RESSKL2] = '';       // スキル
    //予約カード３
    settings[RKK_YN_RES3] = false;    // 有効無効
    settings[RKK_RESCD3] = '';        // カード名
    settings[RKK_RESCDID3] = '';      // カードID
    settings[RKK_RESLBL3] = 1;        // ラベル
    settings[RKK_RESCST3] = 1;        // コスト
    settings[RKK_RESSKL3] = '';       // スキル
    //予約カード４
    settings[RKK_YN_RES4] = false;    // 有効無効
    settings[RKK_RESCD4] = '';        // カード名
    settings[RKK_RESCDID4] = '';      // カードID
    settings[RKK_RESLBL4] = 1;        // ラベル
    settings[RKK_RESCST4] = 1;        // コスト
    settings[RKK_RESSKL4] = '';       // スキル
    //予約カード５
    settings[RKK_YN_RES5] = false;    // 有効無効
    settings[RKK_RESCD5] = '';        // カード名
    settings[RKK_RESCDID5] = '';      // カードID
    settings[RKK_RESLBL5] = 1;        // ラベル
    settings[RKK_RESCST5] = 1;        // コスト
    settings[RKK_RESSKL5] = '';       // スキル
    //予約カード６
    settings[RKK_YN_RES6] = false;    // 有効無効
    settings[RKK_RESCD6] = '';        // カード名
    settings[RKK_RESCDID6] = '';      // カードID
    settings[RKK_RESLBL6] = 1;        // ラベル
    settings[RKK_RESCST6] = 1;        // コスト
    settings[RKK_RESSKL6] = '';       // スキル
    //予約カード７
    settings[RKK_YN_RES7] = false;    // 有効無効
    settings[RKK_RESCD7] = '';        // カード名
    settings[RKK_RESCDID7] = '';      // カードID
    settings[RKK_RESLBL7] = 1;        // ラベル
    settings[RKK_RESCST7] = 1;        // コスト
    settings[RKK_RESSKL7] = '';       // スキル
    //予約カード８
    settings[RKK_YN_RES8] = false;    // 有効無効
    settings[RKK_RESCD8] = '';        // カード名
    settings[RKK_RESCDID8] = '';      // カードID
    settings[RKK_RESLBL8] = 1;        // ラベル
    settings[RKK_RESCST8] = 1;        // コスト
    settings[RKK_RESSKL8] = '';       // スキル
    //予約カード９
    settings[RKK_YN_RES9] = false;    // 有効無効
    settings[RKK_RESCD9] = '';        // カード名
    settings[RKK_RESCDID9] = '';      // カードID
    settings[RKK_RESLBL9] = 1;        // ラベル
    settings[RKK_RESCST9] = 1;        // コスト
    settings[RKK_RESSKL9] = '';       // スキル
    //予約カード１０
    settings[RKK_YN_RES10] = false;   // 有効無効
    settings[RKK_RESCD10] = '';       // カード名
    settings[RKK_RESCDID10] = '';     // カードID
    settings[RKK_RESLBL10] = 1;       // ラベル
    settings[RKK_RESCST10] = 1;       // コスト
    settings[RKK_RESSKL10] = '';      // スキル
    //予約カード１１
    settings[RKK_YN_RES11] = false;   // 有効無効
    settings[RKK_RESCD11] = '';       // カード名
    settings[RKK_RESCDID11] = '';     // カードID
    settings[RKK_RESLBL11] = 1;       // ラベル
    settings[RKK_RESCST11] = 1;       // コスト
    settings[RKK_RESSKL11] = '';      // スキル
    //予約カード１２
    settings[RKK_YN_RES12] = false;   // 有効無効
    settings[RKK_RESCD12] = '';       // カード名
    settings[RKK_RESCDID12] = '';     // カードID
    settings[RKK_RESLBL12] = 1;       // ラベル
    settings[RKK_RESCST12] = 1;       // コスト
    settings[RKK_RESSKL12] = '';      // スキル
    //予約カード１３
    settings[RKK_YN_RES13] = false;   // 有効無効
    settings[RKK_RESCD13] = '';       // カード名
    settings[RKK_RESCDID13] = '';     // カードID
    settings[RKK_RESLBL13] = 1;       // ラベル
    settings[RKK_RESCST13] = 1;       // コスト
    settings[RKK_RESSKL13] = '';      // スキル
    //予約カード１４
    settings[RKK_YN_RES14] = false;   // 有効無効
    settings[RKK_RESCD14] = '';       // カード名
    settings[RKK_RESCDID14] = '';     // カードID
    settings[RKK_RESLBL14] = 1;       // ラベル
    settings[RKK_RESCST14] = 1;       // コスト
    settings[RKK_RESSKL14] = '';      // スキル
    //予約カード１５
    settings[RKK_YN_RES15] = false;   // 有効無効
    settings[RKK_RESCD15] = '';       // カード名
    settings[RKK_RESCDID15] = '';     // カードID
    settings[RKK_RESLBL15] = 1;       // ラベル
    settings[RKK_RESCST15] = 1;       // コスト
    settings[RKK_RESSKL15] = '';      // スキル

    settings[DEBUGFLG] = false;       // ログ詳細
    settings[LOGCOUNT] = 50;          // ログ件数

    //遠訓貯金タブ
    settings[RKK_YN_ENBANK] = false;       // 遠訓貯金フラグ
    settings[RKK_WOOD_LIMIT] = 15000000;   // 木しきい値
    settings[RKK_STONE_LIMIT] = 15000000;  // 石しきい値
    settings[RKK_IRON_LIMIT] = 15000000;   // 鉄しきい値
    settings[RKK_RICE_LIMIT] = 15000000;   // 糧しきい値

    settings[RKK_NOTBANKVIL1] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL2] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL3] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL4] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL5] = '';        // 対象外拠点
    settings[RKK_YN_ENVIEW] = false;       // 遠訓貯金状況表示

    return settings;
}

//---------------------------//
// タブ0の設定の初期化       //
//---------------------------//
function getrkktab0Default() {
    var settings = new Object;

    // メイン
    // 使用する設定
    settings[USECONF1] = false;    // 鹵獲スキル
    settings[USECONF2] = false;    // 鹵獲パッシブ
    //設定優先順位
    settings[USEDLST1] = 1;    // 鹵獲スキル
    settings[USEDLST2] = 2;    // 鹵獲パッシブ
    //出兵拠点
    settings[ROKAKU_VIL] = '';
    settings[ROKAKU_VIL2] = '';
    settings[YN_SUBVIL] = false;
    //回復スキル使用拠点
    settings[KAIHK_VIL] = '';

    //出兵座標
    settings[WOOD_X] = '';     // 木x
    settings[WOOD_Y] = '';     // 木y
    settings[STONE_X] = '';    // 石x
    settings[STONE_Y] = '';    // 石y
    settings[IRON_X] = '';     // 鉄x
    settings[IRON_Y] = '';     // 鉄y
    settings[RICE_X] = '';     // 糧x
    settings[RICE_Y] = '';     // 糧y
    //出兵座標２
    settings[WOOD_X2] = '';    // 木x
    settings[WOOD_Y2] = '';    // 木y
    settings[STONE_X2] = '';   // 石x
    settings[STONE_Y2] = '';   // 石y
    settings[IRON_X2] = '';    // 鉄x
    settings[IRON_Y2] = '';    // 鉄y
    settings[RICE_X2] = '';    // 糧x
    settings[RICE_Y2] = '';    // 糧y
    //優先度
    settings[WOOD_RATE] = 1;    // 木
    settings[STONE_RATE] = 1;   // 石
    settings[IRON_RATE] = 1;    // 鉄
    settings[RICE_RATE] = 1;    // 糧
    settings[YN_RICE_ROKAKU] = false;
    //仁君設定
    settings[JIN_LABEL] = 1;       // ラベル
    settings[JIN_SKILLV] = 1;      // スキルレベル
    // 神医の施術設定
    settings[SEJYU_LABEL] = 1;     // ラベル
    settings[SEJYU_SKILLV] = 1;    // スキルレベル
    //弓腰姫の愛設定
    settings[KYUYOKI_LABEL] = 1;   // ラベル
    settings[KYUYOKI_SKILLV] = 1;  // スキルレベル
    //皇后の慈愛
    settings[KGJAI_LABEL] = 1;     // ラベル
    settings[KGJAI_SKILLV] = 1;    // スキルレベル
    //桃色吐息:
    settings[MOMO_LABEL] = 1;      // ラベル
    settings[MOMO_SKILLV] = 1;     // スキルレベル
    //酔吟吐息
    settings[SUIGIN_LABEL] = 1;    // ラベル
    settings[SUIGIN_SKILLV] = 1;   // スキルレベル
    //文姫の慈愛
    settings[BNKJAI_LABEL] = 1;    // ラベル
    settings[BNKJAI_SKILLV] = 1;   // スキルレベル
    //神卜の方術
    settings[SINBK_LABEL] = 1;     // ラベル
    settings[SINBK_SKILLV] = 1;    // スキルレベル
    //娘々敬慕
    settings[NNKEB_LABEL] = 1;     // ラベル
    settings[NNKEB_SKILLV] = 1;    // スキルレベル
    //熊猫の麺匠
    settings[PNDMEN_LABEL] = 1;    // ラベル
    settings[PNDMEN_SKILLV] = 1;   // スキルレベル
    // 神医の術式設定
    settings[JYUTU_LABEL] = 1;     // ラベル
    settings[JYUTU_SKILLV] = 1;    // スキルレベル
    //劉備の契り
    settings[CIGIRI_LABEL] = 1;    // ラベル
    settings[CIGIRI_SKILLV] = 1;   // スキルレベル
    //神卜の術式
    settings[BKJYUTU_LABEL] = 1;   // ラベル
    settings[BKJYUTU_SKILLV] = 1;  // スキルレベル
    //傾国設定
    settings[KEI_LABEL] = 1;       // ラベル
    settings[KEI_SKILLV] = 1;      // スキルレベル

     settings[YN_RKKAI] = false;   // ynコスト空き
     settings[RKKAICST] = 4;       // コスト空き

    //使用する回復スキル
    settings[FLERECSKIL1] = defflerecskil;
   //使用しない回復スキル
    settings[UNRECSKIL1] = defunrecskil;

    return settings;
}

//---------------------------//
// タブ1の設定の初期化       //
//---------------------------//
function getrkktab1Default() {
    var settings = new Object;
    //鹵獲スキル設定
    settings[ROKAKU_LABEL] = 1;      // ラベル
    //全軍系（１）
    settings[YN_ROKAKUZEN1] = true;  // 有効無効
    settings[ROKAKU_ZANCD1] = '';    // カード名
    settings[ROKAKU_ZANLBL1] = 1;    // ラベル
    settings[ROKAKU_ZANCST1] = 1;    // コスト
    // 全軍系（２）
    settings[YN_ROKAKUZEN2] = true;  // 有効無効
    settings[ROKAKU_ZANCD2] = '';    // カード名
    settings[ROKAKU_ZANLBL2] = 1;    // ラベル
    settings[ROKAKU_ZANCST2] = 1;    // コスト
    // 全軍系（３）
    settings[YN_ROKAKUZEN3] = true;  // 有効無効
    settings[ROKAKU_ZANCD3] = '';    // カード名
    settings[ROKAKU_ZANLBL3] = 1;    // ラベル
    settings[ROKAKU_ZANCST3] = 1;    // コスト
    // 全軍系（４）
    settings[YN_ROKAKUZEN4] = true;  // 有効無効
    settings[ROKAKU_ZANCD4] = '';    // カード名
    settings[ROKAKU_ZANLBL4] = 1;    // ラベル
    settings[ROKAKU_ZANCST4] = 1;    // コスト
    // 全軍系（５）
    settings[YN_ROKAKUZEN5] = true;  // 有効無効
    settings[ROKAKU_ZANCD5] = '';    // カード名
    settings[ROKAKU_ZANLBL5] = 1;    // ラベル
    settings[ROKAKU_ZANCST5] = 1;    // コスト
    // 出兵有無
    settings[YN_RKZENDK] = '';
    // 使用する鹵獲スキル
    settings[ROKAKU_USEDSKIL1] = true;   // 劉備の大徳
    settings[ROKAKU_USEDSKIL2] = true;   // 鬼神の鹵獲
    settings[ROKAKU_USEDSKIL3] = true;   // 猛将の鹵獲
    settings[ROKAKU_USEDSKIL4] = true;   // 趁火打劫
    settings[ROKAKU_USEDSKIL5] = true;   // 迅速劫略
    settings[ROKAKU_USEDSKIL6] = true;   // 神速劫略
    settings[ROKAKU_USEDSKIL7] = true;   // 龍神の縮地劫略
    settings[ROKAKU_USEDSKIL8] = true;   // 鬼神の縮地劫略
    settings[ROKAKU_USEDSKIL9] = true;   // 猛将の縮地劫略
    settings[ROKAKU_USEDSKIL10] = true;  // 猛暑の縮地収穫
    settings[ROKAKU_USEDSKIL11] = true;  // 桃賊の襲撃
    return settings;
}

//---------------------------//
// タブ2の設定の初期化       //
//---------------------------//
function getrkktab2Default() {
    var settings = new Object;
    // 鹵獲パッシブ
    // 鹵獲カード（１）
    settings[YN_ROKAKUP1] = true;  // 有効無効
    settings[ROKAKUP_CD1] = '';    // カード名
    settings[ROKAKUP_CST1] = 5;    //コスト
    settings[ROKAKUP_LBL1] = 1;    // ラベル
    settings[YN_USEKEI1] = true;   // 傾国使用
    // 鹵獲カード（２）
    settings[YN_ROKAKUP2] = true;  // 有効無効
    settings[ROKAKUP_CD2] = '';    // カード名
    settings[ROKAKUP_CST2] = 5;    //コスト
    settings[ROKAKUP_LBL2] = 1;    // ラベル
    settings[YN_USEKEI2] = true;   // 傾国使用
    // 鹵獲カード（３）
    settings[YN_ROKAKUP3] = true;  // 有効無効
    settings[ROKAKUP_CD3] = '';    // カード名
    settings[ROKAKUP_CST3] = 5;    //コスト
    settings[ROKAKUP_LBL3] = 1;    // ラベル
    settings[YN_USEKEI3] = true;   // 傾国使用
    // 鹵獲カード（４）
    settings[YN_ROKAKUP4] = true;  // 有効無効
    settings[ROKAKUP_CD4] = '';    // カード名
    settings[ROKAKUP_CST4] = 5;    //コスト
    settings[ROKAKUP_LBL4] = 1;    // ラベル
    settings[YN_USEKEI4] = true;   // 傾国使用
    // 鹵獲カード（５）
    settings[YN_ROKAKUP5] = true;  // 有効無効
    settings[ROKAKUP_CD5] = '';    // カード名
    settings[ROKAKUP_CST5] = 5;    //コスト
    settings[ROKAKUP_LBL5] = 1;    // ラベル
    settings[YN_USEKEI5] = true;   // 傾国使用
    // 鹵獲カード（６）
    settings[YN_ROKAKUP6] = true;  // 有効無効
    settings[ROKAKUP_CD6] = '';    // カード名
    settings[ROKAKUP_CST6] = 5;    //コスト
    settings[ROKAKUP_LBL6] = 1;    // ラベル
    settings[YN_USEKEI6] = true;   // 傾国使用
    // 鹵獲カード（７）
    settings[YN_ROKAKUP7] = true;  // 有効無効
    settings[ROKAKUP_CD7] = '';    // カード名
    settings[ROKAKUP_CST7] = 5;    //コスト
    settings[ROKAKUP_LBL7] = 1;    // ラベル
    settings[YN_USEKEI7] = true;   // 傾国使用
    // 鹵獲カード（８）
    settings[YN_ROKAKUP8] = true;  // 有効無効
    settings[ROKAKUP_CD8] = '';    // カード名
    settings[ROKAKUP_CST8] = 5;    //コスト
    settings[ROKAKUP_LBL8] = 1;    // ラベル
    settings[YN_USEKEI8] = true;   // 傾国使用
    // 鹵獲カード（９）
    settings[YN_ROKAKUP9] = true;    // 有効無効
    settings[ROKAKUP_CD9] = '';      // カード名
     settings[ROKAKUP_CST9] = 5;     // コスト
    settings[ROKAKUP_LBL9] = 1;      // ラベル
    settings[YN_USEKEI9] = true;     // 傾国使用
    // 鹵獲カード（１０）
    settings[YN_ROKAKUP10] = true;    // 有効無効
    settings[ROKAKUP_CD10] = '';      // カード名
     settings[ROKAKUP_CST10] = 5;     // コスト
    settings[ROKAKUP_LBL10] = 1;      // ラベル
    settings[YN_USEKEI10] = true;     // 傾国使用
    // 鹵獲カード（１１）
    settings[YN_ROKAKUP11] = true;    // 有効無効
    settings[ROKAKUP_CD11] = '';      // カード名
    settings[ROKAKUP_CST11] = 5;      // コスト
    settings[ROKAKUP_LBL11] = 1;      // ラベル
    settings[YN_USEKEI11] = true;     // 傾国使用
    // 鹵獲カード（１２）
    settings[YN_ROKAKUP12] = true;    // 有効無効
    settings[ROKAKUP_CD12] = '';      // カード名
    settings[ROKAKUP_CST12] = 5;      // コスト
    settings[ROKAKUP_LBL12] = 1;      // ラベル
    settings[YN_USEKEI12] = true;     // 傾国使用
    // 鹵獲カード（１３）
    settings[YN_ROKAKUP13] = true;    // 有効無効
    settings[ROKAKUP_CD13] = '';      // カード名
    settings[ROKAKUP_CST13] = 5;      // コスト
    settings[ROKAKUP_LBL13] = 1;      // ラベル
    settings[YN_USEKEI13] = true;     // 傾国使用
    //設定
    settings[YN_RKPJIN] = true;    // 仁君使用有無
    settings[RKPJINHP] = 80;       // 仁君使用HP
    //使用する回復スキル
    settings[RECSKIL2] = defrecskil;
   //使用しない回復スキル
    settings[UNRECSKIL2] = defunrecskil;

    //全軍系（１）
    settings[YN_ROKAKUPZEN1] = true;  // 有効無効
    settings[ROKAKUP_ZANCD1] = '';    // カード名
    settings[ROKAKUP_ZANLBL1] = 1;    // ラベル
    settings[ROKAKUP_ZANCST1] = 1;    // コスト
    //全軍系（２）
    settings[YN_ROKAKUPZEN2] = true;  // 有効無効
    settings[ROKAKUP_ZANCD2] = '';    // カード名
    settings[ROKAKUP_ZANLBL2] = 1;    // ラベル
    settings[ROKAKUP_ZANCST2] = 1;    // コスト
    //全軍系（３）
    settings[YN_ROKAKUPZEN3] = true;  // 有効無効
    settings[ROKAKUP_ZANCD3] = '';    // カード名
    settings[ROKAKUP_ZANLBL3] = 1;    // ラベル
    settings[ROKAKUP_ZANCST3] = 1;    // コスト
    //全軍系（４）
    settings[YN_ROKAKUPZEN4] = true;  // 有効無効
    settings[ROKAKUP_ZANCD4] = '';    // カード名
    settings[ROKAKUP_ZANLBL4] = 1;    // ラベル
    settings[ROKAKUP_ZANCST4] = 1;    // コスト
    //全軍系（５）
    settings[YN_ROKAKUPZEN5] = true;  // 有効無効
    settings[ROKAKUP_ZANCD5] = '';    // カード名
    settings[ROKAKUP_ZANLBL5] = 1;    // ラベル
    settings[ROKAKUP_ZANCST5] = 1;    // コスト
    settings[YN_RKPZENDK] = true;     // 出兵有無

    //帰還時間で回復
    settings[YN_JINKIKAN] = false;
    settings[RKPJINKIKAN] = '180';

    return settings;
}

//---------------------------//
// タブ3の設定の初期化       //
//---------------------------//
function getrkktab3Default() {
    var settings = new Object;
    //入替予約
    settings[RKK_RES_VIL] = '';       // セット拠点
    settings[RKK_RES_MON] = '';       // 月
    settings[RKK_RES_DAY] = '';       // 日
    settings[RKK_RES_HOUR] = '';      // 時
    settings[RKK_RES_MIN] = '';       // 分
    //予約カード１
    settings[RKK_YN_RES1] = false;    // 有効無効
    settings[RKK_RESCD1] = '';        // カード名
    settings[RKK_RESCDID1] = '';      // カードID
    settings[RKK_RESLBL1] = 1;        // ラベル
    settings[RKK_RESCST1] = 1;        // コスト
    settings[RKK_RESSKL1] = '';       // スキル
    //予約カード２
    settings[RKK_YN_RES2] = false;    // 有効無効
    settings[RKK_RESCD2] = '';        // カード名
    settings[RKK_RESCDID2] = '';      // カードID
    settings[RKK_RESLBL2] = 1;        // ラベル
    settings[RKK_RESCST2] = 1;        // コスト
    settings[RKK_RESSKL2] = '';       // スキル
    //予約カード３
    settings[RKK_YN_RES3] = false;    // 有効無効
    settings[RKK_RESCD3] = '';        // カード名
    settings[RKK_RESCDID3] = '';      // カードID
    settings[RKK_RESLBL3] = 1;        // ラベル
    settings[RKK_RESCST3] = 1;        // コスト
    settings[RKK_RESSKL3] = '';       // スキル
    //予約カード４
    settings[RKK_YN_RES4] = false;    // 有効無効
    settings[RKK_RESCD4] = '';        // カード名
    settings[RKK_RESCDID4] = '';      // カードID
    settings[RKK_RESLBL4] = 1;        // ラベル
    settings[RKK_RESCST4] = 1;        // コスト
    settings[RKK_RESSKL4] = '';       // スキル
    //予約カード５
    settings[RKK_YN_RES5] = false;    // 有効無効
    settings[RKK_RESCD5] = '';        // カード名
    settings[RKK_RESCDID5] = '';      // カードID
    settings[RKK_RESLBL5] = 1;        // ラベル
    settings[RKK_RESCST5] = 1;        // コスト
    settings[RKK_RESSKL5] = '';       // スキル
    //予約カード６
    settings[RKK_YN_RES6] = false;    // 有効無効
    settings[RKK_RESCD6] = '';        // カード名
    settings[RKK_RESCDID6] = '';      // カードID
    settings[RKK_RESLBL6] = 1;        // ラベル
    settings[RKK_RESCST6] = 1;        // コスト
    settings[RKK_RESSKL6] = '';       // スキル
    //予約カード７
    settings[RKK_YN_RES7] = false;    // 有効無効
    settings[RKK_RESCD7] = '';        // カード名
    settings[RKK_RESCDID7] = '';      // カードID
    settings[RKK_RESLBL7] = 1;        // ラベル
    settings[RKK_RESCST7] = 1;        // コスト
    settings[RKK_RESSKL7] = '';       // スキル
    //予約カード８
    settings[RKK_YN_RES8] = false;    // 有効無効
    settings[RKK_RESCD8] = '';        // カード名
    settings[RKK_RESCDID8] = '';      // カードID
    settings[RKK_RESLBL8] = 1;        // ラベル
    settings[RKK_RESCST8] = 1;        // コスト
    settings[RKK_RESSKL8] = '';       // スキル
    //予約カード９
    settings[RKK_YN_RES9] = false;    // 有効無効
    settings[RKK_RESCD9] = '';        // カード名
    settings[RKK_RESCDID9] = '';      // カードID
    settings[RKK_RESLBL9] = 1;        // ラベル
    settings[RKK_RESCST9] = 1;        // コスト
    settings[RKK_RESSKL9] = '';       // スキル
    //予約カード１０
    settings[RKK_YN_RES10] = false;   // 有効無効
    settings[RKK_RESCD10] = '';       // カード名
    settings[RKK_RESCDID10] = '';     // カードID
    settings[RKK_RESLBL10] = 1;       // ラベル
    settings[RKK_RESCST10] = 1;       // コスト
    settings[RKK_RESSKL10] = '';      // スキル
    //予約カード１１
    settings[RKK_YN_RES11] = false;   // 有効無効
    settings[RKK_RESCD11] = '';       // カード名
    settings[RKK_RESCDID11] = '';     // カードID
    settings[RKK_RESLBL11] = 1;       // ラベル
    settings[RKK_RESCST11] = 1;       // コスト
    settings[RKK_RESSKL11] = '';      // スキル
    //予約カード１２
    settings[RKK_YN_RES12] = false;   // 有効無効
    settings[RKK_RESCD12] = '';       // カード名
    settings[RKK_RESCDID12] = '';     // カードID
    settings[RKK_RESLBL12] = 1;       // ラベル
    settings[RKK_RESCST12] = 1;       // コスト
    settings[RKK_RESSKL12] = '';      // スキル
    //予約カード１３
    settings[RKK_YN_RES13] = false;   // 有効無効
    settings[RKK_RESCD13] = '';       // カード名
    settings[RKK_RESCDID13] = '';     // カードID
    settings[RKK_RESLBL13] = 1;       // ラベル
    settings[RKK_RESCST13] = 1;       // コスト
    settings[RKK_RESSKL13] = '';      // スキル
    //予約カード１４
    settings[RKK_YN_RES14] = false;   // 有効無効
    settings[RKK_RESCD14] = '';       // カード名
    settings[RKK_RESCDID14] = '';     // カードID
    settings[RKK_RESLBL14] = 1;       // ラベル
    settings[RKK_RESCST14] = 1;       // コスト
    settings[RKK_RESSKL14] = '';      // スキル
    //予約カード１５
    settings[RKK_YN_RES15] = false;   // 有効無効
    settings[RKK_RESCD15] = '';       // カード名
    settings[RKK_RESCDID15] = '';     // カードID
    settings[RKK_RESLBL15] = 1;       // ラベル
    settings[RKK_RESCST15] = 1;       // コスト
    settings[RKK_RESSKL15] = '';      // スキル

    return settings;
}


//---------------------------//
// タブ6の設定の初期化       //
//---------------------------//
function getrkktab6Default() {
    var settings = new Object;
    //メイン２
    //簡易出兵先名
    settings[YN_BMNAME] = false;       // 有効無効
    //カード座標時指定(１)
    settings[YN_DECAREA1] = false;     // 有効無効
    settings[DECAREACD1] = '';         // カード名
    settings[DECAREA1_X] = '';         // x軸
    settings[DECAREA1_Y] = '';         // y軸
    settings[DECNOTE1] = '';           // メモ
    //カード座標時指定(２)
    settings[YN_DECAREA2] = false;     // 有効無効
    settings[DECAREACD2] = '';         // カード名
    settings[DECAREA2_X] = '';         // x軸
    settings[DECAREA2_Y] = '';         // y軸
    settings[DECNOTE2] = '';           // メモ
    //カード座標時指定(３)
    settings[YN_DECAREA3] = false;     // 有効無効
    settings[DECAREACD3] = '';         // カード名
    settings[DECAREA3_X] = '';         // x軸
    settings[DECAREA3_Y] = '';         // y軸
    settings[DECNOTE3] = '';           // メモ
    //カード座標時指定(４)
    settings[YN_DECAREA4] = false;     // 有効無効
    settings[DECAREACD4] = '';         // カード名
    settings[DECAREA4_X] = '';         // x軸
    settings[DECAREA4_Y] = '';         // y軸
    settings[DECNOTE4] = '';           // メモ
    //カード座標時指定(５)
    settings[YN_DECAREA5] = false;     // 有効無効
    settings[DECAREACD5] = '';         // カード名
    settings[DECAREA5_X] = '';         // x軸
    settings[DECAREA5_Y] = '';         // y軸
    settings[DECNOTE5] = '';           // メモ
    //カード座標時指定(６)
    settings[YN_DECAREA6] = false;     // 有効無効
    settings[DECAREACD6] = '';         // カード名
    settings[DECAREA6_X] = '';         // x軸
    settings[DECAREA6_Y] = '';         // y軸
    settings[DECNOTE6] = '';           // メモ
    //カード座標時指定(７)
    settings[YN_DECAREA7] = false;     // 有効無効
    settings[DECAREACD7] = '';         // カード名
    settings[DECAREA7_X] = '';         // x軸
    settings[DECAREA7_Y] = '';         // y軸
    settings[DECNOTE7] = '';           // メモ
    //カード座標時指定(８)
    settings[YN_DECAREA8] = false;     // 有効無効
    settings[DECAREACD8] = '';         // カード名
    settings[DECAREA8_X] = '';         // x軸
    settings[DECAREA8_Y] = '';         // y軸
    settings[DECNOTE8] = '';           // メモ
    //カード座標時指定(９)
    settings[YN_DECAREA9] = false;     // 有効無効
    settings[DECAREACD9] = '';         // カード名
    settings[DECAREA9_X] = '';         // x軸
    settings[DECAREA9_Y] = '';         // y軸
    settings[DECNOTE9] = '';           // メモ
    //カード座標時指定(１０)
    settings[YN_DECAREA10] = false;    // 有効無効
    settings[DECAREACD10] = '';        // カード名
    settings[DECAREA10_X] = '';        // x軸
    settings[DECAREA10_Y] = '';        // y軸
    settings[DECNOTE10] = '';          // メモ
    //しきい値攻撃
    settings[YN_ATTKCHK] = false;      // 有効無効
    settings[ATTKCHK] = '';            // 攻撃値
    //しきい値速度
    settings[YN_SPEEDCHK] = false;     // 有効無効
    settings[SPEEDCHK] = '';           // 速度値

    // 自動寄付
    settings[RKK_YN_AUTODONATION] = false;    // 遠訓貯金フラグ
    settings[RKK_AD_WOOD_LIMIT] = 20000000;   // 木しきい値
    settings[RKK_AD_STONE_LIMIT] = 20000000;  // 石しきい値
    settings[RKK_AD_IRON_LIMIT] = 20000000;   // 鉄しきい値
    settings[RKK_AD_RICE_LIMIT] = 20000000;   // 糧しきい値
    settings[RKK_AD_WOOD] = 0;                // 木寄付額
    settings[RKK_AD_STONE] = 0;               // 石寄付額
    settings[RKK_AD_IRON] = 0;                // 鉄寄付額
    settings[RKK_AD_RICE] = 0;                // 糧寄付額

    return settings;
}

//---------------------------//
// タブ7の設定の初期化       //
//---------------------------//
function getrkktab7Default() {
    var settings = new Object;
    //遠訓貯金タブ
    settings[RKK_YN_ENBANK] = false;       // 遠訓貯金フラグ
    settings[RKK_WOOD_LIMIT] = 15000000;   // 木しきい値
    settings[RKK_STONE_LIMIT] = 15000000;  // 石しきい値
    settings[RKK_IRON_LIMIT] = 15000000;   // 鉄しきい値
    settings[RKK_RICE_LIMIT] = 15000000;   // 糧しきい値

    settings[RKK_NOTBANKVIL1] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL2] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL3] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL4] = '';        // 対象外拠点
    settings[RKK_NOTBANKVIL5] = '';        // 対象外拠点

    settings[RKK_YN_ENVIEW] = false;       // 遠訓貯金状況表示

    return settings;
}
//---------------------------//
// タブ8の設定の初期化       //
//---------------------------//
function getrkktab8Default() {
    var settings = new Object;
    //鹵獲開始時間予約
    settings[RKK_RES_STARTMON] = '';   // 月
    settings[RKK_RES_STARTDAY] = '';   // 日
    settings[RKK_RES_STARTHOUR] = '';  // 時
    settings[RKK_RES_STARTMIN] = '';   // 分
    //鹵獲停止時間予約
    settings[RKK_RES_STOPMON] = '';    // 月
    settings[RKK_RES_STOPDAY] = '';    // 日
    settings[RKK_RES_STOPHOUR] = '';   // 時
    settings[RKK_RES_STOPMIN] = '';    // 分
    //鹵獲再開時間予約
    settings[RKK_RES_RESTARTMON] = '';  // 月
    settings[RKK_RES_RESTARTDAY] = '';  // 日
    settings[RKK_RES_RESTARTHOUR] = ''; // 時
    settings[RKK_RES_RESTARTMIN] = '';  // 分

    return settings;
}
//----------------------//
// Greasemonkey Wrapper //
//----------------------//
function rinitGMWrapper() {
  // @copyright    2009, James Campos
  // @license    cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
  if ((typeof GM_getValue === 'undefined') || (GM_getValue('a', 'b') === undefined)) {
    GM_addStyle = function (css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.getElementsByTagName('head')[0].appendChild(style);
    };
    GM_deleteValue = function (name) {
      sessionStorage.removeItem(name);
      localStorage.removeItem(name);
    };
    GM_getValue = function (name, defaultValue) {
      var value;
      value = sessionStorage.getItem(name);
      if (!value) {
        value = localStorage.getItem(name);
        if (!value) {
          return defaultValue;
        }
      }
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
    };
    GM_log = function (message) {
      if (window.opera) {
        opera.postError(message);
        return;
      }
      console.log(message);
    };
    GM_registerMenuCommand = function (name, funk) {
      //todo
    };
    GM_setValue = function (name, value) {
      value = (typeof value)[0] + value;
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        localStorage.removeItem(name);
        sessionStorage.setItem(name, value);
        throw e;
      }
    };
  }
}

// source: http://stackoverflow.com/questions/10687746/getcookie-returns-null
function rgetCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//Beyond系save, load関数
function rsaveData(key, value, ev)
{
    if( ev ) {
        if (window.opera || typeof JSON != 'object') {
            value = toJSON(value);
        }
        else {
            value = JSON.stringify( value );
        }
    }
    GM_setValue(key, value );
}

function rloadData(key, value, ev)
{
    var ret = GM_getValue(key, value);

    if (window.chrome) { // 2015.05.23
        return ev ? eval(eval('ret='+ret)) : ret;
    } else {
        return ev ? eval('ret='+ret) : ret;
    }
}

function rkwait(sec) {
    // jQueryのDeferredを作成
    var objDef = new j$.Deferred;
    setTimeout(function () {
        // sec秒後に、resolve()を実行して、Promiseを完了
        objDef.resolve(sec);
    }, sec*1000);
    return objDef.promise();
};
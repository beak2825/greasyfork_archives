// ==UserScript==
// @name       bro3_expedition_tool
// @namespace   bro3_expedition_tool
// @description   ブラウザ三国志 遠征
// @include        https://*.3gokushi.jp/*
// @include        http://*.3gokushi.jp/*
// @exclude        https://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude        http://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude        https://*.3gokushi.jp/maintenance*
// @exclude        http://*.3gokushi.jp/maintenance*
// @exclude        https://info.3gokushi.jp/*
// @exclude        http://info.3gokushi.jp/*
// @version     1.13
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

// @downloadURL https://update.greasyfork.org/scripts/371214/bro3_expedition_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/371214/bro3_expedition_tool.meta.js
// ==/UserScript==
// version date       author
// 1.1    2018/02/21  作成開始
// 1.10    2018/08/15  プロトコル変更対応
// 1.11    2018/08/19  イベ鯖対応
// 1.12    2018/09/04  NPC領地出兵対応
// 1.13    2018/11/20  出兵確認画面表示のパラメータ変更

// load jQuery
jQuery.noConflict();
j$ = jQuery;

// GreaseMonkeyラッパー関数の定義
betinitGMWrapper();

//----------//
// 変数定義 //
//----------//
// ソフトウェアバージョン
var VERSION = "1.13";
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
// 特殊定数
var PROTOCOL = location.protocol;
var HOST = location.hostname;        // アクセスURLホスト
var SERVICE = '';                    // サービス判定が必要な場合に使用する予約定数
var SVNAME = HOST.substr(0,location.hostname.indexOf(".")) + SERVICE;
var BET_GM_KEY = "BET11_" + HOST.substr(0,HOST.indexOf("."));

var bet_hpnum=13;
var bet_statngnum=5;

//使用する設定
var BET_EXPEDITIONVIL = 'bet_expeditionvil';      //出兵拠点
var BET_YN_HP = 'bet_yn_hp';    //HP回復をするか
var BET_HP_LOWER = 'bet_hp_lower';    //HP回復値
var BET_HP_HIGHER = 'bet_hp_higher';  //HP回復値
var BET_SPEED_LOWER = 'bet_speed_lower';  //速度下限値
var BET_YN_SPEED = 'bet_yn_speed';  //速度チェックをするか
var BET_FLERECSKIL1 = 'bet_flerecskil1'; //使用する回復スキル
var BET_UNRECSKIL1 = 'bet_unrecskil1'//使用しない回復スキル

//仁君設定
var BET_JIN_LABEL = 'bet_jin_label';           // ラベル
var BET_JIN_SKILLV = 'bet_jin_skillv';         // スキルレベル
// 神医の施術設定
var BET_SEJYU_LABEL = 'bet_sejyu_label';       // ラベル
var BET_SEJYU_SKILLV = 'bet_sejyu_skillv';     // スキルレベル
//弓腰姫の愛設定
var BET_KYUYOKI_LABEL = 'bet_kyuyoki_label';   // ラベル
var BET_KYUYOKI_SKILLV = 'bet_kyuyoki_skillv'; // スキルレベル
//皇后の慈愛
var BET_KGJAI_LABEL = 'bet_kgjai_label';       // ラベル
var BET_KGJAI_SKILLV = 'bet_kgjai_skillv';     // スキルレベル
//桃色吐息:
var BET_MOMO_LABEL = 'bet_momo_label';         // ラベル
var BET_MOMO_SKILLV = 'bet_momo_skillv';       // スキルレベル
//酔吟吐息
var BET_SUIGIN_LABEL = 'bet_suigin_label';     // ラベル
var BET_SUIGIN_SKILLV = 'bet_suigin_skillv';   // スキルレベル
//文姫の慈愛
var BET_BNKJAI_LABEL = 'bet_bnkjai_label';     // ラベル
var BET_BNKJAI_SKILLV = 'bet_bnkjai_skillv';   // スキルレベル
//神卜の方術
var BET_SINBK_LABEL = 'bet_sinbk_label';       // ラベル
var BET_SINBK_SKILLV = 'bet_sinbk_skillv';     // スキルレベル
//娘々敬慕
var BET_NNKEB_LABEL = 'bet_nnkeb_label';       // ラベル
var BET_NNKEB_SKILLV = 'bet_nnkeb_skillv';     // スキルレベル
//熊猫の麺匠
var BET_PNDMEN_LABEL = 'bet_pndmen_label';     // ラベル
var BET_PNDMEN_SKILLV = 'bet_pndmen_skillv';   // スキルレベル
// 神医の術式設定
var BET_JYUTU_LABEL = 'bet_jyutu_label';       // ラベル
var BET_JYUTU_SKILLV = 'bet_jyutu_skillv';     // スキルレベル
//劉備の契り
var BET_CIGIRI_LABEL = 'bet_cigiri_label';     // ラベル
var BET_CIGIRI_SKILLV = 'bet_cigiri_skillv';   // スキルレベル
//神卜の術式
var BET_BKJYUTU_LABEL = 'bet_bkjyutu_label';   // ラベル
var BET_BKJYUTU_SKILLV = 'bet_bkjyutu_skillv'; // スキルレベル

//ログ
var BET_LOGCOUNT = 'bet_logcount';
var BET_DEBUGFLG = 'bet_debugflg';

// オプション設定管理用
var m_expedition_options;
var bet_time;
var betVilSelectValues = { };
var betLabelSelectValues = { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10","11":"11","12":"12","13":"13","14":"14" };
var betLevelSelectValues= { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10" };
var bet_defrecskil = { "1":"仁君",  "2":"神医の施術",  "3":"弓腰姫の愛",  "4":"皇后の慈愛",  "5":"桃色吐息",
                    "6":"酔吟吐息",  "7":"文姫の慈愛",  "8":"神卜の方術",  "9":"娘々敬慕",  "10":"神医の術式",  "11":"劉備の契り",  "12":"神卜の術式",  "13":"熊猫の麺匠"};
var bet_defunrecskil = { };
var bet_waitskillist = [ "仁君", "皇后の慈愛", "文姫の慈愛"];

// 保存データデリミタ
var BET_DELIMIT = "#$%&?@";

//----------------//
// メインルーチン //
//----------------//
(function() {
    //前回のリロードから30分以上経っていればツールOFF
    var dt = new Date();
    var dt2=GM_getValue(BET_GM_KEY + '_chktime', null);
    if (dt2!=null){
        var diff = dt.getTime() - Date.parse(dt2);
        var minute = diff/(1000*60);
        if (minute>30){
            GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
        }
    } else {
        GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
    }
    GM_setValue(BET_GM_KEY + '_chktime', dt);

    // 実行判定
    if (betisExecute() === false) {
        return;
    }
    //設定画面描写
    loadExpeditionSettings();
    createExpeditionSettingWindow();
    // 君主プロフィール
    if (location.pathname == "/user/" || location.pathname == "/user/index.php") {
        bet_saveUserProfile();
    }
    // 都市画面
    if (location.pathname == "/village.php") {
        // セッションIDの取得
        var session_id = betgetSessionId();
        if (session_id === "" ){
            alert("ページの仕様が変更されたため情報が取れませんでした。");
            return;
        }
        // 出兵処理
        if(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false)==true){
            expeditiontoolstart();
        }
    }
})();

//--------------------//
// スクリプト実行判定 //
//--------------------//
function betisExecute() {
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
//------------------//
// セッションID取得 //
//------------------//
function betgetSessionId() {
    return betgetCookie('SSID');
}

//------------------------//
// プロフィール情報を保存 //
//------------------------//
function bet_saveUserProfile(targetObject){
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

    var savedVillageList = bet_loadData(BET_GM_KEY+"_VillageList", "[]", true);   // 保存された拠点情報
    if (savedVillageList.length === 0) {
        villageList[0].roundgo = true;
    }

    // 拠点情報の保存
    bet_saveData(BET_GM_KEY+"_VillageList", villageList, true);
    var l_villageList = bet_loadData(BET_GM_KEY+"_VillageList", "[]", true);
    console.log(l_villageList);

    //同盟名取得
    var l_domei =j$("table[class=commonTables] td:has(a[href*='alliance/info.php'])", target).eq(0).text().trim();
    console.log(l_domei);
    //設定のロード
    loadExpeditionSettings();
    m_expedition_options[BET_DOMEI]=l_domei;
    var options=m_expedition_options;
    //設定を保存
    GM_setValue(BET_GM_KEY + '_expedition_options', JSON.stringify(options));
}

// 出兵ツールの設定のロード
function loadExpeditionSettings() {
    // 保存データの取得
    var obj = GM_getValue(BET_GM_KEY + '_expedition_options', null);
    var options;
    if (obj == null) {
        options = getExpeditionDefaultOptions();
    } else {
        options = JSON.parse(obj);
    }

    // 保存データにデフォルト設定の情報がない場合、デフォルト設定を追加
    var defaults = getExpeditionDefaultOptions();
    for (var key in defaults) {
        if (typeof options[key] == "undefined") {
            options[key] = defaults[key];
        }
    }
    m_expedition_options = options;
}
//--------------//
// 設定画面作成 //
//--------------//
function createExpeditionSettingWindow() {
    //css定義を追加
    addExpeditionCss();
    //画面描画(設定画面)
    ExpeditiondrawSettingButton();
    //出兵ボタン設定
    setExpeditionAutoflag();
}

//----------------------------------//
//出兵ツール設定画面起動ボタンを描画      //
//----------------------------------//
function ExpeditiondrawSettingButton() {
    j$("#sidebar").prepend(
        "<span style=\"color: #ffffff;\"><a href='#' id=expeditiontoolButton class='expeditiontoollink'>遠征設定</a></span> \
         <button type=button id=btn_expedition style=\"width:70px;\">実行する</button>"
    );
    drawSetExpeditionWindow();
    bet_btnchange();
    j$("#expeditiontoolButton").on("click", function(){
        var villageList = bet_loadData(BET_GM_KEY+"_VillageList", "[]", true);
        if (villageList.length === 0) {
            alert("プロフィールページにアクセスして、拠点情報の読み込みを行ってください。");
        } else {
            loadExpeditionSettings();
            // 保存されているoption設定を設定画面に反映
            for (var key in m_expedition_options) {
                if (j$("#" + key).length > 0) {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', m_expedition_options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(m_expedition_options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == m_expedition_options[key];}).prop('selected', true);
                    }
                }
            }
            //出兵座標
            var l_zahyo=new Array();
            var l_entzahyo=GM_getValue(BET_GM_KEY + '_entzahyo', "");
            if (l_entzahyo!=""){
                l_zahyo = GM_getValue(BET_GM_KEY + '_entzahyo',"").split(BET_DELIMIT);
                var l_zahyolen=l_zahyo.length;
                var EXPEDITION_ZHO="";
                for (var i = 0; i < l_zahyolen; i++) {
                    EXPEDITION_ZHO = EXPEDITION_ZHO + l_zahyo[i] + "\n";
                }
                j$("#bet_entarea").val(EXPEDITION_ZHO);
            }
            //ログ取得
            var l_log=new Array();
            var l_chklog=GM_getValue(BET_GM_KEY + '_expeditionlog', "");
            if (l_chklog!=""){
                l_log = GM_getValue(BET_GM_KEY + '_expeditionlog', []).split(',');
                var l_loglen=l_log.length;
                var EXPEDITION_LOG="";
                for (var i=l_loglen; i--;){
                    EXPEDITION_LOG = EXPEDITION_LOG + l_log[i] + "\n";
                }
                j$("#bet_logarea").val(EXPEDITION_LOG);
            }
            j$("#expedition_setting_view").css({'display':'block'});
        }
    });
}
function setExpeditionAutoflag(){
    console.log(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false));
    if(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false)==true){
        j$("#btn_expedition").text("実行中");
    }else{
        j$("#btn_expedition").text("実行する");
    }
}
//--------------------//
// 出兵実行ボタン     //
//--------------------//
function bet_btnchange(){
    j$("#btn_expedition").on("click",function(){
        console.log(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false));
        if(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false)==true){
            j$(this).text("実行する");
            GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
            console.log(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false));
        }else{
            j$(this).text("実行中");
            GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", true);
            bet_setlblpage();
        }
        location.reload();
    });
}

//-----------------------//
// 出兵処理実行          //
//-----------------------//
function expeditiontoolstart(){
    //出兵拠点へ移動
    j$("div[class='sideBoxInner basename'] ul li").each(
        function(index){
            var current = false;
            if (j$(this).attr("class") == 'on') {
                current = true;
            }
            var search;
            if (current == true) {
                if (m_expedition_options[BET_DEBUGFLG]==true){
                    var l_txt = j$("span", this).eq(0).text().replace( /,/g , "." );
                    bet_setexpeditionlog("出兵拠点：" + l_txt);
                }
                if (j$("span", this).eq(0).text() == m_expedition_options[BET_EXPEDITIONVIL]) {
                    expedition_main();
                }
            } else {
                if (m_expedition_options[BET_DEBUGFLG]==true){
                    var l_txt = j$("a", this).eq(0).text().replace( /,/g , "." );
                    bet_setexpeditionlog("拠点：" + l_txt);
                }
                if (j$("a", this).eq(0).text() == m_expedition_options[BET_EXPEDITIONVIL]) {
                    console.log(j$("a", this).eq(0).attr('href'));
                    location.href = PROTOCOL　+ "//" + HOST + j$("a", this).eq(0).attr('href');
                }
            }
        }
    );
}

//-----------------------//
// 遠征出兵処理          //
//-----------------------//
function expedition_main(){
    var l_chk=0;
    var l_flg=0;
    var l_atkcnt=bet_chkatkcnt();//出兵中の件数チェック(名声チェックに使用)
    var l_fame=bet_getcntfame();//名声チェック
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("出兵件数：" + String(l_atkcnt));}
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("名声数：" + String(l_fame));}

    //名声数Check
    if (((l_fame-l_atkcnt)>-1) && (l_fame>0)){
        bet_getdecklist();                      //デッキのカードを取得
        //待機中のカードが存在するかどうか
        if (bet_chkcdwait()==1){
            //HP回復チェック
            if (bet_chkcare()==0){
                //出兵処理
                l_chk=bet_cdtrol();
                if (l_chk==0){
                    //出兵先を一行目を消す
                    bet_setexpeditionzahyo();
                    l_flg=1;
                }
            }
        }
    }
    //リロード
    if(GM_getValue(BET_GM_KEY +"_ExpeditionAutoFlg", false)==true){
        if (l_flg==1){
            location.reload();
        } else {
            bet_wait(30).done(function(){
                location.reload();
            });
        }
    }
}

//-------------------------------//
// 出兵中のカードの件数取得        //
//-------------------------------//
function bet_chkatkcnt(){
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("出兵中の件数を取得する");}
    var items = j$("#action div[class='floatInner'] li");

    for (var i = 0; i < items.length; i++) {
        if (items.eq(i).text().indexOf('出撃')!= -1) {
            items.eq(i).text().match(/出撃\s(\d+)\s残り/);
            var l_ret = RegExp.$1;
            console.log(l_ret);
            return parseInt(l_ret, 10);
        }
    }
    return 0;
 }

//------------------//
// 名声数取得        //
//------------------//
function bet_getcntfame(){
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("名声数を取得する");}
    var items = j$("#status_resources ul[class='resorces'] li[class='fame']");

    for (var i = 0; i < items.length; i++) {
        items.eq(i).text().match(/(\d+)\s\/\s(\d+)/);
        var l_ret = RegExp.$1;
        console.log(l_ret);
        return parseInt(l_ret, 10);
    }
    return 0;
 }

//-------------------------------//
// 待機中のカードが存在するか    //
//-------------------------------//
function bet_chkcdwait(){
    console.log("待機中のカードが存在するかチェック開始");
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("待機中のカードが存在するかチェック開始");}
    var l_chk = 0;
    var deckList = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);
    if(deckList.length != 0){
        for(var d= 0; d < deckList.length; d++) {
            if (deckList[d].setsta.match(/待機中/) && (deckList[d].setvil==m_expedition_options[BET_EXPEDITIONVIL])){
                if (m_expedition_options[BET_DEBUGFLG]==true){
                    bet_setexpeditionlog(deckList[d].name+":待機中のカード");
                }
                l_chk = 1;
                return l_chk;
            }
        }
    }
    return l_chk;
 }

//-------------------------------//
// HP回復が必要かチェック          //
//-------------------------------//
function bet_chkcare(){
    var l_chk=0;
    var l_ret=0;
    var deckList = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);
    //HP回復処理が必要かチェック
    if (m_expedition_options[BET_YN_HP]==true){
        l_chk=0;
        if (deckList.length != 0 ) {
            for(var d=0; d < deckList.length; d++) {
                //拠点に待機中のHP(設定値)以下のカードが存在する
                console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                if ((deckList[d].setsta.match(/待機中/))  && (parseInt(deckList[d].hp)<parseInt(m_expedition_options[BET_HP_LOWER])) && (deckList[d].setvil==m_expedition_options[BET_EXPEDITIONVIL])) {
                    var txt="カード:"+ deckList[d].cdid + " " + deckList[d].name+" HP:" + deckList[d].hp+" HP回復要";
                    bet_setexpeditionlog(txt);
                    l_chk=1;
                }
            }
        }
        if (l_chk==1){
            var l_set=0;
            do {
                var l_chk1=0
                l_ret=bet_hpcare('BET_FLERECSKIL1');
                if ((l_ret==1)||(l_ret==2)||(l_ret==3)) {
                    //回復カードなし(l_ret==1),出兵中が存在(l_ret==2),内政武将がいたり回復拠点なくてNG(l_ret==3)
                    break;
                }
                //しきい値以上になるまで繰り返し
                var deckList1 = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);
                if (deckList1.length != 0 ) {
                    for(var d=0; d < deckList1.length; d++) {
                        //拠点に待機中のHP(設定値)以下のカードが存在する
                        console.log("カード名:"+ deckList1[d].name + " 状態:"+ deckList1[d].setsta + " HP:"+ deckList1[d].hp);
                        if ((deckList1[d].setsta.match(/待機中/))  && (parseInt(deckList1[d].hp)<parseInt(m_expedition_options[BET_HP_HIGHER])) && (deckList1[d].setvil==m_expedition_options[BET_EXPEDITIONVIL])) {
                            var txt="カード:"+ deckList[d].cdid + " " + deckList[d].name+" HP:" + deckList[d].hp+" HP回復要";
                            bet_setexpeditionlog(txt);
                            l_chk1=1;
                        }
                    }
                    if (l_chk1==0){
                        l_set=1;
                    }
                }
            } while (l_set<1)
        }
    }
    return l_ret;
}
//------------------------------//
//  HP回復処理                  //
//------------------------------//
function bet_hpcare(cdlist){
    console.log("HP回復処理開始");
    //回復拠点に内政設定武将が存在する
    var deckList = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);
    if (deckList.length != 0 ) {
        for(var d=0; d < deckList.length; d++) {
            if ((deckList[d].setsta.indexOf("内政セット済") != -1) && (m_expedition_options[BET_EXPEDITIONVIL]==deckList[d].setvil)){
                bet_setexpeditionlog("回復拠点に内政武将が存在します");
                GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
                return 3;
            }
        }
    }
    var CDLST = eval(cdlist);
    var obj = m_expedition_options[CDLST];
    var l_rank=false;
    var l_chk=0;
    var l_status=0;
    var l_ckNgnum=0;
    Label1:
    for(var k in obj){
        console.log(obj[k] + "のスキルを探す");
        if (m_expedition_options[BET_DEBUGFLG]==true){
            var txt=obj[k] + "のスキルを探す処理を開始";
            bet_setexpeditionlog(txt);
        }
        var kailabl="";
        var kailevel="";
        var kaipage="";
        l_chk=0;
        if (obj[k]=="仁君"){kailabl=m_expedition_options[BET_JIN_LABEL]; kailevel=m_expedition_options[BET_JIN_SKILLV];}
        else if (obj[k]=="神医の施術"){kailabl=m_expedition_options[BET_SEJYU_LABEL]; kailevel=m_expedition_options[BET_SEJYU_SKILLV]; }
        else if (obj[k]=="弓腰姫の愛"){kailabl=m_expedition_options[BET_KYUYOKI_LABEL]; kailevel=m_expedition_options[BET_KYUYOKI_SKILLV]; }
        else if (obj[k]=="皇后の慈愛"){kailabl=m_expedition_options[BET_KGJAI_LABEL]; kailevel=m_expedition_options[BET_KGJAI_SKILLV]; }
        else if (obj[k]=="桃色吐息"){kailabl=m_expedition_options[BET_MOMO_LABEL]; kailevel=m_expedition_options[BET_MOMO_SKILLV]; }
        else if (obj[k]=="酔吟吐息"){kailabl=m_expedition_options[BET_SUIGIN_LABEL]; kailevel=m_expedition_options[BET_SUIGIN_SKILLV]; }
        else if (obj[k]=="文姫の慈愛"){kailabl=m_expedition_options[BET_BNKJAI_LABEL]; kailevel=m_expedition_options[BET_BNKJAI_SKILLV];}
        else if (obj[k]=="神卜の方術"){kailabl=m_expedition_options[BET_SINBK_LABEL]; kailevel=m_expedition_options[BET_SINBK_SKILLV];}
        else if (obj[k]=="娘々敬慕"){kailabl=m_expedition_options[BET_NNKEB_LABEL]; kailevel=m_expedition_options[BET_NNKEB_SKILLV];}
        else if (obj[k]=="熊猫の麺匠"){kailabl=m_expedition_options[BET_PNDMEN_LABEL]; kailevel=m_expedition_options[BET_PNDMEN_SKILLV];}
        else if (obj[k]=="神医の術式"){kailabl=m_expedition_options[BET_JYUTU_LABEL]; kailevel=m_expedition_options[BET_JYUTU_SKILLV];}
        else if (obj[k]=="劉備の契り"){kailabl=m_expedition_options[BET_CIGIRI_LABEL]; kailevel=m_expedition_options[BET_CIGIRI_SKILLV];}
        else if (obj[k]=="神卜の術式"){kailabl=m_expedition_options[BET_BKJYUTU_LABEL]; kailevel=m_expedition_options[BET_BKJYUTU_SKILLV];}

        kaipage= GM_getValue(BET_GM_KEY + 'lblpage' + kailabl,1);
        Label0:
        for (var m = 1; m <= kaipage ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + kailabl +" page:" +m +" skillevel:" + kailevel );
            bet_getfilelist(kailabl , m);
            var fileList = bet_loadData(BET_GM_KEY+"_fileList", "[]", true);
            if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("ラベル:" +kailabl+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for( var fa= 0; fa < fileList.length; fa++ ) {
                    console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                    console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                    console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                    var kaiflag = false;
                    var kaiskilid="";
                    var kainame="";
                    if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                    else if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                    else if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                    else if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel) && (fileList[fa].hp > 99) && (fileList[fa].setsta =="set")){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                    if (m_expedition_options[BET_DEBUGFLG]==true){
                        bet_setexpeditionlog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        bet_setexpeditionlog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        bet_setexpeditionlog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        bet_setexpeditionlog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta);
                    }
                    if (kaiflag == true){
                        l_rank=true;
                        //待機中のみが対象スキル？
                        for( var i= 0; i < bet_waitskillist.length; i++ ) {
                            if (bet_waitskillist[i]==obj[k]){
                                if (m_expedition_options[BET_DEBUGFLG]==true){
                                    var txt=obj[k] + "は待機中の武将にのみスキルが有効";
                                    bet_setexpeditionlog(txt);
                                }
                                l_skilflg = true;
                            }
                        }
                        if (l_skilflg == true){
                            //全てのカードが待機中でなければリロード
                            for (var n = 1; n <= bet_hpnum; n++) {
                                for( var d = 0; d < deckList.length; d++ ) {
                                    if (deckList[d].setvil==m_expedition_options[BET_EXPEDITIONVIL]) {
                                        console.log("カード名:"+ deckList[d].name + " 状態:"+ deckList[d].setsta + " HP:"+ deckList[d].hp);
                                        if (deckList[d].setsta.indexOf('待機中') == -1) {
                                            var l_setsta = deckList[d].setsta.replace( /,/g , "." ) ;
                                            bet_setexpeditionlog("カード名:"+ deckList[d].name + " 状態:"+ l_setsta +" 戻るまで待機");
                                            l_chk=2;
                                            break Label1;
                                        }
                                    }
                                }
                            }
                        }
                        if (l_chk!=2){
                            console.log("内政セットしてスキル発動する");
                            //回復拠点設定
                            var lists = bet_loadData(BET_GM_KEY+"_VillageList", "[]", true);
                            var setvillage ="";
                            for (var vil = 0; vil< lists.length; vil++) {
                                if(lists[vil].name==m_expedition_options[BET_EXPEDITIONVIL]){
                                    setvillage=lists[vil].id;
                                }
                            }
                            if (setvillage!=""){
                                console.log("回復拠点ID:" + setvillage);
                                l_status=bet_setdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                                if (l_status==0){
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                                    bet_setexpeditionlog(txt);
                                    l_chk=0;
                                    break Label1;
                                } else {
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                                    bet_setexpeditionlog(txt);
                                    l_rank=false;
                                    l_ckNgnum=l_ckNgnum+1;
                                }
                            } else {
                                bet_setexpeditionlog("拠点が存在しません");
                                GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
                                l_chk=3;
                                break Label1;
                            }
                            if (parseInt(l_ckNgnum)>parseInt(bet_statngnum)){
                                bet_setexpeditionlog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                                GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
                                l_chk=3;
                                break Label1;
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_rank==false){
        bet_setexpeditionlog("使用できるHP回復武将が存在しない");
        GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
        l_chk=1;
    }
    return l_chk;
}

//-------------------------//
//   出兵処理              //
//-------------------------//
function bet_cdtrol(){
    console.log("出兵処理");
    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog("出兵処理を開始する");}
    var l_chk=0;
    var l_cdnum;
    var deckList = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);

    var vPosX = null, vPosY = null;
    //出兵座標取得
    var l_zhyo=new Array();
    var l_chkzhyo=GM_getValue(BET_GM_KEY + '_entzahyo', "");
    l_zhyo = GM_getValue(BET_GM_KEY + '_entzahyo', "").split(BET_DELIMIT);
    if (l_zhyo[0]!=""){
        l_zhyo[0].match(/([-]*\d+),([-]*\d+)/);
        vPosX = RegExp.$1;
        vPosY = RegExp.$2;
        if ((vPosX == null) || (vPosY == null)){
            l_chk=1;
        }
    }

    //空地チェック
    if (l_chk==0){
        var l_bname=bet_getBasename(vPosX,vPosY);
        if (l_bname!=0){
            bet_setexpeditionlog("設定領地に出兵できません");
            GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
            l_chk=1;
        }
    } else {
        if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog(l_zhyo[0]);}
        bet_setexpeditionlog("設定領地に出兵できません");
        GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
        l_chk=1;
    }

    //出兵処理
    if (l_chk==0){
        var l_maxspeed = 0;
        var l_cdid="";
        var l_name="";
        var l_fukcdid="";
        //拠点にあって待機しているカードの中で最も足が速いカードを取得
        if (deckList.length != 0) {
            for(var d= 0; d < deckList.length; d++){
                if ((deckList[d].setsta.match(/待機中/)) && (m_expedition_options[BET_EXPEDITIONVIL]==deckList[d].setvil)){
                    var l_speed=bet_correct_status(deckList[d].cdid, deckList[d].speed);
                    if (m_expedition_options[BET_DEBUGFLG]==true){bet_setexpeditionlog(deckList[d].name +" 移動速度:"+l_speed);}
                    if (l_speed>l_maxspeed){
                        l_maxspeed = l_speed;
                        l_cdid=deckList[d].cdid;
                        l_name=deckList[d].name;
                        l_fukcdid=deckList[d].fukcdid;
                    }
                }
            }
        }
        //スピードがしきい値以上かチェック
        if (m_expedition_options[BET_YN_SPEED]==true){
            if (l_maxspeed < parseInt(m_expedition_options[BET_SPEED_LOWER])){
                bet_setexpeditionlog(l_name+":移動速度がしきい値以下です");
                l_chk=1;
                return l_chk;
            }
        }
        //着弾時間チェック
        //最後の出兵時間より前かどうか
        if (bet_chkspatchtool(l_cdid, l_fukcdid, vPosX, vPosY)==0){
            bet_setexpeditionlog("カード名:"+l_name+" カードID:"+l_cdid+"を出兵します");
            if (bet_dispatchtool(l_cdid, l_fukcdid, vPosX, vPosY)==0){
                //出兵完了
                l_chk=0;
                return l_chk;
            }
        }
    }
    l_chk=1;　//出兵出来てない
    return l_chk;
}

//---------------------------
// スキル計算
//---------------------------
function bet_correct_status(i_cdid, i_status_value) {

	// スキル補正値を計算
	var l_effects = bet_calc_correct_params(i_cdid);

	// ステータスを補正
	var l_ret = Math.round(i_status_value * l_effects[2] / 10) / 10;
	return l_ret;
}

// 兵種とスキル効果から補正値を求める
function bet_calc_correct_params(i_cdid) {

	var l_summary = new Array();
	l_summary[0] = 100.0;  // 攻撃
	l_summary[1] = 100.0;  // 防御
	l_summary[2] = 100.0;  // 速度

    var deckList = bet_loadData(BET_GM_KEY+ "_deckList", "[]", true);
    if (deckList.length != 0) {
        for(var d= 0; d < deckList.length; d++){
            var skilarry = [];
            if (deckList[d].cdskil1txt!=""){skilarry.push(deckList[d].cdskil1txt);} //スキル1内容
            if (deckList[d].cdskil2txt!=""){skilarry.push(deckList[d].cdskil2txt);} //スキル2内容
            if (deckList[d].cdskil3txt!=""){skilarry.push(deckList[d].cdskil3txt);} //スキル3内容
            if (deckList[d].cdskil4txt!=""){skilarry.push(deckList[d].cdskil4txt);} //スキル4内容
            if (deckList[d].fukskiltxt!=""){skilarry.push(deckList[d].fukskiltxt);} //副将スキル内容
            var l_sol_type = deckList[d].soltype;
            if (deckList[d].cdid==i_cdid){
                // 速度チェックするカード
                for (var i = 0; i < skilarry.length; i++) {
                    var skill_text = skilarry[i];
                    // パッシブ計算
                    if (skill_text.indexOf("自動で発動") > 0) {
                        // 効果計算
                        var l_effects = bet_calc_skilltext_correct_effect(skill_text, l_sol_type);
                        for (var j = 0; j < 3; j++) {
                            l_summary[j] += l_effects[j];
                        }
                        continue;
                    }
                }
            } else if (m_expedition_options[BET_EXPEDITIONVIL]==deckList[d].setvil){
                // デッキにセットされている全軍・全武将対象スキルチェック
                for (var i = 0; i < skilarry.length; i++) {
                    var skill_text = skilarry[i];
                    // パッシブ計算
                    if (skill_text.indexOf("自動で発動") > 0) {
                        // 効果計算
                        var l_effects = bet_calc_skilltext_correct_effect_deck(skill_text);
                        for (var j = 0; j < 3; j++) {
                            l_summary[j] += l_effects[j];
                        }
                        continue;
                    }
                }
            }
        }
    }
	return l_summary;
}

// スキル文から効果を計算
function bet_calc_skilltext_correct_effect(i_skill_text, i_sol_type) {
	var l_effects = new Array();
	l_effects[0] = 0.0;  // 攻撃
	l_effects[1] = 0.0;  // 防御
	l_effects[2] = 0.0;  // 速度

	// 同一勢力スキルは除外
	if (i_skill_text.indexOf("同一勢力") > 0) {
		return l_effects;
	}

	// 兵科判定
	var chk_sol_type = i_sol_type;
	if (i_sol_type == "剣兵") {
		chk_sol_type = "歩兵";
	}

	var is_other = false;
	var match = i_skill_text.match(/(歩兵|槍兵|弓兵|騎兵)[科の\/]*武将/);
	if (match != null && match[1] != chk_sol_type) {
		// 昭烈帝、大皇帝、魏武王対策
		if (!i_skill_text.match(/他兵科/)) {
			return l_effects;
		}
		is_other = true;
	}

	// 武将に効果がない場合無視
	if (i_skill_text.indexOf("武将") == -1) {
		return l_effects;
	}

	// 援軍スキルは無視
	if (i_skill_text.indexOf("援軍") != -1) {
		return l_effects;
	}

	// 効果判定(攻)
	if (is_other == false) {
		match = i_skill_text.match(/攻撃力[がを]*([0-9.]*)%/);
	} else {
		// 昭烈帝、大皇帝、魏武王対策
		match = i_skill_text.match(/他兵科の攻撃力が([0-9.]*)%/);
	}
	if (match != null) {
		l_effects[0] += parseFloat(match[1]);
	}

	// 効果判定(防)
	match = i_skill_text.match(/防御[力全てが]*([0-9.]*)%/);
	if (match != null) {
		l_effects[1] += parseFloat(match[1]);
	}

	// 効果判定(移)
	match = i_skill_text.match(/移動*速[度が]*([0-9.]*)%/);
	if (match != null) {
		// 蛮族対策
		if (i_skill_text.indexOf("減少") != -1) {
			l_effects[2] -= parseFloat(match[1]);
		} else {
			l_effects[2] += parseFloat(match[1]);
		}
	}
	return l_effects;
}
// スキル文から効果を計算
function bet_calc_skilltext_correct_effect_deck(i_skill_text) {
	var l_effects = new Array();
	l_effects[0] = 0.0;  // 攻撃
	l_effects[1] = 0.0;  // 防御
    l_effects[2] = 0.0;  // 速度

    // 全兵・全武将スキル以外は無視
    var match = i_skill_text.match(/セットした拠点から出兵する全*(武将)/);
	if (match == null) {
		return l_effects;
	}

	// 効果判定(攻)
    match = i_skill_text.match(/攻撃力[がを]*([0-9.]*)%/);
	if (match != null) {
		l_effects[0] += parseFloat(match[1]);
	}

	// 効果判定(防)
	match = i_skill_text.match(/防御[力全てが]*([0-9.]*)%/);
	if (match != null) {
		l_effects[1] += parseFloat(match[1]);
	}

	// 効果判定(移)
	match = i_skill_text.match(/移動*速[度が]*([0-9.]*)%/);
	if (match != null) {
		l_effects[2] += parseFloat(match[1]);
	}

	return l_effects;
}

//-------------------------------//
// デッキのカードリスト取得      //
//-------------------------------//
function bet_getdecklist(){
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
    }).done(function(data) {
        // デッキにあるカード情報取得
        bet_saveData(BET_GM_KEY+"_deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());
            var cdSoltype = j$(this).find( ".cardWrapper span[class='soltype-for-sub'] img").eq(0).attr("title");
            var cdSpeed = j$(this).find( ".cardWrapper ul[class='status'] li[class*='status_speed']").text().match(/\d+/g)[0];

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil1txt="";
            if (cdSkil1pa){
                cdSkil1txt=j$(this).find(".back_skill div[class^='skill1']").text();
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2txt="";
            if (cdSkil2pa){
                cdSkil2txt=j$(this).find(".back_skill div[class^='skill2']").text();
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3txt="";
            if (cdSkil3pa){
                cdSkil3txt=j$(this).find(".back_skill div[class^='skill3']").text();
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if (cdSkil.length > 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            var cdSkil4txt="";
            if (cdSkil4pa){
                cdSkil4txt=j$(this).find(".back_skill div[class^='skill4']").text();
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            var fukSkiltxt ="";
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                } else {
                    fukSkiltxt=j$(this).find(".back_skill div[class^='skill4']").text();
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
            deckList.speed = cdSpeed;                       //スピード
            deckList.level = cdLevel;                       //カードレベル
            deckList.soltype = cdSoltype;                   //兵種
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil1txt = cdSkil1txt;               //スキル1内容
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil2txt = cdSkil2txt;               //スキル2内容
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            deckList.cdskil3txt = cdSkil3txt;               //スキル3内容
            if (cdSkil.length > 3){                         //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.cdskil4txt = cdSkil4txt;               //スキル4内容
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID
            deckList.fukskiltxt = fukSkiltxt;               //副将スキル内容

            console.log(deckList);
            if (m_expedition_options[BET_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                bet_setexpeditionlog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                bet_setexpeditionlog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                bet_setexpeditionlog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                bet_setexpeditionlog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                bet_setexpeditionlog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        bet_saveData(BET_GM_KEY+ "_deckList", deckListAll, true);
    });
}
//----------------------------------//
// ファイルのカードリスト取得       //
//----------------------------------//
function bet_getfilelist(l_label, l_page){
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
            var cdName = j$(this).find( ".illustMini img[class='lazy']").attr("title");
            var cid =  j$(this).find( ".illustMini a[class^='thickbox']").attr("href").match(/\d+/g)[2];
            var setStatus ="";
            if (j$(this).find(".left div").hasClass("set dis_set_mini")){
                setStatus = j$(this).find(".left div[class='set dis_set_mini']").text();
            } else {
                setStatus = "set";
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
            fileList.skilkaitime1 = j$.trim(Skilkaitime1);  //スキル回復時間
            fileList.cdskil2 = j$.trim(cdSkil2);            //スキル2
            fileList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            fileList.cdskil2id = cdSkil2id;                 //スキル2ID
            fileList.skilkaitime2 = j$.trim(Skilkaitime2);  //スキル回復時間
            fileList.cdskil3 = j$.trim(cdSkil3);            //スキル3
            fileList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            fileList.cdskil3id = cdSkil3id;                 //スキル3ID
            fileList.skilkaitime3 = j$.trim(Skilkaitime3);  //スキル回復時間
            if (cdSkil.length > 3){                         //スキル4
                fileList.cdskil4 = j$.trim(cdSkil4);
            } else {
                fileList.cdskil4 ="";
            }
            fileList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            fileList.cdskil4id = cdSkil4id;                 //スキル4ID
            fileList.skilkaitime4 = j$.trim(Skilkaitime4);  //スキル回復時間
            //console.log(fileList);
            fileListAll.push(fileList);
        });
        bet_saveData(BET_GM_KEY+"_fileList", fileListAll, true );
    });
}

//------------------------------------------//
// デッキに設定し、内政スキル発動           //
//------------------------------------------//
function bet_setdeckskill(cardid, skilid,vilid, acttype){
    var url=PROTOCOL　+ "//" + HOST + "/card/deck.php";
    var ssid = betgetSessionId();
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
        bet_saveData(BET_GM_KEY+"_deckList", deckListAll, true );
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
            var cdSoltype = j$(this).find( ".cardWrapper span[class='soltype-for-sub'] img").eq(0).attr("title");
            var cdSpeed = j$(this).find( ".cardWrapper ul[class='status'] li[class*='status_speed']").text().match(/\d+/g)[0];

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil1txt="";
            if (cdSkil1pa){
                cdSkil1txt=j$(this).find(".back_skill div[class^='skill1']").text();
            }
            var cdSkil2 =  j$(this).find(".back_skill span[class^='skillName2']");
            var cdSkil2pa =  j$(this).find(".back_skill span[class^='skillName2']").hasClass("skillName2 skill_name red");
            var cdSkil2kai =  !(j$(this).find(".back_skill div").hasClass("skill2 skill-kaifuku"));
            var cdSkil2id ="";
            if (j$.trim(cdSkil2.text()).length > 0 ){
                cdSkil2id = j$(this).find(".back_skill div[class^='skill2'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil2txt="";
            if (cdSkil2pa){
                cdSkil2txt=j$(this).find(".back_skill div[class^='skill2']").text();
            }
            var cdSkil3 =  j$(this).find(".back_skill span[class^='skillName3']");
            var cdSkil3pa =  j$(this).find(".back_skill span[class^='skillName3']").hasClass("skillName3 skill_name red");
            var cdSkil3kai =  !(j$(this).find(".back_skill div").hasClass("skill3 skill-kaifuku"));
            var cdSkil3id ="";
            if (j$.trim(cdSkil3.text()).length > 0 ){
                cdSkil3id = j$(this).find(".back_skill div[class^='skill3'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
            }
            var cdSkil3txt="";
            if (cdSkil3pa){
                cdSkil3txt=j$(this).find(".back_skill div[class^='skill3']").text();
            }
            var cdSkil4 =  "";
            var cdSkil4kai =  true;
            var cdSkil4id ="";
            var cdSkil4pa =false;
            if (cdSkil.length > 3){
                cdSkil4 =  j$(this).find(".back_skill span[class^='skillName4']");
                cdSkil4pa =  j$(this).find(".back_skill span[class^='skillName4']").hasClass("skillName4 skill_name red");
                cdSkil4kai =  !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                if (j$.trim(cdSkil4.text()).length > 0 ){
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    cdSkil4id = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                }
            }
            var cdSkil4txt="";
            if (cdSkil4pa){
                cdSkil4txt=j$(this).find(".back_skill div[class^='skill4']").text();
            }
            //副将スキルがある
            var fukCd = "";
            var fukCdid="";
            var fukKai =  true;
            var fukId ="";
            var fukSkiltxt="";
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
                } else {
                    fukSkiltxt=j$(this).find(".back_skill div[class^='skill4']").text();
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
            deckList.speed = cdSpeed;                       //スピード
            deckList.cost = cdCost;                         //コスト
            deckList.level = cdLevel;                       //カードレベル
            deckList.soltype = cdSoltype;                   //兵種
            deckList.cdskil1 = j$.trim(cdSkil1.text());     //スキル１
            deckList.cdskil1kai = cdSkil1kai;               //スキル１回復(回復中:false)
            deckList.cdskil1id = cdSkil1id;                 //スキル1ID
            deckList.cdskil1pa = cdSkil1pa;                 //スキル1パッシブ
            deckList.cdskil1txt = cdSkil1txt;               //スキル1内容
            deckList.cdskil2 = j$.trim(cdSkil2.text());     //スキル2
            deckList.cdskil2kai = cdSkil2kai;               //スキル2回復(回復中:false)
            deckList.cdskil2id = cdSkil2id;                 //スキル2ID
            deckList.cdskil2pa = cdSkil2pa;                 //スキル2パッシブ
            deckList.cdskil2txt = cdSkil2txt;               //スキル2内容
            deckList.cdskil3 = j$.trim(cdSkil3.text());     //スキル3
            deckList.cdskil3kai = cdSkil3kai;               //スキル3回復(回復中:false)
            deckList.cdskil3id = cdSkil3id;                 //スキル3ID
            deckList.cdskil3pa = cdSkil3pa;                 //スキル3パッシブ
            deckList.cdskil3txt = cdSkil3txt;               //スキル3内容
            if (cdSkil.length > 3){                         //スキル4
                deckList.cdskil4 = j$.trim(cdSkil4.text());
            } else {
                deckList.cdskil4 ="";
            }
            deckList.cdskil4kai = cdSkil4kai;               //スキル4回復(回復中:false)
            deckList.cdskil4id = cdSkil4id;                 //スキル4ID
            deckList.cdskil4pa = cdSkil4pa;                 //スキル4パッシブ
            deckList.cdskil4txt = cdSkil4txt;               //スキル4内容
            deckList.fukcd = j$.trim(fukCd);                //副将
            deckList.fukcdid = fukCdid;                     //副将ID
            deckList.fukkai = fukKai;                       //副将スキル回復(回復中:false)
            deckList.fukskilid = fukId;                     //副将スキルID
            deckList.fukskiltxt = fukSkiltxt;               //副将スキル内容
            console.log(deckList);
            if (m_expedition_options[BET_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                bet_setexpeditionlog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                bet_setexpeditionlog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                bet_setexpeditionlog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                bet_setexpeditionlog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                bet_setexpeditionlog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        bet_saveData(BET_GM_KEY+ "_deckList", deckListAll, true);
    });
    return l_chkstat;
}
//--------------------//
// 出兵確認            //
//--------------------//
function bet_chkspatchtool(cardid, fukcardid, x_value, y_value){
    var l_dom="";
    var l_ret=0;
    var url=PROTOCOL　+ "//" + HOST + "/facility/castle_send_troop.php";
    // 送信データの作成
    var params = new Object;
    params["use_skill_id[" + cardid + "]"] = 0;
    if (fukcardid!=""){
        params["use_skill_id[" + fukcardid + "]"] = 0;
    }
    params['village_x_value'] = x_value;
    params['village_y_value'] = y_value;
    params['unit_assign_card_id'] = cardid;
    params['show_beat_bandit_flg'] = true;
    params['radio_reserve_type'] = 0;
    params['btn_preview'] = 302;
    console.log(params);
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    }).done(function(data) {
        bet_time ="";
        if(j$(data).find("#area_up_timer0").text().length>0){
            var l_time=j$(data).find("#area_up_timer0").text();
            bet_time=l_time;
            //前回の出兵到着時間
            if (GM_getValue(BET_GM_KEY + '_bfrspotime', "")!=""){
                var l_date = Date.parse(j$.trim(l_time).replace(/-/g,"/"));
                var l_befd = Date.parse(GM_getValue(BET_GM_KEY + '_bfrspotime', "").replace(/-/g,"/"));
                var diff =  l_date - l_befd;
                if (diff<0){
                    l_ret=1;
                    if (m_expedition_options[BET_DEBUGFLG]==true){
                        bet_setexpeditionlog("到着予定時間:"+l_time);
                        bet_setexpeditionlog("前回出兵の到着時間:"+GM_getValue(BET_GM_KEY + '_bfrspotime', ""));
                    }
                    bet_setexpeditionlog("着弾時間が前回出兵分の時間より早い");
                }
            }
        } else{
            //*[@id="gray02Wrapper"]/form[2]/table[2]/tbody/tr[2]/td[2]/span
            l_dom = j$(data).find("#gray02Wrapper table[class='commonTables']").eq(1).find("tr").eq(1);
            if (l_dom.length) {
                if (l_dom.find("td").eq(1).length>0){
                    if(l_dom.find("td").eq(1).text().indexOf('※籠城中は出兵できません') != -1){
                        bet_setexpeditionlog("籠城中です");
                        l_ret=1;
                        GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
                    }
                }
            }
            if (l_ret!=1){
                l_ret=2;
                console.log("なんかエラー");
            }
        }
    });
    return l_ret;
}
//--------------------//
// 出兵               //
//--------------------//
function bet_dispatchtool(cardid, fukcardid, x_value, y_value){
    var l_dom="";
    var l_ret=0;
    var url=PROTOCOL　+ "//" + HOST + "/facility/castle_send_troop.php";
    // 送信データの作成
    var params = new Object;
    params['village_x_value'] = x_value;
    params['village_y_value'] = y_value;
    params['unit_assign_card_id'] = cardid;
    if (fukcardid!=""){
        params["use_skill_id[" + fukcardid + "]"] = 0;
    }
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
                    bet_setexpeditionlog("籠城中です");
                    l_ret=1;
                    GM_setValue(BET_GM_KEY +"_ExpeditionAutoFlg", false);
                }
            }
        } else if (j$(data).find("#gray02Wrapper h2").eq(0).text()=="兵士管理"){
            l_ret=0;
            GM_setValue(BET_GM_KEY + '_bfrspotime', bet_time);  //時間
        } else{
            l_ret=2;
            console.log("なんかエラー");
        }
    });
    return l_ret;
}
//----------------------------------//
//各ラベルのページ数取得            //
//----------------------------------//
function bet_setlblpage(){
    console.log("各ラベルのページ数取得");
    for (var i = 1; i < 15; i++) {
        bet_getlblpage(i);
    }
}

//----------------------------------//
//各ラベルのページ数取得            //
//----------------------------------//
function bet_getlblpage(l_label){
    console.log("出兵ラベルのページ数取得");
    var url;
    var fileListAll = [];
    url=PROTOCOL　+ "//" + HOST + "/card/deck.php?l=" +l_label + "#file-1";
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
        console.log(urlprm);
        var pagenum =  j$(data).find( "#rotate div[class='rotateInfo clearfix'] ul[class='pager'] li").length;
        if (pagenum < 2){pagenum =1;} else {pagenum = pagenum-1;}
        GM_setValue(BET_GM_KEY + '_betlblpage' + urlprm, pagenum);
        console.log("ラベルNO: %d  ページ数: %d ", parseInt(urlprm, 10), parseInt(pagenum, 10));

    });
}
//-----------------------//
// 領地名取得            //
//-----------------------//
function bet_getBasename(x_value, y_value){
    var url;
    var fileListAll = [];
    var cdName="";
    var l_user="";
    var l_chk=0;
    url=PROTOCOL　+ "//" + HOST + "/land.php?x=" + x_value + "&y=" + y_value;
    console.log(url);
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        cache: false,
        async: false
    }).done(function(data) {
        cdName = j$(data).find( "#basepoint span[class='basename']").text();
        l_user = j$(data).find( "#basepoint div[class='status']").text().replace(/\s+/g, "");
        if (j$.trim(cdName)!="空き地"){
            if ( l_user.indexOf('所有者NPC') == -1) {
                l_chk=1;
            }
        }
    });
    return l_chk;
}
//----------------------------------//
//ログ保存                          //
//----------------------------------//
function bet_setexpeditionlog(l_logtxt){
    var dt = new Date();
    var l_strDate = bet_LocaleString(dt);
    var l_log=new Array();
    var l_chklog=GM_getValue(BET_GM_KEY + '_expeditionlog', "");
    var lognum=50;
    if (l_chklog!=""){
        l_log = GM_getValue(BET_GM_KEY + '_expeditionlog', []).split(',');
        var l_loglen=l_log.length;
        if(!isNaN(m_expedition_options[BET_LOGCOUNT])){
            lognum=m_expedition_options[BET_LOGCOUNT];
        }
        if (l_loglen > lognum){
            //多いログを消す
            l_log.splice(lognum, l_loglen-lognum);
            //ログ末尾削除
            l_log.pop();
        }
    }
    //最初に挿入
    l_log.unshift(l_logtxt);
    GM_setValue(BET_GM_KEY + '_expeditionlog', l_strDate+" "+l_log);  //ログ保存
}

//---------------------------------//
//座標保存                          //
//---------------------------------//
function bet_setexpeditionzahyo(){
    //出兵後は消す
    var l_zhyo=new Array();
    var l_chkzhyo=GM_getValue(BET_GM_KEY + '_entzahyo', "");
    //一行消す
    if (l_chkzhyo!=""){
        l_zhyo = GM_getValue(BET_GM_KEY + '_entzahyo', "").split(BET_DELIMIT);
        l_zhyo.splice(0, 1); // 1番目から一つ削除
    }
    l_save=l_zhyo.join(BET_DELIMIT)
    GM_setValue(BET_GM_KEY + '_entzahyo', l_save);  //保存
}

function bet_LocaleString(date)
{
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}

//---------------------------//
//    設定を保存する         //
//---------------------------//
function bet_gmnset() {
    var options = getExpeditionDefaultOptions();

    var obj = new Object;
    var items = j$("#expedition_setting_view input");
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
    var items1 = j$("#expedition_setting_view select");
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

    var items2 = j$(".bet_setrecskil");
    var hash = {};
    for (var i = 0; i < items2.length; i++) {
        hash = {};
        for (var k = 0; k <  j$("#" + items2.eq(i).attr('id')).children( 'option').length; k++) {
            hash[k] = j$("#" + items2.eq(i).attr('id')).children( 'option').eq(k).text();
        }
        obj[items2.eq(i).attr('id')] = hash;
    }

    //設定を保存
    GM_setValue(BET_GM_KEY + '_expedition_options', JSON.stringify(obj));

    var textarea1 = j$("#bet_entarea").val();
    var l_zahyo= textarea1.replace(/\r?\n/g, BET_DELIMIT);  // 改行コードを保存デリミタに置換
    GM_setValue(BET_GM_KEY + '_entzahyo', l_zahyo);  //座標保存
}

//---------------------------------//
// Expeditionの設定の読み込み・保存    //
//---------------------------------//
// デフォルトオプション定義の取得
function getExpeditionDefaultOptions() {
    var settings = new Object;

    // 使用する設定
    settings[BET_EXPEDITIONVIL] = "";         // 出兵拠点
    settings[BET_YN_HP] = true;      //HP回復をするか
    settings[BET_HP_LOWER] = "30";    //HP回復値
    settings[BET_HP_HIGHER] = "80";  //HP回復値
    settings[BET_SPEED_LOWER] = "1000";  //速度下限値
    settings[BET_YN_SPEED] = true;  //速度チェックをするか

    //回復
    settings[BET_JIN_LABEL] = "1";        // 仁君ラベル
    settings[BET_JIN_SKILLV] = "1";       // 仁君レベル
    settings[BET_SEJYU_LABEL] = "1";      // 神医の施術ラベル
    settings[BET_SEJYU_SKILLV] = "1";     // 神医の施術レベル
    settings[BET_KYUYOKI_LABEL] = "1";    // 弓腰姫の愛ラベル
    settings[BET_KYUYOKI_SKILLV] = "1";   // 弓腰姫の愛レベル
    settings[BET_KGJAI_LABEL] = "1";      // 皇后の慈愛ラベル
    settings[BET_KGJAI_SKILLV] = "1";     // 皇后の慈愛レベル
    settings[BET_MOMO_LABEL] = "1";       // 桃色吐息ラベル
    settings[BET_MOMO_SKILLV] = "1";      // 桃色吐息レベル
    settings[BET_SUIGIN_LABEL] = "1";     // 酔吟吐息ラベル
    settings[BET_SUIGIN_SKILLV] = "1";    // 酔吟吐息レベル
    settings[BET_BNKJAI_LABEL] = "1";     // 文姫の慈愛ラベル
    settings[BET_BNKJAI_SKILLV] = "1";    // 文姫の慈愛レベル
    settings[BET_SINBK_LABEL] = "1";      // 神卜の方術ラベル
    settings[BET_SINBK_SKILLV] = "1";     // 神卜の方術レベル
    settings[BET_NNKEB_LABEL] = "1";      // 娘々敬慕ラベル
    settings[BET_NNKEB_SKILLV] = "1";     // 娘々敬慕レベル
    settings[BET_PNDMEN_LABEL] = "1";     // 熊猫の麺匠ラベル
    settings[BET_PNDMEN_SKILLV] = "1";    // 熊猫の麺匠レベル
    settings[BET_JYUTU_LABEL] = "1";      // 神医ラベル
    settings[BET_JYUTU_SKILLV] = "1";     // 神医スキルレベル
    settings[BET_CIGIRI_LABEL] = "1";     // 劉備の契りラベル
    settings[BET_CIGIRI_SKILLV] = "1";    // 劉備の契りスキルレベル
    settings[BET_BKJYUTU_LABEL] = "1";    // 神卜の術式ラベル
    settings[BET_BKJYUTU_SKILLV] = "1";   // 神卜の術式スキルレベル

    //使用する回復スキル
    settings[BET_FLERECSKIL1] = bet_defrecskil;
   //使用しない回復スキル
    settings[BET_UNRECSKIL1] = bet_defunrecskil;

    //ログ
    settings[BET_DEBUGFLG] = false;       // ログ詳細
    settings[BET_LOGCOUNT] = 50;          // ログ件数

    return settings;
}
//-----------------------//
// 出兵設定画面描画      //
//-----------------------//
function drawSetExpeditionWindow() {
    //表示コンテナ作成
    var BETfacContainer = j$("<div>");
    BETfacContainer.attr('id', 'expedition_setting_view');
    BETfacContainer.css('position','absolute');
    BETfacContainer.css('opacity',1.0);
    BETfacContainer.css('border','solid 2px black');
    BETfacContainer.css('left', '20px');
    BETfacContainer.css('top', '20px');
    BETfacContainer.css('display','none');
    BETfacContainer.css('margin-bottom','3px');
    BETfacContainer.css('zIndex','9999');
    BETfacContainer.css('width','600px');

    j$("#boxInner").append(BETfacContainer);
    BETfacContainer.draggable();

    var BETtable = j$("<div id='bet_tabs'>\
      <ul>\
        <li><a href='#bet_maintab'>出兵設定</a></li>\
        <li><a href='#bet_labeltab'>ラベル設定</a></li>\
        <li><a href='#bet_logtab'>ログ</a></li>\
      </ul>\
      <div id='bet_maintab'>\
      </div>\
      <div id='bet_labeltab'>\
      </div>\
      <div id='bet_logtab'>\
      </div>\
   </div>\
    ");

    BETfacContainer.append(BETtable);
    bet_mainset();
    bet_labelset();
    bet_logset();

    j$("#bet_tabs li").css({'padding':'0px', 'min-width':'0px'});
    j$("#bet_tabs li a").css({'background':'none'});

    j$('#bet_tabs').tabs();

    j$(document).on('click',"#bet_btn_up1", function() {
        bet_moveUpElement("bet_flerecskil1");
    });
    j$(document).on('click',"#bet_btn_down1", function() {
        bet_moveDownElement("bet_flerecskil1");
    });
    j$(document).on('click',"#bet_btn_right1", function() {
        bet_moveRLElement("bet_flerecskil1","bet_unrecskil1");
    });
    j$(document).on('click',"#bet_btn_left1", function() {
        bet_moveRLElement("bet_unrecskil1","bet_flerecskil1");
    });

    // 保存ボタン
    j$("[ id^='bet_saveSetWindow' ]").on('click',function() {
        if(confirm("保存しますか？\n出兵中の場所があってもリセットされます") ) {
            bet_gmnset();
            loadExpeditionSettings();
            j$("#bet_td12").text("設定保存拠点：" + m_expedition_options[BET_EXPEDITIONVIL]);
        }
    });
    // 閉じるボタンのクリックイベント
    j$(document).on('click',"[ id^='bet_closeSetWindow' ]",function() {
        j$("#expedition_setting_view").css('display', 'none');
    });
}

//---------------------------//
//    設定画面の描画         //
//---------------------------//
function bet_mainset() {
    var table1 = j$("<table class=bet_tbl>");
    j$("#bet_maintab").append(table1);
    j$(table1).
        append(j$("<tr><td class=bet_ctd0></td><td style='width:250px;'></td><td></td><td></td></tr>\
                <tr><td colspan='2' id=bet_td11></td><td id=bet_td12 style='color: #3300ff;'></td></tr>\
                <tr><td colspan='4' id=bet_td21 style='padding-top:5px;'></td></tr>\
                <tr><td colspan='4' id=bet_td31></td></tr>\
                <tr><td colspan='4' id=bet_td41 style='padding-top:5px;'></td></tr>\
                <tr><td colspan='4' id=bet_td51></td></tr>\
                <tr><td colspan='4' id=bet_td301 style='padding-top:5px;'></td></tr>\
                <tr><td class=bet_ctd0></td><td id=bet_td311 colspan='3'></td></tr>\
                <tr><td colspan='4' id=bet_td401 class=ctdb style='padding-top:5px;'></td></tr>\
    "));

    BETcreateSelectBox("#bet_td11", "bet_expeditionvil" , "出兵拠点：","select1", m_expedition_options[BET_EXPEDITIONVIL] ,betVilSelectValues);
    BETcreateSpan("#bet_td12", "設定保存拠点：" + m_expedition_options[BET_EXPEDITIONVIL]);
    BETcreateCheckBox("#bet_td21", "bet_yn_hp" , " ","bet_yn_hp","1",m_expedition_options[BET_YN_HP]);
    BETcreateTextBox("#bet_td21", "bet_hp_lower" , "HP：",m_expedition_options[BET_HP_LOWER],'3','30px',false);
    BETcreateTextBox("#bet_td21", "bet_hp_higher" , "未満の場合、HP：",m_expedition_options[BET_HP_HIGHER],'3','30px',false);
    BETcreateSpan("#bet_td21", "以上になるまで回復する");
    BETcreateSpan("#bet_td31", "　※回復用にデッキコストは空けておくこと");
    BETcreateCheckBox("#bet_td41", "bet_yn_speed" , " ","bet_yn_speed","1",m_expedition_options[BET_YN_SPEED]);
    BETcreateTextBox("#bet_td41", "bet_speed_lower" , "移動速度：",m_expedition_options[BET_SPEED_LOWER],'5','50px',false);
    BETcreateSpan("#bet_td41", "以上の武将のみ出兵する");
    BETcreateSpan("#bet_td51", "　※カードのパッシブスキルのみ計算に含む");

    BETcreateSpan("#bet_td301", "出兵場所:");
    BETcreateTextArea("#bet_td311", "bet_entarea", '35','50', false);
    BETcreateButton("#bet_td401", "bet_saveSetWindow1", "設定を保存", "bet_btn_c");
    BETcreateButton("#bet_td401", "bet_closeSetWindow1", "閉じる", "bet_btn_c");

    //拠点プルダウン設定
    var lists = bet_loadData(BET_GM_KEY+"_VillageList", "[]", true);
    var plist ;
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#bet_expeditionvil").append(plist);
    }
}

function bet_labelset() {
    var table = j$("<table>");
    j$("#bet_labeltab").append(table);
    j$(table).
        append(j$("<tr><td colspan='5'>\
                <table>\
                <tr><td colspan='3' id=bet_td1_td101></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td111></td><td id=bet_td1_td112></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td121></td><td id=bet_td1_td122></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td131></td><td id=bet_td1_td132></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td141></td><td id=bet_td1_td142></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td151></td><td id=bet_td1_td152></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td161></td><td id=bet_td1_td162></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td171></td><td id=bet_td1_td172></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td181></td><td id=bet_td1_td182></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td191></td><td id=bet_td1_td192></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td201></td><td id=bet_td1_td202></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td211></td><td id=bet_td1_td212></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td221></td><td id=bet_td1_td222></td></tr>\
                <tr><td class=bet_ctd0></td><td class=ctd2 id=bet_td1_td231></td><td id=bet_td1_td232></td></tr>\
                </table>\
                </td></tr>\
                <tr><td colspan='5' id=bet_td1_td251></td></tr>\
                <tr><td class=bet_ctd0></td><td colspan='4'><table>\
                <tr><td  id=bet_td1_td261></td><td  id=bet_td1_td262 class=bet_ctd0></td><td  id=bet_td1_td263></td></tr>\
                <tr><td  id=bet_td1_td271></td><td  id=bet_td1_td272 class=bet_ctd0></td>\
                <td  id=bet_td1_td273></td></tr></table></td></tr>\
                <tr><td colspan='5' id=bet_td1_td401 class=ctdb style='padding-top:5px;'></td></tr>\
    "));

    BETcreateSpan("#bet_td1_td101", "HP回復スキル使用設定:");
    BETcreateSpan("#bet_td1_td111", "仁君:");
    BETcreateSelectBox("#bet_td1_td112", "bet_jin_label" , "ラベル:","select2",m_expedition_options[BET_JIN_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td112", " | ");
    BETcreateSelectBox("#bet_td1_td112", "bet_jin_skillv" , "スキルレベル:","select2",m_expedition_options[BET_JIN_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td112", "以上");
    BETcreateSpan("#bet_td1_td121", "神医の施術:");
    BETcreateSelectBox("#bet_td1_td122", "bet_sejyu_label" , "ラベル:","select2",m_expedition_options[BET_SEJYU_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td122", " | ");
    BETcreateSelectBox("#bet_td1_td122", "bet_sejyu_skillv" , "スキルレベル:","select2",m_expedition_options[BET_SEJYU_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td122", "以上");
    BETcreateSpan("#bet_td1_td131", "弓腰姫の愛:");
    BETcreateSelectBox("#bet_td1_td132", "bet_kyuyoki_label" , "ラベル:","select2",m_expedition_options[BET_KYUYOKI_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td132", " | ");
    BETcreateSelectBox("#bet_td1_td132", "bet_kyuyoki_skillv" , "スキルレベル:","select2",m_expedition_options[BET_KYUYOKI_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td132", "以上");
    BETcreateSpan("#bet_td1_td141", "皇后の慈愛:");
    BETcreateSelectBox("#bet_td1_td142", "bet_kgjai_label" , "ラベル:","select2",m_expedition_options[BET_KGJAI_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td142", " | ");
    BETcreateSelectBox("#bet_td1_td142", "bet_kgjai_skillv" , "スキルレベル:","select2",m_expedition_options[BET_KGJAI_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td142", "以上");
    BETcreateSpan("#bet_td1_td151", "桃色吐息:");
    BETcreateSelectBox("#bet_td1_td152", "bet_momo_label" , "ラベル:","select2",m_expedition_options[BET_MOMO_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td152", " | ");
    BETcreateSelectBox("#bet_td1_td152", "bet_momo_skillv" , "スキルレベル:","select2",m_expedition_options[BET_MOMO_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td152", "以上");
    BETcreateSpan("#bet_td1_td161", "酔吟吐息:");
    BETcreateSelectBox("#bet_td1_td162", "bet_suigin_label" , "ラベル:","select2",m_expedition_options[BET_SUIGIN_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td162", " | ");
    BETcreateSelectBox("#bet_td1_td162", "bet_suigin_skillv" , "スキルレベル:","select2",m_expedition_options[BET_SUIGIN_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td162", "以上");
    BETcreateSpan("#bet_td1_td171", "文姫の慈愛:");
    BETcreateSelectBox("#bet_td1_td172", "bet_bnkjai_label" , "ラベル:","select2",m_expedition_options[BET_BNKJAI_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td172", " | ");
    BETcreateSelectBox("#bet_td1_td172", "bet_bnkjai_skillv" , "スキルレベル:","select2",m_expedition_options[BET_BNKJAI_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td172", "以上");
    BETcreateSpan("#bet_td1_td181", "神卜の方術:");
    BETcreateSelectBox("#bet_td1_td182", "bet_sinbk_label" , "ラベル:","select2",m_expedition_options[BET_SINBK_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td182", " | ");
    BETcreateSelectBox("#bet_td1_td182", "bet_sinbk_skillv" , "スキルレベル:","select2",m_expedition_options[BET_SINBK_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td182", "以上");
    BETcreateSpan("#bet_td1_td191", "娘々敬慕:");
    BETcreateSelectBox("#bet_td1_td192", "bet_nnkeb_label" , "ラベル:","select2",m_expedition_options[BET_NNKEB_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td192", " | ");
    BETcreateSelectBox("#bet_td1_td192", "bet_nnkeb_skillv" , "スキルレベル:","select2",m_expedition_options[BET_NNKEB_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td192", "以上");
    BETcreateSpan("#bet_td1_td201", "熊猫の麺匠:");
    BETcreateSelectBox("#bet_td1_td202", "bet_pndmen_label" , "ラベル:","select2",m_expedition_options[BET_PNDMEN_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td202", " | ");
    BETcreateSelectBox("#bet_td1_td202", "bet_pndmen_skillv" , "スキルレベル:","select2",m_expedition_options[BET_PNDMEN_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td202", "以上");
    BETcreateSpan("#bet_td1_td211", "神医の術式:");
    BETcreateSelectBox("#bet_td1_td212", "bet_jyutu_label" , "ラベル:","select2",m_expedition_options[BET_JYUTU_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td212", " | ");
    BETcreateSelectBox("#bet_td1_td212", "bet_jyutu_skillv" , "スキルレベル:","select2",m_expedition_options[BET_JYUTU_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td212", "以上");
    BETcreateSpan("#bet_td1_td221", "劉備の契り:");
    BETcreateSelectBox("#bet_td1_td222", "bet_cigiri_label" , "ラベル:","select2",m_expedition_options[BET_CIGIRI_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td222", " | ");
    BETcreateSelectBox("#bet_td1_td222", "bet_cigiri_skillv" , "スキルレベル:","select2",m_expedition_options[BET_CIGIRI_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td222", "以上");
    BETcreateSpan("#bet_td1_td231", "神卜の術式:");
    BETcreateSelectBox("#bet_td1_td232", "bet_bkjyutu_label" , "ラベル:","select2",m_expedition_options[BET_BKJYUTU_LABEL],betLabelSelectValues);
    BETcreateSpan("#bet_td1_td232", " | ");
    BETcreateSelectBox("#bet_td1_td232", "bet_bkjyutu_skillv" , "スキルレベル:","select2",m_expedition_options[BET_BKJYUTU_SKILLV],betLevelSelectValues);
    BETcreateSpan("#bet_td1_td232", "以上");
    BETcreateSpan("#bet_td1_td251", "使用するHP回復スキル: ※上の方が優先順位高");
    BETcreateSpan("#bet_td1_td261", "使用する");
    BETcreateSelectListBox("#bet_td1_td271","bet_flerecskil1","bet_setrecskil", "7", m_expedition_options[BET_FLERECSKIL1] );
    BETcreateButton("#bet_td1_td272", "bet_btn_up1", "▲", "bet_btn_a");
    BETcreateButton("#bet_td1_td272", "bet_btn_down1", "▼", "bet_btn_a");
    BETcreateButton("#bet_td1_td272", "bet_btn_right1", ">>", "bet_btn_a");
    BETcreateButton("#bet_td1_td272", "bet_btn_left1", "<<", "bet_btn_a");
    BETcreateSpan("#bet_td1_td263", "使用しない");
    BETcreateSelectListBox("#bet_td1_td273","bet_unrecskil1","bet_setrecskil", "7",  m_expedition_options[BET_UNRECSKIL1] );
    BETcreateButton("#bet_td1_td401", "bet_saveSetWindow2", "設定を保存", "bet_btn_c");
    BETcreateButton("#bet_td1_td401", "bet_closeSetWindow2", "閉じる", "bet_btn_c");

}

function bet_logset(){
    var table = j$("<table>");
    j$("#bet_logtab").append(table);
    j$(table).
        append(j$("<tr><td colspan='2' id=bet_td5_11 style='font-size:12px;margin:2px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td class=bet_ctd0></td><td id=bet_td5_21></td></tr>\
                <tr><td class=bet_ctd0></td><td id=bet_td5_31></td></tr>\
                <tr><td colspan='2' id=bet_td5_201 class=ctdb></td></tr>\
    "));

    BETcreateSpan("#bet_td5_11", "直近のログ");
    BETcreateTextBox("#bet_td5_21", "bet_logcount" , " ログ件数:",m_expedition_options[BET_LOGCOUNT],'4','40px',false);
    BETcreateCheckBox("#bet_td5_21", "bet_debugflg" , "詳細出力","bet_debugflg","1",m_expedition_options[BET_DEBUGFLG]);
    BETcreateTextArea("#bet_td5_31", "bet_logarea",'50','75', false);
    BETcreateButton("#bet_td5_201", "bet_saveSetWindow3", "設定を保存", "bet_btn_c");
    BETcreateButton("#bet_td5_201", "bet_closeSetWindow3", "閉じる", "bet_btn_c");

}

function BETcreateCheckBox(container, rid, rtext, rclass, rvalue, ckflag){
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

function BETcreateSpan(container, text){
    var stext = j$("<span>");
    stext.html(text);
    j$( container ).append(stext);
}

function BETcreateSelectBox(container, rid, rtext, rclass, rvalue, selectValues){
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

function BETcreateTextBox(container, rid, rtext, rvalue, rlen, rsize, yinput){
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
function BETcreateTextArea(container, rid, rrow, rcols, yinput){
    var txBox = j$("<textarea>",{
        id: rid,
        value: "",
        rows: rrow,
        cols: rcols,
        disabled: yinput
    });
    j$(container).append(txBox);
}
function BETcreateButton(container, rid, rtext, rclass){
    var btn = j$("<input>",{
        type: 'button',
        id: rid,
        class: rclass,
        value: rtext
    });
    j$( container ).append(btn);
}

function BETcreateSelectListBox(container, rid, rclass, rsize, selectValues){
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

function bet_moveUpElement(rid) {
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

function bet_moveDownElement(rid) {
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

function bet_moveRLElement(_this, tgtid) {
    j$("#" +  _this + " option:selected").each(function() {
        j$("#" + tgtid).append(j$("#" +  _this + " option:selected").clone());
        j$("#" +  _this + " option:selected").remove();
    });
}
//-------------------//
// css定義の追加     //
//-------------------//
function addExpeditionCss() {
    var css =" \
    table .bet_ctd0{width: 30px;} \
    table .bet_ctd1{padding: 2px 2px;} \
    table .bet_ctd2{width: 100px;} \
    table .bet_ctd3{width: 20px;} \
    table .bet_ctdb{padding-top: 20px;} \
    .bet_btn_a {width: 30px;} \
    .bet_btn_c {border:1px solid #777; \
        padding: 4px 10px; \
        color: #fff; \
        cursor: pointer; \
        background: #428ec9; \
        border-radius: 5px;} \
    ";
    GM_addStyle(css);
}

//----------------------//
// Greasemonkey Wrapper //
//----------------------//
function betinitGMWrapper() {
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
function betgetCookie(name) {
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
function bet_saveData(key, value, ev)
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

function bet_loadData(key, value, ev)
{
    var ret = GM_getValue(key, value);

    if (window.chrome) { // 2015.05.23
        return ev ? eval(eval('ret='+ret)) : ret;
    } else {
        return ev ? eval('ret='+ret) : ret;
    }
}

function bet_wait(sec) {
    // jQueryのDeferredを作成
    var objDef = new j$.Deferred;
    setTimeout(function () {
        // sec秒後に、resolve()を実行して、Promiseを完了
        objDef.resolve(sec);
    }, sec*1000);
    return objDef.promise();
};
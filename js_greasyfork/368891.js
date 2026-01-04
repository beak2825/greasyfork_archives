// ==UserScript==
// @name          bro3_troops_tool
// @namespace     bro3_troops_tool
// @description   ブラウザ三国志 出兵
// @include        https://*.3gokushi.jp/*
// @exclude        https://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude        https://*.3gokushi.jp/maintenance*
// @exclude        https://info.3gokushi.jp/*
// @version        1.2
// @grant          GM_addStyle
// @grant          GM_deleteValue
// @grant          GM_getValuezfF
// @grant          GM_log
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @resource    jqueryui_css    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @require    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js

// @downloadURL https://update.greasyfork.org/scripts/368891/bro3_troops_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/368891/bro3_troops_tool.meta.js
// ==/UserScript==
// version date       author
// 1.1    2017/09/25  作成開始
// 1.2    2018/08/01  鹵獲対応＋https対応

// load jQuery
jQuery.noConflict();
j$ = jQuery;

// GreaseMonkeyラッパー関数の定義
trpinitGMWrapper();

//----------//
// 変数定義 //
//----------//
// ソフトウェアバージョン
var VERSION = "1.2";
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
// 特殊定数
var HOST = location.hostname;        // アクセスURLホスト
var SERVICE = '';                    // サービス判定が必要な場合に使用する予約定数
var SVNAME = HOST.substr(0,location.hostname.indexOf(".")) + SERVICE;
var TRP_GM_KEY = "TRP11_" + HOST.substr(0,HOST.indexOf("."));

//使用する設定
var TRP_TROOPSLABEL = 'trp_troopslabel';  //出兵武将ラベル
var TRP_TROOPSVIL = 'trp_troopsvil';      //出兵拠点
var TRP_DOMEI = 'trp_domei';              //同盟
var TRP_TROOPX = 'trp_troopx';            //出兵座標X
var TRP_TROOPY = 'trp_troopy';            //出兵座標Y
var TRP_GAGE_DECK = 'trp_gage_deck';      //デッキにあげる討伐
var TRP_GAGE_TROOPS = 'trp_gage_troops';  //出兵する討伐
var TRP_YN_USESHIN = 'trp_yn_useshin';    //神医系スキルを使用するか
var TRP_YN_USEKAI = 'trp_yn_usekai';      //傾国スキルを使用するか

var TRP_YN_KAICST = 'trp_yn_kaicst';      //デッキコストあけるか
var TRP_TROOPKAICST = 'trp_troopkaicst';  //回復用空きコスト

//回復
var TRP_SINLABEL = 'trp_sinlabel';        //神医ラベル
var TRP_SINLEVEL = 'trp_sinlevel';        //神医スキルレベル
var TRP_RYUCGRLABEL = 'trp_ryucgrlabel';  //劉備の契りラベル
var TRP_RYUCGRLEVEL = 'trp_ryucgrlevel';  //劉備の契りスキルレベル
var TRP_SINBOKLABEL = 'trp_sinboklabel';  //神卜の術式ラベル
var TRP_SINBOKLEVEL = 'trp_sinboklevel';  //神卜の術式スキルレベル
var TRP_KEILABEL = 'trp_keilabel';        //傾国ラベル
var TRP_KEILEVEL = 'trp_keilevel';        //傾国スキルレベル

//兵士付帯
var TRP_YN_INCID = 'trp_yn_incid';        //兵を付けるかどうか
var TRP_STOPINCID = 'trp_stopincid';      //兵数しきい値

//ログ
var TRP_LOGCOUNT = 'trp_logcount';
var TRP_DEBUGFLG = 'trp_debugflg';

// オプション設定管理用
var m_troops_options;
var trpVilSelectValues = { };
var trpCostSelectValues = { "1": "1", "2": "1.5","3": "2","4":"2.5","5":"3","6":"3.5","7":"4","8":"4.5"};
var trpLabelSelectValues = { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10","11":"11","12":"12","13":"13","14":"14" };
var trpLevelSelectValues= { "1":"1","2":"2","3":"3","4":"4","5":"5","6":"6",
                    "7":"7","8":"8","9":"9","10":"10" };
//----------------//
// メインルーチン //
//----------------//
(function() {
    //前回のリロードから30分以上経っていればツールOFF
    var dt = new Date();
    var dt2=GM_getValue(TRP_GM_KEY + '_chktime', null);
    if (dt2!=null){
        var diff = dt.getTime() - Date.parse(dt2);
        var minute = diff/(1000*60);
        if (minute>30){
            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
        }
    } else {
        GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
    }
    GM_setValue(TRP_GM_KEY + '_chktime', dt);

    // 実行判定
    if (trpisExecute() === false) {
        return;
    }
    //設定画面描写
    loadTroopsSettings();
    createTroopsSettingWindow();
    // 君主プロフィール
    if (location.pathname == "/user/" || location.pathname == "/user/index.php") {
        trpsaveUserProfile();
    }
    // 都市画面
    if (location.pathname == "/village.php") {
        // セッションIDの取得
        var session_id = trpgetSessionId();
        if (session_id === "" ){
            alert("ページの仕様が変更されたため情報が取れませんでした。");
            return;
        }
        // 出兵処理
        if(GM_getValue(TRP_GM_KEY +"_TroopsAutoFlg", false)==true){
            troopstoolstart();
        }

    }
    //領地画面
    if (location.pathname == "/land.php") {
        trp_getarea();
    }
})();


//--------------------//
// スクリプト実行判定 //
//--------------------//
function trpisExecute() {
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
function trpgetSessionId() {
    return trpgetCookie('SSID');
}

//------------------------//
// プロフィール情報を保存 //
//------------------------//
function trpsaveUserProfile(targetObject){
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
    j$("table[class=commonTables] tr:has(a[href*='village_change.php'])", target).slice(0,10).each(
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

    var savedVillageList = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);   // 保存された拠点情報
    if (savedVillageList.length === 0) {
        villageList[0].roundgo = true;
    }

    // 拠点情報の保存
    trpsaveData(TRP_GM_KEY+"_VillageList", villageList, true);
    var l_villageList = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
    console.log(l_villageList);

    //同盟名取得
    var l_domei =j$("table[class=commonTables] td:has(a[href*='alliance/info.php'])", target).eq(0).text().trim();
    console.log(l_domei);
    //設定のロード
    loadTroopsSettings();
    m_troops_options[TRP_DOMEI]=l_domei;
    var options=m_troops_options;
    //設定を保存
    GM_setValue(TRP_GM_KEY + '_troops_options', JSON.stringify(options));
}

// 出兵ツールの設定のロード
function loadTroopsSettings() {
    // 保存データの取得
    var obj = GM_getValue(TRP_GM_KEY + '_troops_options', null);
    var options;
    if (obj == null) {
        options = getTroopsDefaultOptions();
    } else {
        options = JSON.parse(obj);
    }

    // 保存データにデフォルト設定の情報がない場合、デフォルト設定を追加
    var defaults = getTroopsDefaultOptions();
    for (var key in defaults) {
        if (typeof options[key] == "undefined") {
            options[key] = defaults[key];
        }
    }
    m_troops_options = options;
}
//--------------//
// 設定画面作成 //
//--------------//
function createTroopsSettingWindow() {
    //css定義を追加
    addTroopsCss();
    //画面描画(設定画面)
    TroopsdrawSettingButton();
    //出兵ボタン設定
    setTroopsAutoflag();
}

//----------------------------------//
//出兵ツール設定画面起動ボタンを描画      //
//----------------------------------//
function TroopsdrawSettingButton() {
    j$("#sidebar").prepend(
        "<span style=\"color: #ffffff;\"><a href='#' id=troopstoolButton class='troopstoollink'>出兵設定</a></span> \
         <button type=button id=btn_troops style=\"width:70px;\">実行する</button>"
    );
    drawSetTroopsWindow();
    trpbtnchange();
    j$("#troopstoolButton").on("click", function(){
        var villageList = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
        if (villageList.length === 0) {
            alert("プロフィールページにアクセスして、拠点情報の読み込みを行ってください。");
        } else {
            loadTroopsSettings();
            // 保存されているoption設定を設定画面に反映
            for (var key in m_troops_options) {
                if (j$("#" + key).length > 0) {
                    // チェックボックスの場合、チェックのオンオフを再現
                    if (j$("#" + key).attr('type') == 'checkbox') {
                        j$("#" + key).prop('checked', m_troops_options[key]);
                    } else if (j$("#" + key).attr('type') == 'text') {
                        j$("#" + key).val(m_troops_options[key]);
                    } else if (j$("#" + key).is('select')) {
                        j$("#" + key + ' option').filter(function(index){return j$(this).val() == m_troops_options[key];}).prop('selected', true);
                    }
                }
            }
            //ログ取得
            var l_log=new Array();
            var l_chklog=GM_getValue(TRP_GM_KEY + '_troopslog', "");
            if (l_chklog!=""){
                l_log = GM_getValue(TRP_GM_KEY + '_troopslog', []).split(',');
                var l_loglen=l_log.length;
                var TROOPS_LOG="";
                for (var i=l_loglen; i--;){
                    TROOPS_LOG = TROOPS_LOG + l_log[i] + "\n";
                }
                j$("#trp_logarea").val(TROOPS_LOG);
            }
            j$("#troops_setting_view").css({'display':'block'});
        }
    });
}
function setTroopsAutoflag(){
    if(GM_getValue(TRP_GM_KEY +"_TroopsAutoFlg", false)==true){
        j$("#btn_troops").text("実行中");
    }else{
        j$("#btn_troops").text("実行する");
    }
}
//--------------------//
// 出兵実行ボタン     //
//--------------------//
function trpbtnchange(){
    j$("#btn_troops").on("click",function(){
        if(GM_getValue(TRP_GM_KEY +"_TroopsAutoFlg", true)==true){
            j$(this).text("実行する");
            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
        }else{
            j$(this).text("実行中");
            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", true);
            trpsetlblpage();
        }
        location.reload();
    });
}

//-----------------------//
// 出兵処理実行          //
//-----------------------//
function troopstoolstart(){
    //出兵拠点へ移動
    var vilflag = false;
    j$("div[class='sideBoxInner basename'] ul li").each(
        function(index){
            var current = false;
            if (j$(this).attr("class") == 'on') {
                current = true;
            }
            var search;
            if (current == true) {
                if (j$("span", this).eq(0).text() == m_troops_options[TRP_TROOPSVIL]) {
                    troops_main();
                    vilflag = true;
                }
            } else {
                if (j$("a", this).eq(0).text() == m_troops_options[TRP_TROOPSVIL]) {
                    console.log(j$("a", this).eq(0).attr('href'));
                    location.href = "https://" + HOST + j$("a", this).eq(0).attr('href');
                    vilflag = true;
                }
            }
        });
    if (vilflag == false){
        trpsettroopslog("出兵拠点が存在しません："+m_troops_options[TRP_TROOPSVIL]);
    }
}
//-----------------//
//領地取得         //
//-----------------//
function trp_getarea() {
    j$("#tMenu_btnif ul[class='upper clearfix']").after(
        "<div style='margin-bottom: 4px;'>" +
        "<button type=button id=btn_trparea>出兵ツールの出兵先に登録する</button>" +
        "</div>"
    );

    var RX_VAL ="";
    var RY_VAL ="";
    j$("#btn_trparea").on("click",function(){
        var l_lctmth = location.href.match(/land.php\?x=([-]?\d+)&y=([-]?\d+)/);
        if (l_lctmth != null) {
            //設定のロード
            loadTroopsSettings();
            //設定値取得
            var x_val=l_lctmth[1];
            var y_val=l_lctmth[2];
            //保存
            m_troops_options[TRP_TROOPX]=x_val;
            m_troops_options[TRP_TROOPY]=y_val;
            var options=m_troops_options;
            //設定を保存
            GM_setValue(TRP_GM_KEY + '_troops_options', JSON.stringify(options));
            alert("保存しました。");
        }
    });
}
//-----------------------//
// ＴＰ出兵処理          //
//-----------------------//
function troops_main(){
    var l_chk=0;
    trpgetdecklist();                     //デッキのカードを取得
    //出兵中のカードが存在すれば処理しない
    if (trpchkcdwait()==0){
         trpcdunset();                     //カードをデッキから下す
         l_chk=trpcdset();                 //カードをデッキにあげる
         if (l_chk==0){
            //デッキにあげることのできるカードが存在しない
            if (trpchkcdset()==0){
                if (m_troops_options[TRP_YN_USESHIN]==true){
                    l_chk=trpchkcare();       //神医使用チェック
                    if (l_chk==1){
                        l_chk=trpcare();      //神医使用
                    }
                }
            } else {
                l_chk=1;
                location.reload();
            }
        }
        if (l_chk==0){
            l_chk=trpcdset();                   //カードをデッキにあげる
            if (l_chk==0){
                //デッキにあげるカードが存在しない
                if (trpchkcdset()==0){
                    if (m_troops_options[TRP_YN_USEKAI]==true){
                        l_chk=trpkeiset();           //討伐回復
                    }
                    if (l_chk==0){
                        trpcdtrol();                //出兵
                        location.reload();
                    }
                } else {
                    location.reload();
                }
            }
        }
    }
    if(GM_getValue(TRP_GM_KEY +"_TroopsAutoFlg", false)==true){
        trp_wait(60).done(function(){
            location.reload();
        });
    }
}


//-------------------------------//
// 出兵中のカードが存在するか    //
//-------------------------------//
function trpchkcdwait(){
   console.log("出兵中のカードが存在するかチェック開始");
   if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("出兵中のカードが存在するかチェック開始");}
   var l_chk = 0;
   var deckList = trploadData(TRP_GM_KEY+ "_deckList", "[]", true);
   if(deckList.length != 0){
       for(var d= 0; d < deckList.length; d++) {
           if (deckList[d].setsta.match(/出兵中/)){
               if (m_troops_options[TRP_DEBUGFLG]==true){
                   trpsettroopslog(deckList[d].name+":出兵中のカード");
               }
               l_chk = 1;
               return l_chk;
           }
       }
   }
   return l_chk;
}
//----------------------------------//
//  カード下げる処理                //
//----------------------------------//
function trpcdunset(){
    console.log("デッキから討伐がしきい値以下のカードを下す");
    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("デッキから討伐がしきい値以下のカードを下す");}
    var l_deckList = trploadData(TRP_GM_KEY+ "_deckList", "[]", true);
    var chk=0;
    var l_gate;
    if (l_deckList.length != 0) {
        for( var d= 0; d < l_deckList.length; d++){
            if (l_deckList[d].setsta.match(/待機中/)){
                var l_gage=parseInt(l_deckList[d].gage);
                var l_gageup=parseInt(m_troops_options[TRP_GAGE_DECK]);
                if (l_gage<l_gageup){
                    console.log("カードを下ろす");
                    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog(l_deckList[d].name+"は討伐ゲージがしきい値以下です");}
                    trpunsetdeckcard(l_deckList[d].cdid);
                    var txt="カードID:"+l_deckList[d].cdid+" "+l_deckList[d].name+"をデッキから下しました";
                    trpsettroopslog(txt);
                }
            }
        }
    }
}
//-------------------------------//
// 回復が必要かチェック          //
//-------------------------------//
function trpchkcare(){
    console.log("回復が必要かチェック開始");
    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("神医系の回復が必要かチェック開始");}
    var l_chk = 0;
    var l_page;
    var l_hp;
    var l_gage;
    var l_label;
    //デッキにコストがある
    //trpgetdecklist();  //デッキの状態取得
    var l_cdcost=0;
    if (m_troops_options[TRP_YN_KAICST]==true){
        l_cdcost = parseFloat(trpCostSelectValues[(m_troops_options[TRP_TROOPKAICST])]);
    }
    var usecst = GM_getValue(TRP_GM_KEY+"_UseCost", 0);
    var deckcst = GM_getValue(TRP_GM_KEY+"_DeckCost", 0);
    console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,l_cdcost);
    var chkcost= deckcst - usecst - l_cdcost;
    if (chkcost<1){
        return 0;
    }
    console.log("設定ラベルにデッキのしきい値以上の討伐がありHP100以下の武将がいるかチェック");
    l_label = m_troops_options[TRP_TROOPSLABEL];
    l_page= GM_getValue(TRP_GM_KEY + '_trplblpage' + l_label,1);
    trpchkcareLbl1:
    for (var m = 1; m <= l_page ; m++) {
        //ファイルのカードを取得
        console.log("fileno: %d   page:  %d" , l_label , m);
        trpgetfilelist(l_label , m);
        var fileList = trploadData(TRP_GM_KEY+"_fileList", "[]", true);
        if (fileList.length != 0 ) {
            for(var fa= 0; fa < fileList.length; fa++){
                console.log("fileno: %d  カード名: %s HP: %d  討伐: %d" , l_label , fileList[fa].name, fileList[fa].hp, fileList[fa].gage);
                l_hp=parseInt(fileList[fa].hp);
                l_gage=parseInt(fileList[fa].gage);
                var l_gageup=parseInt(m_troops_options[TRP_GAGE_DECK]);
                if ((l_hp<100) && (l_gage>=l_gageup) && (fileList[fa].setsta.match(/HP回復中/))){
                    console.log("HP100以下なので回復する");
                    if (m_troops_options[TRP_DEBUGFLG]==true){
                        var txt=fileList[fa].name+":id="+ fileList[fa].cdid +":カードのHP回復が必要";
                        trpsettroopslog(txt);
                    }
                    l_chk = 1;
                    break trpchkcareLbl1;
                }
            }
        }
    }
    return l_chk;
}
//--------------------------//
//  回復処理                //
//--------------------------//
function trpcare(cdlist){
    console.log("回復処理開始");
    //回復拠点に内政設定武将が存在する
    var deckList = trploadData(TRP_GM_KEY+ "_deckList", "[]", true);
    if (deckList.length != 0 ) {
        for( var d = 0; d < deckList.length; d++ ) {
            if ((deckList[d].setsta.indexOf("内政セット済") != -1) && (m_troops_options[TRP_TROOPSVIL]==deckList[d].setvil)){
                trpsettroopslog("拠点に内政武将が存在します");
                return 0;
            }
        }
    }
    var CDLST = eval(cdlist);
    var obj = {"0":"神医の術式","1":"劉備の契り","2":"神卜の術式"};
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
        if (m_troops_options[TRP_DEBUGFLG]==true){
            var txt=obj[k] + "のスキルを探す処理を開始";
            trpsettroopslog(txt);
        }
        var kailabl="";
        var kailevel="";
        var kaipage="";
        if (obj[k]=="神医の術式"){kailabl=m_troops_options[TRP_SINLABEL]; kailevel=m_troops_options[TRP_SINLEVEL];}
        else if (obj[k]=="劉備の契り"){kailabl=m_troops_options[TRP_RYUCGRLABEL]; kailevel=m_troops_options[TRP_RYUCGRLEVEL];}
        else if (obj[k]=="神卜の術式"){kailabl=m_troops_options[TRP_SINBOKLABEL]; kailevel=m_troops_options[TRP_SINBOKLEVEL];}

        kaipage= GM_getValue(TRP_GM_KEY + '_trplblpage' + kailabl,1);
        for (var m = 1; m<= kaipage; m++){
            //ファイルのカードを取得
            console.log("fileno:" + kailabl +" page:" +m +" skillevel:" + kailevel);
            trpgetfilelist(kailabl, m);
            var fileList = trploadData(TRP_GM_KEY+"_fileList", "[]", true);
            if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("ラベル:"+kailabl+" ページ:"+m);}
            if (fileList.length != 0 ) {
                for(var fa= 0; fa < fileList.length; fa++) {
                    console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                    console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                    console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                    var kaiflag = false;
                    var kaiskilid="";
                    var kainame="";
                    if ((fileList[fa].cdskil1.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                    else if ((fileList[fa].cdskil2.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                    else if ((fileList[fa].cdskil3.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                    else if ((fileList[fa].cdskil4.indexOf(obj[k]) != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                    if (m_troops_options[TRP_DEBUGFLG]==true){
                        trpsettroopslog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        trpsettroopslog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        trpsettroopslog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        trpsettroopslog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta);
                    }
                    //デッキに乗せる
                    if (kaiflag == true){
                        l_chk=true;
                        if (fileList[fa].setsta =="set"){
                            console.log("内政セットしてスキル発動する");
                            //回復拠点設定
                            var lists = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
                            var setvillage ="";
                            for (var ln = 0; ln< lists.length; ln++) {
                                if(lists[ln].name==m_troops_options[TRP_TROOPSVIL]){
                                    setvillage=lists[ln].id;
                                }
                            }
                            if (setvillage!=""){
                                console.log("回復拠点ID:" + setvillage);
                                l_status=trpsetdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                                if (l_status==0){
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                                    trpsettroopslog(txt);
                                    break Label0;
                                } else {
                                    var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                                    trpsettroopslog(txt);
                                    l_chk=false;
                                    l_ckNgnum=l_ckNgnum+1;
                                }
                            } else {
                                trpsettroopslog("拠点が存在しません");
                                GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                                l_ret=1;
                                break Label0;
                            }
                            if (parseInt(l_ckNgnum)>parseInt(statngnum)){
                                trpsettroopslog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                                GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                                l_ret=1;
                                break Label0;
                            }
                        }
                    }
                }
            }
        }
    }
    if (l_chk==false){
        trpsettroopslog("使用できる神医系回復武将が存在しない");
        GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
        l_ret=1;
    }
    return l_ret;
}
//----------------------------//
// カードセット処理           //
//----------------------------//
function trpcdset(){
    console.log("カードをデッキに乗せる");
    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("カードをデッキに乗せる処理を開始する");}
    //カードを取得
    var lblpage = GM_getValue(TRP_GM_KEY + '_trplblpage' + m_troops_options[TRP_TROOPSLABEL],1);
    var l_chk=0;
    var l_flg=0;
    var l_gage;
    var kailabl=m_troops_options[TRP_TROOPSLABEL];

    //trpgetdecklist();  //デッキの状態取得
    var l_cdcost=0;
    if (m_troops_options[TRP_YN_KAICST]==true){
        l_cdcost = parseFloat(trpCostSelectValues[(m_troops_options[TRP_TROOPKAICST])]);
    }
    var usecst = GM_getValue(TRP_GM_KEY+"_UseCost", 0);
    var deckcst = GM_getValue(TRP_GM_KEY+"_DeckCost", 0);
    console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,l_cdcost);
    var chkcost= deckcst - usecst - l_cdcost;

    trpcdsetlbl1:
    while(chkcost>0){
        trpcdsetlbl2:
        for (var m = 1; m <= lblpage ; m++) {
            //ファイルのカードを取得
            console.log("fileno:" + kailabl +" page:" +m);
            trpgetfilelist(kailabl, m);
            var fileList = trploadData(TRP_GM_KEY+"_fileList", "[]", true);
            if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("ラベル:"+kailabl+" ページ:"+m);}
            if (fileList.length != 0){
                for( var fa= 0; fa < fileList.length; fa++ ){
                    console.log("fileno:" +m_troops_options[TRP_TROOPSLABEL]  +" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage);
                    if (m_troops_options[TRP_DEBUGFLG]==true){
                        var txt=" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage;
                        trpsettroopslog(txt);
                    }
                    l_gage=parseInt(fileList[fa].gage);
                    var l_gageup=parseInt(m_troops_options[TRP_GAGE_DECK]);
                    if ((fileList[fa].setsta =="set") && (l_gage>=l_gageup)){   //デッキにセット可能  かつ討伐ゲージしきい値以上
                        //コストが存在すればデッキにあげる
                        l_flg=1;
                        l_cdcost=0;
                        if (m_troops_options[TRP_YN_KAICST]==true){
                            l_cdcost = parseFloat(trpCostSelectValues[(m_troops_options[TRP_TROOPKAICST])]);
                        }
                        usecst = GM_getValue(TRP_GM_KEY+"_UseCost", 0);
                        deckcst = GM_getValue(TRP_GM_KEY+"_DeckCost", 0);
                        console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,l_cdcost);
                        chkcost= deckcst - usecst - l_cdcost;
                        var pcdcst = parseFloat(fileList[fa].cost);
                        if (pcdcst > chkcost){
                            if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog(fileList[fa].name+"を乗せるデッキコストが存在しない");}
                            break trpcdsetlbl1;
                        }

                        console.log("出兵するためにデッキに乗せる");
                        //カードをデッキに乗せる
                        //拠点設定
                        var lists = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
                        var setvillage ="";
                        for (var ln = 0; ln< lists.length; ln++) {
                            if(lists[ln].name==m_troops_options[TRP_TROOPSVIL]){
                                setvillage=lists[ln].id;
                            }
                        }
                        if (setvillage!=""){
                            console.log("出兵拠点ID:" + setvillage);
                            trpsetdeckcard(fileList[fa].cdid, setvillage);
                            var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+"をデッキに乗せました";
                            trpsettroopslog(txt);
                            //break trpcdsetlbl2;
                            break trpcdsetlbl1;
                        } else {
                            trpsettroopslog("拠点が存在しません");
                            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                            l_chk=1;
                            break trpcdsetlbl1;
                        }
                    }
                }
            }
        }
        if (l_flg==0){
            break trpcdsetlbl1;
        }
        //trpgetdecklist();  //デッキの状態取得
        l_cdcost=0;
        if (m_troops_options[TRP_YN_KAICST]==true){
            l_cdcost = parseFloat(trpCostSelectValues[(m_troops_options[TRP_TROOPKAICST])]);
        }
        usecst = GM_getValue(TRP_GM_KEY+"_UseCost", 0);
        deckcst = GM_getValue(TRP_GM_KEY+"_DeckCost", 0);
        console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,l_cdcost);
        chkcost= deckcst - usecst - l_cdcost;
    }
    return l_chk;
}

//----------------------------//
// カードセットチェック         //
//----------------------------//
function trpchkcdset(){
    console.log("デッキに乗せることの出来るカードがあるかチェック");
    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("デッキに乗せることの出来るカードがあるかチェック");}
    //カードを取得
    var lblpage = GM_getValue(TRP_GM_KEY + '_trplblpage' + m_troops_options[TRP_TROOPSLABEL],1);
    var l_chk=0;
    var l_flg=0;
    var l_gage;
    var kailabl=m_troops_options[TRP_TROOPSLABEL];

    trpcdsetlbl1:
    for (var m = 1; m <= lblpage ; m++) {
        //ファイルのカードを取得
        console.log("fileno:" + kailabl +" page:" +m);
        trpgetfilelist(kailabl, m);
        var fileList = trploadData(TRP_GM_KEY+"_fileList", "[]", true);
        if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("ラベル:"+kailabl+" ページ:"+m);}
        if (fileList.length != 0){
            for( var fa= 0; fa < fileList.length; fa++ ){
                console.log("fileno:" +m_troops_options[TRP_TROOPSLABEL]  +" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage);
                if (m_troops_options[TRP_DEBUGFLG]==true){
                    var txt=" カード名:"+ fileList[fa].name + " 状態:"+ fileList[fa].setsta + " 討伐:"+ fileList[fa].gage;
                    trpsettroopslog(txt);
                }
                l_gage=parseInt(fileList[fa].gage);
                var l_gageup=parseInt(m_troops_options[TRP_GAGE_DECK]);
                if ((fileList[fa].setsta =="set") && (l_gage>=l_gageup)){   //デッキにセット可能  かつ討伐ゲージしきい値以上
                    //コストが存在すればデッキにあげる
                    var l_cdcost=0;
                    if (m_troops_options[TRP_YN_KAICST]==true){
                        l_cdcost = parseFloat(trpCostSelectValues[(m_troops_options[TRP_TROOPKAICST])]);
                    }
                    var usecst = GM_getValue(TRP_GM_KEY+"_UseCost", 0);
                    var deckcst = GM_getValue(TRP_GM_KEY+"_DeckCost", 0);
                    console.log("使用コスト: %d  デッキコスト: %d  回復コスト:%d",usecst,deckcst,l_cdcost);
                    var chkcost= deckcst - usecst - l_cdcost;
                    var pcdcst = parseFloat(fileList[fa].cost);
                    if (pcdcst <= chkcost){
                        if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog(fileList[fa].name+"を乗せるデッキコストが存在する");}
                        l_flg=1;
                        break trpcdsetlbl1;
                    }
                }
            }
        }
    }
    return l_flg;
}

//-------------------------------//
// 傾国回復処理                  //
//-------------------------------//
function trpkeiset(){
    var l_chk=0;
    var l_gage;
    var l_flg=0;
    trpkeisetLbl1:
    for (var num = 0; num < 5; num++){
    //傾国回復処理が必要かチェック
        trpgetdecklist();  //デッキの状態取得
        var deckList = trploadData(TRP_GM_KEY+ "_deckList", "[]", true);
        trpkeisetLbl2:
        if (deckList.length != 0) {
            l_flg=0;
            for(var d= 0; d < deckList.length; d++){
                //しきい値以下のカードが存在する
                l_gage=parseInt(deckList[d].gage);
                var l_gageup=parseInt(m_troops_options[TRP_GAGE_TROOPS]);
                if ((deckList[d].setsta.match(/待機中/)) && (l_gage<l_gageup)){
                    l_flg=1;
                    //回復処理を行う
                    l_chk=trpkeicare();
                    break trpkeisetLbl2;
                }
            }
            if (l_flg==0){
                break trpkeisetLbl1;
            }
        }
    }
    return l_chk;
}
//----------------------------------//
//  傾国回復処理                    //
//----------------------------------//
function trpkeicare(){
    console.log("傾国スキルを探す");
    if (m_troops_options[TRP_DEBUGFLG]==true){
        trpsettroopslog("傾国スキルを探す");
    }
    var l_chk=0;
    var l_rank=false;
    var kailabl=m_troops_options[TRP_KEILABEL];
    var kailevel=m_troops_options[TRP_KEILEVEL];
    var kaipage= GM_getValue(TRP_GM_KEY + '_trplblpage' + kailabl,1);
    var kaitime="";
    var l_status=0;
    var l_ckNgnum=0;
    Label0:
    for (var m = 1; m <= kaipage ; m++) {
        //ファイルのカードを取得
        console.log("fileno:" + kailabl +" page:" + m +" skillevel:" + kailevel );
        trpgetfilelist(kailabl, m);
        var fileList = trploadData(TRP_GM_KEY+"_fileList", "[]", true);
        if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("傾国ラベル:"+kailabl+" ページ:"+m);}
        if (fileList.length != 0 ) {
            for( var fa= 0; fa < fileList.length; fa++ ) {
                console.log("fileno:" +kailabl +"カード名:"+ fileList[fa].name);
                console.log("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                console.log("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                var kaiflag = false;
                var kaiskilid="";
                var kainame="";
                if ((fileList[fa].cdskil1.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil1kai == true) && (fileList[fa].cdskil1.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil1id;kainame=fileList[fa].cdskil1;}
                else if ((fileList[fa].cdskil2.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil2kai == true) && (fileList[fa].cdskil2.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil2id;kainame=fileList[fa].cdskil2;}
                else if ((fileList[fa].cdskil3.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil3kai == true) && (fileList[fa].cdskil3.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil3id;kainame=fileList[fa].cdskil3;}
                else if ((fileList[fa].cdskil4.indexOf("傾国") != -1) && (fileList[fa].trade.indexOf("副将として使用中") == -1) && (fileList[fa].trade.indexOf("トレード出品中") == -1) && (fileList[fa].cdskil4kai == true) && (fileList[fa].cdskil4.match(/LV\d+/g)[0].slice(2) >= kailevel)){ kaiflag = true; kaiskilid = fileList[fa].cdskil4id;kainame=fileList[fa].cdskil4;}
                if (m_troops_options[TRP_DEBUGFLG]==true){
                        trpsettroopslog("カード名:"+fileList[fa].name+" カードID:"+fileList[fa].cdid);
                        trpsettroopslog("skil1:" + fileList[fa].cdskil1 + " skil1回復:" + fileList[fa].cdskil1kai + " skil2:" + fileList[fa].cdskil2 +" skil2回復:" + fileList[fa].cdskil2kai);
                        trpsettroopslog("skil3:" + fileList[fa].cdskil3 + " skil3回復:" + fileList[fa].cdskil3kai + " skil4:" + fileList[fa].cdskil4 +" skil4回復:" + fileList[fa].cdskil4kai);
                        trpsettroopslog("HP:" + fileList[fa].hp + " ボタン:" + fileList[fa].setsta);
                 }
                //デッキに乗せる
                if ((fileList[fa].setsta =="set") && (kaiflag == true)){
                    l_rank=true;
                    console.log("傾国セットしてスキル発動する");
                    //回復拠点設定
                    var lists = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
                    var setvillage ="";
                    for (var ln = 0; ln< lists.length; ln++) {
                        if(lists[ln].name==m_troops_options[TRP_TROOPSVIL]){
                            setvillage=lists[ln].id;
                        }
                    }
                    if (setvillage!=""){
                        console.log("回復拠点ID:" + setvillage);
                        l_status=trpsetdeckskilll_status=trpsetdeckskill(fileList[fa].cdid, kaiskilid,setvillage,2);
                        if (l_status==0){
                            var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"を使用しました";
                            trpsettroopslog(txt);
                            break Label0;
                        } else {
                            var txt="カードID:"+fileList[fa].cdid+" "+fileList[fa].name+" "+ kainame +"の使用に失敗しました";
                            trpsettroopslog(txt);
                            l_ckNgnum=l_ckNgnum+1;
                        }
                    } else {
                        trpsettroopslog("拠点が存在しません");
                        GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                        l_chk=1;
                        break Label0;
                    }
                    if (parseInt(l_ckNgnum)>parseInt(statngnum)){
                        trpsettroopslog("カードの状態変更に規定数以上失敗したのでツールを停止します");
                        GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                        l_chk=1;
                        break Label0;
                    }
                }
            }
        }
    }
    if (l_rank==false){
        if (m_troops_options[TRP_DEBUGFLG]==true){
            trpsettroopslog("傾国スキルで回復しているものが存在しない");
            l_chk=1;
        }
    }
    return l_chk;
}
//-------------------------//
//   出兵処理              //
//-------------------------//
function trpcdtrol(){
    console.log("出兵処理");
    if (m_troops_options[TRP_DEBUGFLG]==true){trpsettroopslog("出兵処理を開始する");}
    var l_chk=0;
    var l_gage;
    var l_cdnum;
    var deckList = trploadData(TRP_GM_KEY+ "_deckList", "[]", true);
    if (deckList.length != 0) {
        for(var d= 0; d < deckList.length; d++){
            l_gage=parseInt(deckList[d].gage);
            var l_gageup=parseInt(m_troops_options[TRP_GAGE_TROOPS]);
            if ((deckList[d].setsta.match(/待機中/)) && (l_gage<l_gageup)){
                //出兵討伐しきい値以下のカードが存在する
                if (m_troops_options[TRP_DEBUGFLG]==true){
                    trpsettroopslog(deckList[d].name+":出兵討伐しきい値以下のカード");
                }
                l_chk=1;
            }
        }
    }

    //空地チェック
    var x_value = 0;
    var y_value = 0;
    if (l_chk==0){
        if ((m_troops_options[TRP_TROOPX]!="") && (m_troops_options[TRP_TROOPY]!="")){
            x_value = parseInt(m_troops_options[TRP_TROOPX]);
            y_value = parseInt(m_troops_options[TRP_TROOPY]);
            var bname=trpgetBasename(x_value,y_value);
            if (bname!=0){
                trpsettroopslog("設定領地に出兵できません");
                GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
                l_chk=1;
            }
        } else {
            trpsettroopslog("設定領地に出兵できません");
            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
            l_chk=1;
        }
    }
    //出兵処理
    if (l_chk==0){
        //拠点にあって待機しているカード枚数取得
        l_cdnum=0;
        if (deckList.length != 0) {
            for(var d= 0; d < deckList.length; d++){
                if ((deckList[d].setsta.match(/待機中/)) && (m_troops_options[TRP_TROOPSVIL]==deckList[d].setvil)){
                    l_cdnum=l_cdnum+1;
                }
            }
        }

        var l_infantrycnt=0;
        var l_shieldcnt=0;
        var l_spearcnt=0;
        var l_archercnt=0;
        var l_cavalrycnt=0;
        var l_ramcnt=0;
        var l_scoutcnt=0;
        var l_large_infantrycnt=0;
        var l_heavy_shieldcnt=0;
        var l_halbertcnt=0;
        var l_crossbowcnt=0;
        var l_cavalry_guardscnt=0;
        var l_catapultcnt=0;
        var l_cavalry_scoutcnt=0;
        var l_sumcnt=0;
        if (m_troops_options[TRP_YN_INCID]==true){
            trpgetSoldierall();     //拠点の兵数を取得
            var soldierList = trploadData(TRP_GM_KEY+"_soldierList", "[]", true);
            //待機している兵数取得して割る
            if (soldierList.length != 0) {
                l_infantrycnt=Math.floor((parseInt(soldierList[0].infantry))/(parseInt(l_cdnum)));
                l_shieldcnt=Math.floor((parseInt(soldierList[0].shield))/(parseInt(l_cdnum)));
                l_spearcnt=Math.floor((parseInt(soldierList[0].spear))/(parseInt(l_cdnum)));
                l_archercnt=Math.floor((parseInt(soldierList[0].archer))/(parseInt(l_cdnum)));
                l_cavalrycnt=Math.floor((parseInt(soldierList[0].cavalry))/(parseInt(l_cdnum)));
                //l_ramcnt=Math.floor((parseInt(soldierList[0].ram))/(parseInt(l_cdnum)));
                //l_scoutcnt=Math.floor((parseInt(soldierList[0].scout))/(parseInt(l_cdnum)));
                l_large_infantrycnt=Math.floor((parseInt(soldierList[0].large_infantry))/(parseInt(l_cdnum)));
                l_heavy_shieldcnt=Math.floor((parseInt(soldierList[0].heavy_shield))/(parseInt(l_cdnum)));
                l_halbertcnt=Math.floor((parseInt(soldierList[0].halbert))/(parseInt(l_cdnum)));
                l_crossbowcnt=Math.floor((parseInt(soldierList[0].crossbow))/(parseInt(l_cdnum)));
                l_cavalry_guardscnt=Math.floor((parseInt(soldierList[0].cavalry_guards))/(parseInt(l_cdnum)));
                //l_catapultcnt=Math.floor((parseInt(soldierList[0].catapult))/(parseInt(l_cdnum)));
                //l_cavalry_scoutcnt=Math.floor((parseInt(soldierList[0].cavalry_scout))/(parseInt(l_cdnum)));
                l_sumcnt=parseInt(soldierList[0].sumcount);
            }
        }

        var l_siege=0;
        if (((m_troops_options[TRP_YN_INCID]==true)&&(m_troops_options[TRP_STOPINCID]<l_sumcnt)) || (m_troops_options[TRP_YN_INCID]==false)){
            //拠点にあって待機しているカードを出兵する
            if (deckList.length != 0) {
                for(var d= 0; d < deckList.length; d++){
                    if ((deckList[d].setsta.match(/待機中/)) && (m_troops_options[TRP_TROOPSVIL]==deckList[d].setvil)){
                        var skilid="";      //スキル
                        var fukcdid="";     //副将
                        var fukskilid="";   //副将スキル
                        //trpsettroopslog(deckList[d].name+" カードID:"+deckList[d].cdid+"を出兵します");
                        l_siege=trpdispatchtool(deckList[d].cdid, skilid,fukcdid, fukskilid,x_value,y_value,l_infantrycnt,l_shieldcnt,l_spearcnt,l_archercnt,l_cavalrycnt,l_ramcnt,l_scoutcnt,l_large_infantrycnt,l_heavy_shieldcnt,l_halbertcnt,l_crossbowcnt,l_cavalry_guardscnt,l_catapultcnt,l_cavalry_scoutcnt);
                        if (l_siege==1){
                            //籠城中
                            trpsettroopslog("籠城中です");
                            return false;
                        } else if(l_siege==2){
                            return false;
                        } else if(l_chkatk==0){
                            var txt=deckList[d].name+" LV"+deckList[d].level+"を出兵しました";
                            trpsettroopslog(txt);
                            return false;
                        }
                    }
                }
            }
        } else {
            trpsettroopslog("兵士が足りません");
            GM_setValue(TRP_GM_KEY +"_TroopsAutoFlg", false);
        }
    }
}
//-------------------------------//
// デッキのカードリスト取得      //
//-------------------------------//
function trpgetdecklist(){
    var url;
    var deckListAll = [];
    url="https://" + HOST + "/card/deck.php";
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        async: false,
        cache: false
    })
        .done(function(data) {
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(TRP_GM_KEY+"_UseCost", usecost);
        GM_setValue(TRP_GM_KEY+"_DeckCost", deckcost);
        trpsaveData(TRP_GM_KEY+"_deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
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
            if (cdSkil.length > 3){
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
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
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
            if (cdSkil.length > 3){                         //スキル4
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
            if (m_troops_options[TRP_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                trpsettroopslog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                trpsettroopslog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                trpsettroopslog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                trpsettroopslog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                trpsettroopslog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        trpsaveData(TRP_GM_KEY+ "_deckList", deckListAll, true);
    });
}

//----------------------------------//
// ファイルのカードリスト取得       //
//----------------------------------//
function trpgetfilelist(l_label, l_page){
    var url;
    var fileListAll = [];
    url="https://" + HOST + "/card/deck.php?l=" + l_label + "&p=" + l_page;
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
        trpsaveData(TRP_GM_KEY+"_fileList", fileListAll, true );
    });
}

//------------------------------------------//
// デッキから下ろす                         //
//------------------------------------------//
function trpunsetdeckcard(cardid){
    var url="https://" + HOST + "/card/deck.php";
    var ssid = trpgetSessionId();
    var deckListAll = [];
    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['target_card'] = cardid;
    params['mode'] = "unset";
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
        GM_setValue(TRP_GM_KEY+"_UseCost", usecost);
        GM_setValue(TRP_GM_KEY+"_DeckCost", deckcost);
        trpsaveData(TRP_GM_KEY+"_deckList", deckListAll, true );
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
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
            if (cdSkil.length > 3){
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
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
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
            if (cdSkil.length > 3){                         //スキル4
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
            if (m_troops_options[TRP_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                trpsettroopslog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                trpsettroopslog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                trpsettroopslog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                trpsettroopslog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                trpsettroopslog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        trpsaveData(TRP_GM_KEY+ "_deckList", deckListAll, true);
    });
}

//------------------------------------------//
// デッキに設定し、内政スキル発動           //
//------------------------------------------//
function trpsetdeckskill(cardid, skilid,vilid, acttype){
    var url="https://" + HOST + "/card/deck.php";
    var ssid = trpgetSessionId();
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
        GM_setValue(TRP_GM_KEY+"_UseCost", usecost);
        GM_setValue(TRP_GM_KEY+"_DeckCost", deckcost);
        trpsaveData(TRP_GM_KEY+"_deckList", deckListAll, true );
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

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
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
            if (cdSkil.length > 3){
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
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
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
            if (cdSkil.length > 3){                         //スキル4
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
            if (m_troops_options[TRP_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                trpsettroopslog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                trpsettroopslog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                trpsettroopslog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                trpsettroopslog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                trpsettroopslog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        trpsaveData(TRP_GM_KEY+ "_deckList", deckListAll, true);
    });
    return l_chkstat;
}
//-------------------------------//
// デッキに乗せる                //
//-------------------------------//
function trpsetdeckcard(cardid, vilid){
    var url="https://" + HOST + "/card/deck.php";
    var ssid = trpgetSessionId();
    var deckListAll = [];
    // 送信データの作成
    var params = new Object;
    params['ssid'] = ssid;
    params['target_card'] = cardid;
    params["selected_village[" + cardid + "]"] = vilid;
    params['mode'] = "set";
    j$.ajax({
        type: 'POST',
        url: url,
        datatype: 'html',
        async: false,
        cache: false,
        data: params
    })
        .done(function(data) {
        console.log("cdid:" + cardid + "をデッキに乗せました");
        // デッキにあるカード情報取得
        var costnum = j$(data).find("div[class='number cost deck-cost__div'] div[class='state'] span[class='volume']").text().split("/");
        var usecost = parseFloat(costnum[0]);
        var deckcost = parseFloat(costnum[1]);
        GM_setValue(TRP_GM_KEY+"_UseCost", usecost);
        GM_setValue(TRP_GM_KEY+"_DeckCost", deckcost);
        trpsaveData(TRP_GM_KEY+"_deckList", deckListAll, true);
        j$(data).find("#cardListDeck div[class='cardColmn']").each(function(){
            var deckList = new Object;
            var cdName = j$(this).find( ".cardWrapper span[class='name-for-sub']");
            var setVillage =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd:eq(1)");
            var setStatus =  j$(this).find(".clearfix dl[class='set_status clearfix']  dd[class='btm_none']");
            var cdGage = j$(this).find(".clearfix dl[class='set_status clearfix']  div[class='para clearfix'] span[class='gage']");
            var cdHp = j$(this).find( ".cardWrapper div[class='status_hp'] span[class='value']").text().match(/\d+/g)[0];
            var cdLevel = j$(this).find( ".cardWrapper div[class='level'] span").text().match(/\d+/g)[0];
            var cdCost =  parseFloat(j$(this).find( ".cardWrapper span[class='cost-for-sub']").text());

            var cdSkil =  j$(this).find(".back_skill  li[class!='subgeneral']");
            var cdSkil1 =  j$(this).find(".back_skill span[class^='skillName1']");
            var cdSkil1pa =  j$(this).find(".back_skill span[class^='skillName1']").hasClass("skillName1 skill_name red");
            var cdSkil1kai =  !(j$(this).find(".back_skill div").hasClass("skill1 skill-kaifuku"));
            var cdSkil1id ="";
            if (j$.trim(cdSkil1.text()).length > 0 ){
                cdSkil1id = j$(this).find(".back_skill div[class^='skill1'] a[class='btn_detail_s']" ).attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
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
            if (cdSkil.length > 3){
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
            if (j$(this).find(".back_skill li").hasClass("subgeneral")){
                if (j$(this).find(".back_skill li[class='subgeneral'] span").hasClass("subgeneralSkillName4 skill_name_subgeneral red")==false){
                    fukCd =  j$(this).find(".back_skill span[class^='subgeneralSkillName4']").text();
                    fukKai = !(j$(this).find(".back_skill div").hasClass('skill4 skill-kaifuku'));
                    fukId = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/[a-z]{2}\d{4}/g)[0];
                    fukCdid = j$(this).find(".back_skill div[class^='skill4'] a[class='btn_detail_s']").attr("onclick").match(/\d+/g)[1];
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
            if (cdSkil.length > 3){                         //スキル4
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
            if (m_troops_options[TRP_DEBUGFLG]==true){
                var l_setsta = deckList.setsta.replace( /,/g , "." ) ;
                var l_setvil = deckList.setvil.replace( /,/g , "." ) ;
                trpsettroopslog("デッキに存在するカード名:"+deckList.name+" カードID:"+deckList.cdid+" 拠点:"+l_setvil+" 状態:"+l_setsta);
                trpsettroopslog("HP:" + deckList.hp + " 討伐:" + deckList.gage + " コスト:" + deckList.cost+ " レベル:" + deckList.level);
                trpsettroopslog("skil1:" + deckList.cdskil1 + " skil1回復:" + deckList.cdskil1kai + " skil1パ:" + deckList.cdskil1pa + " skil2:" + deckList.cdskil2 +" skil2回復:" + deckList.cdskil2kai+ " skil2パ:" + deckList.cdskil2pa);
                trpsettroopslog("skil3:" + deckList.cdskil3 + " skil3回復:" + deckList.cdskil3kai + " skil3パ:" + deckList.cdskil3pa + " skil4:" + deckList.cdskil4 +" skil4回復:" + deckList.cdskil4kai+ " skil4パ:" + deckList.cdskil4pa);
                trpsettroopslog("副将:" + deckList.fukcd + " 副将スキル回復:" + deckList.fukkai);
            }
            deckListAll.push(deckList);
        });
        trpsaveData(TRP_GM_KEY+ "_deckList", deckListAll, true);
    });
}
//----------------------------------//
//兵士情報取得                      //
//----------------------------------//
function trpgetSoldierall(){
    var url;
    var soldierListAll = [];
    url="https://" + HOST + "/facility/unit_status.php?type=all";
    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        async: false,
        cache: false
    }).done(function(data) {
        trpsaveData(TRP_GM_KEY+"_soldierList", soldierListAll, true);
        j$(data).find( "#rotate_gui2 table[class='commonTables']").each(function(index){
            var soldierList = new Object;
            if (j$(this).attr("summary") == '待機') {
                var l_infantry = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(0).text();         //剣
                var l_shield = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(1).text();           //盾
                var l_spear = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(2).text();            //槍
                var l_archer = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(3).text();           //弓
                var l_cavalry = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(4).text();          //騎
                var l_ram = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(5).text();              //車
                var l_scout = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(6).text();            //斥候
                var l_large_infantry = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(8).text();   //大剣
                var l_heavy_shield = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(9).text();     //重盾
                var l_halbert = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(10).text();         //矛
                var l_crossbow = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(11).text();        //弩
                var l_cavalry_guards = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(12).text();  //近衛
                var l_catapult = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(13).text();        //投石
                var l_cavalry_scout = j$(this).find("table[class='commonTablesNoMG'] td[class='digit']").eq(14).text();   //斥候騎

                soldierList.infantry = parseInt(l_infantry);              //剣
                soldierList.shield = parseInt(l_shield);                  //盾
                soldierList.spear = parseInt(l_spear);                    //槍
                soldierList.archer = parseInt(l_archer);                  //弓
                soldierList.cavalry = parseInt(l_cavalry);                //騎
                soldierList.ram = parseInt(l_ram);                        //車
                soldierList.scout = parseInt(l_scout);                    //斥候
                soldierList.large_infantry = parseInt(l_large_infantry);  //大剣
                soldierList.heavy_shield = parseInt(l_heavy_shield);      //重盾
                soldierList.halbert = parseInt(l_halbert);                //矛
                soldierList.crossbow = parseInt(l_crossbow);              //弩
                soldierList.cavalry_guards = parseInt(l_cavalry_guards);  //近衛
                soldierList.catapult = parseInt(l_catapult);              //投石
                soldierList.cavalry_scout = parseInt(l_cavalry_scout);    //斥候騎
                soldierList.sumcount=parseInt(l_infantry)+parseInt(l_shield)+parseInt(l_spear)+parseInt(l_archer)+parseInt(l_cavalry)+
                    parseInt(l_large_infantry)+parseInt(l_heavy_shield)+parseInt(l_halbert)+parseInt(l_crossbow)+parseInt(l_cavalry_guards);
            }
            soldierListAll.push(soldierList);
        });
        trpsaveData(TRP_GM_KEY+"_soldierList", soldierListAll, true);
    });
}
//--------------------//
// 出兵               //
//--------------------//
function trpdispatchtool(cardid, skilid,fukcardid, fukskilid,x_value,y_value,i_infantrycnt,i_shieldcnt,i_spearcnt,i_archercnt,i_cavalrycnt,i_ram,i_scout,i_large_infantry,i_heavy_shield,i_halbert,i_crossbow,i_cavalry_guards,i_catapult,i_cavalry_scout){
    var l_dom="";
    var l_siege=0;
    var url="https://" + HOST + "/facility/castle_send_troop.php";

    // 送信データの作成
    var params2 = new Object;
    params2['x'] = x_value;
    params2['y'] = y_value;
    j$.ajax({
        type: 'GET',
        url: url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params2
    }).done(function(data) {
        if(j$(data).find("#capture_material").length){
            if(j$(data).find("#capture_material").is(':disabled')===false){
                // 送信データの作成
                var params = new Object;
                params["use_skill_id[" + cardid + "]"] = skilid;
                if (fukcardid!=""){
                    params["use_skill_id[" + fukcardid + "]"] = fukskilid;
                }
                params['village_x_value'] = x_value;
                params['village_y_value'] = y_value;
                params['unit_assign_card_id'] = cardid;

                params['infantry_count'] = i_infantrycnt;         //剣
                params['shield_count'] = i_shieldcnt;             //盾
                params['spear_count'] = i_spearcnt;               //槍
                params['archer_count'] = i_archercnt;             //弓
                params['cavalry_count'] = i_cavalrycnt;           //騎
                params['ram_count'] = i_ram;                      //車
                params['scout_count'] = i_scout;                  //斥候
                params['large_infantry_count'] = i_large_infantry;   //大剣
                params['heavy_shield_count'] = i_heavy_shield;    //重盾
                params['halbert_count'] = i_halbert;              //矛
                params['crossbow_count'] = i_crossbow;            //弩
                params['cavalry_guards_count'] = i_cavalry_guards;   //近衛
                params['catapult_count'] = i_catapult;            //投石
                params['cavalry_scout_count'] = i_cavalry_scout;  //斥候騎

                params['radio_move_type'] = 302;
                params['radio_reserve_type'] = 0;
                params['card_id'] = 204;
                params['btn_send'] = '出兵';

                j$.ajax({
                    type: 'POST',
                    url: url,
                    datatype: 'html',
                    async: false,
                    cache: false,
                    data: params
                }).done(function(data) {
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
        } else{
                trpsettroopslog("出兵条件「鹵獲」が有効じゃないので出兵できません");
                l_siege=2;
            }
        } else {
            trpsettroopslog("出兵画面が読み取れないので出兵できません");
            l_siege=2;
        }
    });
    return l_siege;
}
//-----------------------//
// 領地名取得            //
//-----------------------//
function trpgetBasename(x_value, y_value){
    var url;
    var fileListAll = [];
    var cdName="";
    var l_chk=0;
    url="https://" + HOST + "/land.php?x=" + x_value + "&y=" + y_value;

    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        async: false,
        cache: false
    })
        .done(function(data) {
        cdName = j$(data).find( "#basepoint span[class='basename']").text();
        if (j$.trim(cdName)!="空き地"){
            var l_domei =j$(data).find("#basepoint div[class=status] a[href*='alliance/info.php']").text().trim();
            console.log(l_domei);
            if (l_domei!=m_troops_options[TRP_DOMEI]){
                l_chk=1;
            }
        }
    });
    return l_chk;
}
//----------------------------------//
//ログ保存                          //
//----------------------------------//
function trpsettroopslog(l_logtxt){
    var dt = new Date();
    var l_strDate = trpLocaleString(dt);
    var l_log=new Array();
    var l_chklog=GM_getValue(TRP_GM_KEY + '_troopslog', "");
    var lognum=50;
    if (l_chklog!=""){
        l_log = GM_getValue(TRP_GM_KEY + '_troopslog', []).split(',');
        var l_loglen=l_log.length;
        if(!isNaN(m_troops_options[TRP_LOGCOUNT])){
            lognum=m_troops_options[TRP_LOGCOUNT];
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
    GM_setValue(TRP_GM_KEY + '_troopslog', l_strDate+" "+l_log);  //ログ保存
}

function trpLocaleString(date)
{
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}

//----------------------------------//
//各ラベルのページ数取得            //
//----------------------------------//
function trpsetlblpage(){
    console.log("各ラベルのページ数取得");
    for (var i = 1; i < 15; i++) {
        trpgetlblpage(i);
    }
}

//----------------------------------//
//各ラベルのページ数取得            //
//----------------------------------//
function trpgetlblpage(l_label){
    console.log("出兵ラベルのページ数取得");
    var url;
    var fileListAll = [];
    url="https://" + HOST + "/card/deck.php?l=" +l_label + "#file-1";

    j$.ajax({
        type: 'get',
        url: url,
        datatype: 'html',
        async: false,
        cache: false
    })
        .done(function(data) {
        var urlprm = j$(data).find("#tab-labels a[class$='cur']").attr('href').match(/\d+/g)[0];
        //console.log(urlprm);
        var pagenum =  j$(data).find( "#rotate div[class='rotateInfo clearfix'] ul[class='pager'] li").length;
        if (pagenum < 2){pagenum =1;} else {pagenum = pagenum-1;}
        GM_setValue(TRP_GM_KEY + '_trplblpage' + urlprm, pagenum);
        console.log("ラベルNO: %d  ページ数: %d ", urlprm, pagenum);

    });
}

//---------------------------//
//    設定を保存する         //
//---------------------------//
function trp_gmnset() {
    var options = getTroopsDefaultOptions();

    var obj = new Object;
    var items = j$("#troops_setting_view input");
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
    var items1 = j$("#troops_setting_view select");
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

    //設定を保存
    GM_setValue(TRP_GM_KEY + '_troops_options', JSON.stringify(obj));
}

//---------------------------------//
// Troopsの設定の読み込み・保存    //
//---------------------------------//
// デフォルトオプション定義の取得
function getTroopsDefaultOptions() {
    var settings = new Object;

    // 使用する設定
    settings[TRP_TROOPSLABEL] = "1";      // 出兵武将ラベル
    settings[TRP_TROOPSVIL] = "";         // 出兵拠点
    settings[TRP_DOMEI] = "";             // 同盟名
    settings[TRP_TROOPX] = "";            // 出兵座標X
    settings[TRP_TROOPY] = "";            // 出兵座標Y
    settings[TRP_GAGE_DECK] = "200";      // デッキにあげる討伐
    settings[TRP_GAGE_TROOPS] = "500";    // 出兵する討伐
    settings[TRP_YN_KAICST] = true;       // デッキコストあけるか
    settings[TRP_TROOPKAICST] = "4";      // 回復用空きコスト
    settings[TRP_YN_USESHIN] = true;      //神医系スキルを使用するか
    settings[TRP_YN_USEKAI] = true;       //傾国スキルを使用するか

    //回復
    settings[TRP_SINLABEL] = "1";         // 神医ラベル
    settings[TRP_SINLEVEL] = "1";         // 神医スキルレベル
    settings[TRP_RYUCGRLABEL] = "1";      // 劉備の契りラベル
    settings[TRP_RYUCGRLEVEL] = "1";      // 劉備の契りスキルレベル
    settings[TRP_SINBOKLABEL] = "1";      // 神卜の術式ラベル
    settings[TRP_SINBOKLEVEL] = "1";      // 神卜の術式スキルレベル
    settings[TRP_KEILABEL] = "1";         // 傾国ラベル
    settings[TRP_KEILEVEL] = "1";         // 傾国スキルレベル

    //兵士付帯
    settings[TRP_YN_INCID] = true;        // 兵を付けるかどうか
    settings[TRP_STOPINCID] = "1000";     // 兵数しきい値

    //ログ
    settings[TRP_DEBUGFLG] = false;       // ログ詳細
    settings[TRP_LOGCOUNT] = 50;          // ログ件数

    return settings;
}
//-----------------------//
// 出兵設定画面描画      //
//-----------------------//
function drawSetTroopsWindow() {
    //表示コンテナ作成
    var TRPfacContainer = j$("<div>");
    TRPfacContainer.attr('id', 'troops_setting_view');
    TRPfacContainer.css('position','absolute');
    TRPfacContainer.css('opacity',1.0);
    TRPfacContainer.css('border','solid 2px black');
    TRPfacContainer.css('left', '20px');
    TRPfacContainer.css('top', '20px');
    TRPfacContainer.css('display','none');
    TRPfacContainer.css('margin-bottom','3px');
    TRPfacContainer.css('zIndex','9999');
    TRPfacContainer.css('width','550px');

    j$("#boxInner").append(TRPfacContainer);
    TRPfacContainer.draggable();

    var TRPtable = j$("<div id='trp_tabs'>\
      <ul>\
        <li><a href='#trp_maintab'>出兵設定</a></li>\
        <li><a href='#trp_logtab'>ログ</a></li>\
        <li><a href='#trp_expimptab'>exp/imp</a></li>\
      </ul>\
      <div id='trp_maintab'>\
      </div>\
      <div id='trp_logtab'>\
      </div>\
      <div id='trp_expimptab'>\
      </div>\
   </div>\
    ");

    TRPfacContainer.append(TRPtable);
    trp_mainset();
    trp_logset();
    trp_expimpset();


    j$("#trp_tabs li").css({'padding':'0px', 'min-width':'0px'});
    j$("#trp_tabs li a").css({'background':'none'});

    j$('#trp_tabs').tabs();

    // 保存ボタン
    j$("[ id^='trp_saveSetWindow' ]").on('click',
                      function() {
            trp_gmnset();
            alert("保存しました。");
    });
    // 閉じるボタンのクリックイベント
    j$(document).on('click',"[ id^='trp_closeSetWindow' ]",function() {
        j$("#troops_setting_view").css('display', 'none');
    });
    // エクスポートオプション
    j$("#rexpbtn").on('click',
        function() {
            //一旦保存
            trp_gmnset();
            j$("#trp_exparea").val(JSON.stringify(m_troops_options));
        });
    // インポートオプション
    j$("#trp_impbtn").on('click',
                      function() {
        var options;
        try {
            options = JSON.parse(j$("#trp_exparea").val());
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
        alert("設定を適用する場合は保存ボタンを押してください");
    });

    // すべて初期化
    j$("[ id^='trp_inittabSetWindow' ]").on('click',function() {
        var options = getTroopsDefaultOptions();
        // 初期値設定に戻す
        for (var key in options) {
            if (j$("#" + key).length > 0) {
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
        alert("設定を適用する場合は保存ボタンを押してください");
    });
}

//---------------------------//
//    設定画面の描画         //
//---------------------------//
function trp_mainset() {
    var table1 = j$("<table class=trp_tbl>");
    j$("#trp_maintab").append(table1);
    j$(table1).
        append(j$("<tr><td colspan='2' class=trp_ctd1 id=trp_td21></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td31></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td41></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td41aa></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td41ab style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td41a></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td41c></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td41cc style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td41b></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td41d></td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td41e style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td51></td></tr>\
              <tr><td class=trp_ctd3></td><td>\
              <table>\
              <tr><td colspan='2' id=trp_td61 style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd2 id=trp_td71></td><td id=trp_td72></td></tr>\
              <tr><td class=trp_ctd2 id=trp_td81></td><td id=trp_td82></td></tr>\
              <tr><td class=trp_ctd2 id=trp_td91></td><td id=trp_td92></td></tr>\
              <tr><td colspan='2' id=trp_td101 style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd2 id=trp_td111></td><td id=trp_td112></td></tr>\
              </table>\
              </td></tr>\
              <tr><td colspan='2' class=trp_ctd1 id=trp_td121 style='font-weight: bold;'></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td131></td></tr>\
              <tr><td class=trp_ctd3></td><td class=trp_ctd1 id=trp_td141></td></tr>\
              <tr><td colspan='2' id=trp_td300 class=trp_ctdb></td></tr>\
              <tr><td colspan='2' id=td311 class=ctdb></td></tr>\
    "));

    TRPcreateSelectBox("#trp_td21", "trp_troopslabel" , "出兵武将ラベル:","select2",m_troops_options[TRP_TROOPSLABEL],trpLabelSelectValues);
    TRPcreateSelectBox("#trp_td31", "trp_troopsvil" , "出兵拠点：","select1", m_troops_options[TRP_TROOPSVIL] ,trpVilSelectValues);
    TRPcreateTextBox("#trp_td41", "trp_troopx" , "出兵座標：(",m_troops_options[TRP_TROOPX],'4','40px',false);
    TRPcreateTextBox("#trp_td41", "trp_troopy" , ",",m_troops_options[TRP_TROOPY],'4','40px',false);
    TRPcreateSpan("#trp_td41", ")");
    TRPcreateTextBox("#trp_td41aa", "trp_domei" , "同盟名：",m_troops_options[TRP_DOMEI],'15','150px',true);
    TRPcreateSpan("#trp_td41aa", "※プロフから読取。空地か同盟名一致なら出兵する");
    TRPcreateSpan("#trp_td41ab", "デッキにのせるカード選択設定");
    TRPcreateTextBox("#trp_td41a", "trp_gage_deck" , "討伐：",m_troops_options[TRP_GAGE_DECK],'3','30px',false);
    TRPcreateSpan("#trp_td41a", "以上のカードをデッキにのせる");
    TRPcreateTextBox("#trp_td41b", "trp_gage_troops" , "討伐：",m_troops_options[TRP_GAGE_TROOPS],'3','30px',false);
    TRPcreateSpan("#trp_td41b", "以上のカードを出兵する");
    TRPcreateSpan("#trp_td41cc", "出兵カード討伐設定");
    TRPcreateCheckBox("#trp_td41c", "trp_yn_useshin" , "デッキにあげる場合必要あれば神医系スキルを使用する","trp_yn_useshin","1",m_troops_options[TRP_YN_USESHIN]);
    TRPcreateCheckBox("#trp_td41d", "trp_yn_usekai" , "しきい値以下の場合必要あれば傾国スキルを使用する","trp_yn_usekai","1",m_troops_options[TRP_YN_USEKAI]);
    TRPcreateSpan("#trp_td41e", "回復設定");
    TRPcreateCheckBox("#trp_td51", "trp_yn_kaicst" , "回復用に","trp_yn_kaicst","1",m_troops_options[TRP_YN_KAICST]);
    TRPcreateSelectBox("#trp_td51", "trp_troopkaicst" , "コスト:","select2",m_troops_options[TRP_TROOPKAICST],trpCostSelectValues);
    TRPcreateSpan("#trp_td51", "分デッキは空ける");
    TRPcreateSpan("#trp_td61", "HP回復スキル使用設定<ファイル>");
    TRPcreateSpan("#trp_td71", "神医の術式:");
    TRPcreateSelectBox("#trp_td72", "trp_sinlabel" , "ラベル:","select2",m_troops_options[TRP_SINLABEL],trpLabelSelectValues);
    TRPcreateSpan("#trp_td72", " | ");
    TRPcreateSelectBox("#trp_td72", "trp_sinlevel" , "スキルレベル:","select2",m_troops_options[TRP_SINLEVEL],trpLevelSelectValues);
    TRPcreateSpan("#trp_td72", "以上");
    TRPcreateSpan("#trp_td81", "劉備の契り:");
    TRPcreateSelectBox("#trp_td82", "trp_ryucgrlabel" , "ラベル:","select2",m_troops_options[TRP_RYUCGRLABEL],trpLabelSelectValues);
    TRPcreateSpan("#trp_td82", " | ");
    TRPcreateSelectBox("#trp_td82", "trp_ryucgrlevel" , "スキルレベル:","select2",m_troops_options[TRP_RYUCGRLEVEL],trpLevelSelectValues);
    TRPcreateSpan("#trp_td82", "以上");
    TRPcreateSpan("#trp_td91", "神卜の術式:");
    TRPcreateSelectBox("#trp_td92", "trp_sinboklabel" , "ラベル:","select2",m_troops_options[TRP_SINBOKLABEL],trpLabelSelectValues);
    TRPcreateSpan("#trp_td92", " | ");
    TRPcreateSelectBox("#trp_td92", "trp_sinboklevel" , "スキルレベル:","select2",m_troops_options[TRP_SINBOKLEVEL],trpLevelSelectValues);
    TRPcreateSpan("#trp_td92", "以上");
    TRPcreateSpan("#trp_td101", "討伐ゲージ回復スキル使用設定");
    TRPcreateSpan("#trp_td111", "傾国:");
    TRPcreateSelectBox("#trp_td112", "trp_keilabel" , "ラベル:","select2",m_troops_options[TRP_KEILABEL],trpLabelSelectValues);
    TRPcreateSpan("#trp_td112", " | ");
    TRPcreateSelectBox("#trp_td112", "trp_keilevel" , "スキルレベル:","select2",m_troops_options[TRP_KEILEVEL],trpLevelSelectValues);
    TRPcreateSpan("#trp_td112", "以上");
    TRPcreateSpan("#trp_td121", "兵士付帯設定");
    TRPcreateCheckBox("#trp_td131", "trp_yn_incid" , "兵がいる場合は連れて行く(兵器・斥候以外の兵を均等に出兵する)","trp_yn_incid","1",m_troops_options[TRP_YN_INCID]);
    TRPcreateTextBox("#trp_td141", "trp_stopincid" , "兵を連れて行く場合兵数が",m_troops_options[TRP_STOPINCID],'5','50px');
    TRPcreateSpan("#trp_td141", "以下になったら出兵を止める(全体数)");
    TRPcreateButton("#trp_td300", "trp_saveSetWindow", "設定を保存", "trp_btn_c");
    TRPcreateButton("#trp_td300", "trp_inittabSetWindow", "初期化", "trp_btn_c");
    TRPcreateButton("#trp_td300", "trp_closeSetWindow", "閉じる", "trp_btn_c");

    //拠点プルダウン設定
    var lists = trploadData(TRP_GM_KEY+"_VillageList", "[]", true);
    var plist ;
    for (var i = 0; i < lists.length; i++) {
        plist = j$('<option>').html(lists[i].name).val(lists[i].name);
        j$("#trp_troopsvil").append(plist);
    }
}

function trp_logset(){
    var table = j$("<table>");
    j$("#trp_logtab").append(table);
    j$(table).
        append(j$("<tr><td colspan='3' id=td5_11 style='font-size:12px;margin:2px;color:#000000;font-weight:bold;'></td></tr>\
                <tr><td class=ctd0></td><td id=td5_11a></td></tr>\
                <tr><td class=ctd0></td><td id=td5_21></td></tr>\
                <tr><td colspan='3' id=td5_201 class=ctdb></td></tr>\
    "));

    TRPcreateSpan("#td5_11", "直近のログ");
    TRPcreateTextBox("#td5_11a", "trp_logcount" , " ログ件数:",m_troops_options[TRP_LOGCOUNT],'4','40px',false);
    TRPcreateCheckBox("#td5_11a", "trp_debugflg" , "詳細出力","trp_debugflg","1",m_troops_options[TRP_DEBUGFLG]);
    TRPcreateTextArea("#td5_21", "trp_logarea",'40','75', false);
    TRPcreateButton("#td5_201", "trp_saveSetWindow", "設定を保存", "trp_btn_c");
    TRPcreateButton("#td5_201", "trp_closeSetWindow", "閉じる", "trp_btn_c");

}

function trp_expimpset(){
    var table = j$("<table>");
    j$("#trp_expimptab").append(table);
    j$(table).
        append(j$("<tr><td colspan='3' id=td4_11></td></tr>\
                <tr><td class=ctd0></td><td id=td4_21 colspan='2'></td></tr>\
                <tr><td colspan='3' id=td4_201 class=ctdb></td></tr>\
    "));

    TRPcreateSpan("#td4_11", "設定のエクスポート／インポート");
    TRPcreateTextArea("#td4_21", "trp_exparea", '10','70', false);
    TRPcreateButton("#td4_201", "trp_expbtn", "エクスポート", "trp_btn_c");
    TRPcreateButton("#td4_201", "trp_impbtn", "インポート", "trp_btn_c");
    TRPcreateButton("#td4_201", "trp_saveSetWindow", "設定を保存", "trp_btn_c");
    TRPcreateButton("#td4_201", "trp_closeSetWindow", "閉じる", "trp_btn_c");
}

function TRPcreateCheckBox(container, rid, rtext, rclass, rvalue, ckflag){
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

function TRPcreateSpan(container, text){
    var stext = j$("<span>");
    stext.css({
        color : "#333333",
        font : '12px bold 120% "ＭＳ ゴシック"',
        margin : "2px"
    });
    stext.html(text);
    j$( container ).append(stext);
}

function TRPcreateSelectBox(container, rid, rtext, rclass, rvalue, selectValues){
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

function TRPcreateTextBox(container, rid, rtext, rvalue, rlen, rsize, yinput){
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
function TRPcreateTextArea(container, rid, rrow, rcols, yinput){
    var txBox = j$("<textarea>",{
        id: rid,
        value: "",
        rows: rrow,
        cols: rcols,
        disabled: yinput
    });
    j$(container).append(txBox);
}
function TRPcreateButton(container, rid, rtext, rclass){
    var btn = j$("<input>",{
        type: 'button',
        id: rid,
        class: rclass,
        value: rtext
    });
    j$( container ).append(btn);
}

function TRPcreateSelectListBox(container, rid, rclass, rsize, selectValues){
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
//-------------------//
// css定義の追加     //
//-------------------//
function addTroopsCss() {
    var css =" \
    table .trp_ctd0{width: 30px;} \
    table .trp_ctd1{padding: 2px 2px;} \
    table .trp_ctd2{width: 100px;} \
    table .trp_ctd3{width: 20px;} \
    table .trp_ctdb{padding-top: 20px;} \
    .trp_btn_a {width: 30px;} \
    .trp_btn_c {border:1px solid #777; \
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
function trpinitGMWrapper() {
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
function trpgetCookie(name) {
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
function trpsaveData(key, value, ev)
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

function trploadData(key, value, ev)
{
    var ret = GM_getValue(key, value);

    if (window.chrome) { // 2015.05.23
        return ev ? eval(eval('ret='+ret)) : ret;
    } else {
        return ev ? eval('ret='+ret) : ret;
    }
}

function trp_wait(sec) {
    // jQueryのDeferredを作成
    var objDef = new j$.Deferred;
    setTimeout(function () {
        // sec秒後に、resolve()を実行して、Promiseを完了
        objDef.resolve(sec);
    }, sec*1000);
    return objDef.promise();
};
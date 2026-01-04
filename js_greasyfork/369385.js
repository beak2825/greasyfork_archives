// ==UserScript==
// @name       bro3_event_battle_tool
// @namespace   bro3_event_battle_tool
// @description   ブラウザ三国志 レイドツール
// @include        http://*.3gokushi.jp/card/event_battle_top.php*
// @version     1.6
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @resource    jqueryui_css    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @require    http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js

// @downloadURL https://update.greasyfork.org/scripts/369385/bro3_event_battle_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/369385/bro3_event_battle_tool.meta.js
// ==/UserScript==
// version date       author
// 1.1    2017/12/06  作成開始

// load jQuery
jQuery.noConflict();
j$ = jQuery;

//----------//
// 変数定義 //
//----------//
// ソフトウェアバージョン
var VERSION = "1.6";
var SERVER_NAME = location.hostname.match(/^(.*)\.3gokushi/)[1];
// 特殊定数
var HOST = location.hostname;        // アクセスURLホスト
var SERVICE = '';                    // サービス判定が必要な場合に使用する予約定数
var SVNAME = HOST.substr(0,location.hostname.indexOf(".")) + SERVICE;
var RID_KEY = "rid_" + HOST.substr(0,HOST.indexOf("."));

var RID_STAMINA = 'rid_stamina';                  //体力
var RID_REST1 = 'rid_rest1';                      //枠1
var RID_REST2 = 'rid_rest2';                      //枠2
var RID_REST3 = 'rid_rest3';                      //枠3
var RID_COST_FLAG = 'rid_cost_flag';              //コストフラグ
var RID_LIMIT_COST = 'rid_limit_cost';            //コスト
var RID_LEVEL_FLAG = 'rid_level_flag';            //レベルフラグ
var RID_LIMIT_LEVEL = 'rid_limit_level';          //レベル

// 個別設定1
var RID_LIMIT_HP1 = 'rid_limit_hp1';              //HP
var RID_SPEC_FLAG1 = 'rid_spec_flag1';            //スペックフラグ
var RID_LIMIT_SPEC1 = 'rid_limit_spec1';          //スペック
var RID_SORT1_1 = 'rid_sort1_1';                  //ソート順1
var RID_SORT2_1 = 'rid_sort2_1';                  //ソート順2
var RID_SORT3_1 = 'rid_sort3_1';                  //ソート順3
var RID_SORT4_1 = 'rid_sort4_1';                  //ソート順4
var RID_SORT_PAGE1 = 'rid_sort_page1';            //処理ページ数
var RID_LIMIT_BONUS1_1 = 'rid_limit_bonus1_1';    //同盟ボーナス1
var RID_LIMIT_BONUS2_1 = 'rid_limit_bonus2_1';    //同盟ボーナス2
var RID_LIMIT_BONUS3_1 = 'rid_limit_bonus3_1';    //同盟ボーナス3
var RID_TARGET_ID1 = 'rid_target_id1';            //対象カードID
var RID_NOTTARGET_ID1 ='rid_nottarget_id1';       //対象外カードID
var RID_TARGET_FLG1 = 'rid_target_flg1';          //対象カードフラグ
var RID_NOTTARGET_FLG1 ='rid_nottarget_flg1';     //対象外カードフラグ

// 個別設定2
var RID_LIMIT_HP2 = 'rid_limit_hp2';              //HP
var RID_SPEC_FLAG2 = 'rid_spec_flag2';            //スペックフラグ
var RID_LIMIT_SPEC2 = 'rid_limit_spec2';          //スペック
var RID_SORT1_2 = 'rid_sort1_2';                  //ソート順1
var RID_SORT2_2 = 'rid_sort2_2';                  //ソート順2
var RID_SORT3_2 = 'rid_sort3_2';                  //ソート順3
var RID_SORT4_2 = 'rid_sort4_2';                  //ソート順4
var RID_SORT_PAGE2 = 'rid_sort_page2';            //処理ページ数
var RID_LIMIT_BONUS1_2 = 'rid_limit_bonus1_2';    //同盟ボーナス1
var RID_LIMIT_BONUS2_2 = 'rid_limit_bonus2_2';    //同盟ボーナス2
var RID_LIMIT_BONUS3_2 = 'rid_limit_bonus3_2';    //同盟ボーナス3
var RID_TARGET_ID2 = 'rid_target_id2';            //対象カードID
var RID_NOTTARGET_ID2 ='rid_nottarget_id2';       //対象外カードID
var RID_TARGET_FLG2 = 'rid_target_flg2';          //対象カードフラグ
var RID_NOTTARGET_FLG2 ='rid_nottarget_flg2';     //対象外カードフラグ

// 個別設定3
var RID_LIMIT_HP3 = 'rid_limit_hp3';              //HP
var RID_SPEC_FLAG3 = 'rid_spec_flag3';            //スペックフラグ
var RID_LIMIT_SPEC3 = 'rid_limit_spec3';          //スペック
var RID_SORT1_3 = 'rid_sort1_3';                  //ソート順1
var RID_SORT2_3 = 'rid_sort2_3';                  //ソート順2
var RID_SORT3_3 = 'rid_sort3_3';                  //ソート順3
var RID_SORT4_3 = 'rid_sort4_3';                  //ソート順4
var RID_SORT_PAGE3 = 'rid_sort_page3';            //処理ページ数
var RID_LIMIT_BONUS1_3 = 'rid_limit_bonus1_3';    //同盟ボーナス1
var RID_LIMIT_BONUS2_3 = 'rid_limit_bonus2_3';    //同盟ボーナス2
var RID_LIMIT_BONUS3_3 = 'rid_limit_bonus3_3';    //同盟ボーナス3
var RID_TARGET_ID3 = 'rid_target_id3';            //対象カードID
var RID_NOTTARGET_ID3 ='rid_nottarget_id3';       //対象外カードID
var RID_TARGET_FLG3 = 'rid_target_flg3';          //対象カードフラグ
var RID_NOTTARGET_FLG3 ='rid_nottarget_flg3';     //対象外カードフラグ

// 個別設定4
var RID_LIMIT_HP4 = 'rid_limit_hp4';              //HP
var RID_SPEC_FLAG4 = 'rid_spec_flag4';            //スペックフラグ
var RID_LIMIT_SPEC4 = 'rid_limit_spec4';          //スペック
var RID_SORT1_4 = 'rid_sort1_4';                  //ソート順1
var RID_SORT2_4 = 'rid_sort2_4';                  //ソート順2
var RID_SORT3_4 = 'rid_sort3_4';                  //ソート順3
var RID_SORT4_4 = 'rid_sort4_4';                  //ソート順4
var RID_SORT_PAGE4 = 'rid_sort_page4';            //処理ページ数
var RID_LIMIT_BONUS1_4 = 'rid_limit_bonus1_4';    //同盟ボーナス1
var RID_LIMIT_BONUS2_4 = 'rid_limit_bonus2_4';    //同盟ボーナス2
var RID_LIMIT_BONUS3_4 = 'rid_limit_bonus3_4';    //同盟ボーナス3
var RID_TARGET_ID4 = 'rid_target_id4';            //対象カードID
var RID_NOTTARGET_ID4 ='rid_nottarget_id4';       //対象外カードID
var RID_TARGET_FLG4 = 'rid_target_flg4';          //対象カードフラグ
var RID_NOTTARGET_FLG4 ='rid_nottarget_flg4';     //対象外カードフラグ

//ログ
var RID_LOGCOUNT = 'rid_logcount';
var RID_DEBUGFLG = 'rid_debugflg';

var RID_DELIMIT = "#$%&?@"; // 保存データデリミタ

var rid_selbattletype = {"atk": "攻撃戦", "def":"防御戦", "int": "知力戦", "speed":"速度戦", "non":"設定なし"};
var rid_sellevel = { "cost1": "1", "cost1.5": "1.5","cost2": "2","cost2.5":"2.5","cost3":"3","cost3.5":"3.5","cost4":"4","cost4.5":"4.5"};
var rid_selsortkind = { "0": "未設定", "1": "カードNo", "2": "レアリティ", "3": "武将Lv", "4": "スコア", "5": "コスト",
                    "6": "兵科", "7": "HP", "8": "討伐ゲージ", "9": "攻撃力", "10": "知力", "11": "歩兵防御",
                    "12": "槍兵防御", "13": "弓兵防御", "14": "騎兵防御", "15": "移動速度", "19": "保護", "22": "特殊"};
var rid_selsortpage = { "page1": "1", "page2": "2","page3": "3" };
var rid_sellowhigh = { "1": "高い順", "0": "低い順" };
var rid_selsmallbig = { "1": "大きい順", "0": "小さい順" };
var rid_selsoldier = { "1": "弓騎槍剣", "0": "剣槍騎弓" };
var rid_selmoreless = { "1": "多い順", "0": "少ない順" };
var rid_seltarget = { "1": "対象", "0": "対象外" };

var m_raid_options;
var m_ngtype=[];

//----------------//
// メインルーチン //
//----------------//
(function() {
    // mixi鯖障害回避用: 広告iframe内で呼び出されたら無視
    if (j$("#container").length === 0) {
        return false;
    }
    //前回のリロードから30分以上経っていればツールOFF
    var l_dt = new Date();
    var l_dt2=rid_getValue(RID_KEY + '_chktime', null);
    if (l_dt2!=null){
        var l_diff = l_dt.getTime() - Date.parse(l_dt2);
        var l_minute = l_diff/(1000*60);
        if (l_minute>30){
            rid_setValue(RID_KEY +"_autoflg", false);
        }
    } else {
        rid_setValue(RID_KEY +"_autoflg", false);
    }
    rid_setValue(RID_KEY + '_chktime', l_dt);

    // 設定を取得
    rid_loadSettings();
    // 設定画面作成
    rid_setting();
    // レイド処理
    if (rid_getValue(RID_KEY +"_autoflg", false)==true) {
        rid_main();
    }

})();
//--------------------//
// レイド処理          //
//--------------------//
function rid_main() {
    // 討伐終了チェック
    if (rid_endcheck()!=1){
        //自動処理が出来るかチェック
        if (rid_chkauto()!=1){
            m_ngtype=[];
            // 2,3回目の処理を実施
            if (rid_addorder()!=1){
                // 追加できる枠があるかチェック
                if (rid_chkautoadd()!=1){
                    rid_getallibattle();
                }
            }
        }
    }
    //リロード
    if (rid_getValue(RID_KEY +"_autoflg", false)==true) {
        rid_wait(30).done(function(){location.reload();});
    }
}

//-----------------------//
// 設定画面の描画          //
//-----------------------//
function rid_setting(){
    //css定義を追加
    rid_addCss();
    // 設定リンクの作成
    j$("#npcBottom div[class='right']").eq(0).after(
        "<div style='margin-left: 60px; margin-top: 3px; font-weight: bold;'><a href='#' id=rid_setting_button class='ridtoollink' style='color: #000000;font-size: 15px;'>レイド設定</a> \
         <button type=button id=rid_button style=\"width:70px;\">実行する</button></div>"
    );
    rid_drawSetWindow();
    rid_btnchange();
    rid_setAutoflag(); //レイドボタン設定

    j$("#rid_setting_button").on("click", function(){
        rid_loadSettings();
        // 保存されているoption設定を設定画面に反映
        for (var key in m_raid_options) {
            if (j$("#" + key).length > 0) {
                // チェックボックスの場合、チェックのオンオフを再現
                if (j$("#" + key).attr('type') == 'checkbox') {
                    j$("#" + key).prop('checked', m_raid_options[key]);
                } else if (j$("#" + key).attr('type') == 'text') {
                    j$("#" + key).val(m_raid_options[key]);
                } else if (j$("#" + key).is('select')) {
                    j$("#" + key + ' option').filter(function(index){return j$(this).val() == m_raid_options[key];}).prop('selected', true);
                } else if (j$("#" + key).is('textarea')) {
                    j$("#" + key).val(m_raid_options[key]);
                }
            }
        }
        //ログを反映
        var l_log=new Array();
        var l_chklog=rid_getValue(RID_KEY + '_raid_log', "");
        if (l_chklog!=""){
            l_log = rid_getValue(RID_KEY + '_raid_log', []).split(RID_DELIMIT);
            var l_loglen=l_log.length;
            var l_txtlog="";
            for (var i=l_loglen; i--;){
                l_txtlog = l_txtlog + l_log[i] + "\n";
            }
            j$("#rid_logarea").val(l_txtlog);
        }
        j$("#rid_setting_view").css({'display':'block'});
    });
}
function rid_setAutoflag(){
    if(rid_getValue(RID_KEY +"_autoflg", false)==true){
        j$("#rid_button").text("実行中");
    }else{
        j$("#rid_button").text("実行する");
    }
}
//--------------------//
// レイド実行ボタン     //
//--------------------//
function rid_btnchange(){
    j$("#rid_button").on("click",function(){
        if(rid_getValue(RID_KEY +"_autoflg", true)==true){
            j$(this).text("実行する");
            rid_setValue(RID_KEY +"_autoflg", false);
        }else{
            j$(this).text("実行中");
            rid_setValue(RID_KEY +"_autoflg", true);
        }
        location.reload();
    });
}

//--------------------------//
// 同盟ページからレイド処理   //
//--------------------------//
function rid_allibattle(i_type) {
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("同盟ページでレイド処理を行う");}
    //同盟ページ一覧
    var l_battletype="";
    var l_battle="";
    var l_id="";
    var l_count=0;
    var l_pop=0;
    var l_hp=0;
    var l_maxhp=0;
    var l_bonus=0;
    var l_match="";
    var l_maxpage=1;
    var l_no=0;
    var l_chk=0;
    var l_url="";
    var l_urlpage=0;
    var l_chkloop=false;
    var l_getmax=1;
    do {
        l_battletype="";
        l_battle="";
        l_id="";
        l_count=0;
        l_pop=0;
        l_hp=0;
        l_maxhp=0;
        l_bonus=0;
        l_match="";
        l_maxpage=1;
        l_no=0;
        l_chk=0;
        l_urlpage++;
        l_url="http://" + HOST + "/card/event_battle_top.php?p="+ l_urlpage +"&scope=2#ptop";

        j$.ajax({
            type: 'get',
            url: l_url,
            datatype: 'html',
            cache: false,
            async: false
        }).done(function(data) {
            j$(data).find(".npcBusho").each(function(){
                var l_list = new Object;
                l_battle=j$(this).find("dd").eq(1).text().replace(/[\t\r\n]/g, "");
                l_id=j$(this).find("dd").eq(2).text().replace(/[\t\r\n]/g, "");
                l_match=j$(this).find("dd").eq(3).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
                l_count=parseInt(l_match[1]);
                l_match=j$(this).find("dd").eq(4).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
                l_pop=parseInt(l_match[1]);
                l_match=j$(this).find("dd").eq(6).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
                l_hp=parseInt(l_match[1]);
                l_maxhp=parseInt(l_match[2]);
                l_match=j$(this).find("dd").eq(10).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\%/);
                l_bonus=parseInt(l_match[1]);
                switch (l_battle) {
                    case "攻撃戦":
                        l_battletype="atk";
                        l_no=1;
                        break;
                    case "防御戦":
                        l_battletype="def";
                        l_no=2;
                        break;
                    case "知力戦":
                        l_battletype="int";
                        l_no=3;
                        break;
                    case "速度戦":
                        l_battletype="speed";
                        l_no=4;
                        break;
                }
                var HP = eval("RID_LIMIT_HP" + l_no);
                var BONUS = eval("RID_LIMIT_BONUS1_" + l_no);
                if (m_raid_options[RID_DEBUGFLG]==true){
                    rid_savelog("同盟ページでレイド処理を行う");
                    rid_savelog("戦闘NO：" + l_id);
                    rid_savelog("戦闘タイプ：" + l_battle);
                    rid_savelog("HP：" + l_maxhp);
                    rid_savelog("同盟ボーナス：" + l_bonus);
                    rid_savelog("残り回数：" + l_count);
                }
                if ((l_battletype==i_type) && (l_maxhp>=m_raid_options[HP]) && (l_bonus>=m_raid_options[BONUS]) && (l_count==3)){
                    if (rid_refexe(l_id, l_no)==1){
                        l_chk=1;
                    } else{
                        // 処理できなかったリスト
                        m_ngtype.push(i_type);
                    }
                }
            });

            if (j$("#npcBottom ul[class=pager]").length > 0) {
                var l_pages = j$("#npcBottom ul[class=pager] li");
                for (var i = 0; i < l_pages.length; i++) {
                    var l_page = parseInt(j$(l_pages[i]).text());
                    if (!isNaN(l_page) && l_getmax < l_page) {
                        l_getmax = l_page;
                    }
                }
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            l_chk=1;
            if (m_raid_options[RID_DEBUGFLG]==true){
                rid_savelog("rid_postbuttle()読み込み失敗");
                rid_savelog("URL : " + l_url);
                rid_savelog("XMLHttpRequest : " + jqXHR.status);
                rid_savelog("textStatus : " + textStatus);
                rid_savelog("errorThrown : " + errorThrown);
            }
        });
        if (l_chk==1){
            l_chkloop=true;
            //break; //抜ける
        } else if ((l_getmax==l_urlpage) || (l_getmax<l_urlpage)){
            l_chkloop=true;
        }
    } while (l_chkloop==false)
    return l_chk;
}

//--------------------------//
// 同盟ページに探しにいく     //
//--------------------------//
function rid_getallibattle(){
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("同盟ページから処理できるものを探す");}
    var ridlist=rid_loadData(RID_KEY+"_buttlelist", "[]", true);
    var l_type='';
    var l_len=0;
    var l_filen=0;
    var l_chk=false;
    for (var i = 1; i<4 ;i++){
        var REST = eval("RID_REST" + i);
        l_type=m_raid_options[REST];
        if (l_type!="non"){
            // 失敗タイフ゜リストチェック
            l_chk=false;
            for (var l = 0; l<m_ngtype.length ;l++){
                if (l_type==m_ngtype[l]){
                    l_chk=true;
                }
            }
            if (l_chk==false){
                l_len=0;
                for (var j =1; j<=i ;j++){
                    var REST2 = eval("RID_REST" + j);
                    if (l_type==m_raid_options[REST2]){
                        l_len++;
                    }
                }
                l_filen=0;
                for (var k = 0; k<ridlist.length ;k++){
                    if (l_type==ridlist[k].battletype){
                        l_filen++;
                    }
                }
                if (l_len>l_filen){
                    if (rid_allibattle(l_type)==1){
                        break; //for抜ける
                    } else {
                        // 処理できなかったリスト
                        m_ngtype.push(l_type);
                    }
                }
            }
        }
    }
}

//--------------------//
// 追加処理            //
//--------------------//
function rid_addorder(){
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("追加攻撃処理開始");}
    var ridlist=rid_loadData(RID_KEY+"_buttlelist", "[]", true);
    var l_bonus=0;
    var l_no=0;
    var l_chk=0;
    var l_chkflg=false;
    var l_stepflg=false;
    var l_count=0;
    for (var ri = 0; ri<ridlist.length; ri++){
        switch (ridlist[ri].battletype) {
            case "atk":     //攻撃戦
                l_no=1;
                break;
            case "def":     //防御戦
                l_no=2;
                break;
            case "int":     //知力戦
                l_no=3;
                break;
            case "speed":   //速度戦
                l_no=4;
                break;
        }
        // 失敗タイプリストチェック
        l_chkflg=false;
        var l_type=ridlist[ri].battletype;
        for (var l=0; l< m_ngtype.length; l++){
            if (l_type==m_ngtype[l]){
                l_chkflg=true;
            }
        }
        if (m_raid_options[RID_DEBUGFLG]==true){
            rid_savelog("戦闘NO：" + ridlist[ri].id);
            rid_savelog("ダメージ判定：" + ridlist[ri].battletype);
            rid_savelog("同盟ボーナス：" + ridlist[ri].bonus);
            rid_savelog("残り回数：" + ridlist[ri].count);
        }
        if (l_chkflg==false){
            l_bonus=parseInt(ridlist[ri].bonus);
            l_stepflg=false;
            l_count=parseInt(ridlist[ri].count);
            if (l_count>1){
                var BONUS2 = eval("RID_LIMIT_BONUS2_" + l_no);
                if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("２回目同盟ボーナスしきい値：" + m_raid_options[BONUS2]);}
                // ２回目の同盟ボーナスチェック
                if (l_bonus>=parseInt(m_raid_options[BONUS2])){
                    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("２回目の処理を行う");}
                    // ２回目
                    if (rid_refexe(ridlist[ri].id,l_no)==1){
                        l_chk=1;
                        break; //for抜ける
                    } else{
                        // 処理できなかったリスト
                        l_stepflg=true;
                        m_ngtype.push(l_type);
                    }
                }
            }
            if (l_count>0){
                var BONUS3 = eval("RID_LIMIT_BONUS3_" + l_no);
                if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("３回目同盟ボーナスしきい値：" + m_raid_options[BONUS3]);}
                // ３回目の同盟ボーナスチェック
                if (l_bonus>=parseInt(m_raid_options[BONUS3])){
                    if (l_stepflg==false){
                        if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("３回目の処理を行う");}
                        // ３回目
                        if (rid_refexe(ridlist[ri].id,l_no)==1){
                            l_chk=1;
                            break; //for抜ける
                        } else{
                            // 処理できなかったリスト
                            l_stepflg=true;
                            m_ngtype.push(l_type);
                        }
                    }
                }
            }
        }
    }
    return l_chk;
}
//-------------------//
// レイド処理         //
//-------------------//
function rid_refexe(i_id,i_no) {
    var l_ret=0;
    var SORT1 = eval("RID_SORT1_" + i_no);
    var SORT2 = eval("RID_SORT2_" + i_no);
    var SORT3 = eval("RID_SORT3_" + i_no);
    var SORT4 = eval("RID_SORT4_" + i_no);
    var PAGE = eval("RID_SORT_PAGE" + i_no);
    var l_arry1 = [];
    l_arry1.push(parseInt(m_raid_options[SORT1]));
    l_arry1.push(parseInt(m_raid_options[SORT3]));
    var l_arry2 = [];
    l_arry2.push(parseInt(m_raid_options[SORT2]));
    l_arry2.push(parseInt(m_raid_options[SORT4]));
    var l_page = parseInt(m_raid_options[PAGE].replace(/page/g, ''));

    if (rid_getfilelist(i_id, l_arry1, l_arry2, l_page)!=1){
        l_ret=rid_postbuttle(i_id,i_no);
    } else {
        l_ret=1;
    }
    return l_ret;
}
//-------------------//
// 攻撃する処理         //
//-------------------//
function rid_postbuttle(i_id,i_no){
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("攻撃処理を開始します");                    }
    var l_url="http://" + HOST + "/card/event_battle_attack.php";
    var l_ssid = rid_getSessionId();
    var fileList = rid_loadData(RID_KEY+"_fileList", "", true);
    var l_hp=0;
    var l_gage=0;
    var l_chk=0;
    var l_chktarget=false;
    var l_chknotarget=false;
    var l_limit = 0;
    var SPECFLG = eval("RID_SPEC_FLAG" + i_no);
    var SPECLIMIT = eval("RID_LIMIT_SPEC" + i_no);
    var TARGETFLG = eval("RID_TARGET_FLG" + i_no);
    var TARGETLST = eval("RID_TARGET_ID" + i_no);
    var NOTTARGETFLG = eval("RID_NOTTARGET_FLG" + i_no);
    var NOTTARGETLST = eval("RID_NOTTARGET_ID" + i_no);

    Label0:
    if (fileList.length != 0 ) {
        for(var fa= 0; fa < fileList.length; fa++){
            if (m_raid_options[RID_DEBUGFLG]==true){
                rid_savelog("カード名:"+ fileList[fa].name +" HP:"+ fileList[fa].hp +" 討伐:"+ fileList[fa].gage);
            }
            l_hp=parseInt(fileList[fa].hp);
            l_gage=parseInt(fileList[fa].gage);
            if ((l_gage>99) && (fileList[fa].setsta=="set")){
                // 対象IDチェック
                l_chktarget=false;
                if (m_raid_options[TARGETFLG]==true){
                    var l_tagetarry=m_raid_options[TARGETLST].split(',');
                    for (var j=0; j<l_tagetarry.length; j++){
                        if (l_tagetarry[j]==fileList[fa].cdid){
                            l_chktarget=true;
                            if (m_raid_options[RID_DEBUGFLG]==true){
                                rid_savelog("カード名:"+ fileList[fa].name +" ID:"+ fileList[fa].cdid +"は対象カードに設定されています" );
                            }
                            break;
                        }
                    }
                }
                if (l_chktarget==false){
                    // 対象外IDチェック
                    l_chknotarget=false;
                    if (m_raid_options[NOTTARGETFLG]==true){
                        var l_tagetarry=m_raid_options[NOTTARGETLST].split(',');
                        for (var j=0; j<l_tagetarry.length; j++){
                            if (l_tagetarry[j]==fileList[fa].cdid){
                                l_chknotarget=true;
                                if (m_raid_options[RID_DEBUGFLG]==true){
                                    rid_savelog("カード名:"+ fileList[fa].name +" ID:"+ fileList[fa].cdid +"は対象外カードに設定されています" );
                                }
                                break;
                            }
                        }
                        if (l_chknotarget==true){
                            continue;
                        }
                    }
                    switch (i_no) {
                        case 1:     //攻撃戦
                            l_limit=fileList[fa].atk;
                            break;
                        case 2:     //防御戦
                            l_limit=fileList[fa].wdef;
                            break;
                        case 3:     //知力戦
                            l_limit=fileList[fa].int;
                            break;
                        case 4:   //速度戦
                            l_limit=fileList[fa].speed;
                            break;
                    }
                    if (m_raid_options[RID_DEBUGFLG]==true){
                        rid_savelog("コストフラグ:"+ m_raid_options[RID_COST_FLAG] +" 設定:"+ m_raid_options[RID_LIMIT_COST] + " カードコスト:"+ fileList[fa].cost );
                        rid_savelog("レベルフラグ:"+ m_raid_options[RID_LEVEL_FLAG] +" 設定:"+ m_raid_options[RID_LIMIT_LEVEL] + " カードレベル:"+ fileList[fa].level );
                        rid_savelog("能力フラグ:"+ m_raid_options[SPECFLG] +" 設定:"+ m_raid_options[SPECLIMIT] + " カード能力:"+ l_limit );
                    }

                    // コストチェック
                    if (m_raid_options[RID_COST_FLAG]==true){
                        var l_cost=m_raid_options[RID_LIMIT_COST].replace(/cost/g, '');
                        if (parseFloat(l_cost)>parseFloat(fileList[fa].cost)){
                            continue;
                        }
                    }
                    // レベルチェック
                    if (m_raid_options[RID_LEVEL_FLAG]==true){
                        if (parseFloat(m_raid_options[RID_LIMIT_LEVEL])>parseFloat(fileList[fa].level)){
                            continue;
                        }
                    }
                    // 能力チェック
                    if (m_raid_options[SPECFLG]==true){
                        if (parseFloat(m_raid_options[SPECLIMIT])>parseFloat(l_limit)){
                            continue;
                        }
                    }
                }
                if (5>parseInt(fileList[fa].stamina)){
                    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("体力が最低値以下です");}
                    continue;
                }

                if (m_raid_options[RID_DEBUGFLG]==true){"送信データを作成します"}
                // 送信データの作成
                var params = new Object;
                var l_attacksid=3-parseInt(fileList[fa].count);
                params['ssid'] = l_ssid;
                params['entry_id'] = i_id;
                params['mode'] = 'atk';
                params['target_card'] = fileList[fa].cdid;
                params['deck_set_flg'] = 1;
                params['rem_attack_num'] = fileList[fa].count;
                params['p'] = "";
                params['stamina_num'] = fileList[fa].stamina;

                params['attack_sid'] = l_attacksid;
                params['use_attack_up_flg'] = 0;
                params['buy_attack_up_flg'] = 1;
                params['use_gauge_up_flg'] = 0;
                params['buy_gauge_up_flg'] = 1;
                params['use_force_end_flg'] = 0;
                params['l'] = 0;

                j$.ajax({
                    type: 'get',
                    url: l_url,
                    datatype: 'html',
                    cache: false,
                    async: false,
                    data: params
                }).done(function(data) {
                    rid_savelog("戦闘NO:"+i_id+"に 武将ID"+fileList[fa].cdid+" "+fileList[fa].name+"で攻撃しました");
                    l_chk=1;
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    l_chk=1;
                    if (m_raid_options[RID_DEBUGFLG]==true){
                        rid_savelog("rid_postbuttle()読み込み失敗");
                        rid_savelog("URL : " + l_url);
                        rid_savelog("XMLHttpRequest : " + jqXHR.status);
                        rid_savelog("textStatus : " + textStatus);
                        rid_savelog("errorThrown : " + errorThrown);
                    }
                });
            }
            if (l_chk==1){
                break Label0;
            }
        }
    }
    return l_chk;
}
//--------------------------------//
// ファイルのカードリスト取得       //
//--------------------------------//
function rid_getfilelist(i_id, i_sort1, i_sort2, i_page){
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("ソートされたカードリストを作成");}
    var l_url="http://" + HOST + "/card/event_battle_attack.php";
    var l_ret=0;
    var l_max=i_page;
    var fileListAll = [];
    var l_num =0;
    var l_urlpage=0;
    var l_chkloop=false;
    rid_saveData(RID_KEY+"_fileList", "", true);
    var l_getmax=1
    Label1:
    for (var i=0; i<l_max; i++){
        l_urlpage++;
        // 送信データの作成
        var params = new Object;
        var l_ssid = rid_getSessionId();
        params['ssid'] = l_ssid;
        params['entry_id'] = i_id;
        params['target_card'] = 0;
        params['sort_order'] = i_sort1;
        params['sort_order_type'] = i_sort2;
        params['show_deck_card_count'] = 104;    // 小15:103 小60:104
        params['btn_change_flg'] = 1;
        params['l'] = 0;
        params['p'] = l_urlpage;

        j$.ajax({
            type: 'post',
            url: l_url,
            datatype: 'html',
            cache: false,
            async: false,
            data: params
        }).done(function(data) {
            // ファイルにあるカード情報取得
            if (j$(data).find("#cardFileList div[class='statusDetail clearfix']").length<1){
                rid_savelog("ファイルにカードがない");
                l_ret=1;
            } else {
                var l_stamina=j$(data).find("#npc_event_stamina_area span[class='status'] span[class='cur_stamina']").eq(0).text();
                var l_count=j$(data).find("div[class='remaining_battle_count']").eq(0).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/)[1];
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
                    var cdatk = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" ul[class='status'] li[class^='status_att']").text().match(/\d+/g)[0];
                    var cdwdef = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" ul[class='status'] li[class^='status_wdef']").text().match(/\d+/g)[0];
                    var cdint = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" ul[class='status'] li[class^='status_int']").text().match(/\d+/g)[0];
                    var cdspeed = j$(this).parents("div[class='cardStatusDetail label-setting-mode']").find( "#cardWindow_" + cid +" ul[class='status'] li[class^='status_speed']").text().match(/\d+/g)[0];

                    fileList.name = j$.trim(cdName);                //カード名
                    fileList.cdid = cid;                            //カードID
                    fileList.setsta = j$.trim(setStatus);           //状態
                    fileList.gage = j$.trim(cdGage.text());         //討伐ゲージ
                    fileList.hp = cdHp;                             //HP
                    fileList.level = cdLevel;                       //カードレベル
                    fileList.cost = cdCost;                         //コスト
                    fileList.count = parseInt(l_count);             //回数
                    fileList.stamina = parseInt(l_stamina);         //スタミナ
                    fileList.atk = cdatk;
                    fileList.wdef = cdwdef;
                    fileList.int = cdint;
                    fileList.speed = cdspeed;
                    l_num ++;
                    // if (m_raid_options[RID_DEBUGFLG]==true){
                    //     rid_savelog("読み込み数：" + l_num);
                    //     rid_savelog("カード名 : " + fileList.name);
                    //     rid_savelog("カードID : " + fileList.cdid);
                    //     rid_savelog("状態 : " + fileList.setsta);
                    //     rid_savelog("討伐ゲージ : " + fileList.gage);
                    //     rid_savelog("HP : " + fileList.hp);
                    //     rid_savelog("カードレベル : " + fileList.level);
                    //     rid_savelog("コスト : " + fileList.cost);
                    //     rid_savelog("残回数 : " + fileList.count);
                    //     rid_savelog("体力 : " + fileList.stamina);
                    //     rid_savelog("攻撃力 : " + fileList.atk);
                    //     rid_savelog("歩兵防御力 : " + fileList.wdef);
                    //     rid_savelog("知力 : " + fileList.int);
                    //     rid_savelog("移動速度 : " + fileList.speed);
                    // }
                    fileListAll.push(fileList);
                });
                //ページ数
                if (j$("#rotate ul[class=pager]").length > 0) {
                    var l_pages = j$("#rotate ul[class=pager] li");
                    for (var i = 0; i < l_pages.length; i++) {
                        var l_page = parseInt(j$(l_pages[i]).text());
                        if (!isNaN(l_page) && l_getmax < l_page) {
                            l_getmax = l_page;
                        }
                    }
                }
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            l_ret=1;
            if (m_raid_options[RID_DEBUGFLG]==true){
                rid_savelog("rid_getfilelist()読み込み失敗");
                rid_savelog("URL : " + l_url);
                rid_savelog("XMLHttpRequest : " + jqXHR.status);
                rid_savelog("textStatus : " + textStatus);
                rid_savelog("errorThrown : " + errorThrown);
            }
        });
        if (l_ret==1){
            break;
        } else if ((l_getmax < l_urlpage) || (l_urlpage==l_getmax)){
            break;
        }
    }
    rid_saveData(RID_KEY+"_fileList", fileListAll, true);
    return l_ret;
}
//----------------------------//
// 自動処理開始チェック         //
//----------------------------//
function rid_chkauto() {
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("自動レイド処理が出来るかチェック");}
    //体力チェック
    if (j$('#npc_event_stamina_area span[class=cur_stamina]').length > 0){
        var l_stamina = j$('#npc_event_stamina_area span[class=cur_stamina]').eq(0).text();
        if (parseInt(m_raid_options[RID_STAMINA])>parseInt(l_stamina)){
            if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("設定体力:" + m_raid_options[RID_STAMINA] + " 体力:" + l_stamina);}
            return 1;
        }
        if (5>parseInt(l_stamina)){
            if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("設定体力:" + m_raid_options[RID_STAMINA] + " 体力:" + l_stamina);}
            return 1;
        }
    } else {
        if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("体力が取得できない");}
        return 1; //終了
    }
    return 0;
}
function rid_chkautoadd() {
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("自動レイド処理が出来るかチェック追加分");}
    //処理中の枠数チェック
    var l_buttlelist = rid_loadData(RID_KEY + "_buttlelist", "[]", true);
    if (l_buttlelist.length > 2){
        if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("レイド使用中の枠数:" + l_buttlelist.length);}
        return 1; //終了
    }
    // 設定なし以外で登録されているものの数<=処理中の数　⇒抜ける
    var l_len = 0;
    for (var k = 1; k <= 3; k++) {
        var REST = eval("RID_REST" + k);
        if (m_raid_options[REST] != "non") {
            l_len++;
        }
    }
    if (l_len <= l_buttlelist.length){
        if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("レイド使用中の枠数:" + l_buttlelist.length + " 設定中の枠数:" + l_len);}
        return 1; //終了
    }
    return 0;
}
//------------------------//
//討伐終了処理             //
//------------------------//
function rid_endcheck() {
    if (m_raid_options[RID_DEBUGFLG]==true){rid_savelog("戦闘中のレイド武将をチェック");}
    var l_battle="";
    var l_battletype="";
    var l_id="";
    var l_count=0;
    var l_pop=0;
    var l_hp=0;
    var l_max=0;
    var l_match="";
    var l_bonus=0;
    var l_url="http://" + HOST + "/card/event_battle_top.php?scope=4#";
    var l_oldbuttlelist = rid_loadData(RID_KEY+"_buttlelist", "[]", true);
    var l_newbuttlelist=[];
    var l_listflag=false;
    var l_sec=0;
    var l_ret=0;
    rid_saveData(RID_KEY+"_buttlelist", l_newbuttlelist, true);
    j$.ajax({
        type: 'get',
        url: l_url,
        datatype: 'html',
        cache: false,
        async: false
    }).done(function(data) {
        j$(data).find(".npcBusho").each(function(){
            var l_list = new Object;
            l_battle=j$(this).find("dd").eq(1).text().replace(/[\t\r\n]/g, "");
            l_id=j$(this).find("dd").eq(2).text().replace(/[\t\r\n]/g, "");
            l_match=j$(this).find("dd").eq(3).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
            l_count=parseInt(l_match[1]);
            l_match=j$(this).find("dd").eq(4).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
            l_pop=parseInt(l_match[1]);
            l_match=j$(this).find("dd").eq(6).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\/(\d+)/);
            l_hp=parseInt(l_match[1]);
            l_max=parseInt(l_match[2]);
            l_match=j$(this).find("dd").eq(10).text().replace(/[\t\r\n,]/g, "").match(/(\d+)\%/);
            l_bonus=parseInt(l_match[1]);

            if (l_hp==0){
                l_sec=rid_buttle(l_id);
                l_ret=1;
            } else {
                l_listflag=false;
                for (var i = 0; i < l_oldbuttlelist.length; i++) {
                    if (l_oldbuttlelist[i].id == l_id){
                        l_listflag=true;
                        l_sec=new Date(l_oldbuttlelist[i].sec);
                    }
                }
                if (l_listflag==false){
                    l_sec=rid_buttle(l_id);
                    l_ret=1;
                }
                var l_dt = new Date();
                if (l_sec!=0){
                    console.log(l_sec);
                    console.log(String(l_dt.getTime()-l_sec.getTime()));
                    if ((l_dt.getTime()-l_sec.getTime())>0){
                        l_sec=rid_buttle(l_id);
                        l_ret=1;
                    }
                }
            }
            switch (l_battle) {
                case "攻撃戦":
                    l_battletype="atk";
                    break;
                case "防御戦":
                    l_battletype="def";
                    break;
                case "知力戦":
                    l_battletype="int";
                    break;
                case "速度戦":
                    l_battletype="speed";
                    break;
            }

            l_list.battletype=l_battletype;
            l_list.id=l_id;
            l_list.count=l_count;
            l_list.pop=l_pop;
            l_list.hp=l_hp;
            l_list.max=l_max;
            l_list.bonus=l_bonus;
            l_list.sec=l_sec.toString();

            l_newbuttlelist.push(l_list);
            if (m_raid_options[RID_DEBUGFLG]==true){
                rid_savelog("ダメージ判定：" + l_battle);
                rid_savelog("戦闘NO：" + l_id);
                rid_savelog("戦闘回数残り：" + l_count);
                rid_savelog("参加人数：" + l_pop);
                rid_savelog("残りHP：" + l_hp);
                rid_savelog("最大HP：" + l_max);
                rid_savelog("残り時間：" + l_sec.toString());
                rid_savelog("同盟ボーナス：" + l_bonus);
            }
        });
        rid_saveData(RID_KEY+"_buttlelist", l_newbuttlelist, true);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        l_ret=1;
        if (m_raid_options[RID_DEBUGFLG]==true){
            rid_savelog("rid_endcheck()読み込み失敗");
            rid_savelog("URL : " + l_url);
            rid_savelog("XMLHttpRequest : " + jqXHR.status);
            rid_savelog("textStatus : " + textStatus);
            rid_savelog("errorThrown : " + errorThrown);
        }
    });
    return l_ret;
}
//----------------------------//
//戦闘残り時間取得             //
//----------------------------//
function rid_buttle(i_id) {
    var l_url="http://" + HOST + "/card/event_battle_attack.php";
    if (m_raid_options[RID_DEBUGFLG]==true){
        rid_savelog("戦闘No" + i_id + ":戦闘ページ読み込み");
    }
    var l_ssid = rid_getSessionId();
    var l_sec=0;
    // 送信データの作成
    var params = new Object;
    params['ssid'] = l_ssid;
    params['entry_id'] = i_id;
    j$.ajax({
        type: 'post',
        url: l_url,
        datatype: 'html',
        cache: false,
        async: false,
        data: params
    }).done(function(data) {
        var l_txtsec="";
        if (j$(data).find("#area_timer0").length>0){
            l_txtsec=j$(data).find("#area_timer0").eq(0).text().replace(/[\t\r\n]/g, "");
            console.log(l_txtsec);

            var l_dt = new Date();
            l_dt.setSeconds(l_dt.getSeconds()+parseInt(l_txtsec)); //終了時間の秒
            l_sec=l_dt;
        }
        if (m_raid_options[RID_DEBUGFLG]==true){
            rid_savelog("戦闘No" + i_id + "終了時間:" + l_sec.toString());
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        l_sec=0;
        if (m_raid_options[RID_DEBUGFLG]==true){
            rid_savelog("rid_buttle()読み込み失敗");
            rid_savelog("URL : " + l_url);
            rid_savelog("XMLHttpRequest : " + jqXHR.status);
            rid_savelog("textStatus : " + textStatus);
            rid_savelog("errorThrown : " + errorThrown);
        }
    });
    return l_sec;
}
//----------------------------//
//ログ保存                     //
//----------------------------//
function rid_savelog(l_logtxt){
    var dt = new Date();
    var l_strDate = rid_LocalString(dt);
    var l_log=new Array();
    var l_chklog=rid_getValue(RID_KEY + '_raid_log', "");
    var lognum=50;
    if (l_chklog!=""){
        l_log = rid_getValue(RID_KEY + '_raid_log', []).split(RID_DELIMIT);
        var l_loglen=l_log.length;
        if(!isNaN(m_raid_options[RID_LOGCOUNT])){
            lognum=m_raid_options[RID_LOGCOUNT];
        }
        if (l_loglen > lognum){
            //多いログを消す
            l_log.splice(lognum, l_loglen-lognum);
            //ログ末尾削除
            l_log.pop();
        }
    }
    //最初に挿入
    l_log.unshift(l_strDate +" "+ l_logtxt);
    var l_save = l_log.join(RID_DELIMIT);
    rid_setValue(RID_KEY + '_raid_log', l_save);  //ログ保存
}
function rid_LocalString(date){
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join( '/' ) + ' ' + date.toLocaleTimeString();
}

//--------------------------//
//  設定のロード            //
//--------------------------//
function rid_loadSettings() {
    // 保存データの取得
    var obj = rid_getValue(RID_KEY + '_raid_options', null);
    var options;
    if (obj == null) {
        options = rid_getDefaultOptions();
    } else {
        options = JSON.parse(obj);
    }

    // 保存データにデフォルト設定の情報がない場合、デフォルト設定を追加
    var defaults = rid_getDefaultOptions();
    for (var key in defaults) {
        if (typeof options[key] == "undefined") {
            options[key] = defaults[key];
        }
    }
    m_raid_options = options;
}
//---------------------------//
//    設定を保存する         //
//---------------------------//
function rid_savesettings() {
    var options = rid_getDefaultOptions();

    var obj = new Object;
    var items = j$("#rid_setting_view input");
    for (var i = 0; i < items.length; i++) {
        if (items.eq(i).attr('type') == 'checkbox') {
            obj[items.eq(i).attr('id')] = items.eq(i).prop('checked');
        } else if (items.eq(i).attr('type') == 'text') {
            if (!isNaN(items.eq(i).val())) {
                var num = parseInt(items.eq(i).val().replace(/,/g, ''));
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
    var items1 = j$("#rid_setting_view select");
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

    var items2 = j$("#rid_setting_view textarea");
    for (var i = 0; i < items2.length; i++) {
        if (items2.eq(i).hasClass('rid_txtset')) {
            var l_textarea = items2.eq(i).val();
            var l_reptext = l_textarea.replace(/\r?\n/g, ',');            // 改行をカンマに変換して保存
            var l_arry = l_reptext.split(',');                            // テキストエリアの内容をカンマ区切りで配列aにする
            var l_arry2 = j$.grep(l_arry, function(e){return e !== "";}); // 配列から空白削除
            l_textarea = l_arry2.join(',');                               // カンマで配列結合
            obj[items2.eq(i).attr('id')] = l_textarea;
        }
    }
    //設定を保存
    rid_setValue(RID_KEY + '_raid_options', JSON.stringify(obj));
}

//---------------------//
// 設定画面作成          //
//---------------------//
function rid_drawSetWindow() {
    //表示コンテナ作成
    var rid_facContainer = j$("<div id='rid_setting_view' class='rid_winset' style='display: none;width: 600px;'>\
        <span style='color: #000000;font-size: 15px; margin: 10px; font-weight: bold;'>レイド設定画面</span>\
        </div>");
    j$("#npcTitle").append(rid_facContainer);
    rid_facContainer.draggable();

    var rid_table = j$("<div id='rid_tabs'>\
        <ul>\
            <li><a href='#rid_maintab'>共通設定</a></li>\
            <li><a href='#rid_atktab'>攻</a></li>\
            <li><a href='#rid_deftab'>防</a></li>\
            <li><a href='#rid_inttab'>知</a></li>\
            <li><a href='#rid_speedtab'>速</a></li>\
            <li><a href='#rid_expimptab'>exp/imp</a></li>\
            <li><a href='#rid_logtab'>ログ</a></li>\
        </ul>\
        <div id='rid_maintab'></div>\
        <div id='rid_atktab'></div>\
        <div id='rid_deftab'></div>\
        <div id='rid_inttab'></div>\
        <div id='rid_speedtab'></div>\
        <div id='rid_expimptab'></div>\
        <div id='rid_logtab'></div>\
    </div>");

    var rid_setbutton = j$("<div style='margin: 10px;'>\
        <input type='button' class='rid_btn_def' id='rid_saveSetWindow' value='設定を保存' >\
        <input type='button' class='rid_btn_def' id='rid_initSetWindow' value='設定を初期化' >\
        <input type='button' class='rid_btn_def' id='rid_closeSetWindow' value='閉じる' >\
    </div>");

    rid_facContainer.append(rid_table);
    rid_facContainer.append(rid_setbutton);
    rid_mainsetting();
    rid_atksetting();
    rid_defsetting();
    rid_intsetting();
    rid_speedsetting();
    rid_expimpsetting();
    rid_logsetting();

    j$("#rid_tabs li").css({'padding':'0px', 'min-width':'0px'});
    j$("#rid_tabs li a").css({'background':'none'});

    j$('#rid_tabs').tabs();
    j$("#rid_tabs").css({'background':'white'});

    // 保存ボタンのクリックイベント
    j$("#rid_saveSetWindow").on('click',function() {
        rid_savesettings();
        alert("保存しました");
        j$("#rid_setting_view").css('display', 'none');
    });
    // 閉じるボタンのクリックイベント
    j$("#rid_closeSetWindow").on('click',function() {
        j$("#rid_setting_view").css('display', 'none');
    });

    // エクスポート
    j$("#rid_expbtn").on('click', function() {
        //一旦保存
        rid_savesettings();
        j$("#rid_exparea").val(JSON.stringify(m_raid_options));
    });
    // インポートオプション
    j$("#rid_impbtn").on('click', function() {
        var options;
        try {
            options = JSON.parse(j$("#rid_exparea").val());
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
                } else if (j$("#" + key).is('textarea')) {
                    j$("#" + key).val(options[key]);
                }
            }
        }
        alert("設定を適用する場合は保存ボタンを押してください");
    });

    // すべて初期化
    j$("#rid_initSetWindow").on('click',function() {
        var options = rid_getDefaultOptions();
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
                } else if (j$("#" + key).is('textarea')) {
                    j$("#" + key).val(options[key]);
                }
            }
        }
        alert("設定を適用する場合は保存ボタンを押してください");
    });
    // select選択イベント
    j$("[id^='rid_sort1_']").on('change',function() { rid_selorder(this); });
    j$("[id^='rid_sort3_']").on('change',function() { rid_selorder(this); });
}
//------------------------//
//    設定画面の描画        //
//------------------------//
function rid_mainsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_maintab").append(table);
    j$(table).append(j$("<tr><td colspan='5' id=rid_td1_11></td></tr>\
        <tr><td id=rid_td1_21></td><td class=rid_width30></td><td id=rid_td1_22></td><td class=rid_width30></td><td id=rid_td1_23></td></tr>\
        <tr><td colspan='5' id=rid_td1_31></td></tr>\
        <tr><td colspan='5' id=rid_td1_41></td></tr>\
    "));

    rid_createTextBox("#rid_td1_11", "rid_stamina" , " 体力:", m_raid_options[RID_STAMINA],'3','40px',false);
    rid_createSpan("#rid_td1_11", "以上で処理を行う");
    rid_createSelectBox("#rid_td1_21", "rid_rest1" , "1枠", "rid_select", rid_selbattletype, m_raid_options[RID_REST1]);
    rid_createSelectBox("#rid_td1_22", "rid_rest2" , "2枠", "rid_select", rid_selbattletype, m_raid_options[RID_REST2]);
    rid_createSelectBox("#rid_td1_23", "rid_rest3" , "3枠", "rid_select", rid_selbattletype, m_raid_options[RID_REST3]);
    rid_createCheckBox("#rid_td1_31", "rid_cost_flag","","rid_cost_flag","1",m_raid_options[RID_COST_FLAG]);
    rid_createSelectBox("#rid_td1_31", "rid_limit_cost" , "コスト：", "rid_select", rid_sellevel, m_raid_options[RID_LIMIT_COST]);
    rid_createSpan("#rid_td1_31", "以上のカードを使用する");
    rid_createCheckBox("#rid_td1_41", "rid_level_flag","","rid_level_flag","1",m_raid_options[RID_LEVEL_FLAG]);
    rid_createTextBox("#rid_td1_41", "rid_limit_level" , " レベル:", m_raid_options[RID_LIMIT_LEVEL],'3','40px',false);
    rid_createSpan("#rid_td1_41", "以上のカードを使用する");
}

function rid_atksetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_atktab").append(table);
    j$(table).append(j$("<tr><td><table class='rid_subtable' style='padding:10px;width: 560px;'>\
        <tr><td colspan='3' id=rid_td2_11 class='rid_font_bold'></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_21></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_31></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_41 style='width: 130px;'></td><td id=rid_td2_42></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_52></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_62></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_72></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_81></td><td id=rid_td2_82></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_91></td><td id=rid_td2_92></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_101></td><td id=rid_td2_102></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_111></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_121></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_131></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_141></td></tr>\
        </table></td></tr>\
    "));
    rid_createSpan("#rid_td2_11", "==攻撃戦設定==");
    rid_createTextBox("#rid_td2_21", "rid_limit_hp1" , " 対象レイド武将の最大HP:", m_raid_options[RID_LIMIT_HP1],'12','100px',false);
    rid_createSpan("#rid_td2_21", "以上をたたく");
    rid_createCheckBox("#rid_td2_31", "rid_spec_flag1","","rid_spec_flag1","1",m_raid_options[RID_SPEC_FLAG1]);
    rid_createTextBox("#rid_td2_31", "rid_limit_spec1" , "攻撃力:", m_raid_options[RID_LIMIT_SPEC1],'6','50px',false);
    rid_createSpan("#rid_td2_31", "以上の武将でたたく");
    rid_createSpan("#rid_td2_41", "武将検索ソート順：");
    rid_createSelectBox("#rid_td2_42", "rid_sort1_1" , "優先度１", "rid_select", rid_selsortkind, m_raid_options[RID_SORT1_1]);
    rid_createSelectBox("#rid_td2_42", "rid_sort2_1" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT2_1]);
    rid_createSelectBox("#rid_td2_52", "rid_sort3_1" , "優先度２", "rid_select", rid_selsortkind, m_raid_options[RID_SORT3_1]);
    rid_createSelectBox("#rid_td2_52", "rid_sort4_1" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT4_1]);
    rid_createSelectBox("#rid_td2_62", "rid_sort_page1" , "処理ファイル最大ページ数", "rid_select", rid_selsortpage, m_raid_options[RID_SORT_PAGE1]);
    rid_createSpan("#rid_td2_71", "※60枚で検索した際に表示されるページ数");
    rid_createSpan("#rid_td2_81", "たたくタイミング：");
    rid_createTextBox("#rid_td2_82", "rid_limit_bonus1_1" , "１回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS1_1],'3','30px',false);
    rid_createSpan("#rid_td2_82", "％以上");
    rid_createTextBox("#rid_td2_92", "rid_limit_bonus2_1" , "２回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS2_1],'3','30px',false);
    rid_createSpan("#rid_td2_92", "％以上");
    rid_createTextBox("#rid_td2_102", "rid_limit_bonus3_1" , "３回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS3_1],'3','30px',false);
    rid_createSpan("#rid_td2_102", "％以上");
    rid_createCheckBox("#rid_td2_111", "rid_target_flg1","対象武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_target_flg1","1",m_raid_options[RID_TARGET_FLG1]);
    rid_createTextArea("#rid_td2_121", "rid_target_id1",'500','50', false, m_raid_options[RID_TARGET_ID1], "rid_txtset");
    rid_createCheckBox("#rid_td2_131", "rid_nottarget_flg1","対象外武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_nottarget_flg1","1",m_raid_options[RID_NOTTARGET_FLG1]);
    rid_createTextArea("#rid_td2_141", "rid_nottarget_id1",'500','50', false, m_raid_options[RID_NOTTARGET_ID1], "rid_txtset");
}
function rid_defsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_deftab").append(table);
    j$(table).append(j$("<tr><td><table class='rid_subtable' style='padding:10px;width: 560px;'>\
        <tr><td colspan='3' id=rid_td2_211 class='rid_font_bold'></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_221></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_231></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_241 style='width: 130px;'></td><td id=rid_td2_242></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_252></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_262></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_272></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_281></td><td id=rid_td2_282></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_291></td><td id=rid_td2_292></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_301></td><td id=rid_td2_302></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_311></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_321></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_331></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_341></td></tr>\
        </table></td></tr>\
    "));

    rid_createSpan("#rid_td2_211", "==防御戦設定==");
    rid_createTextBox("#rid_td2_221", "rid_limit_hp2" , " 対象レイド武将の最大HP:", m_raid_options[RID_LIMIT_HP2],'12','100px',false);
    rid_createSpan("#rid_td2_221", "以上をたたく");
    rid_createCheckBox("#rid_td2_231", "rid_spec_flag2","","rid_spec_flag2","1",m_raid_options[RID_SPEC_FLAG2]);
    rid_createTextBox("#rid_td2_231", "rid_limit_spec2" , "歩兵防御力:", m_raid_options[RID_LIMIT_SPEC2],'6','50px',false);
    rid_createSpan("#rid_td2_231", "以上の武将でたたく");
    rid_createSpan("#rid_td2_241", "武将検索ソート順：");
    rid_createSelectBox("#rid_td2_242", "rid_sort1_2" , "優先度１", "rid_select", rid_selsortkind, m_raid_options[RID_SORT1_2]);
    rid_createSelectBox("#rid_td2_242", "rid_sort2_2" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT2_2]);
    rid_createSelectBox("#rid_td2_252", "rid_sort3_2" , "優先度２", "rid_select", rid_selsortkind, m_raid_options[RID_SORT3_2]);
    rid_createSelectBox("#rid_td2_252", "rid_sort4_2" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT4_2]);
    rid_createSelectBox("#rid_td2_262", "rid_sort_page2" , "処理ファイル最大ページ数", "rid_select", rid_selsortpage, m_raid_options[RID_SORT_PAGE2]);
    rid_createSpan("#rid_td2_271", "※60枚で検索した際に表示されるページ数");
    rid_createSpan("#rid_td2_281", "たたくタイミング：");
    rid_createTextBox("#rid_td2_282", "rid_limit_bonus1_2" , "１回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS1_2],'3','30px',false);
    rid_createSpan("#rid_td2_282", "％以上");
    rid_createTextBox("#rid_td2_292", "rid_limit_bonus2_2" , "２回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS2_2],'3','30px',false);
    rid_createSpan("#rid_td2_292", "％以上");
    rid_createTextBox("#rid_td2_302", "rid_limit_bonus3_2" , "３回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS3_2],'3','30px',false);
    rid_createSpan("#rid_td2_302", "％以上");
    rid_createCheckBox("#rid_td2_311", "rid_target_flg2","対象武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_target_flg2","1",m_raid_options[RID_TARGET_FLG2]);
    rid_createTextArea("#rid_td2_321", "rid_target_id2",'500','50', false, m_raid_options[RID_TARGET_ID2], "rid_txtset");
    rid_createCheckBox("#rid_td2_331", "rid_nottarget_flg2","対象外武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_nottarget_flg2","1",m_raid_options[RID_NOTTARGET_FLG2]);
    rid_createTextArea("#rid_td2_341", "rid_nottarget_id2",'500','50', false, m_raid_options[RID_NOTTARGET_ID2], "rid_txtset");
}

function rid_intsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_inttab").append(table);
    j$(table).append(j$("<tr><td><table class='rid_subtable' style='padding:10px;width: 560px;'>\
        <tr><td colspan='3' id=rid_td2_411 class='rid_font_bold'></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_421></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_431></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_441 style='width: 130px;'></td><td id=rid_td2_442></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_452></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_462></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_472></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_481></td><td id=rid_td2_482></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_491></td><td id=rid_td2_492></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_501></td><td id=rid_td2_502></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_511></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_521></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_531></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_541></td></tr>\
        </table></td></tr>\
    "));
    rid_createSpan("#rid_td2_411", "==知力戦設定==");
    rid_createTextBox("#rid_td2_421", "rid_limit_hp3" , " 対象レイド武将の最大HP:", m_raid_options[RID_LIMIT_HP3],'12','100px',false);
    rid_createSpan("#rid_td2_421", "以上をたたく");
    rid_createCheckBox("#rid_td2_431", "rid_spec_flag3","","rid_spec_flag3","1",m_raid_options[RID_SPEC_FLAG3]);
    rid_createTextBox("#rid_td2_431", "rid_limit_spec3" , "知力:", m_raid_options[RID_LIMIT_SPEC3],'6','50px',false);
    rid_createSpan("#rid_td2_431", "以上の武将でたたく");
    rid_createSpan("#rid_td2_441", "武将検索ソート順：");
    rid_createSelectBox("#rid_td2_442", "rid_sort1_3" , "優先度１", "rid_select", rid_selsortkind, m_raid_options[RID_SORT1_3]);
    rid_createSelectBox("#rid_td2_442", "rid_sort2_3" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT2_3]);
    rid_createSelectBox("#rid_td2_452", "rid_sort3_3" , "優先度２", "rid_select", rid_selsortkind, m_raid_options[RID_SORT3_3]);
    rid_createSelectBox("#rid_td2_452", "rid_sort4_3" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT4_3]);
    rid_createSelectBox("#rid_td2_462", "rid_sort_page3" , "処理ファイル最大ページ数", "rid_select", rid_selsortpage, m_raid_options[RID_SORT_PAGE3]);
    rid_createSpan("#rid_td2_471", "※60枚で検索した際に表示されるページ数");
    rid_createSpan("#rid_td2_481", "たたくタイミング：");
    rid_createTextBox("#rid_td2_482", "rid_limit_bonus1_3" , "１回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS1_3],'3','30px',false);
    rid_createSpan("#rid_td2_482", "％以上");
    rid_createTextBox("#rid_td2_492", "rid_limit_bonus2_3" , "２回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS2_3],'3','30px',false);
    rid_createSpan("#rid_td2_492", "％以上");
    rid_createTextBox("#rid_td2_502", "rid_limit_bonus3_3" , "３回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS3_3],'3','30px',false);
    rid_createSpan("#rid_td2_502", "％以上");
    rid_createCheckBox("#rid_td2_511", "rid_target_flg3","対象武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_target_flg3","1",m_raid_options[RID_TARGET_FLG3]);
    rid_createTextArea("#rid_td2_521", "rid_target_id3",'500','50', false, m_raid_options[RID_TARGET_ID3], "rid_txtset");
    rid_createCheckBox("#rid_td2_531", "rid_nottarget_flg3","対象外武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_nottarget_flg3","1",m_raid_options[RID_NOTTARGET_FLG3]);
    rid_createTextArea("#rid_td2_541", "rid_nottarget_id3",'500','50', false, m_raid_options[RID_NOTTARGET_ID3], "rid_txtset");
}
function rid_speedsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_speedtab").append(table);
    j$(table).append(j$("<tr><td><table class='rid_subtable' style='padding:10px;width: 560px;'>\
        <tr><td colspan='3' id=rid_td2_611 class='rid_font_bold'></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_621></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_631></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_641 style='width: 130px;'></td><td id=rid_td2_642></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_652></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_662></td></tr>\
        <tr><td class=rid_width15></td><td></td><td id=rid_td2_672></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_681></td><td id=rid_td2_682></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_691></td><td id=rid_td2_692></td></tr>\
        <tr><td class=rid_width15></td><td id=rid_td2_701></td><td id=rid_td2_702></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_711></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_721></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_731></td></tr>\
        <tr><td class=rid_width15></td><td colspan='2' id=rid_td2_741></td></tr>\
        </table></td></tr>\
    "));

    rid_createSpan("#rid_td2_611", "==速度戦設定==");
    rid_createTextBox("#rid_td2_621", "rid_limit_hp4" , " 対象レイド武将の最大HP:", m_raid_options[RID_LIMIT_HP4],'12','100px',false);
    rid_createSpan("#rid_td2_621", "以上をたたく");
    rid_createCheckBox("#rid_td2_631", "rid_spec_flag4","","rid_spec_flag4","1",m_raid_options[RID_SPEC_FLAG4]);
    rid_createTextBox("#rid_td2_631", "rid_limit_spec4" , "移動速度:", m_raid_options[RID_LIMIT_SPEC4],'6','50px',false);
    rid_createSpan("#rid_td2_631", "以上の武将でたたく");
    rid_createSpan("#rid_td2_641", "武将検索ソート順：");
    rid_createSelectBox("#rid_td2_642", "rid_sort1_4" , "優先度１", "rid_select", rid_selsortkind, m_raid_options[RID_SORT1_4]);
    rid_createSelectBox("#rid_td2_642", "rid_sort2_4" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT2_4]);
    rid_createSelectBox("#rid_td2_652", "rid_sort3_4" , "優先度２", "rid_select", rid_selsortkind, m_raid_options[RID_SORT3_4]);
    rid_createSelectBox("#rid_td2_652", "rid_sort4_4" , "", "rid_select", rid_sellowhigh, m_raid_options[RID_SORT4_4]);
    rid_createSelectBox("#rid_td2_662", "rid_sort_page4" , "処理ファイル最大ページ数", "rid_select", rid_selsortpage, m_raid_options[RID_SORT_PAGE4]);
    rid_createSpan("#rid_td2_671", "※60枚で検索した際に表示されるページ数");
    rid_createSpan("#rid_td2_681", "たたくタイミング：");
    rid_createTextBox("#rid_td2_682", "rid_limit_bonus1_4" , "１回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS1_4],'3','30px',false);
    rid_createSpan("#rid_td2_682", "％以上");
    rid_createTextBox("#rid_td2_692", "rid_limit_bonus2_4" , "２回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS2_4],'3','30px',false);
    rid_createSpan("#rid_td2_692", "％以上");
    rid_createTextBox("#rid_td2_702", "rid_limit_bonus3_4" , "３回目　同盟ボーナス", m_raid_options[RID_LIMIT_BONUS3_4],'3','30px',false);
    rid_createSpan("#rid_td2_702", "％以上");
    rid_createCheckBox("#rid_td2_711", "rid_target_flg4","対象武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_target_flg4","1",m_raid_options[RID_TARGET_FLG4]);
    rid_createTextArea("#rid_td2_721", "rid_target_id4",'500','50', false, m_raid_options[RID_TARGET_ID3], "rid_txtset");
    rid_createCheckBox("#rid_td2_731", "rid_nottarget_flg4","対象外武将を設定する(カードIDをカンマまたは改行区切りで指定)","rid_nottarget_flg4","1",m_raid_options[RID_NOTTARGET_FLG4]);
    rid_createTextArea("#rid_td2_741", "rid_nottarget_id4",'500','50', false, m_raid_options[RID_NOTTARGET_ID4], "rid_txtset");
}
function rid_expimpsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_expimptab").append(table);
    j$(table).
        append(j$("<tr><td colspan='2' id=rid_td3_11></td></tr>\
                <tr><td class=rid_width15></td><td id=rid_td3_21></td></tr>\
                <tr><td class=rid_width15></td><td id=rid_td3_31></td></tr>\
    "));
    rid_createSpan("#rid_td3_11", "設定のエクスポート／インポート");
    rid_createTextArea("#rid_td3_21", "rid_exparea",'550','300', false, "", "rid_txtnoset");
    rid_createButton("#rid_td3_31", "rid_expbtn", "エクスポート", "rid_btn_def");
    rid_createButton("#rid_td3_31", "rid_impbtn", "インポート", "rid_btn_def");
}
function rid_logsetting(){
    var table = j$("<table style='margin:2px;border-collapse: separate;'>");
    j$("#rid_logtab").append(table);
    j$(table).
        append(j$("<tr><td colspan='2' id=rid_td4_11 style='margin:2px;' class=rid_font_bold></td></tr>\
                <tr><td class=rid_width15></td><td id=rid_td4_21></td></tr>\
                <tr><td class=rid_width15></td><td id=rid_td4_31></td></tr>\
    "));
    rid_createSpan("#rid_td4_11", "直近のログ(手動で行ったものは残りません)");
    rid_createTextBox("#rid_td4_21", "rid_logcount" , " ログ件数:", m_raid_options[RID_LOGCOUNT],'4','40px',false);
    rid_createCheckBox("#rid_td4_21", "rid_debugflg" , "詳細出力","rid_debugflg","1", m_raid_options[RID_DEBUGFLG]);
    rid_createTextArea("#rid_td4_31", "rid_logarea",'550','600', false, "", "rid_txtnoset");
}

//-------------------//
// デフォルト設定値   //
//-------------------//
function rid_getDefaultOptions(){
    var settings = new Object;
    settings[RID_STAMINA] = '10';            //体力
    settings[RID_REST1] = 'atk';             //枠1
    settings[RID_REST2] = 'def';             //枠2
    settings[RID_REST3] = 'non';             //枠3
    settings[RID_COST_FLAG] = true;          //コストフラグ
    settings[RID_LIMIT_COST] = 'cost2';      //コスト
    settings[RID_LEVEL_FLAG] = false;        //レベルフラグ
    settings[RID_LIMIT_LEVEL] = '200';       //レベル
    // 攻撃戦
    settings[RID_LIMIT_HP1] = '50000000';    //HP
    settings[RID_SPEC_FLAG1] = true;         //スペックフラグ
    settings[RID_LIMIT_SPEC1] = '1000';      //スペック
    settings[RID_SORT1_1] = '9';             //ソート順1
    settings[RID_SORT2_1] = '1';             //ソート順2
    settings[RID_SORT3_1] = '0';             //ソート順3
    settings[RID_SORT4_1] = '1';             //ソート順4
    settings[RID_SORT_PAGE1] = 'page3';      //処理ページ数
    settings[RID_LIMIT_BONUS1_1] = '20';     //同盟ボーナス1
    settings[RID_LIMIT_BONUS2_1] = '180';    //同盟ボーナス2
    settings[RID_LIMIT_BONUS3_1] = '180';    //同盟ボーナス3
    settings[RID_TARGET_ID1] = '';           //対象カードID
    settings[RID_NOTTARGET_ID1] = '';        //対象外カードID
    settings[RID_TARGET_FLG1] = false;       //対象カードフラグ
    settings[RID_NOTTARGET_FLG1] = false;    //対象外カードフラグ
    // 防御戦
    settings[RID_LIMIT_HP2] = '50000000';    //HP
    settings[RID_SPEC_FLAG2] = true;         //スペックフラグ
    settings[RID_LIMIT_SPEC2] = '1000';      //スペック
    settings[RID_SORT1_2] = '11';            //ソート順1
    settings[RID_SORT2_2] = '1';             //ソート順2
    settings[RID_SORT3_2] = '0';             //ソート順3
    settings[RID_SORT4_2] = '1';             //ソート順4
    settings[RID_SORT_PAGE2] = 'page3';      //処理ページ数
    settings[RID_LIMIT_BONUS1_2] = '20';     //同盟ボーナス1
    settings[RID_LIMIT_BONUS2_2] = '180';    //同盟ボーナス2
    settings[RID_LIMIT_BONUS3_2] = '180';    //同盟ボーナス3
    settings[RID_TARGET_ID2] = '';           //対象カードID
    settings[RID_NOTTARGET_ID2] = '';        //対象外カードID
    settings[RID_TARGET_FLG2] = false;       //対象カードフラグ
    settings[RID_NOTTARGET_FLG2] = false;    //対象外カードフラグ
    // 知力
    settings[RID_LIMIT_HP3] = '50000000';    //HP
    settings[RID_SPEC_FLAG3] = true;         //スペックフラグ
    settings[RID_LIMIT_SPEC3] = '20';        //スペック
    settings[RID_SORT1_3] = '10';            //ソート順1
    settings[RID_SORT2_3] = '1';             //ソート順2
    settings[RID_SORT3_3] = '0';             //ソート順3
    settings[RID_SORT4_3] = '1';             //ソート順4
    settings[RID_SORT_PAGE3] = 'page3';      //処理ページ数
    settings[RID_LIMIT_BONUS1_3] = '20';     //同盟ボーナス1
    settings[RID_LIMIT_BONUS2_3] = '180';    //同盟ボーナス2
    settings[RID_LIMIT_BONUS3_3] = '180';    //同盟ボーナス3
    settings[RID_TARGET_ID3] = '';           //対象カードID
    settings[RID_NOTTARGET_ID3] = '';        //対象外カードID
    settings[RID_TARGET_FLG3] = false;       //対象カードフラグ
    settings[RID_NOTTARGET_FLG3] = false;    //対象外カードフラグ
    // 速度
    settings[RID_LIMIT_HP4] = '50000000';    //HP
    settings[RID_SPEC_FLAG4] = true;         //スペックフラグ
    settings[RID_LIMIT_SPEC4] = '50';        //スペック
    settings[RID_SORT1_4] = '15';            //ソート順1
    settings[RID_SORT2_4] = '1';             //ソート順2
    settings[RID_SORT3_4] = '0';             //ソート順3
    settings[RID_SORT4_4] = '1';             //ソート順4
    settings[RID_SORT_PAGE4] = 'page3';      //処理ページ数
    settings[RID_LIMIT_BONUS1_4] = '20';     //同盟ボーナス1
    settings[RID_LIMIT_BONUS2_4] = '180';    //同盟ボーナス2
    settings[RID_LIMIT_BONUS3_4] = '180';    //同盟ボーナス3
    settings[RID_TARGET_ID4] = '';           //対象カードID
    settings[RID_NOTTARGET_ID4] = '';        //対象外カードID
    settings[RID_TARGET_FLG4] = false;       //対象カードフラグ
    settings[RID_NOTTARGET_FLG4] = false;    //対象外カードフラグ

    //ログ
    settings[RID_DEBUGFLG] = false;       // ログ詳細
    settings[RID_LOGCOUNT] = 50;          // ログ件数
    return settings;
}
//-------------------//
// select変更        //
//-------------------//
function rid_selorder(i_obj) {
    var l_targetArr;
    switch (j$(i_obj).val()){
        case "0":
        case "2":
        case "3":
        case "5":
        case "9":
        case "10":
        case "11":
        case "12":
        case "13":
        case "14":
        case "15":
            // 高い低い
            l_targetArr = rid_sellowhigh;
            break;
        case "1":
        case "4":
            // 大きい小さい
            l_targetArr = rid_selsmallbig;
            break;
        case "6":
            // 兵種
            l_targetArr = rid_selsoldier;
            break;
        case "7":
        case "8":
            // 多い少ない
            l_targetArr = rid_selmoreless;
            break;
        case "19":
        case "22":
            // 対象
            l_targetArr = rid_seltarget;
            break;
        default :
            l_targetArr = rid_sellowhigh;
            break;
    }
    var l_id="";
    var l_idno="";
    if ((j$(i_obj).attr("id").indexOf('rid_sort1_')) != -1) {
        l_id = 'rid_sort2_';
        l_idno = j$(i_obj).attr("id").slice(-1);
    } else if ((j$(i_obj).attr("id").indexOf('rid_sort3_')) != -1) {
        l_id = 'rid_sort4_';
        l_idno = j$(i_obj).attr("id").slice(-1);
    }
    j$("#" + l_id + l_idno).children().remove();
    j$.each(l_targetArr, function(key, value) {
        j$("#" + l_id + l_idno)
                .append(j$("<option></option>")
                       .attr("value",key)
                       .text(value));
   });
   j$("#" + l_id + l_idno).val("1");
}
//-------------------//
// css定義の追加      //
//-------------------//
function rid_addCss() {
    var css =" \
    div[id^='rid'] .ui-widget-header {background:#ffb83f;} \
    div[id^='rid'] {text-align: left;} \
    table .rid_width30 {width: 30px;} \
    table .rid_width15 {width: 15px;} \
    .rid_font_bold {font-size:12px; \
        color:#000000; \
        font-weight:bold;} \
    .rid_btn_def {background-color: #F0F0F0; \
        border-width: 1px; \
        box-sizing: border-box; \
        font-family: sans-serif; \
        font-size: 10pt; \
        overflow: hidden; \
        padding: 1px 5px; \
        text-align: center; \
        zoom: 1;} \
    div.rid_winset { \
        -moz-border-radius:3px; \
        border-radius: 3px; \
        -webkit-border-radius: 3px; \
        margin-bottom:6px; \
        border: 2px solid #009; \
        position: absolute; \
        z-index:9999; \
        background-color: white;} \
    table[class='rid_subtable'] { \
        border: 1px solid #aaa; \
        border-collapse: separate; \
        border-spacing: 0; \
        border-radius: 6px;}\
    table[class='rid_subtable'] thead tr:first-child th:first-child {\
        border-radius: 5px 0 0 0;}\
    table[class='rid_subtable'] thead tr:first-child th:last-child {\
        border-radius: 0 5px 0 0;}\
    table[class='rid_subtable'] tbody tr:last-child th:first-child {\
        border-radius: 0 0 0 5px;}\
    table[class='rid_subtable'] tbody tr:last-child th:last-child {\
        border-radius: 0 0 5px 0;}\
    ";
    rid_addGlobalStyle(css);
}
function rid_createTextBox(i_container, i_id, i_text, i_value, i_len, i_size, i_input){
    var l_lbl = j$("<label>").text(i_text);
    var l_txBox = j$("<input>",{
        type: 'text',
        id: i_id,
        value: i_value,
        maxlength: i_len,
        width: i_size,
        readonly: i_input
    });
    j$(i_container).append(l_lbl);
    j$(i_container).append(l_txBox);
}
function rid_createTextArea(i_container, i_id, i_width, i_height, i_input, i_value, i_class){
    var l_txBox = j$("<textarea>",{
        id: i_id,
        value: i_value,
        class: i_class,
        disabled: i_input,
        width: i_width,
        height: i_height
    });
    j$(i_container).append(l_txBox);
}
function rid_createButton(i_container, i_id, i_text, i_class){
    var l_btn = j$("<input>",{
        type: 'button',
        id: i_id,
        class: i_class,
        value: i_text
    });
    j$(i_container).append(l_btn);
}

function rid_createCheckBox(i_container, i_id, i_text, i_class, i_value, i_ckflag){
    var l_lbl = j$("<label>").text(i_text);
    var l_ckBox = j$("<input>",{
        type: 'checkbox',
        id: i_id,
        class: i_class,
        value: i_value,
        checked: i_ckflag
    });
    j$(i_container).append(l_ckBox);
    j$(i_container).append(l_lbl);
}

function rid_createSpan(i_container, i_text){
    var l_text = j$("<span>");
    l_text.html(i_text);
    j$(i_container).append(l_text);
}

function rid_createSelectBox(i_container, i_id, i_text, i_class, i_selectValues,i_value){
    var l_lbl = j$("<label>").text(i_text);
    var l_sel = j$("<select>",{
        id: i_id,
        class: i_class
    });
    j$(i_container).append(l_lbl);
    j$(i_container).append(l_sel);

    j$.each(i_selectValues, function(key, value) {
         j$("#" + i_id)
             .append(j$("<option></option>")
                        .attr("value",key)
                        .text(value));
    });
    j$("#" + i_id).val(i_value);
}
//------------------//
// セッションID取得 //
//------------------//
function rid_getSessionId() {
    return rid_getCookie('SSID');
}

function rid_getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function rid_saveData(key, value, ev){
    if(ev) {
        if (window.opera || typeof JSON != 'object') {
            value = toJSON(value);
        }
        else {
            value = JSON.stringify( value );
        }
    }
    rid_setValue(key, value);
}

function rid_loadData(key, value, ev){
    var ret = rid_getValue(key, value);
    return ev ? eval(eval('ret='+ret)) : ret;
}
function rid_setValue(name, value) {
    value = (typeof value)[0] + value;
    localStorage.setItem(name, value);
}
function rid_getValue(name, defaultvalue) {
    var value = localStorage.getItem(name);
    if (!value) return defaultvalue;
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
function rid_addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function rid_wait(sec) {
    // jQueryのDeferredを作成
    var objDef = new j$.Deferred;
    setTimeout(function () {
        // sec秒後に、resolve()を実行して、Promiseを完了
        objDef.resolve(sec);
    }, sec*1000);
    return objDef.promise();
};
// ==UserScript==
// @name ニコニコ静画NGスクリプト
// @match *://seiga.nicovideo.jp/*
// @match *://seiga.nicovideo.jp/search/*
// @match *://seiga.nicovideo.jp/tag/*
// @match *://seiga.nicovideo.jp/illust/*
// @match *://seiga.nicovideo.jp/my/personalize*
// @description ニコニコ静画でNGユーザの投稿を非表示にする
// @license MIT License Copyright (c) 2020 Tennosuke Tokoro
// @license このスクリプトはkengo312氏のNico Nico Ranking NG (MIT License)を流用しています。
// @version 202007190
// @namespace https://greasyfork.org/users/585074
// @downloadURL https://update.greasyfork.org/scripts/405142/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BBNG%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/405142/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BBNG%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

var i;
var parent_element, mode;

if(location.href.match(/seiga.nicovideo.jp\/search/)){
    mode = "キーワード検索";
    parent_element = document.getElementById("usearch_form");
}else if(location.href.match(/seiga.nicovideo.jp\/my\/personalize/)){
    mode = "定点観測";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else if(location.href.match(/seiga.nicovideo.jp\/tag/)){
    mode = "タグ検索";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else if(location.href.match(/seiga.nicovideo.jp\/illust\/ranking\/point\/.*\/g_.*/)){
    mode = "ランキング・個別";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else if(location.href.match(/seiga.nicovideo.jp\/illust\/ranking/)){
    mode = "ランキング・まとめ";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else if(location.href.match(/seiga.nicovideo.jp\/illust\/list/)){
    mode = "すべてのイラスト";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else if(location.href.match(/seiga.nicovideo.jp\/seiga\/im/)){
    mode = "投稿ページ";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}else{
    mode = "トップページ";
    parent_element = document.getElementsByClassName("sg_pankuzu")[0];
}

const ng_config_button = document.createElement("input");
ng_config_button.id = "ng_config_button";
ng_config_button.type = "button";
ng_config_button.value = "静画NG設定 --作動中--";
ng_config_button.style.cssText = "background-color:red; padding-left:0.5em; padding-right:0.5em; padding-top:1px; padding-bottom:1px; font-size:12px; margin-left:1em;";
parent_element.appendChild(ng_config_button);

//NG設定画面
const ng_dialog = document.createElement("div");
ng_dialog.id = "ng_dialog";
ng_dialog.style.cssText = "margin-bottom:1em; position:fixed; width:auto; height:40%; line-height:1.5em; display:none; flex-direction:column; justify-content:center; background-color:gray; z-index:10";

const ng_dialog_top = document.createElement("div");
ng_dialog_top.style.cssText = "display:flex; flex-direction:row;";

const ng_types = document.createElement("select");
ng_types.style.cssText = "font-size:14px; margin-top:1em; margin-bottom:1em; margin-left:1em;";
ng_types.innerHTML = `<option>NGユーザー名</option>
                      <option>NGユーザーID</option>
                      <option>NG静画ID</option>`;

const ng_durations = document.createElement("select");
ng_durations.style.cssText = "font-size:14px; margin-top:1em; margin-bottom:1em; margin-left:1em;";
ng_durations.innerHTML = `<option>設定期間：永久</option>
                          <option>設定期間：1週間</option>
                          <option>設定期間：1ヶ月間</option>
                          <option>設定期間：3ヶ月間</option>
                          <option>設定期間：6ヶ月間</option>
                          <option>設定期間：1年間</option>
                          <option>設定期間：3年間</option>`;

const ng_close_button = document.createElement("input");
ng_close_button.type = "button";
ng_close_button.style.cssText = "font-size:18px; margin-top:0.5em; margin-bottom:0.5em; margin-left:1em; padding-left:1em; padding-right:1em;";
ng_close_button.value = "閉じる";
ng_close_button.onclick = function () {
    ng_dialog.style.display = "none";
}

const ng_onoff_button = document.createElement("input");
ng_onoff_button.type = "button";
ng_onoff_button.style.cssText = "font-size:18px; background-color:steelblue; width:6em; margin-top:0.5em; margin-bottom:0.5em; margin-left:1em; margin-right:1em; padding-left:1em; padding-right:1em;";
ng_onoff_button.value = "一時停止";

const ng_dialog_middle = document.createElement("div");
ng_dialog_middle.style.cssText = "width:100%; height:100%; margin-bottom:1em; display:flex; flex:auto; flex-direction:row;";

const ng_list = document.createElement("select");
ng_list.style.cssText = "width:auto; margin-left:1em; margin-right:1em;";
ng_list.multiple = "multiple";
ng_list.size = 14;

const ng_operation_area = document.createElement("p");
ng_operation_area.style.cssText = "display:flex; flex:auto; flex-direction:column;";

const view_config = document.createElement("select");
view_config.style.cssText = "font-size: 14px; margin-top:1em; margin-right:1em;";
view_config.innerHTML = `<option>削除した枠を：詰める</option><option>削除した枠を：詰めない</option>`;

const enable_keyword_search = document.createElement("select");
enable_keyword_search.style.cssText = "font-size: 14px; margin-top:1em; margin-right:1em;";
enable_keyword_search.innerHTML = `<option>キーワード・定点観測時：無効</option><option>キーワード・定点観測時：有効</option>`;

const id_name_cache_duration = document.createElement("select");
id_name_cache_duration.style.cssText = "font-size: 14px; margin-top:1em; margin-right:1em;";
id_name_cache_duration.innerHTML = `<option>ID-名前キャッシュ期間：3ヶ月間</option>
                                    <option>ID-名前キャッシュ期間：7日間</option>
                                    <option>ID-名前キャッシュ期間：1年間</option>
                                    <option>ID-名前キャッシュ期間：無効</option>`;

const clear_id_name_cache_button = document.createElement("input");
clear_id_name_cache_button.style.cssText = "font-size:14px; margin-top:1em; margin-bottom:1em; margin-right:1em;";
clear_id_name_cache_button.type = "button";
clear_id_name_cache_button.value = "ID-名前キャッシュをクリア";

const ng_add_delete_buttons = document.createElement("div");
ng_add_delete_buttons.style.cssText = "display:flex; flex-direction:row;";

const ng_add_button = document.createElement("input");
ng_add_button.style.cssText = "font-size:18px; width:4em; margin-top:2em; margin-bottom:1em;";
ng_add_button.type = "button";
ng_add_button.value = "追加";

const ng_delete_button = document.createElement("input");
ng_delete_button.style.cssText = "font-size:18px; width:4em; margin-left:2em; margin-top:2em; margin-bottom:1em;";
ng_delete_button.type = "button";
ng_delete_button.value = "削除";

const ng_import_export_buttons = document.createElement("div");
ng_import_export_buttons.style.cssText = "display:flex; flex-direction:row;";

const ng_import_button = document.createElement("input");
ng_import_button.style.cssText = "font-size:14px; padding:0.5em; margin-bottom:1em;";
ng_import_button.type = "button";
ng_import_button.value = "インポート";

const ng_export_button = document.createElement("input");
ng_export_button.style.cssText = "font-size:14px; padding:0.5em; margin-left:2em; margin-bottom:1em;";
ng_export_button.type = "button";
ng_export_button.value = "エクスポート";

const exception_url_button = document.createElement("input");
exception_url_button.id = "exception_url_button";
exception_url_button.type = "button";
exception_url_button.value = "動作対象外のURLを設定する";
exception_url_button.style.cssText = "background-color:slateBlue; padding-left:0.5em; padding-right:0.5em; padding-top:1px; padding-bottom:1px; font-size:12px; margin-left:1em;";

const exception_dialog = document.createElement("div");
exception_dialog.id = "exception_dialog";
exception_dialog.style.cssText = "margin-bottom:1em; position:fixed; width:40em; height:40%; line-height:1.5em; display:none; flex-direction:column; background-color:gray; z-index:11";

const exception_caption = document.createElement("div");
exception_caption.innerHTML = "動作対象外のURLを一行ずつ設定する<br>(Javascryptの正規表現が可能)";
exception_caption.style.cssText = "margin-top:0.5em; margin-bottom:0.5em; margin-left:1em; font-size:14px; font-color:black;";

const exception_text = document.createElement("textarea");
exception_text.style.cssText = "margin-left:1em; margin-right:1em; margin-bottom:0.5; height:100%;";

const exception_close_button = document.createElement("input");
exception_close_button.type = "button";
exception_close_button.style.cssText = "font-size:18px; margin-top:0.5em; margin-bottom:0.5em; margin-left:1em; width:10em; padding-left:0.5em; padding-right:0.5em;";
exception_close_button.value = "保存して閉じる";
exception_close_button.onclick = function () {
    view_config_db.exceptions = exception_text.value;
    saveViewConfig();
    location.reload();
    exception_dialog.style.display = "none";
}

ng_dialog_top.appendChild(ng_types);
ng_dialog_top.appendChild(ng_durations);
ng_dialog_top.appendChild(ng_close_button);
ng_dialog_top.appendChild(ng_onoff_button);
ng_dialog.appendChild(ng_dialog_top);
ng_dialog_middle.appendChild(ng_list);
ng_operation_area.appendChild(view_config);
ng_operation_area.appendChild(enable_keyword_search);
ng_operation_area.appendChild(id_name_cache_duration);
ng_operation_area.appendChild(clear_id_name_cache_button);
ng_operation_area.appendChild(ng_add_delete_buttons);
ng_add_delete_buttons.appendChild(ng_add_button);
ng_add_delete_buttons.appendChild(ng_delete_button);
ng_operation_area.appendChild(ng_import_export_buttons);
ng_import_export_buttons.appendChild(ng_import_button);
ng_import_export_buttons.appendChild(ng_export_button);
ng_dialog_middle.appendChild(ng_operation_area);
ng_dialog.appendChild(ng_dialog_middle);
parent_element.appendChild(ng_dialog);

exception_dialog.appendChild(exception_caption);
exception_dialog.appendChild(exception_text);
exception_dialog.appendChild(exception_close_button);
parent_element.appendChild(exception_dialog);
parent_element.appendChild(exception_url_button);

var ng_list_db = [];
var id_name_list = [];
var id_query_flag = 0;
var view_config_db = {};
var id_name_cache_db = {};
var illust_id_cache_db = {};
loadViewConfig();
loadIdNameCache();
loadNgData();
updateNgList();
loadIllustIdCache();

ng_config_button.onclick = function(){
    ng_dialog.style.display = "flex";
};

exception_url_button.onclick = function(){
    exception_dialog.style.display = "flex";
};

ng_add_button.onclick = function(){
    var ng_target = window.prompt(ng_types.value + "を入力してください", "");
    var ng_duration = ng_durations.value;
    var end_date = new Date();
    if (ng_duration == "設定期間：永久"){
        end_date.setFullYear(4000);
    }else if (ng_duration == "設定期間：1週間"){
        end_date.setDate(end_date.getDate() + 7);
    }else if (ng_duration == "設定期間：1ヶ月間"){
        end_date.setDate(end_date.getDate() + 30);
    }else if (ng_duration == "設定期間：3ヶ月間"){
        end_date.setMonth(end_date.getMonth() + 3);
    }else if (ng_duration == "設定期間：6ヶ月間"){
        end_date.setMonth(end_date.getMonth() + 6);
    }else if (ng_duration == "設定期間：1年間"){
        end_date.setFullYear(end_date.getFullYear() + 1);
    }else if (ng_duration == "設定期間：3年間"){
        end_date.setFullYear(end_date.getFullYear() + 3);
    }

    var opt = document.createElement("option");
    opt.text = formatNgInfo(ng_types.value, dateString(end_date), ng_target);
    var ng_info = { user : ng_target, type : ng_types.value, date : dateString(end_date) };
    ng_list_db.push(ng_info);
    if (ng_types.value == "NGユーザーID"){
        var ng_user_name = getUserName(ng_target);
        if (ng_user_name == null) {
            alert("指定されたIDに該当するユーザ名を取得できず");
            return;
        }
        var id_name_obj = { id : ng_target, name : ng_user_name };
        id_name_list.push(id_name_obj);
    }
    updateNgList();
    saveNgData();
};

ng_delete_button.onclick = function(){
    var ng_info = parseNgInfo(ng_list.value);
    ng_list_db.splice(ngListIndexOf(ng_info.user), 1);
    updateNgList();
    saveNgData();
};

ng_import_button.onclick = function(){
    var open_dlg = document.createElement("input");
    open_dlg.type = "file";
    open_dlg.onchange = (e) => {
        var reader = new FileReader();
        reader.onload = () => {
            var obj = JSON.parse(reader.result);
            ng_list_db = obj.ng_list_db;
            view_config_db = obj.view_config_db;
            saveNgData();
            saveViewConfig();
            location.reload();
        }
        reader.readAsText(e.target.files[0]);
    };
    open_dlg.click();
};

ng_export_button.onclick = function(){
    var a = document.createElement("a");
    var blob = new Blob([JSON.stringify({ng_list_db, view_config_db})], {type: "text/plain"});
    a.href = URL.createObjectURL(blob);
    a.download = "nicovideo_seiga_ng.config";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

ng_onoff_button.onclick = function () {
    if (ng_onoff_button.value == "一時停止"){
        ng_onoff_button.value = "再開";
        ng_config_button.value = "静画NG設定 --一時停止中--";
        ng_config_button.style.backgroundColor = "slategray";
    }else{
        ng_onoff_button.value = "一時停止";
        ng_config_button.value = "静画NG設定 --作動中--";
        ng_config_button.style.backgroundColor = "red";
    }
    view_config_db.state = ng_config_button.value;
    saveViewConfig();
    location.reload();
}

view_config.onchange = function(){
    view_config_db.ng_item_filling =view_config.value;
    saveViewConfig();
}

clear_id_name_cache_button.onclick = function(){
    id_name_cache_db = null;
    saveIdNameChache();
}

enable_keyword_search.onchange = function(){
    view_config_db.at_keyword_search = enable_keyword_search.value;
    saveViewConfig();
}

id_name_cache_duration.onchange = function(){
    view_config_db.id_name_cache_duration = id_name_cache_duration.value;
    saveViewConfig();
}

function dateString(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var toofar = new Date(3000, 11, 31, 23, 59, 59, 999);
    if (date > toofar) return "9999/12/31";
    return year + "/" + month + "/" + day;
}

function formatNgInfo(type, date, user){
    return "[" + type + "]" + date + "まで" + user;
}

function parseNgInfo(nginfo_text){
    var type, date, user;
    type = nginfo_text.substr(1, nginfo_text.indexOf("]") - 1);
    date = nginfo_text.substr(nginfo_text.indexOf("]") + 1, nginfo_text.indexOf("まで") - 1 - nginfo_text.indexOf("]"));
    user = nginfo_text.substr(nginfo_text.indexOf("まで") + "まで".length);
    return { user : user, type : type, date : date };
}

function saveNgData(){
    localStorage.setItem("nicovideo_seiga_ng", JSON.stringify(ng_list_db));
}

function loadNgData(){
    //ブラウザに保存したNGリストデータをロード
    var db = localStorage.getItem("nicovideo_seiga_ng");
    if (db == null){
        ng_list_db = [];
    }else{
        ng_list_db = JSON.parse(localStorage.getItem("nicovideo_seiga_ng"));
    }
    //期限切れのNG指定があったら削除
    var today = new Date();
    for (var i = ng_list_db.length - 1; i >= 0; i--){
        var yy_mm_dd = ng_list_db[i].date.split("/");
        var end_date = new Date(yy_mm_dd[0], yy_mm_dd[1] - 1, yy_mm_dd[2]);
        if (today > end_date){
            ng_list_db.splice(i, 1);
        }
    }

    if (isExceptionURL() == false){
        //ユーザID形式の項目があったら対応するユーザ名を取得
        if (id_query_flag == 0){
            for (var j = 0; j < ng_list_db.length; j++){
                if (ng_list_db[j].type == "NGユーザーID"){
                    var name = (id_name_cache_duration.value == "ID-名前キャッシュ期間：無効") ? null : queryIdNameCache(ng_list_db[j].user);
                    if (name == null){
                        name = getUserName(ng_list_db[j].user);
                        pushIdNameCache(ng_list_db[j].user, name);
                    }
                    var obj = { id : ng_list_db[j].user, name : name };
                    id_name_list.push(obj);
                }
            }
            id_query_flag = 1;
        }
    }
}

function updateNgList(){
    ng_list.innerHTML = "";
    for (var i = 0; i < ng_list_db.length; i++) {
        var opt = document.createElement("option");
        opt.text = formatNgInfo(ng_list_db[i].type, ng_list_db[i].date, ng_list_db[i].user);
        ng_list.appendChild(opt);
    }
}

function loadViewConfig(){
    //ブラウザに保存した表示設定をロード
    var db = localStorage.getItem("nicovideo_seiga_ng_view_config");
    if (db == null){
        view_config_db.ng_item_filling = "削除した枠を：詰める";
        view_config_db.at_keyword_search = "キーワード・定点観測時：無効";
        view_config_db.state = "静画NG設定 --作動中--";
        view_config_db.exceptions = "\/seiga.nicovideo.jp\/seiga\/im\/\n" +
                                    "\/seiga.nicovideo.jp\/my\/clip\/";
        view_config_db.id_name_cache_duration = "ID-名前キャッシュ期間：3ヶ月間"
    }else{
        view_config_db = JSON.parse(db);
        if (view_config_db.ng_item_filling == null) view_config_db.ng_item_filling = "削除した枠を：詰める";
        if (view_config_db.at_keyword_search == null) view_config_db.at_keyword_search = "キーワード・定点観測時：無効";
        if (view_config_db.state == null) view_config_db.state = "静画NG設定 --作動中--";
        if (view_config_db.exceptions == null){
            view_config_db.exceptions = "\/seiga.nicovideo.jp\/my\/clip\/";
        }
        if (view_config_db.id_name_cache_duration == null) view_config_db.id_name_cache_duration = "ID-名前キャッシュ期間：3ヶ月間";
    }
    view_config.value = view_config_db.ng_item_filling;
    enable_keyword_search.value = view_config_db.at_keyword_search;
    ng_config_button.value = view_config_db.state;
    id_name_cache_duration.value = view_config_db.id_name_cache_duration;
    if (ng_config_button.value.match(/静画NG設定 --作動中--/)) {
        ng_config_button.style.backgroundColor = "red";
        ng_onoff_button.value = "一時停止";
    }else{
        ng_config_button.style.backgroundColor = "slategray";
        ng_onoff_button.value = "再開";
    }
    exception_text.value = view_config_db.exceptions;
    if (isExceptionURL()) { ng_config_button.value += "[対象外URL]"; ng_config_button.style.backgroundColor = "slategray"; }
    if (isKeywordException()) { ng_config_button.value += "[キーワード停止中]"; ng_config_button.style.backgroundColor = "slategray"; }
    if (isStationaryMeasureException()) { ng_config_button.value += "[定点観測停止中]"; ng_config_button.style.backgroundColor = "slategray"; }
}

function saveViewConfig(){
    //表示設定をブラウザに保存
    localStorage.setItem("nicovideo_seiga_ng_view_config", JSON.stringify(view_config_db));
}

function loadIdNameCache(){
    //ユーザID・ユーザ名情報のキャッシュをロード
    var db = localStorage.getItem("nicovideo_seiga_ng_user_id_cache");
    if (db == null){
        id_name_cache_db = { items:[] };
        return;
    }else{
        id_name_cache_db = JSON.parse(db);
        if (id_name_cache_db == null){
            id_name_cache_db = { items:[] };
            return;
        }
    }
    //有効期限切れのユーザID・ユーザ名情報があったら削除
    if (view_config_db.id_name_cache_duration != "ID-名前キャッシュ期間：無効"){
        var days_msec;
        if (id_name_cache_duration == "ID-名前キャッシュ期間：3ヶ月間") days_msec = 90 * 8640000;
        else if (id_name_cache_duration == "ID-名前キャッシュ期間：7日間") days_msec = 7 * 8640000;
        else if (id_name_cache_duration == "ID-名前キャッシュ期間：1年間") days_msec = 365 * 8640000;
        var today = new Date();
        for (var i = id_name_cache_db.items.length - 1; i >= 0; i--){
            var yy_mm_dd = id_name_cache_db.items[i].date.split("/");
            var registered_date = new Date(yy_mm_dd[0], yy_mm_dd[1] - 1, yy_mm_dd[2]);
            if ((today.getTime() - registered_date.getTime()) > days_msec) id_name_cache_db.items.splice(i, 1);
        }
    }
}

function pushIdNameCache(user_id, user_name){
    //ユーザIDとユーザ名の組み合わせをキャッシュに追加(5000件まで)
    var MAX = 5000;
    var obj = { user_id: user_id, user_name: user_name, date: dateString(new Date())}
    for (var i = 0; i < id_name_cache_db.items.length; i++){
        //既に登録済みのユーザIDなら更新してリターン
        if (id_name_cache_db.items[i].user_id == user_id){
            id_name_cache_db.items[i].user_name = obj.user_name;
            id_name_cache_db.items[i].date = obj.date;
            return;
        }
    }
    if (id_name_cache_db.items.length < MAX){
        //新規追加
        id_name_cache_db.items.push(obj);
    }else{
        //一番古いレコードを上書きして追加
        id_name_cache_db.items.splice(0, 1);
        id_name_cache_db.items.push(obj);
    }
}

function saveIdNameChache(){
    //ユーザID・ユーザ名情報のキャッシュをブラウザに保存
    localStorage.setItem("nicovideo_seiga_ng_user_id_cache", JSON.stringify(id_name_cache_db));
}

function queryIdNameCache(user_id){
    for (var i = 0; i < id_name_cache_db.items.length; i++){
        if (id_name_cache_db.items[i].user_id == user_id) return id_name_cache_db.items[i].user_name;
    }
    return null;
}

function pushIllustIdCache(illust_id, user_id){
    //静画IDと投稿者の組み合わせを循環配列キャッシュに追加(5000件まで)
    var CYCLE_MAX = 5000;
    for (var i = 0; i < illust_id_cache_db.items.length; i++){
        //既に登録済みの静画IDならリターン
        if (illust_id_cache_db.items[i].illust_id == illust_id) return;
    }
    illust_id_cache_db.cycle_idx = (illust_id_cache_db.cycle_idx++) % CYCLE_MAX;
    if (illust_id_cache_db.items[illust_id_cache_db.cycle_idx] == null){
        //新規追加
        illust_id_cache_db.items.push({ illust_id: illust_id, user_id: user_id});
    }else{
        //一番古いレコードを上書きして追加
        illust_id_cache_db.items[illust_id_cache_db.cycle_idx].illust_id = illust_id;
        illust_id_cache_db.items[illust_id_cache_db.cycle_idx].user_id = user_id;
    }
}

function loadIllustIdCache(){
    //静画IDと投稿者のキャッシュをロード
    var db = localStorage.getItem("nicovideo_seiga_ng_illust_cache");
    if (db == null){
        illust_id_cache_db = { cycle_idx:-1, items:[]};
    }else{
        illust_id_cache_db = JSON.parse(db);
    }
}

function saveIllustIdChache(){
    //静画IDと投稿者のキャッシュをブラウザに保存
    localStorage.setItem("nicovideo_seiga_ng_illust_cache", JSON.stringify(illust_id_cache_db));
}

function isExceptionURL(){
    if (view_config_db.exceptions == null) return false;
    var ex = view_config_db.exceptions.split("\n");
    for (var j = ex.length - 1; j >= 0; j--) if (ex[j] == "") ex.splice(j, 1);
    for (var i = 0; i < ex.length; i++){
        var ex2 = ex[i];
        if (ex[i].startsWith("/")) ex2 = ex[i].substr(1);
        if (ex2.endsWith("/")) ex2 = ex2.substr(0, ex2.length - 1);
        var regex = new RegExp(ex2, "ig");
        if (location.href.match(regex)){
            return true;
        }
    }
    return false;
}

function isKeywordException(){
    if(view_config_db.at_keyword_search != "キーワード・定点観測時：無効") return false;
    return (mode == "キーワード検索");
}

function isStationaryMeasureException(){
    if(view_config_db.at_keyword_search != "キーワード・定点観測時：無効") return false;
    return (mode == "定点観測");
}

function ngListIndexOf(user){
    for(var i = 0; i < ng_list_db.length; i++){
        if (ng_list_db[i].user == user) return i;
    }
    return -1;
}

function requestXml(url){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
	    if(xhr.readyState == 4){
	    	if(xhr.status == 0) alert("XHR 通信失敗");
	    	else{
	    		if((200 <= xhr.status && xhr.status < 300) || (xhr.status == 304));
	    		else alert("その他の応答:" + xhr.status);
	    	}
	    }
    };
    xhr.open("GET", url, false);
    xhr.send(null);
    var resp = xhr.responseXML;
    xhr.abort();
    return resp;
}

function getUserName(id){
    var username_query_url = "https://seiga.nicovideo.jp/api/user/info?id=" + id;
    var xml = requestXml(username_query_url);
    if (xml == null) return null;
    var nickname = xml.documentElement.getElementsByTagName("nickname")[0];
    if (nickname == null) return null;
    return nickname.textContent;
}

function getIllustInfo(id){
    var illustinfo_query_url = "https://seiga.nicovideo.jp/api/illust/info?id=" + id;
    var xml = requestXml(illustinfo_query_url);
    var title = xml.documentElement.getElementsByTagName("title")[0];
    var user_id = xml.documentElement.getElementsByTagName("user_id")[0];
    return {title: (title != null) ? title.textContent : null, user_id: (user_id != null) ? user_id.textContent : null};
}

function checkNgItem(user_names, user_ids, illust_ids, illust_tags){
    var matched = [];
    for (var idx = 0; idx < user_names.length; idx++){
        //NGリストから1件ずつ該非をチェック
        for (var i = 0; i < ng_list_db.length; i++){
            if (ng_list_db[i].type == "NGユーザー名") {
                //NGユーザ名での判定
                if (user_names[idx] != null){
                    //投稿のユーザ名が与えられている場合
                    if (user_names[idx] == ng_list_db[i].user) matched.push(illust_tags[idx]);
                }else{
                    //投稿のユーザ名が与えられていない場合
                    if (user_ids[idx] == null) {
                        user_ids[idx] = getIllustInfo(illust_ids[idx]).user_id;
                        pushIllustIdCache(illust_ids[idx], user_ids[idx]);
                    }
                    user_names[idx] = getUserName(user_ids[idx]);
                    pushIdNameCache(user_ids[idx], user_names[idx]);
                    if (user_names[idx] == ng_list_db[i].user) matched.push(illust_tags[idx]);
                }
            }else if(ng_list_db[i].type == "NGユーザーID"){
                //NGユーザIDでの判定
                if (user_ids[idx] != null){
                    //投稿のユーザIDが与えられている場合
                    if (user_ids[idx] == ng_list_db[i].user) matched.push(illust_tags[idx]);
                }else if (user_names[idx] != null){
                    //投稿のユーザIDの代わりにユーザ名が与えられている場合
                    for (var j = 0; j < id_name_list.length; j++){
                        //NGユーザID→ユーザ名変換リストを検索
                        if (user_names[idx] == id_name_list[j].name){
                            //ユーザ名は一致したが同名の別人の可能性があるので、
                            //静画IDがある場合は、努力範囲でユーザIDを問い合わせる。
                            if (illust_ids[idx] != null){
                                var info = getIllustInfo(illust_ids[idx]);
                                pushIllustIdCache(illust_ids[idx], info.user_id);
                                if ((info == null) || (info.user_id == null)) matched.push(illust_tags[idx]);
                                if (info.user_id == ng_list_db[i].user) matched.push(illust_tags[idx]);
                            }
                            else matched.push(illust_tags[idx]);
                        }
                    }
                }else if (illust_ids[idx] != null){
                    //投稿ユーザIDも投稿ユーザ名も無いが、投稿静画IDが与えられている場合
                    var info2 = getIllustInfo(illust_ids[idx]);
                    pushIllustIdCache(illust_ids[idx], info2.user_id);
                    user_ids[idx] = info2.user_id;
                    if (user_ids[idx] == ng_list_db[i].user) matched.push(illust_tags[idx]);
                }
            }else if(ng_list_db[i].type == "NG静画ID"){
                //NG静画IDでの判定
                if (illust_ids[idx] != null) {
                    if (illust_ids[idx].replace("im", "") == ng_list_db[i].user.replace("im", "")) matched.push(illust_tags[idx]);
                }
            }
        }
    }
    return matched;
}

function parseAndCheckNgItems(mode){
    var ngElement, illust_tags, illust_ids, user_names, user_ids;
    if(isKeywordException() || isStationaryMeasureException()) return [];
    var info = getTagsIdsNames(mode);
    illust_tags = info.tags;
    illust_ids = info.iids;
    user_names = info.names;
    user_ids = info.uids;
    return checkNgItem(user_names, user_ids, illust_ids, illust_tags);
}

function getTagsIdsNames(mode){
    var inner_tags, illust_tags, illust_ids, user_names, user_ids;
    var getCenterImgInnerTags = () => Array.prototype.slice.call(document.getElementsByClassName("center_img_inner "));
    var getUserTags = () => Array.prototype.slice.call(document.getElementsByClassName('user')).filter(elm => (elm.getAttribute("data-bind") == null)).filter(elm2 => (elm2.getAttribute("data-id") == null));
    var getIdsFromMiddle = (tags) => tags.map(elem => elem.href.substring("https://seiga.nicovideo.jp/seiga/im".length, elem.href.indexOf("?")));
    var getIdsFromLast = (tags) => tags.map(elem => elem.href.substr(elem.href.indexOf("/seiga/im") + ("/seiga/im").length));
    var get2ndAncestor = (tags) => tags.map(elem => elem.parentNode.parentNode);
    var get3rdAncestor = (tags) => tags.map(elem => elem.parentNode.parentNode.parentNode);
    var getUserNamesEmpty = (tags) => tags.map(elem => null);
    var getUserNames = (tags) => tags.map(elem => elem.innerHTML);
    var getUserNamesRanking = (tags) => tags.map(elem => {
        var elem2 = elem.getElementsByClassName("rank_txt_user");
        return (elem2.length > 0) ? elem2[0].children[0].textContent : null;
    });
    var getUserIdsEmpty = (tags) => tags.map(elem => null);
    var getUserIdsRanking = (tags) => tags.map(elem => {
        var elem2 = elem.getElementsByClassName("rank_txt_user");
        return (elem2.length > 0) ? elem2[0].children[0].href.substr(elem2[0].children[0].href.lastIndexOf("/") + 1) : null;
    });

    if (mode == "キーワード検索"){
        inner_tags = getCenterImgInnerTags();
        illust_ids = getIdsFromMiddle(inner_tags);
        illust_tags = get2ndAncestor(inner_tags);
        user_names = getUserNamesEmpty(illust_tags);
        user_ids = getUserIdsEmpty(illust_tags);
    }
    else if (mode == "ランキング・まとめ"){
        inner_tags = getCenterImgInnerTags();
        illust_ids = getIdsFromMiddle(inner_tags);
        illust_tags = get3rdAncestor(inner_tags);
        user_names = getUserNamesRanking(illust_tags);
        user_ids = getUserIdsRanking(illust_tags);
    }
    else if (mode == "ランキング・個別"){
        inner_tags = getCenterImgInnerTags();
        illust_ids = getIdsFromMiddle(inner_tags);
        illust_tags = get3rdAncestor(inner_tags);
        user_names = getUserNamesRanking(illust_tags);
        user_ids = getUserIdsRanking(illust_tags);
    }
    else if (mode == "定点観測") {
        inner_tags = getCenterImgInnerTags();
        illust_ids = getIdsFromLast(inner_tags);
        illust_tags = get2ndAncestor(inner_tags);
        user_names = getUserNamesEmpty(illust_tags);
        user_ids = getUserIdsEmpty(illust_tags);
    }
    else if ((mode == "タグ検索") || (mode == "すべてのイラスト")) {
        inner_tags = getUserTags();
        illust_ids = getIdsFromLast(get2ndAncestor(inner_tags));
        illust_tags = get3rdAncestor(inner_tags);
        user_names = getUserNames(inner_tags);
        user_ids = getUserIdsEmpty(illust_tags);
    }
    else if (mode == "投稿ページ") {
        inner_tags = getUserTags();
        illust_ids = getIdsFromLast(get2ndAncestor(inner_tags));
        illust_tags = get3rdAncestor(inner_tags);
        user_names = getUserNames(inner_tags);
        user_ids = getUserIdsEmpty(illust_tags);
    }
    else if (mode == "トップページ") {
        inner_tags = getUserTags();
        illust_ids = getIdsFromLast(get2ndAncestor(inner_tags));
        illust_tags = get3rdAncestor(inner_tags);
        user_names = getUserNames(inner_tags);
        user_ids = getUserIdsEmpty(illust_tags);
    }
    //静画IDキャッシュからユーザIDを補完
    for (var i = 0; i < illust_ids.length; i++){
        if (user_ids[i] != null) continue;
        for (var j = 0; j < illust_id_cache_db.items.length; j++){
            if (illust_id_cache_db.items[j].illust_id == illust_ids[i]) {
                user_ids[i] = illust_id_cache_db.items[j].user_id;
            }
        }
    }
    //有効になっている場合のみ、ユーザIDキャッシュからユーザ名を補完
    if (id_name_cache_duration.value != "ID-名前キャッシュ期間：無効"){
        for (var ii = 0; ii < user_ids.length; ii++){
            if (user_names[ii] != null) continue;
            user_names[ii] = queryIdNameCache(user_ids[ii]);
        }
    }
    return { tags:illust_tags, iids:illust_ids, names:user_names, uids:user_ids };
}

if (ng_config_button.value == "静画NG設定 --一時停止中--") return;
if (isExceptionURL()) return;
var matched_ng_items = parseAndCheckNgItems(mode);
saveIdNameChache();
saveIllustIdChache();
for (i = matched_ng_items.length-1; i >= 0; i--){
    if (mode.match(/ランキング/)){
        //ランキングで詰める機能は未実装
        matched_ng_items[i].style.visibility = 'hidden';
    }
    else if (view_config.value == "削除した枠を：詰める"){
        matched_ng_items[i].remove();
    }else{
        matched_ng_items[i].style.visibility = 'hidden';
    }
}
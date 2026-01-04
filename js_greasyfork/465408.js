// ==UserScript==
// @name         CellmapperExtend for 440-11 Researcher
// @namespace    https://gitlab.com/isogame/cellmapperextend-for-440-11-researcher/
// @version      1.0
// @description  Replace Cellmapper.net's top menu bar with First Seen filters and quick search
// @author       isogame
// @license      MIT
// @match        https://www.cellmapper.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellmapper.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/465408/CellmapperExtend%20for%20440-11%20Researcher.user.js
// @updateURL https://update.greasyfork.org/scripts/465408/CellmapperExtend%20for%20440-11%20Researcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

})();

window.onload = function(){
    //既存の上部メニューバーの項目（Maps～Support）を消す
    document.getElementsByClassName("nav-item")[0].remove();
    document.getElementsByClassName("nav-item")[0].remove();
    document.getElementsByClassName("nav-item")[0].remove();
    document.getElementsByClassName("nav-item")[0].remove();
    document.getElementsByClassName("nav-item")[0].remove();
    document.getElementsByClassName("nav-item")[0].remove();

    //新しいメニューバー項目を定義する

    //[Search]メニューを定義する
    var SearchElement = document.createElement("li");
    SearchElement.id = "X-SearchElement";
    SearchElement.classList.add("nav-item");
    SearchElement.classList.add("nav-link");
    SearchElement.classList.add("nav-linkpage-scroll");
    var SearchChild = document.createElement("i");
    SearchChild.id = "X-SearchChild";
    SearchChild.classList.add("nav-logos");
    SearchChild.classList.add("fas");
    SearchChild.classList.add("fa-search");
    //Cellmapper標準メニューの「Search」のonclickと同じ動作。本当は全部のModalをひっこめてSearchを出す動きのほうがいいんだろうな
    SearchChild.setAttribute('onclick',"toggleModal('modal_searchtools_details')");
    var SearchText = document.createElement("span");
    SearchText.id = "X-SearchText";
    SearchText.setAttribute('style','font-weight: 100; margin-left: 4px;');
    SearchText.innerText = "Search";
    //QuickSearchのテキストフィールドを定義
    var QuickSearchBoxChild = document.createElement("input");
    QuickSearchBoxChild.id = "Xquick_search";
    QuickSearchBoxChild.classList.add("form-control");
    QuickSearchBoxChild.setAttribute('type','tel');
    QuickSearchBoxChild.setAttribute('style','margin-left: 7px; height: 25px; width: 140px; display: inline;');
    QuickSearchBoxChild.placeholder='Quick Search';
    QuickSearchBoxChild.setAttribute('onclick','XRunQuickSearch');
    document.getElementsByClassName("navbar-nav")[0].appendChild(SearchElement);
    document.getElementById("X-SearchElement").appendChild(SearchChild);
    document.getElementById("X-SearchChild").appendChild(SearchText);
    document.getElementById("X-SearchElement").appendChild(QuickSearchBoxChild);
    document.getElementById('Xquick_search').addEventListener('keypress', Xcatchkeypressevt);

    //[Filters]メニューを定義する
    var FilterElement = document.createElement("li");
    FilterElement.id = "X-FilterElement";
    FilterElement.classList.add("nav-item");
    FilterElement.classList.add("nav-link");
    FilterElement.classList.add("nav-logos");
    var FilterChild = document.createElement("i");
    FilterChild.id = "X-FilterChild";
    FilterChild.classList.add("fas");
    FilterChild.classList.add("fa-filter");
    //ここもCellmapper標準のFiltersと同じ
    FilterChild.setAttribute('onclick',"toggleModal('modal_filters_details')");
    var FilterText = document.createElement("span");
    FilterText.id = "X-FilterText";
    FilterText.setAttribute('style','font-weight: 100; margin-left: 4px;');
    FilterText.innerText = "Filters";
    document.getElementsByClassName("navbar-nav")[0].appendChild(FilterElement);
    document.getElementById("X-FilterElement").appendChild(FilterChild);
    document.getElementById("X-FilterChild").appendChild(FilterText);

    //[FirstSeen]メニューを定義
    var QuickFilterElement = document.createElement("li");
    QuickFilterElement.id = "X-QuickFilterElement";
    QuickFilterElement.classList.add("nav-item");
    QuickFilterElement.classList.add("nav-link");
    QuickFilterElement.classList.add("nav-logos");
    var QuickFilterChild = document.createElement("i");
    QuickFilterChild.id = "X-QuickFilterChild";
    QuickFilterChild.classList.add("fas");
    QuickFilterChild.classList.add("fa-magic");
    //fa-history のアイコンにするかどうか迷った
    //https://fontawesome.com/v5/search?p=3&o=r&m=free 「fa-ここのアイコン名」 にすれば大体出てくる（出てこないのもあるっぽい）

    var QuickFilterText = document.createElement("span");
    QuickFilterText.id = "X-FilterText";
    QuickFilterText.setAttribute('style','font-weight: 100; margin-left: 4px;');
    QuickFilterText.innerText = "First Seen";

    //1day
    var qf1dayQuickFilterText = document.createElement("span");
    qf1dayQuickFilterText.id = "X-qf1dayQuickFilterText";
    qf1dayQuickFilterText.classList.add("nav-link");
    qf1dayQuickFilterText.setAttribute('style','display: inline; font-weight: 100; margin-left: 4px; padding-right: 0;');
    //ここの表示名と
    qf1dayQuickFilterText.innerText = "1day";
    //ここの1を変更すれば何日前からでもできる
    qf1dayQuickFilterText.setAttribute('onclick',"XQuickFilter('1')");

    //1week
    var qf1weekQuickFilterText = document.createElement("span");
    qf1weekQuickFilterText.id = "X-qf1weekQuickFilterText";
    qf1weekQuickFilterText.classList.add("nav-link");
    qf1weekQuickFilterText.setAttribute('style','display: inline; font-weight: 100; margin-left: 4px; padding-right: 0;');
    qf1weekQuickFilterText.innerText = "1week";
    qf1weekQuickFilterText.setAttribute('onclick',"XQuickFilter('7')");

    //2week
    var qf2weekQuickFilterText = document.createElement("span");
    qf2weekQuickFilterText.id = "X-qf2weekQuickFilterText";
    qf2weekQuickFilterText.classList.add("nav-link");
    qf2weekQuickFilterText.setAttribute('style','display: inline; font-weight: 100; margin-left: 4px; padding-right: 0;');
    qf2weekQuickFilterText.innerText = "2week";
    qf2weekQuickFilterText.setAttribute('onclick',"XQuickFilter('14')");

    //1month
    var qf1monthQuickFilterText = document.createElement("span");
    qf1monthQuickFilterText.id = "X-qf1monthQuickFilterText";
    qf1monthQuickFilterText.classList.add("nav-link");
    qf1monthQuickFilterText.setAttribute('style','display: inline; font-weight: 100; margin-left: 4px; padding-right: 0;');
    qf1monthQuickFilterText.innerText = "1month";
    qf1monthQuickFilterText.setAttribute('onclick',"XQuickFilter('31')");

    //All　一番右だけpadding-rightはつけてません
    var qfNoneQuickFilterText = document.createElement("span");
    qfNoneQuickFilterText.id = "X-qf1monthQuickFilterText";
    qfNoneQuickFilterText.classList.add("nav-link");
    qfNoneQuickFilterText.setAttribute('style','display: inline; font-weight: 100; margin-left: 4px;');
    qfNoneQuickFilterText.innerText = "All";
    qfNoneQuickFilterText.setAttribute('onclick',"XNoFilter()");

    //上で定義したFirst Seenフィルタをメニューバーに追加
    document.getElementsByClassName("navbar-nav")[0].appendChild(QuickFilterElement);
    document.getElementById("X-QuickFilterElement").appendChild(QuickFilterChild);
    document.getElementById("X-QuickFilterChild").appendChild(QuickFilterText);
    //1day-Allまでの5種類
    document.getElementById("X-QuickFilterChild").appendChild(qf1dayQuickFilterText);
    document.getElementById("X-QuickFilterChild").appendChild(qf1weekQuickFilterText);
    document.getElementById("X-QuickFilterChild").appendChild(qf2weekQuickFilterText);
    document.getElementById("X-QuickFilterChild").appendChild(qf1monthQuickFilterText);
    document.getElementById("X-QuickFilterChild").appendChild(qfNoneQuickFilterText);

    //SignalTrails を無効化
    //当初は toggleTrails(); を呼んでいたが、これでいいことがわかった
    clearLayer("SignalTrails");
    //設定画面上のチェックボックスの状態を実際に合わせる（チェックをはずす）
    document.getElementById('doTrails').checked = false;

    //Show Low Accuracy/Decommissioned Towers をオン
    if ( showOrphans == false ) {
        showOrphans = true;
        refreshTowers();
        //表示を合わせる
        document.getElementById('doLowAccuracy').checked = true;
    }

}

//Quick Searchでキーを押すごとに呼び出される。
window.Xcatchkeypressevt = function(e){
    //押したキーがkey=13(Enterキー)であれば
    if (e.keyCode === 13) {
    	//オリジナルの実装：オリジナルのTower Searchフィールドに値を渡して送信する。Results of tower search of ・・・が出て、そこでeNBをクリックするとジャンプ。
    	//document.getElementById('tower_search').value = document.getElementById('Xquick_search').value;
		//handleTowerSearch();

    	//改造した実装：Results of tower search of ・・・は飛ばしていきなりジャンプする。
		XRunQuickSearch();
	}
		return false;
}

//First Seenフィルタをクリックしたときに呼び出されるもの
window.XQuickFilter = function(d){
    //日付オブジェクト作成
    startDate = new Date();
    startDate.setDate(startDate.getDate() - d);
    //デバッグ用→ startDate = new Date('2023-01-01T00:00:00');
    //フィルタをFirstSeenにする
    //None、FirstSeen、Lastの3種類からFirstSeenを選択
    DateFilterType="FirstSeen";
    //Filters画面の表示を実際にあわせるための仕掛け　動作には関係しない
    document.getElementById('filter_date_type').options[1].selected = true;
    $("#datefrom").datepicker("setDate", startDate.getMonth()+1 + "/" + startDate.getDate() + "/" + startDate.getFullYear());
    //フィルタ実行
    filterDates();
}

window.XNoFilter = function(){
    //None、FirstSeen、Lastの3種類からNoneを選択
    DateFilterType="None";
    //Filters画面の表示を実際にあわせるための仕掛け　動作には関係しない
    document.getElementById('filter_date_type').options[0].selected = true;
    //フィルタ
    filterDates();
}

window.XRunQuickSearch = function(){
    //function handleTowerSearch() { からひっぱってきたコードをはりつける。
    //$.eachのなかに centreMap(t.latitude,t.longitude); を書く
    //bootbox.alert({　～ }) の4行はコメントアウト
    //としていたが、色々書き直して多分問題ない形になった。ような気もする。
    $.ajax({
        type: "GET",
        url: API_URL + "getSite",
        xhrFields: {
            withCredentials: !0
        },
        dataType: "json",
        data: { MCC: MCC, MNC: MNC, Site: $("#Xquick_search").val(), RAT: netType},
        success: function(Xresdata) {
            let Xtowerinfo = handleResponse(Xresdata)
            if (Xtowerinfo.length === 0){
                alert('Tower ID: ' + $("#Xquick_search").val() + ' Not Found...');
            }else{
                //console.log(Xtowerinfo);
                //console.log(Xtowerinfo.length);
                centreMap(Xtowerinfo[0].latitude,Xtowerinfo[0].longitude);
                //ここから本当はTowerをクリックするところまでいきたいけど、getBaseStation(440,11,"Region","SiteID"); を実行する必要があり、上でもらえるJSONにはRegionが入っていないので実行できない。
            }
        }
    })

}
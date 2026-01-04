// ==UserScript==
// @name kakuyomu NG filter safari mobile
// @description カクヨムでのNGフィルタリング機能
// @author rugafo
// @match https://kakuyomu.jp/rankings/*
// @match https://kakuyomu.jp/search*
// @grant GM_addStyle
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @version 0.0.1.20221109063240
// @namespace https://greasyfork.org/users/980830
// @downloadURL https://update.greasyfork.org/scripts/454475/kakuyomu%20NG%20filter%20safari%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/454475/kakuyomu%20NG%20filter%20safari%20mobile.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded",function(){
});

console.log(GM_listValues())


// セーブデータ・読込キー
// 現行
const KAKUYOMU_NG_IDS_KEY = 'kakuyomu_ng_ids';

// セーブデータ・ロード関数
function load_savedata(key) {
    const DATA = GM_getValue(key);
    return DATA ? DATA.split(' ') : [];// 良くない書き方？
}


// セーブデータ・セーブ関数
function save_savedata(key, array) {
    GM_setValue(key, array.join(' '));
}


function delete_savedata(key) {
    switch (key) {
        case KAKUYOMU_NG_IDS_KEY:
            if (window.confirm('NG小説IDを全削除しますか？')) {
                GM_deleteValue(key);
                window.alert('NG小説IDを全削除しました');
            }
            break;

        default:
            break;
    }

}


// ランキング内の小説をノードリストとして所得
var ranking_nodelist = document.querySelectorAll('div.widget-work.float-parent');
var ranked_id_arr = Array.from(document.querySelectorAll('.widget-workCard-titleLabel.bookWalker-work-title') ,a => a.href.substring(26));
//alert(ranking_nodelist.innerhtml)
//console.log(ranked_id_arr);

var ng_novel_ids_array = load_savedata(KAKUYOMU_NG_IDS_KEY);


// スクリプトでNG小説を隠すのに使うCSS要素を作成して追加
GM_addStyle('.censored { display: none; }');


function toggle(num) {
    //var target_classList = ranking_nodelist[num].childNodes[3].classList;
    var target_classList = ranking_nodelist[num].classList;
    var target_id = ranked_id_arr[num];
    if (target_classList.contains('censored')) {
        target_classList.remove('censored');
        ng_novel_ids_array = ng_novel_ids_array.filter(id => id != target_id);
    } else {
        target_classList.add('censored');
        //var bar= ranking_nodelist[num].nextElementSibling
        // bar.classList.add('censored');
        // alert(bar.innerHTML);
        ng_novel_ids_array.push(target_id);

    }
    //console.log('NG小説ID一覧が更新されました。');
    //console.log(ng_novel_ids_array);
    save_savedata(KAKUYOMU_NG_IDS_KEY, ng_novel_ids_array);
}


// NG登録ボタンを↑のリスト個数分つくって配列に追加
var button_array = [];
for (let i = 0; i < ranking_nodelist.length; i++) {
    button_array[i] = document.createElement('button');
    button_array[i].innerText = '非表示';
    button_array[i].addEventListener('click', function () {
        toggle(i);

    });// ループ内関数宣言は駄目らしい? 動いているが…
    ranking_nodelist[i].firstElementChild.appendChild(button_array[i]);
}


// メイン部分。ここどうにかならないものか
// NG小説IDが見つかったとき
if (ng_novel_ids_array.length > 0) {
    console.log('保存されたNG小説IDが見つかりました。');
    console.log(ng_novel_ids_array.join(' '));
    let key_array = ng_novel_ids_array.slice();
    for (let i = 0; i < ranked_id_arr.length; i++) {
        for (let j = 0; j < key_array.length; j++) {

            let soeji = ranked_id_arr.indexOf(key_array[j]);
            if (soeji != -1) {
                //ranking_list_nodelist[soeji].lastElementChild.classList.add('censored');
                ranking_nodelist[soeji].classList.add('censored');
                //var bar= ranking_nodelist[soeji].nextElementSibling
                //bar.classList.add('censored');
                key_array.splice(j, 1);
            }
        }
    }
} else {
    //console.log('保存されたNG小説IDは見つかりませんでした。');
}


// フロートNGメニュー
GM_addStyle('.floated { position: fixed; right: 0; bottom: 0; }')

const FLOAT_NG_MENU = document.createElement('div');
FLOAT_NG_MENU.classList.add('floated');
document.body.appendChild(FLOAT_NG_MENU);
var bottontime=0;
var topline = document.querySelector('.widget-media-genresWorkList-left')
const EXPRESS_SAVE_DATA_BUTTON = document.createElement('button');
EXPRESS_SAVE_DATA_BUTTON.innerText = 'NG一覧';
EXPRESS_SAVE_DATA_BUTTON.addEventListener('click', function () {
    //alert(load_savedata(KAKUYOMU_NG_IDS_KEY));
    if(bottontime == 0){
        bottontime = 1;
        var tear = document.createElement("textarea")
        tear.appendChild(document.createTextNode(load_savedata(KAKUYOMU_NG_IDS_KEY)));
        tear.id = "memoarea";
        tear.setAttribute("rows","4");
        tear.setAttribute("cols","40");
        topline.parentElement.insertBefore(tear,topline.nextSibling);

        var btn = document.createElement("input");
        btn.setAttribute("type","button");
        btn.setAttribute("value","保存");
        tear.parentElement.insertBefore(btn,tear.nextSibling);

        var tojiru = document.createElement("input");
        tojiru.setAttribute("type","button");
        tojiru.setAttribute("value","閉じる");
        btn.parentElement.insertBefore(tojiru,btn.nextSibling);

        btn.addEventListener('click', function () {
            var elem = document.getElementById('memoarea').value;
            ng_novel_ids_array = elem;
            GM_setValue(KAKUYOMU_NG_IDS_KEY, ng_novel_ids_array);
            tear.parentElement.removeChild(tear);
            btn.parentElement.removeChild(btn);
            tojiru.parentElement.removeChild(tojiru);
            bottontime=0;
        });
        tojiru.addEventListener('click', function () {
            tear.parentElement.removeChild(tear);
            btn.parentElement.removeChild(btn);
            tojiru.parentElement.removeChild(tojiru);
            bottontime=0;
        });
    };

});
document.querySelector('.floated').appendChild(EXPRESS_SAVE_DATA_BUTTON);


const DELETE_SAVE_DATA_BUTTON = document.createElement('button');
DELETE_SAVE_DATA_BUTTON.innerText = 'NG全削除';
DELETE_SAVE_DATA_BUTTON.addEventListener('click', function () {
    delete_savedata(KAKUYOMU_NG_IDS_KEY);
    ng_novel_ids_array = load_savedata(KAKUYOMU_NG_IDS_KEY)
});
document.querySelector('.floated').appendChild(DELETE_SAVE_DATA_BUTTON);



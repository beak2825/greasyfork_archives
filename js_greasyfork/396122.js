// ==UserScript==
// @name         Narou Ranking NG
// @namespace    https://greasyfork.org/ja/users/17828-amaicoffee
// @version      1.7
// @description  小説家になろう（厳密には小説を読もう）ランキングでのNGフィルタリング機能を提供
// @author       amaicoffee
// @license      MIT license
// @match        https://yomou.syosetu.com/rank/genrelist/type/*
// @match        https://yomou.syosetu.com/rank/list/type/*
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/396122/Narou%20Ranking%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/396122/Narou%20Ranking%20NG.meta.js
// ==/UserScript==


/*
更新履歴
    v1.7
    予定している新機能追加に向け、機能そのままに手直し。

    v1.6
    ノードの設定ミスで正しく非表示にできていない問題の修正

    ver 1.5
    GM_addStyleを使って短く。
    可読性向上（順序入れ替え、注釈など）

    ver 1.4
    スクリプトの名前をNarou ranking ngからNarou Ranking NGに変更

    ver 1.3
    メニュー作成を目指してとりあえずNGセーブデータのエクスポート機能を実装。
    NGセーブデータボタン横にエクスポートボタンを追加。
    なおこれは暫定的な配置です。良くない配置のUIなのでメニュー実装までのつなぎです。
    エクスポートボタンを押すとコンソールにNGセーブデータが表示されます。
    コンソールはF12を押すことで見られます。後は適宜保存するなどお願いします。
*/


/*
ユーザースクリプトの説明
    注意！このスクリプトはJavaScript練習を兼ねたものです！
    小説を読もう！の「ジャンル別ランキング」「総合ランキング」ページで動作するスクリプトで、
    ランキング内、小説タイトル横に追加する「表示/非表示」ボタンを押すと、その小説はNGに登録され説明文が折りたたまれます。
    NG登録はGM setValueで保存され、ページ遷移に耐えます。
    登録したNGを消す方法は画面右下のフローティングボタン「delete ng data」を押して下さい。
*/


console.log(GM_listValues())


// セーブデータ・読込キー
// 現行
const NAROU_NG_IDS_KEY = 'narou_ng_ids';
/*
// 下記に更新予定
const NG_NOVEL_KEY = 'nrng_novel_ids;
const NG_AUTHOR_KEY = 'nrng_author_ids;
const NG_TAG_KEY = 'nrng_tags;
*/


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
        case NAROU_NG_IDS_KEY:
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
var ranking_list_nodelist = document.querySelectorAll('.ranking_list');


// ランキング内小説ID配列とNG小説ID配列
var ranked_id_arr = Array.from(document.querySelectorAll('.tl'), a => a.href.substring(26, 33));
var ng_novel_ids_array = load_savedata(NAROU_NG_IDS_KEY)


// スクリプトでNG小説を隠すのに使うCSS要素を作成して追加
GM_addStyle('.censored { display: none; }')


function toggle(num) {
    var target_classList = ranking_list_nodelist[num].childNodes[3].classList;
    var target_id = ranked_id_arr[num];
    if (target_classList.contains('censored')) {
        target_classList.remove('censored');
        ng_novel_ids_array = ng_novel_ids_array.filter(id => id != target_id);
    } else {
        target_classList.add('censored');
        ng_novel_ids_array.push(target_id);
    }
    console.log('NG小説ID一覧が更新されました。');
    console.log(ng_novel_ids_array);
    save_savedata(NAROU_NG_IDS_KEY, ng_novel_ids_array);
}


// NG登録ボタンを↑のリスト個数分つくって配列に追加
var button_array = [];
for (let i = 0; i < ranking_list_nodelist.length; i++) {
    button_array[i] = document.createElement('button');
    button_array[i].innerText = '非表示';
    button_array[i].addEventListener('click', function () { toggle(i); });// ループ内関数宣言は駄目らしい? 動いているが…
    ranking_list_nodelist[i].firstElementChild.appendChild(button_array[i]);
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
                ranking_list_nodelist[soeji].lastElementChild.classList.add('censored');
                key_array.splice(j, 1);
            }
        }
    }
} else {
    console.log('保存されたNG小説IDは見つかりませんでした。');
}


// フロートNGメニュー
GM_addStyle('.floated { position: fixed; right: 0; bottom: 0; }')

const FLOAT_NG_MENU = document.createElement('div');
FLOAT_NG_MENU.classList.add('floated');
document.body.appendChild(FLOAT_NG_MENU);


const EXPORT_BUTTON = document.createElement('button');
EXPORT_BUTTON.innerText = 'NGをエクスポート';
EXPORT_BUTTON.addEventListener('click', function () {
    if (ng_novel_ids_array.length > 0) {
        console.log('下記がNG小説ID一覧です。')
        console.log(ng_novel_ids_array.join(' '));
        window.alert('NG小説ID一覧がエクスポートされました。')
    } else {
        window.alert('NG小説IDが見つかりません。')
    }
});
document.querySelector('.floated').appendChild(EXPORT_BUTTON);

function hogehoge() {
    window.alert('hogehoge')
}


const DELETE_SAVE_DATA_BUTTON = document.createElement('button');
DELETE_SAVE_DATA_BUTTON.innerText = 'NG全削除';
DELETE_SAVE_DATA_BUTTON.addEventListener('click', function () { delete_savedata(NAROU_NG_IDS_KEY); });
document.querySelector('.floated').appendChild(DELETE_SAVE_DATA_BUTTON);

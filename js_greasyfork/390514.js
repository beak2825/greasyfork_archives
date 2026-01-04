// ==UserScript==
// @name         AutoSubmissionsSettings.js
// @namespace    AtCoder
// @version      0.2
// @description  すべての提出画面で，指定した言語と結果で検索できるボタンを自動で追加
// @author       Bondo
// @match      https://atcoder.jp/contests/*/submissions
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390514/AutoSubmissionsSettingsjs.user.js
// @updateURL https://update.greasyfork.org/scripts/390514/AutoSubmissionsSettingsjs.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------
//本ソースは一部 https://greasyfork.org/ja/scripts/390424-atcodersubmitsearchsettings/code からお借りしてます

// 検索の設定（langage・status・orderを各自設定する defaultはc++14/AC/提出日時/降順）
var task = "";
var language = "C++14 (GCC 5.4.1)";
var status = "AC";
var user = "";

//Bondo追記
var order = "created"; //ソート指定 defaultは提出日時の降順
var desc = "true";　//昇順にしたい場合 desc = ""にする

/*
    諸々のパラメータ一覧
*/
// 言語とクエリパラメータの対応関係
// （言語のアップデートでこのあたりが変更されるかも？、Twitter等で教えてもらえれば対応します）
var languageValues = {
    '': '',
    'C++14 (GCC 5.4.1)': '3003',
    'Bash (GNU bash v4.3.11)': '3001',
    'C (GCC 5.4.1)': '3002',
    'C (Clang 3.8.0)': '3004',
    'C++14 (Clang 3.8.0)': '3005',
    'C# (Mono 4.6.2.0)': '3006',
    'Clojure (1.8.0)': '3007',
    'Common Lisp (SBCL 1.1.14)': '3008',
    'D (DMD64 v2.070.1)': '3009',
    'D (LDC 0.17.0)': '3010',
    'D (GDC 4.9.4)': '3011',
    'Fortran (gfortran v4.8.4)': '3012',
    'Go (1.6)': '3013',
    'Haskell (GHC 7.10.3)': '3014',
    'Java7 (OpenJDK 1.7.0)': '3015',
    'Java8 (OpenJDK 1.8.0)': '3016',
    'JavaScript (node.js v5.12)': '3017',
    'OCaml (4.02.3)': '3018',
    'Pascal (FPC 2.6.2)': '3019',
    'Perl (v5.18.2)': '3020',
    'PHP (5.6.30)': '3021',
    'Python2 (2.7.6)': '3022',
    'Python3 (3.4.3)': '3023',
    'Ruby (2.3.3)': '3024',
    'Scala (2.11.7)': '3025',
    'Scheme (Gauche 0.9.3.3)': '3026',
    'Text (cat)': '3027',
    'Visual Basic (Mono 4.0.1)': '3028',
    'C++ (GCC 5.4.1)': '3029',
    'C++ (Clang 3.8.0)': '3030',
    'Objective-C (GCC 5.3.0)': '3501',
    'Objective-C (Clang3.8.0)': '3502',
    'Swift (swift-2.2-RELEASE)': '3503',
    'Rust (1.15.1)': '3504',
    'Sed (GNU sed 4.2.2)': '3505',
    'Awk (mawk 1.3.3)': '3506',
    'Brainfuck (bf 20041219)': '3507',
    'Standard ML (MLton 20100608)': '3508',
    'PyPy2 (5.6.0)': '3509',
    'PyPy3 (2.4.0)': '3510',
    'Crystal (0.20.5)': '3511',
    'F# (Mono 4.0)': '3512',
    'Unlambda (0.1.3)': '3513',
    'Lua (5.3.2)': '3514',
    'LuaJIT (2.0.4)': '3515',
    'MoonScript (0.5.0)': '3516',
    'Ceylon (1.2.1)': '3517',
    'Julia (0.5.0)': '3518',
    'Octave (4.0.2)': '3519',
    'Nim (0.13.0)': '3520',
    'TypeScript (2.1.6)': '3521',
    'Perl6 (rakudo-star 2016.01)': '3522',
    'Kotlin (1.0.0)': '3523',
    'PHP7 (7.0.15)': '3524',
    'COBOL - Fixed (OpenCOBOL 1.1.0)': '3525',
    'COBOL - Free (OpenCOBOL 1.1.0)': '3526'
};

// 結果のステータス一覧
var statusList = ['', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'QLE', 'OLE', 'IE', 'WJ', 'WR', 'Judging'];

//検索結果のソート指定
var orderBy = ['', 'created', 'score', 'source_length', 'time_consumption', 'memory_consumption'];
//検索結果を昇順にするか降順にするか trueなら降順
var descOption = ['', 'true'];

//---------------------------------------------------------------------------------------


$(document).on("click", ".add-btn", function () {
    //問題名を取得 ex) abs141_a
    var problem = $(this).text();
    //問題名のoptionを有効（選択状態）にする
    $("#select-task option[value=" + problem + "]").prop('selected', true);

    //検索結果表示用のURL
    var baseURL = location.href;
    var queryParameters = `f.Task=${problem}&f.Language=${languageValues[language]}&f.Status=${status}&f.User=${user}&orderBy=${order}`;
    if(desc == '') queryParameters = '?' + queryParameters;
    else queryParameters = '?desc=true&' + queryParameters;
    var newURL = baseURL + queryParameters;

    //検索結果ページを表示
    window.location.href = newURL;
});


$(function(){
    // クエリパラメータが有効か確認
    var messages = [];
    if (!(language in languageValues)) {
        messages.push(`Language: ${language} doesn't exists!`);
    }
    if (statusList.indexOf(status) < 0) {
        messages.push(`Status: ${status} doesn't exists!`);
    }
    if (orderBy.indexOf(order) < 0) {
        messages.push(`OrderBy: ${order} doesn't exists!`);
    }
    if (descOption.indexOf(desc) < 0) {
        messages.push(`DescOption: ${desc} doesn't exists!`);
    }
    if (messages.length > 0) {
        alert(messages.join('\n'));
        return;
    }

    //指定した言語を選択
    var selectLanguage = languageValues[language];
    $("#select-language option[value=" + selectLanguage+ "]").prop('selected', true);
    //指定した提出結果を選択
    $("#select-status option[value=" + status + "]").prop('selected', true);
    //問題を取得
    var problems = $('#select-task').children();

    //問題ごとにボタンを作成 i==0は何も入っていないのでcontinue
    for(var i=0;i<problems.length;i++){
        if(i == 0) continue;
        var problem = problems.eq(i).val()
        $('form').append('<button type="button" class="add-btn">' + problem + '</button>');
    }
});
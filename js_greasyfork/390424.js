// ==UserScript==
// @name         AtCoderSubmitSearchSettings
// @namespace    https://github.com/refine-P
// @version      1.1.1
// @description  add default settings for submit search
// @author       fine
// @license      MIT
// @include      https://atcoder.jp/contests/*/submissions*
// @downloadURL https://update.greasyfork.org/scripts/390424/AtCoderSubmitSearchSettings.user.js
// @updateURL https://update.greasyfork.org/scripts/390424/AtCoderSubmitSearchSettings.meta.js
// ==/UserScript==
"use strict";

/*
    使うときは検索の設定を変更してください
    下にパラメータの一覧があるので参考にしてください
*/

// 検索の設定
// var task = "";
var language = "C++ (GCC 9.2.1)";
var status = "AC";
var user = "";
var order = ""; // ソート基準、詳しくは下に
var desc = false; // trueで降順にする
var enableOldVersionLanguage = true; // 古いバージョンの言語の提出を検索可能にする
var enableSearchWithDefaultSetting = true; // 「デフォルト設定で検索」 を有効に

/*
    諸々のパラメータ一覧
*/

// 言語とクエリパラメータの対応関係
// （言語のアップデートでこのあたりが変更されるかも？、Twitter等で教えてもらえれば対応します）

// 最新バージョン
var languageValuesLatest = {
    "": "",
    "C (GCC 9.2.1)": "4001",
    "C (Clang 10.0.0)": "4002",
    "C++ (GCC 9.2.1)": "4003",
    "C++ (Clang 10.0.0)": "4004",
    "Java (OpenJDK 11.0.6)": "4005",
    "Python (3.8.2)": "4006",
    "Bash (5.0.11)": "4007",
    "bc (1.07.1)": "4008",
    "Awk (GNU Awk 4.1.4)": "4009",
    "C# (.NET Core 3.1.201)": "4010",
    "C# (Mono-mcs 6.8.0.105)": "4011",
    "C# (Mono-csc 3.5.0)": "4012",
    "Clojure (1.10.1.536)": "4013",
    "Crystal (0.33.0)": "4014",
    "D (DMD 2.091.0)": "4015",
    "D (GDC 9.2.1)": "4016",
    "D (LDC 1.20.1)": "4017",
    "Dart (2.7.2)": "4018",
    "dc (1.4.1)": "4019",
    "Erlang (22.3)": "4020",
    "Elixir (1.10.2)": "4021",
    "F# (.NET Core 3.1.201)": "4022",
    "F# (Mono 10.2.3)": "4023",
    "Forth (gforth 0.7.3)": "4024",
    "Fortran(GNU Fortran 9.2.1)": "4025",
    "Go (1.14.1)": "4026",
    "Haskell (GHC 8.8.3)": "4027",
    "Haxe (4.0.3); js": "4028",
    "Haxe (4.0.3); Java": "4029",
    "JavaScript (Node.js 12.16.1)": "4030",
    "Julia (1.4.0)": "4031",
    "Kotlin (1.3.71)": "4032",
    "Lua (Lua 5.3.5)": "4033",
    "Lua (LuaJIT 2.1.0)": "4034",
    "Dash (0.5.8)": "4035",
    "Nim (1.0.6)": "4036",
    "Objective-C (Clang 10.0.0)": "4037",
    "Common Lisp (SBCL 2.0.3)": "4038",
    "OCaml (4.10.0)": "4039",
    "Octave (5.2.0)": "4040",
    "Pascal (FPC 3.0.4)": "4041",
    "Perl (5.26.1)": "4042",
    "Raku (Rakudo 2020.02.1)": "4043",
    "PHP (7.4.4)": "4044",
    "Prolog (SWI-Prolog 8.0.3)": "4045",
    "PyPy2 (7.3.0)": "4046",
    "PyPy3 (7.3.0)": "4047",
    "Racket (7.6)": "4048",
    "Ruby (2.7.1)": "4049",
    "Rust (1.42.0)": "4050",
    "Scala (2.13.1)": "4051",
    "Java (OpenJDK 1.8.0)": "4052",
    "Scheme (Gauche 0.9.9)": "4053",
    "Standard ML (MLton 20130715)": "4054",
    "Swift (5.2.1)": "4055",
    "Text (cat 8.28)": "4056",
    "TypeScript (3.8)": "4057",
    "Visual Basic (.NET Core 3.1.101)": "4058",
    "Zsh (5.4.2)": "4059",
    "COBOL - Fixed (OpenCOBOL 1.1.0)": "4060",
    "COBOL - Free (OpenCOBOL 1.1.0)": "4061",
    "Brainfuck (bf 20041219)": "4062",
    "Ada2012 (GNAT 9.2.1)": "4063",
    "Unlambda (2.0.0)": "4064",
    "Cython (0.29.16)": "4065",
    "Sed (4.4)": "4066",
    "Vim (8.2.0460)": "4067"
};

// 古いバージョン
var languageValuesOld = {
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

// 何を基準にソートするか
var orderValues = {
    "": "",
    "提出日時": "created",
    "得点": "score",
    "コード長": "source_length",
    "実行時間": "time_consumption",
    "メモリ": "memory_consumption"
};


/*
    提出の検索の設定を反映
*/
$(function(){
    // 言語とクエリパラメータの対応関係の構築
    var languageValues;
    // https://qiita.com/kou_pg_0131/items/16c63879be55b85387aa
    if (enableOldVersionLanguage) {
        languageValues = {...languageValuesLatest, ...languageValuesOld};
    } else {
        languageValues = {...languageValuesLatest};
    }

    // 古いバージョンの言語の提出を検索可能にする場合
    // 言語選択の欄に古いバージョンの言語を追加する
    if (enableOldVersionLanguage) {
        var selectLanguage = document.getElementById('select-language');
        for (var lang in languageValuesOld) {
            if (!lang) continue;
            var langOption = document.createElement('option');
            langOption.innerText = lang;
            langOption.value = languageValuesOld[lang];
            selectLanguage.insertAdjacentElement('beforeend', langOption);
        }
    }

    if (!enableSearchWithDefaultSetting) return;

    // クエリパラメータが有効か確認
    var messages = [];
    if (!(language in languageValues)) {
        messages.push(`Language: ${language} doesn't exists!`);
    }
    if (statusList.indexOf(status) < 0) {
        messages.push(`Status: ${status} doesn't exists!`);
    }
    if (!(order in orderValues)) {
        messages.push(`OrderBy: ${order} doesn't exists!`);
    }
    if (messages.length > 0) {
        alert(messages.join('\n'));
        return;
    }

    // ボタンの配置がゴミ過ぎるので、誰か良い感じにする方法あったら教えてください...
    $('.form-group:last').append('<div><button type="submit" class="btn btn-primary btn-sm">デフォルト設定で検索</button></div>');
    var target_button = $('.form-group:last div:last button')
    target_button.css('margin', '2px 0');

    // 吹き出し: https://blog.shuffleee.com/2666/
    target_button.attr('data-toggle', 'popover');
    target_button.attr('data-placement', 'top');
    target_button.attr('data-content', `<table class="table"><thead><th colspan="2" style="text-align:center">Default Settings</th></thead><tbody><tr><th>Language</th><td>${language}</td></tr><tr><th>Status</th><td>${status}</td></tr><th>User</th><td>${user}</td></tr><th>OrderBy</th><td>${order} (desc: ${desc})</td></tbody></table>`)
    target_button.popover({
        trigger: 'hover', // click,hover,focus,manualを選択出来る
        html: true,
    });

    target_button.click(function(e){
        e.preventDefault();

        // 問題は後から選ぶはずなのでこのタイミングで取得
        var task = $('#select-task').val();

        // クエリパラメータを追加
        var baseURL = location.href.split('?')[0];
        var queryParameters = `?f.Task=${task}&f.Language=${languageValues[language]}&f.Status=${status}&f.User=${user}&orderBy=${orderValues[order]}&desc=${desc}`;
        var newURL = baseURL + queryParameters;

        window.location.href = newURL;
    });
});
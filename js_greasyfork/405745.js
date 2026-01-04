// ==UserScript==
// @name         ac-search-old-languages
// @namespace    http://github.com/rsk0315
// @version      0.1.2
// @description  judge-update-202004 以前の言語を検索できるようにします。
// @author       rsk0315
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405745/ac-search-old-languages.user.js
// @updateURL https://update.greasyfork.org/scripts/405745/ac-search-old-languages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 公式で対応されたので余計なことはしないようにします。
    // 言語 ID の表があるとうれしい人がいるかもしれないので
    // 一応残しておきます。
    return;

    const LANGUAGES = [
        ['C++14 (GCC 5.4.1)', 3003],
        ['C++14 (Clang 3.8.0)', 3005],
        ['C++ (GCC 5.4.1)', 3029],
        ['C++ (Clang 3.8.0)', 3030],
        ['Bash (GNU bash v4.3.11)', 3001],
        ['C (GCC 5.4.1)', 3002],
        ['C (Clang 3.8.0)', 3004],
        ['C# (Mono 4.6.2.0)', 3006],
        ['Clojure (1.8.0)', 3007],
        ['Common Lisp (SBCL 1.1.14)', 3008],
        ['D (DMD64 v2.070.1)', 3009],
        ['D (LDC 0.17.0)', 3010],
        ['D (GDC 4.9.4)', 3011],
        ['Fortran (gfortran v4.8.4)', 3012],
        ['Go (1.6)', 3013],
        ['Haskell (GHC 7.10.3)', 3014],
        ['Java7 (OpenJDK 1.7.0)', 3015],
        ['Java8 (OpenJDK 1.8.0)', 3016],
        ['JavaScript (node.js v5.12)', 3017],
        ['OCaml (4.02.3)', 3018],
        ['Pascal (FPC 2.6.2)', 3019],
        ['Perl (v5.18.2)', 3020],
        ['Perl6 (rakudo-star 2016.01)', 3522],
        ['PHP (5.6.30)', 3021],
        ['PHP7 (7.0.15)', 3524],
        ['Python2 (2.7.6)', 3022],
        ['Python3 (3.4.3)', 3023],
        ['PyPy2 (5.6.0)', 3509],
        ['PyPy3 (2.4.0)', 3510],
        ['Ruby (2.3.3)', 3024],
        ['Scala (2.11.7)', 3025],
        ['Scheme (Gauche 0.9.3.3)', 3026],
        ['Text (cat)', 3027],
        ['Visual Basic (Mono 4.0.1)', 3028],
        ['Objective-C (GCC 5.3.0)', 3501],
        ['Objective-C (Clang 3.8.0)', 3502],
        ['Octave (4.0.2)', 3519],
        ['Swift (swift-2.2-RELEASE)', 3503],
        ['Rust (1.15.1)', 3504],
        ['Sed (GNU sed 4.2.2)', 3505],
        ['Awk (mawk 1.3.3)', 3506],
        ['Brainfuck (bf 20041219)', 3507],
        ['Standard ML (MLton 20100608)', 3508],
        ['Crystal (0.20.5)', 3511],
        ['F# (Mono 4.0)', 3512],
        ['Unlambda (0.1.3)', 3513],
        ['Lua (5.3.2)', 3514],
        ['LuaJIT (2.0.4)', 3515],
        ['MoonScript (0.5.0)', 3516],
        ['Ceylon (1.2.1)', 3517],
        ['Julia (0.5.0)', 3518],
        ['Nim (0.13.0)', 3520],
        ['TypeScript (2.1.6)', 3521],
        ['Kotlin (1.0.0)', 3523],
        ['COBOL - Fixed (OpenCOBOL 1.1.0)', 3525],
        ['COBOL - Free (OpenCOBOL 1.1.0)', 3526],
    ];

    for (let el of LANGUAGES) {
        $('#select-language').append(`<option value="${el[1]}">${el[0]} (旧)<\/option>`);
    }

    let match = location.href.match(/f\.Language=(\d+)/);
    let curLangId = match && match[1];
    if (curLangId !== null) {
        $('#select-language').val([curLangId]).change();
    }
})();
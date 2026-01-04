// ==UserScript==
// @name         Auto Select CF Language
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Auto selects the language based on file extension, when you upload a file
// @author       Mushfiqur Rahman Talha
// @match        *codeforces.com/contest/*/problem/*
// @match        *codeforces.com/problemset/problem/*
// @match        *mirror.codeforces.com/contest/*/problem/*
// @match        *mirror.codeforces.com/problemset/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/503488/Auto%20Select%20CF%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/503488/Auto%20Select%20CF%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    Language Support:
     - GNU GCC C11 5.1.0
     - GNU G++23 14.2 (64 bit, msys2)
     - C# 10, .NET SDK 6.0
     - D DMD32 v2.105.0
     - Go 1.22.2
     - Java 21 64bit
     - Kotlin 1.9.21
     - OCaml 4.02.1
     - PHP 8.1.7
     - PyPy 3.10 (7.3.15, 64bit)
     - Ruby 3.2.2
     - Rust 1.75.0 (2021)
     - Node.js 15.8.0 (64bit)
    */
    const fileInput = document.querySelector("input[name=sourceFile]");

    const languageId = {
        // C++
        "cpp" : 91,
        "cc"  : 91,
        "cxx" : 91,
        "c++" : 91,
        "cp"  : 91,
        
        // C
        "c"   : 43,
        
        // Java
        "java": 87,
        
        // Python
        "py"  : 70,
        "pyw" : 70,
        "py3" : 70,
        
        // C#
        "cs"  : 79,
        
        // JavaScript
        "js"  : 55,
        "mjs" : 55,
        
        // D
        "d"   : 28,
        
        // Go
        "go"  : 32,
        
        // Kotlin
        "kt"  : 88,
        "kts" : 88,
        
        // OCaml
        "ml"  : 19,
        "mli" : 19,
        
        // PHP
        "php" : 6,
        "php3": 6,
        "php4": 6,
        "php5": 6,
        "phtml": 6,
        
        // Ruby
        "rb"  : 67,
        "rbw" : 67,
        
        // Rust
        "rs"  : 75,
    };

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        let optionValue = languageId[ext] || 91; // Default to C++ if extension not found

        document.querySelectorAll("option").forEach(element => element.removeAttribute("selected"));
        document.querySelector(`option[value='${optionValue}']`).setAttribute("selected", "selected");
    });
})();

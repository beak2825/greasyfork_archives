// ==UserScript==
// @name         AtCoderProblemLinks
// @namespace    https://github.com/hotarunx
// @version      0.1
// @description  Add Links to Problems in AtCoder.
// @author       hotarunx
// @match        https://atcoder.jp/contests/*
// @match        https://atcoder.jp/contests/*/*
// @match        https://atcoder.jp/contests/*/*/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
//
// Copyright(c) 2020 hotarunx
// This software is released under the MIT License, see LICENSE.
//
// @downloadURL https://update.greasyfork.org/scripts/397186/AtCoderProblemLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/397186/AtCoderProblemLinks.meta.js
// ==/UserScript==

const lower_alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const upper_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const problems = 6;

(function () {
    // get contest name
    const element = document.querySelector('.contest-title');
    const href = element.getAttribute('href'); // "/contests/abcXXX"
    const ct = href.replace("/contests/", ""); // "abcXXX"
    const url = "/contests/" + ct + "/tasks/" + ct + '_';

    // add links
    for (let i = 0; i < problems; i++) {
        $(".nav-tabs").append('<li><a href=' + url + lower_alphabet[i] + '>' + upper_alphabet[i] + '</a></li>');
    }
})();

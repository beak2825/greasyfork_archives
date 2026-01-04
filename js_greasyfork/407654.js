// ==UserScript==
// @name         考试资料网自动显示答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Longm
// @match           *://www.ppkao.com/tiku/shiti/*
// @match           *://www.ppkao.com/kaoti/*
// @include         *://www.ppkao.com/tiku/shiti/*
// @include         *://www.ppkao.com/shiti/*
// @include         *://www.ppkao.com/kaoti/*
// @include         *://www.ppkao.com/daan/*
// @downloadURL https://update.greasyfork.org/scripts/407654/%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/407654/%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    window.location.href =document.querySelector("a.answer").onclick.toString().split("ViewAnswers('")[1].split("','")[0];
})();
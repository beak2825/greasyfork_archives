// ==UserScript==
// @name           升学 E 网通 (EWT360) 试题分析获取 - Beta
// @name:en        EWT Exam Analyse Getter - Beta
// @namespace      https://ewt.houtar.eu.org/examanswer
// @version        0.1.0
// @description    此脚本在 EWT 试题中获取试题分析。
// @description:en This script gets exam answer analysis in EWT exam.
// @author         Houtar
// @match          https://web.ewt360.com/mystudy/
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ewt360.com
// @grant          none
// @license        GNU General Public License
// @downloadURL https://update.greasyfork.org/scripts/448799/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E9%A2%98%E5%88%86%E6%9E%90%E8%8E%B7%E5%8F%96%20-%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/448799/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E9%A2%98%E5%88%86%E6%9E%90%E8%8E%B7%E5%8F%96%20-%20Beta.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (!document.location.hash.includes("exam/answer")) {
        return;
    }

    fetch(
        "https://web.ewt360.com/customerApi/api/studyprod/web/answer/paper" +
        document.location.hash.slice(13)
    ).then(function (p) {
        return p.json();
    }).then(function (d) {
        var a = "";
        d = d.data.questions;

        for (var t in d) {
            var n = parseInt(t, 10) + 1;
            var cq = d[t].childQuestions;

            if (cq[0]) {
                for (var c in cq) {
                    var cn = parseInt(c, 10) + 1;
                    var ca = cq[c].analyse;
                    a += "<h4>" + n + "." + cn + ": </h4>" + ca + "<br>";
                }
            } else {
                a += "<h4>" + n + ": </h4>" + d[t].analyse + "<br>";
            }
        }

        var nw = window.open("", "_blank", "popup");

        if (nw) {
            nw.document.body.innerHTML = a;
        } else {
            window.alert(
                "The window wasn't allowed to open\nThis is likely caused by built-in popup blockers."
            );
        }
    });
})();

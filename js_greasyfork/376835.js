// ==UserScript==
// @name         aoj-link-beta
// @namespace    https://greasyfork.org/ja/users/240280-tama
// @version      1.0
// @description  旧AOJの問題ページにBeta版へのリンクを追加する
// @author       Tama
// @license      MIT
// @match        http://judge.u-aizu.ac.jp/onlinejudge/description.jsp*
// @downloadURL https://update.greasyfork.org/scripts/376835/aoj-link-beta.user.js
// @updateURL https://update.greasyfork.org/scripts/376835/aoj-link-beta.meta.js
// ==/UserScript==

var wrapper = document.getElementById("pageinfo").getElementsByClassName("wrapper");
var id = location.href.split("id=")[1].split("&")[0];
if(wrapper !== null && id !== null) {
    var div = document.createElement("div");
    div.className = "text";
    var a = document.createElement("a");
    a.href = "https://onlinejudge.u-aizu.ac.jp/challenges/search/titles/" + id;
    a.textContent = "Beta version";
    div.appendChild(a);
    wrapper[0].appendChild(div);
}
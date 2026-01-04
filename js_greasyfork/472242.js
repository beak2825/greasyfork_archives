// ==UserScript==
// @name         AtCoder Standings Excluding Unrated User
// @namespace    https://hals.one/
// @version      0.2.2
// @description  AtCoderの順位表から参加登録していないユーザを隠すスクリプトです。
// @author       HalsSC
// @match        https://atcoder.jp/contests/*/standings
// @exclude      https://atcoder.jp/contests/*/standings/json
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472242/AtCoder%20Standings%20Excluding%20Unrated%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/472242/AtCoder%20Standings%20Excluding%20Unrated%20User.meta.js
// ==/UserScript==

const delay = 1000;

// 順位表の中で参加登録していないユーザの行を見つけ、hidden属性をtrueにする関数
function hidden_unrated(){
    setTimeout((function(){
    const unrated_users = document.querySelectorAll("td.standings-rank");
    console.log(unrated_users);
    unrated_users.forEach(function(user) {
        let element = user;
        if (element.innerHTML !== "-"){ return; } // 参加者はスキップ
        while (element && element.tagName !== "TR") {
            element = element.parentElement;
        }
        // FAに垢消しが含まれるとFA欄まで消えちゃう
        if(element && element.className !== "standings-fa"){
            element.hidden = true;
        }
    });
    }), delay);
}

// 「お気に入りのみ表示」にclickアクションとしてhidden_unrated関数を登録する関数
function set_onclick(){
    setTimeout((function(){
        const button = document.getElementById("checkbox-fav-only");
        button.addEventListener("click", hidden_unrated);
    }), delay);
}

// メイン関数
(function(){
    hidden_unrated();
    set_onclick();
})();
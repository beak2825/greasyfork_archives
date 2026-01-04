// ==UserScript==
// @name         AtCoderRecentGraph
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  レーティンググラフを最近のだけにするボタンを追加
// @author       merom686
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418562/AtCoderRecentGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/418562/AtCoderRecentGraph.meta.js
// ==/UserScript==

(function(){
    if (typeof rating_history === 'undefined' || rating_history.length < 2) return;
    let rating_history_original = rating_history;
    let k = Math.min(64, Math.ceil(rating_history.length / 2));

    let button = document.createElement('button');
    button.className = 'btn btn-default';
    button.innerText = 'recent';
    button.onclick = () => {
        if (rating_history.length == k) {
            rating_history = rating_history_original;
        } else {
            rating_history = rating_history.slice(-k);
        }
        const e = new CustomEvent('load');
        window.dispatchEvent(e);
    };
    let a = document.getElementById('rating-graph-expand');
    a.parentNode.insertBefore(button, a.nextSibling);
})();
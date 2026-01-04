// ==UserScript==
// @name     atcoder_all_open
// @namespace jp.misw
// @author hotman
// @description 問題Tabの隣に全ての問題を（ワンクリックで）開く全ての問題Tabを作成します。うまく動かない場合はatcoder上でのポップアップ制限を外して下さい
// @version  1.0.9
// @include  https://atcoder.jp/contests/*
// @exclude  https://atcoder.jp/contests/
// @exclude  https://atcoder.jp/contests/archive
// @grant    none
// @description 問題Tabの隣に全ての問題を（ワンクリックで）開く全ての問題Tabを作成します。うまく動かない場合はatcoder上でのポップアップ制限を外して下さい
// @downloadURL https://update.greasyfork.org/scripts/387471/atcoder_all_open.user.js
// @updateURL https://update.greasyfork.org/scripts/387471/atcoder_all_open.meta.js
// ==/UserScript==


(() => {
    'use strict';
    const toURL = (flag = false) => {
        let url = location.href;
        let test_name = location.href.split('/')[4];
        if (flag === true || url.match(/atcoder.jp\/contests\/..*\/tasks$/) != null) {
            let table = document.getElementsByClassName("table table-bordered table-striped")[0].children[1];
            // 暴発防止のため、20問以上は読み込まない
            let cnt = Math.min(table.childElementCount, 20);
            for (let i = 0; i < cnt; i++) {
                let link = table.children[i].querySelector("a");
                window.open(link.href);
            }
        } else {
            window.open('https://atcoder.jp/contests/' + test_name + '/tasks\/?all_open=yes');
        }
    }

    const all_open = () => {
        var url = location.href;
        console.log(url);
        if (url.match(/all_open=yes/) != null) {
            toURL(true);
            window.open('about:blank', '_self').close();
        } else {
            let parent = document.getElementsByClassName("nav nav-tabs")[0];
            let add = document.createElement("li");
            parent.insertBefore(add, parent.children[2]);
            let a = document.createElement("a");
            add.appendChild(a);
            a.textContent = "全ての問題";
            a.setAttribute("href", "javascript:void(0);");
            a.addEventListener('click', toURL, false);
        }
    }
    all_open();
})();
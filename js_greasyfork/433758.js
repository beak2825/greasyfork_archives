// ==UserScript==
// @name            ニコニコ動画の検索のソート選択を表にする
// @namespace       rinsuki.net
// @version         1.0
// @description     ニコニコ動画の検索のソート順を選ぶところを表レイアウトにします。
// @author          rinsuki
// @match           https://www.nicovideo.jp/tag/*
// @match           https://www.nicovideo.jp/search/*
// @contributionURL https://rinsuki.fanbox.cc/
// @contributionURL https://github.com/sponsors/rinsuki
// @homepageURL     https://github.com/rinsuki/userscripts
// @supportURL      https://github.com/rinsuki/userscripts/issues
// @require         https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js#sha256-2Unxw2h67a3O2shSYYZfKbF80nOZfn9rK/xTsvnUxN0=,sha512-QVs8Lo43F9lSuBykadDb0oSXDL/BbZ588urWVCRwSIoewQv/Ewg1f84mK3U790bZ0FfhFa1YSQUmIhG+pIRKeg==
// @require         https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js#sha256-NfT5dPSyvNRNpzljNH+JUuNB+DkJ5EmCJ9Tia5j2bw0=,sha512-6a1107rTlA4gYpgHAqbwLAtxmWipBdJFcq8y5S/aTge3Bp+VAklABm2LO+Kg51vOWR9JMZq1Ovjl5tpluNpTeQ==
// @downloadURL https://update.greasyfork.org/scripts/433758/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%81%AE%E3%82%BD%E3%83%BC%E3%83%88%E9%81%B8%E6%8A%9E%E3%82%92%E8%A1%A8%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433758/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%81%AE%E3%82%BD%E3%83%BC%E3%83%88%E9%81%B8%E6%8A%9E%E3%82%92%E8%A1%A8%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sort = document.querySelector(".searchOption .sort.optionList");
    sort.style.width = "220px";
    const originalSortList = sort.querySelector(".sortList");
    const links = {};
    for (const anchor of originalSortList.querySelectorAll("a")) {
        const sp = new URLSearchParams(anchor.search);
        const key = `${sp.get("sort")}:${sp.get("order")}`;
        links[key] = [anchor.href, anchor.parentElement.classList.contains("active"), anchor];
    }
    const Link = props => {
        let l = links[props.k];
        if (l == null) {
            originalSortList.querySelector("li.active")?.remove();
            return React.createElement("a", { style: { padding: "4px", color: "#fff", background: "#999" }, className: "active" }, props.children);
        }
        else {
            l[2].parentElement?.remove();
            return React.createElement("a", { href: l[0], style: { padding: "4px" } }, props.children);
        }
    };
    const Row = props => {
        return React.createElement("tr", null,
            React.createElement("td", { style: { textAlign: "right", padding: "4px" } },
                props.title,
                "が"),
            React.createElement("td", null,
                React.createElement(Link, { k: props.k + ":d" },
                    props.desc,
                    "順")),
            React.createElement("td", null,
                React.createElement(Link, { k: props.k + ":a" },
                    props.asc,
                    "順")));
    };
    const li = document.createElement("li");
    ReactDOM.render(React.createElement("table", null,
        React.createElement(Row, { title: "投稿日時", k: "f", desc: "新しい", asc: "古い" }),
        React.createElement(Row, { title: "再生数", k: "v", desc: "多い", asc: "少ない" }),
        React.createElement(Row, { title: "コメント数", k: "r", desc: "多い", asc: "少ない" }),
        React.createElement(Row, { title: "いいね数", k: "likeCount", desc: "多い", asc: "少ない" }),
        React.createElement(Row, { title: "マイリスト数", k: "m", desc: "多い", asc: "少ない" }),
        React.createElement(Row, { title: "コメント", k: "n", desc: "新しい", asc: "古い" }),
        React.createElement(Row, { title: "再生時間", k: "l", desc: "長い", asc: "短い" })), li);
    originalSortList.appendChild(li);

})();

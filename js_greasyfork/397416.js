// ==UserScript==
// @name         Qiita通知ユーザーリンク
// @version      0.1
// @description  Qiitaの通知でいいねやストックしたユーザのプロフィールへのリンクを作り、どんなユーザにいいねされたのか確認しやすくする。
// @author       fukuchan
// @match        https://qiita.com/notifications*
// @grant        none
// @namespace https://greasyfork.org/users/432749
// @downloadURL https://update.greasyfork.org/scripts/397416/Qiita%E9%80%9A%E7%9F%A5%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/397416/Qiita%E9%80%9A%E7%9F%A5%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%AF.meta.js
// ==/UserScript==

// クリックされた時にリンクを開くメソッド
const handleClick = e => {
    e.preventDefault();
    const username = e.target.alt ? e.target.alt : e.target.textContent;
    parent.location.href = "/" + username;
};
const handleAuxclick = e => {
    e.preventDefault();
    const username = e.target.alt ? e.target.alt : e.target.textContent;
    open("/" + username);
    focus();
};

// マウスホバーで下線を表示するメソッド
const handleMouseover = e => {
    e.target.style.textDecoration = "underline";
};
const handleMouseout = e => {
    e.target.style.textDecoration = "unset";
};

// 通知内にあるユーザ名またはアイコンの要素一覧を取得
const elements = document.querySelectorAll(".notification .notification_actionWrapper span.bold:first-child, .notification .notification_icon img");

// 要素それぞれにリンクを設定する
elements.forEach(element => {
    element.addEventListener("click", handleClick);
    element.addEventListener("auxclick", handleAuxclick);
    element.addEventListener("mouseover", handleMouseover);
    element.addEventListener("mouseout", handleMouseout);
});

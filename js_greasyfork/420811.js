// ==UserScript==
// @name         AtCoderUsers
// @namespace    https://atcoder.jp/
// @version      0.2
// @description  プロフィールのページに情報を追加します。
// @author       magurofly
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420811/AtCoderUsers.user.js
// @updateURL https://update.greasyfork.org/scripts/420811/AtCoderUsers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const user = location.pathname.split("/")[2];
    const leftTable = $(".dl-table").eq(0).find("tbody");

    // AtCoder Problems
    {
        const cell = $("<td>");
        const group = $("<div>").addClass("btn-group");
        for (const [page, title] of [["table", "Table"], ["list", "List"], ["user", "User"]]) {
            group.append($("<a>").addClass("btn btn-default").attr("href", `https://kenkoooo.com/atcoder/#/${page}/${user}`).text(title));
        }
        leftTable.append($("<tr>").append($("<th>").addClass("no-break").text("Problems"), cell.append(group)));
    }

    // other statistics
    {
        const cell = $("<td>");
        cell.append($("<a>").addClass("btn btn-default").attr("href", `https://atcoder-tags.herokuapp.com/graph/${user}?`).text("Tags Graph"));
        cell.append($("<a>").addClass("btn btn-default").attr("href", `https://atcoderapps.herokuapp.com/atcoderperformances/show_graph/?username=${user}`).text("Performances"));
        cell.append($("<a>").addClass("btn btn-default").attr("href", `https://atcoder-scores.herokuapp.com/?user=${user}`).text("Scores"));
        leftTable.append($("<tr>").append($("<th>").addClass("no-break").text("Statistics"), cell));
    }
})();
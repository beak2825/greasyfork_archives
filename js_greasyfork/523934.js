// ==UserScript==
// @name        atcoder-solver-number-displayed
// @namespace   https://twitter.com/kymn_
// @version     1.1.1
// @description 問題一覧ページに解いた人数を表示
// @author      mizzpika
// @license     MIT
// @supportURL  https://x.com/iluv_pikachuuuu
// @match       https://atcoder.jp/contests/*/tasks
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/523934/atcoder-solver-number-displayed.user.js
// @updateURL https://update.greasyfork.org/scripts/523934/atcoder-solver-number-displayed.meta.js
// ==/UserScript==
$(function () {
    var acCount = {};
    var url = location.href;

    function onSuccess(data, dataType) {
        data.StandingsData.forEach(function (userData) {
            Object.keys(userData.TaskResults).forEach(function (taskName) {
                if (userData.TaskResults[taskName].Score > 0) {
                    if (acCount[taskName]) {
                        acCount[taskName] += 1;
                    } else {
                        acCount[taskName] = 1;
                    }
                }
            });
        });
        console.log(acCount);

        draw();
    }

    function draw() {
        $("table thead tr").append('<th width="5%">AC</th>');
        $("table tbody tr").each(function () {
            var taskLink = $(this).find("a").attr("href");
            if (taskLink) {
                var taskName = taskLink.split("/").pop();
                var count = acCount[taskName] || 0;
                $(this).append('<td>' + count + '</td>');
            }
        });
    }

    function getContestName() {
        return url.split("/")[4];
    }

    $.ajax({ url: "https://atcoder.jp/contests/" + getContestName() + "/standings/json", dataType: "json", type: "get", success: onSuccess });
});
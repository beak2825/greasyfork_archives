// ==UserScript==
// @name            AtCoder Fav Rating
// @name:ja         AtCoder Fav Rating
// @namespace       https://github.com/Coki628/ac-fav-rating
// @version         1.1.6
// @description     You can check your fav's rating for AtCoder!
// @description:ja  AtCoderのお気に入り管理ページでレート等の情報を確認できます。※非推奨
// @author          Coki628
// @license         MIT
// @match           https://atcoder.jp/settings/fav*
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @resource        CSS1 https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/css/dataTables.bootstrap.min.css
// @require         https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/jquery.dataTables.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/dataTables.bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/406745/AtCoder%20Fav%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/406745/AtCoder%20Fav%20Rating.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('CSS1'));

(function() {
    'use strict';

    // 色のクラス名を取得
    const getColorType = function(x) {
        if (x >= 2800) {
            return 'user-red';
        } else if (2800 > x && x >= 2400) {
            return 'user-orange';
        } else if (2400 > x && x >= 2000) {
            return 'user-yellow';
        } else if (2000 > x && x >= 1600) {
            return 'user-blue';
        } else if (1600 > x && x >= 1200) {
            return 'user-cyan';
        } else if (1200 > x && x >= 800) {
            return 'user-green';
        } else if (800 > x && x >= 400) {
            return 'user-brown';
        } else {
            return 'user-gray';
        }
    }

    let total = 0;
    const getInfo = function(userName, $tr) {
        $.ajax({
            // url: 'https://atcoder.jp/users/' + userName + '/history/json',
            url: 'https://atcoder.jp/users/' + userName,
            type: 'GET',
            // dataType: 'json',
            dataType: 'html',
        })
        .done(function(data) {
            // ユーザーページから必要な項目を取得
            let rank = 9999999;
            let rating = 0;
            let highest = 0;
            let count = 0;
            let lastCompeted = '';
            $($($.parseHTML(data)).find('table.dl-table')[1]).find('tbody>tr').each(function() {
                if ($(this).find('th').text() === '順位') {
                    rank = Number($(this).find('td').text().slice(0, -2));
                } else if ($(this).find('th').text() === 'Rating') {
                    rating = Number($($(this).find('td>span')[0]).text());
                } else if ($(this).find('th').text() === 'Rating最高値') {
                    highest = Number($($(this).find('td>span')[0]).text());
                } else if ($(this).find('th').text() === 'コンテスト参加回数 ') {
                    count = Number($(this).find('td').text());
                } else if ($(this).find('th').text() === '最後に参加した日') {
                    lastCompeted = $(this).find('td').text();
                }
            });
            // 列追加
            $tr.prepend('<td></td>');
            $tr.append('<td>' + rank + '</td>');
            $tr.append('<td>' + rating + '</td>');
            $tr.append('<td>' + highest + '</td>');
            $tr.append('<td>' + count + '</td>');
            $tr.append('<td>' + lastCompeted + '</td>');

            if (rank === 1) {
                // tourist
                $tr.find('img').after('<img src="//img.atcoder.jp/assets/icon/crown_champion.png">')
            } else if (rank <= 10) {
                // 金冠
                $tr.find('img').after('<img src="//img.atcoder.jp/assets/icon/crown_gold.png">')
            } else if (rank <= 30) {
                // 銀冠
                $tr.find('img').after('<img src="//img.atcoder.jp/assets/icon/crown_silver.png">')
            } else if (rank <= 100) {
                // 銅冠
                $tr.find('img').after('<img src="//img.atcoder.jp/assets/icon/crown_bronze.png">')
            }

            // 名前とレートに色付け
            let color = getColorType(rating);
            $($tr.find('td')[1]).find('a').removeClass('black').addClass(color);
            $($tr.find('td')[3]).addClass(color);
            color = getColorType(highest);
            $($tr.find('td')[4]).addClass(color);
        })
        .fail(function(data) {
            // 削除済ユーザー等への対応
            $tr.prepend('<td></td>');
            $tr.append('<td>9999999</td>');
            $tr.append('<td>0</td>');
            $tr.append('<td>0</td>');
            $tr.append('<td>0</td>');
            $tr.append('<td></td>');
        })
        .always(function(data) {
            total--;
            if (total === 0) {
                // 全部終わったらDataTablesを構築
                let dataTable = $table.DataTable({
                    paging: false,
                    lengthChange: false,
                    info: false,
                    // index列
                    columnDefs: [{
                        searchable: false,
                        orderable: false,
                        targets: 0,
                    }],
                    order: [[1, 'asc']],
                });
                // index列の制御
                dataTable.on('order.dt search.dt', function() {
                    dataTable.column(0, {search:'applied', order:'applied'}).nodes().each(function(cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();
            }
        });
    }

    // テーブルサイズの調整
    $($('#vue-fav>div.row>div')[0]).removeClass('col-xs-6').addClass('col-xs-9');
    $($('#vue-fav>div.row>div')[1]).removeClass('col-xs-6').addClass('col-xs-3');

    const $table = $($('#vue-fav').find('table')[0]);
    // ヘッダ行の挿入
    $table.prepend('<thead><tr><th></th><th>Name</th><th>Rank</th><th>Rating</th><th>Highest Rating</th><th>Rated Matches</th><th>Last Competed</th>');
    // 表が見やすくなるスタイルを追加
    $table.addClass('table-striped table-hover table-bordered');

    const myName = $('div.header-mypage_btn').text().trim();
    const rows = $table.find('tbody>tr');
    total = rows.length;

    // 各行を取得してユーザー情報を追加していく
    for (let i = 0; i < rows.length; i++) {
        const userName = $(rows[i]).find('td>a').text();
        getInfo(userName, $(rows[i]));
        // 自分の行を色付け
        if (myName && myName === userName) {
            $(rows[i]).css('background-color', '#BAE4F4');
        }
    }
})();

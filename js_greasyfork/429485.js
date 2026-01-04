// ==UserScript==
// @name            AC Problems Ranking Colorizer
// @name:ja         AC Problems Ranking Colorizer
// @namespace       https://github.com/Coki628/ac-problems-ranking-colorizer
// @version         1.1
// @description     You can see your ratings on AtCoder Problems!
// @description:ja  AtCoder ProblemsのランキングでAtCoderのレートが見られるようにします。
// @author          Coki628
// @license         MIT
// @match           https://kenkoooo.com/atcoder/*
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/429485/AC%20Problems%20Ranking%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/429485/AC%20Problems%20Ranking%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urls = ['#/ac', '#/sum', '#/fast', '#/short', '#/first', '#/streak'];

    function getColor(rating) {
        if (rating >= 2800) return '#FF0000';
        if (rating >= 2400) return '#FF8000';
        if (rating >= 2000) return '#C0C000';
        if (rating >= 1600) return '#0000FF';
        if (rating >= 1200) return '#00C0C0';
        if (rating >=  800) return '#008000';
        if (rating >=  400) return '#804000';
        if (rating >     0) return '#808080';
        return '#000000';
    }

    function getAchRate(rating) {
        const base = Math.floor(rating / 400) * 400;
        return ((rating - base) / 400) * 100;
    }

    function colorize(u, rating) {
        if (rating > 0) {
            const userName = $(u).text();
            $(u).text('');
            if (rating < 3200) {
                const color = getColor(rating);
                const achRate = getAchRate(rating);
                $(u).prepend(`
                    <span style="
                        display: inline-block;
                        height: 14px;
                        width: 14px;
                        vertical-align: center;
                        border-radius: 50%;
                        border: solid 1px ${color};
                        background: -webkit-linear-gradient(
                            bottom,
                            ${color} 0%,
                            ${color} ${achRate}%,
                            rgba(255, 255, 255, 0.0) ${achRate}%,
                            rgba(255, 255, 255, 0.0) 100%);
                    "></span>
                `);
                $(u).css('color', color);
                $(u).append(`<a style="color: ${color};" href="https://atcoder.jp/users/${userName}" target="_blank">${userName}</a>`)
            // 銀
            } else if (rating < 3600) {
                const color = 'rgb(128, 128, 128)';
                $(u).prepend(`
                    <span style="
                        display: inline-block;
                        height: 14px;
                        width: 14px;
                        vertical-align: center;
                        border-radius: 50%;
                        border: solid 1px ${color};
                        background: linear-gradient(to right, ${color}, white, ${color});
                    "></span>
                `);
                $(u).css('color', color);
                $(u).append(`<a style="color: ${color};" href="https://atcoder.jp/users/${userName}" target="_blank">${userName}</a>`)
            // 金
            } else {
                const color = 'rgb(255, 215, 0)';
                $(u).prepend(`
                    <span style="
                        display: inline-block;
                        height: 14px;
                        width: 14px;
                        vertical-align: center;
                        border-radius: 50%;
                        border: solid 1px ${color};
                        background: linear-gradient(to right, ${color}, white, ${color});
                    "></span>
                `);
                $(u).css('color', color);
                $(u).append(`<a style="color: ${color};" href="https://atcoder.jp/users/${userName}" target="_blank">${userName}</a>`)
            }
        }
    }

    function getInfo(userName, $td) {
        $.ajax({
            url: `https://kenkoooo.com/atcoder/proxy/users/${userName}/history/json`,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(contestHistory) {
            const rating = contestHistory.length > 0 ? contestHistory[contestHistory.length - 1].NewRating : 0;
            colorize($td, rating);
        })
        .fail(function(data) {
        })
        .always(function(data) {
        });
    }

    function ColorizeUsers() {
        if (urls.indexOf(location.hash) === -1) return;
        $('tr').each(function() {
            const $td = $($(this).find('td')[1]);
            const userName = $td.text();
            if (userName !== '') {
                getInfo(userName, $td);
            }
        });
    }

    function setColorizer() {
        if (urls.indexOf(location.hash) === -1) return;
        // 表示数プルダウン(clickは効かないけどmousedownは効く)
        $('ul.dropdown-menu>li.dropdown-item>a').on('mousedown', function() {
            setTimeout(function() {
                ColorizeUsers();
            }, 1000);
        });
        // ページャー
        $('ul.react-bootstrap-table-page-btns-ul.pagination>li.page-item').on('click', function() {
            setTimeout(function() {
                ColorizeUsers();
            }, 1000);
        });
    }

    // Reactの描画完了を検知できそうにないのでとりあえず1秒後に
    setTimeout(function() {
        setColorizer();
        ColorizeUsers();
    }, 1000);
    // 画面遷移を検知
    $(window).on('hashchange', function() {
        setTimeout(function() {
            setColorizer();
            ColorizeUsers();
        }, 1000);
    });
})();

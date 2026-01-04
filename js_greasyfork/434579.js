// ==UserScript==
// @name         UOJ Predictor
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Plugin to calculate predicted rating changes of UOJ-like Online Judges.
// @author       tiger2005
// @match        *://zhengruioi.com/contest/*/standings*
// @match        *://uoj.ac/contest/*/standings*
// @match        *://www.zhengruioi.com/contest/*/standings*
// @match        *://www.uoj.ac/contest/*/standings*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434579/UOJ%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/434579/UOJ%20Predictor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // transformed from https://github.com/vfleaking/uoj/blob/9f1302c774f2499af0dc52d3faa7dd7404d03b13/uoj/1/app/uoj-contest-lib.php
	function getColOfRating(rating) {
		if (rating < 1500) {
			var H = 300 - (1500 - 850) * 300 / 1650, S = 30 + (1500 - 850) * 70 / 1650, V = 50 + (1500 - 850) * 50 / 1650;
			if (rating < 300) rating = 300;
			var k = (rating - 300) / 1200;
			return ColorConverter.toStr(ColorConverter.toRGB(new HSV(H + (300 - H) * (1 - k), 30 + (S - 30) * k, 50 + (V - 50) * k)));
		}
		if (rating > 2500) {
			rating = 2500;
		}
		return ColorConverter.toStr(ColorConverter.toRGB(new HSV(300 - (rating - 850) * 300 / 1650, 30 + (rating - 850) * 70 / 1650, 50 + (rating - 850) * 50 / 1650)));
	}
    function calcPredictedRatingChanges(K = 400){
        var delta = 500;
        var n = standings.length;
        var rating = [];
        var i, j;
        for(i = 0; i < n; i ++)
            rating.push(standings[i][2][1]);
        var rank = [];
        var foot = [];
        for(i = 0; i < n; ){
            j = i;
            while(j + 1 < n && standings[j+1][3] == standings[j][3])
                ++ j;
            var our_rk = 0.5 * ((i+1) + (j+1));
            while(i <= j){
                rank.push(our_rk);
                foot.push(n - rank[i]);
                i ++;
            }
        }
        var weight = [];
        for(i = 0; i < n; i ++)
            weight.push(Math.pow(7, rating[i] / delta));
        var exp = [];
        for(i = 0; i < n; i ++)
            exp.push(0);
        for(i = 0; i < n; i ++)
            for(j = 0; j < n; j ++)
                if(j != i)
                    exp[i] += weight[i] / (weight[i] + weight[j]);
        var new_rating = [];
        for(i = 0; i < n; i ++)
            new_rating.push(rating[i] + Math.ceil(K * (foot[i] - exp[i]) / (n - 1)));
        for(i = n - 1; i >= 0; i --){
            if(i + 1 < n && standings[i][3] != standings[i+1][3])
                break;
            if(new_rating[i] > rating[i])
                new_rating[i] = rating[i];
        }
        for(i = 0; i < n; i ++)
            if(new_rating[i] < 0)
                new_rating[i] = 0;
        return new_rating;
    }
    var max_rating_changes = localStorage.getItem("_MAX_RATING_CHANGES");
    if(max_rating_changes == undefined){
        localStorage.setItem("_MAX_RATING_CHANGES", 400);
        max_rating_changes = 400;
    }
    else
        max_rating_changes = Number(max_rating_changes);
    function getUsernameTable(){
        var users = {};
        var n = standings.length;
        for(var i = 0; i < n; i ++)
            users[standings[i][2][0]] = [i, standings[i][2][1]];
        return users;
    }
    var predicted_rating_changes = calcPredictedRatingChanges(max_rating_changes);
    var username_table = getUsernameTable();
    var rating_changes_colors = ["rgb(0, 204, 0)", "rgb(102, 102, 102)", "rgb(204, 0, 0)"];
    function changeMaxRatingChanges(){
        var str = prompt("Insert max rating changes, ranged [0, 1000]");
        var result = Number(str);
        if(typeof(result) != "number" || isNaN(result) || result < 0 || result > 1000)
            alert("Invalid input!");
        else{
            var st = $("#standings > .table-responsive > table");
            st.find("thead > tr > th:last-child").remove();
            st.find("tbody > tr > td:last-child").remove();
			st.find("thead > tr > th:last-child").remove();
            st.find("tbody > tr > td:last-child").remove();
            max_rating_changes = Math.floor(result);
            localStorage.setItem("_MAX_RATING_CHANGES", max_rating_changes);
            predicted_rating_changes = calcPredictedRatingChanges(max_rating_changes);
            displayRatingChanges();
        }
    }
    function formatAsUsername(str){
        var ret = "";
        for(var i=0; i<str.length; i++)
            if(str[i].charCodeAt() > 32 && str[i].charCodeAt() < 128)
                ret += str[i];
        return ret;
    }
    function displayRatingChanges(){
        var st = $("#standings > .table-responsive > table");
        if(max_rating_changes == 0)
            st.find("thead > tr").append(`<th style="width: 6em"><a class="changeMaxRatingChanges" style="cursor: pointer">Unrated</a></th>`)
        else
            st.find("thead > tr").append(`<th style="width: 6em"><a class="changeMaxRatingChanges" style="cursor: pointer">Delta<br/>(max. = ${max_rating_changes})</a></th>`);
		st.find("thead > tr").append(`<th style="width: 6em"><a>New rating</a></th>`);
        st.find("tbody > tr").each(function(){
            var username = $(this).children().eq(1).find("a").text();
            username = formatAsUsername(username);
            var rating_changes = predicted_rating_changes[username_table[username][0]] - username_table[username][1];
            var color = "", content = "";
            if(rating_changes > 0)
                color = rating_changes_colors[0], content = '+' + rating_changes;
            else if(rating_changes == 0)
                color = rating_changes_colors[1], content = '' + rating_changes;
            else
                color = rating_changes_colors[2], content = '' + rating_changes;
            $(this).append(`<td><div><span style='color: ${color}'>${content}</span></div></td>`);
			$(this).append(`<td><div><span><span style='color: ${getColOfRating(username_table[username][1])}'>${username_table[username][1]}</span> → <span style='color: ${getColOfRating(predicted_rating_changes[username_table[username][0]])}'>${predicted_rating_changes[username_table[username][0]]}</span></span></div></td>`);
        })
        $(".changeMaxRatingChanges").click(function(){
            changeMaxRatingChanges();
        })
    }
    $.fn.long_table = function(data, cur_page, header_row, get_row_str, config) {
        return this.each(function() {
            var table_div = this;

            $(table_div).html('');

            var page_len = config.page_len != undefined ? config.page_len : 10;

            if (!config.echo_full) {
                var n_rows = data.length;
                var n_pages = Math.max(Math.ceil(n_rows / page_len), 1);
                if (cur_page == undefined) {
                    cur_page = 1;
                }
                if (cur_page < 1) {
                    cur_page = 1;
                } else if (cur_page > n_pages) {
                    cur_page = n_pages;
                }
                var cur_start = (cur_page - 1) * page_len;
            } else {
                var n_rows = data.length;
                var n_pages = 1;
                cur_page = 1;
                var cur_start = (cur_page - 1) * page_len;
            }

            var div_classes = config.div_classes != undefined ? config.div_classes : ['table-responsive'];
            var table_classes = config.table_classes != undefined ? config.table_classes : ['table', 'table-bordered', 'table-hover', 'table-striped', 'table-text-center'];

            var now_cnt = 0;
            var tbody = $('<tbody />')
            for (var i = 0; i < page_len && cur_start + i < n_rows; i++) {
                now_cnt++;
                if (config.get_row_index) {
                    tbody.append(get_row_str(data[cur_start + i], cur_start + i));
                } else {
                    tbody.append(get_row_str(data[cur_start + i]));
                }
            }
            if (now_cnt == 0) {
                tbody.append('<tr><td colspan="233">无</td></tr>');
            }

            $(table_div).append(
                $('<div class="' + div_classes.join(' ') + '" />').append(
                    $('<table class="' + table_classes.join(' ') + '" />').append(
                        $('<thead>' + header_row + '</thead>')
                    ).append(
                        tbody
                    )
                )
            );

            if (config.print_after_table != undefined) {
                $(table_div).append(config.print_after_table());
            }

            var get_page_li = function(p, h) {
                if (p == -1) {
                    return $('<li></li>').addClass('disabled').append($('<a></a>').append(h));
                }

                var li = $('<li></li>');
                if (p == cur_page) {
                    li.addClass('active');
                }
                li.append(
                    $('<a></a>').attr('href', '#' + table_div.id).append(h).click(function(e) {
                        if (config.prevent_focus_on_click) {
                            e.preventDefault();
                        }
                        $(table_div).long_table(data, p, header_row, get_row_str, config);
                    })
                );
                return li;
            };

            if (n_pages > 1) {
                var pagination = $('<ul class="pagination top-buffer-no bot-buffer-sm"></ul>');
                if (cur_page > 1) {
                    pagination.append(get_page_li(cur_page - 1, '<span class="glyphicon glyphicon glyphicon-backward"></span>'));
                } else {
                    pagination.append(get_page_li(-1, '<span class="glyphicon glyphicon glyphicon-backward"></span>'));
                }
                var max_extend = config.max_extend != undefined ? config.max_extend : 5;
                for (var i = Math.max(cur_page - max_extend, 1); i <= Math.min(cur_page + max_extend, n_pages); i++) {
                    pagination.append(get_page_li(i, i.toString()));
                }
                if (cur_page < n_pages) {
                    pagination.append(get_page_li(cur_page + 1, '<span class="glyphicon glyphicon glyphicon-forward"></span>'));
                } else {
                    pagination.append(get_page_li(-1, '<span class="glyphicon glyphicon glyphicon-forward"></span>'));
                }
                $(table_div).append($('<div class="text-center"></div>').append(pagination));
            }
            displayRatingChanges();
        });
    };
    displayRatingChanges();
})();
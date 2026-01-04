// ==UserScript==
// @name         NexusPHP魔力计算器
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  在NexusPHP站点显示每个种子的A值。
// @author       LaneLau
// @include   *avgv.cc/torrents*
// @include   *.beitai.pt/torrents*
// @include   *.pttime.org/torrents*
// @include   *.ptsbao.club/torrents*
// @include   *.pthome.net/torrents*
// @include   *pt.m-team.cc/*
// @include   *.hddolby.com/torrents*
// @include   *.leaguehd.com/torrents*
// @include   *.hdhome.org/torrents*
// @include   *.hdsky.me/torrents*
// @include   *.ourbits.club/torrents*
// @include   *.u2.dmhy.org/torrents*
// @include   *.hdzone.me/torrents*
// @include   *.hdatmos.club/torrents*
// @include   *.pt.soulvoice.club/torrents*
// @include   *.discfan.net/torrents*
// @include   *.hdtime.org/torrents*
// @include   *.nicept.net/torrents*
// @include   *pterclub.com/torrents*
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416471/NexusPHP%E9%AD%94%E5%8A%9B%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/416471/NexusPHP%E9%AD%94%E5%8A%9B%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function ($) {
    var T0 = 4;
    var N0 = 7;
    var B0 = 50;
    var L = 300;

    function calcA(T, S, N) {
        var c1 = 1 - Math.pow(10, -(T / T0));
        var c2 = 1 + Math.pow(2, .5) * Math.pow(10, -(N - 1) / (N0 - 1));
        return c1 * S * c2;
    }

    function makeA($this, i_T, i_S, i_N) {
        var time = $this.children('td:eq(' + i_T + ')').find("span").attr("title");
        var T = (new Date().getTime() - new Date(time).getTime()) / 1e3 / 86400 / 7;
        var size = $this.children('td:eq(' + i_S + ')').text().trim();
        var size_tp = 1;
        var S = size.replace(/[KMGT]B/, function (tp) {
            if (tp == "KB") {
                size_tp = 1 / 1024 / 1024;
            } else if (tp == "MB") {
                size_tp = 1 / 1024;
            } else if (tp == "GB") {
                size_tp = 1;
            } else if (tp == "TB") {
                size_tp = 1024;
            }
            return "";
        });
        S = parseFloat(S) * size_tp;
        var number = $this.children('td:eq(' + i_N + ')').text().trim();
        var N = parseInt(number);
        var A = calcA(T, S, N).toFixed(2);
        var ave = (A / S).toFixed(2);
        if ((A > S * 2) && (N != 0)) {
            //标红A大于体积2倍且不断种的种子
            return '<span style="color:#ff0000;font-weight:900;">' + ave + "</span>"
        } else {
            return '<span style="">' + ave + "</span>"
        }
    }

    var i_T, i_S, i_N
    $('.torrents>tbody>tr').each(function (row) {
        var $this = $(this);
        if (row == 0) {
            $this.children('td').each(function (col) {
                if ($(this).find('img.time').length) {
                    i_T = col
                } else if ($(this).find('img.size').length) {
                    i_S = col
                } else if ($(this).find('img.seeders').length) {
                    i_N = col
                }
            })
            if (!i_T || !i_S || !i_N) {
                alert('未能找到数据列')
                return
            }
            $this.children("td:last").before("<td>A值</td>");
        } else {
            var textA = makeA($this, i_T, i_S, i_N)
            $this.children("td:last").before("<td>" + textA + "</td>");
        }
    });
})(jQuery)
// ==UserScript==
// @name         ❤️七夕特供，让Github、Gitee不再绿油油❤️
// @namespace    TheGreenColorGoAway
// @version      0.1
// @description  让绿油油的离开程序员的生活...
// @author       Regan Yue
// @match        https://github.com/*
// @match        https://gitee.com/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449399/%E2%9D%A4%EF%B8%8F%E4%B8%83%E5%A4%95%E7%89%B9%E4%BE%9B%EF%BC%8C%E8%AE%A9Github%E3%80%81Gitee%E4%B8%8D%E5%86%8D%E7%BB%BF%E6%B2%B9%E6%B2%B9%E2%9D%A4%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449399/%E2%9D%A4%EF%B8%8F%E4%B8%83%E5%A4%95%E7%89%B9%E4%BE%9B%EF%BC%8C%E8%AE%A9Github%E3%80%81Gitee%E4%B8%8D%E5%86%8D%E7%BB%BF%E6%B2%B9%E6%B2%B9%E2%9D%A4%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var red = ['#eeeeee', '#ffcdd2', '#e57373', '#e53935', '#b71c1c'];
    if(window.location.host == "github.com" ){
        var cssGitHubVars = [
            '--color-calendar-graph-day-bg',
            '--color-calendar-graph-day-L1-bg',
            '--color-calendar-graph-day-L2-bg',
            '--color-calendar-graph-day-L3-bg',
            '--color-calendar-graph-day-L4-bg'
        ];

        for (var i = 0, l = cssGitHubVars.length; i < l; i++) {
            document.documentElement.style.setProperty(
                cssGitHubVars[i],
                red[i]
            );
        }

        var doc = document.getElementsByClassName('legend');

        if (doc[0]) {
            var lis = doc[0].getElementsByTagName('li');

            for (var i1 = 1, l1 = lis.length; i1 < l1; i1++) {
                lis[i1].style.setProperty('background-color', red[i1], 'important');
            }
        }

        var path = document.getElementsByClassName('js-highlight-blob');
        if (path[0]) {
            for (var i2 = 0, l2 = path.length; i2 < l2; i2++) {
                path[i2].setAttribute('fill', red[2]);
                path[i2].setAttribute('stroke', red[2]);
            }
        }
        var axis = document.getElementsByClassName('activity-overview-axis');
        if (axis[0]) {
            for (var j = 0, m = axis.length; j < m; j++) {
                axis[j].style.stroke = red[3];
            }
        }

        var points = document.getElementsByClassName('activity-overview-point');
        if (points[0]) {
            for (var k = 0, n = points.length; k < n; k++) {
                points[k].style.stroke = red[3];
            }
        }

        var lines = document.getElementsByClassName('Progress-item rounded-2');
        if(lines[0]){
            for (var p = 0, h = lines.length; p < h; p++) {
                lines[p].style.backgroundColor = red[3];
            }
        }
    }else if(window.location.host == "gitee.com" ){
        var boxs_less = document.getElementsByClassName('box less');
        if (boxs_less[0]) {
            for (var j1 = 0, m1 = boxs_less.length; j1 < m1; j1++) {
                boxs_less[j1].style.backgroundColor = red[0];
            }
        }

        var boxs_little = document.getElementsByClassName('box little');
        if (boxs_little[0]) {
            for (var j2 = 0, m2 = boxs_little.length; j2 < m2; j2++) {
                boxs_little[j2].style.backgroundColor = red[1];
            }
        }

        var boxs_some = document.getElementsByClassName('box some');
        if (boxs_some[0]) {
            for (var j3 = 0, m3 = boxs_some.length; j3 < m3; j3++) {
                boxs_some[j3].style.backgroundColor = red[2];
            }
        }

        var boxs_many = document.getElementsByClassName('box many');
        if (boxs_many[0]) {
            for (var j4 = 0, m4 = boxs_many.length; j4 < m4; j4++) {
                boxs_many[j4].style.backgroundColor = red[3];
            }
        }

        var boxs_much = document.getElementsByClassName('box much');
        if (boxs_much[0]) {
            for (var j5 = 0, m5 = boxs_much.length; j5 < m5; j5++) {
                boxs_much[j5].style.backgroundColor = red[4];
            }
        }

        var item_less = document.getElementsByClassName('item less');
        item_less[0].style.backgroundColor = red[0];
        var item_little = document.getElementsByClassName('item little');
        item_little[0].style.backgroundColor = red[1];
        var item_some = document.getElementsByClassName('item some');
        item_some[0].style.backgroundColor = red[2];
        var item_many = document.getElementsByClassName('item many');
        item_many[0].style.backgroundColor = red[3];
        var item_much = document.getElementsByClassName('item much');
        item_much[0].style.backgroundColor = red[4];

    }
})();
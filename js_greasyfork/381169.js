// ==UserScript==
// @name         HOJ Addon - AC Checker
// @namespace    https://twitter.com/r1825_java
// @version      0.4
// @description  Hamako Online Judgeの問題ページに自分がACしているかどうかを表示します。
// @author       r1825
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/problems/*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/contest/*/problems/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381169/HOJ%20Addon%20-%20AC%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/381169/HOJ%20Addon%20-%20AC%20Checker.meta.js
// ==/UserScript==

let USER_NAME = 'r1825';
let DISABLE_RIVAL = 0; /* 0のときにライバルの情報を表示します。それ以外のときは表示しません */
let RIVAL_NAME = 'ei1821';
let ans;

(function() {
    'use strict';

    var url_here = location.href;
    var url_status;
    var url_splited = url_here.split("/");
    if ( url_here.indexOf('contest') != -1 ) {
        url_status = "https://hoj.hamako-ths.ed.jp/onlinejudge/contest/" + url_splited[5] + "/state?problem=" + url_splited[7] +"&state=2";
    }
    else {
        url_status = "https://hoj.hamako-ths.ed.jp/onlinejudge/state?problem=" + url_splited[5] +"&state=2";
    }
    var resultList = [];
    for ( var i = 1; i <= 100; i++ ) {
        let url_check = url_status + "&page=" + i;
        resultList.push ( $.ajax({
            url: url_check,
            dataType: 'html'
        }));
    }

    $.when.apply($, resultList).done(function () {
        let done_mine = 0;
        let done_rival = 0;
        const object = document.getElementsByClassName('main')[0];
        for ( var i = 0; i < arguments.length; i++ ) {
            var res = arguments[i][0];
            if ( res.indexOf ( USER_NAME ) != -1 ) {
                done_mine = 1;
            }
            if ( res.indexOf ( RIVAL_NAME ) != -1 ) {
                done_rival = 1;
            }
            if ( res.indexOf ( "提出は見つかりません" ) != -1 && res.indexOf ( '<!--FLAG_r1825 HOJAddon-ACChecker work has done-->' ) == -1 ) {
                if ( done_mine == 0 )  object.insertAdjacentHTML('beforebegin', '<br>&emsp;&emsp;'+ USER_NAME + 'はこの問題を<span style="background-color: rgb( 200, 28, 28); padding: 5px 10px; font-weight: bold; color: #ffffff"><i class="fa fa-check fa-fw"></i>AC</span>していません<br>' );
                else object.insertAdjacentHTML('beforebegin','<br>&emsp;&emsp;' + USER_NAME + 'はこの問題を<span style="background-color: rgb(28, 65, 184); padding: 5px 10px; font-weight: bold; color: #ffffff"><i class="fa fa-check fa-fw"></i>AC</span>しています<br>');
                if ( DISABLE_RIVAL == 0 && done_rival == 0 ) object.insertAdjacentHTML('beforebegin', '<br>&emsp;&emsp;' + RIVAL_NAME +'はこの問題を<span style="background-color: rgb( 200, 28, 28); padding: 5px 10px; font-weight: bold; color: #ffffff"><i class="fa fa-check fa-fw"></i>AC</span>していません<br>' );
                else if ( DISABLE_RIVAL == 0 ) object.insertAdjacentHTML('beforebegin','<br>&emsp;&emsp;' + RIVAL_NAME + 'はこの問題を<span style="background-color: rgb(28, 65, 184); padding: 5px 10px; font-weight: bold; color: #ffffff"><i class="fa fa-check fa-fw"></i>AC</span>しています<br>');
                object.insertAdjacentHTML('beforebegin','<!--FLAG_r1825 HOJAddon-ACChecker work has done-->');
                break;
            }
        }
    });

    // Your code here...
})();
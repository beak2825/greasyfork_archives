// ==UserScript==
// @name            Depo.ua Xtender
// @name-uk         Depo.ua Xtender
// @namespace       https://greasyfork.org/users/4157
// @version         1.0.6
// @date            2017-12-22
// @description     Special styles and functions for Depo.ua (ukrainian news)
// @description-uk  Швидко та комфортно на Depo.ua
// @author          E-xecutive
// @include         https://*.depo.ua/*
// @include         http://*.depo.ua/*
// @grant           none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/33544/Depoua%20Xtender.user.js
// @updateURL https://update.greasyfork.org/scripts/33544/Depoua%20Xtender.meta.js
// ==/UserScript==

var arclink = location.pathname.includes("archive");

document.addEventListener("DOMContentLoaded", function(){
    //var curlink = location.href.match(/.*depo.ua\/.../);
    //if (curlink){}else{ var curlink = location.href.match(/.*depo.ua/);}
    var myhash = location.hash.match(/\d\d:\d\d/);
    // створити посилання на архів
    if(arclink){ // посилання на попередню дату
        var date = new Date(/\d\d\d\d-\d\d-\d\d/.exec(location.pathname));
        date.setDate(date.getDate()-1);
    }else{var date = new Date();}
    var y = date.getFullYear();
    var m = date.getMonth() +1;
    if(m < 10){m = '0' + m;}
    var d = date.getDate();
    if(d < 10){d = '0' + d;}
    var date = y + "-" + m + "-" + d;
    var newlink = '/archive/'+ y +'/'+ date;
//    var newlink = curlink + '/archive/'+ y +'/'+ date;
    if(arclink){
        if(myhash){ // додати тег-мітку на останню новину головної сторінки
            var target = document.querySelectorAll('span.date');
            for (var i = 0; i < target.length; i++) {
                var rexp = new RegExp('.*'+myhash+'$');
                var targeted = target[i].textContent.match(rexp);
                if (targeted) {
                    target[i].innerHTML = target[i].innerHTML.replace(targeted, '<a name="'+myhash+'"></a>Дивитися ДАЛІ');
                    break;
                }
            }
        }
        // наприкінці додати посилання на архів
        var mydiv = document.createElement('div');
        mydiv.innerHTML = ['<div><li></li><li class="item"><a href=',newlink,
             '><span class="title" style="color: #FF6600">Переглянути всі новини за  <b>',date,
             '</b></span></a></li><li></li></div>'].join("");
        document.body.appendChild(mydiv);
    }else{
        // перейти до стовпчика новин
        var scrollTarget = document.querySelector('td.title_list_news');
        scrollTarget.scrollIntoView();
        // створити тег-посилання на останню новину головної сторінки
        var x = document.getElementsByTagName('tbody').length-1;
        var tableRef = document.getElementsByTagName('tbody')[x];
        var totalRows = tableRef.rows.length;
        var lastRow = tableRef.rows[ totalRows - 1 ];
        newlink += '#' + lastRow.textContent.match(/\d\d:\d\d/);
        // замінити існуючий реф посиланням на архів
        var anchors = document.getElementById('logotype').getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++){
            anchors[i].setAttribute('href', newlink);
            anchors[i].setAttribute('target', '_blank');
        }
        // наприкінці додати посилання на архів
        var newCell = tableRef.insertRow(totalRows).insertCell(0);
        newCell.innerHTML = ['<tr><td><a style="color: #FF6600" href=',newlink,
            ' class="link_title_news"><b>Усі новини за сьогодні  >>></b></a></td></tr>'].join("");
    }
});

(function() {
    var css = [
        "@namespace url(http://www.w3.org/1999/xhtml);\n",
        " #wrapper .header {height: 124px; width: 100%; left: 0px; position: relative; min-height: initial;}",
        " .navigation .nav {height: 32px;}",
        " .header .header_inner {height: 100px; position: absolute;}",
        " .header_inner .nav_second_row {padding-left: 55px; height: 30px; position: absolute;}",
        " .header_inner .banner {display: none;}",
        " .header .sticky {display: none;}",
        " .slider_city .slick-initialized {display: none;}",
        " #bigmenu .main_menu {top: 32px; position: relative;}",
        " .dropdown_main_menu {width: 92%; top: 44%; line-height: 96%;}",
        " #logotype {width: 85%; position: relative; margin-top: -22px;}",
        " #left .wrap {box-sizing: content-box; padding-left: 0px;}",
        " ul#list {display: none;}",
        " ul#left_main {display: none;}",
        " ul#right_main {display: none;}",
    ].join("");
    if(arclink){
        css += [
            " #right {display: none;}",
            " .holder .row_news {display: none;}",
            " #container .list_news_corrector {display: none;}",
            " .news_img {display: none;}",
            " #container .block_archive {width: 125%; position: static;}",
            " .last_news_block_search.content {width: auto;}",
            " #footer {display: none;}",
//            " #right > div {display: none;}",
//            " .pb_feed_iframe {display: none;}",
        ].join("");
    }
    // 'addMaStyle' function
    var stl = document.createElement('style');
    stl.type = 'text/css';
    stl.innerHTML = css.replace(/;/g, ' !important;');
    var head = document.getElementsByTagName('head');
    if (head.length > 0) {
        head[0].appendChild(stl);
    } else {
        document.documentElement.appendChild(stl);
    }
})();
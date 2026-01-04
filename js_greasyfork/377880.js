// ==UserScript==
// @name         BSOJ NightMode
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  RT
// @author       sun123zxy
// @match        https://oj.bashu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377880/BSOJ%20NightMode.user.js
// @updateURL https://update.greasyfork.org/scripts/377880/BSOJ%20NightMode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var htmlcode='\
        <style> \
            body{\
                background-color: #000;\
                color: #fff;\
            } \
            .well{\
                background-color: #000!important;\
            }\
            .table-striped tbody>tr:nth-child(odd)>td, .table-striped tbody>tr:nth-child(odd)>th {\
                background-color: #000;\
            }\
            h1, h2, h3, h4, h5, h6 {\
                color: #fff;\
            }\
            .problem-subtitle {\
                color: #fff;\
            }\
            .navbar-inner {\
                background-image: linear-gradient(to bottom,#000,#000);\
                border: 1px solid #000;\
            }\
input[disabled], select[disabled], textarea[disabled], input[readonly], select[readonly], textarea[readonly] {\
    background-color: #000000;\
}\
.navbar .nav>.active>a, .navbar .nav>.active>a:hover, .navbar .nav>.active>a:focus {\
    background-color: #000;\
}\
.navbar .nav>li>a:focus, .navbar .nav>li>a:hover {\
    background-color: #000;\
    color: #fff;\
    text-shadow: 1.5px 1.5px 0 rgb(154, 154, 154);\
}\
textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input {\
    background-color: #000;\
}\
.navbar .search-query {\
    border: 1px solid rgba(142, 142, 142, 0.8);\
}\
select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input {\
    color: #fff;\
}\
textarea:focus, input[type="text"]:focus, input[type="password"]:focus, input[type="datetime"]:focus, input[type="datetime-local"]:focus, input[type="date"]:focus, input[type="month"]:focus, input[type="time"]:focus, input[type="week"]:focus, input[type="number"]:focus, input[type="email"]:focus, input[type="url"]:focus, input[type="search"]:focus, input[type="tel"]:focus, input[type="color"]:focus, .uneditable-input:focus {\
    border-color: #fff;\
}\
.btn-group.open .btn.dropdown-toggle {\
    background-color: #000;\
}\
.dropdown-menu {\
    background-color: #000;\
}\
.dropdown-menu>li>a {\
    color: #fff;\
}\
\
a {\
    color: #fff;\
}\
.pagination ul>li>a, .pagination ul>li>span {\
    background-color: #000;\
}\
a:hover, a:focus {\
    color: #9999b1;\
}\
.pager li>a, .pager li>span {\
    background-color: #000;\
}\
\
#newspad {\
    background-color: #000!important;\
}\
rect {\
    fill: #000;\
}\
\
.btn {\
    color: #fff;\
    background-color: #000;\
    background-image: linear-gradient(#000,#000 5%,#000);\
}\
.btn:hover, .btn:focus {\
    color: #a5a5a5;\
}\
.caret {\
    border-top: 4px solid #fff;\
}\
.msg_odd, .msg_even {\
    background: #000;\
}\
pre {\
    background: #000;\
    border: 1px solid rgb(255, 255, 255);\
    color: #fff;\
}\
\
.mail-item:nth-child(odd),.mail-item:nth-child(even) {\
    background-color: #000000;\
}\
.modal,.modal-footer {\
    background-color: #000;\
}\
.alert-danger, .alert-error {\
    color: #ffffff;\
    background-color: #000000;\
}\
select {\
    background-color: #000;\
}\
.input-append .add-on, .input-prepend .add-on {\
    background-color: #000;\
}\
.close{\
    color: #fff;\
    opacity: 1;\
}\
\
.x-grid3-scroller {\
    background: black;\
}\
        </style>\
    ';

    document.getElementsByTagName("head")[0].innerHTML+=htmlcode;
})();
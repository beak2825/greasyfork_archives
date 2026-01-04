// ==UserScript==
// @name         IVLE Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Dark Theme for IVLE
// @author       Damakuno
// @match        https://ivle.nus.edu.sg/*
// @include      https://ivle.nus.edu.sg/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/368046/IVLE%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/368046/IVLE%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
var css = `
        @namespace url(http://www.w3.org/1999/xhtml);
        * {

        }

body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #cecece;
    background-color: #212121;
}

font[color=green] {
    color: rgb(102, 255, 153);
}

.close:hover, .close:focus {
    color: #0006;
}

a {
    color: #d2f6ff;
    text-decoration: none;
}

a:hover, a:focus {
    color: #75afda;
    text-decoration: underline;
}

.alert-info {
    color: #3dffd4;
    background-color: #03503e;
    border-color: #bce8f1;
}

.panel-warning > .panel-heading {
    color: #d6c5a8;
    background-color: #482f03;
    border-color: #faebcc;
}

.text-muted {
    color: #aaa;
}

.nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus {
    color: #cefff5;
    cursor: default;
    background-color: #237b38;
    border: 1px solid #ddd0;
    border-bottom-color: transparent;
}

.nav-tabs {
    border-bottom: 1px solid #484848;
}

.nav-tabs > li > a {
    background-color: #353535;
    color: #d2f6ff;
}

.nav .open > a, .nav .open > a:hover, .nav .open > a:focus {
    background-color: #016145;
    border-color: #00ce92;
}

.nav > li > a:hover, .nav > li > a:focus {
    text-decoration: none;
    background-color: #1a8032;
}
.nav-tabs > li > a:hover {
    border-color: #00ce92;
}

.btn-default {
    color: #fff !important;
    background-color: #0c9087;
}

.btn-default:hover {
    background-color: #01524d;
}

.btn-default:hover, .btn-default:focus, .btn-default.focus, .btn-default:active, .btn-default.active, .open > .dropdown-toggle.btn-default {
    background-color: #05615b;
    border-color: #adadad;
}

.btn-default span {
    color: #fff !important;
}

.panel-primary > .panel-heading {
    color: #fff;
    background-color: #05615b;
}

.panel-default > .panel-heading {
    color: #e2e2e2;
    background-color: #3c3c3c;
}

.panel-primary {
    border-color: #3bdaa9;
}

.panel-body {
    background-color: #212121;
}

.panel-footer {
    background-color: #3a3a3a;
}

.breadcrumb {
    background-color: #615454;
}

span .glyphicon {
    color:#cefff5 !important;
}

.table-striped > tbody > tr:nth-of-type(odd) > th {
    background-color: #6b5959;
}

.table-striped > tbody > tr:nth-child(odd) > td {
    background-color: #616161;
}

.table-striped > tbody > tr:nth-child(even) > td {
    background-color: #333;
}

.table-hover > tbody > tr:hover {
    background-color: #7d5d38;
}

.table-hover > tbody > tr:hover > td {
    background-color: #5d4545 !important;
}

.form-control {
    color: #b5b5b5;
    background-color: #524343;
}

.popover-content {
    color:#333;
}

.dropdown-menu {
    background-color: #02ce89a6;
}

.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {
    color: #e4e4e4;
    text-decoration: none;
    background-color: #00654391;
}
.dropdown-menu > li > a {
    color: #e4e4e4;
}

tr.active > th {
    background-color: #2d2d2d !important;
}

tr.info > td {
    background-color: #4c4c4c !important;
}
`
//.nav-tabs > li > a {
//    background-color: #292929;
//    color: #ececec;
//}
;

    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }


})();

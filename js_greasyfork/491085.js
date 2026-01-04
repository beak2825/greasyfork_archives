// ==UserScript==
// @name         Ciemny Motyw TD2 (SWDR4)
// @namespace    https://greasyfork.org/pl/scripts/416034-ciemny-motyw-dla-td2-swdr4
// @description  ciemny motyw dla td2.info.pl Autor Kapinitto @2024
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @version      1.0 (UNOFFICIAL)
// @author       Kapinitto @2024
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491085/Ciemny%20Motyw%20TD2%20%28SWDR4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491085/Ciemny%20Motyw%20TD2%20%28SWDR4%29.meta.js
// ==/UserScript==
/*------------------------------------------------------------------------------*/
/*NIE MODYFIKUJEMY bez zgody autora (w celu naprawy zgłoś się do autora skryptu)*/
 
/*---------------------------  Skrypt  ----------------------------*/
                       (function() {var css = [
 
/*---------------------------  Główne  ----------------------------*/
 
 
	"body, .login-page, .register-page, .content, .content-wrapper, .bg-white, content-wrapper swdrMainWindow {",
    "    background: #141414; ",
    "    background-color: #141414 !important; ",
    "}",
    ".col, .panel-default>.panel-heading+.panel-collapse>.panel-body, .panel-default>.panel-heading, .login-box-body, .register-box-body, .table-striped>tbody>tr:nth-of-type(odd), .box, .box-footer, .modal-body, .modal-footer, .modal-content, td.editorTD, tbody#editorMainObject, swdrCenterTable table-hover, .swdrCenterTable th {",
    "    background-color: #212121 !important; ",
    "}",
    ".form-control, .ui-menu, .dropup .dropdown-menu, select, .dropdown-menu, .dropdown-menu>li {",
    "    background-color: #141414 !important; ",
    "}",
    ".darkBorder {",
    "    background-color: #595959 !important; ",
    "}",
    ".modal-dialog.modal-lg, .box, .card {",
    "    border: 1px solid #444; ",
    "}",
    "card-header with-border{",
    "   background-color: #6b6b6b !important; ",
    "}",
 
/*-----------------------  Rozkłady Jazdy  ------------------------*/
 
    ".card {",
    "    background-color: #141414 !important; ",
    "}",
    "a[class|='navbar-brand'] {",
    "    color: #fff !important;",
    "}",
    "a .navbar-brand{",
    "    color: fff !important;",
    "}",
    "tr[style|='background-color:#3c3c3c;color:white'] {",
    "    background-color: #80000099 !important;",
    "}",
    "tr[style|='background-color:lightgray;'] {",
    "    background-color: #00800099 !important;",
    "}",
    "tr[style|='background-color:white;'] {",
    "    background-color: #1a1a1a !important;",
    "}",
    "tr[style|='background-color: 3c3c3c color:white'] {",
    "    background-color: #80000099 !important;",
    "}",
    "tr[style|='background-color: lightgray'] {",
    "    background-color: #00800099 !important;",
    "}",
    "tr[style|='background-color: white'] {",
    "    background-color: #1a1a1a !important;",
    "}",
    "/* .swdrCenterTable>tbody>tr {",
    "    background-color: #292929 !important;",
    "}*/",
    ".context-menu-item.context-menu-hover {",
    "    background-color: #353535 !important;",
    "}",
    ".context-menu-item {",
    "    color: #fff !important;",
    "}",
    ".context-menu-list {",
    "    background-color: #292929 !important;",
    "}",
    ".table-hover > tbody > tr:hover {",
    "    background-color: #262626 !important;",
    "}",
    ".manualTTLines>li {",
    "    color: #fff;",
    "}",
    ".manualTTLines>li {",
    "    background-color: #262626 !important;",
    "}",
    "#timetableErrorsMan>ul>li {",
    "    background-color: #de1a02 !important;",
    "}",
    ".context-menu-item.context-menu-submenu, .context-menu-item {",
    "    background: #212121",
    "}",
 
/*-------------------  do zmiany  --------------------*/
 
    "select#finishTimeSelectorModalSelect, body, .table, .login-logo, .register-logo, .login-box-body, .btn-danger, .btn-primary, .form-control, .close, tbody#swdrMainDispatchersTab>tr>td, tbody#swdrMainDriversTab>tr>td, table#ttTimeConfirmTable>tbody>tr>td, div.table-responsive.col-xs-12>table>tbody>tr>td,.h1, #swdrSettingsModal.modal.fade.in>.modal-dialog.modal-lg>.modal-content>.modal-body>.table.swdrCenterTable>tbody>tr>td, .swdrCenterTable.table-hover.swdrTimeTable>thead>tr, .swdrCenterTable.table-hover.swdrTimeTable>tbody>tr, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {",
    "    color: #fff !important;",
    "}",
    ".login-box-msg, .register-box-msg {",
    "    color: #f00 !important;",
    "}",
    "a {",
    "    color: #3c8dbc !important;",
    "}",
    " tr.cPointer.timetableMenuTrigger, .table-responsive>tbody>tr>td, .table.swdrCenterTable>tbody>tr>td {",
    "    color: #fff !important;",
    "}",
    " .jumbotron.text-center, .jumbotron .h1, .jumbotron h1 {",
    "    color: #444 !important;",
    "}",
    ".box-footer, .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {",
    "    border-top: 1px solid #212121 !important;",
    "}",
    ".box-header.with-border, .card-header {",
    "    border-bottom: 1px solid #444 !important;",
    "}",
    "div.direct-chat-text {",
    "    border: 1px solid #ffffff00;",
    "    background: #313131;",
    "    color: #fff;",
    "}",
    ".modal-footer {",
    "    border-top-color: #444 !important;",
    "}",
    ".direct-chat-text:after, .direct-chat-text:before {",
    "    border-right-color: #313131;",
    "}",
    ".direct-chat-text.bg-green:after, direct-chat-text.bg-green:before {",
    "    border-right-color: #00a65a;",
    "}",
    ".direct-chat-text.bg-darkgreen:after, direct-chat-text.bg-darkgreen:before {",
    "    border-right-color: #015401;",
    "}",
    ".direct-chat-text.bg-red:after, direct-chat-text.bg-red:before {",
    "    border-right-color: #dd4b39;",
    "}",
 
/*----------------------  przewijak  ---------------------*/
 
	" ::-webkit-scrollbar {",
	"    width: 10px!important;",
	"    height: 10px!important;",
	"}",
	"::-webkit-scrollbar-button {",
	"    width: 0px!important;",
	"    height: 0px!important;",
	"}",
	"::-webkit-scrollbar-thumb {",
	"    background: #6c6c6c!important;",
	"    border: none!important;",
	"    border-radius: 0px!important;",
	"}",
	"::-webkit-scrollbar-thumb:hover {",
	"    background: #6c6c6c!important;",
	"}",
	"::-webkit-scrollbar-thumb:active {",
	"    background: #7d7d7d!important;",
	"}",
	"::-webkit-scrollbar-track {",
	"    background: #313131!important;",
	"    border: none!important;",
	"    border-radius: 0px!important;",
	"}",
	"::-webkit-scrollbar-track:hover {",
	"    background: #333333!important;",
	"}",
	"::-webkit-scrollbar-track:active {",
	"    background: #4d4d4d!important;",
	"}",
	"::-webkit-scrollbar-corner {",
	"    background: transparent!important;",
	"}",
 
/*------------------  Tworzenie elementu skryptu  ---------------------*/
 
    ].join("\n");
      if (typeof GM_addStyle != "undefined") {
	    GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
	    PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
	    addStyle(css);
    } else {
	    var node = document.createElement("style");
	    node.type = "text/css";
	    node.appendChild(document.createTextNode(css));
	    var heads = document.getElementsByTagName("head");
	       if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	       }
       }
    })();
 
/*----------------------------  Dzwięki  -----------------------------*/
 
    $("audio#chatPMAudioPlayer").replaceWith(`<audio id="chatPMAudioPlayer"><source src="https://www.dropbox.com/scl/fi/rrnt7hwgpefc7nen4ktfc/DGT.flac?rlkey=mi37l7xfe62zlvgn61exy9pqm&st=d3lz20aq&raw=1" type="audio/flac"><source src="https://www.dropbox.com/scl/fi/hzxg41akxtrq3rgepkvmy/DGT.mp3?rlkey=b1vmis9ayhboifdt2oyzgaswz&st=f99vkpbl&raw=1" type="audio/mp3"></audio>`); 
$("audio#chatDMAudioPlayer").replaceWith(`<audio id="chatDMAudioPlayer"><source src="https://www.dropbox.com/scl/fi/shbdx8fb8pc0e5w3zcsx6/iniss-gong-oddelovaci.flac?rlkey=niz10jehxxhwqyga6jaadhqr2&st=niorhyw9&raw=1" type="audio/flac"><source src="https://www.dropbox.com/scl/fi/tf14i6qv6li06l7hgf501/iniss-gong-oddelovaci.mp3?rlkey=gabrscneuvgfiz1ibylx2bvho&st=jfpa9enk&raw=1" type="audio/mp3"></audio>`);
$("audio#crashAudioPlayer").replaceWith(`<audio id="crashAudioPlayer"><source src="https://www.dropbox.com/scl/fi/p49hqf9otl1eksmd6q4o6/Wykolejenie.flac?rlkey=mgm7soxwd00wscwou2sc80ruv&raw=1" type="audio/flac"><source src="https://www.dropbox.com/scl/fi/xthwkgjsbswx8fd251c17/Wykolejenie.mp3?rlkey=g0j6h64skscp61tnoywh54wpg&raw=1" type="audio/mp3"></audio>`);
$("audio#signalBlockEAPAudioPlayer").replaceWith(`<audio id="signalBlockEAPAudioPlayer"><source src="https://www.dropbox.com/scl/fi/l0tf65ckm2seagin243xn/3500.flac?rlkey=mta4u1u5xk498rph8619v8jbr&st=vqzwscd5&raw=1" type="audio/flac"><source src="https://www.dropbox.com/scl/fi/e43t4h09wdkr5zlxwwglf/3500.mp3?rlkey=ngjuv5moccfetysijz3m2pgno&st=qndz4rpm&raw=1" type="audio/mp3"></audio>`);
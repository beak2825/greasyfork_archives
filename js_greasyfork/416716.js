// ==UserScript==
// @name         Ciemny Motyw dla td2 (WWW) v.2
// @namespace    https://greasyfork.org/pl/scripts/416034-ciemny-motyw-dla-td2-www
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://rj.td2.info.pl/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416716/Ciemny%20Motyw%20dla%20td2%20%28WWW%29%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/416716/Ciemny%20Motyw%20dla%20td2%20%28WWW%29%20v2.meta.js
// ==/UserScript==

(function() {var css = [

"/* Dodane */",
    "a[class|='navbar-brand'] {",
    "color: #fff !important;",
    "}",
    "a .navbar-brand{",
    "color: fff !important;",
    "}",
    "tr[style|='background-color: lightgray'] {",
    "background-color: #404040 !important;",
    "}",
    "tr[style|='background-color: white'] {",
    "background-color: #1a1a1a !important;",
    "}",
    "tr[style|='background-color:white;'] {",
    "background-color: #1a1a1a !important;",
    "}",
    "tr[style|='background-color:lightgray;'] {",
    "background-color: #404040 !important;",
    "}",
    "/* .swdrCenterTable>tbody>tr{",
    "background-color: #292929 !important;",
    "}*/",

"/* Główne */",
	"body, .login-page, .register-page, .content, .content-wrapper, .bg-white, content-wrapper swdrMainWindow {",
    "    background: #1b1b1b !important;",
    "    background-color: #1b1b1b !important;",
    "}",
    ".login-box-body, .register-box-body, .table-striped>tbody>tr:nth-of-type(odd), .box, .box-footer, .modal-body, .modal-footer, .modal-content, td.editorTD, tbody#editorMainObject, swdrCenterTable table-hover, .swdrCenterTable th {",
    "    background-color: #212121 !important; ",
    "}",
    " .form-control, .ui-menu, .dropup .dropdown-menu, select, .dropdown-menu, .dropdown-menu>li {",
    "    background-color: #313131 !important; ",
    "}",
"/* do zmiany */",
    "body, .login-logo, .register-logo, .login-box-body, .btn-danger, .btn-primary, .form-control, tbody#swdrMainDispatchersTab>tr>td, tbody#swdrMainDriversTab>tr>td, table#ttTimeConfirmTable>tbody>tr>td, div.table-responsive.col-xs-12>table>tbody>tr>td,.h1, #swdrSettingsModal.modal.fade.in>.modal-dialog.modal-lg>.modal-content>.modal-body>.table.swdrCenterTable>tbody>tr>td, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {",
    "    color: #fff !important;",
    "}",
    ".login-box-msg, .register-box-msg {",
    "    color: #f00 !important;",
    "}",
    "a {",
    "    color: #337ab7 !important;",
    "}",
    " tr.cPointer.timetableMenuTrigger, .table-responsive>tbody>tr>td, .table.swdrCenterTable>tbody>tr>td, .jumbotron.text-center, .jumbotron .h1, .jumbotron h1 {",
    "    color: #fff !important;",
    "}",
    ".box-footer, .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {",
    "    border-top: 1px solid #212121 !important;",
    "}",
    ".box-header.with-border {",
    "    border-bottom: 1px solid #212121 !important;",
    "}",
    ".direct-chat-text {",
    "    border: 1px solid #ffffff00;",
    "}",
"/* przewijak */",
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
	"}"
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}
)();
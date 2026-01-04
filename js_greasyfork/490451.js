// ==UserScript==
// @name uso - openuserjs.org Dark Edition
// @namespace 7kt-uso
// @version 1.0.2
// @description A dark style for openuserjs.org
// @author 7KT-SWE
// @homepageURL https://7kt.se/
// @grant GM_addStyle
// @run-at document-start
// @match *://*.openuserjs.org/*
// @downloadURL https://update.greasyfork.org/scripts/490451/uso%20-%20openuserjsorg%20Dark%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/490451/uso%20-%20openuserjsorg%20Dark%20Edition.meta.js
// ==/UserScript==

(function() {
let css = `
		* {
		scrollbar-color: #474747 transparent !important;
		scrollbar-width: thin !important;
	}
	body {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
		font-size: 14px !important;
		line-height: 1.42857143 !important;
		color: #ccc !important;
		background-color: #191919 !important;
	}
	.panel {
		margin-bottom: 20px !important;
		background-color: #232323 !important;
		border: 1px solid #343434 !important;
		border-radius: 4px !important;
		-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05) !important;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .05) !important;
	}
	.panel-default > .panel-heading {
		color: #f1f1f1 !important;
		background-color: #595959 !important;
		border-color: #505050 !important;
	}
	.table-hover > tbody > tr:hover {
		background-color: #333 !important;
	}
	.table > tbody > tr > td,
	.table > tbody > tr > th,
	.table > tfoot > tr > td,
	.table > tfoot > tr > th,
	.table > thead > tr > td,
	.table > thead > tr > th {
		padding: 8px !important;
		line-height: 1.42857143 !important;
		vertical-align: top !important;
		border-top: 1px solid #343434 !important;
	}
	.pagination > li > a,
	.pagination > li > span {
		position: relative !important;
		float: left !important;
		padding: 6px 12px !important;
		margin-left: -1px !important;
		line-height: 1.42857143 !important;
		color: #ffffff !important;
		text-decoration: none !important;
		background-color: #333 !important;
		border: 1px solid #505050 !important;
	}
	.pagination > li > a:focus,
	.pagination > li > a:hover,
	.pagination > li > span:focus,
	.pagination > li > span:hover {
		z-index: 2 !important;
		color: #ffffff !important;
		background-color: #595959 !important;
		border-color: #343434 !important;
	}
	.pagination > .active > a,
	.pagination > .active > a:focus,
	.pagination > .active > a:hover,
	.pagination > .active > span,
	.pagination > .active > span:focus,
	.pagination > .active > span:hover {
		z-index: 3 !important;
		color: #fff !important;
		cursor: default !important;
		background-color: #df691a !important;
		border-color: #2c3e50 !important;
	}
	.table > tbody > tr.active > td,
	.table > tbody > tr.active > th,
	.table > tbody > tr > td.active,
	.table > tbody > tr > th.active,
	.table > tfoot > tr.active > td,
	.table > tfoot > tr.active > th,
	.table > tfoot > tr > td.active,
	.table > tfoot > tr > th.active,
	.table > thead > tr.active > td,
	.table > thead > tr.active > th,
	.table > thead > tr > td.active,
	.table > thead > tr > th.active {
		background-color: #595959 !important;
	}
	.table > thead > tr > th {
		vertical-align: bottom !important;
		border-bottom: 2px solid #343434 !important;
	}
	.visible-md {
		display: block!important !important;
		color: #f1f1f1 !important;
	}
	a:focus,
	a:hover {
		color: #ffffff !important;
		text-decoration: underline !important;
	}
	th > a {
		display: block !important;
		color: #f1f1f1 !important;
	}
	.label-default {
		color: #f1f1f1 !important;
	}
	.label-default {
		background-color: #2c3e50 !important;
	}
	.badge {
		display: inline-block !important;
		min-width: 10px !important;
		padding: 2px 4px !important;
		font-size: 11px !important;
		font-weight: 700 !important;
		line-height: 1 !important;
		color: #fff !important;
		text-align: center !important;
		vertical-align: middle !important;
		background-color: #2c3e50 !important;
		border-radius: 2px !important;
	}
	.form-control {
		display: block !important;
		width: 100% !important;
		height: 34px !important;
		padding: 6px 12px !important;
		font-size: 14px !important;
		line-height: 1.42857143 !important;
		color: #555 !important;
		background-color: #232323 !important;
		background-image: none !important;
		border: 1px solid #505050 !important;
		border-radius: 4px !important;
		-webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s !important;
		-o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s !important;
		transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s !important;
	}
	.ace-dawn {
		background-color: #191919 !important;
		color: #ffffff !important;
	}
	.ace-dawn .ace_comment {
		font-style: italic !important;
		color: #adadad !important;
	}
	.ace-dawn .ace_string {
		color: #5dcb7f !important;
	}
	.ace-dawn .ace_constant,
	.ace-dawn .ace_constant.ace_character,
	.ace-dawn .ace_constant.ace_character.ace_escape,
	.ace-dawn .ace_constant.ace_other {
		color: #fc525b !important;
	}
	.ace-dawn .ace_storage {
		font-style: italic !important;
		color: #ff3995 !important;
	}
	.ace-dawn .ace_keyword,
	.ace-dawn .ace_meta {
		color: #ff9b78 !important;
	}
	.ace-dawn .ace_variable {
		color: #79a6ff !important;
	}
	.ace-dawn .ace_list,
	.ace-dawn .ace_markup.ace_list,
	.ace-dawn .ace_support.ace_function {
		color: #c58250 !important;
	}
	.ace-dawn .ace_gutter {
		background: #343434 !important;
		color: #f1f1f1 !important;
	}
	.ace-dawn .ace_gutter-active-line {
		background-color: #565656 !important;
	}
	.ace-dawn .ace_print-margin {
		width: 1px !important;
		background: #464646 !important;
	}
	pre {
		display: block !important;
		padding: 9.5px !important;
		margin: 0 0 10px !important;
		font-size: 13px !important;
		line-height: 1.42857143 !important;
		color: #337 !important;
		/* word-break: break-all !important; */
		word-wrap: break-word !important;
		background-color: #191919 !important;
		border: 1px solid #505050 !important;
		border-radius: 4px !important;
	}
	.table-striped > tbody > tr:nth-of-type(odd) {
		background-color: #333 !important;
	}
	.list-group-item {
		position: relative !important;
		display: block !important;
		padding: 10px 15px !important;
		/* margin-bottom: -1px !important; */
		background-color: #232323 !important;
		border: 1px solid #505050 !important;
	}
	.md-editor > textarea {
		font-family: Menlo, Monaco, Consolas, "Courier New", monospace !important;
		font-size: 14px !important;
		outline: 0 !important;
		margin: 0 !important;
		display: block !important;
		padding: 0 !important;
		width: 100% !important;
		border: 0 !important;
		border-top: 1px dashed #ddd !important;
		border-bottom: 1px dashed #ddd !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		background: #191919 !important;
	}
	.md-editor > textarea:focus {
		box-shadow: none !important;
		background: #191919 !important;
	}
	.md-editor > textarea {
		font-family: Menlo, Monaco, Consolas, "Courier New", monospace !important;
		font-size: 14px !important;
		outline: 0 !important;
		margin: 0 !important;
		display: block !important;
		padding: 0 !important;
		width: 100% !important;
		border: 0 !important;
		border-top: 1px dashed #999 !important;
		border-bottom: 1px dashed #999 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		background: #191919 !important;
	}
	.md-editor {
		display: block !important;
		border: 1px solid #999 !important;
	}
	.md-editor.active {
		border-color: #8d8d8d !important;
		outline: 0 !important;
	}
	.form-control:focus {
		border-color: #8d8d8d !important;
		outline: 0 !important;
	}
	.breadcrumb {
		padding: 8px 15px !important;
		margin-bottom: 20px !important;
		list-style: none !important;
		background-color: #333333 !important;
		border-radius: 4px !important;
	}
	.md-editor .md-footer,
	.md-editor > .md-header {
		display: block !important;
		padding: 6px 4px !important;
		background: #333 !important;
	}
	.input-group-addon {
		padding: 6px 12px !important;
		font-size: 14px !important;
		font-weight: 400 !important;
		line-height: 1 !important;
		color: #555 !important;
		text-align: center !important;
		background-color: #232323 !important;
		border: 1px solid #505050 !important;
		border-radius: 4px !important;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

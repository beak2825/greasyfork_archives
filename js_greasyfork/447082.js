// ==UserScript==
// @name		JSFiddle buttons
// @description	Hide sidebar, maximize views
// @version		1.0.0
// @namespace	BP
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		https://jsfiddle.net/*
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require 	https://greasyfork.org/scripts/447081-bp-funcs/code/BP%20Funcs.js
// @run-at		document-body
// @noframes
// @grant		GM_addStyle
// @connect		*
// @downloadURL https://update.greasyfork.org/scripts/447082/JSFiddle%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/447082/JSFiddle%20buttons.meta.js
// ==/UserScript==

/* jshint loopfunc: true, -W027 */
/* eslint-disable curly, no-redeclare */
/* eslint no-trailing-spaces: off */
/* globals $, GM_info, GM_setValue, GM_getValue, GM_xmlhttpRequest, GM_addStyle, escape, uneval, unsafeWindow, BPLogger_default, log, getParam, waitFor */

var logger = BPLogger_default();

function main(){
	GM_addStyle(`
	#sidebar{
		position: relative;
	}
	.sidebar-hidden #sidebar{
		width: 0;
	}
	.sidebar-hidden #sidebar section{
		display: none;
	}
	#layout-container.sidebar-hidden{
		grid-template-columns: 0px 1fr;
	}
	.bp-toggle{
		position: absolute;
		right: 0;
		top: 0;
		padding: 10px 3px;
		z-index: 100;
		font-weight: 900;
		background: #1f2227;
		border: 1px solid #2c2f34;
		border-right: none;
		border-radius: 5px 0 0 5px;
		cursor: pointer;
		opacity: 0.5;
	}
	.sidebar-hidden #sidebar .bp-toggle{
		right: unset;
		left: 100%;
		border: 1px solid #2c2f34;
		border-left: none;
		border-radius: 0 5px 5px 0;
	}
	.bp-toggle:hover{
		opacity: 1;
	}
	#sidebar .bp-toggle::before{
		content: "<<";
	}
	.sidebar-hidden #sidebar .bp-toggle::before{
		content: ">>";
	}
	
	#editor.hasMax .panel{
		display: none;
	}
	#editor.hasMax .panel-v{
		display: none;
		width: 0%;
	}
	#editor.hasMax .panel-v.max{
		display: block;
		width: calc(100% - 1px) !important;
		position: absolute;
	}
	#editor.hasMax .panel.max{
		display: block;
		height: calc(100% - 1px) !important;
		width: calc(100% - 1px);
		position: absolute;
	}
	.panel .bp-toggle{
		bottom: 0px;
		top: unset;
		padding: 5px;
		color: #fff;
		border: 1px solid #2c2f34;
		border-bottom: none;
		border-right: none;
		border-radius: 5px 0 0;
	}	
	.panel .bp-toggle::before{
		content: "\\26F6";
	}
	`);
	waitFor("#sidebar", function(o){
		log("got sidebar");
		$("<div class='bp-toggle' title='Toggle Sidebar'></div>").appendTo(o).click(function(){
			log("clicked toggle");
			$("#layout-container").toggleClass("sidebar-hidden");
		});
	});
	waitFor({
		sel: "#editor .panel",
		cb: function(o){
			log("got panels", o);
			$("<div class='bp-toggle' title='Toggle Panel Maximize'></div>").appendTo(o).click(function(){
				var p = $(this).parent();
				p.toggleClass("max");
				p.parent().toggleClass("max");
				$("#editor").toggleClass("hasMax");
				$("body").resize();
				// log("clicked toggle", t, p);
			});
		},
		maxTries: -1
	});
	
}

setTimeout(main, 0);
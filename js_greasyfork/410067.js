// ==UserScript==
// @name         Revert StackExchange Formatting
// @namespace    https://github.com/Prid13/Revert-StackExchange-Formatting
// @version      1.2.1
// @history      1.2.1 updated script to reflect new changes (as per Sep 24)
// @history      1.1.1 added downloadURL and update URL to meta
// @history      1.1.0 fully implemented old paragraph spacing
// @history      1.0.8 added old compact paragraph spacing (margin-bottom)
// @history      1.0.5 fixed bug: first line in code blocks being indented
// @description  Brings back the old line-height, colors, padding, borders, etc. of StackExchange websites like StackOverflow, SuperUser, ServerFault, etc.
// @author       Prid
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)//
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410067/Revert%20StackExchange%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/410067/Revert%20StackExchange%20Formatting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = "";

    var values = {
        line_height: 1.3,
        
        paragraph_spacing: "15px",

        code_block_bgcol: "#eff0f1",
        code_block_padding: "12px 8px",
        code_block_radius: "3px",

        inline_code_bgcol: "#e4e6e8",
        inline_code_padding: "1px 5px",
        inline_code_radius: "0px",

        comment_code_bgcol: "#eff0f1",
        comment_code_padding: "1px 5px",
    };

    buildCSS();
    injectCSS();

    function buildCSS(){
        var line_height = values.line_height;

        // paragraphs (revert line-height)
        style += ".s-prose { line-height: " + line_height + "!important; }";
        
        // OLD PARAGRAPH SPACING
    		style += ".s-prose p, .s-prose ol, .s-prose ul, .s-prose blockquote, .s-prose hr { ";
    		style += 	"margin-bottom: "		+ values.paragraph_spacing + "!important;"; // 15px
    		style += "}";
    		
    		// margin-bottom for <pre>
    		style += ".s-prose pre { ";
    		style += 	"margin-bottom: "		+ "13px!important;";
    		style += "}";
    		
    		// margin-bottom for ul li, ol li
    		style += ".s-prose ol li, .s-prose ul li { ";
    		style += 	"margin-bottom: "		+ "7.5px!important;";
    		style += "}";
    		// fix margin-bottom for last element in ol and ul
    		style += ".s-prose ol li:last-child, .s-prose ul li:last-child { ";
    		style += 	"margin-bottom: "		+ "0!important;";
    		style += "}";
    		
    		// heading margin-bottom
    		style += ".s-prose h1 { margin-bottom: 21px!important; }";
    		style += ".s-prose h2 { margin-bottom: 19px!important; }";
    		style += ".s-prose h3 { margin-bottom: 17px!important; }";
    		style += ".s-prose h4 { margin-bottom: 15px!important; }";
    		
    		// fix margin-bottom for last element in blockquote
    		style += ".s-prose blockquote *:last-child { ";
    		style += 	"margin-bottom: "		+ "0!important;"; // don't apply to blockquotes
    		style += "}";

        // ADDITIONAL REVERSIONS
            // code blocks
            style += ".s-prose pre.s-code-block, .s-prose pre:not(.s-code-block) { ";
            style += 	"line-height: " 		+ line_height + "!important;";
            style += 	"background-color: " 		+ values.code_block_bgcol + "!important;";
            style += 	"padding: " 			+ values.code_block_padding + "!important;";
            style += 	"border-radius: " 		+ values.code_block_radius + "!important;";
            style += "}";

            // fix inline code styling overriding code blocks (add transparent bg, remove padding)
			style += ".s-prose pre.s-code-block code, .s-prose pre:not(.s-code-block) code { ";
			style += 	"background-color: transparent!important;";
			style += 	"padding: 0!important;";
			style += "}";

            // inline code
            style += ".s-prose *:not(.s-code-block) > code {";
            style += 	"background-color: " 		+ values.inline_code_bgcol + "!important;";
            style += 	"padding: " 			+ values.inline_code_padding + "!important;";
            style += 	"border-radius: " 		+ values.inline_code_radius + "!important;";
            style += "}";

            // comment inline code
            style += ".comment-text code {";
            style += 	"background-color: " 		+ values.comment_code_bgcol + "!important;";
            style += 	"padding: " 			+ values.comment_code_padding + "!important;"; // padding is same
            style += "}";

    }

    function injectCSS(){
        // credit: https://stackoverflow.com/a/13436780/3705191
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        var rules = document.createTextNode(style);
        cssStyle.appendChild(rules);
        document.getElementsByTagName("head")[0].appendChild(cssStyle);
    }
})();
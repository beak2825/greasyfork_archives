// ==UserScript==
// @name             WorkFlowy CommonMark live preview
// @namespace        http://codeoptimism.com/
// @version          1.0
// @description      Render a live CommonMark-interpreted preview of WorkFlowy notes: On nodes with a description, preview appears beneath while edit window is limited to a specific height with a scrollbar. Doesn't affect nodes without a description.
// @author           Christopher Galpin
// @license          MIT
// @contributionURL  https://www.paypal.com/donate/?token=J_EdsnWs02cJRSpntD-QR8w9JFbbUJaSHkgOk_c2tOhWuSPxtH_6OipUutJE07ZnqGZgFG
// @match            https://workflowy.com/
// @grant            GM_addStyle
// @require          https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// @require          https://gitcdn.link/cdn/andreyfedoseev/jquery-textareaPreview/342c1059940021f0f7bf84b3898773e7e5e4ec3a/jquery.textareaPreview.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.min.js
// @downloadURL https://update.greasyfork.org/scripts/27429/WorkFlowy%20CommonMark%20live%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/27429/WorkFlowy%20CommonMark%20live%20preview.meta.js
// ==/UserScript==

// Uses Andrey Fedoseev's textAreaPreview jQuery plugin: https://github.com/andreyfedoseev/jquery-textareaPreview
// styles shamelessly stolen from http://stackoverflow.com
var styles = `
#cm a:hover,#cm a:active{color:#3af;text-decoration:none}
#cm a{color:#07C;text-decoration:none;cursor:pointer}
#cm blockquote *:last-child{margin-bottom:0}
#cm blockquote,#cm q{quotes:none}
#cm blockquote:before,#cm q:before,#cm blockquote:after,#cm q:after{content:"";content:none}
#cm blockquote{margin-bottom:10px;padding:10px;background-color:#FFF8DC;border-left:2px solid #ffeb8e}
#cm code{font-family:Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;background-color:#eff0f1}
#cm code{font-size:13px}
#cm code{white-space:pre-wrap;padding:1px 5px}
#cm h1 code,#cm h2 code,#cm h3 code,#cm h4 code,#cm h5 code,#cm h6 code{margin-bottom:.5em}
#cm h1,#cm h1 code{font-size:21px}
#cm h1,#cm h2,#cm h3,#cm h4,#cm h5,#cm h6{font-weight:bold !important}
#cm h1,#cm h2,#cm h3{line-height:1.3;margin-bottom:1em;}
#cm h1{font-size:22px}
#cm h2,#cm h2 code{font-size:19px}
#cm h2{font-size:18px}
#cm h3,#cm h3 code{font-size:17px}
#cm h3{font-size:15px}
#cm h4,#cm h4 code{font-size:15px}
#cm hr{background-color:#d6d9dc;color:#d6d9dc}
#cm img{max-width:100%;margin-bottom:.5em}
#cm li blockquote{margin:.5em 0 1em 0}
#cm li pre{margin:.5em 0 1em 0}
#cm li pre{word-wrap:normal}
#cm li>ul,#cm li>ol{padding-top:.5em}
#cm li{word-wrap:break-word}
#cm ol{list-style-type:decimal}
#cm p code{padding:1px 5px}
#cm p img,#cm li img,#cm blockquote img{margin-bottom:0}
#cm p.lead small{display:block;font-size:13px;color:#5e666e}
#cm p.lead{font-size:1.3em;line-height:1.5em}
#cm pre code{white-space:inherit;padding:0}
#cm pre>code:first-child{max-height:600px;display:block}
#cm pre{-ms-word-wrap:normal;word-wrap:normal}
#cm pre{margin-bottom:1em;padding:5px;padding-bottom:20px !ie7;width:auto;width:650px !ie7;max-height:600px;overflow:auto;font-family:Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;font-size:13px;background-color:#eff0f1}
#cm pre{max-height:none}
#cm pre{word-wrap:normal}
#cm p{clear:both;margin-bottom:1em;margin-top:0}
#cm p{font-size:100%}
#cm ul li,#cm ol li{margin-bottom:.5em}
#cm ul li:last-child,#cm ol li:last-child{margin-bottom:0}
#cm ul p:last-of-type,#cm ol p:last-of-type{margin-bottom:0}
#cm ul ul,#cm ol ul,#cm ul ol,#cm ol ol{margin-bottom:0}
#cm ul,#cm ol,#cm li{margin:0;padding:0}
#cm ul,#cm ol{margin-left:30px;margin-bottom:1em}
#cm ul{list-style-type:disc}
#cm{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;padding:10px 0;border-top:1px dotted #c8ccd0;border-bottom:1px dotted #c8ccd0;clear:both}
#cm{margin-top:-4px}
#cm{width:660px;margin-bottom:5px;word-wrap:break-word;font-size:15px;line-height:1.3}
`;

GM_addStyle(styles);

(function() {
    'use strict';
    var jQuery_1_6_1 = $.noConflict(true);
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer({sourcepos: false, softbreak: '<br />'});

    // explained below
    jQuery_1_6_1.fn.overrideNodeMethod = function(methodName, action) {
        var originalVal = jQuery_1_6_1.fn[methodName];
        var thisNode = this;
        jQuery_1_6_1.fn[methodName] = function() {
            if (this[0] == thisNode[0]) {
                return action.apply(this, arguments);
            } else {
                return originalVal.apply(this, arguments);
            }
        };
    };

    setInterval(function() {
        var $topNote = jQuery_1_6_1("div.selected > div.notes .content");
        if ($topNote.length === 0)
            return;
        if ($topNote.attr('data-hasPreview')) {
            return;
        }

        if (jQuery_1_6_1('#cm').length === 0)
            jQuery_1_6_1('#pageContainer').append("<div id='cm' style='display: none; background-color: white; padding: 30px 60px 10px; width: 820px; margin: 15px auto;'></div>");

        if (!$topNote.text().trim()) {
            jQuery_1_6_1('#cm').css('display', 'none');
            jQuery_1_6_1('#pageContainer > div:first').css({'height': 'auto', 'overflow-y': 'inherit'});
            return;
        }

        jQuery_1_6_1('#cm').css('display', 'inherit');
        jQuery_1_6_1('#pageContainer > div:first').css({'height': '400px', 'overflow-y': 'scroll'});

        // Andrey Fedoseev's textareaPreview expects a textarea, so uses val()
        // but WorkFlowy uses editable div's, so we override val()
        $topNote.overrideNodeMethod('val', function() {
            // needed by CommonMark
            var softSpaced = this.html().replace(/&nbsp;/g, ' ');
            return jQuery_1_6_1("<div/>").html(softSpaced).text();
        });

        $topNote.textareaPreview({
            container: '#cm',
            preprocess: function(text) {
                var parsed = reader.parse(text);
                var result = writer.render(parsed);
                return result;
            }
        });

        $topNote.attr('data-hasPreview', true);
    }, 100);
})();

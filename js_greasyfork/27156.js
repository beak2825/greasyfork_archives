// ==UserScript==
// @name         goodreadsReply
// @namespace    http://pointerstop.ca/
// @version      0.6.3
// @description  Quote only the selected text on a Goodreads comment reply; allow user to use Markdown
// @author       derek@pointerstop.ca
// @match        https://www.goodreads.com/topic/*
// @match        https://www.goodreads.com/review/show/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min.js
// @downloadURL https://update.greasyfork.org/scripts/27156/goodreadsReply.user.js
// @updateURL https://update.greasyfork.org/scripts/27156/goodreadsReply.meta.js
// ==/UserScript==
function makeHTML(comment){
    var options   = {simplifiedAutoLink: true,
                     excludeTrailingPunctuationFromURLs: true,
                     literalMidWordUnderscores: true,
                     strikethrough: true
                    };
    var converter = new showdown.Converter(options),
        text      = comment.val(),
        html      = converter.makeHtml(text).replace(/<p>/g, '\n').replace(/<\/p>/g, '');
    comment.val(html);
}
jQuery(function($) {
    'use strict';
    var preview = $("input:submit + span + a");
    var commentText = $('textarea');
    var clickHandler = preview.prop("onclick");
    preview.prop("onclick",null);
    $("input:submit").on('click', function(){
        makeHTML(commentText);
    });
    preview.on('click', function(){
        makeHTML(commentText);
        clickHandler();
    });
    $("#box #close").on('click',function(){ commentText.focus(); });
    // turn off all the old click handlers
    $("a[href='#comment_form']").prop("onclick", null);

    // attach the new click handlers
    $("a[href='#comment_form']").on('click', function (e) {
        // disable the default handler
        e.preventDefault();
        // find the parent comment, the author's name, and the comment text
        var comment = $(e.target).parents("div.comment");
        var author = comment.find("span.commentAuthor a").text();
        var text = comment.find("div.reviewText");
        // use the selected text, if it exists, else the first 200 characters of the comment
        var selection = "";
        try {
            // if we're selecting a text node... get the selection
            if (window.getSelection().anchorNode.parentElement==text[0]){
                selection = window.getSelection().toString();
            }
        } catch(e) { // we don't care about errors
        }
        // if nothing has been selected, use GoodRead's normal default of the first 200 chars
        if (!selection) {
            selection = text.text().trim();
            if (selection.length > 200) {
                selection = selection.substring(0, 200) + '...';
            }
        }
        var quoteText = '<i>' + author + ' wrote: "' + selection + '"</i>\n\n';

        // use 'text()' to get the value, but 'val()' to set it, because carriage
        // returns are stripped by val()
        commentText.val(commentText.val() + quoteText);
        commentText.focus();
    });
});
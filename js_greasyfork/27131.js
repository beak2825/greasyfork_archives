// ==UserScript==
// @name         devRant - Quick Emoji
// @namespace    pxgamer
// @version      0.3
// @description  A quick emoji bar for devRant.io
// @author       pxgamer
// @include      *devrant.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27131/devRant%20-%20Quick%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/27131/devRant%20-%20Quick%20Emoji.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    $('head').append('<style>.quickEmoji{cursor:pointer}.emojibar{background-color:#aaaab8;color:#fff;padding:4px 14px;font-size:14px;border-bottom:0.2em solid grey}</style>');

    jQuery.fn.extend({
        insertAtCaret: function(myValue){
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });

    $('.post-rant-bottom').before(`
<div class="emojibar">
<span class="quickEmoji" title="Grinning">?</span>
<span class="quickEmoji" title="Joy">?</span>
<span class="quickEmoji" title="Smile">?</span>
<span class="quickEmoji" title="Rofl">?</span>
<span class="quickEmoji" title="Laugh">?</span>
<span class="quickEmoji" title="Wink">?</span>
<span class="quickEmoji" title="Neutral">?</span>
<span class="quickEmoji" title="Smiley eyes">?</span>
<span class="quickEmoji" title="Sad">☹️</span>
<span class="quickEmoji" title="Weary">?</span>
<span class="quickEmoji" title="Love">?</span>
<span class="quickEmoji" title="Cool">?</span>
</div>
`);

    $('.quickEmoji').click(function(){
        var emoji = $(this).text();
        if (location.href.indexOf('rants/') > -1) {
            $('#comment').insertAtCaret(emoji);
        } else {
            $('#rant').insertAtCaret(emoji);
        }
    });
})();
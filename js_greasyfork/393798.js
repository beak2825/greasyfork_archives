// ==UserScript==
// @name         strikethrough text for scboy.cc
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Allow to post strikethrough text on thread reply page.
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/393798/strikethrough%20text%20for%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/393798/strikethrough%20text%20for%20scboycc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        if (window.location.href.indexOf('post-create-') === -1 && window.location.href.indexOf('post-update-') === -1 && window.location.href.indexOf('thread-create-') === -1) {
            return;
        }

        var styles = '<style>.deleted div.message { text-decoration: line-through; color: grey !important; } .figure {display: inline-block;}</style>';
        $('#ueditor_0').contents().find('head').append(styles);

        var $wrapper = $('#edui11');
        var $btnContent = $('<div id="edui11_state" onmouseover="$EDITORUI[&quot;edui11&quot;].Stateful_onMouseOver(event, this);" onmouseout="$EDITORUI[&quot;edui11&quot;].Stateful_onMouseOut(event, this);" class="edui-default"><div class="edui-button-wrap edui-default"><div id="edui11_body" unselectable="on" title="删除线" class="edui-button-body edui-default" ><div class="edui-box edui-icon edui-default"></div></div></div></div>');
        var wrapper1 = '<div class="deleted figure">';
        var wrapper2 = '<div class="message figure">';

        $wrapper.empty().append($btnContent);

        $btnContent.click(function() {
            var sel = ue.selection;
            var range = sel.getRange();
            var parent = sel.getStart();
            var content;

            content = parent.textContent;    /* warning: undefined behaviour if $parent contains non-text child nodes */
            content = content.slice(0, range.startOffset) + wrapper1 + wrapper2 + content.slice(range.startOffset, range.endOffset) + '</div></div>' + content.slice(range.endOffset);
            parent.innerHTML = content;

            replaceElementTag(parent, '<div></div>')
        });

        function toggleTooltip($elem) {
            var $tooltip = $elem.children('.edui-tooltip');
            $tooltip.is(':visible') ? $tooltip.hide() : $tooltip.show();
        }
        function replaceElementTag(targetSelector, newTagString) {
            $(targetSelector).each(function(){
                var newElem = $(newTagString, {html: $(this).html()});
                $.each(this.attributes, function() {
                    newElem.attr(this.name, this.value);
                });
                $(this).replaceWith(newElem);
            });
        }
    });
})();
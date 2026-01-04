// ==UserScript==
// @name         bypass censorship on scboy.cc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allow to post forbidden words on thread create & reply page.
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/402048/bypass%20censorship%20on%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/402048/bypass%20censorship%20on%20scboycc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        if (window.location.href.indexOf('post-create-') === -1 && window.location.href.indexOf('post-update-') === -1 && window.location.href.indexOf('thread-create-') === -1) {
            return;
        }

        let $btn = $(`<div class="edui-box edui-button edui-default">
            <div class="edui-default">
                <div class="edui-button-wrap edui-default">
                    <div  unselectable="on" title="敏感词" class="edui-button-body edui-default">
                        <div class="edui-box edui-default">敏</div>
                    </div>
                </div>
            </div>
        </div>`).appendTo('.edui-toolbar');

        $btn.click(function() {
            var sel = ue.selection;
            var range = sel.getRange();
            var parent = sel.getStart();
            var content;

            if (range.startOffset === range.endOffset) {
                return;
            }

            content = parent.textContent;    /* warning: undefined behaviour if $parent contains non-text child nodes */
            content = content.slice(0, range.startOffset + 1) + '<strong class="valid-feedback" style="display: none;">#</strong>' + content.slice(range.startOffset + 1);
            parent.innerHTML = content;
            alert('完成，请勿对同一字符串重复操作！');
        });
    });
})();
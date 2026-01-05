// ==UserScript==
// @name         tower-tag
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hilight defrent color
// @author       jswh
// @match        https://tower.im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20764/tower-tag.user.js
// @updateURL https://update.greasyfork.org/scripts/20764/tower-tag.meta.js
// ==/UserScript==

(function () {
    $(document).ready(function() {change();});
    $(document).on('DOMNodeInserted', function(e) {
        if(e.target.className == 'todos-all todos-view member-view' || e.target.className == 'todos-all todos-view list-view' || e.target.className == 'simple-filedrop') {
        change();
        }
    });
    function change() {
        $('.tag').each(function (i, tag) {
        $tag = $(tag);
        tagText = $tag.text();
        switch (tagText) {
            case 'block-header':
                $todo = $tag.closest('.todo');
                $todo.css({
                    'margin':'10px 0',
                    'text-align':'center'
                });
                $wrap = $tag.closest('.todo-wrap');
                $wrap.children('.simple-checkbox').hide();
                $wrap.children('.todo-detail').hide();
                $wrap.children('.todo-content').css({ 'color':'#333333'});
                $tag.hide();
                break;
            case 'bug':
            case 'BUG':
                $tag.removeClass('tag');
                $tag.css({
                    'background-color': '#fb93b8 !important',
                    'color': '#fff !important',
                    'padding': '0.1em 0.2em',
                    'vertical-align': '1px',
                    'font-size': '82%',
                    'font-weight': 'normal',
                    'border-radius': '2px'
                });
                break;
            default:
                break;
        }

    });
    }
})();
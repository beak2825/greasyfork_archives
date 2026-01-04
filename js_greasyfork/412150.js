// ==UserScript==
// @name         beauful_jira
// @namespace    https://bricre.atlassian.net/jira
// @version      0.3
// @description  jira美化扩展
// @author       ZHLH
// @match         https://bricre.atlassian.net/jira/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412150/beauful_jira.user.js
// @updateURL https://update.greasyfork.org/scripts/412150/beauful_jira.meta.js
// ==/UserScript==

(function () {
    $(function () {
        var $header = $('[data-testid=atlassian-navigation--header]');
        $header.append(`<div id="_expand" style="position: absolute;top: 51px;left: 50%;display: inline-block;text-align: center;width: 50px;height: 24px;background: #eee;transform: rotate(180deg);z-index: 10;"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z" fill="currentColor" fill-rule="evenodd"></path></svg></div>`)
        $('#_expand').on('click', function () {
            if ($header.parent().data('state') == 'small') {
                $header.parent().css({
                    top: '0px'
                }).data('state', 'max')
                return;
            }
            $header.parent().css({
                top: '-50px'
            }).data('state', 'small')
        })
        $('.css-e48442').css({
            'margin-top': '0px !important'
        })
        $('.styled__Outer-sc-1a16ki5-0').css({
            'display': 'flex',
            'margin': '0'
        })
    })
})();
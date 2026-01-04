// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Forum links
// @description  Forum links
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/forum/*
// @noframes
// @run-at       document-idle
// @grant        none
// @version      1.3
// @downloadURL https://update.greasyfork.org/scripts/406937/7%20Cups%20-%20Forum%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/406937/7%20Cups%20-%20Forum%20links.meta.js
// ==/UserScript==
{
    $('head').append(
        '<style id="rc-forum-links">'
          + '.rc-fa {position: absolute; top: 1.25em; right: 1.25em;}'
          + '.forumPostHead a[name] {display: block; position: relative; top: -80px;}'
          + '.forumPostHead a[name] .img-profile {position: relative; top: 80px;}'
          + 'ul.pagination {position: absolute; z-index: 1;}'
          + '</style>'
        )

    let url = location.href.replace(/#.*$/, '')
    if (!(/\/$/.test(url))) url += '/'
    if (!(/\/\d+\/$/.test(url))) url += (parseInt($('a.page-link').last().text()) || 1) + '/'

    $('ol.breadcrumb.breadcrumb-full').append(
        '<li> <a style="font-size: 16px; position: relative; left: 1ex; top: -2px;" title="Link to start of thread" '
            + 'href="' + url.replace(/\d+\/$/, '1/') + '"'
            + '><i class="fa fa-link"></i></a></li>'
        )

    $('div[id^=forum-post-]').each(function () {
        var s = $('.btn-facebook', $(this)).length? 'style="position: absolute;top: 8px;right:  100px;" ' : '',
            id = $(this).attr('id').replace(/\D*/, '')
        $('.card-block', $(this)).prepend(
            '<a ' + s + 'title="Link to this post" '
            + 'href="' + url + '#' + id + '"'
            + '><i class="fa fa-link rc-fa"></i></a>'
            )
        })
    }

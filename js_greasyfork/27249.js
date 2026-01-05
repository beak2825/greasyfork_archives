// ==UserScript==
// @name         Lastest Doc Redirector (python, django, ruby)
// @name:vi      Chuyển trang tài liệu mới nhất (python, django, ruby)
// @namespace    https://github.com/hotmit/latest-doc-redirector-userscript
// @version      1.0.1
// @description  Redirect the version you googled to the latest doc versions.
// @description:vi   Chuyển những trang bạn tìm được qua trang tài liệu với phiên bản mới nhất (python, django, ruby)
// @author       Du Dang
// @include https://docs.djangoproject.com/*
// @include https://docs.python.org/2/*
// @include https://ruby-doc.org/core-*
// @grant GM_getValue
// @grant GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/27249/Lastest%20Doc%20Redirector%20%28python%2C%20django%2C%20ruby%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27249/Lastest%20Doc%20Redirector%20%28python%2C%20django%2C%20ruby%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Change desired version number
    var PYTHON_TARGET_VERSION = '3.6';
    var DJANGO_TARGET_VERSION = '1.11';
    var RUBY_TARGET_VERSION = '2.4.1';

    // region [ Str Lib ]
    var Str = {};

    Str.contains = function(s, needle, caseSensitive) {
        if (caseSensitive){
            return s.indexOf(needle) > -1;
        }
        return s.toLowerCase().indexOf(needle.toLowerCase()) > -1;
    };
    // endregion

    var href = window.location.href;

    function forward(url){
        var lastFwd = GM_getValue('LastUrlFwd', '');
        // do this to allow browser to go back to old version
        // 		without loop redirect
        if (lastFwd != url){
            GM_setValue('LastUrlFwd', url);
            window.location.href = url;
        }
    }

    if (Str.contains(href, 'docs.djangoproject.com') &&
        !Str.contains(href, '/en/' + DJANGO_TARGET_VERSION + '/'))
    {
        // https://docs.djangoproject.com/en/1.5/topics/db/optimization/
        // INTO https://docs.djangoproject.com/en/1.7/topics/db/optimization/
        href = href.replace(/docs.djangoproject.com\/(\w{2})\/(\d+\.\d+|dev)/gi,
                            'docs.djangoproject.com/en/' + DJANGO_TARGET_VERSION);
        forward(href);
    }

    else if (Str.contains(href, 'docs.python.org') &&
             !Str.contains(href, '/' + PYTHON_TARGET_VERSION + '/'))
    {
        // https://docs.python.org/2/library/datetime.html
        // INTO https://docs.python.org/3/library/datetime.html
        href = href.replace(/docs.python.org\/2\/library/gi,
                            'docs.python.org/' + PYTHON_TARGET_VERSION + '/library');
        forward(href);
    }

    else if (Str.contains(href, 'ruby-doc.org/core-') &&
             !Str.contains(href, '/core-' + RUBY_TARGET_VERSION + '/'))
    {
        // https://ruby-doc.org/core-2.2.0/String.html
        // INTO https://ruby-doc.org/core-2.3.1/String.html
        href = href.replace(/core-[^\/]+/gi, 'core-' + RUBY_TARGET_VERSION);
        forward(href);
    }
})();

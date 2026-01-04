// ==UserScript==
// @name         manhuafen
// @namespace    http://m.manhuafen.com
// @version      0.13
// @description  Remove ads
// @author       chimin
// @match        https://m.manhuafen.com/comic/*/*.html
// @match        https://m.manhuabei.com/manhua/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395778/manhuafen.user.js
// @updateURL https://update.greasyfork.org/scripts/395778/manhuafen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resolveUrl(baseUrl, url) {
        if (url.indexOf('//') >= 0) {
            var u = baseUrl.indexOf('http://');
            if (u >= 0 && url.indexOf('http://') >= 0) {
                return baseUrl.substring(0, u) + encodeURIComponent(url);
            }

            return url;
        }

        var p = baseUrl.lastIndexOf('/');
        if (p >= 0) {
            baseUrl = baseUrl.substring(0, p + 1);
        }

        return baseUrl + url;
    }

    function forceHide(q) {
        q.addClass('d-none-important').css('display', 'none !important');
    }

    $('<style>.d-none-important{display:none !important} #images{pointer-events:none;-moz-user-select:none} #images>img{margin-bottom:2px;pointer-events:none;-moz-user-select:none} .control_bottom{position:fixed !important;bottom:0;background:#fff;z-index:999999}</style>').appendTo($('head'));

    var loading = false;

    setInterval(function() {
        $('brde').each(function() {
            var id = $(this).attr('id');
            if (id) {
                forceHide($(this));
                forceHide($('[classname=' + id + '_f]'));
            }
        });

        $('[id^=s]').each(function() {
            var id = $(this).attr('id');
            if (/s[0-9]+/.test(id)) {
                forceHide($(this));
            }
        });

        forceHide($('#loading').nextAll('div[id]').first());

        forceHide($('.autoHeight'));

        forceHide($('#chapter-view').nextAll());

        if (window.chapterImages && !loading) {
            for (var i = 0; i < window.chapterImages.length; i++) {
                if ($('#page-' + (i + 1)).length == 0) {
                    var baseImg = $('img[id^=page-]');
                    if (baseImg.length) {
                        var url = resolveUrl(baseImg.attr('src'), window.chapterImages[i]);
                        var img = $('<img>')
                            .attr('id', 'page-' + (i + 1))
                            .attr('src', url)
                            .attr('width', '')
                            .attr('height', '')
                            .attr('data-index', i + 1)
                            .css('display', '')
                            .css('width', '100%')
                            .css('height', 'auto')
                            .on('load', function() {
                                loading = false;
                                $('#loading').css('display', 'none');
                            })
                            .on('error', function() {
                                var me = this;
                                me.src = 'about:blank';
                                setTimeout(function() {
                                    console.log('Reload ' + url);
                                    me.src = url + "?" + new Date().getTime();
                                }, 1000);
                            });

                        var prev = $('#page-' + i);
                        if (prev.length) {
                            prev.after(img);
                        } else {
                            $('#images').prepend(img);
                        }

                        loading = true
                        $('#loading').css('display', 'block');
                        break;
                    }
                }
            }
        }
    }, 100);
})();
// ==UserScript==
// @name         Select2
// @namespace    https://select2.github.io/
// @version      0.9.3
// @description  The jQuery replacement for select boxes
// @author       t_liang
// @include      *:*
// @exclude      *://select2.org/*
// @exclude      *://app.yinxiang.com/*
// @exclude      *://www.instagram.com/*
// @exclude      *://*.tmall.com/*
// @exclude      *://*.taobao.com/*
// @exclude      *://www.google.co*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24841/Select2.user.js
// @updateURL https://update.greasyfork.org/scripts/24841/Select2.meta.js
// ==/UserScript==

/*
History
    0.1 初始版本
    0.2 修复版本比较错误，versionMoreThan
    0.3 jQuery.noConflict(true)
    0.4 支持jQuery.ajax
    0.5 exclude app.yinxiang.com
    0.6 use setInterval
    0.7 config, setTimeout, zIndex
    0.8 templateResult matcher
    0.9 add group matcher
*/

/*
(function(factory) {
    debugger;
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([ 'jquery' ], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
})(console.log);
*/

// console.log(arguments);
setTimeout(function() {
    // config
    var config = {
        ignore : [
            'typeof Vue == "function"',
            'typeof jQuery == "function" && typeof jQuery.fn.selectpicker == "function"'
        ],
        jquery : {
            _1_3_2 : '1.3.2', // 无 jQuery.expando jQuery._data
            _1_6_4 : '1.6.4', // select2 渲染正常 支持事件
            js : '//cdn.bootcss.com/jquery/3.2.1/jquery.min.js'
        },
        select2 : {
            js : '//cdn.bootcss.com/select2/4.0.3/js/select2.min.js',
            css : '//cdn.bootcss.com/select2/4.0.3/css/select2.min.css'
        },
        timeout : 3000,
        interval : 3000,
        minWidth : 147
    };
    // ignore
    for (var i = config.ignore.length - 1; i >= 0; i--) {
        if (eval(config.ignore[i])) {
            return;
        }
    }

    var noConflict,
        protocol = location.protocol == 'https:' ? 'https:' : 'http:',
        jQueryOnload = function() {
            jQuery(function($) {
                $.ajaxSetup({
                    cache : true
                });
                var $head = $(document.head),
                    select2Onload = function() {
                        noConflict && $.noConflict(true);
                        // console.log($.fn.select2, location.href);
                        $head.append('<style>span.select2-dropdown{z-index:99999 !important;}</style>');
                        setInterval(function() {
                            $('select:not(.select2-hidden-accessible,.select2-offscreen,[multiple])').filter(':visible').each(function() {
                                if (typeof jQuery == 'function' && !versionMoreThan(jQuery.fn.jquery, config.jquery._1_6_4) &&
                                    (jQuery.cache ? jQuery.cache[this[jQuery.expando]] : jQuery._data(this))) {
                                    return true;
                                }
                                var $this = $(this),
                                    $options = $this.find('option'),
                                    $firstOption = $options.first();
                                $options.length > 2 && $this.select2({
                                    width : Math.max($this.width(), config.minWidth),
                                    dropdownAutoWidth : true,
                                    placeholder : $firstOption.val() ? '' : $firstOption.text(), //for allowClear
                                    allowClear : true,
                                    templateResult : function(option, Eoption) {
                                        if (option.loading || !option.id) {
                                            return option.text;
                                        }
                                        return '[' + option.id + ']' + option.text;
                                    },
                                    matcher : function(params, option) {
                                        var term = $.trim(params.term).toUpperCase();
                                        if (!term) {
                                            return option;
                                        }
                                        if ('id' in option) {
                                            if (option.text.toUpperCase().indexOf(term) > -1 ||
                                                option.id.toUpperCase().indexOf(term) > -1) {
                                                return option;
                                            }
                                        } else {
                                            var filteredChildren = [];
                                            $.each(option.children, function(idx, child) {
                                                if (child.text.toUpperCase().indexOf(term) > -1 ||
                                                    child.id.toUpperCase().indexOf(term) > -1) {
                                                    filteredChildren.push(child);
                                                }
                                            });
                                            if (filteredChildren.length) {
                                                return $.extend({}, option, {
                                                    children : filteredChildren
                                                });
                                            }
                                        }
                                        return null;
                                    }
                                });
                            });
                        }, config.interval);
                    };
                if ($.isFunction($.fn.select2)) {
                    select2Onload();
                } else {
                    $head.append('<link href="' + (protocol + config.select2.css) + '" rel="stylesheet">');
                    $.getScript(protocol + config.select2.js, select2Onload);
                }
            });
        },
        /** 版本比较: 大于 */
        versionMoreThan = function(version, moreThan) {
            version = version.split('.');
            moreThan = moreThan.split('.');
            for (var i = 0; i < version.length; i++) {
                var moreThan_i = i < moreThan.length ? Number(moreThan[i]) : 0;
                if (version[i] > moreThan_i) {
                    return true;
                } else if (version[i] < moreThan_i) {
                    return false;
                }
            }
            return false;
        };

    // TODO enter
    if (typeof jQuery == 'function') {
        if (versionMoreThan(jQuery.fn.jquery, config.jquery._1_6_4)) {
            jQueryOnload();
            return;
        } else if (!versionMoreThan(jQuery.fn.jquery, config.jquery._1_3_2)) {
            return;
        }
    }
    // append jQuery
    noConflict = true;
    setTimeout(function() {
        var jQueryScript = document.createElement('SCRIPT');
        jQueryScript.src = protocol + config.jquery.js;
        jQueryScript.onload = jQueryOnload;
        document.head.appendChild(jQueryScript);
    }, config.timeout);
}, 3000);
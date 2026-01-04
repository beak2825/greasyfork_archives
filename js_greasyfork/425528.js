// ==UserScript==
// @name         返回顶部
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  下拉浏览长页的网页时,鼠标点击右下角的三角即可快速返回顶部
// @author       kafukacc
// @match        https://hellogithub.com/
// @icon         none
// @grant        none
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425528/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/425528/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==
$(function () {
        (function () {
            'use strict';
            $("body").append($("<a>△</a>"));
            $("a").addClass("to-top").css({
                "fontSize": "60px",
                "color": "rgba(238, 237, 237, 0.644)"
            }).on("mouseenter", function () {
                $(this).css("color", "gray");
            }).mouseleave(function () {
                $(this).css("color", "rgba(238, 237, 237, 0.644)");
            });

            $.fn.toTop = function (opt) {

                //variables
                var elem = this;
                var win = $(window);
                var doc = $('html, body');

                //Extended Options
                var options = $.extend({
                    autohide: true,
                    offset: 400,
                    speed: 500,
                    position: true,
                    right: 15,
                    bottom: 30
                }, opt);

                elem.css({
                    'cursor': 'pointer'
                });

                if (options.autohide) {
                    elem.css('display', 'none');
                }

                if (options.position) {
                    elem.css({
                        'position': 'fixed',
                        'right': options.right,
                        'bottom': options.bottom,
                    });
                }

                elem.click(function () {
                    doc.animate({
                        scrollTop: 0
                    }, options.speed);
                });

                win.scroll(function () {
                    var scrolling = win.scrollTop();

                    if (options.autohide) {
                        if (scrolling > options.offset) {
                            elem.fadeIn(options.speed);
                        } else elem.fadeOut(options.speed);
                    }

                });

            };

            $('.to-top').toTop();
        })();
    })
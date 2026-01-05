// ==UserScript==
// @name        Clutter Disappearifier
// @namespace   abrad45
// @description hides ads and navigation from around the comics
// @include     http://www.mspaintadventures.com/*
// @include     http://mspaintadventures.com/*
// @require     https://code.jquery.com/jquery-2.2.3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.1/js.cookie.js
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18846/Clutter%20Disappearifier.user.js
// @updateURL https://update.greasyfork.org/scripts/18846/Clutter%20Disappearifier.meta.js
// ==/UserScript==

$(function () {
    if(/s=6/.test(window.location.search)) {
        var $body = $('body');
        var cookieName = 'homestuck_cd';
        var appear = 'Appearify Clutter';
        var disappear = 'Disappearify Clutter';

        if (getCookieValue() !== 0) {
            $body
                .css('background-color', '#c6c6c6')
                .find('> center > table > tbody > tr:not(:eq(1))')
                    .hide();

            setCookie(1, {
                'path': '/',
                'expires': 180
            });
        }

        $('table[width=600]')
            .first()
            .parent()
                .css('position', 'relative')
                .append(
                    $('<div />',
                        {
                            'id': 'clutter_disappearifier',
                            'css': {
                                'position': 'absolute',
                                'right': '5px',
                                'top': '0'
                            }
                        }
                    ).append(
                        $('<a />',
                            {
                                'href': '#',
                                'text': function () {
                                    if(getCookieValue() === 1) {
                                        return appear;
                                    } else {
                                        return disappear;
                                    }
                                }
                            }
                        )
                    )
                );

        $('#clutter_disappearifier a').click(function () {
            if ($('body[style]').length) {
                $body
                    .removeAttr('style')
                    .find('> center > table > tbody > tr')
                        .show();

                setCookie(0);
                $(this).text(disappear);
            } else {
                $body
                    .css('background-color', '#c6c6c6')
                    .find('> center > table > tbody > tr:not(:eq(1))')
                        .hide();

                setCookie(1);
                $(this).text(appear);
            }
            return false;
        });
    }

    function getCookieValue() {
        return Number(Cookies.get(cookieName)) || -1;
    }

    function setCookie(val, options) {
        if (typeof options === "object") {
            Cookies.set(cookieName, !!val, options);
        } else {
            Cookies.set(cookieName, !!val);
        }
    }
});

// ==UserScript==
// @name         hover-copy
// @namespace    https://github.com/nameldk/user-script
// @version      0.1
// @description  Hover over A or IMG, then press Ctrl+c to copy link.
// @author       You
// @match        https://*/*
// @match        http://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427788/hover-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/427788/hover-copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // copy from: https://chrome.google.com/webstore/detail/hover-and-copy/moanghbdjdafhoppikcalbkggpnbhhid
    $(document).ready(function () {
        var $body = $('body');

        function isUrlValid(url) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(url) || /^data:image\//.test(url);
        }

        var inputForCopy = $('<input id="input_for_copy">');

        $body.append(inputForCopy);

        inputForCopy.css({
            position: 'absolute',
            left: -9999
        });

        $body.on('mouseenter', 'a, img', function (e) {
            var hoverTarget = $(e.target);
            var hoverLink;

            if (hoverTarget.is('img')) {
                hoverLink = hoverTarget.attr('src');
            } else {
                hoverLink = hoverTarget.attr('href');
                if (typeof hoverLink === 'undefined') {
                    hoverLink = hoverTarget.closest('a').attr('href');
                }
            }

            if (!isUrlValid(hoverLink)) {
                hoverLink = window.location.origin + '/' + hoverLink;
            }

            inputForCopy.focus({
                preventScroll: true,
            });

            inputForCopy.val(hoverLink);
            inputForCopy.select();

        }).on('mouseleave', 'a, img', function () {
            inputForCopy.blur();
        })
    });
})();
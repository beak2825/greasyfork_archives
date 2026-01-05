// ==UserScript==
// @name         FloatingHeaders
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  dodaje obsługę pływających nagłówków do mirko.
// @author       @ZasilaczKomputerowy
// @match        https://www.wykop.pl/mikroblog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28302/FloatingHeaders.user.js
// @updateURL https://update.greasyfork.org/scripts/28302/FloatingHeaders.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var floatingHeaders = function() {
        var yOffset =  window.pageYOffset+80;

        if(yOffset < 160)
        {
            jQuery('.ellipsis').each(function (e) {
                $(this).removeAttr('style');
            });
            return;
        }
        var mostTopNode = {};
        jQuery('.entry').each(function (e) {
            var top = $(this).offset().top+50;
            if($.isEmptyObject(mostTopNode))
            {
                mostTopNode['node'] = this;
                mostTopNode['top'] = $(this).offset().top+50;
            }
            else
            {
                if(top < yOffset && top > mostTopNode['top'])
                {
                    mostTopNode['node'] = this;
                    mostTopNode['top'] = $(this).offset().top+50;
                }
            }
        });

        var node = mostTopNode['node'];
        var author = $(node).find('.ellipsis').first();
        var width = parseInt($('.entry').last().find('.ellipsis').first().css('width').replace(/px/,'')) + 4 + 'px';

        $(author).css({
            'position': 'fixed',
            'top': '50px',
            'width': width,
            'height': '30px',
            'background-color': 'rgb(44, 44, 44)',
            'opacity': '0.8',
            'z-index': '99999'
        });

        jQuery('.ellipsis').each(function (e) {
            if(this != author.get(0))
            {
                $(this).removeAttr('style');
            }
        });
    };

    $(document).scroll(function(e) {
        floatingHeaders();
    });

    $(document).resize(function(e) {
        floatingHeaders();
    });
})();
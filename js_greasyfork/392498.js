// ==UserScript==
// @name         UESP Narrow - table expand/collapse
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       dahomej superior
// @description  Enables table expansion for UESP narrow userstyle
// @include      *uesp.net*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/392498/UESP%20Narrow%20-%20table%20expandcollapse.user.js
// @updateURL https://update.greasyfork.org/scripts/392498/UESP%20Narrow%20-%20table%20expandcollapse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){
        $('#content.mw-body .wikitable').each(function(){
            $(this).css({position: 'relative'});
            $(this).append(
                $('<a>➔</a>')
                .attr('id', 'expand')
                .css({
                    position: 'absolute',
                    left: '5px',
                    top: '5px',
                    cursor: 'pointer'
                })
                .on('click', function() {
                    const tab = $(this).parent();
                    const mainBody = $('#mw-content-text');
                    if ($(this).attr('expanded') == 'true') {
                        $(this).attr('expanded', 'false');
                        tab.css({
                            left: '',
                            width: 'auto'
                        });
                        $(this).css('transform', 'scale(1, 1)');
                        mainBody.css('overflow-x', 'auto');
                    } else {
                        $(this).attr('expanded', 'true');
                        tab.css({
                            left: '-' + tab.offset().left + 'px',
                            width: '99vw'
                        });
                        $(this).css('transform', 'scale(-1, 1)');
                        mainBody.css('overflow-x', 'visible');
                    }
                })
            );
        });
    });
})();
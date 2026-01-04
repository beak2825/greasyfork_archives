// ==UserScript==
// @name         te31
// @version      0.5
// @description  try to take over the world!
// @author       You
// @include      *te31.com/rgr/*
// @grant        GM_openInTab
// @run-at       document-end
// @namespace https://greasyfork.org/users/166795
// @downloadURL https://update.greasyfork.org/scripts/376789/te31.user.js
// @updateURL https://update.greasyfork.org/scripts/376789/te31.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var honey = $('#honey').html();
    $('#honey').hide();
    //$('#honey').prevUntil('table[cellspacing=5]').hide()
    $('<div id="honey2" />').html(honey).insertBefore('#honey');

    var gifClick = async function() {
        var gifButtons = $('#honey2 i[id^=gifb_button]').toArray();
        for(const gifButton of gifButtons)
        {
            if($(gifButton).text().replace(/replay/g,'').trim() != '') {
                $(gifButton).click();
                setTimeout(gifClick, 2000);
                break;
            }
        }
    };
    setTimeout(gifClick, 1000);

    $(document).keypress(function(event) {
        console.log(event.charCode);
        if(event.charCode == 97) // 'a'
            $('i.material-icons').prev().each(function(a, b){
                var href = $(b).attr('href');
                var base = (window.location.origin+window.location.pathname).split('/').slice(0, -1).join('/')+'/';
                if(href !== undefined && String(href).length > 0)
                    GM_openInTab(base + href);
            });
    });
})();
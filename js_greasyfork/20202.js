// ==UserScript==
// @name         ffn work block
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.1
// @description  permanently hide selected works
// @author       scriptfairy
// @include      http://www.fanfiction.net/*
// @include      https://www.fanfiction.net/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/20202/ffn%20work%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/20202/ffn%20work%20block.meta.js
// ==/UserScript==

(function($) {
    function blockThis(work) {
        var id = $(work).find('.stitle').attr('href');
        GM_setValue(id, id);
        GM_setValue('last', id);
    }
    function blockAll(works) {
        var blocked = GM_listValues();
        for (j=0;j<works.length;j++) {
            var workId = $(works[j]).find('.stitle').attr('href');
            if ($.inArray(workId, blocked) != -1) {
                $(works[j]).hide();
            }
        }
    }
    $(document).ready(function() {
        var works = $('div.z-list');
        blockAll(works);
        $('<style>').text('.workblock a {cursor:pointer;} a.workblock {margin-left: 20px;}').appendTo($('head'));

        // unblock works
        $('#zmenu .xmenu_item:last-child').after('<div class="dropdown xmenu_item workblock"><a class="dropdown-toggle" data-toggle="dropdown">Work Block <b class="caret"></b></a><ul class="dropdown-menu"><li class="clear-last"><a>Unblock last</a></li><li class="clear-all"><a>Unblock all</a></li></ul></div>');
        $('.workblock .clear-all').click(function() {
            var keys = GM_listValues();
            for (k=0;k<keys.length; k++) {
                GM_deleteValue(keys[k]);
            }
            location.reload();
        });
        $('.workblock .clear-last').click(function() {
            var unblockId = GM_getValue('last');
            GM_deleteValue('last');
            GM_deleteValue(unblockId);
            location.reload();
        });

        // block works
        for (i=0;i<works.length;i++) {
            $(works[i]).find('.z-padtop').before('<a href="javascript:void(0)" class="workblock block">Block</a>');
        }
        $('.workblock.block').click(function() {
            var work = $(this).parents('div.z-list');
            blockThis(work);
            $(work).hide();
        });
    });
})(window.jQuery);
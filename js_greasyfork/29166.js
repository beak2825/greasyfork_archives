// ==UserScript==
// @name         Pocket
// @version      0.3.3
// @description  Count all the links, open on middle click
// @author       Cáno
// @match        https://getpocket.com/a/queue/list/*
// @grant        unsafeWindow, chrome, notifications
// @require      http://code.jquery.com/jquery-latest.js
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/29166/Pocket.user.js
// @updateURL https://update.greasyfork.org/scripts/29166/Pocket.meta.js
// ==/UserScript==

(function() {
    'use strict';


    unsafeWindow.openLinks = function() {
        var els = $('.original_url');

        Array.prototype.forEach.call(els, function(el) {
            if ($(el).parent().parent().parent().parent('.item:not(.removed)').length === 0) {
                return;
            }
            var address = el.href.substr(el.href.indexOf('redirect?url=') + 13);
            address = address.substr(0, address.indexOf('&formCheck='));
            address = decodeURIComponent(address);
            // console.log(address);
            unsafeWindow.open(address,'_blank');
        });
    };

    //document.getElementsByClassName("queue_secondarynav_actions")[0].childNodes[1].innerHTML = document.getElementsByClassName("queue_secondarynav_actions")[0].childNodes[1].innerHTML + '<li style="color:#909090; margin-top: 18px; font-size: 16px; cursor: pointer; font-weight: bold" onclick="openLinks()">Open all links</li>';

    unsafeWindow.openTwentyLinksAndArchive = function(howMany) {

        $('.original_url').each(function(index) {
            if (index >= howMany) {
                return;
            }
            var el = this;
            if ($(el).parent().parent().parent().parent('.item:not(.removed)').length === 0) {
                return;
            }
            var address = el.href.substr(el.href.indexOf('redirect?url=') + 13);
            address = address.substr(0, address.indexOf('&formCheck='));
            address = decodeURIComponent(address);
            $(el).parent().parent().parent().find('ul.buttons li.action_mark a')[0].click();
            unsafeWindow.open(address,'_blank');
        });
        setTimeout(function() {
            location.reload();
        }, 8000);
    };

    document.getElementsByClassName("queue_secondarynav_actions")[0].childNodes[1].innerHTML = document.getElementsByClassName("queue_secondarynav_actions")[0].childNodes[1].innerHTML + '<li style="color:#909090; margin-top: 18px; font-size: 16px; cursor: pointer; font-weight: bold" onclick="openTwentyLinksAndArchive(20)">Open and archive 20 links</li>';


    unsafeWindow.archiveLinks = function() {
        var els = $('li.item:not(.removed) .action_mark');

        if (els.length > 0) {
            els[0].childNodes[0].click();
            setTimeout(unsafeWindow.archiveLinks, 160);
        }
    };

    var html = document.getElementsByClassName("queue_secondarynav_actions")[0].childNodes[1].innerHTML;

    setInterval( setUp, 2000 );
    function setUp() {

        unsafeWindow.$('.item.item_type_normal .item_content').each(function() {
            unsafeWindow.$(this).trigger("mouseover");
        });

        var state = document.readyState;
        if (state == 'interactive') {
        } else if (state == 'complete') {
            var count = $('.original_url').parent().parent().parent().parent('.item:not(.removed)').length;
            $('#archive-all-links').remove();
            $('.pagenav_bulkedit').after('<li id="archive-all-links" style="color:#909090; margin-top: 18px; font-size: 16px; cursor: pointer; font-weight: bold" onclick="archiveLinks()">Archive all links (' + count + ')</li>');
        }
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }

    function archiveOnClick(e) {
        if (e.which != 2) return false;
        $(e.target).parent().parent().parent().find('ul.buttons li.action_mark a')[0].click();
    }

    setInterval( setUpArichiveOnClick, 2000 );
    function setUpArichiveOnClick() {
        $('a.original_url').off('mouseup', archiveOnClick);
        $('a.original_url').on('mouseup', archiveOnClick);
    }
})();

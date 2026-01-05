// ==UserScript==
// @name         Switch Slack channels.
// @namespace    http://kevinx.net/
// @version      0.2
// @description  Use ALT+PageUp/PageDown to navigate Slack channels.
// @author       Kevin DeLoach
// @match        http://*.slack.com/*
// @match        https://*.slack.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10474/Switch%20Slack%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/10474/Switch%20Slack%20channels.meta.js
// ==/UserScript==

$(function() {
    var $channels = $('#channel-list'),
        $target = null;

    function elAt(i) {
        return $($channels.children().get(i));
    }

    function selectedOrActive() {
        var $el = $channels.find('li.channel.underline');
        if ($el.size() > 0) {
            return $($el.get(0));
        }
        return $($channels.find('li.channel.active').get(0));
    }
    
    function move(dy) {
        var $active = selectedOrActive(),
            i = $channels.children().index($active),
            j = i + dy;
        j = Math.max(0, Math.min($channels.children().size() - 1, j));
        switchChannel(elAt(j));
    }

    function switchChannel($el) {
        $channels.find('li.channel.underline').removeClass('underline');
        $el.addClass('underline');
        $target = $el;
    }

    $(document.body).on('keyup', function(e) {
        if (e.shiftKey) {
            return;
        }
        if (e.altKey && e.keyCode === 33) {
            move(-1);
        } else if (e.altKey && e.keyCode === 34) {
            move(1);
        } else if ($target) {
            $target.find('a').trigger('click');
            $target = null;
        }
    });
});
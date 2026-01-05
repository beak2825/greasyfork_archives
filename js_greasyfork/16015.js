// ==UserScript==
// @name         Douyu Ad Remover
// @namespace    Ad Remover
// @version      0.1
// @description  Remove ads on douyu.com
// @author       X.Zhao
// @grant        none
// @match        http://www.douyutv.com/*
// @downloadURL https://update.greasyfork.org/scripts/16015/Douyu%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/16015/Douyu%20Ad%20Remover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj === null || obj === undefined) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function remover(name, callback) {
    var $ = window.jQuery;
    if (isEmpty($) || isEmpty($(name))) {
        setTimeout(function() {
                remover(name);
            }, 500);
    } else {
        if (isEmpty(callback)) {
            // default callback is clear html content and set "display: none".
            $(name).html('').hide();
        } else {
            callback($(name));
        }
    }
}

function main() {
    remover('#chat-top-ad');
    remover('#js_chat_mem');
    remover('#cq_fans');
    remover('#js_mlist');
    remover('#dy_bottom_shadow');
    remover('#live_videobar');
    remover('.chat-right-ad');
    remove_flash_ad();
        remove_focus();
}


function remove_focus() {
    var $ = window.jQuery;
    if ($('#live_userinfo #js_share').length === 0) {
        setTimeout(remove_focus, 500);
    } else {
        $('#live_userinfo #js_share').html('').hide();
    }
}

function remove_flash_ad() {
    var $ = window.jQuery;
    if ($('#sign_p_15_swf').width() === null) {
        setTimeout(remove_flash_ad, 500);
    } else {
        // alert($('#sign_p_15_swf').width());
        $('#sign_p_15_swf').width(0).height(0);
    }
}

main();

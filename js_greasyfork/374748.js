// ==UserScript==
// @name         Random.app
// @version      0.5
// @match        https://yap.by/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @description  Predictable winner generation for Random.app (https://vk.com/app6108296)
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/374748/Randomapp.user.js
// @updateURL https://update.greasyfork.org/scripts/374748/Randomapp.meta.js
// ==/UserScript==

// Winner ID on VK.com
var winnerUid = [75292250];
var f_ptr = VK.api;

vk_api = function(method, options, callback)
{
    if(method == 'users.get')
    {
        if(options.user_ids.indexOf(',') == -1)
            options.user_ids = winnerUid.shift();
    }

    return f_ptr(method, options, callback);
};

$(document).on
(
    'mouseover',
    '.btn-default',
    function ()
    {
        VK.api = vk_api;
    }
);
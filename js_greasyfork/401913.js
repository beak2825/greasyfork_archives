// ==UserScript==
// @name         Grab UID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       otnayajiw
// @match        https://*.facebook.com/groups/*/*members*/
// @match        https://*.facebook.com/*/friends*
// @match        https://*.facebook.com/*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401913/Grab%20UID.user.js
// @updateURL https://update.greasyfork.org/scripts/401913/Grab%20UID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;

    $('body').append('<div style="z-index: 10000;position: fixed; border: 5px solid rgba(0,0,0,.3); bottom: 30px; left: 30px; background-color: #eeeeee; padding: 15px; \
                     border-radius: 10px;"><textarea id="result" rows="15" cols="25"></textarea> <br /> \
<button id="getMember">Group UID</button> <button id="getFriend">Friend UID</button></div>');

    pageScroll();
    $('.morePager').click();

    $('#getMember').on('click', function(){
        getGroupMemberUID();
    });
    $('#getFriend').on('click', function(){
        getFriendUID();
    });

    function getGroupMemberUID() {
        $('._60ri a').each(function(i,v){
            var uid = $(this).attr('ajaxify');
            const regex = /member_id=([0-9]+)&/sgi;
            uid = regex.exec(uid);
            console.log(i +':'+ uid[1]);
            $('#result').append(uid[1] + "\r\n");

        });
    }


    function getFriendUID() {
        $('.fsl.fwb.fcb a').each(function(i,v){
            var uid = $(this).data('hovercard');
            const regex = /\?id=([0-9]+)&/sgi;
            uid = regex.exec(uid);
            console.log(i +':'+ uid);
            if(uid != null) {
               $('#result').append(uid[1] + "\r\n");
            }

        });
    }

    function pageScroll() {
        window.scrollBy(0,1);
        var scrolldelay = setTimeout(pageScroll,.05);
    }

})();
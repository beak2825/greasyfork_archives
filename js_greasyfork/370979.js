// ==UserScript==
// @name         pcbeta自用去广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  哦豁
// @author       You
// @match        *://bbs.pcbeta.com/*.html
// @match        *://bbs.pcbeta.com/
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/370979/pcbeta%E8%87%AA%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/370979/pcbeta%E8%87%AA%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //神马？听说你的class是随机的？用本事id也随机 /滑稽
    var url = window.location.href;
    $('#sitefocus').remove();

    if (url.indexOf('viewthread') === -1) {
        $('#wp > div:eq(1) > div').remove();
        $('#wp > div:eq(1)').height($('#wp > div:eq(1) > ul:eq(0)').height() + $('#wp > div:eq(1) > ul:eq(1)').height() + 20);
    } else {
       $('#wp > div:eq(2)').remove();

       $('div.a_pt').remove();
       $('div.a_pb').remove();

       $('a').each(function() {
           var $that = $(this);
           $that.removeAttr('onclick');

           var href = $that.attr('href');
           //console.log(href);
           $that.click(function(){
               window.location.href = href;
           });
       });
    }
})();
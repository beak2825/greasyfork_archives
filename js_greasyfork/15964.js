// ==UserScript==
// @name         CARI
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  try to take over the world!
// @author       You
// @match        http://*.cari.com.my/*
// @match        https://*.cari.com.my/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15964/CARI.user.js
// @updateURL https://update.greasyfork.org/scripts/15964/CARI.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
setInterval(function() {
    if (jQuery) {
        if (jQuery('div[id^=innity_adslot_] a[id^=btn_close_]').length) {
            jQuery('div[id^=innity_adslot_] a[id^=btn_close_]')[0].click();
        }
        jQuery('div[class=kskdDiv]').remove();
        jQuery('div[id^=innity_adslot_]').remove();
        jQuery('div[id^=innity_adslot_] iframe').remove();
        jQuery('div[id^=sidebox]').remove();
        jQuery('div[id=p3x]').remove();
        jQuery('div[id=stobg]').remove();
        jQuery('div[id=asto_box]').remove();
        jQuery('span[id=ZZRighthead]').click();
        jQuery('div[id^=div-gpt-ad-] div[id=delayclosebutton]').click();
        jQuery('div[id^=div-gpt-ad-]').remove();
        jQuery('div[id^=wechat] > div').click();
        jQuery('div[id=cari_sto_inhouse] > a:first').click();
        jQuery('div#fp-ad-container').css({ display: 'none' });
        jQuery('div#cari_inarticle_videodiv').css({ display: 'none' });
    }
}, 1000);
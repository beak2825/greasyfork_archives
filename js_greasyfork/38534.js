// ==UserScript==
// @name         Google View Image Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Re-add the "View Image" button to Google Images.
// @author       A guy that wants a simple button
// @match        https://www.google.co.uk/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/38534/Google%20View%20Image%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/38534/Google%20View%20Image%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var decodedImgUrl = "";
    $(window).click(function(e) {
        console.log(e.target.id + ' ' + e.target.src);
        var url = window.location.href.split("&");var url1;
        for (var i=0;i<url.length;i++) {url1 = url[i].split('#imgrc=');if (url1[0]==="tbm=isch") {console.log(url1[1]);}}
        var encodedimgurl = $('img[name='+url1[1]+']').parent().attr('href').split('?imgurl=');
        var encodedimgurl1 = encodedimgurl[1].split('&');
        var decodedImgUrl = decodeURIComponent(encodedimgurl1[0]);console.log('decodedImgUrl = ' + decodedImgUrl);
        $('.removeThis').remove();
        $('a[jsaction=r.7BN_2kPMxJo]').parent().parent().append('<td class="removeThis" id="'+decodedImgUrl+'"><a id="imageLinkURL" href="'+decodedImgUrl+'"><span>View image source</span></a></td>');

    });

})();
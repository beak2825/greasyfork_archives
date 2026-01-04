// ==UserScript==
// @name         Share Everywhere
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Share the current page in various social network
// @author       Pedro Antônio
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @icon http://www.iconarchive.com/download/i85618/graphicloads/100-flat/share-2.ico



// @downloadURL https://update.greasyfork.org/scripts/33716/Share%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/33716/Share%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var titulo = document.title;
    $('head').append('<link rel="stylesheet" href="https://codepen.io/pedropamn/pen/mBMpZB.css" />');
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">');
    var url = window.location.href;

    var sharers = {
        facebook:'https://www.facebook.com/sharer.php?u='+url,
        twitter: 'https://twitter.com/intent/tweet?url='+url+'&text='+titulo+'',
        gplus:'https://plus.google.com/share?url='+url,
        whatsapp:'whatsapp://send?text='+url,
        linkedin:'https://www.linkedin.com/shareArticle?url='+url+'&title='+titulo,
        tumblr:'https://www.tumblr.com/widgets/share/tool?canonicalUrl='+url+'&title='+titulo+'&caption='+titulo,
        evernote:'http://www.evernote.com/clip.action?url='+url,
        telegram: 'https://t.me/share/url?url='+url+'&text='+titulo
    };

    var html = '<div class="fabs">'+
        '<a href="'+sharers.gplus+'" target="_blank" class="fab red" tooltip="Google Plus"><i class="sec zmdi zmdi-google-plus animated"></i></a>'+
        '<a href="'+sharers.twitter+'" target="_blank" class="fab light-blue" tooltip="Twitter"><i class="sec zmdi zmdi-twitter animated"></i></a>'+
        '<a href="'+sharers.facebook+'" target="_blank" class="fab indigo" tooltip="Facebook"><i class="sec zmdi zmdi-facebook animated"></i></a>'+
        '<a href="'+sharers.whatsapp+'" target="_blank" class="fab green" tooltip="Whatsapp"><i class="sec zmdi zmdi-whatsapp animated"></i></a>'+
        '<a href="'+sharers.linkedin+'" target="_blank" class="fab blue" tooltip="Linkedin"><i class="sec zmdi zmdi-linkedin-box animated"></i></a>'+
        '<a href="'+sharers.tumblr+'" target="_blank" class="fab indigo" tooltip="Tumblr"><i class="sec zmdi zmdi-tumblr animated"></i></a>'+
        '<a href="'+sharers.evernote+'" target="_blank" class="fab green" tooltip="Evernote"><i class="sec zmdi zmdi-evernote animated"></i></a>'+
        '<a href="'+sharers.telegram+'" target="_blank" class="fab blue" tooltip="Telegram"><i class="sec zmdi zmdi-mail-send animated"></i></a>'+
        '<a target="_blank" class="fab red" tooltip="Share"><i class="prime zmdi animated rotateIn zmdi-plus"></i></a>'+
        '</div>';


    $('body').append(html);
})();

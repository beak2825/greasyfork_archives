// ==UserScript==
// @name         LiqiPreviewer
// @namespace    bilipan
// @version      0.0.4
// @description  Liqi Preview
// @author       bilipan
// @match        http://liqi.io/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372404/LiqiPreviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/372404/LiqiPreviewer.meta.js
// ==/UserScript==
(function() {
    var $content = $('.entry-content');
    if (!$content) return;
    $content.find('p img').on('click', function(e) {
        var src = $(this).attr('srcset');
        if (!src) src = $(item).find('img').attr('src');
        else { 
          var img = src.split(',').pop();
          src = imgs.split(' ').shift();
        }
        console.log(src);
        window.location.href = src;
    });
}()); 
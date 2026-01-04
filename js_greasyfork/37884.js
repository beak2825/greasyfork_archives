// ==UserScript==
// @name         2animx Load all pages
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://www.2animx.com/index-look-name-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37884/2animx%20Load%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/37884/2animx%20Load%20all%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var img = $('div#img_ad_img > img#ComicPic');
        var last = $('#rightyahooad');
        var src = img.prop('src');
        var completeds = [];
        $('select[name=select1] > option').each(function (i, e) {
            if (!e.selected && completeds.indexOf(e.value) < 0) {
                completeds.push(e.value);
                var s = src.replace(/\d+.jpg/, e.value + '.jpg');
                console.log('page #' + e.value + '=' + s);
                img.clone()
                    .attr('id', '')
                    .attr('src', s)
                    .css('margin', '10px auto 0 auto')
                    .css('display', 'block')
                    .insertBefore(last);
            }
        });
    });
})();
// ==UserScript==
// @name    yymanhua8
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       baba
// @match        *://4.yymanhua8.com/home/book/capter/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386971/yymanhua8.user.js
// @updateURL https://update.greasyfork.org/scripts/386971/yymanhua8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const manhua_id_match = $('.page-current>.navbar>.navbar-inner>.right>a:eq(1)').attr('onclick').match(/\d+/);
    const manhua_id = manhua_id_match && manhua_id_match[0] || 0;
    const capter_id_match = window.location.href.match(/\/capter\/id\/(\d+)/);
    const capter_id = capter_id_match && capter_id_match[1] || 0;
    if(!manhua_id || !capter_id) return;
    //console.log(manhua_id, capter_id)
    const api_url = `http://4.yymanhua8.com/home/api/chapter_nearby?manhua_id=${manhua_id}&capter_id=${capter_id}`;
    $.get(api_url, function(rs){
        if(rs && rs.succ && rs.result.imagelist) {
            const images = rs.result.imagelist && rs.result.imagelist.split(',') || [];
            let html = '';
            html += '<div class="reader-cartoon-image loaded">';
            images.forEach(function(item,idx){
                html += `<img src="/${item}" alt="${idx}">`;
            })
            html += '</div>';
            $('.reader-cartoon-chapter').empty().html(html);

            $('.reader-cartoon-image').click(function() {
                actions(manhua_id);
                $('.md').addClass('with-modal-actions');
                $('body').addClass('reading');
            });
        }
    })
})();
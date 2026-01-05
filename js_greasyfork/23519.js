// ==UserScript==
// @name         Real-debrid multi select link to download page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click on check box and "Go to download page" and all links checked will be debrided
// @author       gilbert1995
// @match        https://real-debrid.com/torrents
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js
// @downloadURL https://update.greasyfork.org/scripts/23519/Real-debrid%20multi%20select%20link%20to%20download%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/23519/Real-debrid%20multi%20select%20link%20to%20download%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("form[action*='downloader']").each(function() {
        $(this).prepend('<input class="downloadSelectedCheckbox" type="checkbox" value="'+$(this).find('textarea').val()+'" />');
    });
    
    $("#wrapper_global > div > div > table").before('<button id="downloadSelected" style="cursor:pointer; display: block;width: 100%;margin-top: 20px;font-size: 22px;text-transform: uppercase;color: #ffffff;/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#8ebad2+0,b8d995+100 */background: #8ebad2; /* Old browsers */background: -moz-linear-gradient(top,  #8ebad2 0%, #b8d995 100%); /* FF3.6-15 */background: -webkit-linear-gradient(top,  #8ebad2 0%,#b8d995 100%); /* Chrome10-25,Safari5.1-6 */background: linear-gradient(to bottom,  #8ebad2 0%,#b8d995 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#8ebad2\', endColorstr=\'#b8d995\',GradientType=0 ); /* IE6-9 */font-weight: 700;text-shadow: 0 0 10px #000000;border: none;padding: 10px;">Download selected bottom!</button>');
    $("#downloadSelected").click(function(){
        console.log('click');
        
        var textarea = $("#wrapper_global > div > div > table tr td[colspan='7']:first textarea");
        textarea.val($('.downloadSelectedCheckbox:checked').map(function() {return $(this).val();}).get().join('\n'));
        textarea.next('input').trigger('click');
        
    });
})();
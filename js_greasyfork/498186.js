// ==UserScript==
// @name         Project Zomboid Fans Map Tool
// @description  Makes the standard (non full screen) maps most of the width/height of you screen space. Puts the site into dark mode. Makes coordinates on the page into links that re-centre the map to them.
// @namespace    https://monkeyr.com/
// @version      1.2
// @license      MIT
// @author       mh
// @match        https://pzfans.com/*-online-map/
// @match        https://pzfans.com/vanilla-full-map/
// @match        https://pzfans.com/project-zomboid-maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pzfans.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/498186/Project%20Zomboid%20Fans%20Map%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/498186/Project%20Zomboid%20Fans%20Map%20Tool.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    // add the dark theme then make the map bigger
    GM_addStyle(`
      html, #contentDiv{
        filter: invert(100%) hue-rotate(180deg);
      }
      .grid-container {max-width: inherit}
      .site-content .content-area {width:100%!important}
      #right-sidebar {display: none}
      #contentDiv {height:90vh!important}
    `);
    // loop each paragraph and heading looking for coords, when found make them a link with data of the coords
    $.each(['p','h2','h3'], (i,v)=>{
        $(v).each(function(){
            const p = $(this);
            p.html(p.html().replace(/(\d+),\s*(\d+)/ig, (f,x,y)=>{
                return `<a href="#" data-x="${x}" data-y="${y}" class="coord">${f}</a>`;
            }));
        });
    });
    // find those links with data and make them re-center the map on the coords provided
    $('a.coord').on('click', function(e){
        e.preventDefault();
        const a = $(this);
        $('#x').val(a.data('x'));
        $('#y').val(a.data('y'));
        panto();
        $("#layerSelector")[0].scrollIntoView({
            behavior: "instant", // or "auto" or "smooth"
            block: "start" // or "end"
        });
    });
})(jQuery);
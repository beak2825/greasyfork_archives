// ==UserScript==
// @name         SH List All Chapters
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.3
// @description  Override the "Show All Chapters" button to list all chapters in the Table of Contents on ScribbleHub series pages instead of a pop-up.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415270/SH%20List%20All%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/415270/SH%20List%20All%20Chapters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( 0 != document.querySelectorAll('ul#pagination-mesh-toc li:nth-last-child(2)').length ){
        var top = parseInt( document.querySelectorAll('ul#pagination-mesh-toc li:nth-last-child(2)')[0].textContent );
        if( !isNaN( top ) && 1 < top ){
            //console.log(top);
            var btnElem = '<i class="fa fa-th-list chpnew" id="menu_icon_fic" aria-hidden="true" title="Show All Chapters"></i>';
            $('div.fic_toc_bar i#menu_icon_fic.fa-th-list').replaceWith(btnElem);
            var sacBtn = document.querySelectorAll('div.fic_toc_bar i#menu_icon_fic.fa-th-list')[0];
            if(sacBtn){
                sacBtn.addEventListener("click", function(){
                    UBlistAllChaptersSH( top, 2 );
                }, false);
            }
            sacBtn = btnElem = null;

            //UBlistAllChaptersSH( top, 2 );
            //top = null;
        }
    }
})();

function UBlistAllChaptersSH(top, i){
    //console.log( top, i );

    if( null != top && !isNaN( top ) && null != i && top >= i ){
        var e = $("#mypostid").attr("value");
        $.ajax({
            type: "POST",
            url: "https://www.scribblehub.com/wp-admin/admin-ajax.php",
            data: {
                action: "wi_getreleases_pagination",
                pagenum: i,
                mypostid: e
            },
            success: function(t) {
                //console.log(top, i);
                t = t.slice(0, -1);
                var ol = $(t).find('.toc_ol li');
                $('.toc_ol').append(ol);
                //console.log( ol );
                t = o = null;
                UBlistAllChaptersSH( top, i+1 );
            }
        });
    }

    if( top <= i ){
        top = null;
    }

}
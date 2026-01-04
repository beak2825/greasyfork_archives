// ==UserScript==
// @name         SH Add Chapter Numbers
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.2
// @description  Add chapter numbers (release order) to all TOC items on a Scribble Hub series page.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426655/SH%20Add%20Chapter%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/426655/SH%20Add%20Chapter%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    UBPaginationClick();
    // run again after a delay for compatibility with my SH Auto Show Bookmark script
    setTimeout(UBPaginationClick, 1500);

})();

function UBPaginationClick(){
    if( 0 != document.querySelectorAll('div.wi_fic_table.toc:not(.ub-numbered)').length) {
        document.querySelectorAll('div.wi_fic_table.toc:not(.ub-numbered) li.toc_w[order]').forEach(function(element) {
            var linkText = element.querySelectorAll('a')[0].textContent;
            element.querySelectorAll('a')[0].textContent = "(" + element.attributes.order.value + ") " + linkText;
            linkText = null;
        });
        document.querySelectorAll('div.wi_fic_table.toc')[0].classList.add("ub-numbered");

        if( 0 != document.querySelectorAll('ul#pagination-mesh-toc li').length ){
            document.querySelectorAll('ul#pagination-mesh-toc li a').forEach(function(pagBtn) {
                if(pagBtn){
                    pagBtn.addEventListener("click", function(){
                        console.log("click");
                        setTimeout(UBPaginationClick, 800);
                    }, false);
                }
                pagBtn = null;
            });
        }
    }
}
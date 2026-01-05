// ==UserScript==
// @name         CancerRemover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ukrywa permanentnie zablokowanych użytkowników
// @author       @ZasilaczKomputerowy
// @match        https://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28289/CancerRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/28289/CancerRemover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cancerList = null;
    function removeCancer() {
        if(cancerList == null)
        {
            $.ajax({
                url: 'http://www.wykop.pl/ustawienia/czarne-listy/', data: {}, 
                success: function(data) {
                    $(document.body).append('<div id="contener" style="display:none"/>');
                    $('#contener').text(data);
                    cancerList = $(data).find('.usercard').text().split(/\s+/g);
                    $('#contener').remove();
                }
            });
        }
        
        $('.hidden-comment').each(function(d) {
            var name = $(this).find('.showProfileSummary').html().replace(/<\/?[^>]+(>|$)/g, "");

            if($.inArray(name, cancerList))
            {
                $(this).remove();
            }
        });
    }
    
    $(function() {
        removeCancer();
    });
    
    $( document ).ajaxComplete(function( event, xhr, settings ) {
        removeCancer();
    });
})();
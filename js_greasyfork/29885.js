// ==UserScript==
// @name         AccuracyViewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade funcionalidades extras a Humafun!
// @author       Jose Enrique Ayala Villegas
// @match        https://www.humanatic.com/pages/humfun/category.cfm*
// @downloadURL https://update.greasyfork.org/scripts/29885/AccuracyViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/29885/AccuracyViewer.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jshint -W030 */
getListAcu();
function getListAcu(){
    $.ajax({
        url: 'https://www.humanatic.com/pages/humfun/accuracy.cfm',
        async: false,
        success: function(data){
            $(data).find('.category-header-column-2').appendTo('.category-header-row');
            var listAcu = [];
            $(data).find('.category-row').each(function(n){
                listAcu[$('.linkLink',this).attr('id')] = $('.calls-available',this).text().trim();
                var ele = $('.category-column-2',this).toggleClass('category-column-2').toggleClass('category-column-4');
                try{
                    $('.category-row:has(#'+$('.linkLink',this).attr('id')+')>.category-column-3').after(ele);
                }catch(e){}
            });
            $('.humfun-audio-header-title>span')[0].innerText = $('.linkLink#'+pageHcat,data).text().trim() + ' | Accuracy: ' + listAcu[pageHcat];
            localStorage.setItem('listAcu',JSON.stringify(listAcu));
        }
    });
}
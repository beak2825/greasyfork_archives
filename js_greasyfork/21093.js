// ==UserScript==
// @name         Blokace mamrdu na zive.cz
// @namespace    http://www.zive.cz
// @version      0.3
// @description  Blokuje komentáře mamrdů a tím zachovává úroveň diskuzí
// @author       Pavel Koloděj
// @match        http://*.zive.cz/*/default.aspx?artcomments=1*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21093/Blokace%20mamrdu%20na%20zivecz.user.js
// @updateURL https://update.greasyfork.org/scripts/21093/Blokace%20mamrdu%20na%20zivecz.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
                  {
    //seznam dementu - nemocni jedinci, nemohou za svou slabinu a nemeli bychom se jim smat
    var dements = ['Franta Křivánek', 'dolph1888', 'Alan Řepka', 'Franta Boucek', 'Tomáš Riedl', 'Mike Litoris', 'Michal Litecký',
                  'Petko Kotov', 'Viktor Prudič'];
    //seznam iOvci = Taky dementi, jen si za to mohou sami
    var iOvce = ['rolls_royce', 'Roman Šrámek', 'vegasgeek'];
    //seznam tucnaku = Jejich mozkova kapacita bohuzel nemuze dosahovat takove velikosti, aby byli schopni rozumne reagovat.
    var tuxes = ['Michal Ulrych'];
    //jejich spojenim vznikne banda mamrdu
    var mamrds = dements.concat(iOvce.concat(tuxes));
    //a tech je presne tolik
    var length = mamrds.length;
    var replacedText = "Mamrdí komentář byl zablokován pro zachování úrovně diskuze.";
    $('.forum-head').each(function( index ) {
        var username = $(this).find('strong').html();
        var notRegUsername = $(this).find('b').html();
        if (username !== undefined) {
            username = username.replace("&nbsp;"," ");
            if (mamrds.indexOf(username) > -1) {
                $(this).html("<div class='identification'>" + replacedText + "</div>");
                $(this).css({"background-color":"white","border":"1px solid silver"});
                $(this).closest('.forum-row').find('.forum-text').remove();
            }
        } else if(notRegUsername !== undefined) {
            notRegUsername = notRegUsername.replace("&nbsp;"," ");
            if (mamrds.indexOf(notRegUsername) > -1) {
                $(this).html("<div class='identification'>" + replacedText + "</div>");
                $(this).css({"background-color":"white","border":"1px solid silver"});
                $(this).closest('.forum-row').find('.forum-text').remove();
            }
        }
    });
});
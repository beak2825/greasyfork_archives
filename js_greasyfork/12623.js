// ==UserScript==
// @name       jawz MturkHeaderToggle
// @version    1.3
// @description Hides Non essential elements while working on HITs
// @match	   https://www.mturk.com/mturk/preview*
// @match	   https://www.mturk.com/mturk/accept*
// @match	   https://www.mturk.com/mturk/return*
// @match	   https://www.mturk.com/mturk/continue*
// @exclude    https://www.mturk.com/mturk/preview?isPreviousHitExpired*
// @exclude    https://www.mturk.com/mturk/previewandaccept?isPreviousHitExpired*
// @exclude    https://www.mturk.com/mturk/return?isPreviousHitExpired*
// @exclude    https://www.mturk.com/mturk/accept?isPreviousHitExpired*
// @require    http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12623/jawz%20MturkHeaderToggle.user.js
// @updateURL https://update.greasyfork.org/scripts/12623/jawz%20MturkHeaderToggle.meta.js
// ==/UserScript==


if (!$('#alertboxHeader:contains("There are currently no HITs assigned to you.")').length && !$('#alertboxHeader:contains("There are no more available HITs")').length && !$('#alertboxHeader:contains("Your results have been submitted")').length) {
    var state = GM_getValue('state','hide');
    var bond = $('td:contains("Timer")').eq(1);
    
    $('<a>',{
        text: ' Show/Hide',
        title: 'Show/Hide',
        href: '#',
        click: function(){ showHide();return false;}
    }).appendTo(bond);
    
    if (state == 'hide') {
        $('#alertBox').hide();
        $('table').eq(0).hide();
        $('table').eq(4).find('tr').eq(2).hide();
        $('table').eq(4).find('tr').eq(5).hide();
        $('#subtabs_and_searchbar').hide();
    }
}
        
function showHide() {
    if (state == 'hide') {
        state = 'show';
        GM_setValue('state','show');
        $('#alertBox').show();
        $('table').eq(0).show();
        $('table').eq(4).find('tr').eq(2).show();
        $('table').eq(4).find('tr').eq(5).show();
        $('#subtabs_and_searchbar').show();
    } else {
        state = 'hide';
        GM_setValue('state','hide');
        $('#alertBox').hide();
        $('table').eq(0).hide();
        $('table').eq(4).find('tr').eq(2).hide();
        $('table').eq(4).find('tr').eq(5).hide();
        $('#subtabs_and_searchbar').hide();
    }
}
        
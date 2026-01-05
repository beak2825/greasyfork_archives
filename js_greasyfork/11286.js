// ==UserScript==
// @name         MAL seasonal anime page sort
// @namespace https://greasyfork.org/users/6507
// @version      0.2
// @description  MyAnimeList sorting seasonal anime page by score/members.
// @author       nyaa11
// @match        http://myanimelist.net/anime/season*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11286/MAL%20seasonal%20anime%20page%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/11286/MAL%20seasonal%20anime%20page%20sort.meta.js
// ==/UserScript==

var titles, score, members;
$(function() {
    
    $('.js-btn-show-r18').after( '<span class="fl-r mal-sort" style="margin-right: 10px;">Sort by: <button class="inputButton mal-sort-score" >Score</button><button class="inputButton" >Members</button>' );
    $('.mal-sort button').css('margin', '0 2px');
    $('.mal-sort button').click(function() {malSort(this); });
});

function malSort(btn) {
    $('.js-seasonal-anime-list').each(function() {
        titles = [];
        $(this).find('.js-seasonal-anime').each(function () {
            score = parseFloat( $(this).find('.score').text() ) || 0;
            members = parseInt( $(this).find('.member').text().replace(',', '') ) || 0;
            titles.push({elem: this, score: score, members: members});
        });
        
        if(btn.innerHTML === 'Score') {
            titles.sort(function(a, b) {
                return b.score - a.score;
            });
        }
        
        if(btn.innerHTML === 'Members') {
            titles.sort(function(a, b) {
                return b.members - a.members;
            });
        }

        $this = this;
        $.each(titles, function(i,v) {
            $($this).append($(v.elem));
        });
    });
}

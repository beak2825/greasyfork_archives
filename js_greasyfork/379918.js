// ==UserScript==
// @name         Kid Choice Award
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       http://www.kidschoiceawards.com/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379918/Kid%20Choice%20Award.user.js
// @updateURL https://update.greasyfork.org/scripts/379918/Kid%20Choice%20Award.meta.js
// ==/UserScript==
/* position choice on website
      1   2
      3   4
      5   6
*/
//u can edit choice = [ ]
//                  0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2
//pagination   1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
var choice = [6,3,6,4,2,1,3,6,6,4,2,2,5,5,1,3,1,4,3,1,3,5,2,3,2,1,1,1];
var elvote = [186872,186867,186866,186842,186865,186868,186864,186863,186862,186861,186860,186859,186858,186857,186856,186855,186854,186853,186852,186851,186850,186849,186848,186846,186847,186845,186844,186843];
var curNum =0;
window.setInterval(function(){
    if (!(document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__content > div > div.grouped_vote__slider.swiper-container-horizontal.swiper-container-autoheight > div.grouped_vote__pagination > div.grouped_vote_pagination__group > div.grouped_vote_pagination_number > div.js_current_num')===null)){
        curNum = document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__content > div > div.grouped_vote__slider.swiper-container-horizontal.swiper-container-autoheight > div.grouped_vote__pagination > div.grouped_vote_pagination__group > div.grouped_vote_pagination_number > div.js_current_num').innerHTML;
        document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__content > div > div.grouped_vote__slider.swiper-container-horizontal.swiper-container-autoheight > div.grouped_vote__items > div.view-elements-layout.view-voteable.view-vote.grouped-vote-item.element-'+elvote[curNum-1]+'.grouped-vote-item--active > div > div.options > div > div:nth-child('+choice[curNum-1]+') > button').click();
    }
    //if(document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__votes_result').style.display === 'none' && document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__content').style.display === 'none' ){document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__ad > div > div.grouped_vote_ad__footer > div').click();}
    if(((document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__votes_result').className).search("invisible"))>=0  && document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__content').style.display === 'none' ){document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__ad > div > div.grouped_vote_ad__footer > div').click();}
    //if(document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__votes_result').style.display === 'block' && document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__ad').style.display === 'none' ){document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__footer > div > div.grouped_vote__controls > div > div.grouped_vote__button.btn.btn-replay.btn-submit.js_vote_again').click();}
    if(((document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__votes_result').className).search("visible"))>=0 && document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__middle > div.grouped_vote__ad').style.display === 'none' ){document.querySelector('#voting-category-top > div > div > div > div.grouped_vote__footer > div > div.grouped_vote__controls > div > div.grouped_vote__button.btn.btn-replay.btn-submit.js_vote_again').click();}
} ,2000);

// ==UserScript==
// @name         icourse-sort-by-vote
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Revert to the vote sort
// @author       Pointee
// @match        *://icourse.club/course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     GPL v3
// @downloadURL https://update.greasyfork.org/scripts/441662/icourse-sort-by-vote.user.js
// @updateURL https://update.greasyfork.org/scripts/441662/icourse-sort-by-vote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // alert('activated')
    var contents = document.getElementsByClassName('col-md-8 inline-h3')[0];
    var reviews = contents.getElementsByClassName('ud-pd-md dashed review');
    var reviews_list_vote = new Array();
    var reviews_list_time = new Array();
    var i = 0;
    for (i = 0; i < reviews.length; i++) {
        reviews_list_vote.push(reviews[i]);
        reviews_list_time.push(reviews[i]);
    }
    reviews_list_vote.sort(function(a, b){
        var a_votes = a.getElementsByClassName('bm-pd-md grey')[0].getElementsByClassName('nounderline')[0].childNodes[3].textContent;
        var b_votes = b.getElementsByClassName('bm-pd-md grey')[0].getElementsByClassName('nounderline')[0].childNodes[3].textContent;
        return b_votes - a_votes;
    });


    function sort_by_vote(){
        for (i = 0; i < reviews_list_vote.length; i++) {
            contents.appendChild(reviews_list_vote[i]);
        }
    }

    function sort_by_time(){
        for (i = 0; i < reviews_list_time.length; i++) {
            contents.appendChild(reviews_list_time[i]);
        }
    }

    var review_title = document.getElementsByClassName('solid ud-pd-md inline-h3')[0];
    var button_time = document.createElement("button");
    var button_vote = document.createElement("button");
    button_time.innerHTML = '按时间排序';
    button_vote.innerHTML = '按赞同排序';
    button_time.onclick = sort_by_time;
    button_vote.onclick = sort_by_vote;
    review_title.append(button_time);
    review_title.append(button_vote);



})();
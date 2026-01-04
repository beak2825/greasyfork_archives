// ==UserScript==
// @namespace    https://greasyfork.org/en/users/155391-lll
// @version      1.0.0
// @description  Selects common answers, press enter to submit.
// @author       LLL
// @icon         https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @name         !Sergey II (Survey about Short Videos)
// @include      https://www.mturk.com/mturk/*
// @include      https://s3.amazonaws.com/*
// @include      https://www.mturkcontent.com/dynamic/*
// @include      https://worker.mturk.com/projects/35VN5BQM7UAJ7JAW7Z1SVDIGH9Q5JT*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372219/%21Sergey%20II%20%28Survey%20about%20Short%20Videos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372219/%21Sergey%20II%20%28Survey%20about%20Short%20Videos%29.meta.js
// ==/UserScript==

/* globals $ */

$(document).ready(function() {

  window.focus();

    $('input:radio[name="Topic"][value="Yes"]') //#1
    .attr('checked', true);

    $('input:radio[name="Entertaining"][value="No"]') //#2
    .attr('checked', true);

    $('input:radio[name="Transactional"][value="No"]') //#3
    .attr('checked', true);

    $('input:radio[name="Sticky"][value="Yes"]') //#4
    .attr('checked', true);

    $('input:radio[name="Familiar"][value="Yes"]') //#5
    .attr('checked', true);

    $('input:radio[name="Beneficial"][value="Yes"]') //#6
    .attr('checked', true);


    $('input:radio[name="Enriching"][value="Yes"]') //#7
    .attr('checked', true);

    $('input:radio[name="Connected"][value="Yes"]') //#8
    .attr('checked', true);

    $('input:radio[name="Check"][value="Correct"]') // #9 Attention Check
    .attr('checked', true);

    $('input:radio[name="YouTube"][value="Daily"]') //#10
    .attr('checked', true);
});

//Submit // Enter or Numberpad Enter
document.onkeydown = function(e) {
    if (e.keyCode === 13) { // 13 = both enter keys

$("input[id='submitButton']").click();
        }

};


// ==UserScript==
// @name         Wanikani Real Score
// @description  Adds a scoreboard to dashbaord and reviews. Your 'real score' indicates progress toward buring all items (1 point per item per SRS stage).
// @namespace    https://www.wanikani.com
// @version      1.0.7
// @author       jeff8v7
// @include      /^https://(www|preview)\.wanikani\.com/
// @include      /^https://(www|preview)\.wanikani\.com/dashboard/
// @include      /^https://(www|preview)\.wanikani\.com/review/
// @include      /^https://(www|preview)\.wanikani\.com/lesson/
// @exclude      /^https://(www|preview)\.wanikani\.com/lesson/session/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418496/Wanikani%20Real%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/418496/Wanikani%20Real%20Score.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Goal: Show score which goes up predictably based on daily effort and accuracy.
    // Why? Levels progress slowly, show progress toward guru (not burn) and don't account for items slipping back into apprentice later
    // Having 5 scores (apprentice, guru, master, enlightened, burned) is more confusing than motivating, i.e. a high apprentice or guru score can be easily obtained simply failing lots of reviews
    // Easy to compare progress with others.
    // Reward for doing reviews (not just lessons).
    const points_possible = 80064; // 9 x 8896 items

    // CSS Styling
    var rs_css =
        // Reviews  ⬆5 ⭐️ 1⬇
        '#points-positive { margin-right: 0px !important; }' +
        '#points-positive::after { content: " ⭐️ " }' +
        // Review Summary ⭐️ ⬆5 or ⭐️ 1⬇
        'span#scoreboard { font-size:75%; margin-left: 10px }' +
        '#scoreboard .scoreup, #scoreboard .scoredown { margin: 0 10px 0 5px }' +
        '.scoreup::before  { content: "⬆"; font-size:85% }' +
        '.scoredown::after { content: "⬇"; font-size:85% }' +
        '.flameS::before, .flameS::after { content: "🔥"; font-size:75% } ' +
        '.flameM::before, .flameM::after { content: "🔥" } ' +
        '.flameL::before, .flameL::after { content: "🔥"; font-size:125% } ' +
        '.flameS, .flameM, .flameL { color:#ed603b }' +
        // Dashboard 29,302 ⭐️ 21 / 60
        'h1#scoreboard { text-align:right; float:right; }' +
        'span.estimate { color:#ddd; }';

    $('head').append('<style>'+rs_css+'</style>');

    // ---- Page Load - show points
    if (/dashboard/.test(document.URL) || document.URL == "http://www.wanikani.com/" || document.URL == "https://www.wanikani.com/") {
        showScoreOnDashboard();
    }
    else if (/review\/session/.test(document.URL)) {
        $.jStorage.listenKeyChange('currentItem', updateReviewPoints);
    }
    else if (/review/.test(document.URL)) {
        showPointsOnReviewSummary();
    }
    else if (/lesson/.test(document.URL)) {
        showPointsOnLessonSummary();
    }

    // ---- Dashboard - show score and eqivalent level completed
    function showScoreOnDashboard()
    {
        let estimate = 0; // quick estimate, 2.5 for apprentice, 5.5 for guru
        try {
            let aCount = parseInt( document.getElementById('apprentice' ).firstElementChild.innerHTML );
            let gCount = parseInt( document.getElementById('guru'       ).firstElementChild.innerHTML );
            let mCount = parseInt( document.getElementById('master'     ).firstElementChild.innerHTML );
            let eCount = parseInt( document.getElementById('enlightened').firstElementChild.innerHTML );
            let bCount = parseInt( document.getElementById('burned'     ).firstElementChild.innerHTML );
            estimate = Math.round( 9*bCount + 8*eCount + 7*mCount + 5.5*gCount + 2.5*aCount );
        } catch(e) {}

        // show estimate if WK Open Framework isn't available
        if ( !window.wkof ) {
            updateDashboardScore( estimate );
            return;
        }

        // show estimate first while calculating real score
        updateDashboardScore( estimate, true );

        wkof.include('ItemData');
        wkof.ready('ItemData')
            .then(() => wkof.ItemData.get_items('assignments'))
            .then(items => {
            let score = 0;
            for (let i = 0; i < items.length ; i++) {
                if ( items[i] && items[i].assignments ) {
                    score += items[i].assignments.srs_stage;
                }
            }
            updateDashboardScore( score );
        });
    }

    function updateDashboardScore(points, estimate=false)
    {
        if ( points > 0 ) {
            let level = Math.floor(60*points/points_possible);
            let score = numberWithCommas(points);
            let score_html = (estimate ? '<span class="estimate">' + score + '</span>' : score) + ' ⭐️ ' + level + ' / 60';
            let title_html = estimate ? '' : score + ' of ' + numberWithCommas(points_possible) + ' points\n' + Math.floor(100*points/points_possible) + '% complete (' + level + '/60)' ;

            let scoreboard = document.getElementById('scoreboard');
            if ( typeof(scoreboard) != 'undefined' && scoreboard != null ) {
                scoreboard.innerHTML = score_html;
                scoreboard.title = title_html;
            } else {
                $('.progress-component').prepend( '<h1 id="scoreboard" title="' + title_html + '" class="text-xl leading-normal font-medium text-dark-gray m-0">' + score_html + '</h1>' );
            }
        }
    }

    function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

    // ---- Review - Show points earned and lost so far
    let pointsPositive = new Set();
    let pointsNegative = new Set();
    let previousItem;
    let previouslyWrong;
    let previouslyComplete;

    function updateReviewPoints()
    {
        let wrongCount    = $.jStorage.get('wrongCount');
        let completeCount = $.jStorage.get('completedCount');
        let currentItem   = $.jStorage.get('currentItem');
        if ( previousItem ) {
            if ( wrongCount > previouslyWrong ) {
                pointsNegative.add( previousItem.id );
            } else if ( completeCount > previouslyComplete && !pointsNegative.has( previousItem.id ) ) {
                pointsPositive.add( previousItem.id );
            }
        }
        previouslyWrong    = wrongCount;
        previouslyComplete = completeCount;
        previousItem       = currentItem;

        let ptsPos = pointsPositive.size;
        let ptsNeg = pointsNegative.size;
        let positiveElem = document.getElementById('points-positive');
        let negativeElem = document.getElementById('points-negative');
        if ( typeof(positiveElem) != 'undefined' && positiveElem != null ) {
            positiveElem.innerHTML = ptsPos;
            negativeElem.innerHTML = ptsNeg;
        } else {
           $('#stats').prepend( '<span id="points-positive" class="scoreup">' + ptsPos + '</span><span id="points-negative" class="scoredown">' + ptsNeg + '</span>' );
        }
    }

    // ---- Review Summary - Show points earned and items burned
    function showPointsOnReviewSummary()
    {
        let score_html = '';
        let correct   = parseInt( document.getElementById('correct'  ).firstElementChild.firstElementChild.innerHTML );
        let incorrect = parseInt( document.getElementById('incorrect').firstElementChild.firstElementChild.innerHTML );
        let delta = correct-incorrect; // *not accurate for burn failures, but that's ok (should be -2 instead of -1)
        if ( delta != 0 ) {
            let star = delta < 20 ? '⭐️' : delta < 50 ? '⭐️⭐️' : delta < 100 ? '⭐️⭐️⭐️' : '⭐️🤩⭐️';
            score_html += star + '<span class="' + (delta < 0 ? 'scoredown' : 'scoreup' ) + '">'+ Math.abs(delta) +'</span>';
        }

        try {
            let burned = parseInt( $('.burned h3 strong').html() );
            if ( burned > 0 ) {
                let flame = burned < 10 ? "flameS" : burned < 20 ? "flameM" : "flameL";
                score_html += '<span class="' + flame + '">' + burned + '</span> ';
            }
        } catch(e) {}

        $('#reviews-summary div header h1').append( '<span id="scoreboard">' + score_html + '</span>');
    }

    // ---- Lesson Summary - Show points earned
    function showPointsOnLessonSummary()
    {
        let new_r = parseInt( document.getElementById('radicals'  ).firstElementChild.firstElementChild.innerHTML );
        let new_k = parseInt( document.getElementById('kanji'     ).firstElementChild.firstElementChild.innerHTML );
        let new_v = parseInt( document.getElementById('vocabulary').firstElementChild.firstElementChild.innerHTML );
        let delta = new_r + new_k + new_v;
        if ( delta != 0 ) {
            let star = delta < 10 ? '⭐️' : delta < 25 ? '⭐️⭐️' : delta < 50 ? '⭐️⭐️⭐️' : '⭐️🤪⭐️';
            $('#lessons-summary div header h1').append( '<span id="scoreboard">' + star + '<span class="scoreup">'+ delta +'</span></span>' );
        }
    }

})();
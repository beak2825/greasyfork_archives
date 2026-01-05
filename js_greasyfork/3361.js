// ==UserScript==
// @name StackExchange hide closed questions
// @namespace http://ostermiller.org/
// @version 1.13
// @license MIT 
// @description Hide closed questions on the home page and in other lists of questions.   Put a link showing the number of closed questions that have been hidden that shows the closed questions again.
// @include /https?\:\/\/([a-z\.]*\.)?(stackexchange|askubuntu|superuser|serverfault|stackoverflow|answers\.onstartups)\.com\/.*/
// @exclude *://chat.stackoverflow.com/*
// @exclude *://chat.stackexchange.com/*
// @exclude *://chat.*.stackexchange.com/*
// @exclude *://api.*.stackexchange.com/*
// @exclude *://data.stackexchange.com/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/3361/StackExchange%20hide%20closed%20questions.user.js
// @updateURL https://update.greasyfork.org/scripts/3361/StackExchange%20hide%20closed%20questions.meta.js
// ==/UserScript==
(function() {
	'use strict'
    var $ = unsafeWindow.jQuery

    function closedQuestionVisibility(show){

        var numberOfClosed=0;
        $('.question-summary, .s-post-summary').each(function(){
            var e = $(this)
            var t = e.find('h3 a, .s-post-summary--content-title a').text()
            if (t.match(/ \[(migrated|closed|duplicate)\]$/)){
                e.addClass('closed').toggle(show)
                numberOfClosed++
            }
        });
        return numberOfClosed
    }

    function run(){
        if ($('.question-summary, .s-post-summary').length){ // if it has a list of questions
            var numberHidden=closedQuestionVisibility(false)
            if (numberHidden > 0){
                $('#mainbar h1').after(" <a href='#' id='unhideclosedlink'>(" + numberHidden + " hidden closed)</a>")
                $('#unhideclosedlink').click(function(){
                    closedQuestionVisibility(true)
                    $('#unhideclosedlink').hide()
                    return false;
                });
                $('html > head').append("<style>.question-summary.closed .status *, .s-post-summary.closed .s-post-summary--stats * { text-decoration: line-through; }</style>")
            }
        }
    }

    run()

    $('.page-numbers').click(function(){
        setTimeout(run, 2000);
    })
})()

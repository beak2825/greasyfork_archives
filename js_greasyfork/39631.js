// ==UserScript==
// @name         Sentiment analysis script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *raven.eecs.harvard.edu*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39631/Sentiment%20analysis%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39631/Sentiment%20analysis%20script.meta.js
// ==/UserScript==
$(document).ready(function() {
    var sanity = "We have a large number of automobile product customer reviews and we want to know whether these reviews are positive or negative. Please help us classify these customer reviews.";
    if (sanity == $('h4').text()){
        $(document).keyup(function(event){ //Stole some efficiency slothbear
            if (event.which == 49){
                $('input[value=positive]').click();
            } else if (event.which == 50){
                $('input[value=negative]').click();
            } else if (event.which == 13){
                $('a:contains(Submit)').click();
            }
        });
    }
});

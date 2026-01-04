// ==UserScript==
// @name         No more wasting time :)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A dumb vocabsize script
// @author       You
// @match        https://vocabsize.xeersoft.co.th/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458663/No%20more%20wasting%20time%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458663/No%20more%20wasting%20time%20%3A%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function readingData() {
        'use strict';

        // Your code here...

        var theDiv = document.getElementsByClassName('pt-6 pb-6 pl-10');

        var actualShit = [];

        for (let i = 0; i < theDiv.length; i++) {
            if (i % 4 == 0) {
                console.log(theDiv[i].firstChild.data)
                actualShit.push(theDiv[i].firstChild.data)
            }
        }

        localStorage.setItem('actualShit', actualShit);

        console.log("REAL shit is: ", theDiv);
        console.log("Actual shit is: ", actualShit);
    };

    function writingData() {
        'use strict';

        // Your code here...

        var actualShit = localStorage.getItem('actualShit');

        var crap = actualShit.split(',')

        console.log('the crap is: ', crap)

        var indexing = crap;

        var input = document.getElementsByClassName('mg-10 user_ans answer-input')

        for (let i = 0; i < (input.length); i++) {
            input[i].value = indexing[i];
        }

        console.log(input)
    };

    if (/student-practice/.test (location.pathname) ) {
        // Run code for edit pages

        // Read data
        readingData();

        //var gotoCrap = location.pathname.replace("vocab-basic", "student-practice")

        //window.location.replace(gotoCrap);
    }
    else if (/vocab-basic/.test (location.pathname) ) {
        // Run code for delete pages

        //window.location.replace("http://www.w3schools.com");

        //console.log(location.pathname);

        //var gotoCrap = location.pathname.replace("vocab-basic", "student-practice")

        //window.location.replace(gotoCrap.replace("/0", ""));

        //readingData()

        //var backtoCrap  = location.pathname.replace("student-practice", "vocab-basic")

        // Write data
        writingData()
    } else {
        console.log('Im on no page')
    }

})();
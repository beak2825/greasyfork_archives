// ==UserScript==
// @name         History and Bookmarks Filter
// @namespace    Bairdel AO3 History and Bookmarks Filter
// @version      0.3
// @description  Don't display any fics on the page that don't fit in the inputted filters
// @author       Bairdel
// @match        *archiveofourown.org/users/*/bookmarks*
// @match        *archiveofourown.org/users/*/readings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450490/History%20and%20Bookmarks%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/450490/History%20and%20Bookmarks%20Filter.meta.js
// ==/UserScript==

//////////////////////////
// User Filters ///////////// USERS SHOULD ONLY LOOK AT THIS BIT BELOW ///////////

// Top sets an upper limit on the filter e.g. kudos < 500
// Exact shows fics with that exact value e.g. kudos = 500
// Bottom sets a lower limit on the filter e.g. kudos > 500


var wordCheckTop = false;
var wordCheckExact = false;
var wordCheckBottom = false;

var chapterCheckTop = false;
var chapterCheckExact = false;
var chapterCheckBottom = false;

var completeCheck = false;
var WIPCheck = false;

var kudosCheckTop = false;
var kudosCheckExact = false;
var kudosCheckBottom = false;

var bookmarkCheckTop = false;
var bookmarkCheckExact = false;
var bookmarkCheckBottom = false;

var hitCheckTop = false;
var hitCheckExact = false;
var hitCheckBottom = false;

var commentCheckTop = false;
var commentCheckExact = false;
var commentCheckBottom = false;


//////////////////////////////////////// DON'T WORRY ABOUT THIS STUFF /////////////////////////////////////////////////////////////////////////




(function() {
    'use strict';

    // determines if page is a history page or bookmarks page
    var title = document.getElementsByTagName("h2")[0].innerHTML.trim();
    var works;
    if (title == "History") {
        // history page
        works = document.getElementsByClassName("reading work blurb group");

    } else {
        // bookmarks page
        works = document.getElementsByClassName("bookmark blurb group");

    }

    // iterate through all works on page
    for (let i=0; i < works.length; i++) {
        var currentWork = works[i];

        // gets all stats
        var words
        var chapters
        var comments;
        var kudos;
        var bookmarks;
        var hits
        var complete;



        // sometimes fics don't have kudos, comments, or bookmarks so set to 0
        try {
            comments = Number(currentWork.getElementsByClassName("comments")[1].textContent);
        } catch(e) {
            comments = 0;
        }

        try {
            kudos = Number(currentWork.getElementsByClassName("kudos")[1].textContent);
        } catch(e) {
            kudos = 0;
        }

        try {
            bookmarks = Number(currentWork.getElementsByClassName("bookmarks")[1].textContent);
        } catch(e) {
            try {
                bookmarks =Number(currentWork.getElementsByClassName("stats")[0].getElementsByTagName("dd")[2].textContent.replace(",","").replace(".",""));
            } catch(w) {
                bookmarks = 0
            }
        }


        // sometimes there are series in bookmarks
        try {
            chapters = currentWork.getElementsByClassName("chapters")[1].textContent;
            // checks if complete
            if (chapters.split("/")[0] == chapters.split("/")[1]) { // complete if chapters = final chapter count
                complete = true;
            } else {
                complete = false;
            }

            chapters = Number(chapters.split("/")[0]); // allow filtering by chapters
        } catch(e) {
            try {
                chapters = Number(currentWork.getElementsByClassName("stats")[0].getElementsByTagName("dd")[1].textContent);
            } catch(w) {
                chapters = 1;
            }
        }

        try {
            hits = Number(currentWork.getElementsByClassName("hits")[1].innerHTML);
        } catch(e) {
            hits = bookmarks;
        }

        try {
            words = Number(currentWork.getElementsByClassName("words")[1].innerHTML.replace(",","").replace(".",""));
        } catch(e) {
            try {
                words = Number(currentWork.getElementsByClassName("stats")[0].getElementsByTagName("dd")[0].textContent.replace(",","").replace(".",""));
            } catch(w) {
                words = 0
            }
        }


        ////////////////////////////////////////////////
        // remove fic from view if outside of range stated

        ////////// words /////////////

        if (wordCheckTop != false) {
            if (words > wordCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (wordCheckExact != false) {
            if (words != wordCheckExact) {
                currentWork.style.display = 'none';
            }

        }
        if (wordCheckBottom != false) {
            if (words < wordCheckBottom) {
                currentWork.style.display = 'none';
            }

            ////////// chapters /////////////

        }
        if (chapterCheckTop != false) {
            if (chapters > chapterCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (chapterCheckExact != false) {
            if (chapters != chapterCheckExact) {
                currentWork.style.display = 'none';
            }
        }
        if (chapterCheckBottom != false) {
            if (chapters < chapterCheckBottom) {
                currentWork.style.display = 'none';
            }
        }

        ////////// complete /////////////

        if (completeCheck != false) {
            if (complete == false) {
                currentWork.style.display = 'none';
            }
        }
        if (WIPCheck != false) {
            if (complete == true) {
                currentWork.style.display = 'none';
            }
        }

        ////////// kudos /////////////

        if (kudosCheckTop != false) {
            if (kudos > kudosCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (kudosCheckExact != false) {
            if (kudos != kudosCheckExact) {
                currentWork.style.display = 'none';
            }
        }
        if (kudosCheckBottom != false) {
            if (kudos < kudosCheckBottom) {
                currentWork.style.display = 'none';
            }
        }

        ////////// bookmarks /////////////

        if (bookmarkCheckTop != false) {
            if (bookmarks > bookmarkCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (bookmarkCheckExact != false) {
            if (bookmarks != bookmarkCheckExact) {
                currentWork.style.display = 'none';
            }
        }
        if (bookmarkCheckBottom != false) {
            if (bookmarks < bookmarkCheckBottom) {
                currentWork.style.display = 'none';
            }
        }

        ////////// hits /////////////

        if (hitCheckTop != false) {
            if (hits > hitCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (hitCheckExact != false) {
            if (hits != hitCheckExact) {
                currentWork.style.display = 'none';
            }
        }
        if (hitCheckBottom != false) {
            if (hits < hitCheckBottom) {
                currentWork.style.display = 'none';
            }
        }

        ////////// comments /////////////

        if (commentCheckTop != false) {
            if (comments > commentCheckTop) {
                currentWork.style.display = 'none';
            }
        }
        if (commentCheckExact != false) {
            if (comments != commentCheckExact) {
                currentWork.style.display = 'none';
            }
        }
        if (commentCheckBottom != false) {
            if (comments < commentCheckBottom) {
                currentWork.style.display = 'none';
            }
        }

    }

})();
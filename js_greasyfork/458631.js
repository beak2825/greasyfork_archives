// ==UserScript==
    // @name         AO3 Bookmark Maker (Adds title, author, workID, summary to bookmark notes automatically)
    // @namespace    Ellililunch AO3 Bookmark Maker
    // @description  Automatically adds the fic info (title, author, series/workID, and summary) to the bookmark notes while preserving any existing notes. It also adds word count tags or a "WIP" tag. Automatically sets all new bookmarks to default to being private as well. Great for tracking bookmarks. Helpful for re-readers! Or to figure out what that deleted fic used to be! (Note this is included in my AO3 Re-read Savior script)
    // @version      0.9
    // @history      0.0 modified Bairdel's Bookmark Maker to autopopulate title, author, and summary
    // @history      0.1 added workID to autopopulated info (on suggestion of oliver t)
    // @history      0.2 added if-else if-else statement so existing notes that don't include fic info will get fic info added but if editing an existing bookmark that already has the fic info/summary in the notes it won't be duplicated (friendlier to rereaders)
    // @history      0.3 patched error where Anonymous accounts break the author variable on the suggestions of  w4tchdoge on greasyfork
    // @history      0.4 added nested if-else statement where if summary has already been added but without workID, workID will be added in front of the reread date.
    // @history      0.5 modified bookmark maker to be based off the title and author variables instead of "Summary:" // reformatted it all to lose the heading formatting + make it easier to read.
    // @history      0.6 added automatic word count range tags with the help of w4tchdoge
    // @history      0.7 fixed issues with automatic word count range tags, put fic info (title, author, summary, and workID) in collapsed element.
    // @history      0.8 added a line of commented out code that can be uncommented that adds the read date everytime the bookmark is updated.
    // @history      0.9 added series functionality!!!
    // @author       Ellililunch
    // @match        *archiveofourown.org/works/*
    // @match        *archiveofourown.org/series/*
                     // note oliver t has found that it did NOT work if you use the typical userscripts extension app (they downloaded Stay - Userscripts Extension which is a “Tampermonkey for Safari” thing) but also found changing @match to @include worked as well
    // @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458631/AO3%20Bookmark%20Maker%20%28Adds%20title%2C%20author%2C%20workID%2C%20summary%20to%20bookmark%20notes%20automatically%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458631/AO3%20Bookmark%20Maker%20%28Adds%20title%2C%20author%2C%20workID%2C%20summary%20to%20bookmark%20notes%20automatically%29.meta.js
// ==/UserScript==


//////////THE BOOKMARK SAVIOR/////////////
////////////automatically adds title, author, workID and summary above exisiting notes in bookmark////////////
////this is all modified from Bairdel's AO3 Bookmarking Records, with immense help from w4tchdoge

(function() {

    //fun future ideas:
    // set so that if summary is empty, summary variable is set to "no summary" (so possibly grab the first paragraph of the fic... or both. Otherwise empty summary variable seems to break the whole code entirely...

    ////////////////////////// customisations ///////////////////////////////// DO NOT WORRY ABOUT
    // get the current date. should be in local time. you could add HH:MM if you wanted.
    var currdate = new Date();
    var dd = String(currdate.getDate()).padStart(2, '0');
    var mm = String(currdate.getMonth() + 1).padStart(2, '0'); //January is 0
    var yyyy = currdate.getFullYear();
    var hh = String(currdate.getHours()).padStart(2, '0');
    var mins = String(currdate.getMinutes()).padStart(2, '0');
    // change to preferred date format
    var date;
    //date = dd + '/' + mm + '/' + yyyy + " " + hh + ":" + mins;
    date = mm + '/' + dd + '/' + yyyy; //this is the USA standard date format
    console.log(date);


    // Excluding the date, these are all the variables I'll use, generally grouped.
    var author;
    var title;
    var summary;
    var ID_type;
    var ao3ID = window.location.href.split("/")[4]; // seems to work for both works and series, the code was suggested by oliver t, and is useful if a work is deleted and you want to recreate the URL for the wayback machine
    var info_type;
    var fic_info; //this is the variable that will contain the fic info and how it's orderedformatted

    var status;
    var series_notes;
    var lastChapter;

    var newBookmarkNotes; //this is the variable that will set the new bookmark note
    var oldBookmarkNotes = (document.getElementById("bookmark_notes").innerHTML); // this is your existing bookmark notes

    var words; // this is wordcount as returned by ao3 as a string
    var words_XPath; // this gets the wordcount from ao3 regardless of normal or weird way it's reported
    var wordsINT; // this variable will take the string returned by words and turn it into an integer
    var word_tag; // this variable will input the word count range tag base of wordsINT and the switch statements

    var WIP_tag;
    var chapters_XPath; // this is for the code to do the thinking on how to get chapters (1/1, 5/5, 4/7, 13/? etc) from ao3 regardless of reported normal or reported data-ao3e-original weird way
    var chapters; // this is the ao3 fic chapters as a string
    var latestChapter; // this part of the chapters string __/#
    var outOfChapters; // this part of the chapters string #/__
    var WIP_reading_tag = "";


    //////////////////// THIS IS NOT THE BIT FOR YOU TO LOOK AT /////////////////////////////////////////////////////////////////////////////////////

    // puts it all together. feel free to change this format to whatever you like.
    // <br> puts the next text on a new line
    // options for variables are:
    // date = current date
    // title = title of fic
    // author = author of fic
    // summary = fic summary
    // oldBookmarkNotes = existing bookmark notes
    // newBookmarkNotes = this is the variable for the new bookmark notes

    // Want a collabsible element to hide fic info and keep your bookmarks uncluttered? use the <detail> and <summary> elements.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////   NOW FOR THE INFO  //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // checks if series
    var seriesTrue = document.getElementsByClassName("current")[0];
    if (seriesTrue != undefined) {
        // options for series bookmark notes
        ID_type = "SeriesID";
        info_type = "Series";
        // frankly I think only title and author work. but since the rest is broken, none of it works. if you figure out how to get series info, PLEASE let me know. otherwise, stick to bookmarking fics with summaries like me 😅
        title = document.getElementsByTagName("h2")[0].innerHTML.trim(); // series title, confirmed works
        author = document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // series author, confirmed works
        // many times, series dont have summaries. i have confirmed this works in both cases
        if (document.querySelector('.series.meta.group .userstuff') != null) { // If summary exists, retrieve series summary
            summary = document.querySelector('.series.meta.group .userstuff').innerHTML;
        }
        else if (document.querySelector('.series.meta.group .userstuff') == null) { // Else assign a blank string to the summary var
            summary = 'no series summary';
        }


        //incorporating the code w4tchdoge rec'd for testing if series were WIPs or not:
        var
        statusCheck_XPath = '//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[contains(text(), "Complete")]/following-sibling::*[1]',
            status_check_elem = document.evaluate(statusCheck_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
            status_check = status_check_elem.textContent,
            series_bookmark_tag_input = document.querySelector('input#bookmark_tag_string_autocomplete');

        switch (status_check) {
            case 'No':
                WIP_tag = "WIP";
                break;

            case 'Yes':
                WIP_tag = "";
                break;

            default:
                break;
        }









    } else { // options for fics
        ID_type = "WorkID";
        info_type = "Fic";
        title = document.getElementsByClassName("title heading")[0].innerHTML.trim(); // fic name
        author = document.querySelector("#workskin > .preface .byline").textContent.trim(); // new way of finding fic author regardless of Anonymous suggested by w4tchdog on greasyfork, this was the old way if that breaks it for you: document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // old way of finding fic author
        summary = document.getElementsByClassName("summary")[0].innerText.substring(10, document.getElementsByClassName("summary")[0].innerText.length); // old way to get summmary that had all sorts of OG formatting: document.getElementsByClassName("summary")[0].innerHTML; // summary attempt
        // this code to try and set empty summaries to "no summary" did not work :(
        /*if (document.getElementsByClassName("summary") != null) { // If summary exists, retrieve work summary (not sure if this works yet v. 1.2.3?
				document.getElementsByClassName("summary")[0].innerText.substring(10, document.getElementsByClassName("summary")[0].innerText.length);
			}
			else { // Else assign a blank string to the summary var //if (document.getElementsByClassName("summary") == null)
				summary = 'no summary';
			} */


        // I want to get chapter info so wips are automatically tagged "WIP"
        // chapters are reported as either class="chapters" or class="chapters" data-ao3e-original. idk why
        chapters_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Chapters:"]/following-sibling::*[1]/self::dd';
        chapters = document.evaluate(chapters_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.toString();
        latestChapter = chapters.split("/")[0]; // confirmed works for cases: 1/1, 5/5, 10/10, 4/7, 5/?
        outOfChapters = chapters.split("/")[1]; // confirmed works for cases: 1/1, 5/5, 10/10, 4/7, 5/?

        if (outOfChapters == "?") {
            WIP_tag = "WIP";
        } else {
            outOfChapters = parseInt(outOfChapters);
            latestChapter = parseInt(latestChapter);
            // ok those were tested and it seemed to work up to here
            if (latestChapter / outOfChapters !== 1) {
                WIP_tag = "WIP";
            } else {
                WIP_tag = "";
            }
        }

        // IF YOU WANT A "READ UP TO CHAPTER X" note added to bookmarked WIPS: (if you don't want this, comment the if statement out!
        if (WIP_tag == "WIP") {
            WIP_reading_tag = "Read up to chapter " + latestChapter;
        }

        // fills in the bookmark notes box.
        //document.getElementById("bookmark_notes").innerHTML = newBookmarkNotes;



    } // end of if statement on what to do with works




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////  BOOKMARK BOX POPULATION  ////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /// THIS HERE IS THE CODE FOR HOW TO DEAL WITH NEW BOOKMARKS vs EXISTING BOOKMARKS
    // options for series bookmark notes
    fic_info = "<details><summary>" + info_type + " Info</summary><b>" + title + " by " + author + "</b> (" + ID_type + ": " + ao3ID + ")<blockquote>Summary: " + summary + "</blockquote></details>";


    if (oldBookmarkNotes === "") { //learned this from: https://stackoverflow.com/questions/154059/how-do-i-check-for-an-empty-undefined-null-string-in-javascript
        // if no existing bookmarks, then add all info to bookmarks notes:
        newBookmarkNotes = fic_info;

        // automatically checks the Private Bookmark checkbox. Set to false if you don't want this.
        document.getElementById("bookmark_private").checked = true; // by having this code apply to only new bookmarks, your existing bookmark privacy settings will be saved.

    } else if (oldBookmarkNotes.includes(ao3ID)) { //learned this from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
        // if existing bookmark with fic info (determined by the presence of the work ID), then make no changes to the bookmark notes
        newBookmarkNotes = oldBookmarkNotes; ///trying to see if I can add reread date to existing bookmark notes... we'll see babes

    } else { // learned this from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
        //if there is an existing bookmark note, but it does not yet contain the fic info (determined by absence of workID)
        newBookmarkNotes = fic_info + oldBookmarkNotes;

    }


    // LOOK HERE IF YOU WANT THE "Read" DATE AUTOMATICALLY ADDED EVERY TIME YOU UPDATE YOUR BOOKMARK:
    //newBookmarkNotes = newBookmarkNotes + "<br>Read: " + date; //this line is currently commented out, but if you delete "//" then it'll add the read date to the end of your bookmarks every time the bookmark is updated.

    newBookmarkNotes = newBookmarkNotes.replace('<img alt="(Restricted)" title="Restricted" src="/images/lockblue.png" width="15" height="15">',''); // this clears out the locked fic image regardless of when the bookmark was made
    document.getElementById("bookmark_notes").innerHTML = newBookmarkNotes;







    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////  AUTO TAG POPULATION  //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    // If fic is complete automatically tags the wordcount range from the following: <1K words, 1-5K words, 5-10K words, 10-20K words, 20-40K words, 40-60K words, 60-100K words, and >100K words.
    // i think word count range tags work for series, if you encounter a bug let me know!!

    /////now for automatically adding tags (want to automatically add word count ///with help from w4tchdoge

    // ao3 seems to alternate between wordcount having a space or comma between the thousands and hundreds place depending on how the page loads. no idea why. seems to lean towards thte space on my phone. still no idea why
    // new attempt for version 1.1.1.2 with w4tchdoge suggestion for weird words issue: (also seems to work for series, tested with footlose's the loaded march (exposed multi comma issue resolved by replaveAll)
    words_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd';
    words = document.evaluate(words_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.toString();

    // words = words.replaceAll(/,| /gi, ''); this was w4tchdoge's code, broke with the weird words
    // trying out my if statements again:
    if (words.includes(",")) {
        words = words.replaceAll(",", ""); //https://www.w3schools.com/jsref/jsref_string_replaceall.asp
    }
    if (words.includes(" ")) {
        words = words.replaceAll(" ", "");// words = words.slice(0, 3); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
    }
    if (words.includes(" ")) {
        words = words.replaceAll(/\s/g, ""); //https://www.w3schools.com/jsref/jsref_string_replaceall.asp, https://futurestud.io/tutorials/remove-all-whitespace-from-a-string-in-javascript
    }

    wordsINT = parseInt(words);


    // w4tchdoge's switch statements: (modified to add case >100K words + if words is NaN. tested all cases, and when wordINT parses correctly, this all works great.
    switch (true) { // constructed from example shown in https://stackoverflow.com/a/48969351/11750206
        case WIP_tag == "WIP": // if WIP, no word count yet! word count will be an indicator of a complete fic.
            word_tag = "";
            break;

        case wordsINT < 100: // number chose arbitrarily
            word_tag = "      <100 words, ";
            word_tag = word_tag + ",        words: " + words + " , wordsINT: " + wordsINT; // if you see these, it means the code messed up... sorry
            break;

        case wordsINT < 1000:
            word_tag = "<1K words";
            break;

        case wordsINT >= 1000 && wordsINT < 5000:
            word_tag = "1-5K words";
            break;

        case wordsINT >= 5000 && wordsINT < 10000:
            word_tag = "5-10K words";
            break;

        case wordsINT >= 10000 && wordsINT < 20000:
            word_tag = "10-20K words";
            break;

        case wordsINT >= 20000 && wordsINT < 40000:
            word_tag = "20-40K words";
            break;

        case wordsINT >= 40000 && wordsINT < 60000:
            word_tag = "40-60K words";
            break;

        case wordsINT >= 60000 && wordsINT < 100000:
            word_tag = "60-100K words";
            break;

        case wordsINT >= 100000 && !(isNaN(wordsINT)):
            word_tag = ">100K words";
            break;

        case (isNaN(wordsINT) && words == "Words:"): // I think this occurs when "data-ao3e-original"
            word_tag = "    K words, NaN error";
            /*words = "data-ao3e-original issue?"
        var words2 = "words2";
            words2 = document.getElementsByClassName('"words" data-ao3e-original')[1].innerText.toString(); */
            word_tag = word_tag + ",        words: " + words + " , wordsINT: " + wordsINT; // if you see these, it means the code messed up... sorry
            break;

        default:
            word_tag = "switch statement not executed";
            break;
    }



    // you can also add your own default automatic tags like this: + "tag 1, tag 2"
    // make sure all tags are comma separated. Do not worry about duplicate tags, AO3 gets rid of that automatically.

    var tag_input_box = document.querySelector('.input #bookmark_tag_string_autocomplete');
    tag_input_box.value = "untagged, tracker 1.9.2,     " + word_tag + ",       " + WIP_tag + ",  " + WIP_reading_tag + ",      ";


})();



//////////////////// backup AO3 clone fic title, author, and summary at bottom of page (helpful when author is anonymous and the modifed Bairdel's Bookmark Maker doesn't help)////// ... I think I can finally get rid of this
(function($) {
    $(document).ready(function() {
        var wordcount = $('.meta .stats dl dd.words').clone();
        $('#feedback').parent().after(wordcount);
    });
})(window.jQuery);
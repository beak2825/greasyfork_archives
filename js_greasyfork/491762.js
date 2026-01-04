// ==UserScript==
// @name    ao3 bookmark helper
// @description makes bookmarks easier
// @namespace   ao3
// @match       http*://archiveofourown.org/works/*
// @match       http*://archiveofourown.org/series/*
// @grant       none
// @version     2.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491762/ao3%20bookmark%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/491762/ao3%20bookmark%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*START SETTINGS: Change these to true/false based on your preferences*/
    /*SETTINGS THAT APPLY TO ALL BOOKMARKS*/

    const NOTES_APPEND_TO_PREVIOUS = false; // When editing a pre-existing bookmark, should the pre-existing notes be preserved?
    /*Note: If you toggle this to true, and repeatedly edit the same bookmark, it will repeatedly add the same information to the box, growing it over and over.*/
    /*This setting is more meant for people who need to go back to their previous bookmarks to add the information this script provides, without losing their old notes.*/
    /*In either case, this script does not run on archiveofourown.org/users/USERNAME/bookmarks pages, so you are able to edit bookmarks there with this on and not re-add the same information again*/

    /*WORK BOOKMARK SETTINGS*/
    const ADD_URL_AND_USERNAME = true; // Add the title of the work and the username (and pseud if applicable) of the creator with relevant links to each to the bookmark notes.
    //Note: Highly recommended as bookmark notes are not deleted when a work is deleted, and finding a lost work is easier with the title, username, and url.

    const ADD_SUMMARY = true; // Add the summary of the work to the bookmark notes

    const REC_DEFAULT = true; // Autocheck the Rec checkbox to make the bookmark a rec
    const PRIVATE_DEFAULT = false; // Autocheck the Private checkbox to make the bookmark private


    const ADD_CATEGORIES = false; // Add a copy of the relationship categories to the bookmarker tag list
    const ADD_FANDOM_TAGS = true; // Add a copy of the fandom tags to the bookmarker tag list
    const ADD_CHARACTER_TAGS = true; // Add a copy of the character tags to the bookmarker tag list
    const ADD_RELATIONSHIP_TAGS = true; // Add a copy of the relationship tags to the bookmarker tag list
    const ADD_ADDITIONAL_TAGS = true; // Add a copy of the additional/freeform tags to the bookmarker tag list
    const ADD_RATING = true; // Add a copy of the rating (with "Rating: " before it) to the bookmarker tag list
    const ADD_ARCHIVE_WARNINGS = true; // Add a copy of the archive warnings to the bookmarker tag list

    const ADD_CUSTOM_TAGS = false; // Add set default tags to bookmarker tag list, default tags listed below
    const CUSTOM_TAGS = "TBR, Example Tag, Example Tag 2"; // List of the default tags the bookmark will be given, comma seperated.

    const ADD_EXACT_WORDCOUNT_TAG = false; // Add a tag with the exact word count

    const ADD_WORDCOUNT_TAG = true; // Add a tag for the word count from the following set
    //Word count will be split up into 7 groups, edit the list below to change the ranges (default: 1000, 10000, 20000, 50000, 100000, 150000)
    //the ranges will be < the first number, first number - second number, second number - third number, etc and finally > the last number
    const WORDCOUNTS = [1000, 10000, 20000, 50000, 100000, 150000];

    const ADD_EXACT_WORDCOUNT_TAG_LIST = true; // Add a tag for special case word counts (ie. 100 words, 1000 words, etc) Does not have to be 3, can be any number of special cases
    const EXACT_WORDCOUNT_TAG_LIST = [100, 1000, 10000]

    /*SERIES BOOKMARK SETTINGS*/

    const ADD_SERIES_URL_AND_USERNAME = true; // Add the title of the series and the username(s) (and pseud(s) if applicable) of the creator(s) with relevant links to each to the bookmark notes.
    //Highly recommended

    const ADD_WORK_COUNT_TAG = true; // Add the number of works in the series to the tags

    const ADD_EXACT_WORDCOUNT_TAG_SERIES = true; // Add a tag with the exact word count

    const ADD_CUSTOM_TAGS_SERIES = false; // Add set default tags to bookmarker tag list, default tags listed below
    const CUSTOM_TAGS_SERIES = "TBR S, Example Tag S, Example Tag 2 S"; // List of the default tags the bookmark will be given, comma seperated.

    const ADD_CUSTOM_TAGS_FOR_WORKS = false; //Add the custom tags that are listed for work bookmarks to series bookmarks too

    const REC_DEFAULT_SERIES = true; // Autocheck the Rec checkbox to make the bookmark a rec on series bookmarks
    const PRIVATE_DEFAULT_SERIES = false; // Autocheck the Private checkbox to make the bookmark private on series bookmarks


    /*END SETTINGS*/


    var url = window.location.href;
    if(url.includes("/works/"))
    {
        Bookmarks4Works(url);
    }
    else if(url.includes("/series/"))
    {
        Bookmarks4Series(url);
    }

    function Bookmarks4Works(url)
    {
        url = window.location.href;
        var notesBoxText = "";
        var notesBox = document.getElementById("bookmark_notes");

        if(ADD_URL_AND_USERNAME)
        {

            var title = document.getElementsByClassName("title heading");
            var userName = document.getElementsByClassName("byline heading");
            userName = userName[0];
            title = title[0];
            if(userName.textContent.includes("("))
            {
                var pseud = userName.textContent.split("(");
                userName = pseud[1].trim();
                pseud = pseud[0].trim();
                userName = userName.substring(0, userName.length-1);
                notesBoxText = "<a href=\"" + url + "\">" + title.textContent.trim() + "</a> by <a href=\"/users/" + userName + "/pseuds/" + pseud + "\"> (" + pseud + ") " + userName + "</a>";

            }
            else
            {
                userName = userName.textContent.trim();
                notesBoxText = "<a href=\"" + url + "\">" + title.textContent.trim() + "</a> by <a href=\"/users/" + userName + "/pseuds/" + userName + "\">" + userName + "</a>";
            }
        }

        if(ADD_SUMMARY)
        {
            var summary = document.getElementsByClassName("summary");
            if(summary.length != 0)
            {
                summary = summary[0];
                summary = summary.getElementsByClassName("userstuff");
                notesBoxText = notesBoxText + "\n\nSummary: " + summary[0].textContent;
            }
        }

        if(REC_DEFAULT)
        {
            var recBox = document.getElementById("bookmark_rec");
            recBox.checked = true;
        }

        if(PRIVATE_DEFAULT)
        {
            var privateBox = document.getElementById("bookmark_private");
            privateBox.checked = true;
        }

        var tagBox = document.getElementById("bookmark_tag_string_autocomplete");
        var i = 0;

        if(ADD_CATEGORIES)
        {
            var categorys = document.getElementsByClassName("category tags");
            var categoryTags = categorys[1].getElementsByClassName("tag");
            i = 0;
            while(i < categoryTags.length)
            {
                tagBox.value = tagBox.value + ", " + categoryTags[i].textContent;
                i++;
            }
        }

        if(ADD_FANDOM_TAGS)
        {
            var fandoms = document.getElementsByClassName("fandom tags");
            var fandomTags = fandoms[1].getElementsByClassName("tag");
            i = 0;
            while(i < fandomTags.length)
            {
                tagBox.value = tagBox.value + ", " + fandomTags[i].textContent;
                i++;
            }

        }


        if(ADD_CHARACTER_TAGS)
        {
            var characters = document.getElementsByClassName("character tags");
            if(characters.length != 0)
            {
                var characterTags = characters[1].getElementsByClassName("tag");
                i = 0;
                while(i < characterTags.length)
                {
                    tagBox.value = tagBox.value + ", " + characterTags[i].textContent;
                    i++;
                }
            }
        }


        if(ADD_RELATIONSHIP_TAGS)
        {
            var relationships = document.getElementsByClassName("relationship tags");
            if(relationships.length != 0)
            {
                var relationshipTags = relationships[1].getElementsByClassName("tag");
                i = 0;
                while(i < relationshipTags.length)
                {
                    tagBox.value = tagBox.value + ", " + relationshipTags[i].textContent;
                    i++;
                }
            }
        }


        if(ADD_ADDITIONAL_TAGS)
        {
            var freeforms = document.getElementsByClassName("freeform tags");
            if(freeforms.length != 0)
            {
                var freeformTags = freeforms[1].getElementsByClassName("tag");
                i = 0;
                while(i < freeformTags.length)
                {
                    tagBox.value = tagBox.value + ", " + freeformTags[i].textContent;
                    i++;
                }
            }
        }


        if(ADD_RATING)
        {
            var ratings = document.getElementsByClassName("rating tags");
            var ratingTags = ratings[1].getElementsByClassName("tag");
            i = 0;
            while(i < ratingTags.length)
            {
                tagBox.value = tagBox.value + ", Rating: " + ratingTags[i].textContent;
                i++;
            }
        }


        if(ADD_ARCHIVE_WARNINGS)
        {
            var warnings = document.getElementsByClassName("warning tags");
            var warningTags = warnings[1].getElementsByClassName("tag");
            i = 0;
            while(i < warningTags.length)
            {
                tagBox.value = tagBox.value + ", " + warningTags[i].textContent;
                i++;
            }
        }


        if(ADD_CUSTOM_TAGS)
        {
            tagBox.value = tagBox.value + ", " + CUSTOM_TAGS
        }
        var wordcount = document.getElementsByClassName("words");
        wordcount = wordcount[1].textContent;
        wordcount = RemoveCommas(wordcount);

        if(ADD_EXACT_WORDCOUNT_TAG)
        {
            tagBox.value = tagBox.value + ", Word Count:" + wordcount;
        }

        if(ADD_WORDCOUNT_TAG)
        {
            if(wordcount < WORDCOUNTS[0])
            {
                tagBox.value = tagBox.value + ", Word Count: < " + WORDCOUNTS[0];
            }
            else if(wordcount >= WORDCOUNTS[0] & wordcount < WORDCOUNTS[1])
            {
                tagBox.value = tagBox.value + ", Word Count: " + WORDCOUNTS[0] + "-" + WORDCOUNTS[1];
            }
            else if(wordcount >= WORDCOUNTS[1] & wordcount < WORDCOUNTS[2])
            {
                tagBox.value = tagBox.value + ", Word Count: " + WORDCOUNTS[1] + "-" + WORDCOUNTS[2];
            }
            else if(wordcount >= WORDCOUNTS[2] & wordcount < WORDCOUNTS[3])
            {
                tagBox.value = tagBox.value + ", Word Count: " + WORDCOUNTS[2] + "-" + WORDCOUNTS[3];
            }
            else if(wordcount >= WORDCOUNTS[3] & wordcount < WORDCOUNTS[4])
            {
                tagBox.value = tagBox.value + ", Word Count: " + WORDCOUNTS[3] + "-" + WORDCOUNTS[4];
            }
            else if(wordcount >= WORDCOUNTS[4] & wordcount < WORDCOUNTS[5])
            {
                tagBox.value = tagBox.value + ", Word Count: " + WORDCOUNTS[4] + "-" + WORDCOUNTS[5];
            }
            else if(wordcount >= WORDCOUNTS[5])
            {
                tagBox.value = tagBox.value + ", Word Count: > " + WORDCOUNTS[4];
            }
        }

        if(ADD_EXACT_WORDCOUNT_TAG_LIST)
        {
            var j = 0;
            while(j < EXACT_WORDCOUNT_TAG_LIST.length)
            {
                if(wordcount == EXACT_WORDCOUNT_TAG_LIST[j])
                {
                    tagBox.value = tagBox.value + ", Word Count: " + EXACT_WORDCOUNT_TAG_LIST[j];
                    j = EXACT_WORDCOUNT_TAG_LIST.length;
                }
                j++;
            }
        }

        if(NOTES_APPEND_TO_PREVIOUS)
        {
            if(notesBox)
            {
                notesBox.value = notesBox.value + "\n" + notesBoxText;
            }
        }
        else
        {
            if(notesBox)
            {
                notesBox.value = notesBoxText;
            }
        }

        return ;
    }

    function Bookmarks4Series(url)
    {
        var notesBox = document.getElementById("bookmark_notes");
        var notesBoxText = "";
        var statsPanel = document.getElementsByClassName("series meta group")[0]
        var tagBox = document.getElementById("bookmark_tag_string_autocomplete");
        if(ADD_SERIES_URL_AND_USERNAME)
        {

            var seriesTitle = document.getElementsByTagName("h2");

            var userNames = statsPanel.querySelectorAll('[rel="author"]')


            seriesTitle = seriesTitle[0];
            if(notesBox)
            {
                for(var i = 0; i < userNames.length; i++)
                {
                    if(userNames[i].textContent.includes("("))
                    {
                        var pseud = userNames[i].textContent.split("(");
                        var username = pseud[1].trim();
                        pseud = pseud[0].trim();
                        username = username.substring(0, username.length-1);
                        username = "<a href=\"/users/" + username + "/pseuds/" + pseud + "\"> (" + pseud + ") " + username + "</a>";
                    }
                    else
                    {
                        var username = userNames[i].textContent.trim();
                        username ="<a href=\"/users/" + username + "/pseuds/" + username + "\">" + username + "</a>";
                    }
                    if(i == 0)
                    {
                        notesBoxText = "<a href=\"" + url + "\">" + seriesTitle.textContent.trim() + "</a> by " + username;
                    }
                    else
                    {
                        notesBoxText = notesBoxText + " & " + username;
                    }
                }

            }

        }


        if(ADD_WORK_COUNT_TAG)
        {
            var workCount = document.getElementsByClassName("works")
            tagBox.value = tagBox.value + ", Works in series: " + workCount[1].textContent;
        }

        if(ADD_EXACT_WORDCOUNT_TAG_SERIES)
        {
            var wordCount = document.getElementsByClassName("words")
            tagBox.value = tagBox.value + ", Words in series: " + wordCount[1].textContent;
        }

        if(ADD_CUSTOM_TAGS_SERIES)
        {
            tagBox.value = tagBox.value + ", " + CUSTOM_TAGS_SERIES;
        }

        if(ADD_CUSTOM_TAGS_FOR_WORKS)
        {
            tagBox.value = tagBox.value + ", " + CUSTOM_TAGS;
        }
        if(REC_DEFAULT_SERIES)
        {
            var recBox = document.getElementById("bookmark_rec");
            recBox.checked = true;
        }
        if(PRIVATE_DEFAULT_SERIES)
        {
            var privateBox = document.getElementById("bookmark_private");
            privateBox.checked = true;
        }

        if(NOTES_APPEND_TO_PREVIOUS)
        {
            if(notesBox)
            {
                notesBox.value = notesBox.value + "\n" + notesBoxText;
            }
        }
        else
        {
            if(notesBox)
            {
                notesBox.value = notesBoxText;
            }
        }

    }

    function RemoveCommas(wordcount)
    {
        if(wordcount.includes(','))
        {
            wordcount = wordcount.replace(',', '');
        }
        if(wordcount.includes(','))
        {
            wordcount = RemoveCommas(wordcount);
        }

        return wordcount;

    }

}

)();
// ==UserScript==
// @name         AO3: [Wrangling] Search Term Highlighting
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  highlights the search terms in the results
// @author       escctrl
// @version      6.1
// @match        *://*.archiveofourown.org/tags/search?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501993/AO3%3A%20%5BWrangling%5D%20Search%20Term%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/501993/AO3%3A%20%5BWrangling%5D%20Search%20Term%20Highlighting.meta.js
// ==/UserScript==
 
/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */
 
// CONFIGURATION
 
   // this impacts how the highlighting acts with special characters (when there aren't asterisk in the search term -- yes, AO3 is being extra)
   //    false = like AO3 searches by ignoring special characters
   //    true  = as you probably meant it, by searching for the literal special character
   const STRICT_HIGHLIGHT = true;
 
 
(function($) {
    'use strict';
	
	// stop executing if we're seeing a Retry Later or an Error page
	if ($('#new_tag_search').length === 0) return;
 
    const DEBUG = false;
 
    const HIGHLIGHT = lightOrDark(window.getComputedStyle(document.body).backgroundColor) == "dark" ? '#082f03' : '#FFFF99' ;
 
    // and some more CSS styling for the table
    document.getElementsByTagName('head')[0].innerHTML += `<style type="text/css">
        #highlightButton { font-size: 0.6em; margin-right: 0.5em; }
        #highlightButton.pressed { color: #900; border-top: 1px solid #999; border-left: 1px solid #999; box-shadow: inset 2px 2px 2px #bbb; }
        a.tag span.highlight.on { background-color: ${HIGHLIGHT}; }
        a.tag:hover span.highlight.on { background-color: inherit; }
        </style>`;
 
    // *** Highlight the search terms in the results
 
    // a button to toggle the highlighting on and off
    var button = document.createElement("button");
    button.innerHTML = "Highlight Search Terms";
    button.id = "highlightButton";
    button.addEventListener("click", HighlightTerms);
    $("#main > h3").prepend(button);
 
    // first we grab the search term from the input field (which sanitizes HTML characters for us)
    var search_name = document.getElementById('tag_search_name').value;
 
    // deal with quoted terms that may include whitespaces
    var quotedterms = search_name.match(/".*?"/gi); // find all quoted searches (before we start splitting the string)
    search_name = search_name.replace(/".*?"/gi, ""); // remove the matches from the original search terms
 
    search_name = search_name.split(" "); // now we can split the remaining search terms on spaces
    // and join the two arrays back together for further processing, but remove any null values (happen if either one of the original arrays is empty)
    search_name = [].concat(search_name, quotedterms).filter((val) => val !== null);
 
    // this isn't the magic bullet, but try sorting by length (from longest to shortest search term) to get around problems with highlighting matches within longer matches
    // hopefully it manages to avoid most situations where a longer match would not be recognized because a shorter match already added placeholders in the middle of the term
    // we're comparing lengths without quotes and asterisk, since they probably won't matter later
    search_name = search_name.sort((a,b) => b.replace(/["*]/gi, "").length - a.replace(/["*]/gi, "").length);
 
    // turn the user input into regular expressions
    var search_arr = search_name.map( Terms2Regex );
    var search_arr2 = [];
 
    // at this point, some items in the search_arr might be an array of even more search terms... need to flatten
    search_arr.forEach( function(e, i) {
        if (Array.isArray(e)) search_arr2 = search_arr2.concat(e);
        else search_arr2.push(e);
    });
 
    // running through the tag names, and highlighting the matched parts by adding a <span> with a class
    $('a.tag').each( function(i, link) {
        var tagname = link.text;
 
        if (DEBUG) console.log(tagname);
 
        search_arr2.forEach( function(term) {
            // we add only a placeholder, so we won't start matching against the HTML characters
            tagname = tagname.replace(new RegExp(term, "gi"), "\r$&\t");
        });
        // once done with finding term matches, we can turn the placeholders into actual HTML and display that
        link.innerHTML = tagname.replace(/\r/g, "<span class='highlight'>").replace(/\t/g, "</span>");
        if (DEBUG) console.log(link.innerHTML);
    });
 
    function HighlightTerms() {
        $('a.tag span.highlight').toggleClass("on");
        $(button).toggleClass("pressed");
    }
 
    function Terms2Regex(term) {
 
        // skip bad input and logical operators
        switch (term) {
            case "": case null:
            case "OR": case "NOT": case "AND":
            case "||": case "&&":
                return false;
        }
 
        // we clone our regex into a new variable, and keep the original search term unchanged for comparisons
        // get rid of asterisk at beginning and end, as well as any quotes
        var regex = term.replace(/(^\*)|(\*$)|(")/g, '');
        var regex_split = [];
 
        // special characters are essentially ignored, if no asterisk is present in the search term and as long as there's a word character
        // if user wants to follow AO3's search logic, we need to modify the regex accordingly
        if (term.indexOf('*') == -1 && regex.match(/\w/gi) !== null && !STRICT_HIGHLIGHT) {
 
            // at the borders of a word, the special character simply disappears
            regex = regex.replace(/(^\s*[^\w\s]+\s*)|(\s*[^\w\s]+\s*$)/g, '');
 
            // when surrounded by \w's (we already removed the other characters at beginning/end)...
            // with quotes, it acts like a non-word wildcard between them
            if (term.slice(0,1) == '"' && term.slice(-1) == '"') regex = regex.replace(/\s*[^\w\s]+\s*/g, "\[^\\w\]*");
            // without quotes, it splits the term in two
            else regex_split = regex.replace(/\s*[^\w\s]+\s*/g, ",").split(',');
        }
        // some characters have special meaning in regex, we need to add an escape sequence to highlight them
        // except asterisk! (at first) -- then replace any remaining asterisk in the middle with the regex equivalent
        else regex = regex.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
 
        // finish creating the regexes by adding the boundaries to (each part of) the term
        if (regex_split.length > 0) {
            regex_split.forEach( function(v, i) { regex_split[i] = addBoundaries(v, term); });
            regex = regex_split;
        }
        else regex = addBoundaries(regex, term);
 
        if (DEBUG) console.log(term + ' => ' + regex);
 
        // this will return an array of strings, in case the term had to be split. otherwise a single string
        return regex;
    }
 
    // add the regex Metacharacter for word boundaries, only if the first/last letter was a 'word' character
    function addBoundaries(rgx, term) {
        if (term.slice(0,1) != "*" && rgx.match(/^\w/gi) !== null) { rgx = "\\b" + rgx; }
        if (term.slice(-1) != "*" && rgx.match(/\w$/gi) !== null) { rgx = rgx + "\\b"; }
 
        return rgx;
    }
 
})(jQuery);
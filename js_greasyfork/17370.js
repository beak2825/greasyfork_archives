// ==UserScript==
// @name         Highlight anon replies
// @namespace    metafilter
// @version      0.1
// @description  make it so that mods comments show up with the little line on the left side
// @author       jacalata@gmail.com
// @grant        none
// @include      *://ask.metafilter.com/*
// @downloadURL https://update.greasyfork.org/scripts/17370/Highlight%20anon%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/17370/Highlight%20anon%20replies.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// requested in a comment: http://metatalk.metafilter.com/19656/Where-are-you-located-Where-are-you-located-Where-are-you-located#801909 

var comment_identifier = 'class="comments"';
var indicator_text = "From the OP";
var allowed_posters = ["cortex", "restless_nomad", "taz", "LobsterMitten", "goodnewsfortheinsane", "Eyebrows McGee", "pb", "vacapinta", "jessamyn"]; //http://faq.metafilter.com/#33 + jessamyn for historical threads

var comments = document.getElementsByClassName("comments");

var select_this_comment = function(cmt){
    if (cmt.innerText.toLowerCase().indexOf(indicator_text.toLowerCase()) < 0) { //console.log("not by OP");
        return false; }
    for (var i in allowed_posters){
        if (cmt.children[1].innerText.toLowerCase().indexOf(allowed_posters[i].toLowerCase()) >= 0) {
            console.log("Anon update posted by", allowed_posters[i]);
            return cmt;
        }
       // console.log(allowed_posters[i], "not found");
    }
    return false; //didn't find a mod name 
};

var responses = [];
for (var i =0; i<comments.length; i++) {
    
    var comment = comments[i];
   // console.log("working on ", comment);
    if (!comment.innerHTML) { continue; }
    if (comment.className != "comments") { 
        //console.log("bad element: ", comment); 
        continue; }
    else {
        //console.log("comment found", comment);
        if (select_this_comment(comment)){ 
            console.log("found response ", responses.length+1);
            responses[responses.length] = comment; 
        }
    }
}
console.log("found:", responses);
for (var j = 0; j < responses.length; j++){
    console.log(responses[j]);
    responses[j].className += " bestleft"
}

// ==UserScript==
// @name         Show Reply Times 
// @version      0.0.4.1
// @description  show reply times for reddit comments in a thread
// @author       anothershittyalt
// @include      /^https://(.*).reddit.com/r/counting/comments/(.*)
// @namespace https://greasyfork.org/users/32246
// @downloadURL https://update.greasyfork.org/scripts/17565/Show%20Reply%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/17565/Show%20Reply%20Times.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//add CSS from /r/reddit_timestamps/stylesheet
var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://a.thumbs.redditmedia.com/Hbef45nswkkeZVr-ODTUBUi9EyFiPAN4NgCV_6F7_j0.css');
document.getElementsByTagName('head')[0].appendChild(link);

//convert seconds to a h:m:s string
function time(t){
    var h = Math.floor(t/3600);
    var m = Math.floor((t%3600) / 60);
    var s = t%60;
    if(h > 0){h = h.toString() + "h ";} else{h = ""};
    if(m > 0){m = m.toString() + "m ";} else{m = ""};
    s = s.toString() + "s";
    return h+m+s;
}

//fetch reply times on load
window.addEventListener('load', function() {
    //grab all the comments in the page
    var comments = document.getElementsByClassName("sitetable")[1];
    comments = comments.getElementsByClassName("comment");

    //keep track of whether a comment is "marked" or not so we dont parse it twice
    var commentsMarked = []
    for(var i = 0; i < comments.length; i++){
        commentsMarked.push(false);
    }

    //HTMLCollections don't work with .indexOf() so we use this to find a certain element in them instead
    function search(list, item){
        for(var i = 0; i < comments.length; i++){
            if(list[i] == item){return i;}
        }
        return -1;
    }

    function crawl(comment, last){
        //mark the comment
        var searchIndex = search(comments, comment);
        commentsMarked[searchIndex] = true;

        //get all the children of the comment
        var c = comment.getElementsByClassName("comment");

        //for each child comment...
        for(var i = 0; i < c.length; i++){
            //check if the child comment hasn't been marked already
            searchIndex = search(comments, c[i]);
            if(commentsMarked[searchIndex] == false){
                //if it hasn't then grab the timestamp and get the difference between this and it's parent
                var time_element = c[i].getElementsByTagName("time")[0]
                var timestamp_b = time_element.getAttribute("datetime");
                timestamp_b = new Date(timestamp_b).getTime()/1000;
                var diff = timestamp_b - last;

                //then add that difference to the end of the timestamp (if it isn't there already)
                var title = time_element.getAttribute("title");
                if(title.indexOf(";") == -1){time_element.setAttribute("title", title + "; " + time(diff) + " reply");}
                if(diff <= 1){time_element.setAttribute("style", "font-weight: bold;");}
                commentsMarked[searchIndex] = true;
            }
            //do this recursively
            crawl(c[i], timestamp_b);
        }
    }

    //crawl() through every single unmarked comment
    for(var i = 0; i < comments.length; i++){
        if(commentsMarked[i] == false){
            var timestamp = comments[i].getElementsByTagName("time")[0].getAttribute("datetime");
            timestamp = new Date(timestamp).getTime()/1000;
            crawl(comments[i], timestamp);
            commentsMarked[i] = true
        }
    }

}, false);

//fetch reply times on newly added comments (TODO: something about this method feels like it would be gross/hacky/slow, but idk)
window.addEventListener("DOMNodeInserted", function(e) {
    //grab the node added
    var node = e.relatedNode;

    //check if the node is a live-timestamp that doesn't have a reply time added to it
    if(node.getAttribute("class") == "live-timestamp"){
        if(node.getAttribute("title").indexOf(";") == -1){
            //grab the comment attached to that and its timestamp
            //that parentNode chain though
            var comment = node.parentNode.parentNode.parentNode;
            var parent = comment.parentNode.parentNode.parentNode;

            //check if the elements we grabbed are actually both comments or not
            if(comment.getAttribute("data-type") == "comment" && parent.getAttribute("data-type") == "comment"){
                //grab the timestamp for the parent
                var timestamp = parent.getElementsByTagName("time")[0].getAttribute("datetime");
                timestamp = new Date(timestamp).getTime()/1000;

                //grab the timestamp for the new comment and get the difference between that and it's parent
                var timestamp_b = node.getAttribute("datetime");
                timestamp_b = new Date(timestamp_b).getTime()/1000;
                var diff = timestamp_b - timestamp;

                //then add that difference to the end of the child's timestamp (if it isn't there already somehow)
                var title = node.getAttribute("title");
                if(title.indexOf(";") == -1){node.setAttribute("title", title + "; " + time(diff) + " reply");}
                if(diff <= 1){node.setAttribute("style", "font-weight: bold;");}
            }
        }
    }
}, false);
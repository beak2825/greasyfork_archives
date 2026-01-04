// ==UserScript==
// @name        4chan gets highlighter
// @namespace   https://userscripts.org/users/532546
// @email       idonthavea@mail.com
// @description Highlights dubs, trips and quads
// @include     https://boards.4chan.org/*
// @include     http://boards.4chan.org/*
// @author      anom
// @version     2.75b
// @downloadURL https://update.greasyfork.org/scripts/31705/4chan%20gets%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/31705/4chan%20gets%20highlighter.meta.js
// ==/UserScript==

// NOTE:
// I edited this, now it is mine.

initialize();
addCSS();               // add the css
highlightDubs();        // highlight dubs

// if this page is a thread, then we need to periodically check for updates brought in by the auto-update
//if(document.URL.indexOf("res") != -1)
//{
    setInterval(function(){checkIfUpdated();}, 5000);   // check if the thread is updated every 5 seconds
//}
function initialize()
{
    window.lastNo = 0;         // used to make sure we don't check posts twice
    window.posts = getPosts();

    ink = {                                 //define get COLORS
        dubs : "orange",
        trips : "white",
        quads : "yellow",
    };
}
function highlightDubs()
{
    // grabs the elements that contain "No. <postno>"
    var postNum = document.getElementsByClassName("postNum");
    // iterate through all post numbers and check for dubs
    for(var i = window.lastNo; i < postNum.length; i++)
    {
        // get the post number
        var no = postNum[i].children[1].innerHTML;
        var ch = no.charAt(no.length - 1);
        // check for dubs, but only if this isn't already highlighted
        if(ch == no.charAt(no.length - 2))
        {
            // highlight it
            if(ch == no.charAt(no.length - 3))
            {
                if(ch == no.charAt(no.length - 4))
                {
                    postNum[i].children[1].className += " quads";
                }
                else
                {
                    postNum[i].children[1].className += " trips";
                }
            }
            else
            {
                postNum[i].children[1].className += " dubs";
            }
        }
    }
    window.lastNo = postNum.length;  //last number we checked
}

function addCSS()
{
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".dubs { background-color: " + ink.dubs + "; padding: 0 1px; }" + "\n.trips { background-color: " + ink.trips + "; padding: 0 1px; }" + "\n.quads { background-color: " + ink.quads + "; padding: 0 1px; }";
    document.head.appendChild(css);
}

function getPosts()
{
    return document.getElementsByClassName("replyContainer").length;
}

// supposed to do stuff after a page is updated
function checkIfUpdated()
{
    //console.log("checked!");
    // if there are new posts, thread has been updated!
    if(window.posts < getPosts())
    {
        window.posts = getPosts();
        updateCare();       // update stuff!
    }
}

// things to do on thread update
function updateCare()
{
    highlightDubs();    // highlight new post dubs
}
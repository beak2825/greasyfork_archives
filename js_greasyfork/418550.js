// ==UserScript==
// @name         Wykop Del Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete old comments on wykop.pl
// @author       You
// @match        https://www.wykop.pl/ludzie/komentowane-wpisy/Voyager-1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418550/Wykop%20Del%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/418550/Wykop%20Del%20Comments.meta.js
// ==/UserScript==

var DEL_AFTER_DAYS = 0;
var DEL_IF_LESS_VOTES = 50;
var PAGES = 10;


var timeNow = new Date().getTime();
var dateNow = new Date(timeNow);
var needWait = false;

function unwindComments()
{
    var moreComments = document.getElementsByClassName("more");
    for(var i = 0; i < moreComments.length; i++)
    {
        var a = moreComments[i].getElementsByClassName("affect ajax")[0];
        if(a)
        {
            needWait = true;
            var ajaxurl = a.getAttribute("data-ajaxurl");
            a.click();
        }
    }
}

function deleteComments()
{
    var ownComments = document.getElementsByClassName("ownComment");

    for(var i = 0; i < ownComments.length; i++)
    {
        console.log(i);
        var comment = ownComments[i];
        var time = comment.getElementsByTagName('time')[0];
        if(time)
        {
            var datetime = time.getAttribute("datetime");
            var date = Date.parse(datetime);

            if((dateNow - date) / (24 * 60 * 60 * 1000) >= DEL_AFTER_DAYS)
            {
                var vc = comment.getElementsByClassName("vC")[0];
                if(vc)
                {
                    var votes = parseInt(vc.getAttribute("data-vc"));
                    if(votes < DEL_IF_LESS_VOTES)
                    {
                        var del = comment.getElementsByClassName("affect hide confirm ajax")[0];
                        if(del)
                        {
                            var url = del.getAttribute("data-ajaxurl");
                            if(url.search("commentdelete") != -1)
                            {
                                console.log(comment.getElementsByClassName("text")[0].innerHTML);
                                $.get(url, function(response){console.log("Dane otrzymane: ", response);});
                            }
                        }
                    }
                }
            }
        }
    }
}

function goToNextPage()
{
    var newURL = "";
    if(window.location.href.search("strona/") == -1)
    {
        newURL = window.location.href + "strona/2/";
        window.location.href = newURL;
    }
    else
    {
        newURL = window.location.href.substring(0, window.location.href.length - 1);
        var numPos = newURL.search("strona/")+ "strona/".length;
        var num = parseInt(newURL.substring(numPos)) + 1;
        newURL = newURL.substring(0, numPos) + num;

        if(num <= PAGES)
        {
            window.location.href = newURL;
        }
    }
}

unwindComments();
if(needWait)
{
    setTimeout(deleteComments, 10000);
    setTimeout(goToNextPage, 15000)
    //alert("temp");
}
else
{
    deleteComments();
    goToNextPage();
}
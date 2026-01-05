// ==UserScript==
// @name           W której sekundzie?
// @description    Podgląd filmu od danej sekundy.
// @author         mBartek89
// @version        1.2.1
// @include        http://www.wykop.pl/link/*
// @include        http://www.wykop.pl/wpis/*
// @include        https://www.wykop.pl/link/*
// @include        https://www.wykop.pl/wpis/*
// @run-at         document-end
// @namespace      https://greasyfork.org/users/30602
// @downloadURL https://update.greasyfork.org/scripts/17128/W%20kt%C3%B3rej%20sekundzie.user.js
// @updateURL https://update.greasyfork.org/scripts/17128/W%20kt%C3%B3rej%20sekundzie.meta.js
// ==/UserScript==

function GetComments()
{
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++)
        if (allElements[i].getAttribute("data-type") == "comment" || allElements[i].getAttribute("data-type") == "entrycomment")
            matchingElements.push(allElements[i]);
    return matchingElements;
}

var youtubeID;
var youtube;
youtube = document.getElementsByClassName("youtube-player")[0];
if(youtube)
    youtubeID = youtube.getAttribute("id").substring(3);
else
{
    youtube = document.getElementsByClassName("media-content")[0];
    var regex = /(v=)(.*?)(")/;
    var result = regex.exec(youtube.innerHTML);
    youtubeID = result[2];
    console.log(youtubeID);
}
if(youtubeID)
{
    var comments = GetComments();
    for (var i = 0; i < comments.length; i++)
    {
        if(comments[i].getElementsByClassName("text").length > 0)
        {
            var comment = comments[i].getElementsByClassName("text")[0];
            if(comment.childElementCount > 0)
            {
                var text = comment.children[0].innerHTML;
                if(text !== "")
                {
                    var regex = /([0-9]+:[0-9]+:[0-9]+|[0-9]+:[0-9]+)/g;
                    var result;
                    var newText = text;
                    while ((result = regex.exec(text)) !== null)
                    {
                        var t = result[0];
                        var time = t.split(":");
                        var h = (time.length == 3) ? time[0] : 0;
                        var m = (time.length == 3) ? time[1] : time[0];
                        var s = (time.length == 3) ? time[2] : time[1];
                        newText  = newText.replace(t, "<a href=\"https://youtu.be/" + youtubeID + "?t=" + h + "h" + m + "m" + s + "s\">" + t + "</a>");
                    }
                    comment.children[0].innerHTML = newText;
                }
            }
        }
    }
}
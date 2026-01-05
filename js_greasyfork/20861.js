// ==UserScript==
// @name          Facebook Double
// @author        Niqueish (edited by noisy cat)
// @description   Adds doubles to Facebook
// @homepage      https://www.facebook.com/Niqueish
// @version       1.0n
// @include       *://*.facebook.com/*
// @grant         none
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @require https://greasyfork.org/scripts/20860-arrive-upload/code/arrive-upload.js?version=133295
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/20861/Facebook%20Double.user.js
// @updateURL https://update.greasyfork.org/scripts/20861/Facebook%20Double.meta.js
// ==/UserScript==


function doubleHighlight(str)
{
    var Fletter = str.substr(0, 1);
    return (str.replace(new RegExp(Fletter, 'g'), "").length === 0);
}

//HEX
var highlightColour = "#ffe";

function fillPost(element)
{
    console.log(element);
    if (element.hasClass("postid"))
        return;

    element.addClass("postid");

    var post = element.find('a._5pcq').attr("href");
    var post_id = post.match(/(?:permalink|posts|videos|(?:photos\/.*\/))\/([0-9]*)/);
    if (!post_id)
        return;
    post_id = post_id[1];
    var container = element.find('a._5pcq').first().parent();
    console.log(container);
    container.append('<span> · </span><span class="post_id">No. '+post_id+'</span>');
}

function fillComment(element)
{
    if (element.hasClass("postid"))
        return;

    element.addClass("postid");

    var post = element.find('a.uiLinkSubtle').attr("href");
    var post_id = post.match(/comment_id=([0-9]*)&comment_tracking/)[1];

    element.find('a.uiLinkSubtle').parent().append('<span> · </span><span class="post_id">No. '+post_id+'</span>');
}

$("body").arrive(".userContentWrapper:not(.postid)", {fireOnAttributesModification: true, existing: true}, function() { fillPost($(this)); });
$("body").arrive(".UFICommentContentBlock:not(.postid)", {fireOnAttributesModification: true, existing: true}, function() { fillComment($(this)); });

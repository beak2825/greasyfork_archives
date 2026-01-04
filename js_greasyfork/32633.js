// ==UserScript==
// @name        reddit: always show spoilers
// @namespace   mailto:morten.with@gmail.com
// @locale      en
// @include     *reddit.com*
// @version     0.2
// @run-at      document-start
// @grant       none
// @description clicks hidden posts to reveal spoilers automatically
// @downloadURL https://update.greasyfork.org/scripts/32633/reddit%3A%20always%20show%20spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/32633/reddit%3A%20always%20show%20spoilers.meta.js
// ==/UserScript==

(function()
{
'use strict';

document.addEventListener("DOMContentLoaded", function()
{
var clickEventListener = function(e)
{
    e = e || window.event;
    var expandoButton = e.target || e.srcElement;

    if(expandoButton.nodeType === 3)
    {
        expandoButton = expandoButton.parentNode;
    }

    var thing = expandoButton.parentElement.parentElement.parentElement;

    handleExpando(thing);

    expandoButton.removeEventListener("click", clickEventListener);
};

var spoilerPosts = document.getElementsByClassName("spoiler");

if(document.getElementsByClassName("commentarea").length === 1 && spoilerPosts.length > 0)
{
    handleExpando(spoilerPosts[0]);
}
else
{
    for(var i = 0; i < spoilerPosts.length; i++)
    {
        var expandoButton = spoilerPosts[i].getElementsByClassName("expando-button")[0];

        if(expandoButton !== undefined)
        {
            expandoButton.addEventListener("click", clickEventListener);
        }
    }
}

function handleExpando(thing)
{
    if(thing.getElementsByClassName("expando-gate--warning").length === 0)
    {
        setTimeout(function() { handleExpando(thing); }, 100);
        return;
    }

    thing.getElementsByClassName("expando-gate--warning")[0].click();
}
});
})();

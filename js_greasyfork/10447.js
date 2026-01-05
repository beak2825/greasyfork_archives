// ==UserScript==
// @name         Mturk autoaccept hits on forums
// @author       ikarma
// @namespace    ikarma
// @version      0.2
// @description  Puts a button that will accept all Hits on forum page
// @require      http://code.jquery.com/jquery-latest.min.js
// @include      http://www.mturkgrind.com/*
// @include      http://mturkgrind.com/*
// @include      http://www.mturkforum.com/*
// @include      http://mturkforum.com/*
// @include      http://www.turkernation.com/*
// @include      http://turkernation.com/*
// @copyright    2015
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/10447/Mturk%20autoaccept%20hits%20on%20forums.user.js
// @updateURL https://update.greasyfork.org/scripts/10447/Mturk%20autoaccept%20hits%20on%20forums.meta.js
// ==/UserScript==

var input=document.createElement("input");
input.type="button";
input.value="grab all hits";
input.onclick = grabAll;
input.setAttribute("style", "font-size:18px;position:fixed;top:200px;right:40px;");
document.body.appendChild(input); 
 
function grabAll()
{
$('a[href*="/mturk/preview?"]').each(function(){
    var panda = ($(this).attr('href').replace("preview?", "previewandaccept?"));
    window.open(panda);
});
}

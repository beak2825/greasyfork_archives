// ==UserScript==
// @name          L33T Users Max Character Limit
// @namespace     Nasyr
// @author        Nasyr
// @description   Make's sure your post is eligible to be posted.
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include       *hackforums.net/*
// @version 	  1.0.0
// @downloadURL https://update.greasyfork.org/scripts/20448/L33T%20Users%20Max%20Character%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/20448/L33T%20Users%20Max%20Character%20Limit.meta.js
// ==/UserScript==

var url = window.location.href;
if (url.search("showthread.php") > 0) {
    regex = /here.*?>/;
    revised = "here.<br /> <div id='letscount'>0<br /><span style='color:red'>Not enough to post.</span></div>";
    document.getElementById('quickreply_e').innerHTML= document.getElementById('quickreply_e').innerHTML.replace(regex,revised);
}else if (url.search("newreply") > 0) {
$('strong:contains("Post Options:")').append("<div id='letscount'>0<br /><span style='color:red'>Not enough to post.</span></div>");
}

addButtonListener();
function addButtonListener(){
    var url = window.location.href;
    var texts = document.getElementById("message_new");
    if (url.search("showthread.php") > 0) {
        texts = document.getElementById("message");
    }
    texts.addEventListener('keyup',doCountNow,true);
    texts.addEventListener('keydown',doCountNow,true);
}
doCountNow();
function doCountNow(){
    var url = window.location.href;
    var field = 0;
    
    var text = document.getElementById("message_new");
    if (url.search("showthread.php") > 0) {
        text = document.getElementById("message");
    }
    
    text = text.value;
    text = text.replace(/\[\/?quote.*[^\]]*\]/g, '');
    text = text.replace(/\[img\].*\[\/img\]/g, '');
    text = text.replace(/:([^:][^:]*:)?/g, '');
    text = text.replace(/ /g, '');
    
    field = text.length;
    
    var minlimit = 25;
    var maxlimit = 12000;
    if (field < minlimit) {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:red">Not enough to post.</span>';
    }
    else if (field > maxlimit) {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:red">Too much to post.</span>';
    }
    else {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:green">Okay to post.</span>';
    }
    
}
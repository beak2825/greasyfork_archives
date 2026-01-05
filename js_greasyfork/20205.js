// ==UserScript==
// @name          Cryptic's Lucky Award Counter
// @namespace     Cryptic
// @description   Make's sure your post is eligible for the Lucky Award
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include       *hackforums.net/*
// @version 	  2.3.1
// @downloadURL https://update.greasyfork.org/scripts/20205/Cryptic%27s%20Lucky%20Award%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/20205/Cryptic%27s%20Lucky%20Award%20Counter.meta.js
// ==/UserScript==

var url = window.location.href;
if (url.search("showthread.php") > 0) {
    regex = /here.*?>/;
    revised = "here.<br /> <div id='letscount'>0<br /><span style='color:red'>Too Low!</span></div>";
    document.getElementById('quickreply_e').innerHTML= document.getElementById('quickreply_e').innerHTML.replace(regex,revised);
}else if (url.search("newreply") > 0) {
$('strong:contains("Post Options:")').append("<div id='letscount'>0<br /><span style='color:red'>Too Low!</span></div>");
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
    
    var minlimit = 100;
    var maxlimit = 18000;
    if (field < minlimit) {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:red">Too Low!</span>';
    }
    else if (field > maxlimit) {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:red">Too High!</span>';
    }
    else {
        document.getElementById('letscount').innerHTML = field+'<br /><span style="color:green">Okay To Post!</span>';
    }
    
}
// ==UserScript==
// @name     Twitter - Search own tweets
// @version  1.3
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://twitter.com/*
// @author   happmaoo
// @description Twitter Search own tweets search specific accounts search current account 推特搜索当前用户推文
// @namespace https://greasyfork.org/users/28220
// @downloadURL https://update.greasyfork.org/scripts/477905/Twitter%20-%20Search%20own%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/477905/Twitter%20-%20Search%20own%20tweets.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Constantly attempt to remove the trends panel, as navigating the site will regenerate it.

    var have = 0;
    setInterval(function ()
    {
        //alert($('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').length);
if ($('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').length) {
  //  block of code to be executed if the condition is true
    if(have == 0){
        //alert("have");
        have = 1;

        //$('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').after("<input type='text' id='a1'></input><input type='button' id='a2' value='search' onclick='myFunction()'></input>");

var intext = document.createElement("input");
intext.type = "text";
intext.value="";
intext.onkeydown = () => {
  if(event.keyCode==13) {
    const url = "https://twitter.com/search?q=from%3A"+$('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').html() + " " + intext.value + "&src=typed_query&f=live";
    window.open(url, "_blank");
    return false;

  }
};
var btn = document.createElement("button");
btn.innerHTML = "Search";
btn.onclick = () => {
    //alert(intext.value);
    const url = "https://twitter.com/search?q=from%3A"+$('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').html() + " " + intext.value + "&src=typed_query&f=live";
    window.open(url, "_blank");
    return false;
};

$('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').after(btn);
$('div[data-testid="UserName"] > :nth-child(1) > :nth-child(1) > :nth-child(2) span').after(intext);

    }
} else {
    have = 0;
  //alert("no");
}
    }, 3000);
})();




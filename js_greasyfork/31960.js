// ==UserScript==
// @name        hide hot network questions
// @namespace   hasanyavuz.ozderya.net
// @description adds a toggle button to hide/show hot network questions on stackexchange sites
// @include     *.stackexchange.com/*
// @include     *stackoverflow.com/*
// @include     *mathoverflow.net/*
// @include     *serverfault.com/*
// @include     *stackapps.com/*
// @include     *superuser.com/*
// @include     *askubuntu.com/*
// @version     2
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/31960/hide%20hot%20network%20questions.user.js
// @updateURL https://update.greasyfork.org/scripts/31960/hide%20hot%20network%20questions.meta.js
// ==/UserScript==

// hide initially
qlist = $("#hot-network-questions :gt(1)").css("visibility", "hidden");;

// setup a button to hide/show
hsbtn = $("<a>SHOW</a>").css({"font-size":"50%", 
                                   "border-width" : "1px",
                                   "border-style" : "solid",
                                   "padding" : "1px",
                                   "display" : "inline",
                                   "margin-left" : "0.5em"});

hsbtn.insertAfter($("#hot-network-questions h4 a"));

hsbtn.click(function(){
  if (qlist.css("visibility") == "hidden")
    {
      qlist.css("visibility", "");
      hsbtn.html("HIDE");
    }
  else
    {
      qlist.css("visibility", "hidden");
      hsbtn.html("SHOW");
    }
});
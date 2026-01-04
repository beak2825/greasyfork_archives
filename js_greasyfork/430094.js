
// ==UserScript==
// @name         ShhweetSkunk's bugfixes..
// @namespace    ShhweetSkunk

// @description  TESTING...TGx
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://torrentgalaxy.to/*

// @icon         https://torrentgalaxy.to/common/images/smilies/new_greenalien.png

// @version      1.0

// @history      1.0  "spinning wheel" workaround @ forum threads
// @history      1.0  + slightly Rounded corners  +  Drop shadow

// @downloadURL https://update.greasyfork.org/scripts/430094/ShhweetSkunk%27s%20bugfixes.user.js
// @updateURL https://update.greasyfork.org/scripts/430094/ShhweetSkunk%27s%20bugfixes.meta.js
// ==/UserScript==

//alert('go');

(function() {
    'use strict';

    // Your code here...

//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/forums.php/)) { //here only atm

    var testHTML = "dunno";

    //whole row (including avatar)
  //$("div.f-post").each(function(index, posttttt){

    //comment ONLY
    $("td.comment").each(function(index, posttttt){

                            testHTML = $(posttttt).html();

    //<img class="img-responsive dim lazy txlight entered exited" data-src="https://mtltimes.ca/wp-content/uploads/2020/11/Natural-beauty-min.jpg"
    //       alt="Image error" style="display: inline-block; border-radius: 25px;" src="/common/images/loading-big.gif" border="0">

    testHTML=testHTML.replace(new RegExp("data-", "g"),"                                     "); //auto-show images

    testHTML=testHTML.replace(new RegExp("src=\"/common/images/loading-big.gif\"", "g"),"    "); //spinning wheel

    testHTML=testHTML.replace(new RegExp("alt=\"Image error\"", "g")," alt='Image missing..' "); //broken URLs

  //good, but diff code if using bbcode > [IMG width=900]
  //testHTML=testHTML.replace(new RegExp("style=\"display:inline-block;", "g"),"style=\"border-radius:5px; box-shadow: 0 0 7px #777; display:inline-block;");//auto-expand images   show pics by default
  //https://torrentgalaxy.to/forum/perma/63173/Random-Animal-Image-Thread

    testHTML=testHTML.replace(new RegExp("style=\"display", "g"),"style=\"border-radius:5px; box-shadow: 0 0 7px #777; display");//visual confirm

                                       $(posttttt).html(testHTML);

});

};//if (window.location.href.match(/forums.php/)) {
//###########################################################################################//
//###########################################################################################//

})();

//end script

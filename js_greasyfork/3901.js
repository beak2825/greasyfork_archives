// ==UserScript==
// @name        Patreon Creator Activity Only
// @namespace   https://github.com/ToostInc/userscripts
// @description Hides non-creator comments on a projects Activity page
// @include     http://www.patreon.com/*?ty=a
// @version     1.0
// @date           18-08-2014
// @author      Joost Bremmer < toost dot b at gmail dot com >
// @copyright   2014, Joost Bremmer
// @licence     MIT
// @require     http://code.jquery.com/jquery-latest.min.js
// @updateurl   https://github.com/ToostInc/userscripts/raw/master/patreon-creator-activity-only/Patreon_Creator_Activity_Only.meta.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3901/Patreon%20Creator%20Activity%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/3901/Patreon%20Creator%20Activity%20Only.meta.js
// ==/UserScript==


// The MIT License
//
// Copyright (c) 2014 Joost Bremmer
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

$(document).ready (function() {

  //inserting checkbox
  var buttan = "<div id='ipressbuttan' class='double box' width='300px' style='background:#ffffff;'><input type='checkbox' id='buttan' checked='checked'>Hide non-creator posts</input></div>";
  $("div#inline-post").after(buttan);

  //adding id to creatorposts and marking them clearly
  var creatorurl = location.href.replace(/\?.*/g, "");
  $("div.box .boxExtra .infoDiv .info a").each(function(){

    if ( $(this).attr("href") == creatorurl ) {
      $(this).append("&nbsp<img src='http://www.patreon.com/images/patreon_tab.png' width='16' height='16' />").attr("id", "creator");
    }
  })





  $("#buttan").change(function() {
    if ($(this).prop("checked") ) {
      //console.log("Hide Comments Checked.");
      hideComments();
    }
    else {
      //Show Comments
      console.log("Hide Comments Unchecked.")
      showComments();
    }
  });


});

function hideComments() {

  //for each comment, check if it's a creator's post (or in-line comment box), if not, hide it.
  $("div.box .boxExtra .infoDiv .info a").each( function() {

    //console.log($(this).attr("id"));


    if ( $(this).attr("id") != "creator" )  {
      //console.log("This post will be hidden");
      $(this).parents("div.box").hide(400);
    }


  })

  console.log("Comments hidden.");
}

function showComments() {
  $("div.box").show(400);
  console.log("Other Comments shown.")

}

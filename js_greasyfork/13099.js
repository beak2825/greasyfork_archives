// ==UserScript==
// @name        What.CD list all torrent links
// @namespace   https://greasyfork.org/en/users/14892
// @description Adds button that shows textarea with all torrent group links on current page
// @include     https://what.cd/torrents.php*
// @include     https://what.cd/artist.php*
// @include     https://what.cd/collages.php*
// @include     https://what.cd/bookmarks.php*
// @version     1.02
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13099/WhatCD%20list%20all%20torrent%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/13099/WhatCD%20list%20all%20torrent%20links.meta.js
// ==/UserScript==
var buttonwhere = {"/torrents":[".submit.ft_submit",".group_info .tooltip"],
                   "/artist":[".header",".group_info .tooltip:not(.small_upvote,.small_upvoted,.small_downvote,.small_downvoted,.small_clearvote)"],
                   "/collages":[".header",'.group .tooltip:not(.show_torrents_link,.cats_music,.small_upvote,.small_upvoted,.small_downvote,.small_downvoted,.small_clearvote)'],
                  "/bookmarks":[".header",'.group .tooltip:not(.show_torrents_link,.cats_music,.small_upvote,.small_upvoted,.small_downvote,.small_downvoted,.small_clearvote,.time)']}
var where = window.location.pathname.split('.')[0];
function showLinks(){
  var list = "";
  $.each( $(buttonwhere[where][1]), function(key,val){
    list+="https://what.cd/" + $(this).attr("href") + "\n";
  })
  return list;
}
if($(buttonwhere[where][0]).length){
  $($(buttonwhere[where][0]).children()[0]).after('<input name="copylinks" style="float:left; margin-left:5px" value="Show Links" id="showlinks" type="button">');
  $('#showlinks').click(function(){
    if($(this).val()=="Show Links"){
      $(this).val('Hide Links');
      !$("#textlinks").length ? $(buttonwhere[where][0]).after('<textarea id="textlinks" style="width:250px;height:250px">' + showLinks() + '</textarea>') : $('#textlinks').show();
    }
    else{
      $(this).val('Show Links');
      $('#textlinks').hide();
    }
  })
}
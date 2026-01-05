// ==UserScript==
// @name        Faceraper Mini
// @namespace   Alice3173
// @include     *facepunch.com*
// @version     1.0.3
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @description Readds the ticker link and adds some useful links to each post
// @downloadURL https://update.greasyfork.org/scripts/13435/Faceraper%20Mini.user.js
// @updateURL https://update.greasyfork.org/scripts/13435/Faceraper%20Mini.meta.js
// ==/UserScript==

var ex_style = '<style>.ex-links { width: 80px; border: 1px solid black; background-color: lightgrey; padding: 3px; margin: 8px auto; } .ex-links a { max-width: 132px; white-space: pre-line; margin: 2px; }</style>';
var ex_url = window.location.href;
var ex_forum_id = 0;
var ex_forum_name = "none";
var ex_thread_id = 0;
var ex_thread_name = "none";
var ex_user_id = 0;
var ex_user_name = "none";
if (ex_url.match(/forumdisplay\.php/) != null) {
  ex_forum_id = ex_url.match(/f=\d+/);
  ex_forum_id = ex_forum_id[0].match(/\d+/);
  ex_forum_name = $('#breadcrumb #lastelement span').html();
} else if (ex_url.match(/showthread\.php/) != null) {
  ex_forum_id = $('#breadcrumb span:nth-last-of-type(1) a').attr('href').match(/f=\d+/);
  ex_forum_id = ex_forum_id[0].match(/\d+/);
  ex_forum_name = $('#breadcrumb span:nth-last-of-type(1) a').html();
}
if (ex_url.match(/showthread\.php/) != null) {
  ex_thread_id = ex_url.match(/t=\d+/);
  ex_thread_id = ex_thread_id[0].match(/\d+/);
  ex_thread_name = $('#breadcrumb #lastelement span').html().trim();
}
var ex_posts = $('#posts li').size() || 0;
for (i = 0; i < ex_posts; i++) {
  ex_user_id = $("#posts li:eq(" + (i) + ") .userinfo .username").attr('href').match(/\d+/);
  ex_user_name = $("#posts li:eq(" + (i) + ") .userinfo .username").html();
  if (ex_user_name.match(/<font color=".+">/) != null) {
    //console.log("Post " + i + "/" + ex_posts + "\n" + ex_user_id);
    //console.log(ex_user_name);
    ex_user_name = ex_user_name.replace(/<font color=".+">(.+)<\/font>/, "$1");
    //console.log(ex_user_name);
    ex_user_name = ex_user_name.replace(/<strong>(.+)<\/strong>/, "$1");
    //console.log(ex_user_name);
  } else {
    //console.log("Post " + i + "/" + ex_posts + "\n" + ex_user_id);
    ex_user_name = ex_user_name.replace(/<span.+>(.+)<\/span>/, "$1");
    //console.log(ex_user_name);
  }
  var ex_pm = '<a href="https://facepunch.com/private.php?do=newpm&u=' + ex_user_id + '"><img src="https://facepunch.com/fp/navbar/pm.png" title="PM ' + ex_user_name + '"></a>';
  var ex_event_log = '<a href="https://facepunch.com/fp_events.php?user=' + ex_user_id + '"><img src="https://facepunch.com/fp/navbar/events.png" title="' + ex_user_name + '\'s Event Log"></a>';
  var ex_find_posts = '<a href="https://facepunch.com/search.php?do=finduser&userid=' + ex_user_id + '&contenttype=vBForum_Post&showposts=1"><img src="https://facepunch.com/fp/navbar/search.png" title="Find Posts"></a>';
  var ex_find_threads = '<a href="https://facepunch.com/search.php?do=finduser&userid=' + ex_user_id + '&contenttype=vBForum_Thread"><img src="https://facepunch.com/fp/events/rename.png" title="Find Threads"></a>';
  var ex_find_images = '<a href="https://facepunch.com/fp_images.php?u=' + ex_user_id + '"><img src="https://facepunch.com/fp/hasimages.png" title="Find Images" height="16px" width="16px"></a>';
  var ex_find_posts_forum = '<a href="https://facepunch.com/search.php?do=finduser&userid=' + ex_user_id + '&contenttype=vBForum_Post&showposts=1&forumchoice%5B%5D=' + ex_forum_id +'"><img src="https://facepunch.com/fp/events/mov.png" title="Find Posts in ' + ex_forum_name + '"></a>';
  var ex_find_threads_forum = '<a href="https://facepunch.com/search.php?do=finduser&userid=' + ex_user_id + '&contenttype=vBForum_Post&forumchoice%5B%5D=' + ex_forum_id + '&starteronly=1"><img src="https://facepunch.com/fp/events/ddt.png" title="Find Threads in ' + ex_forum_name + '"></a>';
  var ex_find_posts_thread = '<a href="https://facepunch.com/search.php?do=finduser&userid=' + ex_user_id + '&searchthreadid=' + ex_thread_id + '&contenttype=vBForum_Post&showposts=1"><img src="https://facepunch.com/fp/events/title.png" title="Find Posts in ' + ex_thread_name + '"></a>';
  $("#posts li:eq(" + (i) + ") #userstats").append('<div class="ex-links">' + ex_pm + ex_event_log + ex_find_posts + ex_find_threads + ex_find_images + ex_find_posts_forum + ex_find_threads_forum + ex_find_posts_thread + '</div>');
}

$('head').append(ex_style);
$('#navbarlinks').prepend('<div class="navbarlink"><a href="http://facepunch.com/fp_ticker.php"><img src="/fp/navbar/referers.png">Ticker</a></div>');
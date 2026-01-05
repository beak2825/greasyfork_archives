// ==UserScript==
// @name        Nuevos posts Forocoches
// @namespace   http://github.com/brincowale
// @description Comprueba nuevos posts cada 120 segundos, reemplazo de Shurscript.
// @include     https://www.forocoches.com/foro/showthread.php?*
// @include     http://www.forocoches.com/foro/showthread.php?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17875/Nuevos%20posts%20Forocoches.user.js
// @updateURL https://update.greasyfork.org/scripts/17875/Nuevos%20posts%20Forocoches.meta.js
// ==/UserScript==

if (window.top != window.self)  //-- Don't run on frames or iframes
    return;

var page = 1;
var base_url = null;
var thread = null;
var posts_number_old = 0;
var button_new_posts = null;
var posts_number_now = 0;

/**
Script starts, obtains vars (page, tread and base_url)
Get the number of posts at this moment (posts_number_old)
*/
$(document).ready(function() {
    base_url = document.URL.split("?")[0];
    page = parseInt($('div.pagenav td.alt2 > span.mfont > strong').eq(0).text());
    thread = $('a[href^="subscription.php?do=addsubscription&t="]').attr("href").split("&t=")[1];
    // count number of posts in the current page
    posts_number_old = parseInt($('table[id^="post"]', $(document)).length);
    // execute the script only if you are in the last page
    if (!$(".pagenav a[href$='&page=" + (page + 1) + "']").length){
      setTimeout(function() {search_new_posts(document)}, 60000);
    }
});

/**
Search for new posts every 120 seconds
*/
function search_new_posts(document){
  $.get(document.URL, function(data) {
      // number of posts on update the page
      posts_number_now = parseInt($('table[id^="post"]', $(data)).length);
      // check if exists new posts (more posts when refresh than before)
      if ((posts_number_now - posts_number_old) > 0){
        var new_posts_number = posts_number_now - posts_number_old;
        setTimeout(function() {search_new_posts(document)}, 120000);
        alert_user(document, new_posts_number, data, false);
      }
      // check if exists new pages (only checked when all posts are showed in actual page)
      else if ($(".pagenav a[href$='&page=" + (page + 1) + "']", $(data)).length){
        alert_user(document, new_posts_number, data, true);
      }
      // continue searching for new posts when no news pages found
      else {
        setTimeout(function() {search_new_posts(document)}, 120000);
      }
  });
}

function alert_user(document, new_posts_number, data, new_page){
  // insert in the title an asterisk to notice the user about new posts
  if (document.title.charAt(0) != "*"){
    document.title = "* " + document.title;
  }
  var text_button_new_posts = null;
  // create a green bar if not exist
  if(!button_new_posts) {
      button_new_posts = $("<div></div>").attr("style", "cursor:pointer;color:#fff;font-weight:bold;font-size:18px;background-color:#2b4;margin:16px 0;padding:8px;text-align:center");
      $(document).find('div#posts').append(button_new_posts);
      // when a new page exists and no more posts in current page
      // the green bar will redirect user to the new page on click it
      if (new_page){
        button_new_posts.click(function() {
            window.location.href = base_url + "?t=" + thread + "&page=" + (page + 1);
        });
      }
      // when new posts, click this bar will show new posts and bar will be removed
      else{
        button_new_posts.click(show_new_posts);
      }
  }
  // message when new pages exists
  if (new_page){
    text_button_new_posts = "Hay una nueva página";
  }
  // message when new posts exists
  else{
    text_button_new_posts = "Hay " + new_posts_number + (new_posts_number == 1 ? " post nuevo" : " posts nuevos");
  }
  // insert the text into the green bar
  button_new_posts.text(text_button_new_posts);
  // append all new posts in the current page and hide them
  for (var i=0; i<posts_number_now; i++) {
    // only append new posts
    if (i >= $(document).find('table[id^="post"]').length){
      $(document).find("div#posts").append($(data).find('div[id^="edit"]').eq(i));
      $(document).find('table[id^="post"]').eq(i).addClass("postInvisible");
      $(".postInvisible").hide();
    }
  }
}


/**
Delete the green bar and show the new hidden posts
*/
function show_new_posts(){
  $(".postInvisible").show();
  $(document).find('table[id^="post"]').removeClass("postInvisible");
  button_new_posts.remove();
  button_new_posts = null;
  posts_number_old = posts_number_now;
  if(document.title.charAt(0) == "*")
      document.title = document.title.substr(2);
}

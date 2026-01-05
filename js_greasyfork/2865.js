// ==UserScript==
// @name           AlphaPlus-GM
// @namespace      https://alpha.app.net
// @include        https://alpha.app.net/
// @version        1.1.0
// @description    Enable UserStream and Post/Mention notifications on alpha.app.net.
// @downloadURL https://update.greasyfork.org/scripts/2865/AlphaPlus-GM.user.js
// @updateURL https://update.greasyfork.org/scripts/2865/AlphaPlus-GM.meta.js
// ==/UserScript==

/**
* AlphaPlus-GM v1.1.0 by @keage
* Copyright (C) 2014 Keage Y
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


/* * * * * * * * * * * */

//// INITIAL SETTINGS

// Your Access Token
// (You can obtain your access token from http://console-app.net/me)
 sessionStorage["jp.keage.adn.access_token"] = "/* PASTE YOUR ACCESS TOKEN HERE */";

// Include Direct Posts?
// (See https://developers.app.net/reference/resources/post/#general-parameters for detail.)
sessionStorage["jp.keage.adn.incl_directed"] = 1;

// Allow Post/Mention Notifications?
sessionStorage["jp.keage.adn.allow_post_notifications"] = 1;
sessionStorage["jp.keage.adn.allow_mention_notifications"] = 1;

/* * * * * * * * * * * */


function setInitialRequestToADN(connection_id) {

  console.log("setInitialRequestToADN: ");
  var include_directed_posts = sessionStorage["jp.keage.adn.incl_directed"];

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {

    if (xhr.readyState === 4) { // DONE
      if (xhr.status === 200) { // OK

        var initial_data = JSON.parse(xhr.response);
        extractArraysOfDataObjectFromResponseText(initial_data);

        console.log("unified_stream_subscription_id: ");
        console.log(initial_data.meta.subscription_id);
        document.getElementsByClassName("alpha-heading")[0].textContent = "Your Stream - Streaming";
      } else { // something wrong....
        alertErrorStatus(JSON.parse(xhr.response), "setInitialRequestToADN");
      }
    }
  };

  var access_token = "Bearer " + sessionStorage["jp.keage.adn.access_token"];
  xhr.open("GET", "https://alpha-api.app.net/stream/0/posts/stream/unified?include_directed_posts=" + include_directed_posts + "&include_post_annotations=1&connection_id=" + connection_id);
  xhr.setRequestHeader("Authorization", access_token);
  xhr.send();
}

function setMentionsEndPoint(connection_id) {

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    console.log("setMentionsEndPoint_OnReadyStateChange: ");

    if (xhr.readyState === 4) { // DONE
      if (xhr.status === 200) { // OK
        var initial_data = JSON.parse(xhr.response);
        console.log("mentions_subscription_id: ");
        console.log(initial_data.meta.subscription_id);
        
        sessionStorage["jp.keage.adn.mentions_subscription_id"] = initial_data.meta.subscription_id;
        
      } else { // something wrong....
        alertErrorStatus(xhr.status, "setMentionsEndPoint");
      }
    }
  };

  var access_token = "Bearer " + sessionStorage["jp.keage.adn.access_token"];
  xhr.open("GET", "https://alpha-api.app.net/stream/0/users/me/mentions?connection_id=" + connection_id);
  xhr.setRequestHeader("Authorization", access_token);
  xhr.send();
}


function extractArraysOfDataObjectFromResponseText(initial_data) {

  var post_queue = [];
  var current_max_id = document.getElementsByClassName("stream-container")[0].getElementsByTagName("div")[0].dataset.sinceId;
  var l;

  for (l=initial_data.data.length;l--;) {
    if (initial_data.data[l].id > current_max_id) {
      post_queue.push(initial_data.data[l]);
    }
  }

  while (post_queue.length > 0) {
    parsePostDataFromDataObject(post_queue.shift());
  }
}

function alertErrorStatus(status, caller) {
  console.log("Error");
}


function parsePostDataFromDataObject(data) {

  if (data) {
    console.log("parsePostDataFromResponseText: ");
    var doc = document.getElementsByClassName("stream-container")[0].getElementsByTagName("div")[0];

    if (document.getElementsByName(data.id).length === 0) {
        generateHTMLFragmentFromPostData(data);
    } else if (data.deleted !== undefined && data.deleted === "1") {
      console.log("deleted: ");
      console.log(data);
      var remove_node = document.getElementsByName(data.id);

      if (remove_node.length > 0) {
        remove_node[0].parentNode.removeChild(remove_node[0]);
      }
      return "";
    }
  }
}



function generateHTMLFragmentFromPostData(data) {

  var doc = document;
  var has_media = '">', end_content = "", media = "", crosspost = "", in_reply_to = "", repost = "", pull_right = "", reposted_by = "", parent_id = "", display_name = "";
  var i = 0, j = 0;
  console.log("generateHTMLFragmentFromPostData: ");

  if (data.deleted !== undefined && data.deleted === "1") {
    return "";
  }
  console.log(new Date());
  console.log(data);

  doc.getElementsByClassName("stream-container")[0].getElementsByTagName("div")[0].dataset.sinceId = data.id;

  if (data.repost_of !== undefined) {
    var reposted_by_username = data.user.username;
    parent_id = data.id;

    reposted_by = '<div class="post-reposted-by yui3-u"><span class="reposted-by-text"><i class="icon-repost"></i><span> Reposted by <a href="/' + reposted_by_username + '">@' + reposted_by_username + '</a></span></span></div>';
    data = data.repost_of;
  }


  if (data.annotations !== undefined && data.annotations.length !== 0) {
    var core_oembed = false, core_crosspost = false;

    for (i=0; i<data.annotations.length; i++){
      if (data.annotations[i].type === "net.app.core.oembed" && core_oembed === false) {
        core_oembed = true;
        var thumbnail_width = 100 * (data.annotations[i].value.thumbnail_width / data.annotations[i].value.thumbnail_height);
        var thumbnail_height = 100 * (data.annotations[i].value.thumbnail_height / data.annotations[i].value.thumbnail_width);
        var pjax_url = "";

        if (thumbnail_width > 100) {
          thumbnail_width = 100;
        } else if (thumbnail_height > 100) {
          thumbnail_height = 100;
        }
        
        photo_url = "https://alpha.app.net/" + data.user.username + '/post/' + data.id + "/photo/1";
        if (data.annotations[i].value.provider_url === "https://app.net") {
          pjax_url = 'data-pjax-url="' + photo_url +'" ';
        }
        has_media = ' has-media">';
        media = '<div class="content"><div class="media"><div class="post-media"><a ' + pjax_url + 'href="'+ photo_url + '" class="shadow-overlay"><i class="icon-zoom-in"></i></a><div class="inner-shadow-overlay"></div><img width="' + thumbnail_width + '" src="' + data.annotations[i].value.thumbnail_url + '" height="' + thumbnail_height + '"></div></div>';
        end_content = "</div>";

      } else if (data.annotations[i].type === "net.app.core.crosspost" && core_crosspost === false) {
        core_crosspost = true;
        crosspost = '<li class="crossposted-from show-on-hover yui3-u"><a href="' + data.annotations[i].value.canonical_url + '" target="_blank"><i class="icon-random"></i> from ' + data.annotations[i].value.canonical_url.split("/")[2] + '</a></li>';
      }
    }
  }


  if (data.reply_to !== undefined) {
    in_reply_to = '<li class="yui3-u in-reply-to"><a href="/' + data.user.username + '/post/' + data.id + '#' + data.reply_to + '" title="In Reply To..."><i aria-label="In Reply To..." class="icon-comments"></i></a></li>';
  }

  if (data.user.you_blocked === undefined) {
    pull_right = '<li class="yui3-u show-on-hover last pull-right"><a href="#delete" data-post-delete=""><i class="icon-remove"></i><span class="m-yui3-u-none t-yui3-u-none"> Delete</span></a></li>';
  } else {
    repost = '<li class="yui3-u repost"><a href="#repost" title="repost" data-repost-button="1" data-reposted="0" data-post-id="' + data.id + '"><i aria-label="repost" class="icon-repost"></i></a></li>';
    pull_right = '<li class="yui3-u show-on-hover last pull-right"><a href="#report" data-post-report=""><i class="icon-flag"></i><span class="m-yui3-u-none t-yui3-u-none"> Report</span></a></li><li class="yui3-u show-on-hover pull-right"><a href="#mute-user" data-post-mute-user=""><i class="icon-minus-sign"></i><span class="m-yui3-u-none t-yui3-u-none"> Mute user</span></a></li>';
  }

  if (data.entities.mentions.length !== 0) {
    for (i=0; i<data.entities.mentions.length; i++) {
      var mentioned_name = data.entities.mentions[i].name;
      var mentioned_id = data.entities.mentions[i].id;
      data.html = data.html.replace(/<span(( itemprop="mention")|( data-mention-id="\d+")|( data-mention-name=".+?")){3}>@.+?<\/span>/, '<a href="https://alpha.app.net/' + mentioned_name + '" itemprop="mention" data-mention-id="' + mentioned_id + '" data-mention-name="' + mentioned_name + '">@' + mentioned_name + '</a>');
    }
  }

  if (data.entities.hashtags.length !== 0) {
    for (j=0; j<data.entities.hashtags.length; j++) {
      var hashtag_name = data.entities.hashtags[j].name;
      data.html = data.html.replace(/<span(( itemprop="hashtag")|( data-hashtag-name=".+?")){2}>#.+?<\/span>/, '<a href="https://alpha.app.net/hashtags/' + hashtag_name + '" itemprop="hashtag" data-hashtag-name="' + hashtag_name + '">#' + hashtag_name + '</a>');
    }
  }

  display_name = '<small class="p-name">' + data.user.name + '</small>';

  var tmp = doc.createElement("div");
  tmp.setAttribute("name", data.id);
  tmp.setAttribute("class", "subpixel h-entry post-container higlight-fade higlight-fade-in");

  if (parent_id !== "") {
    tmp.setAttribute("data-parent-id", parent_id);
  }

  tmp.setAttribute("data-post-remove-from-page", "1");
  tmp.setAttribute("data-post-author-id", data.user.id);
  tmp.setAttribute("data-post-author-username", data.user.username);
  tmp.setAttribute("data-post-id", data.id);

  tmp.innerHTML = '<div class="content"><div class="media"><a href="/' + data.user.username + '" class="avatar" style="background-image:url(' + data.user.avatar_image.url + '?h=114&amp;w=114);"></a></div><div class="post-header"><span class="username p-author h-card"><a href="/' + data.user.username + '" class="u-url p-nickname">' + data.user.username + '</a>' + display_name + '</span><ul class="unstyled ul-horizontal yui3-u fixed-right ta-right"><li class="yui3-u"><a href="#star" data-starred="0" data-star-button="1" data-post-id="' + data.id + '"><i aria-label="star" class="icon-star-empty"></i></a></li>' + repost + '</ul></div><div class="body' + has_media + media + '<div class="post-text"><span class="post-content e-content">' + data.html.replace(/<a href=/g, '<a target="_blank" href=') + '</span></div></div>' + end_content + '<div class="post-footer"><ul class="unstyled ul-horizontal footer-top">' + reposted_by + '</ul><ul class="unstyled ul-horizontal footer-bottom"><li><a href="/' + data.user.username + '/post/' + data.id + '" title="' + formatDatestringToAMPMDateMonthYear(data.created_at) + '" class="u-url timestamp"><time datetime="' + formatDatestringToAMPMDateMonthYear(data.created_at) + '" class="dt-published"><i class="yui3-u icon-time"></i> ' + formatDatestringToAMPM(data.created_at) + '</time></a></li>' + in_reply_to + '<li class="yui3-u show-on-hover"><a href="#" data-reply-to=""><i class="icon-share-alt"></i> Reply</a></li><li class="stream-marker-button yui3-u show-on-hover"><a href="#" data-set-stream-marker=""><i class="icon-bookmark"></i></a></li><li class="yui3-u show-on-hover post-source"><a href="' + data.source.link + '" target="_blank"><i class="icon-share"></i> via ' + data.source.name + '</a></li>' + crosspost + pull_right + '</ul></div></div>';

  var div = doc.getElementsByClassName("stream-container")[0].getElementsByTagName("div")[0];
  div.insertBefore(tmp, div.firstChild);
}


function formatDatestringToAMPMDateMonthYear(datestring) {

  var date = new Date(datestring);
  var month = date.toDateString().split(' ');
  var str_time = formatDatestringToAMPM(datestring) + ' - '+ date.getDate() + ' ' + month[1] + ' ' + date.getFullYear();
  return str_time;
}

function formatDatestringToAMPM(datestring) {

  var date = new Date(datestring);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var str_time = hours + ':' + minutes + ' ' + ampm;
  return str_time;
}


function setUserStream() {

  var connection = new WebSocket("wss://stream-channel.app.net/stream/user?include_post_annotations=1&access_token=" + sessionStorage["jp.keage.adn.access_token"] + "&auto-delete=1");
  console.log("wss://stream-channel.app.net/stream/user?include_post_annotations=1&access_token=" + sessionStorage["jp.keage.adn.access_token"] + "&auto-delete=1");
  connection.onopen = function() {
    console.log(connection);
    connection.send("ping");
  };

  connection.onclose = function(event) {
    console.log(new Date());
    console.info("Connection closed.");
 
    console.log(event);
    document.getElementsByClassName("alpha-heading")[0].textContent = "Your Stream - Streaming cancelled.";
    if (sessionStorage["ja.keage.adn.connection_closed_due_to_error"] === "false") {
      console.info("Reconnect: ");
      setUserStream();
    }
  };

  connection.onerror = function(error) {
    var status = "";
    console.log("WebSocket error: ");
    console.error(error);
    sessionStorage["ja.keage.adn.connection_closed_due_to_error"] = true;
    alertErrorStatus(status, "setUserStream");
  };

  connection.onmessage = function(response) {

    var message_data = JSON.parse(response.data);

    if (message_data.data === undefined) {
      var connection_id = message_data.meta.connection_id;
      console.log("Connection ID: " + connection_id);

      setInitialRequestToADN(connection_id);
      
      if (sessionStorage["jp.keage.adn.allow_mention_notifications"] === "1") {
        setMentionsEndPoint(connection_id);
      }
    } else {
      var data_array = message_data.data;
      var i, j;

      if (message_data.meta.type !== undefined && message_data.meta.type !== "stream_marker") {
        console.log("subscription_id: ");
        console.log(message_data);
        console.log(message_data.meta);
      }

      if (message_data.meta.subscription_ids !== undefined) {
        for (i=data_array.length; i--;) {
          if (window.location.href === "https://alpha.app.net/") {
            parsePostDataFromDataObject(data_array[i]);
          }
        }

        if (message_data.meta.subscription_ids.indexOf(sessionStorage["jp.keage.adn.mentions_subscription_id"]) !== -1 && sessionStorage["jp.keage.adn.allow_mention_notifications"] === "1") {

          for (j=data_array.length; j--;) {
            if (data_array[j].user.you_blocked !== undefined && data_array[j].deleted === undefined) {
              showNotification(data_array[j], "mention");
            }
          }
        } else {
          for (j=data_array.length; j--;) {
            if (sessionStorage["jp.keage.adn.allow_post_notifications"] === "1" && data_array[j].user.you_blocked !== undefined &&  data_array[j].deleted === undefined) {
              showNotification(data_array[j], "post");
            }
          }
        }
      }
    }
  };
}


function setDisplayNameCSS() {
    var doc = document, elem;
    elem = doc.createElement("link");
    elem.setAttribute("rel", "stylesheet");
    elem.setAttribute("href", "data:text/css,.post-header .p-name{font-family:Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif;color:rgb(137,141,144);font-size:12px;font-weight:normal;margin-left:3px;}.yui3-u-3-5{width:90%}.sidebar-fixed-part .nav-list .global{display:list-item}");
    doc.getElementsByTagName("head")[0].appendChild(elem);
}

function showNotification(data, type) {
  var win = window;
  var avatar_size = "";

  if (win.Notification.permission === "granted") {
    console.info("SHOW NOTIFICATION:");
    console.info(type);
    var title = "";
    var icon = "";
    var message = "";

    if (type === "mention") {
      title = 'ADN - Mention from @' + data.user.username;
      icon = data.user.avatar_image.url;
    } else if ( type === "post") {
      title = 'ADN - Posted by @' + data.user.username;
      icon = data.user.avatar_image.url;
    } else if ( type === "follow") {
      title = 'ADN - @' + data.username + ' started following you.'
      icon = data.avatar_image.url;
    } else if ( type === "repost") {
      title = 'ADN - @' + data.username + ' reposted your post.'
      icon = data.avatar_image.url;
    } else if ( type === "star") {
      title = 'ADN - @' + data.username + ' starred your post.'
      icon = data.avatar_image.url;
    }

    if (data.repost_of !== undefined) {
      var reposted_by_username = data.user.username;
      data = data.repost_of;
      title = 'ADN - Posted by @' + data.user.username + ", reposted by @" + reposted_by_username;
      icon = data.user.avatar_image.url;
    }

    if (win.devicePixelRatio > 1.5) {
      avatar_size = "?h=160&w=160";
    } else {
      avatar_size = "?h=80&w=80";
    }
    icon += avatar_size;
    var message = data.text;
    var notification = new Notification(title, {"icon":icon,"body":message});
    
      setTimeout(function(){
        notification.close();
      }, 5000);
    
    notification.onclick = function (x) {
      win.focus();
      if (win.location.href !== "https://alpha.app.net/") {
        win.location.href = "https://alpha.app.net/";
      }
    };
  }
}

function requestNotificationPermission() {
  // At first, let's check if we have permission for notification
  // If not, let's ask for it
  var allow_post = sessionStorage["jp.keage.adn.allow_post_notifications"];
  var allow_mention = sessionStorage["jp.keage.adn.allow_mention_notifications"];
  if (Notification && (Notification.permission !== "granted") && (allow_post === "1" || allow_mention === "1")) {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
}

console.log(new Date());
console.log("Starting Alpha+....");
sessionStorage["ja.keage.adn.connection_closed_due_to_error"] = false;
setDisplayNameCSS();
requestNotificationPermission();
setUserStream();
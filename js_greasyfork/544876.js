// ==UserScript==
// @name        Nyaa - AnimeTosho comments
// @namespace   Violentmonkey Scripts
// @match       *://nyaa.si/view/*
// @grant       GM.xmlHttpRequest
// @version     1.5
// @author      g
// @description Add AnimeTosho comments section to releases on Nyaa.si
// @downloadURL https://update.greasyfork.org/scripts/544876/Nyaa%20-%20AnimeTosho%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/544876/Nyaa%20-%20AnimeTosho%20comments.meta.js
// ==/UserScript==

const og_description = document.querySelector("meta[property='og:description']").content
if (!og_description.startsWith("Anime - English-translated") && document.title != "404 Not Found :: Nyaa") {
  return
}


const nyaaid = window.location.pathname.split("/")[2];
const tosho_url = "https://animetosho.org/view/n" + nyaaid;

const containers = document.getElementsByClassName("container")
const nyaa_container = containers[containers.length-1]
const tosho_comments_panel = document.createElement("div");
tosho_comments_panel.id = "tosho-comments"
tosho_comments_panel.className = "panel panel-default"
tosho_comments_panel.innerHTML = '<div class="panel-heading">\
  <a data-toggle="collapse" href="#collapse-tosho-comments">\
  <h3 class="panel-title">AnimeTosho Comments</h3>\
  </a>\
  </div>'
nyaa_container.insertAdjacentElement("beforeend", tosho_comments_panel);

const tosho_comments_container = document.createElement("div");
tosho_comments_container.id = "collapse-tosho-comments"
tosho_comments_container.className = "collapse in";

tosho_comments_panel.insertAdjacentElement("beforeend", tosho_comments_container)


function filter_comments(comments) {
  let a = new Array()
  for (let element of comments.childNodes) {
    if (element.className == "comment" || element.className == "comment2") {
      a.push(element);
    }
    if (element.id.startsWith("comment_body_")) {
      a.push.apply(a, filter_comments(element));
    }

  }
  return a;
}

function find_avatar(comment) {
  for (let element of comment.childNodes) {
    if (element.className.startsWith("comment_user_avatar")) {
      return element;
    }
  }
}



GM.xmlHttpRequest({
  method: "GET",
  url: tosho_url,
}).then(function(tosho_response) {



let tosho_document = tosho_response.responseXML;
let tosho_comments = tosho_document.getElementById("view_comments");
let tosho_avatars_css = tosho_document.getElementsByTagName("style")[0];


if (tosho_avatars_css) {
  tosho_comments_container.insertAdjacentElement("beforebegin", tosho_avatars_css);
}

function make_comment_html(tosho_comment) {

  comment_info = tosho_comment.getElementsByClassName("comment_user")[0].children[0].innerHTML.split(" — ");
  time = comment_info[0];
  user = comment_info[1];
  comment_body = tosho_comment.getElementsByClassName("comment_message")[0];

  const comment_element = document.createElement("div");
  comment_element.className = "panel panel-default comment-panel"

  com_html = '<div class="panel-body">'

  let avatar = false;
  if (tosho_avatars_css) {
    avatar = find_avatar(tosho_comment);
    if (avatar) {
      com_html += '<div style="float: left;">'
      com_html += avatar.outerHTML
      com_html += '</div>'
      com_html += '<div class="col-md-10">'
    }
  }

  com_html += '<div class="comment-details">' + user + " <small>" + time + "</small></div>"
  com_html += '<div class="comment-body">' + comment_body.innerHTML + "</div>"
  com_html += "</div>"

  if (tosho_avatars_css && avatar) {com_html += "</div>"}

  comment_element.innerHTML = com_html;

  for (let comment2 of filter_comments(tosho_comment)) {
    comment2_element = make_comment_html(comment2);
    comment_element.appendChild(comment2_element);
  }

  return comment_element;
}



for (let element of filter_comments(tosho_comments)) {
  comment_html = make_comment_html(element);
  tosho_comments_container.insertAdjacentElement("beforeend", comment_html);
}

const tosho_link = document.createElement("p");
tosho_link.className = "comment-panel"
tosho_link.innerHTML = '<a href="' + tosho_url + '">Please visit AnimeTosho to participate</a>'
tosho_comments_container.appendChild(tosho_link)



})
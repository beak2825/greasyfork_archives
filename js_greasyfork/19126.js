// ==UserScript==
// @name           99clients
// @version        2016.04.25.2303
// @description    Add average ratings of 99designs contests to the contest listing
// @author         99clients Team
// @homepage       https://99clients.org
// @include        http://*.99designs.com/*
// @include        https://*.99designs.com/*
// @include        http://99designs.com/*
// @include        https://99designs.com/*
// @include        http://*.99designs.de/*
// @include        https://*.99designs.de/*
// @namespace https://greasyfork.org/users/40437
// @downloadURL https://update.greasyfork.org/scripts/19126/99clients.user.js
// @updateURL https://update.greasyfork.org/scripts/19126/99clients.meta.js
// ==/UserScript==

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function makeXhrQuery(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  var resp = JSON.parse(xhr.response);
  return resp;
}

// thanks dcro on StackOverflow for this
// http://stackoverflow.com/a/18251730
function rfc3986EncodeURIComponent(str) {  
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
}

var ct_rating_style = "style='background-color: #999; display: inline-block; color: #fff; font-size: 0.75em; border-radius: 3px; text-transform: uppercase; padding: 1px 2px;'";
var ct_link_style = "style='display: inline-block; font-size: 0.75em; text-transform: uppercase; margin-left: 5px;'";
var ch_rating_style = "style='font-family: \"Atlas Grotesk Web\", sans-serif; display: inline-block; margin-left: 1em; font-style: normal; text-transform: uppercase; font-size: 0.8em; border: 1px solid #999; border-radius: 3px; padding: 1px 2px'";

var NNC = "https://99clients.org/api/multi.php";

var contest_titles = document.getElementsByClassName("listing-details__title__link");
var ch_names = document.getElementsByClassName("listing-details__display-name display-name display-name--link");

var ct_ids = new Array();
var ch_ids = new Array();

for (var i = 0; i < contest_titles.length; i++) {
  var ct_node = contest_titles[i];
  var ct_link = ct_node.href;
  var ct_link_arr = ct_link.split("-");
  var ct_id = ct_link_arr[ct_link_arr.length - 1];
  ct_ids.push(ct_id);
  ch_ids.push(ch_names[i].href.split("/")[4]);
}

var url = NNC + "?ct_ids=" + ct_ids.join(",") + "&ch_ids=" + ch_ids.join(",");
var data = makeXhrQuery(url);

for (var i = 0; i < contest_titles.length; i++) {
  var ct_node = contest_titles[i];
  var ct_link = ct_node.href;
  var ct_link_arr = ct_link.split("-");
  var ct_id = ct_link_arr[ct_link_arr.length - 1];
  var ct_rating = data["ct_" + ct_id]["avg_rating"];
  var ct_num_revs = data["ct_" + ct_id]["num_reviews"];
  if (ct_num_revs == 0) {
    var ct_text = "<div " + ct_rating_style + ">no reviews for this contest yet</div>";
  } else {
    if (ct_num_revs > 1) {
      var review_or_reviews = "reviews";
    } else {
      var review_or_reviews = "review";
    }
    var ct_text = "<div " + ct_rating_style + ">rated " + ct_rating + " (" + ct_num_revs + " " + review_or_reviews + ")</div>";
  }

  // compute slug, build "review this contest" link
  var ct_link_full = ct_link.split("//")[1];
  var ctlfa = ct_link_full.split("/");
  ctlfa.shift();
  var slug = ctlfa.join("/");

  var ct_title = rfc3986EncodeURIComponent(ct_node.innerHTML);
  var ch_name = ch_names[i].innerHTML;
  var ch_id = ch_names[i].href.split("/")[4];
  ct_text += "<div " + ct_link_style + "><a target='_blank' href='https://99clients.org/review?slug=" + slug + "&ct_title=" + ct_title + "&ch_name=" + ch_name + "&ch_id=" + ch_id + "'>review this contest</a></div>";
  ct_node.insertAdjacentHTML('afterend', "<br/>" + ct_text);

  var ch_link_node = ch_names[i];
  var ch_link = ch_link_node.href;
  var ch_link_arr = ch_link.split("/");
  var ch_id = ch_link_arr[ch_link_arr.length - 1];
  var ch_rating = data["ch_" + ch_id]["avg_rating"];
  var ch_num_revs = data["ch_" + ch_id]["num_reviews"];
  if (ch_num_revs == 0) {
    var ch_text = "<div " + ch_rating_style + ">no reviews for this CH yet</div>";
  } else {
    if (ch_num_revs > 1) {
      var review_or_reviews = "reviews";
    } else {
      var review_or_reviews = "review";
    }
    var ch_text = "<div " + ch_rating_style + ">CH rated " + ct_rating + " (" + ct_num_revs + " " + review_or_reviews + ")</div>";
  }
  ch_link_node.insertAdjacentHTML('afterend', ch_text);

}
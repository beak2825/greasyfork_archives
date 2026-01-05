// ==UserScript==
// @name        GitHub-Maintainer-Buttons
// @namespace   https://pruetz.net/userscript/github/maintainer-buttons
// @include     https://github.com/*/pull/*
// @version     3
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @description Adds four Buttons To each Commit in a GitHub pull request for selecting comment templates.
// @downloadURL https://update.greasyfork.org/scripts/12002/GitHub-Maintainer-Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/12002/GitHub-Maintainer-Buttons.meta.js
// ==/UserScript==

var commit_id = function (element) {
  return $(element).contents()[0].data;
};

var new_comment_field = $('#new_comment_field');

var fill_and_focus_comment = function(text) {
  new_comment_field.val(text);
  new_comment_field.focus();
};

var provide_feedback = function(commit_id) {
  fill_and_focus_comment("FEEDBACK (" + commit_id + ")\n\n* [ ] ");  
};

var request_review = function(commit_id) {
  fill_and_focus_comment("REVIEW (" + commit_id + ")");
};

var say_its_ok = function(commit_id) {
  fill_and_focus_comment("OK (" + commit_id + ")");
};

var say_it_looks_good = function(commit_id) {
  fill_and_focus_comment("LGTM (" + commit_id + ")");
};

var opticon_svg = function(icon) {
  if (icon == 'comment') {
    width = 14;
    path = "M13 2H1c-0.55 0-1 0.45-1 1v8c0 0.55 0.45 1 1 1h2v3.5l3.5-3.5h6.5c0.55 0 1-0.45 1-1V3c0-0.55-0.45-1-1-1z m0 9H6L4 13V11H1V3h12v8z";
  } else if (icon == 'check') {
    width = 12;
    path = "M12 5L4 13 0 9l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5z";
  } else if (icon == 'eye') {
    width = 16;
    path = "M8.06 2C3 2 0 8 0 8s3 6 8.06 6c4.94 0 7.94-6 7.94-6S13 2 8.06 2z m-0.06 10c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4z m2-4c0 1.11-0.89 2-2 2s-2-0.89-2-2 0.89-2 2-2 2 0.89 2 2z";
  } else if (icon == 'search') {
    width = 16;
    path = "M15.7 14.3L11.89 10.47c0.7-0.98 1.11-2.17 1.11-3.47 0-3.31-2.69-6-6-6S1 3.69 1 7s2.69 6 6 6c1.3 0 2.48-0.41 3.47-1.11l3.83 3.81c0.19 0.2 0.45 0.3 0.7 0.3s0.52-0.09 0.7-0.3c0.39-0.39 0.39-1.02 0-1.41zM7 11.7c-2.59 0-4.7-2.11-4.7-4.7s2.11-4.7 4.7-4.7 4.7 2.11 4.7 4.7-2.11 4.7-4.7 4.7z"
  } else if (icon == 'thumbsup') {
    width = 16;
    path = "M14 6H12s0 0-0.02 0l0.02-0.98c0-1.3-1.17-5.02-3-5.02-0.58 0-1.17 0.3-1.56 0.77-0.36 0.41-0.5 0.91-0.42 1.41 0.25 1.48 0.28 2.28-0.63 3.28-1 1.09-1.48 1.55-2.39 1.55H2C0.94 7 0 7.94 0 9v4c0 1.06 0.94 2 2 2h1.72l1.44 0.86c0.16 0.09 0.33 0.14 0.52 0.14h6.33c1.13 0 2.84-0.5 3-1.88l0.98-5.95c0.02-0.08 0.02-0.14 0.02-0.2-0.03-1.17-0.84-1.97-2-1.97z m0 8c-0.05 0.69-1.27 1-2 1H5.67l-1.67-1V8c1.36 0 2.11-0.75 3.13-1.88 1.23-1.36 1.14-2.56 0.88-4.13-0.08-0.5 0.5-1 1-1 0.83 0 2 2.73 2 4l-0.02 1.03c0 0.69 0.33 0.97 1.02 0.97h2c0.63 0 0.98 0.36 1 1l-1 6z";
  }
  return "<svg class='octicon' height='16' width='" + width +
      "' xmlns='http://www.w3.org/2000/svg'><path d='" + path + "'</path></svg>";
};

var add_button = function(dom_sibling, title, icon, click_handler) {
  // octicon class in conjunction with dark user style utterly destroys button style
  $("<button class='btn btn-sm octicon-" + icon +
      "' style='font: 16px/1 octicons; margin-left: 1px; margin-right: 1px;' title='" + title + "'>" +
      opticon_svg(icon) + "</button>").appendTo($(dom_sibling.parentNode)).click(click_handler);
};

var add_maintainer_buttons = function () {
  var commit_id_elements = $('.commit-id');
  $.each(commit_id_elements, function(index, dom_element) {
    add_button(dom_element, "View commit", "search", function() { location.href = "../commit/" + commit_id(dom_element); });
    add_button(dom_element, "Feedback", "comment", function() { provide_feedback(commit_id(dom_element)); });
    add_button(dom_element, "Review", "eye", function() { request_review(commit_id(dom_element)); });
    add_button(dom_element, "Ok", "check", function() { say_its_ok(commit_id(dom_element)); });
    add_button(dom_element, "Seems fine", "thumbsup", function() { say_it_looks_good(commit_id(dom_element)); });
  });
};

add_maintainer_buttons();
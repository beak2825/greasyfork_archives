// ==UserScript==
// @name        Comment Text Styles - scrap.tf
// @description Allows changing text style in comment using "Bold", "Italic", "Underline", "Strikethrough" and "Link" buttons above comment input.
// @namespace   Violentmonkey Scripts
// @match				https://scrap.tf/*
// @license     MIT
// @grant       none
// @version     0.3
// @author      U.N.Owen
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/440579/Comment%20Text%20Styles%20-%20scraptf.user.js
// @updateURL https://update.greasyfork.org/scripts/440579/Comment%20Text%20Styles%20-%20scraptf.meta.js
// ==/UserScript==
function add_text_style(comment, start_offset, end_offset, token, value){
  var comm_text = comment.value;
  var start = comment.selectionStart;
  var end = comment.selectionEnd;
  comment.value = comm_text.substring(0,start) + '[' + token + value + ']' + comm_text.substring(start,end) + '[/' + token + ']' + comm_text.substring(end);
  comment.selectionStart = start + start_offset;
  if(token=='url'){
    comment.selectionEnd = start + end_offset;
  }
  else{
  	comment.selectionEnd = end + end_offset;
  }
}

var comment_input = $(".comment-input")[0];
var toolbar = $("<span>")

/* //uncomment to only show toolbar when text is selected
toolbar.hide();

$(".comment-input:first").on('mouseup keyup', ()=>{
  if(comment_input.selectionStart != comment_input.selectionEnd){
    toolbar.show();
  }
  else{
    toolbar.hide();
  }
});
*/

var bold_a = $('<a style="margin:2pt" title="Bold"><i class="fa fa-bold"></i></a>').mousedown(function(e){
  e.preventDefault();
  add_text_style(comment_input, 3, 3, 'b', '');
});
var italic_a = $('<a style="margin:2pt" title="Italic"><i class="fa fa-italic"></i></a>').mousedown(function(e){
  e.preventDefault();
  add_text_style(comment_input, 3, 3, 'i', '');
});
var underline_a = $('<a style="margin:2pt" title="Underline"><i class="fa fa-underline"></i></a>').mousedown(function(e){
  e.preventDefault();
  add_text_style(comment_input, 3, 3, 'u', '');
});
var strikethrough_a = $('<a style="margin:2pt" title="Strikethrough"><i class="fa fa-strikethrough"></i></a>').mousedown(function(e){
  e.preventDefault();
  add_text_style(comment_input, 3, 3, 's', '');
});
var link_a = $('<a style="margin:2pt" title="Link"><i class="fa fa-link"></i></a>').mousedown(function(e){
  e.preventDefault();
  add_text_style(comment_input, 5, 9, 'url','=link');
});

var color_picker = $('<input type="color" id="TextColor" value="#123456" style="display:none">').on('change', function(){
  add_text_style(comment_input, 15, 15, 'color','='+color_picker.val());
});
var color_a = $('<a style="margin:2pt" title="Text Color"><b><u>A</u></b></a>').mousedown(function(e){
  e.preventDefault();
  color_picker.click();
});
color_a.append(color_picker);

toolbar.append(bold_a);
toolbar.append(italic_a);
toolbar.append(underline_a);
toolbar.append(strikethrough_a);
toolbar.append(link_a);
toolbar.append(color_a);
$(".comment-header").before(toolbar);
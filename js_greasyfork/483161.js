// ==UserScript==
// @name           TV-Tropes: Quick Reply Box
// @namespace      QuickReply
// @description    Adds a quick reply box to TvTropes forum discussion pages.
// @include        https://tvtropes.org/pmwiki/discussion.php?id=*
// @include        https://tvtropes.org/pmwiki/posts.php?discussion=*
// @include        https://tvtropes.org/pmwiki/query.php*
// @include        https://tvtropes.org/pmwiki/editpost.php*
// @include        https://tvtropes.org/pmwiki/createconversation.php*
// @include        https://tvtropes.org/pmwiki/query_edit.php*
// @include        https://tvtropes.org/pmwiki/ykttw_reply_edit.php*
// @version        3.6
// @downloadURL https://update.greasyfork.org/scripts/483161/TV-Tropes%3A%20Quick%20Reply%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/483161/TV-Tropes%3A%20Quick%20Reply%20Box.meta.js
// ==/UserScript==

var space = document.createElement("span");
space.innerHTML = '&nbsp;'

window.addEventListener('beforeunload', e => {
  window.onbeforeunload = null;
  e.stopImmediatePropagation();
});

//preview button on forum edit pages
if  (/editpost\.php$/i.test (location.pathname) ) {
var btn_preview = document.createElement("a");
    btn_preview.innerHTML = '<a onclick="previewPost(); return false;">Preview</a></form>'
var form_preview = document.createElement("p");
    form_preview.innerHTML = '<br><br><div id="preview-container" class="section-block gutter-bottom hidden">\
<div class="text-center bold underline">Preview</div>\
<div id="preview-body"></div>';

var buttons = document.getElementsByClassName("column-box right text-right button-group blue")[0]
buttons.insertBefore(btn_preview, buttons.children[0]);
buttons.insertBefore(space, buttons.children[1]);
document.getElementsByClassName("gutter-top")[0].appendChild(form_preview);
}

   //preview button on thread create pages
else if  (/createconversation\.php$/i.test (location.pathname)) {
var btn_preview1 = document.createElement("href");
    btn_preview1.innerHTML = '<button onclick="previewPost(); return false;">Preview</button></form>'
var form_preview1 = document.createElement("p");
    form_preview1.innerHTML = '<div id="preview-container" class="section-block gutter-bottom hidden">\
<div class="text-center bold underline">Preview</div>\
<div id="preview-body" align="left"></div>';

var buttons1 = document.getElementsByClassName("column-box text-right")[0]
buttons1.insertBefore(btn_preview1, buttons1.children[0]);
buttons1.insertBefore(space, buttons1.children[1]);
document.getElementsByClassName("text-center")[0].appendChild(form_preview1);
}

   //preview button on TLP/TL/Wishlist edit pages
else if  (/query_edit\.php$/i.test (location.pathname)) {
var btn_preview2 = document.createElement("href");
    btn_preview2.innerHTML = '<button onclick="previewPost(); return false;">Preview</button>';
var form_preview2 = document.createElement("form");
    form_preview2.innerHTML = '<div id="preview-container" class="section-block gutter-bottom hidden">\
<div class="text-center bold underline">Preview</div>\
<div id="preview-body"></div>';

document.getElementById('remark').id='postedit';
var buttons2 = document.getElementsByClassName("column-box text-right")[0];
var btn_save = document.getElementsByName("submit")[0]
buttons2.insertBefore(btn_preview2, btn_save);
buttons2.insertBefore(space, btn_save);
document.getElementsByClassName("article-content")[0].appendChild(form_preview2);
}

   //Trope Finder reply
else if  (/query\.php$/i.test (location.pathname)) {
var btn_preview3 = document.createElement("href");
    btn_preview3.innerHTML = '<button onclick="previewPost(); return false;">Preview</button>';
var form_preview3 = document.createElement("form");
    form_preview3.innerHTML = '<div id="preview-container" class="section-block gutter-bottom hidden">\
<div class="text-center bold underline">Preview</div>\
<div id="preview-body"></div>';

document.getElementsByClassName("requires-toggle gutter-top gutter-bottom")[0].setAttribute('class','requires-toggle gutter-top gutter-bottom active');
document.getElementById('remark').id='postedit';
var buttons3 = document.getElementsByClassName("column-box text-right")[0];
buttons3.insertBefore(btn_preview3, buttons3.firstElementChild.nextSibling);
buttons3.insertBefore(space, buttons3.firstElementChild.nextSibling);
document.getElementsByClassName("article-content")[0].appendChild(form_preview3);
}

   //TLP  reply
else if  (/discussion\.php$/i.test (location.pathname)) {
var btn_preview4 = document.createElement("href");
    btn_preview4.innerHTML = '<button onclick="previewPost(); return false;">Preview</button>';
var form_preview4 = document.createElement("form");
    form_preview4.innerHTML = '<div id="preview-container" class="section-block gutter-bottom hidden">\
<div class="text-center bold underline">Preview</div>\
<div id="preview-body"></div>';

document.getElementsByClassName("requires-toggle gutter-top gutter-bottom")[0].setAttribute('class','requires-toggle gutter-top gutter-bottom active');
document.getElementById('remark').id='postedit';
var buttons4 = document.getElementsByClassName("column-box text-right")[2];
buttons4.insertBefore(btn_preview4, buttons4.firstElementChild.nextSibling);
buttons4.insertBefore(space, buttons4.firstElementChild.nextSibling);
document.getElementsByClassName("article-content")[0].appendChild(form_preview4);
}

    // open reply box on TLP
else if ( ! /posts\.php$/i.test (location.pathname) ) {
document.getElementsByClassName("requires-toggle gutter-top gutter-bottom")[0].setAttribute('class','requires-toggle gutter-top gutter-bottom active');
}

else {
    // open quick reply box on forum threads
    var elements = document.getElementsByClassName("button blue");
    var button = elements[0];
    button.style.display = "none";
    var table = button.parentNode;
    var URL = window.location.href;
    var begin = URL.indexOf("discussion=") + "discussion=".length;
    var end = URL.indexOf("&", begin);
    if (end == -1)
    { end = URL.length; }
    var code = URL.substring(begin,end);

    var click = document.createElement('script');
    click.text = "function smileyClicked(evt) {\
    var editor = object('postedit');\
    var e = evt ? evt : window.event ? window.event : null;\
    var smile = e.target ? e.target : e.srcElement ? e.srcElement : null;\
    if(!smile.alt) return;\
    if(typeof editor.selectionStart == 'number')\
    editor.value = editor.value.substring(0, editor.selectionStart) + smile.alt + editor.value.substring(editor.selectionEnd, editor.value.length);\
    else if(document.selection) {\
    editor.focus();\
    var range = document.selection.createRange();\
    if(range.parentElement() != editor) return false;\
    if(typeof range.text == 'string')\
    range.text = smile.alt;\
    }else editor.value += smile.alt;\
    editor.focus();\
    }\
    object('smileyPanel').onclick = smileyClicked;\
    object('postedit').focus();"

    var form = document.createElement('form');
    form.setAttribute('id','post-form');
    form.setAttribute('method','post');
    form.setAttribute('action','forumaddpost.php');
    form.setAttribute('class','gutter-top');
    form.innerHTML = '<div class="column-box text-center">\
    <span class="float-right"></span>\
Quick Reply<br /><textarea cols="50" rows="4" id="postedit" name="postedit"></textarea>\
<div id="smileyPanel" title="click on a smiley to add that smiley markup to your post">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/arrow_up.png" alt="[up]" title="[up]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/arrow_down.png" alt="[down]" title="[down]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/Thumbs_up_emoticon_3268.png" alt="[tup]" title="[thumb up]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/Thumbs_down_emoticon_3571.png" alt="[tdown]" title="[thumb down]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/tinfoilsmall.GIF" alt="[wmg]" title="[wmg]" height="17" width="17">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/minis/award_star_gold_3.png" alt="[awesome]" title="[awesome]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/bug.gif" alt="[bugs]" title="[bugs]" height="17" width="17">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_evilgrin.png" alt="[evilgrin]" title="[evilgrin]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_grin.png" alt="[grin]" title="[grin]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_smile.png" alt="[smile]" title="[smile]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_surprised.png" alt="[surprised]" title="[surprised]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_tongue.png" alt="[tongue]" title="[tongue]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_unhappy.png" alt="[sad]" title="[sad]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_waii.png" alt="[waii]" title="[waii]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/emoticon_wink.png" alt="[wink]" title="[wink]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/lightbulb.png" alt="[idea]" title="[idea]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/smiles/cool.png" alt="[cool]" title="[cool]" height="16" width="16">\
<img src="https://static.tvtropes.org/pmwiki/pub/images/lol2v12_4863.png" alt="[lol]" title="[lol]" height="16" width="16">\
<img style="vertical-align:middle;" src="https://static.tvtropes.org/pmwiki/pub/images/user_ninja_2074.png" alt="[nja]" title="[nja]" height="32" width="32">\
<a href="#" id="ImgUploaderLink" data-modal-target="upload_image"><i class="fa fa-image"></i> Upload Image</a>\
</div>\
<input type="hidden" value="' + code + '" name="discussion">\
<center><input type="submit" value="Send"></center>\
</div>';

table.appendChild(form);
table.appendChild(click);

}
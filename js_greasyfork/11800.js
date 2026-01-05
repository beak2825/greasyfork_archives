// ==UserScript==
// @name            RefLinkGenerator
// @name:en-us      RefLinkGenerator
// @name:zh-cn      引用链接生成器
// @namespace    http://www.joshuazhang.net
// @version      1.3
// @description:en-us  Generate reference link in all kinds of markup languages like html, markdown etc and copy to system clipboard.
// @description:zh-cn  提取网页标题和URL，快捷生成各类标记语言引用链接文本并复制到系统剪贴板
// @homepageURL  https://coding.net/u/joshz/p/RefLinkGenerator/git
// @supportURL   https://coding.net/u/joshz/p/RefLinkGenerator/topic/all
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @include      http://*
// @include      https://*
// @author       joshz
// @grant        GM_addStyle
// @run-at       document-end
// @noframes
// @description Generate reference link in all kinds of markup languages like html, markdown etc and copy to system clipboard.
// @downloadURL https://update.greasyfork.org/scripts/11800/RefLinkGenerator.user.js
// @updateURL https://update.greasyfork.org/scripts/11800/RefLinkGenerator.meta.js
// ==/UserScript==

/*
  Tampermonkey reference -> https://tampermonkey.net/documentation.php

  1. @noframes tag will prevent this script run inside iframe
  2. GM_log is not very user friendly, use console.log instead
  See:console.log is not working when used in a Firefox, Greasemonkey script - Stack Overflow ->
  https://stackoverflow.com/questions/10135241/console-log-is-not-working-when-used-in-a-firefox-greasemonkey-script
 */


/*
 Add rlg-panel styles
 https://stackoverflow.com/a/707580/2709868
 Just some basic style, mostly the panel style will inherit from current page.
 */
var style =
    "#rlg-panel {display:inline-block;position:fixed;top:10%;left:0;\
    z-index:2147483647;background:#111;color:#fff;overflow:hidden;}\
    #rlg-panel input{color:#111;margin:2px 8px 2px 8px;border-width:2px;border-color:#32cd32}\
    #rlg-panel a{color:#fff;font-size:14px;text-decoration:none;\
    border-style:solid;border-width:1px;border-color:#32cd32}\
    #rlg-panel div{white-space:nowrap;margin:2px 10px 2px 10px;}"; // CSS to be added
GM_addStyle(style);
rlg_log("rlg-panel css loaded");

/*
  Retrieve page url and page title
  Page title is automatically acquired following order as such:
  1. <title> tag content if exists
  2. first <h1> tag content if exists
  3. page url
 */
var page_url = window.location.href; // Obtain absolute URL of current page
rlg_log('page_url => ' + page_url);

var page_title;
try {
    var tag_content_title = document.getElementsByTagName('title')[0].innerHTML;
} catch(err) {
    rlg_log("Fail to retrieve content of tag <title>: " + err.message);
}
rlg_log('tag_content_title=> ' + tag_content_title);
try {
    var tag_content_first_h1 = document.getElementsByTagName('h1')[0].innerHTML;
} catch(err) {
    rlg_log("Fail to retrieve content of tag <h1>: " + err.message);
}
rlg_log('tag_content_first_h1=> ' + tag_content_first_h1);
if (tag_content_title) { // tag_content_title exists and not null or undefined
    page_title = tag_content_title;
} else if ( tag_content_first_h1) { // tag_content_first_h1 exists and not null or undefined
    page_title = tag_content_first_h1;
} else {
    page_title = page_url;
}
rlg_log('page_title=> ' + page_title);


/*
 Markup language settings
 Users may add their own markup language settings here
 */
var markup = [ // Specific names for different kinds of markup languages
    {   // html
        button_name: "HTML",
        base_id: "rlg-html",
        makelink: function(page_title, page_url) {
            return '<a href="' + page_url + '">' + page_title + '<\/a>';
        }
    },
    {   // markdown
        button_name: "Markdown",
        base_id: "rlg-markdown",
        makelink: function(page_title, page_url) {
            return '[' + page_title + "](" + page_url + ' "")';
        }
    },
    {   // reStructured Text
        button_name: "reST",
        base_id: "rlg-rest",
        makelink: function(page_title, page_url) {
            return '`' + page_title + ' <' + page_url + '>`_';
        }
    },
    {   // Org-mode
        button_name: "Orgmode",
        base_id: "rlg-orgmode",
        makelink: function(page_title, page_url) {
            return '[[' + page_url + '][' + page_title + ']]';
        }
    },
    {   // LaTeX
        button_name: "LaTeX",
        base_id: "rlg-latex",
        makelink: function(page_title, page_url) {
            return '\\href{' + page_url + '}{' + page_title + '}';
        }
    },
    {
        // Plain Text
        button_name: "Plain Text",
        base_id: "rlg-text",
        makelink: function(page_title, page_url) {
            return page_title + ' -> ' + page_url;
        }
    }
];

// Auto-hide panel for generated texts and buttons
// https://stackoverflow.com/questions/4811807/hidden-sidebar-that-shows-up-on-hover
// here 20em is a magic number, I don't know how to make the width of
// the rlg panel automatically  fit to the content width
$(function(){
        $('#rlg-panel').hover(
            function(){$(this).animate({width:'20em'},500);},
            function(){$(this).animate({width:'2px'},500);}
        ).trigger('mouseleave');
    }
);

function regenerate() { // onclick function for button "rlg-regenerate-button"
    var page_title = document.getElementById("rlg-title-input").value;
    rlg_log('regenerate page title :' + page_title);
    var page_url = window.location.href;
    rlg_log('regenerate page url :' + page_url);
    var id_tmp;
    for (var i=0; i<markup.length; ++i) {
        id_tmp=markup[i].base_id;
        rlg_log('regenerate link text of ' + id_tmp);
        document.getElementById(id_tmp+'-input').value=markup[i].makelink(page_title, page_url);
        rlg_log('link text of ' + id_tmp + ' has been modified');
    }
}

function copy_to_system_clipboard(this_id) { // onclick function for buttons "rlg-[markup]-button"
    // https://stackoverflow.com/a/30810322/2709868
    // Copy textarea or input text to system clipboard with one click
    // See:https://stackoverflow.com/a/30810322/2709868
    // Seems IE and chrome support document.execCommand('copy')
    // Firefox doesn't support it and Safari not tested yet.
    rlg_log(this_id);
    var text_input = document.getElementById(this_id.replace('-button', '') + '-input');
    rlg_log(this_id.replace('-button', '') + '-input');
    text_input.select();
    var hint_div = document.getElementById('rlg-hint');
    try {
        var successful = document.execCommand('copy'); // TODO Is GM_setClipboard() more compatible?
        var msg = successful ? 'successful' : 'unsuccessful';
        hint_div.setAttribute('style', 'color:lightgreen');
        var markup_tmp = this_id.replace('-button', '').replace('rlg-', '');
        hint_div.innerHTML = 'Copying generated ' + markup_tmp + ' link text to system clipboard was ' + msg;
    } catch (err) {
        hint_div.setAttribute('style', 'color:red');
        hint_div.innerHTML = "Copying to system clipboard is not supported by your browser, you can copy it manually";
    }
}

function rlg_log(log_text) {
    console.log('RefLinkGenerator LOG: ' + log_text);
}


/*
    Append rlg-panel div element into document.body
 */
var div_rlg_panel = document.createElement("div");
div_rlg_panel.id = "rlg-panel";
rlg_log("create div rlg-panel succeed");

// rlg-regenerate
var input_regenerate_1 = document.createElement("input");
input_regenerate_1.type = "text";
input_regenerate_1.id = "rlg-title-input";
input_regenerate_1.value = page_title;
var label_regenerate_1 = document.createElement("label");
label_regenerate_1.appendChild(input_regenerate_1);

var input_regenerate_2 = document.createElement("input");
input_regenerate_2.type = "button";
input_regenerate_2.id = "rlg-regenerate-button";
input_regenerate_2.value = "Regenerate";
input_regenerate_2.addEventListener("click", regenerate);
var label_regenerate_2 = document.createElement("label");
label_regenerate_2.appendChild(input_regenerate_2);

var div_rlg_regenerate = document.createElement("div");
div_rlg_regenerate.id = "rlg-regenerate";
div_rlg_regenerate.appendChild(label_regenerate_1);
div_rlg_regenerate.appendChild(label_regenerate_2);
div_rlg_panel.appendChild(div_rlg_regenerate);
rlg_log("create div rlg-regenerate succeed");

// rlg-[markup]-button and rlg-[markup]-input
for (var j=0; j<markup.length; ++j) {
    var div_markup = document.createElement("div");
    var label_1 = document.createElement("label");
    var label_2 = document.createElement("label");
    var input_1 = document.createElement("input");
    var input_2 = document.createElement("input");
    input_1.type = "text";
    input_1.id = markup[j].base_id + "-input";
    input_1.value = markup[j].makelink(page_title, page_url);
    label_1.appendChild(input_1);
    input_2.type = "button";
    input_2.id = markup[j].base_id + "-button";
    input_2.value = markup[j].button_name;
    // Important stuff about addEventListener:
    // http://www.w3schools.com/js/js_htmldom_eventlistener.asp
    // http://commons.oreilly.com/wiki/index.php/Greasemonkey_Hacks/Getting_Started#Avoid_Common_Pitfalls
    input_2.addEventListener("click", function() {copy_to_system_clipboard(this.id);});
    label_2.appendChild(input_2);
    div_markup.appendChild(label_1);
    div_markup.appendChild(label_2);
    div_rlg_panel.appendChild(div_markup);
    rlg_log(markup[j].button_name + " appended");
}

// rlg-hint
var div_rlg_hint = document.createElement("div");
div_rlg_hint.id = "rlg-hint";
div_rlg_panel.appendChild(div_rlg_hint);

document.body.appendChild(div_rlg_panel);
// ==UserScript==
// @name         imh keybindings
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  add some keybindings to imh's advsearch pages
// @author       wiiretrogamer2007
// @match        https://imhentai.xxx/advsearch/*
// @match        https://imhentai.xxx/gallery/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437806/imh%20keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/437806/imh%20keybindings.meta.js
// ==/UserScript==

/* global jQuery */

/*
Object { originalEvent: keydown, type: "keydown", isDefaultPrevented: Ee(), target: input#artists_filter.ui-autocomplete-input, currentTarget: body, relatedTarget: undefined, timeStamp: 213651, jQuery33106849258078034529: true, delegateTarget: body, handleObj: {…}, … }
​
currentTarget: <body>
​
data: null
​
delegateTarget: <body>
​
handleObj: Object { type: "keydown", origType: "keydown", guid: 361, … }
​
isDefaultPrevented: function Ee()
​
jQuery33106849258078034529: true
​
originalEvent: keydown { target: input#artists_filter.ui-autocomplete-input, key: "Enter", charCode: 0, … }
​
relatedTarget: undefined
​
target: <input id="artists_filter" class="ui-autocomplete-input" type="text" placeholder="search artists..." autocomplete="off" style="display: inline-block;" data-com.bitwarden.browser.user-edited="yes">
​
timeStamp: 213651
​
type: "keydown"
​
<prototype>: Object { constructor: Event(e, t), isDefaultPrevented: ke(), isSimulated: false, … }
debugger eval code:1:32

*/

let $ = this.jQuery = jQuery.noConflict(true);
let menu_handler = what => {
  ["group", "artist"]
    .forEach(x => $(`button[data-type="${x}"] > span.close`).click());

  $(`${what}`).toggle();
  $(`${what}`).select();

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

$("body").keydown(e => {
  if ($(e.target).is("input")
      && $(e.target).hasClass("ui-autocomplete-input")
      && e.key == "Escape") {
    $(e.target).toggle();
  }
});

$("body").keypress(e => {
  if ($(e.target).is("input")) {
    return;
  }

  switch (e.key) {
  case "f": // artist search
    menu_handler("#artists_filter");
    break;

  case "g": // group search
    menu_handler("#groups_filter");
    break;

  case "v": // load all images
    $("#load_all").click();
    break;

  case "d": // download
    $("#download_btn").click();
    break;

  case "s": // save
    $("#save_dl_btn").click();
    break;

  default:
    break;
  }
});

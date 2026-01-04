// ==UserScript==
// @name          BetterTeddit
// @namespace     betterteddit
// @match         https://*.teddit.net/*
// @match         https://teddit.*.*/*
// @exclude-match https://*.*/pics/*
// @exclude-match https://*.*/vids/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_addValueChangeListener
// @grant         GM_addStyle
// @run-at        document-start
// @version       1.6.3
// @author        Hououin Kyōma
// @license       GPLv3
// @description   Extensible convenience extension for Teddit instances while keeping general JavaScript disabled.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeAgMAAABGXkYxAAAACVBMVEUAAABHcEz///+5kPJMAAAAAnRSTlP/AOW3MEoAAABySURBVBjTdc+xDYAwDATAV8qMkikYgYJQMAJTUNPT0yCFn5J34ogGXJ1lS34jtxrxhYVsIHkZZuE2aKKZsBoOgQWJl+EEDTO3oO2K+IG9IzqKA2iAo3ScQhKyVlBvqa+38gCPMQYPNkWPmpOHf9/5e/kBEFFfBfn/SWkAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/452560/BetterTeddit.user.js
// @updateURL https://update.greasyfork.org/scripts/452560/BetterTeddit.meta.js
// ==/UserScript==

/* TODO:
 *
 *  - Cookie Syncing of subs and other settings across instances. This is very trackable, but an option for people who want it regardless?
 *  - Save posts in BetterTeddit instead of cookies. Could be good to backup the content as well in case post is deleted.
 *  - BetterTeddit theme selector for cookie blocking theme support.
 *  - Post hiding, already seen stickies specifically, probably automod replies too.
 *  - Make ID's unique for each thread ID.
 *
 * Things I probably won't do, but someone else might write an extension for:
 * - Anything that requires Reddit or Teddit API or fetching entire pages to grab information that can't be gained with the API.
 *   Anything auto-reloading as well. Basically I don't want to do anything that puts extra strain on instances by making additional or repeated requests.
 *   Not all instances have API enabled either and I don't want to make them incompatible or inferior for not wanting additional strain.
 * - I have absolutely no interest in posting on Reddit so I won't write anything that connects to their API to allow people to DM/Post anything.
 */

/* === README.md ===
# BetterTeddit

Lightweight extensible userscript for Teddit instances for Reddit.

Changes to Teddit backend may break the script, please let me know if it does.

Access to javascript you can audit in advance. Turn auto-update off, audit before update.

On a Teddit instance if there were any javascript you would have no guarantee the host didn't modify any included javascript at random one day.

You have no guarantees about their backend in regards to tracking, but at least you won't be part of someone's mining botnet.

## Features

Most features can easily be toggled on or off.

- Expand Images toggle.
- Auto expand all.
- Image click and drag resize.
- Fixed navbar with navigation links.
- Choose favorite subs for navbar.
- Forced Anonymous
- Colorized User ID
- Hide Points
- Less branding
- Custom CSS import

*/

/* === CHANGELOG.md ===
# Changelog

### v1.6.3 2023-01-21
- Include script on any teddit subdomain.
- Include version on export filename.

### v1.6.2 2022-11-14
- Exclude script on pics/vids folder when opening direct links to media.
- Stop script when id topbar is not detected, probably an error page.

### v1.6.1 2022-10-25
- Fixed BT images loading even when details is closed (BT accident, not Teddit)
- Expanded images now also get lazyloading.

### v1.6.0 2022-10-24
- Included IDs and Colorized IDs example extension by default.
- Fixed [Prev][Next] breaking script if community has no pages. (view-more-links exist, but empty).

### v1.5.1 2022-10-23
- [Git Repository](https://codeberg.org/kazuki/betterteddit) created.
- Link to git repo in config menu.
- Fixed [+][-] buttons breaking until page refresh on add/remove favorite.

### v1.5.0 2022-10-14
- Import/Export/Delete storage
- Version link to GreasyFork in config nav.

### v1.4.0 2022-10-14
- Importing custom CSS.
- Extensible swappable tabs in config menu are now functional
- Clear left on details button.
- No text selection on details summary.

### v1.3.0 2022-10-08
- Favorite subs in navbar.
- Toggle for [Home] and [Top][Bottom] links in header.
- Fixed #bottom.

### v1.2.0 2022-10-08
- Prev/Next links always visible to preserve muscle memory consistency for anything after.
- Moving topbar navigation links to the floating header.
- icon added to userscript meta.
- Added runtime performance timers.
- Fixed content loading event not firing... Probably...

### v1.1.0 2022-10-07
- Two Image Resizing bugs have been dealt with.
This changes the image containers when browsing sub feeds.

### v1.0-Alpha Release
*/

/* === KNOWNBUGS.md ===
# Known Bugs
- https://codeberg.org/kazuki/betterteddit/issues
*/
var start_totaltime = performance.now();
var events = [];
var header, header_left, header_right;
var nav_home, nav_top, nav_bottom;
var top_links;
var expanded = false;
var images_button;
var pref_button;
var pref_container = false;
var current_sub;
var fav_links;
var custom_style;

// These are just defaults, change the GM values or use the new preferences button in the header.
const config = {
  expand_images: {
    name: "Expand Images Button",
    desc: "Button to toggle expand all images.",
    default: true
  },
  auto_expand_images: {
    name: "Auto Expand Images",
    desc: "Expands all images automatically.",
    default: false
  },
  image_resizer: {
    name: "Image Resizer",
    desc: "Click and drag to resize images.",
    default: true
  },
  show_favorites: {
    name: "Show Favorites",
    desc: "Replace default / subscription links with your favorites.",
    default: true
  },
  header_home: {
    name: "Home",
    desc: "Show [Home] link in the navigation bar",
    default: true
  },
  header_topbottom: {
    name: "Top/Bottom",
    desc: "Show [Top][Bottom] links in the navigation bar",
    default: true
  },
  forced_anonymous: {
    name: "Forced Anonymous",
    desc: "Replace names with Anonymous.",
    default: true
  },
  user_ids: {
    name: "User IDs",
    desc: "Adds a hashed ID after usernames.",
    default: true
  },
  colorized_ids: {
    name: "Colorized IDs",
    desc: "Gives IDs a color based on their ID.",
    default: true
  },
  hide_points: {
    name: "Hide Points",
    desc: "Hides all voting points.",
    default: true
  },
  hide_user_flair: {
    name: "Hide User Flairs",
    desc: "Hides all user flairs.",
    default: true
  },
  hide_submission_flair: {
    name: "Hide Submission Flairs",
    desc: "Hides all submission flairs.",
    default: true
  },
  unbranding: {
    name: "Unbranding",
    desc: "Remove superflous site branding.",
    default: true
  },
  navigator: {
    name: "Navigation Links",
    desc: "Adds [Prev] and [Next] links to header.",
    default: true
  },
  event_mode: {
    name: "Event Mode",
    desc: "Dispatches events for BetterTeddit extensions.",
    default: true
  },
  debug_mode: {
    name: "Debug Mode",
    desc: "Enables console.log(), useful for developers and debugging.",
    default: true
  },
  custom_css: {
    name: "Custom CSS",
    desc: "Import Custom CSS",
    default: "/* Custom CSS */\n/* Careful what you paste */\n\n/* BT variables: */\n/*\nhtml {\n     --bt-header-size: 10pt;\n     --bt-header-color: rgb(117, 117, 117);\n     --bt-header-background: #252525;\n     --bt-menu-background: #252525;\n     --bt-border: 1px solid #000;\n     --bt-box-shadow: 0 0 2px 0 #000;\n     --bt-a-color: #c7c7c7;\n     --bt-a-color-hover: #fff;\n     --bt-normal-color: #cacaca;\n}\n*/"
  }
}

function insert_before(new_node, existing_node) {
  existing_node.parentNode.insertBefore(new_node, existing_node);
}

function log(message) {
  if (GM_getValue("debug_mode") == true) {
    if (typeof message == "string") {
      console.log("BetterTeddit: " + message);
    } else {
      console.log(message);
    }
  }
}

function dispatch_event(event_name) {
  if (GM_getValue("event_mode") != true) {
    return false;
  }
  if (events[""+event_name+""] == undefined) {
    events.push(""+event_name+"");
    events[""+event_name+""] = new CustomEvent(""+event_name+"", {
      detail: {
        event_name: ""+event_name+""
      }
    });
    window.addEventListener(""+event_name+"", (event) => {
      log("Dispatched Event: "+event_name+".");
    });
  }
  window.dispatchEvent(events[""+event_name+""]);
}

log("Start of Script");
dispatch_event("before_startup");

function init_values() {
  dispatch_event("before_init_values");
  function check_value(key, value) {
    if (GM_getValue(key) == undefined) {
      GM_setValue(key, value);
      log("Undefined, Setting default: [" + key + "]");
      log(value);
    } else {
      log("Value found, Getting value: [" + key + "]");
      log(GM_getValue(key));
    }
  }
  Object.entries(config).forEach( (key, value) => {
    check_value(key[0], key[1]["default"]);
  });
  dispatch_event("after_init_values");
} init_values();

function add_style() {
  dispatch_event("before_add_style");

  style = `
    html {
     --bt-header-size: 10pt;
     --bt-header-color: rgb(117, 117, 117);
     --bt-header-background: #252525;
     --bt-menu-background: #252525;
     --bt-border: 1px solid #000;
     --bt-box-shadow: 0 0 2px 0 #000;
     --bt-a-color: #c7c7c7;
     --bt-a-color-hover: #fff;
     --bt-normal-color: #cacaca;
    }

    body {
      margin: calc(var(--bt-header-size) + 6px) 0 0 0!important;
      padding: 0;
      font-family: sans-serif;
    }

    a.noclick {
      text-decoration: none !important;
      color: inherit !important;
      font-size: inherit!important;
    }

    details {
      clear: left;
    }
    details summary {
      -webkit-user-select: none;
              user-select: none;
    }

    a.bt_external {
      text-decoration: underline!important;
      text-decoration-thickness: 1px!important;
    }

    div#bt_header {
      line-height: 1.1;
      font-size: var(--bt-header-size);
      color: var(--bt-header-color);
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: fixed;
      top: 0;
      background: var(--bt-header-background);
      z-index: 1000;
      padding: 2px 4px;
      border-bottom: var(--bt-border);
      box-shadow: var(--bt-box-shadow);
    }
    div#bt_header a, div#bt_header a:visited, div#pref_preferences a, div#pref_preferences a:visited {
      cursor: pointer;
      color: var(--bt-a-color);
      text-decoration: none;
    }
    div#bt_header a:hover, div#pref_preferences a:hover {
      color: var(--bt-a-color-hover);
    }
    div#bt_header span {
      display: inline-flex;
    }
    span.header_bracket {
      display: inline-flex;
      margin: 0 2px;
      -webkit-user-select:none;
      user-select: none;
    }
    span#bt_header_right {
      padding-right: 1em;
    }

    #pref_container {
      z-index: 100;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    #pref_backdrop {
      z-index: 100;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    #pref_preferences {
      z-index: 1000;
      position: fixed;
      top: calc( var(--bt-header-size) + 10px);
      left: 0;
      right: 0;
      max-width: 500px;
      min-width: 500px;
      min-height: 500px;
      margin: auto;
      color: var(--bt-normal-color);
      background: var(--bt-menu-background);
      border: var(--bt-border);
      box-shadow: var(--bt-box-shadow);
    }
    #pref_nav_container {
      display: flex;
      margin: 10px;
      border-bottom: var(--bt-border);
      padding-bottom: 2px;
      font-size: 10pt;
    }
    #pref_nav, #pref_nav_right {
      display:flex;
    }
    #pref_nav > span, #pref_nav_right > span {
      margin: 0 4px;
    }
    #pref_nav a[selected], #pref_nav_right a[selected] {
      font-weight:bold;
    }
    #pref_nav_right {
      margin: 0 1em 0 auto;
    }
    #pref_close {
      font-size: 1.5em;
      font-weight: bold;
      line-height: 0.5;
    }
    #pref_content {
      margin: 1em;
      max-height: 500px;
      padding-bottom: 1em;
      overflow-y: scroll;
    }
    #pref_content > div {
      display: none;
    }
    #pref_content > div[selected] {
      display: block;
    }
    #pref_content fieldset {
      border: var(--bt-border);
      font-size: 0.8em;
      margin-bottom: 0.5em;
    }
    #pref_content a {
      text-decoration: underline!important;
    }
    #pref_content fieldset legend {
      margin-left: 0.5em;
      font-weight: bold;
    }
    #pref_content ul {
      list-style: none;
      margin-left: 1em;
    }
    #pref_content li input, #pref_content li label, #pref_content li span {
      margin: 0 0.1em;
    }
    #pref_preferences label {
      -webkit-user-select: none;
              user-select: none;
    }
    #pref_preferences label::after {
      content: ':'
    }
    #pref_preferences textarea {
      padding: 2px 4px;
      height: 5em;
      max-width: 400px;
      resize: vertical;
      font-size: 0.9em;
      max-height: 200px;
      margin: 1em;
      width: 100%;
    }

    .bt_image_container {
      cursor: default;
    }
    .bt_image {
      cursor: pointer;
    }

    .bt_top_links {
      width: 100%;
      float: left;
      overflow: hidden;
      position: relative;
    }
    .bt_top_links a {
      text-transform: uppercase;
      margin: 0 0.15em;
    }
    .bt_top_links a#sr-more-link {
      background: var(--bt-header-background);
      padding: 0 1em;
      margin: 0;
      box-shadow: none;
    }

  `;
  GM_addStyle(style);

  dispatch_event("after_add_style");
}

function custom_style() {
  dispatch_event("before_custom_style");

  // Dropdown style selection

  // Import Custom CSS
  custom_style = document.createElement("style");
  custom_style.id = "bt_custom_style";
  document.head.appendChild(custom_style);
  custom_style.textContent = GM_getValue("custom_css");

  dispatch_event("after_custom_style");
}

function create_header() {
  dispatch_event("before_create_header");
  header = document.createElement("div");
  header.id = "bt_header";

  header_left = document.createElement("span");
  header_left.id = "bt_header_left";
  header.appendChild(header_left);
  header_right = document.createElement("span");
  header_right.id = "bt_header_right";
  header.appendChild(header_right);

  if (GM_getValue("header_home") == true) {
    nav_home = document.createElement("span");
    nav_home.id = "header_home";
    nav_home.classList.add("header_bracket");
    nav_home.innerHTML = `[<a href="/">Home</a>]`;
    header_left.appendChild(nav_home);
  }

  if (GM_getValue("header_topbottom") == true) {
    nav_top = document.createElement("span");
    nav_top.id = "header_top";
    nav_top.classList.add("header_bracket");
    nav_top.innerHTML = `[<a href="#top">Top</a>]`;
    nav_bottom = document.createElement("span");
    nav_bottom.id = "header_bottom";
    nav_bottom.classList.add("header_bracket");
    nav_bottom.innerHTML = `[<a href="#bottom">Bottom</a>]`;
    header_left.appendChild(nav_top);
    header_left.appendChild(nav_bottom);
  }

  dispatch_event("during_create_header"); // After fully defined, but before placed on page.
  document.body.prepend(header);
  dispatch_event("after_create_header");

}

function user_tag() {
  dispatch_event("before_user_tag");
  var users = document.querySelectorAll("div.link p.submitted a,div.title p.submitted a,div.comment p.author a:not([title='submitter'])");
  [...users].forEach( (user) => {
    if (user.textContent == "[deleted]") {
      return false;
    }
    user.setAttribute("user", user.getAttribute("href"));
  });
  dispatch_event("after_user_tag");
}

function move_links() {
  dispatch_event("before_move_links");
  var threads = document.querySelectorAll("div.entry");
  [...threads].forEach( (thread) => {
    var links_container = document.createElement("div");
    links_container.classList.add("links_container");
    var links = thread.querySelectorAll("div.links > a, div.links > span.tag");
    [...links].forEach( (link) => {
      links_container.appendChild(link);
    });
    thread.querySelector("div.links").prepend(links_container);
  });
  dispatch_event("after_move_links");
}

function move_topbar_links() {
  dispatch_event("before_move_topbar_links");
  top_links = document.querySelector("#topbar .top-links");
  if (top_links != null) {
    insert_before(top_links, header_right);
    top_links.classList.add("bt_top_links");
    top_links.classList.remove("top-links");
  }
  dispatch_event("after_move_topbar_links");
}

function move_details() {
  dispatch_event("before_move_details");
  var threads = document.querySelectorAll("div.entry");
  [...threads].forEach( (thread) => {
    var details_container = document.createElement("div");
    details_container.classList.add("details_container");
    var details = thread.querySelectorAll("div.links > details, div.links > style");
    [...details].forEach( (detail) => {
      details_container.appendChild(detail);
    });
    thread.querySelector("div.links").appendChild(details_container);
  });
  dispatch_event("after_move_details");
}

function forced_anonymous() {
  if (GM_getValue("forced_anonymous") != true) {
    return false;
  }
  dispatch_event("before_forced_anonyous");
  var users = document.querySelectorAll("a[user]");
  [...users].forEach( (user) => {
    if (user.textContent == "[deleted]") {
      return false;
    }
    user.removeAttribute("href");
    user.textContent = "Anonymous";
    user.classList.add("noclick");
  });
  dispatch_event("after_forced_anonymous");
}

function user_ids() {
  if (GM_getValue("user_ids") != true) {
    return false;
  }
  var style = `
  .id_container {
    margin-left: 0.5em;
    font-weight: normal;
    color: inherit;
    overflow: auto;
  }

  .entry span.id_container {
    margin-right: 4px;
  }
  span.id_tag {
    margin-left: 0!important;
  }
  .id_tag.colorized_id {
    padding: 2px;
    color: #000;
    border-radius: 1px;
  }

  `;
  GM_addStyle(style);

  function generate_id(name) {
    const cyrb53 = (str, seed = 0) => {
      // https://stackoverflow.com/a/52171480
      let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    return cyrb53(name).toString(36).padStart(8,0).substr(0, 8);
  }

  var users = document.querySelectorAll("a[user]");
  [...users].forEach( (user) => {
    var name = user.getAttribute("user");
    var user_id = generate_id(name)
    user.setAttribute("user_id", user_id );
    var id_container = document.createElement("span");
    id_container.classList.add("id_container");
    id_container.textContent = "ID: ";
    user.insertAdjacentElement("afterend", id_container);
    var id_tag = document.createElement("span");
    id_tag.classList.add("id_tag");
    id_tag.setAttribute("user_id", user_id);
    id_tag.textContent = user_id;
    id_container.appendChild(id_tag);

    if (GM_getValue("colorized_ids") == true) {
      function stringToHslColor(str, s, l) {
        // https://scribe.bus-hit.me/@pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var h = hash % 360;
        return 'hsl('+h+', '+s+'%, '+l+'%)';
      }
      id_tag.classList.add("colorized_id");
      id_tag.style.backgroundColor = stringToHslColor(user_id, 50, 50);
    }
  });

}

function hide_points() {
  if (GM_getValue("hide_points") != true) {
    return false;
  }
  dispatch_event("before_hide_points");
  var style = document.createElement("style");
  style.innerHTML = ".score, .upvotes {visibility: hidden}.ups {display: none!important;}";
  style.id = "bt_hide_points";
  document.head.appendChild(style);
  GM_addValueChangeListener("hide_points", function() {
    if (arguments[2] == true) {
      style.innerHTML = ".score, .upvotes {visibility: hidden}.ups {display: none!important;}";
    } else {
      style.innerHTML = "/* hide_points disabled */";
    }
  });
  dispatch_event("after_hide_points");
}

function hide_user_flair() {
  if (GM_getValue("hide_user_flair") != true) {
    return false;
  }
  dispatch_event("before_hide_user_flair");
  var style = document.createElement("style");
  style.innerHTML = "p.submitted .flair, .meta p .flair { display: none!important; }";
  style.id = "bt_hide_user_flair";
  document.head.appendChild(style);
  GM_addValueChangeListener("hide_user_flair", function() {
    if (arguments[2] == true) {
      style.innerHTML = "p.submitted .flair, .meta p .flair { display: none!important; }";
    } else {
      style.innerHTML = "/* hide_user_flair disabled */";
    }
  });
  dispatch_event("after_hide_user_flair");
}

function hide_submission_flair() {
  if (GM_getValue("hide_submission_flair") != true) {
    return false;
  }
  dispatch_event("before_hide_submission_flair");
  var style = document.createElement("style");
  style.innerHTML = ".title .flair { display: none!important; }";
  style.id = "bt_hide_submission_flair";
  document.head.appendChild(style);
  GM_addValueChangeListener("hide_submission_flair", function() {
    if (arguments[2] == true) {
      style.innerHTML = ".title .flair { display: none!important; }";
    } else {
      style.innerHTML = "/* hide_submission_flair disabled */";
    }
  });
  dispatch_event("after_hide_submission_flair");
}

function unbranding() {
  if (GM_getValue("unbranding") != true) {
    return false;
  }
  dispatch_event("before_unbranding");

  var teddit_text = document.querySelector("header a.main");
  if (teddit_text != null) { teddit_text.remove(); }

  var subreddit_text = document.querySelector("header div p");
  if (subreddit_text != null) { subreddit_text.remove(); }

  var sub_link = document.querySelector("header div a p");
  if (sub_link != null) { sub_link.textContent = sub_link.textContent.substring(3); }

  var sub_title = document.querySelector("div#sidebar div.content div.heading p.title");
  if (sub_title != null) { document.title = sub_title.textContent; }

  var teddit_intro = document.getElementById("intro");
  if (teddit_intro != null) { teddit_intro.remove(); }

  GM_addValueChangeListener("unbranding", function() {
    if (arguments[2] == true) {

    } else {

    }
  });
  dispatch_event("after_unbranding");
}

function expand_images() {
  dispatch_event("before_expand_images")

  //var images = document.querySelectorAll("div.links details.preview-container"); //images only
  var images = document.querySelectorAll("div.links details"); //text too
  log("Found "+images.length+" images.");
  [...images].forEach( (image) => {
    if (expanded != true) {
      image.setAttribute("open", "open");
    } else {
      image.setAttribute("open", "");
      image.removeAttribute("open");
    }
  });
  expanded = expanded?false:true;

  dispatch_event("after_expand_images");
}

function expand_images_button() {
  if (GM_getValue("expand_images") != true) {
    return false;
  }
  dispatch_event("before_expand_images_button");

  images_button = document.createElement("span");
  images_button.id = "header_images_button";
  images_button.classList.add("header_bracket");
  images_button.innerHTML = `
    [<a>Expand</a>]
  `;
  images_button.addEventListener("click", expand_images);

  header_left.appendChild(images_button);

  GM_addValueChangeListener("expand_images", function() {
    if (arguments[2] == true) {
      images_button.style.display = "unset";
    } else {
      images_button.style.display = "none";
    }
  });

  dispatch_event("after_expand_images_button");
}

function auto_expand_images() {
  if (GM_getValue("auto_expand_images") != true) {
    return false;
  }
  dispatch_event("before_auto_expand_images");
  expand_images(true);
  dispatch_event("after_auto_expand_images");
}

function image_resizer() {
  if (GM_getValue("image_resizer") != true) {
    return false;
  }
  dispatch_event("before_image_resizer");

  function resize(image, event) {
    log("Image Resize: Mouse Down");
    event.preventDefault();
    var mousedown = true;
    var imageX, imageY, posX, posY, newposX, newposY, diffX, diffY, newimageX, newimageY;

    image.style.minWidth = "25px";
    image.style.minHeight = "25px";
    imageX = image.offsetWidth;
    imageY = image.offsetHeight;
    posX = event.clientX;
    posY = event.clientY;
    //log(imageX); log(imageY);
    //log(posX);   log(posY);
    image.style.width = imageX + "px";
    image.style.height = imageY + "px";
    image.style.maxWidth = "unset";
    image.style.maxHeight = "unset";

    function mousemove(e) {
      if (mousedown == false) {
        log("Image Resize: Mouse Down is false.");
      }
      log("Image Resize: Mouse Move");
      newposX = e.clientX;
      newposY = e.clientY;
      diffX = newposX - posX;
      diffY = newposY - posY;
      newimageX = imageX + diffX + diffY;
      newimageY = imageY + diffX + diffY;
      image.style.width = newimageX + "px";
      image.style.height = "auto";
    }
    window.addEventListener("mousemove", mousemove);

    function mouseup() {
      mousedown = false;
      log("Image Resize: Mouse Up");
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("mousemove", mousemove);
    }
    window.addEventListener("mouseup", mouseup );

  }
  // Sub images
  var sub_images = document.querySelectorAll("details.preview-container");
  [...sub_images].forEach( (details) => {
    details.querySelector("div.preview").remove();
    details.style.zIndex = 2;
    details.style.position = "relative";
    details.classList.remove("preview-container");
    details.classList.add("bt_image_container");
    var image_div = document.createElement("div");
    image_div.classList.add("bt_image_container");
    var image = document.createElement("img");
    image.classList.add("bt_image");
    image.setAttribute("img-src", details.getAttribute("data-url"));

    // mutate observe open attribute to add src, activates automatically on manual details open or expand all button
    var mutate_config = { attributes: true, childList: false, subtree: false };
    var callback = (mutationList, observer) => {
      for (var mutation of mutationList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName == "open") {
            image.loading = "lazy";
            image.src = image.getAttribute("img-src");
            observer.disconnect();
          }
        }
      }
    };
    var mutate_observer = new MutationObserver(callback);
    mutate_observer.observe(details, mutate_config);

    image.style.opacity = 1;
    image_div.appendChild(image);
    details.appendChild(image_div);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "600px";
    image.style.width = "auto";
    image.style.height = "100%";
    image.addEventListener("mousedown", (event) => {
      if (event.which != "1") {
        return; // no right click
      }
      resize(image, event); //set size first
      image.classList.add("image_resized");
    });
  });

  //Thread images
  var thread_images = document.querySelectorAll("div#post div.image");
  [...thread_images].forEach( (image) => {
    var a = image.querySelector("a");
    a.addEventListener("click", (event) => {
      event.preventDefault();
    });
    var img = image.querySelector("a img");
    img.addEventListener("mousedown", (event) => {
      if (event.which != "1") {
        return; // no right click
      }
      resize(img, event);
      img.classList.add("image_draggable");
    });
  });

  dispatch_event("after_image_resizer");
}

function navigator() {
  if (GM_getValue("navigator") != true) {
    return false;
  }
  dispatch_event("before_navigator");
  var morelinks = document.querySelector(".view-more-links");

  var navigator_container = document.createElement("span");
  navigator_container.id = "header_navigator_container";

  if (morelinks != null) {
    var links = document.querySelectorAll(".view-more-links a");
    var prev = document.createElement("span");
    prev.classList.add("header_bracket");
    var next = document.createElement("span");
    next.classList.add("header_bracket");
    if (links.length == 2) {
      prev.innerHTML = "[<a href='"+links[0].getAttribute('href')+"'>Prev</a>]";
      next.innerHTML = "[<a href='"+links[1].getAttribute('href')+"'>Next</a>]";
    } else if (links.length == 1) {
      prev.innerHTML = "[Prev]";
      next.innerHTML = "[<a href='"+links[0].getAttribute('href')+"'>Next</a>]";
    } else {
      prev.innerHTML = "[Prev]";
      next.innerHTML = "[Next]";
    }
    navigator_container.appendChild(prev);
    navigator_container.appendChild(next);
  } else {
    var prev = document.createElement("span");
    prev.classList.add("header_bracket");
    prev.innerHTML = "[Prev]";
    var next = document.createElement("span");
    next.classList.add("header_bracket");
    next.innerHTML = "[Next]";
    navigator_container.appendChild(prev);
    navigator_container.appendChild(next);
  }
  header_left.appendChild(navigator_container);
  dispatch_event("during_navigator");
}

function bottom_link() { // Run after document_loaded
  dispatch_event("before_bottom_link");
  var bottom = document.querySelector("footer");
  if (bottom != null) {
    bottom.id = "bottom";
  } else {
    log("No footer found.");
  }
  dispatch_event("after_bottom_link");
}

function get_current_sub() {
  if (window.location.pathname.split('/')[1].toLowerCase() == "r") {
    current_sub = window.location.pathname.split('/')[2].toLowerCase();
    log("Current sub: "+current_sub+".");
  }
}

function show_favorites() {
  dispatch_event("before_show_favorites");
  if (GM_getValue("show_favorites") != true ) {
    return false;
  }

  if (GM_getValue("list_favorites") == null) {
    GM_setValue("list_favorites", []);
  }

  function is_favorite_sub(subname) {
    var subs = GM_getValue("list_favorites");
    var _subname = subname.toLowerCase()
    if ( Array.from(subs).includes(_subname) ) {
      return true;
    } else {
      return false;
    }
  }

  if (current_sub) {
    var is_current_fav = is_favorite_sub(current_sub);
  }

  function toggle_favorite_sub(subname) {
    dispatch_event("before_toggle_favorite_sub");
    var subs = GM_getValue("list_favorites");
    var _subname = subname.toLowerCase()
    var newsubs;
    log(Array.from(subs));
    if ( !Array.from(subs).includes(_subname) ) {
      newsubs = Array.from(subs);
      newsubs.push(_subname);
      GM_setValue("list_favorites", newsubs);
      log("Added "+_subname+" to favorites.");
    } else {
      newsubs = Array.from(subs).filter( (sub) => {
        return sub != _subname;
      });
      GM_setValue("list_favorites", newsubs);
      log("Removed "+_subname+" from favorites.");
    }
    log(Array.from(GM_getValue("list_favorites")));
    dispatch_event("after_toggle_favorite_sub");
  }

  function favorite_sub_link() {
    dispatch_event("before_favorite_sub_link");

    var fav_style = `
      a#bt_toggle_favorite {
        text-decoration: none;
        cursor: pointer;
        font-size: 16pt;
        vertical-align: middle;
        line-height: 1;
        -webkit-user-select: none;
                user-select: none;
      }
      span.toggle_list {
        display: inline!important;
      }
      a.toggle_list {
        margin: 0!important;
        font-weight: bold;
      }
      `;
    GM_addStyle(fav_style);

    var subscribe_container = document.querySelector("#sidebar .subscribe.content");
    if (subscribe_container != null) {
      var favorite_link = document.createElement("a");
      favorite_link.id = "bt_toggle_favorite";

      function change_fav_link() {
        if (is_current_fav == false) {
          favorite_link.classList.add("is_not_favorite");
          favorite_link.classList.remove("is_favorite");
          favorite_link.innerHTML = "♡";
          favorite_link.title = "Add "+current_sub+" to favorites.";
        } else {
          favorite_link.classList.add("is_favorite");
          favorite_link.classList.remove("is_not_favorite");
          favorite_link.innerHTML = "♥";
          favorite_link.title = "Remove "+current_sub+" from favorites.";
        }
      }
      change_fav_link();

      favorite_link.addEventListener("click", () => {
        toggle_favorite_sub(current_sub);
        is_current_fav = is_current_fav?false:true;
        change_fav_link();
        update_fav_nav_links();
      });

      subscribe_container.appendChild(favorite_link);
    }
    dispatch_event("after_favorite_sub_link");
  }

  function create_fav_nav_links() {
    fav_links = document.createElement("div");
    fav_links.id = "bt_fav_nav_links";
    fav_links.classList.add("bt_top_links");
    update_fav_nav_links();
    insert_before(fav_links, header_right);
    top_links.style.display = "none";
  }

  function make_show_favs() {
    var show_favs = document.createElement("span");
    show_favs.classList.add("header_bracket");
    show_favs.classList.add("toggle_list");
    show_favs.innerHTML = `[<a class="toggle_list show_favs">―</a>]`; //Fullwidth Hyphen-Minus, &#65293;
    show_favs.title = "Show Favorites";
    show_favs.addEventListener("click", () => {
      top_links.style.display = "none";
      fav_links.style.display = "block";
      log("Toggle Show Favorites");
    });
    top_links.prepend(show_favs);
  }

  function make_show_subs() {
    var show_subs = document.createElement("span");
    show_subs.classList.add("header_bracket");
    show_subs.classList.add("toggle_list");
    show_subs.innerHTML = `[<a class="toggle_list show_subs">＋</a>]`; // Fullwidth Plus &#65291;
    show_subs.title = "Show Subscriptions";
    show_subs.addEventListener("click", () => {
      top_links.style.display = "block";
      fav_links.style.display = "none";
      log("Toggle Show Subscriptions");
    });
    fav_links.prepend(show_subs);
  }

  function update_fav_nav_links() {
    var html = `<a href="/r/popular">Popular</a><a href="/r/all">All</a>`;
    var subs = GM_getValue("list_favorites");
    Array.from(subs).forEach((sub) => {
      html = html + `<a href="/r/${sub}">${sub}</a>`;
    });
    fav_links.innerHTML = html;
    make_show_subs();
  }

  favorite_sub_link();
  create_fav_nav_links();
  make_show_favs();
  dispatch_event("after_show_favorites");
}

function create_toggle(config_name) {
  var _toggle = config[config_name];

  var _li = document.createElement("li");
  _li.id = "pref_li_"+config_name+"";

  var _checkbox = document.createElement("input");
  _checkbox.id = "pref_check_"+config_name+"";
  _checkbox.setAttribute("type", "checkbox");
  _li.appendChild(_checkbox);

  if (GM_getValue(config_name) == true) {
    _checkbox.checked = true;
  }

  GM_addValueChangeListener(""+config_name+"", function(key, old_val, new_val, remote) {
    if (arguments[2] == true) {
      _checkbox.checked = true;
    } else {
      _checkbox.checked = false;
    }
    log("Set GM Value "+config_name+" to "+arguments[2]+".");
  });

  _checkbox.addEventListener("change", (event) => {
    if (_checkbox.checked == true) {
      GM_setValue(""+config_name+"", true);
    } else {
      GM_setValue(""+config_name+"", false);
    }
    log("Set "+config_name+" config checkbox to "+_checkbox.checked+".");
  });

  var _label = document.createElement("label");
  _label.id = "pref_label_"+config_name+"";
  _label.setAttribute("for", _checkbox.id);
  var _a = document.createElement("a");
  _a.textContent = _toggle["name"];
  _label.appendChild(_a);
  _li.appendChild(_label);

  var _desc = document.createElement("span");
  _desc.id = "pref_desc_"+config_name+"";
  _desc.textContent = _toggle["desc"];
  _li.appendChild(_desc);

  return _li;
}

function create_input() {
  // lets create input fields to use in style tab, toggle for textarea
}

function open_preferences() {

  if (pref_container != false) {
    if (pref_container.style.display != "block") {
      dispatch_event("before_show_preferences");
      pref_container.style.display = "block";
      dispatch_event("after_show_preferences");
    } else {
      hide_preferences();
    }
    return false;
  }

  dispatch_event("before_open_preferences");
  pref_container = document.createElement("div");
  pref_container.id = "pref_container";
  pref_container.style.display = "block";

  var pref_backdrop = document.createElement("div");
  pref_backdrop.id = "pref_backdrop";
  pref_backdrop.addEventListener("click", hide_preferences);
  pref_container.appendChild(pref_backdrop);

  var pref_preferences = document.createElement("div");
  pref_preferences.id = "pref_preferences";

  var pref_nav_container = document.createElement("div");
  pref_nav_container.id = "pref_nav_container";

  var pref_nav = document.createElement("span");
  pref_nav.id = "pref_nav";
  pref_nav.innerHTML = `
    <span tab="general"><a tab="general" selected="">General</a></span>
    <span tab="style"><a tab="style">Style</a></span>
  `;
  pref_nav_container.appendChild(pref_nav);

  var pref_nav_right = document.createElement("span");
  pref_nav_right.id = "pref_nav_right";
  pref_nav_right.innerHTML = `
    <span tab="storage"><a tab="storage">Storage</a></span>
    <span><a class="bt_external" href="https://greasyfork.org/en/scripts/452560-betterteddit/versions" target="_blank">${GM_info.script.version}</a></span>
    <span><a class="bt_external" href="https://codeberg.org/kazuki/betterteddit" target="_blank">Git</a></span>
  `;
  pref_nav_container.appendChild(pref_nav_right);

  var pref_close = document.createElement("span");
  pref_close.id = "pref_close";
  pref_close.innerHTML = `<a aria-label="Close Preferences">×</a>`;
  pref_close.addEventListener("click", hide_preferences);
  pref_nav_container.appendChild(pref_close);

  pref_preferences.appendChild(pref_nav_container);

  var pref_content = document.createElement("div");
  pref_content.id = "pref_content";
  // TABS IN HERE

  var general_tab = document.createElement("div");
  general_tab.id = "pref_general_content";
  general_tab.setAttribute("tab", "general");
  general_tab.setAttribute("selected", "selected");
  pref_content.appendChild(general_tab);

    //IMAGES
  var pref_images_fieldset = document.createElement("fieldset");
  pref_images_fieldset.id = "pref_images_fieldset";
  general_tab.appendChild(pref_images_fieldset);
  var pref_images_legend = document.createElement("legend");
  pref_images_legend.textContent = "Images";
  pref_images_fieldset.appendChild(pref_images_legend);
  var pref_images_ul = document.createElement("ul");
  pref_images_fieldset.appendChild(pref_images_ul);
  pref_images_ul.appendChild( create_toggle("expand_images") );
  pref_images_ul.appendChild( create_toggle("auto_expand_images") );
  pref_images_ul.appendChild( create_toggle("image_resizer") );
    //NAVIGATION
  var pref_navigation_fieldset = document.createElement("fieldset");
  pref_navigation_fieldset.id = "pref_navigation_fieldset";
  general_tab.appendChild(pref_navigation_fieldset);
  var pref_navigation_legend = document.createElement("legend");
  pref_navigation_legend.textContent = "Navigation";
  pref_navigation_fieldset.appendChild(pref_navigation_legend);
  var pref_navigation_ul = document.createElement("ul");
  pref_navigation_fieldset.appendChild(pref_navigation_ul);
  pref_navigation_ul.appendChild( create_toggle("header_home") );
  pref_navigation_ul.appendChild( create_toggle("header_topbottom") );
  pref_navigation_ul.appendChild( create_toggle("navigator") );
  pref_navigation_ul.appendChild( create_toggle("show_favorites") );
    //MISCELLANEOUS
  var pref_misc_fieldset = document.createElement("fieldset");
  pref_misc_fieldset.id = "pref_misc_fieldset";
  general_tab.appendChild(pref_misc_fieldset);
  var pref_misc_legend = document.createElement("legend");
  pref_misc_legend.textContent = "Miscellaneous";
  pref_misc_fieldset.appendChild(pref_misc_legend);
  var pref_misc_ul = document.createElement("ul");
  pref_misc_fieldset.appendChild(pref_misc_ul);
  pref_misc_ul.appendChild( create_toggle("forced_anonymous") );
  pref_misc_ul.appendChild( create_toggle("user_ids") );
  pref_misc_ul.appendChild( create_toggle("colorized_ids") );
  pref_misc_ul.appendChild( create_toggle("hide_points") );
  pref_misc_ul.appendChild( create_toggle("hide_user_flair") );
  pref_misc_ul.appendChild( create_toggle("hide_submission_flair") );
  pref_misc_ul.appendChild( create_toggle("unbranding") );
  pref_misc_ul.appendChild( create_toggle("event_mode") );
  pref_misc_ul.appendChild( create_toggle("debug_mode") );

  // STYLE TAB
  var style_tab = document.createElement("div");
  style_tab.id = "pref_style_content";
  style_tab.setAttribute("tab", "style");

  var fieldset_customcss = document.createElement("fieldset");
  fieldset_customcss.id = "fieldset_customcss";
  style_tab.appendChild(fieldset_customcss);
  var legend_customcss = document.createElement("legend");
  legend_customcss.innerHTML = "Custom CSS";
  fieldset_customcss.appendChild(legend_customcss);
  var ul_customcss = document.createElement("ul");
  fieldset_customcss.appendChild(ul_customcss);
  var li_customcss = document.createElement("li");
  var textarea_customcss = document.createElement("textarea");
  textarea_customcss.textContent = GM_getValue("custom_css");
  var btn_update_customcss = document.createElement("button");
  btn_update_customcss.innerHTML = "Update CSS";
  btn_update_customcss.addEventListener("click", () => {
    textarea_customcss.textContent = textarea_customcss.value;
    textarea_customcss.value = textarea_customcss.textContent;
    var newcss = textarea_customcss.textContent;
    custom_style.textContent = newcss;
    GM_setValue("custom_css", newcss);
  });
  li_customcss.appendChild(btn_update_customcss);
  li_customcss.appendChild(textarea_customcss);

  ul_customcss.appendChild(li_customcss);

  pref_content.appendChild(style_tab);
  // END STYLE TAB

  // STORAGE TAB
  var storage_tab = document.createElement("div");
  storage_tab.id = "pref_storage_content";
  storage_tab.setAttribute("tab", "storage");

    // Import Settings
  var fieldset_storageimport = document.createElement("fieldset");
  fieldset_storageimport.id = "fieldset_storageimport";
  storage_tab.appendChild(fieldset_storageimport);
  var legend_storageimport = document.createElement("legend");
  legend_storageimport.innerHTML = "Import Settings";
  fieldset_storageimport.appendChild(legend_storageimport);
  var ul_storageimport = document.createElement("ul");
  fieldset_storageimport.appendChild(ul_storageimport);
  var li_storageimport = document.createElement("li");
  ul_storageimport.appendChild(li_storageimport);

  var input_storageimport = document.createElement("input");
  input_storageimport.id = "storageimport";
  input_storageimport.type = "file";
  input_storageimport.accept = ".json";
  input_storageimport.style.display = "none";
  li_storageimport.appendChild(input_storageimport);
  var btn_storageimport = document.createElement("button");
  btn_storageimport.innerHTML = "Select File";
  btn_storageimport.addEventListener("click", () => {
    input_storageimport.click();
  });
  li_storageimport.appendChild(btn_storageimport);

  input_storageimport.addEventListener("change", (event) => {
    var file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onerror = function() {
      alert(reader.error);
    };
    reader.onload = function() {
      try {
        var imported = JSON.parse(reader.result);
        log(imported);
        var _count = 0;
        [...imported].forEach( (value) => {
          GM_setValue(value[0], value[1]);
          _count++;
        });
        alert("Successfully imported "+_count+" keys, reloading to apply changes.");
        document.location.reload();
      } catch(e) {
        alert(e);
      }
    };
  });

    // Export Settings
  var fieldset_storageexport = document.createElement("fieldset");
  fieldset_storageexport.id = "fieldset_storageexport";
  storage_tab.appendChild(fieldset_storageexport);
  var legend_storageexport = document.createElement("legend");
  legend_storageexport.innerHTML = "Export Settings";
  fieldset_storageexport.appendChild(legend_storageexport);
  var ul_storageexport = document.createElement("ul");
  fieldset_storageexport.appendChild(ul_storageexport);
  var li_storageexport = document.createElement("li");
  ul_storageexport.appendChild(li_storageexport);
  var btn_storageexport = document.createElement("button");
  btn_storageexport.innerHTML = "Export File";
  var a_download_storageexport = document.createElement("a");
  a_download_storageexport.style.display = "none";
  li_storageexport.appendChild(a_download_storageexport);

  btn_storageexport.addEventListener("click", () => {
    var export_result = [];
    [...GM_listValues()].forEach( (value) => {
      export_result.push([value, GM_getValue(value)]);
    });
    export_result = JSON.stringify(export_result, null, 2);
    log(export_result);
    var export_blob = new Blob([export_result], {type: "application/json"});
    var export_url = window.URL.createObjectURL(export_blob);
    var _date = new Date();
    var _name = "BetterTeddit_Storage_"+GM_info.script.version+"_"+_date.getFullYear()+"-"+_date.getMonth()+"-"+_date.getDate()+"_"+_date.getHours()+"-"+_date.getMinutes()+".json";
    console.log(_name);
    a_download_storageexport.download = _name;
    a_download_storageexport.href = export_url;
    a_download_storageexport.click();

  });
  li_storageexport.appendChild(btn_storageexport);

    // Delete Settings
  var fieldset_storagedelete = document.createElement("fieldset");
  fieldset_storagedelete.id = "fieldset_storagedelete";
  storage_tab.appendChild(fieldset_storagedelete);
  var legend_storagedelete = document.createElement("legend");
  legend_storagedelete.innerHTML = "Reset/Delete Settings";
  fieldset_storagedelete.appendChild(legend_storagedelete);
  var ul_storagedelete = document.createElement("ul");
  fieldset_storagedelete.appendChild(ul_storagedelete);
  var li_storagedelete = document.createElement("li");
  ul_storagedelete.appendChild(li_storagedelete);

  var details_delete_storage = document.createElement("details");
  li_storagedelete.appendChild(details_delete_storage);
  details_delete_storage.innerHTML = "<summary>Delete Storage</summary>";
  var btn_delete_storage = document.createElement("button");
  btn_delete_storage.innerHTML = "Delete";
  btn_delete_storage.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to delete all storage? Including, but not limited to, custom css and favorite subs. Non-recoverable without backups. This does NOT include extensions or cookies.")) {
      [...GM_listValues()].forEach( (value) => {
        GM_deleteValue(value);
      });

      alert("Storage deleted.");
      document.location.reload();
    } else {
      details_delete_storage.removeAttribute("open");
    }
  });
  details_delete_storage.appendChild(btn_delete_storage);

  /*[...GM_listValues()].forEach( (value) => {
    var _div = document.createElement("div");
    _div.textContent = "Key: "+value+", Value:"+GM_getValue(value)+"";
    storage_tab.appendChild(_div);
  });*/

  pref_content.appendChild(storage_tab);
  // END STORAGE TAB

  pref_preferences.appendChild(pref_content);
  pref_container.appendChild(pref_preferences);

  // Click tabs

  function click_tabs(event) {
    if (event.target.tagName != "A") {
      return;
    }
    if (!event.target.hasAttribute("tab")) {
        return;
    }
    var sel_tab = event.target.getAttribute("tab");
    var sel_link = event.target;
    log("Preferences Tab: "+sel_tab+".");
    var nav_links = pref_nav_container.querySelectorAll("a[tab]");
    var content_tabs = pref_content.querySelectorAll("div");
    [...content_tabs].forEach((tab) => {
      if (tab.getAttribute("tab") == sel_tab) {
        tab.setAttribute("selected", "selected");
      } else {
        tab.removeAttribute("selected");
      }
    });
    [...nav_links].forEach((link) => {
      if (link.getAttribute("tab") == sel_tab) {
        link.setAttribute("selected", "selected");
      } else {
        link.removeAttribute("selected");
      }
    });

  }

  pref_nav_container.addEventListener("click", (event) => {
    click_tabs(event);
  }, true);

  dispatch_event("during_open_preferences");
  document.body.appendChild(pref_container);
  dispatch_event("after_open_preferences");
}

function hide_preferences() {
  dispatch_event("before_hide_preferences")
  pref_container.style.display = "none";
  dispatch_event("after_hide_preferences");
}

function preferences_button() {
  dispatch_event("before_preferences_button");
  pref_button = document.createElement("span");
  pref_button.id = "pref_button";
  pref_button.classList.add("header_bracket");
  pref_button.innerHTML = `
    [<a>Config</a>]
  `;
  pref_button.addEventListener("click", () => {
    open_preferences();
  });
  header_right.appendChild(pref_button);
  dispatch_event("after_preferences_button");
}

dispatch_event("before_document_loaded");

function DOMContentLoaded() {
  if (document.getElementById("topbar") == null) {
    log("BetterTeddit believes this is an error page. If this is wrong please report a bug.");
    return; // Why bother
  }
  dispatch_event("during_document_loaded");
  var end_totaltime = performance.now();
  var start_runtime = performance.now();
  // START NATIVE ONDOMLOAD FUNCTIONS
  add_style();
  get_current_sub();
  create_header();
  open_preferences();
  hide_preferences();
  preferences_button();
  bottom_link();
  user_tag();
  move_links();
  move_details();
  move_topbar_links();
  custom_style();

  expand_images_button();
  auto_expand_images();
  image_resizer();
  navigator();
  forced_anonymous();
  user_ids();
  hide_points();
  hide_user_flair();
  hide_submission_flair();
  unbranding();
  show_favorites();
  // ENDOF NATIVE ONDOMLOAD FUNCTIONS

  dispatch_event("after_document_loaded");
  dispatch_event("after_startup");

  log("BetterTeddit: "+runtype+". If loading, added eventlistener for complete, else run. Probably cache speed is difference."); //
  var end_runtime = performance.now();
  var totaltime = end_totaltime - start_totaltime;
  var runtime = end_runtime - start_runtime;

  log("BetterTeddit: Wait for DOMContentLoaded: "+totaltime+"ms."); // Parsing of native Teddit HTML is included.
  log("BetterTeddit: After DOMContentLoaded: "+runtime+"ms."); //BetterTeddit modifying runtime performance.
  log("End of Script");
}
var runtype = 0;
if (document.readyState != "loading") {
  runtype = document.readyState;
  //alert(runtype);  //for testing purposes on rare load type interactive/complete.
  DOMContentLoaded();
} else {
  runtype = document.readyState;
  document.addEventListener("DOMContentLoaded", DOMContentLoaded);
}

// ==UserScript==
// @name        Castemoinen
// @namespace   Two Cans and String
// @match       https://twocansandstring.com/
// @grant       none
// @version     0.1.4
// @author      theki
// @description A local newsfeed for Two Cans and String
// @license     GPL-v3.0
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/466460/Castemoinen.user.js
// @updateURL https://update.greasyfork.org/scripts/466460/Castemoinen.meta.js
// ==/UserScript==
/*
    Castemoinen, a newsfeed userscript for TC&S
    Copyright (C) 2023  thekifake

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const Castemoinen               = {};
Castemoinen.VERSION             = "0.1.4";
Castemoinen.MAX_CONTENT_LENGTH  = 130;
Castemoinen.FEED                = { // This should be moved to a separate file but I'm not doing it right now because CORS is a dick
  "title": "Castemoinen feed",
  "entries": [
    {
      "title": "Six Medicinal Plants",
      "tagline": "Plants are cool, don't do drugs, read books instead.",
      "author": "antimony pentafluoride",
      "content": "Goat’s rue is a flowering plant that has its place on this list because it contains the two following compounds of interest to humans: galegine and guanidine, both capable of lowering blood sugar.",      "link": "https://twocansandstring.com/forum/technical/gotopost/1292741/#post1292741",
      "date": "28 May 2023"
    },
    {
      "title": "Slight Discomfort or Vive La Révolution?",
      "tagline": "Has the president made the community revolt?",
      "author": "CreeperReaperX",
      "content": "Now, we all know Acky is the self-proclaimed president, and seems to very unhumbly admit so in any circumstance. However, are we seeing a TwoCans version of the Stanford Prison Experiment?",
      "link": "https://twocansandstring.com/forum/technical/gotopost/1292704/#post1292704",
      "date": "26 May 2023"
    },
    {
      "title": "BUG UNIVERSITY: THE INS AND OUTS",
      "tagline": "new professors? classes? how the heck do they pay for all this?",
      "author": "bug",
      "content": "this article is created to update the people of tcas who are interested in local news. if you are not interested in university, this article may still be relevant to you as bug university is a part of the culture.",
      "link": "https://twocansandstring.com/forum/technical/gotopost/1292658/#post1292658",
      "date": "26 May 2023"
    },
    {
      "title": "Castemoinen update",
      "tagline": "Castemoinen v0.1 alpha is here",
      "author": "hoylecake",
      "content": "The alpha version of Castemoinen is out on Greasyfork <a href=\"https://greasyfork.org/en/scripts/466460-castemoinen\" target=\"blank\">here</a>. Please report bugs on <a href=\"https://twocansandstring.com/forum/technical/12203\" target=\"blank\">the thread</a>.",
      "date": "16 May 2023",
      "dont_trim": true
    }
  ]
};
const placeholder = {
  "title": "Recent, Unbiased Event Not Available",
  "tagline": "I'm sorry, since I was unable to provide you with a recent event, I can not provide a tagline.",
  "author": "user64837",
  "content": "I'm sorry, but as an AI language model, I don't have real-time access to the internet or the ability to browse specific websites like \"twocansandstring.com.\" My responses are generated based on the information available to me up until September 2021. Therefore, I cannot provide you with a recent, unbiased event from that specific website. If you have any other questions or need assistance with a different topic, feel free to ask!",
  "date": "16 May 2023",
  "link": "https://twocansandstring.com/forum/technical/gotopost/1291636/#post1291636"
};
//
Castemoinen.IsMinimized = false;
//
Castemoinen.UI          = {};
Castemoinen.UI.Window   = null;
Castemoinen.UI.Header   = null;
Castemoinen.UI.Content  = null;
Castemoinen.UI.Footer   = null;
/*          UI functions          */
Castemoinen.AddButton = function(left, right, tb, icon, onclick, classes) {
  const _b = $(document.createElement("a"));
  _b.html(icon);
  _b.attr("href", "javascript:void(0)");
  _b.addClass("caste-btn");
  if (classes)  _b.addClass(classes);
  if (left)     _b.css("left", left);
  if (right)    _b.css("right", right)
  _b.on("click", function() {
    onclick(_b);
  });
  if (tb === 0) Castemoinen.UI.Header.append(_b);
  else if (tb === 1) Castemoinen.UI.Footer.append(_b);
  else throw new Error("tb value in AddButton function call should be either 0 or 1");
  return _b;
};
Castemoinen.AddEntry = function(e) {
  const _e = $(document.createElement("div"));
  _e.html(`<h4>${e.link ? `<a href="${e.link}" target="_parent">${e.title}</a>` : e.title}</h4>
<h5><em>${e.tagline}</em></h5>
<h6>By <a href="https://twocansandstring.com/users/${e.author.replace(/\s/g, "")}" target="_blank">${e.author}</a> on ${e.date}</h6>
<span>${e.content.length > Castemoinen.MAX_CONTENT_LENGTH && !e.dont_trim ? e.content.substring(0, 150) + "..." : e.content}</span>`);
  Castemoinen.UI.Content.append(_e);
}
Castemoinen.Minimize = function() {
  Castemoinen.UI.Window.addClass("caste-min");
  Castemoinen.UI.Window.removeClass("caste-max");
  $("#caste-content").addClass("caste-hide");
  $("#caste-footer").addClass("caste-hide");
  $(".caste-btn:not(.caste-donthide)").addClass("caste-hide");
  Castemoinen.IsMinimized = true;
};
Castemoinen.Maximize = function() {
  Castemoinen.UI.Window.removeClass("caste-min");
  Castemoinen.UI.Window.addClass("caste-max");
  $("#caste-content").removeClass("caste-hide");
  $("#caste-footer").removeClass("caste-hide");
  $(".caste-btn:not(.caste-donthide)").removeClass("caste-hide");
  Castemoinen.IsMinimized = false;
};
/*          Main functions          */
Castemoinen._init      = function() {
  // Add styling
  const style = $(document.createElement("style"));
  style.attr("id", "caste-styling");
  style.html(`
  #caste-mainwindow {
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 10px;
    font-size: 10pt;
    text-align: left;
    z-index: 99;
    resize: both;
  }
  #caste-header {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    height: 15%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    text-shadow: 1px 1px 2px black;
  }
  #caste-content {
    width: 100%;
    height: 70%;
    overflow-x: hidden;
    overflow-y: auto;
    word-wrap: break-word;
  }
  #caste-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 15%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    text-shadow: 1px 1px 2px black;
  }
  .caste-btn {
    position: absolute;
  }
  .caste-btn:link, .caste-btn:visited {
    color: white;
  }
  .caste-max {
    width: 30%;
    height: 20%;
    padding: 0;
    background-color: rgba(187, 187, 187, 0.95);
    overflow: hidden;
  }
  .caste-min {
    width: fit-content;
    height: fit-content;
    padding: 0.5em;
    background-color: rgba(0, 0, 0, 0);
  }
  .caste-hide {
    display: none;
    visibility: hidden;
    opacity: 0;
  }
  `);
  $("head").append(style);
  // Make our main window
  const _w = $(document.createElement("div"));
  _w.attr("id", "caste-mainwindow");
  _w.addClass("caste-max")
  $("body").append(_w);
  // Add the header
  const _h = $(document.createElement("div"));
  _h.attr("id", "caste-header");
  _h.html("Castemoinen (v"+Castemoinen.VERSION+")")
  _w.append(_h);
  // Content div
  const _c = $(document.createElement("div"));
  _c.attr("id", "caste-content");
  _w.append(_c)
  // Add the footer
  const _f = $(document.createElement("div"));
  _f.attr("id", "caste-footer");
  _f.html("0 entries loaded");
  _w.append(_f);
  //
  Castemoinen.UI.Window   = _w;
  Castemoinen.UI.Header   = _h;
  Castemoinen.UI.Content  = _c;
  Castemoinen.UI.Footer   = _f;
  // Buttons
  Castemoinen.AddButton("0.5em", null, 0, "&ndash;", function(b) {
    if (Castemoinen.IsMinimized) {
      b.html("&ndash;");
      b.css("left", "0.5em");
      b.css("margin-left", "0");
      b.css("color", "white");
      b.css("text-shadow", "inherit");
      Castemoinen.Maximize();
    } else {
      b.html("+");
      b.css("left", "auto");
      b.css("margin-left", "0.5em");
      b.css("color", "black");
      b.css("text-shadow", "none");
      Castemoinen.Minimize();
    }
  }, ["caste-donthide"]);
  Castemoinen.AddButton(null, "0.5em", 1, "+", function(b) {
    alert("Add");
  })
  // Parse the feed
  Castemoinen.FEED.entries.forEach(function(entry, index) {
    Castemoinen.AddEntry(entry);
    _f.html(`${index + 1} entr${index !== 1 ? "ies" : "y"} loaded`);
  });
  _f.html(`${Castemoinen.FEED.entries.length} entr${Castemoinen.FEED.entries.length !== 1 ? "ies" : "y"} loaded from ${Castemoinen.FEED.entries[Castemoinen.FEED.entries.length - 1].date} to ${Castemoinen.FEED.entries[0].date}`);
};

$(function() {
  // Initialise
  Castemoinen._init();
  console.log(`         .
   ___  _/_   , _ , _   , __
 .'   \`  |    |' \`|' \`. |'  \`.
 |       |    |   |   | |    |
  \`._.'  \\__/ /   '   / /    |

  Castemoinen v${Castemoinen.VERSION} has been loaded
  Here is its object for debugging purposes:`);
  console.log(Castemoinen);
});
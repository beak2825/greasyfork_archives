// ==UserScript==
// @name         Hacker Exerience Aids Beta
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      https://*hackerexperience.com/*
// @exclude      https://*hackerexperience.com/hackui
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19255/Hacker%20Exerience%20Aids%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/19255/Hacker%20Exerience%20Aids%20Beta.meta.js
// ==/UserScript==

var li = document.createElement("LI");
li.innerHTML = "<a href=\'javascript: void(0);\'><i class=\'fa fa-inverse fa-hacked\'></i> <span>Hack</span></a><style>.fa-hacked:before { content:\"\\f022\"; }</style>";

li.onclick = function(event) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(event) {
    if (req.readyState === 4 && Math.floor(req.status / 100) === 2) {
      console.info("Recieved Document");
      var parsed = JSON.parse(req.responseText);
      var content = parsed.files["hxphack.js"].content;
      var win = window.open("about:blank", "_blank", "directories=0, fullscreen=1, menubar=0, resizable=0, status=0, titlebar=0, toolbar=0, scrollbars=1, width=400, height=500");
      win.document.open();
      win.document.write(content);
      win.document.close();
    }
  };
  req.open("GET", "https://api.github.com/gists/7fb5c8e8e83a8e443f33603a2e1199ee");
  req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  req.send();
};

try {
  document.getElementById("sidebar").children[1].appendChild(li);
  if (GM_getValue("firsttime") !== "false") {
    scrollTo(0, 10000);
    document.body.style.overflow = "hidden";
    var div = document.createElement("DIV");
    div.style.cssText = "position: fixed; top: 557px; left: 250px; height: 43px; background-color: black; opacity: 0.8; width: 290px; font-size: 20px; color: white;";

    var span = document.createElement("span");
    span.innerHTML = "&nbsp;&lt; Click to hack!";
    span.style.cssText = "vertical-align: middle; font-size: 29px; position: absolute; top: 10.75px; font-family: monospace; color: #33FF33; font-weight: bold; opacity: 1;";

    li.onclick = function(event) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function(event) {
        if (req.readyState === 4 && Math.floor(req.status / 100) === 2) {
          console.info("Recieved Document");
          var parsed = JSON.parse(req.responseText);
          var content = parsed.files["hxphack.js"].content;
          var win = window.open("about:blank", "_blank", "directories=0, fullscreen=1, menubar=0, resizable=0, status=0, titlebar=0, toolbar=0, scrollbars=1, width=400, height=500");
          win.document.open();
          win.document.write(content);
          win.document.close();
        }
      };
      req.open("GET", "https://api.github.com/gists/7fb5c8e8e83a8e443f33603a2e1199ee");
      req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      req.send();
      span.innerHTML = "&nbsp;Great job!";
      GM_setValue("firsttime", "false");
      setTimeout(function() { span.innerHTML = "&nbsp;Hack the world!"; }, 1000);
      setTimeout(function() { location.reload(); }, 2500);
    };

    div.appendChild(span);
    document.body.appendChild(div);
  }
} catch (error) {}
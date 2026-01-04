// ==UserScript==
// @name           Bounded Bikeshed
// @name:nl        Bounded Bikeshed
// @description    Focus on the comments you find most interesting.
// @description:nl Focus op de reacties die jij het meest interessant vindt.
// @author         Tim Kuijsten
// @license        ISC
// @namespace      netsend.nl
// @homepageURL    https://github.com/timkuijsten/BoundedBikeshed
// @icon           https://netsend.nl/bb-128.png
// @match          https://news.ycombinator.com/item?id=*
// @match          https://lobste.rs/s/*
// @match          https://tweakers.net/*/*
// @grant          none
// @version        0.8.0
// @downloadURL https://update.greasyfork.org/scripts/473045/Bounded%20Bikeshed.user.js
// @updateURL https://update.greasyfork.org/scripts/473045/Bounded%20Bikeshed.meta.js
// ==/UserScript==

// Copyright (C) 2023 Tim Kuijsten
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

(function() {
  "use strict";

  var activationThreshold = 10;
  var showSubcommentCount = true;
  var showDescendantCount = true; // default userscript to showing the number of descendants

  var showall = [];

  // Create a string that shows the number of subcomments and optionally the number of descendants in English.
  // nrchildnodes it the number of child nodes, nrdescendants is the total number of descendants (including the number
  // of child nodes).
  function createCommentString(nrchildnodes, nrdescendants) {
    var cstr = "comments";
    if (nrchildnodes === 1) {
      cstr = "comment";
    }

    if (!showSubcommentCount) {
      return cstr;
    }

    var r = nrchildnodes;
    if (showDescendantCount && (nrdescendants - nrchildnodes) > 0) {
      r += "+" + (nrdescendants - nrchildnodes);
      cstr = "comments";
    }
    return r + " " + cstr;
  }

  // returns the number of descendants of "comment"
  function hidesubcommentsLobsters(comment) {
    var descendants = 0;
    var subcomments = comment.querySelectorAll(":scope > ol.comments > li.comments_subtree");
    if (subcomments.length == 0) {
      return descendants;
    }

    subcomments.forEach(function(subcomment) {
      descendants++;
      descendants += hidesubcommentsLobsters(subcomment);
    });

    var el = document.createElement("span");
    el.textContent = "| ";
    var subel = document.createElement("span");
    subel.style.cursor = "pointer";
    subel.textContent = createCommentString(subcomments.length, descendants);

    el.appendChild(subel);
    comment.querySelector(".details .byline").appendChild(el);

    var subcommentcontainer = comment.querySelector(":scope > ol.comments");

    (function(scc) {
      var visible = false;
      subel.addEventListener("click", function() {
        if (visible) {
          scc.remove();
        } else {
          comment.appendChild(scc);
        }
        visible = !visible;
      });

      showall.push(function() {
        if (!visible) {
          comment.appendChild(scc);
          visible = true;
        }
      });
    })(subcommentcontainer);

    subcommentcontainer.remove();

    return descendants;
  }

  // returns the number of descendants of "comment"
  function hidesubcommentsTweakers(comment) {
    var descendants = 0;
    var subcomments = comment.querySelectorAll(":scope > twk-reaction");
    if (subcomments.length == 0) {
      return descendants;
    }

    subcomments.forEach(function(subcomment) {
      subcomment.style.display = "none";
      descendants++;
      descendants += hidesubcommentsTweakers(subcomment);
    });

    // Depending on the user selected moderation filter, some comments are collapsed and have no footer until it is
    // fetched with a separate GET after the user unfolds the comment. This also sometimes happens when connecting from
    // the Tor network.
    var footer = comment.querySelector(":scope > .reactieBody > .reactieFooter");
    if (footer == null) {
      footer = document.createElement("div");
      footer.classList.add("reactieFooter");
      comment.querySelector(".reactieBody").append(footer);
    }

    var el = document.createElement("a");
    el.style.cursor = "pointer";
    el.style.marginRight = "12px";
    el.textContent = "Reacties";
    if (showSubcommentCount) {
      el.textContent += " (" + subcomments.length;
      if (showDescendantCount && descendants - subcomments.length > 0) {
        el.textContent += "+" + (descendants - subcomments.length);
      }
      el.textContent += ")";
    }

    footer.prepend(el);

    (function togglesub(scc) {
      var visible = false;
      el.addEventListener("click", function() {
        if (visible) {
          scc.querySelectorAll(":scope > twk-reaction").forEach(function(el) {
            el.style.display = "none";
          });
        } else {
          scc.querySelectorAll(":scope > twk-reaction").forEach(function(el) {
            el.style.display = "";
          });
        }
        visible = !visible;
      });

      showall.push(function() {
        if (!visible) {
          scc.querySelectorAll(":scope > twk-reaction").forEach(function(el) {
            el.style.display = "";
          });
          visible = true;
        }
      });
    })(comment);

    return descendants;
  }

  function HNaddbutton(comment, subgroup, descendants) {
    var el = document.createElement("span");
    el.textContent = "| ";
    var subel = document.createElement("span");
    subel.style.cursor = "pointer";
    subel.textContent = createCommentString(subgroup.length, descendants);

    el.append(subel);
    comment.querySelector("span.comhead").append(el);
    (function togglesub(sg) {
      subel.addEventListener("click", function() {
        var nextcomment = sg[0];
        if (nextcomment.classList.contains("noshow")) {
          // only show direct sub-comments
          sg.forEach(function(el) {
            el.classList.remove("noshow");
          });
        } else {
          // collapse all
          for (var i = descendants; i > 0; i--) {
            nextcomment.classList.add("noshow");
            nextcomment = nextcomment.nextElementSibling;
          }
        }
      });
    })(subgroup);
  }
  // returns the number of descendants of "comment"
  function hidesubcommentsHN(comment) {
    var indent = Number(comment.querySelector("td.ind").getAttribute("indent"));
    var curindent;
    var nextcomment = comment.nextElementSibling;
    var subgroup = [];
    var descendants = 0;
    while (nextcomment) {
      // if not a descendant, return
      // if not a child, recurse
      // else add to group of childs
      var tdind = nextcomment.querySelector("td.ind");
      if (tdind == null) {
        if (subgroup.length > 0) {
          HNaddbutton(comment, subgroup, descendants);
        }
        return descendants;
      }
      curindent = Number(tdind.getAttribute("indent"));
      if (curindent <= indent) {
        if (subgroup.length > 0) {
          HNaddbutton(comment, subgroup, descendants);
        }
        return descendants;
      }

      // curindent > indent

      nextcomment.classList.add("noshow");

      if (curindent > indent + 1) {
        var r = hidesubcommentsHN(nextcomment.previousElementSibling);
        while (r--) {
          nextcomment = nextcomment.nextElementSibling;
          descendants++;
        }
        continue;
      }

      // curindent == indent + 1
      subgroup.push(nextcomment);

      nextcomment = nextcomment.nextElementSibling;
      descendants++;
    }
    if (subgroup.length > 0) {
      HNaddbutton(comment, subgroup, descendants);
    }
    return descendants;
  }

  function main() {
    var allcomments;
    switch (window.location.hostname) {
    case "news.ycombinator.com":
      allcomments = document.querySelectorAll("table.comment-tree tr.comtr");
      if (allcomments.length >= activationThreshold) {
        allcomments.forEach(function(comment) {
          if (comment.querySelector("td[indent='0']")) {
            hidesubcommentsHN(comment);
          }
        });

        showall.push(function() {
          allcomments.forEach(function(comment) {
            comment.classList.remove("noshow");
          });
        });
      }
      break;
    case "lobste.rs":
      allcomments = document.querySelectorAll("body > * > ol.comments > li.comments_subtree > ol.comments li.comments_subtree");
      if (allcomments.length >= activationThreshold) {
        document.querySelectorAll("body > * > ol.comments > li.comments_subtree > ol.comments > li.comments_subtree").forEach(hidesubcommentsLobsters);
      }
      break;
    case "tweakers.net":
      allcomments = document.querySelectorAll("twk-reaction");
      if (allcomments.length >= activationThreshold) {
        document.querySelectorAll("#reactieContainer > twk-reaction").forEach(hidesubcommentsTweakers);
      }
      break;
    }
  }

  // check if we're running as an extension for firefox or chrome with stored preferences, or as a userscript
  var b;
  if (typeof browser !== "undefined") {
    // firefox
    b = browser;
  } else if (typeof chrome !== "undefined") {
    // chrome
    b = chrome;
  }

  if (b != null) {
    var f1 = b.storage.sync.get("activationThreshold").then(function(res) {
      if (Object.hasOwn(res, "activationThreshold") && typeof res.activationThreshold === "number") {
        activationThreshold = res.activationThreshold;
      }
    });
    var f2 = b.storage.sync.get("showSubcommentCount").then(function(res) {
      if (Object.hasOwn(res, "showSubcommentCount") && typeof res.showSubcommentCount === "boolean") {
        showSubcommentCount = res.showSubcommentCount;
      }
    });
    var f3 = b.storage.sync.get("showDescendantCount").then(function(res) {
      if (Object.hasOwn(res, "showDescendantCount") && typeof res.showDescendantCount === "boolean") {
        showDescendantCount = res.showDescendantCount;
      } else {
        showDescendantCount = true; // enable by default when executing as an extension
      }
    });
    Promise.all([ f1, f2, f3 ]).then(main).catch(function(err) {
      console.error(err);
    });

    b.runtime.onMessage.addListener(function() {
      for (let i = 0; i < showall.length; i++) {
        showall[i]();
      }
    });
  } else {
    main();
  }
})();

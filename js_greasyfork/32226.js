// ==UserScript==
// @name        Reddit User/Subreddit/Domain Filter
// @namespace   RedditUserSubDomainFilter
// @version     1.0.3
// @license     GNU AGPLv3
// @description Filter Reddit posts based on the user, subreddit, domain, or post flair name.
// @author      jcunews
// @include     https://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32226/Reddit%20UserSubredditDomain%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/32226/Reddit%20UserSubredditDomain%20Filter.meta.js
// ==/UserScript==

var filterFlair  = JSON.parse(localStorage.filterFlair || "[]"),
    filterUser   = JSON.parse(localStorage.filterUser || "[]"),
    filterSub    = JSON.parse(localStorage.filterSub || "[]"),
    filterDomain = JSON.parse(localStorage.filterDomain || "[]"),
    posts, flair, user, sub, domain, buttonTemplate, button, match, filtered;

function doFilter(dontHide) {
  posts = Array.prototype.slice.call(document.querySelectorAll(".thing"));
  posts.forEach(function(post,i) {
    filtered = false;
    flair = post.querySelector(".linkflairlabel");
    if (flair) {
      match = filterFlair.indexOf(flair.title) >= 0;
      filtered = filtered || !!match;
      button = flair.nextSibling;
      if (!button || !button.getAttribute || !button.getAttribute("type")) {
        button = buttonTemplate.cloneNode(true);
        button.title = "Filter posts with this flair (CTRL+Click to undo)";
        button.style.marginLeft = "";
        button.setAttribute("type", "flair");
        button.setAttribute("value", flair.title);
        button.onclick = setFilter;
        flair.parentNode.insertBefore(button, flair.nextSibling);
      }
      button.style.background = match ? "#b0b" : "#c00";
    }
    user = post.querySelector(".author");
    if (user) {
      match = filterUser.indexOf(user.textContent) >= 0;
      filtered = filtered || !!match;
      button = user.nextSibling;
      if (!button || !button.getAttribute || !button.getAttribute("type")) {
        button = buttonTemplate.cloneNode(true);
        button.title = "Filter posts from this user (CTRL+Click to undo)";
        button.style.marginLeft = "";
        button.setAttribute("type", "user");
        button.setAttribute("value", user.textContent);
        button.onclick = setFilter;
        user.parentNode.insertBefore(button, user.nextSibling);
      }
      button.style.background = match ? "#b0b" : "#c00";
    }
    sub = post.querySelector(".subreddit");
    if (sub) {
      match = filterSub.indexOf(sub.textContent.match(/\/?(.*)/)[1]) >= 0;
      filtered = filtered || !!match;
      button = sub.nextSibling;
      if (!button || !button.getAttribute || !button.getAttribute("type")) {
        button = buttonTemplate.cloneNode(true);
        button.title = "Filter posts from this subreddit (CTRL+Click to undo)";
        button.setAttribute("type", "sub");
        button.setAttribute("value", sub.textContent.match(/\/?(.*)/)[1]);
        button.onclick = setFilter;
        sub.parentNode.insertBefore(button, sub.nextSibling);
      }
      button.style.background = match ? "#b0b" : "#c00";
    }
    domain = post.querySelector(".domain");
    if (domain) {
      match = filterDomain.indexOf(domain.textContent.match(/\((.*)\)/)[1]) >= 0;
      filtered = filtered || !!match;
      button = domain.nextSibling;
      if (!button || !button.getAttribute || !button.getAttribute("type")) {
        button = buttonTemplate.cloneNode(true);
        button.title = "Filter posts from this domain (CTRL+Click to undo)";
        button.setAttribute("type", "domain");
        button.setAttribute("value", domain.textContent.match(/\((.*)\)/)[1]);
        button.onclick = setFilter;
        domain.parentNode.insertBefore(button, domain.nextSibling);
      }
      button.style.background = match ? "#b0b" : "#c00";
    }
    if (filtered) {
      if (!dontHide) {
        post.setAttribute("filtered", "1");
        post.style.display = "none";
      }
    } else {
      post.removeAttribute("filtered");
      post.style.display = "";
    }
  });
}

function setFilter(ev) {
  var value, i;
  button = ev.target;
  value = button.getAttribute("value");
  if (!ev.ctrlKey) {
    //add filter
    switch (button.getAttribute("type")) {
      case "flair":
        if (filterFlair.indexOf(value) < 0) {
          filterFlair.push(value);
          localStorage.filterFlair = JSON.stringify(filterFlair);
        }
        break;
      case "user":
        if (filterUser.indexOf(value) < 0) {
          filterUser.push(value);
          localStorage.filterUser = JSON.stringify(filterUser);
        }
        break;
      case "sub":
        if (filterSub.indexOf(value) < 0) {
          filterSub.push(value);
          localStorage.filterSub = JSON.stringify(filterSub);
        }
        break;
      default: //domain
        if (filterDomain.indexOf(value) < 0) {
          filterDomain.push(value);
          localStorage.filterDomain = JSON.stringify(filterDomain);
        }
    }
  } else {
    //remove filter
    switch (button.getAttribute("type")) {
      case "flair":
        i = filterFlair.indexOf(value);
        if (i >= 0) {
          filterFlair.splice(i, 1);
          localStorage.filterFlair = JSON.stringify(filterFlair);
        }
        break;
      case "user":
        i = filterUser.indexOf(value);
        if (i >= 0) {
          filterUser.splice(i, 1);
          localStorage.filterUser = JSON.stringify(filterUser);
        }
        break;
      case "sub":
        i = filterSub.indexOf(value);
        if (i >= 0) {
          filterSub.splice(i, 1);
          localStorage.filterSub = JSON.stringify(filterSub);
        }
        break;
      default: //domain
        i = filterDomain.indexOf(value);
        if (i >= 0) {
          filterDomain.splice(i, 1);
          localStorage.filterDomain = JSON.stringify(filterDomain);
        }
    }
  }
  doFilter(ev.ctrlKey);
}

function showFiltered() {
  posts = Array.prototype.slice.call(document.querySelectorAll(".thing[filtered]"));
  posts.forEach(function(post) {
    post.style.display = "";
  });
}

function addLink(ele) {
  ele.appendChild(button);
  //monitor dynamic post list
  if (window.siteTable_organic) {
    (new MutationObserver(function(records) {
      var newNodes = 0;
      records.forEach(function(record) {
        if (record.addedNodes) newNodes += record.addedNodes.length;
      });
      if (newNodes) doFilter();
    })).observe(window.siteTable_organic, { childList: true });
  }
}

if (!document.querySelector(".siteTable")) {
  //create button template
  buttonTemplate = document.createElement("DIV");
  buttonTemplate.textContent = "X";
  buttonTemplate.style.cssText = "\
display:inline-block; margin-left:1ex; border-radius:4px; padding:0 .7ex; \
background:#c00; text-align:center; line-height:normal; font-size: x-small; \
font-weight:bold; color:#fff; cursor:pointer";
  //filter posts
  doFilter();
  //add link to show all filtered posts
  button = document.createElement("A");
  button.textContent = "Show Filtered";
  button.title = "Temporarily show filtered posts";
  button.style.marginLeft = "2ex";
  button.href = "javascript:void(0)";
  button.onclick = showFiltered;
  if (match = document.querySelector(".tabmenu")) { //old layout
    addLink(match);
  } else if (match = document.querySelector(".gXMvOl")) { //new layout
    setTimeout(addLink, 50, match);
  }
}

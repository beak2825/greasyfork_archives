// ==UserScript==
// @name         Add Reddit Post Report Link For Mods
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      GNU AGPLv3
// @description  Add a report link on each Reddit post (for Mods). The report link will report the post using "Other" as the reason and without any additional comment. This is roughly the same as the old style of the report link. i.e. without any menus.
// @author       jcunews
// @match        *://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40598/Add%20Reddit%20Post%20Report%20Link%20For%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/40598/Add%20Reddit%20Post%20Report%20Link%20For%20Mods.meta.js
// ==/UserScript==

//Time delay before reshowing the report link after the previous report attemp has failed (after showing the "report failed" message).
var linkReshowDelay = 3000; //in milliseconds. 1000ms = 1 second.

(function(reportLink) {
  function reportLinkClick(ev, link, tid, xhr) {
    link = this;
    tid = $(link).thing()[0].id.substr(6);
    xhr = new XMLHttpRequest();
    xhr.onload = function(resp, z) {
      try {
        resp = JSON.parse(xhr.responseText);
        if (resp.success) {
          link.nextElementSibling.innerHTML = "reported";
        } else throw 0;
      } catch(z) {
        xhr.onerror();
      }
    };
    xhr.onerror = function() {
      link.nextElementSibling = "report failed";
      setTimeout(function(link) {
        link.style.display = "";
        link.nextElementSibling.innerHTML = "";
      }, linkReshowDelay, link);
    };
    xhr.open("POST", "https://www.reddit.com/api/report", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send("thing_id=" + tid + "&reason=other&other_reason=&id=%23report-action-form&r=" + r.config.post_site + "&uh=" + r.config.modhash + "&renderstyle=html");
    link.style.display = "none";
    link.nextElementSibling.innerHTML = "reporting...";
    ev.preventDefault();
  }
  reportLink = document.createElement("LI");
  reportLink.innerHTML = '<a href="javascript:void(0)">report</a><span></span>';
  document.querySelectorAll(".thing .lock-button").forEach(
    function(ele, linkContainer) {
      linkContainer = reportLink.cloneNode(true);
      linkContainer.firstElementChild.addEventListener("click", reportLinkClick);
      ele = ele.parentNode;
      ele.parentNode.insertBefore(linkContainer, ele.parentNode.querySelector(".crosspost-button").nextElementSibling);
    }
  );
})();

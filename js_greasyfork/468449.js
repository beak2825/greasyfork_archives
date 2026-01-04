// ==UserScript==
// @name        kbin collapsible comments
// @match       https://kbin.social/*
// @match       https://fedia.io/*
// @match       https://karab.in/*
// @description Collapse and hide comments on kbin.social
// @version     1.2.1
// @namespace https://greasyfork.org/users/1096641
// @downloadURL https://update.greasyfork.org/scripts/468449/kbin%20collapsible%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/468449/kbin%20collapsible%20comments.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // This function will run for each comment block
  function processComment(commentBlock, level) {
    // Find the header, figure, footer, and content within this comment block
    var header = commentBlock.querySelector("header");
    var figure = commentBlock.querySelector("figure");
    var footer = commentBlock.querySelector("footer");
    var content = commentBlock.querySelector(".content");
    var menu = footer.querySelector("menu");

    // Create the collapse/expand button
    var button = document.createElement("a");
    button.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    button.style.cursor = "pointer";
    button.style.marginLeft = "1rem";

    // Add the button to the header
    header.appendChild(button);

    // Set a click event for the collapse/expand button
    button.addEventListener("click", function () {
      if (content.style.display === "none") {
        content.style.display = "";
        footer.style.display = "";
        figure.style.display = "";
        commentBlock.style.height = "";
        button.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';

        // Find all following comment blocks
        var followingComments = commentBlock.nextElementSibling;
        while (
          followingComments &&
          followingComments.className.match(/comment-level--(\d)/)[1] > level
        ) {
          followingComments.style.display = "";
          collapseChildrenLink.innerHTML = "hide replies";
          followingComments = followingComments.nextElementSibling;
        }
      } else {
        content.style.display = "none";
        footer.style.display = "none";
        figure.style.display = "none";
        commentBlock.style.height = "40px";
        commentBlock.style.paddingTop = "0.53rem";
        button.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';

        // Find all following comment blocks
        var followingComments = commentBlock.nextElementSibling;
        while (
          followingComments &&
          followingComments.className.match(/comment-level--(\d)/)[1] > level
        ) {
          followingComments.style.display = "none";
          collapseChildrenLink.innerHTML = "show replies";
          followingComments = followingComments.nextElementSibling;
        }
      }
    });

    // Check if this comment has any children
    var nextComment = commentBlock.nextElementSibling;
    if (
      nextComment &&
      nextComment.classList.contains("comment-level--" + (level + 1))
    ) {
      // Create the collapse children button
      var collapseChildrenButton = document.createElement("li");
      var collapseChildrenLink = document.createElement("button");
      collapseChildrenLink.class = "stretched-link";
      collapseChildrenLink.innerHTML = "hide replies";
      collapseChildrenLink.style.cursor = "pointer";
      collapseChildrenButton.appendChild(collapseChildrenLink);

      // Add the button to the menu in the footer
      menu.appendChild(collapseChildrenButton);

      // Set a click event for the collapse children button
      collapseChildrenLink.addEventListener("click", function () {
        // Find all following comment blocks
        var followingComments = commentBlock.nextElementSibling;
        while (
          followingComments &&
          followingComments.className.match(/comment-level--(\d)/)[1] > level
        ) {
          if (followingComments.style.display === "none") {
            followingComments.style.display = "";
            collapseChildrenLink.innerHTML = "hide replies";
          } else {
            followingComments.style.display = "none";
            collapseChildrenLink.innerHTML = "show replies";
          }
          followingComments = followingComments.nextElementSibling;
        }
      });
    }
  }

  // Find all comment blocks on the page
  var commentBlocks = document.querySelectorAll("blockquote.entry-comment");

  // Process each comment block
  for (var i = 0; i < commentBlocks.length; i++) {
    var level = parseInt(
      commentBlocks[i].className.match(/comment-level--(\d)/)[1]
    );
    processComment(commentBlocks[i], level);
  }
})();

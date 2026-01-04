// ==UserScript==
// @name         [Lemmy] Scroll to parent comment
// @version      0.7
// @license      GPL-3.0
// @description  Adds a scroll to parent comment button to nested comments when clicking the more (three dots) button on a nested comment, and a button to the parent comment to scroll back to that comment from the parent (also after clicking the parent comment more button).
// @author       blackvoid
// @match        <your instance hostname>/* (e.g. https://lemmy.world/*)
// @grant        none
// @namespace https://greasyfork.org/users/1149746
// @downloadURL https://update.greasyfork.org/scripts/472942/%5BLemmy%5D%20Scroll%20to%20parent%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/472942/%5BLemmy%5D%20Scroll%20to%20parent%20comment.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // The SVG path for the reply icon that is used also for the go to parent
  // and the go back to child buttons that this script adds.
  const path =
    '<path d="M19 16.685c0 0-2.225-9.732-11-9.732v-3.984l-7 6.573 7 6.69v-4.357c4.763-0.001 8.516 0.421 11 4.81z"></path>';

  // Creates the button with an icon, depending on the type (go to parent,
  // go back to child)
  function createButton(type) {
    let label, rotate;

    // We reuse the reply button icon for our new icons
    if (type === "parent") {
      rotate = "70deg";
      label = "parent";
    } else {
      rotate = "-70deg";
      label = "back to child";
    }

    const node = document.createElement("button");
    node.classList = `btn btn-link btn-animate text-muted`;
    
    // Content for the on hover tooltip.
    // Doesn't always work for the back to child button since tippy
    // is called only on pressing the more button.
    // If you clicked more on the parent before, there will be no tooltip
    // on the newly added back to child button.
    node.setAttribute("data-tippy-content", label);

    node.setAttribute("aria-label", label);
    node.innerHTML = `<svg viewBox="0 0 20 20" style="transform: rotateZ(${rotate});" class="icon icon-inline">${path}<div class="visually-hidden"><title>parent</title></div></svg></button>`;
    return node;
  }

  // Scroll back to the child comment with a button that appears in the list of 
  // more controls if go to parent button was clicked.
  function addBackButton(node) {
    const moreButton = node.querySelector(".btn-more");
    const button = createButton("child");

    // Scroll back to the child comment on click and remove the button
    button.addEventListener("click", () => {
      node.childComment.scrollIntoView();
      button.remove();
      node.removeAttribute("data-has-back-button");
    });

    if (moreButton) {
      // The attribute prevents adding multiple back to child buttons
      if (node.getAttribute("data-has-back-button")) return;
      node.setAttribute("data-has-back-button", 1);
      
      // Make it appear on clicking the more (dots) button
      moreButton.addEventListener("click", () => {
        appendToMoreControls(moreButton, button);
      });
    } else {
      // If it was already clicked (and therefore disappeared)
      const controls = node.querySelector("div:nth-of-type(3)");
      const oldButton = node.querySelector(".go-to-child");
      if (oldButton) {
        controls.replaceChild(button, oldButton);
      } else {
        controls.appendChild(button);
      }
    }
  }

  // Append the button to the list of additional controls on a comment,
  // after clicking the more (dots) button
  function appendToMoreControls(moreButton, button) {
    moreButton.parentNode.appendChild(button);
  }

  // Observes the whole document because lemmy-ui is a SPA and once
  // the document is loaded, it never reloads on navigation
  const html = document.querySelector("html");
  const mutationObserver = new MutationObserver(appendGoToParent);
  mutationObserver.observe(html, { childList: true, subtree: true });

  // Keep track of visited nodes. Probably slower when only processing
  // addedNodes from mutation record, but much less complex.
  const visited = new WeakSet();

  // Invoke the observer handler immediately
  // for posts opened via a deep link (SSRed)
  appendGoToParent();

  function appendGoToParent() {
    // The more (dots) buttons that we're going to add click listeners to
    const moreButtons = document.querySelectorAll(
      "div .comment .comment .btn-more"
    );

    // Process the more buttons - add click listener and attach the Parent buttons
    Array.from(moreButtons).map(moreButton => {
      // Do not attach clicks to a comment more than once
      if (visited.has(moreButton)) return;

      // Add the element into the set of visited nodes
      visited.add(moreButton);

      // Get the parent node, 6 levels up from the child's more button,
      // so we can later scroll to it if the Parent button is pressed
      let parentComment = moreButton;
      Array(6)
        .fill(true)
        .map(() => {
          parentComment = parentComment.parentNode;
        });
      parentComment = parentComment.children[0];

      // Listen to clicks on the more (dots) button
      moreButton.addEventListener("click", () => {
        // This comment to be scrolled back to from the parent
        // when clicking the back to child button
        const thisComment = moreButton.parentNode.parentNode;

        // Create and append the parent button to the list of additional 
        // controls that appear upon clicking the dots button
        const node = createButton("parent");
        node.addEventListener("click", () => {
          parentComment.scrollIntoView();
          parentComment.childComment = thisComment;
          // Also add the back to child button
          addBackButton(parentComment);
        });

        appendToMoreControls(moreButton, node);
      });
    });
  }
})();

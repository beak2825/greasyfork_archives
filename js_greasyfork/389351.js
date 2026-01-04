// ==UserScript==
// @name         Trello Syntax Highlight (fixed)
// @namespace    https://gist.github.com/sudokai
// @version      2019.09.26.1
// @description  Github syntax highlighting for Trello code blocks
// @author       AsyncWizard (https://github.com/AsyncWizard>), sudokai (https://github.com/sudokai)
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js
// @resource     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389351/Trello%20Syntax%20Highlight%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389351/Trello%20Syntax%20Highlight%20%28fixed%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function highlight(md) {
    if (!md.hasChildNodes() || md.getAttribute("card-highlighted") === "true") {
      return;
    }
    md.setAttribute("card-highlighted", "true");

    /**
        Démarrage de la procédure d'highlight

        Starting highlighting procedure
    **/
    let preLngList = [];

    /*
        On récupère la liste des code-blocks du markdown pour la mettre dans le tableau:
        On ne tient pas compte des code-blocks de fermeture
        On utilise deux fonctions afin de gérer le codeblock du début de message
    */

    /*
        We retrieve the list of code-blocks from the markdown to put it in the array:
        The closing code-block are not taken into consideration
        Two functions are used to manage the code-block of the beginning of the message
    */
    let mdContent;
    if (md.classList.contains("current")) {
      mdContent = $(md).data("unmarkeddown");
    } else {
      // it's a comment
      const mdContentHandle = md.parentElement.querySelector(".js-text")
      mdContent = mdContentHandle ? mdContentHandle.value : "";
    }

    mdContent.replace(
      /^[\r\n]*```([A-Za-z0-9+\-\.]+)?\r?\n((.|\r|\n|\s)+?)```/g,
      function(fouded, lng) {
        preLngList.push(lng);
      }
    );
    mdContent.replace(
      /\r?\n\r?\n```([A-Za-z0-9+\-\.]+)?\r?\n((.|\r|\n|\s)+?)```/g,
      function(fouded, lng) {
        preLngList.push(lng);
      }
    );

    //Adding code tag class with good highlighter/language class
    md.querySelectorAll("pre > code").forEach(function(code, id) {
      let language = preLngList[id];
      if (language) {
        //Changing parent for removing padding and grey color
        code.parentNode.className += " hljs";
        //code.parentNode.style.padding=0;
        code.className += " " + language;
        hljs.highlightBlock(code);
      }
    });
  }

  function withDomReady(fn) {
    // If we're early to the party
    document.addEventListener("DOMContentLoaded", fn);
    // If late; I mean on time.
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      fn();
    }
  }

  withDomReady(function() {
    // head CSS injection by link tag (I can't make it work otherwise)
    const highlightCss = document.createElement("link");
    highlightCss.rel = "stylesheet";
    highlightCss.href =
      "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css";
    document.head.appendChild(highlightCss);

    const extraStyles = document.createElement("style");
    extraStyles.innerHTML = `
        .window-wrapper.js-tab-parent .hljs {
            background: #f8f8f8;
            /* Keeping initial scrollbar */
            overflow-x: initial;
        }
    `;
    document.head.appendChild(extraStyles);

    var observer = new MutationObserver(function(mutations) {
      for (let mutation of mutations) {
        if (mutation.type == "childList") {
          if (mutation.target.className === "js-fill-card-detail-desc") {
            // card description
            let md = mutation.target.querySelector(".current");
            if (md) {
              highlight(md);
            }
          }
          if (mutation.target.classList.contains("mod-card-back")) {
            // card comment
            let md = mutation.target.querySelector(".current-comment");
            if (md) {
              highlight(md);
            }
          }
          if (mutation.target.classList.contains("current")) {
            highlight(mutation.target);
          }
          if (mutation.target.classList.contains("mod-comment-type")) {
            let md = mutation.target.querySelector(".current-comment");
            if (md) {
              highlight(md);
            }
          }
        }
      }
    });
    observer.observe(document.querySelector(".window-wrapper.js-tab-parent"), {
      childList: true,
      subtree: true
    });
  });
})();

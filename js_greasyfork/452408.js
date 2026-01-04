// ==UserScript==
// @name         Danbooru Tags Copier
// @namespace    ruocaled
// @version      0.11
// @description  1-Click copies Danbooru, deep Danbooru tags. Useful as AI drawing prompts.
// @author       You
// @match        https://danbooru.donmai.us/posts/*
// @match        http://dev.kanotype.net:8003/deepdanbooru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452408/Danbooru%20Tags%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/452408/Danbooru%20Tags%20Copier.meta.js
// ==/UserScript==
(function() {
  const copy = (hostname) => {
    if (hostname === "danbooru.donmai.us") {
      let tags = $(`.search-tag`).map((i, el) => $(el).text()).toArray().filter(tag => !tag.match(/hand|nail|finger|wrist/)).join(" ").toString();
      if (tags) {
        navigator.clipboard.writeText(tags);
      }
      return tags;
    } else {
      let tags = $(".col-md-auto tr a").map((i, el) => {
        return {
          tag: $(el).text().replace(/_/g, " "),
          score: parseFloat($(el).parent().next().text())
        };
      }).toArray().sort((a, b) => (b.score - a.score)).filter(el => el.score > 0.6 && !el.tag.match(/rating:/i)).map(el => el.tag).join(",");

      return tags;
    }

  };

  const addBtns = (hostname) => {
    if (hostname === "danbooru.donmai.us") {
      $("#post-options ul").append(`<li id="post-option-copy-tags">
          <a class="copy-tags-link"  href="#">Copy tags</a>
        </li>`);
      $("#post-option-copy-tags").click(() => {
        const tags = copy(hostname);
        $("#content").prepend(`<div class="notice notice-small post-notice">
        Tags have been copied to your clipboard. （<span style="color:var(--link-color)">${tags}</span>）
    </div>`);
      });
    } else {
$('img').after(`<div class="col-sm"></div><a class="copy-tags-link"  href="#">Copy tags</a></div>`);
      $(".copy-tags-link").click(() => {
        const tags = copy(hostname);
        $('.copy-tags-link').after(`<div>Sorted tags: <span style="color:blueviolet">${tags}</a> </div>`)
      });
    }

  };

  addBtns(location.hostname);

  // Your code here...
})();
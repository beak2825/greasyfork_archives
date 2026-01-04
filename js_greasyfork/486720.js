// ==UserScript==
// @name        Catppuccin Userstyles Helper
// @description Make reviewing new userstyles for catppuccin/userstyles a little bit easier.
// @namespace   https://github.com/uncenter/ctp-userstyles-helper
// @match       https://github.com/catppuccin/userstyles/pull/*
// @grant       none
// @homepageURL https://github.com/uncenter/ctp-userstyles-helper
// @version     0.1.1
// @author      uncenter
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486720/Catppuccin%20Userstyles%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486720/Catppuccin%20Userstyles%20Helper.meta.js
// ==/UserScript==

async function getPRDetails() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/catppuccin/userstyles/pulls/${new URL(location.href).pathname.split("/").at(4)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    const data = await res.json();

    return {
      repo: data.head.repo.full_name,
      branch: data.head.ref,
    };
  } catch {
    throw new Error(
      "Something went wrong while trying to fetch pull request details.",
    );
  }
}

(async () => {
  const title = document.querySelector(
    ".gh-header-title .js-issue-title",
  ).textContent;
  if (!title.endsWith(": init")) {
    return;
  }
  const details = await getPRDetails();
  const sidebar = document.querySelector(".Layout-sidebar > div");

  const filesURL = `https://github.com/${details.repo}/raw/${details.branch}/styles/${/feat\(([\w-]+)\)/.exec(title)[1]}/`;

  const actions = document.createElement("div");
  actions.classList.add("discussion-sidebar-item");
  actions.innerHTML = `
<div class="discussion-sidebar-heading text-bold">Actions</div>
<div class="d-flex" style="flex-direction: column;">
	<a href="${filesURL + "catppuccin.user.css"}">Install with Stylus</a>
	<a href="${filesURL + "preview.webp"}">Catwalk Preview Image</a>
</div>
`;
  sidebar.append(actions);
})();
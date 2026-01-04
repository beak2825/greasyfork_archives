// ==UserScript==
// @name        AniList Delete Button on List Items
// @license     MIT
// @namespace   rtonne
// @match       https://anilist.co/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @version     1.1
// @author      Rtonne
// @description Adds a delete button to all items on lists
// @grant       GM.addStyle
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/493733/AniList%20Delete%20Button%20on%20List%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/493733/AniList%20Delete%20Button%20on%20List%20Items.meta.js
// ==/UserScript==

(async () => {
  const inplace =
    "autoconfirm" ===
    GM.registerMenuCommand(
      (await GM.getValue("autoconfirm", false))
        ? "☑ Auto-confirm Deletion"
        : "☐ Auto-confirm Deletion",
      toggleAutoConfirm,
      { id: "autoconfirm", autoClose: false }
    );
  async function toggleAutoConfirm() {
    const new_value = !(await GM.getValue("autoconfirm", false));
    await GM.setValue("autoconfirm", new_value);
    if (!inplace) {
      GM.unregisterMenuCommand("autoconfirm");
    }
    GM.registerMenuCommand(
      new_value ? "☑ Auto-confirm Deletion" : "☐ Auto-confirm Deletion",
      toggleAutoConfirm,
      { id: "autoconfirm", autoClose: false }
    );
  }
})();

GM.addStyle(`
    .rtonne-anilist-listitem-delete-button {
      background: rgb(var(--color-red)) !important;
    }
    .entry-card .rtonne-anilist-listitem-delete-button {
      top: 42px !important;
    }
    .medialist.table.compact .entry .cover {
      display: flex !important;
      max-width: 82px !important;
      min-width: 82px;
      gap: 2px;
      margin-inline: -41px;
    }
    .medialist.table.compact .entry:not(:hover) .cover .image {
      display: none;
    }
    .medialist.table:not(.compact) .entry:hover .cover {
      display: flex !important;
      max-width: 102px !important;
      min-width: 102px;
      gap: 2px;
    }
    @media (max-width: 760px) {
      .medialist.table:not(.compact) .entry:hover .cover {
        max-width: 82px !important;
        min-width: 82px;
      }
      .medialist.table:not(.compact) .entry:hover {
        padding-left: 97px;
      }
    }
    body.rtonne-anilist-modal-hidden .list-editor-wrap,
    body.rtonne-anilist-messagebox-hidden .el-message-box {
      display: none !important;
    }
  `);

const trash_svg = `
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-ellipsis-h fa-w-16 fa-lg">
      <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
      <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
    </svg>
  `;

let current_url = null;

const url_regex =
  /^https:\/\/anilist.co\/user\/.+\/((animelist)|(mangalist))(\/.*)?$/;

// Using observer to run script whenever the body changes
// because anilist doesn't reload when changing page
const observer = new MutationObserver(async () => {
  try {
    let new_url = window.location.href;

    // Because anilist doesn't reload on changing url
    // we have to allow the whole website and check here if we are in a list
    if (!url_regex.test(new_url)) {
      return;
    }

    const elements = await waitForElements(document, ".entry, .entry-card");

    // If the url is different we are in a different playlist
    // Or if the playlist length is different, we loaded more of the same playlist
    if (
      current_url === new_url &&
      elements.length ===
        document.querySelectorAll(".rtonne-anilist-listitem-delete-button")
          .length
    ) {
      return;
    }

    current_url = new_url;

    // If we have actions in the banner, it's not our list and can't edit it
    if (
      document.querySelector(".banner-content .actions").children.length > 0
    ) {
      return;
    }

    elements.forEach((parent) => {
      const element = parent.querySelector(".cover");
      const is_card = parent.classList.contains("entry-card");

      // We return if the item already has a delete button so
      // there isn't an infinite loop where adding a button triggers
      // the observer which adds more buttons
      if (element.querySelector(".rtonne-anilist-listitem-delete-button"))
        return;

      const button = document.createElement("div");
      button.className = "rtonne-anilist-listitem-delete-button edit";
      button.innerHTML = trash_svg;
      element.querySelector(".edit").after(button);

      button.onclick = async () => {
        const autoconfirm = await GM.getValue("autoconfirm", false);
        if (autoconfirm) {
          document.body.classList.add("rtonne-anilist-messagebox-hidden");
        }
        document.body.classList.add("rtonne-anilist-modal-hidden");

        const edit_button = element.querySelector(
          ".edit:not(.rtonne-anilist-listitem-delete-button)"
        );
        edit_button.click();

        const [dialog_delete_button] = await waitForElements(
          document,
          ".list-editor-wrap .delete-btn"
        );
        dialog_delete_button.click();

        const [confirm_ok_button] = await waitForElements(
          document,
          ".el-message-box .el-button--small.el-button--primary"
        );
        // I need to wait for the confirm cancel button as well so it all load properly, somehow
        await waitForElements(
          document,
          ".el-message-box .el-button--small:not(.el-button--primary)"
        );

        if (autoconfirm) {
          const fading_in_confirm_message_container = document.querySelector(
            ".el-message-box__wrapper.msgbox-fad-enter-active"
          );
          // Wait until message container finished fading in
          await waitForElementToBeRemovedOrHidden(
            fading_in_confirm_message_container
          );

          confirm_ok_button.click();

          const new_confirm_cancel_button = document.querySelector(
            ".list-editor-wrap .delete-btn"
          );
          await waitForElementToBeRemovedOrHidden(new_confirm_cancel_button);

          document.body.classList.remove("rtonne-anilist-messagebox-hidden");
          document.body.classList.remove("rtonne-anilist-modal-hidden");
        } else {
          const confirm_message_container = document.querySelector(
            ".el-message-box__wrapper"
          );
          await waitForElementToBeRemovedOrHidden(confirm_message_container);

          const dialog_close_button = document.querySelector(
            ".list-editor-wrap button:has(> i.el-icon-close)"
          );
          dialog_close_button.click();

          document.body.classList.remove("rtonne-anilist-modal-hidden");
        }
      };
    });
  } catch (err) {
    console.log(err);
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
// This function is required because elements take a while to appear sometimes
function waitForElements(node, selector) {
  return new Promise((resolve) => {
    if (node.querySelector(selector)) {
      return resolve(node.querySelectorAll(selector));
    }

    const observer = new MutationObserver(() => {
      if (node.querySelector(selector)) {
        observer.disconnect();
        resolve(node.querySelectorAll(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
function waitForElementToBeRemovedOrHidden(element) {
  return new Promise((resolve) => {
    if (!document.contains(element) || element.style.display === "none") {
      return resolve(null);
    }

    const observer = new MutationObserver(() => {
      if (!document.contains(element) || element.style.display === "none") {
        observer.disconnect();
        resolve(null);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributeOldValue: true,
      attributeFilter: ["style"],
    });
  });
}

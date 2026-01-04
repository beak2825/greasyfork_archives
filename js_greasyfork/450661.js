// ==UserScript==
// @name          RED/OPS: Remove torrent groups from main collage page, or torrent group page.
// @description Instead of going to a separate page (Manage Torrents), which triggers a reload after each deletion, this script allows you to remove torrents from the main collage page, or torrent group page, sans full page reload.
// @author         _
// @version        0.5
// @match          https://redacted.ch/collages.php?*id=*
// @match          https://redacted.ch/torrents.php?id=*
// @match          https://orpheus.network/collages.php?*id=*
// @match          https://orpheus.network/torrents.php?id=*
// @run-at         document-end
// @namespace https://greasyfork.org/users/225448
// @downloadURL https://update.greasyfork.org/scripts/450661/REDOPS%3A%20Remove%20torrent%20groups%20from%20main%20collage%20page%2C%20or%20torrent%20group%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/450661/REDOPS%3A%20Remove%20torrent%20groups%20from%20main%20collage%20page%2C%20or%20torrent%20group%20page.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  const auth = document.getElementById("nav_logout").firstElementChild.href.match(/auth=([a-z0-9]+)/i)[1];

  if (window.document.URL.includes("collages.php")) {
    const collageID = new URL(window.location).searchParams.get("id");
    const response = await fetch(`/collages.php?action=manage&collageid=${collageID}`);
    if (response.status != 200) return;

    const removeFromCollage = (e) => {
      const groupID = e.target.id;
      const discog = document.querySelector(`tr#group_${groupID}`);
      const cover = document.querySelector(`.image_group_${groupID}`);
      discog.style.display = "none";
      if (cover != null) {
        cover.style.display = "none";
      }
      let sibling = discog.nextElementSibling;
      sibling.style.display = "none";
      while (sibling) {
        if (sibling.matches(".discog")) break;
        sibling.style.display = "none";
        sibling = sibling.nextElementSibling;
      }
      fetch("/collages.php", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `action=manage_handle&auth=${auth}&collageid=${collageID}&groupid=${groupID}&submit=Remove`
      });
    };

    const groups = document.querySelectorAll("tr.group.discog");
    groups.forEach((group) => {
      const groupID = group.id.replace("group_", "");
      let bookmarkLink = group.querySelector(".add_bookmark");
      if (bookmarkLink === null) {
        bookmarkLink = group.querySelector(".remove_bookmark");
      }
      bookmarkLink.insertAdjacentHTML(
        "beforebegin",
        `<span class="float_right"><a style="margin-left: 3px" href="javascript:;" id="${groupID}" class="brackets">Remove</a></span>`
      );
      document.getElementById(groupID).addEventListener("click", removeFromCollage);
    });
  } else {
    const groupID = new URL(window.location).searchParams.get("id");

    const removeFromCollage = (e) => {
      const collageDesc = e.target.closest('td').innerText.split("\n")[1]
      if (confirm(`Remove this torrent from collage ${collageDesc}?`) != true) return;
      const collageID = e.target.id;
      const collageRow = e.target.closest('tr');
      collageRow.style.display = "none";
      fetch("/collages.php", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `action=manage_handle&auth=${auth}&collageid=${collageID}&groupid=${groupID}&submit=Remove`
      });
    };

    const collages = document.getElementById("collages");
    const personal_collages = document.getElementById("personal_collages");
    let combined = []
    if (collages) {
      combined = [...collages.querySelectorAll('tr')].slice(1);
    }
    const nonperslen = combined.length;
    if (personal_collages) {
      combined = [...combined, ...[...personal_collages.querySelectorAll('tr')].slice(1)];
    }
    if (combined.length == 0) return;
    combined.forEach(async (row, idx) => {
      let collageID = row.querySelector('a').href.split("id=")[1]
      if (idx >= nonperslen) {
        // personal collage, check if it is ours
        let response = await fetch(`/collages.php?action=manage&collageid=${collageID}`);
        if (response.status != 200) return;
      }
      row.firstElementChild.insertAdjacentHTML(
        "afterbegin",
        `<span class="float_right"><a style="margin-left: 3px" href="javascript:;" id="${collageID}" class="brackets">Remove</a></span>`
      );
      document.getElementById(collageID).addEventListener("click", removeFromCollage);
    });
  }
})();

// ==UserScript==
// @name         MyAnimeList Auto-Confirm updated entry
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.2.2
// @description  Automatically goes back to anime page after successfully updating an entry
// @author       PurplePinapples
// @license      WTFPL
// @run-at       document-end
// @match        https://myanimelist.net/editlist.php?type=anime&id=*
// @match        https://myanimelist.net/panel.php?go=add&selected_series_id=*
// @match        https://myanimelist.net/panel.php?go=editmanga&id=*
// @match        https://myanimelist.net/ownlist/anime/*/edit
// @match        https://myanimelist.net/ownlist/manga/*/edit
// @match        https://myanimelist.net/ownlist/anime/*/delete
// @match        https://myanimelist.net/ownlist/manga/*/delete
// @match        https://myanimelist.net/panel.php?go=addmanga&selected_manga_id=*
// @match        https://myanimelist.net/ownlist/anime/add?selected_series_id=*
// @match        https://myanimelist.net/ownlist/manga/add?selected_manga_id=*
// @match        https://myanimelist.net/dbchanges.php?aid=*
// @match        https://myanimelist.net/dbchanges.php?mid=*
// @match        https://myanimelist.net/myfriends.php?go=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37961/MyAnimeList%20Auto-Confirm%20updated%20entry.user.js
// @updateURL https://update.greasyfork.org/scripts/37961/MyAnimeList%20Auto-Confirm%20updated%20entry.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (
    $("#content > .goodresult > strong:contains('Successfully')").length > 0
  ) {
    location.href = $("#content > .goodresult > a:last-child").attr("href");
  }
  // structure for DB pages is slightly different
  if (
    location.href.indexOf("dbchanges") !== -1 &&
    $(".goodresult:contains('Successfully')").length > 0
  ) {
    location.href = $(
      ".goodresult:contains('Successfully') > a:last-child"
    ).attr("href");
  }

  // structure for friend add page is slightly different as well
  // includes a couple of differnet pages, adding/removing friends, approving/denying requests
  if (location.href.indexOf("myfriends.php") !== -1) {
    // do this more manually, since the 'successfully' text can be upper/lowercase
    const result = $(".goodresult");
    if (result.length > 0) {
      if (result.text().toLowerCase().indexOf("successfully") !== -1) {
        location.href = result.find("a[href*='profile']").attr("href");
      }
    }
  }
})();
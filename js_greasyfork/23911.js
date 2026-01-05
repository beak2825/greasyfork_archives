// ==UserScript==
// @name          Crunchyroll Queue Fixer
// @namespace     http://myanimelist.net/profile/mysticflute
// @description   fixes for crunchyroll queue page. put shows with new episodes at top; always show "no image" icon on shows with no new episodes.
// @match         https://www.crunchyroll.com/home/queue*
// @version       0.6
// @copyright     2013
// @downloadURL https://update.greasyfork.org/scripts/23911/Crunchyroll%20Queue%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23911/Crunchyroll%20Queue%20Fixer.meta.js
// ==/UserScript==

(function() {
  // options
  var rearrange = true;
  var fixIcon = true;
  var minPercentage = 70;
  // var noImageUrl = "http://static.ak.crunchyroll.com/i/coming_soon_beta_wide.jpg";
  var noImageUrl = "http://static.ak.crunchyroll.com/i/no_image_beta_wide.jpg";

  // check querystring for "noarrange"
  if (window.location.search.indexOf("?no") > -1) {
    rearrange = false;
  }

  // actual work
  var queued = document.querySelectorAll("#main_content li.queue-item");
  var toMove = [];

  for (var i = 0, len = queued.length; i < len; i++) {
    var item = queued[i];
    var img = item.querySelector("img");
    var progress = item.querySelector(".episode-progress[style]");

    if (!progress) continue;

    var percentage = parseInt(progress.style.width, 10);

    if (fixIcon && img && img.src !== noImageUrl && percentage > minPercentage) {
      img.src = noImageUrl;
      progress.style.backgroundColor = "#ccc";
    }

    var isPlaceholder = (percentage === 0 && (img.src === noImageUrl));

    if (rearrange && !isPlaceholder && percentage < minPercentage && img.src !== noImageUrl) {
      toMove.push(item);
    }
  }

  if (rearrange) {
    toMove.reverse();
    for (var i = 0, len = toMove.length; i < len; i++) {
      var parent = toMove[i].parentNode;
      parent.insertBefore(toMove[i], parent.firstChild);
    }
  }
})();

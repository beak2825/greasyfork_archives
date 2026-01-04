// ==UserScript==
// @name        uncover
// @namespace   roseofdiscord.com
// @author      ArchaicEX
// @description avoids nsfw shit
// @include     http://knowyourmeme.com/*photos*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/35478/uncover.user.js
// @updateURL https://update.greasyfork.org/scripts/35478/uncover.meta.js
// ==/UserScript==

function uncoverPhotos(items) {
    console.log(uncovered);
    if (bricks.length > uncovered) {
        for (var i = 0; i < items.length; i ++) {
            var img = items[i].element.firstElementChild.firstElementChild;
            if (img.classList.contains('img-nsfw') || img.classList.contains('img-spoiler')) {
                img.height = img.dataset.originalHeight;
                img.src = img.dataset.originalImageUrl;
                img.dataset.src = img.dataset.originalImageUrl;
            }
        }
        uncovered += items.length;
        masonry.layout();
    }
}

function updateMasonry(records, observer) {
	console.log(records);
    masonry = Masonry.data(gallery);
    masonry.on('layoutComplete', uncoverPhotos);
	masonry.layout();
    observer.disconnect();
}

var uncovered = 0;
var gallery = document.getElementById('photo_gallery');
var bricks = gallery.getElementsByClassName('item');
var masonry = Masonry.data(gallery);
if (masonry === undefined) {
    var observer = new MutationObserver(updateMasonry);
    if (bricks[0] !== undefined) {
        observer.observe(bricks[0].firstElementChild.firstElementChild, {attributes: true});
    }
}
else {
    masonry.on('layoutComplete', uncoverPhotos);
	masonry.layout();
}
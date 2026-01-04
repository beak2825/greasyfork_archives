// ==UserScript==
// @name         mangadistrict
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  章节详情页显示为画廊
// @author       You
// @license      MIT
// @match        https://mangadistrict.com/title/*/chapter-*/
// @icon         https://mangadistrict.com/wp-content/uploads/2021/02/cropped-Copie-de-Copie-de-MANGADISTRICT_5-270x270.png
// @require      https://update.greasyfork.org/scripts/545309/1646697/GM_Gallery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545307/mangadistrict.user.js
// @updateURL https://update.greasyfork.org/scripts/545307/mangadistrict.meta.js
// ==/UserScript==

(function() {
    new window.GM_Gallery({
        getGallery() {
            const exclude = ['https://cdn.mangadistrict.com/assets/publication/media/image/001.jpg'];
            const gallery = Array.from(document.querySelectorAll('.page-break > img'))
            .map((img) => img.src)
            .filter((src) => !exclude.includes(src));
            return gallery
        }
    });
})();
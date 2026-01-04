// ==UserScript==
// @name         ExOldButtons
// @author       Hauffen
// @description  Restore legacy buttons for E/Ex
// @version      1.0
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/380767/ExOldButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/380767/ExOldButtons.meta.js
// ==/UserScript==

(function() {
    var s = `<style>.ct2 {
    background-image: url(https://ehgt.org/g/c/doujinshi.png) !important;
    background-repeat:no-repeat;
}

.ct3 {
    background-image: url(https://ehgt.org/g/c/manga.png) !important;
    background-repeat:no-repeat;
}

.ct4 {
    background-image: url(https://ehgt.org/g/c/artistcg.png) !important;
    background-repeat:no-repeat;
}

.ct5 {
    background-image: url(https://ehgt.org/g/c/gamecg.png) !important;
    background-repeat:no-repeat;
}

.cta {
    background-image: url(https://ehgt.org/g/c/western.png) !important;
    background-repeat:no-repeat;
}

.ct9 {
    background-image: url(https://ehgt.org/g/c/non-h.png) !important;
    background-repeat:no-repeat;
}

.ct6 {
    background-image: url(https://ehgt.org/g/c/imageset.png) !important;
    background-repeat:no-repeat;
}

.ct7 {
    background-image: url(https://ehgt.org/g/c/cosplay.png) !important;
    background-repeat:no-repeat;
}

.ct8 {
    background-image: url(https://ehgt.org/g/c/asianporn.png) !important;
    background-repeat:no-repeat;
}

.ct1 {
    background-image: url(https://ehgt.org/g/c/misc.png) !important;
    background-repeat:no-repeat;
}

.cs {
    color: transparent !important;
    border-radius: 10px !important;
    text-shadow:none !important;
}

.cn {
    height: 20px !important;
    width: 98px !important;
    color: transparent !important;
    border-radius:10px !important;
    text-shadow:none !important;
}

.gl5t>div:nth-child(1)>div:nth-child(1) {
    width:98px;
    background-repeat:no-repeat;
}</style>`;

    $(s).appendTo("head");
})();
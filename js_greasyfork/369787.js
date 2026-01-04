// ==UserScript==
// @name          Google Image Info (Size + Url)
// @description   Show image sizes and target URL's directly on all Google Images.
// @author        Kirsch
// @namespace     https://greasyfork.org/users/28373
// @version       0.3.0
// @license       GPL: http://www.gnu.org/copyleft/gpl.html
// @include       *.google.*/*tbm=isch*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @require       https://cdn.rawgit.com/eclecto/jQuery-onMutate/79bbb2b8caccabfc9b9ade046fe63f15f593fef6/src/jquery.onmutate.min.js
// @grant         GM_log
// @icon          https://www.google.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/369787/Google%20Image%20Info%20%28Size%20%2B%20Url%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369787/Google%20Image%20Info%20%28Size%20%2B%20Url%29.meta.js
// ==/UserScript==

function ImageInfo ($showURL) {
    $showURL.each(function () {
        const $showURL = $(this)

        $showURL.replace($('.rg_ilmbg').attr('class', 'rg_anbg'))

    })
}

$.onCreate('a.rg_l', ImageInfo, true)
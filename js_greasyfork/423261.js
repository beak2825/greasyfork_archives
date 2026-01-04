// ==UserScript==
// @name        EXR - Remove Inline Styles
// @namespace   adustyspectacle
// @description Adds interface to comments to easily insert formatting options in HTML
// @include     http://*exiledrebelscanlations.com/*
// @include     https://*exiledrebelscanlations.com/*
// @history     1.0 - Initial release
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423261/EXR%20-%20Remove%20Inline%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/423261/EXR%20-%20Remove%20Inline%20Styles.meta.js
// ==/UserScript==

(function($) {
    $("p").removeAttr("style");
    $("span").removeAttr("style");
})(jQuery);
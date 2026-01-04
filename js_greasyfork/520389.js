// ==UserScript==
// @name         Glowfic dark mode
// @namespace    https://greasyfork.org/en/users/1409385
// @version      2024-12-10
// @license MIT
// @description  dark mode on glowfic.com
// @author       laskdfhlsajdfl
// @match        https://glowfic.com/posts/*
// @match        https://www.glowfic.com/posts/*
// @match        https://www.projectlawful.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glowfic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520389/Glowfic%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520389/Glowfic%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addStyle(styleString) {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    }
    addStyle(`
body {
    background-color: black
}

#logo {
    background-color: #333333
}

#header {
    background-color: #222222;
    color: #bbbbbb;
}

.flash.breadcrumbs {
    background-color: #181818;
    color: #eeeeee
}

.flash.error {
    background-color: #111111;
    color: #eeeeee
}

.post-expander {
    background-color: #222222;
    color: #999999
}

#content {
    background-color: #080808
}

.content-header {
   background-color: #151515;
}

.post-subheader {
    background-color: #1b1b1b;
    color: #aaaaaa
}

.post-navheader {
    background-color: #222222;
}

.post-container {
    background-color: #111111 !important
  }

.post-content {
    color: #dddddd
}

.post-icon {
    background-color: #151515
}

.post-info-text {
    background-color: #101010
}

.post-character {
    background-color: #222222
}

.post-screenname {
    background-color: #1b1b1b;
    color: #aaaaaa
}

.post-author {
    background-color: #181818
}

.paginator {
    background-color: #181818;
    color: #eeeeee
}

.previous_page.disabled {
    color: #888888
}

.next_page.disabled {
    color: #888888
}

.pagination a:visited {
    color: #bbbbbb
}

.post-footer {
    color: #777777
}
`)

})();
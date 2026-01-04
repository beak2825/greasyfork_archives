/* ==UserStyle==
// @name        GNU Pascal Cringe Removal
// @version     1.0
// @description Removes ocular assault from the GNU Pascal website.
// @author      base2taiji
// @match       *://*.gnu-pascal.de/*
// @grant       none
// @license     MIT
@namespace https://greasyfork.org/users/1330715
@downloadURL https://update.greasyfork.org/scripts/500102/GNU%20Pascal%20Cringe%20Removal.user.css
@updateURL https://update.greasyfork.org/scripts/500102/GNU%20Pascal%20Cringe%20Removal.meta.css
==/UserStyle== */

body, td {
    background: none #000;
    color: #fff;
}

img[alt="[Gnu and Blaise Pascal]"] {
    filter: invert(1);
}

a {
    color: skyblue;
}

a:hover {
    color: deepskyblue;
}